---
title: Chrome 156 更新总结
description: Chrome 156 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Chrome"
  version="156"
  date="2026-10-07"
  repository-url="https://www.google.com/chrome/"
  docs-url="https://developer.chrome.com/docs/"
  release-url="https://chromestatus.com/release-notes/156"
/>

## 概览

Chrome 156 新增 CSS 随机值、导航发起元素伪类、单轴滚动容器和配对滚动吸附，扩展 WebTransport 请求头与响应头能力，并为 IndexedDB 的新建数据存储引入 SQLite 后端。WebGPU 片元深度修饰符有助于保留 early-Z 优化，WebRTC 新增经授权的诊断日志收集。FencedFrame 元素和 window.fence API 在 M156 保留为空实现，完整元素移除仍属于后续里程碑的分阶段计划。

发布日期依据 [ChromiumDash Windows Stable 实际记录](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=156&num=1000)：3 条记录均匹配主版本与渠道，最早构建为 156.0.8078.12，日期为 2026-10-07（UTC）。ChromeStatus 已移除“当前处于 Beta 渠道”标注；通用 Preview 徽标和计划日期 2026-10-20 在 Changelog 中照录，卡片使用实际首发日期。此核验基于 Windows Stable，不代表所有平台同步发布。

## Breaking Change

- FencedFrame 元素及其关联 IDL 依赖在 M156 保留为空实现，window.fence API 也替换为空实现。原文计划在 M157 Canary/Beta 通过现场试验逐步移除 FF HTML 元素，移除后其类型为 HTMLUnknownElement；M157 Stable 的完整移除仍取决于 1% 稳定版覆盖后的回归评估和额外批准，不应视为 M156 已完成的移除。

## New Feature

- CSS random() 在指定范围内生成随机数值，并支持通过 &lt;random-key&gt; 控制随机值在属性和元素之间共享；新增用于选择导航发起元素的 CSS 伪类。
- `overflow` 支持将可滚动值与 `clip` 组合，使粘性定位可在不同轴上受不同祖先滚动容器约束；scroll-snap-type 新增 pair 关键字，使两个轴吸附到同一个元素。
- WebTransport 支持通过 WebTransportOptions 传入自定义请求头，并在连接建立后通过实例读取服务端响应头，适用于初始 CONNECT 握手中的元数据、身份验证令牌和自定义参数。
- WebRTC 诊断日志 API 允许经授权的应用收集数据用于本地调试，经用户授权可分享给用户代理厂商；管理员可通过 `WebRtcDiagnosticLogCollectionAllowedForOrigins` 策略启用日志。

## Performance

- IndexedDB 后端由 LevelDB 与普通文件的组合转向 SQLite，预计提高可靠性并在较小程度上改善性能，Web API 保持不变。本阶段仅作用于新建数据存储；既有 LevelDB 数据不受影响，迁移属于后续步骤。
- WGSL 的 `@builtin(frag_depth)` 支持 `less` 或 `greater` 修饰符，显式设置缓冲区模式，使绘制调用可以保留 early-Z 优化，避免禁用该优化带来的性能损失。

## Bugfix / Security

- 不再缓存模块加载失败，开发者可再次调用 `import()` 手动重试，改善不稳定网络下模块加载失败后无法恢复的问题。
- 压缩字典链接请求采用 compression-dictionary 请求目标类型，并正确处理 mode、credentials、referrer、referrerpolicy 及链接元素上的 crossorigin 和 referrer 属性。
