## 0.18.0 - 2026-11-27

- **远程工作区浏览器代理：** 桌面端远程工作区中的浏览器标签页现在通过工作区守护进程转发请求，可直接在 Paseo 中打开远程主机上的 `localhost` 服务。 ([#10944](https://github.com/getpaseo/paseo/pull/10944) by @airon-assustadus)
- **按设备设置通知偏好：** 每台设备可以选择哪些智能体、终端和插件事件会触发通知。插件也可以发送通知并处理点按操作。 ([#10888](https://github.com/getpaseo/paseo/pull/10888))
- **智能体配置中的系统提示词：** 可在智能体配置中保存一条可选的系统提示词，从该配置启动的新智能体会应用这条提示词。 ([#10996](https://github.com/getpaseo/paseo/pull/10996))
- **更多语法高亮：** 语法高亮现已支持 diff 和 patch 文件，以及 Ruby、Kotlin、TOML、SQL、Lua、Protobuf、PowerShell、Groovy、Gradle、Scala、CMake、Properties、INI、R、Perl 和 LaTeX。 ([#11026](https://github.com/getpaseo/paseo/pull/11026) by @hmalaspina, @kukicola, @MaximeConan, @singleton11, @chandlerok)

<details>
<summary>全部变更</summary>

### 调整

- ACP 提供方改为将模型目录缓存在守护进程重启后仍可使用的位置，取代后台探测。同时清理了 Antigravity ACP 的标志和元数据。需要 [Antigravity CLI 1.5.1 或更高版本](https://paseo.sh/docs/supported-providers/antigravity) ([#10992](https://github.com/getpaseo/paseo/pull/10992))

### 修复

- 修复已启用的客户端插件导入 `react-native` 时，Paseo iOS 在连接后不久崩溃的问题。 ([#11011](https://github.com/getpaseo/paseo/pull/11011))
- 修复 OpenCode v2 智能体漏收流式事件或聊天历史较长时，执行停止操作后仍卡在运行状态的问题。 ([#10955](https://github.com/getpaseo/paseo/pull/10955))
- 修复在 Pi 智能体自行启动的运行过程中发送引导消息时，运行被中止的问题。 ([#10977](https://github.com/getpaseo/paseo/pull/10977) by @viiqswim)
- 修复在派生仓库的克隆中根据拉取请求创建工作区时，检出派生仓库中同编号拉取请求的问题。 ([#10987](https://github.com/getpaseo/paseo/pull/10987))
- 修复将图片或文件拖到消息编辑器后，输入框未获得焦点的问题。 ([#11022](https://github.com/getpaseo/paseo/pull/11022))

</details>
