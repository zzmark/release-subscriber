<h3 id="a-id2412a-clickhouse-release-2412-2024-12-19">
  <a id="2412" /> ClickHouse release 24.12, 2024-12-19. [Presentation](https://presentations.clickhouse.com/2024-release-24.12/), [Video](https://www.youtube.com/watch?v=bv-ut-Q6vnc)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/bv-ut-Q6vnc" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change">
  Backward Incompatible Change
</h4>

* Functions `greatest` and `least` now ignore NULL input values, whereas they previously returned NULL if one of the arguments was NULL. For example, `SELECT greatest(1, 2, NULL)` now returns 2. This makes the behavior compatible with PostgreSQL, but at the same time it breaks the compatibility with MySQL which returns NULL. To retain the previous behavior, set setting `least_greatest_legacy_null_behavior` (default: `false`) to `true`. [#65519](https://github.com/ClickHouse/ClickHouse/pull/65519) [#73344](https://github.com/ClickHouse/ClickHouse/pull/73344) ([kevinyhzou](https://github.com/KevinyhZou)).
* A new MongoDB integration is now the default. Users who like to use the legacy MongoDB driver (based on the Poco driver) can enable server setting `use_legacy_mongodb_integration`. [#73359](https://github.com/ClickHouse/ClickHouse/pull/73359) ([Kirill Nikiforov](https://github.com/allmazz).

<h4 id="new-feature">
  New Feature
</h4>

* Move `JSON`/`Dynamic`/`Variant` types from experimental features to beta. [#72294](https://github.com/ClickHouse/ClickHouse/pull/72294) ([Pavel Kruglov](https://github.com/Avogar)). We also backported all fixes as well as this change to 24.11.
* Schema evolution for the [Iceberg data storage](https://iceberg.apache.org/spec/#file-system-operations) format provides the user with extensive options for modifying the schema of their table. The order of columns, column names, and simple type extensions can be changed under the hood. [#69445](https://github.com/ClickHouse/ClickHouse/pull/69445) ([Daniil Ivanik](https://github.com/divanik)).
* Integrate with Iceberg REST Catalog: a new database engine, named Iceberg, which plugs the whole catalog into ClickHouse. [#71542](https://github.com/ClickHouse/ClickHouse/pull/71542) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Added cache for primary index of `MergeTree` tables (can be enabled by table setting `use_primary_key_cache`). If lazy load and cache are enabled for primary index, it will be loaded to cache on demand (similar to mark cache) instead of keeping it in memory forever. Added prewarm of primary index on inserts/mergs/fetches of data parts and on restarts of table (can be enabled by setting `prewarm_primary_key_cache`). This allows lower memory usage for huge tables on shared storage, and we tested it on tables over one quadrillion records. [#72102](https://github.com/ClickHouse/ClickHouse/pull/72102) ([Anton Popov](https://github.com/CurtizJ)). [#72750](https://github.com/ClickHouse/ClickHouse/pull/72750) ([Alexander Gololobov](https://github.com/davenger)).
* Implement `SYSTEM LOAD PRIMARY KEY` command to load primary indexes for all parts of a specified table or for all tables if no table is specified. This will be useful for benchmarks and to prevent extra latency during query execution. [#66252](https://github.com/ClickHouse/ClickHouse/pull/66252) [#67733](https://github.com/ClickHouse/ClickHouse/pull/67733) ([ZAWA\_ll](https://github.com/Zawa-ll)).
* Added a query that allows to attach `MergeTree` tables as `ReplicatedMergeTree` and vice versa: `ATTACH TABLE ... AS REPLICATED` and `ATTACH TABLE ... AS NOT REPLICATED`. [#65401](https://github.com/ClickHouse/ClickHouse/pull/65401) ([Kirill](https://github.com/kirillgarbar)).
* A new setting, `http_response_headers` which allows you to customize the HTTP response headers. For example, you can tell the browser to render a picture that is stored in the database. This closes [#59620](https://github.com/ClickHouse/ClickHouse/issues/59620). [#72656](https://github.com/ClickHouse/ClickHouse/pull/72656) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add function `toUnixTimestamp64Second` which converts a `DateTime64` to a `Int64` value with fixed second precision, so we can support return negative value if date is before the unix epoch. [#70597](https://github.com/ClickHouse/ClickHouse/pull/70597) ([zhanglistar](https://github.com/zhanglistar)). [#73146](https://github.com/ClickHouse/ClickHouse/pull/73146) ([Robert Schulze](https://github.com/rschu1ze)).
* Add new setting `enforce_index_structure_match_on_partition_manipulation` to allow attach when the set of source table's projections and secondary indices is a subset of those in the target table. Close [#70602](https://github.com/ClickHouse/ClickHouse/issues/70602). [#70603](https://github.com/ClickHouse/ClickHouse/pull/70603) ([zwy991114](https://github.com/zwy991114)).
* Add syntax ALTER USER `{ADD|MODIFY|DROP SETTING}`, ALTER USER `{ADD|DROP PROFILE}`, the same for ALTER ROLE and ALTER PROFILE. So instead of replacing all the set of settings, you can modify it. [#72050](https://github.com/ClickHouse/ClickHouse/pull/72050) ([pufit](https://github.com/pufit)).
* Added `arrayPRAUC` function, which calculates the AUC (Area Under the Curve) for the Precision Recall curve. [#72073](https://github.com/ClickHouse/ClickHouse/pull/72073) ([Emmanuel](https://github.com/emmanuelsdias)).
* Add `indexOfAssumeSorted` function for array types. Optimizes the search in the case of a sorted in non-decreasing order array. The effect appears on very large arrays (over 100,000 elements). [#72517](https://github.com/ClickHouse/ClickHouse/pull/72517) ([Eric Kurbanov](https://github.com/erickurbanov)).
* Allows to use a delimiter as an optional second argument for aggregate function `groupConcat`. [#72540](https://github.com/ClickHouse/ClickHouse/pull/72540) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* Function `translate` now supports character deletion if the `from` argument contains more characters than the `to` argument. Example: `SELECT translate('clickhouse', 'clickhouse', 'CLICK')` now returns `CLICK`. [#71441](https://github.com/ClickHouse/ClickHouse/pull/71441) ([shuai.xu](https://github.com/shuai-xu)).

<h4 id="experimental-features">
  Experimental Features
</h4>

* A new MergeTree setting `allow_experimental_reverse_key` that enables support for descending sort order in MergeTree sorting keys. This is useful for time series analysis, especially TopN queries. Example usage: `ENGINE = MergeTree ORDER BY (time DESC, key)`- descending order for the `time` field. [#71095](https://github.com/ClickHouse/ClickHouse/pull/71095) ([Amos Bird](https://github.com/amosbird)).

<h4 id="performance-improvement">
  Performance Improvement
</h4>

* JOIN reordering. Added an option to select the side of the join that will act as the inner (build) table in the query plan. This is controlled by `query_plan_join_swap_table`, which can be set to `auto`. In this mode, ClickHouse will try to choose the table with the smallest number of rows. [#71577](https://github.com/ClickHouse/ClickHouse/pull/71577) ([Vladimir Cherkasov](https://github.com/vdimir)).
* Now `parallel_hash` algorithm will be used (if applicable) when the `join_algorithm` setting is set to `default`. Two previous alternatives (`direct` and `hash`) are still considered when `parallel_hash` cannot be used. [#70788](https://github.com/ClickHouse/ClickHouse/pull/70788) ([Nikita Taranov](https://github.com/nickitat)).
* Add option to extract common expressions from `WHERE` and `ON` expressions in order to reduce the number of hash tables used during joins. This makes sense when the JOIN ON condition has common parts inside AND in different OR parts. Can be enabled by `optimize_extract_common_expressions = 1`. [#71537](https://github.com/ClickHouse/ClickHouse/pull/71537) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* Allows to use indexes on `SELECT` when an indexed column is CAST into a `LowCardinality(String)`, which could be the case when a query run over a Merge table with some tables having `String` and some `LowCardinality(String)`. [#71598](https://github.com/ClickHouse/ClickHouse/pull/71598) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* During query execution with parallel replicas and enabled local plan, do not perform index analysis on workers. The coordinator will choose ranges to read for workers based on index analysis on its side (on the query initiator). This makes short queries with parallel replicas have as low latency as single-node queries. [#72109](https://github.com/ClickHouse/ClickHouse/pull/72109) ([Igor Nikonov](https://github.com/devcrafter)).
* Memory usage of `clickhouse disks remove --recursive` is reduced for object storage disks. [#67323](https://github.com/ClickHouse/ClickHouse/pull/67323) ([Kirill](https://github.com/kirillgarbar)).
* Bring back optimization for reading subcolumns of single column in compact parts from [#57631](https://github.com/ClickHouse/ClickHouse/pull/57631). It was deleted accidentally. [#72285](https://github.com/ClickHouse/ClickHouse/pull/72285) ([Pavel Kruglov](https://github.com/Avogar)).
* Speedup sorting of `LowCardinality(String)` columns by de-virtualizing calls in comparator. [#72337](https://github.com/ClickHouse/ClickHouse/pull/72337) ([Alexander Gololobov](https://github.com/davenger)).
* Optimize function `argMin`/`argMax` for some simple data types. [#72350](https://github.com/ClickHouse/ClickHouse/pull/72350) ([alesapin](https://github.com/alesapin)).
* Optimize locking with shared locks in the memory tracker to reduce lock contention, which improves performance on systems with a very high number of CPU. [#72375](https://github.com/ClickHouse/ClickHouse/pull/72375) ([Jiebin Sun](https://github.com/jiebinn)).
* Add a new setting, `use_async_executor_for_materialized_views`. Use async and potentially multi-threaded execution of materialized view query, can speedup views processing during INSERT, but also consumes more memory. [#72497](https://github.com/ClickHouse/ClickHouse/pull/72497) ([alesapin](https://github.com/alesapin)).
* Improved performance of deserialization of states of aggregate functions (in data type `AggregateFunction` and in distributed queries). Slightly improved performance of parsing of format `RowBinary`. [#72818](https://github.com/ClickHouse/ClickHouse/pull/72818) ([Anton Popov](https://github.com/CurtizJ)).
* Split ranges in reading with parallel replicas in the order of the table's key to consume less memory during reading. [#72173](https://github.com/ClickHouse/ClickHouse/pull/72173) ([JIaQi](https://github.com/JiaQiTang98)).
* Speed up insertions into merge tree in the case of a single value of partition key inside the inserted batch. [#72348](https://github.com/ClickHouse/ClickHouse/pull/72348) ([alesapin](https://github.com/alesapin)).
* Implement creating tables in parallel while restoring from a backup. Before this PR the `RESTORE` command always created tables in one thread, which could be slow in case of backups containing many tables. [#72427](https://github.com/ClickHouse/ClickHouse/pull/72427) ([Vitaly Baranov](https://github.com/vitlibar)).
* Dropping mark cache might take noticeable time if it is big. If we hold context mutex during this it block many other activities, even new client connection cannot be established until it is released. And holding this mutex is not actually required for synchronization, it is enough to have a local reference to the cache via shared ptr. [#72749](https://github.com/ClickHouse/ClickHouse/pull/72749) ([Alexander Gololobov](https://github.com/davenger)).

<h4 id="improvement">
  Improvement
</h4>

* Remove the `allow_experimental_join_condition` setting, allowing non-equi conditions by default. [#69910](https://github.com/ClickHouse/ClickHouse/pull/69910) ([Vladimir Cherkasov](https://github.com/vdimir)).
* Settings from server config (users.xml) now apply on the client too. Useful for format settings, e.g. `date_time_output_format`. [#71178](https://github.com/ClickHouse/ClickHouse/pull/71178) ([Michael Kolupaev](https://github.com/al13n321)).
* Automatic `GROUP BY`/`ORDER BY` to disk based on the server/user memory usage. Controlled with `max_bytes_ratio_before_external_group_by`/`max_bytes_ratio_before_external_sort` query settings. [#71406](https://github.com/ClickHouse/ClickHouse/pull/71406) ([Azat Khuzhin](https://github.com/azat)).
* Adding a new cancellation logic: `CancellationChecker` checks timeouts for every started query and stops them once the timeout has reached. [#69880](https://github.com/ClickHouse/ClickHouse/pull/69880) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* Support ALTER from `Object` to `JSON`, which means you can easily migrate from the deprecated Object type. [#71784](https://github.com/ClickHouse/ClickHouse/pull/71784) ([Pavel Kruglov](https://github.com/Avogar)).
* Allow unknown values in set that are not present in Enum. Fix [#72662](https://github.com/ClickHouse/ClickHouse/issues/72662). [#72686](https://github.com/ClickHouse/ClickHouse/pull/72686) ([zhanglistar](https://github.com/zhanglistar)).
* Support string search operator (e.g., LIKE) for `Enum` data type, implements [#72661](https://github.com/ClickHouse/ClickHouse/issues/72661). [#72732](https://github.com/ClickHouse/ClickHouse/pull/72732) ([zhanglistar](https://github.com/zhanglistar)).
* Some meaningless ALTER USER queries were accepted. Fixes [#71227](https://github.com/ClickHouse/ClickHouse/issues/71227). [#71286](https://github.com/ClickHouse/ClickHouse/pull/71286) ([Arthur Passos](https://github.com/arthurpassos)).
* Respect `prefer_locahost_replica` when building plan for distributed `INSERT ... SELECT`. [#72190](https://github.com/ClickHouse/ClickHouse/pull/72190) ([filimonov](https://github.com/filimonov)).
* Azure violated the Iceberg specification, mistakenly labeling Iceberg v1 as Iceberg v2. The problem is [described here](https://github.com/ClickHouse/ClickHouse/issues/72091). Azure Iceberg Writer creates Iceberg metadata files (as well as manifest files) that violate specs. Now we attempt to read v1 Iceberg format metadata with the v2 reader (cause they write it in a this way), and added error when they didn't create corresponding fields in a manifest file. [#72277](https://github.com/ClickHouse/ClickHouse/pull/72277) ([Daniil Ivanik](https://github.com/divanik)).
* Now it's allowed to `CREATE MATERIALIZED VIEW` with `UNION [ALL]` in query. Behavior is the same as for matview with `JOIN`: only the first table in `SELECT` expression will work as a trigger for insert, all other tables will be ignored. However, if there are many references to the first table (e.g., UNION with itself), all of them will be processed as the inserted block of data. [#72347](https://github.com/ClickHouse/ClickHouse/pull/72347) ([alesapin](https://github.com/alesapin)).
* Added source query validation when ClickHouse is used as a source for a dictionary. [#72548](https://github.com/ClickHouse/ClickHouse/pull/72548) ([Alexey Katsman](https://github.com/alexkats)).
* Ensure that ClickHouse will see ZooKeeper changes on config reloads. [#72593](https://github.com/ClickHouse/ClickHouse/pull/72593) ([Azat Khuzhin](https://github.com/azat)).
* Better memory usage approximation of cached marks to reduce total memory usage of the cache. [#72630](https://github.com/ClickHouse/ClickHouse/pull/72630) ([Antonio Andelic](https://github.com/antonio2368)).
* Add a new `StartupScriptsExecutionState` metric. The metric can have three values: 0 = startup scripts have not finished yet, 1 = startup scripts executed successfully, 2 = startup scripts failed. We need this metric because we need to know if startup scripts are being executed successfully in the cloud, especially after releases to base configurations. [#72637](https://github.com/ClickHouse/ClickHouse/pull/72637) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* Add the new `MergeTreeIndexGranularityInternalArraysTotalSize` metric to `system.metrics`. This metric is needed to find the instances with huge datasets susceptible to the high memory usage issue.
* Add retries to creating a replicated table. [#72682](https://github.com/ClickHouse/ClickHouse/pull/72682) ([Vitaly Baranov](https://github.com/vitlibar)).
* Add `total_bytes_with_inactive` to `system.tables` to count the total bytes of inactive parts. [#72690](https://github.com/ClickHouse/ClickHouse/pull/72690) ([Kai Zhu](https://github.com/nauu)).
* Add MergeTree settings to `system.settings_changes`. [#72694](https://github.com/ClickHouse/ClickHouse/pull/72694) ([Raúl Marín](https://github.com/Algunenano)).
* Support JSON type in the `notEmpty` function. [#72741](https://github.com/ClickHouse/ClickHouse/pull/72741) ([Pavel Kruglov](https://github.com/Avogar)).
* Support parsing GCS S3 error `AuthenticationRequired`. [#72753](https://github.com/ClickHouse/ClickHouse/pull/72753) ([Vitaly Baranov](https://github.com/vitlibar)).
* Support `Dynamic` type in functions `ifNull` and `coalesce`. [#72772](https://github.com/ClickHouse/ClickHouse/pull/72772) ([Pavel Kruglov](https://github.com/Avogar)).
* Support `Dynamic` in functions `toFloat64`/`touInt32`/etc. [#72989](https://github.com/ClickHouse/ClickHouse/pull/72989) ([Pavel Kruglov](https://github.com/Avogar)).
* Add S3 request settings `http_max_fields`, `http_max_field_name_size`, `http_max_field_value_size` and use them while parsing S3 API responses during making a backup or restoring. [#72778](https://github.com/ClickHouse/ClickHouse/pull/72778) ([Vitaly Baranov](https://github.com/vitlibar)).
* Delete table metadata in keeper in Storage S3(Azure)Queue only after last table using this metadata was dropped. [#72810](https://github.com/ClickHouse/ClickHouse/pull/72810) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Added `JoinBuildTableRowCount`/`JoinProbeTableRowCount/JoinResultRowCount` profile events. [#72842](https://github.com/ClickHouse/ClickHouse/pull/72842) ([Vladimir Cherkasov](https://github.com/vdimir)).
* Support subcolumns in MergeTree sorting key and skip indexes. [#72644](https://github.com/ClickHouse/ClickHouse/pull/72644) ([Pavel Kruglov](https://github.com/Avogar)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release">
  Bug Fix (user-visible misbehavior in an official stable release)
</h4>

* Fix possible intersecting parts for MergeTree (after an operation of moving part to the detached directory has been failed, possibly due to operation on object storage). [#70476](https://github.com/ClickHouse/ClickHouse/pull/70476) ([Azat Khuzhin](https://github.com/azat)).
* Fixes an error detection when a table name is too long. Provide a diagnostic telling the maximum length. Add a new function `getMaxTableNameLengthForDatabase`. [#70810](https://github.com/ClickHouse/ClickHouse/pull/70810) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* Fixed zombie processes after a crash of `clickhouse-library-bridge` (this program allows to run unsafe libraries). [#71301](https://github.com/ClickHouse/ClickHouse/pull/71301) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* Fix NoSuchKey error during transaction rollback when creating a directory fails for the `plain_rewritable` disk. [#71439](https://github.com/ClickHouse/ClickHouse/pull/71439) ([Julia Kartseva](https://github.com/jkartseva)).
* Fix serialization of `Dynamic` values in `Pretty` JSON formats. [#71923](https://github.com/ClickHouse/ClickHouse/pull/71923) ([Pavel Kruglov](https://github.com/Avogar)).
* Add inferred format name to create query in `File`/`S3`/`URL`/`HDFS`/`Azure` engines. Previously the format name was inferred each time the server was restarted, and if the specified data files were removed, it led to errors during server startup. [#72108](https://github.com/ClickHouse/ClickHouse/pull/72108) ([Pavel Kruglov](https://github.com/Avogar)).
* Fix bugs when using a UDF in join on expression with the old analyzer. [#72179](https://github.com/ClickHouse/ClickHouse/pull/72179) ([Raúl Marín](https://github.com/Algunenano)).
* Fixes some small bugs in `StorageObjectStorage`. Needs to enable `use_hive_partitioning` by default. [#72185](https://github.com/ClickHouse/ClickHouse/pull/72185) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* Fix a bug where `min_age_to_force_merge_on_partition_only` was getting stuck trying to merge down the same partition repeatedly that was already merged to a single part and not merging partitions that had multiple parts. [#72209](https://github.com/ClickHouse/ClickHouse/pull/72209) ([Christoph Wurm](https://github.com/cwurm)).
* Fixed a crash in `SimpleSquashingChunksTransform` that occurred in rare cases when processing sparse columns. [#72226](https://github.com/ClickHouse/ClickHouse/pull/72226) ([Vladimir Cherkasov](https://github.com/vdimir)).
* Fixed data race in `GraceHashJoin` as the result of which some rows might be missing in the join output. [#72233](https://github.com/ClickHouse/ClickHouse/pull/72233) ([Nikita Taranov](https://github.com/nickitat)).
* Fixed `ALTER DELETE` queries with materialized `_block_number` column (if setting `enable_block_number_column` is enabled). [#72261](https://github.com/ClickHouse/ClickHouse/pull/72261) ([Anton Popov](https://github.com/CurtizJ)).
* Fixed data race when `ColumnDynamic::dumpStructure()` is called concurrently e.g., in `ConcurrentHashJoin` constructor. [#72278](https://github.com/ClickHouse/ClickHouse/pull/72278) ([Nikita Taranov](https://github.com/nickitat)).
* Fix possible `LOGICAL_ERROR` with duplicate columns in `ORDER BY ... WITH FILL`. [#72387](https://github.com/ClickHouse/ClickHouse/pull/72387) ([Vladimir Cherkasov](https://github.com/vdimir)).
* Fixed mismatched types in several cases after applying `optimize_functions_to_subcolumns`. [#72394](https://github.com/ClickHouse/ClickHouse/pull/72394) ([Anton Popov](https://github.com/CurtizJ)).
* Use `AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE` instead of `AWS_CONTAINER_AUTHORIZATION_TOKEN_PATH`. Fixes [#71074](https://github.com/ClickHouse/ClickHouse/issues/71074). [#72397](https://github.com/ClickHouse/ClickHouse/pull/72397) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* Fix failure on parsing `BACKUP DATABASE db EXCEPT TABLES db.table` queries. [#72429](https://github.com/ClickHouse/ClickHouse/pull/72429) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* Don't allow creating empty `Variant`. [#72454](https://github.com/ClickHouse/ClickHouse/pull/72454) ([Pavel Kruglov](https://github.com/Avogar)).
* Fix invalid formatting of `result_part_path` in `system.merges`. [#72567](https://github.com/ClickHouse/ClickHouse/pull/72567) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* Fix parsing a glob with one element (such as `{file}`). [#72572](https://github.com/ClickHouse/ClickHouse/pull/72572) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* Fix query generation for the follower server in case of a distributed query with `ARRAY JOIN`. Fixes [#69276](https://github.com/ClickHouse/ClickHouse/issues/69276). [#72608](https://github.com/ClickHouse/ClickHouse/pull/72608) ([Dmitry Novik](https://github.com/novikd)).
* Fix a bug when DateTime64 IN DateTime64 returns nothing. [#72640](https://github.com/ClickHouse/ClickHouse/pull/72640) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* Fixed inconsistent metadata when adding a new replica to a Replicated database that has a table created with `flatten_nested=0`. [#72685](https://github.com/ClickHouse/ClickHouse/pull/72685) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix advanced SSL configuration for Keeper's internal communication. [#72730](https://github.com/ClickHouse/ClickHouse/pull/72730) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix "No such key" error in S3Queue unordered mode with `tracked_files_limit` setting smaller than s3 files appearance rate. [#72738](https://github.com/ClickHouse/ClickHouse/pull/72738) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix exception thrown in RemoteQueryExecutor when a user does not exist locally. [#72759](https://github.com/ClickHouse/ClickHouse/pull/72759) ([Andrey Zvonov](https://github.com/zvonand)).
* Fixed mutations with materialized `_block_number` column (if setting `enable_block_number_column` is enabled). [#72854](https://github.com/ClickHouse/ClickHouse/pull/72854) ([Anton Popov](https://github.com/CurtizJ)).
* Fix backup/restore with plain rewritable disk in case there are empty files in backup. [#72858](https://github.com/ClickHouse/ClickHouse/pull/72858) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Properly cancel inserts in DistributedAsyncInsertDirectoryQueue. [#72885](https://github.com/ClickHouse/ClickHouse/pull/72885) ([Antonio Andelic](https://github.com/antonio2368)).
* Fixed crash while parsing of incorrect data into sparse columns (can happen with enabled setting `enable_parsing_to_custom_serialization`). [#72891](https://github.com/ClickHouse/ClickHouse/pull/72891) ([Anton Popov](https://github.com/CurtizJ)).
* Fix potential crash during backup restore. [#72947](https://github.com/ClickHouse/ClickHouse/pull/72947) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fixed bug in `parallel_hash` JOIN method that might appear when query has complex condition in the `ON` clause with inequality filters. [#72993](https://github.com/ClickHouse/ClickHouse/pull/72993) ([Nikita Taranov](https://github.com/nickitat)).
* Use default format settings during JSON parsing to avoid broken deserialization. [#73043](https://github.com/ClickHouse/ClickHouse/pull/73043) ([Pavel Kruglov](https://github.com/Avogar)).
* Fix crash in transactions with unsupported storage. [#73045](https://github.com/ClickHouse/ClickHouse/pull/73045) ([Raúl Marín](https://github.com/Algunenano)).
* Fix possible overestimation of memory tracking (when the difference between `MemoryTracking` and `MemoryResident` kept growing). [#73081](https://github.com/ClickHouse/ClickHouse/pull/73081) ([Azat Khuzhin](https://github.com/azat)).
* Check for duplicate JSON keys during Tuple parsing. Previously it could lead to a logical error `Invalid number of rows in Chunk` during parsing. [#73082](https://github.com/ClickHouse/ClickHouse/pull/73082) ([Pavel Kruglov](https://github.com/Avogar)).

<h4 id="buildtestingpackaging-improvement">
  Build/Testing/Packaging Improvement
</h4>

* All small utilities previously stored in `/utils` folder and required manual compilation from sources are now a part of main ClickHouse bundle. This closes: [#72404](https://github.com/ClickHouse/ClickHouse/issues/72404). [#72426](https://github.com/ClickHouse/ClickHouse/pull/72426) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* Get rid of `/etc/systemd/system/clickhouse-server.service` removal introduced in 22.3 [#39323](https://github.com/ClickHouse/ClickHouse/issues/39323). [#72259](https://github.com/ClickHouse/ClickHouse/pull/72259) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* Split large translation units to avoid compilation failures due to memory/cpu limitations. [#72352](https://github.com/ClickHouse/ClickHouse/pull/72352) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* OSX: Build with ICU support, which enables collations, charset conversions and other localization features. [#73083](https://github.com/ClickHouse/ClickHouse/pull/73083) ([Raúl Marín](https://github.com/Algunenano)).
