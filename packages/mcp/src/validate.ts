import type { Data, ElementData } from './data.js';

export interface Problem {
  severity: 'error' | 'warning';
  line: number;
  /** The tag as written, e.g. uf-button or UfButton, or the module of an import, e.g. @unframed/react. */
  tag: string;
  message: string;
}

export interface Report {
  /** Unframed elements found in the code, in order. */
  elements: string[];
  problems: Problem[];
}

interface Attr {
  /** As written, e.g. :value, (uf-sort), onChange. */
  raw: string;
  /** Static text, a bound expression, or no value at all. */
  value?: { kind: 'static'; text: string } | { kind: 'expression' };
  line: number;
}

interface Element {
  /** As written: uf-button, or UfButton for a React or Vue wrapper. */
  written: string;
  /** Always the custom element's tag, e.g. uf-button. */
  tag: string;
  /** A framework wrapper (UfButton) rather than the custom element itself. */
  wrapper: boolean;
  attrs: Attr[];
  /** Markup between the opening and closing tag. */
  content: string;
  line: number;
}

// --- Parsing -----------------------------------------------------------------

const TAG = /<(uf-[a-z0-9-]+|Uf[A-Z][A-Za-z0-9]*)(?=[\s/>])/g;

const kebab = (name: string) => name.replace(/[A-Z]/g, (c, i: number) => (i ? '-' : '') + c.toLowerCase());

/**
 * Finds every Unframed element in HTML, JSX, Vue, Angular, Svelte or Lit
 * markup. Only <uf-*> tags and Uf* React components are read; quotes and
 * {…} expressions are skipped as a whole, so `=>` or `>` inside them is safe.
 */
export function parse(code: string): Element[] {
  const lineAt = (index: number) => code.slice(0, index).split('\n').length;
  const elements: Element[] = [];

  for (const match of code.matchAll(TAG)) {
    const written = match[1]!;
    let i = match.index + match[0].length;
    const attrs: Attr[] = [];
    let selfClosing = false;

    /** Skips a quoted string or a balanced {…} starting at i; returns the index after it. */
    const skip = (from: number): number => {
      const open = code[from];
      if (open === '"' || open === "'" || open === '`') {
        const end = code.indexOf(open, from + 1);
        return end === -1 ? code.length : end + 1;
      }
      let depth = 0;
      for (let j = from; j < code.length; j++) {
        const c = code[j];
        if (c === '"' || c === "'" || c === '`') j = skip(j) - 1;
        else if (c === '{') depth++;
        else if (c === '}' && --depth === 0) return j + 1;
      }
      return code.length;
    };

    while (i < code.length) {
      while (/\s/.test(code[i] ?? '')) i++;
      if (code.startsWith('/>', i)) {
        selfClosing = true;
        i += 2;
        break;
      }
      if (code[i] === '>' || i >= code.length) {
        i++;
        break;
      }
      if (code[i] === '{') {
        // A JSX spread, {...props}: nothing to check.
        i = skip(i);
        continue;
      }
      const start = i;
      while (i < code.length && !/[\s=>]/.test(code[i]!) && !code.startsWith('/>', i)) i++;
      const attr: Attr = { raw: code.slice(start, i), line: lineAt(start) };
      if (code[i] === '=') {
        i++;
        const valueStart = i;
        if (code[i] === '{') {
          i = skip(i);
          attr.value = { kind: 'expression' };
        } else if (code[i] === '"' || code[i] === "'") {
          i = skip(i);
          attr.value = { kind: 'static', text: code.slice(valueStart + 1, i - 1) };
        } else {
          while (i < code.length && !/[\s>]/.test(code[i]!)) i++;
          attr.value = { kind: 'static', text: code.slice(valueStart, i) };
        }
      }
      if (attr.raw) attrs.push(attr);
      else i++;
    }

    elements.push({
      written,
      tag: written.startsWith('Uf') ? kebab(written) : written,
      wrapper: written.startsWith('Uf'),
      attrs,
      content: selfClosing ? '' : contentOf(code, written, i),
      line: lineAt(match.index),
    });
  }
  return elements;
}

/** The markup from `from` to the matching closing tag, counting nested tags of the same name. */
function contentOf(code: string, written: string, from: number): string {
  const tags = new RegExp(`<(/?)${written}(?=[\\s/>])`, 'g');
  tags.lastIndex = from;
  let depth = 1;
  for (const m of code.matchAll(tags)) {
    if (m.index < from) continue;
    depth += m[1] ? -1 : 1;
    if (depth === 0) return code.slice(from, m.index);
  }
  return code.slice(from);
}

// --- What each attribute means ------------------------------------------------

// `bound`: the value is an expression (:x="a", [x]="a"), not text to check.
type Meaning =
  | { kind: 'attribute'; name: string; bound?: boolean }
  | { kind: 'property'; name: string; bound?: boolean }
  | { kind: 'event'; name: string }
  | { kind: 'ignore' };

const withoutModifiers = (name: string) => name.split('.')[0]!;
const camel = (name: string) => name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/** Reads an attribute as an attribute, a property binding or an event listener, in any framework's syntax. */
function meaning(attr: Attr, element: Element): Meaning {
  const raw = attr.raw;
  let m: RegExpMatchArray | null;
  // Angular: [(x)], [x], [attr.x], [class.x], (x), *ngIf, #ref
  if ((m = raw.match(/^\[\((.+)\)\]$/))) return m[1] === 'ngModel' ? { kind: 'ignore' } : { kind: 'property', name: m[1]!, bound: true };
  if ((m = raw.match(/^\[(.+)\]$/))) {
    if (m[1]!.startsWith('attr.')) return { kind: 'attribute', name: m[1]!.slice(5), bound: true };
    if (/^(class|style)\./.test(m[1]!)) return { kind: 'ignore' };
    return { kind: 'property', name: m[1]!, bound: true };
  }
  if ((m = raw.match(/^\((.+)\)$/))) return { kind: 'event', name: withoutModifiers(m[1]!) };
  if (/^[*#]/.test(raw)) return { kind: 'ignore' };
  // Vue: :x, v-bind:x, @x, v-on:x, v-model:x, other directives. Lit's @x is the same.
  if ((m = raw.match(/^(?::|v-bind:)(.+)$/))) {
    const [name, ...mods] = m[1]!.split('.');
    if (name === 'key' || name === 'ref') return { kind: 'ignore' };
    return mods.includes('attr') ? { kind: 'attribute', name: name!, bound: true } : { kind: 'property', name: name!, bound: true };
  }
  if ((m = raw.match(/^(?:@|v-on:)(.+)$/))) return { kind: 'event', name: withoutModifiers(m[1]!) };
  if ((m = raw.match(/^v-model:(.+)$/))) return { kind: 'property', name: withoutModifiers(m[1]!), bound: true };
  if (raw.startsWith('v-')) return { kind: 'ignore' };
  // Lit: .x property, ?x boolean attribute
  if ((m = raw.match(/^\.(.+)$/))) return { kind: 'property', name: m[1]!, bound: true };
  if ((m = raw.match(/^\?(.+)$/))) return { kind: 'attribute', name: m[1]!, bound: true };
  // Svelte: on:x, bind:x, class:x, use:x
  if ((m = raw.match(/^on:(.+)$/))) return { kind: 'event', name: withoutModifiers(m[1]!.split('|')[0]!) };
  if ((m = raw.match(/^bind:(.+)$/))) return m[1] === 'this' ? { kind: 'ignore' } : { kind: 'property', name: m[1]!, bound: true };
  if (/^(class|use|style|transition|in|out|animate):/.test(raw)) return { kind: 'ignore' };
  // JSX
  if (['key', 'ref', 'children', 'className', 'htmlFor', 'dangerouslySetInnerHTML', 'suppressHydrationWarning'].includes(raw)) return { kind: 'ignore' };
  if ((m = raw.match(/^on([A-Z]\w*)$/))) {
    // A React wrapper maps onUfPageChange to uf-page-change. On a plain <uf-*> tag in
    // JSX, React's own handling applies, so it isn't checked.
    return element.wrapper ? { kind: 'event', name: kebab(m[1]!) } : { kind: 'ignore' };
  }
  if (attr.value?.kind === 'expression') return { kind: 'property', name: raw, bound: true };
  if (element.wrapper) return { kind: 'property', name: raw };
  return { kind: 'attribute', name: raw };
}

// Attributes and properties every HTML element has.
const GLOBAL_ATTRIBUTES = new Set([
  'id', 'class', 'style', 'slot', 'part', 'exportparts', 'hidden', 'title', 'lang', 'dir', 'tabindex', 'role',
  'inert', 'autofocus', 'translate', 'draggable', 'accesskey', 'nonce', 'popover', 'is', 'name',
]);
const GLOBAL_PROPERTIES = new Set(['id', 'hidden', 'title', 'lang', 'dir', 'tabIndex', 'slot', 'style', 'class', 'textContent', 'innerHTML', 'inert']);

// Events from the browser that bubble to, or fire on, any element. Not toggle (only
// <details> and popovers fire it) or submit and reset (they fire on the form).
const DOM_EVENTS = new Set([
  'click', 'dblclick', 'contextmenu', 'auxclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave',
  'mousemove', 'pointerdown', 'pointerup', 'pointermove', 'pointerover', 'pointerout', 'pointerenter', 'pointerleave',
  'pointercancel', 'keydown', 'keyup', 'keypress', 'focus', 'blur', 'focusin', 'focusout', 'input', 'change', 'invalid', 'wheel', 'scroll', 'touchstart', 'touchend', 'touchmove', 'touchcancel', 'dragstart', 'drag',
  'dragend', 'dragenter', 'dragleave', 'dragover', 'drop', 'copy', 'cut', 'paste', 'animationstart', 'animationend',
  'transitionend',
]);

// --- Checks ------------------------------------------------------------------

/** Edit distance, for "did you mean" suggestions. */
function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j]!;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length]!;
}

function closest(input: string, options: Iterable<string>): string | undefined {
  let best: string | undefined;
  let bestDistance = Infinity;
  for (const option of options) {
    const d = distance(input.toLowerCase(), option.toLowerCase());
    if (d < bestDistance) [best, bestDistance] = [option, d];
  }
  return best !== undefined && bestDistance <= Math.max(2, Math.floor(input.length / 2)) ? best : undefined;
}

const didYouMean = (input: string, options: Iterable<string>) => {
  const match = closest(input, options);
  return match ? ` Did you mean "${match}"?` : '';
};

const quoteList = (items: string[]) => items.map((i) => `"${i}"`).join(', ');

/** Text left once tags and comments are removed; {expressions} count as text. */
const visibleText = (markup: string) => markup.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, '').trim();

function checkElement(element: Element, api: ElementData, problems: Problem[]) {
  const report = (severity: Problem['severity'], line: number, message: string) => problems.push({ severity, line, tag: element.written, message });
  const attributes = new Map(api.attributes.map((a) => [a.name, a]));
  const properties = new Set(api.properties);
  let labelled = false;

  for (const attr of element.attrs) {
    const m = meaning(attr, element);
    if (m.kind === 'ignore') continue;

    if (m.kind === 'event') {
      if (api.events.includes(m.name) || DOM_EVENTS.has(m.name)) continue;
      // v-model, written out: @update:model-value, or @update:<synced> for v-model:<synced>.
      if (api.model && /^update:/.test(m.name) && ['modelValue', ...api.model.synced].includes(camel(m.name.slice(7)))) continue;
      report(
        'error',
        attr.line,
        `"${attr.raw}" listens for a "${m.name}" event, which <${element.tag}> never fires.` +
          (api.events.length ? ` Its events are ${quoteList(api.events)}.` : ' It fires no events of its own.') +
          didYouMean(m.name, api.events),
      );
      continue;
    }

    const name = m.kind === 'attribute' ? m.name.toLowerCase() : m.name;
    if (name === 'label') labelled = true;
    if (name === 'aria-label' || name === 'aria-labelledby') {
      labelled = true;
      if (attributes.has('label')) report('warning', attr.line, `Use label instead of ${name}: <${element.tag}> puts its label where assistive technology reads it.`);
      continue;
    }
    if (name.startsWith('aria-') || name.startsWith('data-')) continue;

    if (m.kind === 'attribute') {
      const known = attributes.get(name);
      if (!known) {
        if (GLOBAL_ATTRIBUTES.has(name)) continue;
        if (properties.has(m.name)) {
          report('warning', attr.line, `"${m.name}" is a property of <${element.tag}>, not an attribute: set it from JavaScript or with your framework's property binding.`);
        } else {
          report('error', attr.line, `<${element.tag}> has no "${m.name}" attribute.${didYouMean(m.name, attributes.keys())}`);
        }
        continue;
      }
      if (attr.value?.kind !== 'static' || m.bound) continue;
      const text = attr.value.text;
      if (known.boolean && text === 'false') {
        report('error', attr.line, `${name}="false" still turns ${name} on: a boolean attribute is on whenever it's present. Remove it, or bind it to false.`);
      } else if (known.values && !known.values.includes(text)) {
        report('error', attr.line, `${name}="${text}" isn't a valid value. Use one of ${quoteList(known.values)}.${didYouMean(text, known.values)}`);
      }
      continue;
    }

    // A property binding: the property, or an attribute of the same name, both work.
    // Vue templates may write it in kebab case (:sort-direction), and v-model in full (:model-value).
    const known = [m.name, camel(m.name)].some(
      (n) => properties.has(n) || attributes.has(n) || GLOBAL_PROPERTIES.has(n) || GLOBAL_ATTRIBUTES.has(n) || (api.model && n === 'modelValue'),
    );
    if (known) {
      if (attr.value?.kind === 'static' && !m.bound) {
        const known = attributes.get(m.name);
        if (known?.values && !known.values.includes(attr.value.text)) {
          report('error', attr.line, `${m.name}="${attr.value.text}" isn't a valid value. Use one of ${quoteList(known.values)}.${didYouMean(attr.value.text, known.values)}`);
        }
      }
      continue;
    }
    report('error', attr.line, `<${element.tag}> has no "${m.name}" property.${didYouMean(m.name, [...properties, ...attributes.keys()])}`);
  }

  const text = visibleText(element.content);
  if (api.label === 'required' && !labelled) {
    report('error', element.line, `<${element.tag}> needs a label: add label="…" so assistive technology can name it. Visible text next to it isn't enough.`);
  } else if (api.label === 'icon-only' && !labelled && !text) {
    report('error', element.line, /<(uf-icon|UfIcon)\b/.test(element.content)
      ? `This <${element.tag}> only holds an icon: add label="…" so assistive technology can name it.`
      : `This <${element.tag}> has no text: add some content, or label="…".`);
  } else if (api.label === 'content' && !labelled && !text) {
    report('error', element.line, `<${element.tag}> takes its label as content, and this one is empty: put the label between the tags.`);
  }
}

// --- Imports -----------------------------------------------------------------

const IMPORT = /\bimport\s+(?:(type)\s+)?(?:([^'";]*?)\s*from\s*)?['"](@unframed\/(?:react|vue|angular)(?:\/[^'"]*)?)['"]/g;

/** The names an import brings in, without type-only ones: `{ UfButton, type X, UfInput as Input }` → UfButton, UfInput. */
function importedNames(clause: string): string[] {
  const braces = /\{([^}]*)\}/.exec(clause)?.[1] ?? '';
  return braces
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part && !part.startsWith('type '))
    .map((part) => part.split(/\s+as\s+/)[0]!.trim());
}

/**
 * Imports from the framework packages that don't exist: subpaths of @unframed/react
 * and @unframed/vue (they have one entry point), unknown Angular entries, and
 * component names without the Uf prefix or misspelled.
 */
function checkImports(data: Data, code: string, problems: Problem[]): void {
  const wrappers = new Set(data.components.flatMap((c) => c.wrappers));
  const entries = new Set(data.components.flatMap((c) => c.imports).map((p) => p.replace('@unframed/core/', '')));
  const lineAt = (index: number) => code.slice(0, index).split('\n').length;
  for (const match of code.matchAll(IMPORT)) {
    const [, typeOnly, clause = '', specifier] = match;
    const [, pkg, sub] = /^@unframed\/(react|vue|angular)(?:\/(.*))?$/.exec(specifier!)!;
    const line = lineAt(match.index);
    const names = typeOnly ? [] : importedNames(clause);
    const report = (message: string) => problems.push({ severity: 'error', line, tag: specifier!, message });

    if (sub !== undefined && pkg !== 'angular') {
      const list = names.length ? names.join(', ') : 'UfButton';
      report(`@unframed/${pkg} has one entry point, without subpaths: \`import { ${list} } from '@unframed/${pkg}';\``);
      continue;
    }
    if (sub !== undefined && !entries.has(sub)) {
      const match = closest(sub, entries);
      report(`There is no Angular entry "${sub}".${match ? ` Did you mean '@unframed/angular/${match}'?` : ''} Entries are named like the core ones: list_components shows them.`);
      continue;
    }
    for (const name of names) {
      if (wrappers.has(name)) continue;
      const unprefixed = wrappers.has(`Uf${name}`);
      // Other exports (types, createWrapper, UNFRAMED, Angular's Uf…ValueAccessor directives) are left to the compiler:
      // only names without the Uf prefix, and misspelled components in React and Vue, are flagged.
      if (!unprefixed && (pkg === 'angular' || !/^Uf[A-Z]/.test(name))) continue;
      const suggestion = unprefixed ? `Uf${name}` : closest(name, wrappers);
      report(`${specifier} has no component ${name}.${suggestion ? ` Did you mean ${suggestion}?` : ''} Call list_components to see every component.`);
    }
  }
}

/** Checks every Unframed element in the code against the library's API and labelling rules, and its imports. */
export function validate(data: Data, code: string): Report {
  const elements = parse(code);
  const problems: Problem[] = [];
  checkImports(data, code, problems);
  for (const element of elements) {
    const api = data.elements[element.tag];
    if (!api) {
      const suggestion = closest(element.tag, Object.keys(data.elements));
      problems.push({
        severity: 'error',
        line: element.line,
        tag: element.written,
        message:
          `<${element.tag}> isn't an Unframed element.` +
          (suggestion ? ` Did you mean <${suggestion}>?` : '') +
          ' Call list_components to see every component.',
      });
      continue;
    }
    checkElement(element, api, problems);
  }
  problems.sort((a, b) => a.line - b.line);
  return { elements: elements.map((e) => e.written), problems };
}

/** The report as text for the agent: what's wrong, where, and how to fix it. */
export function formatReport(report: Report): string {
  const count = report.elements.length;
  if (!count && !report.problems.length) {
    return 'No Unframed elements found. validate_usage checks <uf-*> tags and the React wrappers, like <UfButton>.';
  }
  const found = `${count} Unframed element${count === 1 ? '' : 's'}`;
  if (!report.problems.length) {
    return `No problems found in ${found}. Checked: tags, attributes and their values, events, labels and imports. It doesn't run the code.`;
  }
  const errors = report.problems.filter((p) => p.severity === 'error').length;
  const warnings = report.problems.length - errors;
  const summary = [errors && `${errors} error${errors === 1 ? '' : 's'}`, warnings && `${warnings} warning${warnings === 1 ? '' : 's'}`]
    .filter(Boolean)
    .join(' and ');
  return [
    `Found ${summary} in ${found}. Fix the errors, then call validate_usage again.`,
    '',
    ...report.problems.map((p, i) => `${i + 1}. ${p.severity}, line ${p.line}, ${p.tag.startsWith('@') ? p.tag : `<${p.tag}>`}: ${p.message}`),
  ].join('\n');
}
