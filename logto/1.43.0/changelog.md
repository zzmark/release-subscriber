<img width="2120" height="1192" alt="logto-changelog-2026" src="https://github.com/user-attachments/assets/8c173344-814c-4220-99ce-250e6b537db6" />


Sign-in Experience now supports `es-MX` (Spanish, Mexico).

For users whose language is Spanish (Mexico), phone inputs default to the Mexico country code (`+52`). This release also fixes list formatter placeholders and the remaining untranslated MFA message in the Spanish locales.

## Security hardening

### SSRF protection for webhooks and enterprise SSO

Outbound requests configured through the Management API are now blocked when they resolve to loopback, private, link-local, cloud metadata, or other special-use addresses.

Protection now covers:

- Webhook delivery, including `POST /api/hooks/:id/test`.
- OIDC enterprise SSO discovery, token, and userinfo requests.
- SAML identity-provider metadata fetching.
- Every redirect hop made by these requests.

DNS names are checked when the connection is established, so a hostname that resolves to a protected address is rejected like a literal IP address.

### Token exchange validation

In addition to requiring first-party subject tokens, Logto now validates that a JWT presented as an `access_token` subject is actually an access token.

The JWT must contain:

- The RFC 9068 `at+jwt` type header.
- A `client_id` claim.

OIDC ID tokens and other JWTs signed by the tenant can no longer be substituted for an access token. Invalid subject tokens are rejected with `invalid_grant`.

### Third-party Account API restrictions

Third-party applications can no longer mutate account data through the Account API or Verification API. Such requests now return:

```text
403 auth.third_party_application_forbidden
```

First-party applications, including Account Center and Console, are unaffected.

The check fails closed for unresolved client identifiers. This includes deleted applications whose access tokens are still active and CIMD clients whose identifier is a metadata URL.

No read route received a new direct guard. However, the following reads require verification records created through guarded routes and are therefore no longer reachable by third-party applications:

- `GET /api/my-account/grants`
- `GET /api/my-account/sessions`
- `GET /api/my-account/mfa-verifications/backup-codes`

### Suspended users cannot receive new tokens

Token issuance and userinfo now reject suspended users with `invalid_grant`, matching the existing behavior for deleted users.

This applies across refresh token, authorization code, device code, and token exchange flows, even if an earlier token or session revocation did not complete successfully.

### Third-party application scopes are revalidated

Removing a user scope from a third-party application's consent configuration now affects existing grants as well as new authorization requests.

- Refresh token exchanges drop scopes that are no longer configured.
- Authorization requests resuming an existing grant fail with `invalid_scope` when appropriate.
- Organization token requests fail with `insufficient_scope` after the organizations scope is removed.
- Consent submission no longer grants a scope that was removed while the consent screen was open.

### Identifier lockouts use normalized identifiers

Sentinel lockout counters now use the same normalized identifier form as account lookup:

- Email addresses are lower-cased.
- Phone numbers are canonicalized.
- Usernames are case-folded only when the tenant's username policy is case-insensitive.

This prevents alternate spellings of the same identifier from creating separate attempt buckets and weakening `maxAttempts`.

Manual unlock also clears equivalent spellings where they identify the same account. After upgrading, an existing lockout recorded under a non-canonical spelling may end early, but no user becomes more locked out than before.

### Redirect validation

- Social landing-page `redirect_to` values must use `http` or `https`.
- Native callback links must use a custom application scheme.
- Stored callback links are checked again before the browser returns control to a native app.
- The unused Experience Springboard route has been removed to eliminate an untrusted redirect surface.

## Bug fixes & stability

### Authentication and authorization

- Revoking a user's third-party application authorization now invalidates only that application's tokens. The user's browser SSO session remains active.
- Elliptic Curve signing keys now advertise the algorithm matching their curve: P-256 uses `ES256`, P-384 uses `ES384`, and P-521 uses `ES512`.
- Switching from passkey sign-in to verification-code sign-in no longer prevents users from completing CAPTCHA.
- OIDC `invalid_scope` and `insufficient_scope` messages now show the rejected scope instead of raw `{{error_description}}` or `{{scope}}` placeholders.

### Experience and localization

- Safari and other password managers can now suggest and save a strong password on set-password and reset-password screens using the correct account identifier.
- `Accept-Language` quality values with whitespace, such as `en; q=0.7`, are now parsed correctly. Invalid quality values fall back safely instead of producing `NaN`.
- Gmail custom allowlist and blocklist matching now treats `gmail.com` and `googlemail.com` as equivalent and ignores dots in the local part.
- Console now provides clearer examples, descriptions, and shorter placeholders for custom email rules.

### Account Center and Management API

- Saving Account Center or sign-up settings now drops references to deleted custom profile fields instead of returning `custom_profile_fields.entity_not_exists_with_names`.
- Deleted fields remain removable from Console even when their permission control is Off.
- Management API relation endpoints now accept empty scope or role arrays as no-ops instead of returning a 500 error. This includes endpoints such as:
  - `POST /applications/:applicationId/user-consent-scopes`
  - `POST /organizations/:id/users/:userId/roles`
- Date validation now matches the complete input and rejects trailing characters after an otherwise valid date.

### Webhook delivery

Webhook POST requests now retry up to three times when the endpoint returns an HTTP 5xx response, matching the documented delivery contract.

Because a retried event may be delivered more than once, webhook receivers should process events idempotently.

## Connectors

### Microsoft Azure AD

The Microsoft Azure AD connector now supports a `disableEmailSync` option.

By default, the connector continues to copy the Microsoft Graph `mail` attribute into the Logto user profile. Enable this option when the connector should authenticate the user without synchronizing that address, matching the existing control available for Azure OIDC enterprise SSO.

## Self-hosting & OSS notes

- **Action required — outbound request protection**: If webhooks or enterprise SSO connectors intentionally access services on a private network, add the required IP addresses or CIDR ranges to `SSRF_ALLOWED_ADDRESSES` before upgrading:

  ```text
  SSRF_ALLOWED_ADDRESSES=10.0.0.0/8,127.0.0.1
  ```

  Allowlisting only the required destinations is safer than disabling protection globally.

- **Dynamic app compatibility**: Configuring `SSRF_ALLOWED_ADDRESSES` disables CIMD so unauthenticated dynamic clients cannot use the allowlist to reach private services. Setting `SSRF_PROTECTION_DISABLED=true` also disables CIMD.

- **Configuration compatibility**: `OIDC_PROVIDER_SSRF_PROTECTION_DISABLED` remains supported as an alias for `SSRF_PROTECTION_DISABLED`. These variables apply only to self-hosted deployments.

- **Script runtime limits**: Custom JWT and Actions scripts must complete within 5 seconds, stay within the 128 MB worker memory budget, and return JSON-serializable values.

- **Database migration required**: This release ships new schema alterations and indexes. After upgrading, run the database alteration command (`npm run alteration deploy` in the `@logto/cli`/core image, or `logto db alteration deploy`) before starting the new version. See the [upgrade guide](https://docs.logto.io/logto-oss/upgrading-oss-version).

## Contributors

Huge thanks to the community members whose work shipped in this release:

- [@arpitjain099](https://github.com/arpitjain099) - complete-string date validation ([#9266](https://github.com/logto-io/logto/pull/9266))
- [@shuvamk](https://github.com/shuvamk) - RFC-compliant `Accept-Language` quality parsing ([#9338](https://github.com/logto-io/logto/pull/9338))
- [@darcyYe](https://github.com/darcyYe) - webhook retries for HTTP 5xx responses ([#9410](https://github.com/logto-io/logto/pull/9410))

For the complete list of changes, see the [full changelog](https://github.com/logto-io/logto/blob/master/packages/core/CHANGELOG.md).
