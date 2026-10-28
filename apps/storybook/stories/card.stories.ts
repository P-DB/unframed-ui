import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import cover from '../../website/public/og-image.png';
import { spread } from '../.storybook/args';

// The same card as on the docs website, with its cover image.
const content = html`
  <img slot="media" src=${cover} alt="The Unframed logo" style="aspect-ratio: 1200 / 630" />
  <div slot="header">
    <h4 style="margin: 0">Unframed 0.2</h4>
    <small>Released this week</small>
  </div>
  A link button variant, new colors and smaller Angular bundles.
  <uf-button slot="footer">Read more</uf-button>
  <uf-button slot="footer" variant="ghost">Dismiss</uf-button>
`;

const meta: Meta = {
  title: 'Components/Card',
  component: 'uf-card',
  args: { appearance: 'outline', orientation: 'vertical' },
  render: (a) => html`<div style="max-width: 22rem"><uf-card ${spread(a)}>${content}</uf-card></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Appearances: Story = {
  render: () => html`<div class="sb-grid">
    ${['outline', 'elevated', 'filled'].map(
      (appearance) => html`<uf-card appearance=${appearance}>
        <h3 slot="header" style="margin: 0">${appearance}</h3>
        appearance="${appearance}"
      </uf-card>`,
    )}
  </div>`,
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (a) => html`<div style="max-width: 36rem"><uf-card ${spread(a)}>${content}</uf-card></div>`,
};

export const Sections: Story = {
  name: 'Only the sections you need',
  render: () => html`<div class="sb-grid">
    <uf-card>Just content.</uf-card>
    <uf-card><h3 slot="header" style="margin: 0">Header only</h3></uf-card>
    <uf-card>
      <h3 slot="header" style="margin: 0">Header and footer</h3>
      <uf-button slot="footer" size="sm">Action</uf-button>
    </uf-card>
    <uf-card><img slot="media" src=${cover} alt="" style="aspect-ratio: 1200 / 630" />Media and content</uf-card>
  </div>
  <p class="sb-note">Empty sections take no space.</p>`,
};

export const Stat: Story = {
  name: 'Dashboard stats',
  render: () => html`<div class="sb-grid">
    ${[
      ['Revenue', '€48,210', '+12%', 'success'],
      ['Orders', '1,284', '+3%', 'success'],
      ['Refunds', '23', '+9%', 'danger'],
    ].map(
      ([label, value, change, variant]) => html`<uf-card appearance="filled">
        <div class="sb-note" style="margin: 0">${label}</div>
        <div style="display: flex; gap: 0.5rem; align-items: baseline; margin-top: 0.25rem">
          <strong style="font-size: 1.75rem">${value}</strong>
          <uf-badge variant=${variant} size="sm">${change}</uf-badge>
        </div>
      </uf-card>`,
    )}
  </div>`,
};

export const LinkCard: Story = {
  name: 'Whole card as a link',
  render: () => html`<style>
      .sb-link-card {
        position: relative;
      }
      .sb-link-card a::after {
        content: '';
        position: absolute;
        inset: 0;
      }
      .sb-link-card:hover::part(base) {
        border-color: var(--uf-color-accent-strong);
      }
    </style>
    <div style="max-width: 22rem">
      <uf-card class="sb-link-card">
        <h3 slot="header" style="margin: 0"><a href="https://github.com/P-DB/unframed-ui" target="_blank">Unframed on GitHub</a></h3>
        The link in the header covers the whole card with a pseudo-element.
      </uf-card>
    </div>`,
};

export const Customized: Story = {
  args: {
    '--uf-card-radius': '16px',
    '--uf-card-padding': '1.5rem',
    '--uf-card-border-color': '#6930c3',
    '--uf-card-bg': 'rgb(105 48 195 / 0.08)',
  },
};
