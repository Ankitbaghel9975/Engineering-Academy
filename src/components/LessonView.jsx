import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { getLessonById, allModules } from '../data/modules';
import { ArchitectureViewer } from './ArchitectureViewer';
import { InteractiveTerminal } from './InteractiveTerminal';
import { 
  BookOpen, HelpCircle, CheckCircle2, AlertTriangle, 
  Terminal, Award, Copy, Check, ChevronLeft, ChevronRight, 
  Lightbulb, ShieldCheck, Flame, Compass, Sparkles, Lock, 
  Unlock, Globe, Code2, Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LessonView = () => {
  const { 
    selectedLessonId, 
    setSelectedLessonId, 
    selectedModuleId, 
    setSelectedModuleId,
    languageMode, 
    setLanguageMode,
    progress, 
    markLessonComplete,
    toggleBookmark 
  } = useAcademy();

  const lessonData = getLessonById(selectedLessonId);
  const lesson = lessonData?.lesson;
  const currentModule = lessonData?.module;

  // Assessment Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Command Challenge State
  const [commandInput, setCommandInput] = useState('');
  const [commandPassed, setCommandPassed] = useState(false);

  // Copy state for practical code snippets
  const [codeCopied, setCodeCopied] = useState(false);

  // Expanded interview questions state
  const [revealedAnswers, setRevealedAnswers] = useState({});

  useEffect(() => {
    // Reset assessment state when lesson changes
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setCommandInput('');
    setCommandPassed(false);
    setRevealedAnswers({});
  }, [selectedLessonId]);

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-slate-400">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-slate-300">Select a lesson from the curriculum sidebar</h3>
        </div>
      </div>
    );
  }

  const isCompleted = !!progress.completedLessons?.[lesson.id];
  const isBookmarked = progress.bookmarkedLessons?.includes(lesson.id);

  // Find next and previous lesson
  let prevLesson = null;
  let nextLesson = null;
  const currentModLessons = currentModule?.lessons || [];
  const currentIdx = currentModLessons.findIndex(l => l.id === lesson.id);

  if (currentIdx > 0) {
    prevLesson = currentModLessons[currentIdx - 1];
  }
  if (currentIdx < currentModLessons.length - 1) {
    nextLesson = currentModLessons[currentIdx + 1];
  }

  // Handle Assessment Quiz Submission
  const handleQuizSubmit = () => {
    if (!lesson.assessment?.quiz) return;
    let score = 0;
    lesson.assessment.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        score += 1;
      }
    });
    const percentage = Math.round((score / lesson.assessment.quiz.length) * 100);
    setQuizScore(percentage);
    setQuizSubmitted(true);

    if (percentage >= 50 && (!lesson.assessment.commandChallenge || commandPassed)) {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
      markLessonComplete(lesson.id, percentage);
    }
  };

  // Handle Command Challenge Check
  const handleVerifyCommand = () => {
    const expected = lesson.assessment?.commandChallenge?.expectedCommand?.toLowerCase().trim();
    const actual = commandInput.toLowerCase().trim();

    if (actual && (actual === expected || actual.includes(expected.split(' ')[0]))) {
      setCommandPassed(true);
      if (quizSubmitted && quizScore >= 50) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        markLessonComplete(lesson.id, quizScore);
      }
    } else {
      alert(`Command verification check: Make sure you execute "${expected}" in the command input!`);
    }
  };

  const copyCode = (codeStr) => {
    navigator.clipboard.writeText(codeStr);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-8 max-w-5xl mx-auto scrollbar-thin scrollbar-thumb-slate-800">
      
      {/* Lesson Header & Metadata */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-amber-400 uppercase tracking-wider">{currentModule?.badge}</span>
            <span>•</span>
            <span>{currentModule?.title}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleBookmark(lesson.id)}
              className={`px-2.5 py-1 rounded text-xs transition flex items-center space-x-1 ${
                isBookmarked 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
              {lesson.duration}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {lesson.title}
            </h1>
            <div className="flex items-center space-x-3 mt-2 text-xs">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                lesson.difficulty === 'Beginner'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : lesson.difficulty === 'Intermediate'
                  ? 'bg-sky-950 text-sky-400 border border-sky-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {lesson.difficulty} Level
              </span>

              {isCompleted ? (
                <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed & Passed</span>
                </span>
              ) : (
                <span className="text-amber-400/90 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pass Assignment & Quiz to Complete</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 1. CONCEPT (English, Hinglish & Dual Mode View) */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              1. Concept (Zero to Industry Foundation)
            </h2>
          </div>

          {/* Inline Language Mode Toggle */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800 text-[10px]">
            <button
              onClick={() => setLanguageMode('en')}
              className={`px-2 py-0.5 rounded font-semibold ${languageMode === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguageMode('hi')}
              className={`px-2 py-0.5 rounded font-semibold ${languageMode === 'hi' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
            >
              Hinglish
            </button>
            <button
              onClick={() => setLanguageMode('dual')}
              className={`px-2 py-0.5 rounded font-semibold ${languageMode === 'dual' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
            >
              Dual Mode
            </button>
          </div>
        </div>

        {/* Dynamic Concept Text based on Language Mode */}
        {languageMode === 'dual' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Standard English</span>
              <p>{lesson.concept.en}</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-lg border border-amber-500/20 text-xs text-amber-100/90 leading-relaxed space-y-1">
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider block">Hinglish Explanation</span>
              <p>{lesson.concept.hi}</p>
            </div>
          </div>
        ) : languageMode === 'hi' ? (
          <div className="bg-slate-950/60 p-4 rounded-lg border border-amber-500/20 text-xs text-amber-100/90 leading-relaxed">
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider block mb-1">Hinglish Explanation</span>
            <p>{lesson.concept.hi}</p>
          </div>
        ) : (
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Standard English</span>
            <p>{lesson.concept.en}</p>
          </div>
        )}
      </section>

      {/* 2. WHY & 3. HOW (Side by side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 2. WHY */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2.5">
          <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              2. Why Companies Use This Technology
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lesson.why}
          </p>
        </section>

        {/* 3. HOW */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2.5">
          <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              3. Internal Step-by-Step Mechanism
            </h2>
          </div>
          <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
            {lesson.how}
          </pre>
        </section>
      </div>

      {/* 4. ARCHITECTURE (Interactive Diagram) */}
      {lesson.architecture && (
        <section className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <span className="text-amber-400">4.</span>
            <span>Interactive Architecture Component</span>
          </div>
          <ArchitectureViewer architectureData={lesson.architecture} />
        </section>
      )}

      {/* 5. INDUSTRY REAL-WORLD EXAMPLE */}
      {lesson.industryExample && (
        <section className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl p-5 shadow-lg space-y-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Flame className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              5. Industry Project Example (Enterprise Implementation)
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-1">
            {lesson.industryExample}
          </p>
        </section>
      )}

      {/* 6. PRACTICAL LAB & 7. EXPECTED OUTPUT */}
      {lesson.practicalLab && (
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-4 p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  6. Practical Hands-On Implementation Lab
                </h2>
                <p className="text-[11px] text-slate-400">{lesson.practicalLab.title}</p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-400 font-mono">
              Real CLI & Code
            </span>
          </div>

          {/* Problem Statement & Setup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div>
              <span className="font-bold text-slate-300 block mb-1">Problem Statement:</span>
              <p className="text-slate-400 leading-relaxed">{lesson.practicalLab.problemStatement}</p>
            </div>
            <div>
              <span className="font-bold text-slate-300 block mb-1">Setup & Requirements:</span>
              <p className="text-slate-400 font-mono text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                {lesson.practicalLab.setup}
              </p>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          {lesson.practicalLab.instructions && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-300 block">Step-by-Step Instructions:</span>
              <ul className="space-y-1 text-xs text-slate-400 pl-4 list-disc">
                {lesson.practicalLab.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Implementation Code */}
          {lesson.practicalLab.code && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center space-x-1.5">
                  <Code2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Production Implementation Code:</span>
                </span>
                <button
                  onClick={() => copyCode(lesson.practicalLab.code)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[10px] flex items-center space-x-1 transition"
                >
                  {codeCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{codeCopied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-[11px] font-mono text-amber-200/90 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
                {lesson.practicalLab.code}
              </pre>
            </div>
          )}

          {/* 7. EXPECTED OUTPUT */}
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>7. Expected Output (What You Should See):</span>
            </span>
            <pre className="bg-slate-950 p-3.5 rounded-lg border border-emerald-900/40 text-[11px] font-mono text-emerald-400 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
              {lesson.expectedOutput}
            </pre>
          </div>

          {/* Embedded Interactive Terminal */}
          <div className="pt-3">
            <span className="text-xs font-bold text-slate-300 block mb-2">Live Terminal Emulator:</span>
            <InteractiveTerminal 
              initialCommand={lesson.practicalLab.commands?.[0] || 'hdfs dfs -ls /'}
              onCommandExecuted={(cmd) => {
                if (cmd.includes(lesson.assessment?.commandChallenge?.expectedCommand?.split(' ')[0])) {
                  setCommandPassed(true);
                }
              }}
            />
          </div>
        </section>
      )}

      {/* 8. TROUBLESHOOTING & 9. BEST PRACTICES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 8. TROUBLESHOOTING */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              8. Production Troubleshooting
            </h2>
          </div>

          <div className="space-y-3">
            {lesson.troubleshooting?.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-rose-950/50 space-y-1.5 text-xs">
                <span className="font-mono text-rose-400 text-[11px] font-bold block">{item.error}</span>
                <p className="text-slate-400 text-[11px]"><strong className="text-slate-300">Root Cause:</strong> {item.rootCause}</p>
                <p className="text-emerald-400/90 text-[11px]"><strong className="text-slate-300">Solution:</strong> {item.solution}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. BEST PRACTICES */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              9. Senior Industry Best Practices
            </h2>
          </div>

          <ul className="space-y-2 text-xs text-slate-300 pl-4 list-disc">
            {lesson.bestPractices?.map((bp, idx) => (
              <li key={idx} className="leading-relaxed">{bp}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* 10. INTERVIEW PREPARATION (Beginner, Intermediate, Advanced) */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            10. Interview Preparation (Beginner, Intermediate & Advanced)
          </h2>
        </div>

        <div className="space-y-2.5">
          {lesson.interviewPrep?.map((q, idx) => {
            const isRevealed = revealedAnswers[idx];

            return (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      q.level === 'Beginner' ? 'bg-emerald-950 text-emerald-400' :
                      q.level === 'Intermediate' ? 'bg-sky-950 text-sky-400' : 'bg-purple-950 text-purple-400'
                    }`}>
                      {q.level}
                    </span>
                    <h4 className="text-xs font-bold text-slate-200">{q.question}</h4>
                  </div>

                  <button
                    onClick={() => setRevealedAnswers(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20"
                  >
                    {isRevealed ? 'Hide Answer' : 'Reveal Model Answer'}
                  </button>
                </div>

                {isRevealed && (
                  <p className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded border border-slate-800/80 leading-relaxed animate-fadeIn">
                    {q.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. ASSIGNMENT */}
      {lesson.assignment && (
        <section className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-5 shadow-lg space-y-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              11. Practical Hands-On Assignment
            </h2>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed pl-1">{lesson.assignment.task}</p>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-slate-400 font-mono">
            <strong>Verification Criteria:</strong> {lesson.assignment.verificationCriteria}
          </div>
        </section>
      )}

      {/* 12. ASSESSMENT (Interactive Quiz & Command Challenge) */}
      <section className="bg-slate-900 border-2 border-amber-500/30 rounded-xl p-5 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                12. Interactive Lesson Assessment & Completion Gate
              </h2>
              <p className="text-[11px] text-slate-400">
                Rule: You cannot mark this lesson complete without passing the quiz and command challenge!
              </p>
            </div>
          </div>

          {quizSubmitted && (
            <div className={`px-3 py-1 rounded text-xs font-bold font-mono ${
              quizScore >= 50 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}>
              Score: {quizScore}% {quizScore >= 50 ? '(PASSED)' : '(RETRY NEEDED)'}
            </div>
          )}
        </div>

        {/* MCQs */}
        <div className="space-y-4">
          {lesson.assessment?.quiz?.map((quizItem, qIdx) => (
            <div key={qIdx} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2.5 text-xs">
              <div className="font-bold text-slate-200">
                Question {qIdx + 1}: {quizItem.q}
              </div>

              <div className="space-y-1.5">
                {quizItem.options.map((option, optIdx) => {
                  const isChecked = selectedAnswers[qIdx] === optIdx;
                  const isCorrect = quizSubmitted && optIdx === quizItem.correct;
                  const isWrong = quizSubmitted && isChecked && optIdx !== quizItem.correct;

                  return (
                    <label
                      key={optIdx}
                      className={`flex items-center space-x-2.5 p-2 rounded cursor-pointer border transition text-[11px] ${
                        isCorrect
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-semibold'
                          : isWrong
                          ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                          : isChecked
                          ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`quiz_q_${qIdx}`}
                        checked={isChecked}
                        onChange={() => {
                          setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                          setQuizSubmitted(false);
                        }}
                        className="text-amber-500 focus:ring-0"
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-snug">
                  <strong>Explanation:</strong> {quizItem.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Interactive Command Challenge */}
        {lesson.assessment?.commandChallenge && (
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Command Challenge:</span>
              </span>
              {commandPassed ? (
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Command Passed!</span>
                </span>
              ) : (
                <span className="text-amber-400 font-mono text-[10px]">Verification Required</span>
              )}
            </div>
            <p className="text-slate-400 text-[11px]">{lesson.assessment.commandChallenge.prompt}</p>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={lesson.assessment.commandChallenge.expectedCommand}
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 font-mono text-xs text-amber-200 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleVerifyCommand}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs transition"
              >
                Verify Command
              </button>
            </div>
          </div>
        )}

        {/* Submit Assessment Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleQuizSubmit}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-lg shadow-lg text-xs transition flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Submit Assessment & Verify Completion</span>
          </button>

          {isCompleted && (
            <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Lesson Mastered & Completed!</span>
            </div>
          )}
        </div>
      </section>

      {/* Navigation Footer (Previous & Next Lesson) */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800 text-xs">
        {prevLesson ? (
          <button
            onClick={() => setSelectedLessonId(prevLesson.id)}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev: {prevLesson.title}</span>
          </button>
        ) : (
          <div />
        )}

        {nextLesson && (
          <button
            onClick={() => setSelectedLessonId(nextLesson.id)}
            className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg border border-amber-500/40 transition flex items-center space-x-1"
          >
            <span>Next: {nextLesson.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

