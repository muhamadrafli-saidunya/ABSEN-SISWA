import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastContainer } from './components/common/ToastContainer';
import { QRScannerModal } from './components/common/QRScannerModal';
import { UserSwitcherModal } from './components/common/UserSwitcherModal';

// Module Views
import { DashboardView } from './components/modules/DashboardView';
import { DailyAttendanceView } from './components/modules/DailyAttendanceView';
import { StudentsMasterView } from './components/modules/StudentsMasterView';
import { ClassMasterView } from './components/modules/ClassMasterView';
import { ReportsView } from './components/modules/ReportsView';
import { LeaveRequestsView } from './components/modules/LeaveRequestsView';
import { StudentCardGeneratorView } from './components/modules/StudentCardGeneratorView';
import { SettingsView } from './components/modules/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, darkMode } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);

  // Sync dark mode class on html root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Render view based on activeTab
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'presensi-harian':
        return <DailyAttendanceView onOpenQRScanner={() => setIsQRScannerOpen(true)} />;
      case 'data-siswa':
        return <StudentsMasterView />;
      case 'data-kelas':
        return <ClassMasterView />;
      case 'rekap-laporan':
        return <ReportsView />;
      case 'pengajuan-izin':
        return <LeaveRequestsView />;
      case 'kartu-pelajar':
        return <StudentCardGeneratorView />;
      case 'pengaturan':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0c0a09] text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Alert Notifications Layer */}
      <ToastContainer />

      {/* Primary Top Bar Header */}
      <Topbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenUserSwitcher={() => setIsUserSwitcherOpen(true)}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenUserSwitcher={() => setIsUserSwitcherOpen(true)}
        />

        {/* Dynamic Viewport Container */}
        <main
          id="main-app-viewport"
          className="flex-1 min-w-0 transition-all duration-300"
        >
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />

      <UserSwitcherModal
        isOpen={isUserSwitcherOpen}
        onClose={() => setIsUserSwitcherOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
