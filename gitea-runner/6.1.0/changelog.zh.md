## 功能

- 运行 JavaScript Action 和 `hashFiles()` 时使用固定的 Node.js 24，可从 nodejs.org 或 `NODEJS_ORG_MIRROR` 下载。 https://gitea.com/gitea/runner/pulls/1400
- 新增 `runner.node_version` 以选择其他 Node.js 版本。设置 `runner.node_download: false` 可使用系统已有的 `node`，从 `PATH` 查找。 https://gitea.com/gitea/runner/pulls/1400
- 新增 `runner.action_replacements` 以重写步骤的 `uses`，例如继续使用 `builtin:checkout`，或把 Action 重定向到镜像。 https://gitea.com/gitea/runner/pulls/1417
- 新增 `host.stable_workdir`，让 Linux 主机作业在每个仓库的固定路径执行，类似 GitHub 的 `_work/<repo>/<repo>`。 https://gitea.com/gitea/runner/pulls/1402

## 改进

- 按 GitHub 的方式处理 `timeout-minutes`，并使用相同的提示消息。 https://gitea.com/gitea/runner/pulls/1421
- 每个步骤结束时上传其步骤摘要。 https://gitea.com/gitea/runner/pulls/1421
- 让 Docker Action 加入作业网络，以便访问作业服务。 https://gitea.com/gitea/runner/pulls/1421
- 验证固定的 Action 提交 SHA。 https://gitea.com/gitea/runner/pulls/1421
- 在 systemd 示例中，停止服务时等待运行中的作业完成。 https://gitea.com/gitea/runner/pulls/1421

## 修复

- 修复 Runner 作为 Docker Swarm 服务运行时上传构建产物超时的问题。 https://gitea.com/gitea/runner/pulls/1425
- 修复带有 `pre` 步骤的复合 Action 显示此前步骤已遮蔽的值的问题。 https://gitea.com/gitea/runner/pulls/1424
- 修复被调用的作业设置 `continue-on-error` 后，失败仍导致调用方工作流失败的问题。 https://gitea.com/gitea/runner/pulls/1421
- 修复远程可复用工作流中的相对 `./` 路径。 https://gitea.com/gitea/runner/pulls/1421
- 修复 Git 进程被终止并锁住缓存的 Action 克隆后，后续作业全部失败的问题。 https://gitea.com/gitea/runner/pulls/1424
- 修复容器配置中 `systempaths=unconfined` 被忽略的问题。 https://gitea.com/gitea/runner/pulls/1424
- 修复错误复用其他平台的缓存镜像的问题。 https://gitea.com/gitea/runner/pulls/1421

## 依赖

- 将 dind 镜像中的 Docker 更新到 29.10.0。 https://gitea.com/gitea/runner/pulls/1422

**完整更新日志**： https://gitea.com/gitea/runner/compare/v6.0.1...v6.1.0