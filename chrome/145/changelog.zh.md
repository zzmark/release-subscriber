# Chrome 145

来源：[Chrome 145 Release Notes](https://developer.chrome.com/release-notes/145?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2026 年 2 月 10 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 145 稳定渠道版本。

只想了解重点？请参阅 [Chrome 145 新功能](https://developer.chrome.com/blog/new-in-chrome-145)。

## CSS 和界面

### 支持 CSS `text-justify` 属性

应用 `text-align: justify` 时，可通过 `text-justify` 属性控制文字如何两端对齐。例如，即使是英文文本，也可以通过扩大字符间距强制两端对齐。

[跟踪问题 #40321528](https://issues.chromium.org/issues/40321528) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5079678972985344) | [规范](https://www.w3.org/TR/css-text-3/#text-justify-property)

### CSS `letter-spacing` 和 `word-spacing` 属性支持百分比值

按照 CSS Text Module Level 4 规范，为 `letter-spacing` 与 `word-spacing` 增加百分比值。百分比相对于空格字符（`U+0020`）的前进宽度计算，使排版控制更可靠、更灵活，尤其适合文字间距需要随视口与字号调整的响应式设计。

[跟踪问题 #327740939](https://issues.chromium.org/issues/327740939) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5106867491700736) | [规范](https://www.w3.org/TR/css-text-4/#propdef-letter-spacing)

### 改进较大 `border-radius` 的阴影边缘计算

确保接近圆形、`border-radius` 接近 50% 的元素，其阴影和裁剪边界准确贴合曲线边缘的视觉轮廓。

这让复杂圆角形状的渲染更一致，消除大半径时的视觉差异。用于在小半径下保持角部锐利的 `border-radius` 调整因子，会随着半径接近 50% 而逐渐减弱。

这也适用于通过 `corner-shape` 创建的非圆形轮廓，现在它们使用相同的半径调整机制。

[跟踪问题 #448651073](https://issues.chromium.org/issues/448651073) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5176753681203200) | [规范](https://drafts.csswg.org/css-backgrounds-3/#corner-shaping)

### 多列布局中的列换行

支持 Multicol Level 2 中的 CSS 属性 `column-wrap` 和 `column-height`。

这支持垂直列布局，甚至二维列布局。列可以有明确限定的高度，而不必从多列容器的 `content-box` 高度推导。当一行的所有列填满后，列会换到新的一行，而不是沿行内方向溢出。

[跟踪问题 #403183884](https://issues.chromium.org/issues/403183884) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5176206485618688) | [规范](https://drafts.csswg.org/css-multicol-2)

### 向 `GlobalEventHandlers` 暴露 `onanimationcancel` 事件

CSS Animations Level 1 扩展了 HTML 规范定义的 `GlobalEventHandlers` 接口，声明四个新事件处理程序：`onanimationstart`、`onanimationiteration`、`onanimationend` 和 `onanimationcancel`。此前只有 `onanimationcancel` 尚未包含在 `GlobalEventHandlers` IDL 中。

[跟踪问题 #464010037](https://issues.chromium.org/issues/464010037) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5160464445210624) | [规范](https://drafts.csswg.org/css-animations/#interface-globaleventhandlers)

### 可自定义的 select 列表框

将可自定义 select 的支持扩展到列表框渲染模式，包括列表框模式下的单选和多选。

列表框模式在页面流中渲染 `select`，而不是使用独立按钮与弹出框。可通过 `multiple` 或 `size` 属性在不同平台主动启用列表框模式，例如 `<select multiple>` 或 `<select size=4>`。当这些属性与 CSS `appearance: base-select` 同时应用于 `select` 时，可改善渲染和输入行为。

此功能尚不支持多选弹出框模式的自定义 `select`，将来才会支持。获得多选弹出框需设置 `<select multiple size=1>`。

[跟踪问题 #357649033](https://issues.chromium.org/issues/357649033) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6222145025867776) | [规范](https://github.com/whatwg/html/pull/11758)

### `focus` 的 `focusVisible` 选项

调用 `focus()` 方法时，可在 `FocusOptions` 字典中提供布尔值 `focusVisible`。为 true 时，新获得焦点的元素始终绘制焦点环，且匹配 `:focus-visible` 伪类；为 false 时，不绘制焦点环，也不匹配该伪类。省略时由用户代理自行决定是否绘制焦点环，`:focus-visible` 则相应匹配。

[跟踪问题 #462191849](https://issues.chromium.org/issues/462191849) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5612989944299520) | [规范](https://html.spec.whatwg.org/#dom-focusoptions-focusvisible)

### 强制颜色模式下启用单色 Emoji

调整 Chromium 在强制颜色模式中的 Emoji 渲染行为。计算值解析时，`font-variant-emoji` 计算为 `normal` 或 `unicode` 的 Emoji，在有单色字形时会用单色字形渲染。

因此 Chromium 不使用彩色 Emoji，使其完整参与强制颜色模式处理并遵守系统高对比度颜色。强制颜色模式以外的行为不变。

[跟踪问题 #420857717](https://issues.chromium.org/issues/420857717) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5861138256494592) | [规范](https://drafts.csswg.org/css-color-adjust-1/#forced-colors-properties)

### 非根滚动容器上的过度滚动效果

在非根滚动容器上显示弹性过度滚动效果。嵌套的可滚动元素到达边界时，效果应用于该元素，而不再只应用于根滚动器。这减少了对自定义 JavaScript 变通方案的需求，并可通过每个元素上的 `overscroll-behavior` 控制。

[跟踪问题 #41102897](https://issues.chromium.org/issues/41102897) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5195768556290048) | [规范](https://www.w3.org/TR/css-overscroll-1/#overscroll-behavior-properties)

## 能力

### 在 Android 上报告真实窗口位置

Android 版 Chrome 现在通过 `window.screenX`、`window.screenY`、`window.outerWidth` 和 `window.outerHeight` 准确报告浏览器窗口的位置与大小。

此前 Chrome 错误地假设 Android 上所有浏览器窗口都从坐标 (0, 0) 开始；对使用自由窗口模式的 Android 平板来说并非如此。因此网站通过 `window.screenX` 与 `window.screenY` 查询屏幕上的窗口位置时，总是得到 0。这些字段应保存窗口左上角在全局工作区坐标中的位置。

此外，Android 版 Chrome 还错误地假设浏览器窗口外部尺寸与网站视口内部尺寸相等。

`window.screenX` 和 `window.screenY` 的别名分别是 `window.screenLeft` 与 `window.screenTop`。

[跟踪问题 #417632037](https://issues.chromium.org/issues/417632037) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5164958878531584) | [规范](https://www.w3.org/TR/cssom-view-1/#dom-window-screenx)

## JavaScript

### Upsert

这是关于 `Map.prototype.getOrInsert`、`Map.prototype.getOrInsertComputed`、`WeakMap.prototype.getOrInsert` 和 `WeakMap.prototype.getOrInsertComputed` 的 ECMAScript 提案。

[跟踪问题 #434977728](https://issues.chromium.org/issues/434977728) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5201653661827072) | [规范](https://github.com/tc39/proposal-upsert)

### 崩溃报告键值 API

新增键值 API `window.crashReport`，由每个文档的一张映射表支持，保存 Chrome 附加到崩溃报告的数据。

如果网站发生渲染器进程崩溃，映射表中的数据会加入 `CrashReportBody` 发送。开发者据此可调试应用中哪些具体状态可能导致崩溃。

[跟踪问题 #400432195](https://issues.chromium.org/issues/400432195) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6228675846209536) | [规范](https://github.com/WICG/crash-reporting/pull/37)

### 默认发送精简的 User-Agent 字符串

从 Chrome 145 开始，Chrome 移除 **UserAgentReduction** 政策。该政策此前可控制 Chrome 发送精简还是完整的 User-Agent 字符串。

为加强用户隐私并降低被动追踪能力，Chrome 自 110 版起默认减少 User-Agent 头中的信息量。**UserAgentReduction** 政策曾为企业管理过渡而临时提供。

建议网站使用 User-Agent Client Hints（UA-CH）访问浏览器和设备信息。UA-CH 要求网站主动请求具体信息，比旧版 User-Agent 字符串更能保护隐私。详情参阅 web.dev 文章[迁移到 User-Agent Client Hints](https://web.dev/articles/migrate-to-ua-ch)。

从 Chrome 145 起，**UserAgentReduction** 政策不再生效。Chrome 默认发送精简 User-Agent 字符串。依赖该政策获取完整旧版 User-Agent 的系统或应用，可能不再收到预期的详细信息。

[ChromeStatus.com 条目](https://chromestatus.com/feature/6224706757853184)

### Navigation API：在 navigation.transition 中暴露目标

`NavigationTransition` 已有 `from` 属性，暴露导航前 URL；新增 `to`（一个 `NavigationDestination`）后信息更完整。预提交处理期间当前 URL 尚未变成目标 URL，因此此属性尤其有用。

`navigation.transition` 只对拦截的导航开放，即由文档发起的同源导航。

[跟踪问题 #447171238](https://issues.chromium.org/issues/447171238) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6008183302782976) | [规范](https://html.spec.whatwg.org/#dom-navigationtransition-to)

### 安全支付确认：浏览器绑定密钥

对安全支付确认的断言和凭据创建增加一层加密签名。对应私钥不会跨设备同步，有助于满足支付交易的设备绑定要求。

[跟踪问题 #377278827](https://issues.chromium.org/issues/377278827) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5106102997614592) | [规范](https://w3c.github.io/secure-payment-confirmation/#sctn-browser-bound-key-store)

### 安全支付确认：界面更新

更新 Android 版 Chrome 的 SPC 对话框界面元素。

除外观外，还增加以下内容：

- 商家可提供与支付相关的可选支付实体标志列表，在界面中显示。
- 根据用户希望不使用 SPC 继续交易，还是取消交易，向商家返回不同的输出状态。此前两种情况只返回同一种状态。
- 为支付工具增加新的支付详情标签字段，使文字在 SPC 中分两行显示。

[跟踪问题 #405173922](https://issues.chromium.org/issues/405173922) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5206050462236672) | [规范](https://w3c.github.io/secure-payment-confirmation)

### Cookie Store API 的 `maxAge` 属性

使用 `Cookie Store API` 设置 Cookie 时，可以指定 `maxAge`。

虽然现有 `expires` 属性也能配置到期时间，但 `maxAge` 更符合常见用法，并使 `Cookie Store API` 与 `document.cookie`、`Set-Cookie` HTTP 头提供的选项保持一致。

[跟踪问题 #430926231](https://issues.chromium.org/issues/430926231) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5190778418757632) | [规范](https://github.com/whatwg/cookiestore/pull/292)

### 非折叠选区中删除命令的 InputEvent 类型

在选中文本上使用删除快捷键时，报告准确的 `inputType`。在 `contenteditable` 元素的选中文本上使用 `Ctrl+Backspace` 或 `Ctrl+Delete` 等删除命令时，`beforeinput` 和 `input` 事件现在报告 `deleteContentBackward` 或 `deleteContentForward`，而不是 `deleteWordBackward` 或 `deleteWordForward`。开发者因此可正确理解编辑操作，并可靠地实现撤销、重做或自定义编辑行为。

[跟踪问题 #41423062](https://issues.chromium.org/issues/41423062) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5173317243895808) | [规范](https://w3c.github.io/input-events/#interface-InputEvent-Attributes)

### `clipboardchange` 事件要求持久用户激活

只有存在持久用户激活或 `clipboard-read` 权限时，才触发 `clipboardchange` 事件，防止未经授权地监视剪贴板。

该事件较新（Chrome 144 才推出），所以对 Web 的影响很小。多数剪贴板监视场景（例如远程桌面客户端）已有持久用户激活或 `clipboard-read` 权限。

[跟踪问题 #468821937](https://issues.chromium.org/issues/468821937) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5163741220044800) | [规范](https://www.w3.org/TR/clipboard-apis/#clipboard-event-clipboardchange)

## 多媒体

### 通过 `VideoFrame.metadata()` 暴露 WebRTC 视频帧的 `rtpTimestamp`

新增 `VideoFrame.metadata()` 方法，返回包含 `rtpTimestamp` 字段的字典，前提是底层 `VideoFrame` 的原生元数据中有该字段；否则返回空字典。只有来自 WebRTC 的视频帧带有 `rtpTimestamp` 元数据。

提议的规范指出，原生实现中已有其他元数据字段，将来可能逐步向 JavaScript 开放。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5186046555586560) | [规范](https://www.w3.org/TR/webcodecs-video-frame-metadata-registry/#dom-videoframemetadata)

## 存储

### IndexedDB：SQLite 后端（内存上下文）

Chromium 的 `IndexedDB` 实现已改写为基于 SQLite，替代先前混合使用 `LevelDB` 与普通文件的实现。Web API 没有变化。

这提高了可靠性，性能也有一定改善。

目前仅应用于 Chromium 和 Google Chrome 的无痕模式等内存上下文，以限制新错误的影响，并推迟迁移已持久化到磁盘的数据。

[跟踪问题 #436880911](https://issues.chromium.org/issues/436880911) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5126896685809664) | [规范](https://www.w3.org/TR/IndexedDB)

## 性能

### 帮助 Web 应用理解双峰性能计时

`PerformanceNavigationTiming` 对象新增 `confidence` 字段，用于判断导航计时是否能代表 Web 应用的实际情况。

[跟踪问题 #1413848](https://issues.chromium.org/issues/1413848) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5186950448283648) | [规范](https://w3c.github.io/navigation-timing/#sec-performance-timing-confidence)

### 为性能条目添加 `presentationTime` 和 `paintTime`

在 Element Timing、LCP、Long Animation Frames 和 Paint Timing 中暴露 `paintTime` 与 `presentationTime`。

`paintTime` 是渲染阶段结束、浏览器开始绘制阶段的时间；`presentationTime` 是“像素到达屏幕”的时间，其确切含义部分取决于实现。

此功能条目不包含另行处理的 Event Timing。

[跟踪问题 #378827535](https://issues.chromium.org/issues/378827535) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5162859838046208) | [规范](https://w3c.github.io/paint-timing/#painttimingmixin)

### LayoutShift API 使用 CssPixels

[LayoutShift API](https://wicg.github.io/layout-instability/) 的归因数据（`prevRect` 与 `currentRect`）现在使用 CSS 像素，而非物理像素报告。此前行为与其他均使用 CSS 像素的布局相关 API 不一致。此变更提高一致性，简化使用，并符合调试与工具中的预期单位。

[跟踪问题 #399058544](https://issues.chromium.org/issues/399058544) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5155103518228480) | [规范](https://wicg.github.io/layout-instability/#sec-layout-shift-attribution)

## 安全

### Device Bound Session Credentials

[Device Bound Session Credentials（DBSC）](https://developer.chrome.com/docs/web-platform/device-bound-session-credentials)让网站将用户会话绑定到特定设备，使被盗会话 Cookie 更难在其他机器上使用。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5140168270413824) | [规范](https://w3c.github.io/webappsec-dbsc)

### Origin API

[来源](https://datatracker.ietf.org/doc/rfc6454/)是 Web 实现的基础组成部分，也是用户代理维护安全与隐私边界的关键。HTML 和 URL 规范清楚定义了来源，以及“站点”等广泛使用的相关概念。

不过，来源本身此前并未直接向开发者开放。虽然许多对象提供获取来源的方法，返回的都是来源的 ASCII 序列化表示，而非来源对象。这有一些不利影响：实际操作中，处理序列化来源时自行做同源或同站点比较，容易出错并产生漏洞。从设计上看，这似乎缺少一个难以准确自行实现的安全基本对象。

Chrome 145 通过引入 `Origin` 对象来补足这一平台缺口。它封装来源概念，并提供比较、序列化和解析等方法。

[跟踪问题 #434131026](https://issues.chromium.org/issues/434131026) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5095541277065216) | [规范](https://github.com/whatwg/html/pull/11846)

### 本地网络访问权限拆分

这是对本地网络访问（LNA）限制的增强：Chrome 将原本单一的本地网络访问权限拆为两个。

旧权限是 `local-network-access`；新权限是 `local-network`（用于向本地地址空间中的 IP 发起 LNA 请求）和 `loopback-network`（用于向环回地址空间中的 IP 发起 LNA 请求）。

旧权限继续作为别名保留，并可用于 `permissions.query` 和 `Permissions Policy`。企业政策目前保持相同行为，之后将添加更细粒度的新企业政策。

[跟踪问题 #465491626](https://issues.chromium.org/issues/465491626) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5068298146414592) | 规范（官方页面链接无效）

### Trusted Types 与规范对齐

`Trusted Types` 于 2019 年最先在 Chromium 实现并推出，此后被众多网站采用。近期其他浏览器厂商也开始关注它。

原有 `Trusted Types` 规范随初版实现作为一种“猴子补丁”规范共同编写。其他厂商尝试实现同一规范，使它重新受到关注。目前它已整合到 HTML、DOM（以及少量 CSP）规范中，这个过程发现并修复了多处不一致，部分修复可能被开发者观察到。Chrome 会随规范整合更新实现，以保持一致。

WebKit 同时已推出更新后的 `Trusted Types` 规范实现，因此 Chrome 对此次更新的 Web 兼容性有较高信心。

[跟踪问题 #330516530](https://issues.chromium.org/issues/330516530) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5163792014245888) | [规范](https://html.spec.whatwg.org/#:~:text=Trusted%20Types)

## 图形

### WebGPU：`subgroup_uniformity` 功能

此功能为一致性分析增加新的作用域，并改变各作用域中检查的语言部分，使子组功能在更多情况下可被视为一致。

[跟踪问题 #454653380](https://issues.chromium.org/issues/454653380) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5673998232977408) | [规范](https://github.com/gpuweb/gpuweb/pull/5431)

## 隔离 Web 应用

### `Controlled Frame` 中的 `WebRequest.SecurityInfo`

为 [ControlledFrame](https://developer.chrome.com/docs/iwa/controlled-frame) 引入 `WebRequest.SecurityInfo` API。Web 应用可拦截向服务器发送的 HTTPS、WSS 或 WebTransport 请求，取得浏览器验证过的服务器证书指纹，再用它手工验证到同一服务器的单独原始 TCP/UDP 连接的证书。这让应用能够确认自己正与正确的服务器通信。

[跟踪问题 #462114142](https://issues.chromium.org/issues/462114142) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5076692209106944) | [规范](https://wicg.github.io/controlled-frame/#dictdef-securityinfo)

## 来源试用

### Blink 中支持 JPEG XL（`image/jxl`）解码

在 Blink 中使用内存安全的纯 Rust 解码器 `jxl-rs`，支持 JPEG XL（`image/jxl`）图像解码。

JPEG XL 是标准化为 ISO/IEC 18181 的现代图像格式，提供：

- 渐进解码，提高感知加载性能。
- 宽色域、HDR 和高位深度支持。
- 动画支持。

此实现采用 `jxl-rs`，而非 C++ 的 libjxl 参考解码器，以满足 Chromium 的内存安全要求。解码器受 `enable-jxl-image-format` 功能标志和 `enable_jxl_decoder` 构建标志控制。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5114042131808256)

### WebAudio：可配置渲染量子

`AudioContext` 和 `OfflineAudioContext` 新增可选的 `renderSizeHint`。传入整数可请求特定渲染量子大小；省略或传入 `default` 时使用默认的 128 帧；传入 `hardware` 时让用户代理选择合适的渲染量子大小。

[来源试用](https://developer.chrome.com/origintrials#/view_trial/2970686904204263425) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5078190552907776)

## 弃用与移除

### 移除 macOS 上过时的虚拟摄像头支持

Chrome 对其支持的所有 macOS 版本移除过时虚拟摄像头的支持。

[跟踪问题 #461717105](https://issues.chromium.org/issues/461717105) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5086798634156032)

### 移除 BMP 中嵌入 JPEG 或 PNG 的扩展

Chrome 移除在 BMP 中嵌入 JPEG 或 PNG 的扩展。

[跟踪问题 #456842524](https://issues.chromium.org/issues/456842524) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5153489630134272) | 规范（官方页面链接无效）
