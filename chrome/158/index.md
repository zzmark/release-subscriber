---
title: Chrome 158 更新总结
description: Chrome 158 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="158"
  date="2026-11-04"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://chromestatus.com/release-notes/158"
/>

## 概览

Chrome 158 扩展 CSS 高亮、对齐和基本形状，推出 HTML `<install>` 元素与 Web Install API，并补充 WebTransport 的流并发、拥塞控制、会话排空、密钥材料和统计接口。OfflineAudioContext 支持增量渲染；Android 版 WebHID 依赖 Android 17 / API level 37 及以上系统，且不支持 WebView。

本版按 [ChromiumDash 的 Windows Stable 记录](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=158&num=1000)收录，首条实际记录为 `158.0.8127.18`，时间为 **2026-11-04 18:02:22.736 UTC**。[官方公告](https://chromereleases.googleblog.com/2026/11/early-stable-update-for-desktop.html)确认这次是向**少量 Windows 用户**推送的 Early Stable，Mac 稍后发布。这不表示所有平台已全面推送；英文正文仍保留 Beta 标记和 11 月 17 日的计划日期，均不作为实际发布日期依据。

## Breaking Change

- 嵌入式 SVG 的布局行为改变：`<object>` 和 `<embed>` 中的 SVG 开始遵循 `object-fit` 与 `object-position`，不再始终拉伸至整个内容框。依赖旧拉伸行为的页面应检查显示效果。
- `flex-start/end` 与新增的 `flow-start/end` 作为值别名使用；序列化统一返回 `flow-start/end`。依赖旧序列化字符串的代码应核对比较逻辑；在逻辑方向与物理方向不一致的布局中，也需检查对齐行为。
- 新增 `focus-without-user-activation` 权限策略。发起操作的框架被禁止时，编程式聚焦会受限制；具有瞬时用户激活或焦点已在其子树内时仍可聚焦。策略不阻止对话框或弹出框打开，不影响点击、Tab 等用户聚焦，也不解除跨源 iframe 原有的自动聚焦限制。已聚焦父框架仍可向子 iframe 委派焦点。

## New Feature

- **CSS 与 SVG**：`::highlight(*)` 匹配所有自定义高亮，通用参数的优先级权重为零；新增 `flow-start`、`flow-end` 对齐关键字。`circle()` 与 `ellipse()` 支持 `closest-corner`、`farthest-corner`，适用于 `clip-path`、`shape-outside`、`offset-path`。SVG `textPath` 的 `side="right"` 可反转文本沿路径的布局方向。
- **Web 应用安装**：HTML `<install>` 提供无需 JavaScript 的声明式入口，`navigator.install()` 提供命令式入口；两者都支持通过清单 URL 和可选清单 ID 发起跨源安装。管理员可使用 `WebAppInstallByUserEnabled` 企业策略和 `web-app-installation` 权限策略控制安装能力。
- **媒体状态样式**：`:playing`、`:paused`、`:seeking`、`:buffering`、`:stalled`、`:muted`、`:volume-locked` 按 `<audio>`、`<video>` 的状态匹配元素。
- **设备与组播**：WebHID 扩展到 Android 17 / API level 37 及以上系统的 Chrome，保持现有 Web API 接口，不支持 WebView。隔离式 Web 应用的 Direct Sockets API 新增源特定组播（SSM），可只接收指定源的 UDP 数据包；未指定源时仍使用任意源组播（ASM）。
- **WebTransport 会话控制**：构造函数可提示预期并发传入流数量，配置初始 QUIC 流额度；`congestionControl` 支持 `"default"`、`"throughput"`、`"low-latency"`。`draining` Promise 在服务器准备平稳关闭会话时兑现，让应用在旧会话仍可用时建立替代会话。
- **WebTransport 密钥与统计**：`exportKeyingMaterial()` 派生绑定会话的密钥材料，标签和上下文分别最多 255 字节，输出长度为 1–4096 字节；HTTP/3 将 CONNECT 流 ID 纳入 TLS 导出器上下文，区分共享连接的不同会话。`WebTransportReceiveStream.getStats()` 区分网络接收量 `bytesReceived` 和已交付应用的量 `bytesRead`。
- **WebTransport 可靠性查询**：新增 `reliability` 与 `supportsReliableOnly`。Chromium 的 `reliability` 从 `"pending"` 变为 `"supports-unreliable"`；当前没有 HTTP/2 回退，`supportsReliableOnly` 为 `false`，成功建立的会话使用 HTTP/3 并支持不可靠数据报。

## Performance

- **离线音频内存占用**：OfflineAudioContext 通过增量渲染分块处理和交付音频图数据，无需预先分配整个音频缓冲区，降低大量音频数据处理对内存容量的要求。
