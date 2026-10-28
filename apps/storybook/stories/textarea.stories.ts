import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Textarea',
  component: 'uf-textarea',
  args: { label: 'Bio', hint: 'Up to 280 characters.', placeholder: 'Tell us about yourself', rows: 4, resize: 'vertical', size: 'md', maxlength: 280 },
  render: (a) => html`<div class="sb-stack"><uf-textarea ${spread(a)}></uf-textarea></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Resize: Story = {
  render: () => html`<div class="sb-grid">
    <uf-textarea label="resize=&quot;vertical&quot;" resize="vertical" rows="3" hint="Drag the corner (default)"></uf-textarea>
    <uf-textarea label="resize=&quot;none&quot;" resize="none" rows="3" hint="Fixed height"></uf-textarea>
    <uf-textarea label="resize=&quot;auto&quot;" resize="auto" rows="2" hint="Grows as you type"></uf-textarea>
  </div>`,
};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    <uf-textarea size="sm" label="Small" rows="2"></uf-textarea>
    <uf-textarea size="md" label="Medium" rows="2"></uf-textarea>
    <uf-textarea size="lg" label="Large" rows="2"></uf-textarea>
  </div>`,
};

export const States: Story = {
  render: () => html`<div class="sb-stack">
    <uf-textarea label="Disabled" value="Can't touch this" disabled rows="2"></uf-textarea>
    <uf-textarea label="Read-only" value="Selectable, not editable" readonly rows="2"></uf-textarea>
    <uf-textarea label="Required" required rows="2"></uf-textarea>
  </div>`,
};

export const LabelAndHintSlots: Story = {
  name: 'Label and hint slots',
  render: () => html`<div class="sb-stack">
    <uf-textarea rows="3">
      <span slot="label">Feedback <em style="font-weight: 400">(optional)</em></span>
      <span slot="hint">Markdown supported. <a href="https://commonmark.org/help/" target="_blank">Syntax</a></span>
    </uf-textarea>
  </div>`,
};

export const Validation: Story = {
  name: 'Validation (submit the form)',
  render: () => html`<form
    class="sb-stack"
    @submit=${(e: SubmitEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      form.querySelector('output')!.textContent = `Submitted: ${new URLSearchParams(new FormData(form) as never)}`;
    }}
  >
    <uf-textarea name="message" label="Message" required minlength="20" hint="At least 20 characters" rows="3"></uf-textarea>
    <div><uf-button type="submit">Send</uf-button></div>
    <output class="sb-note"></output>
  </form>`,
};

export const Customized: Story = {
  args: { label: 'Custom properties', hint: '', '--uf-field-radius': '12px', '--uf-field-bg': 'rgb(105 48 195 / 0.12)', '--uf-field-border-color': '#6930c3' },
};
