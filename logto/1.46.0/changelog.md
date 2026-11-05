
<img width="4240" height="2384" alt="logto-changelog-2026" src="https://github.com/user-attachments/assets/6b152931-6e86-4413-a061-f24929f9f110" />
<!--
Banner image goes here, as in past releases. Banner lines:
- OIDC step-up authentication
- Sign in with Ethereum wallets
- Keep the iOS Save Password prompt
- Self-service personal access tokens
-->

## Highlights

- **OIDC step-up authentication**: Apps can request `acr_values` and `max_age` and read `acr`, `amr`, and `auth_time` from tokens. Account Center uses it to require a recent sign-in before sensitive changes.
- **Sign-In with Ethereum**: A new Ethereum Wallet social connector lets users sign in with an EVM wallet.
- **Keep the iOS "Save Password" prompt**: The `confirm_redirect_policy` sign-in parameter shows a "Continue" page before returning to the app after the user enters a password.
- **Personal access tokens in Account Center**: Users can create, rename, and revoke their own personal access tokens.
- **GeeTest CAPTCHA**: Use GeeTest CAPTCHA v4 for bot protection, which suits sign-in experiences targeting mainland China.
- **Static attributes for SAML applications**: Send fixed attribute values in every SAML assertion.
- **Security fixes, one needing admin action**: This release includes security fixes for MFA, social and enterprise sign-in, the Account API, and Logto Tunnel. Standard OAuth 2.0 and Microsoft Azure AD social connectors need a settings review after upgrading. See **Security hardening** below.

## New features & enhancements

### OIDC step-up authentication

OIDC clients can now ask for a recent or stronger sign-in:

- **Request**: Pass `acr_values` and `max_age` in the authorization request. Logto advertises the supported ACR values in the discovery document.
- **Result**: `acr`, `amr`, and `auth_time` are returned in ID tokens, access tokens, and introspection responses.
- **Account Center**: The built-in Account Center now authorizes sensitive Account API operations with a fresh first-party `urn:logto:acr:1fa` access token instead of a separate verification record. When the sign-in is not recent enough, the Account API answers with an RFC 9470 step-up challenge.
- **Recent authentication window**: Set how recent the sign-in must be in **Console > Sign-in experience > Account center > Recent authentication** (10 minutes by default). A client can still request a shorter window with `max_age`.
- **Compatibility**: Apps that call the Account API directly can still use a verification record ID for sensitive operations.

See [Step-up authentication](https://docs.logto.io/end-user-flows/step-up-authentication).

### Sign-In with Ethereum

Admins can enable the new Ethereum Wallet social connector (`@logto/connector-siwe`). Users with an injected EIP-1193 wallet sign a one-time SIWE (EIP-4361) message without leaving the sign-in page. A single address works across supported EVM chains, and admins can restrict the allowed chain IDs.

### Keep the iOS "Save Password" prompt

On iOS, `ASWebAuthenticationSession` closes as soon as it sees the app's callback URL, which dismisses the system "Save Password" prompt right after the user signs in with a password.

Pass `confirm_redirect_policy=password` in the authorization request to show a page that returns to the app only when the user selects "Continue". The page appears after the user enters a password in the sign-in experience: password sign-in, password registration, setting a password, or a step-up password verification.

Without the parameter, Logto redirects back to the app right away. Third-party applications ignore it. The Swift integration guide in Console shows how to use it. See [Keep the iOS Save Password prompt](https://docs.logto.io/end-user-flows/authentication-parameters#keep-the-ios-save-password-prompt).

### Personal access tokens in Account Center

When the tenant enables the personal access token field in Account Center, users can create, rename, and revoke personal access tokens on the Account Center **Security** page. Each token is shown only once at creation and expires within 365 days.

The same operations are available through the Account API under `/api/my-account/personal-access-tokens`, with the new `urn:logto:scope:personal_access_tokens` scope (`UserScope.PersonalAccessTokens` in `@logto/core-kit`).

### GeeTest CAPTCHA

[GeeTest](https://www.geetest.com) CAPTCHA v4 is now available as a CAPTCHA provider. Its adaptive challenges are localized, which suits sign-in experiences targeting mainland China, where Google reCAPTCHA is often unreachable.

1. Create a CAPTCHA v4 event in the GeeTest dashboard.
2. Go to **Console > Security > CAPTCHA** and add GeeTest with its CAPTCHA ID and CAPTCHA key. The same configuration is available through `PUT /api/captcha-provider` with `type: "Geetest"`.

While GeeTest is the CAPTCHA provider, the sign-in page's Content Security Policy allows GeeTest's SDK, API, and static hosts.

### `access_denied` when sign-in is cancelled

- **Consent page**: Cancelling the built-in consent page now ends the interaction with `access_denied` and returns the user to the client application with the original `state` and `iss`.
- **Direct sign-in**: A failed direct sign-in returns to the client the same way, instead of falling back to the hosted sign-in page.
- **Custom sign-in experiences**: End the current interaction with the same error through `POST /api/experience/abort`, with an optional `reason` that becomes `error_description`. `GET /api/experience/interaction/direct-sign-in` returns the `direct_sign_in` value of the current authorization request, so a custom experience can tell a direct sign-in from a hosted one before the interaction is initialized.

### User management

- **Require MFA setup for a user**: Turn on **Require MFA setup** on the user details page in Console, or set `mfa.required` to `true` through the Management API. The user must set up MFA on their next sign-in and cannot skip it, regardless of the organization-level MFA policy.
- **Unlock a user**: A new unlock action on the user details page clears sign-in and security verification lockouts keyed on the user's ID, primary email, primary phone, and username, so admins don't need to know which identifier triggered the lockout.
- **SHA-crypt legacy password hashes**: Import users with SHA-crypt hashes (`$5$` and `$6$`, as used by Linux, passlib, PHP, and others) by setting the password algorithm to `Legacy` and passing the complete stored crypt string as the password digest.

### Static attributes for SAML applications

SAML applications can define fixed attribute names and values that are sent in every assertion alongside the mapped user attributes, for service providers that require constant values such as an account or site ID.

- **Console**: Use the **Static attributes** section on the SAML application's attribute mapping tab.
- **Management API**: Set `staticAttributes` with `POST /api/saml-applications` or `PATCH /api/saml-applications/{id}`.

Attribute names may contain letters, digits, and `_.:/#@-`. They must not conflict with each other or with the user attribute names in the assertion, including names that differ only in case or separators, such as `site_id` and `siteId`.

### Cross-Origin-Opener-Policy for Bring your UI

Tenants with Bring your UI can choose `same-origin-allow-popups` or `same-origin` under **Console > Sign-in experience > Branding > Bring your UI**, or set `crossOriginOpenerPolicy` with the sign-in experience Management API. The header is sent on the hosted sign-in pages while custom UI assets are served. The default, `unsafe-none`, sends no header, so apps that open the sign-in page in a popup keep working.

### `login_hint` for Account Center

Add `login_hint` to any Account Center URL, for example `https://auth.foo.com/account/security?login_hint=foo@example.com`, to pre-fill the identifier on the sign-in page when the user needs to sign in. The hint only pre-fills the field, so users can still sign in with a different identifier.

### Management API and webhooks

- **Search users by custom data**: `GET /api/users` accepts a repeatable `customData` query parameter that matches users whose custom data contains the given JSON object, for example `customData={"customId":114514}`. Repeated values are combined with OR, and the condition combines with other user filters using AND.
- **Find organizations by just-in-time provisioning domain**: `GET /api/organizations` accepts a `jitEmailDomain` query parameter that returns, with pagination, the organizations a user with this email domain would be provisioned into. It combines with `q` and pagination like the other filters.
- **`hasPassword` for organization members**: `GET /api/organizations/:id/users` now includes whether each member has a password set, matching the user list and user detail responses.
- **Webhook `deliveryId`**: Every webhook payload now carries a `deliveryId`. It is unique per hook and event and stays the same across retries of the same request, so a receiver can process each delivery exactly once. It is also the ID of the audit log entry that records the delivery: open it from the webhook's recent requests in Console, or fetch it with `GET /api/logs/:id`. The "test webhook" payload carries one too.

## Security hardening

### Action required: email sync for OAuth 2.0 and Microsoft Azure AD connectors

The standard OAuth 2.0 social connector (`@logto/connector-oauth` 1.8.0) adds a **Disable Email Sync** switch (`disableEmailSync`), matching the one the Microsoft Azure AD connector has offered since Logto 1.43.0.

Upgrading alone does not change how existing connectors behave. The switch is off by default, so these connectors keep syncing the email address returned by the provider to the user profile. The standard OAuth 2.0 protocol carries no verification state for an email address, so the mapped `email` value is taken at face value.

After upgrading, review every standard OAuth 2.0 and Microsoft Azure AD social connector. Turn on **Disable Email Sync** when the provider does not verify that users own the email addresses it returns. The address stays available in `rawData`.

### Sign in with Apple

The Apple connector (`@logto/connector-apple` 1.6.11) now takes the user's email only from the Apple ID token, and recognizes `email_verified` whether Apple sends it as `true` or `"true"`. When Apple marks the email as unverified, no email is returned. The user's name still comes from the details Apple sends on the first authorization.

### Multi-factor authentication

- **User and organization requirements**: User-level and organization-level MFA requirements now take precedence over account settings that turn MFA off or skip it at sign-in when tenant-wide MFA is optional. Adaptive MFA continues to follow its risk-based decision.
- **Sign-ins that skipped MFA**: A sign-in that skipped MFA verification, for example because Adaptive MFA did not trigger or a trusted device satisfied the policy, no longer shows the additional MFA, passkey, or backup code prompts and can no longer enroll a new factor. Registration, pure step-up, and accounts with no stored factor and no primary email or phone that the configured email or phone MFA could use keep their existing behavior.
- **Verifications bound to the account**: A passkey, social, or enterprise SSO verification is only accepted for the account it identified. An email or phone MFA verification is now bound to the user it was created for, and a completed verification only counts for that user.
- **Switching between sign-in and registration**: Switching an interaction between sign-in and registration now also discards the identified user, the MFA factors staged for that user, and their trusted-device opt-in.

### Enterprise SSO

- **SAML assertion audience**: A SAML enterprise SSO connector now accepts an assertion only when one of its `Audience` values exactly matches the connector's **Audience URI (SP Entity ID)** on the domain that receives the response or on the tenant's default domain. If SAML sign-in fails with "SAML assertion audience does not match the SP entity ID" after upgrading, set the audience at your identity provider to the Audience URI (SP Entity ID) shown in the connector's settings.
- **Connector configuration in errors**: Sign-in error responses no longer include enterprise SSO connector configuration.
- **Connector branding before an email match**: A new setting, **Show SSO connector names and logos before email match**, under **Console > Sign-in experience > Sign-up and sign-in > Advanced options**, controls whether enterprise SSO connector names and logos are included in the public sign-in configuration before an email domain matches. It is on by default, which keeps the current behavior. Turn it off to reveal them only after a match.

### Account API and third-party applications

The following Account API operations now require a first-party application, matching the first-party only policy that account mutations already follow:

- Retrieving or refreshing a stored social or enterprise SSO provider token:
  - `GET /api/my-account/identities/:target/access-token`
  - `GET /api/my-account/sso-identities/:connectorId/access-token`
  - `PUT /api/my-account/identities/:target/access-token`
- Reading backup codes, sessions, grants, and trusted devices.

Third-party applications now receive:

```text
403 auth.third_party_application_forbidden
```

First-party applications, including Account Center and Console, are unaffected. If an integration retrieves stored provider tokens today, use a first-party application to obtain the access token.

### Connector request errors

When an outbound request made by a connector fails, for example on a network timeout, the error is now reduced to its name, code, and message before it is logged, exported to telemetry, recorded in the audit log, or returned in an error response. The server log also keeps the request method and the origin and pathname of the URL. Request bodies, headers, and query strings are no longer included.

### Single-use codes and tokens

An authorization code, device code, pushed authorization request, or one-time token is now accepted from at most one request. Every other request that presents it gets the error a reused one returns: `invalid_grant` for a code, `invalid_request_uri` for a pushed authorization request, and `one_time_token.token_consumed` for a one-time token. Refresh tokens keep their reuse window.

### SAML applications

`GET` and `POST /api/saml/:id/authn` now reject a SAML request whose XML is not well-formed, such as one with an unescaped `&` or a mismatched end tag, with `400 application.saml.invalid_saml_request`. The audit log entry of such a request records the format error under `samlRequestError`. A request that cannot be decoded or parsed also gets this 400 error instead of a 500 when the application does not require signed authentication requests.

### Logto Tunnel

`@logto/tunnel` 0.3.12 hardens serving static files from `--experience-path`:

- Symlinks are resolved before a file is served. A file whose real location is outside the experience path returns 404. Symlinks that point to files inside it, and an experience path that is itself a symlink, keep working.
- A `Range` whose end is past the end of the file is clamped to the file size. A `Range` that cannot be satisfied returns 416.

### Request validation

- A `guard.invalid_input` error response now lists only the first 100 validation issues.
- `POST /callback/:connectorId` and `POST /account/callback/social/:connectorId` now stop validating an invalid body after 100 invalid fields. The error response is unchanged.

## Bug fixes & stability

### Sign-in experience

- **Older Safari and iOS**: The sign-in page no longer loads blank on iOS and Safari versions earlier than 16.4. The sign-in experience is now compiled for iOS 15 and Safari 15 and later.

### Social sign-in

- **Unreachable provider**: When the token exchange or user info request to a social provider fails at the transport level (timeout, connection reset, DNS failure), Logto now responds with `502 connector.social_provider_unreachable` instead of a generic 500. The response carries the network error code and the connector ID, and end users see a translated message. The request method and URL are written to the server log.
- **Declined authorization**: When a user declines the consent screen or cancels at the social provider, Logto now responds with `401 connector.authorization_failed`, carrying the provider's `error` and `error_description`, on every social sign-in, verification, and account linking path. This covers `error=access_denied` (OAuth 2.0 / OpenID Connect), `user_cancelled_authorize` (Sign in with Apple, LinkedIn), and `user_cancelled_login` (LinkedIn). Most social connectors used to answer with a generic `connector.general` error.
- **Provider error messages**: When a social connector request fails, the error now shows the provider's actual message instead of `{}`.

### OAuth and OIDC

- **Space-padded `scope` values**: Some clients, such as OpenAI Codex, refresh tokens with a `scope` that has a leading space (for example `" offline_access"`). Logto rejected these requests with `invalid_scope`, so users had to sign in again each time the access token expired. Logto now ignores the empty scope values that leading, trailing, or repeated spaces produce. A `scope` made only of spaces counts as omitted, so a refresh token request keeps the refresh token's original scope.

### Management API

- **Unknown `customClientMetadata` keys**: `POST /api/applications` and `PATCH /api/applications/:id` now reject an unknown key under `customClientMetadata` with `400 guard.invalid_input`, whose `data` lists the key. A typo such as `refreshTokenTtlInDay` used to be accepted while the setting was never applied. Existing applications are not affected.
- **Pagination links**: The `first`, `prev`, `next`, and `last` links of list endpoints such as `GET /api/applications?types=SPA&types=Traditional&page=1` now keep every value of a repeated query parameter, instead of joining them into a single comma-separated value.
- **One-time token count**: When `GET /api/one-time-tokens` filters by `email` or `status`, the `Total-Number` header now counts only the matching tokens.
- **Manual unlock**: Manually unlocking a user now also clears active security verification lockouts longer than 60 minutes. The manual unlock dialog and the API documentation now mention user IDs and security verification lockouts.

### SAML applications

- **Attribute placeholders**: Mapped attributes with names such as `o365role` or `tenant1id` were sent as the literal `{attr…}` placeholder instead of the user's value. They now carry the mapped value.

### Console and Account Center

- **Application access control**: The organization selector in application access control rules now filters results when searching for an organization.
- **Role permissions**: When assigning role permissions, API resource names are shown in full, and truncated permission and resource names have tooltips.
- **Account Center branding**: Account Center no longer shows the "Powered by Logto" mark while loading when Logto branding is hidden.

### Documentation

- **Swift integration guide**: The code examples now use the same client name throughout, fixing a `Cannot find 'client' in scope` error when they are copied into an Xcode project ([#9788](https://github.com/logto-io/logto/pull/9788)). Thanks to [@timokoethe](https://github.com/timokoethe).

## Connectors

- **Standard OAuth 2.0 and OIDC**:
  - Token responses that return `expires_in` as a string, as some providers such as Criipto do, no longer fail with an invalid response error.
  - Token responses that return `scope` as a JSON array, as some providers such as Twitch do, no longer fail with an invalid response error. The scopes are normalized to a space-delimited string.
- **Patreon**: Patreon removed its v1 public API, which made the connector fail with `410 Gone`. The connector now requests profile fields from the Patreon API v2 identity endpoint, so Patreon sign-in works again.
- **Connector Kit**: `jsonGuard` and `jsonObjectGuard` now build their recursive JSON schema once instead of once per nested value, which cuts the time spent validating large JSON payloads. Validation results are unchanged.

## Self-hosting & OSS notes

- **Review before upgrading**: Check the OAuth 2.0 and Azure AD email sync, SAML assertion audience, and third-party Account API changes under **Security hardening**.
- **Node.js 26**: The official Docker image now runs on Node.js 26. Logto and the published packages support Node.js 22, 24, and 26, with minimum versions 22.23.4, 24.22.1, and 26.12.1, which include the October 2026 Node.js security fixes.
- **Database migration required**: This release ships schema alterations, including new columns for SAML application static attributes and the new sign-in experience and Account Center settings. After upgrading, run the database alteration command (`npm run alteration deploy` in the `@logto/cli`/core image, or `logto db alteration deploy`) before starting the new version. See the [upgrade guide](https://docs.logto.io/logto-oss/upgrading-oss-version).
- **Database connection retries**: Core now retries the database connection at startup when the host name cannot be resolved (`ENOTFOUND`, `EAI_AGAIN`), instead of exiting immediately. The CLI database commands, such as `db seed` and `db alteration deploy`, now retry transient connection errors the same way, DNS failures included.
- **Admin endpoint warning**: Logto now logs a warning once when a `/console` request reaches the default tenant because the request origin does not match any configured admin endpoint. If you see it, check the Console URL and `ADMIN_ENDPOINT`.

## Contributors

Huge thanks to the community members whose work shipped in this release:

- [@nicolaj0](https://github.com/nicolaj0) - webhook `deliveryId` ([#9882](https://github.com/logto-io/logto/pull/9882)), `hasPassword` for organization members ([#9883](https://github.com/logto-io/logto/pull/9883)), organization filter by just-in-time provisioning domain ([#9912](https://github.com/logto-io/logto/pull/9912)), `customClientMetadata` key validation ([#9931](https://github.com/logto-io/logto/pull/9931)), unreachable social provider errors ([#9879](https://github.com/logto-io/logto/pull/9879)), declined social authorization errors ([#9880](https://github.com/logto-io/logto/pull/9880)), database connection retries on DNS failures ([#9881](https://github.com/logto-io/logto/pull/9881), [#9928](https://github.com/logto-io/logto/pull/9928)), and connector request errors in logs and responses ([#9849](https://github.com/logto-io/logto/pull/9849))
- [@RaphaelFakhri](https://github.com/RaphaelFakhri) - repeated query parameters in pagination links ([#9811](https://github.com/logto-io/logto/pull/9811)) (first contribution)
- [@mvanhorn](https://github.com/mvanhorn) - `ADMIN_ENDPOINT` mismatch warning ([#9408](https://github.com/logto-io/logto/pull/9408))
- [@timokoethe](https://github.com/timokoethe) - consistent client name in the Swift integration guide ([#9788](https://github.com/logto-io/logto/pull/9788))

**Full Changelog**: https://github.com/logto-io/logto/compare/v1.45.0...v1.46.0