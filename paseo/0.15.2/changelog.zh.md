## 0.15.2 - 2026-11-05

### 新增

- 在 Paseo Desktop 和网页端新增首次运行设置引导，带领新用户依次设置主题、服务提供商、项目和代理编排，并了解移动应用。可通过“设置 → 通用 → 再次显示设置引导”重新打开（[#8363](https://github.com/getpaseo/paseo/pull/8363)）。
- 根据你运行过 Claude Code、Codex、OpenCode 或 Pi 的文件夹推荐项目，并在设置引导的“项目”步骤显示（[#8363](https://github.com/getpaseo/paseo/pull/8363)）。

### 改进

- 主题选择器改为卡片网格，每个主题均提供预览（[#8363](https://github.com/getpaseo/paseo/pull/8363)）。
- 服务提供商设置中的“加载中…”文字改为骨架占位行（[#8363](https://github.com/getpaseo/paseo/pull/8363)）。
- 控件统一为两种尺寸：默认控件在桌面端高 32px、手机端高 44px，紧凑控件高 28px（[#8363](https://github.com/getpaseo/paseo/pull/8363)）。
- 首次启动时，从加载画面直接进入设置引导，不再先显示空白首页（[#8824](https://github.com/getpaseo/paseo/pull/8824)）。
- 桌面端和网页端的对话框改为在约 160ms 内淡入（[#8824](https://github.com/getpaseo/paseo/pull/8824)）。
- 模态窗口和面板的背景改为与页面背景一致（[#8363](https://github.com/getpaseo/paseo/pull/8363)）。
- 设置各部分的文档链接改为位于部分标题旁的 `Label ↗` 链接（[#8363](https://github.com/getpaseo/paseo/pull/8363)）。
