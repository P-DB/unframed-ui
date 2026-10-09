import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Accordion',
  component: 'uf-accordion',
  args: { multiple: false },
  render: (a) => html`<uf-accordion ?multiple=${a.multiple}>
    <uf-accordion-item summary="What is Unframed?" open>A library of web components that work in any framework, or none.</uf-accordion-item>
    <uf-accordion-item summary="Can I use it with React?">Yes, directly in React 19, or with the typed wrappers from @unframed/react.</uf-accordion-item>
    <uf-accordion-item summary="How do I change the colors?">Override the --uf-* custom properties, globally or per component.</uf-accordion-item>
    <uf-accordion-item summary="Disabled item" disabled>Hidden.</uf-accordion-item>
  </uf-accordion>`,
};
export default meta;

export const Default: StoryObj = {};
export const Multiple: StoryObj = { args: { multiple: true } };
