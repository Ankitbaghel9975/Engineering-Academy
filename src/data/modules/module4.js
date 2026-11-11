// Module 4: Linux for Data Engineers
export const module4 = {
  id: 'mod-4',
  title: 'Module 4: Linux for Data Engineers',
  description: 'Master enterprise Linux systems administration, bash automation, log parsing, permissions, cron scheduling, and networking.',
  badge: 'SysAdmin Core',
  icon: 'Terminal',
  lessons: [
    {
      id: 'm4-l1',
      title: 'Linux Commands Essential for Data Engineers',
      duration: '45 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'Over 99% of Big Data production infrastructure runs on enterprise Linux distributions (RHEL, Rocky Linux, Ubuntu Server, Debian). A Data Engineer must navigate directories, inspect multi-gigabyte files without opening them entirely in memory, search text patterns, and pipe outputs between command-line utilities. Commands like ls, cd, pwd, cat, head, tail, grep, find, wc, and xargs form the day-to-day bread and butter of cluster administration.',
        hi: 'Duniya ka 99% se zyada Big Data production infrastructure Linux par run hota hai. Ek Data Engineer ko server me navigate karna, bina RAM bhare 10 GB ki file ko inspect karna, text patterns search karna, aur commands ko aapas me pipe (|) karna aana chahiye. ls, cd, head, tail, grep, find, aur wc jaise commands har data engineer ke rozmarra ke hathiyar hain.'
      },
      why: 'In production, Data Engineers do not have graphical user interfaces (GUIs). When an automated pipeline fails at 2 AM, you must SSH into an edge node and diagnose the issue directly from the command line in seconds.',
      how: '1. Navigating: cd, pwd, ls -lah to view hidden files and human-readable sizes.\n2. Reading: head -n 20, tail -n 50, tail -f (live streaming log tailing).\n3. Searching: grep -rn "ERROR" /var/log/ for recursive fast string matching.\n4. Locating: find /data/landing -name "*.parquet" -mtime -1 (files created in last 24h).\n5. Combining: Piping (|) stdout of one program into stdin of another (e.g. cat data.csv | grep "FAILED" | wc -l).',
      architecture: {
        type: 'linux_pipeline_flow',
        title: 'Linux Unix Philosophy: Pipes and Streams',
        nodes: [
          { name: 'Standard Input (stdin - 0)', desc: 'Stream feeding data into process' },
          { name: 'Process & Pipeline (|)', desc: 'Small, specialized tools chained together' },
          { name: 'Standard Output (stdout - 1)', desc: 'Clean output stream passed to next tool' },
          { name: 'Standard Error (stderr - 2)', desc: 'Error messages diverted or logged separately (2>&1)' }
        ]
      },
      industryExample: 'At Uber, data engineers use combinations of find, xargs, and zcat to scan terabytes of gzipped application logs on edge gateway servers during incident triage.',
      practicalLab: {
        title: 'Lab 4.1: Working with Linux CLI Files and Filters',
        problemStatement: 'Create a log file, filter specific error codes, count occurrences, and preview the first and last records.',
        requirements: 'Linux bash terminal.',
        setup: 'mkdir -p ~/bigdata_lab/m4_l1 && cd ~/bigdata_lab/m4_l1',
        instructions: [
          'Step 1: Generate sample log file with ERROR and INFO entries.',
          'Step 2: Use grep to isolate ERROR entries.',
          'Step 3: Count total errors using wc -l.'
        ],
        code: `# linux_commands_lab.sh
cat << 'EOF' > pipeline.log
2026-11-11 10:00:01 INFO [main] Ingestion started
2026-11-11 10:00:15 ERROR [worker-1] Spark out of memory error
2026-11-11 10:00:22 INFO [worker-2] Partition 2 completed
2026-11-11 10:00:45 ERROR [worker-3] Connection refused on port 9092
2026-11-11 10:01:00 INFO [main] Ingestion finished
EOF
grep "ERROR" pipeline.log
grep "ERROR" pipeline.log | wc -l
`,
        commands: [
          'grep "ERROR" pipeline.log',
          'grep "ERROR" pipeline.log | wc -l'
        ]
      },
      expectedOutput: `2026-11-11 10:00:15 ERROR [worker-1] Spark out of memory error
2026-11-11 10:00:45 ERROR [worker-3] Connection refused on port 9092
2`,
      troubleshooting: [
        {
          error: 'cat huge_file.csv freezes terminal and causes memory lockup',
          rootCause: 'Using cat on a multi-gigabyte file dumps millions of lines directly into the terminal buffer.',
          solution: 'Never use cat on large files. Use head -n 20, tail -n 20, or less huge_file.csv to safely view paginated slices.'
        }
      ],
      bestPractices: [
        'Always preview large files using head or less, never cat.',
        'Use grep -i for case-insensitive matching and grep -E for extended regex patterns.',
        'Redirect stdout and stderr separately: command > output.log 2> error.log.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'How do you view the last 100 lines of a log file and continue following new entries in real time?',
          answer: 'Use the command: tail -n 100 -f filename.log. The -n 100 prints the last 100 lines, and -f (follow) keeps the file open, printing new lines to the terminal as they are written.'
        },
        {
          level: 'Intermediate',
          question: 'What is the difference between > and >> in Linux shell redirection?',
          answer: '> redirects stdout to a file, overwriting the file if it already exists. >> appends stdout to the end of the file without deleting existing contents.'
        },
        {
          level: 'Advanced',
          question: 'How do you find all .csv files larger than 500 MB modified within the last 7 days and delete them?',
          answer: 'find /data -type f -name "*.csv" -size +500M -mtime -7 -exec rm -f {} \\; (or using xargs: find /data -type f -name "*.csv" -size +500M -mtime -7 -print0 | xargs -0 rm -f).'
        }
      ],
      assignment: {
        task: 'Execute grep "ERROR" pipeline.log and count matching lines with wc -l in the terminal emulator.',
        verificationCriteria: 'Run grep "ERROR" pipeline.log | wc -l and verify count is 2.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which command allows you to view a live, continuously updating log stream in Linux?',
            options: ['cat -live file.log', 'tail -f file.log', 'head -stream file.log', 'more -u file.log'],
            correct: 1,
            explanation: 'tail -f (follow) tracks and displays appended log records in real time.'
          }
        ],
        commandChallenge: {
          prompt: 'Count the number of ERROR lines in pipeline.log.',
          expectedCommand: 'grep "ERROR" pipeline.log | wc -l'
        }
      }
    },
    {
      id: 'm4-l2',
      title: 'File Permissions & chmod/chown',
      duration: '45 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'Linux enforces a granular permission model based on three entity classes: Owner (User - u), Group (g), and Others (o). Each class has three access permissions: Read (r = 4), Write (w = 2), and Execute (x = 1). Permissions are represented either symbolically (-rwxr-xr--) or octally (754). In distributed environments like Hadoop, incorrect permissions prevent DataNodes or YARN NodeManagers from reading configuration keys or executing container launch scripts, causing immediate job abortion.',
        hi: 'Linux me har file aur folder ke teen maalik hote hain: User (Owner), Group, aur Others. Har ek ke paas teen permissions ho sakti hain: Read (4), Write (2), aur Execute (1). Total milakar octal number banta hai, jaise 755 (User ke paas 7 = Read+Write+Execute, baakiyon ke paas 5 = Read+Execute). Hadoop aur Spark me agar permissions sahi nahi hain, toh DataNode start nahi hoga ya YARN container launch script execute nahi hogi.'
      },
      why: 'Data lakes store sensitive PII (Personally Identifiable Information) and financial transactions. Strict Linux and POSIX file permissions protect raw datasets from unauthorized access or accidental deletion by rogue scripts.',
      how: '1. View Permissions: ls -la displays -rw-r--r-- (User: rw-, Group: r--, Others: r--).\n2. Numeric Mode: 7 = 4+2+1 (rwx), 6 = 4+2 (rw-), 5 = 4+1 (r-x), 4 = 4 (r--).\n3. chmod: Changes permissions (e.g. chmod 755 script.sh or chmod 600 id_rsa).\n4. chown: Changes user and group ownership (e.g. chown -R hadoop:hadoop /data/hdfs).\n5. SUID / SGID / Sticky Bit: Sticky bit (chmod 1777 /tmp) prevents users from deleting files owned by other users in shared scratch directories.',
      architecture: {
        type: 'linux_permissions_grid',
        title: 'Linux Octal Permission Calculation',
        nodes: [
          { name: 'User (Owner): rwx', desc: 'Read (4) + Write (2) + Execute (1) = 7' },
          { name: 'Group: r-x', desc: 'Read (4) + Write (0) + Execute (1) = 5' },
          { name: 'Others: r-x', desc: 'Read (4) + Write (0) + Execute (1) = 5' },
          { name: 'Resulting Mode', desc: 'chmod 755 target_file' }
        ]
      },
      industryExample: 'Hadoop security guidelines strictly mandate that the private SSH key ~/.ssh/id_rsa must have 600 permissions (-rw-------); if permissions are too open, SSH rejects the key and prevents master nodes from bootstrapping worker nodes.',
      practicalLab: {
        title: 'Lab 4.2: Managing File Permissions and Executables',
        problemStatement: 'Create a shell script, observe "Permission Denied", make it executable with chmod 755, and inspect permissions.',
        requirements: 'Linux bash terminal.',
        setup: 'mkdir -p ~/bigdata_lab/m4_l2 && cd ~/bigdata_lab/m4_l2',
        instructions: [
          'Step 1: Create a simple script run_etl.sh.',
          'Step 2: Change permissions using chmod 755 run_etl.sh.',
          'Step 3: Verify permissions with ls -l.'
        ],
        code: `# permissions_lab.sh
echo '#!/bin/bash' > run_etl.sh
echo 'echo "ETL Job Completed"' >> run_etl.sh
chmod 755 run_etl.sh
ls -l run_etl.sh
./run_etl.sh
`,
        commands: [
          'chmod 755 run_etl.sh',
          'ls -l run_etl.sh'
        ]
      },
      expectedOutput: `-rwxr-xr-x 1 hadoop hadoop 43 Nov 11 15:00 run_etl.sh
ETL Job Completed`,
      troubleshooting: [
        {
          error: 'bash: ./run_etl.sh: Permission denied',
          rootCause: 'The script lacks the execute bit (x) in its file permission mode.',
          solution: 'Run chmod +x run_etl.sh or chmod 755 run_etl.sh.'
        },
        {
          error: 'Permissions 0777 for /root/.ssh/id_rsa are too open. It is required that your private key files are NOT accessible by others.',
          rootCause: 'SSH client refuses to authenticate using a private key accessible to group or others.',
          solution: 'Execute chmod 600 ~/.ssh/id_rsa and chmod 700 ~/.ssh.'
        }
      ],
      bestPractices: [
        'Never run chmod 777 on production directories; it grants everyone write and delete permissions.',
        'Set sticky bit on shared scratch directories (chmod 1777 /tmp/hadoop-yarn/staging) so users cannot delete each other\'s files.',
        'Use umask 022 to default newly created files to 644 and directories to 755.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What does the permission 755 mean on a Linux file or directory?',
          answer: '755 breaks down into: Owner has 7 (Read=4 + Write=2 + Execute=1), Group has 5 (Read=4 + Execute=1), and Others have 5 (Read=4 + Execute=1). Owner can read, write, and execute; Group and Others can only read and execute.'
        },
        {
          level: 'Intermediate',
          question: 'What is the purpose of the Sticky Bit in Linux directories like /tmp?',
          answer: 'When the sticky bit is set on a directory (represented as \'t\' at the end: rwxrwxrwt / chmod 1777), any user can write files into that directory, but a user can only delete or rename files that they personally own. This prevents users in a shared multi-tenant cluster from deleting other users\' temporary files.'
        },
        {
          level: 'Advanced',
          question: 'How do Linux POSIX ACLs (Access Control Lists) extend traditional chmod permissions?',
          answer: 'Traditional Linux permissions only allow one owner user and one owner group. POSIX ACLs (managed via setfacl and getfacl) allow administrators to grant granular read/write/execute permissions to multiple specific users or groups on the same file (e.g. setfacl -m u:sparkuser:rx /data/finance).'
        }
      ],
      assignment: {
        task: 'Execute chmod 755 run_etl.sh in terminal and verify permissions with ls -l.',
        verificationCriteria: 'Run ls -l run_etl.sh and confirm -rwxr-xr-x.'
      },
      assessment: {
        quiz: [
          {
            q: 'What numeric chmod value grants Read, Write, and Execute to owner, and Read-only to group and others?',
            options: ['777', '744', '755', '644'],
            correct: 1,
            explanation: '7 (4+2+1 = rwx) for owner, 4 (r--) for group, 4 (r--) for others = 744.'
          }
        ],
        commandChallenge: {
          prompt: 'Set read, write, and execute for owner, and read and execute for group and others on run_etl.sh.',
          expectedCommand: 'chmod 755 run_etl.sh'
        }
      }
    },
    {
      id: 'm4-l3',
      title: 'Users and Groups Management',
      duration: '40 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'Big Data platforms enforce multi-tenancy and security through dedicated Linux service accounts and groups. System daemons should never run under the root user. Instead, dedicated service accounts (hdfs, yarn, mapred, spark, kafka) belong to administrative groups like hadoop or supergroup. Files like /etc/passwd, /etc/shadow, and /etc/group govern identity, while useradd, usermod, and id manage users and memberships.',
        hi: 'Big Data clusters me security ke liye kabhi bhi root user se services nahi chalai jaati. Har technology ka apna alag Linux user hota hai: hdfs user storage manage karta hai, yarn user compute manage karta hai, spark user Spark jobs chalata hai, aur kafka user Kafka stream chalata hai. Ye sab hadoop group ke member hote hain. useradd, groupadd, aur usermod commands se hum in users aur permissions ko configure karte hain.'
      },
      why: 'Running Hadoop or Spark as the root user is a critical security vulnerability. If a user submits a malicious Python or Java UDF (User Defined Function), running under root gives them unrestricted control to format physical drives or delete OS files.',
      how: '1. Create Group: groupadd hadoop\n2. Create Service Users: useradd -g hadoop -s /bin/bash hdfs; useradd -g hadoop -s /bin/bash yarn\n3. Check Identity: id hdfs displays uid=1001(hdfs) gid=1001(hadoop) groups=1001(hadoop)\n4. Supergroup: HDFS maps the Linux group supergroup to cluster administrator privileges.',
      architecture: {
        type: 'user_group_hierarchy',
        title: 'Hadoop Service Account & Group Hierarchy',
        nodes: [
          { name: 'Group: hadoop (gid: 1001)', desc: 'Shared group for all Big Data service accounts' },
          { name: 'User: hdfs (uid: 1001)', desc: 'Owns NameNode, DataNode storage directories and /etc/hadoop' },
          { name: 'User: yarn (uid: 1002)', desc: 'Owns ResourceManager, NodeManager, local container caches' },
          { name: 'User: spark (uid: 1003)', desc: 'Owns Spark History Server, staging directories' }
        ]
      },
      industryExample: 'In enterprise deployments with Kerberos and Active Directory (LDAP/AD), enterprise identity tools like SSSD sync corporate LDAP users directly into Linux /etc/passwd for seamless single sign-on.',
      practicalLab: {
        title: 'Lab 4.3: Inspecting User Identities and Group Memberships',
        problemStatement: 'Inspect user identity using id, review /etc/passwd and /etc/group entries.',
        requirements: 'Linux bash terminal.',
        setup: 'id',
        instructions: [
          'Step 1: Check your current username, UID, and GID with id.',
          'Step 2: Inspect groups your user belongs to with groups.'
        ],
        code: `# user_check.sh
id
groups
`,
        commands: [
          'id',
          'groups'
        ]
      },
      expectedOutput: `uid=1000(hadoop) gid=1000(hadoop) groups=1000(hadoop),27(sudo),999(supergroup)
hadoop sudo supergroup`,
      troubleshooting: [
        {
          error: 'org.apache.hadoop.security.AccessControlException: Permission denied: user=john, access=WRITE, inode="/data":hdfs:supergroup:drwxr-xr-x',
          rootCause: 'User john does not belong to the supergroup group and lacks write permissions to the /data directory in HDFS.',
          solution: 'Add user to supergroup via usermod -a -G supergroup john or grant directory permissions via hdfs dfs -chmod 775 /data.'
        }
      ],
      bestPractices: [
        'Never run Big Data daemons as root.',
        'Use dedicated service accounts with /sbin/nologin shells for daemons that do not require interactive logins.',
        'Integrate with Active Directory / LDAP using Kerberos for enterprise-grade single sign-on.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between UID and GID in Linux?',
          answer: 'UID (User Identifier) is a unique integer assigned by Linux to each user account. GID (Group Identifier) is a unique integer assigned to each group. Permissions can be assigned to either the owner UID or the associated GID.'
        },
        {
          level: 'Intermediate',
          question: 'What is the "supergroup" in Hadoop HDFS?',
          answer: 'In HDFS, supergroup is the default group equivalent to Linux root. Any Linux user who belongs to the supergroup group in the host OS has administrative superuser permissions inside HDFS, allowing them to read, write, or delete any file in the filesystem regardless of permissions.'
        },
        {
          level: 'Advanced',
          question: 'How does Hadoop determine user identity when Kerberos is NOT enabled vs when Kerberos is enabled?',
          answer: 'Without Kerberos (Simple Authentication), Hadoop blindly trusts the client OS: whatever username is running the client process (System.getProperty("user.name") or HADOOP_USER_NAME) is accepted as the user identity, making spoofing trivial. When Kerberos is enabled, users must authenticate with a Keytab or Kerberos ticket (kinit), obtaining a cryptographically signed TGT verified by NameNode.'
        }
      ],
      assignment: {
        task: 'Execute the id command in terminal to inspect user UID, GID, and active groups.',
        verificationCriteria: 'Run id and observe uid and gid numbers.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which file stores user account information such as username, UID, GID, home directory, and login shell in Linux?',
            options: ['/etc/shadow', '/etc/passwd', '/etc/security', '/etc/hosts'],
            correct: 1,
            explanation: '/etc/passwd contains user account metadata; password hashes are stored in /etc/shadow.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect current user ID and group memberships.',
          expectedCommand: 'id'
        }
      }
    },
    {
      id: 'm4-l4',
      title: 'Process Management (ps, top, kill)',
      duration: '45 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'A process is an instance of a running program in Linux. Every process is assigned a unique Process Identifier (PID). In Big Data operations, daemons (NameNode, Spark Executors) run as long-lived background JVM processes. Engineers must monitor process health, detect CPU/RAM hogs, inspect thread counts, and terminate stuck or zombie processes using ps, top/htop, pkill, and kill.',
        hi: 'Process ka matlab hai Linux me chalne wala koi bhi program. Har process ko ek unique number milta hai jise PID (Process ID) kehte hain. Big Data me NameNode, DataNode, aur Spark Executors sab Java ke background processes hote hain. Ek engineer ko ye pata hona chahiye ki kaun sa process sabse zyada RAM/CPU kha raha hai, kaun sa process hang ho gaya hai, aur use kill -9 se kaise safely terminate karna hai.'
      },
      why: 'When a Spark job leaks memory or enters an infinite loop, it can lock 100% of a node\'s CPU cores. Knowing how to immediately identify the culprit PID and terminate it prevents whole-cluster outages.',
      how: '1. Inspecting: ps -ef | grep java lists all Java processes with full arguments.\n2. Real-Time Monitor: top or htop displays dynamic CPU, memory, and load averages.\n3. Java Processes: jps -lv displays JVM processes and their bootstrap options.\n4. Graceful Termination: kill -15 <PID> (SIGTERM) allows JVM to run shutdown hooks and clean scratch files.\n5. Force Kill: kill -9 <PID> (SIGKILL) forces the kernel to immediately reclaim memory.',
      architecture: {
        type: 'process_tree_hierarchy',
        title: 'Linux Process Tree & Signal Propagation',
        nodes: [
          { name: 'systemd (PID 1)', desc: 'Root ancestor of all OS processes' },
          { name: 'NodeManager Daemon (PID 13350)', desc: 'Spawns child container processes' },
          { name: 'Spark Executor JVM (PID 14500)', desc: 'Child process running task threads inside cgroup' },
          { name: 'Signals: SIGTERM (15) vs SIGKILL (9)', desc: 'SIGTERM requests graceful cleanup; SIGKILL terminates immediately' }
        ]
      },
      industryExample: 'Automated cluster monitoring agents at Netflix constantly poll top/ps metrics; if an ad-hoc query spins at 100% CPU for >4 hours without progress, an automated watchdog executes kill -15.',
      practicalLab: {
        title: 'Lab 4.4: Inspecting and Managing Linux Processes',
        problemStatement: 'Launch a background sleep task, find its PID with ps, and terminate it using kill.',
        requirements: 'Linux bash terminal.',
        setup: 'mkdir -p ~/bigdata_lab/m4_l4 && cd ~/bigdata_lab/m4_l4',
        instructions: [
          'Step 1: Launch sleep 300 in the background.',
          'Step 2: Find its PID using ps -ef | grep sleep.',
          'Step 3: Terminate the process using kill.'
        ],
        code: `# process_lab.sh
sleep 300 &
PID=$!
echo "Started background process with PID: $PID"
ps -ef | grep sleep | grep -v grep
kill -9 $PID
echo "Process terminated successfully."
`,
        commands: [
          'ps -ef | grep -E "java|bash" | head -n 5'
        ]
      },
      expectedOutput: `hadoop   12401     1  0 14:30 ?        00:00:15 /usr/bin/java -Dproc_namenode
hadoop   12650     1  0 14:30 ?        00:00:12 /usr/bin/java -Dproc_datanode
hadoop   13120     1  0 14:30 ?        00:00:18 /usr/bin/java -Dproc_resourcemanager
hadoop   13350     1  0 14:30 ?        00:00:14 /usr/bin/java -Dproc_nodemanager
hadoop   14102  2341  0 15:05 pts/0    00:00:00 /bin/bash`,
      troubleshooting: [
        {
          error: 'kill -9 <PID> fails to terminate process; process state shows "Z" in top',
          rootCause: 'The process is a Zombie process (terminated, but parent process has not read its exit code via waitpid).',
          solution: 'Zombie processes consume zero CPU and RAM. To clear a zombie, terminate its parent process (PPID).'
        }
      ],
      bestPractices: [
        'Always try graceful termination (kill -15) first before resorting to force kill (kill -9).',
        'Use jps -m -l to view full Java main class and arguments instead of raw ps.',
        'Check system load averages in top: if 1-minute load average exceeds the total CPU core count, the server is CPU-throttled.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between kill -15 (SIGTERM) and kill -9 (SIGKILL)?',
          answer: 'kill -15 (SIGTERM) is a polite request sent to the process, allowing it to execute cleanup routines, close open database connections/file descriptors, and terminate gracefully. kill -9 (SIGKILL) cannot be caught or ignored by the process; the Linux kernel immediately terminates the process and reclaims memory.'
        },
        {
          level: 'Intermediate',
          question: 'What does the Linux Load Average metric (e.g. 4.5, 3.2, 1.8) reported by uptime or top signify?',
          answer: 'Load Average represents the average number of processes that are either actively running on CPU, waiting for CPU time, or blocked in uninterruptible sleep (waiting on disk I/O) over 1, 5, and 15 minute periods. On an 8-core machine, a load average of 8 means 100% saturation. A load above 8 means tasks are queueing up.'
        },
        {
          level: 'Advanced',
          question: 'What is a process in "D" state (Uninterruptible Sleep) and why can\'t even kill -9 terminate it?',
          answer: 'A process in \'D\' state is waiting on a hardware event, typically synchronous disk I/O, an NFS lock, or device driver response. The Linux kernel prevents signals (including SIGKILL) from interrupting the process while it is in a kernel driver state to avoid corrupting file systems. The only resolution is waiting for the hardware I/O to return or rebooting the server if hardware is frozen.'
        }
      ],
      assignment: {
        task: 'Execute ps -ef | grep -E "java|bash" | head -n 5 in terminal to inspect running daemons and their PIDs.',
        verificationCriteria: 'Run ps -ef | grep -E "java|bash" | head -n 5.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which signal number corresponds to SIGKILL, which forcibly and immediately terminates a process via the Linux kernel?',
            options: ['1 (SIGHUP)', '2 (SIGINT)', '9 (SIGKILL)', '15 (SIGTERM)'],
            correct: 2,
            explanation: 'kill -9 sends SIGKILL, forcing immediate termination by the kernel.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect active java or bash processes using ps.',
          expectedCommand: 'ps -ef | grep -E "java|bash" | head -n 5'
        }
      }
    },
    {
      id: 'm4-l5',
      title: 'Disk Management (df, du, mount, fdisk)',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Big Data storage revolves entirely around disk drives. Data Engineers must monitor filesystem capacities, identify directories consuming terabytes of storage, mount enterprise SSDs, and manage partitions. The df (disk free) command reports disk space usage for all mounted filesystems. The du (disk usage) command calculates space occupied by specific directories and files. Senior engineers use these tools to prevent the dreaded "No space left on device" errors that crash cluster nodes.',
        hi: 'Big Data ka matlab hi hai disks ko efficiently use karna. Ek Data Engineer ko pata hona chahiye ki hard drive kitni bhar chuki hai, kaun sa folder terabytes kha raha hai, aur naye SSD drives ko kaise mount karna hai. df (disk free) poore system ke partitions ka free space dikhata hai, jabki du (disk usage) kisi particular folder ka exact size batata hai. Inka sahi use karke aap server ko 100% full hokar crash hone se bacha sakte hain.'
      },
      why: 'If a worker node\'s root filesystem (/) hits 100% disk utilization, the Linux kernel cannot create temporary files or write socket locks, causing NodeManager, DataNode, and SSH to crash simultaneously.',
      how: '1. Global Capacity: df -h displays mounted filesystems with human-readable (G/M) units.\n2. Inode Capacity: df -i checks inode exhaustion (even if disk has 500 GB free, running out of inodes prevents creating new files).\n3. Directory Size: du -sh /data/* calculates summary size of each subfolder.\n4. Find Heavy Hogs: du -ah /var/log | sort -rh | head -n 10 spots the 10 largest log files.\n5. Mounting: mount /dev/nvme0n1 /data/disk1 attaches a physical drive to a directory mount point.',
      architecture: {
        type: 'disk_mounting_layout',
        title: 'Big Data Worker Node Disk Layout (JBOD)',
        nodes: [
          { name: '/ (Root OS Partition)', desc: '/dev/sda1 (100 GB) - OS kernel, logs, and daemons' },
          { name: '/data/disk1 (JBOD DataNode)', desc: '/dev/sdb (4 TB HDD) - HDFS raw blocks' },
          { name: '/data/disk2 (JBOD DataNode)', desc: '/dev/sdc (4 TB HDD) - HDFS raw blocks' },
          { name: '/mnt/nvme-scratch (YARN Shuffle)', desc: '/dev/nvme0n1 (1 TB SSD) - Fast intermediate shuffle storage' }
        ]
      },
      industryExample: 'eBay configures automated cron watchdogs running df -h; if any disk crosses 85% capacity, an automated alert alerts the operations team and triggers the HDFS balancer to offload blocks.',
      practicalLab: {
        title: 'Lab 4.5: Inspecting Disk Utilization and Finding Heavy Files',
        problemStatement: 'Inspect mounted disk partitions using df -h and analyze directory space consumption using du -sh.',
        requirements: 'Linux bash terminal.',
        setup: 'mkdir -p ~/bigdata_lab/m4_l5 && cd ~/bigdata_lab/m4_l5',
        instructions: [
          'Step 1: Check all mounted filesystems using df -h.',
          'Step 2: Check inode utilization using df -i.',
          'Step 3: Calculate human-readable directory usage using du -sh.'
        ],
        code: `# disk_lab.sh
df -h
df -i /
du -sh /tmp
`,
        commands: [
          'df -h',
          'df -i /'
        ]
      },
      expectedOutput: `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       250G   45G  193G  19% /
tmpfs           7.8G     0  7.8G   0% /dev/shm
/dev/sdb1       4.0T  2.1T  1.9T  53% /data/disk1
/dev/sdc1       4.0T  2.2T  1.8T  55% /data/disk2
Filesystem       Inodes  IUsed   IFree IUse% Mounted on
/dev/sda1      16384000 684210 15699790    5% /`,
      troubleshooting: [
        {
          error: 'No space left on device, but df -h shows 50% free space remaining',
          rootCause: 'The filesystem has run out of INODES because millions of tiny zero-byte or small files were created.',
          solution: 'Check inode utilization using df -i. Clean up millions of small temporary files using find /tmp -type f -mtime +2 -delete.'
        },
        {
          error: 'Deleted a 50 GB log file, but df -h still shows disk as 100% full',
          rootCause: 'A running process (e.g. active JVM) still holds an open file descriptor to the deleted file.',
          solution: 'Identify the holding process using lsof | grep deleted. Restart or reload that specific service to release the file handle.'
        }
      ],
      bestPractices: [
        'Always format Big Data data drives with XFS or Ext4 with noatime mount option to skip unnecessary disk writes on file reads.',
        'Never let any data drive exceed 85% capacity; HDFS read/write performance degrades exponentially as disks fill up.',
        'Monitor both disk bytes (df -h) AND disk inodes (df -i).'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between df and du commands in Linux?',
          answer: 'df (disk free) displays total capacity, used space, and available space for all mounted filesystem partitions by reading filesystem metadata. du (disk usage) calculates the space occupied by specific directories and files by traversing the directory tree.'
        },
        {
          level: 'Intermediate',
          question: 'Why can a disk report "No space left on device" even when df -h shows hundreds of gigabytes free?',
          answer: 'Because filesystems have a fixed number of Inodes (data structures storing file metadata). If an application creates millions of tiny files, all available inodes can be exhausted (df -i = 100%), even if physical storage space is mostly empty. Without an available inode, the OS cannot create a new file.'
        },
        {
          level: 'Advanced',
          question: 'Why does df -h not show reclaimed space after deleting a large 100GB log file with rm -f?',
          answer: 'In Linux, when a file is deleted with rm, its directory pointer is removed, but the underlying disk blocks are NOT freed if an active process still holds an open file descriptor to that file. The blocks are only freed once the holding process closes the descriptor or terminates. You can find the holding process with lsof | grep deleted and reload or restart it.'
        }
      ],
      assignment: {
        task: 'Execute df -h and df -i / to verify storage bytes and inode health in the terminal emulator.',
        verificationCriteria: 'Run df -h and df -i /.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which flag with du produces human-readable summary size for a directory without listing every subfile?',
            options: ['du -h', 'du -sh', 'du -a', 'du -r'],
            correct: 1,
            explanation: 'du -sh combines -s (summary) and -h (human-readable: KB, MB, GB).'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect mounted filesystem space in human readable format.',
          expectedCommand: 'df -h'
        }
      }
    },
    {
      id: 'm4-l6',
      title: 'Linux Networking for Big Data',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Distributed systems like Hadoop, Spark, and Kafka communicate entirely over TCP/IP networks. When a job fails with Connection Refused, Timed Out, or Host Unreachable, a Data Engineer must isolate whether the issue is DNS resolution, closed ports, firewall blocks, or network packet drops. Core networking commands include ping, curl, netstat/ss, ip a, traceroute, and nc (netcat).',
        hi: 'Big Data ke saare tools (Hadoop, Spark, Kafka) network ke through aapas me baat karte hain. Agar koi Spark job "Connection Refused" bolkar fail ho jaye, toh Data Engineer ko pata hona chahiye ki port khula hai ya nahi, firewall block kar raha hai ya DNS name resolve nahi ho raha. netstat, ss, curl, ping, aur nc (netcat) wo tools hain jinse network debugging hoti hai.'
      },
      why: 'A Big Data cluster is only as fast as its network. A single misconfigured firewall rule blocking port 9866 (DataNode data transfer) will prevent the entire cluster from writing data.',
      how: '1. Check Listening Ports: ss -tulnp | grep 9000 (shows if NameNode is listening on port 9000).\n2. Test Port Reachability: nc -zv worker-01 9866 or curl -I http://master-01:9870.\n3. Verify Host Resolution: nslookup master-01 or getent hosts master-01.\n4. Check Network Interfaces: ip a or ifconfig to verify IP and MTU.\n5. Track Port Bindings: Standard ports: NameNode RPC 9000/8020, Web UI 9870, DataNode 9866, RM 8032/8088, Kafka 9092, Spark 7077/4040.',
      architecture: {
        type: 'network_port_mapping',
        title: 'Hadoop & Kafka Enterprise Port Matrix',
        nodes: [
          { name: 'NameNode (RPC: 9000 / Web: 9870)', desc: 'Client RPC requests and admin web console' },
          { name: 'DataNode (Data: 9866 / Web: 9864)', desc: 'Block streaming data transfer port' },
          { name: 'ResourceManager (Scheduler: 8032 / Web: 8088)', desc: 'YARN resource allocation & Web UI' },
          { name: 'Apache Kafka Broker (Port: 9092)', desc: 'Producer/Consumer event streaming protocol' }
        ]
      },
      industryExample: 'Netflix engineers configure Jumbo Frames (MTU 9000) on 100GbE network interfaces, cutting CPU packet handling overhead by 60% during massive Spark shuffle operations.',
      practicalLab: {
        title: 'Lab 4.6: Diagnosing Network Sockets and Port Bindings',
        problemStatement: 'Inspect open listening TCP ports using netstat/ss and test HTTP connectivity using curl.',
        requirements: 'Linux bash terminal with ss or netstat.',
        setup: 'ss -tulnp',
        instructions: [
          'Step 1: Check all listening TCP ports using ss -tuln.',
          'Step 2: Inspect IP address configuration using ip a or hostname -I.'
        ],
        code: `# network_lab.sh
ss -tuln | head -n 10
hostname -I
`,
        commands: [
          'ss -tuln | head -n 10',
          'hostname -I'
        ]
      },
      expectedOutput: `Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port
tcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*
tcp   LISTEN 0      50           0.0.0.0:9000       0.0.0.0:*
tcp   LISTEN 0      100          0.0.0.0:9870       0.0.0.0:*
tcp   LISTEN 0      50           0.0.0.0:8088       0.0.0.0:*
tcp   LISTEN 0      50           0.0.0.0:9092       0.0.0.0:*
192.168.1.100`,
      troubleshooting: [
        {
          error: 'Connection refused when connecting to master-01:9092',
          rootCause: 'Kafka broker service is offline or listeners in server.properties is bound to 127.0.0.1 instead of 0.0.0.0 or the external IP.',
          solution: 'Check Kafka service with jps. In server.properties, set listeners=PLAINTEXT://0.0.0.0:9092 and advertised.listeners=PLAINTEXT://<public_ip>:9092.'
        }
      ],
      bestPractices: [
        'Never bind cluster services to 127.0.0.1 in multi-node setups; bind to 0.0.0.0 or the machine\'s specific LAN IP.',
        'Enable TCP Keepalive on long-lived database and Spark connections to prevent firewalls from silently dropping idle sockets.',
        'Use Netcat (nc -zv host port) for instant connectivity testing without installing heavy client libraries.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the default Web UI port for Apache Hadoop 3.x NameNode vs Hadoop 2.x NameNode?',
          answer: 'In Hadoop 3.x, the NameNode Web UI port is 9870 (http://master:9870). In legacy Hadoop 2.x, it was port 50070. The port was changed to avoid conflicts with other common services.'
        },
        {
          level: 'Intermediate',
          question: 'How do you check if a specific port (e.g. 9092 for Kafka) is currently listening on a Linux server?',
          answer: 'Use: ss -tulnp | grep 9092 or netstat -tulnp | grep 9092. The -t filters TCP, -u UDP, -l listening sockets, -n numeric ports, and -p shows process PID/name.'
        },
        {
          level: 'Advanced',
          question: 'What is MTU (Maximum Transmission Unit) and why do Big Data clusters tune it to 9000 (Jumbo Frames)?',
          answer: 'MTU defines the maximum size in bytes of a single network packet. Standard Ethernet MTU is 1500 bytes. In high-throughput clusters transferring petabytes during Spark shuffles or HDFS writes, using Jumbo Frames (MTU 9000) allows packets 6x larger, reducing CPU interrupt handling overhead and increasing network throughput by 15-20%.'
        }
      ],
      assignment: {
        task: 'Execute ss -tuln in terminal to inspect listening TCP ports on the node.',
        verificationCriteria: 'Run ss -tuln | head -n 10.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which tool tests whether a remote TCP port is open and accepting connections without sending application payload?',
            options: ['nc (netcat) with -zv', 'chmod', 'fdisk', 'grep'],
            correct: 0,
            explanation: 'nc -zv <host> <port> (Zero-I/O verbose) immediately reports whether a TCP handshake succeeds.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect active listening network sockets.',
          expectedCommand: 'ss -tuln | head -n 10'
        }
      }
    },
    {
      id: 'm4-l7',
      title: 'Shell Scripting Fundamentals',
      duration: '50 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'Bash shell scripting is the primary automation glue of data engineering. A shell script is a text file containing a sequence of commands executed by the Bash interpreter (#!/bin/bash). Key constructs include variables, positional parameters ($1, $2, $@), conditionals (if [ $? -eq 0 ]), loops (for, while), functions, and exit status codes. Scripts automate data ingest, pre-check dependencies, validate file checksums, and orchestrate Spark and Hive executions.',
        hi: 'Bash Shell Scripting Data Engineering ka primary automation tool hai. Ek shell script ek aisi file hoti hai jisme hum Linux commands ko line-by-line likh dete hain aur #!/bin/bash (Shebang) lagate hain. Isme variables, if-else conditions, loops, aur exit codes (0 = success, non-zero = error) use hote hain. Iska use roz subah HDFS me files check karne, Spark jobs launch karne, aur failure aane par email alert bhejne ke liye hota hai.'
      },
      why: 'You cannot manually log in every morning to run 50 commands across 20 servers. Shell scripts automate the entire lifecycle reliably, executing consistently regardless of who is on duty.',
      how: '1. Shebang: #!/bin/bash as line 1 dictates the interpreter.\n2. Strict Mode: set -euo pipefail (exits immediately on errors or unset variables).\n3. Variables: INGEST_DATE=$(date +%Y-%m-%d)\n4. Conditionals: if [ -f "$FILE" ]; then ... else ... fi\n5. Exit Codes: Every Linux command returns an exit code: $? == 0 means SUCCESS; non-zero means ERROR.',
      architecture: {
        type: 'shell_automation_pipeline',
        title: 'Production Bash ETL Wrapper Pattern',
        nodes: [
          { name: '1. Pre-Flight Checks', desc: 'Verify HDFS health, check disk space > 20%, validate source files exist' },
          { name: '2. Execution Block', desc: 'spark-submit --master yarn --deploy-mode cluster my_etl.py' },
          { name: '3. Exit Code Evaluation', desc: 'Check $?: if 0 -> send success metric; if != 0 -> log failure & alert' },
          { name: '4. Post-Flight Cleanup', desc: 'Purge local staging directory and temporary credentials' }
        ]
      },
      industryExample: 'Airbnb runs thousands of shell wrapper scripts within Apache Airflow BashOperators to initialize environment variables, validate AWS S3 partition arrival, and trigger distributed Spark jobs.',
      practicalLab: {
        title: 'Lab 4.7: Building a Production-Grade Bash Wrapper',
        problemStatement: 'Write an automated shell script that validates input file existence, checks exit codes, and prints status.',
        requirements: 'Linux bash terminal.',
        setup: 'mkdir -p ~/bigdata_lab/m4_l7 && cd ~/bigdata_lab/m4_l7',
        instructions: [
          'Step 1: Write an automated wrapper script with set -e and exit status check.',
          'Step 2: Make executable and run.',
          'Step 3: Verify the exit code using echo $?.'
        ],
        code: `# build_script.sh
cat << 'EOF' > run_pipeline.sh
#!/bin/bash
set -e
echo "Starting data validation..."
LOG_DATE=$(date +%Y%m%d)
echo "Current processing batch: $LOG_DATE"
if [ 1 -eq 1 ]; then
    echo "Health checks PASSED."
    exit 0
else
    echo "Health checks FAILED." >&2
    exit 1
fi
EOF
chmod +x run_pipeline.sh
./run_pipeline.sh
echo "Exit code: $?"
`,
        commands: [
          'chmod +x run_pipeline.sh',
          './run_pipeline.sh'
        ]
      },
      expectedOutput: `Starting data validation...
Current processing batch: 20261111
Health checks PASSED.`,
      troubleshooting: [
        {
          error: '/bin/bash^M: bad interpreter: No such file or directory',
          rootCause: 'The shell script was created on Windows with DOS CRLF line endings (\\r\\n) instead of Unix LF (\\n).',
          solution: 'Convert line endings to Unix format using dos2unix script.sh or sed -i "s/\\r$//" script.sh.'
        }
      ],
      bestPractices: [
        'Always include set -euo pipefail at the top of production scripts so errors are not silently ignored.',
        'Quote all variables (e.g. "$FILE") to prevent catastrophic word splitting if a file path contains spaces.',
        'Always check $? or use trap to clean up scratch files on unexpected script termination.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the meaning of #!/bin/bash at the top of a script?',
          answer: 'It is called the Shebang (or Hashbang). It tells the Linux kernel which interpreter program to use to execute the script instructions (in this case, the GNU Bash shell located at /bin/bash).'
        },
        {
          level: 'Intermediate',
          question: 'What does "set -euo pipefail" do in a Bash script?',
          answer: '-e (errexit) exits immediately if any command returns a non-zero status. -u (nounset) treats unset variables as an error and exits. -o pipefail ensures that in a pipeline (cmd1 | cmd2), if cmd1 fails, the entire pipeline returns cmd1\'s error code rather than hiding it behind cmd2\'s exit code.'
        },
        {
          level: 'Advanced',
          question: 'How do you create an automated cleanup trap in Bash that executes even if the script is killed or crashes?',
          answer: 'Use the trap command: trap "rm -rf /tmp/staging_$$; echo Cleanup completed" EXIT SIGINT SIGTERM. Whenever the script exits or receives an interrupt/termination signal, the specified cleanup code runs automatically.'
        }
      ],
      assignment: {
        task: 'Execute run_pipeline.sh in the terminal and verify that the exit code is 0.',
        verificationCriteria: 'Run ./run_pipeline.sh and see Health checks PASSED.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which special Bash variable stores the exit status of the most recently executed command?',
            options: ['$0', '$#', '$?', '$$'],
            correct: 2,
            explanation: '$? contains the exit code of the last command (0 indicates success).'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the pipeline script in the current directory.',
          expectedCommand: './run_pipeline.sh'
        }
      }
    },
    {
      id: 'm4-l8',
      title: 'Bash Automation & Text Processing (awk, sed)',
      duration: '50 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'In Data Engineering, raw datasets frequently arrive with formatting errors, extra delimiters, or missing fields. awk and sed are the two most powerful text stream processing engines in Linux. sed (Stream Editor) performs non-interactive text transformations, regex search-and-replace, and line deletions on data streams. awk is a full-fledged data extraction and reporting programming language designed for tabular, field-delimited data (CSV, TSV, logs). A master data engineer uses awk and sed to clean gigabytes of data on the fly without loading Python.',
        hi: 'Data Engineering me aksar gande CSV ya log files aate hain jisme unwanted symbols, galat delimiters ya corrupt lines hoti hain. awk aur sed Linux ke do sabse powerful data cleaning tools hain. sed (Stream Editor) stream ke andar text ko find-and-replace karne aur unwanted lines ko delete karne ke kaam aata hai. awk ek poori programming language hai jo tabular data (jaise CSV/TSV) par kaam karti hai — ye columns ko extract karne, conditional filtering karne, aur column totals calculate karne me maahir hai.'
      },
      why: 'Starting a Python interpreter or Spark job to replace a comma with a pipe across a 10 GB file takes minutes. sed and awk execute directly in C at raw memory speed, finishing the transformation in seconds.',
      how: '1. sed substitution: sed \'s/old/new/g\' input.txt replaces strings globally.\n2. In-place edit: sed -i \'s/http/https/g\' config.xml modifies the file directly.\n3. Delete lines: sed \'/DEBUG/d\' app.log removes all lines containing DEBUG.\n4. awk columns: awk -F\',\' \'{print $1, $3}\' data.csv prints column 1 and column 3.\n5. awk math: awk -F\',\' \'{sum += $4} END {print "Total Revenue:", sum}\' sales.csv computes column sum.',
      architecture: {
        type: 'awk_sed_pipeline',
        title: 'Streaming Data Cleansing with Sed and Awk',
        nodes: [
          { name: 'Raw Corrupt Stream', desc: 'Dirty input containing quotes, bad delimiters, and header garbage' },
          { name: 'sed Stream Cleaner', desc: 'sed \'s/\\r//g; /^#/d\' -> Removes Windows CRLF and comments' },
          { name: 'awk Column Filter', desc: 'awk -F\',\' \'$3 > 500 {print $1, $3 * 1.18}\' -> Filters & transforms columns' },
          { name: 'Clean Target Stream', desc: 'Clean, normalized records piped into HDFS or Kafka' }
        ]
      },
      industryExample: 'Financial institutions use awk scripts in staging zones to validate credit card transaction schemas, verifying that column 4 has exactly 16 digits before ingesting into Spark.',
      practicalLab: {
        title: 'Lab 4.8: Transforming Data with Sed and Awk',
        problemStatement: 'Clean a dirty CSV file: remove Windows carriage returns, extract specific columns, and calculate an aggregate sum.',
        requirements: 'Linux bash terminal with sed and awk.',
        setup: 'mkdir -p ~/bigdata_lab/m4_l8 && cd ~/bigdata_lab/m4_l8',
        instructions: [
          'Step 1: Create a dirty sales data CSV.',
          'Step 2: Use awk to filter orders where amount > 500.',
          'Step 3: Calculate total revenue using awk sum.'
        ],
        code: `# awk_sed_lab.sh
cat << 'EOF' > raw_sales.csv
order_id,customer,amount
101,John,450
102,Alice,1200
103,Bob,850
104,Charlie,300
105,Diana,950
EOF
awk -F',' '$3 > 500 {print $1, $2, $3}' raw_sales.csv
awk -F',' 'NR>1 {sum += $3} END {print "Total Revenue: $" sum}' raw_sales.csv
`,
        commands: [
          'awk -F"," "$3 > 500 {print $1, $2, $3}" raw_sales.csv',
          'awk -F"," "NR>1 {sum += $3} END {print \"Total Revenue: $\" sum}" raw_sales.csv'
        ]
      },
      expectedOutput: `102 Alice 1200
103 Bob 850
105 Diana 950
Total Revenue: $3750`,
      troubleshooting: [
        {
          error: 'awk: fatal: cannot open file raw_sales.csv for reading',
          rootCause: 'File path is incorrect or the user lacks read permissions (chmod 644).',
          solution: 'Verify file presence with ls -l and ensure read permissions are granted.'
        }
      ],
      bestPractices: [
        'Use NR > 1 in awk to skip CSV header rows during numerical aggregations.',
        'Always specify field delimiter explicitly using -F (e.g. -F\',\' or -F\'\\t\').',
        'Test sed replacement on stdout first before using sed -i (in-place modification).'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between awk and sed?',
          answer: 'sed is a stream editor primarily designed for line-by-line text substitutions, insertions, deletions, and regex transformations. awk is a pattern scanning and data processing language designed for column-oriented, tabular data manipulation and mathematical calculations.'
        },
        {
          level: 'Intermediate',
          question: 'What do NR and NF represent in awk?',
          answer: 'NR stands for "Number of Records" (the current line number being processed). NF stands for "Number of Fields" (the count of columns in the current line). $NF refers to the value of the very last column in the line.'
        },
        {
          level: 'Advanced',
          question: 'How do you extract duplicate user IDs from a 5 GB CSV file using standard Linux CLI tools?',
          answer: 'cut -d\',\' -f1 user_data.csv | sort | uniq -d (or for faster streaming without full sort: awk -F\',\' \'seen[$1]++ {print $1}\' user_data.csv | sort -u).'
        }
      ],
      assignment: {
        task: 'Execute awk -F"," "NR>1 {sum += $3} END {print \\"Total Revenue: $\\" sum}" raw_sales.csv to calculate total revenue in terminal.',
        verificationCriteria: 'Run the command and observe Total Revenue: $3750.'
      },
      assessment: {
        quiz: [
          {
            q: 'In awk, which built-in variable refers to the value of the very last column in any given line?',
            options: ['$0', '$1', '$NF', '$END'],
            correct: 2,
            explanation: '$NF evaluates to the last field (e.g. if a line has 5 columns, NF is 5, so $NF is $5).'
          }
        ],
        commandChallenge: {
          prompt: 'Filter orders with amount greater than 500 from raw_sales.csv using awk.',
          expectedCommand: 'awk -F"," "$3 > 500 {print $1, $2, $3}" raw_sales.csv'
        }
      }
    },
    {
      id: 'm4-l9',
      title: 'Log Analysis & Troubleshooting',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Log analysis is the investigative process of inspecting unstructured and semi-structured server logs to diagnose pipeline failures, identify stragglers, track down data corruption, and audit access. Hadoop, Spark, and Kafka generate thousands of log entries per second across stdout, stderr, and syslog. A data engineer uses grep, awk, sort, uniq, less, and journalctl to extract error stacks, count exception frequencies, and correlate timestamps across distributed nodes.',
        hi: 'Log Analysis ka matlab hota hai fail hue pipeline ki investigation karna. Jab koi job fail hota hai toh Hadoop aur Spark log files me error traces chhodte hain. Ek data engineer grep, awk, sort, aur uniq ka use karke hazaron lines ke logs me se specific error traces nikalta hai, jaise OutOfMemoryError, ConnectionRefusedException, ya NullPointerException, aur dekhta hai ki ye error kis worker machine par aur kis timestamp par aaya.'
      },
      why: 'Pipelines fail every day in enterprise clusters. The difference between a junior and senior data engineer is that a senior engineer can locate the root cause in distributed logs in 5 minutes instead of guessing for 5 hours.',
      how: '1. Search Errors: grep -i "exception\\|error\\|fatal" application.log\n2. Context View: grep -C 5 "OutOfMemory" spark.log (prints 5 lines of context before and after).\n3. Frequency Count: grep -o "Exception: [^\\n]*" app.log | sort | uniq -c | sort -nr\n4. System Logs: journalctl -u hadoop-namenode.service --since "1 hour ago"\n5. Timestamp Correlation: Cross-referencing client job start time with DataNode I/O logs.',
      architecture: {
        type: 'log_analysis_flow',
        title: 'Distributed Log Triage Pipeline',
        nodes: [
          { name: '1. Initial Symptom', desc: 'Job fails with exit code 1; UI shows Executor Lost Failure' },
          { name: '2. YARN Log Fetch', desc: 'yarn logs -applicationId app_xxx | grep -i "Exception" -A 10' },
          { name: '3. Root Cause Isolation', desc: 'Identified java.lang.OutOfMemoryError: Java heap space in Task 42' },
          { name: '4. Fix & Prevent', desc: 'Increase executor heap or fix data skew join' }
        ]
      },
      industryExample: 'Uber and Meta aggregate distributed logs using Fluentd and OpenSearch, but on-call engineers rely on Linux CLI grep and awk pipelines for immediate ad-hoc incident triage during outages.',
      practicalLab: {
        title: 'Lab 4.9: Triage a Production Spark Failure Log',
        problemStatement: 'Search a simulated multi-node application log file, isolate the fatal exception, and count error frequencies.',
        requirements: 'Linux bash terminal.',
        setup: 'mkdir -p ~/bigdata_lab/m4_l9 && cd ~/bigdata_lab/m4_l9',
        instructions: [
          'Step 1: Inspect sample cluster log file.',
          'Step 2: Use grep -C 3 to inspect the exception stack trace.',
          'Step 3: Count distinct exception types using awk and uniq.'
        ],
        code: `# log_triage_lab.sh
cat << 'EOF' > cluster_exec.log
2026-11-11 14:00:01 INFO TaskSetManager: Starting task 0.0 in stage 1.0
2026-11-11 14:00:15 WARN BlockManager: Block rdd_1_0 stored as serialized
2026-11-11 14:01:20 ERROR Executor: Exception in task 0.0 in stage 1.0 (TID 0)
java.lang.OutOfMemoryError: Java heap space
	at org.apache.spark.util.collection.AppendOnlyMap.grow(AppendOnlyMap.scala:240)
	at org.apache.spark.util.collection.ExternalAppendOnlyMap.insert(ExternalAppendOnlyMap.scala:160)
2026-11-11 14:01:21 ERROR TaskSetManager: Task 0.0 in stage 1.0 failed 1 times
EOF
grep -A 4 "OutOfMemoryError" cluster_exec.log
`,
        commands: [
          'grep -A 4 "OutOfMemoryError" cluster_exec.log'
        ]
      },
      expectedOutput: `java.lang.OutOfMemoryError: Java heap space
	at org.apache.spark.util.collection.AppendOnlyMap.grow(AppendOnlyMap.scala:240)
	at org.apache.spark.util.collection.ExternalAppendOnlyMap.insert(ExternalAppendOnlyMap.scala:160)
2026-11-11 14:01:21 ERROR TaskSetManager: Task 0.0 in stage 1.0 failed 1 times`,
      troubleshooting: [
        {
          error: 'Log files too huge to open (app.log is 50 GB); grep runs out of memory or takes 30 minutes',
          rootCause: 'Searching entire unindexed raw log file sequentially across slow network mounts.',
          solution: 'Use LC_ALL=C grep for 10x faster byte-oriented scanning. Use zgrep if logs are gzip compressed (.log.gz).'
        }
      ],
      bestPractices: [
        'Use grep -C 5 to view surrounding context lines around an exception stack trace.',
        'Use zgrep, zcat, and zless to search gzipped logs directly without extracting them to disk.',
        'Implement logrotate to automatically compress and purge log files older than 14-30 days.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'How do you view 5 lines before and 5 lines after a matching error pattern in Linux?',
          answer: 'Use the -C (context) flag with grep: grep -C 5 "NullPointerException" app.log. Alternatively, use -B 5 for 5 lines before and -A 5 for 5 lines after.'
        },
        {
          level: 'Intermediate',
          question: 'How do you search for an error pattern inside a compressed .tar.gz or .gz log file without decompressing it?',
          answer: 'Use zgrep for individual .gz files: zgrep "ERROR" app.log.gz. For tar archives, use tar -ztvf or pipe zcat into grep: zcat logs.tar.gz | grep "ERROR".'
        },
        {
          level: 'Advanced',
          question: 'How do you count and rank the top 5 most frequent error messages from an enterprise log file?',
          answer: 'grep "ERROR" production.log | awk -F\'ERROR \' \'{print $2}\' | sort | uniq -c | sort -nr | head -n 5. This extracts the error message string, sorts it, calculates frequencies with uniq -c, and sorts numerically descending.'
        }
      ],
      assignment: {
        task: 'Execute grep -A 4 "OutOfMemoryError" cluster_exec.log in terminal to inspect the root cause stack trace.',
        verificationCriteria: 'Run the command and observe the Java heap space stack trace.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which grep flag prints N lines of trailing context AFTER the matching search pattern?',
            options: ['-A N (After)', '-B N (Before)', '-C N (Context)', '-v N (Invert)'],
            correct: 0,
            explanation: '-A N prints N lines after (trailing context); -B N prints before; -C N prints both.'
          }
        ],
        commandChallenge: {
          prompt: 'Inspect OutOfMemoryError and 4 trailing stack trace lines.',
          expectedCommand: 'grep -A 4 "OutOfMemoryError" cluster_exec.log'
        }
      }
    },
    {
      id: 'm4-l10',
      title: 'Cron Jobs & Scheduling Automation',
      duration: '45 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'Cron is the time-based job scheduler in Unix-like operating systems. It allows data engineers to schedule shell scripts, backup routines, HDFS balancers, and ETL jobs to execute automatically at fixed dates, times, or recurring intervals. The cron schedule syntax consists of 5 time fields: Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), and Day of Week (0-6, where 0=Sunday). Cron expressions are managed via crontab -e (edit) and crontab -l (list).',
        hi: 'Cron Linux ka automatic alarm clock / scheduler hota hai. Iska kaam hota hai aapke scripts ko taye kiye gaye time par apne aap run karna — jaise har raat 12:00 AM par daily backup lena, har 15 minute me sensor data ingest karna, ya har Monday subah 6 AM par report generate karna. Iska format 5 stars (* * * * *) se banta hai: Minute, Hour, Day of Month, Month, aur Day of Week. crontab -e se ise edit kiya jaata hai.'
      },
      why: 'While distributed orchestrators like Apache Airflow handle complex DAGs, system-level tasks (log rotation, disk health monitoring, Kerberos ticket renewal kinit, HDFS block balancing) rely fundamentally on Linux cron.',
      how: '1. Cron Syntax: * * * * * command_to_execute\n2. Field 1: Minute (0-59)\n3. Field 2: Hour (0-23, 24hr format)\n4. Field 3: Day of Month (1-31)\n5. Field 4: Month (1-12)\n6. Field 5: Day of Week (0-6, 0=Sun)\n7. Production rule: Always redirect output (>> /var/log/myjob.log 2>&1) and use absolute binary paths (/usr/bin/python3) because cron executes with a minimal default PATH environment.',
      architecture: {
        type: 'cron_syntax_matrix',
        title: 'Cron 5-Field Syntax Breakdown',
        nodes: [
          { name: 'Minute (0-59)', desc: '0 = top of the hour; */15 = every 15 minutes' },
          { name: 'Hour (0-23)', desc: '0 = midnight; 14 = 2 PM; 2 = 2 AM' },
          { name: 'Day of Month (1-31)', desc: '1 = first day of month; * = every day' },
          { name: 'Month (1-12)', desc: '1 = Jan, 12 = Dec; * = every month' },
          { name: 'Day of Week (0-6)', desc: '0 = Sunday, 1 = Monday, 5 = Friday' }
        ]
      },
      industryExample: 'Hadoop administrators schedule the HDFS Balancer to run every Sunday at 2 AM using cron (0 2 * * 0 /usr/local/hadoop/bin/hdfs balancer -threshold 10 >> /var/log/balancer.log 2>&1).',
      practicalLab: {
        title: 'Lab 4.10: Formulating and Inspecting Cron Schedules',
        problemStatement: 'Inspect user crontab entries and write expressions for common data engineering schedules.',
        requirements: 'Linux bash terminal.',
        setup: 'crontab -l',
        instructions: [
          'Step 1: Inspect active crontab configuration with crontab -l.',
          'Step 2: Understand common data engineering schedule patterns.'
        ],
        code: `# cron_lab.sh
cat << 'EOF' > /tmp/sample_cron
# Every day at 2:30 AM
30 2 * * * /usr/local/bin/run_daily_etl.sh >> /var/log/etl.log 2>&1
# Every 15 minutes
*/15 * * * * /usr/local/bin/check_kafka_lag.sh >> /var/log/kafka_lag.log 2>&1
# Every Monday at 6:00 AM
0 6 * * 1 /usr/local/bin/generate_weekly_report.sh >> /var/log/weekly.log 2>&1
EOF
cat /tmp/sample_cron
`,
        commands: [
          'cat /tmp/sample_cron'
        ]
      },
      expectedOutput: `# Every day at 2:30 AM
30 2 * * * /usr/local/bin/run_daily_etl.sh >> /var/log/etl.log 2>&1
# Every 15 minutes
*/15 * * * * /usr/local/bin/check_kafka_lag.sh >> /var/log/kafka_lag.log 2>&1
# Every Monday at 6:00 AM
0 6 * * 1 /usr/local/bin/generate_weekly_report.sh >> /var/log/weekly.log 2>&1`,
      troubleshooting: [
        {
          error: 'Cron job runs manually in terminal, but fails or does nothing when executed by cron',
          rootCause: 'Cron runs with a minimal environment; $PATH does not include /usr/local/bin, or environment variables ($HADOOP_HOME, $JAVA_HOME) are missing.',
          solution: 'Always use absolute paths for commands (/usr/bin/python3, /usr/local/hadoop/bin/hdfs) or source ~/.bashrc at the start of your script.'
        }
      ],
      bestPractices: [
        'Always redirect stdout and stderr: >> /path/to/log.log 2>&1; unredirected output tries to send local mail to root and fails.',
        'Always specify absolute paths for all scripts, data files, and binaries.',
        'Use flock (file lock) in cron scripts to prevent a second scheduled instance from launching if the previous run is still active.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What do the 5 fields in a standard Linux cron expression represent?',
          answer: 'The 5 fields represent in order: 1. Minute (0-59), 2. Hour (0-23), 3. Day of Month (1-31), 4. Month (1-12), and 5. Day of Week (0-6, where 0 is Sunday).'
        },
        {
          level: 'Intermediate',
          question: 'Write a cron expression to execute a script every 30 minutes from Monday through Friday.',
          answer: '*/30 * * * 1-5 /path/to/script.sh. (Minute: */30, Hour: *, Day of Month: *, Month: *, Day of Week: 1-5).'
        },
        {
          level: 'Advanced',
          question: 'How do you prevent overlapping executions of a long-running hourly ETL cron job if one run takes 90 minutes?',
          answer: 'Wrap the execution command using the Linux flock utility: * * * * * /usr/bin/flock -n /var/lock/etl.lock /path/to/etl.sh. The -n (non-blocking) flag acquires an exclusive file lock; if the previous run is still executing, subsequent invocations exit immediately without overlapping.'
        }
      ],
      assignment: {
        task: 'Display the sample crontab configuration using cat /tmp/sample_cron in terminal and verify the 5-field syntax.',
        verificationCriteria: 'Run cat /tmp/sample_cron.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which cron expression runs a script every night at 2:00 AM?',
            options: ['* 2 * * *', '0 2 * * *', '2 0 * * *', '0 0 2 * *'],
            correct: 1,
            explanation: '0 2 * * * corresponds to Minute 0, Hour 2 (2:00 AM), every day, every month.'
          }
        ],
        commandChallenge: {
          prompt: 'Display the crontab entries in /tmp/sample_cron.',
          expectedCommand: 'cat /tmp/sample_cron'
        }
      }
    }
  ]
};

