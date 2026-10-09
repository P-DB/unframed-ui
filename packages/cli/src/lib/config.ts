import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Language } from './transform.js';

export const CONFIG_FILE = 'unframed.json';

export interface Config {
  /** Folder that holds the copied components, relative to the project root. */
  dir: string;
  language: Language;
  /** `package`: use @unframed/tokens from npm. `copy`: tokens.css lives in `dir`. */
  tokens: 'package' | 'copy';
}

export const DEFAULT_DIR = 'src/components/uf-ui';

export function readConfig(cwd: string): Config | null {
  const path = join(cwd, CONFIG_FILE);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8')) as Config;
}

export function writeConfig(cwd: string, config: Config): void {
  writeFileSync(join(cwd, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`);
}

/** Dependencies declared in the project's package.json. */
export function projectDependencies(cwd: string): Set<string> {
  const path = join(cwd, 'package.json');
  if (!existsSync(path)) return new Set();
  const pkg = JSON.parse(readFileSync(path, 'utf8'));
  return new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})]);
}

/** The package manager the project uses, from its lockfile. */
export function detectPackageManager(cwd: string): 'npm' | 'pnpm' | 'yarn' | 'bun' {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(cwd, 'bun.lock')) || existsSync(join(cwd, 'bun.lockb'))) return 'bun';
  return 'npm';
}
