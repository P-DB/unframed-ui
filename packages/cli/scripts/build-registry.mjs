// Builds registry.json: every component's source files, the internal helpers
// and other components it depends on (found by following imports), and the
// built tokens CSS. The CLI ships this file, so `add` works offline and always
// matches the CLI's version.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, normalize, posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const coreDir = join(here, '../../core');
const srcDir = join(coreDir, 'src');
const tokensCss = join(here, '../../tokens/dist/tokens.css');

const version = JSON.parse(readFileSync(join(coreDir, 'package.json'), 'utf8')).version;
const manifestPath = join(coreDir, 'custom-elements.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { modules: [] };

/** Summary and tag of each custom element, keyed by source path (components/x/x.ts). */
const declarations = new Map();
for (const mod of manifest.modules) {
  const srcPath = mod.path.replace(/^dist\//, '').replace(/\.js$/, '.ts');
  for (const d of mod.declarations ?? []) if (d.tagName) declarations.set(srcPath, d);
}

const toPosix = (p) => p.split('\\').join('/');
const read = (srcPath) => readFileSync(join(srcDir, srcPath), 'utf8');

/** Relative imports of a source file, resolved to source paths (e.g. internal/define.ts). */
function relativeImports(srcPath) {
  const code = read(srcPath);
  const specifiers = [...code.matchAll(/(?:from|import)\s+['"](\.{1,2}\/[^'"]+)['"]/g)].map((m) => m[1]);
  return specifiers.map((spec) => toPosix(normalize(posix.join(posix.dirname(srcPath), spec))).replace(/\.js$/, '.ts'));
}

function npmImports(srcPath) {
  const code = read(srcPath);
  const packages = [...code.matchAll(/(?:from|import)\s+['"]([^'".][^'"]*)['"]/g)].map((m) => m[1]);
  return packages.map((p) => (p.startsWith('@') ? p.split('/').slice(0, 2).join('/') : p.split('/')[0]));
}

/** All files reachable from an entry, following relative imports. */
function closure(entry) {
  const seen = new Set();
  const visit = (file) => {
    if (seen.has(file)) return;
    seen.add(file);
    for (const dep of relativeImports(file)) visit(dep);
  };
  visit(entry);
  return [...seen];
}

const componentNames = readdirSync(join(srcDir, 'components')).filter((name) =>
  existsSync(join(srcDir, 'components', name, `${name}.ts`)),
);

const components = {};
const files = {};

for (const name of componentNames) {
  const entry = `components/${name}/${name}.ts`;
  const reachable = closure(entry);
  const own = reachable.filter((f) => f.startsWith(`components/${name}/`));
  const internal = reachable.filter((f) => f.startsWith('internal/'));
  const dependencies = [
    ...new Set(
      reachable
        .filter((f) => f.startsWith('components/') && !f.startsWith(`components/${name}/`))
        .map((f) => f.split('/')[1]),
    ),
  ];
  const npm = [...new Set(reachable.flatMap(npmImports))];
  const declaration = declarations.get(entry);

  components[name] = {
    name,
    entry,
    tag: declaration?.tagName ?? `uf-${name}`,
    summary: declaration?.summary ?? '',
    files: own,
    internal,
    dependencies,
    npm,
  };
  for (const file of [...own, ...internal]) files[file] ??= read(file);
}

const registry = {
  version,
  components,
  files,
  tokens: existsSync(tokensCss) ? readFileSync(tokensCss, 'utf8') : null,
};

const out = join(here, '../registry.json');
writeFileSync(out, `${JSON.stringify(registry, null, 2)}\n`);
console.log(
  `registry: ${componentNames.length} components, ${Object.keys(files).length} files -> ${relative(process.cwd(), out)}`,
);
