import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const options = html`
  <option value="it">Italy</option>
  <option value="fr">France</option>
  <option value="de">Germany</option>
  <optgroup label="Elsewhere">
    <option value="jp">Japan</option>
    <option value="us">United States</option>
  </optgroup>
`;

const meta: Meta = {
  title: 'Components/Select',
  component: 'uf-select',
  args: { label: 'Country', placeholder: 'Choose a country', required: false, disabled: false },
  render: (a) => html`<div class="sb-stack">
    <uf-select label=${a.label} placeholder=${a.placeholder} ?required=${a.required} ?disabled=${a.disabled}>${options}</uf-select>
  </div>`,
};
export default meta;

export const Default: StoryObj = {};
export const Preselected: StoryObj = {
  render: () => html`<div class="sb-stack"><uf-select label="Country" value="jp">${options}</uf-select></div>`,
};
