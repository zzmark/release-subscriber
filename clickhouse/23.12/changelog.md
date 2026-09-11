<h3 id="2312">
  <a id="2312" /> ClickHouse release 23.12, 2023-12-28. [Presentation](https://presentations.clickhouse.com/2023-release-23.12/), [Video](https://www.youtube.com/watch?v=7TLuT6gt0PQ)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/7TLuT6gt0PQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change">
  Backward Incompatible Change
</h4>

* Fix check for non-deterministic functions in TTL expressions. Previously, you could create a TTL expression with non-deterministic functions in some cases, which could lead to undefined behavior later. This fixes [#37250](https://github.com/ClickHouse/ClickHouse/issues/37250). Disallow TTL expressions that don't depend on any columns of a table by default. It can be allowed back by `SET allow_suspicious_ttl_expressions = 1` or `SET compatibility = '23.11'`. Closes [#37286](https://github.com/ClickHouse/ClickHouse/issues/37286). [#51858](https://github.com/ClickHouse/ClickHouse/pull/51858) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* The MergeTree setting `clean_deleted_rows` is deprecated, it has no effect anymore. The `CLEANUP` keyword for the `OPTIMIZE` is not allowed by default (it can be unlocked with the `allow_experimental_replacing_merge_with_cleanup` setting). [#58267](https://github.com/ClickHouse/ClickHouse/pull/58267) ([Alexander Tokmakov](https://github.com/tavplubix)). This fixes [#57930](https://github.com/ClickHouse/ClickHouse/issues/57930). This closes [#54988](https://github.com/ClickHouse/ClickHouse/issues/54988). This closes [#54570](https://github.com/ClickHouse/ClickHouse/issues/54570). This closes [#50346](https://github.com/ClickHouse/ClickHouse/issues/50346). This closes [#47579](https://github.com/ClickHouse/ClickHouse/issues/47579). The feature has to be removed because it is not good. We have to remove it as quickly as possible, because there is no other option. [#57932](https://github.com/ClickHouse/ClickHouse/pull/57932) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="new-feature">
  New Feature
</h4>

* Implement Refreshable Materialized Views, requested in [#33919](https://github.com/ClickHouse/ClickHouse/issues/33919). [#56946](https://github.com/ClickHouse/ClickHouse/pull/56946) ([Michael Kolupaev](https://github.com/al13n321), [Michael Guzov](https://github.com/koloshmet)).
* Introduce `PASTE JOIN`, which allows users to join tables without `ON` clause simply by row numbers. Example: `SELECT * FROM (SELECT number AS a FROM numbers(2)) AS t1 PASTE JOIN (SELECT number AS a FROM numbers(2) ORDER BY a DESC) AS t2`. [#57995](https://github.com/ClickHouse/ClickHouse/pull/57995) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* The `ORDER BY` clause now supports specifying `ALL`, meaning that ClickHouse sorts by all columns in the `SELECT` clause. Example: `SELECT col1, col2 FROM tab WHERE [...] ORDER BY ALL`. [#57875](https://github.com/ClickHouse/ClickHouse/pull/57875) ([zhongyuankai](https://github.com/zhongyuankai)).
* Added a new mutation command `ALTER TABLE <table> APPLY DELETED MASK`, which allows to enforce applying of mask written by lightweight delete and to remove rows marked as deleted from disk. [#57433](https://github.com/ClickHouse/ClickHouse/pull/57433) ([Anton Popov](https://github.com/CurtizJ)).
* A handler `/binary` opens a visual viewer of symbols inside the ClickHouse binary. [#58211](https://github.com/ClickHouse/ClickHouse/pull/58211) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Added a new SQL function `sqid` to generate Sqids ([https://sqids.org/](https://sqids.org/)), example: `SELECT sqid(125, 126)`. [#57512](https://github.com/ClickHouse/ClickHouse/pull/57512) ([Robert Schulze](https://github.com/rschu1ze)).
* Add a new function `seriesPeriodDetectFFT` to detect series period using FFT. [#57574](https://github.com/ClickHouse/ClickHouse/pull/57574) ([Bhavna Jindal](https://github.com/bhavnajindal)).
* Add an HTTP endpoint for checking if Keeper is ready to accept traffic. [#55876](https://github.com/ClickHouse/ClickHouse/pull/55876) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* Add 'union' mode for schema inference. In this mode the resulting table schema is the union of all files schemas (so schema is inferred from each file). The mode of schema inference is controlled by a setting `schema_inference_mode` with two possible values - `default` and `union`. Closes [#55428](https://github.com/ClickHouse/ClickHouse/issues/55428). [#55892](https://github.com/ClickHouse/ClickHouse/pull/55892) ([Kruglov Pavel](https://github.com/Avogar)).
* Add new setting `input_format_csv_try_infer_numbers_from_strings` that allows to infer numbers from strings in CSV format. Closes [#56455](https://github.com/ClickHouse/ClickHouse/issues/56455). [#56859](https://github.com/ClickHouse/ClickHouse/pull/56859) ([Kruglov Pavel](https://github.com/Avogar)).
* When the number of databases or tables exceeds a configurable threshold, show a warning to the user. [#57375](https://github.com/ClickHouse/ClickHouse/pull/57375) ([凌涛](https://github.com/lingtaolf)).
* Dictionary with `HASHED_ARRAY` (and `COMPLEX_KEY_HASHED_ARRAY`) layout supports `SHARDS` similarly to `HASHED`. [#57544](https://github.com/ClickHouse/ClickHouse/pull/57544) ([vdimir](https://github.com/vdimir)).
* Add asynchronous metrics for total primary key bytes and total allocated primary key bytes in memory. [#57551](https://github.com/ClickHouse/ClickHouse/pull/57551) ([Bharat Nallan](https://github.com/bharatnc)).
* Add `SHA512_256` function. [#57645](https://github.com/ClickHouse/ClickHouse/pull/57645) ([Bharat Nallan](https://github.com/bharatnc)).
* Add `FORMAT_BYTES` as an alias for `formatReadableSize`. [#57592](https://github.com/ClickHouse/ClickHouse/pull/57592) ([Bharat Nallan](https://github.com/bharatnc)).
* Allow passing optional session token to the `s3` table function. [#57850](https://github.com/ClickHouse/ClickHouse/pull/57850) ([Shani Elharrar](https://github.com/shanielh)).
* Introduce a new setting `http_make_head_request`. If it is turned off, the URL table engine will not do a HEAD request to determine the file size. This is needed to support inefficient, misconfigured, or not capable HTTP servers. [#54602](https://github.com/ClickHouse/ClickHouse/pull/54602) ([Fionera](https://github.com/fionera)).
* It is now possible to refer to ALIAS column in index (non-primary-key) definitions (issue [#55650](https://github.com/ClickHouse/ClickHouse/issues/55650)). Example: `CREATE TABLE tab(col UInt32, col_alias ALIAS col + 1, INDEX idx (col_alias) TYPE minmax) ENGINE = MergeTree ORDER BY col;`. [#57546](https://github.com/ClickHouse/ClickHouse/pull/57546) ([Robert Schulze](https://github.com/rschu1ze)).
* Added a new setting `readonly` which can be used to specify an S3 disk is read only. It can be useful to create a table on a disk of `s3_plain` type, while having read only access to the underlying S3 bucket. [#57977](https://github.com/ClickHouse/ClickHouse/pull/57977) ([Pengyuan Bian](https://github.com/bianpengyuan)).
* The primary key analysis in MergeTree tables will now be applied to predicates that include the virtual column `_part_offset` (optionally with `_part`). This feature can serve as a special kind of a secondary index. [#58224](https://github.com/ClickHouse/ClickHouse/pull/58224) ([Amos Bird](https://github.com/amosbird)).

<h4 id="performance-improvement">
  Performance Improvement
</h4>

* Extract non-intersecting parts ranges from MergeTree table during FINAL processing. That way we can avoid additional FINAL logic for this non-intersecting parts ranges. In case when amount of duplicate values with same primary key is low, performance will be almost the same as without FINAL. Improve reading performance for MergeTree FINAL when `do_not_merge_across_partitions_select_final` setting is set. [#58120](https://github.com/ClickHouse/ClickHouse/pull/58120) ([Maksim Kita](https://github.com/kitaisreal)).
* Made copy between s3 disks using a s3-server-side copy instead of copying through the buffer. Improves `BACKUP/RESTORE` operations and `clickhouse-disks copy` command. [#56744](https://github.com/ClickHouse/ClickHouse/pull/56744) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* Hash JOIN respects setting `max_joined_block_size_rows` and do not produce large blocks for `ALL JOIN`. [#56996](https://github.com/ClickHouse/ClickHouse/pull/56996) ([vdimir](https://github.com/vdimir)).
* Release memory for aggregation earlier. This may avoid unnecessary external aggregation. [#57691](https://github.com/ClickHouse/ClickHouse/pull/57691) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Improve performance of string serialization. [#57717](https://github.com/ClickHouse/ClickHouse/pull/57717) ([Maksim Kita](https://github.com/kitaisreal)).
* Support trivial count optimization for `Merge`-engine tables. [#57867](https://github.com/ClickHouse/ClickHouse/pull/57867) ([skyoct](https://github.com/skyoct)).
* Optimized aggregation in some cases. [#57872](https://github.com/ClickHouse/ClickHouse/pull/57872) ([Anton Popov](https://github.com/CurtizJ)).
* The `hasAny` function can now take advantage of the full-text skipping indices. [#57878](https://github.com/ClickHouse/ClickHouse/pull/57878) ([Jpnock](https://github.com/Jpnock)).
* Function `if(cond, then, else)` (and its alias `cond ? then : else`) were optimized to use branch-free evaluation. [#57885](https://github.com/ClickHouse/ClickHouse/pull/57885) ([zhanglistar](https://github.com/zhanglistar)).
* MergeTree automatically derive `do_not_merge_across_partitions_select_final` setting if partition key expression contains only columns from primary key expression. [#58218](https://github.com/ClickHouse/ClickHouse/pull/58218) ([Maksim Kita](https://github.com/kitaisreal)).
* Speedup `MIN` and `MAX` for native types. [#58231](https://github.com/ClickHouse/ClickHouse/pull/58231) ([Raúl Marín](https://github.com/Algunenano)).
* Implement `SLRU` cache policy for filesystem cache. [#57076](https://github.com/ClickHouse/ClickHouse/pull/57076) ([Kseniia Sumarokova](https://github.com/kssenii)).
* The limit for the number of connections per endpoint for background fetches was raised from `15` to the value of `background_fetches_pool_size` setting. - MergeTree-level setting `replicated_max_parallel_fetches_for_host` became obsolete - MergeTree-level settings `replicated_fetches_http_connection_timeout`, `replicated_fetches_http_send_timeout` and `replicated_fetches_http_receive_timeout` are moved to the Server-level. - Setting `keep_alive_timeout` is added to the list of Server-level settings. [#57523](https://github.com/ClickHouse/ClickHouse/pull/57523) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* Make querying `system.filesystem_cache` not memory intensive. [#57687](https://github.com/ClickHouse/ClickHouse/pull/57687) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Reduce memory usage on strings deserialization. [#57787](https://github.com/ClickHouse/ClickHouse/pull/57787) ([Maksim Kita](https://github.com/kitaisreal)).
* More efficient constructor for Enum - it makes sense when Enum has a boatload of values. [#57887](https://github.com/ClickHouse/ClickHouse/pull/57887) ([Duc Canh Le](https://github.com/canhld94)).
* An improvement for reading from the filesystem cache: always use `pread` method. [#57970](https://github.com/ClickHouse/ClickHouse/pull/57970) ([Nikita Taranov](https://github.com/nickitat)).
* Add optimization for AND notEquals chain in logical expression optimizer. This optimization is only available with the experimental Analyzer enabled. [#58214](https://github.com/ClickHouse/ClickHouse/pull/58214) ([Kevin Mingtarja](https://github.com/kevinmingtarja)).

<h4 id="improvement">
  Improvement
</h4>

* Support for soft memory limit in Keeper. It will refuse requests if the memory usage is close to the maximum. [#57271](https://github.com/ClickHouse/ClickHouse/pull/57271) ([Han Fei](https://github.com/hanfei1991)). [#57699](https://github.com/ClickHouse/ClickHouse/pull/57699) ([Han Fei](https://github.com/hanfei1991)).
* Make inserts into distributed tables handle updated cluster configuration properly. When the list of cluster nodes is dynamically updated, the Directory Monitor of the distribution table will update it. [#42826](https://github.com/ClickHouse/ClickHouse/pull/42826) ([zhongyuankai](https://github.com/zhongyuankai)).
* Do not allow creating a replicated table with inconsistent merge parameters. [#56833](https://github.com/ClickHouse/ClickHouse/pull/56833) ([Duc Canh Le](https://github.com/canhld94)).
* Show uncompressed size in `system.tables`. [#56618](https://github.com/ClickHouse/ClickHouse/issues/56618). [#57186](https://github.com/ClickHouse/ClickHouse/pull/57186) ([Chen Lixiang](https://github.com/chenlx0)).
* Add `skip_unavailable_shards` as a setting for `Distributed` tables that is similar to the corresponding query-level setting. Closes [#43666](https://github.com/ClickHouse/ClickHouse/issues/43666). [#57218](https://github.com/ClickHouse/ClickHouse/pull/57218) ([Gagan Goel](https://github.com/tntnatbry)).
* The function `substring` (aliases: `substr`, `mid`) can now be used with `Enum` types. Previously, the first function argument had to be a value of type `String` or `FixedString`. This improves compatibility with 3rd party tools such as Tableau via MySQL interface. [#57277](https://github.com/ClickHouse/ClickHouse/pull/57277) ([Serge Klochkov](https://github.com/slvrtrn)).
* Function `format` now supports arbitrary argument types (instead of only `String` and `FixedString` arguments). This is important to calculate `SELECT format('The {0} to all questions is {1}', 'answer', 42)`. [#57549](https://github.com/ClickHouse/ClickHouse/pull/57549) ([Robert Schulze](https://github.com/rschu1ze)).
* Allows to use the `date_trunc` function with a case-insensitive first argument. Both cases are now supported: `SELECT date_trunc('day', now())` and `SELECT date_trunc('DAY', now())`. [#57624](https://github.com/ClickHouse/ClickHouse/pull/57624) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* Better hints when a table doesn't exist. [#57342](https://github.com/ClickHouse/ClickHouse/pull/57342) ([Bharat Nallan](https://github.com/bharatnc)).
* Allow to overwrite `max_partition_size_to_drop` and `max_table_size_to_drop` server settings in query time. [#57452](https://github.com/ClickHouse/ClickHouse/pull/57452) ([Jordi Villar](https://github.com/jrdi)).
* Slightly better inference of unnamed tupes in JSON formats. [#57751](https://github.com/ClickHouse/ClickHouse/pull/57751) ([Kruglov Pavel](https://github.com/Avogar)).
* Add support for read-only flag when connecting to Keeper (fixes [#53749](https://github.com/ClickHouse/ClickHouse/issues/53749)). [#57479](https://github.com/ClickHouse/ClickHouse/pull/57479) ([Mikhail Koviazin](https://github.com/mkmkme)).
* Fix possible distributed sends stuck due to "No such file or directory" (during recovering a batch from disk). Fix possible issues with `error_count` from `system.distribution_queue` (in case of `distributed_directory_monitor_max_sleep_time_ms` >5min). Introduce profile event to track async INSERT failures - `DistributedAsyncInsertionFailures`. [#57480](https://github.com/ClickHouse/ClickHouse/pull/57480) ([Azat Khuzhin](https://github.com/azat)).
* Support PostgreSQL generated columns and default column values in `MaterializedPostgreSQL` (experimental feature). Closes [#40449](https://github.com/ClickHouse/ClickHouse/issues/40449). [#57568](https://github.com/ClickHouse/ClickHouse/pull/57568) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Allow to apply some filesystem cache config settings changes without server restart. [#57578](https://github.com/ClickHouse/ClickHouse/pull/57578) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Properly handling PostgreSQL table structure with empty array. [#57618](https://github.com/ClickHouse/ClickHouse/pull/57618) ([Mike Kot](https://github.com/myrrc)).
* Expose the total number of errors occurred since last server restart as a `ClickHouseErrorMetric_ALL` metric. [#57627](https://github.com/ClickHouse/ClickHouse/pull/57627) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* Allow nodes in the configuration file with `from_env`/`from_zk` reference and non empty element with replace=1. [#57628](https://github.com/ClickHouse/ClickHouse/pull/57628) ([Azat Khuzhin](https://github.com/azat)).
* A table function `fuzzJSON` which allows generating a lot of malformed JSON for fuzzing. [#57646](https://github.com/ClickHouse/ClickHouse/pull/57646) ([Julia Kartseva](https://github.com/jkartseva)).
* Allow IPv6 to UInt128 conversion and binary arithmetic. [#57707](https://github.com/ClickHouse/ClickHouse/pull/57707) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* Add a setting for `async inserts deduplication cache` - how long we wait for cache update. Deprecate setting `async_block_ids_cache_min_update_interval_ms`. Now cache is updated only in case of conflicts. [#57743](https://github.com/ClickHouse/ClickHouse/pull/57743) ([alesapin](https://github.com/alesapin)).
* `sleep()` function now can be cancelled with `KILL QUERY`. [#57746](https://github.com/ClickHouse/ClickHouse/pull/57746) ([Vitaly Baranov](https://github.com/vitlibar)).
* Forbid `CREATE TABLE ... AS SELECT` queries for `Replicated` table engines in the experimental `Replicated` database because they are not supported. Reference [#35408](https://github.com/ClickHouse/ClickHouse/issues/35408). [#57796](https://github.com/ClickHouse/ClickHouse/pull/57796) ([Nikolay Degterinsky](https://github.com/evillique)).
* Fix and improve transforming queries for external databases, to recursively obtain all compatible predicates. [#57888](https://github.com/ClickHouse/ClickHouse/pull/57888) ([flynn](https://github.com/ucasfl)).
* Support dynamic reloading of the filesystem cache size. Closes [#57866](https://github.com/ClickHouse/ClickHouse/issues/57866). [#57897](https://github.com/ClickHouse/ClickHouse/pull/57897) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Correctly support `system.stack_trace` for threads with blocked SIGRTMIN (these threads can exist in low-quality external libraries such as Apache rdkafka). [#57907](https://github.com/ClickHouse/ClickHouse/pull/57907) ([Azat Khuzhin](https://github.com/azat)). Aand also send signal to the threads only if it is not blocked to avoid waiting `storage_system_stack_trace_pipe_read_timeout_ms` when it does not make any sense. [#58136](https://github.com/ClickHouse/ClickHouse/pull/58136) ([Azat Khuzhin](https://github.com/azat)).
* Tolerate keeper failures in the quorum inserts' check. [#57986](https://github.com/ClickHouse/ClickHouse/pull/57986) ([Raúl Marín](https://github.com/Algunenano)).
* Add max/peak RSS (`MemoryResidentMax`) into system.asynchronous\_metrics. [#58095](https://github.com/ClickHouse/ClickHouse/pull/58095) ([Azat Khuzhin](https://github.com/azat)).
* This PR allows you to use s3-style links (`https://` and `s3://`) without mentioning region if it's not default. Also find the correct region if the user mentioned the wrong one. [#58148](https://github.com/ClickHouse/ClickHouse/pull/58148) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* `clickhouse-format --obfuscate` will know about Settings, MergeTreeSettings, and time zones and keep their names unchanged. [#58179](https://github.com/ClickHouse/ClickHouse/pull/58179) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Added explicit `finalize()` function in `ZipArchiveWriter`. Simplify too complicated code in `ZipArchiveWriter`. This fixes [#58074](https://github.com/ClickHouse/ClickHouse/issues/58074). [#58202](https://github.com/ClickHouse/ClickHouse/pull/58202) ([Vitaly Baranov](https://github.com/vitlibar)).
* Make caches with the same path use the same cache objects. This behaviour existed before, but was broken in 23.4. If such caches with the same path have different set of cache settings, an exception will be thrown, that this is not allowed. [#58264](https://github.com/ClickHouse/ClickHouse/pull/58264) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Parallel replicas (experimental feature): friendly settings [#57542](https://github.com/ClickHouse/ClickHouse/pull/57542) ([Igor Nikonov](https://github.com/devcrafter)).
* Parallel replicas (experimental feature): announcement response handling improvement [#57749](https://github.com/ClickHouse/ClickHouse/pull/57749) ([Igor Nikonov](https://github.com/devcrafter)).
* Parallel replicas (experimental feature): give more respect to `min_number_of_marks` in `ParallelReplicasReadingCoordinator` [#57763](https://github.com/ClickHouse/ClickHouse/pull/57763) ([Nikita Taranov](https://github.com/nickitat)).
* Parallel replicas (experimental feature): disable parallel replicas with IN (subquery) [#58133](https://github.com/ClickHouse/ClickHouse/pull/58133) ([Igor Nikonov](https://github.com/devcrafter)).
* Parallel replicas (experimental feature): add profile event 'ParallelReplicasUsedCount' [#58173](https://github.com/ClickHouse/ClickHouse/pull/58173) ([Igor Nikonov](https://github.com/devcrafter)).
* Non POST requests such as HEAD will be readonly similar to GET. [#58060](https://github.com/ClickHouse/ClickHouse/pull/58060) ([San](https://github.com/santrancisco)).
* Add `bytes_uncompressed` column to `system.part_log` [#58167](https://github.com/ClickHouse/ClickHouse/pull/58167) ([Jordi Villar](https://github.com/jrdi)).
* Add base backup name to `system.backups` and `system.backup_log` tables [#58178](https://github.com/ClickHouse/ClickHouse/pull/58178) ([Pradeep Chhetri](https://github.com/chhetripradeep)).
* Add support for specifying query parameters in the command line in clickhouse-local [#58210](https://github.com/ClickHouse/ClickHouse/pull/58210) ([Pradeep Chhetri](https://github.com/chhetripradeep)).

<h4 id="buildtestingpackaging-improvement">
  Build/Testing/Packaging Improvement
</h4>

* Randomize more settings [#39663](https://github.com/ClickHouse/ClickHouse/pull/39663) ([Anton Popov](https://github.com/CurtizJ)).
* Randomize disabled optimizations in CI [#57315](https://github.com/ClickHouse/ClickHouse/pull/57315) ([Raúl Marín](https://github.com/Algunenano)).
* Allow usage of Azure-related table engines/functions on macOS. [#51866](https://github.com/ClickHouse/ClickHouse/pull/51866) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* ClickHouse Fast Test now uses Musl instead of GLibc. [#57711](https://github.com/ClickHouse/ClickHouse/pull/57711) ([Alexey Milovidov](https://github.com/alexey-milovidov)). The fully-static Musl build is available to download from the CI.
* Run ClickBench for every commit. This closes [#57708](https://github.com/ClickHouse/ClickHouse/issues/57708). [#57712](https://github.com/ClickHouse/ClickHouse/pull/57712) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Remove the usage of a harmful C/POSIX `select` function from external libraries. [#57467](https://github.com/ClickHouse/ClickHouse/pull/57467) ([Igor Nikonov](https://github.com/devcrafter)).
* Settings only available in ClickHouse Cloud will be also present in the open-source ClickHouse build for convenience. [#57638](https://github.com/ClickHouse/ClickHouse/pull/57638) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release">
  Bug Fix (user-visible misbehavior in an official stable release)
</h4>

* Fixed a possibility of sorting order breakage in TTL GROUP BY [#49103](https://github.com/ClickHouse/ClickHouse/pull/49103) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* Fix: split `lttb` bucket strategy, first bucket and last bucket should only contain single point [#57003](https://github.com/ClickHouse/ClickHouse/pull/57003) ([FFish](https://github.com/wxybear)).
* Fix possible deadlock in the `Template` format during sync after error [#57004](https://github.com/ClickHouse/ClickHouse/pull/57004) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix early stop while parsing a file with skipping lots of errors [#57006](https://github.com/ClickHouse/ClickHouse/pull/57006) ([Kruglov Pavel](https://github.com/Avogar)).
* Prevent dictionary's ACL bypass via the `dictionary` table function [#57362](https://github.com/ClickHouse/ClickHouse/pull/57362) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* Fix another case of a "non-ready set" error found by Fuzzer. [#57423](https://github.com/ClickHouse/ClickHouse/pull/57423) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix several issues regarding PostgreSQL `array_ndims` usage. [#57436](https://github.com/ClickHouse/ClickHouse/pull/57436) ([Ryan Jacobs](https://github.com/ryanmjacobs)).
* Fix RWLock inconsistency after write lock timeout [#57454](https://github.com/ClickHouse/ClickHouse/pull/57454) ([Vitaly Baranov](https://github.com/vitlibar)). Fix RWLock inconsistency after write lock timeout (again) [#57733](https://github.com/ClickHouse/ClickHouse/pull/57733) ([Vitaly Baranov](https://github.com/vitlibar)).
* Fix: don't exclude ephemeral column when building pushing to view chain [#57461](https://github.com/ClickHouse/ClickHouse/pull/57461) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* MaterializedPostgreSQL (experimental issue): fix issue [#41922](https://github.com/ClickHouse/ClickHouse/issues/41922), add test for [#41923](https://github.com/ClickHouse/ClickHouse/issues/41923) [#57515](https://github.com/ClickHouse/ClickHouse/pull/57515) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Ignore ON CLUSTER clause in grant/revoke queries for management of replicated access entities.  [#57538](https://github.com/ClickHouse/ClickHouse/pull/57538) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* Fix crash in clickhouse-local [#57553](https://github.com/ClickHouse/ClickHouse/pull/57553) ([Nikolay Degterinsky](https://github.com/evillique)).
* A fix for Hash JOIN. [#57564](https://github.com/ClickHouse/ClickHouse/pull/57564) ([vdimir](https://github.com/vdimir)).
* Fix possible error in PostgreSQL source [#57567](https://github.com/ClickHouse/ClickHouse/pull/57567) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix type correction in Hash JOIN for nested LowCardinality. [#57614](https://github.com/ClickHouse/ClickHouse/pull/57614) ([vdimir](https://github.com/vdimir)).
* Avoid hangs of `system.stack_trace` by correctly prohibiting parallel reading from it. [#57641](https://github.com/ClickHouse/ClickHouse/pull/57641) ([Azat Khuzhin](https://github.com/azat)).
* Fix an error for aggregation of sparse columns with `any(...) RESPECT NULL` [#57710](https://github.com/ClickHouse/ClickHouse/pull/57710) ([Azat Khuzhin](https://github.com/azat)).
* Fix unary operators parsing [#57713](https://github.com/ClickHouse/ClickHouse/pull/57713) ([Nikolay Degterinsky](https://github.com/evillique)).
* Fix dependency loading for the experimental table engine `MaterializedPostgreSQL`. [#57754](https://github.com/ClickHouse/ClickHouse/pull/57754) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix retries for disconnected nodes for BACKUP/RESTORE ON CLUSTER [#57764](https://github.com/ClickHouse/ClickHouse/pull/57764) ([Vitaly Baranov](https://github.com/vitlibar)).
* Fix result of external aggregation in case of partially materialized projection [#57790](https://github.com/ClickHouse/ClickHouse/pull/57790) ([Anton Popov](https://github.com/CurtizJ)).
* Fix merge in aggregation functions with `*Map` combinator [#57795](https://github.com/ClickHouse/ClickHouse/pull/57795) ([Anton Popov](https://github.com/CurtizJ)).
* Disable `system.kafka_consumers` because it has a bug. [#57822](https://github.com/ClickHouse/ClickHouse/pull/57822) ([Azat Khuzhin](https://github.com/azat)).
* Fix LowCardinality keys support in Merge JOIN. [#57827](https://github.com/ClickHouse/ClickHouse/pull/57827) ([vdimir](https://github.com/vdimir)).
* A fix for `InterpreterCreateQuery` related to the sample block. [#57855](https://github.com/ClickHouse/ClickHouse/pull/57855) ([Maksim Kita](https://github.com/kitaisreal)).
* `addresses_expr` were ignored for named collections from PostgreSQL. [#57874](https://github.com/ClickHouse/ClickHouse/pull/57874) ([joelynch](https://github.com/joelynch)).
* Fix invalid memory access in BLAKE3 (Rust) [#57876](https://github.com/ClickHouse/ClickHouse/pull/57876) ([Raúl Marín](https://github.com/Algunenano)). Then it was rewritten from Rust to C++ for better [memory-safety](https://www.memorysafety.org/). [#57994](https://github.com/ClickHouse/ClickHouse/pull/57994) ([Raúl Marín](https://github.com/Algunenano)).
* Normalize function names in `CREATE INDEX` [#57906](https://github.com/ClickHouse/ClickHouse/pull/57906) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix handling of unavailable replicas before first request happened [#57933](https://github.com/ClickHouse/ClickHouse/pull/57933) ([Nikita Taranov](https://github.com/nickitat)).
* Fix literal alias misclassification [#57988](https://github.com/ClickHouse/ClickHouse/pull/57988) ([Chen768959](https://github.com/Chen768959)).
* Fix invalid preprocessing on Keeper [#58069](https://github.com/ClickHouse/ClickHouse/pull/58069) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix integer overflow in the `Poco` library, related to `UTF32Encoding` [#58073](https://github.com/ClickHouse/ClickHouse/pull/58073) ([Andrey Fedotov](https://github.com/anfedotoff)).
* Fix parallel replicas (experimental feature) in presence of a scalar subquery with a big integer value [#58118](https://github.com/ClickHouse/ClickHouse/pull/58118) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix `accurateCastOrNull` for out-of-range `DateTime` [#58139](https://github.com/ClickHouse/ClickHouse/pull/58139) ([Andrey Zvonov](https://github.com/zvonand)).
* Fix possible `PARAMETER_OUT_OF_BOUND` error during subcolumns reading from a wide part in MergeTree [#58175](https://github.com/ClickHouse/ClickHouse/pull/58175) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix a slow-down of CREATE VIEW with an enormous number of subqueries [#58220](https://github.com/ClickHouse/ClickHouse/pull/58220) ([Tao Wang](https://github.com/wangtZJU)).
* Fix parallel parsing for JSONCompactEachRow [#58181](https://github.com/ClickHouse/ClickHouse/pull/58181) ([Alexey Milovidov](https://github.com/alexey-milovidov)). [#58250](https://github.com/ClickHouse/ClickHouse/pull/58250) ([Kruglov Pavel](https://github.com/Avogar)).
