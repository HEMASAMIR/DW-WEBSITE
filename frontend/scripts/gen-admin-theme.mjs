// Generates src/app/admin/admin-theme.css: dark equivalents for every light colour utility the admin
// dashboard uses, plus the LTR drawer animations. Run `npm run gen:admin-theme` after changing admin colours.
import fs from 'node:fs';

const SOURCES = ['src/components/admin', 'src/constants/branchTones.js'];
const OUT = 'src/app/admin/admin-theme.css';
const ROOT = ':root[data-admin-theme="dark"]';

// Surfaces
const SURFACE = '#111b2e';
const PAGE = '#0a1322';

// Tailwind palette (100–500) for the hues that appear as light tints.
const HUES = {
  teal: ['#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6'],
  emerald: ['#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981'],
  sky: ['#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9'],
  violet: ['#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6'],
  amber: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b'],
  rose: ['#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e'],
  cyan: ['#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee', '#06b6d4'],
  orange: ['#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316'],
  red: ['#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444'],
  blue: ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6'],
  purple: ['#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7'],
  pink: ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899'],
  green: ['#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e'],
  indigo: ['#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1'],
  yellow: ['#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308'],
  lime: ['#ecfccb', '#d9f99d', '#bef264', '#a3e635', '#84cc16'],
  fuchsia: ['#fae8ff', '#f5d0fe', '#f0abfc', '#e879f9', '#d946ef'],
};
const shade = (hue, n) => HUES[hue][n / 100 - 1];
const tint = (hue, pct) => `color-mix(in oklab, ${shade(hue, 500)} ${pct}%, ${SURFACE})`;

const SLATE_BG = { 50: '#0e1729', 100: '#17233a', 200: '#223049', 300: '#2d3d59', 400: '#3b4c6b' };
const SLATE_LINE = { 50: '#1a2640', 100: '#1c2942', 200: '#26354f', 300: '#33445f', 400: '#46587a' };
const SLATE_TEXT = { 500: '#94a3b8', 600: '#aab6c8', 700: '#cbd5e1', 800: '#e2e8f0', 900: '#f1f5f9' };

/** Dark colour for a (kind, colour) pair, or null to leave it alone. */
function darkColor(kind, color, alpha) {
  const bgLike = ['bg', 'from', 'via', 'to'].includes(kind);
  const lineLike = ['border', 'divide', 'ring', 'stroke'].includes(kind);

  if (color === 'white') {
    if (alpha !== null && alpha <= 30) return null; // translucent white on navy stays
    if (bgLike || kind === 'ring') return SURFACE;
    return null;
  }
  if (color === '[#f3f6fa]' && bgLike) return PAGE;
  if (color === '[#0e2c4e]') {
    if (kind === 'text') return '#e2e8f0';
    if (kind === 'border') return '#5eead4';
    if (kind === 'bg') return '#1d4a7a';
    return null;
  }

  const m = color.match(/^([a-z]+)-(\d+)$/);
  if (!m) return null;
  const [, hue, nStr] = m;
  const n = Number(nStr);

  if (hue === 'slate') {
    if (bgLike) return SLATE_BG[n] || null;
    if (lineLike) return SLATE_LINE[n] || null;
    if (kind === 'text') return SLATE_TEXT[n] || null;
    return null;
  }
  if (!HUES[hue]) return null;
  if (bgLike) return { 50: tint(hue, 14), 100: tint(hue, 22), 200: tint(hue, 32) }[n] || null;
  if (lineLike) return { 50: tint(hue, 22), 100: tint(hue, 28), 200: tint(hue, 36), 300: tint(hue, 50) }[n] || null;
  if (kind === 'text') return { 600: shade(hue, 400), 700: shade(hue, 300), 800: shade(hue, 200), 900: shade(hue, 200), 950: shade(hue, 100) }[n] || null;
  return null;
}

const withAlpha = (c, alpha) => (alpha === null ? c : `color-mix(in oklab, ${c} ${alpha}%, transparent)`);

function declaration(kind, value) {
  switch (kind) {
    case 'bg': return `background-color: ${value}`;
    case 'text': return `color: ${value}`;
    case 'border': return `border-color: ${value}`;
    case 'ring': return `--tw-ring-color: ${value}`;
    case 'stroke': return `stroke: ${value}`;
    case 'from': return `--tw-gradient-from: ${value}`;
    case 'via': return `--tw-gradient-via: ${value}`;
    case 'to': return `--tw-gradient-to: ${value}`;
    default: return null;
  }
}

const cssEscape = (s) => s.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);
const VARIANTS = {
  hover: (sel) => `${sel}:hover`,
  focus: (sel) => `${sel}:focus`,
  'focus-within': (sel) => `${sel}:focus-within`,
  active: (sel) => `${sel}:active`,
  disabled: (sel) => `${sel}:disabled`,
  placeholder: (sel) => `${sel}::placeholder`,
  'group-hover': (sel) => `.group:hover ${sel}`,
};

// ---- scan
const files = SOURCES.flatMap((p) => (fs.statSync(p).isDirectory()
  ? fs.readdirSync(p).filter((n) => /\.(jsx?|tsx?)$/.test(n)).map((n) => `${p}/${n}`)
  : [p]));
const tokens = new Set();
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/(?<![\w-])((?:[a-z-]+:)*)(bg|text|border|divide|ring|stroke|from|via|to)-(white|slate-\d+|[a-z]+-\d+|\[#[0-9a-f]{6}\])(?:\/(\d+|\[[\d.]+\]))?(?![\w-])/g)) {
    tokens.add(m[0]);
  }
}

// ---- emit
const rules = [];
for (const token of [...tokens].sort()) {
  const m = token.match(/^((?:[a-z-]+:)*)(bg|text|border|divide|ring|stroke|from|via|to)-(.+?)(?:\/(\d+|\[[\d.]+\]))?$/);
  if (!m) continue;
  const [, variantStr, kind, color, alphaStr] = m;
  const alpha = alphaStr === undefined ? null : alphaStr.startsWith('[') ? Number(alphaStr.slice(1, -1)) * 100 : Number(alphaStr);
  const base = darkColor(kind, color, alpha);
  if (!base) continue;
  const variants = variantStr ? variantStr.slice(0, -1).split(':') : [];
  if (variants.some((v) => !VARIANTS[v])) continue; // responsive etc.

  // Not inside illustrations that must keep their light palette
  let sel = `.${cssEscape(token)}:not(.dw-keep-light, .dw-keep-light *)`;
  for (const v of variants.reverse()) sel = VARIANTS[v](sel);
  if (kind === 'divide') sel = `${sel} > :not(:last-child)`;
  const decl = declaration(kind === 'divide' ? 'border' : kind, withAlpha(base, alpha));
  if (decl) rules.push(`${ROOT} ${sel} { ${decl}; }`);
}

const header = `/* Admin dashboard dark theme — GENERATED, do not edit by hand.
   Regenerate with "npm run gen:admin-theme" after changing admin colours.
   Active only while <html data-admin-theme="dark"> is set by the dashboard. */

${ROOT} { color-scheme: dark; }
${ROOT} body { background-color: ${PAGE}; }
${ROOT} .dw-admin-dots { opacity: 0.06 !important; }

/* LTR (English): drawers open from the right, the mobile sidebar from the left */
[dir='ltr'] .dw-drawer-in { animation-name: dw-drawer-in-ltr; }
[dir='ltr'] .dw-sidebar-in { animation-name: dw-sidebar-in-ltr; }
@keyframes dw-drawer-in-ltr { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes dw-sidebar-in-ltr { from { transform: translateX(-100%); } to { transform: translateX(0); } }

`;
fs.writeFileSync(OUT, header + rules.join('\n') + '\n');
console.log(`${rules.length} rules from ${tokens.size} tokens → ${OUT}`);
