---
title: Gitea Runner 5.0.0 更新总结
description: Gitea Runner 5.0.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="5.0.0"
  date="2026-10-08"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v5.0.0"
/>

## 概览

Gitea Runner 5.0.0 扩展了 `builtin:checkout` 的能力，新增双向 TLS、只读卷挂载限制和 Runner 状态指标，并修复一次性 Runner、Kubernetes 和作业网络等问题。本次大版本同时调整 Git 依赖、检出清理、配置变量展开、作业调度要求及指标语义；升级前应核对现有工作流、作业镜像和监控配置。

## Breaking Change

- Runner 及作业镜像均需提供 Git 2.34.1 或更高版本；Runner 的 `PATH` 中必须能找到 `git`，作业也必须能够访问 Gitea 并信任其证书。
- `builtin:checkout` 默认删除检出目录中未跟踪及被忽略的文件，保留这些文件需设置 `clean: false`；触发标签在工作流启动后被移动时，检出会失败。
- 配置值中的 `${NAME}` 会读取 Runner 环境变量，未设置的变量会导致配置加载失败；保留字面量需写成 `$${NAME}`。
- 普通作业缺少 `runs-on` 或其值为空时会报错，不再回退到 `runner.default_image`；调用可复用工作流的作业除外。
- OTLP 指标名称、单位、类型和属性改为遵循 OpenTelemetry 语义约定；`/metrics` 的客户端错误计数新增 `code` 标签，超时作业以 `timeout` 计数，需检查监控查询。
- 未设置 `container.privileged` 时，工作流容器的日志驱动和 OOM 相关选项会被移除，并产生警告。

## New Feature

- `builtin:checkout` 支持 SSH 密钥、LFS、子模块、稀疏检出、部分克隆、更多输入及 `ref`、`commit` 输出；检出的本地分支跟踪 `origin`，后续步骤可使用持久保存的凭据执行 fetch 和 push。
- Action、可复用工作流和 `builtin:checkout` 支持 SHA-256 仓库。
- 支持通过客户端证书和密钥与 Gitea 进行双向 TLS 认证，并可通过 `runner.extra_headers` 设置前置反向代理要求的请求头。
- `valid_volumes` 支持只允许只读挂载的 `:ro` 条目；可用 `container.sweep: false` 保留作业部署到 Runner Docker 守护进程中的服务。
- 新增 `gitea_runner_state` 指标，报告忙碌、空闲或不可用状态。

## Bugfix / Security

- 修复较新 Gitea 版本下一次性 Runner 每次重启都会失败的问题，以及基于 Ubuntu 的镜像中 Action 无法连接 Kubernetes 作业 Pod 的问题。
- 矩阵的 `include`、`exclude` 匹配不再区分大小写，与 GitHub 保持一致。
- 将 `runner.insecure` 应用于可复用工作流下载和作业总结上传，并将 Docker 守护进程的 `mtu` 应用于作业网络。
