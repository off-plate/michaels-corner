
const IMG = {"mark": "assets/inline/mark.webp", "markRev": "assets/inline/markRev.webp", "cornerman": "assets/inline/cornerman.webp", "lamp": "assets/inline/lamp.webp", "machine": "assets/inline/machine.webp", "kiosk": "assets/inline/kiosk.webp", "sign": "assets/inline/sign.webp", "tuck": "assets/inline/tuck.webp", "recall": "assets/inline/recall.webp", "refill": "assets/inline/refill.webp", "frost": "assets/inline/frost.webp", "hero": "assets/inline/hero.webp", "cutter": "assets/inline/cutter.webp", "titis": "assets/inline/titis.webp", "owco": "assets/inline/owco.webp", "nexus": "assets/inline/nexus.webp"};
// Real pixel dimensions of each IMG entry, so every <img> can carry width/height
// attributes and the browser reserves its box before the file loads over the
// network -- these used to be inline base64 (available synchronously, no CLS
// risk); now they're separate files, so without this every one of them is a
// layout-shift hazard the instant it finishes loading.
const DIM = {mark:{w:299,h:440}, markRev:{w:272,h:400}, cornerman:{w:440,h:438}, lamp:{w:422,h:440}, machine:{w:411,h:440}, kiosk:{w:440,h:416}, sign:{w:440,h:423}, tuck:{w:160,h:160}, recall:{w:160,h:160}, refill:{w:160,h:160}, frost:{w:128,h:128}, hero:{w:620,h:720}, cutter:{w:160,h:160}, titis:{w:160,h:160}, owco:{w:160,h:160}, nexus:{w:160,h:160}};
const NAV = [
  ['home','Home'],
  ['start','Start here'],
  ['library','Prompt library'],
  ['tools','Free tools'],
  ['bill','Apps I built'],
  ['channel','Videos'],
  ['about','Who I am']
];

const PAGE_META = {
  home:    {t:"Michael's Corner",
            d:"Free AI prompts, browser tools and apps from Michael Florian, who is not a developer. Sixty-four prompts in eight packs, seven tools that run entirely in your browser, five finished apps, all free, no affiliate links anywhere."},
  start:   {t:"Your first hour with AI",
            d:"A seven-point checklist and a five-step guide for your first hour with ChatGPT, Claude or Gemini, built around one real task from your own week."},
  library: {t:"Steal these prompts",
            d:"Sixty-four free prompts in eight packs for ChatGPT, Claude and Gemini, sorted by who they are for: beginners, writing, building software, founders, freelancers, office work, creators and students."},
  tools:   {t:"Most useful AI tools",
            d:"Seven free AI tools that run entirely in your browser: an AI cost calculator, a context-window checker, a subscription versus API comparison, an automation scorecard, an AI-slop detector, a prompt tightener and a difficult-email builder."},
  bill:    {t:"Apps I built",
            d:"Five apps built with AI: Tuck and Frost for Chrome, Recall and Refill for macOS, and Cropper, a local video editor. All finished and all in daily use by the person who built them."},
  channel: {t:"Watch and learn",
            d:"Videos of real AI builds with the dead ends left in, sorted into building with AI, for beginners, prompting and behind the build. Filming now, first episodes soon."},
  about:   {t:"Who I am",
            d:"Michael Florian has a normal day job and builds things with AI on the side, more than twenty finished projects so far. What he got good at, and what he still cannot do."},
  kit:     {t:"Michael's AI Starter Kit",
            d:"A free starter kit for anyone beginning with AI: ten reusable prompts, a plain-words model guide, a first-hour walkthrough, a cost cheat sheet, an is-this-an-AI-job checklist and the fix-it lines. The whole list is on the page before any email is asked for."}
};
const SITE = 'https://michaels-corner.netlify.app/';
function applyMeta(page){
  const m = PAGE_META[page]; if(!m) return;
  document.title = page==='home' ? m.t : m.t + " / Michael's Corner";
  const set = (sel, attr, val) => { const e=document.querySelector(sel); if(e) e.setAttribute(attr, val); };
  set('meta[name="description"]','content',m.d);
  set('meta[property="og:title"]','content',document.title);
  set('meta[property="og:description"]','content',m.d);
  set('link[rel="canonical"]','href', SITE + ROUTE_CLEAN[page].replace(/^\//,''));
  set('meta[property="og:url"]','content', SITE + ROUTE_CLEAN[page].replace(/^\//,''));
}

const LIVE = 'https://michaels-corner.netlify.app/';

const TOOLS = [
  {id:'ai-cost-calculator', n:'AI cost calculator', desig:'TOOL/01', cat:'Money & size', desc:'What a month of AI actually costs, on rates you can edit.', hint:'editable rate table'},
  {id:'fits-in-context', n:'Fits-in-context checker', desig:'TOOL/02', cat:'Money & size', desc:"Whether your document fits a model's window or needs splitting.", hint:'five window sizes'},
  {id:'subscription-vs-api', n:'Subscription vs API', desig:'TOOL/03', cat:'Money & size', desc:'Your usage, both prices, one answer: which way is cheaper and where the lines cross.', hint:'shares your edited rates'},
  {id:'should-you-automate', n:'Should you automate it?', desig:'TOOL/04', cat:'The decision', desc:'Six honest questions, one stamped verdict: automate now, assist only, or leave it human. Weights are published.', hint:'a scorecard with hard overrides'},
  {id:'ai-slop-detector', n:'AI-slop detector', desig:'TOOL/05', cat:'The words', desc:'Paste text. A public rule list counts the AI tells and stamps a slop score, every flagged line shown.', hint:'English and Czech rules'},
  {id:'prompt-tightener', n:'Prompt tightener', desig:'TOOL/06', cat:'The words', desc:'Strips the filler it can prove is filler, flags the vague asks it cannot fix, shows the word drop. Deletion only.', hint:'never rewrites your meaning'},
  {id:'difficult-email-prompt-assembler', n:'Difficult-email prompt builder', desig:'TOOL/07', cat:'The words', desc:'Six questions about the email you dread. The output is a copy-ready prompt with your facts and hard lines baked in.', hint:'builds the prompt, your AI runs it'}
];
const TCATS = ['Money & size','The decision','The words'];

const PACKS = [
  {id:'beginners', chip:'Beginners', n:'Best prompts for beginners', d:'Start here. Simple prompts that work on your first day with ChatGPT or Claude. Copy one, fill in the brackets and paste it in.'},
  {id:'writing', chip:'Writing', n:'Best prompts for writing', d:'Draft faster and still sound like yourself. These keep your voice, cut the filler and stop your text from reading like something a machine wrote.'},
  {id:'building', chip:'Building', n:'Building software with AI', d:'Go from a rough idea to working software even if you do not code. Plan small, brief the AI properly, and get unstuck when it breaks. It will break.'},
  {id:'founders', chip:'Founders', n:'Founders and small business owners', d:'For people running a small business: customers, reviews, numbers and suppliers, plus the messages you keep putting off, drafted so you can actually send them.'},
  {id:'freelancers', chip:'Freelancers', n:'Freelancers and solo operators', d:'Your business is you. Briefs, proposals, feedback rounds and unpaid invoices. These push the admin down so the week has more room for the work you actually got into this for.'},
  {id:'office', chip:'Office work', n:'Office and operations work', d:'Inbox, meetings, reports and spreadsheets. Small routines for the everyday work, the kind that quietly gives you back an hour most days.'},
  {id:'creators', chip:'Creators', n:'Content creators', d:'Make more from what you already record: repurpose it, script it and publish faster, without your feed starting to sound generated.'},
  {id:'students', chip:'Students', n:'Students and learning', d:'Learn faster and remember more. These make AI quiz you and question you, and the thinking stays yours.'}
];

const VIDS = [
  {t:'I built 20 apps in 30 days', c:'Building with AI', d:'What happened, what broke, and what I would skip next time.'},
  {t:'Build a website with AI, start to finish', c:'Building with AI', d:'A full build, from empty folder to live page.'},
  {t:'Build a small app in a weekend', c:'Building with AI', d:'Pick a tiny idea and get it working in two days.'},
  {t:'From idea to live site in one sitting', c:'Building with AI', d:'I skip the planning week, open the laptop and build it.'},
  {t:'Connect AI to a real database', c:'Building with AI', d:'Store and read real data without a backend team.'},
  {t:'Make it look good without a designer', c:'Building with AI', d:'Simple rules that make a rough build look finished.'},
  {t:'Add a feature without breaking things', c:'Building with AI', d:'How I change working code and stay calm.'},
  {t:'AI for people who are not techies', c:'For beginners', d:'What AI is actually good at, explained without jargon.'},
  {t:'Your first hour with an AI assistant', c:'For beginners', d:'Set it up and do something useful right away.'},
  {t:'The five prompts I use every day', c:'For beginners', d:'The short, boring prompts that do most of the work.'},
  {t:'Stop overthinking your prompts', c:'For beginners', d:'Say what you want, what to keep, what to drop.'},
  {t:'What can AI actually do for you?', c:'For beginners', d:'A plain tour of the jobs it is genuinely good at.'},
  {t:'Pick the right AI tool', c:'For beginners', d:'How to choose without trying all of them.'},
  {t:'Common beginner mistakes', c:'For beginners', d:'The small habits that lead to bad answers.'},
  {t:'How to talk to AI like a person', c:'For beginners', d:'Why plain language works better than clever tricks.'},
  {t:'A simple daily AI habit', c:'For beginners', d:'A small daily routine that adds up.'},
  {t:'Write prompts that actually work', c:'Prompting', d:'A simple shape for prompts that get good answers.'},
  {t:'Make AI sound like you', c:'Prompting', d:'Teach the model your voice in a few lines.'},
  {t:'Give the model a job, not a wish', c:'Prompting', d:'Why clear roles beat vague requests.'},
  {t:'Templates I reuse every week', c:'Prompting', d:'The handful of prompts I never rewrite.'},
  {t:'Fix a prompt that gives bad answers', c:'Prompting', d:'A quick way to debug a prompt that is not working.'},
  {t:'Prompts for editing and proofreading', c:'Prompting', d:'Catch mistakes without losing your voice.'},
  {t:'How I debug code I cannot read', c:'Behind the build', d:'A loop anyone can follow, no computer science needed.'},
  {t:'I am not a developer. I build anyway.', c:'Behind the build', d:'Why the old gatekeeping does not hold up.'},
  {t:'A week of building in public', c:'Behind the build', d:'Five days, one project, shown in full.'},
  {t:'My exact daily setup', c:'Behind the build', d:'The tools and tabs I actually keep open.'},
  {t:'What I got wrong this month', c:'Behind the build', d:'Said out loud, so you can skip the same ones.'}
];
const VCATS = ['Building with AI','For beginners','Prompting','Behind the build'];

const APPS = [
  {n:'Tuck', img:'tuck', plat:'Chrome extension', d:'Hides all your other extensions behind one icon with a clean dropdown. Your toolbar stops looking like a cockpit.',
   cta:{label:"Add to Chrome, it's free", href:'https://chromewebstore.google.com/detail/tuck/njpclpglfhldbhlngnmkenjphjpjaijb'}},
  {n:'Recall', img:'recall', plat:'macOS app', d:'Your desktop, restored in one click. Reopens the apps, files, and Chrome profiles for a saved workspace and puts each window back where you set it.'},
  {n:'Refill', img:'refill', plat:'macOS menu bar', d:'Shows how much of your Claude usage is left, up in the menu bar. It reads the live numbers. You see when the five-hour window resets instead of finding out by hitting the limit.'},
  {n:'Frost', img:'frost', plat:'Chrome extension', d:"Freezes tabs you have not touched in a while using Chrome's own discard. A sixty-tab window stops costing what a sixty-tab window costs. Every tab keeps its address, its title and its full history."},
  {n:'Cropper', img:'cutter', plat:'macOS app', appsPageOnly:true, d:'A video editor that runs on your own Mac. Drop a video in, it transcribes it locally and shows you every dead pause, filler word and repeated take with the actual words, you tick what to remove and get an MP4 back. Nothing uploads, no account, no watermark, no length limit.'},
  {n:'TITIS', img:'titis', plat:'macOS app', appsPageOnly:true, d:'Select any text on your Mac and hear it read aloud. Right-click and choose TITIS, or use the global hotkey. Detects English and Czech per selection and picks the best installed voice for each. Nothing leaves your Mac.'},
  {n:'OWCO', img:'owco', plat:'Web app', appsPageOnly:true, d:'Points at your website and finds what it still claims that is no longer true: a stale number, an executive who left, an award given to someone else. Each finding comes back ranked with the fix and the source.',
   cta:{label:'Try the free scan', href:'https://owco.netlify.app'}},
  {n:'Nexus', img:'nexus', plat:'Off-Plate tool', appsPageOnly:true, d:'Reads a prospect\'s Google profile, site, socials and the company register, then hands back one sentence: what is measurably broken, who can approve fixing it, and how to reach them. Built for Off-Plate, not for this site.',
   cta:{label:'See the demo', href:'https://claude.ai/code/artifact/ed6fb81f-4f4b-49c5-85e7-96490e19fbc9'}}
];

const STEPS = [
  ['Pick one tool','ChatGPT, Claude, or Gemini, and the free version is fine. Do not spend your first hour comparing tools. For beginner tasks they are all good enough. Pick one and stay with it for a week.'],
  ['Bring a real task','Skip test questions like "write me a poem." Bring something real from today: an email you owe someone, a long document you need to understand, a plan you keep postponing. You learn what AI is for by using it on your actual work.'],
  ['Give it the whole picture','Write to it the way you would brief a colleague. Say who you are, what you need, and what the result should look like. A few full sentences of context beat five keywords.'],
  ['Push back on the draft','The first answer is a draft, and treating it as final is the most common beginner mistake. Tell it what is wrong and ask again, as many times as you need. Check every fact and number before you use it. AI presents its guesses with full confidence.'],
  ['Keep what worked','When a prompt gives you a good result, save it in your notes. Next time you paste it and change a few words instead of starting over. Most of the library on this site came out of that habit.']
];

const CHECKS = [
  'Pick one tool (ChatGPT, Claude, or Gemini) and stay with it for a week',
  'Start on the free version, it is enough to learn on',
  'Bring one real task from today, not a test question',
  'Give it full context, like briefing a colleague',
  'Treat the first answer as a draft and push back',
  'Check every fact and number before you use it',
  'Save the prompts that work. You will reuse them'
];

const KIT = [
  ['The 10 prompts I actually reuse','Copied from my own library, paste-ready, with a note on when each one helps.'],
  ['The plain-words model guide','Which AI to pick for which kind of job, explained without benchmark charts.'],
  ['The first-hour walkthrough','Account, settings, and your first real task, in the order I would do them with you.'],
  ['The cost cheat sheet','What the main tools cost per month, what the free versions cover, and when paying starts to make sense.'],
  ['The &#8220;is this an AI job?&#8221; checklist','One page that tells you whether a task is worth handing to AI at all.'],
  ['The fix-it lines','The short follow-up sentences I use when an answer is almost right.']
];

const BENCH = [
  ['CUT/01','Automation ROI calculator.','The should-you-automate scorecard already answers the same question. Payback framing lives in its fine print. Built later only if demand shows up.'],
  ['CUT/02','Meeting-prep prompt builder.','Rarer than hard emails for a solo operator. The difficult-email builder covers the same translation pain with more reach.'],
  ['CUT/03','Model picker quiz.','Model names change monthly. A stale pick kills trust faster than no tool. The cost calculator teaches the same judgment without naming a model.']
];

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/&(?![a-z#])/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const el = (h) => { const t=document.createElement('template'); t.innerHTML=h.trim(); return t.content; };
/* Real URLs, not hash fragments. A crawler strips everything after #, so a
   hash-routed site is one indexable page no matter how many views it has.
   Every route is a real file that the server returns on its own. */
/* Two maps: FILE is the real file on disk (what a server-side rewrite serves),
   CLEAN is what the address bar and every generated link show. Netlify
   rewrites /start (200, no visible redirect) to start.html and 301s the old
   start.html link to /start, so both resolve, but /start is canonical. */
const ROUTE_FILE  = {home:'index.html', start:'start.html', library:'library.html',
  tools:'tools.html', bill:'bill.html', channel:'channel.html', about:'about.html', kit:'kit.html'};
const ROUTE_CLEAN = {home:'/', start:'/start', library:'/library', tools:'/tools',
  bill:'/bill', channel:'/channel', about:'/about', kit:'/kit'};
const CLEAN_ROUTE = Object.fromEntries(Object.entries(ROUTE_CLEAN).map(([k,v])=>[v,k]));
const href = (p) => ROUTE_CLEAN[p];
function currentRoute(){
  /* The build's pre-render step opens each route via a file:// URL, which
     has no real pathname to read a route from -- it sets this instead. */
  if(window.__PRERENDER_ROUTE) return window.__PRERENDER_ROUTE;
  let path = location.pathname.replace(/\/$/, '') || '/';
  if(path.endsWith('.html')) path = path.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '') || '/';
  return CLEAN_ROUTE[path] || 'home';
}
const go = (p) => {
  if(p === currentRoute()) return;
  history.pushState({p}, '', href(p));
  render();
};
const shead = (title, lede, cta) => `
  <div class="shead rv">
    <div><h2 class="dsp h2">${title}<i class="dot" style="font-style:normal">.</i></h2>${lede?`<p class="lede">${lede}</p>`:''}</div>
    ${cta||''}
  </div>`;

/* ---------- pages ---------- */
const PAGES = {};

PAGES.home = () => `
<section class="wrap hero">
  <h1 class="dsp h1 hero-head rv">AI should be your superpower<i class="dot" style="font-style:normal">.</i></h1>
  <div class="hero-body rv">
    <p class="lede">Every week a new model drops and Instagram Reels tell you that you are already behind. You are not. I use these tools daily and write down what works, free for you to take.</p>
    <div class="hero-cta">
      <a class="btn btn-ink" href="/library" data-go="library">Browse the library <span class="arw">&#8594;</span></a>
      <a class="btn btn-ghost" href="/bill" data-go="bill">See the apps</a>
    </div>
    <dl class="herostats">
      <div class="hs-coral"><dt>64</dt><dd>free prompts, in eight packs</dd></div>
      <div class="hs-sun"><dt>7</dt><dd>tools that run in your browser</dd></div>
      <div class="hs-peri"><dt>20+</dt><dd>real projects, one day job</dd></div>
      <div class="hs-sage"><dt>0</dt><dd>affiliate links anywhere on this site</dd></div>
    </dl>
  </div>
  <div class="hero-art rv">
    <img src="${IMG.hero}" width="${DIM.hero.w}" height="${DIM.hero.h}" fetchpriority="high" alt="Michael, drawn, with the character peeking over his shoulder">
    <span class="hero-badge" style="top:4%;left:-10px">No affiliate links</span>
    <span class="hero-badge" style="bottom:16%;right:-8px;background:var(--cream)">Built by one person</span>
  </div>
</section>

<div class="marquee" aria-hidden="true"><div class="mq" id="mq"></div></div>


<section class="sec">
  <div class="wrap">
  ${shead('Apps I built','I still use every one of these myself every day.',
    '<a class="btn btn-ghost" href="/bill" data-go="bill">All apps <span class="arw">&#8594;</span></a>')}
  </div>
  <div class="scroll" data-scroller>
    ${APPS.map((a,i)=>{
      const sk = [
        {bg:'var(--coral)', fg:'var(--cream)', sub:'rgba(245,242,232,.84)'},
        {bg:'var(--sun)',   fg:'var(--ink)',   sub:'#4A421F'},
        {bg:'var(--peri)',  fg:'var(--cream)', sub:'rgba(245,242,232,.84)'},
        {bg:'var(--sage)',  fg:'var(--ink)',   sub:'#2E362C'},
        {bg:'var(--cream)', fg:'var(--ink)',   sub:'var(--mute)'}
      ][i % 5];
      const tag = a.cta
        ? `<a class="card lcard" href="${a.cta.href}" target="_blank" rel="noopener" style="text-decoration:none;background:${sk.bg};color:${sk.fg}">`
        : `<a class="card lcard" href="/bill" data-go="bill" style="text-decoration:none;background:${sk.bg};color:${sk.fg}">`;
      return `
      ${tag}
        <img src="${IMG[a.img]}" width="56" height="56" style="border-radius:14px" alt="${esc(a.n)} app icon">
        <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap"><h3 class="h3">${esc(a.n)}</h3><span class="mono" style="color:${sk.sub}">${esc(a.plat)}</span></div>
        <p class="small" style="color:${sk.sub}">${esc(a.d)}</p>
        <span class="open">${a.cta ? esc(a.cta.label) : 'See it on the Apps page'} <span class="arw" style="color:${sk.fg==='var(--ink)'?'var(--coral)':'var(--sun)'}">${a.cta?'&#8599;':'&#8594;'}</span></span>
      </a>`;}).join('')}
  </div>
</section>

<section class="band sec">
  <div class="wrap split">
    <div class="rv split-copy">
      <h2 class="dsp h2" style="color:var(--cream)">What using it is really like<i class="dot" style="font-style:normal">.</i></h2>
      <p class="lede" style="margin-top:20px">A first draft comes together in minutes and that part feels like magic. Then the real work starts: the checking, the fixing and the small calls only you can make. Most of the time goes there, and none of it gets automated. The shortcuts on this site are for the fast part.</p>
      <div class="splitrow">
        <div><span class="bignum">Minutes</span><span class="numlab">to a first draft that looks finished</span></div>
        <div><span class="bignum" style="color:var(--sun)">Hours</span><span class="numlab">to make it actually true</span></div>
        <div><span class="bignum">0</span><span class="numlab">of that part gets automated</span></div>
      </div>
    </div>
    <div class="rv split-art"><img src="${IMG.lamp}" width="${DIM.lamp.w}" height="${DIM.lamp.h}" alt="A desk lamp lighting the work"></div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
  ${shead('Small tools that do the math for you','Free calculators and checkers that run in your browser: what a month of AI costs, whether your text fits, when a task is worth automating. Type into one and nothing leaves the page.',
    '<a class="btn btn-ghost" href="/tools" data-go="tools">All the tools <span class="arw">&#8594;</span></a>')}
  </div>
  <div class="scroll" data-scroller>
    ${TOOLS.slice(0,5).map((t,i)=>{
      const sk = [
        {bg:'var(--coral)', fg:'var(--cream)', sub:'rgba(245,242,232,.84)', arw:'var(--sun)'},
        {bg:'var(--sun)',   fg:'var(--ink)',   sub:'#4A421F',               arw:'var(--coral)'},
        {bg:'var(--peri)',  fg:'var(--cream)', sub:'rgba(245,242,232,.84)', arw:'var(--sun)'},
        {bg:'var(--sage)',  fg:'var(--ink)',   sub:'#2E362C',               arw:'var(--coral)'},
        {bg:'var(--cream)', fg:'var(--ink)',   sub:'var(--mute)',           arw:'var(--coral)'}
      ][i];
      return `
      <a class="card lcard" href="${LIVE}tools/${t.id}" target="_blank" rel="noopener" style="text-decoration:none;background:${sk.bg};color:${sk.fg}">
        <span class="mono" style="color:${sk.sub}">${esc(t.desig)}</span>
        <h3 class="h3">${esc(t.n)}</h3>
        <p class="small" style="color:${sk.sub}">${esc(t.desc)}</p>
        <span class="open">Open the tool <span class="arw" style="color:${sk.arw}">&#8599;</span></span>
      </a>`;}).join('')}
  </div>
</section>

<section class="wrap sec-tight">
  ${shead('Prompts you can steal right now','Copy one, fill in the brackets and paste it into ChatGPT, Claude or Gemini. These are the ones I reach for most, out of the sixty-four in the full library.',
    '<a class="btn btn-ghost" href="/library" data-go="library">The whole library <span class="arw">&#8594;</span></a>')}
  <div class="autogrid">
    ${PACKS.slice(0,4).map((p,i)=>`
      <a class="pack lcard rv" href="${LIVE}packs/${p.id}" target="_blank" rel="noopener" style="${i===1?'background:var(--sun)':''}">
        <div class="top"><span class="tag">${esc(p.chip)}</span><span class="mono">8 prompts</span></div>
        <h3 class="h3">${esc(p.n)}</h3>
        <p class="small" style="color:var(--soft)">${esc(p.d)}</p>
        <span class="open">Open pack <span class="arw">&#8599;</span></span>
      </a>`).join('')}
  </div>
</section>

<section class="wrap sec">
  ${shead('How it actually goes','Short videos of real builds, the dead ends included. I am filming now and the cards get their links as episodes go up.',
    '<a class="btn btn-ghost" href="/channel" data-go="channel">The channel <span class="arw">&#8594;</span></a>')}
  <div class="grid4">
    ${VIDS.slice(0,4).map((v,i)=>`
      <article class="vid rv">
        <div class="vthumb" style="background:${['var(--sage)','var(--peri)','var(--coral)','var(--sun)'][i]}"><span class="p"></span><span class="soon">Filming</span></div>
        <div class="vbody"><h3 class="h4">${esc(v.t)}</h3><p class="small">${esc(v.d)}</p></div>
      </article>`).join('')}
  </div>
</section>

<section class="band-sun sec" style="border-top:2px solid var(--ink);border-bottom:2px solid var(--ink)">
  <div class="wrap split">
    <div class="rv split-copy">
      <h2 class="dsp h2">Everything I would hand a friend starting out<i class="dot" style="font-style:normal">.</i></h2>
      <p class="lede" style="color:#4A421F;margin-top:20px">The full thing is written out on the kit page before any email is asked for: the prompts I reuse, the model guide, the first-hour walkthrough, the cost cheat sheet and the rest.</p>
      <ol class="kitlist">
        <li><span>01</span>The 10 prompts I actually reuse</li>
        <li><span>02</span>The plain-words model guide</li>
        <li><span>03</span>The first-hour walkthrough</li>
        <li><span>04</span>The cost cheat sheet</li>
        <li><span>05</span>The &#8220;is this an AI job?&#8221; checklist</li>
        <li><span>06</span>The fix-it lines</li>
      </ol>
      <p style="margin-top:28px"><a class="btn btn-ink" href="/kit" data-go="kit">See what is inside <span class="arw">&#8594;</span></a></p>
    </div>
    <div class="rv split-art"><img src="${IMG.kiosk}" width="${DIM.kiosk.w}" height="${DIM.kiosk.h}" alt="A small corner shop with the name over the awning"></div>
  </div>
</section>`;

PAGES.start = () => `
<section class="wrap phero">
  <div class="phero-grid">
    <div class="rv">
      <h1 class="dsp h1" style="font-size:clamp(40px,6vw,80px)">Your first hour with AI<i class="dot" style="font-style:normal">.</i></h1>
      <p class="lede" style="margin-top:20px;max-width:52ch">Tick the checklist off as you go and the full guide is underneath. It is the exact first hour I would walk a friend through: one real task, no theory.</p>
    </div>
    <div class="phero-art rv"><img src="${IMG.lamp}" width="${DIM.lamp.w}" height="${DIM.lamp.h}" alt="A desk lamp lighting the work"></div>
  </div>
</section>

<section class="wrap sec-tight">
  <div class="clbox rv">
    <div class="clhead">
      <h2 class="dsp" style="font-size:clamp(24px,2.6vw,34px)">The checklist</h2>
      <span class="clprog" id="clprog" role="status" aria-live="polite">0 of 7 done</span>
    </div>
    <ul class="cl" id="cl">
      ${CHECKS.map((c,i)=>`<li><label><input type="checkbox" data-cl="${i}"><span class="t">${esc(c)}</span></label></li>`).join('')}
    </ul>
  </div>
</section>

<section class="wrap sec">
  ${shead('Your first hour, step by step','')}
  <div class="steps">
    ${STEPS.map((s,i)=>`
      <article class="step rv">
        <div class="n">${String(i+1).padStart(2,'0')}</div>
        <h3 class="h3">${esc(s[0])}</h3>
        <p class="small" style="color:var(--soft);font-size:14.5px">${esc(s[1])}</p>
      </article>`).join('')}
  </div>
</section>

<section class="band sec">
  <div class="wrap closer">
    <h2 class="dsp h2" style="color:var(--cream)">That is the hour<i class="dot" style="font-style:normal">.</i></h2>
    <p class="lede">When you want prompts already written this way, the library is next door. Sixty-four of them, in eight packs, free.</p>
    <a class="btn btn-onink" href="/library" data-go="library">Open the prompt library <span class="arw">&#8594;</span></a>
  </div>
</section>`;

PAGES.library = () => `
<section class="wrap phero">
  <div class="phero-grid">
    <div class="rv">
      <h1 class="dsp h1" style="font-size:clamp(44px,6.6vw,92px)">Steal these prompts<i class="dot" style="font-style:normal">.</i></h1>
      <p class="lede" style="margin-top:20px;max-width:52ch">Sixty-four prompts in eight packs, all free. Copy one, fill in the brackets and paste it into ChatGPT, Claude or Gemini. These are the ones I keep going back to.</p>
    </div>
    <div class="phero-art rv"><img src="${IMG.sign}" width="${DIM.sign.w}" height="${DIM.sign.h}" alt="A hanging shop sign reading Michael's Corner"></div>
  </div>
</section>

<section class="wrap sec-tight">
  <div class="search rv">
    <svg aria-hidden="true" width="19" height="19" viewBox="0 0 19 19" fill="none" style="flex:none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/><path d="M12.6 12.6 17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    <input type="search" id="libq" placeholder="Search the eight packs" autocomplete="off" aria-label="Search the prompt packs">
  </div>
  <p class="mono rv" style="margin:22px 0 14px" id="libcount">8 packs, sorted by who they are for</p>
  <div class="autogrid" id="packgrid"></div>
</section>

<section class="band sec">
  <div class="wrap closer">
    <h2 class="dsp h2" style="color:var(--cream)">Make it yours<i class="dot" style="font-style:normal">.</i></h2>
    <p class="lede">Copy anything, change the words and make it yours. If one of them saves you an hour this week, the page has done its job.</p>
    <a class="btn btn-onink" href="/kit" data-go="kit">Get the free kit <span class="arw">&#8594;</span></a>
  </div>
</section>`;

PAGES.tools = () => `
<section class="wrap phero">
  <div class="phero-grid">
    <div class="rv">
      <h1 class="dsp h1">Tools<i class="dot" style="font-style:normal">.</i></h1>
      <p class="lede" style="margin-top:20px;max-width:52ch">Small tools that run in your browser. Open any one and the number is real, computed on the spot, and nothing you type leaves the page.</p>
    </div>
    <div class="phero-art rv"><img src="${IMG.machine}" width="${DIM.machine.w}" height="${DIM.machine.h}" alt="A workshop machine with a screen"></div>
  </div>
</section>

<section class="wrap sec-tight">
  <div class="rv" style="display:flex;gap:16px;justify-content:space-between;align-items:center;flex-wrap:wrap;margin-bottom:24px">
    <div class="chips" id="tchips"></div>
    <div class="search" style="max-width:300px;padding:9px 18px"><input type="search" id="tq" placeholder="Search tools" aria-label="Search tools"></div>
  </div>
  <div class="toolsplit">
    <div>
      <div id="trows" style="display:flex;flex-direction:column;gap:26px"></div>
      <p class="lede" id="tempty" hidden style="padding:20px 0">No tools match that. Try another word or clear the filter.</p>
    </div>
    <aside class="benchcol">
      <div class="card rv" style="gap:10px">
        <h2 class="h3">Tools I decided not to build</h2>
        <p class="small">Three got planned and then cut, and the reason for each is written down so the same idea does not come back next month.</p>
        <ul class="bench">
          ${BENCH.map(b=>`<li><span class="bn">${b[0]}</span><span class="small" style="color:var(--soft)"><b style="color:var(--ink)">${esc(b[1])}</b> ${esc(b[2])}</span></li>`).join('')}
        </ul>
      </div>
      <div class="card card-ink rv" style="gap:10px">
        <h2 class="h3" style="color:var(--cream)">What has to be true before I build one</h2>
        <ul class="ticks">
          <li>It answers a question you would otherwise guess at.</li>
          <li>It runs entirely in your browser, with no key and no account.</li>
          <li>The math is visible. You can argue with it.</li>
          <li>It does not go stale the week a model is renamed.</li>
        </ul>
      </div>
    </aside>
  </div>
</section>

<section class="band sec">
  <div class="wrap closer">
    <h2 class="dsp h2" style="color:var(--cream)">Nothing you type leaves this page<i class="dot" style="font-style:normal">.</i></h2>
    <p class="lede">Every tool runs in your browser and there is no server behind it, so there is nowhere for your data to go. Close the tab and it is gone.</p>
    <a class="btn btn-onink" href="/library" data-go="library">Open the prompt library <span class="arw">&#8594;</span></a>
  </div>
</section>`;

PAGES.bill = () => `
<section class="wrap phero">
  <div class="phero-grid">
    <div class="rv">
      <h1 class="dsp h1">Apps<i class="dot" style="font-style:normal">.</i></h1>
      <p class="lede" style="margin-top:20px;max-width:52ch">Eight things I built because I needed them, and still open every day.</p>
    </div>
    <div class="phero-art rv"><img src="${IMG.machine}" width="${DIM.machine.w}" height="${DIM.machine.h}" alt="A workshop machine with a screen"></div>
  </div>
</section>

<section class="wrap sec-tight">
  <div class="grid2">
    ${APPS.map(a=>`
      <article class="app rv">
        <img src="${IMG[a.img]}" width="${DIM[a.img].w}" height="${DIM[a.img].h}" alt="${esc(a.n)} app icon">
        <div>
          <div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap"><h2 class="h3">${a.n}</h2><span class="plat">${esc(a.plat)}</span></div>
          <p class="small" style="margin-top:9px;color:var(--soft)">${esc(a.d)}</p>
          ${a.cta?`<p style="margin:18px 0 0"><a class="btn btn-sun" style="padding:11px 20px" href="${a.cta.href}" target="_blank" rel="noopener">${esc(a.cta.label)} <span class="arw">&#8599;</span></a></p>`:''}
        </div>
      </article>`).join('')}
  </div>
</section>

<section class="band sec">
  <div class="wrap closer">
    <h2 class="dsp h2" style="color:var(--cream)">Built by one person<i class="dot" style="font-style:normal">.</i></h2>
    <p class="lede">None of these needed a team. If you want to see how one gets made, the videos show the whole thing, dead ends included.</p>
    <a class="btn btn-onink" href="/channel" data-go="channel">Watch the videos <span class="arw">&#8594;</span></a>
  </div>
</section>`;

PAGES.channel = () => `
<section class="wrap phero">
  <div class="phero-grid">
    <div class="rv">
      <h1 class="dsp h1">Watch and learn<i class="dot" style="font-style:normal">.</i></h1>
      <p class="lede" style="margin-top:20px;max-width:52ch">Plain talk about real builds, with the dead ends left in. Filter by topic or search for one.</p>
      
    </div>
    <div class="phero-art rv"><img src="${IMG.cornerman}" width="${DIM.cornerman.w}" height="${DIM.cornerman.h}" alt="A boxing corner with a stool and towel"></div>
  </div>
</section>

<section class="wrap sec-tight">
  <p class="notice rv"><span class="blip"></span> Filming now. Every card below becomes a real link the day its episode goes up.</p>

  <div class="feat rv" style="margin-top:26px">
    <div class="thumb"><span class="play"></span></div>
    <div style="padding:clamp(24px,3vw,40px)">
      <h2 class="dsp" style="font-size:clamp(24px,2.8vw,38px);color:var(--cream)">Your first hour with an AI assistant</h2>
      <p class="lede" style="margin-top:14px;max-width:44ch">Set it up and do something useful right away. The exact hour I would walk a friend through, no theory.</p>
      <p style="margin-top:24px"><a class="btn btn-onink" href="/start" data-go="start">Read the written version <span class="arw">&#8594;</span></a></p>
    </div>
  </div>

  <div class="rv" style="display:flex;gap:16px;justify-content:space-between;align-items:center;flex-wrap:wrap;margin:34px 0 24px">
    <div class="chips" id="vchips"></div>
    <div class="search" style="max-width:300px;padding:9px 18px"><input type="search" id="vq" placeholder="Search videos" aria-label="Search videos"></div>
  </div>
  <div id="vrows" style="display:flex;flex-direction:column;gap:30px"></div>
  <p class="lede" id="vempty" hidden style="padding:20px 0">No videos match that. Try another topic.</p>
</section>

<section class="band sec">
  <div class="wrap closer">
    <h2 class="dsp h2" style="color:var(--cream)">Every build, dead ends included<i class="dot" style="font-style:normal">.</i></h2>
    <p class="lede">The parts that worked and the parts that broke, both shown. Episodes land here as they go up.</p>
    <a class="btn btn-onink" href="/library" data-go="library">Take the prompts in the meantime <span class="arw">&#8594;</span></a>
  </div>
</section>`;

PAGES.about = () => `
<section class="wrap phero abouthero">
  <h1 class="dsp h1 rv" style="font-size:clamp(40px,6.6vw,150px);grid-column:1/-1">Not a developer.<br>I build anyway<i class="dot" style="font-style:normal">.</i></h1>
  <p class="lede rv" style="max-width:56ch;align-self:end">I am Michael. A normal day job, and more than twenty finished projects on the side.</p>
  <div class="abouthero-art rv"><img src="${IMG.hero}" width="${DIM.hero.w}" height="${DIM.hero.h}" fetchpriority="high" alt="Michael, drawn, with the character peeking over his shoulder"></div>
</section>

<section class="wrap sec-tight">
  <div class="profile">
    <div class="rail">
      <div class="sidenote rv">
        <h3 class="h4" style="margin-bottom:12px">What I got good at</h3>
        <div class="r2"><span>Describing what I want</span><span class="mono">daily</span></div>
        <div class="r2"><span>Pushing back on a wrong answer</span><span class="mono">daily</span></div>
        <div class="r2"><span>Doing the part it will not do</span><span class="mono">daily</span></div>
        <div class="r2"><span>Writing code</span><span class="mono">no</span></div>
      </div>
      <div class="sidenote rv">
        <h3 class="h4" style="margin-bottom:12px">Where to find me</h3>
        <div style="display:flex;flex-direction:column;gap:7px">
          <a href="mailto:mihael.florian@gmail.com" style="font-size:14px">mihael.florian@gmail.com</a>
          <a href="/channel" data-go="channel" style="font-size:14px">Watch</a>
          <a href="/bill" data-go="bill" style="font-size:14px">Apps</a>
        </div>
      </div>
    </div>

    <div class="prose rv">
      <p class="leadin">I am not a developer. I have a normal day job, and I build things with AI anyway.</p>
      <p>The list so far includes a finance app that tracks my debts and my budget, a training site with a 3D wireframe figure I could never have coded myself, a road-trip planner with maps and expense splitting that four of us used on a real holiday in Italy, two Chrome extensions, a small tool that turns one sentence into a Spotify playlist, and this website.</p>
      <p>None of that made me an engineer. What I got good at is different: describing what I want clearly, pushing back when the answer is wrong, and doing the hands-on work a tool will not do for you. Most of what I put here comes straight out of that, the prompts I lean on and the small tools I built.</p>
      <p class="pull">I take what has worked for me and write it down, <span style="color:var(--coral)">free for you to take</span>.</p>
      <p>Two years in, I still have the same day job. I just get more done in the time I have. Take whatever is useful, and let me know how it goes.</p>
    </div>

    <aside class="numrail">
      <div class="rv"><span class="bignum" style="color:var(--ink)">20+</span><span class="numlab" style="color:var(--mute)">projects built, one day job</span></div>
      <div class="rv"><span class="bignum" style="color:var(--coral)">2 yrs</span><span class="numlab" style="color:var(--mute)">of doing this every week</span></div>
      <div class="rv"><span class="bignum" style="color:var(--ink)">0</span><span class="numlab" style="color:var(--mute)">lines of code I could write before</span></div>
      <div class="rv"><span class="bignum" style="color:var(--ink)">1</span><span class="numlab" style="color:var(--mute)">day job, still</span></div>
    </aside>
  </div>
</section>`;

PAGES.kit = () => `
<section class="wrap phero">
  <div class="phero-grid">
    <div class="rv">
      <h1 class="dsp h1" style="font-size:clamp(38px,5.4vw,74px)">Michael&#8217;s AI Starter Kit<i class="dot" style="font-style:normal">.</i></h1>
      <p class="lede" style="margin-top:20px;max-width:52ch">Everything I would hand a friend who is starting with AI this week. The full list is below, so you know exactly what you trade your email for.</p>
    </div>
    <div class="phero-art rv"><img src="${IMG.kiosk}" width="${DIM.kiosk.w}" height="${DIM.kiosk.h}" alt="A small corner shop with the name over the awning"></div>
  </div>
</section>

<section class="wrap sec-tight">
  <div class="slip rv">
    <div class="sliphead"><span>Packing slip</span><span>6 items / free</span></div>
    <div class="sliprows">
    ${KIT.map((k,i)=>`<div class="mrow"><span class="q">${String(i+1).padStart(2,'0')}</span><div><p class="h4" style="margin-bottom:6px">${k[0]}</p><p class="small">${k[1]}</p></div></div>`).join('')}
    </div>
  </div>

  <div class="rv" style="margin-top:36px">
    <div class="bar"><i style="width:64%"></i></div>
    <div class="blabels"><span>The free kit, all six items</span><span>the paid vault, later</span></div>
  </div>

  <div class="card rv sendbox" style="margin-top:36px;background:var(--sun);padding:clamp(26px,3vw,48px)">
    <div>
      <h2 class="dsp h2">Send me the kit<i class="dot" style="font-style:normal">.</i></h2>
      <p class="lede" style="color:#4A421F;margin-top:16px;max-width:52ch">There is no signup form behind this yet. Email me and I reply with the kit. One click below fills in the subject for you.</p>
      <p style="margin:28px 0 0"><a class="btn btn-ink" href="mailto:mihael.florian@gmail.com?subject=Starter%20Kit&amp;body=Hi%20Michael%2C%20please%20send%20me%20the%20AI%20Starter%20Kit.">Email me for the kit <span class="arw">&#8594;</span></a></p>
      <p class="small" style="color:#4A421F;margin-top:16px">I reply by hand, usually within a day.</p>
    </div>
    <ul class="nolist">
      <li>No form</li>
      <li>No list</li>
      <li>No countdown</li>
      <li>No upsell at the end</li>
    </ul>
  </div>

  <div class="grid2 rv" style="margin-top:26px">
    <div class="card"><p class="small">Your address is used for the kit and my occasional emails, never sold, never shared. When the proper list is ready you will be the first on it, and every email will have an unsubscribe link.</p></div>
    <div class="card card-ink"><p class="small">The kit never expires and never gets taken back. After it, I write when I actually have something useful, which is closer to twice a month than twice a day.</p></div>
  </div>
</section>`;

/* ---------- router ---------- */
function navHTML(cur){
  return NAV.map(([id,label])=>
    `<a href="${href(id)}" data-go="${id}"${id===cur?' aria-current="page"':''}>${label}</a>`).join('');
}

function render(){
  const page = currentRoute();
  if(typeof applyMeta === 'function') applyMeta(page);
  document.getElementById('nav').innerHTML = navHTML(page);
  document.getElementById('nav').classList.remove('open');
  if(typeof fitNav === 'function') fitNav();
  document.getElementById('burger').setAttribute('aria-expanded','false');
  const main = document.getElementById('main');
  main.innerHTML = PAGES[page]();
  window.scrollTo({top:0,behavior:'instant'});
  wire(page);
  reveal();
  if(window.__sbPlace) requestAnimationFrame(window.__sbPlace);
}

/* ---------- per-page wiring ---------- */
const ARROW = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';

/* One overlay arrow at each edge of the track, vertically centred, instead of
   a pair of buttons stacked next to the section's own link. Also makes the
   track grab-scrollable with a mouse: touch and the trackpad already scroll
   it natively, a mouse drag did not, so this adds that one path. Runs for
   every [data-scroller] on the page, current or future, with no per-section
   markup required. */
function wireScroller(sc){
  // The wrap must bound only the track itself, not the section's heading/CTA
  // row above it -- otherwise top:50% centres the arrows on the whole
  // section instead of the card row. So a dedicated wrapper is inserted
  // around sc here rather than reusing sc.parentElement.
  let wrap = sc.parentElement;
  if(!wrap.classList.contains('scrollwrap')){
    wrap = document.createElement('div');
    wrap.className = 'scrollwrap';
    sc.parentElement.insertBefore(wrap, sc);
    wrap.appendChild(sc);
  }

  let left = wrap.querySelector(':scope > .edgearrow.left');
  let right = wrap.querySelector(':scope > .edgearrow.right');
  if(!left){
    left = document.createElement('button');
    left.className = 'edgearrow left'; left.setAttribute('aria-label','Scroll left');
    left.innerHTML = ARROW.replace('<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>', '<path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/>');
    wrap.appendChild(left);
  }
  if(!right){
    right = document.createElement('button');
    right.className = 'edgearrow right'; right.setAttribute('aria-label','Scroll right');
    right.innerHTML = ARROW;
    wrap.appendChild(right);
  }

  const step = () => (sc.firstElementChild ? sc.firstElementChild.getBoundingClientRect().width + 16 : 300);
  left.onclick = () => sc.scrollBy({left: -step(), behavior:'smooth'});
  right.onclick = () => sc.scrollBy({left: step(), behavior:'smooth'});

  const updateArrows = () => {
    const max = sc.scrollWidth - sc.clientWidth;
    left.classList.toggle('is-hidden', sc.scrollLeft <= 4);
    right.classList.toggle('is-hidden', sc.scrollLeft >= max - 4 || max <= 4);
  };
  sc.addEventListener('scroll', updateArrows, {passive:true});
  window.addEventListener('resize', updateArrows);
  requestAnimationFrame(updateArrows);

  /* Grab-to-scroll. A short pointer movement still counts as a click on the
     card underneath; only a real drag suppresses it, once, on release.
     Chrome cancels pointer capture if scrollLeft is written synchronously
     inside the pointermove handler that owns the capture, so the write is
     deferred one animation frame instead -- same drag, no dropped gesture. */
  let down = false, dragged = false, startX = 0, startLeft = 0, pendingDx = null, raf = null;
  const applyDx = () => {
    raf = null;
    if(pendingDx === null) return;
    sc.scrollLeft = startLeft - pendingDx;
  };
  sc.addEventListener('pointerdown', e => {
    if(e.pointerType === 'touch') return; // touch already scrolls natively
    if(e.button !== undefined && e.button !== 0) return;
    down = true; dragged = false; startX = e.clientX; startLeft = sc.scrollLeft;
    sc.setPointerCapture(e.pointerId);
  });
  sc.addEventListener('pointermove', e => {
    if(!down) return;
    const dx = e.clientX - startX;
    if(Math.abs(dx) > 4 && !dragged){ dragged = true; sc.classList.add('dragging'); }
    if(dragged){
      e.preventDefault();
      pendingDx = dx;
      if(raf === null) raf = requestAnimationFrame(applyDx);
    }
  });
  const release = () => {
    down = false; dragged = false; sc.classList.remove('dragging');
    pendingDx = null;
    if(raf !== null){ cancelAnimationFrame(raf); raf = null; }
  };
  sc.addEventListener('pointerup', release);
  sc.addEventListener('pointercancel', release);
  sc.addEventListener('pointerleave', () => { if(down) release(); });
  sc.addEventListener('click', e => {
    if(dragged){ e.preventDefault(); e.stopPropagation(); }
    dragged = false;
  }, true);
}

function wire(page){
  document.querySelectorAll('[data-scroller]').forEach(wireScroller);

  if(page === 'home'){
    const words = ['Free prompts','No affiliate links','Built by one person','Dead ends included'];
    const one = words.map(w=>`<span>${w} <i class="dot" style="font-style:normal">&#9679;</i></span>`).join('');
    const mq = document.getElementById('mq');
    // one half of the track must be at least as wide as the viewport, or the
    // translate(-50%) loop shows empty space at the seam on a wide screen.
    mq.innerHTML = one;
    const unit = mq.scrollWidth || 1;
    const reps = Math.max(2, Math.ceil((window.innerWidth + 200) / unit));
    mq.innerHTML = one.repeat(reps * 2);
    mq.style.setProperty('--mqdur', Math.round(unit * reps / 46) + 's');
  }

  if(page === 'start'){
    const boxes = [...document.querySelectorAll('[data-cl]')];
    const prog = document.getElementById('clprog');
    const upd = () => {
      const n = boxes.filter(b=>b.checked).length;
      prog.textContent = n + ' of ' + boxes.length + ' done';
      prog.style.color = n === boxes.length ? 'var(--coral)' : '';
    };
    boxes.forEach(b => b.addEventListener('change', upd));
    upd();
  }

  if(page === 'library'){
    const q = document.getElementById('libq'), grid = document.getElementById('packgrid'), count = document.getElementById('libcount');
    const draw = () => {
      const s = q.value.trim().toLowerCase();
      const hits = PACKS.filter(p => !s || (p.n + ' ' + p.chip + ' ' + p.d).toLowerCase().includes(s));
      count.textContent = s ? (hits.length + (hits.length === 1 ? ' pack matches' : ' packs match')) : '8 packs, sorted by who they are for';
      grid.innerHTML = hits.length ? hits.map((p,i)=>`
        <a class="pack lcard" href="${LIVE}packs/${p.id}" target="_blank" rel="noopener"${i%3===1?' style="background:var(--sun)"':''}>
          <div class="top"><span class="tag">${esc(p.chip)}</span><span class="mono">8 prompts</span></div>
          <h2 class="h3">${esc(p.n)}</h2>
          <p class="small" style="color:var(--soft)">${esc(p.d)}</p>
          <span class="open">Open pack <span class="arw">&#8599;</span></span>
        </a>`).join('')
        : '<p class="lede">No pack matches that. Try a shorter or different word.</p>';
    };
    q.addEventListener('input', draw); draw();
  }

  if(page === 'tools'){
    const chips = document.getElementById('tchips'), rows = document.getElementById('trows'),
          q = document.getElementById('tq'), empty = document.getElementById('tempty');
    let filter = 'all';
    const drawChips = () => {
      chips.innerHTML = ['all', ...TCATS].map(c =>
        `<button class="chip" data-c="${esc(c)}" aria-pressed="${filter===c}">${c==='all'?'All tools':esc(c)}</button>`).join('');
      chips.querySelectorAll('.chip').forEach(b => b.onclick = () => { filter = b.dataset.c; drawChips(); draw(); });
    };
    const draw = () => {
      const s = q.value.trim().toLowerCase();
      const hits = TOOLS.filter(t => (filter === 'all' || t.cat === filter) && (!s || (t.n+' '+t.desc+' '+t.hint).toLowerCase().includes(s)));
      empty.hidden = hits.length > 0;
      const byCat = {};
      hits.forEach(t => (byCat[t.cat] = byCat[t.cat] || []).push(t));
      rows.innerHTML = TCATS.filter(c => byCat[c]).map(c => `
        <div>
          <h2 class="h4" style="color:var(--mute);margin-bottom:12px">${esc(c)}</h2>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${byCat[c].map(t=>`
              <a class="trow" href="${LIVE}tools/${t.id}" target="_blank" rel="noopener">
                <span class="desig">${esc(t.desig)}</span>
                <span style="max-width:78ch"><span class="h4" style="display:block">${esc(t.n)}</span><span class="small" style="display:block;margin-top:6px;color:var(--soft)">${esc(t.desc)}</span><span class="hint">${esc(t.hint)}</span></span>
                <span class="open" style="margin:0">Open <span class="arw">&#8599;</span></span>
              </a>`).join('')}
          </div>
        </div>`).join('');
    };
    q.addEventListener('input', draw); drawChips(); draw();
  }

  if(page === 'channel'){
    const chips = document.getElementById('vchips'), rows = document.getElementById('vrows'),
          q = document.getElementById('vq'), empty = document.getElementById('vempty');
    let filter = 'all';
    const drawChips = () => {
      chips.innerHTML = ['all', ...VCATS].map(c =>
        `<button class="chip" data-c="${esc(c)}" aria-pressed="${filter===c}">${c==='all'?'Everything':esc(c)}</button>`).join('');
      chips.querySelectorAll('.chip').forEach(b => b.onclick = () => { filter = b.dataset.c; drawChips(); draw(); });
    };
    const draw = () => {
      const s = q.value.trim().toLowerCase();
      const hits = VIDS.filter(v => (filter === 'all' || v.c === filter) && (!s || (v.t+' '+v.d).toLowerCase().includes(s)));
      empty.hidden = hits.length > 0;
      const byCat = {};
      hits.forEach(v => (byCat[v.c] = byCat[v.c] || []).push(v));
      rows.innerHTML = VCATS.filter(c => byCat[c]).map(c => `
        <div>
          <div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:14px">
            <h2 class="h3">${esc(c)}</h2><span class="mono">${byCat[c].length} planned</span>
          </div>
          <div class="grid4">
            ${byCat[c].map((v,j)=>`
              <article class="vid">
                <div class="vthumb" style="background:${['var(--sage)','var(--peri)','var(--coral)','var(--sun)'][j%4]}"><span class="p"></span><span class="soon">Filming</span></div>
                <div class="vbody"><h3 class="h4">${esc(v.t)}</h3><p class="small">${esc(v.d)}</p></div>
              </article>`).join('')}
          </div>
        </div>`).join('');
      reveal();
    };
    q.addEventListener('input', draw); drawChips(); draw();
  }
}

/* ---------- reveal ---------- */
let io;
function reveal(){
  if(!('IntersectionObserver' in window)){ document.querySelectorAll('.rv').forEach(n=>n.classList.add('in')); return; }
  if(io) io.disconnect();
  io = new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }}), {rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rv:not(.in)').forEach(n=>io.observe(n));
}

/* ---------- global ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-go]');
  if(!t) return;
  if(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  go(t.dataset.go);
});
document.getElementById('burger').onclick = function(){
  const n = document.getElementById('nav'), open = n.classList.toggle('open');
  this.setAttribute('aria-expanded', String(open));
};
/* Decide the header layout by measuring, not by guessing a breakpoint.
   Every measurement is taken with the header forced into its full-width state,
   so the burger is out of the flow and the nav is a real row. */
let navNeed = 0;
function measureNav(){
  const hdr = document.getElementById('hdr');
  const wasCompact = hdr.classList.contains('compact');
  hdr.classList.add('measuring');
  hdr.classList.remove('compact');
  const htop = hdr.querySelector('.htop');
  const gap = parseFloat(getComputedStyle(htop).columnGap) || 24;
  const pad = parseFloat(getComputedStyle(hdr.querySelector('.wrap')).paddingLeft) || 20;
  navNeed = hdr.querySelector('.brand').offsetWidth
          + document.getElementById('nav').scrollWidth
          + hdr.querySelector('.hend').offsetWidth
          + gap * 2 + pad * 2 + 20;
  hdr.classList.remove('measuring');
  if(wasCompact) hdr.classList.add('compact');
}
function fitNav(){
  const hdr = document.getElementById('hdr');
  measureNav();
  hdr.classList.toggle('compact', navNeed > window.innerWidth);
  if(!hdr.classList.contains('compact')) document.getElementById('nav').classList.remove('open');
}
/* ---------- custom scrollbar ---------- */
(function(){
  const bar = document.getElementById('sb'), thumb = document.getElementById('sbt');
  if(!bar || !thumb) return;
  const PAD = 4, MIN = 40;
  let track = 0, thumbH = 0, range = 0;

  function measure(){
    const doc = document.documentElement;
    const sh = doc.scrollHeight, ch = window.innerHeight;
    range = sh - ch;
    if(range <= 4){ bar.classList.remove('on'); return false; }
    bar.classList.add('on');
    track = ch - PAD * 2;
    thumbH = Math.max(MIN, Math.round(track * (ch / sh)));
    thumb.style.height = thumbH + 'px';
    return true;
  }
  function place(){
    if(!measure()) return;
    const y = PAD + (track - thumbH) * (window.scrollY / range);
    thumb.style.transform = 'translateY(' + Math.round(y) + 'px)';
  }

  let ticking = false;
  const onScroll = () => { if(ticking) return; ticking = true;
    requestAnimationFrame(()=>{ place(); ticking = false; }); };
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', place);
  if(window.ResizeObserver) new ResizeObserver(place).observe(document.body);

  // dragging the thumb
  let dragging = false, grabOffset = 0;
  thumb.addEventListener('pointerdown', e => {
    if(!measure()) return;
    dragging = true; bar.classList.add('drag');
    grabOffset = e.clientY - thumb.getBoundingClientRect().top;
    thumb.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  thumb.addEventListener('pointermove', e => {
    if(!dragging) return;
    const y = e.clientY - grabOffset - PAD;
    const ratio = Math.min(1, Math.max(0, y / (track - thumbH)));
    window.scrollTo({top: ratio * range});
  });
  const stop = e => { if(!dragging) return; dragging = false; bar.classList.remove('drag');
    try{ thumb.releasePointerCapture(e.pointerId); }catch(_){} };
  thumb.addEventListener('pointerup', stop);
  thumb.addEventListener('pointercancel', stop);

  // clicking the track jumps there
  bar.addEventListener('pointerdown', e => {
    if(e.target === thumb || !measure()) return;
    const ratio = Math.min(1, Math.max(0, (e.clientY - PAD - thumbH / 2) / (track - thumbH)));
    window.scrollTo({top: ratio * range, behavior:'smooth'});
  });

  place();
  window.__sbPlace = place;
})();

/* The loader runs once, on the first load only. */
(function(){
  const l = document.getElementById('load');
  if(!l) return;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  const kill = () => { l.classList.add('gone'); setTimeout(()=>{ l.remove(); }, 700); };
  if(reduce){ l.remove(); return; }
  const t0 = performance.now();
  const done = () => setTimeout(kill, Math.max(0, 1280 - (performance.now() - t0)));
  if(document.readyState === 'complete') done(); else window.addEventListener('load', done);
  setTimeout(kill, 3200);   // never trap the visitor behind it
})();
window.addEventListener('resize', fitNav);
window.addEventListener('popstate', render);
(function(){
  const m = (location.hash||'').match(/^#\/([a-z]*)$/);
  if(m){ const p = m[1]===''? 'home' : m[1];
    if(ROUTE_CLEAN[p]) history.replaceState({p}, '', href(p)); }
})();
render();
fitNav();
if(document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
