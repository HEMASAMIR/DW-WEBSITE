// Static site content (not served by the API). Prices, titles, access and
// lesson data always come from the backend — never hard-code them here.

export const ACADEMY_INFO = {
  name: 'Deutsche Welt - هير خالد الحلواني',
  subtitle: 'أكاديمية اللغة الألمانية المتخصصة للمرحلتين الثانوية والجامعية والراغبين للسفر',
};

/**
 * Contact numbers, payment methods and the WhatsApp group per level. The admin edits them from
 * the dashboard (/admin#contact → site-data/contact); these are only the defaults until then.
 * Read them on the site with useContactInfo() from '@/lib/contactInfo'.
 */
export const DEFAULT_CONTACT = {
  // Local (010…) or international (2010…) — wa.me links are built from either.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '010552287454',
  phones: [
    { id: 'p1', label: 'الخط الرئيسي', number: '010552287454' },
    { id: 'p2', label: 'خط تاني', number: '01144151673' },
  ],
  payment: {
    methods: [
      { id: 'wallet', type: 'wallet', label: 'فودافون كاش', number: '01010169369', hint: 'Vodafone Cash — تحويل على الرقم', is_active: true },
      { id: 'instapay', type: 'instapay', label: 'إنستا باي', number: '01010169369', hint: 'InstaPay — تحويل على رقم الموبايل', is_active: true },
    ],
    cash_at_branch: true,
  },
  // Shown only to students the level is unlocked for.
  groups: [
    { code: 'A1', url: 'https://chat.whatsapp.com/JPLSf99guLQ8zXlFvDsE7Z' },
    { code: 'A2', url: 'https://chat.whatsapp.com/LRvGNwMDDQmEoM6ZXYlTl5' },
    { code: 'B1', url: 'https://chat.whatsapp.com/IGEot5E1QYBH1zf9Q4AAZs' },
    { code: 'B2', url: 'https://chat.whatsapp.com/LpLRjlH1oyq6QWas1VvhAs' },
  ],
};

// Contact-form topics (value → label)
export const TOPICS = {
  A1: 'المستوى A1',
  A2: 'المستوى A2',
  B1: 'المستوى B1',
  B2: 'المستوى B2',
  BOOK: 'شراء الكتب',
  OTHER: 'استفسار عام',
};

export const BRANCHES_DATA = [
  {
    id: 'shebin',
    name: 'فرع شبين الكوم',
    city: 'المنوفية',
    address: 'برج حجازي – الدور الثاني علوي، أمام مستشفى الجامعة مباشرة',
    mapUrl: 'https://maps.app.goo.gl/NJRj414R5yurS7Gs8?g_st=ac',
    phone: '010552287454',
    badge: 'فرع رئيسي',
  },
  {
    id: 'nasr-city',
    name: 'فرع مدينة نصر',
    city: 'القاهرة',
    address: '١٦ ش شريف سامي - بالقرب من (كوبري المنهل / جامع السلام) - الدور الأول',
    mapUrl: 'https://maps.app.goo.gl/i55RDUisL7wcdwf3A',
    phone: '01144151673',
    badge: 'القاهرة',
  },
  {
    id: 'mansoura',
    name: 'فرع المنصورة',
    city: 'الدقهلية',
    address: '١ شارع الشيخ الغزالي أمام مستشفى الجامعة البوابة الرئيسية',
    mapUrl: 'https://maps.app.goo.gl/PpTdBa3fkWC7WGYt5',
    phone: '010552287454',
    badge: 'الدقهلية',
  },
  {
    id: 'alexandria',
    name: 'فرع الإسكندرية',
    city: 'الإسكندرية',
    address: 'سموحة ١ شارع 3 من شارع النصر أمام صيدلية الخليلي',
    mapUrl: 'https://maps.app.goo.gl/WY4LqQKPTK4M9e4A7',
    phone: '01144151673',
    badge: 'الإسكندرية',
  },
];

export const TEACHER_CV_DATA = {
  experience: [
    { title: 'كبير محاضري اللغة الألمانية', org: 'Deutsche Welt Academy', period: '2016 - الحاضر', desc: 'تدريب أكثر من 15,000 طالب وطالبة وتأهيلهم للامتحانات الدولية وسوق العمل في ألمانيا.' },
    { title: 'استشاري التوجيه التعليمي للألماني', org: 'المجلس الثقافي الألماني', period: '2018 - 2021', desc: 'إعداد مناهج تعليمية متطورة تناسب الطلاب العرب.' }
  ],
  education: [
    { title: 'ليسانس الألسن - قسم اللغة الألمانية', org: 'جامعة عين شمس', period: 'تقدير امتياز مع مرتبة الشرف', desc: 'تخصص اللغويات والترجمة المباشرة.' },
    { title: 'دبلوم تدريس الألمانية للناطقين بغيرها (DaF)', org: 'جامعة ميونخ (LMU Munich)', period: 'ألمانيا', desc: 'اعتماد رسمي لأساليب التدريس الحديثة.' }
  ],
  milestones: [
    { number: '+15,000', label: 'طالب تم تدريبهم بنجاح' },
    { number: '98.4%', label: 'نسبة نجاح امتحانات Goethe / Telc' },
    { number: '10+', label: 'سنوات خبرة في التأسيس والتأهيل' }
  ],
  quote: '"اللغة الألمانية ليست مجرد قواعد ومفردات، بل هي مفتاحك لفتح أبواب الفرص والمستقبل في قلب أوروبا."'
};
