import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Printer,
  Layers,
  School,
  Sparkles,
  Download,
  CheckCircle,
  Search,
} from 'lucide-react';

export const StudentCardGeneratorView: React.FC = () => {
  const { students, classes, schoolProfile, selectedClassId, setSelectedClassId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchClass = selectedClassId === 'all' || s.classId === selectedClassId;
      const matchStudent = selectedStudentId === 'all' || s.id === selectedStudentId;
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery);
      return matchClass && matchStudent && matchSearch && s.status === 'aktif';
    });
  }, [students, selectedClassId, selectedStudentId, searchQuery]);

  const handlePrintCards = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Filter & Toolbar */}
      <div className="no-print p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#4a0404] dark:text-rose-400" />
              Kartu Pelajar & Barcode Presensi Digital
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Desain kartu identitas siswa sekolah dasar dengan QR code presensi siap cetak
            </p>
          </div>

          <button
            id="print-student-cards-btn"
            onClick={handlePrintCards}
            className="px-4 py-2 bg-[#4a0404] hover:bg-[#380303] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kartu Pelajar (Print / PDF)</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
          {/* Class Filter */}
          <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
            <Layers className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-bold text-stone-500">Kelas:</span>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedStudentId('all');
              }}
              className="bg-transparent font-extrabold text-stone-800 dark:text-stone-200 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Semua Kelas</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau NISN..."
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
            />
          </div>

          <div className="text-xs text-stone-500 font-semibold ml-auto">
            Menampilkan <strong>{filteredStudents.length}</strong> kartu siswa
          </div>
        </div>
      </div>

      {/* Cards Grid Container (Styled for both on-screen view and standard A4 Print) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 print:grid-cols-2 print:gap-4">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="w-full max-w-sm mx-auto bg-white text-stone-900 rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between relative print:shadow-none print:border-stone-800"
            style={{ minHeight: '230px' }}
          >
            {/* Header with Maroon Branding */}
            <div className="bg-[#4a0404] text-white px-4 py-2.5 flex items-center justify-between border-b border-[#380303]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-amber-200 font-bold text-xs">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[11px] uppercase tracking-wider leading-none">
                    KARTU PELAJAR
                  </h4>
                  <p className="text-[9px] text-stone-200 font-medium truncate max-w-[170px] mt-0.5">
                    {schoolProfile.name}
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold bg-amber-400 text-stone-950 px-1.5 py-0.5 rounded-sm">
                SD
              </span>
            </div>

            {/* Body */}
            <div className="p-3.5 flex items-center gap-3">
              {/* Photo */}
              <div className="w-20 h-24 rounded-xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center text-3xl shadow-inner shrink-0">
                <span>{student.gender === 'L' ? '👦' : '👧'}</span>
                <span className="text-[8px] font-bold text-stone-400 uppercase mt-1">
                  Foto 3x4
                </span>
              </div>

              {/* Information */}
              <div className="flex-1 min-w-0 space-y-1 text-[11px]">
                <div>
                  <span className="text-[9px] text-stone-400 block font-semibold">
                    Nama Siswa:
                  </span>
                  <p className="font-bold text-stone-900 leading-tight text-xs truncate">
                    {student.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <span className="text-[9px] text-stone-400 block font-semibold">
                      NISN:
                    </span>
                    <p className="font-mono font-bold text-stone-800">{student.nisn}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-400 block font-semibold">
                      Kelas:
                    </span>
                    <p className="font-bold text-[#4a0404]">{student.className}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-stone-400 block font-semibold">
                    TTL / Lahir:
                  </span>
                  <p className="font-medium text-stone-700">{student.birthDate}</p>
                </div>
              </div>

              {/* Scannable QR Code preview */}
              <div className="w-16 h-16 bg-stone-950 rounded-xl p-1.5 flex flex-col items-center justify-center text-white shrink-0 border border-stone-800">
                <QrCode className="w-10 h-10 text-white" />
                <span className="text-[7px] font-mono text-amber-300 font-bold mt-0.5">
                  SCAN
                </span>
              </div>
            </div>

            {/* Bottom Barcode Strip & Footer */}
            <div className="bg-stone-50 px-3 py-1.5 border-t border-stone-200 flex items-center justify-between text-[9px] text-stone-500">
              <span className="font-mono font-bold tracking-widest text-[8px] text-stone-700">
                |||| ||| ||||| |||| || |||||
              </span>
              <span className="font-semibold">
                Berlaku s/d: TA {schoolProfile.academicYear}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
