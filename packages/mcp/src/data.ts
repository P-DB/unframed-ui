import { readFileSync } from 'node:fs';

export interface ComponentData {
  /** Short name, e.g. date-picker. */
  name: string;
  title: string;
  summary: string;
  /** Every tag the component is made of, the main one first. */
  tags: string[];
  /** Module specifiers to import, e.g. @unframed/core/accordion. */
  imports: string[];
  /** The React, Vue and Angular components for its tags, e.g. UfTabs, UfTab, UfTabPanel. */
  wrappers: string[];
  /** Examples, imports in each framework and full API, as Markdown. */
  docs: string;
}

export interface ElementData {
  attributes: {
    name: string;
    boolean?: true;
    /** The values it accepts, when the type is a closed list of strings. */
    values?: string[];
  }[];
  /** Public properties, including those backed by an attribute. */
  properties: string[];
  events: string[];
  /** How it gets an accessible name: a label attribute it can't do without, one an icon-only button needs, or its content. */
  label?: 'required' | 'icon-only' | 'content';
  /** A form control: the Vue wrapper supports v-model, and v-model:<synced> for these properties. */
  model?: { synced: string[] };
}

export type Framework = 'html' | 'react' | 'vue' | 'angular';

export interface Data {
  version: string;
  /** How to install, set up and use Unframed in each framework, as Markdown. */
  frameworks: Record<Framework, string>;
  components: ComponentData[];
  /** Every custom element's API, keyed by tag. */
  elements: Record<string, ElementData>;
}

let cached: Data | undefined;

export function loadData(): Data {
  cached ??= JSON.parse(readFileSync(new URL('../data.json', import.meta.url), 'utf8')) as Data;
  return cached;
}
