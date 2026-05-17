function PageIdeas({ go }) {
  const s = window.MC.db.useStore();
  const { Modal, Field, Empty, FormatPill, LangPill } = window.MC.ui;
  const [adding, setAdding] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [filter, setFilter] = React.useState('active');

  const filtered = s.ideas.filter(i => filter === 'all' || i.status === filter);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Ideas</h1>
          <p className="page-sub">Capture fast. Promote later.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setAdding(true)}>+ New idea</button>
      </div>

      <div className="row-h mt-8" style={{marginBottom: 16}}>
        {['active', 'used', 'parked', 'all'].map(f => (
          <button key={f} className={'btn btn-sm ' + (filter === f ? 'btn-primary' : '')} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty
          icon="💡"
          title="No ideas yet"
          body="Hit + New idea to capture one. One line is enough."
          action={<button className="btn btn-primary" onClick={() => setAdding(true)}>+ New idea</button>}
        />
      ) : filtered.map(i => (
        <div key={i.id} className="row" onClick={() => setEditing(i)}>
          <div className="label">
            <div className="title">{i.title}</div>
            <div className="meta">
              <FormatPill value={i.format} />
              <LangPill value={i.language} />
              {i.status !== 'active' && <span className="pill">{i.status}</span>}
              {i.notes && <span className="text-xs text-muted">— {i.notes.slice(0, 80)}{i.notes.length > 80 ? '…' : ''}</span>}
            </div>
          </div>
        </div>
      ))}

      {(adding || editing) && (
        <IdeaModal
          idea={editing}
          onClose={() => { setAdding(false); setEditing(null); }}
          go={go}
        />
      )}
    </div>
  );
}

function IdeaModal({ idea, onClose, go }) {
  const { Modal, Field } = window.MC.ui;
  const isEdit = !!idea;
  const [form, setForm] = React.useState(idea || {
    title: '', language: 'en', format: 'long', notes: '', status: 'active'
  });

  function update(k, v) { setForm({ ...form, [k]: v }); }
  function save() {
    if (!form.title.trim()) return;
    if (isEdit) window.MC.db.updateIdea(idea.id, form);
    else window.MC.db.addIdea(form);
    onClose();
  }
  function del() {
    if (!confirm('Delete this idea?')) return;
    window.MC.db.deleteIdea(idea.id); onClose();
  }
  function promote() {
    const v = window.MC.db.promoteIdeaToVideo(idea.id);
    onClose();
    if (v) go('scripts', v.id);
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={isEdit ? 'Edit idea' : 'New idea'}
      footer={
        <>
          {isEdit && <button className="btn btn-danger btn-ghost" onClick={del}>Delete</button>}
          {isEdit && form.status === 'active' && <button className="btn" onClick={promote}>Promote → Video</button>}
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </>
      }
    >
      <Field label="Title">
        <input className="input" autoFocus value={form.title} onChange={e => update('title', e.target.value)} placeholder="One line. Don't overthink." />
      </Field>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
        <Field label="Language">
          <select className="select" value={form.language} onChange={e => update('language', e.target.value)}>
            <option value="en">English</option>
            <option value="cz">Czech</option>
          </select>
        </Field>
        <Field label="Format">
          <select className="select" value={form.format} onChange={e => update('format', e.target.value)}>
            <option value="long">Long-form</option>
            <option value="short">Short</option>
          </select>
        </Field>
      </div>
      <Field label="Notes (optional)">
        <textarea className="textarea" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Hook, angle, reference…" />
      </Field>
      {isEdit && (
        <Field label="Status">
          <select className="select" value={form.status} onChange={e => update('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="parked">Parked</option>
            <option value="used">Used</option>
          </select>
        </Field>
      )}
    </Modal>
  );
}

window.MC.PageIdeas = PageIdeas;
