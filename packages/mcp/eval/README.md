# Agent eval

Measures how well an AI coding agent uses Unframed with and without help: the agent skill, the MCP server, or both. Claude Code gets the same tasks in each setup, and its output is graded.

```bash
npm run eval -w @unframed/mcp                                   # every task, every setup, once
npm run eval -w @unframed/mcp -- --repeats 3                    # more runs, steadier numbers
npm run eval -w @unframed/mcp -- --tasks html-signup --conditions baseline,mcp
npm run eval -w @unframed/mcp -- --model opus --concurrency 4
node packages/mcp/eval/regrade.mjs packages/mcp/eval/results/<date>.json   # grade past runs again
```

Needs the `claude` CLI signed in (`claude auth login`) and the skill built (`npm run skill -w @unframed/cli`). Runs count against that account's usage: about $0.10–0.30 each with Sonnet.

## How it works

- **Tasks** ([tasks.mjs](tasks.mjs)): 10, in React, Vue and plain HTML. They are requests written the way a developer would ask, without attribute or event names. Each lists the components the result must use.
- **Setups:** `baseline` (nothing), `skill` (the agent skill in `.claude/skills`), `mcp` (the server from `dist/`), `skill+mcp`.
- **Isolation:** each run is a fresh project outside this repository, with the published packages (`rc` tag) installed once in the system temp folder. Only project settings load, no other MCP servers, no Bash or web access: the agent reads files, writes files, and uses the skill or server when its setup has them.
- **Grading** ([grade.mjs](grade.mjs)): a run passes when the file exists, uses every required component, has no `validate_usage` errors and, for React, type-checks with `tsc` against the published `@unframed/react` types. The validator is the server's own code, so it favours setups that can call it; `tsc` is the independent judge. HTML and Vue tasks have no type checker, so they show what the validator adds.
- **Results** go to `results/<date>.json` (not committed): each run's checks, problems, type errors, tool calls, cost, turns and time. The run folders stay in the system temp folder for reading the code.

## First run: 2026-11-20

Unframed 1.0.0-rc.3, Sonnet, 6 tasks (4 React, 1 Vue, 1 HTML) × 4 setups × 1 run.

| Setup | Passed | Turns | Cost | Time | File searches |
|---|---|---|---|---|---|
| baseline | 3/6 | 21.0 | $0.162 | 33 s | 113 |
| skill | 5/6 | 11.5 | $0.148 | 20 s | 43 |
| mcp | 5/6 | 15.7 | $0.120 | 24 s | 38 |
| skill+mcp | 4/6 | 12.2 | $0.142 | 17 s | 14 |

- Five of the six failures were library types, not agents: `TableRow` (`Record<string, unknown>`) rejects an `interface Order` (all 4 setups), and `autocomplete` rejects `"nickname"`, missing from TypeScript's `AutoFill` (2 setups).
- The real failure: without help, the agent wrote the HTML sign-up page with native `<input>` and `<button>`, ignoring Unframed.
- `validate_usage` found no errors in any run: in React, the published types already guide the agent. With the skill and the server, it needed about half the turns and time, and far fewer searches through `node_modules`.
- One run per cell is too few to rank the setups; the turns and cost trend held across tasks.

## Harder tasks: 2026-11-20

Four plain HTML and Vue tasks (tabs, radio groups, a dialog that refuses to close, a checkout form, a sortable table with an empty state), baseline and skill+mcp, 1 run each. Both setups passed all four; with help the agent used half the turns (11.3 vs 23.8) and time (18 s vs 45 s), at $0.12 instead of $0.22.

Three runs first failed on correct Vue code: false positives in `validate_usage` (a bound `:sort-direction="dir"` read as text, and `v-model` written out). The validator was fixed and the runs regraded with `regrade.mjs`.

## After the type fixes: 2026-11-22

Unframed 1.0.0-rc.4, with `TableRow` and `autocomplete` widened. The same 6 tasks × 4 setups × 1 run as the first run.

| Setup | Passed | Turns | Cost | Time | File searches |
|---|---|---|---|---|---|
| baseline | 4/6 | 17.0 | $0.144 | 27 s | 92 |
| skill | 6/6 | 10.5 | $0.143 | 20 s | 39 |
| mcp | 5/6 | 15.7 | $0.128 | 29 s | 39 |
| skill+mcp | 6/6 | 12.2 | $0.131 | 22 s | 12 |

- The library's types no longer fail correct code: react-settings passed in all 4 setups (2 before), react-orders in 2 (0 before).
- With mcp, react-orders failed on TypeScript's widening: the agent declared `const columns = [...]` without a type, so `align: 'end'` became `string`. The table docs now show `TableColumn<Invoice>[]` and explain why.
- Without help, the agent twice gave up after searching `node_modules` and wrote no file (react-orders, vue-filters). The sign-up page that used native inputs on rc.3 used Unframed this time.
