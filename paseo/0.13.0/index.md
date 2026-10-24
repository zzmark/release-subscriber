---
title: Paseo 0.13.0 更新总结
description: Paseo 0.13.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.13.0"
  date="2026-10-24"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.13.0"
/>

## 概览

Paseo 0.13.0 新增折叠屏手机布局、跨机器代理委派、插件文件面板与插件翻译，并改进工作区差异、终端文件输入和移动端交互。升级时需检查中继主机密码及插件钩子，并迁移已弃用的插件入口和面板属性。

## Breaking Change

- 守护进程设置了密码时，中继连接必须提供该密码；此前未保存密码的中继主机需要重新添加。
- 轮次结束钩子现在发送空的 `timeline`，需改用 `timeline.refetch` 获取最近历史记录。
- 插件 UI 导入统一改用 `@getpaseo/plugin/client/ui`；旧入口（含 `useRevealedText`）仍可用，但已弃用。面板的 `context`、`agentId` 属性及 `addWorkspacePanel` 的 `context` 字段也已弃用，改用 `params.agentId` 和 `addAgentPanel`。

## New Feature

- 支持 iPhone Duo 等折叠屏手机，展开后使用宽屏布局；已连接主机允许代理在其他机器上创建、提示和监控代理，并在子代理轨道中查看。
- 差异面板默认显示“所有更改”，合并展示自分支基点以来已提交和未提交的工作；支持向本地或远程终端粘贴图片、拖入文件，供 Claude Code、Codex 等代理读取。
- 新增插件文件面板、可跨重新加载保留的标签页状态 `useTabState`、代理面板入口和 Markdown 组件；支持插件内容、标签和列表介绍的翻译，以及内联 SVG 和组件图标。
- paseo.sh 新增简体中文版；工作区默认按创建时间排序，命令中心统一状态图标，手机资源管理器保留完整标签并支持滚动。

## Performance

- 启动时仅加载所选语言的译文，减少初始化工作；布局未变化时不再重复保存工作区布局。
- 暂停移动端隐藏面板中的状态环动画，不再向未显示相应设置流程面板的应用发送工作区设置输出。

## Bugfix / Security

- 修复守护进程重启后的代理运行状态、父子代理完成通知和重复后台命令通知，以及大型 Claude 会话打开或导入时的空白聊天和崩溃。
- 修复直连中断后未切换至已保存中继连接，以及 Android 对不受信任证书和无法解析主机名的错误提示。
- 修复 PR 状态、差异统计和合并后自动归档的更新遗漏、工作区标签页丢失、Markdown 相对链接解析错误，以及 CLI 归档前 200 个之外代理失败的问题。
- 修复移动端通知打开错误工作区、键盘遮挡、菜单位置偏移、图片选择失败和浅色主题标签不可见等问题。
- 修复插件按钮缺失、ACP 插件代理聊天为空、通知时间线转换器加载失败、语音回复跳句及 Cursor 用量显示错误；修正 Nix 许可证标识和 Android 源码构建重复下载 NDK 的问题。
