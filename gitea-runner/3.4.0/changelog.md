## Features

- Add `GITEA_DOCKER_WORKSPACE`, the workspace path as the Docker daemon sees it, for compose binds (https://gitea.com/gitea/runner/pulls/1204)

## Enhancements

- Speed up action downloads, cold 5 to 20 times faster, cached ones need no network (https://gitea.com/gitea/runner/pulls/1209)
- `bind_workdir` no longer requires the workspace in `valid_volumes` (https://gitea.com/gitea/runner/pulls/1203)

## Bug fixes

- Clean up containers, networks and volumes a job created when it ends (https://gitea.com/gitea/runner/pulls/1204)
- Fail the step or job whose expression cannot be interpolated (https://gitea.com/gitea/runner/pulls/1199)

## Dependencies

- Update `golang.org/x/crypto` to v0.56.0, fixing CVE-2026-78662 and CVE-2026-56855 (https://gitea.com/gitea/runner/pulls/1205)

**Full changelog**: https://gitea.com/gitea/runner/compare/v3.3.2...v3.4.0
