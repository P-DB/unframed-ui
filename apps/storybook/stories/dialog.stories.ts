import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Dialog',
  component: 'uf-dialog',
  args: { label: 'Delete project?', lightDismiss: true },
  render: (a) => html`
    <uf-button variant="danger" @click=${(e: Event) => ((e.target as Element).nextElementSibling as HTMLElement & { show(): void }).show()}>
      Delete project…
    </uf-button>
    <uf-dialog label=${a.label} ?light-dismiss=${a.lightDismiss}>
      <p style="margin: 0">This permanently deletes the project and its 128 issues.</p>
      <uf-button slot="footer" variant="ghost" data-dialog="close">Cancel</uf-button>
      <uf-button slot="footer" variant="danger" data-dialog="close">Delete</uf-button>
    </uf-dialog>
  `,
};
export default meta;

export const Default: StoryObj = {};
