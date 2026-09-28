import LearnTopBar from '@/components/layout/LearnTopBar';
import BottomNav from '@/components/layout/BottomNav';

// Courses & books: standalone learning pages — no site header/footer, just a slim top bar.
export default function LearnLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <LearnTopBar />
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}
