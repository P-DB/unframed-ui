import { toast } from '@unframed/core';
import { UfButton, UfCheckbox, UfCombobox, UfIcon, UfInput, UfSwitch } from '@unframed/react';
import { useNavigate } from 'react-router';
import { CodeBlock } from '../components/CodeBlock';
import { pages } from '../demos';
import { getElement } from '../manifest';

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
    icon: 'info',
    title: 'Accessible and form-ready',
    text: 'WAI-ARIA patterns, keyboard support, axe-tested. Every control submits, resets and validates like a native one.',
  },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <h1>
          UI components that <em>don’t care</em> about your framework.
        </h1>
        <p className="lead">
          Unframed is a library of accessible, themeable web components. Use them anywhere, and own them when you want to.
        </p>
        <div className="hero-actions">
          <UfButton size="lg" onClick={() => navigate('/docs/getting-started')}>
            Get started
          </UfButton>
          <UfButton size="lg" variant="outline" onClick={() => navigate('/components')}>
            Browse components
          </UfButton>
        </div>
      </section>

      <section className="section">
        <div className="features">
          {features.map((f) => (
            <div key={f.title} className="feature">
              <UfIcon name={f.icon} />
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 style={{ marginTop: 0 }}>Try it</h2>
        <div className="demo">
          <form
            className="demo-preview stack"
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
        <h2 style={{ marginTop: 0 }}>{pages.length} components, and counting</h2>
        <div className="cards">
          {pages.map((page) => (
            <a key={page.slug} href={`/components/${page.slug}`} className="card" onClick={(e) => { e.preventDefault(); navigate(`/components/${page.slug}`); }}>
              <strong>{page.title}</strong>
              <span>{getElement(page.tags[0])?.summary}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
