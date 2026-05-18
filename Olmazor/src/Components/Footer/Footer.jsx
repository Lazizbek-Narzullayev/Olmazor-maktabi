import React from 'react'
import { FaTelegram, FaFacebook, FaInstagram } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { IoMdMenu } from 'react-icons/io';

const Footer = () => {
  return (
    <div className="bg-blue-900">
      <div className="px-6 md:px-16 lg:px-[150px] py-10">

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0 justify-between">

          {/* SOCIAL */}
          <div className="text-white">
            <p className="text-2xl md:text-3xl font-semibold max-w-md">
              Bizni ijtimoiy tarmoqlarda kuzatib boring
            </p>

            <div className="py-8 space-y-5">

              <a
                href="https://t.me/olmazor_ixtisoslashgan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 items-center hover:text-blue-300 transition"
              >
                <FaTelegram size={32} />
                <p className="text-lg md:text-xl font-semibold">
                  Telegram sahifamiz
                </p>
              </a>

              <a
                href="https://www.facebook.com/groups/278681515169062/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 items-center hover:text-blue-300 transition"
              >
                <FaFacebook size={32} />
                <p className="text-lg md:text-xl font-semibold">
                  Facebook sahifamiz
                </p>
              </a>

              <a
                href="https://www.instagram.com/olmazor_itma/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 items-center hover:text-blue-300 transition"
              >
                <FaInstagram size={32} />
                <p className="text-lg md:text-xl font-semibold">
                  Instagram sahifamiz
                </p>
              </a>

            </div>
          </div>

          {/* DIVIDER */}
          <div className="hidden lg:block w-[2px] h-[280px] bg-white rounded-xl"></div>

          {/* CONTACT */}
          <div className="text-white">
            <p className="text-2xl md:text-3xl font-semibold max-w-md">
              Biz bilan bog'laning
            </p>

            <div className="mt-8 md:mt-16 space-y-5">
              <NavLink to="/a">
                <div className="mt-4 border border-white bg-white text-blue-900 
                                p-2 rounded-xl w-56
                                hover:bg-blue-900 hover:border-[3px] transition">

                  <div className="flex gap-3 items-center justify-center hover:text-white">
                    <IoMdMenu size={26} />
                    <p className="text-lg font-semibold">
                      Batafsil ma'lumotlar
                    </p>
                  </div>

                </div>
              </NavLink>

              <div className="flex gap-3 items-center">
                <MdEmail size={26} />
                <p className="text-lg md:text-xl font-semibold">
                  OlmazorPIMA@manzil
                </p>
              </div>

              <div className="flex gap-3 items-start">
                <FaLocationDot size={26} />
                <p className="text-lg md:text-xl font-semibold max-w-sm">
                  Toshkent sh., Olmazor tumani, Sebzor massivi, 17/18
                </p>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hidden lg:block w-[2px] h-[280px] bg-white rounded-xl"></div>

          {/* WORK TIME */}
          <div className="text-white">
            <p className="text-2xl md:text-3xl font-semibold max-w-md">
              Maktabimizning ish vaqti
            </p>

            <div className="mt-8 md:mt-16 space-y-5">
              <div className="flex gap-3 items-center">
                <FaCalendarAlt size={22} />
                <p className="text-lg md:text-xl font-semibold">
                  Dushanba–Juma 8:30–16:00
                </p>
              </div>

              <div className="flex gap-3 items-center">
                <FaCalendarAlt size={22} />
                <p className="text-lg md:text-xl font-semibold">
                  Shanba–Yakshanba 10:00–16:00
                </p>
              </div>

              <NavLink to="/j">
                <div className="mt-4 border border-white bg-white text-blue-900 
                                p-2 rounded-xl w-56
                                hover:bg-blue-900 hover:border-[3px] transition">

                  <div className="flex gap-3 items-center justify-center hover:text-white">
                    <FaLocationDot size={26} />
                    <p className="text-lg font-semibold">
                      Manzilni ko‘rish
                    </p>
                  </div>

                </div>
              </NavLink>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Footer
