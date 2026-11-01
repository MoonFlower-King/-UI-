#!/usr/bin/env node
// 由 episodes/ 生成网站数据：data/terms.js(.json) 与每个词条的独立演示页 demos/<期>-<序号>.html
// 用法（在 site/ 目录下）：node scripts/build.mjs
//
// episodes/ 结构：
//   episodes/episodes.json            每期元信息 [{ id, series_no, theme, title, type, keywords }]
//   episodes/<id>/index.html          该期 6 宫格动画页（纯 HTML + CSS）
//   episodes/<id>/post.md             该期文案：正文（6 行大白话）与 Prompt 模板
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const episodes = JSON.parse(readFileSync(join(ROOT, 'episodes/episodes.json'), 'utf8'));

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

rmSync(join(ROOT, 'demos'), { recursive: true, force: true });
mkdirSync(join(ROOT, 'demos'), { recursive: true });
mkdirSync(join(ROOT, 'data'), { recursive: true });

const terms = [];
for (const ep of episodes) {
  const html = readFileSync(join(ROOT, 'episodes', ep.id, 'index.html'), 'utf8');
  const { lines, prompts } = parsePost(readFileSync(join(ROOT, 'episodes', ep.id, 'post.md'), 'utf8'));
  const style = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const cells = extractCells(html);
  if (cells.length !== 6) throw new Error(`${ep.id}: 应有 6 个宫格，实际 ${cells.length}`);
  cells.forEach((cell, i) => {
    const en = cell.match(/class="term-en">([^<]+)</)[1];
    const zh = cell.match(/class="term-zh">([^<]+)</)[1];
    const line = lines.find((l) => l.en === en) ?? {};
    const id = `${ep.id}-${i + 1}`;
    writeFileSync(join(ROOT, 'demos', `${id}.html`), demoShell(style, cell, `${en} · ${zh}`));
    terms.push({ id, episode: ep.id, en, zh, say: line.say ?? '', example: line.example ?? '', prompt: prompts[en] ?? '', demo: `demos/${id}.html` });
  });
}

const data = { episodes: episodes.map(({ id, series_no, theme, title, type, keywords }) => ({ id, series_no, theme, title, type, keywords })), terms };
writeFileSync(join(ROOT, 'data/terms.json'), JSON.stringify(data, null, 2));
// 同时输出 .js，方便直接双击 index.html（file:// 下不能 fetch 本地 JSON）
writeFileSync(join(ROOT, 'data/terms.js'), `window.GLOSSARY = ${JSON.stringify(data)};\n`);
console.log(`✓ ${episodes.length} 期 / ${terms.length} 个词条`);
