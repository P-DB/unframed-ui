// Type-checks the code on the framework guides (src/pages/frameworks/snippets.ts)
// against the built packages, as a user would copy it: React and plain
// TypeScript with tsc, Vue with vue-tsc, Angular with ngc and strict templates.
// Markup is checked too: every attribute on a <uf-*> tag must be one the
// component documents. Run after `npm run build`.
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const website = new URL('../', import.meta.url);
const repo = new URL('../../', website);
const out = new URL('.snippets/', website);
const path = (url) => fileURLToPath(url);
const s = await import(new URL('src/pages/frameworks/snippets.ts', website).href);

rmSync(out, { recursive: true, force: true });
const write = (file, content) => {
  const target = path(new URL(file, out));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${content.trim()}\n`);
};

/** The import lines of a JavaScript snippet: its DOM code isn't typed, but what it imports must exist. */
const importsOf = (code) => code.split('\n').filter((line) => /^import\b/.test(line)).join('\n');

const failures = [];
const run = (label, command, args) => {
  const result = spawnSync(command, args, { cwd: path(out), encoding: 'utf8' });
  if (result.status !== 0) failures.push(`${label}\n${result.stdout}${result.stderr}`.trim());
  else console.log(`snippets: ${label} ok`);
};

const base = {
  extends: '../../../tsconfig.base.json',
  compilerOptions: { noEmit: true, declaration: false, declarationMap: false, noUnusedLocals: false, noUnusedParameters: false, types: ['vite/client'] },
};

// --- HTML & JavaScript, and React: tsc ---------------------------------------
write('html/imports.ts', `${importsOf(s.html.setup)}\n${importsOf(s.html.script)}\nexport {};`);
write('html/types.ts', `${s.html.types}\nexport { dialog, input };`);
write('react/main.ts', `${s.react.setup}\nexport {};`);
write('react/Signup.tsx', s.react.app);
write('react/Help.tsx', s.react.ref);
write('tsconfig.json', JSON.stringify({ ...base, compilerOptions: { ...base.compilerOptions, jsx: 'react-jsx' }, include: ['html', 'react'] }, null, 2));
run('HTML & React (tsc)', path(new URL('node_modules/.bin/tsc', repo)), ['-p', 'tsconfig.json']);

// --- Vue: vue-tsc ------------------------------------------------------------
write('vue/App.vue', s.vue.app);
write('vue/main.ts', s.vue.setup);
write('vue/plugin.ts', `import { createApp } from 'vue';\nimport App from './App.vue';\n${s.vue.plugin}`);
write('vue/vite.config.ts', s.vue.plainTags);
// @vitejs/plugin-vue isn't installed here; only the Unframed part of that snippet is checked.
write('vue/shims.d.ts', `declare module '@vitejs/plugin-vue' {\n  const vue: (options?: object) => import('vite').Plugin;\n  export default vue;\n}`);
write('tsconfig.vue.json', JSON.stringify({ ...base, compilerOptions: { ...base.compilerOptions, jsx: 'preserve' }, include: ['vue/**/*.ts', 'vue/**/*.vue'] }, null, 2));
run('Vue (vue-tsc)', process.execPath, [path(new URL('packages/vue/scripts/vue-tsc.cjs', repo)), '-p', 'tsconfig.vue.json']);

// --- Angular: ngc with strict templates --------------------------------------
write('angular/signup.component.ts', s.angular.component);
write('angular/signup.component.html', s.angular.template);
write('angular/settings.component.ts', s.angular.ngModel);
write('angular/help.component.ts', s.angular.methods);
// The entry points snippet reuses the sign-up template on the page; here it gets
// a template of its own, so only its imports and component metadata are checked.
write('angular/entries/signup.component.ts', s.angular.entries);
write('angular/entries/signup.component.html', '<uf-button>Sign up</uf-button><uf-input label="Email" /><uf-dialog label="Hi">…</uf-dialog>');
write(
  'tsconfig.angular.json',
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        module: 'ES2022',
        moduleResolution: 'bundler',
        lib: ['ES2022', 'DOM'],
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        types: [],
      },
      angularCompilerOptions: { strictTemplates: true },
      include: ['angular/**/*.ts'],
    },
    null,
    2,
  ),
);
run('Angular (ngc, strict templates)', path(new URL('packages/angular/node_modules/.bin/ngc', repo)), ['-p', 'tsconfig.angular.json']);

// --- Markup: attributes of <uf-*> tags ----------------------------------------
const manifest = JSON.parse(readFileSync(new URL('packages/core/custom-elements.json', repo), 'utf8'));
const attributes = new Map();
for (const mod of manifest.modules) {
  for (const d of mod.declarations ?? []) {
    if (d.tagName) attributes.set(d.tagName, new Set((d.attributes ?? []).map((a) => a.name)));
  }
}
const global = /^(id|class|style|slot|lang|dir|hidden|title|tabindex|role|data-.+|aria-.+)$/;
// Angular bindings, events and form directives are checked by ngc above.
const angularSyntax = /^(\[|\(|\*|#)|^(formControlName|formControl|ngModel)$/;
const markup = [
  ['HTML guide: markup', s.html.markup],
  ['HTML guide: CDN page', s.html.cdn],
  ['Angular guide: template', s.angular.template],
];
const unknown = [];
for (const [label, code] of markup) {
  for (const [, tag, attrs] of code.matchAll(/<(uf-[a-z-]+)([^>]*)>/g)) {
    const known = attributes.get(tag);
    if (!known) {
      unknown.push(`${label}: <${tag}> is not a component`);
      continue;
    }
    for (const [, name] of attrs.matchAll(/([^\s=/]+)(?:="[^"]*")?/g)) {
      if (!known.has(name) && !global.test(name) && !angularSyntax.test(name)) unknown.push(`${label}: <${tag}> has no "${name}" attribute`);
    }
  }
}
if (unknown.length) failures.push(`Markup\n${unknown.join('\n')}`);
else console.log('snippets: markup ok');

if (failures.length) {
  console.error(`\nGuide snippets that no longer match the packages (apps/website/src/pages/frameworks/snippets.ts):\n\n${failures.join('\n\n')}`);
  process.exit(1);
}
