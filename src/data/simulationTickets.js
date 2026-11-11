// Industry Simulation Mode: "Work Like a Data Engineer"
export const simulationTickets = [
  {
    id: 'ticket-101',
    code: 'DE-INC-101',
    priority: 'P1 - High',
    component: 'Python / Memory Management',
    title: 'Manager Task: Process 10 GB CSV File (OOM Crash on Server)',
    businessProblem: 'Your Engineering Manager rushes to your desk: "Our payment settlement vendor just dropped a 10.5 GB CSV containing 65 million transaction records for Black Friday audit. The junior analyst tried running `pd.read_csv(\'settlements.csv\')` on our 16 GB RAM edge gateway server, and the process crashed with `MemoryError`! We have an audit deadline in 2 hours with the CFO. Fix this script so it processes the entire file with bounded RAM!"',
    managerMessage: 'Hey! We cannot upgrade the physical RAM on this server today. We need you to rewrite the processing logic so it streams or chunks through the 10 GB dataset without using more than 500 MB of RAM. Please inspect the memory crash logs and implement chunking or generator streaming immediately.',
    systemLogs: `[2026-11-11 14:15:02] INFO Loading settlement_2026_bf.csv (Size: 10,485,760,000 bytes)...
[2026-11-11 14:15:18] DEBUG Allocating memory buffer for 65,000,000 rows in Pandas DataFrame...
[2026-11-11 14:15:32] WARN Host physical memory approaching 98% (Free: 112 MB, Swap: 2048 MB full)
[2026-11-11 14:15:40] ERROR Traceback (most recent call last):
  File "process_settlements.py", line 12, in <module>
    df = pd.read_csv("settlement_2026_bf.csv")
  File "/usr/local/lib/python3.13/site-packages/pandas/io/parsers.py", line 688, in read_csv
    return _read(filepath_or_buffer, kwds)
numpy.core._exceptions._ArrayMemoryError: Unable to allocate 10.2 GiB for an array with shape (65000000, 21) and data type object`,
    investigationQuestions: [
      {
        q: 'Why did the junior analyst\'s script crash with MemoryError?',
        options: [
          'The CSV file had corrupt syntax',
          'Pandas pd.read_csv() attempted to load all 65 million rows into memory at once, requiring ~10.2 GB RAM which exceeded available host memory',
          'The Python interpreter was outdated',
          'The hard drive was full'
        ],
        correct: 1,
        explanation: 'Default pd.read_csv() loads the entire file into memory at once. In Pandas, string columns and object overhead often inflate memory usage 2x-3x beyond raw file size on disk.'
      },
      {
        q: 'Which technique allows processing a 10 GB file in Python with less than 200 MB of RAM?',
        options: [
          'Using a while loop with time.sleep()',
          'Using pd.read_csv(..., chunksize=50000) or streaming line-by-line via open()',
          'Converting the file to JPEG format',
          'Running Python as root'
        ],
        correct: 1,
        explanation: 'chunksize returns an iterator over chunks of rows, allowing you to process 50,000 rows at a time and write intermediate aggregates with constant low memory usage.'
      }
    ],
    brokenCode: `# BROKEN CODE (Monolithic Load)
import pandas as pd

def process_file():
    df = pd.read_csv("settlement_2026_bf.csv")
    total_revenue = df["amount"].sum()
    return total_revenue
`,
    fixedCode: `# OPTIMIZED PRODUCTION CODE (Chunked Streaming)
import pandas as pd

def process_file():
    total_revenue = 0.0
    total_records = 0
    # Process in bounded 50,000 row chunks (< 100MB RAM footprint)
    for chunk in pd.read_csv("settlement_2026_bf.csv", chunksize=50000, usecols=["amount"]):
        total_revenue += chunk["amount"].sum()
        total_records += len(chunk)
    return total_revenue, total_records
`,
    commandToVerify: 'python3 -c "import pandas as pd; print(\'Chunked streaming verified: 65M rows processed in 50k chunks with 85MB peak RAM\')"',
    resolutionOutcome: 'SUCCESS: Script processed all 65 million records in bounded 50k chunks with peak memory consumption of only 85 MB. CFO audit report generated in time!'
  },
  {
    id: 'ticket-102',
    code: 'DE-INC-102',
    priority: 'P0 - Critical',
    component: 'HDFS Cluster Infrastructure',
    title: 'Emergency: DataNode Crash & Under-Replicated Blocks in Production',
    businessProblem: 'PagerDuty alert triggered at 03:15 AM: "HDFS Cluster Health DEGRADED. DataNode-4 (worker-04.corp) status DEAD. 58 Under-Replicated Blocks detected!" The nightly customer statement generation Spark job is stalling because some block replicas are unreachable.',
    managerMessage: 'Our primary DataNode on Rack 2 blew a power supply unit in the data center. The hardware team is replacing the unit, but right now 58 blocks have only 2 live replicas instead of 3. We cannot risk permanent data loss if another node dies. Investigate cluster status and verify HDFS self-healing or rebalancing!',
    systemLogs: `[2026-11-11 03:14:10] WARN org.apache.hadoop.hdfs.server.namenode.HeartbeatManager: DataNode worker-04.corp (192.168.2.104) has ceased heartbeats. Last contact: 635s ago.
[2026-11-11 03:14:12] ERROR org.apache.hadoop.hdfs.server.namenode.DatanodeManager: Marking worker-04.corp as DEAD.
[2026-11-11 03:14:15] WARN org.apache.hadoop.hdfs.server.namenode.BlockManager: Number of under-replicated blocks: 58 (Replication factor: 2 < 3)
[2026-11-11 03:14:20] INFO org.apache.hadoop.hdfs.server.namenode.BlockManager: Scheduling asynchronous re-replication of 58 blocks to healthy DataNodes across /rack-01 and /rack-02...`,
    investigationQuestions: [
      {
        q: 'Why did NameNode wait 630 seconds (10.5 minutes) before declaring DataNode-4 dead?',
        options: [
          'Because of a bug in NameNode JVM',
          'Standard HDFS specification: timeout = 2 * heartbeat.recheck.interval (600s) + 10 * heartbeat.interval (30s) = 630s to avoid false positives during transient network blips',
          'Because DataNodes only send heartbeats once every 10 minutes',
          'Because the cluster was in Safe Mode'
        ],
        correct: 1,
        explanation: 'According to Apache HDFS design, NameNode waits 10 minutes and 30 seconds before declaring a node dead to avoid premature replication storms during temporary network hiccups.'
      },
      {
        q: 'What command checks cluster health and identifies under-replicated or corrupt blocks?',
        options: [
          'hadoop fs -rm -r /',
          'hdfs fsck / and hdfs dfsadmin -report',
          'top -u hadoop',
          'jps -v'
        ],
        correct: 1,
        explanation: 'hdfs fsck / scans the filesystem for corrupt/under-replicated blocks; hdfs dfsadmin -report summarizes cluster live/dead node capacities.'
      }
    ],
    brokenCode: `# Triage Command
hdfs dfsadmin -report -dead
`,
    fixedCode: `# Cluster Recovery Command
hdfs dfsadmin -report
hdfs fsck / -files -blocks
# Trigger cluster balancing if disks are uneven
hdfs balancer -threshold 10
`,
    commandToVerify: 'hdfs fsck / -summary',
    resolutionOutcome: 'SUCCESS: NameNode successfully copied all 58 missing block replicas to healthy DataNode-5 and DataNode-6. Cluster health restored to 100% HEALTHY with zero data loss.'
  },
  {
    id: 'ticket-103',
    code: 'DE-INC-103',
    priority: 'P1 - High',
    component: 'Apache Spark / Data Skew',
    title: 'Production Spark Job Stalled at 99%: Long-Tail Straggler Task',
    businessProblem: 'The daily billing reconciliation Spark job that normally takes 15 minutes has been running for 2 hours. In the Spark Web UI, 199 out of 200 tasks in Stage 3 finished in under 20 seconds, but Task 199 has been running for 1 hour 40 minutes processing 45 GB of shuffle read on a single executor. Downstream billing reports are blocked.',
    managerMessage: 'This is a classic Data Skew straggler! Our marketing team ran a promotional campaign with a generic merchant account ID "PROMO_GUEST", which generated 85% of all today\'s transactions. When you join on merchant_id, all promo records are hashed to Task 199. Rewrite the join with Salting or Broadcast Join to unblock billing!',
    systemLogs: `[2026-11-11 11:20:00] INFO TaskSetManager: Starting task 199.0 in stage 3.0 (TID 199, worker-02.corp, executor 5, partition 199)
[2026-11-11 11:20:15] INFO TaskSetManager: 199 tasks finished out of 200 tasks (Stage 3.0 progress: 99%)
[2026-11-11 11:35:40] WARN Executor: Executor 5 task 199 spilled 18.4 GB memory to disk!
[2026-11-11 12:10:12] WARN TaskSetManager: Task 199.0 has been running for 50.2 minutes (Median task time: 14.2s). Possible DATA SKEW detected. Shuffle Read: 42.8 GB vs Median 120 MB!`,
    investigationQuestions: [
      {
        q: 'What is the root cause of the single straggler task in Stage 3?',
        options: [
          'The worker node CPU died',
          'Data Skew: A single popular key (PROMO_GUEST) contains 85% of records; hash partitioning routed all 42 GB to a single partition (Task 199)',
          'The Spark code had a syntax error',
          'YARN ran out of vCores'
        ],
        correct: 1,
        explanation: 'When a key is skewed, standard hash partitioning routes all rows with that key to a single reducer partition, creating a straggler bottleneck.'
      },
      {
        q: 'How does the "Key Salting" technique resolve this data skew bottleneck?',
        options: [
          'By adding salt to the database server hardware',
          'By appending a random suffix (e.g. _0 to _9) to the skewed key, distributing the 42 GB across 10 parallel tasks instead of 1',
          'By deleting the promo records',
          'By converting Spark to MapReduce'
        ],
        correct: 1,
        explanation: 'Salting appends random integers to the skewed key in the large table and explodes the lookup key in the small table, distributing records across multiple parallel partitions.'
      }
    ],
    brokenCode: `# SKEWED JOIN (Causing Single Straggler)
result_df = transactions_df.join(merchants_df, "merchant_id")
`,
    fixedCode: `# OPTIMIZED JOIN WITH KEY SALTING
import pyspark.sql.functions as F

SALT_ROUNDS = 10
# Append random salt to skewed key in fact table
salted_txns = transactions_df.withColumn("salted_merchant_id", 
    F.when(F.col("merchant_id") == "PROMO_GUEST", 
           F.concat(F.col("merchant_id"), F.lit("_"), F.floor(F.rand() * SALT_ROUNDS)))
     .otherwise(F.col("merchant_id"))
)

# Explode lookup table across all salt values
exploded_merchants = merchants_df.withColumn("salt_array", F.array([F.lit(i) for i in range(SALT_ROUNDS)])) \\
                                 .withColumn("salt", F.explode("salt_array")) \\
                                 .withColumn("salted_merchant_id", F.concat(F.col("merchant_id"), F.lit("_"), F.col("salt")))

result_df = salted_txns.join(exploded_merchants, "salted_merchant_id")
`,
    commandToVerify: 'python3 -c "print(\'Salting optimization verified: 42 GB skewed partition divided into 10 balanced 4.2 GB partitions. Runtime dropped from 2 hours to 6 minutes.\')"',
    resolutionOutcome: 'SUCCESS: Key salting distributed the PROMO_GUEST transactions across 10 parallel executor tasks. Stage 3 completed in 6 minutes with zero stragglers!'
  },
  {
    id: 'ticket-104',
    code: 'DE-INC-104',
    priority: 'P1 - High',
    component: 'Apache Kafka / Streaming',
    title: 'Kafka Consumer Lag Exploding: Downstream Backlog Alert',
    businessProblem: 'Datadog monitoring triggered a high-severity alert: "Kafka Topic `ride_requests_v1` Consumer Lag on Group `dispatch_analytics_group` has spiked from 250 messages to 1,450,000 messages in the last 30 minutes!" Real-time driver dispatch matching is severely delayed, leading to user cancellations.',
    managerMessage: 'Our mobile app traffic doubled due to rainy weather, but our consumer group has only 2 consumer instances running while the topic has 8 partitions. Check why the consumers are falling behind, inspect commit semantics, and scale consumers to clear the backlog!',
    systemLogs: `[2026-11-11 17:30:10] WARN org.apache.kafka.clients.consumer.internals.ConsumerCoordinator: Group dispatch_analytics_group lag report:
  Topic: ride_requests_v1 | Partition 0 | LEO: 450,000 | Current: 210,000 | LAG: 240,000
  Topic: ride_requests_v1 | Partition 1 | LEO: 462,000 | Current: 220,000 | LAG: 242,000
  Topic: ride_requests_v1 | Partition 2 | LEO: 455,000 | Current: 215,000 | LAG: 240,000
  Topic: ride_requests_v1 | Partition 3 | LEO: 448,000 | Current: 205,000 | LAG: 243,000
  TOTAL LAG: 1,450,000 records!
[2026-11-11 17:30:15] WARN Active Consumers in group: 2 instances (Instance 1 reading P0-P3, Instance 2 reading P4-P7). CPU: 95% saturated.`,
    investigationQuestions: [
      {
        q: 'Why are the 2 active consumer instances falling behind incoming traffic?',
        options: [
          'The Kafka brokers ran out of disk',
          'Consumer throughput capacity is overwhelmed: 2 instances are handling all 8 partitions while traffic doubled; instances are CPU-saturated',
          'The topic replication factor was too low',
          'Producers stopped sending messages'
        ],
        correct: 1,
        explanation: 'With 8 partitions and only 2 consumer instances, each consumer must process 4 high-velocity partitions sequentially, creating a massive ingestion backlog.'
      },
      {
        q: 'What is the most effective immediate action to clear the 1.45M message lag?',
        options: [
          'Delete the topic',
          'Scale consumer group instances from 2 up to 8 (so each partition is processed concurrently by a dedicated consumer) and batch database inserts',
          'Restart the Kafka brokers',
          'Decrease topic partitions'
        ],
        correct: 1,
        explanation: 'Scaling consumer instances up to match the 8 partitions allows 8x concurrent consumption parallelism, draining the lag backlog rapidly.'
      }
    ],
    brokenCode: `# Single-threaded slow consumer inserting row-by-row
for msg in consumer:
    db_cursor.execute("INSERT INTO rides VALUES (...)") # Synchronous commit per row!
    db_conn.commit()
`,
    fixedCode: `# Scaled consumer with micro-batching
batch = []
for msg in consumer:
    batch.append(msg.value)
    if len(batch) >= 1000:
        db_cursor.executemany("INSERT INTO rides VALUES (?, ?, ?)", batch)
        db_conn.commit()
        consumer.commit_async()
        batch.clear()
`,
    commandToVerify: 'kafka-consumer-groups.sh --describe --group dispatch_analytics_group',
    resolutionOutcome: 'SUCCESS: Scaled consumer group to 8 instances with micro-batch database commits. The 1.45M message lag was completely drained in 8 minutes.'
  },
  {
    id: 'ticket-105',
    code: 'DE-INC-105',
    priority: 'P2 - Medium',
    component: 'ETL Pipeline / Schema Drift',
    title: 'Production ETL Pipeline Failure: Upstream Schema Drift & Corrupt JSON',
    businessProblem: 'Daily 04:00 AM ingest job failed with `KeyError: \'billing_address\'` and `JSONDecodeError`. The upstream mobile engineering team released app version 4.2 without notifying the data team, nesting `billing_address` into a new `customer_profile.addresses` array. The entire downstream customer reporting table is missing today\'s data.',
    managerMessage: 'This is a classic Schema Drift incident! We cannot have the whole pipeline crash whenever a mobile developer adds or moves a JSON field. We need to implement defensive schema extraction using .get() and route malformed records to a Dead Letter Queue (DLQ) so the pipeline continues processing clean records.',
    systemLogs: `[2026-11-11 04:02:15] INFO Reading s3://mobile-telemetry/2026/11/11/events.json...
[2026-11-11 04:02:22] ERROR Process crashed at record #45,210:
Traceback (most recent call last):
  File "ingest_events.py", line 28, in process_record
    address = record["billing_address"]
KeyError: 'billing_address'
[2026-11-11 04:02:23] FATAL Pipeline aborted! 0 out of 500,000 records committed to warehouse.`,
    investigationQuestions: [
      {
        q: 'Why did the pipeline crash when app v4.2 events arrived?',
        options: [
          'Because the hard drive crashed',
          'Hardcoded dictionary key lookups (record["billing_address"]) threw KeyError when the upstream schema evolved',
          'Because Python 3 doesn\'t support dictionaries',
          'Because of a network timeout'
        ],
        correct: 1,
        explanation: 'Accessing missing keys directly with bracket notation record["key"] raises KeyError; defensive pipelines use record.get("key", default) and schema contracts.'
      },
      {
        q: 'How should resilient production pipelines handle schema drift and bad JSON records?',
        options: [
          'Crash immediately and page the on-call engineer for every bad row',
          'Catch exceptions, route corrupt records into a Dead Letter Queue (DLQ) for review, and allow valid records to continue processing',
          'Delete the bad rows without logging',
          'Disable JSON parsing'
        ],
        correct: 1,
        explanation: 'Quarantining bad records to a DLQ preserves pipeline availability while maintaining auditability for corrupt records.'
      }
    ],
    brokenCode: `# FRAGILE CODE
def extract_row(raw_json):
    obj = json.loads(raw_json)
    return {
        "user_id": obj["user_id"],
        "address": obj["billing_address"] # Crashes on KeyError!
    }
`,
    fixedCode: `# RESILIENT CODE WITH DEFENSIVE EXTRACTION & DLQ
def extract_row_safe(raw_json, dlq_list):
    try:
        obj = json.loads(raw_json)
        # Defensive fallback for schema drift
        address = obj.get("billing_address") or (obj.get("customer_profile", {}).get("addresses", [{}])[0].get("street"))
        return {
            "user_id": obj.get("user_id"),
            "address": address or "UNKNOWN"
        }
    except Exception as e:
        dlq_list.append({"raw": raw_json, "error": str(e)})
        return None
`,
    commandToVerify: 'python3 -c "print(\'Defensive extraction verified: 499,950 clean records loaded; 50 malformed records quarantined to DLQ.\')"',
    resolutionOutcome: 'SUCCESS: Pipeline updated with defensive navigation and DLQ quarantine. 499,950 records loaded successfully to warehouse; 50 bad records saved to /dlq/schema_drift_20261111.'
  },
  {
    id: 'ticket-106',
    code: 'DE-INC-106',
    priority: 'P1 - High',
    component: 'SQL / Database Tuning',
    title: 'CEO Dashboard Timeout: Slow SQL Query on 50M Rows Table',
    businessProblem: 'The executive revenue dashboard for the CEO is timing out with `HTTP 504 Gateway Timeout` after 15 minutes. The backend query joins `orders` (50 million rows) with `merchants` (10,000 rows) filtering on `status = \'COMPLETED\' AND order_date >= \'2026-11-01\'`.',
    managerMessage: 'Our CEO is in a board meeting right now and cannot open the revenue metrics! Running EXPLAIN on the database reveals a sequential Full Table Scan scanning all 50 million rows from disk. Identify the missing indexes or query rewrite to drop execution time under 1 second!',
    systemLogs: `[2026-11-11 09:00:00] INFO Executing Dashboard Query: SELECT m.name, SUM(o.amount) FROM orders o JOIN merchants m ON o.merchant_id = m.id WHERE o.status = 'COMPLETED' AND o.order_date >= '2026-11-01' GROUP BY m.name...
[2026-11-11 09:15:00] ERROR Query exceeded timeout limit 900,000 ms! Gateway timeout 504.
[2026-11-11 09:15:02] DEBUG EXPLAIN QUERY PLAN Output:
  SCAN orders (50,000,000 rows read from disk; Cost: 1,452,010)
  SCAN merchants (Cost: 250)
  USE TEMP B-TREE FOR GROUP BY`,
    investigationQuestions: [
      {
        q: 'Why was the CEO dashboard timing out after 15 minutes?',
        options: [
          'The database server had no network',
          'The orders table lacked indexes on the filter and join columns (status, order_date, merchant_id), forcing a 50-million row Full Table Scan',
          'The merchants table had too many columns',
          'PostgreSQL was paused'
        ],
        correct: 1,
        explanation: 'Without indexes on the filtering and join columns, the database must read every single block of the 50M-row table from physical disk.'
      },
      {
        q: 'Which index structure will optimize this query to execute in under 1 second?',
        options: [
          'An index on merchant name only',
          'A composite index on orders(status, order_date, merchant_id, amount) - a Covering Index',
          'Deleting the orders table',
          'Converting the query to uppercase'
        ],
        correct: 1,
        explanation: 'A composite index on (status, order_date, merchant_id, amount) allows the database to filter dates and satisfy the entire query from the index without reading the table heap.'
      }
    ],
    brokenCode: `# Slow Query without Index
SELECT m.name, SUM(o.amount)
FROM orders o
JOIN merchants m ON o.merchant_id = m.id
WHERE o.status = 'COMPLETED' AND o.order_date >= '2026-11-01'
GROUP BY m.name;
`,
    fixedCode: `# Index Creation & Query Optimization
-- Create Composite Covering Index
CREATE INDEX idx_orders_analytics ON orders(status, order_date, merchant_id, amount);
CREATE INDEX idx_merchants_id ON merchants(id);

-- Optimized Query
SELECT m.name, SUM(o.amount) as total_volume
FROM orders o
JOIN merchants m ON o.merchant_id = m.id
WHERE o.status = 'COMPLETED' AND o.order_date >= '2026-11-01'
GROUP BY m.name;
`,
    commandToVerify: 'python3 -c "print(\'EXPLAIN QUERY PLAN: SEARCH orders USING INDEX idx_orders_analytics. Execution time dropped from 15 minutes to 450 ms.\')"',
    resolutionOutcome: 'SUCCESS: Created composite covering index on orders table. Query execution time dropped from 15 minutes to 450 milliseconds! CEO dashboard opened immediately.'
  },
  {
    id: 'ticket-107',
    code: 'DE-INC-107',
    priority: 'P1 - High',
    component: 'Data Lake / Deduplication',
    title: 'Duplicate Transaction Records in Warehouse Causing Over-Billing',
    businessProblem: 'The accounting team reported a severe discrepancy: "Customer billing reports show double-counted charges for 12,000 customers! A payment webhook retry during a network outage sent duplicate events with identical `transaction_id`, but different `updated_at` timestamps. Clean this data and deduplicate the warehouse table immediately!"',
    managerMessage: 'Do not simply drop rows with DISTINCT! We need to keep the LATEST updated state for each transaction_id based on updated_at timestamp. Write an SQL window function deduplication query using ROW_NUMBER() to eliminate all duplicate duplicates.',
    systemLogs: `[2026-11-11 08:30:12] WARN Audit check: Total records in fct_payments: 1,024,000
[2026-11-11 08:30:15] WARN Unique transaction_ids: 1,000,000
[2026-11-11 08:30:18] ERROR 24,000 duplicate payment transactions detected! Total inflated volume: $1,420,000.00!`,
    investigationQuestions: [
      {
        q: 'Why does a simple "SELECT DISTINCT *" NOT work to clean this dataset?',
        options: [
          'Because DISTINCT is not supported in SQL',
          'Because the duplicate rows have different updated_at timestamps or status flags, so their full rows are technically not identical duplicates',
          'Because DISTINCT only works on numbers',
          'Because the table is too large'
        ],
        correct: 1,
        explanation: 'DISTINCT compares all columns across the row; if timestamps or status changed between webhook retries, DISTINCT will not remove them.'
      },
      {
        q: 'Which SQL window function pattern is the industry standard for deduplicating data to keep the newest record?',
        options: [
          'COUNT(*) OVER (ORDER BY updated_at)',
          'ROW_NUMBER() OVER (PARTITION BY transaction_id ORDER BY updated_at DESC) and filtering WHERE rn = 1',
          'LEAD(updated_at) OVER (PARTITION BY transaction_id)',
          'GROUP BY transaction_id HAVING COUNT(*) = 1'
        ],
        correct: 1,
        explanation: 'ROW_NUMBER() partitions by business key and orders by timestamp descending, ensuring rank 1 is always the latest record.'
      }
    ],
    brokenCode: `# Incorrect Attempt
SELECT DISTINCT * FROM fct_payments; -- Leaves duplicates because timestamps differ!
`,
    fixedCode: `# Production Window Deduplication Pattern
WITH RankedPayments AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (
            PARTITION BY transaction_id 
            ORDER BY updated_at DESC
        ) as rn
    FROM fct_payments
)
DELETE FROM fct_payments 
WHERE transaction_id IN (
    SELECT transaction_id FROM RankedPayments WHERE rn > 1
);
`,
    commandToVerify: 'python3 -c "print(\'Deduplication verified: 24,000 duplicate transactions purged. Exactly 1,000,000 unique records retained with newest timestamp.\')"',
    resolutionOutcome: 'SUCCESS: ROW_NUMBER() partition deduplication executed. All 24,000 duplicate payment charges were purged, retaining the exact newest record. Billing figures reconciled.'
  },
  {
    id: 'ticket-108',
    code: 'DE-INC-108',
    priority: 'P1 - High',
    component: 'Data Quality / Great Expectations',
    title: 'Data Quality Alert: Negative Balances & Null Foreign Keys in Gold Table',
    businessProblem: 'Data Quality alert triggered on Gold Mart table `gold_customer_balances`: "Automated validation failed! 142 records have negative wallet balance, and 85 records have NULL customer_id! Upstream source API had an unvalidated debit bug."',
    managerMessage: 'This is why we have automated Data Quality gates! If this corrupted Gold table is published to the live user mobile app, users will see negative balances and panic. Implement an automated Great Expectations / validation gatekeeper that quarantines failing records and alerts the payments engineering team.',
    systemLogs: `[2026-11-11 13:00:00] INFO Ingesting daily balances into gold_customer_balances...
[2026-11-11 13:00:15] WARN DataQualityValidator: Running Assertions:
  Assertion 1: expect_column_values_to_not_be_null('customer_id') -> FAILED (85 nulls found)
  Assertion 2: expect_column_values_to_be_between('wallet_balance', min_value=0.0) -> FAILED (142 negative values found)
[2026-11-11 13:00:20] ERROR Data Quality Gatekeeper: BLOCKED publication to production Gold Mart!`,
    investigationQuestions: [
      {
        q: 'Why did the Data Quality Gatekeeper block publication to the Gold Mart table?',
        options: [
          'Because the hard drive was full',
          'Incoming batch violated fundamental business rules: wallet balances must be >= 0 and customer_id must not be null',
          'Because the script timed out',
          'Because of a Python syntax error'
        ],
        correct: 1,
        explanation: 'Data Quality gates enforce critical business invariants, preventing corrupted data from entering production analytical stores.'
      },
      {
        q: 'What should happen to the 227 failing records?',
        options: [
          'Silently drop them without telling anyone',
          'Quarantine them into an audit table (stg_balances_quarantine) with error metadata and trigger an alert webhook to the payments team',
          'Manually edit them to zero in production',
          'Disable the validation gate'
        ],
        correct: 1,
        explanation: 'Quarantining to an audit table allows healthy records to continue while providing full forensic visibility for engineering investigation.'
      }
    ],
    brokenCode: `# Unguarded Direct Write (Corrupting Gold Layer)
df.write.mode("overwrite").saveAsTable("gold_customer_balances")
`,
    fixedCode: `# Production Data Quality Gatekeeper
# 1. Filter Clean vs Quarantined
clean_df = df.filter((F.col("customer_id").isNotNull()) & (F.col("wallet_balance") >= 0.0))
bad_df = df.filter((F.col("customer_id").isNull()) | (F.col("wallet_balance") < 0.0))

# 2. Quarantine bad records
bad_df.withColumn("quarantine_reason", F.when(F.col("customer_id").isNull(), "NULL_CUSTOMER_ID").otherwise("NEGATIVE_BALANCE")) \\
      .write.mode("append").saveAsTable("audit_quarantine_balances")

# 3. Commit clean records to Gold
clean_df.write.mode("overwrite").saveAsTable("gold_customer_balances")
`,
    commandToVerify: 'python3 -c "print(\'Data Quality Gate verified: 99,773 valid customer balances published to Gold Mart; 227 corrupted records quarantined and payment team notified.\')"',
    resolutionOutcome: 'SUCCESS: 99,773 clean customer balances committed to Gold layer; 227 corrupted records safely quarantined into audit table. Payments team notified of upstream bug.'
  }
];

