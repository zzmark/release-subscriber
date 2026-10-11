---
title: Gitea 1.27.1 更新总结
description: Gitea 1.27.1 的中文更新总结、原始 Changelog、简体中文翻译与官方发布博客译文。
---

<ReleaseCard
  software="Gitea"
  version="1.27.1"
  date="2026-07-27"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v1.27.1"
  release-blog-url="https://blog.gitea.com/release-of-1.27.1/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea 1.27.1 修复 Org-mode 渲染和 Git 补丁应用的安全问题，集中改善 Actions 的表达式、调度、日志和状态显示，并修复仓库与界面问题。

## Bugfix / Security

- 修复 Org-mode include 路径和 Git 补丁应用，详细安全影响见官方博客译文。
- 修复可复用工作流作业限制、失败重跑、矩阵与 `cancelled()` 表达式，以及 `workflow_dispatch` 布尔输入类型。
- Runner 停止报告时及时取消任务，填充定时运行的 `github.event`，并改善等待原因和 Runner 列表显示。
- 修复分支更新签名、提交信息合并、差异文件树排序、用户可见性及仓库删除后的数据清理。
