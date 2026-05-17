// Data layer: Supabase when authenticated, localStorage as offline cache + fallback.
// All pages read/write through window.MC.db.

const SUPABASE_URL = 'https://fhfempisopwsdkmvywbt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_MDxQPm0SzLHFTnDqg-eyyQ_0yposnES';
const STORAGE_KEY = 'mc-data-v1';

const DEFAULT_DATA = {
  ideas: [],
  videos: [],
  checklistRuns: {},
  brand: {
    primary: '#e7c66b', secondary: '', bgDark: '#0e0e10', bgLight: '#f3f3f0',
    text: '#f3f3f0', displayFont: '', bodyFont: 'Inter', voiceNotes: ''
  },
  meta: { updatedAt: null }
};

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    return { ...structuredClone(DEFAULT_DATA), ...JSON.parse(raw) };
  } catch (e) { return structuredClone(DEFAULT_DATA); }
}
function saveLocal(data) {
  data.meta = { updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

// Supabase client
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

// Reactive store
const listeners = new Set();
let state = loadLocal();
let session = null;
let online = false; // true once authed + initial fetch done
let loading = true;

function emit() { listeners.forEach(fn => fn()); }
function useStore() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const fn = () => force();
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return state;
}
function useAuth() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const fn = () => force();
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return { session, online, loading };
}

// =====================================================================
// Mapping between DB row (snake_case) and app state (camelCase)
// =====================================================================
function videoFromRow(r) {
  return {
    id: r.id, title: r.title || '', slug: r.slug || '', language: r.language,
    format: r.format, status: r.status, targetLength: r.target_length || '',
    publishDate: r.publish_date || '', hookIdea: r.hook_idea || '',
    promise: r.promise || '', outline: r.outline || '', script: r.script || '',
    bRoll: r.b_roll || '', cta: r.cta || '', thumbnailConcept: r.thumbnail_concept || '',
    crossPostPlan: r.cross_post_plan || '', createdAt: r.created_at
  };
}
function videoToRow(v) {
  return {
    title: v.title, slug: v.slug, language: v.language, format: v.format, status: v.status,
    target_length: v.targetLength, publish_date: v.publishDate || null,
    hook_idea: v.hookIdea, promise: v.promise, outline: v.outline, script: v.script,
    b_roll: v.bRoll, cta: v.cta, thumbnail_concept: v.thumbnailConcept,
    cross_post_plan: v.crossPostPlan
  };
}
function ideaFromRow(r) {
  return { id: r.id, title: r.title, language: r.language, format: r.format,
           notes: r.notes || '', status: r.status, videoId: r.video_id, createdAt: r.created_at };
}
function ideaToRow(i) {
  return { title: i.title, language: i.language, format: i.format,
           notes: i.notes, status: i.status, video_id: i.videoId || null };
}

// =====================================================================
// Auth
// =====================================================================
async function initAuth() {
  const { data: { session: s } } = await sb.auth.getSession();
  session = s;
  if (session) await pullAll();
  loading = false;
  emit();

  sb.auth.onAuthStateChange(async (_event, s) => {
    const prevUser = session && session.user.id;
    session = s;
    if (s && s.user.id !== prevUser) {
      await pullAll();
    } else if (!s) {
      online = false;
      state = loadLocal();
    }
    emit();
  });
}

async function signIn(email) {
  const redirectTo = window.location.origin + window.location.pathname;
  const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
  if (error) throw error;
}
async function signOut() {
  await sb.auth.signOut();
}

// =====================================================================
// Pull all from Supabase into state
// =====================================================================
async function pullAll() {
  if (!session) return;
  try {
    const userId = session.user.id;
    const [ideas, videos, runs, brand] = await Promise.all([
      sb.from('mc_ideas').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      sb.from('mc_videos').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      sb.from('mc_checklist_runs').select('*').eq('user_id', userId),
      sb.from('mc_brand').select('*').eq('user_id', userId).maybeSingle()
    ]);
    state.ideas = (ideas.data || []).map(ideaFromRow);
    state.videos = (videos.data || []).map(videoFromRow);
    state.checklistRuns = {};
    (runs.data || []).forEach(r => {
      state.checklistRuns[r.video_id + '-' + r.platform] = r.state || {};
    });
    if (brand.data && brand.data.data) {
      state.brand = { ...DEFAULT_DATA.brand, ...brand.data.data };
    }
    saveLocal(state);
    online = true;
    emit();
  } catch (e) {
    console.error('Pull failed:', e);
    online = false;
    emit();
  }
}

// =====================================================================
// Mutators — write-through: update local state immediately, then push to Supabase if signed in.
// =====================================================================
async function addIdea(data) {
  const tempId = uid();
  const idea = { id: tempId, createdAt: new Date().toISOString(), status: 'active', notes: '', language: 'en', format: 'long', ...data };
  state.ideas.unshift(idea);
  saveLocal(state); emit();
  if (session) {
    const { data: row, error } = await sb.from('mc_ideas').insert({ ...ideaToRow(idea), user_id: session.user.id }).select().single();
    if (!error && row) {
      idea.id = row.id; idea.createdAt = row.created_at;
      saveLocal(state); emit();
    }
  }
  return idea;
}
async function updateIdea(id, patch) {
  state.ideas = state.ideas.map(i => i.id === id ? { ...i, ...patch } : i);
  saveLocal(state); emit();
  if (session) {
    await sb.from('mc_ideas').update(ideaToRow({ ...state.ideas.find(i => i.id === id) })).eq('id', id);
  }
}
async function deleteIdea(id) {
  state.ideas = state.ideas.filter(i => i.id !== id);
  saveLocal(state); emit();
  if (session) await sb.from('mc_ideas').delete().eq('id', id);
}
async function promoteIdeaToVideo(id) {
  const idea = state.ideas.find(i => i.id === id);
  if (!idea) return;
  const video = await addVideo({
    title: idea.title, language: idea.language, format: idea.format, hookIdea: idea.notes || ''
  });
  await updateIdea(id, { status: 'used', videoId: video.id });
  return video;
}

async function addVideo(data) {
  const video = {
    id: uid(), createdAt: new Date().toISOString(), status: 'idea',
    title: '', slug: '', language: 'en', format: 'long', targetLength: '', publishDate: '',
    hookIdea: '', promise: '', outline: '', script: '', bRoll: '', cta: '',
    thumbnailConcept: '', crossPostPlan: '', ...data
  };
  state.videos.unshift(video);
  saveLocal(state); emit();
  if (session) {
    const { data: row, error } = await sb.from('mc_videos').insert({ ...videoToRow(video), user_id: session.user.id }).select().single();
    if (!error && row) {
      video.id = row.id; video.createdAt = row.created_at;
      saveLocal(state); emit();
    }
  }
  return video;
}
async function updateVideo(id, patch) {
  state.videos = state.videos.map(v => v.id === id ? { ...v, ...patch } : v);
  saveLocal(state); emit();
  if (session) {
    const v = state.videos.find(v => v.id === id);
    await sb.from('mc_videos').update(videoToRow(v)).eq('id', id);
  }
}
async function deleteVideo(id) {
  state.videos = state.videos.filter(v => v.id !== id);
  Object.keys(state.checklistRuns).filter(k => k.startsWith(id + '-')).forEach(k => delete state.checklistRuns[k]);
  saveLocal(state); emit();
  if (session) await sb.from('mc_videos').delete().eq('id', id);
}
function getVideo(id) { return state.videos.find(v => v.id === id); }

function getChecklist(videoId, platform) {
  return state.checklistRuns[videoId + '-' + platform] || {};
}
async function toggleChecklistItem(videoId, platform, key) {
  const k = videoId + '-' + platform;
  const cur = state.checklistRuns[k] || {};
  const next = { ...cur, [key]: !cur[key] };
  state.checklistRuns[k] = next;
  saveLocal(state); emit();
  if (session) {
    await sb.from('mc_checklist_runs').upsert({
      user_id: session.user.id, video_id: videoId, platform, state: next
    }, { onConflict: 'video_id,platform' });
  }
}
async function resetChecklist(videoId, platform) {
  delete state.checklistRuns[videoId + '-' + platform];
  saveLocal(state); emit();
  if (session) {
    await sb.from('mc_checklist_runs').delete().eq('video_id', videoId).eq('platform', platform);
  }
}

async function updateBrand(patch) {
  state.brand = { ...state.brand, ...patch };
  saveLocal(state); emit();
  if (session) {
    await sb.from('mc_brand').upsert({ user_id: session.user.id, data: state.brand });
  }
}

function exportJson() { return JSON.stringify(state, null, 2); }
function importJson(json) {
  try { state = { ...structuredClone(DEFAULT_DATA), ...JSON.parse(json) }; saveLocal(state); emit(); return true; }
  catch (e) { return false; }
}
function reset() { state = structuredClone(DEFAULT_DATA); saveLocal(state); emit(); }

window.MC = window.MC || {};
window.MC.db = {
  getState: () => state, getSession: () => session, useStore, useAuth,
  initAuth, signIn, signOut, pullAll,
  addIdea, updateIdea, deleteIdea, promoteIdeaToVideo,
  addVideo, updateVideo, deleteVideo, getVideo,
  getChecklist, toggleChecklistItem, resetChecklist,
  updateBrand, exportJson, importJson, reset
};
window.MC.uid = uid;
