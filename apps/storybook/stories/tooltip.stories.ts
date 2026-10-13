import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Tooltip',
  component: 'uf-tooltip',
  args: { content: 'Save your changes', placement: 'top', delay: 300 },
  render: (a) => html`<div style="padding: 4rem; display: grid; place-items: center">
    <uf-tooltip ${spread(a)}>
      <uf-button>Hover or focus me</uf-button>
    </uf-tooltip>
  </div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Placements: Story = {
  // Always open: on the docs page, render in a frame so the floating parts stay inside it.
  parameters: { docs: { story: { inline: false, height: '20rem' } } },
  render: () => html`<div class="sb-row" style="padding: 4rem; justify-content: center">
    ${['top', 'right', 'bottom', 'left', 'top-start', 'bottom-end'].map(
      (placement) => html`<uf-tooltip content=${`placement="${placement}"`} placement=${placement} open>
        <uf-button variant="outline" style="margin: 2.5rem 4rem">${placement}</uf-button>
      </uf-tooltip>`,
    )}
  </div>`,
};

export const OnIconButtons: Story = {
  name: 'On icon-only buttons',
  render: () => html`<div class="sb-row" style="padding-top: 3rem">
    <uf-tooltip content="Search"><uf-button variant="ghost" label="Search"><uf-icon slot="prefix" name="search"></uf-icon></uf-button></uf-tooltip>
    <uf-tooltip content="New item"><uf-button variant="ghost" label="New item"><uf-icon slot="prefix" name="plus"></uf-icon></uf-button></uf-tooltip>
    <uf-tooltip content="Close"><uf-button variant="ghost" label="Close"><uf-icon slot="prefix" name="x"></uf-icon></uf-button></uf-tooltip>
  </div>`,
};

export const Delay: Story = {
  render: () => html`<div class="sb-row" style="padding-top: 3rem">
    <uf-tooltip content="Instant" delay="0"><uf-button variant="outline">delay=0</uf-button></uf-tooltip>
    <uf-tooltip content="After 300 ms"><uf-button variant="outline">delay=300 (default)</uf-button></uf-tooltip>
    <uf-tooltip content="After a second" delay="1000"><uf-button variant="outline">delay=1000</uf-button></uf-tooltip>
  </div>`,
};

export const Disabled: Story = {
  render: () => html`<div class="sb-row" style="padding-top: 3rem">
    <uf-tooltip content="You won't see this" disabled><uf-button variant="outline">disabled tooltip</uf-button></uf-tooltip>
  </div>`,
};

export const LongContent: Story = {
  name: 'Long content (wraps)',
  // Always open: on the docs page, render in a frame so the floating parts stay inside it.
  parameters: { docs: { story: { inline: false, height: '14rem' } } },
  render: () => html`<div style="padding: 6rem 0 0; display: grid; place-items: center">
    <uf-tooltip open content="Long tooltips wrap at --uf-tooltip-max-width. Keep them short: they can't hold links or buttons.">
      <uf-button variant="outline">Long text</uf-button>
    </uf-tooltip>
  </div>`,
};

export const Customized: Story = {
  // Always open: on the docs page, render in a frame so the floating parts stay inside it.
  parameters: { docs: { story: { inline: false, height: '14rem' } } },
  args: { content: 'Custom colors', open: true, '--uf-tooltip-bg': '#0f766e', '--uf-tooltip-color': '#ffffff', '--uf-tooltip-max-width': '10rem' },
};
