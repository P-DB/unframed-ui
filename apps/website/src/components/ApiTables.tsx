import type { ReactNode } from 'react';
import { getElement, type ElementDoc } from '../manifest';

/** Renders `backticks` in manifest descriptions as code. */
function Text({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <>
      {children.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part,
      )}
    </>
  );
}

function Table({ title, head, rows }: { title: string; head: string[]; rows: ReactNode[][] }) {
  if (!rows.length) return null;
  return (
    <>
      <h3>{title}</h3>
      <div className="api-table">
        <table className="api-table__table">
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h} scope="col" className="api-table__header">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((cells, i) => (
              <tr key={i} className="api-table__row">
                {cells.map((cell, j) => (
                  <td key={j} className="api-table__cell">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const name = (n: string) => <code className="api-table__name">{n}</code>;
const type = (t?: { text: string }) => (t ? <span className="api-table__type">{t.text}</span> : null);

export function ApiTables({ tag, heading = true }: { tag: string; heading?: boolean }) {
  const el: ElementDoc | undefined = getElement(tag);
  if (!el) return <p>No API documentation found for &lt;{tag}&gt;.</p>;

  const attributes = el.attributes ?? [];
  const attributeFields = new Set(attributes.map((a) => a.fieldName ?? a.name));
  // Properties without an attribute (e.g. `value`, `validity`) and public methods.
  const properties = (el.members ?? []).filter((m) => m.kind === 'field' && !attributeFields.has(m.name));
  const methods = (el.members ?? []).filter((m) => m.kind === 'method');

  return (
    <section>
      {heading && <h2 id={`api-${tag}`}>&lt;{tag}&gt; API</h2>}
      <Table
        title="Attributes"
        head={['Name', 'Description', 'Type', 'Default']}
        rows={attributes.map((a) => [name(a.name), <Text>{a.description}</Text>, type(a.type), a.default ? <code>{a.default}</code> : null])}
      />
      <Table
        title="Properties"
        head={['Name', 'Description', 'Type']}
        rows={properties.map((p) => [name(p.name), <Text>{p.description}</Text>, type(p.type)])}
      />
      <Table
        title="Methods"
        head={['Name', 'Description']}
        rows={methods.map((m) => [name(`${m.name}(${(m.parameters ?? []).map((p) => p.name).join(', ')})`), <Text>{m.description}</Text>])}
      />
      <Table
        title="Events"
        head={['Name', 'Description', 'Type']}
        rows={(el.events ?? []).map((e) => [name(e.name), <Text>{e.description}</Text>, type(e.type)])}
      />
      <Table
        title="Slots"
        head={['Name', 'Description']}
        rows={(el.slots ?? []).map((s) => [name(s.name || '(default)'), <Text>{s.description}</Text>])}
      />
      <Table
        title="CSS parts"
        head={['Name', 'Description']}
        rows={(el.cssParts ?? []).map((p) => [name(`::part(${p.name})`), <Text>{p.description}</Text>])}
      />
      <Table
        title="CSS custom properties"
        head={['Name', 'Description']}
        rows={(el.cssProperties ?? []).map((p) => [name(p.name), <Text>{p.description}</Text>])}
      />
      <Table
        title="Custom states"
        head={['Name', 'Description']}
        rows={(el.cssStates ?? []).map((s) => [name(`:state(${s.name})`), <Text>{s.description}</Text>])}
      />
    </section>
  );
}
