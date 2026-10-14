## Enhancements

- Show action `pre` and `post` steps as their own steps on Gitea versions that support it (https://gitea.com/gitea/runner/pulls/1293)
- Retry startup while Gitea is unreachable instead of exiting (https://gitea.com/gitea/runner/pulls/1294)
- `exec --use-gitignore` follows Git's own ignore rules (https://gitea.com/gitea/runner/pulls/1309)

## Bug fixes

- Keep `GITHUB_ENV`, `GITHUB_OUTPUT`, `GITHUB_STATE` and `GITHUB_PATH` for post steps after a timeout or cancellation (https://gitea.com/gitea/runner/pulls/1294)
- Ignore `--entrypoint` in job container `options` with a warning instead of breaking the container (https://gitea.com/gitea/runner/pulls/1294)
- Use the job container's own `PATH` in cross-architecture jobs (https://gitea.com/gitea/runner/pulls/1294)
- Reuse a local image for platform variants like `linux/arm/v7` instead of pulling it again (https://gitea.com/gitea/runner/pulls/1294)
- Fix action copies on rootless Podman with images that symlink `/var/run` (https://gitea.com/gitea/runner/pulls/1294)
- Lock the action cache across runners that share a cache directory (https://gitea.com/gitea/runner/pulls/1294)
- Fix job cleanup for a runner nested behind another runner's Docker proxy (https://gitea.com/gitea/runner/pulls/1314)

## Dependencies

- Update Go to 1.27.2 and `golang.org/x/net` to v0.60.0 for security fixes (https://gitea.com/gitea/runner/pulls/1291, https://gitea.com/gitea/runner/pulls/1292)

**Full changelog**: https://gitea.com/gitea/runner/compare/v5.0.0...v5.1.0
