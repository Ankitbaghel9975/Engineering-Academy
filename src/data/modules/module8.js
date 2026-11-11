// Module 8: Apache Kafka
export const module8 = {
  id: 'mod-8',
  title: 'Module 8: Apache Kafka & Real-Time Streaming',
  description: 'Master Apache Kafka distributed commit log architecture, topics, partitions, consumer groups, offsets, replication, and end-to-end streaming pipelines.',
  badge: 'Streaming Core',
  icon: 'Radio',
  lessons: [
    {
      id: 'm8-l1',
      title: 'Apache Kafka Architecture & Ecosystem',
      duration: '50 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'Apache Kafka is an open-source distributed event streaming platform created at LinkedIn in 2011 and donated to the Apache Software Foundation. While traditional message queues (RabbitMQ, ActiveMQ) treat messages as transient packets that are deleted once consumed, Kafka is architected fundamentally as a horizontally scalable, fault-tolerant, append-only Distributed Commit Log. Messages are retained on disk for a configurable duration (e.g. 7 days or indefinitely), allowing multiple independent consumers to read streams at their own pace. Kafka decouples high-velocity data producers from analytical consumers.',
        hi: 'Apache Kafka duniya ka sabse popular real-time event streaming platform hai (LinkedIn ne 2011 me banaya tha). Traditional message queues (jaise RabbitMQ) message padhte hi use delete kar dete the. Lekin Kafka ek "Distributed Commit Log" ki tarah kaam karta hai — ye messages ko disk par append-only file ki tarah save karke rakhta hai (chahe 7 din ke liye ya humesha ke liye). Iska matlab hai ki ek hi clickstream event ko real-time fraud detection engine turant padh sakta hai, aur wahi event raat ko 12 baje HDFS/Spark data lake me bhi batch insert ho sakta hai!'
      },
      why: 'In modern tech companies, dozens of services (mobile apps, payment gateways, microservices) produce millions of events per second. Connecting every producer directly to every consumer creates an unmaintainable N x M network tangle. Kafka acts as the central event nervous system of the enterprise.',
      how: '1. Producer: Microservices publish events to Kafka Topics.\n2. Broker Cluster: A group of Kafka servers (Brokers) store partitioned commit logs on disk.\n3. Topic & Partition: Topics are sliced into Partitions for parallel scale.\n4. Consumer Group: Multiple consumer worker instances read partitions in parallel.\n5. ZooKeeper / KRaft: Metadata coordination (Apache Kafka 3.x+ uses KRaft consensus, eliminating ZooKeeper).',
      architecture: {
        type: 'kafka_cluster_architecture',
        title: 'Apache Kafka Distributed Event Streaming Architecture',
        nodes: [
          { name: 'Producers', desc: 'Mobile Apps, IoT Sensors, Web Servers, CDC Debezium' },
          { name: 'Kafka Cluster (Brokers 101, 102, 103)', desc: 'Distributed commit log, partition leaders & ISR replicas' },
          { name: 'KRaft / ZooKeeper Quorum', desc: 'Cluster metadata, leader election, partition assignments' },
          { name: 'Consumer Groups', desc: 'Real-time Flink streaming + Spark Batch Ingestion + Microservices' }
        ]
      },
      industryExample: 'LinkedIn runs Kafka across multi-cluster deployments processing over 7 Trillion messages per day, serving search indexing, member activity feeds, and security monitoring.',
      practicalLab: {
        title: 'Lab 8.1: Inspecting Kafka Environment and CLI Utilities',
        problemStatement: 'Verify Kafka broker scripts, check topic management flags, and review standard Kafka configurations.',
        requirements: 'Kafka CLI or academy simulator.',
        setup: 'mkdir -p ~/bigdata_lab/m8_l1 && cd ~/bigdata_lab/m8_l1',
        instructions: [
          'Step 1: Inspect Kafka command-line tool suite.',
          'Step 2: Review standard cluster connection parameters (--bootstrap-server).'
        ],
        code: `# kafka_cli_verify.sh
echo "=== Kafka Administrative CLI Suite ==="
echo "1. kafka-topics.sh         - Create, list, describe, alter topics"
echo "2. kafka-console-producer.sh - Publish streaming records interactively"
echo "3. kafka-console-consumer.sh - Consume and display messages"
echo "4. kafka-consumer-groups.sh  - Track consumer group lag and offsets"
echo "5. kafka-configs.sh          - Dynamic configuration tuning"
`,
        commands: [
          'echo "Kafka Cluster Ready on localhost:9092"'
        ]
      },
      expectedOutput: `Kafka Cluster Ready on localhost:9092`,
      troubleshooting: [
        {
          error: 'Connection to node -1 (localhost/127.0.0.1:9092) could not be established. Broker may not be available.',
          rootCause: 'Kafka broker daemon is not running or advertised.listeners is not bound to a reachable IP address.',
          solution: 'Verify broker process with jps. In server.properties, set listeners=PLAINTEXT://0.0.0.0:9092 and advertised.listeners=PLAINTEXT://<external_ip>:9092.'
        }
      ],
      bestPractices: [
        'Always point clients to multiple bootstrap brokers (e.g. broker1:9092,broker2:9092) so clients can discover the cluster if one node is down.',
        'Adopt KRaft mode (Kafka Raft Metadata mode) for new deployments in Kafka 3.x+ to eliminate ZooKeeper dependencies.',
        'Never run Kafka on NFS mounts; Kafka relies heavily on local Linux pagecache and zero-copy sendfile syscalls.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is Apache Kafka and how does it differ from traditional message queues like RabbitMQ?',
          answer: 'Apache Kafka is a distributed, horizontally scalable, append-only commit log designed for high-throughput event streaming. Unlike RabbitMQ (which deletes messages once acknowledged and pushes data to consumers), Kafka persists messages on disk for a retention window (pull-based model), allowing multiple independent consumer groups to read and replay the same event stream independently at their own speed.'
        },
        {
          level: 'Intermediate',
          question: 'Why is Apache Kafka capable of achieving millions of writes per second on standard commodity disks?',
          answer: 'Kafka achieves extraordinary write throughput through four key architectural techniques: 1. Sequential Disk Writes (appending sequentially to disk is as fast as random memory writes, avoiding disk seek penalties), 2. Heavy reliance on Linux OS Pagecache (data is written to OS memory buffers without heavy JVM GC overhead), 3. Zero-Copy Transfer via the sendfile() Linux syscall (bytes are transferred directly from OS pagecache to network socket without copying through JVM user space), and 4. Batching (producers and brokers batch records together to minimize network packet overhead).'
        },
        {
          level: 'Advanced',
          question: 'What is KRaft (Kafka Raft) and why is it replacing Apache ZooKeeper in Kafka 3.x+?',
          answer: 'Previously, Kafka used Apache ZooKeeper to manage cluster metadata, leader elections, and topic configurations. ZooKeeper created an external dependency, doubled operational complexity, suffered from metadata synchronization lag, and hit limits around 200,000 partitions. KRaft implements an event-driven Raft consensus algorithm directly inside Kafka brokers, allowing clusters to scale to millions of partitions with near-instantaneous metadata failovers and simplified single-binary operations.'
        }
      ],
      assignment: {
        task: 'Execute the command echo "Kafka Cluster Ready on localhost:9092" in terminal and review the core Kafka CLI utilities.',
        verificationCriteria: 'Run the command and verify output.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which Linux operating system mechanism allows Kafka to transfer bytes directly from OS disk pagecache to the network socket without copying into JVM memory?',
            options: ['Zero-Copy sendfile() syscall', 'RAM disk mounting', 'JNI reflection', 'Direct3D buffer'],
            correct: 0,
            explanation: 'The Zero-Copy sendfile() syscall streams data directly from pagecache to the NIC buffer, bypassing JVM user space.'
          }
        ],
        commandChallenge: {
          prompt: 'Verify Kafka broker port status message.',
          expectedCommand: 'echo "Kafka Cluster Ready on localhost:9092"'
        }
      }
    },
    {
      id: 'm8-l2',
      title: 'Producers and Consumers Deep Dive',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Kafka Producers and Consumers form the client communication boundary. A Producer publishes events to topics. Key producer configurations include:\n- acks: acks=0 (fire and forget, fastest, possible loss), acks=1 (wait for partition leader acknowledgment), acks=all or -1 (wait for all In-Sync Replicas to acknowledge; guaranteed zero data loss).\n- batch.size & linger.ms: Controls micro-batching (waiting up to linger.ms to bundle records, maximizing throughput).\nConsumers read records using a pull-based model: the consumer polls the broker (consumer.poll(timeout)), processes the batch, and commits offsets back to Kafka.',
        hi: 'Producers aur Consumers Kafka ke do main sathi hain:\n- PRODUCER: Ye events ko Kafka Topics me bhejta hai. Sabse zaroori setting hoti hai acks: acks=0 (bina confirm kiye aage badho - fast par risky), acks=1 (leader node confirm karega), aur acks=all ya -1 (jab tak saari backup copies confirm na karein tab tak wait karo - 100% zero data loss!).\n- CONSUMER: Ye PULL model par kaam karta hai — matlab broker se data maangta hai (poll), data process karta hai, aur fir confirm karta hai ("Maine yahan tak padh liya", jise Offset Commit kehte hain).'
      },
      why: 'Setting acks=0 on financial transactions can cause millions of dollars in lost transaction records during a broker failover. Conversely, setting linger.ms=20 on high-throughput clickstream increases producer throughput by 500% by batching network packets.',
      how: '1. Producer Workflow:\n   ProducerRecord("orders", key, value) -> Serializer -> Partitioner -> RecordAccumulator Buffer -> Sender I/O Thread -> Broker.\n2. Key Partitioning: If key is null, uses round-robin / sticky partitioner; if key is provided, uses murmur2(key) % num_partitions to guarantee records with the same key land on the same partition in strict order!\n3. Consumer Workflow:\n   consumer.subscribe(["orders"]) -> consumer.poll(1.0) -> for record in records: process(record) -> consumer.commitSync().',
      architecture: {
        type: 'producer_partitioner_flow',
        title: 'Kafka Producer Record Buffering & Partition Routing',
        nodes: [
          { name: '1. ProducerRecord(k, v)', desc: 'Serialized into bytes using StringSerializer / Avro / JSON' },
          { name: '2. Partitioner', desc: 'Hashes key: murmur2(key) % partitions -> routes to Partition 1' },
          { name: '3. RecordAccumulator', desc: 'Buffers batches up to batch.size (16KB) or linger.ms (20ms)' },
          { name: '4. Network Sender', desc: 'Transmits socket batch to Partition 1 Leader Broker; awaits acks=all' }
        ]
      },
      industryExample: 'Uber trip dispatch events set acks=all and idempotence=true, ensuring that passenger ride-hail requests are never dropped or double-counted even if wireless connections fluctuate.',
      practicalLab: {
        title: 'Lab 8.2: Simulating Producer Event Publishing and Consumer Polling in Python',
        problemStatement: 'Simulate a Kafka producer emitting orders and a consumer reading and validating records.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m8_l2 && cd ~/bigdata_lab/m8_l2',
        instructions: [
          'Step 1: Write a Python producer/consumer simulation script.',
          'Step 2: Run using python3.',
          'Step 3: Verify the produced records and consumed offsets.'
        ],
        code: `# kafka_sim_lab.py
import json, time

# Simulated Kafka Topic Buffer
topic_storage = []

def kafka_producer(order_id, user_id, amount, acks="all"):
    payload = {
        "order_id": order_id,
        "user_id": user_id,
        "amount": amount,
        "timestamp": int(time.time())
    }
    # Simulate commit to log
    offset = len(topic_storage)
    topic_storage.append((offset, payload))
    return {"status": "SUCCESS", "partition": 0, "offset": offset, "acks": acks}

def kafka_consumer(poll_count=5):
    print("--- Consumer Polling New Records ---")
    consumed = []
    for offset, record in topic_storage[:poll_count]:
        consumed.append(record)
        print(f"Consumed [Offset {offset}]: Order {record['order_id']} for User {record['user_id']} (\${record['amount']})")
    return consumed

# Produce 3 events
p1 = kafka_producer("ORD_101", "usr_88", 250.0)
p2 = kafka_producer("ORD_102", "usr_92", 1200.0)
p3 = kafka_producer("ORD_103", "usr_88", 450.0)

print(f"Producer ACK 1: {p1}")
print(f"Producer ACK 2: {p2}")
print(f"Producer ACK 3: {p3}\\n")

# Consume events
kafka_consumer()
`,
        commands: [
          'python3 kafka_sim_lab.py'
        ]
      },
      expectedOutput: `Producer ACK 1: {'status': 'SUCCESS', 'partition': 0, 'offset': 0, 'acks': 'all'}
Producer ACK 2: {'status': 'SUCCESS', 'partition': 0, 'offset': 1, 'acks': 'all'}
Producer ACK 3: {'status': 'SUCCESS', 'partition': 0, 'offset': 2, 'acks': 'all'}

--- Consumer Polling New Records ---
Consumed [Offset 0]: Order ORD_101 for User usr_88 ($250.0)
Consumed [Offset 1]: Order ORD_102 for User usr_92 ($1200.0)
Consumed [Offset 2]: Order ORD_103 for User usr_88 ($450.0)`,
      troubleshooting: [
        {
          error: 'CommitFailedException: Commit cannot be completed since the group has already rebalanced',
          rootCause: 'Consumer took longer to process a batch of records than max.poll.interval.ms (default 5 minutes), causing the broker coordinator to declare the consumer dead and rebalance the group.',
          solution: 'Decrease max.poll.records (e.g. from 500 to 100) or increase max.poll.interval.ms.'
        }
      ],
      bestPractices: [
        'Always set acks=all and enable.idempotence=true on producers for mission-critical transactional streams.',
        'Always provide a meaningful Message Key (e.g. user_id or account_id) so all events for the same entity land on the same partition in strict chronological sequence.',
        'Use linger.ms (e.g. 10ms - 20ms) to allow producers to batch small messages, cutting network overhead drastically.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What do the producer configurations acks=0, acks=1, and acks=all (-1) mean in Kafka?',
          answer: 'acks=0: Producer does not wait for any acknowledgment from the broker; messages can be lost silently if broker crashes (highest throughput, lowest durability). acks=1: Producer waits for the Partition Leader to write the message to its local log before responding. acks=all (or -1): Producer waits until the Leader AND all In-Sync Replicas (ISR) have committed the message, guaranteeing zero data loss.'
        },
        {
          level: 'Intermediate',
          question: 'How does Kafka guarantee message ordering, and what is the role of the message key?',
          answer: 'Kafka guarantees message ordering ONLY within an individual Partition, NOT across an entire Topic. When a producer provides a message key, the default partitioner computes murmur2(key) % total_partitions. Because identical keys produce identical hash values, all messages with the same key (e.g. user_101) are guaranteed to be routed to the exact same partition and processed in strict FIFO order.'
        },
        {
          level: 'Advanced',
          question: 'What is an "Idempotent Producer" in Kafka and how does it prevent duplicates?',
          answer: 'When a producer sends a message and the broker writes it to disk, but the network ACK is lost, a standard producer retries, causing a duplicate record. An Idempotent Producer (enable.idempotence=true) assigns a unique Producer ID (PID) and a monotonically increasing Sequence Number to every batch. If the broker receives a sequence number it has already committed, it discards the duplicate while sending back an ACK, guaranteeing exactly-once semantics per partition.'
        }
      ],
      assignment: {
        task: 'Execute python3 kafka_sim_lab.py in terminal and verify the 3 produced ACKs and subsequent consumed offsets.',
        verificationCriteria: 'Run the command and observe the sequential offsets (0, 1, 2).'
      },
      assessment: {
        quiz: [
          {
            q: 'Which producer configuration ensures that all events sharing the exact same customer_id are routed to the same partition and processed in strict chronological order?',
            options: [
              'Setting linger.ms=100',
              'Providing customer_id as the message Key in ProducerRecord',
              'Setting acks=0',
              'Using round-robin partitioning'
            ],
            correct: 1,
            explanation: 'Kafka hashes the message key to select the partition; identical keys always map to the exact same partition.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the Kafka producer and consumer simulation script.',
          expectedCommand: 'python3 kafka_sim_lab.py'
        }
      }
    },
    {
      id: 'm8-l3',
      title: 'Brokers, Storage Internals & Log Segments',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'A Kafka Broker is a single server process within a Kafka cluster. A cluster is composed of multiple brokers identified by integer IDs (broker.id = 101, 102, 103). Brokers do not understand message schemas; to a broker, messages are raw byte arrays. On disk, each topic partition maps to an actual directory in the Linux filesystem (e.g. /var/lib/kafka/data/orders-0). Inside that directory, Kafka divides the partition commit log into Log Segments (default 1 GB or log.segment.bytes = 1073741824). A segment consists of a .log data file (raw bytes), a .index file (maps logical offsets to physical byte positions), and a .timeindex file.',
        hi: 'Kafka Broker cluster ka ek individual server hota hai. Har broker ka ek unique number hota hai (jaise Broker 101, Broker 102). Broker ko data ke schema se koi matlab nahi hota — uske liye data sirf raw bytes hote hain. Linux hard drive par har ek partition ka ek folder banta hai (jaise: orders-0). Uss folder ke andar Kafka 1 GB ke chhote-chhote "Log Segments" banata hai: .log file me actual data hota hai, aur .index file me offset ka byte address hota hai taaki data nano-seconds me seek kiya ja sake.'
      },
      why: 'If Kafka stored 50 Terabytes in a single giant monolithic file, searching for offset 10,000,000 would take minutes, and deleting old data would require rewriting the whole file. Log segments allow instant index lookups and zero-cost file deletion.',
      how: '1. Active Segment: The current segment receiving new writes.\n2. Segment Rollover: When active segment hits 1 GB (or log.roll.hours = 168), it is finalized (read-only), and a new active segment is created.\n3. Segment Index: Sparse index storing an entry every 4 KB (index.interval.bytes), allowing binary search in memory.\n4. Log Retention: Cleanup threads delete or compact segments older than log.retention.hours (default 168 hours = 7 days) via instantaneous rm file unlink.',
      architecture: {
        type: 'kafka_log_segment_layout',
        title: 'Kafka Partition Log Segment Structure on Disk',
        nodes: [
          { name: '/var/lib/kafka/data/orders-0/', desc: 'Partition directory containing segment files' },
          { name: '00000000000000000000.log', desc: 'Active data segment file storing serialized byte records' },
          { name: '00000000000000000000.index', desc: 'Memory-mapped sparse index mapping offsets to byte positions' },
          { name: '00000000000000000000.timeindex', desc: 'Maps record timestamps to offsets for point-in-time replays' }
        ]
      },
      industryExample: 'Netflix tunes log.segment.bytes to 512 MB and uses tiered storage to offload sealed historical segments directly to Amazon S3, retaining months of telemetry data at low cost.',
      practicalLab: {
        title: 'Lab 8.3: Inspecting Kafka Log Directories and Segment Files',
        problemStatement: 'Inspect how Kafka organizes topic partition folders, log files, and sparse indices on Linux filesystems.',
        requirements: 'Terminal simulator with ls.',
        setup: 'mkdir -p ~/bigdata_lab/m8_l3 && cd ~/bigdata_lab/m8_l3',
        instructions: [
          'Step 1: Create a simulated Kafka partition directory structure.',
          'Step 2: Inspect segment files and indices.',
          'Step 3: Understand how offset file naming works.'
        ],
        code: `# kafka_storage_inspect.sh
mkdir -p /tmp/kafka-logs/telemetry_events-0
mkdir -p /tmp/kafka-logs/telemetry_events-1

# Create simulated segment files
touch /tmp/kafka-logs/telemetry_events-0/00000000000000000000.log
touch /tmp/kafka-logs/telemetry_events-0/00000000000000000000.index
touch /tmp/kafka-logs/telemetry_events-0/00000000000000000000.timeindex
touch /tmp/kafka-logs/telemetry_events-0/leader-epoch-checkpoint

ls -la /tmp/kafka-logs/telemetry_events-0/
`,
        commands: [
          'ls -la /tmp/kafka-logs/telemetry_events-0/'
        ]
      },
      expectedOutput: `total 0
drwxr-xr-x 2 hadoop hadoop 120 Nov 11 15:40 .
drwxr-xr-x 4 hadoop hadoop  80 Nov 11 15:40 ..
-rw-r--r-- 1 hadoop hadoop   0 Nov 11 15:40 00000000000000000000.index
-rw-r--r-- 1 hadoop hadoop   0 Nov 11 15:40 00000000000000000000.log
-rw-r--r-- 1 hadoop hadoop   0 Nov 11 15:40 00000000000000000000.timeindex
-rw-r--r-- 1 hadoop hadoop   0 Nov 11 15:40 leader-epoch-checkpoint`,
      troubleshooting: [
        {
          error: 'Disk full: No space left on device in /var/lib/kafka/data',
          rootCause: 'Data ingestion exceeded log retention policy, or log retention bytes (log.retention.bytes) was set to unlimited (-1).',
          solution: 'Configure log.retention.hours (e.g. 24) or set log.retention.bytes per partition. Trigger log compaction or add storage volumes.'
        }
      ],
      bestPractices: [
        'Place Kafka data directories (log.dirs) on dedicated NVMe SSD drives mounted with noatime option.',
        'Never set log.flush.interval.messages or log.flush.interval.ms artificially low; trust Linux pagecache to flush asynchronously.',
        'Set up alerts on broker disk utilization; if disk exceeds 80%, rebalance partitions to less loaded brokers.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Log Segment in Kafka?',
          answer: 'A Log Segment is a slice of a partition\'s commit log stored as a physical file on disk (default 1 GB). When an active segment reaches its size or time limit, it is closed (sealed) as read-only, and a new active segment is created. This allows Kafka to clean up or delete expired data simply by deleting old segment files.'
        },
        {
          level: 'Intermediate',
          question: 'How do Kafka .index files work and why are they "sparse"?',
          answer: 'The .index file maps logical message offsets to physical byte offsets in the corresponding .log data file. It is called a "sparse index" because it does NOT index every single message; it records an entry only every 4 KB of data (index.interval.bytes). To locate an offset, Kafka performs a binary search in the index file to find the closest lower offset, and then performs a tiny sequential scan in the .log file, keeping the index small enough to fit completely in OS RAM.'
        },
        {
          level: 'Advanced',
          question: 'What is Log Compaction in Kafka and when should you choose cleanup.policy=compact over delete?',
          answer: 'With cleanup.policy=delete, records older than retention time are purged. With cleanup.policy=compact, Kafka retains the MOST RECENT value for every primary message key across the entire history of the topic, discarding older superseded values for that key. Log compaction is used for changelog streams (like CDC database tables or user account states) where downstream consumers only need the latest state of each entity.'
        }
      ],
      assignment: {
        task: 'Inspect the simulated Kafka partition segment files in /tmp/kafka-logs/telemetry_events-0/ using ls -la in terminal.',
        verificationCriteria: 'Run ls -la /tmp/kafka-logs/telemetry_events-0/ and verify the .log and .index files.'
      },
      assessment: {
        quiz: [
          {
            q: 'How does Kafka name its log segment files on the Linux filesystem (e.g. 00000000000000000000.log)?',
            options: [
              'Random UUID',
              'The base logical offset of the first message stored in that segment, padded with 20 digits',
              'The creation timestamp in milliseconds',
              'The broker ID'
            ],
            correct: 1,
            explanation: 'The segment file name is the 20-digit zero-padded base offset of the first record in that segment.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect the Kafka segment directory files.',
          expectedCommand: 'ls -la /tmp/kafka-logs/telemetry_events-0/'
        }
      }
    },
    {
      id: 'm8-l4',
      title: 'Topics and Partitions',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'A Topic is a logical category or feed name to which records are published in Kafka (e.g. user-signups, order-placed). A topic is divided into one or more Partitions. Partitions are the core unit of scalability and parallelism in Kafka. Each partition is an ordered, immutable sequence of records continuously appended to a commit log. Partitions can be distributed across different physical brokers. The number of partitions determines the maximum parallelism of consumer groups: if a topic has 10 partitions, at most 10 consumer instances can read from that topic simultaneously.',
        hi: 'Topic ek logical category ya channel ka naam hota hai (jaise: orders-topic ya payments-topic). Har topic ko ek ya ek se zyada Partitions me baanta jaata hai. Partitions hi Kafka ki parallelism ki jaan hain! Agar ek topic me 10 partitions hain, toh wo 10 alag-alag machines par baante ja sakte hain. Aur sabse zaroori rule: agar topic me 10 partitions hain, toh ek Consumer Group me maximum 10 consumers hi parallel me data padh sakte hain — 11th consumer khali baitha rahega!'
      },
      why: 'A single server can only sustain ~100-200 MB/sec disk write throughput. Dividing a topic into 20 partitions distributed across 10 brokers enables the topic to ingest 2 GB/sec concurrently.',
      how: '1. Create Topic: kafka-topics.sh --create --bootstrap-server localhost:9092 --topic orders --partitions 6 --replication-factor 3\n2. List Topics: kafka-topics.sh --list --bootstrap-server localhost:9092\n3. Describe: kafka-topics.sh --describe --topic orders (displays partition leaders, replicas, and ISR).\n4. Alter Partitions: kafka-topics.sh --alter --topic orders --partitions 10 (partitions can be increased, but NEVER decreased!).',
      architecture: {
        type: 'topic_partition_broker_distribution',
        title: 'Topic Partition Distribution Across 3 Brokers',
        nodes: [
          { name: 'Topic: orders (6 Partitions, Repl=2)', desc: 'Logical streaming event stream' },
          { name: 'Broker 101', desc: 'Leader for Partition 0, Partition 3 | Follower for P1, P4' },
          { name: 'Broker 102', desc: 'Leader for Partition 1, Partition 4 | Follower for P2, P5' },
          { name: 'Broker 103', desc: 'Leader for Partition 2, Partition 5 | Follower for P0, P3' }
        ]
      },
      industryExample: 'Swiggy provisions 48 partitions for its live live-tracking topic, allowing 48 Spark streaming cores to process delivery partner GPS telemetry in parallel during lunch and dinner order peaks.',
      practicalLab: {
        title: 'Lab 8.4: Creating, Describing, and Managing Topics via CLI',
        problemStatement: 'Simulate creating a topic with 3 partitions and replication factor 2, and describe its partition layout.',
        requirements: 'Kafka administrative CLI simulator.',
        setup: 'mkdir -p ~/bigdata_lab/m8_l4 && cd ~/bigdata_lab/m8_l4',
        instructions: [
          'Step 1: Execute topic describe command.',
          'Step 2: Inspect Partition leaders, Replicas, and Isr lists.'
        ],
        code: `# topic_management_lab.sh
cat << 'EOF' > /tmp/mock_topic_describe.sh
echo "Topic: orders_stream	TopicId: K8vX9_4lTySP	PartitionCount: 3	ReplicationFactor: 2	Configs: min.insync.replicas=2"
echo "	Topic: orders_stream	Partition: 0	Leader: 101	Replicas: 101,102	Isr: 101,102"
echo "	Topic: orders_stream	Partition: 1	Leader: 102	Replicas: 102,103	Isr: 102,103"
echo "	Topic: orders_stream	Partition: 2	Leader: 103	Replicas: 103,101	Isr: 103,101"
EOF
bash /tmp/mock_topic_describe.sh
`,
        commands: [
          'bash /tmp/mock_topic_describe.sh'
        ]
      },
      expectedOutput: `Topic: orders_stream	TopicId: K8vX9_4lTySP	PartitionCount: 3	ReplicationFactor: 2	Configs: min.insync.replicas=2
	Topic: orders_stream	Partition: 0	Leader: 101	Replicas: 101,102	Isr: 101,102
	Topic: orders_stream	Partition: 1	Leader: 102	Replicas: 102,103	Isr: 102,103
	Topic: orders_stream	Partition: 2	Leader: 103	Replicas: 103,101	Isr: 103,101`,
      troubleshooting: [
        {
          error: 'org.apache.kafka.common.errors.InvalidPartitionsException: The number of partitions for a topic can only be increased',
          rootCause: 'Attempting to decrease the number of partitions on an existing topic.',
          solution: 'Kafka fundamentally does not support reducing partitions (as doing so would require deleting or moving data). To decrease, create a new topic with fewer partitions and migrate data.'
        }
      ],
      bestPractices: [
        'Calculate partition counts based on target throughput: Target Partitions = Max(Throughput / Producer_Rate, Throughput / Consumer_Rate).',
        'Never decrease partition count; once increased, partition count can never be reduced.',
        'Keep total partitions per broker under 4,000 to prevent metadata overhead and slow leader re-elections.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Topic and a Partition in Apache Kafka?',
          answer: 'A Topic is a logical category or feed to which records are published. A Partition is a physical, append-only log file belonging to a topic. Partitions allow topics to be scaled horizontally across multiple brokers and consumed in parallel by multiple consumers.'
        },
        {
          level: 'Intermediate',
          question: 'Can you decrease the number of partitions of an existing Kafka topic?',
          answer: 'No. Kafka does not allow decreasing the number of partitions on a topic. Once data is partitioned by hash, reducing partitions would require re-hashing and physically re-organizing existing log files on disk or deleting data. You can only increase partition counts.'
        },
        {
          level: 'Advanced',
          question: 'How does increasing the partition count of an existing topic affect message key ordering?',
          answer: 'Because the default partitioner uses murmur2(key) % num_partitions, changing the number of partitions alters the modulo result for future messages. Future messages with the same key will be routed to a DIFFERENT partition than past messages with that key, breaking global per-key ordering guarantees across time. In key-sensitive architectures, partition counts should be sized correctly at creation.'
        }
      ],
      assignment: {
        task: 'Execute bash /tmp/mock_topic_describe.sh in terminal and inspect the partition leaders and ISR lists.',
        verificationCriteria: 'Run the command and observe the 3 partition mappings.'
      },
      assessment: {
        quiz: [
          {
            q: 'If a Kafka topic has 4 partitions, what is the maximum number of consumer instances in a SINGLE consumer group that can actively read data in parallel?',
            options: ['1 consumer', '4 consumers', '8 consumers', 'Infinite consumers'],
            correct: 1,
            explanation: 'Each partition can be assigned to only one consumer instance within a single consumer group at a time.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the topic description script.',
          expectedCommand: 'bash /tmp/mock_topic_describe.sh'
        }
      }
    },
    {
      id: 'm8-l5',
      title: 'Consumer Groups & Partition Rebalancing',
      duration: '50 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'A Consumer Group is a collection of consumers that collaborate to consume data from one or more topics. Each consumer in the group is assigned a mutually exclusive subset of partitions. This enables horizontal scale-out: if a topic has 6 partitions and your consumer group has 3 instances (C1, C2, C3), each instance reads exactly 2 partitions. If C3 crashes, Kafka automatically initiates a Group Rebalance: one of the brokers (Group Coordinator) detects the failure via missed heartbeats, pauses consumption, and reassigns C3\'s partitions to C1 and C2 without data loss.',
        hi: 'Consumer Group ek aisi team hoti hai jisme multiple consumer instances milkar ek topic ka data baant kar process karte hain. Har consumer ko alag-alag partitions milte hain. Agar ek topic me 6 partitions hain aur aapki team me 3 workers hain (C1, C2, C3), toh sabko 2-2 partitions milenge. Agar C3 achanak crash ho jaye ya uska server band ho jaye, toh Kafka "Rebalance" trigger karta hai — wo C3 ke dono partitions C1 aur C2 ko baant deta hai taaki pipeline bina ruke chalti rahe!'
      },
      why: 'Consumer Groups provide elastic scalability and fault tolerance. You can scale consumer processing capacity dynamically from 1 machine to 50 machines simply by starting new consumer instances with the same group.id.',
      how: '1. Group ID: Configured in consumer: group.id = "analytics-ingestion-v1".\n2. Partition Assignment Strategies:\n   - RangeAssignor: Assigns contiguous ranges of partitions per topic.\n   - RoundRobinAssignor: Interleaves partitions evenly across all consumers.\n   - CooperativeStickyAssignor: Rebalances incrementally, migrating ONLY the affected partitions without stopping the world (Eager vs Incremental Cooperative Rebalancing).\n3. Rebalance Trigger: New consumer joins, existing consumer exits, consumer heartbeat timeout (max.poll.interval.ms exceeded), or topic partitions increased.',
      architecture: {
        type: 'consumer_group_rebalance_flow',
        title: 'Consumer Group Partition Allocation & Failover',
        nodes: [
          { name: 'Topic: 4 Partitions [P0, P1, P2, P3]', desc: 'Input streaming partition logs' },
          { name: 'Healthy State: Group (2 Consumers)', desc: 'Consumer A owns [P0, P1] | Consumer B owns [P2, P3]' },
          { name: 'Consumer B Crashes', desc: 'Heartbeat ceases; Group Coordinator triggers Rebalance' },
          { name: 'Rebalanced State', desc: 'Consumer A takes over all 4 partitions [P0, P1, P2, P3] seamlessly' }
        ]
      },
      industryExample: 'Netflix uses Cooperative Sticky Rebalancing on customer video telemetry consumer groups, preventing the dreaded "Stop-The-World" latency pauses during auto-scaling events.',
      practicalLab: {
        title: 'Lab 8.5: Simulating Consumer Group Partition Rebalancing',
        problemStatement: 'Simulate dynamic partition assignment across 2 active consumers, simulate a worker crash, and observe automatic rebalancing.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m8_l5 && cd ~/bigdata_lab/m8_l5',
        instructions: [
          'Step 1: Write a consumer group rebalancer simulation.',
          'Step 2: Run using python3.',
          'Step 3: Observe how partition ownership shifts when an instance fails.'
        ],
        code: `# rebalance_sim_lab.py
def assign_partitions(consumers, partitions):
    assignment = {c: [] for c in consumers}
    for i, p in enumerate(partitions):
        c = consumers[i % len(consumers)]
        assignment[c].append(p)
    return assignment

partitions = ["P0", "P1", "P2", "P3", "P4", "P5"]
active_consumers = ["Consumer_1", "Consumer_2", "Consumer_3"]

print("=== 1. Initial Balanced State (3 Consumers, 6 Partitions) ===")
alloc1 = assign_partitions(active_consumers, partitions)
for c, p in alloc1.items():
    print(f" {c} -> {p}")

print("\\n=== 2. Worker Crash: Consumer_3 Dies! ===")
active_consumers.remove("Consumer_3")
print("Group Coordinator detected missed heartbeat. Triggering Rebalance...")

print("\\n=== 3. Post-Rebalance State (2 Consumers, 6 Partitions) ===")
alloc2 = assign_partitions(active_consumers, partitions)
for c, p in alloc2.items():
    print(f" {c} -> {p}")
`,
        commands: [
          'python3 rebalance_sim_lab.py'
        ]
      },
      expectedOutput: `=== 1. Initial Balanced State (3 Consumers, 6 Partitions) ===
 Consumer_1 -> ['P0', 'P3']
 Consumer_2 -> ['P1', 'P4']
 Consumer_3 -> ['P2', 'P5']

=== 2. Worker Crash: Consumer_3 Dies! ===
Group Coordinator detected missed heartbeat. Triggering Rebalance...

=== 3. Post-Rebalance State (2 Consumers, 6 Partitions) ===
 Consumer_1 -> ['P0', 'P2', 'P4']
 Consumer_2 -> ['P1', 'P3', 'P5']`,
      troubleshooting: [
        {
          error: 'Rebalance Storm: Consumers repeatedly dropping out of group and rejoining every few minutes',
          rootCause: 'Downstream processing logic is slow (e.g. slow database batch insert) exceeding max.poll.interval.ms.',
          solution: 'Tune max.poll.records down (e.g. 50 records) or increase max.poll.interval.ms (e.g. 600000ms = 10 minutes).'
        }
      ],
      bestPractices: [
        'Always configure partition.assignment.strategy to org.apache.kafka.clients.consumer.CooperativeStickyAssignor to prevent Stop-The-World rebalance freezes.',
        'Keep number of consumers in a group less than or equal to the total number of partitions.',
        'Ensure heartbeats run on a separate background thread (session.timeout.ms = 45000).'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Consumer Group in Apache Kafka?',
          answer: 'A Consumer Group is a group of consumer instances sharing the same group.id that divide the partitions of a topic among themselves. Each partition is assigned to exactly one consumer in the group, allowing parallel consumption and automatic failover.'
        },
        {
          level: 'Intermediate',
          question: 'What happens if you have 8 consumer instances in a consumer group, but the topic only has 4 partitions?',
          answer: 'Exactly 4 consumer instances will each be assigned 1 partition. The remaining 4 consumer instances will sit completely idle with zero partitions assigned, acting as hot standbys ready to take over if any active consumer crashes.'
        },
        {
          level: 'Advanced',
          question: 'What is the difference between Eager Rebalancing and Incremental Cooperative Rebalancing in Kafka?',
          answer: 'In legacy Eager Rebalancing, when a rebalance is triggered, all consumers revoke ALL their partition assignments and stop consuming (a "Stop-The-World" pause). They rejoin the group and receive new assignments before resuming. In Incremental Cooperative Rebalancing, consumers continue reading from unaffected partitions uninterrupted; only the specific partitions that need to be migrated are revoked and reassigned, eliminating cluster ingestion pauses.'
        }
      ],
      assignment: {
        task: 'Execute python3 rebalance_sim_lab.py in terminal and observe how the 6 partitions redistribute across 2 consumers after Consumer 3 crashes.',
        verificationCriteria: 'Run the command and observe the post-rebalance allocation.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which partition assignment strategy eliminates "Stop-The-World" pauses by only migrating affected partitions during a rebalance?',
            options: [
              'RangeAssignor',
              'RoundRobinAssignor',
              'CooperativeStickyAssignor',
              'FIFOAssignor'
            ],
            correct: 2,
            explanation: 'CooperativeStickyAssignor allows uninterrupted consumption on healthy partitions, reassigning only migrating partitions.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the consumer group rebalancing simulation script.',
          expectedCommand: 'python3 rebalance_sim_lab.py'
        }
      }
    },
    {
      id: 'm8-l6',
      title: 'Offsets, Commit Semantics & Consumer Lag',
      duration: '50 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'An Offset is a monotonically increasing 64-bit integer assigned to each record in a partition, representing its exact sequential position. Consumers track their progress by committing offsets back to an internal Kafka topic called __consumer_offsets. Three processing delivery semantics govern Kafka pipelines:\n1. At-Most-Once: Offsets are committed BEFORE processing data. If processing crashes, messages are lost (zero duplicates, possible data loss).\n2. At-Least-Once: Offsets are committed AFTER processing data. If processing crashes before commit, messages are re-read upon restart (zero data loss, possible duplicates; requires idempotent downstream writes).\n3. Exactly-Once (EOS): Achieved via Kafka Transactions (Kafka Streams / transactional producer) or idempotent upserts.\nCONSUMER LAG is the difference between the latest offset produced by publishers and the current offset processed by consumers. High consumer lag indicates consumers are falling behind.',
        hi: 'Offset ek sequential number hota hai jo har message ko partition ke andar milta hai (jaise: 0, 1, 2, 3..). Consumer ye yaad rakhne ke liye ki usne kahan tak padh liya, Kafka ke internal topic (__consumer_offsets) me apna offset commit karta hai.\n- AT-MOST-ONCE: Data process karne se PEHLE offset commit kar dena (crash hone par data loss ho sakta hai).\n- AT-LEAST-ONCE: Data process karne ke BAAD offset commit karna (data loss nahi hota, par duplicate ho sakta hai — industry standard!).\n- CONSUMER LAG: Latest produced message aur consumer ke current message ke beech ka fasla. Agar lag lagatar badh raha hai, iska matlab consumer slow hai aur pipeline me bottleneck hai!'
      },
      why: 'Consumer lag is the #1 operational metric monitored by data engineering teams. If Kafka lag spikes from 1,000 to 5,000,000 messages, downstream real-time dashboards show stale data and alerts escalate to on-call engineers.',
      how: '1. Auto Commit vs Manual: Disable enable.auto.commit = false in production.\n2. Manual Commit: consumer.commit_sync() or consumer.commit_async().\n3. Check Lag CLI: kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group my-group\n4. Inspect Columns: LOG-END-OFFSET (latest produced), CURRENT-OFFSET (consumer position), LAG (difference).',
      architecture: {
        type: 'consumer_lag_gauge',
        title: 'Kafka Consumer Lag Monitoring Gauge',
        nodes: [
          { name: 'Log End Offset (LEO)', desc: 'Offset 10,500 (Latest message written by producer)' },
          { name: 'Current Consumer Offset', desc: 'Offset 9,200 (Latest message processed by consumer)' },
          { name: 'Consumer Lag = 1,300', desc: '1,300 unprocessed messages in backlog queue' },
          { name: 'Lag Health Action', desc: 'Lag stable = healthy; Lag growing exponentially = scale consumer instances' }
        ]
      },
      industryExample: 'Datadog and Uber set Prometheus alerts on Kafka Consumer Lag: if lag on any critical partition exceeds 10,000 messages for more than 5 minutes, an automated Kubernetes HPA (Horizontal Pod Autoscaler) launches additional consumer pods.',
      practicalLab: {
        title: 'Lab 8.6: Inspecting Consumer Lag and Offsets via CLI',
        problemStatement: 'Simulate querying consumer group offsets and calculate consumer lag across partitions.',
        requirements: 'Terminal simulator.',
        setup: 'mkdir -p ~/bigdata_lab/m8_l6 && cd ~/bigdata_lab/m8_l6',
        instructions: [
          'Step 1: Execute consumer group describe script.',
          'Step 2: Inspect CURRENT-OFFSET, LOG-END-OFFSET, and calculate LAG.'
        ],
        code: `# consumer_lag_inspect.sh
cat << 'EOF' > /tmp/mock_lag_report.sh
echo "GROUP                  TOPIC           PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             CONSUMER-ID     HOST            CLIENT-ID"
echo "analytics-group        orders_stream   0          10450           10500           50              consumer-1_0    /192.168.1.10   client-1"
echo "analytics-group        orders_stream   1          8900            9820            920             consumer-2_1    /192.168.1.11   client-2"
echo "analytics-group        orders_stream   2          12100           12105           5               consumer-3_2    /192.168.1.12   client-3"
EOF
bash /tmp/mock_lag_report.sh
`,
        commands: [
          'bash /tmp/mock_lag_report.sh'
        ]
      },
      expectedOutput: `GROUP                  TOPIC           PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             CONSUMER-ID     HOST            CLIENT-ID
analytics-group        orders_stream   0          10450           10500           50              consumer-1_0    /192.168.1.10   client-1
analytics-group        orders_stream   1          8900            9820            920             consumer-2_1    /192.168.1.11   client-2
analytics-group        orders_stream   2          12100           12105           5               consumer-3_2    /192.168.1.12   client-3`,
      troubleshooting: [
        {
          error: 'Consumer Lag continues growing exponentially even though CPU is only 20%',
          rootCause: 'Consumer is bottlenecked on synchronous external database calls or third-party HTTP requests inside the message processing loop.',
          solution: 'Batch database writes using executemany() or buffer records into a micro-batch before committing offsets.'
        }
      ],
      bestPractices: [
        'Always disable enable.auto.commit in production pipelines; manually commit offsets after business processing completes.',
        'Monitor Consumer Lag continuously in Datadog/Grafana with PagerDuty alerts.',
        'Reset offsets using kafka-consumer-groups.sh --reset-offsets --to-earliest or --to-offset to replay historical streams during bug recovery.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is Consumer Lag in Apache Kafka?',
          answer: 'Consumer Lag is the difference between the latest message offset written by producers to a partition (Log End Offset - LEO) and the current offset that has been processed and committed by the consumer group. It represents the backlog of unread messages waiting in the partition queue.'
        },
        {
          level: 'Intermediate',
          question: 'What is the difference between At-Most-Once and At-Least-Once delivery semantics in Kafka?',
          answer: 'In At-Most-Once, the consumer commits the message offset immediately upon polling, BEFORE processing the record. If the consumer crashes during processing, the message is lost and will never be re-read (zero duplicates, possible data loss). In At-Least-Once, the consumer commits the offset AFTER successfully processing and saving the record. If the consumer crashes during processing, the uncommitted message will be re-processed upon restart (zero data loss, possible duplicates).'
        },
        {
          level: 'Advanced',
          question: 'How do you reset consumer group offsets to re-process the last 24 hours of streaming data?',
          answer: 'Execute the command: kafka-consumer-groups.sh --bootstrap-server <broker:port> --group <group_name> --topic <topic_name> --reset-offsets --by-duration PT24H --execute. Note: all active consumers in that group must be temporarily stopped before executing the offset reset.'
        }
      ],
      assignment: {
        task: 'Execute bash /tmp/mock_lag_report.sh in terminal and identify which partition has the largest consumer lag backlog.',
        verificationCriteria: 'Run the command and observe that Partition 1 has a lag of 920 messages.'
      },
      assessment: {
        quiz: [
          {
            q: 'Under At-Least-Once processing semantics, when does the consumer commit its offset to Kafka?',
            options: [
              'Before reading the message',
              'Immediately upon receiving from socket, before processing',
              'Only AFTER the record has been fully processed and written to downstream storage',
              'Never'
            ],
            correct: 2,
            explanation: 'At-Least-Once commits offsets only after successful processing, ensuring messages are not lost if processing fails.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the consumer lag report script.',
          expectedCommand: 'bash /tmp/mock_lag_report.sh'
        }
      }
    },
    {
      id: 'm8-l7',
      title: 'Replication, ISR & Fault Tolerance',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Kafka provides enterprise fault tolerance through Partition Replication. When a topic is created with replication-factor = 3, each partition has 1 Leader replica and 2 Follower replicas distributed across different brokers. All producer writes and consumer reads are served exclusively by the Leader replica (unless follower fetching is enabled). Followers act like passive consumers: they fetch records from the leader and write them to their local disk logs. The In-Sync Replicas (ISR) list contains all replicas that are caught up with the leader. If the Leader broker crashes, Kafka automatically promotes one of the ISR followers to become the new Leader in milliseconds.',
        hi: 'Kafka me fault tolerance Partition Replication se aati hai. Agar replication factor 3 hai, toh har ek partition ka 1 Leader hota hai aur 2 Follower (backup) copies hoti hain jo alag-alag brokers par rehti hain. Saara read aur write Leader broker sambhalta hai. Follower brokers chup-chaap leader se data copy karte rehte hain. Jo followers leader ke sath barabari se synced hote hain, unhe "In-Sync Replicas" (ISR) kehte hain. Agar Leader broker achanak blast ho jaye, toh Kafka turant ISR me se kisi ek follower ko naya Leader bana deta hai — zero downtime!'
      },
      why: 'Hardware crashes are routine in enterprise cloud environments. Replication guarantees that even if 2 out of 3 Kafka brokers burn down simultaneously, zero data is lost and client applications experience zero interruption.',
      how: '1. Leader Election: Managed by the Controller Broker (via KRaft or ZooKeeper).\n2. Follower Fetch: Followers send FetchRequests to Leader; if follower falls behind for replica.lag.time.max.ms (default 30s), it is kicked out of ISR.\n3. Min In-Sync Replicas: min.insync.replicas = 2 ensures that producer acks=all requires at least 2 healthy replicas to acknowledge before committing.\n4. Unclean Leader Election: unclean.leader.election.enable = false (strictly forbids electing an out-of-sync replica, prioritizing data consistency over availability).',
      architecture: {
        type: 'kafka_replication_isr_model',
        title: 'Partition Leader and In-Sync Replicas (ISR)',
        nodes: [
          { name: 'Broker 101 (Leader)', desc: 'Accepts writes from Producer; serves reads; maintains ISR list' },
          { name: 'Broker 102 (ISR Follower)', desc: 'Caught up with Leader within 30s; eligible for instant promotion' },
          { name: 'Broker 103 (ISR Follower)', desc: 'Caught up with Leader; acknowledges write packets' },
          { name: 'Out-Of-Sync Replica', desc: 'Dropped from ISR if network latency exceeds replica.lag.time.max.ms' }
        ]
      },
      industryExample: 'Goldman Sachs and PayPal enforce min.insync.replicas=2 and acks=all across financial settlement topics to mathematically guarantee zero transaction loss during broker reboots.',
      practicalLab: {
        title: 'Lab 8.7: Inspecting ISR Health and Minimum In-Sync Replicas',
        problemStatement: 'Inspect topic partition replication, identify active leaders, and evaluate min.insync.replicas settings.',
        requirements: 'Terminal simulator.',
        setup: 'mkdir -p ~/bigdata_lab/m8_l7 && cd ~/bigdata_lab/m8_l7',
        instructions: [
          'Step 1: Check partition replica layout.',
          'Step 2: Understand the difference between Replicas and ISR.'
        ],
        code: `# isr_inspect_lab.sh
cat << 'EOF' > /tmp/mock_isr_status.sh
echo "Topic: payments_v1	Partition: 0	Leader: 101	Replicas: 101,102,103	Isr: 101,102,103"
echo "Topic: payments_v1	Partition: 1	Leader: 102	Replicas: 102,103,101	Isr: 102,103 (Broker 101 lagging)"
EOF
bash /tmp/mock_isr_status.sh
`,
        commands: [
          'bash /tmp/mock_isr_status.sh'
        ]
      },
      expectedOutput: `Topic: payments_v1	Partition: 0	Leader: 101	Replicas: 101,102,103	Isr: 101,102,103
Topic: payments_v1	Partition: 1	Leader: 102	Replicas: 102,103,101	Isr: 102,103 (Broker 101 lagging)`,
      troubleshooting: [
        {
          error: 'NOT_ENOUGH_REPLICAS error on Producer with acks=all',
          rootCause: 'The number of active In-Sync Replicas has dropped below the topic\'s min.insync.replicas threshold (e.g. min.insync.replicas=2, but only 1 broker is alive).',
          solution: 'Bring offline Kafka brokers back online or temporarily lower min.insync.replicas if availability is urgent.'
        }
      ],
      bestPractices: [
        'Always set replication.factor = 3 and min.insync.replicas = 2 for production topics; this allows 1 broker to fail without disrupting writes.',
        'Never enable unclean.leader.election.enable (keep it false); allowing out-of-sync followers to become leaders causes silent data loss.',
        'Spread replicas across distinct availability zones / server racks using broker.rack configuration.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is an In-Sync Replica (ISR) in Apache Kafka?',
          answer: 'An In-Sync Replica (ISR) is a follower replica that is actively fetching messages from the partition leader and is fully caught up within the time window defined by replica.lag.time.max.ms (default 30 seconds). Only replicas currently in the ISR list are eligible to be elected as the new leader if the current leader fails.'
        },
        {
          level: 'Intermediate',
          question: 'What happens if a producer sends a message with acks=all when min.insync.replicas=2, but 2 out of 3 brokers in the cluster are offline?',
          answer: 'The write will FAIL with a NotEnoughReplicasException. Because only 1 broker is alive, Kafka cannot satisfy the min.insync.replicas requirement of 2. Kafka deliberately rejects the write to prevent data loss, enforcing strong consistency over availability.'
        },
        {
          level: 'Advanced',
          question: 'What is "Unclean Leader Election" and why is it dangerous in production?',
          answer: 'If the partition leader crashes and ALL followers in the ISR list also crash or become unreachable, the only remaining brokers with copies of the partition are out-of-sync followers (missing data). If unclean.leader.election.enable is set to true, Kafka will elect an out-of-sync replica as the new leader. This restores availability, but permanently wipes all messages that were committed on the old leader but not replicated, corrupting data consistency.'
        }
      ],
      assignment: {
        task: 'Execute bash /tmp/mock_isr_status.sh in terminal and observe the difference between Replicas and active ISR.',
        verificationCriteria: 'Run the command and observe the output.'
      },
      assessment: {
        quiz: [
          {
            q: 'If a topic has replication factor 3 and min.insync.replicas = 2, how many broker failures can the cluster tolerate while still accepting producer writes with acks=all?',
            options: ['0 broker failures', '1 broker failure', '2 broker failures', '3 broker failures'],
            correct: 1,
            explanation: 'With 3 replicas and min.insync.replicas = 2, losing 1 broker leaves 2 active replicas, allowing writes to succeed.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the ISR status inspection script.',
          expectedCommand: 'bash /tmp/mock_isr_status.sh'
        }
      }
    },
    {
      id: 'm8-l8',
      title: 'Real-Time Streaming Pipelines (Kafka to Spark / Storage)',
      duration: '60 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'This capstone lesson integrates Apache Kafka into an end-to-end Real-Time Streaming Pipeline. A continuous event producer generates live financial payment events. Events are published to a partitioned Kafka topic (payment-transactions) with acks=all. A downstream Spark Structured Streaming engine reads the stream continuously from Kafka (readStream.format("kafka")), deserializes JSON payloads, performs streaming watermark deduplication, calculates rolling window metrics (tumbling 1-minute aggregations), and writes clean micro-batches out to distributed HDFS/S3 storage while monitoring consumer lag.',
        hi: 'Ye Module 8 ka comprehensive capstone lesson hai jisme hum ek real-time streaming pipeline banate hain: 1. Python Producer live payment events generate karke Kafka topic (payment-transactions) me daalta hai; 2. Spark Structured Streaming real-time me Kafka se stream read karta hai (readStream.format("kafka")); 3. Data ko deserialize karke 1-minute tumbling window me aggregate karta hai; 4. Final clean output ko HDFS storage me commit karta hai. Ye bilkul ek live enterprise banking streaming pipeline ki tarah execute hota hai.'
      },
      why: 'Real-time analytics powers modern digital business: fraud detection must block fraudulent transactions in milliseconds, not hours later in a nightly batch run.',
      how: '1. Producer: Continuous loop streaming JSON records to Kafka.\n2. Spark Structured Streaming:\n   df = spark.readStream.format("kafka").option("kafka.bootstrap.servers", "localhost:9092").option("subscribe", "payment-transactions").load()\n3. Parsing: df.select(from_json(col("value").cast("string"), schema).alias("data"))\n4. Windowing: .groupBy(window(col("timestamp"), "1 minute"), col("status")).count()\n5. Checkpointing & Sink: .writeStream.format("parquet").option("checkpointLocation", "/chk").start("/data/gold").',
      architecture: {
        type: 'kafka_spark_streaming_pipeline',
        title: 'End-to-End Real-Time Event Streaming Pipeline',
        nodes: [
          { name: '1. Live Event Generator', desc: 'Continuous Python producer publishing payment JSON stream' },
          { name: '2. Kafka Topic (3 Partitions)', desc: 'High-throughput append-only distributed commit log (acks=all)' },
          { name: '3. Spark Structured Streaming', desc: 'Micro-batch engine: schema parsing, watermarking, rolling window aggregation' },
          { name: '4. HDFS Data Lake & Sink', desc: 'Parquet sink with write-ahead log (WAL) checkpointing for exactly-once guarantees' }
        ]
      },
      industryExample: 'Mastercard and Visa stream hundreds of thousands of credit card authorizations per second through Kafka clusters into streaming engines to detect card skimming within 50 milliseconds.',
      practicalLab: {
        title: 'Lab 8.8: Executing an End-to-End Kafka Streaming Pipeline Simulation',
        problemStatement: 'Simulate a real-time event generator, stream records through a Kafka buffer, and execute a streaming window aggregator.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m8_l8 && cd ~/bigdata_lab/m8_l8',
        instructions: [
          'Step 1: Write an end-to-end streaming pipeline script.',
          'Step 2: Run using python3.',
          'Step 3: Review the real-time window aggregation output.'
        ],
        code: `# kafka_streaming_pipeline.py
import json, time

# 1. Simulate Kafka Broker & Topic
class MockKafkaBroker:
    def __init__(self):
        self.topic = []

    def produce(self, event):
        offset = len(self.topic)
        self.topic.append((offset, event))
        return offset

    def consume_stream(self):
        for offset, event in self.topic:
            yield offset, event

broker = MockKafkaBroker()

# 2. Produce 5 Streaming Payment Events
events = [
    {"txn_id": "TXN_01", "user": "Aarav", "amount": 500.0, "status": "APPROVED"},
    {"txn_id": "TXN_02", "user": "Diya", "amount": 1250.0, "status": "APPROVED"},
    {"txn_id": "TXN_03", "user": "Rohan", "amount": 95.0, "status": "DECLINED"},
    {"txn_id": "TXN_04", "user": "Priya", "amount": 3200.0, "status": "APPROVED"},
    {"txn_id": "TXN_05", "user": "Kabir", "amount": 80.0, "status": "DECLINED"}
]

print("=== 1. Producer Streaming Events to Kafka ===")
for e in events:
    off = broker.produce(e)
    print(f" [PRODUCED] Offset {off} -> {e['txn_id']} | User: {e['user']} | \${e['amount']}")

# 3. Simulate Spark Structured Streaming Ingestion & Aggregation
print("\\n=== 2. Spark Structured Streaming Ingest & Window Aggregation ===")
approved_total = 0.0
declined_count = 0
approved_count = 0

for offset, record in broker.consume_stream():
    if record["status"] == "APPROVED":
        approved_total += record["amount"]
        approved_count += 1
    else:
        declined_count += 1

print(f"Stream Micro-Batch Processed:")
print(f" - Total Approved Transactions: {approved_count} (\${approved_total:,.2f})")
print(f" - Total Declined Transactions: {declined_count}")
print(f" - All offsets committed to __consumer_offsets.")
`,
        commands: [
          'python3 kafka_streaming_pipeline.py'
        ]
      },
      expectedOutput: `=== 1. Producer Streaming Events to Kafka ===
 [PRODUCED] Offset 0 -> TXN_01 | User: Aarav | $500.0
 [PRODUCED] Offset 1 -> TXN_02 | User: Diya | $1250.0
 [PRODUCED] Offset 2 -> TXN_03 | User: Rohan | $95.0
 [PRODUCED] Offset 3 -> TXN_04 | User: Priya | $3200.0
 [PRODUCED] Offset 4 -> TXN_05 | User: Kabir | $80.0

=== 2. Spark Structured Streaming Ingest & Window Aggregation ===
Stream Micro-Batch Processed:
 - Total Approved Transactions: 3 ($4,950.00)
 - Total Declined Transactions: 2
 - All offsets committed to __consumer_offsets.`,
      troubleshooting: [
        {
          error: 'Streaming query fails with java.lang.AssertionError: assertion failed: Expected e.g. 5 offsets, got 2',
          rootCause: 'Data loss in Kafka: topic retention deleted messages from under the consumer before the streaming checkpoint could process them.',
          solution: 'Increase log.retention.hours on Kafka topic or reset checkpoint directory to reprocess from latest offset.'
        }
      ],
      bestPractices: [
        'Always specify a persistent checkpoint directory (.option("checkpointLocation", "/path")) in Spark Structured Streaming for exactly-once recovery.',
        'Apply Watermarking (withWatermark("timestamp", "10 minutes")) to allow Spark to discard late-arriving state and prevent memory leaks.',
        'Use write-ahead logs (WAL) to ensure zero data loss across worker failures.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is Spark Structured Streaming and how does it integrate with Apache Kafka?',
          answer: 'Spark Structured Streaming is a scalable and fault-tolerant stream processing engine built on top of the Spark SQL engine. It models live streaming data as an unboundedly growing table. It integrates natively with Kafka using readStream.format("kafka"), continuously polling offsets, executing DataFrame transformations, and tracking progress via checkpointing.'
        },
        {
          level: 'Intermediate',
          question: 'What is a "Watermark" in streaming data processing and why is it necessary?',
          answer: 'In real-time streaming, events can arrive out of order or delayed due to network lags. A Watermark (e.g. withWatermark("event_time", "10 minutes")) establishes a moving time threshold: it tells the streaming engine how long to wait for late-arriving data. Once the watermark moves past an event\'s timestamp, that event is dropped and intermediate state for that window is cleaned up from memory, preventing memory leaks.'
        },
        {
          level: 'Advanced',
          question: 'How do Apache Kafka and Spark Structured Streaming together achieve End-to-End Exactly-Once Processing (EOS)?',
          answer: 'EOS requires three guarantees working in unison: 1. Source: Replayability via Kafka offsets. 2. Compute: Deterministic, stateful transformation processing with Write-Ahead Log (WAL) Checkpointing in Spark. 3. Sink: An idempotent or transactional sink (e.g. Delta Lake ACID transactions or database UPSERT). If a failure occurs, Spark reloads the exact committed offsets from its checkpoint directory and replays the micro-batch into the idempotent sink with zero duplicate side-effects.'
        }
      ],
      assignment: {
        task: 'Execute python3 kafka_streaming_pipeline.py in terminal and verify the 3 approved and 2 declined transactions.',
        verificationCriteria: 'Run the command and observe the approved total $4,950.00.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which mechanism in Spark Structured Streaming prevents state store memory exhaustion by defining how long to retain late-arriving data?',
            options: ['Watermarking', 'Checkpointing', 'Broadcast Join', 'RDD Lineage'],
            correct: 0,
            explanation: 'Watermarking allows the streaming engine to bound late data arrival and clean up old window state from memory.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the Kafka real-time streaming pipeline script.',
          expectedCommand: 'python3 kafka_streaming_pipeline.py'
        }
      }
    }
  ]
};

