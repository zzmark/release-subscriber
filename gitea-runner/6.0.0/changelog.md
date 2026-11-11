## ⚠️ Breaking changes

### `builtin:checkout` is removed (https://gitea.com/gitea/runner/pulls/1407)

We decided to remove it because it could not be pinned to a version and went against the spirit of shareable actions. We recommend `actions/checkout`, or [`taiki-e/checkout-action`](https://github.com/taiki-e/checkout-action) without Node.

### Gitea 1.26.2 or newer is required (https://gitea.com/gitea/runner/pulls/1395)

With older Gitea versions, most job logs stay in the database's `dbfs_data` table instead of being archived.

## Enhancements

- Make `runner.tool_cache_mode: shared` safe at any `runner.capacity`, with one tool cache per concurrent job https://gitea.com/gitea/runner/pulls/1401
- Add `ubuntu-26.04` to the default labels of newly registered runners https://gitea.com/gitea/runner/pulls/1396

## Bug fixes

- Fix cache and artifact steps failing when the runner picked an IPv6 address at startup https://gitea.com/gitea/runner/pulls/1398
- Fix non-root runners leaving behind `container.bind_workdir` workspaces with root-owned files https://gitea.com/gitea/runner/pulls/1399
- Fix `hashFiles()` with number, boolean or null arguments, and mixed-case or indented `::group::` commands https://gitea.com/gitea/runner/pulls/1394
- Fix jobs hanging past cancellation when the Docker daemon stops answering https://gitea.com/gitea/runner/pulls/1404

## Docs

- Add a [launchd example](https://gitea.com/gitea/runner/src/branch/main/examples/launchd) to run the runner on macOS https://gitea.com/gitea/runner/pulls/1408

**Full changelog**: https://gitea.com/gitea/runner/compare/v5.4.1...v6.0.0
