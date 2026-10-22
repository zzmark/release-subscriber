# Chrome 157 Release Notes

Preview

Scheduled Stable Release: November 3, 2026 (Currently on Beta channel)

## Miscellaneous

### [Add javascriptURLs option to SanitizerConfig and Sanitizer](https://chromestatus.com/feature/5169798320357376)

[https://github.com/whatwg/html/pull/12898](https://github.com/whatwg/html/pull/12898)

Sanitizer API also sanitizes javascript:-URLs, when they are used for navigation. This was originally done as a side effect of any "safe" method that uses Sanitizer, and omittted for any "unsafe" method. The HTML standard recently regularized this and made this a developer-selectable option, instead of a side-effect of a particular method.

Behaviour when the option is not used remains the same.

[ChromeStatus.com entry](https://chromestatus.com/feature/5169798320357376) | [Spec](https://github.com/whatwg/html/pull/12898) | [Docs](https://html.spec.whatwg.org/#dom-sanitizer-setjavascripturls)

### [Expose ProgressEvent in service workers](https://chromestatus.com/feature/5069584943153152)

ProgressEvent is available in service workers, allowing developers to construct progress events with lengthComputable, loaded, and total attributes.
This aligns service workers with other worker contexts and the XMLHttpRequest Standard.

[Tracking bug #332663431](https://issues.chromium.org/issues/332663431) | [ChromeStatus.com entry](https://chromestatus.com/feature/5069584943153152) | [Spec](https://xhr.spec.whatwg.org/#interface-progressevent)

### [Language Detector API on Android](https://chromestatus.com/feature/5087964794322944)

Exposes the LanguageDetector JavaScript Web API on Chrome for Android (Clank). This allows web applications to detect text languages locally on mobile devices using fast, privacy-preserving, and offline-capable on-device machine learning models and not rely on cloud endpoints.

[Tracking bug #549896512](https://crbug.com/549896512) | [ChromeStatus.com entry](https://chromestatus.com/feature/5087964794322944) | [Spec](https://webmachinelearning.github.io/translation-api) | [Explainer](https://github.com/webmachinelearning/translation-api)

### [Web Bluetooth: Make BluetoothRemoteGATTServer an EventTarget](https://chromestatus.com/feature/5138797158334464)

BluetoothRemoteGATTServer inherits from EventTarget, exposing the standard addEventListener(), removeEventListener(), and dispatchEvent() methods. This enables connection-level events to be dispatched directly on the GATT server.

[Tracking bug #40265040](https://issues.chromium.org/issues/40265040) | [ChromeStatus.com entry](https://chromestatus.com/feature/5138797158334464) | [Spec](https://pr-preview.s3.amazonaws.com/hjanuschka/web-bluetooth/pull/672.html#bluetoothremotegattserver) | [Explainer](https://github.com/WebBluetoothCG/web-bluetooth/pull/672)

## Security

### [CORS enforcement for Background Fetch](https://chromestatus.com/feature/6210300985606144)

Starting in Chrome 157, the Background Fetch API now enforces Cross-Origin Resource Sharing (CORS).
This update aligns Chromium's implementation with the intent of the [Background Fetch spec](https://wicg.github.io/background-fetch/). This ensures that Background Fetch requests are subject to the same security policies as regular Fetch requests, such as Local Network Access checks.

This update prevents sites from bypassing CORS (and other security policy checks) by using Background Fetch instead of regular [Fetch](https://fetch.spec.whatwg.org/).

[ChromeStatus.com entry](https://chromestatus.com/feature/6210300985606144) | [Spec](https://wicg.github.io/background-fetch)

## CSS

### [CSS corner shorthand properties](https://chromestatus.com/feature/5152215540039680)

Implements the CSS corner shorthand and per-corner sub-shorthands (corner-top-left, corner-top-right, corner-bottom-left, corner-bottom-right) as well as physical (corner-top, corner-bottom) and logical (corner-block-start, corner-block-end, etc.) edge  shorthands. These allow setting both border-radius and corner-shape for individual corners in a single declaration. Additionally, corners is retained as a compat alias for the corner shorthand.

sampler: [https://static.januschka.com/i-425897047/](https://static.januschka.com/i-425897047/)

CL: [https://chromium-review.googlesource.com/c/chromium/src/+/7747994](https://chromium-review.googlesource.com/c/chromium/src/+/7747994)

[Tracking bug #425897047](https://issues.chromium.org/issues/425897047) | [ChromeStatus.com entry](https://chromestatus.com/feature/5152215540039680) | [Spec](https://drafts.csswg.org/css-borders-4/#corner-shaping) | [Explainer](https://static.januschka.com/i-425897047)

### [CSS position-visibility:anchor{s}-valid](https://chromestatus.com/feature/5136856479039488)

The `anchors-valid` value was implemented as part of [https://crbug.com/329703412](https://crbug.com/329703412) but subsequently reverted, due to spec questions about the exact definition of the value. Since that time, the value has been renamed to `anchor-valid` (see [https://chromestatus.com/feature/5136123851571200](https://chromestatus.com/feature/5136123851571200)) and also better defined to be clear that only the default anchor matters, resolving a lot of ambiguity, and making this value shippable.

[Tracking bug #333421963](https://crbug.com/333421963) | [ChromeStatus.com entry](https://chromestatus.com/feature/5136856479039488) | [Spec](https://drafts.csswg.org/css-anchor-position-1/#position-visibility)

### [CSS text-decoration-inset](https://chromestatus.com/feature/5178263526834176)

CSS text-decoration-inset controls how far underlines, overlines, and line-through decorations are inset from or extended beyond text run edges. It supports auto, length, and percentage values, including one-value and two-value syntax for setting the start and end offsets. This lets developers adjust decoration spacing and create reveal effects with native text decorations instead of background gradients or additional elements.

sampler: [https://static.januschka.com/i-468928416/?asddsaasd](https://static.januschka.com/i-468928416/?asddsaasd)
MDN: [https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration-inset](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration-inset)

CL: [https://chromium-review.googlesource.com/c/chromium/src/+/7748204](https://chromium-review.googlesource.com/c/chromium/src/+/7748204)

[Tracking bug #468928416](https://issues.chromium.org/issues/468928416) | [ChromeStatus.com entry](https://chromestatus.com/feature/5178263526834176) | [Spec](https://drafts.csswg.org/css-text-decor-4/#propdef-text-decoration-inset)

### [CSS text-overflow: &lt;string&gt; value](https://chromestatus.com/feature/6294595288825856)

Adds a &lt;string&gt; value to the text-overflow property.

This allows web authors to specify a custom string (e.g., "(more)") to indicate that text has been clipped. This provides more design flexibility and can be used to create more user-friendly and context-aware overflow indicators.

[Tracking bug #41492459](https://issues.chromium.org/issues/41492459) | [ChromeStatus.com entry](https://chromestatus.com/feature/6294595288825856) | [Spec](https://drafts.csswg.org/css-overflow-4/#text-overflow) | [Explainer](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-overflow#string)

### [Ship anchor-visible and anchor-valid, and deprecate the plural versions](https://chromestatus.com/feature/5136123851571200)

The CSSWG resolved to rename `anchors-valid` --&gt; `anchor-valid` [1] and `anchors-visible` --&gt; `anchor-visible` [2]. To accomplish this, we'll rename the properties to the singular variants, and add aliases from the plural versions to the singular versions. At a later date, we will remove the plural variants. This chromestatus is only about shipping the new versions, and deprecating the old ones (but not removing them).

[1] [https://github.com/w3c/csswg-drafts/issues/10201#issuecomment-4180411971](https://github.com/w3c/csswg-drafts/issues/10201#issuecomment-4180411971)
[2] [https://github.com/w3c/csswg-drafts/issues/10201#issuecomment-4390233490](https://github.com/w3c/csswg-drafts/issues/10201#issuecomment-4390233490)

[Tracking bug #526682332](https://issues.chromium.org/issues/526682332) | [ChromeStatus.com entry](https://chromestatus.com/feature/5136123851571200) | [Spec](https://drafts.csswg.org/css-anchor-position-1/#position-visibility)

## DOM

### [Capability Elements Icon-only mode](https://chromestatus.com/feature/5107682460696576)

Introduces a new attribute to render Capability Elements(&lt;camera&gt;, &lt;microphone&gt; and &lt;geolocation&gt;) as compact icon buttons without text using a `displaymode` attribute. This gives developers flexible UI density for spatial layouts such as map controls and video floating trays while preserving native security guarantees and full screen reader accessibility.

This is an extension to the recently released Capability Elements
[https://chromestatus.com/feature/5153829504024576](https://chromestatus.com/feature/5153829504024576)

[ChromeStatus.com entry](https://chromestatus.com/feature/5107682460696576) | [Spec](https://w3c.github.io/mediacapture-extensions/#media-capture-html-elements) | [Explainer](https://github.com/w3c/mediacapture-extensions/blob/main/media-capture-elements-explainer.md)

### [Renewed HTML insertion&amp;streaming methods](https://chromestatus.com/feature/5054329641893888)

Expose multiple HTML setting methods that provide a coherent story for dynamically inserting markup into an existing document.

- Positional methods (before/after/append/prepend/replaceWith) that take HTML as argument, effectively replacing insertAdjacentHTML.

- Streaming methods (stream{Append}HTML{Unsafe}) which return a WritableStream, receiving text as input and parsing HMHL.

- Passing {runScripts} as part of SetHTMLUnsafeOptions, mimicking createContextualFragment behavior.

- Supporting createParserOptions in trusted types, allowing trusted types to override scripting mode and sanitizer.

[Tracking bug #491743369](https://issues.chromium.org/issues/491743369) | [ChromeStatus.com entry](https://chromestatus.com/feature/5054329641893888) | [Spec](https://github.com/WICG/declarative-partial-updates/blob/main/dynamic-markup-revamped-explainer.md#resulting-api) | [Explainer](https://github.com/WICG/declarative-partial-updates/blob/main/dynamic-markup-revamped-explainer.md)

## Graphics

### [HTML-in-canvas](https://chromestatus.com/feature/5172548013916160)

HTML-in-canvas enables customizing the rendering of html using canvas with new primitives to manage canvas layout, drawing capabilities, rendering events for DOM-to-canvas synchronization, and geometry update capabilities for canvas-to-DOM synchronization.

[Tracking bug #500967896](https://crbug.com/500967896) | [ChromeStatus.com entry](https://chromestatus.com/feature/5172548013916160) | [Spec](https://github.com/whatwg/html/pull/11588) | [Explainer](https://github.com/WICG/html-in-canvas) | [Demo](https://github.com/WICG/html-in-canvas#demos)

### [WebGPU: atomic-vec2u-min-max](https://chromestatus.com/feature/4882016087703552)

Allows the use of 64-bit atomic minimum and maximum operations on `atomic<vec2u>` in WGSL.

This provides WebGPU shader authors with a way to implement certain algorithms that use 64-bit atomics without requiring full support for 64-bit integers.

[Tracking bug #453689550](https://crbug.com/453689550) | [ChromeStatus.com entry](https://chromestatus.com/feature/4882016087703552) | [Spec](https://www.w3.org/TR/webgpu/#dom-gpufeaturename-atomic-vec2u-min-max) | [Explainer](https://github.com/gpuweb/gpuweb/issues/5071)

## Performance

### [Long Animation Frames style and layout duration](https://chromestatus.com/feature/5171478175809536)

Add `styleDuration` and `forcedStyleDuration` information to the Long Animation Frame API, enabling developers to distinguish style and layout times.

[Tracking bug #476826067](https://issues.chromium.org/issues/476826067) | [ChromeStatus.com entry](https://chromestatus.com/feature/5171478175809536) | [Spec](https://github.com/w3c/long-animation-frames/pull/30) | [Explainer](https://github.com/w3c/long-animation-frames/pull/30#issue-3828859369)

## New origin trials

### [Connection Allowlists - Embedded Enforcement](https://chromestatus.com/feature/5657801797009408)

Connection Allowlists ([https://chromestatus.com/feature/5175745573945344](https://chromestatus.com/feature/5175745573945344)) is a feature designed to provide explicit control over external endpoints by restricting connections initiated via the Fetch API or other web platform APIs from a document or worker. This aspect of the feature extends Connection Allowlists to support embedded enforcement on iFrames and nested documents/workers. This allows the parent document to enforce restrictions on embedded content where they can choose to opt in or not load.

More details on the proposal can be found here: [https://github.com/WICG/connection-allowlists](https://github.com/WICG/connection-allowlists)

[Origin trial](https://developer.chrome.com/origintrials#/view_trial/3609072151384031233) | [ChromeStatus.com entry](https://chromestatus.com/feature/5657801797009408) | [Spec](https://wicg.github.io/connection-allowlists/#issue-d96e905e) | [Explainer](https://github.com/WICG/connection-allowlists/blob/main/iframe-embedded-enforcement-explainer.md)

### [Overscroll Areas](https://chromestatus.com/feature/5261280285949952)

This feature adds a set of primitives to allow elements to anchor to overscroll areas of other elements. It further allows these elements to be revealed with swipe gestures, similar to scrollers.

[Origin trial](https://developer.chrome.com/origintrials#/view_trial/5642678951870464) | [Tracking bug #443719046](https://issues.chromium.org/443719046) | [ChromeStatus.com entry](https://chromestatus.com/feature/5261280285949952) | [Spec](https://github.com/w3c/csswg-drafts/pull/14532) | [Explainer](https://open-ui.org/components/overscroll-actions.explainer) | [Demo](https://flackr.github.io/web-demos/html/overscrollcontainer)

---

Source: [ChromeStatus Chrome 157 Release Notes](https://chromestatus.com/release-notes/157). This Markdown faithfully converts the English page body; navigation and copy-link controls are omitted. The page source carries Copyright 2016 Google Inc. All Rights Reserved and an [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) notice.

Release verification: [ChromiumDash Windows Stable records](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=157&num=1000) and the [official Early Stable announcement](https://chromereleases.googleblog.com/2026/10/early-stable-update-for-desktop_02123641300.html). The earliest matching actual Stable record is 157.0.8103.15, published on 2026-10-22 (UTC). The announcement confirms an Early Stable rollout to a small percentage of Windows users, with Mac coming later. The article's Beta channel label and scheduled date are retained above and are not used as publication evidence.
