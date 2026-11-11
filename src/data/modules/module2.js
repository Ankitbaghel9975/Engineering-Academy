// Module 2: HDFS (Hadoop Distributed File System)
// Technical Reference: Apache Hadoop HdfsDesign official documentation
export const module2 = {
  id: 'mod-2',
  title: 'Module 2: HDFS (Hadoop Distributed File System)',
  description: 'Deep dive into Apache HDFS internal architecture, block storage, rack awareness, High Availability (HA), and federation.',
  badge: 'Storage Core',
  icon: 'HardDrive',
  lessons: [
    {
      id: 'm2-l1',
      title: 'HDFS Architecture',
      duration: '50 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'The Hadoop Distributed File System (HDFS) is a distributed, user-space filesystem designed according to the Apache Hadoop HDFS Design specification to run on commodity hardware. HDFS is highly fault-tolerant and is engineered to store very large files (gigabytes to terabytes or petabytes) with streaming data access patterns, adhering to a "Write-Once, Read-Many" (WORM) access model. It relaxes POSIX requirements to enable high data throughput rates. HDFS exposes a traditional hierarchical file organization where users create directories and files.',
        hi: 'HDFS (Hadoop Distributed File System) Apache Hadoop ka storage foundation hai jo saste hardware par petabyte-scale data store karne ke liye banaya gaya hai. HDFS ka main principle hai "Write-Once, Read-Many" (WORM) — matlab file ek baar likhi jaati hai aur fir uspar append ya hazaron baar streaming read kiya jaata hai, random modification nahi hota. HDFS traditional POSIX rules ko todkar high throughput data streaming par focus karta hai. Ye file ko chhote-chhote blocks me tod kar alag-alag DataNodes par store karta hai.'
      },
      why: 'Enterprises need to store petabytes of data reliably without purchasing expensive enterprise SAN arrays. HDFS provides horizontal scalability to tens of petabytes across thousands of nodes while automatically detecting and recovering from hardware failures without human intervention.',
      how: '1. Master-Worker topology: One NameNode acts as master, managing filesystem namespace and metadata.\n2. Workers: A cluster of DataNodes stores the actual data blocks on local physical drives.\n3. File Splitting: A file is broken into contiguous sequence of blocks (default 128 MB).\n4. Replication: Blocks are replicated across multiple DataNodes (default replication factor = 3).\n5. Metadata in RAM: NameNode maintains the entire directory tree and block location mapping in main memory for microsecond responses.',
      architecture: {
        type: 'hdfs_master_worker',
        title: 'Official Apache HDFS Design Architecture',
        nodes: [
          { name: 'NameNode (Master)', desc: 'Manages namespace tree, metadata in RAM, logs transactions in EditLog, maps blocks to DataNodes' },
          { name: 'DataNode 1 (Rack 1)', desc: 'Stores block blk_101, blk_102 on local ext4/xfs drive, sends heartbeats & block reports' },
          { name: 'DataNode 2 (Rack 1)', desc: 'Stores replicas blk_101, blk_103 on local disk' },
          { name: 'DataNode 3 (Rack 2)', desc: 'Stores replica blk_102, blk_103 on off-rack server' }
        ]
      },
      industryExample: 'eBay runs one of the world\'s largest HDFS clusters with over 150,000 nodes holding more than 500 Petabytes of e-commerce catalog, search signals, and buyer behavioral data.',
      practicalLab: {
        title: 'Lab 2.1: Navigating the HDFS Filesystem via CLI',
        problemStatement: 'Create directories in HDFS, upload a file, list contents, and inspect HDFS cluster storage status.',
        requirements: 'HDFS CLI or academy interactive emulator.',
        setup: 'hdfs dfs -mkdir -p /user/academy/data',
        instructions: [
          'Step 1: Check root directory structure with hdfs dfs -ls /.',
          'Step 2: Create a production data directory /data/warehouse.',
          'Step 3: Run hdfs dfsadmin -report to inspect cluster health.'
        ],
        code: `# hdfs_basics.sh
hdfs dfs -mkdir -p /data/warehouse
echo "id,product,price" > /tmp/sample.csv
echo "1,Laptop,1200" >> /tmp/sample.csv
hdfs dfs -put /tmp/sample.csv /data/warehouse/
hdfs dfs -ls /data/warehouse
`,
        commands: [
          'hdfs dfs -ls /',
          'hdfs dfs -mkdir -p /data/warehouse',
          'hdfs dfsadmin -report'
        ]
      },
      expectedOutput: `Found 2 items
drwxr-xr-x   - hadoop supergroup          0 2026-11-11 14:40 /data
drwxr-xr-x   - hadoop supergroup          0 2026-11-11 14:40 /user
Configured Capacity: 107374182400 (100 GB)
Present Capacity: 96636764160 (90 GB)
DFS Remaining: 85899345920 (80 GB)
DFS Used: 10737418240 (10 GB)
DFS Used%: 10.00%
Under replicated blocks: 0
Blocks with corrupt replicas: 0
Missing blocks: 0
Live datanodes (3):`,
      troubleshooting: [
        {
          error: 'Call From edge-node to master-nn:9000 failed on connection exception: Connection refused',
          rootCause: 'NameNode service is not running on master host or port 9000 is blocked by iptables/ufw firewall.',
          solution: 'Verify NameNode process with jps on master node. Check port binding using netstat -tulnp | grep 9000. Start NameNode via hdfs --daemon start namenode.'
        }
      ],
      bestPractices: [
        'Always access HDFS using URI schemes or standard environment configs rather than hardcoding IP addresses.',
        'Never run small files (<10 MB) directly into HDFS in bulk; merge them into SequenceFiles or Har (Hadoop Archives).',
        'Configure dfs.replication default to 3 in production hdfs-site.xml.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the role of NameNode and DataNode in HDFS architecture?',
          answer: 'NameNode is the master node responsible for managing the filesystem namespace, directory hierarchy, and the mapping of file blocks to DataNodes. DataNodes are worker nodes that physically store the file blocks on their local drives and perform read/write requests from clients under the direction of the NameNode.'
        },
        {
          level: 'Intermediate',
          question: 'Why does HDFS follow the "Write-Once, Read-Many" (WORM) design pattern?',
          answer: 'WORM simplifies data coherency and synchronization in distributed systems. By disallowing random in-place updates and only permitting file appends, HDFS avoids complex distributed record locking mechanisms, allowing blazing fast streaming reads and massive throughput for MapReduce and Spark.'
        },
        {
          level: 'Advanced',
          question: 'How much memory does NameNode require per file and block metadata?',
          answer: 'Each file inode and each block object in HDFS requires approximately 150 bytes of RAM on the NameNode. Therefore, 100 million blocks take ~30 GB of JVM heap memory. This is why having billions of tiny files crashes NameNode with OutOfMemoryError, which is known as the "Hadoop Small Files Problem".'
        }
      ],
      assignment: {
        task: 'Execute hdfs dfs -ls / and create the directory /data/warehouse using the interactive terminal emulator.',
        verificationCriteria: 'Run hdfs dfs -mkdir -p /data/warehouse and verify with hdfs dfs -ls /.'
      },
      assessment: {
        quiz: [
          {
            q: 'In the official Apache HDFS architecture, where does the NameNode store filesystem metadata for high-speed lookups?',
            options: ['On local ext4 disk only', 'In an external MySQL database', 'Entirely in main memory (RAM)', 'On remote tape drives'],
            correct: 2,
            explanation: 'The NameNode keeps the entire filesystem namespace and block locations in RAM to provide microsecond response times.'
          }
        ],
        commandChallenge: {
          prompt: 'List the root directory of HDFS.',
          expectedCommand: 'hdfs dfs -ls /'
        }
      }
    },
    {
      id: 'm2-l2',
      title: 'NameNode and DataNode',
      duration: '45 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'The NameNode is the master server that coordinates all storage operations. It maintains the namespace tree (directory structure, permissions, ownership) and the block-to-DataNode location map in memory. The NameNode never handles raw data streams itself; clients talk directly to DataNodes for read/write I/O. DataNodes are the workhorses: they store data blocks as plain files in their underlying local OS filesystems (e.g. /data/hdfs/current/BP-xxx/blk_xxx) and periodically report their block inventories back to the NameNode.',
        hi: 'NameNode poore HDFS ka Master Commander hai. Ye RAM me poori directory structure aur ye record rakhta hai ki kaun si file ka kaun sa block kis DataNode ki hard drive par pada hai. Lekin NameNode khud kabhi data transfer nahi karta — client direct DataNodes se data read/write karta hai. DataNodes saste worker machines hote hain jo actually hard drive me blocks ko physical files ki tarah save karte hain aur har 3 second me NameNode ko "Main zinda hoon" ka Heartbeat bhejte hain.'
      },
      why: 'Separating metadata management (NameNode) from data I/O (DataNodes) prevents the master node from becoming a network bottleneck. If NameNode routed all actual bytes, a cluster would saturate its network cards on the first 10 GB file transfer.',
      how: '1. Client requests file creation: NameNode validates permissions and allocates block IDs.\n2. NameNode returns an ordered list of DataNodes closest to the client based on rack awareness.\n3. Client streams data directly into the first DataNode in the pipeline.\n4. DataNodes verify block checksums upon receipt and write to local disk.\n5. DataNodes send Heartbeats (every 3s) and Block Reports (every 6h) to NameNode.',
      architecture: {
        type: 'namenode_datanode_interaction',
        title: 'NameNode Metadata vs DataNode Storage Split',
        nodes: [
          { name: 'Client Request', desc: 'Requests block location list from NameNode (Metadata only)' },
          { name: 'NameNode RAM', desc: 'Resolves /finance/q3.csv -> blk_101 @ [DN1, DN3, DN5]' },
          { name: 'Data Pipeline', desc: 'Client streams 128MB directly to DN1 -> DN3 -> DN5 (Zero Master network load)' }
        ]
      },
      industryExample: 'At Uber, NameNodes manage metadata for hundreds of millions of blocks representing geospatial ride traces, while tens of thousands of DataNodes stream 100+ Terabytes of telemetry data every minute.',
      practicalLab: {
        title: 'Lab 2.2: Inspecting DataNode Status and Disk Utilization',
        problemStatement: 'Inspect individual DataNode health, dead vs live status, and block counts using hdfs dfsadmin.',
        requirements: 'Terminal simulator with hdfs dfsadmin command.',
        setup: 'hdfs dfsadmin -report -live',
        instructions: [
          'Step 1: Check live DataNode inventory using hdfs dfsadmin -report -live.',
          'Step 2: Note the rack assignment, configured capacity, and DFS used.'
        ],
        code: `# datanode_check.sh
hdfs dfsadmin -report -live
`,
        commands: [
          'hdfs dfsadmin -report -live'
        ]
      },
      expectedOutput: `Live datanodes (3):

Name: 192.168.1.101:9866 (worker-01.internal)
Hostname: worker-01.internal
Decommission Status : Normal
Configured Capacity: 21474836480 (20 GB)
DFS Used: 2147483648 (2 GB)
Non DFS Used: 1073741824 (1 GB)
DFS Remaining: 18253611008 (17 GB)
DFS Used%: 10.00%
DFS Remaining%: 85.00%
Configured Cache Capacity: 0 (0 B)
DFS Cache Used: 0 (0 B)
Cache Remaining: 0 (0 B)
Cache Used%: 100.00%
Num of Blocks: 16
Last contact: Wed Nov 11 14:42:01 IST 2026
Num of Volumes: 2`,
      troubleshooting: [
        {
          error: 'DataNode exits immediately with Incompatible clusterIDs error in datanode.log',
          rootCause: 'NameNode was re-formatted without clearing the old VERSION files from DataNode data directories (dfs.datanode.data.dir).',
          solution: 'Never format NameNode blindly. If resetting cluster, stop all nodes, clear DataNode data directories, and re-format.'
        }
      ],
      bestPractices: [
        'Allocate enterprise-grade NVMe or high-capacity ECC RAM to NameNodes (e.g. 128GB - 512GB RAM).',
        'Mount multiple JBOD (Just a Bunch of Disks) on DataNodes without RAID, letting HDFS handle replication natively across disks.',
        'Configure dfs.datanode.du.reserved (e.g. 10 GB) so local OS logs never fill the disk and crash the DataNode.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'Does the NameNode store actual file contents?',
          answer: 'No. The NameNode never stores file data. It only stores filesystem metadata (directory structure, permissions, and the list of blocks and their locations). File data blocks are stored exclusively on the DataNodes.'
        },
        {
          level: 'Intermediate',
          question: 'Why does HDFS use JBOD (Just a Bunch of Disks) instead of hardware RAID for DataNodes?',
          answer: 'HDFS provides software-level fault tolerance through 3x replication across different machines and racks. Hardware RAID adds expensive controller overhead, slows down sequential read/write throughput, and wastes capacity. With JBOD, if a disk fails, only the blocks on that single drive are lost and HDFS automatically re-replicates them to other disks in the cluster without taking the DataNode offline.'
        },
        {
          level: 'Advanced',
          question: 'What happens when a DataNode runs out of disk space?',
          answer: 'DataNode marks the exhausted volume as read-only. In its regular heartbeat, it reports DFS Remaining as 0 to the NameNode. The NameNode stops assigning new block writes to that DataNode, but continues directing client read requests for existing blocks on that node until the HDFS Balancer redistributes blocks to emptier nodes.'
        }
      ],
      assignment: {
        task: 'Execute hdfs dfsadmin -report -live to inspect the health and storage stats of live DataNodes.',
        verificationCriteria: 'Run hdfs dfsadmin -report -live and inspect configured capacity.'
      },
      assessment: {
        quiz: [
          {
            q: 'If a client wants to read a 1 GB file from HDFS, what does the NameNode send to the client?',
            options: [
              'The entire 1 GB file data over the network',
              'A list of block IDs and the network addresses of DataNodes hosting those blocks',
              'An SQL connection string',
              'A compressed zip archive'
            ],
            correct: 1,
            explanation: 'NameNode returns metadata: the block IDs and the DataNode addresses hosting each block, allowing the client to read directly from DataNodes.'
          }
        ],
        commandChallenge: {
          prompt: 'Generate an administrative health report of live DataNodes.',
          expectedCommand: 'hdfs dfsadmin -report -live'
        }
      }
    },
    {
      id: 'm2-l3',
      title: 'Blocks and Block Size',
      duration: '45 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'In HDFS, a block is the fundamental minimum unit of data storage. Unlike traditional OS filesystems where block size is 4 KB or 8 KB, HDFS default block size is 128 MB (in Hadoop 2.x and 3.x; 64 MB in Hadoop 1.x). A 500 MB file in HDFS is automatically split into three 128 MB blocks and one 116 MB block. Crucially, HDFS does NOT waste storage: a 5 MB file stored in a 128 MB block only consumes 5 MB of physical disk space on the DataNode, not 128 MB.',
        hi: 'HDFS me block data storage ki sabse basic unit hoti hai. Normal Windows ya Linux me block size 4 KB hota hai, lekin HDFS me default block size 128 MB (ya 256 MB) hota hai! Agar aap 500 MB ki file upload karte ho, toh HDFS use teen 128 MB ke blocks aur ek 116 MB ke block me baant deta hai. Sabse zaroori baat: agar aap 5 MB ki file upload karoge toh wo disk par sirf 5 MB hi space legi, 128 MB nahi legi!'
      },
      why: 'Why is HDFS block size so large (128 MB vs 4 KB)? Disk seek time takes approximately 10ms. If block size were small (e.g. 64 KB), disk read heads would spend more time physically moving (seeking) than transferring data. With 128 MB, seek time is less than 1% of total transfer time, ensuring near 99% disk transfer throughput.',
      how: '1. File Split: A large incoming file stream is sliced into chunks of dfs.blocksize (default 134217728 bytes = 128 MB).\n2. Block Naming: Each block gets a globally unique 64-bit integer ID: blk_<id> (e.g. blk_1073741825).\n3. Checksum: HDFS computes a CRC-32 checksum for every 512 bytes of data (dfs.bytes-per-checksum).\n4. Storage on Local FS: DataNode creates two files on its Linux disk: the raw block file blk_xxx and its metadata checksum file blk_xxx.meta.',
      architecture: {
        type: 'hdfs_block_split',
        title: 'File Decomposition into 128MB HDFS Blocks',
        nodes: [
          { name: 'Input File (300 MB)', desc: 'Divided into Block 1 (128 MB), Block 2 (128 MB), Block 3 (44 MB)' },
          { name: 'Block 1 (128 MB)', desc: 'blk_1001 stored on DN1, DN2, DN4 with CRC-32 checksum' },
          { name: 'Block 2 (128 MB)', desc: 'blk_1002 stored on DN2, DN3, DN5' },
          { name: 'Block 3 (44 MB)', desc: 'blk_1003 stored on DN1, DN3, DN4 (Consumes exactly 44MB disk)' }
        ]
      },
      industryExample: 'Petabyte-scale data lakes at Pinterest configure block size to 256 MB or 512 MB for massive image engagement logs, cutting NameNode metadata memory footprint by 50% compared to 128 MB blocks.',
      practicalLab: {
        title: 'Lab 2.3: Inspecting File Blocks and Configuring Block Sizes',
        problemStatement: 'Upload a file with custom 64MB and 128MB block sizes and inspect its block allocation using hdfs fsck.',
        requirements: 'HDFS CLI emulator.',
        setup: 'hdfs dfs -mkdir -p /data/blocks_lab',
        instructions: [
          'Step 1: Upload a file specifying a custom block size using -Ddfs.blocksize=67108864 (64MB).',
          'Step 2: Run hdfs fsck to inspect the block distribution, block IDs, and replica counts.'
        ],
        code: `# block_lab.sh
hdfs dfs -Ddfs.blocksize=67108864 -put /tmp/sample.csv /data/blocks_lab/sample_64mb.csv
hdfs fsck /data/blocks_lab/sample_64mb.csv -files -blocks -locations
`,
        commands: [
          'hdfs fsck /data/warehouse -files -blocks',
          'hdfs dfs -stat "Block size: %o, File size: %b bytes" /data/warehouse/sample.csv'
        ]
      },
      expectedOutput: `Connecting to namenode via default filesystem
FSCK started by hadoop (auth:SIMPLE) from /127.0.0.1 for path /data/warehouse
/data/warehouse <dir>
/data/warehouse/sample.csv 24 bytes, 1 block(s):  OK
0. BP-10293847-127.0.0.1-1731315000:blk_1073741825_1001 len=24 Live_repl=3

Status: HEALTHY
 Number of data-nodes: 3
 Number of racks: 2
 Total blocks (validated): 1 (avg. block size 24 B)
 Minimally replicated blocks: 1 (100.0 %)
 Over-replicated blocks: 0 (0.0 %)
 Under-replicated blocks: 0 (0.0 %)
 Mis-replicated blocks: 0 (0.0 %)
 Default replication factor: 3
 Average block replication: 3.0
 Corrupt blocks: 0
 Missing replicas: 0 (0.0 %)
FSCK ended at Wed Nov 11 14:45:00 IST 2026 in 12 ms
Block size: 134217728, File size: 24 bytes`,
      troubleshooting: [
        {
          error: 'NameNode high garbage collection (GC) pauses causing cluster freeze',
          rootCause: 'Having millions of tiny files (<1 MB) consuming identical 150-byte metadata slots in NameNode RAM.',
          solution: 'Increase default block size to 128MB/256MB. Run compacting ETL jobs to merge small files into larger Parquet/ORC partitions.'
        }
      ],
      bestPractices: [
        'Use default 128 MB block size for general datasets; consider 256 MB for files larger than 10 GB.',
        'Never store files smaller than a few megabytes directly in HDFS; batch or consolidate them first.',
        'Always check filesystem integrity with hdfs fsck before and after cluster maintenance.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the default block size in HDFS 2.x/3.x, and if a file is 20 MB, how much disk space is consumed?',
          answer: 'The default block size is 128 MB (134,217,728 bytes). If a 20 MB file is stored, it consumes only 20 MB of disk space (plus its replicas: 20 MB * 3 = 60 MB total disk space). HDFS does not pad or waste disk space.'
        },
        {
          level: 'Intermediate',
          question: 'Why is HDFS block size configured so large compared to standard OS block sizes (4 KB)?',
          answer: 'To minimize disk seek overhead. Disk seek takes ~10ms. If block size is 128 MB and transfer speed is 100 MB/s, transfer time is ~1.28 seconds. The seek time is less than 1% of total transfer time, ensuring the disk spends over 99% of its time streaming data.'
        },
        {
          level: 'Advanced',
          question: 'Can different files in the same HDFS cluster have different block sizes and replication factors?',
          answer: 'Yes! While dfs.blocksize and dfs.replication in hdfs-site.xml define cluster-wide defaults, both parameters can be overridden on a per-file basis during upload using hadoop fs -Ddfs.blocksize=... -put or dynamically updated via hadoop fs -setrep.'
        }
      ],
      assignment: {
        task: 'Run hdfs fsck on /data/warehouse to inspect blocks, replication health, and average block sizes.',
        verificationCriteria: 'Run hdfs fsck /data/warehouse -files -blocks and verify Status: HEALTHY.'
      },
      assessment: {
        quiz: [
          {
            q: 'If a 250 MB file is uploaded into an HDFS cluster with default 128 MB block size, how many blocks are created?',
            options: ['1 block', '2 blocks (128 MB and 122 MB)', '3 blocks', '250 blocks'],
            correct: 1,
            explanation: '250 MB is divided into one full 128 MB block and one remaining 122 MB block.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect filesystem blocks and health for /data/warehouse using hdfs fsck.',
          expectedCommand: 'hdfs fsck /data/warehouse -files -blocks'
        }
      }
    },
    {
      id: 'm2-l4',
      title: 'Replication Factor',
      duration: '40 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'The Replication Factor in HDFS determines how many copies of each block are maintained across different physical machines in the cluster. The default replication factor is 3 (dfs.replication = 3). This means for every 128 MB block of a file, HDFS automatically stores 3 identical replicas on 3 different DataNodes. If any 2 DataNodes crash simultaneously, zero data is lost. Furthermore, replication allows multiple client tasks to read the same block concurrently from different nodes, increasing read throughput.',
        hi: 'Replication Factor ka matlab hai ki HDFS har ek block ki kitni duplicate copies alag-alag machines par rakhega. HDFS ka default replication factor 3 hota hai. Agar aapki file ka ek 128 MB ka block hai, toh HDFS use 3 alag-alag DataNodes par store karega. Agar do computer achanak blast ho jayein ya unki hard drive crash ho jaye, tab bhi teesri copy se data 100% safe rahega aur cluster seamlessly chalta rahega!'
      },
      why: 'Hardware failures in clusters of thousands of commodity machines are not an exception — they are a daily certainty. Hard drives fail, network cables get pulled, power supplies blow out. Automatic replication guarantees 99.999% data availability without human operations having to restore from tape backups.',
      how: '1. Pipeline Write: Client streams data to DataNode A, which forwards packets to DataNode B, which forwards to DataNode C in a pipelined fashion.\n2. Continuous Verification: NameNode tracks replica counts in memory.\n3. Failure Detection: If a DataNode stops heartbeating, NameNode flags its blocks as Under-Replicated.\n4. Automatic Re-replication: NameNode commands healthy DataNodes to copy the missing replicas to other active nodes until replication factor = 3 is restored.',
      architecture: {
        type: 'replication_pipeline',
        title: 'Block Replication Pipeline across 3 DataNodes',
        nodes: [
          { name: 'Client Write Pipeline', desc: 'Client streams 64KB packets to DN1' },
          { name: 'DN1 (Rack 1)', desc: 'Writes packet to local disk and streams to DN2' },
          { name: 'DN2 (Rack 2)', desc: 'Writes packet and streams to DN3' },
          { name: 'DN3 (Rack 2)', desc: 'Sends ACK back down pipeline: DN3 -> DN2 -> DN1 -> Client' }
        ]
      },
      industryExample: 'Financial institutions set replication factor = 4 or 5 for critical regulatory audit ledgers, while setting replication factor = 2 for temporary intermediate scratch files to conserve Petabytes of disk.',
      practicalLab: {
        title: 'Lab 2.4: Changing File Replication Dynamically',
        problemStatement: 'Upload a file with replication factor 3, dynamically decrease it to 2 to save disk space, and verify with hdfs fsck.',
        requirements: 'HDFS CLI emulator.',
        setup: 'hdfs dfs -mkdir -p /data/rep_lab',
        instructions: [
          'Step 1: Check existing replication factor of /data/warehouse/sample.csv.',
          'Step 2: Change replication factor dynamically using hdfs dfs -setrep -w 2.',
          'Step 3: Verify the new replication status.'
        ],
        code: `# replication_lab.sh
hdfs dfs -setrep -w 2 /data/warehouse/sample.csv
hdfs dfs -ls /data/warehouse/sample.csv
`,
        commands: [
          'hdfs dfs -setrep -w 2 /data/warehouse/sample.csv',
          'hdfs dfs -ls /data/warehouse/sample.csv'
        ]
      },
      expectedOutput: `Replication 2 set: /data/warehouse/sample.csv
Waiting for /data/warehouse/sample.csv ... done
-rw-r--r--   2 hadoop supergroup         24 2026-11-11 14:40 /data/warehouse/sample.csv`,
      troubleshooting: [
        {
          error: 'hdfs dfsadmin -report displays: Under-replicated blocks: 580',
          rootCause: 'One or more DataNodes were powered off or disconnected from the network.',
          solution: 'Inspect dead datanodes with hdfs dfsadmin -report -dead. If nodes cannot be recovered, HDFS will auto-replicate up to dfs.replication over time, or trigger hdfs balancer.'
        }
      ],
      bestPractices: [
        'Use dfs.replication = 3 for standard production data; this balances fault tolerance with 200% storage overhead.',
        'For cold historical archival data in Hadoop 3.x, use HDFS Erasure Coding (e.g. RS-6-3) instead of 3x replication to cut storage overhead from 200% down to 50%.',
        'Use -w flag with hdfs dfs -setrep to wait until the replication change physically finishes across the cluster.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the default replication factor in HDFS, and can it be changed for an existing file?',
          answer: 'The default replication factor is 3. Yes, it can be dynamically modified at any time without deleting or re-uploading the file using the command: hdfs dfs -setrep -w <new_factor> <file_path>.'
        },
        {
          level: 'Intermediate',
          question: 'What are Under-Replicated Blocks and Over-Replicated Blocks?',
          answer: 'Under-replicated blocks are blocks whose current live replica count is lower than their configured replication factor (e.g. 2 replicas exist instead of 3 because a DataNode crashed). Over-replicated blocks have more replicas than needed (e.g. 4 instead of 3, often because a previously dead DataNode came back online). NameNode automatically cleans up over-replicated blocks.'
        },
        {
          level: 'Advanced',
          question: 'How does HDFS Erasure Coding (EC) in Hadoop 3.x compare to traditional 3x replication?',
          answer: 'Traditional 3x replication has a 200% storage overhead (1 TB data requires 3 TB disk). Erasure Coding uses Reed-Solomon algorithms (like RS-6-3: 6 data cells + 3 parity cells). It can tolerate 3 concurrent node failures while having only a 50% storage overhead (1 TB data requires only 1.5 TB disk), saving 50% of raw hardware costs for cold datasets.'
        }
      ],
      assignment: {
        task: 'Set replication factor of /data/warehouse/sample.csv to 2 using -setrep -w 2 and verify with hdfs dfs -ls.',
        verificationCriteria: 'Run hdfs dfs -setrep -w 2 /data/warehouse/sample.csv and confirm replication column is 2.'
      },
      assessment: {
        quiz: [
          {
            q: 'If a 100 GB file has a replication factor of 3 in HDFS, how much total physical cluster disk space is consumed?',
            options: ['100 GB', '200 GB', '300 GB', '900 GB'],
            correct: 2,
            explanation: '100 GB * 3 copies = 300 GB total raw disk space consumed across the DataNodes.'
          }
        ],
        commandChallenge: {
          prompt: 'Change the replication factor of /data/warehouse/sample.csv to 2 and wait for completion.',
          expectedCommand: 'hdfs dfs -setrep -w 2 /data/warehouse/sample.csv'
        }
      }
    },
    {
      id: 'm2-l5',
      title: 'Rack Awareness',
      duration: '50 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Rack Awareness is the official Apache HDFS block placement policy that intelligently places block replicas across different physical server racks in a data center. If all 3 replicas were placed on machines in the same rack, a failure of that single rack\'s Top-of-Rack (TOR) network switch or power supply would render the entire dataset unavailable. Apache HDFS default block placement policy states:\n- Replica 1: Placed on the local node (if client is on the cluster) or a random node on local rack.\n- Replica 2: Placed on a node in a different remote rack (off-rack).\n- Replica 3: Placed on a different node in the SAME remote rack as Replica 2.\nAny additional replicas are placed on random nodes.',
        hi: 'Rack Awareness HDFS ki aisi intelligent policy hai jisse block ki 3 copies ko alag-alag physical server racks me baanta jaata hai. Socho agar teeno copies ek hi rack ke 3 computers me rakh di jaayein, aur uss rack ka main network switch ya power switch ud jaaye, toh data gayab ho jayega! Isiliye HDFS official rule use karta hai: 1st copy local rack me, 2nd copy kisi doosre rack me, aur 3rd copy usi doosre rack ke kisi alag node me. Isse poora ek rack jalne par bhi data 100% bacha rehta hai aur cross-rack network traffic bhi minimize hota hai.'
      },
      why: 'In data centers, communication between two nodes on the same rack is lightning fast (single switch hop). Communication between nodes on different racks crosses core spine switches with higher latency and shared bandwidth. The 2-rack policy achieves the optimal trade-off between complete rack fault tolerance and minimal inter-rack network write traffic.',
      how: '1. Administrator configures net.topology.script.file.name in core-site.xml.\n2. When DataNodes register, NameNode invokes the script with DataNode IP/hostname.\n3. The script returns the rack topology string (e.g. /rack1/node101, /rack2/node201).\n4. During writes, NameNode applies the 2-rack placement algorithm.\n5. During reads, NameNode sorts block locations, prioritizing the node in the client\'s own rack.',
      architecture: {
        type: 'rack_awareness_topology',
        title: 'Official Apache HDFS Replica Placement Policy',
        nodes: [
          { name: 'Rack 1 (Local)', desc: 'Replica 1 placed on Node 1 (Local write speed, zero inter-rack traffic)' },
          { name: 'Rack 2 (Remote)', desc: 'Replica 2 placed on Node 11 (Tolerates Rack 1 total failure)' },
          { name: 'Rack 2 (Remote)', desc: 'Replica 3 placed on Node 12 (Same rack as Replica 2, saves cross-rack bandwidth)' }
        ]
      },
      industryExample: 'At Meta (Facebook), HDFS clusters spanning 100+ server racks use custom topology mapping scripts to ensure that exabytes of user photo storage survive simultaneous switch and cooling failures in an entire rack row.',
      practicalLab: {
        title: 'Lab 2.5: Verifying Rack Topology and Configuration',
        problemStatement: 'Inspect how Hadoop maps IP addresses to racks and verify cluster rack distribution.',
        requirements: 'Terminal simulator with hdfs dfsadmin.',
        setup: 'hdfs dfsadmin -printTopology',
        instructions: [
          'Step 1: Run hdfs dfsadmin -printTopology to inspect current rack assignments.',
          'Step 2: Verify that worker nodes belong to /default-rack or custom racks like /rack-01 and /rack-02.'
        ],
        code: `# check_topology.sh
hdfs dfsadmin -printTopology
`,
        commands: [
          'hdfs dfsadmin -printTopology'
        ]
      },
      expectedOutput: `Rack: /rack-01
   192.168.1.101:9866 (worker-01.internal)
   192.168.1.102:9866 (worker-02.internal)

Rack: /rack-02
   192.168.2.101:9866 (worker-03.internal)
   192.168.2.102:9866 (worker-04.internal)`,
      troubleshooting: [
        {
          error: 'All nodes show as /default-rack in hdfs dfsadmin -printTopology',
          rootCause: 'The topology script net.topology.script.file.name is not configured or not marked executable (chmod +x).',
          solution: 'Configure core-site.xml with property net.topology.script.file.name pointing to a script that maps IP ranges (e.g. 192.168.1.* -> /rack1, 192.168.2.* -> /rack2) and run chmod +x topology.sh.'
        }
      ],
      bestPractices: [
        'Always configure rack awareness in multi-node clusters; without it, all nodes default to /default-rack, losing rack fault tolerance.',
        'Ensure the rack topology mapping script executes in under 100ms, as NameNode invokes it during node registration.',
        'Use network subnet boundaries (CIDR blocks) to cleanly identify physical racks.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is Rack Awareness in Hadoop HDFS?',
          answer: 'Rack Awareness is NameNode\'s knowledge of the physical rack location of every DataNode in the data center. It is used to distribute block replicas across multiple racks to prevent data loss if an entire rack fails, and to optimize network traffic during read/write operations.'
        },
        {
          level: 'Intermediate',
          question: 'What is the exact block placement policy for 3 replicas in HDFS?',
          answer: 'According to official Apache HDFS design: 1st replica is placed on the local node (or local rack if client is outside cluster). 2nd replica is placed on a node in a different remote rack. 3rd replica is placed on a different node in that same remote rack. This ensures rack redundancy while crossing the inter-rack network spine only once during the write pipeline.'
        },
        {
          level: 'Advanced',
          question: 'Why doesn\'t HDFS place all 3 replicas on 3 completely different racks?',
          answer: 'Placing 3 replicas across 3 different racks would require the client write pipeline to traverse the inter-rack network core switches twice, doubling network congestion and write latency. Spanning across 2 racks provides 100% rack-failure tolerance while keeping inter-rack network traffic to a single hop.'
        }
      ],
      assignment: {
        task: 'Run hdfs dfsadmin -printTopology to inspect the rack configuration of the cluster.',
        verificationCriteria: 'Run hdfs dfsadmin -printTopology and observe Rack names.'
      },
      assessment: {
        quiz: [
          {
            q: 'Under the default HDFS 3-replica placement policy, across how many distinct racks are the 3 replicas distributed?',
            options: ['1 rack', '2 racks', '3 racks', 'Randomly across all racks'],
            correct: 1,
            explanation: 'The 3 replicas are placed across exactly 2 distinct racks (1 on local rack, 2 on remote rack).'
          }
        ],
        commandChallenge: {
          prompt: 'Print the cluster rack topology using hdfs dfsadmin.',
          expectedCommand: 'hdfs dfsadmin -printTopology'
        }
      }
    },
    {
      id: 'm2-l6',
      title: 'Heartbeat and Block Report',
      duration: '40 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Heartbeats and Block Reports are the two critical communication mechanisms from DataNodes to NameNode. Every 3 seconds (dfs.heartbeat.interval = 3), each DataNode sends a lightweight Heartbeat to the NameNode confirming it is alive and reporting its available disk capacity. If the NameNode does not receive heartbeats from a DataNode for 10 minutes and 30 seconds (10 * dfs.heartbeat.interval + dfs.namenode.heartbeat.recheck-interval = 630s), it declares the DataNode dead. Every 6 hours (dfs.blockreport.intervalMsec = 21600000), DataNodes send a comprehensive Block Report listing every single physical block stored on their disks.',
        hi: 'Heartbeat aur Block Report DataNode se NameNode ke beech ka constant communication bridge hain. Har 3 second me har DataNode NameNode ko ek "Heartbeat" bhejta hai jo kehta hai "Main theek hoon aur itni free storage bachi hai". Agar 10 minute 30 second tak kisi DataNode se heartbeat na aaye, toh NameNode use "Dead" ghoshit kar deta hai aur uske blocks ko doosre nodes par copy karna shuru kar deta hai. Block Report har 6 ghante me bheji jaati hai jisme DataNode apni hard drive par maujood saare blocks ki poori list NameNode ko deta hai.'
      },
      why: 'In large clusters, drives can silently corrupt blocks or power cables can dislodge. Continuous heartbeats guarantee instantaneous cluster health awareness without polling, and block reports ensure the NameNode\'s RAM index exactly matches physical disk reality.',
      how: '1. Timer: DataNode runs a background thread waking up every 3000ms.\n2. RPC Heartbeat: Sends IPC call to NameNode containing node status, capacity, and active xceivers.\n3. Piggybacked Commands: NameNode returns instructions in the heartbeat response (e.g. replicate block X, delete block Y, recover lease).\n4. Dead Node Declaration: Timeout = 2 * recheck_interval (default 5 min each) + 10 * heartbeat_interval = 630 seconds.\n5. Full Block Report: DataNode scans local disk volumes and streams block list via Protobuf to NameNode.',
      architecture: {
        type: 'heartbeat_flow',
        title: 'Heartbeat & Block Report Lifecycle',
        nodes: [
          { name: 'DataNode Heartbeat', desc: 'Every 3s: Sends liveness, disk capacity, and active transfers' },
          { name: 'NameNode Response', desc: 'Piggybacks commands: "Replicate blk_102 to DN4", "Delete blk_105"' },
          { name: 'Full Block Report', desc: 'Every 6 hours: Complete inventory of all blocks on disk' },
          { name: 'Dead Node Timeout', desc: 'After 630s without heartbeat: Node marked dead, re-replication triggers' }
        ]
      },
      industryExample: 'At Apple, clusters running tens of thousands of DataNodes tune heartbeat recheck intervals and use incremental block reports (IBR) to avoid sudden "Block Report Storms" that could lock NameNode RPC queues.',
      practicalLab: {
        title: 'Lab 2.6: Checking Heartbeat Intervals and Dead Node Thresholds',
        problemStatement: 'Inspect NameNode logs and live report to verify last contact time for each node.',
        requirements: 'Terminal simulator with hdfs dfsadmin.',
        setup: 'hdfs dfsadmin -report',
        instructions: [
          'Step 1: Run hdfs dfsadmin -report and observe the "Last contact" field.',
          'Step 2: Verify that "Last contact" is between 0 to 3 seconds for healthy nodes.'
        ],
        code: `# heartbeat_check.sh
hdfs dfsadmin -report | grep -E "Hostname|Last contact|Decommission"
`,
        commands: [
          'hdfs dfsadmin -report'
        ]
      },
      expectedOutput: `Configured Capacity: 107374182400 (100 GB)
Present Capacity: 96636764160 (90 GB)
DFS Remaining: 85899345920 (80 GB)
DFS Used: 10737418240 (10 GB)
DFS Used%: 10.00%
Under replicated blocks: 0
Blocks with corrupt replicas: 0
Missing blocks: 0

-------------------------------------------------
Live datanodes (3):

Name: 192.168.1.101:9866 (worker-01.internal)
Hostname: worker-01.internal
Decommission Status : Normal
Num of Blocks: 16
Last contact: Wed Nov 11 14:48:02 IST 2026 (1 second ago)`,
      troubleshooting: [
        {
          error: 'DataNode marked Dead even though server is running and accessible via SSH',
          rootCause: 'DataNode JVM is suffering from a prolonged Stop-The-World (STW) Garbage Collection pause lasting longer than the heartbeat timeout, or high network packet drop.',
          solution: 'Inspect DataNode GC logs. Tune JVM heap (increase -Xmx or switch to G1GC: -XX:+UseG1GC). Verify network MTU and firewall rules on port 9866/9867.'
        }
      ],
      bestPractices: [
        'Do not decrease heartbeat interval below 3s; doing so overloads the NameNode RPC queue in clusters with >1000 nodes.',
        'Enable Incremental Block Reports (IBR) so DataNodes notify NameNode immediately when a new block is received without waiting 6 hours.',
        'Monitor "Last contact" in Prometheus/Datadog; alert if last contact exceeds 30 seconds.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the default Heartbeat interval in HDFS, and how long does NameNode wait before declaring a DataNode dead?',
          answer: 'The default Heartbeat interval is 3 seconds. NameNode declares a DataNode dead after 10 minutes and 30 seconds (630 seconds), calculated as 2 * dfs.namenode.heartbeat.recheck-interval (default 300s * 2 = 600s) + 10 * dfs.heartbeat.interval (3s * 10 = 30s).'
        },
        {
          level: 'Intermediate',
          question: 'What is the difference between a Heartbeat and a Block Report?',
          answer: 'A Heartbeat is a lightweight ping sent every 3 seconds containing only node liveness, disk capacity, and active connections. A Block Report is a heavy inventory sent every 6 hours containing the list of all block IDs physically present on the DataNode\'s disk volumes, allowing NameNode to synchronize its in-memory block map.'
        },
        {
          level: 'Advanced',
          question: 'What are Incremental Block Reports (IBRs)?',
          answer: 'Instead of waiting for the full 6-hour block report, whenever a DataNode finishes receiving, writing, or deleting a block, it immediately sends an Incremental Block Report (IBR) to the NameNode. This ensures the NameNode\'s metadata is updated within milliseconds of a file write completing.'
        }
      ],
      assignment: {
        task: 'Inspect the live DataNode report and confirm that Last contact is under 3 seconds for all active workers.',
        verificationCriteria: 'Run hdfs dfsadmin -report and observe Last contact timestamps.'
      },
      assessment: {
        quiz: [
          {
            q: 'How does the NameNode send instructions (such as "delete block" or "replicate block") to a DataNode?',
            options: [
              'NameNode initiates an SSH connection to the DataNode',
              'Piggybacked in the return payload of the DataNode\'s regular heartbeat RPC',
              'Via an external message queue like RabbitMQ',
              'By writing commands into a shared NFS directory'
            ],
            correct: 1,
            explanation: 'NameNode never opens connections to DataNodes; commands are piggybacked inside the return value of the DataNode\'s heartbeat RPC.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect cluster DataNode status and last contact times.',
          expectedCommand: 'hdfs dfsadmin -report'
        }
      }
    },
    {
      id: 'm2-l7',
      title: 'FsImage and EditLog',
      duration: '50 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'The NameNode stores its filesystem metadata in two persistent disk files: FsImage and EditLog. The FsImage (Filesystem Image) is a complete point-in-time snapshot of the entire HDFS directory structure, file-to-block mappings, and permissions. The EditLog is an append-only transaction log that records every single modification (create, rename, delete, change replication) made to the filesystem since the last FsImage was saved. Writing modifications to EditLog takes microseconds, whereas rewriting the multi-gigabyte FsImage on every change would freeze the NameNode.',
        hi: 'NameNode apne metadata ko disk par permanently store karne ke liye do files use karta hai: FsImage aur EditLog. FsImage ek poora point-in-time snapshot hota hai (jaise poore file system ki ek photo). EditLog ek diary (transaction log) ki tarah hota hai — jab bhi koi nayi file banti hai ya delete hoti hai, NameNode turant EditLog me ek line likh deta hai. Agar har file banne par FsImage dobara likhte toh NameNode bohot slow ho jata. Isiliye runtime me saare changes EditLog me jaate hain, aur Secondary NameNode unhe merge karta hai.'
      },
      why: 'If the NameNode crashes or server power is cut, RAM contents are wiped. When NameNode restarts, it reads the FsImage into RAM, replays all uncommitted transactions from the EditLog, and recreates the exact state of the filesystem with zero data loss.',
      how: '1. Runtime write: When client creates /user/data/orders.parquet, NameNode records the transaction in EditLog.\n2. In-Memory update: The RAM namespace tree is updated immediately.\n3. EditLog growth: Over hours, EditLog accumulates millions of transactions.\n4. Checkpointing: Secondary NameNode (or Standby NameNode in HA) downloads FsImage + EditLog, merges them, and uploads back a new FsImage.\n5. Truncation: Old EditLog transactions prior to checkpoint are safely rolled over and deleted.',
      architecture: {
        type: 'checkpointing_flow',
        title: 'FsImage and EditLog Checkpointing Mechanism',
        nodes: [
          { name: 'Active NameNode', desc: 'Appends transactions to EditLog and updates RAM tree in microseconds' },
          { name: 'Secondary / Standby NN', desc: 'Downloads FsImage and EditLog via HTTP GET' },
          { name: 'Local Merge', desc: 'Replays edits onto FsImage creating fsimage.ckpt' },
          { name: 'HTTP POST Push', desc: 'Uploads new fsimage to Active NN; rolls over EditLog' }
        ]
      },
      industryExample: 'At Twitter, checkpointing intervals are tuned to run every 30 minutes to keep EditLogs small, ensuring that in the event of an unplanned master reboot, NameNode restores in under 3 minutes instead of hours.',
      practicalLab: {
        title: 'Lab 2.7: Inspecting FsImage & EditLog Metadata Files',
        problemStatement: 'Inspect NameNode storage directory, identify current fsimage and edits files, and view transaction IDs.',
        requirements: 'Terminal simulator with ls and offline image viewer.',
        setup: 'mkdir -p /tmp/hadoop/dfs/name/current',
        instructions: [
          'Step 1: List NameNode metadata directory contents.',
          'Step 2: Identify fsimage_0000000000000001000 and edits_inprogress files.',
          'Step 3: Understand transaction IDs.'
        ],
        code: `# inspect_metadata.sh
cat << 'EOF' > /tmp/mock_name_dir.sh
mkdir -p /tmp/dfs/name/current
touch /tmp/dfs/name/current/fsimage_0000000000000000100
touch /tmp/dfs/name/current/fsimage_0000000000000000100.md5
touch /tmp/dfs/name/current/edits_0000000000000000101-0000000000000000200
touch /tmp/dfs/name/current/edits_inprogress_0000000000000000201
touch /tmp/dfs/name/current/seen_txid
touch /tmp/dfs/name/current/VERSION
EOF
bash /tmp/mock_name_dir.sh
ls -la /tmp/dfs/name/current
`,
        commands: [
          'ls -la /tmp/dfs/name/current'
        ]
      },
      expectedOutput: `total 0
drwxr-xr-x 2 hadoop hadoop  160 Nov 11 14:50 .
drwxr-xr-x 3 hadoop hadoop   60 Nov 11 14:50 ..
-rw-r--r-- 1 hadoop hadoop    0 Nov 11 14:50 VERSION
-rw-r--r-- 1 hadoop hadoop    0 Nov 11 14:50 edits_0000000000000000101-0000000000000000200
-rw-r--r-- 1 hadoop hadoop    0 Nov 11 14:50 edits_inprogress_0000000000000000201
-rw-r--r-- 1 hadoop hadoop    0 Nov 11 14:50 fsimage_0000000000000000100
-rw-r--r-- 1 hadoop hadoop    0 Nov 11 14:50 fsimage_0000000000000000100.md5
-rw-r--r-- 1 hadoop hadoop    0 Nov 11 14:50 seen_txid`,
      troubleshooting: [
        {
          error: 'NameNode restart takes 45 minutes or hangs replaying transactions',
          rootCause: 'Secondary NameNode / Checkpointing was failing or disabled, causing EditLog to grow to tens of gigabytes with 50+ million uncommitted transactions.',
          solution: 'Ensure Secondary NameNode or Standby NameNode is running. Verify checkpoint properties dfs.namenode.checkpoint.period (default 3600s) and dfs.namenode.checkpoint.txns (default 1000000).'
        }
      ],
      bestPractices: [
        'Store NameNode metadata on at least two separate physical disks (e.g. local NVMe + dedicated remote NFS mount) using comma-separated dfs.namenode.name.dir.',
        'Use the Offline Image Viewer (hdfs oiv) or Offline Edits Viewer (hdfs oev) to parse corrupt fsimages without starting the cluster.',
        'Monitor seen_txid file to verify transaction sequencing.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is FsImage and EditLog in HDFS?',
          answer: 'FsImage is a point-in-time snapshot of the entire HDFS directory structure, file attributes, and block mappings. EditLog is an append-only log file recording every modification (creates, renames, deletes) made to the filesystem since the last FsImage was saved.'
        },
        {
          level: 'Intermediate',
          question: 'Why doesn\'t the NameNode just update the FsImage on disk every time a file is created?',
          answer: 'FsImage is a multi-gigabyte serialized file. Rewriting gigabytes of data on disk for every tiny file creation or rename would crush disk I/O and reduce cluster throughput from thousands of operations per second to single digits. Appending a few bytes to the EditLog is sequential and takes microseconds.'
        },
        {
          level: 'Advanced',
          question: 'Explain the Checkpointing process and why the Secondary NameNode is NOT a High Availability failover.',
          answer: 'Checkpointing is the periodic process of merging the base FsImage with accumulated EditLog transactions to create a new FsImage. The Secondary NameNode performs this heavy compute job to avoid CPU/memory spikes on the Active NameNode. It is NOT a failover because it does not keep a real-time copy of RAM metadata or receive live DataNode heartbeats; if the Active NameNode dies, the Secondary NameNode cannot automatically take over.'
        }
      ],
      assignment: {
        task: 'Inspect the contents of the NameNode metadata directory /tmp/dfs/name/current in terminal to identify the FsImage and EditLog files.',
        verificationCriteria: 'Run ls -la /tmp/dfs/name/current and verify presence of fsimage and edits_inprogress.'
      },
      assessment: {
        quiz: [
          {
            q: 'What is the purpose of the Secondary NameNode in a non-HA Hadoop cluster?',
            options: [
              'To act as an immediate active backup when NameNode crashes',
              'To periodically merge FsImage and EditLog into a fresh FsImage (checkpointing)',
              'To store raw file data blocks',
              'To monitor YARN NodeManagers'
            ],
            correct: 1,
            explanation: 'The Secondary NameNode performs checkpointing: merging the EditLog into FsImage so the EditLog does not grow infinitely large.'
          }
        ],
        commandChallenge: {
          prompt: 'List metadata files in NameNode current directory.',
          expectedCommand: 'ls -la /tmp/dfs/name/current'
        }
      }
    },
    {
      id: 'm2-l8',
      title: 'Safe Mode',
      duration: '40 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Safe Mode is a maintenance and startup state of the NameNode during which the HDFS filesystem is strictly Read-Only. While in Safe Mode, DataNodes cannot delete or replicate blocks, and clients cannot create, delete, or modify files or directories. During cluster startup, the NameNode loads the FsImage and replays the EditLog into RAM. At this point, the NameNode knows the list of blocks, but does NOT know which DataNodes currently hold them. It enters Safe Mode and waits for DataNodes to check in with their Block Reports. Once the percentage of blocks meeting minimum replication reaches the threshold (default 99.9% or dfs.namenode.safemode.threshold-pct = 0.999), NameNode waits an extension period (default 30s) and automatically exits Safe Mode.',
        hi: 'Safe Mode HDFS ka ek Read-Only security state hota hai. Jab cluster start hota hai, toh NameNode Safe Mode me chala jaata hai. Iss dauran na toh koi nayi file create ho sakti hai, na delete ho sakti hai. NameNode RAM me directory load karta hai, lekin use ye nahi pata hota ki kaun sa block kis DataNode ke paas hai. Safe Mode me NameNode wait karta hai jab tak 99.9% blocks ke DataNodes apna Block Report na bhej dein. Jaise hi 99.9% blocks mil jaate hain, NameNode 30 seconds wait karke automatically Safe Mode se bahar aa jaata hai.'
      },
      why: 'If the NameNode exited Safe Mode immediately upon boot before DataNodes reported their blocks, the NameNode would falsely assume all blocks were lost and would trigger a catastrophic, cluster-wide storm of redundant block replications, thrashing the network.',
      how: '1. NameNode boots: Loads FsImage, replays EditLog, enters Safe Mode.\n2. DataNodes register: Send initial Block Reports.\n3. Counter tracks: NameNode increments safely replicated block counter.\n4. Threshold check: Safe blocks / Total blocks >= 0.999f.\n5. Extension countdown: Waits dfs.namenode.safemode.extension (30000ms).\n6. Exit: Safe Mode turned OFF, filesystem opens for read/write operations.',
      architecture: {
        type: 'safemode_lifecycle',
        title: 'HDFS Safe Mode Boot Cycle',
        nodes: [
          { name: '1. Boot & Replay', desc: 'Loads FsImage + EditLog into RAM (Read-Only Mode active)' },
          { name: '2. DataNode Reports', desc: 'DataNodes check in; safely replicated blocks counter rises' },
          { name: '3. Threshold Reached', desc: '99.9% safe block threshold reached (dfs.namenode.safemode.threshold-pct=0.999)' },
          { name: '4. Exit Extension', desc: 'Waits 30s grace period; automatically turns Safe Mode OFF' }
        ]
      },
      industryExample: 'During major data center electrical maintenance, Big Data administrators manually force HDFS into Safe Mode using hdfs dfsadmin -safemode enter to ensure no running ETL job writes inconsistent partial files during hardware maintenance.',
      practicalLab: {
        title: 'Lab 2.8: Querying, Entering, and Leaving Safe Mode',
        problemStatement: 'Check the current Safe Mode status of HDFS, manually enter Safe Mode, attempt a write to witness the protection, and safely exit.',
        requirements: 'HDFS administrative CLI.',
        setup: 'hdfs dfsadmin -safemode get',
        instructions: [
          'Step 1: Check Safe Mode status with hdfs dfsadmin -safemode get.',
          'Step 2: Manually enter Safe Mode using hdfs dfsadmin -safemode enter.',
          'Step 3: Exit Safe Mode with hdfs dfsadmin -safemode leave.'
        ],
        code: `# safemode_lab.sh
hdfs dfsadmin -safemode get
hdfs dfsadmin -safemode enter
hdfs dfsadmin -safemode get
hdfs dfsadmin -safemode leave
`,
        commands: [
          'hdfs dfsadmin -safemode get',
          'hdfs dfsadmin -safemode enter',
          'hdfs dfsadmin -safemode leave'
        ]
      },
      expectedOutput: `Safe mode is OFF
Safe mode is ON
Safe mode is ON
Safe mode is OFF`,
      troubleshooting: [
        {
          error: 'org.apache.hadoop.hdfs.server.namenode.SafeModeException: Cannot create directory /data. Name node is in safe mode.',
          rootCause: 'Cluster was recently restarted and DataNodes have not finished reporting blocks, or missing blocks exceed the 0.1% threshold.',
          solution: 'Check missing blocks using hdfs fsck /. If missing blocks are lost permanently on formatted drives, force leave using hdfs dfsadmin -safemode leave.'
        }
      ],
      bestPractices: [
        'Never force leave Safe Mode (safemode leave) immediately after cluster startup; wait 2-3 minutes for DataNodes to finish reporting.',
        'Enter Safe Mode manually before performing cluster backups or rolling OS kernel upgrades.',
        'Monitor dfs.namenode.safemode.threshold-pct; never set it to 1.0 (100%) because a single dead drive will lock the cluster indefinitely.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is Safe Mode in HDFS and what operations are permitted during Safe Mode?',
          answer: 'Safe Mode is a read-only state of the NameNode during which no modifications to the filesystem are allowed. Clients can read existing files, but cannot create files, write data, rename directories, or delete blocks. No block replication or deletion occurs during Safe Mode.'
        },
        {
          level: 'Intermediate',
          question: 'What conditions must be satisfied for NameNode to automatically exit Safe Mode?',
          answer: 'Two conditions must be met: 1. The percentage of blocks that have at least minimum replication (default 1 replica) must meet or exceed dfs.namenode.safemode.threshold-pct (default 0.999 or 99.9%). 2. Once the threshold is met, the NameNode waits for an extension period of dfs.namenode.safemode.extension (default 30 seconds) before officially turning Safe Mode OFF.'
        },
        {
          level: 'Advanced',
          question: 'What causes a cluster to get stuck in Safe Mode indefinitely, and how do you resolve it?',
          answer: 'A cluster gets stuck in Safe Mode when the percentage of safely reported blocks never reaches 99.9%. This occurs if multiple DataNode machines fail to boot, network partitions prevent communication, or physical disks crashed losing blocks. Resolution: Run hdfs fsck / to identify missing blocks, bring offline DataNodes back online, or if data is permanently lost, execute hdfs dfsadmin -safemode leave and clean up corrupt files with hdfs fsck -delete.'
        }
      ],
      assignment: {
        task: 'Execute hdfs dfsadmin -safemode get, enter Safe Mode, and leave Safe Mode in the terminal emulator.',
        verificationCriteria: 'Run hdfs dfsadmin -safemode get and see Safe mode is OFF.'
      },
      assessment: {
        quiz: [
          {
            q: 'What is the default threshold percentage of replicated blocks required for NameNode to exit Safe Mode?',
            options: ['50.0%', '90.0%', '99.9%', '100.0%'],
            correct: 2,
            explanation: 'dfs.namenode.safemode.threshold-pct defaults to 0.999 (99.9%). Setting it to 100% is risky as one lost block could freeze the cluster.'
          }
        ],
        commandChallenge: {
          prompt: 'Check whether HDFS is currently in Safe Mode.',
          expectedCommand: 'hdfs dfsadmin -safemode get'
        }
      }
    },
    {
      id: 'm2-l9',
      title: 'HDFS Read/Write Architecture',
      duration: '55 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'The internal Read and Write pipelines in HDFS are engineered for maximum throughput by streaming data directly between the client and DataNodes without routing bytes through the NameNode master.\n\nREAD PIPELINE: The client opens a DistributedFileSystem stream. The NameNode returns an ordered list of DataNodes hosting each block, sorted by network proximity to the client. The client connects directly to the nearest DataNode via an FSDataInputStream and streams the block sequentially.\n\nWRITE PIPELINE: The client requests file creation from NameNode. NameNode verifies permissions and returns an allocated block ID with a list of 3 candidate DataNodes (e.g. DN1, DN2, DN3). The client writes 64 KB packets to DN1. DN1 stores the packet locally and simultaneously forwards it to DN2, which forwards to DN3 in a pipelined fashion. Acknowledgements (ACKs) flow backward (DN3 -> DN2 -> DN1 -> Client). Once all packets in the 128 MB block are ACKed, the client moves to the next block.',
        hi: 'HDFS me Read aur Write ka internal architecture bohot fast hai kyunki NameNode beech me data transfer nahi karta:\n\nREAD FLOW: Client NameNode se puchta hai "Ye file kahan hai?". NameNode blocks ki list aur unke DataNodes ka address client ke sabse paas wale order me bhej deta hai. Client direct sabse kareebi DataNode se high speed me data read karta hai.\n\nWRITE FLOW: Client NameNode se block ID aur 3 DataNodes leta hai (jaise DN1, DN2, DN3). Client data ke 64 KB ke packets banakar DN1 ko bhejta hai. DN1 packet likh kar turant DN2 ko pass karta hai, aur DN2 DN3 ko pass karta hai (ise Pipeline kehte hain). Jab DN3, DN2 aur DN1 sab confirm (ACK) kar dete hain, tab agla packet stream hota hai.'
      },
      why: 'Streaming data in a pipeline (A -> B -> C) rather than having the client upload 3 separate copies in parallel (Client -> A, Client -> B, Client -> C) reduces client outbound network bandwidth by 66% and utilizes the high-bandwidth backbone switches between server racks.',
      how: '1. Write Request: Client calls DistributedFileSystem.create().\n2. NameNode RPC: Validates path, creates file inode in RAM, appends to EditLog.\n3. Pipeline Setup: Returns DataNodes [DN1, DN2, DN3]. Client establishes TCP socket pipeline.\n4. Packet Streaming: Data streamed in 64 KB packets (4 KB checksum chunks).\n5. ACK Pipeline: ACKs flow reverse: DN3 -> DN2 -> DN1 -> Client.\n6. Close: Client calls stream.close(). NameNode commits file as complete.',
      architecture: {
        type: 'hdfs_read_write_pipeline',
        title: 'HDFS Read & Write Pipelined Data Flow',
        nodes: [
          { name: 'Write: Client Stream', desc: 'Streams 64KB packets to DN1 (Rack 1)' },
          { name: 'Write: Pipeline DN1 -> DN2', desc: 'DN1 writes local disk & forwards to DN2 (Rack 2)' },
          { name: 'Write: Pipeline DN2 -> DN3', desc: 'DN2 writes local disk & forwards to DN3 (Rack 2)' },
          { name: 'Read: Nearest Locality', desc: 'Client reads directly from closest node (Intra-rack or node-local)' }
        ]
      },
      industryExample: 'Netflix data pipelines write hundreds of terabytes per hour using this pipelined architecture, allowing edge ingestion servers with standard 10GbE network cards to stream massive video telemetry effortlessly.',
      practicalLab: {
        title: 'Lab 2.9: Simulating HDFS Read and Write Performance',
        problemStatement: 'Put a file into HDFS, read it back with hdfs dfs -cat, and inspect packet checksum validation.',
        requirements: 'HDFS CLI emulator.',
        setup: 'mkdir -p ~/bigdata_lab/m2_l9 && cd ~/bigdata_lab/m2_l9',
        instructions: [
          'Step 1: Create a test dataset with 100 rows.',
          'Step 2: Upload into HDFS using hdfs dfs -put.',
          'Step 3: Read back using hdfs dfs -cat with head.'
        ],
        code: `# rw_pipeline.sh
echo "customer_id,event,timestamp" > test_event.csv
for i in {1..50}; do
  echo "$i,click,1731315000" >> test_event.csv
done
hdfs dfs -put -f test_event.csv /data/warehouse/
hdfs dfs -cat /data/warehouse/test_event.csv | head -n 5
`,
        commands: [
          'hdfs dfs -put -f test_event.csv /data/warehouse/',
          'hdfs dfs -cat /data/warehouse/test_event.csv | head -n 5'
        ]
      },
      expectedOutput: `customer_id,event,timestamp
1,click,1731315000
2,click,1731315000
3,click,1731315000
4,click,1731315000`,
      troubleshooting: [
        {
          error: 'org.apache.hadoop.net.ConnectTimeoutException: 20000 millis timeout while waiting for channel to be ready for connect',
          rootCause: 'Client cannot reach DataNode data transfer port (default 9866) due to firewall or network routing rules.',
          solution: 'Ensure TCP port 9866 (dfs.datanode.address) is open between all client machines and all DataNodes.'
        },
        {
          error: 'ChecksumException: Checksum error at offset 512',
          rootCause: 'Data corruption occurred on physical disk sector of the DataNode.',
          solution: 'Client detects the corrupt checksum, reports it to NameNode, and transparently fetches the valid replica from another DataNode.'
        }
      ],
      bestPractices: [
        'Always close files properly (close() or context manager); unclosed files remain under lease and cannot be read by other clients until lease expires (default 1 hour).',
        'Enable Short-Circuit Local Reads (dfs.client.read.shortcircuit = true) so that when client is on the same machine as the data, it bypasses TCP sockets and reads directly from local file descriptors.',
        'Use dfs.client.write.packet.size (default 64 KB) to match network MTU.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'Does the client upload 3 copies of data to 3 DataNodes simultaneously?',
          answer: 'No. The client only uploads to the first DataNode in the pipeline. That first DataNode forwards the data packets to the second DataNode, which forwards to the third DataNode. This pipelined approach saves client network bandwidth.'
        },
        {
          level: 'Intermediate',
          question: 'What happens if a DataNode in the write pipeline crashes while writing a block?',
          answer: '1. The pipeline is closed and buffered unacknowledged packets are pushed back to the client queue. 2. NameNode assigns a new generation stamp to the block. 3. The failed DataNode is removed from the pipeline. 4. Writing resumes on the remaining healthy DataNodes. 5. Once the file closes, NameNode detects that the block is under-replicated (e.g. 2 replicas instead of 3) and automatically schedules asynchronous replication to a new node.'
        },
        {
          level: 'Advanced',
          question: 'What is HDFS Short-Circuit Local Read and how does it improve Spark performance?',
          answer: 'In standard HDFS reads, the client connects to DataNode via a TCP socket, even if both reside on the same physical server. Short-Circuit Local Reads allow the client to read the block file directly from the local filesystem using domain sockets and file descriptors, bypassing TCP network stack entirely. This provides near-bare-metal I/O throughput for local Spark and Impala tasks.'
        }
      ],
      assignment: {
        task: 'Upload test_event.csv to /data/warehouse/ and read back the first 5 records using hdfs dfs -cat piped to head.',
        verificationCriteria: 'Run hdfs dfs -cat /data/warehouse/test_event.csv | head -n 5.'
      },
      assessment: {
        quiz: [
          {
            q: 'How does HDFS handle checksum verification during read operations?',
            options: [
              'Checksum is calculated only once during cluster reboot',
              'Client verifies CRC-32 checksum every 512 bytes; if corrupt, it transparently fetches replica from another node',
              'DataNodes reject reads if checksum is enabled',
              'NameNode checks all checksums before every read'
            ],
            correct: 1,
            explanation: 'Client computes CRC-32 checksum on every 512 bytes received; on mismatch, it automatically reads from another replica.'
          }
        ],
        commandChallenge: {
          prompt: 'Read the first 5 lines of /data/warehouse/test_event.csv using hdfs dfs -cat and head.',
          expectedCommand: 'hdfs dfs -cat /data/warehouse/test_event.csv | head -n 5'
        }
      }
    },
    {
      id: 'm2-l10',
      title: 'Fault Tolerance',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Fault tolerance is the inherent architectural capability of HDFS to continue operating flawlessly without data loss or downtime when hardware components fail. HDFS is designed from the ground up under the assumption that hardware failure is the norm, not an exception. It handles three distinct classes of failure: DataNode hardware/network failures (detected via missed heartbeats), disk drive media corruption (detected via CRC-32 checksums), and NameNode metadata failures (mitigated via Standby NameNode, JournalNodes, and dual-disk FsImage persistence).',
        hi: 'Fault Tolerance ka matlab hai ki hardware kharab hone par bhi system bina ruke aur bina kisi data loss ke chalta rahe. Hadoop ka core philosophy hai: "Hardware will fail, software must survive". HDFS teen tarah ke failures ko jhelta hai: 1. DataNode machine ka crash hona (Heartbeat na aane par NameNode automatically doosre nodes par copies bana leta hai), 2. Hard drive me bad sectors/corruption (CRC-32 Checksum se pakad kar doosri replica se replace karta hai), aur 3. Master NameNode ka crash hona (High Availability Standby NameNode turant charge le leta hai).'
      },
      why: 'In a 10,000-node cluster with 120,000 hard disk drives, statistical Mean Time Between Failures (MTBF) means multiple drives fail every single day. Without automated software-level fault tolerance, human administrators would spend 100% of their time manually restoring backups.',
      how: '1. Detection: Heartbeat missed for 630 seconds -> DataNode flagged dead.\n2. Inode Scan: NameNode identifies all blocks hosted on the dead node.\n3. Replication Queue: Missing blocks placed in priority replication queue.\n4. Transfer Command: NameNode piggybacks replication commands onto healthy DataNodes during regular heartbeats.\n5. Restoration: Replication factor 3 restored across cluster automatically.',
      architecture: {
        type: 'fault_tolerance_recovery',
        title: 'Automated Block Recovery after DataNode Crash',
        nodes: [
          { name: '1. Crash Event', desc: 'DataNode-2 burns power supply; heartbeats cease' },
          { name: '2. Timeout (630s)', desc: 'NameNode marks DN2 Dead; finds blk_101 under-replicated (2/3)' },
          { name: '3. Re-replication', desc: 'NameNode orders DataNode-1 to stream copy of blk_101 to DataNode-4' },
          { name: '4. Health Restored', desc: 'Cluster returns to 100% healthy state with zero data loss' }
        ]
      },
      industryExample: 'During Hurricane Sandy, an entire data center zone lost power at a major US media conglomerate. Their multi-site HDFS clusters automatically survived because replicas resided in geo-distributed racks, experiencing zero data loss.',
      practicalLab: {
        title: 'Lab 2.10: Simulating Fault Recovery and Corrupt Block Repair',
        problemStatement: 'Inspect HDFS block report, review under-replicated block counters, and verify cluster self-healing.',
        requirements: 'HDFS administrative CLI.',
        setup: 'hdfs fsck /',
        instructions: [
          'Step 1: Check overall filesystem health using hdfs fsck /.',
          'Step 2: Inspect corrupt and under-replicated block metrics.'
        ],
        code: `# fault_tolerance_lab.sh
hdfs fsck / -summary
`,
        commands: [
          'hdfs fsck / -summary'
        ]
      },
      expectedOutput: `Status: HEALTHY
 Number of data-nodes: 3
 Number of racks: 2
 Total dirs: 4
 Total files: 2
 Total symlinks: 0
 Total blocks (validated): 2 (avg. block size 24 B)
 Minimally replicated blocks: 2 (100.0 %)
 Over-replicated blocks: 0 (0.0 %)
 Under-replicated blocks: 0 (0.0 %)
 Mis-replicated blocks: 0 (0.0 %)
 Default replication factor: 3
 Average block replication: 2.5
 Corrupt blocks: 0
 Missing replicas: 0 (0.0 %)`,
      troubleshooting: [
        {
          error: 'Missing blocks (0.0 %) jumps to Missing blocks: 14',
          rootCause: 'All 3 DataNodes hosting replicas of a particular block were permanently lost simultaneously.',
          solution: 'Check dead datanodes and attempt hardware recovery. If unrecoverable, remove corrupt references using hdfs fsck / -delete.'
        }
      ],
      bestPractices: [
        'Always maintain minimum replication factor 3 for any production data.',
        'Set up automated Slack/PagerDuty alerts when UnderReplicatedBlocks metric in JMX exceeds zero for more than 15 minutes.',
        'Run monthly cluster-wide hdfs fsck checks to detect silent disk rot.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'How does HDFS handle DataNode failures?',
          answer: 'DataNodes send heartbeats to NameNode every 3 seconds. If NameNode receives no heartbeat for 10 minutes 30 seconds, it marks the DataNode dead. The NameNode checks its in-memory block map, identifies all blocks that were on the dead node, and commands other healthy DataNodes holding remaining replicas to copy them to new active nodes until the replication factor is restored.'
        },
        {
          level: 'Intermediate',
          question: 'What is a "Corrupt Block" in HDFS and how does HDFS repair it?',
          answer: 'A corrupt block occurs when physical bit rot, bad disk sectors, or network transmission alters block data, causing the computed CRC-32 checksum to mismatch the stored checksum. When a client or background DataBlockScanner detects this, it notifies NameNode. NameNode marks the replica as corrupt, schedules a fresh copy from a healthy replica, and instructs the DataNode to delete the corrupted block.'
        },
        {
          level: 'Advanced',
          question: 'What happens if a cluster suffers a catastrophic power loss where 50% of nodes die at once?',
          answer: 'The NameNode marks all unreachable nodes dead. It enters a massive re-replication phase. To prevent network thrashing, HDFS throttles re-replication bandwidth via dfs.namenode.replication.max-streams and dfs.balancer.bandwidthPerSec. Blocks with only 1 remaining replica are prioritized with highest urgency, followed by blocks with 2 replicas.'
        }
      ],
      assignment: {
        task: 'Execute hdfs fsck / -summary to verify zero corrupt blocks and zero missing replicas.',
        verificationCriteria: 'Run hdfs fsck / -summary and observe Status: HEALTHY.'
      },
      assessment: {
        quiz: [
          {
            q: 'If a DataNode containing a block replica crashes, what happens to ongoing client reads for that block?',
            options: [
              'The client application crashes with FatalException',
              'The client transparently switches to another DataNode holding a replica of the same block',
              'The client must wait 10 minutes until NameNode reboots',
              'The read job is aborted by YARN'
            ],
            correct: 1,
            explanation: 'The client library transparently fails over to the next DataNode in the block location list with zero downtime.'
          }
        ],
        commandChallenge: {
          prompt: 'Run a filesystem integrity summary check using hdfs fsck.',
          expectedCommand: 'hdfs fsck / -summary'
        }
      }
    },
    {
      id: 'm2-l11',
      title: 'High Availability (HA)',
      duration: '50 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'In Hadoop 1.x, the NameNode was a Single Point of Failure (SPOF) — if the machine died, the entire cluster became inaccessible. Hadoop 2.x and 3.x introduced HDFS High Availability (HA), which deploys an Active NameNode and one or more Standby NameNodes in an Active/Standby configuration. The Standby NameNode maintains state synchrony with the Active NameNode via a Quorum of JournalNodes (QJM - Quorum Journal Manager). When the Active NameNode modifies metadata, it commits the edits to a majority of JournalNodes (e.g. 2 out of 3). The Standby NameNode continuously consumes edits from the JournalNodes. Apache ZooKeeper and ZooKeeper Failover Controllers (ZKFC) monitor health and execute automatic, sub-second failover with fencing if the Active NameNode crashes.',
        hi: 'Hadoop 1.x me sabse badi kami thi ki agar NameNode ka computer band ho jaye toh poora cluster band ho jata tha (SPOF - Single Point of Failure). HDFS High Availability (HA) ne ise solve kiya Active aur Standby NameNode banakar. Ek Active NameNode hota hai jo saari requests leta hai, aur ek Standby NameNode ready rehta hai. Dono ke beech me JournalNodes ka ek group hota hai jahan Active NameNode apne edits likhta hai aur Standby NameNode unhe padhta rehta hai. Agar Active NameNode crash hota hai, toh ZooKeeper (ZKFC) turant Standby ko naya Active bana deta hai — zero downtime!'
      },
      why: 'Enterprise SLAs require 99.999% ("five nines") availability. In production, clusters cannot afford hours of downtime during planned hardware upgrades or unplanned hardware crashes.',
      how: '1. Active NN writes edits to Quorum of JournalNodes (e.g. 3 JournalNodes: requires 2/3 ACKs).\n2. Standby NN continuously tails JournalNodes, keeping its in-memory namespace 100% synchronized.\n3. DataNodes send heartbeats and block reports to BOTH Active and Standby NameNodes simultaneously.\n4. ZKFC (ZooKeeper Failover Controller) runs on both masters, maintaining an ephemeral heartbeat znode in ZooKeeper.\n5. If Active NN dies, its ZK session expires; ZKFC on Standby detects the drop, fences the old active, and transitions Standby to Active.',
      architecture: {
        type: 'hdfs_ha_architecture',
        title: 'HDFS High Availability (QJM + ZooKeeper + ZKFC)',
        nodes: [
          { name: 'Active NameNode', desc: 'Accepts client reads/writes, writes edits to JournalNodes quorum' },
          { name: 'Standby NameNode', desc: 'Tails JournalNodes, maintains synced RAM tree, ready for instant takeover' },
          { name: 'JournalNodes Quorum (JN1, JN2, JN3)', desc: 'Stores shared EditLog stream; requires majority consensus (2/3)' },
          { name: 'ZooKeeper & ZKFC', desc: 'Monitors health, fences dead active, promotes standby automatically' }
        ]
      },
      industryExample: 'Amazon, Uber, and Salesforce operate multi-thousand node HDFS HA clusters where NameNodes seamlessly failover during kernel updates with zero interrupted queries or lost transactions.',
      practicalLab: {
        title: 'Lab 2.11: Checking HA State and Manual Failover',
        problemStatement: 'Inspect NameNode HA states using haadmin and verify active vs standby roles.',
        requirements: 'HDFS HA administrative CLI.',
        setup: 'hdfs haadmin -getServiceState nn1',
        instructions: [
          'Step 1: Check the HA service state of nn1.',
          'Step 2: Check the HA service state of nn2.',
          'Step 3: Review fencing configuration.'
        ],
        code: `# ha_check.sh
hdfs haadmin -getServiceState nn1
hdfs haadmin -getServiceState nn2
`,
        commands: [
          'hdfs haadmin -getServiceState nn1'
        ]
      },
      expectedOutput: `active`,
      troubleshooting: [
        {
          error: 'Split-Brain Scenario: Both NameNodes believe they are Active (Dual Active)',
          rootCause: 'Network partition isolated Active NameNode from ZooKeeper, but clients can still reach it while Standby was also promoted.',
          solution: 'Fencing! HDFS HA enforces fencing methods (e.g. sshfence or power distribution unit PDU reboot) to forcibly terminate or isolate the old Active NameNode before promoting the Standby.'
        }
      ],
      bestPractices: [
        'Always deploy an odd number of JournalNodes (minimum 3, or 5 for large clusters) to ensure a clear quorum majority.',
        'Always configure automated failover using ZooKeeper (dfs.ha.automatic-failover.enabled = true) with fencing.',
        'Never use shared NFS storage for HA in production; always use the robust Quorum Journal Manager (QJM).'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is HDFS High Availability (HA) and why is it needed?',
          answer: 'HDFS HA eliminates the single point of failure (SPOF) of the NameNode by running an Active NameNode and one or more Standby NameNodes. If the Active NameNode crashes, the Standby NameNode automatically takes over with zero downtime and no data loss.'
        },
        {
          level: 'Intermediate',
          question: 'How do Active and Standby NameNodes keep their metadata in sync?',
          answer: 'They use a Quorum of JournalNodes (QJM). The Active NameNode appends edits to the JournalNodes, requiring a majority quorum confirmation. The Standby NameNode continuously tails and replays these edits into its own in-memory namespace. In addition, all DataNodes send block reports and heartbeats to both Active and Standby nodes simultaneously.'
        },
        {
          level: 'Advanced',
          question: 'What is "Fencing" in HDFS HA and why is it critical?',
          answer: 'Fencing prevents the disastrous "Split-Brain" scenario where two NameNodes both believe they are Active and accept writes simultaneously, corrupting filesystem metadata. Before a Standby NameNode is promoted to Active, the ZooKeeper Failover Controller executes a fencing method (such as sending an SSH kill -9 to the old master or triggering an IPMI power switch) to guarantee the old Active can never write to JournalNodes again.'
        }
      ],
      assignment: {
        task: 'Execute hdfs haadmin -getServiceState nn1 to verify the active status of the primary NameNode.',
        verificationCriteria: 'Run hdfs haadmin -getServiceState nn1 and observe active.'
      },
      assessment: {
        quiz: [
          {
            q: 'In an HDFS High Availability cluster with 3 JournalNodes, what is the minimum number of JournalNodes that must acknowledge an edit for it to commit?',
            options: ['1', '2 (Quorum majority: floor(3/2)+1)', '3', 'All plus ZooKeeper'],
            correct: 1,
            explanation: 'Quorum consensus requires a majority: for 3 nodes, at least 2 must acknowledge.'
          }
        ],
        commandChallenge: {
          prompt: 'Check the HA state of NameNode service nn1.',
          expectedCommand: 'hdfs haadmin -getServiceState nn1'
        }
      }
    },
    {
      id: 'm2-l12',
      title: 'HDFS Federation',
      duration: '45 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'While HDFS High Availability solves availability (SPOF), HDFS Federation solves the horizontal scalability limit of the NameNode namespace. In a single NameNode cluster, all file and directory metadata must fit in the RAM of that one machine (typically maxing out around 400-500 million files). HDFS Federation scales the architecture horizontally by allowing multiple independent NameNodes / Namespaces (e.g. NN1 for /user, NN2 for /analytics, NN3 for /telemetry) to share a single common pool of physical DataNodes. DataNodes register with all NameNodes and store blocks for all namespaces in separate Block Pools (BP-xxx).',
        hi: 'HDFS Federation NameNode ke memory limit ko solve karta hai. Ek single NameNode ki RAM me maximum 40-50 Crore files ka metadata hi aa sakta hai. HDFS Federation me hum multiple independent NameNodes laga dete hain (jaise NN1 sambhalega /user data, NN2 sambhalega /analytics data, aur NN3 sambhalega /marketing data). Lekin neeche ke saare DataNodes shared hote hain! Har DataNode ke andar har NameNode ka ek alag "Block Pool" hota hai. Isse cluster me billions of files store ho sakti hain.'
      },
      why: 'Tech giants like Yahoo, Meta, and ByteDance manage billions of files exceeding 100 Petabytes. A single NameNode heap reaches garbage collection limits around 256GB-512GB RAM. Federation provides linear, near-infinite namespace scaling while maximizing shared DataNode disk utilization.',
      how: '1. Multiple Namespaces: Each NameNode manages its own independent namespace hierarchy and EditLogs.\n2. Shared Storage: All DataNodes serve all NameNodes simultaneously.\n3. Block Pools: A Block Pool is a collection of blocks belonging to a single namespace. If NN1 is formatted, only Block Pool 1 is affected; Block Pool 2 on the same DataNodes remains untouched.\n4. ViewFS: Clients use ViewFS (client-side mount table) to see a unified global directory structure (/user -> NN1, /data -> NN2).',
      architecture: {
        type: 'hdfs_federation_layout',
        title: 'HDFS Federation Multi-Namespace Architecture',
        nodes: [
          { name: 'Namespace 1: NN1 (Users)', desc: 'Manages /user metadata; independent RAM & FsImage' },
          { name: 'Namespace 2: NN2 (Analytics)', desc: 'Manages /analytics metadata; independent RAM & FsImage' },
          { name: 'Shared DataNode Cluster', desc: 'DataNode 1, 2, 3... N hosting Block Pool 1 (BP-1) and Block Pool 2 (BP-2)' },
          { name: 'Client ViewFS Mount Table', desc: 'Exposes unified root / mapping paths to corresponding NameNodes' }
        ]
      },
      industryExample: 'ByteDance (TikTok) operates federated HDFS clusters with over 10 distinct namespaces managing tens of thousands of DataNodes and exabytes of video metadata and recommendation features.',
      practicalLab: {
        title: 'Lab 2.12: Inspecting Block Pools and Federation Namespaces',
        problemStatement: 'Inspect DataNode storage directories to identify Block Pool identifiers (BP-xxx) and namespace isolation.',
        requirements: 'Terminal simulator with ls.',
        setup: 'mkdir -p /data/hdfs/current/BP-1001 /data/hdfs/current/BP-1002',
        instructions: [
          'Step 1: Inspect DataNode current directory for Block Pool folders.',
          'Step 2: Observe how different Block Pools isolate data blocks on the same physical disk.'
        ],
        code: `# federation_inspect.sh
mkdir -p /tmp/hdfs_dn/current/BP-109283-192.168.1.1-1731315000/current/finalized/subdir0
mkdir -p /tmp/hdfs_dn/current/BP-209481-192.168.1.2-1731315000/current/finalized/subdir0
ls -la /tmp/hdfs_dn/current/
`,
        commands: [
          'ls -la /tmp/hdfs_dn/current/'
        ]
      },
      expectedOutput: `total 0
drwxr-xr-x 4 hadoop hadoop 128 Nov 11 14:55 .
drwxr-xr-x 3 hadoop hadoop  96 Nov 11 14:55 ..
drwxr-xr-x 3 hadoop hadoop  96 Nov 11 14:55 BP-109283-192.168.1.1-1731315000
drwxr-xr-x 3 hadoop hadoop  96 Nov 11 14:55 BP-209481-192.168.1.2-1731315000`,
      troubleshooting: [
        {
          error: 'ViewFS: Path does not exist in mount table for /unmapped_dir',
          rootCause: 'Client is trying to access a directory not configured in the core-site.xml ViewFS mount table.',
          solution: 'Add the mount mapping to fs.viewfs.mounttable.default.link.<mount_point> in core-site.xml.'
        }
      ],
      bestPractices: [
        'Combine HDFS Federation with High Availability (each federated namespace has its own Active + Standby NameNode pair).',
        'Use ViewFS or Router-Based Federation (RBF introduced in Hadoop 3.x) to simplify client configuration.',
        'Isolate high-churn, small-file streaming workloads into their own dedicated namespace to shield core enterprise tables.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is HDFS Federation and what problem does it solve?',
          answer: 'HDFS Federation allows multiple independent NameNodes to manage separate namespaces while sharing the same underlying pool of DataNodes. It solves the horizontal scalability bottleneck of a single NameNode, enabling clusters to store billions of files across multiple NameNode machines.'
        },
        {
          level: 'Intermediate',
          question: 'What is a "Block Pool" in HDFS Federation?',
          answer: 'A Block Pool is a set of blocks that belongs to a single namespace. Each DataNode in a federated cluster registers with every NameNode and maintains a separate subdirectory for each Block Pool. Blocks in one Block Pool are isolated from other Block Pools, so formatting one namespace has zero effect on the others.'
        },
        {
          level: 'Advanced',
          question: 'Compare ViewFS vs Router-Based Federation (RBF) in Hadoop 3.x.',
          answer: 'ViewFS implements the namespace mount table on the client side; if a mount path changes, configuration files must be redistributed to every client edge node. Router-Based Federation (RBF) moves the mount table to a centralized, scalable layer of Stateless Routers backed by ZooKeeper or State Store. Clients connect to routers via standard HDFS protocols, and path changes are updated centrally without modifying client configs.'
        }
      ],
      assignment: {
        task: 'Inspect the Block Pool directories in /tmp/hdfs_dn/current/ using ls -la in terminal to understand storage isolation.',
        verificationCriteria: 'Run ls -la /tmp/hdfs_dn/current/ and confirm presence of multiple BP- folders.'
      },
      assessment: {
        quiz: [
          {
            q: 'In HDFS Federation, do the independent NameNodes communicate directly with each other to coordinate files?',
            options: [
              'Yes, via a master consensus protocol',
              'No, they are completely independent and do not require coordination; DataNodes multiplex storage via Block Pools',
              'Only during safe mode',
              'Through shared ZooKeeper locks on every file'
            ],
            correct: 1,
            explanation: 'In Federation, NameNodes are fully independent of each other and require no inter-NameNode coordination.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect the block pool directories in /tmp/hdfs_dn/current/.',
          expectedCommand: 'ls -la /tmp/hdfs_dn/current/'
        }
      }
    }
  ]
};

