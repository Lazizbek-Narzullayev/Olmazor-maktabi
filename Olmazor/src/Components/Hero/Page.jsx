import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FaArrowRightToBracket } from "react-icons/fa6";
import api from "../../services/api";
import { getBaseSubject } from "../../constants/TeacherSpecializations";

const pages = [
  { id: 0, title: "Algebra", link: "/al" },
  { id: 1, title: "Biologiya", link: "/bi" },
  { id: 2, title: "Chizmachilik", link: "/ch" },
  { id: 3, title: "Fizika", link: "/fi" },
  { id: 4, title: "Geometriya", link: "/ge" },
  { id: 5, title: "Informatika", link: "/in" },
  { id: 6, title: "Ingliz tili", link: "/ing" },
  { id: 7, title: "Jismoniy tarbiya", link: "/jt" },
  { id: 8, title: "Kimyo", link: "/ki" },
  { id: 9, title: "Ona tili", link: "/on" },
  { id: 10, title: "Tarix", link: "/ta" },
  { id: 11, title: "Texnologiya", link: "/te" },
];

const PageContent = ({ title, link, teacher }) => (
  <div className="space-y-4 px-4 w-full h-full flex flex-col justify-center">
    <h1 className="text-3xl md:text-5xl font-black text-center text-white tracking-tight mb-2">{title}</h1>

    <div
      className="flex flex-col lg:flex-row items-center justify-center
                 py-4 md:py-8
                 space-y-6 lg:space-y-0 lg:space-x-12 text-white"
    >
      <div className="relative">
          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
          {teacher?.image ? (
            <img 
                src={`${api.defaults.baseURL}${teacher.image}`} 
                alt={teacher.name} 
                className="w-32 md:w-48 h-32 md:h-48 rounded-[40px] object-cover relative z-10 border-4 border-white/20 shadow-2xl" 
            />
          ) : (
            <img
                src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                alt="default"
                className="w-32 md:w-48 relative z-10 brightness-0 invert opacity-80"
            />
          )}
      </div>

      <div className="space-y-3 text-center lg:text-left z-10">
        <div>
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">NAMUNALI USTOZ</p>
            <p className="text-2xl md:text-4xl font-black tracking-tight">{teacher?.name || 'Ustoz ma\'lumotlari'}</p>
        </div>
        
        <p className="text-sm md:text-lg font-medium text-white/70 max-w-md">
            {title} fani bo'yicha yuqori malakali va tajribali mutaxassis.
        </p>

        <NavLink to={link} className="block pt-4">
          <div
            className="mx-auto lg:mx-0
                       bg-white text-blue-600
                       rounded-2xl py-3 px-8 w-fit
                       hover:scale-105 transition-all shadow-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3"
          >
            Batafsil
            <FaArrowRightToBracket size={18} />
          </div>
        </NavLink>
      </div>
    </div>
  </div>
);

const Page = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [teachersBySubject, setTeachersBySubject] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const r = await api.get('/users/public/teachers');
        const all = r.data.data.users;
        const teachers = all.filter(u => u.role === 'teacher');
        
        // Map subject -> first teacher found
        const map = {};
        pages.forEach(p => {
           const baseSub = getBaseSubject(p.title);
           const found = teachers.find(t => getBaseSubject(t.specialization || '').toLowerCase() === baseSub.toLowerCase());
           if (found) map[p.title] = found;
        });
        setTeachersBySubject(map);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const paginate = (dir) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + pages.length) % pages.length);
  };

  const prevIndex = (index - 1 + pages.length) % pages.length;
  const nextIndex = (index + 1) % pages.length;

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 3,
    },
    exit: (dir) => ({
      x: dir < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      zIndex: 1,
    }),
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-[520px] bg-white">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[600px] bg-white px-4 py-20">
      <div className="relative w-full max-w-[1100px] h-[500px]">

        {/* PREV (Peek) */}
        <div
          className="absolute inset-0 rounded-[48px] opacity-20 scale-90 -translate-x-48 blur-sm pointer-events-none hidden md:flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.3)" }}
        >
          <PageContent {...pages[prevIndex]} teacher={teachersBySubject[pages[prevIndex].title]} />
        </div>

        {/* NEXT (Peek) */}
        <div
          className="absolute inset-0 rounded-[48px] opacity-20 scale-90 translate-x-48 blur-sm pointer-events-none hidden md:flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.3)" }}
        >
          <PageContent {...pages[nextIndex]} teacher={teachersBySubject[pages[nextIndex].title]} />
        </div>

        {/* CURRENT */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(59,130,246,0.3)]
                       flex items-center justify-center overflow-hidden border border-white/20"
            style={{ 
                background: "linear-gradient(135deg, rgba(59,130,246,0.8), rgba(37,99,235,0.9))",
                backdropFilter: "blur(20px)"
            }}
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-20 -mb-20 blur-3xl" />
            
            <PageContent {...pages[index]} teacher={teachersBySubject[pages[index].title]} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={() => paginate(-1)}
          className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-6 md:-translate-x-10
                     w-12 md:w-16 h-12 md:h-16 rounded-2xl
                     bg-white text-blue-600 text-3xl
                     flex items-center justify-center shadow-2xl z-50 hover:bg-blue-50 transition-colors active:scale-90"
        >
          ‹
        </button>

        <button
          onClick={() => paginate(1)}
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-6 md:translate-x-10
                     w-12 md:w-16 h-12 md:h-16 rounded-2xl
                     bg-white text-blue-600 text-3xl
                     flex items-center justify-center shadow-2xl z-50 hover:bg-blue-50 transition-colors active:scale-90"
        >
          ›
        </button>

      </div>
    </div>
  );
};

export default Page;

