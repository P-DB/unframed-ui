import { CodeBlock } from '../components/CodeBlock';

export function Theming() {
  return (
    <article>
      <h1>Theming</h1>
      <p className="lead">
        Everything is driven by CSS custom properties, at three levels: design tokens, per-component properties, and CSS
        parts.
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
      <p>For anything the properties don't cover, style the inside of a component with <code>::part()</code>.</p>
      <CodeBlock
        standalone
        samples={[
          {
            label: 'CSS',
            code: `uf-button::part(base) {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

uf-input:state(user-invalid)::part(box) {
  background: #fff5f5;
}`,
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
