# Chrome 150

来源：[Chrome 150 Release Notes](https://developer.chrome.com/release-notes/150?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2026 年 6 月 30 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 150 稳定渠道版本。

只想了解重点？请参阅 [Chrome 150 新功能](https://developer.chrome.com/blog/new-in-chrome-150)。

## CSS 和界面

### `AccentColor` 与 `AccentColorText` 系统颜色

CSS 可通过 `AccentColor` 和 `AccentColorText` 系统颜色访问用户设备上设置的系统强调色。开发者因此能在用户期望与操作系统主题集成的场景（如已安装的 Web 应用）中，为网页内容应用类似原生应用的样式。只有在初始配置文件中使用已安装 Web 应用的用户才能看到系统强调色的渲染效果。

[跟踪问题 #40229450](https://issues.chromium.org/issues/40229450) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5068127364186112) | [规范](https://www.w3.org/TR/css-color-4/#css-system-colors)

### `polygon()` 可选圆角参数

CSS 形状函数 `polygon()` 增加可选的顶点圆角参数。开发者可以指定长度值为多边形顶点添加圆角，无需手工计算贝塞尔曲线。

[跟踪问题 #329302249](https://issues.chromium.org/issues/329302249) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6636392944893952) | [规范](https://drafts.csswg.org/css-shapes-1/#funcdef-basic-shape-polygon)

### 可动画化的 `zoom`

CSS `zoom` 属性现可执行动画，并按 `<number>` 插值。开发者可以对 `zoom` 进行过渡和动画，使元素及其布局平滑缩放，作为现有基于变换的缩放方式的补充。

[跟踪问题 #393810951](https://issues.chromium.org/issues/393810951) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5183671737909248)

### CSS `url()` 请求修饰符

CSS `url()` 函数在带引号的 URL 字符串后接受可选请求修饰符：`cross-origin()`、`integrity()` 和 `referrer-policy()`。这些修饰符直接从 CSS 控制引用资源的获取行为，无需修改 HTML 标记或 JavaScript。例如，`background-image: url("image.png" cross-origin(anonymous))` 会以匿名 CORS 模式获取图像。这让作者能够细粒度地控制 CSS 加载的图像、字体、SVG 引用和导入样式表等资源的跨源访问、子资源完整性及 Referrer Policy。

[跟踪问题 #435625756](https://issues.chromium.org/issues/435625756) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5111997147512832) | [规范](https://drafts.csswg.org/css-values-5/#request-url-modifiers)

### CSS `text-fit` 属性

根据文本节点所在容器的宽度缩放字号，使文字恰好填满容器。

开发者可据此确保标题或动态内容填满可用的水平空间，无需手动计算字号，也不必采用复杂的 JavaScript 变通方案。它提供原生 CSS 的可靠响应式排版方式，能在不同屏幕尺寸和文本长度下保持视觉对齐。

[跟踪问题 #417306102](https://issues.chromium.org/issues/417306102) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5104141688635392) | [规范](https://drafts.csswg.org/css-text-5/#text-fit-property)

### CSS `background-clip: border-area`

实现 CSS Backgrounds Level 4 中定义的 `background-clip` 属性 `border-area` 值。`background-clip: border-area` 将元素背景裁剪到边框笔画覆盖区域，考虑 `border-width` 和 `border-style`，但忽略 `border-color` 的透明度。开发者可据此实现渐变边框，而无需 `border-image`。WebKit 已提供此功能，Chromium 的实现使两者保持一致。

[跟踪问题 #329302543](https://issues.chromium.org/issues/329302543) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6234471210811392) | [规范](https://drafts.csswg.org/css-backgrounds-4/#valdef-background-clip-border-area)

### CSS `image(<color>)` 函数

`image()` 函数让作者能够从任意颜色生成纯色图像。语法为：`image() = image( <color> )`。

[跟踪问题 #510426954](https://issues.chromium.org/issues/510426954) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5121011285622784) | [规范](https://drafts.csswg.org/css-images-4/#image-notation)

### 图像值可用于 CSS `light-dark()`

扩展 CSS `light-dark()` 函数，使其在作者样式表中接受图像值（`url()`、`image-set()`、`none`）。因此，`background-image`、`list-style-image`、`border-image-source`、`cursor`、`content` 等图像属性可以根据用户偏好的配色方案自动切换图像。此前此能力仅在用户代理样式表中提供。它符合 CSS Color 5 规范，并与 Firefox 已有的实现一致。

[跟踪问题 #491829958](https://issues.chromium.org/issues/491829958) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5123253146353664) | [规范](https://drafts.csswg.org/css-color-5/#light-dark)

### 逗号分隔的容器查询

每条 `@container` 规则支持多个查询。只要其中至少一个查询匹配，该规则就会应用。

这使开发者可以为未获所有浏览器支持的功能提供回退查询。

[跟踪问题 #41491726](https://issues.chromium.org/issues/41491726) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6196591858941952) | [规范](https://drafts.csswg.org/css-conditional-5/#container-rule)

### 通过 CSS 暴露不可打印区域

打印机通常无法可靠地在纸张四边的小区域着墨，这通常与进纸机制有关。默认页边距一般大于这些区域，但如果作者自行设置页边距，甚至希望添加 `@page` 页边距框（如自定义页眉和页脚），就需要知道哪些地方能够安全打印。

CSS 描述符 `page-margin-safety` 可帮助避开这些不可打印区域。

[跟踪问题 #368070327](https://issues.chromium.org/issues/368070327) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5515971464527872) | [规范](https://drafts.csswg.org/css-page-3/#page-margin-safety)

### `flex-wrap: balance`

`flex-wrap: balance` 让开发者在弹性行之间分配内容，使其看起来更加均衡（类似 `text-wrap: balance`）。

[跟踪问题 #416755656](https://issues.chromium.org/issues/416755656) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4547107962486784) | [规范](https://drafts.csswg.org/css-flexbox-2)

### CSS `@supports` 的 `named-feature()` 函数

`named-feature()` 允许 CSS `@supports` 规则查询少量特定的具名功能。这些功能无法通过其他 `@supports` 机制检测，但具有很高的检测价值。

[跟踪问题 #353715317](https://issues.chromium.org/issues/353715317) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5153932394102784) | [规范](https://drafts.csswg.org/css-conditional-5/#typedef-supports-named-feature-fn)

### `overscroll-behavior: chain`

`overscroll-behavior` 现在有四个值：`none`、`auto`、`contain` 和新增的 `chain`。这些值影响两个独立效果：滚动传播和局部边界效果（例如过度滚动时的拉伸）。

- `none`：不传播，没有局部效果。
- `auto`：传播，有局部效果。
- `contain`：不传播，有局部效果。
- `chain`：传播，没有局部效果。

[跟踪问题 #499018879](https://issues.chromium.org/issues/499018879) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5176802466201600) | [规范](https://drafts.csswg.org/css-overscroll-1/#propdef-overscroll-behavior)

### 支持 CSS 属性 `path-length`

新增 CSS 属性 `path-length`，映射到现有的 SVG `pathLength` 表现属性。它适用于支持 `pathLength` 的 SVG 几何元素，包括 `<path>`、`<circle>`、`<rect>`、`<line>`、`<polyline>`、`<polygon>` 和 `<ellipse>`。

[跟踪问题 #40670251](https://issues.chromium.org/issues/40670251) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4861677550043136) | [规范](https://github.com/w3c/svgwg/pull/1073)

## DOM 和 HTML

### 克隆到所有后代 `selectedcontent` 元素

对 `selectedcontent` 元素的边缘情况作出几项小调整：

- 当一个 select 元素同时包含多个 `selectedcontent` 元素时，所有元素都会保持更新，而不是只更新 DOM 顺序中的第一个。
- 如果更新 `selectedcontent` 会发生在插入、移除或移动步骤期间，则推迟更新以修复安全问题。更新通过后插入步骤或微任务推迟执行。

[跟踪问题 #458113204](https://issues.chromium.org/issues/458113204) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5863985044914176) | [规范](https://github.com/whatwg/html/pull/12263)

### `Focusgroup`

提供声明式方式，为复合组件添加方向键导航、确定的 Tab 焦点停靠点以及上次焦点记忆，取代手工编写的巡回 `tabindex` 脚本。例如：

```text
<div focusgroup="toolbar wrap" aria-label="Formatting">
  <button>Bold</button>
  <button>Italic</button>
  <button>Underline</button>
</div>
```

[ChromeStatus.com 条目](https://chromestatus.com/feature/5637601087193088) | [规范](https://github.com/whatwg/html/pull/11723)

### 乱序流式更新

使用 `<template for>` 和处理指令范围（`<?marker>`、`<?start>` 和 `<?end>`），无需 JavaScript 即可更新文档已有部分。

[跟踪问题 #431374376](https://issues.chromium.org/issues/431374376) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5111042975465472) | [规范](https://github.com/whatwg/html/pull/11818)

### 在 HTML 中解析处理指令

处理指令（语法：`<?target data>`）是现有的 DOM 构造，在 XML 中对外开放，表示不是元素但可能对文档处理有语义作用的节点对象。

HTML 解析器现在会解析处理指令，并为其提供类似元素的属性 API，以便修改其数据。

[跟踪问题 #481087638](https://issues.chromium.org/issues/481087638) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6534495085920256) | [规范](https://github.com/whatwg/html/pull/12118)

### `popover=hint` 行为调整

此变更为 `popover=hint` 属性及其与 `popover=auto` 的交互实现了经过修订且更简单的堆叠模型。此前两类弹出框在某些边缘情况（如在提示弹出框中嵌套自动弹出框）的交互较复杂，可能导致意外行为。新模型下，打开提示弹出框不会意外关闭无关的自动弹出框。只有祖先自动弹出框隐藏，或打开新的、无关的自动弹出框时，提示弹出框才会隐藏。此外，开发者可以安全地在提示弹出框中嵌套自动弹出框；嵌套的自动弹出框不会抛出异常或破坏堆叠，而会平稳“降级”，按提示弹出框运行。这支持将 `customizable-select` 放在 `popover=hint` 中等用例。

为进一步提升可预测性并防止复杂状态变更，从 `beforetoggle` 事件内部打开或关闭弹出框的行为也受到更严格约束。此前只对部分情况设置了防护。此次重构了检测机制，使所有这类情况更可靠地抛出 `InvalidStateErrors`，从而保持弹出框状态管理稳定，并防止循环重入错误。

[跟踪问题 #499019927](https://issues.chromium.org/issues/499019927) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6282804208992256) | [规范](https://github.com/whatwg/html/pull/12345)

### 程序化滚动 Promise

此功能为程序化平滑滚动的完成状态提供可靠信号。`Element` 和 `Window` 上所有滚动方法都会返回 `Promise`，滚动完成时兑现，其结果表示滚动是否被中断。

[跟踪问题 #41406914](https://issues.chromium.org/issues/41406914) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5082138340491264) | [规范](https://github.com/w3c/csswg-drafts/issues/1562)

## 图形与媒体

### 禁止对插件和 iframe 应用 `SVG` 滤镜

Chrome 150 将阻止 `SVG` 滤镜应用于嵌入式插件（例如 PDF）以及跨源或受限 iframe（例如沙盒 iframe）。如果插件或 iframe 将使用 SVG 滤镜效果绘制，浏览器会遍历效果树，找出没有 SVG 滤镜的最高层祖先，并改用该祖先的效果。

[跟踪问题 #476646486](https://issues.chromium.org/issues/476646486) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5117170452398080) | [规范](https://github.com/w3c/csswg-drafts/pull/13846)

### WebGPU：Immediates

在 WGSL 中增加新的 immediate 地址空间，并在渲染通道、计算通道和渲染包编码器上添加 `setImmediateData()` 方法。开发者无需创建 GPU 缓冲对象或绑定组，就能将少量频繁更新的数据直接传给着色器。

[跟踪问题 #366291600](https://issues.chromium.org/issues/366291600) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5199437611794432) | [规范](https://github.com/gpuweb/gpuweb/pull/5423)

## 安全与 Web Speech

### 为 `data:` URL 分配不透明来源

Chrome 150 更新专用 Worker 和共享 Worker 处理 [`data:` URL](https://datatracker.ietf.org/doc/html/rfc2397) 的方式。它们不再自动继承创建它们的脚本或页面的安全来源，而是被分配一个唯一的不透明来源。

这与 Worker 的 [HTML 规范](https://www.w3.org/TR/2021/NOTE-workers-20210128/#worker)保持一致，通过将 Worker 与创建者的同源状态隔离，防止其使用 `BroadcastChannel` 或同源存储等机制访问敏感数据。为了保持正确的隔离边界，这些 Worker 仍位于与创建者相同的存储分区（例如保留顶层网站或 nonce）。

[跟踪问题 #40051700](https://issues.chromium.org/issues/40051700) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6290352295247872) | [规范](https://html.spec.whatwg.org/multipage/workers.html#script-settings-for-workers)

### Web Speech API：设备端识别质量

向 `SpeechRecognitionOptions` 添加 `quality` 属性，扩展 `SpeechRecognition` 接口。开发者可据此指定设备端识别（`processLocally: true`）所需的语义能力。

拟议的质量枚举有三个级别：`command`、`dictation` 和 `conversation`，对应逐渐增加的任务复杂度及硬件需求。开发者因此可以判断本地设备能否处理会议转录等高要求场景，或是否应退回云端服务。

[跟踪问题 #476168420](https://issues.chromium.org/issues/476168420) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5136859632107520) | [规范](https://webaudio.github.io/web-speech-api)

## Web 应用

### `PWA` 来源迁移

用户安装渐进式 Web 应用（`PWA`）后，其身份和安全上下文与 Web 来源（例如 `app.example.com`）紧密绑定。品牌重塑、域名重组或技术架构调整需要改变 PWA 来源时，这会给开发者带来重大难题。没有来源迁移机制，用户必须手动卸载旧应用并重新安装新应用，体验中断且可能造成用户流失。Chrome 150 引入一种机制，让开发者将已安装的 PWA 平滑迁移到同站点的新来源，同时保留用户信任和权限。

[WebAppInstallForceList](https://chromeenterprise.google/policies/#WebAppInstallForceList) 政策会阻止迁移。企业的 Web 应用政策主要基于 URL 和来源，因此迁移可能绕过管理员配置的某些政策。对于企业管理员强制安装的应用，不会向用户提供迁移，而会显示横幅说明原因。

[跟踪问题 #396504527](https://issues.chromium.org/issues/396504527) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5123349239955456) | [规范](https://github.com/WICG/manifest-incubations/pull/136)

## 来源试用

### 电子邮件验证协议

`EVP`（电子邮件验证协议）通过顺畅地提供所有权加密证明，而非手动输入电子邮件一次性密码，帮助用户创建、访问及恢复账户。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/5205725253074944) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5205725253074944) | [规范](https://dickhardt.github.io/email-verification/draft-hardt-email-verification.html)

### 推测加载测量

通过新开放的 `performance.getSpeculations()` 方法暴露预加载、预取和预渲染等推测加载的测量数据，使开发者能够评估不同推测加载策略的效果，并据此调整。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/5118840377835520) | [跟踪问题 #481590676](https://issues.chromium.org/issues/481590676) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5118840377835520)

### `WebRTC` 诊断日志 API

用于记录 `WebRTC` 诊断日志的 API。

应用可以选择启用诊断日志。日志包含应用的 WebRTC 活动信息，可用于本地调试或提交问题报告。

日志还可以选择通过独立渠道上传给浏览器厂商，用于诊断问题。应用会收到可附在问题报告中的 ID，类似崩溃报告。

诊断日志由名为 `WebRtcDiagnosticLogCollectionAllowedForOrigins` 的企业政策启用。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/5091582546149376) | [跟踪问题 #481412281](https://issues.chromium.org/issues/481412281) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5091582546149376) | [规范](https://wicg.github.io/webrtc-diagnostic-logging)

## 弃用与移除

此版本没有弃用或移除项目。
