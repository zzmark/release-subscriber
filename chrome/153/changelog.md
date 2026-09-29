# Chrome 153

Source: [Chrome 153 Release Notes](https://developer.chrome.com/release-notes/153?hl=en)

**Attribution:** Google for Developers. Except as otherwise noted, article text is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and code samples under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0). The official HTML article was converted to Markdown.

**Stable release date:** September 8th, 2026

Unless otherwise noted, the following changes apply to Chrome 153 stable
channel release for Android, ChromeOS, Linux, macOS, and Windows.

Want just the highlights? Check out
[New in Chrome 153](https://developer.chrome.com/blog/new-in-chrome-153).

## CSS and UI

### Single-axis scroll containers

**Available in non-stable channels (Beta, Dev, and Canary).**

Extends the `overflow` property to support scrollable values together with `clip` (for example, `overflow: scroll clip`). This lets `position: sticky` be constrained by different ancestor scroll containers per axis, and gives you a way to ensure an axis using `overflow: clip` stays in place.

[Tracking bug #440038212](https://issues.chromium.org/issues/440038212)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5067363861004288)
|
[Spec](https://github.com/w3c/csswg-drafts/pull/13903)

### The `scroll-axis-lock` property

`scroll-axis-lock` is a CSS property that lets you instruct browsers not to constrain a user's scrolling gesture to one axis.

Web browsers often lock a user's scrolling gesture to a single axis when that gesture starts with significantly more movement in one axis than in the perpendicular axis. In many cases, this behavior improves the user experience by avoiding accidental scrolls along the perpendicular axis when the user intended to scroll only one axis. However, when you want an element to always be diagonally scrollable, this locking behavior forces the user to start their gesture at an angle that doesn't trigger the locking.

[Tracking bug #479472367](https://issues.chromium.org/issues/479472367)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5908461532610560)
|
[Spec](https://github.com/w3c/csswg-drafts/pull/14152)

### Interoperable dispatch timing for `transitionrun` and media query events

Aligns Blink's dispatch timing for animation `transitionrun` events and media query `change` events with the HTML specification, making the timing interoperable with Gecko and WebKit. As per the HTML window event loop specification, `transitionrun` events fire at Step 3.11 even for animations created earlier in the same iteration (instead of delaying them for a later iteration). Media query `change` events fire at Step 3.10 before firing any pending animation events (instead of intermixing them with animation events at Step 3.11).

[Tracking bug #397737222](https://issues.chromium.org/issues/397737222)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6312504658624512)
|
[Spec](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)

## DOM and HTML

### Capability elements: `<camera>` and `<microphone>`

The `<camera>` and `<microphone>` capability elements are declarative, user-activated HTML controls that share the same underlying mechanism as the `<usermedia>` element, with one key distinction: they request a single capability. The `<camera>` element requests video capture, while the `<microphone>` element requests audio capture. Like `<usermedia>`, they embed a browser-controlled, strictly styled UI into the page, ensuring a strong, intentional user signal (a click) before a permission prompt is triggered or a stream is started.

The `<camera>` and `<microphone>` elements provide a dedicated, semantic HTML control for these single-capability use cases. They maintain the identical security model, strict styling constraints, and built-in permission recovery path as `<usermedia>`, but offer a more tailored and ergonomic API when you don't need mixed media access.

[Tracking bug #531672795](https://issues.chromium.org/issues/531672795)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5153829504024576)
|
[Spec](https://w3c.github.io/mediacapture-extensions/#the-camera-html-element)

### XML parsing in Rust for non-XSLT scenarios

To improve browser security and protect users against memory-related vulnerabilities, Chrome 153 updates its XML parsing engine to a memory-safe Rust implementation for several common scenarios. This update eliminates potential memory corruption bugs while maintaining full compatibility with existing web standards.

Chrome has already begun to deprecate and remove XSLT. While this process continues, the new, safer parser handles the following scenarios where no XSLT is required:

- `DOMParser` Web API
- Accessing `responseXML` of `XMLHttpRequest`
- SVG standalone images (accessing an `image.svg` document directly as a top-level navigation)
- SVG external images (embedding an SVG as an external image resource in a main document)

[Tracking bug #466303347](https://issues.chromium.org/issues/466303347)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5309598397497344)
|
[Spec](https://www.w3.org/TR/xml)

## JavaScript

### Iterator Join

Adds a method to JavaScript to concatenate the contents of an iterator into a string. The `join()` method of `Iterator` instances is similar to `Array.prototype.join()`: it returns a string that is the concatenation of all elements produced by the iterator, separated by commas or a specified separator string.

[Tracking bug #465715798](https://issues.chromium.org/issues/465715798)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5095183554314240)
|
[Spec](https://tc39.es/proposal-iterator-join)

### Joint Iteration

Adds methods to synchronise the advancement of multiple iterators (commonly called zip) in JavaScript, including `Iterator.zip()` and `Iterator.zipKeyed()`.

[Tracking bug #465357675](https://issues.chromium.org/issues/465357675)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6249068542164992)
|
[Spec](https://github.com/tc39/proposal-joint-iteration)

## Media, sensors, and input

### Immersive Audio Model and Formats (IAMF) decoding support

Adds support for decoding and playing back the Immersive Audio Model and Formats (IAMF) container within HTML media elements through Media Source Extensions (MSE). IAMF is an open, royalty-free spatial audio format that supports channel-based, scene-based, and object-based audio presentations. Supporting this standard lets web developers deliver consistent, immersive 3D audio experiences across different devices without relying on proprietary formats or managing complex discrete audio channel routing in JavaScript.

[Tracking bug #535279329](https://issues.chromium.org/issues/535279329)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5113656292540416)
|
[Spec](https://aomediacodec.github.io/iamf/latest-approved.html)

### WebAudio: Configurable render quantum

Adds an optional `renderSizeHint` to `AudioContext` and `OfflineAudioContext`. This lets you customize the WebAudio render quantum size by passing a specific integer, use the default of 128 frames by omitting the hint or passing `"default"`, or request that the browser select an optimal size by specifying `"hardware"`.

[Tracking bug #40637820](https://issues.chromium.org/issues/40637820)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5078190552907776)
|
[Spec](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-renderquantumsize)

### WebGPU: `buffer_view` feature

Adds a WGSL language feature for reinterpreting data in variables. The feature lets you divide a single uniform, storage, or workgroup variable into multiple logical variables. It also lets the type of data in the variable be interpreted as multiple types within the program.

[Tracking bug #506523198](https://issues.chromium.org/issues/506523198)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5094091886034944)
|
[Spec](https://github.com/gpuweb/gpuweb/pull/6291)

## Origin trials

### JavaScript Self-Profiling Markers

The JavaScript Self-Profiling API lets a web application sample its own call stacks to measure performance on real user devices. This feature adds an optional marker field to each captured sample that identifies the type of browser activity running when the sample was taken: script, gc, style, layout, paint, or other. A trace normally shows gaps between stacks that can't be interpreted; markers let you attribute that time to browser work happening outside JavaScript, for example distinguishing script execution from style recalculation, layout, or a garbage collection pause, making slow traces easier to analyze and optimize.

[Origin Trial](https://developer.chrome.com/origintrials#/register_trial/2442639847895072769)
|
[Tracking bug #40800459](https://issues.chromium.org/issues/40800459)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5201297767792640)
|
[Spec](https://github.com/WICG/js-self-profiling/pull/89)

## Deprecations and removals

### Deprecate and remove Protected Audience

The Protected Audience API provides a method of interest-group advertising without third-party cookies or user tracking across sites. Following Chrome's announcement that the current approach to third-party cookies will be maintained, the Protected Audience API is planned for deprecation and removal (along with related Privacy Sandbox APIs).

[ChromeStatus.com entry](https://chromestatus.com/feature/6552486106234880)
|
[Spec](https://wicg.github.io/turtledove)

### Deprecate and remove Related Website Sets (RWS)

Related Website Sets (RWS), formerly known as First Party Sets, provides a framework for developers to declare relationships among sites, to enable limited cross-site cookie access for specific, user-facing purposes. Following Chrome's announcement that the current approach to third-party cookies will be maintained, Related Website Sets is planned for deprecation and removal.

[ChromeStatus.com entry](https://chromestatus.com/feature/5194473869017088)
|
[Spec](https://wicg.github.io/first-party-sets)

### Deprecate and remove Shared Storage API

The Shared Storage API is a privacy-preserving web API to enable storage that is not partitioned by first-party site. Following Chrome's announcement that the current approach to third-party cookies will be maintained, the Shared Storage API is planned for deprecation and removal (along with related Privacy Sandbox APIs).

[Tracking bug #462465887](https://issues.chromium.org/issues/462465887)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5076349064708096)
|
[Spec](https://wicg.github.io/shared-storage)

### Deprecate and remove `document.requestStorageAccessFor`

The `requestStorageAccessFor` (rSAFor) API is an extension to the Storage Access API that lets a top-level site request access to unpartitioned ("first-party") cookies on behalf of embedded sites. Because it is only usable in Chrome to request storage access between Related Website Sets sites, it is planned for deprecation and removal along with Related Website Sets.

[ChromeStatus.com entry](https://chromestatus.com/feature/5162221567082496)
|
[Spec](https://privacycg.github.io/requestStorageAccessFor)

### Deprecate and remove Attribution Reporting API

The Attribution Reporting API is a privacy-preserving web API designed to measure ad conversions without third-party cookies or user tracking across sites. Following Chrome's announcement that the current approach to third-party cookies will be maintained, the Attribution Reporting API is planned for deprecation and removal (along with related Privacy Sandbox APIs).

[ChromeStatus.com entry](https://chromestatus.com/feature/6320639375966208)
|
[Spec](https://wicg.github.io/attribution-reporting-api)

### Remove non-standard navigations targeted at `_current`

Blink previously supported navigations targeted at `_current`. This feature is removed in Chrome 153 because it is non-standard, with minimal usage across the web.

[Tracking bug #539212797](https://issues.chromium.org/issues/539212797)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5121089536262144)
|
[Spec](https://html.spec.whatwg.org/#the-rules-for-choosing-a-navigable)
