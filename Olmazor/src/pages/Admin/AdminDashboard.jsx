import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  FaUsers, FaChalkboardTeacher, FaSchool, FaClipboardList,
  FaCalendarAlt, FaSignOutAlt, FaTachometerAlt, FaPlus,
  FaEdit, FaTrash, FaTimes, FaCheck, FaBan, FaBars, FaKey, FaShieldAlt, FaStar, FaGraduationCap, FaFileSignature, FaLinode, FaLink, FaListUl,
  FaBook, FaDownload, FaFilePdf, FaChalkboard, FaSearch, FaFilter
} from 'react-icons/fa';
import { SPECIALIZATIONS, BASE_SUBJECTS, getBaseSubject } from '../../constants/TeacherSpecializations';

const NAV = [
  { id: 'dashboard', label: 'Statistika', icon: FaTachometerAlt },
  { id: 'users', label: 'Foydalanuvchilar', icon: FaUsers },
  { id: 'classes', label: 'Sinflar', icon: FaSchool },
  { id: 'schedule', label: 'Dars jadvali', icon: FaCalendarAlt },
  { id: 'assignments', label: 'Sinflarni biriktirish', icon: FaLink },
  { id: 'talents', label: 'Iqtidorli talabalar', icon: FaStar },
  { id: 'applications', label: 'Qabul arizalari', icon: FaClipboardList },
  { id: 'library', label: 'Kutubxona', icon: FaBook },
  { id: 'settings', label: 'Sozlamalar', icon: FaKey },
];

const BOOK_CATEGORIES = ['Boshqa', 'Matematika', 'Ona tili', 'Ingliz tili', 'Tarix', 'Fizika', 'Kimyo', 'Biologiya', 'Geografiya', 'Informatika', 'Adabiyot', 'Rus tili', 'Chizmachilik', 'Musiqa', 'Jismoniy tarbiya'];

const DAYS = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

const ROOMS = ['101', '102', '103', '201', '202', '203', '301', '302', 'Sport zal', 'Informatika xonasi', 'Kutubxona'];

const LESSON_TIMES = {
    1: { start: '08:00', end: '08:45' },
    2: { start: '08:50', end: '09:35' },
    3: { start: '09:40', end: '10:25' },
    4: { start: '10:30', end: '11:15' },
    5: { start: '11:20', end: '12:05' },
    6: { start: '12:10', end: '12:55' },
    7: { start: '13:00', end: '13:45' },
};

const getAutoQuarter = () => {
    const now = new Date();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    if (m >= 9 && m <= 10 && d <= 15) return 1;
    if ((m === 10 && d >= 20) || m === 11 || (m === 12 && d <= 25)) return 2;
    if ((m === 1 && d >= 11) || m === 2 || (m === 3 && d <= 15)) return 3;
    if ((m === 3 && d >= 20) || m === 4 || (m === 5 && d <= 25)) return 4;
    if (m >= 9 && m <= 10) return 1;
    if (m >= 11 && m <= 12) return 2;
    if (m >= 1 && m <= 3) return 3;
    return 4;
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Data states
  const [stats, setStats] = useState({ users: 0, teachers: 0, students: 0, classes: 0, applications: 0, avgGrade: 0 });
  // News (Yangiliklar) state
  const [news, setNews] = useState([]);
  const [newsModal, setNewsModal] = useState(false);
  const [newsForm, setNewsForm] = useState({ title: '', content: '' });
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [applications, setApplications] = useState([]);
  const [allGrades, setAllGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Library states
  const [libBooks, setLibBooks] = useState([]);
  const [libTab, setLibTab] = useState('general'); // 'general' | 'teacher'
  const [libSearch, setLibSearch] = useState('');
  const [libCatFilter, setLibCatFilter] = useState('');
  const [libModal, setLibModal] = useState(false);
  const [libForm, setLibForm] = useState({ title: '', description: '', author: '', category: 'Boshqa', type: 'general', url: '' });
  const [libUseUrl, setLibUseUrl] = useState(false);
  const [libFile, setLibFile] = useState(null);
  const [libLoading, setLibLoading] = useState(false);

  // Modal states
  const [userModal, setUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userForm, setUserForm] = useState({ userName: '', password: '', name: '', role: 'student', classId: '', phoneNumber: '', olympiads: '', image: '', specialization: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');

  // Class Assignment states
  const [selectedClassId, setSelectedClassId] = useState('');
  const [classSearch, setClassSearch] = useState('');
  const activeClass = classes.find(c => c._id === selectedClassId);
  const [classHeadId, setClassHeadId] = useState('');
  const [assignForm, setAssignForm] = useState({ subjectName: '', teacherId: '' });

  useEffect(() => {
    if (activeClass) setClassHeadId(activeClass.teacherId?._id || activeClass.teacherId || '');
  }, [activeClass]);

  const [talentModal, setTalentModal] = useState(null); // Selected student for detail view

  const [classModal, setClassModal] = useState(false);
  const [classDetailsModal, setClassDetailsModal] = useState(null);
  const [editClass, setEditClass] = useState(null);
  const [classForm, setClassForm] = useState({ name: '', teacherId: '', year: '2024-2025' });

  const [scheduleModal, setScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ classId: '', teacherId: '', subjectName: '', dayOfWeek: 'Dushanba', startTime: '08:00', endTime: '08:45', room: '', quarter: getAutoQuarter(), lessonNumber: 1 });

  const [toast, setToast] = useState('');
  const [cpForm, setCpForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const handleLogout = () => { logout(); navigate('/'); };

  useEffect(() => { fetchAll(); }, [active]);

  useEffect(() => {
    if (scheduleModal) {
      const times = LESSON_TIMES[scheduleForm.lessonNumber] || LESSON_TIMES[1];
      setScheduleForm(prev => ({ ...prev, startTime: times.start, endTime: times.end }));
    }
  }, [scheduleForm.lessonNumber, scheduleModal]);

  useEffect(() => {
    if (scheduleModal && scheduleForm.classId && scheduleForm.subjectName) {
        const cls = classes.find(c => c._id === scheduleForm.classId);
        if (cls && cls.subjects) {
            const assignment = cls.subjects.find(s => s.name === getBaseSubject(scheduleForm.subjectName));
            if (assignment) {
                setScheduleForm(prev => ({ ...prev, teacherId: assignment.teacherId?._id || assignment.teacherId }));
            }
        }
    }
  }, [scheduleForm.classId, scheduleForm.subjectName, scheduleModal, classes]);

  const isScheduleClash = () => {
    return schedule.some(s => 
      s.dayOfWeek === scheduleForm.dayOfWeek &&
      s.quarter === scheduleForm.quarter &&
      s.startTime === (LESSON_TIMES[scheduleForm.lessonNumber]?.start || scheduleForm.startTime) &&
      s.room === scheduleForm.room
    );
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      if (active === 'dashboard' || active === 'users' || active === 'talents') {
        const r = await api.get('/users');
        const u = r.data.data.users;
        setUsers(u);
        setStats(prev => ({
          ...prev,
          users: u.length,
          teachers: u.filter(x => x.role === 'teacher').length,
          students: u.filter(x => x.role === 'student').length,
        }));
      }
      if (active === 'dashboard' || active === 'classes' || active === 'talents') {
        const r = await api.get('/classes');
        setClasses(r.data.data.classes);
        setStats(prev => ({ ...prev, classes: r.data.data.classes.length }));
      }
      if (active === 'dashboard' || active === 'applications') {
        const r = await api.get('/applications');
        setApplications(r.data.data.applications);
        setStats(prev => ({ ...prev, applications: r.data.data.applications.filter(a => a.status === 'kutilmoqda').length }));
      }
      if (active === 'schedule') {
        const r = await api.get('/schedule');
        setSchedule(r.data.data.schedule);
      }
      if (active === 'talents') {
        const r = await api.get('/grades');
        setAllGrades(r.data.data.grades);
      }
      if (active === 'library') {
        const r = await api.get('/library');
        setLibBooks(r.data.data.files);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const uploadLibBook = async (e) => {
    e.preventDefault();
    // If URL is provided, skip file upload
    if (libUseUrl && !libForm.url) return showToast('Kitob URL kiriting ❌');
    if (!libUseUrl && !libFile) return showToast('PDF fayl tanlang ❌');
    setLibLoading(true);
    try {
      if (libUseUrl) {
        // Send JSON payload with URL
        await api.post('/library/upload', {
          title: libForm.title,
          description: libForm.description,
          author: libForm.author,
          category: libForm.category,
          type: libForm.type,
          uploadedBy: user?._id || '',
          url: libForm.url,
        });
      } else {
        const fd = new FormData();
        fd.append('file', libFile);
        fd.append('title', libForm.title);
        fd.append('description', libForm.description);
        fd.append('author', libForm.author);
        fd.append('category', libForm.category);
        fd.append('type', libForm.type);
        fd.append('uploadedBy', user?._id || '');
        await api.post('/library/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      showToast('Kitob muvaffaqiyatli yuklandi ✅');
      setLibModal(false);
      setLibForm({ title: '', description: '', author: '', category: 'Boshqa', type: 'general', url: '' });
      setLibFile(null);
      setLibUseUrl(false);
      const r = await api.get('/library');
      setLibBooks(r.data.data.files);
    } catch (err) {
      showToast('Xatolik: ' + (err.response?.data?.message || err.message));
    }
    setLibLoading(false);
  };

  const deleteLibBook = async (id) => {
    if (!confirm("Kitobni o'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/library/${id}`);
    showToast("Kitob o'chirildi ✅");
    const r = await api.get('/library');
    setLibBooks(r.data.data.files);
  };

  const handleLibDownload = async (book) => {
    await api.patch(`/library/${book._id}/download`);
    window.open(book.fileUrl, '_blank');
  };

  const openUserModal = (u = null) => {
    setEditUser(u);
    setSelectedFile(null);
    setPreview(u?.image ? `${api.defaults.baseURL}${u.image}` : '');
    setUserForm(u ? { 
        userName: u.userName, 
        password: '', 
        name: u.name, 
        role: u.role, 
        classId: u.classId?._id || '', 
        phoneNumber: u.phoneNumber || '',
        olympiads: (u.olympiads || []).join(', '),
        image: u.image || '',
        specialization: u.specialization || ''
    } : { userName: '', password: '', name: '', role: 'student', classId: '', phoneNumber: '', olympiads: '', image: '', specialization: '' });
    setUserModal(true);
  };

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('userName', userForm.userName);
      if (userForm.password) fd.append('password', userForm.password);
      fd.append('name', userForm.name);
      fd.append('role', userForm.role);
      fd.append('classId', userForm.classId);
      fd.append('phoneNumber', userForm.phoneNumber);
      fd.append('specialization', userForm.specialization);
      
      const olympiadsArray = userForm.olympiads.split(',').map(s => s.trim()).filter(s => s);
      fd.append('olympiads', olympiadsArray.join(',')); // Controller parses comma separated string

      if (selectedFile) {
          fd.append('image', selectedFile);
      }

      if (editUser) {
        await api.patch(`/users/${editUser._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/users', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      showToast(editUser ? 'Muvaffaqiyatli yangilandi ✅' : 'Yangi foydalanuvchi yaratildi ✅');
      setUserModal(false);
      fetchAll();
    } catch (e) { showToast('Xatolik: ' + (e.response?.data?.message || e.message)); }
  };

  const calculateGPA = (studentId) => {
    const studentGrades = allGrades.filter(g => (g.studentId?._id || g.studentId) === studentId);
    if (studentGrades.length === 0) return 0;
    const sum = studentGrades.reduce((s, g) => s + g.score, 0);
    return (sum / studentGrades.length).toFixed(1);
  };

  const talentedStudents = users
    .filter(u => u.role === 'student')
    .map(u => ({ ...u, gpa: calculateGPA(u._id) }))
    .filter(u => u.gpa >= 4.5)
    .sort((a, b) => b.gpa - a.gpa);

  const deleteUser = async (id) => {
    if (!confirm('Foydalanuvchini o\'chirishni tasdiqlaysizmi?')) return;
    await api.delete(`/users/${id}`);
    showToast('Foydalanuvchi o\'chirildi ✅');
    fetchAll();
  };

  const deleteClass = async (id) => {
    if (!confirm('Sinfni o\'chirishni tasdiqlaysizmi?')) return;
    await api.delete(`/classes/${id}`);
    showToast('Sinf o\'chirildi ✅');
    fetchAll();
  };

  const openClassModal = (c = null) => {
    setEditClass(c);
    setClassForm(c ? { name: c.name, teacherId: c.teacherId?._id || '', year: c.year } : { name: '', teacherId: '', year: '2024-2025' });
    setClassModal(true);
  };

  const saveClass = async (e) => {
    e.preventDefault();
    try {
      const gradeNum = parseInt(classForm.name);
      if (isNaN(gradeNum) || gradeNum < 5 || gradeNum > 11) {
          showToast('Faqat 5-11 sinflar ruxsat etilgan! ⚠️');
          return;
      }

      if (editClass) await api.patch(`/classes/${editClass._id}`, classForm);
      else await api.post('/classes', classForm);
      showToast(editClass ? 'Yangilandi ✅' : 'Yaratildi ✅');
      setClassModal(false);
      fetchAll();
    } catch (e) { showToast('Xatolik: ' + (e.response?.data?.message || e.message)); }
  };

  const deleteSchedule = async (id) => {
    if (!confirm('Darsni o\'chirishni tasdiqlaysizmi?')) return;
    await api.delete(`/schedule/${id}`);
    showToast('Dars o\'chirildi ✅');
    fetchAll();
  };

  const openScheduleModal = () => {
    setScheduleForm({ 
        classId: '', 
        teacherId: '', 
        subjectName: '', 
        dayOfWeek: 'Dushanba', 
        startTime: '08:00', 
        endTime: '08:45', 
        room: '', 
        quarter: getAutoQuarter(), 
        lessonNumber: 1 
    });
    setScheduleModal(true);
  };

  const saveSchedule = async (e) => {
    e.preventDefault();
    try {
      await api.post('/schedule', scheduleForm);
      showToast('Dars jadvalga qo\'shildi ✅');
      setScheduleModal(false);
      fetchAll();
    } catch (e) { showToast('Xatolik: ' + (e.response?.data?.message || e.message)); }
  };

  const updateAppStatus = async (id, status) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      showToast('Ariza holati yangilandi ✅');
      fetchAll();
    } catch (e) { showToast('Xatolik yuz berdi'); }
  };

  const deleteApp = async (id) => {
    if (!confirm('Arizani o\'chirishni tasdiqlaysizmi?')) return;
    await api.delete(`/applications/${id}`);
    showToast('Ariza o\'chirildi');
    fetchAll();
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (cpForm.newPassword !== cpForm.confirmPassword) return showToast('Parollar mos kelmadi ❌');
    try {
      await api.post('/auth/change-password', { oldPassword: cpForm.oldPassword, newPassword: cpForm.newPassword });
      showToast('Parolingiz o\'zgartirildi ✅');
      setCpForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) { showToast('Xatolik: ' + (e.response?.data?.message || 'Amal bajarilmadi')); }
  };

  const handleClassSelect = (id) => {
    setSelectedClassId(id);
  };

  const updateClassAssignment = async (data) => {
    try {
      await api.patch(`/classes/${selectedClassId}`, data);
      showToast('Sinf ma\'lumotlari yangilandi ✅');
      fetchAll();
    } catch (e) { showToast('Xatolik yuz berdi'); }
  };

  const addSubjectToClass = (e) => {
    e.preventDefault();
    if (!assignForm.subjectName || !assignForm.teacherId) return showToast('Barcha maydonlarni to\'ldiring');
    
    const currentSubjects = activeClass?.subjects || [];
    if (currentSubjects.some(s => s.name === assignForm.subjectName)) return showToast('Bu fan allaqachon qo\'shilgan');

    const newSubjects = [...currentSubjects, { name: assignForm.subjectName, teacherId: assignForm.teacherId }];
    updateClassAssignment({ subjects: newSubjects });
    setAssignForm({ subjectName: '', teacherId: '' });
  };

  const removeSubjectFromClass = (subName) => {
    const newSubjects = activeClass.subjects.filter(s => s.name !== subName);
    updateClassAssignment({ subjects: newSubjects });
  };

  const teachers = users.filter(u => u.role === 'teacher');

  return (
    <div className="flex h-screen bg-[#f1f3f6] font-sans overflow-hidden">
      
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl animate-fade-in text-xs font-bold">
          {toast}
        </div>
      )}

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0'}
        ${sidebarOpen ? 'w-64' : 'w-64 lg:w-0'}
        transition-all duration-300 bg-[#161c2d] flex-shrink-0 flex flex-col shadow-2xl overflow-hidden
      `}>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">A</div>
             <div>
                <p className="text-white font-bold text-sm tracking-tight italic">OLMAZOR</p>
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">ADMIN PANEL</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => {
                setActive(id);
                if (window.innerWidth <= 1024) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all
                ${active === id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 rounded-xl p-4 mb-3 border border-white/5">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">{user?.name?.[0]}</div>
                <div className="overflow-hidden">
                   <p className="text-white text-[10px] font-bold truncate">{user?.name}</p>
                   <p className="text-indigo-400 text-[8px] font-bold uppercase tracking-widest mt-1">ADMINISTRATOR</p>
                </div>
             </div>
             <button onClick={handleLogout} className="w-full text-left text-red-400 text-[10px] font-bold py-2 hover:text-red-300 transition-colors flex items-center gap-2">
                <FaSignOutAlt size={12} /> Tizimdan chiqish
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <FaBars size={18} />
            </button>
            <h1 className="text-slate-800 font-black text-sm uppercase tracking-[0.2em]">
              {NAV.find(n => n.id === active)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('uz-UZ')}</p>
                  <p className="text-slate-800 font-bold text-xs">{user?.name}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 font-bold overflow-hidden shadow-sm">
                {user?.image ? (
                    <img src={`${api.defaults.baseURL}${user.image}`} alt="" className="w-full h-full object-cover" />
                ) : (
                    user?.name?.[0]
                )}
              </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">

          {/* === DASHBOARD === */}
          {active === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { label: "Foydalanuvchilar", value: stats.users, icon: FaUsers, color: "bg-indigo-500" },
                    { label: "O'qituvchilar", value: stats.teachers, icon: FaChalkboardTeacher, color: "bg-blue-500" },
                    { label: "O'quvchilar", value: stats.students, icon: FaUsers, color: "bg-cyan-500" },
                    { label: "Sinflar", value: stats.classes, icon: FaSchool, color: "bg-violet-500" },
                    { label: "Arizalar", value: stats.applications, icon: FaClipboardList, color: "bg-orange-500" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-3 group hover:shadow-xl transition-all overflow-hidden">
                      <div className={`${color} p-3 rounded-2xl text-white shadow-lg`}><Icon size={16} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-black text-slate-800 truncate">{value}</p>
                        <p className="text-xs md:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{label}</p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                 <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-16 -translate-y-16" />
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3"><FaClipboardList className="text-indigo-500" /> So'nggi arizalar</h3>
                    <div className="space-y-4">
                       {applications.slice(0, 5).map(a => (
                          <div key={a._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-indigo-200 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-indigo-500 shadow-sm">{a.ism?.[0]}</div>
                                <div>
                                   <p className="text-sm font-bold text-slate-800">{a.ism} {a.familiya}</p>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{a.sinf}-sinf arizasi</p>
                                </div>
                             </div>
                             <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm
                                ${a.status === 'kutilmoqda' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {a.status}
                             </span>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3"><FaShieldAlt className="text-blue-500" /> Tizim holati</h3>
                    <div className="p-6 bg-slate-900 rounded-3xl text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Barcha tizimlar normal ishlamoqda</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest py-2 border-b border-white/5">
                                <span className="text-slate-500">Ma'lumotlar bazasi</span>
                                <span className="text-emerald-400">Connected</span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest py-2 border-b border-white/5">
                                <span className="text-slate-500">Fayl tizimi</span>
                                <span className="text-emerald-400">Local Disk ON</span>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* === IQTIDORLI TALABALAR === */}
          {active === 'talents' && (
            <div className="space-y-8 animate-fade-in">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mb-6 shadow-inner"><FaStar size={36} /></div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Iqtidorli talabalar ro'yxati</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">GPA natijasi 4.5 dan yuqori bo'lgan o'quvchilar</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {talentedStudents.map(s => (
                        <div key={s._id} onClick={() => setTalentModal(s)} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer group">
                             <div className="flex items-center justify-between mb-6">
                                 <div className="flex items-center gap-4">
                                     <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-lg group-hover:scale-110 transition-transform shadow-lg">{s.name[0]}</div>
                                     <div>
                                         <h4 className="font-black text-slate-800 text-sm tracking-tight">{s.name}</h4>
                                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.classId?.name || 'Sinf-siz'} sinf</p>
                                     </div>
                                 </div>
                                 <div className="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 flex flex-col items-center">
                                     <span className="text-amber-600 font-black text-xs">{s.gpa}</span>
                                     <span className="text-[7px] font-black text-amber-500 uppercase tracking-tighter">GPA</span>
                                 </div>
                             </div>
                             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                 <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                                     <span className="text-slate-400">Sinf rahbari</span>
                                     <span className="text-slate-800">{classes.find(c => c._id === s.classId?._id)?.teacherId?.name || '—'}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                                     <span className="text-slate-400">Muvaffaqiyat</span>
                                     <span className="text-emerald-600 font-black">YUQORI</span>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* === USERS MANAGEMENT === */}
          {active === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200">
                <button onClick={() => openUserModal()}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100">
                  <FaPlus /> Yangi foydalanuvchi
                </button>
              </div>

              <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                        {['Ism Familiya', 'Username', 'Parol', 'Rol', 'Sinf/Fan', 'Ta\'sir'].map(h => (
                            <th key={h} className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold">
                        {users.map(u => (
                        <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    {u.image ? (
                                        <img src={`${api.defaults.baseURL}${u.image}`} alt="" className="w-9 h-9 rounded-xl object-cover shadow-sm" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs">{u.name[0]}</div>
                                    )}
                                    <span className="text-slate-800 text-xs tracking-tight">{u.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">{u.userName}</td>
                            <td className="px-6 py-4"><span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] uppercase font-black">{u.plainPassword || '••••••'}</span></td>
                            <td className="px-6 py-4">
                                <span className={`text-[8px] font-black px-3 py-1 rounded-full border shadow-sm uppercase tracking-widest
                                    ${u.role === 'admin' ? 'bg-slate-50 text-slate-600' : u.role === 'teacher' ? 'bg-indigo-50 text-indigo-600' : 'bg-cyan-50 text-cyan-600'}`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-[10px] text-slate-500">{u.classId?.name || u.subjectIds?.map(s => s.name).join(', ') || '—'}</td>
                            <td className="px-6 py-4 flex gap-2">
                                <button onClick={() => openUserModal(u)} className="p-2.5 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><FaEdit size={12} /></button>
                                <button onClick={() => deleteUser(u._id)} className="p-2.5 text-red-500 bg-red-50 rounded-xl hover:bg-red-600 hover:text-white transition-all"><FaTrash size={12} /></button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          )}

          {/* ... (Other sections follow same pattern) ... */}
          {active === 'classes' && (
             <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200">
                    <button onClick={() => openClassModal()} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition"><FaPlus className="inline mr-2" /> Yangi sinf</button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map(c => (
                      <div key={c._id} onClick={() => setClassDetailsModal(c)} className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                         <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">{c.name}</div>
                               <div><p className="font-black text-slate-900 text-lg tracking-tight">{c.name}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.year}</p></div>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={(e) => { e.stopPropagation(); openClassModal(c); }} className="p-2 text-slate-400 hover:text-blue-500"><FaEdit size={14} /></button>
                               <button onClick={(e) => { e.stopPropagation(); deleteClass(c._id); }} className="p-2 text-slate-400 hover:text-red-500"><FaTrash size={14} /></button>
                            </div>
                         </div>
                         <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 space-y-3">
                            <div className="flex justify-between items-center"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sinf rahbari</span><span className="text-xs font-black text-slate-800">{c.teacherId?.name || 'Yo\'q'}</span></div>
                            <div className="flex justify-between items-center"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">O'quvchilar</span><span className="text-xs font-black text-indigo-600">{c.studentIds?.length || 0} ta</span></div>
                         </div>
                      </div>
                    ))}
                  </div>
             </div>
          )}

          {active === 'schedule' && (
             <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200">
                    <button onClick={openScheduleModal} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition"><FaPlus className="inline mr-2" /> Dars qo'shish</button>
                  </div>
                  {DAYS.map(day => {
                    const daySch = schedule.filter(s => s.dayOfWeek === day);
                    if (daySch.length === 0) return null;
                    return (
                      <div key={day} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                        <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-3"><div className="w-1.5 h-6 bg-indigo-600 rounded-full" />{day}</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {daySch.map(s => (
                            <div key={s._id} className="p-5 bg-slate-50 rounded-[20px] border border-slate-100 group relative hover:border-indigo-300 transition-all">
                              <p className="font-black text-slate-900 text-sm mb-3 truncate">{s.subjectName}</p>
                              <div className="space-y-1.5 grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100">
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">🏫 {s.classId?.name}</p>
                                  <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">⏰ {s.startTime} – {s.endTime}</p>
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">👨‍🏫 {s.teacherId?.name}</p>
                              </div>
                              <button onClick={() => deleteSchedule(s._id)} className="absolute top-4 right-4 text-slate-200 hover:text-red-500 p-1"><FaTrash size={12} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
             </div>
          )}

          {/* (Applications and Settings sections remain consistent) */}
          {active === 'applications' && (
              <div className="space-y-6 animate-fade-in">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['kutilmoqda', 'qabul_qilindi', 'rad_etildi'].map(s => (
                            <div key={s} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">{applications.filter(a => a.status === s).length}</h4>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{s.replace('_',' ')}</p>
                            </div>
                        ))}
                   </div>
                   <div className="space-y-4">
                        {applications.map(a => (
                            <div key={a._id} className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-wrap items-center justify-between group hover:border-indigo-400 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">{a.ism[0]}</div>
                                    <div><p className="font-black text-slate-900 text-lg tracking-tight">{a.ism} {a.familiya}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">📞 {a.telefon} · {a.sinf}-sinf</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {a.status === 'kutilmoqda' ? (
                                        <>
                                            <button onClick={() => updateAppStatus(a._id, 'qabul_qilindi')} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition">Qabul</button>
                                            <button onClick={() => updateAppStatus(a._id, 'rad_etildi')} className="bg-slate-100 text-slate-500 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition">Rad etish</button>
                                        </>
                                    ) : (
                                        <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${a.status === 'qabul_qilindi' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                            {a.status === 'qabul_qilindi' ? 'Qabul qilingan' : 'Rad etilgan'}
                                        </span>
                                    )}
                                    <button onClick={() => deleteApp(a._id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><FaTrash size={16} /></button>
                                </div>
                            </div>
                        ))}
                   </div>
              </div>
          )}

          {active === 'settings' && (
            <div className="max-w-md mx-auto bg-white p-10 rounded-3xl border border-slate-200 shadow-sm animate-fade-in">
                <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3"><FaKey className="text-indigo-600" /> Parolni yangilash</h2>
                <form onSubmit={changePassword} className="space-y-4">
                    <input type="password" placeholder="Eski parol" value={cpForm.oldPassword} onChange={e => setCpForm({...cpForm, oldPassword: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-indigo-500 transition-all" required />
                    <input type="password" placeholder="Yangi parol" value={cpForm.newPassword} onChange={e => setCpForm({...cpForm, newPassword: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-indigo-500 transition-all" required />
                    <input type="password" placeholder="Tasdiqlash" value={cpForm.confirmPassword} onChange={e => setCpForm({...cpForm, confirmPassword: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-indigo-500 transition-all" required />
                    <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all uppercase tracking-widest text-[10px] mt-4">Saqlash</button>
                </form>
            </div>
          )}

          {active === 'assignments' && (
            <div className="space-y-8 animate-fade-in">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3"><FaLink className="text-indigo-600" /> Sinfga rahbar va fanlarni biriktirish</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sinfni tanlang</p>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Qidirish..." 
                                        value={classSearch} 
                                        onChange={e => setClassSearch(e.target.value)} 
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none focus:border-indigo-500 w-32" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {classes
                                  .filter(c => c.name.toLowerCase().includes(classSearch.toLowerCase()))
                                  .map(c => (
                                    <button key={c._id} onClick={() => handleClassSelect(c._id)} className={`px-3 py-2.5 rounded-xl text-[10px] font-black transition-all border ${selectedClassId === c._id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeClass && (
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6 animate-fade-in">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sinf rahbari ({activeClass.name})</p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <select 
                                            value={classHeadId} 
                                            onChange={(e) => setClassHeadId(e.target.value)} 
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 font-bold text-sm outline-none focus:border-indigo-500 shadow-sm"
                                        >
                                            <option value="">— Sinf rahbarini tanlang —</option>
                                            {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.specialization || 'Mutaxassislik yo\'q'})</option>)}
                                        </select>
                                        <button 
                                            onClick={() => updateClassAssignment({ teacherId: classHeadId })}
                                            className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 whitespace-nowrap"
                                        >
                                            Tasdiqlash
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {activeClass && (
                    <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
                        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-fit">
                            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2"><FaPlus className="text-indigo-600" /> Yangi fan qo'shish</h3>
                            <form onSubmit={addSubjectToClass} className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fan</p>
                                    <select 
                                        value={assignForm.subjectName} 
                                        onChange={(e) => setAssignForm({ ...assignForm, subjectName: e.target.value, teacherId: '' })} 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-bold text-sm outline-none focus:border-indigo-500 transition-all"
                                    >
                                        <option value="">— Fanni tanlang —</option>
                                        {BASE_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                {assignForm.subjectName && (
                                    <div className="space-y-1 animate-slide-up">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">O'qituvchi ({assignForm.subjectName})</p>
                                        <select 
                                            value={assignForm.teacherId} 
                                            onChange={(e) => setAssignForm({ ...assignForm, teacherId: e.target.value })} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-bold text-sm outline-none focus:border-indigo-500 transition-all"
                                        >
                                            <option value="">— Ustozni tanlang —</option>
                                            {teachers
                                                .filter(t => getBaseSubject(t.specialization || '') === assignForm.subjectName)
                                                .map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                        </select>
                                        {teachers.filter(t => getBaseSubject(t.specialization || '') === assignForm.subjectName).length === 0 && (
                                            <p className="text-[8px] font-black text-red-500 uppercase tracking-tighter mt-1 italic">Ushbu yo'nalishda hali ustozlar yo'q</p>
                                        )}
                                    </div>
                                )}

                                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-[10px] mt-4 shadow-lg shadow-indigo-100">
                                    Biriktirish
                                </button>
                            </form>
                        </div>

                        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2"><FaListUl className="text-indigo-600" /> Biriktirilgan fanlar va ustozlar ({activeClass.name} sinfi)</h3>
                            <div className="space-y-3">
                                {(activeClass.subjects && activeClass.subjects.length > 0) ? activeClass.subjects.map((sub, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-black shadow-sm">{sub.name[0]}</div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 tracking-tight">{sub.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ustoz: {teachers.find(t => t._id === (sub.teacherId?._id || sub.teacherId))?.name || 'Topilmadi'}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeSubjectFromClass(sub.name)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                )) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Hali fanlar biriktirilmagan</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
          )}

          {/* === KUTUBXONA === */}
          {active === 'library' && (() => {
            const filtered = libBooks
              .filter(b => b.type === libTab)
              .filter(b => !libCatFilter || b.category === libCatFilter)
              .filter(b => !libSearch || b.title.toLowerCase().includes(libSearch.toLowerCase()) || (b.author||'').toLowerCase().includes(libSearch.toLowerCase()));
            return (
              <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <FaBook className="text-white" size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-slate-800 tracking-tight">Maktab Kutubxonasi</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Umumiy: {libBooks.filter(b=>b.type==='general').length} ta · Ustozlar: {libBooks.filter(b=>b.type==='teacher').length} ta
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setLibForm({ title:'', description:'', author:'', category:'Boshqa', type: libTab }); setLibFile(null); setLibModal(true); }}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                    >
                      <FaPlus /> Kitob yuklash
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 mb-5">
                    {[{ key:'general', label:'📚 Umumiy kutubxona' }, { key:'teacher', label:'👨‍🏫 Ustozlar kutubxonasi' }].map(t => (
                      <button key={t.key} onClick={() => setLibTab(t.key)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${libTab === t.key ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Search & Filter */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 flex-1 min-w-[200px]">
                      <FaSearch className="text-slate-400" size={12} />
                      <input
                        type="text" placeholder="Kitob nomi yoki muallif..."
                        value={libSearch} onChange={e => setLibSearch(e.target.value)}
                        className="bg-transparent outline-none text-xs font-bold text-slate-700 flex-1"
                      />
                    </div>
                    <select
                      value={libCatFilter} onChange={e => setLibCatFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-400 text-slate-600"
                    >
                      <option value="">Barcha kategoriyalar</option>
                      {BOOK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Book Cards */}
                {filtered.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 border border-slate-200 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                      <FaBook size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-black text-sm">Hali kitoblar yo'q</p>
                    <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest mt-1">
                      {libTab === 'general' ? 'Umumiy kutubxona bo\'sh' : 'Ustozlar hali fayl yuklamagan'}
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map(book => (
                      <div key={book._id} className="bg-white rounded-[28px] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all group flex flex-col overflow-hidden">
                        {/* Top color bar */}
                        <div className={`h-2 w-full ${book.type === 'general' ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`} />
                        <div className="p-5 flex flex-col flex-1">
                          {/* Icon + badge */}
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${book.type === 'general' ? 'bg-indigo-50' : 'bg-emerald-50'}`}>
                              <FaFilePdf size={22} className={book.type === 'general' ? 'text-indigo-500' : 'text-emerald-500'} />
                            </div>
                            <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${book.type === 'general' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              {book.category}
                            </span>
                          </div>
                          {/* Info */}
                          <h3 className="font-black text-slate-800 text-sm tracking-tight line-clamp-2 mb-1">{book.title}</h3>
                          {book.author && <p className="text-[10px] font-bold text-slate-400 mb-2">✍️ {book.author}</p>}
                          {book.description && <p className="text-[10px] text-slate-400 font-bold line-clamp-2 mb-3">{book.description}</p>}
                          {book.uploadedBy && (
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3">
                              👤 {book.uploadedBy.name}
                            </p>
                          )}
                          <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 flex items-center gap-1">
                              <FaDownload size={9} /> {book.downloads || 0} marta
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleLibDownload(book)}
                                className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                                title="Yuklab olish"
                              >
                                <FaDownload size={11} />
                              </button>
                              <button
                                onClick={() => deleteLibBook(book._id)}
                                className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                title="O'chirish"
                              >
                                <FaTrash size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

        </main>
      </div>

      {/* === KITOB YUKLASH MODALI === */}
      {libModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaBook className="text-white" size={14} />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Kitob yuklash</h3>
              </div>
              <button onClick={() => setLibModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={uploadLibBook} className="space-y-4">
              {/* Type tabs */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                {[{ v:'general', l:'📚 Umumiy kutubxona' }, { v:'teacher', l:'👨‍🏫 Ustozlar bo\'limi' }].map(t => (
                  <button key={t.v} type="button" onClick={() => setLibForm({...libForm, type: t.v})}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${libForm.type === t.v ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-500'}`}>
                    {t.l}
                  </button>
                ))}
              </div>

              <input required type="text" placeholder="Kitob nomi *"
                value={libForm.title} onChange={e => setLibForm({...libForm, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-indigo-400 transition-all" />

              <input type="text" placeholder="Muallif"
                value={libForm.author} onChange={e => setLibForm({...libForm, author: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-indigo-400 transition-all" />

              <select value={libForm.category} onChange={e => setLibForm({...libForm, category: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-indigo-400 transition-all">
                {BOOK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <textarea placeholder="Tavsif (ixtiyoriy)" rows={2}
                value={libForm.description} onChange={e => setLibForm({...libForm, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-indigo-400 transition-all resize-none" />

              {/* File Upload */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
              {/* Toggle between file upload and URL */}
              <label className="flex items-center gap-2 text-sm font-black">
                <input type="checkbox" checked={libUseUrl} onChange={e => setLibUseUrl(e.target.checked)} className="accent-indigo-600" />
                URL orqali yuklash
              </label>
            </div>

            {libUseUrl ? (
              <input type="text" placeholder="Kitob URL (https://...)" value={libForm.url}
                onChange={e => setLibForm({ ...libForm, url: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-indigo-400 transition-all" />
            ) : (
              <label className={`flex flex-col items-center justify-center w-full py-8 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${libFile ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40'}`}>
                <FaFilePdf size={28} className={libFile ? 'text-indigo-500' : 'text-slate-300'} />
                <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-500">
                  {libFile ? libFile.name : 'PDF fayl tanlang'}
                </p>
                {libFile && <p className="text-[9px] text-slate-400 mt-1">{(libFile.size / 1024 / 1024).toFixed(2)} MB</p>}
                <input type="file" accept=".pdf" className="hidden" onChange={e => setLibFile(e.target.files[0] || null)} />
              </label>
            )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setLibModal(false)}
                  className="flex-1 py-3.5 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                  Bekor qilish
                </button>
                <button type="submit" disabled={libLoading}
                  className="flex-2 flex-grow-[2] py-3.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-60 disabled:cursor-not-allowed">
                  {libLoading ? 'Yuklanmoqda...' : '✅ Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Talent Detail Modal */}
      {talentModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-[48px] p-12 w-full max-w-2xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full translate-x-32 -translate-y-32 -z-10" />
                  <button onClick={() => setTalentModal(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-800 transition-all"><FaTimes size={24} /></button>
                  <div className="flex flex-col items-center text-center mb-10">
                      <div className="w-24 h-24 bg-slate-900 rounded-[32px] flex items-center justify-center text-white font-black text-3xl shadow-2xl mb-6">{talentModal.name[0]}</div>
                      <h3 className="text-3xl font-black text-slate-800 tracking-tight">{talentModal.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">AKADEMIK MUVAFFAQIYAT KARTASI</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center">
                          <span className="text-amber-600 font-black text-2xl">{talentModal.gpa}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">UMUMIY GPA</span>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center">
                          <span className="text-indigo-600 font-black text-2xl">{talentModal.classId?.name || '—'}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">O'QUVTCHI SINFI</span>
                      </div>
                  </div>
                  <div className="space-y-4">
                       <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2"><FaFileSignature className="text-amber-500" /> Olimpiadalar & Yutuqlar</h4>
                       <div className="flex flex-wrap gap-2">
                           {(talentModal.olympiads && talentModal.olympiads.length > 0) ? talentModal.olympiads.map(o => (
                               <span key={o} className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight border border-amber-100">{o}</span>
                           )) : <p className="text-xs text-slate-400 font-bold italic">Hozircha yutuqlar qayd etilmagan</p>}
                       </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">OLMAZOR ACADEMIC EXCELLENCE PROGRAM</p>
                  </div>
              </div>
          </div>
      )}

      {/* User Modal (Modernized) */}
      {userModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{editUser ? 'Ma\'lumotlarni tahrirlash' : 'Yangi foydalanuvchi'}</h3>
              <button onClick={() => setUserModal(false)} className="text-slate-400 hover:text-slate-800 transition-colors"><FaTimes size={20} /></button>
            </div>
            <form onSubmit={saveUser} className="space-y-5 custom-scrollbar overflow-y-auto max-h-[70vh] pr-2">
              <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                      {preview ? (
                          <img src={preview} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                          <FaUsers size={32} className="text-slate-300" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setSelectedFile(file);
                                setPreview(URL.createObjectURL(file));
                            }
                        }} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Rasm yuklash</p>
              </div>
              <input type="text" placeholder="Ism Familiya" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold text-sm" />
              <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Login" value={userForm.userName} onChange={e => setUserForm({ ...userForm, userName: e.target.value })} required={!editUser} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold text-sm" />
                  <input type="password" placeholder={editUser ? "••••••" : "Parol"} value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required={!editUser} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold text-sm">
                      <option value="student">O'quvchi</option>
                      <option value="teacher">O'qituvchi</option>
                      <option value="admin">Admin</option>
                  </select>
                  <input type="tel" placeholder="Telefon" value={userForm.phoneNumber} onChange={e => setUserForm({ ...userForm, phoneNumber: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold text-sm" />
              </div>
              <div className="space-y-2">
                  <input type="text" placeholder="Masalan: Matematika olimpiadasi, Sport ustasi" value={userForm.olympiads} onChange={e => setUserForm({ ...userForm, olympiads: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold text-sm" />
              </div>

              {userForm.role === 'teacher' && (
                  <div className="space-y-2">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mutaxassisligi (Fan)</p>
                       <select value={userForm.specialization} onChange={e => setUserForm({ ...userForm, specialization: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold text-sm">
                           <option value="">— Mutaxassislikni tanlang —</option>
                           {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                  </div>
              )}
              {userForm.role === 'student' && (
                 <select value={userForm.classId} onChange={e => setUserForm({ ...userForm, classId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold text-sm">
                    <option value="">— Sinf —</option>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                 </select>
              )}
                <button type="submit" className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-black transition mt-4">
                  {editUser ? 'Ma\'lumotlarni saqlash' : 'Akkauntni ochish'}
                </button>
                <button type="button" onClick={() => setUserModal(false)} className="w-full mt-2 text-slate-400 font-black text-[10px] uppercase tracking-widest py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition">
                  Orqaga
                </button>
            </form>
          </div>
        </div>
      )}

      {/* Class Modal Modernized */}
      {classModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl border border-slate-200">
            <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">{editClass ? 'Sinfni tahrirlash' : 'Yangi sinf ochish'}</h3>
            <form onSubmit={saveClass} className="space-y-5">
              <input type="text" placeholder="Sinf nomi" value={classForm.name} onChange={e => setClassForm({ ...classForm, name: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold text-sm" />
              <select value={classForm.teacherId} onChange={e => setClassForm({ ...classForm, teacherId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold text-sm">
                <option value="">— Sinf rahbari —</option>
                {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
              <button type="submit" className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-black transition mt-4">Saqlash</button>
              <button type="button" onClick={() => setClassModal(false)} className="w-full mt-2 text-slate-400 font-black text-[10px] uppercase tracking-widest py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition">Orqaga</button>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal Modernized */}
      {scheduleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl border border-slate-200 custom-scrollbar overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Dars qo'shish</h3>
                <button onClick={() => setScheduleModal(false)} className="text-slate-400 hover:text-red-500 transition-colors"><FaTimes size={20} /></button>
            </div>
            
            <form onSubmit={saveSchedule} className="space-y-5">
              {/* Sinf */}
              <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sinf (Majburiy)</p>
                  <select value={scheduleForm.classId} onChange={e => setScheduleForm({ ...scheduleForm, classId: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs md:text-sm font-bold outline-none focus:border-indigo-500 transition-all">
                    <option value="">— Sinfni tanlang —</option>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
              </div>

              {/* O'qituvchi */}
              <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">O'qituvchi (Majburiy)</p>
                  <select value={scheduleForm.teacherId} onChange={e => setScheduleForm({ ...scheduleForm, teacherId: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-indigo-500 transition-all">
                    <option value="">— O'qituvchini tanlang —</option>
                    {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
              </div>

              {/* Fan nomi */}
              <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Fan nomi (Majburiy)</p>
                  <input type="text" placeholder="Masalan: Matematika" value={scheduleForm.subjectName} onChange={e => setScheduleForm({ ...scheduleForm, subjectName: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-indigo-500 transition-all" />
              </div>

              {/* Hafta kuni */}
              <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Hafta kuni</p>
                  <select value={scheduleForm.dayOfWeek} onChange={e => setScheduleForm({ ...scheduleForm, dayOfWeek: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-indigo-500 transition-all">
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
              </div>

              {/* Chorak (Auto) */}
              <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Chorak (Avtomatik)</p>
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2 text-xs md:text-sm font-bold text-slate-500 cursor-not-allowed">
                    {scheduleForm.quarter}-chorak
                  </div>
              </div>

              {/* Dars raqami & Vaqt */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Dars raqami</p>
                      <select value={scheduleForm.lessonNumber} onChange={e => setScheduleForm({ ...scheduleForm, lessonNumber: parseInt(e.target.value) })} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-indigo-500 transition-all">
                        {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n}-dars</option>)}
                      </select>
                  </div>
                  <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Vaqt (Avto)</p>
                      <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-xs text-slate-500 cursor-not-allowed flex items-center justify-center">
                        {scheduleForm.startTime} – {scheduleForm.endTime}
                      </div>
                  </div>
              </div>

              {/* Xona */}
              <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Xona</p>
                  <select value={scheduleForm.room} onChange={e => setScheduleForm({ ...scheduleForm, room: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-indigo-500 transition-all">
                    <option value="">— Xonani tanlang —</option>
                    {ROOMS.map(r => <option key={r} value={r}>{r}-xona</option>)}
                  </select>
              </div>

              {/* Clash Warning */}
              {isScheduleClash() && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-tight text-center">
                        ⚠️ Bu xona shu kun va shu dars vaqtida band! Boshqa xonani tanlang.
                    </p>
                </div>
              )}

              <div className="pt-4 space-y-3">
                  <button type="submit" disabled={isScheduleClash()} className={`w-full py-5 rounded-[20px] font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all duration-300 ${isScheduleClash() ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-black active:scale-[0.98]'}`}>Saqlash</button>
                  <button type="button" onClick={() => setScheduleModal(false)} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-all">Orqaga</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Details Modal */}
      {classDetailsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in" onClick={() => setClassDetailsModal(null)}>
          <div className="bg-white rounded-[40px] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                <FaSchool className="text-indigo-600" /> {classDetailsModal.name} - Sinf o'quvchilari
              </h2>
              <button onClick={() => setClassDetailsModal(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <div className="mb-6 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sinf rahbari:</span>
                  <span className="text-sm font-black text-indigo-700">{classDetailsModal.teacherId?.name || 'Biriktirilmagan'}</span>
              </div>
              
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">O'quvchilar ro'yxati ({classDetailsModal.studentIds?.length || 0} ta)</h3>
              
              {classDetailsModal.studentIds && classDetailsModal.studentIds.length > 0 ? (
                <div className="space-y-3">
                  {classDetailsModal.studentIds.map((student, idx) => (
                    <div key={student._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 font-black text-sm flex items-center justify-center">{idx + 1}</div>
                          <div>
                              <p className="text-sm font-bold text-slate-800">{student.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">📞 {student.phoneNumber || 'Kiritilmagan'} • ID: {student.userName}</p>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm"><FaUsers size={24} /></div>
                   <p className="text-sm font-bold text-slate-500">Bu sinfda hozircha o'quvchilar yo'q.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
