// Checklists per video per platform. State saved per (videoId, platform).

const CHECKLISTS = {
  'youtube-longform': {
    label: 'YouTube long-form',
    icon: '📺',
    sections: [
      { name: 'Pre-production', items: [
        'Idea validated (hook works, audience clear)',
        'Script written and read out loud once',
        'Thumbnail concept sketched before filming',
        'B-roll list ready'
      ]},
      { name: 'Filming', items: [
        'Camera settings checked (see Set Design)',
        'Audio levels checked (peaks -12 to -6 dB)',
        'Lighting locked (3-point set)',
        'Background tidy',
        'Backup take of intro and outro'
      ]},
      { name: 'Editing', items: [
        'Hook works in first 5 seconds — sound-off test',
        'Pacing: every dead beat cut',
        'Captions burned in for first 30s minimum',
        'Chapters added (every 60–90s)',
        'End screen with 1 video + subscribe'
      ]},
      { name: 'Metadata', items: [
        'Title under 60 chars, curiosity gap, no clickbait lies',
        'Description: first 2 lines are the hook',
        'Tags: 5–8 relevant',
        'Thumbnail readable at 120px width',
        'Pinned comment ready'
      ]},
      { name: 'Publish', items: [
        'Scheduled (not blind-published)',
        'Short clip cross-posted to Shorts/TT/Reels within 48h',
        'LinkedIn post if topic fits',
        'Added to relevant playlist'
      ]}
    ]
  },
  'shorts-tiktok-reels': {
    label: 'Shorts / TikTok / Reels',
    icon: '📱',
    sections: [
      { name: 'Hook (first 1–2s)', items: [
        'Visual movement in frame 1',
        'First spoken word is intriguing or punchy',
        'Text overlay reinforces hook',
        'No slow intro — value lands immediately'
      ]},
      { name: 'Pacing', items: [
        'Cut every 1–3 seconds',
        'No dead air',
        'One idea per video',
        'Length in the 15–45s sweet spot'
      ]},
      { name: 'Captions', items: [
        'Burned-in, large, high contrast',
        'Not the native platform font',
        'Keywords in caption for search'
      ]},
      { name: 'Audio', items: [
        'Voice clear, no background noise',
        'Trending sound used only if voice still cuts through'
      ]},
      { name: 'YouTube Shorts', items: [
        'Clear title, no hashtag spam',
        'Pinned comment drives to long-form'
      ]},
      { name: 'TikTok', items: [
        '3–5 hashtags max (broad + niche)',
        'Reply to top comments within 1h',
        'Cover image set manually'
      ]},
      { name: 'Instagram Reels', items: [
        'Cover image set manually (matters for grid)',
        'Hook in caption line 1',
        '3–5 hashtags inside caption',
        'Shared to story after posting'
      ]},
      { name: 'Cross-post', items: [
        'Posted to all 3 platforms within 24h',
        'Raw 9:16 (no TikTok watermark) exported for cross-posting'
      ]}
    ]
  },
  'instagram': {
    label: 'Instagram (posts + stories)',
    icon: '📸',
    sections: [
      { name: 'Post / carousel', items: [
        'First slide is the hook',
        'Each carousel slide pulls to the next',
        'Last slide has a CTA',
        'Caption: hook line 1, body 2–4 short paragraphs',
        '3–5 hashtags inside caption',
        'Alt text added'
      ]},
      { name: 'Stories', items: [
        'Native stickers used (poll/question/quiz)',
        'Under 5 frames per sequence',
        'Link sticker if driving traffic',
        'Highlight cover prepared if adding to highlights'
      ]},
      { name: 'Publish', items: [
        'Posted at peak time (check Insights)',
        'Shared to story immediately',
        'Replied to every comment in first hour'
      ]}
    ]
  },
  'linkedin': {
    label: 'LinkedIn',
    icon: '💼',
    sections: [
      { name: 'Text post', items: [
        'Hook in line 1',
        'Line 2 earns the "see more" click',
        'Short paragraphs, one idea each',
        'No corporate-speak',
        'Specific over generic',
        'One CTA at the end'
      ]},
      { name: 'Video / image', items: [
        'Subtitles burned in (autoplay is muted)',
        'First 3s work with no sound',
        'Native upload (no external links in body)',
        'Under 90 seconds if video'
      ]},
      { name: 'Engagement', items: [
        'Replied to every comment in first hour',
        'No edits in first 30 min',
        'External links in first comment, not post body'
      ]},
      { name: 'Publish', items: [
        'Posted Tue–Thu, 8–10am CET'
      ]}
    ]
  }
};

function PageChecklists({ go, videoId }) {
  const s = window.MC.db.useStore();
  const { Empty, StatusPill, FormatPill, LangPill } = window.MC.ui;
  const [platform, setPlatform] = React.useState(null);

  if (!videoId) {
    if (s.videos.length === 0) {
      return (
        <div className="page">
          <div className="page-head"><div><h1 className="page-title">Checklists</h1></div></div>
          <Empty icon="✅" title="No videos yet" body="Create a video first — checklists are tied to a specific video." />
        </div>
      );
    }
    return (
      <div className="page">
        <div className="page-head"><div><h1 className="page-title">Checklists</h1><p className="page-sub">Pick a video to run its checklists.</p></div></div>
        {s.videos.map(v => (
          <div key={v.id} className="row" onClick={() => go('checklists', v.id)}>
            <div className="label">
              <div className="title">{v.title || 'Untitled'}</div>
              <div className="meta">
                <StatusPill value={v.status} />
                <FormatPill value={v.format} />
                <LangPill value={v.language} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const v = window.MC.db.getVideo(videoId);
  if (!v) {
    return <div className="page"><Empty icon="🚫" title="Video not found" action={<button className="btn" onClick={() => go('videos')}>Back</button>} /></div>;
  }

  if (!platform) {
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <button className="btn-ghost btn btn-sm" onClick={() => go('scripts', v.id)}>← {v.title || 'Video'}</button>
            <h1 className="page-title" style={{marginTop: 6}}>Checklists</h1>
            <p className="page-sub">Pick a platform.</p>
          </div>
        </div>
        {Object.entries(CHECKLISTS).map(([key, cl]) => {
          const state = window.MC.db.getChecklist(v.id, key);
          const total = cl.sections.reduce((a, s) => a + s.items.length, 0);
          const done = cl.sections.reduce((a, s) => a + s.items.filter((_, i) => state[s.name + ':' + i]).length, 0);
          return (
            <div key={key} className="row" onClick={() => setPlatform(key)}>
              <div className="label">
                <div className="title">{cl.icon} {cl.label}</div>
                <div className="meta">
                  <span className={'pill ' + (done === total ? 'pill-green' : done > 0 ? 'pill-accent' : '')}>{done}/{total}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const cl = CHECKLISTS[platform];
  const state = window.MC.db.getChecklist(v.id, platform);
  const total = cl.sections.reduce((a, s) => a + s.items.length, 0);
  const done = cl.sections.reduce((a, s) => a + s.items.filter((_, i) => state[s.name + ':' + i]).length, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <button className="btn-ghost btn btn-sm" onClick={() => setPlatform(null)}>← Platforms</button>
          <h1 className="page-title" style={{marginTop: 6}}>{cl.icon} {cl.label}</h1>
          <p className="page-sub">{v.title || 'Untitled video'} · {done}/{total} done</p>
        </div>
        <button className="btn btn-sm btn-ghost btn-danger" onClick={() => { if (confirm('Reset this checklist?')) window.MC.db.resetChecklist(v.id, platform); }}>Reset</button>
      </div>

      {cl.sections.map(section => (
        <div key={section.name} className="card">
          <h3>{section.name}</h3>
          {section.items.map((item, i) => {
            const key = section.name + ':' + i;
            const isDone = !!state[key];
            return (
              <div key={i} className={'check-item ' + (isDone ? 'done' : '')} onClick={() => window.MC.db.toggleChecklistItem(v.id, platform, key)}>
                <div className="check-box" />
                <div className="check-text">{item}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

window.MC.PageChecklists = PageChecklists;
