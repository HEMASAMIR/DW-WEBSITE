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
import ContentProtection from '@/components/common/ContentProtection';
import DeviceSessionGuard from '@/components/common/DeviceSessionGuard';
import { SiteLangProvider, LangRemount } from '@/lib/i18n';
import { LANG_BOOT_SCRIPT } from '@/lib/i18nBoot';

export const metadata = {
  metadataBase: new URL('https://deutscheweltacademy.com'),
  title: {
    default: 'هير خالد الحلواني | أكاديمية دويتشه فيلت - Deutsche Welt Academy',
    template: '%s | هير خالد الحلواني - Deutsche Welt',
  },
  description: 'المنصة الرسمية للأستاذ خالد الحلواني (هير خالد الحلواني) - أكاديمية دويتشه فيلت (Deutsche Welt Academy) لتدريس وتأسيس اللغة الألمانية للمراحل الثانوية والجامعية والتأهيل للسفر لألمانيا.',
  keywords: [
    'هير خالد الحلواني',
    'خالد الحلواني',
    'دويتشه فيلت',
    'اكاديمية دويتشه فيلت',
    'أكاديمية دويتشه فيلت',
    'منصة دويتشه فيلت',
    'Deutsche Welt',
    'Deutsche Welt Academy',
    'deutscheweltacademy',
    'الماني ثانوية عامة',
    'اللغة الالمانية ثانوية عامة',
    'شرح الماني ثانوية عامة',
    'تعلم اللغة الالمانية',
    'كورس الماني',
    'مذكرات هير خالد الحلواني',
  ],
  authors: [{ name: 'هير خالد الحلواني' }],
  creator: 'هير خالد الحلواني',
  publisher: 'Deutsche Welt Academy',
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: 'https://deutscheweltacademy.com',
    title: 'هير خالد الحلواني | أكاديمية دويتشه فيلت - Deutsche Welt Academy',
    description: 'المنصة الرسمية للأستاذ خالد الحلواني لتدريس وتأسيس اللغة الألمانية للمراحل الثانوية والجامعية.',
    siteName: 'Deutsche Welt Academy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'هير خالد الحلواني | أكاديمية دويتشه فيلت',
    description: 'المنصة الرسمية للأستاذ خالد الحلواني لتدريس وتأسيس اللغة الألمانية.',
  },
  verification: {
    google: 'vRxOUyNZ6vbMOwrRZvPgGc2YFTe2y6ro_oUx6ra_RN0',
  },
  alternates: {
    canonical: 'https://deutscheweltacademy.com',
  },
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
        <meta name="google-site-verification" content="vRxOUyNZ6vbMOwrRZvPgGc2YFTe2y6ro_oUx6ra_RN0" />
        {/* Saved English/German choice → left-to-right before the first paint */}
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen relative font-sans antialiased" suppressHydrationWarning>
        <SiteLangProvider>
          <AuthProvider>
            <ModalProvider>
              <ContentProtection>
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
                  <DeviceSessionGuard />
                </LangRemount>
              </ContentProtection>
              <Analytics />
            </ModalProvider>
          </AuthProvider>
        </SiteLangProvider>
      </body>
    </html>
  );
}
