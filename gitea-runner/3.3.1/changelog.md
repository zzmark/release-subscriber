## ⚠️ Behavior changes

- A workflow's `container.options` may no longer set `--env-file` or `--label-file`, which name files read on the runner, nor carry a volume driver option, which turns a name `valid_volumes` allows into a bind of any host path. Both still serve the runner's own options (https://gitea.com/gitea/runner/pulls/1151)
- A bare `--env NAME` no longer resolves the value from the runner's own environment, for every source. Use `runner.envs` or `runner.env_file` to pass a variable on (https://gitea.com/gitea/runner/pulls/1151)
- A job output whose value carries a secret is skipped with a warning instead of sent, matching GitHub, so a downstream `needs.<job>.outputs.<name>` reading it is empty (https://gitea.com/gitea/runner/pulls/1188)

## Bug fixes

- Keep the runner's own `container.options` when privileged mode is off. The host-escape filter dropped the administrator's options along with the workflow's, so a setup needing `--device` or `--security-opt` from the config file had no way to get them (https://gitea.com/gitea/runner/pulls/1151)
- Mask secrets on every path they leave a job: uploaded log rows, the on-disk `job.log`, the runner's own log, debug stdout, job summaries, job outputs, and the job name that becomes a container name. `ACTIONS_STEP_DEBUG` and `ACTIONS_RUNNER_DEBUG` are never masked, as on GitHub (https://gitea.com/gitea/runner/pulls/1188)
- Keep a step's own `with:` values out of its `inputs` context, so a colliding `with:` key or an `INPUT_`-shaped variable from `env:` no longer flips `if:` conditions or forges an input (https://gitea.com/gitea/runner/pulls/1192)
- Honor volumes declared on service containers under the configured `valid_volumes` policy instead of dropping them silently (https://gitea.com/gitea/runner/pulls/1186)
- Report step log ranges with the log flush, so rows the server takes between two state reports no longer land under no step or under "Complete job" (https://gitea.com/gitea/runner/pulls/1189)
- Fail the run when matrix expansion fails, instead of reporting success without running anything (https://gitea.com/gitea/runner/pulls/1187)

## Dependencies

- Update the Go toolchain to 1.27.0, including the 1.26.6 security fixes. Building from source now needs Go 1.27 (https://gitea.com/gitea/runner/pulls/1183, https://gitea.com/gitea/runner/pulls/1185)
- Update dependencies, docker to 29.7.2 (https://gitea.com/gitea/runner/pulls/1185)

**Full changelog**: https://gitea.com/gitea/runner/compare/v3.3.0...v3.3.1
