---
title: Paseo 0.10.2 更新总结
description: Paseo 0.10.2 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.10.2"
  date="2026-09-29"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.10.2"
/>

## 概览

Paseo 0.10.2 集中修复 OpenCode v2 集成问题：运行超过五分钟的回合不再因 HTTP 标头等待超时而失败；上下文用量指示器、提问卡片以及 GPT 模型补丁编辑的差异视图也得到修复。

## Bugfix / Security

- 修复超过五分钟的 OpenCode v2 回合因 `UND_ERR_HEADERS_TIMEOUT` 失败的问题。
- 修复 OpenCode v2 回合期间上下文用量指示器为空、回合结束后消失，以及提问卡片无法输入答案的问题。
- 修复 GPT 模型补丁编辑显示原始 Patch 卡片、已完成的编辑不显示差异的问题。
