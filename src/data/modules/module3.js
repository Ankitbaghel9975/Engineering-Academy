// Module 3: Hadoop and YARN (Yet Another Resource Negotiator)
export const module3 = {
  id: 'mod-3',
  title: 'Module 3: Hadoop and YARN',
  description: 'Master YARN cluster resource management, ResourceManager, NodeManagers, ApplicationMaster lifecycle, container allocation, and MapReduce.',
  badge: 'Compute Core',
  icon: 'Cpu',
  lessons: [
    {
      id: 'm3-l1',
      title: 'Hadoop Architecture Overview',
      duration: '45 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'Hadoop architecture evolved significantly from Hadoop 1.x to Hadoop 2.x and 3.x. In Hadoop 1.x, compute was tightly coupled to MapReduce via the JobTracker (master) and TaskTrackers (slaves), which struggled to scale past 4,000 nodes and could only run MapReduce. Hadoop 2.x introduced YARN (Yet Another Resource Negotiator), completely decoupling cluster resource management from the application execution framework. This architectural revolution transformed Hadoop into a general-purpose distributed operating system capable of running diverse workloads (Spark, Flink, Tez, Storm, HBase, MapReduce) concurrently on a shared multi-tenant cluster.',
        hi: 'Hadoop ka architecture Hadoop 1.x se Hadoop 2.x/3.x me bohot evolve hua. Hadoop 1.x me storage (HDFS) aur compute (MapReduce) aapas me tightly bandhe the — JobTracker akela hi sab manage karta tha aur sirf MapReduce hi chala sakta tha. Hadoop 2.x ne YARN (Yet Another Resource Negotiator) introduce kiya, jisse compute aur resource management ko bilkul alag kar diya gaya. YARN ek operating system ki tarah ban gaya jo cluster ke RAM aur CPU ko baant ta hai — ab aap ek hi cluster par Apache Spark, Flink, Hive, aur MapReduce sab ek saath chala sakte ho.'
      },
      why: 'Enterprises cannot afford separate dedicated physical clusters for batch jobs, streaming, and ad-hoc SQL. YARN allows a single multi-million dollar cluster to be securely shared across data science, engineering, and business teams with dynamic resource isolation.',
      how: '1. Storage Layer (HDFS): Stores raw data blocks across DataNodes.\n2. Resource Management Layer (YARN): Manages compute resources (vCores, RAM, GPUs).\n3. Compute Framework Layer: Spark, MapReduce, Flink request resources from YARN.\n4. Application Layer: User SQL queries, Python scripts, and machine learning pipelines.',
      architecture: {
        type: 'hadoop_yarn_stack',
        title: 'Hadoop 3.x Multi-Engine Architecture on YARN',
        nodes: [
          { name: 'Compute Frameworks', desc: 'Apache Spark | MapReduce | Apache Flink | Presto | Hive on Tez' },
          { name: 'YARN (Resource Layer)', desc: 'ResourceManager (Scheduler + AppManager) + NodeManagers' },
          { name: 'HDFS (Storage Layer)', desc: 'NameNode (Active/Standby) + DataNodes' }
        ]
      },
      industryExample: 'Netflix runs thousands of concurrent Spark jobs, Presto queries, and Python notebooks on giant multi-tenant clusters managed by YARN, dynamically sharing hundreds of petabytes of compute RAM.',
      practicalLab: {
        title: 'Lab 3.1: Checking YARN Cluster Status and Daemons',
        problemStatement: 'Inspect running YARN daemons, check active node managers, and review cluster resource availability.',
        requirements: 'YARN CLI emulator.',
        setup: 'yarn node -list -all',
        instructions: [
          'Step 1: Check active NodeManagers using yarn node -list.',
          'Step 2: Inspect cluster memory and core capacity.'
        ],
        code: `# yarn_check.sh
yarn node -list
yarn application -list
`,
        commands: [
          'yarn node -list',
          'yarn application -list'
        ]
      },
      expectedOutput: `Total Nodes:3
         Node-Id	     Node-State	Node-Http-Address	Number-of-Running-Containers
worker-01:45454	        RUNNING	   worker-01:8042	                           0
worker-02:45454	        RUNNING	   worker-02:8042	                           0
worker-03:45454	        RUNNING	   worker-03:8042	                           0
Total number of applications (including finished) : 0
                Application-Id	      Application-Name	      Application-Type	                    User	                   Queue	                   State	                 Final-State	                 Progress	                        Tracking-URL`,
      troubleshooting: [
        {
          error: 'Application hanging in ACCEPTED state without moving to RUNNING',
          rootCause: 'Cluster has no available memory or CPU vCores to allocate the ApplicationMaster container, or queue capacity is 100% full.',
          solution: 'Inspect yarn queue -status <queue_name>. Free up resources by terminating stagnant jobs or increase yarn.scheduler.maximum-allocation-mb.'
        }
      ],
      bestPractices: [
        'Set yarn.nodemanager.resource.memory-mb to leave at least 20% RAM for OS and DataNode daemons on worker machines.',
        'Use the CapacityScheduler or FairScheduler to prevent a single massive batch job from starving high-priority interactive queries.',
        'Enable YARN Node Labels to schedule GPU-heavy ML tasks exclusively onto GPU-equipped hardware.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is YARN and what was the main limitation of Hadoop 1.0 that YARN resolved?',
          answer: 'YARN (Yet Another Resource Negotiator) is the cluster resource management layer of Hadoop. In Hadoop 1.0, JobTracker was responsible for both resource management and job lifecycle monitoring, creating a massive scalability bottleneck (max ~4000 nodes). Furthermore, Hadoop 1.0 could only run MapReduce. YARN separated resource management from application management and enabled diverse engines like Spark and Flink to run on the cluster.'
        },
        {
          level: 'Intermediate',
          question: 'What are the primary daemons running in a YARN cluster?',
          answer: '1. ResourceManager (Master daemon, coordinates global resource allocation across the cluster), 2. NodeManager (Worker daemon on each machine, manages local containers and reports resource usage), and 3. ApplicationMaster (One per running application, negotiates containers with ResourceManager and oversees task execution).'
        },
        {
          level: 'Advanced',
          question: 'How does YARN handle data locality when allocating containers for a Spark or MapReduce job?',
          answer: 'When an ApplicationMaster requests containers, it passes preferred hostnames and rack locations where input HDFS blocks reside. The YARN Scheduler attempts to allocate containers in order of preference: 1. Node-Local (same machine as data), 2. Rack-Local (same server rack), and 3. Off-Switch (any node). A brief delay (delay scheduling) is applied before falling back, giving the preferred node time to free up resources.'
        }
      ],
      assignment: {
        task: 'Execute yarn node -list to view all active NodeManagers and their container capacities.',
        verificationCriteria: 'Run yarn node -list and verify RUNNING nodes.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which component in Hadoop 2.x/3.x is responsible for cluster-wide resource allocation across all applications?',
            options: ['NameNode', 'ResourceManager', 'NodeManager', 'TaskTracker'],
            correct: 1,
            explanation: 'The ResourceManager is the central authority arbitrating resources among all competing applications in the cluster.'
          }
        ],
        commandChallenge: {
          prompt: 'List all running and registered YARN nodes.',
          expectedCommand: 'yarn node -list'
        }
      }
    },
    {
      id: 'm3-l2',
      title: 'ResourceManager',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'The ResourceManager (RM) is the master daemon of YARN that arbitrates all available compute resources (memory, CPU vCores, GPUs) among competing distributed applications in the cluster. The RM consists of two primary internal components: the Scheduler and the ApplicationsManager (ASM). The Scheduler allocates resources purely based on queue policies and constraints without monitoring application status or restarting failed tasks. The ApplicationsManager accepts job submissions, negotiates the initial container to launch the ApplicationMaster, and restarts the ApplicationMaster if it crashes.',
        hi: 'ResourceManager (RM) poore YARN cluster ka Central Master hota hai. Iska kaam hota hai ye decide karna ki cluster ki total RAM aur CPU kis application ko milenge. RM ke andar do main parts hote hain: 1. Scheduler (jo bina kisi bhedbhaav ke queues ke niyam ke hisaab se RAM/CPU ke containers baant ta hai), aur 2. ApplicationsManager (jo naye jobs ko accept karta hai aur har job ke liye pehla ApplicationMaster container start karwata hai).'
      },
      why: 'Without a centralized resource master, independent jobs would greedily grab 100% of machine memory, triggering out-of-memory kernel panics and starving critical business pipelines.',
      how: '1. Client submits job payload to ResourceManager.\n2. ApplicationsManager validates credentials and allocates Container 0 on an available NodeManager.\n3. ApplicationMaster launches inside Container 0.\n4. ApplicationMaster heartbeats to RM Scheduler, requesting N containers with locality preferences.\n5. RM Scheduler issues resource tokens; ApplicationMaster contacts NodeManagers to launch tasks.',
      architecture: {
        type: 'resourcemanager_internals',
        title: 'ResourceManager Internal Components',
        nodes: [
          { name: 'Scheduler (Plug-in)', desc: 'Pure resource allocator (Capacity/Fair/FIFO). Enforces queues, limits, and priorities.' },
          { name: 'ApplicationsManager (ASM)', desc: 'Accepts submissions, launches AM in Container 0, restarts failed AMs.' },
          { name: 'ResourceTrackerService', desc: 'Receives NodeManager heartbeats and tracks live cluster RAM/Cores.' }
        ]
      },
      industryExample: 'Target uses YARN ResourceManagers to manage clusters during Black Friday sales, prioritizing checkout analytics queues with 80% guaranteed capacity over background marketing reports.',
      practicalLab: {
        title: 'Lab 3.2: Inspecting YARN Scheduler Queues and Allocations',
        problemStatement: 'Query the YARN scheduler to review queue configurations, max capacities, and active applications.',
        requirements: 'YARN CLI emulator.',
        setup: 'yarn queue -status default',
        instructions: [
          'Step 1: Inspect the default queue status using yarn queue -status default.',
          'Step 2: Review queue capacity, absolute capacity, and current state.'
        ],
        code: `# rm_queue_inspect.sh
yarn queue -status default
`,
        commands: [
          'yarn queue -status default'
        ]
      },
      expectedOutput: `Queue-Name : default
State : RUNNING
Capacity : 100.0%
Current-Capacity : 0.0%
Maximum-Capacity : 100.0%
Default-Node-Label-Expression : <DEFAULT_PARTITION>`,
      troubleshooting: [
        {
          error: 'ResourceManager crashes with OutOfMemoryError: GC overhead limit exceeded',
          rootCause: 'Too many simultaneous active applications, massive heartbeat load, or completed application histories accumulated in RM memory.',
          solution: 'Increase RM heap size in yarn-env.sh (YARN_RESOURCEMANAGER_HEAPSIZE=16384). Enable YARN Timeline Service to offload completed job history.'
        }
      ],
      bestPractices: [
        'Deploy ResourceManager in High Availability (RM HA) with Active/Standby nodes backed by ZooKeeper.',
        'Never use the simple FIFO Scheduler in production; always use CapacityScheduler with multi-tenant queues.',
        'Configure yarn.resourcemanager.am.max-fraction to prevent ApplicationMasters from consuming more than 20-30% of total cluster RAM.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What are the two main components of the YARN ResourceManager?',
          answer: 'The two main components are: 1. The Scheduler (allocates cluster resources like CPU and RAM strictly according to queue policies without tracking task progress), and 2. The ApplicationsManager (manages job submissions, allocates the first container for the ApplicationMaster, and handles AM failovers).'
        },
        {
          level: 'Intermediate',
          question: 'What is the difference between CapacityScheduler and FairScheduler?',
          answer: 'CapacityScheduler allocates guaranteed percentages of cluster capacity to specific queues (e.g. Engineering: 50%, Marketing: 30%, Ad-Hoc: 20%). Unused capacity can be temporarily borrowed. FairScheduler dynamically re-adjusts resource allocation so that over time, all active jobs receive an equal ("fair") share of resources, preventing any single job from dominating.'
        },
        {
          level: 'Advanced',
          question: 'How does ResourceManager High Availability (RM HA) prevent split-brain?',
          answer: 'RM HA uses Apache ZooKeeper ActiveStandbyElector. Both ResourceManagers compete to create an ephemeral lock node (/yarn-leader-election) in ZooKeeper. The winner becomes Active. If the active RM crashes, its session expires, the ephemeral node disappears, and the Standby RM acquires the lock and transitions to Active. Data is restored from the ZKRMStateStore.'
        }
      ],
      assignment: {
        task: 'Execute yarn queue -status default to inspect default queue capacity and state.',
        verificationCriteria: 'Run yarn queue -status default and observe State: RUNNING.'
      },
      assessment: {
        quiz: [
          {
            q: 'Does the YARN Scheduler monitor the execution progress of application tasks or restart failed tasks?',
            options: [
              'Yes, it actively monitors every map/reduce task',
              'No, the Scheduler strictly allocates resources; task monitoring and failure recovery are handled by the ApplicationMaster',
              'Only when running Spark jobs',
              'Only during safe mode'
            ],
            correct: 1,
            explanation: 'The YARN Scheduler is purely a resource allocator. It does not monitor task progress or restart failed tasks.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect the status of the default YARN queue.',
          expectedCommand: 'yarn queue -status default'
        }
      }
    },
    {
      id: 'm3-l3',
      title: 'NodeManager',
      duration: '40 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'The NodeManager (NM) is the per-machine worker agent in YARN. It runs on every worker node in the cluster alongside the HDFS DataNode daemon. The NodeManager is responsible for monitoring resource usage (CPU, memory, disk, network) of the local machine, managing container lifecycles (launching, monitoring, terminating), tracking healthy disks, and sending periodic heartbeats to the ResourceManager. It also provides Auxiliary Services, such as the Shuffle Handler used by MapReduce and Spark to transfer intermediate map outputs over HTTP.',
        hi: 'NodeManager (NM) har ek worker computer par chalne wala agent hota hai (jo DataNode ke saath rehta hai). Iska kaam hota hai apne computer ke physical RAM aur CPU ko monitor karna. Jab ResourceManager kisi container ko chalane ka order deta hai, toh NodeManager us container ko launch karta hai, dekhta hai ki wo limit se zyada RAM toh nahi le raha, aur kaam khatam hone par cleanup karta hai. Ye har thodi der me ResourceManager ko report bhejta hai.'
      },
      why: 'Distributed execution requires strict local sandboxing. If an unruly Spark worker task leaks memory or spins infinite loops, the NodeManager kills the container immediately before it crashes the physical server.',
      how: '1. Launch: Receives ContainerLaunchContext from ApplicationMaster with environment, credentials, and launch commands.\n2. Container Process: Forks child JVM process inside a Linux cgroup with enforced RAM and CPU limits.\n3. Monitoring: NM monitoring thread measures RSS (Resident Set Size) and virtual memory.\n4. Enforcement: If container memory exceeds allocated limit, NM sends SIGKILL (Exit code 137).\n5. Cleanup: Wipes local scratch files and notifies RM upon container exit.',
      architecture: {
        type: 'nodemanager_container_mgmt',
        title: 'NodeManager Local Container Management',
        nodes: [
          { name: 'NodeManager Daemon', desc: 'Heartbeats to RM, enforces memory/CPU limits via Linux Cgroups' },
          { name: 'Container 1 (Spark Executor)', desc: 'Allocated 4 GB RAM, 2 vCores' },
          { name: 'Container 2 (Map Task)', desc: 'Allocated 2 GB RAM, 1 vCore' },
          { name: 'Auxiliary Service', desc: 'ShuffleHandler serving intermediate partition partitions over port 13562' }
        ]
      },
      industryExample: 'Uber tunes NodeManager cgroup CPU isolation to run millions of geospatial ride dispatch calculations alongside batch pricing ETLs on the same physical bare-metal hardware without latency spikes.',
      practicalLab: {
        title: 'Lab 3.3: Inspecting Local NodeManager Logs and Health',
        problemStatement: 'Inspect NodeManager status, check disk space thresholds, and review container log directories.',
        requirements: 'Terminal simulator.',
        setup: 'mkdir -p /tmp/yarn/local/usercache /tmp/yarn/logs',
        instructions: [
          'Step 1: Check YARN node status for worker-01.',
          'Step 2: Inspect how NodeManager structures usercache and container logs.'
        ],
        code: `# nodemanager_lab.sh
yarn node -status worker-01:45454
`,
        commands: [
          'yarn node -status worker-01:45454'
        ]
      },
      expectedOutput: `Node Report : 
	Node-Id : worker-01:45454
	Rack : /rack-01
	Node-State : RUNNING
	Node-Http-Address : worker-01:8042
	Last-Health-Update : Wed Nov 11 14:52:10 IST 2026
	Health-Report : 
	Containers : 0
	Memory-Used : 0MB
	Memory-Capacity : 16384MB
	CPU-Used : 0 vcores
	CPU-Capacity : 8 vcores`,
      troubleshooting: [
        {
          error: 'NodeManager marked as UNHEALTHY: 1/1 local-dirs usable space is below configured threshold 0.10',
          rootCause: 'The local disk partition hosting yarn.nodemanager.local-dirs is 90%+ full of temporary shuffle files or OS logs.',
          solution: 'Clear old logs in /tmp/hadoop-yarn or increase disk space. Configure yarn.nodemanager.disk-health-checker.max-disk-utilization-per-disk-percentage (default 90.0).'
        }
      ],
      bestPractices: [
        'Enable Linux Containers (Cgroups) via LinuxContainerExecutor to enforce hard CPU and memory boundaries.',
        'Configure multiple high-speed SSD disks in yarn.nodemanager.local-dirs to prevent disk I/O bottlenecks during Spark shuffle.',
        'Turn on YARN log aggregation (yarn.log-aggregation-enable = true) to automatically upload container logs to HDFS upon job completion.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the responsibility of the NodeManager in YARN?',
          answer: 'The NodeManager is the worker daemon running on each machine in the cluster. It manages the lifecycles of individual containers on that node, monitors local resource utilization (CPU, RAM), executes container launch commands from the ApplicationMaster, and reports node status to the ResourceManager.'
        },
        {
          level: 'Intermediate',
          question: 'What happens when a container exceeds its allocated physical memory limit?',
          answer: 'The NodeManager continuously monitors the resident memory (RSS) of every container process tree. If a container exceeds its configured yarn.nodemanager.pmem-check limit, the NodeManager forcibly terminates the container with SIGKILL (Exit code 137 / Container killed by YARN for exceeding memory limits).'
        },
        {
          level: 'Advanced',
          question: 'What is YARN Log Aggregation and why is it essential for production debugging?',
          answer: 'By default, container logs (stdout, stderr, syslog) are stored locally on each worker machine. In a 500-node cluster, tracking down logs for a failed task across 500 machines is painful. When Log Aggregation is enabled, as soon as an application finishes, each NodeManager uploads its container logs to a centralized directory in HDFS (/app-logs). Engineers can then inspect all logs seamlessly using yarn logs -applicationId <app_id>.'
        }
      ],
      assignment: {
        task: 'Execute yarn node -status worker-01:45454 to inspect the node rack, state, and memory capacity.',
        verificationCriteria: 'Run yarn node -status worker-01:45454 and verify Node-State : RUNNING.'
      },
      assessment: {
        quiz: [
          {
            q: 'If a Spark executor container allocated 4 GB RAM starts consuming 4.5 GB RAM on a worker node, what does NodeManager do?',
            options: [
              'Quietly borrows RAM from OS without action',
              'Kills the container process immediately for exceeding memory limits (Exit code 137)',
              'Pauses the CPU until memory drops',
              'Compresses the heap to disk'
            ],
            correct: 1,
            explanation: 'NodeManager enforces strict memory governance and kills containers exceeding their memory quota to protect host stability.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect status and capacity of worker-01:45454.',
          expectedCommand: 'yarn node -status worker-01:45454'
        }
      }
    },
    {
      id: 'm3-l4',
      title: 'ApplicationMaster',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'The ApplicationMaster (AM) is a framework-specific master process that coordinates an individual application\'s execution lifecycle. Unlike the monolithic JobTracker in Hadoop 1.x, YARN instantiates a dedicated ApplicationMaster instance for every single running job (one AM for Spark Job #1, another AM for MapReduce Job #2). The AM negotiates resource containers from the ResourceManager Scheduler, generates task graphs, dispatches tasks to NodeManagers, monitors individual task progress, handles task-level failures, and reports final application status back to the client.',
        hi: 'ApplicationMaster (AM) har ek chalne wale job ka apna personal project manager hota hai. Hadoop 1.0 me ek hi JobTracker sab kuch karta tha. YARN me jab bhi aap koi naya Spark ya MapReduce job submit karte ho, toh ResourceManager uske liye ek alag ApplicationMaster banata hai. Ye AM ResourceManager se jaakar kehta hai: "Bhaiya, mujhe 10 containers chahiye jinme 4GB RAM ho". Fir wo containers milne par NodeManagers se tasks run karwata hai, task fail hone par retry karta hai, aur kaam poora hone par self-destruct ho jaata hai.'
      },
      why: 'Decoupling application management from the global ResourceManager allows YARN clusters to scale to 10,000+ nodes. The ResourceManager only handles macro-level resource requests, while thousands of ApplicationMasters handle the micro-level task tracking in parallel.',
      how: '1. Launch: ASM requests NM to start Container 0 with AM binary (e.g. SparkSubmit / MRAppMaster).\n2. Registration: AM registers with RM and exposes a tracking Web UI URL.\n3. Resource Request: AM sends heartbeat RPCs to RM asking for containers with locality preferences.\n4. Execution: When containers are leased, AM contacts NMs to launch executor/task processes.\n5. Progress & Finish: AM tracks completion; once all tasks commit, AM unregisters with RM and exits cleanly.',
      architecture: {
        type: 'applicationmaster_lifecycle',
        title: 'ApplicationMaster Execution Flow',
        nodes: [
          { name: '1. App Submission', desc: 'Client submits Spark/MR application -> RM allocates Container 0' },
          { name: '2. AM Launch', desc: 'NodeManager launches ApplicationMaster process in Container 0' },
          { name: '3. Negotiation', desc: 'AM requests N containers from RM Scheduler with Data Locality targets' },
          { name: '4. Task Dispatch', desc: 'AM sends ContainerLaunchContext to worker NMs to start execution' }
        ]
      },
      industryExample: 'Databricks and Cloudera manage high-concurrency analytics platforms where hundreds of user Spark ApplicationMasters execute independently without interfering with each other.',
      practicalLab: {
        title: 'Lab 3.4: Tracking Applications and AM Status via YARN CLI',
        problemStatement: 'Inspect running and finished applications, find application IDs, and inspect tracking URLs.',
        requirements: 'YARN CLI emulator.',
        setup: 'yarn application -list -appStates ALL',
        instructions: [
          'Step 1: Run yarn application -list -appStates ALL to see all applications.',
          'Step 2: Inspect application state, final state, and tracking URL.'
        ],
        code: `# app_master_track.sh
yarn application -list -appStates ALL
`,
        commands: [
          'yarn application -list -appStates ALL'
        ]
      },
      expectedOutput: `Total number of applications (including finished) : 1
                Application-Id	      Application-Name	      Application-Type	                    User	                   Queue	                   State	                 Final-State	                 Progress	                        Tracking-URL
application_1731315000000_0001	      Spark_Daily_ETL	                 SPARK	                  hadoop	                 default	                FINISHED	                   SUCCEEDED	                     100%	http://worker-01:4040/jobs/`,
      troubleshooting: [
        {
          error: 'ApplicationMaster failed 2 times. Max AM attempts reached.',
          rootCause: 'The ApplicationMaster itself crashed repeatedly due to driver OOM, missing dependencies, or syntax errors.',
          solution: 'Inspect AM container logs using yarn logs -applicationId <app_id> -containerId <container_0_id>. Increase AM driver memory via spark.driver.memory.'
        }
      ],
      bestPractices: [
        'Size the ApplicationMaster driver appropriately: for large Spark jobs collecting data, allocate at least 4 GB - 8 GB to the driver.',
        'Tune yarn.resourcemanager.am.max-attempts (default 2) to allow automatic recovery from transient node failures.',
        'Always clean up SparkContext/Hive sessions at the end of scripts to ensure the AM terminates and releases its container.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is an ApplicationMaster in YARN?',
          answer: 'The ApplicationMaster is an application-specific process that coordinates the execution of an individual application in YARN. It negotiates resources from the ResourceManager and collaborates with NodeManagers to execute and monitor tasks.'
        },
        {
          level: 'Intermediate',
          question: 'What happens if the ApplicationMaster process crashes during job execution?',
          answer: 'The ResourceManager detects the AM failure via missed heartbeats. The ApplicationsManager automatically allocates a new container on a healthy NodeManager and relaunches the ApplicationMaster (up to yarn.resourcemanager.am.max-attempts). Modern engines like Spark checkpoint task progress so the new AM can resume without re-running finished tasks.'
        },
        {
          level: 'Advanced',
          question: 'How do Spark on YARN "Client Mode" and "Cluster Mode" differ in terms of ApplicationMaster placement?',
          answer: 'In YARN Client Mode, the Spark Driver runs on the client/edge machine outside the cluster, and only an ExecutorLauncher runs inside YARN as the AM. If the client closes their laptop/terminal, the job dies. In YARN Cluster Mode, the Spark Driver is packaged and runs directly inside the ApplicationMaster container on a cluster worker node; the client can disconnect immediately, and the job runs safely to completion.'
        }
      ],
      assignment: {
        task: 'Execute yarn application -list -appStates ALL to inspect historical applications and their final state.',
        verificationCriteria: 'Run yarn application -list -appStates ALL and verify application IDs.'
      },
      assessment: {
        quiz: [
          {
            q: 'Where does the Spark Driver run when submitting a job in Spark on YARN "Cluster Mode"?',
            options: [
              'On the developer\'s local laptop',
              'Directly inside the YARN ApplicationMaster container on a cluster worker node',
              'Inside the NameNode JVM',
              'Inside the ZooKeeper quorum'
            ],
            correct: 1,
            explanation: 'In cluster mode, the driver runs inside the ApplicationMaster container on a cluster node, making it resilient to client disconnects.'
          }
        ],
        commandChallenge: {
          prompt: 'List all YARN applications across all states.',
          expectedCommand: 'yarn application -list -appStates ALL'
        }
      }
    },
    {
      id: 'm3-l5',
      title: 'Container Management',
      duration: '40 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'A YARN Container is the fundamental abstraction of compute resources in Hadoop. A container represents an allocated allocation of physical resources — specifically Memory (RAM), Virtual CPU cores (vCores), and optionally GPUs or disk storage — on a single worker node. When an ApplicationMaster requests resources, YARN grants Container Leases. The NodeManager then launches the task process inside that leased container, providing process isolation and resource governance.',
        hi: 'YARN Container compute resource ka ek basic packet hota hai. Socho agar ek worker node ke paas 64 GB RAM aur 16 CPU cores hain, toh YARN use chhote-chhote containers me baant deta hai (jaise 4 GB RAM + 2 Cores ka ek Container). Jab bhi kisi task ko chalna hota hai, use ek container allot kiya jaata hai. Wo task us container ki boundaries ke andar hi execute hota hai, jisse baaki tasks secure aur uninhibited rehte hain.'
      },
      why: 'Containers prevent "noisy neighbor" problems in shared multi-tenant clusters. Without container isolation, a single poorly written recursive script could consume 100% of a server\'s RAM, crashing other critical enterprise tasks.',
      how: '1. Allocation: RM Scheduler grants a container token containing ContainerId, NodeId, Memory, and vCores.\n2. Container ID Format: container_e<epoch>_<clusterTimestamp>_<appId>_<attemptId>_<containerIndex>.\n3. Launch: AM sends ContainerLaunchContext (environment variables, tokens, commands) to NodeManager.\n4. Cgroup Enforcement: Linux kernel cgroups restrict memory and CPU bandwidth.\n5. Termination: NM reclaims memory immediately upon process exit.',
      architecture: {
        type: 'yarn_container_slice',
        title: 'YARN Worker Node Resource Slicing',
        nodes: [
          { name: 'Worker Physical Node (32GB / 8 Cores)', desc: 'OS & Daemons Reserved: 4GB RAM + 1 Core' },
          { name: 'Container 1: Spark Executor', desc: '8 GB RAM + 2 vCores (Active)' },
          { name: 'Container 2: Spark Executor', desc: '8 GB RAM + 2 vCores (Active)' },
          { name: 'Available Unallocated Slice', desc: '12 GB RAM + 3 vCores ready for new requests' }
        ]
      },
      industryExample: 'LinkedIn runs thousands of concurrent Spark containers per cluster, automatically sizing container memory to fit varying data partition sizes and avoiding OutOfMemory (OOM) failures.',
      practicalLab: {
        title: 'Lab 3.5: Reading Container Logs and Troubleshooting Failures',
        problemStatement: 'Inspect container logs for an application using the yarn logs command to diagnose execution issues.',
        requirements: 'YARN CLI emulator.',
        setup: 'yarn logs -applicationId application_1731315000000_0001',
        instructions: [
          'Step 1: Retrieve container logs for application_1731315000000_0001.',
          'Step 2: Inspect stdout, stderr, and syslog sections.'
        ],
        code: `# yarn_logs_lab.sh
yarn logs -applicationId application_1731315000000_0001
`,
        commands: [
          'yarn logs -applicationId application_1731315000000_0001'
        ]
      },
      expectedOutput: `Container: container_1731315000000_0001_01_000001 on worker-01:45454
================================================================================
LogType:syslog
Log Upload Time:Wed Nov 11 14:50:00 IST 2026
LogLength:240
2026-11-11 14:49:50,102 INFO [main] org.apache.spark.deploy.yarn.ApplicationMaster: Registered signal handlers
2026-11-11 14:49:50,420 INFO [main] org.apache.spark.deploy.yarn.ApplicationMaster: ApplicationAttemptId: appattempt_1731315000000_0001_000001
2026-11-11 14:49:51,001 INFO [main] org.apache.spark.deploy.yarn.ApplicationMaster: Started SparkContext successfully
LogType:stdout
LogLength:34
Spark Job Processed 100000 records`,
      troubleshooting: [
        {
          error: 'Container killed by YARN for exceeding memory limits. 4.1 GB of 4 GB physical memory used.',
          rootCause: 'JVM off-heap overhead (Python worker processes, direct byte buffers, or shuffle buffers) exceeded container boundaries.',
          solution: 'Increase Spark memory overhead: spark.yarn.executor.memoryOverhead (default 10% or 384MB; increase to 20% or 1024MB).'
        }
      ],
      bestPractices: [
        'Configure yarn.scheduler.minimum-allocation-mb (e.g. 1024MB) and maximum-allocation-mb (e.g. 32768MB).',
        'Configure yarn.nodemanager.vmem-check-enabled = false in clouds like AWS EC2 to avoid false kills caused by glibc virtual memory allocations.',
        'Use yarn.nodemanager.resource.percentage-physical-cpu-limit to cap container CPU usage and prevent server starvation.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Container in YARN?',
          answer: 'A YARN Container is a logical bundle of physical computing resources (specific amount of RAM and CPU vCores) allocated by the ResourceManager on a specific worker node to execute an application task.'
        },
        {
          level: 'Intermediate',
          question: 'What are the minimum and maximum container allocation properties in YARN?',
          answer: 'yarn.scheduler.minimum-allocation-mb defines the smallest memory slice YARN will allocate (requests smaller are rounded up). yarn.scheduler.maximum-allocation-mb defines the largest single container memory size allowed in the cluster. Equivalent properties exist for vCores (yarn.scheduler.minimum-allocation-vcores and maximum-allocation-vcores).'
        },
        {
          level: 'Advanced',
          question: 'Why do PySpark containers frequently get killed by YARN for exceeding physical memory even when spark.executor.memory is set high?',
          answer: 'In PySpark, data processing often occurs inside Python daemon worker processes (via Py4J) outside the JVM heap. The spark.executor.memory setting only covers the JVM heap. The Python process memory is counted against YARN off-heap memory. If off-heap memory exceeds spark.executor.memoryOverhead (default 10%), YARN kills the container. The fix is increasing spark.executor.memoryOverhead.'
        }
      ],
      assignment: {
        task: 'Execute yarn logs -applicationId application_1731315000000_0001 to inspect the stdout and syslog output.',
        verificationCriteria: 'Run yarn logs -applicationId application_1731315000000_0001 and review logs.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which YARN parameter determines the minimum memory increment allocated to any container?',
            options: [
              'yarn.nodemanager.resource.memory-mb',
              'yarn.scheduler.minimum-allocation-mb',
              'dfs.blocksize',
              'spark.executor.memory'
            ],
            correct: 1,
            explanation: 'yarn.scheduler.minimum-allocation-mb specifies the smallest memory allocation granularity for containers.'
          }
        ],
        commandChallenge: {
          prompt: 'Retrieve the aggregated logs for application_1731315000000_0001.',
          expectedCommand: 'yarn logs -applicationId application_1731315000000_0001'
        }
      }
    },
    {
      id: 'm3-l6',
      title: 'Job Scheduling & Schedulers',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'In YARN, job scheduling determines which applications get cluster resources and in what order. YARN provides three pluggable schedulers: 1. FIFO Scheduler (First-In, First-Out: simple queue, large jobs block all subsequent jobs; unusable for multi-tenant production), 2. Capacity Scheduler (Designed for multi-tenant enterprise sharing: cluster is partitioned into hierarchical queues with guaranteed minimum capacities, elastic borrowing, and access control lists), and 3. Fair Scheduler (Dynamically assigns resources so that all running jobs get an equal share of compute over time).',
        hi: 'YARN me Job Scheduling ka matlab hai ki jab 10 alag-alag log jobs bhejte hain, toh pehle kise resources milenge. YARN me 3 tarah ke Schedulers hote hain: 1. FIFO Scheduler (First In First Out - jo pehle aaya wo pehle chalega; production me bekar hota hai kyunki bada job chhoton ko block kar deta hai), 2. Capacity Scheduler (Enterprise standard - isme cluster ki RAM/CPU ko departments me baant diya jaata hai, jaise 50% Engineering, 30% Finance, 20% Marketing), aur 3. Fair Scheduler (ye resources ko barabar-barabar hisson me baant ta hai).'
      },
      why: 'In a company with hundreds of data engineers, data scientists, and automated Airflow pipelines, a rogue query without scheduling governance would monopolize 100% of the cluster, blocking revenue-critical hourly ETL pipelines.',
      how: '1. Queue Hierarchy: Root queue splits into parent and leaf queues (root.prod, root.dev, root.analytics).\n2. Minimum Guarantee: root.prod is guaranteed 60% capacity; root.dev is guaranteed 40%.\n3. Elastic Borrowing: If root.dev is idle, root.prod can borrow up to 100% maximum capacity.\n4. Preemption: When a job arrives in root.dev, YARN can reclaim (preempt) borrowed containers back.\n5. User Limits: yarn.scheduler.capacity.root.dev.user-limit-factor prevents a single developer from grabbing the entire queue.',
      architecture: {
        type: 'capacity_scheduler_tree',
        title: 'YARN Hierarchical Capacity Scheduler Tree',
        nodes: [
          { name: 'root Queue (100% Total Cluster)', desc: 'Top-level root capacity container' },
          { name: 'root.production (60% Guaranteed)', desc: 'High-priority hourly pipelines; max capacity 100%; strict SLA' },
          { name: 'root.analytics (25% Guaranteed)', desc: 'Business BI queries, Presto/Trino ad-hoc reports' },
          { name: 'root.development (15% Guaranteed)', desc: 'Data science experiments, sandbox notebooks' }
        ]
      },
      industryExample: 'Apple uses YARN Capacity Scheduler with strict queue hierarchies and preemption across thousands of nodes to guarantee that Siri telemetry processing meets latency SLAs while allowing data scientists to run ad-hoc model training in low-priority queues.',
      practicalLab: {
        title: 'Lab 3.6: Inspecting Capacity Scheduler Hierarchy',
        problemStatement: 'Inspect YARN scheduler configuration, check active queue weights, and understand user limits.',
        requirements: 'YARN CLI emulator.',
        setup: 'yarn queue -status root',
        instructions: [
          'Step 1: Check root queue hierarchy with yarn queue -status root.',
          'Step 2: Verify sub-queues and current utilization.'
        ],
        code: `# scheduler_inspect.sh
yarn queue -status root
`,
        commands: [
          'yarn queue -status root'
        ]
      },
      expectedOutput: `Queue-Name : root
State : RUNNING
Capacity : 100.0%
Current-Capacity : 0.0%
Maximum-Capacity : 100.0%
Child-Queues : default`,
      troubleshooting: [
        {
          error: 'Jobs stuck in ACCEPTED queue while cluster utilization is only 50%',
          rootCause: 'The specific sub-queue (e.g. root.dev) has hit its maximum capacity limit, even though other queues have free resources.',
          solution: 'Increase maximum-capacity on the sub-queue in capacity-scheduler.xml or submit the job to a different queue using -Dmapreduce.job.queuename=analytics.'
        }
      ],
      bestPractices: [
        'Always use CapacityScheduler for multi-tenant production enterprise clusters.',
        'Enable Preemption (yarn.resourcemanager.scheduler.monitor.enable = true) so high-priority production queues can reclaim borrowed resources promptly.',
        'Use yarn rmadmin -refreshQueues to apply capacity changes dynamically without restarting the ResourceManager.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What are the three main schedulers available in Apache YARN?',
          answer: 'The three schedulers are: 1. FIFO Scheduler, 2. Capacity Scheduler (default in Apache Hadoop distribution), and 3. Fair Scheduler.'
        },
        {
          level: 'Intermediate',
          question: 'What is Container Preemption in YARN Capacity Scheduler?',
          answer: 'Preemption is the mechanism where YARN forcibly reclaims containers from a lower-priority queue that borrowed capacity, returning those resources to a higher-priority queue when high-priority jobs arrive. YARN sends a graceful termination warning to the borrowed container before killing it.'
        },
        {
          level: 'Advanced',
          question: 'How do you update queue capacities in a live production cluster without restarting YARN daemons?',
          answer: 'You modify the capacity-scheduler.xml configuration file on the active ResourceManager host, and then execute the administrative command: yarn rmadmin -refreshQueues. The ResourceManager re-reads the XML configuration and re-adjusts queue capacities on the fly with zero cluster downtime.'
        }
      ],
      assignment: {
        task: 'Execute yarn queue -status root to inspect the top-level queue hierarchy.',
        verificationCriteria: 'Run yarn queue -status root and observe State: RUNNING.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which command updates YARN CapacityScheduler queues dynamically without restarting cluster daemons?',
            options: [
              'yarn restart scheduler',
              'yarn rmadmin -refreshQueues',
              'hdfs dfsadmin -refresh',
              'systemctl reload yarn'
            ],
            correct: 1,
            explanation: 'yarn rmadmin -refreshQueues dynamically reloads queue definitions and limits without stopping the ResourceManager.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect the root YARN queue status.',
          expectedCommand: 'yarn queue -status root'
        }
      }
    },
    {
      id: 'm3-l7',
      title: 'Resource Allocation & Sizing',
      duration: '45 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'Resource allocation and sizing in YARN is the engineering discipline of calculating optimal RAM and CPU core distributions across master daemons, worker daemons, operating system buffers, and executor containers. A common mistake is allocating 100% of a worker node\'s physical RAM to YARN. If a machine has 128 GB RAM and 32 CPU cores, allocating all 128 GB to YARN causes the Linux kernel OOM-killer to terminate the DataNode, NodeManager, or OS kernel itself. A senior data engineer meticulously sizes OS reserves, daemon footprints, and container dimensions.',
        hi: 'Resource Allocation aur Sizing Big Data engineering ka bohot crucial topic hai. Agar ek worker server me 128 GB RAM aur 32 Cores hain, aur aapne poori 128 GB YARN ko de di, toh Linux OS aur DataNode ke paas memory nahi bachegi — aur Linux kernel crash ho jayega! Ek senior engineer hamesha calculate karta hai: OS ke liye 16-24 GB chhodna, DataNode ke liye 4 GB chhodna, aur baaki bachi memory ko YARN NodeManager me containers ke roop me baantna.'
      },
      why: 'Improper sizing causes 80% of cluster production outages: either jobs run with 1 executor per node (wasting 90% parallelism) or 100 tiny executors per node (crushed by JVM garbage collection and broadcast overhead).',
      how: 'Sizing Formula for a 128 GB RAM / 32 Core Node:\n1. OS & Daemons Reserve: Reserve 24 GB RAM and 2 Cores for OS, DataNode, and NodeManager.\n2. Available for YARN: 104 GB RAM and 30 vCores.\n3. Executor Sizing: Best practice is 5 vCores per executor (optimal HDFS I/O throughput: >5 vCores hurts HDFS client throughput; <3 wastes parallelism).\n4. Total Executors per node = 30 / 5 = 6 executors.\n5. Memory per executor = 104 GB / 6 = ~17 GB.\n6. Split Memory: 15 GB JVM Heap (spark.executor.memory) + 2 GB Off-Heap Overhead (spark.executor.memoryOverhead).',
      architecture: {
        type: 'resource_sizing_breakdown',
        title: 'Worker Node Sizing Blueprint (128GB RAM / 32 Cores)',
        nodes: [
          { name: 'OS & Daemons Reserved', desc: '24 GB RAM + 2 Cores (Linux OS, DataNode, NodeManager)' },
          { name: 'YARN Total Capacity', desc: '104 GB RAM + 30 vCores' },
          { name: '6x Balanced Executors', desc: 'Each: 5 vCores + 15 GB Heap + 2 GB Overhead = 17 GB per executor' }
        ]
      },
      industryExample: 'Netflix, Uber, and Databricks configure their standard Big Data compute worker nodes using this exact 5-vCore executor sizing formula to achieve maximum Spark throughput.',
      practicalLab: {
        title: 'Lab 3.7: Calculating Production YARN Sizing Properties',
        problemStatement: 'Inspect system memory and CPU cores on a node and calculate the exact yarn-site.xml values.',
        requirements: 'Terminal simulator with free and nproc.',
        setup: 'free -g && nproc',
        instructions: [
          'Step 1: Check total physical memory in GB using free -g.',
          'Step 2: Check total cores using nproc.',
          'Step 3: Calculate yarn.nodemanager.resource.memory-mb.'
        ],
        code: `# calculate_yarn_sizing.sh
TOTAL_RAM_GB=$(free -g | awk '/^Mem:/{print $2}')
TOTAL_CORES=$(nproc)
echo "Total Physical RAM: \${TOTAL_RAM_GB} GB"
echo "Total Physical Cores: \${TOTAL_CORES}"
# Reserve 20% for OS
YARN_RAM_GB=$((TOTAL_RAM_GB * 80 / 100))
echo "Allocated to YARN: \${YARN_RAM_GB} GB (\${YARN_RAM_MB} MB)"
`,
        commands: [
          'free -m',
          'nproc'
        ]
      },
      expectedOutput: `              total        used        free      shared  buff/cache   available
Mem:          16384        4210        8120         210        4054       11964
Swap:          2048           0        2048
8`,
      troubleshooting: [
        {
          error: 'Linux Kernel Out Of Memory (OOM) Killer invokes: Killed process DataNode (pid 12650)',
          rootCause: 'YARN containers were allowed to consume 100% of host physical RAM; when OS needed buffer memory, it terminated the DataNode.',
          solution: 'Lower yarn.nodemanager.resource.memory-mb in yarn-site.xml to reserve at least 15-20% RAM strictly for OS and background daemons.'
        }
      ],
      bestPractices: [
        'Never allocate more than 5 vCores per Spark executor; benchmarks show HDFS client write throughput saturates and degrades with >5 cores per JVM.',
        'Keep executor memory between 16 GB and 32 GB; exceeding 40 GB triggers severe Java GC Stop-the-World pauses.',
        'Always set spark.yarn.executor.memoryOverhead to at least 15-20% for PySpark workloads.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'Why should you NOT allocate 100% of a worker node\'s RAM and CPU cores to YARN?',
          answer: 'A worker node must also run the operating system kernel, background system services, the HDFS DataNode daemon, and the YARN NodeManager daemon. If YARN is given 100% of RAM, the Linux kernel will run out of memory and invoke the OOM-killer, killing critical daemons like DataNode and crashing the node.'
        },
        {
          level: 'Intermediate',
          question: 'Why is 5 vCores per executor considered the golden standard in Spark on YARN sizing?',
          answer: 'Extensive production benchmarking shows that assigning more than 5 cores to a single JVM executor causes HDFS I/O throughput to degrade due to thread contention and excessive garbage collection overhead. Assigning fewer than 3 cores wastes executor parallelism and increases overhead. 5 vCores per executor hits the sweet spot.'
        },
        {
          level: 'Advanced',
          question: 'Given a worker node with 64 GB RAM and 16 CPU cores, how would you size Spark executors on YARN?',
          answer: '1. Reserve 12 GB RAM and 1 Core for OS/DataNode/NodeManager. Available for YARN = 52 GB RAM, 15 Cores. 2. Target 5 vCores per executor -> Total executors = 15 / 5 = 3 executors per node. 3. Memory per executor = 52 GB / 3 = ~17 GB. 4. Split memory: 15 GB JVM heap (spark.executor.memory) + 2 GB off-heap overhead (spark.executor.memoryOverhead).'
        }
      ],
      assignment: {
        task: 'Execute free -m and nproc in terminal and verify the formula for reserving 20% for OS and daemons.',
        verificationCriteria: 'Run free -m and nproc.'
      },
      assessment: {
        quiz: [
          {
            q: 'What is the recommended number of vCores per Spark executor on YARN for optimal HDFS I/O throughput?',
            options: ['1 vCore', '5 vCores', '24 vCores', '64 vCores'],
            correct: 1,
            explanation: '5 vCores per executor provides optimal HDFS read/write throughput without severe thread contention.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect system memory in megabytes.',
          expectedCommand: 'free -m'
        }
      }
    },
    {
      id: 'm3-l8',
      title: 'MapReduce Architecture',
      duration: '50 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'MapReduce is the foundational distributed computing paradigm popularized by Google and implemented in Apache Hadoop. It breaks complex data processing into two primary phases: Map and Reduce, separated by a distributed Shuffle and Sort phase. In the Map phase, input splits of data are transformed into intermediate key-value pairs (K1, V1 -> list(K2, V2)). In the Shuffle & Sort phase, the framework automatically sorts and groups all values associated with the same key and routes them over the network to the same Reducer. In the Reduce phase, user logic aggregates or processes the grouped values to produce the final output (K2, list(V2) -> list(K3, V3)).',
        hi: 'MapReduce distributed processing ka sabse pehla aur powerful model tha. Ye kisi bhi bade kaam ko do main hisson me todta hai: Map aur Reduce, jinke beech me Shuffle & Sort hota hai:\n1. Map Phase: Har ek data block par Mapper chalte hain aur unhe Key-Value pairs me todte hain (jaise WordCount me: ("apple", 1), ("banana", 1)).\n2. Shuffle & Sort: Framework same key wale saare data ko ek saath group karta hai aur network ke through sahi Reducer machine par bhejta hai.\n3. Reduce Phase: Reducer saare grouped values ko jodkar final answer nikalta hai (jaise: ("apple", [1,1,1]) -> ("apple", 3)).'
      },
      why: 'While Apache Spark has largely replaced MapReduce for interactive analytics due to in-memory caching, MapReduce remains the ultimate fault-tolerant batch engine for multi-day batch transformations over hundreds of petabytes because it materializes every stage to disk.',
      how: '1. InputFormat & RecordReader: Splits HDFS file into InputSplits; reads lines as (offset, text).\n2. Mapper: Runs map() function in parallel on local DataNodes.\n3. In-Memory Buffer: Map outputs written to 100 MB circular buffer (io.sort.mb).\n4. Spill: When buffer hits 80%, spills sorted partitions to local disk.\n5. Combiner (Mini-Reducer): Pre-aggregates map output locally to reduce network shuffle.\n6. Shuffle: Reducers fetch their key partitions over HTTP from all Mappers.\n7. Reducer: Executes reduce() and writes final output to HDFS with 3x replication.',
      architecture: {
        type: 'mapreduce_data_flow',
        title: 'Complete MapReduce Execution Pipeline',
        nodes: [
          { name: 'Input Splits (HDFS)', desc: '128 MB blocks read locally by Mappers' },
          { name: 'Map Phase + Combiner', desc: 'map(k, v) -> local in-memory sort -> local spill to disk' },
          { name: 'Shuffle & Sort', desc: 'Network hash partition exchange grouping by key' },
          { name: 'Reduce Phase (HDFS Write)', desc: 'reduce(key, values) -> output part-r-00000 written to HDFS' }
        ]
      },
      industryExample: 'The classic WordCount and PageRank algorithms were first executed across the public web graph by Google and Yahoo using this exact MapReduce pipeline.',
      practicalLab: {
        title: 'Lab 3.8: Running a Distributed WordCount Job',
        problemStatement: 'Run the Hadoop MapReduce WordCount example against a text dataset in HDFS and inspect the output directory.',
        requirements: 'Hadoop MapReduce CLI emulator.',
        setup: 'hdfs dfs -mkdir -p /data/wordcount/input',
        instructions: [
          'Step 1: Create a text file and upload to /data/wordcount/input.',
          'Step 2: Run the MapReduce job.',
          'Step 3: Inspect the generated part-r-00000 output file.'
        ],
        code: `# mapreduce_wordcount.sh
echo "big data engineering with hadoop and spark" > /tmp/wc_input.txt
echo "hadoop hdfs distributed storage hadoop yarn" >> /tmp/wc_input.txt
hdfs dfs -mkdir -p /data/wordcount/input
hdfs dfs -put -f /tmp/wc_input.txt /data/wordcount/input/
# Run simulated MapReduce
hdfs dfs -mkdir -p /data/wordcount/output
cat << 'EOF' > /tmp/part-r-00000
and	1
big	1
data	1
distributed	1
engineering	1
hadoop	3
hdfs	1
spark	1
storage	1
with	1
yarn	1
EOF
hdfs dfs -put -f /tmp/part-r-00000 /data/wordcount/output/
hdfs dfs -cat /data/wordcount/output/part-r-00000 | grep hadoop
`,
        commands: [
          'hdfs dfs -cat /data/wordcount/output/part-r-00000'
        ]
      },
      expectedOutput: `and	1
big	1
data	1
distributed	1
engineering	1
hadoop	3
hdfs	1
spark	1
storage	1
with	1
yarn	1`,
      troubleshooting: [
        {
          error: 'org.apache.hadoop.mapred.FileAlreadyExistsException: Output directory /data/wordcount/output already exists',
          rootCause: 'Hadoop MapReduce strictly forbids writing to an existing output directory to prevent accidental data overwrites.',
          solution: 'Delete the output directory prior to running the job: hdfs dfs -rm -r /data/wordcount/output.'
        }
      ],
      bestPractices: [
        'Always implement a Combiner (mini-reducer) whenever the reduce operation is associative and commutative (like SUM, COUNT, MIN, MAX) to drastically cut network shuffle traffic.',
        'Tune mapreduce.task.io.sort.mb (e.g. 256MB - 512MB) to prevent frequent disk spills during the Map phase.',
        'Use Apache Spark for iterative ML algorithms, as MapReduce writes intermediate steps to disk, making iterative algorithms 10x - 100x slower.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What are the three main phases of a MapReduce job?',
          answer: 'The three main phases are: 1. Map Phase (transforms input records into intermediate key-value pairs), 2. Shuffle & Sort Phase (groups and routes all values for each key across the network to the designated reducer), and 3. Reduce Phase (processes and aggregates the grouped values per key and writes output to HDFS).'
        },
        {
          level: 'Intermediate',
          question: 'What is the role of the Combiner in MapReduce and when can it NOT be used?',
          answer: 'The Combiner is an optional "mini-reducer" that runs locally on the mapper node directly after the map phase. It pre-aggregates key-value pairs before sending them across the network, saving massive network bandwidth. It can only be used when the aggregation operation is commutative and associative (like SUM or COUNT). It CANNOT be used for operations like AVERAGE because AVG(AVG(A), AVG(B)) does not equal AVG(A + B).'
        },
        {
          level: 'Advanced',
          question: 'Why is Apache Spark 10x to 100x faster than Hadoop MapReduce?',
          answer: 'MapReduce writes every intermediate step to local disk and replicates final outputs to HDFS, incurring heavy disk I/O, serialization, and deserialization overhead between steps. Spark holds intermediate data in-memory (RAM) across pipeline transformations using Resilient Distributed Datasets (RDDs) and executes transformations via an optimized directed acyclic graph (DAG), avoiding costly disk roundtrips.'
        }
      ],
      assignment: {
        task: 'Inspect the WordCount output file in /data/wordcount/output/part-r-00000 using hdfs dfs -cat in terminal.',
        verificationCriteria: 'Run hdfs dfs -cat /data/wordcount/output/part-r-00000 and view word frequencies.'
      },
      assessment: {
        quiz: [
          {
            q: 'Why can a Combiner NOT be safely used for calculating the mathematical AVERAGE of numbers?',
            options: [
              'Because AVERAGE requires floating point numbers',
              'Because AVERAGE is not an associative/commutative operation',
              'Because Combiners only work on Strings',
              'Because YARN prohibits division in Mappers'
            ],
            correct: 1,
            explanation: 'Average is not associative: the average of two sub-averages is mathematically different from the overall average unless group sizes are identical.'
          }
        ],
        commandChallenge: {
          prompt: 'Display the contents of /data/wordcount/output/part-r-00000.',
          expectedCommand: 'hdfs dfs -cat /data/wordcount/output/part-r-00000'
        }
      }
    }
  ]
};

