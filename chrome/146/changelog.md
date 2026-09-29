# Chrome 146

Source: [Chrome 146 Release Notes](https://developer.chrome.com/release-notes/146?hl=en)

**Attribution:** Google for Developers. Except as otherwise noted, article text is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and code samples under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0). The official HTML article was converted to Markdown.

**Stable release date:** March 10th, 2026

Unless otherwise noted, the following changes apply to Chrome 146 stable
channel release for Android, ChromeOS, Linux, macOS, and Windows.

Want just the highlights? Check out
[New in Chrome 146](https://developer.chrome.com/blog/new-in-chrome-146).

## CSS and UI

### Scroll-triggered animations

This feature adds scroll-position-based control of animations, for example,
playing, pausing, and resetting animations.

A common pattern on pages across the web is to start an animation when a scroll
position is reached. Developers often do this by using JavaScript to manually
detect that an element is within its scroll container's viewport and to start a
corresponding animation (for example, sliding that element into view). Many of
these use cases rely on declaratively provided information. This feature lets
you create such interactions declaratively with CSS, which lets the user agent
offload this interaction to a worker thread. The API also includes JavaScript
interfaces that let you extend the feature to web animations in addition to CSS
animations.

[Tracking bug #390314945](https://issues.chromium.org/issues/390314945)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5181996801982464)
|
[Spec](https://drafts.csswg.org/css-animations-2/#timeline-triggers)

### The `trigger-scope` property

The `trigger-scope` property lets you limit the names of `animation triggers`
declared by `trigger-instantiating properties`.

`Trigger-instantiating properties`, for example, `timeline-trigger`, declare
names that the `animation-trigger` property can reference to attach animations
to triggers. However, these names are global by default (similar to
`anchor-name`), and it is often useful to limit the visibility of the names to
isolate animation-to-trigger interactions.

[Tracking bug #466134208](https://issues.chromium.org/issues/466134208)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5152759609425920)
|
[Spec](https://drafts.csswg.org/css-animations-2/#trigger-scope)

### `meta name="text-scale"`

The `root element`'s default font size scales in proportion to both the
operating system's and browser's text scale setting. This lets pages that follow
best practices around `font-relative units` (that is, use `rem` and `em` for
font sizes and page elements that adapt to user text size preferences) respect
the user's OS-level text scale setting. This also disables existing
browser-based mechanisms (that is, full-page zoom on windows) and heuristics
(that is, text autosizing on mobile). You can signal to the browser that the
page is constructed in a way (that is, with `rem` and `em`) that scales well
across various user-selected font size preferences. Similar to
`env(preferred-text-scale)`, which provides a way to access the text scale, this
API extends this by enabling scaling using the `root element`'s default font size
and opting out of automatic text scaling.

[Tracking bug #430566925](https://issues.chromium.org/issues/430566925)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5112244702674944)
|
[Spec](https://drafts.csswg.org/css-fonts-5/#text-scale-meta)

### Scoped custom element registry

This feature lets multiple custom element definitions for a single tag name
exist within a page. This prevents custom element name conflicts when a web app
uses libraries from multiple sources. This is achieved by allowing user code to
create multiple custom element registries and associate them with tree scopes
and elements that function as scoping objects.

[Tracking bug #40826514](https://issues.chromium.org/issues/40826514)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/515090435261792256)
|
[Spec](https://html.spec.whatwg.org/multipage/custom-elements.html#customelementregistry)

## Capabilities

### Populate `targetURL` during file handling

The Launch Handler implementation now ensures `LaunchParams.targetURL` is
populated when a PWA is launched with file handling. Before this change, the
property was null when a file launch was directed to an existing window. This
change ensures that the URL from the manifest `action` field (the same URL the
document must currently load) is available to the `launchQueue` consumer.

[Tracking bug #464314997](https://issues.chromium.org/issues/464314997)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5119095123083264)
|
[Spec](https://wicg.github.io/manifest-incubations/index.html#execute-a-file-handler-launch)

### Stop re-queueing LaunchParams on reload

Prevent the `launchQueue` from re-sending the last `LaunchParams` (including file handles) when a user reloads the page. Previously, a page refresh triggered the launch consumer again with the data from the original launch. This change ensures that a reload is treated as a standard navigation rather than a "re-launch," and the `launchQueue` won't be populated with duplicate files unless a new file launch event occurs.

[Tracking bug #40204185](https://issues.chromium.org/issues/40204185)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5986946868445184)

## DOM

### Navigation API: add `post-commit handler` from `precommit`

When intercepting navigations with the `navigate` event, `precommitHandlers` and
post-commit ordinary handlers are passed separately.

This works well when there is only one or the other, but can be cumbersome when
the flow includes a `precommitHandler` that leads to a `post-commit handler`.

This addition is a small ergonomic improvement that lets you register a
post-commit handler while invoking a precommit handler.

[Tracking bug #465487215](https://issues.chromium.org/issues/465487215)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5176907844943872)
|
[Spec](https://html.spec.whatwg.org/#dom-navigationprecommitcontroller-addhandler)

## Graphics

### WebGPU: Texture and Sampler Lets

Add a language feature to WGSL, `texture_and_sampler_let`, that lets you store
`texture` and `sampler` objects into a `let` declaration in WGSL.

[Tracking bug #459500757](https://issues.chromium.org/issues/459500757)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5102334940151808)
|
[Spec](https://github.com/gpuweb/gpuweb/pull/5389)

### WebGPU: Transient attachments

This feature adds functionality to the WebGPU spec after its first shipment in a
browser.

A new `TRANSIENT_ATTACHMENT GPUTextureUsage` lets you create attachments that
let render pass operations stay in tile memory, avoiding VRAM traffic and
potentially avoiding VRAM allocation for the textures.

[Tracking bug #462620664](https://issues.chromium.org/issues/462620664)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5562829589577728)
|
[Spec](https://gpuweb.github.io/gpuweb/#dom-gputextureusage-transient_attachment)

### WebGPU Compatibility mode

This mode adds an opt-in, lightly restricted subset of the WebGPU API that can
run older graphics APIs, for example, `OpenGL` and `Direct3D11`. By opting into
this mode and obeying its constraints, you can extend the reach of your `WebGPU`
applications to many older devices that don't have the modern, explicit graphics
APIs that core WebGPU requires. For simple applications, the only required
change is to specify the `compatibility` `featureLevel` when calling
`requestAdapter`. For more advanced applications, some modifications might be
necessary to accommodate the mode's restrictions. Since Compatibility mode is a
subset, the resulting applications are also valid WebGPU Core applications and
run even on user agents that don't support Compatibility mode.

[Tracking bug #442618060](https://issues.chromium.org/issues/442618060)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6436406437871616)
|
[Spec](https://github.com/gpuweb/gpuweb/blob/main/proposals/compatibility-mode.md)

## JavaScript

### Iterator sequencing

A TC39 proposal to create `iterators` by sequencing existing `iterators`. This
introduces `Iterator.concat` (`...items`).

[Tracking bug #434977727](https://issues.chromium.org/issues/434977727)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5193275975794688)
|
[Spec](https://github.com/tc39/proposal-iterator-sequencing)

### Selective permissions intervention

When you grant a website permission to access a powerful API (for example,
`Bluetooth`, `Camera`, `Clipboard`, `DisplayCapture`, `Geolocation`,
`Microphone`, `Serial`, and `USB`), your consent is intended for the site, not
necessarily for every third-party script running on the page. In particular,
embedded ad scripts running in the main frame or same-origin iframes can use the
page's permission to opportunistically access this sensitive data. You might not
be aware that an advertisement is accessing your information.

This intervention aims to better align a granted permission with your intent by
preventing ad script in a context with API permission from using it, reinforcing
your trust and control over your data.

[Tracking bug #435214052](https://issues.chromium.org/issues/435214052)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5138246835240960)
|
[Spec](https://github.com/w3c/webappsec-permissions-policy/pull/572)

### Preserve `dropEffect` values from `dragover` to `drop` Events

The `HTML5 Drag and Drop API` lets web applications handle drag-and-drop
operations through a series of events: `dragstart`, `dragenter`, `dragover`,
`dragleave`, `drop`, and `dragend`. During these events, the
[`dataTransfer.dropEffect`](https://www.w3.org/TR/2011/WD-html5-20110113/dnd.html#dom-datatransfer-dropeffect)
property indicates which operation (`copy`, `move`, `link`, or `none`) should be
performed.

According to the [`HTML5
specification`](https://www.w3.org/TR/2011/WD-html5-20110113/dnd.html#dndevents),
the `dropEffect` value set by web applications during the last `dragover` event
should be preserved and available in the subsequent `drop` event.

However, Chromium-based browsers were overwriting the web application's
`dropEffect` value with the browser's own negotiated operation before the `drop`
event fired, breaking specification compliance and limiting your control over
drag-and-drop behavior. This behavior has now been changed.

[Tracking bug #40068941](https://issues.chromium.org/issues/40068941)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5140028068069376)
|
[Spec](https://www.w3.org/TR/2011/WD-html5-20110113/dnd.html#dom-datatransfer-dropeffect)

## Multimedia

### Playback Statistics API for WebAudio

This feature adds an `AudioContext.playbackStats` attribute which returns an
`AudioPlaybackStats` object. This object provides audio playback statistics, for
example, `average latency`, `minimum/maximum latency`, `underrun duration`, and
`underrun count`. This API lets web applications monitor audio playback quality
and detect glitches.

**Note:** This feature was tracked as `AudioContext.playoutStats`. It has been
renamed to `AudioContext.playbackStats` to align with the final Web Audio API
specification. The old name is supported as a deprecated alias for backward
compatibility.

[Tracking bug #475838360](https://issues.chromium.org/issues/475838360)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5172818344148992)
|
[Spec](https://webaudio.github.io/web-audio-api/#AudioPlaybackStats)

## Network

### Data URL MIME Type Parameter Preservation

Preserve `MIME type parameters` (for example, `charset`, `boundary`) in data URL
`Content-Type` headers as specified in the `Fetch Standard`.

[Tracking bug #40487194](https://issues.chromium.org/issues/40487194)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/4874471565557760)
|
[Spec](https://fetch.spec.whatwg.org/#data-url-processor)

## Performance

### LCP: Match specced behavior for emitting candidates

The `LCP` algorithm now emits candidates based on the largest painted image
instead of the largest pending-but-not-yet-painted image. This might cause more
intermediate candidates to be emitted to the performance timeline.

In each animation frame, after it has been presented, the LCP algorithm emits
a new candidate (at most one) to the performance timeline if there is a new
largest text or image that was painted in that frame. The algorithm also tracks
the "largest pending image", which is the largest still-loading image, and
uses that image's size to determine whether the new candidate is largest. This
means a slow loading large image can prevent emission of intermediate LCP
candidates, and these candidates often provide useful information for you to
understand the loading progression.

This behavior emerged during Interop 2025 as a difference with other engines,
and the team agreed to align to emit at most one candidate per frame based on
the set of painted image and text elements for that frame.

[Tracking bug #482261053](https://issues.chromium.org/issues/482261053)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5167930847395840)
|
[Spec](https://github.com/w3c/largest-contentful-paint/pull/154)

## Security

### Sanitizer API

The Sanitizer API offers a way to remove content that might execute script from
arbitrary, user-supplied HTML content. The goal is to make it easier to build
XSS-free web applications.

[Tracking bug #40138584](https://issues.chromium.org/issues/40138584)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5814067399491584)
|
[Spec](https://wicg.github.io/sanitizer-api)

## Origin trials

### WebNN

`WebNN` lets web applications and frameworks take advantage of native operating
system services for machine learning and the underlying hardware capabilities
available on your computer to implement consistent, efficient, and reliable ML
experiences on the web.

[Origin Trial](https://developer.chrome.com/origintrials#/register_trial/2250110963824984065)
|
[Tracking bug #40206287](https://issues.chromium.org/issues/40206287)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5176273954144256)
|
[Spec](https://webmachinelearning.github.io/webnn)

### CPU Performance API

This API exposes information about your device's power. This API targets web
applications that use this information to provide an improved user experience,
possibly in combination with the Compute Pressure API, which provides
information about the device's CPU pressure or utilization and lets applications
react to changes in CPU pressure.

[Tracking bug #449760252](https://issues.chromium.org/issues/449760252)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5189864286978048)
|
[Spec](https://wicg.github.io/cpu-performance)

### Speculation rules: `form_submission` field

This extends `speculation rules` syntax, letting you specify the
`form_submission` field for `prerender`.

This field directs the browser to prepare the `prerender` as a form submission,
so it can be activated by real form submission navigations. For example, a
simple search form results in a `/search?q=XXX` GET request navigation; web
developers have requested support for this.

[Tracking bug #346555939](https://issues.chromium.org/issues/346555939)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5074313831120896)
|
[Spec](https://storage.googleapis.com/spec-previews/WICG/nav-speculation/pull/426/diff/prerendering.html)

## Focusgroup

The Focusgroup feature facilitates keyboard focus navigation among a set of
focusable elements by using the keyboard arrow keys.

Learn more about focusgroup in [Request for developer feedback: focusgroup](https://developer.chrome.com/blog/focusgroup-rfc).

[Origin Trial](https://developer.chrome.com/origintrials#/register_trial/4231694799868002305)
|
[Tracking bug #1286127](https://issues.chromium.org/issues/1286127)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5637601087193088)
|
[Spec](https://github.com/whatwg/html/pull/11723)
