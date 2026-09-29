'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { getErrorMessage } from '@/services/api';
import {
  X, Lock, Mail, MailCheck, LogIn, UserPlus, AlertCircle, KeyRound, ArrowRight, Eye, EyeOff, User, Phone,
  Loader2, CheckCircle2, ShieldCheck, PlayCircle, BookOpen, MessageCircle, RotateCw, Sparkles,
} from 'lucide-react';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000; // backend: the code expires after 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^01\d{9}$/;

// The backend answers in English — show these in Arabic.
const ERROR_TRANSLATIONS = [
  [/no active account|credentials/i, 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'],
  [/invalid email or otp|invalid otp|otp.*invalid/i, 'الكود غير صحيح. راجع الكود اللي وصلك على الإيميل.'],
  [/expired/i, 'انتهت صلاحية الكود. اطلب كود جديد.'],
  [/already exists/i, 'البريد الإلكتروني ده مسجّل بالفعل. جرّب تسجّل دخول.'],
  [/too common/i, 'كلمة المرور دي شائعة جداً، اختار واحدة أقوى.'],
  [/entirely numeric/i, 'كلمة المرور لازم متكونش أرقام بس.'],
  [/too short/i, 'كلمة المرور قصيرة، لازم 8 حروف على الأقل.'],
  [/too similar/i, 'كلمة المرور شبه بياناتك الشخصية، اختار واحدة مختلفة.'],
  [/phone/i, 'رقم الموبايل غير صحيح (11 رقم ويبدأ بـ 01).'],
];

function friendlyError(err, fallback) {
  const msg = getErrorMessage(err, fallback);
  const hit = ERROR_TRANSLATIONS.find(([re]) => re.test(msg));
  return hit ? hit[1] : msg;
}

const isOtpError = (msg) => /الكود/.test(msg);

const BRAND_COPY = {
  login: { title: 'أهلاً بيك تاني', text: 'كمّل رحلتك في الألماني من مكان ما وقفت.' },
  register: { title: 'ابدأ رحلتك للألماني', text: 'حساب واحد لكل المستويات من A1 لحد B2، ومعاه الكتب والمذكرات.' },
  forgot: { title: 'ولا يهمك', text: 'هنرجّعلك حسابك في أقل من دقيقة، خطوة بخطوة.' },
};

const FEATURES = [
  { icon: PlayCircle, text: 'محاضرات فيديو من A1 لـ B2' },
  { icon: BookOpen, text: 'كتب ومذكرات Herr Khaled' },
  { icon: MessageCircle, text: 'اسأل وناقش تحت كل درس' },
  { icon: ShieldCheck, text: 'حسابك واشتراكاتك محفوظين' },
];

export default function AuthModal() {
  const { activeModal, modalData, closeModal } = useModal();
  if (activeModal !== 'auth') return null;
  return <AuthDialog initialMode={modalData?.mode || 'login'} onClose={closeModal} />;
}

function AuthDialog({ initialMode, onClose }) {
  const { login, register, loginWithGoogle } = useAuth();

  // 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState(initialMode === 'reset' ? 'forgot' : initialMode);
  // Forgot-password wizard: 'email' → 'otp' → 'password' → 'done'
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // { text, forgotLink? }
  const [notice, setNotice] = useState('');
  const [errorKey, setErrorKey] = useState(0); // re-triggers the shake animation

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [codeExpiresAt, setCodeExpiresAt] = useState(null);
  const [resendAt, setResendAt] = useState(null);

  const busyRef = useRef(false);
  useEffect(() => {
    busyRef.current = loading;
  }, [loading]);

  const safeClose = useCallback(() => {
    if (!busyRef.current) onClose();
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') safeClose(); };
    window.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [safeClose]);

  const showError = (text, extra = {}) => {
    setError({ text, ...extra });
    setErrorKey((k) => k + 1);
  };

  const clearMessages = () => {
    setError(null);
    setNotice('');
  };

  const switchMode = (next) => {
    setMode(next);
    setStep('email');
    setPassword('');
    setConfirm('');
    setOtp('');
    clearMessages();
  };

  const run = async (fn, fallback, onError) => {
    setLoading(true);
    clearMessages();
    try {
      await fn();
    } catch (err) {
      const text = friendlyError(err, fallback);
      if (onError) onError(text, err);
      else showError(text);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Login / register ---------- */

  const handleLogin = (e) => {
    e.preventDefault();
    run(
      async () => {
        await login(email, password);
        onClose();
      },
      'تعذّر تسجيل الدخول، حاول مرة أخرى.',
      (text, err) => showError(text, { forgotLink: err?.response?.status === 401 || /غير صحيحة/.test(text) }),
    );
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!PHONE_RE.test(phone)) return showError('رقم الموبايل لازم يكون 11 رقم ويبدأ بـ 01.');
    if (password.length < 8) return showError('كلمة المرور لازم تكون 8 حروف على الأقل.');
    run(async () => {
      await register({ email, password, first_name: firstName, last_name: lastName, phone_number: phone });
      // Sign the new user straight in for a smoother flow.
      await login(email, password);
      onClose();
    }, 'تعذّر إنشاء الحساب، حاول مرة أخرى.');
  };

  const handleGoogleCredential = (credential) =>
    run(async () => {
      await loginWithGoogle(credential);
      onClose();
    }, 'فشل تسجيل الدخول بحساب جوجل.');

  /* ---------- Forgot password ---------- */

  const sendCode = async () => {
    await authService.forgotPassword(email);
    const now = Date.now();
    setCodeExpiresAt(now + OTP_TTL_MS);
    setResendAt(now + RESEND_COOLDOWN_MS);
    setOtp('');
  };

  const handleSendCode = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) return showError('اكتب بريد إلكتروني صحيح.');
    run(async () => {
      await sendCode();
      setStep('otp');
    }, 'تعذّر إرسال الكود، حاول مرة أخرى.');
  };

  const handleResend = () =>
    run(async () => {
      await sendCode();
      setNotice('بعتنالك كود جديد، الكود القديم مبقاش شغال.');
    }, 'تعذّر إعادة إرسال الكود.');

  const handleOtpNext = (e) => {
    e?.preventDefault();
    if (otp.length !== OTP_LENGTH) return showError('اكتب الكود كامل (6 أرقام).');
    clearMessages();
    setStep('password');
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (password.length < 8) return showError('كلمة المرور لازم تكون 8 حروف على الأقل.');
    if (password !== confirm) return showError('كلمتين المرور مش متطابقين.');
    run(
      async () => {
        await authService.resetPassword({ email, otp, new_password: password });
        try {
          await login(email, password);
        } catch {
          // Password changed but auto sign-in failed — send them to the login form.
          const saved = email;
          switchMode('login');
          setEmail(saved);
          setNotice('تم تغيير كلمة المرور بنجاح، سجّل دخولك بالكلمة الجديدة.');
          return;
        }
        setStep('done');
      },
      'تعذّر تغيير كلمة المرور.',
      (text) => {
        // The backend only checks the code on this final call — send them back to fix it.
        if (isOtpError(text)) {
          setOtp('');
          setStep('otp');
        }
        showError(text);
      },
    );
  };

  const brand = BRAND_COPY[mode];
  const isTabMode = mode === 'login' || mode === 'register';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      onMouseDown={(e) => { if (e.target === e.currentTarget) safeClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div className="dw-auth-in relative w-full sm:max-w-[940px] max-h-[96vh] sm:max-h-[92vh] bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden flex">

        {/* ---------- Form side ---------- */}
        <div className="flex-1 min-w-0 flex flex-col max-h-[96vh] sm:max-h-[92vh] overflow-y-auto">
          {/* Mobile brand strip */}
          <div className="md:hidden relative h-24 shrink-0 bg-[#0e2c4e] overflow-hidden">
            <BrandBackdrop />
            <div className="relative h-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- local static logo */}
              <img src="/assets/images/logo-full-white.png" alt="Deutsche Welt" className="h-14 w-auto" />
            </div>
          </div>

          <button
            onClick={safeClose}
            aria-label="إغلاق"
            className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex-1 px-5 sm:px-10 pt-6 sm:pt-10 pb-8">
            {isTabMode ? (
              <>
                <Heading
                  title={mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                  subtitle={mode === 'login' ? 'ادخل على محاضراتك وكتبك.' : 'مجاناً — وتقدر تشترك في أي مستوى بعدين.'}
                />
                <Tabs mode={mode} onChange={switchMode} disabled={loading} />
              </>
            ) : (
              <ForgotHeader step={step} onBack={() => switchMode('login')} disabled={loading} />
            )}

            <div className="mt-5 space-y-3 empty:hidden">
              {error && (
                <div key={errorKey} className="dw-shake flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-[13px] font-semibold" role="alert">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p>{error.text}</p>
                    {error.forgotLink && (
                      <button type="button" onClick={() => switchMode('forgot')} className="mt-1 text-rose-800 underline underline-offset-4 font-black">
                        نسيت كلمة المرور؟ استرجعها دلوقتي
                      </button>
                    )}
                  </div>
                </div>
              )}
              {notice && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] font-semibold" role="status">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{notice}</p>
                </div>
              )}
            </div>

            <div key={`${mode}-${step}`} className="dw-step-in mt-4">
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
                  <TextField label="البريد الإلكتروني" icon={Mail}>
                    {(cls) => (
                      <NoFillInput type="email" required dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={cls} />
                    )}
                  </TextField>

                  <PasswordField
                    label="كلمة المرور"
                    value={password}
                    onChange={setPassword}
                    noFill
                    labelAction={
                      <button type="button" onClick={() => switchMode('forgot')} className="text-xs font-black text-teal-700 hover:text-teal-600">
                        نسيت كلمة المرور؟
                      </button>
                    }
                  />

                  <PrimaryButton loading={loading} icon={LogIn} label="دخول" loadingLabel="بنتحقق من بياناتك…" />
                </form>
              )}

              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <TextField label="الاسم الأول" icon={User}>
                      {(cls) => <input type="text" required autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={cls} />}
                    </TextField>
                    <TextField label="اسم العائلة" icon={User}>
                      {(cls) => <input type="text" required autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={cls} />}
                    </TextField>
                  </div>

                  <TextField label="البريد الإلكتروني" icon={Mail}>
                    {(cls) => <input type="email" required autoComplete="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={cls} />}
                  </TextField>

                  <TextField
                    label="رقم الموبايل"
                    icon={Phone}
                    hint={phone && !PHONE_RE.test(phone) ? `${phone.length}/11 — لازم يبدأ بـ 01` : null}
                    valid={PHONE_RE.test(phone)}
                  >
                    {(cls) => (
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        autoComplete="tel"
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(toLatinDigits(e.target.value).replace(/\D/g, '').slice(0, 11))}
                        placeholder="01xxxxxxxxx"
                        className={cls}
                      />
                    )}
                  </TextField>

                  <PasswordField label="كلمة المرور" value={password} onChange={setPassword} autoComplete="new-password" placeholder="8 حروف على الأقل" showStrength />

                  <PrimaryButton loading={loading} icon={UserPlus} label="إنشاء الحساب" loadingLabel="بنجهّز حسابك…" />
                </form>
              )}

              {mode === 'forgot' && step === 'email' && (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <StepIntro icon={Mail} title="اكتب إيميلك" text="هنبعتلك كود من 6 أرقام على الإيميل اللي سجّلت بيه." />
                  <TextField label="البريد الإلكتروني" icon={Mail}>
                    {(cls) => <input type="email" required autoFocus autoComplete="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={cls} />}
                  </TextField>
                  <PrimaryButton loading={loading} icon={MailCheck} label="ابعت الكود" loadingLabel="بنبعت الكود…" />
                </form>
              )}

              {mode === 'forgot' && step === 'otp' && (
                <form onSubmit={handleOtpNext} className="space-y-5">
                  <StepIntro
                    icon={MailCheck}
                    title="شوف الإيميل بتاعك"
                    text={
                      <>
                        لو الحساب موجود، هيوصلك كود على:
                        <span dir="ltr" className="block my-0.5 font-black text-[#0e2c4e] text-right truncate">{email.trim()}</span>
                        بص كمان في الـ Spam.
                      </>
                    }
                  />
                  <OtpInput
                    value={otp}
                    onChange={(v) => { setOtp(v); if (error) setError(null); }}
                    onComplete={() => { clearMessages(); setStep('password'); }}
                    invalid={!!error}
                  />
                  <CodeTimers expiresAt={codeExpiresAt} resendAt={resendAt} onResend={handleResend} loading={loading} />
                  <PrimaryButton loading={false} disabled={otp.length !== OTP_LENGTH} icon={ArrowRight} iconFlip label="التالي" />
                  <button type="button" onClick={() => { clearMessages(); setStep('email'); }} className="w-full text-xs font-bold text-slate-500 hover:text-[#0e2c4e]">
                    الإيميل غلط؟ غيّره
                  </button>
                </form>
              )}

              {mode === 'forgot' && step === 'password' && (
                <form onSubmit={handleReset} className="space-y-4">
                  <StepIntro icon={KeyRound} title="اختار كلمة مرور جديدة" text="استخدم 8 حروف على الأقل، والأحسن تخلط حروف وأرقام ورموز." />
                  <PasswordField label="كلمة المرور الجديدة" value={password} onChange={setPassword} autoComplete="new-password" autoFocus showStrength />
                  <PasswordField
                    label="أكّد كلمة المرور"
                    value={confirm}
                    onChange={setConfirm}
                    autoComplete="new-password"
                    matchState={confirm ? confirm === password : null}
                  />
                  <PrimaryButton loading={loading} icon={ShieldCheck} label="حفظ كلمة المرور" loadingLabel="بنحفظ…" />
                  <button type="button" onClick={() => { clearMessages(); setStep('otp'); }} className="w-full text-xs font-bold text-slate-500 hover:text-[#0e2c4e]">
                    رجوع لتعديل الكود
                  </button>
                </form>
              )}

              {mode === 'forgot' && step === 'done' && (
                <div className="text-center space-y-5 py-4">
                  <div className="dw-pop mx-auto w-20 h-20 rounded-full bg-emerald-50 ring-8 ring-emerald-50/60 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-black text-[#0e2c4e]">تم تغيير كلمة المرور 🎉</h3>
                    <p className="text-sm text-slate-500">ودخّلناك على حسابك على طول. يلا نكمّل تعلّم.</p>
                  </div>
                  <PrimaryButton type="button" onClick={onClose} icon={Sparkles} label="يلا بينا" />
                </div>
              )}
            </div>

            {isTabMode && GOOGLE_CLIENT_ID && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span>أو كمّل بـ</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <GoogleButton onCredential={handleGoogleCredential} />
              </div>
            )}

            {isTabMode && (
              <p className="mt-6 text-center text-[13px] text-slate-500">
                {mode === 'login' ? 'لسه معندكش حساب؟ ' : 'عندك حساب بالفعل؟ '}
                <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} className="font-black text-teal-700 hover:text-teal-600">
                  {mode === 'login' ? 'اعمل حساب مجاناً' : 'سجّل دخول'}
                </button>
              </p>
            )}
          </div>
        </div>

        {/* ---------- Brand side (desktop) ---------- */}
        <aside className="hidden md:flex relative w-[42%] shrink-0 bg-[#0e2c4e] text-white overflow-hidden flex-col justify-between p-10">
          <BrandBackdrop />
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element -- local static logo */}
            <img src="/assets/images/logo-full-white.png" alt="Deutsche Welt" className="h-20 w-auto" />
          </div>

          <div key={mode} className="relative dw-step-in space-y-3">
            <h2 id="auth-title" className="text-3xl font-black leading-tight">{brand.title}</h2>
            <p className="text-sm text-white/70 leading-relaxed">{brand.text}</p>
          </div>

          <ul className="relative space-y-3">
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <li key={text} className="dw-step-in flex items-center gap-3 text-sm font-semibold text-white/90" style={{ animationDelay: `${i * 70}ms` }}>
                <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-amber-300" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <p className="relative text-[11px] text-white/50 font-semibold" dir="ltr">Deutsch lernen — Schritt für Schritt.</p>
        </aside>
      </div>
    </div>
  );
}

/* ================= Pieces ================= */

function BrandBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.55),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.35),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '14px 14px' }}
      />
      <div className="absolute top-0 inset-x-0 flex h-1.5" dir="ltr">
        <span className="flex-1 bg-slate-950" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
      </div>
    </>
  );
}

function Heading({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h3 className="text-2xl sm:text-[1.7rem] font-black text-[#0e2c4e]">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function Tabs({ mode, onChange, disabled }) {
  return (
    <div className="relative grid grid-cols-2 p-1 rounded-2xl bg-slate-100" role="tablist">
      <span
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ right: mode === 'login' ? 4 : 'calc(50%)' }}
        aria-hidden
      />
      {[
        { key: 'login', label: 'تسجيل الدخول', icon: LogIn },
        { key: 'register', label: 'حساب جديد', icon: UserPlus },
      ].map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={mode === key}
          disabled={disabled}
          onClick={() => mode !== key && onChange(key)}
          className={`relative z-10 flex items-center justify-center gap-2 py-2.5 text-sm font-black transition-colors ${
            mode === key ? 'text-[#0e2c4e]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

const FORGOT_STEPS = [
  { key: 'email', label: 'الإيميل' },
  { key: 'otp', label: 'الكود' },
  { key: 'password', label: 'كلمة جديدة' },
];

function ForgotHeader({ step, onBack, disabled }) {
  const current = step === 'done' ? FORGOT_STEPS.length : FORGOT_STEPS.findIndex((s) => s.key === step);
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-[#0e2c4e] mb-4"
      >
        <ArrowRight className="w-4 h-4" />
        رجوع لتسجيل الدخول
      </button>
      <h3 className="text-2xl sm:text-[1.7rem] font-black text-[#0e2c4e]">استرجاع كلمة المرور</h3>

      <ol className="mt-5 flex items-center gap-2">
        {FORGOT_STEPS.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={s.key} className="flex-1 min-w-0">
              <div className={`h-1.5 rounded-full transition-colors duration-500 ${done ? 'bg-teal-500' : active ? 'bg-amber-400' : 'bg-slate-200'}`} />
              <span className={`mt-1.5 flex items-center gap-1 text-[11px] font-black ${done ? 'text-teal-700' : active ? 'text-[#0e2c4e]' : 'text-slate-400'}`}>
                {done ? <CheckCircle2 className="w-3 h-3" /> : <span className="tabular-nums">{i + 1}.</span>}
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StepIntro({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-l from-teal-50 to-amber-50/60 border border-teal-100">
      <span className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-teal-600" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-black text-[#0e2c4e]">{title}</p>
        <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

const fieldBase =
  'w-full h-12 rounded-2xl bg-slate-50 border-2 border-slate-200 pr-11 text-[15px] text-slate-900 placeholder:text-slate-400 text-right ' +
  'transition-all focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10';

function TextField({ label, icon: Icon, hint, valid, labelAction, extraPadding = 'pl-4', children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-black text-slate-700">{label}</label>
        {labelAction}
      </div>
      <div className="relative group">
        {children(`${fieldBase} ${extraPadding}`)}
        <Icon className="w-[18px] h-[18px] text-slate-400 group-focus-within:text-teal-600 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
        {valid && <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />}
      </div>
      {hint && <p className="mt-1.5 text-[11px] font-semibold text-amber-700" dir="rtl">{hint}</p>}
    </div>
  );
}

function PasswordField({ label, value, onChange, autoComplete, autoFocus, placeholder = '••••••••', showStrength, matchState, noFill, labelAction }) {
  const [visible, setVisible] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const Input = noFill ? NoFillInput : 'input';

  const onKey = (e) => setCapsOn(!!e.getModifierState?.('CapsLock'));

  return (
    <div>
      <TextField label={label} icon={Lock} extraPadding="pl-12" labelAction={labelAction}>
        {(cls) => (
          <>
            <Input
              type={visible ? 'text' : 'password'}
              required
              minLength={noFill ? undefined : 8}
              autoComplete={autoComplete}
              autoFocus={autoFocus}
              dir="ltr"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyUp={onKey}
              onKeyDown={onKey}
              placeholder={placeholder}
              className={`${cls} ${matchState === false ? '!border-rose-300' : matchState ? '!border-emerald-400' : ''}`}
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#0e2c4e] hover:bg-slate-200/70 transition-colors"
            >
              {visible ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </>
        )}
      </TextField>
      {capsOn && <p className="mt-1.5 text-[11px] font-bold text-amber-700">⚠︎ زرار Caps Lock شغّال</p>}
      {matchState === false && <p className="mt-1.5 text-[11px] font-bold text-rose-600">كلمتين المرور مش متطابقين</p>}
      {showStrength && value && <StrengthMeter value={value} />}
    </div>
  );
}

const STRENGTH = [
  { label: 'ضعيفة جداً', color: 'bg-rose-500', text: 'text-rose-600' },
  { label: 'ضعيفة', color: 'bg-orange-500', text: 'text-orange-600' },
  { label: 'متوسطة', color: 'bg-amber-400', text: 'text-amber-700' },
  { label: 'كويسة', color: 'bg-teal-500', text: 'text-teal-700' },
  { label: 'قوية جداً', color: 'bg-emerald-500', text: 'text-emerald-700' },
];

function passwordScore(pw) {
  if (pw.length < 8) return 0;
  let score = 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw) && /\D/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  return Math.min(score, 4);
}

function StrengthMeter({ value }) {
  const score = passwordScore(value);
  const s = STRENGTH[score];
  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="flex-1 grid grid-cols-4 gap-1" dir="rtl">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-1.5 rounded-full transition-colors duration-300 ${i <= Math.max(score, 1) ? s.color : 'bg-slate-200'}`} />
        ))}
      </div>
      <span className={`text-[11px] font-black ${s.text}`}>{value.length < 8 ? `${value.length}/8` : s.label}</span>
    </div>
  );
}

function PrimaryButton({ loading, disabled, icon: Icon, iconFlip, label, loadingLabel, type = 'submit', onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className="dw-shine group w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-[#0e2c4e] hover:bg-teal-700 text-white font-black text-[15px] shadow-lg shadow-[#0e2c4e]/20 transition-all active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-teal-500/30 disabled:opacity-50 disabled:pointer-events-none"
    >
      {loading ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Icon className={`w-[18px] h-[18px] ${iconFlip ? '-scale-x-100' : ''}`} />}
      <span>{loading ? loadingLabel : label}</span>
    </button>
  );
}

/* ---------- OTP ---------- */

const toLatinDigits = (s) => s.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

function OtpInput({ value, onChange, onComplete, invalid }) {
  const refs = useRef([]);
  const focusAt = (i) => {
    const el = refs.current[Math.max(0, Math.min(i, OTP_LENGTH - 1))];
    el?.focus();
    el?.select();
  };

  useEffect(() => {
    focusAt(value.length);
    // Only on mount — later focus moves are driven by typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus moves after the new value renders — otherwise onFocus sees the old value and bounces back.
  const pendingFocus = useRef(null);
  useEffect(() => {
    if (pendingFocus.current === null) return;
    focusAt(pendingFocus.current);
    pendingFocus.current = null;
  }, [value]);

  const commit = (next, focusIndex) => {
    const clean = next.slice(0, OTP_LENGTH);
    if (clean.length === OTP_LENGTH && clean !== value) {
      onChange(clean);
      onComplete?.(clean);
    } else if (clean === value) {
      focusAt(focusIndex);
    } else {
      pendingFocus.current = focusIndex;
      onChange(clean);
    }
  };

  const insert = (i, digits) => {
    const start = Math.min(i, value.length);
    commit(value.slice(0, start) + digits + value.slice(start + digits.length), start + digits.length);
  };

  return (
    <div className={`flex justify-center gap-2 sm:gap-2.5 ${invalid ? 'dw-shake' : ''}`} dir="ltr">
      {Array.from({ length: OTP_LENGTH }, (_, i) => {
        const char = value[i] || '';
        return (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={char}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            aria-label={`رقم ${i + 1} من الكود`}
            onFocus={(e) => {
              if (i > value.length) focusAt(value.length);
              else e.target.select();
            }}
            onChange={(e) => {
              const digits = toLatinDigits(e.target.value).replace(/\D/g, '');
              if (!digits) return;
              // Typing into a filled box yields old+new digit — keep the new one.
              // Longer input (SMS autofill) fills forward from this box.
              const typed = char && digits.length === 2 ? (digits[0] === char ? digits[1] : digits[0]) : digits;
              insert(i, typed);
            }}
            onPaste={(e) => {
              e.preventDefault();
              const digits = toLatinDigits(e.clipboardData.getData('text')).replace(/\D/g, '');
              if (digits) commit((value.slice(0, Math.min(i, value.length)) + digits), i + digits.length);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                e.preventDefault();
                if (char) commit(value.slice(0, i) + value.slice(i + 1), i);
                else if (i > 0) commit(value.slice(0, i - 1) + value.slice(i), i - 1);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                focusAt(i - 1);
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (i < value.length) focusAt(i + 1);
              }
            }}
            className={`w-11 h-14 sm:w-12 sm:h-16 rounded-2xl border-2 text-center text-2xl font-black tabular-nums text-[#0e2c4e] transition-all focus:outline-none focus:ring-4 ${
              invalid
                ? 'border-rose-300 bg-rose-50 focus:ring-rose-500/15 focus:border-rose-400'
                : char
                  ? 'border-teal-400 bg-teal-50/50 focus:ring-teal-500/15 focus:border-teal-500'
                  : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-teal-500/15 focus:border-teal-500'
            }`}
          />
        );
      })}
    </div>
  );
}

function useNow(active) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [active]);
  return now;
}

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

function CodeTimers({ expiresAt, resendAt, onResend, loading }) {
  const now = useNow(!!expiresAt);
  const left = expiresAt ? Math.max(0, Math.ceil((expiresAt - now) / 1000)) : 0;
  const resendIn = resendAt ? Math.max(0, Math.ceil((resendAt - now) / 1000)) : 0;

  return (
    <div className="flex items-center justify-between gap-3 text-xs font-bold">
      <span className={`tabular-nums ${left === 0 ? 'text-rose-600' : left < 60 ? 'text-amber-700' : 'text-slate-500'}`}>
        {left === 0 ? 'الكود انتهى — اطلب واحد جديد' : <>الكود صالح لمدة <span dir="ltr">{mmss(left)}</span></>}
      </span>
      <button
        type="button"
        onClick={onResend}
        disabled={loading || resendIn > 0}
        className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-600 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCw className="w-3.5 h-3.5" />}
        {resendIn > 0 ? <>إعادة الإرسال بعد <span className="tabular-nums" dir="ltr">{resendIn}s</span></> : 'ابعت كود جديد'}
      </button>
    </div>
  );
}

/* ---------- Google ---------- */

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
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        locale: 'ar',
        width: Math.min(ref.current.offsetWidth || 320, 400),
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

/**
 * Login fields must never show someone else's saved email/password (shared devices):
 * read-only until focused (browsers only autofill editable fields on load), autocomplete off,
 * and a random name so saved credentials are not matched.
 */
function NoFillInput({ type, ...props }) {
  const [locked, setLocked] = useState(true);
  const [name] = useState(() => `f_${Math.random().toString(36).slice(2, 10)}`);
  return (
    <input
      {...props}
      type={type}
      name={name}
      autoComplete={type === 'password' ? 'new-password' : 'off'}
      data-lpignore="true"
      data-1p-ignore="true"
      readOnly={locked}
      onFocus={() => setLocked(false)}
      onTouchStart={() => setLocked(false)}
    />
  );
}
