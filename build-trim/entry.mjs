import mermaid from 'mermaid/dist/mermaid.esm.mjs'
// The plugin frame script uses the UMD-style global `mermaid` directly,
// so the bundle must expose the instance itself, not an exports wrapper.
window.mermaid = mermaid
export default mermaid
