'use client';

import React from 'react';
import Link from 'next/link';
import { formatDuration } from '@/services/courses.service';
import { formatTotal, totalSeconds } from './useLevelContent';
import { PlayCircle, Clock, ListVideo } from 'lucide-react';

import { t } from '@/lib/i18n';
/** Lessons list (sidebar on the watch page). Each item links to its own watch page. */
export default function Playlist({ levelId, videos, activeId }) {
  const total = totalSeconds(videos);
  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-l from-teal-50 to-white">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <ListVideo className="w-5 h-5 text-teal-600" />
          {t('محتوى المستوى')}
        </h3>
        <p className="text-xs font-bold text-slate-500 mt-0.5">
          {videos.length}{' '}{t('محاضرة')}{total > 0 ? ` • ${formatTotal(total)}` : ''}
        </p>
      </div>
      <ol className="max-h-[70vh] overflow-y-auto divide-y divide-slate-100">
        {videos.map((vid, idx) => {
          const isActive = String(vid.id) === String(activeId);
          return (
            <li key={vid.id}>
              <Link
                href={`/courses/${levelId}/watch/${vid.id}`}
                scroll={false}
                className={`group flex items-center gap-3 px-4 py-3 transition-colors border-s-4 ${
                  isActive ? 'bg-teal-50 border-teal-500' : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    isActive ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700'
                  }`}
                >
                  {isActive ? <span className="dw-eq" aria-label={t('قيد التشغيل')}><span /><span /><span /></span> : idx + 1}
                </span>
                <span className="relative w-24 aspect-video rounded-lg overflow-hidden bg-slate-200 shrink-0">
                  {vid.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- external Bunny CDN thumbnail
                    <img src={vid.thumbnail_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <PlayCircle className="w-6 h-6 text-slate-400 absolute inset-0 m-auto" />
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    className={`block text-sm font-bold leading-snug line-clamp-2 break-words ${isActive ? 'text-teal-800' : 'text-slate-800'}`}
                    dir="auto"
                  >
                    {vid.title}
                  </span>
                  {vid.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 mt-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(vid.length)}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
