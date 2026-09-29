# Chrome 149

来源：[Chrome 149 Release Notes](https://developer.chrome.com/release-notes/149?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2026 年 6 月 2 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 149 稳定渠道版本。

只想了解重点？请参阅 [Chrome 149 新功能](https://developer.chrome.com/blog/new-in-chrome-149)。

## CSS 和界面

### CSS 间隙装饰

CSS 间隙装饰允许为网格和弹性盒等容器布局中的间隙设置样式，类似多列布局中的 `column-rule`。此前开发者需要使用变通技巧来装饰网格和弹性盒间隙，因此这一功能需求很高。

它增加了 `column-rule-inset`、`row-rule-inset`、`column-rule-visibility-items` 和 `row-rule-visibility-items` 等 CSS 属性，并支持对分隔线的宽度、颜色和缩进设置动画。

[CSS 间隙装饰博文](https://developer.chrome.com/blog/gap-decorations-stable) | [跟踪问题 #357648037](https://issues.chromium.org/issues/357648037) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5157805733183488) | [规范](https://drafts.csswg.org/css-gaps-1)

### 用户交互时裁剪溢出文本

用户与设置了 `text-overflow: ellipsis` 的文本交互时（例如编辑或使用插入符导航），文本会暂时由省略号显示改为裁剪显示，以便用户查看并操作隐藏的溢出内容。该功能适用于所有可编辑及不可编辑元素。`<textarea>` 和 `<input>` 等表单控件已支持这种行为。

[跟踪问题 #40731275](https://issues.chromium.org/issues/40731275) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5146265241387008) | [规范](https://www.w3.org/TR/css-overflow-3/#ellipsis-interaction)

### 移除表格 UA 样式表中显式的边框颜色规则

从 `<table>` 元素的用户代理样式表中移除错误的 CSS 规则 `border-color: gray`。HTML 规范不包含此规则，而它会妨碍边框默认使用 `currentColor`。Firefox 和 WebKit 的 UA 样式表中均没有这个 `gray` 边框颜色规则，造成浏览器互通问题。

[跟踪问题 #494554835](https://issues.chromium.org/issues/494554835) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5077341928816640) | [规范](https://html.spec.whatwg.org/multipage/rendering.html#tables-2)

### `shape-outside` 支持 `path()` 与 `shape()`

CSS `shape-outside` 属性新增对 `path()` 和 `shape()` 形状函数的支持。开发者可以更灵活地定义浮动元素的排斥形状，并为其设置动画。

[跟踪问题 #502328208](https://issues.chromium.org/issues/502328208) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5080980370096128) | [规范](https://drafts.csswg.org/css-shapes/#shape-outside-property)

### `shape-outside` 支持 `rect()` 与 `xywh()`

CSS `shape-outside` 属性新增对 `rect()` 和 `xywh()` 基础形状函数的支持。它们允许用矩形坐标定义浮动元素的排斥形状，使 Chrome 与已经支持此功能的 Firefox、Safari 保持一致。

[跟踪问题 #490343453](https://issues.chromium.org/issues/490343453) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6323071520735232) | [规范](https://drafts.csswg.org/css-shapes/#shape-outside-property)

### 用户操作伪类的顶层边界

调整元素父级上的 `:hover`、`:active` 和 `:focus-within` 匹配范围，使其最多匹配到父级链中的第一个顶层元素。顶层元素通常在视觉上脱离其父级链，因此悬停或激活顶层元素时不应改变其父级样式。

[跟踪问题 #407769114](https://issues.chromium.org/issues/407769114) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6296574159355904) | [规范](https://www.w3.org/TR/selectors-4/#useraction-pseudos)

### 将系统强调色的作用范围限于 Web 应用

限制 CSS 关键字 `AccentColor`、`AccentColorText` 和 `accent-color: auto` 对系统强调色的访问，使其仅在 Web 应用和初始配置文件上下文中可用。这样可减少在整个 Web 广泛暴露用户系统颜色所带来的明显指纹识别风险。

[跟踪问题 #481353056](https://issues.chromium.org/issues/481353056) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5106043975761920) | [规范](https://drafts.csswg.org/css-ui-4/#widget-accent)

### `image-rendering: crisp-edges`

`image-rendering: crisp-edges` 指示图像缩放时保留对比度与边缘，避免平滑颜色或使图像模糊。

Chrome、Firefox 和 Safari 将 `crisp-edges` 与 `pixelated` 视为同义词，均使用最近邻缩放实现。

[跟踪问题 #41073066](https://issues.chromium.org/issues/41073066) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5172217778405376) | [规范](https://www.w3.org/TR/css-images/#ref-for-valdef-image-rendering-crisp-edges)

### 支持 CSS 属性 `path-length`

新增 CSS 属性 `path-length`，映射到 SVG `pathLength` 表现属性。它适用于支持 `pathLength` 的 SVG 几何元素，包括 `<path>`、`<circle>`、`<rect>`、`<line>`、`<polyline>`、`<polygon>` 和 `<ellipse>`，使作者可以在样式表、行内样式与动画中指定该属性。

[跟踪问题 #40670251](https://issues.chromium.org/issues/40670251) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4861677550043136) | [规范](https://github.com/w3c/svgwg/pull/1073)

## Web API

### `Intl.Locale.prototype.variants`

按照 ECMA-402 规范添加 `Intl.Locale.prototype.variants`，并在 `Intl.Locale` 构造函数的选项对象中接受 `variants`。

[ChromeStatus.com 条目](https://chromestatus.com/feature/4709921706868736) | [规范](https://tc39.es/ecma402/#sec-Intl.Locale.prototype.variants)

### Payment Request：允许支付处理程序返回内部错误

通过 Payment Request API 访问的支付处理程序可以分别返回“用户取消”（`AbortError`）与“支付应用内部错误”（`OperationError`）。如果发生内部错误，开发者可重试或退回其他流程；如果用户取消，则应停止操作。

[跟踪问题 #473478138](https://issues.chromium.org/issues/473478138) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5942637229113344) | [规范](https://w3c.github.io/payment-request/#payment-handler-indicates-an-internal-error-algorithm)

### Windows 触摸键盘的 TSF 遵守 `autocorrect="off"`

在 Windows 上，当焦点所在的可编辑元素设置了 `autocorrect="off"`，Chrome 的 TSF 集成会检测并撤销触摸键盘的自动更正。

[跟踪问题 #487613498](https://issues.chromium.org/issues/487613498) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5196629995028480) | [规范](https://html.spec.whatwg.org/multipage/interaction.html#autocorrection)

### 选择性读取剪贴板格式

改进异步剪贴板 API，将从操作系统实际获取剪贴板数据的时机推迟到 Web 应用调用 `getType()`。浏览器在 `read()` 时不再急切获取所有可用格式，而是返回包含可用 MIME 类型但尚未装入底层数据的 `ClipboardItem` 对象，从而减少 CPU 使用并提高响应速度。

[跟踪问题 #435051711](https://issues.chromium.org/issues/435051711) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5203433409871872) | [规范](https://github.com/w3c/clipboard-apis/pull/248)

## 网络与连接

### 进入 bfcache 时断开 WebSocket

活跃的 WebSocket 连接不再阻止页面进入往返缓存（bfcache）。浏览器会在页面进入 bfcache 时关闭连接，而不是将文档标记为不符合缓存条件，因此具有活跃 WebSocket 的页面也能被存储和恢复。

[跟踪问题 #467838624](https://issues.chromium.org/issues/467838624) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5068439115923456) | [规范](https://github.com/whatwg/html/pull/12349)

## 新来源试用

### 事件驱动的 Gamepad 输入 API

为 Gamepad API 扩展低延迟的事件驱动模式，使应用能够接收游戏手柄输入。开发者无需频繁轮询 `navigator.getGamepads()`，可以监听 `rawgamepadinputchange` 事件；设备有新输入数据时，该事件就会触发。

[来源试用](https://developer.chrome.com/origintrials#/view_trial/3118179792000647169) | [跟踪问题 #40582297](https://issues.chromium.org/issues/40582297) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5989275208253440) | [规范](https://w3c.github.io/gamepad)

### Permissions Policy：`focus-without-user-activation`

嵌入方可通过 `focus-without-user-activation` 权限政策控制嵌入内容的程序化聚焦。某个 frame 的政策被拒绝时，除非由用户激活触发，否则 `element.focus()`、`autofocus`、`window.focus()`、`dialog.showModal()` 和弹出框聚焦等程序化操作都会被阻止。

[来源试用](https://developer.chrome.com/origintrials#/view_trial/1028509564900737025) | [跟踪问题 #40095111](https://issues.chromium.org/issues/40095111) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5179186249465856) | [规范](https://html.spec.whatwg.org/#focus-without-user-activation-feature)

### WebAssembly 自定义描述符

WebAssembly 可以在新的“自定义描述符”对象中更高效地保存与源代码级类型关联的数据。这些描述符可以配置相应类型的 WebAssembly 对象原型，使方法能够安装在原型链上，并从 JavaScript 使用普通的方法调用语法直接调用。

[来源试用](https://developer.chrome.com/origintrials#/view_trial/619807898716864513) | [跟踪问题 #403372470](https://issues.chromium.org/issues/403372470) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6024844719947776) | [规范](https://github.com/WebAssembly/custom-descriptors/blob/main/proposals/custom-descriptors/Overview.md)
