# Chrome 155 发布说明

预览

计划的 Stable 发布日期：2026 年 10 月 6 日

## 能力（Fugu）

### [更多窗口控制能力](https://chromestatus.com/feature/5201832664629248)

允许具有 window-management 权限的 Web 应用通过 maximize()、minimize() 和 restore() 将窗口最大化、最小化和还原，并通过 setResizable() 禁止调整窗口大小。此外，新增的 CSS 媒体特性 display-state 和 resizable 使脚本和内容能够适应相应的窗口状态及其是否可调整大小。这些特性改善了 Web 客户端中 VDI 远程应用窗口的可用性，尤其是标题栏窗口控件的使用体验。新增功能扩展了现有 Window Management API 的能力：[https://chromestatus.com/feature/5252960583942144](https://chromestatus.com/feature/5252960583942144)

[问题跟踪 #40192345](https://issues.chromium.org/issues/40192345) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5201832664629248) | [规范](https://www.w3.org/TR/window-management/#api-window-minimize-method) | [设计说明](https://github.com/w3c/window-management/blob/main/EXPLAINER_additional_windowing_controls.md) | [演示](https://awc-demo-4a08a808.web.app)

## 安全

### [WebCrypto 算法更新](https://chromestatus.com/feature/5198951632470016)

在 Web Cryptography API 可用的加密算法集合中加入后量子密码算法和一种常见的对称 AEAD 算法。这让开发者能够使用浏览器提供的、经 NIST 标准化的常见抗量子密码算法实现。

- ML-KEM - 768, 1024
- ML-DSA - 44, 65, 87
- ChaCha20-Poly1305
- X-Wing

[问题跟踪 #450627017](https://issues.chromium.org/issues/450627017) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5198951632470016) | [规范](https://wicg.github.io/webcrypto-modern-algos)

## CSS

### [CSS Symbols()](https://chromestatus.com/feature/5146996093616128)

CSS symbols() 函数允许开发者以内联方式定义计数器样式，无需先声明具名的 @counter-style at 规则。它根据一组字符串符号以及一个可选的计数系统（cyclic、numeric、alphabetic、symbolic 或 fixed）构建匿名计数器样式，可用作 list-style-type、list-style 简写属性以及 counter() / counters() 中的计数器样式。

[问题跟踪 #40747844](https://issues.chromium.org/issues/40747844) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5146996093616128) | [规范](https://drafts.csswg.org/css-counter-styles-3/#symbols-function) | [设计说明](https://developer.mozilla.org/docs/Web/CSS/symbols) | [演示](https://developer.mozilla.org/en-US/docs/Web/CSS/symbols)

### [CSS4 text-decoration-skip-spaces](https://chromestatus.com/feature/4832783806627840)

text-decoration-skip-spaces CSS 属性控制文本装饰线（下划线、上划线、删除线等）是否跳过空白字符。开发者可以借此避免在空格下方绘制装饰线，这通常能获得更美观的视觉效果。

[问题跟踪 #40862777](https://issues.chromium.org/issues/40862777) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4832783806627840) | [规范](https://drafts.csswg.org/css-text-decor-4/#text-decoration-skip-spaces-property) | [演示](http://wpt.live/css/css-text-decor/text-decoration-skip-spaces-001.html) | [演示](http://wpt.live/css/css-text-decor/text-decoration-skip-spaces-002.html) | [演示](http://wpt.live/css/css-text-decor/text-decoration-skip-spaces-003.html) | [演示](http://wpt.live/css/css-text-decor/text-decoration-skip-spaces-004.html)

### [Margin-trim](https://chromestatus.com/feature/5197863732772864)

`margin-trim` CSS 属性可用于省略容器第一个或最后一个子元素之前或之后的外边距。常规块容器和多列容器支持此属性。

这种效果与怪异模式下 BODY 和表格单元格内的 P、H1、H2... 元素所应用的外边距怪异行为有些相似，但功能更强、更通用，表达能力也更丰富。

注意：规范的早期版本也将此属性应用于 flex 和 grid 容器，但这部分已被移除。

[问题跟踪 #40886857](https://issues.chromium.org/issues/40886857) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5197863732772864) | [规范](https://drafts.csswg.org/css-box-4/#margin-trim)

## 其他

### [Digital Credentials API（凭据签发支持）](https://chromestatus.com/feature/5099333963874304)

这项 Web 平台功能允许签发机构的网站（例如大学、政府机构或银行）安全地启动数字凭据的配置（签发）流程，将其直接交付到用户的移动钱包应用中。在 Android 上，这项能力利用 Android IdentityCredential CredMan 系统（Credential Manager）。在桌面端，它利用基于 CTAP 协议的跨设备方式，与数字凭据出示的方式类似。

[问题跟踪 #378330032](https://crbug.com/378330032) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5099333963874304) | [规范](https://w3c-fedid.github.io/digital-credentials) | [设计说明](https://github.com/w3c-fedid/digital-credentials/blob/main/explainer.md)

### [chrome.debugger API 的主机和截图限制](https://chromestatus.com/feature/5072259281715200)

[`chrome.debugger` 扩展 API](https://developer.chrome.com/docs/extensions/reference/api/debugger) 允许向指定的 `target`（例如标签页、iframe 或 Service Worker）发送 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) 命令。连接（附加）到目标时，此 API 现在可以通过检查企业主机和截图策略，在受管理的浏览器中强制执行权限限制。

在企业设备上，某些策略可以在附加时（browser.debugger.attach()）以全有或全无的方式限制扩展附加调试器：

- 对于主机，可以配置 [ExtensionSettings](https://chromeenterprise.google/policies/#ExtensionSettings) 企业策略，为扩展屏蔽主机，此时返回错误 `Host access is restricted by policy`。
- 对于截图，如果 [DisableScreenshots](https://chromeenterprise.google/policies/#DisableScreenshots) 企业策略禁用了截图，或适用了数据丢失防护（DLP）规则，则返回错误 `Screenshot capture is restricted by policy`。

开发者可以妥善处理附加请求被拒绝的情况，或使用 [`chrome.scripting`](https://developer.chrome.com/docs/extensions/reference/api/scripting) 和 [`chrome.declarativeNetRequest`](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest) 等更高层 API；这些 API 在受限制的企业环境中支持细粒度的来源权限。

[问题跟踪 #533240995](https://g-issues.chromium.org/issues/533240995) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5072259281715200)

### [PredefinedColorSpace 的 srgb-linear 和 display-p3-linear](https://chromestatus.com/feature/5122501071994880)

向 PredefinedColorSpace 添加由 CSS 定义的 srgb-linear 和 display-p3-linear 色彩空间，供画布使用。

[问题跟踪 #454152417](https://issuetracker.google.com/issues/454152417) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5122501071994880) | [规范](https://html.spec.whatwg.org/multipage/canvas.html#colour-spaces-and-colour-correction)

## JavaScript

### [导入文本（文本模块）](https://chromestatus.com/feature/5191512456560640)

这是一项 TC39 提案，为 JavaScript 添加模块 `import … with { type: "text" }` 语句。该导入属性将文本数据加载为字符串值。

[问题跟踪 #494350643](https://issues.chromium.org/issues/494350643) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5191512456560640) | [规范](https://tc39.es/proposal-import-text) | [设计说明](https://github.com/tc39/proposal-import-text) | [设计说明](https://github.com/whatwg/html/pull/11933) | [设计说明](https://github.com/w3c/webappsec-csp/pull/794)

## 多媒体

### [Blink 中的 JPEG XL 解码支持（image/jxl）](https://chromestatus.com/feature/5114042131808256)

使用 jxl-rs（采用纯 Rust 编写、具有内存安全性的解码器，[https://github.com/libjxl/jxl-rs](https://github.com/libjxl/jxl-rs)）在 Blink 中添加 JPEG XL（image/jxl）图像解码支持。JPEG XL 是按 ISO/IEC 18181 标准化的现代图像格式，支持渐进式解码以改善用户感知的加载性能，并支持广色域、HDR、高位深和动画。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5114042131808256) | [规范](https://www.iso.org/standard/85066.html)

### [暂停不可见 iframe 中的媒体播放](https://chromestatus.com/feature/5082950457884672)

新增 "media-playback-while-not-visible" 权限策略，允许嵌入方暂停当前隐藏的嵌入式 iframe 中可听见的媒体播放。隐藏状态包括："display" 属性为 "none"、"visibility" 属性为 "hidden"，或者面积为零（宽度或高度等于 0）。隐藏期间，嵌入式 iframe 尝试输出可听见的媒体内容会被阻止。iframe 再次显示时，这些限制应当解除。通过让浏览器处理用户不可见内容的播放，开发者应当能够构建更友好的用户体验，并改善性能。

[问题跟踪 #351354996](https://issues.chromium.org/issues/351354996) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5082950457884672) | [规范](https://wicg.github.io/iframe-media-pausing) | [设计说明](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/IframeMediaPause/iframe_media_pausing.md) | [演示](https://gabrielsanbrito.github.io/media-playback-while-not-visible)

## 图形

### [WebGPU：atomic-vec2u-min-max](https://chromestatus.com/feature/4882016087703552)

允许在 WGSL 中对 `atomic<vec2u>` 使用 64 位原子最小值和最大值运算。

这样，WebGPU 着色器开发者无需依赖完整的 64 位整数支持，就能实现某些使用 64 位原子操作的算法。

[问题跟踪 #453689550](https://crbug.com/453689550) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4882016087703552) | [规范](https://www.w3.org/TR/webgpu/#dom-gpufeaturename-atomic-vec2u-min-max) | [设计说明](https://github.com/gpuweb/gpuweb/issues/5071)

## 网络 / 连接

### [WebTransport 数据报可读流类型](https://chromestatus.com/feature/5148774971342848)

新增 WebTransportOptions.datagramsReadableType 构造选项。默认情况下，传入的 WebTransport 数据报通过默认类型的 ReadableStream 提供。需要 BYOB 读取的应用可以设置 datagramsReadableType: "bytes"，请求可读字节流。

[问题跟踪 #547572475](https://issues.chromium.org/issues/547572475) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5148774971342848) | [规范](https://www.w3.org/TR/webtransport/#dom-webtransportoptions-datagramsreadabletype) | [设计说明](https://github.com/w3c/webtransport/blob/main/explainer.md)

### [WebTransport 数据报可写流及优先级](https://chromestatus.com/feature/5183354944225280)

新增现代化的 WebTransport 数据报发送 API。

WebTransportDatagramDuplexStream.createWritable() 创建独立的 WebTransportDatagramsWritable 流。每个可写流都具有可修改的 sendGroup 和 sendOrder 属性，用于表达同一发送组内已排队的 WebTransport 数据之间的相对优先级。Chromium 目前在数据报可写流之间应用这一排序。

实现还会报告协商得到的传出数据报最大负载大小，并按 WebTransport 规范的要求丢弃过大的写入。

[问题跟踪 #547572475](https://issues.chromium.org/issues/547572475) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5183354944225280) | [规范](https://www.w3.org/TR/webtransport/#datagram-writable) | [设计说明](https://github.com/w3c/webtransport/blob/main/explainer.md#5-sending-and-receiving-datagrams)

### [WebTransport 接收流](https://chromestatus.com/feature/5109912169480192)

新增标准化的 WebTransportReceiveStream 接口，它是 ReadableStream 的子类，用于传入的单向流以及双向流的可读端。其 getStats() 方法返回每个流的字节计数器：bytesReceived 报告从网络接收的字节数，bytesRead 报告已交付给应用的字节数。

[问题跟踪 #568317222](https://issues.chromium.org/issues/568317222) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5109912169480192) | [规范](https://w3c.github.io/webtransport/#webtransportreceivestream) | [设计说明](https://github.com/w3c/webtransport/issues/372) | [设计说明](https://github.com/w3c/webtransport/pull/395)

### [WebTransport 可靠性属性](https://chromestatus.com/feature/5094058497277952)

新增 WebTransport.reliability 实例属性和静态属性 WebTransport.supportsReliableOnly。这些 API 表明用户代理是否支持仅通过可靠连接使用 WebTransport，以及已建立的会话是否支持数据报等不可靠传输。

在 Chromium 中，reliability 最初返回 "pending"，建立 HTTP/3 WebTransport 连接后变为 "supports-unreliable"。由于 Chromium 目前不支持回退到 HTTP/2，WebTransport.supportsReliableOnly 返回 false；所有成功建立的会话均使用 HTTP/3，并支持不可靠数据报。

[问题跟踪 #545636884](https://issues.chromium.org/issues/545636884) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5094058497277952) | [规范](https://www.w3.org/TR/webtransport/#dom-webtransport-reliability) | [设计说明](https://github.com/w3c/webtransport/blob/main/explainer.md#transport-modes)

---

来源：[ChromeStatus Chrome 155 发布说明](https://chromestatus.com/release-notes/155)。本页是对英文页面正文格式转换稿的非官方中文翻译；省略了导航和复制链接控件。页面源码标示 Copyright 2016 Google Inc. All Rights Reserved，并附有 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) 许可声明。

发布核验：[ChromiumDash Windows Stable 记录](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=155&num=1000)。最早的匹配实际 Stable 记录为 155.0.8059.12，发布时间为 2026-09-23（UTC）。上文保留了文章中的计划日期，该日期不用于本站的发布日期。
