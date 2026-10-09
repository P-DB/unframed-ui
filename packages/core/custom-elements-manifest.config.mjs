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
    {
      // Keeps the documented API public-only: no statics (styles, properties,
      // shadowRootOptions…), private (#) or protected members, or @internal ones.
      name: 'unframed-public-api',
      packageLinkPhase({ customElementsManifest }) {
        for (const mod of customElementsManifest.modules) {
          for (const declaration of mod.declarations ?? []) {
            if (!declaration.members) continue;
            declaration.members = declaration.members.filter(
              (m) =>
                !m.static &&
                !m.name.startsWith('#') &&
                m.privacy !== 'private' &&
                m.privacy !== 'protected' &&
                !/@internal/.test(m.description ?? ''),
            );
          }
        }
      },
    },
  ],
};
