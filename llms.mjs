/* Michael's Corner, llms-full.txt generator.
   Run: node llms.mjs   (after build.mjs and prerender.mjs)

   llms-full.txt is the plain text of every page, served for assistants to read. It used to be
   assembled by hand, so it drifted badly: it still described a library that had been replaced,
   still used nav labels the site had renamed, and had leaked the text of an HTML comment into
   the body because whoever generated it stripped tags but not comments.

   Every page is a real file on disk with its content pre-rendered into it, so no browser is
   needed here. Read the file, drop comments, script and style, unwrap the tags, tidy the space. */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PACKS } from "./data/prompts.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const SITE = "https://michaels-corner.netlify.app/";
const TODAY = "2026-09-09";

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  "#8217": "’", "#8216": "‘", "#8220": "“", "#8221": "”",
  "#8594": "→", "#8599": "↗", "#39": "'", "#8211": "–",
};

function pageText(file) {
  let h = readFileSync(join(ROOT, file), "utf8");
  h = h.replace(/<!--[\s\S]*?-->/g, " ");                       // comments, the old leak
  h = h.replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, " ");   // non-text
  const title = (h.match(/<title>([\s\S]*?)<\/title>/) || [, ""])[1].trim();
  const body = (h.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, h])[1];
  let t = body
    .replace(/<\/(p|div|section|article|li|h[1-6]|tr|footer|header|main)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&([a-z]+|#\d+);/gi, (m, e) => ENTITIES[e.toLowerCase()] ?? m);
  t = t.split("\n").map(l => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
  return { title, text: t };
}

const TOP = [
  ["index.html", ""], ["start.html", "start"], ["library.html", "library"],
  ["tools.html", "tools"], ["bill.html", "bill"], ["channel.html", "channel"],
  ["about.html", "about"], ["kit.html", "kit"],
];
const TOOLS = readdirSync(join(ROOT, "tools")).filter(f => f.endsWith(".html")).sort()
  .map(f => [`tools/${f}`, `tools/${f.replace(/\.html$/, "")}`]);
const PACKPAGES = PACKS.map(p => [`packs/${p.id}.html`, `packs/${p.id}`]);
const PROMPTPAGES = PACKS.flatMap(p => p.prompts.map(pr => [`prompts/${pr.id}.html`, `prompts/${pr.id}`]));

const all = [...TOP, ...TOOLS, ...PACKPAGES, ...PROMPTPAGES];

let out = `# Michael's Corner, full text\n\n`
  + `Every page of michaels-corner.netlify.app as plain text. Generated ${TODAY} by llms.mjs.\n\n`;

for (const [file, path] of all) {
  const { title, text } = pageText(file);
  out += `\n---\n\n## ${title.replace(/ \/ Michael's Corner$/, "")}\nURL: ${SITE}${path}\n\n${text}\n`;
}

writeFileSync(join(ROOT, "llms-full.txt"), out);
console.log(`llms-full.txt written: ${all.length} pages, ${(out.length / 1024).toFixed(0)} KB`);
