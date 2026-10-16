import { toast } from '@unframed/core';
import { UfButton, UfCard, UfCheckbox, UfCombobox, UfIcon, UfInput, UfSwitch } from '@unframed/react';
import { useNavigate } from 'react-router';
import { CodeBlock } from '../components/CodeBlock';
import { ComponentCards } from '../components/LinkCards';
import { LogoMark } from '../components/Logo';
import { storybookUrl } from '../links';
import { pages } from '../demos';

const features = [
  {
    icon: 'check-circle',
    title: 'Works with any framework',
    text: 'Standard custom elements: React, Vue, Angular, Svelte, Astro or plain HTML. One design system for every app you ship.',
  },
  {
    icon: 'plus',
    title: 'Own the code when you need to',
    text: 'Install from npm for updates, or copy a component into your project with one command and change anything.',
  },
  {
    icon: 'check',
    title: 'Form-ready',
    text: 'Every control submits, resets and validates like a native one, inside a plain <form>.',
  },
];

const accessibility = [
  {
    title: 'Keyboard first',
    text: 'Each widget follows its WAI-ARIA pattern: arrow keys in tabs, menus, radios and the calendar, Escape to close, and focus back where it was.',
  },
  {
    title: 'Made for screen readers',
    text: 'Real labels and roles, errors and hints linked to their field, and live announcements for search results and toasts.',
  },
  {
    title: 'Tested with axe',
    text: "Every component's tests run axe-core in a real browser, including popups and dialogs while open.",
  },
  {
    title: 'Readable contrast',
    text: 'The default colors meet WCAG AA contrast in light and dark mode, and the theme generator checks yours.',
  },
  {
    title: 'Visible focus',
    text: 'A clear focus ring on every control, shown for the keyboard and never removed.',
  },
  {
    title: 'Less motion on request',
    text: 'Animations turn off for people who ask their system to reduce motion.',
  },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div className="hero__brand">
          <LogoMark size={44} className="hero__logo" />
          Unframed
        </div>
        <h1 className="hero__title">
          UI components that <em className="hero__highlight">don’t care</em> about your framework.
        </h1>
        <p className="lead lead--hero">
          Unframed is a library of accessible, themeable web components. Use them anywhere, and own them when you want to.
        </p>
        <p className="hero__a11y">
          <UfIcon name="check-circle" /> Accessible by default: keyboard, screen readers and WCAG AA contrast, tested in every
          component.
        </p>
        <div className="hero__actions">
          <UfButton size="lg" onClick={() => navigate('/docs/getting-started')}>
            Get started
          </UfButton>
          <UfButton size="lg" variant="outline" onClick={() => navigate('/components')}>
            Browse components
          </UfButton>
          <UfButton size="lg" variant="outline" href={storybookUrl} target="_blank">
            Open Storybook
            <UfIcon slot="suffix" name="chevron-right" />
          </UfButton>
        </div>
      </section>

      <section className="section">
        <div className="features">
          {features.map((f) => (
            <UfCard key={f.title} variant="elevated" className="feature">
              <div slot="header">
                <UfIcon className="feature__icon" name={f.icon} />
                <h3 className="feature__title">{f.title}</h3>
              </div>
              <p className="feature__text">{f.text}</p>
            </UfCard>
          ))}
        </div>
      </section>

      <section className="section accessibility" aria-labelledby="accessibility-title">
        <h2 id="accessibility-title" className="section__title">
          Accessible by default
        </h2>
        <p className="accessibility__lead">
          Accessibility isn't an option you turn on. It's built into every component, so what you ship works for
          everyone, without extra ARIA in your code.
        </p>
        <ul className="accessibility__list">
          {accessibility.map((item) => (
            <li key={item.title} className="accessibility__item">
              <UfCard variant="outline" className="accessibility__card">
                <div slot="header" className="accessibility__header">
                  <UfIcon className="accessibility__icon" name="check" />
                  <h3 className="accessibility__title">{item.title}</h3>
                </div>
                <p className="accessibility__text">{item.text}</p>
              </UfCard>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="section__title">Try it</h2>
        <div className="demo">
          <form
            className="demo__preview demo__preview--stack"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const fields = [...e.currentTarget.querySelectorAll<HTMLElement & { reportValidity(): boolean }>('[name]')];
              if (fields.map((f) => f.reportValidity()).every(Boolean)) toast('Account created', { variant: 'success', title: 'Welcome!' });
            }}
          >
            <UfInput name="email" type="email" label="Email" placeholder="you@example.com" required />
            <UfCombobox name="zone" label="Time zone" placeholder="Search time zones" required>
              <option value="Europe/Rome">Rome</option>
              <option value="Europe/London">London</option>
              <option value="America/New_York">New York</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </UfCombobox>
            <UfSwitch name="updates" checked>
              Product updates
            </UfSwitch>
            <UfCheckbox name="terms" required>
              I accept the terms
            </UfCheckbox>
            <div>
              <UfButton type="submit">Create account</UfButton>
            </div>
          </form>
          <CodeBlock
            samples={[
              {
                label: 'HTML',
                code: `<form>
  <uf-input name="email" type="email" label="Email" required></uf-input>
  <uf-combobox name="zone" label="Time zone" required>
    <option value="Europe/Rome">Rome</option>
    …
  </uf-combobox>
  <uf-switch name="updates" checked>Product updates</uf-switch>
  <uf-checkbox name="terms" required>I accept the terms</uf-checkbox>
  <uf-button type="submit">Create account</uf-button>
</form>`,
              },
              {
                label: 'React',
                code: `<form onSubmit={createAccount}>
  <UfInput name="email" type="email" label="Email" required />
  <UfCombobox name="zone" label="Time zone" required>
    <option value="Europe/Rome">Rome</option>
    …
  </UfCombobox>
  <UfSwitch name="updates" checked>Product updates</UfSwitch>
  <UfCheckbox name="terms" required>I accept the terms</UfCheckbox>
  <UfButton type="submit">Create account</UfButton>
</form>`,
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">{pages.length} components, and counting</h2>
        <ComponentCards />
      </section>
    </>
  );
}
