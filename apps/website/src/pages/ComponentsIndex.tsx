import { ComponentCards } from '../components/LinkCards';

export function ComponentsIndex() {
  return (
    <>
      <h1>Components</h1>
      <p className="lead">
        Every component is a standard custom element: use it in any framework, style it with CSS custom properties and
        parts, and submit it with a native form.
      </p>
      <ComponentCards />
    </>
  );
}
