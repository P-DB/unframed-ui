import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { readConfig } from '../lib/config.js';
import { color, type Io } from '../lib/io.js';
import { loadRegistry } from '../lib/registry.js';
import { destPath } from '../lib/transform.js';

export function list(io: Io): number {
  const registry = loadRegistry();
  const config = readConfig(io.cwd);
  const components = Object.values(registry.components);
  const width = Math.max(...components.map((c) => c.name.length)) + 2;

  io.out(color.bold(`Unframed ${registry.version} components\n`));
  for (const c of components) {
    const added = config && existsSync(join(io.cwd, config.dir, destPath(c.entry, config.language)));
    const status = config ? (added ? color.green('● added ') : color.dim('○       ')) : '';
    io.out(`  ${status}${c.name.padEnd(width)}${color.dim(c.summary)}`);
  }
  if (config) {
    const tokens = existsSync(join(io.cwd, config.dir, 'tokens.css'));
    io.out(`\n  ${tokens ? color.green('● added ') : color.dim('○       ')}${'tokens'.padEnd(width)}${color.dim('Design tokens as CSS custom properties')}`);
  } else {
    io.out(color.dim('\nRun "npx @unframed/cli init" to start copying components into this project.'));
  }
  return 0;
}
