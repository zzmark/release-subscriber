# Chrome 159 Release Notes

Preview

Scheduled Stable Release: December 8, 2026 (Currently on Beta channel)

## CSS

### [AccentColor & AccentColorText follows accent-color value](https://chromestatus.com/feature/6207138742534144)

`AccentColor` and `AccentColorText` reflect the element's effective `accent-color` value instead of only platform-provided system accent colors.

This allows CSS to reference the same colors used by `accent-color` styling, making it easier to keep custom styling consistent with form controls and other accented UI. It aligns Chromium's behavior with the CSS Color Module Level 4 specification.

[Tracking bug #536420071](https://issues.chromium.org/issues/536420071) | [ChromeStatus.com entry](https://chromestatus.com/feature/6207138742534144) | [Spec](https://www.w3.org/TR/css-color-4/#css-system-colors) | [Demo](https://kyerebo.github.io/demos/system-accent-color/index.html)

### [Background layer count independence](https://chromestatus.com/feature/5144333908049920)

Makes the computed value of the background-* longhands keep the number of comma-separated values the author specified, instead of repeating or truncating it to the background-image layer count. Repeating and truncating are used-value behavior: "The computed values of the coordinating list properties are not affected by such truncation or repetition." This feature implements the behavior defined in the [https://drafts.csswg.org/css-values-4/](https://drafts.csswg.org/css-values-4/) Appendix A.

[Tracking bug #40855581](https://issues.chromium.org/issues/40855581) | [ChromeStatus.com entry](https://chromestatus.com/feature/5144333908049920) | [Spec](https://drafts.csswg.org/css-values-4/#linked-properties)

### [CSSImportRule.styleSheet](https://chromestatus.com/feature/5123480866783232)

Returns null from CSSImportRule.styleSheet when an @import rule has no associated stylesheet, including when its supports() condition is false. This lets developers check whether a stylesheet is associated with the rule before accessing its properties.

[Tracking bug #40266154](https://issues.chromium.org/issues/40266154) | [ChromeStatus.com entry](https://chromestatus.com/feature/5123480866783232) | [Spec](https://drafts.csswg.org/cssom/#the-cssimportrule-interface)

### [Scroll snap for single-axis scroll containers](https://chromestatus.com/feature/5086608215900160)

This feature lets a single-axis scroll container (for example, one with overflow: auto clip) handle scroll snap area propagation and alignment separately for each axis.

Single-axis scroll containers are now supported ([https://chromestatus.com/feature/5067363861004288](https://chromestatus.com/feature/5067363861004288)). Without this feature, such a container captures a snap area on both axes, even the axis it can't scroll. The snap area then can't align on that axis.

With this feature, if a snap area sets alignment on both axes, the single-axis container handles only the axis it scrolls. The other axis goes up to the nearest ancestor scroll container that scrolls in that direction.

[Tracking bug #473576119](http://crbug.com/473576119) | [ChromeStatus.com entry](https://chromestatus.com/feature/5086608215900160) | [Spec](https://drafts.csswg.org/css-scroll-snap-1) | [Explainer](https://github.com/explainers-by-googlers/single-axis-scroll-snap)

## Miscellaneous

### [Add javascriptURLs option to SanitizerConfig and Sanitizer](https://chromestatus.com/feature/5169798320357376)

[https://github.com/whatwg/html/pull/12898](https://github.com/whatwg/html/pull/12898)

Sanitizer API also sanitizes javascript:-URLs, when they are used for navigation. This was originally done as a side effect of any "safe" method that uses Sanitizer, and omittted for any "unsafe" method. The HTML standard recently regularized this and made this a developer-selectable option, instead of a side-effect of a particular method.

Behaviour when the option is not used remains the same.

[ChromeStatus.com entry](https://chromestatus.com/feature/5169798320357376) | [Spec](https://github.com/whatwg/html/pull/12898) | [Docs](https://html.spec.whatwg.org/#dom-sanitizer-setjavascripturls)

### [Prerendering cross-origin iframes](https://chromestatus.com/feature/5112398709129216)

Prerenders cross-origin iframes with an opt-in response header.

Browsers will now prerender all cross-origin frames if the top-level frame's HTTP response includes the Supports-Loading-Mode: prerender-cross-origin-frames.

[Tracking bug #440387014](https://issues.chromium.org/issues/440387014) | [ChromeStatus.com entry](https://chromestatus.com/feature/5112398709129216) | [Spec](https://wicg.github.io/nav-speculation/prerendering.html) | [Explainer](https://github.com/WICG/nav-speculation/blob/main/prerendering-cross-origin-iframes.md)

### [ServiceWorker Static Routing: Distinct TypeError message for cancelled race-network-and-fetch-handler fetch() requests](https://chromestatus.com/feature/5124748525830144)

When a Service Worker matches a Static Routing rule with 'race-network-and-fetch-handler' and calls fetch(event.request) inside its fetch handler, Chromium deduplicates the network request. If that raced request is cancelled before response headers arrive (net::ERR_ABORTED)—for example, when an offline fallback timer resolves event.respondWith() first or the navigation is aborted—Chromium now rejects the fetch(event.request) promise with TypeError("The service worker race-network-and-fetch-handler request was cancelled before 'fetch()' settled.") instead of the generic TypeError("Failed to fetch"). This matches Service Worker Navigation Preload (event.preloadResponse) and allows web applications to distinguish expected pre-settlement race cancellations from genuine network errors.

Note: This is a small behavioral refinement to the already-shipped Service Worker Static Routing API with no IDL or specification changes. Because web applications may observe the updated TypeError message string, we are sending an Intent to Ship directly for web compatibility review.

[Tracking bug #584504247](https://crbug.com/584504247) | [ChromeStatus.com entry](https://chromestatus.com/feature/5124748525830144) | [Spec](https://w3c.github.io/ServiceWorker/#dom-routersourceenum-race-network-and-fetch-handler)

### [SpeechRecognitionResult Timestamps (WebSpeech API)](https://chromestatus.com/feature/5811907077472256)

The Web Speech API currently does not expose the acoustic timing bounds of recognized speech segments, making it difficult to associate transcribed text with media timelines or generate synchronized subtitle cues. We propose adding speechStartTime and speechEndTime (double, in seconds relative to stream start) attributes on the SpeechRecognitionResult interface.

[Tracking bug #528037568](https://crbug.com/528037568) | [ChromeStatus.com entry](https://chromestatus.com/feature/5811907077472256) | [Spec](https://github.com/WebAudio/web-speech-api/pull/192) | [Explainer](https://github.com/WebAudio/web-speech-api/blob/main/explainers/speech-recognition-result-timestamps.md) | [Demo](https://alan33d.github.io/web-speech-demos/live_meeting_recording_demo.html) | [Demo](https://alan33d.github.io/web-speech-demos/webrtc_caption_sync_test.html)

## Multimedia

### [MediaSession: Return Promise&lt;undefined&gt; from setMicrophoneActive() and setCameraActive()](https://chromestatus.com/feature/5188639100370944)

Updates navigator.mediaSession.setMicrophoneActive() and navigator.mediaSession.setCameraActive() to return a Promise&lt;undefined&gt; instead of undefined, matching the W3C Media Session specification. In a fully active document, the returned promise resolves with undefined; if the associated document is not fully active, it returns a promise rejected with an InvalidStateError DOMException.

[Tracking bug #576328036](https://crbug.com/576328036) | [ChromeStatus.com entry](https://chromestatus.com/feature/5188639100370944) | [Spec](https://w3c.github.io/mediasession/#dom-mediasession-setmicrophoneactive) | [Explainer](https://github.com/w3c/mediasession/pull/312) | [Demo](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setMicrophoneActive)

## Network / Connectivity

### [WebTransport Datagram readable stream type](https://chromestatus.com/feature/5148774971342848)

Adds the  WebTransportOptions.datagramsReadableType  constructor option. By default, incoming WebTransport Datagrams are exposed through a default  ReadableStream . Applications that require BYOB reading can request a readable byte stream by setting  datagramsReadableType: "bytes" .

[Tracking bug #547572475](https://issues.chromium.org/issues/547572475) | [ChromeStatus.com entry](https://chromestatus.com/feature/5148774971342848) | [Spec](https://www.w3.org/TR/webtransport/#dom-webtransportoptions-datagramsreadabletype) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md)

### [WebTransport Datagram writable streams and prioritization](https://chromestatus.com/feature/5183354944225280)

Adds the modern WebTransport Datagram sending API.

WebTransportDatagramDuplexStream.createWritable() creates independent WebTransportDatagramsWritable streams. Each writable has mutable sendGroup and sendOrder attributes for expressing relative priority among queued WebTransport data in the same send group. Chromium currently applies this ordering among Datagram writables.

The implementation also reports the negotiated maximum outgoing Datagram payload size and discards oversized writes as required by the WebTransport specification.

[Tracking bug #547572475](https://issues.chromium.org/issues/547572475) | [ChromeStatus.com entry](https://chromestatus.com/feature/5183354944225280) | [Spec](https://www.w3.org/TR/webtransport/#datagram-writable) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md#5-sending-and-receiving-datagrams)

### [WebTransport congestion control](https://chromestatus.com/feature/5180947573112832)

Adds the congestionControl constructor option and read-only attribute to WebTransport. Applications can request "default", "throughput", or "low-latency" behavior, allowing the user agent to select suitable congestion-control behavior for each session.

[Tracking bug #501268547](https://issues.chromium.org/issues/501268547) | [ChromeStatus.com entry](https://chromestatus.com/feature/5180947573112832) | [Spec](https://www.w3.org/TR/webtransport/#dom-webtransportoptions-congestioncontrol) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md)

### [WebTransport keying material export](https://chromestatus.com/feature/4860330806214656)

Adds WebTransport.exportKeyingMaterial(), which allows an application to derive cryptographic keying material bound to an established WebTransport session.

The method accepts application provided binary label and context values and a requested output length and returns a Promise&lt;Uint8Array&gt;. Chromium supports label and context values up to 255 bytes and output lengths from 1 through 4096 bytes.

For WebTransport over HTTP/3, Chromium includes the WebTransport CONNECT stream ID in the TLS exporter context. This ensures that separate WebTransport sessions derive different keying material even when they share the same underlying HTTP/3 connection.

[Tracking bug #556304550](https://issues.chromium.org/issues/556304550) | [ChromeStatus.com entry](https://chromestatus.com/feature/4860330806214656) | [Spec](https://www.w3.org/TR/webtransport/#dom-webtransport-exportkeyingmaterial) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md)

### [WebTransport receive stream](https://chromestatus.com/feature/5109912169480192)

Adds the standardized WebTransportReceiveStream interface, a ReadableStream subclass used for incoming unidirectional streams and the readable side of bidirectional streams. Its getStats() method returns per-stream byte counters: bytesReceived reports bytes received from the network, while bytesRead reports bytes delivered to the application.

[Tracking bug #568317222](https://issues.chromium.org/issues/568317222) | [ChromeStatus.com entry](https://chromestatus.com/feature/5109912169480192) | [Spec](https://w3c.github.io/webtransport/#webtransportreceivestream) | [Explainer](https://github.com/w3c/webtransport/issues/372) | [Explainer](https://github.com/w3c/webtransport/pull/395)

### [WebTransport send groups and send-stream prioritization](https://chromestatus.com/feature/5235261159112704)

WebTransport already lets sites send data through WritableStreams. This feature lets applications assign outgoing streams to send groups and use sendOrder to prioritize streams within each group. It also provides sending statistics for streams and groups while preserving WritableStream transfer behavior.

[Tracking bug #568825278](https://crbug.com/568825278) | [ChromeStatus.com entry](https://chromestatus.com/feature/5235261159112704) | [Spec](https://www.w3.org/TR/webtransport/#webtransportsendstream) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md#6-sending-video-one-stream-per-frame-or-segment-with-send-order) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md#7-sending-real-time-game-data-per-stream-with-send-order) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md#8-managing-bandwidth-with-send-groups)

### [WebTransportError API alignment and serialization](https://chromestatus.com/feature/5158277221580800)

Updates Chromium WebTransportError to match the current WebTransport specification. Adds the standard (message, options) constructor while preserving the shipped dictionary constructor for compatibility; carries the full unsigned-long stream error code end to end; and makes WebTransportError structured-clonable while preserving its message, source, and nullable error code. Serialization is enabled by default behind a writer-side runtime kill switch, while decoding remains permanently enabled for persisted values.

[Tracking bug #577073049](https://issues.chromium.org/issues/577073049) | [ChromeStatus.com entry](https://chromestatus.com/feature/5158277221580800) | [Spec](https://www.w3.org/TR/webtransport/#web-transport-error-interface) | [Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebTransportError) | [Docs](https://developer.chrome.com/docs/capabilities/web-apis/webtransport) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md)

## New origin trials

### [Web Authentication Conditional UI Passive Mode](https://chromestatus.com/feature/5068149209825280)

This is a new mode for navigator.credentials.get() when used to sign a user into a website with a passkey or a password. Some documentation refers to this new mode as 'Ambient'.

The new mode is similar to Conditional Mediation (also called Conditional UI). It can be called by a page and UI will only be shown if the user has credentials. If the user has no sign-in credentials available, the promise will never resolve.

The difference between Passive Mode and Conditional Mediation is that Passive Mode does not use autofill UI, and therefore does not require a login form be present on the page. Instead it provides the user a sign-in option as a non-modal suggestion. The intention is that the option should be clear enough that the user can recognize an opportunity for a low-friction sign-in, while unobtrusive enough that they can ignore it if they choose to.

Passive Mode and existing Conditional Mediation are compatible. Credentials can be simultaneously made available in Passive Mode UI and autofill UI with a single JavaScript call, if used on a page with a sign-in form.

[Origin trial](https://developer.chrome.com/origintrials#/view_trial/942941171980697601) | [Tracking bug #532206357](https://issues.chromium.org/issues/532206357) | [ChromeStatus.com entry](https://chromestatus.com/feature/5068149209825280) | [Spec](https://github.com/w3c/webauthn/pull/2485) | [Explainer](https://github.com/w3c/webauthn/blob/main/explainers/conditional-ui-without-autofill.md) | [Demo](https://kenrb.github.io/test/ambient/index.html)

---

Source: [ChromeStatus Chrome 159 Release Notes](https://chromestatus.com/release-notes/159). This Markdown converts the English article body. The HTML source carries a Copyright 2016 Google Inc. All Rights Reserved and [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) notice.

Release verification: [ChromiumDash Windows Stable records](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=159&num=1000) and the [official Early Stable announcement](https://chromereleases.googleblog.com/2026/11/early-stable-update-for-desktop_01707050408.html). The earliest matching Windows Stable record is 159.0.8154.13, at 18:53:23.819 UTC on November 18, 2026. The announcement confirms an Early Stable rollout of 159.0.8154.13/.14 to a small percentage of Windows and Mac users. The original Beta label and scheduled date are retained above.
