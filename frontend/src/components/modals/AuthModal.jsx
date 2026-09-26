'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { getErrorMessage } from '@/services/api';
import { X, Lock, Mail, LogIn, UserPlus, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const inputClass =
  'w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400';

export default function AuthModal() {
  const { activeModal, modalData, closeModal } = useModal();
  if (activeModal !== 'auth') return null;
  return <AuthDialog initialMode={modalData?.mode || 'login'} onClose={closeModal} />;
}

function AuthDialog({ initialMode, onClose }) {
  const { login, register, loginWithGoogle } = useAuth();

  // 'login' | 'register' | 'forgot' | 'reset'
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const switchMode = (next) => {
    setMode(next);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const run = async (fn, fallback) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await fn();
    } catch (err) {
      setErrorMsg(getErrorMessage(err, fallback));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    run(async () => {
      await login(email, password);
      onClose();
    }, 'فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!/^\d{11}$/.test(phone)) {
      setErrorMsg('رقم الهاتف يجب أن يكون 11 رقماً بالضبط.');
      return;
    }
    run(async () => {
      await register({ email, password, first_name: firstName, last_name: lastName, phone_number: phone });
      // Sign the new user straight in for a smoother flow.
      await login(email, password);
      onClose();
    }, 'تعذر إنشاء الحساب، يرجى المحاولة مرة أخرى.');
  };

  const handleForgot = (e) => {
    e.preventDefault();
    run(async () => {
      await authService.forgotPassword(email);
      setMode('reset');
      setSuccessMsg('إذا كان البريد مسجلاً لدينا فستصلك رسالة بكود من 6 أرقام (صالح لمدة 10 دقائق).');
    }, 'تعذر إرسال كود إعادة التعيين.');
  };

  const handleReset = (e) => {
    e.preventDefault();
    run(async () => {
      await authService.resetPassword({ email, otp, new_password: password });
      setPassword('');
      setOtp('');
      setMode('login');
      setSuccessMsg('تم تغيير كلمة المرور بنجاح، يمكنك تسجيل الدخول الآن.');
    }, 'الكود غير صحيح أو منتهي الصلاحية.');
  };

  const handleGoogleCredential = (credential) =>
    run(async () => {
      await loginWithGoogle(credential);
      onClose();
    }, 'فشل تسجيل الدخول بحساب جوجل.');

  const isTabMode = mode === 'login' || mode === 'register';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[94vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isTabMode ? (
          <div className="flex justify-center border-b border-slate-800 mb-6 pb-3 gap-6">
            {[
              { key: 'login', label: 'تسجيل الدخول' },
              { key: 'register', label: 'إنشاء حساب جديد' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => switchMode(t.key)}
                className={`font-extrabold text-base pb-2 transition-colors relative ${
                  mode === t.key ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
                {mode === t.key && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400 rounded-full"></div>}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => switchMode('login')} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
              <ArrowRight className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white">استعادة كلمة المرور</h3>
          </div>
        )}

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

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="البريد الإلكتروني" icon={Mail}>
              <input type="email" required autoComplete="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={`${inputClass} pl-10 text-right`} />
            </Field>
            <Field label="كلمة المرور" icon={Lock}>
              <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`${inputClass} pl-10`} />
            </Field>

            <div className="flex justify-start">
              <button type="button" onClick={() => switchMode('forgot')} className="text-xs text-amber-300 hover:text-amber-200 font-semibold">
                نسيت كلمة المرور؟
              </button>
            </div>

            <SubmitButton loading={loading} icon={LogIn} label="دخول المنصة" loadingLabel="جاري التحقق..." />
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">الاسم الأول</label>
                <input type="text" required autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">اسم العائلة</label>
                <input type="text" required autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">البريد الإلكتروني</label>
              <input type="email" required autoComplete="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={`${inputClass} text-right`} />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">رقم الموبايل (11 رقم)</label>
              <input
                type="tel"
                required
                inputMode="numeric"
                autoComplete="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="010xxxxxxxx"
                className={`${inputClass} text-right`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">كلمة المرور</label>
              <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 أحرف على الأقل" className={inputClass} />
            </div>

            <SubmitButton loading={loading} icon={UserPlus} label="إنشاء الحساب" loadingLabel="جاري إنشاء الحساب..." variant="red" />
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">أدخل بريدك المسجل وسنرسل لك كود تحقق من 6 أرقام.</p>
            <Field label="البريد الإلكتروني" icon={Mail}>
              <input type="email" required dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={`${inputClass} pl-10 text-right`} />
            </Field>
            <SubmitButton loading={loading} icon={Mail} label="إرسال الكود" loadingLabel="جاري الإرسال..." />
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <Field label="البريد الإلكتروني" icon={Mail}>
              <input type="email" required dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} pl-10 text-right`} />
            </Field>
            <Field label="كود التحقق (6 أرقام)" icon={KeyRound}>
              <input
                type="text"
                required
                inputMode="numeric"
                pattern="\d{6}"
                dir="ltr"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="______"
                className={`${inputClass} pl-10 text-center tracking-[0.5em] font-mono`}
              />
            </Field>
            <Field label="كلمة المرور الجديدة" icon={Lock}>
              <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pl-10`} />
            </Field>
            <SubmitButton loading={loading} icon={KeyRound} label="تغيير كلمة المرور" loadingLabel="جاري الحفظ..." />
            <button type="button" onClick={() => switchMode('forgot')} className="w-full text-xs text-slate-400 hover:text-white">
              لم يصلك الكود؟ إعادة الإرسال
            </button>
          </form>
        )}

        {isTabMode && GOOGLE_CLIENT_ID && (
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <div className="flex-1 h-px bg-slate-800" />
              <span>أو</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
            <GoogleButton onCredential={handleGoogleCredential} />
          </div>
        )}

      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1">{label}</label>
      <div className="relative">
        {children}
        <Icon className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
      </div>
    </div>
  );
}

function SubmitButton({ loading, icon: Icon, label, loadingLabel, variant = 'amber' }) {
  const colors =
    variant === 'red'
      ? 'from-red-600 to-red-700 text-white hover:from-red-500'
      : 'from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300';
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${colors} font-extrabold text-sm py-3 rounded-xl shadow-lg transition-all disabled:opacity-50`}
    >
      <Icon className="w-4 h-4" />
      <span>{loading ? loadingLabel : label}</span>
    </button>
  );
}

/** Google Identity Services button → sends the ID token to /api/users/auth/google/. */
function GoogleButton({ onCredential }) {
  const ref = useRef(null);
  const callbackRef = useRef(onCredential);

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.google?.accounts?.id || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res) => res?.credential && callbackRef.current(res.credential),
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        locale: 'ar',
        width: ref.current.offsetWidth || 320,
      });
    };

    if (window.google?.accounts?.id) {
      render();
    } else {
      let script = document.getElementById('google-gsi');
      if (!script) {
        script = document.createElement('script');
        script.id = 'google-gsi';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', render);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  return <div ref={ref} className="w-full flex justify-center min-h-[44px]" />;
}
