## @hyperdx/app@2.33.0

### Minor Changes

- 8aeb2f32: Add a read-only kiosk mode for dashboards with a minimal header and automatic
  live refresh for static displays.
- b1e4e1d9: feat: Accept source names in addition to IDs in URL Params

### Patch Changes

- b1e4e1d9: fix: Disable invalid autocomplete query while source loads
- b2165b41: feat(dashboards): opt-in linked (faceted) filter values

  Dashboard and Kubernetes filter bars gain a "link filters" toggle (the
  bidirectional-arrow button at the end of the bar). When enabled, each filter
  dropdown only shows values that co-occur with the other current selections —
  e.g. picking a `cluster` narrows the `namespace` dropdown to namespaces in that
  cluster (the K8s bar also factors in the free-text search). A filter never
  constrains its own options, so multi-select still works. It is off by default
  because contingent value lookups can't use the cheap per-key rollups and are
  more expensive at scale; when on, all of a source's facets are computed in a
  single `groupUniqArrayIf` scan rather than one query per filter. Search-page
  filters are unaffected.

- cacdfe98: feat: Support source name deeplinks on additional pages
- 7914ec09: Fix the time-chart tooltip: clicking outside the chart now unpins the pinned
  tooltip, the pin always stacks above hover tooltips, and a many-series hover
  tooltip is clamped to a bounded height instead of overflowing the chart (pin it
  to scroll through every series).
- 9327396c: Fix saved-search navigation so newly created searches reliably load their stored
  configuration.
- ab190d16: chore: move usage stats tracking to Reo.dev
- e231d72e: fix: Stop requesting additional search pages while a query is in an error state.
  A failed page (for example a ClickHouse query timeout on a slow time window)
  previously kept `hasNextPage` true, so the table re-issued the failing query and
  stayed in a loading state that hid the error and reported zero results.
- ec161d70: feat: move the dashboard tile fullscreen action to a top-level toolbar icon

  The View fullscreen action now sits directly in the tile toolbar as an icon instead of inside the "More actions" menu, so it is one click instead of two. Narrow tiles that collapse the toolbar keep it in the menu, and the `f` shortcut is unchanged.

- 7b3e6d28: fix: draw an isolated dashboard series even when it ranks beyond the line cap

  Isolating (or search/checkbox filtering) a time-chart series that sits beyond the per-chart line-render cap left the chart empty, because the cap was applied before the selection filter. The selection now wins over the cap, so an explicitly chosen series always renders, and an oversized manual selection is still bounded by the cap.

- fa1a0687: feat: Warn on missing params/macros in SQL Editor
- Updated dependencies [017c296e]
- Updated dependencies [874a5e95]
- Updated dependencies [0e280949]
- Updated dependencies [1b658f3c]
- Updated dependencies [fa1a0687]
  - @hyperdx/api@2.33.0
  - @hyperdx/common-utils@0.24.1

## @hyperdx/common-utils@0.24.1

### Patch Changes

- fa1a0687: feat: Warn on missing params/macros in SQL Editor

## @hyperdx/api@2.33.0

### Minor Changes

- 874a5e95: feat(mcp): add source and webhook management tools so the ingest → dashboard flow can be automated end to end. New MCP tools: `clickstack_save_source` / `clickstack_delete_source` and `clickstack_save_webhook` / `clickstack_delete_webhook` (save creates when `id` is omitted and updates when provided). Webhook logic is now shared via `createWebhook` / `updateWebhook` / `deleteWebhook` controllers: `createWebhook` is used by the internal API, External API v2, and MCP; `updateWebhook` / `deleteWebhook` are shared by External API v2 and MCP (the internal API retains its own masked-secret update/delete flow).

  `clickstack_describe_source` now returns a round-trippable `config` block — the exact flat shape `clickstack_save_source` accepts, including fields the curated summary previously omitted (correlation IDs `logSourceId`/`traceSourceId`/`metricSourceId`/`sessionSourceId`, `defaultTableSelectExpression`, `parentSpanIdExpression`, `spanKindExpression`, materialized views, etc.). This closes the read/write asymmetry that made a faithful source clone impossible: an agent can read a source's full config back and pass it straight into `clickstack_save_source` to clone or read-modify-write it.

  fix(alerts): a generic/incidentio webhook persisted without a body (the body default is only applied by the UI form, not the API/MCP create paths) no longer crashes `sendGenericWebhook` on `Handlebars.compile(undefined)`. It now falls back to the default body template so the alert still fires.

### Patch Changes

- 017c296e: fix: Fix DataCloneError from MCP grouped bar/pie query
- 0e280949: fix: MCP endpoint (`/api/mcp`) now returns 405 for GET and DELETE instead of aborting spec-compliant clients. The stateless Streamable HTTP transport doesn't offer a server-initiated SSE stream or client-terminable sessions, so it now responds `405 Method Not Allowed` (with `Allow: POST`) for those methods, which official MCP SDK clients (e.g. Claude Code) treat as "not offered, continue" rather than a failed connection.
- 1b658f3c: fix: Handle per-connection failures in alerts task without exiting
- Updated dependencies [fa1a0687]
  - @hyperdx/common-utils@0.24.1
