## 功能增强

- 工作流和作业支持 `cache-mode`，需要 Gitea 29.0.0 或更高版本。 https://gitea.com/gitea/runner/pulls/1412
- 支持将 `ACTIONS_STEP_DEBUG` 设为仓库变量。 https://gitea.com/gitea/runner/pulls/1413

## 问题修复

- 与 GitHub 保持一致，仅允许由 `push`、`schedule` 和 `workflow_dispatch` 触发的运行在默认分支上保存缓存。 https://gitea.com/gitea/runner/pulls/1412
- 修复主机模式下作业会删除 `container.workdir_parent` 下无关目录的问题。 https://gitea.com/gitea/runner/pulls/1409
- 从作业镜像读取 `ImageOS`，此前从 `runs-on` 标签读取。 https://gitea.com/gitea/runner/pulls/1415 https://gitea.com/gitea/runner/pulls/1419
- 作业超时后执行 `always()` 和 `cancelled()` 步骤。 https://gitea.com/gitea/runner/pulls/1415
- 修复 `github.env` 和 `github.path` 为空的问题。 https://gitea.com/gitea/runner/pulls/1413
- 修复仅包含 `run` 步骤的远程复合 Action 在使用前序步骤提供的输入时失败的问题。 https://gitea.com/gitea/runner/pulls/1413
- 修复作业容器的 `ports` 未发布的问题。 https://gitea.com/gitea/runner/pulls/1413
- 在作业日志中显示 Dockerfile Action 的构建输出，并遵循 `.dockerignore`。 https://gitea.com/gitea/runner/pulls/1413
- 取消主机模式下的步骤时先发送 SIGINT，使 `trap` 处理程序得以执行。 https://gitea.com/gitea/runner/pulls/1413
- 修复 `fetch_interval_max: 0` 无法禁用轮询退避的问题。 https://gitea.com/gitea/runner/pulls/1418
- 修复 FreeBSD 磁盘空间检查将已满磁盘误判为几乎空闲的问题。 https://gitea.com/gitea/runner/pulls/1416

## 依赖项

- 将 Go 更新至 1.27.4。 https://gitea.com/gitea/runner/pulls/1414

**完整更新日志**： https://gitea.com/gitea/runner/compare/v6.0.0...v6.0.1
