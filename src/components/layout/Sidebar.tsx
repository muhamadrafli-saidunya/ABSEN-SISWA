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
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 md:w-72 bg-white dark:bg-stone-900 border-r border-stone-200/80 dark:border-stone-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#4a0404] flex items-center justify-center text-white shadow-xs shrink-0">
            <School className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-extrabold tracking-tight text-stone-900 dark:text-white uppercase">
              Absensi Siswa SD
            </h1>
            <p className="text-xs font-semibold text-[#4a0404] dark:text-rose-400 truncate">
              {schoolProfile.name}
            </p>
          </div>
        </div>

        {/* Academic Year Info Pill */}
        <div className="px-5 py-2.5 bg-stone-50 dark:bg-stone-800/40 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-[#4a0404] dark:text-rose-400" />
            <span>TA {schoolProfile.academicYear} ({schoolProfile.semester})</span>
          </div>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            NPSN {schoolProfile.npsn}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group ${
                  isActive
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs font-bold border border-orange-600'
                    : 'bg-orange-50/80 dark:bg-orange-950/30 text-orange-950 dark:text-orange-200 border border-orange-200/70 dark:border-orange-900/50 hover:bg-orange-100 dark:hover:bg-orange-900/50 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`transition-colors shrink-0 ${
                      isActive
                        ? 'text-white'
                        : 'text-orange-600 dark:text-orange-400 group-hover:text-orange-700'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

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
              </button>
            );
          })}
        </nav>

        {/* Bottom Current User Card & Switcher Trigger */}
        <div className="p-3 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          <button
            id="sidebar-user-switcher-trigger"
            onClick={onOpenUserSwitcher}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 hover:border-[#4a0404]/40 dark:hover:border-rose-700 flex items-center gap-3 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-[#4a0404] dark:text-rose-300 font-bold text-xs flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/40">
              {currentUser.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')}
            </div>
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
          </button>
        </div>
      </aside>
    </>
  );
};
