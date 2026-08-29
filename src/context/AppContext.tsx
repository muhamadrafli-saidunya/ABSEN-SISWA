import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  ClassRoom,
  AttendanceRecord,
  LeaveRequest,
  SchoolProfile,
  UserSession,
  NavigationTab,
  ToastMessage,
  AttendanceStatus,
  NotificationItem,
} from '../types';
import {
  initialSchoolProfile,
  initialClasses,
  initialStudents,
  generateInitialAttendance,
  initialLeaveRequests,
  demoUsers,
  getTodayDateString,
} from '../data/initialData';

interface AppContextType {
  // Navigation & Theme
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Current User Session & Auth
  currentUser: UserSession;
  setCurrentUser: (user: UserSession) => void;
  availableUsers: UserSession[];
  logout: () => void;
  loginAs: (userId: string) => void;

  // School Profile
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;

  // Students (CRUD)
  students: Student[];
  addStudent: (studentData: Omit<Student, 'id' | 'createdAt'>) => Student;
  updateStudent: (id: string, updatedData: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;

  // Classes (CRUD)
  classes: ClassRoom[];
  addClass: (classData: Omit<ClassRoom, 'id'>) => ClassRoom;
  updateClass: (id: string, updatedData: Partial<ClassRoom>) => void;
  deleteClass: (id: string) => void;
  getClassById: (id: string) => ClassRoom | undefined;

  // Attendance Operations
  attendanceRecords: AttendanceRecord[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedClassId: string;
  setSelectedClassId: (classId: string) => void;
  markAttendance: (
    studentId: string,
    status: AttendanceStatus,
    date?: string,
    notes?: string,
    timeIn?: string
  ) => void;
  markAllPresentForClass: (classId: string, date?: string) => void;
  saveBatchAttendance: (records: AttendanceRecord[]) => void;
  getAttendanceForStudent: (studentId: string) => AttendanceRecord[];
  getAttendanceForClassAndDate: (classId: string, date: string) => AttendanceRecord[];

  // Leave Requests (Surat Izin)
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status'>) => void;
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // QR Scanning Simulation Helper
  scanStudentQR: (qrCodeOrNisn: string) => { success: boolean; message: string; student?: Student };

  // Reset to default
  resetDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'absensi_sd_profile_v1',
  CLASSES: 'absensi_sd_classes_v1',
  STUDENTS: 'absensi_sd_students_v1',
  ATTENDANCE: 'absensi_sd_attendance_v1',
  LEAVE_REQUESTS: 'absensi_sd_leave_requests_v1',
  THEME: 'absensi_sd_theme_v1',
  USER: 'absensi_sd_user_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(darkMode));
    } catch (e) {
      console.error(e);
    }
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Current User Session
  const [currentUser, setCurrentUser] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return demoUsers[0]; // Default: Ibu Ratna Dewi (Wali Kelas 1A)
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch (e) {}
  }, [currentUser]);

  // School Profile
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialSchoolProfile;
  });

  const updateSchoolProfile = (profileUpdate: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => {
      const updated = { ...prev, ...profileUpdate };
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    addToast({
      type: 'success',
      title: 'Profil Diperbarui',
      message: 'Informasi sekolah berhasil disimpan.',
    });
  };

  // Classes
  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialClasses;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    } catch (e) {}
  }, [classes]);

  // Students
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialStudents;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {}
  }, [students]);

  // Attendance Records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return generateInitialAttendance();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
    } catch (e) {}
  }, [attendanceRecords]);

  // Leave Requests
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialLeaveRequests;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(leaveRequests));
    } catch (e) {}
  }, [leaveRequests]);

  // Selected date and class for daily attendance
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    return currentUser.assignedClass || 'c1';
  });

  // Keep selected class synced when user switches if they have an assigned class
  useEffect(() => {
    if (currentUser.assignedClass) {
      setSelectedClassId(currentUser.assignedClass);
    }
  }, [currentUser]);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Pengajuan Izin Baru',
      message: 'Wali murid Anisa Rahmawati (Kelas 1A) mengajukan surat izin sakit hari ini.',
      type: 'warning',
      timestamp: 'Baru saja',
      read: false,
      linkTab: 'pengajuan-izin',
    },
    {
      id: 'n2',
      title: 'Rekap Presensi Harian',
      message: 'Presensi Kelas 5A telah diselesaikan oleh Bpk. Hendra Gunawan.',
      type: 'success',
      timestamp: '15 menit lalu',
      read: false,
      linkTab: 'rekap-laporan',
    },
    {
      id: 'n3',
      title: 'Pengingat Batas Jam Masuk',
      message: 'Batas toleransi masuk pukul 07:15. Pastikan semua siswa telah diabsen.',
      type: 'info',
      timestamp: '07:00 WIB',
      read: true,
      linkTab: 'presensi-harian',
    },
  ]);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth / Role switching
  const loginAs = (userId: string) => {
    const user = demoUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.assignedClass) {
        setSelectedClassId(user.assignedClass);
      }
      addToast({
        type: 'info',
        title: 'Beralih Akun',
        message: `Sekarang masuk sebagai: ${user.name} (${user.roleTitle})`,
      });
    }
  };

  const logout = () => {
    loginAs('u1'); // Reset to default
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt'>): Student => {
    const newStudent: Student = {
      ...studentData,
      id: `s-${Date.now()}`,
      createdAt: getTodayDateString(),
    };
    setStudents((prev) => [newStudent, ...prev]);
    addToast({
      type: 'success',
      title: 'Siswa Ditambahkan',
      message: `${newStudent.name} (${newStudent.className}) berhasil didaftarkan.`,
    });
    return newStudent;
  };

  const updateStudent = (id: string, updatedData: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updatedData };
          // If class was updated, ensure className is consistent
          if (updatedData.classId && updatedData.classId !== s.classId) {
            const cls = classes.find((c) => c.id === updatedData.classId);
            if (cls) updated.className = cls.name;
          }
          return updated;
        }
        return s;
      })
    );
    addToast({
      type: 'success',
      title: 'Data Disimpan',
      message: 'Perubahan data siswa berhasil diperbarui.',
    });
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    // Also cleanup attendance
    setAttendanceRecords((prev) => prev.filter((a) => a.studentId !== id));
    addToast({
      type: 'warning',
      title: 'Siswa Dihapus',
      message: target ? `${target.name} telah dihapus dari data siswa.` : 'Data siswa telah dihapus.',
    });
  };

  const getStudentById = (id: string) => {
    return students.find((s) => s.id === id);
  };

  // Class CRUD
  const addClass = (classData: Omit<ClassRoom, 'id'>): ClassRoom => {
    const newClass: ClassRoom = {
      ...classData,
      id: `c-${Date.now()}`,
    };
    setClasses((prev) => [...prev, newClass]);
    addToast({
      type: 'success',
      title: 'Kelas Ditambahkan',
      message: `${newClass.name} berhasil dibuat.`,
    });
    return newClass;
  };

  const updateClass = (id: string, updatedData: Partial<ClassRoom>) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    // Update student className if name changed
    if (updatedData.name) {
      setStudents((prev) =>
        prev.map((s) => (s.classId === id ? { ...s, className: updatedData.name! } : s))
      );
    }
    addToast({
      type: 'success',
      title: 'Kelas Diperbarui',
      message: 'Data kelas berhasil disimpan.',
    });
  };

  const deleteClass = (id: string) => {
    const target = classes.find((c) => c.id === id);
    setClasses((prev) => prev.filter((c) => c.id !== id));
    addToast({
      type: 'warning',
      title: 'Kelas Dihapus',
      message: target ? `${target.name} telah dihapus.` : 'Kelas telah dihapus.',
    });
  };

  const getClassById = (id: string) => {
    return classes.find((c) => c.id === id);
  };

  // Attendance Handlers
  const markAttendance = (
    studentId: string,
    status: AttendanceStatus,
    date = selectedDate,
    notes = '',
    timeIn?: string
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const defaultTime = status === 'H' || status === 'T' ? (timeIn || '07:05') : undefined;

    setAttendanceRecords((prev) => {
      const existingIdx = prev.findIndex(
        (r) => r.studentId === studentId && r.date === date
      );

      const recordItem: AttendanceRecord = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `att-${studentId}-${date}-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        studentNisn: student.nisn,
        classId: student.classId,
        className: student.className,
        date: date,
        status: status,
        timeIn: defaultTime,
        notes: notes || (status === 'T' ? 'Masuk terlambat' : ''),
        recordedBy: currentUser.name,
        verifiedAt: `${date} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
      };

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = recordItem;
        return next;
      } else {
        return [...prev, recordItem];
      }
    });
  };

  const markAllPresentForClass = (classId: string, date = selectedDate) => {
    const classStudents = students.filter((s) => s.classId === classId && s.status === 'aktif');
    if (classStudents.length === 0) return;

    setAttendanceRecords((prev) => {
      // Remove any existing records for this class on this date, then insert all as Present
      const filtered = prev.filter((r) => !(r.classId === classId && r.date === date));
      const nowStr = `${date} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

      const newRecords: AttendanceRecord[] = classStudents.map((s, idx) => {
        const min = 45 + (idx % 15);
        return {
          id: `att-${s.id}-${date}-${Date.now()}-${idx}`,
          studentId: s.id,
          studentName: s.name,
          studentNisn: s.nisn,
          classId: s.classId,
          className: s.className,
          date: date,
          status: 'H',
          timeIn: `06:${min.toString().padStart(2, '0')}`,
          notes: 'Hadir Tepat Waktu',
          recordedBy: currentUser.name,
          verifiedAt: nowStr,
        };
      });

      return [...filtered, ...newRecords];
    });

    const targetClass = classes.find((c) => c.id === classId);
    addToast({
      type: 'success',
      title: 'Presensi Diperbarui',
      message: `Semua siswa ${targetClass?.name || 'kelas'} (${classStudents.length} siswa) berhasil ditandai HADIR.`,
    });
  };

  const saveBatchAttendance = (records: AttendanceRecord[]) => {
    if (records.length === 0) return;
    setAttendanceRecords((prev) => {
      const keys = new Set(records.map((r) => `${r.studentId}-${r.date}`));
      const remaining = prev.filter((r) => !keys.has(`${r.studentId}-${r.date}`));
      return [...remaining, ...records];
    });
    addToast({
      type: 'success',
      title: 'Presensi Tersimpan',
      message: `${records.length} data presensi berhasil diperbarui dan tersimpan akurat.`,
    });
  };

  const getAttendanceForStudent = (studentId: string) => {
    return attendanceRecords.filter((r) => r.studentId === studentId);
  };

  const getAttendanceForClassAndDate = (classId: string, date: string) => {
    return attendanceRecords.filter((r) => r.classId === classId && r.date === date);
  };

  // Leave Requests Handlers
  const addLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status'>) => {
    const student = students.find((s) => s.id === request.studentId);
    const newReq: LeaveRequest = {
      ...request,
      id: `lr-${Date.now()}`,
      className: student?.className || request.className,
      studentName: student?.name || request.studentName,
      status: 'Pending',
      submittedAt: `${getTodayDateString()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
    };

    setLeaveRequests((prev) => [newReq, ...prev]);

    // Push notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Surat ${newReq.type} Baru`,
        message: `${newReq.studentName} (${newReq.className}): "${newReq.reason.substring(0, 45)}..."`,
        type: 'warning',
        timestamp: 'Baru saja',
        read: false,
        linkTab: 'pengajuan-izin',
      },
      ...prev,
    ]);

    addToast({
      type: 'success',
      title: 'Surat Izin Terkirim',
      message: `Surat ${request.type} untuk ${newReq.studentName} berhasil diajukan dan menunggu verifikasi guru.`,
    });
  };

  const approveLeaveRequest = (id: string) => {
    const target = leaveRequests.find((r) => r.id === id);
    if (!target) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Disetujui',
              reviewedBy: currentUser.name,
              reviewedAt: `${getTodayDateString()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
            }
          : r
      )
    );

    // Automatically update attendance record for target student
    const statusType: AttendanceStatus = target.type === 'Sakit' ? 'S' : 'I';
    markAttendance(
      target.studentId,
      statusType,
      target.startDate,
      `Izin disetujui: ${target.reason}`
    );

    addToast({
      type: 'success',
      title: 'Surat Disetujui',
      message: `Izin untuk ${target.studentName} disetujui. Status presensi diperbarui menjadi ${target.type}.`,
    });
  };

  const rejectLeaveRequest = (id: string) => {
    const target = leaveRequests.find((r) => r.id === id);
    if (!target) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Ditolak',
              reviewedBy: currentUser.name,
              reviewedAt: `${getTodayDateString()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
            }
          : r
      )
    );

    addToast({
      type: 'warning',
      title: 'Pengajuan Ditolak',
      message: `Surat izin untuk ${target.studentName} telah ditolak.`,
    });
  };

  // QR Barcode Scanning logic
  const scanStudentQR = (query: string) => {
    const cleanQuery = query.trim().toLowerCase();
    const student = students.find(
      (s) =>
        s.nisn.toLowerCase() === cleanQuery ||
        s.nis.toLowerCase() === cleanQuery ||
        s.id.toLowerCase() === cleanQuery ||
        s.name.toLowerCase().includes(cleanQuery)
    );

    if (!student) {
      return {
        success: false,
        message: `Siswa dengan kode / NISN "${query}" tidak ditemukan.`,
      };
    }

    // Mark present for today
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const isLate = timeStr > schoolProfile.lateThresholdTime;
    const status: AttendanceStatus = isLate ? 'T' : 'H';
    const notes = isLate ? `Presensi QR - Terlambat (${timeStr})` : `Presensi QR Sukses (${timeStr})`;

    markAttendance(student.id, status, getTodayDateString(), notes, timeStr);

    return {
      success: true,
      message: `Presensi ${student.name} (${student.className}) BERHASIL: Status ${status === 'H' ? 'HADIR' : 'TERLAMBAT'}.`,
      student,
    };
  };

  // Reset all data to factory demo
  const resetDataToDefault = () => {
    localStorage.clear();
    setSchoolProfile(initialSchoolProfile);
    setClasses(initialClasses);
    setStudents(initialStudents);
    setAttendanceRecords(generateInitialAttendance());
    setLeaveRequests(initialLeaveRequests);
    setCurrentUser(demoUsers[0]);
    setSelectedDate(getTodayDateString());
    setSelectedClassId('c1');
    addToast({
      type: 'info',
      title: 'Data Direset',
      message: 'Semua data kembali ke konfigurasi awal bawaan.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        darkMode,
        setDarkMode,
        currentUser,
        setCurrentUser,
        availableUsers: demoUsers,
        logout,
        loginAs,
        schoolProfile,
        updateSchoolProfile,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
        classes,
        addClass,
        updateClass,
        deleteClass,
        getClassById,
        attendanceRecords,
        selectedDate,
        setSelectedDate,
        selectedClassId,
        setSelectedClassId,
        markAttendance,
        markAllPresentForClass,
        saveBatchAttendance,
        getAttendanceForStudent,
        getAttendanceForClassAndDate,
        leaveRequests,
        addLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        toasts,
        addToast,
        removeToast,
        scanStudentQR,
        resetDataToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
