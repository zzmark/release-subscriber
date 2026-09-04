

## 0.7.2 - 2026-09-02

### 添加

- 为 pi 代理添加了主动转弯转向，以便新消息到达正在运行的转弯而不会中断它（[#3752](https://github.com/getpaseo/paseo/pull/3752) by @mcowger）
- 为 Git 托管的插件添加了声明的构建命令和 monorepo 源路径 ([#4158](https://github.com/getpaseo/paseo/pull/4158))

### 改进

- 减少了在移动设备上观看流媒体代理时 JS 停顿的情况 ([#4190](https://github.com/getpaseo/paseo/pull/4190))

### 已修复

- 修复了打开和滚动时大型和多文件差异停滞或崩溃的问题 ([#4174](https://github.com/getpaseo/paseo/pull/4174))
- 修复了当 JS 停顿穿过动画时移动侧边栏和资源管理器面板失去固定位置的问题 ([#4190](https://github.com/getpaseo/paseo/pull/4190))
- 修复了一条过大的助理消息，通过将渲染内容限制在 32,000 个字符来导致时间线崩溃 ([#4166](https://github.com/getpaseo/paseo/pull/4166))
- 修复了 Codex 0.151 及更高版本的分页线程上 Codex 倒带失败的问题 ([#4119](https://github.com/getpaseo/paseo/pull/4119))
- 修复了 Escape 关闭图像预览也会中断正在运行的代理的问题 ([#4161](https://github.com/getpaseo/paseo/pull/4161))
- 修复了 Windows 上的守护进程停止和重新启动跳过正常关闭和孤立代理进程的问题 ([#4168](https://github.com/getpaseo/paseo/pull/4168))
- 修复了 OMP 启动超时为 10 秒的问题，无论配置的 RPC 超时如何（[#4143](https://github.com/getpaseo/paseo/pull/4143) by @Juns-g）
- 修复了已完成的回合，但没有可见提示显示没有完成时间 ([#4170](https://github.com/getpaseo/paseo/pull/4170))
- 修复了当文件身份元数据不可用时资源管理器重命名替换现有文件的问题 ([#4171](https://github.com/getpaseo/paseo/pull/4171))

