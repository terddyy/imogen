<h1 align="center">
  <img src="resources/icon-source/imogen.png" alt="Imogen" width="64" valign="middle" /> Imogen
</h1>

<p align="center">
  <a href="https://github.com/terddyy/imogen"><img src="https://img.shields.io/github/stars/terddyy/imogen?style=flat&amp;label=%E2%98%85&amp;color=08C" alt="GitHub stars" /></a>
  <img src="https://img.shields.io/badge/license-MIT-08C?style=flat" alt="License: MIT" />
  <img src="https://img.shields.io/badge/macOS%20%7C%20Windows%20%7C%20Linux-4493F8?style=flat-square" alt="Supported platforms: macOS, Windows, and Linux" />
</p>

<p align="center">
  <strong>The AI workspace for parallel agentic development.</strong><br />
  Run Codex, Claude Code, OpenCode, Pi, and other terminal agents side by side in isolated workspaces.
</p>

## Features

- Parallel git worktrees and folder workspaces
- Local, WSL, and SSH execution
- Persistent terminals, editors, diffs, and an embedded browser
- GitHub, GitLab, Linear, Jira, and other development integrations
- Desktop and mobile pairing
- Cross-platform support for macOS, Windows, and Linux

## Development

Requirements: Node.js 24 and pnpm 10.24.

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm typecheck
pnpm test
pnpm lint
```

The CLI is available as `imogenai`. Compatibility aliases remain available for existing automation and remote connections.
