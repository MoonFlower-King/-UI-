#!/usr/bin/env node
// 发片前自检：检查一期的「动画网页.html」「发布文案.md」「抖音发布包.md」是否符合系列规范。
// 用法：node check.mjs "<期目录>"      例：node check.mjs "EP12 动画缓动与节奏"
// 有 ✗ 就先修，⚠ 是提醒（人工判断）。退出码：有 ✗ 时为 1。
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = resolve(process.argv[2] ?? '.');
const here = dirname(fileURLToPath(import.meta.url));
let fails = 0;
const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => { fails++; console.log(`  ✗ ${m}`); };
const warn = (m) => console.log(`  ⚠ ${m}`);
const pick = (suffix) => readdirSync(dir).find((f) => f.endsWith(suffix));
const len = (s) => [...s.replace(/\s/g, '')].length; // 平台按字数算，去掉空格

// ---------- 动画网页 ----------
console.log('动画网页');
const htmlName = pick('动画网页.html');
let terms = [];
if (!htmlName) bad('找不到「<主题> 动画网页.html」');
else {
  const html = readFileSync(join(dir, htmlName), 'utf8');
  // 外壳必须与模板一致（忽略注释与空白差异）
  const shell = (s) => (s.match(/外壳：所有期数共用[\s\S]*?外壳结束/)?.[0] ?? '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, '');
  const tpl = readFileSync(join(here, '../templates/动画网页.html'), 'utf8');
  if (!shell(html)) bad('缺少「外壳」段落');
  else if (shell(html) !== shell(tpl)) bad('外壳被改动了：画布、字号、配色、竖屏版式都在外壳里，必须原样复制模板');
  else ok('外壳与模板一致');

  const cells = html.split('<div class="cell">').length - 1;
  cells === 6 ? ok('6 个宫格') : bad(`宫格数 ${cells}，应为 6`);
  terms = [...html.matchAll(/class="term-en">([^<]+)<\/div><div class="term-zh">([^<]+)</g)].map((m) => ({ en: m[1].trim(), zh: m[2].trim() }));
  terms.length === 6 ? ok(`术语：${terms.map((t) => t.en).join(' · ')}`) : bad(`读到 ${terms.length} 组 term-en/term-zh，应为 6`);
  terms.filter((t) => len(t.zh) > 7).forEach((t) => warn(`中文名「${t.zh}」超过 7 个字，竖屏宫格里会挤`));

  /<h1 class="title"><span>给 AI 描述<em>[^<]{2,8}<\/em><\/span><span class="comma">，<\/span><span class="sub">记住这 6 个词<\/span><\/h1>/.test(html)
    ? ok('标题结构正确') : bad('标题需为：给 AI 描述<em>主题(2–8字)</em>，记住这 6 个词（含 comma/sub 两个 span，竖屏换行要用）');
  html.includes('<div class="watermark">江月AI设计</div>') ? ok('水印') : bad('缺少水印「江月AI设计」');

  const anims = [...html.matchAll(/animation:\s*([^;}]+)/g)].map((m) => m[1]);
  const offClock = anims.filter((a) => !/var\(--(clock|baked)\)/.test(a) && !/^none/.test(a.trim()));
  offClock.length ? bad(`有动画没用 4s 主时钟（var(--clock) / var(--baked)）：${offClock.slice(0, 3).join(' | ')}`) : ok('所有动画都挂在 4s 主时钟上，循环无缝');
  /transition\s*:/.test(html.replace(/\/\*[\s\S]*?\*\//g, '')) && warn('用了 transition：录制时没有交互触发，它不会动，改成 keyframes');
  /<img|url\(\s*['"]?(http|data:image)/.test(html) && warn('用了图片：系列约定纯 CSS/SVG 绘制，图片在宫格里容易糊');
  /<script[^>]*src=/.test(html) && bad('引入了外部脚本：动画必须是纯 CSS');

  const code = html.replace(/\/\*[\s\S]*?\*\//g, '');
  const hues = [...code.matchAll(/hue-([a-z]+)/g)].map((m) => m[1]);
  const valid = ['blue', 'green', 'orange', 'red', 'pink', 'purple', 'indigo', 'teal', 'yellow'];
  hues.filter((h) => !valid.includes(h)).forEach((h) => bad(`未知色相 hue-${h}`));
}

// ---------- 发布文案 ----------
console.log('发布文案');
const postName = pick('发布文案.md');
if (!postName) bad('找不到「<主题> 发布文案.md」');
else {
  const md = readFileSync(join(dir, postName), 'utf8');
  for (const h of ['## 一、标题', '## 二、封面大字', '## 三、正文', '## 四、关键词', '## 五、置顶评论', '## 六、Prompt 模板']) md.includes(h) || bad(`缺少段落「${h}」`);
  const sec = (a, b) => md.slice(md.indexOf(a), b ? md.indexOf(b) : undefined);
  const titles = sec('## 一、标题', '## 二、');
  const xhs = [...(titles.split('**抖音')[0] ?? '').matchAll(/^- (.+)$/gm)].map((m) => m[1]);
  const dy = [...(titles.split('**抖音')[1] ?? '').matchAll(/^- (.+)$/gm)].map((m) => m[1]);
  xhs.forEach((t) => len(t) > 20 && bad(`小红书标题超 20 字（${len(t)}）：${t}`));
  dy.forEach((t) => len(t) > 30 && bad(`抖音标题超 30 字（${len(t)}）：${t}`));
  xhs.length && dy.length ? ok(`标题：小红书 ${xhs.length} 个、抖音 ${dy.length} 个`) : bad('标题段落需同时有小红书和抖音备选');

  const lines = [...md.matchAll(/^(\d)️?⃣\s*([^，]+)，(.+)$/gmu)].map((m) => ({ n: +m[1], en: m[2].trim(), say: m[3] }));
  lines.length === 6 ? ok('正文 6 行') : bad(`正文应有 6 行「1️⃣ English Term，大白话」，实际 ${lines.length}`);
  lines.forEach((l) => len(l.say) > 24 && warn(`第 ${l.n} 行大白话偏长（${len(l.say)} 字）：${l.say}`));
  const prompts = [...md.matchAll(/\*\*(\d)\.\s*(.+?)（([^）]*)）\*\*\s*\n>\s*(.+)/g)].map((m) => ({ en: m[2].trim(), zh: m[3].trim(), text: m[4] }));
  prompts.length === 6 ? ok('Prompt 6 段') : bad(`Prompt 应有 6 段「**1. English Term（中文）**」+「> 提示词」，实际 ${prompts.length}`);
  prompts.forEach((p) => p.text.includes(p.en) || warn(`「${p.en}」的提示词里没出现英文术语本身——让 AI 认出这个词是这个系列的核心`));
  prompts.forEach((p) => /\d/.test(p.text) || warn(`「${p.en}」的提示词没有任何具体数值（时长/位移/缩放），AI 会自由发挥`));
  if (terms.length === 6) {
    const htmlEn = terms.map((t) => t.en).join('|');
    lines.map((l) => l.en).join('|') === htmlEn ? ok('正文术语与动画网页顺序一致') : bad(`正文术语顺序与动画网页不一致\n      网页：${htmlEn}\n      正文：${lines.map((l) => l.en).join('|')}`);
    prompts.map((p) => p.en).join('|') === htmlEn ? ok('Prompt 术语与动画网页顺序一致') : bad('Prompt 术语顺序与动画网页不一致');
    prompts.forEach((p) => { const t = terms.find((x) => x.en === p.en); t && t.zh.replace(/\s/g, '') !== p.zh.replace(/\s/g, '') && warn(`「${p.en}」中文名不一致：网页「${t.zh}」/ Prompt「${p.zh}」`); });
  }
  /下一期：/.test(md) ? ok('置顶评论有「下一期」预告') : warn('置顶评论里没有「下一期」预告');
}

// ---------- 抖音发布包 ----------
console.log('抖音发布包');
const dyName = pick('抖音发布包.md');
if (!dyName) bad('找不到「<主题> 抖音发布包.md」');
else {
  const md = readFileSync(join(dir, dyName), 'utf8');
  for (const h of ['## 作品标题', '## 作品描述', '## 搜索关键词', '## 置顶评论', '## 发布设置']) md.includes(h) || bad(`缺少段落「${h}」`);
  const ts = [...(md.split('## 作品标题')[1]?.split('##')[0] ?? '').matchAll(/^- (.+)$/gm)].map((m) => m[1]);
  ts.forEach((t) => len(t) > 30 && bad(`抖音标题超 30 字（${len(t)}）：${t}`));
  const tags = (md.split('## 作品描述')[1]?.split('##')[0] ?? '').match(/#\S+/g) ?? [];
  tags.length > 5 ? warn(`作品描述里有 ${tags.length} 个话题，抖音建议 ≤5 个`) : ok(`作品描述话题 ${tags.length} 个`);
}

// ---------- 成片 ----------
console.log('成片');
for (const s of ['（横屏 16比10）.mp4', '（竖屏 9比16）.mp4', '封面（横屏）.png', '封面（竖屏）.png']) pick(s) ? ok(s) : warn(`还没有「…${s}」——运行 render.mjs 生成`);

console.log(fails ? `\n✗ ${fails} 处需要修改` : '\n✓ 全部通过');
process.exit(fails ? 1 : 0);
