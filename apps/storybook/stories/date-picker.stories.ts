import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { setTranslations } from '@unframed/core';
import it from '@unframed/core/locales/it';
import { controlsOf, spread } from '../.storybook/args';

/** Today and a date some days away, as YYYY-MM-DD, so the stories stay current. */
const day = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().slice(0, 10);
};
const weekend = (iso: string) => [0, 6].includes(new Date(iso).getUTCDay());

// For the Translated story; it only applies where lang="it".
setTranslations(it, 'it');

const meta: Meta = {
  title: 'Components/Date picker',
  component: 'uf-date-picker',
  subcomponents: { Calendar: 'uf-calendar' },
  args: { label: 'Check-in', hint: 'From 3 pm', name: 'checkin', size: 'md' },
  render: (a) => html`<div class="sb-stack"><uf-date-picker ${spread(a)}></uf-date-picker></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithValue: Story = {
  name: 'With a value',
  args: { value: day() },
};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    <uf-date-picker size="sm" label="Small"></uf-date-picker>
    <uf-date-picker size="md" label="Medium"></uf-date-picker>
    <uf-date-picker size="lg" label="Large"></uf-date-picker>
  </div>`,
};

export const MinMax: Story = {
  name: 'Min and max',
  args: { label: 'Return', hint: 'Within the next 30 days', min: day(), max: day(30) },
};

export const DisabledDates: Story = {
  name: 'Disabled dates (isDateDisabled)',
  render: () => html`<div class="sb-stack">
    <uf-date-picker label="Delivery day" hint="Weekdays only" min=${day(1)} .isDateDisabled=${weekend}></uf-date-picker>
    <p class="sb-note" style="margin: 0">
      <code>isDateDisabled</code> is a property, a function called with each date as <code>YYYY-MM-DD</code>.
    </p>
  </div>`,
};

export const States: Story = {
  render: () => html`<div class="sb-stack">
    <uf-date-picker label="Disabled" value=${day()} disabled></uf-date-picker>
    <uf-date-picker label="Read-only" value=${day()} readonly></uf-date-picker>
    <uf-date-picker label="Required" required></uf-date-picker>
  </div>`,
};

export const Languages: Story = {
  name: 'Date format by language',
  render: () => html`<div class="sb-grid">
    ${[
      ['en-US', 'English (US)'],
      ['en-GB', 'English (UK)'],
      ['it', 'Italiano'],
      ['de', 'Deutsch'],
      ['ja', '日本語'],
    ].map(([lang, name]) => html`<uf-date-picker lang=${lang} label=${name} value=${day()}></uf-date-picker>`)}
  </div>
  <p class="sb-note">The format, month names and first day of the week follow the nearest <code>lang</code>. The value is always <code>YYYY-MM-DD</code>.</p>`,
};

export const Translated: Story = {
  name: 'Translated texts',
  render: () => html`<div class="sb-stack" lang="it">
    <uf-date-picker label="Data di arrivo" required></uf-date-picker>
    <p class="sb-note" style="margin: 0">
      <code>setTranslations(it, 'it')</code>, with the built-in Italian, translates the button, the calendar's month
      buttons, the placeholder letters and the error messages. Type "domani" to see the error.
    </p>
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
    <uf-date-picker name="from" label="From" required min=${day()}></uf-date-picker>
    <uf-date-picker name="to" label="To" required min=${day()} max=${day(60)}></uf-date-picker>
    <div><uf-button type="submit">Search</uf-button></div>
    <output class="sb-note"></output>
  </form>`,
};

const calendar = controlsOf('uf-calendar');

export const Calendar: Story = {
  name: 'Calendar on its own',
  ...calendar,
  args: { value: day(), 'first-day-of-week': undefined },
  render: (a) => html`<uf-calendar
      ${spread(a)}
      @change=${(e: Event) => {
        (e.currentTarget as Element).nextElementSibling!.textContent = `change: ${(e.currentTarget as HTMLElement & { value: string }).value}`;
      }}
    ></uf-calendar>
    <output class="sb-note" style="display: block">Pick a day.</output>`,
};

export const Customized: Story = {
  args: { label: 'Custom properties', '--uf-field-radius': '999px', '--uf-field-border-color': '#0f766e' },
  render: (a) => html`<style>
      .sb-teal-picker::part(popup) {
        border-color: #0f766e;
      }
    </style>
    <div class="sb-stack"><uf-date-picker class="sb-teal-picker" ${spread(a)}></uf-date-picker></div>`,
};
