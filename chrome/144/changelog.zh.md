# Chrome 144

来源：[Chrome 144 Release Notes](https://developer.chrome.com/release-notes/144?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2026 年 1 月 13 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 144 稳定渠道版本。

只想了解重点？请参阅 [Chrome 144 新功能](https://developer.chrome.com/blog/new-in-chrome-144)。

## CSS 和界面

### CSS 页面内查找高亮伪元素

此功能将*页面内查找*结果的样式作为高亮伪元素开放给作者，类似选中文本和拼写错误。开发者可更改前景色、背景色或添加文本装饰。当浏览器默认样式与页面颜色对比度不足，或不适合页面时尤其有用。

[跟踪问题 #339298411](https://issues.chromium.org/issues/339298411) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5195073796177920) | [规范](https://drafts.csswg.org/css-pseudo-4/#selectordef-search-text)

### 不受树作用域限制的 container-name 匹配

匹配 `@container` 查询的 `container-name` 时忽略树作用域。

此前容器查询匹配 `container-name` 时使用受树作用域限制的名称或引用。因此，如果 `@container` 规则与 `container-type` 属性来自不同的树（例如 `container-type` 声明来自内部 Shadow Tree），即使名称相同也无法匹配。

现在，无论 `@container` 规则或 `container-type` 声明源自哪里，容器名称都可匹配。

[跟踪问题 #440049800](https://issues.chromium.org/issues/440049800) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5194034339512320) | [规范](https://drafts.csswg.org/css-conditional-5/#container-name)

### 结合变换的 CSS 锚点定位

当锚点定位元素关联的锚点自身具有变换（或包含于有变换的元素内）时，`anchor()` 与 `anchor-size()` 函数以变换后锚点的边界框为基准解析。

[跟踪问题 #382294252](https://issues.chromium.org/issues/382294252) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5201048700583936) | [规范](https://drafts.csswg.org/css-anchor-position-1/#anchor-position-size)

### CSS `caret-shape` 属性

原生应用中的插入符形状通常是竖线、下划线或矩形块，并且往往随插入或替换等输入模式改变。CSS `caret-shape` 属性让网站为可编辑元素中的插入符选择形状，或交由浏览器决定。支持的属性值为 `auto`、`bar`、`block` 和 `underscore`。

[跟踪问题 #353713061](https://issues.chromium.org/issues/353713061) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6106160780017664) | [规范](https://drafts.csswg.org/css-ui/#caret-shape)

### SVG2 CSS 层叠

使 Chrome 对 `<use>` 元素树中 CSS 规则匹配的实现符合 SVG2 规范。

选择器会匹配 `<use>` 实例化出的元素，而非源元素的子树。因此，选择器不再匹配克隆子树外部的祖先和兄弟元素。更重要的是，`:hover` 等状态选择器现在开始在 `<use>` 实例中匹配。

[跟踪问题 #40550039](https://issues.chromium.org/issues/40550039) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5134266027606016) | [规范](https://www.w3.org/TR/SVG2/struct.html#UseElement)

### 不可滚动的滚动容器也遵守 `overscroll-behavior`

无论滚动容器元素当前是否有溢出内容、用户能否滚动，`overscroll-behavior` 属性都适用。开发者可用它阻止 `overflow: hidden` 背景遮罩或 `overflow: auto` 元素中的滚动传播，无需考虑其当前是否溢出。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5129635997941760) | [规范](https://www.w3.org/TR/css-overscroll-1/#propdef-overscroll-behavior)

### 键盘滚动遵守 `overscroll-behavior`

将 `overscroll-behavior` 设置为 `auto` 以外的值时，浏览器不应进行滚动链传递。鼠标和触摸滚动已遵循此设置，而键盘滚动此前会忽略。此变更让键盘滚动也遵守 `overscroll-behavior`。

[跟踪问题 #41378182](https://issues.chromium.org/issues/41378182) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5099117340655616) | [规范](https://www.w3.org/TR/css-overscroll-1)

### `@scroll-state` 支持 `scrolled`

开发者可根据容器最近一次滚动方向，为其后代设置样式。

[跟踪问题 #414556050](https://issues.chromium.org/issues/414556050) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5083137520173056) | [规范](https://drafts.csswg.org/css-conditional-5/#scrolled)

### `background-position-x/y` 长属性的边缘相对语法

可相对于背景图像的一条边定义其位置。

这种语法比需要随窗口或 frame 大小调整的固定值更灵活，也更适合响应式定位背景图像。

它同样适用于 `-webkit-mask-position` 属性，以保证 Web 兼容性。

[跟踪问题 #40468636](https://issues.chromium.org/issues/40468636) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5073321259565056) | [规范](https://drafts.csswg.org/css-backgrounds-4/#background-position-longhands)

### 视图过渡的 `waitUntil()` 方法

视图过渡会自动构建伪元素树，用于显示参与过渡的元素并为其设置动画。按照规范，这棵子树在视图过渡开始动画时构建；当所有视图过渡伪元素关联的动画处于结束状态（更准确地说，不运行且未暂停）时销毁。

多数情况下，这能让开发者得到流畅体验。但在高级场景中还不够，因为开发者有时希望伪元素树在动画结束后继续存在。

例如将视图过渡与滚动驱动动画结合时，如果动画受滚动时间线控制，就不应在动画结束时销毁子树，否则向回滚动时伪元素无法再次形成动画。

因此在 `ViewTransition` 对象上增加接受 Promise 的 `waitUntil()` 函数，延迟伪元素树的销毁，直到该 Promise 完成。

[跟踪问题 #346976175](https://issues.chromium.org/issues/346976175) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4812903832223744) | [规范](https://drafts.csswg.org/css-view-transitions-2/#dom-viewtransition-waituntil)

## 设备

### `XRVisibilityMaskChange`

新增 `XRVisibilityMaskChange` 事件，提供顶点列表和索引列表，用网格表示用户视口可见部分。利用这些数据，可限制需要绘制的视口区域，提升性能。为更好支持此事件，`XRView` 对象还获得唯一标识符，便于与对应遮罩配对。这扩展了核心 WebXR 规范。

[跟踪问题 #450538226](https://issues.chromium.org/issues/450538226) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5073760055066624) | [规范](https://immersive-web.github.io/webxr/#xrvisibilitymaskchangeevent-interface)

## DOM

### `<geolocation>` 元素

引入 `<geolocation>` 元素：一种声明式、由用户激活的位置访问控件。它负责权限流程并直接向网站提供位置数据，简化用户和开发者的操作，通常不再需要单独调用 JavaScript API。

此功能解决了长期以来直接从 JavaScript 触发权限提示、却缺少明确用户意图信号的问题。页面嵌入由浏览器控制的元素后，用户点击会提供清晰、主动的信号。这改善了权限提示体验，更重要的是为此前拒绝权限的用户提供恢复路径。

**注意：**此功能此前以更通用的 `<permission>` 元素为名，在来源试用中开发和测试。根据开发者及其他浏览器厂商反馈，它演变为专用于地理位置的 `<geolocation>` 元素，提供更贴合场景的开发体验。

[跟踪问题 #435351699](https://issues.chromium.org/issues/435351699) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5125006551416832) | [规范](https://wicg.github.io/PEPC/permission-elements.html)

## 图形

### WebGPU：Uniform Buffer 标准布局

在 WGSL 着色器中声明的 Uniform Buffer，不再要求数组元素按 16 字节对齐，也不再要求嵌套结构偏移填充为 16 字节的倍数。

[跟踪问题 #452662924](https://issues.chromium.org/issues/452662924) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6680245553987584) | [规范](https://www.w3.org/TR/WGSL/#language_extension-uniform_buffer_standard_layout)

### WebGPU：`subgroup_id` 功能

启用 subgroups 扩展后，可以使用 `subgroup_id` 和 `num_subgroups` 内建值。

[跟踪问题 #454654255](https://issues.chromium.org/issues/454654255) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5072447137251328) | [规范](https://www.w3.org/TR/WGSL/#language_extension-subgroup_id)

## JavaScript

### ECMA262 中的 Temporal

ECMA262 中的 Temporal API 提供处理日期和时间的标准对象与函数。`Date` 长期以来是 ECMAScript 的痛点。该提案引入全局 `Object` `Temporal`，作为类似 `Math` 的顶层命名空间，为 ECMAScript 带来现代日期时间 API。

[跟踪问题 #detail?id=11544](https://issues.chromium.org/issues/detail?id=11544) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5668291307634688) | [规范](https://tc39.es/proposal-temporal/)

### `SVGAElement` 支持 `ping`、`hreflang`、`type` 和 `referrerPolicy`

在 `SVGAElement` 上支持 `ping`、`hreflang`、`type` 和 `referrerPolicy` 属性，使其行为与 `HTMLAnchorElement` 一致，让 HTML 和 SVG 的链接处理保持一致。

[跟踪问题 #40589293](https://issues.chromium.org/issues/40589293) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5140707648077824) | [规范](https://svgwg.org/svg2-draft/linking.html#InterfaceSVGAElement)

### 从右到左 MathML 运算符镜像

以从右到左模式渲染 MathML 运算符时，支持字符级与字形级镜像。

在 RTL 模式下，部分运算符可通过换成另一个码点镜像，例如右括号变为左括号。这是字符级镜像，对应关系由 Unicode 的 `Bidi_Mirrored` 属性定义。

有些运算符没有合适的镜像字符，此时可使用字体的 `rtlm` 特性进行字形级镜像，由另一个字形在镜像上下文中替代。有些现有实现直接镜像原字形，但对不对称字符（例如顺时针围道积分符号），这可能改变含义。

[跟踪问题 #40120782](https://issues.chromium.org/issues/40120782) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6317308531965952) | [规范](https://w3c.github.io/mathml-core/#layout-of-operators)

### `clipboardchange` 事件

Web 应用或其他系统应用修改系统剪贴板内容时，`clipboardchange` 事件就会触发。这让远程桌面客户端等 Web 应用可以保持自身剪贴板与系统剪贴板同步，相比使用 JavaScript 轮询剪贴板变化更加高效。

[跟踪问题 #41442253](https://issues.chromium.org/issues/41442253) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5085102657503232) | [规范](https://github.com/w3c/clipboard-apis/pull/239)

## 权限

### User-Agent Client Hints 的 `ch-ua-high-entropy-values` 权限政策

支持 `ch-ua-high-entropy-values` 权限政策，让顶层网站限制哪些文档可通过 JavaScript API `navigator.userAgentData.getHighEntropyValues()` 收集高熵客户端提示。

现有按客户端提示划分的权限政策已能限制通过 HTTP 收集高熵提示。

[跟踪问题 #385161047](https://issues.chromium.org/issues/385161047) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6176703867781120) | [规范](https://wicg.github.io/ua-client-hints/#ch-ua-high-entropy-values)

## 性能

### Performance 与 Event Timing：`interactionCount`

Event Timing API 属于 Performance Timeline，用来衡量用户交互的性能。某些事件被分配 `interactionId`，可根据共同的物理用户输入或手势，对相关交互分组。

此功能添加 `performance.interactionCount` 属性，表示页面发生的交互总数。

它对于计算 Interaction to Next Paint（INP）指标尤其有用。计算高百分位数得分（交互总数超过 50 次的页面使用 p98）需要知道总交互数。

此功能很早就已写入规范，也曾在 Chromium 中实现原型但从未正式发布；它是 Interop 2025 的一部分，其他浏览器已提供。

**注意：**已有更强大的针对特定事件的 `performance.eventCounts` 映射，但无法准确将事件计数映射为交互计数。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5153386492198912) | [规范](https://www.w3.org/TR/event-timing/#dom-performance-interactioncount)

## 用户输入

### DOM 更改后可互通的指针和鼠标边界事件

事件目标从 DOM 中移除后，根据指针和鼠标边界事件（即 `over`、`out`、`enter` 和 `leave`）推断的指针逻辑目标，应是仍附着在 DOM 中的最近祖先。

指针事件工作组（PEWG）近期就此行为达成共识。

此前 Chrome 在节点从 DOM 移除后仍继续跟踪它。因此，如果命中测试节点 A 从 DOM 中移除后，指针移向新节点 B，边界事件序列（`pointerover`、`pointerout`、`pointerenter`、`pointerleave` 和对应鼠标事件）会表现为指针从 A 移到 B。按照新共识，事件序列应表现为从“A 的父级”移到 B。

[跟踪问题 #1147998](https://issues.chromium.org/issues/1147998) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6266812908175360) | [规范](https://www.w3.org/TR/uievents/#events-mouseevent-event-order)

### Android 上的指针锁定

将鼠标事件目标锁定到单个元素并隐藏鼠标指针，以提供原始鼠标移动数据。

[跟踪问题 #40290045](https://issues.chromium.org/issues/40290045) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6739764319485952) | [规范](https://www.w3.org/TR/pointerlock-2)

## WebRTC

### `RTCDegradationPreference` 枚举值 `maintain-framerate-and-resolution`

`maintain-framerate-and-resolution` 停用 WebRTC 内部的视频自适应，让应用实现自己的自适应逻辑，避免与内部机制相互干扰。

WebRTC MediaStreamTrack Content Hints 规范要求：无论视频质量如何，都维持帧率和分辨率。用户代理不应为质量或性能原因优先降低帧率、分辨率；但为了避免过度占用网络和编码器资源，必要时可以在编码前丢帧。

[跟踪问题 #450044904](https://issues.chromium.org/issues/450044904) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5156290162720768) | [规范](https://www.w3.org/TR/mst-content-hint/#dom-rtcdegradationpreference-maintain-framerate-and-resolution)

## 隔离 Web 应用（IWA）

### Direct Sockets API 的组播支持

此功能允许隔离 Web 应用（IWA）订阅组播组、接收组播组发送的用户数据报协议（UDP）包，并在向组播地址发送 UDP 包时指定额外参数。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5073740211814400) | [规范](https://github.com/WICG/direct-sockets/pull/79)

## 来源试用

### 增强 Canvas API 的 `TextMetrics`

扩展 Canvas API 的 `TextMetrics`，支持选区矩形、边界框查询和基于字形簇的操作。

新功能使复杂文本编辑应用能够精确选择文本、定位插入符和进行命中测试。基于字形簇的渲染也支持精细文本效果，例如独立字符动画和样式。

[来源试用](https://developer.chrome.com/origintrials/#/view_trial/1646628613757337601) | [跟踪问题 #341213359](https://issues.chromium.org/issues/341213359) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5075532483657728) | [规范](https://github.com/whatwg/html/pull/11000)

### 感知上下文的媒体元素

这类媒体元素是声明式、由用户激活的控件，用于开始和操作媒体流。

它解决了长期以来直接从 JavaScript 触发权限提示、却缺少明确用户意图信号的问题。页面嵌入由浏览器控制的元素后，用户点击会提供清晰、主动的信号，改善提示体验；更重要的是为此前拒绝权限的用户提供恢复路径。

**注意：**此功能此前以更通用的 `<permission>` 元素为名，在来源试用中开发和测试。根据开发者及其他浏览器厂商反馈，它演变为专用于各项能力的元素，以提供更贴合场景的开发体验。

[来源试用](https://developer.chrome.com/origintrials/#/view_trial/3736298840857247745) | [跟踪问题 #443013457](https://issues.chromium.org/issues/443013457) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4926233538330624) | [规范](https://wicg.github.io/PEPC/permission-elements.html)

## 弃用与移除

### 弃用并移除：Private Aggregation API

Private Aggregation API 是以保护隐私的方式测量跨站汇总数据的通用机制，最初为没有第三方 Cookie 的未来而设计。

Chrome 宣布维持目前的第三方 Cookie 做法后，计划弃用并移除 Private Aggregation API（及 Privacy Sandbox 功能状态页列出的部分其他 API）。该 API 只通过同样计划弃用并移除的 Shared Storage 与 Protected Audience API 暴露，因此 Private Aggregation 不需要额外处理。

[ChromeStatus.com 条目](https://chromestatus.com/feature/4683382919397376) | [规范](https://patcg-individual-drafts.github.io/private-aggregation-api)

### 弃用并移除：Shared Storage API

Shared Storage API 是一种保护隐私、允许存储不按第一方网站分区的 Web API。

在 Chrome 宣布维持目前的第三方 Cookie 做法之后，Chrome 计划弃用并移除 Shared Storage API（及 Privacy Sandbox 功能状态页列出的部分其他 API）。

[跟踪问题 #462465887](https://issues.chromium.org/issues/462465887) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5076349064708096) | [规范](https://wicg.github.io/shared-storage)

### 弃用并移除 Protected Audience

Protected Audience API 提供无需第三方 Cookie 或跨站用户追踪的兴趣群组广告方法。

在 Chrome 宣布维持目前的第三方 Cookie 做法之后，Chrome 计划弃用并移除 Protected Audience API（及 Privacy Sandbox 功能状态页列出的部分其他 API）。

[ChromeStatus.com 条目](https://chromestatus.com/feature/6552486106234880) | [规范](https://wicg.github.io/turtledove)

### XML 解析中从外部加载的实体

Chrome 在特定条件下同步获取外部 XML 实体或 DTD，并将其纳入解析。本文提出移除此功能。

例如，`http/tests/security/contentTypeOptions/xml-external-entity.xml` 展示了如何在 `DOCTYPE` 语句末尾定义外部实体。这些实体随后指向同步加载的资源，并在解析 XML 时作为上下文纳入。

另一种语法示例是使用 `SYSTEM` 关键字后接 URL 的 `DOCTYPE`，指向包含更多实体定义的 DTD。

解析器会向上层传递这类外部加载请求。

根据 XML 规范，非验证处理器无须读取外部实体。

Chrome 计划弃用在不使用 XSLT 的 XML 文档中加载外部实体定义的行为。

[跟踪问题 #455813733](https://issues.chromium.org/issues/455813733) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6734457763659776) | [规范](https://www.w3.org/TR/xml/#proc-types)
