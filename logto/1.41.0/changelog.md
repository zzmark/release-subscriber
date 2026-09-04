
<img width="2120" height="1192" alt="image" src="https://github.com/user-attachments/assets/ef142cde-0547-4a62-b85e-894ea6b48b8e" />

## Highlights

- **App-level access control**: Restrict application access by user, user role, organization, or organization role.
- **Password expiration policy**: Enforce password rotation per tenant and let admins manually expire a user's password.
- **Account Center upgrades**: Sessions, profile, avatar upload, and independent passkey controls are now available.

## New features & enhancements

### App-level access control

Admins can now restrict who can access an application. Access rules support:

- User IDs
- User roles
- Organizations
- Organization roles

When a user does not match the configured rules, Logto blocks the sign-in or application access flow with an access denied page.

Documentation: <https://docs.logto.io/integrate-logto/app-level-access-control>

### Password expiration policy

Console now supports a per-tenant password expiration policy under Security -> Password policy.

Admins can:

- Enable password expiration.
- Configure how many days a password remains valid.
- Manually expire a specific user's password from the user details page.

When a password expires, the user must reset it through the configured recovery method before password sign-in can continue. SSO and passkey sign-ins are not affected.

Legacy users without a recorded password-change time are anchored to the time the policy is enabled, so they receive a full valid period instead of being expired immediately.

### Account Center

Account Center now includes:

- Session management for reviewing active sessions and connected third-party applications.
- Profile management and avatar upload.
- Avatar upload support during collect-profile sign-up.
- Independent passkey controls separate from MFA.
- User control for passkey sign-in prompt preference.

The Account Center profile page, custom profile fields at sign-up, and avatar upload endpoints are available as part of the out-of-the-box profile experience.

### Username policy

Operators can configure tenant-level username rules from Console -> Sign-in experience -> Sign-up and sign-in -> Advanced options.

The policy covers case sensitivity, length bounds, and allowed character types. It is enforced on end-user username writes in sign-up, profile fulfillment, Account Center, and Account API.

Switching to case-insensitive usernames is guarded: Logto detects existing usernames that differ only by case and blocks the change until conflicts are resolved.

The OIDC `preferred_username` claim now falls back to the user's `username` when `profile.preferredUsername` is unset.

### Verification-code and message send controls

Admins can configure verification-code expiration duration and maximum retry attempts in Console Security settings.

Logto also adds a system-level per-recipient send rate limit across email/SMS verification and invitation send paths, including Experience, MFA, Account API, Management API, organization invitations, and the legacy interaction API.

When a send is throttled, Logto emits a `Message.RateLimited` webhook event, now selectable in Console webhook settings. Verification-code delivery to unknown recipients is suppressed when registration is disabled to reduce account enumeration risk.

### JWT customizer organization context

For organization API resource tokens, the access token JWT customizer now receives `context.organization` with the target organization's `id`, `name`, `description`, and `customData`.

This lets scripts attach per-organization claims without embedding every organization mapping into every token.

### API improvements

`POST /api/applications/:applicationId/roles` is now idempotent. Role IDs that are already attached to the application are ignored instead of returning `422 application.role_exists`.

The endpoint now returns `201` with `{ roleIds, addedRoleIds }`, matching the user role assignment API shape.

Organization role creation with initial scopes is now transactional, so invalid scope IDs no longer leave partially created roles behind.

## Bug fixes & stability

### Security and protocol hardening

- SAML IdP auto-submit forms now escape HTML attribute values and reject non-HTTP(S) action URLs.
- `samlify` is upgraded to `^2.13.0`, improving XML escaping in generated SAML assertions.
- TOTP MFA verification now rejects replayed codes from the same or older time-step counter.
- OIDC request bodies containing null bytes now return `400 invalid_request`, and audit log payloads strip null bytes before insertion.
- Email subaddressing blocklist checks no longer build regular expressions from user-controlled input.
- Logto Tunnel prevents static file requests from reading outside the configured experience path.

### Experience and Account Center

- Tenant theme, platform, and brand color are applied before hydration to reduce theme flash in sign-in experience and Account Center.
- Hosted sign-in experience custom CSS is now inlined into server-rendered HTML to prevent a flash of built-in styles.
- Account Center step-up verification is restricted to user permission verification records.
- Social identities can be linked in Account Center without password, email, or phone verification when the user has no legacy security verification methods.
- Console username editing now redirects to Account Center so the required verification flow can complete.

### Compatibility and storage

- Older Safari and iOS 15 no longer crash on startup because of unsupported regex lookbehind syntax.
- OIDC enterprise connectors can fetch discovery configuration from providers that reject JSON-only response negotiation.
- Custom UI asset Azure Blob transport failures now map to retryable storage download errors, and upload timeout handling is improved.

## Connectors

- **New - SMTP2GO email connector**: Send transactional auth emails through the SMTP2GO send API.
- **QQ connector**: Supports social identity verification with stored redirect URI.
- **SAML connector**: Upgrades `samlify` and adapts to its stricter return types.
- **Connector Kit**: Exports shared SMTP mailbox parsing and formatting utilities, now also used by MailJunky.

## Self-hosting & OSS notes

- **`CASE_SENSITIVE_USERNAME` deprecation**: The environment variable still works as a runtime override, but username case sensitivity should now be configured per tenant through the username policy. It is deprecated and slated for removal in the next major version.

## Contributors

Huge thanks to the community members whose work shipped in this release:

- [@tevass](https://github.com/tevass) - password expiration policy ([#8643](https://github.com/logto-io/logto/pull/8643))
- [@mrprofessor](https://github.com/mrprofessor) - idempotent application role assignment API ([#8901](https://github.com/logto-io/logto/pull/8901))
- [@darcyYe](https://github.com/darcyYe) - custom CSS first-paint fix for hosted sign-in experience ([#9017](https://github.com/logto-io/logto/pull/9017))

For the complete list of changes, see the [full changelog](https://github.com/logto-io/logto/blob/master/packages/core/CHANGELOG.md).
