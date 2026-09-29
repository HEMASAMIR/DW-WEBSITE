'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { getErrorMessage } from '@/services/api';
import { mediaUrl } from '@/constants/apiRoutes';
import { X, UserCircle, Save, KeyRound, Loader2, Camera } from 'lucide-react';

import { t } from '@/lib/i18n';
const inputClass =
  'w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400';

export default function ProfileModal() {
  const { activeModal, closeModal } = useModal();
  if (activeModal !== 'profile') return null;
  return <ProfileDialog onClose={closeModal} />;
}

function ProfileDialog({ onClose }) {
  const { user, updateProfile } = useAuth();
  const [tab, setTab] = useState('info');

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [photo, setPhoto] = useState(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const localPreview = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
  useEffect(() => () => localPreview && URL.revokeObjectURL(localPreview), [localPreview]);
  const photoPreview = localPreview || mediaUrl(user?.profile_photo);

  const run = async (fn, successText, fallback) => {
    setBusy(true);
    setMsg({ type: '', text: '' });
    try {
      await fn();
      setMsg({ type: 'ok', text: successText });
    } catch (err) {
      setMsg({ type: 'err', text: getErrorMessage(err, fallback) });
    } finally {
      setBusy(false);
    }
  };

  const saveInfo = (e) => {
    e.preventDefault();
    if (phone && !/^\d{11}$/.test(phone)) {
      setMsg({ type: 'err', text: t('رقم الهاتف يجب أن يكون 11 رقماً بالضبط.') });
      return;
    }
    run(async () => {
      let payload = { first_name: firstName.trim(), last_name: lastName.trim(), phone_number: phone };
      if (photo) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
        fd.append('profile_photo', photo);
        payload = fd;
      }
      await updateProfile(payload);
      setPhoto(null);
    }, t('تم حفظ بياناتك بنجاح.'), t('تعذر حفظ البيانات.'));
  };

  const savePassword = (e) => {
    e.preventDefault();
    run(async () => {
      await authService.changePassword({ old_password: oldPassword, new_password: newPassword });
      setOldPassword('');
      setNewPassword('');
    }, t('تم تغيير كلمة المرور بنجاح.'), t('تعذر تغيير كلمة المرور.'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[94vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <UserCircle className="w-8 h-8 text-amber-400" />
          <div>
            <h3 className="text-lg font-bold text-white">{t('حسابي')}</h3>
            {user?.email && <p className="text-xs text-slate-400" dir="ltr">{user.email}</p>}
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          {[
            { key: 'info', label: t('البيانات الشخصية') },
            { key: 'password', label: t('كلمة المرور') },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setMsg({ type: '', text: '' }); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold ${tab === t.key ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {msg.text && (
          <div className={`mb-4 p-3 rounded-xl text-xs border ${msg.type === 'ok' ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-300' : 'bg-red-950/80 border-red-800/60 text-red-300'}`}>
            {msg.text}
          </div>
        )}

        {tab === 'info' ? (
          <form onSubmit={saveInfo} className="space-y-3">
            <label className="flex flex-col items-center gap-2 cursor-pointer pb-2">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-800 border-2 border-amber-400/40">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element -- blob preview / API-hosted avatar
                  <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-full h-full text-slate-600" />
                )}
                <span className="absolute bottom-0 inset-x-0 bg-black/60 flex justify-center py-0.5">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </span>
              </div>
              <span className="text-[11px] text-slate-400">{t('تغيير الصورة')}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">{t('الاسم الأول')}</label>
                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">{t('اسم العائلة')}</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('رقم الموبايل')}</label>
              <input
                type="tel"
                inputMode="numeric"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="010xxxxxxxx"
                className={`${inputClass} text-start`}
              />
            </div>
            <button type="submit" disabled={busy} className="w-full flex items-center justify-center gap-2 bg-amber-400 text-slate-950 font-extrabold text-sm py-3 rounded-xl disabled:opacity-50">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{t('حفظ التعديلات')}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={savePassword} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('كلمة المرور الحالية')}</label>
              <input type="password" autoComplete="current-password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={inputClass} />
              <p className="text-[10px] text-slate-500 mt-1">{t('اتركها فارغة إذا كنت سجلت بحساب جوجل ولم تضع كلمة مرور من قبل.')}</p>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('كلمة المرور الجديدة')}</label>
              <input type="password" required minLength={8} autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
            </div>
            <button type="submit" disabled={busy} className="w-full flex items-center justify-center gap-2 bg-amber-400 text-slate-950 font-extrabold text-sm py-3 rounded-xl disabled:opacity-50">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              <span>{t('تغيير كلمة المرور')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
