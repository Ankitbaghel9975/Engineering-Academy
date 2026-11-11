// Real-World Industry Projects Data
export const projectsData = [
  {
    id: 'proj-1',
    title: 'Project 1: HDFS Distributed Storage Engineering',
    category: 'Storage Infrastructure',
    difficulty: 'Intermediate',
    badge: 'Core HDFS',
    summary: 'Design and manage a simulated 3-Rack, 6-DataNode enterprise HDFS cluster. Upload multi-block datasets, observe rack-aware distribution, configure replication policies, simulate sudden DataNode hardware crashes, and execute block integrity reports.',
    objectives: [
      'Upload a 512 MB file split across 128 MB blocks (blk_101 through blk_104)',
      'Inspect official 3-replica rack placement across Rack 1 and Rack 2',
      'Simulate a sudden physical failure of DataNode-3',
      'Observe NameNode detecting missed heartbeats (630s timeout) and marking node Dead',
      'Trigger automated block re-replication to DataNode-5 to restore replication factor 3',
      'Execute hdfs fsck and hdfs dfsadmin -report to verify 100% cluster health'
    ],
    architecture: {
      totalCapacity: '120 TB',
      racks: [
        {
          rackId: '/rack-01',
          nodes: [
            { id: 'dn-01', ip: '192.168.1.101', status: 'HEALTHY', blocks: ['blk_101_r1', 'blk_102_r1', 'blk_103_r1'], diskUsed: '42%' },
            { id: 'dn-02', ip: '192.168.1.102', status: 'HEALTHY', blocks: ['blk_104_r1', 'blk_102_r3'], diskUsed: '38%' },
            { id: 'dn-03', ip: '192.168.1.103', status: 'HEALTHY', blocks: ['blk_101_r2', 'blk_103_r2'], diskUsed: '45%' }
          ]
        },
        {
          rackId: '/rack-02',
          nodes: [
            { id: 'dn-04', ip: '192.168.2.101', status: 'HEALTHY', blocks: ['blk_101_r3', 'blk_104_r2'], diskUsed: '40%' },
            { id: 'dn-05', ip: '192.168.2.102', status: 'HEALTHY', blocks: ['blk_103_r3'], diskUsed: '25%' },
            { id: 'dn-06', ip: '192.168.2.103', status: 'HEALTHY', blocks: ['blk_102_r2', 'blk_104_r3'], diskUsed: '44%' }
          ]
        }
      ]
    },
    tasks: [
      {
        id: 'p1-t1',
        name: 'Step 1: Upload Large Dataset to HDFS',
        command: 'hdfs dfs -put -Ddfs.blocksize=134217728 orders_2026.csv /data/raw/',
        expected: 'Upload completed. File size 512 MB partitioned into 4 blocks (128 MB each).'
      },
      {
        id: 'p1-t2',
        name: 'Step 2: Inspect Rack Placement Policy',
        command: 'hdfs fsck /data/raw/orders_2026.csv -files -blocks -locations',
        expected: 'Block blk_101: Replica 1 on dn-01 (/rack-01), Replica 2 on dn-03 (/rack-01), Replica 3 on dn-04 (/rack-02). Status: HEALTHY.'
      },
      {
        id: 'p1-t3',
        name: 'Step 3: Simulate DataNode-3 Failure',
        command: 'sim-cluster datanode kill dn-03',
        expected: '[ALERT] DataNode-3 disconnected. Missed heartbeats > 630s. NameNode marked dn-03 DEAD. Under-replicated blocks: 2.'
      },
      {
        id: 'p1-t4',
        name: 'Step 4: Trigger Auto Re-replication & Health Check',
        command: 'hdfs dfsadmin -report',
        expected: 'Under-replicated blocks: 0. Re-replication to dn-05 completed. Cluster Status: 100% HEALTHY.'
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'Project 2: Enterprise Python ETL Pipeline with DLQ',
    category: 'Pipeline Engineering',
    difficulty: 'Intermediate',
    badge: 'Python ETL',
    summary: 'Build an automated end-to-end Python ETL pipeline that ingests dirty multi-format data (CSV files, nested JSON logs), cleans data, validates business rules, isolates malformed rows into a Dead Letter Queue (DLQ), and loads clean rows into SQLite/Postgres with structured logging.',
    objectives: [
      'Extract dirty raw transactions from CSV and nested user telemetry JSON',
      'Clean strings, parse timestamps, normalize currencies, and impute missing values',
      'Validate email formats and ensure positive transaction amounts using regex and type checks',
      'Route bad records to quarantine DLQ with exact error reasons',
      'Bulk load clean records into a relational database via parameterized batch insert',
      'Emit structured JSON logs and execution metrics summary'
    ],
    sampleInput: {
      csvData: [
        'order_id,user_email,amount,status',
        '1001,arjun@example.com,1500.00,SUCCESS',
        '1002,bad_email_format,250.00,SUCCESS',
        '1003,priya@company.org,INVALID_NUM,SUCCESS',
        '1004,rohan@test.com,-50.00,SUCCESS',
        '1005,arjun@example.com,1500.00,SUCCESS'
      ],
      jsonData: [
        '{"id": 2001, "user": {"id": 101, "email": "neha@service.in"}, "amount": 890.0, "status": "PAID"}',
        '{"id": 2002, "user": {"id": 102, "email": "deepak@corp.net"}, "amount": 1400.0, "status": "PAID"}'
      ]
    },
    codeSnippet: `# Production Python ETL
import sqlite3, json, re, time

def run_pipeline():
    conn = sqlite3.connect("clean_warehouse.db")
    cur = conn.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS orders (order_id INT PRIMARY KEY, email TEXT, amount REAL, status TEXT)")
    
    clean_records = []
    dlq_records = []
    
    # Process and sanitize...
    return clean_records, dlq_records
`
  },
  {
    id: 'proj-3',
    title: 'Project 3: SQL Analytics Warehouse & Performance Tuning',
    category: 'Analytics & Optimization',
    difficulty: 'Advanced',
    badge: 'SQL Mastery',
    summary: 'Construct an enterprise employee, department, and transaction analytics warehouse. Formulate advanced multi-table joins, window functions (DENSE_RANK, LAG, cumulative sums), identify bottlenecks via EXPLAIN QUERY PLAN, and optimize slow full-table scans with composite indexes.',
    objectives: [
      'Create normalized tables: employees, departments, salaries, sales_transactions',
      'Compute departmental salary rankings and identify the 2nd highest earner handling ties',
      'Calculate Day-over-Day revenue growth and 7-day rolling revenue using window frames',
      'Identify slow queries using EXPLAIN QUERY PLAN (spotting SCAN TABLE operators)',
      'Apply composite indexes and verify 100x query speedup with SEARCH USING INDEX',
      'Deduplicate transaction updates using ROW_NUMBER() window partitioning'
    ],
    schema: [
      'employees (emp_id INT, name TEXT, dept_id INT, hire_date DATE, salary REAL)',
      'departments (dept_id INT, dept_name TEXT, location TEXT, budget REAL)',
      'sales_transactions (txn_id INT, emp_id INT, amount REAL, txn_date DATE)'
    ],
    sampleQuery: `WITH RankedSalaries AS (
    SELECT 
        e.name,
        d.dept_name,
        e.salary,
        DENSE_RANK() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC) as rank_in_dept,
        SUM(e.salary) OVER (PARTITION BY e.dept_id ORDER BY e.hire_date) as rolling_dept_payroll
    FROM employees e
    JOIN departments d ON e.dept_id = d.dept_id
)
SELECT * FROM RankedSalaries WHERE rank_in_dept <= 2;`
  },
  {
    id: 'proj-4',
    title: 'Project 4: Apache PySpark Big Data Processing at Scale',
    category: 'Distributed Compute',
    difficulty: 'Advanced',
    badge: 'PySpark Core',
    summary: 'Process millions of simulated clickstream and purchase events using Apache PySpark. Implement the Catalyst Optimizer pipeline, size executor partitions, eliminate data skew bottlenecks using Salting, tune shuffle partitions, and apply Vectorized Pandas UDFs.',
    objectives: [
      'Ingest 2,000,000 event records into a Spark DataFrame with explicit StructType schema',
      'Apply narrow transformations (filter, project) and wide transformations (groupBy, join)',
      'Inspect physical execution DAG in Spark UI, spotting Exchange hashpartitioning boundaries',
      'Detect and resolve a severe data skew bottleneck on null user keys using Key Salting',
      'Optimize multi-table joins by broadcasting lookup dimension tables (broadcast(dim_df))',
      'Benchmark cached vs uncached DataFrame actions, achieving 20x+ memory read speedups'
    ],
    sparkMetrics: {
      recordsProcessed: '2,000,000',
      initialShufflePartitions: 200,
      optimizedShufflePartitions: 16,
      uncachedTime: '3.42s',
      cachedTime: '0.12s',
      speedup: '28.5x'
    }
  },
  {
    id: 'proj-5',
    title: 'Project 5: Real-Time Kafka Streaming & Lag Monitoring',
    category: 'Real-Time Streaming',
    difficulty: 'Advanced',
    badge: 'Kafka Streaming',
    summary: 'Build a distributed real-time event streaming pipeline using Apache Kafka. Configure multi-broker topics, deploy multi-consumer groups, measure consumer lag metrics, simulate broker failovers, and execute Spark Structured Streaming micro-batch aggregations.',
    objectives: [
      'Configure topic "orders_stream" with 6 partitions and replication-factor 3',
      'Deploy continuous producer publishing 500 events/sec with acks=all and message keys',
      'Set up a consumer group with 3 instances and observe CooperativeStickyAssignor partition distribution',
      'Monitor Consumer Lag via kafka-consumer-groups.sh and detect slow consumer bottlenecks',
      'Simulate leader broker crash and observe automated ISR leader re-election in <500ms',
      'Stream events into Spark Structured Streaming with watermarking and tumbling 1-minute window counts'
    ],
    clusterState: {
      brokers: [
        { id: 101, host: 'kafka-01:9092', isLeaderFor: [0, 3], status: 'ONLINE' },
        { id: 102, host: 'kafka-02:9092', isLeaderFor: [1, 4], status: 'ONLINE' },
        { id: 103, host: 'kafka-03:9092', isLeaderFor: [2, 5], status: 'ONLINE' }
      ],
      topic: 'orders_stream',
      partitions: 6,
      replicationFactor: 3,
      minInsyncReplicas: 2
    }
  },
  {
    id: 'proj-capstone',
    title: 'Final Capstone Project: End-to-End Enterprise Data Lakehouse Pipeline',
    category: 'Architectural Capstone',
    difficulty: 'Industry Ready',
    badge: 'Architect Capstone',
    summary: 'The ultimate data engineering capstone project: build an integrated enterprise pipeline from scratch uniting all technologies: Python Producer -> Apache Kafka Topic -> HDFS Storage (HA & Rack Aware) -> Spark Structured Streaming (Medallion Bronze/Silver/Gold) -> Hive/SQL Data Warehouse -> Airflow Orchestration & Data Quality Monitoring.',
    objectives: [
      '1. INGESTION: Python generator streams 50,000 purchase events into Kafka topic with acks=all',
      '2. STORAGE: Spark Structured Streaming ingests micro-batches into HDFS Bronze Parquet lake',
      '3. PROCESSING: PySpark Silver job cleans nulls, deduplicates via ROW_NUMBER(), writes partitioned Parquet',
      '4. DATA QUALITY: Great Expectations validates non-null primary keys and positive balances',
      '5. GOLD WAREHOUSE: Spark executes Broadcast Join with dim_users and aggregates daily sales marts',
      '6. SERVING & AUDIT: Hive Metastore catalog updated; Trino queries Gold layer in 35ms; Ranger logs access'
    ],
    pipelineStages: [
      { step: 1, name: 'Event Ingestion', tech: 'Python + Kafka', status: 'COMPLETED', latency: '2ms' },
      { step: 2, name: 'Distributed Storage', tech: 'HDFS 3-Rack Cluster', status: 'COMPLETED', latency: '15ms' },
      { step: 3, name: 'Micro-Batch Ingest (Bronze)', tech: 'Spark Structured Streaming', status: 'COMPLETED', latency: '420ms' },
      { step: 4, name: 'Cleanse & Deduplicate (Silver)', tech: 'PySpark + Window Functions', status: 'COMPLETED', latency: '850ms' },
      { step: 5, name: 'Data Quality Gate', tech: 'Great Expectations Assertions', status: 'PASSED', latency: '110ms' },
      { step: 6, name: 'Analytical Marts (Gold)', tech: 'Spark SQL Broadcast Join', status: 'COMPLETED', latency: '620ms' },
      { step: 7, name: 'Serving & BI Dashboard', tech: 'Hive Metastore + Trino SQL', status: 'READY', latency: '35ms' }
    ]
  }
];

