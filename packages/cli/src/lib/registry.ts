import { readFileSync } from 'node:fs';

export interface RegistryComponent {
  name: string;
  /** Entry file, e.g. components/button/button.ts. */
  entry: string;
  tag: string;
  summary: string;
  /** The component's own files. */
  files: string[];
  /** Shared helpers it needs, e.g. internal/define.ts. */
  internal: string[];
  /** Other components it imports. */
  dependencies: string[];
  /** npm packages its code imports. */
  npm: string[];
}

export interface Registry {
  version: string;
  components: Record<string, RegistryComponent>;
  /** Source of every file, keyed by path relative to @unframed/core/src. */
  files: Record<string, string>;
  tokens: string | null;
}

let cached: Registry | undefined;

export function loadRegistry(): Registry {
  cached ??= JSON.parse(readFileSync(new URL('../../registry.json', import.meta.url), 'utf8')) as Registry;
  return cached;
}

/** The requested components plus everything they depend on, dependencies first. */
export function resolveComponents(registry: Registry, names: string[]): RegistryComponent[] {
  const ordered: RegistryComponent[] = [];
  const seen = new Set<string>();
  const visit = (name: string) => {
    if (seen.has(name)) return;
    const component = registry.components[name];
    if (!component) throw new UnknownComponentError(name, Object.keys(registry.components));
    seen.add(name);
    component.dependencies.forEach(visit);
    ordered.push(component);
  };
  names.forEach(visit);
  return ordered;
}

export class UnknownComponentError extends Error {
  constructor(name: string, known: string[]) {
    const close = known.filter((k) => k.includes(name) || name.includes(k));
    super(`Unknown component "${name}".${close.length ? ` Did you mean ${close.join(', ')}?` : ''} Run "unframed list" to see them all.`);
  }
}
