# Server-side rendering

Unframed works in server-rendered apps (Next.js, Nuxt, Angular SSR) with no extra setup: install your framework's package as usual.

- On the server, each component renders as its tag, with its attributes and the content inside it. Controlled values (`value`, `checked`, `disabled`) are written as attributes too.
- In the browser, components draw themselves when their JavaScript loads, then the framework hydrates.
- Until then, `@unframed/tokens/tokens.css` keeps components invisible but in place, and hides content that only shows once opened (closed dialogs, menus, select options), so no raw content flashes.
- Importing Unframed on the server is safe; `toast()` does nothing there.

## Next.js (App Router)

```tsx
// app/layout.tsx
import '@unframed/tokens/tokens.css';
```

Every `@unframed/react` component is a client component (`'use client'`), so it can be used in server components. Event handlers and state need a client component of your own, as with any React code in Next.js.

## Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['@unframed/tokens/tokens.css'],
});
```

Use `@unframed/vue` components as in any Vue app.

## Angular

With SSR and hydration (the default for new apps), add `@import '@unframed/tokens/tokens.css';` to `src/styles.css`. Components and form directives work as in the Angular guide.

Tested with Next.js 16, Nuxt 4 and Angular 22, with no hydration warnings.
