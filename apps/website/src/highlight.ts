import type { HighlighterCore, ThemedToken, ThemeRegistration } from 'shiki/core';

export type Lang = 'html' | 'tsx' | 'vue' | 'angular-html' | 'angular-ts' | 'typescript' | 'javascript' | 'css' | 'bash';

let highlighter: Promise<HighlighterCore> | undefined;

const v = (name: string) => `var(--code-${name})`;

/**
 * Colors are CSS variables (defined in styles.css for light and dark), so the
 * highlighting follows the site theme. Finer-grained than Shiki's built-in
 * CSS-variables theme, which colors tag names and strings the same.
 */
const theme: ThemeRegistration = {
  name: 'unframed',
  type: 'light',
  colors: { 'editor.foreground': v('fg'), 'editor.background': v('bg') },
  fg: v('fg'),
  bg: v('bg'),
  settings: [
    { settings: { foreground: v('fg') } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: v('comment'), fontStyle: 'italic' } },
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new', 'variable.language.this'],
      settings: { foreground: v('keyword') },
    },
    {
      scope: ['entity.name.tag', 'support.class.component', 'entity.name.type', 'entity.name.class', 'support.type', 'support.class'],
      settings: { foreground: v('tag') },
    },
    {
      scope: ['entity.other.attribute-name', 'meta.object-literal.key', 'support.type.property-name', 'variable.parameter'],
      settings: { foreground: v('attr') },
    },
    { scope: ['string', 'punctuation.definition.string', 'string.quoted', 'string.template'], settings: { foreground: v('string') } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name.function'], settings: { foreground: v('function') } },
    { scope: ['constant', 'constant.language', 'constant.numeric', 'constant.character.entity'], settings: { foreground: v('constant') } },
    {
      scope: [
        'punctuation',
        'punctuation.definition.tag',
        'punctuation.separator',
        'punctuation.section',
        'meta.brace',
        'keyword.operator',
        'keyword.operator.assignment',
      ],
      settings: { foreground: v('punct') },
    },
    // Code inside template expressions and JSX braces reads as code again.
    { scope: ['meta.embedded', 'source.js.embedded', 'meta.jsx.children'], settings: { foreground: v('fg') } },
  ],
};

/** Each grammar in its own chunk, loaded the first time a code block needs it. */
const grammars: Record<Lang, () => Promise<{ default: Parameters<HighlighterCore['loadLanguage']>[0] }>> = {
  html: () => import('shiki/langs/html.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  vue: () => import('shiki/langs/vue.mjs'),
  'angular-html': () => import('shiki/langs/angular-html.mjs'),
  'angular-ts': () => import('shiki/langs/angular-ts.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
};
const loading = new Map<Lang, Promise<void>>();

/**
 * Loads Shiki on first use, in its own chunk, with the JavaScript regex engine
 * (no WebAssembly). Grammars come later, one by one, as pages need them.
 */
function load(): Promise<HighlighterCore> {
  highlighter ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
    ]);
    return createHighlighterCore({ themes: [theme], langs: [], engine: createJavaScriptRegexEngine() });
  })();
  return highlighter;
}

/** Splits code into colored tokens, one array per line. */
export async function tokenize(code: string, lang: Lang): Promise<ThemedToken[][]> {
  const h = await load();
  if (!loading.has(lang)) loading.set(lang, grammars[lang]().then((grammar) => h.loadLanguage(grammar.default)));
  await loading.get(lang);
  return h.codeToTokens(code, { lang, theme: 'unframed' }).tokens;
}

/** Picks a grammar from a code tab's label and content. */
export function guessLang(label: string, code: string): Lang {
  switch (label) {
    case 'HTML':
      return 'html';
    case 'React':
      return 'tsx';
    case 'Vue':
      return code.includes('<template>') || code.trimStart().startsWith('<') ? 'vue' : 'typescript';
    case 'Angular':
      return /^\s*(import|@Component|\/\/|[a-z]+\(\))/.test(code) ? 'angular-ts' : 'angular-html';
    case 'CSS':
      return 'css';
    case 'Terminal':
    case 'Copy the source':
      return 'bash';
    default:
      return 'typescript';
  }
}
