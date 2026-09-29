# Chrome 148

来源：[Chrome 148 Release Notes](https://developer.chrome.com/release-notes/148?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2026 年 5 月 5 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 148 稳定渠道版本。

只想了解重点？请参阅 [Chrome 148 新功能](https://developer.chrome.com/blog/new-in-chrome-148)。

## CSS 和界面

### 仅按名称进行 CSS 容器查询

可仅根据 `container-name` 查询 CSS 查询容器，不再要求容器设置 `container-type`：

```text
#container {
  container-name: --foo;
}
@container --foo {
  input { background-color: green; }
}
```

```text
<div id="container">
  <div><input></div>
</div>
```

此前，`@container` 除名称外还要求设置容器类型。

[跟踪问题 #40287550](https://issues.chromium.org/issues/40287550) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5184267522015232) | [规范](https://drafts.csswg.org/css-conditional-5/#container-rule)

### At-rule：CSS 特性检测

在 CSS `@supports` 中增加 `at-rule()` 函数，使作者能够检测对 CSS at-rule 的支持情况。

[跟踪问题 #40211832](https://issues.chromium.org/issues/40211832) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5110744177836032) | [规范](https://drafts.csswg.org/css-conditional-5/#support-definition-at-rules)

### Open Font Format avar2 文本塑形与字形渲染

avar（轴变体）表的第 2 版让字体设计者能更精细地控制可变字体的插值。原始可变字体规范独立处理每个轴，而 avar2 允许各轴相互影响，使内容作者更容易使用字体，并支持紧凑存储。

Avar2 使用熟悉的字体变体概念，但将可变增量值应用于设计轴规格本身，并允许跨多个轴这样处理。

例如，字体设计者可以创建同时控制多个变体轴的“元滑块”，减轻用户微调参数并寻找字体设计空间中可用组合的负担。

Avar2 让字体设计者更好地控制字体可用的变体空间，并协调多个设计轴之间的调整。

通过在 avar 第 2 版表中以数学方式定义各轴的关系，字体可以用更少的主设计样本实现复杂设计；由于插值存储更高效，文件也更小。

[跟踪问题 #40246300](https://issues.chromium.org/issues/40246300) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5169590743203840) | [规范](https://www.iso.org/standard/87621.html)

### `revert-rule` 关键字

`revert-rule` 关键字将层叠回退到前一条规则，类似 `revert-layer` 回退到前一个层。例如：

```text
div { color: green; }
div { color: revert-rule; /* Effectively green */ }
```

与条件表达式结合时尤其有用：条件不满足时，可以取消当前规则：

```text
div {
  display: if(style(--layout: fancy): grid; else: revert-rule);
}
```

[跟踪问题 #393582263](https://issues.chromium.org/issues/393582263) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5146458504429568) | [规范](https://drafts.csswg.org/css-cascade-5/#revert-rule-keyword)

### 视频和音频元素的延迟加载

为 `<video>` 和 `<audio>` 元素添加 `loading` 属性，开发者可使用 `loading="lazy"` 将媒体资源加载推迟到元素接近视口时。这与 `<img>`、`<iframe>` 已有的延迟加载行为一致，改善页面加载性能并减少数据使用。

[跟踪问题 #469111735](https://issues.chromium.org/issues/469111735) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5200068565139456) | [规范](https://github.com/whatwg/html/pull/11980)

### `text-decoration-skip-ink: all`

CSS `text-decoration-skip-ink` 属性增加对 `all` 值的支持。

该属性此前支持 `auto` 和 `none`。`all` 无条件对所有字形应用避让笔画，包括中日韩字符；`auto` 则不避让中日韩字符，因为在常见的下划线位置，这样处理表意文字通常会产生不理想的视觉效果。

如果开发者已调整 `text-underline-position` 或 `text-underline-offset` 以避免与中日韩字形冲突，现在也可以明确选择为这些字符启用笔画避让。

[跟踪问题 #40675832](https://issues.chromium.org/issues/40675832) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5077600085082112) | [规范](https://drafts.csswg.org/css-text-decor-4/#text-decoration-skip-ink-property)

### 为 `dragEnter`、`dragLeave` 和 `dragOver` 事件正确设置 `dropEffect`

拖放规范要求 `dataTransfer` 对象的 `dropEffect` 属性在 `dragEnter`、`dragOver`、`dragLeave` 事件中具有预定值。拖入和拖过事件的 `dropEffect` 应基于当前 `effectAllowed`；拖离事件的 `dropEffect` 应始终为 `none`。此前 Chromium 未遵守这些规则；现在会按照规范设置正确值，开发者可以依赖该属性。

[跟踪问题 #434151262](https://issues.chromium.org/issues/434151262) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6325617459068928) | [规范](https://html.spec.whatwg.org/multipage/dnd.html#dndevents)

### 拖动开始时抑制指针事件

按照 HTML 规范，拖动开始时，用户代理应向拖动源发送适当事件，表明指针事件流已经结束，不应再期待来自该指针的事件。此前鼠标事件只部分实现了这一行为，而 Android 触摸拖动已完整实现。此更新使其他平台也满足规范。实际效果是，拖动开始后，拖动源会收到 `pointercancel`、`pointerout` 和 `pointerleave`，表示当前事件流已结束。

[跟踪问题 #452372355](https://issues.chromium.org/issues/452372355) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6732314958757888) | [规范](https://html.spec.whatwg.org/multipage/dnd.html#drag-and-drop-processing-model:~:text=Fire%20a%20pointer%20event%20at%20the%20source%20node%20named%20pointercancel%2C%20and%20fire%20any%20other%20follow%2Dup%20events%20as%20required%20by%20Pointer%20Events.%20%5BPOINTEREVENTS%5D)

## 能力

### 清单本地化

支持对 Web App Manifest 成员进行本地化，使应用名称、说明、图标和快捷方式适应用户语言与地区。开发者在清单中提供本地化值，浏览器根据用户的语言设置自动选择相应资源，从而在不同市场提供语言支持。

详情参阅 [Web App Manifest 本地化支持](https://developer.chrome.com/blog/manifest-localization)。

[跟踪问题 #380491647](https://issues.chromium.org/issues/380491647) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5090807862394880) | [规范](https://www.w3.org/TR/appmanifest/#x_localized-members)

## Android 上的 Web

### Android 上的 Web Serial API

Web Serial API 提供连接串行设备的接口，可通过用户系统上的串口，或模拟串口的可移除 USB、蓝牙设备连接。现在 Android 也支持它。

教育、业余爱好与工业领域的用户经常将需要专用控制软件的外围设备连接到计算机。例如，学校常用机器人教授编程和电子知识，需要软件上传代码或远程控制机器人。工业或爱好者场景中的铣床、激光切割机、3D 打印机等设备，也由连接计算机上的程序控制。这些设备通常通过串行连接接入小型微控制器。

详情参阅 [web.dev 的 Web Serial API 指南](https://web.dev/serial/)和 [Web Serial 规范](https://wicg.github.io/serial/)。

[跟踪问题 #365514951](https://issues.chromium.org/issues/365514951) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6043992171085824)

### Android 上的 SharedWorker

此前由于进程生命周期不可预测，SharedWorker 长期在 Android 上被停用：实例可能在未通知用户或 Web 开发者的情况下意外终止。

不过，最近的 GitHub 讨论（见 [GitHub 讨论](https://github.com/whatwg/html/issues/11205)）认为，SharedWorker 进程生命周期不可预测的问题或许没有先前认为的那么严重。因此 Android 正重新启用 SharedWorker，同时继续调查其行为，以确保体验稳定可靠。

[跟踪问题 #40290702](https://issues.chromium.org/issues/40290702) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6265472244514816) | [规范](https://html.spec.whatwg.org/multipage/workers.html#shared-workers-and-the-sharedworker-interface)

## Web API

### WebGPU：`linear_indexing` 功能

此功能在 WebGPU 首次由浏览器推出后，进一步扩展其规范。

为计算着色器新增两个内建值，提高开发者使用便利性。所有后端均实现了这些值（通过对现有内建值进行 Polyfill）。

[跟踪问题 #482840564](https://issues.chromium.org/issues/482840564) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5071243424432128) | [规范](https://github.com/gpuweb/gpuweb/pull/5554)

### Web Authentication Immediate UI 模式

`navigator.credentials.get()` 的新模式：如果浏览器立即知道网站有可用的 Passkey 或密码，就向用户显示浏览器登录界面；否则，如果没有此类凭据，则以 `NotAllowedError` 拒绝 Promise。网站因此可在浏览器能提供很可能成功的登录凭据选择时跳过登录页；没有凭据时仍可使用传统登录页流程。

[跟踪问题 #408002783](https://issues.chromium.org/issues/408002783) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5164322780872704) | [规范](https://github.com/w3c/webauthn/pull/2291)

### 获取安全支付确认能力

为 Payment Request 新增静态方法，使 Web 开发者可查询浏览器的安全支付确认实现具备哪些能力。

这有助于开发者判断可用功能，进而决定是否采用安全支付确认。

[跟踪问题 #484043990](https://issues.chromium.org/issues/484043990) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4727235745546240) | [规范](https://w3c.github.io/secure-payment-confirmation/#sctn-secure-payment-confirmation-capabilities)

### 延长共享 Worker 的生命周期

向 `SharedWorker` 构造函数添加 `extendedLifetime: true` 选项。即使所有当前客户端都已卸载，也可请求让共享 Worker 保持运行。页面卸载后仍需 JavaScript 完成的异步工作，因此无需依赖 Service Worker 即可继续进行。

[跟踪问题 #400473072](https://issues.chromium.org/issues/400473072) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5138641357373440) | [规范](https://github.com/whatwg/html/commit/9c009049e4fa9dba638ef68ca502b781082bbb68)

### Prompt API

Prompt API 让 Web 开发者直接使用浏览器提供的设备端 AI 语言模型。API 设计提供与云端 API 形式相近的细粒度控制，使网站可逐步增加针对特定场景的模型交互能力。它补充了 Summarizer API 等任务型语言模型 API，以及使用开发者自备机器学习模型进行通用设备端推理的 API 和框架。

初始实现支持文本、图像和音频输入。此外，响应约束可确保生成文本符合预定义的正则表达式和 JSON Schema 格式。

它支持图像描述、视觉搜索、音频转录、声音事件分类、按特定指令生成文本，以及从多模态材料中提取信息或洞见等用例。

[跟踪问题 #417526788](https://issues.chromium.org/issues/417526788) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5134603979063296) | [规范](https://webmachinelearning.github.io/prompt-api)

## 网络与连接

### IDNA ContextJ 规则

IDNA 是在域名中处理非 ASCII 字符的机制。例如，它将 `http://네이버.한국/` 编码为 `http://xn--950bt9s8xi.xn--3e0b707e/`（重定向到 naver.com）。

URL 规范设置 `CheckJoiners` 标志，启用 `IDNA2008` 中的 `ContextJ` 规则。这样，URL 中多数位置都不允许 `ZWNJ`（U+200C 零宽非连接符）和 `ZWJ`（U+200D 零宽连接符）。实现将 `UIDNA_CHECK_CONTEXTJ` 选项传给执行此规则的 ICU。

[跟踪问题 #40765949](https://issues.chromium.org/issues/40765949) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6295810820145152) | [规范](https://url.spec.whatwg.org/#idna)

### 同一 src 重新赋值时复用 no-store 图像

当同一 `<img>` 元素被重新赋予相同的 src 值时，允许在同一文档内复用可用图像，从而避免因 Cache-Control: no-store 而重新加载。此前即使图像已经解码并在文档中可用，Blink 仍会重新获取。这与 Gecko、WebKit 已有的行为一致。

[跟踪问题 #486562295](https://issues.chromium.org/issues/486562295) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5206171399094272) | [规范](https://html.spec.whatwg.org/multipage/images.html#available-images)

## 性能

### Resource Timing 中的 ContentType

向 `PerformanceResourceTiming` 添加 `contentType` 字段，保存与服务器返回的所获取资源的 Content-Type HTTP 头对应的字符串。

[跟踪问题 #1366706](https://issues.chromium.org/issues/1366706) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5156068351541248) | [规范](https://github.com/w3c/resource-timing/pull/341)

### WebRTC 数据通道：始终协商数据通道

实现 WebRTC 扩展 `alwaysNegotiateDataChannels`，允许应用在创建数据通道之前，就在 SDP Offer 中协商数据通道。它还会在所有音频或视频 m section 之前协商数据 m section，并将其用作 `BUNDLE` 的“由 Offer 方标记的 `m=` section”。

这意味着：

```text
const pc = new RTCPeerConnection({ alwaysNegotiateDataChannels: true });
const offer = await pc.createOffer();
```

会创建在 SDP 中包含 application m-line 的 Offer；而：

```text
const pc = new RTCPeerConnection({ alwaysNegotiateDataChannels: true });
pc.addTransceiver('audio');
pc.createDataChannel('somechannel');
const offer = await pc.createOffer();
```

会创建依次协商 application m-line 与 audio m-line 的 SDP Offer。

[跟踪问题 #433898678](https://issues.chromium.org/issues/433898678) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5113419982307328) | [规范](https://w3c.github.io/webrtc-extensions/#always-negotiating-datachannels)

## 新来源试用

### 声明式 CSS 模块脚本

声明式 CSS 模块脚本是现有基于脚本的 CSS 模块脚本的扩展。开发者可将声明式样式表共享给 Shadow Root，包括声明式 Shadow Root。可使用 `<style type="module" specifier="foo">` 定义行内样式模块，再通过标识符或 URL 引用，在声明式 Shadow DOM 中应用模块，例如 `<template shadowrootmode="open" shadowrootadoptedstylesheets="foo">`。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/1550927121675714561) | [跟踪问题 #448174611](https://issues.chromium.org/issues/448174611) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4790543041298432) | [规范](https://github.com/whatwg/html/pull/11687)

### Container Timing API

[Container Timing API](https://developer.chrome.com/blog/container-timing-origin-trial) 可监测 DOM 中标注区域何时显示在屏幕上，并完成首次绘制。开发者可使用 `containertiming` 属性标记 DOM 子区域（类似 Element Timing API 的 `elementtiming`），在该区域首次绘制后收到性能条目。此 API 有助于测量页面中不同组件的计时。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/3312960475884421121) | [跟踪问题 #382422286](https://issues.chromium.org/issues/382422286) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5110962817073152) | [规范](https://WICG.github.io/container-timing)

### Web 应用 HTML 安装元素

允许网站以声明式方式提示用户安装 Web 应用。该元素可选地接受两个属性，允许安装来自其他来源的内容。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/506092008125759489) | [跟踪问题 #454827186](https://issues.chromium.org/issues/454827186) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5152834368700416) | 规范（官方页面链接无效）

### Long Animation Frames 样式时长

向 Long Animation Frame API 添加 `styleDuration` 和 `forcedStyleDuration` 信息，帮助开发者区分样式与布局耗时。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/3997507619244736513) | [跟踪问题 #476826067](https://issues.chromium.org/issues/476826067) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5171478175809536) | [规范](https://github.com/w3c/long-animation-frames/pull/30)

### HTML-in-canvas

HTML-in-canvas 通过三个新基础能力，让开发者用 Canvas 自定义 HTML 的渲染：用于让 Canvas 元素主动启用的属性（`layoutsubtree`）；绘制子元素的方法（2D：`drawElementImage`，WebGL：`texElementImage2D`，WebGPU：`copyElementImageToTexture`）；以及用于处理更新的 Paint 事件。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/3478467762190286849) | [跟踪问题 #500967896](https://issues.chromium.org/issues/500967896) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5172548013916160) | [规范](https://github.com/whatwg/html/pull/11588)

### 连接允许名单

连接允许名单通过限制文档或 Worker 使用 Fetch API 等 Web 平台 API 发起的连接，提供对外部端点的明确控制。

提议的实现是让服务器通过 HTTP 响应头下发获准端点列表。在用户代理代表页面建立连接前，会将目标与允许名单核对：匹配列表条目的连接获准，未匹配的连接则被阻止。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/2487675844168777729) | [跟踪问题 #447954811](https://issues.chromium.org/issues/447954811) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5175745573945344) | [规范](https://wicg.github.io/connection-allowlists)

### Prompt API 采样参数

为 Prompt API 添加采样参数，用于控制模型如何采样 Token，让开发者控制输出的“创造性”或“随机性”。此外，还向 `LanguageModel` 实例添加读取已设置值的属性，并提供静态 `LanguageModel` 函数以获取参数默认值和最大值。

初始实现添加 `temperature` 与 `topK` 参数。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/4469259680211795969) | [跟踪问题 #496663356](https://issues.chromium.org/issues/496663356) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6325545693478912) | [规范](https://webmachinelearning.github.io/prompt-api)

### 在 HTML 中解析处理指令

处理指令（语法：`<?target data>`）是 XML 中已有的 DOM 构造，允许以非元素节点表达文档处理所需的语义。

例如，它们可在不添加新 DOM 元素、不改变 CSS 所见 DOM 结构的情况下，为流式更新或高亮标记范围，也可作为指令告诉 HTML 解析器如何缓冲及流式处理。

[跟踪问题 #481087638](https://issues.chromium.org/issues/481087638) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6534495085920256)

### OpaqueRange

`OpaqueRange` 表示表单控件值中的一段实时文本，例如 `<textarea>` 或文本型 `<input>` 的内容，让开发者能通过类似 Range 的 API 操作值文本。

它支持 `getBoundingClientRect()`、`getClientRects()` 等操作，也可与 CSS Custom Highlight API 集成，实现行内建议、高亮和锚定弹出框等界面。它只暴露值中的偏移量，并让 `startContainer`、`endContainer` 返回 `null`，保持封装性，不暴露 DOM 端点及内部结构。

[来源试用](https://developer.chrome.com/origintrials/#/register_trial/1731071106770534401) | [跟踪问题 #421421332](https://issues.chromium.org/issues/421421332) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6297362687066112)
