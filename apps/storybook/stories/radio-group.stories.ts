import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { controlsOf, spread, storyArg } from '../.storybook/args';

const plans = html`
  <uf-radio value="free">Free</uf-radio>
  <uf-radio value="pro">Pro</uf-radio>
  <uf-radio value="team">Team</uf-radio>
  <uf-radio value="enterprise" disabled>Enterprise (contact us)</uf-radio>
`;

const meta: Meta = {
  title: 'Components/Radio group',
  component: 'uf-radio-group',
  subcomponents: { Radio: 'uf-radio' },
  args: { label: 'Plan', hint: 'You can change it later.', value: 'pro', name: 'plan', orientation: 'vertical' },
  argTypes: {
    // The options are <uf-radio> children; offer their values.
    value: { control: 'inline-radio', options: ['', 'free', 'pro', 'team'] },
  },
  render: (a) => html`<uf-radio-group ${spread(a)}>${plans}</uf-radio-group>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

export const NothingSelected: Story = {
  name: 'Nothing selected',
  args: { value: '' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const LabelAndHintSlots: Story = {
  name: 'Label and hint slots',
  render: () => html`<uf-radio-group value="monthly">
    <span slot="label">Billing <em style="font-weight: 400">(cancel anytime)</em></span>
    <span slot="hint">Yearly saves 20%. <a href="https://example.com" target="_blank">Compare</a></span>
    <uf-radio value="monthly">Monthly</uf-radio>
    <uf-radio value="yearly">Yearly</uf-radio>
  </uf-radio-group>`,
};

const radio = controlsOf('uf-radio', 'text');

export const Radio: Story = {
  name: 'Radio (single option)',
  ...radio,
  args: { text: 'Express shipping', value: 'express', disabled: false },
  argTypes: { ...radio.argTypes, text: storyArg('the label (default slot).') },
  render: (a) => html`<uf-radio-group label="Shipping" value="standard">
    <uf-radio value="standard">Standard</uf-radio>
    <uf-radio ${spread(a)}>${a.text}</uf-radio>
  </uf-radio-group>`,
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
    <uf-radio-group name="plan" label="Plan" required>${plans}</uf-radio-group>
    <div><uf-button type="submit">Continue</uf-button></div>
    <output class="sb-note"></output>
  </form>`,
};

export const Customized: Story = {
  render: () => html`<uf-radio-group label="Custom properties on uf-radio" value="b" style="--uf-radio-size: 1.5rem; --uf-radio-checked-color: #0f766e">
    <uf-radio value="a">Larger</uf-radio>
    <uf-radio value="b">Teal when checked</uf-radio>
  </uf-radio-group>`,
};
