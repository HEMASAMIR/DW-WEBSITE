// Static site content (not served by the API). Prices, titles, access and
// lesson data always come from the backend — never hard-code them here.

export const ACADEMY_INFO = {
  name: 'Deutsche Welt - الأستاذ خالد',
  subtitle: 'أكاديمية اللغة الألمانية المتخصصة للمرحلتين الثانوية والجامعية والراغبين للسفر',
  // International format without "+" (used for wa.me links). Override via NEXT_PUBLIC_WHATSAPP_NUMBER.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2010552287454',
  phonePrimary: '010552287454',
  phoneSecondary: '01144151673',
};

export function whatsappLink(message = '') {
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${ACADEMY_INFO.whatsapp}${text}`;
}

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

// Presentation-only extras shown on course cards, keyed by the API level `name` (A1, A2...).
export const LEVEL_EXTRAS = {
  A1: {
    subName: 'Grundstufe A1 - المبتدئين',
    badge: 'الأكثر طلباً للمبتدئين',
    features: [
      'محاضرات مسجلة عالية الجودة HD',
      'ملفات الشرح والتدريبات PDF',
      'مناقشة وأسئلة على كل محاضرة',
    ],
  },
  A2: {
    subName: 'Grundstufe A2 - المستوى الثاني',
    badge: 'مكثف',
    features: [
      'تطوير القواعد والحوارات اليومية',
      'تدريب على Hören & Schreiben',
      'ملفات تدريبات ونماذج امتحانات',
    ],
  },
  B1: {
    subName: 'Mittelstufe B1 - التأسيس للسفر والعمل',
    badge: 'مؤهل لامتحان Goethe / Telc',
    features: [
      'شرح كافة أجزاء امتحان B1',
      'نماذج امتحانات Goethe و Telc',
      'تدريب على قسم المحادثة Sprechen',
    ],
  },
  B2: {
    subName: 'Mittelstufe B2 - الكفاءة المهنية والأكاديمية',
    badge: 'احترافي',
    features: [
      'فهم النصوص المعقدة والنقاشات التخصصية',
      'تأهيل لسوق العمل الألماني',
      'استراتيجيات اجتياز امتحان B2',
    ],
  },
};

// Presentation-only extras for book cards/pages, keyed by the API book `level`.
export const BOOK_EXTRAS = {
  A1: {
    subName: 'Grundstufe A1 - تأسيس المبتدئين من الصفر',
    features: [
      'شرح القواعد والتمارين باللغة العربية والألمانية معاً',
      'مفردات وجمل محادثة يومية مترجمة',
      'تدريبات على مهارة الاستماع (Hören)',
      'نماذج امتحانات Goethe A1 بالإجابات النموذجية',
    ],
  },
  A2: {
    subName: 'Aufbaukurs A2 - المستوى الثاني والمحادثة',
    features: [
      'القواعد المتقدمة والجمل الجانبية (Nebensätze)',
      'حصيلة لغوية للمواقف اليومية والتعاملات الرسمية',
      'قسم خاص لمهارة الكتابة (Schreiben)',
      'تدريبات على التعبير الشفهي (Sprechen)',
    ],
  },
  B1: {
    subName: 'Mittelstufe B1 - دليل التأهيل للسفر والعمل',
    features: [
      'تأهيل لأقسام الامتحان الأربعة (Lesen, Hören, Schreiben, Sprechen)',
      'نماذج امتحانات Goethe و Telc محلولة بالتفصيل',
      'استراتيجيات الحل السريع لاجتياز الامتحان',
    ],
  },
  B2: {
    subName: 'Oberstufe B2 - الكفاءة المهنية والأكاديمية',
    features: [
      'مصطلحات تخصصية لسوق العمل الألماني',
      'الترجمة الأكاديمية والنقاشات المتقدمة',
      'التحضير لامتحانات Telc B2 & ÖSD',
    ],
  },
};

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

export const PLACEMENT_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Wie heißen Sie? (اختر الإجابة الصحيحة لتحديد اسمك)',
    options: ['Ich heiße Ahmed.', 'Ich bin aus Ägypten.', 'Danke gut.', 'Ich komme morgen.'],
    correct: 0,
    level: 'A1'
  },
  {
    id: 2,
    question: "Welches Verb passt: 'Er _____ Deutsch im Zentrum.'?",
    options: ['lernst', 'lernt', 'lernen', 'gelernt'],
    correct: 1,
    level: 'A1'
  },
  {
    id: 3,
    question: 'Gestern _____ ich einen interessanten Film gesehen.',
    options: ['bin', 'habe', 'hatte', 'sein'],
    correct: 1,
    level: 'A2'
  },
  {
    id: 4,
    question: 'Ich kann nicht kommen, _____ ich krank bin.',
    options: ['denn', 'weil', 'deshalb', 'aber'],
    correct: 1,
    level: 'A2'
  },
  {
    id: 5,
    question: 'Wenn ich mehr Zeit hätte, _____ ich nach Berlin reisen.',
    options: ['würde', 'wäre', 'werde', 'hatte'],
    correct: 0,
    level: 'B1'
  }
];
