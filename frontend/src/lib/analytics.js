/**
 * Sends a GA4 event when Google Analytics is loaded (see components/common/Analytics.jsx);
 * does nothing otherwise, so it is safe to call anywhere.
 *
 * Events used on the site:
 *   sign_up / login          { method: 'email' | 'google' }
 *   begin_checkout           subscribe / buy form opened   { item_type, item_id, value, currency }
 *   generate_lead            request sent to the admin     { item_type, item_id, value, currency, channel }
 *   contact                  WhatsApp / call button        { method: 'whatsapp' | 'phone', location }
 */
export function track(event, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', event, params);
  } catch {
    /* analytics must never break the page */
  }
}

/** "1,500" / "1500.00" → 1500 (GA wants a number for value). */
export const priceValue = (price) => Number(String(price ?? '').replace(/[^\d.]/g, '')) || undefined;
