// Checks the site translations (src/lib/i18n.jsx):
//   node scripts/i18n-check.mjs            → problems in the code + keys missing from site.en / site.de
//   node scripts/i18n-check.mjs --keys     → every key, one per line
//
// Code problems it reports:
//   module-level t(...)   evaluated once at load → never changes language (translate where it renders)
//   shadowed t            a local variable/param named `t` hides the translate function
//   untranslated Arabic   Arabic text in JSX / strings that isn't passed through t()
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';

const traverse = traverseModule.default || traverseModule;
const ROOT = 'src';
const SKIP = [/components[\\/]admin/, /app[\\/]admin/, /site-data/, /public-data/, /lib[\\/]siteStore/, /lib[\\/]i18n/, /constants[\\/]/, /services[\\/](?!api\.js)/];
const AR = /[؀-ۿ]/;

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : /\.(jsx?|tsx?)$/.test(e.name) ? [p] : [];
});

const keys = new Set();
const problems = [];
// Texts kept in constants and translated where they render (t(item.title) …)
const DATA_FILES = ['src/constants/siteContent.js', 'src/constants/branchTones.js', 'src/constants/levelTones.js'];

for (const file of walk(ROOT).filter((f) => !SKIP.some((re) => re.test(f)))) {
  const code = fs.readFileSync(file, 'utf8');
  if (!AR.test(code) && !/\bt\(/.test(code)) continue;
  let ast;
  try {
    ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
  } catch (e) {
    problems.push(`${file}: parse error ${e.message}`);
    continue;
  }
  // `// i18n-keep` on a line (or the line above) = Arabic on purpose (e.g. messages sent to the academy).
  const srcLines = code.split('\n');
  const kept = (node) => {
    const l = node.loc.start.line - 1;
    return /i18n-keep/.test(srcLines[l] || '') || /i18n-keep/.test(srcLines[l - 1] || '');
  };
  // Inside a function whose body is marked (the comment above the function).
  const keptScope = (p) => {
    for (let f = p.getFunctionParent(); f; f = f.getFunctionParent()) if (kept(f.node)) return true;
    return false;
  };
  const markedScope = (p, re) => {
    for (let f = p.getFunctionParent(); f; f = f.getFunctionParent()) {
      const l = f.node.loc.start.line - 1;
      if (re.test(srcLines[l] || '') || re.test(srcLines[l - 1] || '')) return true;
    }
    return false;
  };
  const push = (p, msg) => { if (!kept(p.node) && !keptScope(p)) problems.push(msg); };
  traverse(ast, {
    CallExpression(p) {
      if (p.node.callee.type !== 'Identifier' || !['t', 'tRich'].includes(p.node.callee.name)) return;
      const arg = p.node.arguments[0];
      if (arg?.type === 'StringLiteral') keys.add(arg.value);
      if (!p.getFunctionParent()) problems.push(`${file}:${p.node.loc.start.line} module-level t(): evaluated once, never re-translated`);
      const binding = p.scope.getBinding('t');
      if (binding && binding.kind !== 'module') problems.push(`${file}:${p.node.loc.start.line} t is shadowed by a local ${binding.kind} (line ${binding.path.node.loc.start.line})`);
    },
    JSXText(p) {
      if (AR.test(p.node.value)) push(p, `${file}:${p.node.loc.start.line} untranslated JSX text: ${p.node.value.trim().slice(0, 50)}`);
    },
    StringLiteral(p) {
      if (!AR.test(p.node.value)) return;
      // `// i18n-translated` above a function = its texts are passed through t() by the caller.
      if (markedScope(p, /i18n-translated/)) { keys.add(p.node.value); return; }
      const parent = p.parentPath;
      if (parent.isCallExpression() && ['t', 'tRich'].includes(parent.node.callee.name)) return;
      if (parent.isImportDeclaration() || parent.isObjectProperty({ key: p.node })) return;
      // Module-level constants (menus, labels…) are translated where they render: t(link.label).
      if (!p.getFunctionParent()) { keys.add(p.node.value); return; }
      push(p, `${file}:${p.node.loc.start.line} untranslated string: ${p.node.value.slice(0, 50)}`);
    },
    TemplateLiteral(p) {
      if (p.node.quasis.some((q) => AR.test(q.value.raw))) push(p, `${file}:${p.node.loc.start.line} untranslated template: ${p.node.quasis.map((q) => q.value.raw).join('${…}').slice(0, 60)}`);
    },
  });
}

// Data texts rendered via t(value): every Arabic string literal in the data files is a key.
for (const file of DATA_FILES) {
  if (!fs.existsSync(file)) continue;
  const ast = parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
  traverse(ast, {
    StringLiteral(p) { if (AR.test(p.node.value)) keys.add(p.node.value); },
    TemplateLiteral(p) { p.node.quasis.forEach((q) => { if (AR.test(q.value.cooked)) keys.add(q.value.cooked); }); },
  });
}

if (process.argv.includes('--keys')) {
  [...keys].forEach((k) => console.log(k));
} else {
  const load = async (name) => (await import(pathToFileURL(path.resolve(`src/lib/i18n/${name}.js`)).href)).default;
  const dicts = { en: await load('site.en'), de: await load('site.de') };
  problems.forEach((p) => console.log('CODE ', p));
  for (const [lang, dict] of Object.entries(dicts)) {
    const missing = [...keys].filter((k) => !(k in dict));
    const vars = Object.entries(dict).filter(([k, v]) => (k.match(/\{\w+\}/g) || []).sort().join() !== (String(v).match(/\{\w+\}/g) || []).sort().join());
    console.log(`${lang}: ${keys.size} keys, ${missing.length} missing, ${vars.length} placeholder mismatches`);
    if (process.argv.includes('--missing')) missing.forEach((k) => console.log(`  MISSING ${lang}:`, k));
    vars.forEach(([k]) => console.log(`  VARS ${lang}:`, k));
  }
  console.log(`${problems.length} code problems`);
}
