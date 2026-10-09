## ⚠️ Breaking changes

### Git 2.34.1 or newer is required (https://gitea.com/gitea/runner/pulls/1277)

The runner now downloads actions and reusable workflows with Git, so it needs `git` on its `PATH`. `builtin:checkout` now runs Git inside the job. Job images need Git as well, and the job must be able to reach Gitea and trust its certificate. The official runner images include Git.

### `builtin:checkout` works like `actions/checkout` (https://gitea.com/gitea/runner/pulls/1277)

It now supports SSH keys, LFS, submodules, sparse checkout and partial clones. It also accepts the `fetch-tags`, `clean`, `show-progress` and `set-safe-directory` inputs, and sets the `ref` and `commit` outputs. Branches are checked out as local branches tracking `origin`, and later steps can fetch and push with the persisted token or SSH key.

Two changes can break existing workflows. It removes untracked and ignored files from the checkout directory unless `clean: false` is set. It also fails when the triggering tag was moved after the workflow started.

### Config values expand `${NAME}` (https://gitea.com/gitea/runner/pulls/1274)

A config value containing `${NAME}` now reads that variable from the runner's environment, and the config fails to load when it is unset. Write `$${NAME}` to keep a literal `${NAME}`, for example in a shell command inside a Kubernetes `pod_template`.

### Jobs require `runs-on` (https://gitea.com/gitea/runner/pulls/1271)

A workflow with a job that has no `runs-on`, or an empty one, now fails instead of running that job in `runner.default_image`. This matches GitHub. Jobs that call a reusable workflow are exempt.

### Metrics follow the OpenTelemetry semantic conventions (https://gitea.com/gitea/runner/pulls/1282)

OTLP metric names, units, types and attributes change, see the [metrics docs](https://gitea.com/gitea/runner/src/branch/main/docs/telemetry.md#metrics). On `/metrics`, `gitea_runner_client_errors_total` has a new `code` label, and `gitea_runner_job_total` counts jobs stopped by `runner.timeout` as `timeout`.

### Unprivileged runners ignore workflow log and OOM options (https://gitea.com/gitea/runner/pulls/1283)

Unless `container.privileged` is set, the runner drops `--log-driver`, `--log-opt`, `--oom-score-adj` and `--oom-kill-disable` from a workflow's container `options` and logs a warning.

## Features

- Support mutual TLS to Gitea with `runner.client_cert_file` and `runner.client_key_file` (https://gitea.com/gitea/runner/pulls/1273)
- Support SHA-256 repositories for actions, reusable workflows and `builtin:checkout` (https://gitea.com/gitea/runner/pulls/1277)
- Support `${NAME}` environment variables in config values (https://gitea.com/gitea/runner/pulls/1274)
- Support `:ro` entries in `valid_volumes`, which allow only read-only mounts (https://gitea.com/gitea/runner/pulls/1272)
- Added `runner.extra_headers` for headers that a reverse proxy in front of Gitea requires (https://gitea.com/gitea/runner/pulls/1269)
- Added `container.sweep: false` to keep services that jobs deploy to the runner's Docker daemon (https://gitea.com/gitea/runner/pulls/1275)
- Added `gitea_runner_state` metric, which reports whether the runner is busy, idle or unavailable (https://gitea.com/gitea/runner/pulls/1282)

## Bug fixes

- Fix ephemeral runners failing on every restart with recent Gitea versions (https://gitea.com/gitea/runner/pulls/1287)
- Fix actions not reaching Kubernetes job pods on Ubuntu-based images (https://gitea.com/gitea/runner/pulls/1286)
- Match matrix `include` and `exclude` entries regardless of case, like GitHub (https://gitea.com/gitea/runner/pulls/1278)
- Apply `runner.insecure` to reusable workflow downloads and job summary uploads (https://gitea.com/gitea/runner/pulls/1273)
- Apply the Docker daemon's `mtu` to job networks (https://gitea.com/gitea/runner/pulls/1270)

**Full changelog**: https://gitea.com/gitea/runner/compare/v4.1.0...v5.0.0
