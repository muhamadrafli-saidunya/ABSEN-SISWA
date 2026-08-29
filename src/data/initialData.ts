import { Student, ClassRoom, AttendanceRecord, LeaveRequest, SchoolProfile, UserSession } from '../types';

export const initialSchoolProfile: SchoolProfile = {
  name: 'SD NEGERI 01 HARAPAN BANGSA',
  npsn: '20108922',
  address: 'Jl. Merdeka No. 45, Kebayoran Baru, Jakarta Selatan, DKI Jakarta',
  phone: '(021) 7890-1234',
  email: 'info@sdn01harapanbangsa.sch.id',
  principalName: 'Dra. Hj. Siti Rahmawati, M.Pd.',
  principalNip: '19680512 199303 2 004',
  academicYear: '2025/2026',
  semester: 'Genap',
  schoolStartTime: '07:00',
  lateThresholdTime: '07:15',
};

export const initialClasses: ClassRoom[] = [
  { id: 'c1', name: 'Kelas 1A', grade: 1, teacherName: 'Ibu Ratna Dewi, S.Pd.', teacherNip: '19850412 201001 2 015', roomNumber: 'R. 101', academicYear: '2025/2026' },
  { id: 'c2', name: 'Kelas 1B', grade: 1, teacherName: 'Bapak Ahmad Fauzi, S.Pd.', teacherNip: '19870823 201201 1 009', roomNumber: 'R. 102', academicYear: '2025/2026' },
  { id: 'c3', name: 'Kelas 2A', grade: 2, teacherName: 'Ibu Sri Wahyuni, S.Pd.', teacherNip: '19820115 200801 2 011', roomNumber: 'R. 103', academicYear: '2025/2026' },
  { id: 'c4', name: 'Kelas 3A', grade: 3, teacherName: 'Bapak Joko Prasetyo, S.Pd.', teacherNip: '19890310 201402 1 003', roomNumber: 'R. 201', academicYear: '2025/2026' },
  { id: 'c5', name: 'Kelas 4A', grade: 4, teacherName: 'Ibu Nurul Hidayah, M.Pd.', teacherNip: '19841109 200902 2 018', roomNumber: 'R. 202', academicYear: '2025/2026' },
  { id: 'c6', name: 'Kelas 5A', grade: 5, teacherName: 'Bapak Hendra Gunawan, S.Pd.', teacherNip: '19860618 201101 1 007', roomNumber: 'R. 301', academicYear: '2025/2026' },
  { id: 'c7', name: 'Kelas 5B', grade: 5, teacherName: 'Ibu Dewi Sartika, S.Pd.', teacherNip: '19900214 201503 2 006', roomNumber: 'R. 302', academicYear: '2025/2026' },
  { id: 'c8', name: 'Kelas 6A', grade: 6, teacherName: 'Bapak Drs. Bambang Sutrisno', teacherNip: '19751020 199903 1 002', roomNumber: 'R. 303', academicYear: '2025/2026' },
];

export const initialStudents: Student[] = [
  // Kelas 1A
  {
    id: 's101',
    nisn: '0165849201',
    nis: '250101',
    name: 'Muhammad Rizky Pratama',
    gender: 'L',
    classId: 'c1',
    className: 'Kelas 1A',
    birthDate: '2018-04-12',
    parentName: 'Agus Pratama',
    parentPhone: '081298765432',
    address: 'Jl. Melati No. 12, Kebayoran Baru',
    status: 'aktif',
    createdAt: '2025-07-10',
  },
  {
    id: 's102',
    nisn: '0165849202',
    nis: '250102',
    name: 'Anisa Rahmawati',
    gender: 'P',
    classId: 'c1',
    className: 'Kelas 1A',
    birthDate: '2018-06-25',
    parentName: 'Bambang Irawan',
    parentPhone: '081387654321',
    address: 'Jl. Mawar No. 8, Gandaria',
    status: 'aktif',
    createdAt: '2025-07-10',
  },
  {
    id: 's103',
    nisn: '0165849203',
    nis: '250103',
    name: 'Dimas Arya Ramadhan',
    gender: 'L',
    classId: 'c1',
    className: 'Kelas 1A',
    birthDate: '2018-05-18',
    parentName: 'Surya Ramadhan',
    parentPhone: '081912345678',
    address: 'Jl. Cempaka Putih No. 14',
    status: 'aktif',
    createdAt: '2025-07-10',
  },
  {
    id: 's104',
    nisn: '0165849204',
    nis: '250104',
    name: 'Zahra Putri Kirana',
    gender: 'P',
    classId: 'c1',
    className: 'Kelas 1A',
    birthDate: '2018-09-02',
    parentName: 'Dedi Kurniawan',
    parentPhone: '085712348765',
    address: 'Jl. Anggrek No. 20, Blok M',
    status: 'aktif',
    createdAt: '2025-07-10',
  },
  {
    id: 's105',
    nisn: '0165849205',
    nis: '250105',
    name: 'Fadhil Ihsan Maulana',
    gender: 'L',
    classId: 'c1',
    className: 'Kelas 1A',
    birthDate: '2018-02-14',
    parentName: 'H. Maulana Malik',
    parentPhone: '081299887766',
    address: 'Jl. Bintaro Raya No. 5',
    status: 'aktif',
    createdAt: '2025-07-10',
  },
  {
    id: 's106',
    nisn: '0165849206',
    nis: '250106',
    name: 'Chelsea Kayla Aurelia',
    gender: 'P',
    classId: 'c1',
    className: 'Kelas 1A',
    birthDate: '2018-11-30',
    parentName: 'Rudy Hartono',
    parentPhone: '081344556677',
    address: 'Jl. Senopati No. 102',
    status: 'aktif',
    createdAt: '2025-07-10',
  },

  // Kelas 1B
  {
    id: 's201',
    nisn: '0165849301',
    nis: '250201',
    name: 'Aldo Bagus Wicaksono',
    gender: 'L',
    classId: 'c2',
    className: 'Kelas 1B',
    birthDate: '2018-03-08',
    parentName: 'Wicaksono Seno',
    parentPhone: '081233445566',
    address: 'Jl. Radio Dalam No. 45',
    status: 'aktif',
    createdAt: '2025-07-10',
  },
  {
    id: 's202',
    nisn: '0165849302',
    nis: '250202',
    name: 'Nayla Salsabila',
    gender: 'P',
    classId: 'c2',
    className: 'Kelas 1B',
    birthDate: '2018-08-19',
    parentName: 'Iskandar Zulkarnain',
    parentPhone: '085677889900',
    address: 'Jl. Fatmawati No. 88',
    status: 'aktif',
    createdAt: '2025-07-10',
  },
  {
    id: 's203',
    nisn: '0165849303',
    nis: '250203',
    name: 'Rafi Ahmad Fauzi',
    gender: 'L',
    classId: 'c2',
    className: 'Kelas 1B',
    birthDate: '2018-07-04',
    parentName: 'Fauzi Ridwan',
    parentPhone: '081822334455',
    address: 'Jl. Antasari No. 19',
    status: 'aktif',
    createdAt: '2025-07-10',
  },

  // Kelas 2A
  {
    id: 's301',
    nisn: '0154848201',
    nis: '240101',
    name: 'Bima Sakti Yudhistira',
    gender: 'L',
    classId: 'c3',
    className: 'Kelas 2A',
    birthDate: '2017-05-10',
    parentName: 'Yudhistira K',
    parentPhone: '081299001122',
    address: 'Jl. Kemang Raya No. 34',
    status: 'aktif',
    createdAt: '2024-07-12',
  },
  {
    id: 's302',
    nisn: '0154848202',
    nis: '240102',
    name: 'Citra Kirana Dewi',
    gender: 'P',
    classId: 'c3',
    className: 'Kelas 2A',
    birthDate: '2017-09-15',
    parentName: 'Dewi Sartika',
    parentPhone: '087811223344',
    address: 'Jl. Cipete Utara No. 22',
    status: 'aktif',
    createdAt: '2024-07-12',
  },
  {
    id: 's303',
    nisn: '0154848203',
    nis: '240103',
    name: 'Danuarta Wisnu Wardhana',
    gender: 'L',
    classId: 'c3',
    className: 'Kelas 2A',
    birthDate: '2017-01-20',
    parentName: 'Wardhana Tri',
    parentPhone: '085233441199',
    address: 'Jl. Bangka IX No. 11',
    status: 'aktif',
    createdAt: '2024-07-12',
  },

  // Kelas 3A
  {
    id: 's401',
    nisn: '0143847201',
    nis: '230101',
    name: 'Eka Pratama Saputra',
    gender: 'L',
    classId: 'c4',
    className: 'Kelas 3A',
    birthDate: '2016-08-11',
    parentName: 'Saputra Jaya',
    parentPhone: '081277665544',
    address: 'Jl. Panglima Polim No. 70',
    status: 'aktif',
    createdAt: '2023-07-10',
  },
  {
    id: 's402',
    nisn: '0143847202',
    nis: '230102',
    name: 'Farah Diba Azzahra',
    gender: 'P',
    classId: 'c4',
    className: 'Kelas 3A',
    birthDate: '2016-12-04',
    parentName: 'Azzahra Syarif',
    parentPhone: '081399881122',
    address: 'Jl. Gandaria Tengah No. 5',
    status: 'aktif',
    createdAt: '2023-07-10',
  },

  // Kelas 4A
  {
    id: 's501',
    nisn: '0132846201',
    nis: '220101',
    name: 'Gilang Ramadhan',
    gender: 'L',
    classId: 'c5',
    className: 'Kelas 4A',
    birthDate: '2015-06-17',
    parentName: 'Ramadhan Ali',
    parentPhone: '081900112233',
    address: 'Jl. Kyai Maja No. 3',
    status: 'aktif',
    createdAt: '2022-07-11',
  },
  {
    id: 's502',
    nisn: '0132846202',
    nis: '220102',
    name: 'Hana Alisyahbana',
    gender: 'P',
    classId: 'c5',
    className: 'Kelas 4A',
    birthDate: '2015-10-23',
    parentName: 'Sutan Alisyahbana',
    parentPhone: '085711229988',
    address: 'Jl. Barito No. 29',
    status: 'aktif',
    createdAt: '2022-07-11',
  },

  // Kelas 5A
  {
    id: 's601',
    nisn: '0121845201',
    nis: '210101',
    name: 'Ilham Bintang Wicaksana',
    gender: 'L',
    classId: 'c6',
    className: 'Kelas 5A',
    birthDate: '2014-03-01',
    parentName: 'Wicaksana Eko',
    parentPhone: '081288776655',
    address: 'Jl. Melawai Raya No. 18',
    status: 'aktif',
    createdAt: '2021-07-12',
  },
  {
    id: 's602',
    nisn: '0121845202',
    nis: '210102',
    name: 'Jessica Intan Maharani',
    gender: 'P',
    classId: 'c6',
    className: 'Kelas 5A',
    birthDate: '2014-07-28',
    parentName: 'Maharani Teguh',
    parentPhone: '081322114433',
    address: 'Jl. Dharmawangsa No. 6',
    status: 'aktif',
    createdAt: '2021-07-12',
  },
  {
    id: 's603',
    nisn: '0121845203',
    nis: '210103',
    name: 'Kevin Jonathan Siregar',
    gender: 'L',
    classId: 'c6',
    className: 'Kelas 5A',
    birthDate: '2014-09-12',
    parentName: 'Siregar Tumpal',
    parentPhone: '087788990011',
    address: 'Jl. RS Fatmawati No. 10',
    status: 'aktif',
    createdAt: '2021-07-12',
  },
  {
    id: 's604',
    nisn: '0121845204',
    nis: '210104',
    name: 'Larasati Prameswari',
    gender: 'P',
    classId: 'c6',
    className: 'Kelas 5A',
    birthDate: '2014-04-19',
    parentName: 'Prameswari Joko',
    parentPhone: '081911228833',
    address: 'Jl. Senayan Timur No. 15',
    status: 'aktif',
    createdAt: '2021-07-12',
  },

  // Kelas 6A
  {
    id: 's701',
    nisn: '0110844201',
    nis: '200101',
    name: 'Muhammad Akbar Syahputra',
    gender: 'L',
    classId: 'c8',
    className: 'Kelas 6A',
    birthDate: '2013-02-17',
    parentName: 'Syahputra Hendri',
    parentPhone: '081299884422',
    address: 'Jl. Wijaya I No. 40',
    status: 'aktif',
    createdAt: '2020-07-13',
  },
  {
    id: 's702',
    nisn: '0110844202',
    nis: '200102',
    name: 'Nabila Nur Aini',
    gender: 'P',
    classId: 'c8',
    className: 'Kelas 6A',
    birthDate: '2013-08-05',
    parentName: 'Aini Mustofa',
    parentPhone: '085611223344',
    address: 'Jl. Iskandarsyah No. 12',
    status: 'aktif',
    createdAt: '2020-07-13',
  },
];

// Helper to get formatted date string
const getPastDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const getTodayDateString = (): string => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

// Generate realistic dummy attendance data for last 7 days + today
export const generateInitialAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const todayStr = getTodayDateString();
  const dates = [
    getPastDate(6),
    getPastDate(5),
    getPastDate(4),
    getPastDate(3),
    getPastDate(2),
    getPastDate(1),
    todayStr,
  ];

  initialStudents.forEach((student, sIdx) => {
    dates.forEach((date, dIdx) => {
      // Deterministic realistic distribution
      let status: 'H' | 'S' | 'I' | 'A' | 'T' = 'H';
      let timeIn = '06:50';
      let notes = '';

      const seed = (sIdx * 7 + dIdx * 13) % 100;
      if (seed === 95 || seed === 12) {
        status = 'S';
        timeIn = undefined as any;
        notes = 'Demam dan flu (Istirahat)';
      } else if (seed === 88 || seed === 34) {
        status = 'I';
        timeIn = undefined as any;
        notes = 'Acara keluarga di luar kota';
      } else if (seed === 99) {
        status = 'A';
        timeIn = undefined as any;
        notes = 'Tanpa pemberitahuan';
      } else if (seed === 70 || seed === 25) {
        status = 'T';
        timeIn = '07:18';
        notes = 'Terlambat 8 menit (macet)';
      } else {
        // Hadir normal
        const minutes = 45 + ((sIdx + dIdx) % 15);
        timeIn = `06:${minutes.toString().padStart(2, '0')}`;
      }

      records.push({
        id: `att-${student.id}-${date}`,
        studentId: student.id,
        studentName: student.name,
        studentNisn: student.nisn,
        classId: student.classId,
        className: student.className,
        date: date,
        status: status,
        timeIn: timeIn,
        notes: notes,
        recordedBy: 'Sistem Absensi SD',
        verifiedAt: `${date} 07:30`,
      });
    });
  });

  return records;
};

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'lr-1',
    studentId: 's102',
    studentName: 'Anisa Rahmawati',
    className: 'Kelas 1A',
    parentName: 'Bambang Irawan',
    type: 'Sakit',
    startDate: getTodayDateString(),
    endDate: getTodayDateString(),
    reason: 'Anak mengalami demam panas 38.5°C sejak semalam dan disarankan istirahat oleh dokter klinik.',
    status: 'Pending',
    submittedAt: `${getTodayDateString()} 06:15`,
  },
  {
    id: 'lr-2',
    studentId: 's603',
    studentName: 'Kevin Jonathan Siregar',
    className: 'Kelas 5A',
    parentName: 'Siregar Tumpal',
    type: 'Izin',
    startDate: getTodayDateString(),
    endDate: getPastDate(-1), // Besok
    reason: 'Menghadiri pernikahan paman di Medan bersama seluruh keluarga inti.',
    status: 'Disetujui',
    submittedAt: `${getPastDate(1)} 19:40`,
    reviewedBy: 'Bapak Hendra Gunawan, S.Pd.',
    reviewedAt: `${getPastDate(1)} 20:10`,
  },
  {
    id: 'lr-3',
    studentId: 's301',
    studentName: 'Bima Sakti Yudhistira',
    className: 'Kelas 2A',
    parentName: 'Yudhistira K',
    type: 'Sakit',
    startDate: getPastDate(2),
    endDate: getPastDate(2),
    reason: 'Sakit gigi dan periksa ke dokter gigi.',
    status: 'Disetujui',
    submittedAt: `${getPastDate(2)} 06:30`,
    reviewedBy: 'Ibu Sri Wahyuni, S.Pd.',
    reviewedAt: `${getPastDate(2)} 07:00`,
  },
];

export const demoUsers: UserSession[] = [
  {
    id: 'u1',
    name: 'Ibu Ratna Dewi, S.Pd.',
    email: 'ratna.dewi@sdn01harapanbangsa.sch.id',
    role: 'guru',
    roleTitle: 'Wali Kelas 1A',
    assignedClass: 'c1',
  },
  {
    id: 'u2',
    name: 'Dra. Hj. Siti Rahmawati, M.Pd.',
    email: 'kepsek@sdn01harapanbangsa.sch.id',
    role: 'admin',
    roleTitle: 'Kepala Sekolah / Admin Utama',
  },
  {
    id: 'u3',
    name: 'Bapak Hendra Gunawan, S.Pd.',
    email: 'hendra.gunawan@sdn01harapanbangsa.sch.id',
    role: 'guru',
    roleTitle: 'Wali Kelas 5A',
    assignedClass: 'c6',
  },
  {
    id: 'u4',
    name: 'Bapak Agus Pratama (Wali Siswa)',
    email: 'agus.pratama@gmail.com',
    role: 'wali_murid',
    roleTitle: 'Orang Tua / Wali Siswa',
    assignedClass: 'c1',
  },
];
