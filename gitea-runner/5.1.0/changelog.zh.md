## 增强

- 在支持此功能的 Gitea 版本上，将 Action 的 `pre` 和 `post` 步骤分别显示为独立步骤（https://gitea.com/gitea/runner/pulls/1293）
- Gitea 无法访问时重试启动，不再退出（https://gitea.com/gitea/runner/pulls/1294）
- `exec --use-gitignore` 遵循 Git 自身的忽略规则（https://gitea.com/gitea/runner/pulls/1309）

## 错误修复

- 超时或取消后，为后置步骤保留 `GITHUB_ENV`、`GITHUB_OUTPUT`、`GITHUB_STATE` 和 `GITHUB_PATH`（https://gitea.com/gitea/runner/pulls/1294）
- 忽略作业容器 `options` 中的 `--entrypoint` 并发出警告，不再导致容器无法正常工作（https://gitea.com/gitea/runner/pulls/1294）
- 在跨架构作业中使用作业容器自身的 `PATH`（https://gitea.com/gitea/runner/pulls/1294）
- 对 `linux/arm/v7` 等平台变体复用本地镜像，不再重新拉取（https://gitea.com/gitea/runner/pulls/1294）
- 修复在无 root 权限的 Podman 上使用将 `/var/run` 设为符号链接的镜像时，Action 复制失败的问题（https://gitea.com/gitea/runner/pulls/1294）
- 为共享缓存目录的多个 Runner 对 Action 缓存加锁（https://gitea.com/gitea/runner/pulls/1294）
- 修复 Runner 嵌套在另一个 Runner 的 Docker 代理后方时的作业清理问题（https://gitea.com/gitea/runner/pulls/1314）

## 依赖

- 将 Go 更新至 1.27.2，将 `golang.org/x/net` 更新至 v0.60.0，以修复安全问题（https://gitea.com/gitea/runner/pulls/1291, https://gitea.com/gitea/runner/pulls/1292）

**完整 Changelog**：https://gitea.com/gitea/runner/compare/v5.0.0...v5.1.0
