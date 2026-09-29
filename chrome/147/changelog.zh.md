# Chrome 147

来源：[Chrome 147 Release Notes](https://developer.chrome.com/release-notes/147?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2026 年 4 月 7 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 147 稳定渠道版本。

只想了解重点？请参阅 [Chrome 147 新功能](https://developer.chrome.com/blog/new-in-chrome-147)。

## CSS 和界面

### 元素范围的视图过渡

在任意 HTML 元素上开放 `element.startViewTransition()`。该元素建立过渡作用域，因此过渡伪元素会受到祖先裁剪和变换的影响，而不同元素上的多个过渡可并行运行。

[跟踪问题 #394052227](https://issues.chromium.org/issues/394052227) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5109852273377280) | [规范](https://drafts.csswg.org/css-view-transitions-2)

### CSS `contrast-color()`

此函数有助于满足无障碍对比度要求。

CSS 中凡是需要颜色值的地方都可使用 `contrast-color()`。它接受一个颜色参数，并返回与该颜色对比度最高的 'black' 或 'white'。

[跟踪问题 #40142548](https://issues.chromium.org/issues/40142548) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4841046007742464) | [规范](https://drafts.csswg.org/css-color-5/#contrast-color)

### 时间线具名范围 `scroll`

为视图时间线的现有 `entry`、`exit`、`cover` 和 `contain` 具名范围增加 `scroll` 范围。

[跟踪问题 #41483848](https://issues.chromium.org/issues/41483848) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6522328437620736) | [规范](https://drafts.csswg.org/scroll-animations-1/#valdef-animation-timeline-range-scroll)

### CSS `border-shape` 属性

CSS `border-shape` 属性允许创建任意形状的非矩形边框，例如多边形、圆形或 `shape()`。

虽然 `border-shape` 接受与 `clip-path` 相同的形状，但两者本质不同：`border-shape` 定义并装饰边框形状，仅裁剪其内部。

`border-shape` 有两个变体：一个沿形状描边，另一个填充两个形状之间的区域。

[跟踪问题 #370041145](https://issues.chromium.org/issues/370041145) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5459864205393920) | [规范](https://drafts.csswg.org/css-borders-4/#border-shape)

### `CSSPseudoElement` 接口

`CSSPseudoElement` 接口在 JavaScript 中表示伪元素。

它由 `Element.pseudo(type)` 返回，当前 `type` 可为 `::after`、`::before` 或 `::marker`。`CSSPseudoElement` 是表示伪元素的代理对象；与伪元素不同，它始终存在。

`CSSPseudoElement` 具有以下属性和方法：

- `type` 属性是表示伪元素类型的字符串。
- `element` 属性是伪元素最终的源元素。
- `parent` 属性是伪元素直接的源元素，对于嵌套伪元素，可以是 `Element` 或 `CSSPseudoElement`。
- `pseudo(type)` 方法获取嵌套伪元素。

[跟踪问题 #40639103](https://issues.chromium.org/issues/40639103) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5194399398756352) | [规范](https://www.w3.org/TR/css-pseudo-4/#CSSPseudoElement-interface)

### 事件上的伪目标

特定事件现包含 `.pseudoTarget`，如果交互发生在伪元素上，其值为 `CSSPseudoElement`，否则为 `null`。

它提供更具体的事件来源信息。例如，它可表示用户点击的是 `::after` 伪元素，而不只是最终源元素（`Event.target`）。`Event.target` 本身保持不变，因此事件只是额外提供了伪元素交互信息。

适用事件包括 `UIEvent`、`AnimationEvent` 与 `TransitionEvent`。

`mouseover`、`mouseout`、`mouseenter`、`mouseleave` 及其 `pointer*` 对应事件尚不支持。

[跟踪问题 #40639103](https://issues.chromium.org/issues/40639103) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5179328935624704) | [规范](https://github.com/w3c/uievents/pull/413/changes)

### 解耦 `*-width` 与 `*-style` 属性

Chrome 147 调整 `border-width`、`outline-width` 和 `column-rule-width` 的行为，以符合更新后的 [CSS 规范](https://www.w3.org/TR/css-2025/)。此前，如果对应的 `border-style`、`outline-style` 或 `column-rule-style` 为 `none` 或 `hidden`，这些属性的计算宽度会被强制设为 `0px`，无论作者指定的值是什么。

更新后，`border-width`、`outline-width` 和 `column-rule-width` 的计算值始终反映作者指定的值，不再依赖 `*-style` 属性。此外，`getComputedStyle()` 返回的 `outline-width` 和 `column-rule-width` 解析值也会反映指定值。

Firefox 和 WebKit 已实现此行为，此次调整使 Chrome 与它们一致。

[跟踪问题 #393631108](https://issues.chromium.org/issues/393631108) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5133099851317248) | [规范](https://github.com/w3c/csswg-drafts/pull/11913/files)

### SVG `<textPath>` 元素支持 `path` 属性

为 SVG `<textPath>` 元素添加 `path` 属性，开发者可直接使用 SVG 路径数据在元素内定义文本路径几何形状，无需单独定义 `<path>` 元素。

`<textPath>` 按以下规则确定文本路径几何形状：

1. 同时存在 `path` 与 `href` 时，使用 `path` 属性中的几何形状。
2. 只有 `path` 时，如果它解析成功，使用行内路径定义。
3. 没有 `path` 或解析失败，但提供了 `href` 时，退回引用的 `<path>` 元素。
4. 仅有 `href` 时的现有行为不变。

此实现遵循 SVG 2 对 `<textPath>` 的 `path` 属性定义。解析行为与其他浏览器引擎一致，改善互通性和标准符合性。请注意：同时指定 `path` 与 `href` 时，按照 SVG 2 规范，`path` 现在优先。

[跟踪问题 #374010056](https://issues.chromium.org/issues/374010056) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5157546589552640) | [规范](https://svgwg.org/svg2-draft/text.html#TextPathElement)

## 设备

### WebXR 平面检测

WebXR Plane Detection API 允许网站取得用户环境中检测到的平面集合。相比使用 WebXR 深度感知功能，开发者需要完成的工作更少，功能也更强。例如，如果系统知道墙面的边界，即使它被其他物体遮挡，也能完整表示该墙面；深度图虽然显示墙面，但前方物体会将其切分，可能掩盖墙面的完整范围。设备知道语义标签且标签符合预定义类别时，也会暴露这些信息，帮助应用更好地理解环境。

[跟踪问题 #394636076](https://issues.chromium.org/issues/394636076) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5177993049800704) | [规范](https://immersive-web.github.io/plane-detection)

## DOM

### `link rel=modulepreload` 支持 JSON 和样式

新增对 JSON 和样式模块类型作为 `<link rel="modulepreload">` 目标的支持。Chromium 已支持 `<link rel="modulepreload">`（见 [ChromeStatus 功能](https://chromestatus.com/feature/5762805915451392)），但此前仅能预加载类似脚本的模块脚本。由于 Chromium 其他地方已支持 JSON 与 CSS 模块脚本，这填补了它们不能作为预加载目标的功能缺口。可使用 `<link rel="modulepreload" as="style" href="...">` 预加载样式模块，或使用 `<link rel="modulepreload" as="json" href="...">` 预加载 JSON 模块。

[跟踪问题 #466888680](https://issues.chromium.org/issues/466888680) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5202661416763392) | [规范](https://github.com/whatwg/html/pull/11981)

### 非 XSLT 场景使用 Rust 解析 XML

在不需要 XSLT 处理的场景实现 Rust XML 解析器。

Rust XML 解析器消除 XML 解析中的内存破坏问题，提升安全性；它以安全实现取代用 C 编写的 `libxml2`。

XSLT 正在弃用中。在这一过程继续进行的同时，不需要 XSLT 的场景已可使用安全的 Rust XML 解析。

[跟踪问题 #466303347](https://issues.chromium.org/issues/466303347) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5309598397497344)

## 图形

### WebXR Layers

WebXR Layers 提供更高效的沉浸式内容绘制方式。

除了支持原生颜色与深度纹理及纹理数组，还支持由系统合成器（而非 JavaScript）管理的不同图层类型。

[跟踪问题 #409255534](https://issues.chromium.org/issues/409255534) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6634466544058368) | [规范](https://www.w3.org/TR/webxrlayers-1)

## JavaScript

### `Math.sumPrecise`

实现 TC39 提案，在 JavaScript 中添加求多个值之和的方法。

新增接受可迭代对象的 `Math.sumPrecise` 方法，使用比朴素求和更精确的算法，返回可迭代对象中各值的总和。

[跟踪问题 #374310075](https://issues.chromium.org/issues/374310075) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4790090146643968) | [规范](https://github.com/tc39/proposal-math-sum)

## 网络与连接

### `Request.isReloadNavigation` 属性

向 Fetch API 的 `Request` 接口添加只读布尔属性 `isReloadNavigation`，表示当前导航请求是否由用户触发的重新加载发起，例如点击**刷新**按钮、调用 `location.reload()` 或 `history.go(0)`。该信号主要在 Service Worker 的 `FetchEvent` 中的 `Request` 对象上开放。

[跟踪问题 #40487194](https://issues.chromium.org/issues/40487194) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5154214529597440) | [规范](https://fetch.spec.whatwg.org/#dom-request-isreloadnavigation)

## 性能

### 更新 Device Memory API 的取值范围

Device Memory API 改用以下可能的值：

- Android：1、2、4、8。
- 其他平台：2、4、8、16、32。这些值取代过时的 0.25、0.5、1、2、4 和 8。

设备能力自最初设定这些值以来已提升，此变更减少低端设备的指纹识别风险；同时也可按照开发者需求，更好地区分和利用高端设备。详情参阅 [Device Memory 问题](https://github.com/w3c/device-memory/issues/50)。

[跟踪问题 #454354290](https://issues.chromium.org/issues/454354290) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6330376953921536) | [规范](https://github.com/w3c/device-memory/pull/53)

## 本地网络访问（LNA）

有关 LNA 的更多信息，请参阅[本地网络访问](https://developer.chrome.com/blog/local-network-access)。

### 对 Service Worker 的 `WindowClient.navigate()` 实施本地网络访问限制

近期增加的本地网络访问（LNA）限制防止网站单方面向本地网络和设备发起请求。此前已限制 Service Worker 发起的 fetch 请求，但未覆盖 Service Worker 通过 `WindowClient.navigate()` 执行的导航。

此次通过对 `WindowClient.navigate()` 调用施加 LNA 限制，填补了这一缺口。浏览器以 `WindowClient` 作为导航发起方，判断导航是否属于 LNA 请求。

该限制仅适用于被导航的 `WindowClient` 是子 frame 的情况。Chrome 目前不对主 frame 导航强制实施 LNA 限制。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5172375182245888)

### WebTransport 的本地网络访问限制

限制通过 WebTransport 向用户本地网络发起请求，并通过权限提示控制。

本地网络请求包括公共网站向本地 IP 地址或环回地址发起的请求，以及本地网站（如内网网站）向环回地址发起的请求。通过权限控制网站发起此类请求的能力，可减少网站借此对用户本地网络进行指纹识别。

此权限仅在安全上下文中可用。

[跟踪问题 #421216834](https://issues.chromium.org/issues/421216834) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5126430912544768) | [规范](https://wicg.github.io/local-network-access/#integration-with-webtransport)

### WebSocket 的本地网络访问限制

本地网络访问（LNA）限制扩展至 WebSocket。连接到本地地址的 WebSocket 现在会触发权限提示。

当前所有 LNA 企业政策仍适用，包括 `LocalNetworkAccessAllowedForUrls`、`LocalNetworkAccessBlockedForUrls` 和 `LocalNetworkAccessRestrictionsTemporaryOptOut`。

[跟踪问题 #421156866](https://issues.chromium.org/issues/421156866) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5197681148428288) | [规范](https://wicg.github.io/local-network-access/#integration-with-websockets)

## 隔离 Web 应用（IWA）

### Web Printing API

此 API 让隔离 Web 应用能够更深入地集成打印机相关功能。

它仅面向隔离 Web 应用，并遵循[隔离 Web 应用流程](https://www.chromium.org/blink/launching-features/isolated-web-apps/)。

它提供一组 JavaScript 方法，允许开发者查询本地打印机、向最合适的打印机提交打印任务，并管理任务选项及状态。相关概念的表示依赖互联网打印协议（IPP）规范中的属性名称和语义。

[跟踪问题 #302505962](https://issues.chromium.org/issues/302505962) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5100352332627968) | [规范](https://wicg.github.io/web-printing)

## 来源试用

### 预渲染跨源 iframe

通过主动启用的响应头预渲染跨源 iframe。

如果顶层 frame 的 HTTP 响应包含 `Supports-Loading-Mode: prerender-cross-origin-frames`，浏览器现在会预渲染所有跨源 frame。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/790944684556943361) | [跟踪问题 #440387014](https://issues.chromium.org/issues/440387014) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5112398709129216) | [规范](https://wicg.github.io/nav-speculation/prerendering.html)

### Autofill 事件

自动填充是每天减少数百万用户操作阻碍的重要 Web 功能，但让动态表单在不同实现中可靠地配合自动填充，需要投入大量工作。

此功能添加 `autofill` 事件，让开发者根据自动填入的数据调整表单，并在调整完成后通知浏览器。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/268527127781965825) | [跟踪问题 #466333215](https://issues.chromium.org/issues/466333215) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5137581018841088) | [规范](https://wicg.github.io/autofill-event)

### WebNN

WebNN 使 Web 应用和框架能够利用操作系统原生的机器学习服务，以及用户计算机上的底层硬件能力，在 Web 上构建一致、高效且可靠的机器学习体验。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/2250110963824984065) | [跟踪问题 #40206287](https://issues.chromium.org/issues/40206287) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5176273954144256) | [规范](https://webmachinelearning.github.io/webnn)

## 弃用与移除

### 移除用于生成 SVG 的行内 XSLT

经过特别构造的 XML 文件可能包含 XSL 样式表，将一般 XML 数据转换为 SVG 文件。

示例见 [gist.github.com](https://gist.github.com/drott/1fc70b3c7f0ac314d1fe2e5beecc5490?short_path=1c60adf)。

根据近期增加的使用计数器 `XSLPIInSVGImage`（UseCounter ID 5777）与 `XSLPIInSVGStandaloneDoc`（UseCounter ID 5778），这是 XSLT 处理的特殊情况，在 Web 上几乎不存在。Chrome 计划在完全淘汰 XSLT 前先弃用并移除它。

此变更与基于 Rust 的 XML 解析器实验同步推出，不会在 Chrome 147 中立即覆盖所有用户。

[跟踪问题 #482223009](https://issues.chromium.org/issues/482223009) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5143784390262784)
