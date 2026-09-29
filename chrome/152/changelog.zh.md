# Chrome 152

来源：[Chrome 152 Release Notes](https://developer.chrome.com/release-notes/152?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2026 年 8 月 25 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 152 稳定渠道版本。

只想了解重点？请参阅 [Chrome 152 新功能](https://developer.chrome.com/blog/new-in-chrome-152)。

## CSS 和界面

### `CSSPseudoElement` 支持 `::backdrop`、`::scroll-marker` 和 `::view-transition`

此前仅为 `::after`、`::before` 和 `::marker` 定义的 `CSSPseudoElement`，现在扩展到更多伪元素：

- `::backdrop`：点击背景遮罩时可以关闭对话框，且不干扰对话框内容内部的点击，无需复杂的交集判断即可识别点击位置。
- `::scroll-marker`：可用于收集点击统计信息。
- `::view-transition`：为支持感知几何变化的视图过渡，以及在过渡执行到一半时拦截并启动新过渡铺平道路。

[ChromeStatus.com 条目](https://chromestatus.com/feature/6516055192240128) | [规范](https://drafts.csswg.org/css-pseudo-4/#CSSPseudoElement-interface)

### 相对 alpha 颜色（CSS Color 5 `alpha()` 函数）

相对 alpha 颜色以原始颜色为参照，仅修改 alpha 通道，使开发者能够基于现有颜色值设置透明度。

[跟踪问题 #492246715](https://issues.chromium.org/issues/492246715) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5070160203481088) | [规范](https://drafts.csswg.org/css-color-5/#relative-alpha)

### `window-drag` CSS 属性

`window-drag` CSS 属性允许网页内容指定已安装桌面 Web 应用界面中的可拖动窗口标题栏区域。设置后，点击并拖动等指针操作会移动顶层应用窗口，而不是触发普通页面交互。该功能将现有的 `app-region` CSS 属性标准化并重命名，将其值改为 `move` 和 `none`，并明确继承行为。

[跟踪问题 #477608113](https://issues.chromium.org/issues/477608113) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5201338641285120) | [规范](https://drafts.csswg.org/css-ui-4/#window-drag)

## DOM 和 HTML

### 暴露全局 HTML 属性 `autocorrect`

HTML `autocorrect` 属性允许网页作者控制自动更正是否应用于可编辑元素中的用户输入，包括 `<input>`、`<textarea>` 和 `contenteditable` 宿主。此功能暴露全局 HTML 属性 `autocorrect`，并将其映射到 `HTMLElement` 上。

[跟踪问题 #40871769](https://issues.chromium.org/issues/40871769) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6264645053710336) | [规范](https://html.spec.whatwg.org/multipage/interaction.html#autocorrection)

### OpaqueRange

`OpaqueRange` 表示表单控件值中的一段实时文本，例如 `<textarea>` 或文本型 `<input>` 的内容，因此开发者可以通过类似 Range 的 API 操作值文本。它支持 `getBoundingClientRect()`、`getClientRects()` 等操作，并可与 CSS Custom Highlight API 集成，实现行内建议、高亮和锚定弹出框。它只暴露值中的偏移量，并让 `startContainer` 与 `endContainer` 返回 `null`，以保持封装性。

[跟踪问题 #421421332](https://issues.chromium.org/issues/421421332) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6297362687066112) | [规范](https://github.com/whatwg/dom/pull/1404)

### 跨根 ARIA 的 Reference Target

Reference Target 可将 `<label for>`、`aria-labelledby`、`popovertarget` 和 `commandfor` 等 ID 引用转发到组件 Shadow DOM 内的元素，同时保持内部状态封装。当 Shadow Host 指定其 Shadow Tree 中的某个元素作为引用目标时，指向该 Host 的所有 ID 引用都会转发到目标元素。可以通过 `<template>` 上的 `shadowrootreferencetarget` 属性声明式设置引用目标，也可以在 JavaScript 中使用 `ShadowRoot.prototype.referenceTarget` 设置。

[跟踪问题 #346835896](https://issues.chromium.org/issues/346835896) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5188237101891584) | [规范](https://github.com/whatwg/html/pull/10995)

## Web 应用

### macOS 上的 PWA 通知归属

渐进式 Web 应用（PWA）安装到 macOS 后，其通知原生归属于该 PWA 本身，通知中心显示应用自己的名称和图标，不再显示 Google Chrome。PWA 通知与原生 macOS 应用保持一致：Chrome 不再支持 macOS 通知的 `requireInteraction` 字段；要显示应用徽章，Badging API 需要通知权限。

[跟踪问题 #327449602](https://issues.chromium.org/issues/327449602) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5863296436666368) | [规范](https://notifications.spec.whatwg.org)

### 隔离 Web 应用的子应用

子应用允许开发者在单个隔离 Web 应用（IWA）安装项下创建多个应用。每个子应用有独立的名称、图标和操作系统集成，在桌面架上呈现不同于父 IWA 的身份，同时仍共用一套 IWA 安装与更新流程。管理员可以使用企业政策控制此能力。

[跟踪问题 #414729785](https://issues.chromium.org/issues/414729785) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6260680824061952) | [规范](https://wicg.github.io/sub-apps)

### 隔离 Web 应用的无边框显示模式

无边框显示模式移除标准窗口边框和标题栏，使隔离 Web 应用能够占满整个浏览器窗口，优化可用工作空间，并让开发者通过自定义品牌与菜单层级实现独特的用户体验。管理员可通过窗口管理企业政策管理此功能。

[跟踪问题 #477512407](https://issues.chromium.org/issues/477512407) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5551475195904000) | [规范](https://wicg.github.io/manifest-incubations/index.html#dfn-unframed)

## 性能与网络

### CPU Performance API

CPU Performance API 允许 Web 应用判断用户设备的 CPU 性能档位。Web 应用可利用该信息改善用户体验，也可以结合 Compute Pressure API 响应 CPU 压力变化。用户和管理员可通过 Chrome 设置及企业政策覆盖报告的性能档位。

[跟踪问题 #449760252](https://issues.chromium.org/issues/449760252) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5189864286978048) | [规范](https://wicg.github.io/cpu-performance)

### 连接允许名单

连接允许名单通过限制文档或 Worker 使用 Fetch API 等 Web 平台 API 发起的连接，提供对外部端点的明确控制。服务器通过 HTTP 响应头下发获准端点列表；Chrome 在建立连接前，将目标端点与允许名单核对。

[跟踪问题 #447954811](https://issues.chromium.org/issues/447954811) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5175745573945344) | [规范](https://wicg.github.io/connection-allowlists)

## 媒体、传感器和输入

### `MediaCapabilities.decodingInfo.encryptionScheme`

向 `navigator.mediaCapabilities.decodingInfo()` 使用的 `KeySystemTrackConfiguration` 字典添加 `encryptionScheme` 属性。Web 应用据此可查询特定加密方案（例如 `'cenc'` 或 `'cbcs'`）是否受支持。

[跟踪问题 #498284510](https://issues.chromium.org/issues/498284510) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4644898109259776) | [规范](https://w3c.github.io/media-capabilities/#dom-keysystemtrackconfiguration-encryptionscheme)

### `getDisplayMedia()` 中的音频偏好采集

此提示允许 Web 应用向浏览器表明希望在共享视频的同时共享音频，有助于依赖音频采集的应用顺畅工作。

[跟踪问题 #535514300](https://issues.chromium.org/issues/535514300) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5085785343787008) | [规范](https://w3c.github.io/mediacapture-screen-share/#dom-displaymediastreamoptions-audioselection)

### WebGPU：控制子组大小

新增可选 GPU 功能 `"subgroup-size-control"`，允许在计算着色器中显式设置子组大小。对目标硬件平台，尤其是 AI 工作负载，可借助特定子组大小的子组操作优化计算着色器性能。

[跟踪问题 #463721943](https://issues.chromium.org/issues/463721943) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5077657663438848) | [规范](https://github.com/gpuweb/gpuweb/pull/5578)

## 隐私与安全

### 可疑网站警告

对于启用安全浏览增强保护的用户，Chrome 在访问有潜在恶意信号的网站时显示可跳过的警告弹窗。对于已确认的恶意网站，现有的整页警告仍会显示；此警告是在其基础上增加的。管理员可通过安全浏览政策配置该功能。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5427561449521152)

## 来源试用

### 客户端 XSLT 的弃用试用

客户端 XSLT 已弃用，计划从 Web 平台移除。从 Chrome 152 开始提供弃用试用，以给网站更多迁移时间。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/1902207892610613249) | [跟踪问题 #435623334](https://issues.chromium.org/issues/435623334) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4709671889534976)

### Speculation Rules：适中视口启发式控制

提供用于推测规则视口启发式的实验性控制项，让开发者测试其他启发式参数是否比默认设置带来更好的预取与预渲染效果。

[跟踪问题 #529423512](https://issues.chromium.org/issues/529423512) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6240467143491584)

### User Agent Image Replacement API

允许开发者观察浏览器何时代表用户修改或替换页面图像媒体（例如利用生成式 AI），以便文档调整其他内容并减少可能造成的困惑。

[跟踪问题 #544822216](https://issues.chromium.org/issues/544822216) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5076374013476864) | [规范](https://github.com/explainers-by-googlers/ua-image-replacement)

## 弃用与移除

### 移除 Private Aggregation API

在 Chrome 宣布维持目前的第三方 Cookie 做法之后，Private Aggregation API（以及相关 Privacy Sandbox API）被弃用并移除。

[ChromeStatus.com 条目](https://chromestatus.com/feature/4683382919397376) | [规范](https://patcg-individual-drafts.github.io/private-aggregation-api)
