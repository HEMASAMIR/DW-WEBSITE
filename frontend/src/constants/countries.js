// Comprehensive list of countries with dial codes, flags, and names in Arabic, English, and German.
export const COUNTRIES = [
  // Priority countries (Arab world, German-speaking countries, and major diaspora)
  { code: 'EG', dialCode: '+20', flag: '🇪🇬', nameAr: 'مصر', nameEn: 'Egypt', nameDe: 'Ägypten', priority: true },
  { code: 'DZ', dialCode: '+213', flag: '🇩🇿', nameAr: 'الجزائر', nameEn: 'Algeria', nameDe: 'Algerien', priority: true },
  { code: 'SA', dialCode: '+966', flag: '🇸🇦', nameAr: 'السعودية', nameEn: 'Saudi Arabia', nameDe: 'Saudi-Arabien', priority: true },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', nameAr: 'ألمانيا', nameEn: 'Germany', nameDe: 'Deutschland', priority: true },
  { code: 'AE', dialCode: '+971', flag: '🇦🇪', nameAr: 'الإمارات', nameEn: 'United Arab Emirates', nameDe: 'VAE', priority: true },
  { code: 'KW', dialCode: '+965', flag: '🇰🇼', nameAr: 'الكويت', nameEn: 'Kuwait', nameDe: 'Kuwait', priority: true },
  { code: 'QA', dialCode: '+974', flag: '🇶🇦', nameAr: 'قطر', nameEn: 'Qatar', nameDe: 'Katar', priority: true },
  { code: 'JO', dialCode: '+962', flag: '🇯🇴', nameAr: 'الأردن', nameEn: 'Jordan', nameDe: 'Jordanien', priority: true },
  { code: 'OM', dialCode: '+968', flag: '🇴🇲', nameAr: 'عمان', nameEn: 'Oman', nameDe: 'Oman', priority: true },
  { code: 'BH', dialCode: '+973', flag: '🇧🇭', nameAr: 'البحرين', nameEn: 'Bahrain', nameDe: 'Bahrain', priority: true },
  { code: 'IQ', dialCode: '+964', flag: '🇮🇶', nameAr: 'العراق', nameEn: 'Iraq', nameDe: 'Irak', priority: true },
  { code: 'PS', dialCode: '+970', flag: '🇵🇸', nameAr: 'فلسطين', nameEn: 'Palestine', nameDe: 'Palästina', priority: true },
  { code: 'SY', dialCode: '+963', flag: '🇸🇾', nameAr: 'سوريا', nameEn: 'Syria', nameDe: 'Syrien', priority: true },
  { code: 'LB', dialCode: '+961', flag: '🇱🇧', nameAr: 'لبنان', nameEn: 'Lebanon', nameDe: 'Libanon', priority: true },
  { code: 'YE', dialCode: '+967', flag: '🇾🇪', nameAr: 'اليمن', nameEn: 'Yemen', nameDe: 'Jemen', priority: true },
  { code: 'SD', dialCode: '+249', flag: '🇸🇩', nameAr: 'السودان', nameEn: 'Sudan', nameDe: 'Sudan', priority: true },
  { code: 'LY', dialCode: '+218', flag: '🇱🇾', nameAr: 'ليبيا', nameEn: 'Libya', nameDe: 'Libyen', priority: true },
  { code: 'TN', dialCode: '+216', flag: '🇹🇳', nameAr: 'تونس', nameEn: 'Tunisia', nameDe: 'Tunesien', priority: true },
  { code: 'MA', dialCode: '+212', flag: '🇲🇦', nameAr: 'المغرب', nameEn: 'Morocco', nameDe: 'Marokko', priority: true },
  { code: 'AT', dialCode: '+43', flag: '🇦🇹', nameAr: 'النمسا', nameEn: 'Austria', nameDe: 'Österreich', priority: true },
  { code: 'CH', dialCode: '+41', flag: '🇨🇭', nameAr: 'سويسرا', nameEn: 'Switzerland', nameDe: 'Schweiz', priority: true },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', nameAr: 'الولايات المتحدة', nameEn: 'United States', nameDe: 'USA', priority: true },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦', nameAr: 'كندا', nameEn: 'Canada', nameDe: 'Kanada', priority: true },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', nameDe: 'Großbritannien', priority: true },
  { code: 'TR', dialCode: '+90', flag: '🇹🇷', nameAr: 'تركيا', nameEn: 'Turkey', nameDe: 'Türkei', priority: true },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷', nameAr: 'فرنسا', nameEn: 'France', nameDe: 'Frankreich', priority: true },
  { code: 'IT', dialCode: '+39', flag: '🇮🇹', nameAr: 'إيطاليا', nameEn: 'Italy', nameDe: 'Italien', priority: true },
  { code: 'ES', dialCode: '+34', flag: '🇪🇸', nameAr: 'إسبانيا', nameEn: 'Spain', nameDe: 'Spanien', priority: true },
  { code: 'NL', dialCode: '+31', flag: '🇳🇱', nameAr: 'هولندا', nameEn: 'Netherlands', nameDe: 'Niederlande', priority: true },
  { code: 'BE', dialCode: '+32', flag: '🇧🇪', nameAr: 'بلجيكا', nameEn: 'Belgium', nameDe: 'Belgien', priority: true },
  { code: 'SE', dialCode: '+46', flag: '🇸🇪', nameAr: 'السويد', nameEn: 'Sweden', nameDe: 'Schweden', priority: true },
  { code: 'NO', dialCode: '+47', flag: '🇳🇴', nameAr: 'النرويج', nameEn: 'Norway', nameDe: 'Norwegen', priority: true },
  { code: 'DK', dialCode: '+45', flag: '🇩🇰', nameAr: 'الدنمارك', nameEn: 'Denmark', nameDe: 'Dänemark', priority: true },
  { code: 'FI', dialCode: '+358', flag: '🇫🇮', nameAr: 'فنلندا', nameEn: 'Finland', nameDe: 'Finnland', priority: true },
  { code: 'PL', dialCode: '+48', flag: '🇵🇱', nameAr: 'بولندا', nameEn: 'Poland', nameDe: 'Polen', priority: true },
  { code: 'RU', dialCode: '+7', flag: '🇷🇺', nameAr: 'روسيا', nameEn: 'Russia', nameDe: 'Russland', priority: true },
  { code: 'UA', dialCode: '+380', flag: '🇺🇦', nameAr: 'أوكرانيا', nameEn: 'Ukraine', nameDe: 'Ukraine' },
  { code: 'GR', dialCode: '+30', flag: '🇬🇷', nameAr: 'اليونان', nameEn: 'Greece', nameDe: 'Griechenland' },
  { code: 'RO', dialCode: '+40', flag: '🇷🇴', nameAr: 'رومانيا', nameEn: 'Romania', nameDe: 'Rumänien' },
  { code: 'HU', dialCode: '+36', flag: '🇭🇺', nameAr: 'المجر', nameEn: 'Hungary', nameDe: 'Ungarn' },
  { code: 'CZ', dialCode: '+420', flag: '🇨🇿', nameAr: 'التشيك', nameEn: 'Czech Republic', nameDe: 'Tschechien' },
  { code: 'IE', dialCode: '+353', flag: '🇮🇪', nameAr: 'أيرلندا', nameEn: 'Ireland', nameDe: 'Irland' },
  { code: 'PT', dialCode: '+351', flag: '🇵🇹', nameAr: 'البرتغال', nameEn: 'Portugal', nameDe: 'Portugal' },
  { code: 'BR', dialCode: '+55', flag: '🇧🇷', nameAr: 'البرازيل', nameEn: 'Brazil', nameDe: 'Brasilien' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', nameAr: 'أستراليا', nameEn: 'Australia', nameDe: 'Australien' },
  { code: 'NZ', dialCode: '+64', flag: '🇳🇿', nameAr: 'نيوزيلندا', nameEn: 'New Zealand', nameDe: 'Neuseeland' },
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', nameAr: 'الهند', nameEn: 'India', nameDe: 'Indien' },
  { code: 'PK', dialCode: '+92', flag: '🇵🇰', nameAr: 'باكستان', nameEn: 'Pakistan', nameDe: 'Pakistan' },
  { code: 'MY', dialCode: '+60', flag: '🇲🇾', nameAr: 'ماليزيا', nameEn: 'Malaysia', nameDe: 'Malaysia' },
  { code: 'ID', dialCode: '+62', flag: '🇮🇩', nameAr: 'إندونيسيا', nameEn: 'Indonesia', nameDe: 'Indonesien' },
  { code: 'CN', dialCode: '+86', flag: '🇨🇳', nameAr: 'الصين', nameEn: 'China', nameDe: 'China' },
  { code: 'JP', dialCode: '+81', flag: '🇯🇵', nameAr: 'اليابان', nameEn: 'Japan', nameDe: 'Japan' },
  { code: 'KR', dialCode: '+82', flag: '🇰🇷', nameAr: 'كوريا الجنوبية', nameEn: 'South Korea', nameDe: 'Südkorea' },
  { code: 'ZA', dialCode: '+27', flag: '🇿🇦', nameAr: 'جنوب أفريقيا', nameEn: 'South Africa', nameDe: 'Südafrika' },
  { code: 'NG', dialCode: '+234', flag: '🇳🇬', nameAr: 'نيجيريا', nameEn: 'Nigeria', nameDe: 'Nigeria' },
  { code: 'KE', dialCode: '+254', flag: '🇰🇪', nameAr: 'كينيا', nameEn: 'Kenya', nameDe: 'Kenia' },
  { code: 'GH', dialCode: '+233', flag: '🇬🇭', nameAr: 'غانا', nameEn: 'Ghana', nameDe: 'Ghana' },
  { code: 'MR', dialCode: '+222', flag: '🇲🇷', nameAr: 'موريتانيا', nameEn: 'Mauritania', nameDe: 'Mauretanien' },
  { code: 'SO', dialCode: '+252', flag: '🇸🇴', nameAr: 'الصومال', nameEn: 'Somalia', nameDe: 'Somalia' },
  { code: 'DJ', dialCode: '+253', flag: '🇩🇯', nameAr: 'جيبوتي', nameEn: 'Djibouti', nameDe: 'Dschibuti' },
  { code: 'KM', dialCode: '+269', flag: '🇰🇲', nameAr: 'جزر القمر', nameEn: 'Comoros', nameDe: 'Komoren' },
  { code: 'CY', dialCode: '+357', flag: '🇨🇾', nameAr: 'قبرص', nameEn: 'Cyprus', nameDe: 'Zypern' },
  { code: 'BG', dialCode: '+359', flag: '🇧🇬', nameAr: 'بلغاريا', nameEn: 'Bulgaria', nameDe: 'Bulgarien' },
  { code: 'HR', dialCode: '+385', flag: '🇭🇷', nameAr: 'كرواتيا', nameEn: 'Croatia', nameDe: 'Kroatien' },
  { code: 'RS', dialCode: '+381', flag: '🇷🇸', nameAr: 'صربيا', nameEn: 'Serbia', nameDe: 'Serbien' },
  { code: 'BA', dialCode: '+387', flag: '🇧🇦', nameAr: 'البوسنة والهرسك', nameEn: 'Bosnia and Herzegovina', nameDe: 'Bosnien und Herzegowina' },
  { code: 'AL', dialCode: '+355', flag: '🇦🇱', nameAr: 'ألبانيا', nameEn: 'Albania', nameDe: 'Albanien' },
  { code: 'GE', dialCode: '+995', flag: '🇬🇪', nameAr: 'جورجيا', nameEn: 'Georgia', nameDe: 'Georgien' },
  { code: 'AZ', dialCode: '+994', flag: '🇦🇿', nameAr: 'أذربيجان', nameEn: 'Azerbaijan', nameDe: 'Aserbaidschan' },
  { code: 'KZ', dialCode: '+7', flag: '🇰🇿', nameAr: 'كازاخستان', nameEn: 'Kazakhstan', nameDe: 'Kasachstan' },
  { code: 'UZ', dialCode: '+998', flag: '🇺🇿', nameAr: 'أوزبكستان', nameEn: 'Uzbekistan', nameDe: 'Usbekistan' },
  { code: 'MX', dialCode: '+52', flag: '🇲🇽', nameAr: 'المكسيك', nameEn: 'Mexico', nameDe: 'Mexiko' },
  { code: 'AR', dialCode: '+54', flag: '🇦🇷', nameAr: 'الأرجنتين', nameEn: 'Argentina', nameDe: 'Argentinien' },
  { code: 'CO', dialCode: '+57', flag: '🇨🇴', nameAr: 'كولومبيا', nameEn: 'Colombia', nameDe: 'Kolumbien' },
  { code: 'CL', dialCode: '+56', flag: '🇨🇱', nameAr: 'تشيلي', nameEn: 'Chile', nameDe: 'Chile' },
  { code: 'SG', dialCode: '+65', flag: '🇸🇬', nameAr: 'سنغافورة', nameEn: 'Singapore', nameDe: 'Singapur' },
  { code: 'TH', dialCode: '+66', flag: '🇹🇭', nameAr: 'تايلاند', nameEn: 'Thailand', nameDe: 'Thailand' },
  { code: 'VN', dialCode: '+84', flag: '🇻🇳', nameAr: 'فيتنام', nameEn: 'Vietnam', nameDe: 'Vietnam' },
  { code: 'PH', dialCode: '+63', flag: '🇵🇭', nameAr: 'الفلبين', nameEn: 'Philippines', nameDe: 'Philippinen' },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Egypt (+20)

/** Convert Arabic/Persian digits to standard Latin digits */
export function toLatinDigits(str = '') {
  if (!str) return '';
  return String(str).replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (d) =>
    String('٠١٢٣٤٥٦٧٨٩' /* i18n-keep */.indexOf(d) % 10)
  );
}

/**
 * Finds country by ISO code or dialCode
 */
export function findCountry(codeOrDial) {
  if (!codeOrDial) return DEFAULT_COUNTRY;
  const target = String(codeOrDial).trim().toUpperCase();
  const byCode = COUNTRIES.find((c) => c.code === target);
  if (byCode) return byCode;
  const dial = target.startsWith('+') ? target : `+${target}`;
  return COUNTRIES.find((c) => c.dialCode === dial) || DEFAULT_COUNTRY;
}

/**
 * Automatically detects country from any input (with or without +, national prefix or dial code)
 */
export function detectCountry(raw = '') {
  const clean = toLatinDigits(String(raw)).trim();
  if (!clean) return null;

  let withPlus = clean;
  if (withPlus.startsWith('00')) withPlus = '+' + withPlus.slice(2);
  if (withPlus.startsWith('+')) {
    const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    const matched = sorted.find((c) => withPlus.startsWith(c.dialCode));
    if (matched) return matched;
  }

  const digits = clean.replace(/\D/g, '');
  if (!digits) return null;

  // 1. Direct international dial codes without '+' or '00':
  // 3-digit dial codes (Algeria 213, Saudi 966, UAE 971, Kuwait 965, Libya 218, Tunisia 216, Morocco 212, etc.)
  const major3Dials = [
    '213', '966', '971', '965', '962', '968', '973', '964', '961', '963',
    '970', '967', '249', '218', '216', '212'
  ];
  for (const dial of major3Dials) {
    if (digits.startsWith(dial) && digits.length >= 3) {
      const found = COUNTRIES.find((c) => c.dialCode === '+' + dial);
      if (found) return found;
    }
  }

  // 2-digit dial codes (Germany 49, Austria 43, Switzerland 41, UK 44, Turkey 90, Egypt 20)
  const major2Dials = ['49', '43', '41', '44', '90', '20'];
  for (const dial of major2Dials) {
    if (digits.startsWith(dial) && digits.length >= 4) {
      const found = COUNTRIES.find((c) => c.dialCode === '+' + dial);
      if (found) return found;
    }
  }

  // 2. National / Local Mobile prefixes:
  // Egypt (+20): 010, 011, 012, 015 or 10, 11, 12, 15
  if (/^(01[0125]|1[0125])/.test(digits) && digits.length >= 2) {
    return COUNTRIES.find((c) => c.code === 'EG');
  }

  // Algeria (+213): 055, 55, 056, 56, 054, 54, 06, 66, 07, 77
  if (/^(0?5[456]|5[456]|0?[67]|66|77)/.test(digits) && digits.length >= 2) {
    return COUNTRIES.find((c) => c.code === 'DZ');
  }

  // Saudi Arabia (+966): 050, 50, 053, 53, 058, 58, 059, 59
  if (/^(0?5[0389]|5[0389])/.test(digits) && digits.length >= 2) {
    return COUNTRIES.find((c) => c.code === 'SA');
  }

  // Germany (+49): 015, 15, 016, 16, 017, 17
  if (/^(0?1[567]|1[567])/.test(digits) && digits.length >= 3) {
    return COUNTRIES.find((c) => c.code === 'DE');
  }

  // Jordan (+962): 077, 77, 078, 78, 079, 79
  if (/^(0?7[789]|7[789])/.test(digits) && digits.length >= 3) {
    return COUNTRIES.find((c) => c.code === 'JO');
  }

  // Libya (+218): 091, 91, 092, 92, 094, 94
  if (/^(0?9[124]|9[124])/.test(digits) && digits.length >= 3) {
    return COUNTRIES.find((c) => c.code === 'LY');
  }

  return null;
}

/**
 * Parses any incoming phone string into { country, localNumber, fullNumber, isValid }
 */
export function parsePhoneNumber(raw = '', fallbackCountry = DEFAULT_COUNTRY) {
  if (!raw) {
    return { country: fallbackCountry, localNumber: '', fullNumber: '', isValid: false };
  }

  let clean = toLatinDigits(String(raw)).trim();
  if (clean.startsWith('00')) {
    clean = '+' + clean.slice(2);
  }

  // Auto-detect country
  const detected = detectCountry(clean);
  const country = detected || fallbackCountry;

  let local = clean;
  // If local starts with dial code or +, clean it
  if (local.startsWith('+')) {
    local = local.slice(country.dialCode.length);
  } else {
    const d = country.dialCode.replace(/\D/g, '');
    if (local.startsWith(d)) {
      local = local.slice(d.length);
    }
  }

  const digitsOnly = local.replace(/\D/g, '');
  const full = buildFullNumber(country, digitsOnly);

  return {
    country,
    localNumber: digitsOnly,
    fullNumber: full,
    isValid: isPhoneValid(country, digitsOnly),
  };
}

/**
 * Builds the full number:
 * - For Egypt (EG): standard 11-digit national mobile format (010..., 011..., 012..., 015...)
 * - For all other countries: international format with country code (+213..., +966...)
 */
export function buildFullNumber(country, localNumber = '') {
  const digits = toLatinDigits(localNumber).replace(/\D/g, '');
  if (!digits) return '';

  const dialDigits = (country?.dialCode || '').replace(/\D/g, '');
  let sanitized = digits;
  if (dialDigits && sanitized.startsWith(dialDigits) && sanitized.length > dialDigits.length) {
    sanitized = sanitized.slice(dialDigits.length);
  }

  if (sanitized.startsWith('0')) {
    sanitized = sanitized.replace(/^0+/, '');
  }

  // Egyptian numbers in standard national 11-digit format (010..., 011..., 012..., 015...)
  if (country?.code === 'EG') {
    return `0${sanitized}`;
  }

  return `${country?.dialCode || '+20'}${sanitized}`;
}

/**
 * Validates phone number for any country in the world
 */
export function isPhoneValid(country, localNumber = '') {
  const digits = toLatinDigits(localNumber).replace(/\D/g, '');
  if (!digits) return false;

  const full = buildFullNumber(country, digits);
  const totalDigits = full.replace(/\D/g, '');

  // Any phone worldwide having between 6 and 16 digits total is valid
  return totalDigits.length >= 6 && totalDigits.length <= 16;
}
