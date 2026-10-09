import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import { run } from '../src/cli.js';
import type { Io } from '../src/lib/io.js';
import { loadRegistry, resolveComponents } from '../src/lib/registry.js';
import { toJavaScript } from '../src/lib/transform.js';

const cliDir = fileURLToPath(new URL('..', import.meta.url));
const repoRoot = join(cliDir, '../..');
// Inside the repo, so generated projects resolve `lit` from the root node_modules.
const tmpRoot = join(cliDir, '.tmp');

let counter = 0;
function project(pkg: Record<string, unknown> = {}): string {
  const dir = join(tmpRoot, `test-${process.pid}-${++counter}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'app', private: true, type: 'module', ...pkg }));
  return dir;
}

async function cli(cwd: string, ...args: string[]) {
  const out: string[] = [];
  const err: string[] = [];
  const io: Io = { cwd, out: (t) => out.push(t), err: (t) => err.push(t), interactive: false, ask: async () => '' };
  const code = await run(args, io);
  return { code, out: out.join('\n'), err: err.join('\n') };
}

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

const uiDir = (cwd: string) => join(cwd, 'src/components/uf-ui');

afterAll(() => {
  for (const name of existsSync(tmpRoot) ? readdirSync(tmpRoot) : []) {
    if (name.startsWith(`test-${process.pid}-`)) rmSync(join(tmpRoot, name), { recursive: true, force: true });
  }
});

describe('registry', () => {
  it('lists every component with its dependencies, dependencies first', () => {
    const registry = loadRegistry();
    expect(Object.keys(registry.components).length).toBeGreaterThanOrEqual(18);
    expect(resolveComponents(registry, ['dropdown']).map((c) => c.name)).toEqual(['popover', 'menu', 'dropdown']);
    expect(resolveComponents(registry, ['radio-group']).map((c) => c.name)).toEqual(['radio', 'radio-group']);
    expect(registry.components.button.internal).toContain('internal/define.ts');
    expect(registry.tokens).toContain('--uf-color-accent');
  });
});

describe('init', () => {
  it('writes unframed.json with the chosen options', async () => {
    const cwd = project();
    const { code, out } = await cli(cwd, 'init', '--yes', '--no-install', '--lang', 'ts');
    expect(code).toBe(0);
    expect(JSON.parse(readFileSync(join(cwd, 'unframed.json'), 'utf8'))).toEqual({
      dir: 'src/components/uf-ui',
      language: 'ts',
      tokens: 'package',
    });
    expect(out).toContain('npm install lit @unframed/tokens');
  });

  it('copies tokens.css when tokens are copied', async () => {
    const cwd = project();
    await cli(cwd, 'init', '--yes', '--no-install', '--tokens', 'copy');
    const css = readFileSync(join(uiDir(cwd), 'tokens.css'), 'utf8');
    expect(css).toMatch(/^\/\* From @unframed\/tokens/);
    expect(css).toContain('--uf-color-accent');
  });
});

describe('add', () => {
  it('needs init first', async () => {
    const { code, err } = await cli(project(), 'add', 'button');
    expect(code).toBe(1);
    expect(err).toContain('init');
  });

  it('suggests close matches for unknown names', async () => {
    const cwd = project();
    await cli(cwd, 'init', '--yes', '--no-install');
    const { code, err } = await cli(cwd, 'add', 'radio-grp');
    expect(code).toBe(1);
    expect(err).toContain('Unknown component "radio-grp"');
  });

  it('copies a component with the helpers and components it needs', async () => {
    const cwd = project();
    await cli(cwd, 'init', '--yes', '--no-install', '--lang', 'ts');
    const { code, out } = await cli(cwd, 'add', 'dropdown');
    expect(code).toBe(0);
    expect(out).toContain('needs popover, menu');
    for (const file of ['dropdown/dropdown.ts', 'menu/menu.ts', 'menu/menu-item.ts', 'popover/popover.ts', 'internal/position.ts', 'index.ts']) {
      expect(existsSync(join(uiDir(cwd), file)), file).toBe(true);
    }
    expect(readFileSync(join(uiDir(cwd), 'dropdown/dropdown.ts'), 'utf8')).toContain("from '../popover/popover.js'");
    expect(readFileSync(join(uiDir(cwd), 'index.ts'), 'utf8')).toContain("import './dropdown/dropdown.js';");
  });

  it('produces a TypeScript project that type-checks', async () => {
    const cwd = project();
    await cli(cwd, 'init', '--yes', '--no-install', '--lang', 'ts', '--tokens', 'copy');
    const { code } = await cli(cwd, 'add', '--all');
    expect(code).toBe(0);
    writeFileSync(
      join(cwd, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'bundler',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          types: [],
        },
        include: ['src'],
      }),
    );
    const tsc = spawnSync(join(repoRoot, 'node_modules/.bin/tsc'), ['-p', cwd], { encoding: 'utf8' });
    expect(tsc.stdout + tsc.stderr).toBe('');
    expect(tsc.status).toBe(0);
  });

  it('produces valid JavaScript that keeps the documentation comments', async () => {
    const cwd = project();
    await cli(cwd, 'init', '--yes', '--no-install', '--lang', 'js');
    await cli(cwd, 'add', '--all');
    const files = filesUnder(uiDir(cwd)).filter((f) => f.endsWith('.js'));
    expect(files.length).toBeGreaterThan(30);
    for (const file of files) {
      const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
      expect(check.stderr, file).toBe('');
    }
    const button = readFileSync(join(uiDir(cwd), 'button/button.js'), 'utf8');
    expect(button).toContain('@summary Triggers an action');
    expect(button).not.toMatch(/\bdeclare\b|\binterface\b|: (string|boolean)\b/);
  });

  it('never overwrites edited files unless asked', async () => {
    const cwd = project();
    await cli(cwd, 'init', '--yes', '--no-install', '--lang', 'ts');
    await cli(cwd, 'add', 'button');
    const file = join(uiDir(cwd), 'button/button.ts');
    appendFileSync(file, '\n// my change\n');

    const again = await cli(cwd, 'add', 'button');
    expect(again.code).toBe(2);
    expect(again.err).toContain('kept src/components/uf-ui/button/button.ts');
    expect(readFileSync(file, 'utf8')).toContain('// my change');

    const forced = await cli(cwd, 'add', 'button', '--overwrite');
    expect(forced.code).toBe(0);
    expect(readFileSync(file, 'utf8')).not.toContain('// my change');
  });

  it('leaves unchanged files alone', async () => {
    const cwd = project();
    await cli(cwd, 'init', '--yes', '--no-install');
    await cli(cwd, 'add', 'button');
    const { out } = await cli(cwd, 'add', 'button');
    expect(out).toContain('unchanged');
    expect(out).not.toContain('+ ');
  });

  it('warns when the project also uses @unframed/core', async () => {
    const cwd = project({ dependencies: { '@unframed/core': '^0.1.0' } });
    await cli(cwd, 'init', '--yes', '--no-install');
    const { err } = await cli(cwd, 'add', 'button');
    expect(err).toContain('whichever loads first wins');
  });
});

describe('list and diff', () => {
  it('lists components and marks the added ones', async () => {
    const cwd = project();
    await cli(cwd, 'init', '--yes', '--no-install');
    await cli(cwd, 'add', 'tabs');
    const { out } = await cli(cwd, 'list');
    expect(out).toMatch(/● added tabs/);
    expect(out).toMatch(/○\s+button/);
  });

  it('shows local edits against upstream', async () => {
    const cwd = project();
    await cli(cwd, 'init', '--yes', '--no-install', '--lang', 'ts');
    await cli(cwd, 'add', 'button');
    expect((await cli(cwd, 'diff')).out).toContain('Everything matches');

    const file = join(uiDir(cwd), 'button/button.ts');
    writeFileSync(file, readFileSync(file, 'utf8').replace("this.variant = 'primary';", "this.variant = 'secondary';"));
    const { out } = await cli(cwd, 'diff', 'button');
    expect(out).toContain('button.ts (yours)');
    expect(out).toContain("-    this.variant = 'secondary';");
    expect(out).toContain("+    this.variant = 'primary';");
    expect(out).toContain('1 file differ');
  });
});

describe('toJavaScript', () => {
  it('removes types but keeps comments and layout tidy', () => {
    const js = toJavaScript(`import { a, type B } from './x.js';
class X extends Y {
  static override styles = s;
  /** The value. */
  declare value: string;
  readonly #id = 1;
  protected get thing(): B { return a; }
}`);
    expect(js).toBe(`import { a } from './x.js';
class X extends Y {
  static styles = s;
  #id = 1;
  get thing() { return a; }
}`);
  });
});
