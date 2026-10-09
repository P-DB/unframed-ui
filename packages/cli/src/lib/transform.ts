import { posix } from 'node:path';
import { transform as sucrase } from 'sucrase';

export type Language = 'ts' | 'js';

const HEADER_PREFIX = '// From @unframed/core';

/**
 * Where a source file lands in the user's components folder: the
 * `components/` level is dropped, so `components/button/button.ts` becomes
 * `button/button.ts` next to `internal/`.
 */
export function destPath(srcPath: string, language: Language): string {
  const path = srcPath.replace(/^components\//, '');
  return language === 'js' ? path.replace(/\.ts$/, '.js') : path;
}

/** Points relative imports at where their targets land in the user's folder. */
export function rewriteImports(code: string, srcPath: string): string {
  const from = posix.dirname(destPath(srcPath, 'ts'));
  return code.replace(/((?:from|import)\s+['"])(\.{1,2}\/[^'"]+)(['"])/g, (_match, before: string, spec: string, after: string) => {
    const target = destPath(posix.normalize(posix.join(posix.dirname(srcPath), spec)), 'ts');
    let rel = posix.relative(from, target);
    if (!rel.startsWith('.')) rel = `./${rel}`;
    return `${before}${rel}${after}`;
  });
}

/** Strips TypeScript types, keeping comments and layout, then tidies what stripping leaves behind. */
export function toJavaScript(code: string): string {
  const stripped = sucrase(code, { transforms: ['typescript'], disableESTransforms: true }).code;
  const lines = stripped.split('\n');
  const out: string[] = [];
  for (const line of lines) {
    // `declare` fields become a lone `;`. Drop it with the doc comment above it.
    if (line.trim() === ';') {
      if (out[out.length - 1]?.trim().endsWith('*/')) {
        // Pop the comment block, back to and including its opening `/*`.
        while (out.length && !out.pop()!.trim().startsWith('/*'));
      }
      continue;
    }
    let tidy = line.replace(/\b(static|async)\s{2,}/g, '$1 '); // `static override x` -> `static  x`
    // A removed leading modifier (readonly, protected) leaves odd indentation. Doc-comment lines are odd on purpose.
    if (!tidy.trimStart().startsWith('*')) tidy = tidy.replace(/^((?: {2})*) (?=\S)/, '$1');
    out.push(tidy);
  }
  return out
    .join('\n')
    .replace(/,\s*\}(\s*from\s)/g, ' }$1') // `{ a, b, }` left by removed type imports
    .replace(/\n{3,}/g, '\n\n');
}

export function header(version: string): string {
  return `${HEADER_PREFIX} ${version} via @unframed/cli. This file is yours: edit it freely.\n`;
}

/** The file body without the CLI header, for comparing a local copy with upstream. */
export function withoutHeader(code: string): string {
  return code.startsWith(HEADER_PREFIX) ? code.slice(code.indexOf('\n') + 1) : code;
}

/** The exact content `add` writes for a source file. */
export function render(code: string, srcPath: string, language: Language, version: string): string {
  let out = rewriteImports(code, srcPath);
  if (language === 'js') out = toJavaScript(out);
  return header(version) + out;
}
