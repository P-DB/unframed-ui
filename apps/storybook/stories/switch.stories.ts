import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Switch',
  component: 'uf-switch',
  args: { label: 'Notifications', checked: false, disabled: false },
  render: (a) => html`<uf-switch ?checked=${a.checked} ?disabled=${a.disabled}>${a.label}</uf-switch>`,
};
export default meta;

export const Default: StoryObj = {};
export const Pill: StoryObj = {
  render: () => html`<uf-switch checked style="--uf-switch-radius: 999px">Rounded with --uf-switch-radius</uf-switch>`,
};
