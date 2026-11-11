import React, { useState } from 'react';
import { 
  Server, Database, Network, Cpu, HardDrive, 
  Layers, ArrowRight, ShieldCheck, Activity, Info
} from 'lucide-react';

export const ArchitectureViewer = ({ architectureData }) => {
  if (!architectureData || !architectureData.nodes) return null;

  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const activeNode = architectureData.nodes[activeNodeIndex] || architectureData.nodes[0];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">
              {architectureData.title || 'Interactive Architecture Visualizer'}
            </h4>
            <p className="text-[10px] text-slate-400">Click components to inspect operational internals</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-amber-400 font-mono">
          Interactive Topology
        </span>
      </div>

      {/* Nodes visual grid */}
      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {architectureData.nodes.map((node, idx) => {
          const isSelected = activeNodeIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => setActiveNodeIndex(idx)}
              className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10 scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded ${
                  isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Server className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
              </div>

              <div>
                <h5 className="text-xs font-bold truncate">{node.name}</h5>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {node.desc}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                <span className={isSelected ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
                  {isSelected ? 'Active Selection' : 'Click to inspect'}
                </span>
                <ArrowRight className={`w-3 h-3 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Node Inspector Panel */}
      {activeNode && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 mt-2 flex items-start space-x-3 text-xs">
          <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 flex-shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-slate-200 text-xs">
                Component Breakdown: {activeNode.name}
              </h5>
              <span className="text-[10px] text-slate-400 font-mono">Live Topology Inspector</span>
            </div>
            <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
              {activeNode.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

