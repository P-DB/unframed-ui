import { Link, useParams } from 'react-router';
import { ApiTables } from '../components/ApiTables';
import { CodeBlock } from '../components/CodeBlock';
import { findPage } from '../demos';
import { getElement } from '../manifest';
import { NotFound } from './NotFound';

/** The HTML example with Vue component names: <uf-tab-panel> -> <UfTabPanel>. */
function toVue(html: string): string {
  return html.replace(/<(\/?)uf-([a-z-]+)/g, (_, slash: string, name: string) =>
    `<${slash}Uf${name.replace(/(^|-)(\w)/g, (_m: string, _d: string, c: string) => c.toUpperCase())}`,
  );
}

/** Renders `backticks` in short descriptions as code. */
function Inline({ text }: { text?: string }) {
  if (!text) return null;
  return <>{text.split(/(`[^`]+`)/).map((part, i) => (part.startsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part))}</>;
}

export function ComponentPage() {
  const page = findPage(useParams().slug);
  if (!page) return <NotFound />;
  const main = getElement(page.tags[0]);

  return (
    <article>
      <h1>{page.title}</h1>
      <p className="lead">
        <Inline text={main?.description?.split('\n\n')[0] ?? main?.summary} />
      </p>

      <CodeBlock
        standalone
        samples={[
          { label: 'npm', code: `import '@unframed/core/${page.module}';` },
          { label: 'Copy the source', code: `npx @unframed/cli add ${page.module}` },
        ]}
      />

      <h2>Examples</h2>
      {page.examples.map(({ title, description, stack, Preview, html, react, vue, angular, notes }) => (
        <section key={title}>
          <h3>{title}</h3>
          {description && (
            <p>
              <Inline text={description} />
            </p>
          )}
          <div className="demo">
            <div className={`demo__preview${stack ? ' demo__preview--stack' : ''}`}>
              <Preview />
            </div>
            <CodeBlock
              samples={[
                { label: 'HTML', code: html },
                { label: 'React', code: react },
                { label: 'Vue', code: vue ?? toVue(html) },
                { label: 'Angular', code: angular ?? html },
              ]}
            />
          </div>
          {notes && (
            <ul className="example-notes">
              {notes.map((note) => (
                <li key={note} className="example-notes__item">
                  <Inline text={note} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {page.tags.map((tag) => (
        <ApiTables key={tag} tag={tag} />
      ))}

      <p style={{ marginTop: '3rem' }}>
        <Link to="/components">← All components</Link>
      </p>
    </article>
  );
}
