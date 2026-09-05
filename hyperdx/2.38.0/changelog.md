## @hyperdx/app@2.38.0

### Minor Changes

- 503aac82: Show GPU utilization and GPU memory utilization charts in the log/span side
  panel Infrastructure section when `hw.gpu.*` metrics (OTel hardware semconv)
  exist for the correlated host/node. Multiple GPUs on a host render as separate
  series grouped by `hw.id`, and utilization is split per GPU engine by
  `hw.gpu.task` (general/encoder/decoder) so a node saturated on video encode is
  still visible; a missing task is reported as `general`. The section is fully
  hidden when no GPU metrics are present and partially rendered when only one
  metric is available.

  The Infrastructure tab now also treats a Kubernetes resource attribute that is
  present but empty (for example `k8s.node.name: ""`) as absent. Such rows
  previously surfaced an Infrastructure tab that could render nothing.

  Fix GPU chart availability leaking across rows: switching the side panel to a
  row on a different host briefly rendered the previous host's set of GPU
  charts, because the availability query keeps the prior result readable while
  the new one runs.

- 38e99a37: Add a read-time, schema-agnostic LLM observability dashboard at `/llm` (beta, linked from the dashboards list) — no ingestion changes required, and it works retroactively on already-ingested telemetry. Traces instrumented with the OTel GenAI semantic conventions, OpenLLMetry, OpenInference, or the Vercel AI SDK are interpreted at query time to chart traffic, token split (uncached/cached/cache-write/output/reasoning), estimated cost by model (bundled price catalog with cache-read discounts and cache-write premiums; an instrumentation-provided cost attribute always wins), latency/TTFT, tool analytics, per-session timelines with lazy-loaded conversation views, and side-by-side LLM span/log search. Aggregations elect an app's own cost-reporting spans as the authoritative per-call reporters so apps emitting several instrumentation dialects in parallel (e.g. opencode emitting OpenInference and Vercel AI spans for each call) are counted once — verified to match opencode's self-reported session cost exactly.

### Patch Changes

- 3f7934a5: chore: Add isSourceAllowed prop to SourceSelectControlledComponent
- b917308d: fix: metric names in the chart editor are now listed deterministically instead of sampled. The dropdown discovered names with `groupUniqArray(3000)(MetricName)`, which keeps an arbitrary subset once a metrics table holds more than 3000 distinct names — the survivors follow hash order, not name order — so metrics that exist and are actively reporting could be unselectable, with no warning and no way to search for what had been dropped. Names are now fetched with an ordered, paginated query and matched server-side, ranked so an exact match is always on the first page, and the dropdown says when the list is incomplete. Also fixes the metric list ignoring the chart's selected time range, which pinned it to the last 24 hours.
- bf4443df: feat: Support autocomplete for PromQL label filters
- 55db91fa: feat: Support static filters in MCP
- 89a897ec: Fixed single-series histogram charts failing with "Unknown expression or function identifier" when sorted by a group-by column or expression. The histogram translation packs group values into a single `group` Array, so the table default ORDER BY (the raw group-by text) referenced source columns that no longer exist in scope; matched sort items now address the packed array positionally.
- fbb1e20f: Preserve conditional color rules for SQL and PromQl chart configs
- 020e85f3: Fix two problems with the chart editor's metric name picker. The truncation and load-failure notices now render below the input instead of above it, so they no longer push the field down out of alignment with the browse-metrics button beside it, and both were shortened to fit the tile editor's column without wrapping. A search that matches nothing now says so rather than silently hiding the dropdown, and offers the searched name as a selectable option — the catalog only covers the most recent three days of the chart's time range, so a metric that stopped reporting was previously impossible to chart by name.
- f1062a7b: Fixed multi-series metric charts failing with "Unknown expression or function identifier" when sorted by an expression group-by (e.g. `ResourceAttributes['service.name']`). Table tiles default their ORDER BY to the group-by text, so any multi-series metric table grouped by a resource/attribute-derived expression failed to render. Such sort expressions are now evaluated inside each per-series branch through internal companion columns instead of being re-evaluated in the composed outer query, where the source columns no longer exist.
- cdcb023e: fix: Reliably show service name and level in pattern sample drawer
- 0ebb689a: fix: De-dupe PromQL labels and values to prevent Mantine crash
- 4184a898: feat: Support dashboard filters based on Prometheus label values
- 27360036: feat: Support series filter (matcher) in PromQL label dashboard filters
- bcf0257c: feat: Accept optional time bounds on Prometheus label values endpoint
- c7965927: feat: Support a custom template for PromQL series legends
- 83c1b57f: feat: Display static value filters
- 66f6cf0b: Add a `window.hdx` browser-console debug handle and a "Copy debug info" action in the Help menu, so you can confirm which build is deployed and grab the context worth attaching when filing an issue. `window.hdx.report()` (and the Help menu action) produces a pasteable summary: frontend version (from package.json), backend/API version (from `/api/health` — the two deploy separately), deployment mode, user/team ids, enabled env-configurable feature flags, current URL, screen/viewport/OS/browser info, and the RUM session id. The handle is installed once and reads its async fields (server version, identity, features, session id) live via getters.
- cff6388c: feat: Add static filters to schemas and APIs
- 53336f78: fix(charts): show decimals on Y-axis ticks under 10 in magnitude

  The Y-axis of a time series chart (and the CLI's termchart equivalent)
  always rounded tick labels to 0 decimal places, regardless of the chart's
  Number Format settings. Charts whose values live under 1 (fractional
  gauges, ratios, sub-1 rates) rendered every axis tick as `0` even though
  the tooltip and legend showed the correct value.

  A tick under 10 in magnitude (as displayed - a percent tick's magnitude is
  checked against its ×100 value, not its raw 0-1 ratio) now honors the
  chart's configured decimals, capped at 2 to keep the label within the
  axis's fixed width. A tick of 10 or more, and a tick of exactly 0, stay
  integers exactly as before, whatever the chart's Number Format configures

  - so ordinary counts and the byte/percent tiles in the bundled dashboard
    templates are unaffected.

- 25a3b015: List every supported template variable in the webhook form, including the
  enriched set added to Generic and incident.io bodies (`{{alertId}}`,
  `{{status}}`, `{{alertType}}`, `{{comparator}}`, `{{threshold}}`,
  `{{thresholdMax}}`, `{{value}}`, `{{groupKey}}`, `{{sourceQuery}}`,
  `{{teamId}}`, `{{note}}` and ISO-8601 `{{startTimeISO}}` / `{{endTimeISO}}`).
  Each variable now carries a one-line description, so a webhook body can be
  written without leaving the form.
- 0a187457: feat: Allow creation and editing of static list filters in the UI
- Updated dependencies [74c28e7f]
- Updated dependencies [25a3b015]
- Updated dependencies [9c4f94f2]
- Updated dependencies [808b3453]
- Updated dependencies [b917308d]
- Updated dependencies [bf4443df]
- Updated dependencies [55db91fa]
- Updated dependencies [89a897ec]
- Updated dependencies [f0d1cef5]
- Updated dependencies [f1062a7b]
- Updated dependencies [4184a898]
- Updated dependencies [27360036]
- Updated dependencies [7ed8dc8c]
- Updated dependencies [bcf0257c]
- Updated dependencies [c7965927]
- Updated dependencies [d9c5c455]
- Updated dependencies [cff6388c]
  - @hyperdx/api@2.38.0
  - @hyperdx/common-utils@0.28.1

## @hyperdx/api@2.38.0

### Minor Changes

- 74c28e7f: feat: Alerts now persist their own `displayName` and `tags`
- 9c4f94f2: Add enriched template variables to Generic and incident.io webhook bodies:
  `{{alertId}}`, `{{status}}`, `{{alertType}}`, `{{comparator}}`, `{{threshold}}`,
  `{{value}}`, `{{groupKey}}`, `{{sourceQuery}}`, `{{teamId}}`, `{{note}}`, and
  ISO-8601 `{{startTimeISO}}` / `{{endTimeISO}}` alongside the existing Unix-ms
  `{{startTime}}` / `{{endTime}}`.

  Receivers can now route, filter and dedupe on an alert's identity and condition
  without parsing the rendered message body. Existing templates are unaffected —
  every new variable is additive and renders empty when an alert doesn't carry it.

- f0d1cef5: Support inline chart alerts (source `inline` + `chartConfig`) in the external
  API v2 and the MCP `clickstack_save_alert` / `clickstack_get_alert` tools.
  Inline alerts can now be created, updated, listed, and deleted through
  `/api/v2/alerts` using the same tile-config dialect as v2 dashboards, with the
  same validation rules as the internal API: display-type allowlist, metric
  formula validation, the formula source-kind gate, raw SQL template validation,
  and team-scoped source/connection ownership. Passing a `chartConfig` to a
  `tile` or `saved_search` alert is now rejected instead of silently dropped,
  and reading an inline alert whose config carries internal-only fields omits
  `chartConfig` rather than returning a lossy approximation.

  Also fixes three pre-existing issues on the external v2 dashboards path: a
  gauge tile saved through `clickstack_save_dashboard` with `isDelta: true` was
  persisted as a non-delta (the flag was dropped converting MCP tiles to the
  internal shape); a tile config carrying an unrecognized `configType` (e.g.
  `promql`) was silently stored as a builder config and skipped the formula and
  number-select rules, and is now rejected; and validation errors on alert
  bodies no longer collapse to `Invalid input` — the schema reports the failing
  branch's own message.

- d9c5c455: fix: preserve a Connection host path prefix when proxying PromQL.
  `proxyToPrometheus` joined absolute Prometheus paths (`/api/v1/query_range`,
  `/api/v1/query`, `/api/v1/query_exemplars`, `/api/v1/label/.../values`) with
  `new URL(path, host)`, which replaces the host pathname instead of appending to
  it. VictoriaMetrics cluster `vmselect` URLs such as
  `http://vmselect:8481/select/0/prometheus` were rewritten to
  `/api/v1/query_range` and rejected. The join now keeps the existing pathname.

  This is a behavior change for Connections whose host already included a path
  that was never meant as a Prometheus API prefix — for example
  `http://prom:9090/graph` copied from the Prometheus UI. That previously happened
  to work because the absolute API path replaced `/graph`; requests now go to
  `/graph/api/v1/query_range` and will 404. Trim stray paths from existing
  Connection hosts before upgrading. Root-mounted hosts (`http://prom:9090` or
  `http://prom:9090/`) are unchanged.

  Query parameters on the Connection host are now only a fallback for a fixed set
  of real Prometheus API params (`query`, `time`, `start`, `end`, `step`,
  `match`/`match[]`, `limit`, `timeout`, `stats`): a request value for one of
  these (including repeatable ones such as `match[]`) always wins and replaces a
  same-named host value outright, rather than being dropped. Any other host query
  key the request never mentions -- for example `?extra_label=namespace%3Dprod`
  pinning a VictoriaMetrics tenant scope -- is left as-is and is never overridable
  by the request, since a param name outside that fixed set is not forwarded at
  all regardless of what the host carries. This also means a host copied with a
  stray query string (not just a stray path) now forwards its non-Prometheus keys
  upstream as a fallback on every request -- trim those too if they weren't
  intended as Prometheus API params.

  This is also a behavior change for a direct API caller (e.g. curl or Terraform)
  that previously relied on sending an arbitrary, non-Prometheus query param
  through this endpoint: that param is now silently dropped rather than forwarded,
  regardless of whether the Connection host carries anything under the same name.

### Patch Changes

- 25a3b015: Fix `{{sourceQuery}}` returning empty for inline-query and dashboard-tile
  alerts. It read only the saved search's filter, so alerts backed by a chart
  config — where the query lives on the alert or the tile — advertised a variable
  that never rendered. It now resolves the query from whichever config backs the
  alert: the builder `where` or the raw `sqlTemplate`.

  Add `{{thresholdMax}}`, the upper bound of a `between` / `outside` condition.
  Receivers previously saw only the lower bound and could not reconstruct the
  range that fired. It renders empty for every other comparator.

  Test Webhook now sends a sample value for every template variable. It carried
  only the original seven, so a body using an enriched variable rendered it empty
  — and because `threshold`, `thresholdMax` and `value` are emitted unquoted, a
  body like `{"value": {{value}}}` was sent as `{"value": }` and rejected,
  failing the test for a template that works on a real firing.

- 808b3453: Accept `Bearer `-prefixed Authorization header values on the OTel ingest endpoint in OpAMP-managed mode. The collector's bearer-token authenticator matches the full header value exactly and was configured with only the bare API key, so RFC 6750 clients that send `Authorization: Bearer <token>` were rejected. The generated collector config now also accepts `Bearer`, `bearer`, and `BEARER` prefixed forms of each ingestion API key.
- bf4443df: feat: Support autocomplete for PromQL label filters
- 55db91fa: feat: Support static filters in MCP
- 89a897ec: Fixed single-series histogram charts failing with "Unknown expression or function identifier" when sorted by a group-by column or expression. The histogram translation packs group values into a single `group` Array, so the table default ORDER BY (the raw group-by text) referenced source columns that no longer exist in scope; matched sort items now address the packed array positionally.
- f1062a7b: Fixed multi-series metric charts failing with "Unknown expression or function identifier" when sorted by an expression group-by (e.g. `ResourceAttributes['service.name']`). Table tiles default their ORDER BY to the group-by text, so any multi-series metric table grouped by a resource/attribute-derived expression failed to render. Such sort expressions are now evaluated inside each per-series branch through internal companion columns instead of being re-evaluated in the composed outer query, where the source columns no longer exist.
- 4184a898: feat: Support dashboard filters based on Prometheus label values
- 27360036: feat: Support series filter (matcher) in PromQL label dashboard filters
- 7ed8dc8c: feat: Evaluate Prometheus `match[]` series selectors on the labels and label values endpoints for ClickHouse TimeSeries connections
- bcf0257c: feat: Accept optional time bounds on Prometheus label values endpoint
- cff6388c: feat: Add static filters to schemas and APIs
- Updated dependencies [74c28e7f]
- Updated dependencies [b917308d]
- Updated dependencies [55db91fa]
- Updated dependencies [89a897ec]
- Updated dependencies [f1062a7b]
- Updated dependencies [4184a898]
- Updated dependencies [27360036]
- Updated dependencies [c7965927]
- Updated dependencies [cff6388c]
  - @hyperdx/common-utils@0.28.1

## @hyperdx/common-utils@0.28.1

### Patch Changes

- 74c28e7f: feat: Alerts now persist their own `displayName` and `tags`
- b917308d: fix: metric names in the chart editor are now listed deterministically instead of sampled. The dropdown discovered names with `groupUniqArray(3000)(MetricName)`, which keeps an arbitrary subset once a metrics table holds more than 3000 distinct names — the survivors follow hash order, not name order — so metrics that exist and are actively reporting could be unselectable, with no warning and no way to search for what had been dropped. Names are now fetched with an ordered, paginated query and matched server-side, ranked so an exact match is always on the first page, and the dropdown says when the list is incomplete. Also fixes the metric list ignoring the chart's selected time range, which pinned it to the last 24 hours.
- 55db91fa: feat: Support static filters in MCP
- 89a897ec: Fixed single-series histogram charts failing with "Unknown expression or function identifier" when sorted by a group-by column or expression. The histogram translation packs group values into a single `group` Array, so the table default ORDER BY (the raw group-by text) referenced source columns that no longer exist in scope; matched sort items now address the packed array positionally.
- f1062a7b: Fixed multi-series metric charts failing with "Unknown expression or function identifier" when sorted by an expression group-by (e.g. `ResourceAttributes['service.name']`). Table tiles default their ORDER BY to the group-by text, so any multi-series metric table grouped by a resource/attribute-derived expression failed to render. Such sort expressions are now evaluated inside each per-series branch through internal companion columns instead of being re-evaluated in the composed outer query, where the source columns no longer exist.
- 4184a898: feat: Support dashboard filters based on Prometheus label values
- 27360036: feat: Support series filter (matcher) in PromQL label dashboard filters
- c7965927: feat: Support a custom template for PromQL series legends
- cff6388c: feat: Add static filters to schemas and APIs

## @hyperdx/otel-collector@2.38.0

### Patch Changes

- 808b3453: Accept `Bearer `-prefixed Authorization header values on the OTLP receiver in standalone mode (`OTLP_AUTH_TOKEN`). Previously only the bare-token form of the header was accepted, rejecting RFC 6750 clients that send `Authorization: Bearer <token>`. The `Bearer`, `bearer`, and `BEARER` prefixed forms are now accepted alongside the bare token.

