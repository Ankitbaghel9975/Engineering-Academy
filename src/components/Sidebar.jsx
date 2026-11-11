import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { allModules } from '../data/modules';
import { 
  CheckCircle2, Circle, ChevronDown, ChevronRight, 
  Search, Bookmark, BookmarkCheck, Database, HardDrive, 
  Cpu, Terminal, Code2, Table, Zap, Radio, Layers, Filter
} from 'lucide-react';

const moduleIcons = {
  'mod-1': Database,
  'mod-2': HardDrive,
  'mod-3': Cpu,
  'mod-4': Terminal,
  'mod-5': Code2,
  'mod-6': Table,
  'mod-7': Zap,
  'mod-8': Radio,
  'mod-9': Layers,
};

export const Sidebar = () => {
  const { 
    selectedModuleId, 
    setSelectedModuleId, 
    selectedLessonId, 
    setSelectedLessonId, 
    progress, 
    toggleBookmark,
    setActiveTab
  } = useAcademy();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [expandedModules, setExpandedModules] = useState({ [selectedModuleId]: true });

  const toggleModuleAccordion = (modId) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  // Filter modules and lessons
  const filteredModules = allModules.filter(m => {
    if (filterModule !== 'all' && m.id !== filterModule) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchMod = m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    const matchLesson = m.lessons.some(l => 
      l.title.toLowerCase().includes(q) || 
      (l.concept.en && l.concept.en.toLowerCase().includes(q)) ||
      (l.concept.hi && l.concept.hi.toLowerCase().includes(q))
    );
    return matchMod || matchLesson;
  });

  return (
    <aside className="w-80 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none overflow-hidden">
      
      {/* Top Search & Filter Bar */}
      <div className="p-3.5 border-b border-slate-800 space-y-2.5 bg-slate-950/60">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search lessons, concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Module quick filter dropdown */}
        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium">Filter:</span>
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All 9 Modules (82 Lessons)</option>
            {allModules.map(m => (
              <option key={m.id} value={m.id}>{m.title.split(':')[0]}: {m.title.split(':')[1]?.trim() || m.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Modules and Lessons Tree List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {filteredModules.map((mod) => {
          const IconComponent = moduleIcons[mod.id] || Database;
          const isExpanded = !!expandedModules[mod.id] || !!searchQuery.trim();
          const modCompletedCount = mod.lessons.filter(l => progress.completedLessons?.[l.id]).length;
          const isModAllDone = modCompletedCount === mod.lessons.length;

          return (
            <div key={mod.id} className="rounded-xl border border-slate-800/80 bg-slate-950/40 overflow-hidden">
              
              {/* Module Header Accordion */}
              <div 
                onClick={() => {
                  toggleModuleAccordion(mod.id);
                  setSelectedModuleId(mod.id);
                }}
                className={`p-2.5 flex items-center justify-between cursor-pointer transition ${
                  selectedModuleId === mod.id ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className={`p-1.5 rounded-lg ${
                    isModAllDone ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    <IconComponent className="w-4 h-4 flex-shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-200 truncate leading-snug">
                      {mod.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                      <span>{mod.lessons.length} lessons</span>
                      <span>•</span>
                      <span className={modCompletedCount > 0 ? 'text-amber-400 font-medium' : ''}>
                        {modCompletedCount}/{mod.lessons.length} done
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                  {isModAllDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {Math.round((modCompletedCount / mod.lessons.length) * 100)}%
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Lesson Items inside Module */}
              {isExpanded && (
                <div className="p-1.5 space-y-1 bg-slate-950/70 border-t border-slate-800/50">
                  {mod.lessons.map((lesson) => {
                    const isSelected = selectedLessonId === lesson.id;
                    const isCompleted = !!progress.completedLessons?.[lesson.id];
                    const isBookmarked = progress.bookmarkedLessons?.includes(lesson.id);

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => {
                          setSelectedModuleId(mod.id);
                          setSelectedLessonId(lesson.id);
                          setActiveTab('curriculum');
                        }}
                        className={`group px-2.5 py-2 rounded-lg cursor-pointer transition flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40 shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle className={`w-3.5 h-3.5 flex-shrink-0 ${
                              isSelected ? 'text-amber-400' : 'text-slate-600 group-hover:text-slate-400'
                            }`} />
                          )}
                          <span className="truncate font-medium leading-tight">
                            {lesson.title}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                            lesson.difficulty === 'Beginner'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                              : lesson.difficulty === 'Intermediate'
                              ? 'bg-sky-950 text-sky-400 border border-sky-800/50'
                              : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                          }`}>
                            {lesson.difficulty.slice(0, 3)}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(lesson.id);
                            }}
                            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Lesson'}
                            className="text-slate-500 hover:text-amber-400 p-0.5 transition"
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

