import React, { useState } from 'react';
import { useAcademy } from './context/AcademyContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LessonView } from './components/LessonView';
import { LabStudio } from './components/LabStudio';
import { ProjectsHub } from './components/ProjectsHub';
import { SimulationMode } from './components/SimulationMode';
import { InterviewHub } from './components/InterviewHub';
import { CheatSheetModal } from './components/CheatSheetModal';
import { CertificateModal } from './components/CertificateModal';

export const App = () => {
  const { activeTab } = useAcademy();
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [certificateOpen, setCertificateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Universal Top Navigation Bar */}
      <Navbar
        onOpenCheatSheet={() => setCheatSheetOpen(true)}
        onOpenCertificate={() => setCertificateOpen(true)}
      />

      {/* Main Workspace Area Switcher */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'curriculum' && (
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <LessonView />
          </div>
        )}

        {activeTab === 'lab' && <LabStudio />}
        {activeTab === 'projects' && <ProjectsHub />}
        {activeTab === 'simulation' && <SimulationMode />}
        {activeTab === 'interview' && <InterviewHub />}
      </main>

      {/* Pop-up Modals */}
      <CheatSheetModal
        isOpen={cheatSheetOpen}
        onClose={() => setCheatSheetOpen(false)}
      />

      <CertificateModal
        isOpen={certificateOpen}
        onClose={() => setCertificateOpen(false)}
      />

    </div>
  );
};

export default App;

