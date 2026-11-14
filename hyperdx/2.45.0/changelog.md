## @hyperdx/app@2.45.0

### Minor Changes

- b3cbd0260: feat: split the service map by up to 3 extra group-by SQL expressions (for
  example `ResourceAttributes['k8s.pod.name']`), so a node is a service plus
  those values and a slow or failing pod is no longer averaged into its service.

### Patch Changes

- ac913ceb3: feat: Choose how a PromQL source on ClickHouse is evaluated (the Prometheus HTTP API or the `prometheusQuery` table functions) instead of probing the server on every query. Without a choice the server is still probed, but the answer is now kept for 5 minutes. A source set to the HTTP API against a server that does not serve it fails with a clear error. Onboarding pins a PromQL source it detects to the HTTP API when the server serves it.
- Updated dependencies [c17fc16a2]
- Updated dependencies [1fba1c381]
- Updated dependencies [7b03880eb]
- Updated dependencies [2d17de5d7]
- Updated dependencies [ac913ceb3]
- Updated dependencies [7cfd333ea]
- Updated dependencies [db4e7ba67]
  - @hyperdx/api@2.45.0
  - @hyperdx/common-utils@0.35.0

## @hyperdx/otel-collector@2.45.0

## @hyperdx/common-utils@0.35.0

### Minor Changes

- 2d17de5d7: feat: serve PromQL label lookups from ClickHouse's Prometheus HTTP API

  On ClickHouse 26.9+ with the `prometheus_api_v1` handler, `/labels` and `/label/:name/values` for a ClickHouse-backed PromQL source now proxy to the handler instead of querying the TimeSeries tags table with SQL. Older servers, servers without the handler, and sources set to `table-function` keep the SQL path, so a source that runs queries over HTTP on 26.6-26.8 still gets label autocomplete.

### Patch Changes

- ac913ceb3: feat: Choose how a PromQL source on ClickHouse is evaluated (the Prometheus HTTP API or the `prometheusQuery` table functions) instead of probing the server on every query. Without a choice the server is still probed, but the answer is now kept for 5 minutes. A source set to the HTTP API against a server that does not serve it fails with a clear error. Onboarding pins a PromQL source it detects to the HTTP API when the server serves it.

## @hyperdx/api@2.45.0

### Minor Changes

- 2d17de5d7: feat: serve PromQL label lookups from ClickHouse's Prometheus HTTP API

  On ClickHouse 26.9+ with the `prometheus_api_v1` handler, `/labels` and `/label/:name/values` for a ClickHouse-backed PromQL source now proxy to the handler instead of querying the TimeSeries tags table with SQL. Older servers, servers without the handler, and sources set to `table-function` keep the SQL path, so a source that runs queries over HTTP on 26.6-26.8 still gets label autocomplete.

- db4e7ba67: chore: upgrade bundled ClickHouse to 26.10.3.7

  The all-in-one image and the Docker Compose files now use
  `clickhouse/clickhouse-server:26.10.3.7-alpine`. New TimeSeries tables default
  to schema version 8, which keeps each series' time range in a separate inner
  table; existing tables keep their layout. `system.metric_log` switches to the
  bucketed schema, and rows from before the upgrade move to `system.metric_log_0`.

### Patch Changes

- c17fc16a2: fix: `{{note}}` in webhook bodies now contains the alert's note when the alert
  fires, not only in "Send test"
- 1fba1c381: fix: mark the MCP `clickstack_save_webhook` and `clickstack_save_alert` tools as open-world

  Saved webhooks and alerts send HTTP requests to third-party endpoints, so both tools now declare `openWorldHint: true`.

- 7b03880eb: feat: read the MCP PromQL label catalog from ClickHouse's Prometheus HTTP API

  `describe_source` on a ClickHouse-backed PromQL source now lists label and metric names through the `prometheus_api_v1` handler on ClickHouse 26.9+, and falls back to SQL on older servers, servers without the handler, and sources set to `table-function`.

- ac913ceb3: feat: Choose how a PromQL source on ClickHouse is evaluated (the Prometheus HTTP API or the `prometheusQuery` table functions) instead of probing the server on every query. Without a choice the server is still probed, but the answer is now kept for 5 minutes. A source set to the HTTP API against a server that does not serve it fails with a clear error. Onboarding pins a PromQL source it detects to the HTTP API when the server serves it.
- 7cfd333ea: fix(mcp): drop the health verdict from clickstack_service_health

  The tool no longer labels services critical, degraded or healthy, and no longer
  tells agents a service needs "no action". Each service keeps its threshold
  flags, score and a factual summary, so agents reason from the numbers instead of
  a verdict that service-wide totals can get wrong. `summary.statusCounts` is
  replaced by `summary.servicesFlagged`, and the span attributes
  `mcp.service_health.critical_count` and `mcp.service_health.degraded_count` are
  replaced by `mcp.service_health.flagged_count`.

- Updated dependencies [2d17de5d7]
- Updated dependencies [ac913ceb3]
  - @hyperdx/common-utils@0.35.0
