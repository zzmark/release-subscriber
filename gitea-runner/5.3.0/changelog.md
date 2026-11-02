## Enhancements

- Fetch Kubernetes job pod copies from the runner over the pod network via `kubernetes.transfer.mode` https://gitea.com/gitea/runner/pulls/1354
- Scope cache entries by ref like GitHub, caches start cold once after upgrade https://gitea.com/gitea/runner/pulls/1361
- Add `GITEA_*` aliases for built-in `GITHUB_*` environment variables https://gitea.com/gitea/runner/pulls/1358

## Bug fixes

- Fix `exec --no-skip-checkout` panic on local reusable workflows https://gitea.com/gitea/runner/pulls/1362
- Scope `github.action_repository` and `github.action_ref` to the step executing an action https://gitea.com/gitea/runner/pulls/1359
- Fix docker proxy probe leaking containers on slow daemons https://gitea.com/gitea/runner/pulls/1357
- Fix zombie `s6-notifyoncheck` processes in dind images https://gitea.com/gitea/runner/pulls/1364

## Dependencies

- Update `golang.org/x/net` to v0.62.0 for CVE-2026-78661 https://gitea.com/gitea/runner/pulls/1356

**Full changelog**: https://gitea.com/gitea/runner/compare/v5.2.4...v5.3.0