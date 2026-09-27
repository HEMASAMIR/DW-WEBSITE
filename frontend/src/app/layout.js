import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ModalProvider } from '@/context/ModalContext';

import ParticleCanvas from '@/components/common/ParticleCanvas';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Modals
import AuthModal from '@/components/modals/AuthModal';
import CourseEnrollModal from '@/components/modals/CourseEnrollModal';
import BookOrderModal from '@/components/modals/BookOrderModal';
import PlacementQuizModal from '@/components/modals/PlacementQuizModal';
import ProfileModal from '@/components/modals/ProfileModal';
import AdminDashboardModal from '@/components/modals/AdminDashboardModal';
import LightboxModal from '@/components/modals/LightboxModal';
import CvModal from '@/components/modals/CvModal';
import LoginPromptModal from '@/components/modals/LoginPromptModal';
import FileViewerModal from '@/components/modals/FileViewerModal';

export const metadata = {
  title: 'Deutsche Welt Academy | الأستاذ خالد - أكاديمية اللغة الألمانية',
  description: 'أكاديمية تدريس وتأسيس اللغة الألمانية للمراحل الثانوية والجامعية والراغبين بالسفر لألمانيا مع الأستاذ خالد.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100 min-h-screen relative font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <ModalProvider>
              <ParticleCanvas />
              <Header />
              <AnnouncementBar />
              <main className="relative z-10">{children}</main>
              <Footer />

              {/* Global Modal Layer */}
              <AuthModal />
              <CourseEnrollModal />
              <BookOrderModal />
              <PlacementQuizModal />
              <ProfileModal />
              <AdminDashboardModal />
              <LightboxModal />
              <CvModal />
              <LoginPromptModal />
              <FileViewerModal />
            </ModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
