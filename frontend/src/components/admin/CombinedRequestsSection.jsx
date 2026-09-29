'use client';

import React, { useState } from 'react';
import RequestsSection from './RequestsSection';
import SubscriptionsSection from './SubscriptionsSection';
import { Inbox, Users2, BookMarked, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Modern switcher between incoming purchase requests and current active subscribers
 */
export default function CombinedRequestsSection({ kind, onChanged }) {
  const [view, setView] = useState('requests');
  const isLevel = kind === 'level';

  return (
    <div className="space-y-6">
      {/* Sleek Integrated Switcher Pill */}
      <div className="flex items-center justify-between gap-3 p-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-sm max-w-xl mx-auto sm:mx-0">
        <button
          type="button"
          onClick={() => setView('requests')}
          className={`flex-1 flex items-center justify-center gap-2.5 h-12 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 ${
            view === 'requests'
              ? 'bg-gradient-to-r from-[#0a2340] to-teal-900 text-white shadow-lg shadow-[#0a2340]/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Inbox className={`w-4 h-4 ${view === 'requests' ? 'text-amber-400' : 'text-slate-400'}`} />
          <span>طلبات الانتظار والتفعيل</span>
          {view === 'requests' && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setView('subscribers')}
          className={`flex-1 flex items-center justify-center gap-2.5 h-12 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 ${
            view === 'subscribers'
              ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-lg shadow-emerald-700/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          {isLevel ? (
            <Users2 className={`w-4 h-4 ${view === 'subscribers' ? 'text-emerald-300' : 'text-slate-400'}`} />
          ) : (
            <BookMarked className={`w-4 h-4 ${view === 'subscribers' ? 'text-emerald-300' : 'text-slate-400'}`} />
          )}
          <span>{isLevel ? 'المشتركون الحاليون' : 'حاملو الكتب الحاليون'}</span>
        </button>
      </div>

      {/* Content Area with smooth transition */}
      <div className="animate-fadeIn">
        {view === 'requests' ? (
          <RequestsSection
            kind={kind}
            onChanged={onChanged}
            onSwitchToSubscribers={() => setView('subscribers')}
          />
        ) : (
          <SubscriptionsSection kind={kind} onChanged={onChanged} />
        )}
      </div>
    </div>
  );
}
