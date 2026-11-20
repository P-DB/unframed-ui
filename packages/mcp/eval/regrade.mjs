// Grades the runs of a results file again, with the current build: after a
// validator fix, past runs are re-checked without running the agents again.
// Needs the run folders, which stay in the system temp folder.
//
//   node eval/regrade.mjs eval/results/<date>.json
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { grade, summarize } from './grade.mjs';
import { tasks } from './tasks.mjs';

const file = process.argv[2];
if (!file) throw new Error('Usage: node eval/regrade.mjs eval/results/<date>.json');
const fixture = join(tmpdir(), 'unframed-eval', 'fixture');
const saved = JSON.parse(readFileSync(file, 'utf8'));

saved.results = saved.results.map((run) => {
  const regraded = grade(tasks.find((t) => t.id === run.task), run.dir, fixture);
  if (regraded.pass !== run.pass) console.log(`${run.pass ? 'PASS → fail' : 'fail → PASS'}  ${run.task} ${run.condition} #${run.repeat}`);
  return { ...run, ...regraded };
});
saved.regraded = new Date().toISOString();
writeFileSync(file, `${JSON.stringify(saved, null, 2)}\n`);
console.log(`\n${summarize(saved.results, [...new Set(saved.results.map((r) => r.condition))])}`);
