#!/usr/bin/env node
// 把 prompts/*.html 收录成 data/prompts.js（名字、提示词等文字）和 data/prompt-code/<分组>.js（预览代码），
// 提示词调配台（prompts.html）先读文字，卡片快到屏幕时才按分组下载预览代码，词条再多首屏也不变慢。
// 用法：在仓库根目录 npm run build:ui（会顺带跑这个脚本）
//
// 词条文件和 components/ 是同一种格式：开头一段 HTML 注释包着 JSON 元信息，后面是预览代码。
//   <!--
//   { "en": "Dolly In", "zh": "推镜头", "lead": "一句大白话：效果是什么、什么时候用",
//     "prompt": "中文提示词片段", "promptEn": "English prompt snippet",
//     "avoid": "容易用错的地方（反面提示）",
//     "neg": ["可选：拼进「避免」的中文短语", "English negative phrase"],
//     "alias": ["可选：别名"], "tip": "可选：工具小贴士" }
//   -->
//   <div>…</div>  <style>…</style>
//
// 很多词条共用的一段 CSS 可以抽成「骨架」：prompts/_<名字>.css，词条元信息写 "kit": "<名字>" 就会先套上它，
// 这样几百个词条不用每个都复制一遍（比如网站风格的 _site-kit.css）。
// 网站风格还可以写 "layout": "<名字>" 换一种版式骨架 prompts/_layout-<名字>.css（居中、竖排、杂志、分屏、海报、便当、侧栏），
// 同一个书房网站的内容不变、排法变，套在 kit 之后、词条自己的 CSS 之前。不写就是默认的「左文右图」。
// 每种版式在 data/prompt-layouts.json 里有一句中英文说明，构建时自动拼到词条提示词末尾。
//
// 和组件库的区别：
// - 预览只用 HTML + CSS（不许写 <script>），直接画进卡片，不开 iframe，又轻又省电
// - 同一组词条可以共用一个「舞台」：prompts/_<舞台名>.html（比如所有运镜共用一个江边场景），
//   词条只写自己那部分 CSS。舞台在 data/prompt-groups.json 的 stage 字段里指定
// 词条属于哪个组、排第几，由 data/prompt-groups.json 决定，新词条要在那里登记。
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const fail = (msg) => { console.error('✗ prompts/' + msg); process.exit(1); };
const { kinds, groups } = JSON.parse(readFileSync(join(ROOT, 'data/prompt-groups.json'), 'utf8'));
const LAYOUTS = JSON.parse(readFileSync(join(ROOT, 'data/prompt-layouts.json'), 'utf8'));
const noScript = (file, code) => { if (/<script/i.test(code)) fail(`${file}：预览只用 HTML + CSS，不要写 <script>`); return code; };

const stages = {}, kits = {}, byId = new Map();
for (const file of readdirSync(join(ROOT, 'prompts')).filter((f) => f.startsWith('_') && f.endsWith('.css'))) {
  kits[basename(file, '.css').slice(1)] = readFileSync(join(ROOT, 'prompts', file), 'utf8').trim();
}
for (const file of readdirSync(join(ROOT, 'prompts')).filter((f) => f.endsWith('.html'))) {
  const raw = readFileSync(join(ROOT, 'prompts', file), 'utf8');
  if (file.startsWith('_')) { stages[basename(file, '.html').slice(1)] = noScript(file, raw.trim()); continue; }
  const m = raw.match(/^\s*<!--([\s\S]*?)-->\s*/);
  if (!m) fail(`${file}：开头缺少 <!-- {元信息 JSON} --> 注释`);
  let meta;
  try { meta = JSON.parse(m[1]); } catch (e) { fail(`${file}：元信息不是合法 JSON（${e.message}）`); }
  const missing = ['en', 'zh', 'lead', 'prompt', 'promptEn', 'avoid'].filter((k) => !meta[k]);
  if (missing.length) fail(`${file}：元信息缺少 ${missing.join('、')}`);
  if (meta.kit && !kits[meta.kit]) fail(`${file}：kit「${meta.kit}」对应的 prompts/_${meta.kit}.css 不存在`);
  if (meta.layout) {
    if (!kits[`layout-${meta.layout}`] || !LAYOUTS[meta.layout]) fail(`${file}：layout「${meta.layout}」要同时有 prompts/_layout-${meta.layout}.css 和 data/prompt-layouts.json 里的说明`);
    // 版式说明统一拼在提示词末尾，复制出去的提示词里就写明了怎么排
    meta.prompt += `；${LAYOUTS[meta.layout].zh}`;
    meta.promptEn += `; ${LAYOUTS[meta.layout].en}`;
  }
  if (meta.neg && !(Array.isArray(meta.neg) && meta.neg.length === 2)) fail(`${file}：neg 要写成 ["中文", "English"]`);
  byId.set(basename(file, '.html'), { ...meta, code: noScript(file, raw.slice(m[0].length).trim()) });
}

const items = [];
const kindIds = new Set(kinds.map((k) => k.id));
for (const g of groups) {
  if (!kindIds.has(g.kind)) fail(`../data/prompt-groups.json：${g.name} 的 kind「${g.kind}」不在 kinds 里`);
  if (g.stage && !stages[g.stage]) fail(`../data/prompt-groups.json：${g.name} 用的舞台 _${g.stage}.html 不存在`);
  for (const id of g.items) {
    const it = byId.get(id);
    if (!it) fail(`../data/prompt-groups.json：${g.name} 里的 ${id} 找不到 prompts/${id}.html`);
    if (it.group) fail(`../data/prompt-groups.json：${id} 重复登记`);
    it.group = g.id;
    items.push({ id, ...it });
  }
}
// 「感觉」筛选标签：data/prompt-tags.json 里每个标签一组关键词，命中名字、别名、一句话简介的就打上；
// 元信息里写 "tags": ["标签 id"] 可以手动补。命中太少的标签不显示，免得点进去只有一两个
const TAGS = JSON.parse(readFileSync(join(ROOT, 'data/prompt-tags.json'), 'utf8')).tags;
const tagIds = new Set(TAGS.map((t) => t.id));
for (const it of items) {
  if (it.tags && !(Array.isArray(it.tags) && it.tags.every((t) => tagIds.has(t)))) fail(`${it.id}.html：tags 里只能写 data/prompt-tags.json 里有的标签 id`);
  const text = [it.zh, it.en, ...(it.alias || []), it.lead].join(' ').toLowerCase();
  it.tags = TAGS.filter((t) => it.tags?.includes(t.id) || t.words.some((w) => text.includes(w.toLowerCase()))).map((t) => t.id);
}
const tags = TAGS.map(({ id, name }) => ({ id, name, count: items.filter((it) => it.tags.includes(id)).length })).filter((t) => t.count >= 5);
const orphan = [...byId].filter(([, it]) => !it.group).map(([id]) => id);
if (orphan.length) fail(`这些词条没有在 data/prompt-groups.json 里登记：${orphan.join('、')}`);

// 预览代码按分组拆开：每组一个文件，用到哪组才加载哪组（用 <script> 而不是 fetch，直接双击打开 html 也能用）
const HEAD = '// 由 scripts/build-prompts.mjs 生成，不要手改。\n';
const codeDir = join(ROOT, 'data/prompt-code');
rmSync(codeDir, { recursive: true, force: true });
mkdirSync(codeDir, { recursive: true });
let codeBytes = 0;
for (const g of groups) {
  const code = Object.fromEntries(items.filter((it) => it.group === g.id).map((it) => [it.id, it.code]));
  const js = `${HEAD}(window.JY_PROMPT_CODE ||= {})[${JSON.stringify(g.id)}] = ${JSON.stringify(code)};\n`;
  codeBytes = Math.max(codeBytes, Buffer.byteLength(js));
  writeFileSync(join(codeDir, `${g.id}.js`), js);
}
const out = { kinds, groups: groups.map(({ items: list, ...g }) => ({ ...g, count: list.length })), items: items.map(({ code, ...it }) => it), stages, kits, tags,
  layouts: Object.fromEntries(Object.entries(LAYOUTS).map(([k, v]) => [k, v.name])) };
const index = `${HEAD}window.JY_PROMPTS = ${JSON.stringify(out)};\n`;
writeFileSync(join(ROOT, 'data/prompts.js'), index);
console.log(`✓ 提示词调配台：${groups.length} 组、${items.length} 个词条、${Object.keys(stages).length} 个舞台、${Object.keys(kits).length} 套骨架（索引 ${Math.round(Buffer.byteLength(index) / 1024)}KB，最大的分组代码 ${Math.round(codeBytes / 1024)}KB）`);
