import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { getBaseSubject } from "../../constants/TeacherSpecializations";

const TeacherList = ({ subjectName, title }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const r = await api.get('/users/public/teachers');
        const all = r.data.data.users;
        // Filter: role is teacher AND their specialization's base subject matches
        const filtered = all.filter(u => 
          u.role === 'teacher' && 
          getBaseSubject(u.specialization || '').toLowerCase() === getBaseSubject(subjectName).toLowerCase()
        );
        setTeachers(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [subjectName]);

  return (
    <div className="min-h-screen bg-[#0f172a] py-24 px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                {title}
              </h1>
              <div className="w-24 h-1.5 bg-blue-500 mx-auto rounded-full shadow-lg shadow-blue-500/20" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
               <div className="col-span-full py-20 text-center">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Ma'lumotlar yuklanmoqda...</p>
               </div>
            ) : teachers.length > 0 ? teachers.map((s, idx) => (
              <motion.div
                key={s._id}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-[#1e293b] rounded-[40px] p-10 text-white shadow-2xl border border-white/5 hover:border-blue-500/30 transition-all"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <div className="w-20 h-20 bg-white rounded-full blur-2xl" />
                </div>

                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-6">
                      <div className="absolute inset-0 bg-blue-500 rounded-[32px] blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                      {s.image ? (
                        <img 
                            src={`${api.defaults.baseURL}${s.image}`} 
                            alt={s.name} 
                            className="w-28 h-28 rounded-[32px] object-cover relative z-10 border-2 border-white/10" 
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-[32px] bg-slate-800 flex items-center justify-center relative z-10 border-2 border-white/10 text-3xl font-black text-blue-400">
                            {s.name[0]}
                        </div>
                      )}
                  </div>
                  
                  <h2 className="text-2xl font-black mb-2 tracking-tight">{s.name}</h2>
                  <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    {subjectName} fani ustozi
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" /> Yutuqlari
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                      {s.olympiads?.length > 0 ? s.olympiads.map(o => (
                          <span key={o} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[9px] font-bold text-slate-300">
                             {o}
                          </span>
                      )) : (
                          <span className="text-slate-500 text-[10px] italic font-bold">Hozircha ma'lumot yo'q</span>
                      )}
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-32 text-center rounded-[40px] border border-dashed border-white/10 bg-white/5">
                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-600">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.732 4c-.756-1.01-2.13-1.01-2.887 0a4 4 0 000 5.333c.756 1.01 2.13 1.01 2.887 0a4 4 0 000-5.333z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ustozlar topilmadi</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest text-[10px]">Hozircha ushbu fan bo'yicha ma'lumotlar qo'shilmagan</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default TeacherList;
