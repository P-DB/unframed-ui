import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Checkbox',
  component: 'uf-checkbox',
  args: { label: 'Subscribe to the newsletter', hint: 'One email a month.', checked: false, indeterminate: false, required: false, disabled: false },
  render: (a) => html`<uf-checkbox
    hint=${a.hint}
    ?checked=${a.checked}
    ?indeterminate=${a.indeterminate}
    ?required=${a.required}
    ?disabled=${a.disabled}
    >${a.label}</uf-checkbox
  >`,
};
export default meta;

export const Default: StoryObj = {};
export const States: StoryObj = {
  render: () => html`<div class="sb-stack">
    <uf-checkbox>Unchecked</uf-checkbox>
    <uf-checkbox checked>Checked</uf-checkbox>
    <uf-checkbox indeterminate>Indeterminate</uf-checkbox>
    <uf-checkbox disabled>Disabled</uf-checkbox>
  </div>`,
};
