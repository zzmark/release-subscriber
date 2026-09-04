## @hyperdx/app@2.32.0

### Minor Changes

- f5dafcc2: feat: add a "What's new" item to the Help menu that opens the app's changelog rendered as Markdown
- 7a4ad986: feat: upgrade filters and autocomplete to intelligently route queries through the best rollup
- 7d806fb8: Add per-column color to dashboard table tiles. On builder table tiles you can
  now set a static color on a column and layer ordered conditional rules (for
  example `> 500` turns the cell red), the table-cell counterpart of the
  number-tile color. Rules are authored from the column editor and applied per
  cell at render, reusing the existing palette tokens so colors reflow across
  light and dark themes.

### Patch Changes

- de2c8a0c: feat: Show exponential histogram metrics in the metric name drop-down, gated behind `NEXT_PUBLIC_ENABLE_EXPONENTIAL_HISTOGRAMS`.
- fcdcd781: feat(dashboards): expand the out-of-the-box Browser RUM dashboard with two new
  sections.

  **Sessions**: a **Recent Sessions** table lists client-side sessions (page
  views, errors, distinct traces, user, service, last-active time) ordered by
  recency; clicking a row drills into the Traces search view filtered to that
  session, surfacing its client-side spans (the client-side trace).

  **Memory**: per-page JS heap tiles (median and p90 used heap, plus a "Memory by
  Page" table) sourced from `performance.memory.*` attributes on `documentLoad`
  spans. These reflect Chromium visitors only (Firefox/Safari don't expose
  per-page memory) and require a Browser SDK build that emits the heap attributes.

  Implemented entirely via existing tile mechanisms (table `onClick`
  drill-through, Markdown tiles, byte number-format) — no renderer changes.

- dbe14965: fix: clear the VirtualMultiSelect search input after selecting a value
- e6e0907f: Detail drawers now close when you click outside of them. On Search and Sessions,
  clicking outside the results table / session list dismisses the open drawer;
  clicks inside the drawer, its nested popups/modals, or the results table keep it
  open. This is on by default for row-table side panels (opt out with
  `closeOnClickOutside={false}`).
- 4372c78c: fix(mcp): update the Codex CLI install snippet to the current `codex mcp add --url ... --bearer-token-env-var ...` syntax
- cad749f0: feat: Show a snap grid while dragging or resizing a dashboard tile

  While a dashboard tile is dragged or resized, the grid it snaps to is drawn behind the tiles and the cells where the tile will land are highlighted, so the drop target is clear. The highlight follows where the tile actually settles, including when the grid compacts it away from the cursor, rather than the raw cursor position. The overlay uses the same geometry as react-grid-layout, appears once the tile starts moving, and clears on release.

- ce8fb022: feat: Add semantic component variants wired to the design tokens. `Text` gains `warning`/`success` variants and `Alert` gains `info`/`success`/`warning`/`danger` variants (alongside the existing `danger` for `Button`/`ActionIcon`). Alerts and soft controls use new scheme-aware `--color-bg-*-subtle` (+ `-subtle-hover`) background tokens — lighter tints in light mode, deeper tints in dark mode — with the title, icon, and body text rendered in the semantic color token. Text colors are tuned to meet WCAG AA (4.5:1) on those tints in both schemes. Applies to both the HyperDX and ClickStack themes (ClickStack's `warning` is orange-based since it remaps `yellow` to the brand gold), with new Storybook stories (Components/Alert, Design Tokens/Semantic Variants).
- eadea332: feat: surface OpenTelemetry span links in the trace view. Trace sources gain an
  optional `spanLinksValueExpression` field (auto-detected from the OTel `Links`
  column), and the span detail panel shows a new "Span Links" section. Each link
  has an "Open trace" action that opens the linked trace in place in the same
  panel, with a breadcrumb trail you can step back through, and shows the link's
  trace state and attributes as chips.
- 9cb69915: feat(dashboard): table tile header separator and optional alternate row background

  Add an always-on separator between a table tile's sticky header and its rows so the boundary stays clear as rows scroll underneath. Add a new **Alternate Row Background** display setting (off by default) that zebra-stripes table tiles for easier scanning on wide tables. Both work in light and dark color modes.

- 7a47664e: fix: Improve the trace/span detail UI (HDX-4853)

  - Long span attribute values with no break points (e.g. `url.path`) now wrap
    fully when wrap mode is on instead of being clipped.
  - Long attribute keys (e.g. `longtask.attribution.entry_type`) now wrap and
    are capped at half the row width so they can't squeeze the value column to
    nothing.
  - Add a toggle to move the selected span's detail panel between the right side
    (default) and the bottom of the waterfall, restoring the older top/bottom
    layout.
  - The span detail panel's Overview/Column Values content now aligns flush
    with the tab bar instead of being inset by extra padding.

- ce8fb022: feat: Add `--color-text-warning` semantic color token based on Mantine's yellow for HyperDX and ClickStack themes, and register it in the Semantic Colors Storybook story. Dark mode uses `yellow-3`; light mode darkens `yellow-9` via `color-mix` so warning text meets WCAG AA (~4.7:1) on light backgrounds (plain yellow-9 is only ~3:1). ClickStack pins the default Mantine yellow as hex because its `yellow` palette is remapped to the brand gold, keeping the warning color consistent across both themes.
- Updated dependencies [01508d1d]
- Updated dependencies [ad27a513]
- Updated dependencies [00eef721]
- Updated dependencies [641175d8]
- Updated dependencies [00eef721]
- Updated dependencies [7a4ad986]
- Updated dependencies [eadea332]
- Updated dependencies [9cb69915]
- Updated dependencies [7d806fb8]
- Updated dependencies [f5f9cd19]
- Updated dependencies [5dd6facb]
  - @hyperdx/api@2.32.0
  - @hyperdx/common-utils@0.24.0

## @hyperdx/common-utils@0.24.0

### Minor Changes

- 7a4ad986: feat: upgrade filters and autocomplete to intelligently route queries through the best rollup
- 7d806fb8: Add per-column color to dashboard table tiles. On builder table tiles you can
  now set a static color on a column and layer ordered conditional rules (for
  example `> 500` turns the cell red), the table-cell counterpart of the
  number-tile color. Rules are authored from the column editor and applied per
  cell at render, reusing the existing palette tokens so colors reflow across
  light and dark themes.

### Patch Changes

- ad27a513: fix: Support grouping histogram quantile aggregations over non-Attribute columns
- 00eef721: feat: Support count aggregations over exponential histogram metrics
- 00eef721: feat: Implement quantile for exponential histogram metrics
- eadea332: feat: surface OpenTelemetry span links in the trace view. Trace sources gain an
  optional `spanLinksValueExpression` field (auto-detected from the OTel `Links`
  column), and the span detail panel shows a new "Span Links" section. Each link
  has an "Open trace" action that opens the linked trace in place in the same
  panel, with a breadcrumb trail you can step back through, and shows the link's
  trace state and attributes as chips.
- 9cb69915: feat(dashboard): table tile header separator and optional alternate row background

  Add an always-on separator between a table tile's sticky header and its rows so the boundary stays clear as rows scroll underneath. Add a new **Alternate Row Background** display setting (off by default) that zebra-stripes table tiles for easier scanning on wide tables. Both work in light and dark color modes.

- f5f9cd19: fix: Aggregate histogram metrics across selected range for non-timeseries charts

## @hyperdx/api@2.32.0

### Patch Changes

- 01508d1d: fix: Improve and standardize webhook URL validation

  ### `WEBHOOK_HOSTNAME_ALLOWLIST`

  Use this optional setting to permit webhook delivery to a hostname or private/reserved IP address that the SSRF validator would otherwise block. Values are comma-separated. A hostname entry also permits its subdomains, while an IPv4 or IPv6 entry matches only that exact address. The allowlist does not bypass protocol validation, Slack hostname validation, or the exact host-and-port block for configured ClickHouse and MongoDB services.

  For example, this permits `localhost`, any `*.hooks.localhost` hostname, the exact IPv4 address `10.0.0.1`, and the exact IPv6 address `fd00::1`:

  ```env
  WEBHOOK_HOSTNAME_ALLOWLIST=localhost,hooks.localhost,10.0.0.1,fd00::1
  ```

- 641175d8: Add MCP client name and version attributes to tool-invocation spans.
- 00eef721: feat: Implement quantile for exponential histogram metrics
- eadea332: feat: surface OpenTelemetry span links in the trace view. Trace sources gain an
  optional `spanLinksValueExpression` field (auto-detected from the OTel `Links`
  column), and the span detail panel shows a new "Span Links" section. Each link
  has an "Open trace" action that opens the linked trace in place in the same
  panel, with a breadcrumb trail you can step back through, and shows the link's
  trace state and attributes as chips.
- 5dd6facb: feat: Add exponential histogram metrics support to MCP
- Updated dependencies [ad27a513]
- Updated dependencies [00eef721]
- Updated dependencies [00eef721]
- Updated dependencies [7a4ad986]
- Updated dependencies [eadea332]
- Updated dependencies [9cb69915]
- Updated dependencies [7d806fb8]
- Updated dependencies [f5f9cd19]
  - @hyperdx/common-utils@0.24.0
