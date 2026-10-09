/**
 * A minimal unified diff (LCS-based). Component files are a few hundred lines,
 * so the quadratic table is cheap and saves a dependency.
 */
export function unifiedDiff(before: string, after: string, labelBefore: string, labelAfter: string, context = 3): string {
  const a = before.split('\n');
  const b = after.split('\n');
  const n = a.length;
  const m = b.length;

  // lcs[i][j] = length of the longest common subsequence of a[i..] and b[j..].
  const lcs = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  type Op = { type: ' ' | '-' | '+'; line: string; ai: number; bi: number };
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) ops.push({ type: ' ', line: a[i], ai: i++, bi: j++ });
    else if (j < m && (i >= n || lcs[i][j + 1] >= lcs[i + 1][j])) ops.push({ type: '+', line: b[j], ai: i, bi: j++ });
    else ops.push({ type: '-', line: a[i], ai: i++, bi: j });
  }

  const changed = ops.map((op, k) => (op.type !== ' ' ? k : -1)).filter((k) => k >= 0);
  if (!changed.length) return '';

  // Group changes that are close together into hunks.
  const hunks: [number, number][] = [];
  for (const k of changed) {
    const last = hunks[hunks.length - 1];
    if (last && k - last[1] <= context * 2) last[1] = k;
    else hunks.push([k, k]);
  }

  const out = [`--- ${labelBefore}`, `+++ ${labelAfter}`];
  for (const [first, last] of hunks) {
    const start = Math.max(0, first - context);
    const end = Math.min(ops.length - 1, last + context);
    const slice = ops.slice(start, end + 1);
    const aCount = slice.filter((o) => o.type !== '+').length;
    const bCount = slice.filter((o) => o.type !== '-').length;
    out.push(`@@ -${slice[0].ai + 1},${aCount} +${slice[0].bi + 1},${bCount} @@`);
    for (const op of slice) out.push(`${op.type}${op.line}`);
  }
  return out.join('\n');
}
