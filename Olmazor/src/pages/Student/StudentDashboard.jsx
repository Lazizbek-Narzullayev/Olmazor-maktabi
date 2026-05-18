import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  FaStar, FaCalendarAlt, FaSignOutAlt, FaBars, FaTimes, FaKey, FaBookOpen, FaDownload, FaGraduationCap, FaChartBar, FaFileAlt, FaDesktop, FaUserTie
} from 'react-icons/fa';

const NAV = [
  { id: 'grades', label: 'Baholarim', icon: FaStar },
  { id: 'schedule', label: 'Dars jadvali', icon: FaCalendarAlt },
  { id: 'library', label: 'Kutubxona', icon: FaBookOpen },
  { id: 'personalPlan', label: 'Shaxsiy reja', icon: FaChartBar },
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

export default function StudentDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('grades');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [libCategory, setLibCategory] = useState('Barchasi');

  const [grades, setGrades] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [libraryFiles, setLibraryFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [cpForm, setCpForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [cpMsg, setCpMsg] = useState({ type: '', text: '' });

  const handleLogout = () => { logout(); navigate('/'); };

  useEffect(() => {
    // Sync profile on mount
    const fetchProfile = async () => {
        try {
            const r = await api.get('/auth/me');
            if (r.data.status === 'success') updateUser(r.data.data.user);
        } catch (e) {
            console.error('Failed to sync profile:', e);
            if (e.response?.status === 401) logout();
        }
    };
    fetchProfile();
  }, []);

  useEffect(() => { fetchData(); }, [active, user?.classId]);

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
    setLoading(true);
    try {
      const userId = user.id || user._id;
      if (active === 'grades' || active === 'personalPlan') {
        const r = await api.get(`/grades/student/${userId}`);
        setGrades(r.data.data.grades || []);
      }
      if (active === 'schedule') {
        const classId = user.classId?._id || user.classId;
        console.log("Student checking schedule for classId:", classId);
        if (classId) {
            const r = await api.get(`/schedule/class/${classId}`);
            console.log("Schedule response for student:", r.data);
            setSchedule(r.data.data.schedule || []);
        } else {
            console.warn("Student has no classId assigned!");
        }
      }
      if (active === 'library') {
        const r = await api.get('/library');
        console.log("Student checking library response:", r.data);
        const files = r.data.data?.files || r.data.data || [];
        setLibraryFiles(files);
      }
    } catch (e) { console.error('Fetch error:', e); }
    setLoading(false);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (cpForm.newPassword !== cpForm.confirmPassword) { setCpMsg({ type: 'error', text: 'Yangi parollar mos emas' }); return; }
    try {
      await api.post('/auth/change-password', { oldPassword: cpForm.oldPassword, newPassword: cpForm.newPassword });
      setCpMsg({ type: 'success', text: 'Parol muvaffaqiyatli o\'zgartirildi ✅' });
      setCpForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) { setCpMsg({ type: 'error', text: e.response?.data?.message || 'Xatolik' }); }
  };

  const gradesBySubject = grades.reduce((acc, g) => {
    const subName = g.subjectId?.name || 'Noma\'lum';
    if (!acc[subName]) acc[subName] = [];
    acc[subName].push(g);
    return acc;
  }, {});

  const scoreColor = (s) => {
    if (s === 5) return 'bg-green-50 text-green-600 border border-green-100';
    if (s === 4) return 'bg-blue-50 text-blue-600 border border-blue-100';
    if (s === 3) return 'bg-amber-50 text-amber-600 border border-amber-100';
    return 'bg-red-50 text-red-500 border border-red-100';
  };

  const overallAvg = grades.length ? (grades.reduce((s, g) => s + g.score, 0) / grades.length).toFixed(1) : 0;
  const filteredLibrary = libraryFiles.filter(f => libCategory === 'Barchasi' || f.category === libCategory).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="flex h-screen bg-[#f1f3f6] font-sans overflow-hidden">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} transition-all duration-300 bg-[#161c2d] flex-shrink-0 flex flex-col z-30`}>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">O</div>
             <div><p className="text-white font-bold text-sm tracking-tight">OLMAZOR</p><p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">O'QUVCHI KABINETI</p></div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${active === id ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Icon size={16} /> {label}</button>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t border-white/5">
          <div className="bg-white/5 rounded-xl p-4 mb-3">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white text-xs font-bold">{user?.name?.[0]}</div>
                <div className="overflow-hidden"><p className="text-white text-[10px] font-bold truncate">{user?.name}</p><p className="text-cyan-400 text-[8px] font-bold uppercase tracking-widest mt-1">O'QUVCHI • ONLINE</p></div>
             </div>
             <button onClick={handleLogout} className="w-full text-left text-red-400 text-[10px] font-bold py-2 hover:text-red-300 transition-colors flex items-center gap-2"><FaSignOutAlt size={12} /> Chiqish</button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-slate-600 transition-colors"><FaBars size={18} /></button>
            <h1 className="text-slate-800 font-bold text-lg tracking-tight">{NAV.find(n => n.id === active)?.label}</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Xush kelibsiz</p><p className="text-slate-800 font-bold text-xs">{user?.name}</p></div>
             <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 font-bold overflow-hidden">
                {user?.image ? (
                    <img src={`${api.defaults.baseURL}${user.image}`} alt="" className="w-full h-full object-cover" />
                ) : (
                    user?.name?.[0]
                )}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {active === 'grades' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center justify-between group"><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">O'rtacha baho</p><div className="text-3xl font-black text-cyan-600 tracking-tight">{overallAvg}</div></div><div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-500"><FaStar size={20} /></div></div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center justify-between group"><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jami baholar</p><div className="text-3xl font-black text-blue-600 tracking-tight">{grades.length}</div></div><div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500"><FaGraduationCap size={20} /></div></div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center justify-between group"><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fanlar soni</p><div className="text-3xl font-black text-indigo-600 tracking-tight">{Object.keys(gradesBySubject).length}</div></div><div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500"><FaBookOpen size={20} /></div></div>
              </div>
              <div className="space-y-4">
                {Object.entries(gradesBySubject).map(([subName, subGrades]) => {
                  const avg = (subGrades.reduce((s, g) => s + g.score, 0) / subGrades.length).toFixed(1);
                  return (
                    <div key={subName} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"><div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-cyan-500 rounded-full" /><h3 className="font-bold text-slate-800 text-sm tracking-tight">{subName}</h3></div><div className="flex items-center gap-3"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AVG:</span><span className={`text-xs font-bold px-3 py-1 rounded-lg ${scoreColor(Math.round(avg))}`}>{avg}</span></div></div>
                      <div className="p-6 flex flex-wrap gap-3">{subGrades.map(g => (<div key={g._id} className="relative group/score"><div className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center font-black text-sm transition-all shadow-sm ${scoreColor(g.score)} transition-all hover:scale-110`}>{g.isNB ? 'NB' : g.score}<span className="text-[8px] opacity-60 font-bold mt-1 uppercase tracking-tighter">{new Date(g.date).getDate()}/{new Date(g.date).getMonth()+1}</span></div>{g.isON && <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-[8px] text-white flex items-center justify-center rounded-full shadow-lg font-black ring-2 ring-white">ON</div>}</div>))}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {active === 'schedule' && (
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden animate-fade-in">
               <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none">
                  <div className="w-24 flex-shrink-0 border-r border-slate-200 bg-slate-100/50" />
                  {DAYS.map(d => {
                     const isToday = d.full === ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'][new Date().getDay()];
                     return (
                        <div key={d.label} className={`flex-1 min-w-[160px] py-6 text-center border-r border-slate-200/50 last:border-0 transition-colors ${isToday ? 'bg-cyan-50/50' : ''}`}>
                           <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isToday ? 'text-cyan-600' : 'text-slate-400'}`}>{d.label}</p>
                           <p className={`text-sm font-black ${isToday ? 'text-cyan-900' : 'text-slate-900'}`}>{d.date} {isToday && '• Bugun'}</p>
                        </div>
                     );
                  })}
               </div>
               <div className="relative overflow-x-auto scrollbar-none">
                  <div className="min-w-[1000px]">
                     {TIME_SLOTS.map((time, idx) => (
                        <div key={time} className="flex border-b border-slate-100 last:border-0 min-h-[120px]">
                           <div className="w-24 flex-shrink-0 flex flex-col items-center justify-center border-r border-slate-200 bg-slate-50/50 group">
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 group-hover:text-cyan-400 transition-colors">{idx + 1}-DARS</span>
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
                                 <div key={day.label} className={`flex-1 p-1 border-r border-slate-100/50 last:border-0 ${isToday ? 'bg-cyan-50/20' : 'bg-white'} flex flex-col gap-1`}>
                                    {lessons.map(ls => (
                                       <div key={ls._id} className={`p-4 rounded-[1.5rem] shadow-xl border-b-4 flex flex-col justify-between transition-all hover:scale-[1.02] hover:-translate-y-1 active:scale-95 cursor-default bg-gradient-to-br ${getSubjectColor(ls.subjectName)} text-white`}>
                                          <div>
                                              <div className="flex justify-between items-center mb-3">
                                                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-lg backdrop-blur-sm">{getSubjectIcon(ls.subjectName)}</div>
                                                  <span className="text-[9px] font-black bg-black/10 px-2 py-1 rounded-lg backdrop-blur-sm uppercase tracking-tighter">Xona: {ls.room.replace('Xona ', '')}</span>
                                              </div>
                                              <h4 className="text-[11px] font-black leading-tight uppercase tracking-tight line-clamp-2 mb-1">{ls.subjectName}</h4>
                                          </div>
                                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                                              <div className="flex items-center gap-1.5">
                                                  <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center text-[10px]"><FaUserTie size={10} /></div>
                                                  <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[80px]">{ls.teacherId?.name}</span>
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

          {active === 'library' && (
            <div className="space-y-6 animate-fade-in">
                <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-200 w-fit">{['Barchasi', 'Kitob', 'Maqola', 'Taqdimot'].map(c => (<button key={c} onClick={() => setLibCategory(c)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${libCategory === c ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>{c === 'Barchasi' ? 'Hamma' : c + 'lar'}</button>))}</div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredLibrary.length > 0 ? filteredLibrary.map(f => (<div key={f._id} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-cyan-300 transition-all shadow-sm"><div className="flex items-center gap-4 overflow-hidden"><div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-cyan-500 group-hover:bg-cyan-600 group-hover:text-white transition-all flex-shrink-0">{f.category === 'Kitob' ? <FaBookOpen size={20} /> : f.category === 'Maqola' ? <FaFileAlt size={20} /> : <FaDesktop size={20} />}</div><div className="overflow-hidden"><h4 className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{f.title}</h4><div className="flex items-center gap-2 mt-1"><p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">📅 {new Date(f.createdAt).toLocaleDateString()}</p><span className="w-1 h-1 bg-slate-200 rounded-full" /><p className="text-[8px] font-black text-cyan-600 uppercase tracking-widest">👨‍🏫 {f.teacherId?.name || 'Ustoz'}</p></div></div></div><a href={f.fileUrl} target="_blank" rel="noopener noreferrer" className="p-3 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all shadow-sm"><FaDownload size={14} /></a></div>)) : (<div className="col-span-full py-20 text-center text-slate-300"><div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6"><FaBookOpen size={40} className="opacity-20" /></div><p className="text-sm font-black uppercase tracking-widest">Ushbu guruhda materiallar yo'q</p></div>)}
                </div>
            </div>
          )}

          {active === 'personalPlan' && (
             <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-10"><div className="relative group"><div className="w-40 h-40 rounded-full border-8 border-slate-50 flex items-center justify-center group-hover:border-cyan-50 transition-all"><div className="text-5xl font-black text-cyan-600 tracking-tighter transition-transform group-hover:scale-110">{overallAvg}</div></div><div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl">JAMI GPA</div></div><div className="flex-1 space-y-4 text-center md:text-left"><h2 className="text-2xl font-black text-slate-800 tracking-tight">{user?.name}</h2><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50 px-4 py-2 rounded-full w-fit mx-auto md:mx-0">SHAXSIY INDIVIDUAL REJA</p><div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6"><div className="bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 flex flex-col items-center min-w-[100px]"><span className="text-emerald-700 font-black text-sm">{grades.length}</span><span className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider">Baholar</span></div><div className="bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100 flex flex-col items-center min-w-[100px]"><span className="text-indigo-700 font-black text-sm">{Object.keys(gradesBySubject).length}</span><span className="text-[8px] font-bold text-indigo-600 uppercase tracking-wider">Fanlar</span></div></div></div></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Object.entries(gradesBySubject).map(([sub, gList]) => {const avg = (gList.reduce((s, g) => s + g.score, 0) / gList.length).toFixed(1); return <div key={sub} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-cyan-400 transition-all"><div className="flex items-center justify-between mb-6"><h4 className="font-black text-slate-800 text-sm tracking-tight">{sub}</h4><span className={`text-[10px] font-black px-3 py-1 rounded-lg ${scoreColor(Math.round(avg))}`}>AVG: {avg}</span></div><div className="space-y-4"><div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-cyan-500 rounded-full shadow-lg transition-all duration-1000" style={{ width: `${(avg/5)*100}%` }} /></div><div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest"><span>Hozirgi natija</span><span className="text-cyan-600 font-black tracking-normal">{(avg/5*100).toFixed(0)}%</span></div></div></div>})}</div>
             </div>
          )}

          {active === 'settings' && <div className="max-w-md mx-auto bg-white p-10 rounded-3xl border border-slate-200 shadow-sm animate-fade-in"><h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3"><FaKey className="text-cyan-600" /> Parolni yangilash</h2>{cpMsg.text && <p className={`mb-6 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest ${cpMsg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{cpMsg.text}</p>}<form onSubmit={changePassword} className="space-y-4"><input type="password" placeholder="Eski parol" value={cpForm.oldPassword} onChange={e => setCpForm({...cpForm, oldPassword: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-cyan-500 transition-all" required /><input type="password" placeholder="Yangi parol" value={cpForm.newPassword} onChange={e => setCpForm({...cpForm, newPassword: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-cyan-500 transition-all" required /><input type="password" placeholder="Yangi parolni tasdiqlang" value={cpForm.confirmPassword} onChange={e => setCpForm({...cpForm, confirmPassword: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-cyan-500 transition-all" required /><button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all uppercase tracking-widest text-[10px] mt-4">Saqlash</button></form></div>}
        </main>
      </div>
    </div>
  );
}
