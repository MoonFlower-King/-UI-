#!/usr/bin/env node
// 把一期的「动画网页.html」逐帧渲染成成片：横屏/竖屏两版 MP4 + 两张封面 PNG。
//
// 用法：node render.mjs "<期目录>/<主题> 动画网页.html" [--only landscape|portrait] [--cover-only] [--cover-at 2.4]
//
// 输出（与 HTML 同目录，文件名沿用既有命名）：
//   <主题>（横屏 16比10）.mp4   1920×1200  60fps  12s（4s 主时钟 × 3 圈）
//   <主题>（竖屏 9比16）.mp4    1080×1920  60fps  12s
//   <主题> 封面（横屏）.png / <主题> 封面（竖屏）.png   取循环第 2.4s（60%）的那一帧
//
// 原理：动画是纯 CSS，用 Web Animations API 把所有动画暂停并拨到第 N 帧的时间点再截图，
// 帧帧精确、不丢帧，与电脑性能无关。依赖：Node 18+、playwright（含 Chromium）、ffmpeg。
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { try { ({ chromium } = require('playwright')); }
  catch { console.error('找不到 playwright：先运行 npm i -D playwright && npx playwright install chromium'); process.exit(1); } }

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i < 0 ? d : args[i + 1]; };
const file = args.find((a) => a.endsWith('.html'));
if (!file) { console.error('用法：node render.mjs "<主题> 动画网页.html" [--only landscape|portrait] [--cover-only]'); process.exit(1); }

const FPS = 60, CLOCK = 4, LOOPS = 3;
const COVER_AT = Number(opt('--cover-at', 2.4));
const html = resolve(file);
const dir = dirname(html);
const theme = basename(html).replace(/\s*动画网页\.html$/, '');

const MODES = {
  landscape: { hash: '', viewport: { width: 1700, height: 1100 }, scale: 1.2, video: `${theme}（横屏 16比10）.mp4`, cover: `${theme} 封面（横屏）.png` },
  portrait:  { hash: '#portrait', viewport: { width: 1200, height: 2000 }, scale: 1, video: `${theme}（竖屏 9比16）.mp4`, cover: `${theme} 封面（竖屏）.png` },
};
const only = opt('--only');
const coverOnly = args.includes('--cover-only');

const browser = await chromium.launch();
for (const [name, m] of Object.entries(MODES)) {
  if (only && only !== name) continue;
  const page = await browser.newPage({ viewport: m.viewport, deviceScaleFactor: m.scale });
  await page.goto(pathToFileURL(html).href + m.hash);
  await page.evaluate(() => document.fonts.ready);
  const stage = await page.$('#stage');
  const seek = (sec) => page.evaluate((ms) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms; }), sec * 1000);

  await seek(COVER_AT);
  await stage.screenshot({ path: join(dir, m.cover) });
  console.log(`✓ ${m.cover}`);
  if (coverOnly) { await page.close(); continue; }

  const total = FPS * CLOCK * LOOPS;
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-movflags', '+faststart', join(dir, m.video)], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, fail) => ff.on('close', (c) => (c ? fail(new Error(`ffmpeg 退出码 ${c}`)) : ok())));
  for (let i = 0; i < total; i++) {
    await seek(i / FPS);
    const buf = await stage.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 60 === 59) process.stdout.write(`\r  ${name} ${i + 1}/${total}`);
  }
  ff.stdin.end();
  await done;
  console.log(`\r✓ ${m.video}            `);
  await page.close();
}
await browser.close();
