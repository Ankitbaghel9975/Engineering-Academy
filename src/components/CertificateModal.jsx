import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { allModules } from '../data/modules';
import { 
  X, Award, Download, Printer, CheckCircle2, 
  ShieldCheck, Sparkles, Database, Layers 
} from 'lucide-react';

export const CertificateModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { progress } = useAcademy();
  const userName = progress.userName || 'Big Data Cadet';
  
  const totalLessons = allModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = Object.keys(progress.completedLessons || {}).length;
  const completedProjects = Object.keys(progress.completedProjects || {}).length;
  const resolvedTickets = Object.keys(progress.resolvedTickets || {}).length;

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certificateId = `BDE-${Math.abs(userName.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)).toString(16).toUpperCase().padStart(8, '0')}-2026`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-slate-100">
              Verified Industry Credential Certificate
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Certificate Canvas */}
        <div className="p-8 overflow-y-auto flex items-center justify-center bg-slate-950">
          <div 
            id="certificate-print-area"
            className="w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-4 border-amber-500/40 rounded-2xl p-8 relative shadow-2xl text-center space-y-6"
          >
            {/* Background Decorative Crest */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header Badge */}
            <div className="flex items-center justify-center space-x-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 flex items-center justify-center shadow-xl shadow-amber-500/20">
                <Database className="w-6 h-6 text-slate-950" />
              </div>
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-amber-400">
                Big Data Engineer Academy
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wider mt-1">
                Certificate of Industry Readiness
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Official Credential Verification & Competency Certification
              </p>
            </div>

            <div className="py-2">
              <span className="text-xs text-slate-400 italic">This certifies that</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 underline decoration-amber-500/40 underline-offset-8 mt-1 tracking-wide font-sans">
                {userName}
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
              has demonstrated rigorous, hands-on technical proficiency across the complete Enterprise Big Data Engineering curriculum, fulfilling core requirements in <strong>Distributed Storage (Apache HDFS)</strong>, <strong>Cluster Compute (Hadoop YARN & MapReduce)</strong>, <strong>In-Memory Processing (Apache Spark & PySpark)</strong>, <strong>Real-Time Event Streaming (Apache Kafka)</strong>, <strong>Analytical SQL Tuning</strong>, <strong>Linux Systems Administration</strong>, and <strong>Enterprise Capstone Architecture</strong>.
            </p>

            {/* Verification Stats Matrix */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-mono">Curriculum</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">{completedLessons} / {totalLessons} Topics</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-mono">Portfolio</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{completedProjects} / 6 Projects</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-mono">Simulations</div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">{resolvedTickets} / 8 Tickets</div>
              </div>
            </div>

            {/* Bottom Credentials Footer */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
              <div className="text-left font-mono text-[11px]">
                <div>Date of Issue: <span className="text-slate-200">{currentDate}</span></div>
                <div>Credential ID: <span className="text-amber-400 font-bold">{certificateId}</span></div>
              </div>

              <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  Digitally Verified & Validated
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

