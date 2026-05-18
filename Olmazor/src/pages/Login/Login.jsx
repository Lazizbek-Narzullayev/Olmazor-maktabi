import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const [form, setForm] = useState({ userName: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const { login, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      const { token, user } = res.data;
      login(user, token);

      redirect(user.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    }
    setLoading(false);
  };

  const redirect = (role) => {
    if (role === 'admin') navigate('/admin');
    else if (role === 'teacher') navigate('/teacher');
    else navigate('/student');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Back button */}
      <NavLink
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition text-sm font-medium"
      >
        <FaArrowLeft />
        <span>Bosh sahifaga qaytish</span>
      </NavLink>

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://static10.tgstat.ru/channels/_0/ef/efc24d28425fddf68c6a97465ad9f110.jpg"
            className="w-20 h-20 rounded-full mx-auto mb-4 shadow-2xl border-4 border-white/20"
            alt="logo"
          />
          <h1 className="text-3xl font-bold text-white">Olmazor Maktabi</h1>
          <p className="text-blue-200 mt-1 text-sm">Boshqaruv tizimiga kirish</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Kirish</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-400/40 text-red-200 rounded-xl px-4 py-3 mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
              <input
                type="text"
                placeholder="Foydalanuvchi nomi"
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Parol"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl pl-11 pr-11 py-3.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-700 text-white font-semibold rounded-xl py-3.5 transition duration-200 mt-2 shadow-lg shadow-blue-500/30"
            >
              {loading ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Login;
