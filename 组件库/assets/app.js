// 江月 UI 文档站。数据来自 data/components.js（npm run build:ui 生成）。
// 路由：#home 首页（感觉翻译器）· #all 词典全部 · #cat-<主题> 单个主题 · #<组件 id> 词条详情
// 搜索不占路由：按 / 或 Ctrl/⌘+K 打开搜索面板，手机上点底部「搜索」。
const { categories, components, vague } = window.UI_KIT;
const byId = Object.fromEntries(components.map((c) => [c.id, c]));
const catById = Object.fromEntries(categories.map((c) => [c.id, c]));
const inCat = (id) => components.filter((x) => x.cat === id);
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const feels = vague.map((v) => v.vague.split(/\s*\/\s*/)[0]);

// 组件预览底座：浅色画布、内容居中（组件代码都按浅色背景写）
const BASE = '<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<style>html,body{height:100%}body{margin:0;min-height:100%;display:grid;place-items:center;background:#FAFAFA;color:#18181B;' +
  'font-family:-apple-system,BlinkMacSystemFont,"Inter","PingFang SC","Microsoft YaHei",sans-serif}</style>\n';

/* ---------------- 小工具 ---------------- */
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

// 浮层（搜索面板、篮子）：打开时锁住页面滚动，点遮罩或按 Esc 关闭
function openLayer(el) { el.hidden = false; document.body.style.overflow = 'hidden'; }
function closeLayers() { $$('.overlay').forEach((o) => { o.hidden = true; }); document.body.style.overflow = ''; }
$$('.overlay').forEach((o) => o.addEventListener('click', (e) => { if (e.target === o || e.target.closest('[data-close]')) closeLayers(); }));

/* ---------------- 提示词篮子 ---------------- */
let basket = store.get('jy-basket', []).filter((id) => byId[id]);
const inBasket = (id) => basket.includes(id);
function setBasket(next, bump) {
  basket = next; store.set('jy-basket', basket);
  $$('[data-basket-count]').forEach((b) => {
    b.textContent = basket.length; b.dataset.n = basket.length;
    if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  });
  $$('[data-add]').forEach(syncAddBtn);
  renderBasket();
}
function toggleBasket(id) {
  const on = !inBasket(id);
  setBasket(on ? [...basket, id] : basket.filter((x) => x !== id), true);
  toast(on ? `已放进篮子：${byId[id].zh}` : `已从篮子拿出：${byId[id].zh}`);
}
function syncAddBtn(b) {
  const on = inBasket(b.dataset.add);
  b.setAttribute('aria-pressed', on);
  b.textContent = on ? '✓ 已在篮子' : '+ 篮子';
}
const basketPrompt = () => basket.length
  ? '请按下面的要求修改界面：\n\n' + basket.map((id, i) => `${i + 1}. 【${byId[id].en} · ${byId[id].zh}】${byId[id].prompt}`).join('\n\n') : '';
function renderBasket() {
  $('#basket-list').innerHTML = basket.length
    ? basket.map((id) => `<li><span>${esc(byId[id].zh)}<small>${esc(byId[id].en)}</small></span><button class="icon-btn" data-remove="${id}" aria-label="移出 ${esc(byId[id].zh)}"><svg viewBox="0 0 20 20"><path d="m6 6 8 8M14 6l-8 8"/></svg></button></li>`).join('')
    : '<li class="basket-empty">篮子还是空的。在任意词条上点「+ 篮子」，挑好几个后回到这里一次复制。</li>';
  $('#basket-text').value = basketPrompt();
  $('#basket-copy').disabled = !basket.length;
}
const openBasket = () => openLayer($('#basket'));
$('#basket-btn').onclick = openBasket;
$('#basket-list').onclick = (e) => { const b = e.target.closest('[data-remove]'); if (b) toggleBasket(b.dataset.remove); };
$('#basket-clear').onclick = () => { setBasket([]); toast('篮子已清空'); };
$('#basket-copy').onclick = () => copy($('#basket-text').value, '整段提示词已复制');

/* ---------------- 明暗：默认跟随系统，手动选过就记住 ---------------- */
const SUN = '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="3.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4"/></svg>';
const MOON = '<svg viewBox="0 0 20 20"><path d="M16.5 12.5A7 7 0 0 1 7.5 3.5a7 7 0 1 0 9 9z"/></svg>';
const isDark = () => (document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
function syncTheme() {
  const b = $('#theme-btn'), dark = isDark();
  b.innerHTML = dark ? SUN : MOON; b.title = b.ariaLabel = dark ? '切换到白天' : '切换到夜晚';
}
$('#theme-btn').onclick = () => { const t = isDark() ? 'light' : 'dark'; document.documentElement.dataset.theme = t; store.set('jy-theme', t); syncTheme(); };
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncTheme);
syncTheme();

/* ---------------- 词卡与自动演示预览 ---------------- */
// 每张卡片的预览分两层：
// 1. 底层「静态首帧」：把组件的 HTML + CSS（去掉脚本、暂停动画）直接画进卡片的 Shadow DOM，离屏幕还远就画好，
//    又轻又快，所以滚到哪都不会看到空白。
// 2. 上层「自动演示」iframe（assets/autoplay.js）：卡片快进入屏幕时才加载，加载好后淡入盖住首帧；滚出去就卸掉，省电省 CPU。
// 所有预览和网页共用一条主线程，所以 iframe 一次只启动一张、错开 80ms。
// 鼠标移进卡片：从头重播一遍；访客自己点一下就接管。系统开了「减少动态效果」就不自动演示。
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const canHover = matchMedia('(hover: hover)').matches;
const AUTO = window.JY_AUTOPLAY;
const doc = (c) => !AUTO ? BASE + c.code : calm.matches
  ? `${BASE}${c.code}\n<script>(${AUTO.fit})()<\/script>`
  : `${BASE}<script>(${AUTO.pre})()<\/script>\n${c.code}\n<script>(${AUTO.fit})();(${AUTO.post})()<\/script>`;

// 预览占满：组件按 560×350 的画布写，但很多只占中间一小块。量出实际大小后，把预览「视口」缩到刚好包住它，
// 再整体放大到卡片宽度，组件就占满预览框。每个组件只量一次，记在 fitCache 里。
const fitCache = {};
function setFit(id, w, h) {
  if (!(w > 0)) return;
  const need = Math.round(Math.min(560, Math.max(240, w * 1.1, h * 1.36 * 1.6)));
  if (fitCache[id] && need <= fitCache[id] + 2) return; // 只放宽、不收窄，避免来回跳
  fitCache[id] = Math.max(need, fitCache[id] || 0);
  $$(`.thumb iframe[data-id="${id}"]`).forEach((f) => f.parentElement.style.setProperty('--vw', fitCache[id]));
}
// 量 Shadow DOM 首帧里组件的实际大小（换算回预览视口里的像素）
function measurePoster(id, host, root) {
  const o = host.getBoundingClientRect(), vw = fitCache[id] || 560, k = o.width / vw, W = vw, H = vw / 1.6;
  if (!(k > 0)) return;
  let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
  root.querySelectorAll('*').forEach((el) => {
    if (el.tagName === 'STYLE') return;
    const q = el.getBoundingClientRect(), x = (q.left - o.left) / k, y = (q.top - o.top) / k, w = q.width / k, h = q.height / k;
    if (w < 2 || h < 2 || x + w <= -W || y + h <= -H || x >= 2 * W || y >= 2 * H || (w >= W - 1 && h >= H - 1)) return;
    const cs = getComputedStyle(el); if (cs.opacity === '0' || cs.visibility === 'hidden') return;
    l = Math.min(l, x); t = Math.min(t, y); r = Math.max(r, x + w); b = Math.max(b, y + h);
  });
  if (r > l) setFit(id, Math.max(r - W / 2, W / 2 - l) * 2, Math.max(b - H / 2, H / 2 - t) * 2);
}

// 静态首帧：:root / html / body 上的样式改挂到 Shadow DOM 的宿主上
const POSTER_CSS = ':host{all:initial;display:grid;place-items:center;width:100%;height:100%;background:#FAFAFA;color:#18181B;' +
  'font-family:-apple-system,BlinkMacSystemFont,"Inter","PingFang SC","Microsoft YaHei",sans-serif;overflow:hidden}' +
  '*,*::before,*::after{animation-play-state:paused!important;transition:none!important}';
function paintPoster(t) {
  const c = byId[t.querySelector('iframe').dataset.id], host = t.querySelector('.poster');
  if (!host || host.shadowRoot) return;
  const html = c.code.replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/(^|[\s,}>])(:root|html|body)(?=\s*[{,.:#\[\s])/g, '$1:host');
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>${POSTER_CSS}</style>${html}`;
  t.classList.add('ready');
  // 首帧画好就顺手量一下组件大小，预览立刻按实际大小放大；放大后可能换行变高，下一帧再量一次确认装得下
  measurePoster(c.id, host, root);
}
// 首帧在浏览器空闲时分批画，每批最多 4 张，不和滚动抢主线程
const posterQueue = new Set();
const idle = window.requestIdleCallback || ((fn) => setTimeout(() => fn({ timeRemaining: () => 8 }), 32));
let painting = false;
function paintSome(deadline) {
  let n = 0;
  for (const t of posterQueue) {
    if (n++ >= 4 || deadline.timeRemaining() < 4) break;
    posterQueue.delete(t); if (t.isConnected) paintPoster(t);
  }
  posterQueue.size ? idle(paintSome, { timeout: 300 }) : (painting = false);
}
const posters = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) { posterQueue.delete(e.target); return; }
  posterQueue.add(e.target); posters.unobserve(e.target);
  if (!painting) { painting = true; idle(paintSome, { timeout: 300 }); }
}), { rootMargin: '500px 0px' });

// 同一时间最多只让离屏幕中心最近的几张卡片播放演示，其余显示静态首帧；滚动停下 200ms 后才重新挑选，
// 滚动过程中不新开演示，所以滚起来不卡。鼠标所在的卡片总是优先播放。
const MAX_PLAY = matchMedia('(max-width: 720px)').matches ? 2 : 4;
const inView = new Set(), playing = new Set(), queue = new Set();
let pumping = false, hovered = null, pickTimer;
const swap = (f, fade) => {
  if (!fade) { f.srcdoc = doc(byId[f.dataset.id]); return; }
  f.classList.add('swap');
  setTimeout(() => { if (playing.has(f)) f.srcdoc = doc(byId[f.dataset.id]); }, 180);
};
function pump() {
  const f = queue.values().next().value;
  if (!f) { pumping = false; return; }
  queue.delete(f); pumping = true; if (playing.has(f)) swap(f, f.dataset.live);
  setTimeout(pump, 120);
}
const load = (f, now) => { queue.delete(f); if (now) swap(f, true); else { queue.add(f); if (!pumping) pump(); } };
const stop = (f) => { playing.delete(f); queue.delete(f); f.classList.add('swap'); delete f.dataset.live; if (f.srcdoc) f.srcdoc = ''; };
function pick() {
  const mid = innerHeight / 2;
  const dist = (f) => { const r = f.parentElement.getBoundingClientRect(); return Math.abs(r.top + r.height / 2 - mid) + Math.abs(r.left + r.width / 2 - innerWidth / 2) / 4; };
  const want = new Set([...inView].sort((x, y) => dist(x) - dist(y)).slice(0, MAX_PLAY));
  if (hovered && inView.has(hovered)) want.add(hovered);
  playing.forEach((f) => { if (!want.has(f)) stop(f); });
  want.forEach((f) => { if (!playing.has(f)) { playing.add(f); load(f); } });
}
const repick = () => { clearTimeout(pickTimer); pickTimer = setTimeout(pick, 200); };
addEventListener('scroll', repick, { passive: true });
const watch = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.intersectionRatio >= .4) inView.add(e.target); else { inView.delete(e.target); if (playing.has(e.target)) stop(e.target); } });
  repick();
}, { threshold: [0, .4] });
addEventListener('message', (e) => {
  const f = [...playing].find((x) => x.contentWindow === e.source);
  if (!f) return;
  if (e.data === 'jy-replay') load(f);
  else if (e.data?.jyFit) setFit(f.dataset.id, ...e.data.jyFit);
});
const fit = new ResizeObserver((entries) => entries.forEach((e) => e.target.style.setProperty('--tw', e.contentRect.width)));
function card(c) {
  return `<article class="card">
    <div class="thumb"${fitCache[c.id] ? ` style="--vw:${fitCache[c.id]}"` : ''}><div class="poster" aria-hidden="true"></div><iframe class="swap" data-id="${c.id}" title="${esc(c.zh)} 预览" tabindex="-1"></iframe>
<span class="live">点一下，换你来玩</span></div>
    <div class="card-body"><h3 class="card-title"><a href="#${c.id}" title="${esc(c.lead)}">${esc(c.zh)}</a><small>${esc(c.en)}</small></h3>
      <div class="card-actions"><button class="glass-btn" data-copy="${c.id}">复制提示词</button><button class="glass-btn add-btn" data-add="${c.id}"></button></div></div>
  </article>`;
}
function hydrate(root) {
  $$('.thumb', root).forEach((t) => {
    const f = t.querySelector('iframe'), cardEl = t.closest('.card');
    fit.observe(t); posters.observe(t); watch.observe(f);
    f.addEventListener('load', () => { if (f.srcdoc) { f.classList.remove('swap'); f.dataset.live = 1; } });
    if (canHover) {
      cardEl.addEventListener('mouseenter', () => { hovered = f; if (!playing.has(f)) { playing.add(f); pick(); } load(f, true); });
      cardEl.addEventListener('mouseleave', () => { if (hovered === f) hovered = null; let stopped = false; try { stopped = f.contentWindow.__jyStop; } catch {} if (stopped && playing.has(f)) load(f); repick(); });
    }
  });
  $$('[data-add]', root).forEach(syncAddBtn);
}
document.addEventListener('click', (e) => {
  const c = e.target.closest('[data-copy]'); if (c) copy(byId[c.dataset.copy].prompt);
  const a = e.target.closest('[data-add]'); if (a) toggleBasket(a.dataset.add);
  if (e.target.closest('[data-open-basket]')) openBasket();
  if (e.target.closest('[data-open-search]')) openSearch();
});

/* ---------------- 搜索 ---------------- */
function score(c, f) {
  const zh = c.zh.toLowerCase(), en = c.en.toLowerCase();
  if (zh === f || en === f) return 100;
  if (zh.startsWith(f) || en.startsWith(f)) return 80;
  if (zh.includes(f) || en.includes(f)) return 60;
  if ((c.episode || '').toLowerCase() === f) return 50;
  if ([...(c.vague || []), ...(c.terms || [])].join(' ').toLowerCase().includes(f)) return 40;
  if (catById[c.cat].name.includes(f)) return 30;
  return c.lead.toLowerCase().includes(f) ? 20 : 0;
}
function search(q) {
  const f = q.trim().toLowerCase(); if (!f) return [];
  return components.map((c) => [score(c, f), c]).filter(([s]) => s).sort((a, b) => b[0] - a[0]).map(([, c]) => c);
}
function findFeel(q) {
  q = q.trim(); if (!q) return [];
  return vague.filter((v) => v.vague.includes(q) || v.vague.split(/\s*\/\s*/).some((p) => q.includes(p)));
}

/* ---------------- 搜索面板 ---------------- */
let hits = [], sel = 0;
function openSearch() { openLayer($('#palette')); $('#q').value = ''; renderResults(); $('#q').focus(); }
function renderResults() {
  const q = $('#q').value.trim();
  const feelHits = q ? findFeel(q) : vague.slice(0, 5);
  const termHits = q ? search(q).slice(0, 30) : [];
  hits = [...feelHits.map((v) => ({ feel: v.vague.split(/\s*\/\s*/)[0], v })), ...(q ? termHits.map((c) => ({ c })) : categories.map((cat) => ({ cat })))];
  sel = 0;
  let i = 0;
  const row = (h) => {
    const n = i++;
    if (h.v) return `<div class="result feel" role="option" data-i="${n}"><span class="ico">感</span><div><b>“${esc(h.feel)}”</b><span>翻译成：${h.v.terms.map((t) => esc(t[1])).join('、')}</span></div></div>`;
    if (h.cat) return `<div class="result" role="option" data-i="${n}"><span class="ico">${esc(h.cat.name[0])}</span><div><b>${esc(h.cat.name)}<small>${h.cat.count} 个词</small></b><span>${esc(h.cat.intro)}</span></div></div>`;
    return `<div class="result" role="option" data-i="${n}"><span class="ico">${esc(h.c.zh[0])}</span><div><b>${esc(h.c.zh)}<small>${esc(h.c.en)}</small></b><span>${esc(h.c.lead)}</span></div></div>`;
  };
  const feelRows = hits.filter((h) => h.v), rest = hits.filter((h) => !h.v);
  $('#results').innerHTML = !hits.length
    ? `<div class="none">没找到“${esc(q)}”。换个说法试试，比如“太乱”“不高级”，或者直接搜英文名。</div>`
    : (feelRows.length ? `<h4>${q ? '像是在说这种感觉' : '常见的说不清'}</h4>${feelRows.map(row).join('')}` : '') +
      (rest.length ? `<h4>${q ? `术语 · ${termHits.length} 个` : '按主题翻'}</h4>${rest.map(row).join('')}` : '');
  markSel();
}
function markSel() {
  $$('#results .result').forEach((r) => r.setAttribute('aria-selected', +r.dataset.i === sel));
  $(`#results [data-i="${sel}"]`)?.scrollIntoView({ block: 'nearest' });
}
function choose(i) {
  const h = hits[i]; if (!h) return;
  closeLayers();
  if (h.v) { pendingFeel = h.feel; if (location.hash === '#home' || !location.hash) route(); else location.hash = 'home'; }
  else location.hash = h.cat ? 'cat-' + h.cat.id : h.c.id;
}
$('#q').addEventListener('input', renderResults);
$('#q').addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + hits.length) % Math.max(hits.length, 1); markSel(); }
  if (e.key === 'Enter') { e.preventDefault(); choose(sel); }
});
$('#results').addEventListener('click', (e) => { const r = e.target.closest('.result'); if (r) choose(+r.dataset.i); });
$('#results').addEventListener('mousemove', (e) => { const r = e.target.closest('.result'); if (r && +r.dataset.i !== sel) { sel = +r.dataset.i; markSel(); } });
$('#search-btn').onclick = openSearch;
$('#search-btn-m').onclick = openSearch;

/* ---------------- 侧边目录（桌面） ---------------- */
function renderSide(here, curCat) {
  const cur = (h) => (h === here ? ' aria-current="page"' : '');
  $('#side').innerHTML = `<div class="side-label">词典 · ${components.length} 个词</div>
    <a href="#all"${cur('all')}>全部主题<span class="n">${components.length}</span></a>` +
    categories.map((c) => `<a href="#cat-${c.id}"${cur('cat-' + c.id)}>${esc(c.name)}<span class="n">${c.count}</span></a>` +
      (c.id === curCat ? `<div class="sub">${inCat(c.id).map((x) => `<a href="#${x.id}"${cur(x.id)}>${esc(x.zh)}</a>`).join('')}</div>` : '')).join('') +
    `<div class="side-foot"><a href="../">UI 提示词图鉴 →</a><a href="https://github.com/MoonFlower-King/-UI-">GitHub 开源 · MIT</a></div>`;
  $('#side [aria-current]')?.scrollIntoView({ block: 'nearest' });
}

/* ---------------- 页面：首页（感觉翻译器） ---------------- */
let pendingFeel = null;
function renderAnswer(q) {
  $$('.chips .chip').forEach((b) => b.setAttribute('aria-pressed', b.textContent === q.trim()));
  const box = $('#answer'); q = q.trim();
  if (!q) { box.innerHTML = ''; return; }
  const v = findFeel(q)[0];
  if (!v) {
    const list = search(q).slice(0, 8);
    box.innerHTML = list.length
      ? `<div class="answer-card"><div class="answer-head"><h3>和“${esc(q)}”有关的词</h3></div><p class="answer-why">没找到完全对应的感觉，这些词可能是你要的。</p><div class="grid">${list.map(card).join('')}</div></div>`
      : '<div class="empty">没找到对应的词。换个说法试试，比如“不高级”“太乱”“点了没反应”。</div>';
    hydrate(box); return;
  }
  const ids = v.terms.map((t) => t[2]).filter((id) => byId[id]);
  box.innerHTML = `<div class="answer-card">
    <div class="answer-head"><s>“${esc(q)}”</s><h3>换成这些词，AI 就懂了</h3></div>
    <p class="answer-why">${esc(v.why)}</p>
    <div class="term-pills">${v.terms.map(([en, zh, id]) => id && byId[id] ? `<a class="term-pill" href="#${id}">${esc(zh)}<small>${esc(en)}</small></a>` : `<span class="term-pill">${esc(zh)}<small>${esc(en)}</small></span>`).join('')}</div>
    <div class="say-this"><span class="label">直接发给 AI 的一段话</span><p>${esc(v.prompt)}</p>
      <div class="row"><button class="btn primary" id="copy-answer">复制这段话</button>${ids.length ? `<button class="btn" id="add-all">这 ${ids.length} 个词都放进篮子</button>` : ''}</div></div>
    <div class="grid compact">${ids.map((id) => card(byId[id])).join('')}</div></div>`;
  hydrate(box);
  $('#copy-answer').onclick = () => copy(v.prompt);
  const all = $('#add-all');
  if (all) all.onclick = () => { setBasket([...new Set([...basket, ...ids])], true); toast(`已放进篮子，现在一共 ${basket.length} 个词`); };
}
function renderHome() {
  const epItems = components.filter((c) => c.episode);
  $('#main').innerHTML = `
  <section class="hero" id="translator">
    <div class="eyebrow">江月 UI 设计 · 给 AI 描述界面的词典</div>
    <h1 class="h1">说对一个词，<br class="m-br">AI 就懂你的<em>审美</em></h1>
    <p class="lead">对 AI 说“不高级”，它只能瞎猜。说出你对界面的感觉，这里帮你换成专业词，再给你一句能直接发给 AI 的话。</p>
    <div class="feel-box">
      <label class="feel-input"><span>我觉得界面</span><input id="feel" placeholder="不高级、太乱、点了没反应…" autocomplete="off" enterkeyhint="search"></label>
      <div class="chips">${feels.map((f) => `<button type="button" class="chip">${esc(f)}</button>`).join('')}</div>
    </div>
    <div class="answer" id="answer"></div>
  </section>

  ${epItems.length ? `<section class="section">
    <div class="section-head"><div><h2 class="h2">视频里讲过的词</h2><p>刷到「给AI描述UI」系列来的？视频同款都在这里。</p></div></div>
    <div class="grid compact">${epItems.slice(0, 8).map(card).join('')}</div>
  </section>` : ''}

  <section class="section">
    <div class="section-head"><div><h2 class="h2">按主题翻</h2><p>${categories.length} 个主题、${components.length} 个词，从布局、配色到动效和体验。</p></div><a class="more" href="#all">看全部 →</a></div>
    <div class="cat-grid">${categories.map((c) => `<a class="cat-tile" href="#cat-${c.id}"><h3>${esc(c.name)}<span>${c.count}</span></h3><p>${esc(c.intro)}</p>
      <div class="names">${inCat(c.id).slice(0, 4).map((x) => esc(x.zh)).join(' · ')}</div></a>`).join('')}</div>
  </section>

  <section class="section">
    <div class="section-head"><div><h2 class="h2">三步用法</h2></div></div>
    <div class="steps"><div><b>找到那个词</b><span>在上面说出感觉，或者按主题翻、按 / 搜索</span></div>
      <div><b>看真实效果</b><span>每个词都有能点、能动的预览，确认就是你想要的</span></div>
      <div><b>复制给 AI</b><span>复制一句提示词；要改好几处就放进篮子，拼成一整段再发</span></div></div>
  </section>
  ${foot()}`;
  const feel = $('#feel');
  let timer;
  feel.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => renderAnswer(feel.value), 180); });
  feel.addEventListener('keydown', (e) => { if (e.key === 'Enter') { clearTimeout(timer); renderAnswer(feel.value); } });
  $('.chips').onclick = (e) => { const b = e.target.closest('.chip'); if (b) { feel.value = b.textContent; renderAnswer(feel.value); } };
  hydrate($('#main'));
  feel.value = pendingFeel || feels[0]; renderAnswer(feel.value);
  pendingFeel = null;
  document.title = '江月 UI · 给 AI 描述界面的词典';
}
const foot = () => `<footer class="site-foot"><span>江月 UI 设计 · MIT 开源</span><a href="../">UI 提示词图鉴</a><a href="https://github.com/MoonFlower-King/-UI-">GitHub</a><span>内容来自短视频系列「给AI描述UI的6个词」</span></footer>`;

/* ---------------- 页面：词典（全部 / 单个主题） ---------------- */
function filterBar(curId) {
  return `<nav class="filter" aria-label="按主题筛选"><a href="#all"${curId ? '' : ' aria-current="page"'}>全部<small>${components.length}</small></a>` +
    categories.map((c) => `<a href="#cat-${c.id}"${c.id === curId ? ' aria-current="page"' : ''}>${esc(c.name)}<small>${c.count}</small></a>`).join('') + '</nav>';
}
function renderAll() {
  $('#main').innerHTML = `<header class="page-head"><h1 class="h1">词典</h1><p class="lead">${components.length} 个界面术语，分成 ${categories.length} 个主题。鼠标放在卡片上能直接玩预览，点名字看代码。</p></header>
    ${filterBar()}
    ${categories.map((c) => `<section class="group"><div class="group-head"><h2>${esc(c.name)}</h2><p>${esc(c.intro)}</p><a href="#cat-${c.id}">只看这个主题</a></div>
      <div class="grid">${inCat(c.id).map(card).join('')}</div></section>`).join('')}${foot()}`;
  hydrate($('#main'));
  document.title = '词典 · 江月 UI';
}
function renderCategory(cat) {
  const list = inCat(cat.id);
  $('#main').innerHTML = `<header class="page-head"><div class="crumb"><a href="#all">词典</a> / ${esc(cat.name)}</div><h1 class="h1">${esc(cat.name)}</h1><p class="lead">${esc(cat.intro)}</p></header>
    ${filterBar(cat.id)}<div class="grid">${list.map(card).join('')}</div>${foot()}`;
  hydrate($('#main'));
  $('.filter [aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  document.title = `${cat.name} · 江月 UI`;
}

/* ---------------- 页面：词条详情 ---------------- */
function renderDetail(c) {
  const cat = catById[c.cat], sibs = inCat(c.cat), i = sibs.indexOf(c);
  const nextCat = categories[(categories.indexOf(cat) + 1) % categories.length];
  const prev = sibs[i - 1], next = sibs[i + 1];
  $('#main').innerHTML = `<div class="detail">
  <div>
    <header class="detail-head">
      <div class="crumb"><a href="#all">词典</a> / <a href="#cat-${cat.id}">${esc(cat.name)}</a>${c.episode ? `<span class="episode">视频 ${esc(c.episode)}</span>` : ''}</div>
      <h1>${esc(c.zh)}<span>${esc(c.en)}</span></h1>
      <p class="lead">${esc(c.lead)}</p>
      ${c.vague ? `<div class="swap">别再说 ${c.vague.map((v) => `<s>${esc(v)}</s>`).join('')}<i>→</i>换成 ${(c.terms || [c.en]).map((t) => `<b>${esc(t)}</b>`).join('')}</div>` : ''}
    </header>
    <div class="viewer">
      <div class="toolbar">
        <div class="seg" role="group" aria-label="视图"><button id="v-preview" aria-pressed="true">效果</button><button id="v-code" aria-pressed="false">代码</button></div>
        <div class="seg" role="group" aria-label="预览宽度" id="devices"><button data-d="desktop" aria-pressed="true">桌面</button><button data-d="tablet" aria-pressed="false">平板</button><button data-d="phone" aria-pressed="false">手机</button></div>
        <div class="end"><button class="btn sm ghost" id="replay">↻ 重播</button></div>
      </div>
      <div class="stage" id="stage" data-device="desktop"><div class="frame"><iframe id="preview" title="${esc(c.zh)} 实时预览"></iframe></div></div>
      <pre class="code" id="code" hidden></pre>
    </div>
  </div>
  <aside class="panel">
    <section class="ask"><h2>发给 AI 的一句话</h2><p>${esc(c.prompt)}</p>
      <button class="btn primary lg block" data-copy="${c.id}">复制这句话</button>
      <div class="row"><button class="btn add-btn" data-add="${c.id}"></button><button class="btn" id="copy-code">复制代码</button></div>
      <p class="hint">不会写代码也没关系：把这句话贴给你常用的 AI，它就会照着改。要改好几处，先都放进篮子再一起复制。</p></section>
    <nav class="pager">${prev ? `<a href="#${prev.id}"><small>← 上一个</small><b>${esc(prev.zh)}</b></a>` : ''}${next ? `<a href="#${next.id}"><small>下一个 →</small><b>${esc(next.zh)}</b></a>` : `<a href="#cat-${nextCat.id}"><small>下一个主题 →</small><b>${esc(nextCat.name)}</b></a>`}</nav>
    <div class="sibs"><h3>「${esc(cat.name)}」里的其他词</h3><div>${sibs.filter((x) => x !== c).map((x) => `<a href="#${x.id}">${esc(x.zh)}</a>`).join('')}</div></div>
  </aside></div>
  <div class="mbar"><button class="btn primary" data-copy="${c.id}">复制发给 AI 的一句话</button><button class="btn add-btn" data-add="${c.id}"></button></div>`;
  $('#code').textContent = c.code;
  const replay = () => { $('#preview').srcdoc = BASE + c.code; };
  const setView = (code) => { $('#v-preview').setAttribute('aria-pressed', !code); $('#v-code').setAttribute('aria-pressed', code); $('#stage').hidden = code; $('#code').hidden = !code; $('#devices').hidden = code; };
  $('#v-preview').onclick = () => setView(false);
  $('#v-code').onclick = () => setView(true);
  $('#replay').onclick = () => { setView(false); replay(); };
  $('#copy-code').onclick = () => copy(c.code, '代码已复制');
  $('#devices').onclick = (e) => {
    const d = e.target.dataset.d; if (!d) return;
    $('#stage').dataset.device = d; $$('#devices button').forEach((b) => b.setAttribute('aria-pressed', b === e.target));
  };
  $$('[data-add]', $('#main')).forEach(syncAddBtn);
  replay();
  document.title = `${c.zh} ${c.en} · 江月 UI`;
}

/* ---------------- 路由 ---------------- */
function route() {
  const h = decodeURIComponent(location.hash.slice(1)) || 'home', keepScroll = h === 'translator' || pendingFeel;
  let tab = 'home', curCat = '';
  if (byId[h]) { renderDetail(byId[h]); tab = 'all'; curCat = byId[h].cat; }
  else if (h.startsWith('cat-') && catById[h.slice(4)]) { renderCategory(catById[h.slice(4)]); tab = 'all'; curCat = h.slice(4); }
  else if (h === 'all') { renderAll(); tab = 'all'; }
  else renderHome();
  $$('[data-tab]').forEach((a) => (a.dataset.tab === tab ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
  renderSide(h, curCat);
  if (keepScroll) $('#translator')?.scrollIntoView(); else scrollTo({ top: 0 });
}
addEventListener('hashchange', route);
addEventListener('keydown', (e) => {
  const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
  if ((e.key === '/' && !typing) || (e.key === 'k' && (e.metaKey || e.ctrlKey))) { e.preventDefault(); openSearch(); }
  if (e.key === 'Escape') closeLayers();
});

setBasket(basket);
route();
