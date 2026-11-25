# Security policy

## Supported versions

Security fixes go into the latest release of each package. During the 1.0 release candidates, that's the latest `rc`; after 1.0, the latest 1.x.

| Version | Supported |
|---|---|
| Latest 1.0 release candidate (`rc` tag) | ✅ |
| 0.x | ❌ Please upgrade |

## Reporting a vulnerability

**Please don't open a public issue.** Report it privately through GitHub:

**[Report a vulnerability](https://github.com/P-DB/unframed-ui/security/advisories/new)** (Security → Report a vulnerability)

Include what you can:

- the package and version, like `@unframed/core@1.0.0-rc.6`
- what an attacker could do, and under which conditions
- the steps or a small example to reproduce it
- a fix or a mitigation, if you have one in mind

## What happens next

You'll get an answer in the advisory as soon as possible. Once the problem is confirmed, it's fixed and released, and the advisory is published with credit to you, unless you'd rather stay anonymous.

## Scope

All the packages in this repository: `@unframed/core`, `tokens`, `react`, `vue`, `angular`, `cli` and `mcp`. Examples of what counts: script injection through a component's attributes or content, the CLI writing files outside the project, or the MCP server reading or exposing files it shouldn't.
