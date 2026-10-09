import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Tooltip',
  component: 'uf-tooltip',
  args: { content: 'Save your changes', placement: 'top', delay: 300 },
  argTypes: { placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] } },
  render: (a) => html`<div style="padding: 4rem; display: grid; place-items: center">
    <uf-tooltip content=${a.content} placement=${a.placement} delay=${a.delay}>
      <uf-button>Hover or focus me</uf-button>
    </uf-tooltip>
  </div>`,
};
export default meta;

export const Default: StoryObj = {};
