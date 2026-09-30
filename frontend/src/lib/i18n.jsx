'use client';

import React, { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Languages } from 'lucide-react';
import PrefToast, { usePrefToast } from '@/components/common/PrefToast';
import EN from './i18n/site.en';
import DE from './i18n/site.de';

/**
 * Site language: Arabic (source, RTL), English and German (LTR).
 * Arabic texts are the translation keys: t('نص') returns the text in the current language.
 * Switching remounts the page tree (<LangRemount>), so every component renders again with the new
 * language — including texts kept in constants and helpers that call t() outside React.
 * The admin dashboard has its own languages (components/admin/prefs.jsx).
 */

export const SITE_LANGS = [
  { value: 'ar', label: 'ع', name: 'العربية', dir: 'rtl', locale: 'ar-EG' },
  { value: 'en', label: 'EN', name: 'English', dir: 'ltr', locale: 'en-GB' },
  { value: 'de', label: 'DE', name: 'Deutsch', dir: 'ltr', locale: 'de-DE' },
];
const DICTS = { en: EN, de: DE };
const STORAGE_KEY = 'dw_lang';

// Only ever changed in the browser (the server always renders Arabic).
let activeLang = 'ar';
export const getLang = () => activeLang;
export const langMeta = (lang = activeLang) => SITE_LANGS.find((l) => l.value === lang) || SITE_LANGS[0];

export function t(text, vars) {
  let out = (DICTS[activeLang] && DICTS[activeLang][text]) ?? text;
  if (process.env.NODE_ENV !== 'production' && activeLang !== 'ar' && typeof text === 'string' && !(text in DICTS[activeLang])) {
    console.warn(`[i18n] missing ${activeLang}:`, text);
  }
  if (vars) out = String(out).replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));
  return out;
}

/**
 * A sentence with styled words, e.g. tRich('كتب <b>أخرى</b> ممكن تعجبك', { b: (s) => <span className="…">{s}</span> }).
 * The whole sentence is one translation, so each language keeps its own word order.
 */
export function tRich(text, tags, vars) {
  const s = String(t(text, vars));
  const parts = [];
  const re = /<(\w+)>(.*?)<\/\1>/g;
  let last = 0;
  let m;
  while ((m = re.exec(s))) {
    if (m.index > last) parts.push(s.slice(last, m.index));
    const render = tags?.[m[1]];
    parts.push(<Fragment key={parts.length}>{render ? render(m[2]) : m[2]}</Fragment>);
    last = re.lastIndex;
  }
  if (last < s.length) parts.push(s.slice(last));
  return parts;
}

const LangContext = createContext({ lang: 'ar', dir: 'rtl', setLang: () => {} });

export function SiteLangProvider({ children }) {
  const [lang, setLangState] = useState('ar');

  // localStorage exists only after hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (DICTS[saved]) setLangState(saved);
    } catch { /* private mode */ }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const meta = langMeta(lang);
    document.documentElement.lang = meta.value;
    document.documentElement.dir = meta.dir;
  }, [lang]);

  // Everything below renders after this line, so t() already answers in the new language.
  // eslint-disable-next-line react-hooks/globals
  activeLang = lang;

  const [toast, showToast] = usePrefToast();

  // Called by the language menu only, so the saved language restored on load stays silent.
  const setLang = useCallback((next) => {
    if (next !== 'ar' && !DICTS[next]) return;
    setLangState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* private mode */ }
    const meta = langMeta(next);
    showToast({
      icon: Languages,
      tone: 'from-teal-400 to-emerald-600',
      dir: meta.dir,
      title: () => t('تم تغيير اللغة'),
      text: () => t('الموقع دلوقتي باللغة {name}', { name: meta.name }),
    });
  }, [showToast]);

  const value = useMemo(() => ({ lang, dir: langMeta(lang).dir, setLang }), [lang, setLang]);
  return (
    <LangContext.Provider value={value}>
      {children}
      <PrefToast toast={toast} top="top-24" />
    </LangContext.Provider>
  );
}

/** Remounts its children when the language changes (see the note at the top). */
export function LangRemount({ children }) {
  const { lang } = useContext(LangContext);
  return <Fragment key={lang}>{children}</Fragment>;
}

export const useSiteLang = () => useContext(LangContext);
