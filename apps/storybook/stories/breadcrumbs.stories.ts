import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Breadcrumbs',
  component: 'uf-breadcrumbs',
  subcomponents: { BreadcrumbItem: 'uf-breadcrumb-item' },
  args: { label: '' },
  render: (a) => html`<uf-breadcrumbs ${spread(a)}>
    <uf-breadcrumb-item href="#">Home</uf-breadcrumb-item>
    <uf-breadcrumb-item href="#">Docs</uf-breadcrumb-item>
    <uf-breadcrumb-item href="#">Theming</uf-breadcrumb-item>
  </uf-breadcrumbs>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const CustomSeparator: Story = {
  name: 'Custom separator',
  render: () => html`<div class="sb-stack">
    <uf-breadcrumbs>
      <span slot="separator">/</span>
      <uf-breadcrumb-item href="#">Home</uf-breadcrumb-item>
      <uf-breadcrumb-item href="#">Docs</uf-breadcrumb-item>
      <uf-breadcrumb-item>Theming</uf-breadcrumb-item>
    </uf-breadcrumbs>
    <uf-breadcrumbs>
      <span slot="separator">·</span>
      <uf-breadcrumb-item href="#">Shop</uf-breadcrumb-item>
      <uf-breadcrumb-item href="#">Shoes</uf-breadcrumb-item>
      <uf-breadcrumb-item>Running</uf-breadcrumb-item>
    </uf-breadcrumbs>
  </div>`,
};

export const WithIcons: Story = {
  name: 'With icons',
  render: () => html`<uf-breadcrumbs>
    <uf-breadcrumb-item href="#"><uf-icon slot="prefix" name="user"></uf-icon>John Smith</uf-breadcrumb-item>
    <uf-breadcrumb-item href="#">Projects</uf-breadcrumb-item>
    <uf-breadcrumb-item>Website redesign</uf-breadcrumb-item>
  </uf-breadcrumbs>`,
};

export const Long: Story = {
  name: 'Wrapping',
  render: () => html`<div style="max-width: 18rem">
    <uf-breadcrumbs>
      <uf-breadcrumb-item href="#">Home</uf-breadcrumb-item>
      <uf-breadcrumb-item href="#">Departments</uf-breadcrumb-item>
      <uf-breadcrumb-item href="#">Engineering</uf-breadcrumb-item>
      <uf-breadcrumb-item href="#">Front-end</uf-breadcrumb-item>
      <uf-breadcrumb-item>Design system</uf-breadcrumb-item>
    </uf-breadcrumbs>
  </div>`,
};

export const Styled: Story = {
  name: 'Styled with ::part()',
  render: () => html`<style>
      .sb-teal-crumbs uf-breadcrumb-item::part(link) {
        color: #0f766e;
      }
    </style>
    <uf-breadcrumbs class="sb-teal-crumbs">
      <uf-breadcrumb-item href="#">Home</uf-breadcrumb-item>
      <uf-breadcrumb-item href="#">Docs</uf-breadcrumb-item>
      <uf-breadcrumb-item>Theming</uf-breadcrumb-item>
    </uf-breadcrumbs>`,
};
