import React from "react";
import { motion } from "framer-motion";

const students = [
  {
    id: 1,
    name: "Aliyev Azizbek",
    class: "11-A sinf",
    hobby: "Matematika, fizika",
    achievement: "Respublika olimpiadasi sovrindori",
    img: "https://i.pravatar.cc/150?img=10",
  },
  {
    id: 2,
    name: "Karimova Mohira",
    class: "11-B sinf",
    hobby: "Ingliz tili, debat",
    achievement: "IELTS 7.5",
    img: "https://i.pravatar.cc/150?img=20",
  },
  {
    id: 3,
    name: "Tursunov Jamshid",
    class: "11-A sinf",
    hobby: "Fizika, robototexnika",
    achievement: "Startap loyihasi muallifi",
    img: "https://i.pravatar.cc/150?img=30",
  },
  {
    id: 4,
    name: "Raximova Dilnoza",
    class: "11-C sinf",
    hobby: "Biologiya",
    achievement: "Viloyat fan olimpiadasi",
    img: "https://i.pravatar.cc/150?img=40",
  },
  {
    id: 5,
    name: "Ismoilov Bekzod",
    class: "11-B sinf",
    hobby: "Tarix, notiqlik",
    achievement: "Debat turniri g‘olibi",
    img: "https://i.pravatar.cc/150?img=50",
  },
  {
    id: 6,
    name: "Yo‘ldoshev Ibrohim",
    class: "11-A sinf",
    hobby: "Dasturlash, AI",
    achievement: "Web ilova ishlab chiqdi",
    img: "https://i.pravatar.cc/150?img=60",
  },
  {
    id: 7,
    name: "Saidova Malika",
    class: "11-B sinf",
    hobby: "Kimyo",
    achievement: "Laboratoriya loyihasi",
    img: "https://i.pravatar.cc/150?img=70",
  },
  {
    id: 8,
    name: "Nazarov Shohruh",
    class: "11-C sinf",
    hobby: "Futbol",
    achievement: "Maktab jamoasi sardori",
    img: "https://i.pravatar.cc/150?img=80",
  },
  {
    id: 9,
    name: "Qodirova Madina",
    class: "11-A sinf",
    hobby: "Adabiyot",
    achievement: "Insho tanlovi g‘olibi",
    img: "https://i.pravatar.cc/150?img=90",
  },
  {
    id: 10,
    name: "Rustamov Akmal",
    class: "11-B sinf",
    hobby: "Geografiya",
    achievement: "Xarita musobaqasi",
    img: "https://i.pravatar.cc/150?img=14",
  },
  {
    id: 11,
    name: "Xasanov Umar",
    class: "11-C sinf",
    hobby: "Biologiya",
    achievement: "Eko-loyiha muallifi",
    img: "https://i.pravatar.cc/150?img=24",
  },
  {
    id: 12,
    name: "Abdullayeva Zilola",
    class: "11-A sinf",
    hobby: "Grafik dizayn",
    achievement: "Poster tanlovi g‘olibi",
    img: "https://i.pravatar.cc/150?img=34",
  },
  {
    id: 13,
    name: "Jo‘rayev Sarvar",
    class: "11-B sinf",
    hobby: "Tarix",
    achievement: "Intellektual o‘yin",
    img: "https://i.pravatar.cc/150?img=44",
  },
  {
    id: 14,
    name: "Ergasheva Mohinur",
    class: "11-C sinf",
    hobby: "Ingliz tili",
    achievement: "Speaking club yetakchisi",
    img: "https://i.pravatar.cc/150?img=54",
  },
  {
    id: 15,
    name: "To‘xtayev Diyor",
    class: "11-A sinf",
    hobby: "IT, startap",
    achievement: "Hackathon ishtirokchisi",
    img: "https://i.pravatar.cc/150?img=64",
  },
];

const Stu11 = () => {
  return (
    <div className="min-h-screen bg-blue-900 py-20 px-6">
      <h1 className="text-4xl font-bold text-center text-white mb-14">
        11-sinf namunali o‘quvchilari
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
            {/* yumshoq border (o‘sha dizayn) */}
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

export default Stu11;
