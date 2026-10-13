import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const placements = ['top-start', 'top', 'top-end', 'left', 'right', 'bottom-start', 'bottom', 'bottom-end'];

const meta: Meta = {
  title: 'Components/Popover',
  component: 'uf-popover',
  args: { placement: 'bottom-start', distance: 6, label: 'Filters' },
  render: (a) => html`<div style="padding: 8rem 0; display: grid; place-items: center">
    <uf-popover ${spread(a)}>
      <uf-button slot="trigger" variant="outline">Filters<uf-icon slot="suffix" name="chevron-down"></uf-icon></uf-button>
      <div class="sb-stack" style="width: 14rem; gap: 0.5rem">
        <uf-checkbox checked>Open issues</uf-checkbox>
        <uf-checkbox>Closed issues</uf-checkbox>
        <uf-switch>Only mine</uf-switch>
      </div>
    </uf-popover>
  </div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Placements: Story = {
  render: () => html`<div style="display: grid; grid-template-columns: repeat(3, auto); gap: 1rem; justify-content: center; padding: 6rem 0">
    ${placements.map(
      (placement) => html`<uf-popover placement=${placement}>
        <uf-button slot="trigger" variant="outline" style="width: 9rem">${placement}</uf-button>
        <span>placement="${placement}"</span>
      </uf-popover>`,
    )}
  </div>
  <p class="sb-note">Near the edge of the viewport, the popover flips to the other side.</p>`,
};

export const Distance: Story = {
  render: () => html`<div class="sb-row" style="padding-bottom: 6rem">
    ${[0, 6, 24].map(
      (distance) => html`<uf-popover distance=${distance}>
        <uf-button slot="trigger" variant="outline">distance=${distance}</uf-button>
        <span>${distance}px from the trigger</span>
      </uf-popover>`,
    )}
  </div>`,
};

export const RichContent: Story = {
  name: 'Rich content',
  render: () => html`<div style="padding-bottom: 14rem">
    <uf-popover label="Share">
      <uf-button slot="trigger">Share</uf-button>
      <div class="sb-stack" style="width: 18rem; gap: 0.75rem">
        <strong>Share this project</strong>
        <uf-input label="Invite by email" type="email" placeholder="name@example.com"></uf-input>
        <uf-radio-group label="Access" value="view" orientation="horizontal">
          <uf-radio value="view">Can view</uf-radio>
          <uf-radio value="edit">Can edit</uf-radio>
        </uf-radio-group>
        <div><uf-button size="sm">Send invite</uf-button></div>
      </div>
    </uf-popover>
  </div>
  <p class="sb-note">Focus moves into the popover; Escape or a click outside closes it and returns focus to the trigger.</p>`,
};

export const Controlled: Story = {
  name: 'Opened from code',
  render: () => html`<div class="sb-row" style="padding-bottom: 6rem">
    <uf-popover id="sb-controlled-popover">
      <uf-button slot="trigger" variant="outline">Trigger</uf-button>
      <span>Opened with show()</span>
    </uf-popover>
    <uf-button variant="secondary" @click=${() => (document.getElementById('sb-controlled-popover') as HTMLElement & { show(): void }).show()}>
      show()
    </uf-button>
  </div>`,
};

export const Customized: Story = {
  args: { '--uf-popover-padding': '1.5rem', '--uf-popover-width': '24rem' },
};
