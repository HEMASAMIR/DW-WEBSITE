'use client';

import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { PLACEMENT_QUIZ_QUESTIONS } from '@/constants/mockData';
import { X, Award, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PlacementQuizModal() {
  const { activeModal, openEnrollModal, closeModal } = useModal();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  if (activeModal !== 'quiz') return null;

  const currentQ = PLACEMENT_QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (index) => {
    setSelectedAnswers({ ...selectedAnswers, [currentStep]: index });
  };

  const handleNext = () => {
    if (currentStep < PLACEMENT_QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate score
      let total = 0;
      PLACEMENT_QUIZ_QUESTIONS.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) {
          total += 1;
        }
      });
      setScore(total);
      setIsFinished(true);
    }
  };

  const getRecommendedLevel = () => {
    if (score <= 2) return { level: 'A1', name: 'المستوى الأساسي (A1)', price: 1200 };
    if (score <= 4) return { level: 'A2', name: 'المستوى فوق الأساسي (A2)', price: 1400 };
    return { level: 'B1', name: 'المستوى المتوسط (B1)', price: 1800 };
  };

  const restartQuiz = () => {
    setCurrentStep(0);
    setSelectedAnswers({});
    setIsFinished(false);
    setScore(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <button
          onClick={closeModal}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">اختبار تحديد المستوى التفاعلي</h3>
            <p className="text-xs text-amber-300 font-medium">قياس المهارات والتوصية بالكورس المناسب</p>
          </div>
        </div>

        {!isFinished ? (
          <div className="space-y-6">
            
            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>سؤال {currentStep + 1} من {PLACEMENT_QUIZ_QUESTIONS.length}</span>
                <span>المستوى المُختبر: {currentQ.level}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-400 to-red-500 h-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / PLACEMENT_QUIZ_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Box */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-white leading-relaxed dir-ltr text-right font-sans">
                {currentQ.question}
              </h4>

              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-right p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                      selectedAnswers[currentStep] === idx
                        ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="dir-ltr">{option}</span>
                    {selectedAnswers[currentStep] === idx && (
                      <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentStep] === undefined}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-sm px-6 py-3 rounded-xl shadow-md transition-all hover:from-amber-300 disabled:opacity-40"
              >
                <span>{currentStep === PLACEMENT_QUIZ_QUESTIONS.length - 1 ? 'عرض النتيجة والتوصية' : 'السؤال التالي'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          /* Finished Result Screen */
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/40">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">نتيجة النتيجة: {score} من {PLACEMENT_QUIZ_QUESTIONS.length}</h4>
              <p className="text-xs text-slate-300 mt-1">بناءً على إجاباتك، مستواك المقترح هو:</p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/40 space-y-3">
              <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                المستوى التوصية
              </span>
              <h3 className="text-2xl font-black text-white">{getRecommendedLevel().name}</h3>
              <p className="text-xs text-slate-400">سجل الآن وابدأ التعلم مع الدفعة القادمة بنفس السعر المخفض.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={restartQuiz}
                className="flex items-center justify-center gap-2 bg-slate-800 text-slate-300 font-bold text-xs py-3 px-4 rounded-xl hover:bg-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة الاختبار</span>
              </button>

              <button
                onClick={() => openEnrollModal(getRecommendedLevel())}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-400 text-slate-950 font-extrabold text-xs py-3 px-4 rounded-xl shadow-md hover:bg-amber-300"
              >
                <span>احجز في مستوى {getRecommendedLevel().level} الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
