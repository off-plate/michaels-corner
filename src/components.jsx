// Shared UI components.

function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2 className="modal-title">{title}</h2>
          <button className="btn-ghost btn" onClick={onClose}>✕</button>
        </div>
        {children}
        {footer && <div className="mt-16" style={{display: 'flex', gap: 8, justifyContent: 'flex-end'}}>{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}

function Empty({ icon, title, body, action }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {action && <div className="mt-16">{action}</div>}
    </div>
  );
}

function LangPill({ value }) {
  return <span className="pill">{(value || '').toUpperCase()}</span>;
}

function FormatPill({ value }) {
  const cls = value === 'short' ? 'pill pill-blue' : 'pill pill-accent';
  return <span className={cls}>{value === 'short' ? 'SHORT' : 'LONG'}</span>;
}

function StatusPill({ value }) {
  const map = {
    idea: ['pill', 'idea'],
    drafting: ['pill pill-blue', 'drafting'],
    filming: ['pill pill-accent', 'filming'],
    editing: ['pill pill-accent', 'editing'],
    published: ['pill pill-green', 'published']
  };
  const [cls, label] = map[value] || ['pill', value];
  return <span className={cls}>{label.toUpperCase()}</span>;
}

window.MC.ui = { Modal, Field, Empty, LangPill, FormatPill, StatusPill };
