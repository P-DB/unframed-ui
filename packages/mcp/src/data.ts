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
  /** Examples and full API, as Markdown. */
  docs: string;
}

export interface Data {
  version: string;
  components: ComponentData[];
}

let cached: Data | undefined;

export function loadData(): Data {
  cached ??= JSON.parse(readFileSync(new URL('../data.json', import.meta.url), 'utf8')) as Data;
  return cached;
}
