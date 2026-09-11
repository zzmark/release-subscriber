<h3 id="a-id227a-clickhouse-release-227-2022-07-21">
  <a id="227" /> ClickHouse release 22.7, 2022-07-21. [Presentation](https://presentations.clickhouse.com/2022-release-22.7/), [Video](https://www.youtube.com/watch?v=IOJyo14BpTQ)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/IOJyo14BpTQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="upgrade-notes-1">
  Upgrade Notes
</h4>

* Enable setting `enable_positional_arguments` by default. It allows queries like `SELECT ... ORDER BY 1, 2` where 1, 2 are the references to the select clause. If you need to return the old behavior, disable this setting. [#38204](https://github.com/ClickHouse/ClickHouse/pull/38204) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Disable `format_csv_allow_single_quotes` by default. See [#37096](https://github.com/ClickHouse/ClickHouse/issues/37096). ([Kruglov Pavel](https://github.com/Avogar)).
* `Ordinary` database engine and old storage definition syntax for `*MergeTree` tables are deprecated. By default it's not possible to create new databases with `Ordinary` engine. If `system` database has `Ordinary` engine it will be automatically converted to `Atomic` on server startup. There are settings to keep old behavior (`allow_deprecated_database_ordinary` and `allow_deprecated_syntax_for_merge_tree`), but these settings may be removed in future releases. [#38335](https://github.com/ClickHouse/ClickHouse/pull/38335) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Force rewriting comma join to inner by default (set default value `cross_to_inner_join_rewrite = 2`). To have old behavior set `cross_to_inner_join_rewrite = 1`. [#39326](https://github.com/ClickHouse/ClickHouse/pull/39326) ([Vladimir C](https://github.com/vdimir)). If you will face any incompatibilities, you can turn this setting back.

<h4 id="new-feature-5">
  New Feature
</h4>

* Support expressions with window functions. Closes [#19857](https://github.com/ClickHouse/ClickHouse/issues/19857). [#37848](https://github.com/ClickHouse/ClickHouse/pull/37848) ([Dmitry Novik](https://github.com/novikd)).
* Add new `direct` join algorithm for `EmbeddedRocksDB` tables, see [#33582](https://github.com/ClickHouse/ClickHouse/issues/33582). [#35363](https://github.com/ClickHouse/ClickHouse/pull/35363) ([Vladimir C](https://github.com/vdimir)).
* Added full sorting merge join algorithm. [#35796](https://github.com/ClickHouse/ClickHouse/pull/35796) ([Vladimir C](https://github.com/vdimir)).
* Implement NATS table engine, which allows to pub/sub to NATS. Closes [#32388](https://github.com/ClickHouse/ClickHouse/issues/32388). [#37171](https://github.com/ClickHouse/ClickHouse/pull/37171) ([tchepavel](https://github.com/tchepavel)). ([Kseniia Sumarokova](https://github.com/kssenii))
* Implement table function `mongodb`. Allow writes into `MongoDB` storage / table function. [#37213](https://github.com/ClickHouse/ClickHouse/pull/37213) ([aaapetrenko](https://github.com/aaapetrenko)). ([Kseniia Sumarokova](https://github.com/kssenii))
* Add `SQLInsert` output format. Closes [#38441](https://github.com/ClickHouse/ClickHouse/issues/38441). [#38477](https://github.com/ClickHouse/ClickHouse/pull/38477) ([Kruglov Pavel](https://github.com/Avogar)).
* Introduced settings `additional_table_filters`. Using this setting, you can specify additional filtering condition for a table which will be applied directly after reading. Example: `select number, x, y from (select number from system.numbers limit 5) f any left join (select x, y from table_1) s on f.number = s.x settings additional_table_filters={'system.numbers : 'number != 3', 'table_1' : 'x != 2'}`. Introduced setting `additional_result_filter` which specifies additional filtering condition for query result. Closes [#37918](https://github.com/ClickHouse/ClickHouse/issues/37918). [#38475](https://github.com/ClickHouse/ClickHouse/pull/38475) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Add `compatibility` setting and `system.settings_changes` system table that contains information about changes in settings through ClickHouse versions. Closes [#35972](https://github.com/ClickHouse/ClickHouse/issues/35972). [#38957](https://github.com/ClickHouse/ClickHouse/pull/38957) ([Kruglov Pavel](https://github.com/Avogar)).
* Add functions `translate(string, from_string, to_string)` and `translateUTF8(string, from_string, to_string)`. It translates some characters to another. [#38935](https://github.com/ClickHouse/ClickHouse/pull/38935) ([Nikolay Degterinsky](https://github.com/evillique)).
* Support `parseTimeDelta` function. It can be used like ` ;-+,:` can be used as separators, eg. `1yr-2mo`, `2m:6s`: `SELECT parseTimeDelta('1yr-2mo-4w + 12 days, 3 hours : 1 minute ; 33 seconds')`. [#39071](https://github.com/ClickHouse/ClickHouse/pull/39071) ([jiahui-97](https://github.com/jiahui-97)).
* Added `CREATE TABLE ... EMPTY AS SELECT` query. It automatically deduces table structure from the SELECT query, but does not fill the table after creation. Resolves [#38049](https://github.com/ClickHouse/ClickHouse/issues/38049). [#38272](https://github.com/ClickHouse/ClickHouse/pull/38272) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Added options to limit IO operations with remote storage: `max_remote_read_network_bandwidth_for_server` and `max_remote_write_network_bandwidth_for_server`. [#39095](https://github.com/ClickHouse/ClickHouse/pull/39095) ([Sergei Trifonov](https://github.com/serxa)).
* Add `group_by_use_nulls` setting to make aggregation key columns nullable in the case of ROLLUP, CUBE and GROUPING SETS. Closes [#37359](https://github.com/ClickHouse/ClickHouse/issues/37359). [#38642](https://github.com/ClickHouse/ClickHouse/pull/38642) ([Dmitry Novik](https://github.com/novikd)).
* Add the ability to specify compression level during data export. [#38907](https://github.com/ClickHouse/ClickHouse/pull/38907) ([Nikolay Degterinsky](https://github.com/evillique)).
* Add an option to require explicit grants to SELECT from the `system` database. Details: [#38970](https://github.com/ClickHouse/ClickHouse/pull/38970) ([Vitaly Baranov](https://github.com/vitlibar)).
* Functions `multiMatchAny`, `multiMatchAnyIndex`, `multiMatchAllIndices` and their fuzzy variants now accept non-const pattern array argument. [#38485](https://github.com/ClickHouse/ClickHouse/pull/38485) ([Robert Schulze](https://github.com/rschu1ze)). SQL function `multiSearchAllPositions` now accepts non-const needle arguments. [#39167](https://github.com/ClickHouse/ClickHouse/pull/39167) ([Robert Schulze](https://github.com/rschu1ze)).
* Add a setting `zstd_window_log_max` to configure max memory usage on zstd decoding when importing external files. Closes [#35693](https://github.com/ClickHouse/ClickHouse/issues/35693). [#37015](https://github.com/ClickHouse/ClickHouse/pull/37015) ([wuxiaobai24](https://github.com/wuxiaobai24)).
* Add `send_logs_source_regexp` setting. Send server text logs with specified regexp to match log source name. Empty means all sources. [#39161](https://github.com/ClickHouse/ClickHouse/pull/39161) ([Amos Bird](https://github.com/amosbird)).
* Support `ALTER` for `Hive` tables. [#38214](https://github.com/ClickHouse/ClickHouse/pull/38214) ([lgbo](https://github.com/lgbo-ustc)).
* Support `isNullable` function. This function checks whether it's argument is nullable and return 1 or 0. Closes [#38611](https://github.com/ClickHouse/ClickHouse/issues/38611). [#38841](https://github.com/ClickHouse/ClickHouse/pull/38841) ([lokax](https://github.com/lokax)).
* Added functions for base58 encoding/decoding. [#38159](https://github.com/ClickHouse/ClickHouse/pull/38159) ([Andrey Zvonov](https://github.com/zvonand)).
* Add chart visualization to Play UI. [#38197](https://github.com/ClickHouse/ClickHouse/pull/38197) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Added L2 Squared distance and norm functions for both arrays and tuples. [#38545](https://github.com/ClickHouse/ClickHouse/pull/38545) ([Julian Gilyadov](https://github.com/israelg99)).
* Add ability to pass HTTP headers to the `url` table function / storage via SQL. Closes [#37897](https://github.com/ClickHouse/ClickHouse/issues/37897). [#38176](https://github.com/ClickHouse/ClickHouse/pull/38176) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Add `clickhouse-diagnostics` binary to the packages. [#38647](https://github.com/ClickHouse/ClickHouse/pull/38647) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).

<h4 id="experimental-feature-4">
  Experimental Feature
</h4>

* Adds new setting `implicit_transaction` to run standalone queries inside a transaction. It handles both creation and closing (via COMMIT if the query succeeded or ROLLBACK if it didn't) of the transaction automatically. [#38344](https://github.com/ClickHouse/ClickHouse/pull/38344) ([Raúl Marín](https://github.com/Algunenano)).

<h4 id="performance-improvement-5">
  Performance Improvement
</h4>

* Distinct optimization for sorted columns. Use specialized distinct transformation in case input stream is sorted by column(s) in distinct. Optimization can be applied to pre-distinct, final distinct, or both. Initial implementation by @dimarub2000. [#37803](https://github.com/ClickHouse/ClickHouse/pull/37803) ([Igor Nikonov](https://github.com/devcrafter)).
* Improve performance of `ORDER BY`, `MergeTree` merges, window functions using batch version of `BinaryHeap`. [#38022](https://github.com/ClickHouse/ClickHouse/pull/38022) ([Maksim Kita](https://github.com/kitaisreal)).
* More parallel execution for queries with `FINAL` [#36396](https://github.com/ClickHouse/ClickHouse/pull/36396) ([Nikita Taranov](https://github.com/nickitat)).
* Fix significant join performance regression which was introduced in [#35616](https://github.com/ClickHouse/ClickHouse/pull/35616). It's interesting that common join queries such as ssb queries have been 10 times slower for almost 3 months while no one complains. [#38052](https://github.com/ClickHouse/ClickHouse/pull/38052) ([Amos Bird](https://github.com/amosbird)).
* Migrate from the Intel hyperscan library to vectorscan, this speeds up many string matching on non-x86 platforms. [#38171](https://github.com/ClickHouse/ClickHouse/pull/38171) ([Robert Schulze](https://github.com/rschu1ze)).
* Increased parallelism of query plan steps executed after aggregation. [#38295](https://github.com/ClickHouse/ClickHouse/pull/38295) ([Nikita Taranov](https://github.com/nickitat)).
* Improve performance of insertion to columns of type `JSON`. [#38320](https://github.com/ClickHouse/ClickHouse/pull/38320) ([Anton Popov](https://github.com/CurtizJ)).
* Optimized insertion and lookups in the HashTable. [#38413](https://github.com/ClickHouse/ClickHouse/pull/38413) ([Nikita Taranov](https://github.com/nickitat)).
* Fix performance degradation from [#32493](https://github.com/ClickHouse/ClickHouse/issues/32493). [#38417](https://github.com/ClickHouse/ClickHouse/pull/38417) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Improve performance of joining with numeric columns using SIMD instructions. [#37235](https://github.com/ClickHouse/ClickHouse/pull/37235) ([zzachimed](https://github.com/zzachimed)). [#38565](https://github.com/ClickHouse/ClickHouse/pull/38565) ([Maksim Kita](https://github.com/kitaisreal)).
* Norm and Distance functions for arrays speed up 1.2-2 times. [#38740](https://github.com/ClickHouse/ClickHouse/pull/38740) ([Alexander Gololobov](https://github.com/davenger)).
* Add AVX-512 VBMI optimized `copyOverlap32Shuffle` for LZ4 decompression. In other words, LZ4 decompression performance is improved. [#37891](https://github.com/ClickHouse/ClickHouse/pull/37891) ([Guo Wangyang](https://github.com/guowangy)).
* `ORDER BY (a, b)` will use all the same benefits as `ORDER BY a, b`. [#38873](https://github.com/ClickHouse/ClickHouse/pull/38873) ([Igor Nikonov](https://github.com/devcrafter)).
* Align branches within a 32B boundary to make benchmark more stable. [#38988](https://github.com/ClickHouse/ClickHouse/pull/38988) ([Guo Wangyang](https://github.com/guowangy)). It improves performance 1..2% on average for Intel.
* Executable UDF, executable dictionaries, and Executable tables will avoid wasting one second during wait for subprocess termination. [#38929](https://github.com/ClickHouse/ClickHouse/pull/38929) ([Constantine Peresypkin](https://github.com/pkit)).
* Optimize accesses to `system.stack_trace` table if not all columns are selected. [#39177](https://github.com/ClickHouse/ClickHouse/pull/39177) ([Azat Khuzhin](https://github.com/azat)).
* Improve isNullable/isConstant/isNull/isNotNull performance for LowCardinality argument. [#39192](https://github.com/ClickHouse/ClickHouse/pull/39192) ([Kruglov Pavel](https://github.com/Avogar)).
* Optimized processing of ORDER BY in window functions. [#34632](https://github.com/ClickHouse/ClickHouse/pull/34632) ([Vladimir Chebotarev](https://github.com/excitoon)).
* The table `system.asynchronous_metric_log` is further optimized for storage space. This closes [#38134](https://github.com/ClickHouse/ClickHouse/issues/38134). See the [YouTube video](https://www.youtube.com/watch?v=0fSp9SF8N8A). [#38428](https://github.com/ClickHouse/ClickHouse/pull/38428) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="improvement-5">
  Improvement
</h4>

* Support SQL standard CREATE INDEX and DROP INDEX syntax. [#35166](https://github.com/ClickHouse/ClickHouse/pull/35166) ([Jianmei Zhang](https://github.com/zhangjmruc)).
* Send profile events for INSERT queries (previously only SELECT was supported). [#37391](https://github.com/ClickHouse/ClickHouse/pull/37391) ([Azat Khuzhin](https://github.com/azat)).
* Implement in order aggregation (`optimize_aggregation_in_order`) for fully materialized projections. [#37469](https://github.com/ClickHouse/ClickHouse/pull/37469) ([Azat Khuzhin](https://github.com/azat)).
* Remove subprocess run for kerberos initialization. Added new integration test. Closes [#27651](https://github.com/ClickHouse/ClickHouse/issues/27651). [#38105](https://github.com/ClickHouse/ClickHouse/pull/38105) ([Roman Vasin](https://github.com/rvasin)).
* * Add setting `multiple_joins_try_to_keep_original_names` to not rewrite identifier name on multiple JOINs rewrite, close [#34697](https://github.com/ClickHouse/ClickHouse/issues/34697). [#38149](https://github.com/ClickHouse/ClickHouse/pull/38149) ([Vladimir C](https://github.com/vdimir)).
* Improved trace-visualizer UX. [#38169](https://github.com/ClickHouse/ClickHouse/pull/38169) ([Sergei Trifonov](https://github.com/serxa)).
* Enable stack trace collection and query profiler for AArch64. [#38181](https://github.com/ClickHouse/ClickHouse/pull/38181) ([Maksim Kita](https://github.com/kitaisreal)).
* Do not skip symlinks in `user_defined` directory during SQL user defined functions loading. Closes [#38042](https://github.com/ClickHouse/ClickHouse/issues/38042). [#38184](https://github.com/ClickHouse/ClickHouse/pull/38184) ([Maksim Kita](https://github.com/kitaisreal)).
* Added background cleanup of subdirectories in `store/`. In some cases clickhouse-server might left garbage subdirectories in `store/` (for example, on unsuccessful table creation) and those dirs were never been removed. Fixes [#33710](https://github.com/ClickHouse/ClickHouse/issues/33710). [#38265](https://github.com/ClickHouse/ClickHouse/pull/38265) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Add `DESCRIBE CACHE` query to show cache settings from config. Add `SHOW CACHES` query to show available filesystem caches list. [#38279](https://github.com/ClickHouse/ClickHouse/pull/38279) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Add access check for `system drop filesystem cache`. Support ON CLUSTER. [#38319](https://github.com/ClickHouse/ClickHouse/pull/38319) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix PostgreSQL database engine incompatibility on upgrade from 21.3 to 22.3. Closes [#36659](https://github.com/ClickHouse/ClickHouse/issues/36659). [#38369](https://github.com/ClickHouse/ClickHouse/pull/38369) ([Kseniia Sumarokova](https://github.com/kssenii)).
* `filesystemAvailable` and similar functions now work in `clickhouse-local`. This closes [#38423](https://github.com/ClickHouse/ClickHouse/issues/38423). [#38424](https://github.com/ClickHouse/ClickHouse/pull/38424) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add `revision` function. [#38555](https://github.com/ClickHouse/ClickHouse/pull/38555) ([Azat Khuzhin](https://github.com/azat)).
* Fix GCS via proxy tunnel usage. [#38726](https://github.com/ClickHouse/ClickHouse/pull/38726) ([Azat Khuzhin](https://github.com/azat)).
* Support `\i file` in clickhouse client / local (similar to psql \i). [#38813](https://github.com/ClickHouse/ClickHouse/pull/38813) ([Kseniia Sumarokova](https://github.com/kssenii)).
* New option `optimize = 1` in `EXPLAIN AST`. If enabled, it shows AST after it's rewritten, otherwise AST of original query. Disabled by default. [#38910](https://github.com/ClickHouse/ClickHouse/pull/38910) ([Igor Nikonov](https://github.com/devcrafter)).
* Allow trailing comma in columns list. closes [#38425](https://github.com/ClickHouse/ClickHouse/issues/38425). [#38440](https://github.com/ClickHouse/ClickHouse/pull/38440) ([chen](https://github.com/xiedeyantu)).
* Bugfixes and performance improvements for `parallel_hash` JOIN method. [#37648](https://github.com/ClickHouse/ClickHouse/pull/37648) ([Vladimir C](https://github.com/vdimir)).
* Support hadoop secure RPC transfer (hadoop.rpc.protection=privacy and hadoop.rpc.protection=integrity). [#37852](https://github.com/ClickHouse/ClickHouse/pull/37852) ([Peng Liu](https://github.com/michael1589)).
* Add struct type support in `StorageHive`. [#38118](https://github.com/ClickHouse/ClickHouse/pull/38118) ([lgbo](https://github.com/lgbo-ustc)).
* S3 single objects are now removed with `RemoveObjectRequest`. Implement compatibility with  GCP which did not allow to use `removeFileIfExists` effectively breaking approximately half of `remove` functionality. Automatic detection for `DeleteObjects` S3 API, that is not supported by GCS. This will allow to use GCS without explicit `support_batch_delete=0` in configuration. [#37882](https://github.com/ClickHouse/ClickHouse/pull/37882) ([Vladimir Chebotarev](https://github.com/excitoon)).
* Expose basic ClickHouse Keeper related monitoring data (via ProfileEvents and CurrentMetrics). [#38072](https://github.com/ClickHouse/ClickHouse/pull/38072) ([lingpeng0314](https://github.com/lingpeng0314)).
* Support `auto_close` option for PostgreSQL engine connection. Closes [#31486](https://github.com/ClickHouse/ClickHouse/issues/31486). [#38363](https://github.com/ClickHouse/ClickHouse/pull/38363) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Allow `NULL` modifier in columns declaration for table functions. [#38816](https://github.com/ClickHouse/ClickHouse/pull/38816) ([Kruglov Pavel](https://github.com/Avogar)).
* Deactivate `mutations_finalizing_task` before shutdown to avoid benign `TABLE_IS_READ_ONLY` errors during shutdown. [#38851](https://github.com/ClickHouse/ClickHouse/pull/38851) ([Raúl Marín](https://github.com/Algunenano)).
* Eliminate unnecessary waiting of SELECT queries after ALTER queries in presence of INSERT queries if you use deprecated Ordinary databases. [#38864](https://github.com/ClickHouse/ClickHouse/pull/38864) ([Azat Khuzhin](https://github.com/azat)).
* New option `rewrite` in `EXPLAIN AST`. If enabled, it shows AST after it's rewritten, otherwise AST of original query. Disabled by default. [#38910](https://github.com/ClickHouse/ClickHouse/pull/38910) ([Igor Nikonov](https://github.com/devcrafter)).
* Stop reporting Zookeeper "Node exists" exceptions in system.errors when they are expected. [#38961](https://github.com/ClickHouse/ClickHouse/pull/38961) ([Raúl Marín](https://github.com/Algunenano)).
* `clickhouse-keeper`: add support for real-time digest calculation and verification. It is disabled by default. [#37555](https://github.com/ClickHouse/ClickHouse/pull/37555) ([Antonio Andelic](https://github.com/antonio2368)).
* Allow to specify globs `* or {expr1, expr2, expr3}` inside a key for `clickhouse-extract-from-config` tool. [#38966](https://github.com/ClickHouse/ClickHouse/pull/38966) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* clearOldLogs: Don't report KEEPER\_EXCEPTION on concurrent deletes. [#39016](https://github.com/ClickHouse/ClickHouse/pull/39016) ([Raúl Marín](https://github.com/Algunenano)).
* clickhouse-keeper improvement: persist meta-information about keeper servers to disk. [#39069](https://github.com/ClickHouse/ClickHouse/pull/39069) ([Antonio Andelic](https://github.com/antonio2368)). This will make it easier to operate if you shutdown or restart all keeper nodes at the same time.
* Continue without exception when running out of disk space when using filesystem cache. [#39106](https://github.com/ClickHouse/ClickHouse/pull/39106) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Handling SIGTERM signals from k8s. [#39130](https://github.com/ClickHouse/ClickHouse/pull/39130) ([Timur Solodovnikov](https://github.com/tsolodov)).
* Add `merge_algorithm` column (Undecided, Horizontal, Vertical) to system.part\_log. [#39181](https://github.com/ClickHouse/ClickHouse/pull/39181) ([Azat Khuzhin](https://github.com/azat)).
* Don't increment a counter in `system.errors` when the disk is not rotational. [#39216](https://github.com/ClickHouse/ClickHouse/pull/39216) ([Raúl Marín](https://github.com/Algunenano)).
* The metric `result_bytes` for `INSERT` queries in `system.query_log` shows number of bytes inserted. Previously value was incorrect and stored the same value as `result_rows`. [#39225](https://github.com/ClickHouse/ClickHouse/pull/39225) ([Ilya Yatsishin](https://github.com/qoega)).
* The CPU usage metric in clickhouse-client will be displayed in a better way. Fixes [#38756](https://github.com/ClickHouse/ClickHouse/issues/38756). [#39280](https://github.com/ClickHouse/ClickHouse/pull/39280) ([Sergei Trifonov](https://github.com/serxa)).
* Rethrow exception on filesystem cache initialization on server startup, better error message. [#39386](https://github.com/ClickHouse/ClickHouse/pull/39386) ([Kseniia Sumarokova](https://github.com/kssenii)).
* OpenTelemetry now collects traces without Processors spans by default (there are too many). To enable Processors spans collection `opentelemetry_trace_processors` setting. [#39170](https://github.com/ClickHouse/ClickHouse/pull/39170) ([Ilya Yatsishin](https://github.com/qoega)).
* Functions `multiMatch[Fuzzy](AllIndices/Any/AnyIndex)` - don't throw a logical error if the needle argument is empty. [#39012](https://github.com/ClickHouse/ClickHouse/pull/39012) ([Robert Schulze](https://github.com/rschu1ze)).
* Allow to declare `RabbitMQ` queue without default arguments `x-max-length` and `x-overflow`. [#39259](https://github.com/ClickHouse/ClickHouse/pull/39259) ([rnbondarenko](https://github.com/rnbondarenko)).

<h4 id="buildtestingpackaging-improvement-5">
  Build/Testing/Packaging Improvement
</h4>

* Apply Clang Thread Safety Analysis (TSA) annotations to ClickHouse. [#38068](https://github.com/ClickHouse/ClickHouse/pull/38068) ([Robert Schulze](https://github.com/rschu1ze)).
* Adapt universal installation script for FreeBSD. [#39302](https://github.com/ClickHouse/ClickHouse/pull/39302) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Preparation for building on `s390x` platform. [#39193](https://github.com/ClickHouse/ClickHouse/pull/39193) ([Harry Lee](https://github.com/HarryLeeIBM)).
* Fix a bug in `jemalloc` library [#38757](https://github.com/ClickHouse/ClickHouse/pull/38757) ([Azat Khuzhin](https://github.com/azat)).
* Hardware benchmark now has support for automatic results uploading. [#38427](https://github.com/ClickHouse/ClickHouse/pull/38427) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* System table "system.licenses" is now correctly populated on Mac (Darwin). [#38294](https://github.com/ClickHouse/ClickHouse/pull/38294) ([Robert Schulze](https://github.com/rschu1ze)).
* Change `all|noarch` packages to architecture-dependent - Fix some documentation for it - Push aarch64|arm64 packages to artifactory and release assets - Fixes [#36443](https://github.com/ClickHouse/ClickHouse/issues/36443). [#38580](https://github.com/ClickHouse/ClickHouse/pull/38580) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).

<h4 id="bug-fix-user-visible-misbehavior-in-official-stable-or-prestable-release-3">
  Bug Fix (user-visible misbehavior in official stable or prestable release)
</h4>

* Fix rounding for `Decimal128/Decimal256` with more than 19-digits long scale. [#38027](https://github.com/ClickHouse/ClickHouse/pull/38027) ([Igor Nikonov](https://github.com/devcrafter)).
* Fixed crash caused by data race in storage `Hive` (integration table engine). [#38887](https://github.com/ClickHouse/ClickHouse/pull/38887) ([lgbo](https://github.com/lgbo-ustc)).
* Fix crash when executing GRANT ALL ON *.* with ON CLUSTER. It was broken in [https://github.com/ClickHouse/ClickHouse/pull/35767](https://github.com/ClickHouse/ClickHouse/pull/35767). This closes [#38618](https://github.com/ClickHouse/ClickHouse/issues/38618). [#38674](https://github.com/ClickHouse/ClickHouse/pull/38674) ([Vitaly Baranov](https://github.com/vitlibar)).
* Correct glob expansion in case of `{0..10}` forms. Fixes [#38498](https://github.com/ClickHouse/ClickHouse/issues/38498) Current Implementation is similar to what shell does mentiond by @rschu1ze [here](https://github.com/ClickHouse/ClickHouse/pull/38502#issuecomment-1169057723). [#38502](https://github.com/ClickHouse/ClickHouse/pull/38502) ([Heena Bansal](https://github.com/HeenaBansal2009)).
* Fix crash for `mapUpdate`, `mapFilter` functions when using with constant map argument. Closes [#38547](https://github.com/ClickHouse/ClickHouse/issues/38547). [#38553](https://github.com/ClickHouse/ClickHouse/pull/38553) ([hexiaoting](https://github.com/hexiaoting)).
* Fix `toHour` monotonicity information for query optimization which can lead to incorrect query result (incorrect index analysis). This fixes [#38333](https://github.com/ClickHouse/ClickHouse/issues/38333). [#38675](https://github.com/ClickHouse/ClickHouse/pull/38675) ([Amos Bird](https://github.com/amosbird)).
* Fix checking whether s3 storage support parallel writes. It resulted in s3 parallel writes not working. [#38792](https://github.com/ClickHouse/ClickHouse/pull/38792) ([chen](https://github.com/xiedeyantu)).
* Fix s3 seekable reads with parallel read buffer. (Affected memory usage during query). Closes [#38258](https://github.com/ClickHouse/ClickHouse/issues/38258). [#38802](https://github.com/ClickHouse/ClickHouse/pull/38802) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Update `simdjson`. This fixes [#38621](https://github.com/ClickHouse/ClickHouse/issues/38621) - a buffer overflow on machines with the latest Intel CPUs with AVX-512 VBMI. [#38838](https://github.com/ClickHouse/ClickHouse/pull/38838) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix possible logical error for Vertical merges. [#38859](https://github.com/ClickHouse/ClickHouse/pull/38859) ([Maksim Kita](https://github.com/kitaisreal)).
* Fix settings profile with seconds unit. [#38896](https://github.com/ClickHouse/ClickHouse/pull/38896) ([Raúl Marín](https://github.com/Algunenano)).
* Fix incorrect partition pruning when there is a nullable partition key. Note: most likely you don't use nullable partition keys - this is an obscure feature you should not use. Nullable keys are a nonsense and this feature is only needed for some crazy use-cases. This fixes [#38941](https://github.com/ClickHouse/ClickHouse/issues/38941). [#38946](https://github.com/ClickHouse/ClickHouse/pull/38946) ([Amos Bird](https://github.com/amosbird)).
* Improve `fsync_part_directory` for fetches. [#38993](https://github.com/ClickHouse/ClickHouse/pull/38993) ([Azat Khuzhin](https://github.com/azat)).
* Fix possible dealock inside `OvercommitTracker`. Fixes [#37794](https://github.com/ClickHouse/ClickHouse/issues/37794). [#39030](https://github.com/ClickHouse/ClickHouse/pull/39030) ([Dmitry Novik](https://github.com/novikd)).
* Fix bug in filesystem cache that could happen in some corner case which coincided with cache capacity hitting the limit. Closes [#39066](https://github.com/ClickHouse/ClickHouse/issues/39066). [#39070](https://github.com/ClickHouse/ClickHouse/pull/39070) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix some corner cases of interpretation of the arguments of window expressions. Fixes [#38538](https://github.com/ClickHouse/ClickHouse/issues/38538) Allow using of higher-order functions in window expressions. [#39112](https://github.com/ClickHouse/ClickHouse/pull/39112) ([Dmitry Novik](https://github.com/novikd)).
* Keep `LowCardinality` type in `tuple` function. Previously `LowCardinality` type was dropped and elements of created tuple had underlying type of `LowCardinality`. [#39113](https://github.com/ClickHouse/ClickHouse/pull/39113) ([Anton Popov](https://github.com/CurtizJ)).
* Fix error `Block structure mismatch` which could happen for INSERT into table with attached MATERIALIZED VIEW and enabled setting `extremes = 1`. Closes [#29759](https://github.com/ClickHouse/ClickHouse/issues/29759) and [#38729](https://github.com/ClickHouse/ClickHouse/issues/38729). [#39125](https://github.com/ClickHouse/ClickHouse/pull/39125) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix unexpected query result when both `optimize_trivial_count_query` and `empty_result_for_aggregation_by_empty_set` are set to true. This fixes [#39140](https://github.com/ClickHouse/ClickHouse/issues/39140). [#39155](https://github.com/ClickHouse/ClickHouse/pull/39155) ([Amos Bird](https://github.com/amosbird)).
* Fixed error `Not found column Type in block` in selects with `PREWHERE` and read-in-order optimizations. [#39157](https://github.com/ClickHouse/ClickHouse/pull/39157) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* Fix extremely rare race condition in during hardlinks for remote filesystem. The only way to reproduce it is concurrent run of backups. [#39190](https://github.com/ClickHouse/ClickHouse/pull/39190) ([alesapin](https://github.com/alesapin)).
* (zero-copy replication is an experimental feature that should not be used in production) Fix fetch of in-memory part with `allow_remote_fs_zero_copy_replication`. [#39214](https://github.com/ClickHouse/ClickHouse/pull/39214) ([Azat Khuzhin](https://github.com/azat)).
* (MaterializedPostgreSQL - experimental feature). Fix segmentation fault in MaterializedPostgreSQL database engine, which could happen if some exception occurred at replication initialisation. Closes [#36939](https://github.com/ClickHouse/ClickHouse/issues/36939). [#39272](https://github.com/ClickHouse/ClickHouse/pull/39272) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix incorrect fetch of table metadata from PostgreSQL database engine. Closes [#33502](https://github.com/ClickHouse/ClickHouse/issues/33502). [#39283](https://github.com/ClickHouse/ClickHouse/pull/39283) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix projection exception when aggregation keys are wrapped inside other functions. This fixes [#37151](https://github.com/ClickHouse/ClickHouse/issues/37151). [#37155](https://github.com/ClickHouse/ClickHouse/pull/37155) ([Amos Bird](https://github.com/amosbird)).
* Fix possible logical error `... with argument with type Nothing and default implementation for Nothing is expected to return result with type Nothing, got ...` in some functions. Closes: [#37610](https://github.com/ClickHouse/ClickHouse/issues/37610) Closes: [#37741](https://github.com/ClickHouse/ClickHouse/issues/37741). [#37759](https://github.com/ClickHouse/ClickHouse/pull/37759) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix incorrect columns order in subqueries of UNION (in case of duplicated columns in subselects may produce incorrect result). [#37887](https://github.com/ClickHouse/ClickHouse/pull/37887) ([Azat Khuzhin](https://github.com/azat)).
* Fix incorrect work of MODIFY ALTER Column with column names that contain dots. Closes [#37907](https://github.com/ClickHouse/ClickHouse/issues/37907). [#37971](https://github.com/ClickHouse/ClickHouse/pull/37971) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix reading of sparse columns from `MergeTree` tables that store their data in S3. [#37978](https://github.com/ClickHouse/ClickHouse/pull/37978) ([Anton Popov](https://github.com/CurtizJ)).
* Fix possible crash in `Distributed` async insert in case of removing a replica from config. [#38029](https://github.com/ClickHouse/ClickHouse/pull/38029) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix "Missing columns" for GLOBAL JOIN with CTE without alias. [#38056](https://github.com/ClickHouse/ClickHouse/pull/38056) ([Azat Khuzhin](https://github.com/azat)).
* Rewrite tuple functions as literals in backwards-compatibility mode. [#38096](https://github.com/ClickHouse/ClickHouse/pull/38096) ([Anton Kozlov](https://github.com/tonickkozlov)).
* Fix redundant memory reservation for output block during `ORDER BY`. [#38127](https://github.com/ClickHouse/ClickHouse/pull/38127) ([iyupeng](https://github.com/iyupeng)).
* Fix possible logical error `Bad cast from type DB::IColumn* to DB::ColumnNullable*` in array mapped functions. Closes [#38006](https://github.com/ClickHouse/ClickHouse/issues/38006). [#38132](https://github.com/ClickHouse/ClickHouse/pull/38132) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix temporary name clash in partial merge join, close [#37928](https://github.com/ClickHouse/ClickHouse/issues/37928). [#38135](https://github.com/ClickHouse/ClickHouse/pull/38135) ([Vladimir C](https://github.com/vdimir)).
* Some minr issue with queries like `CREATE TABLE nested_name_tuples (`a` Tuple(x String, y Tuple(i Int32, j String))) ENGINE = Memory;` [#38136](https://github.com/ClickHouse/ClickHouse/pull/38136) ([lgbo](https://github.com/lgbo-ustc)).
* Fix bug with nested short-circuit functions that led to execution of arguments even if condition is false. Closes [#38040](https://github.com/ClickHouse/ClickHouse/issues/38040). [#38173](https://github.com/ClickHouse/ClickHouse/pull/38173) ([Kruglov Pavel](https://github.com/Avogar)).
* (Window View is a experimental feature) Fix LOGICAL\_ERROR for WINDOW VIEW with incorrect structure. [#38205](https://github.com/ClickHouse/ClickHouse/pull/38205) ([Azat Khuzhin](https://github.com/azat)).
* Update librdkafka submodule to fix crash when an OAUTHBEARER refresh callback is set. [#38225](https://github.com/ClickHouse/ClickHouse/pull/38225) ([Rafael Acevedo](https://github.com/racevedoo)).
* Fix INSERT into Distributed hung due to ProfileEvents. [#38307](https://github.com/ClickHouse/ClickHouse/pull/38307) ([Azat Khuzhin](https://github.com/azat)).
* Fix retries in PostgreSQL engine. [#38310](https://github.com/ClickHouse/ClickHouse/pull/38310) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix optimization in PartialSortingTransform (SIGSEGV and possible incorrect result). [#38324](https://github.com/ClickHouse/ClickHouse/pull/38324) ([Azat Khuzhin](https://github.com/azat)).
* Fix RabbitMQ with formats based on PeekableReadBuffer. Closes [#38061](https://github.com/ClickHouse/ClickHouse/issues/38061). [#38356](https://github.com/ClickHouse/ClickHouse/pull/38356) ([Kseniia Sumarokova](https://github.com/kssenii)).
* MaterializedPostgreSQL - experimentail feature. Fix possible `Invalid number of rows in Chunk` in MaterializedPostgreSQL. Closes [#37323](https://github.com/ClickHouse/ClickHouse/issues/37323). [#38360](https://github.com/ClickHouse/ClickHouse/pull/38360) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix RabbitMQ configuration with connection string setting. Closes [#36531](https://github.com/ClickHouse/ClickHouse/issues/36531). [#38365](https://github.com/ClickHouse/ClickHouse/pull/38365) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix PostgreSQL engine not using PostgreSQL schema when retrieving array dimension size. Closes [#36755](https://github.com/ClickHouse/ClickHouse/issues/36755). Closes [#36772](https://github.com/ClickHouse/ClickHouse/issues/36772). [#38366](https://github.com/ClickHouse/ClickHouse/pull/38366) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix possibly incorrect result of distributed queries with `DISTINCT` and `LIMIT`. Fixes [#38282](https://github.com/ClickHouse/ClickHouse/issues/38282). [#38371](https://github.com/ClickHouse/ClickHouse/pull/38371) ([Anton Popov](https://github.com/CurtizJ)).
* Fix wrong results of countSubstrings() & position() on patterns with 0-bytes. [#38589](https://github.com/ClickHouse/ClickHouse/pull/38589) ([Robert Schulze](https://github.com/rschu1ze)).
* Now it's possible to start a clickhouse-server and attach/detach tables even for tables with the incorrect values of IPv4/IPv6 representation. Proper fix for issue [#35156](https://github.com/ClickHouse/ClickHouse/issues/35156). [#38590](https://github.com/ClickHouse/ClickHouse/pull/38590) ([alesapin](https://github.com/alesapin)).
* `rankCorr` function will work correctly if some arguments are NaNs. This closes [#38396](https://github.com/ClickHouse/ClickHouse/issues/38396). [#38722](https://github.com/ClickHouse/ClickHouse/pull/38722) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix `parallel_view_processing=1` with `optimize_trivial_insert_select=1`. Fix `max_insert_threads` while pushing to views. [#38731](https://github.com/ClickHouse/ClickHouse/pull/38731) ([Azat Khuzhin](https://github.com/azat)).
* Fix use-after-free for aggregate functions with `Map` combinator that leads to incorrect result. [#38748](https://github.com/ClickHouse/ClickHouse/pull/38748) ([Azat Khuzhin](https://github.com/azat)).
