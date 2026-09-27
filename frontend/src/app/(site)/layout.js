import ParticleCanvas from '@/components/common/ParticleCanvas';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Marketing pages (home): full site header, announcement bar and footer.
export default function SiteLayout({ children }) {
  return (
    <>
      <ParticleCanvas />
      <Header />
      <AnnouncementBar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  );
}
