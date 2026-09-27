## ⚠️ Breaking changes

### Jobs reach the cache through their runner (https://gitea.com/gitea/runner/pulls/1229)

With `cache.external_server` set, jobs send cache requests to their runner, which forwards them. Jobs that cannot reach their runner, such as on a remote `DOCKER_HOST`, need `cache.host` and `cache.port` set to an address they reach.

Jobs on `container.network: bridge` cannot reach a runner container outside `bridge`, so their cache and artifact uploads fail. Leave `container.network` empty or use a user-defined network.

### `*` in `valid_volumes` no longer matches across `/` (https://gitea.com/gitea/runner/pulls/1214)

A host pattern relying on `*` to match nested paths needs `**`, for example `/data/**` instead of `/data/*`.

## Features

- Added `builtin:checkout` action, which needs no download and no Node in the job image (https://gitea.com/gitea/runner/pulls/871)
- Added `self:` prefix in step `uses` which resolves on the runner's Gitea instance (https://gitea.com/gitea/runner/pulls/1233)
- Support S3-compatible storage as cache backend with `cache.s3`, shared between runners without a cache server (https://gitea.com/gitea/runner/pulls/1244)
- OpenTelemetry tracing of jobs and steps, enabled with `OTEL_EXPORTER_OTLP_ENDPOINT` (https://gitea.com/gitea/runner/pulls/1206)

## Enhancements

- A runner container on the jobs' Docker daemon joins each job network, so jobs reach its cache without `cache.host` (https://gitea.com/gitea/runner/pulls/1229)
- Only runners need to reach `cache.external_server`, which no longer needs to reach Gitea (https://gitea.com/gitea/runner/pulls/1229)
- Faster job start for runners in a container (https://gitea.com/gitea/runner/pulls/1231)
- Support `--umask` in `container.options` (https://gitea.com/gitea/runner/pulls/1238)

## Bug fixes

- Skip a job whose `if:` fails to evaluate instead of failing it, like GitHub (https://gitea.com/gitea/runner/pulls/1247)
- Stop `actions/cache` inside composite actions saving caches of failed jobs (https://gitea.com/gitea/runner/pulls/1242)
- Give jobs of Podman runners in a container the Docker socket instead of an empty directory (https://gitea.com/gitea/runner/pulls/1231)
- Fix Windows paths in `valid_volumes` patterns (https://gitea.com/gitea/runner/pulls/1214)
- Silence the `docker-init` subreaper warning in the dind images (https://gitea.com/gitea/runner/pulls/1241)

**Full changelog**: https://gitea.com/gitea/runner/compare/v3.5.0...v4.0.0
