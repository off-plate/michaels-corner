/* Michael's Corner v2, library build script.
   Run: node build.mjs
   Reads data/prompts.mjs and writes, idempotently:
     library.html                 the card-catalog index (drawer rows)
     packs/<id>.html    x8         the opened dossier (ruled ledger)
     prompts/<id>.html  x64        the spec sheet (terminal specimen + copy)
     data/prompts-index.js         window.MC2DATA.promptIndex for client search
   Shared chrome is copied verbatim from SPEC.md. No em dashes. Relative paths only. */

import { PACKS, UPDATED } from "./data/prompts.mjs";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(fileURLToPath(import.meta.url));

/* ---------- helpers ---------- */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/* pack file number, 1-based, zero padded: PACK/01 .. PACK/08 */
const packNo = (i) => String(i + 1).padStart(2, "0");
/* prompt file number within its pack, 1-based, zero padded */
const promptNo = (i) => String(i + 1).padStart(2, "0");

const findPack = (id) => PACKS.find((p) => p.prompts.some((x) => x.id === id));
const findPrompt = (id) => {
  for (const p of PACKS) { const x = p.prompts.find((q) => q.id === id); if (x) return { pack: p, prompt: x }; }
  return null;
};
/* list the [bracket] fill tokens in a prompt, de-duplicated, in order of first appearance */
function fillTokens(text) {
  const out = [], seen = new Set();
  const re = /\[([^\]]+)\]/g; let m;
  while ((m = re.exec(text))) { const t = m[1].trim(); if (!seen.has(t)) { seen.add(t); out.push(t); } }
  return out;
}

/* ---------- shared chrome (verbatim from SPEC, prefix = "" for root, "../" for subfolders) ---------- */
const SITE = "https://michaels-corner.netlify.app/";
/* The build stamp. Deliberately a constant, not new Date(): a no-op rebuild must produce a
   zero-line diff, which is the only cheap proof that the generator still matches what is
   committed. Bump this by hand when the library content actually changes. */
const TODAY = "2026-09-09";

/* Structured data. A pack is a list of prompts, a prompt page is a HowTo with
   one step, and both name the same author, so an answer engine can tie every
   page on the site back to one person. */
function jsonld(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}<\/script>`;
}
const PERSON = { "@type": "Person", name: "Michael Florian", url: SITE };

function head(title, desc, prefix, canonPath, extraLd) {
  const CANON = SITE + (canonPath || "");
  const LD = [
    jsonld({ "@context": "https://schema.org", "@type": "WebPage", name: title,
             description: desc, url: CANON, inLanguage: "en", dateModified: TODAY,
             isPartOf: { "@type": "WebSite", name: "Michael's Corner", url: SITE },
             author: PERSON }),
  ].concat(extraLd ? extraLd.map(jsonld) : []).join("\n");
  return _head(title, desc, prefix, CANON, LD);
}

function _head(title, desc, prefix, CANON, LD) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)} / Michael's Corner</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${CANON}">
<meta name="author" content="Michael Florian">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="theme-color" content="#E9EEE7">
<meta name="color-scheme" content="light">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Michael's Corner">
<meta property="og:title" content="${esc(title)} / Michael's Corner">
<meta property="og:description" content="${esc(desc)}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="${prefix}assets/brand/mark.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap">
<link rel="stylesheet" href="${prefix}styles.css">
${LD}`;
}

function header(prefix) {
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-head">
  <div class="wrap">
    <div class="head-top">
      <a class="head-word no-fx" href="/"><img src="${prefix}assets/brand/mark.png" alt="" class="head-mark" width="42" height="62" aria-hidden="true"><span class="hw">Michael&#8217;s<br>Corner<span style="color:#E45B52">.</span></span></a>
      <nav class="head-nav" aria-label="Main">
        <a href="/" data-nav="home">Home</a>
        <a href="/start" data-nav="start">Start here</a>
        <a href="/library" data-nav="library">Prompt library</a>
        <a href="/tools" data-nav="tools">Tools</a>
        <a href="/bill" data-nav="bill">Apps I built</a>
        <a href="/channel" data-nav="channel">Videos</a>
      </nav>
      <a class="head-cta no-fx" href="/start" data-nav="start">I want to learn AI</a>
      <a class="head-cta-ghost no-fx" href="/kit" data-nav="kit">Get the kit</a>
    </div>
  </div>
</header>`;
}

function footer(prefix) {
  return `</main>
<footer>
  <div class="wrap">
    <div class="fgrid">
      <div>
        <div class="fmark"><img src="${prefix}assets/brand/mark.png" alt="" width="42" height="62"><span>Michael&#8217;s<br>Corner<i class="dot" style="font-style:normal">.</i></span></div>
      </div>
      <div>
        <p class="h4" style="color:var(--sun);margin-bottom:10px">Take something</p>
        <a href="/library">Prompt library</a>
        <a href="/tools">Tools</a>
        <a href="/kit">The Starter Kit</a>
      </div>
      <div>
        <p class="h4" style="color:var(--sun);margin-bottom:10px">Look around</p>
        <a href="/start">Start here</a>
        <a href="/bill">Apps I built</a>
        <a href="/channel">Videos</a>
      </div>
      <div>
        <p class="h4" style="color:var(--sun);margin-bottom:10px">Say hello</p>
        <a href="mailto:michael@off-plate.com" class="fhandle">michael@off-plate.com</a>
        <a href="https://instagram.com/themichaelscorner" target="_blank" rel="noopener" class="fhandle">@themichaelscorner</a>
      </div>
    </div>
    <div class="fbot">
      <a href="https://off-plate.com" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">Website created by Off-Plate <span class="arw">&#8599;</span></a>
    </div>
  </div>
</footer>
<script src="${prefix}data/prompts-index.js"></script>
<script src="${prefix}shared.js"></script>`;
}

/* ============================================================
   PAGE: library.html  (the card-catalog file system)
   ============================================================ */
function buildLibrary() {
  const prefix = "";
  const css = `
<style>
/* ---- Library: a prominent prompt search + a clear grid of clickable pack cards. ---- */
.lib-top{ padding-block:clamp(28px,4vw,48px) 0; }
.lib-top .lede{ margin:14px 0 0; }

/* the search box: bordered, obvious, searches all prompts */
.lib-searchbox{ display:flex; align-items:center; gap:12px; border:1px solid var(--ink); border-radius:2px;
  padding:13px 16px; margin-top:0; max-width:600px; background:var(--cream); transition:border-color 150ms ease; }
.lib-searchbox:focus-within{ border-color:var(--orange); outline:2px solid var(--orange); outline-offset:2px; }
.lib-searchbox canvas{ display:block; flex:none; }
.lib-searchbox input{ flex:1; border:none; background:none; font-size:16px; padding:2px 0; color:var(--ink); }
.lib-searchbox input:focus, .lib-searchbox input:focus-visible{ outline:none; }

/* search results: a flat list of matching prompts */
.lib-results{ margin-top:clamp(26px,3vw,36px); }
.lib-results[hidden]{ display:none; }
.results-count{ font-family:'Space Mono',ui-monospace,monospace; font-size:12px; letter-spacing:0.06em; color:var(--grey); margin:0 0 14px; }
.result-list{ list-style:none; margin:0; padding:0; border-top:1px solid var(--ink); }
.rlink{ display:grid; grid-template-columns:1fr auto; gap:4px 18px; align-items:center;
  border-bottom:1px solid var(--line); padding:15px 8px; text-decoration:none; color:var(--ink); transition:background 150ms ease; }
.rlink:hover{ background:var(--sage); }
.rlink:focus-visible{ background:var(--sage); outline:2px solid var(--orange); outline-offset:-2px; }
.rlink .rt{ font-weight:900; font-stretch:80%; text-transform:uppercase; font-size:18px; line-height:1.15; letter-spacing:-0.01em; grid-column:1; }
.rlink .rw{ grid-column:1; font-size:14px; line-height:1.45; color:var(--grey); margin-top:2px; }
.rlink .rpack{ grid-column:2; grid-row:1 / span 2; font-family:'Space Mono',ui-monospace,monospace; font-size:12.5px; letter-spacing:0.06em; text-transform:uppercase; color:var(--grey-2); white-space:nowrap; align-self:center; }
.rlink .rpack .oa{ color:var(--green); margin-left:8px; }

/* the pack grid: clear, clickable cards */
.lib-packs{ margin-top:clamp(30px,3.5vw,44px); }
.lib-packs[hidden]{ display:none; }
.lib-packs .ph{ font-family:'Space Mono',ui-monospace,monospace; font-size:12px; letter-spacing:0.06em; text-transform:uppercase; color:var(--grey); margin:0 0 16px; }
.pack-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr)); gap:16px; }
.pack-card:focus-visible{ background:var(--sage); border-color:var(--green); outline:2px solid var(--orange); outline-offset:2px; }
.lib-empty{ padding:34px 8px; color:var(--grey); font-size:16px; }
.lib-empty[hidden]{ display:none; }
</style>`;

  const total = PACKS.reduce((n, p) => n + p.prompts.length, 0);

  const cards = PACKS.map((p) => `
      <a class="pack-card" href="/packs/${esc(p.id)}">
        <div class="pc-top"><span class="pc-tag">${esc(p.chip)}</span><span class="pc-n">${p.prompts.length} prompts</span></div>
        <h2>${esc(p.name)}</h2>
        <p>${esc(p.blurb.join(" "))}</p>
        <span class="pc-open">Open pack <span class="oa">&#8594;</span></span>
      </a>`).join("");

  const body = `
<section class="page-hero">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <h1 class="h-page">Steal these prompts</h1>
      </div>
      <div>
        <p class="hero-intro">${total} prompts in eight packs, all free. Copy one, fill in the brackets, and paste it into ChatGPT, Claude, or Gemini. These are the ones I keep going back to.</p>
      </div>
    </div>
  </div>
</section>

<div class="wrap section">
  <div class="lib-searchbox">
    <canvas data-dot="search" data-size="20" style="width:20px;height:20px;"></canvas>
    <input type="search" id="lib-q" placeholder="Search all ${total} prompts by name" autocomplete="off" aria-label="Search all prompts">
  </div>

  <div class="lib-results" id="lib-results" hidden aria-live="polite">
    <p class="results-count" id="results-count"></p>
    <ul class="result-list" id="result-list"></ul>
    <p class="lib-empty" id="lib-empty" hidden>No prompt matches that. Try a shorter or different word.</p>
  </div>

  <div class="lib-packs" id="lib-packs">
    <p class="ph">${PACKS.length} packs, sorted by who they are for</p>
    <div class="pack-grid">
      ${cards}
    </div>
  </div>
</div>

<section class="band band--green" id="lib-band">
  <div class="wrap">
    <h2 class="h-sec">Take what helps</h2>
    <p class="lede" style="margin-top:12px; max-width:58ch;">Copy anything here, change the words, make it yours. If one prompt saves you an hour this week, that is the whole point.</p>
  </div>
</section>
`;

  const script = `
<script>
(function(){
  var input = document.getElementById('lib-q');
  var packs = document.getElementById('lib-packs');
  var results = document.getElementById('lib-results');
  var list = document.getElementById('result-list');
  var count = document.getElementById('results-count');
  var empty = document.getElementById('lib-empty');
  var IDX = (window.MC2DATA && MC2DATA.promptIndex) || [];
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function shortPack(n){ return n.replace(/^Best prompts for /,'').replace(/^Building software with AI$/,'Building'); }
  function render(raw){
    var q = raw.trim().toLowerCase();
    if(!q){ packs.hidden = false; results.hidden = true; list.innerHTML=''; return; }
    packs.hidden = true; results.hidden = false;
    var hits = IDX.filter(function(it){ return (it.title+' '+it.when+' '+it.packName).toLowerCase().indexOf(q) !== -1; });
    count.textContent = hits.length + (hits.length===1?' prompt matches ':' prompts match ') + '“' + raw.trim() + '”';
    if(!hits.length){ list.innerHTML=''; empty.hidden=false; return; }
    empty.hidden = true;
    list.innerHTML = hits.map(function(it){
      return '<a class="rlink" href="'+it.url+'"><span class="rt">'+esc(it.title)+'</span>'
        + '<span class="rw">'+esc(it.when)+'</span>'
        + '<span class="rpack">'+esc(shortPack(it.packName))+'<span class="oa">&#8594;</span></span></a>';
    }).join('');
  }
  if(input){ input.addEventListener('input', function(){ render(input.value); }); }
})();
</script>`;

  const html = head("Prompts", "Eight packs of free, copy-ready prompts for ChatGPT, Claude, and Gemini.", prefix)
    + css + "\n</head>\n<body>\n<a class=\"skip-link\" href=\"#main\">Skip to content</a>\n"
    + header(prefix) + "\n" + body + "\n" + footer(prefix) + script + "\n</body>\n</html>\n";

  /* library.html is the single-page app route now, not a generated page. */
  return total;
}

/* ============================================================
   PAGE: packs/<id>.html  (the opened dossier)
   ============================================================ */
function buildPack(pack, i) {
  const prefix = "../";
  const css = `
<style>
/* ---- Pack page: the opened dossier. Folder-tab header + ruled ledger, with an all-packs rail. ---- */
.dossier{ padding-block:clamp(28px,4vw,44px) 0; }
.d-back{ margin-bottom:clamp(20px,2.4vw,28px); }
/* all-packs cross-nav: a full-width row under the ledger */
.pack-nav{ margin-top:clamp(36px,4.5vw,60px); border-top:1px solid var(--ink); padding-top:22px; display:flex; flex-wrap:wrap; gap:12px 22px; align-items:baseline; }
.pack-nav .pn-label{ width:100%; font-family:'Space Mono',ui-monospace,monospace; font-size:12.5px; letter-spacing:0.1em; text-transform:uppercase; color:var(--grey); margin-bottom:6px; }
.pack-nav a{ color:var(--ink); text-decoration:none; border-bottom:1px solid var(--line); padding-bottom:2px; transition:color 150ms ease, border-color 150ms ease; }
.pack-nav a:hover{ color:var(--brick); border-color:var(--brick); }
.pack-nav .pn-here{ color:var(--orange); font-weight:600; border-bottom:1px solid var(--orange); padding-bottom:2px; }
.folder{ border:1px solid var(--ink); border-radius:2px; }
.folder-tab{
  display:inline-flex; align-items:center; gap:10px; background:var(--ink); color:var(--cream);
  font-family:'Space Mono',ui-monospace,monospace; font-size:12px; letter-spacing:0.14em; text-transform:uppercase;
  padding:8px 16px; border-radius:2px 2px 0 0; margin:0; position:relative; top:1px;
}
.folder-body{ padding:clamp(22px,3vw,34px); }
.folder-body .h-page{ margin:0 0 6px; }
.folder-meta{ font-family:'Space Mono',ui-monospace,monospace; font-size:12px; color:var(--grey); margin:0 0 18px; }
.folder-intro{ font-size:16.5px; line-height:1.6; color:var(--ink-soft); max-width:64ch; margin:0 0 20px; }
.cover-note{ font-family:'Space Mono',ui-monospace,monospace; font-size:12.5px; letter-spacing:0.02em; color:var(--grey); margin:12px 0 8px; }
.cover-note .on{ color:var(--ink); }
.cover-note .rest{ color:var(--grey-2); }

/* the ledger of prompts */
.ledger-list{ max-width:1180px;  border-top:1px solid var(--ink); }
.lrow{
  display:grid; grid-template-columns:auto 1fr auto; gap:4px 20px; align-items:baseline;
  border-bottom:1px solid var(--line); padding:clamp(16px,2vw,22px) clamp(4px,1vw,10px);
  text-decoration:none; color:var(--ink); transition:background 150ms ease;
}
.lrow:hover{ background:var(--sage); }
.lrow:focus-visible{ background:var(--sage); outline:2px solid var(--orange); outline-offset:-2px; }
.lrow .fno{ font-weight:900; font-stretch:66%; font-size:clamp(22px,2.4vw,30px); color:var(--ink); line-height:1; letter-spacing:-0.02em; }
.lrow .lt{ }
.lrow .lt h3{ font-weight:900; font-stretch:80%; text-transform:uppercase; font-size:clamp(18px,1.8vw,21px); line-height:1.15; letter-spacing:-0.01em; margin:0 0 4px; }
.lrow .lt p{ margin:0; font-size:14.5px; line-height:1.5; color:var(--grey); }
.lrow .open{ font-family:'Space Mono',monospace; font-size:20px; color:var(--ink); align-self:center; transition:color 150ms ease, transform 180ms var(--ease); }
.lrow:hover .open, .lrow:focus-visible .open{ color:var(--brick); transform:translateX(3px); }
@media (max-width:560px){ .lrow{ grid-template-columns:auto 1fr; } .lrow .open{ display:none; } }
@media (prefers-reduced-motion: reduce){ .lrow:hover .open, .lrow:focus-visible .open{ transform:none; } }
</style>`;

  // coverage note as a factual mono line: what the pack covers, what stays on you.
  const coverText = {
    beginners: ["It gets you moving on real tasks from day one.", "It does not make you good at prompting. Repetition does that."],
    writing: ["It cuts filler and keeps your voice on the page.", "It does not decide what you actually mean. That stays yours."],
    building: ["It plans, briefs, and unblocks the build.", "It does not test your product with real users. You do."],
    founders: ["It drafts the messages and reads the numbers.", "It never decides. You send, you set the price, you own the call."],
    freelancers: ["It handles the briefs, proposals, and chasing.", "It does not win you the trust. Your work and your word do."],
    office: ["It clears the inbox, meetings, and reports faster.", "It does not know your office politics. Read before you send."],
    creators: ["It repurposes and scripts from your own material.", "It cannot fake your taste. The judgement stays yours."],
    students: ["It quizzes you and questions you until it sticks.", "It must not write the answers. That is the whole point."]
  }[pack.id] || ["It does the draft.", "The judgement stays yours."];

  let rows = "";
  pack.prompts.forEach((pr, j) => {
    rows += `
    <a class="lrow" href="/prompts/${esc(pr.id)}">
      <span class="fno">${promptNo(j)}</span>
      <span class="lt">
        <h3>${esc(pr.title)}</h3>
        <p>${esc(pr.when)}</p>
      </span>
      <span class="open" aria-hidden="true">&#8594;</span>
    </a>`;
  });

  const packsNav = PACKS.map((p2, k) => k === i
    ? `<span class="pn-here">${esc(p2.name)}</span>`
    : `<a href="/packs/${esc(p2.id)}">${esc(p2.name)}</a>`).join("");

  const body = `
<section class="page-hero">
  <div class="wrap">
    <a class="backlink hero-back" href="/library"><span aria-hidden="true">&#8592;</span> Back to all prompts</a>
    <div class="hero-grid">
      <div>
        <h1 class="h-page">${esc(pack.name)}</h1>
      </div>
      <div>
        <p class="hero-intro">${esc(pack.blurb.join(" "))}</p>
      </div>
    </div>
  </div>
</section>

<div class="wrap section">
  <div class="ledger-list">
    ${rows}
  </div>

  <nav class="pack-nav" aria-label="All packs">
    <span class="pn-label">More packs</span>
    ${packsNav}
  </nav>
</div>
`;

  const html = head(pack.name, pack.desc, prefix, `packs/${pack.id}`, [
    { "@context": "https://schema.org", "@type": "ItemList", name: pack.name,
      description: pack.blurb.join(" "), numberOfItems: pack.prompts.length,
      itemListElement: pack.prompts.map((q, n) => ({
        "@type": "ListItem", position: n + 1, name: q.title,
        url: `${SITE}prompts/${q.id}` })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Michael's Corner", item: SITE },
      { "@type": "ListItem", position: 2, name: "Prompt library", item: SITE + "library" },
      { "@type": "ListItem", position: 3, name: pack.name, item: `${SITE}packs/${pack.id}` }] }])
    + css + "\n</head>\n<body>\n<a class=\"skip-link\" href=\"#main\">Skip to content</a>\n"
    + header(prefix) + "\n" + body + "\n" + footer(prefix) + "\n</body>\n</html>\n";

  writeFileSync(join(ROOT, "packs", `${pack.id}.html`), html);
}

/* ============================================================
   PAGE: prompts/<id>.html  (the spec sheet)
   ============================================================ */
function buildPrompt(pack, packIndex, pr, promptIndex) {
  const prefix = "../";
  const css = `
<style>
/* ---- Prompt page: the spec sheet. Terminal specimen + Copy in the body, spec fields in the rail. ---- */
.spec{ padding-block:clamp(28px,4vw,44px) 0; }
.spec-back{ margin-bottom:clamp(20px,2.4vw,28px); }
.spec-meta{ display:flex; gap:8px 20px; flex-wrap:wrap; font-family:'Space Mono',ui-monospace,monospace; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:var(--grey); border-bottom:1px solid var(--ink); padding-bottom:12px; margin-bottom:clamp(18px,2.2vw,26px); }
.spec-meta .id{ color:var(--ink); font-weight:700; }
.spec h1{ margin:0 0 8px; }
.spec-when{ font-size:16.5px; line-height:1.6; color:var(--ink-soft); max-width:60ch; margin:0 0 clamp(22px,3vw,32px); }

/* the terminal specimen */
.term{ background:var(--ink); color:var(--ink-text); border:1px solid var(--ink); border-radius:2px; overflow:hidden; }
.term-bar{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:11px 16px; border-bottom:1px solid #34302a; font-family:'Space Mono',ui-monospace,monospace; font-size:12.5px; letter-spacing:0.14em; text-transform:uppercase; color:#b9b2a4; }
.term-bar .dot{ display:inline-flex; align-items:center; gap:8px; }
.term-body{ padding:clamp(16px,2.4vw,24px); font-family:'Space Mono',ui-monospace,Menlo,monospace; font-size:13.5px; line-height:1.7; white-space:pre-wrap; word-break:break-word; margin:0; color:var(--ink-text); }
.term-body .cur{ display:inline-block; width:0.62em; height:1.05em; background:var(--orange); vertical-align:-0.16em; margin-left:2px; animation:mc-cur 1s steps(1) infinite; }
@media (prefers-reduced-motion: reduce){ .term-body .cur{ animation:none; opacity:1; } }
@keyframes mc-cur{ 0%,49%{opacity:1} 50%,100%{opacity:0} }
.spec-body.selected .term-body{ background:transparent; }
.spec-body.selected .term-body .selwrap{ background:var(--orange); color:var(--cream); }

/* copy control */
.copyrow{ display:flex; align-items:center; gap:16px; flex-wrap:wrap; margin-top:16px; }
.copy-btn{ display:inline-flex; align-items:center; gap:10px; }
.copy-btn canvas{ display:block; }
.copy-stamp{ font-family:'Space Mono',ui-monospace,monospace; font-size:12.5px; color:var(--grey); min-height:1.2em; }
.copy-stamp .on{ color:var(--ink); }

/* spec fields: a prominent panel ABOVE the prompt so you know how to use it before you copy */
.specfields{ margin-bottom:clamp(24px,3vw,36px); background:var(--cream-2); border:1px solid var(--ink); border-radius:2px;
  padding:clamp(22px,2.6vw,32px); display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:clamp(20px,2.6vw,36px); }
.sf h3{ font-family:'Space Mono',ui-monospace,monospace; font-size:12.5px; letter-spacing:0.1em; text-transform:uppercase; color:var(--green); margin:0 0 10px; font-weight:700; }
.sf p{ margin:0; font-size:15px; line-height:1.6; color:var(--ink); }
.tokens{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px; }
.tokens li{ font-family:'Space Mono',ui-monospace,monospace; font-size:13.5px; color:var(--ink); }
.tokens .tk{ color:var(--green); }
.tokens .none{ color:var(--grey); font-family:'General Sans',sans-serif; }
</style>`;

  const tokens = fillTokens(pr.prompt);
  // Split prompt text into HTML with a wrappable span for the selection sweep.
  const specimenHTML = `<span class="selwrap">${esc(pr.prompt)}</span><span class="cur" aria-hidden="true"></span>`;

  const tokenList = tokens.length
    ? `<ul class="tokens">` + tokens.map((t) => `<li><span class="tk">[</span>${esc(t)}<span class="tk">]</span></li>`).join("") + `</ul>`
    : `<span class="tokens none">Nothing to fill in. Copy and go.</span>`;

  const body = `
<section class="page-hero">
  <div class="wrap">
    <a class="backlink hero-back" href="/library"><span aria-hidden="true">&#8592;</span> Back to all prompts</a>
    <div class="hero-grid">
      <div>
        <h1 class="h-page">${esc(pr.title)}</h1>
      </div>
      <div>
        <p class="hero-intro">${esc(pr.when)}</p>
      </div>
    </div>
  </div>
</section>

<div class="wrap section spec">
  <div class="specfields">
    <div class="sf"><h3>What to fill in</h3>${tokenList}</div>
    <div class="sf"><h3>The tip</h3><p>${esc(pr.tip)}</p></div>
    <div class="sf"><h3>Works in</h3><p>ChatGPT / Claude / Gemini</p></div>
    <div class="sf"><h3>This pack</h3><a class="link" href="/packs/${esc(pack.id)}">${esc(pack.chip)}</a></div>
  </div>

  <div class="spec-body" id="spec-body">
    <div class="term">
      <div class="term-bar">
        <span class="dot"><canvas data-dot="prompt" data-size="16" style="width:16px;height:16px;"></canvas> The prompt</span>
        <span>copy target</span>
      </div>
      <pre class="term-body" id="specimen">${specimenHTML}</pre>
    </div>

    <div class="copyrow">
      <button type="button" class="btn-orange copy-btn" id="copy-btn">
        <span class="lbl">Copy prompt</span>
      </button>
      <span class="copy-stamp" id="copy-stamp" role="status" aria-live="polite"></span>
    </div>
  </div>
</div>
`;

  // Inline script: copy the raw prompt only, sweep the selection, stamp the time.
  const rawJson = JSON.stringify(pr.prompt);
  const script = `
<script>
(function(){
  var RAW = ${rawJson};
  var btn = document.getElementById('copy-btn');
  var lbl = btn.querySelector('.lbl');
  var stamp = document.getElementById('copy-stamp');
  var specBody = document.getElementById('spec-body');
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  function pad(n){ return (n<10?'0':'')+n; }
  function fallback(){
    try{ var ta=document.createElement('textarea'); ta.value=RAW; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.focus(); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); return true;
    }catch(e){ return false; }
  }
  btn.addEventListener('click', function(){
    var ok = false;
    try{ if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(RAW).catch(fallback); ok = true; } }catch(e){}
    if(!ok) ok = fallback();
    if(!ok){ lbl.textContent = 'Select and copy manually'; return; }
    // signature moment 2: the prompt selects itself
    specBody.classList.add('selected');
    if(reduce){ setTimeout(function(){ specBody.classList.remove('selected'); }, 700); }
    else { setTimeout(function(){ specBody.classList.remove('selected'); }, 700); }
    lbl.textContent = 'Copied';
    if(window.MC2 && MC2.mountDevices){ /* icon morph handled by copy dot-icon click state if present */ }
    var d = new Date();
    stamp.innerHTML = '<span class="on">copied ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + '</span> / works in ChatGPT / Claude / Gemini';
    setTimeout(function(){ lbl.textContent = 'Copy prompt'; }, 1800);
  });
})();
</script>`;

  const html = head(pr.title, pr.when, prefix, `prompts/${pr.id}`, [
    { "@context": "https://schema.org", "@type": "HowTo", name: pr.title,
      description: pr.when, author: PERSON,
      step: [{ "@type": "HowToStep", position: 1, name: "Copy the prompt and fill the brackets",
               text: pr.when }] },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Michael's Corner", item: SITE },
      { "@type": "ListItem", position: 2, name: "Prompt library", item: SITE + "library" },
      { "@type": "ListItem", position: 3, name: pack.name, item: `${SITE}packs/${pack.id}` },
      { "@type": "ListItem", position: 4, name: pr.title, item: `${SITE}prompts/${pr.id}` }] }])
    + css + "\n</head>\n<body>\n<a class=\"skip-link\" href=\"#main\">Skip to content</a>\n"
    + header(prefix) + "\n" + body + "\n" + footer(prefix) + script + "\n</body>\n</html>\n";

  writeFileSync(join(ROOT, "prompts", `${pr.id}.html`), html);
}

/* ============================================================
   DATA: data/prompts-index.js  (client search index)
   ============================================================ */
function buildIndex() {
  const index = [];
  PACKS.forEach((p, i) => {
    p.prompts.forEach((pr) => {
      index.push({
        id: pr.id,
        title: pr.title,
        when: pr.when,
        pack: p.id,
        packName: p.name,
        url: `prompts/${pr.id}`
      });
    });
  });
  const js = `/* GENERATED by build.mjs. Client search index for the prompt library. Do not edit by hand. */
window.MC2DATA = window.MC2DATA || {};
window.MC2DATA.promptIndex = ${JSON.stringify(index, null, 0)};
`;
  writeFileSync(join(ROOT, "data", "prompts-index.js"), js);
  return index.length;
}

/* ============================================================
   sitemap.xml
   It was hand-maintained, so it still listed 64 prompt pages that no longer exist after the
   library was rebuilt. The deep pages are generated here, so the sitemap is generated here too.
   ============================================================ */
function buildSitemap() {
  const TOOL_IDS = ["ai-cost-calculator", "fits-in-context", "subscription-vs-api",
    "should-you-automate", "ai-slop-detector", "prompt-tightener",
    "difficult-email-prompt-assembler"];
  const rows = [
    ["", "1.0"],
    ["start", "0.9"], ["library", "0.9"], ["tools", "0.9"], ["bill", "0.9"],
    ["channel", "0.8"], ["about", "0.8"], ["kit", "0.8"],
    ...TOOL_IDS.map(id => [`tools/${id}`, "0.8"]),
    ...PACKS.map(p => [`packs/${p.id}`, "0.7"]),
    ...PACKS.flatMap(p => p.prompts.map(pr => [`prompts/${pr.id}`, "0.6"])),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    + rows.map(([path, priority]) =>
        `  <url>\n    <loc>${SITE}${path}</loc>\n    <lastmod>${TODAY}</lastmod>\n`
        + `    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join("\n")
    + `\n</urlset>\n`;
  writeFileSync(join(ROOT, "sitemap.xml"), xml);
  return rows.length;
}

/* ============================================================
   RUN
   ============================================================ */
function run() {
  mkdirSync(join(ROOT, "packs"), { recursive: true });
  mkdirSync(join(ROOT, "prompts"), { recursive: true });
  mkdirSync(join(ROOT, "data"), { recursive: true });

  const total = buildLibrary();
  PACKS.forEach((p, i) => buildPack(p, i));
  PACKS.forEach((p, i) => p.prompts.forEach((pr, j) => buildPrompt(p, i, pr, j)));
  const n = buildIndex();

  /* library.html is NOT written here: it is an app.js route, pre-rendered by prerender.mjs. */
  console.log(`packs/  written: ${PACKS.length}`);
  console.log(`prompts/ written: ${total}`);
  const urls = buildSitemap();
  console.log(`data/prompts-index.js written: ${n} entries`);
  console.log(`sitemap.xml written: ${urls} urls`);
}

run();
