import { getElement, type ElementDoc } from '../manifest';
import { code, DocTable, rich, type Cell } from './DocTable';

function Table({ title, head, rows }: { title: string; head: string[]; rows: Cell[][] }) {
  if (!rows.length) return null;
  return (
    <>
      <h3>{title}</h3>
      <DocTable
        label={title}
        columns={head.map((h, i) => [`c${i}`, h, i === 0 ? '30%' : undefined])}
        rows={rows.map((cells) => Object.fromEntries(cells.map((c, i) => [`c${i}`, c])))}
      />
    </>
  );
}

const name = (n: string) => code(n);
const type = (t?: { text: string }) => (t ? t.text : null);
const Text = ({ children }: { children?: string }) => rich(children);

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
        rows={attributes.map((a) => [name(a.name), Text({ children: a.description }), type(a.type), a.default ? code(a.default) : null])}
      />
      <Table
        title="Properties"
        head={['Name', 'Description', 'Type']}
        rows={properties.map((p) => [name(p.name), Text({ children: p.description }), type(p.type)])}
      />
      <Table
        title="Methods"
        head={['Name', 'Description']}
        rows={methods.map((m) => [name(`${m.name}(${(m.parameters ?? []).map((p) => p.name).join(', ')})`), Text({ children: m.description })])}
      />
      <Table
        title="Events"
        head={['Name', 'Description', 'Type']}
        rows={(el.events ?? []).map((e) => [name(e.name), Text({ children: e.description }), type(e.type)])}
      />
      <Table
        title="Slots"
        head={['Name', 'Description']}
        rows={(el.slots ?? []).map((s) => [name(s.name || '(default)'), Text({ children: s.description })])}
      />
      <Table
        title="CSS parts"
        head={['Name', 'Description']}
        rows={(el.cssParts ?? []).map((p) => [name(`::part(${p.name})`), Text({ children: p.description })])}
      />
      <Table
        title="CSS custom properties"
        head={['Name', 'Description']}
        rows={(el.cssProperties ?? []).map((p) => [name(p.name), Text({ children: p.description })])}
      />
      <Table
        title="Custom states"
        head={['Name', 'Description']}
        rows={(el.cssStates ?? []).map((s) => [name(`:state(${s.name})`), Text({ children: s.description })])}
      />
    </section>
  );
}
