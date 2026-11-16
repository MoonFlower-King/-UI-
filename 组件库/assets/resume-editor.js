// 在线填写简历（resume.html）：左边写 Markdown，右边实时预览；解析、渲染、模板都来自 resume-core.js / resume-styles.js / resume-sample.js，
// 和词典里「简历模板」栏目是同一套代码。$、esc、store、toast 在 common.js。
// 预览放在 iframe 里：模板样式不会和本页样式打架；打印时只打印 iframe 里那张 A4 纸。
// 地址可以带模板：resume.html#dark 直接打开「暗色」（词典里每个简历案例的「在线填写」按钮就是这么链过来的）。
const R = window.JY_RESUME, STYLES = window.JY_RESUME_STYLES, SAMPLE = window.JY_RESUME_SAMPLE;
const KEY = 'jy-resume';
const PAGE_H = 1122.5; // A4 高 297mm，按 96dpi 换成像素
const PAPER_W = 860;   // iframe 的宽度：比 A4（794px）略宽，留出灰色桌面边
const state = Object.assign({ tpl: 'minimal', lang: 'zh', text: {} }, store.get(KEY, {}));
const fromHash = decodeURIComponent(location.hash.slice(1));
if (STYLES.some((s) => s.id === fromHash)) state.tpl = fromHash;
if (!STYLES.some((s) => s.id === state.tpl)) state.tpl = STYLES[0].id;
const textOf = (lang) => state.text[lang] ?? SAMPLE[lang];
const tplOf = () => STYLES.find((s) => s.id === state.tpl);
const save = () => store.set(KEY, state);

/* ---------------- 风格条、语言 ---------------- */
// 每个风格前的小色块取自它的强调色（从 CSS 里读出第一处 --accent），不用另外维护一份颜色表
const swatch = (s) => (s.css.match(/--accent:\s*(#[0-9A-Fa-f]{3,8})/) || [, '#999'])[1];
const paperOf = (s) => (s.css.match(/--paper:\s*(#[0-9A-Fa-f]{3,8})/) || [, '#FFFFFF'])[1];
$('#styles').innerHTML = STYLES.map((s) => `<button type="button" role="radio" data-tpl="${s.id}" title="${esc(s.use)}"><i style="--a:${swatch(s)};--p:${paperOf(s)}"></i>${esc(s.zh)}</button>`).join('');
function syncBar() {
  $$('#styles [data-tpl]').forEach((b) => b.setAttribute('aria-checked', b.dataset.tpl === state.tpl));
  $$('#langs [data-lang]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === state.lang));
  $('#edit-label').textContent = state.lang === 'en' ? '英文版简历（English）' : '中文版简历';
  history.replaceState(null, '', '#' + state.tpl);
}
$('#styles').onclick = (e) => {
  const b = e.target.closest('[data-tpl]'); if (!b) return;
  state.tpl = b.dataset.tpl; save(); syncBar(); paint(true);
};
$('#langs').onclick = (e) => {
  const b = e.target.closest('[data-lang]'); if (!b || b.dataset.lang === state.lang) return;
  state.lang = b.dataset.lang; save(); $('#src').value = textOf(state.lang); syncBar(); paint();
};

/* ---------------- 预览 ---------------- */
const frame = $('#frame'), paper = $('#paper');
let doc = null;
// iframe 只建一次；之后改内容只换 <article>，改风格只换那段 <style>，预览不闪、滚动位置也不丢
frame.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${R.BASE_CSS}
.pg-break { position: absolute; left: 0; right: 0; height: 0; border-top: 1.5px dashed rgba(220, 60, 60, .55); pointer-events: none; }
.pg-break span { position: absolute; right: 6px; top: -18px; padding: 1px 6px; border-radius: 4px; background: rgba(220, 60, 60, .85); color: #fff; font: 11px/1.5 sans-serif; }
</style><style id="tpl"></style></head><body><div class="cv-desk" id="desk"></div></body></html>`;
frame.onload = () => { doc = frame.contentDocument; paint(true); };

function fit() {
  if (!doc) return;
  const k = Math.min(1, paper.clientWidth / PAPER_W), h = doc.documentElement.scrollHeight;
  frame.style.height = h + 'px'; // 宽度在 resume.css 里固定成 PAPER_W，量页数时排版已经是真实宽度
  frame.style.transform = `scale(${k})`;
  paper.style.height = h * k + 'px';
}
function paint(styleChanged) {
  if (!doc) return;
  const tpl = tplOf(), src = $('#src').value, cv = R.parse(src);
  if (styleChanged) doc.getElementById('tpl').textContent = tpl.css;
  const desk = doc.getElementById('desk');
  desk.innerHTML = R.render(cv, tpl, state.lang);
  doc.documentElement.lang = state.lang === 'en' ? 'en' : 'zh-CN';
  doc.title = cv.name ? `${cv.name} - ${state.lang === 'en' ? 'Resume' : '简历'}` : '简历';
  // 估算打印页数：去掉「至少一页高」量出内容真实高度；超过一页就在预览上画出分页线
  const art = desk.querySelector('.cv');
  art.style.minHeight = '0';
  const pages = Math.max(1, Math.ceil((art.offsetHeight - 2) / PAGE_H));
  art.style.minHeight = '';
  for (let i = 1; i < pages; i++) art.insertAdjacentHTML('beforeend', `<div class="pg-break no-print" style="top:${i * PAGE_H}px"><span>第 ${i} 页到这里</span></div>`);
  $('#pages').textContent = `约 ${pages} 页 A4`;
  $('#pages').classList.toggle('warn', pages > 2);
  fit();
}
new ResizeObserver(fit).observe(paper);

/* ---------------- 编辑 ---------------- */
let timer;
$('#src').value = textOf(state.lang);
$('#src').addEventListener('input', () => {
  clearTimeout(timer);
  timer = setTimeout(() => { state.text[state.lang] = $('#src').value; save(); paint(); }, 120);
});
// Tab 键插入两个空格，而不是跳出输入框
$('#src').addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || e.shiftKey) return;
  e.preventDefault(); document.execCommand('insertText', false, '  ');
});
$('#reset').onclick = () => {
  if ($('#src').value !== SAMPLE[state.lang] && !confirm('把这一版换回示例简历？你写的内容会被覆盖（可以先点「存 .md」备份）。')) return;
  delete state.text[state.lang]; save(); $('#src').value = SAMPLE[state.lang]; paint();
};

/* ---------------- 打印、下载、导入 ---------------- */
const fileBase = () => (R.parse($('#src').value).name || 'resume').replace(/[\\/:*?"<>|\s]+/g, '-');
function download(name, text, type) {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([text], { type })), download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
// 打印的是 iframe 里那张纸；顺手把外层标题也改成「名字 - 简历」，存 PDF 时默认文件名就是它
$('#print').onclick = () => {
  if (!doc) return;
  const t = document.title; document.title = doc.title;
  frame.contentWindow.focus(); frame.contentWindow.print();
  setTimeout(() => { document.title = t; }, 500);
  toast('在打印窗口里「目标打印机」选「存储为 PDF」，记得勾选「背景图形」');
};
$('#dl-md').onclick = () => download(`${fileBase()}${state.lang === 'en' ? '-en' : ''}.md`, $('#src').value, 'text/markdown;charset=utf-8');
// 存网页：一个自包含的 .html（样式全在里面），可以直接放到 GitHub Pages 之类的地方当在线简历
$('#dl-html').onclick = () => {
  const tpl = tplOf(), cv = R.parse($('#src').value);
  const html = `<!DOCTYPE html>\n<html lang="${state.lang === 'en' ? 'en' : 'zh-CN'}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${esc(doc ? doc.title : '简历')}</title>\n<!-- 用江月 UI「简历模板 · ${tpl.zh}」生成：https://github.com/MoonFlower-King/-UI- -->\n<style>\n${R.BASE_CSS}\n\n/* 「${tpl.zh}」风格 */\n${tpl.css}\n</style>\n</head>\n<body>\n<div class="cv-desk">\n${R.render(cv, tpl, state.lang)}\n</div>\n</body>\n</html>\n`;
  download(`${fileBase()}${state.lang === 'en' ? '-en' : ''}.html`, html, 'text/html;charset=utf-8');
};
$('#import').onchange = async (e) => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  if (f.size > 512 * 1024) { toast('文件太大了，简历的 .md 一般只有几 KB'); return; }
  $('#src').value = await f.text(); state.text[state.lang] = $('#src').value; save(); paint();
  toast(`已导入到${state.lang === 'en' ? '英文' : '中文'}版`);
};

/* ---------------- 手机：编辑 / 预览 两个标签页 ---------------- */
$('.rz-tabs').onclick = (e) => {
  const b = e.target.closest('[data-pane]'); if (!b) return;
  $('#rz').dataset.pane = b.dataset.pane;
  $$('.rz-tabs [data-pane]').forEach((x) => x.setAttribute('aria-selected', x === b));
  fit();
};

syncBar();
