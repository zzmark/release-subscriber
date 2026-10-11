---
title: Gitea 1.27.2 官方发布博客（中文）
description: Gitea 1.27.2 正式发布博客的完整简体中文翻译。
---

# Gitea 1.27.2 正式发布

作者：bircni · 博客发布日期（UTC）：2026-08-14

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-1.27.2/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/gitea/release-of-1.27.2.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 GitHub Release 日期分别保留。

我们很高兴宣布发布 **Gitea 1.27.2**，这是 1.27 系列的第二个补丁版本。本版包含大量安全修复，以及 Gitea Actions、软件包、LFS 和界面的错误修复。强烈建议所有用户尽快升级。

## 安全 {#security}

此版本修复以下安全漏洞，请尽快升级。

- CVE-2026-73804：仅有 `write:user` 权限范围的令牌可以向自身账户添加 SSH 密钥，随后使用 HTTP Signature 认证发送不受令牌权限范围约束的 API 请求，完全绕过 API 令牌权限边界。由 [#38862](https://github.com/go-gitea/gitea/pull/38862) / [#38895](https://github.com/go-gitea/gitea/pull/38895) 修复。感谢 [@ohxorud-dev](https://github.com/ohxorud-dev) 报告问题，感谢 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- Jupyter Notebook 渲染器将 `javascript:` 短链接原样写入链接锚点，独立 `/render/` 端点又没有 CSP，因此恶意 `.ipynb` 可以在受害者会话中执行 JavaScript 并接管账户。由 [#38864](https://github.com/go-gitea/gitea/pull/38864) / [#38869](https://github.com/go-gitea/gitea/pull/38869) 修复。感谢 [@CynosureSec](https://github.com/CynosureSec) 报告问题，感谢 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- CVE-2026-73539：标记文本 `Context` 字段未经转义即传入外部渲染器命令行，允许向渲染进程注入参数；当实例在 `RENDER_COMMAND` 中使用 `$GITEA_PREFIX_SRC` / `$GITEA_PREFIX_RAW` 时，可作为 Gitea 服务用户远程执行代码。由 [#38885](https://github.com/go-gitea/gitea/pull/38885) / [#38898](https://github.com/go-gitea/gitea/pull/38898) 修复。感谢 [@DshtAnger](https://github.com/DshtAnger) 报告问题，感谢 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- CVE-2026-73800：`pull_request_target` 工作流从派生仓库 HEAD 提交而非基础分支解析本地可复用工作流（`uses: ./...`），让攻击者控制的工作流代码能访问仓库和组织密钥。由 [#38886](https://github.com/go-gitea/gitea/pull/38886) / [#38897](https://github.com/go-gitea/gitea/pull/38897) 修复。感谢 [@chakradhar1228](https://github.com/chakradhar1228), [@PhucQuan](https://github.com/PhucQuan), [@YuvalMil](https://github.com/YuvalMil), [@elmahy111](https://github.com/elmahy111) 和 [@DshtAnger](https://github.com/DshtAnger) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-73278：OAuth2 和 OpenID Connect 登录路径仅检查 TOTP 注册，导致仅使用 WebAuthn 作为第二因素的用户无需验证即可取得完整会话。由 [#38805](https://github.com/go-gitea/gitea/pull/38805) / [#38810](https://github.com/go-gitea/gitea/pull/38810) 修复。感谢 [@MindflareX](https://github.com/MindflareX), [@AdamKorcz](https://github.com/AdamKorcz) 和 [@jaeyoon-kim-dev](https://github.com/jaeyoon-kim-dev) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- CVE-2026-73535：`POST /user/openid/connect` 未强制第二因素认证，知道受害者密码的攻击者可取得完整会话，并永久关联攻击者控制的 OpenID 标识符；更改密码后该访问仍有效。由 [#38805](https://github.com/go-gitea/gitea/pull/38805) / [#38810](https://github.com/go-gitea/gitea/pull/38810) 修复。感谢 [@r0hanSH](https://github.com/r0hanSH) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- CVE-2026-60008：Jupyter Notebook 渲染器在关闭清理器的路径中，未使用安全属性保护即将 `language_info.name` 插入 `class` 属性，使仓库文件能够覆盖仓库页面并截获点击。由 [#38793](https://github.com/go-gitea/gitea/pull/38793) / [#38795](https://github.com/go-gitea/gitea/pull/38795) 修复。感谢 [@yagcioglutoprak](https://github.com/yagcioglutoprak) 报告问题，感谢 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- CVE-2026-73814：具有 Admin 权限的仓库协作者可向协作访问模式端点提交 `mode=4`，提升为实际 Owner 权限并将仓库转移到自身账户。由 [#38894](https://github.com/go-gitea/gitea/pull/38894) / [#38895](https://github.com/go-gitea/gitea/pull/38895) 修复。感谢 [@martindukek](https://github.com/martindukek) 报告问题，感谢 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。

本版还将内置 `mermaid` 依赖更新至 v11.16.1 ([#38816](https://github.com/go-gitea/gitea/pull/38816)).

## 重要修复

### Actions

- `workflow_dispatch` 输入再次在 `github.event.inputs` 中保留为字符串，与文档说明一致 ([#38908](https://github.com/go-gitea/gitea/pull/38908)).
- 重新运行选定作业现在可以读取上一次尝试的制品，无需从空制品集合开始 ([#38901](https://github.com/go-gitea/gitea/pull/38901)).
- 表达式中的每个 `${{ }}` 部分均单独求值，修复含多个插值的字符串结果 ([#38797](https://github.com/go-gitea/gitea/pull/38797)).
- 没有正在运行作业的运行记录再次可以取消 [#38812](https://github.com/go-gitea/gitea/pull/38812)；任务报告在单个事务中写入，避免部分记录状态 [#38794](https://github.com/go-gitea/gitea/pull/38794)。

### 软件包、LFS 和存储

- LFS：正确接受客户端返回的成功传输响应 [#38875](https://github.com/go-gitea/gitea/pull/38875)；上传失败不再删除同一对象并发上传的元对象 [#38722](https://github.com/go-gitea/gitea/pull/38722)。
- Swift 软件包：检测软件包时忽略嵌套的 `Package.swift` 文件 ([#38836](https://github.com/go-gitea/gitea/pull/38836)).
- Arch 软件包：解析时丢弃名称中包含换行的成员 ([#38830](https://github.com/go-gitea/gitea/pull/38830)).
- Alpine 注册表响应 `APKINDEX.tar.gz` 的 `HEAD` 请求，不再返回 405 ([#38688](https://github.com/go-gitea/gitea/pull/38688)).
- 转储到 Azure Blob 存储不再出现“file does not exist”（文件不存在）错误 [#38828](https://github.com/go-gitea/gitea/pull/38828)；内容大小未知时，为 MinIO 上传设置最小分片大小 [#38755](https://github.com/go-gitea/gitea/pull/38755)。
- npm 软件包现在发布此前缺失的元数据属性 ([#38831](https://github.com/go-gitea/gitea/pull/38831)).

### 仓库和界面

- Gitea 部署在子路径下时，归档下载不再失效 [#38750](https://github.com/go-gitea/gitea/pull/38750)；在这种部署下正确构建完整 URL [#38716](https://github.com/go-gitea/gitea/pull/38716)。
- 标记文本渲染不再因特定输入触发 panic [#38703](https://github.com/go-gitea/gitea/pull/38703)；正确解析标记文本链接 [#38765](https://github.com/go-gitea/gitea/pull/38765)；不再对代码片段重复应用删除线 [#38729](https://github.com/go-gitea/gitea/pull/38729)。
- 刷新后的页面不再包含合并框时，从界面移除合并框 [#38744](https://github.com/go-gitea/gitea/pull/38744)；提交头像堆叠显示正确的参与者数量 [#38700](https://github.com/go-gitea/gitea/pull/38700)；下划线再次使用浏览器默认样式 [#38823](https://github.com/go-gitea/gitea/pull/38823)。
- 删除迁移后正确重定向，不再返回 JSON 重定向 ([#38825](https://github.com/go-gitea/gitea/pull/38825)).

本版包含 [26 个已合并 PR](https://github.com/go-gitea/gitea/pulls?q=is%3Apr+milestone%3A1.27.2+is%3Amerged)，感谢社区作出的贡献。

## 如何安装或更新

从 [Gitea 下载页面](https://dl.gitea.com/gitea/1.27.2/) 获取预编译二进制文件，请选择兼容当前平台的版本。安装或升级的逐步指南见[安装文档](https://docs.gitea.com/category/installation)。

## 特别致谢

也感谢 [Open Collective](https://opencollective.com/gitea) 上持续提供资金支持的所有支持者。

---

正在寻找简单顺畅的 Git 仓库管理方案？
欢迎了解 [Gitea Cloud](https://cloud.gitea.com)，这个全托管、可扩展的平台可以简化开发工作流。

<!--more-->

## 更新日志 {#changelog}

## [1.27.2](https://github.com/go-gitea/gitea/releases/tag/v1.27.2) - 2026-08-14

- 安全
  - 修复：更新协作者访问模式和 httpsign ([#38894](https://github.com/go-gitea/gitea/pull/38894), [#38862](https://github.com/go-gitea/gitea/pull/38862)) ([#38895](https://github.com/go-gitea/gitea/pull/38895))
  - 重构外部渲染 ([#38885](https://github.com/go-gitea/gitea/pull/38885)) ([#38898](https://github.com/go-gitea/gitea/pull/38898))
  - 在基础提交处解析 pull_request_target 的可复用工作流 ([#38886](https://github.com/go-gitea/gitea/pull/38886)) ([#38897](https://github.com/go-gitea/gitea/pull/38897))
  - 重构标记文本渲染 ([#38864](https://github.com/go-gitea/gitea/pull/38864)) ([#38869](https://github.com/go-gitea/gitea/pull/38869))
  - 将 Mermaid 更新到 v11.16.1 ([#38816](https://github.com/go-gitea/gitea/pull/38816))
  - 逐请求设置 WebAuthn 用户验证 ([#38805](https://github.com/go-gitea/gitea/pull/38805)) ([#38810](https://github.com/go-gitea/gitea/pull/38810))
  - 修复渲染高亮语言 ([#38793](https://github.com/go-gitea/gitea/pull/38793)) ([#38795](https://github.com/go-gitea/gitea/pull/38795))

- 改进
  - 补充缺失的 npm 软件包元数据属性 ([#38826](https://github.com/go-gitea/gitea/pull/38826)) ([#38831](https://github.com/go-gitea/gitea/pull/38831))

- 问题修复
  - workflow_dispatch 的 github.event.inputs 保持字符串类型 ([#38899](https://github.com/go-gitea/gitea/pull/38899)) ([#38908](https://github.com/go-gitea/gitea/pull/38908))
  - 允许选定作业的重跑读取上次执行的产物 ([#38857](https://github.com/go-gitea/gitea/pull/38857)) ([#38901](https://github.com/go-gitea/gitea/pull/38901))
  - 接受成功的 LFS 传输响应 ([#38866](https://github.com/go-gitea/gitea/pull/38866)) ([#38875](https://github.com/go-gitea/gitea/pull/38875))
  - 忽略嵌套 Package.swift ([#38788](https://github.com/go-gitea/gitea/pull/38788)) ([#38836](https://github.com/go-gitea/gitea/pull/38836))
  - 丢弃 Arch ParsePackage 中含换行的成员名 ([#38102](https://github.com/go-gitea/gitea/pull/38102)) ([#38830](https://github.com/go-gitea/gitea/pull/38830))
  - 修复 Azure Blob 导出提示文件不存在的问题 ([#38814](https://github.com/go-gitea/gitea/pull/38814)) ([#38828](https://github.com/go-gitea/gitea/pull/38828))
  - 修复迁移删除返回 JSON 重定向 ([#38796](https://github.com/go-gitea/gitea/pull/38796)) ([#38825](https://github.com/go-gitea/gitea/pull/38825))
  - 下划线使用浏览器默认样式 ([#38819](https://github.com/go-gitea/gitea/pull/38819)) ([#38823](https://github.com/go-gitea/gitea/pull/38823))
  - 允许取消没有正在运行作业的运行 ([#35842](https://github.com/go-gitea/gitea/pull/35842)) ([#38812](https://github.com/go-gitea/gitea/pull/38812))
  - 分别求值每个 `${{ }}` 部分 ([#38754](https://github.com/go-gitea/gitea/pull/38754)) ([#38797](https://github.com/go-gitea/gitea/pull/38797))
  - 在单个事务中写入 Action 任务报告 ([#38792](https://github.com/go-gitea/gitea/pull/38792)) ([#38794](https://github.com/go-gitea/gitea/pull/38794))
  - 修复标记文本链接 ([#38764](https://github.com/go-gitea/gitea/pull/38764)) ([#38765](https://github.com/go-gitea/gitea/pull/38765))
  - 内容大小未知时设置 MinIO 分段大小 ([#38753](https://github.com/go-gitea/gitea/pull/38753)) ([#38755](https://github.com/go-gitea/gitea/pull/38755))
  - 修复子路径归档下载中的错误路径转义 ([#38749](https://github.com/go-gitea/gitea/pull/38749)) ([#38750](https://github.com/go-gitea/gitea/pull/38750))
  - 刷新页面不包含 PR 合并框时将其从界面移除 ([#38742](https://github.com/go-gitea/gitea/pull/38742)) ([#38744](https://github.com/go-gitea/gitea/pull/38744))
  - 修复代码上的双重删除线 ([#38707](https://github.com/go-gitea/gitea/pull/38707)) ([#38729](https://github.com/go-gitea/gitea/pull/38729))
  - 修复失败上传删除并发上传元对象的问题 ([#38693](https://github.com/go-gitea/gitea/pull/38693)) ([#38722](https://github.com/go-gitea/gitea/pull/38722))
  - 使用子路径时生成正确完整 URL ([#38712](https://github.com/go-gitea/gitea/pull/38712)) ([#38716](https://github.com/go-gitea/gitea/pull/38716))
  - 避免标记文本渲染 panic ([#38698](https://github.com/go-gitea/gitea/pull/38698)) ([#38703](https://github.com/go-gitea/gitea/pull/38703))
  - 修复提交头像堆叠显示过多参与者 ([#38689](https://github.com/go-gitea/gitea/pull/38689)) ([#38700](https://github.com/go-gitea/gitea/pull/38700))
  - 支持 Alpine 注册表 APKINDEX.tar.gz 的 HEAD 请求 ([#38686](https://github.com/go-gitea/gitea/pull/38686)) ([#38688](https://github.com/go-gitea/gitea/pull/38688))

## 贡献者

* [@bircni](https://github.com/bircni)
* [@brechtvl](https://github.com/brechtvl)
* [@ChristopherHX](https://github.com/ChristopherHX)
* [@gomitrah](https://github.com/gomitrah)
* [@hsdfat](https://github.com/hsdfat)
* [@lunny](https://github.com/lunny)
* [@metsw24-max](https://github.com/metsw24-max)
* [@Pachinko0](https://github.com/Pachinko0)
* [@silverwind](https://github.com/silverwind)
* [@terriblegoodday](https://github.com/terriblegoodday)
* [@TheFox0x7](https://github.com/TheFox0x7)
* [@waterWang](https://github.com/waterWang)
* [@wxiaoguang](https://github.com/wxiaoguang)
* [@Zettat123](https://github.com/Zettat123)
