#!/bin/sh
# Rebuild editor/index.html from the template + the trimmed mermaid bundle.
#
# Size history: the full mermaid.min.js (2.57MB) pushed editor/index.html to
# 2.58MB and the community catalog rejected the plugin for size (pptx-viewer,
# listed with a 1.4MB blob, marks the working ceiling). build-trim/ builds
# mermaid v11.4.1 without the long-tail diagram types and KaTeX, landing the
# bundle at ~1.2MB. The frame CSP allows inline scripts only, so the bundle is
# still inlined; <!-- sequences are escaped to keep the host HTML parser from
# entering comment mode and truncating the script block.
#
# Excluded types (rendering them raises a clear not-included error):
#   architecture, block, c4, kanban, mindmap, sankey, packet, xychart,
#   quadrant, requirement, journey, info, timeline, radiation, math (KaTeX)
set -e
cd build-trim && node build-trimmed.mjs >/dev/null && cd ..
py - <<'PYEOF'
lib = open('build-trim/mermaid-trim.min.js', encoding='utf-8').read()
lib = lib.replace('<!--', '<\!--')
tpl = open('editor/index.template.html', encoding='utf-8').read()
needle = '<script src="mermaid.min.js"></script>'
assert needle in tpl, 'template marker missing'
marker = 'mermaid v11.4.1 trimmed build (inlined: plugin frames allow inline scripts only; long-tail diagram types and KaTeX excluded)'
out = tpl.replace(needle, '<script>/*! ' + marker + ' */\n' + lib + '\n</script>')
open('editor/index.html', 'w', encoding='utf-8', newline='').write(out)
print('built editor/index.html', len(out.encode('utf-8')), 'bytes')
PYEOF
