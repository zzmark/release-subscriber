## 增强

- 新增 `runner.log_report_level`，用于独立于 `log.level` 设置作业日志中 Runner 消息的级别（https://gitea.com/gitea/runner/pulls/1310）
- 每个作业中的每个 Action 仅以归档形式下载一次，支持重试，并可回退到 git（https://gitea.com/gitea/runner/pulls/1316）

## 错误修复

- 修复 Action 的分支或标签移动后出现 `cannot lock ref` 失败以及仍使用旧提交的问题（https://gitea.com/gitea/runner/pulls/1312）
- 即使容器移除缓慢，也会移除作业网络（https://gitea.com/gitea/runner/pulls/1318）
- 在 10 分钟后回收孤立的作业网络和卷，不再使用 `workdir_cleanup_age`（https://gitea.com/gitea/runner/pulls/1318）

**完整 Changelog**：https://gitea.com/gitea/runner/compare/v5.1.0...v5.1.1
