'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { LogOut, Loader2, ShieldCheck } from 'lucide-react';

/** "Are you sure?" dialog shown before signing out (opened via askLogout()). */
export default function LogoutConfirmModal() {
  const { logoutConfirmOpen } = useModal();
  if (!logoutConfirmOpen) return null;
  return <ConfirmDialog />;
}

function ConfirmDialog() {
  const { user, logout } = useAuth();
  const { closeLogoutConfirm, closeModal } = useModal();
  const [busy, setBusy] = useState(false);
  const stayRef = useRef(null);

  // Safe default: focus "stay", Esc cancels
  useEffect(() => {
    stayRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') closeLogoutConfirm(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeLogoutConfirm]);

  const confirm = async () => {
    setBusy(true);
    try {
      await logout();
    } finally {
      closeModal();
      closeLogoutConfirm();
    }
  };

  const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ');
  const initial = (user?.first_name || user?.email || '؟').trim().charAt(0).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget && !busy) closeLogoutConfirm(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
    >
      <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden text-center">
        <div className="flex h-1" dir="ltr">
          <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
        </div>

        <div className="px-6 sm:px-8 pt-8 pb-6 space-y-5">
          <span className="relative inline-flex">
            <span className="absolute inset-0 rounded-full bg-rose-400/30 animate-ping" />
            <span className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-50 to-rose-100 border-4 border-white shadow-lg shadow-rose-500/20 flex items-center justify-center">
              <LogOut className="w-9 h-9 text-rose-600 -scale-x-100" />
            </span>
          </span>

          <div className="space-y-2">
            <h3 id="logout-title" className="text-2xl font-black text-[#0e2c4e]">متأكد إنك عايز تخرج؟</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              هتحتاج تسجّل دخول تاني عشان توصل لمحاضراتك وكتبك.
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-right">
              <span className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-[#0e2c4e] text-white font-black flex items-center justify-center shrink-0">
                {initial}
              </span>
              <span className="min-w-0">
                {name && <span className="block text-sm font-black text-[#0e2c4e] truncate">{name}</span>}
                {user.email && <span className="block text-xs text-slate-500 truncate" dir="ltr">{user.email}</span>}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              ref={stayRef}
              onClick={closeLogoutConfirm}
              disabled={busy}
              className="py-3.5 rounded-2xl bg-[#0e2c4e] hover:bg-teal-700 text-white text-sm font-black transition-colors focus:outline-none focus:ring-4 focus:ring-teal-500/30 disabled:opacity-60"
            >
              لا، خليني
            </button>
            <button
              onClick={confirm}
              disabled={busy}
              className="py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-600 border-2 border-rose-200 hover:border-rose-600 text-rose-600 hover:text-white text-sm font-black inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 -scale-x-100" />}
              {busy ? 'جاري الخروج…' : 'أيوه، اخرج'}
            </button>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            اشتراكاتك وكتبك محفوظة على حسابك
          </p>
        </div>
      </div>
    </div>
  );
}
