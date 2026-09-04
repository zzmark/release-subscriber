
![logto-changelog-2026-02](https://github.com/user-attachments/assets/724f99bd-16a8-46e3-83e6-6498ddaa95a8)


## Highlights

- **Built-in Account Center app is now available**: A ready-to-use single-page account center experience for end users.
- **JWT Customizer enhancement**: Application context is now available in custom scripts for both access tokens and client credentials tokens.
- **Configurable ID token claims**: Additional ID token claims can now be configured via Console or Management API.

## New features & enhancements

### Built-in Account Center app

This release introduces the Account Center single-page app as a built-in Logto application for end users:

- Supports profile updates for primary email, phone, username, and password, with verification flows.
- Supports MFA management for TOTP, backup codes (download/regenerate), and passkeys (WebAuthn), including rename and delete actions.
- Sensitive operations are gated by password/email/phone verification and include dedicated success screens.

Documentation: <https://docs.logto.io/end-user-flows/account-settings/by-account-api>

### Application context in JWT Customizer

Application context (for example app name, description, and custom data) is now available in JWT customizer scripts for:

- Access token
- Client credentials token

This enables app-aware JWT claim customization.

### ID token claims configuration

You can now configure additional claims included in ID tokens via Console or Management API:

- `custom_data`
- `identities`
- `roles`
- `organizations`
- `organization_roles`

## Bug fixes & stability

### Built-in app redirect URI fix for custom domains

Fixed an `invalid_redirect_uri` issue for built-in Account Center and Demo app under custom-domain requests.

- **Root cause**: Built-in client metadata was generated from default tenant URLs only, while runtime `redirect_uri` could be based on a custom domain.
- **Fix**: `getTenantUrls` now accepts an optional runtime endpoint. Built-in metadata generation for Account Center and Demo app now includes `envSet.endpoint`, so redirect/logout URIs automatically include the active custom domain.

### "Tell us about yourself" section visibility fix

Fixed an issue where the "Tell us about yourself" section did not appear during sign-up when only optional custom profile fields were configured.

- Previously only required fields were checked, so optional-only setups were skipped.
- The check now includes optional fields and whether the extra profile form has been submitted, ensuring expected visibility.

### Social link flow context preservation fix

Fixed a broken social account linking flow in this scenario:

- `username + email` are both enabled as required sign-up identifiers.
- "Require users to provide missing sign-up identifiers for social sign-in" is enabled.
- The social IdP returns no verified email.
- The user fulfills username, then enters an already-registered email.

Previously, the `link_social` parameter was not propagated after username fulfillment, causing link context to be lost before email verification. The flow now appends and preserves `link_social` so the expected link-and-sign-in behavior works correctly.

## New Contributors
* @Fatty911 made first contribution in https://github.com/logto-io/logto/pull/8333

**Full Changelog**: https://github.com/logto-io/logto/compare/v1.36.0...v1.37.0
