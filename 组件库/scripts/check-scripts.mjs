#!/usr/bin/env node
// 检查网页脚本有没有语法错误，不用打开浏览器。npm run build 最后会跑它，PR 的自动检查也就带上了。
// 做法：按每个页面里 <script> 的先后顺序，把它引用的脚本（assets/ 下的，和写在页面里的）拼成一整段让 Node 编译一遍。
// 同一页面的普通脚本共用一套全局名字，所以两个文件各写一个 const $ 这类「重复声明」也能查出来。
// 只编译、不运行；data/ 下的生成物（都是一行赋值）不查。
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PAGES = ['组件库/index.html', '组件库/prompts.html', '图鉴网站（开源）/index.html'];
let bad = 0;
for (const page of PAGES) {
  const html = readFileSync(join(REPO, page), 'utf8');
  const parts = [];
  for (const m of html.matchAll(/<script(?:\s+src="([^"]+)")?[^>]*>([\s\S]*?)<\/script>/g)) {
    const [, src, inline] = m;
    if (src?.startsWith('data/')) continue;
    parts.push(src ? [src, readFileSync(join(REPO, dirname(page), src), 'utf8')] : ['页面内联脚本', inline]);
  }
  // 每段前面记下行号，报错时换算回是哪个文件第几行
  let line = 1; const starts = [];
  const code = parts.map(([name, js]) => { starts.push([line, name]); line += js.split('\n').length; return js; }).join('\n');
  try { new Script(code, { filename: page }); }
  catch (e) {
    const at = +(e.stack.match(/:(\d+)\n/)?.[1] || 0);
    const [from, name] = starts.filter(([l]) => l <= at).at(-1) || [1, '?'];
    console.error(`✗ ${page} 的脚本有语法错误：${name} 第 ${at - from + 1} 行：${e.message}`);
    bad++;
  }
}
if (bad) process.exit(1);
console.log(`✓ ${PAGES.length} 个页面的脚本语法检查通过`);
