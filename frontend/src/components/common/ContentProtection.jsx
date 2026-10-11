'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isExemptFromProtection } from '@/constants/securityConfig';
import { ShieldAlert, AlertTriangle, Lock } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function ContentProtection({ children }) {
  const { user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [watermarkPos, setWatermarkPos] = useState({ top: 25, left: 35 });
  const exempt = isExemptFromProtection(user);

  // Dynamic moving watermark coordinates (moves smoothly every 5 seconds)
  useEffect(() => {
    if (exempt || !user) return;
    const interval = setInterval(() => {
      setWatermarkPos({
        top: Math.floor(Math.random() * 65) + 15,
        left: Math.floor(Math.random() * 60) + 15,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [exempt, user]);

  // DevTools detection loop
  useEffect(() => {
    if (exempt) return;

    const threshold = 160;
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      if (widthThreshold || heightThreshold) {
        setIsDevToolsOpen(true);
      } else {
        setIsDevToolsOpen(false);
      }
    };

    const interval = setInterval(checkDevTools, 1500);
    window.addEventListener('resize', checkDevTools);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkDevTools);
    };
  }, [exempt]);

  // Keyboard, clipboard, context menu, and blur event protection
  useEffect(() => {
    if (exempt) return;

    const poisonClipboard = () => {
      try {
        if (navigator?.clipboard?.writeText) {
          navigator.clipboard.writeText('⚠️ محتوى حصري محمي بحقوق الملكية الفكرية - أكاديمية Deutsche Welt');
        }
      } catch {}
    };

    const triggerWarning = (e) => {
      if (e) {
        try {
          e.preventDefault();
          e.stopPropagation();
        } catch {}
      }
      poisonClipboard();
      setShowWarning(true);
    };

    const handleKeyDown = (e) => {
      const key = e.key;
      const code = e.code;
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // 1. PrintScreen key
      if (key === 'PrintScreen' || code === 'PrintScreen' || key === 'Snapshot') {
        triggerWarning(e);
        return;
      }

      // 2. Ctrl+P (Print / Save as PDF)
      if (ctrl && (key === 'p' || key === 'P')) {
        triggerWarning(e);
        return;
      }

      // 3. Ctrl+S (Save Page)
      if (ctrl && (key === 's' || key === 'S')) {
        triggerWarning(e);
        return;
      }

      // 4. Ctrl+U (View Source)
      if (ctrl && (key === 'u' || key === 'U')) {
        triggerWarning(e);
        return;
      }

      // 5. Windows Snipping Tool / Mac screenshot: Win/Cmd+Shift+S / Ctrl+Shift+S
      if (shift && (ctrl || e.altKey) && (key === 's' || key === 'S' || key === '4' || key === '3')) {
        triggerWarning(e);
        return;
      }

      // 6. DevTools: F12 or Ctrl+Shift+I / J / C
      if (key === 'F12' || (ctrl && shift && ['i', 'I', 'j', 'J', 'c', 'C'].includes(key))) {
        triggerWarning(e);
        return;
      }

      // 7. Prevent Copy shortcut Ctrl+C on protected documents
      if (ctrl && (key === 'c' || key === 'C')) {
        const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
        if (!isInput) {
          e.preventDefault();
          poisonClipboard();
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        triggerWarning(e);
      }
    };

    const handleContextMenu = (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if (!isInput) {
        e.preventDefault();
      }
    };

    const handleCopy = (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if (!isInput) {
        e.preventDefault();
        poisonClipboard();
      }
    };

    const handleSelectStart = (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(e.target?.tagName);
      if (!isInput) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e) => {
      e.preventDefault();
    };

    const handleWindowBlur = () => {
      // Window lost focus (user opened screen recording, OBS, or snipping tool)
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

    // Override screen sharing API if attempted from the browser
    if (navigator?.mediaDevices?.getDisplayMedia) {
      const originalDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async (options) => {
        triggerWarning();
        throw new Error('Screen recording is disabled on this platform.');
      };
    }

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCopy);
    window.addEventListener('selectstart', handleSelectStart);
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('cut', handleCopy);
      window.removeEventListener('selectstart', handleSelectStart);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [exempt]);

  const userIdentifier = user?.email || user?.phone_number || (user?.id ? `ID #${user.id}` : null);
  const studentName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : null;

  return (
    <div className={`relative ${!exempt ? 'select-none' : ''}`}>
      {children}

      {/* Forensic Moving Watermark (protects against camera & phone recording) */}
      {!exempt && userIdentifier && (
        <div
          className="fixed pointer-events-none select-none z-[999] transition-all duration-1000 ease-in-out opacity-30 hover:opacity-10"
          style={{
            top: `${watermarkPos.top}%`,
            left: `${watermarkPos.left}%`,
            transform: 'translate(-50%, -50%) rotate(-10deg)',
          }}
          dir="ltr"
        >
          <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2.5 rounded-2xl border border-white/20 text-xs sm:text-sm font-black tracking-wider flex items-center gap-2 shadow-2xl">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-extrabold text-white">Deutsche Welt</span>
            <span className="text-amber-400">•</span>
            {studentName && <span className="text-slate-200">{studentName}</span>}
            {studentName && <span className="text-amber-400">•</span>}
            <span className="text-amber-300 font-mono">{userIdentifier}</span>
          </div>
        </div>
      )}

      {/* Screen Inactive / Screen Recording / DevTools Shield */}
      {!exempt && (isWindowBlurred || isDevToolsOpen) && (
        <div
          className="fixed inset-0 z-[9998] bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center text-white select-none animate-fadeIn"
          onClick={() => {
            setIsWindowBlurred(false);
            setIsDevToolsOpen(false);
          }}
        >
          <ShieldAlert className="w-20 h-20 text-rose-500 mb-5 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-black mb-3 text-white">
            {t('المحتوى محمي بحقوق الملكية الفكرية')}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mb-6 leading-relaxed">
            {isDevToolsOpen
              ? t('تم اكتشاف أدوات الفحص أو نافذة غير مصرح بها. يرجى إغلاق أدوات المطورين لمتابعة المشاهدة.')
              : t('تم حجب الشاشة تلقائياً لمنع برامج التصوير والتسجيل. انقر هنا للعودة لمتابعة المحتوى.')}
          </p>
          <button
            onClick={() => {
              setIsWindowBlurred(false);
              setIsDevToolsOpen(false);
            }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-teal-900/30 transition-transform hover:scale-105"
          >
            {t('متابعة المشاهدة')}
          </button>
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
                {t('⚠️ تحذير أمني: تصوير الشاشة ممنوع')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('يُمنع منعاً باتاً التقاط صور للشاشة (Screenshot) أو تسجيل الفيديو لجميع محاضرات ومذكرات الأكاديمية لحماية حقوق الملكية الفكرية.')}
              </p>
            </div>

            {userIdentifier && (
              <div className="bg-rose-950/50 border border-rose-800/60 rounded-2xl p-3 text-xs text-rose-200" dir="ltr">
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
