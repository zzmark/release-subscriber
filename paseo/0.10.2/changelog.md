## 0.10.2 - 2026-09-30

### Fixed

- Fixed OpenCode v2 turns longer than five minutes failing with `UND_ERR_HEADERS_TIMEOUT` ([#5674](https://github.com/getpaseo/paseo/pull/5674))
- Fixed the context meter staying empty during OpenCode v2 turns and disappearing after them ([#5710](https://github.com/getpaseo/paseo/pull/5710) by @mcowger)
- Fixed OpenCode v2 question cards showing only the header and offering no typed answer ([#5679](https://github.com/getpaseo/paseo/pull/5679))
- Fixed OpenCode v2 patch edits from GPT models showing as a raw Patch card instead of an edit diff ([#5696](https://github.com/getpaseo/paseo/pull/5696))
- Fixed completed OpenCode v2 edits showing no diff ([#5609](https://github.com/getpaseo/paseo/pull/5609))
