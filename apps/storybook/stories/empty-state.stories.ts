import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread, storyArg } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Empty state',
  component: 'uf-empty-state',
  args: { heading: 'No projects yet', icon: 'inbox', text: 'Projects keep your files and your team together.' },
  argTypes: { text: storyArg('the explanation (default slot).') },
  render: (a) => html`<uf-empty-state ${spread(a)}>
    ${a.text}
    <uf-button slot="actions"><uf-icon slot="prefix" name="plus"></uf-icon>New project</uf-button>
  </uf-empty-state>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const NoResults: Story = {
  name: 'No search results',
  render: () => html`<uf-empty-state icon="search">
    <h3 slot="heading">No results for “invoice 2019”</h3>
    Check the spelling, or try a shorter search.
    <uf-button slot="actions" variant="outline">Clear search</uf-button>
  </uf-empty-state>`,
};

export const InACard: Story = {
  name: 'In a card',
  render: () => html`<div style="max-width: 28rem">
    <uf-card>
      <strong slot="header">Invoices</strong>
      <uf-empty-state heading="No invoices" icon="file" style="--uf-empty-state-padding: 1rem 0">Invoices you send appear here.</uf-empty-state>
    </uf-card>
  </div>`,
};

export const Customized: Story = {
  name: 'Custom properties',
  args: { '--uf-empty-state-icon-size': '4rem', '--uf-empty-state-icon-color': '#2f9e6b' },
};
