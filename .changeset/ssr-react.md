---
'@unframed/react': minor
---

Server-side rendering: every component is a client component (`'use client'`), so it can be used in Next.js server components, and server-rendered HTML now includes the components' attributes (`variant`, `label`, `value`, `checked`, `disabled`…), so each element starts in the right state before React hydrates. Tabs no longer show every panel on server-rendered pages.
