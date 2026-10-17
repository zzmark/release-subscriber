# Chrome 156 Release Notes

Preview

Scheduled Stable Release: October 20, 2026

## Network / Connectivity

### [Avoid caching module failures](https://chromestatus.com/feature/5214647044145152)

Currently web developers cannot retry failed module loads, as these failures are being cached (and retries just result in immediate failures).
This change to the module loading behavior enables failed module loads to be manually retried (e.g. by calling `import()` again), solving real developer (and user) pain when it comes to using modules over unstable networks.

[Tracking bug #534781954](https://issues.chromium.org/issues/534781954) | [ChromeStatus.com entry](https://chromestatus.com/feature/5214647044145152) | [Spec](https://github.com/whatwg/html/pull/10327) | [Explainer](https://gist.github.com/yoavweiss/a54501545ab2ad22bfde0ebed02a115c)

### [Compression dictionary transport Updates](https://chromestatus.com/feature/4895435813683200)

When fetching rel=compression-dictionary links:

- Use "compression-dictionary" as request destination.
- Properly set request's mode, credentials, referrer and referrerpolicy.
- Take into account crossorigin and referrer attributes form &lt;link rel="compression-dictionary"&gt;.

[Tracking bug #40255884](https://issues.chromium.org/issues/40255884) | [ChromeStatus.com entry](https://chromestatus.com/feature/4895435813683200) | [Spec](https://github.com/whatwg/html/pull/11620)

### [WebTransport headers and responseHeaders](https://chromestatus.com/feature/5194104408506368)

Adds support for passing custom HTTP request headers via WebTransportOptions and inspecting server response headers through the WebTransport instance. This allows web applications to supply metadata, authentication tokens, and custom parameters during the initial CONNECT handshake and access server-provided headers once the connection is established.

[Tracking bug #551850821](https://issues.chromium.org/issues/551850821) | [ChromeStatus.com entry](https://chromestatus.com/feature/5194104408506368) | [Spec](https://www.w3.org/TR/webtransport/#dom-webtransportoptions-headers)

## CSS

### [CSS pseudo-class for navigation source element](https://chromestatus.com/feature/6327898878377984)

Selects the element that initiated the navigation, whether it's a link/button/form. The element stays selected throughout the navigation.

[Tracking bug #530210946](https://issues.chromium.org/issues/530210946) | [ChromeStatus.com entry](https://chromestatus.com/feature/6327898878377984) | [Spec](https://drafts.csswg.org/css-navigation-1/#navigation-source-pseudo-class) | [Explainer](https://github.com/WICG/declarative-partial-updates/blob/main/route-matching-explainer.md#link-matching)

### [CSS random() function](https://chromestatus.com/feature/5324559251275776)

The random() function brings generative randomness to CSS, allowing web authors to generate a random numeric value within a specified range.

For example, web authors can use random() to scatter elements randomly within their container:

```css
.dot {
/* Position each dot randomly */
position: absolute;
top: random(0%, 100%);
left: random(0%, 100%);
}
```

This feature also includes caching controls. By default, each random() function resolves to a new, distinct value. Web authors can override this default by passing a &lt;random-key&gt; value as the function's first argument to control how random values are shared across properties and elements.

[Tracking bug #413385732](https://issues.chromium.org/issues/413385732) | [ChromeStatus.com entry](https://chromestatus.com/feature/5324559251275776) | [Spec](https://www.w3.org/TR/css-values-5/#random) | [Explainer](https://webkit.org/blog/17285/rolling-the-dice-with-css-random) | [Explainer](https://css-tricks.com/almanac/functions/r/random)

### [Single-axis scroll containers](https://chromestatus.com/feature/5067363861004288)

Extends the `overflow` property to support scrollable values together with `clip` (for example, `overflow: scroll clip`). This allows `position: sticky` to be constrained by different ancestor scroll containers per axis, and gives authors a way to ensure an axis using `overflow: clip` stays in place.

[Tracking bug #440038212](https://issues.chromium.org/440038212) | [ChromeStatus.com entry](https://chromestatus.com/feature/5067363861004288) | [Spec](https://github.com/w3c/csswg-drafts/pull/13903) | [Explainer](https://github.com/explainers-by-googlers/single-axis-scroll-containers)

### [Use scroll-snap-type: pair to snap to a single element](https://chromestatus.com/feature/5124378896498688)

[https://github.com/w3c/csswg-drafts/issues/9519](https://github.com/w3c/csswg-drafts/issues/9519)

Add a "pair" keyword to scroll-snap-type. If used, when the container scroll snaps to an element on one axis, it should snap to the same element on the other axis. In the existing spec, the "both" keyword allows the scroll container to select snap targets in X and Y axes independently and snap to different targets.

[Tracking bug #542706103](https://crbug.com/542706103) | [ChromeStatus.com entry](https://chromestatus.com/feature/5124378896498688) | [Spec](https://drafts.csswg.org/css-scroll-snap-1) | [Explainer](https://github.com/explainers-by-googlers/scroll-snap-type-pair)

## Offline / Storage

### [IndexedDB: SQLite backend](https://chromestatus.com/feature/5161589557821440)

Chromium's IndexedDB implementation is rewritten on top of SQLite, to replace the previous implementation that uses a hybrid of LevelDB and flat files. There is no change to the Web API.

This is expected to improve reliability and, to a lesser extent, performance.

For now this is applied to *new data stores*. This is step 2 of a multi-phase rollout. See [https://chromestatus.com/feature/5126896685809664](https://chromestatus.com/feature/5126896685809664) which tracks step 1, the rollout for in-memory i.e. incognito contexts. Step 3 will consist of migrating existing data from LevelDB stores to SQLite stores.

In this step, the first time a user visits a site, or after clearing site data, new IDB data will be stored in a backend that makes use of SQLite, but existing data stored in LevelDB is unimpacted.

See Documentation link below for a list of differences to be aware of.

[Tracking bug #498644996](https://issues.chromium.org/issues/498644996) | [ChromeStatus.com entry](https://chromestatus.com/feature/5161589557821440) | [Spec](https://www.w3.org/TR/IndexedDB) | [Docs](https://docs.google.com/document/d/1S9Rx67BmCZIP7tpasKaQ2FlV4TL1Z15DitR2kRZs9nw/edit?usp=sharing) | [Docs](https://docs.google.com/document/d/1-N4NqdYjqaWEbfVPYnCg2Ho1u4YK48pUoQ_tSy9SUg8/edit?usp=sharing) | [Demo](https://evanstade.github.io/web-storage-demos/idb-txn-scopes)

## Graphics

### [WebGPU: WGSL Fragment Depth](https://chromestatus.com/feature/5663304168112128)

Adds the ability to provide a `less` or `greater` modifier to the `@builtin(frag_depth)` in WGSL.

The current `@builtin(frag_depth)` can potentially introduce a performance penalty due to disabling the early-Z optimizations on a draw call. The new modifiers allow the explicit setting of the buffer mode and allow the early-Z optimizations to be applied.

[Tracking bug #457993779](https://crbug.com/457993779) | [ChromeStatus.com entry](https://chromestatus.com/feature/5663304168112128) | [Spec](https://github.com/gpuweb/gpuweb/pull/6299) | [Explainer](https://github.com/gpuweb/gpuweb/blob/main/proposals/fragment-depth.md)

## Realtime / Communication

### [WebRTC Diagnostic Logging API](https://chromestatus.com/feature/5091582546149376)

The Real-time Communication for the Web ([WebRTC](https://webrtc.org/)) Diagnostic Logging API allows authorized web applications to trigger the collection of WebRTC diagnostic data so that it can be used for local debugging. It also allows an application to share the WebRTC diagnostic data with the user agent vendor, subject to user authorization, with the purpose of providing information that can help fix bugs in or improve the user agent.

Admins can enable diagnostic logs with the enterprise policy [WebRtcDiagnosticLogCollectionAllowedForOrigins](https://chromeenterprise.google/policies/#WebRtcDiagnosticLogCollectionAllowedForOrigins).

[Tracking bug #481412281](https://crbug.com/481412281) | [ChromeStatus.com entry](https://chromestatus.com/feature/5091582546149376) | [Spec](https://w3c.github.io/webrtc-extensions/#diagnostic-logging) | [Explainer](https://github.com/WICG/webrtc-diagnostic-logging/blob/main/explainer.md)

## Deprecations and removals

### [Remove FencedFrame element and window.fence APIs](https://chromestatus.com/feature/6366274495053824)

Fenced frames are nested frames that embed content onto a page without the ability to share data between the fenced frame and its embedder.

window.fence APIs include Fenced frames Ads reporting (FFAR) JS APIs that were created for privacy-safe ads reporting from FFs created using Protected Audience and SelectURL and getNestedConfigs() to support PA component ads.

This intent is for removing both of these. Fenced frames element removal will be two step as detailed below.

With the removal (or stub API replacement) of PA and selectURL, FFs can no longer be navigated and thus it is safe to remove them. Fenced frames are only able to be navigated using the urn:uuid in a FencedFrameConfig[1], which can only be created using the return values from runAdAuction and selectURL. These APIs are being deprecated and removed in M152 as per the following Intent threads: Protected Audience[2], Shared Storage[3].

Plan:
Given that the fenced frames element can no longer be navigated, we propose removing the element from the code in the following phases:

1. M156: Keep the fenced frame element and its associated IDL dependencies as stubs. This is to ensure no JS call throws, e.g.calling fenced-frame-element.config.setSharedStorageContext().
2. M156: In the same milestone we will also stub the window.fence APIs completely. Since there is no FF document navigation, these APIs cannot be invoked anymore, so it will be a no-op.
3. M157 Canary/Beta: Begin a controlled rollout of the stub FF HTML element removal via a field trial. Note that removing the element will resolve it to HTMLUnknownElement.

At this point we are requesting approvals for all of the above steps.

4. M157 Stable: Assuming there are no regressions or breakage after reaching 1% stable, we will request additional approval for full removal of the FF element.

[1][https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/html/fenced_frame/fenced_frame_config.idl](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/html/fenced_frame/fenced_frame_config.idl)
[2][https://groups.google.com/a/chromium.org/g/blink-dev/c/k_nubsMb97g/m/awPD4IGLBAAJ](https://groups.google.com/a/chromium.org/g/blink-dev/c/k_nubsMb97g/m/awPD4IGLBAAJ)
[3][https://groups.google.com/a/chromium.org/g/blink-dev/c/uh5Ke6qyegc/m/WFTFnhyJBAAJ](https://groups.google.com/a/chromium.org/g/blink-dev/c/uh5Ke6qyegc/m/WFTFnhyJBAAJ)

[Tracking bug #538634423](https://issues.chromium.org/538634423) | [ChromeStatus.com entry](https://chromestatus.com/feature/6366274495053824) | [Spec](https://wicg.github.io/fenced-frame) | [Explainer](https://github.com/WICG/fenced-frame/blob/master/explainer/README.md)

---

Source: [ChromeStatus Chrome 156 Release Notes](https://chromestatus.com/release-notes/156). This Markdown faithfully converts the English page body; navigation and copy-link controls are omitted. The page source carries Copyright 2016 Google Inc. All Rights Reserved and an [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) notice.

Release verification: [ChromiumDash Windows Stable records](https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&milestone=156&num=1000). The earliest matching actual Stable record is 156.0.8078.12, published on 2026-10-07 (UTC). The scheduled date above is retained from the article and is not used as the publication date.
