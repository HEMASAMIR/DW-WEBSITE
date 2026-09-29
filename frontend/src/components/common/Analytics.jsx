'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Google Analytics 4 — loads only when NEXT_PUBLIC_GA_ID is set, and never on the admin dashboard.
 * Page views on client navigation are recorded by GA4's enhanced measurement (history changes).
 * Custom events go through track() in '@/lib/analytics'.
 */
export default function Analytics() {
  const pathname = usePathname();
  if (!GA_ID || pathname?.startsWith('/admin')) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
