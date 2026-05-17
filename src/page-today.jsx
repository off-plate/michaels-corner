function PageToday({ go }) {
  const s = window.MC.db.useStore();
  const { StatusPill, FormatPill, LangPill, Empty } = window.MC.ui;

  const active = s.videos.filter(v => v.status !== 'published');
  const recent = s.ideas.filter(i => i.status === 'active').slice(0, 5);
  const upNext = active.filter(v => v.publishDate).sort((a, b) => a.publishDate.localeCompare(b.publishDate)).slice(0, 3);

  const counts = {
    ideas: s.ideas.filter(i => i.status === 'active').length,
    drafting: s.videos.filter(v => v.status === 'drafting').length,
    filming: s.videos.filter(v => v.status === 'filming').length,
    editing: s.videos.filter(v => v.status === 'editing').length,
    published: s.videos.filter(v => v.status === 'published').length,
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Today</h1>
          <p className="page-sub">What's moving right now.</p>
        </div>
      </div>

      <div className="ref-grid ref-grid-2" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))'}}>
        <StatCard label="Ideas" count={counts.ideas} onClick={() => go('ideas')} />
        <StatCard label="Drafting" count={counts.drafting} onClick={() => go('videos')} />
        <StatCard label="Filming" count={counts.filming} onClick={() => go('videos')} />
        <StatCard label="Editing" count={counts.editing} onClick={() => go('videos')} />
        <StatCard label="Published" count={counts.published} onClick={() => go('videos')} accent />
      </div>

      <div className="mt-24">
        <h3 style={{margin: '0 0 12px', fontSize: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em'}}>Up next</h3>
        {upNext.length === 0 ? (
          <div className="card text-sm text-muted">No videos scheduled. Set a publish date on a video to see it here.</div>
        ) : upNext.map(v => (
          <div key={v.id} className="row" onClick={() => go('scripts', v.id)}>
            <div className="label">
              <div className="title">{v.title || 'Untitled'}</div>
              <div className="meta">
                <StatusPill value={v.status} />
                <FormatPill value={v.format} />
                <LangPill value={v.language} />
                <span>📅 {v.publishDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24">
        <h3 style={{margin: '0 0 12px', fontSize: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em'}}>Recent ideas</h3>
        {recent.length === 0 ? (
          <div className="card text-sm text-muted">Capture ideas in the Ideas tab — they show up here.</div>
        ) : recent.map(i => (
          <div key={i.id} className="row" onClick={() => go('ideas')}>
            <div className="label">
              <div className="title">{i.title}</div>
              <div className="meta">
                <FormatPill value={i.format} />
                <LangPill value={i.language} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, count, onClick, accent }) {
  return (
    <div className="card" onClick={onClick} style={{cursor: 'pointer', textAlign: 'center', padding: '18px 12px'}}>
      <div style={{fontSize: 28, fontWeight: 700, color: accent ? 'var(--accent)' : 'var(--fg)', letterSpacing: '-0.02em'}}>{count}</div>
      <div className="text-xs text-muted" style={{textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginTop: 4}}>{label}</div>
    </div>
  );
}

window.MC.PageToday = PageToday;
