---
title: Paseo 0.15.2 更新总结
description: Paseo 0.15.2 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.15.2"
  date="2026-11-05"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.15.2"
/>

## 概览

Paseo 0.15.2 为桌面端和网页端新增首次运行设置引导，帮助新用户配置主题、服务提供商、项目和代理编排，并了解移动应用。项目步骤会根据运行过 Claude Code、Codex、OpenCode 或 Pi 的文件夹提供建议；主题选择器、控件尺寸、加载状态和对话框呈现也同步调整。

## New Feature

- **首次运行引导与项目建议**：首次启动从加载画面直接进入引导，不再先显示空白首页。引导涵盖主题、服务提供商、项目、代理编排和移动应用，可通过“设置 → 通用 → 再次显示设置引导”重新打开；项目步骤展示来自已有编码代理使用目录的建议。
- **主题与设置界面**：主题选择器改为带主题预览的卡片网格，服务提供商设置使用骨架占位行替代“加载中…”文字；各设置部分的文档链接改为标题旁的 `Label ↗` 链接。
- **控件与对话框**：默认控件在桌面端高 32px、手机端高 44px，紧凑控件高 28px。桌面端和网页端对话框在约 160ms 内淡入，模态窗口和面板的背景与页面背景一致。
