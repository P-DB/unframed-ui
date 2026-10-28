import { UfCard } from '@unframed/react';
import { Link } from 'react-router';
import { pages } from '../demos';
import { getElement } from '../manifest';

/** A filled card that links to another page of the docs. */
export function LinkCard({ to, title, text }: { to: string; title: string; text?: string }) {
  return (
    <Link to={to} className="link-card">
      <UfCard appearance="filled" className="link-card__card">
        <strong className="link-card__title">{title}</strong>
        <span className="link-card__text">{text}</span>
      </UfCard>
    </Link>
  );
}

/** A card for each component, used on the home page and the components overview. */
export function ComponentCards() {
  return (
    <div className="card-grid">
      {pages.map((page) => (
        <LinkCard key={page.slug} to={`/components/${page.slug}`} title={page.title} text={getElement(page.tags[0])?.summary} />
      ))}
    </div>
  );
}

const frameworkGuides = [
  ['/docs/frameworks/html', 'HTML & JavaScript', 'Plain HTML, Svelte, Solid, Astro… or straight from a CDN.'],
  ['/docs/frameworks/react', 'React', 'Typed components and camelCase event handlers.'],
  ['/docs/frameworks/vue', 'Vue', 'Typed components with v-model on every form control.'],
  ['/docs/frameworks/angular', 'Angular', 'Standalone components and Angular forms support.'],
];

/** A card for each framework guide. */
export function FrameworkCards() {
  return (
    <div className="card-grid">
      {frameworkGuides.map(([to, title, text]) => (
        <LinkCard key={to} to={to} title={title} text={text} />
      ))}
    </div>
  );
}

/** Where to go after a framework guide. */
export function NextSteps() {
  return (
    <div className="card-grid">
      <LinkCard to="/components" title="Browse the components" text="Every component, with live examples and its full API." />
      <LinkCard to="/docs/theming" title="Change the look" text="Tokens, component properties and CSS parts." />
    </div>
  );
}
