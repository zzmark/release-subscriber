---
title: Paseo 0.13.2 更新总结
description: Paseo 0.13.2 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.13.2"
  date="2026-10-26"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.13.2"
/>

## 概览

Paseo 0.13.2 修复 Android 视图卸载后的重复动画异常，并减少后台动画运行、流式聊天消息的重复测量及底部面板关闭后的监听器残留。

## Performance

- 修复应用进入后台后 Android 动画运行循环仍继续执行的问题，以及流式更新期间已完成的聊天消息仍被重新测量的问题，避免不必要的动画与布局计算。

## Bugfix / Security

- 修复 Android 上已卸载的视图反复触发动画异常的问题（[#7907](https://github.com/getpaseo/paseo/pull/7907)）。
- 修复底部面板关闭后仍保留窗口尺寸监听器的问题（[#7914](https://github.com/getpaseo/paseo/pull/7914)）。
