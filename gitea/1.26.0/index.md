---
title: Gitea 1.26.0 更新总结
description: Gitea 1.26.0 的中文更新总结、原始 Changelog、简体中文翻译与官方发布博客译文。
---

<ReleaseCard
  software="Gitea"
  version="1.26.0"
  date="2026-04-18"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v1.26.0"
  release-blog-url="https://blog.gitea.com/release-of-1.26.0/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea 1.26.0 增强 Actions 工作流控制与可视化，新增 Terraform 状态注册表、维护模式、OpenAPI 渲染和自动发布说明。升级前需检查注册令牌 API、并发控制及公开 URL 检测设置。

## Breaking Change

- 移除 `GET registration-token` API，并修正枚举、状态码和通知状态的 Swagger 注解；依赖这些接口的工具需检查兼容性。
- 引入 Actions `concurrency` 语法，已有工作流中的并发设置开始生效。
- `PUBLIC_URL_DETECTION` 默认值改为 `auto`，使用反向代理时需核对生成的公开 URL。

## New Feature

- 新增 Terraform 状态注册表、实例级信息横幅及维护模式，以及 OpenAPI 规范渲染。
- Actions 支持私有 Action 和可复用工作流、可配置的自动令牌权限、工作流依赖图、失败作业重跑和运行总结。
- 新增自动生成发布说明、仓库子路径归档下载、文件与代码搜索快捷键，以及 `config edit-ini` 子命令。

## Performance

- 缓存 SVG 图标，异步加载提及和热力图数据，并延迟加载部分 Vue 组件。
- 重构 Git `cat-file` 批处理，在可行时使用 merge tree 检测冲突。

## Bugfix / Security

- 限制 `ListUnadoptedRepositories` 的页面大小。
- 修复工作流、仓库访问、Git 操作和界面问题；完整条目见中文 Changelog。
