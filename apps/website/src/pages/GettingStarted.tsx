import { Link } from 'react-router';
import { CodeBlock } from '../components/CodeBlock';

const frameworks = [
  ['/docs/frameworks/html', 'HTML & JavaScript', 'Plain HTML, Svelte, Solid, Astro… or straight from a CDN.'],
  ['/docs/frameworks/react', 'React', 'Typed components and camelCase event handlers.'],
  ['/docs/frameworks/vue', 'Vue', 'Typed components with v-model on every form control.'],
  ['/docs/frameworks/angular', 'Angular', 'Standalone components and Angular forms support.'],
];

export function GettingStarted() {
  return (
    <article>
      <h1>Installation</h1>
      <p className="lead">
        Use Unframed from npm and get updates, or copy components into your project and own the code. You can mix both.
      </p>

      <h2>From npm</h2>
      <CodeBlock standalone samples={[{ label: 'Terminal', code: 'npm install @unframed/core @unframed/tokens' }]} />
      <p>Load the tokens once, then import the components you use. Each import registers its tags.</p>
      <CodeBlock
        standalone
        samples={[
          {
            label: 'JavaScript',
            code: `import '@unframed/tokens/tokens.css';
import '@unframed/core/button';
import '@unframed/core/dialog';
// or everything at once:
import '@unframed/core';`,
          },
        ]}
      />
      <p>Then use the tags in any HTML, template or JSX:</p>
      <CodeBlock standalone samples={[{ label: 'HTML', code: '<uf-button variant="primary">Save</uf-button>' }]} />

      <h2>Copy the source</h2>
      <p>
        The CLI copies a component's source, plus the shared helpers it needs, into your project. The files are yours:
        change anything. It never overwrites a file you edited unless you ask, and <code>diff</code> shows how your copy
        differs from the latest version.
      </p>
      <CodeBlock
        standalone
        samples={[
          {
            label: 'Terminal',
            code: `npx @unframed/cli init             # folder, TypeScript or JavaScript, tokens
npx @unframed/cli add dialog combobox
npx @unframed/cli list             # what's available and what you added
npx @unframed/cli diff dialog      # compare your copy with upstream`,
          },
        ]}
      />
      <p>
        Use each component from one place only: an npm import and a copy both register the same tag, and whichever loads
        first wins.
      </p>

      <h2>AI assistants</h2>
      <p>
        <code>npx @unframed/cli skill</code> teaches your coding assistant Unframed. See{' '}
        <Link to="/docs/ai-assistants">AI assistants</Link>.
      </p>

      <h2>Your framework</h2>
      <p>
        React, Vue and Angular have their own packages, with typed props, their event syntax and form bindings. Each
        guide has everything you need to set it up:
      </p>
      <div className="card-grid">
        {frameworks.map(([to, title, text]) => (
          <Link key={to} to={to} className="card">
            <strong className="card__title">{title}</strong>
            <span className="card__text">{text}</span>
          </Link>
        ))}
      </div>
      <p>
        Not sure which packages you need? See <Link to="/docs/packages">Packages</Link>.
      </p>
    </article>
  );
}
