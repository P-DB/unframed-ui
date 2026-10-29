import { toast } from '@unframed/core';
import { UfAlert, UfAvatar, UfBadge, UfButton, UfCard, UfCheckbox, UfCombobox, UfDatePicker, UfIcon, UfInput, UfProgress, UfSwitch } from '@unframed/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CodeBlock } from '../components/CodeBlock';
import { ComponentCards } from '../components/LinkCards';
import { storybookUrl } from '../links';
import { version } from '../../../../packages/core/package.json';

const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'plain HTML'];
const changelog = 'https://github.com/P-DB/unframed-ui/blob/main/packages/core/CHANGELOG.md';
const checks = ['WCAG AA contrast', 'Keyboard', 'Screen readers', 'Tested with axe'];

/** Cycles through the framework names, or stays on "any framework" for people who asked for less motion. */
function useFramework(): string {
  const [index, setIndex] = useState(0);
  const [still, setStill] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setStill(query.matches);
    query.addEventListener('change', onChange);
    if (still) return () => query.removeEventListener('change', onChange);
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % frameworks.length), 2200);
    return () => {
      window.clearInterval(timer);
      query.removeEventListener('change', onChange);
    };
  }, [still]);
  return still ? 'any framework' : frameworks[index];
}

/**
 * The rotating framework name, in a component of its own: it re-renders every
 * 2.2 seconds, and re-rendering the page would reset the showcase's fields.
 */
function FrameworkName() {
  const framework = useFramework();
  return (
    <span key={framework} className="hero__framework">
      {framework}
    </span>
  );
}

/** Two weeks from today, as YYYY-MM-DD, so the example date stays current. */
const dueDate = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);

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

type Field = HTMLElement & { value: string; setCustomValidity(message: string): void; reportValidity(): boolean };

const jokes = [
  "I'd tell you a joke about z-index, but it would end up behind everything.",
  'No divs were harmed in the making of this toast.',
  "This toast doesn't care about your framework. It barely cares about breakfast.",
  'Why did the button see a therapist? Too many issues with its borders.',
  'Fun fact: this toast is fully accessible. Your inbox, sadly, is not.',
  'A CSS selector walks into a bar. The bar is now red.',
];

/**
 * The showcase's greeting form. The name is only checked on submit, with a short
 * message, and the error clears as you type. The switch adds a joke to the toast.
 */
function Greeting() {
  return (
    <form
      className="showcase__stack"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const name = form.querySelector<Field>('[name="name"]')!;
        const joke = form.querySelector<HTMLElement & { checked: boolean }>('[name="joke"]')!.checked;
        name.setCustomValidity(name.value.trim() ? '' : 'Tell us your name first');
        if (!name.reportValidity()) return;
        const message = joke ? `Have a great day. ${jokes[Math.floor(Math.random() * jokes.length)]}` : 'Have a great day.';
        // Long enough to read the joke: the default 5 seconds is short for two sentences.
        toast(message, { variant: 'accent', title: `Hi, ${name.value.trim()}! 👋`, duration: 10000 });
      }}
    >
      <UfInput
        name="name"
        label="Your name"
        autocomplete="name"
        placeholder="John Smith"
        onInput={(e) => (e.currentTarget as unknown as Field).setCustomValidity('')}
      />
      <UfSwitch name="joke" defaultChecked>
        Add a joke
      </UfSwitch>
      <UfButton type="submit">Greet me</UfButton>
    </form>
  );
}

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <a className="hero__eyebrow" href={changelog} target="_blank" rel="noreferrer">
            <UfBadge variant="accent" size="sm">
              v{version}
            </UfBadge>
            What's new in Unframed
            <UfIcon name="chevron-right" />
          </a>
          <h1 className="hero__title">
            <span className="visually-hidden">UI components for React, Vue, Angular, Svelte and plain HTML.</span>
            <span aria-hidden="true">
              UI components for
              <br />
              <FrameworkName />
            </span>
          </h1>
          <p className="lead lead--hero">
            Accessible, themeable web components that don’t care about your framework. Use them anywhere, and own the
            code when you want to.
          </p>
          <div className="hero__actions">
            <UfButton size="lg" onClick={() => navigate('/docs/getting-started')}>
              Get started
            </UfButton>
            <UfButton size="lg" variant="outline" href={storybookUrl} target="_blank">
              Open Storybook
              <UfIcon slot="suffix" name="chevron-right" />
            </UfButton>
          </div>
          <UfButton variant="link" className="hero__browse" onClick={() => navigate('/components')}>
            Browse all components
            <UfIcon slot="suffix" name="chevron-right" />
          </UfButton>
          <ul className="hero__checks" aria-label="Accessible by default">
            {checks.map((check) => (
              <li key={check}>
                <UfIcon name="check" />
                {check}
              </li>
            ))}
          </ul>
        </div>

        {/* Real components, spilling out of a frame like the logo's piece out of its box. */}
        <div className="showcase" aria-label="A few Unframed components" role="group">
          <div className="showcase__frame" aria-hidden="true" />
          <UfBadge variant="accent" className="showcase__frame-label" aria-hidden="true">
            &lt;your-app&gt;
          </UfBadge>
          <UfCard appearance="elevated" className="showcase__item showcase__signup">
            <strong slot="header">How’s your day going?</strong>
            <Greeting />
          </UfCard>
          <UfCard appearance="elevated" className="showcase__item showcase__invoice">
            <div className="showcase__row">
              <UfAvatar name="John Smith" size="sm" />
              <span className="showcase__name">
                <strong>INV-1042</strong>
                <span>John Smith</span>
              </span>
              <UfBadge variant="success">Paid</UfBadge>
            </div>
            <UfProgress label="Monthly budget" value={72} showValue size="sm" />
          </UfCard>
          <UfCard appearance="elevated" className="showcase__item showcase__date">
            <UfDatePicker label="Due date" defaultValue={dueDate} />
          </UfCard>
          <UfAlert variant="success" heading="Changes saved" className="showcase__item showcase__alert">
            Invoice sent to John Smith.
          </UfAlert>
        </div>
      </section>

      <section className="section">
        <div className="features">
          {features.map((f) => (
            <UfCard key={f.title} appearance="elevated" className="feature">
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
              <UfCard appearance="outline" className="accessibility__card">
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
        <div className="demo demo--split">
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
            <UfSwitch name="updates" defaultChecked>
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
        <h2 className="section__title">All components</h2>
        <ComponentCards />
      </section>
    </>
  );
}
