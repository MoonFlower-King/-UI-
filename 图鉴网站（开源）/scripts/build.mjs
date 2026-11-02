#!/usr/bin/env node
// 生成网站数据。用法：在仓库根目录 npm run build:site
//
// 输入（唯一来源，不在网站目录里另存副本）：
//   episodes.json                     每期元信息 [{ id, series_no, theme, title, type, keywords }]
//   ../EPxx 主题/主题 动画网页.html     该期 6 宫格动画页（纯 HTML + CSS），即视频素材本身
//   ../EPxx 主题/主题 发布文案.md       该期文案：正文（6 行大白话）与 Prompt 模板
// 输出（都是生成物，已在 .gitignore 里，不要提交）：
//   data/terms.js                     词条数据，首页直接读取
//   demos/<期>-<序号>.html             单个词条的演示页（首页用 iframe 嵌入）
//   episodes/<期>/index.html           整期动画页（首页「看整期动画」链接）
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = join(ROOT, '..');
const episodes = JSON.parse(readFileSync(join(ROOT, 'episodes.json'), 'utf8'));

// 按编号找到仓库根目录的「EPxx 主题/」文件夹，再找其中以 suffix 结尾的文件
const epDirs = readdirSync(REPO, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
function epFile(id, suffix) {
  const dir = epDirs.find((n) => n.startsWith(id + ' '));
  if (!dir) throw new Error(`${id}：仓库根目录找不到「${id} 主题」文件夹`);
  const file = readdirSync(join(REPO, dir)).find((f) => f.endsWith(suffix));
  if (!file) throw new Error(`${id}：「${dir}」里找不到「… ${suffix}」`);
  return join(REPO, dir, file);
}

// 取出 <div class="cell"> 开始、与之配对的 </div> 结束的整段
function extractCells(html) {
  const cells = [];
  let from = 0;
  for (;;) {
    const start = html.indexOf('<div class="cell">', from);
    if (start < 0) break;
    const tag = /<\/?div\b[^>]*>/g;
    tag.lastIndex = start;
    let depth = 0, m;
    while ((m = tag.exec(html))) {
      depth += m[0].startsWith('</') ? -1 : 1;
      if (depth === 0) break;
    }
    cells.push(html.slice(start, tag.lastIndex));
    from = tag.lastIndex;
  }
  return cells;
}

function parsePost(md) {
  const lines = [...md.matchAll(/^(\d)️?⃣\s*([^，]+)，(.+)$/gmu)].map((m) => {
    const [say, example] = m[3].split(/，(?=比如)/);
    return { en: m[2].trim(), say: say.trim(), example: example?.trim() ?? '' };
  });
  const prompts = {};
  for (const m of md.matchAll(/\*\*\d\.\s*(.+?)（[^）]*）\*\*\s*\n>\s*(.+)/g)) prompts[m[1].trim()] = m[2].trim();
  return { lines, prompts };
}

const demoShell = (style, cell, title) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
${style}
/* 演示页：只显示一个宫格，按 iframe 宽度等比缩放 */
html, body { background: transparent; }
body { display: block; min-height: 0; margin: 0; overflow: hidden; }
#demo { width: 456px; transform-origin: 0 0; }
#demo .cell { display: block; }
#demo .label-group { display: none; }
#demo .sandbox { box-shadow: none; border: 0; border-radius: 0; }
</style>
</head>
<body>
<div id="demo">${cell}</div>
<script>
  // 演示宫格按 456px 设计，这里按窗口宽度等比缩放
  (function fit() {
    document.getElementById('demo').style.transform = 'scale(' + innerWidth / 456 + ')';
    addEventListener('resize', fit, { once: true });
  })();
</script>
</body>
</html>
`;

for (const d of ['demos', 'episodes', 'data']) {
  rmSync(join(ROOT, d), { recursive: true, force: true });
  mkdirSync(join(ROOT, d), { recursive: true });
}

// 每个术语对应「江月 UI」（../组件库）里一个真正能用的组件，卡片上的「看代码」显示它的代码。
// 组件 id 默认由英文名转成小写连字符，个别名字不一致的写在这里。
const KIT = join(ROOT, '..', '组件库', 'components');
const ALIAS = { 'Sticky': 'sticky-header', 'Hamburger Toggle': 'hamburger-menu' };
const kitId = (en) => ALIAS[en] ?? en.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function kitCode(en) {
  const id = kitId(en);
  let raw;
  try { raw = readFileSync(join(KIT, `${id}.html`), 'utf8'); } catch { throw new Error(`「${en}」在 组件库/components/ 里没有对应的 ${id}.html，请先在江月 UI 里补上这个组件`); }
  return { kit: id, code: raw.replace(/^\s*<!--[\s\S]*?-->\s*/, '').trimEnd() + '\n' };
}

const terms = [];
for (const ep of episodes) {
  const page = epFile(ep.id, '动画网页.html');
  mkdirSync(join(ROOT, 'episodes', ep.id));
  copyFileSync(page, join(ROOT, 'episodes', ep.id, 'index.html'));
  const html = readFileSync(page, 'utf8');
  const { lines, prompts } = parsePost(readFileSync(epFile(ep.id, '发布文案.md'), 'utf8'));
  const style = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const cells = extractCells(html);
  if (cells.length !== 6) throw new Error(`${ep.id}: 应有 6 个宫格，实际 ${cells.length}`);
  cells.forEach((cell, i) => {
    const en = cell.match(/class="term-en">([^<]+)</)[1];
    const zh = cell.match(/class="term-zh">([^<]+)</)[1];
    const line = lines.find((l) => l.en === en) ?? {};
    const id = `${ep.id}-${i + 1}`;
    writeFileSync(join(ROOT, 'demos', `${id}.html`), demoShell(style, cell, `${en} · ${zh}`));
    terms.push({ id, episode: ep.id, en, zh, say: line.say ?? '', example: line.example ?? '', prompt: prompts[en] ?? '', demo: `demos/${id}.html`, ...kitCode(en) });
  });
}

const data = { episodes: episodes.map(({ id, series_no, theme, title, type, keywords }) => ({ id, series_no, theme, title, type, keywords })), terms };
// 输出 .js 而不是 .json：直接双击 index.html（file://）时浏览器不能 fetch 本地 JSON
writeFileSync(join(ROOT, 'data/terms.js'), `window.GLOSSARY = ${JSON.stringify(data)};\n`);
console.log(`✓ ${episodes.length} 期 / ${terms.length} 个词条`);
