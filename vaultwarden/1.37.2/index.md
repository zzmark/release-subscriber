> ## Vaultwarden 1.37.2
>
> **发布时间：** 2026-08-22
>
> [版本地址](https://github.com/dani-garcia/vaultwarden/releases/tag/1.37.2) · [官方文档](https://github.com/dani-garcia/vaultwarden/wiki) · [changelog.md](./changelog.md) · [zh](./changelog.zh.md)

## 概览

Vaultwarden 1.37.2 是客户端兼容性和部署可靠性更新，也是支持 Bitwarden 2026.8.0 及以上客户端的必要版本。升级后若仍遇到客户端问题，官方要求进一步查阅关联讨论 #7615。

本版本修复 Debian 环境下 `xx-cargo` 的交叉链接、sendmail 可执行权限检查和 Playwright 测试，并通过补充 `revisionDate` 改善新版客户端协议兼容性。成功登录日志现在会记录用户邮箱，便于审计和故障排查，但运维方也应确认日志的访问控制与留存策略符合自身隐私要求。

## Breaking Change

本版本没有已知的破坏性变更。由于它是支持 2026.8.0+ 客户端所必需的版本，服务端与客户端应配套升级。

## New Feature

- 成功登录日志新增用户邮箱信息，提升审计和问题定位能力。

## Performance

本版本没有单独披露性能优化。

## Bugfix / Security

- 修复 Debian 环境中 `xx-cargo` 的交叉链接问题。
- 修复 sendmail 可执行权限检查。
- 为兼容客户端响应添加占位 `revisionDate`。
- 修复 Playwright 测试并包含其他维护性修复。
- 本版本没有披露新的安全公告。
