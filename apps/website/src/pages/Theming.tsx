import { Link } from 'react-router';
import { CodeBlock } from '../components/CodeBlock';

export function Theming() {
  return (
    <article>
      <h1>Theming</h1>
      <p className="lead">
        Everything is driven by CSS custom properties, at three levels: design tokens, per-component properties, and CSS
        parts.
      </p>

      <p>
        Want a full palette from one color? The <Link to="/docs/theme-generator">theme generator</Link> builds the
        tokens for you, with a live preview and contrast checks.
      </p>

      <h2>1. Design tokens</h2>
      <p>
        Change a token and every component follows. Semantic tokens such as <code>--uf-color-accent</code> point at a
        palette, so you can retheme by overriding either.
      </p>
      <CodeBlock
        standalone
        samples={[
          {
            label: 'CSS',
            code: `:root {
  --uf-palette-accent-600: #0f766e;   /* the accent everywhere */
  --uf-radius-control: 6px;           /* rounded buttons and fields */
  --uf-font-family-sans: 'Inter', sans-serif;
}`,
          },
        ]}
      />

      <h2>2. Component properties</h2>
      <p>Each component documents its own custom properties on its page.</p>
      <CodeBlock
        standalone
        samples={[
          {
            label: 'CSS',
            code: `uf-button.pill {
  --uf-button-radius: 999px;
}

uf-dialog.wide {
  --uf-dialog-width: 48rem;
}`,
          },
        ]}
      />

      <h2>3. CSS parts</h2>
      <p>
        Components render their internals in a shadow root, which keeps your page's CSS from reaching in by accident. A
        selector like <code>uf-button button</code> never matches the real <code>&lt;button&gt;</code> inside. That
        protection is what stops a global stylesheet from breaking a component.
      </p>
      <p>
        To let you style the inside on purpose, each component marks some internal elements with a <code>part</code>{' '}
        name. Target them with <code>::part()</code>:
      </p>
      <CodeBlock
        standalone
        samples={[
          {
            label: 'CSS',
            code: `/* Inside <uf-button>: <button part="base"><span part="label">…</span></button> */
uf-button::part(base) {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* States and pseudo-elements work on the part itself */
uf-button::part(base):hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.2);
}

/* Combine with the component's custom states */
uf-input:state(user-invalid)::part(box) {
  background: #fff5f5;
}`,
          },
        ]}
      />
      <p>
        A part accepts any CSS property, plus states like <code>:hover</code> and <code>:focus-visible</code> and
        pseudo-elements like <code>::before</code>. Only the element itself is reachable. You can't select inside it (
        <code>::part(base) span</code>) or by structure (<code>::part(label):first-child</code>). That way the
        component's internals can change without breaking your styles.
      </p>
      <p>
        Each component lists its parts in the <strong>CSS parts</strong> table on its page, and in Storybook under{' '}
        <strong>css shadow parts</strong>.
      </p>

      <h3>Custom properties or parts?</h3>
      <div className="api-table">
        <table className="api-table__table">
          <thead>
            <tr>
              <th scope="col" className="api-table__header"></th>
              <th scope="col" className="api-table__header">Custom properties</th>
              <th scope="col" className="api-table__header">
                <code>::part()</code>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="api-table__row">
              <td className="api-table__cell">Example</td>
              <td className="api-table__cell">
                <code>--uf-button-radius: 999px</code>
              </td>
              <td className="api-table__cell">
                <code>uf-button::part(base) {'{ … }'}</code>
              </td>
            </tr>
            <tr className="api-table__row">
              <td className="api-table__cell">What you can change</td>
              <td className="api-table__cell">What the component exposes as a property</td>
              <td className="api-table__cell">Any CSS property of that element</td>
            </tr>
            <tr className="api-table__row">
              <td className="api-table__cell">Scope</td>
              <td className="api-table__cell">Inherited: set once on a page section or globally</td>
              <td className="api-table__cell">Per selector</td>
            </tr>
            <tr className="api-table__row">
              <td className="api-table__cell">Use it for</td>
              <td className="api-table__cell">Colors, sizes, radius: the usual tweaks</td>
              <td className="api-table__cell">Anything the properties don't cover</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Start with tokens and custom properties. Use <code>::part()</code> when you need more, before reaching for{' '}
        <code>npx @unframed/cli add</code> to copy and own the source.
      </p>
      <CodeBlock
        standalone
        samples={[
          {
            label: 'CSS',
            code: `uf-input::part(box) { box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.1); }
uf-dialog::part(header) { border-bottom: 1px solid var(--uf-color-border); }
uf-accordion-item::part(chevron) { color: var(--uf-color-accent); }
uf-toaster::part(toast) { backdrop-filter: blur(8px); }`,
          },
        ]}
      />

      <h2>Dark mode</h2>
      <p>
        Dark mode follows the operating system by default. Force a theme on the whole page or on any section with{' '}
        <code>data-uf-theme</code>:
      </p>
      <CodeBlock standalone samples={[{ label: 'HTML', code: `<html data-uf-theme="dark">…</html>` }]} />
    </article>
  );
}
