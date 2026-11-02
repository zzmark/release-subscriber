---
title: Gitea Runner 5.3.0 更新总结
description: Gitea Runner 5.3.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="5.3.0"
  date="2026-11-02"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v5.3.0"
/>

## 概览

Gitea Runner 5.3.0 新增经 Pod 网络传输作业文件的方式，并按 ref 隔离缓存；同时补充 Gitea 环境变量别名，修复本地可复用工作流、动作上下文与容器进程清理问题，并更新安全依赖。

升级后，旧缓存不再命中，需要重新预热一次；共享缓存的 Runner 与外部 `cache-server` 应一起升级。工作流、作业或 Runner `envs` 中与新增内置 `GITEA_*` 别名同名的设置会被覆盖，升级前应检查这些自定义变量。

## Breaking Change

- 缓存从仅按仓库隔离改为按 ref 限定作用域。作业依次尝试当前 ref、拉取请求的目标分支和默认分支的缓存；拉取请求事件按请求编号隔离。旧缓存不再恢复，并由 `cache.retention` 到期清理；共享缓存的 Runner 与外部 `cache-server` 应同步升级（[#1361](https://gitea.com/gitea/runner/pulls/1361)）。
- Runner 为自身设置的全部内置 `GITHUB_*` 变量提供同值的 `GITEA_*` 别名，并同步更新或取消设置。与 `GITHUB_*` 一样，这些 `GITEA_*` 名称会覆盖工作流、作业和 Runner `envs` 中的同名设置（[#1358](https://gitea.com/gitea/runner/pulls/1358)）。

## New Feature

- `kubernetes.transfer.mode` 支持 `auto` 和 `direct`：通过初始化容器把 `gitea-runner` 复制到作业 Pod，再让作业容器经 Pod 网络从 Runner 拉取目录及大小至少为 64 KiB 的文件副本，并使用 gzip 压缩。`auto` 在作业 Pod 无法连接 Runner 时回退到 API 服务器，`direct` 则使作业失败。每份副本仅提供一次，使用固定到 Runner 生成证书的 TLS 1.3，并只允许作业 Pod 的 IP 访问（[#1354](https://gitea.com/gitea/runner/pulls/1354)）。
- 新增内置 `GITEA_*` 环境变量别名，使面向 Gitea 的工作流可以使用 Gitea 命名（[#1358](https://gitea.com/gitea/runner/pulls/1358)）。

## Performance

- Kubernetes 文件复制可绕过 API 服务器，减少其负载及托管集群中的跨可用区传输。上游在复制 setup-go@v5、cache@v4、setup-java@v4 和 build-push-action@v6 的示例中，经 API 服务器传输的数据由 11.6 MB 降至 532 B；这是该示例的结果，不代表所有作业的降幅（[#1354](https://gitea.com/gitea/runner/pulls/1354)）。

## Bugfix / Security

- 修复 `gitea-runner exec --no-skip-checkout` 调用本地可复用工作流时的空指针 panic，改为从本地磁盘读取工作流；守护进程行为不变（[#1362](https://gitea.com/gitea/runner/pulls/1362)）。
- `github.action_repository`、`github.action_ref` 及其环境变量仅属于执行远程动作的步骤；`run`、`docker://` 和本地步骤中为空。修复嵌套于远程组合动作的本地动作把 `$/` 错误解析到远程仓库的问题，并更新 actionslib 至 v1.5.1，支持用 `$/` 表示仓库根目录动作（[#1359](https://gitea.com/gitea/runner/pulls/1359)）。
- Docker 代理探测使用独立超时并完成容器清理，避免守护进程响应缓慢时留下容器及匿名卷；调用方仍按自己的截止时间回退，Runner 退出前会等待尚未完成的探测（[#1357](https://gitea.com/gitea/runner/pulls/1357)）。
- dind 镜像通过 `s6-notifyoncheck -d` 双重 fork，让后台检查进程由 PID 1 接管并回收，消除容器生命周期内持续存在的僵尸进程（[#1364](https://gitea.com/gitea/runner/pulls/1364)）。
- 将 `golang.org/x/net` 更新至 v0.62.0，修复 CVE-2026-78661 涉及的 HTML 相邻文本节点合并中的二次复杂度问题（[#1356](https://gitea.com/gitea/runner/pulls/1356)）。
