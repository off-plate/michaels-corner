function PageCamera() {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Camera Setup</h1>
          <p className="page-sub">Quick lookup card. Defaults dialed in.</p>
        </div>
      </div>

      <div className="card">
        <h3>Talking head defaults</h3>
        <table className="ref-table">
          <tbody>
            <tr><td>Focal length</td><td>50mm – 85mm</td></tr>
            <tr><td>Aperture</td><td>f/2.0 – f/2.8</td></tr>
            <tr><td>Focus</td><td>AF single point, locked on eyes</td></tr>
            <tr><td>Resolution</td><td>4K</td></tr>
            <tr><td>Frame rate</td><td>24 or 25 fps (PAL — CZ standard)</td></tr>
            <tr><td>White balance</td><td>5000K – 5600K (manual)</td></tr>
            <tr><td>ISO</td><td>100 – 400</td></tr>
            <tr><td>Shutter</td><td>1/50 (matches 25fps)</td></tr>
            <tr><td>Profile</td><td>Flat / log if grading, standard otherwise</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Phone (Shorts / on-the-go)</h3>
        <ul style={{margin: 0, paddingLeft: 18}}>
          <li>4K 30p, 1x lens (not ultrawide — face distortion)</li>
          <li>Native camera app, not in-app capture (TikTok/IG)</li>
          <li>Lock exposure + focus before recording</li>
        </ul>
      </div>

      <div className="card">
        <h3>Audio</h3>
        <ul style={{margin: 0, paddingLeft: 18}}>
          <li>Levels peak at -12 to -6 dB. Never touch 0.</li>
          <li>Always record on-camera audio as backup</li>
          <li>5 seconds of room tone before each session</li>
        </ul>
      </div>

      <div className="card">
        <h3>Pre-roll checklist</h3>
        {[
          'Battery > 50%',
          'Card formatted, has space',
          'Mic on, levels checked',
          'Focus locked on eyes',
          'Red dot confirmed before talking'
        ].map((item, i) => <PreRollItem key={i} text={item} />)}
      </div>
    </div>
  );
}

window.MC.PageCamera = PageCamera;
