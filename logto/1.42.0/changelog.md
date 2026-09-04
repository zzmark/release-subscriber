
<img width="4240" height="2384" alt="logto-changelog-2026" src="https://github.com/user-attachments/assets/d1886510-f18d-4144-b3a2-6852eb88d84c" />

## Highlights

- **Custom domain verification files**: Serve small text or JSON verification files from your active custom domain, so third-party services that verify domain ownership by file no longer need a separate host.
- **Email access rules**: A new email allowlist plus wildcard address and domain patterns give tenants precise control over which emails can sign up or be linked.
- **Reset password magic links**: The reset password landing page can now verify one-time-token magic links.
- **OIDC provider upgraded to node-oidc-provider v9**: Revoking an opaque access token now revokes the whole grant, and the RFC 8414 authorization server metadata endpoint is available.
- **Hardened outbound requests**: OIDC provider SSRF protection is now enabled by default — self-hosted deployments that reach private-network relying parties must opt out explicitly.

## New features & enhancements

### Custom domain verification files

Admins can now attach small verification files to an active custom domain from Console -> Tenant settings -> Domains, without Logto having to model any provider-specific behavior.

Each file has:

- A path that is either a root-level filename with an extension (for example `/verify.txt`) or a path under `/.well-known/`.
- A content type of `text/plain` or `application/json`. JSON content is validated on save.
- Content up to 16 KB.

Up to 10 files can be configured per domain, and paths must be unique. Logto serves exact `GET` and `HEAD` matches with the configured content type and response hardening; existing Logto routes always take precedence over a verification file at the same path. The Console experience is localized across all supported languages.

### Email access rules: allowlist and wildcard patterns

The email blocklist policy is extended into a fuller set of email access rules.

- **Custom email allowlist**: Configure an allowlist of email addresses, domains, or wildcard patterns. When set, only matching emails are accepted for new sign-ups and newly linked emails, on both email registration and account email updates.
- **Wildcard patterns**: The allowlist and the blocklist both accept wildcard email address and domain patterns, such as `foo*@example.com`, `*@example.com`, and `@*.example.com`, alongside exact addresses (`bar@example.com`) and domains (`@example.com`).
- **Conflict warnings**: Console warns when allowlist entries also match a block rule, when an allowlist entry uses a plus sign while email subaddressing is blocked, and when the combined rules would let no new email through at all.

Both features are configured in Console -> Security -> Email blocklist. The matching and validation logic is now shared through reusable helpers in `@logto/core-kit`.

### Reset password magic links

The Experience app now supports password reset flows that verify one-time-token magic links directly from the reset password landing page, in addition to verification codes.

### `Grant.LimitExceeded` webhook event

When OIDC grants are evicted because an application exceeded its max allowed grants limit, Logto now fires a `Grant.LimitExceeded` webhook event, selectable in Console webhook settings like any other event.

The payload reports `userId`, `applicationId`, `revokedGrantIds`, `maxAllowedGrants`, and `preRevocationActiveGrantCount`. Dispatch is fire-and-forget: failures are recorded as `TriggerHook.Grant.LimitExceeded` audit log entries and never block the authentication response.

### OIDC provider upgraded to node-oidc-provider v9

**Security**

- Revoking an opaque access token now also revokes every token under the same grant, including the refresh token. In v8, the refresh token stayed usable after revocation and could keep requesting new access tokens.

**Updates**

- The revocation endpoint now rejects JWT access tokens with `unsupported_token_type`, instead of returning a success response without actually revoking anything as in v8.
- Added the RFC 8414 authorization server metadata endpoint (`/oidc/.well-known/oauth-authorization-server`).
- Removed the redundant `at_hash` claim from ID tokens issued at the token endpoint.
- ID tokens no longer include the optional `typ: "JWT"` header. OpenID Connect defines ID tokens as JWTs and does not require clients to verify this header.

**Action required for custom ID token verification**

No action is required when using an official Logto SDK. If your integration performs custom ID token verification:

- If it requires the `at_hash` claim on ID tokens returned by the token endpoint, update it to allow the claim to be absent.
- If it requires the `typ: "JWT"` header, update it to allow the header to be absent.

### HTTP framework upgraded to Koa 3

Logto now runs on Koa 3, the actively maintained release line that receives Koa's security fixes first. No behavior change is expected: all endpoints, OIDC flows, and API responses behave exactly as before.

## Bug fixes & stability

### Security and API hardening

- Internal application secrets are no longer exposed through Management APIs.
- The email blocklist policy is no longer returned in public sign-in experience responses.
- Retrieving stored third-party provider access tokens through the Account API now requires the `identities` user scope, matching the other social and enterprise SSO identity endpoints.
- Account API verification codes are no longer sent to blocked email addresses.
- Email and email domain validation now matches complete values and enforces stricter domain labels.

### Experience and Account Center

- When a social or SSO registration flow is rejected by email access rules, acknowledging the error now returns the user to the Logto sign-in page instead of navigating back to the external identity provider.
- MFA is now enabled automatically after a user binds a factor through the Account APIs.

### Data integrity and storage

- Creating a new email or SMS connector now runs the insert and the cleanup of old connectors in a single database transaction. Previously a crash between the two statements could leave duplicate connectors behind.
- Redis cluster credentials are now percent-decoded, so connections succeed when the username or password contains URL-reserved characters.
- TLS is now correctly enabled for Redis cluster connections that use the `rediss` protocol.

## Connectors

- **jose v6**: The Apple, Google, OAuth, and OIDC connectors now use jose 6, which runs on the Web Crypto API instead of Node's crypto module. Token signing and ID token verification behave exactly as before.
- **GitLab**: Removed the unused `jose` dependency, so installing the connector no longer pulls in a package it never imported.
- **Aliyun SMS**: Hong Kong phone numbers are now treated as overseas numbers.
- **Aliyun SMS authentication service (MAS)**: The signature is now entered as free text instead of a dropdown, so it keeps working if Aliyun rotates signatures again.

## Self-hosting & OSS notes

- **Action required — OIDC provider SSRF protection**: Outbound request security is strengthened and SSRF protection is now enabled by default. Self-hosted deployments that need to reach trusted relying-party endpoints on private networks must set `OIDC_PROVIDER_SSRF_PROTECTION_DISABLED=true` before starting Logto; otherwise leave the variable unset.
- **Database migration required**: This release ships schema alterations (custom domain verification files, plus internal indexes and tables). After upgrading, run the database alteration command (`npm run alteration deploy` in the `@logto/cli`/core image, or `logto db alteration deploy`) before starting the new version. See the [upgrade guide](https://docs.logto.io/logto-oss/upgrading-oss-version).
- **Custom ID token verification**: See the node-oidc-provider v9 section above for the `at_hash` and `typ` header changes.

## Contributors

Huge thanks to the community members whose work shipped in this release:

- [@Kathircpe](https://github.com/Kathircpe) - `Grant.LimitExceeded` webhook event ([#9230](https://github.com/logto-io/logto/pull/9230)) and transactional passwordless connector replacement ([#9277](https://github.com/logto-io/logto/pull/9277))
- [@d4nyll](https://github.com/d4nyll) - Redis cluster credential decoding ([#9145](https://github.com/logto-io/logto/pull/9145)) and `rediss` TLS fix ([#9144](https://github.com/logto-io/logto/pull/9144))
- [@sjh9714](https://github.com/sjh9714) - Aliyun SMS Hong Kong number handling ([#9111](https://github.com/logto-io/logto/pull/9111))
- [@CertStone](https://github.com/CertStone) - free-text Aliyun SMS MAS signature ([#9228](https://github.com/logto-io/logto/pull/9228))

For the complete list of changes, see the [full changelog](https://github.com/logto-io/logto/blob/master/packages/core/CHANGELOG.md).
