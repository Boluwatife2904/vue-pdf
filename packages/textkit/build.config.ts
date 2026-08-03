import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: 'compatible',
  clean: true,
  // fontkit is a devDependency here because it is only used for types, so
  // unbuild does not externalize it automatically. Without this the
  // declaration bundler tries to read named exports out of its CJS build.
  externals: ['fontkit'],
  rollup: {
    emitCJS: false,
    inlineDependencies: false,
    esbuild: { target: 'node18' },
  },
})
