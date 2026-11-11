// Comprehensive Interview Question Bank
export const interviewQuestions = [
  {
    id: 'int-1',
    category: 'HDFS & Distributed Storage',
    level: 'Beginner',
    company: 'Amazon',
    question: 'Explain the HDFS write pipeline step-by-step. Does the client write to 3 DataNodes in parallel?',
    answer: `No, the client does NOT write to 3 DataNodes in parallel. It writes via a sequential pipeline:
1. The client calls DistributedFileSystem.create() to request file creation from the NameNode.
2. The NameNode verifies permissions, checks for duplicate paths, creates a new file entry in its in-memory namespace, and returns an allocated Block ID with a list of 3 candidate DataNodes (e.g. DN1, DN2, DN3) determined by the Rack Awareness placement policy.
3. The client establishes a TCP socket connection directly to the first DataNode (DN1) and begins streaming data in 64 KB packets.
4. As DN1 receives each packet, it writes it to its local disk buffer and simultaneously streams the packet over network to DN2, which writes locally and streams to DN3 in a pipelined fashion (DN1 -> DN2 -> DN3).
5. Acknowledgements (ACKs) flow backward: DN3 sends an ACK to DN2, DN2 sends to DN1, and DN1 sends to the client.
6. Once all packets of the 128 MB block are acknowledged, the client closes the pipeline and repeats the process for the next block.`
  },
  {
    id: 'int-2',
    category: 'HDFS & Distributed Storage',
    level: 'Intermediate',
    company: 'Uber',
    question: 'What is the "Hadoop Small Files Problem" and how does it impact NameNode memory and cluster performance?',
    answer: `In HDFS, each file, directory, and block object requires approximately 150 bytes of JVM heap memory on the NameNode for metadata indexing.
Impact on NameNode: If you store 100 million 10 KB files instead of one hundred 10 GB files, the physical data size is identical (~1 TB), but the 100 million tiny files consume ~30 GB of JVM heap memory on the NameNode. This triggers massive Java Garbage Collection (GC) Stop-the-World pauses, slows down RPC response times, and eventually crashes the NameNode with OutOfMemoryError.
Impact on Compute: In MapReduce and Spark, default InputFormat assigns 1 task per block/file. Having 100,000 small files spawns 100,000 tasks, overwhelming YARN schedulers with task launch overhead where JVM startup time exceeds actual computation time.
Solutions:
1. Batch or consolidate files before writing to HDFS using SequenceFiles or Hadoop Archives (HAR).
2. Run compacting ETL jobs in Spark using df.coalesce() or Delta Lake OPTIMIZE to compact small files into 128MB-512MB Parquet files.
3. Use CombineFileInputFormat to combine multiple small files into a single InputSplit.`
  },
  {
    id: 'int-3',
    category: 'HDFS & Distributed Storage',
    level: 'Advanced',
    company: 'Netflix',
    question: 'How does HDFS High Availability (HA) with Quorum Journal Manager (QJM) and ZooKeeper prevent Split-Brain?',
    answer: `In HDFS HA, two NameNodes (Active and Standby) run concurrently. To prevent Split-Brain (where both NameNodes believe they are Active and accept writes simultaneously, corrupting metadata):
1. Quorum Journal Manager (QJM): Active NameNode appends edits to an odd number of JournalNodes (typically 3 or 5). An edit is only committed if a majority quorum (e.g. 2 out of 3, or 3 out of 5) acknowledges it. Because two disjoint majorities cannot exist simultaneously, only ONE NameNode can successfully write to the JournalNodes.
2. ZooKeeper Failover Controller (ZKFC): Monitors the health of each NameNode. Both ZKFC daemons compete to acquire an ephemeral lock in ZooKeeper (/hadoop-ha/<cluster>/ActiveBreadCrumb). The winner promotes its NameNode to Active.
3. Fencing: Before the Standby NameNode is promoted to Active by ZKFC, it executes a Fencing mechanism:
   - Graceful fencing: Closes active edit stream on JournalNodes.
   - Forced fencing: Sends an SSH kill -9 to the old Active NameNode, or invokes an IPMI/PDU network power switch cut to power off the machine physically. This guarantees the old Active can never commit another transaction.`
  },
  {
    id: 'int-4',
    category: 'Apache Spark',
    level: 'Beginner',
    company: 'Apple',
    question: 'What is the difference between RDD, DataFrame, and Dataset in Apache Spark?',
    answer: `1. RDD (Resilient Distributed Dataset): Low-level, immutable collection of distributed JVM/Python objects. It provides functional compile-time type safety (in Scala/Java), but Spark treats records as opaque objects without schema knowledge. RDDs cannot leverage Catalyst query optimizations and suffer from heavy serialization in Python.
2. DataFrame: A distributed collection of data organized into named columns with a schema (like a table in SQL). DataFrames leverage the Catalyst Optimizer and Project Tungsten off-heap binary memory. Regardless of language (Python, Scala, R, Java), DataFrames run at identical compiled bare-metal speeds.
3. Dataset: Strongly-typed, object-oriented API available in Scala/Java (Dataset[T], e.g. Dataset[Employee]). It combines the compile-time type safety and object-oriented syntax of RDDs with the Catalyst optimization and off-heap encoders of DataFrames. (In Python, because Python is dynamically typed, DataFrame is an alias for Dataset[Row]).`
  },
  {
    id: 'int-5',
    category: 'Apache Spark',
    level: 'Intermediate',
    company: 'Meta',
    question: 'How do you identify and resolve Data Skew in an Apache Spark join?',
    answer: `Identification:
In the Spark Web UI (port 4040), open the Stage Details page. Look at the Task Metrics table: if the 75th percentile task time is 5 seconds, but the Max task time is 45 minutes with a huge Shuffle Read size (e.g. 20 GB vs median 50 MB), you have severe Data Skew on a single straggler task.
Resolutions:
1. Broadcast Hash Join: If one of the joined tables is small (<100MB), use broadcast(small_df). This eliminates the network shuffle completely, avoiding skewed hash partitions.
2. Salting: In the large table, append a random integer (e.g. 0 to 9) to the skewed key: concat(key, '_', rand()*10). In the lookup table, explode the key into 10 copies with suffixes _0 to _9. Join on the salted key: this distributes the skewed records evenly across 10 separate parallel tasks.
3. Adaptive Query Execution (AQE): In Spark 3.x, enable spark.sql.adaptive.skewJoin.enabled = true. Spark monitors runtime shuffle partition sizes; if a partition is larger than 256MB and 5x the median size, AQE automatically splits it into sub-partitions without code changes.`
  },
  {
    id: 'int-6',
    category: 'Apache Spark',
    level: 'Advanced',
    company: 'Databricks',
    question: 'Explain Whole-Stage Code Generation and how Project Tungsten compiles Spark plans into Java bytecode.',
    answer: `In traditional query engines (Volcano Iterator Model), each physical operator (Filter, Project, Aggregate) is an iterator calling next() on its child operator. For 1 billion rows, this involves billions of virtual function dispatches, poor CPU branch prediction, and writing intermediate state to memory, which thrashes CPU L1/L2 caches.
Project Tungsten Whole-Stage Code Generation collapses an entire physical execution pipeline across multiple narrow operators into a single tight loop in compiled Java bytecode:
1. During physical planning, Spark identifies subtrees of operators that have narrow dependencies (no shuffles).
2. It generates a single Java source code class containing a raw "while (records.hasNext())" loop that performs the read, filter, math projection, and hash calculation all in CPU registers and L1 cache.
3. It compiles this Java source code into bytecode at runtime using the Janino compiler.
4. This achieves bare-metal CPU efficiency: zero virtual function call overhead, optimal compiler loop unrolling, and maximum instruction-level parallelism (SIMD).`
  },
  {
    id: 'int-7',
    category: 'Apache Kafka',
    level: 'Beginner',
    company: 'LinkedIn',
    question: 'What is the role of a Kafka Consumer Group and what happens when consumer count exceeds partition count?',
    answer: `A Consumer Group is a collection of consumer instances sharing the same group.id that divide the partitions of a topic among themselves for parallel consumption.
Rule: Each partition of a topic can be assigned to only ONE consumer instance within a specific consumer group at a time.
If you have 4 partitions on a topic:
- If you run 2 consumers: each consumer reads 2 partitions.
- If you run 4 consumers: each consumer reads exactly 1 partition (optimal parallelism).
- If you run 6 consumers: 4 consumers each read 1 partition; the remaining 2 consumers sit completely IDLE with zero partitions assigned, acting as hot standby backups ready to take over if an active consumer crashes.`
  },
  {
    id: 'int-8',
    category: 'Apache Kafka',
    level: 'Intermediate',
    company: 'Stripe',
    question: 'How do you achieve Exactly-Once Semantics (EOS) in an Apache Kafka to Spark streaming pipeline?',
    answer: `Achieving End-to-End Exactly-Once Semantics requires guarantees across Source, Compute, and Sink:
1. Source (Kafka):
   - Producer must enable idempotence (enable.idempotence = true) with acks = all, ensuring no duplicate messages in Kafka partitions.
   - Kafka maintains deterministic, replayable message offsets.
2. Stream Processing (Spark Structured Streaming):
   - Spark Structured Streaming uses Write-Ahead Log (WAL) Checkpointing (checkpointLocation). It records the exact starting and ending Kafka partition offsets processed for each micro-batch into an atomic commit log.
   - If an executor crashes, Spark restarts from the exact committed offset, replaying the micro-batch deterministically.
3. Sink (Target Storage / Database):
   - The sink must be Idempotent or Transactional:
     - Idempotent: UPSERT / MERGE INTO (e.g. Delta Lake or database primary key upserts) where writing the same record twice results in the exact same state.
     - Transactional: Committing the sink write and the checkpoint state inside a single atomic two-phase commit.`
  },
  {
    id: 'int-9',
    category: 'SQL & Analytics',
    level: 'Intermediate',
    company: 'Google',
    question: 'Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() with an example.',
    answer: `Suppose we have employee salaries: [100k, 90k, 90k, 80k]
1. ROW_NUMBER(): Assigns unique sequential integers without regard for ties:
   - 100k -> 1
   - 90k  -> 2
   - 90k  -> 3
   - 80k  -> 4
2. RANK(): Assigns the same rank to identical values, but SKIPS subsequent ranks to reflect how many rows preceded:
   - 100k -> 1
   - 90k  -> 2
   - 90k  -> 2 (Tie)
   - 80k  -> 4 (Rank 3 was skipped!)
3. DENSE_RANK(): Assigns the same rank to identical values, but DOES NOT SKIP subsequent ranks:
   - 100k -> 1
   - 90k  -> 2
   - 90k  -> 2 (Tie)
   - 80k  -> 3 (No skip; strictly dense sequence)
Interview Tip: Always use DENSE_RANK() when answering "Find the Nth highest salary" so ties do not skip rank N.`
  },
  {
    id: 'int-10',
    category: 'SQL & Analytics',
    level: 'Advanced',
    company: 'Amazon',
    question: 'How do you detect and optimize a slow-running SQL query in production?',
    answer: `Step-by-Step Optimization Workflow:
1. Examine the Query Execution Plan using EXPLAIN (or EXPLAIN ANALYZE):
   - Look for "Seq Scan" or "SCAN TABLE" operators on large tables indicating a Full Table Scan.
   - Look for unindexed nested loop joins or accidental Cartesian products (CROSS JOIN).
   - Look for "External Sort" or "Temp B-Tree" indicating sorting spilled to disk.
2. Index Optimization:
   - Create B+ Tree indexes on columns in WHERE filters and foreign keys in JOIN ON conditions.
   - Create a Covering Composite Index (idx(filter_col, join_col, select_col)) allowing the query to be satisfied entirely from the index without reading the table heap.
   - Ensure the Leftmost Prefix rule is respected on composite indexes.
3. Query Rewriting:
   - Eliminate SELECT *; select only required columns to enable column pruning and index covering.
   - Replace correlated subqueries with Window Functions or CTE joins.
   - Avoid applying functions to indexed columns (e.g. change WHERE YEAR(date) = 2026 to WHERE date >= '2026-01-01' AND date < '2027-01-01').
4. Maintenance:
   - Run ANALYZE table_name to update database optimizer statistics and histograms.`
  }
];

