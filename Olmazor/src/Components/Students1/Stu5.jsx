import React from "react";
import { motion } from "framer-motion";
import { API_URL } from "../../services/api";

const fallbackStudents = [
  {
    id: 1,
    name: "Aliyev Murod",
    class: "5-A sinf",
    hobby: "Matematika, shaxmat",
    achievement: "Maktab olimpiadasi",
    img: "",
  },
  {
    id: 2,
    name: "Karimova Madina",
    class: "6-B sinf",
    hobby: "Ingliz tili",
    achievement: "English quiz g‘olibi",
    img: "",
  },
  {
    id: 3,
    name: "Rustamov Aziz",
    class: "7-A sinf",
    hobby: "Futbol",
    achievement: "Maktab jamoasi a’zosi",
    img: "",
  },
  {
    id: 4,
    name: "Saidova Mohinur",
    class: "5-C sinf",
    hobby: "Rasm chizish",
    achievement: "Ijodiy tanlov",
    img: "",
  },
  {
    id: 5,
    name: "Yo‘ldoshev Ibrohim",
    class: "6-A sinf",
    hobby: "Dasturlash",
    achievement: "Scratch loyiha",
    img: "",
  },
  {
    id: 6,
    name: "Xasanov Umar",
    class: "7-B sinf",
    hobby: "Biologiya",
    achievement: "Fan haftaligi",
    img: "",
  },
  {
    id: 7,
    name: "Qodirova Zilola",
    class: "5-B sinf",
    hobby: "She’riyat",
    achievement: "Ifodali o‘qish",
    img: "",
  },
  {
    id: 8,
    name: "Jo‘rayev Sarvar",
    class: "6-C sinf",
    hobby: "Tarix",
    achievement: "Bilimlar bellashuvi",
    img: "",
  },
  {
    id: 9,
    name: "Ergasheva Malika",
    class: "7-C sinf",
    hobby: "Kimyo",
    achievement: "Tajriba ko‘rgazmasi",
    img: "",
  },
  {
    id: 10,
    name: "Nazarov Shohruh",
    class: "5-A sinf",
    hobby: "Futbol",
    achievement: "Sport haftaligi",
    img: "",
  },
  {
    id: 11,
    name: "Abdullayeva Dilnoza",
    class: "6-B sinf",
    hobby: "Musiqa",
    achievement: "Qo‘shiq tanlovi",
    img: "",
  },
  {
    id: 12,
    name: "Tursunov Jamshid",
    class: "7-A sinf",
    hobby: "Robototexnika",
    achievement: "Mini-robot loyihasi",
    img: "",
  },
  {
    id: 13,
    name: "Ismoilov Bekzod",
    class: "5-C sinf",
    hobby: "Geografiya",
    achievement: "Xarita bellashuvi",
    img: "",
  },
  {
    id: 14,
    name: "Rahimova Sabina",
    class: "6-A sinf",
    hobby: "Ingliz tili",
    achievement: "Speaking club",
    img: "",
  },
  {
    id: 15,
    name: "To‘xtayev Diyor",
    class: "7-B sinf",
    hobby: "IT, Scratch",
    achievement: "Mini o‘yin yaratdi",
    img: "",
  },
];

const Stu5 = () => {
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { default: api } = await import("../../services/api");
        const r = await api.get('/users/public/students');
        const all = r.data.data.users;
        
        // Filter students for 5, 6, 7 classes
        const filtered = all.filter(u => {
          const className = u.classId?.name || '';
          return className.startsWith('5') || className.startsWith('6') || className.startsWith('7');
        });

        const mapped = filtered.map(u => ({
          id: u._id,
          name: u.name,
          class: u.classId?.name ? `${u.classId.name} sinf` : 'Sinf',
          hobby: u.specialization || 'Hozircha ma\'lumot yo\'q',
          achievement: u.olympiads?.[0] || 'Hozircha ma\'lumot yo\'q',
          img: u.image
        }));

        if (mapped.length > 0) {
          setStudents(mapped);
        } else {
          setStudents(fallbackStudents);
        }
      } catch (e) {
        console.error("API error, using fallback data:", e);
        setStudents(fallbackStudents);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-blue-900 py-20 px-6">
      <h1 className="text-4xl font-bold text-center text-white mb-14">
        5–7 sinf namunali o‘quvchilari
      </h1>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Yuklanmoqda...</p>
          </div>
        ) : students.map((s) => (
          <motion.div
            key={s.id}
            whileHover={{ scale: 1.04 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="relative bg-blue-800 rounded-[28px] p-8 text-white shadow-xl overflow-hidden"
          >
            {/* yumshoq border */}
            <div className="absolute inset-0 rounded-[28px] border border-white/15 pointer-events-none" />

            <div className="relative z-10 flex items-center gap-4 mb-5">
              {s.img ? (
                <img
                  src={s.img.startsWith('http') ? s.img : `${API_URL}${s.img}`}
                  alt={s.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/40"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-700 border-2 border-white/40 flex items-center justify-center text-3xl shadow-inner select-none">
                  🎓
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{s.name}</h2>
                <p className="text-white/70">{s.class}</p>
              </div>
            </div>

            <p className="text-white/80 mb-2">
              <span className="font-semibold">Qiziqishi:</span> {s.hobby}
            </p>
            <p className="text-white/80">
              <span className="font-semibold">Yutug‘i:</span> {s.achievement}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Stu5;
