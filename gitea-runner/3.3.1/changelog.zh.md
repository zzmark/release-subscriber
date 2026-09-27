## ⚠️ 行为变化

- 工作流中的 `container.options` 不能再设置 `--env-file` 或 `--label-file`，因为它们会读取 Runner 主机上的文件；也不能包含卷驱动选项，因为它可能把 `valid_volumes` 允许的卷名转换成任意主机路径的绑定挂载。Runner 自身的选项仍可使用这些参数 (https://gitea.com/gitea/runner/pulls/1151)
- 对所有来源，单独使用 `--env NAME` 不再从 Runner 自身的环境中读取值。需要传递变量时请使用 `runner.envs` 或 `runner.env_file` (https://gitea.com/gitea/runner/pulls/1151)
- 与 GitHub 一致，包含密钥的作业输出会被跳过并发出警告，不再发送；下游读取 `needs.<job>.outputs.<name>` 时得到空值 (https://gitea.com/gitea/runner/pulls/1188)

## 问题修复

- 未启用特权模式时，保留 Runner 自身的 `container.options`。此前主机逃逸过滤器会连管理员配置的选项一并删除，使需要 `--device` 或 `--security-opt` 的配置无法生效 (https://gitea.com/gitea/runner/pulls/1151)
- 在密钥离开作业的所有路径上进行遮盖，包括上传的日志行、磁盘上的 `job.log`、Runner 自身日志、调试标准输出、作业总结、作业输出，以及会成为容器名称的作业名称。与 GitHub 一致，`ACTIONS_STEP_DEBUG` 和 `ACTIONS_RUNNER_DEBUG` 不会被遮盖 (https://gitea.com/gitea/runner/pulls/1188)
- 不再把步骤自身的 `with:` 值混入其 `inputs` 上下文，避免同名 `with:` 键或来自 `env:` 的 `INPUT_` 形式变量改变 `if:` 条件或伪造输入 (https://gitea.com/gitea/runner/pulls/1192)
- 按配置的 `valid_volumes` 策略处理服务容器声明的卷，不再静默丢弃 (https://gitea.com/gitea/runner/pulls/1186)
- 随日志刷新一同报告步骤日志范围，避免服务器在两次状态报告之间收到的日志行不属于任何步骤，或被归到“Complete job” (https://gitea.com/gitea/runner/pulls/1189)
- 矩阵展开失败时让运行失败，而不再报告成功却未执行任何作业 (https://gitea.com/gitea/runner/pulls/1187)

## 依赖

- 将 Go 工具链更新至 1.27.0，包含 1.26.6 的安全修复。现在从源码构建需要 Go 1.27 (https://gitea.com/gitea/runner/pulls/1183, https://gitea.com/gitea/runner/pulls/1185)
- 更新依赖，并将 Docker 更新至 29.7.2 (https://gitea.com/gitea/runner/pulls/1185)

**完整变更记录**：https://gitea.com/gitea/runner/compare/v3.3.0...v3.3.1
