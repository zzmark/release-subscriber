## @hyperdx/app@2.46.0

### Minor Changes

- ca4855d97: feat: filter for or exclude a pattern from Event Patterns

  Each row in Event Patterns now has "Filter for this pattern" and "Exclude this
  pattern" buttons on hover. Each adds a filter for every event that fits the
  pattern in the time range, not only the sampled rows, so the results table,
  histogram and counts all update. Exclusions stack, show as pills next to the
  other filters, survive sidebar filter changes, and are kept in the URL and in
  saved searches. A new include replaces the previous one, and switching source
  removes pattern filters.

- 743c3c1a6: feat: add an optional "Row key expression" to log and trace sources. When set,
  the side panel's row lookup selects and filters on only those columns instead of
  detecting keys from table metadata.
- a7744e82a: feat: add data source variables to dashboard filters and tiles
- a7744e82a: feat: let tiles and filters use a data source variable as their source
- a7744e82a: feat: add connection variables for raw SQL tiles, SQL query filters, and
  connection-scoped data source variables

### Patch Changes

- f15b849da: feat: Ad hoc dashboard filter finishing touches

  - Add an `IN` operator. `IN` conditions on the same key are OR'd into one
    `IN (...)` condition for SQL, or one `=~"a|b"` matcher for PromQL.
  - Ad hoc filters always broadcast (`isBroadcastEnabled: true`), and their
    variable name is only a unique identifier. It is no longer declared as a
    `$variable`.
  - Warn when another ad hoc filter already applies to the same sources.
  - Collapse the filter input to three conditions behind a "+N more" toggle.

- 3a196eb56: Fix blank search panel when switching from a trace source in Event Deltas mode
  to a source that doesn't support deltas (e.g. a log source). The view now falls
  back to the results table and shows a notification.
- 61999b48f: fix: clear the critical CVEs from the app and collector images by moving the
  collector to Alpine 3.24, upgrading gomplate to v5 and dropping the unused goose
  and esbuild binaries. Custom entrypoints that called `goose` directly should
  call `migrate` with the same schema directory instead.
- 832c11ca2: Bring back the Claude Code and Codex CLI commands in the MCP setup panel, next to the `hdx mcp install` command, so connecting an agent no longer needs another CLI installed.
- 3419ab0ae: fix: keep the team switcher and user preferences reachable in the mobile app
  nav. The app shell and nav were sized with `100vh`, which on mobile browsers
  includes the area behind the retractable toolbar, so the bottom of the nav sat
  off screen with no way to scroll to it. They now size to the small viewport.
- cf4b70bec: fix: update the Node dependencies flagged as vulnerable in the app image (axios,
  MCP SDK, express, js-yaml, brace-expansion and others). MCP tool validation
  errors still name the field that failed under the new MCP SDK, and list the
  accepted values when a tile's `displayType` is wrong.
- 272c51486: fix: support numeric range searches on String attributes

  Range searches with numeric bounds on a String-typed field, such as
  `LogAttributes.duration_ms:[10 TO 20]`, failed with "no supertype for types
  String, UInt8". They now compare with `toFloat64OrNull`; values that aren't
  numbers don't match. `>`, `<`, `>=` and `<=` still compare String fields as
  text; use a range such as `:[1000 TO *]` for a numeric comparison.

- ca4ceae90: fix: make the "No organization API keys yet" empty state span the full width of
  the team settings section.
- cac14ebc8: feat: Name PromQL sources "Time Series" or "Prometheus" by their connection

  The source type for a PromQL source now reads "Time Series" when it queries a
  ClickHouse TimeSeries table and "Prometheus" when it queries an external
  Prometheus API. Where no connection is known yet, such as the source form before
  a connection is picked or a data source variable's kinds, it reads "Time Series
  / Prometheus". The stored kind is still `promql`.

  The PromQL source created by onboarding auto-detection and the local dev default
  sources is now named "Time Series" instead of "PromQL".

- 3a10f625f: fix: clicking the source selector selects its current label so typing replaces
  it instead of inserting into the middle of the old name
- 2ee64d8f4: feat: accept source and connection names for dashboard source and connection variables
- a7744e82a: feat: add data source and connection variable types to dashboards
- 0e9fb1bf1: feat: Find settings and preferences from the Cmd+K menu

  - Team settings sections (sources, connections, team members, API keys, MCP
    server, webhooks, query settings, and more) open the right tab and scroll to
    the section.
  - "Preferences" opens the preferences modal, and "Use light mode", "Use dark
    mode", and "Use system color mode" switch the theme directly.

- 3acd5ba1a: feat: create SQL query dashboard filters and fill their dropdowns

  Dashboard filters can now take their values from a ClickHouse SQL query. The filter editor offers a "SQL query values" type with a connection, a SQL editor, and a preview of the values. The dropdown lists the query's first column in the order it returns, up to 10,000 values, and the query can use the time macros and other filters' variables.

- 5b50c31c9: feat: add the SQL query dashboard filter type to the dashboard schema

  A `SQL_QUERY` filter stores a ClickHouse connection and a SQL template whose first column fills the filter's dropdown. It is variable-only. Validation flags templates that use `$__sourceTable` or `$__filters`, or whose macros and variable references can't expand. The filter is not yet exposed through the external API or MCP, and has no editor or values lookup yet.

- 50129d13d: fix: time chart series keep the same color across refreshes; series are now
  ordered by name instead of by the order ClickHouse returned them
- 3c8794f2c: fix: stacked bar and stacked line charts no longer show duplicate Y-axis labels
  (e.g. "0, 500, 1k, 2k, 2k" when 1.5k rounds to 2k)
- a4f68568e: feat: dashboard tile alerts can use a 1 minute interval outside development
- 1556317ea: feat: small addition to user preferences
- Updated dependencies [f15b849da]
- Updated dependencies [6705e505d]
- Updated dependencies [b681cec85]
- Updated dependencies [8952972c9]
- Updated dependencies [f42c68a9c]
- Updated dependencies [fe96b722b]
- Updated dependencies [61999b48f]
- Updated dependencies [bfb5c834f]
- Updated dependencies [02a40929d]
- Updated dependencies [8dc1aa791]
- Updated dependencies [6256667e1]
- Updated dependencies [cf4b70bec]
- Updated dependencies [272c51486]
- Updated dependencies [cac14ebc8]
- Updated dependencies [d311d82e2]
- Updated dependencies [743c3c1a6]
- Updated dependencies [a7744e82a]
- Updated dependencies [a7744e82a]
- Updated dependencies [a7744e82a]
- Updated dependencies [fa3a5649e]
- Updated dependencies [3acd5ba1a]
- Updated dependencies [5b50c31c9]
  - @hyperdx/common-utils@0.36.0
  - @hyperdx/api@2.46.0

## @hyperdx/otel-collector@2.46.0

### Minor Changes

- 4b66d1f9a: chore(otel-collector): bump base collector to v0.165.0

  Upgrade the custom OTel Collector base from contrib v0.155.0 (core 1.61.0) to
  v0.165.0 (core 1.71.0), picking up upstream Go and dependency CVE fixes in the
  collector and OpAMP supervisor binaries.

  A custom supervisor config that sets `reports_remote_config` must drop it: the
  supervisor refuses to start with it from v0.163.0, and `accepts_remote_config`
  now covers both.

  `k8sattributes` now emits the stable Kubernetes semantic conventions only. Pod,
  node and namespace `labels.*` and `annotations.*` become `label.*` and
  `annotation.*`, and `container.image.tag` becomes `container.image.tags`. Set
  `OTEL_AGENT_FEATURE_GATE_ARG=--feature-gates=-processor.k8sattributes.DontEmitV0K8sConventions`
  to keep emitting the legacy names alongside the new ones while you migrate.

### Patch Changes

- 61999b48f: fix: clear the critical CVEs from the app and collector images by moving the
  collector to Alpine 3.24, upgrading gomplate to v5 and dropping the unused goose
  and esbuild binaries. Custom entrypoints that called `goose` directly should
  call `migrate` with the same schema directory instead.

## @hyperdx/common-utils@0.36.0

### Minor Changes

- fe96b722b: feat: add `buildCompactPatternPredicate`

  It builds the same match as `buildPatternPredicate` in much shorter SQL, for
  pattern filters that are kept in a URL. `parsePatternPredicate` reads both
  forms.

- d311d82e2: feat: share the Event Patterns drill-down predicate

  `templateToRegex` and `buildPatternPredicate`, which the MCP server uses to
  build the `clickstack_event_patterns` drill-down filter, are now in
  `@hyperdx/common-utils/dist/drain`. New options match templates mined with extra
  delimiters (`extraDelimiters`) or by Python Drain3 (`whitespace: 'python'`), and
  `parsePatternPredicate` reads a predicate back into its value expression and
  template. Without options the output is the same as the MCP server's.

- 743c3c1a6: feat: add an optional "Row key expression" to log and trace sources. When set,
  the side panel's row lookup selects and filters on only those columns instead of
  detecting keys from table metadata.
- a7744e82a: feat: add data source and connection variable types to dashboards
- a7744e82a: feat: add connection variables for raw SQL tiles, SQL query filters, and
  connection-scoped data source variables

### Patch Changes

- f15b849da: feat: Ad hoc dashboard filter finishing touches

  - Add an `IN` operator. `IN` conditions on the same key are OR'd into one
    `IN (...)` condition for SQL, or one `=~"a|b"` matcher for PromQL.
  - Ad hoc filters always broadcast (`isBroadcastEnabled: true`), and their
    variable name is only a unique identifier. It is no longer declared as a
    `$variable`.
  - Warn when another ad hoc filter already applies to the same sources.
  - Collapse the filter input to three conditions behind a "+N more" toggle.

- 02a40929d: feat: `clickstack_save_alert` accepts `note` and `numConsecutiveWindows`

  Updates that omit either field now keep the stored value instead of clearing it;
  send `null` to clear.

- 272c51486: fix: support numeric range searches on String attributes

  Range searches with numeric bounds on a String-typed field, such as
  `LogAttributes.duration_ms:[10 TO 20]`, failed with "no supertype for types
  String, UInt8". They now compare with `toFloat64OrNull`; values that aren't
  numbers don't match. `>`, `<`, `>=` and `<=` still compare String fields as
  text; use a range such as `:[1000 TO *]` for a numeric comparison.

- 3acd5ba1a: feat: create SQL query dashboard filters and fill their dropdowns

  Dashboard filters can now take their values from a ClickHouse SQL query. The filter editor offers a "SQL query values" type with a connection, a SQL editor, and a preview of the values. The dropdown lists the query's first column in the order it returns, up to 10,000 values, and the query can use the time macros and other filters' variables.

- 5b50c31c9: feat: add the SQL query dashboard filter type to the dashboard schema

  A `SQL_QUERY` filter stores a ClickHouse connection and a SQL template whose first column fills the filter's dropdown. It is variable-only. Validation flags templates that use `$__sourceTable` or `$__filters`, or whose macros and variable references can't expand. The filter is not yet exposed through the external API or MCP, and has no editor or values lookup yet.

## @hyperdx/api@2.46.0

### Minor Changes

- 6705e505d: feat: Create, read, and update ad hoc dashboard filters through the external API

  `/api/v2/dashboards` now accepts and returns `ADHOC` filters, with SQL and
  PromQL source types, and their `adhoc` entries in `savedFilterValues`. Each
  filter's sources must exist and be a kind its `sourceType` supports. MCP still
  hides ad hoc filters.

- b681cec85: feat(mcp): Create, read, and update ad hoc dashboard filters through the MCP dashboard tools

  `clickstack_save_dashboard`, `clickstack_get_dashboard`, and
  `clickstack_patch_dashboard` now handle `ADHOC` filters and their `adhoc`
  saved conditions. PromQL ad hoc filters are offered only while PromQL is
  enabled, and are hidden and kept on update otherwise. Saved conditions that
  name no ad hoc filter, or use an operator their filter can't apply, produce a
  warning.

- 743c3c1a6: feat: add an optional "Row key expression" to log and trace sources. When set,
  the side panel's row lookup selects and filters on only those columns instead of
  detecting keys from table metadata.
- a7744e82a: feat: add data source and connection variable types to dashboards
- a7744e82a: feat: support data source and connection variables in the external API and MCP
- a7744e82a: feat: add connection variables for raw SQL tiles, SQL query filters, and
  connection-scoped data source variables

### Patch Changes

- f15b849da: feat: Ad hoc dashboard filter finishing touches

  - Add an `IN` operator. `IN` conditions on the same key are OR'd into one
    `IN (...)` condition for SQL, or one `=~"a|b"` matcher for PromQL.
  - Ad hoc filters always broadcast (`isBroadcastEnabled: true`), and their
    variable name is only a unique identifier. It is no longer declared as a
    `$variable`.
  - Warn when another ad hoc filter already applies to the same sources.
  - Collapse the filter input to three conditions behind a "+N more" toggle.

- 8952972c9: perf: check-alerts gives each alert only its own previous history, so a tick
  no longer scans every alert's group history once per alert
- f42c68a9c: chore: bump `uuid` to 11.1.1 (fixes GHSA-w5hq-g745-h8pq) and drop `@types/uuid`
- 61999b48f: fix: clear the critical CVEs from the app and collector images by moving the
  collector to Alpine 3.24, upgrading gomplate to v5 and dropping the unused goose
  and esbuild binaries. Custom entrypoints that called `goose` directly should
  call `migrate` with the same schema directory instead.
- bfb5c834f: Use the log source body expression for bare-text MCP searches, pattern filters,
  event deltas, and alert alias queries when no implicit search column is set.
- 02a40929d: feat: `clickstack_save_alert` accepts `note` and `numConsecutiveWindows`

  Updates that omit either field now keep the stored value instead of clearing it;
  send `null` to clear.

- 8dc1aa791: refactor: the MCP `clickstack_event_patterns` tool builds its drill-down
  `whereSnippet` with the shared pattern predicate from `@hyperdx/common-utils`
  instead of its own copy. The snippet is unchanged.
- 6256667e1: fix(mcp): Rename `clickstack_trace_top_time_consuming_operations` to `clickstack_trace_top_time_consuming_ops`

  The old name was the longest MCP tool name and exceeded the tool-name length
  limit some MCP clients enforce. Clients that call the tool by its old name
  need to switch to the new one.

- cf4b70bec: fix: update the Node dependencies flagged as vulnerable in the app image (axios,
  MCP SDK, express, js-yaml, brace-expansion and others). MCP tool validation
  errors still name the field that failed under the new MCP SDK, and list the
  accepted values when a tile's `displayType` is wrong.
- 272c51486: fix: support numeric range searches on String attributes

  Range searches with numeric bounds on a String-typed field, such as
  `LogAttributes.duration_ms:[10 TO 20]`, failed with "no supertype for types
  String, UInt8". They now compare with `toFloat64OrNull`; values that aren't
  numbers don't match. `>`, `<`, `>=` and `<=` still compare String fields as
  text; use a range such as `:[1000 TO *]` for a numeric comparison.

- cac14ebc8: feat: Name PromQL sources "Time Series" or "Prometheus" by their connection

  The source type for a PromQL source now reads "Time Series" when it queries a
  ClickHouse TimeSeries table and "Prometheus" when it queries an external
  Prometheus API. Where no connection is known yet, such as the source form before
  a connection is picked or a data source variable's kinds, it reads "Time Series
  / Prometheus". The stored kind is still `promql`.

  The PromQL source created by onboarding auto-detection and the local dev default
  sources is now named "Time Series" instead of "PromQL".

- fa3a5649e: feat: accept SQL query dashboard filters in the API, external API, and MCP

  Saving a dashboard now rejects a `SQL_QUERY` filter whose connection doesn't belong to the team. The external API and MCP read and write the filter with a `connectionId`, and MCP warns about unknown variables and source-only macros in its SQL.

- 5b50c31c9: feat: add the SQL query dashboard filter type to the dashboard schema

  A `SQL_QUERY` filter stores a ClickHouse connection and a SQL template whose first column fills the filter's dropdown. It is variable-only. Validation flags templates that use `$__sourceTable` or `$__filters`, or whose macros and variable references can't expand. The filter is not yet exposed through the external API or MCP, and has no editor or values lookup yet.

- Updated dependencies [f15b849da]
- Updated dependencies [fe96b722b]
- Updated dependencies [02a40929d]
- Updated dependencies [272c51486]
- Updated dependencies [d311d82e2]
- Updated dependencies [743c3c1a6]
- Updated dependencies [a7744e82a]
- Updated dependencies [a7744e82a]
- Updated dependencies [3acd5ba1a]
- Updated dependencies [5b50c31c9]
  - @hyperdx/common-utils@0.36.0
