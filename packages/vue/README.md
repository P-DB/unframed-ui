# @unframed/vue

[![npm](https://img.shields.io/npm/v/@unframed/vue?color=6930c3)](https://www.npmjs.com/package/@unframed/vue)

Vue components for [Unframed](https://p-db.github.io/unframed-ui/) web components, with `v-model` on every form control and typed props and events in templates.

```bash
npm install @unframed/vue @unframed/tokens
```

```vue
<script setup lang="ts">
import '@unframed/tokens/tokens.css';
import { UfCheckbox, UfInput } from '@unframed/vue';
const email = ref('');
const agree = ref(false);
</script>

<template>
  <UfInput v-model="email" type="email" label="Email" required />
  <UfCheckbox v-model="agree">I accept the terms</UfCheckbox>
</template>
```

`app.use(UnframedVue)` registers every component globally.

**[Documentation](https://p-db.github.io/unframed-ui/)** · **[Storybook](https://p-db.github.io/unframed-ui/storybook/)** · **[GitHub](https://github.com/P-DB/unframed-ui)**

MIT licensed. Status: 0.x, APIs may change before 1.0.
