import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

type Drawer = HTMLElement & { show(): void };

/** Opens the drawer right after the clicked button. */
const openNext = (e: Event) => ((e.currentTarget as Element).nextElementSibling as Drawer).show();

const meta: Meta = {
  title: 'Components/Drawer',
  component: 'uf-drawer',
  args: { label: 'Filters', placement: 'end', 'light-dismiss': true, 'without-header': false },
  render: (a) => html`
    <uf-button variant="outline" @click=${openNext}>Open drawer</uf-button>
    <uf-drawer ${spread(a)}>
      <div style="display: grid; gap: 1rem">
        <uf-checkbox-group label="Status">
          <uf-checkbox value="open" checked>Open</uf-checkbox>
          <uf-checkbox value="closed">Closed</uf-checkbox>
        </uf-checkbox-group>
        <uf-slider label="Maximum price" max="500" step="10" value="250" show-value></uf-slider>
      </div>
      <uf-button slot="footer" variant="ghost" data-dialog="close">Cancel</uf-button>
      <uf-button slot="footer" data-dialog="close">Apply</uf-button>
    </uf-drawer>
  `,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Placements: Story = {
  render: () => html`<div class="sb-row">
    ${(['start', 'end', 'top', 'bottom'] as const).map(
      (placement) => html`<span>
        <uf-button variant="outline" @click=${openNext}>${placement}</uf-button>
        <uf-drawer label=${`Placement: ${placement}`} placement=${placement} light-dismiss>Slides in from the ${placement} edge.</uf-drawer>
      </span>`,
    )}
  </div>`,
};

export const Navigation: Story = {
  name: 'Navigation menu',
  render: () => html`
    <uf-button variant="ghost" @click=${openNext}>☰ Menu</uf-button>
    <uf-drawer label="Menu" placement="start" light-dismiss style="--uf-drawer-size: 16rem">
      <nav style="display: grid; gap: 0.5rem">
        <a href="#">Dashboard</a>
        <a href="#">Projects</a>
        <a href="#">Team</a>
        <a href="#">Settings</a>
      </nav>
    </uf-drawer>
  `,
};

export const RightToLeft: Story = {
  name: 'Right to left',
  render: () => html`<div dir="rtl" lang="ar">
    <uf-button variant="outline" @click=${openNext}>فتح</uf-button>
    <uf-drawer label="المرشحات" light-dismiss>تظهر اللوحة من الجهة اليسرى في الصفحات من اليمين إلى اليسار.</uf-drawer>
  </div>`,
};

export const Customized: Story = {
  args: { label: 'Custom properties', '--uf-drawer-size': '32rem', '--uf-dialog-bg': '#f0fdfa' },
};
