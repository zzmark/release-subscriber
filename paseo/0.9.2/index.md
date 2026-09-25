---
title: Paseo 0.9.2 更新总结
description: Paseo 0.9.2 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.9.2"
  date="2026-09-24"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.9.2"
/>

## 概览

Paseo 0.9.2 新增结构化 Claude Code 启动参数，缩短大型主目录中的项目搜索时间，并减少不必要的后台 Git 轮询。此版本集中修复守护进程内存增长和启动故障、工作区及会话恢复问题、代理与插件的回合状态，以及多种模型和快捷键交互。尤其需要关注的是，新建分支继承上游配置时误推送到默认分支的问题，以及 OpenCode 代理忽略权限规则的问题均已修复。

## New Feature

- 支持以结构化启动参数配置 Claude Code 会话与插件。

## Performance

- 减少对文件监视器无法监控的仓库执行后台 Git 轮询。
- 缩短在大型主目录中使用“添加项目”搜索目录的时间。

## Bugfix / Security

- 修复新建分支因继承上游配置而错误推送到默认分支的问题，以及 OpenCode 代理忽略已配置权限规则的问题。
- 修复守护进程在工作区出现被忽略目录后无响应、客户端断开后内存继续增长，以及无效计划任务文件、空 PID 文件或带 BOM 的配置阻止启动等问题。
- 修复磁盘或网络共享不可用时工作区消失、失败的会话导入导致归档工作树无法恢复，以及归档代理日志读取失败等问题。
- 修复 Claude 回退、Pi 与 OMP 回合结束状态、插件重新加载、模型选择、ACP 终端身份和 Hub 工作区命名等代理工作流问题。
- 修复聊天上传文件名、多选问题答案、Android 返回操作、语音提示音和多步快捷键等交互问题。
