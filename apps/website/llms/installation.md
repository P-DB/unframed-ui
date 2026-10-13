# Installation

Use Unframed from npm and get updates, or copy components into your project and own the code. You can mix both, but use each component from one place only: an npm import and a copy register the same tag.

## From npm

```bash
npm install @unframed/core @unframed/tokens
```

Load the tokens once, then import the components you use. Each import registers its tags.

```js
import '@unframed/tokens/tokens.css';
import '@unframed/core/button';
import '@unframed/core/dialog';
// or everything at once:
import '@unframed/core';
```

React, Vue and Angular have their own packages: `@unframed/react`, `@unframed/vue` and `@unframed/angular` (see the framework guides). Install `@unframed/tokens` with them.

## Copy the source

```bash
npx @unframed/cli init             # folder, TypeScript or JavaScript, tokens
npx @unframed/cli add dialog combobox
npx @unframed/cli list             # what's available and what you added
npx @unframed/cli diff dialog      # compare your copy with upstream
```

The CLI copies a component's source and the shared helpers it needs. It never overwrites a file you edited unless you ask.

## For AI assistants

`npx @unframed/cli skill` installs the Unframed agent skill in `.claude/skills/unframed` (see AI assistants).
