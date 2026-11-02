// 江月 UI 文档站。数据来自 data/components.js（npm run build:ui 生成）。
// 路由：#home 首页 · #cat-<主题> 主题页 · #<组件 id> 组件详情 · 搜索框有内容时显示搜索结果
const { categories, components, vague } = window.UI_KIT;
const byId = Object.fromEntries(components.map((c) => [c.id, c]));
const catById = Object.fromEntries(categories.map((c) => [c.id, c]));
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// 组件预览底座：浅色画布、内容居中
const BASE = '<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<style>html,body{height:100%}body{margin:0;min-height:100%;display:grid;place-items:center;background:#FAFAFA;color:#18181B;' +
  'font-family:-apple-system,BlinkMacSystemFont,"Inter","PingFang SC","Microsoft YaHei",sans-serif}</style>\n';

/* ---------------- 通用小工具 ---------------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}
function copy(text, done = '已复制，粘贴给 AI 就行') {
  const fallback = () => {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    document.body.append(ta); ta.select();
    try { document.execCommand('copy'); toast(done); } catch { toast('复制失败，请手动选中复制'); }
    ta.remove();
  };
  navigator.clipboard ? navigator.clipboard.writeText(text).then(() => toast(done), fallback) : fallback();
}

/* ---------------- 提示词篮子 ---------------- */
let basket = store.get('jy-basket', []).filter((id) => byId[id]);
function inBasket(id) { return basket.includes(id); }
function toggleBasket(id) {
  basket = inBasket(id) ? basket.filter((x) => x !== id) : [...basket, id];
  store.set('jy-basket', basket);
  renderBasket(true);
  document.querySelectorAll(`[data-add="${id}"]`).forEach(syncAddBtn);
  toast(inBasket(id) ? `已放进篮子：${byId[id].zh}` : `已拿出篮子：${byId[id].zh}`);
}
function syncAddBtn(b) { const on = inBasket(b.dataset.add); b.setAttribute('aria-pressed', on); b.textContent = on ? '✓ 已在篮子' : '+ 篮子'; }
function basketPrompt() {
  if (!basket.length) return '';
  return '请按下面的要求修改界面：\n\n' + basket.map((id, i) => `${i + 1}. 【${byId[id].en} · ${byId[id].zh}】${byId[id].prompt}`).join('\n\n');
}
function renderBasket(bump) {
  const fab = $('#basket-fab');
  fab.hidden = !basket.length;
  $('#basket-count').textContent = basket.length;
  if (bump) { fab.classList.remove('bump'); void fab.offsetWidth; fab.classList.add('bump'); }
  $('#basket-list').innerHTML = basket.map((id) => `<li><span>${esc(byId[id].zh)}<small>${esc(byId[id].en)}</small></span><button data-remove="${id}" aria-label="移出">✕</button></li>`).join('');
  $('#basket-text').value = basketPrompt();
  renderNav();
}
$('#basket-fab').onclick = () => { $('#basket').hidden = false; };
$('#basket-close').onclick = () => { $('#basket').hidden = true; };
$('#basket').onclick = (e) => { if (e.target.id === 'basket') e.currentTarget.hidden = true; };
$('#basket-list').onclick = (e) => { const id = e.target.dataset.remove; if (id) toggleBasket(id); if (!basket.length) $('#basket').hidden = true; };
$('#basket-clear').onclick = () => { basket = []; store.set('jy-basket', basket); renderBasket(); document.querySelectorAll('[data-add]').forEach(syncAddBtn); $('#basket').hidden = true; };
$('#basket-copy').onclick = () => copy($('#basket-text').value, '整段提示词已复制');

/* ---------------- 侧边栏 ---------------- */
function renderNav() {
  const here = location.hash.slice(1) || 'home';
  const curCat = byId[here]?.cat || (here.startsWith('cat-') ? here.slice(4) : '');
  const cur = (h) => (h === here ? ' aria-current="page"' : '');
  $('#nav').innerHTML =
    `<a href="#home"${cur('home')}><span class="ico">☾</span>首页 · 感觉翻译器</a>` +
    `<a href="#basket" data-open-basket><span class="ico">◍</span>提示词篮子<span class="n">${basket.length}</span></a>` +
    `<div class="nav-label">词 典 · ${components.length} 词</div>` +
    categories.map((c) => `<details${c.id === curCat ? ' open' : ''}><summary>${esc(c.name)}<span class="n">${c.count}</span></summary><div class="sub">` +
      `<a href="#cat-${c.id}"${cur('cat-' + c.id)}>全部 ${c.count} 个</a>` +
      components.filter((x) => x.cat === c.id).map((x) => `<a href="#${x.id}"${cur(x.id)}>${esc(x.zh)}<small>${esc(x.en)}</small></a>`).join('') +
      '</div></details>').join('');
  $('#nav [aria-current]')?.scrollIntoView({ block: 'nearest' });
}
$('#nav').addEventListener('click', (e) => {
  if (e.target.closest('[data-open-basket]')) { e.preventDefault(); if (basket.length) $('#basket').hidden = false; else toast('篮子是空的：在任意词条上点「+ 篮子」'); }
  if (e.target.closest('a')) closeMenu();
});
const closeMenu = () => $('#side').classList.remove('open');
$('#menu-btn').onclick = () => $('#side').classList.add('open');
$('#scrim').onclick = closeMenu;

// 明暗切换：默认跟随系统，手动选择后记住
function applyTheme(t) {
  if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  const dark = t ? t === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;
  $('#theme-btn').textContent = dark ? '☀' : '☾';
  $('#theme-btn').title = dark ? '切换到白天' : '切换到夜晚';
}
$('#theme-btn').onclick = () => {
  const dark = $('#theme-btn').textContent === '☀';
  const t = dark ? 'light' : 'dark'; store.set('jy-theme', t); applyTheme(t);
};
applyTheme(store.get('jy-theme', null));

/* ---------------- 卡片与懒加载预览 ---------------- */
const lazy = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  const f = e.target; f.srcdoc = BASE + byId[f.dataset.id].code; lazy.unobserve(f);
}), { rootMargin: '300px' });
const fit = new ResizeObserver((entries) => entries.forEach((e) => e.target.style.setProperty('--s', e.contentRect.width / 560)));
function card(c) {
  return `<article class="tcard">
    <a class="thumb" href="#${c.id}" aria-label="${esc(c.zh)} 的实时预览"><iframe data-id="${c.id}" title="${esc(c.zh)} 预览" tabindex="-1" loading="lazy"></iframe></a>
    <div class="tbody"><div class="en">${esc(c.en)}</div><h3><a href="#${c.id}">${esc(c.zh)}</a></h3><p>${esc(c.lead)}</p>
      <div class="tact"><button class="btn sm" data-copy="${c.id}">复制提示词</button><button class="btn sm ghost add-btn" data-add="${c.id}"></button></div></div>
  </article>`;
}
function hydrate(root) {
  root.querySelectorAll('.thumb').forEach((t) => fit.observe(t));
  root.querySelectorAll('.thumb iframe').forEach((f) => lazy.observe(f));
  root.querySelectorAll('[data-add]').forEach(syncAddBtn);
}
$('#main').addEventListener('click', (e) => {
  const c = e.target.closest('[data-copy]'); if (c) copy(byId[c.dataset.copy].prompt);
  const a = e.target.closest('[data-add]'); if (a) toggleBasket(a.dataset.add);
});

/* ---------------- 页面：首页 ---------------- */
function matchFeel(q) {
  q = q.trim(); if (!q) return null;
  const v = vague.find((v) => v.vague.split(/\s*\/\s*/).some((p) => p.includes(q) || q.includes(p)) || v.vague.includes(q));
  if (v) return { v, list: v.terms.map((t) => byId[t[2]]).filter(Boolean) };
  const list = search(q).slice(0, 6);
  return list.length ? { list } : { list: [] };
}
function renderAnswer(q) {
  const box = $('#answer'); if (!box) return;
  document.querySelectorAll('.feel-chips button').forEach((b) => b.setAttribute('aria-pressed', b.textContent === q));
  const r = matchFeel(q);
  if (!r) { box.innerHTML = ''; return; }
  if (!r.list.length && !r.v) { box.innerHTML = '<div class="empty">没找到对应的词，换个说法试试，比如“不高级”“太乱”。</div>'; return; }
  box.innerHTML = `<div class="answer">
    ${r.v ? `<div class="answer-head"><h3><s>“${esc(q)}”</s> → 换成这些词</h3><p>${esc(r.v.why)}</p></div>
      <div class="pill-row">${r.v.terms.map(([en, zh, id]) => id ? `<a class="pill" href="#${id}">${esc(en)} · ${esc(zh)}</a>` : `<span class="pill">${esc(en)} · ${esc(zh)}</span>`).join('')}</div>
      <div class="answer-prompt"><p>${esc(r.v.prompt)}</p><button class="btn sm primary" id="copy-answer">复制</button></div>`
      : `<div class="answer-head"><h3>和“${esc(q)}”有关的词</h3></div>`}
    <div class="term-grid">${r.list.map(card).join('')}</div></div>`;
  hydrate(box);
  $('#copy-answer')?.addEventListener('click', () => copy(r.v.prompt));
}
function renderHome() {
  const feels = vague.map((v) => v.vague.split(/\s*\/\s*/)[0]);
  $('#main').innerHTML = `
  <section class="hero">
    <div>
      <div class="eyebrow">江月 UI 设计 · 给 AI 描述界面的词典</div>
      <h1 class="h1">说对一个词，<br>AI 就懂你的<em>审美</em></h1>
      <p class="lead">对 AI 说“不高级”，它只能瞎猜。这里有 ${components.length} 个界面术语，每个都配实时效果、可以直接用的代码，和一句能发给 AI 的话。</p>
      <div class="hero-actions"><a class="btn primary" href="#translator">试试感觉翻译器</a><a class="btn" href="#cat-${categories[0].id}">从头查词</a></div>
      <div class="stats"><div><b>${components.length}</b><span>个术语</span></div><div><b>${categories.length}</b><span>个主题</span></div><div><b>100%</b><span>可预览 · 可复制</span></div></div>
      <div class="poem">江畔何人初见月 · 江月何年初照人</div>
    </div>
    <div class="moonscape" aria-hidden="true"><div class="moon"></div><div class="horizon"></div><div class="river"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
  </section>

  <section class="section" id="translator">
    <div class="section-head"><div><h2 class="h2">感觉翻译器</h2><p>说不出专业词？先说你的感觉，我们帮你翻译成 AI 听得懂的话。</p></div></div>
    <div class="translator">
      <label class="translator-input"><span>我觉得界面</span><input id="feel" placeholder="不高级 / 太乱 / 点了没反应…" autocomplete="off"></label>
      <div class="feel-chips">${feels.map((f) => `<button type="button">${esc(f)}</button>`).join('')}</div>
      <div id="answer"></div>
    </div>
  </section>

  <section class="section">
    <div class="section-head"><div><h2 class="h2">按主题查词</h2><p>${categories.length} 个主题，从布局、配色到动效和体验。</p></div></div>
    <div class="cat-grid">${categories.map((c) => `<a class="cat-tile" href="#cat-${c.id}"><h3>${esc(c.name)}<span>${c.count}</span></h3><p>${esc(c.intro)}</p>
      <div class="names">${components.filter((x) => x.cat === c.id).slice(0, 5).map((x) => esc(x.zh)).join(' · ')} …</div></a>`).join('')}</div>
  </section>

  <section class="section">
    <div class="section-head"><div><h2 class="h2">三步用法</h2></div></div>
    <div class="steps"><div><b>找到那个词</b><span>按主题翻，或者在感觉翻译器里说出你的感觉</span></div>
      <div><b>看真实效果</b><span>每个词都有能点、能动的预览，切换手机宽度也能看</span></div>
      <div><b>复制给 AI</b><span>复制单句提示词，或者放进篮子拼成一整段再发</span></div></div>
  </section>
  <footer class="site-foot"><span>江月 UI 设计 · MIT 开源</span><a href="../">UI 提示词图鉴</a><a href="https://github.com/MoonFlower-King/-UI-">GitHub</a><span>内容来自短视频系列「给AI描述UI的6个词」</span></footer>`;
  const feel = $('#feel');
  feel.addEventListener('input', () => renderAnswer(feel.value));
  $('.feel-chips').onclick = (e) => { if (e.target.tagName === 'BUTTON') { feel.value = e.target.textContent; renderAnswer(feel.value); } };
  feel.value = feels[0]; renderAnswer(feel.value);
  document.title = '江月 UI · 给 AI 描述界面的词典';
}

/* ---------------- 页面：主题 / 搜索 ---------------- */
function renderCategory(cat) {
  const list = components.filter((x) => x.cat === cat.id);
  $('#main').innerHTML = `<header class="page-head"><div class="crumb"><a href="#home">首页</a> / 词典</div>
    <h1 class="h1">${esc(cat.name)}</h1><p class="lead">${esc(cat.intro)} 共 ${list.length} 个词，点卡片看代码。</p></header>
    <div class="term-grid">${list.map(card).join('')}</div>`;
  hydrate($('#main'));
  document.title = `${cat.name} · 江月 UI`;
}
function search(q) {
  const f = q.trim().toLowerCase(); if (!f) return [];
  return components.filter((c) => [c.en, c.zh, c.lead, ...(c.vague || []), ...(c.terms || []), catById[c.cat].name].join(' ').toLowerCase().includes(f));
}
function renderSearch(q) {
  const list = search(q);
  $('#main').innerHTML = `<header class="page-head"><div class="crumb">搜索</div><h1 class="h1">“${esc(q)}”</h1><p class="lead">找到 ${list.length} 个词。</p></header>
    ${list.length ? `<div class="term-grid">${list.map(card).join('')}</div>` : '<div class="empty">没找到。换个说法，或者去首页用感觉翻译器试试。</div>'}`;
  hydrate($('#main'));
}

/* ---------------- 页面：组件详情 ---------------- */
let current;
function renderDetail(c) {
  current = c;
  const cat = catById[c.cat], sibs = components.filter((x) => x.cat === c.cat), i = sibs.indexOf(c);
  const prev = sibs[i - 1], next = sibs[i + 1];
  $('#main').innerHTML = `
  <header class="detail-head">
    <div class="crumb"><a href="#home">首页</a> / <a href="#cat-${cat.id}">${esc(cat.name)}</a>${c.episode ? ` · 视频 ${esc(c.episode)}` : ''}</div>
    <h1>${esc(c.zh)}<span>${esc(c.en)}</span></h1>
    <p class="lead">${esc(c.lead)}</p>
  </header>
  ${c.vague ? `<div class="say">别再说 ${c.vague.map((v) => `<s>${esc(v)}</s>`).join('')} 换成 ${(c.terms || [c.en]).map((t) => `<b>${esc(t)}</b>`).join('')}</div>` : ''}
  <div class="toolbar">
    <div class="seg" role="group" aria-label="视图"><button id="v-preview" aria-pressed="true">预览</button><button id="v-code" aria-pressed="false">代码</button></div>
    <div class="seg" role="group" aria-label="预览宽度" id="devices"><button data-d="desktop" aria-pressed="true">桌面</button><button data-d="tablet" aria-pressed="false">平板</button><button data-d="phone" aria-pressed="false">手机</button></div>
    <div class="end"><button class="btn sm ghost" id="replay">↻ 重播</button><button class="btn sm ghost add-btn" data-add="${c.id}"></button><button class="btn sm primary" id="copy-code">复制代码</button></div>
  </div>
  <div class="stage" id="stage" data-device="desktop"><div class="frame"><iframe id="preview" title="${esc(c.zh)} 实时预览"></iframe></div></div>
  <pre class="code" id="code" hidden></pre>
  <section class="prompt-box"><header><h2>直接发给 AI 的一句话</h2><button class="btn sm" data-copy="${c.id}">复制提示词</button></header><p>${esc(c.prompt)}</p></section>
  <nav class="pager">${prev ? `<a href="#${prev.id}"><small>上一个</small><b>${esc(prev.zh)}</b></a>` : ''}${next ? `<a class="next" href="#${next.id}"><small>下一个</small><b>${esc(next.zh)}</b></a>` : `<a class="next" href="#cat-${categories[(categories.indexOf(cat) + 1) % categories.length].id}"><small>下一个主题</small><b>${esc(categories[(categories.indexOf(cat) + 1) % categories.length].name)}</b></a>`}</nav>`;
  $('#code').textContent = c.code;
  const replay = () => { $('#preview').srcdoc = BASE + c.code; };
  const setView = (code) => { $('#v-preview').setAttribute('aria-pressed', !code); $('#v-code').setAttribute('aria-pressed', code); $('#stage').hidden = code; $('#code').hidden = !code; };
  $('#v-preview').onclick = () => setView(false);
  $('#v-code').onclick = () => setView(true);
  $('#replay').onclick = () => { setView(false); replay(); };
  $('#copy-code').onclick = () => copy(c.code, '代码已复制');
  $('#devices').onclick = (e) => { const d = e.target.dataset.d; if (!d) return; $('#stage').dataset.device = d; $('#devices').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === e.target)); };
  hydrate($('#main'));
  replay();
  document.title = `${c.zh} ${c.en} · 江月 UI`;
}

/* ---------------- 路由 ---------------- */
function route() {
  const h = decodeURIComponent(location.hash.slice(1));
  const q = $('#q').value.trim();
  if (q && !byId[h]) renderSearch(q);
  else if (byId[h]) renderDetail(byId[h]);
  else if (h.startsWith('cat-') && catById[h.slice(4)]) renderCategory(catById[h.slice(4)]);
  else if (h === 'translator') { if (!$('#translator')) renderHome(); $('#translator').scrollIntoView(); renderNav(); return; }
  else renderHome();
  renderNav();
  scrollTo({ top: 0 });
}
addEventListener('hashchange', () => { $('#q').value = ''; route(); });
$('#q').addEventListener('input', () => { if (byId[location.hash.slice(1)]) history.replaceState(null, '', '#search'); route(); });
addEventListener('keydown', (e) => {
  if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); }
  if (e.key === 'Escape') { $('#basket').hidden = true; closeMenu(); }
});

renderBasket();
route();
