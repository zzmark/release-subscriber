<img width="2120" height="1192" alt="logto-changelog-2026-05" src="https://github.com/user-attachments/assets/417b6b55-1ddf-455d-a800-d6a1a4fe0489" />

## Highlights

- **Audit logs time-range picker**: Scope the audit log to a bounded time window (preset windows plus a custom range), backed by a server-side count cap that keeps large-volume tenants responsive.
- **Organization membership webhook deltas**: `Organization.Membership.Updated` now reports exactly which users and applications were added or removed.
- **Faster organizations at scale**: New secondary indexes and query rewrites speed up membership listing and per-user role lookups on large tenants.
- **Air-gapped & self-hosted friendliness**: A new `--dapc` install/seed flag and DB-direct admin signing keys remove outbound-network and DNS friction for OSS deployments.
- **New connectors**: MailJunky email, SMSBao SMS, and the Aliyun SMS authentication service connector, plus Aliyun Direct Mail regions and richer WeCom profiles.

## New features & enhancements

### Audit logs time-range picker

- The Console audit logs page now ships a time-range picker with a default window of the last 7 days. Presets cover `Last 1 hour` / `Last 24 hours` / `Last 7 days` / `Last 30 days`, plus a custom date range.
- The API gains `start_time` and `end_time` query parameters on `GET /api/logs` and `GET /api/hooks/{id}/recent-logs` (exclusive bounds, unix milliseconds). On `GET /api/hooks/{id}/recent-logs`, supplying either bound replaces the default 24-hour lower bound.
- A new `enableCap=true` query parameter on `GET /api/logs` and `GET /api/hooks/{id}/recent-logs` short-circuits the count query at ~10,000 rows to reduce `statement_timeout` risk on very large log volumes. Capped responses return a `Total-Number-Is-Capped: true` header, and the Console renders a Prev/Next layout in that case. Default behavior (without the param) is unchanged.

### Organization membership webhook deltas

- The `Organization.Membership.Updated` webhook payload is enriched with explicit delta fields: `addedUserIds` / `removedUserIds` and `addedApplicationIds` / `removedApplicationIds` across the user and application membership endpoints, plus `addedUserIds` on invitation accept and just-in-time provisioning (email-domain JIT and enterprise SSO JIT).
- Empty deltas are omitted; each delta array is capped at 5000 entries (reconcile bulk changes via `GET /organizations/:id/users` or `.../applications`). This is an additive, non-breaking change — see the [webhook reference](https://docs.logto.io/developers/webhooks/webhooks-request#organizationmembershipupdated-payload).

### Account API: sessions `isCurrent`

- `GET /api/my-account/sessions` now returns `isCurrent: boolean` on every entry, so session-management UIs can mark the "This device" entry and avoid revoking the caller's own session. The admin user-sessions endpoints are unchanged.

### Performance for large organizations

- `GET /organizations/:id/users` is rewritten to aggregate roles via a `LATERAL` subquery, so `LIMIT` prunes the user set before role lookups instead of materializing the full `members × roles` join on every page.
- New secondary indexes speed up reverse lookups: `organization_user_relations (tenant_id, user_id)` (hit on every sign-in and the membership middleware) and `organization_role_user_relations (tenant_id, organization_id, user_id)` (hit by `getUserScopes` and per-user role joins).
- `PUT /organizations/:id/users` now uses a new delta-based `replaceWithDelta()` query that writes only the rows that actually changed, preserving role assignments for members whose membership survives the update.

### OpenAPI: accurate arbitrary-object types

- Arbitrary JSON object schemas now declare `additionalProperties: true` in the OpenAPI document, so generated TypeScript clients (e.g. `@logto/api`) type fields such as `customData` as `{ [key: string]: unknown }` instead of `Record<string, never>`.

## Bug fixes & stability

### Experience

- **Terms agreement on sign-in-to-registration**: When the agreement policy is `ManualRegistrationOnly`, signing in with an unregistered email or phone and then confirming "create a new account" now prompts the terms agreement before the account is created, matching the dedicated registration and social/SSO flows.

### Account Center

- **Initial password setup**: Users with no password, no primary email, and no primary phone can now set their initial password without a verification record through the Account API.
- **Silent re-authentication**: On a user-info error (e.g. a stale access token after switching users in the same browser), Account Center re-authenticates with `prompt=none` instead of forcing the login screen, falling back to `prompt=login` only when no valid session exists.
- **Expired sessions**: Expired Account Center sessions now redirect cleanly without flashing the manual sign-in error.
- **Social linking callback**: The social linking callback is rendered through React Router so `connectorId` is read correctly, fixing a spurious "social sign-in method is not enabled" error.
- **2-step verification label**: Clarified the Account Center 2-step verification toggle label.

### Internationalization

- Corrected the Chinese translation of "Passkey" in the MFA experience phrases.

## Self-hosting & OSS notes

- **Air-gapped admin setup (`--dapc`)**: The `install` and `db seed` commands accept a new `--dapc` flag (alias `--disable-admin-pwned-password-check`). It seeds the admin password policy with the Have I Been Pwned breach check disabled, so the first admin sign-up no longer hangs when `api.pwnedpasswords.com` is unreachable.
- **Admin signing keys read from the database**: OSS deployments now read the admin tenant signing keys directly from the database, removing the extra host/DNS mappings that previously let the container fetch its own admin tenant OIDC configuration through the external endpoint.
- **Database migration required**: This release ships schema alterations (the new organization-relation indexes and additional internal columns). After upgrading, run the database alteration command (`npm run alteration deploy` in the `@logto/cli`/core image, or `logto db alteration deploy`) before starting the new version. See the [upgrade guide](https://docs.logto.io/logto-oss/upgrading-oss-version).

## Connectors

- **New — MailJunky email connector**: Send transactional auth emails via the MailJunky send API.
- **New — SMSBao SMS connector**: Domestic SMS verification flows via SMSBao.
- **New — Aliyun SMS authentication service connector**: Adds the Aliyun SMS authentication (MAS) service.
- **Aliyun Direct Mail regions**: The Aliyun DM connector now supports configuring the Direct Mail region.
- **WeCom**: Fetches richer user profile details via additional API calls.
- **SMTP**: The `auth` config may now omit `user` and `pass`, so relays that authorize by source (e.g. IP/VLAN) can be configured without forging credentials.
- **Connector Kit**: Tightened email branding URL detection to avoid false positives on dotted abbreviations.

## Contributors

Huge thanks to the community members whose work shipped in this release:

- [@devadarshh](https://github.com/devadarshh) — MailJunky email connector ([#8638](https://github.com/logto-io/logto/pull/8638))
- [@wintbiit](https://github.com/wintbiit) — SMSBao SMS connector ([#8871](https://github.com/logto-io/logto/pull/8871))
- [@CertStone](https://github.com/CertStone) — Aliyun SMS authentication service connector ([#8385](https://github.com/logto-io/logto/pull/8385))
- [@liyujun-dev](https://github.com/liyujun-dev) — WeCom profile enrichment ([#8191](https://github.com/logto-io/logto/pull/8191))
- [@aayushbaluni](https://github.com/aayushbaluni) — email URL detection fix ([#8747](https://github.com/logto-io/logto/pull/8747))
- [@rotempasharel1](https://github.com/rotempasharel1) — Chinese Passkey translation fix ([#8870](https://github.com/logto-io/logto/pull/8870))
- [@taka-guevara](https://github.com/taka-guevara) — Account Center silent re-authentication ([#8785](https://github.com/logto-io/logto/pull/8785))
- [@darcyYe](https://github.com/darcyYe) — `--dapc` air-gapped admin seed flag ([#8859](https://github.com/logto-io/logto/pull/8859))
- [@chiche84](https://github.com/chiche84) — original organization membership webhook delta proposal ([#8752](https://github.com/logto-io/logto/pull/8752))

For the complete list of changes, see the [full changelog](https://github.com/logto-io/logto/blob/master/packages/core/CHANGELOG.md).
