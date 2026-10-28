import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { toast, type ToastHandle, type ToastOptions, type ToastVariant } from '@unframed/core';
import { spread, storyArg } from '../.storybook/args';

type Toaster = HTMLElement & { add(message: string, options?: ToastOptions): ToastHandle };

/** The toaster rendered by the story the clicked button is in. */
const toasterOf = (e: Event) => (e.currentTarget as Element).closest('.sb-toast')!.querySelector<Toaster>('uf-toaster')!;

const messages: Record<ToastVariant, string> = {
  neutral: 'Draft saved.',
  accent: 'You were invited to Acme.',
  info: 'A new version is available.',
  success: 'Changes published.',
  warning: 'Your trial ends in 3 days.',
  danger: 'Payment failed. Check your card.',
};

const meta: Meta = {
  title: 'Components/Toast',
  component: 'uf-toaster',
  args: {
    message: 'Your changes were saved.',
    // Every ToastOptions field, as an example to edit in the Controls panel.
    options: { title: 'Saved', variant: 'success', duration: 5000, closable: true } satisfies ToastOptions,
    placement: 'bottom-end',
  },
  argTypes: {
    message: storyArg('the first argument of `toast(message, options)`.'),
    options: storyArg(
      'the second argument of `toast(message, options)`: `title` (string), `variant` (`neutral`, `accent`, `info`, `success`, `warning`, `danger`), `duration` (ms, `0` keeps it open) and `closable` (boolean).',
      { type: 'object' },
    ),
  },
  render: (a) => html`<div class="sb-toast">
    <uf-button @click=${(e: Event) => toasterOf(e).add(a.message, a.options)}>Show toast</uf-button>
    <uf-toaster ${spread(a)}></uf-toaster>
    <p class="sb-note">Edit <code>message</code> and <code>options</code> in the Controls panel, then show the toast.</p>
  </div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Variants: Story = {
  render: () => html`<div class="sb-toast sb-row">
    ${(Object.keys(messages) as ToastVariant[]).map(
      (variant) => html`<uf-button variant="outline" @click=${(e: Event) => toasterOf(e).add(messages[variant], { variant })}>${variant}</uf-button>`,
    )}
    <uf-toaster></uf-toaster>
  </div>`,
};

export const WithTitle: Story = {
  name: 'With title',
  args: { message: 'Your invoice is ready to download.', options: { title: 'Invoice #1042', variant: 'info' } },
};

export const Persistent: Story = {
  name: 'Persistent (duration 0)',
  args: { message: 'Stays until you dismiss it.', options: { title: 'Connection lost', variant: 'warning', duration: 0 } },
};

export const NotClosable: Story = {
  name: 'Without dismiss button',
  args: { message: 'Hides by itself after 3 seconds.', options: { variant: 'neutral', duration: 3000, closable: false } },
};

export const DismissFromCode: Story = {
  name: 'Dismissing from code',
  render: () => {
    let handle: ToastHandle | undefined;
    return html`<div class="sb-toast sb-row">
      <uf-button @click=${(e: Event) => (handle = toasterOf(e).add('Uploading 3 files…', { duration: 0, closable: false }))}>Start upload</uf-button>
      <uf-button
        variant="secondary"
        @click=${(e: Event) => {
          handle?.dismiss();
          toasterOf(e).add('Upload complete.', { variant: 'success' });
        }}
      >
        Finish upload
      </uf-button>
      <uf-toaster></uf-toaster>
      <p class="sb-note">Both <code>toast()</code> and <code>add()</code> return a handle with <code>dismiss()</code>.</p>
    </div>`;
  },
};

export const Placements: Story = {
  render: () => html`<div class="sb-toast sb-grid">
    ${['top-start', 'top-center', 'top-end', 'bottom-start', 'bottom-center', 'bottom-end'].map(
      (placement) => html`<div>
        <uf-button variant="outline" @click=${(e: Event) => ((e.currentTarget as Element).nextElementSibling as Toaster).add(`placement="${placement}"`)}>
          ${placement}
        </uf-button>
        <uf-toaster placement=${placement}></uf-toaster>
      </div>`,
    )}
  </div>`,
};

export const ToastFunction: Story = {
  name: 'The toast() function',
  render: () => html`<div class="sb-row">
    <uf-button @click=${() => toast('Shown by toast()', { variant: 'info' })}>toast('…')</uf-button>
    <p class="sb-note" style="margin: 0">
      <code>toast()</code> uses the first <code>&lt;uf-toaster&gt;</code> on the page, and creates one if there is none.
    </p>
  </div>`,
};

export const Customized: Story = {
  args: { message: 'Wider, further from the edges.', options: { variant: 'info' }, '--uf-toast-width': '28rem', '--uf-toaster-offset': '3rem' },
};
