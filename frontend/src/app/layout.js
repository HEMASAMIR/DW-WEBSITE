import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ModalProvider } from '@/context/ModalContext';

// Header/footer live in the route-group layouts:
//   (site)  → marketing pages with the full header, announcement bar and footer
//   (learn) → /courses and /books: standalone pages with a slim top bar only
// Modals
import AuthModal from '@/components/modals/AuthModal';
import CourseEnrollModal from '@/components/modals/CourseEnrollModal';
import BookOrderModal from '@/components/modals/BookOrderModal';
import ProfileModal from '@/components/modals/ProfileModal';
import AdminDashboardModal from '@/components/modals/AdminDashboardModal';
import LightboxModal from '@/components/modals/LightboxModal';
import CvModal from '@/components/modals/CvModal';
import LoginPromptModal from '@/components/modals/LoginPromptModal';
import FileViewerModal from '@/components/modals/FileViewerModal';
import LogoutConfirmModal from '@/components/modals/LogoutConfirmModal';

export const metadata = {
  title: 'Deutsche Welt Academy | هير خالد الحلواني - أكاديمية اللغة الألمانية',
  description: 'أكاديمية تدريس وتأسيس اللغة الألمانية للمراحل الثانوية والجامعية والراغبين بالسفر لألمانيا مع هير خالد الحلواني.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100 min-h-screen relative font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <ModalProvider>
              {children}

              {/* Global Modal Layer */}
              <AuthModal />
              <CourseEnrollModal />
              <BookOrderModal />
              <ProfileModal />
              <AdminDashboardModal />
              <LightboxModal />
              <CvModal />
              <LoginPromptModal />
              <FileViewerModal />
              <LogoutConfirmModal />
            </ModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
