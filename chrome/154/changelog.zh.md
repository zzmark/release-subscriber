# Chrome 154

来源：[Chrome 154 Release Notes](https://developer.chrome.com/release-notes/154?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2026 年 9 月 22 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 154 稳定渠道版本。

只想了解重点？请参阅 [Chrome 154 新功能](https://developer.chrome.com/blog/new-in-chrome-154)。

## CSS 和界面

### CSS `scroll-marker-group` 模式

`scroll-marker-group` 属性支持两种模式，按照 WAI-ARIA 模式控制 `::scroll-marker-group` 和 `::scroll-marker` 的焦点顺序及无障碍行为：

- `links`（默认）：生成的 `::scroll-marker-group` 类似导航列表（`navigation` 角色），`::scroll-marker` 元素则是普通链接（`link` 角色）。所有 `::scroll-marker` 元素依次成为 Tab 键焦点停靠点。激活链接标记后，焦点移至目标元素。
- `tabs`：生成的 `::scroll-marker-group` 类似标签列表（`tablist` 角色），`::scroll-marker` 元素具有 `tab` 角色，原始元素具有 `tabpanel` 角色。只有活动的 `::scroll-marker` 是 Tab 键焦点停靠点，用户可用方向键在标记之间导航。非活动标签的内容不出现在无障碍树中，激活标记时焦点仍留在标记上。

[跟踪问题 #425931511](https://issues.chromium.org/issues/425931511) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5109685301673984) | [规范](https://drafts.csswg.org/css-overflow-5/#scroll-marker-modes)

### CSS `text-decoration-inset`

CSS `text-decoration-inset` 属性控制下划线、上划线和删除线相对文本片段边缘向内缩进或向外延伸的距离。它支持 `auto`、长度和百分比值，以及分别设置起始和结束偏移的一值或二值语法。这样无需使用背景渐变或额外元素，就能通过原生文本装饰调整间距并实现显示效果。

[跟踪问题 #468928416](https://issues.chromium.org/issues/468928416) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5178263526834176) | [规范](https://drafts.csswg.org/css-text-decor-4/#propdef-text-decoration-inset)

### 向 Worker 上下文开放 `CSSStyleValue` 层级

CSS Typed OM 规范将 `CSSStyleValue` 层级暴露给 Worker 全局作用域（`[Exposed=(Window, Worker, PaintWorklet, LayoutWorklet)]`）。此前，Blink 仅向 `Window` 和 Worklet 暴露 `CSSStyleValue`、`CSSKeywordValue`、`CSSNumericValue`、`CSSUnitValue` 及 `CSSUnparsedValue`。Chrome 154 将这些构造函数开放到 `Worker` 上下文，与规范及其他浏览器引擎保持一致。

[跟踪问题 #534781956](https://issues.chromium.org/issues/534781956) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5114591051907072) | [规范](https://www.w3.org/TR/css-typed-om-1/#stylevalue-subclasses)

### `FontFace` 的 `width` 属性和 `font-width` 描述符

在 `FontFace` 上暴露 `width` 属性，并在 `@font-face` 中暴露 `font-width` 描述符，分别作为 `stretch` 和 `font-stretch` 的别名。这使 Chromium 与更新后的 CSS Font Loading 和 CSS Fonts 4 规范保持一致。可以使用 `FontFace.width` 和 CSS `font-width` 检查或初始化字体宽度，并与 `stretch` 和 `font-stretch` 互换使用。

[跟踪问题 #543938492](https://issues.chromium.org/issues/543938492) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5145402365050880) | [规范](https://drafts.csswg.org/css-fonts-4/#font-width-prop)

### 改进弹出框和对话框的轻触关闭行为

改进并简化弹出框和对话框的轻触关闭行为。轻触关闭指用户点击弹出框或对话框外部时将其关闭。本次更新改用 `click` 事件触发关闭，不再组合使用 `pointerdown` 和 `pointerup`，避免触摸屏滚动手势或右键点击意外关闭弹出框或对话框。

[跟踪问题 #408010435](https://issues.chromium.org/issues/408010435) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6209615938322432) | [规范](https://github.com/whatwg/html/pull/11536)

### 自适应尺寸的 `<iframe>`

网站可以选择让 iframe 自动适应尺寸。父文档中的 `<iframe>` 元素会根据嵌入文档的布局溢出尺寸调整大小，从而避免在子文档中滚动。

[跟踪问题 #418397278](https://issues.chromium.org/issues/418397278) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5108373464547328) | [规范](https://drafts.csswg.org/css-sizing-4/#responsive-iframes)

## JavaScript

### 迭代器 `includes`

实现 TC39 的 `Iterator.prototype.includes()` 提案，可检查迭代器是否产生给定值，用法类似 `Array.prototype.includes()`。

[跟踪问题 #504886973](https://issues.chromium.org/issues/504886973) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5205192866922496) | [规范](https://tc39.es/proposal-iterator-includes)

## 网络与连接

### 向 `WebSocket` 构造函数添加选项对象

支持将选项字典（`WebSocketInit`）作为 `WebSocket` 构造函数的第二个参数。该字典支持 `protocols` 选项，可以指定子协议（对应现有的 `protocols` 参数），并为今后的选项提供扩展点。

例如，除了 `new WebSocket("wss://example.com:8080", "soap")`，还可以传入 `new WebSocket("wss://example.com:8080", { protocols: "soap" })`。

[跟踪问题 #542670554](https://issues.chromium.org/issues/542670554) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5080055102439424) | [规范](https://github.com/whatwg/websockets/pull/76)

### WebSocket 支持 `targetAddressSpace` 选项

支持在 `WebSocket` 构造函数中传入 `targetAddressSpace` 选项（`new WebSocket("ws://local-server.example", { targetAddressSpace: "local" })`）。与 Fetch API 中已有的支持相同，它允许指定指向公共主机名的 WebSocket 连接应被视为目标地址空间为 `"local"` 或 `"loopback"`。如果用户授予本地网络权限，且主机名解析到本地 IP 地址，即使本地服务器尚未支持 HTTPS，也可借此绕过混合内容限制并连接到该服务器。

[跟踪问题 #517413738](https://issues.chromium.org/issues/517413738) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4779920606756864) | [规范](https://github.com/WICG/local-network-access/pull/125)

### Fetch API：将 `AbortController` 的原因传递给 fetch `Response`

如果提供了中止原因，除了 `fetch` Promise，`Response` 对象及其 `ReadableStream` 的方法现在也会暴露该原因。这样，开发者提供的中止原因就能一致地传播，符合 Fetch 标准。

[跟踪问题 #502133195](https://issues.chromium.org/issues/502133195) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5158507786665984) | [规范](https://fetch.spec.whatwg.org)

### 对 Background Fetch 执行 CORS 检查

Background Fetch API 现在强制执行跨源资源共享（CORS）。这使 Chromium 的实现符合 Background Fetch 规范，并确保 Background Fetch 请求受到与普通 `fetch()` 请求相同的安全策略约束，防止网站利用 Background Fetch 绕过 CORS 等安全策略检查。

[ChromeStatus.com 条目](https://chromestatus.com/feature/6210300985606144) | [规范](https://wicg.github.io/background-fetch)

### Background Fetch 的本地网络访问限制

Background Fetch 请求要求 Service Worker 所属来源具备向本地或环回服务器发送请求所需的本地网络访问（LNA）权限。这使 Chromium 与 Background Fetch 规范保持一致，防止网站通过 Background Fetch 而非普通 `fetch()` 绕过 LNA 检查。企业可以使用现有的 LNA 企业政策管理此行为，包括 `LocalNetworkAccessRestrictionsTemporaryOptOut`、`LocalNetworkAccessAllowedForUrls`、`LoopbackNetworkAllowedForUrls`、`LocalNetworkAccessPermissionsPolicyDefaultEnabled` 和 `LocalNetworkAccessIpAddressSpaceOverrides`。

[跟踪问题 #455486148](https://issues.chromium.org/issues/455486148) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6225598451154944) | [规范](https://wicg.github.io/background-fetch)

## 隐私与安全

### 默认在访问 HTTP 前询问

用户连接到不安全的（`http`）网站时，Chrome 默认显示提示。管理员可通过 [`HttpsOnlyMode`](https://chromeenterprise.google/policies/#HttpsOnlyMode) 企业政策控制此默认行为。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5143933628841984)

### 安全支付确认：区域设置验证

更新安全支付确认的 `locale` 数据字段：如果该字段提供的所有语言标记均与安全支付确认对话框使用的语言不匹配，则返回 `NotSupportedError` `DOMException`。如果未设置该字段或其值为空，则跳过验证。这有助于使提供给安全支付确认的数据语言与对话框一致。

[跟踪问题 #535278878](https://issues.chromium.org/issues/535278878) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5126146013396992) | [规范](https://w3c.github.io/secure-payment-confirmation/#dom-securepaymentconfirmationrequest-locale)

## 隔离 Web 应用（IWA）

### Window Shape API

Window Shape API 允许 ChromeOS 上列入允许名单的[隔离 Web 应用](https://chromeos.dev/en/web/isolated-web-apps)定义自定义窗口形状。它支持非矩形和不连续的窗口布局，可用于创建外观接近原生应用的小组件、浮动面板和叠加层。`window.setShape()` API 要求窗口使用 `unframed` 显示模式并获得 `window-management` 权限。管理员可通过 `DefaultWindowManagementSetting`、`WindowManagementAllowedForUrls` 和 `WindowManagementBlockedForUrls` 企业政策管理此功能。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5075144470036480) | [规范](https://explainers-by-googlers.github.io/chromeos-iwa-apis)

## 来源试用

### Private Verification Tokens

Private Verification Tokens（PVT）是一种低熵机制，让网站将用户在常规浏览中建立的信任转移到隐私浏览模式，减少验证码等验证带来的阻碍。网站在常规浏览会话中签发 PVT，并在隐私浏览模式中兑换。

[跟踪问题 #500396188](https://issues.chromium.org/issues/500396188) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6210457816924160)
