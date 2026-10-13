import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

type Dialog = HTMLElement & { show(): void; hide(): void };

/** Opens the dialog right after the clicked button. */
const openNext = (e: Event) => ((e.currentTarget as Element).nextElementSibling as Dialog).show();

const meta: Meta = {
  title: 'Components/Dialog',
  component: 'uf-dialog',
  args: { label: 'Delete project?', 'light-dismiss': false, 'without-header': false },
  render: (a) => html`
    <uf-button variant="danger" @click=${openNext}>Delete project…</uf-button>
    <uf-dialog ${spread(a)}>
      <p style="margin: 0">This permanently deletes the project and its 128 issues.</p>
      <uf-button slot="footer" variant="ghost" data-dialog="close">Cancel</uf-button>
      <uf-button slot="footer" variant="danger" data-dialog="close">Delete</uf-button>
    </uf-dialog>
  `,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const LightDismiss: Story = {
  name: 'Light dismiss',
  args: { label: 'Click outside to close', 'light-dismiss': true },
};

export const WithoutHeader: Story = {
  name: 'Without header',
  render: () => html`
    <uf-button variant="secondary" @click=${openNext}>Show announcement</uf-button>
    <uf-dialog label="What's new" without-header light-dismiss>
      <div style="display: grid; gap: 0.75rem; text-align: center">
        <uf-icon name="check-circle" style="--uf-icon-size: 3rem; margin: 0 auto; color: var(--uf-color-accent)"></uf-icon>
        <strong>Version 2 is here</strong>
        <span>No header and no close button: <code>label</code> still names the dialog for screen readers.</span>
      </div>
      <uf-button slot="footer" data-dialog="close">Got it</uf-button>
    </uf-dialog>
  `,
};

export const HeaderSlots: Story = {
  name: 'Label and header-actions slots',
  render: () => html`
    <uf-button variant="secondary" @click=${openNext}>Open file details</uf-button>
    <uf-dialog>
      <span slot="label" style="display: inline-flex; gap: 0.5rem; align-items: center"><uf-icon name="info"></uf-icon>report-2026.pdf</span>
      <uf-button slot="header-actions" variant="ghost" size="sm" label="Search in file"><uf-icon slot="prefix" name="search"></uf-icon></uf-button>
      <p style="margin: 0">2.4 MB · Updated yesterday by Ada.</p>
    </uf-dialog>
  `,
};

export const PreventClose: Story = {
  name: 'Preventing close (uf-request-close)',
  render: () => html`
    <uf-button variant="secondary" @click=${openNext}>Edit profile</uf-button>
    <uf-dialog
      label="Edit profile"
      light-dismiss
      @uf-request-close=${(e: CustomEvent<{ source: string }>) => {
        const dialog = e.currentTarget as Dialog;
        const dirty = dialog.querySelector<HTMLElement & { value: string }>('uf-input')!.value !== 'Ada';
        // The footer's Save button closes it in any case.
        if (dirty && e.detail.source !== 'trigger') {
          e.preventDefault();
          dialog.querySelector('output')!.textContent = `Blocked a close from "${e.detail.source}": you have unsaved changes.`;
        }
      }}
    >
      <div class="sb-stack">
        <uf-input label="Name" value="Ada" hint="Change it, then try Escape, the backdrop or the close button."></uf-input>
        <output class="sb-note" style="margin: 0"></output>
      </div>
      <uf-button slot="footer" data-dialog="close">Save</uf-button>
    </uf-dialog>
  `,
};

export const LongContent: Story = {
  name: 'Long content (scrolls)',
  render: () => html`
    <uf-button variant="secondary" @click=${openNext}>Read the terms</uf-button>
    <uf-dialog label="Terms of service">
      ${Array.from({ length: 20 }, (_, i) => html`<p>${i + 1}. The body scrolls while the header and footer stay in place.</p>`)}
      <uf-button slot="footer" variant="ghost" data-dialog="close">Decline</uf-button>
      <uf-button slot="footer" data-dialog="close">Accept</uf-button>
    </uf-dialog>
  `,
};

export const WithAForm: Story = {
  name: 'With a form',
  render: () => html`
    <uf-button @click=${openNext}><uf-icon slot="prefix" name="plus"></uf-icon>New project</uf-button>
    <uf-dialog label="New project">
      <form
        id="sb-new-project"
        class="sb-stack"
        @submit=${(e: SubmitEvent) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          (form.closest('uf-dialog') as Dialog).hide();
          form.reset();
        }}
      >
        <uf-input name="name" label="Name" required></uf-input>
        <uf-select name="visibility" label="Visibility" value="private">
          <option value="private">Private</option>
          <option value="public">Public</option>
        </uf-select>
      </form>
      <uf-button slot="footer" variant="ghost" data-dialog="close">Cancel</uf-button>
      <uf-button slot="footer" type="submit" form="sb-new-project">Create</uf-button>
    </uf-dialog>
    <p class="sb-note">The dialog closes only after the form is valid and submitted.</p>
  `,
};

export const Customized: Story = {
  args: {
    label: 'Custom properties',
    'light-dismiss': true,
    '--uf-dialog-width': '24rem',
    '--uf-dialog-radius': '16px',
    '--uf-dialog-padding': '2rem',
    '--uf-dialog-backdrop': 'rgb(105 48 195 / 0.45)',
  },
};
