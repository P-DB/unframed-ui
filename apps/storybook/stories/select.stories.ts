import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const options = html`
  <option value="it">Italy</option>
  <option value="fr">France</option>
  <option value="de">Germany</option>
  <option value="ch" disabled>Switzerland (unavailable)</option>
  <optgroup label="Elsewhere">
    <option value="jp">Japan</option>
    <option value="us">United States</option>
  </optgroup>
`;

const meta: Meta = {
  title: 'Components/Select',
  component: 'uf-select',
  args: { label: 'Country', placeholder: 'Choose a country', hint: 'Where we ship your order.', size: 'md' },
  argTypes: {
    // The options are <option> children; offer their values.
    value: { control: 'select', options: ['', 'it', 'fr', 'de', 'jp', 'us'] },
  },
  render: (a) => html`<div class="sb-stack"><uf-select ${spread(a)}>${options}</uf-select></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Preselected: Story = {
  args: { value: 'jp' },
};

export const WithoutPlaceholder: Story = {
  name: 'Without placeholder',
  args: { placeholder: undefined, hint: 'Without a placeholder, the first option is selected.' },
};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    <uf-select size="sm" label="Small" placeholder="Choose">${options}</uf-select>
    <uf-select size="md" label="Medium" placeholder="Choose">${options}</uf-select>
    <uf-select size="lg" label="Large" placeholder="Choose">${options}</uf-select>
  </div>`,
};

export const WithPrefix: Story = {
  name: 'With prefix',
  render: () => html`<div class="sb-stack">
    <uf-select label="Language" value="en">
      <uf-icon slot="prefix" name="info"></uf-icon>
      <option value="en">English</option>
      <option value="it">Italiano</option>
      <option value="fr">Français</option>
    </uf-select>
  </div>`,
};

export const States: Story = {
  render: () => html`<div class="sb-stack">
    <uf-select label="Disabled" value="fr" disabled>${options}</uf-select>
    <uf-select label="Required" placeholder="Choose a country" required>${options}</uf-select>
  </div>`,
};

export const LabelAndHintSlots: Story = {
  name: 'Label and hint slots',
  render: () => html`<div class="sb-stack">
    <uf-select placeholder="Choose a country">
      <span slot="label">Country <em style="font-weight: 400">(billing)</em></span>
      <span slot="hint">Must match your card. <a href="https://example.com" target="_blank">Why?</a></span>
      ${options}
    </uf-select>
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
    <uf-select name="country" label="Country" placeholder="Choose a country" required>${options}</uf-select>
    <div><uf-button type="submit">Continue</uf-button></div>
    <output class="sb-note"></output>
  </form>`,
};

export const Customized: Story = {
  args: { label: 'Custom properties', '--uf-field-radius': '999px', '--uf-field-bg': 'rgb(105 48 195 / 0.12)', '--uf-field-border-color': '#6930c3' },
};
