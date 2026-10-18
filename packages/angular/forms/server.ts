import { inject, PLATFORM_ID } from '@angular/core';

/** Whether the component is rendering on the server (Angular SSR). */
export const onServer = (): boolean => inject(PLATFORM_ID) === 'server';

/**
 * Server rendering: inputs set the element's properties, which Angular's server
 * DOM keeps out of the HTML it sends. This writes the matching attribute too,
 * so the page arrives with `disabled`, `value`… already set, and each element
 * starts right when its code loads.
 *
 * @internal Used by the generated components and the form directives.
 */
export function reflectOnServer(el: Element, attribute: string, value: unknown): void {
  if (value == null || value === false) el.removeAttribute(attribute);
  else if (value === true || value === '') el.setAttribute(attribute, '');
  else if (typeof value === 'string' || typeof value === 'number') el.setAttribute(attribute, String(value));
}
