

### 补丁更改

这是一个补丁版本，用于修复“@logto/core-kit”缺失的版本冲突。

在 v1.37.0 中，扩展 ID 令牌声明导出（`extendedIdTokenClaims`、`ExtendedIdTokenClaim`、`extendedIdTokenClaimsByScope`）已添加到 `@logto/core-kit` (#8317)，但更改集丢失，导致 `@logto/core-kit` 不被碰撞。这导致下游包（`@logto/schemas`、`@logto/console`）引用已发布版本中不存在的导出。

#### @logto/core-kit@2.7.1

- 添加扩展 ID 令牌声明导出

