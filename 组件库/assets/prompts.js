// 提示词调配台（prompts.html）。数据来自 data/prompts.js（首屏索引）、data/prompt-text/（提示词全文）和 data/prompt-code/（预览代码），
// 都由 npm run build:ui 生成；后两种按分组拆开，用到才下载。$、esc、store、toast、copy、明暗切换在 assets/common.js。
// 页面分两块：左边按「视频 / 图片 / 网站风格」排的词卡，右边（手机上是底部抽屉）把勾选的词拼成一段提示词。
const { kinds, groups, items, stages, kits = {}, layouts = {}, tags = [] } = window.JY_PROMPTS;
const byId = Object.fromEntries(items.map((x) => [x.id, x]));
const groupById = Object.fromEntries(groups.map((g) => [g.id, g]));
const kindById = Object.fromEntries(kinds.map((k) => [k.id, k]));

/* ---------------- 按分组下载全文和预览代码 ---------------- */
// 用 <script> 而不是 fetch，直接双击打开 html 也能用；同一个文件只下载一次
const loads = {};
const load = (dir, global, g) => (loads[`${dir}/${g}`] ||= new Promise((ok, no) => {
  const s = document.createElement('script');
  s.src = `data/${dir}/${g}.js${V}`; s.onload = () => ok(window[global][g]); s.onerror = () => { delete loads[`${dir}/${g}`]; s.remove(); no(); };
  document.head.append(s);
}));
const loadCode = (g) => load('prompt-code', 'JY_PROMPT_CODE', g);
// 全文下载后直接并进词条对象，之后 it.prompt 等字段就能用了
const hasText = (id) => 'prompt' in byId[id];
const loadText = (g) => load('prompt-text', 'JY_PROMPT_TEXT', g).then((t) => {
  for (const [id, x] of Object.entries(t)) if (!hasText(id)) { Object.assign(byId[id], x); fillText(id); }
});
const needText = (ids) => Promise.all([...new Set(ids.map((id) => byId[id].group))].map(loadText));

/* ---------------- 状态：勾了哪些词、用哪种语言、每类填的主体 ---------------- */
let picked = store.get('jy-mix', []).filter((id) => byId[id]);
let lang = store.get('jy-mix-lang', 'zh');
const subjects = store.get('jy-mix-subjects', {});
const save = () => { store.set('jy-mix', picked); store.set('jy-mix-lang', lang); store.set('jy-mix-subjects', subjects); };
const PRESETS = [
  { name: '人物登场', note: '推镜头 + 特写', ids: ['dolly-in', 'close-up'] },
  { name: '安静人像', note: '伦勃朗光 + 负空间', ids: ['rembrandt-light', 'negative-space'] },
  { name: '书房官网', note: '东方雅致', ids: ['oriental'] },
];

function toggle(id) {
  const it = byId[id], g = groupById[it.group];
  if (picked.includes(id)) { picked = picked.filter((x) => x !== id); }
  else {
    // exclusive：几个组共用一个「只能选一个」，比如 50 种网站风格分成 6 组，但整站只能有一种主风格
    const key = (x) => x.exclusive || x.id;
    const same = g.pick === 'one' ? picked.find((x) => key(groupById[byId[x].group]) === key(g)) : null;
    picked = [...picked.filter((x) => x !== same), id];
    if (same) toast(`「${g.label || g.name}」只选一个，已换成${it.zh}`);
  }
  save(); syncCards(); renderComposer();
}

/* ---------------- 拼提示词 ---------------- */
function compile() {
  const en = lang === 'en', out = [], neg = [];
  for (const k of kinds) {
    const mine = picked.map((id) => byId[id]).filter((it) => groupById[it.group].kind === k.id);
    if (!mine.length) continue;
    const subject = (subjects[k.id] || '').trim() || (en ? k.subjectEgEn : k.subjectEg);
    const lines = [`${en ? k.headEn : k.head}${en ? ': ' : '：'}${subject}${en ? '.' : '。'}`];
    for (const g of groups.filter((x) => x.kind === k.id)) {
      const its = mine.filter((it) => it.group === g.id);
      if (its.length) lines.push(`${en ? g.labelEn || g.en : g.label || g.name}${en ? ': ' : '：'}${its.map((it) => en ? it.promptEn : it.prompt).join(en ? '; then ' : '；随后')}${en ? '.' : '。'}`);
    }
    mine.forEach((it) => { if (it.neg) neg.push(it.neg[en ? 1 : 0]); });
    out.push(lines.join('\n'));
  }
  return { text: out.join('\n\n'), neg: [...new Set(neg)].join(en ? ', ' : '、') };
}

function renderComposer() {
  const box = $('#composer'), n = picked.length;
  const bar = $('#mix-bar');
  bar.hidden = false;
  bar.innerHTML = n ? `<b>${n}</b> 个词已选 · 查看拼好的提示词<span aria-hidden="true">↑</span>` : '拼提示词 · 先试一个示例组合<span aria-hidden="true">↑</span>';
  if (!n) {
    box.innerHTML = `<header class="comp-head"><h2>拼提示词</h2><button class="icon-btn comp-close" type="button" data-close-comp aria-label="收起"><svg viewBox="0 0 20 20"><path d="m5 5 10 10M15 5 5 15"/></svg></button></header>
      <p class="comp-empty">点卡片上的「+ 选用」，这里会把选中的词拼成一段完整的提示词，中英文都有。</p>
      <div class="presets"><span>或者先试一个组合：</span>${PRESETS.map((p, i) => `<button class="preset" data-preset="${i}"><b>${esc(p.name)}</b><small>${esc(p.note)}</small></button>`).join('')}</div>`;
    return;
  }
  // 选中的词里有分组的全文还没下载（比如上次选的词在页面下方）：先下载，下载完再画一遍
  const ready = picked.every(hasText);
  if (!ready) needText(picked).then(renderComposer, () => toast('提示词没下载下来，检查网络后刷新试试'));
  const { text, neg } = ready ? compile() : { text: '正在载入提示词…', neg: '' };
  const usedKinds = kinds.filter((k) => picked.some((id) => groupById[byId[id].group].kind === k.id));
  box.innerHTML = `<header class="comp-head"><h2>拼好的提示词</h2>
      <div class="seg" role="group" aria-label="语言"><button data-lang="zh" aria-pressed="${lang === 'zh'}">中文</button><button data-lang="en" aria-pressed="${lang === 'en'}">English</button></div>
      <button class="icon-btn comp-close" type="button" data-close-comp aria-label="收起"><svg viewBox="0 0 20 20"><path d="m5 5 10 10M15 5 5 15"/></svg></button></header>
    ${usedKinds.map((k) => `<label class="comp-subject"><span>${esc(k.subject)}</span><input data-subject="${k.id}" value="${esc(subjects[k.id] || '')}" placeholder="${esc(lang === 'en' ? k.subjectEgEn : k.subjectEg)}" autocomplete="off"></label>`).join('')}
    <ul class="comp-picks">${picked.map((id) => `<li><span>${esc(byId[id].zh)}<small>${esc(groupById[byId[id].group].name)}</small></span><button data-toggle="${id}" aria-label="去掉 ${esc(byId[id].zh)}"><svg viewBox="0 0 20 20"><path d="m6 6 8 8M14 6l-8 8"/></svg></button></li>`).join('')}</ul>
    <label class="comp-out"><span>正面提示词（可以直接改）</span><textarea id="out" rows="9"${ready ? '' : ' disabled'}>${esc(text)}</textarea></label>
    ${neg ? `<label class="comp-out neg"><span>反面提示词（贴进「不希望出现」那一栏）</span><textarea id="neg" rows="2">${esc(neg)}</textarea></label>` : ''}
    <div class="comp-actions"><button class="btn ghost" data-clear>清空</button><button class="btn primary" data-copy-all${ready ? '' : ' disabled'}>复制全部</button></div>
    <p class="hint">支持单独「反面提示词」输入框的工具（多数生图、生视频工具都有），把下面那段分开贴效果更好；没有的话直接复制全部即可。</p>`;
}

const composer = $('#composer');
composer.addEventListener('click', (e) => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.lang) { lang = t.dataset.lang; save(); renderComposer(); }
  else if (t.dataset.toggle) toggle(t.dataset.toggle);
  else if (t.dataset.preset) { picked = [...PRESETS[+t.dataset.preset].ids]; save(); syncCards(); renderComposer(); toast('已选好示例组合，可以接着改'); }
  else if ('clear' in t.dataset) { picked = []; save(); syncCards(); renderComposer(); }
  else if ('copyAll' in t.dataset) {
    const out = $('#out').value, neg = $('#neg')?.value;
    copy(neg ? `${out}\n\n${lang === 'en' ? 'Negative prompt' : '反面提示词'}${lang === 'en' ? ': ' : '：'}${neg}` : out, '整段提示词已复制');
  } else if ('closeComp' in t.dataset) composer.classList.remove('open');
});
composer.addEventListener('input', (e) => {
  const k = e.target.dataset.subject; if (!k) return;
  subjects[k] = e.target.value; save();
  if (picked.every(hasText)) $('#out').value = compile().text;
});
$('#mix-bar').onclick = () => composer.classList.add('open');

/* ---------------- 词卡预览 ---------------- */
// 预览只有 HTML + CSS，直接画进卡片的 Shadow DOM，不开 iframe：
// 快到屏幕时才画（提前 600px），离开屏幕就暂停动画，所以页面再长也不卡、不费电。
const SHADOW_CSS = ':host{all:initial;display:block;position:relative;width:100%;height:100%;overflow:hidden;background:#FAFAFA;color:#18181B;' +
  'font-family:-apple-system,BlinkMacSystemFont,"Inter","PingFang SC","Microsoft YaHei",sans-serif}' +
  ':host(:not(.run)) *,:host(:not(.run)) *::before,:host(:not(.run)) *::after{animation-play-state:paused!important}' +
  '@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important}}';
// 预览代码和提示词全文按分组放在 data/prompt-code/、data/prompt-text/，第一次画到这一组时才下载
async function paint(host) {
  if (host.shadowRoot) return;
  const it = byId[host.dataset.id], stage = groupById[it.group].stage;
  loadText(it.group).catch(() => {});
  const code = (await loadCode(it.group))[it.id];
  if (host.shadowRoot) return;
  host.attachShadow({ mode: 'open' }).innerHTML = `<style>${SHADOW_CSS}</style>${stage ? stages[stage] : ''}\n${it.kit ? `<style>${kits[it.kit]}</style>` : ''}${it.layout ? `<style>${kits[`layout-${it.layout}`]}</style>` : ''}${code}`;
  host.closest('.thumb').classList.add('ready');
}
const painter = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { painter.unobserve(e.target); paint(e.target); } }), { rootMargin: '600px 0px' });
const runner = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('run', e.isIntersecting)), { rootMargin: '40px 0px' });
const fit = new ResizeObserver((es) => es.forEach((e) => e.target.style.setProperty('--tw', e.contentRect.width)));

function card(it) {
  return `<article class="card mix-card" data-card="${it.id}">
    <div class="thumb" data-toggle="${it.id}"><div class="poster" data-id="${it.id}" aria-hidden="true"></div><span class="tick" aria-hidden="true">✓</span>${it.layout ? `<span class="lay">版式 · ${esc(layouts[it.layout])}</span>` : ''}</div>
    <div class="mix-body">
      <div class="mix-title"><h3>${esc(it.zh)}<small>${esc(it.en)}</small></h3><button class="pick-btn" data-toggle="${it.id}"></button></div>
      <p class="mix-lead">${esc(it.lead)}</p>
      <details data-text="${it.id}"><summary>提示词 · 容易用错的地方</summary>${hasText(it.id) ? textBody(it) : '<p class="mix-loading">正在载入…</p>'}</details>
    </div></article>`;
}
// 卡片折叠区里的提示词全文：这一组的全文下载好之后填进去
const textBody = (it) => `<dl><dt>中文</dt><dd>${esc(it.prompt)}</dd><dt>English</dt><dd lang="en">${esc(it.promptEn)}</dd>
        <dt class="warn">容易用错</dt><dd>${esc(it.avoid)}</dd>${it.tip ? `<dt>小贴士</dt><dd>${esc(it.tip)}</dd>` : ''}${it.alias ? `<dt>也叫</dt><dd>${it.alias.map(esc).join('、')}</dd>` : ''}</dl>
        <button class="btn sm" data-copy-one="${it.id}">复制这一句</button>`;
function fillText(id) {
  const d = document.querySelector(`details[data-text="${id}"]`);
  if (d) d.innerHTML = `<summary>提示词 · 容易用错的地方</summary>${textBody(byId[id])}`;
}
function syncCards() {
  $$('[data-card]').forEach((c) => {
    const on = picked.includes(c.dataset.card);
    c.classList.toggle('on', on);
    const b = $('.pick-btn', c); b.textContent = on ? '✓ 已选' : '+ 选用'; b.setAttribute('aria-pressed', on);
  });
}

function renderMain() {
  $('#main').innerHTML = `<header class="page-head mix-hero">
      <div class="eyebrow">江月 UI 设计 · 试做中</div>
      <h1 class="h1">提示词调配台</h1>
      <p class="lead">做视频、出图、做网站，最难的是跟 AI 说清楚「要什么样」。这里每个词都配一段会动的预览，看准了就勾上，右边自动拼成一段中英文提示词。每个词还写了<em>容易用错的地方</em>，别人的合集里几乎没有。</p>
    </header>
    <nav class="filter mix-filter" aria-label="跳到分类">${kinds.map((k) => `<a href="#k-${k.id}">${esc(k.name)}<small>${items.filter((it) => groupById[it.group].kind === k.id).length}</small></a>`).join('')}
      <input class="mix-search" type="search" placeholder="搜名字、别名或感觉，比如 复古" aria-label="搜索词条">
      <div class="mix-tags" role="group" aria-label="按标签筛选">${tagBar()}</div></nav>
    <p class="mix-none" hidden>没找到，换个词试试，比如中文名、英文名或「温暖」「科技」这类感觉。</p>
    ${kinds.map((k) => { const gs = groups.filter((g) => g.kind === k.id); return `<section class="kind" id="k-${k.id}"><header class="kind-head"><h2 class="h2">${esc(k.name)}<small>${esc(k.en)}</small></h2><p>${esc(k.intro)}</p>
      ${gs.length > 2 ? `<nav class="group-jump" aria-label="跳到分组">${gs.map((g) => `<a href="#g-${g.id}">${esc(g.name)}<small>${g.count}</small></a>`).join('')}</nav>` : ''}</header>
      ${gs.map((g) => `<div class="group" id="g-${g.id}"><div class="group-head"><h2>${esc(g.name)}</h2><span class="rule">${g.pick === 'one' ? '单选' : '可多选'}</span><p>${esc(g.intro)}</p></div>
        <div class="grid">${items.filter((it) => it.group === g.id).map(card).join('')}</div></div>`).join('')}</section>`; }).join('')}
    <footer class="site-foot"><span>江月 UI 设计 · MIT 开源</span><a href="index.html">江月 UI 词典</a><a href="../">UI 提示词图鉴</a><span>预览全部是原创代码；提示词为本站原创整理，可自由使用</span></footer>`;
  $$('.poster').forEach((p) => { painter.observe(p); runner.observe(p); });
  $$('.thumb').forEach((t) => fit.observe(t));
  syncCards();
  $('.mix-search').addEventListener('input', (e) => search(e.target.value));
}

// 顶部第二行的筛选标签：「感觉」可以多选（要同时符合），「版式」只能选一个；和搜索框的词一起生效。
// 感觉标签由构建脚本按 data/prompt-tags.json 打好，版式标签直接看词条的 layout
const layCount = items.reduce((m, it) => (it.layout && (m[it.layout] = (m[it.layout] || 0) + 1), m), {});
const pickTags = new Set();
let pickLay = '';
function tagBar() {
  const chip = (attr, id, name, n) => `<button type="button" class="chip" ${attr}="${id}" aria-pressed="false">${esc(name)}<small>${n}</small></button>`;
  // 「找到 N 个 / 清除」放在最前面：标签多、一行滑不完时也一眼看得到
  return `<span class="mix-count" hidden></span><button type="button" class="mix-clear" hidden>清除筛选</button><span class="lab">感觉</span>${tags.map((t) => chip('data-tag', t.id, t.name, t.count)).join('')}
    ${Object.keys(layCount).length ? `<span class="lab">版式</span>${Object.keys(layouts).filter((k) => layCount[k]).map((k) => chip('data-lay', k, layouts[k], layCount[k])).join('')}` : ''}
`;
}
$('#main').addEventListener('click', (e) => {
  const b = e.target.closest('.mix-tags button'); if (!b) return;
  if (b.dataset.tag) pickTags.has(b.dataset.tag) ? pickTags.delete(b.dataset.tag) : pickTags.add(b.dataset.tag);
  else if (b.dataset.lay) pickLay = pickLay === b.dataset.lay ? '' : b.dataset.lay;
  else { pickTags.clear(); pickLay = ''; $('.mix-search').value = ''; }
  $$('.mix-tags [data-tag]').forEach((x) => x.setAttribute('aria-pressed', pickTags.has(x.dataset.tag)));
  $$('.mix-tags [data-lay]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.lay === pickLay));
  search($('.mix-search').value);
  b.isConnected && !b.hidden && b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  // 筛完内容变短了：如果已经滚到下面，回到结果的开头
  const topH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--top-h')) || 0;
  const y = $('.mix-none').getBoundingClientRect().top + scrollY - $('.mix-filter').offsetHeight - topH;
  if (scrollY > y) scrollTo({ top: y });
});

// 搜索：按分组名、中英文名、别名、简介、提示词匹配，空格分开的几个词要同时命中；没命中的卡片、分组、大类都藏起来。
// 提示词全文第一次搜索时才下载全部分组，下载完再搜一遍；在那之前先用名字、简介这些首屏就有的字段搜
const haystack = (it) => {
  if (it.hay) return it.hay;
  const s = [groupById[it.group].name, layouts[it.layout] || '', it.zh, it.en, ...(it.alias || []), it.lead, it.prompt || '', it.promptEn || ''].join(' ').toLowerCase();
  if (hasText(it.id)) it.hay = s;
  return s;
};
let allText;
function search(q) {
  if (q.trim() && !allText) allText = Promise.all(groups.map((g) => loadText(g.id))).then(() => search($('.mix-search').value), () => { allText = null; });
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const ok = (it) => words.every((w) => haystack(it).includes(w)) && [...pickTags].every((t) => it.tags?.includes(t)) && (!pickLay || it.layout === pickLay);
  let n = 0;
  $$('[data-card]').forEach((c) => { c.hidden = !ok(byId[c.dataset.card]); n += !c.hidden; });
  const on = words.length || pickTags.size || pickLay;
  $('.mix-count').hidden = $('.mix-clear').hidden = !on;
  $('.mix-count').textContent = `找到 ${n} 个`;
  $$('#main .group').forEach((g) => { g.hidden = !$('[data-card]:not([hidden])', g); });
  $$('#main .kind').forEach((k) => { k.hidden = !$('.group:not([hidden])', k); });
  $('.mix-none').hidden = !!$('#main .kind:not([hidden])');
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('#main [data-toggle]'); if (t) toggle(t.dataset.toggle);
  const c = e.target.closest('[data-copy-one]'); if (c) copy(lang === 'en' ? byId[c.dataset.copyOne].promptEn : byId[c.dataset.copyOne].prompt); // 按钮只在全文到了之后才出现
});
addEventListener('keydown', (e) => { if (e.key === 'Escape') composer.classList.remove('open'); });

renderMain();
renderComposer();
