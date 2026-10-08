// Points manifest paths at the published files (dist/*.js) instead of sources,
// so IDEs and wrapper generators resolve modules that actually ship.
const toDist = (path) => path.replace(/^src\//, 'dist/').replace(/\.ts$/, '.js');

export default {
  globs: ['src/**/*.ts'],
  exclude: ['src/**/*.test.ts', 'src/test-utils.ts'],
  litelement: true,
  plugins: [
    {
      name: 'unframed-dist-paths',
      packageLinkPhase({ customElementsManifest }) {
        for (const mod of customElementsManifest.modules) mod.path = toDist(mod.path);
      },
    },
  ],
};
