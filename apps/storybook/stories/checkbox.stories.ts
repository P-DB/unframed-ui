import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { controlsOf, spread, storyArg } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Checkbox',
  component: 'uf-checkbox',
  subcomponents: { CheckboxGroup: 'uf-checkbox-group' },
  args: { text: 'Subscribe to the newsletter', hint: 'One email a month.', name: 'newsletter' },
  argTypes: { text: storyArg('the label (default slot).') },
  render: (a) => html`<uf-checkbox ${spread(a)}>${a.text}</uf-checkbox>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const States: Story = {
  render: () => html`<div class="sb-grid">
    <uf-checkbox>Unchecked</uf-checkbox>
    <uf-checkbox checked>Checked</uf-checkbox>
    <uf-checkbox indeterminate>Indeterminate</uf-checkbox>
    <uf-checkbox required>Required</uf-checkbox>
    <uf-checkbox disabled>Disabled</uf-checkbox>
    <uf-checkbox disabled checked>Disabled, checked</uf-checkbox>
    <uf-checkbox disabled indeterminate>Disabled, indeterminate</uf-checkbox>
  </div>`,
};

export const WithHint: Story = {
  name: 'With hint',
  render: () => html`<div class="sb-stack">
    <uf-checkbox hint="We'll email you once a month.">Newsletter (hint attribute)</uf-checkbox>
    <uf-checkbox>
      I accept the terms
      <span slot="hint">Read the <a href="https://example.com" target="_blank">terms of service</a> first.</span>
    </uf-checkbox>
  </div>`,
};

const group = controlsOf('uf-checkbox-group');

export const Group: Story = {
  name: 'Checkbox group',
  ...group,
  args: { label: 'Notifications', hint: 'Choose how we reach you.', orientation: 'vertical', '.value': ['email'] },
  argTypes: {
    ...group.argTypes,
    // A string[] property: pick the checked values instead of typing JSON.
    '.value': { ...group.argTypes['.value'], control: 'check', options: ['email', 'sms', 'push'] },
  },
  render: (a) => html`<uf-checkbox-group ${spread(a)}>
    <uf-checkbox name="notify" value="email">Email</uf-checkbox>
    <uf-checkbox name="notify" value="sms">SMS</uf-checkbox>
    <uf-checkbox name="notify" value="push">Push</uf-checkbox>
  </uf-checkbox-group>`,
};

export const SelectAll: Story = {
  name: 'Select all',
  render: () => html`<div class="sb-grid">
    <uf-checkbox-group label="Toppings" hint="&quot;All toppings&quot; checks or unchecks the rest.">
      <uf-checkbox select-all>All toppings</uf-checkbox>
      <uf-checkbox name="topping" value="cheese">Cheese</uf-checkbox>
      <uf-checkbox name="topping" value="olives" checked>Olives</uf-checkbox>
      <uf-checkbox name="topping" value="basil">Basil</uf-checkbox>
    </uf-checkbox-group>
    <uf-checkbox-group label="With a disabled option" hint="Disabled checkboxes keep their state.">
      <uf-checkbox select-all>All</uf-checkbox>
      <uf-checkbox name="extra" value="a" checked>Included (can't change)</uf-checkbox>
      <uf-checkbox name="extra" value="b">Optional</uf-checkbox>
      <uf-checkbox name="extra" value="c" disabled checked>Locked</uf-checkbox>
    </uf-checkbox-group>
  </div>`,
};

export const Horizontal: Story = {
  render: () => html`<uf-checkbox-group label="Days" orientation="horizontal">
    ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => html`<uf-checkbox name="day" value=${day.toLowerCase()}>${day}</uf-checkbox>`)}
  </uf-checkbox-group>`,
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
    <uf-checkbox name="terms" required>I accept the terms</uf-checkbox>
    <uf-checkbox name="updates" value="yes">Send me product updates</uf-checkbox>
    <div><uf-button type="submit">Sign up</uf-button></div>
    <output class="sb-note"></output>
  </form>`,
};

export const Customized: Story = {
  args: { text: 'Custom properties', hint: '', checked: true, '--uf-checkbox-size': '1.5rem', '--uf-checkbox-radius': '999px', '--uf-checkbox-checked-bg': '#0f766e' },
};
