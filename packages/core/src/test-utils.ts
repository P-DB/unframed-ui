import axe from 'axe-core';
import type { LitElement } from 'lit';

/** Renders markup into the body and waits for every Unframed element to render. */
export async function fixture<T extends Element = HTMLElement>(markup: string, selector?: string): Promise<T> {
  document.body.innerHTML = markup;
  await settle();
  return (selector ? document.querySelector(selector) : document.body.firstElementChild) as T;
}

/** Waits for all pending Lit updates in the document. */
export async function settle(): Promise<void> {
  const elements = [...document.querySelectorAll('*')].filter((el) => el.localName.startsWith('uf-'));
  await Promise.all(elements.map((el) => (el as LitElement).updateComplete));
}

/** Returns the ids of axe violations in the document body. */
export async function axeViolations(): Promise<string[]> {
  const results = await axe.run(document.body);
  return results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

/** Types into a native input or textarea and fires `input`, like a user would. */
export function typeInto(control: HTMLInputElement | HTMLTextAreaElement, text: string): void {
  control.value = text;
  control.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
}

/** Commits a native control's value, firing `change` like a blur would. */
export function commit(control: HTMLElement): void {
  control.dispatchEvent(new Event('change', { bubbles: true }));
}

/** Dispatches a keydown on an element. */
export function press(target: EventTarget, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, composed: true }));
}

export const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
