import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

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

const fruits = ['Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Coconut', 'Fig', 'Grape', 'Kiwi', 'Lemon', 'Lime', 'Mango', 'Melon', 'Orange', 'Papaya', 'Peach', 'Pear', 'Pineapple', 'Plum', 'Raspberry', 'Strawberry', 'Watermelon'];

const meta: Meta = {
  title: 'Components/Combobox',
  component: 'uf-combobox',
  args: { label: 'Time zone', placeholder: 'Search time zones', hint: 'Type to filter', size: 'md' },
  argTypes: {
    // The options are <option> children; offer their values.
    value: { control: 'select', options: ['', 'Europe/Rome', 'Europe/Paris', 'America/New_York', 'Asia/Tokyo'] },
  },
  render: (a) => html`<div class="sb-stack"><uf-combobox ${spread(a)}>${zones}</uf-combobox></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Preselected: Story = {
  args: { value: 'Asia/Tokyo' },
};

export const WithoutGroups: Story = {
  name: 'Without groups (long list)',
  render: () => html`<div class="sb-stack">
    <uf-combobox label="Fruit" placeholder="Search fruit" hint="Scrolls after --uf-combobox-max-height">
      ${fruits.map((fruit) => html`<option value=${fruit.toLowerCase()}>${fruit}</option>`)}
    </uf-combobox>
  </div>`,
};

export const NoResults: Story = {
  name: 'No results',
  args: { hint: 'Type "xyz" to see the empty state' },
};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    <uf-combobox size="sm" label="Small" placeholder="Search">${zones}</uf-combobox>
    <uf-combobox size="md" label="Medium" placeholder="Search">${zones}</uf-combobox>
    <uf-combobox size="lg" label="Large" placeholder="Search">${zones}</uf-combobox>
  </div>`,
};

export const WithPrefix: Story = {
  name: 'With prefix',
  render: () => html`<div class="sb-stack">
    <uf-combobox label="Time zone" placeholder="Search time zones"><uf-icon slot="prefix" name="search"></uf-icon>${zones}</uf-combobox>
  </div>`,
};

export const States: Story = {
  render: () => html`<div class="sb-stack">
    <uf-combobox label="Disabled" value="Europe/Paris" disabled>${zones}</uf-combobox>
    <uf-combobox label="Required" placeholder="Search time zones" required>${zones}</uf-combobox>
  </div>`,
};

export const LabelAndHintSlots: Story = {
  name: 'Label and hint slots',
  render: () => html`<div class="sb-stack">
    <uf-combobox placeholder="Search time zones">
      <span slot="label">Time zone <em style="font-weight: 400">(for reminders)</em></span>
      <span slot="hint">We'll use it for all your devices. <a href="https://example.com" target="_blank">Learn more</a></span>
      ${zones}
    </uf-combobox>
  </div>`,
};

export const Validation: Story = {
  name: 'Validation (submit the form)',
  render: () => html`<form
    class="sb-stack"
    @submit=${(e: SubmitEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      form.querySelector('output')!.textContent = `Submitted: ${new URLSearchParams(new FormData(form) as never)}`;
    }}
  >
    <uf-combobox name="zone" label="Time zone" placeholder="Search time zones" required>${zones}</uf-combobox>
    <div><uf-button type="submit">Save</uf-button></div>
    <output class="sb-note"></output>
  </form>`,
};

export const Customized: Story = {
  args: { label: 'Custom properties', hint: 'A shorter list: --uf-combobox-max-height', '--uf-combobox-max-height': '8rem' },
};
