import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassRoom } from '../../types';
import { Modal } from '../common/Modal';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Users,
  Building,
  UserCheck,
  TrendingUp,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const ClassMasterView: React.FC = () => {
  const {
    classes,
    students,
    attendanceRecords,
    addClass,
    updateClass,
    deleteClass,
    setActiveTab,
    setSelectedClassId,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassRoom | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    grade: 1,
    teacherName: '',
    teacherNip: '',
    roomNumber: '',
    academicYear: '2025/2026',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      grade: 1,
      teacherName: '',
      teacherNip: '',
      roomNumber: '',
      academicYear: '2025/2026',
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cls: ClassRoom) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      grade: cls.grade,
      teacherName: cls.teacherName,
      teacherNip: cls.teacherNip,
      roomNumber: cls.roomNumber,
      academicYear: cls.academicYear,
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.teacherName.trim()) return;

    addClass(formData);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !formData.name.trim()) return;

    updateClass(editingClass.id, formData);
    setEditingClass(null);
    resetForm();
  };

  const handleConfirmDelete = () => {
    if (!deletingClass) return;
    deleteClass(deletingClass.id);
    setDeletingClass(null);
  };

  // Helper to calculate statistics for a class
  const getClassStats = (classId: string) => {
    const classStudents = students.filter(
      (s) => s.classId === classId && s.status === 'aktif'
    );
    const records = attendanceRecords.filter((r) => r.classId === classId);
    const hadirCount = records.filter((r) => r.status === 'H' || r.status === 'T').length;
    const rate =
      records.length > 0 ? Math.round((hadirCount / records.length) * 100) : 95;

    return {
      studentCount: classStudents.length,
      attendanceRate: rate,
    };
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#4a0404] dark:text-rose-400" />
            Data Rombongan Belajar (Kelas) & Wali Kelas
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Manajemen kelas tingkat 1 sampai 6 beserta penugasan guru wali kelas
          </p>
        </div>

        <button
          id="add-class-button"
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-[#4a0404] hover:bg-[#380303] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {classes.map((cls) => {
          const stats = getClassStats(cls.id);
          return (
            <div
              key={cls.id}
              className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-[#4a0404]/30 dark:hover:border-rose-900/60 transition-all hover:shadow-xs"
            >
              {/* Card Top */}
              <div className="p-4 space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center font-black text-xs border border-stone-200/80 dark:border-stone-700">
                      {cls.name.replace('Kelas ', '')}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                        {cls.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                        <Building className="w-3 h-3" /> {cls.roomNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => handleOpenEdit(cls)}
                      className="p-1.5 text-stone-400 hover:text-amber-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Edit Kelas"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingClass(cls)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Hapus Kelas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Guru Wali Kelas:
                  </span>
                  <p className="font-bold text-xs text-stone-800 dark:text-white mt-0.5 truncate">
                    {cls.teacherName}
                  </p>
                  <p className="text-[10px] font-mono text-stone-400 mt-0.5">
                    NIP: {cls.teacherNip || '-'}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 text-center border border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] font-semibold text-stone-400 block">
                      Jumlah Siswa
                    </span>
                    <span className="text-xs font-bold text-stone-800 dark:text-white">
                      {stats.studentCount} Siswa
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 text-center border border-emerald-200/50 dark:border-emerald-800/50">
                    <span className="text-[10px] font-semibold text-emerald-600 block">
                      Rata-rata Hadir
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      {stats.attendanceRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-3 bg-stone-50/60 dark:bg-stone-800/30 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => {
                    setSelectedClassId(cls.id);
                    setActiveTab('presensi-harian');
                  }}
                  className="w-full py-1.5 bg-white dark:bg-stone-800 hover:bg-[#4a0404] hover:text-white dark:hover:bg-[#4a0404] dark:hover:text-white text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Buka Presensi Kelas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Class Modal */}
      {(isAddModalOpen || editingClass) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingClass(null);
          }}
          title={isAddModalOpen ? 'Tambah Rombel Kelas' : 'Edit Data Kelas'}
          subtitle="Formulir rombongan belajar dan wali kelas"
          maxWidth="md"
        >
          <form
            onSubmit={isAddModalOpen ? handleSubmitAdd : handleSubmitEdit}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Nama Kelas: *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Kelas 2B"
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#4a0404] text-stone-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Tingkat (1 - 6):
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: Number(e.target.value) })
                  }
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#4a0404] text-stone-900 dark:text-white"
                >
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <option key={g} value={g}>
                      Tingkat {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Nomor Ruangan:
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                  placeholder="Contoh: R. 104"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:ring-1 focus:ring-[#4a0404] text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Nama Guru Wali Kelas: *
              </label>
              <input
                type="text"
                required
                value={formData.teacherName}
                onChange={(e) =>
                  setFormData({ ...formData, teacherName: e.target.value })
                }
                placeholder="Contoh: Ibu Siti Aminah, S.Pd."
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-[#4a0404] text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                NIP Wali Kelas:
              </label>
              <input
                type="text"
                value={formData.teacherNip}
                onChange={(e) =>
                  setFormData({ ...formData, teacherNip: e.target.value })
                }
                placeholder="19850412 201001 2 015"
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono focus:ring-1 focus:ring-[#4a0404] text-stone-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingClass(null);
                }}
                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#4a0404] hover:bg-[#380303] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                {isAddModalOpen ? 'Simpan Kelas' : 'Perbarui Kelas'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Class Confirmation Modal */}
      {deletingClass && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingClass(null)}
          title="Konfirmasi Hapus Kelas"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus{' '}
              <strong className="text-stone-900 dark:text-white">
                {deletingClass.name}
              </strong>
              ? Pastikan siswa telah dimutasi ke rombel lain sebelum menghapus.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingClass(null)}
                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
