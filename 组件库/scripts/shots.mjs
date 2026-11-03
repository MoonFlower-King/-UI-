#!/usr/bin/env node
// 批量截图 + 拼总览图：每批新增组件、风格、后台页面之后，用它一眼检查有没有排版问题。
// 直接读源文件（不用先 build），截图和总览图放在 组件库/.shots/（已 gitignore）。
//
// 用法（在仓库根目录）：
//   npm run shots -- ui auto-fit-grid form-wizard        组件：按文件名，或写主题 id（如 form）截整个主题
//   npm run shots -- web chidu celtic@poster              调配台词条：按文件名，@版式 可以临时换版式试看
//   npm run shots -- web web-east                         写分组 id 截整组
//   npm run shots -- web web-east --at=0.5                网站风格会自动滚动，--at 指定截第几成（0~1）的画面
//   npm run shots -- admin dashboard clay                 管理后台：id 里包含任一关键词的整页（如 admin-users-clay）
//   加 --mobile 用手机宽度（390）截管理后台和组件
// 截图时页面报的 JS 错误会直接打印出来。
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { try { ({ chromium } = require('playwright')); }
  catch { console.error('找不到 playwright：先运行 npm run setup'); process.exit(1); } }

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, '.shots');
const [kind, ...rest] = process.argv.slice(2);
const flags = Object.fromEntries(rest.filter((a) => a.startsWith('--')).map((a) => { const [k, v = '1'] = a.slice(2).split('='); return [k, v]; }));
const names = rest.filter((a) => !a.startsWith('--'));
if (!['ui', 'web', 'admin'].includes(kind) || !names.length) {
  console.error('用法：npm run shots -- <ui|web|admin> <名字或分组…> [--at=0.5] [--mobile]（详见 scripts/shots.mjs 开头）');
  process.exit(1);
}
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const META = /^\s*<!--([\s\S]*?)-->\s*/;
const BODY = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';

// 每个要截的东西变成 { name, html, w, h }
function uiShots() {
  const cats = JSON.parse(read('data/categories.json'));
  const ids = names.flatMap((n) => cats.find((c) => c.id === n)?.items || [n]);
  const w = flags.mobile ? 390 : 560;
  return ids.map((id) => ({
    name: id, w, h: 350,
    // 和文档站预览一样：浅灰底、居中
    html: `${BODY}<style>html,body{height:100%}body{margin:0;min-height:100%;display:grid;place-items:center;background:#FAFAFA;color:#18181B;font-family:-apple-system,"Inter","PingFang SC",sans-serif}</style>\n${read(`components/${id}.html`).replace(META, '')}`,
  }));
}

function webShots() {
  const { groups } = JSON.parse(read('data/prompt-groups.json'));
  const kit = (k) => read(`prompts/_${k}.css`);
  const list = names.flatMap((n) => groups.find((g) => g.id === n)?.items || [n]);
  const at = parseFloat(flags.at || 0);
  return list.map((n) => {
    const [id, lay] = n.split('@');
    const raw = read(`prompts/${id}.html`), meta = JSON.parse(raw.match(META)[1]);
    const g = groups.find((x) => x.items.includes(id));
    // 还没登记到分组的新词条（通常就是登记前先截图检查）：网站风格默认用书房舞台，个人网站用个人主页舞台
    const stage = g?.stage || { 'site-kit': 'site', 'blog-kit': 'blog' }[meta.kit] || '';
    if (!g) console.log(`· ${id} 还没在 data/prompt-groups.json 登记${stage ? '，先用对应舞台截图' : ''}`);
    const layout = lay || meta.layout;
    // 和 assets/prompts.js 的拼法一致：舞台 → kit → 版式 → 词条自己的 CSS，放进 Shadow DOM
    const inner = `<style>:host{all:initial;display:block;position:relative;width:100%;height:100%;overflow:hidden;background:#FAFAFA;color:#18181B;font-family:-apple-system,"Inter","PingFang SC",sans-serif}</style>`
      + (stage ? read(`prompts/_${stage}.html`) : '') + '\n'
      + (meta.kit ? `<style>${kit(meta.kit)}</style>` : '') + (layout ? `<style>${kit(`layout-${layout}`)}</style>` : '') + raw.replace(META, '');
    return {
      name: n, w: 560, h: 350,
      html: `${BODY}<body style="margin:0"><div id="h" style="width:560px;height:350px"></div><script>
const h = document.getElementById('h'); h.attachShadow({ mode: 'open' }).innerHTML = ${JSON.stringify(inner).replace(/<\/script/g, '<\\/script')};
h.shadowRoot.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = ${at} * (a.effect.getTiming().duration || 0); });
</script>`,
    };
  });
}

async function adminShots() {
  const { adminCases } = await import(pathToFileURL(join(ROOT, 'admin/pages.mjs')));
  const w = flags.mobile ? 390 : 1040;
  return adminCases().filter((c) => names.some((n) => c.id.includes(n))).map((c) => ({
    name: c.id, w, h: flags.mobile ? 900 : 720,
    html: `${BODY}<style>html,body{margin:0;height:100%}</style>${c.code}`,
  }));
}

const shots = kind === 'ui' ? uiShots() : kind === 'web' ? webShots() : await adminShots();
if (!shots.length) { console.error('没有匹配到任何东西'); process.exit(1); }

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'img'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
let errs = [];
page.on('pageerror', (e) => errs.push(e.message));
const files = [];
for (const s of shots) {
  await page.setViewportSize({ width: s.w, height: s.h });
  const tmp = join(OUT, 'tmp.html');
  writeFileSync(tmp, s.html);
  await page.goto(pathToFileURL(tmp).href);
  await page.waitForTimeout(kind === 'ui' ? 1200 : 300);
  if (errs.length) { console.log(`✗ ${s.name}：${errs.join('；')}`); errs = []; }
  const file = `img/${s.name.replace(/[^\w.-]/g, '_')}.png`;
  await page.screenshot({ path: join(OUT, file) });
  files.push([file, s.name, s.w]);
}
// 总览图：两列，每张最多 8 格，桌面后台截图缩到一半宽
const cell = Math.min(files[0][2], 560);
const per = 8;
for (let i = 0; i < files.length; i += per) {
  const sheet = join(OUT, 'sheet.html');
  writeFileSync(sheet, `<body style="margin:0;display:grid;grid-template-columns:repeat(2,${cell}px);gap:4px;background:#888">${files.slice(i, i + per).map(([f, n]) =>
    `<div style="position:relative"><img src="${f}" style="display:block;width:${cell}px"><span style="position:absolute;right:4px;bottom:4px;padding:1px 5px;background:#000;color:#fff;font:12px sans-serif">${n}</span></div>`).join('')}</body>`);
  await page.setViewportSize({ width: cell * 2 + 4, height: 400 });
  await page.goto(pathToFileURL(sheet).href);
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(OUT, `sheet-${i / per + 1}.png`), fullPage: true });
}
await browser.close();
rmSync(join(OUT, 'tmp.html'), { force: true });
rmSync(join(OUT, 'sheet.html'), { force: true });
const sheets = readdirSync(OUT).filter((f) => f.startsWith('sheet-'));
console.log(`✓ 截了 ${files.length} 张，总览图 ${sheets.length} 张：${sheets.map((f) => join(basename(ROOT), '.shots', f)).join('、')}`);
