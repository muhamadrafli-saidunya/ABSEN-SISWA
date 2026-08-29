import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  GraduationCap,
  FileSpreadsheet,
  MailCheck,
  QrCode,
  Settings,
  ChevronRight,
  BookOpen,
  School,
  ChevronsLeft,
  ChevronsRight,
  PanelLeftClose,
  PanelLeftOpen,
  FileUp,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenUserSwitcher: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onCloseMobile,
  onOpenUserSwitcher,
}) => {
  const {
    activeTab,
    setActiveTab,
    schoolProfile,
    currentUser,
    leaveRequests,
    students,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
    sidebarWidth,
  } = useApp();

  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'Pending').length;
  const totalActiveStudents = students.filter((s) => s.status === 'aktif').length;

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Utama',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'presensi-harian',
      label: 'Presensi Harian',
      icon: <ClipboardCheck className="w-5 h-5" />,
    },
    {
      id: 'data-siswa',
      label: 'Data Siswa',
      icon: <Users className="w-5 h-5" />,
      badge: totalActiveStudents,
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    },
    {
      id: 'data-kelas',
      label: 'Data Kelas & Wali',
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: 'import-data',
      label: 'Import Excel',
      icon: <FileUp className="w-5 h-5" />,
      badge: 'Excel',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold',
    },
    {
      id: 'rekap-laporan',
      label: 'Rekap & Laporan',
      icon: <FileSpreadsheet className="w-5 h-5" />,
    },
    {
      id: 'pengajuan-izin',
      label: 'Surat Izin / Sakit',
      icon: <MailCheck className="w-5 h-5" />,
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
      badgeColor: 'bg-amber-500 text-white font-bold animate-pulse',
    },
    {
      id: 'kartu-pelajar',
      label: 'Kartu QR Siswa',
      icon: <QrCode className="w-5 h-5" />,
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan Sekolah',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  // Dynamic width styling for desktop
  const desktopWidth = isSidebarCollapsed ? 76 : sidebarWidth || 260;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        style={{
          width: undefined, // Handled responsive via inline/classes
        }}
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#f0f7fc] dark:bg-[#0c182c] border-r border-sky-200/80 dark:border-sky-900/70 flex flex-col transition-all duration-300 ease-in-out lg:static lg:z-auto lg:h-[calc(100vh-6rem)] lg:rounded-2xl lg:shadow-xs lg:border lg:border-sky-200/80 dark:lg:border-sky-900/70 shrink-0 ${
          isOpen ? 'translate-x-0 w-64 md:w-72' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'lg:w-[76px]' : 'lg:w-[260px]'}`}
      >
        {/* Brand Header */}
        <div
          className={`border-b border-sky-200/70 dark:border-sky-900/60 flex items-center transition-all ${
            isSidebarCollapsed
              ? 'p-3 flex-col gap-2 justify-center text-center'
              : 'p-4 justify-between gap-3'
          }`}
        >
          <div className={`flex items-center gap-3 min-w-0 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <School className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <h1 className="text-xs font-extrabold tracking-tight text-slate-900 dark:text-white uppercase truncate">
                  Absensi Siswa SD
                </h1>
                <p className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 truncate">
                  {schoolProfile.name}
                </p>
              </div>
            )}
          </div>

          {/* Desktop Minimize / Collapse Button */}
          <button
            id="sidebar-collapse-toggle-button"
            onClick={toggleSidebarCollapsed}
            className="hidden lg:flex p-1.5 rounded-lg text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-white hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors shrink-0 active:scale-95"
            title={isSidebarCollapsed ? 'Perluas Menu Kiri' : 'Perkecil Menu Kiri'}
          >
            {isSidebarCollapsed ? (
              <ChevronsRight className="w-4 h-4" />
            ) : (
              <ChevronsLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Academic Year Info Pill (Only shown when expanded) */}
        {!isSidebarCollapsed ? (
          <div className="px-4 py-2 bg-sky-100/70 dark:bg-sky-950/60 border-b border-sky-200/60 dark:border-sky-900/60 flex items-center justify-between text-xs transition-all">
            <div className="flex items-center gap-1.5 text-sky-900 dark:text-sky-200 font-medium truncate">
              <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="truncate">TA {schoolProfile.academicYear}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-600/15 text-sky-800 dark:text-sky-300 border border-sky-400/30 shrink-0">
              {schoolProfile.semester}
            </span>
          </div>
        ) : (
          <div className="py-1 text-center border-b border-sky-200/60 dark:border-sky-900/60 text-[10px] font-bold text-sky-700 dark:text-sky-400">
            TA {schoolProfile.academicYear.split('/')[0]}
          </div>
        )}

        {/* Navigation Links */}
        <nav
          className={`flex-1 space-y-1.5 overflow-y-auto ${
            isSidebarCollapsed ? 'px-2 py-3' : 'px-3 py-4'
          }`}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-xl text-xs transition-all group relative ${
                  isSidebarCollapsed
                    ? 'justify-center p-2.5'
                    : 'justify-between px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs font-bold border border-sky-700'
                    : 'bg-white/80 dark:bg-sky-950/40 text-sky-950 dark:text-sky-200 border border-sky-200/70 dark:border-sky-900/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 font-semibold'
                }`}
              >
                <div
                  className={`flex items-center gap-3 min-w-0 ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  }`}
                >
                  <span
                    className={`transition-colors shrink-0 ${
                      isActive
                        ? 'text-white'
                        : 'text-sky-600 dark:text-sky-400 group-hover:text-sky-700'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {/* Badge for Expanded Mode */}
                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          isActive
                            ? 'bg-white text-sky-700'
                            : 'bg-sky-200 dark:bg-sky-900 text-sky-900 dark:text-sky-100'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                  </div>
                )}

                {/* Badge Indicator Dot for Collapsed Mode */}
                {isSidebarCollapsed && item.badge !== undefined && (
                  <span
                    className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ${
                      item.id === 'pengajuan-izin'
                        ? 'bg-amber-400 ring-2 ring-white dark:ring-slate-900 animate-pulse'
                        : 'bg-sky-600 ring-2 ring-white dark:ring-slate-900'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Toggle Button at Navigation Footer (Desktop) */}
        <div className="hidden lg:block px-3 py-1.5">
          <button
            onClick={toggleSidebarCollapsed}
            className={`w-full py-1.5 rounded-xl border border-sky-200 dark:border-sky-800 text-[11px] font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 hover:text-sky-900 dark:hover:text-white transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              isSidebarCollapsed ? 'px-1' : 'px-2.5'
            }`}
            title={isSidebarCollapsed ? 'Perluas Menu Kiri' : 'Perkecil Menu Kiri'}
          >
            {isSidebarCollapsed ? (
              <ChevronsRight className="w-3.5 h-3.5 text-sky-600" />
            ) : (
              <>
                <ChevronsLeft className="w-3.5 h-3.5 text-sky-600" />
                <span>Perkecil Menu Kiri</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Current User Card & Switcher Trigger */}
        <div
          className={`border-t border-sky-200/70 dark:border-sky-900/60 bg-sky-100/50 dark:bg-sky-950/50 ${
            isSidebarCollapsed ? 'p-2' : 'p-3'
          }`}
        >
          <button
            id="sidebar-user-switcher-trigger"
            onClick={onOpenUserSwitcher}
            title={isSidebarCollapsed ? `${currentUser.name} (${currentUser.roleTitle}) - Ganti Pengguna` : undefined}
            className={`w-full rounded-xl bg-white dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 hover:border-sky-500 dark:hover:border-sky-600 flex items-center text-left transition-all group ${
              isSidebarCollapsed ? 'p-1.5 justify-center' : 'p-2.5 gap-3'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-200 dark:border-sky-800">
              {currentUser.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')}
            </div>
            {!isSidebarCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-sky-700 dark:group-hover:text-sky-300">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-sky-700/80 dark:text-sky-300/80 truncate">
                    {currentUser.roleTitle}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                  Ganti
                </span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
