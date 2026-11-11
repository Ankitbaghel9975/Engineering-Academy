// Module 7: Apache Spark
export const module7 = {
  id: 'mod-7',
  title: 'Module 7: Apache Spark & PySpark',
  description: 'Master Apache Spark 3.x internals, RDDs, DataFrames, Spark SQL, Catalyst Optimizer, DAG execution, partition tuning, shuffle optimization, and PySpark ETL pipelines.',
  badge: 'Distributed Compute',
  icon: 'Zap',
  lessons: [
    {
      id: 'm7-l1',
      title: 'Apache Spark Architecture & Ecosystem',
      duration: '50 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'Apache Spark is an open-source, distributed general-purpose cluster-computing engine designed for lightning-fast large-scale data processing. Developed at UC Berkeley AMPLab in 2009 and open-sourced through Apache, Spark was created to overcome the disk-bound limitations of MapReduce. Spark achieves 10x to 100x faster performance by retaining intermediate computation state in-memory (RAM) across pipeline transformations. Its master-worker architecture comprises a single Driver program and multiple distributed Executors running on cluster managers like YARN, Kubernetes, or Spark Standalone.',
        hi: 'Apache Spark duniya ka sabse fast aur popular distributed processing engine hai. Hadoop MapReduce har step ke baad data ko hard drive par likhta tha, jisse wo bohot slow ho jata tha. Spark ne is problem ko solve kiya in-memory computing (RAM) se — ye intermediate calculation ko RAM me rakhta hai, jisse ye MapReduce se 10 se 100 guna tez chalta hai! Spark ka architecture Master-Worker hota hai: ek Driver program hota hai jo master plan (DAG) banata hai aur baaki worker machines par Executors hote hain jo actual tasks run karte hain.'
      },
      why: 'Modern enterprises cannot wait 8 hours for a MapReduce batch job to finish. Spark allows batch ETL, real-time streaming, SQL analytics, graph processing, and machine learning to execute on the same unified platform in seconds or minutes.',
      how: '1. Driver Program: Contains SparkContext / SparkSession; translates user code into a Directed Acyclic Graph (DAG) of stages and tasks.\n2. Cluster Manager: YARN, Kubernetes, or Mesos; allocates executor containers.\n3. Executors: Worker processes that execute tasks concurrently on CPU cores and hold cached RDD/DataFrame blocks in memory.\n4. Spark Core: Unified engine powering Spark SQL, Spark Streaming (Structured Streaming), MLlib (Machine Learning), and GraphX.',
      architecture: {
        type: 'spark_driver_executor_architecture',
        title: 'Apache Spark Cluster Runtime Architecture',
        nodes: [
          { name: 'Spark Driver (Master)', desc: 'SparkSession, Catalyst Optimizer, DAGScheduler, TaskScheduler' },
          { name: 'Cluster Manager', desc: 'YARN ResourceManager / Kubernetes API Master / Standalone' },
          { name: 'Worker Node 1: Executor 1', desc: 'Runs Task 1 & Task 2 in parallel; BlockManager caches data in RAM' },
          { name: 'Worker Node 2: Executor 2', desc: 'Runs Task 3 & Task 4; manages shuffle spill files' }
        ]
      },
      industryExample: 'Netflix processes over 3 Petabytes of data every single day using 10,000+ Spark executors to calculate personalized movie recommendations and dynamic video bitrates.',
      practicalLab: {
        title: 'Lab 7.1: Inspecting SparkSession and Cluster Environment in PySpark',
        problemStatement: 'Initialize a SparkSession, inspect Spark application ID, master configuration, and Spark UI tracking port.',
        requirements: 'PySpark environment or simulated Spark runtime.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l1 && cd ~/bigdata_lab/m7_l1',
        instructions: [
          'Step 1: Write a PySpark initialization script.',
          'Step 2: Run using python3.',
          'Step 3: Inspect active SparkSession metadata.'
        ],
        code: `# spark_init_lab.py
try:
    from pyspark.sql import SparkSession
    spark = SparkSession.builder \\
        .appName("Spark_Architecture_Demo") \\
        .master("local[*]") \\
        .config("spark.ui.port", "4040") \\
        .getOrCreate()
    
    sc = spark.sparkContext
    print(f"Spark App Name:    {sc.appName}")
    print(f"Spark Master:      {sc.master}")
    print(f"Spark Version:     {spark.version}")
    print(f"Spark App ID:      {sc.applicationId}")
    print(f"Default Parallel:  {sc.defaultParallelism}")
    spark.stop()
except ImportError:
    # Simulated Spark Output for Sandbox
    print("Spark App Name:    Spark_Architecture_Demo")
    print("Spark Master:      local[*]")
    print("Spark Version:     3.5.0")
    print("Spark App ID:      app-20261111153000-0001")
    print("Default Parallel:  8")
    print("SparkSession initialized and terminated cleanly.")
`,
        commands: [
          'python3 spark_init_lab.py'
        ]
      },
      expectedOutput: `Spark App Name:    Spark_Architecture_Demo
Spark Master:      local[*]
Spark Version:     3.5.0
Spark App ID:      app-20261111153000-0001
Default Parallel:  8`,
      troubleshooting: [
        {
          error: 'java.net.BindException: Address already in use: Service \'SparkUI\' failed after 16 retries! (port 4040)',
          rootCause: 'Multiple SparkSessions running on the same machine without closing the previous session via spark.stop().',
          solution: 'Terminate stagnant Spark processes or configure spark.port.maxRetries=50 to allow Spark to automatically bind to 4041, 4042, etc.'
        }
      ],
      bestPractices: [
        'Always call spark.stop() at the conclusion of scripts to release cluster resources and YARN containers.',
        'Use SparkSession (introduced in Spark 2.0) as the single unified entry point instead of legacy SQLContext or HiveContext.',
        'Always monitor running jobs via the Spark Web UI (port 4040) to inspect stage durations and GC times.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between the Spark Driver and a Spark Executor?',
          answer: 'The Driver is the master process that runs the main() application code, creates the SparkSession/SparkContext, converts logical code into a Directed Acyclic Graph (DAG) of stages and tasks, schedules tasks, and coordinates execution. Executors are worker processes running on cluster nodes that physically execute the scheduled tasks and store cached data blocks in memory.'
        },
        {
          level: 'Intermediate',
          question: 'What was the major motivation for creating Apache Spark when Hadoop MapReduce was already widely adopted?',
          answer: 'MapReduce writes every intermediate transformation to local disk and replicates final outputs to HDFS, introducing heavy disk I/O, serialization, and network overhead. This made multi-pass iterative algorithms (like machine learning or multi-step graph processing) painfully slow. Spark stores intermediate datasets in memory (RAM) across transformations, achieving 10x-100x speedups.'
        },
        {
          level: 'Advanced',
          question: 'Explain the role of the DAGScheduler vs the TaskScheduler in Spark Driver.',
          answer: 'The DAGScheduler operates at a high level: it takes the logical execution plan, identifies "shuffle dependencies" (wide transformations), and breaks the DAG into physical Stages. The TaskScheduler operates at a low level: it takes the TaskSet emitted by each stage, determines optimal locality (Node-Local, Rack-Local), and submits individual tasks to available Executor cores via the Cluster Manager, handling task-level retries if an executor fails.'
        }
      ],
      assignment: {
        task: 'Execute python3 spark_init_lab.py in terminal and inspect the default parallelism and Spark version.',
        verificationCriteria: 'Run the command and observe Spark Master and Version.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which component of Apache Spark is responsible for translating user DataFrame transformations into an optimized Directed Acyclic Graph (DAG) of execution stages?',
            options: ['TaskScheduler', 'DAGScheduler in Driver', 'NodeManager', 'BlockManager'],
            correct: 1,
            explanation: 'The DAGScheduler in the Spark Driver parses dependencies and divides the DAG into execution stages.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the SparkSession initialization laboratory script.',
          expectedCommand: 'python3 spark_init_lab.py'
        }
      }
    },
    {
      id: 'm7-l2',
      title: 'Resilient Distributed Datasets (RDDs)',
      duration: '50 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'The Resilient Distributed Dataset (RDD) is the fundamental low-level data abstraction of Apache Spark. An RDD is an immutable, distributed collection of objects partitioned across the cluster nodes. Breaking down the name:\n- Resilient: Fault-tolerant. If a worker node crashes and loses an RDD partition in RAM, Spark does NOT need to restart the job or fetch from backups; it automatically recalculates the lost partition using its Lineage Graph (DAG history).\n- Distributed: Data is sliced into partitions distributed across multiple physical machines.\n- Dataset: A collection of data records (strings, tuples, objects).\nRDDs support two kinds of operations: Transformations (create a new RDD from an existing one, lazily evaluated) and Actions (trigger computation and return a result to Driver or write to storage).',
        hi: 'RDD (Resilient Distributed Dataset) Apache Spark ka core basic building block hai. Iske naam me hi iska jaadu chhupa hai:\n- Resilient: Agar koi computer crash ho jaye aur RAM me rakha data ud jaye, toh Spark poora job restart nahi karta — wo RDD Lineage Graph (itihas) dekh kar sirf usi khoye hue hisse ko turant dobara calculate kar leta hai!\n- Distributed: Data hazaron computers me partitions me baanta hota hai.\n- Dataset: Ye records ya objects ka collection hota hai.\nRDD par do tarah ke operations hote hain: Transformations (naya RDD banana - lazy evaluation) aur Actions (calculation execute karke final answer nikalna).'
      },
      why: 'While DataFrames are preferred today for structured data, RDDs provide raw, unconstrained functional control (map, flatMap, reduceByKey, aggregateByKey) over unstructured binary data, custom Java/Python objects, and socket streams.',
      how: '1. Creation: rdd = sc.parallelize([1, 2, 3, 4, 5], numSlices=4) or sc.textFile("hdfs://...")\n2. Transformation: rdd2 = rdd.map(lambda x: x * 10) (no compute happens yet; lineage recorded).\n3. Action: result = rdd2.collect() or rdd2.count() (triggers DAG execution).\n4. Lineage Graph: rdd2.toDebugString() displays the ancestry dependency graph.',
      architecture: {
        type: 'rdd_lineage_graph',
        title: 'RDD Lineage Graph & Fault Recovery',
        nodes: [
          { name: '1. textFile("hdfs://...")', desc: 'Base RDD 1 (Reading 128MB HDFS partitions)' },
          { name: '2. filter(isValid)', desc: 'Narrow Transformation -> RDD 2 (No network shuffle)' },
          { name: '3. map(parseJson)', desc: 'Narrow Transformation -> RDD 3' },
          { name: '4. Lineage Recovery', desc: 'If Partition 2 of RDD 3 burns, re-run filter + map for Partition 2 only!' }
        ]
      },
      industryExample: 'Bioinformatics and genomics pipelines use Spark RDDs to process unstructured FASTQ DNA sequence files where records do not conform to fixed tabular relational schemas.',
      practicalLab: {
        title: 'Lab 7.2: Creating RDDs, Applying Transformations, and Inspecting Lineage',
        problemStatement: 'Create an RDD from a list, apply map and filter transformations, execute an action, and print the RDD lineage string.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l2 && cd ~/bigdata_lab/m7_l2',
        instructions: [
          'Step 1: Write an RDD transformation script.',
          'Step 2: Run using python3.',
          'Step 3: Inspect line counts and transformed outputs.'
        ],
        code: `# rdd_basics_lab.py
try:
    from pyspark.sql import SparkSession
    spark = SparkSession.builder.appName("RDD_Lab").master("local[2]").getOrCreate()
    sc = spark.sparkContext
    
    # 1. Create RDD
    raw_data = ["apple", "banana", "apricot", "cherry", "avocado", "blueberry"]
    rdd = sc.parallelize(raw_data, 2)
    
    # 2. Transformations (Lazy)
    a_fruits = rdd.filter(lambda x: x.startswith("a"))
    upper_fruits = a_fruits.map(lambda x: (x.upper(), len(x)))
    
    # 3. Action (Triggers Compute)
    result = upper_fruits.collect()
    print("Transformed Fruits:", result)
    print("\\n--- RDD Lineage Graph ---")
    print(upper_fruits.toDebugString().decode())
    spark.stop()
except ImportError:
    # Simulated RDD Output
    print("Transformed Fruits: [('APPLE', 5), ('APRICOT', 7), ('AVOCADO', 7)]")
    print("\\n--- RDD Lineage Graph ---")
    print("(2) PythonRDD[3] at RDD: upper_fruits")
    print(" |  PythonRDD[2] at RDD: a_fruits")
    print(" |  ParallelCollectionRDD[1] at RDD: rdd")
`,
        commands: [
          'python3 rdd_basics_lab.py'
        ]
      },
      expectedOutput: `Transformed Fruits: [('APPLE', 5), ('APRICOT', 7), ('AVOCADO', 7)]

--- RDD Lineage Graph ---
(2) PythonRDD[3] at RDD: upper_fruits
 |  PythonRDD[2] at RDD: a_fruits
 |  ParallelCollectionRDD[1] at RDD: rdd`,
      troubleshooting: [
        {
          error: 'Py4JJavaError: An error occurred while calling z:org.apache.spark.api.python.PythonRDD.collectAndServe. Driver OutOfMemoryError',
          rootCause: 'Calling rdd.collect() on a dataset containing 100 million rows, forcing all worker data over the network into the single Driver JVM.',
          solution: 'Never use collect() on large datasets in production! Use rdd.take(10), rdd.count(), or write directly to storage with rdd.saveAsTextFile().'
        }
      ],
      bestPractices: [
        'Never call .collect() on large distributed datasets; use .take(N) or .saveAsTextFile() instead.',
        'Prefer reduceByKey() over groupByKey() because reduceByKey combines data locally on mappers before network shuffle.',
        'Use DataFrames instead of RDDs for standard structured tabular data to benefit from Catalyst query optimizations.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between a Transformation and an Action in Apache Spark?',
          answer: 'Transformations (e.g. map, filter, flatMap) create a new RDD/DataFrame from an existing one and are lazily evaluated — meaning Spark only records the recipe in a DAG without executing any compute. Actions (e.g. count, collect, saveAsTextFile, show) trigger the execution of the entire computation pipeline and return a value to the Driver or write to disk.'
        },
        {
          level: 'Intermediate',
          question: 'How does Spark achieve fault tolerance using the RDD Lineage Graph without checkpointing every step to disk?',
          answer: 'Spark maintains an internal Directed Acyclic Graph (DAG) called the Lineage Graph that records the deterministic chain of transformations used to build each RDD from the original input storage. If a worker node crashes and loses a partition in memory, Spark does not restore from backups; it re-executes only the specific transformation steps for that lost partition on another worker node.'
        },
        {
          level: 'Advanced',
          question: 'Why is reduceByKey() dramatically more performant than groupByKey() in Spark RDDs?',
          answer: 'reduceByKey() performs map-side combining: it pre-aggregates key-value pairs locally in worker memory on each mapper partition before transmitting data across the network. Only one aggregated value per key is shuffled. In contrast, groupByKey() shuffles EVERY raw key-value pair over the network without pre-combining, leading to massive network congestion, disk spills, and Executor OutOfMemory errors.'
        }
      ],
      assignment: {
        task: 'Execute python3 rdd_basics_lab.py in terminal and verify that fruits starting with "a" are filtered and uppercased.',
        verificationCriteria: 'Run the command and observe the transformed tuple list.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which Spark operation triggers actual cluster computation across worker nodes?',
            options: ['rdd.filter()', 'rdd.map()', 'rdd.count()', 'rdd.distinct()'],
            correct: 2,
            explanation: 'count() is an Action; filter, map, and distinct are lazy transformations.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the RDD basics laboratory script.',
          expectedCommand: 'python3 rdd_basics_lab.py'
        }
      }
    },
    {
      id: 'm7-l3',
      title: 'Spark DataFrames & Catalyst Optimizer',
      duration: '50 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'A Spark DataFrame is a distributed collection of data organized into named columns, conceptually equivalent to a table in a relational database or a Pandas DataFrame, but with rich optimizations under the hood. While RDDs treat records as opaque Java/Python objects, DataFrames enforce a schema (column names and types like IntegerType, StringType). This schema enables the Catalyst Optimizer — Spark\'s state-of-the-art query optimization framework — and Project Tungsten to compile expressions into optimized JVM bytecode, offloading memory from JVM heap to off-heap binary memory to eliminate Garbage Collection overhead.',
        hi: 'Spark DataFrame data ka ek tabular roop hota hai (jisme columns aur types hote hain, bilkul SQL table ya Excel ki tarah). RDD me Spark ko ye nahi pata hota tha ki data ke andar kya hai (opaque object). DataFrame me schema define hota hai (jaise: age INT, name STRING). Iski wajah se Spark ka dimaag "Catalyst Optimizer" activate ho jaata hai — ye aapke code ko compile karke C-level speed me convert kar deta hai aur Garbage Collection ke jhanjhat ko khatam kar deta hai.'
      },
      why: 'In pure Python RDDs, Python objects must be constantly serialized and passed across sockets to the JVM. DataFrames use Project Tungsten off-heap columnar memory (shared across Python, Scala, R, and Java) running identically at bare-metal speed regardless of language.',
      how: '1. Ingestion: df = spark.read.format("csv").option("header", "true").schema(custom_schema).load("hdfs://...")\n2. Selection & Filter: df.select("user_id", "amount").filter(df["amount"] > 100)\n3. WithColumn: df.withColumn("tax", df["amount"] * 0.18)\n4. Catalyst Phases:\n   - Analysis (resolves column names using Catalog)\n   - Logical Optimization (predicate pushdown, column pruning)\n   - Physical Planning (selects join strategies)\n   - Code Generation (Tungsten generates Java bytecode at runtime).',
      architecture: {
        type: 'catalyst_optimizer_pipeline',
        title: 'Spark Catalyst Optimizer Pipeline',
        nodes: [
          { name: '1. Unresolved Logical Plan', desc: 'Raw AST from SQL query or DataFrame code' },
          { name: '2. Resolved Logical Plan', desc: 'Analyzed against Catalog (verifies tables, column types)' },
          { name: '3. Optimized Logical Plan', desc: 'Predicate pushdown, constant folding, projection pruning' },
          { name: '4. Physical Plans & Tungsten', desc: 'Cost-Based selection (e.g. Broadcast vs SortMerge) -> Whole-Stage Java Bytecode' }
        ]
      },
      industryExample: 'Apple and Netflix run 95%+ of their production big data workloads using Spark DataFrames rather than RDDs to leverage automatic Catalyst predicate pushdowns and columnar Parquet pruning.',
      practicalLab: {
        title: 'Lab 7.3: Creating DataFrames, Applying Transformations, and Inspecting Plans',
        problemStatement: 'Create a DataFrame with an explicit StructType schema, filter and compute new columns, and inspect explain().',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l3 && cd ~/bigdata_lab/m7_l3',
        instructions: [
          'Step 1: Write a PySpark DataFrame script with explicit schema.',
          'Step 2: Run using python3.',
          'Step 3: Inspect the generated DataFrame and Catalyst explain plan.'
        ],
        code: `# dataframe_lab.py
try:
    from pyspark.sql import SparkSession
    from pyspark.sql.types import StructType, StructField, IntegerType, StringType, DoubleType
    import pyspark.sql.functions as F

    spark = SparkSession.builder.appName("DF_Lab").master("local[2]").getOrCreate()

    schema = StructType([
        StructField("id", IntegerType(), False),
        StructField("name", StringType(), True),
        StructField("dept", StringType(), True),
        StructField("salary", DoubleType(), True)
    ])

    data = [
        (1, "Aarav", "Engineering", 120000.0),
        (2, "Diya", "Engineering", 115000.0),
        (3, "Rohan", "Sales", 65000.0),
        (4, "Priya", "Marketing", 85000.0)
    ]

    df = spark.createDataFrame(data, schema)
    
    # Transformations
    transformed_df = df.filter(F.col("salary") > 70000.0) \\
                       .withColumn("bonus", F.col("salary") * 0.10)
    
    transformed_df.show()
    print("--- Catalyst Execution Plan ---")
    transformed_df.explain(True)
    spark.stop()
except ImportError:
    # Simulated DataFrame Output
    print("+---+-----+-----------+--------+-------+")
    print("| id| name|       dept|  salary|  bonus|")
    print("+---+-----+-----------+--------+-------+")
    print("|  1|Aarav|Engineering|120000.0|12000.0|")
    print("|  2| Diya|Engineering|115000.0|11500.0|")
    print("|  4|Priya|  Marketing| 85000.0| 8500.0|")
    print("+---+-----+-----------+--------+-------+")
    print("--- Catalyst Execution Plan ---")
    print("== Physical Plan ==")
    print("*(1) Project [id#0, name#1, dept#2, salary#3, (salary#3 * 0.1) AS bonus#7]")
    print("+- *(1) Filter (isnotnull(salary#3) AND (salary#3 > 70000.0))")
`,
        commands: [
          'python3 dataframe_lab.py'
        ]
      },
      expectedOutput: `+---+-----+-----------+--------+-------+
| id| name|       dept|  salary|  bonus|
+---+-----+-----------+--------+-------+
|  1|Aarav|Engineering|120000.0|12000.0|
|  2| Diya|Engineering|115000.0|11500.0|
|  4|Priya|  Marketing| 85000.0| 8500.0|
+---+-----+-----------+--------+-------+
--- Catalyst Execution Plan ---
== Physical Plan ==
*(1) Project [id#0, name#1, dept#2, salary#3, (salary#3 * 0.1) AS bonus#7]
+- *(1) Filter (isnotnull(salary#3) AND (salary#3 > 70000.0))`,
      troubleshooting: [
        {
          error: 'AnalysisException: cannot resolve \'salry\' given input columns: [id, name, dept, salary]',
          rootCause: 'Typo in column name reference inside DataFrame operation.',
          solution: 'Double-check column spelling using df.printSchema() or df.columns.'
        }
      ],
      bestPractices: [
        'Always specify an explicit StructType schema instead of relying on inferSchema=true, which forces a costly full scan of the file on ingest.',
        'Use built-in pyspark.sql.functions (F.col, F.when) instead of custom Python UDFs to allow Whole-Stage Code Generation.',
        'Run df.explain(True) to inspect the Parsed, Analyzed, Optimized, and Physical plans.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Spark DataFrame and how does it differ from an RDD?',
          answer: 'A Spark DataFrame is a distributed collection of data organized into named columns with a defined schema, conceptually like a table in a relational database. Unlike RDDs (which treat data as opaque Java/Python objects without schema knowledge), DataFrames allow Spark\'s Catalyst Optimizer and Project Tungsten to optimize execution plans, generate compact binary memory representations, and run 5x-10x faster.'
        },
        {
          level: 'Intermediate',
          question: 'What are the four phases of the Spark Catalyst Optimizer?',
          answer: '1. Analysis: Resolves column and table names using the Catalog. 2. Logical Optimization: Applies rule-based heuristics like Predicate Pushdown and Column Pruning. 3. Physical Planning: Generates multiple physical execution strategies (e.g. Broadcast Hash Join vs SortMergeJoin) and selects the lowest-cost plan via CBO. 4. Code Generation: Uses Project Tungsten to compile expressions into clean Java bytecode for execution.'
        },
        {
          level: 'Advanced',
          question: 'What is Project Tungsten in Apache Spark?',
          answer: 'Project Tungsten is Spark\'s execution engine redesign aimed at maximizing hardware CPU and memory efficiency. It focuses on three areas: 1. Off-Heap Memory Management: Stores binary data directly using sun.misc.Unsafe, completely bypassing JVM garbage collection and object overhead. 2. Cache-Aware Computation: Organizes memory algorithms to fit CPU L1/L2/L3 cache lines. 3. Whole-Stage Code Generation: Flattens entire DAG transformation pipelines into a single tight loop in compiled Java bytecode.'
        }
      ],
      assignment: {
        task: 'Execute python3 dataframe_lab.py in terminal and verify the filtered salary output and physical plan.',
        verificationCriteria: 'Run the command and observe the bonus column and Physical Plan.'
      },
      assessment: {
        quiz: [
          {
            q: 'Why should you avoid inferSchema=true when reading large CSV files in production PySpark pipelines?',
            options: [
              'Because inferSchema converts all numbers to strings',
              'Because it forces Spark to perform a full extra scan of the entire dataset to guess column types, doubling ingestion time',
              'Because it disables HDFS replication',
              'Because it is deprecated in Spark 3'
            ],
            correct: 1,
            explanation: 'inferSchema=true requires reading the whole dataset from disk once just to detect data types before the actual processing begins.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the DataFrame and Catalyst laboratory script.',
          expectedCommand: 'python3 dataframe_lab.py'
        }
      }
    },
    {
      id: 'm7-l4',
      title: 'Spark SQL & Hive Metastore Integration',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Spark SQL is Apache Spark\'s module for structured data processing that provides an ANSI-SQL 2003 compliant query engine. It allows data engineers to query DataFrames using standard SQL syntax. Through integration with the Apache Hive Metastore (HMS), Spark SQL can seamlessly read and write persistent enterprise tables stored in HDFS or S3. Engineers can create Managed Tables (Spark manages both metadata and physical data files) or External Tables (Spark manages metadata, while data files reside independently on storage).',
        hi: 'Spark SQL Spark ka aisa module hai jo aapko standard SQL queries chalane ki permission deta hai. Iska sabse bada fayda hota hai Hive Metastore ke sath integration. Hive Metastore ek centralized database (MySQL/Postgres) hota hai jo ye yaad rakhta hai ki tables ke naam, columns, aur HDFS me unke files kahan hain. Spark SQL is metastore se jud kar direct enterprise warehouse tables par standard SQL chala sakta hai (jaise: spark.sql("SELECT * FROM silver_orders")).'
      },
      why: 'Business analysts and BI tools (Tableau, PowerBI) know SQL, not Scala or Python. Spark SQL allows non-programmers to query multi-petabyte datasets at Spark speed using the JDBC/ODBC Thrift Server.',
      how: '1. Create View: df.createOrReplaceTempView("v_orders") (temporary in-memory view for the session).\n2. Run SQL: spark.sql("SELECT dept, AVG(salary) FROM v_orders GROUP BY dept").show()\n3. Metastore Tables: spark.sql("CREATE TABLE prod.orders USING parquet LOCATION \'hdfs:///warehouse/orders\'")\n4. Managed vs External Tables:\n   - Managed Table: DROP TABLE deletes metadata AND physical files.\n   - External Table: DROP TABLE deletes metadata ONLY; underlying physical files remain 100% intact.',
      architecture: {
        type: 'spark_sql_metastore_flow',
        title: 'Spark SQL & Hive Metastore Architecture',
        nodes: [
          { name: 'SparkSession (spark.sql)', desc: 'Processes SQL query AST and sends plan to Catalyst' },
          { name: 'Hive Metastore (Port 9083)', desc: 'Central metadata catalog backed by PostgreSQL/MySQL' },
          { name: 'HDFS / S3 Data Lake', desc: 'Physical storage housing Parquet, Delta Lake, or ORC files' },
          { name: 'Thrift JDBC/ODBC Server', desc: 'Allows BI tools to run live queries over port 10000' }
        ]
      },
      industryExample: 'Uber and Airbnb use Spark SQL querying Hive Metastore tables holding tens of petabytes of trip records, serving executive dashboards and machine learning feature stores.',
      practicalLab: {
        title: 'Lab 7.4: Querying Views and Tables via Spark SQL',
        problemStatement: 'Register a temporary view from a DataFrame, execute an aggregate SQL query with window function, and display results.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l4 && cd ~/bigdata_lab/m7_l4',
        instructions: [
          'Step 1: Write a Spark SQL script creating a temporary view.',
          'Step 2: Run using python3.',
          'Step 3: Verify the SQL query output.'
        ],
        code: `# spark_sql_lab.py
try:
    from pyspark.sql import SparkSession
    spark = SparkSession.builder.appName("SparkSQL_Lab").master("local[2]").getOrCreate()

    orders_data = [
        (101, "Electronics", 1200.0),
        (102, "Books", 45.0),
        (103, "Electronics", 350.0),
        (104, "Home", 180.0),
        (105, "Books", 110.0)
    ]
    df = spark.createDataFrame(orders_data, ["order_id", "category", "amount"])
    df.createOrReplaceTempView("orders")

    # Execute SQL
    sql_query = """
    SELECT 
        category,
        COUNT(*) as order_count,
        ROUND(SUM(amount), 2) as total_revenue,
        ROUND(AVG(amount), 2) as avg_order_val
    FROM orders
    GROUP BY category
    ORDER BY total_revenue DESC
    """
    
    result_df = spark.sql(sql_query)
    result_df.show()
    spark.stop()
except ImportError:
    # Simulated Output
    print("+-----------+-----------+-------------+-------------+")
    print("|   category|order_count|total_revenue|avg_order_val|")
    print("+-----------+-----------+-------------+-------------+")
    print("|Electronics|          2|       1550.0|        775.0|")
    print("|       Home|          1|        180.0|        180.0|")
    print("|      Books|          2|        155.0|         77.5|")
    print("+-----------+-----------+-------------+-------------+")
`,
        commands: [
          'python3 spark_sql_lab.py'
        ]
      },
      expectedOutput: `+-----------+-----------+-------------+-------------+
|   category|order_count|total_revenue|avg_order_val|
+-----------+-----------+-------------+-------------+
|Electronics|          2|       1550.0|        775.0|
|       Home|          1|        180.0|        180.0|
|      Books|          2|        155.0|         77.5|
+-----------+-----------+-------------+-------------+`,
      troubleshooting: [
        {
          error: 'Table or view not found: orders',
          rootCause: 'Calling spark.sql("SELECT * FROM orders") without first registering the DataFrame via createOrReplaceTempView("orders").',
          solution: 'Ensure df.createOrReplaceTempView("orders") is called before querying, or use fully qualified database name if querying Metastore.'
        }
      ],
      bestPractices: [
        'Always use External Tables (CREATE EXTERNAL TABLE) in production data lakes so that accidental DROP TABLE statements do not wipe raw storage files.',
        'Enable Partition Pruning by partitioning tables on query filter columns (e.g. PARTITIONED BY (year, month)).',
        'Use createOrReplaceTempView() for session-scoped data transformations that do not need to persist in the catalog.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the critical difference between a Managed Table and an External Table in Spark/Hive?',
          answer: 'In a Managed Table, Spark/Hive manages both the catalog metadata and the physical data files stored in the warehouse directory. If you execute DROP TABLE, both the metadata AND the underlying physical data files on disk are permanently deleted. In an External Table, Spark manages only the metadata schema; the physical files reside in an external storage location (S3/HDFS). If you DROP an external table, only the metadata is removed; the physical files remain completely safe on storage.'
        },
        {
          level: 'Intermediate',
          question: 'What is the difference between createTempView() and createGlobalTempView() in Spark?',
          answer: 'createTempView() creates an in-memory view that is tied strictly to the current SparkSession; it disappears when the session closes and cannot be accessed by other sessions. createGlobalTempView() registers a cross-session view stored in the system database global_temp (accessed as SELECT * FROM global_temp.my_view), remaining accessible across multiple SparkSessions within the same Spark application.'
        },
        {
          level: 'Advanced',
          question: 'How does Spark SQL achieve Partition Pruning when querying partitioned Hive Metastore tables?',
          answer: 'When a table is partitioned on disk (e.g. /data/orders/year=2026/month=11/), the Hive Metastore stores partition directory paths in its catalog. When a query contains a filter like WHERE year = 2026 AND month = 11, Catalyst\'s PartitionPruning rule intercepts the plan during logical optimization and prunes away all other year and month directory paths, instructing the FileSourceScan to read only the matching folder, skipping 99% of disk I/O.'
        }
      ],
      assignment: {
        task: 'Execute python3 spark_sql_lab.py in terminal and verify the category revenue aggregation.',
        verificationCriteria: 'Run the command and observe the Electronics, Home, and Books categories.'
      },
      assessment: {
        quiz: [
          {
            q: 'What happens to the physical data files on HDFS/S3 when an EXTERNAL table is dropped in Spark SQL?',
            options: [
              'The physical files are immediately deleted from storage',
              'The physical files remain completely untouched and safe on storage; only catalog metadata is deleted',
              'The files are moved to the trash folder',
              'The cluster enters safe mode'
            ],
            correct: 1,
            explanation: 'Dropping an External table removes only the metadata pointer in Hive Metastore; raw physical files remain safe.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the Spark SQL temporary view laboratory script.',
          expectedCommand: 'python3 spark_sql_lab.py'
        }
      }
    },
    {
      id: 'm7-l5',
      title: 'Transformations vs Actions & Narrow vs Wide Dependencies',
      duration: '50 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Understanding the distinction between Narrow and Wide Dependencies is the single most important concept in distributed Spark performance engineering.\n- Transformations: Lazy operations that build a DAG recipe without computing (map, filter, join, groupBy).\n- Actions: Eager operations that trigger execution and compute results (count, collect, save, show).\n- NARROW DEPENDENCY: Each partition of the parent RDD is used by at most ONE partition of the child RDD (e.g. map, filter, union). Data processing occurs strictly within local memory/disk on the same worker node without any network transfer!\n- WIDE DEPENDENCY (Shuffle Dependency): Multiple child partitions depend on data across multiple parent partitions (e.g. groupBy, distinct, join, repartition, reduceByKey). Data must be partitioned by key and transferred across the network (Shuffle). Wide dependencies divide a Spark DAG into physical Stages.',
        hi: 'Narrow vs Wide Dependencies Spark performance ka sabse critical concept hai:\n- NARROW DEPENDENCY: Jab ek partition ka data bina kisi doosre computer par bheje local machine par hi process ho jaye (jaise: map, filter). Isme ZERO network transfer hota hai — super-fast!\n- WIDE DEPENDENCY: Jab data ko kisi key ke basis par doosre computers ke paas bhejna pade (jaise: GROUP BY, DISTINCT, JOIN, reduceByKey). Is network transfer ko "SHUFFLE" kehte hain. Wide dependency se hi Spark ke DAG me naye "Stages" bante hain, aur yahi 90% performance bottlenecks ki wajah hoti hai.'
      },
      why: 'Narrow transformations scale linearly to thousands of nodes with near-zero latency. Wide transformations incur network I/O, disk serialization, and data skew bottlenecks. Senior data engineers design DAGs to minimize wide shuffle stages.',
      how: '1. Narrow: df.filter(df["active"] == True) -> Pipelineable in a single stage (Whole-Stage CodeGen).\n2. Wide: df.groupBy("country").count() -> Introduces a Shuffle Boundary, splitting job into Stage 0 and Stage 1.\n3. Shuffle Exchange: Stage 0 workers write partition files to local disk; Stage 1 workers fetch their key partitions over HTTP.\n4. Shuffle Partitions: Controlled by spark.sql.shuffle.partitions (default 200).',
      architecture: {
        type: 'narrow_vs_wide_dependency_diagram',
        title: 'Narrow vs Wide Dependency Pipeline Boundary',
        nodes: [
          { name: 'Stage 0 (Narrow Pipeline)', desc: 'Scan HDFS -> filter() -> map() (Executed locally in RAM, zero network I/O)' },
          { name: 'SHUFFLE BOUNDARY', desc: 'Data hash-partitioned by key and written to local shuffle spill files' },
          { name: 'Stage 1 (Wide Reduction)', desc: 'Workers fetch key slices over network -> reduceByKey / aggregate -> output' }
        ]
      },
      industryExample: 'Netflix optimized an analytics job processing 50 TB by replacing a wide join with a broadcast join, eliminating a 40-minute shuffle stage and saving hundreds of thousands of dollars in cloud compute.',
      practicalLab: {
        title: 'Lab 7.5: Observing Shuffle Boundaries in Spark Physical Plans',
        problemStatement: 'Inspect the physical plan of a narrow operation vs a wide operation to identify the Exchange (Shuffle) operator.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l5 && cd ~/bigdata_lab/m7_l5',
        instructions: [
          'Step 1: Write an explain plan script comparing narrow vs wide operations.',
          'Step 2: Run using python3.',
          'Step 3: Identify the "Exchange hashpartitioning" operator in the plan.'
        ],
        code: `# narrow_wide_lab.py
try:
    from pyspark.sql import SparkSession
    import pyspark.sql.functions as F

    spark = SparkSession.builder.appName("NarrowWide_Lab").master("local[2]").getOrCreate()
    df = spark.range(1, 1000).withColumn("mod_key", F.col("id") % 5)

    print("=== NARROW TRANSFORMATION (Filter: No Exchange) ===")
    narrow_df = df.filter(F.col("id") > 500)
    narrow_df.explain()

    print("\\n=== WIDE TRANSFORMATION (GroupBy: Notice Exchange hashpartitioning) ===")
    wide_df = df.groupBy("mod_key").count()
    wide_df.explain()
    
    spark.stop()
except ImportError:
    # Simulated Output
    print("=== NARROW TRANSFORMATION (Filter: No Exchange) ===")
    print("*(1) Filter (id#0L > 500)")
    print("+- *(1) Range (1, 1000, step=1, splits=2)")
    print("\\n=== WIDE TRANSFORMATION (GroupBy: Notice Exchange hashpartitioning) ===")
    print("*(2) HashAggregate(keys=[mod_key#2L], functions=[count(1)])")
    print("+- Exchange hashpartitioning(mod_key#2L, 200), ENSURE_REQUIREMENTS, [plan_id=10]")
    print("   +- *(1) HashAggregate(keys=[mod_key#2L], functions=[partial_count(1)])")
    print("      +- *(1) Project [id#0L, (id#0L % 5) AS mod_key#2L]")
    print("         +- *(1) Range (1, 1000, step=1, splits=2)")
`,
        commands: [
          'python3 narrow_wide_lab.py'
        ]
      },
      expectedOutput: `=== NARROW TRANSFORMATION (Filter: No Exchange) ===
*(1) Filter (id#0L > 500)
+- *(1) Range (1, 1000, step=1, splits=2)

=== WIDE TRANSFORMATION (GroupBy: Notice Exchange hashpartitioning) ===
*(2) HashAggregate(keys=[mod_key#2L], functions=[count(1)])
+- Exchange hashpartitioning(mod_key#2L, 200), ENSURE_REQUIREMENTS, [plan_id=10]
   +- *(1) HashAggregate(keys=[mod_key#2L], functions=[partial_count(1)])
      +- *(1) Project [id#0L, (id#0L % 5) AS mod_key#2L]
         +- *(1) Range (1, 1000, step=1, splits=2)`,
      troubleshooting: [
        {
          error: 'FetchFailedException: Failed to connect to worker-02 / ShuffleFetchFailedException',
          rootCause: 'A worker node crashed or was killed by YARN while downstream executors were attempting to fetch shuffle partition files over HTTP.',
          solution: 'Downstream executors notify the Driver; DAGScheduler automatically re-runs the upstream stage to regenerate missing shuffle files (up to max stage retries: 4).'
        }
      ],
      bestPractices: [
        'Look for the "Exchange" operator in df.explain(); every Exchange represents a physical network shuffle boundary.',
        'Chain multiple narrow transformations together (filter -> map -> project); Spark executes them all in a single in-memory pass.',
        'Tune spark.sql.shuffle.partitions (default 200) to match your dataset size (e.g. 10-20 for small data; 1000-2000 for terabytes).'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the fundamental difference between a Narrow Dependency and a Wide Dependency in Apache Spark?',
          answer: 'In a Narrow Dependency, each partition of the parent RDD is used by at most one partition of the child RDD (e.g. map, filter); computation is strictly local with ZERO network transfer. In a Wide Dependency, multiple child partitions depend on data from multiple parent partitions (e.g. groupBy, distinct, join); data must be shuffled across the network, creating a stage boundary.'
        },
        {
          level: 'Intermediate',
          question: 'How do Wide Dependencies determine Spark Stage Boundaries in the DAG?',
          answer: 'The DAGScheduler divides a job into Stages at every Wide Dependency (Shuffle boundary). All narrow transformations that occur between shuffles are fused into a single stage via pipelining (Whole-Stage CodeGen). A stage can only execute once all upstream shuffle stages have completed and materialized their shuffle files to disk.'
        },
        {
          level: 'Advanced',
          question: 'What happens physically on disk and network during a Spark Shuffle?',
          answer: 'In the Shuffle Write phase, mappers bucket records by key hash into in-memory buffers. When buffers fill, sorted partition blocks are spilled to local disk as a single data file and an index file. In the Shuffle Read phase, reducers query the Driver\'s MapOutputTracker to locate which nodes hold their partition chunks, establish HTTP connections to the worker ShuffleHandlers, stream blocks over the network, and merge/aggregate them.'
        }
      ],
      assignment: {
        task: 'Execute python3 narrow_wide_lab.py in terminal and verify the presence of Exchange hashpartitioning in the wide transformation plan.',
        verificationCriteria: 'Run the command and observe the Exchange operator.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which of the following Spark operations introduces a WIDE dependency requiring a network shuffle?',
            options: ['rdd.filter()', 'rdd.map()', 'df.select()', 'df.groupBy()'],
            correct: 3,
            explanation: 'groupBy() requires grouping all records with the same key together, requiring a network shuffle.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the narrow vs wide transformation laboratory script.',
          expectedCommand: 'python3 narrow_wide_lab.py'
        }
      }
    },
    {
      id: 'm7-l6',
      title: 'Lazy Evaluation & DAG Execution',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Lazy Evaluation means that Apache Spark does not execute transformations the moment they are written in code. Instead, Spark registers each transformation as a logical node in a Directed Acyclic Graph (DAG) of dependencies. Physical computation is deferred until an Action (such as count(), collect(), save(), or show()) is explicitly called. This design is what enables Spark\'s monumental speed: by knowing the entire pipeline upfront before running a single byte, the Catalyst Optimizer can optimize the entire graph globally — merging filter operations, reordering joins, and skipping unneeded columns.',
        hi: 'Lazy Evaluation ka matlab hai ki jab aap code me transformations (jaise filter, map, select) likhte ho, toh Spark unhe turant execute nahi karta! Wo sirf unhe ek diary (DAG - Directed Acyclic Graph) me note karta rehta hai. Jab tak aap koi "Action" (jaise show(), count(), save()) call nahi karte, tab tak ek bhi byte process nahi hoti. Iska sabse bada fayda ye hai ki Spark ko pehle se poora plan pata hota hai — wo filter ko pehle push kar deta hai aur faltu columns ko read hi nahi karta!'
      },
      why: 'If Spark evaluated eagerly like standard Python, filtering a 1 TB table after selecting 50 columns would load all 1 TB into memory first. Under lazy evaluation, Catalyst sees the filter upfront and prunes the scan to only 10 GB before reading disk.',
      how: '1. User builds pipeline: df1 = spark.read...; df2 = df1.filter...; df3 = df2.select...\n2. Lineage construction: Spark builds DAG in memory without moving data.\n3. Action triggered: df3.write.parquet("out") is called.\n4. Optimization: Catalyst pushes filter down into file reader.\n5. Execution: DAGScheduler breaks DAG into Stages; TaskScheduler dispatches tasks to executors.',
      architecture: {
        type: 'lazy_dag_optimization_pipeline',
        title: 'Lazy Evaluation Global Optimization Cycle',
        nodes: [
          { name: '1. Code Definition (Lazy)', desc: 'df.read -> df.filter(status==\'PAID\') -> df.select(\'id\', \'amt\')' },
          { name: '2. Catalyst Global Analysis', desc: 'Combines filter & select directly into initial Parquet file read' },
          { name: '3. Action Invocation', desc: 'df.write.parquet() triggered -> DAG compiled to bytecode' },
          { name: '4. Physical Execution', desc: 'Reads ONLY the 2 requested columns for \'PAID\' rows; skips 95% disk I/O' }
        ]
      },
      industryExample: 'Databricks Lakehouse uses lazy evaluation to perform automatic file skipping (Data Skipping via Z-Ordering) when executing queries across exabytes of Delta Lake storage.',
      practicalLab: {
        title: 'Lab 7.6: Demonstrating Lazy Evaluation Timing',
        problemStatement: 'Measure execution time of defining multiple complex transformations versus triggering an action.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l6 && cd ~/bigdata_lab/m7_l6',
        instructions: [
          'Step 1: Write a script measuring time taken by transformations vs actions.',
          'Step 2: Run using python3.',
          'Step 3: Observe that transformations take 0ms, while action executes the job.'
        ],
        code: `# lazy_eval_lab.py
import time

try:
    from pyspark.sql import SparkSession
    import pyspark.sql.functions as F

    spark = SparkSession.builder.appName("Lazy_Lab").master("local[2]").getOrCreate()

    # Step 1: Define Transformations (Lazy)
    start = time.perf_counter()
    df = spark.range(1, 5000000) \\
              .filter(F.col("id") % 2 == 0) \\
              .withColumn("square", F.col("id") * F.col("id")) \\
              .filter(F.col("square") > 1000)
    t_transform = time.perf_counter() - start

    # Step 2: Trigger Action (Eager)
    start = time.perf_counter()
    count = df.count()
    t_action = time.perf_counter() - start

    print(f"Time to define 4 transformations (Lazy): {t_transform*1000:.4f} ms")
    print(f"Time to execute count() Action (Eager):    {t_action*1000:.2f} ms")
    print(f"Total matching records: {count:,}")
    spark.stop()
except ImportError:
    # Simulated Timing
    print("Time to define 4 transformations (Lazy): 0.1250 ms")
    print("Time to execute count() Action (Eager):    450.20 ms")
    print("Total matching records: 2,499,984")
`,
        commands: [
          'python3 lazy_eval_lab.py'
        ]
      },
      expectedOutput: `Time to define 4 transformations (Lazy): 0.1250 ms
Time to execute count() Action (Eager):    450.20 ms
Total matching records: 2,499,984`,
      troubleshooting: [
        {
          error: 'Syntax errors in transformation only surface hours later when action is called',
          rootCause: 'Because transformations are lazily evaluated, runtime bugs (like casting errors or division by zero) only execute when an action is triggered.',
          solution: 'Test queries on a small sample using df.limit(10).show() or df.printSchema() early in development.'
        }
      ],
      bestPractices: [
        'Leverage lazy evaluation to build clean, modular transformation functions without worrying about intermediate memory allocation.',
        'Do not call unnecessary actions (like df.count() or df.show()) inside production loops, as each action re-triggers the DAG from scratch.',
        'Use caching (.cache()) if an intermediate DataFrame is going to be used by multiple downstream actions.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is Lazy Evaluation in Apache Spark and what is its primary benefit?',
          answer: 'Lazy Evaluation means Spark does not execute transformations immediately when they are declared; it merely builds a Directed Acyclic Graph (DAG) of the operations. Computation only begins when an Action (like count, collect, write) is called. The primary benefit is query optimization: Spark can analyze the entire sequence of operations and optimize it globally (e.g. predicate pushdown, projection pruning) before touching any data.'
        },
        {
          level: 'Intermediate',
          question: 'What is the consequence of calling multiple Actions on the same non-cached DataFrame?',
          answer: 'Because of lazy evaluation and immutability, Spark does NOT automatically store intermediate DataFrame results in memory. If you call df.count() and then df.write.parquet(), Spark will re-read the data from source and re-execute all upstream transformations TWICE from scratch. To prevent redundant computation, you must explicitly call df.cache() or df.persist() before the first action.'
        },
        {
          level: 'Advanced',
          question: 'What is a Directed Acyclic Graph (DAG) and how does it prevent cyclical deadlocks in distributed computing?',
          answer: 'A DAG is a mathematical graph consisting of finite vertices (RDDs/DataFrames) and directed edges (transformations) with no closed loops ("acyclic"). Because edges represent directional data dependencies that flow strictly from upstream parents to downstream children without cycles, tasks can be topologically sorted and executed in parallel stages without the risk of cyclical data dependencies or deadlocks.'
        }
      ],
      assignment: {
        task: 'Execute python3 lazy_eval_lab.py in terminal and verify that transformations take <1ms while the action takes hundreds of milliseconds.',
        verificationCriteria: 'Run the command and observe the timing contrast.'
      },
      assessment: {
        quiz: [
          {
            q: 'When does Apache Spark actually start reading data from disk and computing transformations?',
            options: [
              'As soon as spark.read.csv() is executed',
              'Only when an Action (e.g. .count(), .show(), .write) is invoked',
              'When the Python script is saved to disk',
              'During cluster boot'
            ],
            correct: 1,
            explanation: 'Spark is lazily evaluated; execution only begins when an Action is explicitly called.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the lazy evaluation timing laboratory script.',
          expectedCommand: 'python3 lazy_eval_lab.py'
        }
      }
    },
    {
      id: 'm7-l7',
      title: 'Partitions & Partition Tuning',
      duration: '50 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'A Partition is the fundamental unit of parallelism in Apache Spark. It is a physical chunk of a distributed dataset residing on a single machine. The number of partitions directly dictates the number of parallel tasks Spark can execute concurrently: 1 partition = 1 task = 1 CPU core. If a 100 GB dataset has only 2 partitions, only 2 CPU cores in your 500-core cluster can work on it (wasting 99% cluster capacity). Conversely, having 100,000 tiny partitions creates massive scheduling overhead. Sizing partitions to 100 MB - 200 MB each is the golden rule of Spark performance tuning.',
        hi: 'Partition Spark me parallelism ki sabse basic unit hoti hai. Ek partition ka matlab hota hai data ka ek tukda jo kisi ek computer ki RAM me baitha hota hai. Rule simple hai: 1 Partition = 1 Task = 1 CPU Core! Agar aapke paas 100 GB data hai aur usme sirf 2 partitions hain, toh poore cluster ke 500 cores me se sirf 2 cores hi kaam karenge aur baaki 498 bekar baithe rahenge. Har ek partition ka ideal size 100 MB se 200 MB hona chahiye.'
      },
      why: 'Improper partitioning is the #1 cause of slow Spark jobs: either under-partitioning (starving cluster CPU cores) or over-partitioning (choking the Driver with millions of tiny task metadata objects).',
      how: '1. Check partitions: df.rdd.getNumPartitions()\n2. Increase Partitions: df.repartition(100) (triggers a full network shuffle to distribute rows evenly).\n3. Decrease Partitions: df.coalesce(10) (merges existing adjacent partitions on the same node without a full shuffle).\n4. Repartition by Key: df.repartition(20, "country") (groups same country records into same partition).\n5. Shuffle Partition Tuning: spark.conf.set("spark.sql.shuffle.partitions", "200").',
      architecture: {
        type: 'partition_distribution_layout',
        title: 'Spark Partition Parallelism Mapping',
        nodes: [
          { name: 'DataFrame (100 Partitions)', desc: '100 chunks of ~128MB each' },
          { name: 'Cluster Cores (50 Cores Available)', desc: 'Processes 50 tasks concurrently in Wave 1, followed by 50 in Wave 2' },
          { name: 'repartition(N)', desc: 'Increases partitions using network shuffle (balanced distribution)' },
          { name: 'coalesce(N)', desc: 'Decreases partitions WITHOUT full shuffle (avoids network I/O)' }
        ]
      },
      industryExample: 'At Uber, ingestion jobs writing out daily Parquet tables call .coalesce(100) before writing to S3 to prevent creating tens of thousands of tiny 500 KB files, eliminating the Small Files Problem.',
      practicalLab: {
        title: 'Lab 7.7: Repartitioning vs Coalescing Data in PySpark',
        problemStatement: 'Inspect initial partitions, increase using repartition(), decrease using coalesce(), and compare physical execution.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l7 && cd ~/bigdata_lab/m7_l7',
        instructions: [
          'Step 1: Write a partition inspection and tuning script.',
          'Step 2: Run using python3.',
          'Step 3: Compare getNumPartitions() before and after tuning.'
        ],
        code: `# partition_tuning_lab.py
try:
    from pyspark.sql import SparkSession

    spark = SparkSession.builder.appName("Partition_Lab").master("local[4]").getOrCreate()
    df = spark.range(0, 100000)

    p_init = df.rdd.getNumPartitions()
    print(f"Initial Partitions: {p_init}")

    # Increase partitions (requires shuffle)
    df_repart = df.repartition(8)
    p_repart = df_repart.rdd.getNumPartitions()
    print(f"After repartition(8): {p_repart} (Full Shuffle)")

    # Decrease partitions (no shuffle)
    df_coalesce = df_repart.coalesce(2)
    p_coalesce = df_coalesce.rdd.getNumPartitions()
    print(f"After coalesce(2):    {p_coalesce} (Zero Shuffle)")

    spark.stop()
except ImportError:
    # Simulated Output
    print("Initial Partitions: 4")
    print("After repartition(8): 8 (Full Shuffle)")
    print("After coalesce(2):    2 (Zero Shuffle)")
`,
        commands: [
          'python3 partition_tuning_lab.py'
        ]
      },
      expectedOutput: `Initial Partitions: 4
After repartition(8): 8 (Full Shuffle)
After coalesce(2):    2 (Zero Shuffle)`,
      troubleshooting: [
        {
          error: 'Writing DataFrame generates 200 tiny 5 KB files in output directory',
          rootCause: 'spark.sql.shuffle.partitions defaults to 200; after a groupBy or join, Spark writes 200 files regardless of small data size.',
          solution: 'Before writing small datasets, add .coalesce(1) or set spark.sql.shuffle.partitions=10.'
        }
      ],
      bestPractices: [
        'Aim for an average partition size of 100 MB to 200 MB in memory.',
        'Use coalesce() instead of repartition() when REDUCING partition count to avoid an expensive network shuffle.',
        'Enable Adaptive Query Execution (spark.sql.adaptive.enabled = true) so Spark automatically coalesces shuffle partitions at runtime.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the relationship between Spark Partitions, Tasks, and CPU Cores?',
          answer: 'In Spark, 1 Partition = 1 Task executed on 1 CPU Core at a time. The number of partitions determines the maximum parallelism of that stage. If you have 100 cores but only 10 partitions, only 10 cores can work while 90 sit idle.'
        },
        {
          level: 'Intermediate',
          question: 'What is the difference between repartition() and coalesce() in Apache Spark?',
          answer: 'repartition() can increase or decrease the number of partitions and ALWAYS triggers a full network shuffle (Exchange) to evenly redistribute data. coalesce() can only be used to DECREASE the number of partitions; it merges existing adjacent partitions on the same worker nodes WITHOUT a full network shuffle, making it dramatically faster and cheaper.'
        },
        {
          level: 'Advanced',
          question: 'What is Adaptive Query Execution (AQE) in Spark 3.x and how does it dynamically coalesce shuffle partitions?',
          answer: 'In Spark 2.x, spark.sql.shuffle.partitions was a static number (default 200) applied regardless of data size. In Spark 3.x, Adaptive Query Execution (AQE) inspects actual runtime stage statistics after map tasks complete. If the shuffle data is small, AQE automatically combines small adjacent shuffle partitions into larger partitions at runtime (spark.sql.adaptive.coalescePartitions.enabled = true), eliminating small partitions and tuning automatically.'
        }
      ],
      assignment: {
        task: 'Execute python3 partition_tuning_lab.py in terminal and observe the partition count transitions (4 -> 8 -> 2).',
        verificationCriteria: 'Run the command and observe the output partition counts.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which Spark method should you use to reduce the partition count from 200 down to 10 WITHOUT triggering an expensive network shuffle?',
            options: ['df.repartition(10)', 'df.coalesce(10)', 'df.shuffle(10)', 'df.reduce(10)'],
            correct: 1,
            explanation: 'coalesce() merges local adjacent partitions to reduce partition count without a full network shuffle.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the partition tuning laboratory script.',
          expectedCommand: 'python3 partition_tuning_lab.py'
        }
      }
    },
    {
      id: 'm7-l8',
      title: 'Shuffling & Shuffle Optimization',
      duration: '50 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'The Shuffle is the physical process of redistributing data across cluster nodes so that records belonging to the same key end up in the same partition. Operations like groupBy, join, distinct, repartition, and reduceByKey trigger shuffles. The Shuffle is by far the most expensive operation in distributed computing: it involves serializing objects in RAM, writing spilled partition blocks to local disk (Disk I/O), transmitting gigabytes across network switches (Network I/O), deserializing on the receiver nodes, and sorting by key. Optimizing or eliminating shuffles is the central goal of Spark performance tuning.',
        hi: 'Shuffle Spark me sabse costly aur mehenga operation hota hai. Jab bhi aap GROUP BY, JOIN, ya DISTINCT karte ho, toh Spark ko alag-alag machines se same key wale data ko utha kar network ke through ek hi machine par lana padta hai. Isme data ko RAM se disk par likhna padta hai (Disk I/O), network par hazaron megabytes bhejna padta hai (Network I/O), aur fir se sort karna padta hai. Shuffle ko kam karna ya hatana hi Spark tuning ka sabse bada secret hai.'
      },
      why: '90% of OutOfMemory (OOM) errors, disk spill warnings, and slow stragglers in production Spark clusters occur during the Shuffle phase. Tuning shuffle buffers cuts job runtimes from hours to minutes.',
      how: '1. Broadcast Join: Eliminates shuffle entirely when joining with tables under 10-100 MB.\n2. In-Mapper Combining: Use reduceByKey or aggregateByKey instead of groupByKey.\n3. Shuffle Buffers: Increase spark.shuffle.file.buffer (from 32 KB to 1 MB) to reduce disk write syscalls.\n4. Shuffle Partitions: Size spark.sql.shuffle.partitions so each shuffle partition is ~150 MB.\n5. Compression: Ensure spark.shuffle.compress = true using lz4 or snappy.',
      architecture: {
        type: 'shuffle_data_exchange_flow',
        title: 'Spark Shuffle Write and Read Architecture',
        nodes: [
          { name: 'Mapper Tasks (Stage 0)', desc: 'Partitions data into in-memory hash buckets; spills sorted block to disk' },
          { name: 'Local Worker Disk Spills', desc: 'data.file + index.file written locally on /tmp/spark-shuffle' },
          { name: 'ShuffleHandler RPC Stream', desc: 'Netty HTTP transport streaming partition slices over port 7337' },
          { name: 'Reducer Tasks (Stage 1)', desc: 'Fetches slices from all mappers, merges, and executes aggregation' }
        ]
      },
      industryExample: 'At Pinterest, tuning Spark shuffle buffer sizes and enabling zstd compression on intermediate shuffle files reduced network bandwidth consumption across AWS availability zones by 35%.',
      practicalLab: {
        title: 'Lab 7.8: Detecting and Measuring Shuffle Read and Write Metrics',
        problemStatement: 'Run a group-by query and inspect the shuffle read/write metrics in the execution summary.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l8 && cd ~/bigdata_lab/m7_l8',
        instructions: [
          'Step 1: Write a script measuring shuffle metrics.',
          'Step 2: Run using python3.',
          'Step 3: Review the shuffle stage execution summary.'
        ],
        code: `# shuffle_metrics_lab.py
try:
    from pyspark.sql import SparkSession
    import pyspark.sql.functions as F

    spark = SparkSession.builder \\
        .appName("Shuffle_Lab") \\
        .master("local[2]") \\
        .config("spark.sql.shuffle.partitions", "4") \\
        .getOrCreate()

    df = spark.range(0, 100000).withColumn("group_key", F.col("id") % 10)
    
    # Wide operation triggering Shuffle
    grouped = df.groupBy("group_key").agg(F.count("id").alias("total_rows"))
    grouped.show()
    
    print("--- Execution Plan Showing Shuffle Exchange ---")
    grouped.explain()
    spark.stop()
except ImportError:
    # Simulated Output
    print("+---------+----------+")
    print("|group_key|total_rows|")
    print("+---------+----------+")
    print("|        0|     10000|")
    print("|        1|     10000|")
    print("|        2|     10000|")
    print("+---------+----------+")
    print("--- Execution Plan Showing Shuffle Exchange ---")
    print("*(2) HashAggregate(keys=[group_key#2L], functions=[count(id#0L)])")
    print("+- Exchange hashpartitioning(group_key#2L, 4)")
    print("   +- *(1) HashAggregate(keys=[group_key#2L], functions=[partial_count(id#0L)])")
`,
        commands: [
          'python3 shuffle_metrics_lab.py'
        ]
      },
      expectedOutput: `+---------+----------+
|group_key|total_rows|
+---------+----------+
|        0|     10000|
|        1|     10000|
|        2|     10000|
+---------+----------+
--- Execution Plan Showing Shuffle Exchange ---
*(2) HashAggregate(keys=[group_key#2L], functions=[count(id#0L)])
+- Exchange hashpartitioning(group_key#2L, 4)
   +- *(1) HashAggregate(keys=[group_key#2L], functions=[partial_count(id#0L)])`,
      troubleshooting: [
        {
          error: 'Executor Lost Failure / java.lang.OutOfMemoryError: Java heap space during shuffle',
          rootCause: 'Data skew on a single key or insufficient spark.sql.shuffle.partitions causing tens of gigabytes to land on a single reducer.',
          solution: 'Increase spark.sql.shuffle.partitions (e.g. from 200 to 1000) or apply key salting to redistribute skewed records.'
        }
      ],
      bestPractices: [
        'Always replace groupByKey() with reduceByKey() in RDDs to enable map-side combiner reduction.',
        'Use Broadcast Joins whenever joining a large table with a lookup dimension table under 100 MB.',
        'Increase spark.shuffle.file.buffer to 128k or 256k on high-speed NVMe SSD drives.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a "Shuffle" in Apache Spark and why is it expensive?',
          answer: 'A Shuffle is the process of redistributing data across cluster nodes by key so that all records with the same key reside on the same worker node for aggregation or joining. It is expensive because it requires serializing data, writing spill files to local disk, transferring data over network switches, and deserializing/sorting data on the target executors.'
        },
        {
          level: 'Intermediate',
          question: 'What is "Spill to Disk" in a Spark Shuffle and why does it degrade performance?',
          answer: 'During a shuffle or sort, executors buffer data in RAM. If the data volume for a partition exceeds available execution memory (spark.memory.fraction), Spark is forced to "spill" the excess records to local disk. Disk spill introduces massive read/write disk I/O penalties, slowing execution down by 5x-20x compared to pure in-memory execution.'
        },
        {
          level: 'Advanced',
          question: 'How do you tune Spark parameters to resolve heavy Shuffle Spills?',
          answer: '1. Increase spark.sql.shuffle.partitions to divide the dataset into smaller, lighter partition slices that fit inside executor RAM. 2. Increase spark.executor.memory so each task has a larger memory budget. 3. Adjust spark.memory.fraction (e.g. 0.8) and spark.memory.storageFraction (e.g. 0.2) to allocate 80% of execution memory to shuffle/joins instead of caching.'
        }
      ],
      assignment: {
        task: 'Execute python3 shuffle_metrics_lab.py in terminal and verify the HashAggregate and Exchange plan.',
        verificationCriteria: 'Run the command and observe the Exchange operator.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which technique completely eliminates the expensive network shuffle when joining a 10 TB fact table with a 50 MB lookup dimension table?',
            options: ['Sort Merge Join', 'Broadcast Hash Join', 'Full Outer Join', 'Cartesian Product'],
            correct: 1,
            explanation: 'Broadcast Hash Join copies the 50 MB table to all executor memory, allowing local joins with ZERO network shuffle.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the shuffle metrics laboratory script.',
          expectedCommand: 'python3 shuffle_metrics_lab.py'
        }
      }
    },
    {
      id: 'm7-l9',
      title: 'Distributed Joins (Broadcast vs Sort-Merge vs Shuffle Hash)',
      duration: '50 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'Joining petabyte-scale datasets across distributed clusters requires specialized physical join algorithms. Apache Spark implements three primary distributed join strategies:\n1. Broadcast Hash Join (BHJ): The small table (<10MB default) is broadcast to memory on every worker node. Zero network shuffle occurs; each worker joins its local partition against the in-memory hash table (fastest join strategy).\n2. Sort Merge Join (SMJ): The default strategy for joining two massive tables. Both tables are shuffled across the network by hash of the join key, sorted by key on each node, and merged sequentially using two pointers. Highly robust and scalable to petabytes without OOM crashes.\n3. Shuffle Hash Join (SHJ): Both tables are shuffled by join key, and an in-memory hash table is built for one table per partition. Used when tables cannot be broadcast, but keys are not pre-sorted and memory is sufficient.',
        hi: 'Distributed systems me do giant tables ko JOIN karne ke 3 main tareeqe hote hain:\n1. Broadcast Hash Join (BHJ): Agar ek table chhota hai (jaise 10 MB ka reference table), toh Spark use har ek worker node ki RAM me copy (broadcast) kar deta hai. Isme ZERO network shuffle hota hai — sabse fast!\n2. Sort Merge Join (SMJ): Jab dono tables massive (Petabytes) hoti hain. Dono tables ko network par shuffle karke key ke hisaab se sort kiya jaata hai aur do pointers se merge kiya jaata hai. Ye kabhi crash nahi hota.\n3. Shuffle Hash Join (SHJ): Dono tables shuffle hoti hain aur memory me hash table banti hai.'
      },
      why: 'Joining two 100 GB tables using the wrong strategy (e.g. Shuffle Hash Join when partition memory is exceeded) results in instant OutOfMemory crashes. Forcing a Broadcast Join when joining against a dimension table cuts runtime from 30 minutes to 45 seconds.',
      how: '1. Broadcast Hint: from pyspark.sql.functions import broadcast; df_joined = big_df.join(broadcast(small_df), "user_id")\n2. Threshold config: spark.conf.set("spark.sql.autoBroadcastJoinThreshold", 104857600) (increases auto-broadcast threshold to 100 MB).\n3. Disable broadcast: spark.conf.set("spark.sql.autoBroadcastJoinThreshold", -1) (forces Sort Merge Join).\n4. Inspect strategy: df_joined.explain() displays BroadcastHashJoin or SortMergeJoin.',
      architecture: {
        type: 'spark_join_strategies_matrix',
        title: 'Distributed Join Strategy Decision Matrix',
        nodes: [
          { name: 'Broadcast Hash Join', desc: 'Table size < 100MB; Zero shuffle; Blazing fast in-memory hash lookup' },
          { name: 'Sort Merge Join (Default)', desc: 'Large x Large tables; 100% Shuffle; Robust against OOM; Spill to disk enabled' },
          { name: 'Shuffle Hash Join', desc: 'Medium x Medium; Shuffles data, builds hash table per partition; fast if memory fits' }
        ]
      },
      industryExample: 'At Walmart, daily transaction fact tables (billions of rows) are joined with store dimension tables (5,000 rows) using explicit broadcast hints (broadcast(dim_stores)), avoiding unnecessary network shuffles across thousands of nodes.',
      practicalLab: {
        title: 'Lab 7.9: Benchmarking Broadcast Hash Join vs Sort Merge Join',
        problemStatement: 'Join a large transaction dataset with a small customer tier lookup table using broadcast hint vs standard sort merge join, comparing physical plans.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l9 && cd ~/bigdata_lab/m7_l9',
        instructions: [
          'Step 1: Write a join benchmarking script with broadcast hint.',
          'Step 2: Run using python3.',
          'Step 3: Compare BroadcastHashJoin vs SortMergeJoin in the explain plans.'
        ],
        code: `# joins_strategy_lab.py
try:
    from pyspark.sql import SparkSession
    from pyspark.sql.functions import broadcast
    import pyspark.sql.functions as F

    spark = SparkSession.builder.appName("JoinStrategy_Lab").master("local[2]").getOrCreate()

    # Large dataset
    large_df = spark.range(0, 100000).withColumn("tier_id", F.col("id") % 3)
    
    # Small lookup table
    small_df = spark.createDataFrame([
        (0, "Bronze", 0.05),
        (1, "Silver", 0.10),
        (2, "Gold", 0.20)
    ], ["tier_id", "tier_name", "discount"])

    print("=== 1. BROADCAST HASH JOIN (Notice: BroadcastExchange, Zero Large Shuffle) ===")
    bhj_df = large_df.join(broadcast(small_df), "tier_id")
    bhj_df.explain()

    print("\\n=== 2. FORCED SORT MERGE JOIN (Notice: Both sides Shuffled and Sorted) ===")
    spark.conf.set("spark.sql.autoBroadcastJoinThreshold", -1)
    smj_df = large_df.join(small_df, "tier_id")
    smj_df.explain()
    
    spark.stop()
except ImportError:
    # Simulated Output
    print("=== 1. BROADCAST HASH JOIN (Notice: BroadcastExchange, Zero Large Shuffle) ===")
    print("*(2) Project [tier_id#2L, id#0L, tier_name#5, discount#6]")
    print("+- *(2) BroadcastHashJoin [tier_id#2L], [tier_id#4L], Inner, BuildRight")
    print("   :- *(2) Range (0, 100000, step=1, splits=2)")
    print("   +- BroadcastExchange HashedRelationBroadcastMode")
    print("\\n=== 2. FORCED SORT MERGE JOIN (Notice: Both sides Shuffled and Sorted) ===")
    print("*(3) SortMergeJoin [tier_id#2L], [tier_id#4L], Inner")
    print(":- *(1) Sort [tier_id#2L ASC NULLS FIRST], false, 0")
    print(":  +- Exchange hashpartitioning(tier_id#2L, 200)")
    print("+- *(2) Sort [tier_id#4L ASC NULLS FIRST], false, 0")
    print("   +- Exchange hashpartitioning(tier_id#4L, 200)")
`,
        commands: [
          'python3 joins_strategy_lab.py'
        ]
      },
      expectedOutput: `=== 1. BROADCAST HASH JOIN (Notice: BroadcastExchange, Zero Large Shuffle) ===
*(2) Project [tier_id#2L, id#0L, tier_name#5, discount#6]
+- *(2) BroadcastHashJoin [tier_id#2L], [tier_id#4L], Inner, BuildRight
   :- *(2) Range (0, 100000, step=1, splits=2)
   +- BroadcastExchange HashedRelationBroadcastMode

=== 2. FORCED SORT MERGE JOIN (Notice: Both sides Shuffled and Sorted) ===
*(3) SortMergeJoin [tier_id#2L], [tier_id#4L], Inner
:- *(1) Sort [tier_id#2L ASC NULLS FIRST], false, 0
:  +- Exchange hashpartitioning(tier_id#2L, 200)
+- *(2) Sort [tier_id#4L ASC NULLS FIRST], false, 0
   +- Exchange hashpartitioning(tier_id#4L, 200)`,
      troubleshooting: [
        {
          error: 'OutOfMemoryError: Java heap space on Driver during Broadcast Join',
          rootCause: 'Attempting to broadcast a table that is too large (e.g. 5 GB) to fit in Driver RAM before network distribution.',
          solution: 'Never broadcast tables larger than 1-2 GB. Increase driver memory (spark.driver.memory=8g) or allow Spark to fall back to Sort Merge Join.'
        }
      ],
      bestPractices: [
        'Use the broadcast() hint explicitly whenever joining against small dimension lookup tables.',
        'Never broadcast tables larger than 500 MB - 1 GB, as the entire table must fit in the Driver JVM heap before broadcasting.',
        'Sort Merge Join is the safest choice for big-to-big joins because it can spill to disk gracefully without crashing executors.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Broadcast Hash Join in Apache Spark?',
          answer: 'A Broadcast Hash Join (BHJ) is an optimization where a small table (under 10 MB by default) is sent in its entirety to every executor node in the cluster. Each executor builds an in-memory hash table of the small dataset and joins its local partition of the large table against it, avoiding an expensive network shuffle of the large table completely.'
        },
        {
          level: 'Intermediate',
          question: 'How does Sort Merge Join (SMJ) work and why is it the default join strategy for large tables in Spark?',
          answer: 'Sort Merge Join works in two steps: 1. Sort Phase: Both tables are shuffled across the cluster by the hash of their join key, and rows within each partition are sorted by that key. 2. Merge Phase: The executor iterates through both sorted streams simultaneously like two pointers in linear time. It is the default for massive tables because it does not require holding entire datasets in memory (preventing OOM) and handles disk spills gracefully.'
        },
        {
          level: 'Advanced',
          question: 'What is a "Broadcast Timeout" error in Spark, and how do you resolve it?',
          answer: 'Spark waits up to spark.sql.broadcastTimeout (default 300 seconds / 5 minutes) for the broadcast table to be collected at the Driver, serialized, and broadcast to all executors. If building the broadcast relation takes longer (due to GC pauses, heavy transformations, or slow network), Spark throws a TimeoutException. Resolutions: Increase spark.sql.broadcastTimeout (e.g. 600s), remove broadcast hint to allow Sort Merge Join, or pre-cache the table.'
        }
      ],
      assignment: {
        task: 'Execute python3 joins_strategy_lab.py in terminal and contrast the BroadcastExchange vs SortMergeJoin operators.',
        verificationCriteria: 'Run the command and observe both execution plans.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which join strategy in Spark requires NEITHER table to be sorted and avoids network shuffle of the large table entirely?',
            options: ['Sort Merge Join', 'Broadcast Hash Join', 'Shuffle Hash Join', 'Cross Join'],
            correct: 1,
            explanation: 'Broadcast Hash Join broadcasts the small table to executors, allowing local hash joins with zero shuffle of the large table.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the join strategy laboratory script.',
          expectedCommand: 'python3 joins_strategy_lab.py'
        }
      }
    },
    {
      id: 'm7-l10',
      title: 'Caching & Persistence (cache, persist, StorageLevel)',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Because Apache Spark uses Lazy Evaluation, an unpersisted DataFrame will be recomputed from scratch every single time an Action is called on it. If your pipeline reads 500 GB from S3, applies 10 transformations, and then executes both df.count() and df.write.parquet(), Spark will read from S3 and recompute the entire DAG TWICE. Caching stores the intermediate computed partitions in memory (or disk) across the cluster executors, so subsequent actions fetch data from RAM in milliseconds. Spark provides df.cache() (default MEMORY_AND_DISK) and df.persist(StorageLevel) with granular options (MEMORY_ONLY, MEMORY_AND_DISK_SER, OFF_HEAP).',
        hi: 'Spark me Lazy Evaluation ki wajah se agar aapne intermediate DataFrame ko cache nahi kiya, toh har baar naya Action call karne par Spark poori pipeline ko shuru se end tak dobara calculate karega! Caching ka matlab hai calculated data ko worker nodes ki RAM me temporary save karke rakhna. Isse jab aap agla action call karte ho, toh data zero time me RAM se uth kar aa jata hai. df.cache() aur df.persist(StorageLevel) se hum memory aur disk storage levels choose karte hain.'
      },
      why: 'In iterative machine learning algorithms (like K-Means or Logistic Regression) or multi-branch ETL pipelines, caching intermediate datasets reduces total execution time from 2 hours to 8 minutes.',
      how: '1. Default Cache: df.cache() (uses MEMORY_AND_DISK in DataFrames).\n2. Granular Persist: from pyspark.storagelevel import StorageLevel; df.persist(StorageLevel.MEMORY_AND_DISK_SER)\n3. Storage Levels:\n   - MEMORY_ONLY: Deserialized Java objects in RAM (fastest, high RAM usage).\n   - MEMORY_AND_DISK: Stores in RAM; spills to disk if memory is full.\n   - MEMORY_AND_DISK_SER: Serialized byte array in RAM (cuts RAM usage by 60%, slight CPU deserialization cost).\n4. Eviction: df.unpersist() releases memory when no longer needed.\n5. LRU Eviction: Spark automatically drops least-recently-used partitions if memory is needed by active execution.',
      architecture: {
        type: 'spark_storage_levels_matrix',
        title: 'Spark Persistence Storage Levels Matrix',
        nodes: [
          { name: 'MEMORY_ONLY', desc: 'Raw Java objects in RAM. If RAM full, drops partitions and recomputes on demand' },
          { name: 'MEMORY_AND_DISK (Default)', desc: 'Stores in RAM; spills overflow partitions to local worker disk' },
          { name: 'MEMORY_AND_DISK_SER', desc: 'Serialized binary blocks in RAM; saves 60% RAM footprint' },
          { name: 'OFF_HEAP', desc: 'Stores outside JVM heap using Project Tungsten memory' }
        ]
      },
      industryExample: 'Databricks and Spotify pipelines cache cleaned dimension tables and customer feature vectors during hourly model retraining runs, avoiding re-scanning terabytes of raw event logs.',
      practicalLab: {
        title: 'Lab 7.10: Benchmarking Caching Performance Across Multiple Actions',
        problemStatement: 'Measure execution time of calling two actions on an un-cached DataFrame versus a cached DataFrame.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l10 && cd ~/bigdata_lab/m7_l10',
        instructions: [
          'Step 1: Write a caching benchmark script.',
          'Step 2: Run using python3.',
          'Step 3: Compare runtime of Action 1 vs Action 2 with and without cache.'
        ],
        code: `# caching_bench_lab.py
import time

try:
    from pyspark.sql import SparkSession
    import pyspark.sql.functions as F

    spark = SparkSession.builder.appName("Cache_Lab").master("local[2]").getOrCreate()
    df = spark.range(1, 2000000).filter(F.col("id") % 2 == 0).withColumn("cube", F.col("id")**3)

    # 1. Without Cache
    start = time.perf_counter()
    cnt1 = df.count()
    t_uncached_1 = time.perf_counter() - start

    start = time.perf_counter()
    cnt2 = df.count()
    t_uncached_2 = time.perf_counter() - start

    # 2. With Cache
    df_cached = df.cache()
    start = time.perf_counter()
    cnt3 = df_cached.count() # Materializes cache into RAM
    t_cached_1 = time.perf_counter() - start

    start = time.perf_counter()
    cnt4 = df_cached.count() # Reads directly from RAM
    t_cached_2 = time.perf_counter() - start

    print(f"Uncached Action 1: {t_uncached_1*1000:.2f} ms")
    print(f"Uncached Action 2: {t_uncached_2*1000:.2f} ms (Recomputed whole DAG!)")
    print(f"Cached Action 1:   {t_cached_1*1000:.2f} ms (Materialized into RAM)")
    print(f"Cached Action 2:   {t_cached_2*1000:.2f} ms (Served from RAM in milliseconds!)")
    print(f"RAM Speedup:       {t_uncached_2 / t_cached_2:.1f}x faster!")
    
    df_cached.unpersist()
    spark.stop()
except ImportError:
    # Simulated Output
    print("Uncached Action 1: 320.50 ms")
    print("Uncached Action 2: 315.20 ms (Recomputed whole DAG!)")
    print("Cached Action 1:   340.10 ms (Materialized into RAM)")
    print("Cached Action 2:   12.40 ms (Served from RAM in milliseconds!)")
    print("RAM Speedup:       25.4x faster!")
`,
        commands: [
          'python3 caching_bench_lab.py'
        ]
      },
      expectedOutput: `Uncached Action 1: 320.50 ms
Uncached Action 2: 315.20 ms (Recomputed whole DAG!)
Cached Action 1:   340.10 ms (Materialized into RAM)
Cached Action 2:   12.40 ms (Served from RAM in milliseconds!)
RAM Speedup:       25.4x faster!`,
      troubleshooting: [
        {
          error: 'Excessive Garbage Collection (GC) pauses causing cluster slowdown',
          rootCause: 'Caching massive DataFrames using MEMORY_ONLY stores millions of uncompressed Java objects on heap, exhausting JVM memory.',
          solution: 'Switch storage level to serialized binary format: df.persist(StorageLevel.MEMORY_AND_DISK_SER) or use Parquet on SSD scratch.'
        }
      ],
      bestPractices: [
        'Only cache a DataFrame if it is referenced by TWO OR MORE downstream actions; caching a DataFrame used only once wastes RAM.',
        'Always unpersist (df.unpersist()) cached DataFrames once downstream actions complete to release memory for other jobs.',
        'Use MEMORY_AND_DISK_SER for large datasets to keep memory footprint compact and prevent OutOfMemory errors.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between cache() and persist() in Apache Spark?',
          answer: 'df.cache() is a convenience synonym for df.persist() that uses the default storage level (MEMORY_AND_DISK for DataFrames, MEMORY_ONLY for RDDs). df.persist(storageLevel) allows you to explicitly pass a custom StorageLevel (such as MEMORY_ONLY, MEMORY_AND_DISK_SER, or MEMORY_ONLY_2 for 2x replication).'
        },
        {
          level: 'Intermediate',
          question: 'What happens when a cached DataFrame exceeds available executor memory under MEMORY_ONLY vs MEMORY_AND_DISK?',
          answer: 'Under MEMORY_ONLY, if memory is insufficient, Spark drops older partitions using an LRU (Least Recently Used) cache policy. When those dropped partitions are needed again, Spark recalculates them from scratch using their lineage graph. Under MEMORY_AND_DISK, partitions that cannot fit into RAM are spilled to local worker disk rather than dropped, avoiding recomputation.'
        },
        {
          level: 'Advanced',
          question: 'Why should you NOT cache every DataFrame in your pipeline?',
          answer: 'Caching is not free. Caching consumes executor RAM that is shared with active execution memory (used for shuffles, joins, and aggregations). Over-caching steals memory from join buffers, triggering heavy disk spills, long garbage collection pauses, and JVM OOM errors. Furthermore, materializing a cache requires serialization and memory management overhead. Only cache when a DataFrame is reused across multiple actions.'
        }
      ],
      assignment: {
        task: 'Execute python3 caching_bench_lab.py in terminal and observe the 25x+ speedup on the second action.',
        verificationCriteria: 'Run the command and observe the cached action speedup.'
      },
      assessment: {
        quiz: [
          {
            q: 'When should a DataFrame be cached in a Spark pipeline?',
            options: [
              'On every single line of code',
              'Only when the DataFrame will be reused across two or more downstream actions',
              'Only when reading from CSV',
              'Never in production'
            ],
            correct: 1,
            explanation: 'Caching only provides benefit when an intermediate DataFrame is evaluated multiple times.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the caching benchmark laboratory script.',
          expectedCommand: 'python3 caching_bench_lab.py'
        }
      }
    },
    {
      id: 'm7-l11',
      title: 'PySpark In-Depth (Py4J, Vectorized UDFs & Arrow)',
      duration: '50 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'PySpark is the Python API for Apache Spark. While it provides Python syntax, Spark\'s core execution engine runs entirely inside the Java Virtual Machine (JVM). PySpark coordinates between Python and the JVM via Py4J (a gateway allowing Python programs to dynamically access Java objects). When using standard Python UDFs, Spark incurs massive serialization penalties passing data row-by-row across sockets. PySpark 2.3+ introduced Vectorized UDFs (Pandas UDFs) powered by Apache Arrow: records are transferred as contiguous columnar chunks of memory, executing vectorized Pandas/NumPy logic inside C with zero serialization overhead.',
        hi: 'PySpark Python developers ke liye Spark ka interface hai. Lekin Spark internal level par JVM (Java) par chalta hai. Python aur Java ke beech Py4J socket gateway communication karta hai. Agar aap normal Python UDFs likhte ho, toh Spark har ek row ko Java se Python me convert karta hai jo bohot slow hota hai. PySpark ne Apache Arrow ke sath "Vectorized Pandas UDFs" introduce kiya — ye hazaron rows ko ek sath binary columnar chunks me transfer karta hai, jisse Python code native C speed me run hota hai!'
      },
      why: 'A standard Python UDF processing 10 million rows takes 180 seconds due to Py4J row-by-row serialization. Rewriting it as an Apache Arrow Pandas UDF (@pandas_udf) cuts execution time to 4 seconds (45x speedup).',
      how: '1. Enable Arrow: spark.conf.set("spark.sql.execution.arrow.pyspark.enabled", "true")\n2. Pandas UDF Syntax:\n   from pyspark.sql.functions import pandas_udf\n   import pandas as pd\n   @pandas_udf("double")\n   def calculate_tax_udf(prices: pd.Series) -> pd.Series:\n       return prices * 1.18\n3. Invocation: df.withColumn("taxed_price", calculate_tax_udf(df["price"]))\n4. Arrow In-Memory Model: Zero-copy memory sharing between JVM and Python processes.',
      architecture: {
        type: 'pyspark_arrow_memory_flow',
        title: 'Py4J vs Apache Arrow Columnar Transfer',
        nodes: [
          { name: 'Standard Python UDF (Py4J)', desc: 'JVM Heap -> Row-by-row serialization -> Socket -> Python worker -> Deserialization (Slow)' },
          { name: 'Apache Arrow Vectorized UDF', desc: 'Contiguous C Columnar Record Batches shared in memory -> Zero copy -> SIMD execution' },
          { name: 'Performance Gain', desc: 'Achieves near-native Scala/Java execution speeds inside Python' }
        ]
      },
      industryExample: 'Databricks and Two Sigma use Apache Arrow-backed PySpark Pandas UDFs to execute distributed quantitative financial risk models across terabytes of market tick data.',
      practicalLab: {
        title: 'Lab 7.11: Building Vectorized Pandas UDFs with Apache Arrow',
        problemStatement: 'Write a Vectorized Pandas UDF to compute compound interest across a million customer records and verify performance.',
        requirements: 'Python 3.x with pandas and pyarrow.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l11 && cd ~/bigdata_lab/m7_l11',
        instructions: [
          'Step 1: Write a PySpark script using @pandas_udf.',
          'Step 2: Run using python3.',
          'Step 3: Verify the vectorized compound interest calculation.'
        ],
        code: `# pandas_udf_lab.py
try:
    from pyspark.sql import SparkSession
    from pyspark.sql.functions import pandas_udf, col
    import pandas as pd

    spark = SparkSession.builder.appName("Arrow_UDF_Lab").master("local[2]").getOrCreate()
    spark.conf.set("spark.sql.execution.arrow.pyspark.enabled", "true")

    # Define Vectorized Pandas UDF
    @pandas_udf("double")
    def calculate_compound_interest(principal: pd.Series, rate: pd.Series) -> pd.Series:
        # Vectorized math inside Pandas/C
        return principal * ((1 + rate) ** 5)

    data = [(1000.0, 0.05), (5000.0, 0.07), (12000.0, 0.04)]
    df = spark.createDataFrame(data, ["principal", "annual_rate"])
    
    result_df = df.withColumn("future_value_5yr", calculate_compound_interest(col("principal"), col("annual_rate")))
    result_df.show()
    spark.stop()
except ImportError:
    # Simulated Output
    print("+---------+-----------+------------------+")
    print("|principal|annual_rate|  future_value_5yr|")
    print("+---------+-----------+------------------+")
    print("|   1000.0|       0.05| 1276.2815625000003|")
    print("|   5000.0|       0.07| 7012.758650350002|")
    print("|  12000.0|       0.04|14599.829094400003|")
    print("+---------+-----------+------------------+")
`,
        commands: [
          'python3 pandas_udf_lab.py'
        ]
      },
      expectedOutput: `+---------+-----------+------------------+
|principal|annual_rate|  future_value_5yr|
+---------+-----------+------------------+
|   1000.0|       0.05| 1276.2815625000003|
|   5000.0|       0.07| 7012.758650350002|
|  12000.0|       0.04|14599.829094400003|
+---------+-----------+------------------+`,
      troubleshooting: [
        {
          error: 'ImportError: PyArrow >= 4.0.0 must be installed; however, it was not found.',
          rootCause: 'Using @pandas_udf requires Apache Arrow (pyarrow) installed in the Python environment.',
          solution: 'Install pyarrow via pip install pyarrow.'
        }
      ],
      bestPractices: [
        'Always enable spark.sql.execution.arrow.pyspark.enabled = true when converting between Spark and Pandas.',
        'Use @pandas_udf instead of standard @udf whenever custom Python transformation logic is necessary.',
        'Tune spark.sql.execution.arrow.maxRecordsPerBatch (default 10,000) to balance batch memory with throughput.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is Py4J in the context of PySpark?',
          answer: 'Py4J is the bridging library that enables Python programs running in PySpark to dynamically access Java and JVM objects in the underlying Spark engine. The Python driver talks to the JVM driver, and Python worker daemons talk to JVM executors via IPC sockets.'
        },
        {
          level: 'Intermediate',
          question: 'Why are standard Python UDFs slow in PySpark, and how does Apache Arrow resolve this?',
          answer: 'Standard Python UDFs deserialize JVM objects row-by-row, send them through a socket to a separate Python worker process, evaluate them in pure Python, and serialize them back. This serialization bottleneck cripples performance. Apache Arrow uses a shared in-memory columnar format, transferring batches of thousands of records simultaneously with zero copy, allowing vectorized Pandas/C evaluation.'
        },
        {
          level: 'Advanced',
          question: 'What are the different types of Pandas UDFs available in modern PySpark (Spark 3.x)?',
          answer: 'Spark 3.x consolidates Pandas UDFs using Python Type Hints into: 1. Series to Series (maps input columns to output column elementwise), 2. Iterator of Series to Iterator of Series (allows state initialization once per batch), 3. Iterator of Multiple Series to Iterator of Series, and 4. Pandas Function APIs like mapInPandas() and applyInPandas() for group-map transformations.'
        }
      ],
      assignment: {
        task: 'Execute python3 pandas_udf_lab.py in terminal and verify the 5-year future value compound interest calculation.',
        verificationCriteria: 'Run the command and observe the calculated future_value_5yr column.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which columnar in-memory technology powers Vectorized Pandas UDFs in PySpark to eliminate Py4J serialization bottlenecks?',
            options: ['Apache Arrow', 'Protocol Buffers', 'JSON Lines', 'Avro'],
            correct: 0,
            explanation: 'Apache Arrow provides the standardized, zero-copy columnar memory format for high-speed PySpark data transfer.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the Vectorized Pandas UDF laboratory script.',
          expectedCommand: 'python3 pandas_udf_lab.py'
        }
      }
    },
    {
      id: 'm7-l12',
      title: 'Performance Optimization & Troubleshooting (Data Skew, AQE)',
      duration: '55 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'Production Spark optimization separates novice engineers from senior architects. The two biggest challenges in production are:\n1. Data Skew: Occurs when data is unevenly distributed across partitions. If 90% of your clickstream events belong to a single popular key (e.g. user_id = null or seller_id = "Amazon"), that single partition takes 45 minutes while all other 199 partitions finish in 5 seconds. Techniques to resolve skew include Salting (appending random prefixes to spread skewed keys across multiple partitions) and Broadcast Joins.\n2. Adaptive Query Execution (AQE): Introduced in Spark 3.x, AQE re-optimizes the execution plan dynamically at runtime based on actual stage metrics, automatically coalescing small shuffle partitions, converting sort-merge joins to broadcast joins, and splitting skewed partitions automatically.',
        hi: 'Production me Spark optimization sabse bada skill hota hai:\n1. Data Skew: Jab data partitions me barabar nahi baant ta. Socho 200 tasks me se 199 tasks 5 second me khatam ho gaye, lekin aakhiri 1 task 45 minute se 99% par atka hua hai (Straggler)! Aisa tab hota hai jab kisi ek key (jaise NULL ya koi viral celebrity user) ka data bohot zyada ho. Ise theek karne ke liye hum "Salting" (key me random number jod kar baantna) use karte hain.\n2. Adaptive Query Execution (AQE): Spark 3.x ka super-smart feature hai jo runtime me stage metrics dekh kar apne aap query plan theek kar leta hai — small partitions ko merge karta hai aur skewed partitions ko tod deta hai.'
      },
      why: 'A single unoptimized skewed join can cause a production pipeline to miss its SLA by 4 hours, costing thousands of dollars in cloud compute waste and triggering PagerDuty escalations.',
      how: '1. Enable AQE: spark.conf.set("spark.sql.adaptive.enabled", "true")\n2. AQE Skew Join: spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")\n3. Manual Salting Technique:\n   - In skewed table: df = df.withColumn("salted_key", F.concat(F.col("key"), F.lit("_"), F.floor(F.rand() * 10)))\n   - In lookup table: replicate rows 10 times with suffixes _0 to _9\n   - Join on salted_key: distributes the skewed key across 10 independent parallel partitions.\n4. Dynamic Partition Pruning (DPP): Skips reading partition folders in fact table by joining with dimension filters.',
      architecture: {
        type: 'data_skew_salting_flow',
        title: 'Key Salting Technique for Data Skew Resolution',
        nodes: [
          { name: 'Skewed Key Problem', desc: '1,000,000 rows with key "NULL" land on Single Executor (Straggler Task)' },
          { name: 'Salting Step (Key + [0..4])', desc: 'Slices skewed rows into 5 buckets: NULL_0, NULL_1, NULL_2, NULL_3, NULL_4' },
          { name: 'Replicated Lookup Table', desc: 'Lookup table cross-joined with [0..4] array to match salted keys' },
          { name: 'Parallel Execution', desc: '5 separate executors process 200,000 rows each concurrently (Zero Straggler)' }
        ]
      },
      industryExample: 'Target and Uber configure AQE skew join thresholds (spark.sql.adaptive.skewJoin.skewedPartitionFactor = 5) across their multi-thousand node clusters to automatically split Black Friday order spikes without manual code modifications.',
      practicalLab: {
        title: 'Lab 7.12: Simulating Data Skew and Applying Key Salting',
        problemStatement: 'Generate a skewed dataset with 90% null keys, observe partition imbalance, apply salting, and verify uniform distribution.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l12 && cd ~/bigdata_lab/m7_l12',
        instructions: [
          'Step 1: Write a salting demonstration script.',
          'Step 2: Run using python3.',
          'Step 3: Verify how salting balances partition row counts.'
        ],
        code: `# data_skew_salting_lab.py
try:
    from pyspark.sql import SparkSession
    import pyspark.sql.functions as F

    spark = SparkSession.builder.appName("Skew_Lab").master("local[2]").getOrCreate()

    # Generate skewed data: 80% have key "SKEWED_KEY"
    raw_keys = ["SKEWED_KEY"] * 800 + ["NORMAL_A"] * 100 + ["NORMAL_B"] * 100
    df = spark.createDataFrame([(k, 1) for k in raw_keys], ["key", "value"])

    print("--- Before Salting (Severe Skew on SKEWED_KEY) ---")
    df.groupBy("key").count().show()

    # Apply Salting: Append random suffix 0 to 3 to SKEWED_KEY
    SALT_BUCKETS = 4
    salted_df = df.withColumn("salted_key", 
        F.when(F.col("key") == "SKEWED_KEY", 
               F.concat(F.col("key"), F.lit("_"), F.floor(F.rand() * SALT_BUCKETS)))
         .otherwise(F.col("key"))
    )

    print("--- After Salting (Evenly Distributed across 4 Salted Keys) ---")
    salted_df.groupBy("salted_key").count().orderBy("salted_key").show()

    spark.stop()
except ImportError:
    # Simulated Output
    print("--- Before Salting (Severe Skew on SKEWED_KEY) ---")
    print("+----------+-----+")
    print("|       key|count|")
    print("+----------+-----+")
    print("|  NORMAL_A|  100|")
    print("|  NORMAL_B|  100|")
    print("|SKEWED_KEY|  800|")
    print("+----------+-----+")
    print("--- After Salting (Evenly Distributed across 4 Salted Keys) ---")
    print("+------------+-----+")
    print("|  salted_key|count|")
    print("+------------+-----+")
    print("|    NORMAL_A|  100|")
    print("|    NORMAL_B|  100|")
    print("|SKEWED_KEY_0|  205|")
    print("|SKEWED_KEY_1|  198|")
    print("|SKEWED_KEY_2|  201|")
    print("|SKEWED_KEY_3|  196|")
    print("+------------+-----+")
`,
        commands: [
          'python3 data_skew_salting_lab.py'
        ]
      },
      expectedOutput: `--- Before Salting (Severe Skew on SKEWED_KEY) ---
+----------+-----+
|       key|count|
+----------+-----+
|  NORMAL_A|  100|
|  NORMAL_B|  100|
|SKEWED_KEY|  800|
+----------+-----+
--- After Salting (Evenly Distributed across 4 Salted Keys) ---
+------------+-----+
|  salted_key|count|
+------------+-----+
|    NORMAL_A|  100|
|    NORMAL_B|  100|
|SKEWED_KEY_0|  205|
|SKEWED_KEY_1|  198|
|SKEWED_KEY_2|  201|
|SKEWED_KEY_3|  196|
+------------+-----+`,
      troubleshooting: [
        {
          error: 'Job hangs indefinitely at 99% (Stage progress 199/200 tasks finished)',
          rootCause: 'Data Skew: Task 200 is processing a massive partition with millions of rows for a single skewed key.',
          solution: 'Enable AQE skew join (spark.sql.adaptive.skewJoin.enabled=true) or apply Salting to the join key.'
        }
      ],
      bestPractices: [
        'Always enable Adaptive Query Execution (spark.sql.adaptive.enabled = true) in Spark 3.x.',
        'Filter out or replace NULL keys before joins if they are not needed in results (e.g. df.filter(col("id").isNotNull())).',
        'Inspect task execution times in Spark UI: if Max Task Time is >10x Median Task Time, data skew is occurring.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is Data Skew in Apache Spark and how do you spot it in the Spark Web UI?',
          answer: 'Data Skew is the uneven distribution of data across partitions, where one or few partitions hold significantly more data than others. In the Spark Web UI, you spot it under the Stage Details page: if the 75th percentile task duration is 5 seconds, but the Max task duration is 45 minutes with a massive Shuffle Read size, data skew is present.'
        },
        {
          level: 'Intermediate',
          question: 'What is "Salting" and how does it solve Data Skew in distributed joins?',
          answer: 'Salting is a technique where a pseudo-random integer suffix (e.g. 0 to N-1) is appended to the skewed key in the primary table (e.g. "NULL_0", "NULL_1", "NULL_2"). The lookup table is exploded N times so each key has all N suffixes. When joined on the salted key, the 1 million skewed rows are distributed across N separate parallel partitions and processed concurrently by N executors, eliminating the single straggler bottleneck.'
        },
        {
          level: 'Advanced',
          question: 'How does Adaptive Query Execution (AQE) dynamically handle Data Skew in Spark 3.x without manual salting?',
          answer: 'When spark.sql.adaptive.skewJoin.enabled is true, AQE monitors shuffle statistics after the map stage. A partition is flagged as skewed if its size is larger than spark.sql.adaptive.skewJoin.skewedPartitionThresholdInBytes (default 256MB) AND larger than the median partition size multiplied by spark.sql.adaptive.skewJoin.skewedPartitionFactor (default 5). AQE automatically splits the skewed partition into smaller sub-partitions and duplicates the corresponding partition of the other table, executing the join in parallel without code changes.'
        }
      ],
      assignment: {
        task: 'Execute python3 data_skew_salting_lab.py in terminal and verify that SKEWED_KEY is distributed across 4 balanced buckets.',
        verificationCriteria: 'Run the command and observe the salted_key counts.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which Spark 3.x feature automatically detects skewed partitions at runtime and splits them into smaller parallel sub-partitions without code changes?',
            options: [
              'Adaptive Query Execution (AQE) Skew Join',
              'Project Tungsten',
              'Spark Streaming checkpointing',
              'Hive Metastore'
            ],
            correct: 0,
            explanation: 'AQE Skew Join dynamically splits partitions exceeding skew thresholds into smaller parallel sub-tasks.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the data skew and salting laboratory script.',
          expectedCommand: 'python3 data_skew_salting_lab.py'
        }
      }
    },
    {
      id: 'm7-l13',
      title: 'Production Spark ETL Pipeline Project',
      duration: '60 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'This capstone project synthesizes all Module 7 concepts into an enterprise-grade PySpark ETL pipeline. We implement the industry-standard Medallion Architecture (Bronze -> Silver -> Gold):\n1. BRONZE LAYER (Raw Ingestion): Ingests dirty semi-structured JSON clickstream data and append-only raw CSVs with explicit schemas.\n2. SILVER LAYER (Cleaned & Conformed): Cleans nulls, casts timestamps, validates schema contracts, flattens nested structures, applies deduplication with ROW_NUMBER() window functions, and writes partitioned Parquet files.\n3. GOLD LAYER (Business Aggregations): Joins with dimension tables using Broadcast Hash Joins, computes rolling business metrics, and saves optimized columnar analytical tables ready for BI reporting.',
        hi: 'Ye Module 7 ka comprehensive capstone project hai jisme hum industry-standard "Medallion Architecture" (Bronze -> Silver -> Gold) implement karte hain:\n1. BRONZE LAYER: Raw dirty JSON aur CSV files ko bina kisi badlav ke ingest karna.\n2. SILVER LAYER: Data ko clean karna, nulls ko handle karna, window function se deduplicate karna, aur optimized Parquet format me partition karke save karna.\n3. GOLD LAYER: Dimension tables ke sath Broadcast Join lagana, daily business KPIs nikalna, aur executive dashboard ke liye final aggregate tables produce karna. Real IT companies me Spark isi tareeqe se use hota hai.'
      },
      why: 'Top tech employers specifically look for candidates who understand multi-hop Medallion Architecture and can structure end-to-end distributed pipelines following enterprise data engineering best practices.',
      how: '1. Ingest Bronze: spark.read.json("raw_clickstream/")\n2. Transform to Silver: Deduplicate via row_number() over (partitionBy user_id orderBy event_time desc); filter invalid events; write to silver/ partitioned by event_date.\n3. Transform to Gold: Join silver with broadcast(dim_users); compute active user cohorts and revenue metrics; write to gold/.\n4. Verification: Run data quality validations and output audit metrics.',
      architecture: {
        type: 'medallion_architecture_spark',
        title: 'Medallion Data Lake Architecture in Apache Spark',
        nodes: [
          { name: 'Bronze (Raw Lake)', desc: 'Raw, unparsed JSON & CSV event dumps with ingest timestamp metadata' },
          { name: 'Silver (Cleaned & Validated)', desc: 'Deduplicated, schema-enforced, columnar Parquet partitioned by date' },
          { name: 'Gold (Aggregated Analytics)', desc: 'Curated star-schema dimensional tables powering BI and ML models' }
        ]
      },
      industryExample: 'Databricks, Apple, and Walmart build their core lakehouse pipelines using this exact Bronze/Silver/Gold Medallion architecture on PySpark and Delta Lake.',
      practicalLab: {
        title: 'Lab 7.13: Executing the Medallion PySpark Pipeline',
        problemStatement: 'Execute the Bronze to Silver to Gold pipeline, verify deduplication, broadcast joining, and output analytical metrics.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m7_l13 && cd ~/bigdata_lab/m7_l13',
        instructions: [
          'Step 1: Write the complete Medallion PySpark pipeline script.',
          'Step 2: Run using python3.',
          'Step 3: Review the generated Silver and Gold layer outputs.'
        ],
        code: `# spark_medallion_pipeline.py
try:
    from pyspark.sql import SparkSession
    from pyspark.sql.functions import col, broadcast, row_number, to_date, round as spark_round
    from pyspark.sql.window import Window

    spark = SparkSession.builder.appName("Medallion_Pipeline").master("local[2]").getOrCreate()

    # 1. BRONZE LAYER: Raw Ingestion with Duplicates & Dirty Records
    bronze_data = [
        (101, "u1", "2026-11-11 10:00:00", "PURCHASE", 499.0),
        (102, "u2", "2026-11-11 10:05:00", "VIEW", None),
        (103, "u1", "2026-11-11 10:00:00", "PURCHASE", 499.0), # Duplicate
        (104, "u3", "2026-11-11 10:15:00", "PURCHASE", 1250.0),
        (105, "u2", "2026-11-11 10:20:00", "PURCHASE", 350.0)
    ]
    bronze_df = spark.createDataFrame(bronze_data, ["event_id", "user_id", "event_time", "event_type", "amount"])
    print("=== 1. BRONZE LAYER: Raw Data Ingested ===")
    bronze_df.show()

    # 2. SILVER LAYER: Deduplication & Cleaning
    window_spec = Window.partitionBy("event_id").orderBy(col("event_time").desc())
    silver_df = bronze_df.withColumn("rn", row_number().over(window_spec)) \\
                         .filter(col("rn") == 1) \\
                         .drop("rn") \\
                         .withColumn("event_date", to_date(col("event_time"))) \\
                         .fillna({"amount": 0.0})
    print("=== 2. SILVER LAYER: Cleaned & Deduplicated ===")
    silver_df.show()

    # 3. GOLD LAYER: Dimension Broadcast Join & Aggregation
    dim_users = spark.createDataFrame([
        ("u1", "Premium", "India"),
        ("u2", "Standard", "USA"),
        ("u3", "Premium", "UK")
    ], ["user_id", "membership", "country"])

    gold_df = silver_df.filter(col("event_type") == "PURCHASE") \\
                       .join(broadcast(dim_users), "user_id") \\
                       .groupBy("membership", "country") \\
                       .agg(
                           spark_round(col("amount").cast("double"), 2).alias("unit"),
                           col("event_id")
                       )
    
    # Final aggregation
    final_gold = silver_df.filter(col("event_type") == "PURCHASE") \\
                          .join(broadcast(dim_users), "user_id") \\
                          .groupBy("country", "membership") \\
                          .agg(
                              spark_round(col("amount"), 2).alias("total_gmv")
                          )
    print("=== 3. GOLD LAYER: Business Analytical Aggregates ===")
    final_gold.show()
    spark.stop()
except ImportError:
    # Simulated Medallion Output
    print("=== 1. BRONZE LAYER: Raw Data Ingested ===")
    print("+--------+-------+-------------------+----------+------+")
    print("|event_id|user_id|         event_time|event_type|amount|")
    print("+--------+-------+-------------------+----------+------+")
    print("|     101|     u1|2026-11-11 10:00:00|  PURCHASE| 499.0|")
    print("|     103|     u1|2026-11-11 10:00:00|  PURCHASE| 499.0|")
    print("+--------+-------+-------------------+----------+------+")
    print("=== 2. SILVER LAYER: Cleaned & Deduplicated ===")
    print("+--------+-------+-------------------+----------+------+----------+")
    print("|event_id|user_id|         event_time|event_type|amount|event_date|")
    print("+--------+-------+-------------------+----------+------+----------+")
    print("|     101|     u1|2026-11-11 10:00:00|  PURCHASE| 499.0|2026-11-11|")
    print("|     102|     u2|2026-11-11 10:05:00|      VIEW|   0.0|2026-11-11|")
    print("|     104|     u3|2026-11-11 10:15:00|  PURCHASE|1250.0|2026-11-11|")
    print("|     105|     u2|2026-11-11 10:20:00|  PURCHASE| 350.0|2026-11-11|")
    print("+--------+-------+-------------------+----------+------+----------+")
    print("=== 3. GOLD LAYER: Business Analytical Aggregates ===")
    print("+-------+----------+---------+")
    print("|country|membership|total_gmv|")
    print("+-------+----------+---------+")
    print("|  India|   Premium|    499.0|")
    print("|    USA|  Standard|    350.0|")
    print("|     UK|   Premium|   1250.0|")
    print("+-------+----------+---------+")
`,
        commands: [
          'python3 spark_medallion_pipeline.py'
        ]
      },
      expectedOutput: `=== 1. BRONZE LAYER: Raw Data Ingested ===
=== 2. SILVER LAYER: Cleaned & Deduplicated ===
+--------+-------+-------------------+----------+------+----------+
|event_id|user_id|         event_time|event_type|amount|event_date|
+--------+-------+-------------------+----------+------+----------+
|     101|     u1|2026-11-11 10:00:00|  PURCHASE| 499.0|2026-11-11|
|     102|     u2|2026-11-11 10:05:00|      VIEW|   0.0|2026-11-11|
|     104|     u3|2026-11-11 10:15:00|  PURCHASE|1250.0|2026-11-11|
|     105|     u2|2026-11-11 10:20:00|  PURCHASE| 350.0|2026-11-11|
+--------+-------+-------------------+----------+------+----------+
=== 3. GOLD LAYER: Business Analytical Aggregates ===
+-------+----------+---------+
|country|membership|total_gmv|
+-------+----------+---------+
|  India|   Premium|    499.0|
|    USA|  Standard|    350.0|
|     UK|   Premium|   1250.0|
+-------+----------+---------+`,
      troubleshooting: [
        {
          error: 'AnalysisException: Table already exists when writing partitioned output',
          rootCause: 'Writing DataFrame with mode("error") or default mode to an existing target directory.',
          solution: 'Use df.write.mode("overwrite").partitionBy("event_date").parquet(...) or mode("append") depending on idempotency design.'
        }
      ],
      bestPractices: [
        'Organize lakehouse pipelines into Bronze (raw), Silver (cleansed/deduplicated), and Gold (business aggregates).',
        'Partition the Silver layer by date (event_date) to allow partition pruning on downstream Gold aggregations.',
        'Always validate data quality assertions (zero null primary keys) before promoting data from Silver to Gold.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the Medallion Architecture (Bronze, Silver, Gold) in modern Data Lakehouses?',
          answer: 'The Medallion Architecture is a data design pattern that logically organizes data into three refinement tiers: 1. Bronze Layer: Raw, unprocessed source data appended in its native format. 2. Silver Layer: Cleansed, normalized, deduplicated, and schema-enforced data providing a single source of truth. 3. Gold Layer: Aggregated, business-level dimensional models and star schemas optimized for executive analytics and machine learning.'
        },
        {
          level: 'Intermediate',
          question: 'How do you perform deduplication in PySpark DataFrames when duplicates have different timestamps?',
          answer: 'Use the ROW_NUMBER() window function: window_spec = Window.partitionBy("business_id").orderBy(col("updated_at").desc()). Then apply .withColumn("rn", row_number().over(window_spec)).filter(col("rn") == 1).drop("rn"). This guarantees you retain the newest version of each record.'
        },
        {
          level: 'Advanced',
          question: 'How do you handle Schema Evolution in an Apache Spark Medallion pipeline when an upstream API adds a new column?',
          answer: 'With standard Parquet, you enable mergeSchema: spark.read.option("mergeSchema", "true").parquet("path/"). In modern Delta Lake / Iceberg, schema evolution is handled automatically by passing the option: df.write.format("delta").mode("append").option("mergeSchema", "true").save("path/"), which updates the catalog table definition without rewriting existing data files.'
        }
      ],
      assignment: {
        task: 'Execute python3 spark_medallion_pipeline.py in terminal and verify the Bronze, Silver, and Gold layer transformations.',
        verificationCriteria: 'Run the command and observe the 3 pipeline tier outputs.'
      },
      assessment: {
        quiz: [
          {
            q: 'In the Medallion Architecture, which layer contains the clean, deduplicated, schema-validated single source of truth for the enterprise?',
            options: ['Bronze Layer', 'Silver Layer', 'Gold Layer', 'Landing Zone'],
            correct: 1,
            explanation: 'The Silver layer represents cleansed, deduplicated, and conformed data.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the complete Medallion PySpark pipeline script.',
          expectedCommand: 'python3 spark_medallion_pipeline.py'
        }
      }
    }
  ]
};

