import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread, storyArg } from '../.storybook/args';

const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'link'];

const meta: Meta = {
  title: 'Components/Button',
  component: 'uf-button',
  args: { text: 'Button', variant: 'primary', size: 'md' },
  argTypes: { text: storyArg('the button text (default slot).') },
  render: (a) => html`<uf-button ${spread(a)}>${a.text}</uf-button>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Variants: Story = {
  render: () => html`<div class="sb-row">
    ${variants.map((variant) => html`<uf-button variant=${variant}>${variant[0].toUpperCase() + variant.slice(1)}</uf-button>`)}
  </div>`,
};

export const Sizes: Story = {
  render: () => html`<div class="sb-row">
    <uf-button size="sm">Small</uf-button>
    <uf-button size="md">Medium</uf-button>
    <uf-button size="lg">Large</uf-button>
  </div>`,
};

export const WithIcons: Story = {
  render: () => html`<div class="sb-row">
    <uf-button><uf-icon slot="prefix" name="plus"></uf-icon>New item</uf-button>
    <uf-button variant="secondary">Next<uf-icon slot="suffix" name="chevron-right"></uf-icon></uf-button>
    <uf-button variant="outline"><uf-icon slot="prefix" name="search"></uf-icon>Search<uf-icon slot="suffix" name="chevron-down"></uf-icon></uf-button>
  </div>`,
};

export const IconOnly: Story = {
  name: 'Icon only',
  render: () => html`<div class="sb-row">
    <uf-button size="sm" variant="ghost" label="Search"><uf-icon slot="prefix" name="search"></uf-icon></uf-button>
    <uf-button size="md" variant="outline" label="Add"><uf-icon slot="prefix" name="plus"></uf-icon></uf-button>
    <uf-button size="lg" label="Close"><uf-icon slot="prefix" name="x"></uf-icon></uf-button>
  </div>
  <p class="sb-note">Icon-only buttons are square and need a <code>label</code> for screen readers.</p>`,
};

export const Disabled: Story = {
  render: () => html`<div class="sb-row">
    ${variants.map((variant) => html`<uf-button variant=${variant} disabled>${variant}</uf-button>`)}
  </div>`,
};

export const Loading: Story = {
  render: () => html`<div class="sb-row">
    ${variants.map((variant) => html`<uf-button variant=${variant} loading>${variant}</uf-button>`)}
  </div>
  <p class="sb-note">Loading buttons show a spinner, keep their width and ignore clicks.</p>`,
};

export const Links: Story = {
  name: 'As links (href)',
  render: () => html`<div class="sb-row">
    <uf-button href="https://github.com/P-DB/unframed-ui" target="_blank">Opens in a new tab</uf-button>
    <uf-button variant="outline" href="./?path=/docs/introduction--docs" target="_top">Same tab</uf-button>
    <uf-button variant="link" href="https://github.com/P-DB/unframed-ui">Text link</uf-button>
    <uf-button variant="secondary" href="data:text/plain,Hello from Unframed" download="hello.txt">
      <uf-icon slot="prefix" name="chevron-down"></uf-icon>Download
    </uf-button>
  </div>
  <p class="sb-note">With <code>href</code> the button renders an <code>&lt;a&gt;</code>. <code>target="_blank"</code> adds <code>rel="noreferrer noopener"</code> unless you set <code>rel</code>.</p>`,
};

export const InAForm: Story = {
  name: 'In a form (type)',
  render: () => html`<form
    class="sb-stack"
    @submit=${(e: SubmitEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      form.querySelector('output')!.textContent = `Submitted: ${new URLSearchParams(new FormData(form) as never)}`;
    }}
    @reset=${(e: Event) => ((e.target as HTMLFormElement).querySelector('output')!.textContent = 'Reset')}
  >
    <uf-input name="name" label="Name" value="Ada"></uf-input>
    <div class="sb-row">
      <uf-button type="submit">Submit</uf-button>
      <uf-button type="reset" variant="ghost">Reset</uf-button>
      <uf-button variant="secondary">type="button" does nothing</uf-button>
    </div>
    <output class="sb-note"></output>
  </form>`,
};

export const Customized: Story = {
  args: { '--uf-button-radius': '999px', '--uf-button-bg': '#0f766e', '--uf-button-bg-hover': '#115e59', text: 'Custom properties' },
  render: (a) => html`<div class="sb-row">
    <uf-button ${spread(a)}>${a.text}</uf-button>
    <uf-button class="sb-parts-demo">Styled with ::part(base)</uf-button>
  </div>
  <style>
    .sb-parts-demo::part(base) { text-transform: uppercase; letter-spacing: 0.08em; }
  </style>`,
};
