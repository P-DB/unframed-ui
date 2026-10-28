import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Slider',
  component: 'uf-slider',
  args: { label: 'Volume', hint: 'Applies to every device', name: 'volume', value: 40, min: 0, max: 100, step: 1, 'show-value': true, size: 'md', disabled: false },
  render: (a) => html`<div class="sb-stack"><uf-slider ${spread(a)}></uf-slider></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    <uf-slider label="Small" size="sm" value="40"></uf-slider>
    <uf-slider label="Medium" size="md" value="40"></uf-slider>
    <uf-slider label="Large" size="lg" value="40"></uf-slider>
  </div>`,
};

export const RangeAndStep: Story = {
  name: 'Range and step',
  args: { label: 'Maximum price (€)', hint: 'Steps of 10', min: 0, max: 500, step: 10, value: 250 },
};

export const Decimals: Story = {
  args: { label: 'Opacity', hint: undefined, min: 0, max: 1, step: 0.05, value: 0.8 },
};

export const Disabled: Story = {
  args: { label: 'Rating', min: 1, max: 5, value: 4, disabled: true, hint: undefined },
};

export const Events: Story = {
  name: 'input and change events',
  render: () => html`<div class="sb-stack">
    <uf-slider
      label="Brightness"
      show-value
      @input=${(e: Event) => {
        (e.currentTarget as Element).nextElementSibling!.textContent = `input: ${(e.currentTarget as HTMLElement & { value: number }).value}`;
      }}
      @change=${(e: Event) => {
        (e.currentTarget as Element).nextElementSibling!.nextElementSibling!.textContent = `change: ${(e.currentTarget as HTMLElement & { value: number }).value}`;
      }}
    ></uf-slider>
    <output class="sb-note">input: –</output>
    <output class="sb-note">change: –</output>
  </div>`,
};

export const InAForm: Story = {
  name: 'In a form',
  render: () => html`<form
    class="sb-stack"
    @submit=${(e: SubmitEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      form.querySelector('output')!.textContent = `Submitted: ${new URLSearchParams(new FormData(form) as never)}`;
    }}
  >
    <uf-slider name="volume" label="Volume" value="40" show-value></uf-slider>
    <div class="sb-row"><uf-button type="submit">Save</uf-button><uf-button type="reset" variant="ghost">Reset</uf-button></div>
    <output class="sb-note"></output>
  </form>`,
};

export const Customized: Story = {
  args: { label: 'Custom properties', '--uf-slider-indicator-color': '#0f766e', '--uf-slider-track-height': '0.75rem', '--uf-slider-thumb-size': '1.5rem' },
};
