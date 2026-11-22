import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { loadData } from '../src/data.js';
import { createServer } from '../src/server.js';

const data = loadData();
const client = new Client({ name: 'test', version: '0.0.0' });

beforeAll(async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await createServer(data).connect(serverTransport);
  await client.connect(clientTransport);
});
afterAll(() => client.close());

async function call(name: string, args: Record<string, unknown> = {}) {
  const result = await client.callTool({ name, arguments: args });
  return { isError: result.isError === true, text: (result.content as { type: string; text: string }[]).map((c) => c.text).join('\n') };
}
const callText = async (name: string, args: Record<string, unknown> = {}) => (await call(name, args)).text;

describe('list_components', () => {
  it('is advertised to the client', async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name)).toContain('list_components');
  });

  it('lists every component with its tags and import', async () => {
    const text = await callText('list_components');
    for (const c of data.components) expect(text).toContain(`- ${c.name}: `);
    expect(text).toContain('<uf-button>');
    expect(text).toContain('@unframed/core/button');
  });

  it('says how to import the components in React, Vue and Angular', async () => {
    const text = await callText('list_components');
    expect(text).toContain("import { UfButton } from '@unframed/react';");
    expect(text).toContain('there is no `@unframed/react/button`');
    expect(text).toContain("'@unframed/angular/button'");
    expect(text).toMatch(/- tabs: .*React\/Vue\/Angular: UfTabs, UfTab, UfTabPanel/);
  });
});

describe('get_component', () => {
  it('returns the docs of a component by name', async () => {
    const { isError, text } = await call('get_component', { name: 'date-picker' });
    expect(isError).toBe(false);
    expect(text).toBe(data.components.find((c) => c.name === 'date-picker')!.docs);
  });

  it.each(['Button', 'uf-button', '<uf-button>', ' BUTTON '])('forgives the way an agent writes the name: %j', async (name) => {
    expect(await callText('get_component', { name })).toContain('<uf-button');
  });

  it('finds a component by one of its other tags', async () => {
    expect(await callText('get_component', { name: 'uf-accordion-item' })).toBe(data.components.find((c) => c.name === 'accordion')!.docs);
  });

  it('accepts a title with spaces', async () => {
    expect(await callText('get_component', { name: 'date range picker' })).toContain('<uf-date-range-picker');
  });

  it('returns an error that says what to do next for an unknown name', async () => {
    const { isError, text } = await call('get_component', { name: 'datepickerz' });
    expect(isError).toBe(true);
    expect(text).toContain('No Unframed component called "datepickerz"');
    expect(text).toContain('list_components');
  });

  it('shows the import of every tag in each framework', async () => {
    const text = await callText('get_component', { name: 'checkbox' });
    expect(text).toContain("import { UfCheckbox, UfCheckboxGroup } from '@unframed/react';");
    expect(text).toContain("import { UfCheckbox, UfCheckboxGroup } from '@unframed/vue';");
    expect(text).toMatch(/import \{ UfCheckbox\b.*\} from '@unframed\/angular\/checkbox';/);
  });

  it('suggests close names', async () => {
    const { text } = await call('get_component', { name: 'date-chooser' });
    expect(text).toMatch(/Did you mean: .*date-picker/);
  });
});

describe('get_framework_guide', () => {
  it.each(['html', 'react', 'vue', 'angular'] as const)('returns the %s guide', async (framework) => {
    const { isError, text } = await call('get_framework_guide', { framework });
    expect(isError).toBe(false);
    expect(text).toBe(data.frameworks[framework]);
  });

  it('rejects an unknown framework', async () => {
    expect((await call('get_framework_guide', { framework: 'svelte' })).isError).toBe(true);
  });
});

describe('validate_usage', () => {
  it('is read-only and returns the report as text', async () => {
    const { tools } = await client.listTools();
    expect(tools.find((t) => t.name === 'validate_usage')?.annotations?.readOnlyHint).toBe(true);
    const { isError, text } = await call('validate_usage', { code: '<uf-button varient="ghost">Save</uf-button>' });
    expect(isError).toBe(false);
    expect(text).toContain('Did you mean "variant"?');
  });
});
