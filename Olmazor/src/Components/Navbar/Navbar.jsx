import React, { useState } from 'react';
import { IoMdMenu } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoExit } from "react-icons/io5";
import { FaSignInAlt, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'teacher') return '/teacher';
    return '/student';
  };

  return (
    <div>
      {/* NAVBAR */}
      <div className="px-4 md:px-10 lg:px-[150px] py-3">
        <div className="flex justify-between items-center">

          {/* LOGO */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <NavLink to="/">
              <div className="flex gap-2 items-center">
                <img
                  src="https://static10.tgstat.ru/channels/_0/ef/efc24d28425fddf68c6a97465ad9f110.jpg"
                  className="w-14 md:w-20"
                  alt="logo"
                />
                <img
                  src="https://portal.piima.uz/images/icons/logo-name-new-blue.svg"
                  className="w-24 md:w-32"
                  alt="logo-name"
                />
              </div>
            </NavLink>
          </motion.div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex gap-8 items-center">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-xl"
            >
              <IoMdMenu size={26} />
              <span className="text-xl font-semibold">Katalog</span>
            </button>

            <NavLink to="/a" className="flex gap-2 items-center text-blue-900">
              <BsFillTelephoneFill />
              <span className="text-xl font-semibold">Aloqa</span>
            </NavLink>

            <NavLink to="/j" className="flex gap-2 items-center text-blue-900">
              <FaLocationDot />
              <span className="text-xl font-semibold">Joylashuv</span>
            </NavLink>

            {/* LOGIN / DASHBOARD BUTTON */}
            {user ? (
              <div className="flex items-center gap-3">
                <NavLink
                  to={dashboardLink()}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition font-semibold text-sm shadow-lg shadow-green-200"
                >
                  <FaTachometerAlt size={16} />
                  <span>Panel</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 border border-red-300 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition font-semibold text-sm"
                >
                  <FaSignOutAlt size={14} />
                  <span>Chiqish</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition font-semibold text-sm shadow-lg shadow-blue-200"
              >
                <FaSignInAlt size={16} />
                <span>Kirish</span>
              </NavLink>
            )}
          </div>

          {/* MOBILE: Menu + Login */}
          <div className="lg:hidden flex items-center gap-3">
            {user ? (
              <NavLink to={dashboardLink()}
                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                <FaTachometerAlt size={13} /> Panel
              </NavLink>
            ) : (
              <NavLink to="/login"
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                <FaSignInAlt size={13} /> Kirish
              </NavLink>
            )}
            <button onClick={() => setOpen(true)} className="text-blue-900">
              <IoMdMenu size={34} />
            </button>
          </div>
        </div>
      </div>

      {/* SIDEBAR (KATALOG) */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-blue-900 text-white p-6 
        z-50 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* LOGO */}
        <div className="text-center">
          <img
            src="https://portal.piima.uz/images/icons/logo-icon-new.svg"
            className="w-24 mx-auto"
            alt=""
          />
          <img
            src="https://portal.piima.uz/images/icons/logo-name-new.svg"
            className="w-32 mx-auto mt-2"
            alt=""
          />
        </div>

        {/* MENU */}
        <h2 className="text-2xl font-bold text-center my-6">KATALOG</h2>

        <ul className="flex flex-col gap-4 text-center text-lg font-semibold">
          <NavLink onClick={() => setOpen(false)} to="/">Bosh sahifa</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/sm">O'quvchilar TOP ligi</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/tm">O'qituvchilar TOP ligi</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/shar">Maktab sharoiti</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/qa">Qabulga yozilish</NavLink>
        </ul>

        {/* If logged in, show dashboard link in sidebar too */}
        {user && (
          <div className="mt-8 border-t border-white/20 pt-6">
            <NavLink onClick={() => setOpen(false)} to={dashboardLink()}
              className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl py-3 text-white font-semibold transition">
              <FaTachometerAlt /> Boshqaruv paneli
            </NavLink>
          </div>
        )}

        {/* CLOSE */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-5 right-5"
        >
          <IoExit size={30} />
        </button>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}
    </div>
  );
};

export default Navbar;
