import React from "react";
import { NavLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const Teachmenu = () => {
  const subjects = [
    { name: "Algebra", emoji: "🧮", link: "/al" },
    { name: "Fizika", emoji: "⚛️", link: "/fi" },
    { name: "Kimyo", emoji: "🧪", link: "/ki" },
    { name: "Biologiya", emoji: "🧬", link: "/bi" },
    { name: "Ingliz tili", emoji: "🗣️", link: "/ing" },
    { name: "Ona tili va adabiyot", emoji: "📚", link: "/on" },
    { name: "Tarix", emoji: "📜", link: "/ta" },
    { name: "Geografiya", emoji: "🗺️", link: "/ge" },
    { name: "Informatika", emoji: "💻", link: "/in" },
    { name: "Texnologiya", emoji: "🤖", link: "/tex" },
    { name: "Chizmachilik", emoji: "✏️", link: "/ch" },
    { name: "Jismoniy tarbiya", emoji: "🏃‍♂️", link: "/jt" },
  ];

  return (
    <div className="min-h-screen bg-[#173A8E] text-white flex flex-col items-center p-6">

      {/* Back button */}
      <div className="w-full flex justify-end text-3xl">
        <NavLink to={"/"}>
          <FiArrowLeft className="rotate-180" />
        </NavLink>
      </div>

      <h1 className="text-2xl font-bold mt-6">FANLAR RO‘YXATI</h1>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
        {subjects.map((subj, i) => (
          <NavLink
            key={i}
            to={subj.link}
            className="w-full py-3 bg-white/20 rounded-lg text-lg border border-white/30 hover:bg-white/30 transition flex items-center gap-2 justify-center text-center"
          >
            <span className="text-xl">{subj.emoji}</span>
            <span>{subj.name}</span>
          </NavLink>
        ))}
      </div>

    </div>
  );
};

export default Teachmenu;
