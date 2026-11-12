## @hyperdx/app@2.44.0

### Minor Changes

- 142c9cc87: feat: narrow ad hoc dashboard filter suggestions with a condition

  An ad hoc filter on SQL sources can now carry a SQL or Lucene "Keys and values
  filter", like a queried filter's dropdown values filter, that limits the rows
  its keys and values are suggested from. It can reference the dashboard's other
  variables. While it references a required filter with nothing selected, the ad
  hoc filter can't add or edit conditions and names the filter it is waiting on.
  Failed suggestions now show the database's error message.

- cd0e9edfa: feat: add optional `titleEmoji` webhook option; `false` removes the emoji prefix from notification titles sent through that webhook
- 5b0d07441: feat: self-instrument with `@clickhouse/clickstack-node` and
  `@clickhouse/clickstack-browser` instead of `@hyperdx/node-opentelemetry` and
  `@hyperdx/browser`

  HyperDX's own telemetry changes shape. HTTP spans use the stable semantic
  convention keys (`http.request.method`, `http.response.status_code`,
  `url.full`). pino records come from the `@opentelemetry/instrumentation-pino`
  scope with real severity numbers instead of the `node-logger` scope with
  severity number 0. Console capture covers every `console` call in the API, and
  browser console output is recorded as log records instead of spans. Uncaught
  exceptions are recorded as FATAL log records, and API errors as an exception
  event on the Express span instead of a separate error span.

  Browser telemetry records the user as `user.id`, `user.email` and `user.name`
  instead of `userEmail` and `userName`, keeps the team name as `teamName`, and no
  longer records a `user navigated` action. Browser fetch and XHR spans no longer
  record request and response headers or bodies. Browser sessions restart once
  after the upgrade. The per-signal browser endpoints and
  `NEXT_PUBLIC_OTEL_RESOURCE_ATTRIBUTES` work as before. Browser traces and logs
  are now sent gzip-compressed every 5 seconds. If the browser sends to a
  collector other than ClickStack's, its CORS `allowed_headers` must be `"*"` or
  include `content-type` and `content-encoding` (and `authorization`), and a proxy
  in front of it must forward `Content-Encoding` unchanged.

  The Next.js server now sends its own telemetry in production builds too, not
  only under `next dev`, when `HYPERDX_API_KEY` or `OTEL_EXPORTER_OTLP_HEADERS` is
  set. `HDX_EXPORTER_ENABLED=false` turns it off along with browser telemetry. It
  reports under its own service name, the configured one plus `-next`
  (`hdx-oss-app-next` in the docker-compose `app` service and when no name is
  set), so its spans stay apart from the API's and the browser's. The HyperDX
  images now default `OTEL_SERVICE_NAME` to `hdx-oss-app`. Each `/api` request
  adds Next.js server spans for the proxy hop. Requests for build and `public/`
  assets, such as `/_next/static/*`, `/__ENV.js` and `/pyodide/*`, are not traced.

  `HYPERDX_API_KEY` still enables self-instrumentation. Without
  `OTEL_EXPORTER_OTLP_ENDPOINT`, server-side self-telemetry now goes to
  `http://localhost:4318` instead of `https://in-otel.hyperdx.io`, so set the
  endpoint explicitly. `HDX_NODE_*` variables are no longer read. For request
  headers and bodies set `OTEL_INSTRUMENTATION_HTTP_CAPTURE_HEADERS_*` and
  `CLICKSTACK_CAPTURE_HTTP_BODY`.

- 0b7926d1d: feat: Team members can create team-owned API keys with a description and expiry that keep working after their creator leaves.
- af17e8ff8: The app always uses ClickStack branding. Brand selection, the HyperDX palette, and the font picker are removed. Light, dark, and system color mode stay in Preferences.
- dd8c2e4b6: feat: Pick a time zone for the search and dashboard pages from the time picker, overriding the time zone in User Preferences. The picker shows the zone it uses, and the choice is kept in the URL and in links from charts and tables

### Patch Changes

- 7de661b6a: feat: Row side panel summarizes clicks, navigations and console messages from OpenTelemetry browser SDKs, and navigation rows no longer show an HTTP Request section
- df737d8aa: refactor: use the click-ui `Separator` instead of the Mantine `Divider` in the
  chart display, heatmap, number format, and on-click drawers, and in the ad hoc
  and query expression dashboard filter forms.
- 4b8df6d8a: fix: show a neutral spinner while charts load

  Chart tiles now show a spinner with "Loading Chart Data..." while a query is in
  flight, including when the previous result was empty. Before, they kept showing
  "No data found within time range." until the new query finished. Loaders now
  default to a neutral gray instead of yellow.

- ab36d4e13: feat: publish the HyperDX image as `clickhouse/clickstack` alongside
  `hyperdx/hyperdx`, matching the other `clickhouse/clickstack-*` images. Release
  workflows no longer log into ghcr.io, which received no pushes.
- f56d4ad5b: fix(app): use the ClickStack hexagon and bolt mark in the logo, the collapsed nav, and the favicon.
- d7df729e6: chore: GitHub links (changelog, support, package metadata) now point at `ClickHouse/ClickStack`, and `docker-compose.yml` pulls the app image as `clickhouse/clickstack`
- f56d4ad5b: fix(app): open the full nav over the page on compact viewports. On narrow screens the sidebar toggle now opens the full nav as an overlay instead of doing nothing.
- 513b23796: fix: start the trace waterfall higher in the side panel

  Trace spans no longer repeat their name in a box under the panel title, or the
  service as a chip next to the metadata row that already shows it. The
  "⌘/Ctrl + scroll to zoom" hint moves into the timeline's top-left corner
  instead of taking its own row. Long span names that the title truncates keep
  the box. Log panels keep their body box and service chip.

- 9269f7784: fix: "Denoise results" now removes noise on typical data. A pattern now counts as noisy above 5% of sampled events instead of 10%, which often matched nothing. Patterns that include error or warning lines are never hidden. The MCP `denoise` option uses the same 5% threshold. Denoise also mines the source's body column instead of the last table column, removes ANSI-colored rows that match a noisy pattern, says when results can't be denoised, and shows hidden patterns as a short summary with a shortened, expandable list.
- e2754d203: fix: use SHA256 instead of MD5 for JSON row lookup WHERE clauses so row
  details and drill-down work on FIPS-enabled ClickHouse deployments
- 5abf27ed3: Saving a search no longer reloads the page: the new saved search is opened with
  a client-side navigation, which also fixes the 404 this caused on the static
  ClickStack build.
- ba7d0066f: fix: heatmap hover tooltip no longer adds scrollbars or shifts the tile; it now
  sits above the chart instead of inside it
- 04f55d12c: feat: Exception panel parses JavaScript stack traces from OpenTelemetry SDKs into frames, with a section per `Caused by:` error
- d0dd06fe8: fix: count legacy STATUS_CODE_ERROR spans as errors on the service map and trace
  waterfall
- 7935c64bc: feat: add `hdx mcp install` to connect AI agents without pasting a key

  `npx @hyperdx/cli mcp install` asks for a personal access key or an
  organization API key with hidden input, checks it, and adds the ClickStack MCP
  server to Claude Code, Codex, Cursor, and VS Code. Team Settings now leads with
  this command, so the key no longer has to go into a copied command or an agent
  chat. The per-agent snippets remain for setting up one agent by hand.

- 41b2b742a: feat: fall back to server MergeTree settings to detect persisted `_block_number` and `_block_offset` columns when the table's CREATE query omits them
- 442d6dfd9: fix: refresh cached table columns after 5 minutes

  The shared metadata cache kept each table's `DESCRIBE` result for the life of
  the process, so the API did not see columns added with `ALTER TABLE`, such as
  new MATERIALIZED columns, until it restarted. Cached columns now expire after 5
  minutes. Other cached metadata is unchanged.

- eb2439ed0: fix: leave metric points with no recorded value out of charts and alerts

  When a scraped series goes away or a scrape fails, the collector's `prometheus`
  receiver sends a point flagged "no recorded value" (a Prometheus staleness
  marker), and the ClickHouse exporter stores it as zeros. Metric charts and
  alerts read it as a real value: a gauge's `min` and `avg` dropped and `count`
  included the series that went away, and a counter or histogram that came back
  after the marker counted its whole total again. Metric queries now skip points
  with this flag.

- 81b6b605e: refactor: use the click-ui `Separator` instead of the Mantine `Divider` in the
  keyboard shortcuts modal, What's new drawer, filter settings popover, metric
  explorer, chart explorer, time picker, and Service Map tooltip.
- 9df8b8d47: fix: bump next to 16.4.3 so builds no longer fail intermittently when Google Fonts returns extensionless font URLs
- ec0db7ac9: fix: Creating an alert from the search page asks for one name, not two. An unsaved search is named once in the alert modal's header and the alert inherits that name and its tags; on a saved search the alert's own name field is labelled "Alert name" and shows the inherited name as its placeholder instead of pre-filling a duplicate.
- 467c16792: feat: A pinned filter collapsed in the search sidebar stays collapsed the next
  time the source loads, instead of always opening
- 6468dadcf: fix: keep session replay events from different page loads apart

  Browser SDKs up to `@clickhouse/clickstack-browser` 1.2.0 number replay events
  from 1 again on every page load. When a page closed before all chunks of a large
  event were sent, its leftover chunk could be joined with a later page's event of
  the same number. That page's snapshot then failed to parse and did not render.
  Chunks are now grouped by event number and full-precision timestamp, and replay
  rows are ordered by the full-precision timestamp, so rows of two page loads in
  the same second no longer interleave.

  The app's own browser telemetry now uses `@clickhouse/clickstack-browser` 1.2.1,
  whose replay event numbers no longer repeat across page loads.

- 86cd38b7e: fix: only use the key-only row details lookup when the table persists both `_block_number` and `_block_offset`. A lone block column (e.g. a server-wide `enable_block_offset_column`) is not unique with a second-precision primary key and could open the wrong row; it is now only added as a tiebreaker to the full-row lookup.
- 82b2104bb: fix: show a loader while row details load

  Expanded search rows and the trace viewer's span details showed "Empty" or "No
  body for this event." while the row was still loading. They now show a loader
  until the row arrives.

- 3a412e4f8: fix: run the row details query once when opening a row

  The side panel ran the same `SELECT *` row query twice: once for the panel, and
  again when its Overview or Column Values tab mounted. A row that was found is
  now reused from the cache, so the tab and later tab switches do not query it
  again. A different row or source still runs the query, and a row that was not
  found is looked up again.

- 78143c81a: feat: on ClickHouse Cloud, read `system.shared_merge_tree_settings` when detecting `_block_number` and `_block_offset` columns, falling back to `system.merge_tree_settings` per key
- 4e93ae500: fix(app): render the ClickStack name as text in the expanded sidebar, 8px from the logo symbol.
- 38f58cff2: refactor: use the click-ui `Separator` instead of the Mantine `Divider` in the
  source form and the sources list.
- 2bad9af17: refactor: use the click-ui `Separator` instead of the Mantine `Divider` in the
  Team Settings sections.
- af75b2b59: feat: Trace waterfall shows OpenTelemetry browser SDK request timings as dots on fetch and XHR spans, and the click that triggered a browser trace
- 4e93ae500: fix(app): use the new favicon set, including an SVG, in the browser tab, bookmarks, and touch icon.
- dc58efde2: fix: The app no longer crashes on load in browsers that report a POSIX-style language such as `en-US@posix`
- Updated dependencies [142c9cc87]
- Updated dependencies [30b1494d8]
- Updated dependencies [0453aa134]
- Updated dependencies [cd0e9edfa]
- Updated dependencies [5b0d07441]
- Updated dependencies [5b0d07441]
- Updated dependencies [769c0def3]
- Updated dependencies [9269f7784]
- Updated dependencies [48c83790a]
- Updated dependencies [e2754d203]
- Updated dependencies [22f824c6e]
- Updated dependencies [642533255]
- Updated dependencies [d0dd06fe8]
- Updated dependencies [349fc2141]
- Updated dependencies [631002374]
- Updated dependencies [5584f84bb]
- Updated dependencies [253a690d4]
- Updated dependencies [66e394136]
- Updated dependencies [7e8522914]
- Updated dependencies [9093282e5]
- Updated dependencies [53bf54096]
- Updated dependencies [0eec5e140]
- Updated dependencies [917c9ca49]
- Updated dependencies [95fa36412]
- Updated dependencies [d08b2fa73]
- Updated dependencies [a13c80efe]
- Updated dependencies [0262822da]
- Updated dependencies [41b2b742a]
- Updated dependencies [442d6dfd9]
- Updated dependencies [eb2439ed0]
- Updated dependencies [0b7926d1d]
- Updated dependencies [0eec5e140]
- Updated dependencies [0a5237e6c]
- Updated dependencies [78143c81a]
- Updated dependencies [b7b4d9579]
- Updated dependencies [b1d4e60f8]
- Updated dependencies [ef56bd726]
- Updated dependencies [c792850fd]
- Updated dependencies [90302c773]
  - @hyperdx/common-utils@0.34.0
  - @hyperdx/api@2.44.0

## @hyperdx/otel-collector@2.44.0

### Patch Changes

- 5b0d07441: fix: let browsers cache the collector's CORS preflights for 10 minutes

  The OTLP receiver now answers preflights with `Access-Control-Max-Age: 600`.
  Without it, browsers cached a preflight for only 5 seconds, which is how often
  the browser SDK exports, so about half of its requests were preflights.

- 8384fe675: perf: compress the seed schemas with `ZSTD(3)` instead of `ZSTD(1)`

  The seed schemas pinned `ZSTD(1)` on almost every column. Level 3 gives a better
  compression ratio at a small insert-time CPU cost, without affecting reads, and
  it is the default codec of ClickHouse since 26.9. It is pinned explicitly so
  that older ClickHouse versions, whose default is `LZ4`, get it too. `Delta`
  codecs drop their byte-size argument, which ClickHouse infers from the column
  type. Only newly created tables are affected; existing tables keep their codecs.

- 702181002: feat: session ID columns, `session.id` from `rum.sessionId`, severity text

  The `hyperdx_sessions` seed adds materialized `rum.sessionId` and `session.id`
  columns with skip indexes, and the `otel_logs` seed adds a materialized
  `session.id` column with a skip index, so session queries no longer read the
  attribute maps. Only newly created tables get them; existing tables need an
  `ALTER TABLE ... ADD COLUMN` to benefit.

  Spans, logs and session replay events from older `@hyperdx/browser` SDKs, which
  carry the session id only in the `rum.sessionId` resource attribute, now also
  get the OpenTelemetry `session.id` attribute. An existing `session.id` is never
  overwritten and `rum.sessionId` is kept. If you override pipeline `processors:`
  lists in `CUSTOM_OTELCOL_CONFIG_FILE`, add `transform/session_id` to keep this.

  Logs that carry a severity number but no severity text, such as those from the
  new browser SDK, now get the matching level text (`info`, `error`, ...) instead
  of an empty level. Severity text set by the producer is never overwritten.

## @hyperdx/common-utils@0.34.0

### Minor Changes

- 142c9cc87: feat: narrow ad hoc dashboard filter suggestions with a condition

  An ad hoc filter on SQL sources can now carry a SQL or Lucene "Keys and values
  filter", like a queried filter's dropdown values filter, that limits the rows
  its keys and values are suggested from. It can reference the dashboard's other
  variables. While it references a required filter with nothing selected, the ad
  hoc filter can't add or edit conditions and names the filter it is waiting on.
  Failed suggestions now show the database's error message.

- cd0e9edfa: feat: add optional `titleEmoji` webhook option; `false` removes the emoji prefix from notification titles sent through that webhook
- 0b7926d1d: feat: Team members can create team-owned API keys with a description and expiry that keep working after their creator leaves.

### Patch Changes

- 9269f7784: fix: "Denoise results" now removes noise on typical data. A pattern now counts as noisy above 5% of sampled events instead of 10%, which often matched nothing. Patterns that include error or warning lines are never hidden. The MCP `denoise` option uses the same 5% threshold. Denoise also mines the source's body column instead of the last table column, removes ANSI-colored rows that match a noisy pattern, says when results can't be denoised, and shows hidden patterns as a short summary with a shortened, expandable list.
- e2754d203: fix: use SHA256 instead of MD5 for JSON row lookup WHERE clauses so row
  details and drill-down work on FIPS-enabled ClickHouse deployments
- 22f824c6e: fix: keep JSON path segments with special characters quoted in row detail lookups
- 642533255: perf: PromQL label lookups with `match[]` read only the matched metrics' tags
  rows when every selector names its metric
- d0dd06fe8: fix: count legacy STATUS_CODE_ERROR spans as errors on the service map and trace
  waterfall
- 5584f84bb: fix: make clickstack_event_patterns drill-down snippets executable

  Each pattern's `whereSnippet` is now a SQL predicate (`whereLanguage: "sql"`) that keeps the template's token order and variable positions and includes the caller's filter and the source table filter, so passing it to `clickstack_search` returns the pattern's events. Before, a template like `Sending <*> rows` produced `Body:"Sending rows"`, which matched nothing, and map fields produced Lucene that failed to parse. `bodyExpression` now also accepts `JSONExtractString(<column>, '<key>', ...)` to mine a field inside JSON bodies, and the tool reports sample coverage and the actual trend bucket interval and boundaries.

  `clickstack_event_patterns`, `clickstack_emerging_signals` and dashboard event-pattern tiles now apply the log source's `tableFilterExpression`, so their counts can drop for sources that set one. `minePatterns` now reports each cluster's own template; before, it could report the template of a different same-length cluster that some members did not fit.

- 41b2b742a: feat: fall back to server MergeTree settings to detect persisted `_block_number` and `_block_offset` columns when the table's CREATE query omits them
- 442d6dfd9: fix: refresh cached table columns after 5 minutes

  The shared metadata cache kept each table's `DESCRIBE` result for the life of
  the process, so the API did not see columns added with `ALTER TABLE`, such as
  new MATERIALIZED columns, until it restarted. Cached columns now expire after 5
  minutes. Other cached metadata is unchanged.

- eb2439ed0: fix: leave metric points with no recorded value out of charts and alerts

  When a scraped series goes away or a scrape fails, the collector's `prometheus`
  receiver sends a point flagged "no recorded value" (a Prometheus staleness
  marker), and the ClickHouse exporter stores it as zeros. Metric charts and
  alerts read it as a real value: a gauge's `min` and `avg` dropped and `count`
  included the series that went away, and a counter or histogram that came back
  after the marker counted its whole total again. Metric queries now skip points
  with this flag.

- 0a5237e6c: fix: reject alerts on dashboard tiles the alert checker never evaluates (PromQL
  tiles, and builder tiles with unsupported display types), and drop them when a
  dashboard is saved
- 78143c81a: feat: on ClickHouse Cloud, read `system.shared_merge_tree_settings` when detecting `_block_number` and `_block_offset` columns, falling back to `system.merge_tree_settings` per key
- b1d4e60f8: fix: PromQL label lookups (dashboard variables, label autocomplete) now work on TimeSeries tables of schema version 8, the default from ClickHouse 26.10. These keep each series' time range in a separate time ranges table instead of the tags table's min_time/max_time, so match[] failed with "requires store_min_time_and_max_time = 1" and time-bounded lookups read the whole tags table.

## @hyperdx/api@2.44.0

### Minor Changes

- cd0e9edfa: feat: add optional `titleEmoji` webhook option; `false` removes the emoji prefix from notification titles sent through that webhook
- 5b0d07441: feat: self-instrument with `@clickhouse/clickstack-node` and
  `@clickhouse/clickstack-browser` instead of `@hyperdx/node-opentelemetry` and
  `@hyperdx/browser`

  HyperDX's own telemetry changes shape. HTTP spans use the stable semantic
  convention keys (`http.request.method`, `http.response.status_code`,
  `url.full`). pino records come from the `@opentelemetry/instrumentation-pino`
  scope with real severity numbers instead of the `node-logger` scope with
  severity number 0. Console capture covers every `console` call in the API, and
  browser console output is recorded as log records instead of spans. Uncaught
  exceptions are recorded as FATAL log records, and API errors as an exception
  event on the Express span instead of a separate error span.

  Browser telemetry records the user as `user.id`, `user.email` and `user.name`
  instead of `userEmail` and `userName`, keeps the team name as `teamName`, and no
  longer records a `user navigated` action. Browser fetch and XHR spans no longer
  record request and response headers or bodies. Browser sessions restart once
  after the upgrade. The per-signal browser endpoints and
  `NEXT_PUBLIC_OTEL_RESOURCE_ATTRIBUTES` work as before. Browser traces and logs
  are now sent gzip-compressed every 5 seconds. If the browser sends to a
  collector other than ClickStack's, its CORS `allowed_headers` must be `"*"` or
  include `content-type` and `content-encoding` (and `authorization`), and a proxy
  in front of it must forward `Content-Encoding` unchanged.

  The Next.js server now sends its own telemetry in production builds too, not
  only under `next dev`, when `HYPERDX_API_KEY` or `OTEL_EXPORTER_OTLP_HEADERS` is
  set. `HDX_EXPORTER_ENABLED=false` turns it off along with browser telemetry. It
  reports under its own service name, the configured one plus `-next`
  (`hdx-oss-app-next` in the docker-compose `app` service and when no name is
  set), so its spans stay apart from the API's and the browser's. The HyperDX
  images now default `OTEL_SERVICE_NAME` to `hdx-oss-app`. Each `/api` request
  adds Next.js server spans for the proxy hop. Requests for build and `public/`
  assets, such as `/_next/static/*`, `/__ENV.js` and `/pyodide/*`, are not traced.

  `HYPERDX_API_KEY` still enables self-instrumentation. Without
  `OTEL_EXPORTER_OTLP_ENDPOINT`, server-side self-telemetry now goes to
  `http://localhost:4318` instead of `https://in-otel.hyperdx.io`, so set the
  endpoint explicitly. `HDX_NODE_*` variables are no longer read. For request
  headers and bodies set `OTEL_INSTRUMENTATION_HTTP_CAPTURE_HEADERS_*` and
  `CLICKSTACK_CAPTURE_HTTP_BODY`.

- 349fc2141: feat(mcp): add `clickstack_describe_table` to list the tables in a database and describe a table that is not a registered source (columns, keys, engine, skipping indices, approximate size, optional row sample)
- 0eec5e140: feat: Describe PromQL sources in MCP and hide them when PromQL is disabled

  `clickstack_describe_source` now returns the label names and metric names of a PromQL source, from either a ClickHouse TimeSeries table or a Prometheus-compatible endpoint, instead of a column schema. `clickstack_list_sources` and `clickstack_describe_source` show which backend a PromQL source uses, and for TimeSeries tables explain how to read them with `clickstack_sql`. Prometheus endpoint sources no longer show their placeholder table. When `ENABLE_PROMQL` is off, MCP hides PromQL sources from listing, describing and deleting, and `clickstack_save_source` no longer accepts `kind: "promql"`.

- 95fa36412: feat(mcp): support setting a dashboard's `savedFilterValues` via the MCP dashboard tools
- 0b7926d1d: feat: Team members can create team-owned API keys with a description and expiry that keep working after their creator leaves.
- c792850fd: feat: filter the v2 list alerts endpoint by tag, search, source and state

### Patch Changes

- 30b1494d8: feat: add an internal extension point for alert detection strategies; threshold alerts are evaluated as before, and the `alerts.evaluate` metric now carries an `alert_evaluator` attribute
- 0453aa134: fix: A grouped alert whose group vanishes from the data now resolves with the group's values in `{{attributes.*}}` (alert title and message) and `{{var.*}}` (webhook body)
- 5b0d07441: fix: let browsers cache the collector's CORS preflights for 10 minutes

  The OTLP receiver now answers preflights with `Access-Control-Max-Age: 600`.
  Without it, browsers cached a preflight for only 5 seconds, which is how often
  the browser SDK exports, so about half of its requests were preflights.

- 769c0def3: fix: ignore `team` and `createdBy` in dashboard and saved search PATCH bodies so they can't be moved to another team or have their owner rewritten
- 9269f7784: fix: "Denoise results" now removes noise on typical data. A pattern now counts as noisy above 5% of sampled events instead of 10%, which often matched nothing. Patterns that include error or warning lines are never hidden. The MCP `denoise` option uses the same 5% threshold. Denoise also mines the source's body column instead of the last table column, removes ANSI-colored rows that match a noisy pattern, says when results can't be denoised, and shows hidden patterns as a short summary with a shortened, expandable list.
- 48c83790a: docs: Document `minAutoGranularity` on metric and PromQL sources in the external
  API

  `GET`, `POST` and `PUT /api/v2/sources` already accepted and returned
  `minAutoGranularity`, but the OpenAPI spec omitted it, so clients generated from
  the spec dropped or rejected the field.

- 642533255: perf: PromQL label lookups with `match[]` read only the matched metrics' tags
  rows when every selector names its metric
- 631002374: fix: give `clickstack_save_source`'s `highlightedRowAttributeExpressions` parameter a real type in the MCP tool schema (it rendered as an untyped `$ref`), and set `annotations.title` on every MCP tool
- 5584f84bb: fix: make clickstack_event_patterns drill-down snippets executable

  Each pattern's `whereSnippet` is now a SQL predicate (`whereLanguage: "sql"`) that keeps the template's token order and variable positions and includes the caller's filter and the source table filter, so passing it to `clickstack_search` returns the pattern's events. Before, a template like `Sending <*> rows` produced `Body:"Sending rows"`, which matched nothing, and map fields produced Lucene that failed to parse. `bodyExpression` now also accepts `JSONExtractString(<column>, '<key>', ...)` to mine a field inside JSON bodies, and the tool reports sample coverage and the actual trend bucket interval and boundaries.

  `clickstack_event_patterns`, `clickstack_emerging_signals` and dashboard event-pattern tiles now apply the log source's `tableFilterExpression`, so their counts can drop for sources that set one. `minePatterns` now reports each cluster's own template; before, it could report the template of a different same-length cluster that some members did not fit.

- 253a690d4: docs: MCP tool descriptions and the query guide now recommend the quoted Lucene
  form `field:"value"` for exact matches, and bare terms or phrases for log body
  text, so agents keep the primary key and the text index
- 66e394136: feat: MCP `query_tile` and `query_tiles` run PromQL tiles against Prometheus endpoints and ClickHouse TimeSeries tables
- 7e8522914: feat: MCP `clickstack_promql` tool runs PromQL against a PromQL source, and the MCP prompts and instructions cover PromQL sources, tiles and label filters while PromQL is enabled
- 9093282e5: fix: Refuse Prometheus endpoint responses over 8 MB in MCP PromQL label lookups and queries, instead of buffering them whole
- 53bf54096: fix: MCP `query_tile` returns PromQL table and histogram heatmap tiles in the rows the dashboard draws
- 917c9ca49: feat: MCP dashboard tools read and write PromQL tiles and PROMETHEUS_LABEL filters when PromQL is enabled, and hide but keep them when it is disabled
- d08b2fa73: feat(mcp): `clickstack_sql` accepts a `queries` array to run up to 10
  independent queries in parallel under a shared 60s deadline. Each query reports
  its own `ok`/`error`/`timeout` status, so one failing query does not fail the
  others. Single-query calls with `sql` behave as before.
- a13c80efe: feat(mcp): `clickstack_table` takes optional `limit` and `having`, and orders grouped results by the first select item, descending, when no `orderBy` is given
- 0262822da: fix: MCP tool responses that are over the size budget now shorten long strings with a `…(+N chars)` suffix instead of replacing them, say what was trimmed in `trimNotes`, and `clickstack_event_patterns` / `clickstack_emerging_signals` drop samples and shorten long patterns before cutting whole patterns, so the requested `topN` survives when it can
- 442d6dfd9: fix: refresh cached table columns after 5 minutes

  The shared metadata cache kept each table's `DESCRIBE` result for the life of
  the process, so the API did not see columns added with `ALTER TABLE`, such as
  new MATERIALIZED columns, until it restarted. Cached columns now expire after 5
  minutes. Other cached metadata is unchanged.

- eb2439ed0: fix: leave metric points with no recorded value out of charts and alerts

  When a scraped series goes away or a scrape fails, the collector's `prometheus`
  receiver sends a point flagged "no recorded value" (a Prometheus staleness
  marker), and the ClickHouse exporter stores it as zeros. Metric charts and
  alerts read it as a real value: a gauge's `min` and `avg` dropped and `count`
  included the series that went away, and a counter or histogram that came back
  after the marker counted its whole total again. Metric queries now skip points
  with this flag.

- 0eec5e140: fix: Authenticate to Prometheus connections whose host includes credentials

  A Prometheus connection host such as `http://user:pass@prometheus:9090` made every PromQL query fail with "Failed to reach Prometheus", because `fetch` rejects URLs that carry credentials. The credentials are now sent as a Basic auth header.

- 0a5237e6c: fix: reject alerts on dashboard tiles the alert checker never evaluates (PromQL
  tiles, and builder tiles with unsupported display types), and drop them when a
  dashboard is saved
- b7b4d9579: fix: update systeminformation to 5.33.19

  The root `resolutions` pin let the lockfile keep systeminformation 5.30.7, which
  has known command injection advisories, including two high-severity ones in
  `networkInterfaces()` on Linux (GHSA-5xpp-75jx-m839, GHSA-hvx9-hwr7-wjj9). The
  API installs it through `@opentelemetry/instrumentation-host-metrics`, which
  asks for `^5.31.6`, but the old pin held it at 5.30.7. The pin now starts at
  5.33.19, the newest 5.x release, which fixes all of them.

- b1d4e60f8: fix: PromQL label lookups (dashboard variables, label autocomplete) now work on TimeSeries tables of schema version 8, the default from ClickHouse 26.10. These keep each series' time range in a separate time ranges table instead of the tags table's min_time/max_time, so match[] failed with "requires store_min_time_and_max_time = 1" and time-bounded lookups read the whole tags table.
- ef56bd726: fix: usage stats job no longer fails ClickHouse auth on password-protected
  connections
- 90302c773: fix: Block generic and incident.io webhooks whose hostname resolves to a private or reserved address. The check runs on the address actually dialed, so it also covers DNS rebinding. Self-hosted setups that send webhooks to internal hostnames must add them to `WEBHOOK_HOSTNAME_ALLOWLIST`.
- Updated dependencies [142c9cc87]
- Updated dependencies [cd0e9edfa]
- Updated dependencies [9269f7784]
- Updated dependencies [e2754d203]
- Updated dependencies [22f824c6e]
- Updated dependencies [642533255]
- Updated dependencies [d0dd06fe8]
- Updated dependencies [5584f84bb]
- Updated dependencies [41b2b742a]
- Updated dependencies [442d6dfd9]
- Updated dependencies [eb2439ed0]
- Updated dependencies [0b7926d1d]
- Updated dependencies [0a5237e6c]
- Updated dependencies [78143c81a]
- Updated dependencies [b1d4e60f8]
  - @hyperdx/common-utils@0.34.0