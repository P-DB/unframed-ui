import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const zones = html`
  <optgroup label="Europe">
    <option value="Europe/Rome">Rome</option>
    <option value="Europe/Paris">Paris</option>
    <option value="Europe/Berlin">Berlin</option>
    <option value="Europe/London">London</option>
  </optgroup>
  <optgroup label="Americas">
    <option value="America/New_York">New York</option>
    <option value="America/Los_Angeles">Los Angeles</option>
    <option value="America/Sao_Paulo">São Paulo</option>
  </optgroup>
  <optgroup label="Asia">
    <option value="Asia/Tokyo">Tokyo</option>
    <option value="Asia/Singapore" disabled>Singapore</option>
  </optgroup>
`;

const meta: Meta = {
  title: 'Components/Combobox',
  component: 'uf-combobox',
  args: { label: 'Time zone', placeholder: 'Search time zones', hint: 'Type to filter', required: false, disabled: false },
  render: (a) => html`<div class="sb-stack">
    <uf-combobox label=${a.label} placeholder=${a.placeholder} hint=${a.hint} ?required=${a.required} ?disabled=${a.disabled}>${zones}</uf-combobox>
  </div>`,
};
export default meta;

export const Default: StoryObj = {};
export const Preselected: StoryObj = {
  render: () => html`<div class="sb-stack"><uf-combobox label="Time zone" value="Asia/Tokyo">${zones}</uf-combobox></div>`,
};
