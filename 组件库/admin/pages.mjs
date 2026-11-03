// 管理后台整页案例的生成器：5 种页面模板 × styles.mjs 里的每种风格 = 一个个独立可运行的整页。
// build.mjs 调用 adminCases()，生成的案例和 components/*.html 一样进词典（看代码、复制提示词都能用），但不落成文件：
// 改一处模板，所有风格一起生效；加一种风格，5 种页面一起多出来。
// 生成的代码必须自包含（变量、外壳、页面样式、脚本都在一段里），访客复制走就能直接跑。
import { styles, SANS, SERIF, MONO } from './styles.mjs';

const FONTS = { sans: SANS, serif: SERIF, mono: MONO };

/* ---------------- 图标（原创线性图标，24 格） ---------------- */
const P = {
  home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.8a3 3 0 0 1 0 6M18 14.3c1.8.8 3 2.9 3 5.7"/>',
  shield: '<path d="M12 3 4.5 6v6c0 4.4 3.2 7.9 7.5 9 4.3-1.1 7.5-4.6 7.5-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  log: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 19h4"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.3-4.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  more: '<path d="M6 12h.01M12 12h.01M18 12h.01" stroke-width="3"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>',
};
const ico = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
const MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 4.2a8 8 0 1 0 4.6 13.3 6.6 6.6 0 0 1-4.6-13.3z" fill="currentColor"/></svg>';

/* ---------------- 虚构数据（人名、邮箱、IP 都是编的，IP 用文档专用网段） ---------------- */
const USERS = [
  ['林知夏', 'zhixia.lin', '管理员', '产品部', 'ok', '活跃', '2 分钟前'],
  ['周叙白', 'xubai.zhou', '运营主管', '运营部', 'ok', '活跃', '1 小时前'],
  ['沈清禾', 'qinghe.shen', '财务', '财务部', 'warn', '待审核', '—'],
  ['陆星野', 'xingye.lu', '开发', '技术部', 'ok', '活跃', '今天 09:12'],
  ['温以宁', 'yining.wen', '审计员', '风控部', 'off', '已停用', '10-12 18:30'],
  ['顾南乔', 'nanqiao.gu', '运营专员', '运营部', 'bad', '已锁定', '昨天 22:40'],
  ['许砚秋', 'yanqiu.xu', '访客', '市场部', 'warn', '待审核', '—'],
  ['江迟', 'chi.jiang', '开发', '技术部', 'ok', '活跃', '3 天前'],
];
const av = (s, name, i) => `<span class="av" style="--h:${s.av[i % s.av.length]}">${name.slice(-1)}</span>`;

/* ---------------- 共用样式：变量 + 外壳 + 通用控件 ---------------- */
function rootVars(s) {
  const v = {
    'line-soft': 'color-mix(in srgb, var(--line) 55%, transparent)', 'radius-btn': 'var(--radius-sm)', th: 'transparent', bar: 'var(--panel)', field: 'var(--panel)',
    size: '13px', row: '48px', 'head-weight': '600', ...s.v,
  };
  delete v.scheme;
  v.font = FONTS[s.v.font || 'sans'];
  v['font-head'] = FONTS[s.v.head || s.v.font || 'sans'];
  v['font-num'] = s.v['font-num'] === 'mono' ? MONO : 'var(--font)';
  v.ring = 'color-mix(in srgb, var(--accent) 22%, transparent)';
  delete v.head;
  const order = ['bg', 'panel', 'nav', 'nav-text', 'nav-dim', 'nav-hover', 'nav-active', 'nav-active-text', 'nav-line', 'bar', 'text', 'dim', 'line', 'line-soft', 'hover', 'field', 'th',
    'accent', 'on-accent', 'ring', 'ok', 'warn', 'danger', 'radius', 'radius-sm', 'radius-btn', 'shadow', 'font', 'font-head', 'font-num', 'head-weight', 'size', 'row'];
  return `:root {\n  /* 「${s.zh}」风格：换风格只改这一段变量 */\n${order.map((k) => `  --${k}: ${v[k]};`).join('\n')}\n}`;
}

const BASE = `* { box-sizing: border-box; }
.app { display: grid; grid-template-columns: 216px minmax(0, 1fr); width: 100%; height: 100%; min-height: 0; overflow: hidden; background: var(--bg); color: var(--text); font: var(--size)/1.5 var(--font); text-align: left; }
.app.rail { grid-template-columns: 64px minmax(0, 1fr); }
.app.top { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); }
svg { flex: none; }

/* 导航：侧栏 side / 图标窄栏 rail / 顶栏 top 共用一份结构 */
.nav { display: flex; flex-direction: column; gap: 2px; min-width: 0; padding: 16px 12px; background: var(--nav); color: var(--nav-text); border-right: 1px solid var(--nav-line); }
.brand { display: flex; align-items: center; gap: 10px; padding: 2px 8px 14px; font: var(--head-weight) 15px/1 var(--font-head); white-space: nowrap; }
.brand i { display: grid; place-items: center; width: 28px; height: 28px; border-radius: var(--radius-sm); background: var(--accent); color: var(--on-accent); }
.brand i svg { width: 16px; height: 16px; }
.nav h6 { margin: 14px 10px 6px; font-size: 11px; font-weight: 500; color: var(--nav-dim); letter-spacing: .06em; }
.nav a { display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: var(--radius-sm); color: var(--nav-dim); text-decoration: none; white-space: nowrap; cursor: pointer; transition: background .15s, color .15s; }
.nav a:hover { background: var(--nav-hover); color: var(--nav-text); }
.nav a.on { background: var(--nav-active); color: var(--nav-active-text); }
.nav a svg { width: 18px; height: 18px; }
.rail .nav { align-items: center; padding: 14px 0; }
.rail .nav h6 { width: 24px; height: 1px; margin: 10px 0; background: var(--line); font-size: 0; }
.rail .brand { padding: 2px 0 12px; }
.rail .brand span, .rail .nav a span { display: none; }
.rail .nav a { width: 42px; padding: 0; justify-content: center; }
.top .nav { flex-direction: row; align-items: center; height: 54px; padding: 0 20px; border-right: 0; border-bottom: 1px solid var(--nav-line); }
.top .nav h6 { display: none; }
.top .brand { padding: 0 18px 0 0; }
.top .nav a { height: 34px; padding: 0 12px; }
.top .nav a svg { display: none; }
.top .nav .who { margin-left: auto; }

/* 顶部栏（侧栏、窄栏模式才有） */
.main { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
.bar { display: flex; align-items: center; gap: 10px; flex: none; height: 54px; padding: 0 24px; background: var(--bar); border-bottom: 1px solid var(--line); }
.crumb { color: var(--dim); white-space: nowrap; }
.crumb b { color: var(--text); font-weight: 500; }
.gsearch { position: relative; margin-left: auto; }
.gsearch input { width: 220px; padding-left: 32px; }
.gsearch svg, .search svg { position: absolute; left: 10px; top: 50%; width: 15px; height: 15px; transform: translateY(-50%); color: var(--dim); pointer-events: none; }
.bell { position: relative; }
.bell::after { content: ""; position: absolute; top: 8px; right: 9px; width: 7px; height: 7px; border-radius: 50%; background: var(--danger); box-shadow: 0 0 0 2px var(--bar); }
.who { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
.who small { display: block; color: var(--dim); font-size: 11px; line-height: 1.2; }
.body { flex: 1; min-height: 0; overflow: auto; padding: 24px; scrollbar-width: thin; }

/* 通用控件 */
.ph { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.ph h1 { margin: 0; font: var(--head-weight) 22px/1.25 var(--font-head); }
.ph p { margin: 4px 0 0; color: var(--dim); }
.acts { display: flex; gap: 8px; flex: none; }
.card { background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 34px; padding: 0 14px; border: 1px solid var(--line); border-radius: var(--radius-btn); background: var(--panel); color: var(--text); font: inherit; font-weight: 500; white-space: nowrap; cursor: pointer; transition: background .15s, filter .15s, transform .1s; }
.btn:hover { background: var(--hover); }
.btn:active { transform: translateY(1px); }
.btn.pri { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
.btn.pri:hover { filter: brightness(1.08); }
.btn.danger { color: var(--danger); }
.btn svg { width: 16px; height: 16px; }
.icon-btn { display: grid; place-items: center; width: 34px; height: 34px; border: 0; border-radius: var(--radius-sm); background: none; color: var(--dim); cursor: pointer; }
.icon-btn:hover { background: var(--hover); color: var(--text); }
.icon-btn svg { width: 18px; height: 18px; }
input, select, textarea { height: 34px; padding: 0 10px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--field); color: var(--text); font: inherit; outline: none; transition: border-color .15s, box-shadow .15s; }
textarea { height: auto; padding: 8px 10px; resize: vertical; }
input:focus, select:focus, textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--ring); }
input[type="checkbox"] { width: 16px; height: 16px; margin: 0; padding: 0; accent-color: var(--accent); box-shadow: none; cursor: pointer; }
.av { display: grid; place-items: center; flex: none; width: 30px; height: 30px; border-radius: 50%; background: var(--h); color: #fff; font-size: 12px; font-weight: 600; }
.badge { --c: var(--dim); display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: 99px; background: color-mix(in srgb, var(--c) 13%, transparent); color: var(--c); font-size: 12px; font-weight: 500; white-space: nowrap; }
.badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.ok { --c: var(--ok); } .warn { --c: var(--warn); } .bad { --c: var(--danger); } .off { --c: var(--dim); } .info { --c: var(--accent); }
.dim { color: var(--dim); }
.num { font-family: var(--font-num); font-variant-numeric: tabular-nums; }
.seg { display: inline-flex; gap: 2px; padding: 3px; border: 1px solid transparent; border-radius: var(--radius-sm); background: var(--hover); }
.seg button { height: 28px; padding: 0 12px; border: 0; border-radius: calc(var(--radius-sm) - 2px); background: none; color: var(--dim); font: inherit; cursor: pointer; }
.seg button[aria-pressed="true"] { background: var(--panel); color: var(--text); box-shadow: 0 1px 2px rgba(0,0,0,.08); }
.tbl { width: 100%; border-collapse: collapse; }
.tbl th { height: 40px; padding: 0 14px; background: var(--th); border-bottom: 1px solid var(--line); color: var(--dim); font-size: 12px; font-weight: 500; text-align: left; white-space: nowrap; }
.tbl td { height: var(--row); padding: 0 14px; border-bottom: 1px solid var(--line-soft); white-space: nowrap; }
.tbl tbody tr { transition: background .12s; }
.tbl tbody tr:hover { background: var(--hover); }
.tbl tr.sel { background: color-mix(in srgb, var(--accent) 8%, transparent); }
.scroll { overflow-x: auto; }
.sw { position: relative; display: inline-block; flex: none; width: 36px; height: 20px; }
.sw input { position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.sw i { position: absolute; inset: 0; border-radius: 99px; background: var(--line); transition: background .2s; }
.sw i::after { content: ""; position: absolute; left: 2px; top: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.25); transition: transform .22s cubic-bezier(.3,.7,.4,1); }
.sw input:checked + i { background: var(--accent); }
.sw input:checked + i::after { transform: translateX(16px); }
.sw input:focus-visible + i { box-shadow: 0 0 0 3px var(--ring); }

/* 手机：导航收成顶部一排图标，内容单列 */
@media (max-width: 720px) {
  .app, .app.rail { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); }
  .nav, .rail .nav, .top .nav { flex-direction: row; align-items: center; height: auto; padding: 8px 12px; overflow-x: auto; border-right: 0; border-bottom: 1px solid var(--nav-line); }
  .nav h6, .brand span, .nav a span, .top .nav .who div { display: none; }
  .brand, .rail .brand, .top .brand { padding: 0 6px 0 0; }
  .nav a, .rail .nav a, .top .nav a { width: 38px; height: 36px; padding: 0; justify-content: center; }
  .top .nav a svg { display: block; }
  .bar { height: 48px; padding: 0 12px; }
  .gsearch, .bar .who div { display: none; }
  .crumb { margin-right: auto; }
  .body { padding: 16px 14px; }
  .ph { flex-direction: column; align-items: flex-start; }
}`;

/* ---------------- 外壳 ---------------- */
const NAV = [
  ['账号', [['home', '概览', ''], ['users', '用户管理', 'users'], ['shield', '角色权限', 'roles']]],
  ['系统', [['log', '操作日志', 'logs'], ['gear', '系统设置', 'settings']]],
];
function shell(s, page, body) {
  const me = `<div class="who">${av(s, '林知夏', 0)}<div>林知夏<small>超级管理员</small></div></div>`;
  const links = NAV.map(([g, items]) => `    <h6>${g}</h6>\n` + items.map(([i, label, id]) =>
    `    <a${id === page.nav ? ' class="on"' : ''} title="${label}">${ico(i)}<span>${label}</span></a>`).join('\n')).join('\n');
  const nav = `  <nav class="nav">
    <div class="brand"><i>${MOON}</i><span>揽月后台</span></div>
${links}${s.nav === 'top' ? `\n    ${me}` : ''}
  </nav>`;
  const bar = s.nav === 'top' ? '' : `
    <header class="bar">
      <div class="crumb">${page.crumb}</div>
      <label class="gsearch">${ico('search')}<input placeholder="搜索功能、用户…" aria-label="全局搜索"></label>
      <button class="icon-btn bell" aria-label="通知">${ico('bell')}</button>
      ${me}
    </header>`;
  return `<div class="app ${s.nav}">
${nav}
  <div class="main">${bar}
    <main class="body">
${body}
    </main>
  </div>
</div>`;
}

/* ---------------- 页面 1：用户管理 ---------------- */
const users = {
  id: 'users', zh: '用户列表', en: 'User List', nav: 'users', crumb: '账号 / <b>用户管理</b>', cat: 'admin-account',
  lead: '后台里打开最多的一页：先用统计卡看全局，再用分段筛选和搜索定位到人，勾选后出现批量操作条。',
  terms: ['Data Table 数据表格', 'Bulk Actions 批量操作', 'Segmented Control 分段控件'],
  prompt: '后台「用户管理」页：标题区左边是「用户管理」和一行说明，右边「导出」和主按钮「新建用户」；下面一排 4 个统计卡（总用户、本周活跃、待审核、已停用，带涨跌）；主卡片顶部是「全部 / 活跃 / 待审核 / 已停用」分段筛选 + 角色下拉 + 搜索框；表格列为复选框、头像 + 姓名 + 邮箱、角色、部门、状态徽标、最近登录、更多操作；勾选任意行后出现批量操作条「已选 N 项 · 分配角色 · 停用 · 删除」；底部「共 1,284 条」+ 分页。',
  promptEn: 'Admin "Users" page: a header with the title, a one-line description, an "Export" button and a primary "New user" button; a row of 4 stat cards (total users, active this week, pending review, disabled) with deltas; a main card with a segmented filter (All / Active / Pending / Disabled), a role dropdown and a search box; table columns: checkbox, avatar + name + email, role, department, status badge, last sign-in, more actions; selecting any row reveals a bulk-action bar "N selected · Assign role · Disable · Delete"; footer with the total count and pagination.',
  html: (s) => `      <div class="ph">
        <div><h1>用户管理</h1><p>管理全部账号的角色、状态和登录权限</p></div>
        <div class="acts"><button class="btn">${ico('down')}导出</button><button class="btn pri">${ico('plus')}新建用户</button></div>
      </div>
      <div class="stats">
        <div class="card stat"><span>总用户</span><b class="num">1,284</b><em>较上周 +36</em></div>
        <div class="card stat"><span>本周活跃</span><b class="num">962</b><em>活跃率 74.9%</em></div>
        <div class="card stat"><span>待审核</span><b class="num">18</b><em class="w">需要尽快处理</em></div>
        <div class="card stat"><span>已停用</span><b class="num">47</b><em class="d">较上周 −3</em></div>
      </div>
      <div class="card">
        <div class="tools">
          <div class="seg" role="group" aria-label="按状态筛选"><button aria-pressed="true" data-s="">全部</button><button aria-pressed="false" data-s="ok">活跃</button><button aria-pressed="false" data-s="warn">待审核</button><button aria-pressed="false" data-s="off">已停用</button></div>
          <select aria-label="角色"><option>所有角色</option><option>管理员</option><option>运营</option><option>财务</option><option>开发</option></select>
          <label class="search">${ico('search')}<input placeholder="搜索姓名或邮箱" aria-label="搜索用户"></label>
        </div>
        <div class="bulk" hidden><span>已选 <b>0</b> 项</span><button class="btn">分配角色</button><button class="btn">停用</button><button class="btn danger">删除</button><button class="btn clear">取消</button></div>
        <div class="scroll"><table class="tbl">
          <thead><tr><th class="ck"><input type="checkbox" aria-label="全选"></th><th>用户</th><th>角色</th><th>部门</th><th>状态</th><th>最近登录</th><th></th></tr></thead>
          <tbody>
${USERS.map(([n, mail, role, dept, st, label, last], i) => `            <tr data-s="${st === 'bad' ? 'off' : st}"><td class="ck"><input type="checkbox" aria-label="选择 ${n}"></td><td><div class="person">${av(s, n, i)}<div><b>${n}</b><small>${mail}@lanyue.example</small></div></div></td><td>${role}</td><td>${dept}</td><td><span class="badge ${st}">${label}</span></td><td class="dim num">${last}</td><td><button class="icon-btn" aria-label="更多操作">${ico('more')}</button></td></tr>`).join('\n')}
          </tbody>
        </table></div>
        <div class="pager"><span>共 <b class="num">1,284</b> 条</span><button aria-label="上一页">‹</button><button class="on">1</button><button>2</button><button>3</button><span class="gap">…</span><button>161</button><button aria-label="下一页">›</button></div>
      </div>`,
  css: `.stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 16px; }
.stat { padding: 14px 16px; }
.stat span { color: var(--dim); font-size: 12px; }
.stat b { display: block; margin: 4px 0 2px; font-size: 24px; font-weight: 600; line-height: 1.2; }
.stat em { color: var(--ok); font-size: 12px; font-style: normal; }
.stat em.w { color: var(--warn); } .stat em.d { color: var(--dim); }
.tools { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 12px 16px; border-bottom: 1px solid var(--line-soft); }
.search { position: relative; margin-left: auto; }
.search input { width: 200px; padding-left: 32px; }
.bulk { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: color-mix(in srgb, var(--accent) 8%, transparent); border-bottom: 1px solid var(--line-soft); }
.bulk[hidden] { display: none; }
.bulk span { margin-right: auto; }
.bulk b { color: var(--accent); }
.bulk .btn { height: 28px; padding: 0 10px; }
.ck { width: 44px; }
.person { display: flex; align-items: center; gap: 10px; }
.person b { display: block; font-weight: 500; }
.person small { color: var(--dim); font-size: 12px; }
.tbl td:last-child { width: 48px; text-align: right; }
.tbl tbody tr[hidden] { display: none; }
.pager { display: flex; align-items: center; gap: 4px; padding: 12px 16px; color: var(--dim); font-size: 12px; }
.pager > span:first-child { margin-right: auto; }
.pager button { min-width: 30px; height: 30px; border: 1px solid transparent; border-radius: var(--radius-sm); background: none; color: var(--text); font: inherit; cursor: pointer; }
.pager button:hover { background: var(--hover); }
.pager button.on { border-color: var(--accent); color: var(--accent); }
@media (max-width: 720px) {
  .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .search { width: 100%; margin-left: 0; } .search input { width: 100%; }
}`,
  js: function () {
    const rows = [...document.querySelectorAll('.tbl tbody tr')];
    const all = document.querySelector('.tbl thead input');
    const bulk = document.querySelector('.bulk');
    let state = '', q = '';
    const box = (r) => r.querySelector('input');
    function sync() {
      rows.forEach((r) => r.classList.toggle('sel', box(r).checked));
      const n = rows.filter((r) => box(r).checked).length, shown = rows.filter((r) => !r.hidden);
      bulk.querySelector('b').textContent = n;
      bulk.hidden = !n;
      all.checked = shown.length > 0 && shown.every((r) => box(r).checked);
      all.indeterminate = !all.checked && shown.some((r) => box(r).checked);
    }
    function filter() {
      rows.forEach((r) => { r.hidden = (state && r.dataset.s !== state) || !r.textContent.toLowerCase().includes(q); });
      sync();
    }
    document.querySelector('.seg').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      document.querySelectorAll('.seg button').forEach((x) => x.setAttribute('aria-pressed', x === b));
      state = b.dataset.s; filter();
    });
    document.querySelector('.search input').addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); filter(); });
    all.addEventListener('change', () => { rows.forEach((r) => { if (!r.hidden) box(r).checked = all.checked; }); sync(); });
    document.querySelector('.tbl tbody').addEventListener('change', sync);
    bulk.querySelector('.clear').addEventListener('click', () => { rows.forEach((r) => { box(r).checked = false; }); sync(); });
    document.querySelector('.pager').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b || !/^\d+$/.test(b.textContent)) return;
      document.querySelectorAll('.pager button').forEach((x) => x.classList.toggle('on', x === b));
    });
  },
};

/* ---------------- 页面 2：账号详情与编辑 ---------------- */
const account = {
  id: 'account', zh: '账号详情', en: 'Account Detail', nav: 'users', crumb: '账号 / 用户管理 / <b>林知夏</b>', cat: 'admin-account',
  lead: '点开某个用户后的页面：左边是身份名片，右边用标签页分开编辑资料、安全设置和登录设备；改了东西底部才出现保存条，不怕误操作。',
  terms: ['Tabs 标签页', 'Sticky Save Bar 吸底保存条', 'Profile Card 资料卡'],
  prompt: '后台「账号详情」页：标题区是面包屑「用户管理 / 林知夏」，右边「重置密码」和红字「停用账号」；左栏 260px 资料卡：大头像、姓名、邮箱、状态徽标，下面一组左标签右数值的信息（工号、部门、角色、创建时间、最近登录）和「账号安全度 72%」进度条；右栏卡片顶部三个标签页「基本资料 / 安全设置 / 登录设备」：基本资料是两列表单（姓名、英文名、邮箱、手机、部门、直属上级），下面一排可多选的角色胶囊和备注框；安全设置是一列开关（双因素认证、异地登录提醒、允许 API 访问）；登录设备是设备列表，当前设备打标，其他可「下线」；任何字段一改动，底部滑出吸底保存条「有未保存的修改 · 放弃 · 保存」。',
  promptEn: 'Admin "Account detail" page: the header shows the breadcrumb "Users / Lin Zhixia" with "Reset password" and a red "Disable account" button on the right; a 260px left profile card with a large avatar, name, email and status badge, then label–value rows (employee ID, department, role, created, last sign-in) and an "Account security 72%" progress bar; the right card has three tabs "Profile / Security / Devices": Profile is a two-column form (name, English name, email, phone, department, manager) plus multi-select role chips and a notes box; Security is a list of switches (two-factor auth, unusual sign-in alerts, API access); Devices lists sessions with the current one tagged and others revocable; as soon as any field changes, a sticky save bar slides up at the bottom: "Unsaved changes · Discard · Save".',
  html: (s) => `      <div class="ph">
        <div><h1>账号详情</h1><p>编辑资料、调整角色，或管理这位成员的登录安全</p></div>
        <div class="acts"><button class="btn">${ico('key')}重置密码</button><button class="btn danger">停用账号</button></div>
      </div>
      <form class="acc" onsubmit="return false">
        <aside class="card profile">
          <span class="av big" style="--h:${s.av[0]}">夏</span>
          <h2>林知夏</h2>
          <p>zhixia.lin@lanyue.example</p>
          <span class="badge ok">活跃</span>
          <dl>
            <dt>工号</dt><dd class="num">LY-02417</dd>
            <dt>部门</dt><dd>产品部</dd>
            <dt>角色</dt><dd>管理员</dd>
            <dt>创建于</dt><dd class="num">2024-03-18</dd>
            <dt>最近登录</dt><dd>2 分钟前 · 上海</dd>
          </dl>
          <div class="meter"><div><span>账号安全度</span><b class="num">72%</b></div><i></i></div>
        </aside>
        <section class="card">
          <div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="true">基本资料</button><button type="button" role="tab" aria-selected="false">安全设置</button><button type="button" role="tab" aria-selected="false">登录设备</button></div>
          <div class="pane">
            <div class="form">
              <label class="field"><span>姓名</span><input value="林知夏"></label>
              <label class="field"><span>英文名</span><input value="Zhixia Lin"></label>
              <label class="field"><span>邮箱</span><input value="zhixia.lin@lanyue.example"></label>
              <label class="field"><span>手机</span><input value="138 0000 2417"></label>
              <label class="field"><span>部门</span><select><option>产品部</option><option>运营部</option><option>技术部</option></select></label>
              <label class="field"><span>直属上级</span><select><option>周叙白</option><option>陆星野</option></select></label>
              <div class="field wide"><span>角色（可多选）</span><div class="chips"><label class="chip"><input type="checkbox" checked>管理员</label><label class="chip"><input type="checkbox">运营主管</label><label class="chip"><input type="checkbox" checked>审计员</label><label class="chip"><input type="checkbox">财务</label></div></div>
              <label class="field wide"><span>备注</span><textarea rows="2" placeholder="仅管理员可见"></textarea></label>
            </div>
          </div>
          <div class="pane" hidden>
            <div class="opt"><div><b>双因素认证</b><small>登录时除了密码，还要输入手机上的动态验证码</small></div><label class="sw"><input type="checkbox" checked aria-label="双因素认证"><i></i></label></div>
            <div class="opt"><div><b>异地登录提醒</b><small>在不常用的城市登录时发邮件提醒</small></div><label class="sw"><input type="checkbox" checked aria-label="异地登录提醒"><i></i></label></div>
            <div class="opt"><div><b>允许 API 访问</b><small>可以创建个人访问令牌调用开放接口</small></div><label class="sw"><input type="checkbox" aria-label="允许 API 访问"><i></i></label></div>
            <div class="opt"><div><b>登录密码</b><small>上次修改于 92 天前，建议每 90 天更换一次</small></div><button type="button" class="btn">修改密码</button></div>
          </div>
          <div class="pane" hidden>
            <div class="opt dev">${ico('laptop')}<div><b>MacBook · Chrome <span class="badge ok">当前设备</span></b><small>上海 · 198.51.100.7 · 2 分钟前</small></div></div>
            <div class="opt dev">${ico('phone')}<div><b>iPhone · 揽月 App</b><small>上海 · 198.51.100.21 · 今天 08:15</small></div><button type="button" class="btn">下线</button></div>
            <div class="opt dev">${ico('laptop')}<div><b>Windows · Edge</b><small>杭州 · 203.0.113.9 · 10-28</small></div><button type="button" class="btn">下线</button></div>
          </div>
        </section>
        <div class="savebar card" hidden><span>有未保存的修改</span><button type="reset" class="btn">放弃</button><button type="button" class="btn pri save">保存修改</button></div>
      </form>`,
  css: `.acc { display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 16px; align-items: start; }
.profile { padding: 24px 20px 20px; text-align: center; }
.av.big { width: 72px; height: 72px; margin: 0 auto 12px; font-size: 26px; }
.profile h2 { margin: 0; font: var(--head-weight) 18px/1.3 var(--font-head); }
.profile p { margin: 2px 0 10px; color: var(--dim); font-size: 12px; }
.profile dl { display: grid; grid-template-columns: auto 1fr; gap: 10px 12px; margin: 18px 0 0; padding-top: 16px; border-top: 1px solid var(--line-soft); font-size: 12px; text-align: left; }
.profile dt { color: var(--dim); }
.profile dd { margin: 0; text-align: right; }
.meter { margin-top: 16px; font-size: 12px; text-align: left; }
.meter div { display: flex; justify-content: space-between; margin-bottom: 6px; color: var(--dim); }
.meter b { color: var(--text); }
.meter i { display: block; height: 6px; border-radius: 99px; background: var(--hover); overflow: hidden; }
.meter i::after { content: ""; display: block; width: 72%; height: 100%; border-radius: inherit; background: var(--accent); }
.tabs { display: flex; gap: 22px; padding: 0 20px; border-bottom: 1px solid var(--line-soft); }
.tabs button { height: 46px; margin-bottom: -1px; padding: 0 2px; border: 0; border-bottom: 2px solid transparent; background: none; color: var(--dim); font: inherit; font-weight: 500; cursor: pointer; }
.tabs button:hover { color: var(--text); }
.tabs button[aria-selected="true"] { color: var(--text); border-bottom-color: var(--accent); }
.pane { padding: 20px; }
.pane[hidden] { display: none; }
.form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: grid; gap: 6px; }
.field > span { color: var(--dim); font-size: 12px; font-weight: 500; }
.wide { grid-column: 1 / -1; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border: 1px solid var(--line); border-radius: 99px; font-size: 12px; cursor: pointer; transition: background .15s, color .15s; }
.chip:has(input:checked) { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 9%, transparent); color: var(--accent); }
.chip input { width: 14px; height: 14px; }
.opt { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--line-soft); }
.opt:first-child { padding-top: 0; } .opt:last-child { padding-bottom: 0; border-bottom: 0; }
.opt > div { flex: 1; min-width: 0; }
.opt b { display: flex; align-items: center; gap: 8px; font-weight: 500; }
.opt small { color: var(--dim); font-size: 12px; }
.dev > svg { width: 22px; height: 22px; color: var(--dim); }
.savebar { position: sticky; bottom: 0; grid-column: 1 / -1; display: flex; align-items: center; gap: 8px; padding: 10px 12px 10px 16px; animation: up .25s cubic-bezier(.2,.8,.2,1); }
.savebar[hidden] { display: none; }
.savebar span { display: flex; align-items: center; gap: 8px; margin-right: auto; }
.savebar span::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--warn); }
@keyframes up { from { opacity: 0; transform: translateY(12px); } }
@media (max-width: 720px) { .acc, .form { grid-template-columns: minmax(0, 1fr); } }`,
  js: function () {
    const form = document.querySelector('.acc'), bar = document.querySelector('.savebar');
    const tabs = [...document.querySelectorAll('.tabs button')], panes = [...document.querySelectorAll('.pane')];
    tabs.forEach((t, i) => t.addEventListener('click', () => {
      tabs.forEach((x) => x.setAttribute('aria-selected', x === t));
      panes.forEach((p, j) => { p.hidden = j !== i; });
    }));
    const dirty = () => { bar.hidden = false; };
    form.addEventListener('input', dirty);
    form.addEventListener('change', dirty);
    form.addEventListener('reset', () => { bar.hidden = true; });
    bar.querySelector('.save').addEventListener('click', (e) => {
      e.target.textContent = '已保存 ✓';
      setTimeout(() => { bar.hidden = true; e.target.textContent = '保存修改'; }, 1200);
    });
    document.querySelectorAll('.dev .btn').forEach((b) => b.addEventListener('click', () => { b.closest('.dev').style.opacity = '.4'; b.textContent = '已下线'; b.disabled = true; }));
  },
};

/* ---------------- 页面 3：角色权限 ---------------- */
// 每个角色的权限：7 个模块 × 5 个操作（查看 新建 编辑 删除 导出），1 = 有权限
const ROLES = [
  ['super', '超级管理员', 2, '拥有全部权限，不可修改', '11111 11111 11111 11111 11111 11111 11111'],
  ['lead', '运营主管', 6, '管理内容和订单，可查看报表', '11100 10000 11111 11101 10001 10000 10001'],
  ['ops', '运营专员', 18, '日常内容发布和订单处理', '10000 00000 11100 11100 00000 00000 00000'],
  ['finance', '财务', 5, '财务报表全权限，订单只读', '10000 00000 10000 10001 11111 00000 10000'],
  ['audit', '审计员', 3, '全部模块只读，可导出', '10001 10001 10001 10001 10001 10001 10001'],
  ['guest', '访客', 41, '只能查看公开内容', '00000 00000 10000 00000 00000 00000 00000'],
];
const MODULES = [['用户管理', '账号、部门、邀请'], ['角色权限', '角色和授权'], ['内容管理', '文章、页面、素材'], ['订单管理', '订单、退款、发票'], ['财务报表', '收入、对账'], ['系统设置', '全局配置'], ['操作日志', '审计记录']];
const ACTIONS = ['查看', '新建', '编辑', '删除', '导出'];
const roles = {
  id: 'roles', zh: '角色权限', en: 'Roles & Permissions', nav: 'roles', crumb: '账号 / <b>角色权限</b>', cat: 'admin-account',
  lead: 'RBAC（基于角色的权限）的核心界面：左边选角色，右边用“模块 × 操作”的勾选矩阵配置权限，改了几项一目了然。',
  terms: ['RBAC 基于角色的权限', 'Permission Matrix 权限矩阵', 'Master-Detail 主从布局'],
  prompt: '后台「角色权限」页：左栏 240px 角色列表卡片（超级管理员、运营主管、运营专员、财务、审计员、访客），每项是角色名 + 右侧成员数 + 一行灰色说明，选中项淡主色底；右栏是权限矩阵卡片：顶部角色名、说明和「12 名成员」，右上角显示「已修改 N 项」和保存按钮；表格行是模块（用户管理、角色权限、内容管理、订单管理、财务报表、系统设置、操作日志，每行带一行小字说明和整行全选复选框），列是「查看 / 新建 / 编辑 / 删除 / 导出」五个居中的复选框；超级管理员的矩阵全部勾选且禁用，切换角色时矩阵跟着换。',
  promptEn: 'Admin "Roles & permissions" page: a 240px left card listing roles (Super admin, Ops lead, Ops specialist, Finance, Auditor, Guest), each with the role name, member count on the right and a gray one-line description, the selected one on a pale accent fill; the right card is a permission matrix: role name, description and member count at the top, "N changes" and a Save button at top right; rows are modules (Users, Roles, Content, Orders, Finance reports, Settings, Audit log, each with a small caption and a row-level select-all checkbox), columns are five centered checkboxes "View / Create / Edit / Delete / Export"; the Super admin matrix is fully checked and disabled, and the matrix updates when another role is selected.',
  html: () => `      <div class="ph">
        <div><h1>角色权限</h1><p>按角色分配权限，成员继承所在角色的全部权限</p></div>
        <div class="acts"><button class="btn pri">${ico('plus')}新建角色</button></div>
      </div>
      <div class="roles">
        <div class="card rlist">
${ROLES.map(([id, name, n, desc], i) => `          <button aria-pressed="${i === 1}" data-r="${id}"><b>${name}<em class="num">${n} 人</em></b><small>${desc}</small></button>`).join('\n')}
        </div>
        <section class="card">
          <div class="mhead"><div><h2>运营主管</h2><p>管理内容和订单，可查看报表 · <span class="num">6</span> 名成员</p></div><span class="chg">未修改</span><button class="btn pri save" disabled>保存</button></div>
          <div class="scroll"><table class="tbl mx">
            <thead><tr><th>模块</th>${ACTIONS.map((a) => `<th>${a}</th>`).join('')}</tr></thead>
            <tbody>
${MODULES.map(([m, d], i) => `              <tr><td><label class="mod"><input type="checkbox" class="row" aria-label="${m} 全部权限"><span><b>${m}</b><small>${d}</small></span></label></td>${ACTIONS.map((a, j) => `<td><input type="checkbox" aria-label="${m}·${a}"${ROLES[1][4].split(' ')[i][j] === '1' ? ' checked' : ''}></td>`).join('')}</tr>`).join('\n')}
            </tbody>
          </table></div>
        </section>
      </div>`,
  css: `.roles { display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 16px; align-items: start; }
.rlist { display: grid; gap: 2px; padding: 8px; }
.rlist button { display: block; width: 100%; padding: 10px 12px; border: 0; border-radius: var(--radius-sm); background: none; color: var(--text); font: inherit; text-align: left; cursor: pointer; transition: background .15s; }
.rlist button:hover { background: var(--hover); }
.rlist button[aria-pressed="true"] { background: color-mix(in srgb, var(--accent) 11%, transparent); }
.rlist b { display: flex; justify-content: space-between; font-weight: 500; }
.rlist em { color: var(--dim); font-size: 12px; font-style: normal; font-weight: 400; }
.rlist small { display: block; margin-top: 2px; overflow: hidden; color: var(--dim); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.mhead { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--line-soft); }
.mhead h2 { margin: 0; font: var(--head-weight) 16px/1.3 var(--font-head); }
.mhead p { margin: 2px 0 0; color: var(--dim); font-size: 12px; }
.chg { margin-left: auto; color: var(--dim); font-size: 12px; white-space: nowrap; }
.chg.on { color: var(--warn); }
.btn:disabled { opacity: .45; cursor: not-allowed; filter: none; transform: none; }
.mx th:not(:first-child), .mx td:not(:first-child) { width: 76px; text-align: center; }
.mx td { height: 52px; }
.mod { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.mod b { display: block; font-weight: 500; }
.mod small { color: var(--dim); font-size: 12px; }
.mx input:disabled { cursor: not-allowed; opacity: .6; }
@media (max-width: 720px) { .roles { grid-template-columns: minmax(0, 1fr); } .mhead { flex-wrap: wrap; } }`,
  js: function () {
    const PERMS = { super: '11111 11111 11111 11111 11111 11111 11111', lead: '11100 10000 11111 11101 10001 10000 10001', ops: '10000 00000 11100 11100 00000 00000 00000',
      finance: '10000 00000 10000 10001 11111 00000 10000', audit: '10001 10001 10001 10001 10001 10001 10001', guest: '00000 00000 10000 00000 00000 00000 00000' };
    const rows = [...document.querySelectorAll('.mx tbody tr')], chg = document.querySelector('.chg'), save = document.querySelector('.mhead .save');
    const cells = (r) => [...r.querySelectorAll('td:not(:first-child) input')];
    let base = '';
    const now = () => rows.map((r) => cells(r).map((c) => (c.checked ? 1 : 0)).join('')).join(' ');
    function sync() {
      rows.forEach((r) => {
        const c = cells(r), n = c.filter((x) => x.checked).length, row = r.querySelector('.row');
        row.checked = n === c.length; row.indeterminate = n > 0 && n < c.length;
      });
      const a = now().replace(/ /g, ''), b = base.replace(/ /g, '');
      const diff = [...a].filter((x, i) => x !== b[i]).length;
      chg.textContent = diff ? `已修改 ${diff} 项` : '未修改';
      chg.classList.toggle('on', !!diff);
      save.disabled = !diff;
    }
    function load(btn) {
      document.querySelectorAll('.rlist button').forEach((x) => x.setAttribute('aria-pressed', x === btn));
      const id = btn.dataset.r, lock = id === 'super';
      document.querySelector('.mhead h2').textContent = btn.querySelector('b').firstChild.textContent;
      document.querySelector('.mhead p').innerHTML = `${btn.querySelector('small').textContent} · <span class="num">${parseInt(btn.querySelector('em').textContent, 10)}</span> 名成员`;
      base = PERMS[id];
      base.split(' ').forEach((bits, i) => cells(rows[i]).forEach((c, j) => { c.checked = bits[j] === '1'; c.disabled = lock; }));
      rows.forEach((r) => { r.querySelector('.row').disabled = lock; });
      sync();
    }
    document.querySelector('.rlist').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) load(b); });
    document.querySelector('.mx tbody').addEventListener('change', (e) => {
      if (e.target.classList.contains('row')) cells(e.target.closest('tr')).forEach((c) => { c.checked = e.target.checked; });
      sync();
    });
    save.addEventListener('click', () => { base = now(); sync(); chg.textContent = '已保存 ✓'; });
    load(document.querySelector('.rlist [aria-pressed="true"]'));
  },
};

/* ---------------- 页面 4：操作日志 ---------------- */
const LOGS = [
  ['11-03 09:42:18', '林知夏', 'info', '修改', '把「周叙白」的角色从 运营专员 改为 运营主管', '198.51.100.7', [['角色', '运营专员', '运营主管'], ['数据范围', '本人', '运营部']]],
  ['11-03 09:31:05', '系统', 'bad', '异常', '连续 5 次密码错误，账号「顾南乔」已自动锁定', '203.0.113.24', [['账号状态', '活跃', '已锁定']]],
  ['11-03 09:12:40', '陆星野', 'ok', '登录', '登录成功 · Chrome / macOS', '198.51.100.12', null],
  ['11-03 08:57:12', '林知夏', 'ok', '新增', '新建用户「许砚秋」并发送邀请邮件', '198.51.100.7', [['邮箱', '—', 'yanqiu.xu@lanyue.example'], ['角色', '—', '访客']]],
  ['11-03 08:30:02', '周叙白', 'bad', '删除', '删除角色「临时外包」（3 名成员已移到访客）', '198.51.100.33', [['角色', '临时外包', '—']]],
  ['11-02 23:10:47', '温以宁', 'info', '修改', '更新系统设置：会话超时时间', '198.51.100.40', [['会话超时', '30 分钟', '15 分钟']]],
  ['11-02 22:40:16', '顾南乔', 'warn', '登录', '登录失败：密码错误（第 1 次）', '203.0.113.24', null],
  ['11-02 18:05:33', '沈清禾', 'off', '导出', '导出「10 月财务报表」，共 2,416 行', '198.51.100.51', null],
];
const logs = {
  id: 'logs', zh: '操作日志', en: 'Audit Log', nav: 'logs', crumb: '系统 / <b>操作日志</b>', cat: 'admin-system',
  lead: '谁在什么时候做了什么：按类型快速筛选，点开一行看请求详情和改前改后的对比，排查问题和安全审计都靠它。',
  terms: ['Audit Log 审计日志', 'Expandable Row 可展开行', 'Filter Chips 筛选胶囊'],
  prompt: '后台「操作日志」页：标题「操作日志」+ 说明「保留最近 180 天」，右边「导出 CSV」；工具条左边一排筛选胶囊（全部、登录、新增、修改、删除、导出、异常，选中的反色填充），右边时间范围下拉和搜索框；表格列为时间（等宽数字）、操作人（头像 + 姓名）、类型徽标（登录绿、修改蓝、删除和异常红、导出灰）、操作内容、IP、展开箭头；点任意一行在下方展开详情：请求 ID、设备，修改类操作用「字段：旧值（红色删除线）→ 新值（绿色）」的对比；底部「加载更多」。',
  promptEn: 'Admin "Audit log" page: title "Audit log" with the note "kept for 180 days" and an "Export CSV" button; a toolbar with filter chips on the left (All, Sign-in, Create, Update, Delete, Export, Alert; the selected chip is filled inverse) and a time-range dropdown plus search on the right; table columns: time (monospace digits), actor (avatar + name), type badge (sign-in green, update blue, delete and alert red, export gray), description, IP, and an expand chevron; clicking a row expands details below it: request ID, device, and for updates a field diff "field: old value (red strikethrough) → new value (green)"; a "Load more" button at the bottom.',
  html: (s) => `      <div class="ph">
        <div><h1>操作日志</h1><p>记录所有成员和系统的关键操作，保留最近 180 天</p></div>
        <div class="acts"><button class="btn">${ico('down')}导出 CSV</button></div>
      </div>
      <div class="ltools">
        <div class="fchips" role="group" aria-label="按类型筛选">${['全部', '登录', '新增', '修改', '删除', '导出', '异常'].map((t, i) => `<button aria-pressed="${!i}" data-t="${i ? t : ''}">${t}</button>`).join('')}</div>
        <select aria-label="时间范围"><option>最近 24 小时</option><option>最近 7 天</option><option>最近 30 天</option></select>
        <label class="search">${ico('search')}<input placeholder="搜索操作人、内容或 IP" aria-label="搜索日志"></label>
      </div>
      <div class="card">
        <div class="scroll"><table class="tbl log">
          <thead><tr><th>时间</th><th>操作人</th><th>类型</th><th>操作内容</th><th>IP</th><th></th></tr></thead>
          <tbody>
${LOGS.map(([t, who, c, type, what, ip, diff], i) => `            <tr class="row" data-t="${type}" tabindex="0"><td class="num dim">${t}</td><td><div class="person">${who === '系统' ? `<span class="av sys">${ico('gear')}</span>` : av(s, who, i)}${who}</div></td><td><span class="badge ${c}">${type}</span></td><td class="what">${what}</td><td class="num dim">${ip}</td><td class="caret">${ico('chev')}</td></tr>
            <tr class="more" hidden><td colspan="6"><dl class="diff"><dt>请求 ID</dt><dd class="num">req_${(0x5f3a91 + i * 7919).toString(16)}e${i}</dd><dt>设备</dt><dd>${who === '系统' ? '风控服务（自动）' : i % 2 ? 'Chrome 130 · Windows' : 'Chrome 130 · macOS'}</dd>${diff ? diff.map(([k, a, b]) => `<dt>${k}</dt><dd><del>${a}</del> → <ins>${b}</ins></dd>`).join('') : '<dt>变更</dt><dd class="dim">没有字段变更</dd>'}</dl></td></tr>`).join('\n')}
          </tbody>
        </table></div>
        <div class="loadmore"><button class="btn">加载更多</button></div>
      </div>`,
  css: `.ltools { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.fchips { display: flex; flex-wrap: wrap; gap: 6px; margin-right: auto; }
.fchips button { height: 30px; padding: 0 12px; border: 1px solid var(--line); border-radius: 99px; background: var(--panel); color: var(--dim); font: inherit; font-size: 12px; cursor: pointer; transition: background .15s, color .15s; }
.fchips button:hover { color: var(--text); }
.fchips button[aria-pressed="true"] { border-color: var(--text); background: var(--text); color: var(--bg); }
.search { position: relative; }
.search input { width: 220px; padding-left: 32px; }
.person { display: flex; align-items: center; gap: 8px; }
.person .av { width: 24px; height: 24px; font-size: 11px; }
.av.sys { background: var(--hover); color: var(--dim); }
.av.sys svg { width: 14px; height: 14px; }
.log .row { cursor: pointer; }
.log .row:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
.log .what { min-width: 260px; white-space: normal; }
.caret { width: 40px; color: var(--dim); }
.caret svg { width: 16px; height: 16px; transition: transform .2s; }
.row.open .caret svg { transform: rotate(90deg); }
.row.open { background: var(--hover); }
.tbl tr[hidden] { display: none; }
.more td { height: auto; padding: 0 14px 14px; background: var(--hover); }
.diff { display: grid; grid-template-columns: auto 1fr; gap: 6px 18px; margin: 0; padding: 12px 14px; border: 1px solid var(--line-soft); border-radius: var(--radius-sm); background: var(--panel); font: 12px/1.6 var(--font-num); white-space: normal; }
.diff dt { color: var(--dim); }
.diff dd { margin: 0; }
.diff del { color: var(--danger); }
.diff ins { color: var(--ok); text-decoration: none; }
.loadmore { display: flex; justify-content: center; padding: 14px; }
@media (max-width: 720px) { .fchips { margin-right: 0; } .search, .search input { width: 100%; } }`,
  js: function () {
    const rows = [...document.querySelectorAll('.log .row')];
    let type = '', q = '';
    function filter() {
      rows.forEach((r) => {
        r.hidden = (type && r.dataset.t !== type) || !r.textContent.toLowerCase().includes(q);
        if (r.hidden) { r.classList.remove('open'); r.nextElementSibling.hidden = true; }
      });
    }
    document.querySelector('.fchips').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      document.querySelectorAll('.fchips button').forEach((x) => x.setAttribute('aria-pressed', x === b));
      type = b.dataset.t; filter();
    });
    document.querySelector('.search input').addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); filter(); });
    const toggle = (r) => { r.classList.toggle('open'); r.nextElementSibling.hidden = !r.classList.contains('open'); };
    rows.forEach((r) => {
      r.addEventListener('click', () => toggle(r));
      r.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(r); } });
    });
  },
};

/* ---------------- 页面 5：系统设置 ---------------- */
const settings = {
  id: 'settings', zh: '系统设置', en: 'System Settings', nav: 'settings', crumb: '系统 / <b>系统设置</b>', cat: 'admin-system',
  lead: '系统级配置集中在一页：左侧分组导航，右侧按卡片分节，滚动时导航跟着高亮；危险操作单独放在最后并用红色区分。',
  terms: ['Settings Page 设置页', 'Scrollspy 滚动监听', 'Danger Zone 危险区'],
  prompt: '后台「系统设置」页：标题「系统设置」，右边主按钮「保存更改」；左栏 180px 吸顶的分组导航（常规、安全策略、通知、危险操作），滚动右侧时对应项自动高亮、点击平滑滚到该节；右栏每节一张卡片，卡片内每一行左边是设置名 + 灰色说明、右边是控件：常规（系统名称输入框、默认语言和时区下拉）；安全策略（密码最短长度滑块并实时显示「12 位」、复杂度复选框组、登录失败锁定次数、会话超时下拉、强制双因素开关、IP 白名单开关，打开后才出现多行输入框）；通知（三项开关）；最后是红色描边的「危险操作」卡片：清空缓存、恢复默认设置（红字按钮）。',
  promptEn: 'Admin "System settings" page: title "Settings" with a primary "Save changes" button; a 180px sticky section nav on the left (General, Security policy, Notifications, Danger zone) that highlights the section in view while scrolling and smooth-scrolls on click; on the right, one card per section where each row has the setting name + gray caption on the left and the control on the right: General (system name input, default language and time zone dropdowns); Security policy (minimum password length slider with a live "12 chars" readout, complexity checkboxes, lockout after failed attempts, session timeout dropdown, an enforce-2FA switch, an IP allowlist switch that reveals a textarea when on); Notifications (three switches); and finally a red-outlined "Danger zone" card with "Clear cache" and a red "Restore defaults" button.',
  html: () => {
    const row = (name, note, ctrl) => `            <div class="srow"><div><b>${name}</b><small>${note}</small></div><div>${ctrl}</div></div>`;
    const sw = (label, on) => `<label class="sw"><input type="checkbox"${on ? ' checked' : ''} aria-label="${label}"><i></i></label>`;
    return `      <div class="ph">
        <div><h1>系统设置</h1><p>这里的改动对所有成员生效，保存后立即应用</p></div>
        <div class="acts"><button class="btn pri">保存更改</button></div>
      </div>
      <div class="set">
        <nav class="card snav"><a class="on" data-to="s-general">常规</a><a data-to="s-security">安全策略</a><a data-to="s-notify">通知</a><a data-to="s-danger">危险操作</a></nav>
        <div>
          <section class="card sec" id="s-general"><h2>常规</h2><p>系统的名称、语言和时间显示</p>
${row('系统名称', '显示在浏览器标签和邮件里', '<input value="揽月后台" aria-label="系统名称">')}
${row('默认语言', '新成员第一次登录时使用', '<select aria-label="默认语言"><option>简体中文</option><option>English</option></select>')}
${row('时区', '日志和报表按这个时区显示', '<select aria-label="时区"><option>(UTC+08:00) 北京</option><option>(UTC+00:00) 伦敦</option></select>')}
          </section>
          <section class="card sec" id="s-security"><h2>安全策略</h2><p>密码、会话和登录方式的要求</p>
${row('密码最短长度', '建议不少于 12 位', '<div class="rng"><input type="range" min="8" max="32" value="12" aria-label="密码最短长度"><output class="num">12 位</output></div>')}
${row('密码复杂度', '至少满足勾选的条件', '<div class="checks"><label><input type="checkbox" checked>大写字母</label><label><input type="checkbox" checked>数字</label><label><input type="checkbox">特殊符号</label></div>')}
${row('登录失败锁定', '连续输错后临时锁定账号', '<select aria-label="登录失败锁定"><option>5 次后锁定 30 分钟</option><option>10 次后锁定 1 小时</option><option>不锁定</option></select>')}
${row('会话超时', '无操作多久后自动退出', '<select aria-label="会话超时"><option>15 分钟</option><option>30 分钟</option><option>2 小时</option></select>')}
${row('强制双因素认证', '所有成员登录时都要输入动态验证码', sw('强制双因素认证', true))}
${row('IP 白名单', '只允许这些地址登录后台', `${sw('IP 白名单', false)}<textarea class="wl" rows="2" hidden aria-label="IP 白名单" placeholder="每行一个，例如 198.51.100.0/24"></textarea>`)}
          </section>
          <section class="card sec" id="s-notify"><h2>通知</h2><p>哪些事情需要提醒管理员</p>
${row('新成员注册', '有人提交注册申请时通知', sw('新成员注册', true))}
${row('异常登录告警', '异地登录或多次失败时立即通知', sw('异常登录告警', true))}
${row('每周安全报告', '每周一早上发送到管理员邮箱', sw('每周安全报告', false))}
          </section>
          <section class="card sec danger-zone" id="s-danger"><h2>危险操作</h2><p>这些操作会立即生效，请谨慎执行</p>
${row('清空缓存', '所有成员需要重新加载页面', '<button class="btn">清空缓存</button>')}
${row('恢复默认设置', '本页所有设置回到初始值，无法撤销', '<button class="btn danger">恢复默认</button>')}
          </section>
        </div>
      </div>`;
  },
  css: `.set { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 16px; align-items: start; }
.snav { position: sticky; top: 0; display: grid; gap: 2px; padding: 8px; }
.snav a { display: flex; align-items: center; height: 34px; padding: 0 12px; border-radius: var(--radius-sm); color: var(--dim); text-decoration: none; cursor: pointer; transition: background .15s, color .15s; }
.snav a:hover { background: var(--hover); color: var(--text); }
.snav a.on { background: color-mix(in srgb, var(--accent) 11%, transparent); color: var(--text); font-weight: 500; }
.sec { margin-bottom: 16px; padding: 20px 22px 8px; scroll-margin-top: 0; }
.sec h2 { margin: 0; font: var(--head-weight) 16px/1.3 var(--font-head); }
.sec > p { margin: 4px 0 8px; color: var(--dim); font-size: 12px; }
.srow { display: grid; grid-template-columns: minmax(0, 220px) minmax(0, 1fr); gap: 20px; align-items: center; padding: 14px 0; border-top: 1px solid var(--line-soft); }
.srow b { display: block; font-weight: 500; }
.srow small { color: var(--dim); font-size: 12px; }
.srow > div:last-child { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.srow input:not([type]), .srow select { width: min(100%, 280px); }
.rng { display: flex; align-items: center; gap: 12px; width: min(100%, 320px); }
input[type="range"] { flex: 1; height: auto; padding: 0; border: 0; background: none; box-shadow: none; accent-color: var(--accent); }
output { min-width: 44px; text-align: right; }
.checks { display: flex; flex-wrap: wrap; gap: 16px; }
.checks label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
.wl { flex-basis: 100%; width: min(100%, 320px); }
.wl[hidden] { display: none; }
.danger-zone { border-color: color-mix(in srgb, var(--danger) 45%, var(--line)); }
.danger-zone h2 { color: var(--danger); }
@media (max-width: 720px) {
  .set { grid-template-columns: minmax(0, 1fr); }
  .snav { position: static; display: flex; overflow-x: auto; }
  .snav a { flex: none; }
  .srow { grid-template-columns: minmax(0, 1fr); gap: 8px; }
}`,
  js: function () {
    const body = document.querySelector('.body'), links = [...document.querySelectorAll('.snav a')];
    const secs = links.map((a) => document.getElementById(a.dataset.to));
    const mark = (a) => links.forEach((x) => x.classList.toggle('on', x === a));
    links.forEach((a, i) => a.addEventListener('click', () => { mark(a); body.scrollTo({ top: secs[i].offsetTop - body.firstElementChild.offsetTop, behavior: 'smooth' }); }));
    body.addEventListener('scroll', () => {
      const y = body.scrollTop + 80;
      let cur = 0; secs.forEach((s, i) => { if (s.offsetTop - body.firstElementChild.offsetTop <= y) cur = i; });
      if (body.scrollTop + body.clientHeight >= body.scrollHeight - 4) cur = secs.length - 1;
      mark(links[cur]);
    }, { passive: true });
    const range = document.querySelector('input[type="range"]'), out = document.querySelector('output');
    range.addEventListener('input', () => { out.textContent = `${range.value} 位`; });
    const wl = document.querySelector('.wl');
    wl.previousElementSibling.querySelector('input').addEventListener('change', (e) => { wl.hidden = !e.target.checked; });
  },
};

export const pages = [users, account, roles, logs, settings];

/* ---------------- 拼装 ---------------- */
const LAYOUT = {
  side: ['左侧 216px 侧边栏导航（品牌、概览、用户管理、角色权限、操作日志、系统设置，分「账号」「系统」两组），右侧顶部 54px 栏放面包屑、全局搜索、通知铃铛和当前用户', 'a 216px left sidebar (brand, Overview, Users, Roles, Audit log, Settings, grouped under Accounts and System) and a 54px top bar with breadcrumb, global search, a notification bell and the current user'],
  rail: ['左侧 64px 图标窄栏导航（只放图标，悬停出文字提示），顶部 54px 栏放面包屑、全局搜索、通知铃铛和当前用户', 'a 64px icon-only rail on the left (labels as hover tooltips) and a 54px top bar with breadcrumb, global search, a notification bell and the current user'],
  top: ['不要侧栏，用顶部横向导航栏（左边品牌，中间菜单，右边当前用户），内容区更宽', 'no sidebar: a horizontal top navigation (brand on the left, menu in the middle, current user on the right) so the content area is wider'],
};
const MOBILE = ['手机宽度下导航收成顶部一排图标，多列布局改成单列，表格可以横向滑动', 'on phones the navigation collapses into a row of icons at the top, multi-column layouts stack into one column and tables scroll horizontally'];

function code(s, page) {
  const extra = s.extra ? `\n\n/* 「${s.zh}」专属细节 */\n${s.extra}` : '';
  const scheme = s.v.scheme ? `\n.app { color-scheme: ${s.v.scheme}; }` : '';
  const avText = s.avText ? `\n.av { color: ${s.avText}; }` : '';
  return `${shell(s, page, page.html(s))}

<style>
${rootVars(s)}

${BASE}${scheme}${avText}

/* 「${page.zh}」页面 */
${page.css}${extra}
</style>

<script>
(${page.js.toString()})();
</script>
`;
}

// 所有案例共用的大段代码（外壳样式、各页面样式和脚本）。构建时在数据文件里只存一份，浏览器加载后再还原成完整代码
export const sharedChunks = () => [BASE, ...pages.map((p) => p.css), ...pages.map((p) => p.js.toString()), MOON, ...Object.keys(P).map(ico)];

export function adminCases() {
  const out = [];
  for (const page of pages) for (const s of styles) {
    out.push({
      id: `admin-${page.id}-${s.id}`, cat: page.cat,
      en: `${page.en} · ${s.en}`, zh: `${page.zh} · ${s.zh}`,
      lead: `${page.lead}这一版是「${s.zh}」风格：${s.use}`,
      vague: s.vague.map((v) => v.replace('{页}', page.zh)),
      terms: [...page.terms, s.term],
      prompt: `${page.prompt}\n布局：${LAYOUT[s.nav][0]}；${MOBILE[0]}。\n风格：${s.desc}`,
      promptEn: `${page.promptEn}\nLayout: ${LAYOUT[s.nav][1]}; ${MOBILE[1]}.\nStyle: ${s.descEn}`,
      canvas: 1040,
      code: code(s, page),
    });
  }
  return out;
}
