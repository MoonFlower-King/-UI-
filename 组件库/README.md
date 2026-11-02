# 江月组件库

> 会说专业词，AI 才做得好看。

「给AI描述UI的6个词」系列的配套组件库。图鉴网站教你**认识**术语，组件库让你**拿来就用**：

- **实时预览**：每个组件都是能点、能交互的真组件，可以切换桌面 / 平板 / 手机宽度
- **看代码、一键复制**：纯 HTML + CSS + 少量原生 JS，零依赖，贴到任何项目都能跑
- **说不清怎么办**：把“不高级”“太乱”“点了没反应”这类模糊说法，换成 AI 听得懂的专业词
- **UI 术语词典**：10 个主题、100 多个专业词，每个词一句大白话 + 一句能直接复制给 AI 的说法
- **给 AI 的提示词**：每个组件附一段带具体参数的提示词，复制给 Cursor、Trae、Claude 等工具就能用

## 本地预览

双击 `index.html` 即可。

## 加一个新组件

1. 在 `components/` 下新建 `<英文名>.html`（例如 `bottom-sheet.html`）
2. 文件开头写一段元信息，后面直接写组件代码：

```html
<!--
{
  "en": "Bottom Sheet", "zh": "底部抽屉", "group": "弹窗与浮层", "episode": "EP04",
  "lead": "一句大白话解释它是什么、什么时候用。",
  "vague": ["用户常说的模糊说法"],
  "terms": ["Bottom Sheet", "应该用的其他专业词"],
  "prompt": "可以直接复制给 AI 的提示词，带上尺寸、颜色、时长、缓动。"
}
-->
<div class="sheet">…</div>

<style>…</style>

<script>…</script>
```

3. 在仓库根目录运行 `npm run build:ui`，重新生成 `data/components.js`

“说不清怎么办”速查表在 `data/vague-words.json`，术语词典在 `data/glossary.json`（每个词是 `[英文, 中文, 解释, 示例说法, 可选的组件 id]`），改完同样运行一次 `npm run build:ui`。脚本会检查元信息是否齐全、链接的组件是否存在。

## 目录

```
组件库/
  index.html              文档站
  assets/                 文档站的样式和脚本
  components/*.html       每个组件一个文件（元信息 + 代码）
  data/vague-words.json   “说不清怎么办”速查表
  data/glossary.json      UI 术语词典
  data/components.js      由 scripts/build.mjs 生成，不要手改
  scripts/build.mjs       收录脚本
```

## 版权

组件代码和全部文字说明都是本项目原创，以 [MIT 许可证](LICENSE) 开源，可以免费商用。

收录规则：

- 不复制其他组件库的源码。术语和设计模式（Toast、Drawer、Glassmorphism 等）是行业通用概念，可以自由讲解和实现，但代码要自己写
- 如果确实要引用第三方代码，只收 MIT / Apache-2.0 / ISC 这类宽松许可证，在组件元信息里写明出处和许可证，并保留原作者版权声明。React Bits 等“看起来像 MIT”的库要先读原文许可证
- 不使用有版权的图片、字体和品牌 Logo。示例文案、商品名都用虚构内容

## 发布

合并到 `main` 后，GitHub Actions 会自动把图鉴网站发布到 Pages 根目录，组件库发布到 `/ui/`。

## 规模变大以后

现在所有组件打包进一个 `data/components.js`（13 个组件约 55KB），打开就能用，不需要服务器。等组件超过一两百个、这个文件超过 1MB 时，可以改成每个组件单独生成一个文件、按需加载，文档站外壳不用动。
