# Chrome 158 版本说明

预览

计划稳定版发布日期：2026 年 11 月 17 日（当前处于 Beta 渠道）

## CSS

### [CSS 自定义高亮通用选择器 ::highlight(*)](https://chromestatus.com/feature/5174965228929024)

新增自定义高亮的通用选择器 ::highlight(*)，无论自定义高亮的名称是什么，都能匹配其高亮伪元素。

\* 参数的优先级权重为零，因此其声明可作为基础样式；指定具体高亮名称的规则可通过层叠覆盖这些声明。

[跟踪问题 #408003366](https://issues.chromium.org/issues/408003366) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5174965228929024) | [规范](https://drafts.csswg.org/css-pseudo-4/#selectordef-highlight-highlight-name-selector)

### [CSS flow-start 和 flow-end 对齐关键字](https://chromestatus.com/feature/5069051687731200)

根据 CSSWG 的决议，引入 flow-start/end 关键字，作为现有 flex-start/end 关键字的值别名。这些关键字用于处理排布方向反转时的对齐。

在 CSS Grid-Lanes 中，flow-start 表示容器中开始排布的起始边缘，这在排布方向反转时很有用（`fill-reverse`、`track-reverse`，相关讨论见 CSSWG 的议题：[css-grid-3][masonry] 瀑布流布局中 item-flow 的行与列 · Issue #12803 · w3c/csswg-drafts）。由于这些关键字作为值别名使用，预期 flex-start/end 在 Grid Lanes 中也会遵循逻辑方向。这会扩展这些关键字的定义：其特殊行为将不再仅适用于 flexbox，而是适用于逻辑起始／结束方向与物理起始／结束方向不同的所有布局模式。

序列化时，无论使用的是 flex-start/end 还是 flow-start/end，返回的序列化值都应为 flow-start/end。

[跟踪问题 #555299635](https://issues.chromium.org/issues/555299635) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5069051687731200) | [规范](https://github.com/w3c/csswg-drafts/pull/14539)

### [object-fit 和 object-position 适用于 &lt;object&gt; 和 &lt;embed&gt; 中的 SVG 文档](https://chromestatus.com/feature/4886345347629056)

通过 &lt;object&gt; 或 &lt;embed&gt; 加载的 SVG 文档，会根据 CSS object-fit 和 object-position 属性在元素的内容框内确定尺寸和位置，与 &lt;img&gt; 内容的处理方式相同。

此前，Chrome 会忽略嵌入式 SVG 文档的这两个属性，始终将文档视口拉伸至整个内容框。

[跟踪问题 #41302806](https://issues.chromium.org/41302806) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4886345347629056) | [规范](https://html.spec.whatwg.org/multipage/rendering.html#embedded-content-rendering-rules)

## 能力（Fugu）

### [HTML install 元素](https://chromestatus.com/feature/5152834368700416)

现在，提供清单 URL 和可选的清单 ID 后，Chrome 即可向浏览器发起安装 Web 应用的请求。`<install>` 元素无需 JavaScript 即可实现跨源 Web 应用安装，相比处理 `beforeinstallprompt` 事件，开发体验更好。该元素与 [Web Install API](https://chromeenterprise.google/resources/release-notes/?ver=158&featId=5183481574850560) 同时推出；后者具体通过 `navigator.install()` 方法，为同一安装能力提供命令式入口。

管理员可通过以下任一种方式控制此功能：

1. 通过企业策略 [WebAppInstallByUserEnabled](https://chromeenterprise.google/policies/#WebAppInstallByUserEnabled)，全面禁止用户安装 Web 应用，包括通过 `navigator.install()` 和 &lt;install&gt; 发起的安装。
1. 通过权限策略 [web-app-installation](https://www.w3.org/TR/permissions-policy/)，允许或禁止在企业控制的源（例如内部网站或 iframe）上使用此功能。

[跟踪问题 #454827186](https://issues.chromium.org/issues/454827186) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5152834368700416) | [规范](https://wicg.github.io/install-element) | [文档](https://docs.google.com/document/d/1rGvLhD4SR8Y9M1wVmqgyesPNkbZGU7HOqlttjEFJ5Vo/edit?tab=t.tmx19oox759l#heading=h.j3tt49hqiuck) | [说明文档](https://aka.ms/installelement) | [演示](https://microsoftedge.github.io/Demos/pwa-install-element) | [演示](https://kbhlee2121.github.io/pwa/web-install-manifest-url/only-elements.html)

### [Web Install API](https://chromestatus.com/feature/5183481574850560)

从 Chrome 158 开始，新的 Web Install API 允许网站在提供清单 URL 和可选的清单 ID 后，提示用户安装 Web 应用。`navigator.install()` 方法支持跨源 Web 应用安装，相比处理 `beforeinstallprompt` 事件，开发体验更好。此 API 与 [HTML &lt;install&gt; 元素](https://chromeenterprise.google/resources/release-notes/?ver=158&featId=5152834368700416) 同时推出；后者为同一安装能力提供声明式入口。

管理员可通过以下任一种方式进行控制：

1. 通过企业策略 [WebAppInstallByUserEnabled](https://chromeenterprise.google/policies/#WebAppInstallByUserEnabled)，全面禁止用户安装 Web 应用，包括通过 `navigator.install()` 和 `<install>` 发起的安装。
1. 通过权限策略 [web-app-installation](https://www.w3.org/TR/permissions-policy/)，允许或禁止在企业控制的源（例如内部网站或 iframe）上使用此功能。

[跟踪问题 #333795265](https://issues.chromium.org/issues/333795265) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5183481574850560) | [规范](https://wicg.github.io/install-element) | [文档](https://docs.google.com/document/d/12nSXJLm8mW0gWZ_yjlXfrV8r9gwJliVt4WVa-209-KA/edit?tab=t.0) | [说明文档](https://aka.ms/webinstall) | [演示](https://microsoftedge.github.io/Demos/pwa-install-api) | [演示](https://kbhlee2121.github.io/pwa/web-install-manifest-url/index.html)

## 多媒体

### [媒体元素伪类](https://chromestatus.com/feature/5068277495758848)

CSS 伪类 :playing、:paused、:seeking、:buffering、:stalled、:muted 和 :volume-locked 可根据 &lt;audio&gt; 和 &lt;video&gt; 元素的状态匹配这些元素。

这是 [https://wpt.fyi/interop-2026](https://wpt.fyi/interop-2026) 的重点领域之一。

[跟踪问题 #40246121](https://crbug.com/40246121) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5068277495758848) | [规范](https://html.spec.whatwg.org/multipage/semantics-other.html#pseudo-classes)

### [OfflineAudioContext 增量渲染](https://chromestatus.com/feature/5109900936085504)

此功能为 OfflineAudioContext 添加增量渲染机制，使音频图数据能够逐步处理，而不必预先分配整个音频缓冲区。通过以数据块的形式逐步交付数据，在处理大量数据时，用户计算机无需具备很高的内存容量。

[跟踪问题 #530596178](https://issues.chromium.org/issues/530596178) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5109900936085504) | [规范](https://webaudio.github.io/web-audio-api/#dom-offlineaudiocontext-startrendering) | [说明文档](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/OfflineAudioContext/explainer.md) | [演示](https://gabrielsanbrito.github.io/demo_pages/oac-incremental-rendering)

## 其他

### [权限策略：focus-without-user-activation](https://chromestatus.com/feature/5179186249465856)

通过 `focus-without-user-activation` 权限策略，嵌入方可以控制嵌入内容以编程方式改变焦点的行为。如果发起操作的框架被此策略禁止，那么以编程方式进行的焦点变更（包括 `element.focus()`、`autofocus`、`window.focus()`，以及对话框和弹出框的聚焦步骤）都会被阻止，除非该框架具有瞬时用户激活状态，或焦点已经位于其子树内。这不会阻止对话框或弹出框打开。由用户发起的焦点操作（例如点击或按 Tab 键）始终不受影响。Chromium 对跨源 iframe 自动聚焦的现有限制保持不变：此策略可进一步限制自动聚焦，但允许此策略并不会让跨源框架获得自动聚焦能力。

可通过 `Permissions-Policy` HTTP 响应标头或 iframe 的 `allow` 属性设置此策略。此功能支持焦点委派：已获得焦点的父框架可以通过编程方式将焦点传递给子 iframe，即使子框架被此策略禁止也可以；框架一旦获得焦点，就可以在自身子树内移动焦点。

[跟踪问题 #40095111](https://crbug.com/40095111) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5179186249465856) | [规范](https://html.spec.whatwg.org/#focus-without-user-activation-feature) | [说明文档](https://github.com/ffiori/webappsec-permissions-policy/blob/focus-without-user-activation-explainer/policies/focus-without-user-activation.md)

### [SVG textPath 的 side 属性](https://chromestatus.com/feature/5422782593761280)

开发者可使用 textPath 元素的 side 属性，选择 SVG 文本沿路径的哪一侧排列。设置 side="right" 实际上会反转文本布局所使用的路径方向，从而可以轻松将文本放置在圆形路径的内侧或外侧，无需复制路径数据或手动反转路径数据。

[跟踪问题 #40362379](https://issues.chromium.org/issues/40362379) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5422782593761280) | [规范](https://w3c.github.io/svgwg/svg2-draft/text.html#TextPathElementSideAttribute)

### [circle() 和 ellipse() 基本形状支持 closest-corner 和 farthest-corner 半径](https://chromestatus.com/feature/5100672946143232)

除现有的 closest-side 和 farthest-side 外，CSS 基本形状函数 circle() 和 ellipse() 还接受 closest-corner 和 farthest-corner 半径关键字。这些关键字会解析为形状中心到参考框最近或最远角点的欧几里得距离，与 radial-gradient() 长期以来的行为一致。它们适用于 clip-path、shape-outside 和 offset-path，因此渐变所接受的同一套形状语法现在也可用于基本形状。

CL：[https://chromium-review.googlesource.com/c/chromium/src/+/7767079](https://chromium-review.googlesource.com/c/chromium/src/+/7767079)

[跟踪问题 #361617757](https://crbug.com/361617757) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5100672946143232) | [规范](https://drafts.csswg.org/css-shapes-1/#basic-shape-functions)

## 隔离式 Web 应用

### [Direct Sockets API 支持源特定组播](https://chromestatus.com/feature/6208452397498368)

为 Direct Sockets API 添加源特定组播（SSM）支持，允许隔离式 Web 应用在加入组播组时选择指定源地址，从而仅接收来自该源的 UDP 数据包。不提供源地址时，joinGroup() 使用任意源组播（ASM），会接收所有向该组发送数据的源所发出的数据包。SSM 对在专用网络之外使用组播至关重要，可简化数据包路由，并在网络层按源地址过滤流量，从而缓解欺骗和拒绝服务攻击。

[跟踪问题 #461262401](https://issues.chromium.org/issues/461262401) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6208452397498368) | [规范](https://wicg.github.io/direct-sockets/#dom-multicastgroupoptions-sourceaddress) | [说明文档](https://github.com/WICG/direct-sockets/blob/main/docs/multicast-explainer.md) | [演示](https://blockcast.network/live) | [演示](https://chromewebstore.google.com/detail/multicast-gateway-beacon/djikmiecejmojgcglkfmihhkfgekjlaj)

## 设备

### [支持 WebHID](https://chromestatus.com/feature/5172464636133376)

[WebHID API](https://developer.chrome.com/docs/extensions/how-to/web-platform/webhid) 使 Web 应用能够通过 USB 和蓝牙与人机接口设备（HID）交互，突破标准系统输入映射（例如鼠标、键盘、触摸屏和标准游戏手柄）的限制。Web 应用可请求用户授权连接 HID 设备，发送和接收输入报告、输出报告及特性报告，并检查报告描述符。WebHID 已在 Chrome 89 中面向[桌面平台](https://developer.chrome.com/docs/capabilities/web-apis/hid-examples)（Windows、macOS、Linux 和 ChromeOS）发布。

Chrome 158 将现有 WebHID API 引入 Android 版 Chrome（依赖 Android 17 / API level 37 及更高版本新增的操作系统支持），且不改变向 Web 暴露的 API 接口。

目前的常见用途包括定制机械键盘、小键盘和游戏鼠标，校准游戏手柄，以及在呼叫中心集成硬件耳机的通话控制功能。

WebView 不受支持，因为它没有设备选择器界面或权限交互控件。

可使用以下企业策略控制此功能：

- [DefaultWebHidGuardSetting](https://chromeenterprise.google/policies/#DefaultWebHidGuardSetting)
- [WebHidAllowAllDevicesForUrls](https://chromeenterprise.google/policies/#WebHidAllowAllDevicesForUrls)
- [WebHidAllowDevicesForUrls](https://chromeenterprise.google/policies/#WebHidAllowDevicesForUrls)
- [WebHidAllowDevicesWithHidUsagesForUrls](https://chromeenterprise.google/policies/#WebHidAllowDevicesWithHidUsagesForUrls)
- [WebHidAskForUrls](https://chromeenterprise.google/policies/#WebHidAskForUrls)
- [WebHidBlockedForUrls](https://chromeenterprise.google/policies/#WebHidBlockedForUrls)

详情请参阅 Chrome 企业版和教育版帮助中心的[设置 ChromeOS 设备政策](https://support.google.com/chrome/a/answer/1375678)。

[跟踪问题 #40628009](http://crbug.com/40628009) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5172464636133376) | [规范](https://hid.spec.whatwg.org) | [文档](https://web.dev/hid/) | [文档](https://web.dev/hid-examples/) | [说明文档](https://github.com/whatwg/hid/blob/main/EXPLAINER.md)

## 网络／连接

### [WebTransport 预期的并发传入流数量](https://chromestatus.com/feature/5089961022980096)

允许 WebTransport 应用指明预期同时保持打开的传入流数量。构造函数提示参数用于配置初始 QUIC 流额度，降低需要高流并发数的服务器因初始流数量限制而受阻的风险。

[跟踪问题 #565837025](https://issues.chromium.org/issues/565837025) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5089961022980096) | [规范](https://w3c.github.io/webtransport/#web-transport-configuration) | [说明文档](https://github.com/w3c/webtransport/issues/544) | [说明文档](https://github.com/w3c/webtransport/pull/574)

### [WebTransport 拥塞控制](https://chromestatus.com/feature/5180947573112832)

为 WebTransport 添加 congestionControl 构造函数选项和只读属性。应用可请求 "default"、"throughput" 或 "low-latency" 行为，让用户代理为每个会话选择适当的拥塞控制行为。

[跟踪问题 #501268547](https://issues.chromium.org/issues/501268547) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5180947573112832) | [规范](https://www.w3.org/TR/webtransport/#dom-webtransportoptions-congestioncontrol) | [说明文档](https://github.com/w3c/webtransport/blob/main/explainer.md)

### [WebTransport 会话排空](https://chromestatus.com/feature/6427766428925952)

WebTransport.draining 是一个 Promise，在服务器表示 WebTransport 会话将被平稳关闭时兑现。应用可利用此信号建立替代会话，而现有流和当前会话仍可继续使用。

[跟踪问题 #564353368](https://issues.chromium.org/issues/564353368) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6427766428925952) | [规范](https://w3c.github.io/webtransport/#dom-webtransport-draining) | [文档](https://github.com/w3c/webtransport/blob/main/explainer.md#11-handling-session-draining)

### [WebTransport 密钥材料导出](https://chromestatus.com/feature/4860330806214656)

新增 WebTransport.exportKeyingMaterial()，允许应用派生与已建立的 WebTransport 会话绑定的密码学密钥材料。

该方法接受应用提供的二进制标签值、上下文值以及请求的输出长度，并返回 Promise&lt;Uint8Array&gt;。Chromium 支持最多 255 字节的标签值和上下文值，以及 1 至 4096 字节（含边界）的输出长度。

对于基于 HTTP/3 的 WebTransport，Chromium 会在 TLS 导出器上下文中包含 WebTransport CONNECT 流 ID。这确保不同的 WebTransport 会话即使共用同一底层 HTTP/3 连接，也会派生出不同的密钥材料。

[跟踪问题 #556304550](https://issues.chromium.org/issues/556304550) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4860330806214656) | [规范](https://www.w3.org/TR/webtransport/#dom-webtransport-exportkeyingmaterial) | [说明文档](https://github.com/w3c/webtransport/blob/main/explainer.md)

### [WebTransport 接收流](https://chromestatus.com/feature/5109912169480192)

新增标准化的 WebTransportReceiveStream 接口。这是 ReadableStream 的子类，用于传入的单向流以及双向流的可读侧。其 getStats() 方法返回各个流的字节计数：bytesReceived 表示从网络接收的字节数，bytesRead 表示已交付给应用的字节数。

[跟踪问题 #568317222](https://issues.chromium.org/issues/568317222) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5109912169480192) | [规范](https://w3c.github.io/webtransport/#webtransportreceivestream) | [说明文档](https://github.com/w3c/webtransport/issues/372) | [说明文档](https://github.com/w3c/webtransport/pull/395)

### [WebTransport 可靠性属性](https://chromestatus.com/feature/5094058497277952)

新增 WebTransport.reliability 实例属性和静态属性 WebTransport.supportsReliableOnly。这些 API 可指明用户代理是否支持仅基于可靠连接的 WebTransport，以及已建立的会话是否支持数据报等不可靠传输。

在 Chromium 中，reliability 最初返回 "pending"，在 HTTP/3 WebTransport 连接建立后变为 "supports-unreliable"。由于 Chromium 目前不支持 HTTP/2 回退，WebTransport.supportsReliableOnly 返回 false；任何成功建立的会话都使用 HTTP/3，并支持不可靠数据报。

[跟踪问题 #545636884](https://issues.chromium.org/issues/545636884) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5094058497277952) | [规范](https://www.w3.org/TR/webtransport/#dom-webtransport-reliability) | [说明文档](https://github.com/w3c/webtransport/blob/main/explainer.md#transport-modes)

---

来源：[ChromeStatus Chrome 158 版本说明](https://chromestatus.com/release-notes/158)。本页由 ChatGPT 完整翻译英文正文；不包含站点导航与复制链接控件。页面源码保留 Copyright 2016 Google Inc. All Rights Reserved 及 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) 许可声明。本页为非官方简体中文译文。

发布核验：[ChromiumDash Windows Stable 记录](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=158&num=1000)和[官方 Early Stable 公告](https://chromereleases.googleblog.com/2026/11/early-stable-update-for-desktop.html)相互印证。最早匹配的实际 Stable 记录为 158.0.8127.18，发布时间为 2026-11-04（UTC）。公告确认此次为面向少量 Windows 用户的 Early Stable 推送，Mac 稍后发布。上方保留了文章的 Beta 渠道标记和计划日期，它们不作为实际发布日期的依据。
