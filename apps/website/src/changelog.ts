// The release notes of every package, merged into one list per version. Changesets writes a
// CHANGELOG.md in each package; the packages are released together, so most changes appear in
// several of them. Read at build time, so the page is always in step with the packages.
const files = import.meta.glob<string>('../../../packages/*/CHANGELOG.md', { query: '?raw', import: 'default', eager: true });

export type ChangeKind = 'major' | 'minor' | 'patch';

export interface Change {
  /** The commit that added the changeset, short. */
  commit: string;
  kind: ChangeKind;
  /** Markdown: paragraphs, `- ` lists, `code`, **bold** and [links](url). */
  text: string;
  /** The packages it's listed in, like `core` or `angular`. */
  packages: string[];
}

export interface Release {
  version: string;
  changes: Change[];
}

const kinds: Record<string, ChangeKind> = { 'Major Changes': 'major', 'Minor Changes': 'minor', 'Patch Changes': 'patch' };
const rank: Record<ChangeKind, number> = { major: 0, minor: 1, patch: 2 };

/** Newest first, by semver. */
const byVersion = (a: string, b: string) => {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  return y[0] - x[0] || y[1] - x[1] || y[2] - x[2];
};

function parse(): Release[] {
  const releases = new Map<string, Map<string, Change>>();
  for (const [path, markdown] of Object.entries(files)) {
    const pkg = path.split('/').at(-2)!;
    let version = '';
    let kind: ChangeKind = 'patch';
    let current: Change | undefined;
    for (const line of markdown.split('\n')) {
      const heading = /^## (\d+\.\d+\.\d+(?:-[0-9a-z.]+)?)/.exec(line);
      if (heading) {
        version = heading[1];
        current = undefined;
        continue;
      }
      const section = /^### (.+)/.exec(line);
      if (section) {
        kind = kinds[section[1].trim()] ?? 'patch';
        current = undefined;
        continue;
      }
      const entry = /^- ([0-9a-f]{7}): (.*)/.exec(line);
      if (entry && version) {
        const changes = releases.get(version) ?? new Map<string, Change>();
        releases.set(version, changes);
        current = changes.get(entry[1]);
        if (current) {
          // Already read from another package: note it, and keep the larger bump.
          current.packages.push(pkg);
          if (rank[kind] < rank[current.kind]) current.kind = kind;
          current = undefined;
        } else {
          current = { commit: entry[1], kind, text: entry[2], packages: [pkg] };
          changes.set(entry[1], current);
        }
        continue;
      }
      // "Updated dependencies" and the versions under it aren't changes of their own.
      if (line.startsWith('- ')) {
        current = undefined;
        continue;
      }
      if (current) current.text += `\n${line.replace(/^ {2}/, '')}`;
    }
  }
  return [...releases]
    .sort(([a], [b]) => byVersion(a, b))
    .map(([version, changes]) => ({
      version,
      changes: [...changes.values()]
        .map((change) => ({ ...change, text: change.text.trim() }))
        .sort((a, b) => rank[a.kind] - rank[b.kind]),
    }));
}

export const releases = parse();
