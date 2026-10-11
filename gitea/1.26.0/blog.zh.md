---
title: Gitea 1.26.0 官方发布博客（中文）
description: Gitea 1.26.0 正式发布博客的完整简体中文翻译。
---

# Gitea 1.26.0 正式发布

作者：lunny、bircni · 博客发布日期（UTC）：2026-04-18

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-1.26.0/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/gitea/release-of-1.26.0.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 GitHub Release 日期分别保留。

我们很高兴地宣布 Gitea **v1.26.0** 正式发布。

Gitea 1.26.0 带来了新功能、性能优化和易用性改进。以下介绍 Gitea 1.26 的部分重要变化和功能；完整列表请参阅[完整发布说明](#changelog)。

衷心感谢通过提交代码补丁、报告问题、翻译以及其他方式支持项目的所有参与者。

## 安全 {#security}

此版本修复了多项重要安全漏洞：

- CVE-2026-28737：Gitea 3D 文件查看器的 glTF extensionsRequired 字段存在存储型 XSS。由 [#37233](https://github.com/go-gitea/gitea/pull/37233) 修复。感谢 [@yonatan-pl](https://github.com/yonatan-pl) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。

- CVE-2026-22555：API 派生流程缺少 CanCreateOrgRepo 检查，可能导致组织密钥外泄。由 [#36950](https://github.com/go-gitea/gitea/pull/36950) 修复。感谢 [@andrejtomci](https://github.com/andrejtomci) 报告问题，感谢 [@lunny](https://github.com/lunny) 提供补丁。

- CVE-2026-27780：pre-receive 钩子处理期间 bufio.Scanner 静默截断导致分支保护绕过。由 [#36963](https://github.com/go-gitea/gitea/pull/36963) 修复。感谢 [@yonatan-pl](https://github.com/yonatan-pl) 报告问题，感谢 [@lunny](https://github.com/lunny) 提供补丁。

- 限制 `ListUnadoptedRepositories` 的 `PageSize`，防止无限制 API 响应 ([#36884](https://github.com/go-gitea/gitea/pull/36884)).

## 如何更新

例如，可以从[下载页面](https://dl.gitea.com/gitea/1.26.0/)获取此版本。安装详情请阅读[安装指南](https://docs.gitea.com/1.26/category/installation)。升级时，请像往常一样先备份数据，然后替换二进制文件或 Docker 容器并重新启动。

## 特别致谢

感谢 [Open Collective](https://opencollective.com/gitea) 上为项目持续提供资金支持的所有支持者。

与往常一样，我们按对用户和管理员的重要性降序排列更改，将最重要的更改放在最前面。

> **正在寻找简单顺畅的 Git 仓库管理方案？欢迎了解 [Gitea Cloud](https://cloud.gitea.com)，改善你的开发体验。**

## 主要破坏性变更 {#major-breaking-changes}

### :warning: 引入 "config edit-ini" 子命令，方便维护 INI 配置文件 ([#35735](https://github.com/go-gitea/gitea/pull/35735))

独立的 environment-to-ini 工具已移除，改为 Gitea 子命令。如果需要仅用部分键重新创建配置文件，可以提供 INI 模板并使用 "--config-keep-keys" 标志。

### :warning: 修正枚举、状态码和通知状态的 Swagger 注解 ([#37030](https://github.com/go-gitea/gitea/pull/37030))

生成的 OpenAPI 描述现在与实际 API 一致，更准确地记录枚举值、HTTP 状态码和通知状态。如果依赖已发布的 Swagger 规范生成代码或执行契约测试，请重新生成客户端，并复查对可选字段或响应结构的假设。

感谢 **[@myers](https://github.com/myers)** 贡献此更改。

### :warning: 移除 GET registration-token API ([#36801](https://github.com/go-gitea/gitea/pull/36801))

用于获取注册令牌的 `GET` 端点已移除。仍调用该端点的自动化程序需要改用部署环境所支持的注册流程。

感谢 **[@lunny](https://github.com/lunny)** 贡献此更改。

### :warning: 支持 Actions `concurrency` 语法 ([#32751](https://github.com/go-gitea/gitea/pull/32751))

工作流现在可以使用 GitHub 风格的 `concurrency` 组，让新运行取消正在执行的作业，或相对于它们排队。这与之前版本的运行行为不同，因此升级后请检查现有工作流，尤其是耗时较长或存在重叠的流水线。

感谢 **[@Zettat123](https://github.com/Zettat123)** 贡献此功能。

### :warning: 将 `PUBLIC_URL_DETECTION` 默认值改为 `auto` ([#36955](https://github.com/go-gitea/gitea/pull/36955))

新安装默认自动检测公开 URL。如果反向代理或其他主机名场景依赖明确的 URL 配置，请在升级后确认 `[server]` 设置，确保链接、Webhook 和重定向仍适合当前环境。

感谢 **[@wxiaoguang](https://github.com/wxiaoguang)** 贡献此更改。

## 主要亮点（代码）

### :rocket: 为仓库文件和代码搜索增加键盘快捷键 ([#36416](https://github.com/go-gitea/gitea/pull/36416))

像其他 Git 托管服务的常用快捷键一样，通过键盘更快地浏览代码和搜索。

感谢 **[@micahkepe](https://github.com/micahkepe)** 贡献此功能。

### :rocket: 支持 archive-upload RPC ([#36391](https://github.com/go-gitea/gitea/pull/36391))

Gitea 现在支持对仓库 URL 使用 `git archive --remote`，客户端可以通过 Git 远程归档协议获取归档，而不再只能使用 HTTP 下载端点。

感谢 **[@TheFox0x7](https://github.com/TheFox0x7)** 贡献此功能。

### :rocket: 支持下载子路径归档 ([#36371](https://github.com/go-gitea/gitea/pull/36371))

可以下载仓库子目录的 ZIP 或 tarball，而非整个目录树，适合单体仓库和部分检出场景。

![下载仓库子路径归档](https://blog.gitea.com/demos/36371/1.png)

感谢 **[@TheFox0x7](https://github.com/TheFox0x7)** 贡献此功能。

### :rocket: 自动生成发布说明 ([#35977](https://github.com/go-gitea/gitea/pull/35977))

与 GitHub 类似，发布编辑器可以在服务端根据已合并 PR 和贡献者生成 Markdown 说明，减少发布版本时的手动编辑。

![发布编辑器中的自动发布说明](https://blog.gitea.com/demos/35977/1.png)

感谢 **[@dawidgora](https://github.com/dawidgora)** 贡献此功能。

### :rocket: 在仓库文件列表增加“转到文件”和“删除目录” ([#35911](https://github.com/go-gitea/gitea/pull/35911))

有权限时可以按名称直接跳转文件，或从浏览器删除整个目录，简化日常仓库维护。

<video src="https://blog.gitea.com/demos/35911/1.mp4" type="video/mp4" width="800" controls>浏览器不支持嵌入式视频</video>

感谢 **[@brymut](https://github.com/brymut)** 贡献此功能。

## 主要亮点（Actions）

### :rocket: 支持 Actions `concurrency` 语法 ([#32751](https://github.com/go-gitea/gitea/pull/32751))

工作流可以声明并发组，让新运行取消执行中的作业或排在它们之后，与 GitHub Actions 更接近。由于这改变了重叠运行的行为，请结合上文“主要破坏性变更”的迁移说明检查。

感谢 **[@Zettat123](https://github.com/Zettat123)** 贡献此功能。

### :rocket: 工作流依赖关系可视化与图表刷新 ([#26062](https://github.com/go-gitea/gitea/pull/26062)) ([#36248](https://github.com/go-gitea/gitea/pull/36248)) ([#36912](https://github.com/go-gitea/gitea/pull/36912))

运行视图可以展示作业间的依赖关系，工作流图样式也进行了调整，使复杂工作流更易理解。

![重新设计的工作流运行图及作业依赖](https://blog.gitea.com/demos/36912/1.png)

感谢 **[@xDarkmanx](https://github.com/xDarkmanx)** 和 **[@bircni](https://github.com/bircni)** 贡献这些改进。

### :rocket: 增加重新运行失败作业的按钮 ([#36924](https://github.com/go-gitea/gitea/pull/36924))

发生偶发失败或已通过其他方式修复问题时，只需重试失败作业，无需重新启动整个工作流。

![从 Actions 运行视图重新运行失败作业](https://blog.gitea.com/demos/36924/1.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 支持私有仓库中的 Action 和可复用工作流 ([#32562](https://github.com/go-gitea/gitea/pull/32562))

流水线可以引用有权访问的私有仓库中的 Action 和可复用工作流，满足其他平台上常见的 CI 模式。

感谢 **[@Zettat123](https://github.com/Zettat123)** 贡献此功能。

### :rocket: 可配置 Actions 自动令牌权限 ([#36173](https://github.com/go-gitea/gitea/pull/36173))

可以调整类似 `GITHUB_TOKEN` 的自动凭据所允许的操作，为实例或组织采用最小权限默认设置。

感谢 **[@Excellencedev](https://github.com/Excellencedev)** 贡献此功能。

### :rocket: 逐个禁用和暂停 Runner ([#36776](https://github.com/go-gitea/gitea/pull/36776))

管理员可以暂停或禁用单个 Runner 而不将其移除，方便维护或隔离异常主机。

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 非 ZIP 格式 Actions 产物 ([#36786](https://github.com/go-gitea/gitea/pull/36786))

在适合的情况下，产物上传和下载可避免 ZIP 包装（需更新 `actions` Runner 组件），方便下游作业或外部工具使用。

感谢 **[@ChristopherHX](https://github.com/ChristopherHX)** 贡献此功能。

### :rocket: Actions 运行视图中的总结 ([#36883](https://github.com/go-gitea/gitea/pull/36883))

运行总结在日志和作业状态旁展示关键结果信息，便于快速查看。

![Actions 工作流运行中的 Markdown 总结](https://blog.gitea.com/demos/36883/1.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

## 主要亮点（性能）

### :rocket: 重构 `cat-file` 批量操作 ([#35775](https://github.com/go-gitea/gitea/pull/35775))

Git 对象读取尽可能使用较新的 `--batch-command` 方式，减少需要访问大量对象的操作开销。

感谢 **[@wxiaoguang](https://github.com/wxiaoguang)** 贡献此改进。

### :rocket: 在可行时使用 merge tree 检测合并冲突 ([#36400](https://github.com/go-gitea/gitea/pull/36400))

Git 支持时，冲突检测可以借助 merge-tree 走更快的路径，加快繁忙实例上的 PR 和合并预览。

感谢 **[@lunny](https://github.com/lunny)** 贡献此改进。

## 主要亮点（管理）

### :rocket: 实例级信息横幅和维护模式 ([#36571](https://github.com/go-gitea/gitea/pull/36571))

向所有用户显示全局通知，并可在维护时按需引导流量，无需临时调整代理。

![实例级横幅和维护模式设置](https://blog.gitea.com/demos/36571/1.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 用户徽章 ([#36752](https://github.com/go-gitea/gitea/pull/36752))

个人资料可以显示徽章，方便团队快速识别角色、成就或内部称号。

![所有徽章列表](https://blog.gitea.com/demos/36752/1.png)
![拥有指定徽章的用户](https://blog.gitea.com/demos/36752/2.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

## 主要亮点（构建）

### :rocket: 从 Webpack 迁移到 Vite ([#37002](https://github.com/go-gitea/gitea/pull/37002))

前端工具链现在使用 Vite 构建，开发反馈更快，生产构建产物更精简。

感谢 **[@silverwind](https://github.com/silverwind)** 贡献此次迁移。

### :rocket: 用 CodeMirror 替代 Monaco ([#36764](https://github.com/go-gitea/gitea/pull/36764))

浏览器内编辑改用 CodeMirror，改善与其他界面及构建产物布局的一致性。

![CodeMirror 编辑器](https://blog.gitea.com/demos/36764/1.png)

感谢 **[@silverwind](https://github.com/silverwind)** 贡献此更改。

### :rocket: 用 `CrossOriginProtection` 替代 CSRF Cookie ([#36183](https://github.com/go-gitea/gitea/pull/36183))

跨站请求保护进行了更新：旧的 CSRF Cookie 机制改为 `CrossOriginProtection`，可能影响自定义反向代理或嵌入配置；手动调整 CORS 或 Cookie 的部署请参阅升级说明。

感谢 **[@silverwind](https://github.com/silverwind)** 贡献此更改。

## 主要亮点（其他）

### :rocket: Terraform 状态注册表 ([#36710](https://github.com/go-gitea/gitea/pull/36710))

可以在 Gitea 软件包注册表托管 Terraform 状态，团队使用与代码相同的访问控制协作管理基础设施。

感谢 **[@TheFox0x7](https://github.com/TheFox0x7)** 贡献此功能。

### :rocket: 在浏览器中渲染 OpenAPI 规范 ([#36449](https://github.com/go-gitea/gitea/pull/36449))

仓库中的 OpenAPI 文档可以直接在 Gitea 内渲染、阅读和探索。

感谢 **[@wxiaoguang](https://github.com/wxiaoguang)** 贡献此功能。

## 更新日志 {#changelog}

- 破坏性变更
  - 修正枚举、状态码和通知状态的 Swagger 注解 ([#37030](https://github.com/go-gitea/gitea/pull/37030))
  - 移除 GET registration-token API ([#36801](https://github.com/go-gitea/gitea/pull/36801))
  - 支持 Actions `concurrency` 语法 ([#32751](https://github.com/go-gitea/gitea/pull/32751))
  - 将 PUBLIC_URL_DETECTION 默认值改为 "auto" ([#36955](https://github.com/go-gitea/gitea/pull/36955))
- 安全
  - 限制 `ListUnadoptedRepositories` 的 PageSize ([#36884](https://github.com/go-gitea/gitea/pull/36884))
- 新功能
  - 支持 Actions `concurrency` 语法 ([#32751](https://github.com/go-gitea/gitea/pull/32751))
  - 增加 Terraform 状态注册表 ([#36710](https://github.com/go-gitea/gitea/pull/36710))
  - 实例级全局信息横幅和维护模式 ([#36571](https://github.com/go-gitea/gitea/pull/36571))
  - 支持渲染 OpenAPI 规范 ([#36449](https://github.com/go-gitea/gitea/pull/36449))
  - 为仓库文件和代码搜索增加键盘快捷键 ([#36416](https://github.com/go-gitea/gitea/pull/36416))
  - 支持 archive-upload RPC ([#36391](https://github.com/go-gitea/gitea/pull/36391))
  - 支持下载子路径归档 ([#36371](https://github.com/go-gitea/gitea/pull/36371))
  - 增加工作流依赖关系可视化，并重新设计工作流图样式 [#26062](https://github.com/go-gitea/gitea/pull/26062) [#36248](https://github.com/go-gitea/gitea/pull/36248)；重新设计工作流图样式 [#36912](https://github.com/go-gitea/gitea/pull/36912)
  - 自动生成发布说明 ([#35977](https://github.com/go-gitea/gitea/pull/35977))
  - 在仓库文件列表页增加“转到文件”和“删除目录” ([#35911](https://github.com/go-gitea/gitea/pull/35911))
  - 增加 "config edit-ini" 子命令，方便维护 INI 配置文件 ([#35735](https://github.com/go-gitea/gitea/pull/35735))
  - 在 Actions 中增加重新运行失败作业的按钮 ([#36924](https://github.com/go-gitea/gitea/pull/36924))
  - 支持来自私有仓库的 Action 和可复用工作流 ([#32562](https://github.com/go-gitea/gitea/pull/32562))
  - 在 Actions 运行视图增加总结 ([#36883](https://github.com/go-gitea/gitea/pull/36883))
  - 增加用户徽章 ([#36752](https://github.com/go-gitea/gitea/pull/36752))
  - 为 Actions 自动令牌增加可配置权限 ([#36173](https://github.com/go-gitea/gitea/pull/36173))
  - 允许逐个禁用或暂停 Runner ([#36776](https://github.com/go-gitea/gitea/pull/36776))
  - 支持不压缩为 ZIP 的 Actions 产物（action v7 / nodejs / npm v6.2.0） ([#36786](https://github.com/go-gitea/gitea/pull/36786))
- 性能
  - WorkflowDispatch API 可选择返回 runid ([#36706](https://github.com/go-gitea/gitea/pull/36706))
  - 为 SVG 图标增加渲染缓存 ([#36863](https://github.com/go-gitea/gitea/pull/36863))
  - 异步加载 `mentionValues` ([#36739](https://github.com/go-gitea/gitea/pull/36739))
  - 延迟加载部分 Vue 组件，避免每个页面都加载热力图片段 ([#36719](https://github.com/go-gitea/gitea/pull/36719))
  - 异步加载热力图数据 ([#36622](https://github.com/go-gitea/gitea/pull/36622))
  - 用户个人资料活动页改用上一页/下一页分页以提升速度 ([#36642](https://github.com/go-gitea/gitea/pull/36642))
  - 重构 cat-file 批量操作，支持 `--batch-command` 方式 ([#35775](https://github.com/go-gitea/gitea/pull/35775))
  - 在可行时使用 merge tree 检测冲突 ([#36400](https://github.com/go-gitea/gitea/pull/36400))
- 改进
  - 为反向代理认证配置实现退出登录重定向 ([#36085](https://github.com/go-gitea/gitea/pull/36085)) ([#37171](https://github.com/go-gitea/gitea/pull/37171))
  - 在 contents 路由中增加强制更新新分支的选项 ([#35592](https://github.com/go-gitea/gitea/pull/35592))
  - 为 Mermaid 增加查看控制器（缩放、拖动） ([#36557](https://github.com/go-gitea/gitea/pull/36557))
  - 增加代码编辑器设置下拉菜单 ([#36534](https://github.com/go-gitea/gitea/pull/36534))
  - 为 Mermaid 增加 `elk` 布局支持 ([#36486](https://github.com/go-gitea/gitea/pull/36486))
  - 增加解决/取消解决评审评论的 API 端点 ([#36441](https://github.com/go-gitea/gitea/pull/36441))
  - 允许配置默认 PR 基础分支（修复 [#36412](https://github.com/go-gitea/gitea/pull/36412)） ([#36425](https://github.com/go-gitea/gitea/pull/36425))
  - 支持 RPM Errata（updateinfo.xml） ([#37125](https://github.com/go-gitea/gitea/pull/37125))
  - 将仓库设为私有时要求用户额外确认 ([#36959](https://github.com/go-gitea/gitea/pull/36959))
  - 增加 `actions.WORKFLOW_DIRS` 设置 ([#36619](https://github.com/go-gitea/gitea/pull/36619))
  - 下载 Actions 日志时不再打开新标签页 ([#36740](https://github.com/go-gitea/gitea/pull/36740))
  - 实现 OIDC RP 发起的退出登录 ([#36724](https://github.com/go-gitea/gitea/pull/36724))
  - 显示工作流链接 ([#37070](https://github.com/go-gitea/gitea/pull/37070))
  - 降低深色主题背景颜色的饱和度 ([#37056](https://github.com/go-gitea/gitea/pull/37056))
  - 重构“组织团队”页面，帮助新用户向组织添加成员 ([#37051](https://github.com/go-gitea/gitea/pull/37051))
  - 增加 Webhook 名称字段，便于识别 Webhook ([#37025](https://github.com/go-gitea/gitea/pull/37025)) ([#37040](https://github.com/go-gitea/gitea/pull/37040))
  - 允许在预览标签页点击任务列表复选框 ([#37010](https://github.com/go-gitea/gitea/pull/37010))
  - 改进 Actions 日志严重程度标签并调整颜色 ([#36993](https://github.com/go-gitea/gitea/pull/36993))
  - 将 Actions 工作流日志中的 URL 转换为链接 ([#36986](https://github.com/go-gitea/gitea/pull/36986))
  - 允许选择复选框标签中的文本 ([#36970](https://github.com/go-gitea/gitea/pull/36970))
  - 支持 Markdown 中的深色/浅色主题图片 ([#36922](https://github.com/go-gitea/gitea/pull/36922))
  - 为 swagger-ui 启用原生深色模式 ([#36899](https://github.com/go-gitea/gitea/pull/36899))
  - 重写复选框样式，移除 `input` 边框悬停效果 ([#36870](https://github.com/go-gitea/gitea/pull/36870))
  - 重构 ServeDirectURL 的存储 content-type 处理 ([#36804](https://github.com/go-gitea/gitea/pull/36804))
  - 改用“启用 Gravatar”，不再使用“禁用”表述 ([#36771](https://github.com/go-gitea/gitea/pull/36771))
  - 匹配 Git 错误 "Not a valid object name" 时忽略大小写 ([#36728](https://github.com/go-gitea/gitea/pull/36728))
  - 在标记文本评论菜单中增加“复制源文” ([#36726](https://github.com/go-gitea/gitea/pull/36726))
  - 使用 CSS 实现图片透明度网格 ([#36711](https://github.com/go-gitea/gitea/pull/36711))
  - 为未命名的 Action 步骤增加 "Run" 前缀 ([#36624](https://github.com/go-gitea/gitea/pull/36624))
  - 在 `localStorage` 中持久保存 Actions 日志时间显示设置 ([#36623](https://github.com/go-gitea/gitea/pull/36623))
  - 多提交 PR 使用首个提交的标题，并修复标题字段自动聚焦 ([#36606](https://github.com/go-gitea/gitea/pull/36606))
  - 使用小写改进 BuildCaseInsensitiveLike ([#36598](https://github.com/go-gitea/gitea/pull/36598))
  - 改进差异高亮 ([#36583](https://github.com/go-gitea/gitea/pull/36583))
  - 仅失败时发送邮件通知时排除已取消的运行 ([#36569](https://github.com/go-gitea/gitea/pull/36569))
  - 对差异区段使用完整文件高亮 ([#36561](https://github.com/go-gitea/gitea/pull/36561))
  - 为 Actions 日志中的命令和错误着色 ([#36538](https://github.com/go-gitea/gitea/pull/36538))
  - 增加分页响应头 ([#36521](https://github.com/go-gitea/gitea/pull/36521))
  - 改进 PR 中 WIP 前缀变化的时间线条目 ([#36518](https://github.com/go-gitea/gitea/pull/36518))
  - 增加 FOLDER_ICON_THEME 配置选项 ([#36496](https://github.com/go-gitea/gitea/pull/36496))
  - 规范化代码高亮推测出的语言 ([#36450](https://github.com/go-gitea/gitea/pull/36450))
  - 支持 LFS 上传的分块传输编码 ([#36380](https://github.com/go-gitea/gitea/pull/36380))
  - 标明仅可选检查失败的情况 ([#36367](https://github.com/go-gitea/gitea/pull/36367))
  - 为创建 PR 增加 'allow_maintainer_edit' API 选项 ([#36283](https://github.com/go-gitea/gitea/pull/36283))
  - 支持使用 URL 引用的关闭关键词 ([#36221](https://github.com/go-gitea/gitea/pull/36221))
  - 改进差异文件标题 ([#36215](https://github.com/go-gitea/gitea/pull/36215))
  - 修复并增强评论编辑器的等宽字体切换 ([#36181](https://github.com/go-gitea/gitea/pull/36181))
  - 增加 git.DIFF_RENAME_SIMILARITY_THRESHOLD 选项 ([#36164](https://github.com/go-gitea/gitea/pull/36164))
  - 为 Markdown 文本框增加配对字符插入 ([#36121](https://github.com/go-gitea/gitea/pull/36121))
  - 为管理员用户搜索 API 端点增加排序和筛选 ([#36112](https://github.com/go-gitea/gitea/pull/36112))
  - 允许 Action 用户像其他用户一样读取公开仓库 ([#36095](https://github.com/go-gitea/gitea/pull/36095))
  - 在 Monaco 中禁用 matchBrackets ([#36089](https://github.com/go-gitea/gitea/pull/36089))
  - 压缩合并使用 GitHub 风格提交消息 ([#35987](https://github.com/go-gitea/gitea/pull/35987))
  - Composer 注册表支持 tar.gz 和 tar.bz2，并修复问题 ([#35958](https://github.com/go-gitea/gitea/pull/35958))
  - 为 Git 钩子增加 GITEA_PR_INDEX 环境变量 ([#35938](https://github.com/go-gitea/gitea/pull/35938))
  - 无法创建会话提供程序时提供正确错误消息 ([#35520](https://github.com/go-gitea/gitea/pull/35520))
  - 增加复制 PR 文件名的按钮 ([#35509](https://github.com/go-gitea/gitea/pull/35509))
  - 将 `X_FRAME_OPTIONS` 设置从 `cors` 节移至 `security` 节 ([#30256](https://github.com/go-gitea/gitea/pull/30256))
  - 为空内容页面增加占位内容 ([#37114](https://github.com/go-gitea/gitea/pull/37114))
  - 增加 `DEFAULT_DELETE_BRANCH_AFTER_MERGE` 设置 ([#36917](https://github.com/go-gitea/gitea/pull/36917))
  - 没有其他登录方法时重定向到唯一 OAuth2 提供程序，并修复相关问题 ([#36901](https://github.com/go-gitea/gitea/pull/36901))
  - 在导航栏头像上增加管理员徽章 ([#36790](https://github.com/go-gitea/gitea/pull/36790))
  - 为 `PUBLIC_URL_DETECTION` 配置增加 `never` 选项 ([#36785](https://github.com/go-gitea/gitea/pull/36785))
  - 为 Actions 列表页增加背景和运行次数 ([#36707](https://github.com/go-gitea/gitea/pull/36707))
  - 为“评论并关闭”“关闭 PR”“关闭 Issue”按钮增加图标 ([#36654](https://github.com/go-gitea/gitea/pull/36654))
  - 支持 workflow_run Webhook 中的 in_progress 事件 ([#36979](https://github.com/go-gitea/gitea/pull/36979))
  - 为 pull_request_review 事件报告提交状态 ([#36589](https://github.com/go-gitea/gitea/pull/36589))
  - 在仪表盘动态中将已合并 PR 的标题显示为已合并状态 ([#36479](https://github.com/go-gitea/gitea/pull/36479))
  - 支持按里程碑筛选项目看板 ([#36321](https://github.com/go-gitea/gitea/pull/36321))
  - 在 noreply 邮箱中使用用户 ID ([#36550](https://github.com/go-gitea/gitea/pull/36550))
  - 为 GiteaDownloader.getIssueReactions() 启用分页 ([#36549](https://github.com/go-gitea/gitea/pull/36549))
  - 移除界面中的条纹表格 ([#36509](https://github.com/go-gitea/gitea/pull/36509))
  - 改进控制字符渲染及转义按钮样式 ([#37094](https://github.com/go-gitea/gitea/pull/37094))
  - 支持旧的基于运行/作业索引的 URL，并重构迁移 326 ([#37008](https://github.com/go-gitea/gitea/pull/37008))
  - 在“没有贡献”提示中增加日期 ([#36190](https://github.com/go-gitea/gitea/pull/36190))
  - 树状视图切换文件时显示编辑页面确认对话框 ([#36130](https://github.com/go-gitea/gitea/pull/36130))
  - 在 dashboard.resync_all_hooks 函数的说明中提及 proc-receive ([#35991](https://github.com/go-gitea/gitea/pull/35991))
  - Wiki 复用可选择样式 ([#35990](https://github.com/go-gitea/gitea/pull/35990))
  - 支持蓝黄色盲主题 ([#35910](https://github.com/go-gitea/gitea/pull/35910))
  - 支持在页脚选择主题 ([#35741](https://github.com/go-gitea/gitea/pull/35741))
  - 改进 Runner 在线检查 ([#35722](https://github.com/go-gitea/gitea/pull/35722))
  - 在 PR 页增加快速批准按钮 ([#35678](https://github.com/go-gitea/gitea/pull/35678))
  - 允许在 PR 差异展开行中发表评论 ([#35662](https://github.com/go-gitea/gitea/pull/35662))
  - 在 Actions 的提示中显示 PR 标题 ([#35579](https://github.com/go-gitea/gitea/pull/35579))
  - 为 Debian 新生成的仓库签名密钥使用明确且更强的默认参数 ([#36236](https://github.com/go-gitea/gitea/pull/36236))
  - 改进比较页面 ([#36261](https://github.com/go-gitea/gitea/pull/36261))
  - 统一系统通知中的仓库名称 ([#36491](https://github.com/go-gitea/gitea/pull/36491))
  - 将软件包设置从版本级移至软件包级 ([#37026](https://github.com/go-gitea/gitea/pull/37026))
  - 为 Actions 运行和作业增加重新运行 API 端点 ([#36768](https://github.com/go-gitea/gitea/pull/36768))
  - 为仓库 API 增加 branch_count ([#35351](https://github.com/go-gitea/gitea/pull/35351)) ([#36743](https://github.com/go-gitea/gitea/pull/36743))
  - 为 SearchIssues 增加 created_by 筛选 ([#36670](https://github.com/go-gitea/gitea/pull/36670))
  - 允许管理员重命名非本地用户 ([#35970](https://github.com/go-gitea/gitea/pull/35970))
  - 支持通过 API 更新分支 ([#35951](https://github.com/go-gitea/gitea/pull/35951))
  - 增加从 LDAP 自动验证 SSH 密钥的选项 ([#35927](https://github.com/go-gitea/gitea/pull/35927))
  - 未设置 SHA 时，“更新文件”API 可以创建新文件 ([#35738](https://github.com/go-gitea/gitea/pull/35738))
  - 在 issue.go 中补充标签文档（使用标签内容而非 ID） ([#35522](https://github.com/go-gitea/gitea/pull/35522))
  - 公开 content_version，为 Issue 和 PR 编辑提供乐观锁 ([#37035](https://github.com/go-gitea/gitea/pull/37035))
  - 按值而非指针传递 ServeHeaderOptions，调整 httplib 测试 ([#36982](https://github.com/go-gitea/gitea/pull/36982))
- 问题修复
  - 前端 iframe 渲染器框架：3D 模型、OpenAPI ([#37233](https://github.com/go-gitea/gitea/pull/37233)) ([#37273](https://github.com/go-gitea/gitea/pull/37273))
  - 修复 CODEOWNERS 绝对路径匹配。 ([#37244](https://github.com/go-gitea/gitea/pull/37244)) ([#37264](https://github.com/go-gitea/gitea/pull/37264))
  - Swift 注册表元数据：保留更多 JSON 字段并接受空元数据 ([#37254](https://github.com/go-gitea/gitea/pull/37254)) ([#37261](https://github.com/go-gitea/gitea/pull/37261))
  - 修复用户 SSH 密钥导出及测试 ([#37256](https://github.com/go-gitea/gitea/pull/37256)) ([#37258](https://github.com/go-gitea/gitea/pull/37258))
  - 修复团队成员头像大小并增加提示 ([#37253](https://github.com/go-gitea/gitea/pull/37253))
  - 修复 Action 运行及 blame 中的提交标题渲染 ([#37243](https://github.com/go-gitea/gitea/pull/37243)) ([#37251](https://github.com/go-gitea/gitea/pull/37251))
  - 修复 goccy 库造成的 JSON 损坏 ([#37214](https://github.com/go-gitea/gitea/pull/37214)) ([#37220](https://github.com/go-gitea/gitea/pull/37220))
  - 增加“获取重定向”测试，为外部渲染增加 CSS 值验证 ([#37207](https://github.com/go-gitea/gitea/pull/37207)) ([#37216](https://github.com/go-gitea/gitea/pull/37216))
  - 修复错误的并发检查 ([#37205](https://github.com/go-gitea/gitea/pull/37205)) ([#37215](https://github.com/go-gitea/gitea/pull/37215))
  - 修复 PR 提交 API 中基础分支缺失的处理 ([#37193](https://github.com/go-gitea/gitea/pull/37193)) ([#37203](https://github.com/go-gitea/gitea/pull/37203))
  - 修复 Matrix Webhook 编码 ([#37190](https://github.com/go-gitea/gitea/pull/37190)) ([#37201](https://github.com/go-gitea/gitea/pull/37201))
  - 修复比较 API 中仅存在于派生仓库的提交处理 ([#37185](https://github.com/go-gitea/gitea/pull/37185)) ([#37199](https://github.com/go-gitea/gitea/pull/37199))
  - 通过背景标明表单字段只读状态，修复 RunUser 配置 ([#37175](https://github.com/go-gitea/gitea/pull/37175), [#37180](https://github.com/go-gitea/gitea/pull/37180)) ([#37178](https://github.com/go-gitea/gitea/pull/37178))
  - 向用户报告结构无效的工作流 ([#37116](https://github.com/go-gitea/gitea/pull/37116)) ([#37164](https://github.com/go-gitea/gitea/pull/37164))
  - 修复未设置 has_pull_requests 时 API 不保存 PR 单元配置的问题 ([#36718](https://github.com/go-gitea/gitea/pull/36718))
  - 重命名 CSS 变量并改进色盲主题 ([#36353](https://github.com/go-gitea/gitea/pull/36353))
  - 在 Actions 作业日志中隐藏 `add-matcher` 和 `remove-matcher` ([#36520](https://github.com/go-gitea/gitea/pull/36520))
  - 防止输入法组合输入期间导航键触发操作 ([#36540](https://github.com/go-gitea/gitea/pull/36540))
  - 修复 `.commit-sign-badge` 子元素的垂直对齐 ([#36570](https://github.com/go-gitea/gitea/pull/36570))
  - 修复管理面板中的重复启动警告 ([#36641](https://github.com/go-gitea/gitea/pull/36641))
  - 使用评论元数据修复 CODEOWNERS 评审请求归属 ([#36348](https://github.com/go-gitea/gitea/pull/36348))
  - 修复 Wiki 目录中出现 HTML 标签的问题 ([#36284](https://github.com/go-gitea/gitea/pull/36284))
  - 修复多项问题 ([#37096](https://github.com/go-gitea/gitea/pull/37096))
  - 修复多项遗留问题 ([#37092](https://github.com/go-gitea/gitea/pull/37092))
  - 修复软件包名称包含 'package' 时 RPM 注册表返回 404 的问题 ([#37087](https://github.com/go-gitea/gitea/pull/37087))
  - 将部分独立 Vite 入口合并至 index.js ([#37085](https://github.com/go-gitea/gitea/pull/37085))
  - 修复多项问题 ([#37077](https://github.com/go-gitea/gitea/pull/37077))
  - 修复使用 Actions 令牌删除 Issue 标签的问题 ([#37013](https://github.com/go-gitea/gitea/pull/37013))
  - 在镜像或归档仓库中隐藏删除分支或标签的按钮。 ([#37006](https://github.com/go-gitea/gitea/pull/37006))
  - 修复组织联系邮箱设置后无法清空的问题 ([#36975](https://github.com/go-gitea/gitea/pull/36975))
  - 修复在组织中派生仓库时的问题 ([#36950](https://github.com/go-gitea/gitea/pull/36950))
  - 保留模板仓库中互斥标签的排序 ([#36931](https://github.com/go-gitea/gitea/pull/36931))
  - 容器注册表支持 Apple Container（基本认证） ([#36920](https://github.com/go-gitea/gitea/pull/36920))
  - 修复强制推送后 PR 中显示错误推送提交的问题 ([#36914](https://github.com/go-gitea/gitea/pull/36914))
  - 为项目的 div 增加 "list-header-filters" 类 ([#36889](https://github.com/go-gitea/gitea/pull/36889))
  - 修复 dbfs 错误处理 ([#36844](https://github.com/go-gitea/gitea/pull/36844))
  - 修复已查看的更改被还原后，已查看文件计数错误的问题 ([#36819](https://github.com/go-gitea/gitea/pull/36819))
  - 重构头像包，支持默认头像回退 ([#36788](https://github.com/go-gitea/gitea/pull/36788))
  - 修复 .github 等子目录中的 README 符号链接解析 ([#36775](https://github.com/go-gitea/gitea/pull/36775))
  - 修复 Actions 日志中的 CSS 层叠上下文问题 ([#36749](https://github.com/go-gitea/gitea/pull/36749))
  - 为 merge rebase 和 update by rebase 增加 GPG 签名 ([#36701](https://github.com/go-gitea/gitea/pull/36701))
  - 删除不存在的分支应返回 404 ([#36694](https://github.com/go-gitea/gitea/pull/36694))
  - 修复 `TestActionsCollaborativeOwner` ([#36657](https://github.com/go-gitea/gitea/pull/36657))
  - 拆分前端阶段，修复多架构 Docker 构建中的 SIGILL ([#36646](https://github.com/go-gitea/gitea/pull/36646))
  - 修复配置文件的 linguist-detectable 属性被忽略的问题 ([#36640](https://github.com/go-gitea/gitea/pull/36640))
  - 修复 ComboMarkdownEditor 状态不同步 ([#36625](https://github.com/go-gitea/gitea/pull/36625))
  - 统一模板和下拉菜单中的 DEFAULT_SHOW_FULL_NAME 输出 ([#36597](https://github.com/go-gitea/gitea/pull/36597))
  - PR 推送者应为合并作者 ([#36581](https://github.com/go-gitea/gitea/pull/36581))
  - 修复多种版本解析问题 ([#36553](https://github.com/go-gitea/gitea/pull/36553))
  - 修复差异高亮结果 ([#36539](https://github.com/go-gitea/gitea/pull/36539))
  - 修复镜像同步解析器和镜像消息 ([#36504](https://github.com/go-gitea/gitea/pull/36504))
  - 修复列出 PR 提交时的问题 ([#36485](https://github.com/go-gitea/gitea/pull/36485))
  - 修复多项问题 ([#36446](https://github.com/go-gitea/gitea/pull/36446))
  - 修复 Issue 筛选菜单布局 ([#36426](https://github.com/go-gitea/gitea/pull/36426))
  - 新更改匹配保护规则时限制分支命名 ([#36405](https://github.com/go-gitea/gitea/pull/36405))
  - 修复链接/来源 referrer 和登录重定向 ([#36279](https://github.com/go-gitea/gitea/pull/36279))
  - 为缺少 id 属性的 HTML 标题生成 ID ([#36233](https://github.com/go-gitea/gitea/pull/36233))
  - 用迁移测试替代错误填充元测试仓库的测试，并修复迁移问题 ([#36160](https://github.com/go-gitea/gitea/pull/36160))
  - 修复 Issue 关闭时间线图标 ([#36138](https://github.com/go-gitea/gitea/pull/36138))
  - 修复差异 blob 摘录展开 ([#35922](https://github.com/go-gitea/gitea/pull/35922))
  - 修复外部渲染 ([#35727](https://github.com/go-gitea/gitea/pull/35727))
  - 修复评审请求 Webhook 问题 ([#35339](https://github.com/go-gitea/gitea/pull/35339)) ([#35723](https://github.com/go-gitea/gitea/pull/35723))
  - 修复关闭过程中的 waitgroup panic ([#35676](https://github.com/go-gitea/gitea/pull/35676))
  - 清理 ActionRun 创建逻辑 ([#35624](https://github.com/go-gitea/gitea/pull/35624))
  - 修复迁移 Issue/PR 时可能出现的问题 ([#33487](https://github.com/go-gitea/gitea/pull/33487))
  - 多项修复 ([#36697](https://github.com/go-gitea/gitea/pull/36697))
  - 安装加载时应用通知/注册邮件标志 ([#37120](https://github.com/go-gitea/gitea/pull/37120))
  - 修复停止时间戳异常时的时长显示 ([#37121](https://github.com/go-gitea/gitea/pull/37121))
  - 修复 upgrade.sh：使用 HTTPS 导入 GPG 密钥，升级后恢复 SELinux 上下文 ([#36930](https://github.com/go-gitea/gitea/pull/36930))
  - 修复多项细节问题 ([#36921](https://github.com/go-gitea/gitea/pull/36921))
  - 修复多项细节问题 ([#36953](https://github.com/go-gitea/gitea/pull/36953))
  - 修复 NuGet 软件包上传错误处理 ([#37074](https://github.com/go-gitea/gitea/pull/37074))
  - 修复 CodeQL 代码扫描告警 ([#36858](https://github.com/go-gitea/gitea/pull/36858))
  - 重构 Issue 侧边栏并修复多项问题 ([#37045](https://github.com/go-gitea/gitea/pull/37045))
  - 修复多项问题 ([#37029](https://github.com/go-gitea/gitea/pull/37029))
  - 修复 relative-time 的 RangeError ([#37021](https://github.com/go-gitea/gitea/pull/37021))
  - 修复 Chroma 词法分析器映射 ([#36629](https://github.com/go-gitea/gitea/pull/36629))
  - 修复英语语言文件中的拼写和语法 ([#36751](https://github.com/go-gitea/gitea/pull/36751))
  - 修复 Issue 侧边栏中的里程碑/项目文本溢出 ([#36741](https://github.com/go-gitea/gitea/pull/36741))
  - 修复评论编辑后不显示 `no-content` 消息的问题 ([#36733](https://github.com/go-gitea/gitea/pull/36733))
  - 修复开发环境中的主题加载 ([#36605](https://github.com/go-gitea/gitea/pull/36605))
  - 修复工作流运行作业 API 返回 null 步骤的问题 ([#36603](https://github.com/go-gitea/gitea/pull/36603))
  - 修复时间线事件内容过长时布局溢出 ([#36595](https://github.com/go-gitea/gitea/pull/36595))
  - 修复 Runner 编辑页的小型界面问题 ([#36590](https://github.com/go-gitea/gitea/pull/36590))
  - 修复错误的 vendored 检测 ([#36508](https://github.com/go-gitea/gitea/pull/36508))
  - 修复 PR 对话视图不遵循 editorconfig 的问题 ([#36492](https://github.com/go-gitea/gitea/pull/36492))
  - 不在已合并 PR 中创建自引用 ([#36490](https://github.com/go-gitea/gitea/pull/36490))
  - 修复运行状态更新中可能错误的 runID ([#36437](https://github.com/go-gitea/gitea/pull/36437))
  - 修复向没有提交的仓库添加文件时文件树界面报错 ([#36312](https://github.com/go-gitea/gitea/pull/36312))
  - 改进深色模式下图片验证码对比度 ([#36265](https://github.com/go-gitea/gitea/pull/36265))
  - 修复文件只有一个提交时 blame 视图出现 panic 的问题 ([#36230](https://github.com/go-gitea/gitea/pull/36230))
  - 修复 migrate-storage 命令工具中的拼写错误 ([#36226](https://github.com/go-gitea/gitea/pull/36226))
  - 修复 blame 页面代码高亮 ([#36157](https://github.com/go-gitea/gitea/pull/36157))
  - 修复 OneDev 下载器中的 nilnil 问题 ([#36154](https://github.com/go-gitea/gitea/pull/36154))
  - 修复 Actions lint ([#36029](https://github.com/go-gitea/gitea/pull/36029))
  - 修复 OAuth2 会话 gob 注册 ([#36017](https://github.com/go-gitea/gitea/pull/36017))
  - 修复 Arch 仓库 pacman.conf 片段 ([#35825](https://github.com/go-gitea/gitea/pull/35825))
  - 修复多个与 `strictNullChecks` 有关的问题 ([#35795](https://github.com/go-gitea/gitea/pull/35795))
  - 修复 URLJoin、标记渲染链接解析及登录/注册/关联账户页面公共数据 ([#36861](https://github.com/go-gitea/gitea/pull/36861))
  - 镜像或归档仓库隐藏删除目录按钮，用户无权限时禁用对应菜单项 ([#36384](https://github.com/go-gitea/gitea/pull/36384))
  - 更新消息严重程度颜色，修复导航栏双边框 ([#37019](https://github.com/go-gitea/gitea/pull/37019))
  - 内联并延迟加载 EasyMDE CSS，修复边框颜色 ([#36714](https://github.com/go-gitea/gitea/pull/36714))
  - 已关闭且没有 Issue 的里程碑显示为 100% 完成 ([#36220](https://github.com/go-gitea/gitea/pull/36220))
  - 增加 ExtendCommentTreePathLength 迁移测试并修复问题 ([#35791](https://github.com/go-gitea/gitea/pull/35791))
  - 仅将指向当前实例的链接转换为片段链接 ([#36237](https://github.com/go-gitea/gitea/pull/36237))
  - 修复代码注释中的 doesnt、dont、wont 拼写 ([#36890](https://github.com/go-gitea/gitea/pull/36890))
- 重构
  - 清理并改进非 Gitea JavaScript 错误筛选器 ([#37148](https://github.com/go-gitea/gitea/pull/37148)) ([#37155](https://github.com/go-gitea/gitea/pull/37155))
  - 比较页下拉菜单始终显示所有者/仓库名称 ([#37172](https://github.com/go-gitea/gitea/pull/37172)) ([#37200](https://github.com/go-gitea/gitea/pull/37200))
  - 移除无效 CSS 规则 ([#37173](https://github.com/go-gitea/gitea/pull/37173)) ([#37177](https://github.com/go-gitea/gitea/pull/37177))
  - 用 CodeMirror 替代 Monaco ([#36764](https://github.com/go-gitea/gitea/pull/36764))
  - 用 `CrossOriginProtection` 替代 CSRF Cookie ([#36183](https://github.com/go-gitea/gitea/pull/36183))
  - Actions 路由用 ID 替代索引 ([#36842](https://github.com/go-gitea/gitea/pull/36842))
  - 移除不必要的函数参数 ([#35765](https://github.com/go-gitea/gitea/pull/35765))
  - 将 jobparser 从 act 仓库移至 Gitea ([#36699](https://github.com/go-gitea/gitea/pull/36699))
  - 重构比较路由参数解析 ([#36105](https://github.com/go-gitea/gitea/pull/36105))
  - 优化 'refreshAccesses'，直接更新而非先删后加 ([#35702](https://github.com/go-gitea/gitea/pull/35702))
  - 清理复选框光标样式 ([#37016](https://github.com/go-gitea/gitea/pull/37016))
  - 移除未记录的在仓库 Git 配置文件中设置签名密钥的支持 ([#36143](https://github.com/go-gitea/gitea/pull/36143))
  - 将 `cmd/` 改为使用构造函数。 ([#36962](https://github.com/go-gitea/gitea/pull/36962))
  - 使用 `relative-time` 渲染绝对日期 ([#36238](https://github.com/go-gitea/gitea/pull/36238))
  - 重构 GetMergeBase 相关逻辑 ([#36186](https://github.com/go-gitea/gitea/pull/36186))
  - 一些小型重构 ([#36163](https://github.com/go-gitea/gitea/pull/36163))
  - 调用签名函数时使用 gitRepo 参数而非 repopath ([#36162](https://github.com/go-gitea/gitea/pull/36162))
  - 将 blame 移至 gitrepo ([#36161](https://github.com/go-gitea/gitea/pull/36161))
  - 将部分函数移至 gitrepo 包，减少直接引用 RepoPath ([#36126](https://github.com/go-gitea/gitea/pull/36126))
  - 尽可能使用 gitrepo 的克隆和推送功能 ([#36093](https://github.com/go-gitea/gitea/pull/36093))
  - 移除 Mermaid 外边距临时处理 ([#35732](https://github.com/go-gitea/gitea/pull/35732))
  - 将部分函数移至 gitrepo 包 ([#35543](https://github.com/go-gitea/gitea/pull/35543))
  - 将 GetDiverging 函数移至 gitrepo ([#35524](https://github.com/go-gitea/gitea/pull/35524))
  - 定时任务锁使用全局锁而非状态池 ([#35507](https://github.com/go-gitea/gitea/pull/35507))
  - 使用显式 mux 而非 DefaultServeMux ([#36276](https://github.com/go-gitea/gitea/pull/36276))
  - 使用 gitrepo 的推送函数 ([#36245](https://github.com/go-gitea/gitea/pull/36245))
  - 将请求上下文传递给 generateAdditionalHeadersForIssue ([#36274](https://github.com/go-gitea/gitea/pull/36274))
  - 创建 PR 时将项目分配放入同一数据库事务 ([#36244](https://github.com/go-gitea/gitea/pull/36244))
  - 将 catfile batch 移至 git 模块子包 ([#36232](https://github.com/go-gitea/gitea/pull/36232))
  - 使用 gitrepo.Repository 替代 wikipath ([#35398](https://github.com/go-gitea/gitea/pull/35398))
  - 使用实验性的 Go JSON v2 库 ([#35392](https://github.com/go-gitea/gitea/pull/35392))
  - 重构模板渲染 ([#36438](https://github.com/go-gitea/gitea/pull/36438))
  - 重构 GetRepoRawDiffForFile，避免不必要的管道或 goroutine ([#36434](https://github.com/go-gitea/gitea/pull/36434))
  - 将文本工具类重构为 Tailwind CSS ([#36703](https://github.com/go-gitea/gitea/pull/36703))
  - 重构 Git 命令标准输入输出管道 ([#36422](https://github.com/go-gitea/gitea/pull/36422))
  - 重构 Git 命令上下文和流水线 ([#36406](https://github.com/go-gitea/gitea/pull/36406))
  - 重构 Git 命令标准输入输出管道 ([#36393](https://github.com/go-gitea/gitea/pull/36393))
  - 移除未使用函数 ([#36672](https://github.com/go-gitea/gitea/pull/36672))
  - 重构 Actions 令牌访问 ([#35688](https://github.com/go-gitea/gitea/pull/35688))
  - 将提交相关函数移至 gitrepo 包 ([#35600](https://github.com/go-gitea/gitea/pull/35600))
  - 将归档函数移至 repo_model 和 gitrepo ([#35514](https://github.com/go-gitea/gitea/pull/35514))
  - 将部分函数移至 gitrepo 包 ([#35503](https://github.com/go-gitea/gitea/pull/35503))
  - 使用 Git 模型检测分支是否存在，替代 gitrepo 方法 ([#35459](https://github.com/go-gitea/gitea/pull/35459))
  - 重构仓库路径相关逻辑 ([#36251](https://github.com/go-gitea/gitea/pull/36251))
  - 从 SearchIssues 提取辅助函数 ([#36158](https://github.com/go-gitea/gitea/pull/36158))
  - 重构 Conan 和容器认证合并逻辑，保留 Actions taskID ([#36560](https://github.com/go-gitea/gitea/pull/36560))
  - 重构 NuGet 认证以复用基本认证令牌验证 ([#36558](https://github.com/go-gitea/gitea/pull/36558))
  - 重构 ActionsTaskID ([#36503](https://github.com/go-gitea/gitea/pull/36503))
  - 重构认证中间件 ([#36848](https://github.com/go-gitea/gitea/pull/36848))
  - 重构代码渲染和控制字符渲染 ([#37078](https://github.com/go-gitea/gitea/pull/37078))
  - 清理 AppURL，移除旧的 origin-url Web 组件 ([#37090](https://github.com/go-gitea/gitea/pull/37090))
  - 移除 `util.URLJoin`，所有调用处改为直接拼接路径 ([#36867](https://github.com/go-gitea/gitea/pull/36867))
  - 用 flex-text-block/inline 替代旧的 tw-flex 工具类 ([#36778](https://github.com/go-gitea/gitea/pull/36778))
  - 将未使用且尚不成熟的 ActivityPub 标记为“未实现” ([#36789](https://github.com/go-gitea/gitea/pull/36789))
- 测试
  - 为服务端推送事件增加端到端测试 ([#36879](https://github.com/go-gitea/gitea/pull/36879))
  - 重写端到端测试 ([#36634](https://github.com/go-gitea/gitea/pull/36634))
  - 增加端到端回应测试，改进无障碍支持，启用并行测试 ([#37081](https://github.com/go-gitea/gitea/pull/37081))
  - 增加 CI 中端到端测试超时，修复不稳定测试 ([#37053](https://github.com/go-gitea/gitea/pull/37053))
- 构建
  - 将 go-git 升级到 v5.18.0 ([#37269](https://github.com/go-gitea/gitea/pull/37269))
  - 用 rolldown-license-plugin 替代 rollup-plugin-license ([#37130](https://github.com/go-gitea/gitea/pull/37130)) ([#37158](https://github.com/go-gitea/gitea/pull/37158))
  - 将最低 Go 版本提高到 1.26.2 ([#37139](https://github.com/go-gitea/gitea/pull/37139)) ([#37143](https://github.com/go-gitea/gitea/pull/37143))
  - 将语言文件从 INI 转为 JSON 格式 ([#35489](https://github.com/go-gitea/gitea/pull/35489))
  - 将 golangci-lint 升级到 2.7.2，启用 modernize stringsbuilder ([#36180](https://github.com/go-gitea/gitea/pull/36180))
  - 不再使用 `flake-utils` ([#35675](https://github.com/go-gitea/gitea/pull/35675))
  - 移除 nolint ([#36252](https://github.com/go-gitea/gitea/pull/36252))
  - 将 Unlicense 文本更新为最新版本 ([#36636](https://github.com/go-gitea/gitea/pull/36636))
  - 更新为 Go 1.26.0 和 golangci-lint 2.9.0 ([#36588](https://github.com/go-gitea/gitea/pull/36588))
  - 用自定义生成逻辑替代 `google/go-licenses` ([#36575](https://github.com/go-gitea/gitea/pull/36575))
  - 更新 Go 依赖 ([#36548](https://github.com/go-gitea/gitea/pull/36548))
  - 将 appleboy/git-push-action 从 1.0.0 升级到 1.2.0 ([#36306](https://github.com/go-gitea/gitea/pull/36306))
  - 移除 Fomantic 表单模块 ([#36222](https://github.com/go-gitea/gitea/pull/36222))
  - 将 setup-node 升级到 v6，重新启用缓存 ([#36207](https://github.com/go-gitea/gitea/pull/36207))
  - 将 crowdin/github-action 从 1 升级到 2 ([#36204](https://github.com/go-gitea/gitea/pull/36204))
  - 还原“将 Alpine 升级到 3.23”的更改 ([#36185](https://github.com/go-gitea/gitea/pull/36185))" ([#36202](https://github.com/go-gitea/gitea/pull/36202))
  - 将 Chroma 更新到 v2.21.1 ([#36201](https://github.com/go-gitea/gitea/pull/36201))
  - 将 astral-sh/setup-uv 从 6 升级到 7 ([#36198](https://github.com/go-gitea/gitea/pull/36198))
  - 将 docker/build-push-action 从 5 升级到 6 ([#36197](https://github.com/go-gitea/gitea/pull/36197))
  - 将 aws-actions/configure-aws-credentials 从 4 升级到 5 ([#36196](https://github.com/go-gitea/gitea/pull/36196))
  - 将 dev-hanz-ops/install-gh-cli-action 从 0.1.0 升级到 0.2.1 ([#36195](https://github.com/go-gitea/gitea/pull/36195))
  - 增加 JSON lint ([#36192](https://github.com/go-gitea/gitea/pull/36192))
  - 为 Actions 启用 Dependabot ([#36191](https://github.com/go-gitea/gitea/pull/36191))
  - 将 Alpine 升级到 3.23 ([#36185](https://github.com/go-gitea/gitea/pull/36185))
  - 将 Chroma 更新到 v2.21.0 ([#36171](https://github.com/go-gitea/gitea/pull/36171))
  - 更新 JavaScript 依赖并改进 ESLint ([#36147](https://github.com/go-gitea/gitea/pull/36147))
  - 更新 JavaScript 依赖 ([#36091](https://github.com/go-gitea/gitea/pull/36091))
  - 将 golangci-lint 更新到 v2.7.0 ([#36079](https://github.com/go-gitea/gitea/pull/36079))
  - 更新 JavaScript 依赖，修复弃用项 ([#36040](https://github.com/go-gitea/gitea/pull/36040))
  - 更新 JavaScript 依赖 ([#35978](https://github.com/go-gitea/gitea/pull/35978))
  - 为 go.mod 增加 toolchain 指令 ([#35901](https://github.com/go-gitea/gitea/pull/35901))
  - 将 `gitea-vet` 改为使用 `go tool` ([#35878](https://github.com/go-gitea/gitea/pull/35878))
  - 更新到 Go 1.25.4 ([#35877](https://github.com/go-gitea/gitea/pull/35877))
  - 启用 TypeScript `strictNullChecks` ([#35843](https://github.com/go-gitea/gitea/pull/35843))
  - 启用 `vue/require-typed-ref` ESLint 规则 ([#35764](https://github.com/go-gitea/gitea/pull/35764))
  - 更新 JavaScript 依赖 ([#35759](https://github.com/go-gitea/gitea/pull/35759))
  - 将 `codeformat` 目录移至 tools ([#35758](https://github.com/go-gitea/gitea/pull/35758))
  - 更新依赖 ([#35733](https://github.com/go-gitea/gitea/pull/35733))
  - 将 happy-dom 从 20.0.0 升级到 20.0.2 ([#35677](https://github.com/go-gitea/gitea/pull/35677))
  - 将 setup-go 升级到 v6 ([#35660](https://github.com/go-gitea/gitea/pull/35660))
  - 更新 JavaScript 依赖并调整细节 ([#35643](https://github.com/go-gitea/gitea/pull/35643))
  - 将 happy-dom 从 19.0.2 升级到 20.0.0 ([#35625](https://github.com/go-gitea/gitea/pull/35625))
  - 使用捆绑的 Spectral 版本 ([#35573](https://github.com/go-gitea/gitea/pull/35573))
  - 更新 JavaScript 和 Python 依赖 ([#35565](https://github.com/go-gitea/gitea/pull/35565))
  - 将 github.com/wneessen/go-mail 从 0.6.2 升级到 0.7.1 ([#35557](https://github.com/go-gitea/gitea/pull/35557))
  - 从 Webpack 迁移到 Vite ([#37002](https://github.com/go-gitea/gitea/pull/37002))
  - 更新 JavaScript 依赖并调整细节 ([#37064](https://github.com/go-gitea/gitea/pull/37064))
  - 更新到 ESLint 10 ([#36925](https://github.com/go-gitea/gitea/pull/36925))
  - 通过依赖层缓存优化 Docker 构建 ([#36864](https://github.com/go-gitea/gitea/pull/36864))
  - 更新 JavaScript 依赖 ([#36850](https://github.com/go-gitea/gitea/pull/36850))
  - 更新工具依赖并修复新的 lint 问题 ([#36702](https://github.com/go-gitea/gitea/pull/36702))
  - 移除冗余 linter 规则 ([#36658](https://github.com/go-gitea/gitea/pull/36658))
  - 将 Fomantic 下拉菜单 CSS 移至自定义模块 ([#36530](https://github.com/go-gitea/gitea/pull/36530))
  - 移除并禁止 `@ts-expect-error` ([#36513](https://github.com/go-gitea/gitea/pull/36513))
  - 重构 Git 命令标准错误处理 ([#36402](https://github.com/go-gitea/gitea/pull/36402))
  - 启用 gocheckcompilerdirectives linter ([#36156](https://github.com/go-gitea/gitea/pull/36156))
  - 用额外的 `govet` linter 替代 `lint-go-gopls` ([#36028](https://github.com/go-gitea/gitea/pull/36028))
  - 将 golangci-lint 更新到 v2.6.0 ([#35801](https://github.com/go-gitea/gitea/pull/35801))
  - 调整工具细节 ([#35734](https://github.com/go-gitea/gitea/pull/35734))
  - 为容器构建增加缓存 ([#35697](https://github.com/go-gitea/gitea/pull/35697))
  - 升级 Vite ([#37126](https://github.com/go-gitea/gitea/pull/37126))
  - 将 `setup-uv` 更新到 v8.0.0 ([#37101](https://github.com/go-gitea/gitea/pull/37101))
  - 将 `go-git` 升级到 v5.17.2，并更新相关依赖 ([#37060](https://github.com/go-gitea/gitea/pull/37060))
  - 将最低 Node.js 版本提高到 22.18.0 ([#37058](https://github.com/go-gitea/gitea/pull/37058))
  - 将 `golang.org/x/image` 升级到 v0.38.0 ([#37054](https://github.com/go-gitea/gitea/pull/37054))
  - 将最低 Go 版本更新为 1.26.1、golangci-lint 更新为 2.11.2，并修复测试风格 ([#36876](https://github.com/go-gitea/gitea/pull/36876))
  - 启用 ESLint 并发执行 ([#36878](https://github.com/go-gitea/gitea/pull/36878))
  - 将 relative-time-element 内置为本地 Web 组件 ([#36853](https://github.com/go-gitea/gitea/pull/36853))
  - 更新 material-icon-theme v5.32.0 ([#36832](https://github.com/go-gitea/gitea/pull/36832))
  - 更新 Go 依赖 ([#36781](https://github.com/go-gitea/gitea/pull/36781))
  - 升级 minimatch ([#36760](https://github.com/go-gitea/gitea/pull/36760))
  - 因翻译格式变化，暂时移除 i18n 回移工具 ([#36643](https://github.com/go-gitea/gitea/pull/36643))
  - 更新 Unicode 16 表情符号数据 ([#36596](https://github.com/go-gitea/gitea/pull/36596))
  - 更新 JavaScript 依赖，调整 Webpack 配置并修复细节 ([#36431](https://github.com/go-gitea/gitea/pull/36431))
  - 将 material-icon-theme 更新到 v5.31.0 ([#36427](https://github.com/go-gitea/gitea/pull/36427))
  - 更新 JavaScript 和 Python 依赖 ([#36383](https://github.com/go-gitea/gitea/pull/36383))
  - 将 Alpine 升级到 3.23，为 `docker-dryrun` 增加平台 ([#36379](https://github.com/go-gitea/gitea/pull/36379))
  - 更新 JavaScript 依赖 ([#36354](https://github.com/go-gitea/gitea/pull/36354))
  - 将 goldmark 更新到 v1.7.16 ([#36343](https://github.com/go-gitea/gitea/pull/36343))
  - 将 Chroma 更新到 v2.22.0 ([#36342](https://github.com/go-gitea/gitea/pull/36342))
- 文档
  - 更新 AI 贡献政策 ([#37022](https://github.com/go-gitea/gitea/pull/37022))
  - 为 AGENTS.md 补充指导规则 ([#37018](https://github.com/go-gitea/gitea/pull/37018))
  - 为示例 INI 补充缺失的定时任务 ([#37012](https://github.com/go-gitea/gitea/pull/37012))
  - 在 CONTRIBUTING.md 中增加 AI 贡献政策 ([#36651](https://github.com/go-gitea/gitea/pull/36651))
  - 改进 CONTRIBUTING.md 的标点细节 ([#36291](https://github.com/go-gitea/gitea/pull/36291))
  - 增加 Markdown 锚点后处理文档 ([#36443](https://github.com/go-gitea/gitea/pull/36443))
- 其他
  - 修正拼写 ([#36783](https://github.com/go-gitea/gitea/pull/36783))
  - 更新 Nix flake ([#37110](https://github.com/go-gitea/gitea/pull/37110))
  - 更新 Nix flake ([#37024](https://github.com/go-gitea/gitea/pull/37024))
  - 增加有效的 GitHub 权限范围 ([#36977](https://github.com/go-gitea/gitea/pull/36977))
  - 更新 Nix flake ([#36943](https://github.com/go-gitea/gitea/pull/36943))
  - 更新 Nix flake ([#36902](https://github.com/go-gitea/gitea/pull/36902))
  - 更新 Nix flake ([#36857](https://github.com/go-gitea/gitea/pull/36857))
  - 更新 Nix flake ([#36787](https://github.com/go-gitea/gitea/pull/36787))

## 此版本的贡献者

感谢帮助此版本顺利发布的所有贡献者！

* [@0xMax42](https://github.com/0xMax42)
* [@6543](https://github.com/6543)
* [@a1012112796](https://github.com/a1012112796)
* [@AdamMajer](https://github.com/AdamMajer)
* [@alphazeba](https://github.com/alphazeba)
* [@argoyle](https://github.com/argoyle)
* [@bartvdbraak](https://github.com/bartvdbraak)
* [@bimakw](https://github.com/bimakw)
* [@bircni](https://github.com/bircni)
* [@BLumia](https://github.com/BLumia)
* [@brymut](https://github.com/brymut)
* [@bytedream](https://github.com/bytedream)
* [@ChristopherHX](https://github.com/ChristopherHX)
* [@CorySanin](https://github.com/CorySanin)
* [@crawfordxx](https://github.com/crawfordxx)
* [@cyx25](https://github.com/cyx25)
* [@da-Kai](https://github.com/da-Kai)
* [@DaanSelen](https://github.com/DaanSelen)
* [@danigm](https://github.com/danigm)
* [@dawidgora](https://github.com/dawidgora)
* [@Dh4nu5hwebdev](https://github.com/Dh4nu5hwebdev)
* [@divyun](https://github.com/divyun)
* [@dmach](https://github.com/dmach)
* [@DrMaxNix](https://github.com/DrMaxNix)
* [@e6aluga](https://github.com/e6aluga)
* [@Enzime](https://github.com/Enzime)
* [@Excellencedev](https://github.com/Excellencedev)
* [@Exgene](https://github.com/Exgene)
* [@hamkido](https://github.com/hamkido)
* [@heathdutton](https://github.com/heathdutton)
* [@ita004](https://github.com/ita004)
* [@ivan-tkatchev](https://github.com/ivan-tkatchev)
* [@jimparis](https://github.com/jimparis)
* [@josetduarte](https://github.com/josetduarte)
* [@junoberryferry](https://github.com/junoberryferry)
* [@kemzeb](https://github.com/kemzeb)
* [@krjakbrjak](https://github.com/krjakbrjak)
* [@lifegpc](https://github.com/lifegpc)
* [@lunny](https://github.com/lunny)
* [@Luohaothu](https://github.com/Luohaothu)
* [@luojiyin1987](https://github.com/luojiyin1987)
* [@lutinglt](https://github.com/lutinglt)
* [@majiayu000](https://github.com/majiayu000)
* [@mdferdousalam](https://github.com/mdferdousalam)
* [@meln5674](https://github.com/meln5674)
* [@Mic92](https://github.com/Mic92)
* [@micahkepe](https://github.com/micahkepe)
* [@mithileshgupta12](https://github.com/mithileshgupta12)
* [@mrtz-j](https://github.com/mrtz-j)
* [@myers](https://github.com/myers)
* [@mykh-hailo](https://github.com/mykh-hailo)
* [@NAM-MAN](https://github.com/NAM-MAN)
* [@navneet102](https://github.com/navneet102)
* [@Naxdy](https://github.com/Naxdy)
* [@nllptrx](https://github.com/nllptrx)
* [@noeljackson](https://github.com/noeljackson)
* [@OptionalValue](https://github.com/OptionalValue)
* [@peterverraedt](https://github.com/peterverraedt)
* [@POPSuL](https://github.com/POPSuL)
* [@robgonnella](https://github.com/robgonnella)
* [@robinson-j16](https://github.com/robinson-j16)
* [@Rohansguliani](https://github.com/Rohansguliani)
* [@rossigee](https://github.com/rossigee)
* [@saneks222](https://github.com/saneks222)
* [@schinkelg](https://github.com/schinkelg)
* [@ScionOfDesign](https://github.com/ScionOfDesign)
* [@sebastianertz](https://github.com/sebastianertz)
* [@shafi-VM](https://github.com/shafi-VM)
* [@shashank-netapp](https://github.com/shashank-netapp)
* [@silverwind](https://github.com/silverwind)
* [@smileBeda](https://github.com/smileBeda)
* [@sollyu](https://github.com/sollyu)
* [@strk](https://github.com/strk)
* [@surya-purohit](https://github.com/surya-purohit)
* [@techknowlogick](https://github.com/techknowlogick)
* [@telometto](https://github.com/telometto)
* [@thbeu](https://github.com/thbeu)
* [@TheFox0x7](https://github.com/TheFox0x7)
* [@theoludwig](https://github.com/theoludwig)
* [@Theproudcold](https://github.com/Theproudcold)
* [@tototomate123](https://github.com/tototomate123)
* [@tycho](https://github.com/tycho)
* [@tyroneyeh](https://github.com/tyroneyeh)
* [@Utopiah](https://github.com/Utopiah)
* [@WinterCabbage](https://github.com/WinterCabbage)
* [@wxiaoguang](https://github.com/wxiaoguang)
* [@xDarkmanx](https://github.com/xDarkmanx)
* [@xiaox315](https://github.com/xiaox315)
* [@xijiang](https://github.com/xijiang)
* [@yshyuk](https://github.com/yshyuk)
* [@Zettat123](https://github.com/Zettat123)
* [@zorrobiwan](https://github.com/zorrobiwan)
* [@ZPascal](https://github.com/ZPascal)

也感谢更多参与测试、报告问题和翻译的贡献者！

我们将在下一版本感谢回移 PR 的所有原始贡献者。
