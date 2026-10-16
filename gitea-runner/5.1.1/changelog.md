## Enhancements

- Added `runner.log_report_level` to set the level of runner messages in the job log independently of `log.level` (https://gitea.com/gitea/runner/pulls/1310)
- Download each action once per job as an archive, with retries, falling back to git (https://gitea.com/gitea/runner/pulls/1316)

## Bug fixes

- Fix `cannot lock ref` failures and stale commits after an action's branch or tag moved (https://gitea.com/gitea/runner/pulls/1312)
- Remove the job network even when container removal is slow (https://gitea.com/gitea/runner/pulls/1318)
- Reclaim orphaned job networks and volumes after 10 minutes instead of `workdir_cleanup_age` (https://gitea.com/gitea/runner/pulls/1318)

**Full changelog**: https://gitea.com/gitea/runner/compare/v5.1.0...v5.1.1