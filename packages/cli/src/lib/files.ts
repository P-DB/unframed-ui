import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import type { Config } from './config.js';
import { color, confirm, type Io } from './io.js';
import type { Registry, RegistryComponent } from './registry.js';
import { destPath, header, render, withoutHeader } from './transform.js';

export interface PlannedFile {
  /** Path in @unframed/core/src, or `tokens.css`. */
  src: string;
  /** Absolute path in the user's project. */
  dest: string;
  content: string;
}

export type WriteResult = 'created' | 'updated' | 'unchanged' | 'skipped';

export function componentsDir(io: Io, config: Config): string {
  return join(io.cwd, config.dir);
}

/** Every file a set of components needs, shared helpers first and each file once. */
export function planComponents(io: Io, config: Config, registry: Registry, components: RegistryComponent[]): PlannedFile[] {
  const base = componentsDir(io, config);
  const sources = [...new Set([...components.flatMap((c) => c.internal), ...components.flatMap((c) => c.files)])];
  sources.sort((a, b) => Number(a.startsWith('components/')) - Number(b.startsWith('components/')));
  return sources.map((src) => ({
    src,
    dest: join(base, destPath(src, config.language)),
    content: render(registry.files[src], src, config.language, registry.version),
  }));
}

export function planTokens(io: Io, config: Config, registry: Registry): PlannedFile {
  if (!registry.tokens) throw new Error('This version of the CLI was built without tokens.');
  const css = registry.tokens.replace(/^\/\*.*?\*\/\n?/, '');
  return {
    src: 'tokens.css',
    dest: join(componentsDir(io, config), 'tokens.css'),
    content: `/* From @unframed/tokens ${registry.version} via @unframed/cli. This file is yours: edit it freely. */\n${css}`,
  };
}

/** True when the local file matches upstream, ignoring the version header. */
export function isUpToDate(file: PlannedFile): boolean {
  if (!existsSync(file.dest)) return false;
  const strip = (s: string) => withoutHeader(s.replace(/^\/\* From @unframed\/tokens[^\n]*\n/, ''));
  return strip(readFileSync(file.dest, 'utf8')) === strip(file.content);
}

/** Writes a file, asking before replacing one that differs (it may contain the user's edits). */
export async function writeFile(io: Io, file: PlannedFile, overwrite: boolean): Promise<WriteResult> {
  const rel = relative(io.cwd, file.dest);
  if (existsSync(file.dest)) {
    if (isUpToDate(file)) return 'unchanged';
    const replace = overwrite || (await confirm(io, `${rel} differs from upstream (you may have edited it). Overwrite?`));
    if (!replace) {
      io.err(color.yellow(`  kept ${rel}: it has local changes (use --overwrite to replace, "unframed diff" to compare)`));
      return 'skipped';
    }
    writeFileSync(file.dest, file.content);
    return 'updated';
  }
  mkdirSync(dirname(file.dest), { recursive: true });
  writeFileSync(file.dest, file.content);
  return 'created';
}

/** Rewrites index.ts/js so one import registers every component in the folder. */
export function writeIndex(io: Io, config: Config, registry: Registry): string[] {
  const base = componentsDir(io, config);
  const present = Object.values(registry.components).filter((c) => existsSync(join(base, destPath(c.entry, config.language))));
  const lines = present.map((c) => `import './${destPath(c.entry, 'ts').replace(/\.ts$/, '.js')}';`);
  const content = `${header(registry.version).replace('This file is yours: edit it freely.', 'Generated: rewritten by "unframed add".')}${lines.join('\n')}\n`;
  writeFileSync(join(base, `index.${config.language}`), content);
  return present.map((c) => c.name);
}
