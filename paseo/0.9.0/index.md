---
title: Paseo 0.9.0 更新总结
description: Paseo 0.9.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.9.0"
  date="2026-09-22"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.9.0"
/>

## 概览

Paseo 0.9.0 扩展了文件、终端和聊天中的查找能力，并可在可编辑文件中替换内容。插件现在可从 npm 安装和更新，SDK 增加多主机导航、外部链接、工作区浏览器及服务端设置订阅能力。版本还显著缩短语音首段音频等待时间和大型工作区的首次 diff 生成时间，降低桌面端内存占用，并修复长对话中的守护进程内存耗尽问题。使用旧版守护进程配置选项或依赖插件消息转换器的用户应检查下述行为变化。

## Breaking Change

- `paseo daemon start` 改为读取持久化配置；传入已移除的配置选项会报错并给出迁移提示。
- 插件的 `assistant_message` 转换器现在每次都接收完整的已累积消息；`tool_call` 转换器则在“概览”分组前接收每个原始调用。依赖旧输入形式的插件需要适配。

## New Feature

- 文件窗格、终端历史输出和聊天新增 Cmd/Ctrl+F 查找；可编辑文件还支持替换，聊天可搜索当前加载范围外的历史消息。
- 插件支持从 npm 按包名、版本、标签或范围安装，并可使用 `paseo plugin update` 检查及更新。
- 插件 SDK 新增指定主机的导航和客户端、外部 URL 与工作区浏览器操作，以及可读取和订阅的服务端设置句柄。
- 移动端“变更”支持跳转到文件；检测到拉取请求时可自动打开对应标签页；计划卡片可以展开。

## Performance

- 三句话回复的首段语音音频等待时间从 4.80 秒降至 0.95 秒；213 个文件工作区的首次 diff 生成时间从 11.45 秒降至 2.65 秒。
- 加载守护进程管理功能后，Electron 主进程内存占用从 290.5 MiB RSS 降至 152.1 MiB RSS。
- 大文件上传期间每处理 128 KiB 就让出执行机会；隐藏桌面窗口时，常驻浏览器页面可在截图间进入空闲状态。

## Bugfix / Security

- 修复长对话中累积的工具输出耗尽守护进程堆内存、重复提交创建多个工作区或代理，以及关闭最后一个内容标签页后持续崩溃的问题。
- 修复 Android 和 iOS 上的草稿布局、键盘、时间线、图片粘贴及平板模型选择器问题。
- 修复插件会话心跳到期后失去主机 API、Windows 插件构建失败，以及 ACP 消息分块错误拆分的问题。
- 修复 Linux 桌面安装包未启用 Chromium 沙箱、`paseo daemon stop` 关闭错误实例，以及旧版守护进程兼容性问题。
