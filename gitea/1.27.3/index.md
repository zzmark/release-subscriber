---
title: Gitea 1.27.3 更新总结
description: Gitea 1.27.3 的中文更新总结、原始 Changelog、简体中文翻译与官方发布博客译文。
---

<ReleaseCard
  software="Gitea"
  version="1.27.3"
  date="2026-08-29"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v1.27.3"
  release-blog-url="https://blog.gitea.com/release-of-1.27.3/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea 1.27.3 集中修复 Actions、API、软件包和仓库迁移的安全问题，并修复 YAML 别名、矩阵展示和界面问题。官方建议尽快升级。

## New Feature

- 为 PR 评审增加永久链接。

## Bugfix / Security

- 强化派生仓库工作流、Git 钩子、仓库创建令牌、附件路径、工单和软件包访问的权限边界。
- 限制 gitignore 模板、Swift 清单、迁移响应和软件包元数据处理，降低资源耗尽风险。
- 修复步骤级 `continue-on-error`、跨作业 YAML 锚点、矩阵分组和最后一步被跳过时的完成日志。
- 保留 Swift SemVer 预发布标识，避免用 SSH 实例密钥验证 OpenPGP 签名，并修复迁移状态、用户编辑 API 和动态分页。
