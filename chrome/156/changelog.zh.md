# Chrome 156 版本说明

预览

计划稳定版发布日期：2026 年 10 月 20 日

## 网络 / 连接

### [不再缓存模块加载失败](https://chromestatus.com/feature/5214647044145152)

目前，Web 开发者无法重试失败的模块加载，因为这些失败会被缓存（重试也只会立即失败）。这一模块加载行为变更允许手动重试失败的模块加载（例如再次调用 `import()`），解决开发者和用户在不稳定网络上使用模块时遇到的实际问题。

[跟踪问题 #534781954](https://issues.chromium.org/issues/534781954) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5214647044145152) | [规范](https://github.com/whatwg/html/pull/10327) | [说明文档](https://gist.github.com/yoavweiss/a54501545ab2ad22bfde0ebed02a115c)

### [压缩字典传输更新](https://chromestatus.com/feature/4895435813683200)

获取 rel=compression-dictionary 链接时：

- 使用“compression-dictionary”作为请求目标类型。
- 正确设置请求的 mode、credentials、referrer 和 referrerpolicy。
- 考虑 &lt;link rel="compression-dictionary"&gt; 中的 crossorigin 和 referrer 属性。

[跟踪问题 #40255884](https://issues.chromium.org/issues/40255884) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4895435813683200) | [规范](https://github.com/whatwg/html/pull/11620)

### [WebTransport headers 和 responseHeaders](https://chromestatus.com/feature/5194104408506368)

新增通过 WebTransportOptions 传递自定义 HTTP 请求头，以及通过 WebTransport 实例检查服务端响应头的能力。这使 Web 应用可以在初始 CONNECT 握手期间提供元数据、身份验证令牌和自定义参数，并在连接建立后访问服务端提供的响应头。

[跟踪问题 #551850821](https://issues.chromium.org/issues/551850821) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5194104408506368) | [规范](https://www.w3.org/TR/webtransport/#dom-webtransportoptions-headers)

## CSS

### [用于导航发起元素的 CSS 伪类](https://chromestatus.com/feature/6327898878377984)

选择发起导航的元素，无论它是链接、按钮还是表单。该元素在整个导航过程中都会保持被选中。

[跟踪问题 #530210946](https://issues.chromium.org/issues/530210946) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6327898878377984) | [规范](https://drafts.csswg.org/css-navigation-1/#navigation-source-pseudo-class) | [说明文档](https://github.com/WICG/declarative-partial-updates/blob/main/route-matching-explainer.md#link-matching)

### [CSS random() 函数](https://chromestatus.com/feature/5324559251275776)

random() 函数为 CSS 引入生成随机值的能力，使 Web 开发者可以生成指定范围内的随机数值。

例如，Web 开发者可以使用 random()，将元素随机分布在其容器内：

```css
.dot {
/* Position each dot randomly */
position: absolute;
top: random(0%, 100%);
left: random(0%, 100%);
}
```

此功能还包含缓存控制。默认情况下，每个 random() 函数都会解析为一个新的、独立的值。Web 开发者可以通过将 &lt;random-key&gt; 值作为函数的第一个参数传入来覆盖此默认行为，控制随机值如何在属性和元素之间共享。

[跟踪问题 #413385732](https://issues.chromium.org/issues/413385732) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5324559251275776) | [规范](https://www.w3.org/TR/css-values-5/#random) | [说明文档](https://webkit.org/blog/17285/rolling-the-dice-with-css-random) | [说明文档](https://css-tricks.com/almanac/functions/r/random)

### [单轴滚动容器](https://chromestatus.com/feature/5067363861004288)

扩展 `overflow` 属性，使其支持将可滚动值与 `clip` 一起使用（例如 `overflow: scroll clip`）。这使 `position: sticky` 可以在每个轴上受到不同祖先滚动容器的约束，并让开发者能够确保使用 `overflow: clip` 的轴保持原位。

[跟踪问题 #440038212](https://issues.chromium.org/440038212) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5067363861004288) | [规范](https://github.com/w3c/csswg-drafts/pull/13903) | [说明文档](https://github.com/explainers-by-googlers/single-axis-scroll-containers)

### [使用 scroll-snap-type: pair 对齐到同一个元素](https://chromestatus.com/feature/5124378896498688)

[https://github.com/w3c/csswg-drafts/issues/9519](https://github.com/w3c/csswg-drafts/issues/9519)

为 scroll-snap-type 添加“pair”关键字。使用该关键字时，当容器在一个轴上滚动吸附到某个元素时，也应在另一个轴上吸附到同一个元素。现有规范中的“both”关键字允许滚动容器分别选择 X 轴和 Y 轴的吸附目标，因此可以吸附到不同目标。

[跟踪问题 #542706103](https://crbug.com/542706103) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5124378896498688) | [规范](https://drafts.csswg.org/css-scroll-snap-1) | [说明文档](https://github.com/explainers-by-googlers/scroll-snap-type-pair)

## 离线 / 存储

### [IndexedDB：SQLite 后端](https://chromestatus.com/feature/5161589557821440)

Chromium 的 IndexedDB 实现已基于 SQLite 重写，替代此前结合 LevelDB 和普通文件的实现。Web API 没有变化。

预计这会提高可靠性，并在较小程度上改善性能。

目前，这一变更适用于*新建数据存储*。这是分阶段推出过程中的第 2 步。参见 [https://chromestatus.com/feature/5126896685809664](https://chromestatus.com/feature/5126896685809664)，该条目跟踪第 1 步，即针对内存上下文（也就是无痕模式上下文）的推出。第 3 步将把 LevelDB 存储中的现有数据迁移到 SQLite 存储。

在这一步中，用户首次访问某个网站时，或清除网站数据后，新的 IDB 数据会存储在使用 SQLite 的后端中；但已存储在 LevelDB 中的现有数据不受影响。

需要注意的差异列表见下方文档链接。

[跟踪问题 #498644996](https://issues.chromium.org/issues/498644996) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5161589557821440) | [规范](https://www.w3.org/TR/IndexedDB) | [文档](https://docs.google.com/document/d/1S9Rx67BmCZIP7tpasKaQ2FlV4TL1Z15DitR2kRZs9nw/edit?usp=sharing) | [文档](https://docs.google.com/document/d/1-N4NqdYjqaWEbfVPYnCg2Ho1u4YK48pUoQ_tSy9SUg8/edit?usp=sharing) | [演示](https://evanstade.github.io/web-storage-demos/idb-txn-scopes)

## 图形

### [WebGPU：WGSL 片元深度](https://chromestatus.com/feature/5663304168112128)

新增为 WGSL 中的 `@builtin(frag_depth)` 提供 `less` 或 `greater` 修饰符的能力。

当前的 `@builtin(frag_depth)` 可能会禁用绘制调用的 early-Z 优化，从而带来性能损失。新增的修饰符允许显式设置缓冲区模式，并允许应用 early-Z 优化。

[跟踪问题 #457993779](https://crbug.com/457993779) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5663304168112128) | [规范](https://github.com/gpuweb/gpuweb/pull/6299) | [说明文档](https://github.com/gpuweb/gpuweb/blob/main/proposals/fragment-depth.md)

## 实时 / 通信

### [WebRTC 诊断日志 API](https://chromestatus.com/feature/5091582546149376)

Web 实时通信（[WebRTC](https://webrtc.org/)）诊断日志 API 允许经授权的 Web 应用触发 WebRTC 诊断数据收集，以用于本地调试。经用户授权，应用还可以将 WebRTC 诊断数据分享给用户代理厂商，提供有助于修复用户代理错误或改进用户代理的信息。

管理员可以通过企业策略 [WebRtcDiagnosticLogCollectionAllowedForOrigins](https://chromeenterprise.google/policies/#WebRtcDiagnosticLogCollectionAllowedForOrigins) 启用诊断日志。

[跟踪问题 #481412281](https://crbug.com/481412281) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5091582546149376) | [规范](https://w3c.github.io/webrtc-extensions/#diagnostic-logging) | [说明文档](https://github.com/WICG/webrtc-diagnostic-logging/blob/main/explainer.md)

## 弃用与移除

### [移除 FencedFrame 元素和 window.fence API](https://chromestatus.com/feature/6366274495053824)

Fenced Frame 是将内容嵌入页面的嵌套框架，框架与嵌入它的页面之间无法共享数据。

window.fence API 包括 Fenced Frame 广告报告（FFAR）JS API，用于对通过 Protected Audience 和 SelectURL 创建的 FF 生成保护隐私的广告报告；还包括支持 PA 组件广告的 getNestedConfigs()。

本次意向旨在移除这两部分。Fenced Frame 元素将分两步移除，详情如下。

随着 PA 和 selectURL 被移除（或被空实现 API 替代），FF 已无法再进行导航，因此可以安全地将其移除。Fenced Frame 只能使用 FencedFrameConfig[1] 中的 urn:uuid 进行导航，而该配置只能通过 runAdAuction 和 selectURL 的返回值创建。按照以下意向讨论，这些 API 正在 M152 中弃用和移除：Protected Audience[2]、Shared Storage[3]。

计划：
鉴于 Fenced Frame 元素已无法导航，我们提议按以下阶段从代码中移除该元素：

1. M156：将 Fenced Frame 元素及其关联 IDL 依赖保留为空实现，以确保任何 JS 调用都不会抛出异常，例如调用 fenced-frame-element.config.setSharedStorageContext()。
2. M156：在同一里程碑中，也会将 window.fence API 全部替换为空实现。由于 FF 文档已无法导航，这些 API 无法再被调用，因此不会执行任何操作。
3. M157 Canary/Beta：通过现场试验，开始以受控方式逐步移除作为空实现保留的 FF HTML 元素。请注意，移除该元素后，它会被解析为 HTMLUnknownElement。

目前，我们正在为以上所有步骤申请批准。

4. M157 Stable：在达到 1% 稳定版覆盖率后，假设没有出现回归或功能损坏，我们会再申请批准，以完全移除 FF 元素。

[1][https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/html/fenced_frame/fenced_frame_config.idl](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/html/fenced_frame/fenced_frame_config.idl)
[2][https://groups.google.com/a/chromium.org/g/blink-dev/c/k_nubsMb97g/m/awPD4IGLBAAJ](https://groups.google.com/a/chromium.org/g/blink-dev/c/k_nubsMb97g/m/awPD4IGLBAAJ)
[3][https://groups.google.com/a/chromium.org/g/blink-dev/c/uh5Ke6qyegc/m/WFTFnhyJBAAJ](https://groups.google.com/a/chromium.org/g/blink-dev/c/uh5Ke6qyegc/m/WFTFnhyJBAAJ)

[跟踪问题 #538634423](https://issues.chromium.org/538634423) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6366274495053824) | [规范](https://wicg.github.io/fenced-frame) | [说明文档](https://github.com/WICG/fenced-frame/blob/master/explainer/README.md)

---

来源：[ChromeStatus Chrome 156 版本说明](https://chromestatus.com/release-notes/156)。本文将英文页面正文忠实转换为 Markdown，并提供非官方简体中文翻译；省略导航和复制链接控件。页面源码包含 Copyright 2016 Google Inc. All Rights Reserved 版权声明及 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) 许可声明。

发布核验：[ChromiumDash Windows Stable 记录](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=156&num=1000)。最早匹配的实际 Stable 记录为 156.0.8078.12，发布于 2026-10-07（UTC）。上方计划日期保留自原文，不用作实际发布日期。
