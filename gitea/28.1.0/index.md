---
title: Gitea 28.1.0 更新总结
description: Gitea 28.1.0 的中文更新总结、原始 Changelog、简体中文翻译与官方发布博客译文。
---

<ReleaseCard
  software="Gitea"
  version="28.1.0"
  date="2026-10-06"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v28.1.0"
  release-blog-url="https://blog.gitea.com/release-of-28.1.0/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea 28.1.0 是 28 系列的首个维护版本，修复安全问题及 28.0.0 后的回归，涉及受保护分支推送、npm、账户、数据库事务和 Git 存储。官方建议尽快升级。

## Bugfix / Security

- 官方博客详列 API 和网页处理器、OAuth2、配置更新、用户动态、发布删除及迁移内存占用等安全修复。
- 恢复 Actions 向受保护分支推送，修复可复用工作流跳过子作业后的状态与自动刷新排序。
- 恢复待改密码机器人账户的 API 访问，允许用户批准 OAuth2 作用域变更，修复 npm 路由和客户端兼容性。
- MySQL、MariaDB 使用 `READ COMMITTED`，MSSQL 使用 `READ_COMMITTED_SNAPSHOT`；分块查询提交状态以适应 SQLite 深度限制。
- 改善 go-git 并发重新打包和特殊分支名处理，将更多地址范围归类为受限，使其可在 `lax` 模式显式允许后连接。
