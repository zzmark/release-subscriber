## @hyperdx/app@2.39.0

### Minor Changes

- e31e5d8d: Offer dashboard tile alerts for Terraform import. `clickhouse_clickstack_alert`
  gained `source = "tile"` with `dashboard_id`/`tile_id` in provider 3.28.0, so
  the bulk export and the per-alert menu now include tile alerts instead of
  skipping every alert that is not a saved-search one. A file carrying a tile
  alert asks for `>= 3.28.0` and explains the hand edit its generated config
  needs; an export without one still installs on 3.25.x. A tile alert is withheld
  when its tile has a blank or duplicated name — the provider's `tile_ids` map is
  keyed by tile name and omits those, so the alert could only be pinned to a
  literal id the next dashboard apply can re-mint — or when its dashboard is
  provisioned, since ProvisionDashboardsTask rewrites those tiles wholesale. Both
  decisions are made server-side, on the import manifest and on the alerts
  listing, because neither response carries a dashboard's sibling tile names.
- 41eee7d3: Create and edit alerts from the chart explorer, without a saved search or dashboard tile. Build a chart on `/chart` (logs, traces, or metrics — builder or raw SQL), add an alert, name it, and create it; the alert persists its own chart config. On the alerts page these alerts show their name with a chart icon and link back to the explorer seeded with their query, and the alert detail page renders that query and edits both the alert's fields and the chart behind it in the full chart editor.
- 34d829c7: feat: filter the LLM dashboard by end user

  Adds a user filter alongside the existing session filter. It lists the distinct
  users seen on LLM spans in the searched range and scopes every tab to the one
  selected, including the Errors tab's correlated log events.

  Users are resolved with the same cross-dialect expression the "Top Users" chart
  groups by (`user.email`, `enduser.id`, `user.id`,
  `ai.telemetry.metadata.userId`), so a value picked from the dropdown always
  matches the rows that produced it. The selection lives in the URL, so a filtered
  view can be shared.

- f007c37f: Add a context-aware getting-started checklist to the sidebar for recently-created teams. After the setup steps (connect ClickHouse, add data) complete, a second phase tracks product-usage milestones persisted per user on `user.onboardingData`: exploring data, building a dashboard, setting up an alert, and using the MCP server. Completion is recorded server-side so it counts from the UI, the external REST API v2, or an MCP tool; the card can be dismissed and reappears if a new task is added to the registry.
- 264f2164: feat: Select rows in the search results table to copy or download them
- 3876d6b9: Fill the metric name select from the table's primary index, so it populates almost immediately instead of waiting on an aggregation over the data. On a source reporting ~4,900 gauge metrics the first options appear in ~30ms rather than ~770ms, and they stream in progressively rather than arriving all at once. A small spinner replaces the dropdown chevron while more are still on the way.

  The picker now has two modes. **Browsing** streams `MetricName` out of the sparse primary index via the `mergeTreeIndex` table function — one row per granule mark instead of a full column scan. Because the index only records the value at each granule boundary, that list is a subset, weighted towards metrics that actually carry data (index-visible metrics have a median ~32k datapoints against ~14 for the rest). **Typing** switches to the exhaustive, relevance-ranked `GROUP BY` search, so any metric the index omitted is still reachable by name. The placeholder reads "Search metrics..." to invite that.

  Two details that matter in use: while the first search for a pattern is in flight the browse list is held and filtered client-side, so the options never blank out mid-keystroke; and the dropdown's render cap is raised to 500 to match the server-side page size, so a search that is not reported as truncated is fully renderable.

  Browsing falls back to the exhaustive listing when the index cannot be read at all — a server older than 24.2, a Distributed or non-MergeTree metric table, or a schema whose primary key omits `MetricName` — so no deployment loses the picker.

  `Metadata` gains `streamDistinctIndexValues`, an async generator generic over table and column, so any primary-key column (`ServiceName`, for instance) can be listed the same way. `streamToAsyncIterator` moves from `packages/app`'s session code into `common-utils` beside the ClickHouse client, and a new `useStreamingQuery` hook accumulates an async iterable into a React Query cache entry, publishing partial results on a throttle.

- 972634d2: Report the whole alert condition in the `{{sourceQuery}}` webhook template
  variable. It read only a chart's top-level `where`, so an alert defined by a
  per-series `aggCondition` — a common shape — still rendered empty. The variable
  now reports every part of the condition the alert query actually applies: a
  chart's `where` plus the `aggCondition` of the series the alert reads, and a
  saved search's `where` plus its pinned filters. A chart's pinned filters are
  deliberately excluded, since a tile or inline alert does not apply them. The
  value is truncated at 2000 characters.

  Editing an alert off a `between` or `outside` comparator now clears the stored
  `thresholdMax` instead of leaving the old bound on the document, where it was
  also served by the alerts APIs and would advertise a range that no longer
  fires. Webhook templates already guarded against this on read.

  The webhook form's variable list and the API's fallback body template both
  derive from one list in common-utils, which `buildWebhookTemplateVariables` is
  typed against, so a variable cannot be added without appearing in both places.
  The "Send test" payload carries a sample value for every variable, so a body
  template can be checked before an alert fires.

  The documented guard for an optional number is now
  `{{#unless (eq thresholdMax undefined)}}` rather than `{{#if thresholdMax}}`,
  which treats a legitimate bound of `0` as absent.

### Patch Changes

- ab15643f: Fix default time range resolution for long-lived sessions
- 71d792a6: fix: Don't run ClickHouse queries for disabled sources on load. Disabled sources are now excluded from the metadata/field autocomplete and dashboard filter-value lookups that fire on page load, so loading a page no longer issues source-settings queries (e.g. `SELECT name, value FROM system.settings`) for sources that are turned off.
- 34d829c7: fix: use mapContains for LLM dashboard attribute-presence filters

  The LLM dashboard tested attribute presence with `SpanAttributes['key'] != ''`,
  which no skip index can serve — the trace schema's `mapKeys(SpanAttributes)`
  index only answers `mapContains`, and `!= ''` normalizes to `notEmpty()`. Every
  tile therefore scanned all granules. Map subscripts are also subcolumn
  references, so on ClickHouse 26.3+ each one adds a per-part size lookup during
  PREWHERE planning.

  These filters now lead with `mapContains`, which the index serves and which
  costs no per-part lookups. On a staging trace table the LLM span predicate went
  from a 36s planning stall to 7ms, and a two-key filter dropped from 1,306
  granules to 3.

  Gates that pair with a value expression the dashboard groups by keep their
  non-empty check, so an attribute set to `''` still cannot appear as a blank row.
  There the value term defines the result and the presence term is pruning only,
  so it is wrapped in `indexHint` — it reaches skip-index analysis without being
  re-evaluated per surviving row. The value term costs no extra per-part lookups,
  since it reads the same keys the group-by already reads. Gates that land in a
  select-list aggregate are left unhinted, since skip-index analysis does not
  reach the select list; the tool-call gate is used in both positions and so is
  exposed in both forms.

  The one behavior change is LLM span detection, which is now presence-based: a
  span carrying `gen_ai.system` at all is treated as an LLM span whatever the
  value. Nothing groups by that predicate.

  One caveat for tables with materialized columns: a `SpanAttributes['key']`
  subscript gets rewritten onto a materialized column when an operator has created
  one, and `mapContains` is not matched by that rewrite. Such tables were never
  affected by the planning cost either, since a rewritten subscript is no longer a
  subcolumn reference — so this trades that rewrite for skip-index pruning, which
  is the better deal only where those columns do not exist.

  JSON attribute columns are unchanged — their paths are real subcolumns, there is
  no key index to prune with, and a presence term would only duplicate reads.

- 482d2cb0: feat: Paginate the alerts page
- 5311d63c: fix: give incident.io webhooks a body incident.io accepts

  An incident.io webhook saved without a body was sent the generic `{"text": ...}` payload, which has neither of the two fields incident.io requires, so every delivery was rejected and no alert was ever raised. It now gets an incident.io payload carrying a deduplication key that is stable across a firing and its resolve, so incident.io closes the alert it opened, plus the alert id, status, condition and evaluation window in `metadata` for routing. The webhook body editor and its list of template variables are also available when incident.io is the selected service, not only for Generic, so the payload can be tailored to an alert source's configured fields.

- 96ac6b1b: fix: disable per-part subcolumn size calculation on ClickHouse 26.3+

  ClickHouse 26.3 turned on
  `allow_calculating_subcolumns_sizes_for_merge_tree_reading` by default, which
  makes PREWHERE planning fetch per-part sizes for every map key a query
  references. On SharedMergeTree that is one S3 GET per (key × active part), it
  runs before any row is read, and `max_execution_time` does not interrupt it.
  Queries referencing many attribute keys — the LLM dashboard reads ~64 — could
  spend minutes in planning. Queries now send the setting as `0` when the server
  supports it.

- 4db73970: fix: keep a multi-line query visible when the field is not focused

  Multi-line SQL fields collapsed to a single line whenever they lost focus, so everything past the first line was hidden until you clicked back into them. Focusing one expanded it into a floating overlay that covered the content underneath — and in a container sized to its content, that overlay left the layout flow and shrank the field to a sliver one character wide.

  Any field that allows multiple lines now simply sizes to its content, focused or not, growing the layout rather than floating over it, up to 150px before it scrolls. That covers the search WHERE, SELECT and ORDER BY, the chart editor's SQL fields, and PromQL. Lucene search fields similarly grow up to four lines. Fields with `allowMultiline={false}` remain single-line in both SQL and Lucene. The focus overlay is gone rather than made optional, so there is no longer a separate expand-on-focus state to reason about.

  The language switch beside the search bar stretches to match, with no divider between it and the input. A Lucene bar at the default size also no longer overhangs that switch. The Lucene input reserved a 38px row while drawing a 36px box inside it, so the switch — sized to the 36px the SQL editor uses — stood 2px proud of the input. Both languages now take their height from one shared table, so the seam is flush and the bar does not change height when you switch. Only the default size was affected; the compact bar was already consistent at 30px.

  Focus recolors the whole control, including the language switch, without overriding an error or warning border.

- 84c67f4b: fix: show only the delivery time in an alert's notification duration

  The notification duration on an alert's evaluation list was timing everything an alert does once it decides to fire: building the message title and links, querying the log lines that go in the body, rendering the template, and then delivering it. That made the column read in seconds while the webhook underneath it answered in milliseconds — the column and its own per-target breakdown disagreed, and the figure was dominated by work that has nothing to do with how fast the notification target responded. It now times the delivery alone. Evaluations already recorded keep their old figure and will read high.

- c98be91f: Escape source table/database names in the onboarding checklist's has-data probe to prevent SQL injection via a maliciously named data source.
- cfacdbe5: feat: relative date ranges for dashboards can now be saved
- f7ae72c2: refactor: Extract PromQL functions, PromqlExpressionEditor, and ChartSeriesControls
- fda038d6: fix: keep the LLM dashboard scope filters clearable when their options fail to
  load

  The session and user dropdowns were disabled whenever their distinct-value query
  was loading or had failed. With a filter applied that left the user looking at a
  scope they could see but could not remove — permanently, if the query kept
  failing. They now stay interactive whenever a value is applied.

- b1e48b99: fix: Quote column identifiers when opening row details
- 78a33ba4: feat: Allow configuring dashboard filters as required
- db708a82: Color service map nodes by absolute error-rate thresholds instead of scaling
  against the worst service on the graph. A service with no errors now renders
  neutral grey rather than a pale red, and the remaining nodes fall into three
  fixed buckets (under 1%, 1-5%, and 5% or above). A service the map has no error
  data for — one that only calls others, with no incoming requests in the window —
  renders hollow rather than filled, so "nothing measured" no longer looks like
  "nothing wrong".

  Previously every node was a shade of red whose intensity was normalized against
  the graph-wide maximum, so a map whose worst service sat at 0.3% errors painted
  it the same deep red as one at 60%, and a healthy service was indistinguishable
  from one with a trace of errors. The legend for error rate now shows the four
  discrete steps, marks the 1% and 5% boundaries, and adds a key for the hollow
  state. Latency and throughput coloring is unchanged.

- bef61fbc: feat: Scope tags endpoint by resource type
- b4840573: feat: Optionally apply the dashboard's filter selections to the tile editor preview
- 25695c1a: Stop the Help menu sparkling on every deploy. The "you haven't read the latest release notes" indicator compared the browser's last acknowledgement against `NEXT_PUBLIC_APP_VERSION`, which any deployment that stamps a build id into it (a git short SHA, a CI build number) changes on every deploy — so the nudge fired for every user every time whether a new release had been published or not. It now keys on the newest release version in the changelog, inlined at build time, and nudges only when that release is strictly newer than the one the browser has acknowledged, so a rollback no longer re-nudges everyone either.
- Updated dependencies [4d18cb09]
- Updated dependencies [c8cc8e5e]
- Updated dependencies [ff1e77ce]
- Updated dependencies [482d2cb0]
- Updated dependencies [e31e5d8d]
- Updated dependencies [5311d63c]
- Updated dependencies [96ac6b1b]
- Updated dependencies [6b391715]
- Updated dependencies [84c67f4b]
- Updated dependencies [f007c37f]
- Updated dependencies [cfacdbe5]
- Updated dependencies [806d242e]
- Updated dependencies [b19fa12a]
- Updated dependencies [f7ae72c2]
- Updated dependencies [b2174306]
- Updated dependencies [b1e48b99]
- Updated dependencies [78a33ba4]
- Updated dependencies [edb693a6]
- Updated dependencies [0a371980]
- Updated dependencies [3876d6b9]
- Updated dependencies [bef61fbc]
- Updated dependencies [b4840573]
- Updated dependencies [6c85ca02]
- Updated dependencies [972634d2]
  - @hyperdx/api@2.39.0
  - @hyperdx/common-utils@0.29.0

## @hyperdx/api@2.39.0

### Minor Changes

- ff1e77ce: Backfill alert `displayName` and `tags` from the referenced saved search or dashboard on API startup. Alerts that already have a display name or tags are skipped.
- e31e5d8d: Offer dashboard tile alerts for Terraform import. `clickhouse_clickstack_alert`
  gained `source = "tile"` with `dashboard_id`/`tile_id` in provider 3.28.0, so
  the bulk export and the per-alert menu now include tile alerts instead of
  skipping every alert that is not a saved-search one. A file carrying a tile
  alert asks for `>= 3.28.0` and explains the hand edit its generated config
  needs; an export without one still installs on 3.25.x. A tile alert is withheld
  when its tile has a blank or duplicated name — the provider's `tile_ids` map is
  keyed by tile name and omits those, so the alert could only be pinned to a
  literal id the next dashboard apply can re-mint — or when its dashboard is
  provisioned, since ProvisionDashboardsTask rewrites those tiles wholesale. Both
  decisions are made server-side, on the import manifest and on the alerts
  listing, because neither response carries a dashboard's sibling tile names.
- f007c37f: Add a context-aware getting-started checklist to the sidebar for recently-created teams. After the setup steps (connect ClickHouse, add data) complete, a second phase tracks product-usage milestones persisted per user on `user.onboardingData`: exploring data, building a dashboard, setting up an alert, and using the MCP server. Completion is recorded server-side so it counts from the UI, the external REST API v2, or an MCP tool; the card can be dismissed and reappears if a new task is added to the registry.
- b2174306: feat: run PromQL against ClickHouse through its Prometheus HTTP API

  ClickHouse-backed `/query` and `/query_range` now proxy to the connection's `/prometheus/api/v1/*` endpoint (the `prometheus_api_v1` HTTP handler, ClickHouse 26.8+) instead of calling the `prometheusQuery`/`prometheusQueryRange` table functions. The `database` and `table` query parameters are forwarded so one handler serves any TimeSeries table. ClickHouse holds the Prometheus API forward-compatible while the TimeSeries engine is in preview; the table functions and inner-table schema are not. Bundled ClickHouse images move to 26.8.

- 972634d2: Report the whole alert condition in the `{{sourceQuery}}` webhook template
  variable. It read only a chart's top-level `where`, so an alert defined by a
  per-series `aggCondition` — a common shape — still rendered empty. The variable
  now reports every part of the condition the alert query actually applies: a
  chart's `where` plus the `aggCondition` of the series the alert reads, and a
  saved search's `where` plus its pinned filters. A chart's pinned filters are
  deliberately excluded, since a tile or inline alert does not apply them. The
  value is truncated at 2000 characters.

  Editing an alert off a `between` or `outside` comparator now clears the stored
  `thresholdMax` instead of leaving the old bound on the document, where it was
  also served by the alerts APIs and would advertise a range that no longer
  fires. Webhook templates already guarded against this on read.

  The webhook form's variable list and the API's fallback body template both
  derive from one list in common-utils, which `buildWebhookTemplateVariables` is
  typed against, so a variable cannot be added without appearing in both places.
  The "Send test" payload carries a sample value for every variable, so a body
  template can be checked before an alert fires.

  The documented guard for an optional number is now
  `{{#unless (eq thresholdMax undefined)}}` rather than `{{#if thresholdMax}}`,
  which treats a legitimate bound of `0` as absent.

### Patch Changes

- 4d18cb09: fix: fetch a grouped alert's example log lines once per window

  A saved-search alert puts a handful of example log lines into the notification it sends, and fetching them takes a second query. That query was being made while building each message, so an alert grouped by service asked ClickHouse for the same lines once per breaching service — ten services meant ten identical queries over the same data, because the query only filters by the saved search and the time window, never by the group. It now runs once and every notification for that window shares the answer. An alert catching up on skipped ticks still fetches lines for each window it backfills, since those genuinely differ. Ungrouped alerts are unaffected; they only ever asked once.

- c8cc8e5e: feat: Include alert tags in the tags API response
- 482d2cb0: feat: Paginate the alerts page
- 5311d63c: fix: give incident.io webhooks a body incident.io accepts

  An incident.io webhook saved without a body was sent the generic `{"text": ...}` payload, which has neither of the two fields incident.io requires, so every delivery was rejected and no alert was ever raised. It now gets an incident.io payload carrying a deduplication key that is stable across a firing and its resolve, so incident.io closes the alert it opened, plus the alert id, status, condition and evaluation window in `metadata` for routing. The webhook body editor and its list of template variables are also available when incident.io is the selected service, not only for Generic, so the payload can be tailored to an alert source's configured fields.

- 6b391715: Accept metric selects without a value expression on the external dashboards API. A tile that aggregates a metric names its value with `metricName` and has no expression to give, so `/api/v2/dashboards/validate` was rejecting dashboards the editor itself writes, and Terraform could not import them.
- 84c67f4b: fix: show only the delivery time in an alert's notification duration

  The notification duration on an alert's evaluation list was timing everything an alert does once it decides to fire: building the message title and links, querying the log lines that go in the body, rendering the template, and then delivering it. That made the column read in seconds while the webhook underneath it answered in milliseconds — the column and its own per-target breakdown disagreed, and the figure was dominated by work that has nothing to do with how fast the notification target responded. It now times the delivery alone. Evaluations already recorded keep their old figure and will read high.

- cfacdbe5: feat: relative date ranges for dashboards can now be saved
- 806d242e: feat: page and filter GET /alerts server-side
- b19fa12a: refactor(api): backport alertConfigHasGroupBy helper
- 78a33ba4: feat: Allow configuring dashboard filters as required
- edb693a6: Apply saved-search pinned filters to alert notification sample queries so sample
  log lines come from the same row set the alert counted.
- 0a371980: fix: Keep `/api/sources` responses stable for sources whose stored `metadataMaterializedViews` has no nested `_id`
- bef61fbc: feat: Scope tags endpoint by resource type
- 6c85ca02: feat: add a pluggable token encryption service for stored third-party tokens. Set `TOKEN_ENCRYPTION_KEY` to a 32-byte key (base64 or hex) to encrypt them with AES-256-GCM; without it they are stored unencrypted.
- Updated dependencies [482d2cb0]
- Updated dependencies [e31e5d8d]
- Updated dependencies [5311d63c]
- Updated dependencies [96ac6b1b]
- Updated dependencies [84c67f4b]
- Updated dependencies [f007c37f]
- Updated dependencies [cfacdbe5]
- Updated dependencies [806d242e]
- Updated dependencies [f7ae72c2]
- Updated dependencies [b1e48b99]
- Updated dependencies [78a33ba4]
- Updated dependencies [3876d6b9]
- Updated dependencies [bef61fbc]
- Updated dependencies [b4840573]
- Updated dependencies [972634d2]
  - @hyperdx/common-utils@0.29.0

## @hyperdx/common-utils@0.29.0

### Minor Changes

- e31e5d8d: Offer dashboard tile alerts for Terraform import. `clickhouse_clickstack_alert`
  gained `source = "tile"` with `dashboard_id`/`tile_id` in provider 3.28.0, so
  the bulk export and the per-alert menu now include tile alerts instead of
  skipping every alert that is not a saved-search one. A file carrying a tile
  alert asks for `>= 3.28.0` and explains the hand edit its generated config
  needs; an export without one still installs on 3.25.x. A tile alert is withheld
  when its tile has a blank or duplicated name — the provider's `tile_ids` map is
  keyed by tile name and omits those, so the alert could only be pinned to a
  literal id the next dashboard apply can re-mint — or when its dashboard is
  provisioned, since ProvisionDashboardsTask rewrites those tiles wholesale. Both
  decisions are made server-side, on the import manifest and on the alerts
  listing, because neither response carries a dashboard's sibling tile names.
- f007c37f: Add a context-aware getting-started checklist to the sidebar for recently-created teams. After the setup steps (connect ClickHouse, add data) complete, a second phase tracks product-usage milestones persisted per user on `user.onboardingData`: exploring data, building a dashboard, setting up an alert, and using the MCP server. Completion is recorded server-side so it counts from the UI, the external REST API v2, or an MCP tool; the card can be dismissed and reappears if a new task is added to the registry.
- 3876d6b9: Fill the metric name select from the table's primary index, so it populates almost immediately instead of waiting on an aggregation over the data. On a source reporting ~4,900 gauge metrics the first options appear in ~30ms rather than ~770ms, and they stream in progressively rather than arriving all at once. A small spinner replaces the dropdown chevron while more are still on the way.

  The picker now has two modes. **Browsing** streams `MetricName` out of the sparse primary index via the `mergeTreeIndex` table function — one row per granule mark instead of a full column scan. Because the index only records the value at each granule boundary, that list is a subset, weighted towards metrics that actually carry data (index-visible metrics have a median ~32k datapoints against ~14 for the rest). **Typing** switches to the exhaustive, relevance-ranked `GROUP BY` search, so any metric the index omitted is still reachable by name. The placeholder reads "Search metrics..." to invite that.

  Two details that matter in use: while the first search for a pattern is in flight the browse list is held and filtered client-side, so the options never blank out mid-keystroke; and the dropdown's render cap is raised to 500 to match the server-side page size, so a search that is not reported as truncated is fully renderable.

  Browsing falls back to the exhaustive listing when the index cannot be read at all — a server older than 24.2, a Distributed or non-MergeTree metric table, or a schema whose primary key omits `MetricName` — so no deployment loses the picker.

  `Metadata` gains `streamDistinctIndexValues`, an async generator generic over table and column, so any primary-key column (`ServiceName`, for instance) can be listed the same way. `streamToAsyncIterator` moves from `packages/app`'s session code into `common-utils` beside the ClickHouse client, and a new `useStreamingQuery` hook accumulates an async iterable into a React Query cache entry, publishing partial results on a throttle.

- 972634d2: Report the whole alert condition in the `{{sourceQuery}}` webhook template
  variable. It read only a chart's top-level `where`, so an alert defined by a
  per-series `aggCondition` — a common shape — still rendered empty. The variable
  now reports every part of the condition the alert query actually applies: a
  chart's `where` plus the `aggCondition` of the series the alert reads, and a
  saved search's `where` plus its pinned filters. A chart's pinned filters are
  deliberately excluded, since a tile or inline alert does not apply them. The
  value is truncated at 2000 characters.

  Editing an alert off a `between` or `outside` comparator now clears the stored
  `thresholdMax` instead of leaving the old bound on the document, where it was
  also served by the alerts APIs and would advertise a range that no longer
  fires. Webhook templates already guarded against this on read.

  The webhook form's variable list and the API's fallback body template both
  derive from one list in common-utils, which `buildWebhookTemplateVariables` is
  typed against, so a variable cannot be added without appearing in both places.
  The "Send test" payload carries a sample value for every variable, so a body
  template can be checked before an alert fires.

  The documented guard for an optional number is now
  `{{#unless (eq thresholdMax undefined)}}` rather than `{{#if thresholdMax}}`,
  which treats a legitimate bound of `0` as absent.

### Patch Changes

- 482d2cb0: feat: Paginate the alerts page
- 5311d63c: fix: give incident.io webhooks a body incident.io accepts

  An incident.io webhook saved without a body was sent the generic `{"text": ...}` payload, which has neither of the two fields incident.io requires, so every delivery was rejected and no alert was ever raised. It now gets an incident.io payload carrying a deduplication key that is stable across a firing and its resolve, so incident.io closes the alert it opened, plus the alert id, status, condition and evaluation window in `metadata` for routing. The webhook body editor and its list of template variables are also available when incident.io is the selected service, not only for Generic, so the payload can be tailored to an alert source's configured fields.

- 96ac6b1b: fix: disable per-part subcolumn size calculation on ClickHouse 26.3+

  ClickHouse 26.3 turned on
  `allow_calculating_subcolumns_sizes_for_merge_tree_reading` by default, which
  makes PREWHERE planning fetch per-part sizes for every map key a query
  references. On SharedMergeTree that is one S3 GET per (key × active part), it
  runs before any row is read, and `max_execution_time` does not interrupt it.
  Queries referencing many attribute keys — the LLM dashboard reads ~64 — could
  spend minutes in planning. Queries now send the setting as `0` when the server
  supports it.

- 84c67f4b: fix: show only the delivery time in an alert's notification duration

  The notification duration on an alert's evaluation list was timing everything an alert does once it decides to fire: building the message title and links, querying the log lines that go in the body, rendering the template, and then delivering it. That made the column read in seconds while the webhook underneath it answered in milliseconds — the column and its own per-target breakdown disagreed, and the figure was dominated by work that has nothing to do with how fast the notification target responded. It now times the delivery alone. Evaluations already recorded keep their old figure and will read high.

- cfacdbe5: feat: relative date ranges for dashboards can now be saved
- 806d242e: feat: page and filter GET /alerts server-side
- f7ae72c2: refactor: Extract PromQL functions, PromqlExpressionEditor, and ChartSeriesControls
- b1e48b99: fix: Quote column identifiers when opening row details
- 78a33ba4: feat: Allow configuring dashboard filters as required
- bef61fbc: feat: Scope tags endpoint by resource type
- b4840573: feat: Optionally apply the dashboard's filter selections to the tile editor preview

## @hyperdx/otel-collector@2.39.0

### Minor Changes

- 7651bc34: feat: add text indexes for seeding the trace schema
- fc4d5878: feat(otel-collector): compile in spanmetricsconnector

  Available for a user's own pipeline config (e.g. via
  `CUSTOM_OTELCOL_CONFIG_FILE`) to compute call-count and duration
  metrics from spans - most useful alongside the existing
  `datadogreceiver` support for ingesting Datadog Agent traces, where
  there was previously no way to derive RED metrics from that trace data
  once ingested. Purely additive: being compiled in changes no default
  pipeline or behavior on its own.
