import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Number input',
  component: 'uf-number-input',
  args: { label: 'Guests', hint: 'Up to 10', name: 'guests', value: 2, min: 1, max: 10, step: 1, size: 'md', required: false, disabled: false, readonly: false },
  render: (a) => html`<div class="sb-stack"><uf-number-input ${spread(a)}></uf-number-input></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Decimals: Story = {
  name: 'Steps and a currency',
  render: () => html`<div class="sb-stack">
    <uf-number-input label="Price" value="9.5" step="0.5" min="0"><span slot="prefix">€</span></uf-number-input>
    <uf-number-input label="Weight" value="250" step="50" min="0"><span slot="suffix">g</span></uf-number-input>
  </div>`,
};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    <uf-number-input label="Small" size="sm" value="1"></uf-number-input>
    <uf-number-input label="Medium" size="md" value="1"></uf-number-input>
    <uf-number-input label="Large" size="lg" value="1"></uf-number-input>
  </div>`,
};

export const States: Story = {
  render: () => html`<div class="sb-stack">
    <uf-number-input label="Disabled" value="3" disabled></uf-number-input>
    <uf-number-input label="Read-only" value="3" readonly></uf-number-input>
    <uf-number-input label="At the minimum" value="1" min="1"></uf-number-input>
  </div>`,
};

export const InAForm: Story = {
  name: 'In a form',
  render: () => html`<form
    class="sb-stack"
    @submit=${(e: SubmitEvent) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      form.querySelector('output')!.textContent = `Submitted: ${new FormData(form).get('seats')}`;
    }}
  >
    <uf-number-input name="seats" label="Seats" min="1" max="8" required></uf-number-input>
    <div><uf-button type="submit">Book</uf-button></div>
    <output></output>
  </form>`,
};
