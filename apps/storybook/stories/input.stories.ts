import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

interface Args {
  label: string;
  hint?: string;
  placeholder?: string;
  type: string;
  size: string;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
}

const meta: Meta<Args> = {
  title: 'Components/Input',
  component: 'uf-input',
  args: { label: 'Email', hint: 'We never share it.', placeholder: 'you@example.com', type: 'email', size: 'md', required: false, disabled: false, readonly: false },
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number', 'date', 'time'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (a) => html`<div class="sb-stack">
    <uf-input
      label=${a.label}
      hint=${ifDefined(a.hint || undefined)}
      placeholder=${ifDefined(a.placeholder || undefined)}
      type=${a.type}
      size=${a.size}
      ?required=${a.required}
      ?disabled=${a.disabled}
      ?readonly=${a.readonly}
    ></uf-input>
  </div>`,
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    <uf-input size="sm" label="Small"></uf-input>
    <uf-input size="md" label="Medium"></uf-input>
    <uf-input size="lg" label="Large"></uf-input>
  </div>`,
};

export const WithPrefix: Story = {
  render: () => html`<div class="sb-stack">
    <uf-input label="Search" placeholder="Search docs"><uf-icon slot="prefix" name="search"></uf-icon></uf-input>
  </div>`,
};

export const Validation: Story = {
  name: 'Validation (submit the form)',
  render: () => html`<form class="sb-stack" @submit=${(e: Event) => e.preventDefault()}>
    <uf-input name="email" type="email" label="Email" required></uf-input>
    <uf-input name="code" label="Invite code" pattern="[A-Z]{4}" hint="Four capital letters"></uf-input>
    <div><uf-button type="submit">Submit</uf-button></div>
  </form>`,
};
