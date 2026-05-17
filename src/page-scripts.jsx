function PageScripts({ go, videoId }) {
  const s = window.MC.db.useStore();
  const { Empty, StatusPill } = window.MC.ui;

  if (!videoId) {
    if (s.videos.length === 0) {
      return (
        <div className="page">
          <div className="page-head"><div><h1 className="page-title">Scripts</h1></div></div>
          <Empty icon="📝" title="No videos yet" body="Create a video in the Videos tab to write its script here." />
        </div>
      );
    }
    return (
      <div className="page">
        <div className="page-head"><div><h1 className="page-title">Scripts</h1><p className="page-sub">Pick a video to edit its script.</p></div></div>
        {s.videos.map(v => (
          <div key={v.id} className="row" onClick={() => go('scripts', v.id)}>
            <div className="label">
              <div className="title">{v.title || 'Untitled'}</div>
              <div className="meta"><StatusPill value={v.status} /></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const v = window.MC.db.getVideo(videoId);
  if (!v) {
    return (
      <div className="page">
        <Empty icon="🚫" title="Video not found" action={<button className="btn" onClick={() => go('videos')}>Back to videos</button>} />
      </div>
    );
  }

  function patch(p) { window.MC.db.updateVideo(v.id, p); }
  function del() {
    if (!confirm('Delete this video and its checklists?')) return;
    window.MC.db.deleteVideo(v.id);
    go('videos');
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <button className="btn-ghost btn btn-sm" onClick={() => go('videos')}>← Videos</button>
          <h1 className="page-title" style={{marginTop: 6}}>
            <input
              className="input"
              style={{fontSize: 'inherit', fontWeight: 700, padding: '6px 10px', background: 'transparent', border: '1px solid transparent'}}
              value={v.title}
              onChange={e => patch({ title: e.target.value })}
              onFocus={e => e.target.style.borderColor = 'var(--border)'}
              onBlur={e => e.target.style.borderColor = 'transparent'}
              placeholder="Video title…"
            />
          </h1>
        </div>
        <div className="row-h">
          <button className="btn btn-sm" onClick={() => go('checklists', v.id)}>Checklists →</button>
          <button className="btn btn-sm btn-danger btn-ghost" onClick={del}>Delete</button>
        </div>
      </div>

      <div className="card">
        <h3>Meta</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10}}>
          <Field label="Status">
            <select className="select" value={v.status} onChange={e => patch({ status: e.target.value })}>
              <option value="idea">Idea</option>
              <option value="drafting">Drafting</option>
              <option value="filming">Filming</option>
              <option value="editing">Editing</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Format">
            <select className="select" value={v.format} onChange={e => patch({ format: e.target.value })}>
              <option value="long">Long-form</option>
              <option value="short">Short</option>
            </select>
          </Field>
          <Field label="Language">
            <select className="select" value={v.language} onChange={e => patch({ language: e.target.value })}>
              <option value="en">English</option>
              <option value="cz">Czech</option>
            </select>
          </Field>
          <Field label="Target length">
            <input className="input" value={v.targetLength} onChange={e => patch({ targetLength: e.target.value })} placeholder="8 min / 45 sec" />
          </Field>
          <Field label="Publish date">
            <input className="input" type="date" value={v.publishDate} onChange={e => patch({ publishDate: e.target.value })} />
          </Field>
          <Field label="Slug">
            <input className="input" value={v.slug} onChange={e => patch({ slug: e.target.value })} placeholder="yyyy-mm-dd-slug" />
          </Field>
        </div>
      </div>

      <div className="card">
        <h3>Hook</h3>
        <Field label={'First ' + (v.format === 'short' ? '1–2 seconds' : '5 seconds') + ' — exact words'}>
          <textarea className="textarea" value={v.hookIdea} onChange={e => patch({ hookIdea: e.target.value })} />
        </Field>
        <Field label="One-sentence promise">
          <input className="input" value={v.promise} onChange={e => patch({ promise: e.target.value })} placeholder="What the viewer gets if they stay." />
        </Field>
      </div>

      <div className="card">
        <h3>Outline</h3>
        <Field>
          <textarea className="textarea" style={{minHeight: 100}} value={v.outline} onChange={e => patch({ outline: e.target.value })} placeholder="1. …&#10;2. …&#10;3. …" />
        </Field>
      </div>

      <div className="card">
        <h3>Script</h3>
        <Field>
          <textarea className="textarea" style={{minHeight: 280, fontFamily: 'ui-monospace, monospace', fontSize: 14}} value={v.script} onChange={e => patch({ script: e.target.value })} placeholder="Full script or detailed bullets." />
        </Field>
      </div>

      <div className="card">
        <h3>B-roll / cutaways</h3>
        <Field>
          <textarea className="textarea" value={v.bRoll} onChange={e => patch({ bRoll: e.target.value })} placeholder="List of shots needed." />
        </Field>
      </div>

      <div className="card">
        <h3>CTA</h3>
        <Field>
          <input className="input" value={v.cta} onChange={e => patch({ cta: e.target.value })} placeholder="What do they do after watching?" />
        </Field>
      </div>

      <div className="card">
        <h3>Thumbnail concept</h3>
        <Field>
          <textarea className="textarea" value={v.thumbnailConcept} onChange={e => patch({ thumbnailConcept: e.target.value })} placeholder="Visual, text, reference…" />
        </Field>
      </div>

      <div className="card">
        <h3>Cross-post plan</h3>
        <Field>
          <textarea className="textarea" value={v.crossPostPlan} onChange={e => patch({ crossPostPlan: e.target.value })} placeholder="Which clips → which platforms → when" />
        </Field>
      </div>
    </div>
  );
}

const Field = (p) => window.MC.ui.Field(p);

window.MC.PageScripts = PageScripts;
