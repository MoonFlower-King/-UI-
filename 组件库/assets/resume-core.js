// 「简历模板」的核心：把一份 Markdown 写的简历解析成结构，再按模板渲染成 A4 网页（能直接打印 / 存 PDF）。
// 两处共用这一个文件：
// - 浏览器：resume.html（在线填写）用 <script> 加载，拿 window.JY_RESUME
// - 构建：resume/cases.mjs 用 node:vm 运行它，生成词典里「简历模板」栏目的 10 个案例
// 所以这里只能写普通脚本（不用 import/export、不碰 DOM），模板样式在 resume-styles.js，示例简历在 resume-sample.js。
//
// 简历的写法（编辑器左边那份文字）：
//   # 名字            > 一句话定位          - 邮箱: xxx（名字下面、第一个 ## 之前的 - 行都是联系方式）
//   ## 板块标题       板块里可以直接写段落、- 列表，或者「- 类别: A, B, C」这种分类清单（技术栈用它）
//   ### 标题 | 副标题 | 2022.03 - 至今 | github.com/x | ★ 1.2k
//                     一段经历 / 一个项目：用 | 分开，带年份的认作时间，像网址的认作链接，★ 开头的认作星标数
//   技术栈: Go, Kafka  写在经历下面，渲染成一排小标签（也认 Stack: / Tech:）
//   行内：**加粗**、`代码`、[文字](链接)
(function (g) {
  'use strict';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  // 行内格式：先转义再替换，用户写的 HTML 不会被执行
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)/g, '<a href="$2">$1</a>');
  const split = (s) => s.split(/\s*[,，、]\s*/).filter(Boolean);
  const KV = /^([^:：]{1,18})[:：]\s*(.+)$/;
  const STACK = /^(技术栈|Tech(?:\s*Stack)?|Stack)\s*[:：]\s*(.+)$/i;
  const DATE = /(19|20)\d{2}|至今|现在|present|now/i;
  const LINK = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/;

  function parse(src) {
    const cv = { name: '', tagline: [], contacts: [], sections: [] };
    let sec = null, ent = null, para = null;
    const target = () => (ent || sec);
    const push = (b) => { const t = target(); if (t) t.blocks.push(b); };
    for (const raw of String(src).split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('<!--')) { para = null; continue; }
      let m;
      if ((m = line.match(/^#\s+(.+)/))) { cv.name = m[1]; para = null; }
      else if ((m = line.match(/^##\s+(.+)/))) { sec = { title: m[1], blocks: [], entries: [] }; cv.sections.push(sec); ent = null; para = null; }
      else if ((m = line.match(/^###\s+(.+)/))) {
        if (!sec) { sec = { title: '', blocks: [], entries: [] }; cv.sections.push(sec); }
        const f = m[1].split(/\s+\|\s+|\s*｜\s*/).map((x) => x.trim()).filter(Boolean);
        ent = { title: f.shift() || '', subs: [], date: '', link: '', star: '', blocks: [], stack: [] };
        for (const x of f) {
          if (!ent.star && /^[★⭐]/.test(x)) ent.star = x.replace(/^[★⭐]\s*/, '');
          else if (!ent.date && DATE.test(x)) ent.date = x;
          else if (!ent.link && LINK.test(x)) ent.link = x;
          else ent.subs.push(x);
        }
        sec.entries.push(ent); para = null;
      } else if ((m = line.match(/^>\s*(.*)/))) { if (!sec) cv.tagline.push(m[1]); else push({ t: 'p', text: m[1] }); para = null; }
      else if ((m = line.match(/^[-*+]\s+(.+)/))) {
        const item = m[1], kv = item.match(KV);
        para = null;
        if (!sec) { if (kv) cv.contacts.push({ k: kv[1].trim(), v: kv[2].trim() }); else cv.contacts.push({ k: '', v: item }); continue; }
        const t = target(), last = t.blocks[t.blocks.length - 1];
        // 「- 类别: A, B」且不在某段经历里 → 分类清单；其他都是普通要点
        if (kv && !ent && !/^https?$/i.test(kv[1])) {
          if (last && last.t === 'kv') last.rows.push([kv[1].trim(), split(kv[2])]); else t.blocks.push({ t: 'kv', rows: [[kv[1].trim(), split(kv[2])]] });
        } else if (last && last.t === 'ul') last.items.push(item);
        else t.blocks.push({ t: 'ul', items: [item] });
      } else if (ent && (m = line.match(STACK))) { ent.stack.push(...split(m[2])); para = null; }
      else if (!sec) { cv.tagline.push(line); }
      else if (para) para.text += ' ' + line;
      else { para = { t: 'p', text: line }; push(para); }
    }
    return cv;
  }

  // 侧栏只放「短」的板块：没有经历条目、没有成段文字、列表每条都很短的（技术栈、语言、证书这类清单）
  // 「短」按显示宽度算：中文字算 2、英文字母算 1，每条不超过 46（大约 23 个汉字）
  const width = (t) => [...t].reduce((n, c) => n + (c.charCodeAt(0) > 0x2E80 ? 2 : 1), 0);
  const isSide = (s) => !s.entries.length && s.blocks.length > 0 && s.blocks.every((b) => b.t === 'kv' || (b.t === 'ul' && b.items.every((x) => width(x) <= 46)));

  /* ---------------- 渲染 ---------------- */
  // 原创线性小图标（24 格），按联系方式的名字认
  const ICON = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    phone: '<path d="M7 3h4l1.5 5-2.5 1.5a11 11 0 0 0 4.5 4.5L16 11.5l5 1.5v4a2 2 0 0 1-2 2A16 16 0 0 1 5 5a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    git: '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="8" r="2.2"/><path d="M6 8.2v7.6M18 10.2c0 4-6 3-10.4 6.6"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5S9.6 5.9 12 3.5z"/>',
    dot: '<circle cx="12" cy="12" r="3"/>',
  };
  const iconOf = (k, v) => {
    const s = (k + ' ' + v).toLowerCase();
    if (/邮|mail|@/.test(s)) return 'mail';
    if (/电话|手机|phone|tel|mobile/.test(s)) return 'phone';
    if (/城市|地址|坐标|location|city|base/.test(s)) return 'pin';
    if (/git/.test(s)) return 'git';
    if (/博客|网站|主页|blog|site|web|http|\./.test(s)) return 'globe';
    return 'dot';
  };
  const svg = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

  const blockHtml = (b) => b.t === 'p' ? `<p>${inline(b.text)}</p>`
    : b.t === 'ul' ? `<ul class="pts">${b.items.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>`
    : `<dl class="kv">${b.rows.map(([k, vs]) => `<div><dt>${inline(k)}</dt><dd>${vs.map((v) => `<span>${inline(v)}</span>`).join('')}</dd></div>`).join('')}</dl>`;
  const entryHtml = (e) => `<div class="en">
      <div class="en-head"><h3 class="en-title">${inline(e.title)}</h3>${e.subs.map((x) => `<span class="en-sub">${inline(x)}</span>`).join('')}${e.link ? `<span class="en-link">${esc(e.link.replace(/^https?:\/\//, ''))}</span>` : ''}${e.star ? `<span class="en-star">★ ${esc(e.star)}</span>` : ''}${e.date ? `<span class="en-date">${esc(e.date)}</span>` : ''}</div>
      ${e.blocks.map(blockHtml).join('')}${e.stack.length ? `<ul class="stack">${e.stack.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    </div>`;
  const secHtml = (s) => `<section class="sec${isSide(s) ? ' sec-list' : ''}">${s.title ? `<h2 class="sec-title">${inline(s.title)}</h2>` : ''}
    ${s.blocks.map(blockHtml).join('')}${s.entries.map(entryHtml).join('')}
  </section>`;
  const contactHtml = (cs) => cs.length ? `<ul class="cv-contact">${cs.map((c) => `<li class="ct">${svg(iconOf(c.k, c.v))}${c.k ? `<b class="ct-k">${esc(c.k)}</b>` : ''}<span class="ct-v">${inline(c.v)}</span></li>`).join('')}</ul>` : '';

  // tpl.layout：single 单栏（板块按原顺序）· side-left / side-right 双栏（短板块进侧栏）；tpl.contactSide：联系方式放侧栏
  function render(cv, tpl, lang) {
    const two = tpl.layout !== 'single';
    const head = `<header class="cv-head"><div class="cv-id"><h1 class="cv-name">${inline(cv.name || ' ')}</h1>${cv.tagline.length ? `<p class="cv-tag">${cv.tagline.map(inline).join('<br>')}</p>` : ''}</div>${two && tpl.contactSide ? '' : contactHtml(cv.contacts)}</header>`;
    let body;
    if (!two) body = `<div class="cv-body"><div class="cv-main">${cv.sections.map(secHtml).join('')}</div></div>`;
    else {
      const side = cv.sections.filter(isSide), main = cv.sections.filter((s) => !isSide(s));
      const aside = `<aside class="cv-side">${tpl.contactSide ? contactHtml(cv.contacts) : ''}${side.map(secHtml).join('')}</aside>`;
      const mainCol = `<div class="cv-main">${main.map(secHtml).join('')}</div>`;
      body = `<div class="cv-body two">${tpl.layout === 'side-left' ? aside + mainCol : mainCol + aside}</div>`;
    }
    return `<article class="cv tpl-${tpl.id} ${tpl.layout}" lang="${lang === 'en' ? 'en' : 'zh-CN'}">${head}${body}</article>`;
  }

  /* ---------------- 所有模板共用的样式 ---------------- */
  // 尺寸按 A4（210mm × 297mm）写；屏幕上窄于纸宽时自动变成单栏，打印时去掉阴影和工具条、保留背景色
  const SANS = '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif';
  const SERIF = 'Georgia, "Times New Roman", "Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", serif';
  const MONO = 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, "Courier New", monospace';
  const BASE_CSS = `* { box-sizing: border-box; }
html, body { margin: 0; }
.cv-desk { min-height: 100vh; padding: 28px 16px; background: #E6E6E9; }
:root {
  /* 所有模板共用的默认值；每个模板只在自己的 :root 里改这几项（一页里只会有一个模板） */
  --paper: #FFFFFF; --ink: #1F2328; --dim: #5B636E; --line: #E3E6EA; --accent: #2563EB; --chip: color-mix(in srgb, var(--accent) 10%, transparent);
  --side-bg: transparent; --side-ink: var(--ink); --side-w: 60mm; --pad: 13mm 15mm;
  --font: ${SANS}; --font-head: var(--font); --mono: ${MONO};
  --size: 12.5px; --name-size: 30px; --head-weight: 700;
  --page-bg: var(--paper);
}
.cv {
  position: relative; width: 210mm; max-width: 100%; min-height: 297mm; margin: 0 auto; padding: var(--pad);
  background: var(--paper); color: var(--ink); font: var(--size)/1.55 var(--font); box-shadow: 0 2px 6px rgba(0,0,0,.08), 0 16px 40px -12px rgba(0,0,0,.25);
  -webkit-font-smoothing: antialiased; overflow-wrap: anywhere;
}
.cv a { color: inherit; text-decoration: none; }
.cv b { font-weight: 650; }
.cv code { padding: 0 4px; border-radius: 3px; background: var(--chip); font: .9em var(--mono); }
.cv p { margin: 1.2mm 0 0; }
.cv svg { flex: none; width: 13px; height: 13px; }
.cv-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 4mm 10mm; margin-bottom: 6mm; padding-bottom: 5mm; border-bottom: 1px solid var(--line); }
.cv-name { margin: 0; font: var(--head-weight) var(--name-size)/1.15 var(--font-head); letter-spacing: .01em; }
.cv-tag { margin: 2mm 0 0; color: var(--dim); font-size: 14px; }
.cv-contact { display: grid; gap: 1mm; margin: 0; padding: 0; list-style: none; color: var(--dim); font-size: 12px; }
.ct { display: flex; align-items: center; gap: 6px; }
.ct svg { color: var(--accent); }
.ct-k { display: none; }
.sec { margin-top: 5mm; }
.cv-main > .sec:first-child, .cv-side > .sec:first-child, .cv-side > .cv-contact + .sec { margin-top: 0; }
.cv-side > .cv-contact + .sec { margin-top: 6mm; }
.sec-title { margin: 0 0 2mm; color: var(--accent); font: 700 12.5px/1.3 var(--font-head); letter-spacing: .1em; text-transform: uppercase; break-after: avoid; }
.en { margin-top: 2.6mm; break-inside: avoid; }
.sec-title + .en { margin-top: 0; }
.en-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 8px; }
.en-title { margin: 0; font: 650 14px/1.45 var(--font-head); }
.en-sub { color: var(--dim); }
.en-sub + .en-sub::before { content: "· "; }
.en-link { color: var(--accent); font: 11.5px var(--mono); }
.en-star { color: var(--dim); font: 11.5px var(--mono); }
.en-date { margin-left: auto; color: var(--dim); font: 11.5px/1.45 var(--mono); white-space: nowrap; }
.pts { margin: 1mm 0 0; padding-left: 1.15em; }
.pts li { margin: .5mm 0; padding-left: .15em; }
.pts li::marker { color: var(--accent); }
.stack { display: flex; flex-wrap: wrap; gap: 4px; margin: 1.6mm 0 0; padding: 0; list-style: none; }
.stack li { padding: 0 6px; border-radius: 4px; background: var(--chip); font: 11px/1.75 var(--mono); }
.kv { display: grid; gap: 1.2mm; margin: 0; }
.kv div { display: grid; grid-template-columns: 6.5em 1fr; gap: 8px; }
.kv dt { font-weight: 650; }
.kv dd { margin: 0; color: var(--dim); }
.kv dd span + span::before { content: " · "; color: var(--line); }
.cv-body.two { display: grid; grid-template-columns: minmax(0, 1fr) var(--side-w); gap: 9mm; }
.side-left .cv-body.two { grid-template-columns: var(--side-w) minmax(0, 1fr); }
.cv-side { color: var(--side-ink); }
.cv-side .kv div { grid-template-columns: 1fr; gap: 0; }
.cv-side .kv dd span { display: inline-block; margin: 2px 4px 0 0; padding: 0 6px; border-radius: 4px; background: var(--chip); font: 11px/1.75 var(--mono); color: inherit; }
.cv-side .kv dd span + span::before { content: none; }
.cv-side .cv-contact { gap: 1.6mm; }
.cv-side .ct { align-items: flex-start; }
.cv-side .ct svg { margin-top: 3px; }
/* 屏幕上比纸窄（手机）：变成单栏，内边距收小 */
@media screen and (max-width: 760px) {
  .cv { --pad: 22px 20px; min-height: 0; }
  .cv-body.two, .side-left .cv-body.two { grid-template-columns: 1fr; }
  .cv-head { align-items: flex-start; }
}
/* 打印 / 存 PDF：A4、无页边距（背景色能铺满），去掉阴影和工具条，保留背景色 */
@page { size: A4; margin: 0; }
@media print {
  /* 纸张颜色铺到每一页（第二页、第三页也是同样的底色和侧栏） */
  html, body { background: var(--page-bg) !important; }
  .cv-desk { min-height: 0; padding: 0; background: none; }
  /* 一页写不下时，第二页开头也留出同样的上下边距（clone：每一页都重复内边距和背景） */
  .cv { width: 210mm; max-width: none; margin: 0; box-shadow: none; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .cv, .cv * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .no-print { display: none !important; }
}`;

  g.JY_RESUME = { parse, render, isSide, BASE_CSS, FONTS: { SANS, SERIF, MONO } };
})(typeof window !== 'undefined' ? window : globalThis);
