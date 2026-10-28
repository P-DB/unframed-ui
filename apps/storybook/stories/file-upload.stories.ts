import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { setTranslations } from '@unframed/core';
import it from '@unframed/core/locales/it';
import { spread } from '../.storybook/args';

// For the Translated story; it only applies where lang="it".
setTranslations(it, 'it');

type Upload = HTMLElement & { files: File[] };
const names = (el: Upload) => (el.files.length ? el.files.map((f) => f.name).join(', ') : '(none)');

const meta: Meta = {
  title: 'Components/File upload',
  component: 'uf-file-upload',
  args: { label: 'Attachments', hint: 'PDF or images, up to 5 MB each', name: 'attachments', multiple: true, accept: '.pdf, image/*', 'max-size': 5000000, size: 'md', required: false, disabled: false },
  render: (a) => html`<div class="sb-stack"><uf-file-upload ${spread(a)}></uf-file-upload></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    <uf-file-upload label="Small" size="sm"></uf-file-upload>
    <uf-file-upload label="Medium" size="md"></uf-file-upload>
    <uf-file-upload label="Large" size="lg"></uf-file-upload>
  </div>`,
};

export const SingleFile: Story = {
  name: 'One file',
  args: { label: 'Profile photo', hint: 'A new pick replaces the file.', multiple: false, accept: 'image/*', 'max-size': 2000000 },
};

export const Limits: Story = {
  name: 'accept and max-size',
  args: { label: 'Images only, up to 100 kB', hint: 'Try a PDF or a large photo: it is refused, with a message.', accept: 'image/*', 'max-size': 100000 },
};

export const States: Story = {
  render: () => html`<div class="sb-stack">
    <uf-file-upload label="Required" required></uf-file-upload>
    <uf-file-upload label="Disabled" disabled></uf-file-upload>
  </div>`,
};

export const Events: Story = {
  name: 'input and change events',
  render: () => html`<div class="sb-stack">
    <uf-file-upload
      label="Documents"
      multiple
      @change=${(e: Event) => {
        (e.currentTarget as Element).nextElementSibling!.textContent = `change: ${names(e.currentTarget as Upload)}`;
      }}
    ></uf-file-upload>
    <output class="sb-note">change: –</output>
  </div>`,
};

export const InAForm: Story = {
  name: 'In a form',
  render: () => html`<form
    class="sb-stack"
    @submit=${(e: SubmitEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const files = new FormData(form).getAll('cv') as File[];
      form.querySelector('output')!.textContent = `Submitted: ${files.map((f) => `${f.name} (${f.size} bytes)`).join(', ')}`;
    }}
  >
    <uf-file-upload name="cv" label="Your CV" accept=".pdf" required></uf-file-upload>
    <div class="sb-row"><uf-button type="submit">Apply</uf-button><uf-button type="reset" variant="ghost">Reset</uf-button></div>
    <output class="sb-note"></output>
  </form>`,
};

export const Translated: Story = {
  name: 'Translated texts',
  render: () => html`<div class="sb-stack" lang="it">
    <uf-file-upload label="Allegati" multiple accept="image/*" max-size="100000"></uf-file-upload>
    <p class="sb-note" style="margin: 0"><code>setTranslations(it, 'it')</code>, with the built-in Italian. Try a large file to see the message.</p>
  </div>`,
};

export const Customized: Story = {
  args: {
    label: 'Custom properties',
    '--uf-file-upload-border-color': '#0f766e',
    '--uf-file-upload-bg': '#f0fdfa',
    '--uf-file-upload-active-color': '#0f766e',
  },
};
