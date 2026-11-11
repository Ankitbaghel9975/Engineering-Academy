import React, { createContext, useContext, useState, useEffect } from 'react';

const AcademyContext = createContext();

export const AcademyProvider = ({ children }) => {
  // Navigation: 'curriculum', 'lab', 'projects', 'simulation', 'interview', 'cheatsheet'
  const [activeTab, setActiveTab] = useState('curriculum');
  const [selectedModuleId, setSelectedModuleId] = useState('mod-1');
  const [selectedLessonId, setSelectedLessonId] = useState('m1-l1');
  
  // Language mode: 'en' (English), 'hi' (Hinglish), 'dual' (Side-by-side)
  const [languageMode, setLanguageMode] = useState('dual');
  
  // Projects & Simulation state
  const [selectedProjectId, setSelectedProjectId] = useState('proj-1');
  const [selectedTicketId, setSelectedTicketId] = useState('ticket-101');
  
  // User progress stored in localStorage
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('bigdata_academy_progress');
      return saved ? JSON.parse(saved) : {
        completedLessons: {}, // { [lessonId]: { completedAt, quizScore, assignmentDone } }
        completedProjects: {},
        resolvedTickets: {},
        bookmarkedLessons: [],
        userName: 'Big Data Cadet',
        terminalHistory: []
      };
    } catch (e) {
      return {
        completedLessons: {},
        completedProjects: {},
        resolvedTickets: {},
        bookmarkedLessons: [],
        userName: 'Big Data Cadet',
        terminalHistory: []
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bigdata_academy_progress', JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  const markLessonComplete = (lessonId, quizScore = 100) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: {
        ...prev.completedLessons,
        [lessonId]: {
          completedAt: new Date().toISOString(),
          quizScore,
          assignmentDone: true
        }
      }
    }));
  };

  const toggleBookmark = (lessonId) => {
    setProgress(prev => {
      const exists = prev.bookmarkedLessons.includes(lessonId);
      return {
        ...prev,
        bookmarkedLessons: exists
          ? prev.bookmarkedLessons.filter(id => id !== lessonId)
          : [...prev.bookmarkedLessons, lessonId]
      };
    });
  };

  const markProjectComplete = (projectId) => {
    setProgress(prev => ({
      ...prev,
      completedProjects: {
        ...prev.completedProjects,
        [projectId]: { completedAt: new Date().toISOString() }
      }
    }));
  };

  const markTicketResolved = (ticketId, score = 100) => {
    setProgress(prev => ({
      ...prev,
      resolvedTickets: {
        ...prev.resolvedTickets,
        [ticketId]: { resolvedAt: new Date().toISOString(), score }
      }
    }));
  };

  const updateUserName = (name) => {
    setProgress(prev => ({ ...prev, userName: name }));
  };

  return (
    <AcademyContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedModuleId,
      setSelectedModuleId,
      selectedLessonId,
      setSelectedLessonId,
      languageMode,
      setLanguageMode,
      selectedProjectId,
      setSelectedProjectId,
      selectedTicketId,
      setSelectedTicketId,
      progress,
      markLessonComplete,
      toggleBookmark,
      markProjectComplete,
      markTicketResolved,
      updateUserName
    }}>
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => useContext(AcademyContext);

