import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { InteractiveTerminal } from './InteractiveTerminal';
import { 
  Terminal, Server, Copy, Check, Play, 
  ExternalLink, Download, AlertTriangle, CheckCircle2, 
  BookOpen, Code2, Database, Zap, Radio, HardDrive, ShieldCheck,
  ChevronRight, RefreshCw, Cpu
} from 'lucide-react';

const labLabs = [
  {
    id: 'lab-hdfs',
    name: 'HDFS Multi-Node Cluster & CLI',
    tech: 'HDFS 3.3.6',
    icon: HardDrive,
    level: 'Beginner - Intermediate',
    problem: 'Upload a 512 MB telemetry dataset, inspect block distribution across DataNodes, configure replication factor to 3, simulate data corruption, and run fsck health checks.',
    dockerSnippet: `version: "3"
services:
  namenode:
    image: bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8
    container_name: namenode
    ports:
      - "9870:9870"
      - "9000:9000"
    environment:
      - CLUSTER_NAME=production-cluster
      - CORE_CONF_fs_defaultFS=hdfs://namenode:9000
  datanode1:
    image: bde2020/hadoop-datanode:2.0.0-hadoop3.2.1-java8
    depends_on:
      - namenode
  datanode2:
    image: bde2020/hadoop-datanode:2.0.0-hadoop3.2.1-java8
    depends_on:
      - namenode`,
    steps: [
      {
        step: 1,
        title: 'Check Cluster Health & Safe Mode',
        desc: 'Before executing writes, verify that NameNode has exited Safe Mode and registered all DataNodes.',
        cmd: 'hdfs dfsadmin -report',
        expected: 'Live datanodes (2): datanode1, datanode2. Configured Capacity: 100 GB. DFS Used: 2.1 GB (2.1%).'
      },
      {
        step: 2,
        title: 'Create User & Raw Ingestion Directories',
        desc: 'Create partitioned directory hierarchy adhering to the standard Data Lake Bronze tier.',
        cmd: 'hdfs dfs -mkdir -p /data/bronze/telemetry/2026/11/',
        expected: 'Directory created successfully with owner hdfs:supergroup permissions drwxr-xr-x'
      },
      {
        step: 3,
        title: 'Upload Large Dataset to HDFS',
        desc: 'Upload 512 MB dataset. Observe automatic block division into 128 MB chunks (blk_01 to blk_04).',
        cmd: 'hdfs dfs -put /tmp/sensor_stream.csv /data/bronze/telemetry/2026/11/',
        expected: 'File uploaded. 4 blocks allocated. Replication factor = 3.'
      },
      {
        step: 4,
        title: 'Inspect Physical Block Allocation & Locations',
        desc: 'Use fsck to trace exact replica DataNode IP addresses and rack placement.',
        cmd: 'hdfs fsck /data/bronze/telemetry/2026/11/sensor_stream.csv -files -blocks -locations',
        expected: 'Connecting to NameNode... Status: HEALTHY. Total size: 536870912 bytes. Total blocks: 4. Target replication: 3. Over-replicated: 0, Under-replicated: 0.'
      },
      {
        step: 5,
        title: 'Adjust Replication Factor Dynamically',
        desc: 'Lower replication factor to 2 during storage optimization audit.',
        cmd: 'hdfs dfs -setrep -w 2 /data/bronze/telemetry/2026/11/sensor_stream.csv',
        expected: 'Replication 2 set. NameNode scheduled removal of excess 4 block replicas across cluster.'
      }
    ]
  },
  {
    id: 'lab-spark',
    name: 'Apache Spark & PySpark Engine',
    tech: 'Spark 3.5.0',
    icon: Zap,
    level: 'Intermediate - Advanced',
    problem: 'Process high-velocity e-commerce clickstream data. Compute session metrics, eliminate data skew using broadcast joins, and benchmark in-memory cache speedup.',
    dockerSnippet: `version: "3"
services:
  spark-master:
    image: bitnami/spark:3.5.0
    environment:
      - SPARK_MODE=master
      - SPARK_RPC_AUTHENTICATION_ENABLED=no
    ports:
      - "8080:8080"
      - "7077:7077"
  spark-worker:
    image: bitnami/spark:3.5.0
    environment:
      - SPARK_MODE=worker
      - SPARK_MASTER_URL=spark://spark-master:7077
      - SPARK_WORKER_MEMORY=2G
      - SPARK_WORKER_CORES=2
    depends_on:
      - spark-master`,
    steps: [
      {
        step: 1,
        title: 'Launch PySpark Interactive Shell',
        desc: 'Start PySpark with 2 driver cores and broadcast threshold tuned.',
        cmd: 'pyspark --master local[2] --conf spark.sql.shuffle.partitions=8',
        expected: 'SparkSession available as "spark" (Spark version 3.5.0, Python 3.13.7).'
      },
      {
        step: 2,
        title: 'Read Parquet Dataset with Schema Enforcement',
        desc: 'Read Bronze tier clickstream logs directly into a distributed DataFrame.',
        cmd: 'df = spark.read.parquet("/data/bronze/clickstream/") ; df.printSchema()',
        expected: 'root\n |-- user_id: string (nullable = true)\n |-- event_time: timestamp (nullable = true)\n |-- action: string (nullable = true)\n |-- amount: double (nullable = true)'
      },
      {
        step: 3,
        title: 'Perform Aggregation & Window Analytics',
        desc: 'Compute running spend and total actions per user category.',
        cmd: 'df.groupBy("action").agg({"amount": "sum", "*": "count"}).show()',
        expected: '+--------+-----------+------------+\n|  action|sum(amount)|count(1)    |\n+--------+-----------+------------+\n|purchase| 1450280.50|       42180|\n|    cart|       null|      182900|\n|    view|       null|     2450190|\n+--------+-----------+------------+'
      },
      {
        step: 4,
        title: 'Inspect Catalyst Physical Plan (EXPLAIN)',
        desc: 'Verify if Spark performed a SortMergeJoin or optimized into a BroadcastExchange.',
        cmd: 'df.join(broadcast(lookup_df), "category_id").explain()',
        expected: '== Physical Plan ==\nAdaptiveSparkPlan isFinalPlan=false\n+- BroadcastHashJoin [category_id#12], BuildRight\n   :- Scan parquet [user_id, category_id]\n   +- BroadcastExchange HashedRelationBroadcastMode'
      }
    ]
  },
  {
    id: 'lab-kafka',
    name: 'Apache Kafka Event Streaming',
    tech: 'Kafka 3.6.0 (KRaft)',
    icon: Radio,
    level: 'Intermediate - Advanced',
    problem: 'Create a 3-partition partitioned topic with replication factor 2. Produce real-time JSON financial events, run consumer group with offset tracking, and inspect consumer lag.',
    dockerSnippet: `version: "3"
services:
  kafka:
    image: confluentinc/cp-kafka:7.5.0
    hostname: kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://localhost:9092'
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_PROCESS_ROLES: 'broker,controller'
      KAFKA_CONTROLLER_QUORUM_VOTERS: '1@kafka:29093'
      KAFKA_LISTENERS: 'PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:29093'`,
    steps: [
      {
        step: 1,
        title: 'Create Distributed Topic with Partitions',
        desc: 'Create orders-stream topic with 3 partitions for horizontal consumer scale.',
        cmd: 'kafka-topics.sh --create --topic orders-stream --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1',
        expected: 'Created topic orders-stream.'
      },
      {
        step: 2,
        title: 'Describe Topic Partition Leaders',
        desc: 'Inspect partition leaders and ISR (In-Sync Replicas).',
        cmd: 'kafka-topics.sh --describe --topic orders-stream --bootstrap-server localhost:9092',
        expected: 'Topic: orders-stream\tPartitionCount: 3\tReplicationFactor: 1\n\tPartition: 0\tLeader: 1\tReplicas: 1\tIsr: 1\n\tPartition: 1\tLeader: 1\tReplicas: 1\tIsr: 1\n\tPartition: 2\tLeader: 1\tReplicas: 1\tIsr: 1'
      },
      {
        step: 3,
        title: 'Publish JSON Messages to Kafka',
        desc: 'Send streaming order payloads with customer keys.',
        cmd: 'echo "cust_991:{\\"order_id\\":\\"ord_8821\\",\\"amt\\":249.99}" | kafka-console-producer.sh --topic orders-stream --bootstrap-server localhost:9092 --property parse.key=true --property key.separator=:',
        expected: 'Message written to Partition 2 based on murmur2(cust_991).'
      },
      {
        step: 4,
        title: 'Inspect Consumer Group Offsets & Lag',
        desc: 'Audit consumer group lag to prevent pipeline delays.',
        cmd: 'kafka-consumer-groups.sh --describe --group analytics-worker-group --bootstrap-server localhost:9092',
        expected: 'GROUP                   TOPIC           PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG\nanalytics-worker-group  orders-stream   0          18520           18520           0\nanalytics-worker-group  orders-stream   1          19102           19110           8\nanalytics-worker-group  orders-stream   2          17990           17990           0'
      }
    ]
  },
  {
    id: 'lab-sql',
    name: 'Analytical SQL & Query Plan Tuning',
    tech: 'PostgreSQL / Trino',
    icon: Database,
    level: 'Intermediate',
    problem: 'Construct complex analytical window queries on an employee transactions warehouse, analyze EXPLAIN ANALYZE query plans, and add composite indexes to eliminate Sequential Scans.',
    dockerSnippet: `version: "3"
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: analytics_warehouse
      POSTGRES_USER: data_engineer
      POSTGRES_PASSWORD: de_password_2026
    ports:
      - "5432:5432"`,
    steps: [
      {
        step: 1,
        title: 'Calculate 30-Day Moving Average Revenue',
        desc: 'Use window frame ROWS BETWEEN 29 PRECEDING AND CURRENT ROW to smooth transaction volatility.',
        cmd: 'SELECT order_date, daily_revenue, AVG(daily_revenue) OVER (ORDER BY order_date ROWS BETWEEN 29 PRECEDING AND CURRENT ROW) as moving_avg_30d FROM daily_sales_metrics ORDER BY order_date DESC LIMIT 5;',
        expected: 'order_date | daily_revenue | moving_avg_30d\n2026-11-10 | 125000.00    | 118420.50\n2026-11-09 | 119500.00    | 117900.20'
      },
      {
        step: 2,
        title: 'Rank High-Value Customers with DENSE_RANK()',
        desc: 'Rank customers per region without skipping rank positions on ties.',
        cmd: 'SELECT customer_id, region, total_spend, DENSE_RANK() OVER (PARTITION BY region ORDER BY total_spend DESC) as regional_rank FROM customer_summary WHERE total_spend > 5000 LIMIT 5;',
        expected: 'customer_id | region | total_spend | regional_rank\nCUST_882    | US-EAST| 98520.00    | 1\nCUST_104    | US-EAST| 94210.00    | 2'
      },
      {
        step: 3,
        title: 'Inspect Execution Plan for Cost Bottlenecks',
        desc: 'Run EXPLAIN ANALYZE to identify Sequential Scans on 50M row transaction tables.',
        cmd: 'EXPLAIN ANALYZE SELECT * FROM transactions WHERE user_id = 99120 AND status = "COMPLETED";',
        expected: 'Seq Scan on transactions (cost=0.00..892400.00 rows=12 width=142) (actual time=4850.120..4850.125 rows=14 loops=1)\nExecution Time: 4851.05 ms (SLOW: Missing composite index!)'
      },
      {
        step: 4,
        title: 'Create Composite Index & Verify 100x Speedup',
        desc: 'Create B-tree index on (user_id, status) to convert Seq Scan into Index Scan.',
        cmd: 'CREATE INDEX idx_tx_user_status ON transactions(user_id, status); EXPLAIN ANALYZE SELECT * FROM transactions WHERE user_id = 99120 AND status = "COMPLETED";',
        expected: 'Index Scan using idx_tx_user_status on transactions (cost=0.42..14.50 rows=12 width=142) (actual time=0.082..0.089 rows=14 loops=1)\nExecution Time: 0.120 ms (40,000x Speedup achieved!)'
      }
    ]
  },
  {
    id: 'lab-linux',
    name: 'Linux Shell & Production Automation',
    tech: 'Enterprise Linux / Bash',
    icon: Terminal,
    level: 'Beginner - Intermediate',
    problem: 'Diagnose cluster edge node disk exhaustion, isolate top 10 memory-consuming processes, automate daily HDFS log backup with cron, and parse access logs using awk and sort.',
    dockerSnippet: `version: "3"
services:
  edge-node:
    image: ubuntu:22.04
    command: /bin/bash -c "apt-get update && apt-get install -y curl htop cron procps && sleep infinity"`,
    steps: [
      {
        step: 1,
        title: 'Check Filesystem Disk Inodes & Mounts',
        desc: 'Identify which filesystem partition has reached 100% capacity.',
        cmd: 'df -h && df -i',
        expected: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        80G   78G  2.0G  98% /\n/dev/sdb1       2.0T  850G  1.1T  44% /data/hdfs'
      },
      {
        step: 2,
        title: 'Locate Top 10 Largest Log Directories',
        desc: 'Find directory culprits consuming root partition storage.',
        cmd: 'du -ah /var/log/ | sort -rh | head -n 10',
        expected: '48G\t/var/log/hadoop-yarn\n22G\t/var/log/hadoop-hdfs\n4.2G\t/var/log/spark-history'
      },
      {
        step: 3,
        title: 'Extract 4xx / 5xx HTTP Errors with Awk',
        desc: 'Parse WebHDFS gateway logs to find high-frequency error IP addresses.',
        cmd: "awk '$9 ~ /^[45]/ {print $1, $9}' /var/log/webhdfs_access.log | sort | uniq -c | sort -nr | head -n 5",
        expected: '1420 192.168.1.55 503\n 892 192.168.2.14 403\n 241 192.168.1.99 404'
      },
      {
        step: 4,
        title: 'Automate Log Retention via Crontab',
        desc: 'Schedule automated compression and deletion of logs older than 7 days every night at 2 AM.',
        cmd: 'echo "0 2 * * * find /var/log/hadoop-yarn/ -name \\"*.log\\" -mtime +7 -delete" | crontab -',
        expected: 'crontab installed: job will run at 02:00 every day.'
      }
    ]
  }
];

export const LabStudio = () => {
  const [selectedLabId, setSelectedLabId] = useState('lab-hdfs');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState('steps'); // 'steps' or 'docker'
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const activeLab = labLabs.find(l => l.id === selectedLabId) || labLabs[0];
  const currentStep = activeLab.steps[currentStepIdx] || activeLab.steps[0];

  const handleCopyCmd = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyDocker = () => {
    navigator.clipboard.writeText(activeLab.dockerSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Top Header & Lab Selector */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              PRACTICAL LAB STUDIO
            </span>
            <span className="text-xs text-slate-400 font-mono">Interactive Sandboxed Clusters</span>
          </div>
          <h1 className="text-xl font-black text-slate-100 mt-1 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            Industry Hands-On Engineering Labs
          </h1>
        </div>

        {/* Lab Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {labLabs.map(lab => {
            const Icon = lab.icon;
            const isSelected = lab.id === selectedLabId;
            return (
              <button
                key={lab.id}
                onClick={() => {
                  setSelectedLabId(lab.id);
                  setCurrentStepIdx(0);
                }}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lab.tech}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Split: Left Guide & Right Terminal */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Column: Lab Guide, Steps & Docker Setup */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-800 overflow-y-auto p-6 space-y-6">
          
          {/* Active Lab Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-wider">
                  {activeLab.tech}
                </span>
                <h2 className="text-lg font-bold text-slate-100 mt-0.5">{activeLab.name}</h2>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {activeLab.level}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mt-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <strong className="text-amber-300">Problem Statement: </strong>
              {activeLab.problem}
            </p>

            {/* Sub-Tabs: Steps vs Docker Local Setup */}
            <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveSubTab('steps')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeSubTab === 'steps'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Step-by-Step Execution ({activeLab.steps.length} Steps)
              </button>
              <button
                onClick={() => setActiveSubTab('docker')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeSubTab === 'docker'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Docker-Compose YAML (Run Locally)</span>
              </button>
            </div>
          </div>

          {/* Sub-Tab 1: Steps */}
          {activeSubTab === 'steps' && (
            <div className="space-y-4">
              {/* Step indicator pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                {activeLab.steps.map((st, idx) => (
                  <button
                    key={st.step}
                    onClick={() => setCurrentStepIdx(idx)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      idx === currentStepIdx
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>Step {st.step}</span>
                  </button>
                ))}
              </div>

              {/* Active Step Detailed Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold font-mono">
                      {currentStep.step}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">{currentStep.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{currentStep.desc}</p>
                </div>

                {/* Command Snippet with Copy */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-amber-400">Execution Command</span>
                    <button
                      onClick={() => handleCopyCmd(currentStep.cmd)}
                      className="flex items-center space-x-1 hover:text-slate-200 text-[10px] text-slate-400"
                    >
                      {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCmd ? 'Copied!' : 'Copy Command'}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto flex items-center justify-between">
                    <code>{currentStep.cmd}</code>
                  </div>
                </div>

                {/* Expected Output */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-emerald-400">Expected Terminal Output:</span>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-emerald-900/30 text-emerald-400/90 font-mono text-[11px] overflow-x-auto leading-relaxed">
                    {currentStep.expected}
                  </pre>
                </div>

                {/* Step Navigation Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    disabled={currentStepIdx === 0}
                    onClick={() => setCurrentStepIdx(prev => prev - 1)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700"
                  >
                    Previous Step
                  </button>
                  <span className="text-xs text-slate-400 font-mono">
                    Step {currentStepIdx + 1} of {activeLab.steps.length}
                  </span>
                  <button
                    disabled={currentStepIdx === activeLab.steps.length - 1}
                    onClick={() => setCurrentStepIdx(prev => prev + 1)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-400"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Docker Setup */}
          {activeSubTab === 'docker' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-cyan-400" />
                    Run on Your Local Machine (Docker)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Save this as <code className="text-amber-300 font-mono">docker-compose.yml</code> and run <code className="text-amber-300 font-mono">docker compose up -d</code>.
                  </p>
                </div>
                <button
                  onClick={handleCopyDocker}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1.5 hover:bg-cyan-500/20"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet ? 'Copied' : 'Copy YAML'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
                {activeLab.dockerSnippet}
              </pre>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <p className="font-semibold text-slate-200">How to connect to the container shell:</p>
                <code className="block p-2 rounded bg-slate-900 text-amber-400 font-mono text-[11px]">
                  docker exec -it namenode /bin/bash
                </code>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Multi-Engine Terminal */}
        <div className="w-full lg:w-1/2 flex flex-col h-full bg-slate-950 p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Live Interactive Multi-Engine Terminal
            </span>
            <span className="font-mono text-[10px] text-slate-400">Supports HDFS, Spark, Kafka & Linux commands</span>
          </div>

          <div className="flex-1 flex flex-col min-h-[450px]">
            <InteractiveTerminal initialCommand={currentStep.cmd} />
          </div>
        </div>

      </div>

    </div>
  );
};

