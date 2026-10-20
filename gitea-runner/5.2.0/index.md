---
title: Gitea Runner 5.2.0 更新总结
description: Gitea Runner 5.2.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="5.2.0"
  date="2026-10-20"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v5.2.0"
/>

## 概览

Gitea Runner 5.2.0 使用 Go 1.27.3 构建，修复 CVE-2026-111943，并改进 Kubernetes 服务访问及主机步骤、YAML 配置处理。移除多项直接依赖使二进制体积缩小约 5%，同时改变构建上下文和缓存／制品服务器的部分行为，升级前需核对相关集成。

## Breaking Change

- 构建上下文不再携带 `security.capability` 扩展属性；无法读取的文件会被跳过并产生警告，不再生成不完整的 tar 归档。
- 缓存服务器和制品服务器在 GET 路由上支持 HEAD，但不再对尾部斜杠重定向，也不再响应 OPTIONS。
- 移除未使用的 xgo `release*` Makefile 目标。

## New Feature

- Kubernetes 服务 ID 为 DNS 子域名（如 `devstoreaccount1.azurite.local`）时，可通过该 ID 访问服务；对仅大小写不同的 ID 发出警告。

## Performance

- 移除 logrus、mergo、httprouter、retry-go 等直接依赖，二进制文件体积缩小约 5%。

## Bugfix / Security

- 使用 Go 1.27.3，在 crypto/x509 中不再信任一组中间证书，修复 CVE-2026-111943。
- 主机步骤已成功时，不再因遗留后台进程仍保持输出打开而判定失败。
- 修复 YAML 块标量与折叠标量的序列化往返，`config edit` 不再自动折行。
- 更新 Renovate 未自动更新的镜像和工具固定版本，构建器跟随当前 Alpine 版本；更新过时的 go-yaml 注释。
