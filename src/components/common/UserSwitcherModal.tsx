import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { UserCheck, ShieldCheck, GraduationCap, Users } from 'lucide-react';

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSwitcherModal: React.FC<UserSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, availableUsers, loginAs } = useApp();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-5 h-5 text-amber-500" />;
      case 'guru':
        return <GraduationCap className="w-5 h-5 text-rose-800 dark:text-rose-400" />;
      case 'wali_murid':
        return <Users className="w-5 h-5 text-emerald-500" />;
      default:
        return <UserCheck className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ganti Peran / Akun Pengguna"
      subtitle="Pilih akun simulasi untuk menguji sistem absensi dengan berbagai hak akses"
      maxWidth="md"
    >
      <div className="space-y-3">
        {availableUsers.map((user) => {
          const isSelected = user.id === currentUser.id;
          return (
            <button
              key={user.id}
              onClick={() => {
                loginAs(user.id);
                onClose();
              }}
              className={`w-full flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-[#4a0404] dark:border-rose-600 bg-rose-50/50 dark:bg-rose-950/30 ring-1 ring-[#4a0404]'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-900'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                {getRoleIcon(user.role)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 dark:text-white truncate">
                    {user.name}
                  </span>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#4a0404] text-white">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#4a0404] dark:text-rose-400 font-medium mt-0.5">
                  {user.roleTitle}
                </p>
                <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5 truncate">
                  {user.email}
                </p>
              </div>
            </button>
          );
        })}

        <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2 border border-stone-200/50 dark:border-stone-700/50">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Setiap peran memiliki kontrol presensi dan filter data yang disesuaikan secara dinamis.</span>
        </div>
      </div>
    </Modal>
  );
};
