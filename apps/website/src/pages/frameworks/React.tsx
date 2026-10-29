import { CodeBlock } from '../../components/CodeBlock';
import { NextSteps } from '../../components/LinkCards';
import { react } from './snippets';

export function ReactGuide() {
  return (
    <article>
      <h1>React</h1>
      <p className="lead">
        <code>@unframed/react</code> has a React component for every element, with typed props and camelCase event
        handlers. It works with React 18 and 19.
      </p>

      <h2>1. Install</h2>
      <CodeBlock standalone samples={[{ label: 'Terminal', code: react.install }]} />
      <p>
        It installs <code>@unframed/core</code> too. Each component registers its element when you import it, so your
        bundle only has what you use.
      </p>

      <h2>2. Set up</h2>
      <CodeBlock standalone samples={[{ label: 'main.tsx', lang: 'tsx', code: react.setup }]} />

      <h2>3. Use the components</h2>
      <p>A sign-up form with controlled fields, a dialog and a toast:</p>
      <CodeBlock standalone samples={[{ label: 'Signup.tsx', lang: 'tsx', code: react.app }]} />
      <ul>
        <li>
          <strong>Props</strong> are the element's properties, typed: <code>variant</code>, <code>open</code>,{' '}
          <code>value</code>… Booleans keep their native names (<code>disabled</code>, <code>checked</code>).
        </li>
        <li>
          <strong>Events</strong>: <code>onInput</code> and <code>onChange</code> for form controls, and{' '}
          <code>on</code> + the event name in camelCase for the rest: <code>uf-hide</code> → <code>onUfHide</code>,{' '}
          <code>uf-tab-change</code> → <code>onUfTabChange</code>.
        </li>
        <li>
          <strong>Forms</strong>: the fields join the surrounding <code>&lt;form&gt;</code>, so <code>required</code>,
          native validation and <code>FormData</code> work, controlled or not.
        </li>
        <li>
          <strong>Controlled or not</strong>: like React's own inputs, <code>value</code> and <code>checked</code> are set
          again on every render, so keep them in state and update it in <code>onInput</code> or <code>onChange</code>. For
          just a starting value the user can change, use <code>defaultValue</code> or <code>defaultChecked</code>.
        </li>
        <li>
          <strong>Toasts and icons</strong>: <code>toast()</code> and <code>registerIcons()</code> come from{' '}
          <code>@unframed/core</code>.
        </li>
      </ul>

      <h2>Methods and refs</h2>
      <p>A ref gives you the element itself, with its methods:</p>
      <CodeBlock standalone samples={[{ label: 'Help.tsx', lang: 'tsx', code: react.ref }]} />

      <h2>Without the wrappers</h2>
      <p>
        React 19 supports custom elements directly, so <code>&lt;uf-button&gt;</code> works after{' '}
        <code>import '@unframed/core'</code>. The wrappers add the types and the camelCase event handlers.
      </p>

      <h2>Next</h2>
      <NextSteps />
    </article>
  );
}
