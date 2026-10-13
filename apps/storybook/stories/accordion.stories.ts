import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { controlsOf, spread, storyArg } from '../.storybook/args';

const items = html`
  <uf-accordion-item summary="What is Unframed?" open>A library of web components that work in any framework, or none.</uf-accordion-item>
  <uf-accordion-item summary="Can I use it with React?">Yes, directly in React 19, or with the typed wrappers from @unframed/react.</uf-accordion-item>
  <uf-accordion-item summary="How do I change the colors?">Override the --uf-* custom properties, globally or per component.</uf-accordion-item>
  <uf-accordion-item summary="Disabled item" disabled>Hidden.</uf-accordion-item>
`;

const meta: Meta = {
  title: 'Components/Accordion',
  component: 'uf-accordion',
  subcomponents: { AccordionItem: 'uf-accordion-item' },
  args: { multiple: false },
  render: (a) => html`<uf-accordion ${spread(a)}>${items}</uf-accordion>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (a) => html`<uf-accordion ${spread(a)}>${items}</uf-accordion>
    <p class="sb-note">Opening an item closes the others.</p>`,
};

export const Multiple: Story = {
  args: { multiple: true },
  render: (a) => html`<uf-accordion ${spread(a)}>${items}</uf-accordion>
    <p class="sb-note">With <code>multiple</code>, any number of items can be open.</p>`,
};

const item = controlsOf('uf-accordion-item', 'text');

export const Item: Story = {
  name: 'Accordion item',
  ...item,
  args: { summary: 'Shipping', text: 'Orders ship within 2 business days.', open: true, disabled: false },
  argTypes: { ...item.argTypes, text: storyArg('the content (default slot).') },
  render: (a) => html`<uf-accordion>
    <uf-accordion-item ${spread(a)}>${a.text}</uf-accordion-item>
    <uf-accordion-item summary="Returns">Free returns within 30 days.</uf-accordion-item>
  </uf-accordion>`,
};

export const SummarySlot: Story = {
  name: 'Rich header (summary slot)',
  render: () => html`<uf-accordion>
    <uf-accordion-item>
      <span slot="summary" style="display: inline-flex; gap: 0.5rem; align-items: center"><uf-icon name="check-circle"></uf-icon>Payment received</span>
      Paid on 12 October with the card ending 4242.
    </uf-accordion-item>
    <uf-accordion-item>
      <span slot="summary" style="display: inline-flex; gap: 0.5rem; align-items: center"><uf-icon name="alert-triangle"></uf-icon>Action needed</span>
      Confirm your shipping address.
    </uf-accordion-item>
  </uf-accordion>`,
};

export const Standalone: Story = {
  name: 'Item without an accordion',
  render: () => html`<uf-accordion-item summary="Show details">An item works on its own, like a styled &lt;details&gt;.</uf-accordion-item>`,
};

export const Customized: Story = {
  render: () => html`<uf-accordion style="--uf-accordion-padding: 1.5rem">${items}</uf-accordion>
    <p class="sb-note"><code>--uf-accordion-padding</code> set on the accordion, inherited by its items.</p>`,
};
