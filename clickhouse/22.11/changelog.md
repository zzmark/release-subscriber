<h3 id="a-id2211a-clickhouse-release-2211-2022-11-17">
  <a id="2211" /> ClickHouse release 22.11, 2022-11-17. [Presentation](https://presentations.clickhouse.com/2022-release-22.11/), [Video](https://www.youtube.com/watch?v=LR-fckOOaFo)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/LR-fckOOaFo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change">
  Backward Incompatible Change
</h4>

* `JSONExtract` family of functions will now attempt to coerce to the requested type. [#41502](https://github.com/ClickHouse/ClickHouse/pull/41502) ([Márcio Martins](https://github.com/marcioapm)).

<h4 id="new-feature-1">
  New Feature
</h4>

* Adds support for retries during INSERTs into ReplicatedMergeTree when a session with ClickHouse Keeper is lost. Apart from fault tolerance, it aims to provide better user experience, - avoid returning a user an error during insert if keeper is restarted (for example, due to upgrade). [#42607](https://github.com/ClickHouse/ClickHouse/pull/42607) ([Igor Nikonov](https://github.com/devcrafter)).
* Add `Hudi` and `DeltaLake` table engines, read-only, only for tables on S3. [#41054](https://github.com/ClickHouse/ClickHouse/pull/41054) ([Daniil Rubin](https://github.com/rubin-do), [Kseniia Sumarokova](https://github.com/kssenii)).
* Add table function `hudi` and `deltaLake`. [#43080](https://github.com/ClickHouse/ClickHouse/pull/43080) ([flynn](https://github.com/ucasfl)).
* Support for composite time intervals. 1. Add, subtract and negate operations are now available on Intervals. In the case where the types of Intervals are different, they will be transformed into the Tuple of those types. 2. A tuple of intervals can be added to or subtracted from a Date/DateTime field. 3. Added parsing of Intervals with different types, for example: `INTERVAL '1 HOUR 1 MINUTE 1 SECOND'`. [#42195](https://github.com/ClickHouse/ClickHouse/pull/42195) ([Nikolay Degterinsky](https://github.com/evillique)).
* Added `**` glob support for recursive directory traversal of the filesystem and S3. Resolves [#36316](https://github.com/ClickHouse/ClickHouse/issues/36316). [#42376](https://github.com/ClickHouse/ClickHouse/pull/42376) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* Introduce `s3_plain` disk type for write-once-read-many operations. Implement `ATTACH` of `MergeTree` table for `s3_plain` disk. [#42628](https://github.com/ClickHouse/ClickHouse/pull/42628) ([Azat Khuzhin](https://github.com/azat)).
* Added applied row-level policies to `system.query_log`. [#39819](https://github.com/ClickHouse/ClickHouse/pull/39819) ([Vladimir Chebotaryov](https://github.com/quickhouse)).
* Add four-letter command `csnp` for manually creating snapshots in ClickHouse Keeper. Additionally, `lgif` was added to get Raft information for a specific node (e.g. index of last created snapshot, last committed log index). [#41766](https://github.com/ClickHouse/ClickHouse/pull/41766) ([JackyWoo](https://github.com/JackyWoo)).
* Add function `ascii` like in Apache Spark: [https://spark.apache.org/docs/latest/api/sql/#ascii](https://spark.apache.org/docs/latest/api/sql/#ascii). [#42670](https://github.com/ClickHouse/ClickHouse/pull/42670) ([李扬](https://github.com/taiyang-li)).
* Add function `pmod` which returns non-negative result based on modulo. [#42755](https://github.com/ClickHouse/ClickHouse/pull/42755) ([李扬](https://github.com/taiyang-li)).
* Add function `formatReadableDecimalSize`. [#42774](https://github.com/ClickHouse/ClickHouse/pull/42774) ([Alejandro](https://github.com/alexon1234)).
* Add function `randCanonical`, which is similar to the `rand` function in Apache Spark or Impala. The function generates pseudo random results with independent and identically distributed uniformly distributed values in \[0, 1). [#43124](https://github.com/ClickHouse/ClickHouse/pull/43124) ([李扬](https://github.com/taiyang-li)).
* Add function `displayName`, closes [#36770](https://github.com/ClickHouse/ClickHouse/issues/36770). [#37681](https://github.com/ClickHouse/ClickHouse/pull/37681) ([hongbin](https://github.com/xlwh)).
* Add `min_age_to_force_merge_on_partition_only` setting to optimize old parts for the entire partition only. [#42659](https://github.com/ClickHouse/ClickHouse/pull/42659) ([Antonio Andelic](https://github.com/antonio2368)).
* Add generic implementation for arbitrary structured named collections, access type and `system.named_collections`. [#43147](https://github.com/ClickHouse/ClickHouse/pull/43147) ([Kseniia Sumarokova](https://github.com/kssenii)).

<h4 id="performance-improvement-1">
  Performance Improvement
</h4>

* `match` function can use the index if it's a condition on string prefix. This closes [#37333](https://github.com/ClickHouse/ClickHouse/issues/37333). [#42458](https://github.com/ClickHouse/ClickHouse/pull/42458) ([clarkcaoliu](https://github.com/Clark0)).
* Speed up AND and OR operators when they are sequenced. [#42214](https://github.com/ClickHouse/ClickHouse/pull/42214) ([Zhiguo Zhou](https://github.com/ZhiguoZh)).
* Support parallel parsing for `LineAsString` input format. This improves performance just slightly. This closes [#42502](https://github.com/ClickHouse/ClickHouse/issues/42502). [#42780](https://github.com/ClickHouse/ClickHouse/pull/42780) ([Kruglov Pavel](https://github.com/Avogar)).
* ClickHouse Keeper performance improvement: improve commit performance for cases when many different nodes have uncommitted states. This should help with cases when a follower node can't sync fast enough. [#42926](https://github.com/ClickHouse/ClickHouse/pull/42926) ([Antonio Andelic](https://github.com/antonio2368)).
* A condition like `NOT LIKE 'prefix%'` can use the primary index. [#42209](https://github.com/ClickHouse/ClickHouse/pull/42209) ([Duc Canh Le](https://github.com/canhld94)).

<h4 id="experimental-feature-1">
  Experimental Feature
</h4>

* Support type `Object` inside other types, e.g. `Array(JSON)`. [#36969](https://github.com/ClickHouse/ClickHouse/pull/36969) ([Anton Popov](https://github.com/CurtizJ)).
* Ignore MySQL binlog SAVEPOINT event for MaterializedMySQL. [#42931](https://github.com/ClickHouse/ClickHouse/pull/42931) ([zzsmdfj](https://github.com/zzsmdfj)). Handle (ignore) SAVEPOINT queries in MaterializedMySQL. [#43086](https://github.com/ClickHouse/ClickHouse/pull/43086) ([Stig Bakken](https://github.com/stigsb)).

<h4 id="improvement-1">
  Improvement
</h4>

* Trivial queries with small LIMIT will properly determine the number of estimated rows to read, so that the threshold will be checked properly. Closes [#7071](https://github.com/ClickHouse/ClickHouse/issues/7071). [#42580](https://github.com/ClickHouse/ClickHouse/pull/42580) ([Han Fei](https://github.com/hanfei1991)).
* Add support for interactive parameters in INSERT VALUES queries. [#43077](https://github.com/ClickHouse/ClickHouse/pull/43077) ([Nikolay Degterinsky](https://github.com/evillique)).
* Added new field `allow_readonly` in `system.table_functions` to allow using table functions in readonly mode. Resolves [#42414](https://github.com/ClickHouse/ClickHouse/issues/42414) Implementation: \* Added a new field allow\_readonly to table system.table\_functions. \* Updated to use new field allow\_readonly to allow using table functions in readonly mode. Testing: \* Added a test for filesystem tests/queries/0\_stateless/02473\_functions\_in\_readonly\_mode.sh Documentation: \* Updated the english documentation for Table Functions. [#42708](https://github.com/ClickHouse/ClickHouse/pull/42708) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* The `system.asynchronous_metrics` gets embedded documentation. This documentation is also exported to Prometheus. Fixed an error with the metrics about `cache` disks - they were calculated only for one arbitrary cache disk instead all of them. This closes [#7644](https://github.com/ClickHouse/ClickHouse/issues/7644). [#43194](https://github.com/ClickHouse/ClickHouse/pull/43194) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Throttling algorithm changed to token bucket. [#42665](https://github.com/ClickHouse/ClickHouse/pull/42665) ([Sergei Trifonov](https://github.com/serxa)).
* Mask passwords and secret keys both in `system.query_log` and `/var/log/clickhouse-server/*.log` and also in error messages. [#42484](https://github.com/ClickHouse/ClickHouse/pull/42484) ([Vitaly Baranov](https://github.com/vitlibar)).
* Remove covered parts for fetched part (to avoid possible replication delay grows). [#39737](https://github.com/ClickHouse/ClickHouse/pull/39737) ([Azat Khuzhin](https://github.com/azat)).
* If `/dev/tty` is available, the progress in clickhouse-client and clickhouse-local will be rendered directly to the terminal, without writing to STDERR. It allows getting progress even if STDERR is redirected to a file, and the file will not be polluted by terminal escape sequences. The progress can be disabled by `--progress false`. This closes [#32238](https://github.com/ClickHouse/ClickHouse/issues/32238). [#42003](https://github.com/ClickHouse/ClickHouse/pull/42003) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add support for `FixedString` input to base64 coding functions. [#42285](https://github.com/ClickHouse/ClickHouse/pull/42285) ([ltrk2](https://github.com/ltrk2)).
* Add columns `bytes_on_disk` and `path` to `system.detached_parts`. Closes [#42264](https://github.com/ClickHouse/ClickHouse/issues/42264). [#42303](https://github.com/ClickHouse/ClickHouse/pull/42303) ([chen](https://github.com/xiedeyantu)).
* Improve using structure from insertion table in table functions, now setting `use_structure_from_insertion_table_in_table_functions` has new possible value - `2` that means that ClickHouse will try to determine if we can use structure from insertion table or not automatically. Closes [#40028](https://github.com/ClickHouse/ClickHouse/issues/40028). [#42320](https://github.com/ClickHouse/ClickHouse/pull/42320) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix no progress indication on INSERT FROM INFILE. Closes [#42548](https://github.com/ClickHouse/ClickHouse/issues/42548). [#42634](https://github.com/ClickHouse/ClickHouse/pull/42634) ([chen](https://github.com/xiedeyantu)).
* Refactor function `tokens` to enable max tokens returned for related functions (disabled by default). [#42673](https://github.com/ClickHouse/ClickHouse/pull/42673) ([李扬](https://github.com/taiyang-li)).
* Allow to use `Date32` arguments for `formatDateTime` and `FROM_UNIXTIME` functions. [#42737](https://github.com/ClickHouse/ClickHouse/pull/42737) ([Roman Vasin](https://github.com/rvasin)).
* Update tzdata to 2022f. Mexico will no longer observe DST except near the US border: [https://www.timeanddate.com/news/time/mexico-abolishes-dst-2022.html](https://www.timeanddate.com/news/time/mexico-abolishes-dst-2022.html). Chihuahua moves to year-round UTC-6 on 2022-10-30. Fiji no longer observes DST. See [https://github.com/google/cctz/pull/235](https://github.com/google/cctz/pull/235) and [https://bugs.launchpad.net/ubuntu/+source/tzdata/+bug/1995209](https://bugs.launchpad.net/ubuntu/+source/tzdata/+bug/1995209). [#42796](https://github.com/ClickHouse/ClickHouse/pull/42796) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Add `FailedAsyncInsertQuery` event metric for async inserts. [#42814](https://github.com/ClickHouse/ClickHouse/pull/42814) ([Krzysztof Góralski](https://github.com/kgoralski)).
* Implement `read-in-order` optimization on top of query plan. It is enabled by default. Set `query_plan_read_in_order = 0` to use previous AST-based version. [#42829](https://github.com/ClickHouse/ClickHouse/pull/42829) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Increase the size of upload part exponentially for backup to S3 to avoid errors about max 10 000 parts limit of the multipart upload to s3. [#42833](https://github.com/ClickHouse/ClickHouse/pull/42833) ([Vitaly Baranov](https://github.com/vitlibar)).
* When the merge task is continuously busy and the disk space is insufficient, the completely expired parts cannot be selected and dropped, resulting in insufficient disk space. My idea is that when the entire Part expires, there is no need for additional disk space to guarantee, ensure the normal execution of TTL. [#42869](https://github.com/ClickHouse/ClickHouse/pull/42869) ([zhongyuankai](https://github.com/zhongyuankai)).
* Add `oss` function and `OSS` table engine (this is convenient for users). oss is fully compatible with s3. [#43155](https://github.com/ClickHouse/ClickHouse/pull/43155) ([zzsmdfj](https://github.com/zzsmdfj)).
* Improve error reporting in the collection of OS-related info for the `system.asynchronous_metrics` table. [#43192](https://github.com/ClickHouse/ClickHouse/pull/43192) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Modify the `INFORMATION_SCHEMA` tables in a way so that ClickHouse can connect to itself using the MySQL compatibility protocol. Add columns instead of aliases (related to [#9769](https://github.com/ClickHouse/ClickHouse/issues/9769)). It will improve the compatibility with various MySQL clients. [#43198](https://github.com/ClickHouse/ClickHouse/pull/43198) ([Filatenkov Artur](https://github.com/FArthur-cmd)).
* Add some functions for compatibility with PowerBI, when it connects using MySQL protocol [#42612](https://github.com/ClickHouse/ClickHouse/pull/42612) ([Filatenkov Artur](https://github.com/FArthur-cmd)).
* Better usability for Dashboard on changes [#42872](https://github.com/ClickHouse/ClickHouse/pull/42872) ([Vladimir C](https://github.com/vdimir)).

<h4 id="buildtestingpackaging-improvement-1">
  Build/Testing/Packaging Improvement
</h4>

* Run SQLancer for each pull request and commit to master. [SQLancer](https://github.com/sqlancer/sqlancer) is an OpenSource fuzzer that focuses on automatic detection of logical bugs. [#42397](https://github.com/ClickHouse/ClickHouse/pull/42397) ([Ilya Yatsishin](https://github.com/qoega)).
* Update to latest zlib-ng. [#42463](https://github.com/ClickHouse/ClickHouse/pull/42463) ([Boris Kuschel](https://github.com/bkuschel)).
* Add support for testing ClickHouse server with Jepsen. By the way, we already have support for testing ClickHouse Keeper with Jepsen. This pull request extends it to Replicated tables. [#42619](https://github.com/ClickHouse/ClickHouse/pull/42619) ([Antonio Andelic](https://github.com/antonio2368)).
* Use [https://github.com/matus-chochlik/ctcache](https://github.com/matus-chochlik/ctcache) for clang-tidy results caching. [#42913](https://github.com/ClickHouse/ClickHouse/pull/42913) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* Before the fix, the user-defined config was preserved by RPM in `$file.rpmsave`. The PR fixes it and won't replace the user's files from packages. [#42936](https://github.com/ClickHouse/ClickHouse/pull/42936) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* Remove some libraries from Ubuntu Docker image. [#42622](https://github.com/ClickHouse/ClickHouse/pull/42622) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="bug-fix-user-visible-misbehavior-in-official-stable-or-prestable-release-1">
  Bug Fix (user-visible misbehavior in official stable or prestable release)
</h4>

* Updated normaliser to clone the alias ast. Resolves [#42452](https://github.com/ClickHouse/ClickHouse/issues/42452) Implementation: \* Updated QueryNormalizer to clone alias ast, when its replaced. Previously just assigning the same leads to exception in LogicalExpressinsOptimizer as it would be the same parent being inserted again. \* This bug is not seen with new analyser (allow\_experimental\_analyzer), so no changes for it. I added a test for the same. [#42827](https://github.com/ClickHouse/ClickHouse/pull/42827) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* Fix race for backup of tables in `Lazy` databases. [#43104](https://github.com/ClickHouse/ClickHouse/pull/43104) ([Vitaly Baranov](https://github.com/vitlibar)).
* Fix for `skip_unavailable_shards`: it did not work with the `s3Cluster` table function. [#43131](https://github.com/ClickHouse/ClickHouse/pull/43131) ([chen](https://github.com/xiedeyantu)).
* Fix schema inference in `s3Cluster` and improvement in `hdfsCluster`. [#41979](https://github.com/ClickHouse/ClickHouse/pull/41979) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix retries while reading from URL table engines / table function. (retriable errors could be retries more times than needed, non-retriable errors resulted in failed assertion in code). [#42224](https://github.com/ClickHouse/ClickHouse/pull/42224) ([Kseniia Sumarokova](https://github.com/kssenii)).
* A segmentation fault related to DNS & c-ares has been reported and fixed. [#42234](https://github.com/ClickHouse/ClickHouse/pull/42234) ([Arthur Passos](https://github.com/arthurpassos)).
* Fix `LOGICAL_ERROR` `Arguments of 'plus' have incorrect data types` which may happen in PK analysis (monotonicity check). Fix invalid PK analysis for monotonic binary functions with first constant argument. [#42410](https://github.com/ClickHouse/ClickHouse/pull/42410) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* Fix incorrect key analysis when key types cannot be inside Nullable. This fixes [#42456](https://github.com/ClickHouse/ClickHouse/issues/42456). [#42469](https://github.com/ClickHouse/ClickHouse/pull/42469) ([Amos Bird](https://github.com/amosbird)).
* Fix typo in a setting name that led to bad usage of schema inference cache while using setting `input_format_csv_use_best_effort_in_schema_inference`. Closes [#41735](https://github.com/ClickHouse/ClickHouse/issues/41735). [#42536](https://github.com/ClickHouse/ClickHouse/pull/42536) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix creating a Set with wrong header when data type is LowCardinality. Closes [#42460](https://github.com/ClickHouse/ClickHouse/issues/42460). [#42579](https://github.com/ClickHouse/ClickHouse/pull/42579) ([flynn](https://github.com/ucasfl)).
* `(U)Int128` and `(U)Int256` values were correctly checked in `PREWHERE`. [#42605](https://github.com/ClickHouse/ClickHouse/pull/42605) ([Antonio Andelic](https://github.com/antonio2368)).
* Fix a bug in functions parser that could have led to a segmentation fault. [#42724](https://github.com/ClickHouse/ClickHouse/pull/42724) ([Nikolay Degterinsky](https://github.com/evillique)).
* Fix the locking in `truncate table`. [#42728](https://github.com/ClickHouse/ClickHouse/pull/42728) ([flynn](https://github.com/ucasfl)).
* Fix possible crash in `web` disks when file does not exist (or `OPTIMIZE TABLE FINAL`, that also can got the same error eventually). [#42767](https://github.com/ClickHouse/ClickHouse/pull/42767) ([Azat Khuzhin](https://github.com/azat)).
* Fix `auth_type` mapping in `system.session_log`, by including `SSL_CERTIFICATE` for the enum values. [#42782](https://github.com/ClickHouse/ClickHouse/pull/42782) ([Miel Donkers](https://github.com/mdonkers)).
* Fix stack-use-after-return under ASAN build in the Create User query parser. [#42804](https://github.com/ClickHouse/ClickHouse/pull/42804) ([Nikolay Degterinsky](https://github.com/evillique)).
* Fix `lowerUTF8`/`upperUTF8` in case of symbol was in between 16-byte boundary (very frequent case of you have strings > 16 bytes long). [#42812](https://github.com/ClickHouse/ClickHouse/pull/42812) ([Azat Khuzhin](https://github.com/azat)).
* Additional bound check was added to LZ4 decompression routine to fix misbehaviour in case of malformed input. [#42868](https://github.com/ClickHouse/ClickHouse/pull/42868) ([Nikita Taranov](https://github.com/nickitat)).
* Fix rare possible hang on query cancellation. [#42874](https://github.com/ClickHouse/ClickHouse/pull/42874) ([Azat Khuzhin](https://github.com/azat)).
* Fix incorrect behavior with multiple disjuncts in hash join, close [#42832](https://github.com/ClickHouse/ClickHouse/issues/42832). [#42876](https://github.com/ClickHouse/ClickHouse/pull/42876) ([Vladimir C](https://github.com/vdimir)).
* A null pointer will be generated when select if as from 'three table join' , For example, this SQL query: [#42883](https://github.com/ClickHouse/ClickHouse/pull/42883) ([zzsmdfj](https://github.com/zzsmdfj)).
* Fix memory sanitizer report in Cluster Discovery, close [#42763](https://github.com/ClickHouse/ClickHouse/issues/42763). [#42905](https://github.com/ClickHouse/ClickHouse/pull/42905) ([Vladimir C](https://github.com/vdimir)).
* Improve DateTime schema inference in case of empty string. [#42911](https://github.com/ClickHouse/ClickHouse/pull/42911) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix rare NOT\_FOUND\_COLUMN\_IN\_BLOCK error when projection is possible to use but there is no projection available. This fixes [#42771](https://github.com/ClickHouse/ClickHouse/issues/42771) . The bug was introduced in [https://github.com/ClickHouse/ClickHouse/pull/25563](https://github.com/ClickHouse/ClickHouse/pull/25563). [#42938](https://github.com/ClickHouse/ClickHouse/pull/42938) ([Amos Bird](https://github.com/amosbird)).
* Fix ATTACH TABLE in `PostgreSQL` database engine if the table contains DATETIME data type. Closes [#42817](https://github.com/ClickHouse/ClickHouse/issues/42817). [#42960](https://github.com/ClickHouse/ClickHouse/pull/42960) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Fix lambda parsing. Closes [#41848](https://github.com/ClickHouse/ClickHouse/issues/41848). [#42979](https://github.com/ClickHouse/ClickHouse/pull/42979) ([Nikolay Degterinsky](https://github.com/evillique)).
* Fix incorrect key analysis when nullable keys appear in the middle of a hyperrectangle. This fixes [#43111](https://github.com/ClickHouse/ClickHouse/issues/43111) . [#43133](https://github.com/ClickHouse/ClickHouse/pull/43133) ([Amos Bird](https://github.com/amosbird)).
* Fix several buffer over-reads in deserialization of carefully crafted aggregate function states. [#43159](https://github.com/ClickHouse/ClickHouse/pull/43159) ([Raúl Marín](https://github.com/Algunenano)).
* Fix function `if` in case of NULL and const Nullable arguments. Closes [#43069](https://github.com/ClickHouse/ClickHouse/issues/43069). [#43178](https://github.com/ClickHouse/ClickHouse/pull/43178) ([Kruglov Pavel](https://github.com/Avogar)).
* Fix decimal math overflow in parsing DateTime with the 'best effort' algorithm. Closes [#43061](https://github.com/ClickHouse/ClickHouse/issues/43061). [#43180](https://github.com/ClickHouse/ClickHouse/pull/43180) ([Kruglov Pavel](https://github.com/Avogar)).
* The `indent` field produced by the `git-import` tool was miscalculated. See [https://clickhouse.com/docs/getting-started/example-datasets/github/](https://clickhouse.com/docs/getting-started/example-datasets/github/). [#43191](https://github.com/ClickHouse/ClickHouse/pull/43191) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Fixed unexpected behaviour of `Interval` types with subquery and casting. [#43193](https://github.com/ClickHouse/ClickHouse/pull/43193) ([jh0x](https://github.com/jh0x)).
