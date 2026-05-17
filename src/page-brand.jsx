function PageBrand() {
  const s = window.MC.db.useStore();
  const { Field } = window.MC.ui;
  const b = s.brand;
  function patch(p) { window.MC.db.updateBrand(p); }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Brand</h1>
          <p className="page-sub">Colors, fonts, voice. One source of truth.</p>
        </div>
      </div>

      <div className="card">
        <h3>Colors</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10}}>
          <ColorField label="Primary" value={b.primary} onChange={v => patch({ primary: v })} />
          <ColorField label="Secondary" value={b.secondary} onChange={v => patch({ secondary: v })} />
          <ColorField label="Background dark" value={b.bgDark} onChange={v => patch({ bgDark: v })} />
          <ColorField label="Background light" value={b.bgLight} onChange={v => patch({ bgLight: v })} />
          <ColorField label="Text" value={b.text} onChange={v => patch({ text: v })} />
        </div>
      </div>

      <div className="card">
        <h3>Typography</h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
          <Field label="Display / thumbnails">
            <input className="input" value={b.displayFont} onChange={e => patch({ displayFont: e.target.value })} placeholder="e.g. Inter, Migra" />
          </Field>
          <Field label="Body / captions">
            <input className="input" value={b.bodyFont} onChange={e => patch({ bodyFont: e.target.value })} />
          </Field>
        </div>
      </div>

      <div className="card">
        <h3>Voice & tone</h3>
        <Field>
          <textarea className="textarea" style={{minHeight: 160}} value={b.voiceNotes} onChange={e => patch({ voiceNotes: e.target.value })} placeholder="Direct, no padding. Slightly warm. CZ: conversational. EN: B2 clarity. Never: clickbait, fake urgency, corporate-speak." />
        </Field>
      </div>

      <div className="card">
        <h3>Thumbnail style rules</h3>
        <ul style={{margin: 0, paddingLeft: 18}}>
          <li>Max 3 visual elements: face, object, text</li>
          <li>Text: 3–4 words max, one font weight</li>
          <li>Readable at 120px width (zoom out to test)</li>
          <li>Face: clear expression, eye contact</li>
        </ul>
      </div>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="row-h">
        <input
          type="color"
          value={value || '#000000'}
          onChange={e => onChange(e.target.value)}
          style={{width: 38, height: 38, padding: 0, border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', cursor: 'pointer'}}
        />
        <input
          className="input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#hex"
        />
      </div>
    </div>
  );
}

window.MC.PageBrand = PageBrand;
