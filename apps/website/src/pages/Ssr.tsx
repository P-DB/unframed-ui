import { Link } from 'react-router';
import { CodeBlock } from '../components/CodeBlock';
import { ssr, vue } from './frameworks/snippets';

export function Ssr() {
  return (
    <article>
      <h1>Server-side rendering</h1>
      <p className="lead">
        Unframed works in server-rendered apps: Next.js, Nuxt and Angular SSR. There's nothing extra to set up: install
        your framework's package as usual.
      </p>

      <h2>How it works</h2>
      <ul>
        <li>
          <strong>On the server</strong>, each component is rendered as its tag, with its attributes and the content you
          put inside it: <code>{'<uf-button variant="primary">Save</uf-button>'}</code>.
        </li>
        <li>
          <strong>In the browser</strong>, components draw themselves when their JavaScript loads, then your framework
          hydrates the page as usual.
        </li>
        <li>
          <strong>In between</strong>, the tokens stylesheet keeps components invisible but in their place, and content
          that only shows once opened takes no space. So the raw text of a closed dialog, a menu or a select's options
          never flashes on screen.
        </li>
      </ul>
      <p>
        Importing Unframed on the server is safe, and <code>toast()</code> does nothing there. Every release is checked
        for both.
      </p>

      <h2>Next.js</h2>
      <p>With the App Router, load the tokens in the root layout:</p>
      <CodeBlock standalone samples={[{ label: 'app/layout.tsx', lang: 'tsx', code: ssr.nextLayout }]} />
      <p>
        Every Unframed component is a client component already, so you can use them in server components. Event handlers
        and state need a client component, as with any React code in Next.js: put them in a file that starts with{' '}
        <code>'use client'</code>.
      </p>
      <CodeBlock
        standalone
        samples={[
          { label: 'app/page.tsx', lang: 'tsx', code: ssr.nextPage },
          { label: 'app/signup.tsx', lang: 'tsx', code: ssr.nextClient },
        ]}
      />

      <h2>Nuxt</h2>
      <p>Add the tokens to your config. The components work as in any Vue app:</p>
      <CodeBlock
        standalone
        samples={[
          { label: 'nuxt.config.ts', lang: 'typescript', code: ssr.nuxtConfig },
          { label: 'app.vue', lang: 'vue', code: vue.app },
        ]}
      />

      <h2>Angular</h2>
      <p>
        With SSR and hydration (the default for new Angular apps), add the tokens to your global styles. Templates,{' '}
        <code>formControlName</code> and <code>ngModel</code> work as described in the{' '}
        <Link to="/docs/frameworks/angular">Angular guide</Link>.
      </p>
      <CodeBlock standalone samples={[{ label: 'src/styles.css', lang: 'css', code: ssr.angularStyles }]} />

      <h2>Good to know</h2>
      <ul>
        <li>
          The server sends what's needed to draw each component, not the drawing itself: a component shows once its
          JavaScript has loaded. Text you put inside components, like a button's label or a dialog's content, is in the
          HTML for search engines.
        </li>
        <li>
          Controlled values are in the HTML too: an input's <code>value</code>, a checkbox's <code>checked</code>, a
          button's <code>disabled</code>. Each component starts in the right state, before your framework hydrates.
        </li>
        <li>
          Tested with Next.js 16, Nuxt 4 and Angular 22: production builds and development servers, with no hydration
          warnings.
        </li>
      </ul>
    </article>
  );
}
