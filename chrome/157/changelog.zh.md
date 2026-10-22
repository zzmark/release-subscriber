# Chrome 157 版本说明

预览

计划稳定版发布日期：2026 年 11 月 3 日（当前处于 Beta 渠道）

## 其他

### [为 SanitizerConfig 和 Sanitizer 新增 javascriptURLs 选项](https://chromestatus.com/feature/5169798320357376)

[https://github.com/whatwg/html/pull/12898](https://github.com/whatwg/html/pull/12898)

Sanitizer API 也会清理用于导航的 javascript: URL。此前，这是任何使用 Sanitizer 的“安全”方法所产生的附带效果，而任何“不安全”方法均不执行此处理。HTML 标准最近统一了这一行为，将其改为由开发者选择的选项，而非特定方法的附带效果。

未使用该选项时，行为保持不变。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5169798320357376) | [规范](https://github.com/whatwg/html/pull/12898) | [文档](https://html.spec.whatwg.org/#dom-sanitizer-setjavascripturls)

### [在 service worker 中开放 ProgressEvent](https://chromestatus.com/feature/5069584943153152)

service worker 现在可以使用 ProgressEvent，开发者能够构造带有 lengthComputable、loaded 和 total 属性的进度事件。
这使 service worker 与其他 worker 上下文及 XMLHttpRequest 标准保持一致。

[跟踪问题 #332663431](https://issues.chromium.org/issues/332663431) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5069584943153152) | [规范](https://xhr.spec.whatwg.org/#interface-progressevent)

### [Android 上的 Language Detector API](https://chromestatus.com/feature/5087964794322944)

在 Android 版 Chrome（Clank）中开放 LanguageDetector JavaScript Web API。网页应用可借助快速、保护隐私且支持离线的设备端机器学习模型，在移动设备本地检测文本语言，无需依赖云端端点。

[跟踪问题 #549896512](https://crbug.com/549896512) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5087964794322944) | [规范](https://webmachinelearning.github.io/translation-api) | [说明文档](https://github.com/webmachinelearning/translation-api)

### [Web Bluetooth：让 BluetoothRemoteGATTServer 继承 EventTarget](https://chromestatus.com/feature/5138797158334464)

BluetoothRemoteGATTServer 继承 EventTarget，提供标准的 addEventListener()、removeEventListener() 和 dispatchEvent() 方法。这使连接级事件能够直接在 GATT 服务器上派发。

[跟踪问题 #40265040](https://issues.chromium.org/issues/40265040) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5138797158334464) | [规范](https://pr-preview.s3.amazonaws.com/hjanuschka/web-bluetooth/pull/672.html#bluetoothremotegattserver) | [说明文档](https://github.com/WebBluetoothCG/web-bluetooth/pull/672)

## 安全

### [对 Background Fetch 强制执行 CORS](https://chromestatus.com/feature/6210300985606144)

从 Chrome 157 开始，Background Fetch API 强制执行跨源资源共享（CORS）。
此更新使 Chromium 实现符合 [Background Fetch 规范](https://wicg.github.io/background-fetch/) 的意图，确保 Background Fetch 请求与普通 Fetch 请求遵循相同的安全策略，例如本地网络访问检查。

此更新可防止网站通过使用 Background Fetch 替代普通 [Fetch](https://fetch.spec.whatwg.org/)，绕过 CORS 及其他安全策略检查。

[ChromeStatus.com 条目](https://chromestatus.com/feature/6210300985606144) | [规范](https://wicg.github.io/background-fetch)

## CSS

### [CSS corner 简写属性](https://chromestatus.com/feature/5152215540039680)

实现 CSS corner 简写、各个角的子简写（corner-top-left、corner-top-right、corner-bottom-left、corner-bottom-right），以及物理边（corner-top、corner-bottom）和逻辑边（corner-block-start、corner-block-end 等）简写。这些属性允许在一条声明中同时设置单个角的 border-radius 和 corner-shape。此外，保留 corners 作为 corner 简写的兼容别名。

示例： [https://static.januschka.com/i-425897047/](https://static.januschka.com/i-425897047/)

CL: [https://chromium-review.googlesource.com/c/chromium/src/+/7747994](https://chromium-review.googlesource.com/c/chromium/src/+/7747994)

[跟踪问题 #425897047](https://issues.chromium.org/issues/425897047) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5152215540039680) | [规范](https://drafts.csswg.org/css-borders-4/#corner-shaping) | [说明文档](https://static.januschka.com/i-425897047)

### [CSS position-visibility:anchor{s}-valid](https://chromestatus.com/feature/5136856479039488)

`anchors-valid` 值曾作为 [https://crbug.com/329703412](https://crbug.com/329703412) 的一部分实现，但随后因规范对该值精确定义存在疑问而回退。此后，该值更名为 `anchor-valid`（参见 [https://chromestatus.com/feature/5136123851571200](https://chromestatus.com/feature/5136123851571200)），并进一步明确只有默认锚点起作用，消除了大量歧义，使该值可以正式推出。

[跟踪问题 #333421963](https://crbug.com/333421963) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5136856479039488) | [规范](https://drafts.csswg.org/css-anchor-position-1/#position-visibility)

### [CSS text-decoration-inset](https://chromestatus.com/feature/5178263526834176)

CSS text-decoration-inset 控制下划线、上划线和删除线相对于文本片段边缘向内缩进或向外延伸的距离。它支持 auto、长度及百分比值，包括用于设置起始和结束偏移量的单值与双值语法。开发者可使用原生文本装饰调整装饰线间距并创建显现效果，无需借助背景渐变或额外元素。

示例： [https://static.januschka.com/i-468928416/?asddsaasd](https://static.januschka.com/i-468928416/?asddsaasd)
MDN: [https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration-inset](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration-inset)

CL: [https://chromium-review.googlesource.com/c/chromium/src/+/7748204](https://chromium-review.googlesource.com/c/chromium/src/+/7748204)

[跟踪问题 #468928416](https://issues.chromium.org/issues/468928416) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5178263526834176) | [规范](https://drafts.csswg.org/css-text-decor-4/#propdef-text-decoration-inset)

### [CSS text-overflow 的 &lt;string&gt; 值](https://chromestatus.com/feature/6294595288825856)

为 text-overflow 属性新增 &lt;string&gt; 值。

网页作者可指定自定义字符串（例如“(more)”）来表示文本已被裁切。这增加了设计灵活性，可用于创建对用户更友好、与上下文更契合的溢出提示。

[跟踪问题 #41492459](https://issues.chromium.org/issues/41492459) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6294595288825856) | [规范](https://drafts.csswg.org/css-overflow-4/#text-overflow) | [说明文档](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-overflow#string)

### [推出 anchor-visible 和 anchor-valid，并弃用复数形式](https://chromestatus.com/feature/5136123851571200)

CSSWG 决定将 `anchors-valid` 更名为 `anchor-valid` [1]，将 `anchors-visible` 更名为 `anchor-visible` [2]。为此，我们会将这些属性重命名为单数形式，并添加从复数形式到单数形式的别名。稍后会移除复数形式。本 ChromeStatus 条目仅涉及推出新形式和弃用旧形式，不涉及移除旧形式。

[1] [https://github.com/w3c/csswg-drafts/issues/10201#issuecomment-4180411971](https://github.com/w3c/csswg-drafts/issues/10201#issuecomment-4180411971)
[2] [https://github.com/w3c/csswg-drafts/issues/10201#issuecomment-4390233490](https://github.com/w3c/csswg-drafts/issues/10201#issuecomment-4390233490)

[跟踪问题 #526682332](https://issues.chromium.org/issues/526682332) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5136123851571200) | [规范](https://drafts.csswg.org/css-anchor-position-1/#position-visibility)

## DOM

### [Capability Elements 的纯图标模式](https://chromestatus.com/feature/5107682460696576)

引入新属性，通过 `displaymode` 将 Capability Elements（&lt;camera&gt;、&lt;microphone&gt; 和 &lt;geolocation&gt;）渲染为不含文本的紧凑图标按钮。开发者可在地图控件、视频浮动托盘等空间布局中灵活调整界面密度，同时保留原生安全保障和完整的屏幕阅读器无障碍支持。

这是对最近推出的 Capability Elements 的扩展
[https://chromestatus.com/feature/5153829504024576](https://chromestatus.com/feature/5153829504024576)

[ChromeStatus.com 条目](https://chromestatus.com/feature/5107682460696576) | [规范](https://w3c.github.io/mediacapture-extensions/#media-capture-html-elements) | [说明文档](https://github.com/w3c/mediacapture-extensions/blob/main/media-capture-elements-explainer.md)

### [更新后的 HTML 插入与流式处理方法](https://chromestatus.com/feature/5054329641893888)

开放多种 HTML 设置方法，为向现有文档动态插入标记提供一套一致的方式。

- 接受 HTML 参数的位置方法（before/after/append/prepend/replaceWith），实际上可替代 insertAdjacentHTML。

- 返回 WritableStream 的流式方法（stream{Append}HTML{Unsafe}），接收文本输入并解析 HMHL。

- 将 {runScripts} 作为 SetHTMLUnsafeOptions 的一部分传入，模拟 createContextualFragment 的行为。

- 在 Trusted Types 中支持 createParserOptions，允许 Trusted Types 覆盖脚本执行模式和清理器。

[跟踪问题 #491743369](https://issues.chromium.org/issues/491743369) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5054329641893888) | [规范](https://github.com/WICG/declarative-partial-updates/blob/main/dynamic-markup-revamped-explainer.md#resulting-api) | [说明文档](https://github.com/WICG/declarative-partial-updates/blob/main/dynamic-markup-revamped-explainer.md)

## 图形

### [HTML-in-canvas](https://chromestatus.com/feature/5172548013916160)

HTML-in-canvas 支持使用 canvas 自定义 HTML 的渲染。它提供新的原语，用于管理 canvas 布局、绘制能力、实现 DOM 到 canvas 同步的渲染事件，以及实现 canvas 到 DOM 同步的几何更新能力。

[跟踪问题 #500967896](https://crbug.com/500967896) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5172548013916160) | [规范](https://github.com/whatwg/html/pull/11588) | [说明文档](https://github.com/WICG/html-in-canvas) | [演示](https://github.com/WICG/html-in-canvas#demos)

### [WebGPU：atomic-vec2u-min-max](https://chromestatus.com/feature/4882016087703552)

允许在 WGSL 中对 `atomic<vec2u>` 使用 64 位原子最小值和最大值操作。

这使 WebGPU 着色器作者无需完整的 64 位整数支持，即可实现某些使用 64 位原子操作的算法。

[跟踪问题 #453689550](https://crbug.com/453689550) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4882016087703552) | [规范](https://www.w3.org/TR/webgpu/#dom-gpufeaturename-atomic-vec2u-min-max) | [说明文档](https://github.com/gpuweb/gpuweb/issues/5071)

## 性能

### [Long Animation Frames 的样式和布局耗时](https://chromestatus.com/feature/5171478175809536)

为 Long Animation Frame API 添加 `styleDuration` 和 `forcedStyleDuration` 信息，使开发者能够区分样式和布局耗时。

[跟踪问题 #476826067](https://issues.chromium.org/issues/476826067) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5171478175809536) | [规范](https://github.com/w3c/long-animation-frames/pull/30) | [说明文档](https://github.com/w3c/long-animation-frames/pull/30#issue-3828859369)

## 新的源试用

### [Connection Allowlists：嵌入式强制执行](https://chromestatus.com/feature/5657801797009408)

Connection Allowlists（[https://chromestatus.com/feature/5175745573945344](https://chromestatus.com/feature/5175745573945344)）通过限制文档或 worker 经由 Fetch API 或其他 Web 平台 API 发起的连接，提供对外部端点的显式控制。此部分将 Connection Allowlists 扩展为支持在 iframe 及嵌套文档／worker 中强制执行限制。父文档因而能够对嵌入内容施加限制，嵌入内容可以选择接受这些限制，或者不加载。

提案的更多细节参见：[https://github.com/WICG/connection-allowlists](https://github.com/WICG/connection-allowlists)

[源试用](https://developer.chrome.com/origintrials#/view_trial/3609072151384031233) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5657801797009408) | [规范](https://wicg.github.io/connection-allowlists/#issue-d96e905e) | [说明文档](https://github.com/WICG/connection-allowlists/blob/main/iframe-embedded-enforcement-explainer.md)

### [过度滚动区域](https://chromestatus.com/feature/5261280285949952)

此功能新增一组原语，允许元素锚定到其他元素的过度滚动区域，并支持通过滑动手势显现这些元素，方式类似于滚动容器。

[源试用](https://developer.chrome.com/origintrials#/view_trial/5642678951870464) | [跟踪问题 #443719046](https://issues.chromium.org/443719046) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5261280285949952) | [规范](https://github.com/w3c/csswg-drafts/pull/14532) | [说明文档](https://open-ui.org/components/overscroll-actions.explainer) | [演示](https://flackr.github.io/web-demos/html/overscrollcontainer)

---

来源：[ChromeStatus Chrome 157 版本说明](https://chromestatus.com/release-notes/157)。本文由 ChatGPT 完整翻译自英文页面正文，保留内容结构、链接与代码，省略站点导航和复制链接控件。页面源码包含 Copyright 2016 Google Inc. All Rights Reserved 及 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) 许可声明。

发布核验：[ChromiumDash Windows Stable 实际记录](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=157&num=1000)及[官方 Early Stable 公告](https://chromereleases.googleblog.com/2026/10/early-stable-update-for-desktop_02123641300.html)。最早匹配的实际 Stable 构建为 157.0.8103.15，发布日期为 2026-10-22（UTC）。公告确认该版本向少量 Windows 用户投放 Early Stable，Mac 将稍后发布。上文完整保留文章的 Beta 渠道标签和计划日期，不将其作为发布日期依据。
