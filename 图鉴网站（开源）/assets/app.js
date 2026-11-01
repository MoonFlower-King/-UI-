(() => {
  const { episodes, terms } = window.GLOSSARY;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const byEp = Object.fromEntries(episodes.map((e) => [e.id, terms.filter((t) => t.episode === e.id)]));
  let current = 'all';

  $('#stats').innerHTML = `<span><b>${episodes.length}</b> 期</span><span><b>${terms.length}</b> 个术语</span><span>每个都有<b>实时动画</b></span><span>附<b>可复制的提示词</b></span>`;

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

  function card(t, q) {
    return `<article class="card" id="${t.id}">
      <div class="demo"><iframe src="${t.demo}" title="${esc(t.en)} 动画演示" loading="lazy" sandbox="allow-scripts"></iframe></div>
      <div class="body">
        <div class="en">${hl(t.en, q)}</div>
        <div class="zh">${hl(t.zh, q)}</div>
        <p class="say">${hl(t.say, q)}</p>
        ${t.example ? `<p class="eg">${hl(t.example, q)}</p>` : ''}
        <p class="prompt" hidden>${esc(t.prompt)}</p>
        <div class="actions">
          <button class="btn primary" data-copy="${t.id}">复制提示词</button>
          <button class="btn" data-toggle aria-expanded="false">看提示词</button>
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
      <div class="grid">${byEp[e.id].map((t) => card(t, '')).join('')}</div>
    </section>`).join('');

  function render() {
    const q = $('#q').value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll('.section').forEach((sec) => {
      let n = 0;
      if (current === 'all' || sec.dataset.ep === current) {
        sec.querySelectorAll('.card').forEach((el) => {
          const t = terms.find((x) => x.id === el.id);
          const hit = !q || [t.en, t.zh, t.say, t.example, t.prompt].some((s) => s.toLowerCase().includes(q));
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
      }
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

  // 复制提示词（file:// 或不支持 Clipboard API 时退回 execCommand）
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    }
  }
  let timer;
  const toast = (msg) => { const el = $('#toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(timer); timer = setTimeout(() => el.classList.remove('on'), 1800); };

  $('#list').addEventListener('click', async (ev) => {
    const c = ev.target.closest('[data-copy]');
    if (c) {
      const t = terms.find((x) => x.id === c.dataset.copy);
      toast((await copy(t.prompt)) ? `已复制「${t.zh}」的提示词` : '复制失败，请手动选择文字');
      return;
    }
    const tg = ev.target.closest('[data-toggle]');
    if (tg) {
      const p = tg.closest('.body').querySelector('.prompt');
      p.hidden = !p.hidden;
      tg.setAttribute('aria-expanded', String(!p.hidden));
      tg.textContent = p.hidden ? '看提示词' : '收起';
    }
  });

  $('#q').addEventListener('input', render);
  addEventListener('keydown', (ev) => {
    if (ev.key === '/' && document.activeElement !== $('#q')) { ev.preventDefault(); $('#q').focus(); }
  });

  select(location.hash.slice(1) || 'all');
})();
