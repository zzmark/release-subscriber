## Security
- Build with Go 1.27.3, which fixes CVE-2026-111943 by distrusting a set of intermediate certificates in crypto/x509 ([#1332](https://gitea.com/gitea/runner/pulls/1332))

## Enhancements
- Kubernetes: reach services by their id when it is a DNS subdomain (e.g. `devstoreaccount1.azurite.local`), and warn about ids that differ only in case ([#1320](https://gitea.com/gitea/runner/pulls/1320))

## Bug fixes
- Don't fail successful host steps when a leftover background process still holds their output open ([#1323](https://gitea.com/gitea/runner/pulls/1323))
- Fix block and folded scalar round-trips in YAML; `config edit` no longer wraps lines ([#1321](https://gitea.com/gitea/runner/pulls/1321))

## Refactoring
- Drop logrus, mergo, httprouter, retry-go and other direct dependencies, shrinking the binary by ~5% ([#1319](https://gitea.com/gitea/runner/pulls/1319)). Behaviour differences:
  - An unreadable file in a build context is skipped with a warning instead of producing a truncated tar
  - Build contexts no longer carry `security.capability` xattrs
  - The cache and artifact servers answer HEAD on GET routes, and no longer redirect trailing slashes or answer OPTIONS

## Build & maintenance
- Drop the unused xgo `release*` Makefile targets ([#1329](https://gitea.com/gitea/runner/pulls/1329))
- Bump the image and tool pins that Renovate doesn't update; the builder now follows the current Alpine ([#1330](https://gitea.com/gitea/runner/pulls/1330))
- Update a stale go-yaml wrapping comment ([#1324](https://gitea.com/gitea/runner/pulls/1324))


## Contributors
* @bircni
* @silverwind
* @Zettat123

**Full Changelog**: [v5.1.1...v5.2.0](https://gitea.com/gitea/runner/compare/v5.1.1...v5.2.0)
