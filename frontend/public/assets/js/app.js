/**
 * DEUTSCHE WELT AKADEMIE - HERR KHALED
 * Main Frontend Application Script
 * Interactive Canvas, Audio Speech, Quizzes, Store & Course Registration
 */

// Initial Seed Data for Courses (Authentic 4 Core Levels: A1, A2, B1, B2)
const DEFAULT_COURSES = [
  {
    id: 'course-a1',
    level: 'A1',
    category: 'beginner',
    themeClass: 'theme-a1',
    badgeText: 'كورس لغة ألمانية A1',
    germanTagline: 'Deutsch Grundstufe A1',
    title: 'كورس اللغة الألمانية - المستوى A1',
    subtitle: 'تعليم اللغة الألمانية للمبتدئين من الصفر — أونلاين Live',
    hours: '60 ساعة معتمدة',
    lectures: '24 محاضرة تفاعلية Live',
    duration: 'شهرين ونصف',
    price: 1200,
    originalPrice: 1600,
    discount: '-25%',
    seatsLeft: 4,
    currency: 'EGP',
    status: 'open',
    featured: false,
    outcomes: [
      'تأسيس صوتي متقن ومخارج الحروف وقواعد النطق السليم',
      'تكوين الجمل الصحيحة وقواعد الضمائر والأفعال وأدوات المعرفة والنفي',
      'إجراء المحادثات اليومية للتعريف بالنفس والسكن والتسوق والمطاعم',
      'تدريب عملي على نماذج امتحانات المستوى A1 والتحدث بثقة'
    ]
  },
  {
    id: 'course-a2',
    level: 'A2',
    category: 'beginner',
    themeClass: 'theme-a2',
    badgeText: 'كورس لغة ألمانية A2',
    germanTagline: 'Deutsch Aufbaukurs A2',
    title: 'كورس اللغة الألمانية - المستوى A2',
    subtitle: 'المستوى المتوسط وتطوير المحادثة والقواعد — أونلاين Live',
    hours: '65 ساعة معتمدة',
    lectures: '26 محاضرة تفاعلية Live',
    duration: 'شهرين ونصف',
    price: 1400,
    originalPrice: 1850,
    discount: '-24%',
    seatsLeft: 5,
    currency: 'EGP',
    status: 'open',
    featured: false,
    outcomes: [
      'التحدث بطلاقة في مواقف الحياة اليومية والعملية المختلفة',
      'إتقان زمن الماضي والتفريق الاحترافي بين الأفعال وتراكيب الجمل',
      'حالات الجر وحروف الجر المشتركة والأفعال المنفصلة والمتصلة',
      'كتابة الرسائل والإيميلات الرسمية وغير الرسمية باحترافية كاملة'
    ]
  },
  {
    id: 'course-b1',
    level: 'B1',
    category: 'intermediate',
    themeClass: 'theme-b1',
    badgeText: 'كورس لغة ألمانية B1',
    germanTagline: 'Deutsch Mittelstufe B1',
    title: 'كورس اللغة الألمانية - المستوى B1',
    subtitle: 'المستوى فوق المتوسط والمحادثات المتقدمة — أونلاين Live',
    hours: '75 ساعة مكثفة',
    lectures: '30 محاضرة تفاعلية Live',
    duration: '3 أشهر',
    price: 1800,
    originalPrice: 2400,
    discount: '-25%',
    seatsLeft: 3,
    currency: 'EGP',
    status: 'open',
    featured: false,
    outcomes: [
      'إتقان الجمل المركبة والروابط المتقدمة وصيغ التعبير الراقي',
      'تدريب شامل ومكثف على نماذج امتحانات المستوى B1',
      'التدريب العملي على المحادثات ومواقف الحياة اليومية والعمل',
      'اكتساب الثقة الكاملة للتحدث في مختلف الموضوعات'
    ]
  },
  {
    id: 'course-b2',
    level: 'B2',
    category: 'intermediate',
    themeClass: 'theme-b2',
    badgeText: 'كورس لغة ألمانية B2',
    germanTagline: 'Deutsch Oberstufe B2',
    title: 'كورس اللغة الألمانية - المستوى B2',
    subtitle: 'المستوى المتقدم والطلاقة اللغوية — أونلاين Live',
    hours: '80 ساعة معتمدة',
    lectures: '32 محاضرة تفاعلية Live',
    duration: '3 أشهر',
    price: 2200,
    originalPrice: 2900,
    discount: '-24%',
    seatsLeft: 4,
    currency: 'EGP',
    status: 'open',
    featured: false,
    outcomes: [
      'إتقان التراكيب اللغوية المتقدمة والمتلازمات والمصطلحات التخصصية',
      'كتابة التقارير الرسمية والخطابات والردود المهنية الدقيقة',
      'التدريب الاحترافي على نماذج امتحانات المستوى B2',
      'إدارة النقاشات والمناظرات باللغة الألمانية بطلاقة كاملة'
    ]
  }
];

// Initial Seed Data for Books (Exact from Deutsche Welt App)
const DEFAULT_BOOKS = [
  {
    id: 'book-a1',
    level: 'A1',
    title: 'كتاب دويتشه فيلت الشامل (A1) 📖',
    subtitle: 'Deutsche Welt Akademie — Herr / خالد الحلواني',
    desc: 'دليلك الشامل لتعلم الألمانية خطوة بخطوة من الصفر حتى إتقان المحادثة والقواعد (Kapitel 1 - 10).',
    pagesCount: 190,
    price: 500,
    currency: 'EGP',
    status: 'available',
    previewPages: [
      {
        title: 'فهرس منهج A1 (الفصول 1 - 3) 📌',
        subtitle: 'Deutsche Welt Akademie — Herr / خالد الحلواني',
        content: [
          '📖 Kapitel 1 – Guten Tag',
          '  • Sich vorstellen • Nach dem Namen fragen',
          '  • Herkunft und Wohnort • Begrüßungen und Verabschiedungen',
          '  • Das Befinden • Das Alphabet • Länder und Sprachen',
          '',
          '📖 Kapitel 2 – Freunde, Kollegen und ich',
          '  • Freunde und Familie • Berufe und Arbeitsplatz',
          '  • Zahlen bis 100 • Sprachen und Länder',
          '  • Verben konjugieren • Personalpronomen im Nominativ',
          '',
          '📖 Kapitel 3 – In der Stadt',
          '  • Sehenswürdigkeiten • Verkehrsmittel',
          '  • Gebäude und Orte • Orientierung in der Stadt',
          '  • Bestimmter und unbestimmter Artikel • Verneinung mit kein / nicht'
        ],
        highlight: 'تأسيس متين وشامل مع تدريبات النطق الصوتي والقواعد الأساسية.'
      },
      {
        title: 'فهرس منهج A1 (الفصول 4 - 6) 📌',
        subtitle: 'Deutsche Welt Akademie — Herr / خالد الحلواني',
        content: [
          '📖 Kapitel 4 – Guten Appetit',
          '  • Essen und Trinken • Im Restaurant bestellen',
          '  • Lebensmittel einkaufen • Maße und Gewichte',
          '  • Akkusativ • Verben mit Akkusativ • Möchten / Mögen',
          '',
          '📖 Kapitel 5 – Tag für Tag',
          '  • Tagesablauf • Uhrzeiten und Termine',
          '  • Wochentage und Monate • Verabredungen treffen',
          '  • Trennbare Verben • Temporale Präpositionen (um, am, im)',
          '',
          '📖 Kapitel 6 – Zeit mit Freunden',
          '  • Freizeitaktivitäten • Hobbys und Interessen',
          '  • Einladungen annehmen und ablehnen • Im Café',
          '  • Modalverben (können, wollen, müssen) • Satzstellung'
        ],
        highlight: 'تطبيق عملي للمحادثات اليومية والتسوق وحياة الشارع الألماني.'
      },
      {
        title: 'فهرس منهج A1 (الفصول 7 - 10) 📌',
        subtitle: 'Deutsche Welt Akademie — Herr / خالد الحلواني',
        content: [
          '📖 Kapitel 7 – Einkaufen und Kleidung',
          '  • Kleidungsstücke • Farben und Größen',
          '  • Gefallen und Missfallen ausdrücken • Im Kaufhaus',
          '',
          '📖 Kapitel 8 – Unterwegs & Reisen',
          '  • Urlaub und Reisen • Hotelreservierung',
          '  • Am Bahnhof und Flughafen • Perfekt Einführung',
          '',
          '📖 Kapitel 9 – Wohnen und Leben',
          '  • Wohnungssuche • Zimmer und Möbel • Mietvertrag',
          '',
          '📖 Kapitel 10 – Gesundheit und Körper',
          '  • Körperteile • Beim Arzt • Ratschläge geben'
        ],
        highlight: 'استعداد كامل لاجتياز اختبار معهد جوته Goethe-Zertifikat A1 بامتياز!'
      }
    ]
  },
  {
    id: 'book-a2',
    level: 'A2',
    title: 'كتاب دويتشه فيلت المتقدم (A2) 📖',
    subtitle: 'Deutsche Welt Akademie — Herr / خالد الحلواني',
    desc: 'الانطلاق في التعبير عن الماضي والمستقبل وقواعد Dativ & Wechselpräpositionen والكتابة الرسمية.',
    pagesCount: 220,
    price: 500,
    currency: 'EGP',
    status: 'available',
    previewPages: [
      {
        title: 'فهرس منهج A2 (الفصول 1 - 3) 📌',
        subtitle: 'Deutsche Welt Akademie — Herr / خالد الحلواني',
        content: [
          '📖 Kapitel 1 – Und was machst du?',
          '  • Das Perfekt • Genitiv (Name + s) • Nebensatz mit weil',
          '  • Bildbeschreibung • Dialoge • Schreiben',
          '',
          '📖 Kapitel 2 – Nach der Schulzeit',
          '  • Schulzeit • Ausbildung und Studium • Erinnerungen',
          '  • Modalverben im Präteritum • Nominativ, Akkusativ und Dativ',
          '  • Das Schulsystem in Deutschland • Fragen und Antworten',
          '',
          '📖 Kapitel 3 – Immer online?',
          '  • Digitale Medien • Handy und Internet • Soziale Medien',
          '  • Komparativ und Superlativ • Nebensatz mit dass',
          '  • Meinung äußern • Vor- und Nachteile abwägen'
        ],
        highlight: 'تأسيس متين وقواعد A2 المتقدمة مع الربط بالحياة والتواصل المستمر.'
      },
      {
        title: 'فهرس منهج A2 (الفصول 4 - 7) 📌',
        subtitle: 'Deutsche Welt Akademie — Herr / خالد الحلواني',
        content: [
          '📖 Kapitel 4 – Große und kleine Gefühle',
          '  • Gefühle und Emotionen • Ratschläge geben (Konjunktiv II: sollte)',
          '',
          '📖 Kapitel 5 – Leben in der Stadt & Wohnen',
          '  • Wohnformen • Nachbarschaft • Umzug',
          '  • Wechselpräpositionen mit Dativ und Akkusativ',
          '',
          '📖 Kapitel 6 – Arbeitswelt & Beruf',
          '  • Berufsalltag • Bewerbung und Lebenslauf • Telefonieren im Beruf',
          '',
          '📖 Kapitel 7 – Unterwegs in Europa',
          '  • Urlaubsziele • Kultur und Sehenswürdigkeiten • Reisebericht'
        ],
        highlight: 'تأهيل كامل لاجتياز Goethe A2 والاندماج في بيئة العمل الألمانية.'
      }
    ]
  },
  {
    id: 'book-b1',
    level: 'B1',
    title: 'كتاب التأهيل والامتحانات الدولية (B1) 🏆',
    subtitle: 'Deutsche Welt Akademie — Herr / خالد الحلواني',
    desc: 'سلسلة هير خالد الذهبية لتخطي امتحان B1 والتأهيل لمقابلات الكول سنتر وسوق العمل والسفر لألمانيا.',
    pagesCount: 260,
    price: 500,
    currency: 'EGP',
    status: 'available',
    previewPages: [
      {
        title: 'فهرس منهج B1 (المقدمة والدرس الأول) 📌',
        subtitle: 'Deutsche Welt Akademie — Herr / خالد الحلواني',
        content: [
          '🟢 Inhaltsverzeichnis & Einführung',
          '📖 Kapitel 1: Gute Reise (الأجزاء 1 إلى 7)',
          '  • Vorbereitung auf die Reise • Am Flughafen & Bahnhof',
          '  • Verkehrsmittel in Deutschland • Hotelreservierung',
          '  • Nebensätze mit obwohl & trotzdem • Passiv Einführung'
        ],
        highlight: 'مفتاح التأشيرة الألمانية والكول سنتر عالي الأجر.'
      },
      {
        title: 'فهرس منهج B1 (سوق العمل والمقابلات) 📌',
        subtitle: 'Deutsche Welt Akademie — Herr / خالد الحلواني',
        content: [
          '📖 Kapitel 2: Arbeitswelt & Karriere',
          '  • Vorstellungsgespräch (المقابلات الشخصية)',
          '  • Call Center & Customer Care Simulation (محاكاة المكالمات)',
          '  • Beschwerdemanagement (إدارة الشكاوى باللغة الألمانية)',
          '  • Passiv im Präsens und Präteritum • Konjunktiv II'
        ],
        highlight: 'تأهيل فوري لشركات Concentrix و Vodafone والقبول من أول إنترفيو.'
      },
      {
        title: 'فهرس منهج B1 (الملحق الشامل وبنك الامتحانات) 📌',
        subtitle: 'Deutsche Welt Akademie — Herr / خالد الحلواني',
        content: [
          '🧠 Anhang (الملحق الشامل)',
          '  • بنك نماذج امتحانات Goethe-Zertifikat B1 و Telc B1',
          '  • تدريبات السمعيات والمحادثات عبر QR Codes',
          '  • قاموس أهم الأفعال المركبة وحروف الجر الثابتة'
        ],
        highlight: 'المرجع الأول لطلاب B1 في مصر والوطن العربي.'
      }
    ]
  },
  {
    id: 'book-b2',
    level: 'B2',
    title: 'كتاب الاحتراف اللغوي المتقدم (B2) ⏳',
    subtitle: 'Herr / خالد الحلواني — قيد التجهيز والإعداد',
    desc: 'دليلك للوصول إلى المستوى المتقدم في اللغة الألمانية وتأهيل الأطباء والتمريض والكوادر العليا.',
    pagesCount: 280,
    price: 500,
    currency: 'EGP',
    status: 'coming_soon',
    previewPages: [
      {
        title: 'كتاب B2 قيد التجهيز والإعداد ⌛',
        subtitle: 'دليلك للوصول إلى المستوى المتقدم مع Herr / خالد الحلواني',
        content: [
          '• الوحدة الأولى: B2 Passiv & Konjunktiv II (القواعد المتقدمة)',
          '• الوحدة الثانية: Nomen-Verb-Verbindungen (التراكيب اللغوية الاحترافية)',
          '• الوحدة الثالثة: كورس المصطلحات الطبية للأطباء والتمريض (Fachsprache Medizin)',
          '• الوحدة الرابعة: فن كتابة التقارير والمناظرات والنقاشات الأكاديمية'
        ],
        highlight: 'قريباً إن شاء الله — تابعنا على المنصة لمعرفة موعد الصدور!'
      }
    ]
  }
];

// Placement Quiz Questions
const QUIZ_QUESTIONS = [
  {
    q: '1. Wie heißt du? - _____ heiße Ahmed.',
    options: ['Du', 'Ich', 'Er', 'Sie'],
    correct: 1,
    level: 'A1'
  },
  {
    q: '2. Woher kommst du? - Ich komme _____ Ägypten.',
    options: ['in', 'nach', 'aus', 'bei'],
    correct: 2,
    level: 'A1'
  },
  {
    q: '3. Das ist ein Buch. Ich lese _____ Buch gerne.',
    options: ['der', 'das', 'die', 'den'],
    correct: 1,
    level: 'A1'
  },
  {
    q: '4. Was hast du gestern gemacht? - Ich habe einen Film _____.',
    options: ['gesehen', 'sehen', 'sehe', 'gesieht'],
    correct: 0,
    level: 'A2'
  },
  {
    q: '5. Ich fahre jeden Tag mit _____ Bus zur Arbeit.',
    options: ['der', 'dem', 'den', 'das'],
    correct: 1,
    level: 'A2'
  },
  {
    q: '6. Ich lerne fleißig Deutsch, _____ ich in Deutschland arbeiten möchte.',
    options: ['weil', 'denn', 'aber', 'obwohl'],
    correct: 0,
    level: 'B1'
  },
  {
    q: '7. Wenn ich viel Geld hätte, _____ ich eine Weltreise machen.',
    options: ['würde', 'wäre', 'werde', 'habe'],
    correct: 0,
    level: 'B1'
  },
  {
    q: '8. Das neue Gesetz wurde vom Parlament _____.',
    options: ['beschlossen', 'beschließen', 'beschloss', 'beschließt'],
    correct: 0,
    level: 'B2'
  },
  {
    q: '9. Trotz _____ schlechten Wetters gingen die Kinder im Park spazieren.',
    options: ['dem', 'des', 'den', 'das'],
    correct: 1,
    level: 'B2'
  },
  {
    q: '10. Wir müssen eine Lösung finden, um dieses Problem in den Griff zu _____.',
    options: ['nehmen', 'bringen', 'bekommen', 'halten'],
    correct: 2,
    level: 'B2'
  }
];

// Branches Initial Data (أكاديمية دويتشه فيلت - الفروع الرسمية)
const DEFAULT_BRANCHES = [
  {
    id: 'branch-1',
    name: 'فرع شبين الكوم',
    city: 'المنوفية',
    address: 'برج حجازي – الدور الثاني علوي\nأمام مستشفى الجامعة مباشرة',
    mapUrl: 'https://maps.app.goo.gl/NJRj414R5yurS7Gs8?g_st=ac',
    phone: '010552287454',
    badge: '🏢 فرع رئيسي',
    type: 'physical'
  },
  {
    id: 'branch-2',
    name: 'فرع مدينة نصر',
    city: 'القاهرة',
    address: '١٦ ش شريف سامي - بالقرب من (كوبري المنهل / جامع السلام) - الدور الأول',
    mapUrl: 'https://maps.app.goo.gl/i55RDUisL7wcdwf3A',
    phone: '01144151673',
    badge: '📍 القاهرة',
    type: 'physical'
  },
  {
    id: 'branch-3',
    name: 'فرع المنصورة',
    city: 'الدقهلية',
    address: '١ شارع الشيخ الغزالي أمام مستشفي الجامعة البوابة الرئيسية',
    mapUrl: 'https://maps.app.goo.gl/PpTdBa3fkWC7WGYt5',
    phone: '010552287454',
    badge: '📍 الدقهلية',
    type: 'physical'
  },
  {
    id: 'branch-4',
    name: 'فرع الإسكندرية',
    city: 'الإسكندرية',
    address: 'سموحة ١ شارع 3 من شارع النصر أمام صيدلية الخليلي',
    mapUrl: 'https://maps.app.goo.gl/WY4LqQKPTK4M9e4A7',
    phone: '01144151673',
    badge: '🥳 عروس البحر',
    type: 'physical'
  },
  {
    id: 'branch-5',
    name: 'فرع الدراسة أونلاين (Online)',
    city: 'جميع المحافظات والدول',
    address: 'محاضرات تفاعلية مباشرة عبر Zoom / Teams لجميع المحافظات ودول العالم مع المتابعة المستمرة للمستويات',
    mapUrl: 'https://wa.me/2010552287454?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%87%D9%8A%D8%B1%20%D8%AE%D8%A7%D9%84%D8%AF%D9%80%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D9%83%D9%88%D8%B1%D8%B3%D8%A7%D8%AA%20%D8%A7%D9%84%D8%A3%D9%88%D9%86%D9%84%D8%A7%D9%8A%D9%86',
    phone: '010552287454',
    badge: '💻 محاضرة مباشرة (Live)',
    type: 'online'
  }
];

// App State Management
class DeutscheWeltApp {
  constructor() {
    this.courses = this.loadCourses();
    this.branches = this.loadBranches();
    this.books = DEFAULT_BOOKS;
    this.quizIndex = 0;
    this.quizAnswers = [];
    this.activeFilter = 'all';

    this.init();
  }

  loadCourses() {
    // Reset or load authentic 4 core courses
    try {
      const saved = localStorage.getItem('dw_courses_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4 && parsed.every(c => ['course-a1', 'course-a2', 'course-b1', 'course-b2'].includes(c.id))) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing courses from storage', e);
    }
    // Clean old storage keys and save standard 4
    localStorage.removeItem('dw_courses');
    localStorage.removeItem('dw_courses_v2');
    localStorage.setItem('dw_courses_v3', JSON.stringify(DEFAULT_COURSES));
    return DEFAULT_COURSES;
  }

  saveCourses(courses) {
    this.courses = courses;
    localStorage.setItem('dw_courses_v3', JSON.stringify(courses));
    this.renderCourses();
  }

  init() {
    this.renderCourses();
    this.renderBranches();
    this.setupEventListeners();
    this.initCountdownTimer();
    this.initSpeechSynthesis();
    this.initReviewGallery();
    this.initBackendIntegration();
    this.initScrollRevealEngine();
  }


  // ===================== BRANCHES =====================
  loadBranches() {
    try {
      const saved = localStorage.getItem('dw_branches_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading branches', e);
    }
    localStorage.setItem('dw_branches_v2', JSON.stringify(DEFAULT_BRANCHES));
    return DEFAULT_BRANCHES;
  }

  saveBranches(branches) {
    this.branches = branches;
    localStorage.setItem('dw_branches_v2', JSON.stringify(branches));
    this.renderBranches();
  }

  renderBranches() {
    const container = document.getElementById('branchesContainer');
    if (!container) return;
    this.branches = this.loadBranches();
    container.innerHTML = this.branches.map(branch => {
      const isOnline = branch.type === 'online';
      const icon = isOnline ? 'fa-laptop-code' : 'fa-building-columns';
      const btnText = isOnline ? '<i class="fab fa-whatsapp"></i> تواصل لحجز كورس الأونلاين' : '<i class="fas fa-map-location-dot"></i> افتح الموقع على الخريطة';
      const mapLabel = isOnline ? 'واتساب مباشرة' : 'Google Maps';
      const addressHtml = (branch.address || '').replace(/\n/g, '<br>');
      return `
        <div class="branch-card ${isOnline ? 'branch-online' : ''}" id="${branch.id}">
          <div class="branch-card-top">
            <span class="branch-badge ${isOnline ? 'badge-online' : 'badge-physical'}">${branch.badge || (isOnline ? '💻 أونلاين' : '📍 فرع')}</span>
            <div class="branch-icon-wrap"><i class="fas ${icon}"></i></div>
          </div>
          <h3 class="branch-title">${branch.name}</h3>
          <span class="branch-city-pill"><i class="fas fa-location-dot"></i> ${branch.city}</span>
          <div class="branch-address-box">
            <i class="fas fa-map-pin"></i> ${addressHtml}
          </div>
          <div class="branch-actions">
            <a href="${branch.mapUrl}" target="_blank" rel="noopener" class="branch-map-btn ${isOnline ? 'whatsapp' : ''}">
              ${btnText}
            </a>
          </div>
        </div>
      `;
    }).join('');

    setTimeout(() => {
      if (this.scanAndRegisterRevealElements) this.scanAndRegisterRevealElements();
    }, 60);
  }


  speakGerman(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      this.showToast('🔊 تشغيل الصوت الألماني: ' + text.substring(0, 35) + '...', 'info');
    } else {
      this.showToast('ميزة النطق الصوتي غير مدعومة في متصفحك.', 'error');
    }
  }

  initSpeechSynthesis() {
    const heroAudioBtn = document.getElementById('heroAudioPlayBtn');
    if (heroAudioBtn) {
      heroAudioBtn.addEventListener('click', () => {
        this.speakGerman('Guten Tag! Willkommen bei Deutsche Welt Akademie mit Herr Khaled.');
      });
    }
  }

  // Render Courses Cards (Ultra-Luxury VIP Edition: A1, A2, B1, B2)
  renderCourses() {
    const container = document.getElementById('coursesContainer');
    if (!container) return;

    const filtered = this.courses.filter(course => {
      if (this.activeFilter === 'all') return true;
      if (this.activeFilter === 'beginner') return course.category === 'beginner';
      if (this.activeFilter === 'intermediate') return course.category === 'intermediate';
      return true;
    });

    container.innerHTML = filtered.map(course => {
      const safeTitle = (course.title || '').replace(/'/g, "\\'");
      const originalPrice = course.originalPrice || (course.price + 400);
      const outcomes = course.outcomes || [];

      return `
        <div class="course-card-vip ${course.themeClass || 'theme-a1'} ${course.featured ? 'is-featured' : ''}" id="${course.id}">
          
          <!-- Top Luxury Bar -->
          <div class="course-vip-topbar">
            <div class="course-vip-badge">
              ${course.badgeText || (course.featured ? '⭐ الأكثر طلباً' : '🇩🇪 كورس معتمد')}
            </div>
            <div class="course-seats-pill">
              <span class="seat-pulse"></span> متبقي <strong>${course.seatsLeft || 4} مقاعد فقط</strong>
            </div>
          </div>

          <!-- Level Identity Hero Area -->
          <div class="course-vip-header">
            <div class="course-vip-level-wrapper">
              <div class="course-vip-level-emblem">
                <span class="level-symbol">${course.level}</span>
                <span class="emblem-glow"></span>
              </div>
              <div class="course-vip-level-meta">
                <span class="german-tagline">${course.germanTagline || 'Deutsche Welt Akademie'}</span>
                <h3 class="course-vip-title">${course.title}</h3>
              </div>
            </div>
            <p class="course-vip-desc">${course.subtitle}</p>
          </div>


          <!-- Price & Action VIP Footer -->
          <div class="course-vip-footer">
            <div class="course-pricing-block">
              <div class="price-row-top">
                <span class="original-price">${originalPrice} ${course.currency}</span>
                <span class="discount-badge">${course.discount || '-25%'}</span>
              </div>
              <div class="price-main">
                <span class="price-num">${course.price}</span>
                <span class="price-curr">${course.currency}</span>
              </div>
              <div class="price-subtext">شامل المحاضرات المباشرة والتسجيلات والشهادة المعتمدة</div>
            </div>

            <div class="course-cta-block">
              <button type="button" class="btn-vip-enroll" onclick="window.dwApp.openEnrollModal('${course.id}', '${safeTitle}', ${course.price})">
                <span>احجز مقعدك الآن</span>
                <i class="fas fa-arrow-left"></i>
              </button>
              <a href="https://wa.me/201018678000?text=${encodeURIComponent('مرحباً هير خالد، أود الاستفسار والتسجيل في كورس ' + course.title)}" target="_blank" rel="noopener" class="btn-vip-whatsapp" title="استشارة واتساب سريعة">
                <i class="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    setTimeout(() => {
      if (this.scanAndRegisterRevealElements) this.scanAndRegisterRevealElements();
    }, 60);
  }

  // Filter Tabs Handler
  setupEventListeners() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-tab-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.getAttribute('data-filter') || 'all';
        this.renderCourses();
      });
    });

    // Theme Toggle (Default Clean White Light Mode / Toggle to Obsidian Dark Mode)
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('dw_theme', isDark ? 'dark' : 'light');
        this.showToast(isDark ? 'تم تفعيل الوضع الليلي الأنيق 🌙' : 'تم تفعيل الوضع النهاري الأبيض الصافي ☀️', 'info', 'تغيير المظهر');
      });

      if (localStorage.getItem('dw_theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        document.body.classList.remove('dark-theme');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
      }
    }

    // Mobile Navigation Toggle
    const mobileBtn = document.getElementById('mobileMenuBtn') || document.getElementById('mobileNavBtn');
    const navMenu = document.getElementById('navMenu') || document.getElementById('mainNavMenu');
    if (mobileBtn && navMenu) {
      mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
      navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
        });
      });
    }

    // CV Section Tabs
    const cvTabBtns = document.querySelectorAll('.cv-tab-btn');
    cvTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        cvTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target') || btn.getAttribute('data-cv-tab');
        document.querySelectorAll('.cv-tab-pane').forEach(pane => pane.classList.remove('active'));
        const targetPane = document.getElementById(targetId) || document.getElementById(`cv-pane-${targetId}`);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Close Modals on click outside
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });
  }

  // Countdown Timer in Announcement Bar
  initCountdownTimer() {
    const timerEl = document.getElementById('announcementTimer');
    if (!timerEl) return;

    let targetDate = new Date().getTime() + (48 * 60 * 60 * 1000); // 48 hours from now

    setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        timerEl.innerText = "00:00:00";
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timerEl.innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  // Enrollment Modal
  openEnrollModal(courseId, courseTitle, coursePrice) {
    const modal = document.getElementById('enrollModal');
    const titleEl = document.getElementById('enrollModalCourseTitle');
    const inputCourseId = document.getElementById('enrollCourseId');
    const selectCourseName = document.getElementById('enrollCourseName');
    const inputCoursePrice = document.getElementById('enrollCoursePrice');

    if (modal) {
      if (titleEl) titleEl.innerText = courseTitle || 'تسجيل في الكورس الأونلاين';
      if (inputCourseId) inputCourseId.value = courseId || '';
      if (inputCoursePrice) inputCoursePrice.value = coursePrice || 0;
      if (selectCourseName && courseTitle) {
        // Match option with courseTitle or set value
        let found = false;
        for (let i = 0; i < selectCourseName.options.length; i++) {
          if (selectCourseName.options[i].text.includes(courseTitle) || selectCourseName.options[i].value.includes(courseTitle)) {
            selectCourseName.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          selectCourseName.value = courseTitle;
        }
      }
      modal.classList.add('active');
    }
  }

  closeEnrollModal() {
    const modal = document.getElementById('enrollModal');
    if (modal) modal.classList.remove('active');
  }

  async handleEnrollSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.studentName.value.trim();
    const phone = form.studentPhone.value.trim();
    const email = (form.studentEmail.value || '').trim();
    const course = form.courseName.value;
    const payment = form.paymentMethod.value;
    const notes = form.studentNotes.value || 'لا توجد ملاحظات';

    const registration = {
      id: 'REG-' + Date.now(),
      name,
      student_name: name,
      phone,
      email,
      course_name: course,
      payment_method: payment,
      payment,
      notes,
      date: new Date().toLocaleString('ar-EG'),
      status: 'pending'
    };

    // 1. Save to LocalStorage cache
    const saved = JSON.parse(localStorage.getItem('dw_registrations') || '[]');
    saved.unshift(registration);
    localStorage.setItem('dw_registrations', JSON.stringify(saved));

    // 2. Post to Live Backend Database
    if (window.DW_API) {
      try {
        await window.DW_API.client.request('/api/registrations/', {
          method: 'POST',
          body: JSON.stringify({
            student_name: name,
            phone: phone,
            email: email || null,
            course_name: course,
            payment_method: payment,
            notes: notes
          })
        });
      } catch (apiErr) {
        console.warn('Backend sync failed, saved locally:', apiErr.message);
      }
    }

    this.closeEnrollModal();
    this.showToast('🎉 تم تسجيل طلب حجز الكورس بنجاح في قاعدة البيانات! جاري تحويلك للواتساب للتأكيد مع هير خالد...', 'success');

    // Pre-filled WhatsApp link with clear Level Activation Request
    const waText = encodeURIComponent(`مرحباً هير خالد (أكاديمية دويتشه فيلت) 👋\n\nأود تأكيد حجز الكورس وتفعيل مستواي الأونلاين:\n📌 *الكورس المطلوب:* ${course}\n👤 *الاسم بالكامل:* ${name}\n📱 *رقم الهاتف:* ${phone}\n💳 *طريقة الدفع المختارة:* ${payment}\n📝 *الملاحظات:* ${notes}\n\nيرجى تفعيل المستوى وإضافتي لجروب الواتساب الخاص بي وتزويدي برابط محاضرات Zoom المباشرة. شكراً جزيلاً! 🇩🇪`);
    const waUrl = `https://wa.me/2010552287454?text=${waText}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1200);

    form.reset();
  }

  // Book Store & Order Modal
  openBookOrderModal(bookId, bookTitle, bookPrice) {
    const modal = document.getElementById('bookOrderModal');
    const titleEl = document.getElementById('bookOrderTitle');
    const bookIdEl = document.getElementById('bookOrderId');
    const bookNameEl = document.getElementById('bookOrderName');
    const priceEl = document.getElementById('bookOrderPrice');

    if (modal && titleEl) {
      titleEl.innerText = bookTitle;
      if (bookIdEl) bookIdEl.value = bookId;
      if (bookNameEl) bookNameEl.value = bookTitle;
      if (priceEl) priceEl.value = bookPrice;
      modal.classList.add('active');
    }
  }

  closeBookOrderModal() {
    const modal = document.getElementById('bookOrderModal');
    if (modal) modal.classList.remove('active');
  }

  async handleBookOrderSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.buyerName.value.trim();
    const phone = form.buyerPhone.value.trim();
    const address = form.buyerAddress.value.trim();
    const bookName = form.bookName.value;
    const quantity = parseInt(form.bookQuantity.value || 1, 10);
    const totalPrice = 500 * quantity;

    const order = {
      id: 'BORD-' + Date.now(),
      name,
      buyer_name: name,
      phone,
      address,
      bookName,
      book_name: bookName,
      quantity,
      total: totalPrice,
      total_price: totalPrice,
      date: new Date().toLocaleString('ar-EG'),
      status: 'pending'
    };

    // 1. Save to LocalStorage cache
    const savedOrders = JSON.parse(localStorage.getItem('dw_book_orders') || '[]');
    savedOrders.unshift(order);
    localStorage.setItem('dw_book_orders', JSON.stringify(savedOrders));

    // 2. Post to Live Backend Database
    if (window.DW_API) {
      try {
        await window.DW_API.client.request('/api/orders/', {
          method: 'POST',
          body: JSON.stringify({
            buyer_name: name,
            phone: phone,
            address: address,
            book_name: bookName,
            quantity: quantity,
            total_price: totalPrice
          })
        });
      } catch (apiErr) {
        console.warn('Backend sync failed for book order, saved locally:', apiErr.message);
      }
    }

    this.closeBookOrderModal();
    this.showToast('📚 تم تسجيل طلب الكتاب بنجاح في قاعدة البيانات! جاري تحويلك للواتساب للتأكيد...', 'success');

    const waText = encodeURIComponent(`مرحباً إدارة دويتشه فيلت 👋\nأريد تأكيد طلب شراء: *${bookName}* (الكمية: ${quantity})\nالاسم: ${name}\nالهاتف: ${phone}\nالعنوان للتوصيل: ${address}\nالمبلغ الإجمالي: ${order.total} جنيه.`);
    const waUrl = `https://wa.me/2010552287454?text=${waText}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1500);

    form.reset();
  }

  // Book Sample Preview Modal (Multi-Page Interactive Viewer like the App)
  openBookPreviewModal(level) {
    const book = this.books.find(b => b.level.toUpperCase() === level.toUpperCase());
    if (!book) return;

    this.currentPreviewBook = book;
    this.currentPreviewPageIndex = 0;

    const modal = document.getElementById('bookPreviewModal');
    const titleEl = document.getElementById('bookPreviewTitle');

    if (modal && titleEl) {
      titleEl.innerHTML = `<span>معاينة عينة من كتاب (${book.level}) 📖</span> <span style="font-size:0.8rem; color:#d97706; display:block; font-weight:700;">${book.subtitle}</span>`;
      this.renderBookPreviewPage();
      modal.classList.add('active');
    }
  }

  renderBookPreviewPage() {
    const contentEl = document.getElementById('bookPreviewBody');
    if (!contentEl || !this.currentPreviewBook) return;

    const pages = this.currentPreviewBook.previewPages;
    const page = pages[this.currentPreviewPageIndex];

    contentEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background:var(--bg-card-muted); padding:10px 16px; border-radius:6px; border:1px solid var(--border-subtle);">
        <span style="font-weight:800; color:var(--text-main); font-size:0.92rem;">${page.title}</span>
        <span style="font-size:0.8rem; color:var(--text-subtle); font-weight:700;">صفحة ${this.currentPreviewPageIndex + 1} من ${pages.length}</span>
      </div>

      <!-- Page Indicator Dots -->
      <div style="display:flex; justify-content:center; gap:6px; margin-bottom:18px;">
        ${pages.map((_, idx) => `
          <button onclick="window.dwApp.switchBookPreviewPage(${idx})" style="width:${idx === this.currentPreviewPageIndex ? '28px' : '9px'}; height:8px; border-radius:4px; border:none; background:${idx === this.currentPreviewPageIndex ? '#0284c7' : '#cbd5e1'}; cursor:pointer; transition:all 0.2s ease;"></button>
        `).join('')}
      </div>

      <div style="background:var(--bg-surface); border:1px solid var(--border-strong); border-radius:8px; padding:20px; max-height:380px; overflow-y:auto; margin-bottom:18px; text-align:right;">
        <div style="line-height:1.9; font-size:0.92rem; color:var(--text-main);">
          ${page.content.map(line => `<div style="margin-bottom:4px; ${line.startsWith('📖') ? 'font-weight:800; color:#0284c7; margin-top:10px;' : ''}">${line}</div>`).join('')}
        </div>
      </div>

      <!-- Highlight Box -->
      <div style="background:var(--brand-gold-subtle); border:1px solid var(--brand-gold-border); padding:12px 16px; border-radius:6px; margin-bottom:20px; display:flex; align-items:center; gap:8px;">
        <i class="fas fa-star" style="color:#d97706;"></i>
        <span style="font-size:0.85rem; font-weight:800; color:#92400e;">${page.highlight}</span>
      </div>

      <!-- Navigation & Action -->
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
        <div style="display:flex; gap:8px;">
          <button class="btn btn-glass btn-sm" onclick="window.dwApp.prevBookPreviewPage()" ${this.currentPreviewPageIndex === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            <i class="fas fa-arrow-right"></i> الصفحة السابقة
          </button>
          <button class="btn btn-glass btn-sm" onclick="window.dwApp.nextBookPreviewPage()" ${this.currentPreviewPageIndex === pages.length - 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            الصفحة التالية <i class="fas fa-arrow-left"></i>
          </button>
        </div>

        <button class="btn btn-gold btn-sm" onclick="window.dwApp.closeBookPreviewModal(); window.dwApp.openBookOrderModal('${this.currentPreviewBook.id}', '${this.currentPreviewBook.title}', ${this.currentPreviewBook.price})">
          <i class="fas fa-shopping-cart"></i> اطلب النسخة الكاملة (500 جنيه)
        </button>
      </div>
    `;
  }

  switchBookPreviewPage(index) {
    this.currentPreviewPageIndex = index;
    this.renderBookPreviewPage();
  }

  nextBookPreviewPage() {
    if (this.currentPreviewBook && this.currentPreviewPageIndex < this.currentPreviewBook.previewPages.length - 1) {
      this.currentPreviewPageIndex++;
      this.renderBookPreviewPage();
    }
  }

  prevBookPreviewPage() {
    if (this.currentPreviewBook && this.currentPreviewPageIndex > 0) {
      this.currentPreviewPageIndex--;
      this.renderBookPreviewPage();
    }
  }

  closeBookPreviewModal() {
    const modal = document.getElementById('bookPreviewModal');
    if (modal) modal.classList.remove('active');
  }

  speakGerman(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
      this.showToast(`🔊 جاري نطق: "${text}"`, 'info');
    } else {
      this.showToast('متصفحك لا يدعم خاصية نطق الصوت.', 'error');
    }
  }

  // Interactive German Placement Quiz Engine
  startQuiz() {
    this.quizIndex = 0;
    this.quizAnswers = [];
    document.getElementById('quizStartView').style.display = 'none';
    document.getElementById('quizActiveView').style.display = 'block';
    document.getElementById('quizResultView').style.display = 'none';
    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    const q = QUIZ_QUESTIONS[this.quizIndex];
    if (!q) return;

    document.getElementById('quizQuestionNumber').innerText = `السؤال ${this.quizIndex + 1} من ${QUIZ_QUESTIONS.length}`;
    document.getElementById('quizQuestionText').innerText = q.q;

    const progressPercent = ((this.quizIndex + 1) / QUIZ_QUESTIONS.length) * 100;
    document.getElementById('quizProgressFill').style.width = `${progressPercent}%`;

    const optionsContainer = document.getElementById('quizOptionsList');
    optionsContainer.innerHTML = q.options.map((opt, idx) => `
      <button class="quiz-option-btn" onclick="window.dwApp.selectQuizOption(${idx})">
        <span><strong>${['أ', 'ب', 'ج', 'د'][idx]})</strong> ${opt}</span>
        <i class="far fa-circle"></i>
      </button>
    `).join('');
  }

  selectQuizOption(selectedIndex) {
    const q = QUIZ_QUESTIONS[this.quizIndex];
    const isCorrect = (selectedIndex === q.correct);
    this.quizAnswers.push({
      question: q.q,
      level: q.level,
      isCorrect
    });

    this.quizIndex++;
    if (this.quizIndex < QUIZ_QUESTIONS.length) {
      this.renderQuizQuestion();
    } else {
      this.showQuizResults();
    }
  }

  showQuizResults() {
    document.getElementById('quizActiveView').style.display = 'none';
    const resultView = document.getElementById('quizResultView');
    resultView.style.display = 'block';

    const correctCount = this.quizAnswers.filter(a => a.isCorrect).length;
    const percent = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

    document.getElementById('quizScoreNumber').innerText = `${percent}%`;

    let recommendedLevel = 'A1';
    let recommendationTitle = 'المستوى الموصى به: كورس A1 التأسيسي المكثف';
    let recommendationDesc = 'مستواك مثالي للبدء من الصفر لبناء أساس لغوي متين وسليم مع هير خالد وتجنب أي أخطاء شائعة في النطق والقواعد.';

    if (percent >= 80) {
      recommendedLevel = 'B2';
      recommendationTitle = 'المستوى الموصى به: كورس B2 المتقدم وسوق العمل';
      recommendationDesc = 'ما شاء الله! مستواك قوي جداً في القواعد والمفردات، وننصحك بالالتحاق بكورس B2 أو كورس الـ Upskilling للتأهيل المباشر للعمل في كبرى الشركات الألمانية!';
    } else if (percent >= 60) {
      recommendedLevel = 'B1';
      recommendationTitle = 'المستوى الموصى به: كورس B1 الذهبي';
      recommendationDesc = 'أنت تملك قاعدة جيدة جداً، حان الوقت للانتقال لمستوى المحادثات المركبة والتحضير للشهادات الدولية وسوق العمل.';
    } else if (percent >= 35) {
      recommendedLevel = 'A2';
      recommendationTitle = 'المستوى الموصى به: كورس A2 المتوسط';
      recommendationDesc = 'لديك معرفة بأساسيات اللغة الألمانية، كورس A2 سينقلك إلى التعبير بطلاقة عن الماضي والمستقبل والمواقف الحياتية.';
    }

    document.getElementById('quizRecBadge').innerText = recommendationTitle;
    document.getElementById('quizRecDesc').innerText = recommendationDesc;
  }

  // Reviews Swiper Carousel & Lightbox System
  initReviewGallery() {
    this.totalReviews = 74;
    this.currentLightboxIndex = 1;
    this.swiperCurrentIndex = 0;
    this.swiperIsDragging = false;
    this.swiperStartX = 0;
    this.swiperCurrentTranslate = 0;
    this.swiperPrevTranslate = 0;
    this.swiperAnimationId = null;

    this.renderReviewSwiper();
    this.setupSwiperControls();
    this.setupSwiperAutoplay();
    this.setupSwiperDrag();

    // Lightbox keyboard navigation
    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('reviewLightboxModal');
      if (modal && modal.classList.contains('active')) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') this.nextLightboxImage();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') this.prevLightboxImage();
        if (e.key === 'Escape') this.closeLightbox();
      }
    });

    // Resize handler to recalculate swiper bounds
    window.addEventListener('resize', () => {
      this.updateSwiperPosition();
    });
  }

  getVisibleSlidesCount() {
    const width = window.innerWidth;
    if (width > 1024) return 4;
    if (width > 768) return 3;
    if (width > 480) return 2;
    return 1;
  }

  renderReviewSwiper() {
    const track = document.getElementById('reviewSwiperTrack');
    if (!track) return;

    let html = '';
    for (let i = 1; i <= this.totalReviews; i++) {
      html += `
        <div class="reviews-swiper-slide">
          <div class="review-img-card" onclick="window.dwApp.openLightbox(${i})" title="انقر لتكبير المحادثة كاملة">
            <img src="assets/reviews/review_${i}.jpg" alt="رأي ومحادثة طالب رقم ${i} - هير خالد" loading="lazy">
            <div class="review-img-card-overlay">
              <span><i class="fab fa-whatsapp" style="color:#25D366;"></i> رأي #${i}</span>
              <span><i class="fas fa-search-plus"></i> تكبير</span>
            </div>
          </div>
        </div>
      `;
    }
    track.innerHTML = html;
    this.updateSwiperPosition();
  }

  setupSwiperControls() {
    const prevBtn = document.getElementById('reviewSwiperPrev');
    const nextBtn = document.getElementById('reviewSwiperNext');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.prevSwiperSlide();
        this.resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextSwiperSlide();
        this.resetAutoplay();
      });
    }
  }

  nextSwiperSlide() {
    const visible = this.getVisibleSlidesCount();
    const maxIndex = this.totalReviews - visible;
    if (this.swiperCurrentIndex < maxIndex) {
      this.swiperCurrentIndex = Math.min(this.swiperCurrentIndex + visible, maxIndex);
    } else {
      this.swiperCurrentIndex = 0; // Loop back to start
    }
    this.updateSwiperPosition();
  }

  prevSwiperSlide() {
    const visible = this.getVisibleSlidesCount();
    const maxIndex = this.totalReviews - visible;
    if (this.swiperCurrentIndex > 0) {
      this.swiperCurrentIndex = Math.max(this.swiperCurrentIndex - visible, 0);
    } else {
      this.swiperCurrentIndex = maxIndex; // Loop to end
    }
    this.updateSwiperPosition();
  }

  updateSwiperPosition() {
    const track = document.getElementById('reviewSwiperTrack');
    const wrapper = document.getElementById('reviewSwiperWrapper');
    const counter = document.getElementById('reviewSwiperCounter');
    const progressBar = document.getElementById('reviewSwiperProgressBar');
    if (!track || !wrapper) return;

    const visible = this.getVisibleSlidesCount();
    const slides = track.querySelectorAll('.reviews-swiper-slide');
    if (slides.length === 0) return;

    // Slide width including gap
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 18;
    const step = slideWidth + gap;

    // Calculate RTL translation (in Arabic RTL, sliding forward moves track in positive X direction or standard scroll)
    const translateVal = (this.swiperCurrentIndex * step);
    track.style.transform = `translateX(${translateVal}px)`;

    // Update Counter
    if (counter) {
      const startNum = this.swiperCurrentIndex + 1;
      const endNum = Math.min(this.swiperCurrentIndex + visible, this.totalReviews);
      counter.innerText = `${startNum} - ${endNum} من ${this.totalReviews}`;
    }

    // Update Progress Bar
    if (progressBar) {
      const pct = Math.min(100, Math.round(((this.swiperCurrentIndex + visible) / this.totalReviews) * 100));
      progressBar.style.width = `${pct}%`;
    }
  }

  setupSwiperAutoplay() {
    this.swiperAutoplayInterval = setInterval(() => {
      if (!this.swiperIsHovered && !this.swiperIsDragging) {
        this.nextSwiperSlide();
      }
    }, 4500);

    const section = document.querySelector('.reviews-swiper-section');
    if (section) {
      section.addEventListener('mouseenter', () => { this.swiperIsHovered = true; });
      section.addEventListener('mouseleave', () => { this.swiperIsHovered = false; });
    }
  }

  resetAutoplay() {
    clearInterval(this.swiperAutoplayInterval);
    this.setupSwiperAutoplay();
  }

  setupSwiperDrag() {
    const wrapper = document.getElementById('reviewSwiperWrapper');
    if (!wrapper) return;

    let startX = 0;
    let currentX = 0;
    let isDown = false;

    const handleStart = (clientX) => {
      isDown = true;
      this.swiperIsDragging = true;
      startX = clientX;
    };

    const handleMove = (clientX) => {
      if (!isDown) return;
      currentX = clientX;
    };

    const handleEnd = () => {
      if (!isDown) return;
      isDown = false;
      this.swiperIsDragging = false;
      const diff = currentX - startX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          // Drag right (in RTL next)
          this.nextSwiperSlide();
        } else {
          // Drag left (in RTL prev)
          this.prevSwiperSlide();
        }
        this.resetAutoplay();
      }
    };

    wrapper.addEventListener('mousedown', (e) => handleStart(e.clientX));
    window.addEventListener('mousemove', (e) => handleMove(e.clientX));
    window.addEventListener('mouseup', () => handleEnd());

    wrapper.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX), { passive: true });
    wrapper.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientX), { passive: true });
    wrapper.addEventListener('touchend', () => handleEnd());
  }

  openLightbox(index) {
    this.currentLightboxIndex = index;
    const modal = document.getElementById('reviewLightboxModal');
    const img = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');

    if (modal && img) {
      img.src = `assets/reviews/review_${index}.jpg`;
      if (counter) counter.innerText = `${index} / ${this.totalReviews}`;
      modal.classList.add('active');
    }
  }

  closeLightbox() {
    const modal = document.getElementById('reviewLightboxModal');
    if (modal) modal.classList.remove('active');
  }

  nextLightboxImage() {
    this.currentLightboxIndex = (this.currentLightboxIndex % this.totalReviews) + 1;
    this.updateLightboxSource();
  }

  prevLightboxImage() {
    this.currentLightboxIndex = this.currentLightboxIndex === 1 ? this.totalReviews : this.currentLightboxIndex - 1;
    this.updateLightboxSource();
  }

  updateLightboxSource() {
    const img = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    if (img) {
      img.src = `assets/reviews/review_${this.currentLightboxIndex}.jpg`;
      if (counter) counter.innerText = `${this.currentLightboxIndex} / ${this.totalReviews}`;
    }
  }

  // Interactive Luxury Toast Notification System
  playToastChime(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.setValueAtTime(164.81, now + 0.12); // E3
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Audio not supported or blocked by autoplay policy
    }
  }

  showToast(message, type = 'info', customTitle = null) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const titles = {
      success: 'تمت العملية بنجاح! 🇩🇪',
      error: 'تنبيه أو خطأ ⚠️',
      warning: 'ملاحظة هامة 🔔',
      info: 'إشعار الأكاديمية ℹ️'
    };

    const icons = {
      success: 'fa-check',
      error: 'fa-exclamation',
      warning: 'fa-bell',
      info: 'fa-info'
    };

    const title = customTitle || titles[type] || titles.info;
    const icon = icons[type] || icons.info;

    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    toast.innerHTML = `
      <div class="toast-icon-wrap">
        <i class="fas ${icon}"></i>
      </div>
      <div class="toast-content-wrap">
        <div class="toast-title-text">${title}</div>
        <div class="toast-desc-text">${message}</div>
      </div>
      <button type="button" class="toast-close-btn" title="إغلاق">
        <i class="fas fa-times"></i>
      </button>
      <div class="toast-progress-bar">
        <div class="toast-progress-fill"></div>
      </div>
    `;

    container.appendChild(toast);
    this.playToastChime(type);

    let isDismissed = false;
    const dismiss = () => {
      if (isDismissed) return;
      isDismissed = true;
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 350);
    };

    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismiss();
      });
    }

    toast.addEventListener('click', dismiss);

    // Auto dismiss after 4.2 seconds
    let timer = setTimeout(dismiss, 4200);

    toast.addEventListener('mouseenter', () => clearTimeout(timer));
    toast.addEventListener('mouseleave', () => {
      if (!isDismissed) {
        timer = setTimeout(dismiss, 2000);
      }
    });
  }
  // =========================================================================
  // EXECUTIVE CV DOSSIER MODAL SYSTEM (هير خالد)
  // =========================================================================
  openCvModal(tabId = 'overview') {
    const modal = document.getElementById('herrKhaledCvModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    // Force reflow for smooth animation
    void modal.offsetWidth;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    this.switchCvTab(tabId);
    this.playToastChime('success');

    // Setup Escape & Outside Click Listeners
    if (!this._cvListenersBound) {
      this._cvListenersBound = true;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeCvModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          this.closeCvModal();
        }
      });
    }
  }

  closeCvModal() {
    const modal = document.getElementById('herrKhaledCvModal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 280);
  }

  switchCvTab(tabId) {
    const tabButtons = document.querySelectorAll('.cv-tab-btn');
    const tabPanes = document.querySelectorAll('.cv-tab-pane');

    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cvtab') === tabId);
    });

    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `cvTab-${tabId}`);
    });
  }

  copyCvLink() {
    const shareUrl = window.location.origin + window.location.pathname + '#about-teacher';
    navigator.clipboard.writeText(shareUrl).then(() => {
      this.showToast('تم نسخ رابط السيرة الذاتية لهير خالد بنجاح! 📋✨', 'success');
    }).catch(() => {
      this.showToast('رابط السيرة الذاتية: ' + shareUrl, 'info');
    });
  }

  printCv() {
    this.showToast('جاري تجهيز السيرة الذاتية للطباعة / التصدير كـ PDF 📄...', 'info');
    setTimeout(() => {
      window.print();
    }, 300);
  }

  // =========================================================================
  // BACKEND API SUITE INTEGRATION (AUTH, PROFILE, PLAYER, COMMENTS & BOOKS)
  // =========================================================================

  initBackendIntegration() {
    // 1. Listen for Auth State Changes
    if (window.DW_API) {
      window.DW_API.client.onAuthStateChanged((user, isAuth) => {
        this.updateAuthHeaderUI();
        this.fetchBackendLevels();
      });

      // Initial Auth Header Sync
      this.updateAuthHeaderUI();

      // Initial Backend Levels & Books Sync
      this.fetchBackendLevels();
      this.fetchBackendBooks();
    }

    // 2. Character counter for comment textarea
    const commentTxt = document.getElementById('newCommentTextarea');
    const charCounter = document.getElementById('commentCharCount');
    if (commentTxt && charCounter) {
      commentTxt.addEventListener('input', () => {
        charCounter.textContent = `${commentTxt.value.length} / 2000`;
      });
    }

    // 3. Close user dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('userDropdownMenu');
      const pill = document.getElementById('userProfilePill');
      if (dropdown && dropdown.classList.contains('show')) {
        if (!dropdown.contains(e.target) && (!pill || !pill.contains(e.target))) {
          dropdown.classList.remove('show');
        }
      }
    });
  }

  // Header User Authentication UI
  updateAuthHeaderUI() {
    const container = document.getElementById('userHeaderAuth');
    if (!container || !window.DW_API) return;

    const user = window.DW_API.client.getUser();
    const isAuth = window.DW_API.client.isAuthenticated();

    if (isAuth && user) {
      const initial = (user.first_name || 'ط').charAt(0).toUpperCase();
      const isAdmin = window.DW_API.client.isAdmin();
      const roleText = isAdmin ? 'مشرف 👑' : 'طالب 🎓';

      container.innerHTML = `
        <div class="user-profile-pill" id="userProfilePill" onclick="window.dwApp.toggleUserDropdown()">
          <div class="user-pill-avatar">${initial}</div>
          <span class="user-pill-name">${user.first_name || 'طالب'}</span>
          <span style="font-size:0.75rem; color:#d97706;">(${roleText})</span>
          <i class="fas fa-chevron-down" style="font-size:0.75rem; margin-right:4px;"></i>
        </div>

        <div class="user-dropdown-menu" id="userDropdownMenu">
          <div class="user-dropdown-header">
            <strong>${user.first_name} ${user.last_name || ''}</strong>
            <small>${user.email}</small>
          </div>
          <button type="button" class="user-dropdown-item" onclick="window.dwApp.openProfileModal()">
            <i class="fas fa-id-card"></i> <span>الملف الشخصي والبيانات</span>
          </button>
          <a href="#online-courses" class="user-dropdown-item" onclick="document.getElementById('userDropdownMenu').classList.remove('show')">
            <i class="fas fa-graduation-cap"></i> <span>محاضراتي المفعلة</span>
          </a>
          ${isAdmin ? `
            <button type="button" class="user-dropdown-item" style="color:#f59e0b;" onclick="window.dwAdmin.openAdminPortal(); document.getElementById('userDropdownMenu').classList.remove('show')">
              <i class="fas fa-user-shield"></i> <span>لوحة المشرف (Admin)</span>
            </button>
          ` : ''}
          <button type="button" class="user-dropdown-item danger" onclick="window.dwApp.logoutStudent()">
            <i class="fas fa-sign-out-alt"></i> <span>تسجيل الخروج</span>
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button type="button" class="btn btn-auth-pill" id="headerAuthBtn" onclick="window.dwApp.openAuthModal('login')">
          <i class="fas fa-user-circle"></i>
          <span>تسجيل الدخول</span>
        </button>
      `;
    }
  }

  toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  // Student Auth Modal Handlers
  openAuthModal(tab = 'login') {
    const modal = document.getElementById('studentAuthModal');
    if (!modal) return;
    this.clearAuthAlert();
    this.switchAuthTab(tab);
    modal.classList.add('active');
  }

  closeAuthModal() {
    const modal = document.getElementById('studentAuthModal');
    if (modal) modal.classList.remove('active');
    this.clearAuthAlert();
  }

  switchAuthTab(tab) {
    const tabs = ['login', 'register', 'forgot'];
    tabs.forEach(t => {
      const btn = document.getElementById(`tabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
      const pane = document.getElementById(`authPane${t.charAt(0).toUpperCase() + t.slice(1)}`);
      if (btn) btn.classList.toggle('active', t === tab);
      if (pane) {
        pane.classList.toggle('active', t === tab);
        pane.style.display = t === tab ? 'block' : 'none';
      }
    });

    const titleEl = document.getElementById('authModalTitle');
    const subEl = document.getElementById('authModalSubtitle');
    if (tab === 'login') {
      if (titleEl) titleEl.textContent = 'تسجيل دخول الطلاب';
      if (subEl) subEl.textContent = 'أدخل بريدك الإلكتروني وكلمة المرور لمتابعة المحاضرات والدروس';
    } else if (tab === 'register') {
      if (titleEl) titleEl.textContent = 'إنشاء حساب طالب جديد';
      if (subEl) subEl.textContent = 'انضم لأكاديمية دويتشه فيلت وابدأ رحلة تعلم اللغة الألمانية';
    } else {
      if (titleEl) titleEl.textContent = 'استعادة كلمة المرور عبر الـ OTP';
      if (subEl) subEl.textContent = 'سنرسل لك رمز تحقق سريع على بريدك المسجل لإعادة ضبط المرور';
      const step1 = document.getElementById('forgotStep1');
      const step2 = document.getElementById('forgotStep2');
      if (step1) step1.style.display = 'block';
      if (step2) step2.style.display = 'none';
    }
  }

  showAuthAlert(message, type = 'error') {
    const el = document.getElementById('studentAuthAlert');
    if (!el) return;
    el.className = `auth-alert-banner ${type}`;
    el.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i> <span>${message}</span>`;
    el.style.display = 'flex';
  }

  clearAuthAlert() {
    const el = document.getElementById('studentAuthAlert');
    if (el) el.style.display = 'none';
  }

  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input || !btn) return;
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      if (icon) icon.className = 'fas fa-eye-slash';
    } else {
      input.type = 'password';
      if (icon) icon.className = 'fas fa-eye';
    }
  }

  async handleStudentLogin(e) {
    if (e) e.preventDefault();
    this.clearAuthAlert();

    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    const btn = document.getElementById('loginSubmitBtn');

    if (!email || !password) {
      this.showAuthAlert('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
    }

    try {
      const res = await window.DW_API.auth.login(email, password);
      this.showToast(`أهلاً بك يا ${res.user.first_name} في منصة دويتشه فيلت! 🎉`, 'success');
      this.closeAuthModal();
      this.updateAuthHeaderUI();
      this.fetchBackendLevels();
    } catch (err) {
      this.showAuthAlert(err.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-arrow-left"></i> تسجيل الدخول للمنصة';
      }
    }
  }

  async handleStudentRegister(e) {
    if (e) e.preventDefault();
    this.clearAuthAlert();

    const firstName = document.getElementById('regFirstName')?.value.trim();
    const lastName = document.getElementById('regLastName')?.value.trim();
    const phoneNumber = document.getElementById('regPhone')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const password = document.getElementById('regPassword')?.value;
    const btn = document.getElementById('regSubmitBtn');

    if (phoneNumber.length !== 11) {
      this.showAuthAlert('رقم الهاتف يجب أن يتكون من 11 رقماً بالضبط (مثال: 01012345678).');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
    }

    try {
      await window.DW_API.auth.register({
        email,
        password,
        firstName,
        lastName,
        phoneNumber
      });

      // Auto login after registration
      await window.DW_API.auth.login(email, password);
      this.showToast(`تم إنشاء حسابك بنجاح! أهلاً بك يا ${firstName} 🌟`, 'success');
      this.closeAuthModal();
      this.updateAuthHeaderUI();
      this.fetchBackendLevels();
    } catch (err) {
      this.showAuthAlert(err.message || 'تعذر إنشاء الحساب. يرجى مراجعة البيانات.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-user-plus"></i> إنشاء حساب جديد وتفعيل الدخول';
      }
    }
  }

  async handleForgotSendOtp(e) {
    if (e) e.preventDefault();
    this.clearAuthAlert();

    const email = document.getElementById('forgotEmail')?.value.trim();
    const btn = document.getElementById('forgotOtpBtn');

    if (!email) {
      this.showAuthAlert('يرجى إدخال البريد الإلكتروني.');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إرسال الرمز...';
    }

    try {
      await window.DW_API.auth.forgotPassword(email);
      document.getElementById('forgotStep1').style.display = 'none';
      document.getElementById('forgotStep2').style.display = 'block';
      this.showToast('تم إرسال رمز التحقق (OTP) إلى بريدك الإلكتروني بنجاح! 📨', 'info');
    } catch (err) {
      this.showAuthAlert(err.message || 'تعذر إرسال الرمز، تأكد من صحة البريد الإلكتروني.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال رمز التحقق OTP';
      }
    }
  }

  async handleResetPasswordSubmit(e) {
    if (e) e.preventDefault();
    this.clearAuthAlert();

    const email = document.getElementById('forgotEmail')?.value.trim();
    const otp = document.getElementById('resetOtp')?.value.trim();
    const newPassword = document.getElementById('resetNewPassword')?.value;
    const btn = document.getElementById('resetSubmitBtn');

    if (!otp || otp.length !== 6 || !newPassword) {
      this.showAuthAlert('يرجى إدخال كود التحقق المكون من 6 أرقام وكلمة المرور الجديدة.');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تحديث كلمة المرور...';
    }

    try {
      await window.DW_API.auth.resetPassword(email, otp, newPassword);
      this.showToast('تمت استعادة كلمة المرور بنجاح! تم تسجيل الدخول الآن 🔑', 'success');
      await window.DW_API.auth.login(email, newPassword);
      this.closeAuthModal();
      this.updateAuthHeaderUI();
    } catch (err) {
      this.showAuthAlert(err.message || 'كود التحقق غير صحيح أو انتهت صلاحيته (10 دقائق).');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check-circle"></i> تعيين كلمة المرور وتسجيل الدخول';
      }
    }
  }

  async logoutStudent() {
    if (window.DW_API) {
      await window.DW_API.auth.logout();
    }
    this.closeProfileModal();
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) dropdown.classList.remove('show');
    this.showToast('تم تسجيل الخروج من المنصة بنجاح 👋', 'info');
    this.updateAuthHeaderUI();
    this.fetchBackendLevels();
  }

  // Student Profile Modal
  openProfileModal() {
    const modal = document.getElementById('studentProfileModal');
    if (!modal || !window.DW_API) return;
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) dropdown.classList.remove('show');

    const user = window.DW_API.client.getUser();
    if (!user) {
      this.openAuthModal('login');
      return;
    }

    const nameEl = document.getElementById('profileModalName');
    const emailEl = document.getElementById('profileModalEmail');
    const avatarEl = document.getElementById('profileModalAvatar');
    const roleEl = document.getElementById('profileModalRoleBadge');

    if (nameEl) nameEl.textContent = `${user.first_name} ${user.last_name || ''}`;
    if (emailEl) emailEl.textContent = user.email;
    if (avatarEl) avatarEl.textContent = (user.first_name || 'D').charAt(0).toUpperCase();
    if (roleEl) roleEl.textContent = user.is_staff ? 'مشرف الأكاديمية 👑' : 'طالب معتمد ✅';

    const fnInput = document.getElementById('profFirstName');
    const lnInput = document.getElementById('profLastName');
    const phInput = document.getElementById('profPhone');

    if (fnInput) fnInput.value = user.first_name || '';
    if (lnInput) lnInput.value = user.last_name || '';
    if (phInput) phInput.value = user.phone_number || '';

    this.switchProfileTab('info');
    modal.classList.add('active');
  }

  closeProfileModal() {
    const modal = document.getElementById('studentProfileModal');
    if (modal) modal.classList.remove('active');
  }

  switchProfileTab(tab) {
    const tabs = ['info', 'courses', 'security'];
    tabs.forEach(t => {
      const pane = document.getElementById(`profilePane${t.charAt(0).toUpperCase() + t.slice(1)}`);
      if (pane) pane.style.display = t === tab ? 'block' : 'none';
    });

    const btns = document.querySelectorAll('.profile-tab-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('onclick')?.includes(tab));
    });

    if (tab === 'courses') {
      this.renderProfileCoursesList();
    }
  }

  renderProfileCoursesList() {
    const list = document.getElementById('profileCoursesList');
    if (!list) return;

    const levels = this.backendLevels || [];
    const unlocked = levels.filter(l => l.has_access || (window.DW_API && window.DW_API.client.isAdmin()));

    if (!unlocked.length) {
      list.innerHTML = `
        <div style="text-align:center; padding:24px; color:#94a3b8;">
          <i class="fas fa-lock" style="font-size:2rem; margin-bottom:8px; color:#d97706;"></i>
          <p>لا توجد كورسات مفعلة بحسابك حتى الآن.</p>
          <a href="#online-courses" class="btn btn-primary btn-sm" onclick="window.dwApp.closeProfileModal()">تصفح الكورسات المتاحة واشترك الآن</a>
        </div>
      `;
      return;
    }

    list.innerHTML = unlocked.map(lvl => `
      <div class="profile-course-card">
        <div>
          <strong style="color:#f8fafc; font-size:0.95rem;">${lvl.name} - ${lvl.title}</strong>
          <span style="display:block; font-size:0.8rem; color:#10b981;"><i class="fas fa-check-circle"></i> مفعّل ومتاح للمشاهدة 24/7</span>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="window.dwApp.closeProfileModal(); window.dwApp.openCoursePlayer(${lvl.id}, '${lvl.name} - ${lvl.title}')">
          <i class="fas fa-play"></i> فتح الدروس
        </button>
      </div>
    `).join('');
  }

  async handleProfileUpdate(e) {
    if (e) e.preventDefault();
    const firstName = document.getElementById('profFirstName')?.value.trim();
    const lastName = document.getElementById('profLastName')?.value.trim();
    const phoneNumber = document.getElementById('profPhone')?.value.trim();

    try {
      await window.DW_API.profile.update({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber
      });
      this.showToast('تم تحديث بيانات ملفك الشخصي بنجاح! ✅', 'success');
      this.updateAuthHeaderUI();
    } catch (err) {
      this.showToast(err.message || 'تعذر تحديث البيانات.', 'error');
    }
  }

  async handleChangePassword(e) {
    if (e) e.preventDefault();
    const oldPassword = document.getElementById('changeOldPassword')?.value;
    const newPassword = document.getElementById('changeNewPassword')?.value;

    try {
      await window.DW_API.profile.changePassword(oldPassword, newPassword);
      this.showToast('تم تغيير كلمة المرور بنجاح! 🔒', 'success');
      document.getElementById('changeOldPassword').value = '';
      document.getElementById('changeNewPassword').value = '';
    } catch (err) {
      this.showToast(err.message || 'فشل تغيير كلمة المرور.', 'error');
    }
  }

  // =========================================================================
  // COURSES & LEVELS BACKEND SYNC
  // =========================================================================
  async fetchBackendLevels() {
    if (!window.DW_API) return;
    try {
      const levels = await window.DW_API.courses.getLevels();
      this.backendLevels = levels;
      this.applyBackendLevelsToDOM(levels);
    } catch (err) {
      console.warn('Could not fetch levels from backend:', err.message);
    }
  }

  applyBackendLevelsToDOM(levels) {
    if (!Array.isArray(levels)) return;
    const isAdmin = window.DW_API.client.isAdmin();

    levels.forEach(lvl => {
      const levelCode = (lvl.name || '').toLowerCase();
      const card = document.querySelector(`.level-group-card[data-level="${levelCode}"]`);
      if (!card) return;

      const hasAccess = lvl.has_access || isAdmin;
      const footer = card.querySelector('.level-card-footer');
      const statusPill = card.querySelector('.level-status-pill');

      // Update status pill badge
      if (statusPill) {
        if (hasAccess) {
          statusPill.innerHTML = '<span class="pulse-mini" style="background:#10b981;"></span> مفعل بحسابك ✅';
          statusPill.style.color = '#10b981';
          statusPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        } else {
          statusPill.innerHTML = '<span class="pulse-mini"></span> متاح التسجيل والاشتراك';
        }
      }

      // If user has access, replace footer action button with Open Lessons Player
      if (footer) {
        if (hasAccess) {
          footer.innerHTML = `
            <button type="button" class="btn-level-open-lessons" onclick="window.dwApp.openCoursePlayer(${lvl.id}, '${lvl.name} - ${lvl.title}')">
              <i class="fas fa-play-circle"></i>
              <span>مشاهدة الدروس والمحاضرات 🎬</span>
            </button>
            <a href="#books-store" class="level-book-hint">
              <i class="fas fa-book-open"></i> تصفح وتحميل كتاب المنهج (PDF)
            </a>
          `;
        }
      }
    });
  }

  // =========================================================================
  // LESSON VIDEO PLAYER & COMMENTS SYSTEM
  // =========================================================================
  async openCoursePlayer(levelId, levelTitle) {
    const modal = document.getElementById('coursePlayerModal');
    if (!modal) return;

    this.currentLevelId = levelId;
    this.currentLevelTitle = levelTitle;

    const badgeEl = document.getElementById('playerLevelBadge');
    const titleEl = document.getElementById('playerLevelTitle');
    const currentLessonEl = document.getElementById('playerCurrentLessonTitle');

    if (badgeEl) badgeEl.textContent = `Level ${levelId}`;
    if (titleEl) titleEl.textContent = levelTitle;
    if (currentLessonEl) currentLessonEl.textContent = 'جاري استدعاء الدروس والماتريال...';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    await this.loadLevelVideos(levelId);
  }

  closeCoursePlayer() {
    const modal = document.getElementById('coursePlayerModal');
    if (!modal) return;
    const iframe = document.getElementById('lessonIframePlayer');
    if (iframe) iframe.src = '';
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  async loadLevelVideos(levelId) {
    const spinner = document.getElementById('videoLoadingSpinner');
    const playlistEl = document.getElementById('playerLessonsList');
    const countBadge = document.getElementById('playlistCountBadge');
    const filesList = document.getElementById('courseFilesList');

    if (spinner) spinner.classList.add('show');

    try {
      const data = await window.DW_API.courses.getLevelVideos(levelId);
      this.currentLevelVideos = data.videos || [];
      this.currentLevelFiles = data.files || [];

      if (countBadge) countBadge.textContent = `${this.currentLevelVideos.length} محاضرات`;

      // Render Playlist
      if (playlistEl) {
        playlistEl.innerHTML = this.currentLevelVideos.map((video, idx) => {
          const duration = window.DW_API.utils.formatDuration(video.length);
          return `
            <div class="playlist-item ${idx === 0 ? 'active' : ''}" id="playlistItem-${video.id}" onclick="window.dwApp.playLesson('${video.id}')">
              <div class="playlist-item-thumb">
                <img src="${video.thumbnail_url || 'assets/images/logo.jpg'}" alt="${video.title}">
                <div class="playlist-item-play"><i class="fas fa-play"></i></div>
              </div>
              <div class="playlist-item-info">
                <div class="playlist-item-title">${idx + 1}. ${video.title}</div>
                <div class="playlist-item-duration"><i class="fas fa-clock"></i> ${duration}</div>
              </div>
            </div>
          `;
        }).join('');
      }

      // Render Course Files (PDFs)
      if (filesList) {
        if (this.currentLevelFiles.length) {
          filesList.innerHTML = this.currentLevelFiles.map(f => `
            <a href="javascript:void(0)" class="file-download-chip" onclick="window.dwApp.downloadCourseFile(${levelId}, ${f.id}, '${f.name}')">
              <i class="fas fa-file-pdf"></i>
              <span>${f.name}</span>
              <i class="fas fa-download" style="font-size:0.75rem;"></i>
            </a>
          `).join('');
        } else {
          filesList.innerHTML = '<span style="color:#64748b; font-size:0.8rem;">لا توجد ملفات إضافية مرفقة مع هذا المستوى حالياً.</span>';
        }
      }

      // Play First Lesson
      if (this.currentLevelVideos.length) {
        this.playLesson(this.currentLevelVideos[0].id);
      }
    } catch (err) {
      this.showToast(err.message || 'تعذر تحميل محاضرات هذا المستوى.', 'error');
      if (spinner) spinner.classList.remove('show');
    }
  }

  playLesson(videoId) {
    const video = (this.currentLevelVideos || []).find(v => String(v.id) === String(videoId));
    if (!video) return;

    this.currentVideoId = videoId;
    const iframe = document.getElementById('lessonIframePlayer');
    const spinner = document.getElementById('videoLoadingSpinner');
    const metaTitle = document.getElementById('videoMetaTitle');
    const metaDuration = document.getElementById('videoMetaDuration');
    const currentLessonEl = document.getElementById('playerCurrentLessonTitle');

    // Update active playlist item
    document.querySelectorAll('.playlist-item').forEach(item => {
      item.classList.toggle('active', item.id === `playlistItem-${videoId}`);
    });

    if (currentLessonEl) currentLessonEl.textContent = video.title;
    if (metaTitle) metaTitle.textContent = video.title;
    if (metaDuration) metaDuration.textContent = window.DW_API.utils.formatDuration(video.length);

    if (spinner) spinner.classList.add('show');
    if (iframe) {
      iframe.onload = () => {
        if (spinner) spinner.classList.remove('show');
      };
      // Load Signed Bunny Stream embed URL
      iframe.src = video.embed_url;
    }

    // Load Comments for this video lesson
    this.loadVideoComments(this.currentLevelId, videoId);
  }

  async loadVideoComments(levelId, videoId) {
    const container = document.getElementById('commentsFeedContainer');
    const countSpan = document.getElementById('commentsCountSpan');
    if (!container || !window.DW_API) return;

    container.innerHTML = '<div style="text-align:center; padding:20px; color:#64748b;"><i class="fas fa-spinner fa-spin"></i> جاري جلب تعليقات الدرس...</div>';

    try {
      const data = await window.DW_API.comments.list(levelId, videoId);
      const comments = data.results || [];

      if (countSpan) countSpan.textContent = data.count !== undefined ? data.count : comments.length;

      if (!comments.length) {
        container.innerHTML = `
          <div style="text-align:center; padding:24px; color:#64748b;">
            <i class="fas fa-comment-dots" style="font-size:2rem; margin-bottom:8px; color:#d97706;"></i>
            <p>لا توجد تعليقات أو أسئلة حول هذه المحاضرة بعد. كن أول من يسأل هير خالد!</p>
          </div>
        `;
        return;
      }

      container.innerHTML = comments.map(comment => this.renderCommentCard(comment)).join('');
    } catch (err) {
      container.innerHTML = `<div style="color:#ef4444; font-size:0.85rem;">تعذر جلب التعليقات: ${err.message}</div>`;
    }
  }

  renderCommentCard(comment) {
    const author = comment.user || {};
    const authorName = `${author.first_name || 'طالب'} ${author.last_name || ''}`;
    const initial = (author.first_name || 'ط').charAt(0);
    const timeAgo = window.DW_API.utils.timeAgo(comment.created_at);
    const replies = comment.replies || [];
    const isOwner = comment.is_owner;
    const isAdmin = window.DW_API.client.isAdmin();

    // 15-minute edit window check
    const diffMinutes = (Date.now() - new Date(comment.created_at).getTime()) / 60000;
    const canEdit = isOwner && diffMinutes <= 15;

    return `
      <div class="comment-card" id="comment-${comment.id}">
        <div class="comment-avatar">
          ${author.profile_photo ? `<img src="${author.profile_photo}" alt="${authorName}">` : initial}
        </div>
        <div class="comment-bubble">
          <div class="comment-meta">
            <span class="comment-author-name">${authorName}</span>
            ${isOwner ? '<span class="comment-owner-badge">أنت</span>' : ''}
            <span class="comment-time">${timeAgo}</span>
          </div>
          <p class="comment-text" id="commentText-${comment.id}">${comment.content}</p>
          <div class="comment-actions">
            <button type="button" class="comment-action-btn" onclick="window.dwApp.openReplyBox(${comment.id})">
              <i class="fas fa-reply"></i> رد (${comment.reply_count || replies.length})
            </button>
            ${canEdit ? `
              <button type="button" class="comment-action-btn" onclick="window.dwApp.handleEditComment(${comment.id})">
                <i class="fas fa-edit"></i> تعديل
              </button>
            ` : ''}
            ${(isOwner || isAdmin) ? `
              <button type="button" class="comment-action-btn delete-btn" onclick="window.dwApp.handleDeleteComment(${comment.id})">
                <i class="fas fa-trash-alt"></i> حذف
              </button>
            ` : ''}
          </div>

          <!-- Nested Replies Container -->
          <div class="replies-container" id="repliesContainer-${comment.id}">
            ${replies.map(reply => {
              const repAuthor = reply.user || {};
              const repInitial = (repAuthor.first_name || 'ط').charAt(0);
              const repTime = window.DW_API.utils.timeAgo(reply.created_at);
              return `
                <div class="comment-card" style="margin-top:6px;">
                  <div class="comment-avatar" style="width:28px; height:28px; font-size:0.75rem;">${repInitial}</div>
                  <div class="comment-bubble" style="padding:8px 10px; background:rgba(15,23,42,0.6);">
                    <div class="comment-meta">
                      <span class="comment-author-name" style="font-size:0.8rem;">${repAuthor.first_name} ${repAuthor.last_name || ''}</span>
                      <span class="comment-time">${repTime}</span>
                    </div>
                    <p class="comment-text" style="font-size:0.85rem; margin:0;">${reply.content}</p>
                  </div>
                </div>
              `;
            }).join('')}

            <!-- Reply Input (Initially hidden) -->
            <div class="reply-input-box" id="replyBox-${comment.id}" style="display:none;">
              <input type="text" id="replyInput-${comment.id}" placeholder="اكتب ردك هنا...">
              <button type="button" class="btn btn-primary btn-sm" onclick="window.dwApp.submitReply(${comment.id})">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  openReplyBox(commentId) {
    const box = document.getElementById(`replyBox-${commentId}`);
    if (!box) return;
    box.style.display = box.style.display === 'none' ? 'flex' : 'none';
    if (box.style.display === 'flex') {
      const input = document.getElementById(`replyInput-${commentId}`);
      if (input) input.focus();
    }
  }

  async submitReply(commentId) {
    const input = document.getElementById(`replyInput-${commentId}`);
    if (!input || !input.value.trim()) return;

    const content = input.value.trim();
    input.disabled = true;

    try {
      await window.DW_API.comments.reply(this.currentLevelId, this.currentVideoId, commentId, content);
      this.showToast('تم إرسال ردك بنجاح! 💬', 'success');
      input.value = '';
      this.loadVideoComments(this.currentLevelId, this.currentVideoId);
    } catch (err) {
      this.showToast(err.message || 'تعذر إرسال الرد.', 'error');
    } finally {
      input.disabled = false;
    }
  }

  async handlePostComment(e) {
    if (e) e.preventDefault();
    const txt = document.getElementById('newCommentTextarea');
    const btn = document.getElementById('postCommentBtn');
    if (!txt || !txt.value.trim()) return;

    if (!window.DW_API.client.isAuthenticated()) {
      this.showToast('يرجى تسجيل الدخول أولاً لإضافة سؤال أو تعليق.', 'info');
      this.openAuthModal('login');
      return;
    }

    const content = txt.value.trim();
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> إرسال...';
    }

    try {
      await window.DW_API.comments.create(this.currentLevelId, this.currentVideoId, content);
      this.showToast('تم نشر سؤالك بنجاح! سيتم إخطار هير خالد بالرد 🚀', 'success');
      txt.value = '';
      document.getElementById('commentCharCount').textContent = '0 / 2000';
      this.loadVideoComments(this.currentLevelId, this.currentVideoId);
    } catch (err) {
      this.showToast(err.message || 'تعذر نشر التعليق. تأكد من عدم تكرار النشر بسرعة (Rate Limit).', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال السؤال';
      }
    }
  }

  async handleEditComment(commentId) {
    const textEl = document.getElementById(`commentText-${commentId}`);
    const currentText = textEl ? textEl.textContent : '';

    const newContent = prompt('تعديل تعليقك (متاح خلال أول 15 دقيقة فقط):', currentText);
    if (!newContent || newContent.trim() === currentText) return;

    try {
      await window.DW_API.comments.edit(this.currentLevelId, this.currentVideoId, commentId, newContent.trim());
      this.showToast('تم تعديل التعليق بنجاح! ✏️', 'success');
      if (textEl) textEl.textContent = newContent.trim();
    } catch (err) {
      this.showToast(err.message || 'فشل تعديل التعليق.', 'error');
    }
  }

  async handleDeleteComment(commentId) {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا التعليق؟')) return;

    try {
      await window.DW_API.comments.delete(this.currentLevelId, this.currentVideoId, commentId);
      this.showToast('تم حذف التعليق.', 'info');
      const card = document.getElementById(`comment-${commentId}`);
      if (card) {
        card.innerHTML = '<div style="padding:8px 12px; color:#64748b; font-style:italic; font-size:0.85rem;">تم إزالة هذا التعليق.</div>';
      }
    } catch (err) {
      this.showToast(err.message || 'تعذر حذف التعليق.', 'error');
    }
  }

  refreshCurrentComments() {
    if (this.currentLevelId && this.currentVideoId) {
      this.loadVideoComments(this.currentLevelId, this.currentVideoId);
    }
  }

  // Course Materials (PDF) Download
  async downloadCourseFile(levelId, fileId, fileName) {
    this.showToast(`جاري تجهيز تحميل "${fileName}"... 📥`, 'info');
    try {
      const blob = await window.DW_API.courses.downloadCourseFile(levelId, fileId);
      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showToast('تم بدء تحميل الملف بنجاح! ✅', 'success');
      } else {
        this.showToast('تم تنزيل المستند بنجاح.', 'success');
      }
    } catch (err) {
      this.showToast(err.message || 'تعذر تحميل الملف، يرجى التأكد من تفعيل المستوى.', 'error');
    }
  }

  // =========================================================================
  // BOOKS STORE BACKEND INTEGRATION
  // =========================================================================
  async fetchBackendBooks() {
    if (!window.DW_API) return;
    try {
      const booksData = await window.DW_API.books.getBooks();
      this.backendBooks = booksData;
    } catch (err) {
      console.warn('Could not fetch books catalog from backend:', err.message);
    }
  }

  async downloadBookPdf(bookId, bookName) {
    this.showToast(`جاري تحميل كتاب "${bookName}" بصيغة PDF... 📚`, 'info');
    try {
      const blob = await window.DW_API.books.downloadBook(bookId);
      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${bookName}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showToast('تم تنزيل الكتاب بنجاح! 📖✨', 'success');
      }
    } catch (err) {
      this.showToast(err.message || 'ليس لديك صلاحية لتحميل هذا الكتاب الرقمي. تواصل مع الأكاديمية للاشتراك.', 'error');
    }
  }

  // =========================================================================
  // MASTER SCROLL REVEAL & VIEWPORT TRIGGERED ANIMATION ENGINE
  // =========================================================================
  initScrollRevealEngine() {
    // Fallback for environments lacking IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.dw-reveal, .dw-reveal-left, .dw-reveal-right, .dw-reveal-scale, .dw-reveal-flip').forEach(el => {
        el.classList.add('dw-revealed');
      });
      return;
    }

    // High performance IntersectionObserver configuration
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

    this.scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add('dw-revealed');

          // Trigger Counter-Up animation on stats / numbers
          const counterEl = target.querySelector('.interactive-stat h4, .hero-stat-item h4, [data-counter]');
          if (counterEl && !counterEl.dataset.counterDone) {
            this.animateCounter(counterEl);
          }

          // Unobserve so animation finishes cleanly and stays smoothly revealed
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    // Initial Discovery Pass
    this.scanAndRegisterRevealElements();

    // Secondary passes after dynamic renders
    setTimeout(() => this.scanAndRegisterRevealElements(), 350);
    setTimeout(() => this.scanAndRegisterRevealElements(), 1200);
  }

  scanAndRegisterRevealElements() {
    if (!this.scrollObserver) return;

    const revealRules = [
      { selector: '.section-header', type: 'dw-reveal' },
      { selector: '.course-steps-flow-bar', type: 'dw-reveal' },
      { selector: '.step-flow-card', type: 'dw-reveal', stagger: true },
      { selector: '.course-card-vip', type: 'dw-reveal-scale', stagger: true },
      { selector: '.level-group-card', type: 'dw-reveal-scale', stagger: true },
      { selector: '.hero-stat-item', type: 'dw-reveal-scale', stagger: true },
      { selector: '.hero-cv-banner-trigger', type: 'dw-reveal' },
      { selector: '.hero-visual-box', type: 'dw-reveal-left' },
      { selector: '.hero-text-box', type: 'dw-reveal-right' },
      { selector: '.cv-executive-dossier', type: 'dw-reveal' },
      { selector: '.cv-cred-card', type: 'dw-reveal', stagger: true },
      { selector: '.branch-card', type: 'dw-reveal-scale', stagger: true },
      { selector: '.book-store-card, .book-card, .book-item-card', type: 'dw-reveal', stagger: true },
      { selector: '.reviews-swiper-section', type: 'dw-reveal' },
      { selector: '.placement-quiz-section, .quiz-container, .placement-quiz-box', type: 'dw-reveal-scale' },
      { selector: '.faq-accordion-item, .faq-item', type: 'dw-reveal', stagger: true },
      { selector: '.footer-col', type: 'dw-reveal', stagger: true },
      { selector: '.about-grid', type: 'dw-reveal' }
    ];

    revealRules.forEach(rule => {
      const elements = document.querySelectorAll(rule.selector);
      elements.forEach((el, index) => {
        if (!el.dataset.dwObserved) {
          el.dataset.dwObserved = 'true';
          el.classList.add(rule.type);
          if (rule.stagger) {
            const delayStep = ((index % 4) + 1) * 100;
            el.classList.add(`dw-delay-${delayStep}`);
          }
          this.scrollObserver.observe(el);
        }
      });
    });
  }

  animateCounter(el) {
    if (!el || el.dataset.counterDone) return;
    el.dataset.counterDone = 'true';

    const originalText = el.innerText.trim();
    const hasPlus = originalText.includes('+');
    const hasPercent = originalText.includes('%');
    const numericStr = originalText.replace(/[^0-9]/g, '');

    if (!numericStr) return; // Non-numeric text

    const targetNum = parseInt(numericStr, 10);
    const prefix = hasPlus ? '+' : '';
    const suffix = hasPercent ? '%' : '';

    const duration = 1600; // milliseconds
    const startTime = performance.now();
    el.classList.add('stat-counting');

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic: 1 - (1 - t)^3
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(ease * targetNum);

      el.innerText = `${prefix}${currentVal.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.innerText = originalText;
        el.classList.remove('stat-counting');
      }
    };

    requestAnimationFrame(updateCount);
  }
}

// Global App Instance & Bridge Helpers
document.addEventListener('DOMContentLoaded', () => {
  window.dwApp = new DeutscheWeltApp();
  window.openCvModal = (tabId) => window.dwApp && window.dwApp.openCvModal(tabId);
  window.closeCvModal = () => window.dwApp && window.dwApp.closeCvModal();
});


