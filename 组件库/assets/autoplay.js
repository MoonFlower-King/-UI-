// 卡片「自动演示」：让每张词卡的预览不用碰就自己动起来。
// 原理：在预览 iframe 里放一只虚拟鼠标，按顺序去悬停、点击、拖拽、输入、滚动组件里能互动的东西，
// 演示完一轮就请外层重新加载、从头再来。组件代码一行不用改，新加的组件也自动生效。
// 这两个函数会被 app.js 转成字符串塞进 iframe 里运行，所以不能引用外部变量。
window.JY_AUTOPLAY = {
  // 放在组件代码之前：记下哪些元素监听了鼠标/指针事件，后面就知道该去碰谁
  pre: function () {
    const seen = (window.__jy = { drag: new Set(), hover: new Set(), click: new Set() });
    const kind = { pointerdown: 'drag', mousedown: 'drag', touchstart: 'drag', mouseenter: 'hover', mouseover: 'hover', mousemove: 'hover', pointermove: 'hover', pointerenter: 'hover', click: 'click' };
    const add = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, ...rest) {
      if (kind[type] && this instanceof Element) seen[kind[type]].add(this);
      return add.call(this, type, ...rest);
    };
    // 虚拟指针没有真实 pointerId，组件里的 setPointerCapture 会报错，这里吞掉
    const cap = Element.prototype.setPointerCapture;
    Element.prototype.setPointerCapture = function (...a) { try { cap.apply(this, a); } catch {} };
    // 演示时点到链接或提交表单，不要真的跳走
    document.addEventListener('click', (e) => { if (!e.isTrusted && e.target.closest?.('a[href]')) e.preventDefault(); }, true);
    document.addEventListener('submit', (e) => e.preventDefault(), true);
    // 访客自己按下鼠标、按键或滚动时，演示立刻让位，交给访客亲手玩
    const handOver = (e) => { if (e.isTrusted && !window.__jyStop) { window.__jyStop = true; document.dispatchEvent(new Event('jy-stop')); } };
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => add.call(document, t, handOver, { capture: true, passive: true }));
  },

  // 放在组件代码之后：开始演示
  post: function () {
    const STOP = {};
    const wait = (ms) => new Promise((ok, no) => setTimeout(() => (window.__jyStop ? no(STOP) : ok()), ms));
    const W = innerWidth, H = innerHeight;
    const seen = window.__jy;

    // 1. CSS 的 :hover / :active 没法用脚本触发，复制一份规则改成 .jy-hover / .jy-active 类名
    const patch = (rules, sheet) => {
      for (let i = rules.length - 1; i >= 0; i--) {
        const r = rules[i];
        if (r.cssRules && !r.selectorText) { patch(r.cssRules, r); continue; }
        if (r.selectorText && /:hover|:active/.test(r.selectorText)) {
          try { sheet.insertRule(r.cssText.replace(r.selectorText, r.selectorText.replace(/:hover/g, '.jy-hover').replace(/:active/g, '.jy-active')), i + 1); } catch {}
        }
      }
    };
    const hoverSel = [];
    for (const s of document.styleSheets) {
      try {
        const walk = (rules) => { for (const r of rules) { if (r.cssRules && !r.selectorText) walk(r.cssRules); else if (r.selectorText?.includes(':hover')) hoverSel.push(...r.selectorText.split(',').filter((x) => x.includes(':hover')).map((x) => x.split(':hover')[0].trim())); } };
        walk(s.cssRules); patch(s.cssRules, s);
      } catch {}
    }

    // 2. 找出要演示的目标：可交互元素 + 监听了事件的元素 + 写了 :hover 样式的元素
    const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 6 && r.height > 6 && r.right > 0 && r.bottom > 0 && r.left < W && r.top < H && getComputedStyle(el).visibility !== 'hidden'; };
    const pool = new Map();
    const put = (el, act) => { if (el && el !== document.body && el !== document.documentElement && !pool.has(el) && visible(el)) pool.set(el, act); };
    seen.drag.forEach((el) => put(el, 'drag'));
    document.querySelectorAll('input[type=range]').forEach((el) => put(el, 'range'));
    document.querySelectorAll('input:not([type=range]):not([type=checkbox]):not([type=radio]):not([type=hidden]):not([disabled]), textarea').forEach((el) => put(el, 'type'));
    seen.click.forEach((el) => put(el, 'click'));
    document.querySelectorAll('button, summary, [role=button], [role=tab], [role=switch], input[type=checkbox], input[type=radio], label, a[href]').forEach((el) => put(el, 'click'));
    hoverSel.forEach((s) => { try { document.querySelectorAll(s || '*').forEach((el) => put(el, 'hover')); } catch {} });
    seen.hover.forEach((el) => put(el, 'hover'));
    // 同一处只演示一次：外层已经入选，就不再单独演示它里面的小元素（拖拽目标除外）
    let targets = [...pool].filter(([el], _, all) => !all.some(([o, a]) => o !== el && a !== 'drag' && o.contains(el) && pool.get(el) !== 'type'));
    targets = targets.slice(0, 5);
    const page = document.scrollingElement;
    const scrollers = [...(page && page.scrollHeight > H + 30 ? [page] : []), ...[...document.body.querySelectorAll('*')].filter((el) => el.scrollHeight > el.clientHeight + 30 && /auto|scroll/.test(getComputedStyle(el).overflowY))].slice(0, 2);
    const hScrollers = [...document.body.querySelectorAll('*')].filter((el) => el.scrollWidth > el.clientWidth + 30 && /auto|scroll/.test(getComputedStyle(el).overflowX)).slice(0, 1);

    // 3. 虚拟鼠标
    const cur = document.createElement('div');
    cur.innerHTML = '<svg width="30" height="30" viewBox="0 0 22 22"><path d="M3 2l15 8.5-6.6 1.6L8.5 19z" fill="#18181B" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    cur.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;transition:opacity .3s,scale .15s;filter:drop-shadow(0 2px 3px rgba(0,0,0,.25))';
    document.body.append(cur);
    let x = W * 0.82, y = H * 0.86, over = null, down = null;
    const ev = (el, type, extra = {}) => {
      const o = { bubbles: !/enter|leave/.test(type), cancelable: true, clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', isPrimary: true, buttons: down ? 1 : 0, view: window, ...extra };
      el.dispatchEvent(type.startsWith('pointer') ? new PointerEvent(type, o) : type.startsWith('touch') ? new Event(type, o) : new MouseEvent(type, o));
    };
    const setHover = (el) => {
      if (el === over) return;
      const chain = (n) => { const a = []; for (; n && n.nodeType === 1; n = n.parentElement) a.push(n); return a; };
      const was = chain(over), now = chain(el);
      was.filter((n) => !now.includes(n)).forEach((n) => { n.classList.remove('jy-hover'); ev(n, 'mouseleave'); ev(n, 'pointerleave'); });
      if (over) ev(over, 'mouseout');
      now.filter((n) => !was.includes(n)).reverse().forEach((n) => { n.classList.add('jy-hover'); ev(n, 'mouseenter'); ev(n, 'pointerenter'); });
      if (el) ev(el, 'mouseover');
      over = el;
    };
    const place = () => { cur.style.transform = `translate(${x - 3}px,${y - 2}px)`; };
    // 鼠标移动：画面每帧都更新，但「告诉组件鼠标在哪」隔一帧做一次，同屏十几张卡片也不卡
    const moveTo = (tx, ty, ms = 700) => new Promise((done, no) => {
      const sx = x, sy = y, t0 = performance.now(); let n = 0;
      const step = (now) => {
        if (window.__jyStop) return no(STOP);
        const p = Math.min(1, (now - t0) / ms), e = p < .5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
        x = sx + (tx - sx) * e; y = sy + (ty - sy) * e; place();
        if (n++ % 2 === 0 || p === 1) {
          const el = document.elementFromPoint(x, y);
          if (!down) setHover(el);
          if (el) { ev(down || el, 'pointermove'); ev(down || el, 'mousemove'); }
        }
        p < 1 ? requestAnimationFrame(step) : done();
      };
      requestAnimationFrame(step);
    });
    // 按下时在鼠标尖上泛起一圈涟漪，让人看清「这里点了一下」
    const ring = () => {
      const r = document.createElement('div');
      r.style.cssText = `position:fixed;left:${x - 14}px;top:${y - 14}px;width:28px;height:28px;border-radius:50%;background:rgba(250,140,22,.35);pointer-events:none;z-index:2147483646`;
      document.body.append(r);
      r.animate([{ transform: 'scale(.3)', opacity: 1 }, { transform: 'scale(1.6)', opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => r.remove();
    };
    const center = (el) => { const r = el.getBoundingClientRect(); return [Math.min(W - 8, Math.max(8, r.left + r.width / 2)), Math.min(H - 8, Math.max(8, r.top + r.height / 2))]; };
    const press = (el) => { down = el; el.classList.add('jy-active'); cur.style.scale = '.82'; ring(); ev(el, 'pointerdown'); ev(el, 'mousedown'); };
    const release = (el, click = true) => { ev(el, 'pointerup'); ev(el, 'mouseup'); el.classList.remove('jy-active'); cur.style.scale = ''; down = null; if (click) el.click(); };
    const sample = (el) => el.type === 'email' ? 'moon@jiangyue.design' : el.type === 'password' ? 'Moon2026!' : el.type === 'number' || el.inputMode === 'numeric' || el.maxLength === 1 ? '2026' : el.type === 'search' || el.list ? '江' : '江月 UI';

    const demo = {
      async hover(el) { const [cx, cy] = center(el); await moveTo(cx, cy); const r = el.getBoundingClientRect(); await moveTo(cx + r.width * .25, cy - r.height * .2, 500); await moveTo(cx - r.width * .2, cy + r.height * .15, 500); await wait(500); },
      async click(el) { const [cx, cy] = center(el); await moveTo(cx, cy); await wait(380); press(el); await wait(150); release(el); await wait(1200); },
      async type(el) {
        const [cx, cy] = center(el); await moveTo(cx, cy); await wait(250); press(el); release(el, false); el.focus(); await wait(300);
        const text = sample(el);
        for (const ch of text) {
          const t = document.activeElement?.matches?.('input,textarea') ? document.activeElement : el;
          ev(t, 'keydown', { key: ch }); t.value = t.maxLength === 1 ? ch : t.value + ch;
          t.dispatchEvent(new InputEvent('input', { bubbles: true, data: ch })); ev(t, 'keyup', { key: ch });
          await wait(110);
        }
        await wait(500); const t = document.activeElement;
        if (t?.matches?.('input')) { t.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); t.dispatchEvent(new Event('change', { bubbles: true })); }
        await wait(900);
      },
      async range(el) {
        const [cx, cy] = center(el); await moveTo(cx, cy);
        const lo = +el.min || 0, hi = +el.max || 100;
        for (const v of [hi * .9, lo + (hi - lo) * .2, lo + (hi - lo) * .6]) {
          const from = +el.value; for (let i = 1; i <= 12; i++) { el.value = from + (v - from) * i / 12; el.dispatchEvent(new Event('input', { bubbles: true })); await wait(30); }
        }
        el.dispatchEvent(new Event('change', { bubbles: true })); await wait(600);
      },
      async drag(el) {
        const r = el.getBoundingClientRect(); let [cx, cy] = center(el);
        const inner = document.elementFromPoint(cx, cy) || el;
        const tag = (el.className + ' ' + el.id + ' ' + inner.className).toLowerCase();
        const vertical = /pull|refresh|sort|list|ptr/.test(tag) || el.tagName === 'UL' || el.tagName === 'OL';
        if (vertical && el.children[0]) [cx, cy] = center(el.children[0]);
        await moveTo(cx, cy); await wait(200);
        const hit = document.elementFromPoint(cx, cy) || el; press(hit);
        const dist = vertical ? Math.min(110, H * .3) : -Math.min(130, r.width * .45);
        await moveTo(cx + (vertical ? 0 : dist), cy + (vertical ? dist : 0), 900);
        await wait(/hold|confirm|press/.test(tag) ? 1200 : 250);
        release(hit, false); await wait(1200);
      },
    };
    const scrollDemo = async (el, horizontal) => {
      const box = el === document.scrollingElement ? [W / 2, H / 2] : center(el);
      await moveTo(box[0], box[1], 500);
      const max = horizontal ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
      for (const to of [max, 0]) {
        const from = horizontal ? el.scrollLeft : el.scrollTop, t0 = performance.now();
        await new Promise((ok, no) => { const f = (n) => { if (window.__jyStop) return no(STOP); const p = Math.min(1, (n - t0) / 1800); const v = from + (to - from) * (p < .5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2); horizontal ? (el.scrollLeft = v) : (el.scrollTop = v); p < 1 ? requestAnimationFrame(f) : ok(); }; requestAnimationFrame(f); });
        await wait(500);
      }
    };

    // 4. 演示一轮，然后请外层重载重来
    document.addEventListener('jy-stop', () => {
      cur.remove(); document.querySelectorAll('.jy-hover,.jy-active').forEach((n) => n.classList.remove('jy-hover', 'jy-active'));
      if (down) { ev(down, 'pointerup'); ev(down, 'mouseup'); down = null; }
    });
    (async () => {
      place();
      await wait(450);
      const anims = document.getAnimations().filter((a) => a !== undefined && a.effect?.target !== cur);
      if (!targets.length && !scrollers.length && !hScrollers.length) {
        cur.remove();
        if (anims.some((a) => a.effect?.getTiming().iterations === Infinity)) return; // 本身就一直在动
        // 纯展示类组件：让各块依次浮现，每隔几秒重来一次
        const blocks = [...document.body.querySelectorAll('body > * > *, body > *')].filter((n) => !/SCRIPT|STYLE/.test(n.tagName) && visible(n)).slice(0, 14);
        for (;;) {
          blocks.forEach((b, i) => b.animate([{ opacity: 0, transform: 'translateY(10px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: i * 90, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }));
          await wait(4200 + blocks.length * 90);
        }
      }
      for (const [el, act] of targets) { if (el.isConnected && visible(el)) await demo[act](el); }
      for (const el of scrollers) await scrollDemo(el, false);
      for (const el of hScrollers) await scrollDemo(el, true);
      setHover(null);
      await moveTo(W * 0.82, H * 0.86, 600);
      await wait(900);
      parent.postMessage('jy-replay', '*');
    })().catch((e) => { if (e !== STOP) throw e; });
  },
};
