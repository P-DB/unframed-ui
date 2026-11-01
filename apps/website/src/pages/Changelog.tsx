import { UfBadge } from '@unframed/react';
import { Fragment, type ReactNode } from 'react';
import { NavLink } from 'react-router';
import { releases, type ChangeKind } from '../changelog';

const kindTitles: Record<ChangeKind, string> = { major: 'Major changes', minor: 'Minor changes', patch: 'Patch changes' };
const packageNames: Record<string, string> = { core: 'Core', tokens: 'Tokens', react: 'React', vue: 'Vue', angular: 'Angular', cli: 'CLI' };

/** `code`, **bold** and [links](url) in a line of text. */
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/).map((part, i) => {
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) return <a key={i} href={link[2]}>{link[1]}</a>;
    return part;
  });
}

/** A change's text: paragraphs and `- ` lists, separated by blank lines. */
function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((block) => block.split('\n').map((line) => line.trim()).filter(Boolean));
  return (
    <>
      {blocks.map((lines, i) => {
        if (!lines[0]?.startsWith('- ')) return <p key={i}>{inline(lines.join(' '))}</p>;
        // A line that doesn't start a new item continues the one before.
        const items = lines.reduce<string[]>((all, line) => (line.startsWith('- ') ? [...all, line.slice(2)] : [...all.slice(0, -1), `${all.at(-1)} ${line}`]), []);
        return (
          <ul key={i}>
            {items.map((item, j) => (
              <li key={j}>{inline(item)}</li>
            ))}
          </ul>
        );
      })}
    </>
  );
}

/** Every release of Unframed, newest first: all packages in one list. */
export function Changelog() {
  return (
    <article className="changelog">
      <h1>Changelog</h1>
      <p className="lead">What changed in each release. All packages share the same version number.</p>
      <p>
        <NavLink to="/docs/stability">Stability</NavLink> explains what each kind of release may change. Changes listed
        without a package are in <code>@unframed/core</code> and every package built on it.
      </p>
      {releases.map((release) => {
        const kinds = (['major', 'minor', 'patch'] as const).filter((kind) => release.changes.some((change) => change.kind === kind));
        return (
          <section key={release.version} className="changelog__release" aria-labelledby={`v${release.version}`}>
            <h2 id={`v${release.version}`}>
              <a href={`#v${release.version}`} className="changelog__anchor">
                {release.version}
              </a>
            </h2>
            {kinds.map((kind) => (
              <Fragment key={kind}>
                <h3>{kindTitles[kind]}</h3>
                <ul className="changelog__changes">
                  {release.changes
                    .filter((change) => change.kind === kind)
                    .map((change) => (
                      <li key={change.commit} className="changelog__change">
                        {!change.packages.includes('core') && (
                          <span className="changelog__packages">
                            {change.packages.map((pkg) => (
                              <UfBadge key={pkg} size="sm" appearance="outline">
                                {packageNames[pkg] ?? pkg}
                              </UfBadge>
                            ))}
                          </span>
                        )}
                        <Markdown text={change.text} />
                      </li>
                    ))}
                </ul>
              </Fragment>
            ))}
          </section>
        );
      })}
    </article>
  );
}
