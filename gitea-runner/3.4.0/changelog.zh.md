## 新功能

- 新增 `GITEA_DOCKER_WORKSPACE`，表示 Docker 守护进程所见的工作区路径，可用于 Compose 绑定挂载 (https://gitea.com/gitea/runner/pulls/1204)

## 改进

- 加快 Action 下载速度：首次下载快 5 至 20 倍，缓存命中时无需联网 (https://gitea.com/gitea/runner/pulls/1209)
- 使用 `bind_workdir` 时不再要求将工作区列入 `valid_volumes` (https://gitea.com/gitea/runner/pulls/1203)

## 问题修复

- 作业结束时清理由其创建的容器、网络和卷 (https://gitea.com/gitea/runner/pulls/1204)
- 表达式无法插值时，让相应步骤或作业失败 (https://gitea.com/gitea/runner/pulls/1199)

## 依赖

- 将 `golang.org/x/crypto` 更新至 v0.56.0，修复 CVE-2026-78662 和 CVE-2026-56855 (https://gitea.com/gitea/runner/pulls/1205)

**完整变更记录**：https://gitea.com/gitea/runner/compare/v3.3.2...v3.4.0
