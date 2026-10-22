## Bug fixes

- Hide workflow commands the runner applies itself, like `::set-output::`, from the job log, as GitHub's runner does (https://gitea.com/gitea/runner/pulls/1333)
- Register `::add-mask::` values in every step even when another step left `::stop-commands::` active, and stop logging post step commands twice (https://gitea.com/gitea/runner/pulls/1333)
- Patch code-split action bundles like `rust-cache` v2.9.2, `setup-java` v6 and `setup-deno` v2 so they reach the v2 cache API (https://gitea.com/gitea/runner/pulls/1328)

## Performance

- Speed up job setup, action preparation and the cache server, a one-step `exec` drops from 1.70s to 0.87s (https://gitea.com/gitea/runner/pulls/1327)
- Cache server lookups and sweeps no longer decode the whole store (https://gitea.com/gitea/runner/pulls/1336)

## Refactoring

- Migrate to `connectrpc.com/connect/v2`, works with Gitea servers on connect v1 and v2 (https://gitea.com/gitea/runner/pulls/1325)
- Replace bolthold with direct bbolt access, existing caches keep working (https://gitea.com/gitea/runner/pulls/1336)
- Remove dead code and consolidate tests (https://gitea.com/gitea/runner/pulls/1335)

**Full changelog**: https://gitea.com/gitea/runner/compare/v5.2.0...v5.2.1
