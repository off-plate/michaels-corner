# Michael's Corner

Static site, no framework, no bundler, no `package.json`. Netlify serves the repo root as-is
(`netlify.toml` is `publish = "." command = ""`). Live at https://michaels-corner.netlify.app/.

**Read this before editing anything.** The architecture is not what `SPEC.md`, `DESIGN-SYSTEM.md`
or `README.md` describe. Those three predate the 2026-09-07 rebrand and are wrong about the
palette, the typeface, the host and the URL scheme. They are kept as history for the deep pages'
class names only.

---

## There are two content systems, and they do not know about each other

### 1. `app.js` drives the eight top-level pages

`index, start, library, tools, bill, channel, about, kit`

All page content lives in plain data arrays at the top of `app.js`:

| Array | Drives |
|---|---|
| `NAV`, `PAGE_META` | Site chrome and per-route title/description |
| `STEPS`, `CHECKS` | `/start` |
| `PACKS` | `/library` pack cards |
| `TOOLS`, `TCATS` | `/tools` |
| `APPS` | `/bill` |
| `KIT` | `/kit` |
| `VIDS`, `VCATS` | `/channel` |
| `IMG`, `DIM` | WebP paths and intrinsic sizes (the `DIM` map exists to stop CLS) |

`PAGES.<route>()` are template functions. `render()` swaps `main.innerHTML`. `wire()` holds the
per-page interactive behaviour.

### 2. `build.mjs` + `data/prompts.mjs` drive the deep library pages

`node build.mjs` reads **only** `data/prompts.mjs` and writes `packs/<id>.html`,
`prompts/<id>.html` and `data/prompts-index.js`.

It does **not** write `library.html`. `buildLibrary()` still assembles a string and throws it
away, because `/library` became an `app.js` route.

Tool pages under `tools/` are hand-written standalone documents. Nothing generates them.

---

## The `.html` files are pre-rendered, not shells

Each top-level `.html` ships a real, fully rendered `<main>`. This is deliberate: `.rv` is
`opacity:0` until JS adds `.in`, so a shell would render a blank page for anyone without JS and
would delay the LCP for everyone else.

**Editing `app.js` therefore changes nothing anyone sees until you run:**

```bash
node prerender.mjs            # all eight routes
node prerender.mjs start bill # or just the ones you touched
```

`prerender.mjs` loads each route over `file://` with `window.__PRERENDER_ROUTE` set (the hook
`currentRoute()` looks for), lets the reveal observer settle, and writes `<main>` plus the head
fields `applyMeta()` sets back into the file.

The viewport is pinned at 1440x900 because the reveal observer only adds `.in` to what is in
view, so the output would otherwise depend on the window size.

**Its acceptance test is a zero-line diff.** Running it on an unchanged `app.js` must change
nothing. A diff there means the script has drifted, so fix the script and leave the pages alone.

---

## `build.mjs` must stay byte-faithful to what is committed

The generator has already silently reverted a copy pass once. Commit `b0bf01e` hand-edited all 72
generated pages without touching `build.mjs`, so for a while any rebuild would have undone it
across 72 files with no warning.

**The rule: `node build.mjs` on unchanged data must produce a zero-line diff.** That is the only
cheap proof the generator still matches reality. If a copy pass edits `packs/` or `prompts/` by
hand, fold the same change into `build.mjs` or `data/prompts.mjs` in the same commit.

Two things exist to protect that property:

- `TODAY` is a pinned constant, not `new Date()`. Bump it by hand when library content changes.
- A pack has both `desc` (the meta/WebPage description) and `blurb` (the on-page hero paragraph).
  They are separate fields because the hand copy pass edited them to differ. Do not re-merge them.

---

## Duplicated data you have to keep in sync by hand

- **Pack copy lives twice**: `data/prompts.mjs` (`name`/`desc`/`blurb[]`/`prompts[]`) and
  `app.js` `PACKS` (`n`/`d`/`chip`). Editing one and not the other is the most common mistake here.
- **Site chrome lives three times**: `app.js` `NAV`, `build.mjs` `header()`/`footer()`, and the
  static header/footer markup in each top-level `.html`. Commit `41ef115` changed the nav
  site-wide and missed all 64 prompt pages, which sat in production saying "Free tools" while
  every other page said "Tools".
- **JSON-LD is hand-written per `.html`** and is not injected by `app.js`. `applyMeta()` only
  touches title, description, canonical and og. So `start.html` hardcodes "seven-point checklist"
  in its `HowTo`, and `bill.html` carries a second, shorter copy of every app description.
- **Counts are hardcoded in prose** across the home hero stats, `/start`'s closing band, the
  `/library` lede and `llms.txt`. Changing the number of packs, prompts or tools means chasing all
  of them.
- `sitemap.xml`, `llms.txt` and `llms-full.txt` are hand-maintained. Nothing generates them.

---

## Links

Card and row links hardcode the absolute production domain (`LIVE`) plus `target="_blank"`.
Anything on this site should open in the same tab with a relative href; `target="_blank"` and the
`↗` arrow are for genuinely external destinations only. `→` means internal.

## Design

The live system is `styles.css` (tokens: ground, cream, ink, sun, coral, sage, periwinkle;
Archivo) plus the canonical Obsidian note `Company HQ/Michael's Corner/[MC] Brand Guidelines.md`,
plus `Jarvis/.claude/design/DESIGN.md` for the global forbidden list.

House rules that bite most often: no em dashes, no eyebrow label above a heading, headlines under
8 words, no unsourced metrics, one accent, no type below 12px, nothing under 44px on mobile,
`prefers-reduced-motion` resolves every animation to its final frame.

## Before pushing

```bash
node build.mjs && git diff --stat        # zero diff unless you changed library data
node prerender.mjs && git diff --stat    # zero diff unless you changed app.js
python3 "../../Claude Helpers/Jarvis/.claude/design/slop-lint.py" .   # must exit 0
node qa/audit.mjs http://localhost:8000 /,/start,/library,/tools,/bill --widths 390,1440,2560
```

A 200 is not proof a deploy worked. Grep the live page for its own `<title>`.
