function PageVideos({ go }) {
  const s = window.MC.db.useStore();
  const { Empty, StatusPill, FormatPill, LangPill } = window.MC.ui;

  const cols = ['idea', 'drafting', 'filming', 'editing', 'published'];
  const grouped = cols.reduce((acc, c) => {
    acc[c] = s.videos.filter(v => v.status === c);
    return acc;
  }, {});

  function newVideo() {
    const v = window.MC.db.addVideo({ title: 'Untitled video' });
    go('scripts', v.id);
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Videos</h1>
          <p className="page-sub">Pipeline from idea to published.</p>
        </div>
        <button className="btn btn-primary" onClick={newVideo}>+ New video</button>
      </div>

      {s.videos.length === 0 ? (
        <Empty
          icon="🎬"
          title="No videos yet"
          body="Start a video from scratch, or promote an idea from the Ideas tab."
          action={<button className="btn btn-primary" onClick={newVideo}>+ New video</button>}
        />
      ) : (
        <div className="board">
          {cols.map(col => (
            <div key={col} className="board-col">
              <div className="board-col-head">
                <span>{col}</span>
                <span>{grouped[col].length}</span>
              </div>
              {grouped[col].map(v => (
                <div key={v.id} className="board-card" onClick={() => go('scripts', v.id)}>
                  <div className="title">{v.title || 'Untitled'}</div>
                  <div className="meta row-h">
                    <FormatPill value={v.format} />
                    <LangPill value={v.language} />
                    {v.publishDate && <span>📅 {v.publishDate}</span>}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

window.MC.PageVideos = PageVideos;
