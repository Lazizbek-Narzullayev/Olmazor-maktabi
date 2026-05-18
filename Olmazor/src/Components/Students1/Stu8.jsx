import React from "react";
import { motion } from "framer-motion";

const students = [
  {
    id: 1,
    name: "Aliyev Azizbek",
    class: "8-A sinf",
    hobby: "Matematika, shaxmat",
    achievement: "Tuman olimpiadasi g‘olibi",
    img: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 2,
    name: "Karimova Mohira",
    class: "9-B sinf",
    hobby: "Ingliz tili, debat",
    achievement: "IELTS mock 7.0",
    img: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 3,
    name: "Tursunov Jamshid",
    class: "10-A sinf",
    hobby: "Fizika, robototexnika",
    achievement: "Robot musobaqasi sovrindori",
    img: "https://i.pravatar.cc/150?img=45",
  },
  {
    id: 4,
    name: "Raximova Dilnoza",
    class: "8-C sinf",
    hobby: "Biologiya, san’at",
    achievement: "Viloyat tanlovi",
    img: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 5,
    name: "Ismoilov Bekzod",
    class: "9-A sinf",
    hobby: "Tarix, notiqlik",
    achievement: "Debat ligasi sardori",
    img: "https://i.pravatar.cc/150?img=59",
  },
  {
    id: 6,
    name: "Yo‘ldoshev Ibrohim",
    class: "10-B sinf",
    hobby: "Dasturlash, AI",
    achievement: "Web loyiha muallifi",
    img: "https://i.pravatar.cc/150?img=60",
  },
  {
    id: 7,
    name: "Saidova Malika",
    class: "8-B sinf",
    hobby: "Kimyo",
    achievement: "Fan haftaligi g‘olibi",
    img: "https://i.pravatar.cc/150?img=61",
  },
  {
    id: 8,
    name: "Nazarov Shohruh",
    class: "9-C sinf",
    hobby: "Futbol",
    achievement: "Maktab jamoasi sardori",
    img: "https://i.pravatar.cc/150?img=62",
  },
  {
    id: 9,
    name: "Qodirova Madina",
    class: "10-A sinf",
    hobby: "Adabiyot",
    achievement: "She’riyat tanlovi",
    img: "https://i.pravatar.cc/150?img=63",
  },
  {
    id: 10,
    name: "Rustamov Akmal",
    class: "8-A sinf",
    hobby: "Geografiya",
    achievement: "Xarita bellashuvi",
    img: "https://i.pravatar.cc/150?img=64",
  },
  {
    id: 11,
    name: "Xasanov Umar",
    class: "9-B sinf",
    hobby: "Biologiya",
    achievement: "Eko-loyiha muallifi",
    img: "https://i.pravatar.cc/150?img=65",
  },
  {
    id: 12,
    name: "Abdullayeva Zilola",
    class: "10-C sinf",
    hobby: "Grafik dizayn",
    achievement: "Poster tanlovi g‘olibi",
    img: "https://i.pravatar.cc/150?img=66",
  },
  {
    id: 13,
    name: "Jo‘rayev Sarvar",
    class: "8-C sinf",
    hobby: "Tarix",
    achievement: "Intellektual o‘yin",
    img: "https://i.pravatar.cc/150?img=67",
  },
  {
    id: 14,
    name: "Ergasheva Mohinur",
    class: "9-A sinf",
    hobby: "Ingliz tili",
    achievement: "Speaking club yetakchisi",
    img: "https://i.pravatar.cc/150?img=68",
  },
  {
    id: 15,
    name: "To‘xtayev Diyor",
    class: "10-B sinf",
    hobby: "IT, Startap",
    achievement: "Hackathon ishtirokchisi",
    img: "https://i.pravatar.cc/150?img=69",
  },
];

const Stu8 = () => {
  return (
    <div className="min-h-screen bg-blue-900 py-20 px-6">
      <h1 className="text-4xl font-bold text-center text-white mb-14">
        8–10 sinf namunali o‘quvchilari
      </h1>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {students.map((s) => (
          <motion.div
            key={s.id}
            whileHover={{ scale: 1.04 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-blue-800 rounded-[28px] p-8 text-white shadow-xl overflow-hidden"
          >
            {/* yumshoq animatsiyali border */}
            <div className="absolute inset-0 rounded-[28px] border border-white/15 pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shine" />

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

export default Stu8;
