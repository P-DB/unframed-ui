import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Textarea',
  component: 'uf-textarea',
  args: { label: 'Bio', hint: 'Up to 280 characters.', rows: 4, resize: 'vertical', required: false, disabled: false },
  argTypes: { resize: { control: 'inline-radio', options: ['none', 'vertical', 'auto'] } },
  render: (a) => html`<div class="sb-stack">
    <uf-textarea label=${a.label} hint=${a.hint} rows=${a.rows} resize=${a.resize} maxlength="280" ?required=${a.required} ?disabled=${a.disabled}></uf-textarea>
  </div>`,
};
export default meta;

export const Default: StoryObj = {};
export const GrowsWithContent: StoryObj = { args: { resize: 'auto', rows: 2, hint: 'resize="auto" grows as you type' } };
