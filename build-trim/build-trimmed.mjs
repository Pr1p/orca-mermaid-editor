// Build a trimmed mermaid bundle: full official build, minus the long-tail
// diagram types, so editor/index.html stays under the catalog size gate.
// Usage: node build-trimmed.mjs && ls -la mermaid-trim.min.js
import { build } from 'esbuild'

// Diagram chunk basenames excluded from the bundle. A user writing one of
// these gets a clear "unknown diagram" error instead of a rendered chart.
const EXCLUDED = [
  'architectureDiagram-',
  'blockDiagram-',
  'c4Diagram-',
  'kanbanDiagram-',
  'mindmapDiagram-',
  'mindmap-definition-',
  'sankeyDiagram-',
  'packetDiagram-',
  'xychartDiagram-',
  'quadrantDiagram-',
  'requirementDiagram-',
  'journeyDiagram-',
  'infoDiagram-',
  'radiationDiagram-',
  'katex-',
  'kanban-definition-',
  'timeline-definition-',
  'timelineDiagram-'
]

const stubPlugin = {
  name: 'stub-excluded-diagrams',
  setup(build) {
    build.onResolve({ filter: new RegExp(EXCLUDED.join('|')) }, (args) => ({
      path: args.path,
      namespace: 'stub'
    }))
    build.onLoad({ filter: /.*/, namespace: 'stub' }, (args) => {
      // A minimal valid diagram: registration succeeds (so other types keep
      // rendering), and only drawing the excluded type raises a clear error.
      const name = (args.path.match(/([A-Za-z0-9-]+?)-[A-Z0-9]{8}\.mjs$/) || [])[1] || 'excluded'
      const msg = `Diagram type "${name}" is not included in this Orca mermaid-editor build.`
      return {
        contents: [
          `const msg = ${JSON.stringify(msg)};`,
          'export const id = ' + JSON.stringify(name) + ';',
          'export const diagram = {',
          '  db: { clear() {} },',
          '  styles: {},',
          '  renderer: { draw() { throw new Error(msg); } },',
          '  parser: { parse() { throw new Error(msg); } },',
          '  init() { return null; }',
          '};',
          'export default {};'
        ].join('\n'),
        loader: 'js'
      }
    })
  }
}

const result = await build({
  entryPoints: ['entry.mjs'],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'mermaidBundle',
  outfile: 'mermaid-trim.min.js',
  plugins: [stubPlugin],
  define: { 'process.env.NODE_ENV': '"production"' },
  metafile: true,
  logLevel: 'info'
})

const inputs = Object.entries(result.metafile.inputs)
  .map(([p, v]) => [v.bytes, p])
  .sort((a, b) => b[0] - a[0])
console.log('--- largest inputs ---')
for (const [b, p] of inputs.slice(0, 20)) {
  console.log(String(Math.round(b / 1024)).padStart(6) + ' KB  ' + p.replace(/^node_modules\/mermaid\/dist\//, ''))
}
