---
title: Paseo 0.13.1 更新总结
description: Paseo 0.13.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.13.1"
  date="2026-10-26"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.13.1"
/>

## 概览

Paseo 0.13.1 修复一项启动崩溃：开启“显示后台工作区”，且某个项目中有至少八个工作区时，应用可能在启动时崩溃。

## Bugfix / Security

- 修复开启“显示后台工作区”且项目中有至少八个工作区时的启动崩溃问题（[#7896](https://github.com/getpaseo/paseo/pull/7896)，贡献者 @budivoogt）。
