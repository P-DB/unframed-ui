# Contributing to Unframed

Thanks for helping. Bug reports, fixes, docs and ideas are all welcome.

## Before you start

- **Found a bug?** [Open an issue](https://github.com/P-DB/unframed-ui/issues/new/choose) with a small reproduction: the markup, the framework and the browser.
- **Want a feature or a new component?** Open an issue first, so we can agree on the API before you write code. The public API is stable from 1.0 (see [Stability](https://p-db.github.io/unframed-ui/docs/stability)), so additions need care.
- **Security problem?** Don't open an issue: see [SECURITY.md](SECURITY.md).

Small fixes, like typos or a clear bug with an obvious fix, can go straight to a pull request.

## Setup

Node 20 or later, and npm (the repository uses npm workspaces).

```bash
npm install
npx playwright install chromium firefox webkit   # once, for the browser tests
npm run dev        # playground at http://localhost:5180
npm run storybook  # Storybook at http://localhost:6006
npm run website    # docs at http://localhost:5190
```

## The repository

| Folder | What |
|---|---|
| `packages/tokens` | Design tokens, built to CSS custom properties |
| `packages/core` | The web components (Lit). One folder per component in `src/components/<name>/` |
| `packages/react`, `vue`, `angular` | Framework wrappers, **generated** from `custom-elements.json`: change the generator, not the output |
| `packages/cli` | `npx @unframed/cli`: copies components into a project, and builds the agent skill |
| `packages/mcp` | The MCP server for AI coding tools, and the agent eval |
| `plugins/unframed` | The Claude Code plugin: a generated copy of the skill, committed |
| `apps/storybook`, `apps/website` | The workbench and the docs site |

## Making a change

- **Components** live in `packages/core/src/components/<name>/`, with `<name>.ts`, `<name>.styles.ts` and `<name>.test.ts`.
- **Document the public API with JSDoc** (`@tag`, `@slot`, `@csspart`, `@cssprop`, `@event`, and a description on every public attribute, property, method and event). The build fails without it: the docs, the wrappers, the skill and the MCP server are all generated from it.
- **Accessibility is part of done.** Keyboard support, a correct accessible name and role, visible focus and enough contrast. Every component has an axe test, and the tests run in Chromium, Firefox and WebKit.
- **Styling** goes through `--uf-*` custom properties and `::part()`; new colors and sizes come from the tokens.
- **Docs:** add or update the examples in `apps/website/src/demos.tsx`; they feed the website, `llms.txt` and the agent skill.

## Before you open a pull request

```bash
npm run build
npm run typecheck
npm test
```

- **Add a changeset** when a published package changes: `npm run changeset`, pick the packages and describe the change for users. Docs-only or internal changes don't need one.
- **The Claude Code plugin is generated.** If the build changes `plugins/unframed`, commit the result; CI checks it's up to date.
- **Visual tests** compare screenshots of every docs example, in light and dark, on Linux. If your change is meant to look different, run the **Update screenshots** workflow on GitHub after opening the pull request: it opens a pull request with the new references.
- **Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org/): `fix(core): …`, `feat(react): …`, `docs: …`.

## Releases

Releases are automated with Changesets: merging to `main` updates a release pull request, and merging that one publishes every package to npm with the same version, from GitHub Actions. Contributors don't need to do anything beyond adding a changeset.

## Code of conduct

Everyone taking part follows the [code of conduct](CODE_OF_CONDUCT.md).
