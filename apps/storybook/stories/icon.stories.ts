import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { registerIcons } from '@unframed/core';
import { icons } from '../../../packages/core/src/internal/icons';
import { spread } from '../.storybook/args';

const names = Object.keys(icons);

registerIcons({
  heart:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
});

const meta: Meta = {
  title: 'Components/Icon',
  component: 'uf-icon',
  args: { name: 'check-circle', '--uf-icon-size': '2rem' },
  render: (a) => html`<uf-icon ${spread(a)}></uf-icon>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const BuiltInSet: Story = {
  name: 'Built-in set',
  render: () => html`<div class="sb-row" style="gap: 1.5rem">
    ${names.map(
      (name) => html`<div style="display: grid; justify-items: center; gap: 0.5rem; width: 6rem; font-size: 12px">
        <uf-icon name=${name} style="--uf-icon-size: 1.5rem"></uf-icon>${name}
      </div>`,
    )}
  </div>`,
};

export const Sizes: Story = {
  render: () => html`<div class="sb-row" style="align-items: baseline">
    <span style="font-size: 0.875rem"><uf-icon name="info"></uf-icon> follows</span>
    <span style="font-size: 1.25rem"><uf-icon name="info"></uf-icon> the font</span>
    <span style="font-size: 2rem"><uf-icon name="info"></uf-icon> size</span>
    <uf-icon name="info" style="--uf-icon-size: 3rem"></uf-icon>
  </div>
  <p class="sb-note">Icons are <code>1em</code> by default; set <code>--uf-icon-size</code> for a fixed size.</p>`,
};

export const Colors: Story = {
  render: () => html`<div class="sb-row" style="font-size: 2rem">
    <uf-icon name="check-circle" style="color: #52b69a"></uf-icon>
    <uf-icon name="alert-triangle" style="color: #f59e0b"></uf-icon>
    <uf-icon name="alert-circle" style="color: var(--uf-color-danger)"></uf-icon>
    <uf-icon name="info" style="color: var(--uf-color-accent)"></uf-icon>
  </div>
  <p class="sb-note">Icons use <code>currentColor</code>: set <code>color</code> on the icon or its parent.</p>`,
};

export const StrokeWidth: Story = {
  name: 'Stroke width',
  render: () => html`<div class="sb-row" style="font-size: 2.5rem">
    ${['1', '1.5', '2', '3'].map((width) => html`<uf-icon name="search" style="--uf-icon-stroke-width: ${width}" label=${`Stroke ${width}`}></uf-icon>`)}
  </div>`,
};

export const Accessibility: Story = {
  render: () => html`<div class="sb-stack">
    <span><uf-icon name="check"></uf-icon> Decorative (no <code>label</code>): hidden from screen readers, the text says it all.</span>
    <span><uf-icon name="alert-triangle" label="Warning"></uf-icon> Meaningful: <code>label="Warning"</code> is read out.</span>
  </div>`,
};

export const CustomIcons: Story = {
  name: 'Custom icons (registerIcons)',
  render: () => html`<div class="sb-row" style="font-size: 2rem">
    <uf-icon name="heart" style="color: #c2185b"></uf-icon>
    <uf-icon name="star" style="color: #f59e0b"></uf-icon>
  </div>
  <p class="sb-note">
    Registered with <code>registerIcons({ heart: '&lt;svg …&gt;', star: '&lt;svg …&gt;' })</code>, then used as
    <code>&lt;uf-icon name="heart"&gt;</code>. The markup is trusted: register icons from your own code only.
  </p>`,
};

export const Customized: Story = {
  args: { name: 'alert-triangle', '--uf-icon-size': '4rem', '--uf-icon-stroke-width': '1.25' },
};
