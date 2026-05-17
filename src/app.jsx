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

function SignIn() {
  const [email, setEmail] = React.useState('mihael.florian@gmail.com');
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null); setBusy(true);
    try {
      await window.MC.db.signIn(email.trim());
      setSent(true);
    } catch (e) {
      setError(e.message || 'Sign in failed');
    } finally { setBusy(false); }
  }

  return (
    <div style={{display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 20}}>
      <div className="card" style={{maxWidth: 400, width: '100%', padding: 28}}>
        <div className="row-h" style={{marginBottom: 24}}>
          <div className="brand-mark">MC</div>
          <div className="brand-name">Michael's Corner</div>
        </div>
        {sent ? (
          <div>
            <h3 style={{marginTop: 0}}>Check your email</h3>
            <p className="text-muted text-sm">A magic link is on the way to <b>{email}</b>. Click it to log in. The link opens this page authenticated.</p>
            <button className="btn mt-16" onClick={() => { setSent(false); setEmail(''); }}>Use a different email</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h3 style={{marginTop: 0}}>Sign in</h3>
            <p className="text-muted text-sm" style={{marginTop: 4}}>One-tap magic link to your inbox.</p>
            <div className="field mt-16">
              <label>Email</label>
              <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            </div>
            {error && <div className="text-sm" style={{color: 'var(--red)', marginBottom: 12}}>{error}</div>}
            <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={busy}>
              {busy ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function AccountChip({ session }) {
  const [open, setOpen] = React.useState(false);
  if (!session) return null;
  return (
    <div style={{position: 'relative', marginTop: 16, padding: '12px 10px', borderTop: '1px solid var(--border)'}}>
      <button className="nav-item" style={{width: '100%'}} onClick={() => setOpen(!open)}>
        <span className="nav-icon">👤</span>
        <span style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13}}>
          {session.user.email}
        </span>
      </button>
      {open && (
        <div className="card" style={{position: 'absolute', bottom: '100%', left: 8, right: 8, marginBottom: 4, padding: 8, zIndex: 5}}>
          <button className="nav-item" onClick={async () => { await window.MC.db.signOut(); setOpen(false); }}>
            <span className="nav-icon">🚪</span><span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  const { session, loading, online } = window.MC.db.useAuth();
  const [page, setPage] = React.useState(() => {
    const h = window.location.hash.replace('#', '');
    return h.split('/')[0] || 'today';
  });
  const [pageId, setPageId] = React.useState(() => {
    const h = window.location.hash.replace('#', '');
    return h.split('/')[1] || null;
  });

  function go(p, id = null) {
    setPage(p); setPageId(id);
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

  if (loading) {
    return <div style={{display: 'grid', placeItems: 'center', minHeight: '100vh', color: 'var(--muted)'}}>Loading…</div>;
  }
  if (!session) {
    return <SignIn />;
  }

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
        <AccountChip session={session} />
      </aside>

      <main className="main">
        <header className="mobile-header">
          <div className="brand-mark">MC</div>
          <div className="brand-name">Michael's Corner</div>
          <div className="grow" />
          <button className="btn-ghost btn btn-sm" onClick={async () => { if (confirm('Sign out?')) await window.MC.db.signOut(); }}>👤</button>
        </header>
        <PageEl />
      </main>

      <nav className="mobile-nav">
        {MOBILE_NAV.map(item => (
          <button key={item.key} className={page === item.key ? 'active' : ''} onClick={() => go(item.key)}>
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

// Kick off auth — pulls data once session resolves.
window.MC.db.initAuth();
