import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

/** An inline SVG "photo", so the stories work offline. */
const photo = (hue: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="hsl(${hue} 60% 55%)"/><circle cx="40" cy="32" r="14" fill="hsl(${hue} 60% 85%)"/><path d="M14 80a26 26 0 0 1 52 0" fill="hsl(${hue} 60% 85%)"/></svg>`,
  )}`;

const meta: Meta = {
  title: 'Components/Avatar',
  component: 'uf-avatar',
  args: { name: 'John Smith', size: 'lg', shape: 'circle' },
  argTypes: {
    // Story only: pick a sample image or none.
    src: { control: 'select', options: ['', photo(265), photo(160), 'https://invalid.example/missing.png'] },
  },
  render: (a) => html`<uf-avatar ${spread(a)}></uf-avatar>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithImage: Story = {
  name: 'With an image',
  args: { src: photo(265) },
};

export const Fallbacks: Story = {
  render: () => html`<div class="sb-row" style="gap: 2rem">
    <figure style="margin: 0; text-align: center"><uf-avatar size="lg" name="John Smith" src=${photo(265)}></uf-avatar><figcaption class="sb-note">Image</figcaption></figure>
    <figure style="margin: 0; text-align: center"><uf-avatar size="lg" name="John Smith" src="https://invalid.example/missing.png"></uf-avatar><figcaption class="sb-note">Broken image → initials</figcaption></figure>
    <figure style="margin: 0; text-align: center"><uf-avatar size="lg" name="John Smith"></uf-avatar><figcaption class="sb-note">No image → initials</figcaption></figure>
    <figure style="margin: 0; text-align: center"><uf-avatar size="lg"></uf-avatar><figcaption class="sb-note">No name → icon</figcaption></figure>
  </div>`,
};

export const Sizes: Story = {
  render: () => html`<div class="sb-row" style="align-items: end">
    ${['sm', 'md', 'lg', 'xl'].map((size) => html`<uf-avatar size=${size} name="John Smith"></uf-avatar>`)}
  </div>`,
};

export const Shapes: Story = {
  render: () => html`<div class="sb-row">
    <uf-avatar size="lg" name="John Smith" shape="circle"></uf-avatar>
    <uf-avatar size="lg" name="Unframed" initials="U" shape="square"></uf-avatar>
    <uf-avatar size="lg" shape="square" src=${photo(160)} name="Team photo"></uf-avatar>
  </div>`,
};

export const CustomContent: Story = {
  name: 'Custom content (slot)',
  render: () => html`<div class="sb-row">
    <uf-avatar size="lg" name="Settings"><uf-icon name="search"></uf-icon></uf-avatar>
    <uf-avatar size="lg" name="Starred"><span>★</span></uf-avatar>
  </div>`,
};

export const WithName: Story = {
  name: 'Next to a name (decorative)',
  render: () => html`<div class="sb-stack">
    ${[
      ['John Smith', 'Product designer', photo(265)],
      ['Jane Doe', 'Engineer', ''],
      ['Mario Rossi', 'Product manager', photo(160)],
    ].map(
      ([name, role, src]) => html`<div style="display: flex; gap: 0.75rem; align-items: center">
        <uf-avatar name=${name} src=${src} decorative></uf-avatar>
        <div><strong>${name}</strong><div class="sb-note" style="margin: 0">${role}</div></div>
      </div>`,
    )}
    <p class="sb-note">The name is already written, so <code>decorative</code> keeps screen readers from reading it twice.</p>
  </div>`,
};

export const Group: Story = {
  name: 'Stacked group',
  render: () => html`<div style="display: flex">
      ${['John Smith', 'Jane Doe', 'Mario Rossi', 'Sara Kim'].map(
        (name, i) => html`<uf-avatar
          name=${name}
          style="margin-inline-start: ${i ? '-0.75rem' : '0'}; border-radius: 50%; box-shadow: 0 0 0 2px var(--uf-color-surface)"
        ></uf-avatar>`,
      )}
      <uf-avatar name="3 more" initials="+3" style="margin-inline-start: -0.75rem; border-radius: 50%; box-shadow: 0 0 0 2px var(--uf-color-surface); --uf-avatar-bg: var(--uf-color-surface-hover); --uf-avatar-color: var(--uf-color-text)"></uf-avatar>
    </div>
    <p class="sb-note">A group is plain CSS: negative margins and a ring in the page's background color.</p>`,
};

export const Customized: Story = {
  args: { name: 'Teal Team', '--uf-avatar-size': '5rem', '--uf-avatar-bg': '#0f766e', '--uf-avatar-color': '#ffffff', '--uf-avatar-radius': '12px' },
};
