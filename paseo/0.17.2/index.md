---
title: Paseo 0.17.2 更新总结
description: Paseo 0.17.2 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.17.2"
  date="2026-11-22"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.17.2"
/>

## 概览

Paseo 0.17.2 新增单轮和会话用量统计。已启用的提供方会在后台自动刷新模型列表，侧栏默认显示用量摘要。

## New Feature

- 可查看 Claude、OpenCode v2、Pi、Oh My Pi 和插件提供方的耗时、Token、缓存与费用指标。提供方每 30 分钟刷新一次模型列表，设置页也支持手动刷新。
- 智能体可以向另一智能体正在运行的轮次发送引导消息，并收到投递提示。移动端可从工作区操作菜单归档工作区。

## Bugfix / Security

- 修复斜杠菜单执行过期的 `/exit` 选项并意外归档智能体的问题，以及修改工作区表单后重试创建时的冲突错误。
- 修复保存多个连接时繁忙主机掉线、创建周期性计划后 Antigravity 轮次一直运行，以及守护进程启动或重载插件时残留僵尸子进程的问题。
