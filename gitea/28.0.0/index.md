---
title: Gitea 28.0.0 更新总结
description: Gitea 28.0.0 的中文更新总结、原始 Changelog、简体中文翻译与官方发布博客译文。
---

<ReleaseCard
  software="Gitea"
  version="28.0.0"
  date="2026-09-29"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v28.0.0"
  release-blog-url="https://blog.gitea.com/release-of-28.0.0/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea 自本版移除版本号中的历史 `1.` 前缀：1.27.x 后进入 **28.0.0**。本版新增审计日志、机器人账户、HTTPS 部署令牌和多项 Actions 功能，并带来需要升级前检查的配置与行为变化。

## Breaking Change

- Git 网络操作经内部代理应用出站规则；移除 `external` 预设，严格模式下未指定端口仅允许 80/443。升级前检查允许列表、阻止列表及 `EGRESS_MODE`。
- 已完成的 Actions 运行及其作业、日志、制品默认保留 400 天。如需永久保留，升级前设置 `[actions] RUN_RETENTION_DAYS = 0`。
- 最低 Git 版本为 2.25.0；停止发布 32 位 x86、`gogit` 二进制及 armhf Snap，下载文件名去掉操作系统版本后缀。
- 自助注册默认关闭；`[server] DOMAIN` 不再读取，域名取自 `ROOT_URL`。需检查原有注册和域名配置。
- 实时通知改用 `/-/ws` WebSocket，反向代理需转发升级请求头；多进程部署需配置 Redis 发布/订阅。
- Actions 作业级条件在矩阵展开前求值，矩阵 `fail-fast` 开始执行；公开仓库不能调用私有工作流，嵌套工作流不能扩大令牌权限。

## New Feature

- 新增审计日志（默认关闭）、专用机器人账户和管理员用户模拟；支持共享 Redis 连接配置。
- 新增仓库级 HTTPS 部署令牌、CODEOWNERS 必需审批、差异搜索与扩展名筛选，以及细分关注通知选项。
- Actions 新增队列视图、运行列表自动刷新、制品预览、动态矩阵、`max-parallel`、`self:` 和 `$/` 引用语法。
- 新增项目看板与工作流管理 API，npm 弃用及单版本 API、Helm 来源证明文件和 REUSE 许可证检测。

## Bugfix / Security

- 拒绝无效或重复 Git 对象，加强仓库、团队和软件包授权，修复取消后的派生仓库 PR 审批门禁。
- 官方博客详列安装程序、身份认证、令牌范围、私有数据及资源耗尽问题的安全修复。
