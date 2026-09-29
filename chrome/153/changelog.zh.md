# Chrome 153

来源：[Chrome 153 Release Notes](https://developer.chrome.com/release-notes/153?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2026 年 9 月 8 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 153 稳定渠道版本。

只想了解重点？请参阅 [Chrome 153 新功能](https://developer.chrome.com/blog/new-in-chrome-153)。

## CSS 和界面

### 单轴滚动容器

**仅在非稳定渠道（Beta、Dev 和 Canary）提供。**

扩展 `overflow` 属性，使可滚动值能够与 `clip` 一起使用（例如 `overflow: scroll clip`）。这样，`position: sticky` 可以在不同轴上受到不同祖先滚动容器的约束，也能确保设置了 `overflow: clip` 的轴保持原位。

[跟踪问题 #440038212](https://issues.chromium.org/issues/440038212) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5067363861004288) | [规范](https://github.com/w3c/csswg-drafts/pull/13903)

### `scroll-axis-lock` 属性

`scroll-axis-lock` 是一个 CSS 属性，可指示浏览器不要将用户的滚动手势限制在单一轴上。

当手势开始时，一个轴上的移动明显大于垂直轴，浏览器通常会将滚动手势锁定到该轴。这样往往能避免用户本想只沿一个轴滚动时意外滚动另一个轴，改善体验。但如果希望元素始终可沿对角线滚动，这种锁定会迫使用户以不会触发锁定的角度开始手势。

[跟踪问题 #479472367](https://issues.chromium.org/issues/479472367) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5908461532610560) | [规范](https://github.com/w3c/csswg-drafts/pull/14152)

### `transitionrun` 与媒体查询事件的互通性派发时机

调整 Blink 派发动画 `transitionrun` 事件与媒体查询 `change` 事件的时机，使其符合 HTML 规范，并与 Gecko、WebKit 互通。按照 HTML 窗口事件循环规范，即使动画在同一轮循环中更早创建，`transitionrun` 也在步骤 3.11 触发，而不会延迟到下一轮。媒体查询 `change` 事件则在步骤 3.10、所有待处理动画事件之前触发，而不再与步骤 3.11 的动画事件交错。

[跟踪问题 #397737222](https://issues.chromium.org/issues/397737222) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6312504658624512) | [规范](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)

## DOM 和 HTML

### 能力元素：`<camera>` 与 `<microphone>`

`<camera>` 和 `<microphone>` 能力元素是声明式、由用户激活的 HTML 控件，使用与 `<usermedia>` 元素相同的底层机制，但每个元素只请求一种能力：`<camera>` 请求视频采集，`<microphone>` 请求音频采集。与 `<usermedia>` 一样，它们在页面中嵌入由浏览器控制、样式受到严格约束的界面，确保在触发权限提示或启动媒体流之前收到明确的用户操作（点击）。

对于只需要单一能力的场景，`<camera>` 和 `<microphone>` 提供专门且语义明确的 HTML 控件。它们沿用 `<usermedia>` 的安全模型、严格的样式限制及内置权限恢复路径，同时提供更贴合无需混合媒体访问场景的 API。

[跟踪问题 #531672795](https://issues.chromium.org/issues/531672795) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5153829504024576) | [规范](https://w3c.github.io/mediacapture-extensions/#the-camera-html-element)

### 在非 XSLT 场景使用 Rust 解析 XML

为了提高浏览器安全性并防御内存相关漏洞，Chrome 153 在若干常见场景将 XML 解析引擎更新为内存安全的 Rust 实现。这在保持与现有 Web 标准完全兼容的同时，消除了潜在的内存破坏错误。

Chrome 已开始弃用并移除 XSLT。在这一过程继续进行的同时，新的安全解析器处理以下无需 XSLT 的场景：

- `DOMParser` Web API
- 访问 `XMLHttpRequest` 的 `responseXML`
- SVG 独立图像（直接将 `image.svg` 文档作为顶层导航打开）
- SVG 外部图像（在主文档中把 SVG 作为外部图像资源嵌入）

[跟踪问题 #466303347](https://issues.chromium.org/issues/466303347) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5309598397497344) | [规范](https://www.w3.org/TR/xml)

## JavaScript

### Iterator Join

为 JavaScript 添加将迭代器内容连接成字符串的方法。`Iterator` 实例的 `join()` 方法类似 `Array.prototype.join()`：它返回由迭代器产生的所有元素串接而成的字符串，元素之间以逗号或指定的分隔字符串隔开。

[跟踪问题 #465715798](https://issues.chromium.org/issues/465715798) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5095183554314240) | [规范](https://tc39.es/proposal-iterator-join)

### Joint Iteration

为 JavaScript 添加同步推进多个迭代器（通常称为 zip）的方法，包括 `Iterator.zip()` 和 `Iterator.zipKeyed()`。

[跟踪问题 #465357675](https://issues.chromium.org/issues/465357675) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6249068542164992) | [规范](https://github.com/tc39/proposal-joint-iteration)

## 媒体、传感器和输入

### 支持解码沉浸式音频模型与格式（IAMF）

支持通过媒体源扩展（MSE）在 HTML 媒体元素中解码并播放沉浸式音频模型与格式（IAMF）容器。IAMF 是一种开放、免版税的空间音频格式，支持基于声道、场景和对象的音频呈现。支持这一标准后，Web 开发者无需依赖专有格式，也不必在 JavaScript 中管理复杂的离散声道路径，就能在不同设备上提供一致的沉浸式 3D 音频体验。

[跟踪问题 #535279329](https://issues.chromium.org/issues/535279329) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5113656292540416) | [规范](https://aomediacodec.github.io/iamf/latest-approved.html)

### WebAudio：可配置的渲染量子

向 `AudioContext` 和 `OfflineAudioContext` 添加可选的 `renderSizeHint`。可以传入特定整数来自定义 WebAudio 渲染量子大小；省略该提示或传入 `"default"` 时使用默认的 128 帧；传入 `"hardware"` 则让浏览器选择最佳大小。

[跟踪问题 #40637820](https://issues.chromium.org/issues/40637820) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5078190552907776) | [规范](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-renderquantumsize)

### WebGPU：`buffer_view` 功能

新增 WGSL 语言功能，用于重新解释变量中的数据。它允许将一个 uniform、storage 或 workgroup 变量划分成多个逻辑变量，也允许在程序中将同一变量的数据解释为多种类型。

[跟踪问题 #506523198](https://issues.chromium.org/issues/506523198) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5094091886034944) | [规范](https://github.com/gpuweb/gpuweb/pull/6291)

## 来源试用

### JavaScript 自分析标记

JavaScript Self-Profiling API 允许 Web 应用采样自身的调用栈，以测量真实用户设备上的性能。此功能为每个捕获的样本添加可选标记字段，标识采样时正在进行的浏览器活动类型：脚本、垃圾回收、样式、布局、绘制或其他。跟踪记录通常存在无法解释的调用栈间隙；标记可将这段时间归因到 JavaScript 之外的浏览器工作。例如，可以区分脚本执行、样式重新计算、布局或垃圾回收暂停，从而更容易分析并优化缓慢的跟踪记录。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/2442639847895072769) | [跟踪问题 #40800459](https://issues.chromium.org/issues/40800459) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5201297767792640) | [规范](https://github.com/WICG/js-self-profiling/pull/89)

## 弃用与移除

### 弃用并移除 Protected Audience

Protected Audience API 提供无需第三方 Cookie 或跨站用户追踪的兴趣群组广告方法。在 Chrome 宣布维持目前的第三方 Cookie 做法之后，Protected Audience API（以及相关 Privacy Sandbox API）计划弃用并移除。

[ChromeStatus.com 条目](https://chromestatus.com/feature/6552486106234880) | [规范](https://wicg.github.io/turtledove)

### 弃用并移除 Related Website Sets（RWS）

Related Website Sets（RWS，原名 First Party Sets）为开发者提供声明网站间关系的框架，以便在特定、面向用户的目的下有限地访问跨站 Cookie。在 Chrome 宣布维持目前的第三方 Cookie 做法之后，Related Website Sets 计划弃用并移除。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5194473869017088) | [规范](https://wicg.github.io/first-party-sets)

### 弃用并移除 Shared Storage API

Shared Storage API 是一种保护隐私的 Web API，可提供不按第一方网站分区的存储。在 Chrome 宣布维持目前的第三方 Cookie 做法之后，Shared Storage API（及相关 Privacy Sandbox API）计划弃用并移除。

[跟踪问题 #462465887](https://issues.chromium.org/issues/462465887) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5076349064708096) | [规范](https://wicg.github.io/shared-storage)

### 弃用并移除 `document.requestStorageAccessFor`

`requestStorageAccessFor`（rSAFor）API 是 Storage Access API 的扩展，允许顶层网站代表嵌入网站请求访问未分区的（“第一方”）Cookie。由于在 Chrome 中它只能用于请求 Related Website Sets 内网站之间的存储访问，因此它将与 Related Website Sets 一起计划弃用并移除。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5162221567082496) | [规范](https://privacycg.github.io/requestStorageAccessFor)

### 弃用并移除 Attribution Reporting API

Attribution Reporting API 是一种保护隐私的 Web API，旨在无需第三方 Cookie 或跨站用户追踪即可衡量广告转化。在 Chrome 宣布维持目前的第三方 Cookie 做法之后，Attribution Reporting API（及相关 Privacy Sandbox API）计划弃用并移除。

[ChromeStatus.com 条目](https://chromestatus.com/feature/6320639375966208) | [规范](https://wicg.github.io/attribution-reporting-api)

### 移除以 `_current` 为目标的非标准导航

此前 Blink 支持以 `_current` 为目标的导航。由于该行为不符合标准且在 Web 上使用极少，Chrome 153 将其移除。

[跟踪问题 #539212797](https://issues.chromium.org/issues/539212797) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5121089536262144) | [规范](https://html.spec.whatwg.org/#the-rules-for-choosing-a-navigable)
