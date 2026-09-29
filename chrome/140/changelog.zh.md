# Chrome 140

来源：[Chrome 140 Release Notes](https://developer.chrome.com/release-notes/140?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2025 年 9 月 2 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 140 稳定渠道版本。

只想了解重点？请参阅 [Chrome 140 新功能](https://developer.chrome.com/blog/new-in-chrome-140)。

## CSS

### CSS 类型化算术

类型化算术允许在 CSS 中编写 `calc(10em / 1px)` 或 `calc(20% / 0.5em * 1px)` 等表达式。例如，这有利于排版：可将带类型的值转换为无类型值，再用于接受数字的属性。另一个场景是将无单位值与其他类型相乘，例如从像素转换为角度。

[跟踪问题 #40768696](https://issues.chromium.org/issues/40768696) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4740780497043456) | [规范](https://www.w3.org/TR/css-values-4/#calc-type-checking)

### CSS `caret-animation` 属性

Chromium 支持对 `caret-color` 属性设置动画，但动画期间，插入符默认的闪烁行为会干扰动画。

CSS `caret-animation` 属性有两个值：`auto` 与 `manual`。`auto` 表示使用浏览器默认行为（闪烁），`manual` 表示由开发者控制插入符动画。对闪烁视觉效果感到不适或产生不良反应的用户，也可通过用户样式表停用闪烁。

[跟踪问题 #329301988](https://issues.chromium.org/issues/329301988) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5082469066604544) | [规范](https://drafts.csswg.org/css-ui/#caret-animation)

### highlightsFromPoint API

`highlightsFromPoint` API 允许开发者与自定义高亮交互，检测文档中特定位置有哪些高亮。在多个高亮相互重叠或位于 Shadow DOM 内的复杂 Web 功能中，这种交互能力很有价值。精确的逐点高亮检测有助于更好地管理自定义高亮的动态交互。例如，开发者可响应用户对高亮区域的点击或悬停，显示自定义提示、上下文菜单或其他交互功能。

[跟踪问题 #365046212](https://issues.chromium.org/issues/365046212) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4552801607483392) | [规范](https://drafts.csswg.org/css-highlight-api-1/#interactions)

### `ScrollIntoView` 的 container 选项

`ScrollIntoViewOptions` 的 container 选项允许开发者执行 `scrollIntoView` 时只滚动最近的祖先滚动容器。例如，以下代码只滚动 `target` 所在的滚动容器以将其显示出来，不会滚动直到视口的所有滚动容器：

```text
target.scrollIntoView({container: 'nearest'});
```

[ChromeStatus.com 条目](https://chromestatus.com/feature/5100036528275456) | [规范](https://drafts.csswg.org/cssom-view/#dom-scrollintoviewoptions-container)

### 视图过渡：继承更多动画属性

在视图过渡伪元素树中继承更多动画属性：

- `animation-timing-function`
- `animation-iteration-count`
- `animation-direction`
- `animation-play-state`

[跟踪问题 #427741151](https://issues.chromium.org/issues/427741151) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5154752085884928) | [规范](https://www.w3.org/TR/css-view-transitions-2)

### 视图过渡伪元素继承 animation-delay

除上一项更新外，视图过渡伪元素树现在还会继承 `animation-delay` 属性。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5424291457531904) | [规范](https://www.w3.org/TR/css-view-transitions-2)

### 嵌套视图过渡组

视图过渡可以生成嵌套的伪元素树，而非扁平结构，使过渡更符合原始元素结构和视觉意图。这支持裁剪、嵌套 3D 变换，以及正确应用不透明度、遮罩和滤镜等效果。

[跟踪问题 #399431227](https://issues.chromium.org/issues/399431227) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5162799714795520) | [规范](https://www.w3.org/TR/css-view-transitions-2/#view-transition-group-prop)

### 从根元素传播视口的 `overscroll-behavior`

此变更改为从根元素而非 body 传播 `overscroll-behavior`。

CSS 工作组决定不将 `<body>` 的属性传播到视口，视口属性应从根元素（`<html>`）传播。因此 `overscroll-behavior` 也应从根元素传播。但 Chrome 长期以来一直从 `<body>` 而非根元素传播该属性，与其他浏览器不互通。此变更使 Chrome 符合规范，并与其他实现保持一致。

[跟踪问题 #41453796](https://issues.chromium.org/issues/41453796) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6210047134400512) | [规范](https://drafts.csswg.org/css-overscroll-behavior-1)

### CSS `content` 属性替代文本中的 `counter()` 与 `counters()`

允许在 `content` 属性的替代文本中使用 `counter()` 和 `counters()`，提供更有意义的信息，改善无障碍体验。

[跟踪问题 #417488055](https://issues.chromium.org/issues/417488055) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5185442420621312) | [规范](https://drafts.csswg.org/css-content/#content-property)

### CSS `scroll-target-group` 属性

`scroll-target-group` 属性指定元素是否为滚动标记组容器，接受以下值：

- 'none'：元素不建立滚动标记组容器。
- 'auto'：元素建立滚动标记组容器，该组包含以此容器为最近祖先滚动标记组容器的所有滚动标记元素。

建立滚动标记组容器后，其中带片段标识符的 HTML 锚点元素可成为与 `::scroll-marker` 伪元素对应的 HTML 元素。滚动目标当前处于视图中的锚点元素可使用 `:target-current` 伪类设置样式。

[跟踪问题 #6607668](https://issues.chromium.org/issues/6607668) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5189126177161216) | [规范](https://drafts.csswg.org/css-overflow-5/#scroll-target-group)

### 在 `@font-face` 规则中支持 `font-variation-settings` 描述符

CSS 允许开发者通过单个元素上的 `font-variation-settings` 属性调整字体粗细、宽度、倾斜度及其他轴，但基于 Chromium 的浏览器此前不支持在 `@font-face` 声明中使用该属性。此功能支持 CSS Fonts Level 4 定义的字符串语法，按照规范忽略无效或未知的功能标签；不支持二进制或非标准形式。可变字体因性能和排版灵活性而越来越普及。Chromium 增加此描述符支持后，可提升控制力、减少重复，并支持更可扩展的现代 Web 排版方式。

[跟踪问题 #40398871](https://issues.chromium.org/issues/40398871) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5221379619946496) | [规范](https://www.w3.org/TR/css-fonts-4/#font-rend-desc)

## DOM

### `ToggleEvent` 的 source 属性

`ToggleEvent` 的 `source` 属性在适用时包含触发该事件的元素。例如，用户点击带 `popovertarget` 或 `commandfor` 属性的 `<button>` 以打开弹出框时，弹出框收到的 `ToggleEvent` 的 source 属性会指向该 `<button>`。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5165304401100800) | [规范](https://html.spec.whatwg.org/multipage/interaction.html#the-toggleevent-interface)

## 隔离 Web 应用（IWA）

### Controlled Frame API（仅 IWA 可用）

新增仅供隔离 Web 应用（IWA）使用的 Controlled Frame API。与其他平台上名称相似的 API 一样，Controlled Frame 可嵌入任何内容，包括无法放入 `<iframe>` 的第三方内容；还可通过一系列方法和事件控制嵌入内容。有关隔离 Web 应用的更多信息，请参阅[隔离 Web 应用说明](https://github.com/WICG/isolated-web-apps/blob/main/README.md)。

[跟踪问题 #40191772](https://issues.chromium.org/issues/40191772) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5199572022853632) | [规范](https://wicg.github.io/controlled-frame)

## JavaScript

### `Uint8Array` 与 Base64、十六进制互转

Base64 是将任意二进制数据表示为 ASCII 的常用方法。JavaScript 使用 `Uint8Arrays` 处理二进制数据，但此前缺少将其内建编码为 Base64，或将 Base64 数据转为对应 `Uint8Array` 的机制。此功能添加了在十六进制字符串与 `Uint8Arrays` 之间转换的能力及方法。

[ChromeStatus.com 条目](https://chromestatus.com/feature/6281131254874112) | [规范](https://tc39.es/proposal-arraybuffer-base64/spec)

### 视图过渡 finished Promise 的时间调整

此前 finished Promise 在渲染生命周期步骤中兑现。这意味着由 Promise 兑现触发的代码，会在移除视图过渡的画面帧生成后执行；如果脚本为了保持相近视觉状态而移动样式，动画结束时可能出现闪烁。此变更将视图过渡清理步骤移到生命周期结束后异步执行，以解决这一问题。

[跟踪问题 #430018991](https://issues.chromium.org/issues/430018991) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5143135809961984)

## Web API

### `ReadableStreamBYOBReader` 的 `min` 选项

现有 `ReadableStreamBYOBReader.read(view)` 方法增加 `min` 选项。该方法已接受用于读取数据的 `ArrayBufferView`，但此前不保证读取兑现前写入了多少元素。指定 `min` 后，可要求流至少等到相应数量的元素可用，才兑现读取。相较于可能在写入元素少于视图容量时就兑现的现有行为，这是一项改进。

[跟踪问题 #40942083](https://issues.chromium.org/issues/40942083) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6396991665602560) | [规范](https://streams.spec.whatwg.org/#byob-reader-read)

### 桌面端 Get Installed Related Apps API

Get Installed Related Apps API（navigator.getInstalledRelatedApps）让网站了解关联应用是否已安装。只有应用与 Web 来源建立关联后，网站才能使用此 API。

该 API 于 Chrome 80 在 Android 上推出；Chrome 140 又为桌面端 Web 应用增加支持。

[文档](https://developer.chrome.com/docs/capabilities/get-installed-related-apps) | [跟踪问题 #895854](https://issues.chromium.org/issues/895854) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5695378309513216) | [规范](https://wicg.github.io/get-installed-related-apps/spec)

### Http Cookie 前缀

在某些场景下，服务器需要区分由服务器设置和由客户端设置的 Cookie。例如某些 Cookie 通常始终由服务器设置，但意外代码（如 XSS 漏洞利用、恶意扩展或开发者的错误提交）可能在客户端设置它们。此提案增加一个信号，帮助服务器区分来源。具体而言，它定义 `__Http` 和 `__HostHttp` 前缀，确保 Cookie 不会由客户端脚本设置。

[跟踪问题 #426096760](https://issues.chromium.org/issues/426096760) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5170139586363392) | [规范](https://github.com/httpwg/http-extensions/pull/3110)

## Service Worker

### Blob 脚本 URL 的 `SharedWorker` 继承 controller

规范规定，Worker 应为 Blob URL 继承 controller。但现有代码只允许 Dedicated Worker 继承，共享 Worker 不会继承。此变更修正 Chrome 的行为，使其符合规范。`SharedWorkerBlobURLFixEnabled` 企业政策可控制此功能。

[跟踪问题 #324939068](https://issues.chromium.org/issues/324939068) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5137897664806912) | [规范](https://w3c.github.io/ServiceWorker/#control-and-use-worker-client)

### 添加 `ServiceWorkerStaticRouterTimingInfo`

此功能为 ServiceWorker 静态路由 API 添加计时信息，通过导航计时 API 和资源计时 API 向开发者开放。ServiceWorker 提供计时信息，用于标记特定时间点。

新信息包括两项与静态路由 API 相关的时间：

- `RouterEvaluationStart`：开始将请求与已注册路由规则匹配的时间。
- `CacheLookupStart`：当来源为 `"cache"` 时，开始查找缓存存储的时间。

此外，还添加两项路由来源信息：匹配的路由来源和最终的路由来源。

[跟踪问题 #41496865](https://issues.chromium.org/issues/41496865) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6309742380318720) | [规范](https://github.com/w3c/ServiceWorker)

## 来源试用

### 启用来电通知

扩展 Notifications API，允许已安装 PWA 发送来电通知，即带通话样式按钮和铃声的通知。这使 VoIP Web 应用更容易让用户识别并接听来电，也有助于缩小同时提供原生版与 Web 版的应用之间的体验差距。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/2876111312029483009) | [跟踪问题 #detail?id=1383570](https://issues.chromium.org/issues/detail?id=1383570) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5110990717321216) | [规范](https://notifications.spec.whatwg.org)

### 崩溃报告键值 API

此功能引入新的键值 API，暂命名为 `window.crashReport`，由每个文档的一张映射表支持，保存附加到崩溃报告的数据。

如果网站发生渲染器进程崩溃，映射表中的数据会加入 `CrashReportBody` 发送。开发者据此可调试应用中的具体状态是否导致崩溃。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/1304355042077179905) | [跟踪问题 #400432195](https://issues.chromium.org/issues/400432195) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6228675846209536) | [规范](https://github.com/WICG/crash-reporting/pull/37)

### 添加 `clipboardchange` 事件

只要 Web 应用或其他系统应用更改系统剪贴板内容，`clipboardchange` 事件就会触发。远程桌面客户端等 Web 应用因此可以保持自己的剪贴板与系统剪贴板同步，相较于用 JavaScript 轮询剪贴板变化更高效。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/137922738588221441) | [跟踪问题 #41442253](https://issues.chromium.org/issues/41442253) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5085102657503232) | [规范](https://github.com/w3c/clipboard-apis/pull/239)

### 在 Android 上启用 `SharedWorker`

Web 开发者长期希望 Android 支持 SharedWorker，主要出于以下需求：

- **资源共享和效率**：在多个标签页之间共享一条 WebSocket 或服务器发送事件（SSE）连接，以节约资源。
- **持久化资源管理**：在标签页之间共享并持久保存资源，尤其是基于 WASM 的 SQLite 等技术。
- **填补功能差距**：iOS 版 Safari、Android 版 Firefox 等其他主要移动浏览器已经支持 SharedWorker，使 Android 版 Chrome 成为最后一个需要补齐此功能的主要浏览器。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/4101090410674257921) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6265472244514816) | [规范](https://html.spec.whatwg.org/multipage/workers.html#shared-workers-and-the-sharedworker-interface)

## 移除

### 停止从预取和预渲染发送 `Purpose: prefetch` 请求头

预取和预渲染现在使用 `Sec-Purpose` 请求头，因此旧版 `Purpose: prefetch` 请求头正在移除。

适用范围包括推测规则的 `prefetch`、推测规则的 `prerender`、`<link rel=prefetch>`，以及 Chromium 非标准的 `<link rel=prerender>`。

[跟踪问题 #420724819](https://issues.chromium.org/issues/420724819) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5088012836536320) | [规范](https://wicg.github.io/nav-speculation/prerendering.html#interaction-with-fetch)

### 弃用部分元素内 H1 的特殊字号规则

HTML 规范包含一组[特殊规则](https://html.spec.whatwg.org/multipage/rendering.html#sections-and-headings)，适用于嵌套在 `<article>`、`<aside>`、`<nav>` 或 `<section>` 中的 `<h1>` 标签。

这些规则因无障碍问题而被弃用。它们在视觉上减小嵌套 `<h1>` 的字号，使其“看起来”像 `<h2>`，但无障碍树中没有任何信息反映这种降级。

[跟踪问题 #394111284](https://issues.chromium.org/issues/394111284) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6192419898654720) | [规范](https://github.com/whatwg/html/pull/11102)
