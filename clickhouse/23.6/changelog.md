<h3 id="236">
  <a id="236" /> ClickHouse release 23.6, 2023-06-29. [Presentation](https://presentations.clickhouse.com/2023-release-23.6/), [Video](https://www.youtube.com/watch?v=cuf_hYn7dqU)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/cuf_hYn7dqU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-6">
  Backward Incompatible Change
</h4>

* Delete feature `do_not_evict_index_and_mark_files` in the fs cache. This feature was only making things worse. [#51253](https://github.com/ClickHouse/ClickHouse/pull/51253) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Remove ALTER support for experimental LIVE VIEW. [#51287](https://github.com/ClickHouse/ClickHouse/pull/51287) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Decrease the default values for `http_max_field_value_size` and `http_max_field_name_size` to 128 KiB. [#51163](https://github.com/ClickHouse/ClickHouse/pull/51163) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* CGroups metrics related to CPU are replaced with one metric, `CGroupMaxCPU` for better usability. The `Normalized` CPU usage metrics will be normalized to CGroups limits instead of the total number of CPUs when they are set. This closes [#50836](https://github.com/ClickHouse/ClickHouse/issues/50836). [#50835](https://github.com/ClickHouse/ClickHouse/pull/50835) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="new-feature-6">
  New Feature
</h4>

* The function `transform` as well as `CASE` with value matching started to support all data types. This closes [#29730](https://github.com/ClickHouse/ClickHouse/issues/29730). This closes [#32387](https://github.com/ClickHouse/ClickHouse/issues/32387). This closes [#50827](https://github.com/ClickHouse/ClickHouse/issues/50827). This closes [#31336](https://github.com/ClickHouse/ClickHouse/issues/31336). This closes [#40493](https://github.com/ClickHouse/ClickHouse/issues/40493). [#51351](https://github.com/ClickHouse/ClickHouse/pull/51351) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Added option `--rename_files_after_processing <pattern>`. This closes [#34207](https://github.com/ClickHouse/ClickHouse/issues/34207). [#49626](https://github.com/ClickHouse/ClickHouse/pull/49626) ([alekseygolub](https://github.com/alekseygolub)).
* Add support for `TRUNCATE` modifier in `INTO OUTFILE` clause. Suggest using `APPEND` or `TRUNCATE` for `INTO OUTFILE` when file exists. [#50950](https://github.com/ClickHouse/ClickHouse/pull/50950) ([alekar](https://github.com/alekar)).
* Add table engine `Redis` and table function `redis`. It allows querying external Redis servers. [#50150](https://github.com/ClickHouse/ClickHouse/pull/50150) ([JackyWoo](https://github.com/JackyWoo)).
* Allow to skip empty files in file/s3/url/hdfs table functions using settings `s3_skip_empty_files`, `hdfs_skip_empty_files`, `engine_file_skip_empty_files`, `engine_url_skip_empty_files`. [#50364](https://github.com/ClickHouse/ClickHouse/pull/50364) ([Kruglov Pavel](https://github.com/Avogar)).
* Add a new setting named `use_mysql_types_in_show_columns` to alter the `SHOW COLUMNS` SQL statement to display MySQL equivalent types when a client is connected via the MySQL compatibility port. [#49577](https://github.com/ClickHouse/ClickHouse/pull/49577) ([Thomas Panetti](https://github.com/tpanetti)).
* Clickhouse-client can now be called with a connection string instead of "--host", "--port", "--user" etc. [#50689](https://github.com/ClickHouse/ClickHouse/pull/50689) ([Alexey Gerasimchuck](https://github.com/Demilivor)).
* Add setting `session_timezone`; it is used as the default timezone for a session when not explicitly specified. [#44149](https://github.com/ClickHouse/ClickHouse/pull/44149) ([Andrey Zvonov](https://github.com/zvonand)).
* Codec DEFLATE\_QPL is now controlled via server setting "enable\_deflate\_qpl\_codec" (default: false) instead of setting "allow\_experimental\_codecs". This marks DEFLATE\_QPL non-experimental. [#50775](https://github.com/ClickHouse/ClickHouse/pull/50775) ([Robert Schulze](https://github.com/rschu1ze)).

<h4 id="performance-improvement-6">
  Performance Improvement
</h4>

* Improved scheduling of merge selecting and cleanup tasks in `ReplicatedMergeTree`. The tasks will not be executed too frequently when there's nothing to merge or cleanup. Added settings `max_merge_selecting_sleep_ms`, `merge_selecting_sleep_slowdown_factor`, `max_cleanup_delay_period` and `cleanup_thread_preferred_points_per_iteration`. It should close [#31919](https://github.com/ClickHouse/ClickHouse/issues/31919). [#50107](https://github.com/ClickHouse/ClickHouse/pull/50107) ([Alexander Tokmakov](https://github.com/tavplubix)).
* Make filter push down through cross join. [#50605](https://github.com/ClickHouse/ClickHouse/pull/50605) ([Han Fei](https://github.com/hanfei1991)).
* Improve performance with enabled QueryProfiler using thread-local timer\_id instead of global object. [#48778](https://github.com/ClickHouse/ClickHouse/pull/48778) ([Jiebin Sun](https://github.com/jiebinn)).
* Rewrite CapnProto input/output format to improve its performance. Map column names and CapnProto fields case insensitive, fix reading/writing of nested structure fields. [#49752](https://github.com/ClickHouse/ClickHouse/pull/49752) ([Kruglov Pavel](https://github.com/Avogar)).
* Optimize parquet write performance for parallel threads. [#50102](https://github.com/ClickHouse/ClickHouse/pull/50102) ([Hongbin Ma](https://github.com/binmahone)).
* Disable `parallelize_output_from_storages` for processing MATERIALIZED VIEWs and storages with one block only. [#50214](https://github.com/ClickHouse/ClickHouse/pull/50214) ([Azat Khuzhin](https://github.com/azat)).
* Merge PR [#46558](https://github.com/ClickHouse/ClickHouse/pull/46558). Avoid block permutation during sort if the block is already sorted. [#50697](https://github.com/ClickHouse/ClickHouse/pull/50697) ([Alexey Milovidov](https://github.com/alexey-milovidov), [Maksim Kita](https://github.com/kitaisreal)).
* Make multiple list requests to ZooKeeper in parallel to speed up reading from system.zookeeper table. [#51042](https://github.com/ClickHouse/ClickHouse/pull/51042) ([Alexander Gololobov](https://github.com/davenger)).
* Speedup initialization of DateTime lookup tables for time zones. This should reduce startup/connect time of clickhouse-client especially in debug build as it is rather heavy. [#51347](https://github.com/ClickHouse/ClickHouse/pull/51347) ([Alexander Gololobov](https://github.com/davenger)).
* Fix data lakes slowness because of synchronous head requests. (Related to Iceberg/Deltalake/Hudi being slow with a lot of files). [#50976](https://github.com/ClickHouse/ClickHouse/pull/50976) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Do not read all the columns from right GLOBAL JOIN table. [#50721](https://github.com/ClickHouse/ClickHouse/pull/50721) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).

<h4 id="experimental-feature-3">
  Experimental Feature
</h4>

* Support parallel replicas with the analyzer. [#50441](https://github.com/ClickHouse/ClickHouse/pull/50441) ([Raúl Marín](https://github.com/Algunenano)).
* Add random sleep before large merges/mutations execution to split load more evenly between replicas in case of zero-copy replication. [#51282](https://github.com/ClickHouse/ClickHouse/pull/51282) ([alesapin](https://github.com/alesapin)).
* Do not replicate `ALTER PARTITION` queries and mutations through `Replicated` database if it has only one shard and the underlying table is `ReplicatedMergeTree`. [#51049](https://github.com/ClickHouse/ClickHouse/pull/51049) ([Alexander Tokmakov](https://github.com/tavplubix)).

<h4 id="improvement-6">
  Improvement
</h4>

* Relax the thresholds for "too many parts" to be more modern. Return the backpressure during long-running insert queries. [#50856](https://github.com/ClickHouse/ClickHouse/pull/50856) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Allow to cast IPv6 to IPv4 address for CIDR ::ffff:0:0/96 (IPv4-mapped addresses). [#49759](https://github.com/ClickHouse/ClickHouse/pull/49759) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* Update MongoDB protocol to support MongoDB 5.1 version and newer. Support for the versions with the old protocol (\<3.6) is preserved. Closes [#45621](https://github.com/ClickHouse/ClickHouse/issues/45621), [#49879](https://github.com/ClickHouse/ClickHouse/issues/49879). [#50061](https://github.com/ClickHouse/ClickHouse/pull/50061) ([Nikolay Degterinsky](https://github.com/evillique)).
* Add setting `input_format_max_bytes_to_read_for_schema_inference` to limit the number of bytes to read in schema inference. Closes [#50577](https://github.com/ClickHouse/ClickHouse/issues/50577). [#50592](https://github.com/ClickHouse/ClickHouse/pull/50592) ([Kruglov Pavel](https://github.com/Avogar)).
* Respect setting `input_format_null_as_default` in schema inference. [#50602](https://github.com/ClickHouse/ClickHouse/pull/50602) ([Kruglov Pavel](https://github.com/Avogar)).
* Allow to skip trailing empty lines in CSV/TSV/CustomSeparated formats via settings `input_format_csv_skip_trailing_empty_lines`, `input_format_tsv_skip_trailing_empty_lines` and `input_format_custom_skip_trailing_empty_lines` (disabled by default). Closes [#49315](https://github.com/ClickHouse/ClickHouse/issues/49315). [#50635](https://github.com/ClickHouse/ClickHouse/pull/50635) ([Kruglov Pavel](https://github.com/Avogar)).
* Functions "toDateOrDefault|OrNull" and "accuateCast\[OrDefault|OrNull]" now correctly parse numeric arguments. [#50709](https://github.com/ClickHouse/ClickHouse/pull/50709) ([Dmitry Kardymon](https://github.com/kardymonds)).
* Support CSV with whitespace or `\t` field delimiters, and these delimiters are supported in Spark. [#50712](https://github.com/ClickHouse/ClickHouse/pull/50712) ([KevinyhZou](https://github.com/KevinyhZou)).
* Settings `number_of_mutations_to_delay` and `number_of_mutations_to_throw` are enabled by default now with values 500 and 1000 respectively. [#50726](https://github.com/ClickHouse/ClickHouse/pull/50726) ([Anton Popov](https://github.com/CurtizJ)).
* The dashboard correctly shows missing values. This closes [#50831](https://github.com/ClickHouse/ClickHouse/issues/50831). [#50832](https://github.com/ClickHouse/ClickHouse/pull/50832) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Added the possibility to use date and time arguments in the syslog timestamp format in functions `parseDateTimeBestEffort*` and `parseDateTime64BestEffort*`. [#50925](https://github.com/ClickHouse/ClickHouse/pull/50925) ([Victor Krasnov](https://github.com/sirvickr)).
* Command line parameter "--password" in clickhouse-client can now be specified only once. [#50966](https://github.com/ClickHouse/ClickHouse/pull/50966) ([Alexey Gerasimchuck](https://github.com/Demilivor)).
* Use `hash_of_all_files` from `system.parts` to check identity of parts during on-cluster backups. [#50997](https://github.com/ClickHouse/ClickHouse/pull/50997) ([Vitaly Baranov](https://github.com/vitlibar)).
* The system table zookeeper\_connection connected\_time identifies the time when the connection is established (standard format), and session\_uptime\_elapsed\_seconds is added, which labels the duration of the established connection session (in seconds). [#51026](https://github.com/ClickHouse/ClickHouse/pull/51026) ([郭小龙](https://github.com/guoxiaolongzte)).
* Improve the progress bar for file/s3/hdfs/url table functions by using chunk size from source data and using incremental total size counting in each thread. Fix the progress bar for \*Cluster functions. This closes [#47250](https://github.com/ClickHouse/ClickHouse/issues/47250). [#51088](https://github.com/ClickHouse/ClickHouse/pull/51088) ([Kruglov Pavel](https://github.com/Avogar)).
* Add total\_bytes\_to\_read to the Progress packet in TCP protocol for better Progress bar. [#51158](https://github.com/ClickHouse/ClickHouse/pull/51158) ([Kruglov Pavel](https://github.com/Avogar)).
* Better checking of data parts on disks with filesystem cache. [#51164](https://github.com/ClickHouse/ClickHouse/pull/51164) ([Anton Popov](https://github.com/CurtizJ)).
* Fix sometimes not correct current\_elements\_num in fs cache. [#51242](https://github.com/ClickHouse/ClickHouse/pull/51242) ([Kseniia Sumarokova](https://github.com/kssenii)).

<h4 id="buildtestingpackaging-improvement-6">
  Build/Testing/Packaging Improvement
</h4>

* Add embedded keeper-client to standalone keeper binary. [#50964](https://github.com/ClickHouse/ClickHouse/pull/50964) ([pufit](https://github.com/pufit)).
* Actual LZ4 version is used now. [#50621](https://github.com/ClickHouse/ClickHouse/pull/50621) ([Nikita Taranov](https://github.com/nickitat)).
* ClickHouse server will print the list of changed settings on fatal errors. This closes [#51137](https://github.com/ClickHouse/ClickHouse/issues/51137). [#51138](https://github.com/ClickHouse/ClickHouse/pull/51138) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Allow building ClickHouse with clang-17. [#51300](https://github.com/ClickHouse/ClickHouse/pull/51300) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* [SQLancer](https://github.com/sqlancer/sqlancer) check is considered stable as bugs that were triggered by it are fixed. Now failures of SQLancer check will be reported as failed check status. [#51340](https://github.com/ClickHouse/ClickHouse/pull/51340) ([Ilya Yatsishin](https://github.com/qoega)).
* Split huge `RUN` in Dockerfile into smaller conditional. Install the necessary tools on demand in the same `RUN` layer, and remove them after that. Upgrade the OS only once at the beginning. Use a modern way to check the signed repository. Downgrade the base repo to ubuntu:20.04 to address the issues on older docker versions. Upgrade golang version to address golang vulnerabilities. [#51504](https://github.com/ClickHouse/ClickHouse/pull/51504) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-6">
  Bug Fix (user-visible misbehavior in an official stable release)
</h4>

* Report loading status for executable dictionaries correctly [#48775](https://github.com/ClickHouse/ClickHouse/pull/48775) ([Anton Kozlov](https://github.com/tonickkozlov)).
* Proper mutation of skip indices and projections [#50104](https://github.com/ClickHouse/ClickHouse/pull/50104) ([Amos Bird](https://github.com/amosbird)).
* Cleanup moving parts [#50489](https://github.com/ClickHouse/ClickHouse/pull/50489) ([vdimir](https://github.com/vdimir)).
* Fix backward compatibility for IP types hashing in aggregate functions [#50551](https://github.com/ClickHouse/ClickHouse/pull/50551) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* Fix Log family table return wrong rows count after truncate [#50585](https://github.com/ClickHouse/ClickHouse/pull/50585) ([flynn](https://github.com/ucasfl)).
* Fix bug in `uniqExact` parallel merging [#50590](https://github.com/ClickHouse/ClickHouse/pull/50590) ([Nikita Taranov](https://github.com/nickitat)).
* Revert recent grace hash join changes [#50699](https://github.com/ClickHouse/ClickHouse/pull/50699) ([vdimir](https://github.com/vdimir)).
* Query Cache: Try to fix bad cast from `ColumnConst` to `ColumnVector<char8_t>` [#50704](https://github.com/ClickHouse/ClickHouse/pull/50704) ([Robert Schulze](https://github.com/rschu1ze)).
* Avoid storing logs in Keeper containing unknown operation [#50751](https://github.com/ClickHouse/ClickHouse/pull/50751) ([Antonio Andelic](https://github.com/antonio2368)).
* SummingMergeTree support for DateTime64 [#50797](https://github.com/ClickHouse/ClickHouse/pull/50797) ([Jordi Villar](https://github.com/jrdi)).
* Add compatibility setting for non-const timezones [#50834](https://github.com/ClickHouse/ClickHouse/pull/50834) ([Robert Schulze](https://github.com/rschu1ze)).
* Fix hashing of LDAP params in the cache entries [#50865](https://github.com/ClickHouse/ClickHouse/pull/50865) ([Julian Maicher](https://github.com/jmaicher)).
* Fallback to parsing big integer from String instead of exception in Parquet format [#50873](https://github.com/ClickHouse/ClickHouse/pull/50873) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix checking the lock file too often while writing a backup [#50889](https://github.com/ClickHouse/ClickHouse/pull/50889) ([Vitaly Baranov](https://github.com/vitlibar)).
* Do not apply projection if read-in-order was enabled. [#50923](https://github.com/ClickHouse/ClickHouse/pull/50923) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix race in the Azure blob storage iterator [#50936](https://github.com/ClickHouse/ClickHouse/pull/50936) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* Fix erroneous `sort_description` propagation in `CreatingSets` [#50955](https://github.com/ClickHouse/ClickHouse/pull/50955) ([Nikita Taranov](https://github.com/nickitat)).
* Fix Iceberg v2 optional metadata parsing [#50974](https://github.com/ClickHouse/ClickHouse/pull/50974) ([Kseniia Sumarokova](https://github.com/kssenii)).
* MaterializedMySQL: Keep parentheses for empty table overrides [#50977](https://github.com/ClickHouse/ClickHouse/pull/50977) ([Val Doroshchuk](https://github.com/valbok)).
* Fix crash in BackupCoordinationStageSync::setError() [#51012](https://github.com/ClickHouse/ClickHouse/pull/51012) ([Vitaly Baranov](https://github.com/vitlibar)).
* Fix subtly broken copy-on-write of ColumnLowCardinality dictionary [#51064](https://github.com/ClickHouse/ClickHouse/pull/51064) ([Michael Kolupaev](https://github.com/al13n321)).
* Generate safe IVs [#51086](https://github.com/ClickHouse/ClickHouse/pull/51086) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* Fix ineffective query cache for SELECTs with subqueries [#51132](https://github.com/ClickHouse/ClickHouse/pull/51132) ([Robert Schulze](https://github.com/rschu1ze)).
* Fix Set index with constant nullable comparison. [#51205](https://github.com/ClickHouse/ClickHouse/pull/51205) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix a crash in s3 and s3Cluster functions [#51209](https://github.com/ClickHouse/ClickHouse/pull/51209) ([Nikolay Degterinsky](https://github.com/evillique)).
* Fix a crash with compiled expressions [#51231](https://github.com/ClickHouse/ClickHouse/pull/51231) ([LiuNeng](https://github.com/liuneng1994)).
* Fix use-after-free in StorageURL when switching URLs [#51260](https://github.com/ClickHouse/ClickHouse/pull/51260) ([Michael Kolupaev](https://github.com/al13n321)).
* Updated check for parameterized view [#51272](https://github.com/ClickHouse/ClickHouse/pull/51272) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* Fix multiple writing of same file to backup [#51299](https://github.com/ClickHouse/ClickHouse/pull/51299) ([Vitaly Baranov](https://github.com/vitlibar)).
* Fix fuzzer failure in ActionsDAG [#51301](https://github.com/ClickHouse/ClickHouse/pull/51301) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Remove garbage from function `transform` [#51350](https://github.com/ClickHouse/ClickHouse/pull/51350) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
