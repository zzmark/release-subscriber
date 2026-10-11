---
title: Gitea 28.0.0 官方发布博客（中文）
description: Gitea 28.0.0 正式发布博客的完整简体中文翻译。
---

# Gitea 28.0.0 正式发布

作者：bircni、TheFox0x7 · 博客发布日期（UTC）：2026-09-30

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-28.0.0/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/gitea/release-of-28.0.0.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 GitHub Release 日期分别保留。

我们很高兴宣布 Gitea 最新版本 **v28.0.0** 正式发布。

Gitea 从版本号中移除了历史遗留的 `1.` 前缀，因此本版为 **28.0.0**，而不是 1.28.0。

主要亮点包括审计日志、机器人账户、HTTPS 部署令牌、管理员用户模拟、代码所有者审批规则、差异文件筛选和 Actions 队列视图。其余内容见[更新日志](#changelog)。

衷心感谢通过提交代码补丁、报告问题、翻译以及其他方式支持项目的所有参与者。

<!--more-->

## 安全 {#security}

此版本修复以下安全漏洞，请尽快升级。

- [CVE-2026-104632](https://github.com/go-gitea/gitea/security/advisories/GHSA-pvjf-7jrm-6w9g)：取消并重跑待审批的派生仓库 PR 运行时，即使仍标为需要审批，也会将工作流分配给 Runner，让首次贡献者未经审批在自托管 Runner 上运行代码。现在授权重跑被视为显式批准，并记录批准者。由 [#39399](https://github.com/go-gitea/gitea/pull/39399) 修复。感谢 [@DshtAnger](https://github.com/DshtAnger) 报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-104626](https://github.com/go-gitea/gitea/security/advisories/GHSA-93pj-3x56-5gc2)：批准派生仓库 PR 运行会恢复等待审批期间已经取消的作业。批准现在不再重启已结束作业。由 [#39399](https://github.com/go-gitea/gitea/pull/39399) 修复。感谢 [@mayank-jangid-moon](https://github.com/mayank-jangid-moon), [@Kushalkhemka](https://github.com/Kushalkhemka), [@skigeek16](https://github.com/skigeek16), [@nithissh7](https://github.com/nithissh7) 和 [@kewmine](https://github.com/kewmine) 与 [@opensec-intelligence](https://github.com/opensec-intelligence) 共同报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-103059](https://github.com/go-gitea/gitea/security/advisories/GHSA-8pwg-hcgm-54cp)：内置 SSH 服务器通过不区分大小写的 SQL `LIKE` 查询公钥，伪造大小写变体 RSA 密钥可匹配其他用户账户。现在按指纹查询密钥。由 [#39423](https://github.com/go-gitea/gitea/pull/39423) 修复。感谢 [@carlini](https://github.com/carlini) 报告问题，感谢 [@TheFox0x7](https://github.com/TheFox0x7) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-103667](https://github.com/go-gitea/gitea/security/advisories/GHSA-7cq7-4v93-8wjm)：容器注册表将攻击者控制的媒体类型作为 blob 的 `Content-Type`，使推送的 blob 在 Gitea 源站被渲染为 HTML，形成存储型 XSS。现在 blob 以 `application/octet-stream` 提供，并限制清单内容类型，直接存储下载也适用。由 [#39398](https://github.com/go-gitea/gitea/pull/39398) 修复。感谢 [@parameter-ai-security](https://github.com/parameter-ai-security) 报告问题，感谢 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-95106](https://github.com/go-gitea/gitea/security/advisories/GHSA-6pv5-8rp7-8c75)：具有重复条目名称的 Git tree 可使 Gitea 显示与检出和 CI 使用的不同文件，向评审隐藏恶意内容。传入推送和传输现在执行 Git 对象一致性检查并拒绝此类对象。由 [#39472](https://github.com/go-gitea/gitea/pull/39472) 修复。感谢 [@izzysec](https://github.com/izzysec) 报告问题，感谢 [@TheFox0x7](https://github.com/TheFox0x7), [@lunny](https://github.com/lunny) 和 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-70357](https://github.com/go-gitea/gitea/security/advisories/GHSA-p3pc-g8m5-hrrr)：仓库迁移对远程主机名验证与 Git 连接分开执行，两者之间 DNS 重绑定可访问内部主机。Git 网络操作现在经由内部代理，在连接时应用出站策略。由 [#39426](https://github.com/go-gitea/gitea/pull/39426) 修复。感谢 [@tikket1](https://github.com/tikket1), [@SAJ0x00IN](https://github.com/SAJ0x00IN), [@rajivraj](https://github.com/rajivraj) 和 [@ahmdobeidat](https://github.com/ahmdobeidat) 报告问题，[@vuductruong12](https://github.com/vuductruong12) 发现问题，[@lilmingwa13](https://github.com/lilmingwa13) 提供分析，感谢 [@TheFox0x7](https://github.com/TheFox0x7), [@silverwind](https://github.com/silverwind), [@bircni](https://github.com/bircni) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-101027](https://github.com/go-gitea/gitea/security/advisories/GHSA-fqjr-23c8-gg9m)：匹配 `ALLOWED_DOMAINS` 的主机名会跳过 IP 检查，可通过 DNS 重绑定实施 SSRF。出站策略现在检查目标地址。由 [#39426](https://github.com/go-gitea/gitea/pull/39426) 修复。感谢 [@Razzlemouse](https://github.com/Razzlemouse) 报告问题，感谢 [@TheFox0x7](https://github.com/TheFox0x7), [@silverwind](https://github.com/silverwind), [@bircni](https://github.com/bircni) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-101029](https://github.com/go-gitea/gitea/security/advisories/GHSA-6g2h-xpg3-rm48)：仓库迁移和拉取镜像可通过多答案 DNS 绕过出站允许名单，读写内部主机。由 [#39010](https://github.com/go-gitea/gitea/pull/39010) 和 [#39426](https://github.com/go-gitea/gitea/pull/39426) 修复。感谢 [@cipher-creator](https://github.com/cipher-creator) 报告问题，感谢 [@TheFox0x7](https://github.com/TheFox0x7), [@silverwind](https://github.com/silverwind), [@bircni](https://github.com/bircni) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-89430](https://github.com/go-gitea/gitea/security/advisories/GHSA-hcgw-r9gf-8mph)：推送镜像仅在保存远程地址时检查主机策略，之后可连接内部 Git 主机并强制推送。镜像地址现在重新验证，并在连接时再次检查。由 [#39010](https://github.com/go-gitea/gitea/pull/39010) 和 [#39426](https://github.com/go-gitea/gitea/pull/39426) 修复。感谢 [@thesmartshadow](https://github.com/thesmartshadow), [@manus-use](https://github.com/manus-use) 和 [@cy3erm](https://github.com/cy3erm) 报告问题，感谢 [@TheFox0x7](https://github.com/TheFox0x7), [@silverwind](https://github.com/silverwind), [@bircni](https://github.com/bircni) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-103670](https://github.com/go-gitea/gitea/security/advisories/GHSA-4j4g-m7mr-hp5j)：未经批准的派生仓库 PR 运行可取消共享工作流级 `concurrency` 组的可信执行中运行。并发影响现在延后到批准后才生效。由 [#39399](https://github.com/go-gitea/gitea/pull/39399) 修复。感谢 [@Pedromdsn](https://github.com/Pedromdsn) 报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-94205](https://github.com/go-gitea/gitea/security/advisories/GHSA-xh39-mxw9-34pp)：派生仓库 PR 工作流审批仅检查触发事件的用户，维护者触发事件时会未经批准运行不可信派生仓库工作流。现在同时检查事件操作者和 PR 作者。由 [#39399](https://github.com/go-gitea/gitea/pull/39399) 修复。感谢 [@Michael-JRead](https://github.com/Michael-JRead) 报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-96399](https://github.com/go-gitea/gitea/security/advisories/GHSA-mw6q-qj47-9g5q)：包含交替捕获组的外部 Issue 跟踪器模式，在渲染引用时产生无效切片索引，导致实例崩溃。由 [#39354](https://github.com/go-gitea/gitea/pull/39354) 修复。感谢 [@davue](https://github.com/davue) 报告问题，感谢 [@breken-ai](https://github.com/breken-ai) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-96404](https://github.com/go-gitea/gitea/security/advisories/GHSA-9h7g-h754-c8x2)：对现有数据库重新运行安装程序时，未验证密码即为已有管理员账户签发会话，单用户数据库还跳过重装确认。由 [#39400](https://github.com/go-gitea/gitea/pull/39400) 修复。感谢 [@vuductruong12](https://github.com/vuductruong12) 发现问题，[@lilmingwa13](https://github.com/lilmingwa13) 提供分析，感谢 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-96589](https://github.com/go-gitea/gitea/security/advisories/GHSA-xfqq-h54g-92f8)：拒绝或取消仓库转移后仍保留接收者临时读取权限。现在移除转移授予的权限，同时保留原有协作者关系。由 [#39042](https://github.com/go-gitea/gitea/pull/39042) 修复。感谢 [@tomchuoi](https://github.com/tomchuoi) 和 [@sondt99](https://github.com/sondt99) 报告问题，[@Mon3mRT](https://github.com/Mon3mRT) 和 [@Black1hp](https://github.com/Black1hp) 发现问题，感谢 [@bircni](https://github.com/bircni), [@silverwind](https://github.com/silverwind) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-96400](https://github.com/go-gitea/gitea/security/advisories/GHSA-54w9-6cc5-9wj9)：非空 `[migrations] ALLOWED_DOMAINS` 即使设置 `ALLOW_LOCALNETWORKS = false` 也允许保留及链路本地地址；默认配置不受影响。由 [#39426](https://github.com/go-gitea/gitea/pull/39426) 修复。感谢 [@ihopenre-eng](https://github.com/ihopenre-eng) 报告问题，感谢 [@TheFox0x7](https://github.com/TheFox0x7), [@silverwind](https://github.com/silverwind), [@bircni](https://github.com/bircni) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-104636](https://github.com/go-gitea/gitea/security/advisories/GHSA-g4hw-fg4c-89mq)：推送镜像、Wiki 远程检查和迁移 PR 头获取中的 Git HTTP 重定向绕过出站主机策略。由 [#39426](https://github.com/go-gitea/gitea/pull/39426) 修复。感谢 [@ihopenre-eng](https://github.com/ihopenre-eng) 和 [@ElectQ](https://github.com/ElectQ) 报告问题，感谢 [@TheFox0x7](https://github.com/TheFox0x7), [@silverwind](https://github.com/silverwind), [@bircni](https://github.com/bircni) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-79960](https://github.com/go-gitea/gitea/security/advisories/GHSA-7769-9pr9-m24h)：部署密钥推送时以仓库所有者身份运行钩子，绕过受保护标签和推送选项权限检查。部署凭据现在拥有独立身份和权限。由 [#37306](https://github.com/go-gitea/gitea/pull/37306) 修复。感谢 [@1K0CT](https://github.com/1K0CT) 报告问题，感谢 [@ToastyTheBot](https://github.com/ToastyTheBot), [@silverwind](https://github.com/silverwind), [@bircni](https://github.com/bircni) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-103504](https://github.com/go-gitea/gitea/security/advisories/GHSA-x8c3-3rp8-2j46)：通过 API 降低团队权限后，原有单元级权限仍保留，使成员继续访问。由 [#38938](https://github.com/go-gitea/gitea/pull/38938) 修复。感谢 [@1K0CT](https://github.com/1K0CT) 报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-96580](https://github.com/go-gitea/gitea/security/advisories/GHSA-p3rv-cr5f-9gjh)：未批准派生仓库 PR 工作流中的巨大静态 `strategy.matrix` 在创建运行时完全展开，可耗尽服务端内存。现在展开前拒绝超过 256 种组合的矩阵。由 [#39295](https://github.com/go-gitea/gitea/pull/39295) 修复。感谢 [@smoke-wolf](https://github.com/smoke-wolf) 报告问题，[@Kushalkhemka](https://github.com/Kushalkhemka), [@mayank-jangid-moon](https://github.com/mayank-jangid-moon) 和 [@skigeek16](https://github.com/skigeek16) 与 [@opensec-intelligence](https://github.com/opensec-intelligence) 共同发现问题，感谢 [@silverwind](https://github.com/silverwind) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-95112](https://github.com/go-gitea/gitea/security/advisories/GHSA-467c-4w7p-8427)：Issue 引用解析反复扫描全部前置文本查找操作关键词，恶意内容可导致平方级处理时间。由 [#39396](https://github.com/go-gitea/gitea/pull/39396) 修复。感谢 [@AdamKorcz](https://github.com/AdamKorcz) 报告问题，感谢 [@n0liu](https://github.com/n0liu), [@silverwind](https://github.com/silverwind) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。

感谢负责任披露这些问题的所有安全研究人员。

## 如何更新

可从[下载页面](https://dl.gitea.com/gitea/28.0.0/)获取 Gitea。更多信息见[安装指南](https://docs.gitea.com/category/installation)。升级前请阅读[破坏性变更](#major-breaking-changes)，然后备份数据、替换二进制文件或 Docker 容器并重启。

发布二进制文件不再包含 32 位 x86 或 `gogit` 构建，Snap 也不再为 armhf 构建。下载文件名不再包含操作系统版本后缀，例如 `gitea-28.0.0-windows-amd64.exe`，请相应更新下载脚本。

## 特别致谢

感谢 [Open Collective](https://opencollective.com/gitea) 上为项目持续提供资金支持的所有支持者。

## 主要破坏性变更 {#major-breaking-changes}

### :warning: Git 网络操作使用内部代理和新的出站规则 ([#39426](https://github.com/go-gitea/gitea/pull/39426))

迁移、镜像和其他 Git 网络操作现在经由内部代理，使出站设置也适用于直连连接。请在**升级之前**检查允许列表和阻止列表：

- 移除了 `external` 预设。如需默认拒绝策略，请设置 `EGRESS_MODE = strict` 并列出允许的主机。`[migrations] EGRESS_MODE` 适用于迁移和镜像，`[security] EGRESS_MODE` 适用于 Webhook 和 OAuth2。
- 严格模式下，未指定端口的条目仅允许端口 80 和 443。
- 默认的 `lax` 模式下，`[security] ALLOWED_HOST_LIST` 不再限制公开主机。若要将其保留为排他性允许列表，请设置 `[security] EGRESS_MODE = strict`。设置了列表但未显式设置 `EGRESS_MODE` 时，Gitea 会在启动时记录警告。
- IP 地址条目不再接受通配符，`*` 也不再是有效条目。
- 域名条目遵循 curl 语法：`example.com` 匹配该域名及所有子域名，`*.example.com` 仅匹配子域名，`example.*` 无效。
- 无效的 `[migrations] BLOCKED_HOST_LIST` 条目现在会阻止 Gitea 启动。
- `[migrations] ALLOWED_DOMAINS`、`BLOCKED_DOMAINS` 和 `ALLOW_LOCALNETWORKS` 已弃用，改用 `[migrations] ALLOWED_HOST_LIST` 和 `BLOCKED_HOST_LIST`。

感谢 **[@TheFox0x7](https://github.com/TheFox0x7)** 贡献此更改。

### :warning: Actions 运行历史现在会过期 ([#38855](https://github.com/go-gitea/gitea/pull/38855))

已完成的 Actions 运行默认在 **400 天**后删除，同时删除其作业、日志和制品。新的 `cleanup_action_runs` cron 任务负责删除，默认在午夜执行。如需保留所有运行，请在**升级之前**设置以下配置：

```ini
[actions]
RUN_RETENTION_DAYS = 0
```

`RUN_RETENTION_DAYS`、`LOG_RETENTION_DAYS` 和 `ARTIFACT_RETENTION_DAYS` 的值为 `0` 时，现在表示“永久保留”。日志和制品总是随所属运行一起删除。

感谢 **[@facorazza](https://github.com/facorazza)** 贡献此变更。

### :warning: 要求 Git 2.25 或更高版本 ([#39131](https://github.com/go-gitea/gitea/pull/39131))

Git 版本低于 **2.25.0** 时，Gitea 现在会拒绝启动。如果自行安装 Git，请在升级前检查 `git --version`。

感谢 **[@silverwind](https://github.com/silverwind)** 贡献此更改。

### :warning: 自助注册默认关闭，忽略 `[server] DOMAIN` ([#39400](https://github.com/go-gitea/gitea/pull/39400))

- 现在禁用自助注册，除非显式设置 `[service] DISABLE_REGISTRATION = false`。
- Gitea 不再读取 `[server] DOMAIN`。实例域名（包括默认 SSH 域名）现在取自 `ROOT_URL`，如果此前依赖 `DOMAIN`，请设置 `ROOT_URL`。

感谢 **[@wxiaoguang](https://github.com/wxiaoguang)** 贡献此更改。

### :warning: 更严格地求值 Actions 工作流 ([#39358](https://github.com/go-gitea/gitea/pull/39358))

- 作业级 `if:` 现在在矩阵展开前求值，且只能使用 `github`、`gitea`、`needs`、`vars` 和 `inputs` 上下文。请将 `matrix` 条件移至 `strategy.matrix.include`/`exclude` 或步骤级 `if:`。
- 现在执行矩阵 `fail-fast` 行为，失败作业可能取消其余组合。设置 `strategy.fail-fast: false` 可让所有组合完成。
- 公开仓库中的工作流不再能调用私有仓库的可复用工作流，嵌套工作流的权限也不再能超出调用者的令牌权限。

感谢 **[@silverwind](https://github.com/silverwind)** 贡献这些变更。

## 主要亮点（管理）

### :rocket: 以指定用户的视角查看实例 ([#38614](https://github.com/go-gitea/gitea/pull/38614)) ([#38924](https://github.com/go-gitea/gitea/pull/38924))

管理员现在可以模拟用户，以该用户的视角查看 Gitea，无需索取用户密码即可复现访问问题。横幅标识模拟会话，并提供返回管理员账户的链接。会话内所有操作均以被模拟用户的身份执行；启用审计日志后，事件会同时记录两个账户。

![模拟用户会话，横幅标识当前会话并提供退出按钮](https://blog.gitea.com/demos/38924/1.png)

感谢 **[@wxiaoguang](https://github.com/wxiaoguang)** 和 **[@bircni](https://github.com/bircni)** 贡献这些改进。

### :rocket: 审计日志 ([#38189](https://github.com/go-gitea/gitea/pull/38189))

Gitea 现在可以记录安全相关事件，并在管理员、组织、仓库和用户设置中显示。可按操作者、操作和来源筛选事件，管理员可导出 JSONL 格式。

审计日志**默认关闭**。通过以下配置启用：

```ini
[audit]
RECORD_OUTPUT = database
```

事件默认保留 30 天。可使用 `[audit] RETENTION_DAYS` 更改，`0` 表示永久保留。

![包含事件详情的审计日志](https://blog.gitea.com/demos/38189/1.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 共享 Redis 配置 ([#38550](https://github.com/go-gitea/gitea/pull/38550))

新增 `[redis]` 节，将一个 `CONN_STR` 设为缓存、会话、队列、全局锁和 WebSocket 发布/订阅的默认连接字符串。它适用于已配置使用 Redis、但未设置独立连接字符串的子系统。

```ini
[redis]
CONN_STR = redis://127.0.0.1:6379/0
```

感谢 **[@mohammad-rj](https://github.com/mohammad-rj)** 和 **[@wxiaoguang](https://github.com/wxiaoguang)** 贡献此功能。

### :rocket: 专用机器人账户 ([#38966](https://github.com/go-gitea/gitea/pull/38966))

机器人账户用于自动化，通过访问令牌认证，不能交互式登录，也不会收到通知或邮件。管理员可通过管理界面、API 或 CLI 创建机器人、管理其令牌，并在符合条件的本地用户账户与机器人账户之间转换。

![在管理界面创建机器人账户](https://blog.gitea.com/demos/38966/1.png)

感谢 **[@joestump](https://github.com/joestump)** 和 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 实时通知迁移至 WebSocket ([#36965](https://github.com/go-gitea/gitea/pull/36965))

通知计数、秒表更新和退出登录事件现在使用 `/-/ws` 上的 WebSocket，替代 `/user/events` 上的服务端发送事件。反向代理必须转发 WebSocket 升级请求头，否则通知计数和秒表更新会回退至轮询。多 Gitea 进程部署需要 `[websocket] PUBSUB_TYPE = redis` 和 Redis 连接。移除了 `[ui.notification] EVENT_SOURCE_UPDATE_TIME` 设置。

感谢 **[@mohammad-rj](https://github.com/mohammad-rj)** 贡献此变更。

## 主要亮点（代码与协作）

### :rocket: 仓库范围的 HTTPS 部署令牌 ([#37306](https://github.com/go-gitea/gitea/pull/37306))

部署令牌是 SSH 部署密钥的 HTTPS 对应功能。每个令牌限定于一个仓库，具有只读或读写权限，作为通过 HTTPS 访问 Git 和 LFS 的密码。部署令牌和个人访问令牌 [#38907](https://github.com/go-gitea/gitea/pull/38907) 都可原位重新生成。

![仓库部署令牌设置](https://blog.gitea.com/demos/37306/1.png)

感谢 **[@ToastyTheBot](https://github.com/ToastyTheBot)** 和 **[@gomitrah](https://github.com/gomitrah)** 贡献这些功能。

### :rocket: 在拉取请求差异中搜索和筛选文件 ([#37068](https://github.com/go-gitea/gitea/pull/37068))

差异文件树新增搜索框和文件扩展名筛选器。两者均筛选文件树和差异，扩展名筛选条件保留在 URL 中，可分享筛选后的视图。

<img src="https://blog.gitea.com/demos/37068/1.png" alt="差异侧栏中的文件搜索和扩展名筛选器" width="250" />

感谢 **[@McMichalK](https://github.com/McMichalK)**、**[@silverwind](https://github.com/silverwind)** 和 **[@wxiaoguang](https://github.com/wxiaoguang)** 贡献此功能。

### :rocket: 合并前要求代码所有者审核 ([#34995](https://github.com/go-gitea/gitea/pull/34995))

新增分支保护选项：每条匹配的 `CODEOWNERS` 规则均需至少一位代码所有者或所列团队成员批准，才能合并。

感谢 **[@Naxdy](https://github.com/Naxdy)**、**[@bircni](https://github.com/bircni)** 和 **[@wxiaoguang](https://github.com/wxiaoguang)** 贡献此功能。

### :rocket: 选择接收哪些仓库通知 ([#37571](https://github.com/go-gitea/gitea/pull/37571))

关注按钮现在是菜单，包含 **Participating and mentions（参与和提及）**、**All activity（所有活动）**、**Ignore（忽略）** 和 **Custom（自定义）**。**自定义**可选择工单、拉取请求和发布的通知。这些选项同时适用于界面和邮件通知。

感谢 **[@schonwetter](https://github.com/schonwetter)** 贡献此功能。

### :rocket: 从仓库页头切换仓库 ([#38188](https://github.com/go-gitea/gitea/pull/38188))

仓库名称旁的下拉菜单可搜索和切换同一所有者的仓库。

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 在生成仓库时排除文件 ([#38064](https://github.com/go-gitea/gitea/pull/38064))

模板仓库可在 `.gitea/template` 的 `[exclude]` 节中列出文件和目录，在生成仓库时排除它们。

感谢 **[@paarth-k2002](https://github.com/paarth-k2002)** 贡献此功能。

### :rocket: 通过关闭引用关闭拉取请求 ([#39393](https://github.com/go-gitea/gitea/pull/39393))

`Fixes: #123` 等关闭引用现在也可关闭拉取请求，而不仅是工单。

感谢 **[@silverwind](https://github.com/silverwind)** 贡献此改进。

### :rocket: 同时使用内部和外部工单跟踪器 ([#39354](https://github.com/go-gitea/gitea/pull/39354))

仓库现在可以将 Gitea 内置工单与外部跟踪器同时使用，外部引用可采用字母数字或正则表达式格式，如 `JIRA-123`。请将外部跟踪器 URL 留空，否则“工单”标签页仍会重定向至外部跟踪器。

感谢 **[@breken-ai](https://github.com/breken-ai)** 贡献此改进。

### :rocket: 检测 REUSE 许可证并显示多个许可证 ([#38720](https://github.com/go-gitea/gitea/pull/38720))

Gitea 现在检测以 SPDX 标识命名的 REUSE 风格许可证文件，并显示每个检测到的许可证及其文件链接。

感谢 **[@TheFox0x7](https://github.com/TheFox0x7)** 贡献此功能。

## 主要亮点（Actions）

### :rocket: 查看构建队列中正在运行和等待的作业 ([#38585](https://github.com/go-gitea/gitea/pull/38585))

新的队列视图先显示正在运行的作业，再按 Runner 获取顺序显示等待作业。管理员可查看全实例队列并按所有者、仓库和状态筛选；各仓库的 Actions 标签页也有独立队列。两个视图均就地刷新。

![Actions 构建队列中的排队作业](https://blog.gitea.com/demos/38585/1.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 工作流运行列表自动刷新 ([#38329](https://github.com/go-gitea/gitea/pull/38329))

Actions 运行列表现在自动刷新，但浏览器标签页处于后台时除外。

感谢 **[@SudhanshuMatrix](https://github.com/SudhanshuMatrix)** 贡献此功能。

### :rocket: 在浏览器中预览构建制品 ([#36754](https://github.com/go-gitea/gitea/pull/36754))

Actions 运行视图现在可以浏览制品，预览文本、图片、PDF 和测试报告等生成的 HTML。预览要求登录并拥有运行的读取权限。HTML 预览在沙箱框架中执行。仍可下载 ZIP。

`[actions] ARTIFACT_PREVIEW_MAX_SIZE` 默认将预览限制为不超过 10 MiB 的制品。`0` 禁用预览，`-1` 取消限制。单个文件还受 `[ui] MAX_DISPLAY_FILE_SIZE` 限制。

![Actions 制品文件浏览器和预览](https://blog.gitea.com/demos/36754/1.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 动态矩阵、`max-parallel` 和更多工作流语法 ([#36564](https://github.com/go-gitea/gitea/pull/36564)) ([#36357](https://github.com/go-gitea/gitea/pull/36357)) ([#39358](https://github.com/go-gitea/gitea/pull/39358))

作业矩阵现在可以根据前序作业的输出构建，`strategy.max-parallel` 限制作业矩阵的同时运行数量。`runs-on` 等属性可以依赖 `needs`，待相关作业完成后解析。`uses:` 接受 `self:` 来引用同一实例上的 Action 和工作流，可复用工作流调用接受 `$/` 来表示同一仓库 [#38822](https://github.com/go-gitea/gitea/pull/38822)。推送无效工作流文件现在会创建显示错误的失败运行。

感谢 **[@ZPascal](https://github.com/ZPascal)** 和 **[@silverwind](https://github.com/silverwind)** 贡献这些改进。

## 主要亮点（API 与软件包）

### :rocket: 项目看板 API ([#38691](https://github.com/go-gitea/gitea/pull/38691))

新增 REST 端点，在仓库、组织和用户级别管理项目看板。

感谢 **[@silverwind](https://github.com/silverwind)** 贡献此功能。

### :rocket: 更多工作流运行管理 API ([#35382](https://github.com/go-gitea/gitea/pull/35382)) ([#38756](https://github.com/go-gitea/gitea/pull/38756))

新增 Actions 端点，用于管理工作流运行、获取日志和强制取消运行。

感谢 **[@rossigee](https://github.com/rossigee)** 和 **[@Zettat123](https://github.com/Zettat123)** 贡献这些改进。

### :rocket: 软件包注册表改进 ([#37890](https://github.com/go-gitea/gitea/pull/37890)) ([#39267](https://github.com/go-gitea/gitea/pull/39267)) ([#36695](https://github.com/go-gitea/gitea/pull/36695)) ([#38968](https://github.com/go-gitea/gitea/pull/38968))

npm 注册表支持 `npm deprecate`、更丰富的版本元数据和单版本 API。Helm Chart 可连同来源证明文件上传，站点管理员可通过新 API 列出所有软件包。

感谢 **[@philip-x-rutkowski-intel-com](https://github.com/philip-x-rutkowski-intel-com)**、**[@silverwind](https://github.com/silverwind)**、**[@TheFox0x7](https://github.com/TheFox0x7)** 和 **[@lunny](https://github.com/lunny)** 贡献这些改进。

## 更新日志 {#changelog}

- 破坏性变更
  - 通过内部代理执行 Git 网络操作，更新出站设置 ([#39426](https://github.com/go-gitea/gitea/pull/39426))
  - 增加 RUN_RETENTION_DAYS，删除旧的 Action 运行 ([#38855](https://github.com/go-gitea/gitea/pull/38855))
  - 重构：“安装”页面 ([#39400](https://github.com/go-gitea/gitea/pull/39400))
  - 维护：将最低 Git 版本提高至 2.25 ([#39131](https://github.com/go-gitea/gitea/pull/39131))

- 安全
  - 推送时拒绝无效和重复 Git 对象 ([#39472](https://github.com/go-gitea/gitea/pull/39472))
  - 通过内部代理执行 Git 网络操作，更新出站设置 ([#39426](https://github.com/go-gitea/gitea/pull/39426))
  - 按指纹识别提交的 SSH 公钥 ([#39423](https://github.com/go-gitea/gitea/pull/39423))
  - 已取消且未获批准的派生仓库 PR 运行仍受审批门禁限制 ([#39399](https://github.com/go-gitea/gitea/pull/39399))
  - 更新 golang.org/x/crypto SSH，修复拒绝服务问题 ([#39219](https://github.com/go-gitea/gitea/pull/39219))
  - 对团队访问、删除和软件包解除关联强制检查仓库范围授权 ([#39063](https://github.com/go-gitea/gitea/pull/39063))

- 新功能
  - 更新 actionslib，支持 `self:` 并修复细节 ([#39358](https://github.com/go-gitea/gitea/pull/39358))
  - 允许站点管理员列出所有软件包 ([#38968](https://github.com/go-gitea/gitea/pull/38968))
  - 从管理界面、API 和 CLI 管理机器人账户 ([#38966](https://github.com/go-gitea/gitea/pull/38966))
  - 个人访问令牌可以重新生成 ([#38907](https://github.com/go-gitea/gitea/pull/38907))
  - 可复用工作流的 `uses:` 支持 `$/` 前缀 ([#38822](https://github.com/go-gitea/gitea/pull/38822))
  - 增加强制取消工作流运行的 API ([#38756](https://github.com/go-gitea/gitea/pull/38756))
  - 许可证支持 REUSE 规范 ([#38720](https://github.com/go-gitea/gitea/pull/38720))
  - 增加项目 API ([#38691](https://github.com/go-gitea/gitea/pull/38691))
  - 仓库重命名时触发仓库 Webhook 事件 ([#38641](https://github.com/go-gitea/gitea/pull/38641))
  - 允许管理员模拟用户 ([#38614](https://github.com/go-gitea/gitea/pull/38614))
  - 增加构建队列视图 ([#38585](https://github.com/go-gitea/gitea/pull/38585))
  - 增加共享 [redis] 节，作为 Redis 后端子系统的默认设置 ([#38550](https://github.com/go-gitea/gitea/pull/38550))
  - 优先采用常见 README 名称并优化发现过程 ([#38532](https://github.com/go-gitea/gitea/pull/38532))
  - 工作流运行列表支持自适应自动刷新 ([#38329](https://github.com/go-gitea/gitea/pull/38329))
  - 增加 `disable-2fa` 命令 ([#38275](https://github.com/go-gitea/gitea/pull/38275))
  - 增加审计日志 ([#38189](https://github.com/go-gitea/gitea/pull/38189))
  - 为仓库标题增加快速仓库切换器 ([#38188](https://github.com/go-gitea/gitea/pull/38188))
  - 模板生成支持 .gitea/template 中的文件排除逻辑 ([#38064](https://github.com/go-gitea/gitea/pull/38064))
  - 管理员用户详情页支持移除组织成员关系 ([#38013](https://github.com/go-gitea/gitea/pull/38013))
  - 增加关注选项 ([#37571](https://github.com/go-gitea/gitea/pull/37571))
  - 增加部署令牌 ([#37306](https://github.com/go-gitea/gitea/pull/37306))
  - 为差异侧边栏增加搜索和扩展名筛选 ([#37068](https://github.com/go-gitea/gitea/pull/37068))
  - 界面通知从 SSE 改为 WebSocket ([#36965](https://github.com/go-gitea/gitea/pull/36965))
  - 在 Actions 运行视图增加产物预览 ([#36754](https://github.com/go-gitea/gitea/pull/36754))
  - 支持上传 Helm 来源证明文件 ([#36695](https://github.com/go-gitea/gitea/pull/36695))
  - 在 Gitea Actions 工作流中支持动态矩阵求值 ([#36564](https://github.com/go-gitea/gitea/pull/36564))
  - 为 Gitea Actions 增加 max-parallel 支持 ([#36357](https://github.com/go-gitea/gitea/pull/36357))
  - 为工作流运行管理和日志增加 Actions API 端点 ([#35382](https://github.com/go-gitea/gitea/pull/35382))
  - 增加在代码所有者评审待定时阻止合并的分支保护 ([#34995](https://github.com/go-gitea/gitea/pull/34995))

- 改进
  - 允许通过 PR 自动关闭其他 PR ([#39393](https://github.com/go-gitea/gitea/pull/39393))
  - 增加 pending 作业状态，使作业状态与 GitHub 对齐 ([#39376](https://github.com/go-gitea/gitea/pull/39376))
  - 支持配置 ACME profile ([#39375](https://github.com/go-gitea/gitea/pull/39375))
  - 更新到 Unicode 17，统一并延迟加载表情符号数据 ([#39363](https://github.com/go-gitea/gitea/pull/39363))
  - 改进 Issue 模式捕获组，支持同时启用内部和外部跟踪器 ([#39354](https://github.com/go-gitea/gitea/pull/39354))
  - 将 Mermaid 更新到 v12 ([#39331](https://github.com/go-gitea/gitea/pull/39331))
  - 将当前通知页标记为已读 ([#39294](https://github.com/go-gitea/gitea/pull/39294))
  - 流式仓库归档支持 `ETag` 和 `If-None-Match: *` ([#39289](https://github.com/go-gitea/gitea/pull/39289))
  - 截断但显示差异中的长行 ([#39279](https://github.com/go-gitea/gitea/pull/39279))
  - 实现 npm 单版本 API，并增加按版本设置的仓库 ([#39267](https://github.com/go-gitea/gitea/pull/39267))
  - 将 window.config 移至 JSON，改进 CSP 格式 ([#39236](https://github.com/go-gitea/gitea/pull/39236))
  - 改进提交页标题 ([#39229](https://github.com/go-gitea/gitea/pull/39229))
  - 改进密钥/变量验证错误 ([#39221](https://github.com/go-gitea/gitea/pull/39221))
  - 危险操作检查完整仓库名 ([#39213](https://github.com/go-gitea/gitea/pull/39213))
  - 组合编辑器预览标签页隐藏附件拖放区域 ([#39204](https://github.com/go-gitea/gitea/pull/39204))
  - 拖放预览显示附件 URL 和 UUID ([#39203](https://github.com/go-gitea/gitea/pull/39203))
  - 工作流手动触发选择下拉菜单支持搜索 ([#39154](https://github.com/go-gitea/gitea/pull/39154))
  - 统一提交页差异统计，调整差异细节 ([#39134](https://github.com/go-gitea/gitea/pull/39134))
  - 通过浏览器区域设置确定贡献图每周第一天 ([#38995](https://github.com/go-gitea/gitea/pull/38995))
  - 改进强制颜色模式 ([#38991](https://github.com/go-gitea/gitea/pull/38991))
  - 提供更友好的软件包配置手册 ([#38946](https://github.com/go-gitea/gitea/pull/38946))
  - 为所有单元继承团队访问权限 ([#38938](https://github.com/go-gitea/gitea/pull/38938))
  - 显示模拟用户横幅，将密码修改保留给用户本人 ([#38924](https://github.com/go-gitea/gitea/pull/38924))
  - 按级别为提示消息背景着色 ([#38919](https://github.com/go-gitea/gitea/pull/38919))
  - 增加默认对象格式设置 ([#38877](https://github.com/go-gitea/gitea/pull/38877))
  - 在 Actions 上下文设置 ref_protected ([#38852](https://github.com/go-gitea/gitea/pull/38852))
  - 重新设计提示消息样式 ([#38842](https://github.com/go-gitea/gitea/pull/38842))
  - 完善仓库关注功能 ([#38835](https://github.com/go-gitea/gitea/pull/38835))
  - 缺少特定样式模板时回退到 DEFAULT_TEMPLATE.md ([#38803](https://github.com/go-gitea/gitea/pull/38803))
  - 增加 GitHub 兼容的 /repos/{owner}/{repo}/commits/{ref} 端点 ([#38770](https://github.com/go-gitea/gitea/pull/38770))
  - 在 contents API 响应公开文件模式 ([#38713](https://github.com/go-gitea/gitea/pull/38713))
  - 使用 Go 的 TLS 默认设置 ([#38687](https://github.com/go-gitea/gitea/pull/38687))
  - 改进亮度计算 ([#38682](https://github.com/go-gitea/gitea/pull/38682))
  - 为发布列表 API 增加 `tag_filter` 查询参数 ([#38681](https://github.com/go-gitea/gitea/pull/38681))
  - 用自有代码替代 `ansi_up` ([#38619](https://github.com/go-gitea/gitea/pull/38619))
  - 合并框重新加载时保持状态检查列表滚动位置 ([#38597](https://github.com/go-gitea/gitea/pull/38597))
  - 改进 Actions 视图 ([#38594](https://github.com/go-gitea/gitea/pull/38594))
  - 调整提示样式并修复细节 ([#38524](https://github.com/go-gitea/gitea/pull/38524))
  - 改进邮件模板 ([#38396](https://github.com/go-gitea/gitea/pull/38396))
  - MS Teams 评审请求通知增加评审者名称 ([#38289](https://github.com/go-gitea/gitea/pull/38289))
  - 增强：扩展 `<video>` 标签允许的属性 ([#38279](https://github.com/go-gitea/gitea/pull/38279))
  - 扩展 npm 版本元数据，支持 npm deprecate ([#37890](https://github.com/go-gitea/gitea/pull/37890))

- 性能
  - 仅扫描引用前的关键词窗口 ([#39396](https://github.com/go-gitea/gitea/pull/39396))
  - 启用 Vite 模块预加载 ([#39332](https://github.com/go-gitea/gitea/pull/39332))
  - 使用缓存优化行内差异高亮 ([#38706](https://github.com/go-gitea/gitea/pull/38706))

- 问题修复
  - 在并发组中保留已获准的作业和运行 ([#39461](https://github.com/go-gitea/gitea/pull/39461))
  - 修复提交树 SHA 错用提交 ID 的问题 ([#39449](https://github.com/go-gitea/gitea/pull/39449))
  - 修复 PR 合并 ([#39442](https://github.com/go-gitea/gitea/pull/39442))
  - 并发检查前求值作业级 `if:` ([#39437](https://github.com/go-gitea/gitea/pull/39437))
  - 允许仅包含待定行内评论的评审 ([#39433](https://github.com/go-gitea/gitea/pull/39433))
  - 清理外部渲染命令行参数 ([#39417](https://github.com/go-gitea/gitea/pull/39417))
  - gc-lfs 移除孤立数据后重新计算仓库 LFSSize ([#39406](https://github.com/go-gitea/gitea/pull/39406))
  - 在 Bleve 中索引完整文件路径和真实偏移 ([#39405](https://github.com/go-gitea/gitea/pull/39405))
  - 保留 Git grep 搜索模式开头的短横线 ([#39404](https://github.com/go-gitea/gitea/pull/39404))
  - LDAP 认证失败时使用更明确的消息 ([#39392](https://github.com/go-gitea/gitea/pull/39392))
  - 修复提交者不同时未签名提交无法渲染的问题 ([#39381](https://github.com/go-gitea/gitea/pull/39381))
  - 确认按钮自动聚焦，删除确认使用红色 ([#39350](https://github.com/go-gitea/gitea/pull/39350))
  - 保留 SHA-256 PR 提交 ID ([#39343](https://github.com/go-gitea/gitea/pull/39343))
  - 修复界面细节 ([#39336](https://github.com/go-gitea/gitea/pull/39336))
  - 使用 Gitea 的时钟计算 Actions 时长 ([#39323](https://github.com/go-gitea/gitea/pull/39323))
  - 不显示负的运行时长 ([#39322](https://github.com/go-gitea/gitea/pull/39322))
  - 修复软件包注册表密钥对创建竞态 ([#39319](https://github.com/go-gitea/gitea/pull/39319))
  - 为 HaveIBeenPwned API 增加默认超时和错误处理 ([#39316](https://github.com/go-gitea/gitea/pull/39316))
  - 统一注册和设置中的邮箱验证 ([#39304](https://github.com/go-gitea/gitea/pull/39304))
  - 分支和标签下拉菜单的标签页使用 button 元素 ([#39285](https://github.com/go-gitea/gitea/pull/39285))
  - 修复 Windows 上 SSH 和 GPG 密钥验证 ([#39283](https://github.com/go-gitea/gitea/pull/39283))
  - 使用有意义的行作为评论摘录 ([#39276](https://github.com/go-gitea/gitea/pull/39276))
  - 允许项目列数达到上限 ([#39272](https://github.com/go-gitea/gitea/pull/39272))
  - 通过标准输入向 Git 传递合并提交消息 ([#39269](https://github.com/go-gitea/gitea/pull/39269))
  - 同步派生仓库时显示无关历史问题 ([#39258](https://github.com/go-gitea/gitea/pull/39258))
  - 避免 nil panic 并重构细节 ([#39251](https://github.com/go-gitea/gitea/pull/39251))
  - 重新发布软件包时恢复缺失的 blob 文件 ([#39239](https://github.com/go-gitea/gitea/pull/39239))
  - 自动合并前验证头提交 ([#39235](https://github.com/go-gitea/gitea/pull/39235))
  - 防止公开链接泄露 localhost:3000 ([#39217](https://github.com/go-gitea/gitea/pull/39217))
  - 超时设置遵循未加单位的 -1 ([#39181](https://github.com/go-gitea/gitea/pull/39181))
  - 修正仓库/附件绝对 URL 和发布布局 ([#39178](https://github.com/go-gitea/gitea/pull/39178))
  - 在网页编辑器提交表单中填充“无法提交到分支”的原因 ([#39155](https://github.com/go-gitea/gitea/pull/39155))
  - cmd.Cancel 时回收整个进程组 ([#39143](https://github.com/go-gitea/gitea/pull/39143))
  - 识别 Linguist 语言别名 ([#39135](https://github.com/go-gitea/gitea/pull/39135))
  - 保留仓库转移接收者的协作者关系 ([#39042](https://github.com/go-gitea/gitea/pull/39042))
  - 数据库分页读取始终要求 "order" 选项 ([#39017](https://github.com/go-gitea/gitea/pull/39017))
  - 使本地队列 PopItem 可以接收通知 ([#39011](https://github.com/go-gitea/gitea/pull/39011))
  - 按标准错误分类 Git 失败，限制迁移失败详情 ([#39010](https://github.com/go-gitea/gitea/pull/39010))
  - 允许重新请求未计数的评审批准 ([#38988](https://github.com/go-gitea/gitea/pull/38988))
  - 允许更大的定时工作流 ([#38985](https://github.com/go-gitea/gitea/pull/38985))
  - 按仓库解析 Actions 提交状态权限 ([#38977](https://github.com/go-gitea/gitea/pull/38977))
  - 将 golang.org/x/image 更新到 v0.45.0 [security] ([#38930](https://github.com/go-gitea/gitea/pull/38930))
  - 将 golang.org/x/mod 更新到 v0.40.0 [security] ([#38914](https://github.com/go-gitea/gitea/pull/38914))
  - 去重 Issue 交叉引用时间线条目 ([#38881](https://github.com/go-gitea/gitea/pull/38881))
  - 为 HTTP 服务器设置 `ReadHeaderTimeout` ([#38878](https://github.com/go-gitea/gitea/pull/38878))
  - 避免每次 bundle 下载都生成整个仓库大小的临时文件 ([#38863](https://github.com/go-gitea/gitea/pull/38863))
  - 确保 LFS 锁列表分页使用全序 ([#38850](https://github.com/go-gitea/gitea/pull/38850))
  - 使用 SHA-256 并内联联合头像查询 ([#38843](https://github.com/go-gitea/gitea/pull/38843))
  - 渲染恰好达到上限的差异和零上限评论 ([#38838](https://github.com/go-gitea/gitea/pull/38838))
  - 将 Mermaid 依赖更新到 v11.16.1 [security] ([#38813](https://github.com/go-gitea/gitea/pull/38813))
  - 修复 pub/GPG/测试细节 ([#38809](https://github.com/go-gitea/gitea/pull/38809))
  - 修复 Git 差异 blob 摘录 ([#38808](https://github.com/go-gitea/gitea/pull/38808))
  - 重复清理规则显示错误 #37820 ([#38786](https://github.com/go-gitea/gitea/pull/38786))
  - 修复 Runner 文档链接 ([#38783](https://github.com/go-gitea/gitea/pull/38783))
  - 修复 Git 缓存 ([#38763](https://github.com/go-gitea/gitea/pull/38763))
  - 分别求值每个 `${{ }}` 部分 ([#38754](https://github.com/go-gitea/gitea/pull/38754))
  - 不将失败的网络请求报告为 JavaScript 错误 ([#38732](https://github.com/go-gitea/gitea/pull/38732))
  - 防止 GetLineTypeMarker 出现索引越界 panic ([#38728](https://github.com/go-gitea/gitea/pull/38728))
  - 文档使用 X-Total-Count，而非不存在的 X-Total 响应头 ([#38717](https://github.com/go-gitea/gitea/pull/38717))
  - 修复动态矩阵展开的正确性问题 ([#38690](https://github.com/go-gitea/gitea/pull/38690))
  - 反向代理登录时记录最后登录时间 ([#38672](https://github.com/go-gitea/gitea/pull/38672))
  - contents API 接受完整限定引用 ([#38650](https://github.com/go-gitea/gitea/pull/38650))
  - 将 github.com/getkin/kin-openapi 更新到 v0.144.0 [security] ([#38623](https://github.com/go-gitea/gitea/pull/38623))
  - 将 js-yaml 依赖更新到 v5.2.2 [security] ([#38622](https://github.com/go-gitea/gitea/pull/38622))
  - 取消被新请求取代的 Issue 建议请求 ([#38620](https://github.com/go-gitea/gitea/pull/38620))
  - 批量操作失败时显示错误提示，而非重新加载页面 ([#38593](https://github.com/go-gitea/gitea/pull/38593))
  - 将 google.golang.org/grpc 更新到 v1.82.1 [security] ([#38567](https://github.com/go-gitea/gitea/pull/38567))
  - 将 github.com/google/go-github/v88 更新到 v89 ([#38433](https://github.com/go-gitea/gitea/pull/38433))
  - 更新 Go 依赖 ([#38429](https://github.com/go-gitea/gitea/pull/38429))
  - 更新 Go 依赖 ([#38346](https://github.com/go-gitea/gitea/pull/38346))
  - 更新 npm 依赖 ([#38342](https://github.com/go-gitea/gitea/pull/38342))
  - 修正带前导零数字的自然排序 ([#38163](https://github.com/go-gitea/gitea/pull/38163))
  - 避免 `overflow-menu` 和仓库筛选中的布局跳动 ([#37818](https://github.com/go-gitea/gitea/pull/37818))
  - 认证源组同步正确处理团队移除 ([#37161](https://github.com/go-gitea/gitea/pull/37161))
  - 将公开发布时间与发布日期分开 ([#36761](https://github.com/go-gitea/gitea/pull/36761))

- 测试
  - 防止测试写入 `~/.ssh` ([#39348](https://github.com/go-gitea/gitea/pull/39348))
  - PR 评审测试中退出登录以切换用户 ([#39328](https://github.com/go-gitea/gitea/pull/39328))
  - 数据库操作前释放测试数据加载器锁 ([#39263](https://github.com/go-gitea/gitea/pull/39263))
  - 加快测试，修复事务问题 ([#39030](https://github.com/go-gitea/gitea/pull/39030))
  - 在浏览器中运行前端单元测试 ([#38860](https://github.com/go-gitea/gitea/pull/38860))
  - 避免与 Redis SUBSCRIBE 确认发生竞态 ([#38661](https://github.com/go-gitea/gitea/pull/38661))
  - 增加 PR 合并框端到端测试，更新 AGENTS.md ([#38576](https://github.com/go-gitea/gitea/pull/38576))
  - 退出登录传播测试中确定性等待事件流 ([#38535](https://github.com/go-gitea/gitea/pull/38535))

- 构建
  - 修复与复合字面量相关的 `go vet` 错误 ([#39341](https://github.com/go-gitea/gitea/pull/39341))
  - 稳定发布禁用 gogit 构建 ([#39324](https://github.com/go-gitea/gitea/pull/39324))
  - 用自有代码替代 jquery.are-you-sure ([#39233](https://github.com/go-gitea/gitea/pull/39233))
  - 重构 HTTP 请求绑定 ([#38971](https://github.com/go-gitea/gitea/pull/38971))
  - 清理 Git 仓库和模型迁移包 ([#38564](https://github.com/go-gitea/gitea/pull/38564))
  - 准备解耦“模型迁移”包与“模型”包 ([#38533](https://github.com/go-gitea/gitea/pull/38533))
  - 修复 Snapcraft 发布 ([#38260](https://github.com/go-gitea/gitea/pull/38260))
  - 官方发布构建使用原生 Go 工具链 ([#37828](https://github.com/go-gitea/gitea/pull/37828))

- 文档
  - 修正文档：review.type 注释列出了 Webhook 从不发送的值 ([#39451](https://github.com/go-gitea/gitea/pull/39451))
  - 记录比较端点的 verification 和 files 字段 ([#39440](https://github.com/go-gitea/gitea/pull/39440))
  - 将未接管仓库的搜索参数命名为 query ([#39370](https://github.com/go-gitea/gitea/pull/39370))
  - 从 app.example.ini 移除未使用的 COOKIE_USERNAME ([#39365](https://github.com/go-gitea/gitea/pull/39365))
  - 为每个定时任务记录 NOTICE_ON_SUCCESS ([#39352](https://github.com/go-gitea/gitea/pull/39352))
  - 修正 app.example.ini 中 ALLOW_LOCALNETWORKS 描述 ([#39240](https://github.com/go-gitea/gitea/pull/39240))
  - 修复 README 中 app.ini 重启说明的拼写错误 ([#39223](https://github.com/go-gitea/gitea/pull/39223))
  - 修复 README 中失效的本地化文档链接 ([#39211](https://github.com/go-gitea/gitea/pull/39211))
  - 更新 1.27.3 发布的 CHANGELOG ([#39170](https://github.com/go-gitea/gitea/pull/39170))
  - 更新 1.27.2 的 CHANGELOG ([#38923](https://github.com/go-gitea/gitea/pull/38923))
  - 将 PGP 密钥到期日期更新为 2027 年 7 月 23 日 ([#38747](https://github.com/go-gitea/gitea/pull/38747))
  - 记录用户密钥端点的 401/403 响应 ([#38711](https://github.com/go-gitea/gitea/pull/38711))
  - 更新 v1.27.1 发布的更新日志 ([#38670](https://github.com/go-gitea/gitea/pull/38670))
  - 更新 1.27 更新日志 ([#38440](https://github.com/go-gitea/gitea/pull/38440))
  - 更新安全文档 ([#38422](https://github.com/go-gitea/gitea/pull/38422))

- 其他
  - 使 Git HTTP 响应错误消息 ([#39390](https://github.com/go-gitea/gitea/pull/39390))
  - 通过管理员用户编辑端点转换机器人账户 ([#39355](https://github.com/go-gitea/gitea/pull/39355))
  - CodeCommit 迁移用 REST 客户端替代 AWS SDK ([#39330](https://github.com/go-gitea/gitea/pull/39330))
  - 用 REST 客户端替代 Azure Blob SDK ([#39315](https://github.com/go-gitea/gitea/pull/39315))
  - 重构 npm 路由处理器 ([#39275](https://github.com/go-gitea/gitea/pull/39275))
  - 重构 GetDiffShortStat，修复“更改文件数量”不一致引发的 panic ([#39248](https://github.com/go-gitea/gitea/pull/39248))
  - 将 djlint 更新到 1.46.0，修复新发现的问题 ([#39231](https://github.com/go-gitea/gitea/pull/39231))
  - 重构分页和分页器 ([#39162](https://github.com/go-gitea/gitea/pull/39162))
  - 共享软件包注册表错误状态分类 ([#39133](https://github.com/go-gitea/gitea/pull/39133))
  - 移除两个无人维护的依赖，重命名字节大小辅助函数 ([#39083](https://github.com/go-gitea/gitea/pull/39083))
  - 修复自动合并错误处理，重启时填充近期自动合并任务 ([#39001](https://github.com/go-gitea/gitea/pull/39001))
  - 重构部署密钥和私有路由处理器 ([#38999](https://github.com/go-gitea/gitea/pull/38999))
  - 重构 Wiki 编辑表单 ([#38918](https://github.com/go-gitea/gitea/pull/38918))
  - 清理表单绑定和验证 ([#38873](https://github.com/go-gitea/gitea/pull/38873))
  - 重构标记文本渲染 ([#38864](https://github.com/go-gitea/gitea/pull/38864))
  - 重构 API 令牌权限范围检查 ([#38862](https://github.com/go-gitea/gitea/pull/38862))
  - 用 `golang.org/x/crypto/ssh` 替代 `gliderlabs/ssh` ([#38837](https://github.com/go-gitea/gitea/pull/38837))
  - 重构表单绑定验证 ([#38832](https://github.com/go-gitea/gitea/pull/38832))
  - 为 Vue 组件的 Vapor 模式做准备 ([#38798](https://github.com/go-gitea/gitea/pull/38798))
  - 使用 actionslib 中的共享工作流模型 ([#38768](https://github.com/go-gitea/gitea/pull/38768))
  - 在模型迁移函数间传递上下文 ([#38758](https://github.com/go-gitea/gitea/pull/38758))
  - 将剩余 Vue 组件迁移到 `<script setup>` ([#38752](https://github.com/go-gitea/gitea/pull/38752))
  - 为前端引入 trString ([#38741](https://github.com/go-gitea/gitea/pull/38741))
  - 通过全局选择器观察器驱动差异 DOM 初始化 ([#38740](https://github.com/go-gitea/gitea/pull/38740))
  - 明确 GetBranch 行为，使其仅获取已存在分支 ([#38662](https://github.com/go-gitea/gitea/pull/38662))
  - 用自有代码替代去抖/节流依赖 ([#38610](https://github.com/go-gitea/gitea/pull/38610))
  - 对更多包隐藏 Git 仓库路径细节 ([#38601](https://github.com/go-gitea/gitea/pull/38601))
  - 文件忙碌时重试删除/重命名，清理操作系统检测 ([#38588](https://github.com/go-gitea/gitea/pull/38588))
  - 使用基于切片的 Trie 优化 FindEmojiSubmatchIndex ([#38573](https://github.com/go-gitea/gitea/pull/38573))
  - 实现 mCaptcha 客户端，补充注释和测试 ([#38561](https://github.com/go-gitea/gitea/pull/38561))
  - 大多数 Git 操作使用 WithRepo 而非 WithDir，清理模型迁移 ([#38555](https://github.com/go-gitea/gitea/pull/38555))
  - 从 git.Repository 移除 Path 字段 ([#38552](https://github.com/go-gitea/gitea/pull/38552))
  - 使 git 包处理所有 Git 操作 ([#38543](https://github.com/go-gitea/gitea/pull/38543))
  - 移除不必要的 Git 命令包装函数 ([#38531](https://github.com/go-gitea/gitea/pull/38531))
  - 重构 Git 仓库和相对路径处理 ([#38522](https://github.com/go-gitea/gitea/pull/38522))
  - 清理脆弱的差异渲染模板，使用后端类型化结构 ([#38517](https://github.com/go-gitea/gitea/pull/38517))
  - 修正 Git 仓库设计，修复遗留问题 ([#38512](https://github.com/go-gitea/gitea/pull/38512))
  - 修复 cmd/serv.go 中的遗留问题 ([#38505](https://github.com/go-gitea/gitea/pull/38505))
  - 从 git.Repository 移除 Ctx 字段 ([#38500](https://github.com/go-gitea/gitea/pull/38500))
  - 解耦 git.Repository(ctx) 与 git.Commit、git.Tree ([#38464](https://github.com/go-gitea/gitea/pull/38464))
  - 引入 ActivePageTimer，协助局部页面刷新 ([#38372](https://github.com/go-gitea/gitea/pull/38372))

## 此版本的贡献者

感谢帮助此版本顺利发布的所有贡献者！

* [@80avin](https://github.com/80avin)
* [@afishcalledwander](https://github.com/afishcalledwander)
* [@agoudbg](https://github.com/agoudbg)
* [@anygotthat](https://github.com/anygotthat)
* [@Asthenia0412](https://github.com/Asthenia0412)
* [@atiqur-rahman-pro](https://github.com/atiqur-rahman-pro)
* [@bircni](https://github.com/bircni)
* [@breken-ai](https://github.com/breken-ai)
* [@CaeruleusAqua](https://github.com/CaeruleusAqua)
* [@davidpavlovschi](https://github.com/davidpavlovschi)
* [@drrakonov](https://github.com/drrakonov)
* [@eliroca](https://github.com/eliroca)
* [@EtherK3N](https://github.com/EtherK3N)
* [@facorazza](https://github.com/facorazza)
* [@gomitrah](https://github.com/gomitrah)
* [@grafail](https://github.com/grafail)
* [@GrigorTonikyan](https://github.com/GrigorTonikyan)
* [@HardMax71](https://github.com/HardMax71)
* [@Harsh-128](https://github.com/Harsh-128)
* [@Huang-404-Q](https://github.com/Huang-404-Q)
* [@joestump](https://github.com/joestump)
* [@karthikbhandary2](https://github.com/karthikbhandary2)
* [@loveulvu](https://github.com/loveulvu)
* [@lunny](https://github.com/lunny)
* [@majorissuerep](https://github.com/majorissuerep)
* [@McMichalK](https://github.com/McMichalK)
* [@mohammad-rj](https://github.com/mohammad-rj)
* [@MyleAtaraxia](https://github.com/MyleAtaraxia)
* [@n0liu](https://github.com/n0liu)
* [@Naxdy](https://github.com/Naxdy)
* [@Nitish-1303](https://github.com/Nitish-1303)
* [@oxsean](https://github.com/oxsean)
* [@paarth-k2002](https://github.com/paarth-k2002)
* [@pevadev](https://github.com/pevadev)
* [@philip-x-rutkowski-intel-com](https://github.com/philip-x-rutkowski-intel-com)
* [@r3wretrhy](https://github.com/r3wretrhy)
* [@rawsun007](https://github.com/rawsun007)
* [@rossigee](https://github.com/rossigee)
* [@rremer](https://github.com/rremer)
* [@s3onghyun](https://github.com/s3onghyun)
* [@schonwetter](https://github.com/schonwetter)
* [@SergioBenitez](https://github.com/SergioBenitez)
* [@silverwind](https://github.com/silverwind)
* [@somaz94](https://github.com/somaz94)
* [@SudhanshuMatrix](https://github.com/SudhanshuMatrix)
* [@TastyHeadphones](https://github.com/TastyHeadphones)
* [@TheFox0x7](https://github.com/TheFox0x7)
* [@ToastyTheBot](https://github.com/ToastyTheBot)
* [@viralpraxis](https://github.com/viralpraxis)
* [@vitaliytv](https://github.com/vitaliytv)
* [@waterWang](https://github.com/waterWang)
* [@willemkokke](https://github.com/willemkokke)
* [@wxiaoguang](https://github.com/wxiaoguang)
* [@YumeMichi](https://github.com/YumeMichi)
* [@Zettat123](https://github.com/Zettat123)
* [@ZPascal](https://github.com/ZPascal)
