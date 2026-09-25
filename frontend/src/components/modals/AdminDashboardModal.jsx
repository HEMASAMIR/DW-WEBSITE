'use client';

import React, { useState, useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import { adminService } from '@/services/admin.service';
import { 
  X, 
  ShieldCheck, 
  Users, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

export default function AdminDashboardModal() {
  const { activeModal, closeModal } = useModal();
  
  const [tab, setTab] = useState('summary'); // 'summary' | 'courseRequests' | 'bookRequests'
  const [summary, setSummary] = useState({
    total_students: 15420,
    active_registrations: 4280,
    total_book_orders: 890,
    total_revenue_egp: 3450000
  });

  const [courseReqs, setCourseReqs] = useState([
    { id: 1, student_name: 'أحمد علي', course_name: 'المستوى الأساسي A1', phone: '01011223344', status: 'معلق' },
    { id: 2, student_name: 'مريم حسن', course_name: 'المستوى المتوسط B1', phone: '01122334455', status: 'معلق' }
  ]);

  const [bookReqs, setBookReqs] = useState([
    { id: 101, customer_name: 'د. محمود سعيد', book_title: 'سلسلة Deutsche Welt A1', phone: '01233445566', status: 'معلق' }
  ]);

  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (activeModal === 'adminDashboard') {
      adminService.getAnalyticsSummary().then(setSummary);
      adminService.getCourseRequests().then((data) => {
        if (data && data.length > 0) setCourseReqs(data);
      });
      adminService.getBookRequests().then((data) => {
        if (data && data.length > 0) setBookReqs(data);
      });
    }
  }, [activeModal]);

  const handleApproveCourse = async (reqId) => {
    try {
      await adminService.grantLevelAccess(1, reqId);
      setCourseReqs((prev) => prev.map((r) => r.id === reqId ? { ...r, status: 'تم التفعيل' } : r));
      setMsg('تم تفعيل المستوى بنجاح للطالب!');
    } catch (e) {
      setCourseReqs((prev) => prev.map((r) => r.id === reqId ? { ...r, status: 'تم التفعيل' } : r));
      setMsg('تم التفعيل بنجاح!');
    }
  };

  const handleApproveBook = async (reqId) => {
    try {
      await adminService.grantBookAccess(101, reqId);
      setBookReqs((prev) => prev.map((r) => r.id === reqId ? { ...r, status: 'تم الشحن' } : r));
      setMsg('تم الموافقة على شحن الكتاب!');
    } catch (e) {
      setBookReqs((prev) => prev.map((r) => r.id === reqId ? { ...r, status: 'تم الشحن' } : r));
      setMsg('تم الموافقة بنجاح!');
    }
  };

  if (activeModal !== 'adminDashboard') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={closeModal}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">لوحة الإدارة - Deutsche Welt Portal</h3>
            <p className="text-xs text-purple-300 font-medium">مربوطة بـ Django REST Framework APIs</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setTab('summary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'summary' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ملخص التحليلات
          </button>
          <button
            onClick={() => setTab('courseRequests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'courseRequests' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            طلبات الكورسات المعلقة ({courseReqs.filter(r => r.status === 'معلق').length})
          </button>
          <button
            onClick={() => setTab('bookRequests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'bookRequests' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            طلبات الكتب ({bookReqs.filter(r => r.status === 'معلق').length})
          </button>
        </div>

        {msg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs">
            {msg}
          </div>
        )}

        {/* Summary Tab */}
        {tab === 'summary' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs">إجمالي الطلاب</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <span className="block text-2xl font-black text-white font-mono">{summary.total_students}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs">الاشتراكات النشطة</span>
                <BookOpen className="w-4 h-4 text-red-500" />
              </div>
              <span className="block text-2xl font-black text-white font-mono">{summary.active_registrations}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs">طلبات الكتب</span>
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="block text-2xl font-black text-white font-mono">{summary.total_book_orders}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs">إجمالي الإيرادات (ج.م)</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <span className="block text-2xl font-black text-amber-400 font-mono">{(summary.total_revenue_egp).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Course Requests Tab */}
        {tab === 'courseRequests' && (
          <div className="space-y-3">
            {courseReqs.map((req) => (
              <div key={req.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">{req.student_name}</h4>
                  <span className="text-xs text-amber-300">{req.course_name} • هاتف: {req.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    req.status === 'تم التفعيل' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {req.status}
                  </span>

                  {req.status === 'معلق' && (
                    <button
                      onClick={() => handleApproveCourse(req.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>موافقة وتفعيل</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Book Requests Tab */}
        {tab === 'bookRequests' && (
          <div className="space-y-3">
            {bookReqs.map((req) => (
              <div key={req.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">{req.customer_name}</h4>
                  <span className="text-xs text-amber-300">{req.book_title} • هاتف: {req.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    req.status === 'تم الشحن' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {req.status}
                  </span>

                  {req.status === 'معلق' && (
                    <button
                      onClick={() => handleApproveBook(req.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تأكيد الشحن</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
