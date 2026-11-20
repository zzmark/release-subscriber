## Enhancements

- Support `cache-mode` in workflows and jobs, with Gitea 29.0.0 or newer https://gitea.com/gitea/runner/pulls/1412
- Support `ACTIONS_STEP_DEBUG` as a repository variable https://gitea.com/gitea/runner/pulls/1413

## Bug fixes

- Stop runs other than `push`, `schedule` and `workflow_dispatch` from saving caches on the default branch, as on GitHub https://gitea.com/gitea/runner/pulls/1412
- Fix host-mode jobs deleting an unrelated directory under `container.workdir_parent` https://gitea.com/gitea/runner/pulls/1409
- Take `ImageOS` from the job image instead of the `runs-on` label https://gitea.com/gitea/runner/pulls/1415 https://gitea.com/gitea/runner/pulls/1419
- Run `always()` and `cancelled()` steps after a job timeout https://gitea.com/gitea/runner/pulls/1415
- Fix empty `github.env` and `github.path` https://gitea.com/gitea/runner/pulls/1413
- Fix `run`-only remote composite actions failing on inputs from earlier steps https://gitea.com/gitea/runner/pulls/1413
- Fix job container `ports` not being published https://gitea.com/gitea/runner/pulls/1413
- Show Dockerfile action build output in the job log, and honor `.dockerignore` https://gitea.com/gitea/runner/pulls/1413
- Send SIGINT first when cancelling host-mode steps, so `trap` handlers run https://gitea.com/gitea/runner/pulls/1413
- Fix `fetch_interval_max: 0` not disabling polling backoff https://gitea.com/gitea/runner/pulls/1418
- Fix disk space checks on FreeBSD treating a full disk as nearly empty https://gitea.com/gitea/runner/pulls/1416

## Dependencies

- Update Go to 1.27.4 https://gitea.com/gitea/runner/pulls/1414

**Full changelog**: https://gitea.com/gitea/runner/compare/v6.0.0...v6.0.1