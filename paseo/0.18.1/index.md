---
title: Paseo 0.18.1 更新总结
description: Paseo 0.18.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.18.1"
  date="2026-11-27"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.18.1"
/>

## 概览

Paseo 0.18.1 可在主机上统一设置生成元数据时使用的语言、语气和格式。用量页新增 Claude 额外用量支出、Codex 个人支出上限和重置时间。

## New Feature

- 主机级指令适用于生成的工作区标题、分支名、提交消息和拉取请求。
- 时间线插件可通过 `item.metadata.intent` 获取 OMP 工具调用的意图。

## Bugfix / Security

- 修复 Android Doze 模式下智能体通知延迟，以及 iOS 主屏幕 Web 应用的状态栏遮挡问题。
- 修复命令中心结果在输入过程中重新排序、消息编辑器自动补全失效，以及从 GitLab 派生项目查询流水线详情时返回 404 的问题。
- 修复 Pi 自行运行时消息未排队、OpenCode v2 工具审批卡住和空闲聊天未释放，以及 ACP 智能体进程退出后无法在下一条消息重开的问题。
