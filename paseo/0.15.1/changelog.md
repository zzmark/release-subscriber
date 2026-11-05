## 0.15.1 - 2026-11-05

### Fixed

- Fixed the daemon failing to start when the terminal worker cannot read its own process identity, which left Paseo Desktop without a daemon on Windows machines where Windows PowerShell 5.1 cannot run `Get-CimInstance` ([#8810](https://github.com/getpaseo/paseo/pull/8810))
