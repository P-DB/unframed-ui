import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const types = ['text', 'email', 'password', 'search', 'tel', 'url', 'number', 'date', 'time'];

const meta: Meta = {
  title: 'Components/Input',
  component: 'uf-input',
  args: { label: 'Email', hint: 'We never share it.', placeholder: 'you@example.com', type: 'email', size: 'md' },
  render: (a) => html`<div class="sb-stack"><uf-input ${spread(a)}></uf-input></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Types: Story = {
  render: () => html`<div class="sb-grid">
    ${types.map((type) => html`<uf-input type=${type} label=${type}></uf-input>`)}
  </div>`,
};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    <uf-input size="sm" label="Small" placeholder="size=&quot;sm&quot;"></uf-input>
    <uf-input size="md" label="Medium" placeholder="size=&quot;md&quot;"></uf-input>
    <uf-input size="lg" label="Large" placeholder="size=&quot;lg&quot;"></uf-input>
  </div>`,
};

export const PrefixAndSuffix: Story = {
  name: 'Prefix and suffix',
  render: () => html`<div class="sb-stack">
    <uf-input label="Search" placeholder="Search docs" type="search"><uf-icon slot="prefix" name="search"></uf-icon></uf-input>
    <uf-input label="Weight" type="number" value="72"><span slot="suffix">kg</span></uf-input>
    <uf-input label="Website" type="url" placeholder="example.com"><span slot="prefix">https://</span></uf-input>
  </div>`,
};

export const LabelAndHintSlots: Story = {
  name: 'Label and hint slots',
  render: () => html`<div class="sb-stack">
    <uf-input>
      <span slot="label">Username <em style="font-weight: 400">(public)</em></span>
      <span slot="hint">Letters and numbers only. <a href="https://example.com" target="_blank">Naming rules</a></span>
    </uf-input>
  </div>`,
};

export const States: Story = {
  render: () => html`<div class="sb-stack">
    <uf-input label="Disabled" value="Can't touch this" disabled></uf-input>
    <uf-input label="Read-only" value="Selectable, not editable" readonly></uf-input>
    <uf-input label="Required" required hint="Marked with an asterisk"></uf-input>
  </div>`,
};

export const Constraints: Story = {
  render: () => html`<div class="sb-stack">
    <uf-input label="Quantity" type="number" min="1" max="10" step="1" value="1" hint="min=1, max=10, step=1"></uf-input>
    <uf-input label="Price" type="number" min="0" step="0.01" inputmode="decimal" hint="step=0.01, inputmode=decimal"></uf-input>
    <uf-input label="Nickname" minlength="3" maxlength="12" hint="3 to 12 characters"></uf-input>
    <uf-input label="Postcode" pattern="[0-9]{5}" inputmode="numeric" autocomplete="postal-code" hint="Five digits (pattern)"></uf-input>
  </div>`,
};

export const Validation: Story = {
  name: 'Validation (submit the form)',
  render: () => html`<form
    class="sb-stack"
    novalidate
    @submit=${(e: SubmitEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const username = form.querySelector<HTMLElement & { value: string; setCustomValidity(m: string): void }>('[name=username]')!;
      // A custom rule on top of the built-in ones.
      username.setCustomValidity(username.value === 'admin' ? 'That username is taken.' : '');
      if (!form.reportValidity()) return;
      form.querySelector('output')!.textContent = `Submitted: ${new URLSearchParams(new FormData(form) as never)}`;
    }}
  >
    <uf-input name="email" type="email" label="Email" required></uf-input>
    <uf-input name="code" label="Invite code" pattern="[A-Z]{4}" hint="Four capital letters"></uf-input>
    <uf-input name="username" label="Username" hint="Try &quot;admin&quot; for a custom error (setCustomValidity)"></uf-input>
    <div><uf-button type="submit">Submit</uf-button></div>
    <output class="sb-note"></output>
  </form>`,
};

export const Customized: Story = {
  args: { label: 'Custom properties', placeholder: 'Rounded and tinted', '--uf-field-radius': '999px', '--uf-field-bg': 'rgb(105 48 195 / 0.12)', '--uf-field-border-color': '#6930c3' },
};
