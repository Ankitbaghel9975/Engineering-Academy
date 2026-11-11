import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { interviewQuestions } from '../data/interviewQuestions';
import { 
  HelpCircle, Search, Filter, CheckCircle2, Circle, 
  ChevronDown, ChevronRight, Copy, Check, Building2, 
  Sparkles, Award, BookOpen, Layers, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InterviewHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [revealedIds, setRevealedIds] = useState({});
  const [masteredIds, setMasteredIds] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Extract unique categories & companies
  const categories = ['All', ...new Set(interviewQuestions.map(q => q.category))];
  const companies = ['All', ...new Set(interviewQuestions.map(q => q.company))];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const toggleReveal = (id) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMastered = (id) => {
    setMasteredIds(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
      return next;
    });
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQuestions = interviewQuestions.filter(q => {
    if (selectedCategory !== 'All' && q.category !== selectedCategory) return false;
    if (selectedLevel !== 'All' && q.level !== selectedLevel) return false;
    if (selectedCompany !== 'All' && q.company !== selectedCompany) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchQ = q.question.toLowerCase().includes(query);
      const matchA = q.answer.toLowerCase().includes(query);
      const matchComp = q.company.toLowerCase().includes(query);
      return matchQ || matchA || matchComp;
    }
    return true;
  });

  const masteredCount = Object.values(masteredIds).filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              BIG TECH INTERVIEW PREP
            </span>
            <span className="text-xs text-slate-400 font-mono">FAANG & Unicorn Question Bank</span>
          </div>
          <h1 className="text-xl font-black text-slate-100 mt-1 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            Data Engineering Interview Hub
          </h1>
        </div>

        {/* Mastered Progress Counter */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400">Mastered Questions:</span>
          <span className="text-xs font-mono font-bold text-amber-400">
            {masteredCount} / {interviewQuestions.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-3 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search interview questions, keywords, company tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Level Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] text-slate-400 font-mono">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            >
              {levels.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Company Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] text-slate-400 font-mono">Company:</span>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            >
              {companies.map(comp => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Scrollable List */}
      <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
            <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold">No interview questions match your current filters.</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search bar or category dropdown.</p>
          </div>
        ) : (
          filteredQuestions.map(q => {
            const isRevealed = !!revealedIds[q.id];
            const isMastered = !!masteredIds[q.id];

            return (
              <div
                key={q.id}
                className={`bg-slate-900 border rounded-2xl p-5 transition-all shadow-lg ${
                  isMastered ? 'border-amber-500/40 bg-amber-950/5' : 'border-slate-800'
                }`}
              >
                {/* Question Top Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {q.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {q.level}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {q.company}
                    </span>
                  </div>

                  {/* Mastered Checkbox Button */}
                  <button
                    onClick={() => toggleMastered(q.id)}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isMastered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isMastered ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                    <span>{isMastered ? 'Mastered' : 'Mark as Mastered'}</span>
                  </button>
                </div>

                {/* The Question */}
                <div className="py-3 text-sm font-bold text-slate-100 leading-snug">
                  {q.question}
                </div>

                {/* Model Answer Toggle & Section */}
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleReveal(q.id)}
                      className="flex items-center space-x-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
                    >
                      {isRevealed ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      <span>{isRevealed ? 'Hide Official Model Answer' : 'Reveal Official Model Answer'}</span>
                    </button>

                    {isRevealed && (
                      <button
                        onClick={() => handleCopy(q.id, q.answer)}
                        className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-slate-200"
                      >
                        {copiedId === q.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === q.id ? 'Copied!' : 'Copy Answer'}</span>
                      </button>
                    )}
                  </div>

                  {isRevealed && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {q.answer}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

