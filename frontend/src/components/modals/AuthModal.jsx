'use client';

import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { X, User, Lock, Mail, Phone, LogIn, UserPlus, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const { activeModal, modalData, closeModal } = useModal();
  const { login, register } = useAuth();
  
  const [tab, setTab] = useState(modalData?.mode || 'login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');

  if (activeModal !== 'auth') return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await login(username, password);
      closeModal();
    } catch (err) {
      setErrorMsg(err.detail || err.message || 'فشل تسجيل الدخول. تحقق من اسم المستخدم وكلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await register({
        username,
        email,
        password,
        first_name: firstName,
        phone_number: phone
      });
      setSuccessMsg('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
      setTab('login');
    } catch (err) {
      setErrorMsg(err.detail || err.username?.[0] || 'تعذر إنشاء الحساب، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Selection Header */}
        <div className="flex justify-center border-b border-slate-800 mb-6 pb-3 gap-6">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`font-extrabold text-base pb-2 transition-colors relative ${
              tab === 'login' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            تسجيل الدخول
            {tab === 'login' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400 rounded-full"></div>}
          </button>

          <button
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`font-extrabold text-base pb-2 transition-colors relative ${
              tab === 'register' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            إنشاء حساب جديد
            {tab === 'register' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400 rounded-full"></div>}
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs">
            {successMsg}
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">اسم المستخدم أو البريد</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-amber-400"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-amber-400"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-sm py-3 rounded-xl shadow-lg transition-all hover:from-amber-300 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'جاري التحقق...' : 'دخول المنصة'}</span>
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">الاسم الكامل</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="اسمك الكامل"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">اسم المستخدم (بالإنجليزي)</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400 dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400 dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">رقم الواتساب</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010xxxxxxxxx"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400 dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-extrabold text-sm py-3 rounded-xl shadow-lg transition-all hover:from-red-500 disabled:opacity-50 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'جاري التسجيل...' : 'تأكيد حساب جديد'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
