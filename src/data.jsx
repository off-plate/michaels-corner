// Data layer — localStorage for now, Supabase swap-in later.
// All pages read/write through window.MC.db.

const STORAGE_KEY = 'mc-data-v1';

const DEFAULT_DATA = {
  ideas: [],
  videos: [],
  checklistRuns: {}, // { [videoId-platform]: { [itemKey]: bool } }
  brand: {
    primary: '#e7c66b',
    secondary: '',
    bgDark: '#0e0e10',
    bgLight: '#f3f3f0',
    text: '#f3f3f0',
    displayFont: '',
    bodyFont: 'Inter',
    voiceNotes: ''
  },
  meta: { updatedAt: null }
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(DEFAULT_DATA), ...parsed };
  } catch (e) {
    return structuredClone(DEFAULT_DATA);
  }
}

function save(data) {
  data.meta = { updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Reactive store: subscribe to changes
const listeners = new Set();
let state = load();

function emit() { listeners.forEach(fn => fn(state)); }

function useStore() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const fn = () => force();
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return state;
}

// Mutators
const db = {
  getState: () => state,
  useStore,

  // Ideas
  addIdea(data) {
    const idea = { id: uid(), createdAt: new Date().toISOString(), status: 'active', ...data };
    state.ideas.unshift(idea);
    save(state); emit();
    return idea;
  },
  updateIdea(id, patch) {
    state.ideas = state.ideas.map(i => i.id === id ? { ...i, ...patch } : i);
    save(state); emit();
  },
  deleteIdea(id) {
    state.ideas = state.ideas.filter(i => i.id !== id);
    save(state); emit();
  },
  promoteIdeaToVideo(id) {
    const idea = state.ideas.find(i => i.id === id);
    if (!idea) return;
    const video = db.addVideo({
      title: idea.title,
      language: idea.language || 'en',
      format: idea.format || 'long',
      hookIdea: idea.notes || '',
    });
    db.updateIdea(id, { status: 'used', videoId: video.id });
    return video;
  },

  // Videos
  addVideo(data) {
    const video = {
      id: uid(),
      createdAt: new Date().toISOString(),
      status: 'idea',
      title: '',
      slug: '',
      language: 'en',
      format: 'long',
      targetLength: '',
      publishDate: '',
      hookIdea: '',
      promise: '',
      outline: '',
      script: '',
      bRoll: '',
      cta: '',
      thumbnailConcept: '',
      crossPostPlan: '',
      ...data
    };
    state.videos.unshift(video);
    save(state); emit();
    return video;
  },
  updateVideo(id, patch) {
    state.videos = state.videos.map(v => v.id === id ? { ...v, ...patch } : v);
    save(state); emit();
  },
  deleteVideo(id) {
    state.videos = state.videos.filter(v => v.id !== id);
    Object.keys(state.checklistRuns)
      .filter(k => k.startsWith(id + '-'))
      .forEach(k => delete state.checklistRuns[k]);
    save(state); emit();
  },
  getVideo(id) {
    return state.videos.find(v => v.id === id);
  },

  // Checklist state per video+platform
  getChecklist(videoId, platform) {
    return state.checklistRuns[videoId + '-' + platform] || {};
  },
  toggleChecklistItem(videoId, platform, key) {
    const k = videoId + '-' + platform;
    const cur = state.checklistRuns[k] || {};
    state.checklistRuns[k] = { ...cur, [key]: !cur[key] };
    save(state); emit();
  },
  resetChecklist(videoId, platform) {
    delete state.checklistRuns[videoId + '-' + platform];
    save(state); emit();
  },

  // Brand
  updateBrand(patch) {
    state.brand = { ...state.brand, ...patch };
    save(state); emit();
  },

  // Export / import
  exportJson() {
    return JSON.stringify(state, null, 2);
  },
  importJson(json) {
    try {
      const parsed = JSON.parse(json);
      state = { ...structuredClone(DEFAULT_DATA), ...parsed };
      save(state); emit();
      return true;
    } catch (e) { return false; }
  },
  reset() {
    state = structuredClone(DEFAULT_DATA);
    save(state); emit();
  }
};

window.MC = window.MC || {};
window.MC.db = db;
window.MC.uid = uid;
