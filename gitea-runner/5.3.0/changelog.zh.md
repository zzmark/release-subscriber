## 增强功能

- 通过 `kubernetes.transfer.mode`，让 Kubernetes 作业 Pod 经 Pod 网络从 Runner 拉取待复制的文件 https://gitea.com/gitea/runner/pulls/1354
- 像 GitHub 一样按 ref 限定缓存条目的作用域；升级后缓存需重新预热一次 https://gitea.com/gitea/runner/pulls/1361
- 添加 `GITEA_*` 别名，对应内置的 `GITHUB_*` 环境变量 https://gitea.com/gitea/runner/pulls/1358

## 错误修复

- 修复 `exec --no-skip-checkout` 使用本地可复用工作流时发生 panic 的问题 https://gitea.com/gitea/runner/pulls/1362
- 将 `github.action_repository` 和 `github.action_ref` 的作用域限定为正在执行动作的步骤 https://gitea.com/gitea/runner/pulls/1359
- 修复 Docker 守护进程响应缓慢时，Docker 代理探测遗留容器的问题 https://gitea.com/gitea/runner/pulls/1357
- 修复 dind 镜像中的 `s6-notifyoncheck` 僵尸进程问题 https://gitea.com/gitea/runner/pulls/1364

## 依赖项

- 将 `golang.org/x/net` 更新至 v0.62.0，以修复 CVE-2026-78661 https://gitea.com/gitea/runner/pulls/1356

**完整 Changelog**: https://gitea.com/gitea/runner/compare/v5.2.4...v5.3.0