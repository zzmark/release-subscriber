# Chrome 146

来源：[Chrome 146 Release Notes](https://developer.chrome.com/release-notes/146?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2026 年 3 月 10 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 146 稳定渠道版本。

只想了解重点？请参阅 [Chrome 146 新功能](https://developer.chrome.com/blog/new-in-chrome-146)。

## CSS 和界面

### 滚动触发动画

此功能增加基于滚动位置控制动画的能力，例如播放、暂停和重置动画。

Web 页面常在滚动到某个位置时启动动画。开发者通常用 JavaScript 手动检测元素是否进入滚动容器的视口，再启动相应动画（如让元素滑入视图）。许多此类场景依赖可以声明式提供的信息。现在可以用 CSS 声明这些交互，让用户代理将交互工作转移到 Worker 线程。API 也包含 JavaScript 接口，使该功能不仅适用于 CSS 动画，也可扩展到 Web Animations。

[跟踪问题 #390314945](https://issues.chromium.org/issues/390314945) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5181996801982464) | [规范](https://drafts.csswg.org/css-animations-2/#timeline-triggers)

### `trigger-scope` 属性

`trigger-scope` 属性可以限制由`trigger-instantiating properties`（触发器实例化属性）声明的 `animation triggers` 名称的可见范围。

例如 `timeline-trigger` 等 `Trigger-instantiating properties`（触发器实例化属性）会声明名称，供 `animation-trigger` 属性引用，以将动画关联到触发器。但这些名称默认是全局的（类似 `anchor-name`）；限定其可见范围通常有助于隔离动画与触发器之间的交互。

[跟踪问题 #466134208](https://issues.chromium.org/issues/466134208) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5152759609425920) | [规范](https://drafts.csswg.org/css-animations-2/#trigger-scope)

### `meta name="text-scale"`

`root element`（根元素）的默认字号会同时按操作系统和浏览器的文本缩放设置成比例变化。遵循 `font-relative units`（相对字体单位）最佳实践的页面（即用 `rem` 和 `em` 设置字号，以及会适应用户文字大小偏好的页面元素）因此能尊重用户在操作系统级别的文本缩放设置。它也会停用现有的浏览器机制（例如 Windows 上整页缩放）和启发式处理（例如移动端文字自动调整大小）。可以向浏览器表明页面采用 `rem`、`em` 等构建方式，能够随用户选定的不同字号良好缩放。与提供读取文本缩放值途径的 `env(preferred-text-scale)` 类似，此 API 进一步允许借助根元素默认字号进行缩放，并退出自动文字缩放。

[跟踪问题 #430566925](https://issues.chromium.org/issues/430566925) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5112244702674944) | [规范](https://drafts.csswg.org/css-fonts-5/#text-scale-meta)

### 作用域自定义元素注册表

此功能允许页面中为同一个标签名称定义多个自定义元素，避免 Web 应用同时使用多个来源的库时发生名称冲突。用户代码可以创建多个自定义元素注册表，并将它们与树作用域及作为作用域对象的元素关联。

[跟踪问题 #40826514](https://issues.chromium.org/issues/40826514) | [ChromeStatus.com 条目](https://chromestatus.com/feature/515090435261792256) | [规范](https://html.spec.whatwg.org/multipage/custom-elements.html#customelementregistry)

## 能力

### 处理文件时填充 `targetURL`

现在 PWA 通过文件处理方式启动时，Launch Handler 实现会确保填充 `LaunchParams.targetURL`。此前，如果文件启动被导向现有窗口，该属性为 `null`。现在，`launchQueue` 消费者能够取得清单 `action` 字段中的 URL，即文档当前必须加载的 URL。

[跟踪问题 #464314997](https://issues.chromium.org/issues/464314997) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5119095123083264) | [规范](https://wicg.github.io/manifest-incubations/index.html#execute-a-file-handler-launch)

### 重新加载时不再将 LaunchParams 重新入队

阻止 `launchQueue` 在用户重新加载页面时再次发送上一次的 `LaunchParams`（包括文件句柄）。此前刷新页面会让启动消费者再次收到最初启动的数据。此变更将重新加载视为普通导航，而不是“再次启动”；除非发生新的文件启动事件，否则 `launchQueue` 不会收到重复文件。

[跟踪问题 #40204185](https://issues.chromium.org/issues/40204185) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5986946868445184)

## DOM

### Navigation API：从 `precommit` 添加提交后处理程序

通过 `navigate` 事件拦截导航时，`precommitHandlers` 与普通的提交后处理程序分开传入。

只有其中一种处理程序时，这种方式很好用；如果流程中的 `precommitHandler` 会接续一个 `post-commit handler`，就较为繁琐。

这项小幅易用性改进允许在调用预提交处理程序的同时注册提交后处理程序。

[跟踪问题 #465487215](https://issues.chromium.org/issues/465487215) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5176907844943872) | [规范](https://html.spec.whatwg.org/#dom-navigationprecommitcontroller-addhandler)

## 图形

### WebGPU：Texture and Sampler Lets

向 WGSL 添加 `texture_and_sampler_let` 语言功能，允许把 `texture` 与 `sampler` 对象存入 WGSL 的 `let` 声明。

[跟踪问题 #459500757](https://issues.chromium.org/issues/459500757) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5102334940151808) | [规范](https://github.com/gpuweb/gpuweb/pull/5389)

### WebGPU：瞬时附件

此功能在 WebGPU 首次由浏览器推出后，进一步扩展其规范。

新增的 `TRANSIENT_ATTACHMENT GPUTextureUsage` 可创建让渲染通道操作留在 Tile Memory 中的附件，减少显存流量，并可能避免为纹理分配显存。

[跟踪问题 #462620664](https://issues.chromium.org/issues/462620664) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5562829589577728) | [规范](https://gpuweb.github.io/gpuweb/#dom-gputextureusage-transient_attachment)

### WebGPU 兼容模式

兼容模式提供一种需主动启用、限制较轻的 WebGPU API 子集，可在 `OpenGL`、`Direct3D11` 等较旧图形 API 上运行。启用该模式并遵循限制后，`WebGPU` 应用可以覆盖更多缺少核心 WebGPU 所要求的现代显式图形 API 的旧设备。简单应用只需在调用 `requestAdapter` 时指定 `compatibility` `featureLevel`；复杂应用可能需要作出修改以适应限制。兼容模式是 WebGPU Core 的子集，因此相应应用仍是有效的 WebGPU Core 应用，也能在不支持兼容模式的用户代理上运行。

[跟踪问题 #442618060](https://issues.chromium.org/issues/442618060) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6436406437871616) | [规范](https://github.com/gpuweb/gpuweb/blob/main/proposals/compatibility-mode.md)

## JavaScript

### 迭代器串接

TC39 提案允许通过串接现有 `iterators` 创建新迭代器，新增 `Iterator.concat`（`...items`）。

[跟踪问题 #434977727](https://issues.chromium.org/issues/434977727) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5193275975794688) | [规范](https://github.com/tc39/proposal-iterator-sequencing)

### 选择性权限干预

用户允许网站访问 `Bluetooth`、`Camera`、`Clipboard`、`DisplayCapture`、`Geolocation`、`Microphone`、`Serial` 或 `USB` 等强大 API 时，授权意图面向该网站，而不一定面向页面上运行的每个第三方脚本。特别是主 frame 或同源 iframe 中嵌入的广告脚本，可能利用页面权限访问敏感数据，而用户未必知道广告正在读取这些信息。

此干预措施旨在阻止拥有 API 权限的上下文中的广告脚本使用该权限，使已授予的权限更符合用户意图，增强用户对数据的信任和控制。

[跟踪问题 #435214052](https://issues.chromium.org/issues/435214052) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5138246835240960) | [规范](https://github.com/w3c/webappsec-permissions-policy/pull/572)

### 从 `dragover` 到 `drop` 保留 `dropEffect` 值

`HTML5 Drag and Drop API` 通过 `dragstart`、`dragenter`、`dragover`、`dragleave`、`drop` 和 `dragend` 等一系列事件，让 Web 应用处理拖放操作。在这些事件期间，[`dataTransfer.dropEffect`](https://www.w3.org/TR/2011/WD-html5-20110113/dnd.html#dom-datatransfer-dropeffect) 属性指示应执行的操作（`copy`、`move`、`link` 或 `none`）。

根据 [`HTML5 规范`](https://www.w3.org/TR/2011/WD-html5-20110113/dnd.html#dndevents)，Web 应用在最后一次 `dragover` 事件中设置的 `dropEffect` 值应保留，并在随后的 `drop` 事件中可用。

此前基于 Chromium 的浏览器会在 `drop` 事件触发前，以浏览器自行协商的操作覆盖应用设置的 `dropEffect`，不符合规范且限制了开发者对拖放行为的控制。现在已调整此行为。

[跟踪问题 #40068941](https://issues.chromium.org/issues/40068941) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5140028068069376) | [规范](https://www.w3.org/TR/2011/WD-html5-20110113/dnd.html#dom-datatransfer-dropeffect)

## 多媒体

### WebAudio 播放统计 API

新增 `AudioContext.playbackStats` 属性，返回 `AudioPlaybackStats` 对象。该对象提供 `average latency`（平均延迟）、`minimum/maximum latency`（最小和最大延迟）、`underrun duration`（欠载时长）及 `underrun count`（欠载次数）等音频播放统计信息，让 Web 应用能够监控播放质量并检测故障。

**注意：**此功能此前以 `AudioContext.playoutStats` 跟踪。为符合最终 Web Audio API 规范，已重命名为 `AudioContext.playbackStats`。旧名称作为已弃用别名保留，以兼容旧代码。

[跟踪问题 #475838360](https://issues.chromium.org/issues/475838360) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5172818344148992) | [规范](https://webaudio.github.io/web-audio-api/#AudioPlaybackStats)

## 网络

### 保留 Data URL MIME 类型参数

按照 `Fetch Standard` 规定，在 Data URL 的 `Content-Type` 头中保留 `MIME type parameters`（如 `charset`、`boundary`）。

[跟踪问题 #40487194](https://issues.chromium.org/issues/40487194) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4874471565557760) | [规范](https://fetch.spec.whatwg.org/#data-url-processor)

## 性能

### LCP：按规范生成候选条目

`LCP` 算法现在根据已绘制的最大图像，而不是仍在等待绘制的最大图像产生候选条目。这可能让性能时间线出现更多中间候选条目。

每一动画帧呈现后，如果该帧绘制了新的最大文本或图像，LCP 算法最多向性能时间线发送一个新候选条目。算法还会跟踪“等待中的最大图像”，即仍在加载的最大图像，并使用其尺寸判断新候选条目是否最大。这意味着加载缓慢的大图像可能阻止中间 LCP 候选条目的发送，而这些候选条目往往有助于理解加载进展。

此行为在 Interop 2025 工作中被发现与其他引擎不同，团队同意调整为基于每帧已绘制的图像和文本元素集合，每帧最多发送一个候选条目。

[跟踪问题 #482261053](https://issues.chromium.org/issues/482261053) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5167930847395840) | [规范](https://github.com/w3c/largest-contentful-paint/pull/154)

## 安全

### Sanitizer API

Sanitizer API 可从任意用户提供的 HTML 内容中移除可能执行脚本的内容，目标是让构建无 XSS 的 Web 应用更容易。

[跟踪问题 #40138584](https://issues.chromium.org/issues/40138584) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5814067399491584) | [规范](https://wicg.github.io/sanitizer-api)

## 来源试用

### WebNN

`WebNN` 允许 Web 应用及框架利用操作系统的原生机器学习服务，以及设备底层硬件能力，在 Web 上实现一致、高效、可靠的机器学习体验。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/2250110963824984065) | [跟踪问题 #40206287](https://issues.chromium.org/issues/40206287) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5176273954144256) | [规范](https://webmachinelearning.github.io/webnn)

### CPU Performance API

此 API 暴露设备性能信息，面向使用这些信息改善体验的 Web 应用。它也可与 Compute Pressure API 结合使用，后者提供设备 CPU 压力或利用率信息，应用可对 CPU 压力变化作出响应。

[跟踪问题 #449760252](https://issues.chromium.org/issues/449760252) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5189864286978048) | [规范](https://wicg.github.io/cpu-performance)

### Speculation Rules：`form_submission` 字段

扩展 `speculation rules` 语法，允许为 `prerender` 指定 `form_submission` 字段。

此字段指示浏览器将 `prerender` 准备为表单提交，使真实的表单提交导航可以激活它。例如，简单搜索表单会产生 `/search?q=XXX` GET 请求导航；Web 开发者一直希望支持这种用例。

[跟踪问题 #346555939](https://issues.chromium.org/issues/346555939) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5074313831120896) | [规范](https://storage.googleapis.com/spec-previews/WICG/nav-speculation/pull/426/diff/prerendering.html)

## Focusgroup

Focusgroup 功能让用户可使用键盘方向键，在一组可聚焦元素之间移动焦点。

详情参阅 [征求开发者反馈：focusgroup](https://developer.chrome.com/blog/focusgroup-rfc)。

[来源试用](https://developer.chrome.com/origintrials#/register_trial/4231694799868002305) | [跟踪问题 #1286127](https://issues.chromium.org/issues/1286127) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5637601087193088) | [规范](https://github.com/whatwg/html/pull/11723)
