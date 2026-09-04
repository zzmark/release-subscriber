<img width="4240" height="2384" alt="logto-changelog-202603" src="https://github.com/user-attachments/assets/48042885-4747-4412-8dbe-ef23761fb1ab" />

## Highlights

- **Device flow support**: Logto now supports OAuth 2.0 Device Authorization Grant for smart TVs, CLI tools, IoT devices, and other input-limited apps.
- **Passkey sign-in**: A full passkey-first authentication experience is now available, including button-based, identifier-first, and autofill-assisted flows.
- **Adaptive MFA and optional MFA onboarding**: MFA can now be triggered based on sign-in context, and users can be prompted to enable MFA after sign-in.
- **Session and grant management**: This release adds user session management, authorized app management, and app-level concurrent grant limits across APIs and Console.
- **More OSS operator controls**: OIDC session TTL is now configurable, and tenant-level OIDC settings are now exposed in Console.

## New features & enhancements

### OAuth 2.0 Device Authorization Grant

Logto now supports OAuth 2.0 Device Authorization Grant, allowing users to sign in on input-limited devices such as smart TVs, CLI tools, IoT gadgets, and gaming consoles by completing authentication on another device.

Included in this release:

- Full protocol support in core and schemas.
- Device flow support in the sign-in experience.
- Device flow support in Console.
- Device-flow-specific phrases and built-in demo support.
- A device-flow-specific guide in the application settings page.

Console now supports creating a device flow application by:

- Selecting **Input-limited app / CLI** under the Native framework list.
- Creating an app without framework and choosing **Device flow** as the authorization flow.
- Creating a third-party Native app and choosing **Device flow** as the authorization flow.

### Passkey sign-in

This release introduces passkey sign-in as a first-class authentication method.

Included capabilities:

- A passwordless sign-in experience using platform authenticators such as Face ID, Touch ID, and Windows Hello.
- Prompting new users to bind a passkey during registration.
- Guiding existing users to bind a passkey in a later sign-in flow.
- Reusing an existing WebAuthn MFA credential for passkey sign-in without an extra registration step.

Supported user journeys:

1. **Passkey sign-in button**: Users can click **Continue with passkey** to trigger the browser passkey chooser immediately.
2. **Identifier-first flow**: Users first enter an identifier, then are prompted to **Verify via passkey** before falling back to password or verification code.
3. **Allow autofill**: Supported browsers can suggest saved passkeys directly from the identifier input.

Documentation: <https://docs.logto.io/end-user-flows/sign-up-and-sign-in/passkey-sign-in>

### Adaptive MFA

Logto now supports adaptive MFA.

Included changes:

- Console always exposes the adaptive MFA option on the MFA settings page.
- `adaptiveMfa` is stored in the sign-in experience payload.
- The sign-in flow evaluates adaptive MFA rules against the current sign-in context.
- MFA verification is required when adaptive rules are triggered.
- The sign-in context is consistently persisted into interaction data, so custom-claims scripts can read it from `context.interaction.signInContext`.
- A new `PostSignInAdaptiveMfaTriggered` webhook event is emitted when adaptive MFA forces MFA during sign-in.

### Optional MFA onboarding

A new MFA onboarding page is added for users who are not required to set up MFA.

- After credential verification, users can be explicitly asked whether they want to enable optional MFA for better account security.
- This is especially useful when passkey sign-in is enabled, since passkeys can be used for both sign-in and MFA verification, and some users may not want to enable them as an MFA factor at the same time.

### User session management

This release adds user session management across APIs and Console.

Account APIs:

- `GET /my-account/sessions`
- `DELETE /my-account/sessions/:sessionId`

Management APIs:

- `GET /users/:userId/sessions`
- `GET /users/:userId/sessions/:sessionId`
- `DELETE /users/:userId/sessions/:sessionId`

Session revocation details:

- `revokeGrantsTarget=all` revokes grants for all apps.
- `revokeGrantsTarget=firstParty` revokes only first-party app grants.
- When grants are revoked, previously issued opaque access tokens and refresh tokens for those grants are invalidated.

Permission and scope updates:

- A new account center permission setting `session` is added with `off`, `readOnly`, and `edit`.
- A new user scope `urn:logto:scope:sessions` is introduced to gate session-related account API access.

Session context:

- User IP, user agent, and GEO location can now be recorded in interaction submission data and returned in `session.lastSubmission`.

Console support:

- A new **Active sessions** section is added on the user details page.
- Users can navigate to a dedicated session details page.
- Sessions can be revoked from the session details page.
- Revoking a session removes the sign-in session and revokes associated first-party app grants, forcing reauthentication for future requests.

### User application grant management

This release introduces application grant management endpoints for both account and management APIs.

Account API:

- `GET /my-account/grants` to list active application grants for the current user.
- `DELETE /my-account/grants/:grantId` to revoke a specific grant for the current user.

Management API:

- `GET /users/:userId/grants` to list active application grants for a given user.
- `DELETE /users/:userId/grants/:grantId` to revoke a specific grant for a given user.

Grant listing supports an optional `appType` query parameter:

- `appType=firstParty`
- `appType=thirdParty`
- Omit `appType` to return all active grants

### Authorized third-party apps in Console

Console now includes an **Authorized third-party apps** section on the user details page.

- It lists active third-party application authorizations for a user.
- It shows app name, app ID, and access creation time.
- It includes a revoke action with a confirmation modal.
- Revoking an app removes all active third-party grants associated with that app for the user.

### App-level concurrent grant limits

This release adds app-level concurrent grant limits.

Core and schemas:

- Application `customClientMetadata` now supports an optional `maxAllowedGrants` field.
- A new OIDC `authorization.success` event listener validates concurrent grants for the current authorization client and user.
- When the active grant count exceeds the configured limit, the oldest grants are revoked automatically.

Console:

- A new **Concurrent device limit** section is added to the Application details page.
- Developers can configure the maximum number of concurrent active grants per user for the current app.

### Configurable OIDC session TTL

This release adds configurable OIDC session TTL support.

Core:

- OIDC provider initialization now respects `oidc.session.ttl` from `logto-config`.
- When `oidc.session.ttl` is provided, it overrides the default session TTL.
- New management APIs are added:
  - `GET /api/configs/oidc/session`
  - `PATCH /api/configs/oidc/session`

Schemas:

- A new optional `oidc.session.ttl` field is added to `logto-config`.
- The value is configured in seconds.
- If not provided, the default remains `14 days`.

For OSS deployments:

- Restart the service instance after config changes so the server can pick up updated OIDC config.
- To apply OIDC config updates automatically without restart, enable central Redis cache.

### Tenant settings page and OIDC settings in Console

Console now exposes tenant-level OIDC settings in OSS.

- A new **Tenant -> Settings** page is added.
- The original **Signing keys** page is deprecated and removed.
- A new **OIDC settings** tab is added under **Tenant -> Settings**.
- Signing key configuration is migrated to **Settings -> OIDC settings**.
- A new **Session maximum time to live** field is added to configure tenant-level session TTL in days.
- The Console field uses days for input and display, while the underlying OIDC session TTL config and API use seconds.

### Account Center improvements

This release includes several improvements to the out-of-the-box Account Center.

- Added support for replacing the authenticator app through a dedicated `/authenticator-app/replace` route.
- Added a new PUT endpoint in Account API for idempotent TOTP replacement.
- Added support for the `identifier` URL parameter to pre-fill identifier input fields.
- Added support for overriding the out-of-the-box Account Center language with the `ui_locales` URL parameter.

### Access token exchange for service-to-service delegation

Logto now supports access token exchange for service-to-service delegation.

- The standard `subject_token_type` value `urn:ietf:params:oauth:token-type:access_token` now supports access token exchange.
- Both opaque and JWT access tokens issued by Logto can be exchanged for new access tokens with different audiences.
- This enables service-to-service delegation scenarios.

Token validation order:

1. If the token starts with `sub_`, treat it as a legacy impersonation token.
2. Try to find it as an opaque access token via `oidc-provider`.
3. Fall back to JWT verification using the issuer's JWK set.

Additional detail:

- Access tokens are not consumption-tracked, so the same token can be exchanged multiple times.
- A new `urn:logto:token-type:impersonation_token` type is added for explicit impersonation token handling.

### Password-hash export for migrations

The following endpoints now support an `includePasswordHash` query parameter:

- `GET /users`
- `GET /users/:userId`

When set to `true`, the response includes:

- `passwordDigest`
- `passwordAlgorithm`

This is intended for migration scenarios where the raw password hash is needed.

### Localization

- Czech language support is added to the sign-in experience. (Credit @ppotaczek @leoshusar)

## Bug fixes & stability

### MFA verification Sentinel protection

TOTP, WebAuthn, and backup code MFA verifications now report activity to Sentinel.

- Repeated MFA failures can be detected and blocked more consistently during MFA.
- MFA-specific Sentinel actions keep MFA attempts isolated from the shared primary sign-in pool.
- This avoids lockouts leaking across unrelated verification stages or factors.

### OIDC adapter query optimization

Improved OIDC adapter `findByUid` and `findByUserCode` queries.

- Literal JSONB keys are now used so expression indexes can be used under prepared generic plans.

### Postgres startup resilience

Improved startup stability for Postgres deployments.

- Logto now retries Postgres pool initialization on transient connection errors.

### Legacy password import compatibility

Improved compatibility for legacy user import.

- Legacy password verification now supports `hex:`-prefixed PBKDF2 salt values.

### Token exchange performance

Improved token exchange performance.

- Minimal OIDC resource lookup is now cached at the query layer.
- Grant IDs are pre-generated during token issuance to avoid an extra write just for grant creation.

### Account Center password autofill

Improved Account Center password forms for better browser autofill and password manager support.

### Twilio SMS formatting fix

Fixed Twilio SMS `To` formatting by normalizing non-E.164 numbers to include a leading `+`.

## Breaking changes

### Connector kit cleanup

- Removed the long-deprecated `mockSmsVerificationCodeFileName` export from `@logto/connector-kit`.

### Mock connector file path update

Updated the file paths used by mock connectors to store sent messages.

- `/tmp/logto_mock_email_record.txt` -> `/tmp/logto/mock_email_record.txt`
- `/tmp/logto_mock_sms_record.txt` -> `/tmp/logto/mock_sms_record.txt`

This creates a more consistent and organized structure for mock connector files and makes them easier to manage and mount in Docker environments.

## New Contributors

- @taka-guevara made their first contribution in #8555
- @synchrone made their first contribution in #8504
- @ppotaczek and @leoshusar made their first contribution in #8526

**Full Changelog**: https://github.com/logto-io/logto/compare/v1.37.0...v1.38.0
