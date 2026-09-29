'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { SITE_LANGS, useSiteLang, t } from '@/lib/i18n';

/** Globe button with the three site languages, each named in its own language. */
export default function LangSwitcher({ className = '' }) {
  const { lang, setLang } = useSiteLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SITE_LANGS.find((l) => l.value === lang) || SITE_LANGS[0];

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('اللغة')}
        title={t('اللغة')}
        className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-700 text-xs font-black transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{current.label}</span>
      </button>
      {open && (
        <div role="menu" className="absolute top-full mt-2 end-0 z-50 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-900/10 p-1.5 animate-fadeIn">
          {SITE_LANGS.map((l) => (
            <button
              key={l.value}
              type="button"
              role="menuitemradio"
              aria-checked={l.value === lang}
              lang={l.value}
              dir={l.dir}
              onClick={() => { setOpen(false); if (l.value !== lang) setLang(l.value); }}
              className={`w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-sm font-bold transition-colors text-start ${
                l.value === lang ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="w-7 text-[11px] font-black text-slate-400">{l.label}</span>
              <span className="flex-1">{l.name}</span>
              {l.value === lang && <Check className="w-4 h-4 text-teal-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
