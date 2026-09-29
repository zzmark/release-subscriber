# Chrome 142

来源：[Chrome 142 Release Notes](https://developer.chrome.com/release-notes/142?hl=en)

**署名与许可：**Google for Developers。除另有说明外，文章正文采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，代码示例采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)。此页由官方英文 HTML 正文转换后翻译。

**稳定版发布日期：**2025 年 10 月 28 日

除非另有说明，以下变更适用于 Android、ChromeOS、Linux、macOS 和 Windows 上的 Chrome 142 稳定渠道版本。

只想了解重点？请参阅 [Chrome 142 新功能](https://developer.chrome.com/blog/new-in-chrome-142)。

## CSS 和界面

### `::view-transition` 元素的绝对定位

视图过渡使用元素的伪元素子树，`::view-transition` 是该过渡的根。此前它被规定为 `position: fixed`。CSS 工作组决定改为 `position: absolute`，Chrome 现在采用这一更改。

这一变化通常不可察觉，因为无论是绝对定位还是固定定位，该元素的包含块仍是快照包含块。唯一可见的差别出现在 `getComputedStyle` 中。

[跟踪问题 #439800102](https://issues.chromium.org/issues/439800102) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6155213736116224) | [规范](https://github.com/w3c/csswg-drafts/issues/12116)

### 文档的 `activeViewTransition` 属性

View Transitions API 让开发者在不同状态之间启动视觉过渡。单页应用的主要入口是 `startViewTransition()`，它会返回一个过渡对象。该对象包含用于跟踪过渡进度的 Promise 和功能，开发者还可操作过渡，例如跳过过渡或修改其类型。

从 Chrome 142 起，开发者无需自行保存该对象。`document.activeViewTransition` 表示当前过渡对象；如果没有正在进行的过渡，则为 `null`。

多页应用过渡也适用。此前仅能通过 `pageswap` 与 `pagereveal` 事件取得对象；此次更新后，`document.activeViewTransition` 会在过渡持续期间指向它。

[跟踪问题 #434949972](https://issues.chromium.org/issues/434949972) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5067126381215744) | [规范](https://drafts.csswg.org/css-view-transitions-2)

### `:target-before` 和 `:target-after` 伪类

这些伪类根据扁平树顺序，匹配同一滚动标记组中位于活动标记（匹配 `:target-current`）之前或之后的滚动标记：

- `:target-before`：匹配组内扁平树顺序中位于活动标记之前的所有滚动标记。
- `:target-after`：匹配组内扁平树顺序中位于活动标记之后的所有滚动标记。

[跟踪问题 #440475008](https://issues.chromium.org/issues/440475008) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5120827674722304) | [规范](https://drafts.csswg.org/css-overflow-5/#active-before-after-scroll-markers)

### 样式容器查询和 `if()` 的范围语法

Chrome 为 CSS 样式查询和 `if()` 函数增加范围语法支持。

此前样式查询只能精确匹配值（例如 `style(--theme: dark)`）；开发者现在可以用 `>`、`<` 等比较运算符，比较自定义属性、字面值（如 10px 或 25%）以及 `attr()`、`env()` 等替换函数的值。有效比较要求两边解析为相同数据类型，并仅限于 `<length>`、`<number>`、`<percentage>`、`<angle>`、`<time>`、`<frequency>` 和 `<resolution>` 等数值类型。

[跟踪问题 #408011559](https://issues.chromium.org/issues/408011559) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5184992749289472) | [规范](https://drafts.csswg.org/css-conditional-5/#typedef-style-range)

### Interest Invokers（`interestfor` 属性）

Chrome 为 `<button>` 和 `<a>` 元素添加 `interestfor` 属性。它让元素具备“兴趣”行为：用户对元素表示兴趣时，会对目标元素触发操作，例如显示弹出框。用户代理通过悬停指针、按特定键盘热键或在触摸屏上长按等方式判断用户是否表现出兴趣。兴趣出现或消失时，目标会收到 `InterestEvent`；对于弹出框，该事件有显示和隐藏等默认操作。

[跟踪问题 #326681249](https://issues.chromium.org/issues/326681249) | [ChromeStatus.com 条目](https://chromestatus.com/feature/4530756656562176) | [规范](https://github.com/whatwg/html/pull/11006)

### 移动端和桌面端的 select 渲染模式保持一致

使用 `size` 和 `multiple` 属性时，`<select>` 元素可渲染为页面内列表框或带弹出框的按钮。但这些模式在移动版与桌面版 Chrome 上并不一致：移动端没有页面内列表框，桌面端在设置 `multiple` 时没有带弹出框的按钮。

此次更新为移动端增加列表框，为桌面端增加多选弹出框，并确保通过 `size` 和 `multiple` 属性选择的渲染模式在两种设备上相同。具体变化如下：

- 当 `size` 值大于 `1` 时，始终使用页面内渲染；此前移动设备会忽略这一点。
- 当设置 `multiple` 但未设置 `size` 时，使用页面内渲染；此前移动设备会使用弹出框而非页面内列表框。
- 当同时设置 `multiple` 和 `size=1` 时，使用弹出框；此前桌面设备会使用页面内列表框。

[跟踪问题 #439964654](https://issues.chromium.org/issues/439964654) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5412736871825408) | [规范](https://github.com/whatwg/html/pull/11460)

### SVG `<a>` 元素支持 `download` 属性

Chromium 的 `SVGAElement` 接口新增对 `download` 属性的支持，与 SVG 2 规范保持一致。作者可以指定下载 SVG 超链接目标，而非导航到该目标，与 `HTMLAnchorElement` 已支持的行为相同。这改善了主要浏览器之间的互通性，并让 HTML 和 SVG 链接元素行为一致，更符合开发者及用户预期。

[跟踪问题 #40589293](https://issues.chromium.org/issues/40589293) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6265596395913216) | [规范](https://svgwg.org/svg2-draft/linking.html#InterfaceSVGAElement)

## 图形

### WebGPU：`primitive_index` 功能

WebGPU 添加新的可选能力，开放 WGSL 着色器内建值 `primitive_index`。在受支持硬件上，它向片段着色器提供逐图元索引，类似 `vertex_index` 和 `instance_index` 内建值。该索引可用于虚拟化几何等高级图形技术。

[跟踪问题 #342172182](https://issues.chromium.org/issues/342172182) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6467722716250112) | [规范](https://gpuweb.github.io/gpuweb/#dom-gpufeaturename-primitive-index)

### WebGPU：一级和二级纹理格式

扩展 GPU 纹理格式支持，增加渲染附件、混合、多重采样、解析和 storage\_binding 等能力。

[跟踪问题 #445725447](https://issues.chromium.org/issues/445725447) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5116926821007360) | [规范](https://www.w3.org/TR/webgpu/#texture-formats-tier1)

## Web API

### FedCM：在界面中显示第三方 iframe 来源

在 Chrome 142 之前，FedCM 界面始终显示顶层网站。

当 iframe 在概念上属于第一方时，这种做法很合适（例如 `foo.com` 的 iframe 使用 `foostatic.com`，后者对用户没有实际意义）。

如果 iframe 实际来自第三方，则显示 iframe 的来源更好，用户可以清楚知道自己正与谁共享凭据。例如，一个相片编辑器嵌入图书出版 Web 应用，并希望用户访问此前保存在编辑器中的文件。现在可以在界面中显示该第三方来源。

[跟踪问题 #390581529](https://issues.chromium.org/issues/390581529) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5176474637959168) | [规范](https://github.com/w3c-fedid/FedCM/pull/774)

### 对 JSON 模块更严格地验证 `*+json` MIME 令牌

在匹配 `*+json` 时，如果 JSON 模块脚本响应的 MIME 类型或子类型包含非 HTTP 令牌码点（例如空格），则拒绝该响应。这符合 MIME Sniffing 规范及其他引擎的行为，也是 Interop2025 模块重点工作的一部分。

[跟踪问题 #440128360](https://issues.chromium.org/issues/440128360) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5182756304846848) | [规范](https://mimesniff.spec.whatwg.org/#parse-a-mime-type)

### Web Speech API 上下文偏好

网站可以通过向 Web Speech API 添加识别短语列表，为语音识别提供上下文偏好。

开发者可提供并更新短语列表，使语音识别模型偏向这些短语，从而提高特定领域及个性化语音识别的准确性和相关性。

[ChromeStatus.com 条目](https://chromestatus.com/feature/5225615177023488) | [规范](https://webaudio.github.io/web-speech-api/#speechreco-phraselist)

### Media Session：为 `enterpictureinpicture` 操作详情添加原因

向 Media Session API 中发送给 `enterpictureinpicture` 操作的 `MediaSessionActionDetails` 添加 `enterPictureInPictureReason`。开发者可以区分由用户明确触发的画中画操作（例如点击用户代理中的按钮），与内容被遮挡后由用户代理自动触发的操作。

[跟踪问题 #446738067](https://issues.chromium.org/issues/446738067) | [ChromeStatus.com 条目](https://chromestatus.com/feature/6415506970116096) | [规范](https://github.com/w3c/mediasession/pull/362)

## 安全

### 本地网络访问限制

Chrome 142 限制向用户本地网络发起请求的能力，并以权限提示控制该能力。

本地网络请求包括公共网站向本地 IP 地址或环回地址发起的请求，以及本地网站（例如内网网站）向环回地址发起的请求。将这些请求置于权限控制之下，可降低针对路由器等本地网络设备的跨站请求伪造风险，也减少网站利用这些请求对用户本地网络进行指纹识别的能力。

此权限仅在安全上下文中可用。授予权限后，本地网络请求的混合内容阻止规则也会放宽，因为不少本地设备无法取得公开受信任的 TLS 证书。

详情参阅[本地网络访问的新权限提示](https://developer.chrome.com/blog/local-network-access)。

[跟踪问题 #394009026](https://issues.chromium.org/issues/394009026) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5152728072060928) | [规范](https://wicg.github.io/local-network-access)

## 用户输入

### 仅在安全上下文暴露可互通的 pointerrawupdate 事件

Pointer Events 规范在 2020 年将 `pointerrawupdate` 限制在安全上下文，在不安全上下文中隐藏事件触发和全局事件监听器。Chrome 现在与更新后的规范及其他主要浏览器保持一致。

[跟踪问题 #404479704](https://issues.chromium.org/issues/404479704) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5151468306956288) | [规范](https://w3c.github.io/pointerevents/#the-pointerrawupdate-event)

### 同源、渲染器发起的导航后保留持久用户激活

页面导航到另一个同源页面后，会保留持久用户激活状态。导航后的页面缺少用户激活会阻碍自动聚焦时显示虚拟键盘等用例，也成为希望用多页应用取代单页应用的开发者的障碍。

**注意：**此功能不涵盖浏览器发起的导航请求，包括重新加载、历史导航以及在地址栏输入 URL。

[跟踪问题 #433729626](https://issues.chromium.org/issues/433729626) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5078337520926720) | [规范](https://github.com/whatwg/html/pull/11454)

## 来源试用

### Device Bound Session Credentials

这是一种将网站会话安全绑定到单一设备的方法。

服务器可将会话安全绑定到设备。浏览器会根据服务器要求，定期提供私钥持有证明并续期会话。

[来源试用](https://developer.chrome.com/origintrials#/view_trial/3357996472158126081) | [Device Bound Session Credentials：第二轮来源试用开始](https://developer.chrome.com/blog/dbsc-origin-trial-update) | [ChromeStatus.com 条目](https://chromestatus.com/feature/5140168270413824) | [规范](https://w3c.github.io/webappsec-dbsc)
