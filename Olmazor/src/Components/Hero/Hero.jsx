import React, { useRef, useState } from "react";
import Carousel from "./Carousel";
import { motion, useScroll, useTransform } from "framer-motion";
import Page from "./Page";
import { NavLink } from "react-router-dom";
import { FaUserGraduate, FaSchool } from "react-icons/fa6";

const Hero = () => {
  const [open, setOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState("");
  const heroRef = useRef(null);

  const images = [
    "https://picsum.photos/id/1018/1000/600",
    "https://picsum.photos/id/1018/1000/600",
    "https://picsum.photos/id/1018/1000/600",
  ];

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const openVideo = (src) => {
    setActiveVideo(src);
    setOpen(true);
  };

  return (
    <div>
      {/* ================= HERO ================= */}
      <div
        ref={heroRef}
        className="
          relative overflow-hidden
          h-[600px]
          sm:h-[600px]
          max-sm:h-[500px]
        "
      >
        {/* Carousel */}
        <div className="absolute inset-0">
          <Carousel
            images={images}
            height="h-[600px]"
            autoplay
            autoplayInterval={5000}
          />
          {/* overlay O‘ZGARMADI */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero text */}
        <motion.div
          style={{ y, opacity }}
          className="
            relative z-10 h-full flex flex-col
            items-center justify-center text-center
            px-4 sm:px-6 md:px-0
          "
        >
          <h1
            className="
              text-6xl
              max-sm:text-3xl
              sm:text-4xl
              md:text-5xl
              font-bold text-white mb-4
            "
          >
            Olmazor Ixtisoslashtirilgan maktab
          </h1>

          <p
            className=" 
              text-2xl
              max-sm:text-base
              sm:text-lg
              md:text-xl
              text-white/80 mb-8
              max-w-[900px]
            "
          >
            Zamonaviy ta’lim, kuchli ustozlar, yorqin kelajak
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <NavLink to="/shar">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
                Biz bilan tanishing
              </button>
            </NavLink>
            <NavLink to="/mq">
              <button className="bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100">
                Ro‘yxatdan o‘tish
              </button>
            </NavLink>
          </div>
        </motion.div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-2xl animate-bounce">
          ↓
        </div>
      </div>

      {/* ================= TOP USTOZLAR ================= */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="
          mt-12
          px-4 sm:px-6 md:px-0
        "
      >
        <p
          className="
            text-5xl
            max-sm:text-3xl
            sm:text-4xl
            font-bold text-center mb-6
          "
        >
          Maktabimizdagi TOP ustozlar
        </p>
        <Page />
      </motion.div>

      {/* ================= YANGILIKLAR ================= */}
      <div className="bg-blue-900 py-24 px-4 sm:px-10 text-white">
        <p
          className="
            text-5xl
            max-sm:text-3xl
            sm:text-4xl
            font-bold text-center mb-16
          "
        >
          So‘ngi yangiliklar
        </p>

        <div className="flex flex-wrap gap-10 justify-center">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="
                bg-white text-blue-900 rounded-2xl
                w-[673px]
                max-sm:w-full
                p-6 space-y-6
              "
            >
              <p className="text-2xl max-sm:text-lg font-semibold text-center">
                “Zakovat” intellektual oʻyinining Respublika bosqichida faol ishtirok
              </p>
              <video
                src={`/news/${i}.MP4`}
                controls
                className="rounded-xl cursor-pointer w-full h-[400px] object-cover"
                onClick={() => openVideo(`/news/${i}.MP4`)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================= VIDEO MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="relative bg-blue-900 p-4 rounded-2xl w-full max-w-5xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-3 -right-3 bg-white text-blue-900 w-9 h-9 rounded-full font-bold"
            >
              ✕
            </button>
            <video
              src={activeVideo}
              controls
              autoPlay
              className="rounded-xl w-full max-h-[80vh]"
            />
          </div>
        </div>
      )}

      {/* ================= CTA ================= */}
      <div className="py-8 px-4 sm:px-[200px]">
        <p className="text-4xl max-sm:text-2xl font-bold text-blue-900">
          Batafsil:
        </p>
      </div>

      <div
        className="
          flex gap-10
          px-[300px]
          max-sm:px-4
          max-sm:flex-col
          justify-between
          pb-20
        "
      >
        {/* CARD 1 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-blue-900 rounded-[32px] p-12 text-center text-white shadow-2xl w-[550px] max-sm:w-full"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center text-4xl">
            <FaSchool className="text-blue-900" />
          </div>
          <h2 className="text-4xl max-sm:text-2xl font-bold mb-4">
            Biz bilan tanishing
          </h2>
          <p className="text-white/60 mb-6">
            Maktabimiz hayoti va imkoniyatlari bilan yaqindan tanishing
          </p>
          <NavLink to="/shar" className="text-gray-300 font-semibold">
            Batafsil →
          </NavLink>
        </motion.div>

        {/* CARD 2 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-blue-900 rounded-[32px] p-12 text-center text-white shadow-2xl w-[550px] max-sm:w-full"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center text-4xl">
            <FaUserGraduate className="text-blue-900" />
          </div>
          <h2 className="text-4xl max-sm:text-2xl font-bold mb-4">
            O‘quvchilarimiz
          </h2>
          <p className="text-white/60 mb-6">
            Iqtidorli va faol o‘quvchilarimiz bilan tanishing
          </p>
          <NavLink to="/sm" className="text-gray-300 font-semibold">
            Batafsil →
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
