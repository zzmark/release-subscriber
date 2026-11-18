# Chrome 159 版本说明

预览

计划稳定版发布日期：2026 年 12 月 8 日（当前处于 Beta 渠道）

## CSS

### [AccentColor 和 AccentColorText 随 accent-color 值变化](https://chromestatus.com/feature/6207138742534144)

`AccentColor` 和 `AccentColorText` 反映元素实际生效的 `accent-color` 值。此前，它们只反映平台提供的系统强调色。

CSS 因此可以引用与 `accent-color` 样式相同的颜色，让自定义样式更容易与表单控件及其他使用强调色的界面元素保持一致。这也使 Chromium 的行为符合 CSS Color Module Level 4 规范。

[跟踪问题 #536420071](https://issues.chromium.org/issues/536420071) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6207138742534144) | [规范](https://www.w3.org/TR/css-color-4/#css-system-colors) | [演示](https://kyerebo.github.io/demos/system-accent-color/index.html)

### [背景层数量独立计算](https://chromestatus.com/feature/5144333908049920)

background-* 各个独立属性的计算值保留作者指定的逗号分隔项数量。此前，它们会按 background-image 的图层数重复或截断。重复和截断发生在使用值阶段。规范指出：「协调列表属性的计算值不受此类截断或重复影响。」此功能实现了 [https://drafts.csswg.org/css-values-4/](https://drafts.csswg.org/css-values-4/) 附录 A 定义的行为。

[跟踪问题 #40855581](https://issues.chromium.org/issues/40855581) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5144333908049920) | [规范](https://drafts.csswg.org/css-values-4/#linked-properties)

### [CSSImportRule.styleSheet](https://chromestatus.com/feature/5123480866783232)

当一条 @import 规则没有关联样式表时，包括其 supports() 条件为 false 时，CSSImportRule.styleSheet 返回 null。开发者可以在访问样式表属性前检查该规则是否关联了样式表。

[跟踪问题 #40266154](https://issues.chromium.org/issues/40266154) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5123480866783232) | [规范](https://drafts.csswg.org/cssom/#the-cssimportrule-interface)

### [单轴滚动容器的滚动捕捉](https://chromestatus.com/feature/5086608215900160)

单轴滚动容器（例如设置了 overflow: auto clip 的容器）可以分别处理两个轴上的滚动捕捉区域传播与对齐。

现在支持单轴滚动容器（[https://chromestatus.com/feature/5067363861004288](https://chromestatus.com/feature/5067363861004288)）。此前，这类容器会在两个轴上捕获滚动捕捉区域，包括无法滚动的轴，导致捕捉区域无法在该轴上对齐。

如果捕捉区域为两个轴都设置了对齐，单轴容器只处理自身可滚动的轴。另一轴交由该方向上最近的可滚动祖先容器处理。

[跟踪问题 #473576119](http://crbug.com/473576119) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5086608215900160) | [规范](https://drafts.csswg.org/css-scroll-snap-1) | [说明文档](https://github.com/explainers-by-googlers/single-axis-scroll-snap)

## 其他

### [为 SanitizerConfig 和 Sanitizer 添加 javascriptURLs 选项](https://chromestatus.com/feature/5169798320357376)

[https://github.com/whatwg/html/pull/12898](https://github.com/whatwg/html/pull/12898)

Sanitizer API 也会清理用于导航的 javascript: URL。此前，这是任何使用 Sanitizer 的「安全」方法附带执行的操作，「不安全」方法则会跳过这一步。HTML 标准最近将它统一为可由开发者选择的选项，使其独立于具体方法。

省略该选项时，行为保持原样。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5169798320357376) | [规范](https://github.com/whatwg/html/pull/12898) | [文档](https://html.spec.whatwg.org/#dom-sanitizer-setjavascripturls)

### [预渲染跨源 iframe](https://chromestatus.com/feature/5112398709129216)

通过响应标头启用跨源 iframe 的预渲染。

当顶层框架的 HTTP 响应包含 Supports-Loading-Mode: prerender-cross-origin-frames 时，浏览器现在会预渲染所有跨源框架。

[跟踪问题 #440387014](https://issues.chromium.org/issues/440387014) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5112398709129216) | [规范](https://wicg.github.io/nav-speculation/prerendering.html) | [说明文档](https://github.com/WICG/nav-speculation/blob/main/prerendering-cross-origin-iframes.md)

### [ServiceWorker 静态路由为取消的 race-network-and-fetch-handler fetch() 请求提供专用 TypeError 消息](https://chromestatus.com/feature/5124748525830144)

当 Service Worker 匹配带有 'race-network-and-fetch-handler' 的静态路由规则，并在 fetch 处理程序中调用 fetch(event.request) 时，Chromium 会对网络请求去重。如果竞速请求在响应标头到达前取消（net::ERR_ABORTED），例如离线回退计时器先完成 event.respondWith()，或导航被中止，Chromium 现在会以 TypeError("The service worker race-network-and-fetch-handler request was cancelled before 'fetch()' settled.") 拒绝 fetch(event.request) 的 Promise。此前使用通用错误 TypeError("Failed to fetch")。这与 Service Worker 导航预加载（event.preloadResponse）的行为一致，Web 应用可以区分预期的竞速请求提前取消与实际网络错误。

说明：这是对已发布的 Service Worker 静态路由 API 的小幅行为调整，IDL 和规范未变。由于 Web 应用可观察到新的 TypeError 消息字符串，Chromium 团队直接发出了 Intent to Ship，以便开展 Web 兼容性评审。

[跟踪问题 #584504247](https://crbug.com/584504247) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5124748525830144) | [规范](https://w3c.github.io/ServiceWorker/#dom-routersourceenum-race-network-and-fetch-handler)

### [SpeechRecognitionResult 时间戳（Web Speech API）](https://chromestatus.com/feature/5811907077472256)

Web Speech API 目前不提供识别出的语音片段在音频中的起止时间，因此难以将转录文本与媒体时间轴关联，或生成同步字幕提示。提案拟为 SpeechRecognitionResult 接口添加 speechStartTime 和 speechEndTime 属性，类型均为 double，单位为相对流起点的秒数。

[跟踪问题 #528037568](https://crbug.com/528037568) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5811907077472256) | [规范](https://github.com/WebAudio/web-speech-api/pull/192) | [说明文档](https://github.com/WebAudio/web-speech-api/blob/main/explainers/speech-recognition-result-timestamps.md) | [演示](https://alan33d.github.io/web-speech-demos/live_meeting_recording_demo.html) | [演示](https://alan33d.github.io/web-speech-demos/webrtc_caption_sync_test.html)

## 多媒体

### [MediaSession 的 setMicrophoneActive() 和 setCameraActive() 返回 Promise&lt;undefined&gt;](https://chromestatus.com/feature/5188639100370944)

navigator.mediaSession.setMicrophoneActive() 和 navigator.mediaSession.setCameraActive() 现在返回 Promise&lt;undefined&gt;，此前返回 undefined。此变更使行为符合 W3C Media Session 规范。关联文档完全处于活动状态时，Promise 以 undefined 兑现。否则，Promise 以 InvalidStateError DOMException 拒绝。

[跟踪问题 #576328036](https://crbug.com/576328036) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5188639100370944) | [规范](https://w3c.github.io/mediasession/#dom-mediasession-setmicrophoneactive) | [说明文档](https://github.com/w3c/mediasession/pull/312) | [演示](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setMicrophoneActive)

## 网络／连接

### [WebTransport 数据报可读流类型](https://chromestatus.com/feature/5148774971342848)

新增 WebTransportOptions.datagramsReadableType 构造函数选项。传入的 WebTransport 数据报默认通过普通 ReadableStream 提供。需要 BYOB 读取的应用可以设置 datagramsReadableType: "bytes"，请求可读字节流。

[跟踪问题 #547572475](https://issues.chromium.org/issues/547572475) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5148774971342848) | [规范](https://www.w3.org/TR/webtransport/#dom-webtransportoptions-datagramsreadabletype) | [说明文档](https://github.com/w3c/webtransport/blob/main/explainer.md)

### [WebTransport 数据报可写流与优先级](https://chromestatus.com/feature/5183354944225280)

新增新版 WebTransport 数据报发送 API。

WebTransportDatagramDuplexStream.createWritable() 会创建独立的 WebTransportDatagramsWritable 流。每个可写流都有可修改的 sendGroup 和 sendOrder 属性，用于指定同一发送组内排队的 WebTransport 数据之间的相对优先级。Chromium 目前在各数据报可写流之间应用这一排序。

实现还会报告协商得到的出站数据报最大载荷大小，并按 WebTransport 规范丢弃超出大小限制的写入。

[跟踪问题 #547572475](https://issues.chromium.org/issues/547572475) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5183354944225280) | [规范](https://www.w3.org/TR/webtransport/#datagram-writable) | [说明文档](https://github.com/w3c/webtransport/blob/main/explainer.md#5-sending-and-receiving-datagrams)

### [WebTransport 拥塞控制](https://chromestatus.com/feature/5180947573112832)

WebTransport 新增 congestionControl 构造函数选项和只读属性。应用可请求 "default"、"throughput" 或 "low-latency" 行为，以便用户代理为每个会话选择适合的拥塞控制方式。

[跟踪问题 #501268547](https://issues.chromium.org/issues/501268547) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5180947573112832) | [规范](https://www.w3.org/TR/webtransport/#dom-webtransportoptions-congestioncontrol) | [说明文档](https://github.com/w3c/webtransport/blob/main/explainer.md)

### [WebTransport 密钥材料导出](https://chromestatus.com/feature/4860330806214656)

新增 WebTransport.exportKeyingMaterial()，允许应用派生与已建立的 WebTransport 会话绑定的密码学密钥材料。

该方法接受应用提供的二进制标签值、上下文值和所需输出长度，并返回 Promise&lt;Uint8Array&gt;。Chromium 支持最多 255 字节的标签值和上下文值，以及 1 至 4096 字节的输出长度，含两端。

对于基于 HTTP/3 的 WebTransport，Chromium 会在 TLS 导出器上下文中包含 WebTransport CONNECT 流 ID。因此，即使不同会话共用同一底层 HTTP/3 连接，也会派生出不同的密钥材料。

[跟踪问题 #556304550](https://issues.chromium.org/issues/556304550) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4860330806214656) | [规范](https://www.w3.org/TR/webtransport/#dom-webtransport-exportkeyingmaterial) | [说明文档](https://github.com/w3c/webtransport/blob/main/explainer.md)

### [WebTransport 接收流](https://chromestatus.com/feature/5109912169480192)

新增标准化的 WebTransportReceiveStream 接口。它是 ReadableStream 的子类，用于传入的单向流和双向流的可读侧。getStats() 返回每条流的字节计数。bytesReceived 表示从网络收到的字节数，bytesRead 表示已交付给应用的字节数。

[跟踪问题 #568317222](https://issues.chromium.org/issues/568317222) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5109912169480192) | [规范](https://w3c.github.io/webtransport/#webtransportreceivestream) | [说明文档](https://github.com/w3c/webtransport/issues/372) | [说明文档](https://github.com/w3c/webtransport/pull/395)

### [WebTransport 发送组和发送流优先级](https://chromestatus.com/feature/5235261159112704)

WebTransport 已支持站点通过 WritableStreams 发送数据。此功能允许应用将出站流分配到发送组，并用 sendOrder 设置各组内流的优先级。它还提供流和发送组的发送统计数据，并保留 WritableStream 的可转移行为。

[跟踪问题 #568825278](https://crbug.com/568825278) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5235261159112704) | [规范](https://www.w3.org/TR/webtransport/#webtransportsendstream) | [说明文档](https://github.com/w3c/webtransport/blob/main/explainer.md#6-sending-video-one-stream-per-frame-or-segment-with-send-order) | [说明文档](https://github.com/w3c/webtransport/blob/main/explainer.md#7-sending-real-time-game-data-per-stream-with-send-order) | [说明文档](https://github.com/w3c/webtransport/blob/main/explainer.md#8-managing-bandwidth-with-send-groups)

### [WebTransportError API 对齐和序列化](https://chromestatus.com/feature/5158277221580800)

Chromium 更新 WebTransportError，使其符合当前 WebTransport 规范。新增标准的 (message, options) 构造函数，同时保留已发布的字典构造函数以维持兼容性。流错误代码在全流程保留完整的 unsigned-long 值。WebTransportError 现在可进行结构化克隆，保留其消息、来源和可空的错误代码。序列化默认启用，可通过写入端的运行时开关关闭。已持久化值的解码始终启用。

[跟踪问题 #577073049](https://issues.chromium.org/issues/577073049) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5158277221580800) | [规范](https://www.w3.org/TR/webtransport/#web-transport-error-interface) | [文档](https://developer.mozilla.org/en-US/docs/Web/API/WebTransportError) | [文档](https://developer.chrome.com/docs/capabilities/web-apis/webtransport) | [说明文档](https://github.com/w3c/webtransport/blob/main/explainer.md)

## 新的源试用

### [Web Authentication 条件式界面的被动模式](https://chromestatus.com/feature/5068149209825280)

这是 navigator.credentials.get() 的一种新模式，供网站使用通行密钥或密码登录时使用。部分文档将该模式称为「Ambient」。

此模式与条件调解（Conditional Mediation，也称条件式界面）类似。页面可以调用它，只有当用户具有凭据时才显示界面。如果用户没有可用的登录凭据，Promise 将一直处于待定状态。

被动模式无需自动填充界面，因此页面上也无需有登录表单。它以非模态建议的形式提供登录选项。该选项应足够清晰，让用户认出可以便捷登录，也应尽量少打扰用户，让用户可以选择忽略它。

被动模式兼容现有条件调解。如果页面有登录表单，一次 JavaScript 调用即可让凭据同时出现在被动模式界面和自动填充界面中。

[源试用](https://developer.chrome.com/origintrials#/view_trial/942941171980697601) | [跟踪问题 #532206357](https://issues.chromium.org/issues/532206357) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5068149209825280) | [规范](https://github.com/w3c/webauthn/pull/2485) | [说明文档](https://github.com/w3c/webauthn/blob/main/explainers/conditional-ui-without-autofill.md) | [演示](https://kenrb.github.io/test/ambient/index.html)

---

来源：[ChromeStatus Chrome 159 版本说明](https://chromestatus.com/release-notes/159)。本页为 ChatGPT 根据英文正文制作的非官方简体中文译文。页面源码含 Copyright 2016 Google Inc. All Rights Reserved 及 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) 声明。

发布核验：[ChromiumDash Windows Stable 记录](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=159&num=1000)和[官方 Early Stable 公告](https://chromereleases.googleblog.com/2026/11/early-stable-update-for-desktop_01707050408.html)确认 2026-11-18（UTC）已向少量 Windows 和 Mac 用户推送 159.0.8154.13/.14。Windows Stable 首条匹配记录为 159.0.8154.13，时间为 18:53:23.819 UTC。上方保留 ChromeStatus 正文的 Beta 标记和计划日期。
