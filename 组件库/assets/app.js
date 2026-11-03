// 江月 UI 文档站。数据来自 data/components.js（npm run build:ui 生成）。
// 路由：#home 首页（感觉翻译器）· #all 词典全部 · #cat-<主题> 单个主题 · #<组件 id> 词条详情
// 搜索不占路由：按 / 或 Ctrl/⌘+K 打开搜索面板，手机上点底部「搜索」。
const { categories, components, vague } = window.UI_KIT;
const byId = Object.fromEntries(components.map((c) => [c.id, c]));
const catById = Object.fromEntries(categories.map((c) => [c.id, c]));
const inCat = (id) => components.filter((x) => x.cat === id);
// 组件代码按主题分文件（data/code/<主题>.js），用到哪个主题才加载哪个，组件再多首页也不变慢。
// 用 <script> 而不是 fetch：双击 index.html（file://）时也能用。
const codeLoads = {};
// 生成的「管理后台」案例：en 是英文提示词；chunks 是共用代码，数据里用 \u0001编号\u0001 代替，这里还原成完整代码
window.JY_CODE = (cat, map, en, chunks) => {
  for (const id in map) if (byId[id]) {
    byId[id].code = chunks ? map[id].replace(/\u0001(\d+)\u0001/g, (_, i) => chunks[i]) : map[id];
    if (en && en[id]) byId[id].promptEn = en[id];
  }
};
function loadCode(cat) {
  return codeLoads[cat] ||= new Promise((ok, no) => {
    const s = document.createElement('script');
    s.src = `data/code/${cat}.js`;
    s.onload = ok;
    s.onerror = () => { delete codeLoads[cat]; s.remove(); no(new Error(cat)); }; // 网络抖一下的话，下次用到再试
    document.head.append(s);
  });
}
const withCode = (c) => (c.code != null ? Promise.resolve(c) : loadCode(c.cat).then(() => c));
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const feels = vague.map((v) => v.vague.split(/\s*\/\s*/)[0]);

// 组件预览底座：浅色画布、内容居中（组件代码都按浅色背景写）
// 预览 iframe 和外层页面是同源的：组件里的 focus() / scrollIntoView() 会顺带把外层页面也滚过去，
// 很多卡片同时在播时页面就会被拽来拽去（看着像「自己跳回上面」）。这里让它们只在预览框里生效。
function guard() {
  // 点 href="#..." 的链接会跳到锚点，同样会滚动外层页面；预览里不需要真的跳
  addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('a[href^="#"]'); if (a) e.preventDefault(); }, true);
  // 聚焦预览里的元素时，浏览器会连带把外层页面滚到这个 iframe；这里先记住外层位置，做完立刻还原（同一帧内，看不出来）
  const keep = (fn) => {
    let x, y; try { x = parent.scrollX; y = parent.scrollY; } catch { return fn(); }
    const r = fn(); if (parent.scrollX !== x || parent.scrollY !== y) parent.scrollTo(x, y); return r;
  };
  const busy = () => { try { const a = parent.document.activeElement; return a && a !== parent.document.body && a.tagName !== 'IFRAME'; } catch { return false; } };
  const focus = HTMLElement.prototype.focus, click = HTMLElement.prototype.click;
  HTMLElement.prototype.focus = function (o) {
    // 用户正在外层页面打字（比如搜索框）时，演示不能把焦点抢走
    if (!document.hasFocus() && busy()) return;
    keep(() => focus.call(this, Object.assign({}, o, { preventScroll: true })));
  };
  HTMLElement.prototype.click = function () { return keep(() => click.call(this)); }; // 点 label 也会顺带聚焦
  Element.prototype.scrollIntoView = function (o) {
    o = typeof o === 'object' && o ? o : { block: o === false ? 'end' : 'start' };
    let p = this.parentElement;
    while (p && p !== document.body && p !== document.documentElement && !(p.scrollHeight > p.clientHeight + 1 || p.scrollWidth > p.clientWidth + 1)) p = p.parentElement;
    if (!p || p === document.body || p === document.documentElement) return;
    const a = this.getBoundingClientRect(), b = p.getBoundingClientRect();
    const at = (pos, s, d, len, box) => pos === 'center' ? s + d - (box - len) / 2 : pos === 'end' ? s + d - box + len
      : pos === 'nearest' ? (d < 0 ? s + d : d + len > box ? s + d + len - box : s) : s + d;
    p.scrollTo({ behavior: o.behavior === 'smooth' ? 'smooth' : 'auto',
      left: at(o.inline || 'nearest', p.scrollLeft, a.left - b.left, a.width, p.clientWidth),
      top: at(o.block || 'start', p.scrollTop, a.top - b.top, a.height, p.clientHeight) });
  };
}
const BASE = '<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<style>html,body{height:100%}body{margin:0;min-height:100%;display:grid;place-items:center;background:#FAFAFA;color:#18181B;' +
  `font-family:-apple-system,BlinkMacSystemFont,"Inter","PingFang SC","Microsoft YaHei",sans-serif}</style><script>(${guard})()<\/script>\n`;

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
// 2. 上层「自动演示」iframe（assets/autoplay.js）：卡片进入屏幕才临时建一个 iframe，加载好后淡入盖住首帧；
//    滚出去就把 iframe 整个删掉（连同里面的网页），所以几百张卡片的页面也只有屏幕里那几个 iframe，省内存、省 CPU。
// 所有预览和网页共用一条主线程，所以 iframe 一次只启动一张、错开 60ms，离屏幕中心近的先开。
// 鼠标移进卡片：从头重播一遍；访客自己点一下就接管。系统开了「减少动态效果」就不自动演示。
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const canHover = matchMedia('(hover: hover)').matches;
const AUTO = window.JY_AUTOPLAY;
const tidy = (c) => c.code.replace(/\sautofocus\b/g, ''); // autofocus 同样会把外层页面滚过去
// 组件大小只需要量一次（measured），之后每轮重播不再重复测量，省下不少 CPU
const measured = new Set();
const doc = (c) => {
  if (!AUTO) return BASE + tidy(c);
  const fit = measured.has(c.id) || c.canvas ? '' : `(${AUTO.fit})();`;
  return calm.matches ? `${BASE}${tidy(c)}\n<script>${fit}<\/script>`
    : `${BASE}<script>(${AUTO.pre})()<\/script>\n${tidy(c)}\n<script>${fit}(${AUTO.post})()<\/script>`;
};

// 预览占满：组件按 560×350 的画布写，但很多只占中间一小块。量出实际大小后，把预览「视口」缩到刚好包住它，
// 再整体放大到卡片宽度，组件就占满预览框。每个组件只量一次，记在 fitCache 里。
const fitCache = {};
// 整页案例（元信息里写了 canvas，比如管理后台）按固定画布宽度缩放，不用量
const vwOf = (c) => c.canvas || fitCache[c.id];
function setFit(id, w, h) {
  if (!(w > 0) || byId[id].canvas) return;
  const need = Math.round(Math.min(560, Math.max(240, w * 1.1, h * 1.36 * 1.6)));
  if (fitCache[id] && need <= fitCache[id] + 2) return; // 只放宽、不收窄，避免来回跳
  fitCache[id] = Math.max(need, fitCache[id] || 0);
  $$(`.thumb[data-id="${id}"]`).forEach((t) => t.style.setProperty('--vw', fitCache[id]));
}
// 量 Shadow DOM 首帧里组件的实际大小（换算回预览视口里的像素）
function measurePoster(id, host, root) {
  if (byId[id].canvas) return;
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
  const c = byId[t.dataset.id], host = t.querySelector('.poster');
  if (!host || host.shadowRoot) return;
  if (c.code == null) { withCode(c).then(() => t.isConnected && paintPoster(t), () => {}); return; }
  const html = c.code.replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/(^|[\s,}>])(:root|html|body)(?=\s*[{,.:#\[\s])/g, '$1:host');
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>${POSTER_CSS}</style>${html}`;
  // 入场动画（只播一次的）直接跳到最后一帧，否则暂停在第 0 帧时元素还是透明的，卡片看着像空白或半透明
  if (root.getAnimations) root.getAnimations().forEach((a) => {
    const end = a.effect && a.effect.getComputedTiming().endTime;
    if (isFinite(end)) a.currentTime = end;
  });
  t.classList.add('ready');
  // 首帧画好就顺手量一下组件大小，预览立刻按实际大小放大；放大后可能换行变高，下一帧再量一次确认装得下
  measurePoster(c.id, host, root);
}
// 首帧：屏幕里的立刻画，屏幕外（提前 600px）的在浏览器空闲时分批画，不和滚动抢主线程
const posterQueue = new Set();
const idle = window.requestIdleCallback || ((fn) => setTimeout(() => fn({ timeRemaining: () => 8 }), 32));
let painting = false;
function paintSome(deadline) {
  // 每批至少画 2 张：页面一直有动画时浏览器几乎没有「空闲」，只等空闲会让首帧永远排不上
  let n = 0;
  for (const t of posterQueue) {
    if (n >= 2 && (n >= 6 || deadline.timeRemaining() < 4)) break;
    posterQueue.delete(t); n++; if (t.isConnected) paintPoster(t);
  }
  posterQueue.size ? idle(paintSome, { timeout: 200 }) : (painting = false);
}
const posters = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  posters.unobserve(e.target);
  // 已经在屏幕里的立刻画；还在屏幕外的（提前 600px）排队，空闲时分批画
  const r = e.boundingClientRect;
  if (r.bottom > 0 && r.top < innerHeight) { posterQueue.delete(e.target); paintPoster(e.target); return; }
  posterQueue.add(e.target);
  if (!painting) { painting = true; idle(paintSome, { timeout: 200 }); }
}), { rootMargin: '600px 0px' });

// 屏幕里看得到的卡片全部一起播放、一直循环（作者明确要求，不要设上限），滑出屏幕的立刻停掉、换回静态首帧。
// 新进屏幕的卡片按离屏幕中心由近到远、每隔一小会儿开一张，避免一下子全挤在同一帧里卡住。
// 下面的 t 都是卡片里的 .thumb，播放时 t.frame 是临时建的 iframe。
const inView = new Set(), playing = new Set(), queue = new Set();
let pumping = false, hovered = null, pickTimer;
function frameOf(t) {
  if (t.frame) return t.frame;
  const f = t.frame = document.createElement('iframe');
  f.className = 'swap'; f.tabIndex = -1; f.title = `${byId[t.dataset.id].zh} 预览`;
  f.addEventListener('load', () => { if (f.srcdoc) { f.classList.remove('swap'); f.dataset.live = 1; } });
  t.append(f);
  return f;
}
const swap = (t, fade) => withCode(byId[t.dataset.id]).then((c) => {
  if (!playing.has(t)) return;
  const f = frameOf(t);
  if (!fade) { f.srcdoc = doc(c); return; }
  f.classList.add('swap');
  setTimeout(() => { if (playing.has(t) && t.frame === f) f.srcdoc = doc(c); }, 180);
}, () => {});
function pump() {
  const t = queue.values().next().value;
  if (!t) { pumping = false; return; }
  queue.delete(t); pumping = true; if (playing.has(t)) swap(t, t.frame?.dataset.live);
  setTimeout(pump, 60);
}
const load = (t, now) => { queue.delete(t); if (now) swap(t, true); else { queue.add(t); if (!pumping) pump(); } };
const stop = (t) => { playing.delete(t); queue.delete(t); if (t.frame) { t.frame.remove(); t.frame = null; } };
function pick() {
  const mid = innerHeight / 2;
  const dist = (t) => { const r = t.getBoundingClientRect(); return Math.abs(r.top + r.height / 2 - mid) + Math.abs(r.left + r.width / 2 - innerWidth / 2) / 4; };
  const want = new Set([...inView].filter((t) => t.isConnected).sort((x, y) => dist(x) - dist(y)));
  if (hovered?.isConnected) want.add(hovered);
  playing.forEach((t) => { if (!want.has(t)) stop(t); });
  want.forEach((t) => { if (!playing.has(t)) { playing.add(t); load(t); } });
}
const repick = () => { clearTimeout(pickTimer); pickTimer = setTimeout(pick, 100); };
addEventListener('scroll', repick, { passive: true });
const watch = new IntersectionObserver((entries) => {
  // 露出一半以上才播放：被屏幕边缘切掉大半的卡片先显示静态首帧，一露出来就开始动
  entries.forEach((e) => { if (e.intersectionRatio >= .5) inView.add(e.target); else { inView.delete(e.target); if (playing.has(e.target)) stop(e.target); } });
  repick();
}, { threshold: [0, .5] });
addEventListener('message', (e) => {
  const t = [...playing].find((x) => x.frame?.contentWindow === e.source);
  if (!t) return;
  if (e.data === 'jy-replay') load(t);
  else if (e.data?.jyFit) { measured.add(t.dataset.id); setFit(t.dataset.id, ...e.data.jyFit); }
});
const fit = new ResizeObserver((entries) => entries.forEach((e) => e.target.style.setProperty('--tw', e.contentRect.width)));
function card(c) {
  return `<article class="card">
    <div class="thumb" data-id="${c.id}"${vwOf(c) ? ` style="--vw:${vwOf(c)}"` : ''}><div class="poster" aria-hidden="true"></div>
<span class="live">点一下，换你来玩</span></div>
    <div class="card-body"><h3 class="card-title"><a href="#${c.id}" title="${esc(c.lead)}">${esc(c.zh)}</a><small>${esc(c.en)}</small></h3>
      <div class="card-actions"><button class="glass-btn" data-copy="${c.id}">复制提示词</button><button class="glass-btn add-btn" data-add="${c.id}"></button></div></div>
  </article>`;
}
// 换页时上一页的卡片都被删掉了，把它们从播放名单里清出去
function forget() { [...inView].forEach((t) => { if (!t.isConnected) inView.delete(t); }); [...playing].forEach((t) => { if (!t.isConnected) stop(t); }); }
function hydrate(root) {
  forget();
  $$('.thumb', root).forEach((t) => {
    const cardEl = t.closest('.card');
    fit.observe(t); posters.observe(t); watch.observe(t);
    if (canHover) {
      cardEl.addEventListener('mouseenter', () => { hovered = t; if (!playing.has(t)) { playing.add(t); pick(); } load(t, true); });
      cardEl.addEventListener('mouseleave', () => { if (hovered === t) hovered = null; let stopped = false; try { stopped = t.frame.contentWindow.__jyStop; } catch {} if (stopped && playing.has(t)) load(t); repick(); });
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
const lazyGrids = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && lazyGrids.fill(e.target)), { rootMargin: '1600px 0px' });
function renderAll() {
  $('#main').innerHTML = `<header class="page-head"><h1 class="h1">词典</h1><p class="lead">${components.length} 个界面术语，分成 ${categories.length} 个主题。鼠标放在卡片上能直接玩预览，点名字看代码。</p></header>
    ${filterBar()}
    ${categories.map((c) => `<section class="group"><div class="group-head"><h2>${esc(c.name)}</h2><p>${esc(c.intro)}</p><a href="#cat-${c.id}">只看这个主题</a></div>
      <div class="grid" data-lazy="${c.id}"></div></section>`).join('')}${foot()}`;
  // 几百张卡片一次全塞进页面会卡：每个主题先放一个等高的空格子，快滚到时（提前约两屏）才真正生成卡片
  const grids = $$('[data-lazy]');
  grids.forEach((g) => {
    const cols = getComputedStyle(g).gridTemplateColumns.split(' ').length, w = g.clientWidth / cols;
    g.style.minHeight = Math.ceil(catById[g.dataset.lazy].count / cols) * (w / 1.6 + 76) + 'px';
  });
  const fill = (g) => { lazyGrids.unobserve(g); g.innerHTML = inCat(g.dataset.lazy).map(card).join(''); g.style.minHeight = ''; hydrate(g); };
  lazyGrids.disconnect();
  grids.forEach((g) => lazyGrids.observe(g));
  lazyGrids.fill = fill;
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
      <div class="stage${c.canvas ? ' wide' : ''}" id="stage" data-device="desktop"><div class="frame"><iframe id="preview" title="${esc(c.zh)} 实时预览"></iframe></div></div>
      <pre class="code" id="code" hidden></pre>
    </div>
  </div>
  <aside class="panel">
    <section class="ask${c.promptEn ? ' long' : ''}"><h2>发给 AI 的一句话</h2><p>${esc(c.prompt)}</p>
      <button class="btn primary lg block" data-copy="${c.id}">复制这句话</button>
      <div class="row"><button class="btn add-btn" data-add="${c.id}"></button><button class="btn" id="copy-code">复制代码</button></div>
      ${c.promptEn ? `<h2 class="en-h">English prompt</h2><p class="en">${esc(c.promptEn)}</p><button class="btn block" id="copy-en">复制英文提示词</button>` : ''}
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
  if (c.promptEn) $('#copy-en').onclick = () => copy(c.promptEn, '英文提示词已复制');
  // 整页案例（canvas）在「桌面」下按真实画布宽度渲染再整体缩小，看到的才是真正的桌面布局，而不是被挤成手机版
  const st = $('#stage'), fr = $('.frame', st);
  const fitWide = () => {
    if (!st.isConnected) return;
    const w = fr.clientWidth;
    const on = !!c.canvas && st.dataset.device === 'desktop' && w >= 560;
    st.classList.toggle('scaled', on);
    if (on) fr.style.setProperty('--k', w / c.canvas), fr.style.setProperty('--cw', c.canvas);
  };
  $('#devices').onclick = (e) => {
    const d = e.target.dataset.d; if (!d) return;
    $('#stage').dataset.device = d; $$('#devices button').forEach((b) => b.setAttribute('aria-pressed', b === e.target));
    fitWide();
  };
  if (c.canvas) new ResizeObserver(fitWide).observe(fr);
  $$('[data-add]', $('#main')).forEach(syncAddBtn);
  replay();
  document.title = `${c.zh} ${c.en} · 江月 UI`;
}

/* ---------------- 路由 ---------------- */
function route() {
  const h = decodeURIComponent(location.hash.slice(1)) || 'home', keepScroll = h === 'translator' || pendingFeel;
  let tab = 'home', curCat = '';
  if (byId[h] && byId[h].code == null) { // 词条页要用代码：先加载它所在主题的代码文件，再画页面
    withCode(byId[h]).then(() => byId[h].code != null && route(), () => toast('网络不太好，代码没加载出来，刷新试试'));
    return;
  }
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
