import { Link } from 'react-router';
import { CodeBlock } from '../../components/CodeBlock';
import { vue } from './snippets';

export function VueGuide() {
  return (
    <article>
      <h1>Vue</h1>
      <p className="lead">
        <code>@unframed/vue</code> has a Vue component for every element, with typed props and events in your
        templates, and <code>v-model</code> on every form control.
      </p>

      <h2>1. Install</h2>
      <CodeBlock standalone samples={[{ label: 'Terminal', code: vue.install }]} />
      <p>
        It installs <code>@unframed/core</code> too. No Vite configuration needed.
      </p>

      <h2>2. Set up</h2>
      <CodeBlock standalone samples={[{ label: 'main.ts', lang: 'typescript', code: vue.setup }]} />

      <h2>3. Use the components</h2>
      <p>A sign-up form with two-way binding, a dialog and a toast:</p>
      <CodeBlock standalone samples={[{ label: 'App.vue', lang: 'vue', code: vue.app }]} />
      <ul>
        <li>
          <strong>v-model</strong> binds <code>value</code> on inputs, textareas, selects, comboboxes and radio
          groups, <code>checked</code> on checkboxes and switches, and the array of checked values on checkbox groups.
          Use <code>v-model:indeterminate</code> for a checkbox's indeterminate state.
        </li>
        <li>
          <strong>Events</strong> keep their names: <code>@input</code>, <code>@change</code>,{' '}
          <code>@uf-hide</code>, <code>@uf-tab-change</code>…
        </li>
        <li>
          <strong>Slots</strong> are the element's slots: use <code>slot="footer"</code> on the child, as in plain
          HTML.
        </li>
        <li>
          <strong>Toasts and icons</strong>: <code>toast()</code> and <code>registerIcons()</code> come from{' '}
          <code>@unframed/core</code>.
        </li>
      </ul>

      <h2>Register globally</h2>
      <p>To use the components everywhere without importing them:</p>
      <CodeBlock standalone samples={[{ label: 'main.ts', lang: 'typescript', code: vue.plugin }]} />

      <h2>Plain tags</h2>
      <p>
        Prefer <code>&lt;uf-input&gt;</code> to <code>&lt;UfInput&gt;</code>? Import <code>@unframed/core</code> and
        tell Vue's compiler that <code>uf-*</code> tags are custom elements. You lose <code>v-model</code> and the
        types.
      </p>
      <CodeBlock standalone samples={[{ label: 'vite.config.ts', lang: 'typescript', code: vue.plainTags }]} />

      <p>
        Next: <Link to="/components">browse the components</Link> or <Link to="/docs/theming">change the look</Link>.
      </p>
    </article>
  );
}
