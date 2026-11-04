# Chrome 158 Release Notes

Preview

Scheduled Stable Release: November 17, 2026 (Currently on Beta channel)

## CSS

### [CSS Custom Highlight Universal Selector ::highlight(*)](https://chromestatus.com/feature/5174965228929024)

Introduces a universal selector for custom highlights, ::highlight(*), which matches the highlight pseudo-elements of all custom highlights regardless of their name.

The * argument contributes zero specificity, so its declarations act as a base style that rules naming a specific highlight override through the cascade.

[Tracking bug #408003366](https://issues.chromium.org/issues/408003366) | [ChromeStatus.com entry](https://chromestatus.com/feature/5174965228929024) | [Spec](https://drafts.csswg.org/css-pseudo-4/#selectordef-highlight-highlight-name-selector)

### [CSS flow-start and flow-end alignment keywords](https://chromestatus.com/feature/5069051687731200)

Introduce the flow-start/end keywords as value aliases for the existing flex-start/end keywords as resolved in the CSSWG. These are needed for alignment in the case of placement reversals.

flow-start in CSS Grid-Lanes would indicate the starting edge of the container at which placement begins, which is useful in the case where placement is reversed (`fill-reverse`, `track-reverse`, discussed in this CSSWG issue: [css-grid-3][masonry] item-flow row vs. column in masonry layouts · Issue #12803 · w3c/csswg-drafts).  Because these are acting as value aliases, we expect flex-start/end to follow the logical directions in Grid Lanes, as well, which will expand the definition of these keywords from only applying special behavior in flexbox to applying to any layout mode whose logical start/end is different from its physical start/end.

For serialization, if either flex-start/end  or flow-start/end  is used, the returned serialized value should be flow-start/end.

[Tracking bug #555299635](https://issues.chromium.org/issues/555299635) | [ChromeStatus.com entry](https://chromestatus.com/feature/5069051687731200) | [Spec](https://github.com/w3c/csswg-drafts/pull/14539)

### [object-fit and object-position apply to SVG documents in &lt;object&gt; and &lt;embed&gt;](https://chromestatus.com/feature/4886345347629056)

SVG documents loaded through &lt;object&gt; or &lt;embed&gt; are sized and positioned inside the element's content box according to the CSS object-fit and object-position properties, the same way &lt;img&gt; content is.

Previously Chrome ignored both properties for embedded SVG documents and always stretched the document viewport to the whole content box.

[Tracking bug #41302806](https://issues.chromium.org/41302806) | [ChromeStatus.com entry](https://chromestatus.com/feature/4886345347629056) | [Spec](https://html.spec.whatwg.org/multipage/rendering.html#embedded-content-rendering-rules)

## Capabilities (Fugu)

### [HTML install element](https://chromestatus.com/feature/5152834368700416)

Chrome can now trigger a request for the browser to install a web app, given a manifest URL and optional manifest ID. The `<install>` element enables cross-origin web app installation without JavaScript and provides a better developer experience than handling `beforeinstallprompt` events. The element is launching in parallel with [Web Install API](https://chromeenterprise.google/resources/release-notes/?ver=158&featId=5183481574850560), specifically the `navigator.install()` method, the imperative entry point to the same installation capability.

Admins can control this feature in either of two ways:

1. With enterprise policy, [WebAppInstallByUserEnabled](https://chromeenterprise.google/policies/#WebAppInstallByUserEnabled), admins can disable user web app installs in general, including installs initiated via `navigator.install()` and &lt;install&gt;.

1. With permissions policy, [web-app-installation](https://www.w3.org/TR/permissions-policy/), admins can allow or disallow use of this feature on origins that the enterprise controls (for example, internal sites or iframes).

[Tracking bug #454827186](https://issues.chromium.org/issues/454827186) | [ChromeStatus.com entry](https://chromestatus.com/feature/5152834368700416) | [Spec](https://wicg.github.io/install-element) | [Docs](https://docs.google.com/document/d/1rGvLhD4SR8Y9M1wVmqgyesPNkbZGU7HOqlttjEFJ5Vo/edit?tab=t.tmx19oox759l#heading=h.j3tt49hqiuck) | [Explainer](https://aka.ms/installelement) | [Demo](https://microsoftedge.github.io/Demos/pwa-install-element) | [Demo](https://kbhlee2121.github.io/pwa/web-install-manifest-url/only-elements.html)

### [Web Install API](https://chromestatus.com/feature/5183481574850560)

Starting in Chrome 158, the new Web Install API allows websites to prompt users to install a web app, given a manifest URL and optional manifest ID. The `navigator.install()` method enables cross-origin web app installation and provides a better developer experience than handling `beforeinstallprompt` events. This API is launching in parallel with the [HTML &lt;install&gt; element](https://chromeenterprise.google/resources/release-notes/?ver=158&featId=5152834368700416), a declarative entry point to the same installation capability.

Admins can control this in either of two ways:

1. With the enterprise policy, [WebAppInstallByUserEnabled](https://chromeenterprise.google/policies/#WebAppInstallByUserEnabled), to disable user web app installs in general, including installs initiated via `navigator.install()` and `<install>`.

1. With permissions policy, [web-app-installation](https://www.w3.org/TR/permissions-policy/), to allow or disallow use of this feature on origins that the enterprise controls (for example, internal sites or iframes).

[Tracking bug #333795265](https://issues.chromium.org/issues/333795265) | [ChromeStatus.com entry](https://chromestatus.com/feature/5183481574850560) | [Spec](https://wicg.github.io/install-element) | [Docs](https://docs.google.com/document/d/12nSXJLm8mW0gWZ_yjlXfrV8r9gwJliVt4WVa-209-KA/edit?tab=t.0) | [Explainer](https://aka.ms/webinstall) | [Demo](https://microsoftedge.github.io/Demos/pwa-install-api) | [Demo](https://kbhlee2121.github.io/pwa/web-install-manifest-url/index.html)

## Multimedia

### [Media element pseudo-classes](https://chromestatus.com/feature/5068277495758848)

The :playing, :paused, :seeking, :buffering, :stalled, :muted, and :volume-locked CSS pseudo-classes match &lt;audio&gt; and &lt;video&gt; elements based on their state.

This is one of the focus areas in [https://wpt.fyi/interop-2026](https://wpt.fyi/interop-2026).

[Tracking bug #40246121](https://crbug.com/40246121) | [ChromeStatus.com entry](https://chromestatus.com/feature/5068277495758848) | [Spec](https://html.spec.whatwg.org/multipage/semantics-other.html#pseudo-classes)

### [OfflineAudioContext incremental rendering](https://chromestatus.com/feature/5109900936085504)

This feature adds an incremental rendering mechanism to OfflineAudioContext so that the audio graph data can be incrementally processed rather than allocating the whole audio buffer up front. By incrementally delivering the data using data chunks, there is no need to have high memory requirements for the user's machine when processing high amounts of data.

[Tracking bug #530596178](https://issues.chromium.org/issues/530596178) | [ChromeStatus.com entry](https://chromestatus.com/feature/5109900936085504) | [Spec](https://webaudio.github.io/web-audio-api/#dom-offlineaudiocontext-startrendering) | [Explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/OfflineAudioContext/explainer.md) | [Demo](https://gabrielsanbrito.github.io/demo_pages/oac-incremental-rendering)

## Miscellaneous

### [Permissions Policy: focus-without-user-activation](https://chromestatus.com/feature/5179186249465856)

Gives embedders control over programmatic focus from embedded content via the `focus-without-user-activation` permissions policy. When the policy is denied for the initiating frame, programmatic focus changes (from `element.focus()`, `autofocus`, `window.focus()`, and the focusing steps for dialogs and popovers) are blocked unless that frame has transient user activation or focus is already within its subtree. This does not prevent dialogs or popovers from opening. User-initiated focus such as clicking or tabbing is never affected. Chromium's existing restriction on autofocus in cross-origin iframes is unchanged: the policy can further restrict autofocus, but allowing it does not enable autofocus in a cross-origin frame.

The policy can be set via a `Permissions-Policy` HTTP response header or the iframe `allow` attribute. Focus delegation is supported: a parent frame that has focus can programmatically pass focus to a child iframe, even if the child has the policy denied, and once a frame has focus it can move focus within its own subtree.

[Tracking bug #40095111](https://crbug.com/40095111) | [ChromeStatus.com entry](https://chromestatus.com/feature/5179186249465856) | [Spec](https://html.spec.whatwg.org/#focus-without-user-activation-feature) | [Explainer](https://github.com/ffiori/webappsec-permissions-policy/blob/focus-without-user-activation-explainer/policies/focus-without-user-activation.md)

### [SVG textPath side attribute](https://chromestatus.com/feature/5422782593761280)

Allows authors to choose which side of a path SVG text follows using the side attribute on the textPath element. Setting side="right" effectively reverses the path direction for text layout, making it easy to place text inside or outside a circular path without duplicating or manually reversing the path data.

[Tracking bug #40362379](https://issues.chromium.org/issues/40362379) | [ChromeStatus.com entry](https://chromestatus.com/feature/5422782593761280) | [Spec](https://w3c.github.io/svgwg/svg2-draft/text.html#TextPathElementSideAttribute)

### [closest-corner and farthest-corner radii for circle() and ellipse() basic shapes](https://chromestatus.com/feature/5100672946143232)

The circle() and ellipse() CSS basic-shape functions accept the closest-corner and farthest-corner radius keywords, in addition to the existing closest-side and farthest-side. These keywords resolve to the Euclidean distance from the shape center to the nearest or farthest corner of the reference box, matching the long-standing behavior of radial-gradient(). They work in clip-path, shape-outside, and offset-path, so the same shape syntax accepted by gradients now works for shapes.

CL: [https://chromium-review.googlesource.com/c/chromium/src/+/7767079](https://chromium-review.googlesource.com/c/chromium/src/+/7767079)

[Tracking bug #361617757](https://crbug.com/361617757) | [ChromeStatus.com entry](https://chromestatus.com/feature/5100672946143232) | [Spec](https://drafts.csswg.org/css-shapes-1/#basic-shape-functions)

## Isolated Web Apps

### [Source Specific Multicast for Direct Sockets API](https://chromestatus.com/feature/6208452397498368)

Adds Source-Specific Multicast (SSM) support to the Direct Sockets API, allowing Isolated Web Apps to optionally specify a source address when joining multicast groups to receive UDP packets only from that source. Without a source address, joinGroup() uses Any-Source Multicast (ASM), which receives packets from any source sending to the group. SSM is essential to using multicast outside of private networks, simplifying packet routing, and filtering traffic at the network level by source address, which mitigates spoofing and denial-of-service attacks.

[Tracking bug #461262401](https://issues.chromium.org/issues/461262401) | [ChromeStatus.com entry](https://chromestatus.com/feature/6208452397498368) | [Spec](https://wicg.github.io/direct-sockets/#dom-multicastgroupoptions-sourceaddress) | [Explainer](https://github.com/WICG/direct-sockets/blob/main/docs/multicast-explainer.md) | [Demo](https://blockcast.network/live) | [Demo](https://chromewebstore.google.com/detail/multicast-gateway-beacon/djikmiecejmojgcglkfmihhkfgekjlaj)

## Device

### [Support for WebHID](https://chromestatus.com/feature/5172464636133376)

The [WebHID API](https://developer.chrome.com/docs/extensions/how-to/web-platform/webhid) enables web applications to interact with Human Interface Devices (HIDs) over USB and Bluetooth beyond standard system input mappings (such as mice, keyboards, touchscreens, and standard gamepads). Web applications can request user permission to connect to HID devices, send and receive input, output, and feature reports, and inspect report descriptors. WebHID shipped on [desktop platforms](https://developer.chrome.com/docs/capabilities/web-apis/hid-examples) (Windows, macOS, Linux, and ChromeOS) in Chrome 89.

Chrome 158 brings the existing WebHID API to Chrome on Android (relying on new OS support in Android 17 / API level 37 and later) with no changes to the web-exposed API surface.

Popular uses today include customizing mechanical keyboards, keypads, and gaming mice, calibrating gamepads, and integrating hardware headset call controls in call centers.

WebView is not supported, as it does not have a device chooser UI or permissions UX controls.

This feature can be controlled using the following enterprise policies:

- [DefaultWebHidGuardSetting](https://chromeenterprise.google/policies/#DefaultWebHidGuardSetting)

- [WebHidAllowAllDevicesForUrls](https://chromeenterprise.google/policies/#WebHidAllowAllDevicesForUrls)

- [WebHidAllowDevicesForUrls](https://chromeenterprise.google/policies/#WebHidAllowDevicesForUrls)

- [WebHidAllowDevicesWithHidUsagesForUrls](https://chromeenterprise.google/policies/#WebHidAllowDevicesWithHidUsagesForUrls)

- [WebHidAskForUrls](https://chromeenterprise.google/policies/#WebHidAskForUrls)

- [WebHidBlockedForUrls](https://chromeenterprise.google/policies/#WebHidBlockedForUrls)

For more details, see [Set ChromeOS devices policies](https://support.google.com/chrome/a/answer/1375678) in the Chrome Enterprise and Education Help Center.

[Tracking bug #40628009](http://crbug.com/40628009) | [ChromeStatus.com entry](https://chromestatus.com/feature/5172464636133376) | [Spec](https://hid.spec.whatwg.org) | [Docs](https://web.dev/hid/) | [Docs](https://web.dev/hid-examples/) | [Explainer](https://github.com/whatwg/hid/blob/main/EXPLAINER.md)

## Network / Connectivity

### [WebTransport anticipated concurrent incoming streams](https://chromestatus.com/feature/5089961022980096)

Allows WebTransport applications to indicate how many incoming streams they expect to have open at once. Constructor hints configure the initial QUIC stream allowance, reducing the risk that a server that needs high stream concurrency is blocked by the initial stream limit.

[Tracking bug #565837025](https://issues.chromium.org/issues/565837025) | [ChromeStatus.com entry](https://chromestatus.com/feature/5089961022980096) | [Spec](https://w3c.github.io/webtransport/#web-transport-configuration) | [Explainer](https://github.com/w3c/webtransport/issues/544) | [Explainer](https://github.com/w3c/webtransport/pull/574)

### [WebTransport congestion control](https://chromestatus.com/feature/5180947573112832)

Adds the congestionControl constructor option and read-only attribute to WebTransport. Applications can request "default", "throughput", or "low-latency" behavior, allowing the user agent to select suitable congestion-control behavior for each session.

[Tracking bug #501268547](https://issues.chromium.org/issues/501268547) | [ChromeStatus.com entry](https://chromestatus.com/feature/5180947573112832) | [Spec](https://www.w3.org/TR/webtransport/#dom-webtransportoptions-congestioncontrol) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md)

### [WebTransport draining](https://chromestatus.com/feature/6427766428925952)

WebTransport.draining is a promise that resolves when the server indicates that the WebTransport session will be gracefully retired. Applications can use this signal to establish a replacement session while existing streams and the current session remain usable.

[Tracking bug #564353368](https://issues.chromium.org/issues/564353368) | [ChromeStatus.com entry](https://chromestatus.com/feature/6427766428925952) | [Spec](https://w3c.github.io/webtransport/#dom-webtransport-draining) | [Docs](https://github.com/w3c/webtransport/blob/main/explainer.md#11-handling-session-draining)

### [WebTransport keying material export](https://chromestatus.com/feature/4860330806214656)

Adds WebTransport.exportKeyingMaterial(), which allows an application to derive cryptographic keying material bound to an established WebTransport session.

The method accepts application provided binary label and context values and a requested output length and returns a Promise&lt;Uint8Array&gt;. Chromium supports label and context values up to 255 bytes and output lengths from 1 through 4096 bytes.

For WebTransport over HTTP/3, Chromium includes the WebTransport CONNECT stream ID in the TLS exporter context. This ensures that separate WebTransport sessions derive different keying material even when they share the same underlying HTTP/3 connection.

[Tracking bug #556304550](https://issues.chromium.org/issues/556304550) | [ChromeStatus.com entry](https://chromestatus.com/feature/4860330806214656) | [Spec](https://www.w3.org/TR/webtransport/#dom-webtransport-exportkeyingmaterial) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md)

### [WebTransport receive stream](https://chromestatus.com/feature/5109912169480192)

Adds the standardized WebTransportReceiveStream interface, a ReadableStream subclass used for incoming unidirectional streams and the readable side of bidirectional streams. Its getStats() method returns per-stream byte counters: bytesReceived reports bytes received from the network, while bytesRead reports bytes delivered to the application.

[Tracking bug #568317222](https://issues.chromium.org/issues/568317222) | [ChromeStatus.com entry](https://chromestatus.com/feature/5109912169480192) | [Spec](https://w3c.github.io/webtransport/#webtransportreceivestream) | [Explainer](https://github.com/w3c/webtransport/issues/372) | [Explainer](https://github.com/w3c/webtransport/pull/395)

### [WebTransport reliability attributes](https://chromestatus.com/feature/5094058497277952)

Adds the WebTransport.reliability instance attribute and static WebTransport.supportsReliableOnly attribute. These APIs indicate whether the user agent supports WebTransport over exclusively reliable connections and whether an established session supports unreliable transport such as datagrams.

In Chromium, reliability initially returns "pending" and changes to "supports-unreliable" after an HTTP/3 WebTransport connection is established.  Since Chromium does not currently support HTTP/2 fallback,  WebTransport.supportsReliableOnly returns false; any successfully established session uses HTTP/3 and supports unreliable datagrams.

[Tracking bug #545636884](https://issues.chromium.org/issues/545636884) | [ChromeStatus.com entry](https://chromestatus.com/feature/5094058497277952) | [Spec](https://www.w3.org/TR/webtransport/#dom-webtransport-reliability) | [Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md#transport-modes)

---

Source: [ChromeStatus Chrome 158 Release Notes](https://chromestatus.com/release-notes/158). This Markdown faithfully converts the English page body; navigation and copy-link controls are omitted. The page source carries Copyright 2016 Google Inc. All Rights Reserved and an [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) notice.

Release verification: [ChromiumDash Windows Stable records](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=158&num=1000) and the [official Early Stable announcement](https://chromereleases.googleblog.com/2026/11/early-stable-update-for-desktop.html). The earliest matching actual Stable record is 158.0.8127.18, published on 2026-11-04 (UTC). The announcement confirms an Early Stable rollout to a small percentage of Windows users, with Mac coming later. The article's Beta channel label and scheduled date are retained above and are not used as publication evidence.
