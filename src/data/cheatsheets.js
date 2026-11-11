// Data Engineering Cheat Sheet & Reference Desk
export const cheatsheets = [
  {
    id: 'cs-hdfs',
    title: 'HDFS Command Line (CLI) Cheatsheet',
    category: 'Storage',
    commands: [
      { cmd: 'hdfs dfs -ls /path', desc: 'List files and directories in HDFS' },
      { cmd: 'hdfs dfs -mkdir -p /path/dir', desc: 'Create directory hierarchy in HDFS' },
      { cmd: 'hdfs dfs -put localfile.csv /hdfs/path/', desc: 'Upload file from local filesystem to HDFS' },
      { cmd: 'hdfs dfs -get /hdfs/path/file.csv local/', desc: 'Download file from HDFS to local filesystem' },
      { cmd: 'hdfs dfs -cat /path/file.csv | head -n 20', desc: 'Stream and view contents of an HDFS file' },
      { cmd: 'hdfs dfs -rm -r /path/dir', desc: 'Recursively delete directory (moves to .Trash)' },
      { cmd: 'hdfs dfs -setrep -w 3 /path/file.csv', desc: 'Change replication factor to 3 and wait for completion' },
      { cmd: 'hdfs fsck /path -files -blocks -locations', desc: 'Check filesystem health and inspect block locations' },
      { cmd: 'hdfs dfsadmin -report', desc: 'Administrative summary of cluster capacity and DataNode status' },
      { cmd: 'hdfs dfsadmin -safemode get', desc: 'Check if NameNode is currently in Safe Mode' },
      { cmd: 'hdfs dfsadmin -safemode leave', desc: 'Force NameNode to exit Safe Mode' },
      { cmd: 'hdfs haadmin -getServiceState nn1', desc: 'Check if NameNode 1 is active or standby in HA setup' }
    ]
  },
  {
    id: 'cs-linux',
    title: 'Linux for Data Engineers Cheatsheet',
    category: 'Linux OS',
    commands: [
      { cmd: 'tail -n 100 -f /var/log/pipeline.log', desc: 'Follow last 100 lines of live streaming log' },
      { cmd: 'grep -rn "OutOfMemory" /var/log/', desc: 'Recursively search for error text with line numbers' },
      { cmd: 'find /data -type f -name "*.parquet" -mtime -1', desc: 'Find Parquet files modified in last 24 hours' },
      { cmd: 'df -h && df -i', desc: 'Check disk storage capacity and inode utilization' },
      { cmd: 'du -sh /data/* | sort -rh | head -n 10', desc: 'Identify 10 largest folders consuming disk space' },
      { cmd: 'ps -ef | grep -i spark', desc: 'List all running Spark processes with PIDs' },
      { cmd: 'kill -9 <PID>', desc: 'Forcibly terminate a stuck process via kernel SIGKILL' },
      { cmd: 'chmod 755 script.sh', desc: 'Grant rwx to owner, rx to group and others' },
      { cmd: 'chmod 600 ~/.ssh/id_rsa', desc: 'Lock down private key permissions for SSH' },
      { cmd: 'ss -tulnp | grep 9092', desc: 'Check if port 9092 (Kafka) is listening' },
      { cmd: 'crontab -e', desc: 'Edit scheduled recurring cron jobs' },
      { cmd: 'awk -F"," \'{sum += $3} END {print sum}\' f.csv', desc: 'Sum column 3 across CSV rows directly in Linux' }
    ]
  },
  {
    id: 'cs-pyspark',
    title: 'PySpark & Spark SQL Cheatsheet',
    category: 'Compute',
    commands: [
      { cmd: 'spark = SparkSession.builder.appName("App").getOrCreate()', desc: 'Initialize SparkSession entrypoint' },
      { cmd: 'df = spark.read.schema(schema).parquet("path/")', desc: 'Read Parquet with explicit schema' },
      { cmd: 'df.filter(F.col("salary") > 50000)', desc: 'Filter rows using column expression' },
      { cmd: 'df.withColumn("tax", F.col("price") * 0.18)', desc: 'Add or replace a column' },
      { cmd: 'df.groupBy("dept").agg(F.avg("salary"))', desc: 'Group by column and compute aggregates' },
      { cmd: 'df.join(broadcast(small_df), "user_id")', desc: 'Execute Broadcast Hash Join (Zero Shuffle)' },
      { cmd: 'df.repartition(100) / df.coalesce(10)', desc: 'Increase partitions (shuffle) vs decrease (no shuffle)' },
      { cmd: 'df.cache() / df.unpersist()', desc: 'Cache DataFrame in memory vs release memory' },
      { cmd: 'df.createOrReplaceTempView("v_orders")', desc: 'Register in-memory view for SQL querying' },
      { cmd: 'spark.sql("SELECT * FROM v_orders").show()', desc: 'Execute SQL query against registered view' },
      { cmd: 'df.explain(True)', desc: 'Inspect Parsed, Analyzed, Optimized, and Physical Plans' },
      { cmd: 'df.write.mode("overwrite").partitionBy("date").parquet("path/")', desc: 'Write partitioned Parquet dataset' }
    ]
  },
  {
    id: 'cs-sql',
    title: 'Advanced SQL & Window Functions Cheatsheet',
    category: 'SQL Analytics',
    commands: [
      { cmd: 'ROW_NUMBER() OVER (PARTITION BY k ORDER BY dt DESC)', desc: 'Unique sequential row rank (Deduplication pattern)' },
      { cmd: 'DENSE_RANK() OVER (PARTITION BY dept ORDER BY sal DESC)', desc: 'Dense rank handling ties without skipping numbers' },
      { cmd: 'LAG(col, 1) OVER (ORDER BY dt)', desc: 'Fetch previous row value for day-over-day growth' },
      { cmd: 'LEAD(col, 1) OVER (ORDER BY dt)', desc: 'Fetch next row value' },
      { cmd: 'SUM(amt) OVER (ORDER BY dt ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)', desc: 'Cumulative running total' },
      { cmd: 'WITH cte AS (SELECT ...) SELECT ...', desc: 'Common Table Expression for modular queries' },
      { cmd: 'WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<10)', desc: 'Recursive CTE sequence generator' },
      { cmd: 'EXPLAIN QUERY PLAN SELECT ...', desc: 'Inspect physical database execution plan' },
      { cmd: 'CREATE INDEX idx_name ON table(col1, col2)', desc: 'Create composite B+ Tree index' }
    ]
  },
  {
    id: 'cs-kafka',
    title: 'Apache Kafka CLI Cheatsheet',
    category: 'Streaming',
    commands: [
      { cmd: 'kafka-topics.sh --create --bootstrap-server localhost:9092 --topic orders --partitions 6 --replication-factor 3', desc: 'Create topic with 6 partitions and 3 replicas' },
      { cmd: 'kafka-topics.sh --list --bootstrap-server localhost:9092', desc: 'List all topics in cluster' },
      { cmd: 'kafka-topics.sh --describe --topic orders --bootstrap-server localhost:9092', desc: 'Show partition leaders, replicas, and ISR' },
      { cmd: 'kafka-console-producer.sh --bootstrap-server localhost:9092 --topic orders', desc: 'Publish events interactively from terminal' },
      { cmd: 'kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic orders --from-beginning', desc: 'Consume all messages from offset 0' },
      { cmd: 'kafka-consumer-groups.sh --describe --group my-group --bootstrap-server localhost:9092', desc: 'Inspect consumer group lag and committed offsets' },
      { cmd: 'kafka-consumer-groups.sh --group my-group --reset-offsets --to-earliest --execute --topic orders', desc: 'Reset consumer group offsets to replay topic' }
    ]
  }
];

