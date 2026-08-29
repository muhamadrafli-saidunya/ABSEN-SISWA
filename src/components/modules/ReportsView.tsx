import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import {
  FileSpreadsheet,
  Printer,
  Calendar,
  Layers,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  School,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    students,
    classes,
    attendanceRecords,
    schoolProfile,
    selectedClassId,
    setSelectedClassId,
  } = useApp();

  // Period mode: 'weekly' (last 7 days) | 'monthly' (current month dates)
  const [periodMode, setPeriodMode] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedMonth, setSelectedMonth] = useState('2026-08');

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Generate date list based on selected period
  const reportDates = useMemo(() => {
    if (periodMode === 'weekly') {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });
    } else {
      // Monthly 1st to 15th/current date
      const [year, month] = selectedMonth.split('-').map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      return Array.from({ length: Math.min(daysInMonth, 15) }, (_, i) => {
        const dayStr = (i + 1).toString().padStart(2, '0');
        return `${year}-${month.toString().padStart(2, '0')}-${dayStr}`;
      });
    }
  }, [periodMode, selectedMonth]);

  // Students in selected class
  const classStudents = useMemo(() => {
    return students.filter(
      (s) =>
        (selectedClassId === 'all' || s.classId === selectedClassId) &&
        s.status === 'aktif'
    );
  }, [students, selectedClassId]);

  // Compute student matrix records
  const studentMatrix = useMemo(() => {
    return classStudents.map((student) => {
      let hCount = 0;
      let sCount = 0;
      let iCount = 0;
      let aCount = 0;
      let tCount = 0;

      const dateStatuses = reportDates.map((dateStr) => {
        const rec = attendanceRecords.find(
          (r) => r.studentId === student.id && r.date === dateStr
        );
        const status = rec ? rec.status : 'H'; // Default assumed H for past filled

        if (status === 'H') hCount++;
        else if (status === 'T') {
          tCount++;
          hCount++;
        } else if (status === 'S') sCount++;
        else if (status === 'I') iCount++;
        else if (status === 'A') aCount++;

        return {
          date: dateStr,
          status,
          notes: rec?.notes || '',
        };
      });

      const totalDays = reportDates.length;
      const rate = totalDays > 0 ? Math.round((hCount / totalDays) * 100) : 100;

      return {
        student,
        dateStatuses,
        hCount,
        sCount,
        iCount,
        aCount,
        tCount,
        rate,
      };
    });
  }, [classStudents, reportDates, attendanceRecords]);

  // Overall Class summary metrics
  const classOverallStats = useMemo(() => {
    let totalH = 0;
    let totalS = 0;
    let totalI = 0;
    let totalA = 0;

    studentMatrix.forEach((m) => {
      totalH += m.hCount;
      totalS += m.sCount;
      totalI += m.iCount;
      totalA += m.aCount;
    });

    const totalSlots = studentMatrix.length * reportDates.length;
    const avgRate = totalSlots > 0 ? Math.round((totalH / totalSlots) * 100) : 0;

    return { totalH, totalS, totalI, totalA, avgRate };
  }, [studentMatrix, reportDates]);

  // Trigger browser print dialog for formal school attendance sheet
  const handlePrint = () => {
    window.print();
  };

  // Export CSV
  const handleExportReportCSV = () => {
    const headers = [
      'No',
      'NISN',
      'Nama Siswa',
      'Kelas',
      ...reportDates.map((d) => d.slice(5)), // MM-DD
      'Total H',
      'Total S',
      'Total I',
      'Total A',
      '% Kehadiran',
    ];

    const rows = studentMatrix.map((m, idx) => [
      idx + 1,
      `'${m.student.nisn}`,
      `"${m.student.name}"`,
      `"${m.student.className}"`,
      ...m.dateStatuses.map((ds) => ds.status),
      m.hCount,
      m.sCount,
      m.iCount,
      m.aCount,
      `${m.rate}%`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Presensi_${activeClass?.name || 'Sekolah'}_${reportDates[0]}_sd_${reportDates[reportDates.length - 1]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Filter and Actions */}
      <div className="no-print p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#4a0404] dark:text-rose-400" />
              Rekapitulasi & Laporan Presensi Siswa
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Rekap kehadiran multi-hari dan format cetak resmi dengan kop surat sekolah
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              id="export-report-csv-button"
              onClick={handleExportReportCSV}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-stone-200 dark:border-stone-700"
            >
              <Download className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <span>Ekspor CSV</span>
            </button>

            <button
              id="print-report-button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#4a0404] hover:bg-[#380303] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan Resmi (PDF)</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
          <div className="flex flex-wrap items-center gap-3">
            {/* Class Selector */}
            <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
              <Layers className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-bold text-stone-500">Kelas:</span>
              <select
                id="report-filter-class"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
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

            {/* Period Mode Selector */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
              <button
                onClick={() => setPeriodMode('weekly')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  periodMode === 'weekly'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                7 Hari Terakhir
              </button>
              <button
                onClick={() => setPeriodMode('monthly')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  periodMode === 'monthly'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Bulanan
              </button>
            </div>

            {periodMode === 'monthly' && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-800 dark:text-white"
              />
            )}
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400 font-medium">Rata-rata Periode:</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-200 dark:border-emerald-800">
              {classOverallStats.avgRate}% Hadir
            </span>
          </div>
        </div>
      </div>

      {/* Printable School Attendance Document Container */}
      <div
        id="attendance-printable-report"
        className="print-container bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs p-6 md:p-8 space-y-6"
      >
        {/* Formal Elementary School KOP Surat Header (Formatted for official Indonesian SD) */}
        <div className="border-b-2 border-stone-900 dark:border-stone-200 pb-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#4a0404] text-white flex items-center justify-center text-xl font-bold">
              <School className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h3 className="text-base md:text-lg font-black tracking-wide text-stone-900 dark:text-white uppercase">
                PEMERINTAH KOTA ADMINISTRASI JAKARTA SELATAN
              </h3>
              <h4 className="text-sm md:text-base font-extrabold text-[#4a0404] dark:text-rose-400 uppercase">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </h4>
              <h2 className="text-lg md:text-xl font-black text-stone-900 dark:text-white">
                {schoolProfile.name}
              </h2>
            </div>
          </div>
          <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1">
            {schoolProfile.address} • Telp: {schoolProfile.phone} • Email: {schoolProfile.email}
          </p>
          <div className="pt-2 text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
            LAPORAN REKAPITULASI KEHADIRAN SISWA
          </div>
          <div className="text-xs text-stone-600 dark:text-stone-400">
            Kelas: <strong>{activeClass ? activeClass.name : 'Semua Kelas'}</strong> •
            Periode: <strong>{reportDates[0]} s/d {reportDates[reportDates.length - 1]}</strong> •
            Tahun Ajaran: <strong>{schoolProfile.academicYear} ({schoolProfile.semester})</strong>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-stone-300 dark:border-stone-700 text-xs">
            <thead>
              <tr className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold border-b border-stone-300 dark:border-stone-700 text-[11px]">
                <th className="py-2.5 px-2 border-r border-stone-300 dark:border-stone-700 text-center w-10">
                  No
                </th>
                <th className="py-2.5 px-3 border-r border-stone-300 dark:border-stone-700">
                  Nama Siswa
                </th>
                <th className="py-2.5 px-2 border-r border-stone-300 dark:border-stone-700 text-center w-12">
                  L/P
                </th>

                {/* Date Columns */}
                {reportDates.map((dateStr) => {
                  const d = new Date(dateStr);
                  const dayNum = d.getDate();
                  const dayName = new Intl.DateTimeFormat('id-ID', {
                    weekday: 'short',
                  }).format(d);
                  return (
                    <th
                      key={dateStr}
                      className="py-2 px-1.5 border-r border-stone-300 dark:border-stone-700 text-center min-w-[32px]"
                      title={dateStr}
                    >
                      <div className="text-[9px] text-stone-500">{dayName}</div>
                      <div>{dayNum}</div>
                    </th>
                  );
                })}

                {/* Totals */}
                <th className="py-2.5 px-1.5 border-r border-stone-300 dark:border-stone-700 text-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 w-10">
                  H
                </th>
                <th className="py-2.5 px-1.5 border-r border-stone-300 dark:border-stone-700 text-center bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 w-10">
                  S
                </th>
                <th className="py-2.5 px-1.5 border-r border-stone-300 dark:border-stone-700 text-center bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 w-10">
                  I
                </th>
                <th className="py-2.5 px-1.5 border-r border-stone-300 dark:border-stone-700 text-center bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 w-10">
                  A
                </th>
                <th className="py-2.5 px-2 text-center bg-stone-200 dark:bg-stone-700 font-extrabold w-14">
                  %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
              {studentMatrix.map((item, idx) => (
                <tr
                  key={item.student.id}
                  className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <td className="py-2 px-2 text-center border-r border-stone-200 dark:border-stone-700 font-bold text-stone-400">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3 border-r border-stone-200 dark:border-stone-700 font-semibold text-stone-800 dark:text-stone-200">
                    {item.student.name}
                  </td>
                  <td className="py-2 px-2 text-center border-r border-stone-200 dark:border-stone-700 font-mono text-stone-500">
                    {item.student.gender}
                  </td>

                  {/* Status cells per date */}
                  {item.dateStatuses.map((ds) => {
                    const colorMap: Record<string, string> = {
                      H: 'text-emerald-700 font-bold',
                      T: 'text-purple-700 font-bold',
                      S: 'text-amber-700 font-bold bg-amber-50 dark:bg-amber-950/30',
                      I: 'text-sky-700 font-bold bg-sky-50 dark:bg-sky-950/30',
                      A: 'text-rose-700 font-bold bg-rose-50 dark:bg-rose-950/30',
                    };
                    return (
                      <td
                        key={ds.date}
                        className={`py-2 px-1 text-center border-r border-stone-200 dark:border-stone-700 font-mono text-[11px] ${
                          colorMap[ds.status] || ''
                        }`}
                        title={`${ds.date}: ${ds.status} ${ds.notes ? `(${ds.notes})` : ''}`}
                      >
                        {ds.status}
                      </td>
                    );
                  })}

                  {/* Summary Totals */}
                  <td className="py-2 px-1 text-center border-r border-stone-200 dark:border-stone-700 font-bold text-emerald-700 dark:text-emerald-300">
                    {item.hCount}
                  </td>
                  <td className="py-2 px-1 text-center border-r border-stone-200 dark:border-stone-700 font-bold text-amber-700 dark:text-amber-300">
                    {item.sCount}
                  </td>
                  <td className="py-2 px-1 text-center border-r border-stone-200 dark:border-stone-700 font-bold text-sky-700 dark:text-sky-300">
                    {item.iCount}
                  </td>
                  <td className="py-2 px-1 text-center border-r border-stone-200 dark:border-stone-700 font-bold text-rose-700 dark:text-rose-300">
                    {item.aCount}
                  </td>
                  <td className="py-2 px-2 text-center font-extrabold text-stone-800 dark:text-stone-100 bg-stone-50 dark:bg-stone-800">
                    {item.rate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-2 text-stone-600 dark:text-stone-400">
          <span className="font-bold text-stone-800 dark:text-white">Keterangan:</span>
          <span><strong>H:</strong> Hadir Tepat Waktu</span>
          <span><strong>T:</strong> Terlambat</span>
          <span><strong>S:</strong> Sakit</span>
          <span><strong>I:</strong> Izin</span>
          <span><strong>A:</strong> Alpa / Tanpa Keterangan</span>
        </div>

        {/* Official Signature Area (Signatures of Principal & Homeroom Teacher) */}
        <div className="pt-8 grid grid-cols-2 text-center text-xs text-stone-800 dark:text-stone-200 gap-8">
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold">Kepala SD Negeri 01 Harapan Bangsa</p>
            <div className="h-16" />
            <p className="font-extrabold underline">{schoolProfile.principalName}</p>
            <p className="text-[11px] text-stone-500 font-mono">
              NIP. {schoolProfile.principalNip}
            </p>
          </div>

          <div>
            <p>Jakarta, {new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date())}</p>
            <p className="font-bold">Guru Wali Kelas</p>
            <div className="h-16" />
            <p className="font-extrabold underline">{activeClass ? activeClass.teacherName : 'Wali Kelas'}</p>
            <p className="text-[11px] text-stone-500 font-mono">
              NIP. {activeClass ? activeClass.teacherNip : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
