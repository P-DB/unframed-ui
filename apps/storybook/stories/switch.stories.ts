import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread, storyArg } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Switch',
  component: 'uf-switch',
  args: { text: 'Notifications', hint: 'Get notified about new comments.', name: 'notifications' },
  argTypes: { text: storyArg('the label (default slot).') },
  render: (a) => html`<uf-switch ${spread(a)}>${a.text}</uf-switch>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const States: Story = {
  render: () => html`<div class="sb-grid">
    <uf-switch>Off</uf-switch>
    <uf-switch checked>On</uf-switch>
    <uf-switch required>Required</uf-switch>
    <uf-switch disabled>Disabled, off</uf-switch>
    <uf-switch disabled checked>Disabled, on</uf-switch>
  </div>`,
};

export const WithHint: Story = {
  name: 'With hint',
  render: () => html`<div class="sb-stack">
    <uf-switch hint="Uses more battery.">Background sync (hint attribute)</uf-switch>
    <uf-switch>
      Share usage data
      <span slot="hint">Anonymous. <a href="https://example.com" target="_blank">What we collect</a></span>
    </uf-switch>
  </div>`,
};

export const Validation: Story = {
  name: 'Validation (submit the form)',
  render: () => html`<form
    class="sb-stack"
    @submit=${(e: SubmitEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      form.querySelector('output')!.textContent = `Submitted: ${new URLSearchParams(new FormData(form) as never)}`;
    }}
  >
    <uf-switch name="terms" required>Accept the terms</uf-switch>
    <uf-switch name="beta" value="enabled">Join the beta</uf-switch>
    <div><uf-button type="submit">Save</uf-button></div>
    <output class="sb-note"></output>
  </form>`,
};

export const Customized: Story = {
  args: {
    text: 'Pill, larger, teal',
    hint: '',
    checked: true,
    '--uf-switch-radius': '999px',
    '--uf-switch-width': '3.5rem',
    '--uf-switch-height': '2rem',
    '--uf-switch-checked-bg': '#0f766e',
  },
};
