const NAV = [
  { group: 'Work', items: [
    { key: 'today', label: 'Today', icon: '☀️' },
    { key: 'ideas', label: 'Ideas', icon: '💡' },
    { key: 'videos', label: 'Videos', icon: '🎬' },
    { key: 'scripts', label: 'Scripts', icon: '📝' },
    { key: 'checklists', label: 'Checklists', icon: '✅' },
  ]},
  { group: 'Reference', items: [
    { key: 'setdesign', label: 'Set Design', icon: '🎥' },
    { key: 'camera', label: 'Camera Setup', icon: '📷' },
    { key: 'brand', label: 'Brand', icon: '🎨' },
  ]}
];

const MOBILE_NAV = [
  { key: 'today', label: 'Today', icon: '☀️' },
  { key: 'ideas', label: 'Ideas', icon: '💡' },
  { key: 'videos', label: 'Videos', icon: '🎬' },
  { key: 'checklists', label: 'Lists', icon: '✅' },
  { key: 'setdesign', label: 'Set', icon: '🎥' },
];

function App() {
  // Route is "page" + optional "id" for detail pages
  const [page, setPage] = React.useState(() => {
    const h = window.location.hash.replace('#', '');
    return h.split('/')[0] || 'today';
  });
  const [pageId, setPageId] = React.useState(() => {
    const h = window.location.hash.replace('#', '');
    return h.split('/')[1] || null;
  });

  function go(p, id = null) {
    setPage(p);
    setPageId(id);
    window.location.hash = id ? p + '/' + id : p;
    window.scrollTo(0, 0);
  }

  React.useEffect(() => {
    function onHash() {
      const h = window.location.hash.replace('#', '');
      const [p, id] = h.split('/');
      setPage(p || 'today');
      setPageId(id || null);
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const pages = {
    today: () => <window.MC.PageToday go={go} />,
    ideas: () => <window.MC.PageIdeas go={go} />,
    videos: () => <window.MC.PageVideos go={go} />,
    scripts: () => <window.MC.PageScripts go={go} videoId={pageId} />,
    checklists: () => <window.MC.PageChecklists go={go} videoId={pageId} />,
    setdesign: () => <window.MC.PageSetDesign />,
    camera: () => <window.MC.PageCamera />,
    brand: () => <window.MC.PageBrand />,
  };

  const PageEl = pages[page] || pages.today;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">MC</div>
          <div className="brand-name">Michael's Corner</div>
        </div>
        <nav className="nav">
          {NAV.map(group => (
            <React.Fragment key={group.group}>
              <div className="nav-group-label">{group.group}</div>
              {group.items.map(item => (
                <button
                  key={item.key}
                  className={'nav-item ' + (page === item.key ? 'active' : '')}
                  onClick={() => go(item.key)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>
      </aside>

      <main className="main">
        <header className="mobile-header">
          <div className="brand-mark">MC</div>
          <div className="brand-name">Michael's Corner</div>
        </header>
        <PageEl />
      </main>

      <nav className="mobile-nav">
        {MOBILE_NAV.map(item => (
          <button
            key={item.key}
            className={page === item.key ? 'active' : ''}
            onClick={() => go(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
