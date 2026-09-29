'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useModal } from '@/context/ModalContext';
import { TEACHER_CV_DATA } from '@/constants/siteContent';
import { useContactInfo, whatsappHref } from '@/lib/contactInfo';
import { 
  X, 
  Award, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  FileCheck,
  Globe2,
  PhoneCall
} from 'lucide-react';

import { t } from '@/lib/i18n';
export default function CvModal() {
  const { activeModal, modalData, closeModal } = useModal();
  const contact = useContactInfo();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (modalData?.tab) {
      setActiveTab(modalData.tab);
    }
  }, [modalData]);

  if (activeModal !== 'cv') return null;

  const corporateExperience = [
    {
      company: 'Concentrix',
      role: t('محاضر كورسات الـ Upskilling & مدرب ألماني معتمد'),
      period: t('3 سنوات خبرة بـ Microsoft IT Support'),
      desc: t('تدريب وتأهيل الموظفين والراغبين بالعمل في حسابات ألمانيا برواتب تبدأ من 25,000 جنيه.')
    },
    {
      company: 'Vodafone DE & UK',
      role: 'Senior Customer Advisor & Team Lead',
      period: t('5 سنوات كول سنتر وإدارة جودة'),
      desc: t('إدارة المكالمات المعقدة والـ Incident Management والتحدث المباشر مع العملاء بالألمان.')
    },
    {
      company: 'Deutsche Welt Academy',
      role: t('مؤسس الأكاديمية وكبير مدربي اللغة الألمانية'),
      period: t('2016 - الحاضر (+10 سنوات)'),
      desc: t('تدريس أكثر من 15,000 طالب وإعداد كتب المنهج المعتمدة واجتياز امتحانات Goethe & Telc.')
    }
  ];

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#0f172a]">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-5 end-5 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors z-10 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile Info */}
        <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-200 pb-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-teal-500 shadow-lg shrink-0 bg-slate-900">
            <Image
              src="/assets/images/herr_khaled_1.jpg"
              alt="Herr Khaled El-Halawany"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-start space-y-1.5">
            <div className="inline-flex items-center gap-2 glass-pill px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('السيرة الذاتية والشهادات الرسمية')}</span>
            </div>
            <h3 className="text-2xl font-black text-[#0f172a]">
              Herr Khaled El-Halawany {t('(هير خالد الحلواني)')}
            </h3>
            <p className="text-xs sm:text-sm text-teal-800 font-bold">
              {t('مؤسس أكاديمية دويتشه فيلت • كبير مدربي اللغة الألمانية وتأهيل الشركات')}
            </p>
          </div>
        </div>

        {/* Milestones Stats Bar */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-amber-50 py-3 px-2 rounded-2xl border border-amber-200">
            <span className="block text-amber-700 font-black text-xl font-mono">+15,000</span>
            <span className="text-[10px] text-amber-800 font-bold">{t('طالب ناجح')}</span>
          </div>
          <div className="bg-teal-50 py-3 px-2 rounded-2xl border border-teal-200">
            <span className="block text-teal-700 font-black text-xl font-mono">+10</span>
            <span className="text-[10px] text-teal-800 font-bold">{t('سنوات خبرة')}</span>
          </div>
          <div className="bg-emerald-50 py-3 px-2 rounded-2xl border border-emerald-200">
            <span className="block text-emerald-700 font-black text-xl font-mono">98.4%</span>
            <span className="text-[10px] text-emerald-800 font-bold">{t('نسبة نجاح جوته')}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              activeTab === 'overview' ? 'glass-pill-active' : 'glass-pill'
            }`}
          >
            {t('الخبرة العملية بالشركات')}
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              activeTab === 'education' ? 'glass-pill-active' : 'glass-pill'
            }`}
          >
            {t('المؤهلات والأكاديميات')}
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              activeTab === 'certifications' ? 'glass-pill-active' : 'glass-pill'
            }`}
          >
            {t('اعتمادات Goethe & Telc')}
          </button>
        </div>

        {/* Content Pane */}
        <div className="space-y-4 min-h-[160px]">
          {activeTab === 'overview' && (
            <div className="space-y-3">
              {corporateExperience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[#0f172a] font-extrabold text-sm flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-teal-700" />
                      <span>{t(exp.company)} — {t(exp.role)}</span>
                    </h4>
                    <span className="text-xs text-amber-700 font-mono font-bold">{t(exp.period)}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t(exp.desc)}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-3">
              {TEACHER_CV_DATA.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[#0f172a] font-extrabold text-sm flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-teal-700" />
                      <span>{t(edu.title)}</span>
                    </h4>
                    <span className="text-xs text-teal-800 font-bold">{t(edu.period)}</span>
                  </div>
                  <span className="text-xs text-teal-800 font-bold block">{t(edu.org)}</span>
                  <p className="text-xs text-slate-600">{t(edu.desc)}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-[#0f172a] font-extrabold text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('الاعتمادات والتأهيل للامتحانات الدولية')}</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('مناهج متطورة معتمدة لتدريس المستويات من A1 حتى C1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('تأهيل الأطباء والمهندسين والراغبين بالسفر والعمل بألمانيا')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('إعداد كامل لامتحانات معهد جوته Goethe & Telc و ÖSD')}</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-teal-800 font-semibold">
            Deutsche Welt Academy • Herr Khaled
          </span>
          <a
            href={whatsappHref(contact, t('مرحباً هير خالد، أريد الاستفسار عن الكورسات'))}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pill-gold px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('تواصل مع هير خالد مباشرة')}</span>
          </a>
        </div>

      </div>
    </div>
  );
}
