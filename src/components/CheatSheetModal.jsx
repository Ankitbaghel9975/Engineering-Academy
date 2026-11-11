import React, { useState } from 'react';
import { cheatsheets } from '../data/cheatsheets';
import { 
  X, FileText, Copy, Check, Search, 
  Terminal, Database, HardDrive, Zap, Radio 
} from 'lucide-react';

export const CheatSheetModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCmd, setCopiedCmd] = useState(null);

  const activeSheet = cheatsheets[activeCategoryIdx] || cheatsheets[0];

  const handleCopy = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const filteredCommands = activeSheet.commands.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Data Engineering CLI & Code Cheatsheet
              </h2>
              <p className="text-xs text-slate-400">
                Essential syntax reference for HDFS, Linux, PySpark, SQL, and Kafka.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar & Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {cheatsheets.map((sheet, idx) => (
              <button
                key={sheet.id}
                onClick={() => {
                  setActiveCategoryIdx(idx);
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  idx === activeCategoryIdx
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sheet.title.split(' ')[0]} {sheet.category}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search command or desc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Commands List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No commands found matching "{searchQuery}".
            </div>
          ) : (
            filteredCommands.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition-all"
              >
                <div className="space-y-1 flex-1">
                  <div className="font-mono text-xs text-amber-300 overflow-x-auto">
                    <code>{item.cmd}</code>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {item.desc}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(item.cmd)}
                  className="self-end sm:self-center px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center space-x-1 flex-shrink-0"
                >
                  {copiedCmd === item.cmd ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

