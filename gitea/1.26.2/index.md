---
title: Gitea 1.26.2 更新总结
description: Gitea 1.26.2 的中文更新总结、原始 Changelog、简体中文翻译与官方发布博客译文。
---

<ReleaseCard
  software="Gitea"
  version="1.26.2"
  date="2026-05-20"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v1.26.2"
  release-blog-url="https://blog.gitea.com/release-of-1.26.2/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea 1.26.2 包含多项身份认证、令牌作用域及私有资源访问修复，并修复 Actions 并发、软件包和仓库操作问题。官方建议尽快升级；博客提供更详细的安全问题说明与署名。

## Bugfix / Security

- 统一仅公开令牌筛选，补齐文件、媒体、附件、Wiki、LFS、Git Smart HTTP 和软件包的访问及令牌作用域检查。
- 将 OAuth 令牌交换绑定到原始客户端请求，加强 PKCE 校验与刷新令牌重放保护，并加密 API 中的 AWS 凭据。
- 更新 Mermaid 和 go-git，并修复附件 CSP、维护者编辑权限及 URL 凭据清理问题。
- 修复 Actions 日志、运行与作业 ID 假设、并发死锁和空作业处理，以及软件包唯一性冲突和分支保护更新顺序。
