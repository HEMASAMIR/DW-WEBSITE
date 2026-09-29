'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toneFor } from '@/constants/levelTones';
import { X, Loader2, CheckCircle2, AlertCircle, AlertTriangle, Inbox, Phone, MessageCircle } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

export function money(value) {
  const n = Number(value);
  if (value === null || value === undefined || Number.isNaN(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'دلوقتي';
  if (diff < 3600) return `من ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `من ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 86400 * 30) return `من ${Math.floor(diff / 86400)} يوم`;
  return new Date(iso).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function fullDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

/** Egyptian mobile → wa.me international form. */
export const waLink = (phone) => `https://wa.me/${String(phone || '').replace(/^0/, '20')}`;

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((type, text) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed bottom-5 left-5 right-5 sm:right-auto z-[80] flex flex-col gap-2 items-stretch sm:items-start pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto animate-fadeIn flex items-start gap-3 rounded-2xl px-4 py-3 shadow-2xl text-sm font-bold max-w-md ${
              t.type === 'ok' ? 'bg-[#0e2c4e] text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {t.type === 'ok' ? <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="leading-relaxed">{t.text}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Confirm dialog (promise based)                                      */
/* ------------------------------------------------------------------ */

const ConfirmContext = createContext(async () => false);
export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((opts) => new Promise((resolve) => {
    resolver.current = resolve;
    setState({ title: 'متأكد؟', confirmText: 'تأكيد', danger: true, input: false, ...opts, value: '' });
  }), []);

  const close = (result) => {
    resolver.current?.(result);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal open={!!state} onClose={() => close(false)} size="sm" hideHeader>
        {state && (
          <div className="text-center space-y-4 py-2">
            <span className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center ${state.danger ? 'bg-rose-50 text-rose-600' : 'bg-teal-50 text-teal-600'}`}>
              {state.danger ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
            </span>
            <h3 className="text-lg font-black text-slate-900">{state.title}</h3>
            {state.text && <p className="text-sm text-slate-500 leading-relaxed">{state.text}</p>}
            {state.input && (
              <Textarea
                rows={3}
                autoFocus
                placeholder={state.inputPlaceholder}
                value={state.value}
                onChange={(e) => setState((s) => ({ ...s, value: e.target.value }))}
              />
            )}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Btn variant="ghost" onClick={() => close(false)}>إلغاء</Btn>
              <Btn variant={state.danger ? 'danger' : 'primary'} onClick={() => close(state.input ? { value: state.value } : true)}>
                {state.confirmText}
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </ConfirmContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons & inputs                                                    */
/* ------------------------------------------------------------------ */

const BTN_VARIANTS = {
  primary: 'bg-[#0e2c4e] text-white hover:bg-teal-700 shadow-lg shadow-[#0e2c4e]/15',
  gold: 'bg-gradient-to-l from-amber-300 to-amber-500 text-slate-950 hover:brightness-105 shadow-lg shadow-amber-500/25',
  success: 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20',
  danger: 'bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/20',
  soft: 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200',
  ghost: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200',
  dangerSoft: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200',
};
const BTN_SIZES = { sm: 'h-9 px-3 text-xs rounded-xl gap-1.5', md: 'h-11 px-5 text-sm rounded-2xl gap-2', icon: 'h-9 w-9 rounded-xl justify-center' };

export function Btn({ variant = 'primary', size = 'md', icon: Icon, loading, children, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center font-black transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap ${BTN_VARIANTS[variant]} ${BTN_SIZES[size]} ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4 shrink-0" /> : null}
      {children}
    </button>
  );
}

const fieldCls =
  'w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition';

export const Input = React.forwardRef(function Input({ className = '', ...props }, ref) {
  return <input ref={ref} {...props} className={`${fieldCls} ${className}`} />;
});

export function Textarea({ className = '', ...props }) {
  return <textarea {...props} className={`${fieldCls} resize-none ${className}`} />;
}

export function Select({ className = '', children, ...props }) {
  return (
    <select {...props} className={`${fieldCls} appearance-none bg-[length:12px] bg-no-repeat bg-[left_1rem_center] pl-9 ${className}`}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='3'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")" }}>
      {children}
    </select>
  );
}

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-black text-slate-600 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-slate-400 font-medium mt-1">{hint}</span>}
    </label>
  );
}

export function Switch({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 disabled:opacity-50"
    >
      <span className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-slate-300'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? 'right-0.5' : 'right-[1.375rem]'}`} />
      </span>
      {label && <span className="text-sm font-bold text-slate-700">{label}</span>}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export function Card({ className = '', children, ...props }) {
  return (
    <div {...props} className={`bg-white rounded-3xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)] ${className}`}>
      {children}
    </div>
  );
}

/** Page banner: navy with the site's teal/gold light, German flag stripe and a gold icon tile. */
export function SectionHeader({ title, subtitle, icon: Icon, actions }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#07192e] via-[#0c2847] to-[#0e3b68] text-white px-6 sm:px-8 py-6 sm:py-7 mb-6 shadow-xl shadow-[#07192e]/20 border border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_120%_at_100%_0%,rgba(20,184,166,0.35),transparent_60%),radial-gradient(ellipse_50%_100%_at_0%_100%,rgba(245,158,11,0.22),transparent_60%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }}
      />
      <div className="absolute top-0 inset-x-0 flex h-1" dir="ltr">
        <span className="flex-1 bg-slate-950" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
      </div>
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {Icon && (
            <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
              <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight">{title}</h2>
            {subtitle && <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-relaxed">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, subtitle, icon: Icon, children, footer, size = 'md', hideHeader }) {
  const [mounted, setMounted] = useState(false);
  // Portal target exists only after hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open || !mounted) return null;

  const width = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' }[size];
  return createPortal(
    <div
      dir="rtl"
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn text-slate-900"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`relative w-full ${width} bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[92vh] flex flex-col`}>
        {!hideHeader && (
          <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-slate-100">
            {Icon && (
              <span className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></span>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-black text-slate-900 truncate">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 font-medium truncate">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center" aria-label="إغلاق">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-[2rem] flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

/** Side panel sliding in from the left (RTL layout). */
export function Drawer({ open, onClose, title, subtitle, children, footer, header }) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open || !mounted) return null;

  return createPortal(
    <div dir="rtl" className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm animate-fadeIn text-slate-900" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside className="absolute inset-y-0 left-0 w-full max-w-xl bg-slate-50 shadow-2xl flex flex-col dw-drawer-in">
        {header || (
          <div className="flex items-center gap-3 px-6 py-5 bg-white border-b border-slate-200">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-black text-slate-900 truncate">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center" aria-label="إغلاق">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">{children}</div>
        {footer && <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap gap-2">{footer}</div>}
      </aside>
    </div>,
    document.body
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

export function LevelChip({ code, size = 'md' }) {
  const tone = toneFor(code);
  const cls = size === 'lg' ? 'w-12 h-12 text-base rounded-2xl' : size === 'sm' ? 'px-2 h-6 text-[11px] rounded-lg' : 'w-10 h-10 text-sm rounded-xl';
  return (
    <span dir="ltr" className={`inline-flex items-center justify-center shrink-0 font-black text-white bg-gradient-to-br ${tone?.badge || 'from-slate-500 to-slate-700'} shadow-md ${cls}`}>
      {code === 'General' ? 'عام' : code}
    </span>
  );
}

const STATUS = {
  pending: { label: 'قيد المراجعة', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500 animate-pulse' },
  approved: { label: 'مقبول ومفعّل', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  rejected: { label: 'مرفوض', cls: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  active: { label: 'نشط', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  inactive: { label: 'موقوف', cls: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  published: { label: 'منشور', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  hidden: { label: 'مخفي', cls: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

export function StatusBadge({ status, label }) {
  const s = STATUS[status] || STATUS.inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-black whitespace-nowrap ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {label || s.label}
    </span>
  );
}

export function Empty({ icon: Icon = Inbox, title, text, action }) {
  return (
    <div className="text-center py-16 px-6">
      <span className="mx-auto w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mb-4">
        <Icon className="w-9 h-9" />
      </span>
      <h4 className="text-base font-black text-slate-800">{title}</h4>
      {text && <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}

export function ErrorBox({ message, onRetry }) {
  return (
    <Card className="p-8 text-center space-y-3">
      <AlertCircle className="w-10 h-10 mx-auto text-rose-500" />
      <p className="text-sm font-bold text-slate-700">{message}</p>
      {onRetry && <Btn variant="ghost" size="sm" onClick={onRetry}>إعادة المحاولة</Btn>}
    </Card>
  );
}

export function PhoneActions({ phone }) {
  if (!phone) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <a href={`tel:${phone}`} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-700 flex items-center justify-center" title="اتصال">
        <Phone className="w-3.5 h-3.5" />
      </a>
      <a href={waLink(phone)} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center" title="واتساب">
        <MessageCircle className="w-3.5 h-3.5" />
      </a>
    </span>
  );
}

export function Avatar({ name, size = 'md' }) {
  const letter = (name || '?').trim().charAt(0).toUpperCase();
  const hue = [...(name || '?')].reduce((a, c) => a + c.charCodeAt(0), 0) % 6;
  const tones = ['from-teal-400 to-emerald-600', 'from-sky-400 to-blue-600', 'from-violet-400 to-purple-600',
    'from-amber-400 to-orange-600', 'from-rose-400 to-pink-600', 'from-cyan-400 to-teal-600'];
  const cls = size === 'lg' ? 'w-16 h-16 text-2xl rounded-2xl' : size === 'sm' ? 'w-8 h-8 text-xs rounded-xl' : 'w-10 h-10 text-sm rounded-xl';
  return (
    <span className={`inline-flex items-center justify-center shrink-0 font-black text-white bg-gradient-to-br ${tones[hue]} ${cls}`}>
      {letter}
    </span>
  );
}

/** Segmented control. options: [{ value, label, count? }] */
export function Segmented({ value, onChange, options }) {
  return (
    <div className="inline-flex flex-wrap gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200/70">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center gap-1.5 px-3.5 h-9 rounded-xl text-xs font-black transition-all ${
              active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {o.label}
            {o.count > 0 && (
              <span className={`min-w-5 h-5 px-1.5 rounded-full text-[10px] flex items-center justify-center ${active ? 'bg-amber-400 text-slate-950' : 'bg-slate-300/70 text-slate-700'}`}>
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
