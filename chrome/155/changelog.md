# Chrome 155 Release Notes

Preview

Scheduled Stable Release: October 6, 2026

## Capabilities (Fugu)

### [Additional Windowing Controls](https://chromestatus.com/feature/5201832664629248)

Enables web applications with the window-management permission to maximize(), minimize(), and restore() their windows, and to prevent resizing through setResizable(). Additionally, new CSS media features display-state and resizable enable scripts and content to adapt to the respective window states and resizability. These features improve the usability of VDI remote application windows in Web clients, especially when it comes to titlebar window controls. The new functionality enhances existing Window Management API features: [https://chromestatus.com/feature/5252960583942144](https://chromestatus.com/feature/5252960583942144)

[Tracking bug #40192345](https://issues.chromium.org/issues/40192345) | [ChromeStatus.com entry](https://chromestatus.com/feature/5201832664629248) | [Spec](https://www.w3.org/TR/window-management/#api-window-minimize-method) | [Explainer](https://github.com/w3c/window-management/blob/main/EXPLAINER_additional_windowing_controls.md) | [Demo](https://awc-demo-4a08a808.web.app)

## Security

### [Algorithm Updates in WebCrypto](https://chromestatus.com/feature/5198951632470016)

Add post-quantum cryptography and a common symmetric AEAD to the set of cryptographic algorithms available in the Web Cryptography API. This will enable developers to have access browser-provided implementations of common quantum-resistant cryptographic algorithms standardized by NIST.

 - ML-KEM - 768, 1024
 - ML-DSA - 44, 65, 87
 - ChaCha20-Poly1305
 - X-Wing

[Tracking bug #450627017](https://issues.chromium.org/issues/450627017) | [ChromeStatus.com entry](https://chromestatus.com/feature/5198951632470016) | [Spec](https://wicg.github.io/webcrypto-modern-algos)

## CSS

### [CSS Symbols()](https://chromestatus.com/feature/5146996093616128)

The CSS symbols() function lets authors define a counter style inline instead of first declaring a named @counter-style at-rule. It builds an anonymous counter style from a list of string symbols plus an optional counting system (cyclic, numeric, alphabetic, symbolic, or fixed), and is accepted as the counter style in list-style-type, the list-style shorthand, and counter() / counters().

[Tracking bug #40747844](https://issues.chromium.org/issues/40747844) | [ChromeStatus.com entry](https://chromestatus.com/feature/5146996093616128) | [Spec](https://drafts.csswg.org/css-counter-styles-3/#symbols-function) | [Explainer](https://developer.mozilla.org/docs/Web/CSS/symbols) | [Demo](https://developer.mozilla.org/en-US/docs/Web/CSS/symbols)

### [CSS4 text-decoration-skip-spaces](https://chromestatus.com/feature/4832783806627840)

The text-decoration-skip-spaces CSS property controls whether text decoration lines (underlines, overlines, line-throughs, etc.) skip over whitespace characters. This allows authors to prevent decorations from being drawn under spaces, which is often more visually appealing.

[Tracking bug #40862777](https://issues.chromium.org/issues/40862777) | [ChromeStatus.com entry](https://chromestatus.com/feature/4832783806627840) | [Spec](https://drafts.csswg.org/css-text-decor-4/#text-decoration-skip-spaces-property) | [Demo](http://wpt.live/css/css-text-decor/text-decoration-skip-spaces-001.html) | [Demo](http://wpt.live/css/css-text-decor/text-decoration-skip-spaces-002.html) | [Demo](http://wpt.live/css/css-text-decor/text-decoration-skip-spaces-003.html) | [Demo](http://wpt.live/css/css-text-decor/text-decoration-skip-spaces-004.html)

### [Margin-trim](https://chromestatus.com/feature/5197863732772864)

The `margin-trim` CSS property may be used to omit margins before or after the first or last child of a container. This is supported on regular block containers and multicol containers.

 This is somewhat similar to the effect caused by the margin quirk that is applied to P, H1, H2... elements inside BODY and table cell elements (in quirks mode), but more powerful, generic, and expressive.

 Note: A previous version of the spec also applied this for flex and grid containers, but this has been removed.

[Tracking bug #40886857](https://issues.chromium.org/issues/40886857) | [ChromeStatus.com entry](https://chromestatus.com/feature/5197863732772864) | [Spec](https://drafts.csswg.org/css-box-4/#margin-trim)

## Miscellaneous

### [Digital Credentials API (issuance support)](https://chromestatus.com/feature/5099333963874304)

This Web Platform feature enables issuing websites (e.g., a university, government agency, or bank) to securely initiate the provisioning (issuance) process of digital credentials directly into a user's mobile wallet application. On Android, this capability leverages the Android IdentityCredential CredMan system (Credential Manager). On Desktop, it leverages cross-device approaches using the CTAP protocol similar to Digital Credentials presentation.

[Tracking bug #378330032](https://crbug.com/378330032) | [ChromeStatus.com entry](https://chromestatus.com/feature/5099333963874304) | [Spec](https://w3c-fedid.github.io/digital-credentials) | [Explainer](https://github.com/w3c-fedid/digital-credentials/blob/main/explainer.md)

### [Host and screenshot restrictions for chrome.debugger API](https://chromestatus.com/feature/5072259281715200)

The [`chrome.debugger` extension API](https://developer.chrome.com/docs/extensions/reference/api/debugger) lets you send [Chrome DevTools Prototcol](https://chromedevtools.github.io/devtools-protocol/) commands to a specified `target`, for example, a tab, an iframe, or a service worker. When connecting (attaching) to a target, the API can now enforce permissions on managed browsers by validating enterprise host and screenshot policies.

 On enterprise devices, some policies can restrict extensions from attaching the debugger using an all-or-nothing model at attach time (browser.debugger.attach()):

 - For hosts, the [ExtensionSettings](https://chromeenterprise.google/policies/#ExtensionSettings) enterprise policy can be configured to block hosts for an extension, returning the error `Host access is restricted by policy`.
 - For screenshots, the enterprise policy [DisableScreenshots](https://chromeenterprise.google/policies/#DisableScreenshots) enterprise policy disables screenshot capture or Data Loss Prevention (DLP) rules apply, returning the error `Screenshot capture is restricted by policy`.

 Developers can handle attach rejections gracefully or use higher-level APIs like [`chrome.scripting`](https://developer.chrome.com/docs/extensions/reference/api/scripting) and [`chrome.declarativeNetRequest`](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest) that support granular origin permissions in restricted enterprise environments.

[Tracking bug #533240995](https://g-issues.chromium.org/issues/533240995) | [ChromeStatus.com entry](https://chromestatus.com/feature/5072259281715200)

### [PredefinedColorSpace srgb-linear and display-p3-linear](https://chromestatus.com/feature/5122501071994880)

Add srgb-linear and display-p3-linear color spaces (as defined by CSS) to PredefinedColorSpace for use with canvases.

[Tracking bug #454152417](https://issuetracker.google.com/issues/454152417) | [ChromeStatus.com entry](https://chromestatus.com/feature/5122501071994880) | [Spec](https://html.spec.whatwg.org/multipage/canvas.html#colour-spaces-and-colour-correction)

## JavaScript

### [Import Text (Text Modules)](https://chromestatus.com/feature/5191512456560640)

A TC39 proposal to add module `import … with { type: "text" }` statements to JavaScript. The import attribute loads text data as a string value.

[Tracking bug #494350643](https://issues.chromium.org/issues/494350643) | [ChromeStatus.com entry](https://chromestatus.com/feature/5191512456560640) | [Spec](https://tc39.es/proposal-import-text) | [Explainer](https://github.com/tc39/proposal-import-text) | [Explainer](https://github.com/whatwg/html/pull/11933) | [Explainer](https://github.com/w3c/webappsec-csp/pull/794)

## Multimedia

### [JPEG XL decoding support (image/jxl) in blink](https://chromestatus.com/feature/5114042131808256)

Adds support for decoding JPEG XL (image/jxl) images in Blink using jxl-rs, a memory-safe pure Rust decoder ([https://github.com/libjxl/jxl-rs](https://github.com/libjxl/jxl-rs)). JPEG XL is a modern image format standardized as ISO/IEC 18181 that offers progressive decoding for improved perceived loading performance, support for wide color gamut, HDR, and high bit depth, and support for animation.

[ChromeStatus.com entry](https://chromestatus.com/feature/5114042131808256) | [Spec](https://www.iso.org/standard/85066.html)

### [Pause media playback on not-visible iframes](https://chromestatus.com/feature/5082950457884672)

Adds a "media-playback-while-not-visible" permission policy to allow embedders to pause audible media playback of embedded iframes which are currently hidden - i.e. "display" property set to "none"; "visibility" property set to "hidden"; or zero-area (width or height equal to 0). While hidden, attempts made by the embedded iframe to render audible media will be blocked. When the frame is shown again the prohibitions should be lifted. This should allow developers to build more user-friendly experiences and to also improve the performance by letting the browser handle the playback of content that is not visible to users.

[Tracking bug #351354996](https://issues.chromium.org/issues/351354996) | [ChromeStatus.com entry](https://chromestatus.com/feature/5082950457884672) | [Spec](https://wicg.github.io/iframe-media-pausing) | [Explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/IframeMediaPause/iframe_media_pausing.md) | [Demo](https://gabrielsanbrito.github.io/media-playback-while-not-visible)

## Graphics

### [WebGPU: atomic-vec2u-min-max](https://chromestatus.com/feature/4882016087703552)

Allows the use of 64-bit atomic minimum and maximum operations on `atomic<vec2u>` in WGSL.

 This provides WebGPU shader authors with a way to implement certain algorithms that use 64-bit atomics without requiring full support for 64-bit integers.

[Tracking bug #453689550](https://crbug.com/453689550) | [ChromeStatus.com entry](https://chromestatus.com/feature/4882016087703552) | [Spec](https://www.w3.org/TR/webgpu/#dom-gpufeaturename-atomic-vec2u-min-max) | [Explainer](https://github.com/gpuweb/gpuweb/issues/5071)

## Network / Connectivity

### [WebTransport Datagram readable stream type](https://chromestatus.com/feature/5148774971342848)

Adds the WebTransportOptions.datagramsReadableType constructor option. By default, incoming WebTransport Datagrams are exposed through a default ReadableStream . Applications that require BYOB reading can request a readable byte stream by setting datagramsReadableType: "bytes" .

[Tracking bug #547572475](https://issues.chromium.org/issues/547572475) | [ChromeStatus.com entry](https://chromestatus.com/feature/5148774971342848) | [Spec](https://www.w3.org/TR/webtransport/#dom-webtransportoptions-datagramsreadabletype) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md)

### [WebTransport Datagram writable streams and prioritization](https://chromestatus.com/feature/5183354944225280)

Adds the modern WebTransport Datagram sending API.

 WebTransportDatagramDuplexStream.createWritable() creates independent WebTransportDatagramsWritable streams. Each writable has mutable sendGroup and sendOrder attributes for expressing relative priority among queued WebTransport data in the same send group. Chromium currently applies this ordering among Datagram writables.

 The implementation also reports the negotiated maximum outgoing Datagram payload size and discards oversized writes as required by the WebTransport specification.

[Tracking bug #547572475](https://issues.chromium.org/issues/547572475) | [ChromeStatus.com entry](https://chromestatus.com/feature/5183354944225280) | [Spec](https://www.w3.org/TR/webtransport/#datagram-writable) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md#5-sending-and-receiving-datagrams)

### [WebTransport receive stream](https://chromestatus.com/feature/5109912169480192)

Adds the standardized WebTransportReceiveStream interface, a ReadableStream subclass used for incoming unidirectional streams and the readable side of bidirectional streams. Its getStats() method returns per-stream byte counters: bytesReceived reports bytes received from the network, while bytesRead reports bytes delivered to the application.

[Tracking bug #568317222](https://issues.chromium.org/issues/568317222) | [ChromeStatus.com entry](https://chromestatus.com/feature/5109912169480192) | [Spec](https://w3c.github.io/webtransport/#webtransportreceivestream) | [Explainer](https://github.com/w3c/webtransport/issues/372) | [Explainer](https://github.com/w3c/webtransport/pull/395)

### [WebTransport reliability attributes](https://chromestatus.com/feature/5094058497277952)

Adds the WebTransport.reliability instance attribute and static WebTransport.supportsReliableOnly attribute. These APIs indicate whether the user agent supports WebTransport over exclusively reliable connections and whether an established session supports unreliable transport such as datagrams.

 In Chromium, reliability initially returns "pending" and changes to "supports-unreliable" after an HTTP/3 WebTransport connection is established. Since Chromium does not currently support HTTP/2 fallback, WebTransport.supportsReliableOnly returns false; any successfully established session uses HTTP/3 and supports unreliable datagrams.

[Tracking bug #545636884](https://issues.chromium.org/issues/545636884) | [ChromeStatus.com entry](https://chromestatus.com/feature/5094058497277952) | [Spec](https://www.w3.org/TR/webtransport/#dom-webtransport-reliability) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md#transport-modes)

---

Source: [ChromeStatus Chrome 155 Release Notes](https://chromestatus.com/release-notes/155). This Markdown faithfully converts the English page body; navigation and copy-link controls are omitted. The page source carries Copyright 2016 Google Inc. All Rights Reserved and an [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) notice.

Release verification: [ChromiumDash Windows Stable records](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=155&num=1000). The earliest matching actual Stable record is 155.0.8059.12, published on 2026-09-23 (UTC). The scheduled date above is retained from the article and is not used as the publication date.
