## 新功能

- 通过作业的 Docker 套接字启动的容器，无需 `bind_workdir` 即可绑定挂载 `$PWD` 等作业路径 (https://gitea.com/gitea/runner/pulls/1226)
- `exec` 的 `strategy`、`env`、`with`、`services` 和 `outputs` 支持整个值为 `${{ }}` 表达式 (https://gitea.com/gitea/runner/pulls/1221)

## 改进

- Runner 位于容器内并使用主机 Docker 套接字，或使用无 root 权限的 dind 时，Docker 代理现在也能工作 (https://gitea.com/gitea/runner/pulls/1226)
- 加快作业准备：服务与作业容器同时启动，镜像只拉取一次 (https://gitea.com/gitea/runner/pulls/1218)
- 工作区卷较大时更快完成作业 (https://gitea.com/gitea/runner/pulls/1218)
- 清理由执行中途退出的 Runner 遗留的卷 (https://gitea.com/gitea/runner/pulls/1218)
- 加快缓存请求 (https://gitea.com/gitea/runner/pulls/1222)
- 作业无法访问缓存服务器时，在作业日志中给出警告 (https://gitea.com/gitea/runner/pulls/1225)

## 问题修复

- 按 GitHub 的方式计算表达式 (https://gitea.com/gitea/runner/pulls/1221)
- `exec` 按 GitHub 的方式校验矩阵 (https://gitea.com/gitea/runner/pulls/1221)
- 将工作区挂载在仓库目录的上一级，修复 pnpm 的 `EXDEV` 和 `EBUSY` 错误 (https://gitea.com/gitea/runner/pulls/1224)
- 作业无法访问缓存服务器时，将构件直接上传到 Gitea (https://gitea.com/gitea/runner/pulls/1225)

**完整变更记录**：https://gitea.com/gitea/runner/compare/v3.4.2...v3.5.0
