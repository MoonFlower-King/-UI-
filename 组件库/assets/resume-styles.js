// 「简历模板」的 10 种风格。每种 = 版式（layout）+ 一段只改 .cv 变量和细节的 CSS + 拼进提示词的描述。
// 加一种风格：在下面加一项就行（resume.html 的风格切换、词典「简历模板」栏目的案例都会自动多出一个）。
// - layout：single 单栏，板块按简历里写的顺序；side-left / side-right 双栏，技术栈、语言这类短清单自动进侧栏
// - contactSide：双栏时把联系方式也放进侧栏
// - group：在词典栏目里归到哪一组（one 单栏 / two 双栏与卡片）
// - desc / descEn 原样拼进提示词：写具体数值（色值、字号、圆角、字体），不写「高级」「大气」这种空话
// 规则：只用系统字体；不点名在世设计师、品牌和具体网站；颜色保证打印出来正文能读清。
(function (g) {
  const { SERIF, MONO } = g.JY_RESUME.FONTS;
  g.JY_RESUME_STYLES = [
    {
      id: 'minimal', zh: '极简单栏', en: 'Minimal', term: 'Minimal 极简风', layout: 'single', group: 'one',
      use: '白纸黑字、只有一种蓝色点缀，最不会出错的一版，投大厂、外企都合适。', vague: ['简历要简洁干净', '不要花里胡哨'],
      desc: '极简单栏：纯白纸面，正文 #18181B、次要文字 #52525B，唯一强调色 #2563EB 只用在列表圆点、图标和项目链接上；名字 32px 粗体，板块标题 11.5px 全大写、字距 0.14em、后面拖一条 1px #E4E4E7 细线；联系方式在右上角排成两列；不用阴影和色块，靠留白分组。',
      descEn: 'Minimal single column: pure white paper, body text #18181B and secondary text #52525B; the only accent #2563EB appears on bullet markers, icons and project links; a 32px bold name, 11.5px uppercase section labels with 0.14em tracking followed by a 1px #E4E4E7 hairline; contact details in two columns at the top right; no shadows or color blocks, white space does the grouping.',
      css: `:root { --ink: #18181B; --dim: #52525B; --line: #E4E4E7; --accent: #2563EB; --name-size: 32px; }
.cv-head { border-bottom: 0; padding-bottom: 0; margin-bottom: 7mm; }
.cv-contact { grid-template-columns: repeat(2, auto); gap: 1mm 18px; }
.sec-title { display: flex; align-items: center; gap: 10px; color: var(--ink); font-size: 11.5px; letter-spacing: .14em; }
.sec-title::after { content: ""; flex: 1; height: 1px; background: var(--line); }`,
    },
    {
      id: 'sidebar', zh: '双栏侧边', en: 'Two-column Sidebar', term: 'Sidebar Layout 侧栏布局', layout: 'side-left', contactSide: true, group: 'two',
      use: '左边一条深色侧栏放联系方式和技术栈，右边写经历，一眼就能扫到你会什么。', vague: ['简历想分左右两栏', '技能要一眼看到'],
      desc: '双栏侧边：左侧 70mm 深藏青侧栏 #1E293B 从纸的顶部铺到底，里面放联系方式和按类别分组的技术栈，文字 #E2E8F0、技术栈是半透明白底的小方块标签；右侧白底写名字和经历，强调色天蓝 #0284C7 用在板块标题和链接上；名字 30px 粗体；板块标题 12px 全大写；没有外框。',
      descEn: 'Two-column sidebar: a 70mm deep navy #1E293B sidebar on the left runs from the top of the page to the bottom, holding contact details and the grouped tech stack in #E2E8F0 text, stack items as small translucent-white tags; the white right column holds the name and experience, with sky blue #0284C7 on section labels and links; a 30px bold name; 12px uppercase section labels; no outer border.',
      css: `:root { --accent: #0284C7; --side-w: 70mm; --pad: 0; --page-bg: linear-gradient(90deg, #1E293B 70mm, #FFFFFF 70mm); }
.cv { display: grid; grid-template-columns: var(--side-w) minmax(0, 1fr); grid-template-rows: auto 1fr; }
.cv-head { grid-column: 2; grid-row: 1; margin: 0; padding: 14mm 14mm 6mm; border: 0; }
.cv-body.two { display: contents; }
.cv-side { grid-column: 1; grid-row: 1 / 3; padding: 14mm 8mm; background: #1E293B; color: #E2E8F0; --chip: rgba(255,255,255,.12); --accent: #7DD3FC; --dim: #CBD5E1; }
.cv-side .sec-title { color: #7DD3FC; }
.cv-main { grid-column: 2; grid-row: 2; padding: 0 14mm 14mm; }
.cv-side .cv-contact { color: #E2E8F0; }
.cv-side .pts li::marker { color: #7DD3FC; }
@media screen and (max-width: 760px) {
  .cv { display: block; }
  .cv-head { padding: 22px 20px 12px; }
  .cv-side { padding: 20px; }
  .cv-main { padding: 20px; }
}`,
    },
    {
      id: 'timeline', zh: '时间轴', en: 'Timeline', term: 'Timeline 时间线', layout: 'single', group: 'one',
      use: '时间挂在左边、一条竖线串起每段经历，跳槽路线和成长节奏一目了然。', vague: ['经历想按时间线排', '想让人看出成长路线'],
      desc: '时间轴：白纸，强调色青绿 #0D9488；所有板块内容左侧留出 30mm，经历的起止时间右对齐挂在这条留白里（等宽字 11px），时间右边一条 2px #CCE7E4 竖线贯穿整段，每段经历在线上有一个 9px 青绿空心圆点；板块标题青绿色 13px 粗体；名字 30px，下方一条 3px 青绿短横线。',
      descEn: 'Timeline: white paper with teal #0D9488 as the accent; every section is indented 30mm, and each entry\'s dates hang right-aligned in that gutter (11px monospace); a 2px #CCE7E4 vertical line runs beside the dates, with a 9px hollow teal dot on the line for each entry; section labels are 13px bold teal; a 30px name with a short 3px teal bar beneath it.',
      css: `:root { --accent: #0D9488; --line: #CCE7E4; --gut: 30mm; }
.cv-head { border: 0; padding-bottom: 0; }
.cv-id::after { content: ""; display: block; width: 36px; height: 3px; margin-top: 4mm; background: var(--accent); border-radius: 2px; }
.sec { padding-left: var(--gut); }
.sec-title { font-size: 13px; letter-spacing: .06em; }
.sec:has(.en) { position: relative; }
.sec .en { position: relative; padding-left: 6mm; margin-top: 0; padding-bottom: 3mm; border-left: 2px solid var(--line); }
.sec .en::before { content: ""; position: absolute; left: -6.5px; top: 5px; width: 11px; height: 11px; border-radius: 50%; background: var(--paper); border: 2px solid var(--accent); }
.sec .en-date { position: absolute; left: calc(-1 * var(--gut)); top: 2px; width: calc(var(--gut) - 4mm); margin: 0; text-align: right; font-size: 11px; white-space: normal; }
@media screen and (max-width: 760px) {
  .cv { --gut: 0px; }
  .sec .en-date { position: static; width: auto; text-align: left; margin-left: auto; }
}`,
    },
    {
      id: 'dark', zh: '暗色', en: 'Dark Mode', term: 'Dark Mode 深色模式', layout: 'side-right', group: 'two',
      use: '深色纸面、紫色高光，像在 IDE 里读简历；适合发电子版 PDF，不建议打印成纸。', vague: ['简历想要深色的', '要有程序员的感觉'],
      desc: '暗色：整张纸是近黑的蓝灰 #0F141B，正文 #E6EDF3，次要文字 #8B98A5，分隔线 #263040；强调色淡紫 #A78BFA 用在板块标题、圆点和链接；右侧 60mm 侧栏是圆角 10px、底色 #161D27 的面板，放技术栈和语言，技术栈是紫色 15% 透明底的小标签；名字 30px 白色粗体；打印时保留深色背景（print-color-adjust: exact）。',
      descEn: 'Dark: the whole page is a near-black blue-gray #0F141B with #E6EDF3 body text, #8B98A5 secondary text and #263040 dividers; soft violet #A78BFA marks section labels, bullets and links; a 60mm right sidebar is a 10px-rounded #161D27 panel holding skills and languages, skills as small tags on a 15% violet tint; a 30px bold white name; dark backgrounds are kept when printing (print-color-adjust: exact).',
      css: `:root { --paper: #0F141B; --ink: #E6EDF3; --dim: #8B98A5; --line: #263040; --accent: #A78BFA; --chip: rgba(167,139,250,.15); color-scheme: dark; }
.cv-name { color: #FFFFFF; }
.cv-side { align-self: start; padding: 6mm 5mm; border-radius: 10px; background: #161D27; }
.cv b { color: #FFFFFF; }
.en-title { color: #FFFFFF; }`,
    },
    {
      id: 'terminal', zh: '终端', en: 'Terminal', term: 'Terminal UI 终端风', layout: 'single', group: 'one',
      use: '整份简历像一个终端窗口：等宽字、绿色提示符、cat 出每个板块，极客味最浓的一版。', vague: ['简历想做成命令行那样', '要极客一点'],
      desc: '终端风：纸面是终端黑 #0C100E，左上角三颗 10px 小圆点（#E5534B、#D9A441、#57AB5A）像窗口按钮；全部文字用等宽字体，正文 #D1D7D3、次要 #7D8A82；名字前一行是灰色的「~ $ whoami」，板块标题写成「$ cat 工作经历」的命令样式、提示符绿色 #4ADE80；时间琥珀色 #FBBF24；列表符号是「>」；技术栈写成 [Go] 这种方括号标签。',
      descEn: 'Terminal: terminal-black #0C100E paper with three 10px dots (#E5534B, #D9A441, #57AB5A) at the top left like window buttons; everything is monospace, body text #D1D7D3 and secondary #7D8A82; a gray "~ $ whoami" line above the name, section labels styled as commands like "$ cat experience" with a green #4ADE80 prompt; dates in amber #FBBF24; ">" as the bullet; the stack written as bracketed tags like [Go].',
      css: `:root { --paper: #0C100E; --ink: #D1D7D3; --dim: #7D8A82; --line: #1F2A24; --accent: #4ADE80; --chip: transparent; --font: ${MONO}; --size: 12.5px; --name-size: 28px; --pad: 18mm 16mm 15mm; color-scheme: dark; }
.cv::before { content: ""; position: absolute; top: 7mm; left: 16mm; width: 10px; height: 10px; border-radius: 50%; background: #E5534B; box-shadow: 16px 0 #D9A441, 32px 0 #57AB5A; }
.cv-name { color: #FFFFFF; }
.cv-name::before { content: "~ $ whoami"; display: block; margin-bottom: 2mm; color: var(--dim); font-size: 12px; font-weight: 400; }
.cv-head { border-bottom: 1px dashed var(--line); }
.sec-title { color: var(--ink); font-size: 13px; letter-spacing: 0; text-transform: none; }
.sec-title::before { content: "$ cat "; color: var(--accent); }
.en-title { color: #FFFFFF; }
.en-date { color: #FBBF24; }
.en-link { color: #67E8F9; }
.pts { list-style: none; padding-left: 1.4em; }
.pts li::before { content: ">"; float: left; margin-left: -1.4em; color: var(--accent); }
.stack li, .cv-side .kv dd span { padding: 0; color: #67E8F9; }
.stack li::before { content: "["; color: var(--dim); }
.stack li::after { content: "]"; color: var(--dim); }
.kv dd span + span::before { color: var(--dim); content: " / "; }
.cv b { color: #FFFFFF; }`,
    },
    {
      id: 'classic', zh: '经典衬线', en: 'Classic Serif', term: 'Serif Typography 衬线排版', layout: 'single', group: 'one',
      use: '居中抬头、衬线字、双线分隔，像一份正式的履历；投研究岗、外企或资深岗位显得稳重。', vague: ['简历要正式稳重', '想要传统一点的排版'],
      desc: '经典衬线：象牙白纸 #FFFEFA，全文衬线字体（英文 Georgia 类、中文宋体类），正文 #222222；名字 34px 居中、字距 0.06em，下面联系方式居中排成一行、用「·」隔开、不带图标，再下面一条上粗下细的双线；板块标题酒红 #8B2E2E、小号全大写、字距 0.2em，标题下一条 1px 细线；时间用斜体。',
      descEn: 'Classic serif: ivory #FFFEFA paper set entirely in a serif (a Georgia-style face for Latin, a Song-style face for Chinese), body text #222222; a centered 34px name with 0.06em tracking, contact details centered on one line separated by middle dots with no icons, then a thick-over-thin double rule; section labels in burgundy #8B2E2E, small uppercase with 0.2em tracking over a 1px rule; dates in italics.',
      css: `:root { --paper: #FFFEFA; --ink: #222222; --dim: #555049; --line: #D9D2C5; --accent: #8B2E2E; --chip: #F3EEE4; --font: ${SERIF}; --size: 13.5px; --name-size: 34px; --head-weight: 600; }
.cv-head { display: block; text-align: center; padding-bottom: 4mm; border-bottom: 3px double var(--ink); }
.cv-name { letter-spacing: .06em; }
.cv-tag { font-style: italic; }
.cv-contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 0; margin-top: 3mm; }
.cv-contact .ct + .ct::before { content: "·"; margin: 0 10px; color: var(--line); }
.cv-contact svg { display: none; }
.sec-title { padding-bottom: 1mm; border-bottom: 1px solid var(--line); letter-spacing: .2em; font-size: 12px; font-weight: 600; }
.en-date { font: italic 12.5px/1.45 var(--font); }
.en-link, .en-star { font-family: var(--font); font-style: italic; }
.stack li { font-family: var(--font); font-size: 11.5px; }`,
    },
    {
      id: 'compact', zh: '紧凑一页', en: 'Compact One-page', term: 'Information Density 信息密度', layout: 'side-right', group: 'two',
      use: '字号小一号、边距收窄、右侧窄栏放技能，经历多的资深工程师也能压进一页 A4。', vague: ['经历太多一页放不下', '简历要信息量大'],
      desc: '紧凑一页：正文 12px、行高 1.5，纸面边距 11mm × 12mm；名字 26px，联系方式在名字右侧排成三列网格；板块标题是靛蓝 #4F46E5 底、白字的 11px 小色块标签；右侧 54mm 窄栏放技术栈和语言，和主栏之间一条 1px #E5E7EB 竖线；经历之间间距 2.4mm；时间等宽字右对齐。',
      descEn: 'Compact one-page: 12px body text at 1.5 line height and 11mm × 12mm page margins; a 26px name with contact details in a three-column grid to its right; section labels are small 11px white-on-indigo #4F46E5 tags; a narrow 54mm right column holds skills and languages, separated from the main column by a 1px #E5E7EB rule; 2.4mm between entries; right-aligned monospace dates.',
      css: `:root { --accent: #4F46E5; --line: #E5E7EB; --size: 12px; --name-size: 26px; --side-w: 54mm; --pad: 11mm 12mm; }
.cv { line-height: 1.5; }
.cv-head { align-items: center; margin-bottom: 4mm; padding-bottom: 3.5mm; }
.cv-contact { grid-template-columns: repeat(3, auto); gap: .6mm 14px; font-size: 11.5px; }
.sec { margin-top: 4mm; }
.sec-title { display: inline-block; margin-bottom: 1.6mm; padding: 1px 7px; border-radius: 3px; background: var(--accent); color: #FFFFFF; font-size: 11px; letter-spacing: .08em; }
.en { margin-top: 2.4mm; }
.en-title { font-size: 13px; }
.pts { margin-top: .6mm; }
.pts li { margin: .2mm 0; }
.cv-body.two { gap: 6mm; }
.cv-side { padding-left: 6mm; border-left: 1px solid var(--line); }
@media screen and (max-width: 760px) { .cv-contact { grid-template-columns: 1fr; } .cv-side { padding-left: 0; border: 0; } }`,
    },
    {
      id: 'markdown', zh: '文档风', en: 'Markdown README', term: 'Markdown 文档排版', layout: 'single', group: 'one',
      use: '把简历排成一份开源项目的 README：标题前露出 # 号、链接是蓝色、技术名是代码块，程序员一看就亲切。', vague: ['简历想像 README 文档', '要有代码味但别太花'],
      desc: 'Markdown 文档风：白纸，正文 #1F2328、次要 #59636E，无衬线正文配等宽代码；名字前露出灰色的「# 」、板块标题前露出「## 」、经历标题前露出「### 」（等宽字 #8C959F），名字和板块标题下面各有一条 1px #D1D9E0 横线；一句话定位做成左侧 3px 灰竖线的引用块；技术栈是浅灰 #EFF2F5 底、圆角 6px 的行内代码；链接蓝色 #2F6FEB。',
      descEn: 'Markdown README: white paper, body text #1F2328 and secondary #59636E, sans-serif text with monospace code; a gray "# " shows before the name, "## " before section titles and "### " before entry titles (monospace #8C959F), with a 1px #D1D9E0 rule under the name and each section title; the tagline is a blockquote with a 3px gray left bar; stack items are inline code on light gray #EFF2F5 with 6px radius; links in blue #2F6FEB.',
      css: `:root { --ink: #1F2328; --dim: #59636E; --line: #D1D9E0; --accent: #2F6FEB; --chip: #EFF2F5; --name-size: 30px; }
.cv-name::before, .sec-title::before, .en-title::before { color: #8C959F; font-family: var(--mono); font-weight: 400; }
.cv-name::before { content: "# "; }
.sec-title::before { content: "## "; }
.en-title::before { content: "### "; font-size: 12px; }
.cv-head { display: block; padding-bottom: 3mm; }
.cv-tag { margin-top: 3mm; padding-left: 4mm; border-left: 3px solid var(--line); }
.cv-contact { display: flex; flex-wrap: wrap; gap: 1mm 16px; margin-top: 3mm; }
.ct svg { color: var(--dim); }
.sec-title { padding-bottom: 1.2mm; margin-bottom: 2.4mm; border-bottom: 1px solid var(--line); color: var(--ink); font-size: 17px; letter-spacing: 0; text-transform: none; }
.stack li, .cv code { border-radius: 6px; color: var(--ink); }
.pts li::marker { color: var(--dim); }
.kv dt { font-family: var(--mono); font-size: 12px; font-weight: 600; }
.kv dd span { padding: 0 6px; border-radius: 6px; background: var(--chip); font: 11.5px/1.7 var(--mono); color: var(--ink); }
.kv dd span + span::before { content: none; }
.kv dd { display: flex; flex-wrap: wrap; gap: 4px; }`,
    },
    {
      id: 'bento', zh: '卡片网格', en: 'Bento Cards', term: 'Bento Grid 便当盒布局', layout: 'side-right', group: 'two',
      use: '每个板块装进一张圆角卡片，大小错落地拼在浅灰底上，适合想显得新鲜、有设计感的前端和全栈。', vague: ['简历想做成卡片那样', '想要现代一点、有设计感'],
      desc: '卡片网格：纸面浅灰 #F1F1F4，每个板块是一张白色圆角 14px 卡片、内边距 3.5mm × 4.5mm、带极淡的 1px #E4E4E8 边框；顶部名片卡用玫红 #E11D48 到珊瑚 #FB7185 的 135° 渐变底、白字；主栏卡片竖排、右侧 62mm 一列小卡片放技术栈和语言；板块标题玫红 11.5px 全大写；技术栈是玫红 10% 透明底的胶囊标签。',
      descEn: 'Bento cards: light gray #F1F1F4 paper where every section is a white card with 14px radius, 3.5mm × 4.5mm padding and a faint 1px #E4E4E8 border; the header card uses a 135° rose #E11D48 to coral #FB7185 gradient with white text; main cards stack in the left column and a 62mm column of small cards on the right holds skills and languages; 11.5px uppercase rose section labels; stack items are pills on a 10% rose tint.',
      css: `:root { --paper: #F1F1F4; --accent: #E11D48; --line: #E4E4E8; --side-w: 62mm; --pad: 10mm; }
.cv-head { margin-bottom: 3mm; padding: 5mm 7mm; border: 0; border-radius: 14px; background: linear-gradient(135deg, #E11D48, #FB7185); color: #FFFFFF; }
.cv-head .cv-tag, .cv-head .cv-contact { color: rgba(255,255,255,.9); }
.cv-head .ct svg { color: #FFFFFF; }
.cv-body.two { gap: 3mm; }
.sec { margin-top: 3mm; padding: 3.5mm 4.5mm; border: 1px solid var(--line); border-radius: 14px; background: #FFFFFF; break-inside: avoid; }
.sec-title { font-size: 11.5px; }
.stack li, .cv-side .kv dd span { border-radius: 99px; padding: 0 8px; }`,
    },
    {
      id: 'jiangyue', zh: '江上明月', en: 'Moonlit River', term: 'Brand Style 品牌风格', layout: 'single', group: 'one',
      use: '江月 UI 自家的风格：抬头是一片夜色江面挂一轮暖金月亮，正文是月白纸和宋体标题，安静又有记忆点。', vague: ['简历想要有中国味又不俗', '想要一点意境'],
      desc: '江上明月：抬头是一整条夜色江面渐变（#121722 到 #1D2433），右上角一轮暖金 #FFD58A 圆月带一圈淡淡光晕，名字 32px 宋体类衬线、月白 #EDE9E2；正文纸面月白 #FBF8F2、墨色正文 #1D1B18；板块标题是 16px 宋体，前面一枚江月橘 #FA8C16 的 6px 小圆点；列表圆点和项目链接用江月橘，技术栈是暖杏色 #FDF0DD 底的小标签。',
      descEn: 'Moonlit River: the header is a full-width night-river gradient (#121722 to #1D2433) with a warm gold #FFD58A full moon and a faint halo at the top right, and a 32px Song-style serif name in moonlight white #EDE9E2; the body is warm white #FBF8F2 paper with ink #1D1B18 text; section titles are 16px serif led by a 6px dot in Jiangyue orange #FA8C16; bullets and project links use the same orange, and stack items are small tags on apricot #FDF0DD.',
      css: `:root { --paper: #FBF8F2; --ink: #1D1B18; --dim: #716A60; --line: #E7E1D6; --accent: #FA8C16; --chip: #FDF0DD; --font-head: ${SERIF}; --name-size: 32px; --head-weight: 600; }
.cv-head { margin: -13mm -15mm 6mm; padding: 13mm 15mm 8mm; border: 0; color: #EDE9E2;
  background: radial-gradient(circle at calc(100% - 24mm) 16mm, #FFD58A 0 6.5mm, rgba(255,213,138,.28) 6.8mm, rgba(255,213,138,0) 17mm), linear-gradient(170deg, #121722, #1D2433); }
.cv-head .cv-tag { color: #BAB4A9; }
.cv-head .cv-contact { color: #BAB4A9; }
.cv-head .ct svg { color: #FFD58A; }
.cv-contact { grid-template-columns: repeat(3, auto); gap: 1mm 16px; margin-right: 34mm; }
.sec-title { display: flex; align-items: center; gap: 8px; color: var(--ink); font-size: 16px; font-weight: 600; letter-spacing: .08em; }
.sec-title::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
.en-link { color: #A84C07; }
@media screen and (max-width: 760px) { .cv-head { margin: -22px -20px 20px; padding: 22px 20px; } .cv-contact { grid-template-columns: 1fr; margin-right: 0; } }`,
    },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
