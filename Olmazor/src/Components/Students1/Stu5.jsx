import React from "react";
import { motion } from "framer-motion";

const students = [
  {
    id: 1,
    name: "Aliyev Murod",
    class: "5-A sinf",
    hobby: "Matematika, shaxmat",
    achievement: "Maktab olimpiadasi",
    img: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    name: "Karimova Madina",
    class: "6-B sinf",
    hobby: "Ingliz tili",
    achievement: "English quiz g‘olibi",
    img: "https://i.pravatar.cc/150?img=22",
  },
  {
    id: 3,
    name: "Rustamov Aziz",
    class: "7-A sinf",
    hobby: "Futbol",
    achievement: "Maktab jamoasi a’zosi",
    img: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: 4,
    name: "Saidova Mohinur",
    class: "5-C sinf",
    hobby: "Rasm chizish",
    achievement: "Ijodiy tanlov",
    img: "https://i.pravatar.cc/150?img=44",
  },
  {
    id: 5,
    name: "Yo‘ldoshev Ibrohim",
    class: "6-A sinf",
    hobby: "Dasturlash",
    achievement: "Scratch loyiha",
    img: "https://i.pravatar.cc/150?img=55",
  },
  {
    id: 6,
    name: "Xasanov Umar",
    class: "7-B sinf",
    hobby: "Biologiya",
    achievement: "Fan haftaligi",
    img: "https://i.pravatar.cc/150?img=66",
  },
  {
    id: 7,
    name: "Qodirova Zilola",
    class: "5-B sinf",
    hobby: "She’riyat",
    achievement: "Ifodali o‘qish",
    img: "https://i.pravatar.cc/150?img=77",
  },
  {
    id: 8,
    name: "Jo‘rayev Sarvar",
    class: "6-C sinf",
    hobby: "Tarix",
    achievement: "Bilimlar bellashuvi",
    img: "https://i.pravatar.cc/150?img=88",
  },
  {
    id: 9,
    name: "Ergasheva Malika",
    class: "7-C sinf",
    hobby: "Kimyo",
    achievement: "Tajriba ko‘rgazmasi",
    img: "https://i.pravatar.cc/150?img=99",
  },
  {
    id: 10,
    name: "Nazarov Shohruh",
    class: "5-A sinf",
    hobby: "Futbol",
    achievement: "Sport haftaligi",
    img: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: 11,
    name: "Abdullayeva Dilnoza",
    class: "6-B sinf",
    hobby: "Musiqa",
    achievement: "Qo‘shiq tanlovi",
    img: "https://i.pravatar.cc/150?img=24",
  },
  {
    id: 12,
    name: "Tursunov Jamshid",
    class: "7-A sinf",
    hobby: "Robototexnika",
    achievement: "Mini-robot loyihasi",
    img: "https://i.pravatar.cc/150?img=35",
  },
  {
    id: 13,
    name: "Ismoilov Bekzod",
    class: "5-C sinf",
    hobby: "Geografiya",
    achievement: "Xarita bellashuvi",
    img: "https://i.pravatar.cc/150?img=46",
  },
  {
    id: 14,
    name: "Rahimova Sabina",
    class: "6-A sinf",
    hobby: "Ingliz tili",
    achievement: "Speaking club",
    img: "https://i.pravatar.cc/150?img=57",
  },
  {
    id: 15,
    name: "To‘xtayev Diyor",
    class: "7-B sinf",
    hobby: "IT, Scratch",
    achievement: "Mini o‘yin yaratdi",
    img: "https://i.pravatar.cc/150?img=68",
  },
];

const Stu5 = () => {
  return (
    <div className="min-h-screen bg-blue-900 py-20 px-6">
      <h1 className="text-4xl font-bold text-center text-white mb-14">
        5–7 sinf namunali o‘quvchilari
      </h1>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {students.map((s) => (
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
              <img
                src={s.img}
                alt={s.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/40"
              />
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
