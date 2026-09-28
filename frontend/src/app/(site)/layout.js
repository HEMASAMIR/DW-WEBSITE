import ParticleCanvas from '@/components/common/ParticleCanvas';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';

// Marketing pages (home): full site header, announcement bar and footer.
export default function SiteLayout({ children }) {
  return (
    <>
      <ParticleCanvas />
      <Header />
      <AnnouncementBar />
      {/* overflow-x-clip: decorative blurred blobs in the sections must not widen the page on phones */}
      <main className="relative z-10 overflow-x-clip">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}
