---
title: HyperDX 2.43.1 更新总结
description: HyperDX 2.43.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.43.1"
  date="2026-11-01"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.43.1"
/>

## 概览

HyperDX app 2.43.1 更新 API 依赖至 2.43.1；同一发布周期的 OTel Collector 镜像在启动时禁用 Multipath TCP，以缓解 CVE-2026-98432。该缓解也适用于一体化镜像，真正的修复仍需为宿主机内核应用补丁。

## Bugfix / Security

- 采集器镜像在启动时设置 `GODEBUG=multipathtcp=0`，缓解 Go 1.24+ 默认打开 MPTCP 监听器所涉及的 CVE-2026-98432；一体化镜像同样适用。
- 保留传入的其他 `GODEBUG` 设置，并保持显式指定的 `multipathtcp=` 值不变。此措施属于缓解，宿主机内核补丁仍是实际修复。
