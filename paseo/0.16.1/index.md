---
title: Paseo 0.16.1 更新总结
description: Paseo 0.16.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.16.1"
  date="2026-11-17"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.16.1"
/>

## 概览

Paseo 0.16.1 修复 Claude Bypass 跳过必需权限卡片的问题，并改善 Claude 令牌续订期间的会话稳定性。本版也修复了 OpenCode 的问题交互、工作树变更检测和守护进程重启后的完成通知。

## Bugfix / Security

- `permissions.ask` 规则或返回 `ask` 的钩子要求确认时，Claude Bypass 会显示权限卡片。刷新模型列表时，Claude Code 正在续订过期访问令牌的会话不再因此需要手动执行 `/login`。
- 修复 OpenCode 在新消息改变当前轮次方向后无法回答或关闭问题的情况，并保留 Pi 和 OMP 模型名称中的斜杠及其前缀。
- 文件在暂存的同一秒内再次保存且大小未变时，“变更”视图仍能显示该编辑。守护进程重启后，等待结果和完成通知会区分智能体自行发起的回复及其上一条回复。
- 修复触屏笔记本的控件尺寸、网页版主机密码字段以及已读状态更新失败后的提示。仅读取历史的 Codex 对话可从守护进程卸载。
