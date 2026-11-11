// Module 9: Advanced Data Engineering
export const module9 = {
  id: 'mod-9',
  title: 'Module 9: Advanced Data Engineering & Production Architecture',
  description: 'Master Apache Hive, Modern Data Warehouses, Data Lakes, Lakehouses, ETL vs ELT, Batch vs Streaming, Airflow orchestration, Data Quality, and Cloud Data Architecture.',
  badge: 'Architect Core',
  icon: 'Layers',
  lessons: [
    {
      id: 'm9-l1',
      title: 'Apache Hive & Distributed SQL Engines',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Apache Hive is a distributed data warehouse software system built on top of Apache Hadoop. Created at Facebook in 2008, Hive revolutionized big data analytics by allowing engineers and SQL analysts to write queries using HiveQL (a SQL dialect) without writing complex Java MapReduce code. Hive abstracts HDFS files into traditional tabular structures (databases, tables, views, partitions, buckets). Hive relies on the Hive Metastore (HMS) to map table metadata to HDFS directories and uses modern execution engines like Apache Tez or Apache Spark instead of legacy MapReduce.',
        hi: 'Apache Hive distributed data warehouse software hai jise 2008 me Facebook ne banaya tha. Pehle Hadoop me chhota sa analysis karne ke liye bhi 200 line ka Java MapReduce code likhna padta tha. Hive ne SQL jaisi language (HiveQL) introduce ki — aap normal SELECT query likhte ho, aur Hive use internally distributed Spark ya Tez jobs me convert kar deta hai! Hive ke tables HDFS me folders hote hain, aur unka sara metadata Hive Metastore me store hota hai.'
      },
      why: 'Enterprise data lakes store millions of files across terabytes of storage. Without Hive\'s catalog and tabular abstraction, BI tools, data analysts, and ML engineers cannot discover or query datasets using standard SQL.',
      how: '1. Parser & Semantic Analyzer: Translates HiveQL AST into an optimized Directed Acyclic Graph (DAG).\n2. Metastore Lookup: Resolves table schema, partition locations, and column datatypes from PostgreSQL/MySQL.\n3. Physical Execution: Submits the compiled DAG to the Tez or Spark execution engine running on YARN.\n4. Partitions & Buckets: Partitions split data into directory subfolders (e.g. year=2026/); Buckets hash-partition data into fixed-size files for fast map-side joins.',
      architecture: {
        type: 'hive_architecture_flow',
        title: 'Apache Hive Core Architecture',
        nodes: [
          { name: 'Hive Client / Beeline CLI', desc: 'Submits ANSI HiveQL queries over JDBC/ODBC (port 10000)' },
          { name: 'HiveServer2 (HS2)', desc: 'Session manager, query compiler, and optimizer' },
          { name: 'Hive Metastore (HMS)', desc: 'Central metadata catalog backed by PostgreSQL/MySQL (port 9083)' },
          { name: 'Execution Engine & HDFS', desc: 'Apache Tez / Spark executing tasks on HDFS storage files' }
        ]
      },
      industryExample: 'Facebook and Cloudera manage Hive metastores indexing exabytes of data, serving thousands of concurrent analytical queries every minute.',
      practicalLab: {
        title: 'Lab 9.1: Creating Partitioned and Bucketed Hive Tables',
        problemStatement: 'Inspect a HiveQL schema definition featuring dynamic partitioning and bucketing for query acceleration.',
        requirements: 'Terminal simulator.',
        setup: 'mkdir -p ~/bigdata_lab/m9_l1 && cd ~/bigdata_lab/m9_l1',
        instructions: [
          'Step 1: Write an enterprise Hive DDL script.',
          'Step 2: Inspect partitioning and bucketing clauses.'
        ],
        code: `# hive_ddl_lab.sh
cat << 'EOF' > /tmp/create_hive_table.sql
CREATE EXTERNAL TABLE IF NOT EXISTS analytics.web_logs (
    session_id STRING,
    user_id BIGINT,
    page_url STRING,
    response_time_ms INT
)
PARTITIONED BY (dt STRING, country STRING)
CLUSTERED BY (user_id) INTO 16 BUCKETS
STORED AS PARQUET
LOCATION 'hdfs:///warehouse/analytics/web_logs'
TBLPROPERTIES ("parquet.compression"="SNAPPY");
EOF
cat /tmp/create_hive_table.sql
`,
        commands: [
          'cat /tmp/create_hive_table.sql'
        ]
      },
      expectedOutput: `CREATE EXTERNAL TABLE IF NOT EXISTS analytics.web_logs (
    session_id STRING,
    user_id BIGINT,
    page_url STRING,
    response_time_ms INT
)
PARTITIONED BY (dt STRING, country STRING)
CLUSTERED BY (user_id) INTO 16 BUCKETS
STORED AS PARQUET
LOCATION 'hdfs:///warehouse/analytics/web_logs'
TBLPROPERTIES ("parquet.compression"="SNAPPY");`,
      troubleshooting: [
        {
          error: 'Execution Error, return code 1 from org.apache.hadoop.hive.ql.exec.DDLTask. MetaException: Could not connect to meta store',
          rootCause: 'The Hive Metastore daemon is offline or backing MySQL database has hit max connection pool limit.',
          solution: 'Start the Hive Metastore service: hive --service metastore & and ensure port 9083 is listening.'
        }
      ],
      bestPractices: [
        'Always use Apache Tez or Spark as the Hive execution engine (set hive.execution.engine=tez;); never use MapReduce.',
        'Always STORE AS PARQUET or ORC with SNAPPY compression rather than raw text files.',
        'Use Bucketing (CLUSTERED BY ... INTO N BUCKETS) on high-cardinality join keys to enable fast Bucket-Map-Joins.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between Partitioning and Bucketing in Apache Hive?',
          answer: 'Partitioning physically divides table data into separate subdirectories based on low-cardinality column values (e.g. dt=2026-11-11/country=IN/). It enables Partition Pruning, allowing queries to skip scanning unneeded folders. Bucketing (Clustering) subdivides data within a partition into a fixed number of files based on a hash of a high-cardinality column (hash(user_id) % num_buckets). Bucketing accelerates joins (Bucket-Map-Joins) and optimizes sampling.'
        },
        {
          level: 'Intermediate',
          question: 'What is the role of HiveServer2 and the Beeline CLI?',
          answer: 'HiveServer2 (HS2) is the multi-tenant server daemon that enables remote clients to execute queries against Hive over JDBC/ODBC, supporting concurrent connections, authentication (Kerberos/LDAP), and authorization. Beeline is the modern, secure command-line shell used by engineers to connect to HiveServer2 via JDBC (replacing the deprecated legacy "hive" CLI).'
        },
        {
          level: 'Advanced',
          question: 'What is a Bucket-Map-Join (BMJ) and Sort-Merge-Bucket (SMB) Join in Hive?',
          answer: 'If two large tables are both bucketed on the join key into the same number of buckets (or multiples), a Bucket-Map-Join can join corresponding bucket files locally in mapper memory without a full cluster shuffle. If the bucket files are also sorted by the join key (SORTED BY), a Sort-Merge-Bucket (SMB) Join merges the pre-sorted files linearly without any sorting or memory hashing, scaling to petabytes with minimum CPU overhead.'
        }
      ],
      assignment: {
        task: 'Display the Hive DDL script using cat /tmp/create_hive_table.sql in terminal and inspect the PARTITIONED BY and CLUSTERED BY syntax.',
        verificationCriteria: 'Run cat /tmp/create_hive_table.sql.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which clause in HiveQL physically splits a partition into a fixed number of hash-bucketed files on disk?',
            options: ['PARTITIONED BY', 'CLUSTERED BY (col) INTO N BUCKETS', 'GROUP BY', 'DISTRIBUTE BY'],
            correct: 1,
            explanation: 'CLUSTERED BY (col) INTO N BUCKETS divides data into fixed hash buckets.'
          }
        ],
        commandChallenge: {
          prompt: 'Display the Hive table creation DDL script.',
          expectedCommand: 'cat /tmp/create_hive_table.sql'
        }
      }
    },
    {
      id: 'm9-l2',
      title: 'Data Warehousing Fundamentals & Dimensional Modeling',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'A Data Warehouse (DW) is a centralized, subject-oriented, integrated, time-variant, and non-volatile collection of data designed to support management decision-making. Ralph Kimball\'s Dimensional Modeling is the foundation of data warehouse architecture. It breaks data into two fundamental table types: 1. Fact Tables (store quantitative metrics, measurements, or transactional events like sales, impressions, fares) and 2. Dimension Tables (store descriptive textual context attributes like customers, dates, stores, products). The two dominant schemas are the Star Schema (denormalized, fast joins) and the Snowflake Schema (normalized dimensions).',
        hi: 'Data Warehouse (DW) company ka centralized analytical dimaag hota hai jahan historical data ko business analytics ke liye store kiya jaata hai. Ralph Kimball ki "Dimensional Modeling" iski neev hai. Isme do tarah ke tables hote hain: 1. Fact Tables (jinme numerical numbers aur metrics hote hain — jaise sale amount, quantity, profit), aur 2. Dimension Tables (jinme context hota hai — kaun sa customer, kaun sa store, kaun si date). Star Schema sabse popular design hai jisme beech me ek Fact table hoti hai aur chaaron taraf Dimension tables judi hoti hain.'
      },
      why: 'Querying transactional OLTP databases directly for analytics slows down customer purchases. A dimensional data warehouse optimizes analytical queries, providing unified corporate metrics across business units.',
      how: '1. Identify Business Process: Orders, Rides, or Shipments.\n2. Declare the Grain: Exactly what one fact row represents (e.g. "One line-item on a customer receipt").\n3. Identify Dimensions: Who, What, Where, When, Why (Date, Customer, Product, Store).\n4. Identify Facts: Revenue, Discount, Cost, Profit.\n5. Surrogate Keys: Auto-generated integer keys (customer_sk) used instead of volatile natural keys.',
      architecture: {
        type: 'star_schema_diagram',
        title: 'Kimball Star Schema Architecture',
        nodes: [
          { name: 'dim_date', desc: 'date_sk, full_date, day_name, month, quarter, year, is_holiday' },
          { name: 'dim_customer', desc: 'customer_sk, customer_id, name, city, state, tier' },
          { name: 'fact_sales (Central)', desc: 'sale_id, date_sk, customer_sk, product_sk, quantity, revenue, margin' },
          { name: 'dim_product', desc: 'product_sk, product_id, title, category, brand, unit_cost' }
        ]
      },
      industryExample: 'Snowflake, Google BigQuery, and Amazon Redshift implementations across Fortune 500 enterprises are organized strictly around Kimball dimensional models to serve corporate executive dashboards.',
      practicalLab: {
        title: 'Lab 9.2: Modeling a Star Schema in SQL',
        problemStatement: 'Create dim_customer, dim_product, and central fact_sales tables and execute an aggregated analytical star join.',
        requirements: 'Python SQLite.',
        setup: 'mkdir -p ~/bigdata_lab/m9_l2 && cd ~/bigdata_lab/m9_l2',
        instructions: [
          'Step 1: Write an SQL script populating a Star Schema.',
          'Step 2: Run using python3.',
          'Step 3: Execute a multi-dimensional star query.'
        ],
        code: `# star_schema_lab.py
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

# Dimension 1: Customer
cur.execute("""
CREATE TABLE dim_customer (
    customer_sk INTEGER PRIMARY KEY,
    name TEXT,
    tier TEXT
)
""")
cur.executemany("INSERT INTO dim_customer VALUES (?, ?, ?)", [
    (1, "Aarav Sharma", "VIP"),
    (2, "Diya Patel", "Regular")
])

# Dimension 2: Product
cur.execute("""
CREATE TABLE dim_product (
    product_sk INTEGER PRIMARY KEY,
    category TEXT,
    price REAL
)
""")
cur.executemany("INSERT INTO dim_product VALUES (?, ?, ?)", [
    (101, "Electronics", 1200.0),
    (102, "Books", 50.0)
])

# Central Fact Table
cur.execute("""
CREATE TABLE fact_sales (
    sale_id INTEGER PRIMARY KEY,
    customer_sk INTEGER,
    product_sk INTEGER,
    quantity INTEGER,
    total_amount REAL,
    FOREIGN KEY(customer_sk) REFERENCES dim_customer(customer_sk),
    FOREIGN KEY(product_sk) REFERENCES dim_product(product_sk)
)
""")
cur.executemany("INSERT INTO fact_sales VALUES (?, ?, ?, ?, ?)", [
    (1, 1, 101, 1, 1200.0),
    (2, 1, 102, 3, 150.0),
    (3, 2, 102, 1, 50.0)
])

# Star Query
query = """
SELECT 
    c.tier,
    p.category,
    SUM(f.quantity) as units_sold,
    SUM(f.total_amount) as total_revenue
FROM fact_sales f
JOIN dim_customer c ON f.customer_sk = c.customer_sk
JOIN dim_product p ON f.product_sk = p.product_sk
GROUP BY c.tier, p.category;
"""

df = pd.read_sql_query(query, conn)
print("--- Star Schema Dimensional Query Results ---")
print(df)
`,
        commands: [
          'python3 star_schema_lab.py'
        ]
      },
      expectedOutput: `--- Star Schema Dimensional Query Results ---
      tier     category  units_sold  total_revenue
0  Regular        Books           1           50.0
1      VIP        Books           3          150.0
2      VIP  Electronics           1         1200.0`,
      troubleshooting: [
        {
          error: 'Slow analytical queries taking minutes across large dimension joins',
          rootCause: 'Joining fact table to dimensions on unindexed text natural keys (e.g. email or UUID) instead of integer surrogate keys.',
          solution: 'Always use 4-byte or 8-byte integer Surrogate Keys (customer_sk) for dimensional joins.'
        }
      ],
      bestPractices: [
        'Always establish a clearly declared "Grain" for every fact table before writing DDL.',
        'Use integer Surrogate Keys instead of natural business keys for dimension primary keys.',
        'Denormalize dimension tables in Star Schemas to minimize join overhead during ad-hoc reporting.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between a Fact Table and a Dimension Table?',
          answer: 'A Fact Table stores quantitative, numerical measurements or business metrics (e.g. sales revenue, quantity sold, ride duration, temperature) associated with foreign keys. A Dimension Table stores descriptive, qualitative contextual attributes (e.g. customer name, product category, store location, date details) that provide the who, what, where, and when context for analyzing the facts.'
        },
        {
          level: 'Intermediate',
          question: 'What are Slowly Changing Dimensions (SCD) and how do SCD Type 1 and Type 2 differ?',
          answer: 'Slowly Changing Dimensions (SCD) handle how dimension attribute values change over time (e.g. a customer moves from Delhi to Mumbai). SCD Type 1 overwrites the old value directly with the new value (no historical record is preserved). SCD Type 2 creates a new row with a new surrogate key, marking the old row with an end_date and is_current = FALSE, preserving complete historical tracking.'
        },
        {
          level: 'Advanced',
          question: 'What is a "Factless Fact Table" and give an enterprise use case?',
          answer: 'A Factless Fact Table is a fact table that contains no numerical measurements or additive facts; it consists entirely of a collection of foreign keys pointing to dimension tables. Enterprise use case: Tracking university student class attendance (student_sk, course_sk, date_sk, room_sk). The mere presence of a record indicates that an event occurred.'
        }
      ],
      assignment: {
        task: 'Execute python3 star_schema_lab.py in terminal and verify the dimensional aggregation results.',
        verificationCriteria: 'Run the command and observe the tier and category aggregation.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which SCD (Slowly Changing Dimension) strategy retains historical record changes by inserting a new row with validity date ranges and an is_current flag?',
            options: ['SCD Type 0', 'SCD Type 1', 'SCD Type 2', 'SCD Type 3'],
            correct: 2,
            explanation: 'SCD Type 2 preserves complete history by creating a new version of the row with start_date and end_date.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the star schema laboratory script.',
          expectedCommand: 'python3 star_schema_lab.py'
        }
      }
    },
    {
      id: 'm9-l3',
      title: 'Data Lakes, Formats & Lakehouses (Parquet, Delta Lake, Iceberg)',
      duration: '50 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'The evolution of enterprise data storage moved from rigid Data Warehouses to Data Lakes, and finally to modern Lakehouses:\n- Data Lake: Stores raw, semi-structured, and unstructured data at low cost on distributed storage (HDFS, Amazon S3, Google Cloud Storage). However, legacy data lakes suffered from lack of ACID transactions, dirty reads, and "Data Swamp" degradation.\n- Modern Lakehouse: Combines the low-cost scalability of data lakes with the ACID transactions, schema enforcement, and time travel of relational data warehouses.\n- Modern Open Table Formats: Apache Iceberg, Delta Lake, and Apache Hudi add a transaction metadata layer on top of open columnar Parquet files, enabling concurrent ACID writes, schema evolution, and time-travel rollbacks.',
        hi: 'Data storage ki duniya me 3 bhole badlav aaye hain:\n1. Data Warehouse: Fast tha par bohot mehenga aur rigid tha.\n2. Data Lake (HDFS/S3): Saste me petabytes data store kar sakta tha, par isme ACID transactions nahi the — agar job beech me crash ho jaye toh adha corrupt data reh jaata tha (ise "Data Swamp" kehte the).\n3. Modern Lakehouse (Delta Lake, Apache Iceberg): Ye dono ka best combination hai! Ye saste Parquet files par ek ACID transaction log (Delta Log) laga deta hai. Isse aap Big Data par bhi SQL UPDATE, DELETE, aur Time Travel (pichle hafte ka data dekhna) kar sakte ho!'
      },
      why: 'Regulations like GDPR mandate the "Right to be Forgotten" (deleting customer records across petabytes). In legacy HDFS/S3 data lakes, deleting 1 row required rewriting an entire 500 GB dataset. Lakehouse formats (Delta/Iceberg) perform row-level deletes and ACID merges effortlessly.',
      how: '1. Parquet Columnar: Compressed column stripes + Thrift footer containing min/max stats per column.\n2. Delta Lake / Iceberg ACID Log: Commits JSON/Avro log entries before marking files valid.\n3. Time Travel: spark.read.format("delta").option("versionAsOf", 5).load("path/")\n4. ACID MERGE (Upsert): MERGE INTO target USING updates ON target.id = updates.id WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ...',
      architecture: {
        type: 'lakehouse_storage_layers',
        title: 'Modern Lakehouse Table Architecture (Parquet + ACID Log)',
        nodes: [
          { name: 'Storage Engine (HDFS / S3 / GCS)', desc: 'Raw Snappy-compressed Apache Parquet columnar data files' },
          { name: 'ACID Transaction Metadata Layer', desc: 'Delta Log (_delta_log/*.json) or Iceberg Metadata snapshots' },
          { name: 'Compute Engines (Decoupled)', desc: 'Apache Spark, Trino/Presto, Snowflake, DuckDB reading same files' }
        ]
      },
      industryExample: 'Netflix migrated their entire multi-petabyte data platform to Apache Iceberg, achieving 10x faster query planning and atomic multi-table commit guarantees across AWS S3.',
      practicalLab: {
        title: 'Lab 9.3: Inspecting Parquet Columnar Metadata and ACID Logs',
        problemStatement: 'Inspect how Parquet organizes columnar chunks and observe how ACID transaction logs track snapshot versions.',
        requirements: 'Terminal simulator.',
        setup: 'mkdir -p ~/bigdata_lab/m9_l3 && cd ~/bigdata_lab/m9_l3',
        instructions: [
          'Step 1: Create a simulated Delta Lake / Iceberg metadata directory.',
          'Step 2: Inspect transaction log commit entries.',
          'Step 3: Understand how atomic snapshot isolation works.'
        ],
        code: `# lakehouse_inspect_lab.sh
mkdir -p /tmp/lakehouse/customer_orders/_delta_log
cat << 'EOF' > /tmp/lakehouse/customer_orders/_delta_log/00000000000000000000.json
{"commitInfo":{"timestamp":1731315000000,"operation":"WRITE","operationParameters":{"mode":"Append"}}}
{"protocol":{"minReaderVersion":1,"minWriterVersion":2}}
{"metaData":{"id":"c8a7","format":{"provider":"parquet"},"schemaString":"{\\"type\\":\\"struct\\",\\"fields\\":[{\\"name\\":\\"id\\",\\"type\\":\\"integer\\"},{\\"name\\":\\"amount\\",\\"type\\":\\"double\\"}]}"}}
{"add":{"path":"part-00000-c8a7.snappy.parquet","size":4520,"modificationTime":1731315000000,"dataChange":true}}
EOF
cat /tmp/lakehouse/customer_orders/_delta_log/00000000000000000000.json
`,
        commands: [
          'cat /tmp/lakehouse/customer_orders/_delta_log/00000000000000000000.json'
        ]
      },
      expectedOutput: `{"commitInfo":{"timestamp":1731315000000,"operation":"WRITE","operationParameters":{"mode":"Append"}}}
{"protocol":{"minReaderVersion":1,"minWriterVersion":2}}
{"metaData":{"id":"c8a7","format":{"provider":"parquet"},"schemaString":"{\"type\":\"struct\",\"fields\":[{\"name\":\"id\",\"type\":\"integer\"},{\"name\":\"amount\",\"type\":\"double\"}]}"}}
{"add":{"path":"part-00000-c8a7.snappy.parquet","size":4520,"modificationTime":1731315000000,"dataChange":true}}`,
      troubleshooting: [
        {
          error: 'DeltaConcurrentModificationException: Multiple concurrent transactions attempted to update the same table',
          rootCause: 'Two independent Spark jobs attempted to execute concurrent MERGE/UPDATE operations modifying the same partition files.',
          solution: 'Delta Lake uses Optimistic Concurrency Control (OCC); enable automatic retry on conflict or partition writes so jobs touch mutually exclusive partition folders.'
        }
      ],
      bestPractices: [
        'Adopt open table formats (Delta Lake or Apache Iceberg) instead of raw loose Parquet files for all modern data lakes.',
        'Run OPTIMIZE / VACCUM periodically to compact small files and clean up historical tombstones.',
        'Leverage Time Travel for audit compliance, automated rollbacks, and reproducible machine learning datasets.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Data Lakehouse and what advantages does it offer over a traditional Data Lake?',
          answer: 'A Data Lakehouse combines the best elements of Data Lakes (low-cost, scalable cloud object storage for structured and unstructured data) and Data Warehouses (ACID transactions, data versioning, schema enforcement, and high-performance SQL governance). It eliminates the need to maintain two separate systems (an S3 lake and an expensive Redshift/Snowflake warehouse).'
        },
        {
          level: 'Intermediate',
          question: 'How do Apache Iceberg and Delta Lake enable ACID transactions on top of object storage like S3?',
          answer: 'Object storage systems like S3 are eventually consistent and lack atomic file renames. Iceberg and Delta Lake introduce an atomic transaction log (commit log) composed of immutable JSON/Avro metadata files. When a job writes data, it writes new Parquet files, but they are invisible to readers until an atomic commit is appended to the transaction log. Readers read strictly from the latest committed snapshot, providing full Serializability and ACID guarantees.'
        },
        {
          level: 'Advanced',
          question: 'What is "Time Travel" in Delta Lake / Iceberg and how is it implemented under the hood?',
          answer: 'Time Travel is the ability to query a table as it existed at a specific timestamp or historical version number in the past (e.g. SELECT * FROM tbl VERSION AS OF 4). It is implemented because Delta Lake and Iceberg never overwrite data in-place; modifications create new Parquet files and record file additions and deletions ("tombstones") in the transaction log. Querying an older version simply reads the transaction log up to that version number, pointing to the exact set of Parquet files active at that point in time.'
        }
      ],
      assignment: {
        task: 'Execute cat /tmp/lakehouse/customer_orders/_delta_log/00000000000000000000.json in terminal and review the atomic commit metadata.',
        verificationCriteria: 'Run the command and observe the commitInfo and schemaString.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which open table format developed at Netflix uses tree-structured metadata files to provide fast query planning and ACID guarantees on massive cloud data lakes?',
            options: ['Apache Iceberg', 'Hadoop MapReduce', 'CSV format', 'SQLite'],
            correct: 0,
            explanation: 'Apache Iceberg was developed at Netflix to provide atomic metadata snapshots and high-performance query planning on cloud storage.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect the Delta Lake commit log file.',
          expectedCommand: 'cat /tmp/lakehouse/customer_orders/_delta_log/00000000000000000000.json'
        }
      }
    },
    {
      id: 'm9-l4',
      title: 'ETL vs ELT Paradigms',
      duration: '40 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'ETL (Extract, Transform, Load) and ELT (Extract, Load, Transform) are the two primary data integration paradigms.\n- ETL (Traditional): Data is extracted from source systems, transformed on a dedicated middle-tier processing cluster (e.g. Spark, Informatica) to protect destination storage, and finally loaded into the database/warehouse. Standard for legacy on-premise systems with limited database storage and compute.\n- ELT (Modern Cloud): Raw data is extracted and IMMEDIATELY loaded directly into modern scalable cloud storage / warehouses (Snowflake, BigQuery, Databricks, Redshift). Transformations are executed downstream inside the warehouse using SQL tools like dbt (data build tool), leveraging the near-infinite elasticity of cloud MPP engines.',
        hi: 'ETL aur ELT data integration ke do alag tareeqe hain:\n- ETL (Extract, Transform, Load): Pehle data nikalte hain, beech me kisi alag server par clean/transform karte hain, aur fir clean data warehouse me load karte hain (traditional tareeqa).\n- ELT (Extract, Load, Transform): Modern cloud tareeqa! Pehle saara raw data bina chhede seedha Snowflake ya BigQuery me load kar dete hain (Extract & Load), aur fir warehouse ke andar hi SQL (dbt) se transform karte hain. Iska fayda ye hai ki raw data humesha safe rehta hai aur cloud warehouse ki infinite computing power use hoti hai.'
      },
      why: 'In ELT, raw data is never discarded. If business logic changes 6 months later, you do not need to re-extract data from upstream transactional systems; you simply re-run your dbt SQL transformations directly against the historical raw data in the warehouse.',
      how: '1. ETL Pipeline: Postgres -> Python/Spark transform -> Load to MySQL.\n2. ELT Pipeline: Postgres -> Fivetran/Airbyte (Raw Load) -> Snowflake Bronze Raw -> dbt SQL transformation -> Snowflake Gold Mart.\n3. Separation of Concerns: In ELT, software engineers handle data extraction/loading, while analytics engineers handle data transformation via SQL.',
      architecture: {
        type: 'etl_vs_elt_comparison',
        title: 'ETL vs ELT Architectural Comparison',
        nodes: [
          { name: 'ETL (Extract -> Transform -> Load)', desc: 'Transformations happen in external compute server before loading clean data' },
          { name: 'ELT (Extract -> Load -> Transform)', desc: 'Raw data loaded directly to Lakehouse; transformed in-place using SQL / dbt' },
          { name: 'Key ELT Benefit', desc: 'Preserves raw historical fidelity, decouples ingestion from business modeling' }
        ]
      },
      industryExample: 'GitLab, Canva, and Monzo run pure ELT architectures: ingesting raw events into Snowflake using Fivetran, and transforming all metrics downstream using over 3,000 dbt SQL models.',
      practicalLab: {
        title: 'Lab 9.4: Simulating an In-Warehouse ELT Transformation Flow',
        problemStatement: 'Load raw unparsed data directly into a staging table, and execute downstream transformation using SQL in-place.',
        requirements: 'Python SQLite.',
        setup: 'mkdir -p ~/bigdata_lab/m9_l4 && cd ~/bigdata_lab/m9_l4',
        instructions: [
          'Step 1: Write an ELT demonstration script.',
          'Step 2: Run using python3.',
          'Step 3: Verify the in-database transformation output.'
        ],
        code: `# elt_simulation_lab.py
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

# 1. LOAD RAW DATA DIRECTLY (Extract & Load)
cur.execute("CREATE TABLE raw_landing_orders (payload TEXT)")
cur.executemany("INSERT INTO raw_landing_orders VALUES (?)", [
    ("101|Aarav|1500.00|SUCCESS|2026-11-11"),
    ("102|Diya|250.00|PENDING|2026-11-11"),
    ("103|Rohan|800.00|SUCCESS|2026-11-11")
])

# 2. TRANSFORM IN-PLACE DOWNSTREAM (dbt style ELT)
cur.execute("""
CREATE TABLE analytics_clean_orders AS
SELECT 
    CAST(SUBSTR(payload, 1, INSTR(payload, '|') - 1) AS INT) as order_id,
    'VALIDATED' as pipeline_status
FROM raw_landing_orders;
""")

df = pd.read_sql_query("SELECT * FROM analytics_clean_orders", conn)
print("--- ELT In-Database Transformed Table ---")
print(df)
`,
        commands: [
          'python3 elt_simulation_lab.py'
        ]
      },
      expectedOutput: `--- ELT In-Database Transformed Table ---
   order_id pipeline_status
0       101       VALIDATED
1       102       VALIDATED
2       103       VALIDATED`,
      troubleshooting: [
        {
          error: 'Cloud warehouse bill spikes 300% after migrating to ELT',
          rootCause: 'Running full table rebuilds (dbt run --full-refresh) every 15 minutes instead of incremental models (is_incremental()).',
          solution: 'Implement incremental models in dbt filtering on WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }}).'
        }
      ],
      bestPractices: [
        'Adopt ELT for cloud data warehouses (Snowflake, BigQuery, Databricks) to leverage distributed compute elasticity.',
        'Use ETL when strict privacy regulations forbid storing raw unmasked PII (Personally Identifiable Information) in the warehouse.',
        'Always version-control downstream SQL transformations using dbt (data build tool).'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the main difference between ETL and ELT?',
          answer: 'In ETL (Extract, Transform, Load), data is transformed on an external compute server (e.g. Spark) BEFORE loading clean data into the target database. In ELT (Extract, Load, Transform), raw data is loaded directly into the target cloud warehouse/lake first, and transformations are executed in-place using the warehouse\'s own compute engine (typically via SQL/dbt).'
        },
        {
          level: 'Intermediate',
          question: 'Why has the data industry largely shifted from ETL to ELT in recent years?',
          answer: 'The shift was driven by modern cloud data warehouses (Snowflake, BigQuery) that decouple storage from compute and provide near-infinite elasticity. ELT preserves raw historical data permanently, reduces ingestion pipeline complexity, enables self-service analytics for SQL engineers, and eliminates the need to maintain expensive middle-tier transformation clusters.'
        },
        {
          level: 'Advanced',
          question: 'When is traditional ETL still preferred over ELT in modern architectures?',
          answer: 'ETL is preferred when: 1. Strict Data Privacy / Compliance: Raw data contains sensitive PII, credit card PANs, or health records that legally cannot enter the data warehouse even in raw form; it must be masked or tokenized in-flight. 2. Heavy Unstructured Compute: Audio, video, and computer vision processing that cannot be expressed in SQL. 3. Target Database Constraints: The destination is a legacy OLTP or proprietary database with limited compute power.'
        }
      ],
      assignment: {
        task: 'Execute python3 elt_simulation_lab.py in terminal and verify the in-place SQL transformation.',
        verificationCriteria: 'Run the command and observe the transformed order IDs.'
      },
      assessment: {
        quiz: [
          {
            q: 'In modern cloud architectures, which tool is the industry standard for executing downstream transformations in ELT pipelines using modular SQL?',
            options: ['dbt (data build tool)', 'Sqoop', 'Flume', 'Oozie'],
            correct: 0,
            explanation: 'dbt (data build tool) enables analytics engineers to transform data in-place inside warehouses using modular SQL.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the ELT in-database transformation script.',
          expectedCommand: 'python3 elt_simulation_lab.py'
        }
      }
    },
    {
      id: 'm9-l5',
      title: 'Batch vs Stream Processing (Lambda vs Kappa Architecture)',
      duration: '50 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'Data processing falls into two operational paradigms: Batch Processing (processing bounded, historical datasets at scheduled intervals, e.g. hourly or daily via Spark/MapReduce) and Stream Processing (processing unbounded, real-time event streams continuously with millisecond/second latency via Kafka, Flink, or Spark Streaming). To combine both, two major architectural frameworks emerged:\n- LAMBDA ARCHITECTURE: Dual-path design. A Batch Layer (HDFS/Spark) computes accurate historical views, while a Speed Layer (Kafka/Storm/Flink) computes low-latency real-time views. The Serving Layer merges results. Main drawback: Double codebase maintenance (one in Java/SQL for batch, another for streaming).\n- KAPPA ARCHITECTURE: Single-path design. Eliminates the batch layer entirely; ALL data processing is treated as a stream using a distributed log (Kafka) and a stream processor (Flink/Spark). Historical reprocessing is executed simply by replaying the Kafka commit log from offset 0.',
        hi: 'Big Data me kaam do tareeqe se hota hai: Batch Processing (historical data par scheduled run karna, jaise har raat 12 baje poore din ki calculation karna) aur Stream Processing (real-time me aane wale har event ko usi second process karna). Inhe jodne ke liye do architectures aayi:\n- LAMBDA ARCHITECTURE: Isme do alag-alag pipelines hoti hain — ek Batch pipeline (slow par 100% accurate) aur ek Speed pipeline (fast real-time). Iska nuksan ye tha ki engineers ko do alag codebases maintain karne padte the.\n- KAPPA ARCHITECTURE: Modern single-engine architecture! Isme batch layer ko uda diya gaya — saara data sirf ek streaming engine (Kafka + Flink/Spark) se hi process hota hai. Historical data dekhne ke liye bas Kafka ke stream ko shuru se replay kar diya jaata hai.'
      },
      why: 'Maintaining two separate codebases in Lambda Architecture leads to code drift where real-time metrics disagree with batch reports. Kappa Architecture ensures 100% consistency by using identical transformation logic across real-time and historical replay.',
      how: '1. Lambda Batch: Spark reads S3 once every 24 hours -> writes Batch Views to Cassandra.\n2. Lambda Speed: Flink reads Kafka continuously -> writes Real-Time Views to Redis.\n3. Lambda Serving: API queries: BatchView + RealTimeView.\n4. Kappa Pipeline: Kafka Event Stream -> Flink / Spark Structured Streaming -> Delta Lake Lakehouse (Unified Serving).',
      architecture: {
        type: 'lambda_vs_kappa_architecture',
        title: 'Lambda vs Kappa Architecture Comparison',
        nodes: [
          { name: 'Lambda Architecture (Dual-Path)', desc: 'Batch Layer (HDFS/Spark) + Speed Layer (Kafka/Flink) -> Merged Serving View (Complex code maintenance)' },
          { name: 'Kappa Architecture (Single-Path)', desc: 'Single Stream Pipeline (Kafka -> Flink/Spark Streaming -> Lakehouse) -> 100% Code reuse' },
          { name: 'Industry Trend', desc: 'Enterprises rapidly migrating from Lambda to Kappa / Delta Lakehouses' }
        ]
      },
      industryExample: 'Uber migrated its surge pricing and driver dispatch platforms from a complex dual-layer Lambda architecture to a unified Kappa architecture on Apache Flink and Kafka, cutting engineering maintenance costs by 50%.',
      practicalLab: {
        title: 'Lab 9.5: Simulating a Unified Kappa Streaming Replay',
        problemStatement: 'Simulate replaying historical stream events to compute metrics using a single unified stream processor.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m9_l5 && cd ~/bigdata_lab/m9_l5',
        instructions: [
          'Step 1: Write a Kappa streaming replay script.',
          'Step 2: Run using python3.',
          'Step 3: Observe historical replay producing identical results to live streaming.'
        ],
        code: `# kappa_replay_lab.py
historical_event_log = [
    {"offset": 0, "event": "ORDER_PLACED", "amount": 100},
    {"offset": 1, "event": "ORDER_PLACED", "amount": 250},
    {"offset": 2, "event": "ORDER_CANCELLED", "amount": 100},
    {"offset": 3, "event": "ORDER_PLACED", "amount": 400}
]

# Unified Stream Processing Function (Used for BOTH live & replay)
def process_event_stream(stream):
    net_revenue = 0
    total_orders = 0
    for record in stream:
        if record["event"] == "ORDER_PLACED":
            net_revenue += record["amount"]
            total_orders += 1
        elif record["event"] == "ORDER_CANCELLED":
            net_revenue -= record["amount"]
    return {"orders": total_orders, "net_revenue": net_revenue}

print("=== Kappa Architecture: Replaying Log from Offset 0 ===")
metrics = process_event_stream(historical_event_log)
print(f"Total Valid Orders: {metrics['orders']}")
print(f"Net Revenue:        \${metrics['net_revenue']}")
`,
        commands: [
          'python3 kappa_replay_lab.py'
        ]
      },
      expectedOutput: `=== Kappa Architecture: Replaying Log from Offset 0 ===
Total Valid Orders: 3
Net Revenue:        $650`,
      troubleshooting: [
        {
          error: 'Dual-pipeline discrepancy: Real-time dashboard reports $5M revenue, but nightly batch report reports $4.8M',
          rootCause: 'Lambda Architecture code drift: business transformation logic in the Python batch job differed from the Scala streaming job.',
          solution: 'Migrate to unified Kappa architecture using Apache Beam or Spark Structured Streaming where the exact same code executes in batch and stream.'
        }
      ],
      bestPractices: [
        'Prefer Kappa Architecture over Lambda Architecture for new streaming projects to avoid dual-codebase maintenance.',
        'Use Apache Beam or Spark Structured Streaming to author unified transformation pipelines that run in batch or streaming mode.',
        'Retain historical raw data in long-retention Kafka topics or Parquet lakehouses to enable re-streaming.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between Batch Processing and Stream Processing?',
          answer: 'Batch Processing operates on bounded, static historical datasets at scheduled intervals (e.g. hourly or daily), prioritizing high throughput over latency (takes minutes or hours). Stream Processing operates continuously on unbounded, real-time event streams as data arrives, prioritizing low latency (milliseconds to seconds).'
        },
        {
          level: 'Intermediate',
          question: 'What is Lambda Architecture and what was its major operational drawback?',
          answer: 'Lambda Architecture combines a Batch Layer (e.g. Spark/HDFS for accurate historical views) and a Speed Layer (e.g. Flink/Kafka for real-time low-latency views) with a Serving Layer that merges queries. Its major drawback is the dual-codebase problem: developers must maintain two completely different codebases (one for batch, one for streaming), leading to code drift, debugging nightmares, and inconsistent metrics.'
        },
        {
          level: 'Advanced',
          question: 'How does Kappa Architecture eliminate the need for a separate batch layer?',
          answer: 'Kappa Architecture treats ALL data processing as a stream. It uses an append-only distributed log (like Apache Kafka) as the permanent storage layer and a single stream processing engine (like Apache Flink or Spark Streaming). To perform historical reprocessing or update business logic, you simply start a new instance of the streaming job and replay the Kafka log from offset 0, reading historical data at maximum throughput.'
        }
      ],
      assignment: {
        task: 'Execute python3 kappa_replay_lab.py in terminal and verify that historical stream replay computes $650 net revenue.',
        verificationCriteria: 'Run the command and observe the calculated metrics.'
      },
      assessment: {
        quiz: [
          {
            q: 'What is the primary advantage of Kappa Architecture over Lambda Architecture?',
            options: [
              'It uses more servers',
              'It eliminates the dual-codebase problem by using a single streaming framework for both real-time and historical replay',
              'It disables Kafka',
              'It requires manual re-indexing'
            ],
            correct: 1,
            explanation: 'Kappa Architecture uses a single streaming pipeline for both real-time and historical processing, avoiding dual codebases.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the Kappa streaming replay script.',
          expectedCommand: 'python3 kappa_replay_lab.py'
        }
      }
    },
    {
      id: 'm9-l6',
      title: 'Workflow Orchestration with Apache Airflow',
      duration: '50 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'Apache Airflow is the industry-standard workflow orchestration platform created at Airbnb in 2014. Airflow programmatically authors, schedules, and monitors complex data pipelines as Directed Acyclic Graphs (DAGs) using pure Python code. Core components:\n- DAG (Directed Acyclic Graph): Collection of tasks with directional dependency relationships (task_a >> task_b >> task_c).\n- Scheduler: Monitors DAGs, evaluates cron schedules, and submits ready task instances to workers.\n- Web Server: Rich UI to inspect DAG runs, gantt charts, task duration graphs, and logs.\n- Operators: Building blocks (BashOperator, PythonOperator, SparkSubmitOperator, S3ToRedshiftOperator).\n- Sensors: Tasks that wait for an external condition (e.g. S3KeySensor waiting for a file partition to land).',
        hi: 'Apache Airflow data engineering ka master controller / orchestrator hai (Airbnb ne banaya tha). Ye poore data pipeline ko ek Directed Acyclic Graph (DAG) ke roop me Python code me define karta hai. Airflow ye decide karta hai: "Pehle Task A chalega, jab wo khatam ho jaye tab Task B aur Task C parallel me chalenge, aur aakhiri me Task D chalega". Iske Web UI se aap har ek task ka live status, execution time, logs, aur automatic retries dekh sakte ho.'
      },
      why: 'Pipelines have complex dependencies: Task 3 (Spark model) cannot start until Task 1 (S3 ingestion) and Task 2 (Dimension sync) both finish. Airflow orchestrates these dependencies with automated retries and SLA alerting.',
      how: '1. DAG Declaration:\n   with DAG(\'daily_sales_pipeline\', start_date=datetime(2026, 1, 1), schedule_interval=\'@daily\', catchup=False) as dag:\n2. Task Definition: t1 = BashOperator(task_id=\'check_hdfs\', bash_command=\'hdfs dfs -test -e /data\')\n3. Dependencies: t1 >> t2 >> [t3_a, t3_b] >> t4\n4. Dynamic Task Mapping (Airflow 2.3+): Dynamically spawns tasks at runtime based on upstream list outputs.',
      architecture: {
        type: 'airflow_cluster_architecture',
        title: 'Apache Airflow Enterprise Cluster Architecture',
        nodes: [
          { name: 'Airflow Webserver', desc: 'Flask UI for monitoring, graph view, tree view, manual task clearing' },
          { name: 'Airflow Scheduler', desc: 'Heartbeat daemon parsing DAG files, checking cron intervals, enqueuing tasks' },
          { name: 'Metadata Database', desc: 'PostgreSQL storing DAG definitions, task instance states, variables, connections' },
          { name: 'Celery / Kubernetes Workers', desc: 'Distributed worker pods executing task payloads in parallel' }
        ]
      },
      industryExample: 'Airbnb and Twitter run thousands of daily Airflow DAGs across multi-node Kubernetes worker pools, orchestrating petabyte-scale ETL workflows, data science training runs, and executive reporting.',
      practicalLab: {
        title: 'Lab 9.6: Authoring and Validating an Apache Airflow DAG in Python',
        problemStatement: 'Write a valid Python Airflow DAG script defining task dependencies, retries, and SLA configurations, and validate syntax.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m9_l6 && cd ~/bigdata_lab/m9_l6',
        instructions: [
          'Step 1: Write an Airflow DAG definition script.',
          'Step 2: Run Python validation on the DAG.',
          'Step 3: Review task dependency structure.'
        ],
        code: `# airflow_dag_lab.py
# Simulated Airflow DAG Script
class MockTask:
    def __init__(self, task_id):
        self.task_id = task_id
        self.downstream = []

    def __rshift__(self, other):
        # Implements >> operator
        if isinstance(other, list):
            for t in other:
                self.downstream.append(t.task_id)
        else:
            self.downstream.append(other.task_id)
        return other

# Define Pipeline Tasks
extract_task = MockTask("extract_raw_telemetry")
validate_task = MockTask("validate_schema_dlq")
spark_gold_task = MockTask("run_pyspark_gold_mart")
notify_slack_task = MockTask("send_slack_success_alert")

# Set Dependencies via Bitshift Operators
extract_task >> validate_task >> spark_gold_task >> notify_slack_task

print("=== Apache Airflow DAG Dependency Graph Validated ===")
print(f"{extract_task.task_id} -> {extract_task.downstream}")
print(f"{validate_task.task_id} -> {validate_task.downstream}")
print(f"{spark_gold_task.task_id} -> {spark_gold_task.downstream}")
print("DAG Syntax: 100% Valid (Zero cycle errors)")
`,
        commands: [
          'python3 airflow_dag_lab.py'
        ]
      },
      expectedOutput: `=== Apache Airflow DAG Dependency Graph Validated ===
extract_raw_telemetry -> ['validate_schema_dlq']
validate_schema_dlq -> ['run_pyspark_gold_mart']
run_pyspark_gold_mart -> ['send_slack_success_alert']
DAG Syntax: 100% Valid (Zero cycle errors)`,
      troubleshooting: [
        {
          error: 'AirflowDAGCycleException: Cycle detected in DAG: task_a -> task_b -> task_a',
          rootCause: 'A circular dependency was declared between tasks; DAGs must be strictly Acyclic.',
          solution: 'Inspect task bitshift dependencies (>>) and ensure dependencies flow in one strict direction without loops.'
        }
      ],
      bestPractices: [
        'Always set catchup = False on production DAGs unless you specifically intend to backfill all historical runs since start_date.',
        'Never execute heavy compute logic directly inside the Airflow worker; use Airflow strictly as an orchestrator to trigger Spark or DBT jobs.',
        'Always specify retries (e.g. retries=3, retry_delay=timedelta(minutes=5)) for tasks connecting to network services.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a DAG in Apache Airflow?',
          answer: 'A DAG (Directed Acyclic Graph) is a collection of all the tasks you want to run, organized in a way that reflects their relationships and dependencies. It is "Directed" because dependencies have a clear one-way flow, and "Acyclic" because it contains no circular loops.'
        },
        {
          level: 'Intermediate',
          question: 'What is the purpose of an Airflow Sensor vs an Operator?',
          answer: 'An Operator defines a single task that executes an action (e.g. running a bash script, executing a Python function, submitting a Spark job). A Sensor is a special type of operator that pauses and waits for a specific external condition to become true (e.g. S3KeySensor waiting for a file to land in S3, or ExternalTaskSensor waiting for another DAG to complete) before allowing downstream tasks to proceed.'
        },
        {
          level: 'Advanced',
          question: 'What is the "catchup" parameter in an Airflow DAG and what happens if catchup=True with a past start_date?',
          answer: 'By default in older Airflow, catchup was True. If a DAG has start_date=2024-01-01 and schedule_interval=\'@daily\', when you activate the DAG in 2026, Airflow will immediately schedule and execute ~700 separate DAG runs simultaneously to "catch up" on all missed days since 2024. This can overwhelm databases and clusters. In production, always set catchup=False unless historical backfilling is explicitly required.'
        }
      ],
      assignment: {
        task: 'Execute python3 airflow_dag_lab.py in terminal and verify the task dependency graph.',
        verificationCriteria: 'Run the command and observe the sequential task graph.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which bitshift operator is standard in Apache Airflow Python code to declare that task_a must finish before task_b starts?',
            options: ['task_a << task_b', 'task_a >> task_b', 'task_a == task_b', 'task_a | task_b'],
            correct: 1,
            explanation: 'The right bitshift operator (task_a >> task_b) defines downstream execution dependencies.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the Airflow DAG dependency validation script.',
          expectedCommand: 'python3 airflow_dag_lab.py'
        }
      }
    },
    {
      id: 'm9-l7',
      title: 'Data Quality & Data Contracts (Great Expectations)',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Data Quality (DQ) is the engineering practice of validating that incoming data satisfies explicit schema contracts, completeness thresholds, and business sanity constraints before it reaches analytics consumers. A "Silent Data Failure" (e.g. an upstream API change that turns all user IDs to null or sets product prices to negative numbers) does not crash pipelines, but corrupts executive dashboards and machine learning models for months. Frameworks like Great Expectations and Apache Deequ allow engineers to define declarative "Expectations" that automatically test data in-flight.',
        hi: 'Data Quality (DQ) Big Data ka sabse zaroori pillar hai. Sabse khatarnak bugs wo nahi hote jo error fek kar pipeline band kar dein — sabse khatarnak bugs "Silent Data Failures" hote hain (jaise: product ka price -500 ho gaya ya user_id NULL ho gaya, lekin pipeline successfully chalti rahi!). Isse company ke dashboards galat metrics dikhane lagte hain. Great Expectations jaise tools se hum data par automated tests (contracts) lagate hain — agar data rules pass nahi karta toh pipeline alert bhej kar data ko quarantine kar deti hai.'
      },
      why: 'Garbage in, garbage out. A single corrupted column in a financial pipeline can lead to millions of dollars in misreported earnings, regulatory SEC audit fines, and lost executive trust.',
      how: '1. Schema Contract: Assert column types and non-nullability.\n2. Value Range Assertions: expect_column_values_to_be_between("age", min_value=18, max_value=120)\n3. Uniqueness: expect_column_values_to_be_unique("transaction_id")\n4. Set Membership: expect_column_values_to_be_in_set("status", ["PAID", "FAILED", "PENDING"])\n5. Automated Action: If expectations fail, abort load or route batch to Quarantine DLQ.',
      architecture: {
        type: 'data_quality_gatekeeper',
        title: 'Data Quality Gatekeeper in Modern Pipelines',
        nodes: [
          { name: 'Inbound Staging Batch', desc: 'Raw records staged before production table load' },
          { name: 'Great Expectations Test Suite', desc: 'Asserts: Non-null primary keys, valid emails, positive amounts' },
          { name: 'Gate Decision (Pass / Fail)', desc: 'If 100% Pass -> Commit to Gold Warehouse | If Fail -> Alert PagerDuty & Dump to Quarantine' }
        ]
      },
      industryExample: 'Stripe validates payment records against Great Expectations suites before committing to analytical data marts, preventing decimal formatting bugs from affecting merchant bank payout calculations.',
      practicalLab: {
        title: 'Lab 9.7: Writing Declarative Data Quality Assertions in Python',
        problemStatement: 'Build a lightweight Data Quality validation engine that asserts non-null primary keys, positive amounts, and unique IDs.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m9_l7 && cd ~/bigdata_lab/m9_l7',
        instructions: [
          'Step 1: Write a data quality validation script.',
          'Step 2: Run using python3.',
          'Step 3: Verify which assertions pass and which fail on dirty records.'
        ],
        code: `# data_quality_lab.py
dirty_batch = [
    {"txn_id": "TXN_01", "user_id": 101, "amount": 450.0, "status": "COMPLETED"},
    {"txn_id": "TXN_02", "user_id": None, "amount": 120.0, "status": "COMPLETED"},  # NULL user_id!
    {"txn_id": "TXN_03", "user_id": 103, "amount": -50.0, "status": "COMPLETED"},   # Negative amount!
    {"txn_id": "TXN_01", "user_id": 104, "amount": 900.0, "status": "UNKNOWN"},     # Duplicate TXN_ID!
]

def run_data_quality_suite(batch):
    print("=== Running Data Quality Assertion Suite ===")
    failures = []
    seen_ids = set()

    for idx, row in enumerate(batch):
        # Assertion 1: user_id must NOT be NULL
        if row.get("user_id") is None:
            failures.append(f"Row {idx}: user_id is NULL for txn {row.get('txn_id')}")
        
        # Assertion 2: amount must be positive
        if row.get("amount", 0) <= 0:
            failures.append(f"Row {idx}: amount {row.get('amount')} must be > 0 for txn {row.get('txn_id')}")

        # Assertion 3: txn_id must be UNIQUE
        tid = row.get("txn_id")
        if tid in seen_ids:
            failures.append(f"Row {idx}: Duplicate txn_id detected: {tid}")
        seen_ids.add(tid)

    return failures

dq_failures = run_data_quality_suite(dirty_batch)
if dq_failures:
    print(f"Data Quality Gate: FAILED ({len(dq_failures)} violations detected)")
    for f in dq_failures:
        print(f" [VIOLATION] {f}")
else:
    print("Data Quality Gate: PASSED (100% compliant)")
`,
        commands: [
          'python3 data_quality_lab.py'
        ]
      },
      expectedOutput: `=== Running Data Quality Assertion Suite ===
Data Quality Gate: FAILED (3 violations detected)
 [VIOLATION] Row 1: user_id is NULL for txn TXN_02
 [VIOLATION] Row 2: amount -50.0 must be > 0 for txn TXN_03
 [VIOLATION] Row 3: Duplicate txn_id detected: TXN_01`,
      troubleshooting: [
        {
          error: 'Pipelines failing continuously due to overly strict DQ assertions',
          rootCause: 'Setting 100% completeness expectations on optional fields (e.g. middle_name).',
          solution: 'Use mostly thresholds (e.g. expect_column_values_to_not_be_null(..., mostly=0.95)) for optional attributes.'
        }
      ],
      bestPractices: [
        'Place Data Quality assertions at every stage of the Medallion architecture (Bronze -> Silver and Silver -> Gold).',
        'Quarantine bad records into a DLQ rather than dropping them silently or failing the entire multi-hour pipeline.',
        'Adopt Data Contracts between producing software engineering teams and consuming data teams.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a "Data Contract" in modern Data Engineering?',
          answer: 'A Data Contract is a formal agreement between upstream service producers (software engineers) and downstream data consumers (data engineers) defining the expected schema, data types, nullability rules, SLAs, and semantics of data emitted by a service. If the producer alters the schema, automated CI/CD checks prevent the change from deploying without data team approval.'
        },
        {
          level: 'Intermediate',
          question: 'What is the Great Expectations framework and how does it integrate into pipelines?',
          answer: 'Great Expectations is an open-source Python framework for declarative data testing, profiling, and documentation. Engineers define human-readable "Expectations" (e.g. expect_column_values_to_be_unique). It integrates directly into Airflow, Spark, and Pandas pipelines as an automated checkpoint: if data fails assertions, the checkpoint halts the pipeline or logs alerts.'
        },
        {
          level: 'Advanced',
          question: 'How do you design automated Data Observability metrics to detect silent data drift?',
          answer: 'Implement continuous automated monitoring across five pillars of Data Observability: 1. Freshness (time since last table update), 2. Distribution (detecting statistical drift like average transaction value dropping 40%), 3. Volume (detecting unexpected drops like 1,000 rows instead of usual 100,000), 4. Schema (detecting unexpected column additions or type changes), and 5. Lineage (tracking upstream dependencies). Frameworks like Monte Carlo or custom Prometheus exporters monitor these.'
        }
      ],
      assignment: {
        task: 'Execute python3 data_quality_lab.py in terminal and verify the 3 detected data quality violations.',
        verificationCriteria: 'Run the command and observe the 3 violations.'
      },
      assessment: {
        quiz: [
          {
            q: 'What is the danger of a "Silent Data Failure" compared to a crash exception in a data pipeline?',
            options: [
              'It consumes 100% CPU',
              'It allows corrupted, negative, or null data to pass into production databases without throwing errors, silently poisoning executive reports and ML models',
              'It deletes Kafka topics',
              'It stops cron'
            ],
            correct: 1,
            explanation: 'Silent failures don\'t throw runtime errors, corrupting analytical state and decision-making unnoticed.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the data quality assertion laboratory script.',
          expectedCommand: 'python3 data_quality_lab.py'
        }
      }
    },
    {
      id: 'm9-l8',
      title: 'Cloud Fundamentals (AWS, GCP, Azure Storage & Compute)',
      duration: '45 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'Modern enterprise Data Engineering has overwhelmingly migrated to the public cloud: AWS (Amazon Web Services), GCP (Google Cloud Platform), and Microsoft Azure. Cloud platforms decouple Compute and Storage: data is stored permanently at low cost in Object Storage (AWS S3, GCP Cloud Storage GCS, Azure ADLS Gen2), while compute clusters (AWS EMR, GCP Dataproc, Azure Databricks) are spun up dynamically on-demand and terminated when jobs complete, cutting infrastructure costs by 70%.',
        hi: 'Aaj 90%+ Big Data infrastructure public clouds (AWS, GCP, Azure) par chalta hai. Cloud ka sabse bada jaadu hai "Compute aur Storage ko alag karna" (Decoupling): Sara data saste Object Storage (AWS S3 ya Google Cloud Storage) me hamesha ke liye rehta hai. Jab Spark job chalana ho, tabhi 100 computers ka cluster (AWS EMR ya GCP Dataproc) start hota hai, kaam khatam hote hi cluster destroy ho jaata hai! Isse companies ke carodon rupaye bachte hain.'
      },
      why: 'On-premise physical Hadoop clusters require millions of dollars in upfront hardware capital, take 6 months to procure, and consume power 24/7 even when idle. Cloud elasticity allows scaling from 1 to 1,000 nodes in 3 minutes.',
      how: '1. Storage Mapping:\n   - AWS: s3://my-bucket/data/ (S3)\n   - GCP: gs://my-bucket/data/ (GCS)\n   - Azure: abfss://container@account.dfs.core.windows.net/ (ADLS Gen2)\n2. Managed Big Data Compute:\n   - AWS EMR / Databricks / Athena\n   - GCP Dataproc / BigQuery\n   - Azure Databricks / Synapse\n3. Cloud Identity & Access Management (IAM): Role-based access control without passwords.',
      architecture: {
        type: 'cloud_decoupling_model',
        title: 'Cloud Storage & Compute Decoupled Architecture',
        nodes: [
          { name: 'Persistent Storage Tier', desc: 'AWS S3 / GCP GCS / Azure ADLS (99.999999999% durability, ~$0.02/GB/month)' },
          { name: 'Ephemeral Compute Tier', desc: 'AWS EMR / GCP Dataproc / Spark on K8s (Spun up for 15 mins, then destroyed)' },
          { name: 'Serverless Query Engines', desc: 'Amazon Athena / Google BigQuery / Snowflake (Pay strictly per query scanned)' }
        ]
      },
      industryExample: 'Netflix hosts its entire multi-exabyte data warehouse on Amazon S3, spinning up tens of thousands of ephemeral AWS EC2 Spot Instances daily to run Spark analytics at 80% discounted compute rates.',
      practicalLab: {
        title: 'Lab 9.8: Working with Cloud Object Storage URIs and S3 Emulation',
        problemStatement: 'Inspect standard cloud storage URI patterns (s3://, gs://, abfss://) and simulate cloud storage path parsing in Python.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m9_l8 && cd ~/bigdata_lab/m9_l8',
        instructions: [
          'Step 1: Write a cloud URI parsing utility script.',
          'Step 2: Run using python3.',
          'Step 3: Verify cloud bucket and key extraction.'
        ],
        code: `# cloud_storage_lab.py
from urllib.parse import urlparse

cloud_uris = [
    "s3://enterprise-data-lake/bronze/orders/2026/11/orders.parquet",
    "gs://gcp-analytics-bucket/silver/customers/cust_01.parquet",
    "abfss://container@storageacc.dfs.core.windows.net/gold/daily_sales/"
]

def parse_cloud_path(uri):
    parsed = urlparse(uri)
    return {
        "cloud_provider": "AWS S3" if parsed.scheme == "s3" else ("GCP GCS" if parsed.scheme == "gs" else "Azure ADLS"),
        "bucket_or_container": parsed.netloc,
        "object_key_path": parsed.path.lstrip("/")
    }

print("=== Cloud Object Storage URI Parsing ===")
for u in cloud_uris:
    p = parse_cloud_path(u)
    print(f"[{p['cloud_provider']}] Bucket: {p['bucket_or_container']:<25} | Key: {p['object_key_path']}")
`,
        commands: [
          'python3 cloud_storage_lab.py'
        ]
      },
      expectedOutput: `=== Cloud Object Storage URI Parsing ===
[AWS S3] Bucket: enterprise-data-lake      | Key: bronze/orders/2026/11/orders.parquet
[GCP GCS] Bucket: gcp-analytics-bucket      | Key: silver/customers/cust_01.parquet
[Azure ADLS] Bucket: container@storageacc.dfs.core.windows.net | Key: gold/daily_sales/`,
      troubleshooting: [
        {
          error: 'AmazonS3Exception: Access Denied (HTTP 403) when Spark reads s3://',
          rootCause: 'EC2 instance profile or IAM role lacks s3:GetObject or s3:ListBucket permissions on the target S3 path.',
          solution: 'Attach an IAM policy granting s3:GetObject, s3:PutObject, and s3:ListBucket to the cluster IAM role.'
        }
      ],
      bestPractices: [
        'Use Ephemeral Compute clusters (spin up, process, terminate) to avoid paying for idle 24/7 EC2 servers.',
        'Leverage Cloud Spot Instances / Preemptible VMs for fault-tolerant worker nodes to achieve up to 70-80% cost savings.',
        'Never hardcode AWS Access Keys / Secret Keys in code; always use IAM Roles and Instance Profiles.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the main architectural difference between on-premise HDFS and Cloud Object Storage (e.g. AWS S3)?',
          answer: 'In on-premise HDFS, compute and storage are tightly coupled: physical servers host both the disks (DataNodes) and the CPU/RAM (NodeManagers). In cloud object storage (AWS S3), compute and storage are completely decoupled. S3 stores data permanently with 11 nines of durability at low cost, while compute clusters (Spark/EMR) are spun up dynamically on-demand and terminated when jobs complete.'
        },
        {
          level: 'Intermediate',
          question: 'What are Spot Instances (or Preemptible VMs) and how are they used in Big Data processing?',
          answer: 'Spot Instances are spare compute capacity that cloud providers (AWS, GCP, Azure) offer at steep discounts (up to 70-90% off standard on-demand pricing). The trade-off is that the cloud provider can reclaim the instance with a 2-minute notice if needed. In Big Data, data engineers run Spark/Hadoop worker nodes on Spot Instances while keeping the Master/Driver node on On-Demand instances, because Spark\'s fault-tolerant architecture automatically handles worker node terminations.'
        },
        {
          level: 'Advanced',
          question: 'What is the S3 "Eventual Consistency" issue that previously affected Hadoop on S3, and how was it solved?',
          answer: 'Previously, Amazon S3 had eventual consistency for object overwrites and deletes, meaning a newly written file might not be immediately visible to a list operation (leading to file not found errors in MapReduce/Spark). Engineers had to use tools like S3Guard. In December 2020, AWS introduced Strong Read-After-Write Consistency for all S3 API operations with zero latency overhead, completely solving this issue for Big Data workloads.'
        }
      ],
      assignment: {
        task: 'Execute python3 cloud_storage_lab.py in terminal and verify the cloud URI parsing for AWS, GCP, and Azure.',
        verificationCriteria: 'Run the command and observe the 3 parsed cloud providers.'
      },
      assessment: {
        quiz: [
          {
            q: 'Why do modern Big Data cloud architectures decouple Compute from Storage?',
            options: [
              'Because cloud providers forbid hard drives',
              'To allow storage to be retained permanently at low cost while compute clusters can be spun up on-demand and terminated after job completion, saving up to 70% in costs',
              'Because Python doesn\'t run on bare metal',
              'To eliminate encryption'
            ],
            correct: 1,
            explanation: 'Decoupling compute from storage enables independent scaling and massive cost optimization via ephemeral clusters.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the cloud storage path parsing script.',
          expectedCommand: 'python3 cloud_storage_lab.py'
        }
      }
    },
    {
      id: 'm9-l9',
      title: 'Data Governance, Lineage & Security (Apache Ranger & Atlas)',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'In enterprise production, Data Engineering must comply with strict legal regulatory mandates (GDPR, HIPAA, CCPA, SOC2). Two foundational open-source tools provide enterprise governance:\n- Apache Ranger: Centralized security framework that enforces fine-grained authorization, Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC), dynamic column masking (e.g. masking credit card numbers: XXXX-XXXX-XXXX-1234), and row-level filtering across HDFS, Hive, Spark, Kafka, and Presto.\n- Apache Atlas: Scalable data governance and metadata framework that tracks Data Lineage (visualizing the end-to-end lifecycle and ancestry of every column from raw ingest to final BI dashboard), catalog search, and data classification (tagging columns as PII or SENSITIVE).',
        hi: 'Enterprise Big Data me Security aur Data Governance sabse critical topics hote hain (GDPR, HIPAA laws comply karne ke liye). Do main tools use hote hain:\n1. Apache Ranger: Centralized security guard! Ye decide karta hai kaun sa user kis table, kis row, ya kis column ko padh sakta hai. Ye real-time me sensitive data ko mask kar deta hai (jaise credit card ke pehle 12 digits ko XXXX banana).\n2. Apache Atlas: Data Lineage aur Catalog tool! Ye ek visual map dikhata hai ki ye data aakhir aaya kahan se tha (Lineage graph) — kis raw CSV se nikal kar kis Spark job ke through kis final report me gaya.'
      },
      why: 'A single regulatory GDPR breach due to unmasked user data can result in corporate fines of up to 20 million euros or 4% of global annual turnover.',
      how: '1. Ranger Policies: Define policy: User "analyst" on Table "users": Column "ssn" -> MASK_SHOW_LAST_4.\n2. Row-Level Filter: User "regional_lead" -> Filter: country = \'INDIA\'.\n3. Atlas Lineage: Ingests lineage metadata automatically via Spark/Hive hooks, generating interactive DAG lineage graphs.\n4. Auditing: Ranger writes centralized audit logs to Elasticsearch / Solr for compliance reporting.',
      architecture: {
        type: 'data_governance_architecture',
        title: 'Enterprise Data Governance & Security Architecture',
        nodes: [
          { name: 'Apache Ranger Admin', desc: 'Central policy engine for RBAC, row filtering, dynamic data masking' },
          { name: 'Ranger Plugin Agents', desc: 'Embedded inside NameNode, HiveServer2, Kafka Brokers, Spark' },
          { name: 'Apache Atlas Lineage', desc: 'Graph-based data lineage tracking column ancestry and PII tags' },
          { name: 'Centralized Audit Store', desc: 'Immutable audit logs of all access requests stored in Elasticsearch' }
        ]
      },
      industryExample: 'JPMorgan Chase and Goldman Sachs utilize Apache Ranger to enforce row-level security ensuring London traders cannot view New York account ledger balances.',
      practicalLab: {
        title: 'Lab 9.9: Simulating Dynamic Column Masking in SQL',
        problemStatement: 'Simulate dynamic data masking on sensitive credit card numbers and PII email addresses.',
        requirements: 'Python SQLite.',
        setup: 'mkdir -p ~/bigdata_lab/m9_l9 && cd ~/bigdata_lab/m9_l9',
        instructions: [
          'Step 1: Write an SQL masking demonstration script.',
          'Step 2: Run using python3.',
          'Step 3: Verify that sensitive numbers are masked cleanly.'
        ],
        code: `# data_masking_lab.py
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.execute("""
CREATE TABLE customer_financials (
    id INT,
    name TEXT,
    card_number TEXT,
    balance REAL
)
""")

cur.executemany("INSERT INTO customer_financials VALUES (?, ?, ?, ?)", [
    (1, "Aarav Sharma", "4532-8921-7821-9012", 45000.0),
    (2, "Diya Patel", "5421-9012-3412-8821", 125000.0)
])

# Dynamic Masking Query (Simulating Ranger Policy: MASK_SHOW_LAST_4)
masking_query = """
SELECT 
    name,
    'XXXX-XXXX-XXXX-' || SUBSTR(card_number, 16, 4) as masked_card_number,
    balance
FROM customer_financials;
"""

df = pd.read_sql_query(masking_query, conn)
print("--- Dynamic PII Column Masking Output ---")
print(df)
`,
        commands: [
          'python3 data_masking_lab.py'
        ]
      },
      expectedOutput: `--- Dynamic PII Column Masking Output ---
           name       masked_card_number   balance
0  Aarav Sharma      XXXX-XXXX-XXXX-9012   45000.0
1    Diya Patel      XXXX-XXXX-XXXX-8821  125000.0`,
      troubleshooting: [
        {
          error: 'Ranger plugin authorization failure: User is unauthorized to read column [ssn]',
          rootCause: 'The user does not belong to the authorized AD/LDAP security group mapped in the Ranger policy.',
          solution: 'Verify user group memberships in Active Directory or add user to the Ranger access policy.'
        }
      ],
      bestPractices: [
        'Never store raw unencrypted credit card or social security numbers; mask or tokenize upon arrival.',
        'Implement Apache Atlas lineage tracking from Day 1 to simplify impact analysis when a table schema evolves.',
        'Configure immutable audit logging to track who accessed which sensitive columns.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between Apache Ranger and Apache Atlas?',
          answer: 'Apache Ranger is a security and access control framework that enforces authorization, Role-Based Access Control (RBAC), dynamic column masking, and row-level filtering. Apache Atlas is a data governance and metadata catalog framework that tracks data lineage (where data came from and how it was transformed), data classification (PII tagging), and metadata search.'
        },
        {
          level: 'Intermediate',
          question: 'What is Dynamic Data Masking and why is it superior to physically masking data on disk?',
          answer: 'Physical masking permanently modifies stored data, preventing authorized users (like fraud investigators or automated risk models) from ever seeing the original value. Dynamic Data Masking (implemented by Ranger) leaves the underlying data untouched on storage, but intercepts queries at runtime, masking columns (e.g. showing only last 4 digits) for unauthorized roles while showing unmasked data to authorized roles.'
        },
        {
          level: 'Advanced',
          question: 'What is "Data Lineage" and how does it support Root Cause Analysis and Impact Analysis?',
          answer: 'Data Lineage is the complete end-to-end map of data origin, transformations, and downstream destinations. It supports Root Cause Analysis: if a CEO dashboard displays anomalous revenue, engineers follow the lineage graph backward to locate the exact upstream ETL job or source file that introduced the bug. It supports Impact Analysis: before modifying an upstream column in table X, engineers inspect lineage to know which downstream reports or ML models will be affected.'
        }
      ],
      assignment: {
        task: 'Execute python3 data_masking_lab.py in terminal and verify that credit card numbers are masked with XXXX-XXXX-XXXX.',
        verificationCriteria: 'Run the command and observe the masked_card_number column.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which Apache tool provides visual end-to-end Data Lineage tracking and metadata classification for enterprise Big Data lakes?',
            options: ['Apache Atlas', 'Apache Ranger', 'Apache Flume', 'Apache Pig'],
            correct: 0,
            explanation: 'Apache Atlas provides comprehensive metadata management and visual data lineage tracking.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the data masking laboratory script.',
          expectedCommand: 'python3 data_masking_lab.py'
        }
      }
    },
    {
      id: 'm9-l10',
      title: 'End-to-End Enterprise Architecture Capstone Blueprint',
      duration: '60 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'This final capstone blueprint synthesizes all 9 modules into the complete, industry-standard Enterprise Big Data Architecture Blueprint deployed at top tech companies. The architecture seamlessly integrates:\n1. INGESTION: Real-time event streaming via Apache Kafka + Batch RDBMS sync via CDC Debezium.\n2. STORAGE: Distributed HDFS / Cloud Object Storage (S3/GCS) configured with Rack Awareness and High Availability (HA).\n3. RESOURCE GOVERNANCE: Apache YARN / Kubernetes dynamically scheduling compute containers.\n4. PROCESSING: Apache Spark Structured Streaming and Batch PySpark implementing the Medallion Architecture (Bronze -> Silver -> Gold).\n5. WAREHOUSING & ANALYTICS: Apache Hive Metastore + Spark SQL / Trino serving analytical queries and BI dashboards.\n6. ORCHESTRATION & GOVERNANCE: Apache Airflow scheduling DAGs, Great Expectations verifying data contracts, and Apache Ranger securing access.',
        hi: 'Ye Big Data Engineer Academy ka Ultimate Capstone Blueprint hai jo sabhi 9 modules ko aapas me jodta hai! Real IT company me kaam karne wala poora architecture:\n1. INGESTION: Kafka se real-time streaming + CDC se batch ingestion;\n2. STORAGE: HDFS / S3 me distributed storage (HA aur Rack Awareness ke sath);\n3. RESOURCE MANAGEMENT: YARN cluster ke RAM aur CPU ko baant ta hai;\n4. PROCESSING: Apache Spark Medallion Architecture (Bronze -> Silver -> Gold) execute karta hai;\n5. WAREHOUSE: Hive Metastore aur Spark SQL BI tools ko queries serve karte hain;\n6. ORCHESTRATION & QUALITY: Airflow pipelines chalata hai aur Great Expectations data contracts verify karta hai!'
      },
      why: 'Understanding how individual technologies connect to form an end-to-end production architecture is what distinguishes a junior coder from a senior Lead Data Engineer or Data Architect.',
      how: '1. Events stream into Kafka Topic (`orders-stream`).\n2. Spark Structured Streaming ingests micro-batches into HDFS Bronze Parquet.\n3. Scheduled Airflow DAG triggers Silver cleaning, deduplication, and Great Expectations checks.\n4. Spark joins Silver with dimensions to produce Gold analytical data marts.\n5. Trino and BI dashboards query Gold tables with sub-second latency.\n6. Ranger audits all queries; Atlas updates data lineage graph.',
      architecture: {
        type: 'complete_bigdata_enterprise_blueprint',
        title: 'Full End-to-End Enterprise Big Data Architecture Blueprint',
        nodes: [
          { name: '1. Ingestion Layer', desc: 'Apache Kafka (Real-time streams) + Debezium CDC' },
          { name: '2. Distributed Storage & Compute', desc: 'Apache HDFS (3x Replication, HA, Rack Awareness) managed by YARN' },
          { name: '3. Data Processing Engine', desc: 'Apache Spark 3.x (Medallion Bronze/Silver/Gold Lakehouse)' },
          { name: '4. Serving & Analytics Layer', desc: 'Hive Metastore + Spark SQL / Trino + Grafana / BI Dashboards' },
          { name: '5. Governance & Orchestration', desc: 'Apache Airflow (DAGs) + Great Expectations + Apache Ranger / Atlas' }
        ]
      },
      industryExample: 'Fortune 500 tech enterprises (Uber, Netflix, Walmart, Stripe, Apple) run variations of this unified blueprint to process petabytes of daily business transactions reliably.',
      practicalLab: {
        title: 'Lab 9.10: Simulating the Complete End-to-End Enterprise Pipeline',
        problemStatement: 'Execute an end-to-end simulation script executing Ingestion -> Storage -> Processing -> Analytics -> Validation.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m9_l10 && cd ~/bigdata_lab/m9_l10',
        instructions: [
          'Step 1: Write an end-to-end architecture simulation script.',
          'Step 2: Run using python3.',
          'Step 3: Review the full lifecycle output report.'
        ],
        code: `# full_architecture_blueprint_lab.py
import time

print("================================================================================")
print("  BIG DATA ENGINEER ACADEMY: END-TO-END ENTERPRISE ARCHITECTURE EXECUTION")
print("================================================================================\\n")

steps = [
    ("1. INGESTION", "Kafka Producer published 10,000 orders to topic [orders-v1] (acks=all)"),
    ("2. STORAGE", "HDFS NameNode allocated 3 blocks across 3 DataNodes (Rack 1 & Rack 2)"),
    ("3. RESOURCE", "YARN ResourceManager granted 4 Containers (16GB RAM, 8 vCores)"),
    ("4. BRONZE LAYER", "Spark Structured Streaming ingested raw Parquet files to /data/bronze"),
    ("5. SILVER LAYER", "PySpark cleaned nulls, deduplicated via ROW_NUMBER(), wrote /data/silver"),
    ("6. DATA QUALITY", "Great Expectations verified: Zero NULL customer_ids (100% Passed)"),
    ("7. GOLD LAYER", "Broadcast Join executed with dim_customers; revenue aggregated in /data/gold"),
    ("8. SERVING", "Hive Metastore catalog updated; Trino/BI served queries in 45ms"),
    ("9. AUDIT & GOVERNANCE", "Apache Ranger logged access; Apache Atlas updated column lineage graph")
]

for stage, desc in steps:
    print(f"[{stage:<20}] -> {desc}")
    time.sleep(0.05)

print("\\n================================================================================")
print("  STATUS: END-TO-END PIPELINE EXECUTED SUCCESSFULLY (ZERO ERRORS)")
print("================================================================================")
`,
        commands: [
          'python3 full_architecture_blueprint_lab.py'
        ]
      },
      expectedOutput: `================================================================================
  BIG DATA ENGINEER ACADEMY: END-TO-END ENTERPRISE ARCHITECTURE EXECUTION
================================================================================

[1. INGESTION        ] -> Kafka Producer published 10,000 orders to topic [orders-v1] (acks=all)
[2. STORAGE          ] -> HDFS NameNode allocated 3 blocks across 3 DataNodes (Rack 1 & Rack 2)
[3. RESOURCE         ] -> YARN ResourceManager granted 4 Containers (16GB RAM, 8 vCores)
[4. BRONZE LAYER     ] -> Spark Structured Streaming ingested raw Parquet files to /data/bronze
[5. SILVER LAYER     ] -> PySpark cleaned nulls, deduplicated via ROW_NUMBER(), wrote /data/silver
[6. DATA QUALITY     ] -> Great Expectations verified: Zero NULL customer_ids (100% Passed)
[7. GOLD LAYER       ] -> Broadcast Join executed with dim_customers; revenue aggregated in /data/gold
[8. SERVING          ] -> Hive Metastore catalog updated; Trino/BI served queries in 45ms
[9. AUDIT & GOVERNANCE] -> Apache Ranger logged access; Apache Atlas updated column lineage graph

================================================================================
  STATUS: END-TO-END PIPELINE EXECUTED SUCCESSFULLY (ZERO ERRORS)
================================================================================`,
      troubleshooting: [
        {
          error: 'Integration deadlock: Upstream producer fails when downstream consumer is paused',
          rootCause: 'Kafka topic retention or disk capacity exceeded because consumers were offline for days.',
          solution: 'Size Kafka retention and disks with at least 3-7 days buffer capacity, and monitor consumer lag.'
        }
      ],
      bestPractices: [
        'Always design pipelines with loose coupling: producers should never directly depend on consumers.',
        'Enforce Data Contracts at ingestion boundaries and validate data quality between all Medallion tiers.',
        'Maintain automated end-to-end monitoring with PagerDuty alerts for SLA breaches and consumer lag spikes.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'Summarize the core flow of an end-to-end Big Data Engineering pipeline.',
          answer: '1. Ingestion: Raw events and transactional data are ingested via Kafka or batch tools. 2. Storage: Stored on distributed filesystems (HDFS) or cloud object stores (S3) with replication. 3. Compute & Transformation: Processed by Spark/YARN through Medallion layers (Bronze raw, Silver clean, Gold aggregated). 4. Warehousing & Serving: Cataloged in Hive Metastore and queried via SQL/BI engines. 5. Orchestration & Security: Scheduled by Airflow and secured by Ranger.'
        },
        {
          level: 'Intermediate',
          question: 'How do you design a disaster recovery (DR) strategy for a multi-petabyte Big Data platform?',
          answer: '1. Cross-Region Replication: Replicate core raw Bronze data and metadata transaction logs asynchronously to a secondary cloud region (e.g. AWS S3 Cross-Region Replication). 2. Infrastructure as Code (IaC): Maintain Terraform and Kubernetes Helm charts to spin up compute clusters in the DR region within 30 minutes. 3. Re-compute on Demand: Instead of replicating petabytes of intermediate Silver/Gold data, recompute them from raw Bronze using stored Airflow DAGs if disaster strikes.'
        },
        {
          level: 'Advanced',
          question: 'How do you convince an engineering director to migrate an enterprise from legacy MapReduce/Hadoop to a modern Cloud Lakehouse?',
          answer: 'Frame the argument around TCO (Total Cost of Ownership), agility, and risk: 1. Cost: Decoupling compute and storage on cloud S3/EMR eliminates 24/7 idle server power, cutting infrastructure costs by 50-70%. 2. Speed: Spark in-memory execution and vectorized Parquet scans accelerate queries by 10x-100x compared to MapReduce. 3. Business Value: Modern open table formats (Delta Lake/Iceberg) enable ACID transactions, time travel, and GDPR compliance that legacy Hadoop cannot support.'
        }
      ],
      assignment: {
        task: 'Execute python3 full_architecture_blueprint_lab.py in terminal and verify the 9-stage enterprise execution summary.',
        verificationCriteria: 'Run the command and observe all 9 stages executed.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which architecture tier provides the centralized metadata catalog that allows Spark SQL, Trino, and Hive to discover table definitions and partitions?',
            options: ['Hive Metastore (HMS)', 'Linux Crontab', 'Kafka Producer', 'ZooKeeper Leader alone'],
            correct: 0,
            explanation: 'The Hive Metastore (HMS) is the industry-standard centralized metadata catalog for Big Data lakes.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the complete architecture blueprint simulation script.',
          expectedCommand: 'python3 full_architecture_blueprint_lab.py'
        }
      }
    }
  ]
};

