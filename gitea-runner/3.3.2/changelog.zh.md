## ⚠️ 行为变化

### 工作流不能再设置 `NODE_OPTIONS` (https://gitea.com/gitea/runner/pulls/1194)

与 GitHub 一致，通过写入 `$GITHUB_ENV` 或使用 `::set-env::` 设置 `NODE_OPTIONS` 会被拒绝，并产生错误标注。

## 新功能

- `exec` 新增 `--input name=value` 和 `--input-file <path>`，用于传入工作流在 `workflow_dispatch` 或 `workflow_call` 下声明的输入 (https://gitea.com/gitea/runner/pulls/1173)

## 问题修复

- 登记密钥的每一种编码形式，避免 `base64("user:$TOKEN")` 这样的值以明文输出 (https://gitea.com/gitea/runner/pulls/1194)
- 报告作业实际达到的状态：`continue-on-error` 步骤记录为成功，取消的作业报告为已取消，失败的 `if:` 报告为失败 (https://gitea.com/gitea/runner/pulls/1194)
- 在复合 Action 中解析 `${{ matrix.* }}` 和 `${{ strategy.* }}`，并阻止复合 Action 的输入以 `INPUT_*` 形式泄露到嵌套 Action (https://gitea.com/gitea/runner/pulls/1194)
- 阻止 `container.env` 覆盖作业环境变量及写入 `$GITHUB_ENV` 的值 (https://gitea.com/gitea/runner/pulls/1194)
- 运行 Node Action 时传入 `--preserve-symlinks-main`，避免比较 `process.argv[1]` 与真实路径的 Action 错误地跳过自身 (https://gitea.com/gitea/runner/pulls/1202)

**完整变更记录**：https://gitea.com/gitea/runner/compare/v3.3.1...v3.3.2
