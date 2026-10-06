---
title: Vaultwarden 1.37.4 更新总结
description: Vaultwarden 1.37.4 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Vaultwarden"
  version="1.37.4"
  date="2026-10-05"
  repository-url="https://github.com/dani-garcia/vaultwarden"
  docs-url="https://github.com/dani-garcia/vaultwarden/wiki"
  release-url="https://github.com/dani-garcia/vaultwarden/releases/tag/1.37.4"
/>

## 概览

Vaultwarden 1.37.4 修复组织成员撤销、双重验证、组织邀请、附件、事件日志、密码库条目共享及组织 API 密钥相关的安全问题。上游强烈建议尽快更新；相关公告目前尚未公开，仍在等待 CVE 编号分配。

升级前应核对多层反向代理的可信代理配置、旧版 CLI 的 Sends 接收操作及已移除的功能标志。如果组织中有不完全可信的管理员，上游建议更新后考虑轮换组织 API 密钥，因为此前管理员也能查看该密钥。

## Breaking Change

- 使用 `IP_HEADER=X-Forwarded-For` 时，客户端 IP 改取不在 `IP_HEADER_TRUSTED_PROXIES` 中的最右侧地址。多层代理部署须将所有代理加入可信列表，否则前置代理 IP 会用于限流和日志。
- CLI 2026.4.2 及更早版本的 `bw send receive` 不再可用；所有客户端仍可创建和管理 Sends。
- 移除不再被客户端读取的功能标志。若 `EXPERIMENTAL_CLIENT_FEATURE_FLAGS` 仍包含这些标志，启动会警告，管理面板保存设置会失败，直到移除相应配置。
- 移除 `DUO_USE_IFRAME`，该设置将被忽略；同时移除旧版 `POST /identity/accounts/register` 和 `POST /api/accounts/prelogin` 端点。

## New Feature

- 支持 Web 2026.9.0 的密码库横幅策略，补充 Basic Auth 响应客户端功能标志，并在同步响应中加入 organizationsNew 和 policiesNew。
- 新增 `pm-32009-new-item-types`、`pm-34171-card-scanner`、`undetermined-cipher-scenario-logic` 功能标志，并支持 Windows 原生凭据同步功能标志。
- 新增 `email/recover_twofactor` 邮件模板，在使用双重验证恢复码登录后发送邮件；自定义模板部署应注意这一新增模板。

## Bugfix / Security

- 修复组织成员撤销后仍可访问组织密码库条目的高危问题（GHSA-69q9-v8p6-xvx3，8.1），并确保检查用户权限的路由也检查成员确认状态。
- 修复双重验证（GHSA-7jg8-8m5x-6j9r，6.8）、组织邀请（GHSA-v576-3wvq-xh3c，6.8）及附件（GHSA-q5x6-grh5-fqgc，6.5）相关安全问题。
- 修复组织事件日志（GHSA-64mc-4p6f-r7x9，4.3）、密码库条目共享（GHSA-7ccc-c43j-4p36，4.3）及组织 API 密钥（GHSA-qwx4-wcv4-mpcv，3.8）相关安全问题。
- 管理员重置双重验证时，邮件回退方式要求已验证的邮箱；`EMAIL_CHANGE_ALLOWED` 为 false 时隐藏整个更改邮箱部分。
- 修复 xx-cargo 的 cortex-a53 构建问题及 Clippy 警告，为每个邀请分别设置 user_created 布尔值，并更新 Rust、crate 和其他依赖。
