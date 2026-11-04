(() => {
  const { episodes, terms } = window.GLOSSARY;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const byId = Object.fromEntries(terms.map((t) => [t.id, t]));
  const byEp = Object.fromEntries(episodes.map((e) => [e.id, terms.filter((t) => t.episode === e.id)]));
  let current = 'all';

  $('#stats').innerHTML = `<span><b>${episodes.length}</b> 期</span><span><b>${terms.length}</b> 个术语</span><span>每个都有<b>实时动画</b></span><span>附<b>可直接用的代码</b></span>`;
  // 江月 UI 的组件数（同站点 /ui/ 下），读不到就保留默认文案
  const s = document.createElement('script');
  s.src = 'ui/data/stats.js'; // 只有一个数字，几十字节；不要读整份 components.js（几百 KB）
  s.onload = () => { const n = window.UI_KIT_STATS?.components; if (n) $('#kit-count').textContent = `${n} 个界面术语，每个都有实时效果和代码`; };
  document.head.append(s);

  // 分类：全部 + 每一期
  const chips = $('#chips');
  chips.innerHTML = [`<button class="chip" role="tab" data-ep="all">全部<small>${terms.length}</small></button>`,
    ...episodes.map((e) => `<button class="chip" role="tab" data-ep="${e.id}">${esc(e.theme)}<small>${byEp[e.id].length}</small></button>`)].join('');
  chips.addEventListener('click', (ev) => {
    const b = ev.target.closest('.chip');
    if (!b) return;
    select(b.dataset.ep);
    history.replaceState(null, '', b.dataset.ep === 'all' ? location.pathname : `#${b.dataset.ep}`);
    $('#list').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const hl = (text, q) => {
    const t = esc(text);
    if (!q) return t;
    const i = text.toLowerCase().indexOf(q);
    return i < 0 ? t : `${esc(text.slice(0, i))}<mark>${esc(text.slice(i, i + q.length))}</mark>${esc(text.slice(i + q.length))}`;
  };

  function card(t) {
    return `<article class="card" id="${t.id}">
      <div class="demo"><iframe src="${t.demo}" title="${esc(t.en)} 动画演示" loading="lazy" sandbox="allow-scripts"></iframe></div>
      <div class="body">
        <div class="en">${esc(t.en)}</div>
        <div class="zh">${esc(t.zh)}</div>
        <p class="say">${esc(t.say)}</p>
        ${t.example ? `<p class="eg">${esc(t.example)}</p>` : ''}
        <div class="actions">
          <button class="btn primary" data-open="${t.id}">看代码</button>
          <button class="btn" data-copy="${t.id}">复制提示词</button>
        </div>
      </div>
    </article>`;
  }

  // 只渲染一次（避免筛选时 iframe 反复重载），之后按条件显示/隐藏
  $('#list').innerHTML = episodes.map((e) => `<section class="section" id="sec-${e.id}" data-ep="${e.id}">
      <div class="section-head">
        <span class="no">第 ${e.series_no} 期</span><h2>${esc(e.theme)}</h2><span class="type">${esc(e.type)}</span>
        <a class="all" href="episodes/${e.id}/index.html" target="_blank" rel="noopener">看整期动画 →</a>
      </div>
      <div class="grid">${byEp[e.id].map(card).join('')}</div>
    </section>`).join('');

  function render() {
    const q = $('#q').value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll('.section').forEach((sec) => {
      let n = 0;
      if (current === 'all' || sec.dataset.ep === current) {
        sec.querySelectorAll('.card').forEach((el) => {
          const t = byId[el.id];
          const hit = !q || [t.en, t.zh, t.say, t.example, t.prompt].some((x) => x.toLowerCase().includes(q));
          el.hidden = !hit;
          if (hit) {
            n++;
            el.querySelector('.en').innerHTML = hl(t.en, q);
            el.querySelector('.zh').innerHTML = hl(t.zh, q);
            el.querySelector('.say').innerHTML = hl(t.say, q);
            const eg = el.querySelector('.eg');
            if (eg) eg.innerHTML = hl(t.example, q);
          }
        });
      } else sec.querySelectorAll('.card').forEach((el) => { el.hidden = true; });
      sec.hidden = n === 0;
      shown += n;
    });
    $('#empty').hidden = shown > 0;
  }

  function select(ep) {
    current = byEp[ep] ? ep : 'all';
    chips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-selected', String(c.dataset.ep === current)));
    render();
  }

  // 复制（file:// 或不支持 Clipboard API 时退回 execCommand）
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    }
  }
  let timer;
  const toast = (msg) => { const el = $('#toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(timer); timer = setTimeout(() => el.classList.remove('on'), 1800); };

  /* ---------- 看代码弹窗 ---------- */
  const BASE = '<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<style>html,body{height:100%}body{margin:0;display:grid;place-items:center;background:#FAFAFA;color:#18181B;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}</style>\n';
  let open = null, lastFocus = null;
  function tab(name) {
    document.querySelectorAll('.tabs [data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
    document.querySelectorAll('.pane').forEach((p) => { p.hidden = p.dataset.pane !== name; });
  }
  function openModal(t) {
    open = t; lastFocus = document.activeElement;
    $('#m-en').textContent = t.en; $('#m-title').textContent = t.zh;
    $('#m-code').textContent = t.code; $('#m-prompt').textContent = t.prompt;
    $('#m-frame').srcdoc = BASE + t.code;
    $('#m-kit').href = `ui/#${t.kit}`;
    tab('preview');
    $('#modal').hidden = false; document.body.style.overflow = 'hidden';
    $('#m-close').focus();
  }
  function closeModal() {
    $('#modal').hidden = true; document.body.style.overflow = ''; $('#m-frame').srcdoc = '';
    lastFocus?.focus();
  }
  $('.tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) tab(b.dataset.tab); });
  $('#m-close').onclick = closeModal;
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
  $('#m-copy-code').onclick = async () => toast((await copy(open.code)) ? `已复制「${open.zh}」的代码` : '复制失败，请手动选择');
  $('#m-copy-prompt').onclick = async () => toast((await copy(open.prompt)) ? `已复制「${open.zh}」的提示词` : '复制失败，请手动选择');

  $('#list').addEventListener('click', async (ev) => {
    const o = ev.target.closest('[data-open]');
    if (o) return openModal(byId[o.dataset.open]);
    const c = ev.target.closest('[data-copy]');
    if (c) { const t = byId[c.dataset.copy]; toast((await copy(t.prompt)) ? `已复制「${t.zh}」的提示词` : '复制失败，请手动选择文字'); }
  });

  $('#q').addEventListener('input', render);
  addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !$('#modal').hidden) closeModal();
    if (ev.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { ev.preventDefault(); $('#q').focus(); }
  });

  select(location.hash.slice(1) || 'all');
})();
