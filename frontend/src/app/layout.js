import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ModalProvider } from '@/context/ModalContext';

// Header/footer live in the route-group layouts:
//   (site)  → marketing pages with the full header, announcement bar and footer
//   (learn) → /courses and /books: standalone pages with a slim top bar only
// Modals
import AuthModal from '@/components/modals/AuthModal';
import CourseEnrollModal from '@/components/modals/CourseEnrollModal';
import BookOrderModal from '@/components/modals/BookOrderModal';
import ProfileModal from '@/components/modals/ProfileModal';
import LightboxModal from '@/components/modals/LightboxModal';
import CvModal from '@/components/modals/CvModal';
import LoginPromptModal from '@/components/modals/LoginPromptModal';
import FileViewerModal from '@/components/modals/FileViewerModal';
import LogoutConfirmModal from '@/components/modals/LogoutConfirmModal';
import Analytics from '@/components/common/Analytics';
import { SiteLangProvider, LangRemount } from '@/lib/i18n';
import { LANG_BOOT_SCRIPT } from '@/lib/i18nBoot';

export const metadata = {
  title: 'Deutsche Welt Academy | هير خالد الحلواني - أكاديمية اللغة الألمانية',
  description: 'أكاديمية تدريس وتأسيس اللغة الألمانية للمراحل الثانوية والجامعية والراغبين بالسفر لألمانيا مع هير خالد الحلواني.',
  // Stops the Dark Reader extension from recolouring the site.
  other: { 'darkreader-lock': 'true' },
};

// The design is light-only: "only light" stops Chrome/Edge "auto dark mode" from inverting it.
export const viewport = {
  colorScheme: 'only light',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Saved English/German choice → left-to-right before the first paint */}
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen relative font-sans antialiased" suppressHydrationWarning>
        <SiteLangProvider>
          <AuthProvider>
            <ModalProvider>
              {/* Re-renders the whole page when the visitor switches language */}
              <LangRemount>
                {children}

                {/* Global Modal Layer */}
                <AuthModal />
                <CourseEnrollModal />
                <BookOrderModal />
                <ProfileModal />
                <LightboxModal />
                <CvModal />
                <LoginPromptModal />
                <FileViewerModal />
                <LogoutConfirmModal />
              </LangRemount>
              <Analytics />
            </ModalProvider>
          </AuthProvider>
        </SiteLangProvider>
      </body>
    </html>
  );
}
