## 0.9.2 - 2026-09-24

### 新增

- 新增结构化的 Claude Code 启动参数，用于配置会话和插件（[#5206](https://github.com/getpaseo/paseo/pull/5206)）

### 改进

- 对文件监视器无法监控的仓库，减少后台 Git 轮询（[#5170](https://github.com/getpaseo/paseo/pull/5170)）
- 缩短在包含大量内容的主目录中执行“添加项目”目录搜索的时间（[#5190](https://github.com/getpaseo/paseo/pull/5190)）

### 修复

- 修复打开工作区后出现被忽略的目录时，守护进程无响应的问题（[c3e1e08](https://github.com/getpaseo/paseo/commit/c3e1e084a068e5895710c43b034ced8ebef256e8)，由 @Marcus172 贡献）
- 修复客户端连接关闭后，守护进程内存继续增长的问题（[9978988](https://github.com/getpaseo/paseo/commit/9978988e35409a018a52d0d7646f18b51e562346)）
- 修复项目文件夹名称以空格结尾时，应用在加载期间崩溃的问题（[#5205](https://github.com/getpaseo/paseo/pull/5205)，由 @L4XB 贡献）
- 修复代理页面先于侧栏打开时，工作区标签缺失的问题（[#5079](https://github.com/getpaseo/paseo/pull/5079)，由 @morven-ai 贡献）
- 修复工作区所在磁盘或网络共享不可用时，工作区从列表中消失的问题（[#5227](https://github.com/getpaseo/paseo/pull/5227)）
- 修复会话导入失败后，已归档工作树无法恢复的问题（[#5238](https://github.com/getpaseo/paseo/pull/5238)）
- 修复 Paseo 删除已归档代理的工作树后，无法读取该代理日志的问题（[#5229](https://github.com/getpaseo/paseo/pull/5229)）
- 修复新建分支继承上游配置后，错误地将提交推送到默认分支的问题（[#5249](https://github.com/getpaseo/paseo/pull/5249)）
- 修复刷新后，fork 检出环境中的拉取请求从工作区消失的问题（[#5221](https://github.com/getpaseo/paseo/pull/5221)）
- 修复代理创建本地工作区时，允许指定不存在的路径或文件的问题（[#5322](https://github.com/getpaseo/paseo/pull/5322)）
- 修复聊天上传将原始文件名中的有效字符替换为下划线的问题（[#5317](https://github.com/getpaseo/paseo/pull/5317)）
- 修复多选问题丢失已勾选选项或手动输入的“其他”答案的问题（[#5320](https://github.com/getpaseo/paseo/pull/5320)，由 @ThePharmer 贡献）
- 修复底部弹层打开时，Android 返回操作仍离开当前页面的问题（[#5245](https://github.com/getpaseo/paseo/pull/5245)）
- 修复语音模式在口述回复的各片段之间播放思考提示音的问题（[#5281](https://github.com/getpaseo/paseo/pull/5281)）
- 修复带附件发送的 Claude 斜杠命令以普通文本形式传给 Claude 的问题（[#5240](https://github.com/getpaseo/paseo/pull/5240)，由 @joecorkerton 贡献）
- 修复回合未收到回复时，Claude 回退操作失败的问题（[#5285](https://github.com/getpaseo/paseo/pull/5285)）
- 修复回合包含子代理消息时，Claude 回退操作失败的问题（[#5289](https://github.com/getpaseo/paseo/pull/5289)）
- 修复配置持久化时间线存储后，刷新会出现重复代理历史记录的问题（[#5286](https://github.com/getpaseo/paseo/pull/5286)）
- 修复提供商尚未完成处理时，OMP 自定义消息就结束回合的问题（[#3258](https://github.com/getpaseo/paseo/pull/3258)）
- 修复已停止的 OMP 回合被显示为失败回合的问题（[#5243](https://github.com/getpaseo/paseo/pull/5243)）
- 修复 Pi 或 OMP 代理的运行时已退出后，“停止”操作无法将代理标记为已结束的问题（[#5235](https://github.com/getpaseo/paseo/pull/5235)）
- 修复 OpenCode 代理忽略已配置权限规则的问题（[#5296](https://github.com/getpaseo/paseo/pull/5296)，由 @gurvancampion 贡献）
- 修复 Codex 的“默认”和“只读”模式将批准请求交给“自动审核”的问题（[#5239](https://github.com/getpaseo/paseo/pull/5239)，由 @HMWCS 贡献）
- 修复从 Fast 模型切换到不支持 Fast 的模型后，无法创建 Cursor 代理的问题（[#5274](https://github.com/getpaseo/paseo/pull/5274)，由 @gengjiawen 贡献）
- 修复 Codex 中 GPT-6 Sol 和 GPT-6 Luna 缺少 Fast 控件的问题（[#5273](https://github.com/getpaseo/paseo/pull/5273)，由 @basilk15、@colonelpanic8 贡献）
- 修复已配置的 Claude Fable 模型未出现在模型选择器中的问题（[#5326](https://github.com/getpaseo/paseo/pull/5326)，由 @noahg9 贡献）
- 修复守护进程启动的 ACP 终端使用错误代理身份的问题（[#5248](https://github.com/getpaseo/paseo/pull/5248)）
- 修复守护进程重启后，代理已完成的插件会话显示为失败的问题（[#5253](https://github.com/getpaseo/paseo/pull/5253)）
- 修复提供商会话关闭期间，重新加载插件会导致插件子进程崩溃的问题（[#5231](https://github.com/getpaseo/paseo/pull/5231)）
- 修复插件提供商请求失败会使守护进程崩溃的问题（[#5298](https://github.com/getpaseo/paseo/pull/5298)）
- 修复 Hub 执行任务无法为其创建的工作区设置标题的问题（[#5302](https://github.com/getpaseo/paseo/pull/5302)）
- 修复无效的计划任务文件阻止守护进程启动的问题（[#5301](https://github.com/getpaseo/paseo/pull/5301)）
- 修复空的 `paseo.pid` 文件阻止守护进程启动的问题（[#5306](https://github.com/getpaseo/paseo/pull/5306)）
- 修复重启系统后，重复使用的守护进程 PID 阻止启动的问题（[#5277](https://github.com/getpaseo/paseo/pull/5277)）
- 修复以带 UTF-8 字节顺序标记的格式保存 `config.json` 时，守护进程启动失败的问题（[#5315](https://github.com/getpaseo/paseo/pull/5315)）
- 修复后台启动守护进程的错误未写入报告中指定日志文件的问题（[#5332](https://github.com/getpaseo/paseo/pull/5332)）
- 修复 `config.json` 无效时，CLI 错误信息未指出文件及出错字段的问题（[#5337](https://github.com/getpaseo/paseo/pull/5337)）
- 修复密码被拒绝后，CLI 仍建议启动守护进程的问题（[#5310](https://github.com/getpaseo/paseo/pull/5310)）
- 修复桌面守护进程受密码保护时，缺少“在编辑器中打开”操作的问题（[#5335](https://github.com/getpaseo/paseo/pull/5335)）
- 修复 `paseo permit ls --json` 缩短请求 ID，导致无法将其用于 `permit allow` 和 `permit deny` 的问题（[#5305](https://github.com/getpaseo/paseo/pull/5305)）
- 修复副本缓存的存储层持续拒绝写入时，读取操作陷入忙循环的问题（[#5290](https://github.com/getpaseo/paseo/pull/5290)）
- 修复 MiniMax 卡片对未激活的令牌订阅直接显示原始错误的问题（[#5258](https://github.com/getpaseo/paseo/pull/5258)）
- 修复带修饰键的 Backspace 无法设为自定义快捷键的问题（[#5224](https://github.com/getpaseo/paseo/pull/5224)）
- 修复应用在多步快捷键的两个步骤之间更新时，快捷键失效的问题（[#5255](https://github.com/getpaseo/paseo/pull/5255)，由 @colonelpanic8 贡献）
- 修复多步快捷键的第二步按住修饰键时，快捷键失效的问题（[#5272](https://github.com/getpaseo/paseo/pull/5272)）
- 修复输入文本时，重新绑定的窗格焦点快捷键失效的问题（[#5287](https://github.com/getpaseo/paseo/pull/5287)）
