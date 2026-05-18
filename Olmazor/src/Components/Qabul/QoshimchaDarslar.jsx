import React, { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaCalendarDay,
  FaSpinner,
  FaPaperPlane,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

const QoshimchaDarslar = () => {
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  // Ariza modal
  const [modal, setModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [form, setForm] = useState({ ism: '', familiya: '', telefon: '', sinf: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fanlarni backenddan olish
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('http://localhost:4200/subjects');
        const data = await res.json();
        if (data.status === 'success') {
          setSubjects(data.data.subjects);
        }
      } catch (err) {
        console.error('Fanlar yuklanmadi:', err);
      }
      setLoadingSubjects(false);
    };
    fetchSubjects();
  }, []);

  const openArizoModal = (subject) => {
    setSelectedSubject(subject);
    setForm({ ism: '', familiya: '', telefon: '', sinf: '' });
    setSuccess(false);
    setError('');
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4200/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: 'qoshimcha',
          fan: selectedSubject?.name,
        }),
      });
      const data = await res.json();
      if (data.status === 'created') {
        setSuccess(true);
      } else {
        setError(data.message || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setError('Server bilan bog\'lanishda xatolik.');
    }
    setLoading(false);
  };

  return (
    <div className="px-4 sm:px-8 lg:px-[150px] py-6">
      <div className="border border-blue-900 rounded-3xl bg-blue-900">
        <p className="px-4 sm:px-8 lg:px-[70px] py-5 text-xl sm:text-2xl font-bold text-white">
          Maktabimdagi qo'shimcha darslar ro'yxati:
        </p>

        {loadingSubjects ? (
          <div className="flex items-center justify-center py-16">
            <FaSpinner className="text-white text-3xl animate-spin" />
          </div>
        ) : subjects.length === 0 ? (
          <div className="px-4 sm:px-8 lg:px-[70px] pb-8">
            <div className="bg-white/10 rounded-2xl p-8 text-center">
              <p className="text-white/70 text-lg">Hozircha qo'shimcha darslar mavjud emas</p>
              <p className="text-white/50 text-sm mt-2">O'qituvchilar fanlarini qo'shgach bu yerda ko'rinadi</p>
            </div>
          </div>
        ) : (
          <div className="px-4 sm:px-8 lg:px-[70px] pb-8 space-y-4">
            {subjects.map((subject, index) => (
              <div key={subject._id}>
                {/* BUTTON */}
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between
                  bg-blue-700 hover:bg-blue-800
                  px-4 sm:px-6 py-4 rounded-2xl
                  transition-all duration-300 shadow-lg text-white"
                >
                  <div className="flex items-center gap-3 text-base sm:text-lg font-semibold">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="text-left">
                      <span>{subject.name}</span>
                      {subject.teacherId?.name && (
                        <span className="block text-xs text-blue-200 font-normal">👨‍🏫 {subject.teacherId.name}</span>
                      )}
                    </div>
                  </div>
                  <FaChevronDown
                    className={`transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                  />
                </button>

                {/* DROPDOWN */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out
                  ${openIndex === index ? "max-h-[400px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}
                >
                  <div className="bg-white text-gray-800 rounded-2xl p-4">
                    {/* Subject description */}
                    {subject.description && (
                      <p className="text-gray-600 text-sm mb-4 pb-3 border-b border-gray-100">
                        {subject.description}
                      </p>
                    )}

                    {/* Teacher info */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                      <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                        {subject.teacherId?.name?.[0] || '?'}
                      </span>
                      <span>O'qituvchi: <strong>{subject.teacherId?.name || 'Ko\'rsatilmagan'}</strong></span>
                    </div>

                    {/* Enroll button */}
                    <button
                      onClick={() => openArizoModal(subject)}
                      className="w-full bg-blue-900 text-white rounded-xl py-3 font-semibold
                      hover:bg-blue-800 transition flex items-center justify-center gap-2"
                    >
                      <FaPaperPlane size={14} />
                      Bu fanga yozilish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ARIZA MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">

            {/* Close button */}
            <button
              onClick={() => setModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            >
              <FaTimes size={20} />
            </button>

            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Ariza yuborildi!</h3>
                <p className="text-gray-500 text-sm mb-1">
                  <strong>{selectedSubject?.name}</strong> faniga arizangiz muvaffaqiyatli yuborildi.
                </p>
                <p className="text-gray-400 text-sm">Tez orada siz bilan bog'lanamiz.</p>
                <button
                  onClick={() => setModal(false)}
                  className="mt-6 bg-blue-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
                >
                  Yopish
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                    <FaPaperPlane className="text-blue-600" size={18} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Yozilish arizasi</h3>
                  <p className="text-blue-600 font-medium text-sm mt-1">📚 {selectedSubject?.name}</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Ism"
                      value={form.ism}
                      onChange={e => setForm({ ...form, ism: e.target.value })}
                      required
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Familiya"
                      value={form.familiya}
                      onChange={e => setForm({ ...form, familiya: e.target.value })}
                      required
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Telefon raqam (+998...)"
                    value={form.telefon}
                    onChange={e => setForm({ ...form, telefon: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Hozirgi sinf (masalan: 8B)"
                    value={form.sinf}
                    onChange={e => setForm({ ...form, sinf: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-900 text-white rounded-xl py-3.5 font-semibold hover:bg-blue-800 transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><FaSpinner className="animate-spin" /> Yuborilmoqda...</>
                    ) : (
                      <><FaPaperPlane size={14} /> Ariza yuborish</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QoshimchaDarslar;
