import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Popover',
  component: 'uf-popover',
  args: { placement: 'bottom-start' },
  argTypes: { placement: { control: 'select', options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'right'] } },
  render: (a) => html`<div style="padding: 6rem 0; display: grid; place-items: center">
    <uf-popover placement=${a.placement}>
      <uf-button slot="trigger" variant="outline">Filters<uf-icon slot="suffix" name="chevron-down"></uf-icon></uf-button>
      <div class="sb-stack" style="width: 14rem; gap: 0.5rem">
        <uf-checkbox checked>Open issues</uf-checkbox>
        <uf-checkbox>Closed issues</uf-checkbox>
        <uf-switch>Only mine</uf-switch>
      </div>
    </uf-popover>
  </div>`,
};
export default meta;

export const Default: StoryObj = {};
