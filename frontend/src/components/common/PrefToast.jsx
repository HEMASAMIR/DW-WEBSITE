'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

const SHOW_MS = 2600;
const LEAVE_MS = 320;

/**
 * A short, calm confirmation after changing the language or the theme.
 *   const [toast, show] = usePrefToast();
 *   show({ icon: Languages, title, text, tone: 'from-teal-400 to-emerald-600', dir: 'ltr', dark: false });
 *   <PrefToast toast={toast} />
 * Called from event handlers only (not effects), so a saved preference restored on load stays silent.
 */
export function usePrefToast() {
  const [toast, setToast] = useState(null);
  const timers = useRef([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const show = useCallback((data) => {
    clear();
    const id = Date.now();
    setToast({ ...data, id, leaving: false });
    timers.current.push(
      setTimeout(() => setToast((cur) => (cur?.id === id ? { ...cur, leaving: true } : cur)), SHOW_MS),
      setTimeout(() => setToast((cur) => (cur?.id === id ? null : cur)), SHOW_MS + LEAVE_MS)
    );
  }, []);

  useEffect(() => clear, []);
  return [toast, show];
}

// title / text may be functions: they're read while rendering, so a language switch shows them in the new language.
const resolve = (v) => (typeof v === 'function' ? v() : v);

// top: just under the page's own top bar, so the toast never covers the navigation.
export default function PrefToast({ toast, top = 'top-5' }) {
  if (!toast) return null;
  const { icon: Icon, tone, dir = 'rtl', dark, leaving, id } = toast;
  const title = resolve(toast.title);
  const text = resolve(toast.text);

  return (
    <div className={`fixed inset-x-0 ${top} z-[200] flex justify-center px-4 pointer-events-none`} role="status" aria-live="polite">
      <div
        key={id}
        dir={dir}
        className={`dw-keep-light pointer-events-auto relative overflow-hidden flex items-center gap-3.5 ps-2.5 pe-6 py-2.5 rounded-2xl border backdrop-blur-xl min-w-[260px] max-w-[min(24rem,100%)] ${
          leaving ? 'dw-toast-out' : 'dw-toast-in'
        } ${
          dark
            ? 'bg-[#0b1526]/90 border-[#ffffff1a] text-[#f8fafc] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)]'
            : 'bg-[#ffffff]/90 border-[#e2e8f0] text-[#0f172a] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.25)]'
        }`}
      >
        <span className={`relative w-11 h-11 rounded-xl flex items-center justify-center text-[#ffffff] bg-gradient-to-br ${tone} shadow-lg shrink-0`}>
          {Icon && <Icon className="w-5 h-5 dw-toast-icon" />}
          <span className={`absolute -bottom-1 -end-1 w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center ring-2 ${dark ? 'ring-[#0b1526]' : 'ring-[#ffffff]'}`}>
            <Check className="w-3 h-3 text-[#ffffff]" strokeWidth={3.5} />
          </span>
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-black leading-tight">{title}</span>
          {text && <span className={`block text-xs font-semibold mt-1 ${dark ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>{text}</span>}
        </span>
        <span
          className={`absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r ${tone} dw-toast-bar`}
          style={{ transformOrigin: dir === 'rtl' ? 'right' : 'left', animationDuration: `${SHOW_MS}ms` }}
        />
      </div>
    </div>
  );
}
