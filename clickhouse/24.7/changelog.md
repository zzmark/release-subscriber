<h3 id="a-id247a-clickhouse-release-247-2024-07-30">
  <a id="247" /> ClickHouse release 24.7, 2024-07-30. [Presentation](https://presentations.clickhouse.com/2024-release-24.7/), [Video](https://www.youtube.com/watch?v=GerQFdJCk7A)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/GerQFdJCk7A" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-5">
  Backward Incompatible Change
</h4>

* Forbid `CRATE MATERIALIZED VIEW ... ENGINE Replicated*MergeTree POPULATE AS SELECT ...` with Replicated databases. [#63963](https://github.com/ClickHouse/ClickHouse/pull/63963) ([vdimir](https://github.com/vdimir)).
* `clickhouse-keeper-client` will only accept paths in string literals, such as `ls '/hello/world'`, not bare strings such as `ls /hello/world`. [#65494](https://github.com/ClickHouse/ClickHouse/pull/65494) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Metric `KeeperOutstandingRequets` was renamed to `KeeperOutstandingRequests`. [#66206](https://github.com/ClickHouse/ClickHouse/pull/66206) ([Robert Schulze](https://github.com/rschu1ze)).
* Remove `is_deterministic` field from the `system.functions` table. [#66630](https://github.com/ClickHouse/ClickHouse/pull/66630) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Function `tuple` will now try to construct named tuples in query (controlled by `enable_named_columns_in_function_tuple`). Introduce function `tupleNames` to extract names from tuples. [#54881](https://github.com/ClickHouse/ClickHouse/pull/54881) ([Amos Bird](https://github.com/amosbird)).
* Change how deduplication for Materialized Views works. Fixed a lot of cases like: - on destination table: data is split for 2 or more blocks and that blocks is considered as duplicate when that block is inserted in parallel. - on MV destination table: the equal blocks are deduplicated, that happens when MV often produces equal data as a result for different input data due to performing aggregation. - on MV destination table: the equal blocks which comes from different MV are deduplicated. [#61601](https://github.com/ClickHouse/ClickHouse/pull/61601) ([Sema Checherinda](https://github.com/CheSema)).
* Functions `bitShiftLeft` and `bitShitfRight` return an error for out of bounds shift positions [#65838](https://github.com/ClickHouse/ClickHouse/pull/65838) ([Pablo Marcos](https://github.com/pamarcos)).

<h4 id="new-feature-5">
  New Feature
</h4>

* Add `ASOF JOIN` support for `full_sorting_join` algorithm. [#55051](https://github.com/ClickHouse/ClickHouse/pull/55051) ([vdimir](https://github.com/vdimir)).
* Support JWT authentication in `clickhouse-client` (will be available only in ClickHouse Cloud). [#62829](https://github.com/ClickHouse/ClickHouse/pull/62829) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* Add SQL functions `changeYear`, `changeMonth`, `changeDay`, `changeHour`, `changeMinute`, `changeSecond`. For example, `SELECT changeMonth(toDate('2024-06-14'), 7)` returns date `2024-07-14`. [#63186](https://github.com/ClickHouse/ClickHouse/pull/63186) ([cucumber95](https://github.com/cucumber95)).
* Introduce startup scripts, which allow the execution of preconfigured queries at the startup stage. [#64889](https://github.com/ClickHouse/ClickHouse/pull/64889) ([pufit](https://github.com/pufit)).
* Support accept\_invalid\_certificate in client's config in order to allow for client to connect over secure TCP to a server running with self-signed certificate - can be used as a shorthand for corresponding `openSSL` client settings `verificationMode=none` + `invalidCertificateHandler.name=AcceptCertificateHandler`. [#65238](https://github.com/ClickHouse/ClickHouse/pull/65238) ([peacewalker122](https://github.com/peacewalker122)).
* Add system.error\_log which contains history of error values from table system.errors, periodically flushed to disk. [#65381](https://github.com/ClickHouse/ClickHouse/pull/65381) ([Pablo Marcos](https://github.com/pamarcos)).
* Add aggregate function `groupConcat`. About the same as `arrayStringConcat( groupArray(column), ',')` Can receive 2 parameters: a string delimiter and the number of elements to be processed. [#65451](https://github.com/ClickHouse/ClickHouse/pull/65451) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* Add AzureQueue storage. [#65458](https://github.com/ClickHouse/ClickHouse/pull/65458) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Add a new setting to disable/enable writing page index into parquet files. [#65475](https://github.com/ClickHouse/ClickHouse/pull/65475) ([lgbo](https://github.com/lgbo-ustc)).
* Introduce `logger.console_log_level` server config to control the log level to the console (if enabled). [#65559](https://github.com/ClickHouse/ClickHouse/pull/65559) ([Azat Khuzhin](https://github.com/azat)).
* Automatically append a wildcard `*` to the end of a directory path with table function `file`. [#66019](https://github.com/ClickHouse/ClickHouse/pull/66019) ([Zhidong (David) Guo](https://github.com/Gun9niR)).
* Add `--memory-usage` option to client in non-interactive mode. [#66393](https://github.com/ClickHouse/ClickHouse/pull/66393) ([vdimir](https://github.com/vdimir)).
* Make an interactive client for clickhouse-disks, add local disk from the local directory. [#64446](https://github.com/ClickHouse/ClickHouse/pull/64446) ([Daniil Ivanik](https://github.com/divanik)).
* When lightweight delete happens on a table with projection(s), users have choices either throw an exception (by default) or drop the projection [#65594](https://github.com/ClickHouse/ClickHouse/pull/65594) ([jsc0218](https://github.com/jsc0218)).
* Add system tables with main information about all detached tables. [#65400](https://github.com/ClickHouse/ClickHouse/pull/65400) ([Konstantin Morozov](https://github.com/k-morozov)).

<h4 id="experimental-feature-4">
  Experimental Feature
</h4>

* Change binary serialization of the `Variant` data type: add `compact` mode to avoid writing the same discriminator multiple times for granules with single variant or with only NULL values. Add MergeTree setting `use_compact_variant_discriminators_serialization` that is enabled by default. Note that Variant type is still experimental and backward-incompatible change in serialization is ok. [#62774](https://github.com/ClickHouse/ClickHouse/pull/62774) ([Kruglov Pavel](https://github.com/Avogar)).
* Support on-disk backend storage for clickhouse-keeper. [#56626](https://github.com/ClickHouse/ClickHouse/pull/56626) ([Han Fei](https://github.com/hanfei1991)).
* Refactor JSONExtract functions, support more types including experimental Dynamic type. [#66046](https://github.com/ClickHouse/ClickHouse/pull/66046) ([Kruglov Pavel](https://github.com/Avogar)).
* Support null map subcolumn for `Variant` and `Dynamic` subcolumns. [#66178](https://github.com/ClickHouse/ClickHouse/pull/66178) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix reading `Dynamic` subcolumns from altered `Memory` table. Previously if `max_types` parameter of a Dynamic type was changed in Memory table via alter, further subcolumns reading can return wrong result. [#66066](https://github.com/ClickHouse/ClickHouse/pull/66066) ([Kruglov Pavel](https://github.com/Avogar)).
* Add support for `cluster_for_parallel_replicas` when using custom key parallel replicas. It allows you to use parallel replicas with custom key with MergeTree tables. [#65453](https://github.com/ClickHouse/ClickHouse/pull/65453) ([Antonio Andelic](https://github.com/antonio2368)).

<h4 id="performance-improvement-5">
  Performance Improvement
</h4>

* Replace int to string algorithm with a faster one (from a modified amdn/itoa to a modified jeaiii/itoa). [#61661](https://github.com/ClickHouse/ClickHouse/pull/61661) ([Raúl Marín](https://github.com/Algunenano)).
* Sizes of hash tables created by join (`parallel_hash` algorithm) are collected and cached now. This information will be used to preallocate space in hash tables for subsequent query executions and save time on hash table resizes. [#64553](https://github.com/ClickHouse/ClickHouse/pull/64553) ([Nikita Taranov](https://github.com/nickitat)).
* Optimized queries with `ORDER BY` primary key and `WHERE` that have a condition with high selectivity by using buffering. It is controlled by setting `read_in_order_use_buffering` (enabled by default) and can increase memory usage of query. [#64607](https://github.com/ClickHouse/ClickHouse/pull/64607) ([Anton Popov](https://github.com/CurtizJ)).
* Improve performance of loading `plain_rewritable` metadata. [#65634](https://github.com/ClickHouse/ClickHouse/pull/65634) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Attaching tables on read-only disks will use fewer resources by not loading outdated parts. [#65635](https://github.com/ClickHouse/ClickHouse/pull/65635) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Support minmax hyperrectangle for Set indices. [#65676](https://github.com/ClickHouse/ClickHouse/pull/65676) ([AntiTopQuark](https://github.com/AntiTopQuark)).
* Unload primary index of outdated parts to reduce total memory usage. [#65852](https://github.com/ClickHouse/ClickHouse/pull/65852) ([Anton Popov](https://github.com/CurtizJ)).
* Functions `replaceRegexpAll` and `replaceRegexpOne` are now significantly faster if the pattern is trivial, i.e. contains no metacharacters, pattern classes, flags, grouping characters etc. (Thanks to Taiyang Li). [#66185](https://github.com/ClickHouse/ClickHouse/pull/66185) ([Robert Schulze](https://github.com/rschu1ze)).
* s3 requests: Reduce retry time for queries, increase retries count for backups. 8.5 minutes and 100 retires for queries, 1.2 hours and 1000 retries for backup restore. [#65232](https://github.com/ClickHouse/ClickHouse/pull/65232) ([Sema Checherinda](https://github.com/CheSema)).
* Support query plan LIMIT optimization. Support LIMIT pushdown for PostgreSQL storage and table function. [#65454](https://github.com/ClickHouse/ClickHouse/pull/65454) ([Maksim Kita](https://github.com/kitaisreal)).
* Improved ZooKeeper load balancing. The current session doesn't expire until the optimal nodes become available despite `fallback_session_lifetime`. Added support for AZ-aware balancing. [#65570](https://github.com/ClickHouse/ClickHouse/pull/65570) ([Alexander Tokmakov](https://github.com/tavplubix)).
* DatabaseCatalog drops tables faster by using up to database\_catalog\_drop\_table\_concurrency threads. [#66065](https://github.com/ClickHouse/ClickHouse/pull/66065) ([Sema Checherinda](https://github.com/CheSema)).

<h4 id="improvement-5">
  Improvement
</h4>

* Improved ZooKeeper load balancing. The current session doesn't expire until the optimal nodes become available despite `fallback_session_lifetime`. Added support for AZ-aware balancing. [#65570](https://github.com/ClickHouse/ClickHouse/pull/65570) ([Alexander Tokmakov](https://github.com/tavplubix)).
* The setting `optimize_trivial_insert_select` is disabled by default. In most cases, it should be beneficial. Nevertheless, if you are seeing slower INSERT SELECT or increased memory usage, you can enable it back or `SET compatibility = '24.6'`. [#58970](https://github.com/ClickHouse/ClickHouse/pull/58970) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Print stacktrace and diagnostic info if `clickhouse-client` or `clickhouse-local` crashes. [#61109](https://github.com/ClickHouse/ClickHouse/pull/61109) ([Alexander Tokmakov](https://github.com/tavplubix)).
* The result of `SHOW INDEX | INDEXES | INDICES | KEYS` was previously sorted by the primary key column names. Since this was unintuitive, the result is now sorted by the position of the primary key columns within the primary key. [#61131](https://github.com/ClickHouse/ClickHouse/pull/61131) ([Robert Schulze](https://github.com/rschu1ze)).
* Change how deduplication for Materialized Views works. Fixed a lot of cases like: - on destination table: data is split for 2 or more blocks and that blocks is considered as duplicate when that block is inserted in parallel. - on MV destination table: the equal blocks are deduplicated, that happens when MV often produces equal data as a result for different input data due to performing aggregation. - on MV destination table: the equal blocks which comes from different MV are deduplicated. [#61601](https://github.com/ClickHouse/ClickHouse/pull/61601) ([Sema Checherinda](https://github.com/CheSema)).
* Support reading partitioned data DeltaLake data. Infer DeltaLake schema by reading metadata instead of data. [#63201](https://github.com/ClickHouse/ClickHouse/pull/63201) ([Kseniia Sumarokova](https://github.com/kssenii)).
* In composable protocols TLS layer accepted only `certificateFile` and `privateKeyFile` parameters. [https://clickhouse.com/docs/operations/settings/composable-protocols](https://clickhouse.com/docs/operations/settings/composable-protocols). [#63985](https://github.com/ClickHouse/ClickHouse/pull/63985) ([Anton Ivashkin](https://github.com/ianton-ru)).
* Added profile event `SelectQueriesWithPrimaryKeyUsage` which indicates how many SELECT queries use the primary key to evaluate the WHERE clause. [#64492](https://github.com/ClickHouse/ClickHouse/pull/64492) ([0x01f](https://github.com/0xfei)).
* `StorageS3Queue` related fixes and improvements. Deduce a default value of `s3queue_processing_threads_num` according to the number of physical cpu cores on the server (instead of the previous default value as 1). Set default value of `s3queue_loading_retries` to 10. Fix possible vague "Uncaught exception" in exception column of `system.s3queue`. Do not increment retry count on `MEMORY_LIMIT_EXCEEDED` exception. Move files commit to a stage after insertion into table fully finished to avoid files being commited while not inserted. Add settings `s3queue_max_processed_files_before_commit`, `s3queue_max_processed_rows_before_commit`, `s3queue_max_processed_bytes_before_commit`, `s3queue_max_processing_time_sec_before_commit`, to better control commit and flush time. [#65046](https://github.com/ClickHouse/ClickHouse/pull/65046) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Support aliases in parametrized view function (only new analyzer). [#65190](https://github.com/ClickHouse/ClickHouse/pull/65190) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Updated to mask account key in logs in azureBlobStorage. [#65273](https://github.com/ClickHouse/ClickHouse/pull/65273) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* Partition pruning for `IN` predicates when filter expression is a part of `PARTITION BY` expression. [#65335](https://github.com/ClickHouse/ClickHouse/pull/65335) ([Eduard Karacharov](https://github.com/korowa)).
* `arrayMin`/`arrayMax` can be applicable to all data types that are comparable. [#65455](https://github.com/ClickHouse/ClickHouse/pull/65455) ([pn](https://github.com/chloro-pn)).
* Improved memory accounting for cgroups v2 to exclude the amount occupied by the page cache. [#65470](https://github.com/ClickHouse/ClickHouse/pull/65470) ([Nikita Taranov](https://github.com/nickitat)).
* Do not create format settings for each row when serializing chunks to insert to EmbeddedRocksDB table. [#65474](https://github.com/ClickHouse/ClickHouse/pull/65474) ([Duc Canh Le](https://github.com/canhld94)).
* Reduce `clickhouse-local` prompt to just `:)`. `getFQDNOrHostName()` takes too long on macOS, and we don't want a hostname in the prompt for `clickhouse-local` anyway. [#65510](https://github.com/ClickHouse/ClickHouse/pull/65510) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* Avoid printing a message from jemalloc about per-CPU arenas on low-end virtual machines. [#65532](https://github.com/ClickHouse/ClickHouse/pull/65532) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Disable filesystem cache background download by default. It will be enabled back when we fix the issue with possible "Memory limit exceeded" because memory deallocation is done outside of query context (while buffer is allocated inside of query context) if we use background download threads. Plus we need to add a separate setting to define max size to download for background workers (currently it is limited by max\_file\_segment\_size, which might be too big). [#65534](https://github.com/ClickHouse/ClickHouse/pull/65534) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Add new option to config `<config_reload_interval_ms>` which allow to specify how often clickhouse will reload config. [#65545](https://github.com/ClickHouse/ClickHouse/pull/65545) ([alesapin](https://github.com/alesapin)).
* Implement binary encoding for ClickHouse data types and add its specification in docs. Use it in Dynamic binary serialization, allow to use it in RowBinaryWithNamesAndTypes and Native formats under settings. [#65546](https://github.com/ClickHouse/ClickHouse/pull/65546) ([Kruglov Pavel](https://github.com/Avogar)).
* Server settings `compiled_expression_cache_size` and `compiled_expression_cache_elements_size` are now shown in `system.server_settings`. [#65584](https://github.com/ClickHouse/ClickHouse/pull/65584) ([Robert Schulze](https://github.com/rschu1ze)).
* Add support for user identification based on x509 SubjectAltName extension. [#65626](https://github.com/ClickHouse/ClickHouse/pull/65626) ([Anton Kozlov](https://github.com/tonickkozlov)).
* `clickhouse-local` will respect the `max_server_memory_usage` and `max_server_memory_usage_to_ram_ratio` from the configuration file. It will also set the max memory usage to 90% of the system memory by default, like `clickhouse-server` does. [#65697](https://github.com/ClickHouse/ClickHouse/pull/65697) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add a script to backup your files to ClickHouse. [#65699](https://github.com/ClickHouse/ClickHouse/pull/65699) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* PostgreSQL source to support query cancellations. [#65722](https://github.com/ClickHouse/ClickHouse/pull/65722) ([Maksim Kita](https://github.com/kitaisreal)).
* Make `allow_experimental_analyzer` be controlled by the initiator for distributed queries. This ensures compatibility and correctness during operations in mixed version clusters. [#65777](https://github.com/ClickHouse/ClickHouse/pull/65777) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* Respect cgroup CPU limit in Keeper. [#65819](https://github.com/ClickHouse/ClickHouse/pull/65819) ([Antonio Andelic](https://github.com/antonio2368)).
* Allow to use `concat` function with empty arguments `:) select concat();`. [#65887](https://github.com/ClickHouse/ClickHouse/pull/65887) ([李扬](https://github.com/taiyang-li)).
* Allow controlling named collections in `clickhouse-local`. [#65973](https://github.com/ClickHouse/ClickHouse/pull/65973) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Improve Azure-related profile events. [#65999](https://github.com/ClickHouse/ClickHouse/pull/65999) ([alesapin](https://github.com/alesapin)).
* Support ORC file read by writer's time zone. [#66025](https://github.com/ClickHouse/ClickHouse/pull/66025) ([kevinyhzou](https://github.com/KevinyhZou)).
* Add settings to control connections to PostgreSQL. The setting `postgresql_connection_attempt_timeout` specifies the value passed to `connect_timeout` parameter of connection URL. The setting `postgresql_connection_pool_retries` specifies the number of retries to establish a connection to the PostgreSQL end-point. [#66232](https://github.com/ClickHouse/ClickHouse/pull/66232) ([Dmitry Novik](https://github.com/novikd)).
* Reduce inaccuracy of `input_wait_elapsed_us`/`elapsed_us` in the `system.processors_profile_log`. [#66239](https://github.com/ClickHouse/ClickHouse/pull/66239) ([Azat Khuzhin](https://github.com/azat)).
* Improve ProfileEvents for the filesystem cache. [#66249](https://github.com/ClickHouse/ClickHouse/pull/66249) ([zhukai](https://github.com/nauu)).
* Add settings to ignore the `ON CLUSTER` clause in queries for named collection management with the replicated storage. [#66288](https://github.com/ClickHouse/ClickHouse/pull/66288) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* Function `generateSnowflakeID` now allows to specify a machine ID as a parameter to prevent collisions in large clusters. [#66374](https://github.com/ClickHouse/ClickHouse/pull/66374) ([ZAWA\_ll](https://github.com/Zawa-ll)).
* Disable suspending on `Ctrl+Z` in interactive mode. This is a common trap and is not expected behavior for almost all users. I imagine only a few extreme power users could appreciate suspending terminal applications to the background, but I don't know any. [#66511](https://github.com/ClickHouse/ClickHouse/pull/66511) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add option for validating the primary key type in Dictionaries. Without this option for simple layouts any column type will be implicitly converted to UInt64. [#66595](https://github.com/ClickHouse/ClickHouse/pull/66595) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-4">
  Bug Fix (user-visible misbehavior in an official stable release)
</h4>

* Check cyclic dependencies on CREATE/REPLACE/RENAME/EXCHANGE queries and throw an exception if there is a cyclic dependency. Previously such cyclic dependencies could lead to a deadlock during server startup. Also fix some bugs in dependencies creation. [#65405](https://github.com/ClickHouse/ClickHouse/pull/65405) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix unexpected sizes of `LowCardinality` columns in function calls. [#65298](https://github.com/ClickHouse/ClickHouse/pull/65298) ([Raúl Marín](https://github.com/Algunenano)).
* Fix crash in maxIntersections. [#65689](https://github.com/ClickHouse/ClickHouse/pull/65689) ([Raúl Marín](https://github.com/Algunenano)).
* Fix the `VALID UNTIL` clause in the user definition resetting after a restart. [#66409](https://github.com/ClickHouse/ClickHouse/pull/66409) ([Nikolay Degterinsky](https://github.com/evillique)).
* Fix the remaining time column in `SHOW MERGES`. [#66735](https://github.com/ClickHouse/ClickHouse/pull/66735) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* `Query was cancelled` might have been printed twice in clickhouse-client. This behaviour is fixed. [#66005](https://github.com/ClickHouse/ClickHouse/pull/66005) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* Fixed crash while using `MaterializedMySQL` (which is an unsupported, experimental feature) with TABLE OVERRIDE that maps MySQL NULL field into ClickHouse not NULL field. [#54649](https://github.com/ClickHouse/ClickHouse/pull/54649) ([Filipp Ozinov](https://github.com/bakwc)).
* Fix logical error when `PREWHERE` expression read no columns and table has no adaptive index granularity (very old table). [#59173](https://github.com/ClickHouse/ClickHouse/pull/59173) ([Alexander Gololobov](https://github.com/davenger)).
* Fix bug with the cancellation buffer when canceling a query. [#64478](https://github.com/ClickHouse/ClickHouse/pull/64478) ([Sema Checherinda](https://github.com/CheSema)).
* Fix filling parts columns from metadata (when columns.txt does not exists). [#64757](https://github.com/ClickHouse/ClickHouse/pull/64757) ([Azat Khuzhin](https://github.com/azat)).
* Fix crash for `ALTER TABLE ... ON CLUSTER ... MODIFY SQL SECURITY`. [#64957](https://github.com/ClickHouse/ClickHouse/pull/64957) ([pufit](https://github.com/pufit)).
* Fix crash on destroying AccessControl: add explicit shutdown. [#64993](https://github.com/ClickHouse/ClickHouse/pull/64993) ([Vitaly Baranov](https://github.com/vitlibar)).
* Eliminate injective function in argument of functions `uniq*` recursively. This used to work correctly but was broken in the new analyzer. [#65140](https://github.com/ClickHouse/ClickHouse/pull/65140) ([Duc Canh Le](https://github.com/canhld94)).
* Fix unexpected projection name when query with CTE. [#65267](https://github.com/ClickHouse/ClickHouse/pull/65267) ([wudidapaopao](https://github.com/wudidapaopao)).
* Require `dictGet` privilege when accessing dictionaries via direct query or the `Dictionary` table engine. [#65359](https://github.com/ClickHouse/ClickHouse/pull/65359) ([Joe Lynch](https://github.com/joelynch)).
* Fix user-specific S3 auth with incremental backups. [#65481](https://github.com/ClickHouse/ClickHouse/pull/65481) ([Antonio Andelic](https://github.com/antonio2368)).
* Disable `non-intersecting-parts` optimization for queries with `FINAL` in case of `read-in-order` optimization was enabled. This could lead to an incorrect query result. As a workaround, disable `do_not_merge_across_partitions_select_final` and `split_parts_ranges_into_intersecting_and_non_intersecting_final` before this fix is merged. [#65505](https://github.com/ClickHouse/ClickHouse/pull/65505) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix getting exception `Index out of bound for blob metadata` in case all files from list batch were filtered out. [#65523](https://github.com/ClickHouse/ClickHouse/pull/65523) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix NOT\_FOUND\_COLUMN\_IN\_BLOCK for deduplicate merge of projection. [#65573](https://github.com/ClickHouse/ClickHouse/pull/65573) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* Fixed bug in MergeJoin. Column in sparse serialisation might be treated as a column of its nested type though the required conversion wasn't performed. [#65632](https://github.com/ClickHouse/ClickHouse/pull/65632) ([Nikita Taranov](https://github.com/nickitat)).
* Fixed a bug that compatibility level '23.4' was not properly applied. [#65737](https://github.com/ClickHouse/ClickHouse/pull/65737) ([cw5121](https://github.com/cw5121)).
* Fix odbc table with nullable fields. [#65738](https://github.com/ClickHouse/ClickHouse/pull/65738) ([Rodolphe Dugé de Bernonville](https://github.com/RodolpheDuge)).
* Fix data race in `TCPHandler`, which could happen on fatal error. [#65744](https://github.com/ClickHouse/ClickHouse/pull/65744) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix invalid exceptions in function `parseDateTime` with `%F` and `%D` placeholders. [#65768](https://github.com/ClickHouse/ClickHouse/pull/65768) ([Antonio Andelic](https://github.com/antonio2368)).
* For queries that read from `PostgreSQL`, cancel the internal `PostgreSQL` query if the ClickHouse query is finished. Otherwise, `ClickHouse` query cannot be canceled until the internal `PostgreSQL` query is finished. [#65771](https://github.com/ClickHouse/ClickHouse/pull/65771) ([Maksim Kita](https://github.com/kitaisreal)).
* Fix a bug in short circuit logic when old analyzer and dictGetOrDefault is used. [#65802](https://github.com/ClickHouse/ClickHouse/pull/65802) ([jsc0218](https://github.com/jsc0218)).
* Fix a bug leads to EmbeddedRocksDB with TTL write corrupted SST files. [#65816](https://github.com/ClickHouse/ClickHouse/pull/65816) ([Duc Canh Le](https://github.com/canhld94)).
* Functions `bitTest`, `bitTestAll`, and `bitTestAny` now return an error if the specified bit index is out-of-bounds [#65818](https://github.com/ClickHouse/ClickHouse/pull/65818) ([Pablo Marcos](https://github.com/pamarcos)).
* Setting `join_any_take_last_row` is supported in any query with hash join. [#65820](https://github.com/ClickHouse/ClickHouse/pull/65820) ([vdimir](https://github.com/vdimir)).
* Better handling of join conditions involving `IS NULL` checks (for example `ON (a = b AND (a IS NOT NULL) AND (b IS NOT NULL) ) OR ( (a IS NULL) AND (b IS NULL) )` is rewritten to `ON a <=> b`), fix incorrect optimization when condition other then `IS NULL` are present. [#65835](https://github.com/ClickHouse/ClickHouse/pull/65835) ([vdimir](https://github.com/vdimir)).
* Fix growing memory usage in S3Queue. [#65839](https://github.com/ClickHouse/ClickHouse/pull/65839) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix tie handling in `arrayAUC` to match sklearn. [#65840](https://github.com/ClickHouse/ClickHouse/pull/65840) ([gabrielmcg44](https://github.com/gabrielmcg44)).
* Fix possible issues with MySQL server protocol TLS connections. [#65917](https://github.com/ClickHouse/ClickHouse/pull/65917) ([Azat Khuzhin](https://github.com/azat)).
* Fix possible issues with MySQL client protocol TLS connections. [#65938](https://github.com/ClickHouse/ClickHouse/pull/65938) ([Azat Khuzhin](https://github.com/azat)).
* Fix handling of `SSL_ERROR_WANT_READ`/`SSL_ERROR_WANT_WRITE` with zero timeout. [#65941](https://github.com/ClickHouse/ClickHouse/pull/65941) ([Azat Khuzhin](https://github.com/azat)).
* Add missing settings `input_format_csv_skip_first_lines/input_format_tsv_skip_first_lines/input_format_csv_try_infer_numbers_from_strings/input_format_csv_try_infer_strings_from_quoted_tuples` in schema inference cache because they can change the resulting schema. It prevents from incorrect result of schema inference with these settings changed. [#65980](https://github.com/ClickHouse/ClickHouse/pull/65980) ([Kruglov Pavel](https://github.com/Avogar)).
* Column \_size in s3 engine and s3 table function denotes the size of a file inside the archive, not a size of the archive itself. [#65993](https://github.com/ClickHouse/ClickHouse/pull/65993) ([Daniil Ivanik](https://github.com/divanik)).
* Fix resolving dynamic subcolumns in analyzer, avoid reading the whole column on dynamic subcolumn reading. [#66004](https://github.com/ClickHouse/ClickHouse/pull/66004) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix config merging for from\_env with replace overrides. [#66034](https://github.com/ClickHouse/ClickHouse/pull/66034) ([Azat Khuzhin](https://github.com/azat)).
* Fix a possible hanging in `GRPCServer` during shutdown. [#66061](https://github.com/ClickHouse/ClickHouse/pull/66061) ([Vitaly Baranov](https://github.com/vitlibar)).
* Fixed several cases in function `has` with non-constant `LowCardinality` arguments. [#66088](https://github.com/ClickHouse/ClickHouse/pull/66088) ([Anton Popov](https://github.com/CurtizJ)).
* Fix for `groupArrayIntersect`. It had incorrect behavior in the `merge()` function. Also, fixed behavior in `deserialise()` for numeric and general data. [#66103](https://github.com/ClickHouse/ClickHouse/pull/66103) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* Fixed buffer overflow bug in `unbin`/`unhex` implementation. [#66106](https://github.com/ClickHouse/ClickHouse/pull/66106) ([Nikita Taranov](https://github.com/nickitat)).
* Disable the `merge-filters` optimization introduced in [#64760](https://github.com/ClickHouse/ClickHouse/issues/64760). It may cause an exception if optimization merges two filter expressions and does not apply a short-circuit evaluation. [#66126](https://github.com/ClickHouse/ClickHouse/pull/66126) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fixed the issue when the server failed to parse Avro files with negative block size arrays encoded, which is now allowed by the Avro specification. [#66130](https://github.com/ClickHouse/ClickHouse/pull/66130) ([Serge Klochkov](https://github.com/slvrtrn)).
* Fixed a bug in ZooKeeper client: a session could get stuck in unusable state after receiving a hardware error from ZooKeeper. For example, this might happen due to "soft memory limit" in ClickHouse Keeper. [#66140](https://github.com/ClickHouse/ClickHouse/pull/66140) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix issue in SumIfToCountIfVisitor and signed integers. [#66146](https://github.com/ClickHouse/ClickHouse/pull/66146) ([Raúl Marín](https://github.com/Algunenano)).
* Fix rare case with missing data in the result of distributed query. [#66174](https://github.com/ClickHouse/ClickHouse/pull/66174) ([vdimir](https://github.com/vdimir)).
* Fix order of parsing metadata fields in StorageDeltaLake. [#66211](https://github.com/ClickHouse/ClickHouse/pull/66211) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Don't throw `TIMEOUT_EXCEEDED` for `none_only_active` mode of `distributed_ddl_output_mode`. [#66218](https://github.com/ClickHouse/ClickHouse/pull/66218) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix handling limit for `system.numbers_mt` when no index can be used. [#66231](https://github.com/ClickHouse/ClickHouse/pull/66231) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* Fixed how the ClickHouse server detects the maximum number of usable CPU cores as specified by cgroups v2 if the server runs in a container such as Docker. In more detail, containers often run their process in the root cgroup which has an empty name. In that case, ClickHouse ignored the CPU limits set by cgroups v2. [#66237](https://github.com/ClickHouse/ClickHouse/pull/66237) ([filimonov](https://github.com/filimonov)).
* Fix the `Not-ready set` error when a subquery with `IN` is used in the constraint. [#66261](https://github.com/ClickHouse/ClickHouse/pull/66261) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix error reporting while copying to S3 or AzureBlobStorage. [#66295](https://github.com/ClickHouse/ClickHouse/pull/66295) ([Vitaly Baranov](https://github.com/vitlibar)).
* Prevent watchdog from keeping descriptors of unlinked (rotated) log files. [#66334](https://github.com/ClickHouse/ClickHouse/pull/66334) ([Aleksei Filatov](https://github.com/aalexfvk)).
* Fix the bug that logicalexpressionoptimizerpass lost logical type of constant. [#66344](https://github.com/ClickHouse/ClickHouse/pull/66344) ([pn](https://github.com/chloro-pn)).
* Fix `Column identifier is already registered` error with `group_by_use_nulls=true` and new analyzer. [#66400](https://github.com/ClickHouse/ClickHouse/pull/66400) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix possible incorrect result for queries joining and filtering table external engine (like PostgreSQL), due to too aggressive filter pushdown. Since now, conditions from where section won't be send to external database in case of outer join with external table. [#66402](https://github.com/ClickHouse/ClickHouse/pull/66402) ([vdimir](https://github.com/vdimir)).
* Added missing column materialization for cross join. [#66413](https://github.com/ClickHouse/ClickHouse/pull/66413) ([lgbo](https://github.com/lgbo-ustc)).
* Fix `Cannot find column` error for queries with constant expression in `GROUP BY` key and new analyzer enabled. [#66433](https://github.com/ClickHouse/ClickHouse/pull/66433) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Avoid possible logical error during import from Npy format in case of bad array nesting level, fix testing of other kinds of errors. [#66461](https://github.com/ClickHouse/ClickHouse/pull/66461) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* Fix wrong count() result when there is non-deterministic function in predicate. [#66510](https://github.com/ClickHouse/ClickHouse/pull/66510) ([Duc Canh Le](https://github.com/canhld94)).
* Correctly track memory for `Allocator::realloc`. [#66548](https://github.com/ClickHouse/ClickHouse/pull/66548) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix reading of uninitialized memory when hashing empty tuples. [#66562](https://github.com/ClickHouse/ClickHouse/pull/66562) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix an invalid result for queries with `WINDOW`. This could happen when `PARTITION` columns have sparse serialization and window functions are executed in parallel. [#66579](https://github.com/ClickHouse/ClickHouse/pull/66579) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix removing named collections in local storage. [#66599](https://github.com/ClickHouse/ClickHouse/pull/66599) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* Fix `column_length` is not updated in `ColumnTuple::insertManyFrom`. [#66626](https://github.com/ClickHouse/ClickHouse/pull/66626) ([lgbo](https://github.com/lgbo-ustc)).
* Fix `Unknown identifier` and `Column is not under aggregate function` errors for queries with the expression `(column IS NULL).` The bug was triggered by [#65088](https://github.com/ClickHouse/ClickHouse/issues/65088), with the disabled analyzer only. [#66654](https://github.com/ClickHouse/ClickHouse/pull/66654) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix `Method getResultType is not supported for QUERY query node` error when scalar subquery was used as the first argument of IN (with new analyzer). [#66655](https://github.com/ClickHouse/ClickHouse/pull/66655) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix possible PARAMETER\_OUT\_OF\_BOUND error during reading variant subcolumn. [#66659](https://github.com/ClickHouse/ClickHouse/pull/66659) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix rare case of stuck merge after drop column. [#66707](https://github.com/ClickHouse/ClickHouse/pull/66707) ([Raúl Marín](https://github.com/Algunenano)).
* Fix assertion `isUniqTypes` when insert select from remote sources. [#66722](https://github.com/ClickHouse/ClickHouse/pull/66722) ([Sema Checherinda](https://github.com/CheSema)).
* Fix logical error in PrometheusRequestHandler. [#66621](https://github.com/ClickHouse/ClickHouse/pull/66621) ([Vitaly Baranov](https://github.com/vitlibar)).
* Fix `indexHint` function case found by fuzzer. [#66286](https://github.com/ClickHouse/ClickHouse/pull/66286) ([Anton Popov](https://github.com/CurtizJ)).
* Fix AST formatting of 'create table b empty as a'. [#64951](https://github.com/ClickHouse/ClickHouse/pull/64951) ([Michael Kolupaev](https://github.com/al13n321)).
