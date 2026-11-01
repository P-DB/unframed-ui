import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const toppings = html`<option value="cheese" selected>Cheese</option>
  <option value="olives">Olives</option>
  <option value="basil">Basil</option>
  <option value="mushrooms">Mushrooms</option>
  <option value="ham" disabled>Ham (sold out)</option>`;

const meta: Meta = {
  title: 'Components/Multi-select',
  component: 'uf-multi-select',
  args: { label: 'Toppings', hint: 'Pick as many as you like.', placeholder: 'Pick toppings', name: 'toppings', size: 'md', required: false, disabled: false },
  render: (a) => html`<div class="sb-stack"><uf-multi-select ${spread(a)}>${toppings}</uf-multi-select></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Groups: Story = {
  name: 'Option groups',
  render: () => html`<div class="sb-stack">
    <uf-multi-select label="Languages">
      <optgroup label="Europe"><option>English</option><option>Italian</option><option>French</option></optgroup>
      <optgroup label="Asia"><option>Japanese</option><option>Korean</option></optgroup>
    </uf-multi-select>
  </div>`,
};

export const InAForm: Story = {
  name: 'In a form',
  render: () => html`<form
    class="sb-stack"
    @submit=${(e: SubmitEvent) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      form.querySelector('output')!.textContent = `Submitted: ${JSON.stringify(new FormData(form).getAll('toppings'))}`;
    }}
  >
    <uf-multi-select name="toppings" label="Toppings" required>${toppings}</uf-multi-select>
    <div><uf-button type="submit">Order</uf-button></div>
    <output></output>
  </form>`,
};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    ${['sm', 'md', 'lg'].map((size) => html`<uf-multi-select size=${size} label="Size ${size}">${toppings}</uf-multi-select>`)}
  </div>`,
};
