'use client';

import React, { useState, useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import { coursesService } from '@/services/courses.service';
import { getErrorMessage } from '@/services/api';
import LevelView from '@/components/course/LevelView';
import { X, Video, Loader2, AlertCircle } from 'lucide-react';

export default function StudentDashboardModal() {
  const { activeModal, modalData, closeModal } = useModal();
  if (activeModal !== 'studentDashboard') return null;
  return <Dashboard initialLevelId={modalData?.levelId ?? null} onClose={closeModal} />;
}

function Dashboard({ initialLevelId, onClose }) {
  const [levels, setLevels] = useState([]);
  const [levelsLoading, setLevelsLoading] = useState(true);
  const [levelsError, setLevelsError] = useState('');
  const [levelId, setLevelId] = useState(initialLevelId);

  useEffect(() => {
    coursesService
      .getLevels()
      .then((all) => {
        setLevels(all);
        // Default to the first level the student has unlocked.
        setLevelId((current) => current ?? all.find((l) => l.hasAccess)?.id ?? all[0]?.id ?? null);
      })
      .catch((err) => setLevelsError(getErrorMessage(err, 'تعذر تحميل المستويات.')))
      .finally(() => setLevelsLoading(false));
  }, []);

  const currentLevel = levels.find((l) => l.id === levelId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5 max-h-[94vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pl-12">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">محاضراتي</h3>
            <p className="text-xs text-amber-300 font-medium">{currentLevel?.title || 'منصة المحاضرات'}</p>
          </div>
        </div>

        {levels.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/80">
            {levels.map((l) => (
              <button
                key={l.id}
                onClick={() => setLevelId(l.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  l.id === levelId
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>المستوى {l.code}</span>
                {l.hasAccess && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">مفعّل</span>}
              </button>
            ))}
          </div>
        )}

        {levelsLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
        ) : levelsError ? (
          <div className="text-center py-12 space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <p className="text-sm text-rose-300">{levelsError}</p>
          </div>
        ) : currentLevel ? (
          <LevelView key={levelId} level={currentLevel} />
        ) : (
          <p className="text-center text-sm text-slate-400 py-12">لا توجد مستويات متاحة حالياً.</p>
        )}
      </div>
    </div>
  );
}
