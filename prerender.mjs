/* Michael's Corner, the pre-render step.
   Run: node prerender.mjs [route ...]

   Why this file exists
   --------------------
   app.js is the ONLY source of page content for the eight top-level routes. The .html
   files are not shells: each one ships a real, fully rendered <main> so that a visitor
   and a crawler get the page without waiting for JS, and so .rv (opacity:0 until JS)
   never hides the hero. That means an edit to app.js changes NOTHING anyone sees until
   this script runs and writes the rendered markup back into the files.

   This step used to exist, was never committed, and the repo spent a while in a state
   where app.js and the .html files could silently disagree. Hence: committed, and
   idempotent by design. Running it on an unchanged app.js must produce a zero-line
   diff. If it does not, this script is wrong, not the pages.

   How it works
   ------------
   app.js's currentRoute() reads window.__PRERENDER_ROUTE before falling back to
   location.pathname, precisely so a file:// load (which has no real path) can be told
   which route to render. We set it in an init script, load the file, let the reveal
   IntersectionObserver settle, then copy <main> back into the file.

   The viewport is PINNED. The reveal observer adds .in only to elements in view, so the
   set of pre-revealed nodes is a function of viewport height. A pinned viewport is what
   makes the output stable between runs.
*/

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const ROOT = dirname(fileURLToPath(import.meta.url));

/* Playwright is not a dependency of this repo (there is no package.json on purpose).
   Borrow it from a sibling project, the same way qa/audit.mjs does. */
const PW_HOSTS = [
  "/Users/michaelflorianrvltdigital/Claude Helpers/Mission Control",
  "/Users/michaelflorianrvltdigital/Claude Helpers/maps-leads",
];
let chromium = null;
for (const host of PW_HOSTS) {
  try {
    const require = createRequire(join(host, "package.json"));
    ({ chromium } = require("playwright"));
    break;
  } catch { /* try the next host */ }
}
if (!chromium) {
  console.error("playwright not found. Looked in:\n  " + PW_HOSTS.join("\n  "));
  process.exit(1);
}

/* Must match ROUTE_FILE in app.js. */
const ROUTE_FILE = {
  home: "index.html", start: "start.html", library: "library.html", tools: "tools.html",
  bill: "bill.html", channel: "channel.html", about: "about.html", kit: "kit.html",
};

const VIEWPORT = { width: 1440, height: 900 };   // pinned, see header note
const SETTLE_MS = 700;                            // reveal observer + font swap

const only = process.argv.slice(2);
const routes = only.length ? only : Object.keys(ROUTE_FILE);
for (const r of routes) {
  if (!ROUTE_FILE[r]) { console.error(`unknown route: ${r}`); process.exit(1); }
}

/* Replace the <main id="main"> ... </main> block, and the handful of head fields that
   applyMeta() sets at runtime, so the served file already says what JS would say. */
function splice(html, mainHTML, meta) {
  const m = html.match(/(<main id="main"[^>]*>)([\s\S]*?)(<\/main>)/);
  if (!m) throw new Error("no <main id=\"main\"> block found");
  let out = html.slice(0, m.index) + m[1] + mainHTML + m[3] + html.slice(m.index + m[0].length);

  const setTag = (re, replacement) => {
    if (re.test(out)) out = out.replace(re, replacement);
    else throw new Error(`head tag not found: ${re}`);
  };
  setTag(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`);
  setTag(/(<meta name="description" content=")[^"]*(")/, `$1${meta.desc}$2`);
  setTag(/(<meta property="og:title" content=")[^"]*(")/, `$1${meta.ogTitle}$2`);
  setTag(/(<meta property="og:description" content=")[^"]*(")/, `$1${meta.desc}$2`);
  setTag(/(<link rel="canonical" href=")[^"]*(")/, `$1${meta.canonical}$2`);
  setTag(/(<meta property="og:url" content=")[^"]*(")/, `$1${meta.ogUrl}$2`);
  return out;
}

/* Replace the one JSON-LD block whose @type matches what app.js built, leaving every other
   block on the page untouched. */
function spliceJsonLd(html, obj) {
  const type = obj["@type"];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    let parsed;
    try { parsed = JSON.parse(m[1]); } catch { continue; }
    if (parsed["@type"] !== type) continue;
    return html.slice(0, m.index)
      + `<script type="application/ld+json">${JSON.stringify(obj)}</script>`
      + html.slice(m.index + m[0].length);
  }
  throw new Error(`no JSON-LD block of @type ${type} to replace`);
}

const browser = await chromium.launch();
let changed = 0;

for (const route of routes) {
  const file = join(ROOT, ROUTE_FILE[route]);
  /* A fresh page per route: addInitScript stacks, so a reused page would keep the
     previous route's __PRERENDER_ROUTE assignment and render the wrong page. */
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.addInitScript((r) => { window.__PRERENDER_ROUTE = r; }, route);
  await page.goto(pathToFileURL(file).href, { waitUntil: "networkidle" });
  await page.waitForFunction(() => {
    const m = document.getElementById("main");
    return m && m.children.length > 0;
  }, null, { timeout: 10000 });
  await page.waitForTimeout(SETTLE_MS);

  const { mainHTML, meta, jsonld } = await page.evaluate((r) => {
    const attr = (sel, a) => { const e = document.querySelector(sel); return e ? e.getAttribute(a) : ""; };
    const build = window.__PAGE_JSONLD && window.__PAGE_JSONLD[r];
    return {
      mainHTML: document.getElementById("main").innerHTML,
      jsonld: build ? build() : null,
      meta: {
        title: document.title,
        ogTitle: attr('meta[property="og:title"]', "content"),
        desc: attr('meta[name="description"]', "content"),
        canonical: attr('link[rel="canonical"]', "href"),
        ogUrl: attr('meta[property="og:url"]', "content"),
      },
    };
  }, route);

  const before = readFileSync(file, "utf8");
  let after = splice(before, mainHTML, meta);
  if (jsonld) after = spliceJsonLd(after, jsonld);
  if (after !== before) { writeFileSync(file, after); changed++; }
  console.log(`${after !== before ? "written" : "  same "}  ${ROUTE_FILE[route]}  (${mainHTML.length} bytes of <main>)`);

  await page.close();
}

await browser.close();
console.log(`\n${changed} file(s) changed, ${routes.length - changed} already current.`);
