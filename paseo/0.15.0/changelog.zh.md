## 0.15.0 - 2026-11-03

守护进程重启后，终端程序现在可以继续运行。启用代理恢复后，中断的代理可以在原有对话中继续运行。

移动端终端采用原生渲染，并提供可拖动的文本选择手柄。重新连接时可恢复最多 10,000 行终端历史记录。

工作树初始化设置可在代理启动前复制忽略文件，并使用插件指定的位置。

### 新增

- 将回复中已识别的代理命令插入消息编辑器草稿 ([#8371](https://github.com/getpaseo/paseo/pull/8371))
- 复用正在运行的 OpenCode v2 服务 ([#7435](https://github.com/getpaseo/paseo/pull/7435)，贡献者 @mcowger)
- 在守护进程重启、崩溃及受支持的更新期间，保持终端程序运行 ([#7644](https://github.com/getpaseo/paseo/pull/7644), [#8155](https://github.com/getpaseo/paseo/pull/8155)，贡献者 @sebastianarena)
- 新增需主动启用的设置，可在主机重启后，让中断的代理在原有对话中继续运行 ([#8127](https://github.com/getpaseo/paseo/pull/8127), [#8619](https://github.com/getpaseo/paseo/pull/8619)，贡献者 @coolwindX, @suntianc)
- 在 iOS 和 Android 上新增可拖动的终端文本选择手柄 ([#8348](https://github.com/getpaseo/paseo/pull/8348))
- 允许手机和平板电脑根据系统方向设置旋转屏幕 ([#8256](https://github.com/getpaseo/paseo/pull/8256)，贡献者 @magiclaw, @yzim)
- 在执行初始化设置和启动代理之前，将 `.worktreeinclude` 选中的忽略文件复制到新工作树中 ([#8100](https://github.com/getpaseo/paseo/pull/8100)，贡献者 @cprecioso)
- 为整个守护进程添加 `HTTP_PROXY`、`HTTPS_PROXY` 和 `NO_PROXY` 支持 ([#8177](https://github.com/getpaseo/paseo/pull/8177))
- 仅在显示用量时获取用量数据，并提供主机设置以完全禁用用量检查 ([#8181](https://github.com/getpaseo/paseo/pull/8181))

### 改进

- 替换移动端终端的文本渲染方式，使中日韩字符、emoji、带样式的文本和光标与终端列对齐 ([#8336](https://github.com/getpaseo/paseo/pull/8336), [#8375](https://github.com/getpaseo/paseo/pull/8375))
- 重新连接时恢复配置的终端回滚历史，最多保留 10,000 行 ([#8282](https://github.com/getpaseo/paseo/pull/8282)，贡献者 @DrakenKor, @lennartschoch)
- 导入或重新打开会话时，加载分页的 Codex 历史记录 ([#8171](https://github.com/getpaseo/paseo/pull/8171)，贡献者 @dundunHa, @hr95savage)
- 重新打开已缓存的聊天时，不再重新读取并保留一份未使用的 Codex 历史记录副本 ([#8132](https://github.com/getpaseo/paseo/pull/8132))
- 将守护进程的大型响应拆分到多个中继帧中，而非在达到帧大小限制时断开连接 ([#8302](https://github.com/getpaseo/paseo/pull/8302))
- 向应用发送聊天条目前截断过大的条目，包括大型工具结果和嵌入数据 ([#8274](https://github.com/getpaseo/paseo/pull/8274))
- 在独立面板中显示子代理活动，不再在父代理的工具卡片内重复显示 ([#8276](https://github.com/getpaseo/paseo/pull/8276))
- 显示精确的用量重置时间，并提供更精确的倒计时 ([#8162](https://github.com/getpaseo/paseo/pull/8162))

### 插件

- 修复回退插件对话后，已丢弃的消息重新出现的问题 ([#8368](https://github.com/getpaseo/paseo/pull/8368)，贡献者 @mcowger, @omercnet)
- 通过缩小客户端包，并在重新连接和应用启动之间复用缓存，减少插件下载量 ([#8040](https://github.com/getpaseo/paseo/pull/8040), [#8076](https://github.com/getpaseo/paseo/pull/8076)，贡献者 @luoph, @RRD-dev)
- 在主机暂时断开连接期间，保留插件界面和本地状态 ([#8105](https://github.com/getpaseo/paseo/pull/8105)，贡献者 @luoph, @RRD-dev)
- 允许插件通过 `worktree.create.before` 选择工作树位置及创建选项 ([#8117](https://github.com/getpaseo/paseo/pull/8117)，贡献者 @mcowger)
- 新增 `server.addHook`，并在工作区初始化设置和代理启动之前，等待 `worktree.create.after` 钩子执行完毕 ([#8081](https://github.com/getpaseo/paseo/pull/8081))
- 释放多余的插件流式快照，不再将其保留到会话结束 ([#7675](https://github.com/getpaseo/paseo/pull/7675)，贡献者 @suntianc)

### 修复

- 修复将 Claude 对话回退到活动对话轮次期间发送的消息时出现的问题 ([#8372](https://github.com/getpaseo/paseo/pull/8372)，贡献者 @tieo)
- 修复重新打开会话后恢复 Claude 子代理时，出现重复行及回复缺失的问题 ([#8408](https://github.com/getpaseo/paseo/pull/8408)，贡献者 @luoph, @RRD-dev)
- 修复未提供提示词就创建的 Codex 代理，在其运行时重新打开后失败的问题 ([#8393](https://github.com/getpaseo/paseo/pull/8393)，贡献者 @babo-jeonguk)
- 修复新启动的代理刚创建就显示为已完成的问题 ([#8396](https://github.com/getpaseo/paseo/pull/8396)，贡献者 @luoph)
- 修复 ACP 启动时进程退出后仍等待超时，而未报告进程错误的问题 ([#8384](https://github.com/getpaseo/paseo/pull/8384)，贡献者 @Peanut-HZM)
- 修复命令分多批到达时，新建 ACP 代理缺少技能的问题 ([#8387](https://github.com/getpaseo/paseo/pull/8387)，贡献者 @Peanut-HZM)
- 修复目录订阅释放后，侧栏标题和状态停止更新的问题 ([#8403](https://github.com/getpaseo/paseo/pull/8403)，贡献者 @ragokan)
- 在已折叠的侧栏分组中，仍显示当前打开的工作区 ([#8395](https://github.com/getpaseo/paseo/pull/8395)，贡献者 @0xroylee)
- 修复相对聊天链接未打开嵌套仓库中的文件，而是指向不存在文件的问题 ([#8361](https://github.com/getpaseo/paseo/pull/8361)，贡献者 @apple-ouyang)
- 允许在直接连接的 Host 字段中输入 host:port 或粘贴 URL ([#8223](https://github.com/getpaseo/paseo/pull/8223)，贡献者 @DaydreamCoding)
- 修复使用非 Mac 键盘通过普通 HTTP 访问时，终端 Ctrl+V 无法粘贴的问题 ([#8230](https://github.com/getpaseo/paseo/pull/8230)，贡献者 @DaydreamCoding)
- 历史记录加载失败后，不再反复重新打开服务提供商运行时，并在聊天中提供“重试”操作 ([#8278](https://github.com/getpaseo/paseo/pull/8278))
- 修复 Paseo 添加自身启动设置时，丢弃 Claude 设置文件的问题 ([#8148](https://github.com/getpaseo/paseo/pull/8148)，贡献者 @yayugu)
- 修复引导消息替换仍在启动的对话轮次，导致原始提示词丢失的问题 ([#6192](https://github.com/getpaseo/paseo/pull/6192))
- 修复 Pi 工具结果中的图片在流式传输期间及重新打开聊天后缺失的问题 ([#8280](https://github.com/getpaseo/paseo/pull/8280)，贡献者 @duyiliu)
- 修复已完成的 `edxeth/pi-subagents` 子代理仍被标记为工作中的问题 ([#8176](https://github.com/getpaseo/paseo/pull/8176)，贡献者 @Zeno2019)
- 修复重新打开对话后，Claude 后台子代理状态不正确的问题 ([#6259](https://github.com/getpaseo/paseo/pull/6259))
- 修复复用的插件子代理开始新工作时，仍显示上一次已完成状态的问题 ([#8080](https://github.com/getpaseo/paseo/pull/8080)，贡献者 @bccy)
- 修复名称为 `ollama` 等保留名称的自定义 Codex 服务提供商无法正常工作的问题 ([#6954](https://github.com/getpaseo/paseo/pull/6954)，贡献者 @mr860819)
- 修复 MiniMax Code 目录命令无法选择可执行文件的问题 ([#8201](https://github.com/getpaseo/paseo/pull/8201)，贡献者 @Peanut-HZM)
- 修复 Android 在后台折叠或展开设备后，仍保持错误布局的问题 ([#8285](https://github.com/getpaseo/paseo/pull/8285))
- 修复 Android 旋转屏幕后，工作区布局和页眉渐隐区域仍保留旧尺寸的问题 ([#8349](https://github.com/getpaseo/paseo/pull/8349), [#8377](https://github.com/getpaseo/paseo/pull/8377))
- 修复 iOS 和 Android 手机上的聊天重新连接状态及更新状态被页眉遮挡的问题 ([#8568](https://github.com/getpaseo/paseo/pull/8568))
- 修复删除代理后，其他窗口中残留无法关闭的标签页的问题 ([#8248](https://github.com/getpaseo/paseo/pull/8248)，贡献者 @loganmeyer)
- 修复窗口隐藏期间切换主题后，对话记录文本仍保留旧主题颜色的问题 ([#8199](https://github.com/getpaseo/paseo/pull/8199)，贡献者 @Nurshot, @dansabin)
- 修复网页菜单内容加载完成后，又跳回加载中尺寸的问题 ([#8180](https://github.com/getpaseo/paseo/pull/8180)，贡献者 @babo-jeonguk)
- 修复拖动分栏分隔线时，分隔线超前于或落后于指针的问题 ([#6011](https://github.com/getpaseo/paseo/pull/6011))
- 修复原生文件系统监视器启动延迟，导致未观察到 Git 更新的问题 ([#8107](https://github.com/getpaseo/paseo/pull/8107))
- 修复向 Codex 和 Pi 传递内置技能参数不正确的问题 ([#8252](https://github.com/getpaseo/paseo/pull/8252)，贡献者 @AspireOne)

### 注意事项

- 首次从 0.14.0 升级时仍会关闭终端；安装新的守护进程后，终端保留功能才会生效，且 Windows 桌面应用升级仍会关闭终端
- 代理恢复默认关闭；在主机设置 → 代理中启用 **重启后恢复代理（Resume agents after restart）**，即可发送 `Resume working.` 或自定义提示词
- 降级至 0.14.0 前，请恢复备份的 `config.json`，或移除已保存的代理恢复和用量检查设置
