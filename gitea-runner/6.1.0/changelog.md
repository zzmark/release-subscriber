## Features

- Run JavaScript actions and `hashFiles()` on a pinned Node.js 24, downloaded from nodejs.org or `NODEJS_ORG_MIRROR` https://gitea.com/gitea/runner/pulls/1400
- Add `runner.node_version` to pick another Node.js version, and `runner.node_download: false` to use the `node` on `PATH` https://gitea.com/gitea/runner/pulls/1400
- Add `runner.action_replacements` to rewrite step `uses`, for example to keep `builtin:checkout` working or to redirect actions to a mirror https://gitea.com/gitea/runner/pulls/1417
- Add `host.stable_workdir` to run Linux host jobs at a fixed path per repository, like GitHub's `_work/<repo>/<repo>` https://gitea.com/gitea/runner/pulls/1402

## Enhancements

- Handle `timeout-minutes` like GitHub, with GitHub's messages https://gitea.com/gitea/runner/pulls/1421
- Upload step summaries as each step ends https://gitea.com/gitea/runner/pulls/1421
- Let Docker actions reach job services by joining the job network https://gitea.com/gitea/runner/pulls/1421
- Verify pinned action SHAs https://gitea.com/gitea/runner/pulls/1421
- Let running jobs finish on stop in the systemd example https://gitea.com/gitea/runner/pulls/1421

## Bug fixes

- Fix artifact uploads timing out when the runner runs as a Docker Swarm service https://gitea.com/gitea/runner/pulls/1425
- Fix values masked by earlier steps showing unmasked in composite actions with `pre` steps https://gitea.com/gitea/runner/pulls/1424
- Fix a called job with `continue-on-error` failing its caller workflow https://gitea.com/gitea/runner/pulls/1421
- Fix relative `./` paths in remote reusable workflows https://gitea.com/gitea/runner/pulls/1421
- Fix every later job failing after a killed git left a cached action clone locked https://gitea.com/gitea/runner/pulls/1424
- Fix `systempaths=unconfined` in container options being ignored https://gitea.com/gitea/runner/pulls/1424
- Fix cached images for another platform being reused https://gitea.com/gitea/runner/pulls/1421

## Dependencies

- Update Docker to 29.10.0 in the dind images https://gitea.com/gitea/runner/pulls/1422

**Full changelog**: https://gitea.com/gitea/runner/compare/v6.0.1...v6.1.0