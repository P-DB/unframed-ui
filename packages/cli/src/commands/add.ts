import { relative } from 'node:path';
import { CONFIG_FILE, detectPackageManager, projectDependencies, readConfig } from '../lib/config.js';
import { planComponents, planTokens, writeFile, writeIndex, type WriteResult } from '../lib/files.js';
import { color, type Io } from '../lib/io.js';
import { loadRegistry, resolveComponents } from '../lib/registry.js';

export interface AddOptions {
  all: boolean;
  overwrite: boolean;
}

const icons: Record<WriteResult, string> = {
  created: color.green('+'),
  updated: color.yellow('~'),
  unchanged: color.dim('='),
  skipped: color.yellow('!'),
};

export async function add(io: Io, names: string[], options: AddOptions): Promise<number> {
  const config = readConfig(io.cwd);
  if (!config) {
    io.err(color.red(`No ${CONFIG_FILE} found. Run "npx @unframed/cli init" first.`));
    return 1;
  }
  const registry = loadRegistry();
  const wantTokens = names.includes('tokens');
  const requested = options.all ? Object.keys(registry.components) : names.filter((n) => n !== 'tokens');

  if (!requested.length && !wantTokens) {
    io.err('Name the components to add, e.g. "unframed add button dialog", or use --all.');
    return 1;
  }

  const components = resolveComponents(registry, requested);
  const files = planComponents(io, config, registry, components);
  if (wantTokens) files.unshift(planTokens(io, config, registry));

  const dependencies = projectDependencies(io.cwd);
  if (dependencies.has('@unframed/core') && components.length) {
    io.err(
      color.yellow(
        'Note: this project also depends on @unframed/core. A copied component and the package version register the same tag\n' +
          '(e.g. <uf-button>); whichever loads first wins. Import each component from one place only.\n',
      ),
    );
  }

  const extra = components.filter((c) => !requested.includes(c.name)).map((c) => c.name);
  if (components.length) {
    io.out(`Adding ${requested.join(', ')}${extra.length ? color.dim(` (needs ${extra.join(', ')})`) : ''}`);
  }

  const counts: Record<WriteResult, number> = { created: 0, updated: 0, unchanged: 0, skipped: 0 };
  for (const file of files) {
    const result = await writeFile(io, file, options.overwrite);
    counts[result] += 1;
    if (result !== 'unchanged') io.out(`  ${icons[result]} ${relative(io.cwd, file.dest)}`);
  }

  if (components.length) writeIndex(io, config, registry);

  const summary = (Object.keys(counts) as WriteResult[])
    .filter((k) => counts[k])
    .map((k) => `${counts[k]} ${k}`)
    .join(', ');
  io.out(`\n${color.green('✔')} Done: ${summary}.`);

  const missing = [...new Set(components.flatMap((c) => c.npm))].filter((dep) => !dependencies.has(dep));
  if (missing.length) {
    const pm = detectPackageManager(io.cwd);
    io.out(`\nThese components need: ${missing.join(', ')}\n  ${color.cyan(`${pm} ${pm === 'npm' ? 'install' : 'add'} ${missing.join(' ')}`)}`);
  }
  return counts.skipped ? 2 : 0;
}
