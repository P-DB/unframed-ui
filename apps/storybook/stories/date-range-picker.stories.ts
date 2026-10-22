import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { setTranslations } from '@unframed/core';
import it from '@unframed/core/locales/it';
import { controlsOf, spread } from '../.storybook/args';

/** Today and dates some days away, as YYYY-MM-DD, so the stories stay current. */
const day = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().slice(0, 10);
};
const weekend = (iso: string) => [0, 6].includes(new Date(iso).getUTCDay());

// For the Translated story; it only applies where lang="it".
setTranslations(it, 'it');

const meta: Meta = {
  title: 'Components/Date range picker',
  component: 'uf-date-range-picker',
  args: { label: 'Stay', hint: 'Check-in from 3 pm', name: 'stay', size: 'md' },
  render: (a) => html`<div class="sb-stack"><uf-date-range-picker ${spread(a)}></uf-date-range-picker></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithValue: Story = {
  name: 'With a value',
  args: { value: `${day()}/${day(4)}` },
};

export const Sizes: Story = {
  render: () => html`<div class="sb-stack">
    <uf-date-range-picker size="sm" label="Small"></uf-date-range-picker>
    <uf-date-range-picker size="md" label="Medium"></uf-date-range-picker>
    <uf-date-range-picker size="lg" label="Large"></uf-date-range-picker>
  </div>`,
};

export const MinMax: Story = {
  name: 'Min and max',
  args: { label: 'Trip', hint: 'Within the next 60 days', min: day(), max: day(60) },
};

export const DisabledDates: Story = {
  name: 'Disabled dates (isDateDisabled)',
  render: () => html`<div class="sb-stack">
    <uf-date-range-picker label="Leave" hint="Weekdays only" min=${day(1)} .isDateDisabled=${weekend}></uf-date-range-picker>
  </div>`,
};

export const States: Story = {
  render: () => html`<div class="sb-stack">
    <uf-date-range-picker label="Disabled" value=${`${day()}/${day(3)}`} disabled></uf-date-range-picker>
    <uf-date-range-picker label="Read-only" value=${`${day()}/${day(3)}`} readonly></uf-date-range-picker>
    <uf-date-range-picker label="Required" required></uf-date-range-picker>
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
    ].map(([lang, name]) => html`<uf-date-range-picker lang=${lang} label=${name} value=${`${day()}/${day(5)}`}></uf-date-range-picker>`)}
  </div>`,
};

export const Translated: Story = {
  name: 'Translated texts',
  render: () => html`<div class="sb-stack" lang="it">
    <uf-date-range-picker label="Soggiorno" required></uf-date-range-picker>
    <p class="sb-note" style="margin: 0"><code>setTranslations(it, 'it')</code>, with the built-in Italian. Type only the start date to see the message.</p>
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
    <uf-date-range-picker name="stay" label="Stay" required min=${day()}></uf-date-range-picker>
    <div><uf-button type="submit">Book</uf-button></div>
    <output class="sb-note"></output>
  </form>`,
};

const calendar = controlsOf('uf-calendar');

export const CalendarRange: Story = {
  name: 'Calendar on its own (range)',
  ...calendar,
  args: { range: true, start: day(2), end: day(6) },
  render: (a) => html`<uf-calendar
      ${spread(a)}
      @change=${(e: Event) => {
        const el = e.currentTarget as HTMLElement & { start: string; end: string };
        el.nextElementSibling!.textContent = `change: ${el.start} → ${el.end}`;
      }}
    ></uf-calendar>
    <output class="sb-note" style="display: block">Pick a start, then an end.</output>`,
};

export const Customized: Story = {
  args: { label: 'Custom properties', '--uf-field-radius': '999px', '--uf-field-border-color': '#0f766e' },
};
