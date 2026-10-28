import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Pagination',
  component: 'uf-pagination',
  args: { page: 5, pages: 12, siblings: 1, label: 'Pagination', size: 'md' },
  render: (a) => html`<uf-pagination ${spread(a)}></uf-pagination>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const FewPages: Story = {
  name: 'Few pages',
  args: { page: 2, pages: 4 },
};

export const ManyPages: Story = {
  name: 'Many pages',
  render: () => html`<div class="sb-stack" style="max-width: none">
    <uf-pagination label="Start" pages="50" page="1"></uf-pagination>
    <uf-pagination label="Middle" pages="50" page="25"></uf-pagination>
    <uf-pagination label="End" pages="50" page="50"></uf-pagination>
  </div>
  <p class="sb-note">The number of buttons stays the same from page to page, so they don't move under the pointer.</p>`,
};

export const Siblings: Story = {
  render: () => html`<div class="sb-stack" style="max-width: none">
    <uf-pagination label="No siblings" pages="30" page="15" siblings="0"></uf-pagination>
    <uf-pagination label="One sibling" pages="30" page="15" siblings="1"></uf-pagination>
    <uf-pagination label="Two siblings" pages="30" page="15" siblings="2"></uf-pagination>
  </div>`,
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const ChangeEvent: Story = {
  name: 'Listening for changes',
  render: () => html`<uf-pagination
      pages="8"
      @uf-page-change=${(e: CustomEvent<{ page: number }>) => {
        (e.currentTarget as Element).nextElementSibling!.textContent = `uf-page-change: ${JSON.stringify(e.detail)}`;
      }}
    ></uf-pagination>
    <output class="sb-note" style="display: block">Choose a page.</output>`,
};

export const TwoOnAPage: Story = {
  name: 'More than one on a page',
  render: () => html`<div class="sb-stack" style="max-width: none">
    <uf-pagination label="Results pages, top" pages="6" page="2"></uf-pagination>
    <p class="sb-note" style="margin: 0">… results …</p>
    <uf-pagination label="Results pages, bottom" pages="6" page="2"></uf-pagination>
  </div>
  <p class="sb-note">Each pagination is a navigation landmark: give each one a different <code>label</code>.</p>`,
};

export const Customized: Story = {
  args: { '--uf-pagination-gap': '0.75rem' },
  render: (a) => html`<style>
      .sb-round-pages::part(button) {
        border-radius: 999px;
      }
      .sb-round-pages::part(current) {
        background: #0f766e;
      }
    </style>
    <uf-pagination class="sb-round-pages" ${spread(a)}></uf-pagination>`,
};
