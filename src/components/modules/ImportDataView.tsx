import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  UploadCloud,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Users,
  GraduationCap,
  ClipboardCheck,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  Search,
  Check,
  FileText,
  FileDown,
} from 'lucide-react';
import {
  downloadStudentTemplate,
  downloadClassTemplate,
  downloadAttendanceTemplate,
  parseExcelFile,
  exportStudentsToExcel,
  exportClassesToExcel,
} from '../../utils/excelHelpers';

type ImportCategory = 'siswa' | 'kelas' | 'presensi';

interface ParsedStudentRow {
  nisn: string;
  nis: string;
  name: string;
  gender: 'L' | 'P';
  className: string;
  birthDate?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  status?: 'aktif' | 'mutasi' | 'lulus';
  isValid: boolean;
  errors: string[];
  isExisting: boolean;
}

export const ImportDataView: React.FC = () => {
  const {
    students,
    classes,
    batchImportStudents,
    batchImportClasses,
    setActiveTab,
    addToast,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<ImportCategory>('siswa');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [overwriteExisting, setOverwriteExisting] = useState(true);
  const [autoCreateClasses, setAutoCreateClasses] = useState(true);
  const [filterPreviewStatus, setFilterPreviewStatus] = useState<'all' | 'valid' | 'invalid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [importResult, setImportResult] = useState<{
    success: boolean;
    added: number;
    updated: number;
    total: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Existing NISN map for duplication checking
  const existingNisnMap = new Set(students.map((s) => s.nisn.trim()));

  // Handle file selection
  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setIsParsing(true);
    setImportResult(null);

    try {
      const parsed = await parseExcelFile(file);
      if (!parsed.data || parsed.data.length === 0) {
        addToast({
          type: 'warning',
          title: 'File Kosong',
          message: 'Tidak ada baris data yang terdeteksi di dalam file Excel.',
        });
        setParsedRows([]);
        setIsParsing(false);
        return;
      }

      // Process student rows
      if (activeCategory === 'siswa') {
        const validatedRows: ParsedStudentRow[] = parsed.data.map((row: any, idx: number) => {
          // Normalize column keys (case insensitive / trimmed)
          const getVal = (...keys: string[]) => {
            for (const key of keys) {
              const matchedKey = Object.keys(row).find((k) =>
                k.toLowerCase().replace(/[\*\_\-\s]/g, '').includes(key.toLowerCase().replace(/[\*\_\-\s]/g, ''))
              );
              if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== '') {
                return String(row[matchedKey]).trim();
              }
            }
            return '';
          };

          const nisn = getVal('nisn', 'nomorinduknasional', 'no_nisn') || '';
          const nis = getVal('nis', 'nomorinduk', 'no_nis') || `250${idx + 1}`;
          const name = getVal('nama', 'namalengkap', 'namasiswa', 'student_name') || '';
          const rawGender = getVal('jeniskelamin', 'gender', 'jk', 'kelamin') || 'L';
          const gender: 'L' | 'P' = rawGender.toUpperCase().startsWith('P') || rawGender.toUpperCase().startsWith('W') ? 'P' : 'L';
          const className = getVal('kelas', 'rombel', 'class', 'namakelas') || 'Kelas 1A';
          const birthDate = getVal('tanggallahir', 'tgllahir', 'birthdate', 'tgl_lahir') || '2018-01-01';
          const parentName = getVal('namaorangtua', 'orangtua', 'wali', 'ayah', 'ibu', 'parent') || '-';
          const parentPhone = getVal('nohp', 'nomorhp', 'whatsapp', 'wa', 'telepon', 'phone') || '-';
          const address = getVal('alamat', 'domisili', 'address') || '-';
          const rawStatus = getVal('status', 'statussiswa') || 'aktif';
          const status: 'aktif' | 'mutasi' | 'lulus' =
            rawStatus.toLowerCase().includes('mutasi')
              ? 'mutasi'
              : rawStatus.toLowerCase().includes('lulus')
              ? 'lulus'
              : 'aktif';

          const errors: string[] = [];
          if (!nisn) errors.push('NISN wajib diisi');
          if (!name) errors.push('Nama Lengkap wajib diisi');
          if (!className) errors.push('Kelas wajib diisi');

          const isExisting = existingNisnMap.has(nisn);

          return {
            nisn,
            nis,
            name,
            gender,
            className,
            birthDate,
            parentName,
            parentPhone,
            address,
            status,
            isValid: errors.length === 0,
            errors,
            isExisting,
          };
        });

        setParsedRows(validatedRows);
        addToast({
          type: 'info',
          title: 'File Berhasil Dibaca',
          message: `Terdeteksi ${validatedRows.length} baris data siswa siap divalidasi.`,
        });
      } else {
        // Raw preview for class
        addToast({
          type: 'info',
          title: 'File Terbaca',
          message: `Terdeteksi ${parsed.data.length} baris data.`,
        });
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Gagal Membaca File',
        message: err.message || 'Format file Excel tidak sesuai atau rusak.',
      });
      setParsedRows([]);
    } finally {
      setIsParsing(false);
    }
  };

  // Load sample demo data
  const handleLoadSampleDemo = () => {
    const demoList: ParsedStudentRow[] = [
      {
        nisn: '0165849291',
        nis: '250109',
        name: 'Rafi Aditya Pratama',
        gender: 'L',
        className: 'Kelas 1A',
        birthDate: '2018-03-14',
        parentName: 'Hendra Pratama',
        parentPhone: '081234567801',
        address: 'Jl. Melati No. 44, RT 02/05',
        status: 'aktif',
        isValid: true,
        errors: [],
        isExisting: existingNisnMap.has('0165849291'),
      },
      {
        nisn: '0165849292',
        nis: '250110',
        name: 'Zahra Aulia Putri',
        gender: 'P',
        className: 'Kelas 1A',
        birthDate: '2018-05-22',
        parentName: 'Ahmad Faisal',
        parentPhone: '081398765402',
        address: 'Jl. Mawar No. 12, Gandaria',
        status: 'aktif',
        isValid: true,
        errors: [],
        isExisting: existingNisnMap.has('0165849292'),
      },
      {
        nisn: '0165849293',
        nis: '250111',
        name: 'Dimas Bagus Anggoro',
        gender: 'L',
        className: 'Kelas 1B',
        birthDate: '2018-07-09',
        parentName: 'Bagus S.',
        parentPhone: '081567890103',
        address: 'Jl. Kenanga Indah No. 8',
        status: 'aktif',
        isValid: true,
        errors: [],
        isExisting: existingNisnMap.has('0165849293'),
      },
      {
        nisn: '0165849294',
        nis: '250112',
        name: 'Nayla Salsabila',
        gender: 'P',
        className: 'Kelas 2A',
        birthDate: '2017-09-18',
        parentName: 'Rudi Hartono',
        parentPhone: '081298765404',
        address: 'Jl. Cempaka Putih No. 3',
        status: 'aktif',
        isValid: true,
        errors: [],
        isExisting: existingNisnMap.has('0165849294'),
      },
      {
        nisn: '0165849295',
        nis: '250113',
        name: 'Fatih Al-Ghifari',
        gender: 'L',
        className: 'Kelas 3A',
        birthDate: '2016-11-04',
        parentName: 'Imam Syafii',
        parentPhone: '081876543205',
        address: 'Jl. Teratai No. 19',
        status: 'aktif',
        isValid: true,
        errors: [],
        isExisting: existingNisnMap.has('0165849295'),
      },
    ];

    setParsedRows(demoList);
    setSelectedFile(new File([''], 'Data_Siswa_Contoh_Demo.xlsx'));
    setImportResult(null);
    addToast({
      type: 'info',
      title: 'Data Contoh Dimuat',
      message: '5 data siswa contoh telah dimuat dan siap diimpor ke sistem.',
    });
  };

  // Submit and commit imported students
  const handleExecuteImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      addToast({
        type: 'error',
        title: 'Tidak Ada Data Valid',
        message: 'Silakan periksa kembali data Anda. Tidak ada baris yang valid untuk diimpor.',
      });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Auto-create non-existent classes if option enabled
      if (autoCreateClasses) {
        const uniqueClasses: string[] = Array.from(new Set<string>(validRows.map((r) => r.className.trim())));
        const existingClassNames = new Set(classes.map((c) => c.name.toLowerCase().trim()));

        const newClassesToCreate = uniqueClasses.filter(
          (clsName: string) => !existingClassNames.has(clsName.toLowerCase())
        );

        if (newClassesToCreate.length > 0) {
          batchImportClasses(
            newClassesToCreate.map((cls: string) => {
              // Guess grade from name (e.g. 'Kelas 1A' -> 1)
              const match = cls.match(/\d+/);
              const grade = match ? Number(match[0]) : 1;
              return {
                name: cls,
                grade: Math.min(6, Math.max(1, grade)),
                teacherName: 'Wali Kelas Belum Ditugaskan',
                academicYear: '2025/2026',
              };
            })
          );
        }
      }

      // Execute batch import
      const result = batchImportStudents(
        validRows.map((r) => ({
          nisn: r.nisn,
          nis: r.nis,
          name: r.name,
          gender: r.gender,
          className: r.className,
          birthDate: r.birthDate,
          parentName: r.parentName,
          parentPhone: r.parentPhone,
          address: r.address,
          status: r.status,
        })),
        { overwriteExisting }
      );

      setImportResult({
        success: true,
        added: result.addedCount,
        updated: result.updatedCount,
        total: validRows.length,
      });

      setIsProcessing(false);
    }, 600);
  };

  // Filtered rows for preview
  const filteredRows = parsedRows.filter((row) => {
    const matchStatus =
      filterPreviewStatus === 'all'
        ? true
        : filterPreviewStatus === 'valid'
        ? row.isValid
        : !row.isValid;

    const matchSearch =
      searchQuery === '' ||
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.nisn.includes(searchQuery) ||
      row.className.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid).length;
  const existingCount = parsedRows.filter((r) => r.isExisting).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Hero */}
      <div className="rounded-3xl bg-linear-to-br from-[#4a0404] via-[#5c0b0b] to-stone-900 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background ambient ornaments */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-rose-200 text-xs font-bold uppercase tracking-wider mb-3">
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
              <span>Import & Sinkronisasi Excel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Import Data Siswa & Kelas Sekolah
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Unggah file Excel (format <code className="text-amber-300 bg-white/10 px-1.5 py-0.5 rounded font-mono">.xlsx</code> / <code className="text-amber-300 bg-white/10 px-1.5 py-0.5 rounded font-mono">.csv</code>) untuk memasukkan data siswa, data rombel kelas, atau rekap presensi massal secara cepat, akurat, dan otomatis divalidasi.
            </p>
          </div>

          {/* Quick Template Download Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="import-download-template-student-btn"
              onClick={downloadStudentTemplate}
              className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-950" />
              <span>Unduh Template Siswa (.xlsx)</span>
            </button>
            <button
              id="import-export-current-students-btn"
              onClick={() => exportStudentsToExcel(students, classes)}
              className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-amber-300" />
              <span>Export Data Saat Ini</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          id="tab-import-siswa"
          onClick={() => {
            setActiveCategory('siswa');
            setParsedRows([]);
            setSelectedFile(null);
            setImportResult(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeCategory === 'siswa'
              ? 'bg-[#4a0404] text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Import Data Siswa (Utama)</span>
        </button>

        <button
          id="tab-import-kelas"
          onClick={() => {
            setActiveCategory('kelas');
            setParsedRows([]);
            setSelectedFile(null);
            setImportResult(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeCategory === 'kelas'
              ? 'bg-[#4a0404] text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>2. Import Data Rombel Kelas</span>
        </button>

        <button
          id="tab-import-presensi"
          onClick={() => {
            setActiveCategory('presensi');
            setParsedRows([]);
            setSelectedFile(null);
            setImportResult(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeCategory === 'presensi'
              ? 'bg-[#4a0404] text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>3. Import Log Presensi</span>
        </button>
      </div>

      {/* Main Grid: Upload & Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Upload Dropzone & Setup (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#4a0404] dark:text-rose-400" />
                <span>Upload File Excel ({activeCategory === 'siswa' ? 'Data Siswa' : activeCategory === 'kelas' ? 'Data Kelas' : 'Presensi'})</span>
              </h2>
              <button
                onClick={handleLoadSampleDemo}
                className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Gunakan Data Contoh Demo</span>
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls, .csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
            />

            {/* Dropzone Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileChange(file);
              }}
              className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-[#4a0404] dark:hover:border-rose-500 rounded-2xl p-8 text-center cursor-pointer transition-all bg-stone-50/50 dark:bg-stone-800/30 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 group"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-[#4a0404] dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-1">
                {selectedFile ? selectedFile.name : 'Klik atau seret file Excel ke sini'}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Mendukung format <span className="font-semibold text-stone-700 dark:text-stone-300">.xlsx, .xls, atau .csv</span> (Maksimal 10 MB)
              </p>

              {selectedFile && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>File Siap: {(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}
            </div>

            {/* Import Options & Preferences */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={overwriteExisting}
                  onChange={(e) => setOverwriteExisting(e.target.checked)}
                  className="rounded text-[#4a0404] focus:ring-[#4a0404] w-4 h-4"
                />
                <span>
                  <strong>Perbarui otomatis</strong> data siswa jika NISN sudah terdaftar di sistem
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={autoCreateClasses}
                  onChange={(e) => setAutoCreateClasses(e.target.checked)}
                  className="rounded text-[#4a0404] focus:ring-[#4a0404] w-4 h-4"
                />
                <span>
                  <strong>Buat kelas baru secara otomatis</strong> jika nama kelas di file Excel belum ada di sistem
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Step-by-Step Guide & Template Selector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Panduan 3 Langkah Mudah</span>
            </h3>

            <div className="space-y-3.5 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-[#4a0404] dark:text-rose-400 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <p className="font-bold text-stone-800 dark:text-stone-200">Unduh Format Template</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Gunakan template resmi agar susunan kolom sesuai dengan sistem absensi sekolah.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-[#4a0404] dark:text-rose-400 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <p className="font-bold text-stone-800 dark:text-stone-200">Isi Data Siswa / Kelas</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Pastikan kolom wajib seperti <code className="text-rose-600 dark:text-rose-400 font-bold">NISN</code>, <code className="text-rose-600 dark:text-rose-400 font-bold">Nama Lengkap</code>, dan <code className="text-rose-600 dark:text-rose-400 font-bold">Kelas</code> tidak kosong.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-[#4a0404] dark:text-rose-400 font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <p className="font-bold text-stone-800 dark:text-stone-200">Upload & Validasi</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Sistem akan memvalidasi data dan memberi Anda pratinjau sebelum disimpan ke database.
                  </p>
                </div>
              </div>
            </div>

            {/* Template Download Box */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-950 dark:text-amber-200">
                  Pilih Template untuk Diunduh:
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                  Excel (.xlsx)
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={downloadStudentTemplate}
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#4a0404] dark:text-rose-400" />
                    <span>Template Data Siswa Lengkap</span>
                  </span>
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                </button>

                <button
                  onClick={downloadClassTemplate}
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#4a0404] dark:text-rose-400" />
                    <span>Template Data Rombel Kelas</span>
                  </span>
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                </button>

                <button
                  onClick={downloadAttendanceTemplate}
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <ClipboardCheck className="w-3.5 h-3.5 text-[#4a0404] dark:text-rose-400" />
                    <span>Template Log Presensi Harian</span>
                  </span>
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Banner when Import is Completed */}
      {importResult && (
        <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-md animate-in zoom-in-95 duration-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-emerald-950 dark:text-emerald-100">
                  Import Data Berhasil Diproses!
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Sebanyak <strong>{importResult.added} siswa baru</strong> berhasil ditambahkan dan <strong>{importResult.updated} siswa</strong> berhasil diperbarui di sistem.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab('data-siswa')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Lihat Data Siswa</span>
              </button>
              <button
                onClick={() => setActiveTab('presensi-harian')}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-bold text-xs hover:bg-emerald-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Mulai Presensi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview & Validation Table Section */}
      {parsedRows.length > 0 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
          {/* Table Header & Metrics */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span>Pratinjau & Hasil Validasi ({parsedRows.length} Baris)</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Tinjau kembali data hasil pembacaan sebelum disimpan secara permanen.
              </p>
            </div>

            {/* Metric Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                Total: {parsedRows.length}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Valid: {validCount}
              </span>
              {invalidCount > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
                  Error: {invalidCount}
                </span>
              )}
              {existingCount > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Data Terdaftar: {existingCount}
                </span>
              )}
            </div>
          </div>

          {/* Table Filters & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, NISN, atau kelas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#4a0404]"
                />
              </div>

              <select
                value={filterPreviewStatus}
                onChange={(e) => setFilterPreviewStatus(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-xs font-medium text-stone-700 dark:text-stone-300"
              >
                <option value="all">Semua Status</option>
                <option value="valid">Hanya Valid ({validCount})</option>
                <option value="invalid">Hanya Error ({invalidCount})</option>
              </select>
            </div>

            {/* Execute Import Action Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setParsedRows([]);
                  setSelectedFile(null);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
              >
                Batal / Bersihkan
              </button>
              <button
                id="execute-import-commit-button"
                disabled={isProcessing || validCount === 0}
                onClick={handleExecuteImport}
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menyimpan ke Database...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Simpan {validCount} Data ke Sistem</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200/80 dark:border-stone-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-bold uppercase border-b border-stone-200 dark:border-stone-700">
                <tr>
                  <th className="px-3 py-3 w-12 text-center">No</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">NISN</th>
                  <th className="px-3 py-3">NIS</th>
                  <th className="px-3 py-3">Nama Siswa</th>
                  <th className="px-3 py-3">L/P</th>
                  <th className="px-3 py-3">Kelas</th>
                  <th className="px-3 py-3">Tanggal Lahir</th>
                  <th className="px-3 py-3">Orang Tua / Wali</th>
                  <th className="px-3 py-3">No WhatsApp</th>
                  <th className="px-3 py-3">Alamat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-stone-500 dark:text-stone-400">
                      Tidak ada baris data yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors ${
                        !row.isValid ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="px-3 py-2.5 text-center text-stone-400">{idx + 1}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {row.isValid ? (
                          row.isExisting ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                              <RefreshCw className="w-3 h-3" />
                              <span>Update</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Baru</span>
                            </span>
                          )
                        ) : (
                          <span
                            title={row.errors.join(', ')}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 cursor-help"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>{row.errors[0] || 'Error'}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-bold text-stone-900 dark:text-stone-100">
                        {row.nisn || <span className="text-rose-500 italic">Kosong</span>}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-stone-600 dark:text-stone-400">
                        {row.nis}
                      </td>
                      <td className="px-3 py-2.5 font-bold text-stone-900 dark:text-stone-100">
                        {row.name || <span className="text-rose-500 italic">Kosong</span>}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                            row.gender === 'L'
                              ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'
                              : 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {row.gender}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-stone-800 dark:text-stone-200">
                        {row.className}
                      </td>
                      <td className="px-3 py-2.5 text-stone-600 dark:text-stone-400">
                        {row.birthDate}
                      </td>
                      <td className="px-3 py-2.5 text-stone-600 dark:text-stone-400">
                        {row.parentName}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-stone-600 dark:text-stone-400">
                        {row.parentPhone}
                      </td>
                      <td className="px-3 py-2.5 text-stone-600 dark:text-stone-400 truncate max-w-[150px]">
                        {row.address}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
