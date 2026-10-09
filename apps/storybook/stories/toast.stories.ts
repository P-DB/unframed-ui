import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { toast, type ToastVariant } from '@unframed/core';

const messages: Record<ToastVariant, string> = {
  neutral: 'Draft saved.',
  info: 'A new version is available.',
  success: 'Changes published.',
  warning: 'Your trial ends in 3 days.',
  danger: 'Payment failed. Check your card.',
};

const meta: Meta = {
  title: 'Components/Toast',
  component: 'uf-toaster',
  render: () => html`<div class="sb-row">
    ${(Object.keys(messages) as ToastVariant[]).map(
      (variant) => html`<uf-button variant="outline" @click=${() => toast(messages[variant], { variant })}>${variant}</uf-button>`,
    )}
    <uf-button variant="secondary" @click=${() => toast('Your changes were saved.', { title: 'Saved', variant: 'success' })}>With title</uf-button>
  </div>`,
};
export default meta;

export const Variants: StoryObj = {};
