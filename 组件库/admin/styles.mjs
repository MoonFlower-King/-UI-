// 管理后台的各种风格。每种风格 = 一组 CSS 变量（颜色、圆角、阴影、字体、行高）+ 导航形态 + 少量专属细节（extra）。
// 页面模板（pages.mjs）只认这些变量，所以加一种风格只要在这里加一项，5 种页面会自动各多一个案例。
// vague 里的 {页} 会换成页面名（如「用户列表」）。desc / descEn 会原样拼进提示词，写具体数值（色值、圆角、阴影），不要写“高级”“大气”这种空话。
export const SANS = '-apple-system, BlinkMacSystemFont, "Inter", "PingFang SC", "Microsoft YaHei", sans-serif';
export const SERIF = '"Songti SC", "Noto Serif SC", "Source Han Serif SC", Georgia, serif';
export const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, "Courier New", monospace';

export const styles = [
  {
    id: 'minimal', zh: '极简企业', en: 'Minimal', nav: 'side', term: 'Minimal 极简风',
    use: '不知道选什么风格时的安全牌，适合 B 端 SaaS 和内部工具。', vague: ['{页}要干净一点', '后台不要花里胡哨'],
    desc: '极简企业风：大面积白底，#FAFAFA 浅灰侧栏，1px #E7E7EA 细线分隔，完全不用阴影；主按钮纯黑 #18181B 配白字，圆角 7–10px；字号 13px，层级只靠字重和灰度区分，彩色只出现在状态徽标的小圆点上。',
    descEn: 'Minimal enterprise style: mostly white, a #FAFAFA light-gray sidebar, 1px #E7E7EA hairlines and no shadows at all; primary buttons are solid #18181B with white text, 7–10px radius; 13px base size, hierarchy comes only from weight and gray levels, color appears only as small dots in status badges.',
    v: { bg: '#FFFFFF', panel: '#FFFFFF', nav: '#FAFAFA', 'nav-text': '#18181B', 'nav-dim': '#71717A', 'nav-hover': '#F0F0F1', 'nav-active': '#EAEAEC', 'nav-active-text': '#18181B', 'nav-line': '#EBEBED',
      text: '#18181B', dim: '#71717A', line: '#E7E7EA', hover: '#F6F6F7', accent: '#18181B', 'on-accent': '#FFFFFF', ok: '#16A34A', warn: '#D97706', danger: '#DC2626',
      radius: '10px', 'radius-sm': '7px', shadow: 'none' },
    av: ['#52525B', '#78716C', '#64748B', '#3F3F46'],
  },
  {
    id: 'classic', zh: '经典深色侧栏', en: 'Classic Admin', nav: 'side', term: 'Dark Sidebar 深色侧栏',
    use: '最常见、最不容易出错的后台布局，适合功能多、菜单层级深的企业系统。', vague: ['做一个标准的{页}', '正规一点的后台'],
    desc: '经典深色侧栏后台：#1A2232 深石板色侧栏，选中项是实心蓝 #2F6BFF 色块；内容区浅灰底 #F3F5F8 上放白色卡片（圆角 8px、极淡阴影 0 1px 2px rgba(16,24,40,.05)）；表头浅灰底，信息蓝作主色，绿 / 橙 / 红表示状态。',
    descEn: 'Classic admin with a dark sidebar: #1A2232 slate sidebar where the active item is a solid #2F6BFF blue block; the content area is #F3F5F8 light gray with white cards (8px radius, faint shadow 0 1px 2px rgba(16,24,40,.05)); light-gray table header, blue as the primary color, green / orange / red for status.',
    v: { bg: '#F3F5F8', panel: '#FFFFFF', nav: '#1A2232', 'nav-text': '#F1F4F9', 'nav-dim': '#8C97AB', 'nav-hover': 'rgba(255,255,255,.06)', 'nav-active': '#2F6BFF', 'nav-active-text': '#FFFFFF', 'nav-line': '#263044',
      text: '#1C2433', dim: '#6B7588', line: '#E3E7ED', hover: '#F5F7FA', accent: '#2F6BFF', 'on-accent': '#FFFFFF', ok: '#19A463', warn: '#E08A0B', danger: '#E5484D',
      radius: '8px', 'radius-sm': '6px', shadow: '0 1px 2px rgba(16,24,40,.05)', th: '#F8F9FB' },
    av: ['#2F6BFF', '#19A463', '#E08A0B', '#8B5CF6'],
  },
  {
    id: 'soft', zh: '柔和 SaaS', en: 'Soft SaaS', nav: 'side', term: 'Soft UI 柔和风',
    use: '亲和、不冰冷，适合面向中小团队的 SaaS 和运营后台。', vague: ['{页}想要温柔一点', '后台不要那么死板'],
    desc: '柔和 SaaS 风：淡紫灰底 #F6F5FB，白卡片大圆角 18px、带紫色调的柔和大阴影（0 6px 24px rgba(76,56,160,.07)）；主色紫 #6D4AFF，按钮全部胶囊形；行高宽松 54px，头像用马卡龙色，选中态是淡紫底 + 紫字。',
    descEn: 'Soft SaaS style: #F6F5FB lavender-gray background, white cards with a large 18px radius and a soft violet-tinted shadow (0 6px 24px rgba(76,56,160,.07)); #6D4AFF violet as the primary color, all buttons pill-shaped; airy 54px rows, pastel avatars, selected states are pale violet fill with violet text.',
    v: { bg: '#F6F5FB', panel: '#FFFFFF', nav: '#FFFFFF', 'nav-text': '#2A2540', 'nav-dim': '#8A85A0', 'nav-hover': '#F5F2FF', 'nav-active': '#EEE9FF', 'nav-active-text': '#5B3FE0', 'nav-line': '#ECEAF4',
      text: '#241F3A', dim: '#807A96', line: '#ECE9F4', hover: '#F8F6FE', accent: '#6D4AFF', 'on-accent': '#FFFFFF', ok: '#1BA97F', warn: '#E9862A', danger: '#EF4D6B',
      radius: '18px', 'radius-sm': '12px', 'radius-btn': '999px', shadow: '0 6px 24px rgba(76,56,160,.07)', row: '54px' },
    av: ['#9B87F5', '#F28BAE', '#6CC3B3', '#F2AE62'],
    extra: `.card { border-color: transparent; }
.seg, .fchips button { border-radius: 999px; }
.seg button { border-radius: 999px; }`,
  },
  {
    id: 'glass', zh: '玻璃拟态', en: 'Glassmorphism', nav: 'side', term: 'Glassmorphism 玻璃拟态',
    use: '通透、有层次，适合展示型后台、数据大屏的配置页，或者想让后台“好看一点”的场合。', vague: ['{页}要有高级感', '后台想要毛玻璃'],
    desc: '玻璃拟态：背景是三团柔和的紫、青、粉径向渐变；侧栏和卡片是半透明白 rgba(255,255,255,.58) + backdrop-filter: blur(18px) 磨砂，1px 半透明白描边、圆角 18px、淡蓝紫投影；主色靛蓝 #4B57F0。玻璃只用在大面板上，文字保持实色深蓝 #1E2440 保证可读。',
    descEn: 'Glassmorphism: the background is three soft radial gradients in violet, cyan and pink; sidebar and cards are translucent white rgba(255,255,255,.58) with backdrop-filter: blur(18px), a 1px translucent white border, 18px radius and a faint blue-violet shadow; #4B57F0 indigo as the primary color. Use glass only on large panels and keep text solid #1E2440 for readability.',
    v: { bg: '#EEF0FA', panel: 'rgba(255,255,255,.58)', nav: 'rgba(255,255,255,.42)', 'nav-text': '#1E2440', 'nav-dim': '#5D6485', 'nav-hover': 'rgba(255,255,255,.5)', 'nav-active': 'rgba(255,255,255,.9)', 'nav-active-text': '#3A46D8', 'nav-line': 'rgba(255,255,255,.65)',
      text: '#1E2440', dim: '#5D6485', line: 'rgba(255,255,255,.75)', 'line-soft': 'rgba(30,36,64,.07)', hover: 'rgba(255,255,255,.5)', accent: '#4B57F0', 'on-accent': '#FFFFFF', ok: '#0E9F7A', warn: '#D97B12', danger: '#E5466A',
      radius: '18px', 'radius-sm': '11px', shadow: '0 8px 32px rgba(40,50,120,.12)', bar: 'transparent', field: 'rgba(255,255,255,.62)' },
    av: ['#6D78F7', '#E57BA6', '#3DB5C9', '#9C7CF0'],
    extra: `.app {
  background:
    radial-gradient(40% 50% at 12% 18%, #CDBDFF 0, transparent 70%),
    radial-gradient(45% 55% at 88% 6%, #AEE6F7 0, transparent 70%),
    radial-gradient(50% 60% at 70% 96%, #FFCCE0 0, transparent 70%),
    #EEF0FA;
}
.nav, .card { backdrop-filter: blur(18px) saturate(150%); -webkit-backdrop-filter: blur(18px) saturate(150%); }
.bar { border-bottom-color: rgba(255,255,255,.6); }
.tbl th { border-bottom-color: rgba(30,36,64,.08); }`,
  },
  {
    id: 'neumorph', zh: '新拟物', en: 'Neumorphism', nav: 'rail', term: 'Neumorphism 新拟物',
    use: '软乎乎、像实体按键，适合设备控制、智能家居这类按钮多、数据少的后台。', vague: ['想要凸起来的按钮', '{页}像实物一样'],
    desc: '新拟物：整页同一种浅灰蓝 #E8ECF2，没有描边，靠左上白色、右下灰色两道阴影做出“凸起”（7px 7px 16px #C9CFD9, -7px -7px 16px #FFFFFF）；输入框和选中的导航项是“凹进去”的内阴影；左侧 64px 图标窄栏；主色 #3D6FE0 只给主按钮和开关。对比度天生偏低，文字用深色 #2E3A4F 补回来。',
    descEn: 'Neumorphism: the whole page is one light blue-gray #E8ECF2 with no borders; elements look raised through a white top-left and gray bottom-right shadow pair (7px 7px 16px #C9CFD9, -7px -7px 16px #FFFFFF); inputs and the active nav item are pressed in with inset shadows; a 64px icon rail on the left; #3D6FE0 is reserved for primary buttons and switches. Contrast is naturally low, so keep text dark #2E3A4F.',
    v: { bg: '#E8ECF2', panel: '#E8ECF2', nav: '#E8ECF2', 'nav-text': '#2E3A4F', 'nav-dim': '#7C8798', 'nav-hover': 'rgba(255,255,255,.35)', 'nav-active': '#E8ECF2', 'nav-active-text': '#3D6FE0', 'nav-line': 'transparent',
      text: '#2E3A4F', dim: '#738096', line: '#D3D9E2', hover: 'rgba(255,255,255,.4)', accent: '#3D6FE0', 'on-accent': '#FFFFFF', ok: '#1F9A63', warn: '#C97A22', danger: '#D24C48',
      radius: '18px', 'radius-sm': '12px', shadow: '7px 7px 16px #C9CFD9, -7px -7px 16px #FFFFFF', bar: 'transparent', field: '#E8ECF2' },
    av: ['#7F9CF5', '#F59E8B', '#6CC4A1', '#B48CF2'],
    extra: `.card, .btn, input, select, textarea, .seg, .fchips button { border-color: transparent; }
.btn { box-shadow: 4px 4px 10px #C9CFD9, -4px -4px 10px #FFFFFF; }
.btn:active, .seg, .nav a.on, .fchips button[aria-pressed="true"] { box-shadow: inset 3px 3px 7px #C9CFD9, inset -3px -3px 7px #FFFFFF; }
.fchips button { box-shadow: 3px 3px 8px #CDD3DC, -3px -3px 8px #FFFFFF; }
.fchips button[aria-pressed="true"] { background: var(--bg); color: var(--accent); }
input, select, textarea { box-shadow: inset 3px 3px 7px #CBD1DB, inset -3px -3px 7px #FFFFFF; }
input:focus, select:focus, textarea:focus { box-shadow: inset 3px 3px 7px #CBD1DB, inset -3px -3px 7px #FFFFFF, 0 0 0 2px rgba(61,111,224,.35); }
.seg button[aria-pressed="true"] { box-shadow: 3px 3px 6px #C9CFD9, -3px -3px 6px #FFFFFF; }
.bar { border-bottom-color: transparent; }`,
  },
  {
    id: 'brutal', zh: '新粗野', en: 'Neo-Brutalism', nav: 'top', term: 'Neo-Brutalism 新粗野主义',
    use: '个性鲜明、一眼记住，适合创意团队、独立开发者的小工具后台。', vague: ['{页}想要有个性', '后台不想和别人一样'],
    desc: '新粗野主义：奶油底 #FFF8E7，顶部明黄 #FFD43B 横向导航；所有卡片、按钮、输入框都是 2px 纯黑描边 + 4px 4px 0 纯黑硬投影（无模糊），圆角只有 4–6px；标题字重 800，主按钮珊瑚红 #FF6B4A 配黑字，悬停时整块往左上“抬起”、按下时压进阴影里；表头是明黄底黑字。',
    descEn: 'Neo-brutalism: #FFF8E7 cream background with a bright #FFD43B yellow top navigation; every card, button and input has a 2px solid black border and a hard 4px 4px 0 black shadow (no blur), radius only 4–6px; headings at weight 800, primary buttons coral #FF6B4A with black text that lift up-left on hover and press into the shadow on click; table header is yellow with black text.',
    v: { bg: '#FFF8E7', panel: '#FFFFFF', nav: '#FFD43B', 'nav-text': '#111111', 'nav-dim': '#111111', 'nav-hover': 'rgba(0,0,0,.08)', 'nav-active': '#111111', 'nav-active-text': '#FFD43B', 'nav-line': '#111111',
      text: '#111111', dim: '#4A4A4A', line: '#111111', 'line-soft': 'rgba(17,17,17,.18)', hover: '#FFF1C2', accent: '#FF6B4A', 'on-accent': '#111111', ok: '#22A565', warn: '#E39A00', danger: '#E5383B',
      radius: '6px', 'radius-sm': '4px', shadow: '4px 4px 0 #111111', 'head-weight': '800', th: '#FFD43B' },
    av: ['#7DD3FC', '#FDA4AF', '#86EFAC', '#C4B5FD'], avText: '#111111',
    extra: `.card, .btn, input, select, textarea, .seg, .fchips button, .chip { border-width: 2px; border-color: #111; }
.nav { border-bottom-width: 2px; }
.btn { box-shadow: 3px 3px 0 #111; font-weight: 700; transition: transform .1s, box-shadow .1s; }
.btn:hover { background: var(--panel); transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #111; }
.btn.pri:hover { background: var(--accent); filter: none; }
.btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #111; }
input:focus, select:focus, textarea:focus { box-shadow: 3px 3px 0 #111; }
.badge { color: #111; border: 1.5px solid #111; border-radius: 4px; background: color-mix(in srgb, var(--c) 40%, #fff); }
.badge::before { background: #111; }
.tbl th { color: #111; font-weight: 700; border-bottom: 2px solid #111; }
.av { border: 2px solid #111; }
.fchips button[aria-pressed="true"] { background: #111; color: #FFD43B; }`,
  },
  {
    id: 'dense', zh: '高密度数据', en: 'Dense Data', nav: 'top', term: 'High Density 高信息密度',
    use: '一屏看更多，适合运维、风控、客服这类整天盯着表格干活的专业用户。', vague: ['{页}一屏放不下', '表格太松了'],
    desc: '高密度数据风：12px 字号、32px 行高，表格每个单元格都有 1px #D8DCE1 网格线、偶数行极浅斑马纹；圆角只有 3–4px，没有阴影；数字一律用等宽字体，徽标是方角小色块；顶部 44px 横向导航，留白压到最小，一屏尽量多放数据。',
    descEn: 'Dense data style: 12px text and 32px rows, every table cell has a 1px #D8DCE1 grid line with very light zebra striping on even rows; radius only 3–4px and no shadows; all numbers in a monospace font, badges are small square color chips; a 44px top navigation and minimal padding so one screen shows as much data as possible.',
    v: { bg: '#F4F5F7', panel: '#FFFFFF', nav: '#FFFFFF', 'nav-text': '#1F2328', 'nav-dim': '#59636E', 'nav-hover': '#F1F2F4', 'nav-active': '#E7EEFB', 'nav-active-text': '#0B57D0', 'nav-line': '#D8DCE1',
      text: '#1F2328', dim: '#636C76', line: '#D8DCE1', hover: '#F3F6FA', accent: '#0B57D0', 'on-accent': '#FFFFFF', ok: '#1A7F37', warn: '#9A6700', danger: '#CF222E',
      radius: '4px', 'radius-sm': '3px', shadow: 'none', size: '12px', row: '32px', 'font-num': 'mono', th: '#F6F8FA' },
    av: ['#0B57D0', '#1A7F37', '#9A6700', '#8250DF'],
    extra: `.nav { height: 44px; }
.nav a { height: 30px; }
.body { padding: 14px 16px; }
.ph { margin-bottom: 12px; }
.ph h1 { font-size: 17px; }
.btn, input, select { height: 28px; }
.btn { padding: 0 10px; }
.tbl th, .tbl td { padding: 0 8px; border: 1px solid var(--line); }
.tbl th { height: 30px; }
.tbl tbody tr:nth-child(even):not(.more) { background: #FAFBFC; }
.tbl tbody tr:hover { background: var(--hover); }
.badge { height: 18px; border-radius: 2px; font-size: 11px; }
.badge::before { display: none; }
.stat { padding: 10px 12px; }
.stat b { font-size: 20px; }
.stats, .acc, .roles, .set { gap: 10px; }
.av { width: 22px; height: 22px; font-size: 10px; border-radius: 3px; }
.tabs button { height: 36px; }
.sec { padding: 14px 16px; }`,
  },
  {
    id: 'dark-tech', zh: '深色科技', en: 'Dark Tech', nav: 'rail', term: 'Dark Mode 深色模式',
    use: '冷静、专业、偏工程感，适合开发者平台、云服务控制台、安全运维。', vague: ['{页}要有科技感', '暗色的控制台'],
    desc: '深色科技风：近黑底 #0A0D14，面板 #10141E 带极淡纵向渐变、1px #1E2533 描边；左侧 64px 图标窄栏；主色青 #22D3EE，主按钮带青色外发光，选中导航项左侧有一道青色亮条；数字用等宽字体，文字分三层灰度（#E6EBF5 / #7D879B / #5B6477）。',
    descEn: 'Dark tech style: near-black #0A0D14 background, #10141E panels with a faint vertical gradient and 1px #1E2533 borders; a 64px icon rail on the left; #22D3EE cyan as the primary color, primary buttons with a cyan outer glow, the active nav item marked by a cyan bar on its left edge; numbers in monospace, text in three gray levels (#E6EBF5 / #7D879B / #5B6477).',
    v: { bg: '#0A0D14', panel: '#10141E', nav: '#0D111A', 'nav-text': '#E6EBF5', 'nav-dim': '#6B7487', 'nav-hover': '#161B27', 'nav-active': 'rgba(34,211,238,.12)', 'nav-active-text': '#22D3EE', 'nav-line': '#1A2030',
      text: '#E6EBF5', dim: '#7D879B', line: '#1E2533', hover: '#151A26', accent: '#22D3EE', 'on-accent': '#04141A', ok: '#34D399', warn: '#FBBF24', danger: '#F87171',
      radius: '12px', 'radius-sm': '8px', shadow: 'none', bar: '#0D111A', field: '#0C1018', 'font-num': 'mono', th: '#0D111A', scheme: 'dark' },
    av: ['#155E75', '#3730A3', '#065F46', '#7C2D12'],
    extra: `.card { background: linear-gradient(180deg, #121826, #0F131C); }
.btn.pri { box-shadow: 0 0 18px rgba(34,211,238,.35); }
.nav a.on { box-shadow: inset 2px 0 0 #22D3EE; }
input:focus, select:focus, textarea:focus { box-shadow: 0 0 0 3px rgba(34,211,238,.16), 0 0 16px rgba(34,211,238,.12); }`,
  },
  {
    id: 'terminal', zh: '复古终端', en: 'Terminal', nav: 'side', term: 'Terminal UI 终端风',
    use: '极客味十足，适合开发者工具、命令行产品的配套后台，或者内部运维面板。', vague: ['像黑客电影里的{页}', '想要命令行的感觉'],
    desc: '复古终端风：近黑绿底 #0B0F0C，全站等宽字体，磷光绿文字 #C6F6D5、高亮 #6EF0A0；几乎没有圆角（2px），1px #1F3A28 深绿线框，不用阴影；标题前加“> ”提示符、末尾一个闪烁光标；状态徽标写成 [活跃] 这样的方括号文字，不用色块。',
    descEn: 'Retro terminal style: #0B0F0C near-black green background, monospace font everywhere, phosphor-green text #C6F6D5 with #6EF0A0 highlights; almost no radius (2px), 1px #1F3A28 dark-green frames and no shadows; headings start with a "> " prompt and end with a blinking cursor; status badges are bracketed text like [ACTIVE] instead of color pills.',
    v: { bg: '#0B0F0C', panel: '#0F1510', nav: '#0B0F0C', 'nav-text': '#C6F6D5', 'nav-dim': '#5E8A6B', 'nav-hover': '#132016', 'nav-active': '#18301F', 'nav-active-text': '#6EF0A0', 'nav-line': '#1D3324',
      text: '#C6F6D5', dim: '#6E9A7B', line: '#1F3A28', 'line-soft': '#16271B', hover: '#132016', accent: '#6EF0A0', 'on-accent': '#07160C', ok: '#6EF0A0', warn: '#F5D06F', danger: '#FF7A7A',
      radius: '2px', 'radius-sm': '2px', shadow: 'none', font: 'mono', head: 'mono', field: '#0B0F0C', scheme: 'dark' },
    av: ['#1E4D2B', '#2D4A1E', '#1E3D4D', '#4D3B1E'], avText: '#C6F6D5',
    extra: `.ph h1::before { content: "> "; color: var(--accent); }
.ph h1::after { content: "_"; color: var(--accent); animation: blink 1.1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.badge { height: auto; padding: 0; background: none; border-radius: 0; }
.badge::before { content: "["; width: auto; height: auto; border-radius: 0; background: none; }
.badge::after { content: "]"; }
.av { border-radius: 2px; }
.sw i, .sw i::after { border-radius: 2px; }`,
  },
  {
    id: 'editorial', zh: '杂志编辑', en: 'Editorial', nav: 'top', term: 'Editorial 杂志风',
    use: '有文化气质、克制耐看，适合出版、内容平台、文创品牌的管理后台。', vague: ['{页}想要有书卷气', '后台像报纸一样'],
    desc: '杂志编辑风：米白纸张底 #F5F0E6，大号衬线标题（30px、粗体），标题下压一条 2px 墨黑粗线；正文无衬线、墨色 #1B1A17，表头用小号大写加宽字距；只用一个砖红强调色 #B4362B，徽标是描边小方框；顶部横向导航，选中项是底部一道砖红线；几乎不用圆角和阴影，靠细线和留白分层。',
    descEn: 'Editorial style: #F5F0E6 off-white paper background, large 30px bold serif headings underlined by a heavy 2px ink rule; body text in sans-serif ink #1B1A17, table headers in small uppercase with wide letter-spacing; a single brick-red accent #B4362B, badges as small outlined boxes; top navigation where the active item gets a brick-red underline; almost no radius or shadows, layered with hairlines and whitespace.',
    v: { bg: '#F5F0E6', panel: '#FBF8F2', nav: '#F5F0E6', 'nav-text': '#1B1A17', 'nav-dim': '#6F6A5F', 'nav-hover': 'rgba(27,26,23,.05)', 'nav-active': 'transparent', 'nav-active-text': '#1B1A17', 'nav-line': '#1B1A17',
      text: '#1B1A17', dim: '#6F6A5F', line: '#D9D1C2', hover: '#F1EBDF', accent: '#B4362B', 'on-accent': '#FFFFFF', ok: '#4E7D4A', warn: '#A86C12', danger: '#B4362B',
      radius: '2px', 'radius-sm': '2px', shadow: 'none', head: 'serif', 'head-weight': '700', row: '50px' },
    av: ['#1B1A17', '#B4362B', '#4E7D4A', '#6F6A5F'],
    extra: `.ph { padding-bottom: 14px; border-bottom: 2px solid #1B1A17; }
.ph h1 { font-size: 30px; letter-spacing: -.01em; }
.nav a.on { border-radius: 0; box-shadow: inset 0 -2px 0 #B4362B; font-weight: 600; }
.tbl th { color: #1B1A17; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; border-bottom: 1px solid #1B1A17; }
.badge { height: 20px; border: 1px solid currentColor; border-radius: 2px; background: none; }
.badge::before { display: none; }
.stat b, .sec h2, .mhead h2, .profile h2 { font-family: var(--font-head); }
.fchips button[aria-pressed="true"] { background: #1B1A17; color: #F5F0E6; }`,
  },
  {
    id: 'jiangyue', zh: '江月夜色', en: 'Moonlit River', nav: 'side', term: '江上明月（江月 UI 主题）',
    use: '江月 UI 自家的视觉主题：沉静、有东方意境，适合文化、内容和品牌感强的产品。', vague: ['{页}想要有中国风', '暗色但不要冷冰冰'],
    desc: '江月夜色（江月 UI 自家主题）：夜色江面般的深蓝底 #0F1726，卡片 #152033 带微弱纵向渐变、1px #22304A 描边；侧栏顶端有一团月光般的暖金色径向光晕；主色江月橘 #FA8C16（主按钮做浅橘到橘的竖向渐变），表头和次级强调用月光暖金 #C9B48A；标题用宋体类衬线字、略加字距，正文暖白 #EDE6D6。',
    descEn: 'Moonlit River (the house theme of Jiangyue UI): deep night-river blue #0F1726 background, #152033 cards with a faint vertical gradient and 1px #22304A borders; a warm moonlight-gold radial glow at the top of the sidebar; #FA8C16 orange as the primary color (primary buttons use a light-orange-to-orange vertical gradient), warm moon gold #C9B48A for table headers and secondary accents; serif (Songti-style) headings with slight letter-spacing, warm white #EDE6D6 body text.',
    v: { bg: '#0F1726', panel: '#152033', nav: '#0B1220', 'nav-text': '#EDE6D6', 'nav-dim': '#8A93A6', 'nav-hover': 'rgba(237,230,214,.05)', 'nav-active': 'rgba(250,140,22,.13)', 'nav-active-text': '#FFB45C', 'nav-line': '#1E2A40',
      text: '#EDE6D6', dim: '#8F98AB', line: '#22304A', hover: '#1A2740', accent: '#FA8C16', 'on-accent': '#1A0E02', ok: '#5BC8A0', warn: '#F2C46D', danger: '#F07A6A',
      radius: '12px', 'radius-sm': '8px', shadow: '0 10px 30px rgba(0,0,0,.25)', head: 'serif', bar: '#0F1726', field: '#101A2B', th: 'transparent', scheme: 'dark' },
    av: ['#8A6A3B', '#3B5A8A', '#4F7A6A', '#7A4F5E'],
    extra: `.nav { background: radial-gradient(160px 130px at 30% 0%, rgba(255,214,150,.14), transparent 70%), #0B1220; }
.brand i { background: linear-gradient(135deg, #FFE3B0, #E8B36A); color: #0B1220; }
.ph h1 { letter-spacing: .04em; }
.card { background: linear-gradient(180deg, #16233A, #131D30); }
.btn.pri { background: linear-gradient(180deg, #FFA53D, #FA8C16); }
.tbl th { color: #C9B48A; }`,
  },
  {
    id: 'swiss', zh: '瑞士国际', en: 'Swiss Style', nav: 'top', term: 'Swiss Style 瑞士国际主义',
    use: '理性、清楚、信息层级一目了然，适合设计团队、咨询公司和重视排版的产品后台。', vague: ['{页}要有设计感但别花哨', '后台像海报一样有秩序'],
    desc: '瑞士国际主义：纯白底 #FFFFFF，顶部纯黑 #111111 横向导航，选中项是实心信号红 #E3000F 色块；完全直角（圆角 0）、不用阴影，卡片用 1px #111111 黑线框；标题 32px、字重 800、字距 -0.02em 紧排，标题下压一条 6px 宽的红色短横；表头小号大写、黑字、底部 2px 黑线；数字用等宽对齐，全站只有黑、白、红三种颜色，状态用小方块区分。',
    descEn: 'Swiss International style: pure white #FFFFFF with a solid black #111111 top navigation where the active item is a solid signal-red #E3000F block; square corners (0 radius) and no shadows, cards framed by 1px #111111 black lines; headings at 32px, weight 800, tight -0.02em tracking, with a short 6px-wide red bar under the title; table headers in small uppercase black with a 2px black rule below; tabular numbers; the whole site uses only black, white and red, with small squares for status.',
    v: { bg: '#FFFFFF', panel: '#FFFFFF', nav: '#111111', 'nav-text': '#FFFFFF', 'nav-dim': '#BDBDBD', 'nav-hover': 'rgba(255,255,255,.1)', 'nav-active': '#E3000F', 'nav-active-text': '#FFFFFF', 'nav-line': '#111111',
      text: '#111111', dim: '#5E5E5E', line: '#111111', 'line-soft': '#E2E2E2', hover: '#F4F4F4', accent: '#E3000F', 'on-accent': '#FFFFFF', ok: '#111111', warn: '#8A8A8A', danger: '#E3000F',
      radius: '0px', 'radius-sm': '0px', shadow: 'none', 'head-weight': '800', th: '#FFFFFF' },
    av: ['#111111', '#E3000F', '#5E5E5E', '#111111'],
    extra: `.ph { position: relative; padding-bottom: 16px; }
.ph::after { content: ""; position: absolute; left: 0; bottom: 0; width: 48px; height: 6px; background: #E3000F; }
.ph h1 { font-size: 32px; letter-spacing: -.02em; }
.brand i, .nav .av { background: #E3000F; }
.tbl th { color: #111; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; border-bottom: 2px solid #111; }
.badge { height: auto; padding: 0; background: none; color: #111; }
.badge::before { width: 8px; height: 8px; border-radius: 0; background: var(--c); }
.btn.pri { background: #111; border-color: #111; color: #fff; }
.btn.pri:hover { background: #E3000F; border-color: #E3000F; filter: none; }
.av { border-radius: 0; }
.seg { border: 1px solid #111; padding: 0; gap: 0; background: #fff; }
.seg button { height: 30px; }
.seg button[aria-pressed="true"] { background: #111; color: #fff; box-shadow: none; }
.fchips button { border-color: #111; }
.fchips button[aria-pressed="true"] { background: #111; color: #fff; }
.sw i, .sw i::after { border-radius: 0; }`,
  },
  {
    id: 'clay', zh: '黏土拟态', en: 'Claymorphism', nav: 'rail', term: 'Claymorphism 黏土拟态',
    use: '圆润、胖乎乎、像捏出来的软陶，适合面向年轻用户、教育和创意工具的轻量后台。', vague: ['{页}要可爱一点', '像橡皮泥捏的按钮'],
    desc: '黏土拟态：薄荷灰底 #E7F2EE，卡片奶白 #FDFCF8、超大圆角 24px，没有描边，靠“外面一层柔和投影 + 里面左上亮、右下暗的两道内阴影”做出鼓起来的软陶感（14px 16px 32px rgba(62,96,84,.16), inset -6px -6px 14px rgba(62,96,84,.08), inset 6px 6px 14px #FFFFFF）；按钮胶囊形同样鼓起，按下时变凹；主色蜜桃橘 #FF8A5B 配深棕字 #3A1606；左侧 64px 图标窄栏，选中项是一颗鼓起的白色圆角块；头像和徽标用糖果色。',
    descEn: 'Claymorphism: #E7F2EE mint-gray background, #FDFCF8 cream cards with an extra-large 24px radius and no borders; the puffy, hand-molded look comes from a soft outer shadow plus two inner shadows, light at top-left and dark at bottom-right (14px 16px 32px rgba(62,96,84,.16), inset -6px -6px 14px rgba(62,96,84,.08), inset 6px 6px 14px #FFFFFF); pill buttons puff up the same way and press in on click; #FF8A5B peach as the primary color with dark-brown #3A1606 text on it; a 64px icon rail on the left where the active item is a puffy white rounded block; candy-colored avatars and badges.',
    v: { bg: '#E7F2EE', panel: '#FDFCF8', nav: '#E7F2EE', 'nav-text': '#28332F', 'nav-dim': '#6B7C76', 'nav-hover': 'rgba(255,255,255,.55)', 'nav-active': '#FDFCF8', 'nav-active-text': '#E8683A', 'nav-line': 'transparent',
      text: '#28332F', dim: '#6B7C76', line: '#E3E9E5', hover: '#F3F7F4', accent: '#FF8A5B', 'on-accent': '#3A1606', ok: '#2E9E78', warn: '#D88A1E', danger: '#E5566B',
      radius: '24px', 'radius-sm': '14px', 'radius-btn': '999px', shadow: '14px 16px 32px rgba(62,96,84,.16), inset -6px -6px 14px rgba(62,96,84,.08), inset 6px 6px 14px #FFFFFF', bar: 'transparent', field: '#F1F5F2', row: '52px', 'head-weight': '700' },
    av: ['#FF9F7A', '#7FC8F8', '#9BE0B8', '#C9A7F5'], avText: '#28332F',
    extra: `.card, .btn, input, select, textarea, .seg, .fchips button { border-color: transparent; }
.bar { border-bottom-color: transparent; }
.btn { box-shadow: 4px 6px 12px rgba(62,96,84,.14), inset -3px -3px 6px rgba(62,96,84,.08), inset 3px 3px 6px #FFFFFF; }
.btn.pri { box-shadow: 4px 6px 14px rgba(232,104,58,.32), inset -3px -3px 6px rgba(150,50,10,.18), inset 3px 3px 6px rgba(255,255,255,.45); }
.btn:active { box-shadow: inset 3px 3px 7px rgba(62,96,84,.18), inset -3px -3px 7px #FFFFFF; }
input, select, textarea { box-shadow: inset 3px 3px 7px rgba(62,96,84,.12), inset -3px -3px 7px #FFFFFF; }
input:focus, select:focus, textarea:focus { box-shadow: inset 3px 3px 7px rgba(62,96,84,.12), inset -3px -3px 7px #FFFFFF, 0 0 0 3px rgba(255,138,91,.35); }
.nav a.on { box-shadow: 4px 6px 12px rgba(62,96,84,.14), inset -3px -3px 6px rgba(62,96,84,.06), inset 3px 3px 6px #FFFFFF; }
.seg { background: #F1F5F2; box-shadow: inset 2px 2px 5px rgba(62,96,84,.12), inset -2px -2px 5px #FFFFFF; border-radius: 999px; }
.seg button { border-radius: 999px; }
.seg button[aria-pressed="true"] { box-shadow: 2px 3px 6px rgba(62,96,84,.16), inset 2px 2px 4px #FFFFFF; }
.fchips button { box-shadow: 2px 3px 7px rgba(62,96,84,.12), inset 2px 2px 4px #FFFFFF; }
.fchips button[aria-pressed="true"] { background: #FF8A5B; color: #3A1606; }
.av { box-shadow: inset -2px -2px 4px rgba(0,0,0,.1), inset 2px 2px 4px rgba(255,255,255,.5); }`,
  },
  {
    id: 'nordic', zh: '北欧原木', en: 'Nordic', nav: 'side', term: 'Scandinavian 北欧风',
    use: '温暖、安静、不累眼，适合长时间使用的内容、家居、生活方式类后台。', vague: ['{页}看着要舒服', '后台想要温暖一点的白'],
    desc: '北欧原木风：暖米白底 #F4F1EC，侧栏是浅橡木色 #E8E1D5，卡片 #FCFBF8、圆角 10px、1px #E4DDD1 描边和很淡的暖色投影（0 1px 3px rgba(80,62,40,.06)）；主色鼠尾草绿 #5C7F67，辅色陶土 #C98B6B 只用在提醒上；文字是带一点绿的炭灰 #2F3833，字重偏轻（标题 600、正文 400），行高宽松 52px；选中导航项是白色块 + 左侧 3px 绿色竖条，整体低饱和、不用纯黑纯白。',
    descEn: 'Nordic oak style: #F4F1EC warm off-white background, a light-oak #E8E1D5 sidebar, #FCFBF8 cards with a 10px radius, a 1px #E4DDD1 border and a very soft warm shadow (0 1px 3px rgba(80,62,40,.06)); #5C7F67 sage green as the primary color, terracotta #C98B6B only for warnings; slightly green charcoal #2F3833 text with light weights (headings 600, body 400) and airy 52px rows; the active nav item is a white block with a 3px green bar on its left; low saturation overall, no pure black or pure white.',
    v: { bg: '#F4F1EC', panel: '#FCFBF8', nav: '#E8E1D5', 'nav-text': '#2F3833', 'nav-dim': '#6E716A', 'nav-hover': 'rgba(252,251,248,.55)', 'nav-active': '#FCFBF8', 'nav-active-text': '#2F3833', 'nav-line': '#DDD4C6',
      text: '#2F3833', dim: '#727770', line: '#E4DDD1', hover: '#F6F3EE', accent: '#5C7F67', 'on-accent': '#FCFBF8', ok: '#5C7F67', warn: '#C98B6B', danger: '#B85C50',
      radius: '10px', 'radius-sm': '8px', shadow: '0 1px 3px rgba(80,62,40,.06)', row: '52px', th: '#F6F3EE' },
    av: ['#8FA897', '#C98B6B', '#A7A08F', '#7D8FA0'],
    extra: `.nav a.on { box-shadow: inset 3px 0 0 #5C7F67, 0 1px 2px rgba(80,62,40,.08); font-weight: 500; }
.brand i { background: #5C7F67; color: #FCFBF8; }
.tbl th { color: #6E716A; font-weight: 500; }
.ph h1 { font-weight: 600; letter-spacing: .01em; }`,
  },
];
