## 0.17.6 - 2026-11-27

### 改进

- 重新组织设置，将内容分为「设备」和「主机」两部分，并合并内容较少的页面。 ([#10933](https://github.com/getpaseo/paseo/pull/10933))
- 模型选择器现在支持使用方向键浏览模型、提供方和配置。 ([#10929](https://github.com/getpaseo/paseo/pull/10929), [#10962](https://github.com/getpaseo/paseo/pull/10962))
- 在主机设置和设置流程中新增刷新控件，可直接重新检查 Tailscale 是否可用。 ([#10903](https://github.com/getpaseo/paseo/pull/10903))

### 调整

- 移除了在后台运行 `agy -p /usage` 的 Antigravity 用量数据源。 ([#10953](https://github.com/getpaseo/paseo/pull/10953) by @luoph)

### 修复

- 修复三星设备上的 Paseo Android 应用在聊天中显示代码块或引用时崩溃的问题。 ([#10964](https://github.com/getpaseo/paseo/pull/10964))
- 修复在 Android 上用鼠标点击模型选择器中的条目时无法选中的问题。 ([#10972](https://github.com/getpaseo/paseo/pull/10972))
- 修复 macOS 桌面端因更新程序坞进度条而在启动时卡死的问题。 ([#10939](https://github.com/getpaseo/paseo/pull/10939))
- 修复 Linux AppImage 的运行时环境泄漏到 Shell 和子进程的问题。 ([#10920](https://github.com/getpaseo/paseo/pull/10920))
- 修复 Linux 后台执行 Git fetch 时产生孤立的 D-Bus 守护进程，以及认证失败后反复重试的问题。 ([#10921](https://github.com/getpaseo/paseo/pull/10921))
- 修复恢复已归档工作区和智能体时界面闪烁的问题，并新增「正在取消归档」状态。 ([#10928](https://github.com/getpaseo/paseo/pull/10928))
- 修复工作树归属范围可能偏离配置的工作树根目录的问题。 ([#10878](https://github.com/getpaseo/paseo/pull/10878))
- 修复其他标签页清除目录缓存后，新打开的 Web 标签页丢失项目的问题。 ([#10942](https://github.com/getpaseo/paseo/pull/10942))
- 修复回退代次变更时，时间线丢失部分条目的问题。 ([#8794](https://github.com/getpaseo/paseo/pull/8794) by @LiebeLee)
