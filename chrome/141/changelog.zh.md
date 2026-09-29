# Chrome 141

来源：[Chrome 141 Release Notes](https://developer.chrome.com/release-notes/141?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2025 年 9 月 30 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 141 稳定渠道版本。

只想了解重点？请参阅 [Chrome 141 新功能](https://developer.chrome.com/blog/new-in-chrome-141)。

## CSS

### `getComputedStyle()` 中枚举自定义属性

此前在 Chrome 中迭代 `window.getComputedStyle(element)` 时存在错误：元素上设置的自定义属性未包含在结果中，因此返回对象的 `length()` 也未计入这些属性。Chrome 141 修复了此问题，与 Firefox、Safari 保持一致。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5070655645155328) | [规范](https://drafts.csswg.org/cssom/#dom-window-getcomputedstyle)

## DOM

### ARIA Notify API

`ariaNotify` 是一个 JavaScript API，内容作者可用它指定屏幕阅读器要朗读的内容。

与 ARIA 实时区域相比，`ariaNotify` 提高了可靠性和开发者控制力，可播报不依赖 DOM 更新的变化，使动态 Web 应用的无障碍体验更一致、更易使用。iframe 对此功能的使用可通过 `"aria-notify"` 权限政策控制。

[跟踪问题 #326277796](https://issues.chromium.org/issues/326277796) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5745430754230272) | [规范](https://github.com/w3c/aria/pull/2577)

### 更新 `hidden=until-found` 与 details 祖先显示算法

规范近期对 `hidden=until-found` 和 details 元素的显示算法作了小幅修改，以防浏览器陷入无限循环。Chrome 现已发布这些修改。

[跟踪问题 #433545121](https://issues.chromium.org/issues/433545121) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5179013869993984) | [规范](https://github.com/whatwg/html/pull/11457)

## JavaScript

### 对齐 RTP 统计对象的创建时机

这里的 `"outbound-rtp"` 或 `"inbound-rtp"` 类型 RTP 统计对象表示一个 WebRTC 流，流标识符是 SSRC（一个数字）。此变更使统计对象的创建时机符合规范。

[跟踪问题 #406585888](https://issues.chromium.org/issues/406585888) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4580748730040320) | [规范](https://w3c.github.io/webrtc-stats/#the-rtp-statistics-hierarchy)

## 媒体

### 支持 `restrictOwnAudio`

`restrictOwnAudio` 是捕获显示表面的一个可约束属性，用来改变所捕获表面中系统音频的行为。只有捕获的显示表面本身包含系统音频时，`restrictOwnAudio` 约束才会生效；否则没有影响。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5128140732760064) | [规范](https://www.w3.org/TR/screen-capture/#dfn-restrictownaudio)

### `getDisplayMedia()` 的 `windowAudio`

为 `getDisplayMedia()` 的 `DisplayMediaStreamOptions` 增加 `windowAudio` 选项。Web 应用可用它向用户代理提示：用户选中窗口时，是否应提供共享音频的选项。根据应用偏好，`windowAudio` 可设为 exclude、system 或 window。

如果 Web 应用配置了音频捕获，但希望选中窗口时限制系统音频捕获，应设置 `windowAudio: "exclude"`。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5072779506089984) | [规范](https://w3c.github.io/mediacapture-screen-share/#displaymediastreamoptions)

## 其他

### 嵌套 `<svg>` 元素支持 `width` 和 `height` 表现属性

此功能允许通过 SVG 标记及 CSS 在嵌套的 `<svg>` 元素上应用 `width` 和 `height` 表现属性。两种方式为开发者提供更多灵活性，可在复杂设计中更高效地管理 SVG 元素及其样式。

[跟踪问题 #40409865](https://issues.chromium.org/issues/40409865) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5178789386256384) | [规范](https://svgwg.org/svg2-draft/geometry.html#Sizing)

### Digital Credentials API（展示支持）

网站目前通过自定义 URL 处理程序、扫描二维码等多种机制从移动钱包应用获取凭据。此功能允许网站使用 Android 的 `IdentityCredential` CredMan 系统向钱包请求身份信息。它可扩展支持 ISO mDoc、W3C 可验证凭据等多种格式，并允许使用多个钱包应用。此次更新还加入机制，帮助降低现实身份信息在整个生态中被滥用的风险。

[跟踪问题 #40257092](https://issues.chromium.org/issues/40257092) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5166035265650688) | [规范](https://w3c-fedid.github.io/digital-credentials)

### Navigation API：延迟提交（预提交处理程序）

通常调用 `navigateEvent.intercept()` 后，被拦截的导航会在 `NavigateEvent` 派发结束后立即提交，URL 也随之更新。

此功能为 `navigateEvent.intercept()` 添加类似 `handler` 的 `precommitHandler` 选项。它会将提交推迟到该处理程序及其他所有预提交处理程序完成后，并允许处理程序修改导航的 URL、info、状态及历史记录处理行为（push/replace）。

[跟踪问题 #440190720](https://issues.chromium.org/issues/440190720) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5134734612496384) | [规范](https://github.com/whatwg/html/pull/10919)

### FedCM：账户选择中的替代字段

在账户选择器中，除了或代替用户全名与电子邮件地址，可使用电话号码和用户名作为区分账户的标识。这些新字段也供网站用来影响信息披露文字。

[跟踪问题 #382086282](https://issues.chromium.org/issues/382086282) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5121180773908480) | [规范](https://github.com/w3c-fedid/FedCM/pull/718)

## 网络与连接

### HTTP 磁盘缓存支持 `No-Vary-Search`

HTTP 磁盘缓存可利用 `No-Vary-Search` 响应头，让仅查询参数不同的 URL 共享一个缓存条目。

开发者可用 `No-Vary-Search` 指定不会影响用户体验的查询参数，例如用于跟踪转化的 ID。支持此响应头后，用户稍后在没有该转化 ID 的情况下返回同一页面时，浏览器可使用或重新验证缓存，而无需完全从网络重新获取。

此前，导航预取缓存、预取和预渲染推测规则，以及预渲染均已支持 `No-Vary-Search`。此次发布使所有使用 HTTP 磁盘缓存的功能都可使用它。

[跟踪问题 #382394774](https://issues.chromium.org/issues/382394774) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5808599110254592) | [规范](https://httpwg.org/http-extensions/draft-ietf-httpbis-no-vary-search.html)

## 离线与存储

### IndexedDB 的 `getAllRecords()` 以及 `getAll()`、`getAllKeys()` 的方向选项

为 IndexedDB 的 IDBObjectStore 和 IDBIndex 添加 `getAllRecords()` 方法，并为 `getAll()` 和 `getAllKeys()` 增加方向参数。与现有的游标迭代方式相比，某些读取模式可显著加快。一次针对 Microsoft 产品工作负载的测试显示性能提高了 350 毫秒。

`getAllRecords()` 结合 `getAllKeys()` 与 `getAll()`，同时枚举主键和值。对于 IDBIndex，它还会提供记录的索引键，以及主键和值。

[跟踪问题 #40746016](https://issues.chromium.org/issues/40746016) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5124331450138624) | [规范](https://w3c.github.io/IndexedDB/#dom-idbobjectstore-getallrecords)

## 性能

### 推测规则：改进桌面端 `"eager"` 预加载积极程度

在桌面端，`"eager"` 推测规则现在会在用户悬停链接的时间短于 `"moderate"` 所要求的时间后，触发预取与预渲染。

此前会尽早启动预取和预渲染，行为与 `"immediate"` 相同。新行为更符合作者意图：比 `"moderate"` 更积极，但不及 `"immediate"`。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5113430155591680) | [规范](https://wicg.github.io/nav-speculation/speculation-rules.html#:~:text=early%20as%20possible.-,%22moderate%22,balance%20between%20%22eager%22%20and%20%22conservative%22.,-%22conservative%22)

## 安全

### Storage Access API 的严格同源政策

调整 Storage Access API 的语义，使其在安全方面严格遵循同源政策。默认情况下，在 frame 中使用 `document.requestStorageAccess()` 只会为发往 iframe 来源（而非同站点）的请求附加 Cookie。

**注意：**`CookiesAllowedForUrls` 政策或 Storage Access Headers 仍可用于放开跨站 Cookie。

[跟踪问题 #379030052](https://issues.chromium.org/issues/379030052) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5169937372676096) | [规范](https://github.com/privacycg/storage-access/pull/213)

### 基于签名的完整性

此功能为 Web 开发者提供验证依赖资源来源的方法，为网站依赖的信任建立技术基础。简言之，服务器可用 Ed25519 密钥对为响应签名，开发者可要求用户代理使用特定公钥验证签名。这在内容安全政策基于 URL 的检查与子资源完整性基于内容的检查之外，提供有益补充。

[跟踪问题 #375224898](https://issues.chromium.org/issues/375224898) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5032324620877824) | [规范](https://wicg.github.io/signature-based-sri)

## WebRTC

### WebRTC Encoded Transform（V2）

此 API 允许处理通过 `RTCPeerConnection` 传输的编码媒体。Chrome 于 2020 年推出了早期版本；此后规范发生变化，其他浏览器也推出了更新版（Safari 于 2022 年、Firefox 于 2023 年）。此次发布使 Chrome 与更新后的规范一致，是 Interop 2025 的一部分。

此次发布不包括仍在讨论的 `generateKeyFrame method`。

[跟踪问题 #354881878](https://issues.chromium.org/issues/354881878) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5175278159265792) | [规范](https://github.com/w3c/webrtc-encoded-transform)

### `getUserMedia()` 的 `echoCancellationMode`

扩展 `MediaTrackConstraints` 字典中 `echoCancellation` 的行为。此前它接受 `true` 或 `false`，现在还接受 `"all"` 和 `"remote-only"`。客户端可据此调整麦克风音轨的回声消除方式，控制从麦克风信号中移除用户系统播放的全部声音，还是仅移除从 `PeerConnections` 接收的音频。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5585747985563648) | [规范](https://www.w3.org/TR/mediacapture-streams/#dom-echocancellationmodeenum)

## 仅受管 ChromeOS

### Device Attributes API 的 Permissions Policy

新的 Permissions Policy 可限制对 Device Attributes API 的访问。该 API 仅向通过政策安装的 Kiosk Web 应用和隔离 Web 应用开放，两者都必须运行在受管 ChromeOS 设备上。

此功能还受内容设置控制。新增 `DeviceAttributesBlockedForOrigins` 和 `DefaultDeviceAttributesSetting` 两项政策，作为此前 `DeviceAttributesAllowedForOrigins` 的补充。在受管 ChromeOS 设备上，政策安装的 Kiosk Web 应用和隔离 Web 应用默认启用该功能。

[ChromeStatus.com 条目](https://chromestatus.com/feature/4843520522977280) | [规范](https://github.com/WICG/WebApiDevice/blob/main/DeviceAttributesPermissionsPolicyExplainer.md)

## 来源试用

### 本地网络访问限制

Chrome 141 [限制向用户本地网络发起请求的能力](https://developer.chrome.com/blog/local-network-access)，并通过权限提示控制。

此来源试用暂时允许从非安全上下文访问本地网络资源，以便开发者有更多时间将本地网络访问请求迁移到安全上下文。

[来源试用](https://developer.chrome.com/origintrials#/view_trial/3826370833404657665) | [跟踪问题 #394009026](https://issues.chromium.org/issues/394009026) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5152728072060928) | [规范](https://wicg.github.io/local-network-access)

### Proofreader API

这是一个由 AI 语言模型支持、可[为输入文本提供建议修正的校对](https://developer.chrome.com/blog/proofreader-api-ot) JavaScript API。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/1988902185437495297) | [跟踪问题 #403313556](https://issues.chromium.org/issues/403313556) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5164677291835392) | [规范](https://github.com/webmachinelearning/proofreader-api/blob/main/README.md#full-api-surface-in-web-idl)

### 扩展 CSP `script-src`（亦称 `script-src-v2`）

向内容安全政策（CSP）的 `script-src` 指令添加新关键字，带来两种新的基于哈希的允许名单机制：按 URL 的哈希，以及按 `eval()` 或类似函数内容的哈希指定脚本来源。该功能有时称为 script-src-v2，但向后兼容现有 `script-src`，并使用同一指令。

扩展哈希覆盖 URL 与 `eval()` 后，即使脚本内容频繁变化，开发者仍可通过较窄的哈希允许名单设置合理严格的安全政策；也可允许已知安全的 `eval()` 内容，而不必广泛允许未经检查的 `eval()`。

提供新关键字时，它们会覆盖基于主机的 `script-src`。因此，单个响应头可兼容支持及不支持新关键字的浏览器。

[跟踪问题 #392657736](https://issues.chromium.org/issues/392657736) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5196368819519488) | [规范](https://github.com/w3c/webappsec-csp/pull/784)

### WebAssembly 自定义描述符

WebAssembly 可在新的“自定义描述符”对象中更高效地保存与源代码级类型关联的数据。描述符可为该类型的 WebAssembly 对象配置原型，因此可以将方法安装到对象原型链上，并从 JavaScript 使用普通方法调用语法直接调用。原型和方法可借助导入的内建函数进行声明式配置。

[来源试用](https://developer.chrome.com/origintrials#/view_trial/619807898716864513) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6024844719947776) | [规范](https://github.com/WebAssembly/custom-descriptors/blob/main/proposals/custom-descriptors/Overview.md)

## 弃用与移除

### 停止从预取与预渲染发送 `Purpose: prefetch` 请求头

预取和预渲染现在使用 `Sec-Purpose` 请求头，因此将移除仍会传递的旧版 `Purpose: prefetch` 请求头。此变更会置于功能标志或紧急关闭开关之后，以避免兼容性问题。

适用范围包括推测规则的预取与预渲染、`<link rel=prefetch>`，以及 Chromium 非标准的 `<link rel=prerender>`。

[跟踪问题 #420724819](https://issues.chromium.org/issues/420724819) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5088012836536320) | [规范](https://wicg.github.io/nav-speculation/prerendering.html#interaction-with-fetch)
