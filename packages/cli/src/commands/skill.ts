import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile, type PlannedFile, type WriteResult } from '../lib/files.js';
import { color, type Io } from '../lib/io.js';

export interface SkillOptions {
  /** Folder that holds the assistant's skills. */
  dir?: string;
  overwrite: boolean;
}

/** Claude Code reads project skills from here; other assistants use their own folder (--dir). */
export const DEFAULT_SKILLS_DIR = '.claude/skills';

const source = fileURLToPath(new URL('../../skill/unframed/', import.meta.url));

/** Every file of the bundled skill, relative to its folder. */
function skillFiles(dir = source): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? skillFiles(join(dir, entry.name)) : [relative(source, join(dir, entry.name))],
  );
}

/** Installs the Unframed agent skill (SKILL.md and its references) into the project. */
export async function skill(io: Io, options: SkillOptions): Promise<number> {
  const target = join(io.cwd, options.dir ?? DEFAULT_SKILLS_DIR, 'unframed');
  const files: PlannedFile[] = skillFiles().map((file) => ({
    src: file,
    dest: join(target, file),
    content: readFileSync(join(source, file), 'utf8'),
  }));

  io.out(`Installing the Unframed skill in ${relative(io.cwd, target) || '.'}`);
  const results: WriteResult[] = [];
  for (const file of files) {
    const result = await writeFile(io, file, options.overwrite);
    results.push(result);
    if (result === 'created' || result === 'updated') io.out(`  ${color.green(result === 'created' ? '+' : '~')} ${relative(io.cwd, file.dest)}`);
  }

  io.out(
    `\n${color.green('✔')} Done. Your assistant now knows this version's components, their API and how to use them in your framework.` +
      (options.dir ? '' : color.dim(`\n  Claude Code reads ${DEFAULT_SKILLS_DIR}. For other assistants, pass their skills folder: --dir .agents/skills`)) +
      color.dim('\n  Run it again after upgrading Unframed to update the skill.'),
  );
  return results.includes('skipped') ? 2 : 0;
}
