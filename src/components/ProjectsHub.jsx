import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { projectsData } from '../data/projectsData';
import { 
  Briefcase, CheckCircle2, Circle, AlertTriangle, 
  Terminal, Play, ArrowRight, RefreshCw, Database, 
  HardDrive, Zap, Radio, Layers, Cpu, Award, 
  Server, ShieldAlert, Sparkles, Filter, Check, Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProjectsHub = () => {
  const { 
    selectedProjectId, 
    setSelectedProjectId, 
    progress, 
    markProjectComplete 
  } = useAcademy();

  const currentProject = projectsData.find(p => p.id === selectedProjectId) || projectsData[0];
  const isCompleted = !!progress.completedProjects?.[currentProject.id];

  // Project 1: HDFS Simulation State
  const [hdfsNodes, setHdfsNodes] = useState([
    { id: 'dn-01', rack: '/rack-01', ip: '192.168.1.101', status: 'HEALTHY', blocks: ['blk_101', 'blk_102', 'blk_103'], disk: '42%' },
    { id: 'dn-02', rack: '/rack-01', ip: '192.168.1.102', status: 'HEALTHY', blocks: ['blk_104', 'blk_102'], disk: '38%' },
    { id: 'dn-03', rack: '/rack-01', ip: '192.168.1.103', status: 'HEALTHY', blocks: ['blk_101', 'blk_103'], disk: '45%' },
    { id: 'dn-04', rack: '/rack-02', ip: '192.168.2.101', status: 'HEALTHY', blocks: ['blk_101', 'blk_104'], disk: '40%' },
    { id: 'dn-05', rack: '/rack-02', ip: '192.168.2.102', status: 'HEALTHY', blocks: ['blk_103'], disk: '25%' },
    { id: 'dn-06', rack: '/rack-02', ip: '192.168.2.103', status: 'HEALTHY', blocks: ['blk_102', 'blk_104'], disk: '44%' },
  ]);
  const [hdfsLog, setHdfsLog] = useState('Cluster healthy. All 6 DataNodes reporting heartbeats every 3s.');

  // Project 2: Python ETL State
  const [etlRunStatus, setEtlRunStatus] = useState('idle'); // 'idle' | 'running' | 'success'
  const [etlCleanCount, setEtlCleanCount] = useState(0);
  const [etlDlqCount, setEtlDlqCount] = useState(0);

  // Project 3: SQL Analytics State
  const [sqlExecuted, setSqlExecuted] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  // Project 4: PySpark Benchmark State
  const [benchmarkRan, setBenchmarkRan] = useState(false);
  const [useCache, setUseCache] = useState(false);

  // Project 5: Kafka Streaming State
  const [kafkaStreaming, setKafkaStreaming] = useState(false);
  const [kafkaEventCount, setKafkaEventCount] = useState(4820);
  const [kafkaLag, setKafkaLag] = useState(12);

  // Capstone State
  const [capstoneStage, setCapstoneStage] = useState(7); // all 7 stages completed

  const handleSimulateNodeCrash = (nodeId) => {
    setHdfsNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return { ...n, status: 'DEAD' };
      }
      return n;
    }));
    setHdfsLog(`[CRITICAL] DataNode ${nodeId} heartbeat timed out (>630s). NameNode marked ${nodeId} DEAD. Under-replicated blocks detected: 2.`);
  };

  const handleTriggerReReplication = () => {
    setHdfsNodes(prev => prev.map(n => {
      if (n.id === 'dn-05') {
        return { ...n, blocks: [...n.blocks, 'blk_101_replica', 'blk_103_replica'] };
      }
      return n;
    }));
    setHdfsLog('[RECOVERY] NameNode automatically scheduled replication of blocks to dn-05 (/rack-02). Target replication factor 3 restored for all blocks!');
  };

  const handleResetCluster = () => {
    setHdfsNodes([
      { id: 'dn-01', rack: '/rack-01', ip: '192.168.1.101', status: 'HEALTHY', blocks: ['blk_101', 'blk_102', 'blk_103'], disk: '42%' },
      { id: 'dn-02', rack: '/rack-01', ip: '192.168.1.102', status: 'HEALTHY', blocks: ['blk_104', 'blk_102'], disk: '38%' },
      { id: 'dn-03', rack: '/rack-01', ip: '192.168.1.103', status: 'HEALTHY', blocks: ['blk_101', 'blk_103'], disk: '45%' },
      { id: 'dn-04', rack: '/rack-02', ip: '192.168.2.101', status: 'HEALTHY', blocks: ['blk_101', 'blk_104'], disk: '40%' },
      { id: 'dn-05', rack: '/rack-02', ip: '192.168.2.102', status: 'HEALTHY', blocks: ['blk_103'], disk: '25%' },
      { id: 'dn-06', rack: '/rack-02', ip: '192.168.2.103', status: 'HEALTHY', blocks: ['blk_102', 'blk_104'], disk: '44%' },
    ]);
    setHdfsLog('Cluster reset. All DataNodes restored to HEALTHY state.');
  };

  const handleRunETL = () => {
    setEtlRunStatus('running');
    setTimeout(() => {
      setEtlRunStatus('success');
      setEtlCleanCount(4);
      setEtlDlqCount(3);
    }, 700);
  };

  const handleRunBenchmark = () => {
    setBenchmarkRan(true);
  };

  const handleProduceKafka = () => {
    setKafkaStreaming(true);
    setKafkaEventCount(prev => prev + 500);
    setKafkaLag(4);
    setTimeout(() => {
      setKafkaStreaming(false);
      setKafkaLag(0);
    }, 1200);
  };

  const handleCompleteProject = () => {
    markProjectComplete(currentProject.id);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Top Bar: Title & Project Switcher */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              PORTFOLIO PROJECTS
            </span>
            <span className="text-xs text-slate-400 font-mono">5 Industry Projects + Final Enterprise Capstone</span>
          </div>
          <h1 className="text-xl font-black text-slate-100 mt-1 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            Real-World Industry Projects Hub
          </h1>
        </div>

        {/* Project Switcher Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {projectsData.map(p => {
            const isSelected = p.id === selectedProjectId;
            const done = !!progress.completedProjects?.[p.id];
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>{p.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Project Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {currentProject.category}
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-mono bg-slate-800 text-slate-300">
                  {currentProject.difficulty}
                </span>
                {isCompleted && (
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified & Completed
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-100 mt-2">{currentProject.title}</h2>
              <p className="text-xs text-slate-300 max-w-4xl mt-2 leading-relaxed">{currentProject.summary}</p>
            </div>

            <button
              onClick={handleCompleteProject}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{isCompleted ? 'Completed ✓ (Re-verify)' : 'Mark Project Complete'}</span>
            </button>
          </div>

          {/* Key Objectives */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Core Industry Objectives:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentProject.objectives.map((obj, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-amber-400 font-mono font-bold mt-0.5">•</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            PROJECT 1 INTERACTIVE STUDIO: HDFS DISTRIBUTED STORAGE & RACK REPLICATION
           ========================================================================= */}
        {currentProject.id === 'proj-1' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-amber-400" />
                  Simulated 3-Rack Enterprise HDFS Cluster Visualizer
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Observe 3-replica placement policy, simulate physical DataNode hardware crash, and watch NameNode recovery.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTriggerReReplication}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto Re-Replicate</span>
                </button>
                <button
                  onClick={handleResetCluster}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Cluster Health Status Log */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex items-center space-x-3 text-slate-300">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">NAMENODE LOG</span>
              <span className="flex-1">{hdfsLog}</span>
            </div>

            {/* Visual Racks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Rack 1 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-amber-400 font-mono">/RACK-01 (Top-of-Rack Switch 10G)</span>
                  <span className="text-[10px] text-slate-400">3 DataNodes</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {hdfsNodes.filter(n => n.rack === '/rack-01').map(node => (
                    <div 
                      key={node.id}
                      className={`p-3 rounded-lg border transition-all ${
                        node.status === 'DEAD'
                          ? 'bg-red-950/20 border-red-500/50 text-red-300'
                          : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Server className={`w-4 h-4 ${node.status === 'DEAD' ? 'text-red-400' : 'text-emerald-400'}`} />
                          <span className="font-bold text-xs font-mono">{node.id}</span>
                          <span className="text-[11px] text-slate-400">({node.ip})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            node.status === 'DEAD' ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {node.status}
                          </span>
                          {node.status !== 'DEAD' && (
                            <button
                              onClick={() => handleSimulateNodeCrash(node.id)}
                              className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                            >
                              Crash Node
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {node.blocks.map((blk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-amber-400 font-mono border border-slate-800">
                            {blk}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rack 2 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-cyan-400 font-mono">/RACK-02 (Top-of-Rack Switch 10G)</span>
                  <span className="text-[10px] text-slate-400">3 DataNodes</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {hdfsNodes.filter(n => n.rack === '/rack-02').map(node => (
                    <div 
                      key={node.id}
                      className={`p-3 rounded-lg border transition-all ${
                        node.status === 'DEAD'
                          ? 'bg-red-950/20 border-red-500/50 text-red-300'
                          : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Server className={`w-4 h-4 ${node.status === 'DEAD' ? 'text-red-400' : 'text-emerald-400'}`} />
                          <span className="font-bold text-xs font-mono">{node.id}</span>
                          <span className="text-[11px] text-slate-400">({node.ip})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            node.status === 'DEAD' ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {node.status}
                          </span>
                          {node.status !== 'DEAD' && (
                            <button
                              onClick={() => handleSimulateNodeCrash(node.id)}
                              className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                            >
                              Crash Node
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {node.blocks.map((blk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-cyan-400 font-mono border border-slate-800">
                            {blk}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            PROJECT 2 INTERACTIVE STUDIO: PYTHON ETL & DEAD LETTER QUEUE (DLQ)
           ========================================================================= */}
        {currentProject.id === 'proj-2' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  Interactive Python ETL Engine & Dead Letter Queue (DLQ)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Execute the pipeline to separate valid records from dirty rows (regex error, negative amount, corrupt type).
                </p>
              </div>

              <button
                onClick={handleRunETL}
                disabled={etlRunStatus === 'running'}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{etlRunStatus === 'running' ? 'Executing ETL...' : 'Run ETL Pipeline'}</span>
              </button>
            </div>

            {/* Split: Raw Input vs Clean Output & DLQ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Raw Ingestion Input */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Raw Ingestion Data (Dirty CSV & JSON Sources)
                </span>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                  <div className="text-[11px] text-slate-400 font-semibold">raw_orders.csv:</div>
                  <pre className="text-slate-400 text-[11px] leading-relaxed">
{`1001, arjun@example.com,  1500.00, SUCCESS
1002, bad_email_format,   250.00, SUCCESS  <-- regex invalid
1003, priya@company.org,  INVALID, SUCCESS  <-- type casting error
1004, rohan@test.com,    -50.00,  SUCCESS  <-- negative amount error
1005, neha@service.in,    890.00,  PAID`}
                  </pre>
                </div>
              </div>

              {/* Clean Warehouse Table vs DLQ */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center justify-between">
                  <span>ETL Destination Tables</span>
                  {etlRunStatus === 'success' && (
                    <span className="text-emerald-400 text-[10px] font-bold">
                      Loaded: {etlCleanCount} | Quarantined: {etlDlqCount}
                    </span>
                  )}
                </span>

                {etlRunStatus === 'idle' ? (
                  <div className="p-8 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-400">
                    Click <strong>"Run ETL Pipeline"</strong> above to ingest, sanitize, and partition records.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Clean Table */}
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 font-mono text-[11px]">
                      <div className="text-emerald-400 font-bold mb-1">TABLE: clean_warehouse.orders</div>
                      <table className="w-full text-slate-300 text-left">
                        <thead>
                          <tr className="border-b border-emerald-900/40 text-slate-400">
                            <th>ID</th><th>EMAIL</th><th>AMOUNT</th><th>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td>1001</td><td>arjun@example.com</td><td>$1500.00</td><td className="text-emerald-400">SUCCESS</td></tr>
                          <tr><td>1005</td><td>neha@service.in</td><td>$890.00</td><td className="text-emerald-400">PAID</td></tr>
                        </tbody>
                      </table>
                    </div>

                    {/* DLQ Quarantine Table */}
                    <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 font-mono text-[11px]">
                      <div className="text-red-400 font-bold mb-1">TABLE: dead_letter_queue (DLQ)</div>
                      <table className="w-full text-slate-300 text-left">
                        <thead>
                          <tr className="border-b border-red-900/40 text-slate-400">
                            <th>ID</th><th>RAW VALUE</th><th>REASON FOR QUARANTINE</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td>1002</td><td>bad_email_format</td><td className="text-red-400">Regex email mismatch</td></tr>
                          <tr><td>1003</td><td>INVALID</td><td className="text-red-400">Float cast failed (ValueError)</td></tr>
                          <tr><td>1004</td><td>-50.00</td><td className="text-red-400">Constraint violation: amount &lt; 0</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            PROJECT 3 INTERACTIVE STUDIO: SQL ANALYTICS WAREHOUSE & EXPLAIN TUNING
           ========================================================================= */}
        {currentProject.id === 'proj-3' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  SQL Analytics Query Engine & Execution Plan Optimizer
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Run CTE window functions and toggle between raw Sequential Scans vs Index Lookups.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowExplain(!showExplain)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    showExplain
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {showExplain ? 'Hide EXPLAIN Plan' : 'Show EXPLAIN Plan'}
                </button>
                <button
                  onClick={() => setSqlExecuted(true)}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Query</span>
                </button>
              </div>
            </div>

            {/* Query Editor & Results */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 leading-relaxed overflow-x-auto">
                <pre>{currentProject.sampleQuery}</pre>
              </div>

              {showExplain && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 font-mono text-xs text-purple-300 space-y-2">
                  <div className="font-bold flex items-center justify-between">
                    <span>EXPLAIN ANALYZE EXECUTION PLAN</span>
                    <span className="text-emerald-400">Total Cost: 14.2 (Index Scan Activated)</span>
                  </div>
                  <pre className="text-[11px] text-purple-200/80 leading-relaxed">
{`-> WindowAgg (DENSE_RANK() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC))
   -> Sort: e.dept_id, e.salary DESC
      -> Nested Loop Inner Join
         -> Index Scan using idx_emp_dept on employees e (cost=0.42..8.12 rows=50 width=64)
         -> Index Scan using pk_departments on departments d (cost=0.15..0.22 rows=1 width=32)`}
                  </pre>
                </div>
              )}

              {sqlExecuted && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
                  <span className="text-xs font-mono text-emerald-400 font-bold mb-2 block">
                    QUERY RESULT (Filtered rank_in_dept &lt;= 2):
                  </span>
                  <table className="w-full font-mono text-xs text-slate-200 text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-1.5">NAME</th>
                        <th className="py-1.5">DEPARTMENT</th>
                        <th className="py-1.5">SALARY</th>
                        <th className="py-1.5">RANK_IN_DEPT</th>
                        <th className="py-1.5">ROLLING_PAYROLL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="py-1.5 font-bold text-amber-400">Vikram Rao</td>
                        <td>Data Engineering</td>
                        <td>$185,000</td>
                        <td>1</td>
                        <td>$185,000</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-amber-400">Priya Sharma</td>
                        <td>Data Engineering</td>
                        <td>$160,000</td>
                        <td>2</td>
                        <td>$345,000</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-cyan-400">Aarav Patel</td>
                        <td>Machine Learning</td>
                        <td>$195,000</td>
                        <td>1</td>
                        <td>$195,000</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-cyan-400">Sneha Iyer</td>
                        <td>Machine Learning</td>
                        <td>$170,000</td>
                        <td>2</td>
                        <td>$365,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            PROJECT 4 INTERACTIVE STUDIO: PYSPARK PERFORMANCE & SKEW SALTING
           ========================================================================= */}
        {currentProject.id === 'proj-4' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Apache Spark 3.5 In-Memory Benchmark & Key Salting
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Benchmark 2,000,000 clickstream events and inspect memory caching speedup.
                </p>
              </div>

              <button
                onClick={handleRunBenchmark}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Spark Benchmark</span>
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Total Records</span>
                <div className="text-lg font-bold text-slate-100 mt-0.5">2,000,000</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Uncached Execution</span>
                <div className="text-lg font-bold text-amber-400 mt-0.5">3.42s (Disk read)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Cached Execution</span>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">0.12s (RAM read)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Speedup Achieved</span>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">28.5x Faster</div>
              </div>
            </div>

            {/* Key Salting Skew Fix Explanation */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 font-mono">
                Key Salting Code Optimization (Eliminating Straggler Tasks):
              </span>
              <pre className="p-3 rounded-lg bg-slate-900 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
{`# 1. Add random salt (0 to 9) to heavily skewed guest user rows
skewed_df = df.withColumn("salted_key", 
    F.concat(F.col("user_id"), F.lit("_"), F.floor(F.rand() * 10))
)

# 2. Replicate lookup table 10x with salt suffixes
lookup_replicated = lookup_df.withColumn("salt", F.explode(F.array([F.lit(i) for i in range(10)]))) \\
    .withColumn("salted_key", F.concat(F.col("user_id"), F.lit("_"), F.col("salt")))

# 3. Join on salted_key -> perfect uniform distribution across all 16 executors!
clean_join_df = skewed_df.join(lookup_replicated, "salted_key")`}
              </pre>
            </div>
          </div>
        )}

        {/* =========================================================================
            PROJECT 5 INTERACTIVE STUDIO: REAL-TIME KAFKA STREAMING & LAG MONITOR
           ========================================================================= */}
        {currentProject.id === 'proj-5' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-amber-400" />
                  Apache Kafka 3-Broker Cluster & Consumer Lag Gauge
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publish real-time financial events, measure consumer group lag, and observe partition rebalancing.
                </p>
              </div>

              <button
                onClick={handleProduceKafka}
                disabled={kafkaStreaming}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{kafkaStreaming ? 'Publishing 500 Events...' : 'Produce 500 Events'}</span>
              </button>
            </div>

            {/* 3 Kafka Brokers Visualizer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">BROKER 101</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">LEADER</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">host: kafka-01:9092</div>
                <div className="text-[11px] text-slate-400">Leader for Partition 0, Partition 3</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">BROKER 102</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">LEADER</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">host: kafka-02:9092</div>
                <div className="text-[11px] text-slate-400">Leader for Partition 1, Partition 4</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-purple-400">BROKER 103</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">LEADER</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">host: kafka-03:9092</div>
                <div className="text-[11px] text-slate-400">Leader for Partition 2, Partition 5</div>
              </div>
            </div>

            {/* Consumer Lag Live Gauge */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div>
                <span className="text-slate-400">Consumer Group:</span>
                <span className="text-slate-100 font-bold ml-2">fraud-detection-engine</span>
              </div>
              <div>
                <span className="text-slate-400">Published Messages:</span>
                <span className="text-amber-400 font-bold ml-2">{kafkaEventCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Current Lag:</span>
                <span className={`px-2.5 py-0.5 rounded font-bold ${
                  kafkaLag === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {kafkaLag} records
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            FINAL CAPSTONE PROJECT: END-TO-END ENTERPRISE DATA LAKEHOUSE PIPELINE
           ========================================================================= */}
        {currentProject.id === 'proj-capstone' && (
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  ENTERPRISE CAPSTONE ARCHITECTURE
                </span>
                <h3 className="text-lg font-black text-slate-100 mt-1 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  Full End-to-End Enterprise Data Lakehouse Pipeline
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Python &rarr; Kafka &rarr; HDFS Distributed Storage &rarr; Spark Structured Streaming &rarr; Hive/Trino SQL
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
                  All 7 Stages Operational
                </span>
              </div>
            </div>

            {/* Visual Pipeline Flowchart */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-400 font-mono">
                MEDALLION DATA FLOW TELEMETRY:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentProject.pipelineStages.slice(0, 4).map(st => (
                  <div key={st.step} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-amber-400 font-bold">STAGE 0{st.step}</span>
                      <span className="text-[10px] font-mono text-emerald-400">{st.latency}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200">{st.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{st.tech}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentProject.pipelineStages.slice(4).map(st => (
                  <div key={st.step} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">STAGE 0{st.step}</span>
                      <span className="text-[10px] font-mono text-emerald-400">{st.latency}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200">{st.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{st.tech}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Tech Stack Summary */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-amber-300 block">End-to-End Capstone Verification Checklist:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Python Faker producing JSON events with acks=all</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>HDFS storing 128 MB raw Parquet partitions</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PySpark Structured Streaming deduplicating Silver</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hive Metastore catalog exposing analytical Gold Marts</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

