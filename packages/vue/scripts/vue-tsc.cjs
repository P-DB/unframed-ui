// Runs vue-tsc with this package's TypeScript 6. vue-tsc is hoisted to the repo
// root, where it would pick up TypeScript 7, which has no JavaScript API.
const tsc = require.resolve('typescript/lib/tsc', { paths: [__dirname] });
require('vue-tsc').run(tsc);
