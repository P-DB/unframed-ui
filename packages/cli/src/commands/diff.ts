import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { CONFIG_FILE, readConfig } from '../lib/config.js';
import { unifiedDiff } from '../lib/diff.js';
import { isUpToDate, planComponents, planTokens, type PlannedFile } from '../lib/files.js';
import { color, type Io } from '../lib/io.js';
import { loadRegistry, resolveComponents } from '../lib/registry.js';
import { destPath, withoutHeader } from '../lib/transform.js';

function colorize(diff: string): string {
  return diff
    .split('\n')
    .map((line) => {
      if (line.startsWith('+++') || line.startsWith('---')) return color.bold(line);
      if (line.startsWith('@@')) return color.cyan(line);
      if (line.startsWith('+')) return color.green(line);
      if (line.startsWith('-')) return color.red(line);
      return line;
    })
    .join('\n');
}

/**
 * Shows how local copies differ from the components in this CLI version.
 * "-" lines are yours, "+" lines are upstream.
 */
export function diff(io: Io, names: string[]): number {
  const config = readConfig(io.cwd);
  if (!config) {
    io.err(color.red(`No ${CONFIG_FILE} found. Run "npx @unframed/cli init" first.`));
    return 1;
  }
  const registry = loadRegistry();
  const base = join(io.cwd, config.dir);
  const added = Object.values(registry.components)
    .filter((c) => existsSync(join(base, destPath(c.entry, config.language))))
    .map((c) => c.name);
  const wantTokens = names.includes('tokens') || (!names.length && existsSync(join(base, 'tokens.css')));
  const targets = names.length ? names.filter((n) => n !== 'tokens') : added;

  if (!targets.length && !wantTokens) {
    io.out('No components added yet.');
    return 0;
  }

  const files: PlannedFile[] = planComponents(io, config, registry, resolveComponents(registry, targets));
  if (wantTokens) files.unshift(planTokens(io, config, registry));

  let differing = 0;
  for (const file of files) {
    const rel = relative(io.cwd, file.dest);
    if (!existsSync(file.dest)) {
      io.out(`${color.yellow('missing')}  ${rel}`);
      differing += 1;
      continue;
    }
    if (isUpToDate(file)) continue;
    differing += 1;
    const local = withoutHeader(readFileSync(file.dest, 'utf8'));
    const upstream = withoutHeader(file.content);
    io.out(colorize(unifiedDiff(local, upstream, `${rel} (yours)`, `${rel} (@unframed ${registry.version})`)));
    io.out('');
  }

  io.out(
    differing
      ? `${differing} file${differing === 1 ? '' : 's'} differ from @unframed ${registry.version}. Run "unframed add <name> --overwrite" to take upstream.`
      : `${color.green('✔')} Everything matches @unframed ${registry.version}.`,
  );
  return 0;
}
