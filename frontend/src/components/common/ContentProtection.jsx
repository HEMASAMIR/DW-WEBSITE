'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isExemptFromProtection } from '@/constants/securityConfig';
import { ShieldAlert, AlertTriangle, Lock } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function ContentProtection({ children }) {
  const { user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [watermarkPos, setWatermarkPos] = useState({ top: 20, left: 30 });
  const exempt = isExemptFromProtection(user);

  // Dynamic moving watermark coordinates
  useEffect(() => {
    if (exempt || !user) return;
    const interval = setInterval(() => {
      setWatermarkPos({
        top: Math.floor(Math.random() * 70) + 10,
        left: Math.floor(Math.random() * 60) + 15,
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [exempt, user]);

  useEffect(() => {
    if (exempt) return;

    const triggerWarning = (e) => {
      if (e) {
        try {
          e.preventDefault();
          e.stopPropagation();
        } catch {}
      }
      try {
        if (navigator?.clipboard?.writeText) {
          navigator.clipboard.writeText('');
        }
      } catch {}
      setShowWarning(true);
    };

    const handleKeyDown = (e) => {
      const key = e.key;
      const code = e.code;
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // PrintScreen key
      if (key === 'PrintScreen' || code === 'PrintScreen' || key === 'Snapshot') {
        triggerWarning(e);
        return;
      }

      // Ctrl+P (Print)
      if (ctrl && (key === 'p' || key === 'P')) {
        triggerWarning(e);
        return;
      }

      // Ctrl+S (Save)
      if (ctrl && (key === 's' || key === 'S')) {
        triggerWarning(e);
        return;
      }

      // Ctrl+U (View Source)
      if (ctrl && (key === 'u' || key === 'U')) {
        triggerWarning(e);
        return;
      }

      // Windows/Mac Snipping Tool: Shift+Cmd/Win+S or Ctrl+Shift+S
      if (shift && ctrl && (key === 's' || key === 'S')) {
        triggerWarning(e);
        return;
      }

      // DevTools: F12 or Ctrl+Shift+I / J / C
      if (key === 'F12' || (ctrl && shift && ['i', 'I', 'j', 'J', 'c', 'C'].includes(key))) {
        triggerWarning(e);
        return;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        triggerWarning(e);
      }
    };

    const handleContextMenu = (e) => {
      // Prevent right-click menu on protected media
      e.preventDefault();
    };

    const handleWindowBlur = () => {
      // When user focuses screen recorder, OBS, or snipping tool outside the window, blur screen
      setIsWindowBlurred(true);
    };

    const handleWindowFocus = () => {
      setIsWindowBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWindowBlurred(true);
      } else {
        setIsWindowBlurred(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [exempt]);

  const userIdentifier = user?.email || user?.phone_number || (user?.id ? `ID #${user.id}` : null);

  return (
    <div className={`relative ${!exempt ? 'select-none' : ''}`}>
      {children}

      {/* Moving Dynamic Watermark on Screen */}
      {!exempt && userIdentifier && (
        <div
          className="fixed pointer-events-none select-none z-[999] transition-all duration-1000 ease-in-out opacity-25 hover:opacity-10"
          style={{
            top: `${watermarkPos.top}%`,
            left: `${watermarkPos.left}%`,
            transform: 'translate(-50%, -50%) rotate(-12deg)',
          }}
          dir="ltr"
        >
          <div className="bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-white/20 text-xs sm:text-sm font-black tracking-wider flex items-center gap-2 shadow-2xl">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Deutsche Welt</span>
            <span className="text-amber-300">•</span>
            <span>{userIdentifier}</span>
          </div>
        </div>
      )}

      {/* Screen Inactive / Screen Recording Shield */}
      {!exempt && isWindowBlurred && (
        <div
          className="fixed inset-0 z-[9998] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center text-white"
          onClick={() => setIsWindowBlurred(false)}
        >
          <ShieldAlert className="w-16 h-16 text-amber-400 mb-4 animate-bounce" />
          <h2 className="text-2xl font-black mb-2">{t('المحتوى محمي')}</h2>
          <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
            {t('تم حجب الشاشة تلقائياً لمنع برامج التصوير والتسجيل. انقر هنا للعودة لمتابعة المحتوى.')}
          </p>
          <button
            onClick={() => setIsWindowBlurred(false)}
            className="px-6 py-2.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-black"
          >
            {t('متابعة المشاهدة')}
          </button>
        </div>
      )}

      {/* Security Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900 border-2 border-rose-600 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl shadow-rose-950/50 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-rose-400">
                {t('⚠️ تحذير أمني: تصوير الشاشة ممنوع')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('يُمنع منعاً باتاً التقاط صور للشاشة (Screenshot) أو تسجيل الفيديو لجميع محاضرات ومذكرات الأكاديمية لحماية حقوق الملكية الفكرية.')}
              </p>
            </div>

            {userIdentifier && (
              <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-3 text-xs text-rose-200" dir="ltr">
                <span className="text-slate-400 font-bold block mb-0.5 text-[10px] uppercase tracking-wider">Logged Student Account</span>
                <span className="font-mono font-black text-sm text-amber-300">{userIdentifier}</span>
              </div>
            )}

            <p className="text-[11px] text-amber-400/90 font-bold">
              {t('تم تسجيل هذه المحاولة وربطها ببيانات حسابك. تكرار المحاولة سيعرض الحساب للحظر النهائي فوراً.')}
            </p>

            <button
              onClick={() => setShowWarning(false)}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-sm shadow-lg transition-transform hover:scale-[1.02]"
            >
              {t('فهمت وأتعهد بالالتزام')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
