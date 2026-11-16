// 「简历模板」栏目的案例生成器：10 种风格（assets/resume-styles.js）× 一份示例简历（assets/resume-sample.js）。
// 解析和渲染用的是 assets/resume-core.js —— 和在线填写页 resume.html 是同一份代码，所以栏目里看到的和自己填出来的一模一样。
// 那三个文件是浏览器里的普通脚本，这里用 node:vm 跑一遍拿到结果，不用复制一份 Node 版。
// 每个案例的代码自包含：中英文两份简历 + 切换按钮 + 打印按钮 + 全部样式，复制走存成 .html 就能用。
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContext, runInContext } from 'node:vm';

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), '../assets');
const ctx = createContext({});
for (const f of ['resume-core.js', 'resume-styles.js', 'resume-sample.js']) runInContext(readFileSync(join(ASSETS, f), 'utf8'), ctx, { filename: f });
const { JY_RESUME: R, JY_RESUME_STYLES: STYLES, JY_RESUME_SAMPLE: SAMPLE } = ctx;

// 两组：单栏 / 双栏与卡片（categories.json 里对应 resume-one、resume-two）
const GROUP = { one: 'resume-one', two: 'resume-two' };
const LAYOUT = {
  single: ['单栏，板块从上到下依次排列', 'single column, sections stacked top to bottom'],
  'side-left': ['双栏：左侧窄栏放联系方式、技术栈和语言，右侧宽栏放简介、经历、项目、开源和教育', 'two columns: a narrow left column for contact details, skills and languages, a wide right column for summary, experience, projects, open source and education'],
  'side-right': ['双栏：左侧宽栏放简介、经历、项目、开源和教育，右侧窄栏放技术栈和语言', 'two columns: a wide left column for summary, experience, projects, open source and education, a narrow right column for skills and languages'],
};
const PROMPT = [
  '程序员简历网页，按 A4 纸大小排版（宽 210mm）：顶部是名字、一句话定位和联系方式（邮箱、电话、城市、GitHub、博客，各带小图标）；内容依次是个人简介、按类别分行的技术栈（语言 / 后端 / 基础设施 / 工具）、工作经历（每段写公司、职位、起止时间，3～4 条带具体数字的成果，末尾一排技术栈小标签）、项目经历（项目名、仓库链接、星标数、一句话介绍和要点）、开源贡献、教育经历和语言。页面上方有「中文 / English」切换和「打印 / 存为 PDF」按钮。',
  'A developer resume web page laid out at A4 size (210mm wide): at the top the name, a one-line positioning statement and contact details (email, phone, city, GitHub, blog, each with a small icon); then a summary, the tech stack grouped by category (languages / backend / infrastructure / tools), work experience (company, role and dates per entry, 3–4 achievements with concrete numbers, and a row of stack tags at the end), projects (name, repository link, star count, a one-line description and highlights), open-source contributions, education and languages. Above the page sit a "中文 / English" switch and a "Print / Save as PDF" button.',
];
const PRINT = [
  '做好打印样式：@page 设为 A4、无页边距，打印时隐藏按钮、去掉阴影、保留背景色（print-color-adjust: exact），每段经历不被分页截断（break-inside: avoid），跨页时用 box-decoration-break: clone 让每页都有同样的内边距；屏幕比纸窄时（手机）变成单栏。',
  'Write a proper print stylesheet: @page A4 with no margins, hide the buttons and drop the shadow when printing, keep background colors (print-color-adjust: exact), never split an entry across pages (break-inside: avoid), and use box-decoration-break: clone so every page keeps the same padding; on screens narrower than the paper (phones) everything stacks into one column.',
];

const BAR_CSS = `.cv-bar { display: flex; justify-content: center; gap: 10px; margin: 0 auto 18px; font: 13px/1 -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
.cv-bar button { height: 34px; padding: 0 14px; border: 1px solid #C9C9CF; border-radius: 99px; background: #FFFFFF; color: #3F3F46; font: inherit; cursor: pointer; }
.cv-bar button:hover { border-color: #8E8E96; }
.cv-bar button[aria-pressed="true"] { border-color: #18181B; background: #18181B; color: #FFFFFF; }
.cv-bar .seg { display: flex; gap: 4px; }`;
// 切换中英文：两份简历都在页面里，只是藏起另一份
const SWITCH = `document.querySelector('.cv-bar').addEventListener('click', (e) => {
  const b = e.target.closest('[data-lang]'); if (!b) return;
  document.querySelectorAll('[data-lang]').forEach((x) => x.setAttribute('aria-pressed', x === b));
  document.querySelectorAll('.cv').forEach((cv) => { cv.hidden = cv.dataset.lang !== b.dataset.lang; });
});`;

function code(s) {
  const zh = R.render(R.parse(SAMPLE.zh), s, 'zh').replace('<article ', '<article data-lang="zh" ');
  const en = R.render(R.parse(SAMPLE.en), s, 'en').replace('<article ', '<article data-lang="en" hidden ');
  return `<div class="cv-desk">
  <div class="cv-bar no-print">
    <div class="seg"><button type="button" data-lang="zh" aria-pressed="true">中文</button><button type="button" data-lang="en" aria-pressed="false">English</button></div>
    <button type="button" onclick="print()">打印 / 存为 PDF</button>
  </div>
  ${zh}
  ${en}
</div>

<style>
${R.BASE_CSS}
[hidden] { display: none !important; }
${BAR_CSS}

/* 「${s.zh}」风格 */
${s.css}
</style>

<script>
${SWITCH}
</script>
`;
}

export const sharedChunks = () => [R.BASE_CSS, BAR_CSS, SWITCH];
export function resumeCases() {
  return STYLES.map((s) => {
    if (!GROUP[s.group]) throw new Error(`assets/resume-styles.js：「${s.zh}」的 group 只能是 ${Object.keys(GROUP).join(' / ')}`);
    if (!LAYOUT[s.layout]) throw new Error(`assets/resume-styles.js：「${s.zh}」的 layout 只能是 ${Object.keys(LAYOUT).join(' / ')}`);
    return {
      id: `resume-${s.id}`, cat: GROUP[s.group],
      en: `Developer Resume · ${s.en}`, zh: `程序员简历 · ${s.zh}`,
      lead: `为程序员准备的 A4 简历：技术栈分类写、经历用数字说成果、单列项目和开源贡献，带中英文两版，能直接打印成 PDF。这一版是「${s.zh}」：${s.use}想换成自己的内容，去「在线填写简历」页面边写边看。`,
      vague: s.vague, terms: ['Resume 简历', 'Print Stylesheet 打印样式', s.term],
      prompt: `${PROMPT[0]}\n版式：${LAYOUT[s.layout][0]}。\n${PRINT[0]}\n风格：${s.desc}`,
      promptEn: `${PROMPT[1]}\nLayout: ${LAYOUT[s.layout][1]}.\n${PRINT[1]}\nStyle: ${s.descEn}`,
      canvas: 900, editor: `resume.html#${s.id}`,
      code: code(s),
    };
  });
}
