---
title: Chrome 157 更新总结
description: Chrome 157 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="157"
  date="2026-10-22"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://chromestatus.com/release-notes/157"
/>

## 概览

Chrome 157 扩展 CSS 角形状、文本装饰与溢出提示，推出更新后的 HTML 插入和流式处理方法、HTML-in-canvas、WebGPU 64 位原子最小值／最大值操作，并加强 Background Fetch 的 CORS 检查。Long Animation Frame API 新增样式耗时指标；Connection Allowlists 嵌入式强制执行和过度滚动区域属于源试用。

发布日期由 [Windows Stable 实际记录](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=157&num=1000)和[官方 Early Stable 公告](https://chromereleases.googleblog.com/2026/10/early-stable-update-for-desktop_02123641300.html)共同确认：157.0.8103.15 于 2026-10-22（UTC）向少量 Windows 用户发布，Mac 将稍后推出。这不代表所有平台已全面投放。ChromeStatus 同期仍标注当前为 Beta、计划稳定版日期为 11 月 3 日；Changelog 保留这些标签，卡片使用实际 Stable 首发日期。

## Breaking Change

- Background Fetch 从本版起强制执行 CORS，与普通 Fetch 一样受本地网络访问等安全策略约束；不能再通过 Background Fetch 绕过这些检查。
- CSS `anchors-valid` 和 `anchors-visible` 更名为 `anchor-valid` 和 `anchor-visible`。复数形式保留为别名但已弃用，本版尚未移除；未来才会移除。

## New Feature

- 新增 corner 及按角、物理边和逻辑边设置的简写，可同时设置 border-radius 和 corner-shape；text-decoration-inset 控制装饰线缩进／延伸，text-overflow 支持自定义字符串。
- Capability Elements 支持通过 displaymode 显示纯图标按钮；新增一致的 HTML 定位插入、流式解析及 Trusted Types 解析选项能力。HTML-in-canvas 提供布局、绘制和 DOM 双向同步原语。
- WebGPU 可在 WGSL 的 `atomic<vec2u>` 上执行 64 位原子最小值和最大值操作，无需完整的 64 位整数支持。
- Android 版 Chrome 开放设备端 LanguageDetector；service worker 可使用 ProgressEvent，BluetoothRemoteGATTServer 继承 EventTarget。
- SanitizerConfig 和 Sanitizer 新增 javascriptURLs 选项，使导航所用 javascript: URL 的清理成为开发者可选择的行为；不指定时保持原有行为。
- Connection Allowlists 对 iframe 和嵌套文档／worker 的嵌入式强制执行，以及通过滑动显现锚定元素的过度滚动区域均为源试用，不能当作全面稳定开放的功能。

## Performance

- Long Animation Frame API 新增 `styleDuration` 和 `forcedStyleDuration`，便于区分样式与布局耗时；这是诊断指标扩展，不是性能提升幅度声明。

## Bugfix / Security

- Background Fetch 的 CORS 强制执行阻止网站绕过 CORS 及其他安全策略检查。
- position-visibility 的 anchor-valid 定义明确仅考虑默认锚点，消除先前因规范歧义而回退实现的问题。
