---
title: HyperDX 2.39.1 更新总结
description: HyperDX 2.39.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.39.1"
  date="2026-09-19"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.39.1"
/>

## 概览

HyperDX 2.39.1 是图表显示与容器构建修复版本。时长格式的 Y 轴刻度改用紧凑格式化器，避免较长标签被坐标轴裁切；all-in-one 和本地镜像则不再从 Node 镜像复制整个 `/usr/lib`，消除了 Alpine 小版本不一致导致的构建失败和基础镜像库被静默覆盖的问题。

## Bugfix / Security

- 修复 “13.33min” 等时长刻度标签因超出图表宽度预算而被裁切的问题。
- 改为从当前 Alpine 版本安装 `libstdc++`/`libgcc`，修复 `/sbin/apk` 因 `libapk.so` 不兼容而无法运行的问题。
- 避免 Node 镜像中的 `libssl`、`libcrypto` 等库覆盖 ClickHouse 基础镜像的 OpenSSL 与系统库。
