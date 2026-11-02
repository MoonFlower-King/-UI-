#!/usr/bin/env node
// 把 components/*.html 收录成 data/components.js，文档站（index.html）直接读取它。
// 用法：在仓库根目录 npm run build:ui
//
// 每个组件一个文件，开头是一段 HTML 注释包着的 JSON 元信息，后面是组件代码本身：
//   <!--
//   { "en": "Toast", "zh": "轻提示", "lead": "一句大白话解释", "prompt": "可以直接复制给 AI 的提示词",
//     "vague": ["可选：用户常说的模糊说法"], "terms": ["可选：相关专业词"], "episode": "可选：对应视频 EPxx" }
//   -->
//   <div>…</div>  <style>…</style>  <script>…</script>
//
// 组件属于哪个主题、在主题里的顺序，由 data/categories.json 决定。新组件要在那里登记。
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const fail = (msg) => { console.error('✗ ' + msg); process.exit(1); };

const categories = read('data/categories.json');
const vague = read('data/vague-words.json');

const byId = new Map();
for (const file of readdirSync(join(ROOT, 'components')).filter((f) => f.endsWith('.html'))) {
  const raw = readFileSync(join(ROOT, 'components', file), 'utf8');
  const m = raw.match(/^\s*<!--([\s\S]*?)-->\s*/);
  if (!m) fail(`${file}：开头缺少 <!-- {元信息 JSON} --> 注释`);
  let meta;
  try { meta = JSON.parse(m[1]); } catch (e) { fail(`${file}：元信息不是合法 JSON（${e.message}）`); }
  const missing = ['en', 'zh', 'lead', 'prompt'].filter((k) => !meta[k]);
  if (missing.length) fail(`${file}：元信息缺少 ${missing.join('、')}`);
  delete meta.group;
  byId.set(basename(file, '.html'), { ...meta, code: raw.slice(m[0].length).trimEnd() + '\n' });
}

const components = [];
for (const cat of categories) {
  for (const id of cat.items) {
    const c = byId.get(id);
    if (!c) fail(`categories.json：${cat.name} 里的 ${id} 找不到 components/${id}.html`);
    if (c.cat) fail(`categories.json：${id} 同时出现在 ${c.cat} 和 ${cat.id}`);
    c.cat = cat.id;
    components.push({ id, ...c });
  }
}
const orphan = [...byId].filter(([, c]) => !c.cat).map(([id]) => id);
if (orphan.length) fail(`这些组件没有在 categories.json 里登记：${orphan.join('、')}`);
for (const v of vague) for (const [, , id] of v.terms) if (id && !byId.has(id)) fail(`vague-words.json：找不到组件 ${id}`);

// 拆成两部分，组件再多打开也快：
// - data/components.js：只有名字、说明、提示词（搜索、感觉翻译、篮子都只用这些），一打开就加载
// - data/code/<主题>.js：每个主题一个文件，装这个主题所有组件的代码；滚到这个主题、或打开它的词条时才加载
// 用 .js 而不是 .json：双击 index.html（file://）时浏览器不允许 fetch 本地文件
const HEAD = '// 由 scripts/build.mjs 生成，不要手改。改组件请改 components/ 下的文件后重新运行 npm run build:ui。\n';
const cats = categories.map(({ items, ...c }) => ({ ...c, count: items.length }));
const meta = components.map(({ code, ...c }) => c);
writeFileSync(join(ROOT, 'data/components.js'), `${HEAD}window.UI_KIT = ${JSON.stringify({ categories: cats, components: meta, vague })};\n`);
const CODE = join(ROOT, 'data/code');
rmSync(CODE, { recursive: true, force: true });
mkdirSync(CODE);
for (const cat of categories) {
  const code = Object.fromEntries(components.filter((c) => c.cat === cat.id).map((c) => [c.id, c.code]));
  writeFileSync(join(CODE, `${cat.id}.js`), `${HEAD}window.JY_CODE(${JSON.stringify(cat.id)}, ${JSON.stringify(code)});\n`);
}
const kb = (n) => `${Math.round(n / 1024)}KB`;
const biggest = Math.max(...categories.map((c) => components.filter((x) => x.cat === c.id).reduce((n, x) => n + x.code.length, 0)));
console.log(`✓ ${categories.length} 个主题、${components.length} 个组件、${vague.length} 条“说不清”速查（索引 ${kb(JSON.stringify(meta).length)}，最大的主题代码 ${kb(biggest)}）`);
if (biggest > 400 * 1024) console.warn('! 有主题的代码超过 400KB，考虑把它拆成两个主题');
