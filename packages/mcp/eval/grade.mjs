// Grades one run, and summarizes many. A run passes when the file exists,
// uses every component the task needs, has no validator errors and, for
// React, type-checks against the published @unframed/react types.
//
// The validator is the same code as the server's validate_usage tool, so on
// its own it would favour the agents that can call it. tsc is the independent
// judge: it knows nothing about this package.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadData } from '../dist/data.js';
import { parse, validate } from '../dist/validate.js';

const data = loadData();

export function grade(task, dir, fixture) {
  const file = join(dir, task.file);
  if (!existsSync(file)) return { pass: false, exists: false, validatorErrors: 0, validatorWarnings: 0, problems: [], missing: task.uses, tscErrors: null, tsc: [] };

  const code = readFileSync(file, 'utf8');
  const report = validate(data, code);
  const errors = report.problems.filter((p) => p.severity === 'error');
  const used = new Set(parse(code).map((e) => e.tag));
  const missing = task.uses.filter((tag) => !used.has(tag));

  let tscErrors = null;
  let tsc = [];
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const out = spawnSync(join(fixture, 'node_modules/.bin/tsc'), ['-p', join(dir, 'tsconfig.json')], { cwd: dir, encoding: 'utf8' });
    tsc = (out.stdout + out.stderr).split('\n').filter((l) => / error TS\d+:/.test(l));
    tscErrors = tsc.length;
  }

  return {
    pass: missing.length === 0 && errors.length === 0 && !tscErrors,
    exists: true,
    validatorErrors: errors.length,
    validatorWarnings: report.problems.length - errors.length,
    problems: report.problems.map((p) => `${p.severity} line ${p.line} <${p.tag}>: ${p.message}`),
    missing,
    tscErrors,
    tsc,
  };
}

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/** One row per condition: pass rate, errors, cost and effort. */
export function summarize(results, order) {
  const head = ['condition', 'runs', 'pass', 'validator errors', 'tsc errors', 'missing', 'called validate', 'cost', 'turns', 'time'];
  const rows = order.map((condition) => {
    const rs = results.filter((r) => r.condition === condition);
    const tsx = rs.filter((r) => r.tscErrors !== null);
    return [
      condition,
      rs.length,
      `${rs.filter((r) => r.pass).length}/${rs.length}`,
      mean(rs.map((r) => r.validatorErrors)).toFixed(1),
      tsx.length ? mean(tsx.map((r) => r.tscErrors)).toFixed(1) : '-',
      mean(rs.map((r) => r.missing.length)).toFixed(1),
      `${rs.filter((r) => r.toolCalls?.includes('mcp__unframed__validate_usage')).length}/${rs.length}`,
      `$${mean(rs.map((r) => r.costUsd ?? 0)).toFixed(3)}`,
      mean(rs.map((r) => r.turns ?? 0)).toFixed(1),
      `${(mean(rs.map((r) => r.durationMs ?? 0)) / 1000).toFixed(0)}s`,
    ];
  });
  const widths = head.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
  const line = (cells) => cells.map((c, i) => String(c).padEnd(widths[i])).join('  ');
  return [line(head), line(widths.map((w) => '-'.repeat(w))), ...rows.map(line)].join('\n');
}
