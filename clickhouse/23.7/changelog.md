<h3 id="237">
  <a id="237" /> ClickHouse release 23.7, 2023-07-27. [Presentation](https://presentations.clickhouse.com/2023-release-23.7/), [Video](https://www.youtube.com/watch?v=TI1kONfON18)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/TI1kONfON18" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-5">
  Backward Incompatible Change
</h4>

* Add `NAMED COLLECTION` access type (aliases `USE NAMED COLLECTION`, `NAMED COLLECTION USAGE`). This PR is backward incompatible because this access type is disabled by default (because a parent access type `NAMED COLLECTION ADMIN` is disabled by default as well). Proposed in [#50277](https://github.com/ClickHouse/ClickHouse/issues/50277). To grant use `GRANT NAMED COLLECTION ON collection_name TO user` or `GRANT NAMED COLLECTION ON * TO user`, to be able to give these grants `named_collection_admin` is required in config (previously it was named `named_collection_control`, so will remain as an alias). [#50625](https://github.com/ClickHouse/ClickHouse/pull/50625) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fixing a typo in the `system.parts` column name `last_removal_attemp_time`. Now it is named `last_removal_attempt_time`. [#52104](https://github.com/ClickHouse/ClickHouse/pull/52104) ([filimonov](https://github.com/filimonov)).
* Bump version of the distributed\_ddl\_entry\_format\_version to 5 by default (enables opentelemetry and initial\_query\_idd pass through). This will not allow to process existing entries for distributed DDL after *downgrade* (but note, that usually there should be no such unprocessed entries). [#52128](https://github.com/ClickHouse/ClickHouse/pull/52128) ([Azat Khuzhin](https://github.com/azat)).
* Check projection metadata the same way we check ordinary metadata. This change may prevent the server from starting in case there was a table with an invalid projection. An example is a projection that created positional columns in PK (e.g. `projection p (select * order by 1, 4)` which is not allowed in table PK and can cause a crash during insert/merge). Drop such projections before the update. Fixes [#52353](https://github.com/ClickHouse/ClickHouse/issues/52353). [#52361](https://github.com/ClickHouse/ClickHouse/pull/52361) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* The experimental feature `hashid` is removed due to a bug. The quality of implementation was questionable at the start, and it didn't get through the experimental status. This closes [#52406](https://github.com/ClickHouse/ClickHouse/issues/52406). [#52449](https://github.com/ClickHouse/ClickHouse/pull/52449) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="new-feature-5">
  New Feature
</h4>

* Added `Overlay` database engine to combine multiple databases into one. Added `Filesystem` database engine to represent a directory in the filesystem as a set of implicitly available tables with auto-detected formats and structures. A new `S3` database engine allows to read-only interact with s3 storage by representing a prefix as a set of tables. A new `HDFS` database engine allows to interact with HDFS storage in the same way. [#48821](https://github.com/ClickHouse/ClickHouse/pull/48821) ([alekseygolub](https://github.com/alekseygolub)).
* Add support for external disks in Keeper for storing snapshots and logs. [#50098](https://github.com/ClickHouse/ClickHouse/pull/50098) ([Antonio Andelic](https://github.com/antonio2368)).
* Add support for multi-directory selection (`{}`) globs. [#50559](https://github.com/ClickHouse/ClickHouse/pull/50559) ([Andrey Zvonov](https://github.com/zvonand)).
* Kafka connector can fetch Avro schema from schema registry with basic authentication using url-encoded credentials. [#49664](https://github.com/ClickHouse/ClickHouse/pull/49664) ([Ilya Golshtein](https://github.com/ilejn)).
* Add function `arrayJaccardIndex` which computes the Jaccard similarity between two arrays. [#50076](https://github.com/ClickHouse/ClickHouse/pull/50076) ([FFFFFFFHHHHHHH](https://github.com/FFFFFFFHHHHHHH)).
* Add a column `is_obsolete` to `system.settings` and similar tables. Closes [#50819](https://github.com/ClickHouse/ClickHouse/issues/50819). [#50826](https://github.com/ClickHouse/ClickHouse/pull/50826) ([flynn](https://github.com/ucasfl)).
* Implement support of encrypted elements in configuration file. Added possibility to use encrypted text in leaf elements of configuration file. The text is encrypted using encryption codecs from `<encryption_codecs>` section. [#50986](https://github.com/ClickHouse/ClickHouse/pull/50986) ([Roman Vasin](https://github.com/rvasin)).
* Grace Hash Join algorithm is now applicable to FULL and RIGHT JOINs. [#49483](https://github.com/ClickHouse/ClickHouse/issues/49483). [#51013](https://github.com/ClickHouse/ClickHouse/pull/51013) ([lgbo](https://github.com/lgbo-ustc)).
* Add `SYSTEM STOP LISTEN` query for more graceful termination. Closes [#47972](https://github.com/ClickHouse/ClickHouse/issues/47972). [#51016](https://github.com/ClickHouse/ClickHouse/pull/51016) ([Nikolay Degterinsky](https://github.com/evillique)).
* Add `input_format_csv_allow_variable_number_of_columns` options. [#51273](https://github.com/ClickHouse/ClickHouse/pull/51273) ([Dmitry Kardymon](https://github.com/kardymonds)).
* Another boring feature: add function `substring_index`, as in Spark or MySQL. [#51472](https://github.com/ClickHouse/ClickHouse/pull/51472) ([李扬](https://github.com/taiyang-li)).
* A system table `jemalloc_bins` to show stats for jemalloc bins. Example `SELECT *, size * (nmalloc - ndalloc) AS allocated_bytes FROM system.jemalloc_bins WHERE allocated_bytes > 0 ORDER BY allocated_bytes DESC LIMIT 10`. Enjoy. [#51674](https://github.com/ClickHouse/ClickHouse/pull/51674) ([Alexander Gololobov](https://github.com/davenger)).
* Add `RowBinaryWithDefaults` format with extra byte before each column as a flag for using the column's default value. Closes [#50854](https://github.com/ClickHouse/ClickHouse/issues/50854). [#51695](https://github.com/ClickHouse/ClickHouse/pull/51695) ([Kruglov Pavel](https://github.com/Avogar)).
* Added `default_temporary_table_engine` setting. Same as `default_table_engine` but for temporary tables. [#51292](https://github.com/ClickHouse/ClickHouse/issues/51292). [#51708](https://github.com/ClickHouse/ClickHouse/pull/51708) ([velavokr](https://github.com/velavokr)).
* Added new `initcap` / `initcapUTF8` functions which convert the first letter of each word to upper case and the rest to lower case. [#51735](https://github.com/ClickHouse/ClickHouse/pull/51735) ([Dmitry Kardymon](https://github.com/kardymonds)).
* Create table now supports `PRIMARY KEY` syntax in column definition. Columns are added to primary index in the same order columns are defined. [#51881](https://github.com/ClickHouse/ClickHouse/pull/51881) ([Ilya Yatsishin](https://github.com/qoega)).
* Added the possibility to use date and time format specifiers in log and error log file names, either in config files (`log` and `errorlog` tags) or command line arguments (`--log-file` and `--errorlog-file`). [#51945](https://github.com/ClickHouse/ClickHouse/pull/51945) ([Victor Krasnov](https://github.com/sirvickr)).
* Added Peak Memory Usage statistic to HTTP headers. [#51946](https://github.com/ClickHouse/ClickHouse/pull/51946) ([Dmitry Kardymon](https://github.com/kardymonds)).
* Added new `hasSubsequence` (+`CaseInsensitive` and `UTF8` versions) functions to match subsequences in strings. [#52050](https://github.com/ClickHouse/ClickHouse/pull/52050) ([Dmitry Kardymon](https://github.com/kardymonds)).
* Add `array_agg` as alias of `groupArray` for PostgreSQL compatibility. Closes [#52100](https://github.com/ClickHouse/ClickHouse/issues/52100). ### Documentation entry for user-facing changes. [#52135](https://github.com/ClickHouse/ClickHouse/pull/52135) ([flynn](https://github.com/ucasfl)).
* Add `any_value` as a compatibility alias for `any` aggregate function. Closes [#52140](https://github.com/ClickHouse/ClickHouse/issues/52140). [#52147](https://github.com/ClickHouse/ClickHouse/pull/52147) ([flynn](https://github.com/ucasfl)).
* Add aggregate function `array_concat_agg` for compatibility with BigQuery, it's alias of `groupArrayArray`. Closes [#52139](https://github.com/ClickHouse/ClickHouse/issues/52139). [#52149](https://github.com/ClickHouse/ClickHouse/pull/52149) ([flynn](https://github.com/ucasfl)).
* Add `OCTET_LENGTH` as an alias to `length`. Closes [#52153](https://github.com/ClickHouse/ClickHouse/issues/52153). [#52176](https://github.com/ClickHouse/ClickHouse/pull/52176) ([FFFFFFFHHHHHHH](https://github.com/FFFFFFFHHHHHHH)).
* Added `firstLine` function to extract the first line from the multi-line string. This closes [#51172](https://github.com/ClickHouse/ClickHouse/issues/51172). [#52209](https://github.com/ClickHouse/ClickHouse/pull/52209) ([Mikhail Koviazin](https://github.com/mkmkme)).
* Implement KQL-style formatting for the `Interval` data type. This is only needed for compatibility with the `Kusto` query language. [#45671](https://github.com/ClickHouse/ClickHouse/pull/45671) ([ltrk2](https://github.com/ltrk2)).
* Added query `SYSTEM FLUSH ASYNC INSERT QUEUE` which flushes all pending asynchronous inserts to the destination tables. Added a server-side setting `async_insert_queue_flush_on_shutdown` (`true` by default) which determines whether to flush queue of asynchronous inserts on graceful shutdown. Setting `async_insert_threads` is now a server-side setting. [#49160](https://github.com/ClickHouse/ClickHouse/pull/49160) ([Anton Popov](https://github.com/CurtizJ)).
* Aliases `current_database` and a new function `current_schemas` for compatibility with PostgreSQL. [#51076](https://github.com/ClickHouse/ClickHouse/pull/51076) ([Pedro Riera](https://github.com/priera)).
* Add alias for functions `today` (now available under the `curdate`/`current_date` names) and `now` (`current_timestamp`). [#52106](https://github.com/ClickHouse/ClickHouse/pull/52106) ([Lloyd-Pottiger](https://github.com/Lloyd-Pottiger)).
* Support `async_deduplication_token` for async insert. [#52136](https://github.com/ClickHouse/ClickHouse/pull/52136) ([Han Fei](https://github.com/hanfei1991)).
* Add new setting `disable_url_encoding` that allows to disable decoding/encoding path in uri in URL engine. [#52337](https://github.com/ClickHouse/ClickHouse/pull/52337) ([Kruglov Pavel](https://github.com/Avogar)).

<h4 id="performance-improvement-5">
  Performance Improvement
</h4>

* Enable automatic selection of the sparse serialization format by default. It improves performance. The format is supported since version 22.1. After this change, downgrading to versions older than 22.1 might not be possible. A downgrade may require to set `ratio_of_defaults_for_sparse_serialization=0.9375` [55153](https://github.com/ClickHouse/ClickHouse/issues/55153). You can turn off the usage of the sparse serialization format by providing the `ratio_of_defaults_for_sparse_serialization = 1` setting for your MergeTree tables. [#49631](https://github.com/ClickHouse/ClickHouse/pull/49631) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Enable `move_all_conditions_to_prewhere` and `enable_multiple_prewhere_read_steps` settings by default. [#46365](https://github.com/ClickHouse/ClickHouse/pull/46365) ([Alexander Gololobov](https://github.com/davenger)).
* Improves performance of some queries by tuning allocator. [#46416](https://github.com/ClickHouse/ClickHouse/pull/46416) ([Azat Khuzhin](https://github.com/azat)).
* Now we use fixed-size tasks in `MergeTreePrefetchedReadPool` as in `MergeTreeReadPool`. Also from now we use connection pool for S3 requests. [#49732](https://github.com/ClickHouse/ClickHouse/pull/49732) ([Nikita Taranov](https://github.com/nickitat)).
* More pushdown to the right side of join. [#50532](https://github.com/ClickHouse/ClickHouse/pull/50532) ([Nikita Taranov](https://github.com/nickitat)).
* Improve grace\_hash join by reserving hash table's size (resubmit). [#50875](https://github.com/ClickHouse/ClickHouse/pull/50875) ([lgbo](https://github.com/lgbo-ustc)).
* Waiting on lock in `OpenedFileCache` could be noticeable sometimes. We sharded it into multiple sub-maps (each with its own lock) to avoid contention. [#51341](https://github.com/ClickHouse/ClickHouse/pull/51341) ([Nikita Taranov](https://github.com/nickitat)).
* Move conditions with primary key columns to the end of PREWHERE chain. The idea is that conditions with PK columns are likely to be used in PK analysis and will not contribute much more to PREWHERE filtering. [#51958](https://github.com/ClickHouse/ClickHouse/pull/51958) ([Alexander Gololobov](https://github.com/davenger)).
* Speed up `COUNT(DISTINCT)` for String types by inlining SipHash. The performance experiments of *OnTime* on the ICX device (Intel Xeon Platinum 8380 CPU, 80 cores, 160 threads) show that this change could bring an improvement of *11.6%* to the QPS of the query *Q8* while having no impact on others. [#52036](https://github.com/ClickHouse/ClickHouse/pull/52036) ([Zhiguo Zhou](https://github.com/ZhiguoZh)).
* Enable `allow_vertical_merges_from_compact_to_wide_parts` by default. It will save memory usage during merges. [#52295](https://github.com/ClickHouse/ClickHouse/pull/52295) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix incorrect projection analysis which invalidates primary keys. This issue only exists when `query_plan_optimize_primary_key = 1, query_plan_optimize_projection = 1`. This fixes [#48823](https://github.com/ClickHouse/ClickHouse/issues/48823). This fixes [#51173](https://github.com/ClickHouse/ClickHouse/issues/51173). [#52308](https://github.com/ClickHouse/ClickHouse/pull/52308) ([Amos Bird](https://github.com/amosbird)).
* Reduce the number of syscalls in `FileCache::loadMetadata` - this speeds up server startup if the filesystem cache is configured. [#52435](https://github.com/ClickHouse/ClickHouse/pull/52435) ([Raúl Marín](https://github.com/Algunenano)).
* Allow to have strict lower boundary for file segment size by downloading remaining data in the background. Minimum size of file segment (if actual file size is bigger) is configured as cache configuration setting `boundary_alignment`, by default `4Mi`. Number of background threads are configured as cache configuration setting `background_download_threads`, by default `2`. Also `max_file_segment_size` was increased from `8Mi` to `32Mi` in this PR. [#51000](https://github.com/ClickHouse/ClickHouse/pull/51000) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Decreased default timeouts for S3 from 30 seconds to 3 seconds, and for other HTTP from 180 seconds to 30 seconds. [#51171](https://github.com/ClickHouse/ClickHouse/pull/51171) ([Michael Kolupaev](https://github.com/al13n321)).
* New setting `merge_tree_determine_task_size_by_prewhere_columns` added. If set to `true` only sizes of the columns from `PREWHERE` section will be considered to determine reading task size. Otherwise all the columns from query are considered. [#52606](https://github.com/ClickHouse/ClickHouse/pull/52606) ([Nikita Taranov](https://github.com/nickitat)).

<h4 id="improvement-5">
  Improvement
</h4>

* Use read\_bytes/total\_bytes\_to\_read for progress bar in s3/file/url/... table functions for better progress indication. [#51286](https://github.com/ClickHouse/ClickHouse/pull/51286) ([Kruglov Pavel](https://github.com/Avogar)).
* Introduce a table setting `wait_for_unique_parts_send_before_shutdown_ms` which specify the amount of time replica will wait before closing interserver handler for replicated sends. Also fix inconsistency with shutdown of tables and interserver handlers: now server shutdown tables first and only after it shut down interserver handlers. [#51851](https://github.com/ClickHouse/ClickHouse/pull/51851) ([alesapin](https://github.com/alesapin)).
* Allow SQL standard `FETCH` without `OFFSET`. See [https://antonz.org/sql-fetch/](https://antonz.org/sql-fetch/). [#51293](https://github.com/ClickHouse/ClickHouse/pull/51293) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Allow filtering HTTP headers for the URL/S3 table functions with the new `http_forbid_headers` section in config. Both exact matching and regexp filters are available. [#51038](https://github.com/ClickHouse/ClickHouse/pull/51038) ([Nikolay Degterinsky](https://github.com/evillique)).
* Don't show messages about `16 EiB` free space in logs, as they don't make sense. This closes [#49320](https://github.com/ClickHouse/ClickHouse/issues/49320). [#49342](https://github.com/ClickHouse/ClickHouse/pull/49342) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Properly check the limit for the `sleepEachRow` function. Add a setting `function_sleep_max_microseconds_per_block`. This is needed for generic query fuzzer. [#49343](https://github.com/ClickHouse/ClickHouse/pull/49343) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix two issues in `geoHash` functions. [#50066](https://github.com/ClickHouse/ClickHouse/pull/50066) ([李扬](https://github.com/taiyang-li)).
* Log async insert flush queries into `system.query_log`. [#51160](https://github.com/ClickHouse/ClickHouse/pull/51160) ([Raúl Marín](https://github.com/Algunenano)).
* Functions `date_diff` and `age` now support millisecond/microsecond unit and work with microsecond precision. [#51291](https://github.com/ClickHouse/ClickHouse/pull/51291) ([Dmitry Kardymon](https://github.com/kardymonds)).
* Improve parsing of path in clickhouse-keeper-client. [#51359](https://github.com/ClickHouse/ClickHouse/pull/51359) ([Azat Khuzhin](https://github.com/azat)).
* A third-party product depending on ClickHouse (Gluten: a Plugin to Double Spark SQL's Performance) had a bug. This fix avoids heap overflow in that third-party product while reading from HDFS. [#51386](https://github.com/ClickHouse/ClickHouse/pull/51386) ([李扬](https://github.com/taiyang-li)).
* Add ability to disable native copy for S3 (setting for BACKUP/RESTORE `allow_s3_native_copy`, and `s3_allow_native_copy` for `s3`/`s3_plain` disks). [#51448](https://github.com/ClickHouse/ClickHouse/pull/51448) ([Azat Khuzhin](https://github.com/azat)).
* Add column `primary_key_size` to `system.parts` table to show compressed primary key size on disk. Closes [#51400](https://github.com/ClickHouse/ClickHouse/issues/51400). [#51496](https://github.com/ClickHouse/ClickHouse/pull/51496) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* Allow running `clickhouse-local` without procfs, without home directory existing, and without name resolution plugins from glibc. [#51518](https://github.com/ClickHouse/ClickHouse/pull/51518) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add placeholder `%a` for rull filename in rename\_files\_after\_processing setting. [#51603](https://github.com/ClickHouse/ClickHouse/pull/51603) ([Kruglov Pavel](https://github.com/Avogar)).
* Add column `modification_time` into `system.parts_columns`. [#51685](https://github.com/ClickHouse/ClickHouse/pull/51685) ([Azat Khuzhin](https://github.com/azat)).
* Add new setting `input_format_csv_use_default_on_bad_values` to CSV format that allows to insert default value when parsing of a single field failed. [#51716](https://github.com/ClickHouse/ClickHouse/pull/51716) ([KevinyhZou](https://github.com/KevinyhZou)).
* Added a crash log flush to the disk after the unexpected crash. [#51720](https://github.com/ClickHouse/ClickHouse/pull/51720) ([Alexey Gerasimchuck](https://github.com/Demilivor)).
* Fix behavior in dashboard page where errors unrelated to authentication are not shown. Also fix 'overlapping' chart behavior. [#51744](https://github.com/ClickHouse/ClickHouse/pull/51744) ([Zach Naimon](https://github.com/ArctypeZach)).
* Allow UUID to UInt128 conversion. [#51765](https://github.com/ClickHouse/ClickHouse/pull/51765) ([Dmitry Kardymon](https://github.com/kardymonds)).
* Added support for function `range` of Nullable arguments. [#51767](https://github.com/ClickHouse/ClickHouse/pull/51767) ([Dmitry Kardymon](https://github.com/kardymonds)).
* Convert condition like `toyear(x) = c` to `c1 <= x < c2`. [#51795](https://github.com/ClickHouse/ClickHouse/pull/51795) ([Han Fei](https://github.com/hanfei1991)).
* Improve MySQL compatibility of the statement `SHOW INDEX`. [#51796](https://github.com/ClickHouse/ClickHouse/pull/51796) ([Robert Schulze](https://github.com/rschu1ze)).
* Fix `use_structure_from_insertion_table_in_table_functions` does not work with `MATERIALIZED` and `ALIAS` columns. Closes [#51817](https://github.com/ClickHouse/ClickHouse/issues/51817). Closes [#51019](https://github.com/ClickHouse/ClickHouse/issues/51019). [#51825](https://github.com/ClickHouse/ClickHouse/pull/51825) ([flynn](https://github.com/ucasfl)).
* Cache dictionary now requests only unique keys from source. Closes [#51762](https://github.com/ClickHouse/ClickHouse/issues/51762). [#51853](https://github.com/ClickHouse/ClickHouse/pull/51853) ([Maksim Kita](https://github.com/kitaisreal)).
* Fixed the case when settings were not applied for EXPLAIN query when FORMAT was provided. [#51859](https://github.com/ClickHouse/ClickHouse/pull/51859) ([Nikita Taranov](https://github.com/nickitat)).
* Allow SETTINGS before FORMAT in DESCRIBE TABLE query for compatibility with SELECT query. Closes [#51544](https://github.com/ClickHouse/ClickHouse/issues/51544). [#51899](https://github.com/ClickHouse/ClickHouse/pull/51899) ([Nikolay Degterinsky](https://github.com/evillique)).
* Var-Int encoded integers (e.g. used by the native protocol) can now use the full 64-bit range. 3rd party clients are advised to update their var-int code accordingly. [#51905](https://github.com/ClickHouse/ClickHouse/pull/51905) ([Robert Schulze](https://github.com/rschu1ze)).
* Update certificates when they change without the need to manually SYSTEM RELOAD CONFIG. [#52030](https://github.com/ClickHouse/ClickHouse/pull/52030) ([Mike Kot](https://github.com/myrrc)).
* Added `allow_create_index_without_type` setting that allow to ignore `ADD INDEX` queries without specified `TYPE`. Standard SQL queries will just succeed without changing table schema. [#52056](https://github.com/ClickHouse/ClickHouse/pull/52056) ([Ilya Yatsishin](https://github.com/qoega)).
* Log messages are written to the `system.text_log` from the server startup. [#52113](https://github.com/ClickHouse/ClickHouse/pull/52113) ([Dmitry Kardymon](https://github.com/kardymonds)).
* In cases where the HTTP endpoint has multiple IP addresses and the first of them is unreachable, a timeout exception was thrown. Made session creation with handling all resolved endpoints. [#52116](https://github.com/ClickHouse/ClickHouse/pull/52116) ([Aleksei Filatov](https://github.com/aalexfvk)).
* Avro input format now supports Union even if it contains only a single type. Closes [#52131](https://github.com/ClickHouse/ClickHouse/issues/52131). [#52137](https://github.com/ClickHouse/ClickHouse/pull/52137) ([flynn](https://github.com/ucasfl)).
* Add setting `optimize_use_implicit_projections` to disable implicit projections (currently only `min_max_count` projection). [#52152](https://github.com/ClickHouse/ClickHouse/pull/52152) ([Amos Bird](https://github.com/amosbird)).
* It was possible to use the function `hasToken` for infinite loop. Now this possibility is removed. This closes [#52156](https://github.com/ClickHouse/ClickHouse/issues/52156). [#52160](https://github.com/ClickHouse/ClickHouse/pull/52160) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Create ZK ancestors optimistically. [#52195](https://github.com/ClickHouse/ClickHouse/pull/52195) ([Raúl Marín](https://github.com/Algunenano)).
* Fix [#50582](https://github.com/ClickHouse/ClickHouse/issues/50582). Avoid the `Not found column ... in block` error in some cases of reading in-order and constants. [#52259](https://github.com/ClickHouse/ClickHouse/pull/52259) ([Chen768959](https://github.com/Chen768959)).
* Check whether S2 geo primitives are invalid as early as possible on ClickHouse side. This closes: [#27090](https://github.com/ClickHouse/ClickHouse/issues/27090). [#52260](https://github.com/ClickHouse/ClickHouse/pull/52260) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* Add back missing projection QueryAccessInfo when `query_plan_optimize_projection = 1`. This fixes [#50183](https://github.com/ClickHouse/ClickHouse/issues/50183) . This fixes [#50093](https://github.com/ClickHouse/ClickHouse/issues/50093). [#52327](https://github.com/ClickHouse/ClickHouse/pull/52327) ([Amos Bird](https://github.com/amosbird)).
* When `ZooKeeperRetriesControl` rethrows an error, it's more useful to see its original stack trace, not the one from `ZooKeeperRetriesControl` itself. [#52347](https://github.com/ClickHouse/ClickHouse/pull/52347) ([Vitaly Baranov](https://github.com/vitlibar)).
* Wait for zero copy replication lock even if some disks don't support it. [#52376](https://github.com/ClickHouse/ClickHouse/pull/52376) ([Raúl Marín](https://github.com/Algunenano)).
* Now interserver port will be closed only after tables are shut down. [#52498](https://github.com/ClickHouse/ClickHouse/pull/52498) ([alesapin](https://github.com/alesapin)).

<h4 id="experimental-feature-2">
  Experimental Feature
</h4>

* Writing parquet files is 10x faster, it's multi-threaded now. Almost the same speed as reading. [#49367](https://github.com/ClickHouse/ClickHouse/pull/49367) ([Michael Kolupaev](https://github.com/al13n321)). This is controlled by the setting `output_format_parquet_use_custom_encoder` which is disabled by default, because the feature is non-ideal.
* Added support for [PRQL](https://prql-lang.org/) as a query language. [#50686](https://github.com/ClickHouse/ClickHouse/pull/50686) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* Allow to add disk name for custom disks. Previously custom disks would use an internal generated disk name. Now it will be possible with `disk = disk_<name>(...)` (e.g. disk will have name `name`) . [#51552](https://github.com/ClickHouse/ClickHouse/pull/51552) ([Kseniia Sumarokova](https://github.com/kssenii)). This syntax can be changed in this release.
* (experimental MaterializedMySQL) Fixed crash when `mysqlxx::Pool::Entry` is used after it was disconnected. [#52063](https://github.com/ClickHouse/ClickHouse/pull/52063) ([Val Doroshchuk](https://github.com/valbok)).
* (experimental MaterializedMySQL) `CREATE TABLE ... AS SELECT` .. is now supported in MaterializedMySQL. [#52067](https://github.com/ClickHouse/ClickHouse/pull/52067) ([Val Doroshchuk](https://github.com/valbok)).
* (experimental MaterializedMySQL) Introduced automatic conversion of text types to utf8 for MaterializedMySQL. [#52084](https://github.com/ClickHouse/ClickHouse/pull/52084) ([Val Doroshchuk](https://github.com/valbok)).
* (experimental MaterializedMySQL) Now unquoted UTF-8 strings are supported in DDL for MaterializedMySQL. [#52318](https://github.com/ClickHouse/ClickHouse/pull/52318) ([Val Doroshchuk](https://github.com/valbok)).
* (experimental MaterializedMySQL) Now double quoted comments are supported in MaterializedMySQL. [#52355](https://github.com/ClickHouse/ClickHouse/pull/52355) ([Val Doroshchuk](https://github.com/valbok)).
* Upgrade Intel QPL from v1.1.0 to v1.2.0 2. Upgrade Intel accel-config from v3.5 to v4.0 3. Fixed issue that Device IOTLB miss has big perf. impact for IAA accelerators. [#52180](https://github.com/ClickHouse/ClickHouse/pull/52180) ([jasperzhu](https://github.com/jinjunzh)).
* The `session_timezone` setting (new in version 23.6) is demoted to experimental. [#52445](https://github.com/ClickHouse/ClickHouse/pull/52445) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Support ZooKeeper `reconfig` command for ClickHouse Keeper with incremental reconfiguration which can be enabled via `keeper_server.enable_reconfiguration` setting. Support adding servers, removing servers, and changing server priorities. [#49450](https://github.com/ClickHouse/ClickHouse/pull/49450) ([Mike Kot](https://github.com/myrrc)). It is suspected that this feature is incomplete.

<h4 id="buildtestingpackaging-improvement-5">
  Build/Testing/Packaging Improvement
</h4>

* Add experimental ClickHouse builds for Linux RISC-V 64 to CI. [#31398](https://github.com/ClickHouse/ClickHouse/pull/31398) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add integration test check with the enabled Analyzer. [#50926](https://github.com/ClickHouse/ClickHouse/pull/50926) [#52210](https://github.com/ClickHouse/ClickHouse/pull/52210) ([Dmitry Novik](https://github.com/novikd)).
* Reproducible builds for Rust. [#52395](https://github.com/ClickHouse/ClickHouse/pull/52395) ([Azat Khuzhin](https://github.com/azat)).
* Update Cargo dependencies. [#51721](https://github.com/ClickHouse/ClickHouse/pull/51721) ([Raúl Marín](https://github.com/Algunenano)).
* Make the function `CHColumnToArrowColumn::fillArrowArrayWithArrayColumnData` to work with nullable arrays, which are not possible in ClickHouse, but needed for Gluten. [#52112](https://github.com/ClickHouse/ClickHouse/pull/52112) ([李扬](https://github.com/taiyang-li)).
* We've updated the CCTZ library to master, but there are no user-visible changes. [#52124](https://github.com/ClickHouse/ClickHouse/pull/52124) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* The `system.licenses` table now includes the hard-forked library Poco. This closes [#52066](https://github.com/ClickHouse/ClickHouse/issues/52066). [#52127](https://github.com/ClickHouse/ClickHouse/pull/52127) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Check that there are no cases of bad punctuation: whitespace before a comma like `Hello ,world` instead of `Hello, world`. [#52549](https://github.com/ClickHouse/ClickHouse/pull/52549) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-5">
  Bug Fix (user-visible misbehavior in an official stable release)
</h4>

* Fix MaterializedPostgreSQL syncTables [#49698](https://github.com/ClickHouse/ClickHouse/pull/49698) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix projection with optimize\_aggregators\_of\_group\_by\_keys [#49709](https://github.com/ClickHouse/ClickHouse/pull/49709) ([Amos Bird](https://github.com/amosbird)).
* Fix optimize\_skip\_unused\_shards with JOINs [#51037](https://github.com/ClickHouse/ClickHouse/pull/51037) ([Azat Khuzhin](https://github.com/azat)).
* Fix formatDateTime() with fractional negative datetime64 [#51290](https://github.com/ClickHouse/ClickHouse/pull/51290) ([Dmitry Kardymon](https://github.com/kardymonds)).
* Functions `hasToken*` were totally wrong. Add a test for [#43358](https://github.com/ClickHouse/ClickHouse/issues/43358) [#51378](https://github.com/ClickHouse/ClickHouse/pull/51378) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix optimization to move functions before sorting. [#51481](https://github.com/ClickHouse/ClickHouse/pull/51481) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix Block structure mismatch in Pipe::unitePipes for FINAL [#51492](https://github.com/ClickHouse/ClickHouse/pull/51492) ([Nikita Taranov](https://github.com/nickitat)).
* Fix SIGSEGV for clusters with zero weight across all shards (fixes INSERT INTO FUNCTION clusterAllReplicas()) [#51545](https://github.com/ClickHouse/ClickHouse/pull/51545) ([Azat Khuzhin](https://github.com/azat)).
* Fix timeout for hedged requests [#51582](https://github.com/ClickHouse/ClickHouse/pull/51582) ([Azat Khuzhin](https://github.com/azat)).
* Fix logical error in ANTI join with NULL [#51601](https://github.com/ClickHouse/ClickHouse/pull/51601) ([vdimir](https://github.com/vdimir)).
* Fix for moving 'IN' conditions to PREWHERE [#51610](https://github.com/ClickHouse/ClickHouse/pull/51610) ([Alexander Gololobov](https://github.com/davenger)).
* Do not apply PredicateExpressionsOptimizer for ASOF/ANTI join [#51633](https://github.com/ClickHouse/ClickHouse/pull/51633) ([vdimir](https://github.com/vdimir)).
* Fix async insert with deduplication for ReplicatedMergeTree using merging algorithms [#51676](https://github.com/ClickHouse/ClickHouse/pull/51676) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix reading from empty column in `parseSipHashKey` [#51804](https://github.com/ClickHouse/ClickHouse/pull/51804) ([Nikita Taranov](https://github.com/nickitat)).
* Fix segfault when create invalid EmbeddedRocksdb table [#51847](https://github.com/ClickHouse/ClickHouse/pull/51847) ([Duc Canh Le](https://github.com/canhld94)).
* Fix inserts into MongoDB tables [#51876](https://github.com/ClickHouse/ClickHouse/pull/51876) ([Nikolay Degterinsky](https://github.com/evillique)).
* Fix deadlock on DatabaseCatalog shutdown [#51908](https://github.com/ClickHouse/ClickHouse/pull/51908) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix error in subquery operators [#51922](https://github.com/ClickHouse/ClickHouse/pull/51922) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix async connect to hosts with multiple ips [#51934](https://github.com/ClickHouse/ClickHouse/pull/51934) ([Kruglov Pavel](https://github.com/Avogar)).
* Do not remove inputs after ActionsDAG::merge [#51947](https://github.com/ClickHouse/ClickHouse/pull/51947) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Check refcount in `RemoveManyObjectStorageOperation::finalize` instead of `execute` [#51954](https://github.com/ClickHouse/ClickHouse/pull/51954) ([vdimir](https://github.com/vdimir)).
* Allow parametric UDFs [#51964](https://github.com/ClickHouse/ClickHouse/pull/51964) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Small fix for toDateTime64() for dates after 2283-12-31 [#52130](https://github.com/ClickHouse/ClickHouse/pull/52130) ([Andrey Zvonov](https://github.com/zvonand)).
* Fix ORDER BY tuple of WINDOW functions [#52145](https://github.com/ClickHouse/ClickHouse/pull/52145) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix incorrect projection analysis when aggregation expression contains monotonic functions [#52151](https://github.com/ClickHouse/ClickHouse/pull/52151) ([Amos Bird](https://github.com/amosbird)).
* Fix error in `groupArrayMoving` functions [#52161](https://github.com/ClickHouse/ClickHouse/pull/52161) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Disable direct join for range dictionary [#52187](https://github.com/ClickHouse/ClickHouse/pull/52187) ([Duc Canh Le](https://github.com/canhld94)).
* Fix sticky mutations test (and extremely rare race condition) [#52197](https://github.com/ClickHouse/ClickHouse/pull/52197) ([alesapin](https://github.com/alesapin)).
* Fix race in Web disk [#52211](https://github.com/ClickHouse/ClickHouse/pull/52211) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix data race in Connection::setAsyncCallback on unknown packet from server [#52219](https://github.com/ClickHouse/ClickHouse/pull/52219) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix temp data deletion on startup, add test [#52275](https://github.com/ClickHouse/ClickHouse/pull/52275) ([vdimir](https://github.com/vdimir)).
* Don't use minmax\_count projections when counting nullable columns [#52297](https://github.com/ClickHouse/ClickHouse/pull/52297) ([Amos Bird](https://github.com/amosbird)).
* MergeTree/ReplicatedMergeTree should use server timezone for log entries [#52325](https://github.com/ClickHouse/ClickHouse/pull/52325) ([Azat Khuzhin](https://github.com/azat)).
* Fix parameterized view with cte and multiple usage [#52328](https://github.com/ClickHouse/ClickHouse/pull/52328) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* Disable expression templates for time intervals [#52335](https://github.com/ClickHouse/ClickHouse/pull/52335) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Fix `apply_snapshot` in Keeper [#52358](https://github.com/ClickHouse/ClickHouse/pull/52358) ([Antonio Andelic](https://github.com/antonio2368)).
* Update build-osx.md [#52377](https://github.com/ClickHouse/ClickHouse/pull/52377) ([AlexBykovski](https://github.com/AlexBykovski)).
* Fix `countSubstrings` hang with empty needle and a column haystack [#52409](https://github.com/ClickHouse/ClickHouse/pull/52409) ([Sergei Trifonov](https://github.com/serxa)).
* Fix normal projection with merge table  [#52432](https://github.com/ClickHouse/ClickHouse/pull/52432) ([Amos Bird](https://github.com/amosbird)).
* Fix possible double-free in Aggregator [#52439](https://github.com/ClickHouse/ClickHouse/pull/52439) ([Nikita Taranov](https://github.com/nickitat)).
* Fixed inserting into Buffer engine [#52440](https://github.com/ClickHouse/ClickHouse/pull/52440) ([Vasily Nemkov](https://github.com/Enmk)).
* The implementation of AnyHash was non-conformant. [#52448](https://github.com/ClickHouse/ClickHouse/pull/52448) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Check recursion depth in OptimizedRegularExpression [#52451](https://github.com/ClickHouse/ClickHouse/pull/52451) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix data-race DatabaseReplicated::startupTables()/canExecuteReplicatedMetadataAlter() [#52490](https://github.com/ClickHouse/ClickHouse/pull/52490) ([Azat Khuzhin](https://github.com/azat)).
* Fix abort in function `transform` [#52513](https://github.com/ClickHouse/ClickHouse/pull/52513) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fix lightweight delete after drop of projection [#52517](https://github.com/ClickHouse/ClickHouse/pull/52517) ([Anton Popov](https://github.com/CurtizJ)).
* Fix possible error "Cannot drain connections: cancel first" [#52585](https://github.com/ClickHouse/ClickHouse/pull/52585) ([Kruglov Pavel](https://github.com/Avogar)).
