import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: 'compatible',
  clean: true,
  rollup: {
    emitCJS: false,
    inlineDependencies: false,
    esbuild: { target: 'node18' },
  },
})
