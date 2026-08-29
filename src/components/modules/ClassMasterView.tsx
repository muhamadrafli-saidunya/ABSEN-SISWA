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
  Download,
  FileUp,
  FileSpreadsheet,
} from 'lucide-react';
import { downloadClassTemplate, exportClassesToExcel } from '../../utils/excelHelpers';

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white/90 dark:bg-slate-900 border border-sky-200/80 dark:border-sky-900/60 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Data Rombongan Belajar (Kelas) & Wali Kelas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen kelas tingkat 1 sampai 6 beserta penugasan guru wali kelas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            id="download-class-template-btn"
            onClick={downloadClassTemplate}
            className="flex-1 sm:flex-none px-3 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            title="Unduh format template Excel rombel kelas"
          >
            <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Template Excel</span>
          </button>

          <button
            id="open-import-excel-classes-btn"
            onClick={() => setActiveTab('import-data')}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            title="Buka menu import data"
          >
            <FileUp className="w-4 h-4 text-emerald-100" />
            <span>Import Excel</span>
          </button>

          <button
            id="export-classes-excel-btn"
            onClick={() => exportClassesToExcel(classes, students)}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            title="Download Master Data Rombel Kelas format .xlsx"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Excel</span>
          </button>

          <button
            id="add-class-button"
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kelas</span>
          </button>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {classes.map((cls) => {
          const stats = getClassStats(cls.id);
          return (
            <div
              key={cls.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-sky-200/80 dark:border-sky-900/60 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-sky-400 dark:hover:border-sky-600 transition-all hover:shadow-xs"
            >
              {/* Card Top */}
              <div className="p-4 space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-slate-800 text-sky-800 dark:text-sky-300 flex items-center justify-center font-black text-xs border border-sky-200/80 dark:border-slate-700">
                      {cls.name.replace('Kelas ', '')}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {cls.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Building className="w-3 h-3" /> {cls.roomNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => handleOpenEdit(cls)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Kelas"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingClass(cls)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Hapus Kelas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="p-3 bg-sky-50/50 dark:bg-slate-800/50 rounded-xl border border-sky-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                    Guru Wali Kelas:
                  </span>
                  <p className="font-bold text-xs text-slate-800 dark:text-white mt-0.5 truncate">
                    {cls.teacherName}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                    NIP: {cls.teacherNip || '-'}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-sky-50/40 dark:bg-slate-800/40 text-center border border-sky-100 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 block">
                      Jumlah Siswa
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
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
              <div className="p-3 bg-sky-50/60 dark:bg-slate-800/30 border-t border-sky-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setSelectedClassId(cls.id);
                    setActiveTab('presensi-harian');
                  }}
                  className="w-full py-1.5 bg-white dark:bg-slate-800 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 dark:hover:text-white text-slate-700 dark:text-slate-300 border border-sky-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
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
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Kelas: *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Kelas 2B"
                className="w-full p-2.5 bg-sky-50/50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tingkat (1 - 6):
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: Number(e.target.value) })
                  }
                  className="w-full p-2.5 bg-sky-50/50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-white"
                >
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <option key={g} value={g}>
                      Tingkat {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Ruangan:
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                  placeholder="Contoh: R. 104"
                  className="w-full p-2.5 bg-sky-50/50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 rounded-xl text-xs focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
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
                className="w-full p-2.5 bg-sky-50/50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                NIP Wali Kelas:
              </label>
              <input
                type="text"
                value={formData.teacherNip}
                onChange={(e) =>
                  setFormData({ ...formData, teacherNip: e.target.value })
                }
                placeholder="19850412 201001 2 015"
                className="w-full p-2.5 bg-sky-50/50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-sky-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingClass(null);
                }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
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
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus{' '}
              <strong className="text-slate-900 dark:text-white">
                {deletingClass.name}
              </strong>
              ? Pastikan siswa telah dimutasi ke rombel lain sebelum menghapus.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingClass(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
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
