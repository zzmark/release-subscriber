> ## Vaultwarden 1.37.1
>
> **发布时间：** 2026-07-29
>
> [版本地址](https://github.com/dani-garcia/vaultwarden/releases/tag/1.37.1) · [官方文档](https://github.com/dani-garcia/vaultwarden/wiki) · [changelog.md](./changelog.md) · [zh](./changelog.zh.md)

## 概览

Vaultwarden 1.37.1 是针对 1.37.0 的小型补丁版本，主要解决组织邀请链接参数缺失，以及 Alpine 容器构建链中的 OpenSSL 编译问题。

如果曾为邀请问题应用本地临时补丁，官方要求升级时撤销该补丁，避免与正式修复叠加而产生其他问题。使用 `alpine` 标签镜像的部署也应更新到本版本，以获得修复后的 `rust-musl` 构建环境。

## Breaking Change

本版本没有已知的破坏性变更。需要注意的是，升级前应撤销针对邀请问题自行实施的临时修改。

## New Feature

本版本没有新增面向用户的功能。

## Performance

本版本没有单独披露性能优化。

## Bugfix / Security

- 邀请 URL 现在始终携带 `initOrganization` 和 `orgUserHasExistingUser`，修复邀请流程异常。
- 更新 `rust-musl` 构建镜像，修复 OpenSSL 编译问题并重新构建 `alpine` 标签容器。
- 本版本没有披露新的安全公告。
