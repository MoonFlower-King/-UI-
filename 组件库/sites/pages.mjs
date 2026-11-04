// 「个人网站」整页案例的生成器：页面模板（这里）× 风格（styles.mjs）。做法和 admin/ 一样：
// 页面 HTML 只认 CSS 变量和共用类名（.top .hero .title .card .ph …），风格只改变量、版式开关（mods）和少量专属细节（extra），
// 所以加一种风格只要在 styles.mjs 里加一项，并在 pages 里挑它最合适的几种页面。
// 生成的代码自包含（变量、骨架、页面样式、脚本都在一段里），访客复制走就能直接跑。
// 全部文案、人物、作品都是虚构的；插图是纯 CSS 画的抽象图（.ph），不用任何外部图片和字体。
import { styles, FONTS } from './styles.mjs';

/* ---------------- 图标（原创线性图标，24 格） ---------------- */
const P = {
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  rss: '<path d="M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8"/><circle cx="6" cy="18" r="1.2"/>',
  camera: '<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  pen: '<path d="m15 4 5 5L9 20H4v-5z"/><path d="m13 6 5 5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  out: '<path d="M8 16 16 8M9 8h7v7"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5S9.6 5.9 12 3.5z"/>',
  cup: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5c0 1.5 1 1.5 1 3M12 3.5c0 1.5 1 1.5 1 3"/>',
  book: '<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.3-4.3"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19 13 11"/>',
  down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
};
const ico = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

/* ---------------- 虚构人物和内容 ---------------- */
// 苏遥：住在杭州的界面设计师，也写前端。名字、作品、公司、学校、书名、域名全是编的（域名用保留的 .example）。
const NAME = '苏遥';
const MAIL = 'hi@suyao.example';
const POSTS = [
  ['设计', '2026-10-28', '把设置页做短的七个办法', '设置项越多，越没人改。我把一个 46 项的设置页删到 19 项，记下每一次取舍。', '6 分钟', 'k1'],
  ['折腾', '2026-10-12', '在一台旧笔记本上跑起这个小站', '一块旧电池、一个纯静态生成器和一条省电的定时任务，整个站点一年电费不到十块。', '4 分钟', 'k4'],
  ['读书', '2026-10-03', '十月读书：慢一点的东西', '这个月读了三本书，都在讲同一件事：好东西需要等。', '8 分钟', 'k3'],
  ['设计', '2026-09-21', '给按钮起名字，比画按钮难', '「确定」「好的」「保存」到底用哪个？我整理了一份按钮文案清单。', '5 分钟', 'k2'],
  ['生活', '2026-09-02', '一年只用一支笔', '从十几支笔减到一支之后，写字反而变多了。', '3 分钟', 'k6'],
];
const TAGS = [['设计', 12], ['前端', 8], ['读书', 6], ['生活', 9], ['折腾', 5]];
const WORKS = [
  ['潮汐记账 App 改版', '2026', 'App', 'k1', '把记一笔账从 5 步改成 2 步'],
  ['山居民宿品牌', '2025', '品牌', 'k6', '标志、导视和一整套小册子'],
  ['城市步行地图', '2025', '插画', 'k4', '手绘 12 条街区散步路线'],
  ['「一页」笔记工具', '2024', 'Web', 'k2', '只有一页的笔记本，打开就能写'],
  ['茶事展览视觉', '2024', '品牌', 'k3', '一场关于秋茶的小型展览'],
  ['小字体实验', '2023', 'Web', 'k5', '给小屏幕设计的 9px 像素字'],
];
const PHOTOS = [
  ['江边', '晨雾里的渡口', 'k1', 'tall'], ['街巷', '午后两点的弄堂', 'k5', ''], ['山里', '茶园的坡', 'k6', ''],
  ['江边', '退潮', 'k4', ''], ['街巷', '修车铺的招牌', 'k2', 'tall'], ['山里', '雨后的石阶', 'k3', ''],
  ['江边', '六点的桥', 'k6', ''], ['山里', '竹林', 'k1', ''], ['街巷', '晾衣绳', 'k3', 'tall'],
];
const ISSUES = [
  ['86', '11-01', '好的空状态长什么样', '空状态 · 插图 · 文案'],
  ['85', '10-25', '表单报错，别再全标红', '表单 · 报错'],
  ['84', '10-18', '十个让人想点的按钮', '按钮 · 微交互'],
  ['83', '10-11', '深色模式不是把白变黑', '深色模式 · 配色'],
  ['82', '10-04', '加载的时候，用户在想什么', '加载 · 骨架屏'],
];

const brand = '<a class="brand" href="#"><span class="mark">遥</span><span class="brand-name">苏遥</span></a>';
function top(on, action = '') {
  const items = [['home', '首页'], ['blog', '文章'], ['works', '作品'], ['photo', '摄影'], ['about', '关于']];
  return `<header class="top">
    ${brand}
    <nav class="nav">${items.map(([k, t]) => `<a href="#"${k === on ? ' class="on"' : ''}>${t}</a>`).join('')}</nav>${action ? `\n    ${action}` : ''}
  </header>`;
}
const foot = (extra = '') => `<footer class="foot"><div class="wrap"><span>© 2026 ${NAME} · 文字采用 CC BY-NC 4.0</span>${extra}<span class="foot-links"><a href="#">RSS</a><a href="#">邮件</a><a href="#">回到顶部</a></span></div></footer>`;
// 版式开关只用在合适的页面上：竖栏导航不给链接页（没有导航）和数字花园（本来就是三栏），卡片列表只有博客首页有
const modsFor = (s, page) => (s.mods || []).filter((m) => !(m === 'navside' && ['links', 'garden'].includes(page.id)) && !(m === 'cards' && page.id !== 'blog') && !(m === 'center' && !['home', 'blog', 'weekly', 'photo'].includes(page.id)));
const site = (s, page, body) => `<div class="site ${['pg-' + page.id, ...modsFor(s, page)].join(' ')}">
  ${body}
</div>`;

/* ---------------- 共用骨架：变量 + 外壳 + 通用元素 ---------------- */
function rootVars(s) {
  const v = {
    bg2: 'color-mix(in srgb, var(--text) 4%, var(--bg))', card: 'var(--bg)', 'top-bg': 'var(--bg)', hover: 'color-mix(in srgb, var(--text) 6%, transparent)',
    tag: 'color-mix(in srgb, var(--text) 7%, transparent)', 'on-accent': '#FFFFFF', line: 'color-mix(in srgb, var(--text) 14%, transparent)',
    radius: '12px', 'radius-sm': '8px', 'radius-btn': 'var(--radius-sm)', shadow: 'none', bw: '1px', 'av-text': '#FFFFFF',
    'head-weight': '700', 'head-track': '0', 'head-case': 'none', size: '15px', leading: '1.75', max: '1040px', 'title-size': '60px', ...s.v,
  };
  for (const k of ['font', 'head', 'meta', 'scheme']) delete v[k];
  v.font = FONTS[s.v.font || 'sans'];
  v['font-head'] = FONTS[s.v.head || s.v.font || 'sans'];
  v['font-meta'] = FONTS[s.v.meta || s.v.font || 'sans'];
  const order = ['bg', 'bg2', 'card', 'top-bg', 'text', 'dim', 'line', 'hover', 'tag', 'accent', 'on-accent', 'a1', 'a2', 'a3', 'av-text',
    'radius', 'radius-sm', 'radius-btn', 'shadow', 'bw', 'font', 'font-head', 'font-meta', 'head-weight', 'head-track', 'head-case', 'size', 'leading', 'max', 'title-size'];
  const miss = order.filter((k) => v[k] == null);
  if (miss.length) throw new Error(`sites/styles.mjs：「${s.zh}」缺少变量 ${miss.join('、')}`);
  return `:root {\n  /* 「${s.zh}」风格：换风格只改这一段变量 */\n${order.map((k) => `  --${k}: ${v[k]};`).join('\n')}\n}`;
}

const BASE = `* { box-sizing: border-box; }
html, body { height: 100%; margin: 0; }
.site { display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; background: var(--bg); color: var(--text); font: var(--size)/var(--leading) var(--font); text-align: left; -webkit-font-smoothing: antialiased; }
.scroll { position: relative; flex: 1; min-height: 0; overflow-x: hidden; overflow-y: auto; scrollbar-width: thin; }
.wrap { width: min(100% - 64px, var(--max)); margin: 0 auto; }
a { color: inherit; text-decoration: none; }
svg { flex: none; width: 18px; height: 18px; }
button, input { font: inherit; color: inherit; }
p { margin: 0 0 1em; }

/* 顶栏：默认横在上面；mods 里写 navside 就变成左侧竖栏 */
.top { position: relative; z-index: 3; display: flex; align-items: center; gap: 28px; flex: none; height: 64px; padding: 0 max(32px, (100% - var(--max)) / 2); background: var(--top-bg); border-bottom: var(--bw) solid var(--line); }
.brand { display: flex; align-items: center; gap: 10px; font: var(--head-weight) 17px/1 var(--font-head); letter-spacing: var(--head-track); white-space: nowrap; }
.mark { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--accent); color: var(--on-accent); font-size: 14px; }
.nav { display: flex; gap: 2px; margin-left: auto; }
.nav a { padding: 6px 12px; border-radius: var(--radius-sm); color: var(--dim); font-size: 14px; white-space: nowrap; transition: color .15s, background .15s; }
.nav a:hover { color: var(--text); background: var(--hover); }
.nav a.on { color: var(--text); font-weight: 600; }
.navside { flex-direction: row; }
.navside > .top { flex-direction: column; align-items: stretch; gap: 22px; width: 220px; height: auto; padding: 36px 22px; border-bottom: 0; border-right: var(--bw) solid var(--line); }
.navside > .top .nav { flex-direction: column; margin: 0; }
.navside > .top > .btn { margin-top: auto; }

/* 通用元素 */
.hero { padding: 76px 0 52px; }
.kicker { color: var(--accent); font: 600 13px/1.4 var(--font-meta); letter-spacing: .12em; text-transform: uppercase; }
.title { margin: 14px 0 18px; font: var(--head-weight) var(--title-size)/1.12 var(--font-head); letter-spacing: var(--head-track); text-transform: var(--head-case); text-wrap: balance; }
.lead { max-width: 34em; margin: 0; color: var(--dim); font-size: 18px; line-height: 1.7; }
.center .hero { text-align: center; }
.center .hero .lead { margin-inline: auto; }
.center .hero .row { justify-content: center; }
.row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.h2 { margin: 0 0 18px; font: var(--head-weight) 22px/1.3 var(--font-head); letter-spacing: var(--head-track); text-transform: var(--head-case); }
.meta { color: var(--dim); font: 13px/1.5 var(--font-meta); }
.card { background: var(--card); border: var(--bw) solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 42px; padding: 0 20px; border: var(--bw) solid var(--line); border-radius: var(--radius-btn); background: var(--card); color: var(--text); font-size: 14px; font-weight: 600; white-space: nowrap; cursor: pointer; transition: transform .15s, filter .15s, background .15s; }
.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(1px); }
.btn.pri { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
.btn.pri:hover { filter: brightness(1.08); }
.btn.sm { height: 34px; padding: 0 14px; font-size: 13px; }
.btn svg { width: 16px; height: 16px; }
.tag { display: inline-flex; align-items: center; height: 24px; padding: 0 10px; border-radius: 99px; background: var(--tag); color: var(--dim); font-size: 12px; white-space: nowrap; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chips button { height: 32px; padding: 0 14px; border: var(--bw) solid var(--line); border-radius: 99px; background: none; color: var(--dim); font-size: 13px; cursor: pointer; transition: all .15s; }
.chips button:hover { color: var(--text); }
.chips button[aria-pressed="true"] { background: var(--text); border-color: var(--text); color: var(--bg); }
input { height: 42px; padding: 0 14px; border: var(--bw) solid var(--line); border-radius: var(--radius-btn); background: var(--card); outline: none; transition: border-color .15s, box-shadow .15s; }
input::placeholder { color: var(--dim); }
input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
.avatar { display: grid; place-items: center; flex: none; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--a1), var(--a2)); color: var(--av-text); font: 600 22px/1 var(--font-head); }
.foot { padding: 36px 0 44px; border-top: var(--bw) solid var(--line); color: var(--dim); font-size: 13px; }
.foot .wrap { display: flex; flex-wrap: wrap; gap: 12px 24px; justify-content: space-between; }
.foot-links { display: flex; gap: 18px; }
.foot a:hover { color: var(--text); }

/* 插图：纯 CSS 画的抽象画，颜色取 --a1 --a2 --a3，k1~k6 是六种构图 */
.ph { position: relative; overflow: hidden; aspect-ratio: 4 / 3; border-radius: var(--radius-sm); background: var(--a1); isolation: isolate; }
.ph::before, .ph::after { content: ""; position: absolute; }
.k1 { background: linear-gradient(180deg, var(--a2), var(--a1)); }
.k1::before { left: 58%; top: 26%; width: 22%; aspect-ratio: 1; border-radius: 50%; background: var(--a3); }
.k1::after { inset: 58% -5% -5%; background: color-mix(in srgb, var(--a1) 55%, #000); clip-path: polygon(0 40%, 18% 10%, 34% 38%, 52% 0, 72% 34%, 86% 16%, 100% 30%, 100% 100%, 0 100%); opacity: .55; }
.k2 { background: conic-gradient(from 90deg at 42% 58%, var(--a1) 0 25%, var(--a2) 0 50%, var(--a3) 0 75%, color-mix(in srgb, var(--a1) 40%, #fff) 0); }
.k2::after { left: 29%; top: 58%; width: 26%; aspect-ratio: 1; border-radius: 50%; background: color-mix(in srgb, var(--a3) 70%, #fff); translate: 0 -50%; mix-blend-mode: multiply; }
.k3 { background: repeating-linear-gradient(-45deg, var(--a1) 0 14px, color-mix(in srgb, var(--a1) 82%, #fff) 14px 28px); }
.k3::before { inset: 18% 22%; border-radius: 50%; background: var(--a2); }
.k3::after { left: 38%; top: 30%; width: 24%; height: 40%; border-radius: 999px; background: var(--a3); }
.k4 { background: repeating-radial-gradient(circle at 0 100%, var(--a1) 0 18px, var(--a2) 18px 36px); }
.k4::after { right: 12%; top: 16%; width: 18%; aspect-ratio: 1; border-radius: 50%; background: var(--a3); box-shadow: 0 0 0 10px color-mix(in srgb, var(--a3) 30%, transparent); }
.k5 { background: linear-gradient(90deg, color-mix(in srgb, #fff 18%, transparent) 1px, transparent 1px) 0 0 / 12.5% 100%, linear-gradient(color-mix(in srgb, #fff 18%, transparent) 1px, transparent 1px) 0 0 / 100% 16.6%, var(--a2); }
.k5::before { left: 12.5%; top: 33%; width: 50%; height: 50%; background: var(--a1); }
.k5::after { left: 50%; top: 16.6%; width: 25%; height: 33.3%; background: var(--a3); }
.k6 { background: var(--a2); }
.k6::before { left: 30%; right: 30%; top: 22%; bottom: 0; border-radius: 999px 999px 0 0; background: var(--a1); }
.k6::after { left: 44%; top: 40%; width: 12%; aspect-ratio: 1; border-radius: 50%; background: var(--a3); }

@media (max-width: 720px) {
  .top { gap: 12px; height: 56px; padding: 0 18px; }
  .nav { overflow-x: auto; scrollbar-width: none; }
  .nav a { padding: 6px 8px; }
  .top > .btn, .brand-name { display: none; }
  .navside { flex-direction: column; }
  .navside > .top { flex-direction: row; align-items: center; width: auto; height: 56px; padding: 0 18px; border-right: 0; border-bottom: var(--bw) solid var(--line); }
  .navside > .top .nav { flex-direction: row; margin-left: auto; }
  .navside > .top .side-only { display: none; }
  .wrap { width: calc(100% - 36px); }
  .hero { padding: 44px 0 32px; }
  .title { font-size: calc(var(--title-size) * .62); }
  .lead { font-size: 16px; }
}`;

/* ---------------- 页面 1：个人主页 ---------------- */
const home = {
  id: 'home', zh: '个人主页', en: 'Personal Homepage', cat: 'site-home',
  lead: '一个人在网上的「名片」：一句话说清你是谁，再告诉访客你最近在做什么、写了什么、怎么找到你。',
  terms: ['Hero Section 首屏', 'Now Page 「现在」页', 'Personal Site 个人网站'],
  prompt: '个人主页：顶栏左边是圆形字标 + 名字，右边导航「首页 / 文章 / 作品 / 摄影 / 关于」；首屏左边小字「你好，我是」、超大名字、一句介绍（职业、城市、关心什么），下面主按钮「看看作品」和次按钮「写信给我」，右边一幅抽象插画当头像；首屏下方三张「现在」卡片（在做 / 在读 / 在学，各带一个图标和一句话）；再下面「最近写的」三行文章（日期、标题、标签）；最后「找到我」一排链接，带一个点了就复制邮箱的按钮和实时跳动的本地时间。',
  promptEn: 'Personal homepage: a top bar with a round monogram + name on the left and nav "Home / Writing / Work / Photos / About" on the right; the hero has a small "Hi, I\'m" line, a very large name, a one-sentence intro (job, city, what they care about), a primary "See my work" button and a secondary "Write to me" button, with an abstract illustration as the portrait on the right; below, three "Now" cards (Building / Reading / Learning, each with an icon and one sentence); then "Recent writing" as three rows (date, title, tag); finally a "Find me" row of links with a copy-email button and a live local clock.',
  html: () => `${top('home', `<a class="btn sm pri" href="#">${ico('mail')}写信</a>`)}
  <div class="scroll">
    <main class="wrap">
      <section class="hero hm-hero">
        <div class="hm-text">
          <div class="kicker">你好，我是</div>
          <h1 class="title">苏遥</h1>
          <p class="lead">在杭州做界面设计，也写一点前端。喜欢把复杂的东西做得安静、好用，偶尔拍照和散步。</p>
          <div class="row hm-cta"><a class="btn pri" href="#">看看作品${ico('arrow')}</a><a class="btn" href="#">${ico('mail')}写信给我</a></div>
        </div>
        <div class="hm-visual"><div class="hm-art ph {{art}}" role="img" aria-label="抽象插画"></div><span class="hm-badge card"><i></i>2027 年一季度可接新项目</span></div>
      </section>
      <section class="hm-sec">
        <h2 class="h2">现在 <span class="meta">· 2026 年 11 月</span></h2>
        <div class="hm-now">
          <article class="card"><i>${ico('pen')}</i><b>在做</b><p>一个给独立书店用的排班小工具，下个月上线。</p></article>
          <article class="card"><i>${ico('book')}</i><b>在读</b><p>《河流的语法》，读得很慢，每天十页。</p></article>
          <article class="card"><i>${ico('leaf')}</i><b>在学</b><p>轮滑。已经能不扶墙滑过一整条走廊。</p></article>
        </div>
      </section>
      <section class="hm-sec">
        <h2 class="h2">最近写的</h2>
        <ul class="hm-list">
${POSTS.slice(0, 3).map(([tag, date, t]) => `          <li><a href="#"><span class="meta">${date}</span><b>${t}</b><span class="tag">${tag}</span></a></li>`).join('\n')}
        </ul>
      </section>
      <section class="hm-sec hm-find">
        <h2 class="h2">找到我</h2>
        <div class="row">
          <button class="btn" type="button" data-copy="${MAIL}">${ico('mail')}<span>${MAIL}</span></button>
          <a class="btn" href="#">${ico('rss')}RSS 订阅</a>
          <a class="btn" href="#">${ico('camera')}摄影集</a>
          <span class="meta hm-clock">${ico('pin')}杭州 · <span data-clock>--:--</span></span>
        </div>
      </section>
    </main>
    ${foot()}
  </div>`,
  css: `.hm-hero { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 56px; align-items: center; }
.hm-hero .title { font-size: calc(var(--title-size) * 1.45); line-height: 1; }
.hm-cta { margin-top: 30px; }
.hm-visual { position: relative; }
.hm-art { aspect-ratio: 1; border-radius: var(--radius); box-shadow: var(--shadow); }
.hm-badge { position: absolute; left: -24px; bottom: 28px; display: flex; align-items: center; gap: 8px; padding: 10px 16px; font-size: 13px; font-weight: 600; white-space: nowrap; }
.hm-badge i { width: 8px; height: 8px; border-radius: 50%; background: #22C55E; box-shadow: 0 0 0 4px rgba(34,197,94,.2); }
.center .hm-hero { grid-template-columns: 1fr; justify-items: center; gap: 28px; }
.center .hm-visual { order: -1; }
.center .hm-art { width: 180px; border-radius: 50%; }
.center .hm-badge { display: none; }
.hm-sec { padding: 0 0 52px; }
.hm-now { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.hm-now .card { padding: 20px 22px; transition: transform .2s; }
.hm-now .card:hover { transform: translateY(-3px); }
.hm-now i { display: grid; place-items: center; width: 36px; height: 36px; margin-bottom: 14px; border-radius: var(--radius-sm); background: var(--tag); color: var(--accent); }
.hm-now b { display: block; margin-bottom: 4px; font-family: var(--font-head); }
.hm-now p { margin: 0; color: var(--dim); font-size: 14px; }
.hm-list { margin: 0; padding: 0; list-style: none; border-top: var(--bw) solid var(--line); }
.hm-list a { display: grid; grid-template-columns: 110px 1fr auto; gap: 16px; align-items: center; padding: 16px 4px; border-bottom: var(--bw) solid var(--line); transition: padding .2s, background .2s; }
.hm-list a:hover { padding-left: 12px; background: var(--hover); }
.hm-list b { font-weight: 600; }
.hm-clock { display: inline-flex; align-items: center; gap: 6px; margin-left: 6px; }
.hm-clock svg { width: 16px; height: 16px; }
@media (max-width: 720px) {
  .hm-hero, .hm-now { grid-template-columns: 1fr; }
  .hm-visual { order: -1; }
  .hm-art { width: 140px; border-radius: 50%; }
  .hm-badge { display: none; }
  .hm-list a { grid-template-columns: 1fr auto; }
  .hm-list .meta { grid-column: 1 / -1; }
}`,
  js: function () {
    const clock = document.querySelector('[data-clock]');
    const tick = () => { clock.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Shanghai' }); };
    tick(); setInterval(tick, 1000);
    document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', () => {
      const span = b.querySelector('span'), old = span.textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(b.dataset.copy) : Promise.reject()).catch(() => {});
      span.textContent = '已复制邮箱'; setTimeout(() => { span.textContent = old; }, 1400);
    }));
  },
};

/* ---------------- 页面 2：博客首页 ---------------- */
const blog = {
  id: 'blog', zh: '博客首页', en: 'Blog Home', cat: 'site-blog',
  lead: '文章是主角：一句话的自我介绍放在最上面，下面按时间排文章，侧栏放关于我、标签和订阅。',
  terms: ['Blog Layout 博客布局', 'Post List 文章列表', 'Sidebar 侧栏'],
  prompt: '个人博客首页：顶栏是名字 + 导航 + 「订阅」小按钮；首屏一行小字「苏遥的博客 · 第 6 年」、两行大标题「慢慢写，写清楚。」和一句说明；主体左边是「最近文章」，标题右侧一排标签筛选（全部 / 设计 / 读书 / 生活 / 折腾，点了只显示这一类），每篇文章有日期、标题、两行摘要、标签和阅读时长；右边侧栏三块：头像 + 简介的「关于我」、带篇数的标签云、邮箱订阅框（提交后显示「订阅成功」）。',
  promptEn: 'Personal blog home: a top bar with the name, navigation and a small "Subscribe" button; the hero has a small line "Su Yao\'s blog · year 6", a two-line large headline "Write slowly, write clearly." and one sentence of description; the main column is "Recent posts" with tag filters next to the heading (All / Design / Reading / Life / Tinkering, clicking shows only that tag), each post has date, title, a two-line excerpt, tag and reading time; a right sidebar with three blocks: an "About me" card with avatar and bio, a tag cloud with counts, and an email subscribe box that shows "Subscribed" after submitting.',
  html: () => `${top('blog', '<a class="btn sm pri" href="#">订阅</a>')}
  <div class="scroll">
    <main class="wrap">
      <section class="hero bl-hero">
        <div>
          <div class="kicker">苏遥的博客 · 第 6 年</div>
          <h1 class="title">慢慢写，<br>写清楚。</h1>
          <p class="lead">关于界面设计、前端和日常生活的笔记。每月两三篇，不追热点。</p>
        </div>
        <a class="card bl-feature" href="#"><div class="ph {{art}}"></div><span class="meta">精选 · 读的人最多</span><b>把设置页做短的七个办法</b></a>
      </section>
      <div class="bl-grid">
        <section>
          <div class="bl-bar">
            <h2 class="h2">最近文章</h2>
            <div class="chips" role="group" aria-label="按标签筛选">${['全部', '设计', '读书', '生活', '折腾'].map((t, i) => `<button type="button" aria-pressed="${!i}">${t}</button>`).join('')}</div>
          </div>
          <ol class="posts">
${POSTS.map(([tag, date, t, ex, min, k]) => `            <li class="post" data-tag="${tag}"><a href="#">
              <div class="ph ${k} post-ph"></div>
              <time class="meta">${date}</time>
              <div class="post-body"><h3>${t}</h3><p>${ex}</p><div class="meta"><span class="tag">${tag}</span> · ${min}读完</div></div>
            </a></li>`).join('\n')}
          </ol>
        </section>
        <aside class="bl-side">
          <section class="card bl-me"><div class="avatar">遥</div><div><b>苏遥</b><p>界面设计师，也写前端。住在杭州，喜欢散步。</p></div></section>
          <section class="card"><h3>标签</h3><div class="bl-tags">${TAGS.map(([t, n]) => `<a class="tag" href="#">${t}<small>${n}</small></a>`).join('')}</div></section>
          <section class="card"><h3>订阅</h3><p class="meta">有新文章时发一封邮件，没有广告。</p>
            <form class="bl-sub"><input type="email" placeholder="你的邮箱" aria-label="邮箱"><button class="btn pri" type="submit">订阅</button></form></section>
        </aside>
      </div>
    </main>
    ${foot()}
  </div>`,
  css: `.bl-hero { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 56px; align-items: end; }
.bl-feature { display: flex; flex-direction: column; gap: 6px; padding: 12px 12px 16px; rotate: 1.5deg; transition: rotate .3s, transform .3s; }
.bl-feature:hover { rotate: 0deg; transform: translateY(-4px); }
.bl-feature .ph { aspect-ratio: 16 / 10; margin-bottom: 6px; }
.bl-feature .meta, .bl-feature b { padding: 0 4px; }
.bl-feature b { font: var(--head-weight) 17px/1.4 var(--font-head); letter-spacing: var(--head-track); }
.center .bl-hero { grid-template-columns: 1fr; }
.center .bl-feature { display: none; }
.bl-grid { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 56px; padding-bottom: 64px; }
.bl-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
.bl-bar .h2 { margin: 0; }
.posts { margin: 0; padding: 0; list-style: none; }
.post a { display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 20px; padding: 24px 0; border-bottom: var(--bw) solid var(--line); }
.post time { padding-top: 4px; }
.post-ph { display: none; }
.post h3 { margin: 0 0 6px; font: var(--head-weight) 20px/1.4 var(--font-head); letter-spacing: var(--head-track); transition: color .15s; }
.post a:hover h3 { color: var(--accent); }
.post p { display: -webkit-box; margin: 0 0 10px; overflow: hidden; color: var(--dim); -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.post[hidden] { display: none; }
.cards .posts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding-top: 12px; }
.cards .post a { display: flex; flex-direction: column; gap: 10px; height: 100%; padding: 14px 14px 18px; border: var(--bw) solid var(--line); border-radius: var(--radius); background: var(--card); box-shadow: var(--shadow); transition: transform .2s; }
.cards .post a:hover { transform: translateY(-3px); }
.cards .post-ph { display: block; aspect-ratio: 16 / 9; }
.cards .post time { order: 2; padding: 0 4px; }
.cards .post-body { order: 3; padding: 0 4px; }
.bl-side { display: flex; flex-direction: column; gap: 18px; padding-top: 10px; }
.bl-side .card { padding: 20px; }
.bl-side h3 { margin: 0 0 12px; font: var(--head-weight) 15px/1.4 var(--font-head); letter-spacing: var(--head-track); }
.bl-me { display: flex; gap: 14px; align-items: flex-start; }
.bl-me p { margin: 4px 0 0; color: var(--dim); font-size: 14px; }
.bl-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.bl-tags small { margin-left: 5px; opacity: .6; }
.bl-tags a:hover { color: var(--text); }
.bl-sub { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.bl-sub.done::after { content: "✓ 订阅成功，下一篇见"; color: var(--accent); font-size: 13px; }
.bl-sub.done input, .bl-sub.done button { display: none; }
.center .bl-grid { grid-template-columns: minmax(0, 1fr); max-width: 760px; margin: 0 auto; }
.center .bl-side { display: none; }
@media (max-width: 720px) {
  .bl-grid, .bl-hero { grid-template-columns: 1fr; gap: 32px; }
  .bl-feature { display: none; }
  .post a { grid-template-columns: 1fr; gap: 4px; }
  .cards .posts { grid-template-columns: 1fr; }
}`,
  js: function () {
    const chips = [...document.querySelectorAll('.bl-bar .chips button')];
    chips.forEach((b) => b.addEventListener('click', () => {
      chips.forEach((x) => x.setAttribute('aria-pressed', x === b));
      document.querySelectorAll('.post').forEach((p) => { p.hidden = b.textContent !== '全部' && p.dataset.tag !== b.textContent; });
    }));
    document.querySelector('.bl-sub').addEventListener('submit', (e) => { e.preventDefault(); e.target.classList.add('done'); });
  },
};

/* ---------------- 页面 3：文章页 ---------------- */
const post = {
  id: 'post', zh: '文章页', en: 'Article Page', cat: 'site-post',
  lead: '真正被读的那一页：正文宽度控制在一行 30～40 个字，右边是跟着走的目录，顶上一条细细的阅读进度。',
  terms: ['Reading Progress 阅读进度条', 'Table of Contents 目录', 'Measure 行长'],
  prompt: '博客文章阅读页：顶栏底边有一条随滚动变长的阅读进度条；正文一栏，宽度约 680px（一行 30～40 个汉字），上面是分类 · 日期 · 阅读时长、大标题和一段导语，下面一张插图带图注；正文有小标题、段落、引用块（左边一道主色竖线）、行内代码和深色代码块、列表；右侧目录贴着滚动（sticky），当前读到的小标题高亮，点目录平滑滚到对应位置；文末是标签和「上一篇 / 下一篇」两张卡片。',
  promptEn: 'Blog article page: a reading progress bar along the bottom edge of the top bar that grows as you scroll; one text column about 680px wide (around 65 characters per line) with category · date · reading time, a large title and an intro paragraph, then an illustration with a caption; the body has subheadings, paragraphs, a blockquote with an accent-colored left rule, inline code, a dark code block and a list; a sticky table of contents on the right highlights the current section and smooth-scrolls on click; tags and "Previous / Next" cards at the end.',
  html: () => `${top('blog', '<a class="btn sm" href="#">订阅</a>').replace('</header>', '  <div class="ps-progress" aria-hidden="true"></div>\n  </header>')}
  <div class="scroll">
    <main class="wrap ps-grid">
      <article class="ps-art">
        <div class="meta"><a class="tag" href="#">设计</a> · 2026-10-28 · 6 分钟读完</div>
        <h1 class="title">把设置页做短的七个办法</h1>
        <p class="lead">设置项越多，越没人改。去年我接手一个 46 项的设置页，最后删到 19 项。这篇记下每一次取舍，挑最常用的四条讲。</p>
        <figure><div class="ph {{art}}"></div><figcaption class="meta">图 1：删减前后的设置页，长度只剩原来的四成</figcaption></figure>
        <h2 id="s1">1. 先问：谁会来改它</h2>
        <p>每一个设置项背后都应该站着一个具体的人。如果说不出谁会改、为什么改，它多半只是开发时留下的开关。我给每一项都写了一句「谁、在什么时候、为什么」，写不出来的先放进待删清单。</p>
        <blockquote>好的默认值，比一百个选项更体贴。</blockquote>
        <h2 id="s2">2. 默认值就是设计</h2>
        <p>大部分人一辈子不会打开设置页，所以默认值才是他们真正用到的版本。把 <code>autoSave</code> 默认打开之后，「忘记保存」的反馈从每周十几条降到了零。</p>
        <pre><code>/* 把危险操作放远一点 */
.danger-zone {
  margin-top: 48px;
  border: 1px solid var(--danger);
}</code></pre>
        <h2 id="s3">3. 把危险操作放远一点</h2>
        <p>删除账号、清空数据这类操作单独放到页面最底部的「危险区」，和日常选项隔开，并且要求再输入一次名字确认。</p>
        <ul><li>危险区用红色细框，不用大红底</li><li>按钮文案写清后果：「永久删除 32 篇笔记」</li><li>给一个导出数据的入口</li></ul>
        <h2 id="s4">4. 能自动的就别问</h2>
        <p>时区、语言、深色模式，都可以先跟随系统，只在用户真的想改时给入口。少问一个问题，就少一次打扰。</p>
        <footer class="ps-end">
          <div class="row"><span class="tag">设计</span><span class="tag">设置页</span><span class="tag">减法</span></div>
          <nav class="ps-pager"><a class="card" href="#"><span class="meta">← 上一篇</span><b>在一台旧笔记本上跑起这个小站</b></a><a class="card" href="#"><span class="meta">下一篇 →</span><b>给按钮起名字，比画按钮难</b></a></nav>
        </footer>
      </article>
      <aside class="ps-toc">
        <b class="meta">目录</b>
        <nav>${['先问：谁会来改它', '默认值就是设计', '把危险操作放远一点', '能自动的就别问'].map((t, i) => `<a href="#s${i + 1}" data-to="s${i + 1}"${i ? '' : ' class="on"'}>${t}</a>`).join('')}</nav>
        <div class="ps-author"><div class="avatar">遥</div><div><b>苏遥</b><span class="meta">界面设计师</span></div></div>
      </aside>
    </main>
    ${foot()}
  </div>`,
  css: `.ps-progress { position: absolute; left: 0; bottom: calc(var(--bw) * -1); width: 100%; height: 3px; background: var(--accent); transform: scaleX(0); transform-origin: 0 50%; }
.ps-grid { display: grid; grid-template-columns: minmax(0, 680px) 220px; justify-content: space-between; gap: 56px; padding: 56px 0 64px; }
.ps-art .title { margin: 14px 0 16px; font-size: calc(var(--title-size) * .78); }
.ps-art .lead { margin-bottom: 28px; }
.ps-art figure { margin: 0 0 32px; }
.ps-art .ph { aspect-ratio: 16 / 8; }
.ps-art figcaption { margin-top: 10px; text-align: center; }
.ps-art h2 { margin: 40px 0 14px; font: var(--head-weight) 24px/1.35 var(--font-head); letter-spacing: var(--head-track); scroll-margin-top: 24px; }
.ps-art p, .ps-art li { font-size: 16.5px; line-height: 1.9; }
.ps-art blockquote { margin: 28px 0; padding: 4px 0 4px 22px; border-left: 3px solid var(--accent); font: 500 20px/1.6 var(--font-head); }
.ps-art code { padding: 2px 6px; border-radius: 5px; background: var(--tag); font: .88em/1 ui-monospace, "SF Mono", Menlo, Consolas, monospace; }
.ps-art pre { margin: 24px 0; padding: 18px 20px; overflow-x: auto; border-radius: var(--radius-sm); background: #16181D; color: #E6E2D6; }
.ps-art pre code { padding: 0; background: none; font-size: 13.5px; line-height: 1.7; }
.ps-art ul { padding-left: 1.2em; }
.ps-end { margin-top: 44px; padding-top: 24px; border-top: var(--bw) solid var(--line); }
.ps-pager { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 22px; }
.ps-pager a { display: flex; flex-direction: column; gap: 4px; padding: 16px 18px; transition: transform .2s; }
.ps-pager a:last-child { text-align: right; }
.ps-pager a:hover { transform: translateY(-2px); }
.ps-toc { position: sticky; top: 32px; align-self: start; display: flex; flex-direction: column; gap: 12px; }
.ps-toc nav { display: flex; flex-direction: column; border-left: var(--bw) solid var(--line); }
.ps-toc nav a { margin-left: calc(var(--bw) * -1); padding: 6px 0 6px 14px; border-left: 2px solid transparent; color: var(--dim); font-size: 14px; line-height: 1.5; transition: color .15s, border-color .15s; }
.ps-toc nav a:hover { color: var(--text); }
.ps-toc nav a.on { border-left-color: var(--accent); color: var(--text); font-weight: 600; }
.ps-author { display: flex; gap: 10px; align-items: center; margin-top: 18px; }
.ps-author .avatar { width: 40px; height: 40px; font-size: 16px; }
.ps-author b, .ps-author span { display: block; line-height: 1.4; }
@media (max-width: 720px) {
  .ps-grid { grid-template-columns: 1fr; padding-top: 32px; }
  .ps-toc { display: none; }
  .ps-pager { grid-template-columns: 1fr; }
}`,
  js: function () {
    const sc = document.querySelector('.scroll'), bar = document.querySelector('.ps-progress');
    const links = [...document.querySelectorAll('.ps-toc [data-to]')];
    const heads = links.map((a) => document.getElementById(a.dataset.to));
    const sync = () => {
      const max = sc.scrollHeight - sc.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? sc.scrollTop / max : 0})`;
      let cur = 0; heads.forEach((h, i) => { if (h.offsetTop - sc.scrollTop < sc.clientHeight * .35) cur = i; });
      links.forEach((a, i) => a.classList.toggle('on', i === cur));
    };
    sc.addEventListener('scroll', sync, { passive: true });
    links.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); sc.scrollTo({ top: heads[i].offsetTop - 24, behavior: 'smooth' }); }));
    sync();
  },
};

/* ---------------- 页面 4：作品集 ---------------- */
const portfolio = {
  id: 'portfolio', zh: '作品集', en: 'Portfolio', cat: 'site-portfolio',
  lead: '让作品自己说话：一句态度鲜明的开场白，然后是大图网格，大小错落，能按类型筛选。',
  terms: ['Portfolio Grid 作品网格', 'Filter Chips 筛选胶囊', 'Hover Zoom 悬停放大'],
  prompt: '设计师作品集首页：首屏一行小字「作品集 2017—2026」、一句很大的态度宣言「把复杂的事，做得安静。」和一句介绍；下面一排分类筛选（全部 / App / 品牌 / Web / 插画，点了只显示这类）；作品网格是 6 列栅格的错落排法：第一行 4 + 2，第二行三个等宽，最后一个通栏，每个作品是大图 + 名称 + 年份 · 类型 + 一句话，鼠标悬停时图片轻微放大；网格下面一行「合作过」的团队名，最后是「有项目想聊聊？」的联系横幅。',
  promptEn: 'Designer portfolio home: the hero has a small line "Portfolio 2017–2026", a very large statement "Make complex things feel calm." and one line of intro; a row of category filters (All / App / Brand / Web / Illustration, clicking shows only that kind); the work grid uses a 6-column staggered layout: first row 4 + 2, second row three equal tiles, the last one full width; each project has a large image, name, year · type and one sentence, and the image zooms slightly on hover; below the grid a row of "Worked with" team names, then a "Got a project in mind?" contact banner.',
  html: () => `${top('works', `<a class="btn sm pri" href="#">${ico('mail')}约个时间</a>`)}
  <div class="scroll">
    <main class="wrap">
      <section class="hero pf-hero">
        <div>
          <div class="kicker">作品集 2017—2026</div>
          <h1 class="title">把复杂的事，<br>做得安静。</h1>
          <p class="lead">我是苏遥，独立界面设计师。做过记账 App、民宿品牌和几张城市地图，也接小而美的网站。</p>
        </div>
        <dl class="pf-stats"><div><dt>9 年</dt><dd>界面设计</dd></div><div><dt>40+</dt><dd>上线项目</dd></div><div><dt>12</dt><dd>合作团队</dd></div></dl>
      </section>
      <div class="chips pf-chips" role="group" aria-label="按类型筛选">${['全部', 'App', '品牌', 'Web', '插画'].map((t, i) => `<button type="button" aria-pressed="${!i}">${t}</button>`).join('')}</div>
      <div class="pf-grid">
${WORKS.map(([t, y, type, k, one]) => `        <a class="work" href="#" data-type="${type}"><div class="ph ${k}"></div><div class="work-info"><h3>${t}</h3><span class="meta">${y} · ${type}</span></div><p>${one}</p></a>`).join('\n')}
      </div>
      <section class="pf-clients"><span class="meta">合作过</span><b>青岚科技</b><b>山居</b><b>木白工作室</b><b>小满书店</b><b>潮汐</b></section>
      <section class="pf-cta card"><div><h2 class="h2">有项目想聊聊？</h2><p class="meta">通常两天内回复。2027 年第一季度还有两个档期。</p></div><a class="btn pri" href="#">${MAIL}${ico('arrow')}</a></section>
    </main>
    ${foot()}
  </div>`,
  css: `.pf-hero { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 48px; align-items: end; padding: 56px 0 36px; }
.pf-hero .title { font-size: calc(var(--title-size) * 1.05); line-height: 1.05; }
.pf-stats { display: flex; gap: 28px; margin: 0; }
.pf-stats div { padding-left: 14px; border-left: var(--bw) solid var(--line); }
.pf-stats dt { font: var(--head-weight) 30px/1.1 var(--font-head); letter-spacing: var(--head-track); }
.pf-stats dd { margin: 4px 0 0; color: var(--dim); font-size: 13px; }
.pf-chips { margin-bottom: 24px; }
.pf-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 28px 24px; }
.work { grid-column: span 2; display: flex; flex-direction: column; gap: 10px; }
.work:nth-child(1) { grid-column: span 4; }
.work:nth-child(6) { grid-column: 1 / -1; }
.work:nth-child(6) .ph { aspect-ratio: 21 / 8; }
.pf-grid.filtered .work { grid-column: span 2; }
.pf-grid.filtered .work .ph { aspect-ratio: 4 / 3; }
.work[hidden] { display: none; }
.work .ph { border-radius: var(--radius); box-shadow: var(--shadow); }
.work:nth-child(1) .ph, .work:nth-child(2) .ph { flex: 1; aspect-ratio: auto; min-height: 300px; }
.pf-grid.filtered .work .ph { height: auto; min-height: 0; }
.work .ph::before, .work .ph::after { transition: scale .5s cubic-bezier(.2, .7, .2, 1); }
.work:hover .ph::before { scale: 1.08; }
.work:hover .ph::after { scale: 1.12; }
.work-info { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.work h3 { margin: 0; font: var(--head-weight) 18px/1.35 var(--font-head); letter-spacing: var(--head-track); }
.work p { margin: -6px 0 0; color: var(--dim); font-size: 14px; }
.pf-clients { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 36px; margin: 56px 0 32px; padding: 22px 0; border-block: var(--bw) solid var(--line); color: var(--dim); }
.pf-clients b { font: var(--head-weight) 17px/1 var(--font-head); opacity: .75; }
.pf-cta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 64px; padding: 30px 32px; }
.pf-cta .h2 { margin-bottom: 4px; }
@media (max-width: 720px) {
  .pf-grid, .pf-hero { grid-template-columns: 1fr; }
  .pf-hero { gap: 24px; }
  .pf-hero .title { font-size: calc(var(--title-size) * .62); }
  .work, .work:nth-child(1), .pf-grid.filtered .work { grid-column: auto; }
  .work:nth-child(1) .ph, .work:nth-child(2) .ph { min-height: 0; aspect-ratio: 4 / 3; }
}`,
  js: function () {
    const chips = [...document.querySelectorAll('.pf-chips button')], grid = document.querySelector('.pf-grid');
    chips.forEach((b) => b.addEventListener('click', () => {
      chips.forEach((x) => x.setAttribute('aria-pressed', x === b));
      const all = b.textContent === '全部';
      grid.classList.toggle('filtered', !all);
      grid.querySelectorAll('.work').forEach((w) => { w.hidden = !all && w.dataset.type !== b.textContent; });
    }));
  },
};

/* ---------------- 页面 5：在线简历 ---------------- */
const resume = {
  id: 'resume', zh: '在线简历', en: 'Online Resume', cat: 'site-resume',
  lead: '一页看完一个人：左边是联系方式和技能，右边按时间倒序写经历，每段经历都能展开看细节。',
  terms: ['Timeline 时间线', 'Two-column Layout 双栏布局', 'Disclosure 展开收起'],
  prompt: '在线简历页：左栏约 300px 是一张资料卡，放头像、名字、职位、联系方式（邮箱、城市、网站，各带图标）、5 项技能进度条（进场时从 0 长到对应长度）和语言；右栏顶部写「简历」大标题、一段简介和「下载 PDF」按钮，下面「经历」是一条竖向时间线，每段经历有年份、职位、公司，点开能看到 2～3 条成果（用 details 展开收起）；再下面「项目」两张小卡片、「教育」一行。',
  promptEn: 'Online resume page: a left column about 300px wide holds a profile card with avatar, name, title, contact info (email, city, website, each with an icon), 5 skill bars that grow from zero on load, and languages; the right column starts with a large "Resume" title, a short summary and a "Download PDF" button, then "Experience" as a vertical timeline where each entry shows years, role and company and expands (details element) to reveal 2–3 achievements; then "Projects" as two small cards and an "Education" line.',
  html: () => `${top('about', `<a class="btn sm" href="#">${ico('down')}PDF</a>`)}
  <div class="scroll">
    <main class="wrap rs-grid">
      <aside class="card rs-side">
        <div class="avatar rs-av">遥</div>
        <h1 class="rs-name">苏遥</h1>
        <p class="meta">界面设计师 · 前端</p>
        <ul class="rs-contact">
          <li>${ico('mail')}${MAIL}</li><li>${ico('pin')}浙江 · 杭州</li><li>${ico('globe')}suyao.example</li>
        </ul>
        <h3>技能</h3>
        <ul class="rs-skills">
${[['交互设计', 95], ['视觉设计', 90], ['原型与动效', 85], ['HTML / CSS', 80], ['用户研究', 70]].map(([t, n]) => `          <li><span>${t}</span><i style="--n:${n}%"></i></li>`).join('\n')}
        </ul>
        <h3>语言</h3>
        <p class="meta">中文（母语）· 英语（工作）· 日语（入门）</p>
      </aside>
      <section class="rs-main">
        <div class="rs-head">
          <div><div class="kicker">简历 · 2026</div><h2 class="title">做了九年界面，<br>还是喜欢做减法。</h2></div>
        </div>
        <p class="lead">先后在工作室和互联网公司做视觉与交互，2023 年起独立接案。擅长把复杂流程理顺，从需求访谈一路做到能上线的前端代码。</p>
        <h3 class="h2 rs-h">经历</h3>
        <ol class="rs-time">
          <li><details open><summary><span class="meta">2023 — 至今</span><b>独立设计师</b><span>自由职业</span></summary><ul><li>为 12 个团队做产品设计，其中 4 个是长期合作</li><li>「潮汐记账」改版后，记一笔账的平均时间从 19 秒降到 7 秒</li></ul></details></li>
          <li><details><summary><span class="meta">2020 — 2023</span><b>高级交互设计师</b><span>青岚科技</span></summary><ul><li>负责企业协作产品的设置中心和权限系统</li><li>建立设计规范，组件复用率从 40% 提到 85%</li></ul></details></li>
          <li><details><summary><span class="meta">2017 — 2020</span><b>视觉设计师</b><span>木白工作室</span></summary><ul><li>做了 30 多个品牌的视觉和官网</li><li>开始自学前端，把自己的设计做成能跑的页面</li></ul></details></li>
        </ol>
        <h3 class="h2 rs-h">项目</h3>
        <div class="rs-proj">
          <a class="card" href="#"><div class="ph k1"></div><div><b>潮汐记账 App 改版</b><span class="meta">2026 · 产品设计</span></div></a>
          <a class="card" href="#"><div class="ph k2"></div><div><b>「一页」笔记工具</b><span class="meta">2024 · 设计 + 前端</span></div></a>
        </div>
        <h3 class="h2 rs-h">教育</h3>
        <p class="rs-edu"><b>东篱艺术学院</b> · 视觉传达设计 · 学士 <span class="meta">2013 — 2017</span></p>
      </section>
    </main>
    ${foot()}
  </div>`,
  css: `.rs-grid { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 56px; align-items: start; padding: 48px 0 64px; }
.rs-side { position: sticky; top: 24px; padding: 28px 26px; }
.rs-av { width: 76px; height: 76px; font-size: 30px; }
.rs-name { margin: 16px 0 2px; font: var(--head-weight) 26px/1.25 var(--font-head); letter-spacing: var(--head-track); }
.rs-side h3 { margin: 24px 0 10px; color: var(--dim); font: 600 12px/1 var(--font-meta); letter-spacing: .12em; text-transform: uppercase; }
.rs-contact { display: flex; flex-direction: column; gap: 8px; margin: 18px 0 0; padding: 18px 0 0; border-top: var(--bw) solid var(--line); list-style: none; font-size: 14px; }
.rs-contact li { display: flex; align-items: center; gap: 10px; }
.rs-contact svg { width: 16px; height: 16px; color: var(--accent); }
.rs-skills { display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 0; list-style: none; font-size: 13px; }
.rs-skills i { display: block; height: 6px; margin-top: 5px; border-radius: 99px; background: var(--tag); overflow: hidden; }
.rs-skills i::after { content: ""; display: block; width: var(--n); height: 100%; border-radius: inherit; background: var(--accent); animation: rs-grow 1.2s cubic-bezier(.2, .7, .2, 1) both; }
@keyframes rs-grow { from { width: 0; } }
.rs-head .title { margin: 12px 0 18px; font-size: calc(var(--title-size) * .8); }
.rs-h { margin-top: 44px; }
.rs-time { margin: 0; padding: 0 0 0 22px; border-left: 2px solid var(--line); list-style: none; }
.rs-time > li { position: relative; padding: 0 0 22px; }
.rs-time > li::before { content: ""; position: absolute; left: -29px; top: 7px; width: 12px; height: 12px; border-radius: 50%; background: var(--bg); border: 2px solid var(--accent); }
.rs-time summary { display: grid; grid-template-columns: 120px 1fr auto; gap: 14px; align-items: baseline; cursor: pointer; list-style: none; }
.rs-time summary::-webkit-details-marker { display: none; }
.rs-time summary b { font-size: 16px; }
.rs-time summary span:last-child { color: var(--dim); }
.rs-time summary:hover b { color: var(--accent); }
.rs-time details ul { margin: 10px 0 0 134px; padding-left: 1.1em; color: var(--dim); font-size: 14px; }
.rs-proj { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.rs-proj a { display: flex; gap: 14px; align-items: center; padding: 12px; transition: transform .2s; }
.rs-proj a:hover { transform: translateY(-2px); }
.rs-proj .ph { width: 88px; flex: none; }
.rs-proj b, .rs-proj span { display: block; }
.rs-edu .meta { margin-left: 8px; }
@media (max-width: 720px) {
  .rs-grid { grid-template-columns: 1fr; gap: 32px; padding-top: 24px; }
  .rs-side { position: static; }
  .rs-time summary { grid-template-columns: 1fr; gap: 0; }
  .rs-time details ul { margin-left: 0; }
  .rs-proj { grid-template-columns: 1fr; }
}`,
  js: function () {},
};

/* ---------------- 页面 6：链接主页 ---------------- */
const links = {
  id: 'links', zh: '链接主页', en: 'Link in Bio', cat: 'site-links',
  lead: '放在社交平台简介里的那一个链接：手机上一屏看完，头像、一句话、一列大按钮，把人送到你想让他去的地方。',
  terms: ['Link in Bio 链接聚合页', 'Stacked Buttons 堆叠按钮', 'Single Column 单栏'],
  prompt: '链接主页（link in bio）：整页居中一栏，宽约 440px，桌面上两侧是装饰背景；从上到下是大头像、名字、@用户名、一句简介和一排小标签；然后一列等宽的大按钮链接（我的博客、作品集、设计周刊《小样》、预约一次咖啡聊天、复制邮箱），每个按钮左边图标、右边箭头，悬停时轻微上浮；其中「周刊」做成带缩略图的特色卡片，写着「第 86 期已发布」；点「复制邮箱」按钮文字变成「已复制 ✓」；底部一排圆形社交图标和一行小字版权。',
  promptEn: 'Link-in-bio page: a single centered column about 440px wide with a decorative background on both sides on desktop; from top to bottom: a large avatar, name, @handle, a one-line bio and a row of small tags; then a column of full-width large link buttons (My blog, Portfolio, the "Xiaoyang" design newsletter, Book a coffee chat, Copy email), each with an icon on the left and an arrow on the right, lifting slightly on hover; the newsletter link is a featured card with a thumbnail saying "Issue 86 is out"; clicking "Copy email" changes its label to "Copied ✓"; a row of round social icons and a tiny copyright line at the bottom.',
  html: () => `<div class="scroll ln-bg">
    <main class="ln">
      <div class="avatar ln-av">遥</div>
      <h1 class="ln-name">苏遥</h1>
      <div class="meta">@suyao · 杭州</div>
      <p class="ln-bio">界面设计师，也写前端。在这里能找到我写的、做的和拍的。</p>
      <div class="ln-tags"><span class="tag">界面设计</span><span class="tag">前端</span><span class="tag">散步摄影</span></div>
      <nav class="ln-list">
        <a class="lk" href="#">${ico('pen')}<span>我的博客<small>每月两三篇，关于设计和生活</small></span>${ico('arrow')}</a>
        <a class="lk" href="#">${ico('grid')}<span>作品集<small>2017—2026 的项目</small></span>${ico('arrow')}</a>
        <a class="lk ln-feature" href="#"><div class="ph {{art}}"></div><span>设计周刊《小样》<small>第 86 期已发布：好的空状态长什么样</small></span>${ico('out')}</a>
        <a class="lk" href="#">${ico('cup')}<span>预约一次咖啡聊天<small>每周四下午，线上 30 分钟</small></span>${ico('arrow')}</a>
        <button class="lk" type="button" data-copy="${MAIL}">${ico('mail')}<span><em>复制邮箱</em><small>${MAIL}</small></span>${ico('arrow')}</button>
      </nav>
      <div class="ln-social">${['mail', 'rss', 'camera', 'globe'].map((n) => `<a href="#" aria-label="${n}">${ico(n)}</a>`).join('')}</div>
      <p class="meta ln-foot">© 2026 苏遥</p>
    </main>
  </div>`,
  css: `.ln-bg { position: relative; display: flex; justify-content: center; background: var(--bg2); }
.ln-bg::before, .ln-bg::after { content: ""; position: absolute; pointer-events: none; }
.ln-bg::before { left: 9%; top: 16%; width: 170px; aspect-ratio: 1; border-radius: 50%; background: var(--a1); opacity: .55; }
.ln-bg::after { right: 10%; top: 50%; width: 140px; aspect-ratio: 1; border-radius: var(--radius); background: var(--a3); opacity: .5; rotate: 14deg; }
.ln { position: relative; z-index: 1; }
@media (max-width: 720px) { .ln-bg::before, .ln-bg::after { display: none; } }
.ln { display: flex; flex-direction: column; align-items: center; width: min(100% - 36px, 440px); padding: 56px 0 40px; text-align: center; }
.ln-av { width: 96px; height: 96px; font-size: 38px; box-shadow: 0 0 0 5px var(--bg), 0 0 0 6px var(--line); }
.ln-name { margin: 18px 0 2px; font: var(--head-weight) 26px/1.25 var(--font-head); letter-spacing: var(--head-track); text-transform: var(--head-case); }
.ln-bio { max-width: 22em; margin: 12px 0 14px; color: var(--dim); }
.ln-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-bottom: 28px; }
.ln-list { display: flex; flex-direction: column; gap: 12px; width: 100%; }
.lk { display: flex; align-items: center; gap: 14px; width: 100%; min-height: 62px; padding: 10px 18px; border: var(--bw) solid var(--line); border-radius: var(--radius); background: var(--card); box-shadow: var(--shadow); color: var(--text); text-align: left; cursor: pointer; transition: transform .2s, border-color .2s; }
.lk:hover { transform: translateY(-2px); border-color: var(--accent); }
.lk:active { transform: translateY(0); }
.lk > svg:first-child { width: 20px; height: 20px; color: var(--accent); }
.lk span { flex: 1; display: flex; flex-direction: column; font-weight: 600; }
.lk em { font-style: normal; }
.lk small { color: var(--dim); font-size: 12.5px; font-weight: 400; }
.lk > svg:last-child { width: 16px; height: 16px; color: var(--dim); transition: transform .2s; }
.lk:hover > svg:last-child { transform: translateX(3px); color: var(--text); }
.ln-feature { padding: 10px; }
.ln-feature .ph { width: 64px; flex: none; aspect-ratio: 1; }
.ln-social { display: flex; gap: 10px; margin-top: 28px; }
.ln-social a { display: grid; place-items: center; width: 42px; height: 42px; border: var(--bw) solid var(--line); border-radius: 50%; background: var(--card); color: var(--dim); transition: color .15s, transform .15s; }
.ln-social a:hover { color: var(--accent); transform: translateY(-2px); }
.ln-foot { margin-top: 18px; }`,
  js: function () {
    document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', () => {
      const em = b.querySelector('em');
      (navigator.clipboard ? navigator.clipboard.writeText(b.dataset.copy) : Promise.reject()).catch(() => {});
      em.textContent = '已复制 ✓'; setTimeout(() => { em.textContent = '复制邮箱'; }, 1400);
    }));
  },
};

/* ---------------- 页面 7：摄影集 ---------------- */
const photo = {
  id: 'photo', zh: '摄影集', en: 'Photo Journal', cat: 'site-photo',
  lead: '照片是唯一的主角：文字缩到最少，瀑布流铺满，点开是全屏大图，可以左右翻。',
  terms: ['Masonry 瀑布流', 'Lightbox 灯箱', 'Tabs 标签页'],
  prompt: '个人摄影集页：顶栏下面一段很短的开场（小字「摄影 · 步行笔记」、标题、一句话说明和照片数量）；一排分组标签（全部 / 江边 / 街巷 / 山里，点了只看这组）；照片用三列瀑布流（CSS columns），高矮错落，每张下面一行小字图注「地点 · 标题」，悬停时照片微微放大、图注变深；点任意一张打开全屏灯箱：深色半透明遮罩、居中大图、底部图注和「3 / 9」计数，左右箭头翻页，点关闭或遮罩退出。',
  promptEn: 'Personal photo journal page: a very short intro under the top bar (small "Photos · Walking notes", a title, one sentence and the photo count); a row of group tabs (All / Riverside / Alleys / Hills, clicking shows only that group); photos in a three-column masonry (CSS columns) of mixed heights with a small caption "place · title" under each, zooming slightly on hover; clicking any photo opens a full-screen lightbox: a dark translucent overlay, a centered large image, caption and a "3 / 9" counter at the bottom, left/right arrows to page through, close button or overlay click to exit.',
  html: () => `${top('photo')}
  <div class="scroll">
    <main class="wrap">
      <section class="hero ph-hero">
        <div class="kicker">摄影 · 步行笔记</div>
        <h1 class="title">住处附近三公里</h1>
        <p class="lead">用一台旧相机，记录每天散步能走到的地方。共 ${PHOTOS.length} 张，持续更新。</p>
      </section>
      <div class="chips ph-tabs" role="group" aria-label="分组">${['全部', '江边', '街巷', '山里'].map((t, i) => `<button type="button" aria-pressed="${!i}">${t}</button>`).join('')}</div>
      <div class="ph-grid">
${PHOTOS.map(([g, t, k, tall], i) => `        <figure class="shot${tall ? ' tall' : ''}" data-g="${g}" data-i="${i}"><div class="ph ${k}"></div><figcaption class="meta">${g} · ${t}</figcaption></figure>`).join('\n')}
      </div>
    </main>
    ${foot()}
  </div>
  <div class="ph-box" hidden>
    <button class="ph-x" type="button" aria-label="关闭">${ico('close')}</button>
    <button class="ph-nav prev" type="button" aria-label="上一张">${ico('left')}</button>
    <figure><div class="ph"></div><figcaption><span></span><b></b></figcaption></figure>
    <button class="ph-nav next" type="button" aria-label="下一张">${ico('right')}</button>
  </div>`,
  css: `.ph-hero { padding-bottom: 32px; }
.ph-hero .title { font-size: calc(var(--title-size) * .9); }
.ph-tabs { margin-bottom: 26px; }
.ph-grid { columns: 3; column-gap: 20px; padding-bottom: 56px; }
.shot { break-inside: avoid; margin: 0 0 22px; cursor: zoom-in; }
.shot[hidden] { display: none; }
.shot .ph { aspect-ratio: 4 / 3; transition: transform .4s cubic-bezier(.2, .7, .2, 1), filter .3s; }
.shot.tall .ph { aspect-ratio: 3 / 4; }
.shot:hover .ph { transform: scale(1.02); filter: brightness(1.05); }
.shot figcaption { margin-top: 8px; transition: color .2s; }
.shot:hover figcaption { color: var(--text); }
.ph-box { position: fixed; inset: 0; z-index: 9; display: grid; grid-template-columns: 64px 1fr 64px; align-items: center; padding: 40px 24px; background: rgba(8, 9, 12, .9); color: #F2EFE8; }
.ph-box[hidden] { display: none; }
.ph-box figure { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 14px; }
.ph-box .ph { width: min(100%, 760px); aspect-ratio: 3 / 2; border-radius: 4px; animation: ph-in .3s ease both; }
@keyframes ph-in { from { opacity: 0; transform: scale(.97); } }
.ph-box figcaption { display: flex; gap: 16px; font-size: 14px; }
.ph-box figcaption span { opacity: .6; }
.ph-box button { display: grid; place-items: center; width: 48px; height: 48px; border: 0; border-radius: 50%; background: rgba(255, 255, 255, .1); color: inherit; cursor: pointer; transition: background .15s; }
.ph-box button:hover { background: rgba(255, 255, 255, .2); }
.ph-x { position: absolute; top: 18px; right: 18px; }
@media (max-width: 720px) {
  .ph-grid { columns: 2; column-gap: 12px; }
  .ph-box { grid-template-columns: 40px 1fr 40px; padding: 16px 8px; }
  .ph-box button { width: 40px; height: 40px; }
}`,
  js: function () {
    const shots = [...document.querySelectorAll('.shot')], box = document.querySelector('.ph-box');
    const big = box.querySelector('.ph'), [num, cap] = box.querySelectorAll('figcaption > *');
    let list = shots, at = 0;
    const show = (i) => {
      at = (i + list.length) % list.length;
      const s = list[at];
      big.className = s.querySelector('.ph').className;
      num.textContent = `${at + 1} / ${list.length}`; cap.textContent = s.querySelector('figcaption').textContent;
      big.style.animation = 'none'; void big.offsetWidth; big.style.animation = '';
    };
    shots.forEach((s) => s.addEventListener('click', () => { list = shots.filter((x) => !x.hidden); show(list.indexOf(s)); box.hidden = false; }));
    box.querySelector('.prev').addEventListener('click', () => show(at - 1));
    box.querySelector('.next').addEventListener('click', () => show(at + 1));
    box.querySelector('.ph-x').addEventListener('click', () => { box.hidden = true; });
    box.addEventListener('click', (e) => { if (e.target === box) box.hidden = true; });
    const tabs = [...document.querySelectorAll('.ph-tabs button')];
    tabs.forEach((b) => b.addEventListener('click', () => {
      tabs.forEach((x) => x.setAttribute('aria-pressed', x === b));
      shots.forEach((s) => { s.hidden = b.textContent !== '全部' && s.dataset.g !== b.textContent; });
    }));
  },
};

/* ---------------- 页面 8：数字花园 ---------------- */
const NOTES = [
  ['设计', [['默认值就是设计', '常青'], ['留白不是空着', '生长中'], ['按钮文案清单', '常青']]],
  ['生活', [['散步路线', '萌芽'], ['一支笔', '常青']]],
  ['读书', [['《河流的语法》摘抄', '生长中'], ['慢一点的东西', '萌芽']]],
];
const garden = {
  id: 'garden', zh: '数字花园', en: 'Digital Garden', cat: 'site-garden',
  lead: '不按时间、按想法连起来的笔记：每篇都会慢慢长大，标着「萌芽 / 生长中 / 常青」，笔记之间用双向链接串起来。',
  terms: ['Digital Garden 数字花园', 'Backlinks 反向链接', 'Three-pane Layout 三栏布局'],
  prompt: '个人数字花园（笔记网站）：三栏布局。左栏是按主题分组的笔记目录，每条后面有成长状态小圆点（萌芽 / 生长中 / 常青），点了高亮；中栏是当前笔记：面包屑、标题、「种下 2025-03 · 上次浇水 2026-10-20」和状态标签，正文里的双向链接写成带下划线的 [[笔记名]]，鼠标悬停弹出这篇笔记的摘要卡片，还有一个提示框；正文下面是「提到这篇的笔记」反向链接卡片；右栏是一张小关系图（SVG 圆点和连线，当前笔记高亮）和「最近浇水」列表。',
  promptEn: 'Personal digital garden (notes site), three panes. Left: a note tree grouped by topic, each note with a growth-stage dot (seedling / budding / evergreen), highlighted on click. Center: the current note with breadcrumbs, title, "Planted 2025-03 · Last tended 2026-10-20" and a stage tag; wiki links in the body are underlined [[note name]] that show a preview card on hover, plus a callout box; below the body, "Notes that link here" backlink cards. Right: a small graph view (SVG dots and lines, the current note highlighted) and a "Recently tended" list.',
  html: () => `${top('blog', `<label class="gd-search">${ico('search')}<input placeholder="搜索笔记" aria-label="搜索笔记"></label>`)}
  <div class="scroll">
    <main class="gd">
      <aside class="gd-tree">
        <b class="meta">笔记 · 41 篇</b>
${NOTES.map(([g, list]) => `        <div class="gd-group"><h4>${g}</h4>${list.map(([t, st]) => `<a href="#" data-st="${st}"${t === '默认值就是设计' ? ' class="on"' : ''}><i></i>${t}</a>`).join('')}</div>`).join('\n')}
        <p class="meta gd-legend"><i data-st="萌芽"></i>萌芽 <i data-st="生长中"></i>生长中 <i data-st="常青"></i>常青</p>
      </aside>
      <article class="gd-note">
        <div class="meta">花园 / 设计 / 默认值就是设计</div>
        <h1 class="title">默认值就是设计</h1>
        <div class="meta gd-meta"><span class="tag">常青</span> 种下 2025-03 · 上次浇水 2026-10-20</div>
        <p>大部分人不会打开设置页，所以默认值才是他们真正用到的产品。改一个默认值，往往比加一个新功能影响的人更多。</p>
        <p>这和 <a class="wl" href="#">[[留白不是空着]]<span class="pop card"><b>留白不是空着</b>留白是给眼睛的停顿。它决定了先看哪里、后看哪里……</span></a> 是同一个道理：不做什么，也是一种设计决定。</p>
        <div class="gd-callout"><b>判断方法</b>问自己：如果这个选项永远不改，有多少人会受影响？答案是「大多数人」，那它就该是一个默认值，而不是一个选项。</div>
        <p>写按钮文案时也一样，见 <a class="wl" href="#">[[按钮文案清单]]<span class="pop card"><b>按钮文案清单</b>动词开头，写清结果：「保存草稿」比「确定」好……</span></a>。</p>
        <h3 class="gd-h">提到这篇的笔记 · 3</h3>
        <div class="gd-back">
          <a class="card" href="#"><b>把设置页做短</b><span>……先把<mark>默认值</mark>定好，再决定哪些需要开关……</span></a>
          <a class="card" href="#"><b>一支笔</b><span>……生活里的<mark>默认值</mark>：出门只带一支笔……</span></a>
          <a class="card" href="#"><b>按钮文案清单</b><span>……确认框的<mark>默认</mark>按钮应该是安全的那个……</span></a>
        </div>
      </article>
      <aside class="gd-side">
        <h4 class="meta">关系图</h4>
        <svg class="gd-graph" viewBox="0 0 220 180" role="img" aria-label="笔记关系图">
          <g class="gd-edges"><path d="M110 90 52 44M110 90l70-38M110 90l-62 52M110 90l64 48M180 52l-6 86M52 44l-4 98"/></g>
          <g class="gd-nodes"><circle cx="52" cy="44" r="6"/><circle cx="180" cy="52" r="7"/><circle cx="48" cy="142" r="5"/><circle cx="174" cy="138" r="6"/><circle class="cur" cx="110" cy="90" r="10"/></g>
          <g class="gd-labels"><text x="52" y="30">留白</text><text x="180" y="38">按钮文案</text><text x="48" y="162">一支笔</text><text x="174" y="158">设置页</text><text x="110" y="116">默认值</text></g>
        </svg>
        <h4 class="meta">最近浇水</h4>
        <ul class="gd-recent"><li><a href="#">按钮文案清单</a><span class="meta">10-26</span></li><li><a href="#">默认值就是设计</a><span class="meta">10-20</span></li><li><a href="#">散步路线</a><span class="meta">10-14</span></li></ul>
      </aside>
    </main>
  </div>`,
  css: `.gd-search { position: relative; margin-left: 8px; }
.gd-search svg { position: absolute; left: 11px; top: 50%; width: 15px; height: 15px; transform: translateY(-50%); color: var(--dim); }
.gd-search input { width: 180px; height: 36px; padding-left: 32px; font-size: 13px; }
.gd { display: grid; grid-template-columns: 220px minmax(0, 1fr) 240px; min-height: 100%; }
.gd-tree, .gd-side { padding: 28px 22px; }
.gd-tree { border-right: var(--bw) solid var(--line); background: var(--bg2); }
.gd-side { border-left: var(--bw) solid var(--line); }
.gd-group { margin-top: 18px; }
.gd-group h4, .gd-side h4 { margin: 0 0 8px; font-size: 12px; font-weight: 600; letter-spacing: .1em; }
.gd-group h4 { color: var(--dim); }
.gd-group a { display: flex; align-items: center; gap: 8px; padding: 5px 8px; margin: 0 -8px; border-radius: var(--radius-sm); font-size: 14px; transition: background .15s; }
.gd-group a:hover { background: var(--hover); }
.gd-group a.on { background: var(--tag); color: var(--accent); font-weight: 600; }
.gd i { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--a3); }
.gd [data-st="生长中"] i, .gd i[data-st="生长中"] { background: var(--a2); }
.gd [data-st="常青"] i, .gd i[data-st="常青"] { background: var(--accent); }
.gd-legend { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 24px; }
.gd-legend i { display: inline-block; margin-left: 4px; }
.gd-note { width: min(100% - 64px, 660px); margin: 0 auto; padding: 40px 0 64px; }
.gd-note .title { margin: 12px 0 10px; font-size: calc(var(--title-size) * .68); }
.gd-meta { margin-bottom: 26px; }
.gd-note > p { font-size: 16px; line-height: 1.9; }
.wl { position: relative; color: var(--accent); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
.wl .pop { position: absolute; left: 0; top: calc(100% + 8px); z-index: 2; display: flex; flex-direction: column; gap: 4px; width: 260px; padding: 14px 16px; color: var(--dim); font-size: 13px; line-height: 1.6; text-decoration: none; opacity: 0; visibility: hidden; transform: translateY(4px); transition: all .2s; box-shadow: 0 12px 32px rgba(0, 0, 0, .14); }
.wl .pop b { color: var(--text); font-size: 14px; }
.wl:hover .pop { opacity: 1; visibility: visible; transform: none; }
.gd-callout { margin: 22px 0; padding: 16px 18px; border-radius: var(--radius-sm); background: var(--tag); font-size: 15px; }
.gd-callout b { display: block; margin-bottom: 4px; color: var(--accent); }
.gd-h { margin: 40px 0 14px; padding-top: 22px; border-top: var(--bw) solid var(--line); font: 600 14px/1.4 var(--font-meta); color: var(--dim); }
.gd-back { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.gd-back a { display: flex; flex-direction: column; gap: 6px; padding: 14px; font-size: 13px; color: var(--dim); transition: transform .2s; }
.gd-back a:hover { transform: translateY(-2px); }
.gd-back b { color: var(--text); font-size: 14px; }
.gd-back mark { background: color-mix(in srgb, var(--accent) 22%, transparent); color: inherit; }
.gd-graph { display: block; width: 100%; height: auto; margin-bottom: 26px; }
.gd-edges path { stroke: var(--line); stroke-width: 1.5; fill: none; }
.gd-labels text { fill: var(--dim); font: 10px var(--font); text-anchor: middle; }
.gd-nodes circle { fill: var(--dim); opacity: .55; transition: opacity .2s; }
.gd-nodes circle:hover { opacity: 1; }
.gd-nodes .cur { fill: var(--accent); opacity: 1; animation: gd-pulse 2.4s ease-in-out infinite; transform-origin: 110px 90px; }
@keyframes gd-pulse { 50% { transform: scale(1.18); } }
.gd-recent { margin: 0; padding: 0; list-style: none; font-size: 14px; }
.gd-recent li { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: var(--bw) solid var(--line); }
.gd-recent a:hover { color: var(--accent); }
@media (max-width: 720px) {
  .gd { grid-template-columns: 1fr; }
  .gd-tree, .gd-side, .gd-search { display: none; }
  .gd-note { width: calc(100% - 36px); padding-top: 28px; }
  .gd-back { grid-template-columns: 1fr; }
}`,
  js: function () {
    const items = [...document.querySelectorAll('.gd-group a')];
    items.forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      items.forEach((x) => x.classList.toggle('on', x === a));
      document.querySelector('.gd-note .title').textContent = a.textContent;
      document.querySelector('.gd-meta .tag').textContent = a.dataset.st;
    }));
  },
};

/* ---------------- 页面 9：周刊 ---------------- */
const weekly = {
  id: 'weekly', zh: '周刊订阅页', en: 'Newsletter', cat: 'site-weekly',
  lead: '个人周刊的门面：一句话讲清每期写什么、多久一封、多少人在读，订阅框放在最显眼的位置，下面是往期存档。',
  terms: ['Newsletter 周刊', 'Social Proof 社会认同', 'Archive 存档列表'],
  prompt: '个人周刊（Newsletter）订阅页：首屏一行小字「每周五早上 · 已发 86 期」、大标题「小样：一封关于界面细节的周刊」、一句说明，下面是一体式订阅框（邮箱输入框和「免费订阅」按钮连在一起，提交后变成「✓ 请去邮箱确认」），再下面一行头像叠在一起的读者数「2,300 位读者」；右边是一张斜放的最新一期预览卡（期号、标题、本期 3 个小标题）；下面「往期」存档带一个搜索框（输入就实时筛选），每行是期号、标题、话题标签和日期。',
  promptEn: 'Personal newsletter landing page: the hero has a small line "Every Friday morning · 86 issues so far", a large title "Xiaoyang: a newsletter about interface details", one sentence of description, a combined subscribe field (email input and a "Subscribe free" button joined together, turning into "✓ Check your inbox" after submitting) and a row of overlapping avatars with "2,300 readers"; on the right a slightly rotated preview card of the latest issue (issue number, title, three section headings); below, an "Archive" list with a search box that filters as you type, each row showing issue number, title, topic tags and date.',
  html: () => `${top('blog', '<a class="btn sm pri" href="#">订阅</a>')}
  <div class="scroll">
    <main class="wrap">
      <section class="hero wk-hero">
        <div>
          <div class="kicker">每周五早上 · 已发 86 期</div>
          <h1 class="title">小样：一封关于界面细节的周刊</h1>
          <p class="lead">每期拆解三个做得好的界面细节，附上能直接用的做法。五分钟读完，不发广告。</p>
          <form class="wk-form"><input type="email" placeholder="你的邮箱" aria-label="邮箱"><button class="btn pri" type="submit">免费订阅</button></form>
          <div class="wk-proof"><span class="wk-faces">${['遥', '夏', '禾', '野'].map((t, i) => `<i style="background:var(--a${(i % 3) + 1})">${t}</i>`).join('')}</span><span class="meta">2,300 位读者 · 随时一键退订</span></div>
        </div>
        <article class="card wk-issue">
          <div class="ph {{art}}"></div>
          <span class="meta">第 86 期 · 11 月 1 日</span>
          <h3>好的空状态长什么样</h3>
          <ol><li>别让第一屏只有一句「暂无数据」</li><li>插图要小，按钮要大</li><li>空状态也是一次引导</li></ol>
        </article>
      </section>
      <section class="wk-arch">
        <div class="wk-bar"><h2 class="h2">往期</h2><label class="wk-search">${ico('search')}<input placeholder="搜往期，比如：按钮" aria-label="搜索往期"></label></div>
        <ul class="wk-list">
${ISSUES.map(([n, d, t, tags]) => `          <li><a href="#"><span class="wk-no">${n}</span><b>${t}</b><span class="meta">${tags}</span><time class="meta">${d}</time></a></li>`).join('\n')}
        </ul>
        <p class="meta wk-none" hidden>没有找到，换个词试试。</p>
      </section>
    </main>
    ${foot()}
  </div>`,
  css: `.wk-hero { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, .85fr); gap: 64px; align-items: center; }
.wk-hero .title { font-size: calc(var(--title-size) * .92); }
.wk-form { display: flex; max-width: 440px; margin-top: 28px; padding: 5px; border: var(--bw) solid var(--line); border-radius: calc(var(--radius-btn) + 5px); background: var(--card); box-shadow: var(--shadow); }
.wk-form input { flex: 1; min-width: 0; border: 0; background: none; box-shadow: none; }
.wk-form input:focus { box-shadow: none; }
.wk-form.done::before { content: "✓ 请去邮箱确认，下周五见"; flex: 1; padding: 9px 12px; color: var(--accent); font-weight: 600; }
.wk-form.done > * { display: none; }
.wk-proof { display: flex; align-items: center; gap: 12px; margin-top: 18px; }
.wk-faces { display: flex; }
.wk-faces i { display: grid; place-items: center; width: 30px; height: 30px; margin-left: -8px; border: 2px solid var(--bg); border-radius: 50%; color: var(--av-text); font: normal 600 12px/1 var(--font); }
.wk-faces i:first-child { margin-left: 0; }
.wk-issue { padding: 16px 16px 20px; transform: rotate(2deg); transition: transform .3s; }
.wk-issue:hover { transform: rotate(0) translateY(-4px); }
.wk-issue .ph { aspect-ratio: 16 / 9; margin-bottom: 14px; }
.wk-issue h3 { margin: 4px 0 10px; font: var(--head-weight) 20px/1.35 var(--font-head); letter-spacing: var(--head-track); }
.wk-issue ol { margin: 0; padding-left: 1.2em; color: var(--dim); font-size: 14px; }
.center .wk-hero { grid-template-columns: 1fr; justify-items: center; text-align: center; }
.center .wk-form { margin-inline: auto; }
.center .wk-proof { justify-content: center; }
.center .wk-issue { width: min(100%, 420px); text-align: left; }
.wk-arch { padding-bottom: 64px; }
.wk-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
.wk-bar .h2 { margin: 0; }
.wk-search { position: relative; }
.wk-search svg { position: absolute; left: 12px; top: 50%; width: 15px; height: 15px; transform: translateY(-50%); color: var(--dim); }
.wk-search input { width: 240px; padding-left: 34px; }
.wk-list { margin: 0; padding: 0; list-style: none; }
.wk-list a { display: grid; grid-template-columns: 64px minmax(0, 1fr) auto 64px; gap: 18px; align-items: center; padding: 16px 4px; border-bottom: var(--bw) solid var(--line); transition: background .15s, padding .2s; }
.wk-list a:hover { padding-left: 12px; background: var(--hover); }
.wk-list li[hidden] { display: none; }
.wk-no { color: var(--accent); font: var(--head-weight) 22px/1 var(--font-head); }
.wk-list time { text-align: right; }
@media (max-width: 720px) {
  .wk-hero { grid-template-columns: 1fr; gap: 36px; }
  .wk-issue { transform: none; }
  .wk-list a { grid-template-columns: 44px 1fr; }
  .wk-list a .meta { display: none; }
  .wk-search input { width: 100%; }
}`,
  js: function () {
    document.querySelector('.wk-form').addEventListener('submit', (e) => { e.preventDefault(); e.target.classList.add('done'); });
    const q = document.querySelector('.wk-search input'), rows = [...document.querySelectorAll('.wk-list li')];
    q.addEventListener('input', () => {
      const f = q.value.trim();
      rows.forEach((r) => { r.hidden = !!f && !r.textContent.includes(f); });
      document.querySelector('.wk-none').hidden = rows.some((r) => !r.hidden);
    });
  },
};

export const pages = [home, blog, post, portfolio, resume, links, photo, garden, weekly];
const pageById = Object.fromEntries(pages.map((p) => [p.id, p]));

/* ---------------- 拼装 ---------------- */
const MOBILE = ['手机宽度下导航缩成可横向滑动的一行，多栏布局改成单栏，侧栏收起', 'on phones the navigation becomes one horizontally scrollable row, multi-column layouts stack into one column and side panels are hidden'];
const MODS = {
  navside: ['导航不放顶部，改成左侧 220px 竖栏（名字在上、菜单竖排、按钮沉底）', 'navigation sits in a 220px left column instead of a top bar (name on top, menu stacked vertically, button at the bottom)'],
  center: ['首屏文字居中对齐', 'center-aligned hero text'],
  cards: ['文章列表做成两列卡片，每张带一幅插图', 'the post list is a two-column card grid, each with an illustration'],
};
// 每种风格的「招牌插画」构图（k1~k6），用在主页头像、周刊封面、链接页特色卡上，让同一种页面在不同风格里不至于长得一样
const ART = ['k6', 'k1', 'k2', 'k3', 'k4', 'k5'];
const artOf = (s) => s.art || ART[styles.indexOf(s) % ART.length];
const html = (s, page) => page.html(s).replaceAll('{{art}}', artOf(s));
const extraBlock = (s) => `/* 「${s.zh}」专属细节 */\n${s.extra}`;
function code(s, page) {
  const extra = s.extra ? `\n\n${extraBlock(s)}` : '';
  const scheme = s.v.scheme ? `\n.site { color-scheme: ${s.v.scheme}; }` : '';
  return `${site(s, page, html(s, page))}

<style>
${rootVars(s)}

${BASE}${scheme}

/* 「${page.zh}」页面 */
${page.css}${extra}
</style>

<script>
(${page.js.toString()})();
</script>
`;
}

// 所有案例共用的大段代码，构建时在数据文件里只存一份（做法同 admin/pages.mjs）
export const sharedChunks = () => [BASE, ...pages.map((p) => p.css), ...pages.map((p) => p.js.toString()),
  ...pages.map((p) => html(styles[0], p)), ...styles.map(rootVars), ...styles.filter((s) => s.extra).map(extraBlock), ...Object.keys(P).map(ico)];

export function siteCases() {
  const out = [];
  // 按页面排：同一种页面的各个风格放在一起，方便比较
  for (const page of pages) for (const s of styles) {
    if (!s.pages.includes(page.id)) continue;
    const mods = modsFor(s, page);
    const lay = mods.length ? [`版式：${mods.map((m) => MODS[m][0]).join('；')}。`, `Layout: ${mods.map((m) => MODS[m][1]).join('; ')}.`] : ['', ''];
    out.push({
      id: `site-${page.id}-${s.id}`, cat: page.cat, style: s.id,
      en: `${page.en} · ${s.en}`, zh: `${page.zh} · ${s.zh}`,
      lead: `${page.lead}这一版是「${s.zh}」风格：${s.use}`,
      vague: s.vague.map((v) => v.replace('{页}', page.zh)),
      terms: [...page.terms, s.term],
      prompt: `${page.prompt}\n${lay[0] ? lay[0] + '\n' : ''}${MOBILE[0]}。\n风格：${s.desc}`,
      promptEn: `${page.promptEn}\n${lay[1] ? lay[1] + '\n' : ''}${MOBILE[1][0].toUpperCase() + MOBILE[1].slice(1)}.\nStyle: ${s.descEn}`,
      canvas: 1120,
      code: code(s, page),
    });
  }
  for (const s of styles) for (const p of s.pages) if (!pageById[p]) throw new Error(`sites/styles.mjs：「${s.zh}」的 pages 里有不存在的页面 ${p}`);
  return out;
}

// 风格清单（#sites 栏目里「按风格看」用）
export const siteStyles = () => styles.map(({ id, zh, en }) => ({ id, zh, en }));
