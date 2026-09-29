'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/services/api';
import { mediaUrl } from '@/constants/apiRoutes';
import {
  commentsService,
  canStillEdit,
  COMMENT_MAX_LENGTH,
  REMOVED_COMMENT_TEXT,
} from '@/services/comments.service';
import { MessageSquare, Send, Reply, Pencil, Trash2, Loader2, AlertCircle, X, Check } from 'lucide-react';

import { t, langMeta } from '@/lib/i18n';
// Built per call: the language can change while the page is open.
const relativeFormat = () => (typeof Intl !== 'undefined' ? new Intl.RelativeTimeFormat(langMeta().locale, { numeric: 'auto' }) : null);

function timeAgo(iso) {
  const rtf = relativeFormat();
  if (!iso || !rtf) return '';
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return t('الآن');
}

export default function CommentsPanel({ levelId, videoId }) {
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');

  const applyPage = useCallback((data, page) => {
    setCount(data.count ?? data.results?.length ?? 0);
    setNextPage(data.next ? page + 1 : null);
    return data.results || [];
  }, []);

  // The parent keys this component by level+video, so every video starts from a fresh state.
  useEffect(() => {
    let cancelled = false;
    commentsService
      .getComments(levelId, videoId, 1)
      .then((data) => !cancelled && setComments(applyPage(data, 1)))
      .catch((err) => !cancelled && setError(getErrorMessage(err, t('تعذر تحميل التعليقات.'))))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [levelId, videoId, applyPage]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const results = applyPage(await commentsService.getComments(levelId, videoId, nextPage), nextPage);
      setComments((prev) => [...prev, ...results.filter((r) => !prev.some((p) => p.id === r.id))]);
    } catch (err) {
      setError(getErrorMessage(err, t('تعذر تحميل المزيد من التعليقات.')));
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setPosting(true);
    setPostError('');
    try {
      const created = await commentsService.postComment(levelId, videoId, content);
      setComments((prev) => [{ replies: [], reply_count: 0, ...created }, ...prev]);
      setCount((c) => c + 1);
      setText('');
    } catch (err) {
      setPostError(getErrorMessage(err, t('فشل إرسال التعليق.')));
    } finally {
      setPosting(false);
    }
  };

  const updateComment = (id, updater) =>
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) return updater(c);
        if (c.replies?.some((r) => r.id === id)) {
          return { ...c, replies: c.replies.map((r) => (r.id === id ? updater(r) : r)) };
        }
        return c;
      })
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm font-black text-slate-900">
        <MessageSquare className="w-4 h-4 text-teal-600" />
        <span>{t('أسئلة ونقاش المحاضرة')}</span>
        {count > 0 && <span className="text-xs text-slate-500 font-bold">({count})</span>}
      </div>

      <form onSubmit={handlePost} className="space-y-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
          <textarea
            rows={3}
            value={text}
            maxLength={COMMENT_MAX_LENGTH}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('اكتب سؤالك أو تعليقك على المحاضرة...')}
            className="w-full bg-transparent px-4 pt-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <span className="text-[11px] text-slate-400 font-mono">{text.length}/{COMMENT_MAX_LENGTH}</span>
            <button
              type="submit"
              disabled={posting || !text.trim()}
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs px-4 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {t('نشر')}
            </button>
          </div>
        </div>
        {postError && <p className="text-xs text-rose-600 font-semibold">{postError}</p>}
      </form>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
        </div>
      ) : error && comments.length === 0 ? (
        <p className="text-sm text-rose-600 text-center py-4 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-6">{t('لا توجد تعليقات بعد. كن أول من يسأل!')}</p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              levelId={levelId}
              videoId={videoId}
              onChange={updateComment}
              onReplyAdded={(reply) =>
                updateComment(c.id, (prev) => ({
                  ...prev,
                  replies: [...(prev.replies || []), reply],
                  reply_count: (prev.reply_count || 0) + 1,
                }))
              }
            />
          ))}

          {nextPage && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full text-sm text-teal-700 hover:text-teal-900 py-2 font-black disabled:opacity-50"
            >
              {loadingMore ? t('جاري التحميل...') : t('عرض المزيد من التعليقات')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CommentItem({ comment, levelId, videoId, onChange, onReplyAdded, isReply = false }) {
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const removed = comment.content === REMOVED_COMMENT_TEXT;
  const canEdit = canStillEdit(comment);
  const canDelete = !removed && (comment.is_owner || isAdmin);
  const author = [comment.user?.first_name, comment.user?.last_name].filter(Boolean).join(' ') || t('طالب');
  const photo = mediaUrl(comment.user?.profile_photo);

  const act = async (fn, fallback) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(getErrorMessage(err, fallback));
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = () =>
    act(async () => {
      const content = editText.trim();
      if (!content) return;
      const updated = await commentsService.editComment(levelId, videoId, comment.id, content);
      onChange(comment.id, (prev) => ({ ...prev, content: updated.content ?? content, updated_at: updated.updated_at ?? prev.updated_at }));
      setEditing(false);
    }, t('تعذر تعديل التعليق.'));

  const remove = () => {
    if (!window.confirm(t('هل تريد حذف هذا التعليق؟'))) return;
    act(async () => {
      await commentsService.deleteComment(levelId, videoId, comment.id);
      onChange(comment.id, (prev) => ({ ...prev, content: REMOVED_COMMENT_TEXT }));
    }, t('تعذر حذف التعليق.'));
  };

  const sendReply = (e) => {
    e.preventDefault();
    act(async () => {
      const content = replyText.trim();
      if (!content) return;
      const reply = await commentsService.replyToComment(levelId, videoId, comment.id, content);
      onReplyAdded(reply);
      setReplyText('');
      setReplying(false);
    }, t('فشل إرسال الرد.'));
  };

  return (
    <div className={`${isReply ? 'bg-white border-slate-200 ms-8' : 'bg-slate-50 border-slate-200'} p-4 rounded-2xl border space-y-2`}>
      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- user avatar from the API host
            <img src={photo} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
          ) : (
            <span className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-black shrink-0">
              {author.charAt(0)}
            </span>
          )}
          <span className="font-black text-slate-900 truncate text-sm">{author}</span>
        </div>
        <span className="text-[11px] text-slate-400 shrink-0">
          {timeAgo(comment.created_at)}
          {comment.updated_at && comment.updated_at !== comment.created_at && !removed ? t(' • معدّل') : ''}
        </span>
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            rows={2}
            value={editText}
            maxLength={COMMENT_MAX_LENGTH}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-teal-500 resize-none"
          />
          <div className="flex gap-3 justify-end">
            <button onClick={() => setEditing(false)} className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold">
              <X className="w-3 h-3" /> {t('إلغاء')}
            </button>
            <button onClick={saveEdit} disabled={busy} className="text-xs text-teal-700 hover:text-teal-900 flex items-center gap-1 font-black">
              <Check className="w-3 h-3" /> {t('حفظ')}
            </button>
          </div>
        </div>
      ) : (
        <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${removed ? 'text-slate-400 italic' : 'text-slate-700'}`} dir="auto">
          {removed ? t('تم حذف هذا التعليق.') : comment.content}
        </p>
      )}

      {!editing && (
        <div className="flex items-center gap-4 text-xs font-bold">
          {!isReply && !removed && (
            <button onClick={() => setReplying((v) => !v)} className="text-slate-500 hover:text-teal-700 flex items-center gap-1">
              <Reply className="w-3.5 h-3.5" /> {t('رد')}
            </button>
          )}
          {canEdit && (
            <button onClick={() => { setEditText(comment.content); setEditing(true); }} className="text-slate-500 hover:text-sky-700 flex items-center gap-1">
              <Pencil className="w-3.5 h-3.5" /> {t('تعديل')}
            </button>
          )}
          {canDelete && (
            <button onClick={remove} disabled={busy} className="text-slate-500 hover:text-rose-600 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> {t('حذف')}
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

      {replying && (
        <form onSubmit={sendReply} className="flex gap-2">
          <input
            autoFocus
            value={replyText}
            maxLength={COMMENT_MAX_LENGTH}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={t('اكتب ردك...')}
            className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-teal-500"
          />
          <button type="submit" disabled={busy || !replyText.trim()} className="bg-teal-600 text-white rounded-xl px-3.5 disabled:opacity-40">
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </form>
      )}

      {!isReply && comment.replies?.length > 0 && (
        <div className="space-y-2 pt-1">
          {comment.replies.map((r) => (
            <CommentItem key={r.id} comment={r} levelId={levelId} videoId={videoId} onChange={onChange} isReply />
          ))}
        </div>
      )}
    </div>
  );
}
