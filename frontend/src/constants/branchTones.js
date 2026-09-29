// One colour per branch, chosen in the admin dashboard (full class names so Tailwind generates them).

// Dark footer list: icon tile + hover border.
const FOOTER = {
  teal: 'bg-teal-400/10 text-teal-400 group-hover:bg-teal-400 hover:border-teal-400/40',
  sky: 'bg-sky-400/10 text-sky-400 group-hover:bg-sky-400 hover:border-sky-400/40',
  amber: 'bg-amber-400/10 text-amber-400 group-hover:bg-amber-400 hover:border-amber-400/40',
  rose: 'bg-rose-400/10 text-rose-400 group-hover:bg-rose-400 hover:border-rose-400/40',
  violet: 'bg-violet-400/10 text-violet-400 group-hover:bg-violet-400 hover:border-violet-400/40',
  emerald: 'bg-emerald-400/10 text-emerald-400 group-hover:bg-emerald-400 hover:border-emerald-400/40',
};

export const BRANCH_TONES = {
  teal: {
    label: 'تركواز', footer: FOOTER.teal,
    glow: 'bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.55),transparent_60%)]',
    mapBg: 'from-teal-50 via-emerald-50 to-cyan-100', accent: '#14b8a6', soft: '#99f6e4',
    pin: 'from-teal-300 to-teal-500 text-[#0e2c4e] shadow-teal-500/40', ping: 'bg-teal-400/40', city: 'text-teal-200',
    bar: 'bg-teal-500', icon: 'text-teal-600', border: 'hover:border-teal-300', phone: 'hover:bg-teal-50 hover:border-teal-300', mapBtn: 'hover:bg-teal-600'
  },
  sky: {
    label: 'أزرق', footer: FOOTER.sky,
    glow: 'bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.55),transparent_60%)]',
    mapBg: 'from-sky-50 via-blue-50 to-indigo-100', accent: '#0ea5e9', soft: '#bae6fd',
    pin: 'from-sky-300 to-sky-500 text-[#0e2c4e] shadow-sky-500/40', ping: 'bg-sky-400/40', city: 'text-sky-200',
    bar: 'bg-sky-500', icon: 'text-sky-600', border: 'hover:border-sky-300', phone: 'hover:bg-sky-50 hover:border-sky-300', mapBtn: 'hover:bg-sky-600'
  },
  amber: {
    label: 'ذهبي', footer: FOOTER.amber,
    glow: 'bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.5),transparent_60%)]',
    mapBg: 'from-amber-50 via-orange-50 to-yellow-100', accent: '#f59e0b', soft: '#fde68a',
    pin: 'from-amber-300 to-amber-500 text-[#0e2c4e] shadow-amber-500/40', ping: 'bg-amber-400/40', city: 'text-amber-200',
    bar: 'bg-amber-500', icon: 'text-amber-600', border: 'hover:border-amber-300', phone: 'hover:bg-amber-50 hover:border-amber-300', mapBtn: 'hover:bg-amber-600'
  },
  rose: {
    label: 'وردي', footer: FOOTER.rose,
    glow: 'bg-[radial-gradient(ellipse_at_top_right,rgba(244,63,94,0.5),transparent_60%)]',
    mapBg: 'from-rose-50 via-pink-50 to-red-100', accent: '#f43f5e', soft: '#fecdd3',
    pin: 'from-rose-400 to-red-600 text-white shadow-rose-500/40', ping: 'bg-rose-400/40', city: 'text-rose-200',
    bar: 'bg-rose-500', icon: 'text-rose-600', border: 'hover:border-rose-300', phone: 'hover:bg-rose-50 hover:border-rose-300', mapBtn: 'hover:bg-rose-600'
  },
  violet: {
    label: 'بنفسجي', footer: FOOTER.violet,
    glow: 'bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.5),transparent_60%)]',
    mapBg: 'from-violet-50 via-purple-50 to-fuchsia-100', accent: '#8b5cf6', soft: '#ddd6fe',
    pin: 'from-violet-400 to-purple-600 text-white shadow-violet-500/40', ping: 'bg-violet-400/40', city: 'text-violet-200',
    bar: 'bg-violet-500', icon: 'text-violet-600', border: 'hover:border-violet-300', phone: 'hover:bg-violet-50 hover:border-violet-300', mapBtn: 'hover:bg-violet-600',
  },
  emerald: {
    label: 'أخضر', footer: FOOTER.emerald,
    glow: 'bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.5),transparent_60%)]',
    mapBg: 'from-emerald-50 via-green-50 to-lime-100', accent: '#10b981', soft: '#a7f3d0',
    pin: 'from-emerald-300 to-emerald-600 text-[#0e2c4e] shadow-emerald-500/40', ping: 'bg-emerald-400/40', city: 'text-emerald-200',
    bar: 'bg-emerald-500', icon: 'text-emerald-600', border: 'hover:border-emerald-300', phone: 'hover:bg-emerald-50 hover:border-emerald-300', mapBtn: 'hover:bg-emerald-600',
  },
};

export const BRANCH_COLOR_KEYS = Object.keys(BRANCH_TONES);

/** The branch's chosen colour, or one by position for branches without a colour. */
export const branchTone = (color, index = 0) =>
  BRANCH_TONES[color] || BRANCH_TONES[BRANCH_COLOR_KEYS[index % 4]];
