import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Radio group',
  component: 'uf-radio-group',
  args: { label: 'Plan', value: 'pro', orientation: 'vertical', required: false, disabled: false },
  argTypes: { orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] } },
  render: (a) => html`<uf-radio-group label=${a.label} value=${a.value} orientation=${a.orientation} ?required=${a.required} ?disabled=${a.disabled}>
    <uf-radio value="free">Free</uf-radio>
    <uf-radio value="pro">Pro</uf-radio>
    <uf-radio value="team">Team</uf-radio>
    <uf-radio value="enterprise" disabled>Enterprise</uf-radio>
  </uf-radio-group>`,
};
export default meta;

export const Default: StoryObj = {};
export const Horizontal: StoryObj = { args: { orientation: 'horizontal' } };
