import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { add } from './commands/add.js';
import { diff } from './commands/diff.js';
import { init } from './commands/init.js';
import { list } from './commands/list.js';
import { skill } from './commands/skill.js';
import { color, type Io } from './lib/io.js';
import type { Language } from './lib/transform.js';

const help = `${color.bold('unframed')}: copy Unframed components into your project, and own them.

${color.bold('Usage')}
  npx @unframed/cli <command> [options]

${color.bold('Commands')}
  init                 Create unframed.json and install what the components need
  add <names...>       Copy components (and what they depend on) into your project
  add tokens           Copy tokens.css into your project
  list                 Show all components and which ones you've added
  diff [names...]      Compare your copies with this version of Unframed
  skill                Teach your AI assistant Unframed: installs an agent skill
                       (SKILL.md) with this version's components and API

${color.bold('Options')}
  --dir <path>         init: components folder (default src/components/uf-ui)
                       skill: your assistant's skills folder (default .claude/skills)
  --lang <ts|js>       init: TypeScript or JavaScript files
  --tokens <package|copy>
                       init: use @unframed/tokens, or copy tokens.css
  --no-install         init: print the install command instead of running it
  --all                add: every component
  --overwrite          add, skill: replace files that differ, without asking
  -y, --yes            Accept defaults; never prompt
  -v, --version        Print the version
  -h, --help           Print this help
`;

function cliVersion(): string {
  return JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
}

/** Runs the CLI and returns its exit code. */
export async function run(argv: string[], io: Io): Promise<number> {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        dir: { type: 'string' },
        lang: { type: 'string' },
        tokens: { type: 'string' },
        'no-install': { type: 'boolean', default: false },
        all: { type: 'boolean', default: false },
        overwrite: { type: 'boolean', default: false },
        yes: { type: 'boolean', short: 'y', default: false },
        version: { type: 'boolean', short: 'v', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
  } catch (error) {
    io.err(color.red((error as Error).message));
    io.err('Run "unframed --help" for usage.');
    return 1;
  }

  const { values, positionals } = parsed;
  const [command, ...names] = positionals;
  if (values.version) {
    io.out(cliVersion());
    return 0;
  }
  if (values.help || !command) {
    io.out(help);
    return 0;
  }

  const session: Io = values.yes ? { ...io, interactive: false } : io;

  if (values.lang && values.lang !== 'ts' && values.lang !== 'js') {
    io.err(color.red('--lang must be "ts" or "js".'));
    return 1;
  }
  if (values.tokens && values.tokens !== 'package' && values.tokens !== 'copy') {
    io.err(color.red('--tokens must be "package" or "copy".'));
    return 1;
  }

  try {
    switch (command) {
      case 'init':
        return await init(session, {
          dir: values.dir,
          language: values.lang as Language | undefined,
          tokens: values.tokens as 'package' | 'copy' | undefined,
          install: !values['no-install'],
        });
      case 'add':
        return await add(session, names, { all: values.all, overwrite: values.overwrite });
      case 'list':
        return list(session);
      case 'diff':
        return diff(session, names);
      case 'skill':
        return await skill(session, { dir: values.dir, overwrite: values.overwrite });
      default:
        io.err(color.red(`Unknown command "${command}".`));
        io.out(help);
        return 1;
    }
  } catch (error) {
    io.err(color.red((error as Error).message));
    return 1;
  }
}
