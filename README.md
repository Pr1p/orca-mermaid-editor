# Mermaid Editor for Orca

An [Orca](https://github.com/stablyai/orca) plugin that renders and edits
[Mermaid](https://mermaid.js.org) diagrams (`.mmd` / `.mermaid` files) with live
rendering, built on Orca's `customEditors` contribution point.

## Views

- **Chart** — the rendered diagram, with wheel zoom, drag panning, and
  double-click reset
- **Split** — source beside the live diagram, with a draggable divider
- **Source** — plain text editing

Edits debounce into Orca's document protocol (`applyEdit` against the document
version, so external changes surface as conflicts instead of silent clobbers),
and `editor.flush` delivers any pending edit before a save. The palette follows
Orca's theme through the `--orca-*` panel tokens in both light and dark.

Mermaid 11 is bundled; the editor frame never reaches the network.

## Install

Development folder:

```
orca plugin dev load <checkout>
```

Or Settings → Plugins → Add plugin → From a folder…, then review & enable.

Requires Orca 1.4.245 or later.

## License

MIT
