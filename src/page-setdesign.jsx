function PageSetDesign() {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Set Design</h1>
          <p className="page-sub">Talking-head reference. Same scene, two crops.</p>
        </div>
      </div>

      <div className="card">
        <h3>Scene overview</h3>
        <table className="ref-table">
          <tbody>
            <tr><td>Scene</td><td>Interview / conversation</td></tr>
            <tr><td>Shot type</td><td>Medium close-up (MCU)</td></tr>
            <tr><td>Angle</td><td>3/4 profile — 30°–45° away from camera</td></tr>
            <tr><td>Framing</td><td>Half body, chest-up</td></tr>
            <tr><td>Focus</td><td>Subject sharp, background slightly blurred</td></tr>
            <tr><td>Purpose</td><td>Natural conversational look, off-camera interviewer</td></tr>
          </tbody>
        </table>
      </div>

      <div className="ref-grid ref-grid-2 mt-16" style={{display: 'grid', gap: 14}}>
        <div className="card">
          <h3>Camera settings</h3>
          <table className="ref-table">
            <tbody>
              <tr><td>Focal length</td><td>50mm – 85mm</td></tr>
              <tr><td>Aperture</td><td>f/2.0 – f/2.8</td></tr>
              <tr><td>Focus mode</td><td>AF single point on eyes</td></tr>
              <tr><td>Resolution</td><td>4K</td></tr>
              <tr><td>Frame rate</td><td>24 or 25 fps</td></tr>
              <tr><td>White balance</td><td>5000K – 5600K</td></tr>
              <tr><td>ISO</td><td>100 – 400</td></tr>
              <tr><td>Shutter</td><td>1/50</td></tr>
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Top-view diagram</h3>
          <pre className="diagram">{`      BACKGROUND
      ──────────
           🌿
      SUBJECT
          \\
           \\ 30°–45°
            \\
           📷 CAMERA`}</pre>
        </div>
      </div>

      <div className="ref-grid ref-grid-2 mt-16" style={{display: 'grid', gap: 14}}>
        <div className="card">
          <h3>3-point lighting</h3>
          <pre className="diagram">{`  KEY LIGHT       FILL LIGHT
     \\ 45°         20°–30° /
      \\                   /
       \\    SUBJECT      /
              ↓
          BACK LIGHT`}</pre>
        </div>
        <div className="card">
          <h3>Per light</h3>
          <ul style={{margin: 0, paddingLeft: 18}}>
            <li><b>Key</b>: 45° from subject (primary)</li>
            <li><b>Fill</b>: opposite side, lower intensity</li>
            <li><b>Back</b>: subtle rim on shoulders / hair</li>
            <li><b>Background</b>: practical lamp for depth</li>
          </ul>
        </div>
      </div>

      <div className="ref-grid ref-grid-2 mt-16" style={{display: 'grid', gap: 14}}>
        <div className="card">
          <h3>Background</h3>
          <ul style={{margin: 0, paddingLeft: 18}}>
            <li>Clean, non-distracting</li>
            <li>Add depth with practicals (lamp, shelf)</li>
            <li>Neutral or warm tones</li>
            <li>Maintain bokeh via wide aperture</li>
          </ul>
        </div>
        <div className="card">
          <h3>Composition</h3>
          <ul style={{margin: 0, paddingLeft: 18}}>
            <li>Subject on one side (rule of thirds)</li>
            <li>Negative space opposite for text/overlays</li>
            <li>Avoid centering</li>
            <li>Open posture, natural pose</li>
          </ul>
        </div>
      </div>

      <div className="card mt-16">
        <h3>Pre-roll checklist</h3>
        {[
          'Half body in frame (chest-up)',
          'Subject angled 30°–45° away from camera',
          'Looking at off-camera interviewer (not lens)',
          'Face and body in focus',
          'Background slightly blurred',
          'Lighting balanced — no harsh face shadows',
          'Natural expression, open posture',
          'Practical light visible for depth'
        ].map((item, i) => <PreRollItem key={i} text={item} />)}
      </div>
    </div>
  );
}

function PreRollItem({ text }) {
  const [done, setDone] = React.useState(false);
  return (
    <div className={'check-item ' + (done ? 'done' : '')} onClick={() => setDone(!done)}>
      <div className="check-box" />
      <div className="check-text">{text}</div>
    </div>
  );
}

window.MC.PageSetDesign = PageSetDesign;
