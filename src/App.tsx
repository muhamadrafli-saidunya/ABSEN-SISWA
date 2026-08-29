import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastContainer } from './components/common/ToastContainer';
import { QRScannerModal } from './components/common/QRScannerModal';
import { UserSwitcherModal } from './components/common/UserSwitcherModal';
import {
  Minimize2,
  Maximize2,
  ChevronsLeft,
  ChevronsRight,
  GripVertical,
  Sliders,
  Sparkles,
} from 'lucide-react';

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
  const {
    activeTab,
    darkMode,
    dashboardSize,
    setDashboardSize,
    toggleDashboardSize,
    dashboardWidthPercent,
    setDashboardWidthPercent,
  } = useApp();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync dark mode class on html root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle horizontal dragging to shrink/expand the dashboard
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const totalWidth = rect.width;
      
      // Calculate available width ratio for right viewport
      // Sidebar takes ~260px
      const availableMainWidth = Math.max(320, totalWidth - 280);
      const mouseOffsetInMain = relativeX - 280;
      const percent = Math.min(100, Math.max(45, Math.round((mouseOffsetInMain / availableMainWidth) * 100)));

      setDashboardWidthPercent(percent);
      if (percent >= 90) {
        setDashboardSize('full');
      } else if (percent >= 65) {
        setDashboardSize('compact');
      } else {
        setDashboardSize('narrow');
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setDashboardWidthPercent, setDashboardSize]);

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

  // Determine width container class or inline style
  const getViewportWidthStyle = () => {
    if (dashboardSize === 'narrow') {
      return { maxWidth: '780px' };
    }
    if (dashboardSize === 'compact') {
      return { maxWidth: '1020px' };
    }
    return { maxWidth: '100%' };
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

      {/* Main Content Area with Sidebar & Resizer */}
      <div
        ref={containerRef}
        className="flex-1 flex max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-7 py-5 gap-3 sm:gap-4 lg:gap-5 items-start relative select-none"
      >
        {/* Navigation Sidebar (Left, Fixed/Static) */}
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenUserSwitcher={() => setIsUserSwitcherOpen(true)}
        />

        {/* Vertical Resize / Pull Handle (Desktop) */}
        <div className="hidden lg:flex flex-col items-center justify-center self-stretch z-10 group px-0.5">
          <button
            id="drag-resize-toggle-button"
            onClick={toggleDashboardSize}
            title={
              dashboardSize === 'full'
                ? 'Tarik/Klik untuk Perkecil Dasbor Kanan (Mode Kompak)'
                : 'Klik untuk Perbesar Dasbor Kanan (Mode Penuh)'
            }
            className="p-1.5 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs hover:border-[#4a0404] hover:bg-rose-50 dark:hover:bg-rose-950/40 text-stone-500 hover:text-[#4a0404] dark:hover:text-rose-400 transition-all cursor-pointer active:scale-90"
          >
            {dashboardSize === 'full' ? (
              <ChevronsLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronsRight className="w-3.5 h-3.5" />
            )}
          </button>
          
          <div
            onMouseDown={() => setIsDragging(true)}
            title="Geser/Tarik untuk menyesuaikan lebar dasbor"
            className={`w-1.5 h-20 my-2 rounded-full cursor-col-resize transition-all ${
              isDragging
                ? 'bg-[#4a0404] w-2'
                : 'bg-stone-200 dark:bg-stone-700 group-hover:bg-[#4a0404]/60'
            }`}
          />
        </div>

        {/* Dynamic Viewport Container (Right Dashboard Area) */}
        <main
          id="main-app-viewport"
          style={getViewportWidthStyle()}
          className={`flex-1 min-w-0 transition-all duration-300 w-full ${
            dashboardSize !== 'full' ? 'mx-auto' : ''
          }`}
        >
          {/* Quick Toolbar Bar when Dashboard is Minimized / Compact */}
          {dashboardSize !== 'full' && (
            <div className="mb-3 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2 font-semibold">
                <Minimize2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  Mode Tampilan Dasbor Diperkecil (
                  {dashboardSize === 'compact' ? '75% - Kompak' : '55% - Ramping'})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setDashboardSize('compact')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    dashboardSize === 'compact'
                      ? 'bg-[#4a0404] text-white shadow-2xs'
                      : 'bg-white/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-white'
                  }`}
                >
                  75%
                </button>
                <button
                  onClick={() => setDashboardSize('narrow')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    dashboardSize === 'narrow'
                      ? 'bg-[#4a0404] text-white shadow-2xs'
                      : 'bg-white/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-white'
                  }`}
                >
                  55%
                </button>
                <button
                  onClick={() => setDashboardSize('full')}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-2xs transition-all flex items-center gap-1 active:scale-95"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Maksimalkan (100%)</span>
                </button>
              </div>
            </div>
          )}

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

