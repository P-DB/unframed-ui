import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Progress',
  component: 'uf-progress',
  args: { label: 'Uploading report.pdf', value: 45, max: 100, 'show-value': true, variant: 'accent', size: 'md' },
  render: (a) => html`<div class="sb-stack"><uf-progress ${spread(a)}></uf-progress></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Indeterminate: Story = {
  args: { label: 'Preparing your export', value: undefined, 'show-value': false },
};

export const Variants: Story = {
  render: () => html`<div class="sb-stack">
    ${(['accent', 'success', 'warning', 'danger'] as const).map(
      (variant, i) => html`<uf-progress label=${variant} variant=${variant} value=${30 + i * 20} show-value></uf-progress>`,
    )}
  </div>`,
};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    <uf-progress label="Small" size="sm" value="60"></uf-progress>
    <uf-progress label="Medium" size="md" value="60"></uf-progress>
    <uf-progress label="Large" size="lg" value="60"></uf-progress>
  </div>`,
};

export const WithoutLabel: Story = {
  name: 'Without a label',
  render: () => html`<div class="sb-stack">
    <uf-progress value="70"></uf-progress>
    <p class="sb-note" style="margin: 0">Named "Progress" (translatable) for screen readers.</p>
  </div>`,
};

export const Live: Story = {
  name: 'Updating',
  render: () => {
    const start = (e: Event) => {
      const bar = (e.currentTarget as Element).previousElementSibling as HTMLElement & { value: number };
      bar.value = 0;
      const timer = setInterval(() => {
        bar.value = Math.min(100, bar.value + 5);
        if (bar.value >= 100) clearInterval(timer);
      }, 150);
    };
    return html`<div class="sb-stack">
      <uf-progress label="Copying files" value="0" show-value></uf-progress>
      <div><uf-button @click=${start}>Start</uf-button></div>
    </div>`;
  },
};

export const Customized: Story = {
  args: { label: 'Custom properties', '--uf-progress-height': '1rem', '--uf-progress-radius': '999px', '--uf-progress-indicator-color': '#0f766e' },
};
