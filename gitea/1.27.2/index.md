---
title: Gitea 1.27.2 更新总结
description: Gitea 1.27.2 的中文更新总结、原始 Changelog、简体中文翻译与官方发布博客译文。
---

<ReleaseCard
  software="Gitea"
  version="1.27.2"
  date="2026-08-13"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v1.27.2"
  release-blog-url="https://blog.gitea.com/release-of-1.27.2/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea 1.27.2 包含大量安全修复，并修复 Actions 输入、重跑与表达式、LFS、软件包和子路径部署问题。官方建议尽快升级。

## Bugfix / Security

- 加强协作者权限更新、HTTP 签名、外部渲染、标记文本和 WebAuthn 校验；`pull_request_target` 可复用工作流按基础提交解析。
- 更新 Mermaid 至 v11.16.1，修复语法高亮语言处理。
- `github.event.inputs` 保留字符串；选定作业重跑可读取上次制品；表达式插值单独求值；没有运行中作业的运行可以取消。
- 修复 LFS 并发上传、Azure Blob 导出、MinIO 分片、Alpine HEAD 请求，以及子路径归档下载和完整 URL。
