---
title: Chrome 159 更新总结
description: Chrome 159 的中文更新总结、英文原文与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="159"
  date="2026-11-18"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://chromestatus.com/release-notes/159"
/>

## 概览

Chrome 159 更新了 CSS 背景层、强调色与单轴滚动捕捉行为，并扩展了 WebTransport 的数据报、发送优先级和错误处理。Web Authentication 的被动模式通过源试用提供。

[ChromiumDash 的 Windows Stable 首条记录](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=159&num=1000)为 `159.0.8154.13`，时间为 **2026-11-18 18:53:23.819 UTC**。[官方 Early Stable 公告](https://chromereleases.googleblog.com/2026/11/early-stable-update-for-desktop_01707050408.html)确认本轮仅向少量 Windows 和 Mac 用户推送 `159.0.8154.13/.14`。原文保留 ChromeStatus 的 Beta 标记和 12 月 8 日计划日期。

## Breaking Change

- `background-*` 独立属性的计算值保留作者指定的列表长度。按背景图层数重复或截断的行为发生在使用值阶段。依赖计算值中列表长度的代码应检查其假设。
- `CSSImportRule.styleSheet` 在规则没有关联样式表时返回 `null`，包括 `supports()` 条件为假的情况。
- MediaSession 的 `setMicrophoneActive()` 和 `setCameraActive()` 改为返回 `Promise<undefined>`。关联文档未完全活动时，Promise 以 `InvalidStateError` 拒绝。
- 取消的 Service Worker 静态路由竞速请求使用专用 `TypeError` 消息。依赖旧错误字符串的代码应检查匹配逻辑。

## New Feature

- `AccentColor` 与 `AccentColorText` 反映元素生效的 `accent-color`。单轴容器只处理自身可滚动轴的捕捉对齐，另一轴交给该方向最近的可滚动祖先容器。
- Sanitizer API 新增 `javascriptURLs` 选项，控制是否清理用于导航的 `javascript:` URL。顶层框架可通过 `Supports-Loading-Mode: prerender-cross-origin-frames` 显式启用跨源 iframe 的预渲染。
- WebTransport 支持可读字节流与 BYOB 数据报读取、独立的数据报可写流、发送组与优先级控制。相关接口还覆盖拥塞控制、密钥材料导出、逐流接收计数和 `WebTransportError` 的结构化克隆。
- Web Speech API 条目说明了通过 `speechStartTime` 和 `speechEndTime` 将识别结果关联到媒体时间轴的提案。Web Authentication 被动模式可在源试用中测试，无需登录表单即可提供非模态登录建议。
