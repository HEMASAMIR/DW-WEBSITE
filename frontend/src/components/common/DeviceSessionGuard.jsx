'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isExemptFromProtection } from '@/constants/securityConfig';
import { pingDeviceSession, getDeviceInfo } from '@/services/device.service';
import { DEFAULT_CONTACT } from '@/constants/siteContent';
import { useModal } from '@/context/ModalContext';
import {
  Smartphone,
  ShieldAlert,
  AlertTriangle,
  LogOut,
  MessageCircle,
  KeyRound,
  ArrowRight,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { t } from '@/lib/i18n';

export default function DeviceSessionGuard() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { openAuthModal } = useModal();
  const [sessionTerminated, setSessionTerminated] = useState(false);
  const [terminatedInfo, setTerminatedInfo] = useState(null);
  const isCheckingRef = useRef(false);

  const exempt = isAdmin || isExemptFromProtection(user);

  const checkSession = useCallback(async (action = 'heartbeat') => {
    if (!isAuthenticated || exempt || isCheckingRef.current) return;
    isCheckingRef.current = true;
    try {
      const res = await pingDeviceSession(action);
      if (res && res.active === false && res.reason === 'new_device_login') {
        setSessionTerminated(true);
        setTerminatedInfo({
          newDevice: res.newDevice || 'هاتف محمول آخر',
          time: new Date(res.switchedAt || Date.now()).toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
        // Log out client-side session immediately
        await logout();
      }
    } catch {
      // Ignore network hiccups
    } finally {
      isCheckingRef.current = false;
    }
  }, [isAuthenticated, exempt, logout]);

  // Initial registration on login
  useEffect(() => {
    if (isAuthenticated && !exempt) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      checkSession('register');
    }
  }, [isAuthenticated, exempt, checkSession]);

  // Periodic heartbeat every 20 seconds
  useEffect(() => {
    if (!isAuthenticated || exempt || sessionTerminated) return;

    const interval = setInterval(() => {
      checkSession('heartbeat');
    }, 20000);

    const handleFocus = () => {
      checkSession('heartbeat');
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [isAuthenticated, exempt, sessionTerminated, checkSession]);

  if (!sessionTerminated) return null;

  const currentDevice = getDeviceInfo();
  const rawWa = DEFAULT_CONTACT.whatsapp || '010552287454';
  const cleanWa = rawWa.replace(/^0/, '20').replace(/\D/g, '');
  const waMsg = encodeURIComponent(
    `مرحباً إدارة دويتشه فيلت، أواجه مشكلة في تسجيل الدخول لحسابي (تم إنهاء الجلسة لدخول جهاز آخر). أرجو المساعدة في فك ربط الأجهزة لحسابي.`
  );
  const waUrl = `https://wa.me/${cleanWa}?text=${waMsg}`;

  const handleTakeoverAndLogin = () => {
    setSessionTerminated(false);
    openAuthModal('login');
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn select-none" dir="rtl">
      <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl shadow-rose-950/50 space-y-6">
        {/* Glow header icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping opacity-75" />
          <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 shadow-xl">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-rose-400">
              <Smartphone className="w-9 h-9" />
            </div>
          </div>
        </div>

        {/* Title and Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t('تنبيه أمان الأجهزة')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {t('تم إنهاء الجلسة لدخول جهاز آخر')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            {t('تم تسجيل الدخول إلى حسابك للتو من جهاز آخر. حرصاً على أمان حسابك وحماية المحتوى التعليمي، لا يُسمح بتشغيل الحساب على أكثر من جهاز في نفس الوقت.')}
          </p>
        </div>

        {/* Session details card */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-xs sm:text-sm space-y-2.5 text-start">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400 font-semibold">{t('الجهاز الذي سجل الدخول:')}</span>
            <span className="font-black text-amber-300">{terminatedInfo?.newDevice || t('هاتف محمول')}</span>
          </div>
          {terminatedInfo?.time && (
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 font-semibold">{t('وقت تسجيل الدخول:')}</span>
              <span className="font-mono text-slate-200">{terminatedInfo.time}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-slate-300 border-t border-slate-800/60 pt-2">
            <span className="text-slate-400 font-semibold">{t('جهازك الحالي:')}</span>
            <span className="font-bold text-slate-400">{currentDevice.deviceName}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <button
            onClick={handleTakeoverAndLogin}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-sm shadow-lg shadow-teal-900/30 transition-all flex items-center justify-center gap-2 group"
          >
            <span>{t('إعادة الدخول وتفعيل هذا الجهاز')}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-1 ltr:-scale-x-100" />
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 text-emerald-400 hover:text-emerald-300 text-xs font-black transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>{t('تواصل مع الإدارة')}</span>
            </a>

            <button
              onClick={() => {
                setSessionTerminated(false);
                openAuthModal('forgotPassword');
              }}
              className="py-3 px-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 text-amber-400 hover:text-amber-300 text-xs font-black transition-colors flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>{t('تغيير كلمة المرور')}</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-normal">
          {t('حسابك محمي ومشفر بالكامل. في حال مشاركة بيانات حسابك مع أطراف أخرى، يتم إلغاء الجلسات السابقة تلقائياً.')}
        </p>
      </div>
    </div>
  );
}
