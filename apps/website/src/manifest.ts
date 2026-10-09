// The same custom-elements.json that drives IDE autocomplete, Storybook and the
// React wrappers: API tables on the site can't drift from the code.
import manifest from '../../../packages/core/custom-elements.json';

interface Described {
  name: string;
  description?: string;
  type?: { text: string };
  default?: string;
}

export interface ElementDoc {
  tagName: string;
  name: string;
  summary?: string;
  description?: string;
  attributes?: (Described & { fieldName?: string })[];
  members?: (Described & { kind: 'field' | 'method'; parameters?: Described[] })[];
  events?: Described[];
  slots?: Described[];
  cssParts?: Described[];
  cssProperties?: Described[];
  cssStates?: Described[];
}

type Module = { declarations?: (ElementDoc & { customElement?: boolean })[] };

const elements = new Map<string, ElementDoc>();
for (const mod of (manifest as { modules: Module[] }).modules) {
  for (const declaration of mod.declarations ?? []) {
    if (declaration.customElement && declaration.tagName) elements.set(declaration.tagName, declaration);
  }
}

export function getElement(tag: string): ElementDoc | undefined {
  return elements.get(tag);
}
