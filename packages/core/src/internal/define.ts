/**
 * Registers a custom element unless the tag is already taken, so loading the
 * library twice (e.g. two micro-frontends) doesn't throw.
 */
export function defineElement(tagName: string, ctor: CustomElementConstructor): void {
  if (!customElements.get(tagName)) customElements.define(tagName, ctor);
}
