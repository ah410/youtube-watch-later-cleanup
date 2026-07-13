# Contributing

Thanks for contributing! This document covers the development workflow, commit
conventions, CI/CD, and the release process for this repo.

## Getting started

```bash
git clone https://github.com/ah410/youtube-watch-later-cleanup.git
cd youtube-watch-later-cleanup
npm install
npm run build:extension   # outputs to extension/dist/
```

Load the extension unpacked via `chrome://extensions` (or `brave://extensions` /
`edge://extensions`) → enable **Developer mode** → **Load unpacked** → select the
`extension/` folder. See the [README](README.md) for usage details.

## Development workflow

1. Branch off `main`, named by intent: `feature/<name>`, `fix/<name>`, `docs/<name>`,
   or `ci/<name>`.
2. Make your changes and verify locally before pushing:

   ```bash
   npm run format:check   # Prettier (npm run format to fix)
   npm run lint           # ESLint  (npm run lint:fix to fix)
   npm run typecheck      # tsc --noEmit
   npm run build:extension
   ```

3. Open a pull request against `main`. All CI checks must pass before merging.
4. Keep PRs focused — one logical change per PR.

## Conventional commits

Every commit message must follow the [Conventional Commits](https://www.conventionalcommits.org)
format. This is **enforced by CI** — the `Commitlint` check lints every commit in your
PR and fails on violations.

```
<type>(<optional scope>): <subject in lowercase, imperative mood>

<optional body, wrapped at 100 chars>
```

| Type       | Use for                                    |
| ---------- | ------------------------------------------ |
| `feat`     | New user-facing functionality              |
| `fix`      | Bug fixes                                  |
| `docs`     | Documentation only                         |
| `refactor` | Code restructuring without behavior change |
| `chore`    | Maintenance: deps, tooling, housekeeping   |
| `ci`       | CI/CD workflow changes                     |
| `test`     | Adding or fixing tests                     |
| `style`    | Formatting-only changes                    |
| `perf`     | Performance improvements                   |

Real examples from this repo's history:

```
feat: add popup UI with start/stop control and reliable full-playlist removal
ci: add GitHub Actions workflows and Dependabot
chore: commit package-lock.json for reproducible CI installs
docs: document extension architecture in README
```

For a breaking change, append `!` after the type (`feat!: ...`) and explain the break
in the body.

## Code style

Formatting and linting are CI-enforced, so there's nothing to debate in review:

- **Prettier** formats everything (`.prettierrc`: single quotes, 100-char lines).
- **ESLint** (flat config in `eslint.config.mjs`, typescript-eslint recommended) covers
  code quality. `legacy/` has relaxed rules — it's non-functional reference code only.

Run `npm run format && npm run lint:fix` before committing and you'll rarely see a red
check.

## CI/CD

All workflows live in `.github/workflows/`:

| Workflow    | File             | Triggers                    | What it does                                                             |
| ----------- | ---------------- | --------------------------- | ------------------------------------------------------------------------ |
| CI          | `ci.yml`         | PRs, push to `main`         | Format check, lint, typecheck + extension build, uploads `dist` artifact |
| Commitlint  | `commitlint.yml` | PRs                         | Enforces conventional commits on every PR commit                         |
| Snyk        | `snyk.yml`       | PRs, push to `main`, weekly | Dependency vulnerability scan (fails on high/critical)                   |
| CodeQL      | `codeql.yml`     | PRs, push to `main`, weekly | Static analysis for JS/TS                                                |
| Secret scan | `gitleaks.yml`   | PRs, push to `main`         | Scans full git history for committed secrets                             |
| Release     | `release.yml`    | `v*` tag push               | Builds, zips the store-ready extension, publishes a GitHub Release       |

Dependabot (`.github/dependabot.yml`) opens weekly PRs for npm dependencies and
GitHub Action version bumps.

### When a check fails

- **CI**: run the same commands locally (see above) — the failure will reproduce.
- **Commitlint**: reword the offending commit (`git rebase -i` + `reword`) and
  force-push your branch.
- **Snyk**: a high/critical vulnerability in a dependency. Try `npm audit fix` or bump
  the flagged package; if it's a false positive or unfixable, discuss in the PR.
  (Requires the `SNYK_TOKEN` repo secret — documented in the header of `snyk.yml`.)
- **CodeQL**: check the Security tab for the specific finding and fix or dismiss it
  with justification.
- **Gitleaks**: a secret was committed. Rotate the credential immediately — removing
  it from the code is not enough once pushed — then rewrite the branch history.

### Updating CI/CD

- Edit workflows on a branch and open a PR — checks run from the PR's copy of the
  workflow files, so you can test changes before they land.
- Keep `permissions:` least-privilege: default `contents: read`, add scopes only where
  needed (e.g. CodeQL needs `security-events: write`, release needs `contents: write`).
- Pin actions to major version tags (`actions/checkout@v4`); Dependabot bumps them.
- New secrets: add under **Settings → Secrets and variables → Actions** and document
  them in a comment at the top of the workflow that uses them.
- Validate syntax locally with [`actionlint`](https://github.com/rhysd/actionlint) if
  installed.

## Releases

Releases are cut from `main` by pushing a version tag — the release workflow does the
rest (builds, packages a Chrome-Web-Store-ready zip, and publishes a GitHub Release
with auto-generated notes).

1. Make sure `main` is green.
2. Open a small release PR that bumps the version in **both** `package.json` and
   `extension/manifest.json` — they must stay in sync (e.g. `chore: release v1.1.0`).
3. After it merges, tag the merge commit and push the tag:

   ```bash
   git checkout main && git pull
   git tag -a v1.1.0 -m "v1.1.0"
   git push origin v1.1.0
   ```

4. Verify the [Releases page](https://github.com/ah410/youtube-watch-later-cleanup/releases)
   has the new release with the `watch-later-cleanup-v*.zip` asset attached. That zip
   is what gets uploaded to the Chrome Web Store.

Pick the version with semver, guided by the commits since the last release:
`feat` → **minor**, `fix`/`chore`/`docs` → **patch**, any `!` breaking change → **major**.

## Security

- Never commit secrets — gitleaks scans the full history on every PR, and a leaked
  credential must be rotated even after removal.
- Report vulnerabilities privately via
  [GitHub Security Advisories](https://github.com/ah410/youtube-watch-later-cleanup/security/advisories),
  not public issues.
