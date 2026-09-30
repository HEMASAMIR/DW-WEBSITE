'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Languages, Moon, Sun } from 'lucide-react';
import PrefToast, { usePrefToast } from '@/components/common/PrefToast';
import EN from './i18n.en';
import DE from './i18n.de';

/**
 * Admin dashboard preferences: language (ar | en | de) and theme (light | dark).
 * Source strings are the Arabic texts themselves; English and German come from ./i18n.en and ./i18n.de.
 * The theme is applied as `data-admin-theme` on <html> (so portals get it too) and styled by
 * app/admin/admin-theme.css.
 */

const LANG_KEY = 'dw_admin_lang';
const THEME_KEY = 'dw_admin_theme';
export const LANGS = ['ar', 'en', 'de'];
const DICTS = { en: EN, de: DE };
const LANG_NAMES = { ar: 'العربية', en: 'English', de: 'Deutsch' };

// Read by the plain formatting helpers (timeAgo, fullDate) that live outside React.
let activeLang = 'ar';
export const getAdminLang = () => activeLang;

export function translate(text, vars, lang = activeLang) {
  let out = (DICTS[lang] && DICTS[lang][text]) ?? text;
  if (process.env.NODE_ENV !== 'production' && lang !== 'ar' && DICTS[lang] && !(text in DICTS[lang])) {
    console.warn(`[admin i18n] missing ${lang}:`, text);
  }
  if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));
  return out;
}

const PrefsContext = createContext({
  lang: 'ar', dir: 'rtl', theme: 'light', t: (s, v) => translate(s, v, 'ar'), setLang: () => {}, setTheme: () => {},
});

const read = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (key, value) => { try { localStorage.setItem(key, value); } catch { /* private mode */ } };

export function AdminPrefsProvider({ children }) {
  const [lang, setLangState] = useState('ar');
  const [theme, setThemeState] = useState('light');

  // Saved choices live in localStorage, which only exists after hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const savedLang = read(LANG_KEY);
    if (LANGS.includes(savedLang)) setLangState(savedLang);
    const savedTheme = read(THEME_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') setThemeState(savedTheme);
    else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) setThemeState('dark');
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-admin-theme', theme);
    return () => root.removeAttribute('data-admin-theme');
  }, [theme]);

  // Children render right after this; the helpers must already see the new language.
  // eslint-disable-next-line react-hooks/globals
  activeLang = lang;

  const [toast, showToast] = usePrefToast();
  const isDark = () => document.documentElement.getAttribute('data-admin-theme') === 'dark';

  // Both are called from the top bar only, so the saved choices restored on load stay silent.
  const setLang = useCallback((next) => {
    setLangState(next);
    write(LANG_KEY, next);
    showToast({
      icon: Languages,
      tone: 'from-teal-400 to-emerald-600',
      dir: next === 'ar' ? 'rtl' : 'ltr',
      dark: isDark(),
      title: translate('تم تغيير لغة لوحة التحكم', null, next),
      text: translate('لوحة التحكم دلوقتي باللغة {name}', { name: LANG_NAMES[next] }, next),
    });
  }, [showToast]);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    write(THEME_KEY, next);
    const dark = next === 'dark';
    showToast({
      icon: dark ? Moon : Sun,
      tone: dark ? 'from-indigo-500 to-violet-700' : 'from-amber-300 to-orange-500',
      dir: activeLang === 'ar' ? 'rtl' : 'ltr',
      dark,
      title: translate(dark ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع الفاتح'),
      text: translate(dark ? 'أهدى على العين في الإضاءة الخافتة' : 'واضح ومريح للشغل طول اليوم'),
    });
  }, [showToast]);
  const t = useCallback((text, vars) => translate(text, vars, lang), [lang]);

  const value = useMemo(
    () => ({ lang, dir: lang === 'ar' ? 'rtl' : 'ltr', theme, t, setLang, setTheme }),
    [lang, theme, t, setLang, setTheme]
  );
  return (
    <PrefsContext.Provider value={value}>
      {children}
      <PrefToast toast={toast} top="top-20" />
    </PrefsContext.Provider>
  );
}

export const useAdminPrefs = () => useContext(PrefsContext);
export const useT = () => useContext(PrefsContext).t;
