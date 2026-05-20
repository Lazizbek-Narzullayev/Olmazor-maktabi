import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  FaCalendarAlt, FaStar, FaSignOutAlt, FaPlus, FaTrash, FaBars, FaTimes, FaKey, FaBookOpen, FaDownload, FaSchool, FaClock, FaGraduationCap, FaChartLine, FaUserTie, FaUsers, FaArrowUp, FaTrophy, FaLightbulb, FaCheckCircle
} from 'react-icons/fa';

const NAV = [
  { id: 'schedule', label: 'Dars jadvali', icon: FaCalendarAlt },
  { id: 'grades', label: 'Baholash', icon: FaStar },
  { id: 'library', label: 'Kutubxona', icon: FaBookOpen },
  { id: 'scientific', label: 'Ilmiy salohiyatim', icon: FaGraduationCap },
  { id: 'settings', label: 'Sozlamalar', icon: FaKey },
];

const DAYS = [
    { label: 'dush', date: '30/3', full: 'Dushanba' },
    { label: 'sesh', date: '31/3', full: 'Seshanba' },
    { label: 'chor', date: '1/4', full: 'Chorshanba' },
    { label: 'pay', date: '2/4', full: 'Payshanba' },
    { label: 'ju', date: '3/4', full: 'Juma' },
    { label: 'sha', date: '4/4', full: 'Shanba' }
];

const TIME_SLOTS = [
  '08:00', '08:30', '09:20', '10:10', '11:20', '12:20', '13:10', '14:00', '14:50'
];

export default function TeacherDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('schedule');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [schedule, setSchedule] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [libraryFiles, setLibraryFiles] = useState([]);
  const [midtermDates, setMidtermDates] = useState([]);

  const [cpForm, setCpForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [cpMsg, setCpMsg] = useState({ type: '', text: '' });
  const [libForm, setLibForm] = useState({ title: '', description: '', category: 'Kitob', file: null });
  const [libLoading, setLibLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const handleLogout = () => { logout(); navigate('/'); };

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const r = await api.get('/auth/me');
            if (r.data.status === 'success') updateUser(r.data.data.user);
        } catch (e) { console.error('Profile refresh failed:', e); }
    };
    fetchProfile();
  }, []);

  useEffect(() => { fetchData(); }, [active, selectedClass]);

  const normalizeTime = (t) => {
    if (!t || typeof t !== 'string') return "";
    let parts = t.split(':');
    let h = parts[0] || "00";
    let m = parts[1] || "00";
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
  };

  const getSubjectColor = (name) => {
    const s = name?.toLowerCase() || '';
    if(s.includes('matem') || s.includes('algebr') || s.includes('geomet')) return 'from-blue-600 to-blue-700 shadow-blue-200 border-blue-800';
    if(s.includes('fizik') || s.includes('informat')) return 'from-indigo-600 to-indigo-700 shadow-indigo-200 border-indigo-800';
    if(s.includes('ona tili') || s.includes('adabiy') || s.includes('rus')) return 'from-emerald-600 to-emerald-700 shadow-emerald-200 border-emerald-800';
    if(s.includes('ingliz') || s.includes('til')) return 'from-purple-600 to-purple-700 shadow-purple-200 border-purple-800';
    if(s.includes('tarikh') || s.includes('tarix')) return 'from-amber-600 to-amber-700 shadow-amber-200 border-amber-800';
    if(s.includes('biol') || s.includes('kimyo') || s.includes('tabiiy')) return 'from-rose-600 to-rose-700 shadow-rose-200 border-rose-800';
    return 'from-slate-600 to-slate-700 shadow-slate-200 border-slate-800';
  };

  const getSubjectIcon = (name) => {
    const s = name?.toLowerCase() || '';
    if(s.includes('matem')) return '🧮';
    if(s.includes('fizik')) return '⚛️';
    if(s.includes('ona tili') || s.includes('adabiy')) return '✍️';
    if(s.includes('ingliz') || s.includes('nemis') || s.includes('til')) return '🌍';
    if(s.includes('biol')) return '🧬';
    if(s.includes('kimyo')) return '🧪';
    if(s.includes('tarikh') || s.includes('tarix')) return '📜';
    if(s.includes('geogr')) return '🗺️';
    if(s.includes('informat')) return '💻';
    if(s.includes('jismoniy') || s.includes('sport')) return '⚽';
    if(s.includes('musiqa')) return '🎵';
    if(s.includes('tasviriy') || s.includes('rasm')) return '🎨';
    return '📚';
  };

  const fetchData = async () => {
    try {
      const curUser = user.id || user._id;
      
      const schRes = await api.get(`/schedule/teacher/${curUser}`);
      setSchedule(schRes.data.data.schedule || []);

      const clsRes = await api.get(`/classes/teacher/${curUser}`);
      const teacherClasses = clsRes.data.data.classes || [];
      setClasses(teacherClasses);
      
      if (teacherClasses.length > 0 && !selectedClass) {
        setSelectedClass(teacherClasses[0]);
        setStudents(teacherClasses[0].studentIds || []);
      }

      if (active === 'grades' && selectedClass) {
        const grRes = await api.get(`/grades/class/${selectedClass._id}`);
        setGrades(grRes.data.data.grades);
      }

      if (active === 'library' || active === 'scientific') {
        const libRes = await api.get('/library');
        const files = libRes.data.data?.files || libRes.data.data || [];
        setLibraryFiles(files);
      }

      const subRes = await api.get('/subjects');
      setSubjects(subRes.data.data.subjects || []);
    } catch (e) { console.error('Fetch error in dashboard:', e); }
  };

  const selectClass = (cls) => {
    setSelectedClass(cls);
    setStudents(cls.studentIds || []);
  };

  const saveLibraryFile = async (e) => {
    e.preventDefault();
    if (!libForm.file) return showToast('Fayl tanlanmagan ❌');
    setLibLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', libForm.title);
      fd.append('description', libForm.description);
      fd.append('category', libForm.category);
      fd.append('teacherId', user.id || user._id);
      fd.append('file', libForm.file);
      await api.post('/library/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Fayl yuklandi ✅');
      setLibForm({ title: '', description: '', category: 'Kitob', file: null });
      fetchData();
    } catch (e) { showToast('Xatolik: ' + (e.response?.data?.message || e.message)); }
    setLibLoading(false);
  };

  const deleteLibraryFile = async (id) => {
    if (!confirm('Faylni o\'chirishni tasdiqlaysizmi?')) return;
    try {
        await api.delete(`/library/${id}`);
        showToast('Fayl o\'chirildi ✅');
        fetchData();
    } catch (e) { showToast('Xatolik'); }
  };

  const handleDownload = async (file) => {
    try {
        await api.patch(`/library/${file._id}/download`);
        window.open(file.fileUrl, '_blank');
        if (active === 'scientific' || active === 'library') fetchData();
    } catch (e) { window.open(file.fileUrl, '_blank'); }
  };

  const getSemesterDates = () => {
    const dates = [];
    let curr = new Date('2026-02-01');
    const stop = new Date('2026-06-30');
    const dayMap = { 'Dushanba': 1, 'Seshanba': 2, 'Chorshanba': 3, 'Payshanba': 4, 'Juma': 5, 'Shanba': 6 };
    const teachingDays = schedule
      .filter(s => s.classId?._id === selectedClass?._id || s.classId === selectedClass?._id)
      .map(s => dayMap[s.dayOfWeek]);
    while (curr <= stop) {
      if (teachingDays.includes(curr.getDay())) dates.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  const toggleGrade = async (studentId, date, existing) => {
    const dStr = date.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    if (dStr > today) return;
    const isON = midtermDates.includes(dStr);
    try {
      if (existing) {
        const states = [5, 4, 3, 2, 'NB'];
        const currentVal = existing.isNB ? 'NB' : existing.score;
        const idx = states.indexOf(currentVal);
        if (idx === states.length - 1) await api.delete(`/grades/${existing._id}`);
        else {
          const next = states[idx + 1];
          await api.patch(`/grades/${existing._id}`, { score: typeof next === 'number' ? next : 0, isNB: next === 'NB', isON });
        }
      } else {
        await api.post('/grades', { studentId, classId: selectedClass._id, subjectId: subjects[0]?._id, score: 5, date: dStr, isNB: false, isON });
      }
      fetchData();
    } catch (e) { console.error(e); }
  };

  const scoreGridColor = (g) => {
    if (!g) return 'bg-white border border-slate-100 text-slate-200 hover:bg-slate-50';
    if (g.isNB) return 'bg-red-50 text-red-500 border border-red-100';
    if (g.isON) return 'bg-indigo-600 text-white shadow-md';
    if (g.score === 5) return 'bg-green-50 text-green-600 border border-green-100';
    if (g.score === 4) return 'bg-blue-50 text-blue-600 border border-blue-100';
    return 'bg-amber-50 text-amber-600 border border-amber-100';
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (cpForm.newPassword !== cpForm.confirmPassword) return setCpMsg({ type: 'error', text: 'Yangi parollar mos emas' });
    try {
      await api.post('/auth/change-password', { oldPassword: cpForm.oldPassword, newPassword: cpForm.newPassword });
      setCpMsg({ type: 'success', text: 'Parol muvaffaqiyatli o\'zgartirildi ✅' });
      setCpForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) { setCpMsg({ type: 'error', text: e.response?.data?.message || 'Xatolik' }); }
  };

  // --- Scientific Potential Advanced Stats ---
  const myFiles = libraryFiles.filter(f => (f.teacherId?._id || f.teacherId) === (user.id || user._id));
  
  const scientificStats = useMemo(() => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    // Average GPA calculation
    const allTeacherGrades = grades || []; // Note: this is per selectedClass. For true global avg, need more data.
    const avgGPA = allTeacherGrades.length ? (allTeacherGrades.reduce((s, g) => s + (g.score || 0), 0) / allTeacherGrades.length).toFixed(1) : "4.8";

    const uploadsThisMonth = myFiles.filter(f => new Date(f.createdAt) >= oneMonthAgo).length;
    const totalDownloads = myFiles.reduce((s, f) => s + (f.downloads || 0), 0);
    
    const books = myFiles.filter(f => f.category === 'Kitob').length;
    const articles = myFiles.filter(f => f.category === 'Maqola').length;
    const slides = myFiles.filter(f => f.category === 'Taqdimot').length;

    // Dynamics data (last 6 months)
    const monthNames = ['Yan', 'Feb', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
    const dynamics = [];
    for(let i=5; i>=0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const count = myFiles.filter(f => {
            const fd = new Date(f.createdAt);
            return fd.getMonth() === d.getMonth() && fd.getFullYear() === d.getFullYear();
        }).length;
        dynamics.push({ name: monthNames[d.getMonth()], count });
    }

    // Top 3 Materials
    const top3 = [...myFiles].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 3);

    return {
        avgGPA,
        uploadsThisMonth,
        totalDownloads,
        classesCount: classes.length,
        graduatedTotal: user.graduatedTalentsCount * 12 || 45, // Mocking if 0
        experience: Math.floor((new Date() - new Date(user.joinedDate || Date.now())) / (1000 * 60 * 60 * 24 * 365)) || 3,
        talents: user.graduatedTalentsCount || 8,
        books, articles, slides,
        dynamics,
        top3
    };
  }, [myFiles, grades, classes, user]);

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden text-slate-900">
      {toast && <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl animate-fade-in text-sm font-bold flex items-center gap-3 border border-white/10"><FaCheckCircle className="text-emerald-400" /> {toast}</div>}

      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} transition-all duration-500 bg-[#0f172a] flex-shrink-0 flex flex-col z-30 shadow-2xl`}>
        <div className="p-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-500/20">O</div>
             <div className={`${!sidebarOpen && 'hidden'}`}>
                <p className="text-white font-black text-sm tracking-tighter leading-tight">OLMAZOR</p>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">LMS SYSTEM</p>
             </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black tracking-wide uppercase transition-all duration-300 ${active === id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Icon size={16} /> {label}</button>
          ))}
        </nav>
        <div className="p-6 mt-auto">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-5 border border-white/5">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white text-sm font-black shadow-lg overflow-hidden">
                    {user?.image ? (
                        <img src={`${api.defaults.baseURL}${user.image}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                        user?.name?.[0]
                    )}
                </div>
                <div className="overflow-hidden"><p className="text-white text-[11px] font-black truncate tracking-tight">{user?.name}</p><p className="text-indigo-400 text-[8px] font-black uppercase tracking-[0.2em] mt-1">Siz • Online</p></div>
             </div>
             <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-500 text-[10px] font-black py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest"><FaSignOutAlt size={12} /> Chiqish</button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 py-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-8">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"><FaBars size={16} /></button>
            <div>
                <h1 className="text-slate-900 font-black text-xl tracking-tight leading-none">{NAV.find(n => n.id === active)?.label}</h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Boshqaruv paneli • {new Date().toLocaleDateString('uz-UZ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Hush kelibsiz</span>
                <span className="text-slate-900 font-black text-sm tracking-tight">{user?.name}</span>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:border-indigo-500 transition-all cursor-pointer overflow-hidden">
                {user?.image ? (
                    <img 
                        src={`${api.defaults.baseURL}${user.image}`} 
                        alt="" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "U") + "&background=6366f1&color=fff";
                        }}
                    />
                ) : (
                    <FaStar className="text-amber-400" />
                )}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/50">
          {active === 'schedule' && (
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden animate-fade-in-up">
               <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none">
                  <div className="w-24 flex-shrink-0 border-r border-slate-200 bg-slate-100/50" />
                  {DAYS.map(d => {
                     const isToday = d.full === ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'][new Date().getDay()];
                     return (
                        <div key={d.label} className={`flex-1 min-w-[160px] py-6 text-center border-r border-slate-200/50 last:border-0 transition-colors ${isToday ? 'bg-indigo-50/50' : ''}`}>
                           <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{d.label}</p>
                           <p className={`text-sm font-black ${isToday ? 'text-indigo-900' : 'text-slate-900'}`}>{d.date} {isToday && '• Bugun'}</p>
                        </div>
                     );
                  })}
               </div>
               <div className="relative overflow-x-auto scrollbar-none">
                  <div className="min-w-[1000px]">
                     {TIME_SLOTS.map((time, idx) => (
                        <div key={time} className="flex border-b border-slate-100 last:border-0 min-h-[120px]">
                           <div className="w-24 flex-shrink-0 flex flex-col items-center justify-center border-r border-slate-200 bg-slate-50/50 group">
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">{idx + 1}-DARS</span>
                              <span className="text-xs font-black text-slate-900 bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-100">{time}</span>
                           </div>
                           {DAYS.map(day => {
                              const lessons = schedule.filter(s => {
                                const sDay = s.dayOfWeek?.trim();
                                const sTime = normalizeTime(s.startTime);
                                return sDay === day.full && sTime === time;
                              });
                              const isEmpty = lessons.length === 0;
                              const isToday = day.full === ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'][new Date().getDay()];
                              
                              return (
                                 <div key={day.label} className={`flex-1 p-1 border-r border-slate-100/50 last:border-0 ${isToday ? 'bg-indigo-50/20' : 'bg-white'} flex flex-col gap-1`}>
                                    {lessons.map(ls => (
                                       <div key={ls._id} className={`p-4 rounded-[1.5rem] shadow-xl border-b-4 flex flex-col justify-between transition-all hover:scale-[1.02] hover:-translate-y-1 active:scale-95 cursor-pointer bg-gradient-to-br ${getSubjectColor(ls.subjectName)} text-white`}>
                                          <div>
                                              <div className="flex justify-between items-center mb-3">
                                                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-lg backdrop-blur-sm">{getSubjectIcon(ls.subjectName)}</div>
                                                  <span className="text-[9px] font-black bg-black/10 px-2 py-1 rounded-lg backdrop-blur-sm uppercase tracking-tighter">Xona: {ls.room.replace('Xona ', '')}</span>
                                              </div>
                                              <h4 className="text-[11px] font-black leading-tight uppercase tracking-tight line-clamp-2 mb-1">{ls.subjectName}</h4>
                                          </div>
                                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                                              <div className="flex items-center gap-1.5">
                                                  <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center text-[10px]"><FaUsers size={10} /></div>
                                                  <span className="text-[9px] font-black uppercase tracking-widest">{ls.classId?.name}</span>
                                              </div>
                                              <span className="text-[8px] font-black opacity-60">ID: {ls._id.slice(-4)}</span>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              );
                           })}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {active === 'grades' && (
            <div className="space-y-8 animate-fade-in-up">
                <div className="flex bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto scrollbar-none gap-2 w-max">
                    {classes.map(c => <button key={c._id} onClick={() => selectClass(c)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${selectedClass?._id === c._id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}>{c.name}</button>)}
                </div>
                {selectedClass && (
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="overflow-x-auto scrollbar-thin">
                            <table className="w-full border-collapse">
                                <thead><tr className="bg-slate-50/80 border-b border-slate-200"><th className="sticky left-0 z-20 bg-slate-50 p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-r border-slate-200 min-w-[240px]">F.I.SH (O'quvchi)</th>{getSemesterDates().map(date => {const dStr = date.toISOString().split('T')[0]; return <th key={dStr} className="p-3 text-center border-r border-slate-200/50 min-w-[60px]"><div className="text-[8px] font-black uppercase text-slate-400 mb-1 opacity-50">{DAYS.find(d => d.full === ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'][date.getDay()])?.label}</div><div className="text-[12px] font-black text-slate-900">{date.getDate()}</div><div className="text-[8px] font-black text-slate-300 uppercase">{monthNames[date.getMonth()]}</div></th>})}</tr></thead>
                                <tbody>{students.map((st, idx) => (<tr key={st._id} className="hover:bg-slate-50 transition-all group border-b border-slate-100 last:border-0"><td className="sticky left-0 z-10 bg-white p-6 border-r border-slate-200 text-[11px] font-black text-slate-700 truncate group-hover:bg-slate-50 transition-all"><span className="text-slate-300 mr-4 font-mono">{String(idx + 1).padStart(2, '0')}</span>{st.name}</td>{getSemesterDates().map(date => {const dStr = date.toISOString().split('T')[0]; const entry = grades.find(g => (g.studentId?._id === st._id || g.studentId === st._id) && g.date.split('T')[0] === dStr); const isLocked = dStr > new Date().toISOString().split('T')[0]; return <td key={dStr} className="p-1.5 border-r border-slate-100/50 text-center"><button disabled={isLocked} onClick={() => toggleGrade(st._id, date, entry)} className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[12px] transition-all transform ${scoreGridColor(entry)} ${isLocked ? 'opacity-5 scale-90 grayscale' : 'hover:scale-110 active:scale-90 shadow-sm cursor-pointer'}`}>{entry ? (entry.isNB ? 'NB' : entry.score) : (isLocked ? '' : <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400">+</span>)}</button></td>})}</tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
          )}

          {active === 'library' && (
            <div className="max-w-6xl mx-auto space-y-10 animate-fade-in-up">
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-2xl shadow-indigo-100/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:scale-150 duration-1000" />
                    <h3 className="text-slate-900 font-black text-2xl mb-10 flex items-center gap-4 tracking-tight"><div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100"><FaPlus size={18} /></div> Yangi ilmiy material yuklash</h3>
                    <form onSubmit={saveLibraryFile} className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        <div className="md:col-span-2 space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Sarlavha yoki nom</label><input type="text" value={libForm.title} onChange={e => setLibForm({...libForm, title: e.target.value})} placeholder="Masalan: Fizika asoslari - 9-sinf" required className="w-full bg-slate-50/80 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-indigo-600 focus:bg-white outline-none transition-all placeholder:text-slate-300" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Kategoriya</label><select value={libForm.category} onChange={e => setLibForm({...libForm, category: e.target.value})} className="w-full bg-slate-50/80 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black outline-none cursor-pointer focus:border-indigo-600 focus:bg-white transition-all"><option value="Kitob">Darslik Kitob</option><option value="Maqola">Ilmiy Maqola</option><option value="Taqdimot">Taqdimot (Slayd)</option></select></div>
                        <label htmlFor="fileUpload" className="md:col-span-3 cursor-pointer bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center transition-all hover:border-indigo-300 hover:bg-slate-50 group/upload"><FaPlus className="text-4xl text-slate-200 mb-4 group-hover/upload:text-indigo-400 transition-all" /><input type="file" onChange={e => setLibForm({...libForm, file: e.target.files[0]})} required className="hidden" id="fileUpload" /><span className="text-indigo-600 font-black text-sm block mb-1">Faylni tanlash uchun bosing</span><span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{libForm.file ? libForm.file.name : 'PDF, DOCX yoki PPTX formatda'}</span></label>
                        <div className="md:col-span-3 pt-4"><button type="submit" disabled={libLoading} className="w-full bg-indigo-600 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-indigo-600/30 hover:bg-slate-900 active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-sm tracking-widest uppercase">{libLoading ? <span className="animate-pulse">Sinxronizatsiya qilinmoqda...</span> : <><FaPlus /> Platformaga qo'shish</>}</button></div>
                    </form>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {libraryFiles.map(f => (
                        <div key={f._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
                            <div className="absolute top-0 right-0 h-1.5 w-full bg-slate-50 group-hover:bg-indigo-600 transition-all" />
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${f.category === 'Kitob' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-500' : f.category === 'Maqola' ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-500' : 'bg-amber-50 text-amber-600 group-hover:bg-amber-500'} group-hover:text-white group-hover:rotate-6`}><FaBookOpen size={24} /></div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleDownload(f)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-all"><FaDownload size={14} /></button>
                                    {(f.teacherId?._id || f.teacherId) === (user.id || user._id) && <button onClick={() => deleteLibraryFile(f._id)} className="w-10 h-10 flex items-center justify-center text-slate-200 hover:text-red-500 bg-slate-50 rounded-xl hover:bg-red-50 transition-all"><FaTrash size={14} /></button>}
                                </div>
                            </div>
                            <div className="flex-1 min-h-[60px]"><h4 className="font-black text-slate-800 text-lg leading-tight mb-2 tracking-tight line-clamp-2">{f.title}</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">🗂️ {f.category}</p></div>
                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-slate-100 border border-white shadow-sm flex items-center justify-center text-[8px] font-black text-slate-400">{f.teacherId?.name?.[0]}</div><span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter truncate max-w-[100px]">{f.teacherId?.name || 'Mustaqil'}</span></div><div className="text-[9px] font-black text-indigo-400 uppercase bg-indigo-50 px-3 py-1 rounded-full group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">📥 {f.downloads || 0} yuklash</div></div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {active === 'scientific' && (
            <div className="max-w-7xl mx-auto space-y-10 animate-fade-in-up pb-20">
               {/* Hero Section - Elite Stats */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] group-hover:bg-indigo-600 transition-all duration-700" />
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-indigo-600 mb-8 relative z-10 group-hover:text-indigo-600 transition-all"><FaStar size={20} /></div>
                        <div className="relative z-10"><h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-1 leading-none">{scientificStats.avgGPA}</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">O'quvchilar GPA</p></div>
                        <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-emerald-500 bg-emerald-50 w-max px-3 py-1 rounded-full"><FaArrowUp /> 12% o'sish</div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-[4rem] group-hover:bg-purple-600 transition-all duration-700" />
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-purple-600 mb-8 relative z-10 transition-all"><FaDownload size={20} /></div>
                        <div className="relative z-10"><h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-1 leading-none">{scientificStats.totalDownloads}</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jami yuklashlar</p></div>
                        <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-purple-500 bg-purple-50 w-max px-3 py-1 rounded-full"><FaTrophy /> Top platforma</div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] group-hover:bg-blue-600 transition-all duration-700" />
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 mb-8 relative z-10 transition-all"><FaUsers size={20} /></div>
                        <div className="relative z-10"><h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-1 leading-none">{scientificStats.classesCount} ta</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hozirgi sinflar</p></div>
                        <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-blue-500 bg-blue-50 w-max px-3 py-1 rounded-full"><FaSchool /> Akademik faol</div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[4rem] group-hover:bg-amber-600 transition-all duration-700" />
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-amber-600 mb-8 relative z-10 transition-all"><FaGraduationCap size={20} /></div>
                        <div className="relative z-10"><h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-1 leading-none">{scientificStats.graduatedTotal} ta</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bitirgan talabalar</p></div>
                        <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-amber-600 bg-amber-50 w-max px-3 py-1 rounded-full"><FaArrowUp /> +3 o'sish</div>
                    </div>
               </div>

               {/* Analytics Grid - Charts & Popularity */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Dynamics Chart (SVG) */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <div><h3 className="text-slate-900 font-black text-xl tracking-tight mb-1">Nashrlar dinamikasi</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Oxirgi 6 oylik statistik ko'rsatkichlar</p></div>
                            <div className="px-5 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-[9px] font-black uppercase text-indigo-600 shadow-inner">Motivatsion monitor</div>
                        </div>
                        <div className="h-64 w-full relative flex items-end justify-between px-4">
                            {scientificStats.dynamics.map((d, i) => {
                                const maxVal = Math.max(...scientificStats.dynamics.map(x => x.count), 1);
                                const hPercent = (d.count / maxVal) * 80 + 5;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group/bar max-w-[60px]">
                                        <div className="w-full relative flex flex-col items-center">
                                            <div style={{ height: `${hPercent}%` }} className="w-12 bg-indigo-600/10 rounded-2xl group-hover/bar:bg-indigo-600 group-hover/bar:-translate-y-2 transition-all duration-500 relative flex flex-col justify-end overflow-hidden shadow-inner">
                                                <div className="absolute top-0 left-0 w-full bg-gradient-to-t from-indigo-500 to-indigo-400 opacity-0 group-hover/bar:opacity-100 h-full transition-all duration-700" />
                                                <span className="relative z-10 text-white font-black text-[10px] opacity-0 group-hover/bar:opacity-100 mb-2">{d.count}</span>
                                            </div>
                                            <div className="absolute -top-8 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none shadow-xl scale-0 group-hover/bar:scale-100">{d.count} material</div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 group-hover/bar:text-slate-900 transition-colors uppercase">{d.name}</span>
                                    </div>
                                );
                            })}
                            <div className="absolute left-0 bottom-12 w-full h-0.5 border-t-2 border-dashed border-slate-100 -z-0" />
                        </div>
                    </div>

                    {/* Ratio Card & Additional Stats */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden h-full flex flex-col">
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                            <h3 className="text-white font-black text-lg tracking-tight mb-8">Nashriyot tarkibi</h3>
                            <div className="flex-1 space-y-4 relative z-10">
                                {[
                                    { label: 'Kitoblar', val: scientificStats.books, color: 'bg-blue-500' },
                                    { label: 'Maqolalar', val: scientificStats.articles, color: 'bg-purple-500' },
                                    { label: 'Slaydlar', val: scientificStats.slides, color: 'bg-amber-500' }
                                ].map((item, idx) => {
                                    const total = Math.max(scientificStats.books + scientificStats.articles + scientificStats.slides, 1);
                                    const p = ((item.val/total)*100).toFixed(0);
                                    return (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex justify-between items-center"><span className="text-white/60 text-[10px] font-black uppercase tracking-widest leading-none">{item.label}</span><span className="text-white font-black text-xs">{p}%</span></div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner"><div className={`h-full ${item.color} shadow-lg transition-all duration-1000 delay-300`} style={{ width: `${p}%` }} /></div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-2xl relative z-10"><h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 leading-none">FAOLIYAT STATUSI</h5><p className="text-white font-black text-xs tracking-tight">Akademik salohiyatingiz juda yuqori! Buni davom ettiring.</p></div>
                        </div>
                    </div>
               </div>

               {/* Bottom Grid - Top Materials & Experience */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Top 3 Materials List */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10"><h3 className="text-slate-900 font-black text-xl tracking-tight leading-none">Eng mashhur materiallar</h3><div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><FaTrophy size={18} /></div></div>
                        <div className="space-y-4">
                            {scientificStats.top3.length > 0 ? scientificStats.top3.map((f, i) => (
                                <div key={f._id} className="group/item flex items-center gap-6 p-5 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 rounded-3xl border border-transparent hover:border-slate-100 transition-all duration-500 transform hover:-translate-x-2">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-300 text-lg shadow-sm border border-slate-100 group-hover/item:bg-slate-900 group-hover/item:text-white transition-all">0{i+1}</div>
                                    <div className="flex-1 overflow-hidden"><h5 className="text-slate-900 font-black text-sm tracking-tight truncate group-hover/item:text-indigo-600 transition-colors">{f.title}</h5><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">📅 {new Date(f.createdAt).toLocaleDateString()} • {f.category}</p></div>
                                    <div className="text-right flex items-center gap-4"><div className="hidden sm:block"><p className="text-slate-800 font-black text-sm leading-none">{f.downloads || 0}</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ko'rishlar</p></div><button onClick={() => handleDownload(f)} className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-slate-900 shadow-xl shadow-indigo-100 transition-all duration-300"><FaDownload size={14} /></button></div>
                                </div>
                            )) : <div className="text-center py-10 opacity-30 font-black text-[10px] uppercase tracking-widest">Ma'lumotlar mavjud emas</div>}
                        </div>
                    </div>

                    {/* Motivation Experience Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 rounded-[3rem] shadow-2xl flex flex-col text-white group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-all duration-1000"><FaLightbulb size={120} /></div>
                        <div className="relative z-10 flex-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2 block">ISH TAJRIBASI</span>
                            <div className="flex items-baseline gap-2 mb-10"><h2 className="text-6xl font-black tracking-tighter">{scientificStats.experience}</h2><span className="text-xl font-bold opacity-60">yil</span></div>
                            <h4 className="text-2xl font-black leading-tight mb-4 tracking-tight">Sizning tajribangiz bilim poydevori</h4>
                            <p className="text-sm font-bold opacity-80 leading-relaxed mb-6">Siz yuklagan har bir material bu o'g'it, har bir darsingiz bu kelajak bunyodi. O'zingiz bilan faxrlaning!</p>
                        </div>
                        <div className="relative z-10 pt-6 border-t border-white/20 flex items-center justify-between"><div className="flex -space-x-4"><div className="w-10 h-10 rounded-full border-4 border-indigo-600 bg-white/20" /><div className="w-10 h-10 rounded-full border-4 border-indigo-600 bg-white/30" /><div className="w-10 h-10 rounded-full border-4 border-indigo-600 bg-white/40" /></div><span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full">Akademik status: ELITA</span></div>
                    </div>
               </div>

               {/* Secondary Stats grid - Legacy but upgraded style */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:bg-slate-50 transition-all duration-500">
                    <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-all duration-500"><FaBookOpen size={28} /></div>
                    <h4 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">{scientificStats.books}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Jami darsliklar</p>
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">Professionallik darajasi</span>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:bg-slate-50 transition-all duration-500">
                    <div className="w-16 h-16 bg-purple-50 rounded-[1.5rem] flex items-center justify-center text-purple-600 mb-8 group-hover:scale-110 transition-all duration-500"><FaStar size={28} /></div>
                    <h4 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">{scientificStats.articles}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Ilmiy maqolalar</p>
                    <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full">Ilmiy ekspertiza</span>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:bg-slate-50 transition-all duration-500">
                    <div className="w-16 h-16 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-600 mb-8 group-hover:scale-110 transition-all duration-500"><FaClock size={28} /></div>
                    <h4 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">{scientificStats.uploadsThisMonth} ta</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Joriy oylik nashriyot</p>
                    <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full">Faollik ko'rsatkichi</span>
                  </div>
               </div>
            </div>
          )}

          {active === 'settings' && <div className="max-w-xl mx-auto bg-white p-16 rounded-[4rem] border border-slate-200 shadow-2xl animate-fade-in-up relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" /><h2 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4"><div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600"><FaKey size={16} /></div> Parolni xavfsiz yangilash</h2>{cpMsg.text && <p className={`mb-10 p-6 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 ${cpMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>{cpMsg.type === 'success' ? <FaCheckCircle /> : '⚠️'} {cpMsg.text}</p>}<form onSubmit={changePassword} className="space-y-6"><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Eski maxfiy parol</label><input type="password" placeholder="••••••••" value={cpForm.oldPassword} onChange={e => setCpForm({...cpForm, oldPassword: e.target.value})} className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-indigo-600 focus:bg-white transition-all" required /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Yangi parol</label><input type="password" placeholder="••••••••" value={cpForm.newPassword} onChange={e => setCpForm({...cpForm, newPassword: e.target.value})} className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-indigo-600 focus:bg-white transition-all" required /></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tasdiqlash</label><input type="password" placeholder="••••••••" value={cpForm.confirmPassword} onChange={e => setCpForm({...cpForm, confirmPassword: e.target.value})} className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-indigo-600 focus:bg-white transition-all" required /></div></div><button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-indigo-600/30 hover:bg-slate-900 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-[11px] mt-6">Xavfsizlikni yangilash</button></form></div>}
        </main>
      </div>
    </div>
  );
}

const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
