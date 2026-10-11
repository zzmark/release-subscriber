---
title: Gitea 1.27.0 更新总结
description: Gitea 1.27.0 的中文更新总结、原始 Changelog、简体中文翻译与官方发布博客译文。
---

<ReleaseCard
  software="Gitea"
  version="1.27.0"
  date="2026-07-13"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v1.27.0"
  release-blog-url="https://blog.gitea.com/release-of-1.27.0/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea 1.27.0 扩展 Actions、项目协作、API 和文档渲染能力，同时集中修复私有资源泄露、权限边界及仓库迁移问题。官方博客包含详细安全公告与升级说明。

## Breaking Change

- 调整可复用工作流支持，升级前检查工作流行为和权限。
- Content-Security-Policy 改用脚本 nonce，需检查自定义模板、脚本及反向代理的 CSP 设置。

## New Feature

- Actions 新增所有者级和全局工作流、作业级 `continue-on-error`、工作流状态徽章、作业总结及 Runner 批量管理。
- 新增 Jupyter Notebook 渲染、团队可见性、一个工单或 PR 归属多个项目，以及跟随重命名的文件提交历史。
- 提供 OpenAPI 3.0 规范、令牌自省与自删除端点，以及原始 diff/patch 比较端点。

## Bugfix / Security

- 修复仅公开令牌、私有组织成员、草稿附件、跨仓库 LFS、派生仓库 PR 和仓库恢复的权限或路径问题。
- 加强迁移、推送、附件类型及令牌自省检查，防止撤销访问权限后继续泄露元数据。
- 修复 Actions 表达式、工作流调度、仓库和界面问题，更新 go-git 安全依赖。
