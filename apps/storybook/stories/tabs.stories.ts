import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Tabs',
  component: 'uf-tabs',
  args: { label: 'Project settings', activation: 'auto', orientation: 'horizontal' },
  argTypes: {
    activation: { control: 'inline-radio', options: ['auto', 'manual'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  render: (a) => html`<uf-tabs label=${a.label} activation=${a.activation} orientation=${a.orientation}>
    <uf-tab panel="general">General</uf-tab>
    <uf-tab panel="members">Members</uf-tab>
    <uf-tab panel="billing">Billing</uf-tab>
    <uf-tab panel="archived" disabled>Archived</uf-tab>
    <uf-tab-panel name="general">General settings. Use the arrow keys to move between tabs.</uf-tab-panel>
    <uf-tab-panel name="members">Invite people and manage roles.</uf-tab-panel>
    <uf-tab-panel name="billing">Plans, invoices and payment methods.</uf-tab-panel>
    <uf-tab-panel name="archived">Nothing here.</uf-tab-panel>
  </uf-tabs>`,
};
export default meta;

export const Default: StoryObj = {};
export const Vertical: StoryObj = { args: { orientation: 'vertical' } };
