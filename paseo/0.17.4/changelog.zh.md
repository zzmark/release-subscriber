## 0.17.4 - 2026-11-23

### 修复

- 修复 Android 上有序子列表的编号与正文重叠，以及列表内的引用块与后续消息重叠的问题。 ([#10499](https://github.com/getpaseo/paseo/pull/10499))
- 修复 Android 终端输入。终端现在会要求键盘将键入的内容排除在个性化学习之外。 ([#10586](https://github.com/getpaseo/paseo/pull/10586))
- 修复在不区分大小写的文件系统上，目录路径的大小写拼写不一致时对话消失的问题。 ([#10555](https://github.com/getpaseo/paseo/pull/10555) by @yzim)
- 修复向已归档的智能体发送中断或引导消息时，消息进入队列却未启动新轮次的问题。 ([#10611](https://github.com/getpaseo/paseo/pull/10611) by @thomasvan)
- 修复 Hermes Shell 记录行省略部分命令的问题。 ([#10614](https://github.com/getpaseo/paseo/pull/10614))
- 修复 OpenCode 2 数据库中保存的登录信息对应的 OpenCode Go 用量统计，包括 Console 登录和 API 密钥。 ([#8729](https://github.com/getpaseo/paseo/pull/8729), [#10612](https://github.com/getpaseo/paseo/pull/10612))
- 修复 Paseo 工具定义变更后，现有 OpenCode 会话无法重新打开的问题。 ([#10533](https://github.com/getpaseo/paseo/pull/10533) by @Peanut-HZM)
- 修复使用 MCP 协议版本 `2026-07-28` 的智能体缺少 Paseo 工具的问题。 ([#10558](https://github.com/getpaseo/paseo/pull/10558) by @apple-ouyang)
- 修复守护进程的警告日志遗漏 Codex MCP 启动失败的问题。 ([#10566](https://github.com/getpaseo/paseo/pull/10566))
- 修复插件进程停止后，守护进程关闭会话时意外退出的问题。 ([#10585](https://github.com/getpaseo/paseo/pull/10585))
- 修复目录采用裸仓库布局时，Git 命令选错仓库的问题。 ([#10587](https://github.com/getpaseo/paseo/pull/10587))
- 修复 Claude 的 Auto 权限模式在 Bedrock 和 Vertex 上不可用的问题。 ([#6904](https://github.com/getpaseo/paseo/pull/6904))
- 修复侧栏的主机设置按钮需要点击两次才能打开设置的问题。 ([#10562](https://github.com/getpaseo/paseo/pull/10562) by @ShalokShalom)
- 修复在普通检出目录中，「更改」面板未为从未推送的新分支提供「推送」操作的问题。 ([#10631](https://github.com/getpaseo/paseo/pull/10631))
- 修复 Hub 提供工作区目录以校验触发器时，守护进程使用错误模型目录的问题。 ([#10582](https://github.com/getpaseo/paseo/pull/10582))
