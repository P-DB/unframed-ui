// Compiles a sample app with strict template checking: correct usage must pass,
// and an invalid input value must be rejected.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// The package's own ngc, which runs on its local TypeScript 6.
const ngc = fileURLToPath(new URL('../../node_modules/.bin/ngc', import.meta.url));
const run = (name) => spawnSync(ngc, ['-p', fileURLToPath(new URL(`tsconfig.${name}.json`, import.meta.url))], { encoding: 'utf8' });

const valid = run('valid');
if (valid.status !== 0) {
  console.error(`Valid templates failed to type-check:\n${valid.stdout}${valid.stderr}`);
  process.exit(1);
}
const invalid = run('invalid');
if (invalid.status === 0 || !/'"nope"' is not assignable/.test(invalid.stdout + invalid.stderr)) {
  console.error(`The invalid template should have failed on variant="nope":\n${invalid.stdout}${invalid.stderr}`);
  process.exit(1);
}
console.log('angular templates: valid usage type-checks, invalid input is rejected');
