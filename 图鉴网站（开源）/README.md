# 给 AI 描述 UI 的词典 · UI Prompt Glossary

> 给 AI 描述 UI，说对一个词就够了。

一个开源的「界面与动效术语图鉴」：每个术语都配一段**实时动画**，看一眼就懂；再附一段**可直接复制给 AI 的提示词**，粘贴到 Cursor、Trae、豆包、Claude 等 AI 编程工具就能用。

内容来自短视频系列「给AI描述UI的6个词」（江月AI设计），每期 6 个词，持续更新。

![预览](assets/preview.png)

## 特点

- **按主题分类**：滚动动画、悬停微交互、点击反馈、排版布局、弹窗浮层、加载反馈、视觉风格……
- **实时动画**：全部是纯 HTML + CSS 写的动画，没有图片、视频或第三方库
- **一键复制提示词**：每个词都附一段带具体参数（时长、缓动、位移、触发条件）的提示词
- **搜索**：中文、英文、大白话解释都能搜，按 `/` 快速聚焦搜索框
- **零依赖**：纯静态页面，双击 `index.html` 就能打开，也可以直接部署到 GitHub Pages

## 已收录

| 期 | 主题 | 词条 |
|---|---|---|
| 1 | 网页滚动动画 | Scroll-triggered · Scroll-linked · Parallax · Sticky · Scroll Snap · Horizontal Scroll |
| 2 | 鼠标悬停微交互 | Magnetic Button · Spotlight Border · 3D Tilt · Morphing · Underline Slide · Image Zoom |
| 3 | 按钮点击反馈 | Ripple Effect · Toggle Switch · Particle Burst · Hold to Confirm · Loading Button · Hamburger Toggle |
| 4 | 现代网页排版布局 | Bento Grid · Masonry · Split Screen · Holy Grail · Asymmetrical Grid · Z-Pattern |
| 5 | 弹窗与浮层组件 | Drawer · Bottom Sheet · Popover · Command Palette · Toast · Backdrop Modal |
| 6 | 加载与状态反馈 | Skeleton Screen · Shimmer Effect · Progressive Blur · Optimistic UI · Stepper Progress · Pull to Refresh |
| 7 | UI 视觉质感风格 | Glassmorphism · Neumorphism · Neo-Brutalism · Aurora Background · Bento Dark Mode · Layered Elevation |
| 8 | 动画缓动与节奏 | Ease-in-out · Spring · Stagger · Anticipation · Squash & Stretch · Motion Path |

## 本地预览

直接双击 `index.html` 即可。也可以起一个本地服务器：

```bash
npx serve .
```

## 部署到 GitHub Pages

仓库根目录的 `.github/workflows/pages.yml` 会在合并到 `main` 后自动构建并发布（在 **Settings → Pages → Source** 里选 **GitHub Actions**）。本地预览：在仓库根目录运行 `npm run build`，然后双击 `index.html`。

## 目录结构

```
index.html              网站首页
assets/                 样式、脚本、预览图
episodes.json           每期的编号、主题、类型、关键词
scripts/build.mjs       读取仓库根目录各期「EPxx 主题/」的动画网页和发布文案，生成下面三项
data/terms.js           （生成，不入库）词条数据
demos/                  （生成，不入库）单个词条动画页，首页用 iframe 嵌入
episodes/EPxx/          （生成，不入库）整期动画页
```

## 新增一期

1. 在仓库根目录新建 `EPxx 主题/` 文件夹，放入：
   - `主题 动画网页.html`：6 宫格动画页，每个宫格是一个 `<div class="cell">`，里面的 `.term-en` / `.term-zh` 是英文与中文术语名
   - `主题 发布文案.md`：正文里每个词一行，格式为 `1️⃣ English Term，大白话解释，比如具体场景`；提示词写成 `**1. English Term（中文）**` 换行后接 `> 提示词内容`
2. 在 `episodes.json` 里追加该期的 `id`、`series_no`、`theme`、`title`、`type`、`keywords`
3. 确认 6 个词在 `../组件库/components/` 里都有组件，然后在仓库根目录运行 `npm run build`（需要 Node.js 18+）

欢迎通过 Issue 或 Pull Request 补充新的术语、修正描述或提示词。

## 许可

[MIT](LICENSE) © 江月AI设计
