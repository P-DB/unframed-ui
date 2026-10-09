import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const names = ['check', 'minus', 'x', 'plus', 'search', 'info', 'check-circle', 'alert-triangle', 'alert-circle', 'chevron-down', 'chevron-up', 'chevron-left', 'chevron-right'];

const meta: Meta = {
  title: 'Components/Icon',
  component: 'uf-icon',
  args: { name: 'check', label: '' },
  argTypes: { name: { control: 'select', options: names } },
  render: (a) => html`<uf-icon name=${a.name} label=${a.label || ''} style="--uf-icon-size: 2rem"></uf-icon>`,
};
export default meta;

export const Default: StoryObj = {};
export const BuiltInSet: StoryObj = {
  render: () => html`<div class="sb-row" style="gap: 1.5rem">
    ${names.map(
      (name) => html`<div style="display: grid; justify-items: center; gap: 0.5rem; width: 6rem; font-size: 12px">
        <uf-icon name=${name} style="--uf-icon-size: 1.5rem"></uf-icon>${name}
      </div>`,
    )}
  </div>`,
};
