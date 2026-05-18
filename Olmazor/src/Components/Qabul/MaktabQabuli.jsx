import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';

const MaktabQabuli = () => {
  const [form, setForm] = useState({ ism: '', familiya: '', telefon: '', sinf: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4200/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'maktab' }),
      });
      const data = await res.json();
      if (data.status === 'created') {
        setSuccess(true);
        setForm({ ism: '', familiya: '', telefon: '', sinf: '' });
      } else {
        setError(data.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setError('Server bilan bog\'lanishda xatolik. Keyinroq urinib ko\'ring.');
    }
    setLoading(false);
  };

  return (
    <div className="px-[150px] py-10 max-lg:px-6">
      <p className="text-4xl font-bold text-blue-900 text-center mb-10">
        Maktabimiz qabuliga yoziling
      </p>

      {/* SUCCESS */}
      {success && (
        <div className="max-w-3xl mx-auto mb-6 bg-green-50 border border-green-300 rounded-2xl p-6 text-center">
          <div className="text-5xl mb-3">✅</div>
          <p className="text-green-700 font-bold text-xl">Arizangiz muvaffaqiyatli yuborildi!</p>
          <p className="text-green-600 mt-2">Tez orada siz bilan bog'lanamiz. Telegram kanalimizni kuzatib boring.</p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
          >
            Yana yuborish
          </button>
        </div>
      )}

      {!success && (
        /* GLASS FORM */
        <form
          onSubmit={handleSubmit}
          className="
            mx-auto max-w-3xl
            rounded-3xl
            border border-white/30
            bg-white/20
            backdrop-blur-xl
            shadow-2xl
            p-10
          "
        >
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Ism"
              value={form.ism}
              onChange={e => setForm({ ...form, ism: e.target.value })}
              required
              className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-600 outline-none"
            />

            <input
              type="text"
              placeholder="Familiya"
              value={form.familiya}
              onChange={e => setForm({ ...form, familiya: e.target.value })}
              required
              className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-600 outline-none"
            />

            <input
              type="tel"
              placeholder="Telefon raqam (+998...)"
              value={form.telefon}
              onChange={e => setForm({ ...form, telefon: e.target.value })}
              required
              className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-600 outline-none"
            />

            <input
              type="text"
              placeholder="Qaysi sinfga (masalan: 5)"
              value={form.sinf}
              onChange={e => setForm({ ...form, sinf: e.target.value })}
              required
              className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              mt-8 w-full py-4
              bg-blue-900 text-white
              rounded-2xl font-semibold text-lg
              hover:bg-blue-800 transition-all
              disabled:bg-blue-700
            "
          >
            {loading ? 'Yuborilmoqda...' : 'Yuborish'}
          </button>

          <div className="py-5">
            <div className="border border-blue-900 rounded-2xl bg-blue-900 text-white">
              <div className="p-2">
                <p className="text-xl font-semibold text-center">
                  Offlayn qabuldan o'tmoqchi bo'lsangiz maktabimizga tashrif buyuring!
                </p>
                <div className="flex justify-center">
                  <NavLink to="/a">
                    <div className="mt-4 border border-white bg-white text-blue-900 
                                    p-2 rounded-xl
                                    hover:bg-blue-900 hover:border-[3px] transition">
                      <div className="flex gap-3 items-center justify-center hover:text-white">
                        <FaLocationDot size={26} />
                        <p className="text-lg font-semibold">
                          Maktabimiz manzilini ko'rish
                        </p>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default MaktabQabuli;
