export type AttendanceStatus = 'H' | 'S' | 'I' | 'A' | 'T'; // H: Hadir, S: Sakit, I: Izin, A: Alpa, T: Terlambat

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  name: string;
  gender: 'L' | 'P'; // Laki-laki / Perempuan
  classId: string;
  className: string;
  birthDate: string;
  parentName: string;
  parentPhone: string;
  address: string;
  avatarUrl?: string;
  status: 'aktif' | 'mutasi' | 'lulus';
  createdAt: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: number; // 1 - 6
  teacherName: string;
  teacherNip: string;
  roomNumber: string;
  totalStudents?: number;
  academicYear: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentNisn: string;
  classId: string;
  className: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  timeIn?: string; // HH:mm
  notes?: string;
  attachmentUrl?: string;
  recordedBy: string;
  verifiedAt: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  parentName: string;
  type: 'Sakit' | 'Izin' | 'Lainnya';
  startDate: string;
  endDate: string;
  reason: string;
  attachmentUrl?: string;
  status: 'Pending' | 'Disetujui' | 'Ditolak';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  principalName: string;
  principalNip: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  schoolStartTime: string; // e.g. 07:00
  lateThresholdTime: string; // e.g. 07:15
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'guru' | 'wali_murid';
  roleTitle: string;
  assignedClass?: string;
  avatarUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  linkTab?: NavigationTab;
}

export type NavigationTab =
  | 'dashboard'
  | 'presensi-harian'
  | 'data-siswa'
  | 'data-kelas'
  | 'import-data'
  | 'rekap-laporan'
  | 'pengajuan-izin'
  | 'kartu-pelajar'
  | 'pengaturan';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}
