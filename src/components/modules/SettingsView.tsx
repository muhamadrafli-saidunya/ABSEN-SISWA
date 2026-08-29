import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  School,
  Clock,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Shield,
  BookOpen,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const SettingsView: React.FC = () => {
  const { schoolProfile, updateSchoolProfile, resetDataToDefault } = useApp();

  const [formData, setFormData] = useState({ ...schoolProfile });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(formData);
  };

  const handleConfirmReset = () => {
    resetDataToDefault();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 max-w-5xl">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#4a0404] dark:text-rose-400" />
          Pengaturan Sekolah & Sistem Presensi
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Konfigurasi identitas sekolah dasar, jam kerja presensi, serta pemeliharaan data
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* School Profile Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
            <School className="w-4 h-4 text-[#4a0404] dark:text-rose-400" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">
              Identitas Sekolah Dasar (KOP Resmi)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Nama Sekolah: *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-white focus:ring-1 focus:ring-[#4a0404]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                NPSN (Nomor Pokok Sekolah Nasional):
              </label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono font-bold text-stone-900 dark:text-white focus:ring-1 focus:ring-[#4a0404]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                No. Telepon / Hotline:
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:ring-1 focus:ring-[#4a0404]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Alamat Lengkap Sekolah:
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white focus:ring-1 focus:ring-[#4a0404]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Nama Kepala Sekolah: *
              </label>
              <input
                type="text"
                required
                value={formData.principalName}
                onChange={(e) =>
                  setFormData({ ...formData, principalName: e.target.value })
                }
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-white focus:ring-1 focus:ring-[#4a0404]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                NIP Kepala Sekolah:
              </label>
              <input
                type="text"
                value={formData.principalNip}
                onChange={(e) =>
                  setFormData({ ...formData, principalNip: e.target.value })
                }
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono text-stone-900 dark:text-white focus:ring-1 focus:ring-[#4a0404]"
              />
            </div>
          </div>
        </div>

        {/* Academic Schedule & Late Tolerance */}
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
            <Clock className="w-4 h-4 text-stone-500" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">
              Waktu Belajar & Toleransi Jam Masuk
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Tahun Ajaran:
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) =>
                  setFormData({ ...formData, academicYear: e.target.value })
                }
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-white focus:ring-1 focus:ring-[#4a0404]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Semester:
              </label>
              <select
                value={formData.semester}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    semester: e.target.value as 'Ganjil' | 'Genap',
                  })
                }
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-white focus:ring-1 focus:ring-[#4a0404]"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Jam Masuk Sekolah:
              </label>
              <input
                type="time"
                value={formData.schoolStartTime}
                onChange={(e) =>
                  setFormData({ ...formData, schoolStartTime: e.target.value })
                }
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono font-bold text-stone-900 dark:text-white focus:ring-1 focus:ring-[#4a0404]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Batas Toleransi (Terlambat):
              </label>
              <input
                type="time"
                value={formData.lateThresholdTime}
                onChange={(e) =>
                  setFormData({ ...formData, lateThresholdTime: e.target.value })
                }
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono font-bold text-stone-900 dark:text-white focus:ring-1 focus:ring-[#4a0404]"
              />
            </div>
          </div>

          <p className="text-xs text-stone-400">
            Siswa yang melakukan scan QR / presensi setelah pukul{' '}
            <strong className="text-stone-700 dark:text-stone-200">{formData.lateThresholdTime}</strong> akan otomatis ditandai{' '}
            <strong className="text-purple-600">TERLAMBAT (T)</strong>.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 hover:bg-stone-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Data Demo Awal
          </button>

          <button
            type="submit"
            id="save-settings-button"
            className="px-5 py-2 bg-[#4a0404] hover:bg-[#380303] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan Pengaturan
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsResetConfirmOpen(false)}
          title="Konfirmasi Reset Data"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Apakah Anda yakin ingin mengembalikan seluruh database ke data bawaan
              awal demo? Seluruh perubahan input presensi baru akan digantikan dengan
              data contoh.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
