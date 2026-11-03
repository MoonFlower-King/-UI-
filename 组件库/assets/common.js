// 词典（index.html）和提示词调配台（prompts.html）共用的小工具，在各页脚本之前加载。
// 两个页面的脚本都是普通 <script>，这里用 const 声明的名字在后面的脚本里直接能用。
// 发布时 .github/workflows/pages.yml 会给页面引用的脚本加上 ?v=版本号，按需下载的数据文件也带上同一个，
// 这样刚发布完不会出现「浏览器缓存里的旧脚本 + 新数据」对不上；本地直接打开时是空字符串
const V = new URL(document.currentScript.src).search;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// 本地记忆（主题、篮子、选过的词）：隐私模式等读写失败时就当没有，不报错
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* ---------------- 底部提示条、复制 ---------------- */
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

/* ---------------- 明暗：默认跟随系统，手动选过就记住 ---------------- */
// 页面 <head> 里还有一行内联脚本，在画页面之前就套上记住的主题，避免闪一下
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
