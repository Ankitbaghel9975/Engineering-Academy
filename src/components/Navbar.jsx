import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { allModules } from '../data/modules';
import { 
  Database, Terminal, Briefcase, Award, 
  HelpCircle, FileText, CheckCircle2, Globe, 
  Layers, Search, Menu, X, Sparkles, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Navbar = ({ onOpenCertificate, onOpenCheatSheet }) => {
  const { 
    activeTab, 
    setActiveTab, 
    languageMode, 
    setLanguageMode, 
    progress, 
    updateUserName 
  } = useAcademy();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.userName || 'Big Data Cadet');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Compute total lessons & completed count
  const totalLessons = allModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = Object.keys(progress.completedLessons || {}).length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  const handleNameSave = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      updateUserName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const triggerCertificateCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    onOpenCertificate();
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('curriculum')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Database className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  Big Data Engineer Academy
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                  Zero to Industry Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Apache Hadoop • HDFS • YARN • Linux • Python • SQL • Spark • Kafka</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'curriculum' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum (9 Modules)</span>
            </button>

            <button
              onClick={() => setActiveTab('lab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'lab' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'projects' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Industry Projects (5+1)</span>
            </button>

            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'simulation' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-rose-400" />
              <span>Work Like a DE</span>
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'interview' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Interview Prep</span>
            </button>
          </nav>

          {/* Right Controls: Language Mode, Progress, Cheatsheet, Certificate */}
          <div className="flex items-center space-x-2.5">
            
            {/* Language Mode Selector */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setLanguageMode('en')}
                title="English only"
                className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                  languageMode === 'en' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguageMode('hi')}
                title="Hinglish only"
                className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                  languageMode === 'hi' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hinglish
              </button>
              <button
                onClick={() => setLanguageMode('dual')}
                title="Side-by-side Dual View"
                className={`px-2 py-1 rounded text-[11px] font-semibold transition flex items-center space-x-1 ${
                  languageMode === 'dual' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Dual</span>
              </button>
            </div>

            {/* Quick Cheatsheet Button */}
            <button
              onClick={onOpenCheatSheet}
              title="Open Quick Cheat Sheet"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition flex items-center space-x-1 text-xs"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline text-[11px]">Cheatsheet</span>
            </button>

            {/* Certificate Button */}
            <button
              onClick={triggerCertificateCelebration}
              title="View Graduation Certificate"
              className="px-2.5 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold rounded-lg shadow-md transition flex items-center space-x-1 text-xs"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span className="hidden md:inline text-[11px]">Certificate</span>
            </button>

            {/* Progress Badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 leading-tight">Progress</div>
                <div className="text-xs font-bold text-amber-400 leading-tight">
                  {completedCount}/{totalLessons} ({progressPercent}%)
                </div>
              </div>
              <div className="w-8 h-8 relative flex items-center justify-center">
                <svg className="w-7 h-7 transform -rotate-90">
                  <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-slate-800" />
                  <circle 
                    cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="2.5" fill="transparent"
                    strokeDasharray={69.1}
                    strokeDashoffset={69.1 - (69.1 * progressPercent) / 100}
                    className="text-amber-400 transition-all duration-500 ease-out" 
                  />
                </svg>
              </div>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 bg-slate-800 text-slate-300 rounded-lg hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => { setActiveTab('curriculum'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg flex items-center space-x-2 ${
                activeTab === 'curriculum' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Curriculum</span>
            </button>
            <button
              onClick={() => { setActiveTab('lab'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg flex items-center space-x-2 ${
                activeTab === 'lab' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Interactive Lab</span>
            </button>
            <button
              onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg flex items-center space-x-2 ${
                activeTab === 'projects' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Projects (5+1)</span>
            </button>
            <button
              onClick={() => { setActiveTab('simulation'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg flex items-center space-x-2 ${
                activeTab === 'simulation' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <Briefcase className="w-4 h-4 text-rose-400" />
              <span>Work Like a DE</span>
            </button>
            <button
              onClick={() => { setActiveTab('interview'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg flex items-center space-x-2 col-span-2 ${
                activeTab === 'interview' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Interview Question Bank</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

