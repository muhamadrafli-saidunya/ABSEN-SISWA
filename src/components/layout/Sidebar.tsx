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
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-stone-900 border-r border-stone-200/80 dark:border-stone-800 flex flex-col transition-all duration-300 ease-in-out lg:static lg:z-auto lg:h-[calc(100vh-6rem)] lg:rounded-2xl lg:shadow-xs lg:border lg:border-stone-200/80 dark:lg:border-stone-800 shrink-0 ${
          isOpen ? 'translate-x-0 w-64 md:w-72' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'lg:w-[76px]' : 'lg:w-[260px]'}`}
      >
        {/* Brand Header */}
        <div
          className={`border-b border-stone-100 dark:border-stone-800 flex items-center transition-all ${
            isSidebarCollapsed
              ? 'p-3 flex-col gap-2 justify-center text-center'
              : 'p-4 justify-between gap-3'
          }`}
        >
          <div className={`flex items-center gap-3 min-w-0 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-[#4a0404] flex items-center justify-center text-white shadow-xs shrink-0">
              <School className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <h1 className="text-xs font-extrabold tracking-tight text-stone-900 dark:text-white uppercase truncate">
                  Absensi Siswa SD
                </h1>
                <p className="text-[11px] font-semibold text-[#4a0404] dark:text-rose-400 truncate">
                  {schoolProfile.name}
                </p>
              </div>
            )}
          </div>

          {/* Desktop Minimize / Collapse Button */}
          <button
            id="sidebar-collapse-toggle-button"
            onClick={toggleSidebarCollapsed}
            className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-[#4a0404] dark:hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shrink-0 active:scale-95"
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
          <div className="px-4 py-2 bg-stone-50 dark:bg-stone-800/40 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs transition-all">
            <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 font-medium truncate">
              <BookOpen className="w-3.5 h-3.5 text-[#4a0404] dark:text-rose-400 shrink-0" />
              <span className="truncate">TA {schoolProfile.academicYear}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shrink-0">
              {schoolProfile.semester}
            </span>
          </div>
        ) : (
          <div className="py-1 text-center border-b border-stone-100 dark:border-stone-800 text-[10px] font-bold text-stone-400 dark:text-stone-500">
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
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs font-bold border border-orange-600'
                    : 'bg-orange-50/80 dark:bg-orange-950/30 text-orange-950 dark:text-orange-200 border border-orange-200/70 dark:border-orange-900/50 hover:bg-orange-100 dark:hover:bg-orange-900/50 font-semibold'
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
                        : 'text-orange-600 dark:text-orange-400 group-hover:text-orange-700'
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
                            ? 'bg-white text-orange-600'
                            : 'bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-100'
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
                        ? 'bg-amber-400 ring-2 ring-white dark:ring-stone-900 animate-pulse'
                        : 'bg-orange-600 ring-2 ring-white dark:ring-stone-900'
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
            className={`w-full py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-[11px] font-bold text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/80 hover:text-[#4a0404] dark:hover:text-rose-400 transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              isSidebarCollapsed ? 'px-1' : 'px-2.5'
            }`}
            title={isSidebarCollapsed ? 'Perluas Menu Kiri' : 'Perkecil Menu Kiri'}
          >
            {isSidebarCollapsed ? (
              <ChevronsRight className="w-3.5 h-3.5 text-stone-500" />
            ) : (
              <>
                <ChevronsLeft className="w-3.5 h-3.5 text-stone-500" />
                <span>Perkecil Menu Kiri</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Current User Card & Switcher Trigger */}
        <div
          className={`border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 ${
            isSidebarCollapsed ? 'p-2' : 'p-3'
          }`}
        >
          <button
            id="sidebar-user-switcher-trigger"
            onClick={onOpenUserSwitcher}
            title={isSidebarCollapsed ? `${currentUser.name} (${currentUser.roleTitle}) - Ganti Pengguna` : undefined}
            className={`w-full rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 hover:border-[#4a0404]/40 dark:hover:border-rose-700 flex items-center text-left transition-all group ${
              isSidebarCollapsed ? 'p-1.5 justify-center' : 'p-2.5 gap-3'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-[#4a0404] dark:text-rose-300 font-bold text-xs flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/40">
              {currentUser.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')}
            </div>
            {!isSidebarCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-stone-800 dark:text-white truncate group-hover:text-[#4a0404] dark:group-hover:text-rose-300">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                    {currentUser.roleTitle}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-[#4a0404] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-200/60 dark:border-rose-900">
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
