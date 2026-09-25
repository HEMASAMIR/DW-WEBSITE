'use client';

import React, { useState, useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import { coursesService } from '@/services/courses.service';
import { commentsService } from '@/services/comments.service';
import { MOCK_LESSON_VIDEOS } from '@/constants/mockData';
import { X, PlayCircle, Download, MessageSquare, Send, CheckCircle2, Video } from 'lucide-react';

export default function StudentDashboardModal() {
  const { activeModal, modalData, closeModal } = useModal();
  const levelId = modalData?.levelId || 1;

  const [videos, setVideos] = useState(MOCK_LESSON_VIDEOS);
  const [activeVideo, setActiveVideo] = useState(MOCK_LESSON_VIDEOS[0]);
  const [comments, setComments] = useState(MOCK_LESSON_VIDEOS[0]?.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeModal === 'studentDashboard') {
      coursesService.getLevelVideos(levelId).then((data) => {
        if (data && data.length > 0) {
          setVideos(data);
          setActiveVideo(data[0]);
          loadComments(levelId, data[0].id);
        }
      });
    }
  }, [activeModal, levelId]);

  const loadComments = async (lvlId, vidId) => {
    try {
      const fetched = await commentsService.getComments(lvlId, vidId);
      if (fetched && fetched.length > 0) {
        setComments(fetched);
      }
    } catch (e) {
      // keep initial
    }
  };

  const handleVideoSelect = (vid) => {
    setActiveVideo(vid);
    loadComments(levelId, vid.id);
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const text = newCommentText;
    setNewCommentText('');
    try {
      const created = await commentsService.postComment(levelId, activeVideo.id, text);
      setComments((prev) => [created, ...prev]);
    } catch (err) {
      // Add local fallback comment for responsive UX
      const local = {
        id: Date.now(),
        author: 'أنت (طالب)',
        text: text,
        time: 'الآن',
        replies: []
      };
      setComments((prev) => [local, ...prev]);
    }
  };

  if (activeModal !== 'studentDashboard') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        <button
          onClick={closeModal}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">منصة مشاهدة الكورس والتفاعل</h3>
            <p className="text-xs text-amber-300 font-medium">المستوى الأساسي A1 • المحاضرات المباشرة</p>
          </div>
        </div>

        {/* Video Player & Playlist Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Video View & Comments Column */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Embed Video Frame */}
            <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative">
              <iframe
                src={activeVideo?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                title={activeVideo?.title}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Header Info & PDF Download */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">{activeVideo?.title}</h4>
                <span className="text-xs text-slate-400">مدة المحاضرة: {activeVideo?.duration}</span>
              </div>

              {activeVideo?.pdfAttachment && (
                <button
                  onClick={() => coursesService.downloadFile(levelId, activeVideo?.fileId || 101)}
                  className="flex items-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل ملف الملزمة PDF</span>
                </button>
              )}
            </div>

            {/* Discussion & Comments Forum */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h5 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>مناقشة المحاضرة والاستفسارات</span>
              </h5>

              {/* Add Comment Input */}
              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="اكتب سؤالك حول القواعد أو الكلمات..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Comments Feed */}
              <div className="space-y-3 pt-2">
                {comments.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">لا توجد تعليقات بعد. كن أول من يسأل!</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-300">{c.author || 'طالب الأكاديمية'}</span>
                        <span className="text-[10px] text-slate-500">{c.time}</span>
                      </div>
                      <p className="text-xs text-slate-200">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Playlist Videos Column */}
          <div className="lg:col-span-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3 h-fit">
            <h5 className="text-sm font-bold text-white mb-2">قائمة محاضرات المستوى</h5>
            <div className="space-y-2">
              {videos.map((vid) => (
                <button
                  key={vid.id}
                  onClick={() => handleVideoSelect(vid)}
                  className={`w-full text-right p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                    activeVideo?.id === vid.id
                      ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <PlayCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">{vid.title}</span>
                    <span className="text-[10px] text-slate-400">{vid.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
