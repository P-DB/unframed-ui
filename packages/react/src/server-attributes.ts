import * as React from 'react';

/** Each element property, by prop name: its attribute, or `null` when it has none. */
export type ServerAttributes = Record<string, string | null>;

/**
 * Server-side rendering (Next.js, Remix…) for a wrapper made with
 * `createComponent`, which sets props as properties in the browser and so
 * renders bare tags on the server. On the server, this renders the props as
 * the element's attributes instead: strings and numbers as values, `true` as
 * an empty attribute. Objects, functions and event handlers are left to the
 * browser. With the attributes in the HTML, elements start right when their
 * code loads, before React hydrates: tabs match their panels, selects show
 * their value. In the browser it returns the wrapper unchanged.
 *
 * @internal Used by the generated wrappers.
 */
export function withServerAttributes<C>(component: C, tagName: string, attributes: ServerAttributes): C {
  if (typeof window !== 'undefined') return component;

  const server = (props: Record<string, unknown>) => {
    const rendered: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(props)) {
      if (key in attributes) {
        const attribute = attributes[key];
        if (attribute === null || value == null || value === false) continue;
        if (value === true) rendered[attribute] = '';
        else if (typeof value === 'string' || typeof value === 'number') rendered[attribute] = String(value);
      } else if (key !== 'ref' && !/^on[A-Z]/.test(key)) {
        // children, slot, id, className, style, data-* and aria-*.
        rendered[key] = value;
      }
    }
    return React.createElement(tagName, rendered);
  };
  server.displayName = (component as { displayName?: string }).displayName;
  return server as C;
}
