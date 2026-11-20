// Runs Claude Code on the eval's tasks, with and without the skill and the MCP
// server, and grades what it writes.
//
//   npm run eval -w @unframed/mcp -- --tasks react-settings --conditions baseline,mcp --repeats 3
//
// Every run gets a fresh project outside this repository, with the published
// @unframed packages (the rc tag) installed, so the agent can't read the
// source or the docs. No user settings or other MCP servers are loaded, and
// Bash and the web are off: the agent only has the files, plus the skill and
// the server when the condition gives them.
import { spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { grade, summarize } from './grade.mjs';
import { conditions, tasks } from './tasks.mjs';

const { values: args } = parseArgs({
  options: {
    tasks: { type: 'string' },
    conditions: { type: 'string', default: Object.keys(conditions).join(',') },
    repeats: { type: 'string', default: '1' },
    model: { type: 'string', default: 'sonnet' },
    concurrency: { type: 'string', default: '3' },
  },
});

const mcpDir = fileURLToPath(new URL('..', import.meta.url));
const skillDir = fileURLToPath(new URL('../../cli/skill/unframed', import.meta.url));
const work = join(tmpdir(), 'unframed-eval');
const fixture = join(work, 'fixture');

const selectedTasks = args.tasks ? tasks.filter((t) => args.tasks.split(',').includes(t.id)) : tasks;
const selectedConditions = args.conditions.split(',');
for (const c of selectedConditions) if (!conditions[c]) throw new Error(`Unknown condition "${c}". Use: ${Object.keys(conditions).join(', ')}`);
if (!existsSync(join(skillDir, 'SKILL.md'))) throw new Error('No skill: run `npm run skill -w @unframed/cli` first.');

// --- The project every run starts from ---------------------------------------

const dependencies = {
  '@unframed/core': 'rc',
  '@unframed/react': 'rc',
  '@unframed/vue': 'rc',
  '@unframed/tokens': 'rc',
  react: '^19',
  'react-dom': '^19',
  vue: '^3',
};
const devDependencies = { typescript: '^5', '@types/react': '^19', '@types/react-dom': '^19' };

if (!existsSync(join(fixture, 'node_modules'))) {
  console.log(`Installing the published packages in ${fixture}…`);
  mkdirSync(fixture, { recursive: true });
  writeFileSync(join(fixture, 'package.json'), JSON.stringify({ name: 'fixture', private: true, type: 'module', dependencies, devDependencies }, null, 2));
  const install = spawnSync('npm', ['install', '--no-audit', '--no-fund'], { cwd: fixture, stdio: 'inherit' });
  if (install.status !== 0) throw new Error('npm install failed');
}
const installed = JSON.parse(spawnSync('npm', ['ls', '@unframed/react', '--json'], { cwd: fixture, encoding: 'utf8' }).stdout);
const unframedVersion = installed.dependencies?.['@unframed/react']?.version;

function createProject(dir, condition) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, 'src'), { recursive: true });
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'app', private: true, type: 'module', dependencies, devDependencies }, null, 2));
  writeFileSync(
    join(dir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, noEmit: true, lib: ['ES2022', 'DOM', 'DOM.Iterable'] },
        include: ['src/**/*.ts', 'src/**/*.tsx'],
      },
      null,
      2,
    ),
  );
  symlinkSync(join(fixture, 'node_modules'), join(dir, 'node_modules'));
  if (conditions[condition].skill) cpSync(skillDir, join(dir, '.claude/skills/unframed'), { recursive: true });
}

// --- One run -------------------------------------------------------------------

const MCP_TOOLS = ['list_components', 'get_component', 'validate_usage'].map((t) => `mcp__unframed__${t}`);

function runAgent(task, condition, dir) {
  const { skill, mcp } = conditions[condition];
  const prompt = `Using the Unframed UI components installed in this project: ${task.prompt} Dependencies are installed already; don't install anything.`;
  const cli = [
    '-p', prompt,
    '--output-format', 'stream-json', '--verbose',
    '--model', args.model,
    '--permission-mode', 'acceptEdits',
    '--allowedTools', 'Read', 'Write', 'Edit', 'Glob', 'Grep', ...(mcp ? MCP_TOOLS : []),
    '--disallowedTools', 'Bash', 'WebFetch', 'WebSearch', 'Agent', 'Task', 'NotebookEdit',
    '--setting-sources', 'project',
    '--strict-mcp-config',
    '--no-session-persistence',
    '--max-turns', '40',
    '--max-budget-usd', '2',
  ];
  if (mcp) {
    const config = join(dir, '..', `${task.id}-${condition}-mcp.json`);
    writeFileSync(config, JSON.stringify({ mcpServers: { unframed: { command: 'node', args: [join(mcpDir, 'dist/index.js')] } } }));
    cli.push('--mcp-config', config);
  }
  if (!skill) cli.push('--disable-slash-commands');

  // A clean environment: started from inside Claude Code (or the desktop app), the
  // child would otherwise inherit that session's variables and API endpoint.
  const env = Object.fromEntries(['HOME', 'PATH', 'USER', 'SHELL', 'LANG', 'TMPDIR'].filter((k) => process.env[k]).map((k) => [k, process.env[k]]));

  return new Promise((resolve) => {
    const child = spawn('claude', cli, { cwd: dir, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let buffer = '';
    let stderr = '';
    const toolCalls = [];
    let result;
    child.stdout.on('data', (chunk) => {
      buffer += chunk;
      let newline;
      while ((newline = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newline);
        buffer = buffer.slice(newline + 1);
        if (!line.trim()) continue;
        let event;
        try {
          event = JSON.parse(line);
        } catch {
          continue;
        }
        if (event.type === 'assistant') {
          for (const part of event.message?.content ?? []) if (part.type === 'tool_use') toolCalls.push(part.name);
        } else if (event.type === 'result') {
          result = event;
        }
      }
    });
    child.stderr.on('data', (chunk) => (stderr += chunk));
    child.on('close', (code) =>
      resolve({
        exitCode: code,
        error: result?.is_error ? String(result.result ?? result.subtype ?? 'error').slice(0, 200) : code ? stderr.trim().slice(-500) : undefined,
        costUsd: result?.total_cost_usd,
        turns: result?.num_turns,
        durationMs: result?.duration_ms,
        toolCalls,
      }),
    );
  });
}

// --- The matrix ----------------------------------------------------------------

const jobs = [];
for (let r = 1; r <= Number(args.repeats); r++)
  for (const task of selectedTasks) for (const condition of selectedConditions) jobs.push({ task, condition, repeat: r });

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const runsDir = join(work, 'runs', stamp);
console.log(`Unframed ${unframedVersion}, model ${args.model}: ${jobs.length} runs (${selectedTasks.length} tasks × ${selectedConditions.length} conditions × ${args.repeats}).\n`);

const results = [];
let next = 0;
async function worker() {
  while (next < jobs.length) {
    const { task, condition, repeat } = jobs[next++];
    const dir = join(runsDir, `${task.id}--${condition}--${repeat}`);
    createProject(dir, condition);
    const run = await runAgent(task, condition, dir);
    if (/authenticate|log ?in/i.test(run.error ?? '')) {
      console.error(`\nClaude Code isn't signed in: ${run.error}\nRun \`claude auth login\`, then run the eval again.`);
      process.exit(1);
    }
    const graded = grade(task, dir, fixture);
    const entry = { task: task.id, condition, repeat, dir, ...run, ...graded };
    results.push(entry);
    console.log(
      `${graded.pass ? 'PASS' : 'fail'}  ${task.id.padEnd(15)} ${condition.padEnd(10)} #${repeat}  ` +
        `validator ${graded.validatorErrors}  tsc ${graded.tscErrors ?? '-'}  missing ${graded.missing.length}  ` +
        `$${run.costUsd?.toFixed(3) ?? '?'}  ${run.turns ?? '?'} turns` +
        (run.error ? `  [${run.error}]` : ''),
    );
  }
}
await Promise.all(Array.from({ length: Number(args.concurrency) }, worker));

const outDir = fileURLToPath(new URL('results/', import.meta.url));
mkdirSync(outDir, { recursive: true });
const out = join(outDir, `${stamp}.json`);
writeFileSync(out, `${JSON.stringify({ date: new Date().toISOString(), unframedVersion, model: args.model, results }, null, 2)}\n`);
console.log(`\n${summarize(results, selectedConditions)}\n\nResults: ${out}\nProjects: ${runsDir}`);
