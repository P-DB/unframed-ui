import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const options = html`<option value="day">Day</option>
  <option value="week">Week</option>
  <option value="month">Month</option>
  <option value="year" disabled>Year</option>`;

const meta: Meta = {
  title: 'Components/Segmented control',
  component: 'uf-segmented-control',
  args: { label: 'View', hint: '', name: 'view', value: 'week', size: 'md', disabled: false },
  argTypes: {
    // The options are <option> children; offer their values.
    value: { control: 'inline-radio', options: ['day', 'week', 'month'] },
  },
  render: (a) => html`<uf-segmented-control ${spread(a)}>${options}</uf-segmented-control>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    ${['sm', 'md', 'lg'].map((size) => html`<uf-segmented-control size=${size} label="Size ${size}"><option>List</option><option>Grid</option></uf-segmented-control>`)}
  </div>`,
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Customized: Story = {
  name: 'Custom properties',
  args: { '--uf-segmented-control-selected-bg': '#0f766e', '--uf-segmented-control-radius': '999px' },
};
