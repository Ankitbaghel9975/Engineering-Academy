import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { simulationTickets } from '../data/simulationTickets';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, Circle, 
  Terminal, Play, ArrowRight, UserCheck, MessageSquare, 
  FileText, Code2, Sparkles, Check, Copy, Flame, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SimulationMode = () => {
  const { 
    selectedTicketId, 
    setSelectedTicketId, 
    progress, 
    resolveTicket 
  } = useAcademy();

  const currentTicket = simulationTickets.find(t => t.id === selectedTicketId) || simulationTickets[0];
  const isResolved = !!progress.resolvedTickets?.[currentTicket.id];

  // User Quiz selections: { [qIdx]: selectedOptionIdx }
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const [activeCodeTab, setActiveCodeTab] = useState('fix'); // 'broken' or 'fix'
  const [verificationOutput, setVerificationOutput] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSelectOption = (qIdx, optIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    setShowExplanation(prev => ({ ...prev, [qIdx]: true }));
  };

  const handleDeployFix = () => {
    setIsDeploying(true);
    setVerificationOutput('');
    setTimeout(() => {
      setIsDeploying(false);
      setVerificationOutput(currentTicket.resolutionOutcome);
      resolveTicket(currentTicket.id);
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 }
      });
    }, 900);
  };

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
              <Flame className="w-3 h-3" />
              INDUSTRY SIMULATION MODE
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-World Production Incident Tickets</span>
          </div>
          <h1 className="text-xl font-black text-slate-100 mt-1 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            Work Like a Data Engineer
          </h1>
        </div>

        {/* Resolved Count Progress */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">Resolved Incidents:</span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {Object.keys(progress.resolvedTickets || {}).length} / {simulationTickets.length}
          </span>
        </div>
      </div>

      {/* Main Workspace Split: Ticket List (Left) & Ticket Details (Right) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Incident Ticket Selector List */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-slate-900/60 border-r border-slate-800 overflow-y-auto p-3 space-y-2">
          <div className="px-2 py-1 text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            On-Call Incident Queue ({simulationTickets.length} Tickets)
          </div>

          {simulationTickets.map(ticket => {
            const isSelected = ticket.id === currentTicket.id;
            const resolved = !!progress.resolvedTickets?.[ticket.id];

            return (
              <div
                key={ticket.id}
                onClick={() => {
                  setSelectedTicketId(ticket.id);
                  setAnswers({});
                  setShowExplanation({});
                  setVerificationOutput('');
                  setActiveCodeTab('fix');
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-slate-100 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400">
                    {ticket.code}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      ticket.priority.includes('P0')
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {ticket.priority.split(' - ')[0]}
                    </span>
                    {resolved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold mt-1.5 line-clamp-2 text-slate-200">
                  {ticket.title}
                </div>

                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  {ticket.component}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Ticket Resolution Studio */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Ticket Header & Status Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                    {currentTicket.priority}
                  </span>
                  <span className="px-2.5 py-1 rounded text-xs font-mono text-slate-300 bg-slate-800">
                    {currentTicket.component}
                  </span>
                  {isResolved && (
                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolved & Closed
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-slate-100 mt-2">{currentTicket.title}</h2>
              </div>
            </div>

            {/* Manager Slack Message Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-bold text-xs flex-shrink-0">
                EM
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-200">Engineering Manager</span>
                  <span className="text-[10px] text-slate-400">Slack Direct Message (Priority 1)</span>
                </div>
                <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                  "{currentTicket.managerMessage}"
                </p>
              </div>
            </div>
          </div>

          {/* System Error Logs & Stack Trace */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-red-400" />
                Raw Production System Error Logs & Stack Trace
              </span>
              <span className="text-[10px] text-slate-400 font-mono">/var/log/stderr.log</span>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-red-950/40 text-red-300 font-mono text-xs overflow-x-auto leading-relaxed">
              {currentTicket.systemLogs}
            </pre>
          </div>

          {/* Interactive Root Cause Investigation Questions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  Investigate Root Cause (Incident Assessment)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Answer the investigation questions before applying code or command fixes.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {currentTicket.investigationQuestions.map((qObj, qIdx) => {
                const userSelected = answers[qIdx];
                const isAnswered = userSelected !== undefined;
                const isCorrect = userSelected === qObj.correct;

                return (
                  <div key={qIdx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-slate-200">
                      {qIdx + 1}. {qObj.q}
                    </div>

                    <div className="space-y-1.5">
                      {qObj.options.map((opt, oIdx) => {
                        const isChosen = userSelected === oIdx;
                        let optStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                        if (isAnswered) {
                          if (oIdx === qObj.correct) {
                            optStyle = 'bg-emerald-950/30 border-emerald-500 text-emerald-200 font-semibold';
                          } else if (isChosen && !isCorrect) {
                            optStyle = 'bg-red-950/30 border-red-500 text-red-200';
                          }
                        }

                        return (
                          <div
                            key={oIdx}
                            onClick={() => handleSelectOption(qIdx, oIdx)}
                            className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center space-x-2.5 ${optStyle}`}
                          >
                            <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {showExplanation[qIdx] && (
                      <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                        isCorrect ? 'bg-emerald-950/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        <strong>{isCorrect ? '✓ Correct Diagnosis: ' : 'ℹ Note: '}</strong>
                        {qObj.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Code Fix Studio & Verification */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  Engineering Fix & Code Implementation
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review the production fix code, deploy the script, and verify test assertions.
                </p>
              </div>

              {/* Code Toggle Tabs */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveCodeTab('broken')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeCodeTab === 'broken'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Broken Logic
                </button>
                <button
                  onClick={() => setActiveCodeTab('fix')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeCodeTab === 'fix'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Optimized Production Fix
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="relative">
              <pre className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto leading-relaxed ${
                activeCodeTab === 'broken'
                  ? 'bg-slate-950 border-red-900/30 text-red-200/90'
                  : 'bg-slate-950 border-emerald-900/30 text-emerald-300'
              }`}>
                {activeCodeTab === 'broken' ? currentTicket.brokenCode : currentTicket.fixedCode}
              </pre>

              <button
                onClick={() => handleCopyCode(activeCodeTab === 'broken' ? currentTicket.brokenCode : currentTicket.fixedCode)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 text-[11px] flex items-center space-x-1"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Verification & Deployment Action */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-400 font-mono">
                Command: <code className="text-amber-300">{currentTicket.commandToVerify}</code>
              </div>

              <button
                onClick={handleDeployFix}
                disabled={isDeploying}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isDeploying ? 'Deploying Fix & Testing...' : 'Deploy Fix & Verify Incident'}</span>
              </button>
            </div>

            {/* Verification Result Output */}
            {verificationOutput && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-start space-x-3 mt-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-400">INCIDENT RESOLUTION VERIFIED:</div>
                  <div className="mt-1 leading-relaxed text-slate-200">{verificationOutput}</div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

