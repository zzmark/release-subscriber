# Chrome 143

来源：[Chrome 143 Release Notes](https://developer.chrome.com/release-notes/143?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2025 年 12 月 2 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 143 稳定渠道版本。

只想了解重点？请参阅 [Chrome 143 新功能](https://developer.chrome.com/blog/new-in-chrome-143)。

## CSS 和界面

### CSS 锚定回退容器查询

新增 `@container anchored(fallback)`，可根据实际应用的 `position-try-fallbacks`，为锚点定位元素的后代设置样式。

这类查询可根据锚点与锚定元素的相对位置，设置锚定元素连接部分或动画的样式。

[跟踪问题 #417621241](https://issues.chromium.org/issues/417621241) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5177580990496768) | [规范](https://drafts.csswg.org/css-anchor-position-2/#anchored-container-queries)

### `background-position-x/y` 长属性的边缘相对语法

该语法可以相对于背景图像的一条边定义其位置。

与需要随窗口或 frame 大小调整的固定值相比，这提供了更灵活且响应式的背景图像定位方式。

同一功能也适用于 `-webkit-mask-position` 属性，以保持相同的 Web 兼容性水平。

[跟踪问题 #40468636](https://issues.chromium.org/issues/40468636) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5073321259565056) | [规范](https://drafts.csswg.org/css-backgrounds-4/#background-position-longhands)

### 实现 CSS 属性 `font-language-override`

支持 CSS 属性 `font-language-override`。开发者可直接在 CSS 中指定四字符语言标记，覆盖用于 OpenType 字形替换的系统语言。

这提供细粒度排版控制，尤其适用于多语言内容或带有特定语言字形变体的字体。

[跟踪问题 #41170551](https://issues.chromium.org/issues/41170551) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5149766073843712) | [规范](https://www.w3.org/TR/css-fonts-4/#font-language-override-prop)

### Web App Manifest：指定更新资格

在清单规范中指定更新资格算法。这使更新过程更确定、更可预测，让开发者更好地控制现有安装何时及是否应用更新，也允许移除用户代理目前为避免浪费网络资源而实施的*更新检查节流*。

[跟踪问题 #403253129](https://issues.chromium.org/issues/403253129) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5148463647686656)

## 设备

### Gamepad `ongamepadconnected` 与 `ongamepaddisconnected` 事件处理属性

向 `WindowEventHandlers` 接口混入添加 `ongamepadconnected` 和 `ongamepaddisconnected` 事件处理程序。

因此支持以下事件处理属性：

- `window.ongamepadconnected`
- `document.body.ongamepadconnected`
- `window.ongamepaddisconnected`
- `document.body.ongamepaddisconnected`

[跟踪问题 #40175074](https://issues.chromium.org/issues/40175074) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5109540852989952) | [规范](https://w3c.github.io/gamepad/#extensions-to-the-windoweventhandlers-interface-mixin)

## DOM

### JavaScript DOM API 允许更多字符

HTML 解析器允许元素及属性使用多种有效字符和名称，但用来创建相同元素与属性的 JavaScript DOM API 更严格，与解析器不一致。

此变更放宽 JavaScript DOM API 的验证，使之与 HTML 解析器一致。

[跟踪问题 #40228234](https://issues.chromium.org/issues/40228234) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6278918763708416) | [规范](https://dom.spec.whatwg.org/#namespaces)

## 图形

### WebGPU：纹理分量重排

允许 `GPUTextureViews` 在着色器访问纹理时，重新排列或替换纹理红、绿、蓝、alpha 通道中的颜色分量。

[跟踪问题 #414312052](https://issues.chromium.org/issues/414312052) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5110223547269120) | [规范](https://gpuweb.github.io/gpuweb/#dom-gpufeaturename-texture-component-swizzle)

## JavaScript

### ICU 77（支持 Unicode 16）

Unicode 支持库 ICU（International Components for Unicode）从 74.2 升级到 77.1，增加 Unicode 16 支持并更新区域设置数据。对于假定 Intl JS API 返回特定格式的 Web 应用，有两项变化可能带来风险：

1. 意大利语数字格式默认不再为四位数添加千位分隔符。例如，`new Intl.NumberFormat("it").format(1234)` 将返回 1234，而不是 1.234。可以通过 `Intl.NumberFormat` 构造函数的 `useGrouping` 参数恢复旧行为。
2. 某些英语区域设置（`en-AU`、`en-GB`、`en-IN`）在完整星期名称后增加逗号，例如将 Saturday 30 April 2011 改为 Saturday, 30 April 2011。Web 应用应避免依赖日期的精确格式，未来它还可能再次变化。

[跟踪问题 #421834885](https://issues.chromium.org/issues/421834885) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5143313833000960) | [规范](https://tc39.es/ecma402)

### EditContext：TextFormat 的 underlineStyle 与 underlineThickness

Chrome 已发布的 [EditContext API](https://developer.mozilla.org/docs/Web/API/EditContext) 存在问题：[textformatupdate 事件](https://developer.mozilla.org/docs/Web/API/EditContext/textformatupdate_event)提供的 [`TextFormat`](https://developer.mozilla.org/docs/Web/API/TextFormat) 对象，其 `underlineStyle` 和 `underlineThickness` 属性值不正确。Chrome 143 之前，可能的值分别是 `None`、`Solid`、`Dotted`、`Dashed`、`Squiggle`，以及 `None`、`Thin`、`Thick`；规范规定的值则为 `none`、`solid`、`dotted`、`dashed`、`wavy`，以及 `none`、`thin`、`thick`。

Chrome 143 现在实现了规范规定的正确值。

[跟踪问题 #354497121](https://issues.chromium.org/issues/354497121) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6229300214890496) | [规范](https://w3c.github.io/edit-context/#textformatupdateevent)

### `insertFromPaste`、`insertFromDrop` 和 `insertReplacementText` 输入事件的 `DataTransfer` 属性

对于 `inputType` 为 `insertFromPaste`、`insertFromDrop` 或 `insertReplacementText` 的输入事件，填充 `dataTransfer` 属性，使 contenteditable 元素在编辑期间能访问剪贴板和拖放数据。

`dataTransfer` 对象包含 `beforeinput` 事件期间可用的相同数据。

该功能仅适用于 contenteditable 元素。表单控件（textarea、input）的行为不变：data 属性包含插入的文本，而 `dataTransfer` 仍为 null。

[跟踪问题 #401593412](https://issues.chromium.org/issues/401593412) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6715253274181632) | [规范](https://w3c.github.io/input-events/#dom-inputevent-datatransfer)

### FedCM：支持 IdP 的结构化 JSON 响应

允许身份提供方（IdP）通过 `id_assertion_endpoint`，向依赖方（RP）返回结构化 JSON 对象，而不只是纯字符串。

这样无需手动序列化和解析 JSON 字符串，简化开发者集成，并支持更动态、灵活的身份验证流程。RP 可以直接解释复杂响应，无需带外约定即可支持 OAuth2、OIDC 或 IndieAuth 等多种协议。

[跟踪问题 #346567168](https://issues.chromium.org/issues/346567168) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5153509557272576) | [规范](https://github.com/w3c-fedid/FedCM/pull/771)

## 网络

### WebTransport 应用协议协商

WebTransport 应用协议协商允许在 WebTransport 握手期间协商 Web 应用使用的协议。

创建 `WebTransport` 对象时，Web 应用可列出提供的应用协议，通过 HTTP 头传递给服务器。如果服务器选择其中一种协议，可在响应头中指明，结果也可从 WebTransport 对象读取。

[跟踪问题 #416080492](https://issues.chromium.org/issues/416080492) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6521719678042112) | [规范](https://w3c.github.io/webtransport/#dom-webtransportoptions-protocols)

## 性能

### 推测规则：改进移动端 `eager` 积极程度

在移动端，`eager` 推测规则的预取与预渲染现在会在 HTML 锚点元素短暂进入视口后触发。

[跟踪问题 #436705485](https://issues.chromium.org/issues/436705485) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5086053979521024) | [规范](https://html.spec.whatwg.org/multipage/speculative-loading.html#speculative-loading)

## WebRTC

### WebRTC RTP 头扩展行为变化

实现规范的一项变更：除非用户有意如此，否则后续 Offer 或 Answer 不会改变已协商头扩展的顺序。

[跟踪问题 #439514253](https://issues.chromium.org/issues/439514253) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5135528638939136) | [规范](https://w3c.github.io/webrtc-extensions/#rtp-header-extension-control-modifications)

## 隔离 Web 应用

### 隔离 Web 应用的 Web Smart Card API

仅限隔离 Web 应用（IWA）使用。此 API 允许智能卡（PC/SC）应用迁移到 Web 平台，可访问主机操作系统提供的 PC/SC 实现及读卡器驱动。

管理员可以通过以下方式控制此 API：

- 全局：使用 `DefaultSmartCardConnectSetting` 政策。
- 按应用：使用 `SmartCardConnectAllowedForUrls` 和 `SmartCardConnectBlockedForUrls` 政策。

[跟踪问题 #1386175](https://issues.chromium.org/issues/1386175) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6411735804674048) | [规范](https://wicg.github.io/web-smart-card)

## 来源试用

### Digital Credentials API（签发支持）

签发网站（例如大学、政府机构或银行）可以安全地发起数字凭据配置（签发）流程，直接将凭据写入用户移动钱包应用。在 Android 上，此能力使用 Android `IdentityCredential` CredMan 系统（Credential Manager）；在桌面端，则通过类似数字凭据展示的 CTAP 协议采用跨设备方式。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/385620718093598721) | [跟踪问题 #378330032](https://issues.chromium.org/issues/378330032) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5099333963874304) | [规范](https://w3c-fedid.github.io/digital-credentials)

### Web Install API

提供安装 Web 应用的能力。调用后，网站可根据提供的参数，将自身或其他来源的网站安装为 Web 应用。

[来源试用](https://developer.chrome.com/origintrials/#/view_trial/2367204554136616961) | [跟踪问题 #333795265](https://issues.chromium.org/issues/333795265) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5183481574850560) | [规范](https://github.com/w3c/manifest/pull/1175)

## 弃用与移除

## 弃用 XSLT

所有浏览器遵循的 XSLT v1.0 于 1999 年标准化。此后 XSLT 发展到 v2.0 和 v3.0，增加了新功能，也与浏览器中冻结的版本逐渐分离。再加上能更灵活、更强大地操作 DOM 的 JavaScript 库与框架兴起，客户端 XSLT 的使用显著下降。在浏览器中，其作用已很大程度被 JSON、React 等基于 JavaScript 的技术取代。

Chromium 使用 libxslt 库处理这些转换，而 libxslt 在 2025 年曾有约六个月无人维护。Libxslt 是复杂且老旧的 C 代码库，容易出现缓冲区溢出等内存安全漏洞，可能导致任意代码执行。客户端 XSLT 如今使用很少；相关库得到的维护与安全审查远少于核心 JavaScript 引擎，却直接处理不受信任的 Web 内容，构成强大的攻击面。事实上，XSLT 是近期多起严重安全漏洞的来源，持续威胁浏览器用户。因此 Chromium（以及另外两个浏览器引擎）计划从 Web 平台弃用并移除 XSLT。详情参阅[为提高浏览器安全性而移除 XSLT](https://developer.chrome.com/docs/web-platform/deprecating-xslt)。

[ChromeStatus.com 条目](https://chromestatus.com/feature/4709671889534976)

### 弃用 Intl Locale Info 的 getter

Intl Locale Info API 是 ECMAScript TC39 第 3 阶段提案，旨在通过暴露区域设置的星期数据（每周首日、周末开始日、周末结束日、首周最少天数）以及文本方向、小时周期等信息增强 Intl.Locale 对象。

规范第 3 阶段的更改将若干 getter 改为函数。Chrome 现据此更新实现。

[跟踪问题 #42203770](https://issues.chromium.org/issues/42203770) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5148228059398144) | [规范](https://tc39.es/proposal-intl-locale-info)

### FedCM 对客户端元数据的隐私约束

为了应对 FedCM API 中的跨站身份关联风险，在配置中使用 client\_metadata 的身份提供方（IdP）必须在 `.well-known/web-identity` 文件中实现直接端点格式。只要存在 client\_metadata\_endpoint，就必须显式定义 accounts\_endpoint 与 login\_url。这样可防止依赖方利用元数据跨多个网站关联用户身份，加强隐私保护。

Chrome 143 处于警告阶段：如果有 client\_metadata\_endpoint，但缺少 accounts\_endpoint 或 login\_url，浏览器会显示控制台警告，以便 IdP 有时间更新配置。

[ChromeStatus.com 条目](https://chromestatus.com/feature/4614417052467200) | [规范](https://github.com/w3c-fedid/FedCM/pull/760)

### FedCM：将 nonce 移至 params 字段，并把 `IdentityCredentialError` 的 `code` 属性重命名为 `error`

将 nonce 移到 params 字段：为改善 API 设计、扩展性和可维护性，`navigator.credentials.get()` 的 nonce 参数正从顶层字段移至 params 对象。这种结构便于 IdP 解析，并支持未来扩展而无需增加版本号，同时符合现代 API 模式。对依赖方影响很小：只是将相同 nonce 值放到新位置。

Chrome 143 处于警告阶段：顶层和 params 中的 nonce 均可接受，但使用顶层字段会触发控制台警告。

在 `IdentityCredentialError` 中将 code 重命名为 error：`code` 属性改名为 `error`，让语义更清晰、开发体验更好，并符合 Web 标准。此举减少歧义，也避免与 `DOMException.code` 冲突。此外，`error.code` 将变为 `error.error`，仍保持 DOMString 类型。

Chrome 143 处于警告阶段：`error` 和 `code` 属性均受支持，但使用 `code` 会触发控制台警告，引导开发者迁移。

[跟踪问题 #427474985](https://issues.chromium.org/issues/427474985) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5124072820310016) | [规范](https://github.com/w3c-fedid/FedCM/pull/768)
