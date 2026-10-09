import { Link } from 'react-router';
import { pages } from '../demos';
import { getElement } from '../manifest';

export function ComponentsIndex() {
  return (
    <>
      <h1>Components</h1>
      <p className="lead">
        Every component is a standard custom element: use it in any framework, style it with CSS custom properties and
        parts, and submit it with a native form.
      </p>
      <div className="cards">
        {pages.map((page) => (
          <Link key={page.slug} to={`/components/${page.slug}`} className="card">
            <strong>{page.title}</strong>
            <span>{getElement(page.tags[0])?.summary}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
