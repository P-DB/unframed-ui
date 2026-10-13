import { Link } from 'react-router';
import { CodeBlock } from '../../components/CodeBlock';
import { html } from './snippets';

export function HtmlGuide() {
  return (
    <article>
      <h1>HTML &amp; JavaScript</h1>
      <p className="lead">
        Unframed components are standard custom elements: use them in plain HTML, or in any framework without its own
        package (Svelte, Solid, Astro, Lit…).
      </p>

      <h2>1. Install</h2>
      <CodeBlock standalone samples={[{ label: 'Terminal', code: html.install }]} />

      <h2>2. Set up</h2>
      <p>Load the tokens once, then import the components you use. Each import registers its tags.</p>
      <CodeBlock standalone samples={[{ label: 'main.js', lang: 'javascript', code: html.setup }]} />

      <h2>3. Use the components</h2>
      <p>
        A sign-up form with validation, a dialog and a toast. Form controls join the surrounding{' '}
        <code>&lt;form&gt;</code> like native ones: <code>required</code>, <code>FormData</code>, reset and the
        browser's validation messages all work.
      </p>
      <CodeBlock
        standalone
        samples={[
          { label: 'index.html', lang: 'html', code: html.markup },
          { label: 'main.js', lang: 'javascript', code: html.script },
        ]}
      />
      <ul>
        <li>
          <strong>Attributes and properties</strong> work like native elements: <code>disabled</code>,{' '}
          <code>value</code>, <code>checked</code>…
        </li>
        <li>
          <strong>Events</strong>: form controls fire the native <code>input</code> and <code>change</code>. Others
          fire <code>uf-*</code> events like <code>uf-show</code>, <code>uf-hide</code> and{' '}
          <code>uf-tab-change</code>.
        </li>
        <li>
          <strong>Methods</strong> like <code>dialog.show()</code> and <code>popover.toggle()</code> are on the
          elements.
        </li>
      </ul>
      <p>Each component's page lists all of its attributes, events, methods and slots.</p>

      <h2>Without a build step</h2>
      <p>Load everything from a CDN, for prototypes and static pages:</p>
      <CodeBlock standalone samples={[{ label: 'HTML', code: html.cdn }]} />

      <h2>TypeScript</h2>
      <p>
        The types come with the package. Importing a component adds its tag to <code>HTMLElementTagNameMap</code>, so{' '}
        <code>querySelector</code> knows the element type:
      </p>
      <CodeBlock standalone samples={[{ label: 'TypeScript', lang: 'typescript', code: html.types }]} />

      <p>
        Next: <Link to="/components">browse the components</Link> or <Link to="/docs/theming">change the look</Link>.
      </p>
    </article>
  );
}
