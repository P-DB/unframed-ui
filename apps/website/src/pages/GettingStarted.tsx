import { CodeBlock } from '../components/CodeBlock';

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

      <h2>React</h2>
      <p>
        React 19 supports custom elements directly. The <code>@unframed/react</code> wrappers add typed props and
        camelCase event handlers like <code>onUfTabChange</code>.
      </p>
      <CodeBlock standalone samples={[{ label: 'Terminal', code: 'npm install @unframed/react @unframed/tokens' }]} />
      <CodeBlock
        standalone
        samples={[
          {
            label: 'React',
            code: `import '@unframed/tokens/tokens.css';
import { UfButton, UfDialog } from '@unframed/react';

export function DeleteButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <UfButton variant="danger" onClick={() => setOpen(true)}>Delete</UfButton>
      <UfDialog label="Delete project?" open={open} onUfHide={() => setOpen(false)}>…</UfDialog>
    </>
  );
}`,
          },
        ]}
      />
    </article>
  );
}
