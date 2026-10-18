---
title: Gitea 28.2.0 更新总结
description: Gitea 28.2.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea"
  version="28.2.0"
  date="2026-10-18"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v28.2.0"
/>

## 概览

Gitea 28.2.0 改进 OAuth2 应用接入与自定义订阅，修复认证、Actions、软件包、拉取请求和通知等问题，并将 golang.org/x/net 更新至 v0.60.0，包含安全修复。

## New Feature

- 为 gitea-vscode 预注册内置 OAuth2 应用。
- 允许自定义订阅绕过仅在被提及时发送邮件的限制。

## Performance

- 获取远程提交时跳过 commit-graph 写入。

## Bugfix / Security

- 更新 golang.org/x/net 至 v0.60.0，修复安全问题；为多个处理器和模型补充检查，限制 artifacts v4 twirp 请求体大小，并在构建 LFS 对象路径前校验 OID。
- 防止“记住我”令牌轮换的并发竞争，校验 OpenID 的 state，修正 OIDC 发现文档，并拒绝无法登录的用户的入站邮件令牌。
- 修复可复用工作流停留在取消中状态的问题，改进 Actions 日志与筛选处理、定时任务清理、默认分支切换和折叠块标量序列化。
- 恢复 npm tarball URL，修正 Debian 安装参数复制、标签删除和 Release 附件加载。
- 修复拉取请求评审上下文、空拉取请求合并状态判定及合并提交未进入目标仓库时的 PR 恢复。
- 修复 MathML 间距、代码复制、Telegram 消息换行和修改密码通知，防止通知 panic 导致服务崩溃。
