# Chrome 154

Source: [Chrome 154 Release Notes](https://developer.chrome.com/release-notes/154?hl=en)

**Attribution:** Google for Developers. Except as otherwise noted, article text is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and code samples under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0). The official HTML article was converted to Markdown.

**Stable release date:** September 22nd, 2026

Unless otherwise noted, the following changes apply to Chrome 154 stable
channel release for Android, ChromeOS, Linux, macOS, and Windows.

Want just the highlights? Check out
[New in Chrome 154](https://developer.chrome.com/blog/new-in-chrome-154).

## CSS and UI

### CSS `scroll-marker-group` modes

The `scroll-marker-group` property supports two modes that control the focus order and accessibility behavior of `::scroll-marker-group` and `::scroll-marker` following WAI-ARIA patterns:

- `links` (default): The generated `::scroll-marker-group` operates like a navigation list (`navigation` role), and `::scroll-marker` elements act as standard links (`link` role). All `::scroll-marker` elements are sequential tab stops. Activating a link marker moves focus to the target element.
- `tabs`: The generated `::scroll-marker-group` operates like a tablist (`tablist` role), `::scroll-marker` elements take on the `tab` role, and originating elements get the `tabpanel` role. Only the active `::scroll-marker` acts as a tab stop, and users navigate between markers with arrow keys. Content from inactive tabs is hidden from the accessibility tree, and focus stays on the marker when activated.

[Tracking bug #425931511](https://issues.chromium.org/issues/425931511)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5109685301673984)
|
[Spec](https://drafts.csswg.org/css-overflow-5/#scroll-marker-modes)

### CSS `text-decoration-inset`

The `text-decoration-inset` CSS property controls how far underlines, overlines, and line-through decorations are inset from or extended beyond text run edges. It supports `auto`, length, and percentage values, including one-value and two-value syntax for setting the start and end offsets. This lets you adjust decoration spacing and create reveal effects with native text decorations instead of background gradients or additional elements.

[Tracking bug #468928416](https://issues.chromium.org/issues/468928416)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5178263526834176)
|
[Spec](https://drafts.csswg.org/css-text-decor-4/#propdef-text-decoration-inset)

### Expose `CSSStyleValue` hierarchy to Worker contexts

The CSS Typed OM specification exposes the `CSSStyleValue` hierarchy to worker global scopes (`[Exposed=(Window, Worker, PaintWorklet, LayoutWorklet)]`). Previously, Blink only exposed `CSSStyleValue`, `CSSKeywordValue`, `CSSNumericValue`, `CSSUnitValue`, and `CSSUnparsedValue` to `Window` and worklets. Chrome 154 exposes these constructors in `Worker` contexts, aligning with the specification and other browser engines.

[Tracking bug #534781956](https://issues.chromium.org/issues/534781956)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5114591051907072)
|
[Spec](https://www.w3.org/TR/css-typed-om-1/#stylevalue-subclasses)

### `FontFace` `width` attribute and `font-width` descriptor

Exposes the `width` attribute on `FontFace` and the `@font-face` `font-width` descriptor as aliases for `stretch` and `font-stretch`. This aligns Chromium with the updated CSS Font Loading and CSS Fonts 4 specifications. You can inspect or initialize font face widths using `FontFace.width` and CSS `font-width` interchangeably with `stretch` and `font-stretch`.

[Tracking bug #543938492](https://issues.chromium.org/issues/543938492)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5145402365050880)
|
[Spec](https://drafts.csswg.org/css-fonts-4/#font-width-prop)

### Light dismiss improvements for popovers and dialogs

Improves and simplifies light dismiss behavior for popovers and dialogs. Light dismiss closes a popover or dialog when a user clicks outside of it. With this update, the browser uses `click` events instead of a combination of `pointerdown` and `pointerup` events to trigger light dismiss, ensuring that scrolling gestures on touchscreens and right-clicks no longer close popovers or dialogs unintentionally.

[Tracking bug #408010435](https://issues.chromium.org/issues/408010435)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6209615938322432)
|
[Spec](https://github.com/whatwg/html/pull/11536)

### Responsively-sized `<iframe>`

Lets sites opt into responsive sizing for iframes. This sizes the `<iframe>` element in the parent document to the embedded document's layout overflow sizing, avoiding scrolling in the child document.

[Tracking bug #418397278](https://issues.chromium.org/issues/418397278)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5108373464547328)
|
[Spec](https://drafts.csswg.org/css-sizing-4/#responsive-iframes)

## JavaScript

### Iterator `includes`

Implements the TC39 proposal for `Iterator.prototype.includes()`, letting you check whether an iterator yields a given value, analogous to `Array.prototype.includes()`.

[Tracking bug #504886973](https://issues.chromium.org/issues/504886973)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5205192866922496)
|
[Spec](https://tc39.es/proposal-iterator-includes)

## Network and connectivity

### Add options bag to `WebSocket` constructor

Adds support for passing an options dictionary (`WebSocketInit`) as the second argument to the `WebSocket` constructor. The options dictionary supports a `protocols` option, letting you specify subprotocols (mirroring the existing `protocols` argument), and serves as an extension point for future options.

For example, instead of `new WebSocket("wss://example.com:8080", "soap")`, you can pass `new WebSocket("wss://example.com:8080", { protocols: "soap" })`.

[Tracking bug #542670554](https://issues.chromium.org/issues/542670554)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5080055102439424)
|
[Spec](https://github.com/whatwg/websockets/pull/76)

### Support `targetAddressSpace` option for WebSockets

Adds support for passing a `targetAddressSpace` option in the `WebSocket` constructor (`new WebSocket("ws://local-server.example", { targetAddressSpace: "local" })`). This lets you specify that a WebSocket connection to a public hostname should be treated as going to a `"local"` or `"loopback"` destination, matching existing support in the Fetch API. This provides a way to bypass mixed content restrictions when connecting to local servers that don't yet support HTTPS, provided the user grants local network permission and the hostname resolves to a local IP address.

[Tracking bug #517413738](https://issues.chromium.org/issues/517413738)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/4779920606756864)
|
[Spec](https://github.com/WICG/local-network-access/pull/125)

### Fetch API: Forward reason from `AbortController` to fetch `Response`

Exposes the abort reason, if one is provided, to the methods of the `Response` object and its `ReadableStream`, rather than only the `fetch` promise. This aligns Chrome with the Fetch standard by exposing the developer-supplied abort reason consistently.

[Tracking bug #502133195](https://issues.chromium.org/issues/502133195)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5158507786665984)
|
[Spec](https://fetch.spec.whatwg.org)

### CORS enforcement for Background Fetch

The Background Fetch API enforces Cross-Origin Resource Sharing (CORS). This aligns Chromium's implementation with the Background Fetch specification and ensures that Background Fetch requests are subject to the same security policies as regular `fetch()` requests, preventing sites from bypassing CORS and other security policy checks.

[ChromeStatus.com entry](https://chromestatus.com/feature/6210300985606144)
|
[Spec](https://wicg.github.io/background-fetch)

### Local Network Access restrictions for Background Fetch

Background Fetch requests require that the service worker's origin has the necessary Local Network Access (LNA) permission to send requests to local or loopback servers. This aligns Chromium with the Background Fetch specification and prevents sites from bypassing LNA checks by using Background Fetch instead of regular `fetch()`. Enterprises can manage this behavior using existing LNA enterprise policies (`LocalNetworkAccessRestrictionsTemporaryOptOut`, `LocalNetworkAccessAllowedForUrls`, `LoopbackNetworkAllowedForUrls`, `LocalNetworkAccessPermissionsPolicyDefaultEnabled`, and `LocalNetworkAccessIpAddressSpaceOverrides`).

[Tracking bug #455486148](https://issues.chromium.org/issues/455486148)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6225598451154944)
|
[Spec](https://wicg.github.io/background-fetch)

## Privacy and security

### Ask before HTTP on by default

Chrome prompts users by default when they connect to a site over an insecure (`http`) connection. Administrators can control this default behavior using the [`HttpsOnlyMode`](https://chromeenterprise.google/policies/#HttpsOnlyMode) enterprise policy.

[ChromeStatus.com entry](https://chromestatus.com/feature/5143933628841984)

### Secure Payment Confirmation: Locale validation

Updates the Secure Payment Confirmation `locale` data field to return a `NotSupportedError` `DOMException` if none of the language tags provided in the field match the language used by the Secure Payment Confirmation dialog. If the field isn't set or is empty, this validation is skipped. This helps you match the language of the data supplied to Secure Payment Confirmation with the dialog.

[Tracking bug #535278878](https://issues.chromium.org/issues/535278878)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5126146013396992)
|
[Spec](https://w3c.github.io/secure-payment-confirmation/#dom-securepaymentconfirmationrequest-locale)

## Isolated Web Apps (IWA)

### Window Shape API

The Window Shape API lets [Isolated Web Apps](https://chromeos.dev/en/web/isolated-web-apps) on an allowlist on ChromeOS define a custom window shape. By supporting non-rectangular and non-contiguous window layouts, you can create widgets, floating panels, and overlays that match the appearance of native applications. The `window.setShape()` API requires an `unframed` display mode window and the `window-management` permission. Administrators can manage this feature with the `DefaultWindowManagementSetting`, `WindowManagementAllowedForUrls`, and `WindowManagementBlockedForUrls` enterprise policies.

[ChromeStatus.com entry](https://chromestatus.com/feature/5075144470036480)
|
[Spec](https://explainers-by-googlers.github.io/chromeos-iwa-apis)

## Origin trials

### Private Verification Tokens

Private Verification Tokens (PVT) is a low-entropy mechanism that lets websites transfer the trust that users have established in regular browsing into private browsing mode, reducing user friction from CAPTCHAs and other challenges. Websites issue PVTs during a regular browsing session and redeem them in private browsing mode.

[Tracking bug #500396188](https://issues.chromium.org/issues/500396188)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6210457816924160)
