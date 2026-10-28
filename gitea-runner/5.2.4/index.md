---
title: Gitea Runner 5.2.4 更新总结
description: Gitea Runner 5.2.4 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="5.2.4"
  date="2026-10-28"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v5.2.4"
/>

## 概览

Gitea Runner 5.2.4 优化 Kubernetes 后端向作业容器复制文件时的传输量，修复 `exec` 模式对 v4 产物 API 的支持，并补充主机模式、可复用工作流、调度、重新连接和 CLI 等端到端测试。

## Performance

- Kubernetes 后端在作业容器具备 `gzip` 时，对 `CopyDir` 和大小至少为 64 KiB 的复制操作使用 `BestSpeed` 压缩，经 `pods/exec` 传输后解压，减少通过 API 服务器传输的数据。较小的复制操作保持不压缩；镜像没有 `gzip` 时继续使用普通 tar 流，不增加镜像要求（[#1355](https://gitea.com/gitea/runner/pulls/1355)）。

## Bugfix / Security

- 本地产物服务器提供 v4 API，修复 `exec` 下 `actions/upload-artifact` 和 `actions/download-artifact` v4 及后续版本失败的问题，并支持 docker/build-push-action 使用的单次 Put Blob 上传；产物默认写入临时目录（[#1341](https://gitea.com/gitea/runner/pulls/1341)）。
- 补充主机模式、可复用工作流、调度、重新连接、CLI 选项、`register`／`daemon` 命令和失败作业的端到端测试（[#1347](https://gitea.com/gitea/runner/pulls/1347)、[#1346](https://gitea.com/gitea/runner/pulls/1346)）。
