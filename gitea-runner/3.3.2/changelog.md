## ⚠️ Behavior changes

### `NODE_OPTIONS` can no longer be set from a workflow (https://gitea.com/gitea/runner/pulls/1194)

Writing `NODE_OPTIONS` to `$GITHUB_ENV` or via `::set-env::` is refused with an error annotation, as on GitHub.

## Features

- `exec` now supports `--input name=value` and `--input-file <path>` for the inputs a workflow declares under `workflow_dispatch` or `workflow_call` (https://gitea.com/gitea/runner/pulls/1173)

## Bug fixes

- Register every encoded spelling of a secret, so a value like `base64("user:$TOKEN")` no longer prints in the clear (https://gitea.com/gitea/runner/pulls/1194)
- Report the status a job actually reached: a `continue-on-error` step logs success, a cancelled job reports cancelled, a failing `if:` reports failure (https://gitea.com/gitea/runner/pulls/1194)
- Resolve `${{ matrix.* }}` and `${{ strategy.* }}` inside composite actions, and stop composite inputs leaking into nested actions as `INPUT_*` (https://gitea.com/gitea/runner/pulls/1194)
- Stop `container.env` overriding job env and `$GITHUB_ENV` writes (https://gitea.com/gitea/runner/pulls/1194)
- Pass `--preserve-symlinks-main` to Node actions, so an action comparing `process.argv[1]` against its realpath runs instead of skipping itself (https://gitea.com/gitea/runner/pulls/1202)

**Full changelog**: https://gitea.com/gitea/runner/compare/v3.3.1...v3.3.2
