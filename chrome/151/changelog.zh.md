# Chrome 151

来源：[Chrome 151 Release Notes](https://developer.chrome.com/release-notes/151?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2026 年 7 月 28 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 151 稳定渠道版本。

只想了解重点？请参阅 [Chrome 151 新功能](https://developer.chrome.com/blog/new-in-chrome-151)。

## CSS 和界面

### 动画和过渡事件上的 animation 访问器

向 `AnimationEvent` 和 `TransitionEvent` 接口添加只读的 `animation` 属性，返回触发事件的关联 `Animation` 对象。

[跟踪问题 #40929813](https://issues.chromium.org/issues/40929813) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6046278267043840) | [规范](https://drafts.csswg.org/css-animations-2/#interface-animationevent)

### CSS `ruby-overhang` 属性

支持 CSS `ruby-overhang` 属性。该属性接受 `auto`、`spaces` 或 `none` 关键字，用于控制注音标注文本的悬垂。按照 CSS 工作组规范，`none` 是 `spaces` 的别名，意味着文本只能悬垂到空白和中日韩标点之上。这可以避免不必要的布局空隙，同时保持文字可读性。

[跟踪问题 #366873207](https://issues.chromium.org/issues/366873207) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6560118298771456) | [规范](https://drafts.csswg.org/css-ruby/#ruby-overhang)

### 将 `position-anchor` 初始值改为 `normal`

将 CSS `position-anchor` 属性的初始值从 `none` 改为 `normal`，以符合规范并与其他浏览器一致。如果 CSS `position-area` 属性为 `none`，`normal` 的行为与 `none` 相同；否则与 `auto` 相同。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5351959625334784) | [规范](https://drafts.csswg.org/css-anchor-position-1/#position-anchor)

### `AnimationTrigger` 播放方法不再自动倒回

当与 `AnimationTrigger` 关联的动画已经播放完毕时，触发 `play`、`play-forwards` 或 `play-backwards` 操作不再导致动画重新开始或自动倒回。

[跟踪问题 #519573765](https://issues.chromium.org/issues/519573765) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5071640598806528) | [规范](https://drafts.csswg.org/animation-triggers-1/#valdef-animation-action-play)

## DOM 和 HTML

### 声明式 Shadow DOM：`shadowrootslotassignment` 属性

向 `<template>` 元素添加 `shadowrootslotassignment` 属性，让声明式 Shadow Root 能使用手动插槽分配。以前只能通过 `attachShadow({slotAssignment: "manual"})` 以命令式方式启用。该属性接受 `named`（默认，保持现有行为）和 `manual`，并映射到 `HTMLTemplateElement` 的 `shadowRootSlotAssignment` 属性。

[跟踪问题 #493315747](https://issues.chromium.org/issues/493315747) | [ChromeStatus.com 条目](https://chromestatus.com/feature/517682139344896) | [规范](https://html.spec.whatwg.org/#attr-template-shadowrootslotassignment)

### 在非 XSLT 场景使用 Rust 解析 XML

为提升浏览器安全性并防御内存相关漏洞，Chrome 正将常见的非 XSLT 场景的 XML 解析引擎更新为内存安全的 Rust 实现。该更新在完全兼容 Web 规范的同时消除潜在的内存破坏问题。新解析器处理 `DOMParser`、`XMLHttpRequest.responseXML`、独立 SVG 图像文档及外部 SVG 图像资源。

[跟踪问题 #466303347](https://issues.chromium.org/issues/466303347) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5309598397497344) | [规范](https://www.w3.org/TR/xml)

## 性能与网络

### 跨源重定向计时选择加入

服务器可以选择允许导航的目标来源测量其跨源重定向。这让开发者能够测量并优化自己所控制导航的重定向延迟。

[跟踪问题 #521861828](https://issues.chromium.org/issues/521861828) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5078310347472896) | [规范](https://github.com/whatwg/fetch/pull/1931)

### 导航：忽略重复导航

避免快速连续发起的新导航与正在进行的导航相同时，不必要地取消后者。此优化减少了意外双击造成的重复请求和网络资源浪费，改善性能与用户体验。

[跟踪问题 #366060351](https://issues.chromium.org/issues/366060351) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5137490012930048) | [规范](https://github.com/whatwg/html/pull/11765)

### `PerformanceSoftNavigation` 与 `InteractionContentfulPaint` 性能条目

向性能时间线添加 `soft-navigation` 和 `interaction-contentful-paint` 条目类型，用于跟踪单页应用（SPA）中由交互驱动的性能。`interaction-contentful-paint` 报告用户交互修改的页面区域内新绘制的内容，帮助开发者了解交互加载延迟，包括跨异步获取请求的情况。`soft-navigation` 报告由交互发起的同文档历史状态变化，建立新的时间原点，使后续性能数据归属于当前路由，而不是初始文档 URL。

[跟踪问题 #1338390](https://issues.chromium.org/issues/1338390) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5144837209194496) | [规范](https://wicg.github.io/soft-navigations)

### 权限政策合并：将 `direct-sockets-private` 并入 `local-network` 与 `loopback-network`

用更细粒度的 `local-network` 和 `loopback-network` 权限政策取代现有的 `direct-sockets-private`。隔离 Web 应用清单现在需要声明对应政策，才能使用 Direct Sockets 连接本地或环回网络地址。这让开发者能更精确地控制网络访问，也让清单中的网络需求更清晰。

[ChromeStatus.com 条目](https://chromestatus.com/feature/6046077976444928) | [规范](https://wicg.github.io/direct-sockets/#permissions-policy-pna)

### Speculation Rules：`form_submission` 字段

扩展推测规则语法，允许开发者为预渲染指定 `form_submission` 字段。浏览器据此将预渲染准备为表单提交，使真实的表单提交导航（例如搜索表单产生的 GET 请求导航）可以激活它。

[跟踪问题 #346555939](https://issues.chromium.org/issues/346555939) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5074313831120896) | [规范](https://storage.googleapis.com/spec-previews/WICG/nav-speculation/pull/426/diff/prerendering.html)

### `Response`、`Request` 和 `Blob` 的 `textStream()`

向表示字节流的接口（`Request`、`Response` 和 `Blob`）添加 `textStream()` 方法。它是将字节流传入 `TextDecoderStream()` 的便捷简写。

[跟踪问题 #514448226](https://issues.chromium.org/issues/514448226) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5146752165478400) | [规范](https://github.com/whatwg/fetch/pull/1862)

## 媒体、传感器和输入

### 能力元素：`<usermedia>` 最小可用版本

引入声明式 `<usermedia>` 能力元素，它是由浏览器控制、用于启动和操作媒体流的控件。将浏览器控制的元素嵌入页面后，用户点击会在触发权限提示前提供明确的主动使用信号。这改善了权限提示体验，也为此前拒绝过权限的用户提供直接的恢复路径。

[跟踪问题 #443013457](https://issues.chromium.org/issues/443013457) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4926233538330624) | [规范](https://w3c.github.io/mediacapture-extensions/#media-capture-html-elements)

### `DeviceOrientation` 事件权限请求 API

Web 开发者可以调用 `DeviceOrientationEvent.requestPermission()` 和 `DeviceMotionEvent.requestPermission()`，请求用户代理将设备方向与运动数据共享给页面。这些静态方法返回 Promise，根据用户是否允许共享传感器数据，兑现为 `granted` 或 `denied`。

[跟踪问题 #947112](https://issues.chromium.org/issues/947112) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5915984063889408) | [规范](https://w3c.github.io/deviceorientation/)

### 滚轮事件动量

在滚轮事件上暴露布尔型 `momentum` 属性，用于识别由原生平台滚动惯性产生的事件。用户在快速滑动后抬起触控板上的手指，原生平台仍会继续触发滚轮事件来模拟惯性。`momentum` 属性区分这些模拟事件与真实触控板交互，使开发者可以忽略甩动事件，或定制丰富的惯性效果。

[跟踪问题 #40704952](https://issues.chromium.org/issues/40704952) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6631012282007552) | [规范](https://w3c.github.io/pointerevents/#dom-wheelevent-momentum)

## 无障碍与 Web Speech

### `aria-actions` 属性

支持 `aria-actions` 属性。对于将次要操作放在复合交互组件内部的界面模式，开发者可以借助 `aria-actions` 直接向辅助技术暴露这些次要操作按钮，便于发现。

[跟踪问题 #514751946](https://issues.chromium.org/issues/514751946) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5161589307867136) | [规范](https://github.com/w3c/aria/pull/1805)

### Web Speech API：不必说出标点

向 Web Speech API 的 `SpeechRecognition` 接口添加布尔型 `unspokenPunctuation` 属性。启用（`true`）后，语音识别引擎会根据自然停顿、语法结构和语调自动推断并插入句号、逗号、问号等标点，无需用户明确说出标点命令。

[跟踪问题 #514764702](https://issues.chromium.org/issues/514764702) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4785284026859520) | [规范](https://webaudio.github.io/web-speech-api)

## 人工智能

### `LanguageDetector` 区分繁体与简体中文

为 Language Detector API 添加 `zh-Hant`（繁体中文）和 `zh-Hans`（简体中文）两个新的可检测语言代码。此前返回 `zh` 的检测结果现在将返回其中一个更具体的值。

[跟踪问题 #519251262](https://issues.chromium.org/issues/519251262) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5138651886518272) | [规范](https://webmachinelearning.github.io/translation-api/#language-detector-api)

## 来源试用

### WebCrypto 算法更新

向 Web Cryptography API 添加后量子密码算法和一种通用对称 AEAD 算法，使开发者可以使用浏览器提供的 NIST 标准抗量子算法实现：ML-KEM（768、1024）、ML-DSA（44、65、87）、ChaCha20-Poly1305 和 X-Wing。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/1379790335835635713) | [跟踪问题 #450627017](https://issues.chromium.org/issues/450627017) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5198951632470016) | [规范](https://wicg.github.io/webcrypto-modern-algos)

### 声明式 Performance Observer

提出一种可靠、驻留于浏览器中的遥测系统，使用声明式 HTTP 响应头报告从导航开始到页面终止的性能指标。这样即使请求因网络错误失败，或渲染器进程被操作系统终止，也能捕获遥测数据。

[跟踪问题 #505208781](https://issues.chromium.org/issues/505208781) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6594955352080384)

### 预取激活信标

引入 `on-prefetch-activation` HTTP 响应头，让服务器指定一个遥测端点。预取资源每次用于导航时，浏览器都会通知该端点，为开发者衡量预取策略的准确性与性能影响提供可靠信号。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/3433431765916581889) | [跟踪问题 #499814382](https://issues.chromium.org/issues/499814382) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5118934710878208) | [规范](https://github.com/explainers-by-googlers/prefetch-activation-beacon)

### WebRTC 数据通道：SCTP 协商加速协议

将流控制传输协议（SCTP）的初始化参数直接嵌入会话描述协议（SDP）的 Offer/Answer 交换，加快 WebRTC 数据通道建立。这样最多可减少两个网络往返时间。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/3793719736106221569) | [跟踪问题 #426480601](https://issues.chromium.org/issues/426480601) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5137946677215232) | [规范](https://datatracker.ietf.org/doc/draft-hancke-tsvwg-snap)

## 弃用与移除

### Chrome 151 不再支持 macOS 12

Chrome 150 是最后一个支持 macOS 12 的版本。从 Chrome 151 起，需要 macOS 13 或更高版本。在运行 macOS 12 的 Mac 上，Chrome 仍可继续运行并显示信息栏警告，但不再获得安全或功能更新。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5077742779498496)

### 从 `FontFaceSet` IDL 中移除 `[LegacyNoInterfaceObject]`

从 `FontFaceSet` IDL 中移除 `[LegacyNoInterfaceObject]`，使 `FontFaceSet` 作为全局属性正确暴露在 `window` 对象上。由于 IDL 中未定义构造函数，现在从 JavaScript 调用 `new FontFaceSet()` 会抛出 `TypeError: Illegal constructor`，符合规范并与 Firefox、Safari 保持一致。

[跟踪问题 #477568263](https://issues.chromium.org/issues/477568263) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5123999844663296) | [规范](https://drafts.csswg.org/css-font-loading/#fontfaceset)
