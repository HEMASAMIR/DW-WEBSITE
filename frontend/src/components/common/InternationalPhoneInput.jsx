'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  toLatinDigits,
  parsePhoneNumber,
  buildFullNumber,
  isPhoneValid,
  findCountry,
} from '@/constants/countries';
import { Phone, CheckCircle2, ChevronDown, Search, X } from 'lucide-react';
import { t } from '@/lib/i18n';

/**
 * Modern International Phone Input with country selector and auto-formatting
 */
export default function InternationalPhoneInput({
  value = '',
  onChange,
  label,
  required = false,
  disabled = false,
  darkMode = false,
  placeholder,
  autoFocus = false,
  showHint = true,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  // Initialize selected country & local digits from initial value
  const initialParsed = useMemo(() => parsePhoneNumber(value), []);
  const [selectedCountry, setSelectedCountry] = useState(initialParsed.country || DEFAULT_COUNTRY);
  const [localNumber, setLocalNumber] = useState(initialParsed.localNumber || '');

  // Keep internal state synchronized when value changes from outside (e.g. form reset or user load)
  useEffect(() => {
    if (!value) {
      setLocalNumber('');
      return;
    }
    const parsed = parsePhoneNumber(value, selectedCountry);
    if (parsed.country.code !== selectedCountry.code) {
      setSelectedCountry(parsed.country);
    }
    setLocalNumber(parsed.localNumber);
  }, [value]);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Filter countries for dropdown
  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.nameAr.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.nameDe.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  // Prioritized vs other countries
  const { priorityList, normalList } = useMemo(() => {
    if (search.trim()) {
      return { priorityList: [], normalList: filteredCountries };
    }
    return {
      priorityList: filteredCountries.filter((c) => c.priority),
      normalList: filteredCountries.filter((c) => !c.priority),
    };
  }, [filteredCountries, search]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearch('');
    // Re-evaluate full number with new country
    const full = buildFullNumber(country, localNumber);
    const valid = isPhoneValid(country, localNumber);
    onChange?.(full, { country, localNumber, isValid: valid });
    setTimeout(() => phoneInputRef.current?.focus(), 50);
  };

  const handleInputChange = (e) => {
    let raw = toLatinDigits(e.target.value);

    // If user typed/pasted + or 00 or started with full international number
    const cleanDigits = raw.replace(/\D/g, '');
    if (raw.trim().startsWith('+') || raw.trim().startsWith('00') || cleanDigits.length >= 7) {
      const parsed = parsePhoneNumber(raw, selectedCountry);
      if (parsed.country.code !== selectedCountry.code) {
        setSelectedCountry(parsed.country);
        setLocalNumber(parsed.localNumber);
        onChange?.(parsed.fullNumber, {
          country: parsed.country,
          localNumber: parsed.localNumber,
          isValid: parsed.isValid,
        });
        return;
      }
    }

    // Otherwise clean non-digits
    const digits = raw.replace(/\D/g, '').slice(0, 15);
    setLocalNumber(digits);

    const full = buildFullNumber(selectedCountry, digits);
    const valid = isPhoneValid(selectedCountry, digits);
    onChange?.(full, { country: selectedCountry, localNumber: digits, isValid: valid });
  };

  const isValid = useMemo(() => isPhoneValid(selectedCountry, localNumber), [selectedCountry, localNumber]);

  // Placeholder hint depending on country
  const dynamicPlaceholder = useMemo(() => {
    if (placeholder) return placeholder;
    return '1234567890';
  }, [placeholder]);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={`block text-xs font-black mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Main Container */}
      <div
        className={`relative flex items-center w-full h-12 rounded-2xl border-2 transition-all ${
          darkMode
            ? 'bg-slate-950 border-slate-800 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/10'
            : 'bg-slate-50 border-slate-200 focus-within:bg-white focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10'
        } ${isValid ? (darkMode ? 'border-amber-400/80' : 'border-teal-500/80') : ''}`}
      >
        {/* Country Selector Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`flex items-center gap-1.5 px-3 h-full rounded-s-2xl border-e transition-colors select-none shrink-0 ${
            darkMode
              ? 'border-slate-800 hover:bg-slate-900 text-white'
              : 'border-slate-200 hover:bg-slate-100 text-slate-800'
          }`}
          title={`${selectedCountry.nameAr} (${selectedCountry.dialCode})`}
        >
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className="text-xs font-black tabular-nums" dir="ltr">
            {selectedCountry.dialCode}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
        </button>

        {/* Local Number Input */}
        <div className="relative flex-1 h-full flex items-center">
          <input
            ref={phoneInputRef}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            autoFocus={autoFocus}
            disabled={disabled}
            required={required}
            dir="ltr"
            value={localNumber}
            onChange={handleInputChange}
            placeholder={dynamicPlaceholder}
            className={`w-full h-full px-3 text-[15px] font-medium bg-transparent focus:outline-none placeholder:text-slate-400 text-start ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          />

          {/* Validation Checkmark */}
          {isValid && (
            <div className="pe-3 flex items-center pointer-events-none animate-in fade-in zoom-in duration-200">
              <CheckCircle2 className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-emerald-500'}`} />
            </div>
          )}
        </div>
      </div>

      {/* Country Dropdown Panel */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute top-[calc(100%+6px)] inset-x-0 z-50 rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white shadow-black/60' : 'bg-white border-slate-200 text-slate-900 shadow-slate-900/15'
          }`}
          style={{ maxHeight: '340px' }}
        >
          {/* Search Box */}
          <div className={`p-2.5 border-b sticky top-0 z-10 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="relative flex items-center">
              <Search className={`w-4 h-4 absolute start-3 pointer-events-none ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('ابحث عن اسم الدولة أو كود الاتصال…')}
                className={`w-full h-9 ps-9 pe-8 text-xs rounded-xl border focus:outline-none transition-colors ${
                  darkMode
                    ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-amber-400'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500'
                }`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className={`absolute end-2 p-1 rounded-md ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List of Countries */}
          <div className="overflow-y-auto max-h-[270px] divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
            {priorityList.length > 0 && (
              <div className="py-1">
                <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {t('الأكثر استخداماً')}
                </div>
                {priorityList.map((c) => (
                  <CountryRow
                    key={c.code}
                    country={c}
                    isSelected={selectedCountry.code === c.code}
                    darkMode={darkMode}
                    onSelect={handleCountrySelect}
                  />
                ))}
              </div>
            )}

            {normalList.length > 0 && (
              <div className="py-1">
                {priorityList.length > 0 && (
                  <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t('جميع الدول')}
                  </div>
                )}
                {normalList.map((c) => (
                  <CountryRow
                    key={c.code}
                    country={c}
                    isSelected={selectedCountry.code === c.code}
                    darkMode={darkMode}
                    onSelect={handleCountrySelect}
                  />
                ))}
              </div>
            )}

            {priorityList.length === 0 && normalList.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                {t('لم يتم العثور على أي دولة مطابقة')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CountryRow({ country, isSelected, darkMode, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(country)}
      className={`w-full flex items-center justify-between px-3 py-2 text-start rounded-xl text-xs transition-colors ${
        isSelected
          ? darkMode
            ? 'bg-amber-400/20 text-amber-300 font-black'
            : 'bg-teal-50 text-teal-800 font-black'
          : darkMode
            ? 'hover:bg-slate-800/80 text-slate-200'
            : 'hover:bg-slate-50 text-slate-700'
      }`}
    >
      <div className="flex items-center gap-2.5 truncate">
        <span className="text-base leading-none shrink-0">{country.flag}</span>
        <span className="truncate">{country.nameAr}</span>
        <span className={`text-[11px] truncate ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>({country.nameEn})</span>
      </div>
      <span className="text-[11px] font-bold tabular-nums text-slate-400 shrink-0 ms-2" dir="ltr">
        {country.dialCode}
      </span>
    </button>
  );
}

