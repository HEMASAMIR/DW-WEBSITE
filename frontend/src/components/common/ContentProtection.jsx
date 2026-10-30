'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isExemptFromProtection } from '@/constants/securityConfig';
import { AlertTriangle, Lock } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function ContentProtection({ children }) {
  const { user } = useAuth();
  const pathname = usePathname() || '';
  const [showWarning, setShowWarning] = useState(false);
  const [watermarkPos, setWatermarkPos] = useState({ top: 25, left: 35 });
  const exempt = isExemptFromProtection(user);

  // Watermark is ONLY active on video lecture playback or protected reader pages
  const isProtectedMediaPage = pathname.includes('/watch/') || pathname.includes('/read');

  // Dynamic moving watermark coordinates (moves smoothly every 6 seconds)
  useEffect(() => {
    if (exempt || !user || !isProtectedMediaPage) return;
    const interval = setInterval(() => {
      setWatermarkPos({
        top: Math.floor(Math.random() * 65) + 15,
        left: Math.floor(Math.random() * 60) + 15,
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [exempt, user, isProtectedMediaPage]);

  // Safe keyboard protection for logged-in users: PrintScreen, Ctrl+P, Ctrl+U
  useEffect(() => {
    if (exempt || !user) return;

    const handleKeyDown = (e) => {
      const key = e.key;
      const code = e.code;
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // 1. PrintScreen key
      if (key === 'PrintScreen' || code === 'PrintScreen' || key === 'Snapshot') {
        try {
          e.preventDefault();
          e.stopPropagation();
        } catch {}
        setShowWarning(true);
        return;
      }

      // 2. Ctrl+P (Print / Save as PDF)
      if (ctrl && (key === 'p' || key === 'P')) {
        try {
          e.preventDefault();
          e.stopPropagation();
        } catch {}
        setShowWarning(true);
        return;
      }

      // 3. Ctrl+U (View Source)
      if (ctrl && (key === 'u' || key === 'U')) {
        try {
          e.preventDefault();
        } catch {}
        return;
      }

      // 4. Windows Snipping Tool / Mac screenshot: Win/Cmd+Shift+S / Ctrl+Shift+S
      if (shift && (ctrl || e.altKey) && (key === 's' || key === 'S' || key === '4' || key === '3')) {
        try {
          e.preventDefault();
        } catch {}
        setShowWarning(true);
        return;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        setShowWarning(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [exempt, user]);

  const userIdentifier = user?.email || user?.phone_number || (user?.id ? `ID #${user.id}` : null);
  const studentName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : null;

  return (
    <div className="relative">
      {children}

      {/* Forensic Moving Watermark (ONLY on protected video player / book reader pages) */}
      {!exempt && user && userIdentifier && isProtectedMediaPage && (
        <div
          className="fixed pointer-events-none select-none z-[999] transition-all duration-1000 ease-in-out opacity-25"
          style={{
            top: `${watermarkPos.top}%`,
            left: `${watermarkPos.left}%`,
            transform: 'translate(-50%, -50%) rotate(-10deg)',
          }}
          dir="ltr"
        >
          <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-2xl border border-white/20 text-xs sm:text-sm font-black tracking-wider flex items-center gap-2 shadow-2xl">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-extrabold text-white">Deutsche Welt</span>
            <span className="text-amber-400">•</span>
            {studentName && <span className="text-slate-200">{studentName}</span>}
            {studentName && <span className="text-amber-400">•</span>}
            <span className="text-amber-300 font-mono">{userIdentifier}</span>
          </div>
        </div>
      )}

      {/* Security Warning Modal on Screenshot Attempt */}
      {showWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900 border-2 border-rose-600 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl shadow-rose-950/60 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-rose-400">
                {t('⚠️ تنبيه: تصوير الشاشة ممنوع')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('يُرجى عدم التقاط صور للشاشة لمحتوى المنصة لحماية حقوق الملكية الفكرية.')}
              </p>
            </div>

            {userIdentifier && (
              <div className="bg-rose-950/50 border border-rose-800/60 rounded-2xl p-3 text-xs text-rose-200" dir="ltr">
                <span className="text-slate-400 font-bold block mb-0.5 text-[10px] uppercase tracking-wider">Logged Student Account</span>
                <span className="font-mono font-black text-sm text-amber-300">{userIdentifier}</span>
              </div>
            )}

            <button
              onClick={() => setShowWarning(false)}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-sm shadow-lg transition-transform hover:scale-[1.02]"
            >
              {t('متابعة المشاهدة')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
