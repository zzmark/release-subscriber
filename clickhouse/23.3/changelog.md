<h3 id="233">
  <a id="233" /> ClickHouse release 23.3 LTS, 2023-03-30. [Presentation](https://presentations.clickhouse.com/2023-release-23.3/), [Video](https://www.youtube.com/watch?v=ISaGUjvBNao)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/ISaGUjvBNao" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="upgrade-notes-1">
  Upgrade Notes
</h4>

* Lightweight DELETEs are production ready and enabled by default. The `DELETE` query for MergeTree tables is now available by default.
* The behavior of `*domain*RFC` and `netloc` functions is slightly changed: relaxed the set of symbols that are allowed in the URL authority for better conformance. [#46841](https://github.com/ClickHouse/ClickHouse/pull/46841) ([Azat Khuzhin](https://github.com/azat)).
* Prohibited creating tables based on KafkaEngine with DEFAULT/EPHEMERAL/ALIAS/MATERIALIZED statements for columns. [#47138](https://github.com/ClickHouse/ClickHouse/pull/47138) ([Aleksandr Musorin](https://github.com/AVMusorin)).
* An "asynchronous connection drain" feature is removed. Related settings and metrics are removed as well. It was an internal feature, so the removal should not affect users who had never heard about that feature. [#47486](https://github.com/ClickHouse/ClickHouse/pull/47486) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Support 256-bit Decimal data type (more than 38 digits) in `arraySum`/`Min`/`Max`/`Avg`/`Product`, `arrayCumSum`/`CumSumNonNegative`, `arrayDifference`, array construction, IN operator, query parameters, `groupArrayMovingSum`, statistical functions, `min`/`max`/`any`/`argMin`/`argMax`, PostgreSQL wire protocol, MySQL table engine and function, `sumMap`, `mapAdd`, `mapSubtract`, `arrayIntersect`. Add support for big integers in `arrayIntersect`. Statistical aggregate functions involving moments (such as `corr` or various `TTest`s) will use `Float64` as their internal representation (they were using `Decimal128` before this change, but it was pointless), and these functions can return `nan` instead of `inf` in case of infinite variance. Some functions were allowed on `Decimal256` data types but returned `Decimal128` in previous versions - now it is fixed. This closes [#47569](https://github.com/ClickHouse/ClickHouse/issues/47569). This closes [#44864](https://github.com/ClickHouse/ClickHouse/issues/44864). This closes [#28335](https://github.com/ClickHouse/ClickHouse/issues/28335). [#47594](https://github.com/ClickHouse/ClickHouse/pull/47594) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Make backup\_threads/restore\_threads server settings (instead of user settings). [#47881](https://github.com/ClickHouse/ClickHouse/pull/47881) ([Azat Khuzhin](https://github.com/azat)).
* Do not allow const and non-deterministic secondary indices [#46839](https://github.com/ClickHouse/ClickHouse/pull/46839) ([Anton Popov](https://github.com/CurtizJ)).

<h4 id="new-feature-9">
  New Feature
</h4>

* Add a new mode for splitting the work on replicas using settings `parallel_replicas_custom_key` and `parallel_replicas_custom_key_filter_type`. If the cluster consists of a single shard with multiple replicas, up to `max_parallel_replicas` will be randomly picked and turned into shards. For each shard, a corresponding filter is added to the query on the initiator before being sent to the shard. If the cluster consists of multiple shards, it will behave the same as `sample_key` but with the possibility to define an arbitrary key. [#45108](https://github.com/ClickHouse/ClickHouse/pull/45108) ([Antonio Andelic](https://github.com/antonio2368)).
* An option to display partial result on cancel: Added query setting `partial_result_on_first_cancel` allowing the canceled query (e.g. due to Ctrl-C) to return a partial result. [#45689](https://github.com/ClickHouse/ClickHouse/pull/45689) ([Alexey Perevyshin](https://github.com/alexX512)).
* Added support of arbitrary tables engines for temporary tables (except for Replicated and KeeperMap engines). Close [#31497](https://github.com/ClickHouse/ClickHouse/issues/31497). [#46071](https://github.com/ClickHouse/ClickHouse/pull/46071) ([Roman Vasin](https://github.com/rvasin)).
* Add support for replication of user-defined SQL functions using centralized storage in Keeper. [#46085](https://github.com/ClickHouse/ClickHouse/pull/46085) ([Aleksei Filatov](https://github.com/aalexfvk)).
* Implement `system.server_settings` (similar to `system.settings`), which will contain server configurations. [#46550](https://github.com/ClickHouse/ClickHouse/pull/46550) ([pufit](https://github.com/pufit)).
* Support for `UNDROP TABLE` query. Closes [#46811](https://github.com/ClickHouse/ClickHouse/issues/46811). [#47241](https://github.com/ClickHouse/ClickHouse/pull/47241) ([chen](https://github.com/xiedeyantu)).
* Allow separate grants for named collections (e.g. to be able to give `SHOW/CREATE/ALTER/DROP named collection` access only to certain collections, instead of all at once). Closes [#40894](https://github.com/ClickHouse/ClickHouse/issues/40894). Add new access type `NAMED_COLLECTION_CONTROL` which is not given to user default unless explicitly added to the user config (is required to be able to do `GRANT ALL`), also `show_named_collections` is no longer obligatory to be manually specified for user default to be able to have full access rights as was in 23.2. [#46241](https://github.com/ClickHouse/ClickHouse/pull/46241) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Allow nested custom disks. Previously custom disks supported only flat disk structure. [#47106](https://github.com/ClickHouse/ClickHouse/pull/47106) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Introduce a function `widthBucket` (with a `WIDTH_BUCKET` alias for compatibility). [#42974](https://github.com/ClickHouse/ClickHouse/issues/42974). [#46790](https://github.com/ClickHouse/ClickHouse/pull/46790) ([avoiderboi](https://github.com/avoiderboi)).
* Add new function `parseDateTime`/`parseDateTimeInJodaSyntax` according to the specified format string. parseDateTime parses String to DateTime in MySQL syntax, parseDateTimeInJodaSyntax parses in Joda syntax. [#46815](https://github.com/ClickHouse/ClickHouse/pull/46815) ([李扬](https://github.com/taiyang-li)).
* Use `dummy UInt8` for the default structure of table function `null`. Closes [#46930](https://github.com/ClickHouse/ClickHouse/issues/46930). [#47006](https://github.com/ClickHouse/ClickHouse/pull/47006) ([flynn](https://github.com/ucasfl)).
* Support for date format with a comma, like `Dec 15, 2021` in the `parseDateTimeBestEffort` function. Closes [#46816](https://github.com/ClickHouse/ClickHouse/issues/46816). [#47071](https://github.com/ClickHouse/ClickHouse/pull/47071) ([chen](https://github.com/xiedeyantu)).
* Add settings `http_wait_end_of_query` and `http_response_buffer_size` that corresponds to URL params `wait_end_of_query` and `buffer_size` for the HTTP interface. This allows changing these settings in the profiles. [#47108](https://github.com/ClickHouse/ClickHouse/pull/47108) ([Vladimir C](https://github.com/vdimir)).
* Add `system.dropped_tables` table that shows tables that were dropped from `Atomic` databases but were not completely removed yet. [#47364](https://github.com/ClickHouse/ClickHouse/pull/47364) ([chen](https://github.com/xiedeyantu)).
* Add `INSTR` as alias of `positionCaseInsensitive` for MySQL compatibility. Closes [#47529](https://github.com/ClickHouse/ClickHouse/issues/47529). [#47535](https://github.com/ClickHouse/ClickHouse/pull/47535) ([flynn](https://github.com/ucasfl)).
* Added `toDecimalString` function allowing to convert numbers to string with fixed precision. [#47838](https://github.com/ClickHouse/ClickHouse/pull/47838) ([Andrey Zvonov](https://github.com/zvonand)).
* Add a merge tree setting `max_number_of_mutations_for_replica`. It limits the number of part mutations per replica to the specified amount. Zero means no limit on the number of mutations per replica (the execution can still be constrained by other settings). [#48047](https://github.com/ClickHouse/ClickHouse/pull/48047) ([Vladimir C](https://github.com/vdimir)).
* Add the Map-related function `mapFromArrays`, which allows the creation of a map from a pair of arrays. [#31125](https://github.com/ClickHouse/ClickHouse/pull/31125) ([李扬](https://github.com/taiyang-li)).
* Allow control of compression in Parquet/ORC/Arrow output formats, adds support for more compression input formats. This closes [#13541](https://github.com/ClickHouse/ClickHouse/issues/13541). [#47114](https://github.com/ClickHouse/ClickHouse/pull/47114) ([Kruglov Pavel](https://github.com/Avogar)).
* Add SSL User Certificate authentication to the native protocol. Closes [#47077](https://github.com/ClickHouse/ClickHouse/issues/47077). [#47596](https://github.com/ClickHouse/ClickHouse/pull/47596) ([Nikolay Degterinsky](https://github.com/evillique)).
* Add \*OrNull() and \*OrZero() variants for `parseDateTime`, add alias `str_to_date` for MySQL parity. [#48000](https://github.com/ClickHouse/ClickHouse/pull/48000) ([Robert Schulze](https://github.com/rschu1ze)).
* Added operator `REGEXP` (similar to operators "LIKE", "IN", "MOD" etc.) for better compatibility with MySQL [#47869](https://github.com/ClickHouse/ClickHouse/pull/47869) ([Robert Schulze](https://github.com/rschu1ze)).

<h4 id="performance-improvement-9">
  Performance Improvement
</h4>

* Marks in memory are now compressed, using 3-6x less memory. [#47290](https://github.com/ClickHouse/ClickHouse/pull/47290) ([Michael Kolupaev](https://github.com/al13n321)).
* Backups for large numbers of files were unbelievably slow in previous versions. Not anymore. Now they are unbelievably fast. [#47251](https://github.com/ClickHouse/ClickHouse/pull/47251) ([Alexey Milovidov](https://github.com/alexey-milovidov)). Introduced a separate thread pool for backup's IO operations. This will allow scaling it independently of other pools and increase performance. [#47174](https://github.com/ClickHouse/ClickHouse/pull/47174) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)). Use MultiRead request and retries for collecting metadata at the final stage of backup processing. [#47243](https://github.com/ClickHouse/ClickHouse/pull/47243) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)). If a backup and restoring data are both in S3 then server-side copy should be used from now on. [#47546](https://github.com/ClickHouse/ClickHouse/pull/47546) ([Vitaly Baranov](https://github.com/vitlibar)).
* Fixed excessive reading in queries with `FINAL`. [#47801](https://github.com/ClickHouse/ClickHouse/pull/47801) ([Nikita Taranov](https://github.com/nickitat)).
* Setting `max_final_threads` would be set to the number of cores at server startup (by the same algorithm as used for `max_threads`). This improves the concurrency of `final` execution on servers with high number of CPUs. [#47915](https://github.com/ClickHouse/ClickHouse/pull/47915) ([Nikita Taranov](https://github.com/nickitat)).
* Allow executing reading pipeline for DIRECT dictionary with CLICKHOUSE source in multiple threads. To enable set `dictionary_use_async_executor=1` in `SETTINGS` section for source in `CREATE DICTIONARY` statement. [#47986](https://github.com/ClickHouse/ClickHouse/pull/47986) ([Vladimir C](https://github.com/vdimir)).
* Optimize one nullable key aggregate performance. [#45772](https://github.com/ClickHouse/ClickHouse/pull/45772) ([LiuNeng](https://github.com/liuneng1994)).
* Implemented lowercase `tokenbf_v1` index utilization for `hasTokenOrNull`, `hasTokenCaseInsensitive` and `hasTokenCaseInsensitiveOrNull`. [#46252](https://github.com/ClickHouse/ClickHouse/pull/46252) ([ltrk2](https://github.com/ltrk2)).
* Optimize functions `position` and `LIKE` by searching the first two chars using SIMD. [#46289](https://github.com/ClickHouse/ClickHouse/pull/46289) ([Jiebin Sun](https://github.com/jiebinn)).
* Optimize queries from the `system.detached_parts`, which could be significantly large. Added several sources with respect to the block size limitation; in each block, an IO thread pool is used to calculate the part size, i.e. to make syscalls in parallel. [#46624](https://github.com/ClickHouse/ClickHouse/pull/46624) ([Sema Checherinda](https://github.com/CheSema)).
* Increase the default value of `max_replicated_merges_in_queue` for ReplicatedMergeTree tables from 16 to 1000. It allows faster background merge operation on clusters with a very large number of replicas, such as clusters with shared storage in ClickHouse Cloud. [#47050](https://github.com/ClickHouse/ClickHouse/pull/47050) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Updated `clickhouse-copier` to use `GROUP BY` instead of `DISTINCT` to get the list of partitions. For large tables, this reduced the select time from over 500s to under 1s. [#47386](https://github.com/ClickHouse/ClickHouse/pull/47386) ([Clayton McClure](https://github.com/cmcclure-twilio)).
* Fix performance degradation in `ASOF JOIN`. [#47544](https://github.com/ClickHouse/ClickHouse/pull/47544) ([Ongkong](https://github.com/ongkong)).
* Even more batching in Keeper. Improve performance by avoiding breaking batches on read requests. [#47978](https://github.com/ClickHouse/ClickHouse/pull/47978) ([Antonio Andelic](https://github.com/antonio2368)).
* Allow PREWHERE for Merge with different DEFAULT expressions for columns. [#46831](https://github.com/ClickHouse/ClickHouse/pull/46831) ([Azat Khuzhin](https://github.com/azat)).

<h4 id="experimental-feature-6">
  Experimental Feature
</h4>

* Parallel replicas: Improved the overall performance by better utilizing the local replica, and forbid the reading with parallel replicas from non-replicated MergeTree by default. [#47858](https://github.com/ClickHouse/ClickHouse/pull/47858) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* Support filter push down to left table for JOIN with `Join`, `Dictionary` and `EmbeddedRocksDB` tables if the experimental Analyzer is enabled. [#47280](https://github.com/ClickHouse/ClickHouse/pull/47280) ([Maksim Kita](https://github.com/kitaisreal)).
* Now ReplicatedMergeTree with zero copy replication has less load to Keeper. [#47676](https://github.com/ClickHouse/ClickHouse/pull/47676) ([alesapin](https://github.com/alesapin)).
* Fix create materialized view with MaterializedPostgreSQL [#40807](https://github.com/ClickHouse/ClickHouse/pull/40807) ([Maksim Buren](https://github.com/maks-buren630501)).

<h4 id="improvement-9">
  Improvement
</h4>

* Enable `input_format_json_ignore_unknown_keys_in_named_tuple` by default. [#46742](https://github.com/ClickHouse/ClickHouse/pull/46742) ([Kruglov Pavel](https://github.com/Avogar)).
* Allow errors to be ignored while pushing to MATERIALIZED VIEW (add new setting `materialized_views_ignore_errors`, by default to `false`, but it is set to `true` for flushing logs to `system.*_log` tables unconditionally). [#46658](https://github.com/ClickHouse/ClickHouse/pull/46658) ([Azat Khuzhin](https://github.com/azat)).
* Track the file queue of distributed sends in memory. [#45491](https://github.com/ClickHouse/ClickHouse/pull/45491) ([Azat Khuzhin](https://github.com/azat)).
* Now `X-ClickHouse-Query-Id` and `X-ClickHouse-Timezone` headers are added to responses in all queries via HTTP protocol. Previously it was done only for `SELECT` queries. [#46364](https://github.com/ClickHouse/ClickHouse/pull/46364) ([Anton Popov](https://github.com/CurtizJ)).
* External tables from `MongoDB`: support for connection to a replica set via a URI with a host:port enum and support for the readPreference option in MongoDB dictionaries. Example URI: `mongodb://db0.example.com:27017,db1.example.com:27017,db2.example.com:27017/?replicaSet=myRepl&readPreference=primary`. [#46524](https://github.com/ClickHouse/ClickHouse/pull/46524) ([artem-yadr](https://github.com/artem-yadr)).
* This improvement should be invisible for you. Re-implement projection analysis on top of query plan. Added setting `query_plan_optimize_projection=1` to switch between old and new version. Fixes [#44963](https://github.com/ClickHouse/ClickHouse/issues/44963). [#46537](https://github.com/ClickHouse/ClickHouse/pull/46537) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Use Parquet format v2 instead of v1 in output format by default. Add setting `output_format_parquet_version` to control parquet version, possible values `1.0`, `2.4`, `2.6`, `2.latest` (default). [#46617](https://github.com/ClickHouse/ClickHouse/pull/46617) ([Kruglov Pavel](https://github.com/Avogar)).
* It is now possible to use the new configuration syntax to configure Kafka topics with periods (`.`) in their name. [#46752](https://github.com/ClickHouse/ClickHouse/pull/46752) ([Robert Schulze](https://github.com/rschu1ze)).
* Fix heuristics that check hyperscan patterns for problematic repeats. [#46819](https://github.com/ClickHouse/ClickHouse/pull/46819) ([Robert Schulze](https://github.com/rschu1ze)).
* Don't report ZK node exists to system.errors when a block was created concurrently by a different replica. [#46820](https://github.com/ClickHouse/ClickHouse/pull/46820) ([Raúl Marín](https://github.com/Algunenano)).
* Increase the limit for opened files in `clickhouse-local`. It will be able to read from `web` tables on servers with a huge number of CPU cores. Do not back off reading from the URL table engine in case of too many opened files. This closes [#46852](https://github.com/ClickHouse/ClickHouse/issues/46852). [#46853](https://github.com/ClickHouse/ClickHouse/pull/46853) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Exceptions thrown when numbers cannot be parsed now have an easier-to-read exception message. [#46917](https://github.com/ClickHouse/ClickHouse/pull/46917) ([Robert Schulze](https://github.com/rschu1ze)).
* Added update `system.backups` after every processed task to track the progress of backups. [#46989](https://github.com/ClickHouse/ClickHouse/pull/46989) ([Aleksandr Musorin](https://github.com/AVMusorin)).
* Allow types conversion in Native input format. Add settings `input_format_native_allow_types_conversion` that controls it (enabled by default). [#46990](https://github.com/ClickHouse/ClickHouse/pull/46990) ([Kruglov Pavel](https://github.com/Avogar)).
* Allow IPv4 in the `range` function to generate IP ranges. [#46995](https://github.com/ClickHouse/ClickHouse/pull/46995) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* Improve exception message when it's impossible to move a part from one volume/disk to another. [#47032](https://github.com/ClickHouse/ClickHouse/pull/47032) ([alesapin](https://github.com/alesapin)).
* Support `Bool` type in `JSONType` function. Previously `Null` type was mistakenly returned for bool values. [#47046](https://github.com/ClickHouse/ClickHouse/pull/47046) ([Anton Popov](https://github.com/CurtizJ)).
* Use `_request_body` parameter to configure predefined HTTP queries. [#47086](https://github.com/ClickHouse/ClickHouse/pull/47086) ([Constantine Peresypkin](https://github.com/pkit)).
* Automatic indentation in the built-in UI SQL editor when Enter is pressed. [#47113](https://github.com/ClickHouse/ClickHouse/pull/47113) ([Alexey Korepanov](https://github.com/alexkorep)).
* Self-extraction with 'sudo' will attempt to set uid and gid of extracted files to running user. [#47116](https://github.com/ClickHouse/ClickHouse/pull/47116) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* Previously, the `repeat` function's second argument only accepted an unsigned integer type, which meant it could not accept values such as -1. This behavior differed from that of the Spark function. In this update, the repeat function has been modified to match the behavior of the Spark function. It now accepts the same types of inputs, including negative integers. Extensive testing has been performed to verify the correctness of the updated implementation. [#47134](https://github.com/ClickHouse/ClickHouse/pull/47134) ([KevinyhZou](https://github.com/KevinyhZou)). Note: the changelog entry was rewritten by ChatGPT.
* Remove `::__1` part from stacktraces. Display `std::basic_string<char, ...` as `String` in stacktraces. [#47171](https://github.com/ClickHouse/ClickHouse/pull/47171) ([Mike Kot](https://github.com/myrrc)).
* Reimplement interserver mode to avoid replay attacks (note, that change is backward compatible with older servers). [#47213](https://github.com/ClickHouse/ClickHouse/pull/47213) ([Azat Khuzhin](https://github.com/azat)).
* Improve recognition of regular expression groups and refine the regexp\_tree dictionary. [#47218](https://github.com/ClickHouse/ClickHouse/pull/47218) ([Han Fei](https://github.com/hanfei1991)).
* Keeper improvement: Add new 4LW `clrs` to clean resources used by Keeper (e.g. release unused memory). [#47256](https://github.com/ClickHouse/ClickHouse/pull/47256) ([Antonio Andelic](https://github.com/antonio2368)).
* Add optional arguments to codecs `DoubleDelta(bytes_size)`, `Gorilla(bytes_size)`, `FPC(level, float_size)`, this allows using these codecs without column type in `clickhouse-compressor`. Fix possible aborts and arithmetic errors in `clickhouse-compressor` with these codecs. Fixes: [https://github.com/ClickHouse/ClickHouse/discussions/47262](https://github.com/ClickHouse/ClickHouse/discussions/47262). [#47271](https://github.com/ClickHouse/ClickHouse/pull/47271) ([Kruglov Pavel](https://github.com/Avogar)).
* Add support for big int types to the `runningDifference` function. Closes [#47194](https://github.com/ClickHouse/ClickHouse/issues/47194). [#47322](https://github.com/ClickHouse/ClickHouse/pull/47322) ([Nikolay Degterinsky](https://github.com/evillique)).
* Add an expiration window for S3 credentials that have an expiration time to avoid `ExpiredToken` errors in some edge cases. It can be controlled with `expiration_window_seconds` config, the default is 120 seconds. [#47423](https://github.com/ClickHouse/ClickHouse/pull/47423) ([Antonio Andelic](https://github.com/antonio2368)).
* Support Decimals and Date32 in `Avro` format. [#47434](https://github.com/ClickHouse/ClickHouse/pull/47434) ([Kruglov Pavel](https://github.com/Avogar)).
* Do not start the server if an interrupted conversion from `Ordinary` to `Atomic` was detected, print a better error message with troubleshooting instructions. [#47487](https://github.com/ClickHouse/ClickHouse/pull/47487) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Add a new column `kind` to the `system.opentelemetry_span_log`. This column holds the value of [SpanKind](https://opentelemetry.io/docs/reference/specification/trace/api/#spankind) defined in OpenTelemtry. [#47499](https://github.com/ClickHouse/ClickHouse/pull/47499) ([Frank Chen](https://github.com/FrankChen021)).
* Allow reading/writing nested arrays in `Protobuf` format with only the root field name as column name. Previously column name should've contained all nested field names (like `a.b.c Array(Array(Array(UInt32)))`, now you can use just `a Array(Array(Array(UInt32)))`. [#47650](https://github.com/ClickHouse/ClickHouse/pull/47650) ([Kruglov Pavel](https://github.com/Avogar)).
* Added an optional `STRICT` modifier for `SYSTEM SYNC REPLICA` which makes the query wait for the replication queue to become empty (just like it worked before [https://github.com/ClickHouse/ClickHouse/pull/45648](https://github.com/ClickHouse/ClickHouse/pull/45648)). [#47659](https://github.com/ClickHouse/ClickHouse/pull/47659) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Improve the naming of some OpenTelemetry span logs. [#47667](https://github.com/ClickHouse/ClickHouse/pull/47667) ([Frank Chen](https://github.com/FrankChen021)).
* Prevent using too long chains of aggregate function combinators (they can lead to slow queries in the analysis stage). This closes [#47715](https://github.com/ClickHouse/ClickHouse/issues/47715). [#47716](https://github.com/ClickHouse/ClickHouse/pull/47716) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Support for subquery in parameterized views; resolves [#46741](https://github.com/ClickHouse/ClickHouse/issues/46741) [#47725](https://github.com/ClickHouse/ClickHouse/pull/47725) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* Fix memory leak in MySQL integration (reproduces with `connection_auto_close=1`). [#47732](https://github.com/ClickHouse/ClickHouse/pull/47732) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Improved error handling in the code related to Decimal parameters, resulting in more informative error messages. Previously, when incorrect Decimal parameters were supplied, the error message generated was unclear or unhelpful. With this update, the error message printed has been fixed to provide more detailed and useful information, making it easier to identify and correct issues related to Decimal parameters. [#47812](https://github.com/ClickHouse/ClickHouse/pull/47812) ([Yu Feng](https://github.com/Vigor-jpg)). Note: this changelog entry is rewritten by ChatGPT.
* The parameter `exact_rows_before_limit` is used to make `rows_before_limit_at_least` is designed to accurately reflect the number of rows returned before the limit is reached. This pull request addresses issues encountered when the query involves distributed processing across multiple shards or sorting operations. Prior to this update, these scenarios were not functioning as intended. [#47874](https://github.com/ClickHouse/ClickHouse/pull/47874) ([Amos Bird](https://github.com/amosbird)).
* ThreadPools metrics introspection. [#47880](https://github.com/ClickHouse/ClickHouse/pull/47880) ([Azat Khuzhin](https://github.com/azat)).
* Add `WriteBufferFromS3Microseconds` and `WriteBufferFromS3RequestsErrors` profile events. [#47885](https://github.com/ClickHouse/ClickHouse/pull/47885) ([Antonio Andelic](https://github.com/antonio2368)).
* Add `--link` and `--noninteractive` (`-y`) options to ClickHouse install. Closes [#47750](https://github.com/ClickHouse/ClickHouse/issues/47750). [#47887](https://github.com/ClickHouse/ClickHouse/pull/47887) ([Nikolay Degterinsky](https://github.com/evillique)).
* Fixed `UNKNOWN_TABLE` exception when attaching to a materialized view that has dependent tables that are not available. This might be useful when trying to restore state from a backup. [#47975](https://github.com/ClickHouse/ClickHouse/pull/47975) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* Fix case when the (optional) path is not added to an encrypted disk configuration. [#47981](https://github.com/ClickHouse/ClickHouse/pull/47981) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Support for CTE in parameterized views Implementation: Updated to allow query parameters while evaluating scalar subqueries. [#48065](https://github.com/ClickHouse/ClickHouse/pull/48065) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* Support big integers `(U)Int128/(U)Int256`, `Map` with any key type and `DateTime64` with any precision (not only 3 and 6). [#48119](https://github.com/ClickHouse/ClickHouse/pull/48119) ([Kruglov Pavel](https://github.com/Avogar)).
* Allow skipping errors related to unknown enum values in row input formats. [#48133](https://github.com/ClickHouse/ClickHouse/pull/48133) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="buildtestingpackaging-improvement-9">
  Build/Testing/Packaging Improvement
</h4>

* ClickHouse now builds with `C++23`. [#47424](https://github.com/ClickHouse/ClickHouse/pull/47424) ([Robert Schulze](https://github.com/rschu1ze)).
* Fuzz `EXPLAIN` queries in the AST Fuzzer. [#47803](https://github.com/ClickHouse/ClickHouse/pull/47803) [#47852](https://github.com/ClickHouse/ClickHouse/pull/47852) ([flynn](https://github.com/ucasfl)).
* Split stress test and the automated backward compatibility check (now Upgrade check). [#44879](https://github.com/ClickHouse/ClickHouse/pull/44879) ([Kruglov Pavel](https://github.com/Avogar)).
* Updated the Ubuntu Image for Docker to calm down some bogus security reports. [#46784](https://github.com/ClickHouse/ClickHouse/pull/46784) ([Julio Jimenez](https://github.com/juliojimenez)). Please note that ClickHouse has no dependencies and does not require Docker.
* Adds a prompt to allow the removal of an existing `clickhouse` download when using "curl | sh" download of ClickHouse. Prompt is "ClickHouse binary clickhouse already exists. Overwrite? \[y/N]". [#46859](https://github.com/ClickHouse/ClickHouse/pull/46859) ([Dan Roscigno](https://github.com/DanRoscigno)).
* Fix error during server startup on old distros (e.g. Amazon Linux 2) and on ARM that glibc 2.28 symbols are not found. [#47008](https://github.com/ClickHouse/ClickHouse/pull/47008) ([Robert Schulze](https://github.com/rschu1ze)).
* Prepare for clang 16. [#47027](https://github.com/ClickHouse/ClickHouse/pull/47027) ([Amos Bird](https://github.com/amosbird)).
* Added a CI check which ensures ClickHouse can run with an old glibc on ARM. [#47063](https://github.com/ClickHouse/ClickHouse/pull/47063) ([Robert Schulze](https://github.com/rschu1ze)).
* Add a style check to prevent incorrect usage of the `NDEBUG` macro. [#47699](https://github.com/ClickHouse/ClickHouse/pull/47699) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Speed up the build a little. [#47714](https://github.com/ClickHouse/ClickHouse/pull/47714) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Bump `vectorscan` to 5.4.9. [#47955](https://github.com/ClickHouse/ClickHouse/pull/47955) ([Robert Schulze](https://github.com/rschu1ze)).
* Add a unit test to assert Apache Arrow's fatal logging does not abort. It covers the changes in [ClickHouse/arrow#16](https://github.com/ClickHouse/arrow/pull/16). [#47958](https://github.com/ClickHouse/ClickHouse/pull/47958) ([Arthur Passos](https://github.com/arthurpassos)).
* Restore the ability of native macOS debug server build to start. [#48050](https://github.com/ClickHouse/ClickHouse/pull/48050) ([Robert Schulze](https://github.com/rschu1ze)). Note: this change is only relevant for development, as the ClickHouse official builds are done with cross-compilation.

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-9">
  Bug Fix (user-visible misbehavior in an official stable release)
</h4>

* Fix formats parser resetting, test processing bad messages in `Kafka` [#45693](https://github.com/ClickHouse/ClickHouse/pull/45693) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix data size calculation in Keeper [#46086](https://github.com/ClickHouse/ClickHouse/pull/46086) ([Antonio Andelic](https://github.com/antonio2368)).
* Fixed a bug in automatic retries of `DROP TABLE` query with `ReplicatedMergeTree` tables and `Atomic` databases. In rare cases it could lead to `Can't get data for node /zk_path/log_pointer` and `The specified key does not exist` errors if the ZooKeeper session expired during DROP and a new replicated table with the same path in ZooKeeper was created in parallel. [#46384](https://github.com/ClickHouse/ClickHouse/pull/46384) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix incorrect alias recursion while normalizing queries that prevented some queries to run. [#46609](https://github.com/ClickHouse/ClickHouse/pull/46609) ([Raúl Marín](https://github.com/Algunenano)).
* Fix IPv4/IPv6 serialization/deserialization in binary formats [#46616](https://github.com/ClickHouse/ClickHouse/pull/46616) ([Kruglov Pavel](https://github.com/Avogar)).
* ActionsDAG: do not change result of `and` during optimization [#46653](https://github.com/ClickHouse/ClickHouse/pull/46653) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* Improve query cancellation when a client dies [#46681](https://github.com/ClickHouse/ClickHouse/pull/46681) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix arithmetic operations in aggregate optimization [#46705](https://github.com/ClickHouse/ClickHouse/pull/46705) ([Duc Canh Le](https://github.com/canhld94)).
* Fix possible `clickhouse-local`'s abort on JSONEachRow schema inference [#46731](https://github.com/ClickHouse/ClickHouse/pull/46731) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix changing an expired role [#46772](https://github.com/ClickHouse/ClickHouse/pull/46772) ([Vitaly Baranov](https://github.com/vitlibar)).
* Fix combined PREWHERE column accumulation from multiple steps [#46785](https://github.com/ClickHouse/ClickHouse/pull/46785) ([Alexander Gololobov](https://github.com/davenger)).
* Use initial range for fetching file size in HTTP read buffer. Without this change, some remote files couldn't be processed. [#46824](https://github.com/ClickHouse/ClickHouse/pull/46824) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix the incorrect progress bar while using the URL tables [#46830](https://github.com/ClickHouse/ClickHouse/pull/46830) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix MSan report in `maxIntersections` function [#46847](https://github.com/ClickHouse/ClickHouse/pull/46847) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix a bug in `Map` data type [#46856](https://github.com/ClickHouse/ClickHouse/pull/46856) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix wrong results of some LIKE searches when the LIKE pattern contains quoted non-quotable characters [#46875](https://github.com/ClickHouse/ClickHouse/pull/46875) ([Robert Schulze](https://github.com/rschu1ze)).
* Fix - WITH FILL would produce abort when the Filling Transform processing an empty block [#46897](https://github.com/ClickHouse/ClickHouse/pull/46897) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* Fix date and int inference from string in JSON [#46972](https://github.com/ClickHouse/ClickHouse/pull/46972) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix bug in zero-copy replication disk choice during fetch [#47010](https://github.com/ClickHouse/ClickHouse/pull/47010) ([alesapin](https://github.com/alesapin)).
* Fix a typo in systemd service definition [#47051](https://github.com/ClickHouse/ClickHouse/pull/47051) ([Palash Goel](https://github.com/palash-goel)).
* Fix the NOT\_IMPLEMENTED error with CROSS JOIN and algorithm = auto [#47068](https://github.com/ClickHouse/ClickHouse/pull/47068) ([Vladimir C](https://github.com/vdimir)).
* Fix the problem that the 'ReplicatedMergeTree' table failed to insert two similar data when the 'part\_type' is configured as 'InMemory' mode (experimental feature). [#47121](https://github.com/ClickHouse/ClickHouse/pull/47121) ([liding1992](https://github.com/liding1992)).
* External dictionaries / library-bridge: Fix error "unknown library method 'extDict\_libClone'" [#47136](https://github.com/ClickHouse/ClickHouse/pull/47136) ([alex filatov](https://github.com/phil-88)).
* Fix race condition in a grace hash join with limit [#47153](https://github.com/ClickHouse/ClickHouse/pull/47153) ([Vladimir C](https://github.com/vdimir)).
* Fix concrete columns PREWHERE support [#47154](https://github.com/ClickHouse/ClickHouse/pull/47154) ([Azat Khuzhin](https://github.com/azat)).
* Fix possible deadlock in Query Status [#47161](https://github.com/ClickHouse/ClickHouse/pull/47161) ([Kruglov Pavel](https://github.com/Avogar)).
* Forbid insert select for the same `Join` table, as it leads to a deadlock [#47260](https://github.com/ClickHouse/ClickHouse/pull/47260) ([Vladimir C](https://github.com/vdimir)).
* Skip merged partitions for `min_age_to_force_merge_seconds` merges [#47303](https://github.com/ClickHouse/ClickHouse/pull/47303) ([Antonio Andelic](https://github.com/antonio2368)).
* Modify find\_first\_symbols, so it works as expected for find\_first\_not\_symbols [#47304](https://github.com/ClickHouse/ClickHouse/pull/47304) ([Arthur Passos](https://github.com/arthurpassos)).
* Fix big numbers inference in CSV [#47410](https://github.com/ClickHouse/ClickHouse/pull/47410) ([Kruglov Pavel](https://github.com/Avogar)).
* Disable logical expression optimizer for expression with aliases. [#47451](https://github.com/ClickHouse/ClickHouse/pull/47451) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix error in `decodeURLComponent` [#47457](https://github.com/ClickHouse/ClickHouse/pull/47457) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix explain graph with projection [#47473](https://github.com/ClickHouse/ClickHouse/pull/47473) ([flynn](https://github.com/ucasfl)).
* Fix query parameters [#47488](https://github.com/ClickHouse/ClickHouse/pull/47488) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Parameterized view: a bug fix. [#47495](https://github.com/ClickHouse/ClickHouse/pull/47495) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* Fuzzer of data formats, and the corresponding fixes. [#47519](https://github.com/ClickHouse/ClickHouse/pull/47519) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix monotonicity check for `DateTime64` [#47526](https://github.com/ClickHouse/ClickHouse/pull/47526) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix "block structure mismatch" for a Nullable LowCardinality column [#47537](https://github.com/ClickHouse/ClickHouse/pull/47537) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Proper fix for a bug in Apache Parquet [#45878](https://github.com/ClickHouse/ClickHouse/issues/45878) [#47538](https://github.com/ClickHouse/ClickHouse/pull/47538) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix `BSONEachRow` parallel parsing when document size is invalid [#47540](https://github.com/ClickHouse/ClickHouse/pull/47540) ([Kruglov Pavel](https://github.com/Avogar)).
* Preserve error in `system.distribution_queue` on `SYSTEM FLUSH DISTRIBUTED` [#47541](https://github.com/ClickHouse/ClickHouse/pull/47541) ([Azat Khuzhin](https://github.com/azat)).
* Check for duplicate column in `BSONEachRow` format [#47609](https://github.com/ClickHouse/ClickHouse/pull/47609) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix wait for zero copy lock during move [#47631](https://github.com/ClickHouse/ClickHouse/pull/47631) ([alesapin](https://github.com/alesapin)).
* Fix aggregation by partitions [#47634](https://github.com/ClickHouse/ClickHouse/pull/47634) ([Nikita Taranov](https://github.com/nickitat)).
* Fix bug in tuple as array serialization in `BSONEachRow` format [#47690](https://github.com/ClickHouse/ClickHouse/pull/47690) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix crash in `polygonsSymDifferenceCartesian` [#47702](https://github.com/ClickHouse/ClickHouse/pull/47702) ([pufit](https://github.com/pufit)).
* Fix reading from storage `File` compressed files with `zlib` and `gzip` compression [#47796](https://github.com/ClickHouse/ClickHouse/pull/47796) ([Anton Popov](https://github.com/CurtizJ)).
* Improve empty query detection for PostgreSQL (for pgx golang driver) [#47854](https://github.com/ClickHouse/ClickHouse/pull/47854) ([Azat Khuzhin](https://github.com/azat)).
* Fix DateTime monotonicity check for LowCardinality types [#47860](https://github.com/ClickHouse/ClickHouse/pull/47860) ([Antonio Andelic](https://github.com/antonio2368)).
* Use restore\_threads (not backup\_threads) for RESTORE ASYNC [#47861](https://github.com/ClickHouse/ClickHouse/pull/47861) ([Azat Khuzhin](https://github.com/azat)).
* Fix DROP COLUMN with ReplicatedMergeTree containing projections [#47883](https://github.com/ClickHouse/ClickHouse/pull/47883) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix for Replicated database recovery [#47901](https://github.com/ClickHouse/ClickHouse/pull/47901) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Hotfix for too verbose warnings in HTTP [#47903](https://github.com/ClickHouse/ClickHouse/pull/47903) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix "Field value too long" in `catboostEvaluate` [#47970](https://github.com/ClickHouse/ClickHouse/pull/47970) ([Robert Schulze](https://github.com/rschu1ze)).
* Fix [#36971](https://github.com/ClickHouse/ClickHouse/issues/36971): Watchdog: exit with non-zero code if child process exits [#47973](https://github.com/ClickHouse/ClickHouse/pull/47973) ([Коренберг Марк](https://github.com/socketpair)).
* Fix for "index file `cidx` is unexpectedly long" [#48010](https://github.com/ClickHouse/ClickHouse/pull/48010) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* Fix MaterializedPostgreSQL query to get attributes (replica-identity) [#48015](https://github.com/ClickHouse/ClickHouse/pull/48015) ([Solomatov Sergei](https://github.com/solomatovs)).
* parseDateTime(): Fix UB (signed integer overflow) [#48019](https://github.com/ClickHouse/ClickHouse/pull/48019) ([Robert Schulze](https://github.com/rschu1ze)).
* Use unique names for Records in Avro to avoid reusing its schema [#48057](https://github.com/ClickHouse/ClickHouse/pull/48057) ([Kruglov Pavel](https://github.com/Avogar)).
* Correctly set TCP/HTTP socket timeouts in Keeper [#48108](https://github.com/ClickHouse/ClickHouse/pull/48108) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix possible member call on null pointer in `Avro` format [#48184](https://github.com/ClickHouse/ClickHouse/pull/48184) ([Kruglov Pavel](https://github.com/Avogar)).
