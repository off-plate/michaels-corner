#!/usr/bin/env python3
"""Inline src/*.jsx into index.html from index.template.html.

Order matters: data layer first, then shared components, then pages, then app entry.
"""
from pathlib import Path

ORDER = [
    "src/data.jsx",
    "src/components.jsx",
    "src/page-today.jsx",
    "src/page-ideas.jsx",
    "src/page-videos.jsx",
    "src/page-scripts.jsx",
    "src/page-checklists.jsx",
    "src/page-setdesign.jsx",
    "src/page-camera.jsx",
    "src/page-brand.jsx",
    "src/app.jsx",
]

ROOT = Path(__file__).resolve().parent

parts = []
for rel in ORDER:
    src = (ROOT / rel).read_text()
    parts.append(f"// ===== {rel} =====\n{src}\n")
inline = "\n".join(parts)

tpl = (ROOT / "index.template.html").read_text()
out = tpl.replace("/* __INLINE_APP__ */", inline)
(ROOT / "index.html").write_text(out)
print(f"Wrote index.html ({len(out):,} bytes)")
