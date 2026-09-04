![logto-changelog-2025-01](https://github.com/user-attachments/assets/97d81f2e-6369-40e8-9a3d-ea4cf5a9cb84)


## Highlights

- **Wildcard redirect URIs**: Support wildcard patterns (`*`) in redirect URIs for dynamic environments like preview deployments, making development workflows easier. (Thanks [@Arochka](https://github.com/Arochka)!)
- **Token exchange app-level control**: Fine-grained control over token exchange grant type per application, with M2M apps now supporting this feature.
- **Trust unverified email for SSO**: OIDC social connectors and enterprise SSO connectors can now sync emails even when `email_verified` is missing or false.

## New features & enhancements

### Wildcard patterns in redirect URIs

Added support for wildcard patterns (`*`) in redirect URIs to better support dynamic environments like preview deployments. (Contributed by [@Arochka](https://github.com/Arochka) in [#8094](https://github.com/logto-io/logto/pull/8094))

Rules (web only):
- Wildcards are allowed for http/https redirect URIs in the hostname and/or pathname
- Wildcards are rejected in scheme, port, query, and hash
- Hostname wildcard patterns must contain at least one dot to avoid overly broad patterns

### Token exchange grant type with app-level control

- Add `allowTokenExchange` field to `customClientMetadata` to control whether an application can initiate token exchange requests
- Machine-to-machine applications now support token exchange
- All new applications will have token exchange disabled by default; enable it in application settings
- For backward compatibility, existing first-party Traditional, Native, and SPA applications will have this enabled
- Third-party applications are not allowed to use token exchange
- Added UI toggle in Console with risk warning for public clients (SPA / native application)

### Trust unverified email for OIDC connectors

- Add `trustUnverifiedEmail` to the OIDC social connector config (default `false`) to allow syncing emails when `email_verified` is missing or false
- Apply the setting in core OIDC/Azure OIDC SSO connectors and expose it in the Admin Console

### Skip required identifiers for social sign-in

A new option `skipRequiredIdentifiers` is available for social sign-in and sign-up flows. When enabled, users can bypass the mandatory identifier collection step during social sign-in and sign-up.

This is particularly useful for iOS apps where Apple App Store guidelines mandate that social sign-in options like "Sign in with Apple" should not require additional information collection beyond what is provided by the social IdP.

In the Logto Console, this option is represented as a checkbox labeled "Require users to provide missing sign-up identifier" under the "Social sign-in" section.

### User role API improvements

- POST `/users/:userId/roles` now returns `{ roleIds: string[]; addedRoleIds: string[] }` where `roleIds` echoes the requested IDs, and `addedRoleIds` includes only the IDs that were newly created
- PUT `/users/:userId/roles` now returns `{ roleIds: string[] }` to confirm the final assigned roles

### @logto/api SDK enhancement

Added `createApiClient` function for custom token authentication. This new function allows you to create a type-safe API client with your own token retrieval logic, useful for scenarios like custom authentication flows.

## Bug fixes & stability

### Postgres statement timeout configuration

Allow disabling Postgres `statement_timeout` for PgBouncer/RDS Proxy compatibility:
- Set `DATABASE_STATEMENT_TIMEOUT=DISABLE_TIMEOUT` to omit the startup parameter

### Enterprise SSO error code fix

Fixed the enterprise SSO account not exist error code to use a specific one instead of the generic social account error.

### JIT email domains pagination fix

Removed default pagination from `GET /organizations/:id/jit/email-domains` to ensure all JIT email domains are returned in the Console's Organization details page.

### Direct sign-in stability

Prevented repeated auto sign-in requests on direct sign-in page that could cause unexpected behavior in certain scenarios.

### Console audit log fixes

- Removed deprecated interaction log events from the Console audit log filter menu
- Fixed dropdown event key typo that caused empty filter results for several events
