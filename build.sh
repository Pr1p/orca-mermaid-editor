#!/bin/sh
# Rebuild editor/index.html from the template + vendored mermaid.
# The plugin frame's CSP allows inline scripts only, so mermaid must be
# inlined; <!-- sequences are escaped to keep the host HTML parser from
# entering comment mode and truncating the script block.
set -e
lib=$(sed 's/<!--/<\!--/g' vendor/mermaid.min.js)
sed "/<script src=.mermaid.min.js.><\/script>/c\
<script>/*! mermaid v11.4.1 (inlined: plugin frames allow inline scripts only) */\
${lib}\
</script>" editor/index.template.html > editor/index.html
echo "built editor/index.html ($(wc -c < editor/index.html) bytes)"
