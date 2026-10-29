import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread, storyArg } from '../.storybook/args';

const variants = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'];

const meta: Meta = {
  title: 'Components/Alert',
  component: 'uf-alert',
  args: { text: 'A new version is available.', variant: 'info', heading: '', closable: false, 'without-icon': false },
  argTypes: { text: storyArg('the message (default slot).') },
  render: (a) => html`<div class="sb-stack"><uf-alert ${spread(a)}>${a.text}</uf-alert></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Variants: Story = {
  render: () => html`<div class="sb-stack">
    ${variants.map((variant) => html`<uf-alert variant=${variant}><code>${variant}</code>: a message in the page.</uf-alert>`)}
  </div>`,
};

export const HeadingAndActions: Story = {
  name: 'Heading and actions',
  render: () => html`<div class="sb-stack">
    <uf-alert variant="warning" heading="Your trial ends in 3 days">
      Choose a plan to keep your projects and invoices.
      <uf-button slot="actions" size="sm">Choose a plan</uf-button>
      <uf-button slot="actions" size="sm" variant="ghost">Remind me later</uf-button>
    </uf-alert>
  </div>`,
};

export const Closable: Story = {
  render: () => html`<div class="sb-stack">
    <uf-alert variant="success" closable @uf-hide=${(e: Event) => ((e.target as HTMLElement).nextElementSibling as HTMLElement).hidden = false}>
      Your changes were saved.
    </uf-alert>
    <div hidden>
      <uf-button size="sm" variant="outline" @click=${(e: Event) => {
        const wrapper = (e.currentTarget as HTMLElement).parentElement!;
        wrapper.hidden = true;
        (wrapper.previousElementSibling as HTMLElement & { show(): void }).show();
      }}>Show it again</uf-button>
    </div>
  </div>`,
};

export const CustomIcon: Story = {
  name: 'Without an icon, or with your own',
  render: () => html`<div class="sb-stack">
    <uf-alert variant="neutral" without-icon>Maintenance on Sunday from 02:00 to 04:00 UTC.</uf-alert>
    <uf-alert variant="accent"><uf-icon slot="icon" name="user"></uf-icon>John Smith shared a project with you.</uf-alert>
  </div>`,
};

export const Customized: Story = {
  name: 'Custom properties',
  args: { heading: 'Custom properties', '--uf-alert-bg': '#0f766e', '--uf-alert-color': '#ffffff', '--uf-alert-icon-color': '#ffffff', '--uf-alert-border-color': '#0f766e', '--uf-alert-radius': '0' },
};
