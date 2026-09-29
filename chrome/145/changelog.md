# Chrome 145

Source: [Chrome 145 Release Notes](https://developer.chrome.com/release-notes/145?hl=en)

**Attribution:** Google for Developers. Except as otherwise noted, article text is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and code samples under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0). The official HTML article was converted to Markdown.

**Stable release date:** February 10th, 2026

Unless otherwise noted, the following changes apply to Chrome 145 stable
channel release for Android, ChromeOS, Linux, macOS, and Windows.

Want just the highlights? Check out
[New in Chrome 145](https://developer.chrome.com/blog/new-in-chrome-145).

## CSS and UI

### Add support for the `text-justify` CSS property

You can control how text is justified when `text-align: justify` is applied by
using the `text-justify` property. For example, you can force justification by
expanding inter-character space even in English text.

[Tracking bug #40321528](https://issues.chromium.org/issues/40321528)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5079678972985344)
|
[Spec](https://www.w3.org/TR/css-text-3/#text-justify-property)

### Enable percentage values for CSS `letter-spacing` and `word-spacing` properties

Enable percentage values for the `letter-spacing` and `word-spacing` CSS
properties, as defined in the CSS Text Module Level 4 specification. Percentage
values are calculated relative to the advance measure of the space character
(`U+0020`). This provides you with more robust and flexible control over
typography, particularly in responsive designs where text spacing needs to adapt
to different viewports and font sizes.

[Tracking bug #327740939](https://issues.chromium.org/issues/327740939)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5106867491700736)
|
[Spec](https://www.w3.org/TR/css-text-4/#propdef-letter-spacing)

### Refine border-radius shadow edge computation for high `border-radius`

This change ensures that shadows and clip boundaries on near-circular elements
(where `border-radius` is close to 50%) precisely match the visual contour of
the curved edge.

This provides a more consistent rendering of complex rounded shapes, eliminating
visual discrepancies for high radius values. The `border-radius` adjustment
factor, which ensures corners appear sharp for small radii, is progressively
dampened as the radius value approaches 50%.

This also applies to non-round contours (using `corner-shape`), which now use
the same radius adjustment mechanism.

[Tracking bug #448651073](https://issues.chromium.org/issues/448651073)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5176753681203200)
|
[Spec](https://drafts.csswg.org/css-backgrounds-3/#corner-shaping)

### Column wrapping for multicol

Add support for the `column-wrap` and `column-height` CSS properties, from
multicol Level 2.

This enables vertical column layout, or even 2D column layout. Columns can have
an explicit constrained height, rather than being derived from the `content-box`
height of the multicol container. They wrap to a new row of columns when all
columns have been filled for one row, instead of creating overflowing columns in
the inline direction.

[Tracking bug #403183884](https://issues.chromium.org/issues/403183884)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5176206485618688)
|
[Spec](https://drafts.csswg.org/css-multicol-2)

### Expose `onanimationcancel` event to `GlobalEventHandlers`

The CSS Animations Level 1 extends the `GlobalEventHandlers` interface defined
in the HTML specification, declaring four new event handlers:
`onanimationstart`, `onanimationiteration`, `onanimationend`, and
`onanimationcancel`. Only the `onanimationcancel` event handler has been missing
from the `GlobalEventHandlers` IDL.

[Tracking bug #464010037](https://issues.chromium.org/issues/464010037)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5160464445210624)
|
[Spec](https://drafts.csswg.org/css-animations/#interface-globaleventhandlers)

### Customizable select listbox

This extends customizable select support to the listbox rendering mode,
including single-select and multi-select in listbox mode.

The listbox rendering mode renders the `select` element in-flow or in the page,
rather than with a separate button and popup. You can opt into listbox rendering
mode across platforms using the `multiple` or `size` attributes, for example,
`<select multiple>` or `<select size=4>`. When the `appearance: base-select` CSS
property is applied to the `select` element with these attributes, it has
improved rendering and input behavior.

This does not support customizable `select` for the multi-select popup, which
will be supported later. You must set the following attributes to get a
multi-select popup: `<select multiple size=1>`.

[Tracking bug #357649033](https://issues.chromium.org/issues/357649033)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6222145025867776)
|
[Spec](https://github.com/whatwg/html/pull/11758)

### The `focusVisible` option on `focus`

When calling the `focus()` method, you can supply a `focusVisible` boolean in
the `FocusOptions` dictionary. When true, a focus ring is always painted around
the newly-focused element, and it matches the `:focus-visible` pseudo-class.
When false, the focus ring is not painted, and `:focus-visible` does not match.
When missing, the user agent makes its own determination as to whether the focus
ring should be painted, and the `:focus-visible` pseudo-class matches
accordingly.

[Tracking bug #462191849](https://issues.chromium.org/issues/462191849)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5612989944299520)
|
[Spec](https://html.spec.whatwg.org/#dom-focusoptions-focusvisible)

### Enable monochrome emoji rendering in forced colors mode.

This change updates Chromium's emoji rendering behavior in Forced Colors Mode.
During computed-value resolution, emoji whose `font-variant-emoji` value
computes to `normal` or `unicode` are rendered using their monochrome glyphs
when available.

Chromium therefore suppresses color emoji rendering, which ensures emojis fully
participate in the Forced Colors Mode pipeline and respect system high-contrast
colors. Behavior outside Forced Colors Mode is unchanged.

[Tracking bug #420857717](https://issues.chromium.org/issues/420857717)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5861138256494592)
|
[Spec](https://drafts.csswg.org/css-color-adjust-1/#forced-colors-properties)

### Overscroll effect on non-root scrollers

This shows elastic overscroll effects on non-root scroll containers. When a
nested scrollable element reaches its scroll boundary, the overscroll affordance
applies to that element instead of only the root scroller. This reduces the need
for custom JavaScript workarounds and can be controlled per element with
`overscroll-behavior`.

[Tracking bug #41102897](https://issues.chromium.org/issues/41102897)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5195768556290048)
|
[Spec](https://www.w3.org/TR/css-overscroll-1/#overscroll-behavior-properties)

## Capabilities

### Show true window position on Android

Chrome on Android accurately reports the browser window's position and size
using `window.screenX`, `window.screenY`, `window.outerWidth`, and
`window.outerHeight`.

Chrome previously incorrectly assumed that all browser windows on Android start
at coordinates (0, 0). This assumption is inaccurate for Android tablets that
use freeform windowing mode. Websites always received 0 when querying the
window's on-screen position using `window.screenX` and `window.screenY`. These
fields store the coordinates of the window's top-left corner in global work area
coordinate space.

Moreover, Chrome on Android incorrectly assumed that outer dimensions of the
browser window are equal to the inner dimensions of the website viewport.

`window.screenX` and `window.screenY` have aliases: `window.screenLeft` and
`window.screenTop`.

[Tracking bug #417632037](https://issues.chromium.org/issues/417632037)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5164958878531584)
|
[Spec](https://www.w3.org/TR/cssom-view-1/#dom-window-screenx)

## JavaScript

### Upsert

This is an ECMAScript proposal for `Map.prototype.getOrInsert`,
`Map.prototype.getOrInsertComputed`, `WeakMap.prototype.getOrInsert`, and
`WeakMap.prototype.getOrInsertComputed`.

[Tracking bug #434977728](https://issues.chromium.org/issues/434977728)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5201653661827072)
|
[Spec](https://github.com/tc39/proposal-upsert)

### Crash Reporting key-value API

A new key-value API, `window.crashReport`, is backed by a per-Document map
holding data that Chrome appends to crash reports.

The data placed in this API's backing map is sent in the `CrashReportBody` if
any renderer process crashes are incurred by the site. This lets you debug what
specific state in your application might be causing a given crash.

[Tracking bug #400432195](https://issues.chromium.org/issues/400432195)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6228675846209536)
|
[Spec](https://github.com/WICG/crash-reporting/pull/37)

### Reduced User-Agent strings by default

Starting in Chrome 145, Chrome removes the **UserAgentReduction** policy. This
policy was available to control whether Chrome sent a reduced or full User-Agent
string.

To enhance user privacy and reduce passive tracking capabilities, Chrome began
reducing the information contained in the User-Agent header by default in Chrome
version 110. The **UserAgentReduction** policy was provided as a temporary
measure for enterprises to manage this transition.

The recommended mechanism for websites to access browser and device information
is User-Agent Client Hints (UA-CH). UA-CH requires websites to actively request
specific information, which is a more privacy-preserving approach than the
legacy User-Agent string. For more information, see the web.dev article,
[Migrate to User-Agent Client Hints](https://web.dev/articles/migrate-to-ua-ch).

From Chrome 145 onwards, the **UserAgentReduction** policy has no effect. Chrome
sends a reduced User-Agent string by default. Systems or applications that
relied on this policy to receive the full (legacy) User-Agent string might no
longer receive the detailed information they expect.

[ChromeStatus.com entry](https://chromestatus.com/feature/6224706757853184)

### Navigation API: expose destination in navigation.transition

`NavigationTransition` has a `from` property, exposing the old URL of the
navigation. Exposing `to` (a `NavigationDestination`) completes this. It is
especially useful when using precommit handlers, as during precommit the current
URL has not yet switched to the destination.

`navigation.transition` is only exposed for intercepted navigations—which means
same-origin document-initiated navigations.

[Tracking bug #447171238](https://issues.chromium.org/issues/447171238)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6008183302782976)
|
[Spec](https://html.spec.whatwg.org/#dom-navigationtransition-to)

### Secure Payment Confirmation: Browser Bound Keys

This adds an additional cryptographic signature over Secure Payment Confirmation
assertions and credential creation. The corresponding private key is not synced
across devices. This helps you meet requirements for device binding for payment
transactions.

[Tracking bug #377278827](https://issues.chromium.org/issues/377278827)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5106102997614592)
|
[Spec](https://w3c.github.io/secure-payment-confirmation/#sctn-browser-bound-key-store)

### Secure Payment Confirmation: UX Refresh

Updates the UX elements for the SPC dialog on Android Chrome.

In addition to UX presentation, the following are added:

- Merchants can provide an optional list of payment entity logos related to
  the payment that are displayed in the UX.
- Different output states are returned to the merchant depending on whether
  the user wants to continue the transaction without SPC or to cancel the
  transaction. Only a single output state is sent for both cases.
- A new payment detail label field is added to the payment instrument so the
  text is presented across two lines in SPC.

[Tracking bug #405173922](https://issues.chromium.org/issues/405173922)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5206050462236672)
|
[Spec](https://w3c.github.io/secure-payment-confirmation)

### Cookie Store API `maxAge` attribute

You can specify a `maxAge` when setting a cookie with the `Cookie Store API`.

Cookie expiry time is already configurable using the `expires` attribute, but
`maxAge` provides a more idiomatic option and aligns the `Cookie Store API` with
the options provided by `document.cookie` and the `Set-Cookie` HTTP Header.

[Tracking bug #430926231](https://issues.chromium.org/issues/430926231)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5190778418757632)
|
[Spec](https://github.com/whatwg/cookiestore/pull/292)

### InputEvent types for deletion commands on non-collapsed selections

This reports accurate `inputType` values for deletion keyboard shortcuts on
selected text. When deletion commands like `Ctrl+Backspace` or `Ctrl+Delete` are
used with selected text in `contenteditable` elements, the `beforeinput` and
`input` events report `deleteContentBackward` or `deleteContentForward` instead
of `deleteWordBackward` or `deleteWordForward`. This lets you correctly
understand what editing operation occurred and implement reliable undo, redo, or
custom editing behaviors.

[Tracking bug #41423062](https://issues.chromium.org/issues/41423062)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5173317243895808)
|
[Spec](https://w3c.github.io/input-events/#interface-InputEvent-Attributes)

### Sticky activation for the `clipboardchange` event

This requires sticky user activation or `clipboard-read` permission to fire
`clipboardchange` events, preventing unauthorized clipboard monitoring.

The `clipboardchange` event is relatively new (Chrome 144), and this has minimal
web-facing change. In most cases, sticky user activation or `clipboard-read`
permission is already present where clipboard monitoring occurs (for example, in
remote desktop clients).

[Tracking bug #468821937](https://issues.chromium.org/issues/468821937)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5163741220044800)
|
[Spec](https://www.w3.org/TR/clipboard-apis/#clipboard-event-clipboardchange)

## Multimedia

### Expose `rtpTimestamp` from WebRTC video frames with `VideoFrame.metadata()`

Adds a `VideoFrame.metadata()` method that returns a dictionary containing the
`rtpTimestamp` field, if the underlying `VideoFrame` has this field in its
native metadata. An empty dictionary is returned otherwise. Only video frames
originating from WebRTC sources have the `rtpTimestamp` metadata attached.

Additional metadata fields are already present in the native implementation and
might be exposed to JavaScript over time, as outlined in the proposed spec.

[ChromeStatus.com entry](https://chromestatus.com/feature/5186046555586560)
|
[Spec](https://www.w3.org/TR/webcodecs-video-frame-metadata-registry/#dom-videoframemetadata)

## Storage

### IndexedDB: SQLite backend (in-memory contexts)

Chromium's `IndexedDB` implementation has been rewritten on top of SQLite, to
replace the previous implementation that uses a hybrid of `LevelDB` and flat
files. There is no change to the Web API.

This improves reliability and, to a lesser extent, performance.

This is applied only to in-memory contexts such as Incognito mode in Chromium
and Google Chrome. This limits the impact of any new bugs and defers the need to
migrate existing data persisted to disk.

[Tracking bug #436880911](https://issues.chromium.org/issues/436880911)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5126896685809664)
|
[Spec](https://www.w3.org/TR/IndexedDB)

## Performance

### Let web applications understand bimodal performance timings

A new `confidence` field on the `PerformanceNavigationTiming` object lets you
discern whether the navigation timings are representative for your web
application.

[Tracking bug #1413848](https://issues.chromium.org/issues/1413848)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5186950448283648)
|
[Spec](https://w3c.github.io/navigation-timing/#sec-performance-timing-confidence)

### Add `presentationTime` and `paintTime` to performance entries

This exposes `paintTime` and `presentationTime` in element timing, LCP, long
animation frames, and paint timing.

`paintTime` means the time when the rendering phase ended and the browser
started the paint phase. `presentationTime` means the time when the "pixels
reached the screen," which is somewhat implementation-defined.

This feature entry omits event timing, which is done separately.

[Tracking bug #378827535](https://issues.chromium.org/issues/378827535)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5162859838046208)
|
[Spec](https://w3c.github.io/paint-timing/#painttimingmixin)

### Use of CssPixels in LayoutShift API

This feature changes the attribution data (`prevRect` and `currentRect`) in the
[LayoutShift API](https://wicg.github.io/layout-instability/) to be reported in
CSS pixels instead of physical pixels. The behavior is inconsistent with other
layout-related APIs, which all use CSS pixels. This change improves consistency,
simplifies usage for you, and aligns with expected units in debugging and
tooling.

[Tracking bug #399058544](https://issues.chromium.org/issues/399058544)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5155103518228480)
|
[Spec](https://wicg.github.io/layout-instability/#sec-layout-shift-attribution)

## Security

### Device Bound Session Credentials

[Device Bound Session Credentials (DBSC)](https://developer.chrome.com/docs/web-platform/device-bound-session-credentials)
lets websites bind a user's session to their specific device,
making it significantly harder for stolen session cookies to be used on other
machines.

[ChromeStatus.com entry](https://chromestatus.com/feature/5140168270413824)
|
[Spec](https://w3c.github.io/webappsec-dbsc)

### The Origin API

The [origin](https://datatracker.ietf.org/doc/rfc6454/) is a fundamental
component of the web's implementation, essential to both the security and
privacy boundaries that user agents maintain. The concept is well-defined
between HTML and URL, along with widely-used adjacent concepts like *site*.

Origins, however, are not directly exposed to you. Though there are various
origin getters on various objects, each of those returns the ASCII serialization
of an origin, not the origin itself. This has a few negative implications.
Practically, you attempting to do same-origin or same-site comparisons when
handling serialized origins often get things wrong in ways that lead to
vulnerabilities. Philosophically, it seems like a missing security primitive
that you struggle to polyfill accurately.

In Chrome 145, Chrome addresses this gap in the platform by introducing an
`Origin` object that encapsulates the origin concept and provides helpful
methods such as comparison, serialization, and parsing.

[Tracking bug #434131026](https://issues.chromium.org/issues/434131026)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5095541277065216)
|
[Spec](https://github.com/whatwg/html/pull/11846)

### Local Network Access split permissions

This is an enhancement to the Local Network Access (LNA) restrictions, where
Chrome splits the permission required from one Local Network Access permission
into two separate permissions.

The old permission is `local-network-access`. The new permissions are
`local-network` (for LNA requests to IPs in the local address space) and
`loopback-network` (for LNA requests to IPs in the loopback address space).

The old permission is kept as an alias and continues to work for
`permissions.query` and `Permissions Policy`. Enterprise policies continue to
work the same; newer, more granular enterprise policies are added later.

[Tracking bug #465491626](https://issues.chromium.org/issues/465491626)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5068298146414592)
|
Spec (link invalid on the official page)

### Trusted Types specification alignment

`Trusted Types` was originally implemented and launched in Chromium in 2019 and
has since found use in numerous websites. It has recently gained interest from
other browser vendors.

The `Trusted Types` spec was co-written as a "monkey patch" spec along with the
original implementation. It receives fresh attention as others are trying to
implement the same spec. It has been "upstreamed" into HTML + DOM (plus a bit of
CSP). As part of that process, various inconsistencies are being identified and
fixed. Some of these fixes might be developer observable. The intent is to
update the implementation to match the spec as it is upstreamed into HTML.

Meanwhile, WebKit has launched their implementation of the updated `Trusted
Types` spec, which gives Chrome high confidence that this update is highly web
compatible.

[Tracking bug #330516530](https://issues.chromium.org/issues/330516530)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5163792014245888)
|
[Spec](https://html.spec.whatwg.org/#:~:text=Trusted%20Types)

## Graphics

### WebGPU: `subgroup_uniformity` feature

This adds a new scope to the uniformity analysis and changes which parts of the
language are checked in each to enable subgroup functionality to be considered
uniform in more cases.

[Tracking bug #454653380](https://issues.chromium.org/issues/454653380)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5673998232977408)
|
[Spec](https://github.com/gpuweb/gpuweb/pull/5431)

## Isolated Web Apps

### `WebRequest.SecurityInfo` in `Controlled Frame`

This feature introduces a `WebRequest.SecurityInfo` API for
[ControlledFrame](https://developer.chrome.com/docs/iwa/controlled-frame). It lets a web app intercept an
HTTPS, WSS, or WebTransport request to a server, retrieve the server's
certificate fingerprint (as verified by the browser), and then use that
fingerprint to manually verify the certificate of a separate raw TCP/UDP
connection to the same server. This provides a method for the app to confirm
it's communicating with the correct server.

[Tracking bug #462114142](https://issues.chromium.org/issues/462114142)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5076692209106944)
|
[Spec](https://wicg.github.io/controlled-frame/#dictdef-securityinfo)

## Origin trials

### JPEG XL decoding support (`image/jxl`) in blink

Adds support for decoding JPEG XL (`image/jxl`) images in Blink using `jxl-rs`,
a memory-safe pure Rust decoder.

JPEG XL is a modern image format standardized as ISO/IEC 18181 that offers:

- Progressive decoding for improved perceived loading performance.
- Support for wide color gamut, HDR, and high bit depth.
- Animation support.

This implementation uses `jxl-rs` instead of the C++ libjxl reference decoder to
meet Chromium's memory safety requirements. The decoder is gated behind the
`enable-jxl-image-format` flag and `enable_jxl_decoder` build flag.

[ChromeStatus.com entry](https://chromestatus.com/feature/5114042131808256)

### WebAudio: Configurable render quantum

`AudioContext` and `OfflineAudioContext` now take an optional `renderSizeHint`,
which allows users to ask for a particular render quantum size when an integer
is passed, to use the default of 128 frames if nothing or `default` is passed,
or to ask the User-Agent to pick a good render quantum size
if `hardware` is specified.

[Origin Trial](https://developer.chrome.com/origintrials#/view_trial/2970686904204263425)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5078190552907776)

## Deprecations and removals

### Remove support for obsolete virtual cameras on macOS

Chrome removes support for obsolete virtual cameras for all macOS
releases that it supports.

[Tracking bug #461717105](https://issues.chromium.org/issues/461717105)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5086798634156032)

### Remove BMP Extension for Embedding JPEG-or-PNG-in-BMP

Chrome removes the BMP extension for embedding JPEG-or-PNG-in-BMP.

[Tracking bug #456842524](https://issues.chromium.org/issues/456842524)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5153489630134272)
|
Spec (link invalid on the official page)
