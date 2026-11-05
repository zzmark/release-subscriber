Windows is now a supported platform. Every change is tested on Windows, and this release fixes the Windows bugs that testing found. The runner can also run as a Windows service, and Windows arm64 binaries are now released.

## Features

- Add `runner.ca_file` to trust a private CA for the Gitea instance https://gitea.com/gitea/runner/pulls/1366
- Add `container.volumes` to mount volumes into every job, service and Docker action container https://gitea.com/gitea/runner/pulls/1366
- Support Docker jobs, services and actions on FreeBSD https://gitea.com/gitea/runner/pulls/1367
- Sign release checksums in `checksums.txt.sig` https://gitea.com/gitea/runner/pulls/1382
- Run the runner as a native Windows service, see the [README](https://gitea.com/gitea/runner/src/branch/main/README.md#windows-service) https://gitea.com/gitea/runner/pulls/1348
- Release Windows arm64 binaries https://gitea.com/gitea/runner/pulls/1348

## Enhancements

- End host jobs' leftover background processes on Linux and macOS too, like GitHub's runner https://gitea.com/gitea/runner/pulls/1376
- Keep a step's background processes after the job by setting `RUNNER_TRACKING_ID`, see [host mode](https://gitea.com/gitea/runner/src/branch/main/docs/host-mode.md) https://gitea.com/gitea/runner/pulls/1348
- Retry failed image pulls and Dockerfile action builds https://gitea.com/gitea/runner/pulls/1376
- Output UTF-8 from Windows host steps, which fixes garbled non-ASCII text https://gitea.com/gitea/runner/pulls/1348

## Bug fixes

- Fix large cache uploads filling the cache volume and failing other saves https://gitea.com/gitea/runner/pulls/1377
- Fix concurrent jobs using the same Dockerfile action failing with `No such image` https://gitea.com/gitea/runner/pulls/1372
- Fix git-lfs checkouts failing with HTTP 400 on git-lfs before 3.8.0 https://gitea.com/gitea/runner/pulls/1371
- Fix Windows host jobs' handling of paths, environment variables, shell quoting and checkout https://gitea.com/gitea/runner/pulls/1348

**Full changelog**: https://gitea.com/gitea/runner/compare/v5.3.0...v5.4.0