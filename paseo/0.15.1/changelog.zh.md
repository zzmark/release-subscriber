## 0.15.1 - 2026-11-05

### 修复

- 修复终端工作进程无法读取自身进程标识时，守护进程无法启动的问题。在 Windows PowerShell 5.1 无法运行 `Get-CimInstance` 的 Windows 计算机上，此问题会导致 Paseo Desktop 没有可用的守护进程（[#8810](https://github.com/getpaseo/paseo/pull/8810)）。
