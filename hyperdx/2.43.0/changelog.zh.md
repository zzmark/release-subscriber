## @hyperdx/app@2.43.0

### 次要版本变更

- 0212c7bd3: 功能：在 Generic 和 incident.io 的 webhook 正文中以 `{{tags}}` 提供告警标签（以逗号分隔，也可使用 `{{#each tags}}` 遍历），并将其加入 incident.io 默认正文的 `metadata.tags`，使一个共用的 webhook 能够按负责团队路由告警

### 补丁变更

- 4ea523a1b: 修复“高于”类型告警的预览图表错误地高亮阈值下方区域的问题。Recharts v3 颠倒了开放边界参考区域的默认边界，导致“高于”和“不在区间内”类型的告警在阈值线错误的一侧着色。
- e88f71695: 修复：切换搜索列或编辑分组列时，保持以反引号引用且包含逗号的列名完整
- 00768bbc1: 修复：侧栏导航标签、菜单和工具提示统一使用句首大写格式
- 5a3ad91c7: 功能：会话回放展示来自 OpenTelemetry 浏览器 SDK 的点击、页面导航、控制台输出和异常
- 7d23f7922: 功能：列出并播放由发送 `session.id` 的 OpenTelemetry 浏览器 SDK 提供的会话回放
- 更新依赖 [e88f71695]
- 更新依赖 [e5ba5dfde]
- 更新依赖 [f2b898684]
- 更新依赖 [0212c7bd3]
  - @hyperdx/common-utils@0.33.0
  - @hyperdx/api@2.43.0

## @hyperdx/otel-collector@2.43.0



## @hyperdx/common-utils@0.33.0

### 次要版本变更

- 0212c7bd3: 功能：在 Generic 和 incident.io 的 webhook 正文中以 `{{tags}}` 提供告警标签（以逗号分隔，也可使用 `{{#each tags}}` 遍历），并将其加入 incident.io 默认正文的 `metadata.tags`，使一个共用的 webhook 能够按负责团队路由告警

### 补丁变更

- e88f71695: 修复：切换搜索列或编辑分组列时，保持以反引号引用且包含逗号的列名完整
- e5ba5dfde: 修复：将 `Map['key'] = 'value'` 筛选条件改写为使用键值项索引时，保留字符串字面量的原始写法，使包含引号或反斜杠的值能够匹配，而非不返回任何行

## @hyperdx/api@2.43.0

### 次要版本变更

- 0212c7bd3: 功能：在 Generic 和 incident.io 的 webhook 正文中以 `{{tags}}` 提供告警标签（以逗号分隔，也可使用 `{{#each tags}}` 遍历），并将其加入 incident.io 默认正文的 `metadata.tags`，使一个共用的 webhook 能够按负责团队路由告警

### 补丁变更

- f2b898684: 修复：为纳入安全修复，将随附的 ClickHouse 固定为 26.8.36.3

  一体化镜像和 Docker Compose 文件现在使用
  `clickhouse/clickhouse-server:26.8.36.3-alpine`，替代浮动的
  `26.8-alpine` 标签。

- 更新依赖 [e88f71695]
- 更新依赖 [e5ba5dfde]
- 更新依赖 [0212c7bd3]
  - @hyperdx/common-utils@0.33.0
