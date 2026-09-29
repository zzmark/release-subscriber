# Chrome 152

Source: [Chrome 152 Release Notes](https://developer.chrome.com/release-notes/152?hl=en)

**Attribution:** Google for Developers. Except as otherwise noted, article text is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and code samples under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0). The official HTML article was converted to Markdown.

**Stable release date:** August 25th, 2026

Unless otherwise noted, the following changes apply to Chrome 152 stable
channel release for Android, ChromeOS, Linux, macOS, and Windows.

Want just the highlights? Check out
[New in Chrome 152](https://developer.chrome.com/blog/new-in-chrome-152).

## CSS and UI

### `CSSPseudoElement` support for `::backdrop`, `::scroll-marker`, and `::view-transition`

Support for `CSSPseudoElement`, previously defined for `::after`, `::before`, and `::marker`, extends to include several new pseudo-elements:

- `::backdrop`: Helps close a dialog when the backdrop is clicked without interfering with clicks inside the dialog content, eliminating the need for complex intersection logic to determine where the click occurred.
- `::scroll-marker`: Used to collect click statistics.
- `::view-transition`: Paves the way to supporting geometry-aware view transitions and intercepting a view transition mid-flight to start a new transition.

[ChromeStatus.com entry](https://chromestatus.com/feature/6516055192240128)
|
[Spec](https://drafts.csswg.org/css-pseudo-4/#CSSPseudoElement-interface)

### Relative alpha colors (CSS Color 5 `alpha()` function)

Relative alpha colors reference an origin color and modify only the alpha channel, letting developers set transparency relative to an existing color value.

[Tracking bug #492246715](https://issues.chromium.org/issues/492246715)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5070160203481088)
|
[Spec](https://drafts.csswg.org/css-color-5/#relative-alpha)

### `window-drag` CSS property

The `window-drag` CSS property lets web content designate regions of an installed desktop web app UI that behave as draggable window title bar areas. When applied, pointer interactions such as click-and-drag move the top-level application window rather than triggering normal page interaction. This feature standardizes and renames the existing `app-region` CSS property, changes its value names to `move` and `none`, and adds explicit inheritance behavior.

[Tracking bug #477608113](https://issues.chromium.org/issues/477608113)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5201338641285120)
|
[Spec](https://drafts.csswg.org/css-ui-4/#window-drag)

## DOM and HTML

### Expose the `autocorrect` global HTML attribute

The HTML `autocorrect` attribute lets web authors control whether autocorrection applies to user input in editable elements including `<input>`, `<textarea>`, and `contenteditable` hosts. This feature exposes the `autocorrect` global HTML attribute and reflects it on `HTMLElement`.

[Tracking bug #40871769](https://issues.chromium.org/issues/40871769)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6264645053710336)
|
[Spec](https://html.spec.whatwg.org/multipage/interaction.html#autocorrection)

### OpaqueRange

`OpaqueRange` represents a live span of text within a form control value, such as a `<textarea>` or text-based `<input>`, so developers can work with value text using range-like APIs. It enables operations such as `getBoundingClientRect()`, `getClientRects()`, and integration with the CSS Custom Highlight API for inline suggestions, highlights, and anchored popovers. It preserves encapsulation by exposing only value offsets while returning `null` for `startContainer` and `endContainer`.

[Tracking bug #421421332](https://issues.chromium.org/issues/421421332)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6297362687066112)
|
[Spec](https://github.com/whatwg/dom/pull/1404)

### Reference Target for cross-root ARIA

Reference Target enables ID attributes like `<label for>`, `aria-labelledby`, `popovertarget`, and `commandfor` to be forwarded to elements inside a component's shadow DOM, while maintaining encapsulation of internal state. When a shadow host specifies an element in its shadow tree to act as its reference target, all ID references pointing to the shadow host are forwarded to the reference target element instead. The reference target can be set declaratively using the `shadowrootreferencetarget` attribute on `<template>` or in JavaScript using `ShadowRoot.prototype.referenceTarget`.

[Tracking bug #346835896](https://issues.chromium.org/issues/346835896)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5188237101891584)
|
[Spec](https://github.com/whatwg/html/pull/10995)

## Web apps

### Notification attribution for PWAs on macOS

When a Progressive Web App (PWA) is installed on macOS, its notifications are natively attributed to the PWA itself (using its own name and icon in Notification Center) rather than Google Chrome. PWA notifications align with native macOS applications: Chrome no longer supports the `requireInteraction` field for notifications on macOS, and the Badging API requires notification permissions for the app badge to appear.

[Tracking bug #327449602](https://issues.chromium.org/issues/327449602)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5863296436666368)
|
[Spec](https://notifications.spec.whatwg.org)

### Sub apps for Isolated Web Apps

Sub apps allow developers to create multiple apps under a single Isolated Web App (IWA) installation. Each sub app has its own distinct name, icons, and OS integrations, appearing on the desktop shelf with a distinct identity from the parent IWA while maintaining a single, unified IWA installation and update process. Administrators can control this capability using enterprise policies.

[Tracking bug #414729785](https://issues.chromium.org/issues/414729785)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6260680824061952)
|
[Spec](https://wicg.github.io/sub-apps)

### Unframed display mode for Isolated Web Apps

Unframed display mode allows Isolated Web Apps to occupy the entire browser window by removing standard window borders and title bars, optimizing available workspace and letting developers implement unique user experiences with custom branding and menu hierarchies. Administrators can manage this feature using window management enterprise policies.

[Tracking bug #477512407](https://issues.chromium.org/issues/477512407)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5551475195904000)
|
[Spec](https://wicg.github.io/manifest-incubations/index.html#dfn-unframed)

## Performance and networking

### CPU Performance API

The CPU Performance API allows web applications to determine the CPU performance tier of a user's device. Web applications can use this information to provide an improved user experience, optionally in combination with the Compute Pressure API to react to changes in CPU pressure. Users and administrators can override the reported performance tier using Chrome settings and enterprise policies.

[Tracking bug #449760252](https://issues.chromium.org/issues/449760252)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5189864286978048)
|
[Spec](https://wicg.github.io/cpu-performance)

### Connection Allowlists

Connection Allowlists provides explicit control over external endpoints by restricting connections initiated through the Fetch API or other web platform APIs from a document or worker. Servers distribute an authorized endpoint list through an HTTP response header, and Chrome evaluates destination endpoints against this allowlist before establishing connections.

[Tracking bug #447954811](https://issues.chromium.org/issues/447954811)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5175745573945344)
|
[Spec](https://wicg.github.io/connection-allowlists)

## Media, sensors, and input

### `MediaCapabilities.decodingInfo.encryptionScheme`

Adds the `encryptionScheme` attribute to the `KeySystemTrackConfiguration` dictionary used in `navigator.mediaCapabilities.decodingInfo()`. This lets web applications query whether a specific encryption scheme (such as `'cenc'` or `'cbcs'`) is supported.

[Tracking bug #498284510](https://issues.chromium.org/issues/498284510)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/4644898109259776)
|
[Spec](https://w3c.github.io/media-capabilities/#dom-keysystemtrackconfiguration-encryptionscheme)

### Audio preference capture in `getDisplayMedia()`

This hint lets web applications signal to the browser that they prefer audio sharing along with video. This helps developers ensure that applications relying on audio capture work seamlessly.

[Tracking bug #535514300](https://issues.chromium.org/issues/535514300)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5085785343787008)
|
[Spec](https://w3c.github.io/mediacapture-screen-share/#dom-displaymediastreamoptions-audioselection)

### WebGPU: Subgroup size control

Adds the optional GPU feature `"subgroup-size-control"` that allows explicitly setting the subgroup size in a compute shader. This optimizes compute shader performance using subgroup operations with specific subgroup sizes on targeted hardware platforms, particularly for AI workloads.

[Tracking bug #463721943](https://issues.chromium.org/issues/463721943)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5077657663438848)
|
[Spec](https://github.com/gpuweb/gpuweb/pull/5578)

## Privacy and security

### Suspicious site warnings

For users of Safe Browsing Enhanced protection, Chrome displays a bypassable warning popup when visiting sites with signals indicating they are potentially malicious. This warning is shown in addition to existing interstitial warnings for confirmed malicious websites. Administrators can configure this feature using Safe Browsing policies.

[ChromeStatus.com entry](https://chromestatus.com/feature/5427561449521152)

## Origin trials

### Deprecation trial for client-side XSLT

Client-side XSLT is deprecated and planned for removal from the web platform. A deprecation trial is available starting in Chrome 152 to give sites additional migration time.

[Origin Trial](https://developer.chrome.com/origintrials#/register_trial/1902207892610613249)
|
[Tracking bug #435623334](https://issues.chromium.org/issues/435623334)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/4709671889534976)

### Speculation Rules: moderate viewport heuristics controls

Provides experimental controls for speculation rules viewport heuristics, enabling developers to test whether alternative heuristics parameters deliver better prefetching and prerendering results than the default settings.

[Tracking bug #529423512](https://issues.chromium.org/issues/529423512)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6240467143491584)

### User Agent Image Replacement API

Enables developers to observe when a browser modifies or replaces image media in a page on behalf of the user (such as using generative AI) so that documents can adapt other content and mitigate potential user confusion.

[Tracking bug #544822216](https://issues.chromium.org/issues/544822216)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5076374013476864)
|
[Spec](https://github.com/explainers-by-googlers/ua-image-replacement)

## Deprecations and removals

### Remove Private Aggregation API

Following Chrome's announcement that the current approach to third-party cookies will be maintained, the Private Aggregation API is deprecated and removed (along with related Privacy Sandbox APIs).

[ChromeStatus.com entry](https://chromestatus.com/feature/4683382919397376)
|
[Spec](https://patcg-individual-drafts.github.io/private-aggregation-api)
