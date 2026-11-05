---
title: Gitea Runner 5.4.0 更新总结
description: Gitea Runner 5.4.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="5.4.0"
  date="2026-11-05"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v5.4.0"
/>

## 概览

Gitea Runner 5.4.0 正式支持 Windows，新增原生 Windows 服务和 Windows arm64 二进制文件，并修复路径、环境变量、shell 引号及检出兼容性。Docker 作业、服务和 action 也支持在 FreeBSD 上运行；新增私有 CA 与全局容器卷配置，发布校验和开始提供签名。

升级前需检查主机模式作业的后台辅助进程：Linux 和 macOS 现在也会在作业结束时清理遗留进程。需要跨作业结束保留进程时，应按官方文档显式配置 `RUNNER_TRACKING_ID`，并自行安排文件存储和最终关闭。

## Breaking Change

- **主机模式后台进程清理**：Linux 和 macOS 作业结束时会终止携带该作业 `RUNNER_TRACKING_ID` 的进程，与 GitHub Runner 行为一致。依赖后台进程继续运行的流程需检查。按[官方主机模式文档](https://gitea.com/gitea/runner/src/tag/v5.4.0/docs/host-mode.md)，可在步骤启动前通过步骤 `env` 将 `RUNNER_TRACKING_ID` 设为与作业 ID 不同的值（包括空字符串），让继承此值的进程及其后代避开正常作业清理。Linux／macOS 脚本也可在启动进程前设置该值。需分离辅助进程输出；此设置不会保留工作区或临时文件，取消或超时仍会终止活动步骤的进程树。

## New Feature

- **Windows 正式支持**：变更纳入 Windows 测试，Runner 可作为原生 Windows 服务运行，新增 Windows arm64 发布包。安装与运行方式见 [Windows 服务说明](https://gitea.com/gitea/runner/src/branch/main/README.md#windows-service)。
- **私有 CA**：新增 `runner.ca_file`，使 Runner 信任 Gitea 实例的私有 CA。[官方 PR](https://gitea.com/gitea/runner/pulls/1366)说明，Runner 连接、制品代理、Runner 侧 Git 和 `builtin:checkout` 会使用该配置；作业中提供 `/var/run/act/ca.crt`，未被作业或镜像覆盖时设置 `NODE_EXTRA_CA_CERTS`。作业内 `actions/checkout` 使用的 Git 仍需在镜像的 CA 包中配置此 CA，不能仅凭 Runner 设置认为所有 Git 访问已配置完成。
- **全局容器卷与 FreeBSD**：`container.volumes` 将卷挂载到所有 Docker 作业、服务及 action 容器。卷来源路径位于 Docker 守护进程所在主机；按官方 PR，这些配置无需 `valid_volumes` 条目，工作流使用时必须保持相同访问权限。FreeBSD 支持 Docker 作业、服务和 action。
- **发布签名**：新增 `checksums.txt.sig`，为发布校验和提供签名。

## Bugfix / Security

- **缓存保存**：修复大型缓存上传填满缓存卷，进而导致其他保存失败的问题。[官方修复](https://gitea.com/gitea/runner/pulls/1377)改为原地组装并逐段删除已追加的上传分块，失败时清除残留；写入分块前若将触及可用空间下限，淘汰最近最少使用的条目，并拒绝已被清理的预留上传，减少临时空间耗尽和残留文件。
- **容器执行**：修复并发作业使用同一 Dockerfile action 时的 `No such image`。镜像拉取和 Dockerfile action 构建失败后会重试。
- **检出与 Windows 兼容性**：修复 git-lfs 低于 3.8.0 时检出返回 HTTP 400，以及 Windows 主机模式作业中的路径、环境变量、shell 引号和检出问题。Windows 主机模式步骤改用 UTF-8 输出，修复非 ASCII 文本乱码。
