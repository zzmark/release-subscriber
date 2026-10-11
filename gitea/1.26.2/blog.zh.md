---
title: Gitea 1.26.2 官方发布博客（中文）
description: Gitea 1.26.2 正式发布博客的完整简体中文翻译。
---

# Gitea 1.26.2 正式发布

作者：bircni、lunny · 博客发布日期（UTC）：2026-05-20

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-1.26.2/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/gitea/release-of-1.26.2.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 GitHub Release 日期分别保留。

我们很高兴地宣布 **Gitea 1.26.2** 正式发布！此版本包含多项安全修复，以及重要问题修复和稳定性改进，强烈建议所有用户升级。

  * CVE-2026-27783：修复读取权限 ([#37769](https://github.com/go-gitea/gitea/pull/37769)) ([#37781](https://github.com/go-gitea/gitea/pull/37781)). 感谢 @hoangperry 报告问题，感谢 @lunny 提供修复。
  * 消除产物签名载荷的歧义 (#37707) 感谢 @lunny 提供修复。
  * CVE-2026-25714：统一 API 查询和仓库访问检查中的仅公开令牌筛选 (#37118) 感谢 Medoedus 报告问题。 感谢 @lunny 提供修复。
  * CVE-2026-20706：补充缺失的令牌权限范围检查 (#37735) 感谢 geoo115 报告问题。 感谢 @lunny 提供修复。
  * 将 OAuth 令牌交换绑定到原始客户端请求 (#37704) 感谢 @lunny 提供修复。
  * 加强 PKCE 验证和刷新令牌重放保护 (#37706) 感谢 @lunny 提供修复。
  * 下载原始文件、媒体和附件时强制检查令牌权限范围 (#37698) 感谢 [@kamil-sawicki
](https://github.com/kamil-sawicki) 报告问题，感谢 @lunny 提供修复。
  * 请求时强制检查 Wiki Git 写入和 LFS 令牌访问 (#37695) 感谢 @lunny 提供修复。
  * 加密 API 中的 AWS 凭据 (#37679) 感谢 @Exgene 报告并修复问题.
  * CVE-2026-27771：为私有和内部软件包增加标记，修复 Composer 软件包源权限检查 (#37610) 感谢 [NoScope](https://noscope.com) 报告问题。 感谢 @lunny 提供修复。
  * CVE-2026-28744：修复 Git Smart HTTP 请求权限范围问题 (#37583) 感谢 ohxorud-dev 报告问题。 感谢 @lunny 提供修复。
  * CVE-2026-28699：修复基本认证问题 (#37503) 感谢 Wesley Colquitt / ByteShyftStudios LLC / [@Alardiians](https://github.com/Alardiians) 报告问题。 感谢 @lunny 提供修复。
  * CVE-2026-26231：修复允许维护者编辑的权限检查 (#37479) (#37484) 感谢 Arvin Shivram of Brutecat Security 报告问题。 感谢 @lunny 提供修复。
  * 修复 URL 清理，处理不带协议的凭据 (#37440) (#37471) 感谢 @bircni 提供修复。
  * 将 go-git/go-git/v5 升级到 5.19.0 (#37608)
  * 将 Mermaid 依赖更新到 v11.15.0 [security]，增加端到端测试

此版本包含 [54 个已合并 PR](https://github.com/go-gitea/gitea/pulls?q=is%3Apr+milestone%3A1.26.2+is%3Amerged)，感谢社区作出的贡献。

## 如何安装或更新

从 [Gitea 下载页面](https://dl.gitea.com/gitea/1.26.2/) 获取预编译二进制文件，请选择兼容当前平台的版本。安装或升级的逐步指南见[安装文档](https://docs.gitea.com/category/installation)。

## 特别致谢

也感谢 [Open Collective](https://opencollective.com/gitea) 上持续提供资金支持的所有支持者。

---

正在寻找简单顺畅的 Git 仓库管理方案？
欢迎了解 [Gitea Cloud](https://cloud.gitea.com)，这个全托管、可扩展的平台可以简化开发工作流。

<!--more-->

## 更新日志 {#changelog}

## [1.26.2](https://github.com/go-gitea/gitea/releases/tag/v1.26.2) - 2026-05-20

* 安全
  * Actions
    * 消除产物签名载荷歧义 ([#37795](https://github.com/go-gitea/gitea/pull/37795))
  * 访问
    * 请求时强制检查 Wiki Git 写入和 LFS 令牌访问 ([#37714](https://github.com/go-gitea/gitea/pull/37714))
  * API
    * 统一 API 查询和仓库访问检查中的仅公开令牌筛选 ([#37773](https://github.com/go-gitea/gitea/pull/37773))
    * 加密 AWS 凭据 ([#37713](https://github.com/go-gitea/gitea/pull/37713))
  * 认证
    * 补充缺失的令牌权限范围检查 ([#37757](https://github.com/go-gitea/gitea/pull/37757))
    * 修复基本认证问题 ([#37503](https://github.com/go-gitea/gitea/pull/37503))
  * 分支
    * 修复更新分支保护的顺序 ([#37513](https://github.com/go-gitea/gitea/pull/37513))
  * 依赖
    * 将 Mermaid 依赖更新到 v11.15.0 [security] ([#37665](https://github.com/go-gitea/gitea/pull/37665))
    * 将 go-git/go-git/v5 升级到 5.19.0 ([#37609](https://github.com/go-gitea/gitea/pull/37609))
  * Git
    * 修复 Smart HTTP 请求权限范围问题 ([#37605](https://github.com/go-gitea/gitea/pull/37605))
  * OAuth
    * 将令牌交换绑定到原始客户端请求 ([#37740](https://github.com/go-gitea/gitea/pull/37740))
    * 加强 PKCE 验证和刷新令牌重放保护 ([#37738](https://github.com/go-gitea/gitea/pull/37738))
  * 软件包
    * 为私有和内部软件包增加标记，修复 Composer 软件包源权限检查 ([#37643](https://github.com/go-gitea/gitea/pull/37643))
  * 仓库
    * 修复允许维护者编辑的权限检查 ([#37484](https://github.com/go-gitea/gitea/pull/37484))
  * 网页
    * 下载原始文件、媒体和附件时强制检查令牌权限范围 ([#37733](https://github.com/go-gitea/gitea/pull/37733))
    * 修复 URL 清理，处理不带协议的凭据 ([#37471](https://github.com/go-gitea/gitea/pull/37471))
    * 修复附件 Content-Security-Policy ([#37464](https://github.com/go-gitea/gitea/pull/37464))

* 问题修复
  * Actions
    * 修复运行 ID 始终大于等于作业 ID 的错误假设 ([#37742](https://github.com/go-gitea/gitea/pull/37742))
    * 修复 `PrepareRunAndInsert` 与 `UpdateTaskByState` 之间的死锁 ([#37718](https://github.com/go-gitea/gitea/pull/37718))
    * 在 `UpdateLog{Rows:[], NoMore:true}` 时运行 `TransferLogs` ([#37687](https://github.com/go-gitea/gitea/pull/37687))
    * 修复 `::endgroup::` 后的空白行 ([#37612](https://github.com/go-gitea/gitea/pull/37612))
    * 在工作流作业 API 响应中报告各步骤状态 ([#37598](https://github.com/go-gitea/gitea/pull/37598))
    * 防止工作流包含 null 作业时出现 panic ([#37576](https://github.com/go-gitea/gitea/pull/37576))
    * 验证工作流参数以防止 500 错误 ([#37554](https://github.com/go-gitea/gitea/pull/37554))
    * 解析器不再解除运行级并发限制所阻塞的运行 ([#37538](https://github.com/go-gitea/gitea/pull/37538))
    * 修复事件载荷为 null 时定时 Action 出现 panic ([#37466](https://github.com/go-gitea/gitea/pull/37466))
  * API
    * 修复 JSON API 响应中的无效 UTF-8 提交消息 ([#37585](https://github.com/go-gitea/gitea/pull/37585))
    * 提交 ID 错误时返回 409 消息，而非空 JSON ([#37584](https://github.com/go-gitea/gitea/pull/37584))
  * 认证
    * 获取头像时设置 User-Agent，关联账户注册时同步头像 ([#37726](https://github.com/go-gitea/gitea/pull/37726))
    * 处理邮箱地址时忽略大小写 ([#37611](https://github.com/go-gitea/gitea/pull/37611))
  * 分支
    * 存在推送限制时允许直接提交未受保护的文件 ([#37756](https://github.com/go-gitea/gitea/pull/37756))
  * 构建
    * 修复 Snap 构建（1.26） ([#37686](https://github.com/go-gitea/gitea/pull/37686))
  * CLI
    * 修复“以 root 运行”的检查 ([#37625](https://github.com/go-gitea/gitea/pull/37625))
  * 依赖
    * 将 Go 依赖更新到 v1.26.3 ([#37613](https://github.com/go-gitea/gitea/pull/37613))
  * 文档
    * 移除 Terraform 说明中多余的引号 ([#37426](https://github.com/go-gitea/gitea/pull/37426))
  * 标记文本
    * 确保 RenderString 不会失败 ([#37780](https://github.com/go-gitea/gitea/pull/37780))
  * 软件包
    * 修复软件包创建的唯一性冲突 ([#37776](https://github.com/go-gitea/gitea/pull/37776))
    * 通用软件包网页下载使用文件名 ([#37520](https://github.com/go-gitea/gitea/pull/37520))
  * 权限
    * 修复读取权限 ([#37781](https://github.com/go-gitea/gitea/pull/37781))
  * PR
    * 处理空 PR 文件视图，允许评审 ([#37785](https://github.com/go-gitea/gitea/pull/37785))
    * 增加 `DEFAULT_TITLE_SOURCE`，设置 PR 标题的默认行为 ([#37766](https://github.com/go-gitea/gitea/pull/37766))
    * 显示正确合并基点 ([#37656](https://github.com/go-gitea/gitea/pull/37656))
    * 修复同时推送多个 PR 时合并自动检测的问题 ([#37516](https://github.com/go-gitea/gitea/pull/37516))
    * 修复从单提交 PR 视图提交评审 ([#37485](https://github.com/go-gitea/gitea/pull/37485))
    * 修复选择没有共同合并基点的分支时比较下拉菜单失败的问题 ([#37472](https://github.com/go-gitea/gitea/pull/37472))
  * 仓库
    * `/generate` 必须同步新仓库的分支表 ([#37712](https://github.com/go-gitea/gitea/pull/37712))
    * 克隆 URL 遵循公开 URL 检测设置 ([#37617](https://github.com/go-gitea/gitea/pull/37617))
  * 模板
    * 恢复 `CurrentURL` 模板变量 ([#37449](https://github.com/go-gitea/gitea/pull/37449))
  * 界面
    * 为 sortTreeViewNodes 增加自然排序 ([#37777](https://github.com/go-gitea/gitea/pull/37777))
    * 修复迁移到 Vite 后损坏的 mCaptcha ([#37509](https://github.com/go-gitea/gitea/pull/37509))
    * 修复颜色回归，增加 `priority` 颜色 ([#37421](https://github.com/go-gitea/gitea/pull/37421))
  * 用户
    * 一致使用 GetUser 系列函数 ([#37589](https://github.com/go-gitea/gitea/pull/37589))
    * 使 `GetPossibleUserByID` 能处理已删除用户 ([#37431](https://github.com/go-gitea/gitea/pull/37431))
  * 网页
    * 存在文件名时 ServeSetHeaders 默认作为附件下载 ([#37555](https://github.com/go-gitea/gitea/pull/37555))

## 贡献者

* [@0xGREG](https://github.com/0xGREG)
* [@agyss](https://github.com/agyss)
* [@bircni](https://github.com/bircni)
* [@cyphercodes](https://github.com/cyphercodes)
* [@Exgene](https://github.com/Exgene)
* [@jasonlearst](https://github.com/jasonlearst)
* [@KalashThakare](https://github.com/KalashThakare)
* [@lavamini](https://github.com/lavamini)
* [@lunny](https://github.com/lunny)
* [@rootful](https://github.com/rootful)
* [@silverwind](https://github.com/silverwind)
* [@techknowlogick](https://github.com/techknowlogick)
* [@TheFox0x7](https://github.com/TheFox0x7)
* [@wxiaoguang](https://github.com/wxiaoguang)
* [@Zettat123](https://github.com/Zettat123)
