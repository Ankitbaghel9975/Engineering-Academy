import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, Copy, Check, Play, 
  Trash2, HelpCircle, Sparkles, AlertCircle 
} from 'lucide-react';

export const InteractiveTerminal = ({ initialCommand = '', onCommandExecuted }) => {
  const [history, setHistory] = useState([
    {
      type: 'system',
      text: `Big Data Engineer Academy Terminal v3.3.6 (x86_64-pc-linux-gnu)
Cluster Connected: master-01.corp.internal [HDFS HA • YARN • Spark 3.5 • Kafka 3.6]
Type 'help' for available Big Data, HDFS, YARN, and Linux commands.`
    }
  ]);
  const [inputVal, setInputVal] = useState(initialCommand || '');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [copied, setCopied] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (initialCommand) {
      setInputVal(initialCommand);
    }
  }, [initialCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdStr) => {
    const rawCmd = (cmdStr || inputVal).trim();
    if (!rawCmd) return;

    // Add to history
    setCmdHistory(prev => [...prev, rawCmd]);
    setHistoryIdx(-1);

    const cmdRecord = { type: 'command', text: rawCmd };
    let responseRecord = { type: 'output', text: '' };

    const lower = rawCmd.toLowerCase();

    // Command Parser & Mock Engine
    if (lower === 'clear' || lower === 'cls') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (lower === 'help') {
      responseRecord.text = `Available Commands:
  • HDFS:  hdfs dfs -ls [path], hdfs dfs -mkdir -p [dir], hdfs dfs -put [src] [dst]
           hdfs dfs -cat [file], hdfs dfsadmin -report, hdfs dfsadmin -safemode [get|enter|leave]
           hdfs fsck [path], hdfs dfs -setrep -w [N] [file], hdfs haadmin -getServiceState [nn]
  • YARN:  yarn node -list, yarn application -list, yarn logs -applicationId [id], yarn queue -status [q]
  • Linux: free -m, df -h, nproc, ps -ef, hostname, id, chmod 755 [file], ss -tuln
  • Spark: spark-submit, python3 [script.py]
  • Kafka: kafka-topics.sh, kafka-consumer-groups.sh, kafka-console-consumer.sh
  • System: clear, help`;
    } 
    // HDFS Commands
    else if (rawCmd.startsWith('hdfs dfs -ls') || rawCmd.startsWith('hadoop fs -ls')) {
      const target = rawCmd.split('-ls')[1]?.trim() || '/';
      responseRecord.text = `Found 3 items for path: ${target || '/'}
drwxr-xr-x   - hadoop supergroup          0 2026-11-11 14:00 /data
drwxr-xr-x   - hadoop supergroup          0 2026-11-11 14:00 /user
-rw-r--r--   3 hadoop supergroup   358890 2026-11-11 14:30 /data/warehouse/sample.csv`;
    } else if (rawCmd.startsWith('hdfs dfs -mkdir')) {
      responseRecord.text = `Directory created successfully.`;
    } else if (rawCmd.startsWith('hdfs dfs -put')) {
      responseRecord.text = `File uploaded to HDFS. Allocated 128 MB blocks across DataNodes with replication factor 3. Checksum: CRC-32 verified.`;
    } else if (rawCmd.startsWith('hdfs dfs -cat')) {
      responseRecord.text = `order_id,user_id,amount,status,timestamp
1001,usr_88,1500.00,SUCCESS,1731315000
1002,usr_92,250.00,SUCCESS,1731315012
1003,usr_41,4200.50,SUCCESS,1731315024
1004,usr_88,95.00,SUCCESS,1731315036`;
    } else if (rawCmd.includes('hdfs dfsadmin -report')) {
      responseRecord.text = `Configured Capacity: 107374182400 (100 GB)
Present Capacity: 96636764160 (90 GB)
DFS Remaining: 85899345920 (80 GB)
DFS Used: 10737418240 (10 GB)
DFS Used%: 10.00%
Under replicated blocks: 0
Blocks with corrupt replicas: 0
Missing blocks: 0
Live datanodes (3):
  worker-01.internal (/rack-01): Normal | Last Contact: 1s
  worker-02.internal (/rack-01): Normal | Last Contact: 2s
  worker-03.internal (/rack-02): Normal | Last Contact: 1s`;
    } else if (rawCmd.includes('hdfs dfsadmin -safemode get')) {
      responseRecord.text = `Safe mode is OFF`;
    } else if (rawCmd.includes('hdfs dfsadmin -safemode enter')) {
      responseRecord.text = `Safe mode is ON. Filesystem is strictly READ-ONLY. Block replication and deletion paused.`;
    } else if (rawCmd.includes('hdfs dfsadmin -safemode leave')) {
      responseRecord.text = `Safe mode is OFF. Cluster opened for read/write operations.`;
    } else if (rawCmd.includes('hdfs dfsadmin -printTopology') || rawCmd.includes('printTopology')) {
      responseRecord.text = `Rack: /rack-01
   192.168.1.101:9866 (worker-01.internal)
   192.168.1.102:9866 (worker-02.internal)
Rack: /rack-02
   192.168.2.101:9866 (worker-03.internal)
   192.168.2.102:9866 (worker-04.internal)`;
    } else if (rawCmd.includes('hdfs fsck')) {
      responseRecord.text = `Status: HEALTHY
 Number of data-nodes: 3
 Number of racks: 2
 Total blocks (validated): 4 (avg. block size 128 MB)
 Minimally replicated blocks: 4 (100.0 %)
 Over-replicated blocks: 0 (0.0 %)
 Under-replicated blocks: 0 (0.0 %)
 Corrupt blocks: 0
 Missing replicas: 0 (0.0 %)
FSCK ended in 14 ms. Filesystem is HEALTHY.`;
    } else if (rawCmd.includes('hdfs haadmin -getServiceState')) {
      responseRecord.text = `active`;
    } else if (rawCmd.includes('hdfs dfs -setrep')) {
      responseRecord.text = `Replication 2 set: target path
Waiting for replication factor to update ... done`;
    } 
    // YARN Commands
    else if (rawCmd.includes('yarn node -list')) {
      responseRecord.text = `Total Nodes:3
         Node-Id	     Node-State	Node-Http-Address	Number-of-Running-Containers
worker-01:45454	        RUNNING	   worker-01:8042	                           2
worker-02:45454	        RUNNING	   worker-02:8042	                           2
worker-03:45454	        RUNNING	   worker-03:8042	                           1`;
    } else if (rawCmd.includes('yarn application -list')) {
      responseRecord.text = `Total number of applications: 1
                Application-Id	      Application-Name	      Application-Type	   State	   Final-State	 Progress
application_1731315000000_0001	      Spark_Daily_ETL	                 SPARK	FINISHED	     SUCCEEDED	     100%`;
    } else if (rawCmd.includes('yarn queue -status')) {
      responseRecord.text = `Queue-Name : default
State : RUNNING
Capacity : 100.0%
Current-Capacity : 25.0%
Maximum-Capacity : 100.0%`;
    } else if (rawCmd.includes('yarn logs')) {
      responseRecord.text = `[INFO] Container container_1731315000000_0001_01_000001 on worker-01
Spark ApplicationMaster started successfully.
Tasks completed: 200/200. WholeStageCodegen enabled. Exit Code: 0 (SUCCESS)`;
    }
    // Linux Commands
    else if (rawCmd.includes('free -m') || rawCmd.includes('free -g')) {
      responseRecord.text = `              total        used        free      shared  buff/cache   available
Mem:          16384        4210        8120         210        4054       11964
Swap:          2048           0        2048`;
    } else if (rawCmd.includes('df -h')) {
      responseRecord.text = `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       250G   45G  193G  19% /
/dev/sdb1       4.0T  2.1T  1.9T  53% /data/hdfs1
/dev/sdc1       4.0T  2.2T  1.8T  55% /data/hdfs2`;
    } else if (rawCmd.includes('df -i')) {
      responseRecord.text = `Filesystem       Inodes  IUsed   IFree IUse% Mounted on
/dev/sda1      16384000 684210 15699790    5% /`;
    } else if (rawCmd.includes('nproc')) {
      responseRecord.text = `8`;
    } else if (rawCmd.includes('hostname')) {
      responseRecord.text = `master-01.corp.internal`;
    } else if (rawCmd.includes('id')) {
      responseRecord.text = `uid=1000(hadoop) gid=1000(hadoop) groups=1000(hadoop),27(sudo),999(supergroup)`;
    } else if (rawCmd.includes('jps')) {
      responseRecord.text = `12401 NameNode
12650 DataNode
12890 SecondaryNameNode
13120 ResourceManager
13350 NodeManager
14500 Jps`;
    } else if (rawCmd.includes('ss -tuln') || rawCmd.includes('netstat')) {
      responseRecord.text = `Netid State  Local Address:Port  Peer Address:Port
tcp   LISTEN 0.0.0.0:22         0.0.0.0:*
tcp   LISTEN 0.0.0.0:9000       0.0.0.0:* (NameNode RPC)
tcp   LISTEN 0.0.0.0:9870       0.0.0.0:* (NameNode Web UI)
tcp   LISTEN 0.0.0.0:8088       0.0.0.0:* (YARN RM Web UI)
tcp   LISTEN 0.0.0.0:9092       0.0.0.0:* (Kafka Broker)`;
    } else if (rawCmd.includes('chmod')) {
      responseRecord.text = `Permissions updated successfully. Mode: -rwxr-xr-x`;
    } else if (rawCmd.includes('wc -l')) {
      responseRecord.text = `24 pipeline.log`;
    } else if (rawCmd.includes('grep')) {
      responseRecord.text = `2026-11-11 14:15:40 ERROR [worker-1] java.lang.OutOfMemoryError: Java heap space
2026-11-11 14:15:45 ERROR [worker-3] Connection refused on port 9092`;
    } else if (rawCmd.includes('cat')) {
      responseRecord.text = `[SAMPLE FILE CONTENT]
id,customer,amount,status
101,Aarav,1200.0,SUCCESS
102,Diya,850.0,SUCCESS
103,Rohan,450.0,SUCCESS`;
    } else if (rawCmd.startsWith('python3') || rawCmd.startsWith('python')) {
      responseRecord.text = `[Python 3.13.7 runtime executed]
Pipeline Execution: PASSED
Transformed Records: 100% Validated
Output: { status: 'SUCCESS', count: 50000, duration: '142ms' }`;
    }
    // Kafka Commands
    else if (rawCmd.includes('kafka-topics.sh')) {
      responseRecord.text = `Topic: orders_stream	PartitionCount: 3	ReplicationFactor: 2	Configs: min.insync.replicas=2
	Partition 0: Leader=101, Replicas=101,102, Isr=101,102
	Partition 1: Leader=102, Replicas=102,103, Isr=102,103
	Partition 2: Leader=103, Replicas=103,101, Isr=103,101`;
    } else if (rawCmd.includes('kafka-consumer-groups.sh')) {
      responseRecord.text = `GROUP                  TOPIC           PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG
analytics-group        orders_stream   0          10450           10500           50
analytics-group        orders_stream   1          8900            9820            920
analytics-group        orders_stream   2          12100           12105           5`;
    } else {
      responseRecord.text = `Command executed: [OK]
Result: ${rawCmd} finished with exit code 0.`;
    }

    setHistory(prev => [...prev, cmdRecord, responseRecord]);
    setInputVal('');

    if (onCommandExecuted) {
      onCommandExecuted(rawCmd);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIdx < cmdHistory.length - 1 ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || '');
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  const copyTerminalOutput = () => {
    const fullText = history.map(h => (h.type === 'command' ? `$ ${h.text}` : h.text)).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
      
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/90 px-3 py-2 border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center space-x-1.5 text-slate-400 pl-2">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold text-slate-300">hadoop@master-01: ~</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Preset Buttons */}
          <button
            onClick={() => executeCommand('hdfs dfsadmin -report')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] border border-slate-700 transition"
          >
            hdfs report
          </button>
          <button
            onClick={() => executeCommand('yarn node -list')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] border border-slate-700 transition"
          >
            yarn nodes
          </button>
          <button
            onClick={() => executeCommand('free -m')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] border border-slate-700 transition"
          >
            free -m
          </button>

          <button
            onClick={copyTerminalOutput}
            title="Copy Output"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setHistory([])}
            title="Clear Console"
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="p-3.5 h-64 sm:h-72 overflow-y-auto space-y-1.5 text-slate-300 scrollbar-thin scrollbar-thumb-slate-800 cursor-text"
      >
        {history.map((item, idx) => (
          <div key={idx} className="leading-relaxed">
            {item.type === 'system' ? (
              <pre className="text-slate-400 whitespace-pre-wrap font-mono text-[11px] pb-1 border-b border-slate-800/60 mb-2">
                {item.text}
              </pre>
            ) : item.type === 'command' ? (
              <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                <span className="text-cyan-400 font-normal">hadoop@master:~$</span>
                <span>{item.text}</span>
              </div>
            ) : (
              <pre className="text-emerald-300/90 whitespace-pre-wrap pl-4 font-mono text-[11px] leading-snug">
                {item.text}
              </pre>
            )}
          </div>
        ))}

        {/* Input prompt line */}
        <div className="flex items-center space-x-1.5 pt-1">
          <span className="text-cyan-400">hadoop@master:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command here..."
            className="flex-1 bg-transparent text-amber-200 placeholder-slate-600 focus:outline-none font-mono text-xs"
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

