## @hyperdx/app@2.39.1

### 补丁变更

- a9161c94：修复：确保时长坐标轴刻度标签不超出图表宽度预算。

  采用时长格式的 Y 轴标签（例如 “13.33min”）可能比坐标轴区域允许的宽度更宽，因而被裁切。现在它们会使用热力图坐标轴已经采用的同款紧凑格式化器。

- f6d7f853：修复：不再让 all-in-one 镜像把 Node 的 /usr/lib 复制到基础镜像之上。

  all-in-one 和本地镜像此前会从 `node:22.22-alpine` 复制整个 `/usr/lib`，覆盖 ClickHouse 基础镜像中的 `libapk.so`、`libssl`、`libcrypto` 和 `libz`。当两个镜像采用了不同的 Alpine 小版本（3.24.1 与 3.24.2）后，旧版 `libapk.so` 无法满足新版 `/sbin/apk`，导致每次镜像构建都因 `Error relocating /sbin/apk: apk_fs_is_malicious_filename: symbol not found` 失败。

  Node 在这次复制中实际只需要 `libstdc++`/`libgcc`，因此现在会通过 apk 从镜像自身的 Alpine 版本安装它们，并移除整目录复制。这也避免 ClickHouse 的 OpenSSL 被 Node 的版本静默替换。

  - @hyperdx/api@2.39.1
