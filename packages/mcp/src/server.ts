import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ComponentData, Data } from './data.js';
import { formatReport, validate } from './validate.js';

/** Turns what an agent might pass (Button, <uf-button>, date picker) into a key like date-picker. */
const normalize = (input: string) =>
  input.trim().toLowerCase().replace(/[<>/]/g, '').replace(/^uf-/, '').replace(/[\s_]+/g, '-');

/** The component by its name, title or any of its tags (uf-accordion-item finds accordion). */
export function findComponent(data: Data, input: string): ComponentData | undefined {
  const key = normalize(input);
  return data.components.find(
    (c) => c.name === key || normalize(c.title) === key || c.tags.some((t) => normalize(t) === key),
  );
}

/** Up to 3 components whose name shares a word with the input, to suggest when nothing matches. */
function suggestions(data: Data, input: string): string[] {
  const words = normalize(input).split('-').filter(Boolean);
  return data.components
    .filter((c) => words.some((w) => c.name.includes(w)))
    .slice(0, 3)
    .map((c) => c.name);
}

/** The Unframed MCP server: its tools, without a transport. */
export function createServer(data: Data): McpServer {
  const server = new McpServer({ name: 'unframed', version: data.version });

  server.registerTool(
    'list_components',
    {
      title: 'List Unframed components',
      description:
        'Lists every Unframed web component with a one-line summary, its tags and what to import, ' +
        'in plain HTML and as React, Vue and Angular components. ' +
        'Call this first to find the right component, before writing any <uf-*> markup.',
    },
    async () => ({
      content: [
        {
          type: 'text',
          text: [
            `Unframed ${data.version}: ${data.components.length} components.`,
            '',
            'Imports:',
            "- HTML, Lit, Svelte and others: import each component's core entry, e.g. `import '@unframed/core/button';`, then write <uf-*> tags.",
            "- React: `import { UfButton } from '@unframed/react';`. Vue: `import { UfButton } from '@unframed/vue';`. One entry point each: there is no `@unframed/react/button`.",
            "- Angular: `import { UfButton } from '@unframed/angular/button';` (the core entry's name), or `UNFRAMED` from '@unframed/angular' for all.",
            '- Call get_framework_guide for the setup (tokens CSS), events and form bindings of your framework.',
            '',
            ...data.components.map(
              (c) =>
                `- ${c.name}: ${c.summary} Tags: ${c.tags.map((t) => `<${t}>`).join(' ')}. Import: ${c.imports.join(', ')}. ` +
                `React/Vue/Angular: ${c.wrappers.join(', ')}`,
            ),
          ].join('\n'),
        },
      ],
    }),
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get an Unframed component',
      description:
        'Returns the full documentation of one Unframed component: examples, attributes and properties, ' +
        'events, slots, CSS parts and custom properties. Call it after list_components, for each component ' +
        'you are about to use, and only use the attributes and events it lists.',
      inputSchema: {
        name: z.string().describe('Component name from list_components, e.g. "date-picker". A tag like "uf-date-picker" also works.'),
      },
    },
    async ({ name }) => {
      const component = findComponent(data, name);
      if (!component) {
        const close = suggestions(data, name);
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text:
                `No Unframed component called "${name}". ` +
                (close.length ? `Did you mean: ${close.join(', ')}? ` : '') +
                'Call list_components to see every name.',
            },
          ],
        };
      }
      return { content: [{ type: 'text', text: component.docs }] };
    },
  );

  server.registerTool(
    'get_framework_guide',
    {
      title: 'Get the Unframed guide for a framework',
      description:
        'How to install and set up Unframed in plain HTML, React, Vue or Angular: what to import, loading the tokens CSS, ' +
        'events, form bindings (v-model, ngModel) and refs. Call it once before writing code for that framework.',
      inputSchema: {
        framework: z.enum(['html', 'react', 'vue', 'angular']).describe('The framework of the project. Use "html" for plain HTML, Lit, Svelte and others.'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ framework }) => ({ content: [{ type: 'text', text: data.frameworks[framework] }] }),
  );

  server.registerTool(
    'validate_usage',
    {
      title: 'Validate Unframed markup',
      description:
        'Checks code that uses Unframed components: unknown tags, attributes and events, invalid attribute values, ' +
        'boolean attributes set to "false", missing labels, and imports from @unframed packages that do not exist. Works with HTML, JSX/React, Vue, Angular, Svelte and Lit ' +
        'templates. Call it on the markup you wrote before showing it to the user, fix every error, and call it again.',
      inputSchema: {
        code: z.string().max(200_000).describe('The markup or component file to check. Only <uf-*> tags and Uf* React components are read.'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ code }) => ({ content: [{ type: 'text', text: formatReport(validate(data, code)) }] }),
  );

  return server;
}
