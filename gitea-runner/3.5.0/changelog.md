## Features

- Containers started through the job's Docker socket can bind-mount job paths like `$PWD`, without `bind_workdir` (https://gitea.com/gitea/runner/pulls/1226)
- `exec` supports whole-value `${{ }}` for `strategy`, `env`, `with`, `services` and `outputs` (https://gitea.com/gitea/runner/pulls/1221)

## Enhancements

- The Docker proxy now also works when the runner runs in a container with the host's Docker socket, and in rootless dind (https://gitea.com/gitea/runner/pulls/1226)
- Faster job setup, services start alongside the job container and images are pulled once (https://gitea.com/gitea/runner/pulls/1218)
- Faster job completion with large workspace volumes (https://gitea.com/gitea/runner/pulls/1218)
- Remove volumes left behind by a runner that died mid-job (https://gitea.com/gitea/runner/pulls/1218)
- Faster cache requests (https://gitea.com/gitea/runner/pulls/1222)
- Warn in the job log when jobs cannot reach the cache server (https://gitea.com/gitea/runner/pulls/1225)

## Bug fixes

- Evaluate expressions like GitHub (https://gitea.com/gitea/runner/pulls/1221)
- `exec` validates matrices like GitHub (https://gitea.com/gitea/runner/pulls/1221)
- Mount the workspace above the repository, fixing pnpm `EXDEV` and `EBUSY` errors (https://gitea.com/gitea/runner/pulls/1224)
- Upload artifacts to Gitea directly when jobs cannot reach the cache server (https://gitea.com/gitea/runner/pulls/1225)

**Full changelog**: https://gitea.com/gitea/runner/compare/v3.4.2...v3.5.0
