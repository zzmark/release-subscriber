# Chrome 148

Source: [Chrome 148 Release Notes](https://developer.chrome.com/release-notes/148?hl=en)

**Attribution:** Google for Developers. Except as otherwise noted, article text is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and code samples under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0). The official HTML article was converted to Markdown.

**Stable release date:** May 5th, 2026

Unless otherwise noted, the following changes apply to Chrome 148 stable
channel release for Android, ChromeOS, Linux, macOS, and Windows.

Want just the highlights? Check out
[New in Chrome 148](https://developer.chrome.com/blog/new-in-chrome-148).

## CSS and UI

### CSS name-only container queries

A CSS query container can be queried based on its container-name only, and the
container does not need any container-type set:

```text
#container {
  container-name: --foo;
}
@container --foo {
  input { background-color: green; }
}
```

```text
<div id="container">
  <div><input></div>
</div>
```

Previously, `@container` required a container type in addition to the name.

[Tracking bug #40287550](https://issues.chromium.org/issues/40287550)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5184267522015232)
|
[Spec](https://drafts.csswg.org/css-conditional-5/#container-rule)

### At-rule: CSS feature detection

This feature adds an `at-rule()` function to CSS `@supports` which enables
authors to feature-detect support for CSS at-rules.

[Tracking bug #40211832](https://issues.chromium.org/issues/40211832)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5110744177836032)
|
[Spec](https://drafts.csswg.org/css-conditional-5/#support-definition-at-rules)

### Open Font Format avar2 text shaping and glyph rendering

Version 2 of the avar (Axis Variations) table enables font designers to create
variable fonts with better control over interpolation. While the original
variable font spec handles axes independently, avar2 allows axes to influence
one another. This leads to fonts that are easier to use for content authors to
use, and enable compact storage.

Avar2 works by using the same familiar concepts of font variations, but applies
the variable delta values to the design axis specifications itself. In addition, it
lets you do this over a range of multiple axes.

As an example, it lets font designers create "meta sliders" which control multiple
variation axes at once, alleviating the user from fine-tuning and finding a
useful corner of the font's design space.

Avar2 gives font designers better control over the usable variation space of
their font, and lets them coordinate the adjustment of design axes across several
axes.

By defining the relationships between axes mathematically within the avar
version 2 table, fonts can achieve complex designs with fewer masters, leading
to smaller file sizes, because the interpolation is stored more efficiently.

[Tracking bug #40246300](https://issues.chromium.org/issues/40246300)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5169590743203840)
|
[Spec](https://www.iso.org/standard/87621.html)

### The revert-rule keyword

The `revert-rule` keyword rolls back the cascade to the previous rule, similar to
how `revert-layer` rolls back the cascade to the previous layer. For example:

```text
div { color: green; }
div { color: revert-rule; /* Effectively green */ }
```

This is especially useful in combination with conditionals, because it lets you
eliminate the current rule if some condition is not met:

```text
div {
  display: if(style(--layout: fancy): grid; else: revert-rule);
}
```

[Tracking bug #393582263](https://issues.chromium.org/issues/393582263)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5146458504429568)
|
[Spec](https://drafts.csswg.org/css-cascade-5/#revert-rule-keyword)

### Lazy loading for video and audio elements

Adds the `loading` attribute to `<video>` and `<audio>` elements, letting
developers defer media resource loading until the element is near the
viewport using `loading="lazy"`. This matches the existing lazy loading behavior
for `<img>` and `<iframe>` elements, improving page load performance and
reducing data usage.

[Tracking bug #469111735](https://issues.chromium.org/issues/469111735)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5200068565139456)
|
[Spec](https://github.com/whatwg/html/pull/11980)

### `text-decoration-skip-ink: all`

Add support for the `all` value for the CSS `text-decoration-skip-ink` property.

The `text-decoration-skip-ink` property already supports `auto` and `none`. The
`all` value extends this by unconditionally applying ink-skipping to all glyphs
—including CJK characters—whereas `auto` leaves CJK characters un-skipped
because ink-skipping tends to produce undesirable visual results for
ideographic scripts at typical underline positions.

With `text-decoration-skip-ink: all`, developers who have adjusted
`text-underline-position` or `text-underline-offset` to avoid clashing with CJK
glyphs can explicitly opt in to ink-skipping for those characters as well.

[Tracking bug #40675832](https://issues.chromium.org/issues/40675832)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5077600085082112)
|
[Spec](https://drafts.csswg.org/css-text-decor-4/#text-decoration-skip-ink-property)

### Correctly set `dropEffect` for `dragEnter`, `dragLeave`, and `dragOver` events

The drag and drop specifications require the `dataTransfer`'s object
`dropEffect` attribute to have certain predetermined values on `dragEnter`,
`dragOver`, and `dragLeave`. Drag enter and drag over should have a `dropEffect`
based on the current `effectAllowed`, and `dragLeave` should always have a
`none` `dropEffect`. Currently, Chromium doesn't adhere to these rules. With the
launch of this feature, Chromium will start respecting the specification and
assigning the correct values to this attribute so that web developers can start
relying on it.

[Tracking bug #434151262](https://issues.chromium.org/issues/434151262)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6325617459068928)
|
[Spec](https://html.spec.whatwg.org/multipage/dnd.html#dndevents)

### Pointer event suppression on drag start

According to the HTML spec, when a drag starts the user agent should send the
appropriate events to the drag source to indicate that the pointer event stream
has ended, and that it shouldn't expect any more events from this pointer.
This code had been partially implemented for mouse events and fully implemented
for touch drags on Android. With the work in this feature, we aim to fully
satisfy this spec requirement on all other platforms. Practically, this means
that after a drag has started the drag source will now receive the
`pointercancel`, `pointerout`, and `pointerleave` events to indicate that the
current event stream has finished.

[Tracking bug #452372355](https://issues.chromium.org/issues/452372355)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6732314958757888)
|
[Spec](https://html.spec.whatwg.org/multipage/dnd.html#drag-and-drop-processing-model:~:text=Fire%20a%20pointer%20event%20at%20the%20source%20node%20named%20pointercancel%2C%20and%20fire%20any%20other%20follow%2Dup%20events%20as%20required%20by%20Pointer%20Events.%20%5BPOINTEREVENTS%5D)

## Capabilities

### Manifest localization

Supports localization of manifest members so apps can adapt their names,
descriptions, icons, and shortcuts to the user's language and region. Developers
provide localized values in the web app manifest, and the browser automatically
selects the appropriate resources based on the user's language settings,
introducing language support across different markets.

Learn more in [Localization support for web app manifests](https://developer.chrome.com/blog/manifest-localization).

[Tracking bug #380491647](https://issues.chromium.org/issues/380491647)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5090807862394880)
|
[Spec](https://www.w3.org/TR/appmanifest/#x_localized-members)

## Web on Android

### Web Serial API on Android

The Web Serial API provides an interface for connecting to serial devices,
either through a serial port on the user's system or removable USB and Bluetooth
devices that emulate a serial port. Now it is supported on Android.

Users, especially in the educational, hobbyist, and industrial sectors, connect
peripheral devices to their computers that require custom software to control.
For example, robotics are often used to teach computer programming and
electronics in schools. This requires software which can upload code to a robot
or control it remotely. In an industrial or hobbyist setting a piece of
equipment such as a mill, laser cutter or 3D printer is controlled by a program
running on a connected computer. These devices are often controlled by small
microcontrollers using a serial connection.

For more information, see the [Web Serial API guide on web.dev](https://web.dev/serial/) and the [Web Serial specification](https://wicg.github.io/serial/).

[Tracking bug #365514951](https://issues.chromium.org/issues/365514951)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6043992171085824)

### SharedWorker on Android

For a long time, SharedWorker has been disabled on Android due to concerns about
its unpredictable process lifecycle. SharedWorker instances might terminate unexpectedly, without notifying users or web developers.

However, a recent discussion on GitHub
(see the [GitHub discussion](https://github.com/whatwg/html/issues/11205)) suggests that the unpredictable
nature of SharedWorker's process lifecycle might not be as significant an issue
as previously thought. Based on this, SharedWorker is being re-enabled on Android
while this behavior is investigated to ensure a stable and reliable
experience.

[Tracking bug #40290702](https://issues.chromium.org/issues/40290702)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6265472244514816)
|
[Spec](https://html.spec.whatwg.org/multipage/workers.html#shared-workers-and-the-sharedworker-interface)

## Web APIs

### WebGPU: `linear_indexing` feature

This feature adds functionality to the WebGPU spec after its first shipment in a browser.

Adds two new compute shader built-in values for user quality of life. These are
implemented for all backends (as polyfills of existing built-in values).

[Tracking bug #482840564](https://issues.chromium.org/issues/482840564)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5071243424432128)
|
[Spec](https://github.com/gpuweb/gpuweb/pull/5554)

### Web Authentication Immediate UI mode

A new mode for `navigator.credentials.get()` that causes browser sign-in UI to be
displayed to the user if there is a passkey or password for the site that is
immediately known to the browser, or else rejects the promise with
`NotAllowedError` if there is no such credential available. This allows the site
to avoid showing a sign-in page if the browser can offer a choice of sign-in
credentials that are likely to succeed, while still allowing a traditional
sign-in page flow for cases where there are no such credentials.

[Tracking bug #408002783](https://issues.chromium.org/issues/408002783)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5164322780872704)
|
[Spec](https://github.com/w3c/webauthn/pull/2291)

### Get Secure Payment Confirmation capabilities

Adds a new static method to the Payment Request that lets web developers
get the capabilities of the browser's implementation of Secure Payment
Confirmation.

This helps web developers know what capabilities are available for
Secure Payment Confirmation so they can decide whether or not they want to use
Secure Payment Confirmation with those capabilities.

[Tracking bug #484043990](https://issues.chromium.org/issues/484043990)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/4727235745546240)
|
[Spec](https://w3c.github.io/secure-payment-confirmation/#sctn-secure-payment-confirmation-capabilities)

### Extended lifetime shared workers

This update adds a new option, `extendedLifetime: true`, to the `SharedWorker`
constructor. This new option requests that the shared worker be kept alive even
after all current clients have unloaded. This lets pages perform
asynchronous work that requires JavaScript after a page unloads, without needing
to rely on a service worker.

[Tracking bug #400473072](https://issues.chromium.org/issues/400473072)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5138641357373440)
|
[Spec](https://github.com/whatwg/html/commit/9c009049e4fa9dba638ef68ca502b781082bbb68)

### Prompt API

The Prompt API gives web developers direct access to a browser-provided on-device AI
language model. The API design offers fine-grained control, aligned with cloud
API shapes, for progressively enhancing sites with model interactions tailored
to individualized use cases. This complements task-based language model APIs,
for example, Summarizer API, as well as a variety of APIs and frameworks for
generalized on-device inference with developer-supplied ML models.

The initial implementation supports text, image, and audio inputs. In addition,
response constraints ensure that generated text conforms with predefined regular expression and JSON schema formats.

This supports a variety of use cases, from generating image captions and
performing visual searches to transcribing audio, classifying sound events,
generating text following specific instructions, and extracting information or
insights from multi-modal source material.

[Tracking bug #417526788](https://issues.chromium.org/issues/417526788)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5134603979063296)
|
[Spec](https://webmachinelearning.github.io/prompt-api)

## Network and connectivity

### IDNA ContextJ rules

IDNA is the mechanism for non-ASCII characters in domain names. It encodes a URL
like `http://네이버.한국/` as `http://xn--950bt9s8xi.xn--3e0b707e/` (a redirect to
naver.com).

The URL specification sets the `CheckJoiners` flag, which enables the `ContextJ`
rules in `IDNA2008`. This disallows `ZWNJ` (U+200C ZERO WIDTH NON-JOINER) and `ZWJ` (U+200D ZERO
WIDTH JOINER) in most places in URLs. The implementation passes the
`UIDNA_CHECK_CONTEXTJ` option to ICU, where this rule is implemented.

[Tracking bug #40765949](https://issues.chromium.org/issues/40765949)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6295810820145152)
|
[Spec](https://url.spec.whatwg.org/#idna)

### Reuse no-store images on same-src reassignment

Allow same-document available-image reuse to bypass Cache-Control: no-store
reload when the same src value is reassigned to an `<img>` element. Previously,
Blink would re-fetch the image even though it was already decoded and available
in the document. This aligns with existing Gecko and WebKit behavior.

[Tracking bug #486562295](https://issues.chromium.org/issues/486562295)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5206171399094272)
|
[Spec](https://html.spec.whatwg.org/multipage/images.html#available-images)

## Performance

### ContentType in Resource Timing

Adds the `contentType` field to `PerformanceResourceTiming` to hold a string
corresponding to the Content-Type HTTP header of the fetched resource as returned by the
server.

[Tracking bug #1366706](https://issues.chromium.org/issues/1366706)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5156068351541248)
|
[Spec](https://github.com/w3c/resource-timing/pull/341)

### WebRTC Datachannel: Always negotiate data channels

Implements a WebRTC extension `alwaysNegotiateDataChannels` which defines a way
for the application to negotiate data channels in the SDP offer before creating
a datachannel. This also negotiates the data m= section before any audio or
video m sections and uses it as the "offerer-tagged `m=` section" for `BUNDLE`.

This means that:

```text
const pc = new RTCPeerConnection({ alwaysNegotiateDataChannels: true });
const offer = await pc.createOffer();
```

will create an offer with an application m-line in the SDP and that:

```text
const pc = new RTCPeerConnection({ alwaysNegotiateDataChannels: true });
pc.addTransceiver('audio');
pc.createDataChannel('somechannel');
const offer = await pc.createOffer();
```

will create an offer that negotiates an application m-line followed by an audio
m-line in the SDP.

[Tracking bug #433898678](https://issues.chromium.org/issues/433898678)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5113419982307328)
|
[Spec](https://w3c.github.io/webrtc-extensions/#always-negotiating-datachannels)

## New origin trials

### Declarative CSS module scripts

Declarative CSS Modules Scripts are an extension of the existing script-based
CSS Module Scripts. They allow for developers to share declarative stylesheets
with shadow roots, including declarative shadow roots. Developers can define
inline style modules with `<style type="module" specifier="foo">` and apply a
declarative module to a declarative shadow DOM by referencing specifier or a
URL, such as `<template shadowrootmode="open"
shadowrootadoptedstylesheets="foo">`.

[Origin Trial](https://developer.chrome.com/origintrials/#/register_trial/1550927121675714561)
|
[Tracking bug #448174611](https://issues.chromium.org/issues/448174611)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/4790543041298432)
|
[Spec](https://github.com/whatwg/html/pull/11687)

### Container Timing API

The
[Container Timing API](https://developer.chrome.com/blog/container-timing-origin-trial)
enables monitoring when annotated sections of the DOM
are displayed on screen and have finished their initial paint. A developer will
have the ability to mark subsections of the DOM with the `containertiming`
attribute (similar to `elementtiming` for the Element Timing API) and receive
performance entries when that section has been painted for the first time. This
API will allow developers to measure the timing of various components in their
pages.

[Origin Trial](https://developer.chrome.com/origintrials/#/register_trial/3312960475884421121)
|
[Tracking bug #382422286](https://issues.chromium.org/issues/382422286)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5110962817073152)
|
[Spec](https://WICG.github.io/container-timing)

### Web app HTML install element

Allows a website to declaratively prompt users to install a web app. The element
optionally accepts two attributes which allows installation of content from a
different origin.

[Origin Trial](https://developer.chrome.com/origintrials/#/register_trial/506092008125759489)
|
[Tracking bug #454827186](https://issues.chromium.org/issues/454827186)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5152834368700416)
|
Spec (link invalid on the official page)

### Long Animation Frames style duration

Add `styleDuration` and `forcedStyleDuration` information to the Long Animation
Frame API, enabling developers to distinguish style and layout times.

[Origin Trial](https://developer.chrome.com/origintrials/#/register_trial/3997507619244736513)
|
[Tracking bug #476826067](https://issues.chromium.org/issues/476826067)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5171478175809536)
|
[Spec](https://github.com/w3c/long-animation-frames/pull/30)

### HTML-in-canvas

HTML-in-canvas enables customizing the rendering of html using canvas with three
new primitives: an attribute to opt-in canvas elements (`layoutsubtree`), methods
to draw child elements (2d: `drawElementImage`, webgl: `texElementImage2D`, webgpu:
`copyElementImageToTexture`), and a paint event which fires to handle updates.

[Origin Trial](https://developer.chrome.com/origintrials/#/register_trial/3478467762190286849)
|
[Tracking bug #500967896](https://issues.chromium.org/issues/500967896)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5172548013916160)
|
[Spec](https://github.com/whatwg/html/pull/11588)

### Connection Allowlists

Connection Allowlists is a feature designed to provide explicit control over
external endpoints by restricting connections initiated using the Fetch API or
other web platform APIs from a document or worker.

The proposed implementation involves the distribution of an authorized endpoint
list from the server through an HTTP response header. Prior to the establishment
of any connection by the user agent on behalf of a page, the agent will evaluate
the destination against this allowlist; connections to verified endpoints will
be permitted, while those failing to match the entries in the list will be
blocked.

[Origin Trial](https://developer.chrome.com/origintrials/#/register_trial/2487675844168777729)
|
[Tracking bug #447954811](https://issues.chromium.org/issues/447954811)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/5175745573945344)
|
[Spec](https://wicg.github.io/connection-allowlists)

### Prompt API sampling parameters

Adds sampling parameters to the Prompt API. These control how tokens are sampled
from the model, giving developers control over the "creativeness" or
"randomness" of the output. Additionally, it adds attributes to the
`LanguageModel` instance to read the set values, as well as a static `LanguageModel`
function to get the default and max values of these parameters.

The first implementation adds `temperature` and `topK` parameters.

[Origin Trial](https://developer.chrome.com/origintrials/#/register_trial/4469259680211795969)
|
[Tracking bug #496663356](https://issues.chromium.org/issues/496663356)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6325545693478912)
|
[Spec](https://webmachinelearning.github.io/prompt-api)

### Parse processing instructions in HTML

Processing instructions (syntax: `<?target data>`) are an existing DOM construct,
exposed in XML, that allows node objects that are not elements but can have some
semantic meaning for the processing of a document.

For example, they can be used to denote ranges for streaming or highlighting
without requiring new DOM elements and changing the DOM structure as far as CSS
is concerned, or as directives for the HTML parser about how to buffer and stream.

[Tracking bug #481087638](https://issues.chromium.org/issues/481087638)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6534495085920256)

### OpaqueRange

`OpaqueRange` represents a live span of text within a form control's value,
such as a `<textarea>` or text-based `<input>`, so developers can work with
value text using range-like APIs.

It enables operations such as `getBoundingClientRect()`, `getClientRects()`,
and integration with the CSS Custom Highlight API for UI such as inline suggestions,
highlights, and anchored popovers. It preserves encapsulation by exposing only
value offsets while returning `null` for `startContainer` and `endContainer`,
so DOM endpoints and internal structure are not exposed.

[Origin Trial](https://developer.chrome.com/origintrials/#/register_trial/1731071106770534401)
|
[Tracking bug #421421332](https://issues.chromium.org/issues/421421332)
|
[ChromeStatus.com entry](https://chromestatus.com/feature/6297362687066112)
