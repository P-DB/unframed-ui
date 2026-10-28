import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const tabs = html`
  <uf-tab panel="general">General</uf-tab>
  <uf-tab panel="members">Members</uf-tab>
  <uf-tab panel="billing">Billing</uf-tab>
  <uf-tab panel="archived" disabled>Archived</uf-tab>
  <uf-tab-panel name="general">General settings. Use the arrow keys to move between tabs.</uf-tab-panel>
  <uf-tab-panel name="members">Invite people and manage roles.</uf-tab-panel>
  <uf-tab-panel name="billing">Plans, invoices and payment methods.</uf-tab-panel>
  <uf-tab-panel name="archived">Nothing here.</uf-tab-panel>
`;

const meta: Meta = {
  title: 'Components/Tabs',
  component: 'uf-tabs',
  subcomponents: { Tab: 'uf-tab', TabPanel: 'uf-tab-panel' },
  args: { label: 'Project settings', activation: 'auto', orientation: 'horizontal' },
  argTypes: {
    // The tabs are children; offer their panel names.
    value: { control: 'inline-radio', options: ['general', 'members', 'billing'] },
  },
  render: (a) => html`<uf-tabs ${spread(a)}>${tabs}</uf-tabs>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};

export const ManualActivation: Story = {
  name: 'Manual activation',
  args: { activation: 'manual' },
  render: (a) => html`<uf-tabs ${spread(a)}>${tabs}</uf-tabs>
    <p class="sb-note">Arrow keys only move focus; Enter or Space selects the focused tab. Use it when showing a panel is slow.</p>`,
};

export const PreselectedTab: Story = {
  name: 'Preselected tab',
  args: { value: 'billing' },
};

export const RichTabs: Story = {
  name: 'Tabs with icons',
  render: () => html`<uf-tabs label="Inbox">
    <uf-tab panel="all"><uf-icon name="info"></uf-icon>&nbsp;All</uf-tab>
    <uf-tab panel="done"><uf-icon name="check-circle"></uf-icon>&nbsp;Done</uf-tab>
    <uf-tab panel="alerts"><uf-icon name="alert-triangle"></uf-icon>&nbsp;Alerts</uf-tab>
    <uf-tab-panel name="all">Everything in one place.</uf-tab-panel>
    <uf-tab-panel name="done">Finished tasks.</uf-tab-panel>
    <uf-tab-panel name="alerts">Things that need your attention.</uf-tab-panel>
  </uf-tabs>`,
};

export const ChangeEvent: Story = {
  name: 'Listening for changes',
  render: () => html`<uf-tabs
      label="Report"
      @uf-tab-change=${(e: CustomEvent) => {
        const output = (e.currentTarget as Element).nextElementSibling!;
        output.textContent = `uf-tab-change: ${JSON.stringify(e.detail)}`;
      }}
    >
      <uf-tab panel="day">Day</uf-tab>
      <uf-tab panel="week">Week</uf-tab>
      <uf-tab panel="month">Month</uf-tab>
      <uf-tab-panel name="day">Today's numbers.</uf-tab-panel>
      <uf-tab-panel name="week">This week's numbers.</uf-tab-panel>
      <uf-tab-panel name="month">This month's numbers.</uf-tab-panel>
    </uf-tabs>
    <output class="sb-note">Select a tab.</output>`,
};

export const Customized: Story = {
  args: { '--uf-tabs-indicator-color': '#0f766e' },
  render: (a) => html`<uf-tabs ${spread(a)} style="--uf-tab-panel-padding: 2rem 0">${tabs}</uf-tabs>
    <p class="sb-note"><code>--uf-tab-panel-padding</code> is set on the tabs, and inherited by every panel.</p>`,
};
