import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: 'compatible',
  clean: true,
  // `pdfkit` is referenced for types only (see src/types.ts) and is not a
  // declared dependency, so unbuild will not externalize it on its own.
  externals: ['pdfkit', 'pdfkit/js/reference'],
  rollup: {
    emitCJS: false,
    inlineDependencies: false,
    esbuild: { target: 'node18' },
  },
})
