// Initial & Fallback Academy Data for Deutsche Welt - Herr Khaled

export const ACADEMY_INFO = {
  name: "Deutsche Welt - الأستاذ خالد",
  subtitle: "أكاديمية اللغة الألمانية المتخصصة للمرحلتين الثانوية والجامعية والراغبين للسفر",
  heroBadge: "🇩🇪 الأكاديمية الأحدث والأنمي في تدريس الألماني بمصر",
  phonePrimary: "01099887766",
  phoneSecondary: "01122334455",
  whatsapp: "201099887766",
  email: "info@deutschewelt-khaled.de",
  socials: {
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    telegram: "https://t.me",
    instagram: "https://instagram.com"
  }
};

export const COURSE_LEVELS_DATA = [
  {
    id: 1,
    code: 'A1',
    name: 'المستوى الأساسي (A1)',
    subName: 'Grundstufe A1 - المبتدئين',
    price: 1200,
    oldPrice: 1500,
    duration: '8 أسابيع (16 محاضرة)',
    hours: '48 ساعة دراسية',
    status: 'متاح للتسجيل',
    badge: 'الأكثر طلباً للمبتدئين',
    description: 'أساسيات اللغة الألمانية، النطق الصحيح، بناء الجمل، والتعارف والمواقف اليومية البسيطة.',
    features: [
      '16 محاضرة تفاعلية عالية الجودة HD',
      'كتاب الشرح والتدريبات مجاناً PDF',
      'متابعة أسبوعية واختبارات قياس مستوى',
      'شهادة إتمام المستوى معتمدة من الأكاديمية'
    ]
  },
  {
    id: 2,
    code: 'A2',
    name: 'المستوى فوق الأساسي (A2)',
    subName: 'Grundstufe A2 - المستوى الثاني',
    price: 1400,
    oldPrice: 1750,
    duration: '8 أسابيع (16 محاضرة)',
    hours: '50 ساعة دراسية',
    status: 'متاح للتسجيل',
    badge: 'مكثف',
    description: 'تطوير القواعد، إجراء الحوارات اليومية بثقة، والتعامل مع التسوق، العمل والسفر.',
    features: [
      '16 محاضرة مع مواقف حية وتدريبات سماعية',
      'تدريب مكثف على قسم الكتابة Hören & Schreiben',
      'بنك أسئلة وتدريبات الامتحانات الدولية',
      'مجموعات مناقشة وتصحيح الواجبات أولاً بأول'
    ]
  },
  {
    id: 3,
    code: 'B1',
    name: 'المستوى المتوسط (B1)',
    subName: 'Mittelstufe B1 - التأسيس للسفر والعمل',
    price: 1800,
    oldPrice: 2200,
    duration: '10 أسابيع (20 محاضرة)',
    hours: '65 ساعة دراسية',
    status: 'متاح للتسجيل',
    badge: 'مؤهل لامتحان Goethe / Telc',
    description: 'مستوى استقلالية اللغة، التعبير عن الآراء والمشاعر، والتحضير للامتحانات الدولية للسفر.',
    features: [
      '20 محاضرة شاملة كافة أجزاء امتحان B1',
      'نماذج امتحانات Goethe و Telc محلولة وشرح التريكات',
      'تدريب محاكاة لقسم المحادثة شفاهياً Sprechen',
      'دعم مباشر ومراجعات ليلة الامتحان'
    ]
  },
  {
    id: 4,
    code: 'B2',
    name: 'المستوى المتقدم (B2)',
    subName: 'Mittelstufe B2 - الكفاءة المهنية والأكاديمية',
    price: 2200,
    oldPrice: 2700,
    duration: '12 أسبوع (24 محاضرة)',
    hours: '80 ساعة دراسية',
    status: 'قريباً',
    badge: 'احترافي',
    description: 'الفهم العميق للنصوص المعقدة والنقاشات التخصصية باللغة الألمانية وسوق العمل الألماني.',
    features: [
      'تدريب متخصص للأطباء والمهندسين والراغبين بالعمل',
      'تطوير مهارات المفاوضات والعروض التقديمية',
      'استراتيجيات اجتياز امتحان B2 من المرة الأولى'
    ]
  },
  {
    id: 5,
    code: 'C1',
    name: 'المستوى الاحترافي (C1)',
    subName: 'Oberstufe C1 - الإتقان الكامل',
    price: 2600,
    oldPrice: 3200,
    duration: '12 أسبوع (24 محاضرة)',
    hours: '90 ساعة دراسية',
    status: 'قريباً',
    badge: 'جامعي متقدم',
    description: 'إتقان اللغة والتعبير السلس والتواصل بدون مجهود في البيئة الأكاديمية والبحثية.',
    features: [
      'إعداد كامل لامتحان DSH و TestDaF للقبول الجامعي',
      'كتابة المقالات العلمية والتحليل الأكاديمي'
    ]
  }
];

export const BOOKS_STORE_DATA = [
  {
    id: 101,
    title: 'سلسلة Deutsche Welt A1 - الكتاب الشامل',
    level: 'A1',
    price: 250,
    oldPrice: 300,
    type: 'ورقي + نسخه PDF',
    pages: 210,
    coverBg: 'from-amber-600 to-red-600',
    description: 'الكتاب المعتمد لأحدث منهج ألماني مبسط بالشرح العربي والتدريبات الشاملة.',
    samplePages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 102,
    title: 'سلسلة Deutsche Welt A2 - كتاب القواعد والتطبيقات',
    level: 'A2',
    price: 280,
    oldPrice: 340,
    type: 'ورقي + نسخه PDF',
    pages: 240,
    coverBg: 'from-blue-600 to-indigo-700',
    description: 'تجميع لكل قواعد وتراكيب A2 مع بنك أسئلة تفاعلي وإجاباتها النموذجية.',
    samplePages: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 103,
    title: 'دليل اجتياز امتحان B1 Goethe & Telc',
    level: 'B1',
    price: 350,
    oldPrice: 420,
    type: 'مطبوع فاخر',
    pages: 310,
    coverBg: 'from-emerald-600 to-teal-800',
    description: 'أهم 50 موضوع كتابة ومحادثة متوقعة في الامتحانات مع ترجمتها وإستراتيجيات الحل.',
    samplePages: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
    ]
  }
];

export const BRANCHES_DATA = [
  {
    id: 1,
    name: 'فرع الدقي - الجيزة',
    address: 'شارع مصدق - بجوار محطة مترو الدقي، الجيزة',
    phone: '01011223344',
    times: 'يومياً من 10 صباحاً حتى 9 مساءً (عدا الجمعة)',
    badge: 'الفرع الرئيسي'
  },
  {
    id: 2,
    name: 'فرع مدينة نصر - القاهرة',
    address: 'شارع عباس العقاد - بالقرب من الحديقة الدولية، القاهرة',
    phone: '01122445566',
    times: 'يومياً من 11 صباحاً حتى 9:30 مساءً',
    badge: 'فرع القاهرة'
  }
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

export const STUDENT_REVIEWS_DATA = [
  {
    id: 1,
    studentName: 'أحمد محمود',
    level: 'طالب B1 - حجز سفارة ألمانيا',
    comment: 'بفضل الله ثم شرح الأستاذ خالد القوي جداً في B1، قدرت أجتاز امتحان جوته من أول مرة بتقدير Sehr Gut!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    imageReview: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    studentName: 'سارة خالد',
    level: 'طالبة ثانوي عام',
    comment: 'الألماني كان عقدتي في الثانوية، بس مع طريقة الأستاذ خالد وتبسيط القواعد جبت 40 من 40 الحمد لله!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    imageReview: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    studentName: 'د. محمد حسن',
    level: 'طبيب - تعديل شهادة B2',
    comment: 'التأهيل لمحادثات الأطباء والمصطلحات الطبية كان رائع، المنصة سهلة وسريعة والمحاضرات فائقة الجودة.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    imageReview: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80'
  }
];

export const PLACEMENT_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Wie heißen Sie? (اختر الإجابة الصحيحة لتحديد اسمك)",
    options: [
      "Ich heiße Ahmed.",
      "Ich bin aus Ägypten.",
      "Danke gut.",
      "Ich komme morgen."
    ],
    correct: 0,
    level: "A1"
  },
  {
    id: 2,
    question: "Welches Verb passt: 'Er _____ Deutsch im Zentrum.'?",
    options: [
      "lernst",
      "lernt",
      "lernen",
      "gelelernt"
    ],
    correct: 1,
    level: "A1"
  },
  {
    id: 3,
    question: "Gestern _____ ich einen interessanten Film gesehen.",
    options: [
      "bin",
      "habe",
      "hatte",
      "sein"
    ],
    correct: 1,
    level: "A2"
  },
  {
    id: 4,
    question: "Ich kann nicht kommen, _____ ich krank bin.",
    options: [
      "denn",
      "weil",
      "deshalb",
      "aber"
    ],
    correct: 1,
    level: "A2"
  },
  {
    id: 5,
    question: "Wenn ich mehr Zeit hätte, _____ ich nach Berlin reisen.",
    options: [
      "würde",
      "wäre",
      "werde",
      "hatte"
    ],
    correct: 0,
    level: "B1"
  }
];

export const MOCK_LESSON_VIDEOS = [
  {
    id: 'vid-01',
    title: 'المحاضرة الأولى: Alphabet & Begrüßung (الأبجدية والتحيات)',
    duration: '45 دقيقة',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pdfAttachment: 'Lecture1_Notes_A1.pdf',
    fileId: 101,
    comments: [
      { id: 1, author: 'عمر القاضي', text: 'شرح مبسط وواضح جداً، جزاك الله خيراً يا أستاذنا', time: 'منذ ساعتين', replies: [] }
    ]
  },
  {
    id: 'vid-02',
    title: 'المحاضرة الثانية: Personalpronomen & Verben (الضمائر والأفعال)',
    duration: '50 دقيقة',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pdfAttachment: 'Lecture2_Verbs_A1.pdf',
    fileId: 102,
    comments: []
  }
];
