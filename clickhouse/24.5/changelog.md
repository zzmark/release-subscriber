<h3 id="a-id245a-clickhouse-release-245-2024-05-30">
  <a id="245" /> ClickHouse release 24.5, 2024-05-30. [Presentation](https://presentations.clickhouse.com/2024-release-24.5/), [Video](https://www.youtube.com/watch?v=dURnKjLuZLg)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/dURnKjLuZLg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-7">
  Backward Incompatible Change
</h4>

* Renamed "inverted indexes" to "full-text indexes" which is a less technical / more user-friendly name. This also changes internal table metadata and breaks tables with existing (experimental) inverted indexes. Please make sure to drop such indexes before upgrade and re-create them after upgrade. [#62884](https://github.com/ClickHouse/ClickHouse/pull/62884) ([Robert Schulze](https://github.com/rschu1ze)).
* Usage of functions `neighbor`, `runningAccumulate`, `runningDifferenceStartingWithFirstValue`, `runningDifference` deprecated (because it is error-prone). Proper window functions should be used instead. To enable them back, set `allow_deprecated_error_prone_window_functions = 1` or set `compatibility = '24.4'` or lower. [#63132](https://github.com/ClickHouse/ClickHouse/pull/63132) ([Nikita Taranov](https://github.com/nickitat)).
* Queries from `system.columns` will work faster if there is a large number of columns, but many databases or tables are not granted for `SHOW TABLES`. Note that in previous versions, if you grant `SHOW COLUMNS` to individual columns without granting `SHOW TABLES` to the corresponding tables, the `system.columns` table will show these columns, but in a new version, it will skip the table entirely. Remove trace log messages "Access granted" and "Access denied" that slowed down queries. [#63439](https://github.com/ClickHouse/ClickHouse/pull/63439) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="new-feature-7">
  New Feature
</h4>

* Adds the `Form` format to read/write a single record in the `application/x-www-form-urlencoded` format. [#60199](https://github.com/ClickHouse/ClickHouse/pull/60199) ([Shaun Struwig](https://github.com/Blargian)).
* Added possibility to compress in CROSS JOIN. [#60459](https://github.com/ClickHouse/ClickHouse/pull/60459) ([p1rattttt](https://github.com/p1rattttt)).
* Added possibility to do `CROSS JOIN` in temporary files if the size exceeds limits. [#63432](https://github.com/ClickHouse/ClickHouse/pull/63432) ([p1rattttt](https://github.com/p1rattttt)).
* Support join with inequal conditions which involve columns from both left and right table. e.g. `t1.y < t2.y`. To enable, `SET allow_experimental_join_condition = 1`. [#60920](https://github.com/ClickHouse/ClickHouse/pull/60920) ([lgbo](https://github.com/lgbo-ustc)).
* Maps can now have `Float32`, `Float64`, `Array(T)`, `Map(K, V)` and `Tuple(T1, T2, ...)` as keys. Closes [#54537](https://github.com/ClickHouse/ClickHouse/issues/54537). [#59318](https://github.com/ClickHouse/ClickHouse/pull/59318) ([李扬](https://github.com/taiyang-li)).
* Introduce bulk loading to `EmbeddedRocksDB` by creating and ingesting SST file instead of relying on rocksdb build-in memtable. This help to increase importing speed, especially for long-running insert query to StorageEmbeddedRocksDB tables. Also, introduce `EmbeddedRocksDB` table settings. [#59163](https://github.com/ClickHouse/ClickHouse/pull/59163) [#63324](https://github.com/ClickHouse/ClickHouse/pull/63324) ([Duc Canh Le](https://github.com/canhld94)).
* User can now parse CRLF with TSV format using a setting `input_format_tsv_crlf_end_of_line`. Closes [#56257](https://github.com/ClickHouse/ClickHouse/issues/56257). [#59747](https://github.com/ClickHouse/ClickHouse/pull/59747) ([Shaun Struwig](https://github.com/Blargian)).
* A new setting `input_format_force_null_for_omitted_fields` that forces NULL values for omitted fields. [#60887](https://github.com/ClickHouse/ClickHouse/pull/60887) ([Constantine Peresypkin](https://github.com/pkit)).
* Earlier our S3 storage and s3 table function didn't support selecting from archive container files, such as tarballs, zip, 7z. Now they allow to iterate over files inside archives in S3. [#62259](https://github.com/ClickHouse/ClickHouse/pull/62259) ([Daniil Ivanik](https://github.com/divanik)).
* Support for conditional function `clamp`. [#62377](https://github.com/ClickHouse/ClickHouse/pull/62377) ([skyoct](https://github.com/skyoct)).
* Add `NPy` output format. [#62430](https://github.com/ClickHouse/ClickHouse/pull/62430) ([豪肥肥](https://github.com/HowePa)).
* `Raw` format as a synonym for `TSVRaw`. [#63394](https://github.com/ClickHouse/ClickHouse/pull/63394) ([Unalian](https://github.com/Unalian)).
* Added a new SQL function `generateUUIDv7` to generate version 7 UUIDs aka. timestamp-based UUIDs with random component. Also added a new function `UUIDToNum` to extract bytes from a UUID and a new function `UUIDv7ToDateTime` to extract timestamp component from a UUID version 7. [#62852](https://github.com/ClickHouse/ClickHouse/pull/62852) ([Alexey Petrunyaka](https://github.com/pet74alex)).
* On Linux and MacOS, if the program has stdout redirected to a file with a compression extension, use the corresponding compression method instead of nothing (making it behave similarly to `INTO OUTFILE`). [#63662](https://github.com/ClickHouse/ClickHouse/pull/63662) ([v01dXYZ](https://github.com/v01dXYZ)).
* Change warning on high number of attached tables to differentiate tables, views and dictionaries. [#64180](https://github.com/ClickHouse/ClickHouse/pull/64180) ([Francisco J. Jurado Moreno](https://github.com/Beetelbrox)).
* Provide support for `azureBlobStorage` function in ClickHouse server to use Azure Workload identity to authenticate against Azure blob storage. If `use_workload_identity` parameter is set in config, [workload identity](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity#authenticate-azure-hosted-applications) is used for authentication. [#57881](https://github.com/ClickHouse/ClickHouse/pull/57881) ([Vinay Suryadevara](https://github.com/vinay92-ch)).
* Add TTL information in the `system.parts_columns` table. [#63200](https://github.com/ClickHouse/ClickHouse/pull/63200) ([litlig](https://github.com/litlig)).

<h4 id="experimental-features-1">
  Experimental Features
</h4>

* Implement `Dynamic` data type that allows to store values of any type inside it without knowing all of them in advance. `Dynamic` type is available under a setting `allow_experimental_dynamic_type`. Reference: [#54864](https://github.com/ClickHouse/ClickHouse/issues/54864). [#63058](https://github.com/ClickHouse/ClickHouse/pull/63058) ([Kruglov Pavel](https://github.com/Avogar)).
* Allowed to create `MaterializedMySQL` database without connection to MySQL. [#63397](https://github.com/ClickHouse/ClickHouse/pull/63397) ([Kirill](https://github.com/kirillgarbar)).
* Automatically mark a replica of Replicated database as lost and start recovery if some DDL task fails more than `max_retries_before_automatic_recovery` (100 by default) times in a row with the same error. Also, fixed a bug that could cause skipping DDL entries when an exception is thrown during an early stage of entry execution. [#63549](https://github.com/ClickHouse/ClickHouse/pull/63549) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Account failed files in `s3queue_tracked_file_ttl_sec` and `s3queue_traked_files_limit` for `StorageS3Queue`. [#63638](https://github.com/ClickHouse/ClickHouse/pull/63638) ([Kseniia Sumarokova](https://github.com/kssenii)).

<h4 id="performance-improvement-7">
  Performance Improvement
</h4>

* Less contention in filesystem cache (part 4). Allow to keep filesystem cache not filled to the limit by doing additional eviction in the background (controlled by `keep_free_space_size(elements)_ratio`). This allows to release pressure from space reservation for queries (on `tryReserve` method). Also this is done in a lock free way as much as possible, e.g. should not block normal cache usage. [#61250](https://github.com/ClickHouse/ClickHouse/pull/61250) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Skip merging of newly created projection blocks during `INSERT`-s. [#59405](https://github.com/ClickHouse/ClickHouse/pull/59405) ([Nikita Taranov](https://github.com/nickitat)).
* Process string functions `...UTF8` 'asciily' if input strings are all ascii chars. Inspired by [https://github.com/apache/doris/pull/29799](https://github.com/apache/doris/pull/29799). Overall speed up by 1.07x\~1.62x. Notice that peak memory usage had been decreased in some cases. [#61632](https://github.com/ClickHouse/ClickHouse/pull/61632) ([李扬](https://github.com/taiyang-li)).
* Improved performance of selection (`{}`) globs in StorageS3. [#62120](https://github.com/ClickHouse/ClickHouse/pull/62120) ([Andrey Zvonov](https://github.com/zvonand)).
* HostResolver has each IP address several times. If remote host has several IPs and by some reason (firewall rules for example) access on some IPs allowed and on others forbidden, than only first record of forbidden IPs marked as failed, and in each try these IPs have a chance to be chosen (and failed again). Even if fix this, every 120 seconds DNS cache dropped, and IPs can be chosen again. [#62652](https://github.com/ClickHouse/ClickHouse/pull/62652) ([Anton Ivashkin](https://github.com/ianton-ru)).
* Add a new configuration`prefer_merge_sort_block_bytes` to control the memory usage and speed up sorting 2 times when merging when there are many columns. [#62904](https://github.com/ClickHouse/ClickHouse/pull/62904) ([LiuNeng](https://github.com/liuneng1994)).
* `clickhouse-local` will start faster. In previous versions, it was not deleting temporary directories by mistake. Now it will. This closes [#62941](https://github.com/ClickHouse/ClickHouse/issues/62941). [#63074](https://github.com/ClickHouse/ClickHouse/pull/63074) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Micro-optimizations for the new analyzer. [#63429](https://github.com/ClickHouse/ClickHouse/pull/63429) ([Raúl Marín](https://github.com/Algunenano)).
* Index analysis will work if `DateTime` is compared to `DateTime64`. This closes [#63441](https://github.com/ClickHouse/ClickHouse/issues/63441). [#63443](https://github.com/ClickHouse/ClickHouse/pull/63443) [#63532](https://github.com/ClickHouse/ClickHouse/pull/63532) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Speed up indices of type `set` a little (around 1.5 times) by removing garbage. [#64098](https://github.com/ClickHouse/ClickHouse/pull/64098) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Remove copying data when writing to the filesystem cache. [#63401](https://github.com/ClickHouse/ClickHouse/pull/63401) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Now backups with azure blob storage will use multicopy. [#64116](https://github.com/ClickHouse/ClickHouse/pull/64116) ([alesapin](https://github.com/alesapin)).
* Allow to use native copy for azure even with different containers. [#64154](https://github.com/ClickHouse/ClickHouse/pull/64154) ([alesapin](https://github.com/alesapin)).
* Finally enable native copy for azure. [#64182](https://github.com/ClickHouse/ClickHouse/pull/64182) ([alesapin](https://github.com/alesapin)).

<h4 id="improvement-7">
  Improvement
</h4>

* Allow using `clickhouse-local` and its shortcuts `clickhouse` and `ch` with a query or queries file as a positional argument. Examples: `ch "SELECT 1"`, `ch --param_test Hello "SELECT {test:String}"`, `ch query.sql`. This closes [#62361](https://github.com/ClickHouse/ClickHouse/issues/62361). [#63081](https://github.com/ClickHouse/ClickHouse/pull/63081) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Enable plain\_rewritable metadata for local and Azure (azure\_blob\_storage) object storages. [#63365](https://github.com/ClickHouse/ClickHouse/pull/63365) ([Julia Kartseva](https://github.com/jkartseva)).
* Support English-style Unicode quotes, e.g. “Hello”, 'world'. This is questionable in general but helpful when you type your query in a word processor, such as Google Docs. This closes [#58634](https://github.com/ClickHouse/ClickHouse/issues/58634). [#63381](https://github.com/ClickHouse/ClickHouse/pull/63381) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Allow trailing commas in the columns list in the INSERT query. For example, `INSERT INTO test (a, b, c, ) VALUES ...`. [#63803](https://github.com/ClickHouse/ClickHouse/pull/63803) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Better exception messages for the `Regexp` format. [#63804](https://github.com/ClickHouse/ClickHouse/pull/63804) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Allow trailing commas in the `Values` format. For example, this query is allowed: `INSERT INTO test (a, b, c) VALUES (4, 5, 6,);`. [#63810](https://github.com/ClickHouse/ClickHouse/pull/63810) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Make rabbitmq nack broken messages. Closes [#45350](https://github.com/ClickHouse/ClickHouse/issues/45350). [#60312](https://github.com/ClickHouse/ClickHouse/pull/60312) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix a crash in asynchronous stack unwinding (such as when using the sampling query profiler) while interpreting debug info. This closes [#60460](https://github.com/ClickHouse/ClickHouse/issues/60460). [#60468](https://github.com/ClickHouse/ClickHouse/pull/60468) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Distinct messages for s3 error 'no key' for cases disk and storage. [#61108](https://github.com/ClickHouse/ClickHouse/pull/61108) ([Sema Checherinda](https://github.com/CheSema)).
* The progress bar will work for trivial queries with LIMIT from `system.zeros`, `system.zeros_mt` (it already works for `system.numbers` and `system.numbers_mt`), and the `generateRandom` table function. As a bonus, if the total number of records is greater than the `max_rows_to_read` limit, it will throw an exception earlier. This closes [#58183](https://github.com/ClickHouse/ClickHouse/issues/58183). [#61823](https://github.com/ClickHouse/ClickHouse/pull/61823) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Support for "Merge Key" in YAML configurations (this is a weird feature of YAML, please never mind). [#62685](https://github.com/ClickHouse/ClickHouse/pull/62685) ([Azat Khuzhin](https://github.com/azat)).
* Enhance error message when non-deterministic function is used with Replicated source. [#62896](https://github.com/ClickHouse/ClickHouse/pull/62896) ([Grégoire Pineau](https://github.com/lyrixx)).
* Fix interserver secret for Distributed over Distributed from `remote`. [#63013](https://github.com/ClickHouse/ClickHouse/pull/63013) ([Azat Khuzhin](https://github.com/azat)).
* Support `include_from` for YAML files. However, you should better use `config.d` [#63106](https://github.com/ClickHouse/ClickHouse/pull/63106) ([Eduard Karacharov](https://github.com/korowa)).
* Keep previous data in terminal after picking from skim suggestions. [#63261](https://github.com/ClickHouse/ClickHouse/pull/63261) ([FlameFactory](https://github.com/FlameFactory)).
* Width of fields (in Pretty formats or the `visibleWidth` function) now correctly ignores ANSI escape sequences. [#63270](https://github.com/ClickHouse/ClickHouse/pull/63270) ([Shaun Struwig](https://github.com/Blargian)).
* Update the usage of error code `NUMBER_OF_ARGUMENTS_DOESNT_MATCH` by more accurate error codes when appropriate. [#63406](https://github.com/ClickHouse/ClickHouse/pull/63406) ([Yohann Jardin](https://github.com/yohannj)).
* `os_user` and `client_hostname` are now correctly set up for queries for command line suggestions in clickhouse-client. This closes [#63430](https://github.com/ClickHouse/ClickHouse/issues/63430). [#63433](https://github.com/ClickHouse/ClickHouse/pull/63433) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Automatically correct `max_block_size` to the default value if it is zero. [#63587](https://github.com/ClickHouse/ClickHouse/pull/63587) ([Antonio Andelic](https://github.com/antonio2368)).
* Add a build\_id ALIAS column to trace\_log to facilitate auto renaming upon detecting binary changes. This is to address [#52086](https://github.com/ClickHouse/ClickHouse/issues/52086). [#63656](https://github.com/ClickHouse/ClickHouse/pull/63656) ([Zimu Li](https://github.com/woodlzm)).
* Enable truncate operation for object storage disks. [#63693](https://github.com/ClickHouse/ClickHouse/pull/63693) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* The loading of the keywords list is now dependent on the server revision and will be disabled for the old versions of ClickHouse server. CC @azat. [#63786](https://github.com/ClickHouse/ClickHouse/pull/63786) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* Clickhouse disks have to read server setting to obtain actual metadata format version. [#63831](https://github.com/ClickHouse/ClickHouse/pull/63831) ([Sema Checherinda](https://github.com/CheSema)).
* Disable pretty format restrictions (`output_format_pretty_max_rows`/`output_format_pretty_max_value_width`) when stdout is not TTY. [#63942](https://github.com/ClickHouse/ClickHouse/pull/63942) ([Azat Khuzhin](https://github.com/azat)).
* Exception handling now works when ClickHouse is used inside AWS Lambda. Author: [Alexey Coolnev](https://github.com/acoolnev). [#64014](https://github.com/ClickHouse/ClickHouse/pull/64014) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Throw `CANNOT_DECOMPRESS` instread of `CORRUPTED_DATA` on invalid compressed data passed via HTTP. [#64036](https://github.com/ClickHouse/ClickHouse/pull/64036) ([vdimir](https://github.com/vdimir)).
* A tip for a single large number in Pretty formats now works for Nullable and LowCardinality. This closes [#61993](https://github.com/ClickHouse/ClickHouse/issues/61993). [#64084](https://github.com/ClickHouse/ClickHouse/pull/64084) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add metrics, logs, and thread names around parts filtering with indices. [#64130](https://github.com/ClickHouse/ClickHouse/pull/64130) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Ignore `allow_suspicious_primary_key` on `ATTACH` and verify on `ALTER`. [#64202](https://github.com/ClickHouse/ClickHouse/pull/64202) ([Azat Khuzhin](https://github.com/azat)).

<h4 id="buildtestingpackaging-improvement-3">
  Build/Testing/Packaging Improvement
</h4>

* ClickHouse is built with clang-18. A lot of new checks from clang-tidy-18 have been enabled. [#60469](https://github.com/ClickHouse/ClickHouse/pull/60469) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Experimentally support loongarch64 as a new platform for ClickHouse. [#63733](https://github.com/ClickHouse/ClickHouse/pull/63733) ([qiangxuhui](https://github.com/qiangxuhui)).
* The Dockerfile is reviewed by the docker official library in [https://github.com/docker-library/official-images/pull/15846](https://github.com/docker-library/official-images/pull/15846). [#63400](https://github.com/ClickHouse/ClickHouse/pull/63400) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* Information about every symbol in every translation unit will be collected in the CI database for every build in the CI. This closes [#63494](https://github.com/ClickHouse/ClickHouse/issues/63494). [#63495](https://github.com/ClickHouse/ClickHouse/pull/63495) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Update Apache Datasketches library. It resolves [#63858](https://github.com/ClickHouse/ClickHouse/issues/63858). [#63923](https://github.com/ClickHouse/ClickHouse/pull/63923) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Enable GRPC support for aarch64 linux while cross-compiling binary. [#64072](https://github.com/ClickHouse/ClickHouse/pull/64072) ([alesapin](https://github.com/alesapin)).
* Fix unwind on SIGSEGV on aarch64 (due to small stack for signal) [#64058](https://github.com/ClickHouse/ClickHouse/pull/64058) ([Azat Khuzhin](https://github.com/azat)).

<h4 id="bug-fix-1">
  Bug Fix
</h4>

* Disabled `enable_vertical_final` setting by default. This feature should not be used because it has a bug: [#64543](https://github.com/ClickHouse/ClickHouse/issues/64543). [#64544](https://github.com/ClickHouse/ClickHouse/pull/64544) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix making backup when multiple shards are used [#57684](https://github.com/ClickHouse/ClickHouse/pull/57684) ([Vitaly Baranov](https://github.com/vitlibar)).
* Fix passing projections/indexes/primary key from columns list from CREATE query into inner table of MV [#59183](https://github.com/ClickHouse/ClickHouse/pull/59183) ([Azat Khuzhin](https://github.com/azat)).
* Fix boundRatio incorrect merge [#60532](https://github.com/ClickHouse/ClickHouse/pull/60532) ([Tao Wang](https://github.com/wangtZJU)).
* Fix crash when calling some functions on const low-cardinality columns [#61966](https://github.com/ClickHouse/ClickHouse/pull/61966) ([Michael Kolupaev](https://github.com/al13n321)).
* Fix queries with FINAL give wrong result when table does not use adaptive granularity [#62432](https://github.com/ClickHouse/ClickHouse/pull/62432) ([Duc Canh Le](https://github.com/canhld94)).
* Improve detection of cgroups v2 support for memory controllers [#62903](https://github.com/ClickHouse/ClickHouse/pull/62903) ([Robert Schulze](https://github.com/rschu1ze)).
* Fix subsequent use of external tables in client [#62964](https://github.com/ClickHouse/ClickHouse/pull/62964) ([Azat Khuzhin](https://github.com/azat)).
* Fix crash with untuple and unresolved lambda [#63131](https://github.com/ClickHouse/ClickHouse/pull/63131) ([Raúl Marín](https://github.com/Algunenano)).
* Fix premature server listen for connections [#63181](https://github.com/ClickHouse/ClickHouse/pull/63181) ([alesapin](https://github.com/alesapin)).
* Fix intersecting parts when restarting after a DROP PART command [#63202](https://github.com/ClickHouse/ClickHouse/pull/63202) ([Han Fei](https://github.com/hanfei1991)).
* Correctly load SQL security defaults during startup [#63209](https://github.com/ClickHouse/ClickHouse/pull/63209) ([pufit](https://github.com/pufit)).
* JOIN filter push down filter join fix [#63234](https://github.com/ClickHouse/ClickHouse/pull/63234) ([Maksim Kita](https://github.com/kitaisreal)).
* Fix infinite loop in AzureObjectStorage::listObjects [#63257](https://github.com/ClickHouse/ClickHouse/pull/63257) ([Julia Kartseva](https://github.com/jkartseva)).
* CROSS join ignore join\_algorithm setting [#63273](https://github.com/ClickHouse/ClickHouse/pull/63273) ([vdimir](https://github.com/vdimir)).
* Fix finalize WriteBufferToFileSegment and StatusFile [#63346](https://github.com/ClickHouse/ClickHouse/pull/63346) ([vdimir](https://github.com/vdimir)).
* Fix logical error during SELECT query after ALTER in rare case [#63353](https://github.com/ClickHouse/ClickHouse/pull/63353) ([alesapin](https://github.com/alesapin)).
* Fix `X-ClickHouse-Timezone` header with `session_timezone` [#63377](https://github.com/ClickHouse/ClickHouse/pull/63377) ([Andrey Zvonov](https://github.com/zvonand)).
* Fix debug assert when using grouping WITH ROLLUP and LowCardinality types  [#63398](https://github.com/ClickHouse/ClickHouse/pull/63398) ([Raúl Marín](https://github.com/Algunenano)).
* Small fixes for group\_by\_use\_nulls [#63405](https://github.com/ClickHouse/ClickHouse/pull/63405) ([vdimir](https://github.com/vdimir)).
* Fix backup/restore of projection part in case projection was removed from table metadata, but part still has projection [#63426](https://github.com/ClickHouse/ClickHouse/pull/63426) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix mysql dictionary source [#63481](https://github.com/ClickHouse/ClickHouse/pull/63481) ([vdimir](https://github.com/vdimir)).
* Insert QueryFinish on AsyncInsertFlush with no data [#63483](https://github.com/ClickHouse/ClickHouse/pull/63483) ([Raúl Marín](https://github.com/Algunenano)).
* Fix: empty used\_dictionaries in system.query\_log [#63487](https://github.com/ClickHouse/ClickHouse/pull/63487) ([Eduard Karacharov](https://github.com/korowa)).
* Make `MergeTreePrefetchedReadPool` safer [#63513](https://github.com/ClickHouse/ClickHouse/pull/63513) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix crash on exit with sentry enabled (due to openssl destroyed before sentry) [#63548](https://github.com/ClickHouse/ClickHouse/pull/63548) ([Azat Khuzhin](https://github.com/azat)).
* Fix Array and Map support with Keyed hashing [#63628](https://github.com/ClickHouse/ClickHouse/pull/63628) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* Fix filter pushdown for Parquet and maybe StorageMerge [#63642](https://github.com/ClickHouse/ClickHouse/pull/63642) ([Michael Kolupaev](https://github.com/al13n321)).
* Prevent conversion to Replicated if zookeeper path already exists [#63670](https://github.com/ClickHouse/ClickHouse/pull/63670) ([Kirill](https://github.com/kirillgarbar)).
* Analyzer: views read only necessary columns [#63688](https://github.com/ClickHouse/ClickHouse/pull/63688) ([Maksim Kita](https://github.com/kitaisreal)).
* Analyzer: Forbid WINDOW redefinition [#63694](https://github.com/ClickHouse/ClickHouse/pull/63694) ([Dmitry Novik](https://github.com/novikd)).
* flatten\_nested was broken with the experimental Replicated database. [#63695](https://github.com/ClickHouse/ClickHouse/pull/63695) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix [#63653](https://github.com/ClickHouse/ClickHouse/issues/63653) [#63722](https://github.com/ClickHouse/ClickHouse/pull/63722) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Allow cast from Array(Nothing) to Map(Nothing, Nothing) [#63753](https://github.com/ClickHouse/ClickHouse/pull/63753) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix ILLEGAL\_COLUMN in partial\_merge join [#63755](https://github.com/ClickHouse/ClickHouse/pull/63755) ([vdimir](https://github.com/vdimir)).
* Fix: remove redundant distinct with window functions [#63776](https://github.com/ClickHouse/ClickHouse/pull/63776) ([Igor Nikonov](https://github.com/devcrafter)).
* Fix possible crash with SYSTEM UNLOAD PRIMARY KEY [#63778](https://github.com/ClickHouse/ClickHouse/pull/63778) ([Raúl Marín](https://github.com/Algunenano)).
* Fix a query with duplicating cycling alias. [#63791](https://github.com/ClickHouse/ClickHouse/pull/63791) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Make `TokenIterator` lazy as it should be [#63801](https://github.com/ClickHouse/ClickHouse/pull/63801) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add `endpoint_subpath` S3 URI setting [#63806](https://github.com/ClickHouse/ClickHouse/pull/63806) ([Julia Kartseva](https://github.com/jkartseva)).
* Fix deadlock in `ParallelReadBuffer` [#63814](https://github.com/ClickHouse/ClickHouse/pull/63814) ([Antonio Andelic](https://github.com/antonio2368)).
* JOIN filter push down equivalent columns fix [#63819](https://github.com/ClickHouse/ClickHouse/pull/63819) ([Maksim Kita](https://github.com/kitaisreal)).
* Remove data from all disks after DROP with Lazy database. [#63848](https://github.com/ClickHouse/ClickHouse/pull/63848) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* Fix incorrect result when reading from MV with parallel replicas and new analyzer [#63861](https://github.com/ClickHouse/ClickHouse/pull/63861) ([Nikita Taranov](https://github.com/nickitat)).
* Fixes in `find_super_nodes` and `find_big_family` command of keeper-client [#63862](https://github.com/ClickHouse/ClickHouse/pull/63862) ([Alexander Gololobov](https://github.com/davenger)).
* Update lambda execution name [#63864](https://github.com/ClickHouse/ClickHouse/pull/63864) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix SIGSEGV due to CPU/Real profiler [#63865](https://github.com/ClickHouse/ClickHouse/pull/63865) ([Azat Khuzhin](https://github.com/azat)).
* Fix `EXPLAIN CURRENT TRANSACTION` query [#63926](https://github.com/ClickHouse/ClickHouse/pull/63926) ([Anton Popov](https://github.com/CurtizJ)).
* Fix analyzer: there's turtles all the way down... [#63930](https://github.com/ClickHouse/ClickHouse/pull/63930) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* Allow certain ALTER TABLE commands for `plain_rewritable` disk [#63933](https://github.com/ClickHouse/ClickHouse/pull/63933) ([Julia Kartseva](https://github.com/jkartseva)).
* Recursive CTE distributed fix [#63939](https://github.com/ClickHouse/ClickHouse/pull/63939) ([Maksim Kita](https://github.com/kitaisreal)).
* Analyzer: Fix COLUMNS resolve [#63962](https://github.com/ClickHouse/ClickHouse/pull/63962) ([Dmitry Novik](https://github.com/novikd)).
* LIMIT BY and skip\_unused\_shards with analyzer [#63983](https://github.com/ClickHouse/ClickHouse/pull/63983) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* A fix for some trash (experimental Kusto) [#63992](https://github.com/ClickHouse/ClickHouse/pull/63992) ([Yong Wang](https://github.com/kashwy)).
* Deserialize untrusted binary inputs in a safer way [#64024](https://github.com/ClickHouse/ClickHouse/pull/64024) ([Robert Schulze](https://github.com/rschu1ze)).
* Fix query analysis for queries with the setting `final` = 1 for Distributed tables over tables from other than the MergeTree family. [#64037](https://github.com/ClickHouse/ClickHouse/pull/64037) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Add missing settings to recoverLostReplica [#64040](https://github.com/ClickHouse/ClickHouse/pull/64040) ([Raúl Marín](https://github.com/Algunenano)).
* Fix SQL security access checks with analyzer [#64079](https://github.com/ClickHouse/ClickHouse/pull/64079) ([pufit](https://github.com/pufit)).
* Fix analyzer: only interpolate expression should be used for DAG [#64096](https://github.com/ClickHouse/ClickHouse/pull/64096) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* Fix azure backup writing multipart blocks by 1 MiB (read buffer size) instead of `max_upload_part_size` (in non-native copy case) [#64117](https://github.com/ClickHouse/ClickHouse/pull/64117) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Correctly fallback during backup copy [#64153](https://github.com/ClickHouse/ClickHouse/pull/64153) ([Antonio Andelic](https://github.com/antonio2368)).
* Prevent LOGICAL\_ERROR on CREATE TABLE as materialized view [#64174](https://github.com/ClickHouse/ClickHouse/pull/64174) ([Raúl Marín](https://github.com/Algunenano)).
* Query Cache: Consider identical queries against different databases as different [#64199](https://github.com/ClickHouse/ClickHouse/pull/64199) ([Robert Schulze](https://github.com/rschu1ze)).
* Ignore `text_log` for Keeper [#64218](https://github.com/ClickHouse/ClickHouse/pull/64218) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix Logical error: Bad cast for Buffer table with prewhere. [#64388](https://github.com/ClickHouse/ClickHouse/pull/64388) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
