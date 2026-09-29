'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { getErrorMessage } from '@/services/api';
import { saveFile } from '@/services/courses.service';
import { X, Loader2, AlertCircle, FileText, Download } from 'lucide-react';

import { t, tRich } from '@/lib/i18n';
/**
 * In-site viewer for the authenticated /view/ endpoints.
 * Open with openFileViewer({ title, load: (onProgress) => Promise<{ blob, filename, type }> }).
 */
export default function FileViewerModal() {
  const { activeModal, modalData, closeModal } = useModal();
  if (activeModal !== 'fileViewer' || !modalData?.load) return null;
  return <Viewer title={modalData.title} load={modalData.load} onClose={closeModal} />;
}

const INLINE_TYPES = /pdf|^image\/|^text\/plain/;

const isWordFile = (file) =>
  /\.docx$/i.test(file?.filename || '') || /wordprocessingml/.test(file?.type || '');

/** Renders a .docx blob as paginated HTML (docx-preview is browser-only, so load it lazily). */
function DocxView({ blob }) {
  const bodyRef = useRef(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    import('docx-preview')
      .then(({ renderAsync }) =>
        renderAsync(blob, bodyRef.current, undefined, {
          className: 'docx',
          inWrapper: true,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
          renderHeaders: true,
          renderFooters: true,
          useBase64URL: true,
          // Fixed A4 width overflows phones — let pages flow to the screen width there.
          ignoreWidth: window.innerWidth < 840,
        })
      )
      .then(() => !cancelled && setState('ready'))
      .catch(() => !cancelled && setState('error'));
    return () => {
      cancelled = true;
    };
  }, [blob]);

  return (
    <div className="w-full h-full overflow-auto bg-slate-700" dir="ltr">
      {state === 'loading' && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      )}
      {state === 'error' && (
        <p className="text-center text-sm text-rose-300 py-16" dir="rtl">{t('تعذر عرض ملف الـ Word.')}</p>
      )}
      <div ref={bodyRef} className="docx-host" />
    </div>
  );
}

function Viewer({ title, load, onClose }) {
  return (
    <div className="fixed inset-0 z-[110] flex flex-col bg-slate-950/95 backdrop-blur-md animate-fadeIn">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm font-bold text-white truncate">{title}</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700" aria-label={t('إغلاق')}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <FileContent title={title} load={load} />
    </div>
  );
}

/**
 * Loads an authenticated file and renders it (PDF/image inline, Word via docx-preview, otherwise
 * a "open on your device" fallback). Fills its parent; used by the modal and the book reader page.
 */
export function FileContent({ title, load }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({ ratio: null, loaded: 0 });

  useEffect(() => {
    let cancelled = false;
    load((ratio, loaded) => !cancelled && setProgress({ ratio, loaded }))
      .then((f) => !cancelled && setFile(f))
      .catch((err) => !cancelled && setError(getErrorMessage(err, t('تعذر فتح الملف.'))));
    return () => {
      cancelled = true;
    };
  }, [load]);

  const url = useMemo(() => (file ? URL.createObjectURL(file.blob) : null), [file]);
  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);

  const inline = file && INLINE_TYPES.test(file.type);
  const isImage = file?.type?.startsWith('image/');

  return (
      <div className="flex-1 min-h-0 flex items-center justify-center bg-slate-950" onContextMenu={(e) => e.preventDefault()}>
        {error ? (
          <div className="text-center space-y-3 p-6">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        ) : !file ? (
          <div className="text-center space-y-3">
            <Loader2 className="w-9 h-9 text-amber-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-300">
              {t('جاري فتح الملف')}
              {progress.ratio !== null
                ? ` ${Math.round(progress.ratio * 100)}%`
                : progress.loaded > 0
                  ? ` (${(progress.loaded / 1048576).toFixed(1)} MB)`
                  : '...'}
            </p>
          </div>
        ) : isWordFile(file) ? (
          <DocxView blob={file.blob} />
        ) : inline ? (
          isImage ? (
            // eslint-disable-next-line @next/next/no-img-element -- blob URL of an authenticated file
            <img src={url} alt={title || ''} className="max-w-full max-h-full object-contain" />
          ) : (
            <iframe src={`${url}#toolbar=0&navpanes=0`} title={title || 'file'} className="w-full h-full bg-white" />
          )
        ) : (
          <div className="text-center space-y-4 p-6 max-w-sm">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <p className="text-sm text-slate-200">
              {tRich('الملف <b>{name}</b> من نوع لا يمكن عرضه داخل المتصفح.', { b: (s) => <span className="font-bold" dir="ltr">{s}</span> }, { name: file.filename })}
            </p>
            <button
              onClick={() => saveFile(file)}
              className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-sm px-6 py-2.5 rounded-xl"
            >
              <Download className="w-4 h-4" />
              {t('فتح الملف على جهازك')}
            </button>
          </div>
        )}
      </div>
  );
}
