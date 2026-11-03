// 「个人网站」的各种风格。每种风格 = 一组 CSS 变量（颜色、圆角、阴影、字体）+ 版式开关 mods + 少量专属细节 extra + 适合的页面 pages。
// 加一种风格：在下面加一项，pages 里挑 3 种最合适的页面（home 主页、blog 博客、post 文章、portfolio 作品集、resume 简历、
// links 链接页、photo 摄影、garden 数字花园、weekly 周刊），构建时自动生成这几个整页案例。
// mods 可选：navside（导航改左侧竖栏）、center（首屏居中）、cards（博客文章列表做成卡片）。
// desc / descEn 原样拼进提示词：写具体数值（色值、圆角、字体、阴影），不写「高级」「大气」这种空话。
// 规则：只用系统字体（不引入有版权的字体文件）；不点名在世设计师、品牌和具体网站；颜色对比度保证正文能读。
// extra 里只用页面模板的共用类名（.top .hero .title .card .btn .ph .lk …），这样一份 extra 对几种页面都生效。

const SANS = '-apple-system, BlinkMacSystemFont, "Inter", "PingFang SC", "Microsoft YaHei", sans-serif';
export const FONTS = {
  sans: SANS,
  serif: '"Songti SC", "Noto Serif SC", "Source Han Serif SC", Georgia, "Times New Roman", serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, "Courier New", monospace',
  kai: '"Kaiti SC", "STKaiti", "KaiTi", "BiauKai", "Songti SC", serif',
  grotesk: '"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Microsoft YaHei", sans-serif',
  black: '"Arial Black", "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif',
  round: '"Arial Rounded MT Bold", "Yuanti SC", "PingFang SC", "Microsoft YaHei", sans-serif',
  type: '"American Typewriter", "Courier New", Courier, "Songti SC", monospace',
};
const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")";

export const styles = [
  {
    id: 'paper', zh: '暖纸极简', en: 'Warm Paper', term: 'Minimal 极简风', pages: ['blog', 'post', 'weekly'],
    use: '像一本安静的小册子，适合以文字为主、想让人慢慢读的博客。', vague: ['{页}要干净耐看', '想要有书卷气'],
    desc: '暖纸极简：米白纸色底 #F7F3EA，正文深棕 #2B2620，次要文字 #7A7064，1px #E4DCCB 细线分隔，几乎不用阴影；标题用宋体类衬线字、字重 600，正文无衬线；唯一的强调色是陶土红 #B4532A，只用在链接、当前导航的下划线和主按钮；圆角 6px，插图是米黄和陶土色的抽象几何。',
    descEn: 'Warm paper minimal: off-white paper background #F7F3EA, dark brown body text #2B2620, secondary text #7A7064, 1px #E4DCCB hairlines and almost no shadows; headings in a Song-style serif at weight 600 with sans-serif body text; the only accent is terracotta #B4532A, used for links, the active-nav underline and the primary button; 6px radius, illustrations are abstract shapes in beige and terracotta.',
    v: { bg: '#F7F3EA', card: '#FBF8F1', text: '#2B2620', dim: '#7A7064', line: '#E4DCCB', accent: '#B4532A', a1: '#D9C7A7', a2: '#EFE3CC', a3: '#B4532A',
      radius: '6px', 'radius-sm': '4px', head: 'serif', 'head-weight': '600', 'av-text': '#2B2620' },
    extra: `.nav a.on { border-radius: 0; box-shadow: inset 0 -2px 0 var(--accent); background: none; }
.title { font-weight: 600; }`,
  },
  {
    id: 'mono', zh: '纯黑白', en: 'Monochrome', term: 'Monochrome 单色', pages: ['portfolio', 'resume', 'home'],
    use: '只有黑和白，靠字号和留白撑起气质，适合设计师和摄影师。', vague: ['{页}要酷一点', '不要任何颜色'],
    desc: '纯黑白：白底 #FFFFFF、纯黑字 #0A0A0A，次要文字 #6B6B6B，没有任何彩色；分隔线是 1px 纯黑；标题用 Helvetica 类无衬线、字重 800、字距 -0.03em，首屏标题 72px 以上；直角（圆角 0），按钮是黑底白字的方块，标签是黑色细框；插图全部去色成灰度。',
    descEn: 'Monochrome: white #FFFFFF background, pure black #0A0A0A text, secondary text #6B6B6B and no color at all; dividers are 1px solid black; headings in a Helvetica-style sans at weight 800 with -0.03em tracking, the hero headline 72px or larger; square corners (0 radius), buttons are black blocks with white text, tags are thin black outlines; all images are grayscale.',
    v: { bg: '#FFFFFF', bg2: '#F4F4F4', text: '#0A0A0A', dim: '#6B6B6B', line: '#0A0A0A', accent: '#0A0A0A', a1: '#1A1A1A', a2: '#BDBDBD', a3: '#F5F5F5',
      radius: '0', 'radius-sm': '0', head: 'grotesk', font: 'grotesk', 'head-weight': '800', 'head-track': '-.03em', 'title-size': '72px' },
    extra: `.ph { filter: grayscale(1); }
.tag { border: 1px solid currentColor; background: none; border-radius: 0; color: var(--text); }
.chips button { border-radius: 0; }
.mark { border-radius: 0; }
.rs-skills i::after { background: var(--text); }`,
  },
  {
    id: 'swiss', zh: '瑞士网格', en: 'Swiss Grid', term: 'Swiss Style 瑞士国际主义', pages: ['portfolio', 'resume', 'weekly'],
    use: '理性、清晰、信息密度高，适合想显得专业可靠的个人站。', vague: ['{页}要专业、有条理', '排版要整齐'],
    desc: '瑞士国际主义：浅灰白底 #F4F4F0，黑字 #111111，唯一强调色信号红 #E3120B；标题用 Helvetica 类无衬线、字重 800、字距 -0.02em，首屏标题 76px，左对齐、靠严格的网格和大量留白排版；小标题前有一个红色实心方块；直角，分隔线 1px 黑；插图是红、黑、白三色的几何块。',
    descEn: 'Swiss International style: light off-white #F4F4F0 background, black #111111 text and a single signal red #E3120B accent; headings in a Helvetica-style sans at weight 800 with -0.02em tracking, a 76px left-aligned hero headline, layout driven by a strict grid and generous white space; small labels start with a solid red square; square corners and 1px black dividers; illustrations are red, black and white geometric blocks.',
    v: { bg: '#F4F4F0', card: '#FFFFFF', text: '#111111', dim: '#555555', line: '#111111', accent: '#E3120B', a1: '#E3120B', a2: '#111111', a3: '#F4F4F0',
      radius: '0', 'radius-sm': '0', font: 'grotesk', head: 'grotesk', 'head-weight': '800', 'head-track': '-.02em', 'title-size': '76px' },
    extra: `.kicker { display: flex; align-items: center; gap: 10px; color: var(--text); }
.kicker::before { content: ""; width: 12px; height: 12px; background: var(--accent); }
.tag, .chips button { border-radius: 0; }
.hero { border-bottom: 4px solid var(--text); margin-bottom: 36px; }`,
  },
  {
    id: 'editorial', zh: '杂志编辑', en: 'Editorial', term: 'Editorial 杂志风', pages: ['blog', 'post', 'photo'], mods: ['center'],
    use: '像翻开一本印刷杂志：衬线大标题、双线分隔，适合认真写长文或做专题的人。', vague: ['{页}要有杂志感', '想要报刊那种排版'],
    desc: '杂志编辑风：象牙白底 #FBFAF7，正文 #1B1B1B，次要文字 #6F6A62；标题用宋体类衬线字、字重 500、字距 -0.02em，首屏标题 80px 居中；顶栏下方是一粗一细的双线，首屏下面一道 1px 黑线收尾；小字栏目名加宽字距 0.3em；强调色深酒红 #9E2B25，只给链接和引用竖线；插图是藏青、驼色和酒红。',
    descEn: 'Editorial magazine style: ivory #FBFAF7 background, #1B1B1B body text, #6F6A62 secondary text; headings in a Song-style serif at weight 500 with -0.02em tracking, an 80px centered hero headline; a thick-and-thin double rule under the top bar and a 1px black rule closing the hero; small section labels widely tracked at 0.3em; deep wine red #9E2B25 accent only for links and quote rules; illustrations in navy, camel and wine.',
    v: { bg: '#FBFAF7', text: '#1B1B1B', dim: '#6F6A62', line: '#D9D4CA', accent: '#9E2B25', a1: '#2E3B4E', a2: '#C9B79C', a3: '#9E2B25',
      radius: '2px', 'radius-sm': '2px', head: 'serif', 'head-weight': '500', 'head-track': '-.02em', 'title-size': '80px' },
    extra: `.top { border-bottom: 0; box-shadow: 0 1px 0 var(--text), 0 4px 0 var(--bg), 0 5px 0 var(--text); }
.brand { font-size: 22px; }
.kicker { color: var(--text); letter-spacing: .3em; }
.hero { border-bottom: 1px solid var(--text); margin-bottom: 28px; }
.center .ph-tabs { justify-content: center; }`,
  },
  {
    id: 'terminal', zh: '终端极客', en: 'Terminal', term: 'Terminal UI 终端风', pages: ['blog', 'garden', 'home'],
    use: '整站像一个命令行窗口，适合程序员和喜欢折腾的人。', vague: ['{页}要有黑客感', '像命令行一样'],
    desc: '终端极客风：近黑绿底 #0C0F0A，荧光绿字 #C8F7C5，次要文字 #6E8F6A，强调色亮绿 #4BF26B；全站等宽字体、字号 14px；标题前加「> 」提示符、末尾一个闪烁的下划线光标；导航项前缀「./」；整页叠一层很淡的横向扫描线；圆角 2px，卡片是比底色略亮的 #10160E 加 1px #234A2A 描边。',
    descEn: 'Terminal style: near-black green background #0C0F0A, phosphor green text #C8F7C5, secondary text #6E8F6A and bright green #4BF26B accent; monospace everywhere at 14px; headings start with a "> " prompt and end with a blinking underscore cursor; nav items are prefixed with "./"; a very faint horizontal scanline overlay covers the page; 2px radius, cards are a slightly lighter #10160E with a 1px #234A2A border.',
    v: { bg: '#0C0F0A', bg2: '#0F140D', card: '#10160E', text: '#C8F7C5', dim: '#6E8F6A', line: '#234A2A', accent: '#4BF26B', 'on-accent': '#0C0F0A', a1: '#12301A', a2: '#1E5A2B', a3: '#4BF26B',
      radius: '2px', 'radius-sm': '2px', font: 'mono', size: '14px', 'head-weight': '700', 'title-size': '50px', scheme: 'dark', 'av-text': '#0C0F0A' },
    extra: `.site { position: relative; }
.site::after { content: ""; position: absolute; inset: 0; z-index: 5; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px); }
.title::before { content: "> "; color: var(--accent); }
.title::after { content: "_"; color: var(--accent); animation: tm-blink 1s steps(1) infinite; }
@keyframes tm-blink { 50% { opacity: 0; } }
.nav a::before { content: "./"; opacity: .5; }
.mark, .avatar { border-radius: 2px; }
.chips button[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: var(--bg); }`,
  },
  {
    id: 'brutal', zh: '新粗野', en: 'Neo-Brutalism', term: 'Neo-Brutalism 新粗野主义', pages: ['portfolio', 'links', 'home'],
    use: '粗黑描边加硬投影，大胆、好玩、记得住，适合个性鲜明的创作者。', vague: ['{页}要大胆、有个性', '想要那种粗边框硬阴影'],
    desc: '新粗野主义：奶黄底 #FFF4D6，所有卡片、按钮、插图都是 2px 纯黑 #111111 描边 + 向右下 5px 的纯黑硬投影（不模糊）；配色是高饱和的番茄红 #FF5C39、柠檬黄 #FFD23F、紫 #7B61FF；标题用 Arial Black 类超粗字、72px；按钮悬停时向左上移 2px、投影变长，像被拿起来；小标签是黄底黑框。',
    descEn: 'Neo-brutalism: cream #FFF4D6 background; every card, button and image has a 2px solid #111111 border and a hard 5px black offset shadow (no blur); saturated palette of tomato #FF5C39, lemon #FFD23F and violet #7B61FF; headings in an Arial Black-style ultra-bold face at 72px; buttons shift 2px up-left on hover with a longer shadow, as if lifted; small tags are yellow with black outlines.',
    v: { bg: '#FFF4D6', bg2: '#FFE9A8', card: '#FFFFFF', text: '#111111', dim: '#3D3D3D', line: '#111111', accent: '#FF5C39', 'on-accent': '#111111', a1: '#7B61FF', a2: '#FFD23F', a3: '#FF5C39',
      radius: '10px', 'radius-sm': '8px', shadow: '5px 5px 0 #111111', bw: '2px', head: 'black', 'head-weight': '900', 'head-track': '-.02em', 'title-size': '72px' },
    extra: `.btn, .chips button, .ln-social a { border: 2px solid #111; box-shadow: 3px 3px 0 #111; }
.btn:hover, .lk:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #111; border-color: #111; }
.ph { border: 2px solid #111; }
.tag { border: 2px solid #111; background: #FFD23F; color: #111; font-weight: 700; }
.chips button[aria-pressed="true"] { background: #7B61FF; border-color: #111; color: #fff; }
.kicker { display: inline-block; padding: 3px 10px; background: #111; color: #FFD23F; }
.mark { border: 2px solid #111; }`,
  },
  {
    id: 'glass', zh: '玻璃拟态', en: 'Glassmorphism', term: 'Glassmorphism 玻璃拟态', pages: ['links', 'home', 'weekly'], mods: ['center'],
    use: '彩色光斑上浮着磨砂玻璃卡片，通透轻盈，适合想要一点精致感的个人页。', vague: ['{页}想要毛玻璃', '要通透、有层次'],
    desc: '玻璃拟态：背景是淡紫灰 #E9ECF8 上三团柔和的蓝紫 #8EA2FF、粉 #FFB4D0、青 #9BE7F2 径向渐变光斑；卡片、按钮和顶栏是半透明白 rgba(255,255,255,.55) + backdrop-filter: blur(18px) 磨砂，1px 半透明白描边、圆角 20px、淡蓝紫投影 0 10px 30px rgba(40,50,120,.12)；主色靛紫 #5B5BF0；文字保持实色深蓝 #1C2340 保证可读；首屏居中。',
    descEn: 'Glassmorphism: a pale lavender-gray #E9ECF8 background with three soft radial blobs in periwinkle #8EA2FF, pink #FFB4D0 and aqua #9BE7F2; cards, buttons and the top bar are translucent white rgba(255,255,255,.55) with backdrop-filter: blur(18px), a 1px translucent white border, 20px radius and a faint blue-violet shadow 0 10px 30px rgba(40,50,120,.12); indigo #5B5BF0 as the primary color; text stays solid dark blue #1C2340 for readability; centered hero.',
    v: { bg: '#E9ECF8', bg2: 'transparent', card: 'rgba(255,255,255,.55)', 'top-bg': 'rgba(255,255,255,.4)', text: '#1C2340', dim: '#586080', line: 'rgba(255,255,255,.8)', tag: 'rgba(255,255,255,.6)', accent: '#5B5BF0', a1: '#8EA2FF', a2: '#FFB4D0', a3: '#9BE7F2',
      radius: '20px', 'radius-sm': '14px', 'radius-btn': '999px', shadow: '0 10px 30px rgba(40,50,120,.12)' },
    extra: `.site { background: radial-gradient(40% 50% at 12% 20%, #C9BCFF 0, transparent 70%), radial-gradient(42% 52% at 88% 8%, #A9E4F5 0, transparent 70%), radial-gradient(50% 60% at 70% 96%, #FFCBE0 0, transparent 70%), #E9ECF8; }
.card, .lk, .top, .wk-form, .ln-social a, .btn { backdrop-filter: blur(18px) saturate(150%); -webkit-backdrop-filter: blur(18px) saturate(150%); }
.top { border-bottom-color: rgba(255,255,255,.6); }
.hm-list, .hm-list a, .wk-list a, .foot { border-color: rgba(28,35,64,.08); }
.chips button[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }`,
  },
  {
    id: 'clay', zh: '黏土拟态', en: 'Claymorphism', term: 'Claymorphism 黏土拟态', pages: ['links', 'portfolio', 'weekly'],
    use: '圆滚滚、软乎乎，像捏出来的玩具，适合插画师和面向年轻人的个人页。', vague: ['{页}要可爱、软萌', '想要 3D 黏土那种感觉'],
    desc: '黏土拟态：淡紫底 #F3EEFF，白色卡片超大圆角 28px，外面一层带紫色调的柔和大投影（0 14px 30px rgba(92,64,200,.16)）、里面底边一道内阴影，看起来鼓鼓的；按钮全部胶囊形，主按钮紫 #7C5CFF 带底部内阴影；插图配色是橙 #FFB86B、薰衣草 #A58BFF、薄荷 #6FD3C1，插图圆角 22px；标题用圆体、字重 800；去掉所有描边。',
    descEn: 'Claymorphism: pale lavender #F3EEFF background, white cards with an extra-large 28px radius, a soft violet-tinted outer shadow (0 14px 30px rgba(92,64,200,.16)) plus an inner bottom shadow so they look puffy; all buttons are pills, the primary is violet #7C5CFF with an inset bottom shadow; illustrations in orange #FFB86B, lavender #A58BFF and mint #6FD3C1 with 22px corners; headings in a rounded face at weight 800; no borders anywhere.',
    v: { bg: '#F3EEFF', bg2: '#EDE6FF', card: '#FFFFFF', text: '#2D2350', dim: '#7A6F9B', line: 'transparent', tag: '#EDE6FF', accent: '#7C5CFF', a1: '#FFB86B', a2: '#A58BFF', a3: '#6FD3C1',
      radius: '28px', 'radius-sm': '18px', 'radius-btn': '999px', shadow: '0 14px 30px rgba(92,64,200,.16), inset 0 -6px 0 rgba(92,64,200,.06)', head: 'round', 'head-weight': '800' },
    extra: `.btn { box-shadow: 0 6px 14px rgba(92,64,200,.12), inset 0 -3px 0 rgba(92,64,200,.08); }
.btn.pri { box-shadow: inset 0 -4px 0 rgba(0,0,0,.18), 0 8px 18px rgba(124,92,255,.35); }
.ph { border-radius: 22px; }
.chips button { background: #fff; box-shadow: 0 4px 10px rgba(92,64,200,.1); }
.chips button[aria-pressed="true"] { background: var(--accent); color: #fff; }
.tag { color: #5B3FD6; }
.pf-clients, .wk-list a, .foot { border-color: #E2D9FF; }
.ln-social a { box-shadow: 0 6px 14px rgba(92,64,200,.14); }`,
  },
  {
    id: 'jiangyue', zh: '江月夜色', en: 'Moonlit River', term: '江上明月（江月 UI 主题）', pages: ['home', 'post', 'photo'],
    use: '江月 UI 自家的视觉主题：夜色江面上一轮暖月，沉静、有东方意境，适合写作者和摄影师。', vague: ['{页}想要有中国风', '暗色但不要冷冰冰'],
    desc: '江月夜色：夜江深蓝底 #0F1726，右上角一团月光般的暖金色径向光晕；卡片 #152033、1px #22304A 描边；正文暖白 #EDE6D6，次要文字 #8F98AB；标题用宋体类衬线字、字重 600、字距 0.04em；主色江月橘 #FA8C16（主按钮是浅橘到橘的竖向渐变），小字栏目名用月光暖金 #C9B48A；字标是暖金渐变圆；插图是深蓝层叠的远山和一轮暖月。',
    descEn: 'Moonlit River: deep night-river blue #0F1726 background with a warm moonlight-gold radial glow in the top-right corner; #152033 cards with 1px #22304A borders; warm white #EDE6D6 body text and #8F98AB secondary text; headings in a Song-style serif at weight 600 with 0.04em tracking; Jiangyue orange #FA8C16 as the primary color (primary buttons are a light-orange-to-orange vertical gradient), small labels in moonlight gold #C9B48A; the monogram is a warm gold gradient circle; illustrations are layered dark-blue hills under a warm moon.',
    v: { bg: '#0F1726', bg2: '#0B1220', card: '#152033', 'top-bg': 'rgba(15,23,38,.7)', text: '#EDE6D6', dim: '#8F98AB', line: '#22304A', accent: '#FA8C16', 'on-accent': '#1A0E02', a1: '#1C2B47', a2: '#3B4F75', a3: '#F6D79B',
      radius: '14px', 'radius-sm': '8px', shadow: '0 10px 30px rgba(0,0,0,.25)', head: 'serif', 'head-weight': '600', 'head-track': '.04em', 'title-size': '64px', scheme: 'dark' },
    extra: `.site { background: radial-gradient(520px 380px at 88% -6%, rgba(255,214,150,.16), transparent 70%), #0F1726; }
.mark { background: linear-gradient(135deg, #FFE3B0, #E8B36A); color: #0B1220; }
.btn.pri { background: linear-gradient(180deg, #FFA53D, #FA8C16); }
.kicker { color: #C9B48A; }
.avatar { background: linear-gradient(135deg, #F6D79B, #8A6A3B); color: #0B1220; }`,
  },
  {
    id: 'ink', zh: '水墨留白', en: 'Ink Wash', term: 'Ink Wash 水墨风', pages: ['blog', 'photo', 'home'],
    use: '宣纸色、浓淡墨和一方朱红印章，东方、克制，适合写随笔、诗和拍风景的人。', vague: ['{页}要有东方韵味', '想要水墨那种留白'],
    desc: '水墨留白：宣纸色底 #F5F2EB，墨黑字 #1F1E1C，次要文字淡墨 #7B776F；标题用楷体、字重 400、字距 0.12em；大面积留白；字标做成方形朱红印章 #A33B2B；首屏右侧一行竖排小字（writing-mode: vertical-rl）作点缀；插图只用浓墨 #3A3A38、淡墨 #B9B5AC 和一点朱红；圆角 2px，分隔线 1px #DCD6CA。',
    descEn: 'Ink wash: rice-paper background #F5F2EB, ink-black text #1F1E1C, pale-ink secondary text #7B776F; headings in a Kai (brush-style) typeface at weight 400 with 0.12em tracking; lots of empty space; the monogram is a square vermilion seal #A33B2B; a short line of vertical text (writing-mode: vertical-rl) on the right of the hero as decoration; illustrations use only dark ink #3A3A38, pale ink #B9B5AC and a touch of vermilion; 2px radius and 1px #DCD6CA dividers.',
    v: { bg: '#F5F2EB', card: '#F9F7F2', text: '#1F1E1C', dim: '#7B776F', line: '#DCD6CA', accent: '#A33B2B', a1: '#3A3A38', a2: '#B9B5AC', a3: '#A33B2B',
      radius: '2px', 'radius-sm': '2px', font: 'serif', head: 'kai', 'head-weight': '400', 'head-track': '.12em', 'title-size': '64px' },
    extra: `.mark { border-radius: 3px; font-family: var(--font-head); }
.hero { position: relative; }
.pg-blog .hero::after, .pg-photo .hero::after { content: "一江明月 · 半纸闲书"; position: absolute; right: 8px; top: 72px; writing-mode: vertical-rl; color: var(--dim); font: 15px/1 var(--font-head); letter-spacing: .5em; }
.avatar { background: var(--text); color: var(--bg); font-family: var(--font-head); }
.kicker { letter-spacing: .3em; }`,
  },
  {
    id: 'academic', zh: '学术论文', en: 'Academic Paper', term: 'Academic 学术排版', pages: ['post', 'resume', 'garden'],
    use: '像一篇排版严谨的论文：衬线正文、摘要框、小型大写，适合研究者和写技术长文的人。', vague: ['{页}像论文一样严谨', '要学术一点'],
    desc: '学术论文风：纯白底 #FFFFFF，正文和标题都用衬线字，正文 16px、行高 1.65，内容最宽 920px；导语做成上下两道 1px 黑线夹住的「摘要」块；小字栏目名用小型大写（font-variant: small-caps）；链接用学术蓝 #1F4E9A；直角，标签是细框；插图去色成灰度，像论文里的黑白插图。',
    descEn: 'Academic paper style: plain white #FFFFFF background, serif for both body and headings, 16px body text with 1.65 line height and a 920px max width; the intro is an "abstract" block between two 1px black rules; small labels use small caps (font-variant: small-caps); links in academic blue #1F4E9A; square corners and outlined tags; illustrations are grayscale like figures in a paper.',
    v: { bg: '#FFFFFF', bg2: '#F7F7F7', text: '#111111', dim: '#555555', line: '#D8D8D8', accent: '#1F4E9A', a1: '#9A9A9A', a2: '#E6E6E6', a3: '#1F4E9A',
      radius: '0', 'radius-sm': '0', font: 'serif', head: 'serif', 'head-weight': '700', size: '16px', leading: '1.65', max: '920px', 'title-size': '46px' },
    extra: `.kicker, .rs-side h3, .gd-group h4 { font-variant: small-caps; text-transform: none; letter-spacing: .06em; color: var(--dim); }
.ps-art .lead, .rs-main > .lead { padding: 16px 0; border-block: 1px solid var(--text); color: var(--text); font-size: 15px; }
.ps-art .lead::before, .rs-main > .lead::before { content: "摘要　"; font-weight: 700; }
.ph { filter: grayscale(1); border: 1px solid var(--line); }
.tag, .btn, .chips button { border-radius: 0; }
.tag { background: none; border: 1px solid var(--line); }`,
  },
  {
    id: 'docs', zh: '文档笔记', en: 'Doc Workspace', term: 'Document UI 文档风', pages: ['garden', 'resume', 'blog'], mods: ['navside'],
    use: '像一个整洁的在线文档：左边目录、右边正文，信息组织清楚，适合知识型博客。', vague: ['{页}像在线文档一样整洁', '要好找、好读'],
    desc: '文档笔记风：白底 #FFFFFF，左侧竖栏导航是浅灰 #F7F7F5，正文暖灰黑 #37352F、次要文字 #787774；标题无衬线、字重 700、40px 左右，不追求大字；分隔线 1px #E9E9E7，圆角 4～6px，按钮矮（32px）且安静；强调色只有链接蓝 #2383E2；提示框是浅米色底，标签是浅灰底小方块。',
    descEn: 'Document workspace style: white #FFFFFF content with a light gray #F7F7F5 left navigation column, warm gray-black #37352F text and #787774 secondary text; sans-serif headings at weight 700 around 40px, no oversized type; 1px #E9E9E7 dividers, 4–6px radius, short (32px) quiet buttons; the only accent is link blue #2383E2; callouts have a light beige fill and tags are small light-gray blocks.',
    v: { bg: '#FFFFFF', bg2: '#F7F7F5', 'top-bg': '#F7F7F5', text: '#37352F', dim: '#787774', line: '#E9E9E7', tag: '#F1F1EF', accent: '#2383E2', a1: '#E3D9C6', a2: '#F1EEE8', a3: '#E3B341',
      radius: '6px', 'radius-sm': '4px', 'head-weight': '700', 'title-size': '44px', 'av-text': '#37352F' },
    extra: `.btn { height: 34px; padding: 0 12px; font-weight: 500; }
.nav a.on { background: #EBEBEA; }
.tag { border-radius: 4px; }
.gd-callout { background: #FBF3DB; }
.chips button { border-radius: 4px; }
.chips button[aria-pressed="true"] { background: #EBEBEA; border-color: #EBEBEA; color: var(--text); }`,
  },
  {
    id: 'nordic', zh: '北欧原木', en: 'Nordic', term: 'Scandinavian 北欧风', pages: ['home', 'blog', 'photo'], mods: ['cards'],
    use: '原木、亚麻和一点鼠尾草绿，温暖不花哨，适合生活方式和手作类个人站。', vague: ['{页}要温暖、舒服', '想要北欧那种感觉'],
    desc: '北欧原木风：亚麻白底 #F6F3EE，白色卡片圆角 14px、1px #E6DFD5 描边、几乎无阴影；正文深木色 #2F2A25，次要文字 #857B70；强调色鼠尾草绿 #6E8B74；插图是原木 #C8B49A、亚麻 #E5DACB 和鼠尾草绿；标题无衬线、字重 600；文章列表是两列带插图的卡片。',
    descEn: 'Nordic style: linen white #F6F3EE background, white cards with 14px radius, 1px #E6DFD5 borders and almost no shadow; dark wood #2F2A25 text and #857B70 secondary text; sage green #6E8B74 accent; illustrations in light oak #C8B49A, linen #E5DACB and sage; sans-serif headings at weight 600; the post list is a two-column card grid with illustrations.',
    v: { bg: '#F6F3EE', card: '#FFFFFF', text: '#2F2A25', dim: '#857B70', line: '#E6DFD5', accent: '#6E8B74', a1: '#C8B49A', a2: '#E5DACB', a3: '#6E8B74',
      radius: '14px', 'radius-sm': '10px', 'head-weight': '600', 'title-size': '58px' },
  },
  {
    id: 'y2k', zh: 'Y2K 千禧', en: 'Y2K', term: 'Y2K 千禧风', pages: ['links', 'portfolio', 'home'],
    use: '镀铬字、亮粉和星星闪光，复古又未来，适合潮流、音乐和年轻创作者。', vague: ['{页}要潮一点', '想要千禧年那种闪亮感'],
    desc: 'Y2K 千禧风：冰蓝底 #E8F0FF 上铺一层淡淡的透视网格；大标题做成镀铬金属字（白→银灰→深灰蓝的竖向渐变填充 + 1px 深色描边）；强调色亮粉 #FF3EA5，主按钮是粉色竖向渐变 + 2px 深紫 #1A1446 描边；栏目小字前加「✦」星星；插图配色电光青 #7CF2FF、丁香紫 #C9A7FF、亮粉；圆角 18px。',
    descEn: 'Y2K style: icy blue #E8F0FF background with a faint perspective grid; the large headline is chrome lettering (a white → silver → dark slate vertical gradient fill with a 1px dark outline); hot pink #FF3EA5 accent, the primary button is a pink vertical gradient with a 2px deep violet #1A1446 outline; small labels start with a "✦" sparkle; illustrations in electric cyan #7CF2FF, lilac #C9A7FF and hot pink; 18px radius.',
    v: { bg: '#E8F0FF', bg2: '#DCE6FF', card: '#FFFFFF', text: '#1A1446', dim: '#5A5690', line: '#C9D4F5', accent: '#FF3EA5', a1: '#7CF2FF', a2: '#C9A7FF', a3: '#FF3EA5',
      radius: '18px', 'radius-sm': '12px', 'radius-btn': '999px', head: 'black', 'head-weight': '900', 'title-size': '70px' },
    extra: `.site { background: linear-gradient(rgba(26,20,70,.06) 1px, transparent 1px) 0 0 / 32px 32px, linear-gradient(90deg, rgba(26,20,70,.06) 1px, transparent 1px) 0 0 / 32px 32px, linear-gradient(180deg, #F4E9FF, #E8F0FF 60%); }
.title, .ln-name { background: linear-gradient(180deg, #FFFFFF 0%, #C3CBE6 42%, #5A6AA8 52%, #E6EBFF 100%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-stroke: 1px #1A1446; }
.kicker::before { content: "✦ "; }
.btn.pri { background: linear-gradient(180deg, #FF8ACB, #FF3EA5); border: 2px solid #1A1446; }
.card, .lk { border: 2px solid #1A1446; }
.mark { background: linear-gradient(135deg, #7CF2FF, #C9A7FF); color: #1A1446; border: 2px solid #1A1446; }`,
  },
  {
    id: 'neon', zh: '霓虹夜', en: 'Neon Night', term: 'Neon 霓虹风', pages: ['links', 'blog', 'weekly'], mods: ['cards'],
    use: '深紫夜色里亮起粉和青的灯牌，夜生活感强，适合音乐、游戏和夜猫子。', vague: ['{页}要有夜店感', '想要会发光的霓虹'],
    desc: '霓虹夜：深紫黑底 #0B0820，左上和右下各一团紫红光晕；卡片 #140F33、1px #2A2360 描边；正文淡紫白 #F2EEFF；主色霓虹粉 #FF4FD8、辅色电光青 #33F0FF；大标题带粉色外发光（text-shadow 0 0 18px），主按钮有同色光晕，链接卡悬停时出现青色发光描边；标题用 Arial Black 类超粗字；文章列表是两列卡片。',
    descEn: 'Neon night: deep purple-black #0B0820 background with magenta glows in the top-left and bottom-right; #140F33 cards with 1px #2A2360 borders; pale lavender text #F2EEFF; neon pink #FF4FD8 primary and electric cyan #33F0FF secondary; the headline has a pink outer glow (text-shadow 0 0 18px), the primary button glows the same color and link cards get a cyan glowing outline on hover; headings in an Arial Black-style ultra-bold face; the post list is a two-column card grid.',
    v: { bg: '#0B0820', bg2: '#0E0A28', card: '#140F33', 'top-bg': 'rgba(11,8,32,.75)', text: '#F2EEFF', dim: '#9D96C9', line: '#2A2360', accent: '#FF4FD8', 'on-accent': '#0B0820', a1: '#2B1B6E', a2: '#FF4FD8', a3: '#33F0FF',
      radius: '14px', 'radius-sm': '10px', head: 'black', 'head-weight': '900', scheme: 'dark' },
    extra: `.site { background: radial-gradient(40% 40% at 0% 0%, rgba(255,79,216,.22), transparent 70%), radial-gradient(40% 40% at 100% 100%, rgba(51,240,255,.14), transparent 70%), #0B0820; }
.title, .ln-name { text-shadow: 0 0 18px rgba(255,79,216,.6); }
.btn.pri { box-shadow: 0 0 20px rgba(255,79,216,.55); }
.lk:hover, .card:hover { border-color: #33F0FF; box-shadow: 0 0 0 1px #33F0FF, 0 0 24px rgba(51,240,255,.3); }
.kicker { color: #33F0FF; }
.chips button[aria-pressed="true"] { background: #FF4FD8; border-color: #FF4FD8; color: #0B0820; }`,
  },
  {
    id: 'bauhaus', zh: '包豪斯', en: 'Bauhaus', term: 'Bauhaus 包豪斯', pages: ['portfolio', 'weekly', 'links'],
    use: '红黄蓝三原色和圆、方、三角，几何感强，适合设计师、建筑和艺术类个人站。', vague: ['{页}要有设计感', '想要几何、三原色'],
    desc: '包豪斯风：米黄纸底 #F1E9DA，黑字 #1D1D1B；只用三原色：红 #D7372B、蓝 #1F4AA8、黄 #F2B705；所有描边 2px 纯黑，直角；栏目小字前是一组「红圆 + 蓝方 + 黄条」几何符号；标题用 Helvetica 类无衬线、字重 800；主按钮是蓝底白字黑框；插图是三原色的圆、方、拱形拼贴。',
    descEn: 'Bauhaus style: beige paper #F1E9DA background and black #1D1D1B text; only the three primaries: red #D7372B, blue #1F4AA8, yellow #F2B705; every border is 2px solid black with square corners; small labels start with a "red circle + blue square + yellow bar" glyph; headings in a Helvetica-style sans at weight 800; the primary button is blue with white text and a black border; illustrations are collages of primary-colored circles, squares and arches.',
    v: { bg: '#F1E9DA', bg2: '#E8DCC4', card: '#FAF5EA', text: '#1D1D1B', dim: '#5E5A52', line: '#1D1D1B', accent: '#1F4AA8', a1: '#1F4AA8', a2: '#F2B705', a3: '#D7372B',
      radius: '0', 'radius-sm': '0', bw: '2px', font: 'grotesk', head: 'grotesk', 'head-weight': '800', 'head-track': '-.01em', 'title-size': '70px' },
    extra: `.kicker { display: flex; align-items: center; gap: 12px; color: var(--text); }
.kicker::before { content: ""; width: 48px; height: 12px; flex: none; background: radial-gradient(circle at 6px 6px, #D7372B 5.5px, transparent 6px), linear-gradient(#1F4AA8, #1F4AA8) 18px 0 / 12px 12px no-repeat, linear-gradient(#F2B705, #F2B705) 36px 3px / 12px 6px no-repeat; }
.btn { border: 2px solid var(--text); }
.btn.pri { border-color: var(--text); }
.tag, .chips button { border-radius: 0; }
.mark { background: #D7372B; color: #fff; }
.avatar { border-radius: 0; background: linear-gradient(135deg, #F2B705 50%, #1F4AA8 50%); color: #1D1D1B; }
.ph { border: 2px solid var(--text); }`,
  },
  {
    id: 'memphis', zh: '孟菲斯', en: 'Memphis', term: 'Memphis 孟菲斯风格', pages: ['links', 'portfolio', 'weekly'],
    use: '撞色、波点、粗黑线和错位色块，热闹又好玩，适合插画、潮玩和儿童相关的创作者。', vague: ['{页}要热闹、好玩', '想要撞色波点'],
    desc: '孟菲斯风：奶油底 #FFF8EE 上铺一层很淡的黑色波点（22px 间距）；撞色组合薄荷绿 #2EC4B6、柠檬黄 #FFD447、泡泡粉 #FF6FB5；卡片 2px 黑框 + 向右下 6px 的黄色色块投影；大标题后面错开 3px 一层薄荷绿影子；主按钮粉色；圆角 16px，标签是黑框小胶囊。',
    descEn: 'Memphis style: cream #FFF8EE background with a very faint black polka-dot pattern (22px spacing); clashing palette of mint #2EC4B6, lemon #FFD447 and bubblegum pink #FF6FB5; cards have a 2px black border and a 6px yellow offset block shadow; the headline has a mint copy offset by 3px behind it; pink primary button; 16px radius and small black-outlined pill tags.',
    v: { bg: '#FFF8EE', bg2: '#FFEFD9', card: '#FFFFFF', text: '#1E1E2A', dim: '#5C5B6E', line: '#1E1E2A', accent: '#FF6FB5', 'on-accent': '#1E1E2A', a1: '#2EC4B6', a2: '#FFD447', a3: '#FF6FB5',
      radius: '16px', 'radius-sm': '12px', 'radius-btn': '999px', shadow: '6px 6px 0 #FFD447', bw: '2px', head: 'black', 'head-weight': '900' },
    extra: `.site { background: radial-gradient(rgba(30,30,42,.14) 1.4px, transparent 1.8px) 0 0 / 22px 22px, #FFF8EE; }
.title, .ln-name { text-shadow: 3px 3px 0 #2EC4B6; }
.btn { border: 2px solid #1E1E2A; }
.tag { border: 1.5px solid #1E1E2A; background: #fff; color: #1E1E2A; }
.chips button[aria-pressed="true"] { background: #2EC4B6; border-color: #1E1E2A; color: #1E1E2A; }
.ph { border: 2px solid #1E1E2A; }
.ln-bg { background: none; }`,
  },
  {
    id: 'newspaper', zh: '报纸版面', en: 'Newspaper', term: 'Newspaper Layout 报纸版式', pages: ['blog', 'weekly', 'post'], mods: ['center'],
    use: '像一份每天出版的小报：粗黑衬线标题、双线分栏、黑白配图，适合高频更新的写作者。', vague: ['{页}像报纸一样', '想要老报纸的感觉'],
    desc: '报纸版面：新闻纸色底 #F3EFE6，近黑字 #161513；标题用宋体类衬线、字重 900、64px，首屏居中；顶栏下是一粗一细的双线，栏目名夹在上下两道细线之间；正文两端对齐；插图全部黑白高对比（grayscale + contrast 1.1）；唯一的颜色是标签上的暗红 #8C1C13；直角。',
    descEn: 'Newspaper layout: newsprint #F3EFE6 background and near-black #161513 text; headings in a Song-style serif at weight 900, 64px, centered hero; a thick-and-thin double rule under the top bar, section labels sit between two thin rules; justified body text; all images are high-contrast black and white (grayscale + contrast 1.1); the only color is dark red #8C1C13 on tags; square corners.',
    v: { bg: '#F3EFE6', card: '#F7F4EC', text: '#161513', dim: '#5F5A50', line: '#C9C2B4', accent: '#8C1C13', a1: '#3C3A35', a2: '#A8A196', a3: '#D8D1C2',
      radius: '0', 'radius-sm': '0', font: 'serif', head: 'serif', 'head-weight': '900', 'title-size': '64px' },
    extra: `.top { border-bottom: 0; box-shadow: 0 2px 0 var(--text), 0 5px 0 var(--bg), 0 6px 0 var(--text); }
.brand { font-size: 24px; font-weight: 900; }
.kicker { display: inline-block; padding: 3px 0; border-block: 1px solid var(--text); color: var(--text); letter-spacing: .2em; }
.ph { filter: grayscale(1) contrast(1.1); }
.post p, .ps-art p { text-align: justify; }
.tag { border-radius: 0; background: none; color: var(--accent); font-weight: 700; padding: 0; }
.chips button { border-radius: 0; }
.center .wk-hero { text-align: center; }`,
  },
  {
    id: 'typewriter', zh: '打字机', en: 'Typewriter', term: 'Typewriter 打字机风', pages: ['post', 'garden', 'resume'],
    use: '泛黄稿纸加打字机字体，像一份手稿，适合写作者、编剧和喜欢复古的人。', vague: ['{页}像手稿一样', '想要打字机的感觉'],
    desc: '打字机风：泛黄稿纸底 #F2EDE1，全站用打字机等宽字体（American Typewriter / Courier 一类），正文 15px、行高 1.8；墨色 #2A2722，标题字重 700 并带一点点油墨晕开的阴影（0.5px 偏移）；强调色色带红 #C0392B；按钮和卡片是 1px 虚线框、直角；插图是褪色的米黄和灰。',
    descEn: 'Typewriter style: yellowed manuscript paper #F2EDE1, a typewriter monospace everywhere (American Typewriter / Courier family) at 15px with 1.8 line height; ink color #2A2722, headings at weight 700 with a slight ink-bleed shadow (0.5px offset); ribbon red #C0392B accent; buttons and cards are 1px dashed boxes with square corners; illustrations in faded beige and gray.',
    v: { bg: '#F2EDE1', bg2: '#EBE4D3', card: '#F6F2E8', text: '#2A2722', dim: '#75705F', line: '#BDB49E', accent: '#C0392B', a1: '#CFC6B0', a2: '#E6DFCC', a3: '#C0392B',
      radius: '0', 'radius-sm': '0', font: 'type', 'head-weight': '700', leading: '1.8', 'title-size': '46px', 'av-text': '#2A2722' },
    extra: `.title, .h2, .rs-name { text-shadow: .5px .5px 0 rgba(42,39,34,.35); }
.card, .btn { border-style: dashed; }
.btn.pri { border-style: solid; }
.tag { border-radius: 0; background: none; border: 1px dashed var(--line); }
.ps-art pre { background: #2A2722; }`,
  },
  {
    id: 'pixel', zh: '像素游戏', en: '8-bit Pixel', term: 'Pixel Art 像素风', pages: ['links', 'home', 'blog'],
    use: '像一款老游戏的菜单界面：星空、方块按钮和硬阴影，适合独立游戏开发者和玩家。', vague: ['{页}像游戏界面', '想要像素复古'],
    desc: '像素游戏风：深夜蓝底 #1B1F3B 上撒着两层错开的像素小星星；全站等宽字、标题大写；卡片 #262B52、3px 米白 #F4F1DE 实线框、直角，带向右下 4px 的深色硬阴影；主按钮金币黄 #F9C80E，按下时向右下移 4px、阴影消失，像真的按下了游戏按键；插图配色像素蓝 #3A86FF、紫 #8338EC、金黄。',
    descEn: '8-bit pixel style: midnight blue #1B1F3B background sprinkled with two offset layers of tiny pixel stars; monospace everywhere with uppercase headings; #262B52 cards with a 3px cream #F4F1DE solid border, square corners and a hard 4px dark offset shadow; coin-yellow #F9C80E primary button that moves 4px down-right and loses its shadow when pressed, like a real game key; illustrations in pixel blue #3A86FF, purple #8338EC and gold.',
    v: { bg: '#1B1F3B', bg2: '#161A33', card: '#262B52', 'top-bg': '#161A33', text: '#F4F1DE', dim: '#A7A4C8', line: 'rgba(244,241,222,.22)', tag: 'rgba(244,241,222,.1)', accent: '#F9C80E', 'on-accent': '#1B1F3B', a1: '#3A86FF', a2: '#8338EC', a3: '#F9C80E',
      radius: '0', 'radius-sm': '0', shadow: '4px 4px 0 #0D1028', font: 'mono', 'head-weight': '700', 'head-case': 'uppercase', 'title-size': '52px', scheme: 'dark' },
    extra: `.site { background: radial-gradient(#F4F1DE 1px, transparent 1.5px) 0 0 / 48px 48px, radial-gradient(rgba(244,241,222,.5) 1px, transparent 1.5px) 24px 24px / 64px 64px, #1B1F3B; }
.card, .lk, .btn { border: 3px solid #F4F1DE; box-shadow: 4px 4px 0 #0D1028; }
.btn:active, .lk:active { transform: translate(4px, 4px); box-shadow: none; }
.btn:hover, .lk:hover { transform: none; border-color: #F9C80E; }
.mark, .avatar, .tag, .chips button, .ln-social a { border-radius: 0; }
.avatar { box-shadow: 0 0 0 3px #F4F1DE, 6px 6px 0 #0D1028; }
.kicker::before { content: "▶ "; }`,
  },
  {
    id: 'blueprint', zh: '工程蓝图', en: 'Blueprint', term: 'Blueprint 蓝图风', pages: ['resume', 'portfolio', 'garden'],
    use: '像一张工程图纸：蓝底白线、虚线框和等宽标注，适合工程师、建筑师和硬件玩家。', vague: ['{页}像设计图纸', '要理工科的感觉'],
    desc: '工程蓝图风：图纸蓝底 #0E3A6B 上铺 24px 的白色细网格（7% 透明度）；文字浅蓝白 #E8F1FF，次要文字 #9FBCE0；卡片几乎透明、1px 白色虚线框；小字和标注用等宽字体，栏目名前缀「// 」；唯一的亮色是标注黄 #FFD166；直角；插图是蓝色调的几何图，外加 1px 白色细框。',
    descEn: 'Blueprint style: drafting blue #0E3A6B background with a 24px white fine grid at 7% opacity; pale blue-white #E8F1FF text and #9FBCE0 secondary text; cards are nearly transparent with a 1px dashed white border; small text and annotations in monospace, section labels prefixed with "// "; the only bright color is annotation yellow #FFD166; square corners; illustrations are blue-toned geometry with a 1px white frame.',
    v: { bg: '#0E3A6B', bg2: 'rgba(255,255,255,.03)', card: 'rgba(255,255,255,.04)', 'top-bg': 'rgba(14,58,107,.85)', text: '#E8F1FF', dim: '#9FBCE0', line: 'rgba(232,241,255,.35)', tag: 'rgba(232,241,255,.1)', accent: '#FFD166', 'on-accent': '#0E3A6B', a1: '#1A5291', a2: '#2C6DB5', a3: '#FFD166',
      radius: '0', 'radius-sm': '0', head: 'grotesk', meta: 'mono', 'head-weight': '700', scheme: 'dark' },
    extra: `.site { background: linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px) 0 0 / 24px 24px, #0E3A6B; }
.card { border-style: dashed; }
.kicker::before { content: "// "; }
.ph { outline: 1px solid rgba(232,241,255,.5); outline-offset: 4px; }
.tag, .chips button, .mark, .avatar { border-radius: 0; }`,
  },
  {
    id: 'pastel', zh: '马卡龙', en: 'Pastel', term: 'Pastel 马卡龙色', pages: ['links', 'home', 'photo'], mods: ['center'],
    use: '粉、蓝、紫的低饱和糖果色，甜而不腻，适合手作、烘焙、插画和生活博主。', vague: ['{页}要甜一点、温柔一点', '想要糖果色'],
    desc: '马卡龙风：蜜桃白底 #FFF7F2，白色卡片圆角 22px、带粉色调的柔和投影（0 8px 24px rgba(255,143,171,.15)）；配色是天空蓝 #BDE0FE、樱花粉 #FFC8DD、薰衣草 #CDB4DB 三种低饱和糖果色，主色深一点的粉 #FF8FAB；按钮全部胶囊形；标题用圆体、字重 800；文字是柔和的紫灰 #4A3F55；首屏居中。',
    descEn: 'Pastel style: peach-white #FFF7F2 background, white cards with 22px radius and a soft pink-tinted shadow (0 8px 24px rgba(255,143,171,.15)); three low-saturation candy colors: sky #BDE0FE, sakura #FFC8DD and lavender #CDB4DB, with a deeper pink #FF8FAB as the primary; all buttons are pills; headings in a rounded face at weight 800; text is a soft purple-gray #4A3F55; centered hero.',
    v: { bg: '#FFF7F2', bg2: '#FFEFF4', card: '#FFFFFF', text: '#4A3F55', dim: '#94879F', line: '#F3E3EA', tag: '#FFEAF1', accent: '#FF8FAB', a1: '#BDE0FE', a2: '#FFC8DD', a3: '#CDB4DB',
      radius: '22px', 'radius-sm': '16px', 'radius-btn': '999px', shadow: '0 8px 24px rgba(255,143,171,.15)', head: 'round', 'head-weight': '800', 'title-size': '58px', 'av-text': '#4A3F55' },
    extra: `.tag { color: #D6567A; }
.chips button[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }
.center .ph-tabs { justify-content: center; }
.ln-bg { background: linear-gradient(180deg, #E9F4FF, #FFEFF4); }`,
  },
  {
    id: 'darkmin', zh: '深色极简', en: 'Dark Minimal', term: 'Dark Mode 深色模式', pages: ['portfolio', 'photo', 'post'],
    use: '近黑底、灰阶层次、几乎没有彩色，让作品和照片自己发光，适合摄影和视觉作品。', vague: ['{页}要暗一点、高级一点', '想要深色但干净'],
    desc: '深色极简：近黑底 #0E0E10，卡片 #141416、1px #24242A 描边；正文浅灰白 #EDEDED，次要文字 #8A8A90；没有彩色强调，主按钮是白底黑字；标题无衬线、字重 600、字距 -0.03em；圆角 10px；插图是深灰层次加一点银白，轻微降低饱和度。',
    descEn: 'Dark minimal: near-black #0E0E10 background, #141416 cards with 1px #24242A borders; light gray-white #EDEDED text and #8A8A90 secondary text; no colored accent, the primary button is white with black text; sans-serif headings at weight 600 with -0.03em tracking; 10px radius; illustrations are layered dark grays with a little silver, slightly desaturated.',
    v: { bg: '#0E0E10', bg2: '#141416', card: '#141416', text: '#EDEDED', dim: '#8A8A90', line: '#24242A', accent: '#EDEDED', 'on-accent': '#0E0E10', a1: '#26262B', a2: '#3A3A42', a3: '#C9C9CF',
      radius: '10px', 'radius-sm': '8px', 'head-weight': '600', 'head-track': '-.03em', 'title-size': '64px', scheme: 'dark' },
    extra: `.ph { filter: saturate(.7); }
.kicker { color: var(--dim); }`,
  },
  {
    id: 'aurora', zh: '极光渐变', en: 'Aurora', term: 'Aurora Gradient 极光渐变', pages: ['home', 'links', 'weekly'], mods: ['center'],
    use: '深色夜空里缓缓流动的紫绿极光，梦幻又有科技感，适合独立开发者和 AI 方向的个人页。', vague: ['{页}要有科技感又好看', '想要会动的渐变背景'],
    desc: '极光渐变：深夜蓝底 #0A0F1F，背后三团紫 #7C4DFF、薄荷绿 #7CF5C8、深蓝 #2B3A8C 的大径向渐变，用 18 秒的慢动画缓缓漂移；卡片是 6% 透明白 + 12px 磨砂；大标题用白→薄荷→淡紫的横向渐变填充；主色薄荷绿 #7CF5C8 配深色字；圆角 18px；首屏居中。',
    descEn: 'Aurora gradient: midnight blue #0A0F1F background with three large radial gradients in violet #7C4DFF, mint #7CF5C8 and deep blue #2B3A8C drifting slowly on an 18-second animation; cards are 6% white with a 12px frosted blur; the headline is filled with a white → mint → pale violet horizontal gradient; mint #7CF5C8 primary with dark text; 18px radius; centered hero.',
    v: { bg: '#0A0F1F', bg2: 'transparent', card: 'rgba(255,255,255,.06)', 'top-bg': 'rgba(10,15,31,.5)', text: '#EAF2FF', dim: '#94A3C2', line: 'rgba(255,255,255,.12)', tag: 'rgba(255,255,255,.08)', accent: '#7CF5C8', 'on-accent': '#0A0F1F', a1: '#2B3A8C', a2: '#7C4DFF', a3: '#7CF5C8',
      radius: '18px', 'radius-sm': '12px', 'radius-btn': '999px', 'head-weight': '700', 'head-track': '-.02em', scheme: 'dark' },
    extra: `.site { position: relative; isolation: isolate; }
.site::before { content: ""; position: absolute; inset: -20%; z-index: -1; pointer-events: none; background: radial-gradient(35% 30% at 25% 20%, rgba(124,77,255,.55), transparent 70%), radial-gradient(30% 28% at 75% 25%, rgba(124,245,200,.32), transparent 70%), radial-gradient(40% 35% at 55% 80%, rgba(43,58,140,.7), transparent 70%); animation: au-drift 18s ease-in-out infinite alternate; }
@keyframes au-drift { to { transform: translate(6%, 4%) rotate(8deg); } }
.site { background: #0A0F1F; }
.title, .ln-name { background: linear-gradient(90deg, #FFFFFF, #7CF5C8 55%, #C3B1FF); -webkit-background-clip: text; background-clip: text; color: transparent; }
.card, .lk, .wk-form, .top { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.chips button[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: var(--bg); }`,
  },
  {
    id: 'bento', zh: '便当格', en: 'Bento Grid', term: 'Bento Grid 便当格布局', pages: ['home', 'resume', 'portfolio'],
    use: '把内容装进一格格大圆角卡片，整齐又有节奏，适合信息多又想显得清爽的个人站。', vague: ['{页}要整齐、模块化', '想要那种一格一格的'],
    desc: '便当格：浅灰底 #F2F2F4，每块内容都是一个白色大圆角卡片（24px），卡片之间 16px 间距，没有描边、只有极淡的阴影；首屏本身也是一张大卡片；文字近黑 #1D1D1F、次要文字 #6E6E73；主色系统蓝 #0A84FF；插图配色暖橙 #FFB547、靛蓝 #6E7BFF、青绿 #34C7A4；标题无衬线、字重 700、字距 -0.02em。',
    descEn: 'Bento grid: light gray #F2F2F4 background, every block of content is a white card with a large 24px radius and 16px gaps, no borders and only a faint shadow; the hero itself is one big card; near-black #1D1D1F text and #6E6E73 secondary text; system blue #0A84FF primary; illustrations in warm orange #FFB547, indigo #6E7BFF and teal #34C7A4; sans-serif headings at weight 700 with -0.02em tracking.',
    v: { bg: '#F2F2F4', bg2: '#E9E9EC', card: '#FFFFFF', 'top-bg': 'rgba(242,242,244,.85)', text: '#1D1D1F', dim: '#6E6E73', line: 'transparent', tag: '#F2F2F4', accent: '#0A84FF', a1: '#FFB547', a2: '#6E7BFF', a3: '#34C7A4',
      radius: '24px', 'radius-sm': '14px', 'radius-btn': '999px', shadow: '0 1px 2px rgba(0,0,0,.04)', 'head-weight': '700', 'head-track': '-.02em' },
    extra: `.top { border-bottom: 1px solid rgba(0,0,0,.06); }
.pg-home .hm-hero, .pg-portfolio .pf-hero { margin: 24px 0 16px; padding: 48px; border-radius: 24px; background: #fff; }
.hm-sec { padding: 28px; margin-bottom: 16px; border-radius: 24px; background: #fff; }
.hm-now .card { background: #F5F5F7; box-shadow: none; }
.hm-list, .hm-list a { border-color: #EDEDF0; }
.work { padding: 10px 10px 16px; border-radius: 24px; background: #fff; }
.work-info, .work p { padding: 0 8px; }
.pf-clients { border-color: #E3E3E7; }
.rs-main > * { margin-left: 0; }
.rs-main { padding: 36px; border-radius: 24px; background: #fff; }`,
  },
  {
    id: 'forest', zh: '森系自然', en: 'Forest', term: 'Organic 自然风', pages: ['blog', 'garden', 'photo'], mods: ['navside'],
    use: '苔绿、米白和一点蜂蜜黄，安静、有生长感，适合园艺、徒步和数字花园。', vague: ['{页}要自然、安静', '想要森林的感觉'],
    desc: '森系自然：苔米白底 #EEF1E8，卡片 #F8F9F3；正文深苔绿 #26321F，次要文字 #6B7762；主色苔绿 #4E7A3A，点缀蜂蜜黄 #D9A55B；标题用宋体类衬线、字重 600；字标是一片叶子形状（对角圆角 60% 0）；导航放在左侧竖栏；圆角 16px，插图是嫩绿 #A9BE8B 和浅草色。',
    descEn: 'Forest style: moss off-white #EEF1E8 background and #F8F9F3 cards; deep moss #26321F text and #6B7762 secondary text; moss green #4E7A3A primary with honey #D9A55B highlights; headings in a Song-style serif at weight 600; the monogram is a leaf shape (opposite corners rounded 60% 0); navigation in a left column; 16px radius, illustrations in fresh green #A9BE8B and pale grass.',
    v: { bg: '#EEF1E8', bg2: '#E6EBDD', card: '#F8F9F3', 'top-bg': '#E6EBDD', text: '#26321F', dim: '#6B7762', line: '#D3DBC6', accent: '#4E7A3A', a1: '#A9BE8B', a2: '#DCE5C9', a3: '#D9A55B',
      radius: '16px', 'radius-sm': '10px', head: 'serif', 'head-weight': '600' },
    extra: `.mark { border-radius: 60% 0; }
.avatar { border-radius: 60% 0; background: linear-gradient(135deg, #A9BE8B, #4E7A3A); }
.kicker { color: #A0702E; }`,
  },
  {
    id: 'retro-os', zh: '复古桌面', en: 'Retro Desktop', term: 'Retro OS 复古系统界面', pages: ['home', 'links', 'garden'],
    use: '像上世纪的电脑桌面：银灰窗口、立体按钮和深蓝标题栏，怀旧又好玩。', vague: ['{页}像老电脑界面', '想要复古操作系统的感觉'],
    desc: '复古桌面风：银灰底 #C3C3C3，顶栏是深蓝到蓝的横向渐变标题栏（#0A246A → #3A6EA5）配白字；卡片和按钮用四层 1px 内阴影做出立体斜边（左上白 #FFFFFF、右下深灰 #404040），按下时斜边反转像被按进去；全站直角、字号 13px，无衬线小字；输入框是凹陷的白色；插图配色深蓝、浅天蓝 #A6CAF0 和金黄 #FFCC00。',
    descEn: 'Retro desktop OS style: silver #C3C3C3 background; the top bar is a navy-to-blue horizontal gradient title bar (#0A246A → #3A6EA5) with white text; cards and buttons get a beveled edge from four 1px inset shadows (white #FFFFFF top-left, dark gray #404040 bottom-right) that invert when pressed; square corners, 13px small sans text; inputs are sunken white fields; illustrations in navy, light sky #A6CAF0 and gold #FFCC00.',
    v: { bg: '#C3C3C3', bg2: '#2F7F7F', card: '#D4D0C8', 'top-bg': 'linear-gradient(90deg, #0A246A, #3A6EA5)', text: '#000000', dim: '#3F3F3F', line: '#808080', tag: '#E4E1DA', accent: '#0A246A', a1: '#0A246A', a2: '#A6CAF0', a3: '#FFCC00',
      radius: '0', 'radius-sm': '0', 'radius-btn': '0', shadow: 'inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #404040, inset 2px 2px 0 #DFDFDF, inset -2px -2px 0 #808080', font: 'grotesk', size: '13px', 'head-weight': '700', 'title-size': '52px' },
    extra: `.top { color: #fff; border-bottom: 0; }
.nav a { color: rgba(255,255,255,.8); }
.nav a:hover, .nav a.on { color: #fff; background: rgba(255,255,255,.15); }
.mark { border-radius: 0; background: #FFCC00; color: #000; }
.card, .btn, .lk, .ln-social a, .chips button { border: 0; box-shadow: inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #404040, inset 2px 2px 0 #DFDFDF, inset -2px -2px 0 #808080; background: #D4D0C8; border-radius: 0; color: #000; }
.btn:active, .lk:active, .chips button[aria-pressed="true"] { box-shadow: inset 1px 1px 0 #404040, inset -1px -1px 0 #FFFFFF, inset 2px 2px 0 #808080, inset -2px -2px 0 #DFDFDF; transform: none; background: #C8C4BC; }
.btn:hover, .lk:hover { transform: none; }
.btn.pri { background: #D4D0C8; color: #000; outline: 1px solid #000; outline-offset: -4px; }
.top .btn.pri { outline: 0; }
input { border: 0; border-radius: 0; background: #fff; box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #FFFFFF, inset 2px 2px 0 #404040; }
.avatar, .ln-av { border-radius: 0; }
.kicker { color: #0A246A; }
.ln-bg { background: #2F7F7F; }
.gd-tree { background: #D4D0C8; }
.ln { margin: 32px 0; padding: 0 0 28px; background: #D4D0C8; box-shadow: inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #404040, inset 2px 2px 0 #DFDFDF, inset -2px -2px 0 #808080; }
.ln::before { content: "苏遥.lnk"; align-self: stretch; margin: 3px 3px 28px; padding: 4px 8px; background: linear-gradient(90deg, #0A246A, #3A6EA5); color: #fff; font-weight: 700; text-align: left; }
.ln-list, .ln-tags, .ln-social { padding: 0 18px; }`,
  },
  {
    id: 'zine', zh: '拼贴手作', en: 'Zine Collage', term: 'Collage 拼贴风', pages: ['blog', 'photo', 'links'],
    use: '像一本手工小志：歪着贴的照片、胶带和剪下来的标题条，有温度、有个性。', vague: ['{页}要有手作感', '想要剪贴本那种感觉'],
    desc: '拼贴手作风：米色纸底 #F4EFE4；照片和卡片带 6px 白边像拍立得，并且轻微歪斜（-1.5° ～ 1.5° 交替）；卡片顶部贴着一条半透明黄色胶带（rgba(242,204,143,.75)，旋转 -4°）；栏目小字做成黑底黄字的剪贴条、歪 2°；标题用 Arial Black 类超粗字；强调色番茄橙 #E4572E；插图配色海军蓝 #3D5A80、沙黄 #F2CC8F、番茄橙。',
    descEn: 'Zine collage style: beige paper #F4EFE4 background; photos and cards have a 6px white polaroid border and a slight tilt (alternating -1.5° to 1.5°); a translucent yellow tape strip (rgba(242,204,143,.75), rotated -4°) sits on top of cards; small labels are cut-out strips, black with yellow text, tilted 2°; headings in an Arial Black-style ultra-bold face; tomato orange #E4572E accent; illustrations in navy #3D5A80, sand #F2CC8F and tomato.',
    v: { bg: '#F4EFE4', bg2: '#EDE5D4', card: '#FFFDF7', text: '#2B2B2B', dim: '#6E6658', line: '#DDD3C0', accent: '#E4572E', a1: '#3D5A80', a2: '#F2CC8F', a3: '#E4572E',
      radius: '2px', 'radius-sm': '2px', shadow: '0 3px 10px rgba(0,0,0,.12)', head: 'black', 'head-weight': '900' },
    extra: `.kicker { display: inline-block; padding: 3px 10px; background: #2B2B2B; color: #F2CC8F; rotate: -2deg; }
.card, .lk { position: relative; }
.card::before, .lk::before { content: ""; position: absolute; left: 50%; top: -9px; width: 70px; height: 18px; background: rgba(242,204,143,.75); translate: -50% 0; rotate: -4deg; }
.lk:nth-child(even), .bl-side .card:nth-child(even) { rotate: .8deg; }
.lk:nth-child(odd), .bl-side .card:nth-child(odd) { rotate: -.6deg; }
.shot .ph, .post-ph { box-shadow: 0 0 0 6px #fff, 0 4px 14px rgba(0,0,0,.18); }
.shot:nth-child(3n+1) .ph { rotate: -1.5deg; }
.shot:nth-child(3n+2) .ph { rotate: 1.2deg; }
.shot { padding: 6px; }
.title { text-shadow: 3px 3px 0 #F2CC8F; }`,
  },
  {
    id: 'notebook', zh: '手账格纸', en: 'Grid Notebook', term: 'Notebook 手账风', pages: ['garden', 'blog', 'links'],
    use: '方格本上的手写笔记：淡蓝网格、荧光笔和虚线框，适合学生、学习笔记和手账爱好者。', vague: ['{页}像笔记本一样', '想要手账风'],
    desc: '手账格纸风：米白底 #FBFAF5 上画 24px 的淡蓝方格线 #E3ECF4，像方格笔记本；卡片白底、1.5px 浅蓝灰虚线框；栏目小字下面一条波浪下划线；文字墨蓝 #2E3A48；强调色珊瑚红 #F26B5B，链接和标签像荧光笔涂过（底部 40% 的奶黄 #FBE3A8 色块）；标题用圆体；圆角 10px。',
    descEn: 'Grid notebook style: off-white #FBFAF5 background ruled with a 24px pale blue #E3ECF4 grid like graph paper; white cards with a 1.5px light blue-gray dashed border; small labels have a wavy underline; ink-blue #2E3A48 text; coral #F26B5B accent, links and tags look highlighted with a marker (a butter-yellow #FBE3A8 band on the lower 40%); headings in a rounded face; 10px radius.',
    v: { bg: '#FBFAF5', bg2: 'rgba(255,255,255,.6)', card: '#FFFFFF', text: '#2E3A48', dim: '#7A8594', line: '#C9D6E3', accent: '#F26B5B', a1: '#8FC1E3', a2: '#FBE3A8', a3: '#F26B5B',
      radius: '10px', 'radius-sm': '8px', head: 'round', 'head-weight': '800' },
    extra: `.site { background: linear-gradient(#E3ECF4 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, #E3ECF4 1px, transparent 1px) 0 0 / 24px 24px, #FBFAF5; }
.card, .lk { border: 1.5px dashed #B9C7D6; }
.kicker { text-decoration: underline wavy #F26B5B; text-underline-offset: 6px; }
.tag, .wl { background: linear-gradient(transparent 58%, #FBE3A8 58%); border-radius: 0; color: var(--text); }
.wl { text-decoration: none; }
.ln-bg { background: none; }`,
  },
  {
    id: 'contrast', zh: '高对比无障碍', en: 'High Contrast', term: 'Accessibility 无障碍设计', pages: ['post', 'resume', 'weekly'],
    use: '黑白高对比、大字号、粗焦点框，所有人都能看清，适合重视无障碍或读者年龄跨度大的站。', vague: ['{页}要看得清楚', '老人也能看清'],
    desc: '高对比无障碍：纯白底 #FFFFFF、纯黑字 #000000，正文 17px；链接一律带下划线、颜色深蓝 #0040DD（对比度高于 7:1）；分隔线和边框 2px 纯黑；键盘聚焦时出现 3px 琥珀色 #FFB000 外框；标签是黑底白字；不靠颜色单独传达信息；圆角 4px。',
    descEn: 'High-contrast accessible style: pure white #FFFFFF background, pure black #000000 text at 17px; all links are underlined in dark blue #0040DD (contrast above 7:1); dividers and borders are 2px solid black; keyboard focus shows a thick 3px amber #FFB000 outline; tags are white on black; color is never the only signal; 4px radius.',
    v: { bg: '#FFFFFF', bg2: '#F2F2F2', text: '#000000', dim: '#2B2B2B', line: '#000000', tag: '#000000', accent: '#0040DD', a1: '#0040DD', a2: '#FFB000', a3: '#000000',
      radius: '4px', 'radius-sm': '4px', bw: '2px', size: '17px', 'head-weight': '800', 'title-size': '56px' },
    extra: `a:focus-visible, button:focus-visible, input:focus, summary:focus-visible { outline: 3px solid #FFB000; outline-offset: 2px; box-shadow: none; }
.nav a, .ps-toc nav a, .ps-art a:not(.tag), .wk-list b { text-decoration: underline; text-underline-offset: 3px; }
.tag { color: #fff; }
.btn { border-width: 2px; border-color: #000; }`,
  },
  {
    id: 'sunset', zh: '落日暖橘', en: 'Sunset Glow', term: 'Warm Gradient 暖色渐变', pages: ['home', 'weekly', 'photo'],
    use: '从桃橘到奶白的暖色渐变，像傍晚的光，热情又亲切，适合旅行、生活和摄影博主。', vague: ['{页}要温暖、有活力', '想要日落的颜色'],
    desc: '落日暖橘：页面顶部是桃橘 #FFE3CC 渐变到奶白 #FFF4EA 的背景；大标题用橙红 #F2542D 到杏黄 #F5A65B 的横向渐变填充、衬线字、字重 700；正文深棕红 #3A1F14；主按钮橙红；白卡片圆角 18px、带暖色投影（0 10px 30px rgba(242,84,45,.12)）；插图配色杏黄、蜜桃 #FBD38D、橙红。',
    descEn: 'Sunset glow: the page background fades from peach #FFE3CC at the top to cream #FFF4EA; the headline is filled with a horizontal gradient from orange-red #F2542D to apricot #F5A65B, in a serif at weight 700; deep red-brown #3A1F14 body text; orange-red primary button; white cards with 18px radius and a warm shadow (0 10px 30px rgba(242,84,45,.12)); illustrations in apricot, peach #FBD38D and orange-red.',
    v: { bg: '#FFF4EA', card: '#FFFFFF', 'top-bg': 'transparent', text: '#3A1F14', dim: '#8A6656', line: '#F3D9C6', tag: '#FFE6D4', accent: '#F2542D', a1: '#F5A65B', a2: '#FBD38D', a3: '#F2542D',
      radius: '18px', 'radius-sm': '12px', 'radius-btn': '999px', shadow: '0 10px 30px rgba(242,84,45,.12)', head: 'serif', 'head-weight': '700' },
    extra: `.site { background: linear-gradient(180deg, #FFE0C7 0, #FFF4EA 560px); }
.title { background: linear-gradient(90deg, #F2542D, #F5A65B); -webkit-background-clip: text; background-clip: text; color: transparent; }
.tag { color: #B8401F; }
.chips button[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }`,
  },
  {
    id: 'gallery', zh: '美术馆白盒', en: 'White Cube', term: 'White Space 留白', pages: ['photo', 'portfolio', 'home'],
    use: '像走进美术馆的白色展厅：小字、细线、超大留白，让作品像展品一样被看，适合艺术家。', vague: ['{页}要像展览一样', '字要小、留白要多'],
    desc: '美术馆白盒：纯白底 #FFFFFF，所有文字都很小（正文 14px），标题也只用 34px、字重 400、字距 0.02em，靠留白而不是字号建立层级；首屏上下留白 120px；小字栏目名浅灰 #8C8C8C、字距 0.2em；直角，按钮是 1px 黑框透明底；分隔线 1px #EDEDED；作品像挂在墙上的展品，四周留足空白。',
    descEn: 'White cube gallery: plain white #FFFFFF background, all text is small (14px body), even headings are only 34px at weight 400 with 0.02em tracking, hierarchy comes from white space rather than size; 120px of space above and below the hero; small labels in light gray #8C8C8C tracked at 0.2em; square corners, buttons are 1px black outlines on transparent; 1px #EDEDED dividers; works sit like exhibits on a wall with plenty of space around them.',
    v: { bg: '#FFFFFF', bg2: '#F7F7F7', text: '#111111', dim: '#8C8C8C', line: '#EDEDED', accent: '#111111', a1: '#CFC8BC', a2: '#EDEAE4', a3: '#6E7F80',
      radius: '0', 'radius-sm': '0', size: '14px', 'head-weight': '400', 'head-track': '.02em', 'title-size': '34px', max: '980px' },
    extra: `.hero { padding: 120px 0 80px; }
.kicker { color: var(--dim); font-weight: 400; letter-spacing: .2em; }
.btn { background: none; border-color: #111; font-weight: 400; }
.btn.pri { background: #111; }
.lead { font-size: 15px; }
.h2, .work h3, .hm-now b { font-weight: 400; }
.pf-hero .title, .hm-hero .title { font-size: 44px; }
.chips button { border: 0; border-radius: 0; padding: 0 2px; margin-right: 14px; }
.chips button[aria-pressed="true"] { background: none; color: var(--text); box-shadow: inset 0 -1px 0 var(--text); }
.ph-grid, .pf-grid { gap: 48px; column-gap: 48px; }
.shot { margin-bottom: 48px; }`,
  },
  {
    id: 'morandi', zh: '莫兰迪', en: 'Morandi', term: 'Muted Palette 低饱和配色', pages: ['blog', 'resume', 'photo'], mods: ['navside'],
    use: '灰调的豆沙、灰绿和雾紫，克制温柔、不抢眼，适合生活方式、穿搭和读书博主。', vague: ['{页}颜色要高级一点、不要艳', '想要灰灰的温柔色'],
    desc: '莫兰迪色：灰米底 #E9E4DE，卡片 #F2EEE9；所有颜色都加了灰：灰绿 #A3B0A1、灰砂 #CDBFB2、雾紫 #9C8AA5，强调色豆沙 #9A7B6F；正文灰褐 #4A4540；标题用宋体类衬线、字重 500；导航放在左侧竖栏；圆角 14px，没有阴影。',
    descEn: 'Morandi palette: greige #E9E4DE background and #F2EEE9 cards; every color is grayed: sage gray #A3B0A1, sand gray #CDBFB2, misty purple #9C8AA5, with dusty rose-brown #9A7B6F as the accent; gray-brown #4A4540 body text; headings in a Song-style serif at weight 500; navigation in a left column; 14px radius and no shadows.',
    v: { bg: '#E9E4DE', bg2: '#E2DCD4', card: '#F2EEE9', 'top-bg': '#E2DCD4', text: '#4A4540', dim: '#8B837A', line: '#D6CEC4', tag: '#DED6CC', accent: '#9A7B6F', a1: '#A3B0A1', a2: '#CDBFB2', a3: '#9C8AA5',
      radius: '14px', 'radius-sm': '10px', head: 'serif', 'head-weight': '500' },
  },
  {
    id: 'cyber', zh: '赛博机甲', en: 'Cyber Mech', term: 'Cyberpunk 赛博朋克', pages: ['portfolio', 'home', 'garden'],
    use: '黑底、警示黄、切角面板和错位故障字，像机甲的操作面板，适合游戏、3D 和硬核玩家。', vague: ['{页}要赛博朋克', '想要机甲、未来战士的感觉'],
    desc: '赛博机甲风：纯黑底 #0A0A0F，面板 #12121A，所有卡片和按钮都切掉右上和左下两个角（clip-path 斜切 14px）；主色警示黄 #FCEE0A 配黑字，辅色电光青 #00F0FF 和品红 #FF2A6D；大标题大写、字重 800，带青和品红左右错开 2px 的故障重影；小字用等宽字、方括号包住；直角，1px #2A2A3A 描边。',
    descEn: 'Cyber mech style: pure black #0A0A0F background and #12121A panels; every card and button has its top-right and bottom-left corners cut off (14px clip-path bevel); warning yellow #FCEE0A primary with black text, electric cyan #00F0FF and magenta #FF2A6D as secondary; uppercase headlines at weight 800 with a glitch double image offset 2px left and right in cyan and magenta; small text in monospace wrapped in square brackets; square corners and 1px #2A2A3A borders.',
    v: { bg: '#0A0A0F', bg2: '#0E0E15', card: '#12121A', text: '#E6F7FF', dim: '#7E8AA3', line: '#2A2A3A', tag: 'rgba(0,240,255,.1)', accent: '#FCEE0A', 'on-accent': '#0A0A0F', a1: '#00F0FF', a2: '#FF2A6D', a3: '#FCEE0A',
      radius: '0', 'radius-sm': '0', font: 'grotesk', head: 'grotesk', meta: 'mono', 'head-weight': '800', 'head-case': 'uppercase', 'av-text': '#0A0A0F', scheme: 'dark' },
    extra: `.card, .btn, .work .ph, .hm-art { clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px)); }
.title { text-shadow: -2px 0 #FF2A6D, 2px 0 #00F0FF; }
.kicker::before { content: "[ "; } .kicker::after { content: " ]"; }
.kicker { color: #00F0FF; }
.tag { border-radius: 0; color: #00F0FF; }
.chips button { border-radius: 0; }
.chips button[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: var(--bg); }
.mark, .avatar { border-radius: 0; }`,
  },
  {
    id: 'film', zh: '胶片暖调', en: 'Film Grain', term: 'Film Grain 胶片颗粒', pages: ['photo', 'post', 'home'],
    use: '暗房一样的深棕底、琥珀色和满屏细细的颗粒，像在看冲洗出来的底片，适合摄影和写回忆的文字。', vague: ['{页}要有胶片感', '想要复古、有颗粒的照片风'],
    desc: '胶片暖调：暗房深棕底 #1C1814，整页叠一层很淡的胶片颗粒噪点（SVG feTurbulence，叠加模式）；正文暖米白 #EFE3CF，次要文字 #A89A84；强调色琥珀 #E8A15A；照片带 6px 近黑边框像底片；标题用宋体类衬线、字重 500，小字用等宽字、略加字距；插图配色焦糖 #6B4B33、琥珀、奶油黄 #F2C27B；圆角 4px。',
    descEn: 'Film grain: darkroom brown #1C1814 background with a very faint film-grain noise layer over the whole page (SVG feTurbulence, overlay blend); warm cream #EFE3CF text and #A89A84 secondary text; amber #E8A15A accent; photos have a 6px near-black frame like negatives; headings in a Song-style serif at weight 500, small text in monospace with slight tracking; illustrations in caramel #6B4B33, amber and butter #F2C27B; 4px radius.',
    v: { bg: '#1C1814', bg2: '#17130F', card: '#241F1A', text: '#EFE3CF', dim: '#A89A84', line: '#3A3128', tag: 'rgba(239,227,207,.08)', accent: '#E8A15A', 'on-accent': '#1C1814', a1: '#6B4B33', a2: '#B9865A', a3: '#F2C27B',
      radius: '4px', 'radius-sm': '3px', head: 'serif', meta: 'mono', 'head-weight': '500', scheme: 'dark' },
    extra: `.site { position: relative; }
.site::after { content: ""; position: absolute; inset: 0; z-index: 5; pointer-events: none; opacity: .3; mix-blend-mode: overlay; background: ${NOISE}; }
.shot .ph, .ps-art .ph, .hm-art { box-shadow: 0 0 0 6px #0E0C0A; }
.meta, .kicker { letter-spacing: .06em; }`,
  },
  {
    id: 'poster', zh: '复古海报', en: 'Retro Poster', term: 'Retro Poster 复古海报', pages: ['portfolio', 'weekly', 'links'],
    use: '像一张老式丝网印刷海报：粗大标题、错版阴影和有限的几种油墨色，醒目又有年代感。', vague: ['{页}像老海报一样', '标题要大、要醒目'],
    desc: '复古海报：做旧米色纸底 #F0E6D2；只用三种油墨色：藏青 #1E2A3A、孔雀绿 #1E6F72、朱橙 #E2552C，外加芥末黄 #F2B544；大标题用 Arial Black 类超粗字、78px、朱橙色，带向右下 4px 的藏青错版阴影；按钮和插图 2px 藏青描边、直角；栏目小字孔雀绿。',
    descEn: 'Retro screen-print poster: aged beige paper #F0E6D2; only three ink colors, navy #1E2A3A, peacock teal #1E6F72 and vermilion #E2552C, plus mustard #F2B544; the headline is an Arial Black-style ultra-bold face at 78px in vermilion with a 4px navy misregistration shadow to the lower right; buttons and images have 2px navy borders and square corners; small labels in peacock teal.',
    v: { bg: '#F0E6D2', bg2: '#E8DCC2', card: '#F6EEDD', text: '#1E2A3A', dim: '#5A5F66', line: '#1E2A3A', accent: '#E2552C', a1: '#1E6F72', a2: '#F2B544', a3: '#E2552C',
      radius: '0', 'radius-sm': '0', bw: '2px', head: 'black', 'head-weight': '900', 'head-track': '-.01em', 'title-size': '78px' },
    extra: `.title, .ln-name { color: #E2552C; text-shadow: 4px 4px 0 #1E2A3A; }
.kicker { color: #1E6F72; }
.btn { border: 2px solid #1E2A3A; }
.ph { border: 2px solid #1E2A3A; }
.tag, .chips button { border-radius: 0; }
.mark, .avatar { border-radius: 0; background: #1E6F72; color: #F0E6D2; }`,
  },
  {
    id: 'airy', zh: '日系清新', en: 'Airy Light', term: 'Airy 轻盈风', pages: ['blog', 'photo', 'links'], mods: ['center'],
    use: '淡蓝、浅粉和大量留白，细字、宽字距、行距松，像夏天午后的光，适合摄影和生活日记。', vague: ['{页}要清新、轻一点', '想要日系小清新'],
    desc: '日系清新：极浅的蓝白底 #F7FAFC，正文雾蓝灰 #3B4752、字号 14px、行高 2；标题字重 300（细体）、字距 0.12em、40px 左右，不用粗字；首屏居中；强调色天空蓝 #5B9BD5；插图配色浅蓝 #BFD9EE、雾白 #E9F1F7、樱粉 #F4C6C6；圆角 4px，分隔线 1px #E3EAF0。',
    descEn: 'Airy light style: a very pale blue-white #F7FAFC background, misty blue-gray #3B4752 text at 14px with line height 2; headings at weight 300 (light), 0.12em tracking, around 40px, never bold; centered hero; sky blue #5B9BD5 accent; illustrations in pale blue #BFD9EE, mist #E9F1F7 and sakura #F4C6C6; 4px radius and 1px #E3EAF0 dividers.',
    v: { bg: '#F7FAFC', bg2: '#EEF4F9', card: '#FFFFFF', text: '#3B4752', dim: '#8796A3', line: '#E3EAF0', accent: '#5B9BD5', a1: '#BFD9EE', a2: '#E9F1F7', a3: '#F4C6C6',
      radius: '4px', 'radius-sm': '4px', size: '14px', leading: '2', 'head-weight': '300', 'head-track': '.12em', 'title-size': '42px', max: '960px', 'av-text': '#3B4752' },
    extra: `.kicker { color: var(--dim); font-weight: 400; letter-spacing: .3em; }
.btn { font-weight: 400; }
.post h3, .lk span, .ln-name { font-weight: 400; }
.center .ph-tabs { justify-content: center; }`,
  },
  {
    id: 'pro', zh: '简约商务', en: 'Professional', term: 'Corporate Clean 商务简约', pages: ['resume', 'portfolio', 'home'],
    use: '白底、深海军蓝和一点琥珀色，干净可信，适合求职、咨询顾问和自由职业者接单。', vague: ['{页}要专业、可信', '找工作用的个人网站'],
    desc: '简约商务：白底 #FFFFFF，侧块用浅灰蓝 #F5F7FA；正文深海军蓝 #0F1B2D，次要文字 #5B6B80；主色商务蓝 #1D4ED8，点缀琥珀 #F59E0B；标题无衬线、字重 700、字距 -0.02em；卡片圆角 10px、1px #E2E8F0 描边、极淡阴影 0 1px 3px rgba(15,27,45,.06)；信息排得整齐，按钮文案写清动作。',
    descEn: 'Professional clean style: white #FFFFFF with light blue-gray #F5F7FA side blocks; deep navy #0F1B2D text and #5B6B80 secondary text; business blue #1D4ED8 primary with amber #F59E0B highlights; sans-serif headings at weight 700 with -0.02em tracking; cards with 10px radius, 1px #E2E8F0 borders and a faint shadow 0 1px 3px rgba(15,27,45,.06); tidy information layout and action-focused button labels.',
    v: { bg: '#FFFFFF', bg2: '#F5F7FA', card: '#FFFFFF', text: '#0F1B2D', dim: '#5B6B80', line: '#E2E8F0', tag: '#EEF2F7', accent: '#1D4ED8', a1: '#1D4ED8', a2: '#93C5FD', a3: '#F59E0B',
      radius: '10px', 'radius-sm': '8px', shadow: '0 1px 3px rgba(15,27,45,.06)', 'head-weight': '700', 'head-track': '-.02em', 'title-size': '56px' },
    extra: `.rs-side { background: #F5F7FA; }
.kicker { color: #B45309; }`,
  },
  {
    id: 'seventies', zh: '七十年代', en: '70s Retro', term: '70s Retro 七十年代复古', pages: ['blog', 'weekly', 'post'],
    use: '芥末黄、焦橙和橄榄绿的条纹，圆润的粗衬线字，像一张老唱片封套，温暖又怀旧。', vague: ['{页}要复古又温暖', '想要七十年代那种感觉'],
    desc: '七十年代复古：奶油黄底 #F6E7C8，正文深咖 #3B2416；顶栏下面是芥末黄 #E8A33D、焦橙 #D9622B、橄榄绿 #8A9A3B 三道 4px 横条纹；标题用粗衬线字、字重 800、68px；卡片圆角 20px，按钮全部胶囊形；主色焦橙；插图就用这三种颜色。',
    descEn: '70s retro: butter-cream #F6E7C8 background and dark coffee #3B2416 text; three 4px horizontal stripes in mustard #E8A33D, burnt orange #D9622B and olive #8A9A3B under the top bar; headings in a heavy serif at weight 800, 68px; cards with 20px radius and pill-shaped buttons; burnt orange as the primary color; illustrations use the same three colors.',
    v: { bg: '#F6E7C8', bg2: '#F1DDB5', card: '#FBF1DC', text: '#3B2416', dim: '#7D5E45', line: '#E2CDA5', tag: '#EFD9AE', accent: '#D9622B', a1: '#E8A33D', a2: '#8A9A3B', a3: '#D9622B',
      radius: '20px', 'radius-sm': '14px', 'radius-btn': '999px', head: 'serif', 'head-weight': '800', 'title-size': '68px' },
    extra: `.top { border-bottom: 0; box-shadow: 0 4px 0 #E8A33D, 0 8px 0 #D9622B, 0 12px 0 #8A9A3B; margin-bottom: 12px; }
.kicker { color: #8A9A3B; }
.tag { color: #8A4A1F; }
.chips button[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }`,
  },
];
