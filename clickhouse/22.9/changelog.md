<h3 id="a-id229a-clickhouse-release-229-2022-09-22">
  <a id="229" /> ClickHouse release 22.9, 2022-09-22. [Presentation](https://presentations.clickhouse.com/2022-release-22.9/), [Video](https://www.youtube.com/watch?v=rK2BsaaaOCA)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/rK2BsaaaOCA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-2">
  Backward Incompatible Change
</h4>

* Upgrade from 20.3 and older to 22.9 and newer should be done through an intermediate version if there are any `ReplicatedMergeTree` tables, otherwise server with the new version will not start. [#40641](https://github.com/ClickHouse/ClickHouse/pull/40641) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Remove the functions `accurate_Cast` and `accurate_CastOrNull` (they are different to `accurateCast` and `accurateCastOrNull` by underscore in the name and they are not affected by the value of `cast_keep_nullable` setting). These functions were undocumented, untested, unused, and unneeded. They appeared to be alive due to code generalization. [#40682](https://github.com/ClickHouse/ClickHouse/pull/40682) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add a test to ensure that every new table function will be documented. See [#40649](https://github.com/ClickHouse/ClickHouse/issues/40649). Rename table function `MeiliSearch` to `meilisearch`. [#40709](https://github.com/ClickHouse/ClickHouse/pull/40709) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add a test to ensure that every new function will be documented. See [#40649](https://github.com/ClickHouse/ClickHouse/pull/40649). The functions `lemmatize`, `synonyms`, `stem` were case-insensitive by mistake. Now they are case-sensitive. [#40711](https://github.com/ClickHouse/ClickHouse/pull/40711) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* For security and stability reasons, catboost models are no longer evaluated within the ClickHouse server. Instead, the evaluation is now
  done in the clickhouse-library-bridge, a separate process that loads the catboost library and communicates with the server process via
  HTTP. [#40897](https://github.com/ClickHouse/ClickHouse/pull/40897) ([Robert Schulze](https://github.com/rschu1ze)).
* Make interpretation of YAML configs to be more conventional. [#41044](https://github.com/ClickHouse/ClickHouse/pull/41044) ([Vitaly Baranov](https://github.com/vitlibar)).

<h4 id="new-feature-3">
  New Feature
</h4>

* Support `insert_quorum = 'auto'` to use majority number. [#39970](https://github.com/ClickHouse/ClickHouse/pull/39970) ([Sachin](https://github.com/SachinSetiya)).
* Add embedded dashboards to ClickHouse server. This is a demo project about how to achieve 90% results with 1% effort using ClickHouse features. [#40461](https://github.com/ClickHouse/ClickHouse/pull/40461) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Added new settings constraint writability kind `changeable_in_readonly`. [#40631](https://github.com/ClickHouse/ClickHouse/pull/40631) ([Sergei Trifonov](https://github.com/serxa)).
* Add support for `INTERSECT DISTINCT` and `EXCEPT DISTINCT`. [#40792](https://github.com/ClickHouse/ClickHouse/pull/40792) ([Duc Canh Le](https://github.com/canhld94)).
* Add new input/output format `JSONObjectEachRow` - Support import for formats `JSON/JSONCompact/JSONColumnsWithMetadata`. Add new setting `input_format_json_validate_types_from_metadata` that controls whether we should check if data types from metadata match data types from the header. - Add new setting `input_format_json_validate_utf8`, when it's enabled, all `JSON` formats will validate UTF-8 sequences. It will be disabled by default. Note that this setting doesn't influence output formats `JSON/JSONCompact/JSONColumnsWithMetadata`, they always validate utf8 sequences (this exception was made because of compatibility reasons). - Add new setting `input_format_json_read_numbers_as_strings ` that allows to parse numbers in String column, the setting is disabled by default. - Add new setting `output_format_json_quote_decimals` that allows to output decimals in double quotes, disabled by default. - Allow to parse decimals in double quotes during data import. [#40910](https://github.com/ClickHouse/ClickHouse/pull/40910) ([Kruglov Pavel](https://github.com/Avogar)).
* Query parameters supported in DESCRIBE TABLE query. [#40952](https://github.com/ClickHouse/ClickHouse/pull/40952) ([Nikita Taranov](https://github.com/nickitat)).
* Add support to Parquet Time32/64 by converting it into DateTime64. Parquet time32/64 represents time elapsed since midnight, while DateTime32/64 represents an actual unix timestamp. Conversion simply offsets from `0`. [#41333](https://github.com/ClickHouse/ClickHouse/pull/41333) ([Arthur Passos](https://github.com/arthurpassos)).
* Implement set operations on Apache Datasketches. [#39919](https://github.com/ClickHouse/ClickHouse/pull/39919) ([Fangyuan Deng](https://github.com/pzhdfy)). Note: there is no point of using Apache Datasketches, they are inferiour than ClickHouse and only make sense for integration with other systems.
* Allow recording errors to specified file while reading text formats (`CSV`, `TSV`). [#40516](https://github.com/ClickHouse/ClickHouse/pull/40516) ([zjial](https://github.com/zjial)).

<h4 id="experimental-feature-3">
  Experimental Feature
</h4>

* Add ANN (approximate nearest neighbor) index based on `Annoy`. [#40818](https://github.com/ClickHouse/ClickHouse/pull/40818) ([Filatenkov Artur](https://github.com/FArthur-cmd)). [#37215](https://github.com/ClickHouse/ClickHouse/pull/37215) ([VVMak](https://github.com/VVMak)).
* Add new storage engine `KeeperMap`, that uses ClickHouse Keeper or ZooKeeper as a key-value store. [#39976](https://github.com/ClickHouse/ClickHouse/pull/39976) ([Antonio Andelic](https://github.com/antonio2368)). This storage engine is intended to store a small amount of metadata.
* Improvement for in-memory data parts: remove completely processed WAL files. [#40592](https://github.com/ClickHouse/ClickHouse/pull/40592) ([Azat Khuzhin](https://github.com/azat)).

<h4 id="performance-improvement-3">
  Performance Improvement
</h4>

* Implement compression of marks and primary key. Close [#34437](https://github.com/ClickHouse/ClickHouse/issues/34437). [#37693](https://github.com/ClickHouse/ClickHouse/pull/37693) ([zhongyuankai](https://github.com/zhongyuankai)).
* Allow to load marks with threadpool in advance. Regulated by setting `load_marks_asynchronously` (default: 0). [#40821](https://github.com/ClickHouse/ClickHouse/pull/40821) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Virtual filesystem over s3 will use random object names split into multiple path prefixes for better performance on AWS. [#40968](https://github.com/ClickHouse/ClickHouse/pull/40968) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Account `max_block_size` value while producing single-level aggregation results. Allows to execute following query plan steps using more threads. [#39138](https://github.com/ClickHouse/ClickHouse/pull/39138) ([Nikita Taranov](https://github.com/nickitat)).
* Software prefetching is used in aggregation to speed up operations with hash tables. Controlled by the setting `enable_software_prefetch_in_aggregation`, enabled by default. [#39304](https://github.com/ClickHouse/ClickHouse/pull/39304) ([Nikita Taranov](https://github.com/nickitat)).
* Better support of `optimize_read_in_order` in case when some of sorting key columns are always constant after applying `WHERE` clause. E.g. query like `SELECT ... FROM table WHERE a = 'x' ORDER BY a, b`, where `table` has storage definition: `MergeTree ORDER BY (a, b)`. [#38715](https://github.com/ClickHouse/ClickHouse/pull/38715) ([Anton Popov](https://github.com/CurtizJ)).
* Filter joined streams for `full_sorting_join` by each other before sorting. [#39418](https://github.com/ClickHouse/ClickHouse/pull/39418) ([Vladimir C](https://github.com/vdimir)).
* LZ4 decompression optimised by skipping empty literals processing. [#40142](https://github.com/ClickHouse/ClickHouse/pull/40142) ([Nikita Taranov](https://github.com/nickitat)).
* Speedup backup process using native `copy` when possible instead of copying through `clickhouse-server` memory. [#40395](https://github.com/ClickHouse/ClickHouse/pull/40395) ([alesapin](https://github.com/alesapin)).
* Do not obtain storage snapshot for each INSERT block (slightly improves performance). [#40638](https://github.com/ClickHouse/ClickHouse/pull/40638) ([Azat Khuzhin](https://github.com/azat)).
* Implement batch processing for aggregate functions with multiple nullable arguments. [#41058](https://github.com/ClickHouse/ClickHouse/pull/41058) ([Raúl Marín](https://github.com/Algunenano)).
* Speed up reading UniquesHashSet (`uniqState` from disk for example). [#41089](https://github.com/ClickHouse/ClickHouse/pull/41089) ([Raúl Marín](https://github.com/Algunenano)).
* Fixed high memory usage while executing mutations of compact parts in tables with huge number of columns. [#41122](https://github.com/ClickHouse/ClickHouse/pull/41122) ([lthaooo](https://github.com/lthaooo)).
* Enable the vectorscan library on ARM, this speeds up regexp evaluation. [#41033](https://github.com/ClickHouse/ClickHouse/pull/41033) ([Robert Schulze](https://github.com/rschu1ze)).
* Upgrade vectorscan to 5.4.8 which has many performance optimizations to speed up regexp evaluation. [#41270](https://github.com/ClickHouse/ClickHouse/pull/41270) ([Robert Schulze](https://github.com/rschu1ze)).
* Fix incorrect fallback to skip the local filesystem cache for VFS (like S3) which happened on very high concurrency level. [#40420](https://github.com/ClickHouse/ClickHouse/pull/40420) ([Kseniia Sumarokova](https://github.com/kssenii)).
* If row policy filter is always false, return empty result immediately without reading any data. This closes [#24012](https://github.com/ClickHouse/ClickHouse/issues/24012). [#40740](https://github.com/ClickHouse/ClickHouse/pull/40740) ([Amos Bird](https://github.com/amosbird)).
* Parallel hash JOIN for Float data types might be suboptimal. Make it better. [#41183](https://github.com/ClickHouse/ClickHouse/pull/41183) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="improvement-3">
  Improvement
</h4>

* During startup and ATTACH call, `ReplicatedMergeTree` tables will be readonly until the ZooKeeper connection is made and the setup is finished. [#40148](https://github.com/ClickHouse/ClickHouse/pull/40148) ([Antonio Andelic](https://github.com/antonio2368)).
* Add `enable_extended_results_for_datetime_functions` option to return results of type Date32 for functions toStartOfYear, toStartOfISOYear, toStartOfQuarter, toStartOfMonth, toStartOfWeek, toMonday and toLastDayOfMonth when argument is Date32 or DateTime64, otherwise results of Date type are returned. For compatibility reasons default value is '0'. [#41214](https://github.com/ClickHouse/ClickHouse/pull/41214) ([Roman Vasin](https://github.com/rvasin)).
* For security and stability reasons, CatBoost models are no longer evaluated within the ClickHouse server. Instead, the evaluation is now done in the clickhouse-library-bridge, a separate process that loads the catboost library and communicates with the server process via HTTP. Function `modelEvaluate()` was replaced by `catboostEvaluate()`. [#40897](https://github.com/ClickHouse/ClickHouse/pull/40897) ([Robert Schulze](https://github.com/rschu1ze)). [#39629](https://github.com/ClickHouse/ClickHouse/pull/39629) ([Robert Schulze](https://github.com/rschu1ze)).
* Add more metrics for on-disk temporary data, close [#40206](https://github.com/ClickHouse/ClickHouse/issues/40206). [#40239](https://github.com/ClickHouse/ClickHouse/pull/40239) ([Vladimir C](https://github.com/vdimir)).
* Add config option `warning_supress_regexp`, close [#40330](https://github.com/ClickHouse/ClickHouse/issues/40330). [#40548](https://github.com/ClickHouse/ClickHouse/pull/40548) ([Vladimir C](https://github.com/vdimir)).
* Add setting to disable limit on kafka\_num\_consumers. Closes [#40331](https://github.com/ClickHouse/ClickHouse/issues/40331). [#40670](https://github.com/ClickHouse/ClickHouse/pull/40670) ([Kruglov Pavel](https://github.com/Avogar)).
* Support `SETTINGS` in `DELETE ...` query. [#41533](https://github.com/ClickHouse/ClickHouse/pull/41533) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Detailed S3 profile events `DiskS3*` per S3 API call split for S3 ObjectStorage. [#41532](https://github.com/ClickHouse/ClickHouse/pull/41532) ([Sergei Trifonov](https://github.com/serxa)).
* Two new metrics in `system.asynchronous_metrics`. `NumberOfDetachedParts` and `NumberOfDetachedByUserParts`. [#40779](https://github.com/ClickHouse/ClickHouse/pull/40779) ([Sema Checherinda](https://github.com/CheSema)).
* Allow CONSTRAINTs for ODBC and JDBC tables. [#34551](https://github.com/ClickHouse/ClickHouse/pull/34551) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Don't print `SETTINGS` more than once during query formatting if it didn't appear multiple times in the original query. [#38900](https://github.com/ClickHouse/ClickHouse/pull/38900) ([Raúl Marín](https://github.com/Algunenano)).
* Improve the tracing (OpenTelemetry) context propagation across threads. [#39010](https://github.com/ClickHouse/ClickHouse/pull/39010) ([Frank Chen](https://github.com/FrankChen021)).
* ClickHouse Keeper: add listeners for `interserver_listen_host` only in Keeper if specified. [#39973](https://github.com/ClickHouse/ClickHouse/pull/39973) ([Antonio Andelic](https://github.com/antonio2368)).
* Improve recovery of Replicated user access storage after errors. [#39977](https://github.com/ClickHouse/ClickHouse/pull/39977) ([Vitaly Baranov](https://github.com/vitlibar)).
* Add support for TTL in `EmbeddedRocksDB`. [#39986](https://github.com/ClickHouse/ClickHouse/pull/39986) ([Lloyd-Pottiger](https://github.com/Lloyd-Pottiger)).
* Add schema inference to `clickhouse-obfuscator`, so the `--structure` argument is no longer required. [#40120](https://github.com/ClickHouse/ClickHouse/pull/40120) ([Nikolay Degterinsky](https://github.com/evillique)).
* Improve and fix dictionaries in `Arrow` format. [#40173](https://github.com/ClickHouse/ClickHouse/pull/40173) ([Kruglov Pavel](https://github.com/Avogar)).
* More natural conversion of `Date32`, `DateTime64`, `Date` to narrower types: upper or lower normal value is considered when out of normal range. [#40217](https://github.com/ClickHouse/ClickHouse/pull/40217) ([Andrey Zvonov](https://github.com/zvonand)).
* Fix the case when `Merge` table over `View` cannot use index. [#40233](https://github.com/ClickHouse/ClickHouse/pull/40233) ([Duc Canh Le](https://github.com/canhld94)).
* Custom key names for JSON server logs. [#40251](https://github.com/ClickHouse/ClickHouse/pull/40251) ([Mallik Hassan](https://github.com/SadiHassan)).
* It is now possible to set a custom error code for the exception thrown by function `throwIf`. [#40319](https://github.com/ClickHouse/ClickHouse/pull/40319) ([Robert Schulze](https://github.com/rschu1ze)).
* Improve schema inference cache, respect format settings that can change the schema. [#40414](https://github.com/ClickHouse/ClickHouse/pull/40414) ([Kruglov Pavel](https://github.com/Avogar)).
* Allow parsing `Date` as `DateTime` and `DateTime64`. This implements the enhancement proposed in [#36949](https://github.com/ClickHouse/ClickHouse/issues/36949). [#40474](https://github.com/ClickHouse/ClickHouse/pull/40474) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Allow conversion from `String` with `DateTime64` like `2022-08-22 01:02:03.456` to `Date` and `Date32`. Allow conversion from String with DateTime like `2022-08-22 01:02:03` to `Date32`. This closes [#39598](https://github.com/ClickHouse/ClickHouse/issues/39598). [#40475](https://github.com/ClickHouse/ClickHouse/pull/40475) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Better support for nested data structures in Parquet format [#40485](https://github.com/ClickHouse/ClickHouse/pull/40485) ([Arthur Passos](https://github.com/arthurpassos)).
* Support reading Array(Record) into flatten nested table in Avro. [#40534](https://github.com/ClickHouse/ClickHouse/pull/40534) ([Kruglov Pavel](https://github.com/Avogar)).
* Add read-only support for `EmbeddedRocksDB`. [#40543](https://github.com/ClickHouse/ClickHouse/pull/40543) ([Lloyd-Pottiger](https://github.com/Lloyd-Pottiger)).
* Validate the compression method parameter of URL table engine. [#40600](https://github.com/ClickHouse/ClickHouse/pull/40600) ([Frank Chen](https://github.com/FrankChen021)).
* Better format detection for url table function/engine in presence of a query string after a file name. Closes [#40315](https://github.com/ClickHouse/ClickHouse/issues/40315). [#40636](https://github.com/ClickHouse/ClickHouse/pull/40636) ([Kruglov Pavel](https://github.com/Avogar)).
* Disable projection when grouping set is used. It generated wrong result. This fixes [#40635](https://github.com/ClickHouse/ClickHouse/issues/40635). [#40726](https://github.com/ClickHouse/ClickHouse/pull/40726) ([Amos Bird](https://github.com/amosbird)).
* Fix incorrect format of `APPLY` column transformer which can break metadata if used in table definition. This fixes [#37590](https://github.com/ClickHouse/ClickHouse/issues/37590). [#40727](https://github.com/ClickHouse/ClickHouse/pull/40727) ([Amos Bird](https://github.com/amosbird)).
* Support the `%z` descriptor for formatting the timezone offset in `formatDateTime`. [#40736](https://github.com/ClickHouse/ClickHouse/pull/40736) ([Cory Levy](https://github.com/LevyCory)).
* The interactive mode in `clickhouse-client` now interprets `.` and `/` as "run the last command". [#40750](https://github.com/ClickHouse/ClickHouse/pull/40750) ([Robert Schulze](https://github.com/rschu1ze)).
* Fix issue with passing MySQL timeouts for MySQL database engine and MySQL table function. Closes [#34168](https://github.com/ClickHouse/ClickHouse/issues/34168). [#40751](https://github.com/ClickHouse/ClickHouse/pull/40751) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Create status file for filesystem cache directory to make sure that cache directories are not shared between different servers or caches. [#40820](https://github.com/ClickHouse/ClickHouse/pull/40820) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Add support for `DELETE` and `UPDATE` for `EmbeddedRocksDB` storage. [#40853](https://github.com/ClickHouse/ClickHouse/pull/40853) ([Antonio Andelic](https://github.com/antonio2368)).
* ClickHouse Keeper: fix shutdown during long commit and increase allowed request size. [#40941](https://github.com/ClickHouse/ClickHouse/pull/40941) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix race in WriteBufferFromS3, add TSA annotations. [#40950](https://github.com/ClickHouse/ClickHouse/pull/40950) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Grouping sets with group\_by\_use\_nulls should only convert key columns to nullable. [#40997](https://github.com/ClickHouse/ClickHouse/pull/40997) ([Duc Canh Le](https://github.com/canhld94)).
* Improve the observability of INSERT on distributed table. [#41034](https://github.com/ClickHouse/ClickHouse/pull/41034) ([Frank Chen](https://github.com/FrankChen021)).
* More low-level metrics for S3 interaction. [#41039](https://github.com/ClickHouse/ClickHouse/pull/41039) ([mateng915](https://github.com/mateng0915)).
* Support relative path in Location header after HTTP redirect. Closes [#40985](https://github.com/ClickHouse/ClickHouse/issues/40985). [#41162](https://github.com/ClickHouse/ClickHouse/pull/41162) ([Kruglov Pavel](https://github.com/Avogar)).
* Apply changes to HTTP handlers on fly without server restart. [#41177](https://github.com/ClickHouse/ClickHouse/pull/41177) ([Azat Khuzhin](https://github.com/azat)).
* ClickHouse Keeper: properly close active sessions during shutdown. [#41215](https://github.com/ClickHouse/ClickHouse/pull/41215) ([Antonio Andelic](https://github.com/antonio2368)). This lowers the period of "table is read-only" errors.
* Add ability to automatically comment SQL queries in clickhouse-client/local (with `Alt-#`, like in readline). [#41224](https://github.com/ClickHouse/ClickHouse/pull/41224) ([Azat Khuzhin](https://github.com/azat)).
* Fix incompatibility of cache after switching setting `do_no_evict_index_and_mark_files` from 1 to 0, 0 to 1. [#41330](https://github.com/ClickHouse/ClickHouse/pull/41330) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Add a setting `allow_suspicious_fixed_string_types` to prevent users from creating columns of type FixedString with size > 256. [#41495](https://github.com/ClickHouse/ClickHouse/pull/41495) ([Duc Canh Le](https://github.com/canhld94)).
* Add `has_lightweight_delete` to system.parts. [#41564](https://github.com/ClickHouse/ClickHouse/pull/41564) ([Kseniia Sumarokova](https://github.com/kssenii)).

<h4 id="buildtestingpackaging-improvement-3">
  Build/Testing/Packaging Improvement
</h4>

* Enforce documentation for every setting. [#40644](https://github.com/ClickHouse/ClickHouse/pull/40644) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Enforce documentation for every current metric. [#40645](https://github.com/ClickHouse/ClickHouse/pull/40645) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Enforce documentation for every profile event counter. Write the documentation where it was missing. [#40646](https://github.com/ClickHouse/ClickHouse/pull/40646) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Allow minimal `clickhouse-local` build by correcting some dependencies. [#40460](https://github.com/ClickHouse/ClickHouse/pull/40460) ([Alexey Milovidov](https://github.com/alexey-milovidov)). It is less than 50 MiB.
* Calculate and report SQL function coverage in tests. [#40593](https://github.com/ClickHouse/ClickHouse/issues/40593). [#40647](https://github.com/ClickHouse/ClickHouse/pull/40647) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Enforce documentation for every MergeTree setting. [#40648](https://github.com/ClickHouse/ClickHouse/pull/40648) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* A prototype of embedded reference documentation for high-level uniform server components. [#40649](https://github.com/ClickHouse/ClickHouse/pull/40649) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* We will check all queries from the changed perf tests to ensure that all changed queries were tested. [#40322](https://github.com/ClickHouse/ClickHouse/pull/40322) ([Nikita Taranov](https://github.com/nickitat)).
* Fix TGZ packages. [#40681](https://github.com/ClickHouse/ClickHouse/pull/40681) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* Fix debug symbols. [#40873](https://github.com/ClickHouse/ClickHouse/pull/40873) ([Azat Khuzhin](https://github.com/azat)).
* Extended the CI configuration to create a x86 SSE2-only build. Useful for old or embedded hardware. [#40999](https://github.com/ClickHouse/ClickHouse/pull/40999) ([Robert Schulze](https://github.com/rschu1ze)).
* Switch to llvm/clang 15. [#41046](https://github.com/ClickHouse/ClickHouse/pull/41046) ([Azat Khuzhin](https://github.com/azat)).
* Continuation of [#40938](https://github.com/ClickHouse/ClickHouse/issues/40938). Fix ODR violation for `Loggers` class. Fixes [#40398](https://github.com/ClickHouse/ClickHouse/issues/40398), [#40937](https://github.com/ClickHouse/ClickHouse/issues/40937). [#41060](https://github.com/ClickHouse/ClickHouse/pull/41060) ([Dmitry Novik](https://github.com/novikd)).
* Add macOS binaries to GitHub release assets, it fixes [#37718](https://github.com/ClickHouse/ClickHouse/issues/37718). [#41088](https://github.com/ClickHouse/ClickHouse/pull/41088) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* The c-ares library is now bundled with ClickHouse's build system. [#41239](https://github.com/ClickHouse/ClickHouse/pull/41239) ([Robert Schulze](https://github.com/rschu1ze)).
* Get rid of `dlopen` from the main ClickHouse code. It remains in the library-bridge and odbc-bridge. [#41428](https://github.com/ClickHouse/ClickHouse/pull/41428) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Don't allow `dlopen` in the main ClickHouse binary, because it is harmful and insecure. We don't use it. But it can be used by some libraries for the implementation of "plugins". We absolutely discourage the ancient technique of loading 3rd-party uncontrolled dangerous libraries into the process address space, because it is insane. [#41429](https://github.com/ClickHouse/ClickHouse/pull/41429) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add `source` field to deb packages, update `nfpm`. [#41531](https://github.com/ClickHouse/ClickHouse/pull/41531) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* Support for DWARF-5 in the in-house DWARF parser. [#40710](https://github.com/ClickHouse/ClickHouse/pull/40710) ([Azat Khuzhin](https://github.com/azat)).
* Add fault injection in ZooKeeper client for testing [#30498](https://github.com/ClickHouse/ClickHouse/pull/30498) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Add stateless tests with s3 storage with debug and tsan [#35262](https://github.com/ClickHouse/ClickHouse/pull/35262) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Trying stress on top of S3 [#36837](https://github.com/ClickHouse/ClickHouse/pull/36837) ([alesapin](https://github.com/alesapin)).
* Enable `concurrency-mt-unsafe` in `clang-tidy` [#40224](https://github.com/ClickHouse/ClickHouse/pull/40224) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="bug-fix">
  Bug Fix
</h4>

* Fix potential dataloss due to [a bug in AWS SDK](https://github.com/aws/aws-sdk-cpp/issues/658). Bug can be triggered only when clickhouse is used over S3. [#40506](https://github.com/ClickHouse/ClickHouse/pull/40506) ([alesapin](https://github.com/alesapin)). This bug has been open for 5 years in AWS SDK and is closed after our report.
* Malicious data in Native format might cause a crash. [#41441](https://github.com/ClickHouse/ClickHouse/pull/41441) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* The aggregate function `categorialInformationValue` was having incorrectly defined properties, which might cause a null pointer dereferencing at runtime. This closes [#41443](https://github.com/ClickHouse/ClickHouse/issues/41443). [#41449](https://github.com/ClickHouse/ClickHouse/pull/41449) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Writing data in Apache `ORC` format might lead to a buffer overrun. [#41458](https://github.com/ClickHouse/ClickHouse/pull/41458) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix memory safety issues with functions `encrypt` and `contingency` if Array of Nullable is used as an argument. This fixes [#41004](https://github.com/ClickHouse/ClickHouse/issues/41004). [#40195](https://github.com/ClickHouse/ClickHouse/pull/40195) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix bugs in MergeJoin when 'not\_processed' is not null. [#40335](https://github.com/ClickHouse/ClickHouse/pull/40335) ([liql2007](https://github.com/liql2007)).
* Fix incorrect result in case of decimal precision loss in IN operator, ref [#41125](https://github.com/ClickHouse/ClickHouse/issues/41125). [#41130](https://github.com/ClickHouse/ClickHouse/pull/41130) ([Vladimir C](https://github.com/vdimir)).
* Fix filling of missed `Nested` columns with multiple levels. [#37152](https://github.com/ClickHouse/ClickHouse/pull/37152) ([Anton Popov](https://github.com/CurtizJ)).
* Fix SYSTEM UNFREEZE query for Ordinary (deprecated) database. Fix for [https://github.com/ClickHouse/ClickHouse/pull/36424](https://github.com/ClickHouse/ClickHouse/pull/36424). [#38262](https://github.com/ClickHouse/ClickHouse/pull/38262) ([Vadim Volodin](https://github.com/PolyProgrammist)).
* Fix unused unknown columns introduced by WITH statement. This fixes [#37812](https://github.com/ClickHouse/ClickHouse/issues/37812) . [#39131](https://github.com/ClickHouse/ClickHouse/pull/39131) ([Amos Bird](https://github.com/amosbird)).
* Fix query analysis for ORDER BY in presence of window functions. Fixes [#38741](https://github.com/ClickHouse/ClickHouse/issues/38741) Fixes [#24892](https://github.com/ClickHouse/ClickHouse/issues/24892). [#39354](https://github.com/ClickHouse/ClickHouse/pull/39354) ([Dmitry Novik](https://github.com/novikd)).
* Fixed `Unknown identifier (aggregate-function)` exception which appears when a user tries to calculate WINDOW ORDER BY/PARTITION BY expressions over aggregate functions. [#39762](https://github.com/ClickHouse/ClickHouse/pull/39762) ([Vladimir Chebotaryov](https://github.com/quickhouse)).
* Limit number of analyze for one query with setting `max_analyze_depth`. It prevents exponential blow up of analysis time for queries with extraordinarily large number of subqueries. [#40334](https://github.com/ClickHouse/ClickHouse/pull/40334) ([Vladimir C](https://github.com/vdimir)).
* Fix rare bug with column TTL for MergeTree engines family: In case of repeated vertical merge the error `Cannot unlink file ColumnName.bin ... No such file or directory.` could happen. [#40346](https://github.com/ClickHouse/ClickHouse/pull/40346) ([alesapin](https://github.com/alesapin)).
* Use DNS entries for both IPv4 and IPv6 if present. [#40353](https://github.com/ClickHouse/ClickHouse/pull/40353) ([Maksim Kita](https://github.com/kitaisreal)).
* Allow to read snappy compressed files from Hadoop. [#40482](https://github.com/ClickHouse/ClickHouse/pull/40482) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix crash while parsing values of type `Object` (experimental feature) that contains arrays of variadic dimension. [#40483](https://github.com/ClickHouse/ClickHouse/pull/40483) ([Duc Canh Le](https://github.com/canhld94)).
* Fix settings `input_format_tsv_skip_first_lines`. [#40491](https://github.com/ClickHouse/ClickHouse/pull/40491) ([mini4](https://github.com/mini4)).
* Fix bug (race condition) when starting up MaterializedPostgreSQL database/table engine. [#40262](https://github.com/ClickHouse/ClickHouse/issues/40262). Fix error with reaching limit of relcache\_callback\_list slots. [#40511](https://github.com/ClickHouse/ClickHouse/pull/40511) ([Maksim Buren](https://github.com/maks-buren630501)).
* Fix possible error 'Decimal math overflow' while parsing DateTime64. [#40546](https://github.com/ClickHouse/ClickHouse/pull/40546) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix vertical merge of parts with lightweight deleted rows. [#40559](https://github.com/ClickHouse/ClickHouse/pull/40559) ([Alexander Gololobov](https://github.com/davenger)).
* Fix segment fault when writing data to URL table engine if it enables compression. [#40565](https://github.com/ClickHouse/ClickHouse/pull/40565) ([Frank Chen](https://github.com/FrankChen021)).
* Fix possible logical error `'Invalid Field get from type UInt64 to type String'` in arrayElement function with Map. [#40572](https://github.com/ClickHouse/ClickHouse/pull/40572) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix possible race in filesystem cache. [#40586](https://github.com/ClickHouse/ClickHouse/pull/40586) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Removed skipping of mutations in unaffected partitions of `MergeTree` tables, because this feature never worked correctly and might cause resurrection of finished mutations. [#40589](https://github.com/ClickHouse/ClickHouse/pull/40589) ([Alexander Tokmakov](https://github.com/tavplubix)).
* The clickhouse server will crash if we add a grpc port which has been occupied to the configuration in runtime. [#40597](https://github.com/ClickHouse/ClickHouse/pull/40597) ([何李夫](https://github.com/helifu)).
* Fix `base58Encode / base58Decode` handling leading 0 / '1'. [#40620](https://github.com/ClickHouse/ClickHouse/pull/40620) ([Andrey Zvonov](https://github.com/zvonand)).
* keeper-fix: fix race in accessing logs while snapshot is being installed. [#40627](https://github.com/ClickHouse/ClickHouse/pull/40627) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix short circuit execution of toFixedString function. Solves (partially) [#40622](https://github.com/ClickHouse/ClickHouse/issues/40622). [#40628](https://github.com/ClickHouse/ClickHouse/pull/40628) ([Kruglov Pavel](https://github.com/Avogar)).
* Fixes SQLite int8 column conversion to int64 column in ClickHouse. Fixes [#40639](https://github.com/ClickHouse/ClickHouse/issues/40639). [#40642](https://github.com/ClickHouse/ClickHouse/pull/40642) ([Barum Rho](https://github.com/barumrho)).
* Fix stack overflow in recursive `Buffer` tables. This closes [#40637](https://github.com/ClickHouse/ClickHouse/issues/40637). [#40643](https://github.com/ClickHouse/ClickHouse/pull/40643) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* During insertion of a new query to the `ProcessList` allocations happen. If we reach the memory limit during these allocations we can not use `OvercommitTracker`, because `ProcessList::mutex` is already acquired. Fixes [#40611](https://github.com/ClickHouse/ClickHouse/issues/40611). [#40677](https://github.com/ClickHouse/ClickHouse/pull/40677) ([Dmitry Novik](https://github.com/novikd)).
* Fix LOGICAL\_ERROR with max\_read\_buffer\_size=0 during reading marks. [#40705](https://github.com/ClickHouse/ClickHouse/pull/40705) ([Azat Khuzhin](https://github.com/azat)).
* Fix memory leak while pushing to MVs w/o query context (from Kafka/...). [#40732](https://github.com/ClickHouse/ClickHouse/pull/40732) ([Azat Khuzhin](https://github.com/azat)).
* Fix possible error Attempt to read after eof in CSV schema inference. [#40746](https://github.com/ClickHouse/ClickHouse/pull/40746) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix logical error in write-through cache "File segment completion can be done only by downloader". Closes [#40748](https://github.com/ClickHouse/ClickHouse/issues/40748). [#40759](https://github.com/ClickHouse/ClickHouse/pull/40759) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Make the result of GROUPING function the same as in SQL and other DBMS. [#40762](https://github.com/ClickHouse/ClickHouse/pull/40762) ([Dmitry Novik](https://github.com/novikd)).
* In [#40595](https://github.com/ClickHouse/ClickHouse/issues/40595) it was reported that the `host_regexp` functionality was not working properly with a name to address resolution in `/etc/hosts`. It's fixed. [#40769](https://github.com/ClickHouse/ClickHouse/pull/40769) ([Arthur Passos](https://github.com/arthurpassos)).
* Fix incremental backups for Log family. [#40827](https://github.com/ClickHouse/ClickHouse/pull/40827) ([Vitaly Baranov](https://github.com/vitlibar)).
* Fix extremely rare bug which can lead to potential data loss in zero-copy replication. [#40844](https://github.com/ClickHouse/ClickHouse/pull/40844) ([alesapin](https://github.com/alesapin)).
* Fix key condition analyzing crashes when same set expression built from different column(s). [#40850](https://github.com/ClickHouse/ClickHouse/pull/40850) ([Duc Canh Le](https://github.com/canhld94)).
* Fix nested JSON Objects schema inference. [#40851](https://github.com/ClickHouse/ClickHouse/pull/40851) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix 3-digit prefix directory for filesystem cache files not being deleted if empty. Closes [#40797](https://github.com/ClickHouse/ClickHouse/issues/40797). [#40867](https://github.com/ClickHouse/ClickHouse/pull/40867) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix uncaught DNS\_ERROR on failed connection to replicas. [#40881](https://github.com/ClickHouse/ClickHouse/pull/40881) ([Robert Coelho](https://github.com/coelho)).
* Fix bug when removing unneeded columns in subquery. [#40884](https://github.com/ClickHouse/ClickHouse/pull/40884) ([luocongkai](https://github.com/TKaxe)).
* Fix extra memory allocation for remote read buffers. [#40896](https://github.com/ClickHouse/ClickHouse/pull/40896) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fixed a behaviour when user with explicitly revoked grant for dropping databases can still drop it. [#40906](https://github.com/ClickHouse/ClickHouse/pull/40906) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* A fix for ClickHouse Keeper: correctly compare paths in write requests to Keeper internal system node paths. [#40918](https://github.com/ClickHouse/ClickHouse/pull/40918) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix deadlock in WriteBufferFromS3. [#40943](https://github.com/ClickHouse/ClickHouse/pull/40943) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix access rights for `DESCRIBE TABLE url()` and some other `DESCRIBE TABLE <table_function>()`. [#40975](https://github.com/ClickHouse/ClickHouse/pull/40975) ([Vitaly Baranov](https://github.com/vitlibar)).
* Remove wrong parser logic for `WITH GROUPING SETS` which may lead to nullptr dereference. [#41049](https://github.com/ClickHouse/ClickHouse/pull/41049) ([Duc Canh Le](https://github.com/canhld94)).
* A fix for ClickHouse Keeper: fix possible segfault during Keeper shutdown. [#41075](https://github.com/ClickHouse/ClickHouse/pull/41075) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix possible segfaults, use-heap-after-free and memory leak in aggregate function combinators. Closes [#40848](https://github.com/ClickHouse/ClickHouse/issues/40848). [#41083](https://github.com/ClickHouse/ClickHouse/pull/41083) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix query\_views\_log with Window views. [#41132](https://github.com/ClickHouse/ClickHouse/pull/41132) ([Raúl Marín](https://github.com/Algunenano)).
* Disables optimize\_monotonous\_functions\_in\_order\_by by default, mitigates: [#40094](https://github.com/ClickHouse/ClickHouse/issues/40094). [#41136](https://github.com/ClickHouse/ClickHouse/pull/41136) ([Denny Crane](https://github.com/den-crane)).
* Fixed "possible deadlock avoided" error on automatic conversion of database engine from Ordinary to Atomic. [#41146](https://github.com/ClickHouse/ClickHouse/pull/41146) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix SIGSEGV in SortedBlocksWriter in case of empty block (possible to get with `optimize_aggregation_in_order` and `join_algorithm=auto`). [#41154](https://github.com/ClickHouse/ClickHouse/pull/41154) ([Azat Khuzhin](https://github.com/azat)).
* Fix incorrect query result when trivial count optimization is in effect with array join. This fixes [#39431](https://github.com/ClickHouse/ClickHouse/issues/39431). [#41158](https://github.com/ClickHouse/ClickHouse/pull/41158) ([Denny Crane](https://github.com/den-crane)).
* Fix stack-use-after-return in GetPriorityForLoadBalancing::getPriorityFunc(). [#41159](https://github.com/ClickHouse/ClickHouse/pull/41159) ([Azat Khuzhin](https://github.com/azat)).
* Fix positional arguments exception Positional argument out of bounds. Closes [#40634](https://github.com/ClickHouse/ClickHouse/issues/40634). [#41189](https://github.com/ClickHouse/ClickHouse/pull/41189) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix background clean up of broken detached parts. [#41190](https://github.com/ClickHouse/ClickHouse/pull/41190) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix exponential query rewrite in case of lots of cross joins with where, close [#21557](https://github.com/ClickHouse/ClickHouse/issues/21557). [#41223](https://github.com/ClickHouse/ClickHouse/pull/41223) ([Vladimir C](https://github.com/vdimir)).
* Fix possible logical error in write-through cache, which happened because not all types of exception were handled as needed. Closes [#41208](https://github.com/ClickHouse/ClickHouse/issues/41208). [#41232](https://github.com/ClickHouse/ClickHouse/pull/41232) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix String log entry in system.filesystem\_cache\_log. [#41233](https://github.com/ClickHouse/ClickHouse/pull/41233) ([jmimbrero](https://github.com/josemimbrero-tinybird)).
* Queries with `OFFSET` clause in subquery and `WHERE` clause in outer query might return incorrect result, it's fixed. Fixes [#40416](https://github.com/ClickHouse/ClickHouse/issues/40416). [#41280](https://github.com/ClickHouse/ClickHouse/pull/41280) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix possible wrong query result with `query_plan_optimize_primary_key` enabled. Fixes [#40599](https://github.com/ClickHouse/ClickHouse/issues/40599). [#41281](https://github.com/ClickHouse/ClickHouse/pull/41281) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Do not allow invalid sequences influence other rows in lowerUTF8/upperUTF8. [#41286](https://github.com/ClickHouse/ClickHouse/pull/41286) ([Azat Khuzhin](https://github.com/azat)).
* Fix `ALTER <table> ADD COLUMN` queries with columns of type `Object`. [#41290](https://github.com/ClickHouse/ClickHouse/pull/41290) ([Anton Popov](https://github.com/CurtizJ)).
* Fixed "No node" error when selecting from `system.distributed_ddl_queue` when there's no `distributed_ddl.path` in config. Fixes [#41096](https://github.com/ClickHouse/ClickHouse/issues/41096). [#41296](https://github.com/ClickHouse/ClickHouse/pull/41296) ([young scott](https://github.com/young-scott)).
* Fix incorrect logical error `Expected relative path` in disk object storage. Related to [#41246](https://github.com/ClickHouse/ClickHouse/issues/41246). [#41297](https://github.com/ClickHouse/ClickHouse/pull/41297) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Add column type check before UUID insertion in MsgPack format. [#41309](https://github.com/ClickHouse/ClickHouse/pull/41309) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix possible crash after inserting asynchronously (with enabled setting `async_insert`) malformed data to columns of type `Object`. It could happen, if JSONs in all batches of async inserts were invalid and could not be parsed. [#41336](https://github.com/ClickHouse/ClickHouse/pull/41336) ([Anton Popov](https://github.com/CurtizJ)).
* Fix possible deadlock with async\_socket\_for\_remote/use\_hedged\_requests and parallel KILL. [#41343](https://github.com/ClickHouse/ClickHouse/pull/41343) ([Azat Khuzhin](https://github.com/azat)).
* Disables optimize\_rewrite\_sum\_if\_to\_count\_if by default, mitigates: [#38605](https://github.com/ClickHouse/ClickHouse/issues/38605) [#38683](https://github.com/ClickHouse/ClickHouse/issues/38683). [#41388](https://github.com/ClickHouse/ClickHouse/pull/41388) ([Denny Crane](https://github.com/den-crane)).
* Since 22.8 `ON CLUSTER` clause is ignored if database is `Replicated` and cluster name and database name are the same. Because of this `DROP PARTITION ON CLUSTER` worked unexpected way with `Replicated`. It's fixed, now `ON CLUSTER` clause is ignored only for queries that are replicated on database level. Fixes [#41299](https://github.com/ClickHouse/ClickHouse/issues/41299). [#41390](https://github.com/ClickHouse/ClickHouse/pull/41390) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix possible hung/deadlock on query cancellation (`KILL QUERY` or server shutdown). [#41467](https://github.com/ClickHouse/ClickHouse/pull/41467) ([Azat Khuzhin](https://github.com/azat)).
* Fix possible server crash when using the JBOD feature. This fixes [#41365](https://github.com/ClickHouse/ClickHouse/issues/41365). [#41483](https://github.com/ClickHouse/ClickHouse/pull/41483) ([Amos Bird](https://github.com/amosbird)).
* Fix conversion from nullable fixed string to string. [#41541](https://github.com/ClickHouse/ClickHouse/pull/41541) ([Duc Canh Le](https://github.com/canhld94)).
* Prevent crash when passing wrong aggregation states to groupBitmap\*. [#41563](https://github.com/ClickHouse/ClickHouse/pull/41563) ([Raúl Marín](https://github.com/Algunenano)).
* Queries with `ORDER BY` and `1500 <= LIMIT <= max_block_size` could return incorrect result with missing rows from top. Fixes [#41182](https://github.com/ClickHouse/ClickHouse/issues/41182). [#41576](https://github.com/ClickHouse/ClickHouse/pull/41576) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix read bytes/rows in X-ClickHouse-Summary with materialized views. [#41586](https://github.com/ClickHouse/ClickHouse/pull/41586) ([Raúl Marín](https://github.com/Algunenano)).
* Fix possible `pipeline stuck` exception for queries with `OFFSET`. The error was found with `enable_optimize_predicate_expression = 0` and always false condition in `WHERE`. Fixes [#41383](https://github.com/ClickHouse/ClickHouse/issues/41383). [#41588](https://github.com/ClickHouse/ClickHouse/pull/41588) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
