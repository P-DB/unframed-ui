// Fails the build if the components can't be imported on a server (SSR in
// Next.js, Nuxt, Angular…): no window or document at import time, and the
// helper functions must not throw there either.
import { readdirSync } from 'node:fs';

const failures = [];
const attempt = async (label, fn) => {
  try {
    await fn();
  } catch (error) {
    failures.push(`${label}: ${error.message}`);
  }
};

const dist = new URL('../dist/', import.meta.url);
await attempt('@unframed/core', () => import(new URL('index.js', dist).href));
for (const name of readdirSync(new URL('components/', dist))) {
  await attempt(`@unframed/core/${name}`, () => import(new URL(`components/${name}/${name}.js`, dist).href));
}
for (const file of readdirSync(new URL('locales/', dist)).filter((f) => f.endsWith('.js'))) {
  await attempt(`@unframed/core/locales/${file.slice(0, -3)}`, () => import(new URL(`locales/${file}`, dist).href));
}

const core = await import(new URL('index.js', dist).href);
await attempt('setTranslations()', () => core.setTranslations({ close: 'Chiudi' }, 'it'));
await attempt('registerIcons()', () => core.registerIcons({ dot: '<svg viewBox="0 0 24 24"></svg>' }));
await attempt('toast()', () => core.toast('Saved').dismiss());

if (failures.length) {
  console.error(`Not safe to import or call on a server (SSR):\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log('ssr: every module imports on a server, and the helpers run there');
