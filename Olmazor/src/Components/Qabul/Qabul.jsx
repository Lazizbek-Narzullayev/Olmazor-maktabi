import React from "react";
import { FaBookOpen, FaSchool } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Qabul = () => {
  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center relative overflow-hidden px-4">

      <div className="relative w-full max-w-[700px] h-auto md:h-[300px] flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">

        {/* BUTTON 1 */}
        <div className="relative group">
          
          {/* ICON */}
          <div
            className="
              absolute left-1/2 -top-20 -translate-x-1/2
              opacity-0 translate-y-6 scale-75
              transition-all duration-500
              group-hover:opacity-100
              group-hover:translate-y-0
              group-hover:scale-100
              z-50
            "
          >
            <FaBookOpen className="text-white text-5xl md:text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,1)]" />
          </div>

          {/* BUTTON */}
          <NavLink to={'/qd'}>
            <div
              className="
                w-72 h-40 sm:w-80 sm:h-44 bg-white rounded-3xl
                flex items-center justify-center text-center
                text-blue-900 text-lg sm:text-xl font-bold
                cursor-pointer
                transition-all duration-500
                group-hover:scale-110 sm:group-hover:scale-125
                group-hover:z-40
              "
            >
              Qo‘shimcha darslarga yozilish
            </div>
          </NavLink>
        </div>

        {/* BUTTON 2 */}
        <div className="relative group">
          
          {/* ICON */}
          <div
            className="
              absolute left-1/2 -top-20 -translate-x-1/2
              opacity-0 translate-y-6 scale-75
              transition-all duration-500
              group-hover:opacity-100
              group-hover:translate-y-0
              group-hover:scale-100
              z-50
            "
          >
            <FaSchool className="text-white text-5xl md:text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,1)]" />
          </div>

          {/* BUTTON */}
          <NavLink to={'/mq'}>
            <div
              className="
                w-72 h-40 sm:w-80 sm:h-44 bg-white rounded-3xl
                flex items-center justify-center text-center
                text-blue-900 text-lg sm:text-xl font-bold
                cursor-pointer
                transition-all duration-500
                group-hover:scale-110 sm:group-hover:scale-125
                group-hover:z-40
              "
            >
              Maktab qabuliga yozilish
            </div>
          </NavLink>
        </div>

      </div>
    </div>
  );
};

export default Qabul;
