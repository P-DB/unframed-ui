import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { DEFAULT_DIR, detectPackageManager, projectDependencies, readConfig, writeConfig, type Config, CONFIG_FILE } from '../lib/config.js';
import { planTokens, writeFile } from '../lib/files.js';
import { choose, color, confirm, prompt, type Io } from '../lib/io.js';
import { loadRegistry } from '../lib/registry.js';
import type { Language } from '../lib/transform.js';

export interface InitOptions {
  dir?: string;
  language?: Language;
  tokens?: Config['tokens'];
  install: boolean;
}

export async function init(io: Io, options: InitOptions): Promise<number> {
  const existing = readConfig(io.cwd);
  if (existing && !(await confirm(io, `${CONFIG_FILE} already exists. Replace it?`))) {
    io.out(`Keeping the existing ${CONFIG_FILE}.`);
    return 0;
  }

  io.out(color.bold('Set up Unframed components in this project.\n'));
  const hasTsConfig = existsSync(join(io.cwd, 'tsconfig.json'));
  const config: Config = {
    dir: options.dir ?? (await prompt(io, 'Where should components go?', existing?.dir ?? DEFAULT_DIR)),
    language: options.language ?? (await choose<Language>(io, 'TypeScript or JavaScript?', ['ts', 'js'], hasTsConfig ? 'ts' : 'js')),
    tokens:
      options.tokens ??
      (await choose<Config['tokens']>(
        io,
        'Design tokens: use the @unframed/tokens package, or copy tokens.css into the project?',
        ['package', 'copy'],
        'package',
      )),
  };

  writeConfig(io.cwd, config);
  mkdirSync(join(io.cwd, config.dir), { recursive: true });
  io.out(`${color.green('✔')} Wrote ${CONFIG_FILE}`);

  const registry = loadRegistry();
  if (config.tokens === 'copy') {
    const file = planTokens(io, config, registry);
    await writeFile(io, file, false);
    io.out(`${color.green('✔')} Copied ${relative(io.cwd, file.dest)}`);
  }

  const installed = projectDependencies(io.cwd);
  const needed = ['lit', ...(config.tokens === 'package' ? ['@unframed/tokens'] : [])].filter((dep) => !installed.has(dep));
  const pm = detectPackageManager(io.cwd);
  const command = [pm, pm === 'npm' ? 'install' : 'add', ...needed];

  if (needed.length && options.install) {
    io.out(`\nInstalling ${needed.join(', ')} with ${pm}…`);
    const result = spawnSync(command[0], command.slice(1), { cwd: io.cwd, stdio: 'inherit', shell: process.platform === 'win32' });
    if (result.status !== 0) {
      io.err(color.red(`Install failed. Run it yourself: ${command.join(' ')}`));
      return 1;
    }
  } else if (needed.length) {
    io.out(`\nInstall the runtime dependencies:\n  ${color.cyan(command.join(' '))}`);
  }

  const tokensImport =
    config.tokens === 'copy' ? `./${config.dir}/tokens.css` : '@unframed/tokens/tokens.css';
  io.out(`
${color.bold('Next steps')}
  1. Load the tokens once, e.g. in your app's entry file:
       ${color.cyan(`import '${tokensImport}';`)}
  2. Add components:
       ${color.cyan('npx @unframed/cli add button dialog')}
  3. Import them where you use them:
       ${color.cyan(`import './${config.dir}/index.${config.language}';`)}  ${color.dim('// registers every added component')}
`);
  return 0;
}
