// 江月组件库：目录、搜索、预览/代码切换、复制。数据来自 data/components.js（由 scripts/build.mjs 生成）
const { components, vague, glossary } = window.UI_KIT;
const termCount = glossary.reduce((n, c) => n + c.terms.length, 0);
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// 预览 iframe 的底座：组件居中显示在浅灰背景上
const BASE = '<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#FAFAFA;color:#18181B;' +
  'font-family:-apple-system,BlinkMacSystemFont,"Inter","PingFang SC","Microsoft YaHei",sans-serif}</style>\n';

let current = null;

function renderNav() {
  const f = $('q').value.trim().toLowerCase();
  const hit = (c) => !f || [c.en, c.zh, c.group, ...c.vague, ...c.terms].join(' ').toLowerCase().includes(f);
  const list = components.filter(hit);
  const groups = [...new Set(list.map((c) => c.group))];
  const here = location.hash.slice(1) || 'guide';
  $('nav').innerHTML =
    `<div class="group">开始</div><a href="#guide" ${here === 'guide' ? 'aria-current="page"' : ''}>说不清怎么办<small>速查</small></a>` +
    `<a href="#glossary" ${here.startsWith('glossary') ? 'aria-current="page"' : ''}>UI 术语词典<small>${termCount} 个词</small></a>` +
    (groups.map((g) => `<div class="group">${esc(g)}</div>` + list.filter((c) => c.group === g)
      .map((c) => `<a href="#${c.id}" ${c.id === here ? 'aria-current="page"' : ''}>${esc(c.zh)}<small>${esc(c.en)}</small></a>`).join('')).join('') ||
      '<div class="group">没有找到，换个说法试试</div>');
}

function renderGuide() {
  $('guide').innerHTML = vague.map((v, i) => `
    <article class="card">
      <h3>“${esc(v.vague)}”</h3>
      <p>${esc(v.why)}</p>
      <div class="terms">${v.terms.map(([en, zh, id]) => id
        ? `<a class="term" href="#${id}">${esc(en)} · ${esc(zh)}</a>`
        : `<span class="term">${esc(en)} · ${esc(zh)}</span>`).join('')}</div>
      <blockquote>${esc(v.prompt)}</blockquote>
      <button type="button" class="btn copy" data-i="${i}">复制这句提示词</button>
    </article>`).join('');
}

function renderGlossary() {
  const f = $('gq').value.trim().toLowerCase();
  const hit = (t) => !f || t.slice(0, 4).join(' ').toLowerCase().includes(f);
  const cats = glossary.map((c) => ({ ...c, list: c.terms.filter(hit) })).filter((c) => c.list.length);
  $('cats').innerHTML = cats.map((c) => `<a href="#glossary-${c.id}">${esc(c.name)}<small>${c.list.length}</small></a>`).join('');
  $('glossary-list').innerHTML = cats.map((c) => `
    <section class="cat" id="glossary-${c.id}">
      <h2>${esc(c.name)}</h2>
      <p>${esc(c.intro)}</p>
      <div class="terms-grid">${c.list.map(([en, zh, say, eg, id]) => `
        <article class="tcard">
          <div class="en">${esc(en)}</div>
          <div class="zh">${esc(zh)}</div>
          <p>${esc(say)}</p>
          ${id ? `<a class="see" href="#${id}">看组件和代码 →</a>` : ''}
          <div class="eg"><span>${esc(eg)}</span><button type="button" data-copy="${esc(eg)}">复制</button></div>
        </article>`).join('')}</div>
    </section>`).join('') || '<p class="lead">没有找到，换个说法试试。</p>';
}

function showComponent(c) {
  current = c;
  const i = components.indexOf(c);
  $('crumb').textContent = `组件 / ${c.group}` + (c.episode ? ` · 视频 ${c.episode}` : '');
  $('title').innerHTML = `${esc(c.zh)}<span>${esc(c.en)}</span>`;
  $('lead').textContent = c.lead;
  $('vague').innerHTML = c.vague.map((v) => `<s>${esc(v)}</s>`).join('') + '<i>→ 换成</i>' + c.terms.map((t) => `<b>${esc(t)}</b>`).join('');
  $('code').textContent = c.code;
  $('prompt').textContent = c.prompt;
  replay();
  const prev = components[i - 1], next = components[i + 1];
  $('pager').innerHTML =
    (prev ? `<a href="#${prev.id}"><small>上一个</small>${esc(prev.zh)}</a>` : '') +
    (next ? `<a class="next" href="#${next.id}"><small>下一个</small>${esc(next.zh)}</a>` : '');
  document.title = `${c.zh} ${c.en} · 江月组件库`;
}

function replay() { if (current) $('preview').srcdoc = BASE + current.code; }

function route() {
  const id = location.hash.slice(1);
  const c = components.find((x) => x.id === id);
  const gloss = id.startsWith('glossary');
  $('view-component').hidden = !c;
  $('view-glossary').hidden = !gloss;
  $('view-guide').hidden = !!c || gloss;
  if (c) showComponent(c);
  else { current = null; document.title = gloss ? 'UI 术语词典 · 江月组件库' : '江月组件库'; }
  renderNav();
  const anchor = gloss && id !== 'glossary' && document.getElementById(id);
  if (anchor) anchor.scrollIntoView(); else scrollTo({ top: 0 });
}

function setView(code) {
  $('v-preview').setAttribute('aria-pressed', String(!code));
  $('v-code').setAttribute('aria-pressed', String(code));
  $('stage').hidden = code;
  $('code').hidden = !code;
}

let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
}
function copy(text, el, done) {
  const fallback = () => {
    const r = document.createRange(); r.selectNodeContents(el);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    toast('已选中，按 Ctrl+C 复制');
  };
  if (!navigator.clipboard) return fallback();
  navigator.clipboard.writeText(text).then(() => toast(done), fallback);
}

$('v-preview').onclick = () => setView(false);
$('v-code').onclick = () => setView(true);
$('replay').onclick = () => { setView(false); replay(); };
$('devices').addEventListener('click', (e) => {
  const d = e.target.dataset.d;
  if (!d) return;
  $('stage').dataset.device = d;
  $('devices').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === e.target)));
});
$('copy-code').onclick = () => { setView(true); copy(current.code, $('code'), '代码已复制'); };
$('copy-prompt').onclick = () => copy(current.prompt, $('prompt'), '提示词已复制，粘贴给 AI 就行');
$('guide').addEventListener('click', (e) => {
  const b = e.target.closest('.copy');
  if (b) copy(vague[b.dataset.i].prompt, b.previousElementSibling, '提示词已复制');
});
$('q').addEventListener('input', renderNav);
$('gq').addEventListener('input', renderGlossary);
$('glossary-list').addEventListener('click', (e) => {
  const b = e.target.closest('[data-copy]');
  if (b) copy(b.dataset.copy, b.previousElementSibling, '已复制，粘贴给 AI 就行');
});
addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== $('q')) { e.preventDefault(); $('q').focus(); }
});
addEventListener('hashchange', route);

renderGuide();
$('glossary-lead').textContent = `${glossary.length} 个主题、${termCount} 个专业词。每个词都有一句大白话解释，和一句可以直接复制给 AI 的说法。`;
renderGlossary();
route();
