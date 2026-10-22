## 错误修复

- 像 GitHub Runner 一样，从作业日志中隐藏 Runner 自行处理的工作流命令，例如 `::set-output::`（https://gitea.com/gitea/runner/pulls/1333）
- 在每个步骤中注册 `::add-mask::` 的值，即使另一个步骤遗留的 `::stop-commands::` 仍生效；并停止对后置步骤命令重复记录日志（https://gitea.com/gitea/runner/pulls/1333）
- 修补 `rust-cache` v2.9.2、`setup-java` v6 和 `setup-deno` v2 等采用代码分割的 Action 包，使其能够访问 v2 缓存 API（https://gitea.com/gitea/runner/pulls/1328）

## 性能

- 加快作业初始化、Action 准备及缓存服务器的处理；仅含一个步骤的 `exec` 耗时从 1.70 秒降至 0.87 秒（https://gitea.com/gitea/runner/pulls/1327）
- 缓存服务器查询和清扫时，不再解码整个存储（https://gitea.com/gitea/runner/pulls/1336）

## 重构

- 迁移至 `connectrpc.com/connect/v2`，兼容使用 connect v1 和 v2 的 Gitea 服务器（https://gitea.com/gitea/runner/pulls/1325）
- 用直接访问 bbolt 替代 bolthold，现有缓存继续可用（https://gitea.com/gitea/runner/pulls/1336）
- 移除无效代码并整合测试（https://gitea.com/gitea/runner/pulls/1335）

**完整 Changelog**：https://gitea.com/gitea/runner/compare/v5.2.0...v5.2.1
