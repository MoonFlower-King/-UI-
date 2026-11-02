// 由 scripts/build.mjs 生成，不要手改。改组件请改 components/ 下的文件后重新运行。
window.UI_KIT = {
 "components": [
  {
   "id": "spotlight-border",
   "en": "Spotlight Border",
   "zh": "聚光边框",
   "group": "鼠标悬停微交互",
   "episode": "EP02",
   "lead": "鼠标在卡片上移动时，边框跟着鼠标位置亮起一圈光晕，像手电筒扫过。很多 AI 产品官网都在用。",
   "vague": [
    "不够高级",
    "卡片太平了"
   ],
   "terms": [
    "Spotlight Border",
    "Cursor-follow 跟随光标",
    "Radial Gradient 径向渐变"
   ],
   "prompt": "给功能卡片加 Spotlight Border：用 CSS 变量记录鼠标在卡片内的坐标，边框是以鼠标为圆心、半径 160px 的橙色径向渐变（#FA8C16 → 透明），鼠标离开时 300ms 淡出；卡片本身深色背景。",
   "code": "<div class=\"spot-scene\">\n  <div class=\"spot\"><h3>实时协作</h3><p>多人同时编辑，光标位置实时同步。</p></div>\n</div>\n\n<style>\n.spot-scene { position: fixed; inset: 0; display: grid; place-items: center; background: #0F0F11; }\n.spot { --x: 50%; --y: 50%; --glow: 0; position: relative; width: min(300px, 88vw); padding: 24px; border-radius: 16px;\n  background: #18181B; color: #FAFAFA; }\n.spot::before { content: \"\"; position: absolute; inset: 0; padding: 1.5px; border-radius: inherit; pointer-events: none;\n  background: #2E2E33; -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);\n  -webkit-mask-composite: xor; mask-composite: exclude; }\n.spot::after { content: \"\"; position: absolute; inset: 0; padding: 1.5px; border-radius: inherit; pointer-events: none;\n  background: radial-gradient(160px circle at var(--x) var(--y), #FA8C16, transparent 70%); opacity: var(--glow); transition: opacity .3s;\n  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }\n.spot h3 { margin: 0 0 6px; font-size: 18px; }\n.spot p { margin: 0; color: #A1A1AA; font-size: 14px; }\n</style>\n\n<script>\ndocument.querySelectorAll(\".spot\").forEach(card => {\n  card.addEventListener(\"pointermove\", e => {\n    const r = card.getBoundingClientRect();\n    card.style.setProperty(\"--x\", e.clientX - r.left + \"px\");\n    card.style.setProperty(\"--y\", e.clientY - r.top + \"px\");\n    card.style.setProperty(\"--glow\", 1);\n  });\n  card.addEventListener(\"pointerleave\", () => card.style.setProperty(\"--glow\", 0));\n});\n<\/script>\n"
  },
  {
   "id": "underline-slide",
   "en": "Underline Slide",
   "zh": "下划线滑入",
   "group": "鼠标悬停微交互",
   "episode": "EP02",
   "lead": "鼠标移到链接上时，一条下划线从左往右“画”出来，移开时再收回去。比直接出现下划线精致很多。",
   "vague": [
    "导航太素了",
    "链接没有感觉"
   ],
   "terms": [
    "Underline Slide",
    "Hover State 悬停态",
    "Transform Origin 变换原点"
   ],
   "prompt": "导航链接加 Underline Slide：悬停时 2px 橙色下划线从左往右展开（scaleX 0→1，250ms ease-out），移开时从左往右收回（transform-origin 切到 right）；文字颜色同时从灰色变成深色。",
   "code": "<nav class=\"links\">\n  <a href=\"#\">产品</a><a href=\"#\">价格</a><a href=\"#\">案例</a><a href=\"#\">博客</a>\n</nav>\n\n<style>\n.links { display: flex; gap: 28px; flex-wrap: wrap; justify-content: center; }\n.links a { position: relative; padding: 4px 0; color: #71717A; text-decoration: none; font-size: 17px; font-weight: 500; transition: color .25s; }\n.links a::after { content: \"\"; position: absolute; left: 0; right: 0; bottom: 0; height: 2px; border-radius: 1px; background: #FA8C16;\n  transform: scaleX(0); transform-origin: right; transition: transform .25s ease-out; }\n.links a:hover, .links a:focus-visible { color: #18181B; outline: none; }\n.links a:hover::after, .links a:focus-visible::after { transform: scaleX(1); transform-origin: left; }\n</style>\n"
  },
  {
   "id": "hold-to-confirm",
   "en": "Hold to Confirm",
   "zh": "长按确认",
   "group": "按钮点击反馈",
   "episode": "EP11",
   "lead": "危险操作不弹窗确认，而是要求按住按钮一会儿，进度条填满才执行。既防误触，又比弹窗少打断一次。",
   "vague": [
    "怕用户手滑删掉",
    "确认弹窗太烦"
   ],
   "terms": [
    "Hold to Confirm",
    "Long Press 长按",
    "Destructive Action 危险操作"
   ],
   "prompt": "删除按钮做成 Hold to Confirm：按住时红色进度从左到右填满按钮（1.2 秒，线性），中途松手进度 200ms 回退到 0；填满后按钮轻微缩放 0.96 再回弹，文字变成「已删除」。",
   "code": "<button class=\"hold-btn\"><span class=\"fill\"></span><span class=\"text\">按住删除</span></button>\n\n<style>\n.hold-btn { position: relative; overflow: hidden; width: 180px; height: 48px; border: 1.5px solid #FF3B30; border-radius: 12px;\n  background: #FFF2F1; color: #D70015; font-size: 15px; font-weight: 600; cursor: pointer; user-select: none; -webkit-user-select: none; touch-action: none; }\n.hold-btn .fill { position: absolute; inset: 0; background: #FF3B30; transform: scaleX(0); transform-origin: left; transition: transform .2s ease-out; }\n.hold-btn.holding .fill { transform: scaleX(1); transition: transform 1.2s linear; }\n.hold-btn .text { position: relative; }\n.hold-btn.holding .text, .hold-btn.done .text { color: #fff; }\n.hold-btn.done .fill { transform: scaleX(1); }\n.hold-btn.done { animation: pop .3s cubic-bezier(.34, 1.56, .64, 1); }\n@keyframes pop { 40% { transform: scale(.96); } }\n</style>\n\n<script>\ndocument.querySelectorAll(\".hold-btn\").forEach(btn => {\n  let timer;\n  const text = btn.querySelector(\".text\");\n  const start = () => {\n    if (btn.classList.contains(\"done\")) return;\n    btn.classList.add(\"holding\");\n    timer = setTimeout(() => {\n      btn.classList.replace(\"holding\", \"done\");\n      text.textContent = \"已删除\";\n      setTimeout(() => { btn.classList.remove(\"done\"); text.textContent = \"按住删除\"; }, 1800);\n    }, 1200);\n  };\n  const cancel = () => { clearTimeout(timer); btn.classList.remove(\"holding\"); };\n  btn.addEventListener(\"pointerdown\", start);\n  [\"pointerup\", \"pointerleave\", \"pointercancel\"].forEach(ev => btn.addEventListener(ev, cancel));\n});\n<\/script>\n"
  },
  {
   "id": "loading-button",
   "en": "Loading Button",
   "zh": "加载按钮",
   "group": "按钮点击反馈",
   "episode": "EP11",
   "lead": "点击提交后，按钮自己变成转圈状态并暂时不能再点，完成后显示对勾。防止用户重复提交，也让等待有交代。",
   "vague": [
    "点了不知道在干嘛",
    "老是被重复提交"
   ],
   "terms": [
    "Loading Button",
    "Spinner 加载圈",
    "Disabled State 禁用态"
   ],
   "prompt": "提交按钮做成 Loading Button：点击后文字淡出，按钮中间出现 18px 白色旋转圆环（800ms 一圈），按钮禁用；请求成功后圆环变成对勾，背景转为绿色 #34C759，1.5 秒后恢复原状。",
   "code": "<button class=\"load-btn\"><span class=\"label\">提交订单</span><span class=\"spin\"></span><span class=\"ok\">✓ 已提交</span></button>\n\n<style>\n.load-btn { position: relative; min-width: 160px; height: 48px; border: 0; border-radius: 12px; background: #18181B;\n  color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; transition: background .3s; }\n.load-btn > span { position: absolute; inset: 0; display: grid; place-items: center; transition: opacity .2s; }\n.load-btn .spin, .load-btn .ok { opacity: 0; }\n.load-btn .spin::before { content: \"\"; width: 18px; height: 18px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, .3);\n  border-top-color: #fff; animation: spin .8s linear infinite; }\n.load-btn.loading { cursor: wait; }\n.load-btn.loading .label, .load-btn.done .label { opacity: 0; }\n.load-btn.loading .spin { opacity: 1; }\n.load-btn.done { background: #34C759; }\n.load-btn.done .ok { opacity: 1; }\n@keyframes spin { to { transform: rotate(360deg); } }\n</style>\n\n<script>\ndocument.querySelectorAll(\".load-btn\").forEach(btn => btn.addEventListener(\"click\", () => {\n  if (btn.disabled) return;\n  btn.disabled = true;\n  btn.classList.add(\"loading\");\n  // 这里换成你的真实请求\n  setTimeout(() => {\n    btn.classList.replace(\"loading\", \"done\");\n    setTimeout(() => { btn.classList.remove(\"done\"); btn.disabled = false; }, 1500);\n  }, 1600);\n}));\n<\/script>\n"
  },
  {
   "id": "ripple-effect",
   "en": "Ripple Effect",
   "zh": "水波纹点击",
   "group": "按钮点击反馈",
   "episode": "EP11",
   "lead": "点击按钮时，从手指落点扩散出一圈半透明的波纹，告诉用户“我收到了”。Material Design 的标志性反馈。",
   "vague": [
    "点了没反应",
    "按钮太死板"
   ],
   "terms": [
    "Ripple Effect",
    "Tap Feedback 点击反馈"
   ],
   "prompt": "给主按钮加 Ripple Effect：点击时以鼠标落点为圆心，生成白色 35% 透明度的圆形波纹，600ms 内从 0 放大到按钮对角线的 2 倍并淡出，缓动 ease-out，按钮 overflow: hidden。",
   "code": "<button class=\"ripple-btn\">立即开始</button>\n\n<style>\n.ripple-btn { position: relative; overflow: hidden; border: 0; padding: 14px 32px;\n  border-radius: 12px; background: #FA8C16; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; }\n.ripple-btn .wave { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, .35);\n  transform: scale(0); animation: ripple .6s ease-out forwards; pointer-events: none; }\n@keyframes ripple { to { transform: scale(1); opacity: 0; } }\n</style>\n\n<script>\ndocument.querySelectorAll(\".ripple-btn\").forEach(btn => btn.addEventListener(\"click\", e => {\n  const r = btn.getBoundingClientRect();\n  const size = Math.hypot(r.width, r.height) * 2;\n  const wave = document.createElement(\"span\");\n  wave.className = \"wave\";\n  wave.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;\n  btn.appendChild(wave);\n  wave.addEventListener(\"animationend\", () => wave.remove());\n}));\n<\/script>\n"
  },
  {
   "id": "toggle-switch",
   "en": "Toggle Switch",
   "zh": "开关切换",
   "group": "按钮点击反馈",
   "episode": "EP11",
   "lead": "像实体开关一样的二选一控件，圆形滑块左右滑动，底色同时变化。比复选框更适合“立即生效”的设置。",
   "vague": [
    "那个开关",
    "像 iPhone 设置里那样"
   ],
   "terms": [
    "Toggle Switch",
    "Thumb 滑块",
    "Track 轨道"
   ],
   "prompt": "做一个 iOS 风格的 Toggle Switch：轨道 52×32px 圆角胶囊，关闭灰色 #E4E4E7，打开绿色 #34C759；白色圆形滑块 26px 带轻微投影，切换时 250ms 带回弹的缓动滑动，按住时滑块横向拉长 4px。",
   "code": "<label class=\"switch\"><input type=\"checkbox\" checked><span></span></label>\n\n<style>\n.switch { position: relative; display: inline-block; width: 52px; height: 32px; }\n.switch input { position: absolute; opacity: 0; }\n.switch span { position: absolute; inset: 0; border-radius: 999px; background: #E4E4E7; cursor: pointer; transition: background .25s; }\n.switch span::after { content: \"\"; position: absolute; top: 3px; left: 3px; width: 26px; height: 26px; border-radius: 50%;\n  background: #fff; box-shadow: 0 2px 6px rgba(0, 0, 0, .18); transition: transform .25s cubic-bezier(.34, 1.56, .64, 1), width .15s; }\n.switch input:checked + span { background: #34C759; }\n.switch input:checked + span::after { transform: translateX(20px); }\n.switch span:active::after { width: 30px; }\n.switch input:checked + span:active::after { transform: translateX(16px); }\n.switch input:focus-visible + span { outline: 2px solid #007AFF; outline-offset: 2px; }\n</style>\n"
  },
  {
   "id": "backdrop-modal",
   "en": "Backdrop Modal",
   "zh": "遮罩弹窗",
   "group": "弹窗与浮层",
   "episode": "EP04",
   "lead": "弹窗出现时，背后的页面被一层半透明遮罩盖住并模糊，用户只能先处理弹窗。适合必须做决定的时刻。",
   "vague": [
    "弹窗太突兀",
    "弹出来很生硬"
   ],
   "terms": [
    "Backdrop Modal",
    "Overlay 遮罩",
    "Scale-in 缩放进入"
   ],
   "prompt": "做一个 Backdrop Modal：遮罩黑色 40% 透明度 + backdrop-filter: blur(4px)，200ms 淡入；弹窗白色圆角 20px，从 scale(0.95) 放大到 1 并淡入（250ms 带轻微回弹）；点遮罩或按 Esc 关闭。",
   "code": "<button class=\"open-modal\">删除项目</button>\n\n<div class=\"backdrop\" hidden>\n  <div class=\"modal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"modal-title\">\n    <h3 id=\"modal-title\">确定删除这个项目？</h3>\n    <p>删除后 30 天内可以在回收站里恢复。</p>\n    <div class=\"modal-actions\">\n      <button class=\"cancel\">取消</button>\n      <button class=\"danger\">删除</button>\n    </div>\n  </div>\n</div>\n\n<style>\n.open-modal { border: 0; background: #FF3B30; color: #fff; padding: 12px 24px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }\n.backdrop { position: fixed; inset: 0; display: grid; place-items: center; padding: 16px; background: rgba(0, 0, 0, .4);\n  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); animation: fade .2s ease-out; }\n.backdrop[hidden] { display: none; }\n.modal { width: min(360px, 100%); background: #fff; border-radius: 20px; padding: 24px; box-shadow: 0 24px 60px rgba(0, 0, 0, .2);\n  animation: pop-in .25s cubic-bezier(.34, 1.56, .64, 1); }\n.modal h3 { margin: 0 0 6px; font-size: 18px; }\n.modal p { margin: 0; color: #71717A; font-size: 14px; line-height: 1.6; }\n.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }\n.modal-actions button { border: 1px solid #E4E4E7; background: #fff; padding: 9px 18px; border-radius: 10px; font-size: 14px; cursor: pointer; }\n.modal-actions .danger { background: #FF3B30; border-color: #FF3B30; color: #fff; }\n@keyframes fade { from { opacity: 0; } }\n@keyframes pop-in { from { opacity: 0; transform: scale(.95); } }\n</style>\n\n<script>\nconst backdrop = document.querySelector(\".backdrop\");\nconst openModal = () => { backdrop.hidden = false; backdrop.querySelector(\".cancel\").focus(); };\nconst closeModal = () => { backdrop.hidden = true; };\ndocument.querySelector(\".open-modal\").addEventListener(\"click\", openModal);\nbackdrop.addEventListener(\"click\", e => { if (e.target === backdrop) closeModal(); });\nbackdrop.querySelectorAll(\"button\").forEach(b => b.addEventListener(\"click\", closeModal));\ndocument.addEventListener(\"keydown\", e => { if (e.key === \"Escape\") closeModal(); });\n<\/script>\n"
  },
  {
   "id": "drawer",
   "en": "Drawer",
   "zh": "侧边抽屉",
   "group": "弹窗与浮层",
   "episode": "EP04",
   "lead": "从屏幕侧边滑出的面板，像拉开一个抽屉。适合放筛选条件、购物车、设置这类“看完就关”的内容，不用跳转页面。",
   "vague": [
    "从旁边拉出来那个",
    "侧边弹出来的面板"
   ],
   "terms": [
    "Drawer",
    "Side Sheet",
    "Slide-in 滑入"
   ],
   "prompt": "购物车做成右侧 Drawer：宽 360px（手机端 85% 宽），从右侧滑入（300ms，cubic-bezier(0.32, 0.72, 0, 1)），背后加 30% 黑色遮罩；顶部标题和关闭按钮，底部固定结算按钮，中间内容可滚动。",
   "code": "<button class=\"open-drawer\">打开购物车</button>\n\n<div class=\"drawer-layer\">\n  <div class=\"drawer-mask\"></div>\n  <aside class=\"drawer\" aria-label=\"购物车\">\n    <header><h3>购物车 · 2 件</h3><button class=\"close\" aria-label=\"关闭\">✕</button></header>\n    <ul>\n      <li><span class=\"thumb\"></span><div><b>无线降噪耳机</b><small>¥899</small></div></li>\n      <li><span class=\"thumb\"></span><div><b>磁吸充电座</b><small>¥129</small></div></li>\n    </ul>\n    <footer><button class=\"checkout\">去结算 ¥1028</button></footer>\n  </aside>\n</div>\n\n<style>\n.open-drawer { border: 0; background: #18181B; color: #fff; padding: 12px 24px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }\n.drawer-layer { position: fixed; inset: 0; pointer-events: none; }\n.drawer-mask { position: absolute; inset: 0; background: rgba(0, 0, 0, .3); opacity: 0; transition: opacity .3s; }\n.drawer { position: absolute; top: 0; right: 0; bottom: 0; width: min(360px, 85%); background: #fff; display: flex; flex-direction: column;\n  box-shadow: -12px 0 40px rgba(0, 0, 0, .12); transform: translateX(100%); transition: transform .3s cubic-bezier(.32, .72, 0, 1); }\n.drawer-layer.open { pointer-events: auto; }\n.drawer-layer.open .drawer-mask { opacity: 1; }\n.drawer-layer.open .drawer { transform: none; }\n.drawer header { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px; border-bottom: 1px solid #F4F4F5; }\n.drawer h3 { margin: 0; font-size: 17px; }\n.drawer .close { border: 0; background: #F4F4F5; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; }\n.drawer ul { flex: 1; overflow-y: auto; margin: 0; padding: 12px 20px; list-style: none; display: grid; gap: 12px; align-content: start; }\n.drawer li { display: flex; gap: 12px; align-items: center; }\n.drawer .thumb { width: 52px; height: 52px; border-radius: 10px; background: #F4F4F5; flex-shrink: 0; }\n.drawer li b { display: block; font-size: 14px; } .drawer li small { color: #71717A; }\n.drawer footer { padding: 16px 20px; border-top: 1px solid #F4F4F5; }\n.checkout { width: 100%; height: 46px; border: 0; border-radius: 12px; background: #FA8C16; color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; }\n</style>\n\n<script>\nconst layer = document.querySelector(\".drawer-layer\");\ndocument.querySelector(\".open-drawer\").addEventListener(\"click\", () => layer.classList.add(\"open\"));\nlayer.querySelector(\".drawer-mask\").addEventListener(\"click\", () => layer.classList.remove(\"open\"));\nlayer.querySelector(\".close\").addEventListener(\"click\", () => layer.classList.remove(\"open\"));\n<\/script>\n"
  },
  {
   "id": "toast",
   "en": "Toast",
   "zh": "轻提示",
   "group": "弹窗与浮层",
   "episode": "EP04",
   "lead": "操作完成后从屏幕边缘滑出的一小条消息，几秒后自己消失，不打断用户。",
   "vague": [
    "弹个提示",
    "保存后告诉我一下"
   ],
   "terms": [
    "Toast",
    "Snackbar",
    "Auto-dismiss 自动消失"
   ],
   "prompt": "保存成功后显示 Toast：深色胶囊 #18181B、白字、左侧绿色对勾图标，从底部居中位置上滑 16px 并淡入（250ms ease-out），停留 2.5 秒后淡出；多条同时出现时向上堆叠。",
   "code": "<button class=\"save\">保存</button>\n<div class=\"toast-zone\" aria-live=\"polite\"></div>\n\n<style>\n.save { border: 1px solid #E4E4E7; background: #fff; padding: 10px 24px; border-radius: 10px; font-size: 15px; cursor: pointer; }\n.toast-zone { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); display: flex; flex-direction: column; gap: 8px; align-items: center; }\n.toast { display: flex; gap: 8px; align-items: center; background: #18181B; color: #fff; padding: 10px 18px; white-space: nowrap;\n  border-radius: 999px; font-size: 14px; animation: toast-in .25s ease-out, toast-out .25s ease-in 2.5s forwards; }\n.toast i { width: 18px; height: 18px; border-radius: 50%; background: #34C759; display: grid; place-items: center; font-style: normal; font-size: 11px; }\n@keyframes toast-in { from { opacity: 0; transform: translateY(16px); } }\n@keyframes toast-out { to { opacity: 0; transform: translateY(8px); } }\n</style>\n\n<script>\nfunction showToast(message) {\n  const t = document.createElement(\"div\");\n  t.className = \"toast\";\n  t.innerHTML = \"<i>✓</i>\";\n  t.append(message);\n  document.querySelector(\".toast-zone\").appendChild(t);\n  setTimeout(() => t.remove(), 2800);\n}\ndocument.querySelector(\".save\").addEventListener(\"click\", () => showToast(\"已保存\"));\n<\/script>\n"
  },
  {
   "id": "skeleton-screen",
   "en": "Skeleton Screen",
   "zh": "骨架屏",
   "group": "加载与状态反馈",
   "episode": "EP05",
   "lead": "内容还没加载完时，先用灰色块画出页面的轮廓，再配一道扫光。用户会觉得“快好了”，而不是盯着转圈。",
   "vague": [
    "加载的时候好丑",
    "白屏太久"
   ],
   "terms": [
    "Skeleton Screen",
    "Shimmer Effect 扫光",
    "Perceived Performance 感知速度"
   ],
   "prompt": "列表加载时显示 Skeleton Screen：保留真实布局（48px 圆形头像 + 两行文字条），灰色 #F4F4F5，圆角 6px；加一道从左到右的 Shimmer 扫光，1.4 秒循环，渐变中间亮度提高一档。",
   "code": "<div class=\"sk-list\">\n  <div class=\"sk-card\"><div class=\"sk avatar\"></div><div class=\"lines\"><div class=\"sk l1\"></div><div class=\"sk l2\"></div></div></div>\n  <div class=\"sk-card\"><div class=\"sk avatar\"></div><div class=\"lines\"><div class=\"sk l1\"></div><div class=\"sk l2\"></div></div></div>\n  <div class=\"sk-card\"><div class=\"sk avatar\"></div><div class=\"lines\"><div class=\"sk l1\"></div><div class=\"sk l2\"></div></div></div>\n</div>\n\n<style>\n.sk-list { display: grid; gap: 12px; width: min(340px, 90vw); }\n.sk-card { display: flex; gap: 14px; padding: 16px; background: #fff; border: 1px solid #E4E4E7; border-radius: 14px; }\n.lines { flex: 1; display: grid; gap: 10px; align-content: center; }\n.sk { background: linear-gradient(90deg, #F4F4F5 25%, #FAFAFA 50%, #F4F4F5 75%); background-size: 200% 100%;\n  animation: shimmer 1.4s linear infinite; border-radius: 6px; }\n.avatar { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; }\n.l1 { height: 12px; width: 70%; } .l2 { height: 12px; width: 45%; }\n@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }\n</style>\n"
  },
  {
   "id": "stepper-progress",
   "en": "Stepper Progress",
   "zh": "步骤进度条",
   "group": "加载与状态反馈",
   "episode": "EP05",
   "lead": "把一个长流程拆成几步，用一排圆点和连线显示“你在第几步、还剩几步”。注册、下单、填表时最常见。",
   "vague": [
    "流程太长用户会跑",
    "不知道还要填多久"
   ],
   "terms": [
    "Stepper",
    "Progress Indicator 进度指示",
    "Multi-step Form 分步表单"
   ],
   "prompt": "下单流程顶部加 Stepper Progress：4 个步骤（购物车、地址、支付、完成），圆点 28px 带序号，已完成变成橙色 #FA8C16 实心对勾，当前步骤橙色描边并外发光，连线随进度从左到右填色（400ms ease-in-out）。",
   "code": "<div class=\"stepper-demo\">\n  <ol class=\"stepper\">\n    <li class=\"done\"><i>1</i><span>购物车</span></li>\n    <li class=\"current\"><i>2</i><span>地址</span></li>\n    <li><i>3</i><span>支付</span></li>\n    <li><i>4</i><span>完成</span></li>\n  </ol>\n  <div class=\"stepper-actions\"><button class=\"prev\">上一步</button><button class=\"next\">下一步</button></div>\n</div>\n\n<style>\n.stepper-demo { width: min(440px, 92vw); display: grid; gap: 28px; }\n.stepper { display: flex; margin: 0; padding: 0; list-style: none; }\n.stepper li { flex: 1; position: relative; display: grid; justify-items: center; gap: 8px; font-size: 13px; color: #A1A1AA; }\n.stepper li + li::before { content: \"\"; position: absolute; top: 13px; right: 50%; width: 100%; height: 2px; z-index: 0;\n  background: linear-gradient(#FA8C16, #FA8C16) left / 0 100% no-repeat, #E4E4E7; transition: background-size .4s ease-in-out; }\n.stepper li.done + li::before { background-size: 100% 100%; }\n.stepper i { position: relative; z-index: 1; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center;\n  font-style: normal; font-weight: 600; background: #fff; border: 2px solid #E4E4E7; color: #A1A1AA; transition: .3s; }\n.stepper li.current { color: #18181B; font-weight: 600; }\n.stepper li.current i { border-color: #FA8C16; color: #FA8C16; box-shadow: 0 0 0 5px #FFE7BA; }\n.stepper li.done { color: #3F3F46; }\n.stepper li.done i { background: #FA8C16; border-color: #FA8C16; color: transparent; }\n.stepper li.done i::after { content: \"✓\"; position: absolute; color: #fff; font-size: 14px; }\n.stepper-actions { display: flex; justify-content: center; gap: 10px; }\n.stepper-actions button { border: 1px solid #E4E4E7; background: #fff; padding: 9px 20px; border-radius: 10px; font-size: 14px; cursor: pointer; }\n.stepper-actions .next { background: #18181B; border-color: #18181B; color: #fff; }\n</style>\n\n<script>\nconst steps = [...document.querySelectorAll(\".stepper li\")];\nlet current = 1;\nfunction render() {\n  steps.forEach((li, i) => {\n    li.classList.toggle(\"done\", i < current);\n    li.classList.toggle(\"current\", i === current);\n  });\n}\ndocument.querySelector(\".next\").addEventListener(\"click\", () => { current = Math.min(current + 1, steps.length - 1); render(); });\ndocument.querySelector(\".prev\").addEventListener(\"click\", () => { current = Math.max(current - 1, 0); render(); });\nrender();\n<\/script>\n"
  },
  {
   "id": "glassmorphism",
   "en": "Glassmorphism",
   "zh": "毛玻璃",
   "group": "视觉质感风格",
   "episode": "EP06",
   "lead": "半透明的卡片叠在彩色背景上，背后的内容被模糊，像隔着一块磨砂玻璃。苹果 macOS 和 iOS 大量使用。",
   "vague": [
    "要有质感",
    "通透一点",
    "像苹果那样"
   ],
   "terms": [
    "Glassmorphism",
    "Backdrop Blur 背景模糊",
    "Frosted Glass 磨砂玻璃"
   ],
   "prompt": "把登录卡片做成 Glassmorphism：背景是两个大的彩色模糊圆斑，卡片白色 18% 透明度 + backdrop-filter: blur(20px) saturate(160%)，1px 白色 35% 透明描边，圆角 20px，柔和大投影。",
   "code": "<div class=\"glass-scene\">\n  <div class=\"blob a\"></div><div class=\"blob b\"></div>\n  <div class=\"glass\"><h3>欢迎回来</h3><p>用手机号登录</p></div>\n</div>\n\n<style>\n.glass-scene { position: fixed; inset: 0; display: grid; place-items: center; background: #1E1B4B; overflow: hidden; }\n.blob { position: absolute; width: 260px; height: 260px; border-radius: 50%; filter: blur(30px); }\n.blob.a { background: #FF2D55; top: 10%; left: 18%; }\n.blob.b { background: #FA8C16; bottom: 8%; right: 16%; }\n.glass { position: relative; width: min(300px, 86vw); padding: 28px; border-radius: 20px; color: #fff;\n  background: rgba(255, 255, 255, .18); border: 1px solid rgba(255, 255, 255, .35);\n  backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%);\n  box-shadow: 0 20px 50px rgba(0, 0, 0, .25); }\n.glass h3 { margin: 0 0 4px; font-size: 22px; }\n.glass p { margin: 0; opacity: .8; }\n</style>\n"
  },
  {
   "id": "layered-elevation",
   "en": "Layered Elevation",
   "zh": "层次阴影",
   "group": "视觉质感风格",
   "episode": "EP06",
   "lead": "用几层不同深浅、不同扩散的阴影叠在一起，让卡片像真的浮在页面上，越重要的东西浮得越高。“高级感”很大一部分来自这里。",
   "vague": [
    "不高级",
    "太平了",
    "没有层次"
   ],
   "terms": [
    "Layered Elevation",
    "Elevation 海拔层级",
    "Multi-layer Shadow 多层阴影"
   ],
   "prompt": "卡片用 Layered Elevation：不要单层大阴影，用 3 层叠加（0 1px 2px 6% 黑、0 4px 12px 6% 黑、0 16px 32px 8% 黑），悬停时整体上浮 4px 并加深一层阴影，300ms ease-out；页面背景用 #F4F4F5 衬托白色卡片。",
   "code": "<div class=\"elev-row\">\n  <div class=\"elev e1\"><b>Level 1</b><small>列表、输入框</small></div>\n  <div class=\"elev e2\"><b>Level 2</b><small>卡片</small></div>\n  <div class=\"elev e3\"><b>Level 3</b><small>弹窗、浮层</small></div>\n</div>\n\n<style>\nbody { background: #F4F4F5 !important; }\n.elev-row { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; padding: 24px; }\n.elev { width: 140px; padding: 20px 16px; border-radius: 16px; background: #fff; display: grid; gap: 4px;\n  transition: transform .3s ease-out, box-shadow .3s ease-out; cursor: default; }\n.elev b { font-size: 15px; } .elev small { color: #71717A; font-size: 12px; }\n.e1 { box-shadow: 0 1px 2px rgba(0, 0, 0, .06), 0 1px 3px rgba(0, 0, 0, .04); }\n.e2 { box-shadow: 0 1px 2px rgba(0, 0, 0, .06), 0 4px 12px rgba(0, 0, 0, .06), 0 16px 32px rgba(0, 0, 0, .06); }\n.e3 { box-shadow: 0 2px 4px rgba(0, 0, 0, .06), 0 12px 24px rgba(0, 0, 0, .08), 0 32px 64px rgba(0, 0, 0, .12); }\n.elev:hover { transform: translateY(-4px);\n  box-shadow: 0 2px 4px rgba(0, 0, 0, .06), 0 12px 24px rgba(0, 0, 0, .08), 0 32px 64px rgba(0, 0, 0, .14); }\n</style>\n"
  }
 ],
 "vague": [
  {
   "vague": "不高级 / 没质感",
   "why": "“高级感”通常来自三件事：层次（阴影和叠放）、留白、克制的细节光效。告诉 AI 具体要哪一种，它才知道往哪改。",
   "terms": [
    [
     "Layered Elevation",
     "层次阴影",
     "layered-elevation"
    ],
    [
     "Whitespace",
     "留白"
    ],
    [
     "Glassmorphism",
     "毛玻璃",
     "glassmorphism"
    ],
    [
     "Spotlight Border",
     "聚光边框",
     "spotlight-border"
    ]
   ],
   "prompt": "整体加大留白（区块间距 96px，卡片内边距 24px），卡片改用 Layered Elevation 三层阴影，重点卡片加 Spotlight Border。"
  },
  {
   "vague": "太乱了 / 看不出重点",
   "why": "乱一般是层级不清：所有东西一样大、一样粗、一样颜色。要让 AI 建立视觉层级并对齐到网格。",
   "terms": [
    [
     "Visual Hierarchy",
     "视觉层级"
    ],
    [
     "Grid System",
     "栅格系统"
    ],
    [
     "Alignment",
     "对齐"
    ],
    [
     "Bento Grid",
     "便当盒布局"
    ]
   ],
   "prompt": "建立 Visual Hierarchy：标题 40px 粗体，副标题 18px 灰色，正文 15px；全部内容对齐到 12 栏 Grid System，功能区改成 Bento Grid。"
  },
  {
   "vague": "点了没反应 / 不知道成功没有",
   "why": "缺的是反馈。每次点击都应该有即时的视觉回应，耗时操作还要有过程和结果。",
   "terms": [
    [
     "Ripple Effect",
     "水波纹点击",
     "ripple-effect"
    ],
    [
     "Loading Button",
     "加载按钮",
     "loading-button"
    ],
    [
     "Toast",
     "轻提示",
     "toast"
    ],
    [
     "Optimistic UI",
     "乐观更新"
    ]
   ],
   "prompt": "按钮加 Ripple Effect；提交按钮改成 Loading Button；保存成功后弹出 Toast；点赞用 Optimistic UI，先变色再发请求。"
  },
  {
   "vague": "加载的时候好丑 / 白屏太久",
   "why": "等待本身没法消除，但可以让它“看起来快”。先给出轮廓，比空白和转圈更让人安心。",
   "terms": [
    [
     "Skeleton Screen",
     "骨架屏",
     "skeleton-screen"
    ],
    [
     "Shimmer Effect",
     "扫光"
    ],
    [
     "Progressive Blur",
     "渐进模糊"
    ]
   ],
   "prompt": "数据加载时用 Skeleton Screen 占位并加 Shimmer 扫光；图片用 Progressive Blur，先显示模糊小图再过渡到清晰图。"
  },
  {
   "vague": "动画很生硬 / 很廉价",
   "why": "生硬多半是缓动不对：匀速运动在现实里不存在。换成缓动曲线、弹簧，或者让元素错开出场。",
   "terms": [
    [
     "Ease-in-out",
     "缓入缓出"
    ],
    [
     "Spring",
     "弹簧动画"
    ],
    [
     "Stagger",
     "交错出场"
    ]
   ],
   "prompt": "所有过渡改成 ease-in-out（300ms）；弹窗用 Spring 动画；列表项进入时 Stagger 依次出现，间隔 60ms。"
  },
  {
   "vague": "弹窗太突兀 / 打断我",
   "why": "不同重要程度的信息该用不同的浮层。必须决定的才用模态弹窗，其余用更轻的形式。",
   "terms": [
    [
     "Backdrop Modal",
     "遮罩弹窗",
     "backdrop-modal"
    ],
    [
     "Drawer",
     "侧边抽屉",
     "drawer"
    ],
    [
     "Toast",
     "轻提示",
     "toast"
    ],
    [
     "Popover",
     "气泡浮层"
    ]
   ],
   "prompt": "确认删除用 Backdrop Modal（遮罩模糊、缩放进入）；筛选条件放进右侧 Drawer；操作结果用 Toast；字段说明用 Popover。"
  },
  {
   "vague": "太平了 / 太素了",
   "why": "平是因为缺少深度和动态。加一点层次、背景氛围或悬停微交互，页面就“活”了。",
   "terms": [
    [
     "Layered Elevation",
     "层次阴影",
     "layered-elevation"
    ],
    [
     "Aurora Background",
     "极光背景"
    ],
    [
     "Micro-interaction",
     "微交互"
    ],
    [
     "Underline Slide",
     "下划线滑入",
     "underline-slide"
    ]
   ],
   "prompt": "首屏加 Aurora Background；卡片用 Layered Elevation；导航链接加 Underline Slide，按钮加悬停 Micro-interaction。"
  },
  {
   "vague": "流程太长 / 用户会跑",
   "why": "长流程的焦虑来自“不知道还剩多少”。把它拆开，并且一直告诉用户进度。",
   "terms": [
    [
     "Stepper Progress",
     "步骤进度条",
     "stepper-progress"
    ],
    [
     "Multi-step Form",
     "分步表单"
    ],
    [
     "Progress Indicator",
     "进度指示"
    ]
   ],
   "prompt": "注册改成 Multi-step Form，分 3 步，顶部加 Stepper Progress 显示当前第几步，每步只放 2 到 3 个字段。"
  },
  {
   "vague": "颜色不好看 / 配色很土",
   "why": "配色问题通常是颜色太多、没有主次。定一个主色，其余用中性灰，再控制对比度。",
   "terms": [
    [
     "Accent Color",
     "主题色"
    ],
    [
     "Neutral Palette",
     "中性色板"
    ],
    [
     "60-30-10 Rule",
     "60-30-10 配色法则"
    ],
    [
     "Contrast",
     "对比度"
    ]
   ],
   "prompt": "只保留一个 Accent Color（#FA8C16），其余用锌灰 Neutral Palette；按 60-30-10 Rule 分配背景、表面、强调色；正文和背景 Contrast 至少 4.5:1。"
  },
  {
   "vague": "字不好看 / 读起来累",
   "why": "排版要素就四个：字号层级、字重、行高、行宽。大多数“难读”是行太长或行高太挤。",
   "terms": [
    [
     "Type Scale",
     "字号层级"
    ],
    [
     "Font Weight",
     "字重"
    ],
    [
     "Line Height",
     "行高"
    ],
    [
     "Measure",
     "行宽"
    ]
   ],
   "prompt": "定一套 Type Scale（14 / 16 / 20 / 28 / 40px）；正文 Line Height 1.7；段落 Measure 不超过 65 个字符；标题 Font Weight 700，正文 400。"
  }
 ],
 "glossary": [
  {
   "id": "layout",
   "name": "布局与留白",
   "intro": "页面东西怎么摆。说清楚布局，AI 才不会把所有东西堆成一列。",
   "terms": [
    [
     "Whitespace",
     "留白",
     "元素之间、四周的空白。留白多显得从容、高级，留白少显得拥挤廉价。",
     "区块之间留 96px 留白，卡片内边距 24px"
    ],
    [
     "Grid System",
     "栅格系统",
     "把页面竖着分成固定的几栏（常见 12 栏），所有内容对齐到栏上，页面就整齐。",
     "页面用 12 栏 Grid System，最大宽度 1200px，栏间距 24px"
    ],
    [
     "Bento Grid",
     "便当盒布局",
     "大小不一的方格拼在一起，像便当盒的分格。苹果发布会和很多产品官网的功能介绍都这么排。",
     "功能区用 Bento Grid，一大四小，圆角 24px"
    ],
    [
     "Hero Section",
     "首屏主视觉",
     "打开网页第一眼看到的那一整块：大标题、一句副标题、一个主按钮、一张大图。",
     "Hero Section 左文右图，标题 56px，下方两个按钮"
    ],
    [
     "Above the Fold",
     "首屏可见区",
     "不用滚动就能看到的部分。最重要的信息和按钮要放在这里。",
     "把注册按钮放在 Above the Fold"
    ],
    [
     "Split Screen",
     "左右分屏",
     "页面从中间一分为二，两边各讲一件事，常用于登录页、对比页。",
     "登录页用 Split Screen，左边品牌插画，右边表单"
    ],
    [
     "Card Layout",
     "卡片式布局",
     "把每条内容装进一张独立的卡片，再排成网格。电商、博客列表最常见。",
     "文章列表用 Card Layout，每行 3 张，手机端 1 张"
    ],
    [
     "Sticky Header",
     "吸顶导航",
     "往下滚动时导航栏固定在顶部不跟着走。",
     "导航做成 Sticky Header，滚动后背景变成毛玻璃"
    ],
    [
     "Z-Pattern",
     "Z 字形布局",
     "图文左右交替排列，视线像写 Z 一样扫过去，适合一段段介绍功能。",
     "功能介绍用 Z-Pattern，图文左右交替"
    ],
    [
     "Visual Hierarchy",
     "视觉层级",
     "通过大小、粗细、颜色区分主次，让人一眼知道先看什么。",
     "建立 Visual Hierarchy：标题最大最粗，辅助信息灰色小字"
    ]
   ]
  },
  {
   "id": "type",
   "name": "字体与文字",
   "intro": "文字占了界面的大部分。“字不好看”往往是这几个参数没调好。",
   "terms": [
    [
     "Type Scale",
     "字号层级",
     "一套固定的字号阶梯，比如 12 / 14 / 16 / 20 / 28 / 40，全站只用这几档。",
     "定一套 Type Scale：12 / 14 / 16 / 20 / 28 / 40px"
    ],
    [
     "Font Weight",
     "字重",
     "字的粗细，常用 400 常规、500 中等、600 半粗、700 粗体。",
     "标题 Font Weight 700，正文 400"
    ],
    [
     "Line Height",
     "行高",
     "两行文字之间的距离。正文一般是字号的 1.5 到 1.8 倍，太挤就累眼。",
     "正文 Line Height 1.7"
    ],
    [
     "Letter Spacing",
     "字间距",
     "字与字之间的距离。大标题略收紧显得精致，全大写小标签略放宽。",
     "大标题 Letter Spacing -1px"
    ],
    [
     "Measure",
     "行宽",
     "一行文字的长度。太长读到行尾找不到下一行，中文一般 30 到 40 字。",
     "正文 Measure 不超过 680px"
    ],
    [
     "Serif / Sans-serif",
     "衬线 / 无衬线",
     "衬线字（宋体类）笔画末端有装饰，显得文艺正式；无衬线（黑体类）干净现代。",
     "标题用 Serif 体现杂志感，正文用 Sans-serif"
    ],
    [
     "Display Font",
     "展示字体",
     "专门给大标题用的、有个性的字体，正文不用它。",
     "Hero 标题换一款 Display Font"
    ],
    [
     "Truncation",
     "文字截断",
     "文字太长时用省略号收尾，避免撑破布局。",
     "标题超过两行用 Truncation 显示省略号"
    ]
   ]
  },
  {
   "id": "color",
   "name": "色彩",
   "intro": "配色难看，通常不是颜色选错，而是颜色太多、没有主次。",
   "terms": [
    [
     "Accent Color",
     "主题色 / 强调色",
     "全站最重要的那个颜色，只用在按钮、链接、选中状态这些关键位置。",
     "Accent Color 用 #FA8C16，只用在主按钮和链接上"
    ],
    [
     "Neutral Palette",
     "中性色板",
     "一组从白到黑的灰，负责背景、边框、文字。好看的界面 90% 是中性色。",
     "背景、边框、正文都用一套 Neutral Palette（锌灰）"
    ],
    [
     "60-30-10 Rule",
     "60-30-10 法则",
     "60% 主背景色、30% 辅助色、10% 强调色，比例对了就不会乱。",
     "按 60-30-10 Rule 分配颜色"
    ],
    [
     "Contrast",
     "对比度",
     "文字和背景的明暗差距。不够就看不清，正文至少 4.5:1。",
     "正文和背景 Contrast 至少 4.5:1"
    ],
    [
     "Gradient",
     "渐变",
     "两种以上颜色平滑过渡。线性渐变、径向渐变、网格渐变效果各不同。",
     "按钮用 135 度的橙到粉 Gradient"
    ],
    [
     "Mesh Gradient",
     "网格渐变",
     "多个颜色团块自由融合，像一团流动的彩色雾，比普通渐变更柔和高级。",
     "背景用柔和的 Mesh Gradient"
    ],
    [
     "Semantic Color",
     "语义色",
     "按含义固定的颜色：成功绿、警告黄、错误红、信息蓝。",
     "表单错误提示用 Semantic Color 红色"
    ],
    [
     "Dark Mode",
     "深色模式",
     "整套界面换成深色背景。不是简单反色，深色下阴影要弱、颜色要降饱和。",
     "支持 Dark Mode，背景 #0F0F11，跟随系统切换"
    ],
    [
     "Monochrome",
     "单色系",
     "只用一个色相的深浅变化，干净统一。",
     "插画用 Monochrome 蓝色系"
    ]
   ]
  },
  {
   "id": "style",
   "name": "视觉风格流派",
   "intro": "一个风格名就能让 AI 把整套界面的感觉对上。想要“某种感觉”时先查这里。",
   "terms": [
    [
     "Minimalism",
     "极简主义",
     "只留必要元素，大量留白，颜色很少。苹果、无印良品的感觉。",
     "整体 Minimalism 风格，黑白灰加一个强调色"
    ],
    [
     "Flat Design",
     "扁平化",
     "没有阴影、没有渐变、没有质感，纯色块。",
     "图标用 Flat Design"
    ],
    [
     "Material Design",
     "Material 设计",
     "谷歌的设计语言：卡片有阴影层级、点击有水波纹、动效有物理感。",
     "按 Material Design 规范做"
    ],
    [
     "Skeuomorphism",
     "拟物化",
     "模仿真实物体的质感，比如皮革纹理、金属旋钮。早期 iOS 的风格。",
     "计算器按键做成 Skeuomorphism 实体按键"
    ],
    [
     "Neumorphism",
     "新拟态",
     "元素和背景同色，靠一亮一暗两道阴影做出凸起或凹陷，柔软像塑料。",
     "控制面板用 Neumorphism，背景 #E0E5EC"
    ],
    [
     "Glassmorphism",
     "毛玻璃",
     "半透明加背景模糊，像磨砂玻璃。",
     "卡片用 Glassmorphism",
     "glassmorphism"
    ],
    [
     "Neo-Brutalism",
     "新粗野主义",
     "粗黑描边、硬投影、高饱和撞色，故意显得“不精致”，年轻有个性。",
     "整站 Neo-Brutalism：3px 黑边、硬投影、亮黄色"
    ],
    [
     "Claymorphism",
     "黏土风",
     "圆滚滚、软乎乎的 3D 质感，像橡皮泥捏的，可爱亲和。",
     "插画和按钮用 Claymorphism"
    ],
    [
     "Swiss Style",
     "瑞士风格",
     "严格网格、无衬线大字、大量留白、不对称排版，理性冷静。",
     "海报式首页用 Swiss Style"
    ],
    [
     "Y2K",
     "千禧风",
     "2000 年前后的审美：金属银、镭射渐变、像素字、气泡元素。",
     "活动页做成 Y2K 风格"
    ],
    [
     "Aurora Background",
     "极光背景",
     "几团彩色光晕在背景里缓慢流动，像极光。很多 AI 产品官网在用。",
     "Hero 背景用 Aurora Background"
    ]
   ]
  },
  {
   "id": "components",
   "name": "常见组件叫法",
   "intro": "很多人知道长什么样，但叫不出名字。说出名字，AI 就能直接做对。",
   "terms": [
    [
     "Navbar",
     "导航栏",
     "页面顶部那一横条，放 Logo、菜单和按钮。",
     "顶部 Navbar：左 Logo，中间菜单，右侧登录按钮"
    ],
    [
     "Breadcrumb",
     "面包屑",
     "“首页 / 分类 / 当前页”这样一串路径，告诉你现在在哪。",
     "详情页顶部加 Breadcrumb"
    ],
    [
     "Tabs",
     "标签页",
     "一排可切换的标签，点哪个下面就显示哪块内容。",
     "设置页用 Tabs 切换“账号 / 通知 / 隐私”"
    ],
    [
     "Segmented Control",
     "分段控件",
     "几个按钮连成一体、只能选一个，像 iOS 里的切换条。",
     "视图切换用 Segmented Control"
    ],
    [
     "Accordion",
     "手风琴折叠",
     "点标题展开内容、再点收起，常用于 FAQ。",
     "常见问题用 Accordion，一次只展开一条"
    ],
    [
     "Carousel",
     "轮播图",
     "几张图左右滑动轮流展示。",
     "首页 Banner 用 Carousel，5 秒自动切换"
    ],
    [
     "Badge",
     "徽标",
     "角上的小红点或小数字，提示有新消息。",
     "消息图标右上角加 Badge 显示未读数"
    ],
    [
     "Chip / Tag",
     "标签胶囊",
     "圆角小胶囊，用来显示分类或可选的筛选条件。",
     "筛选条件做成可多选的 Chip"
    ],
    [
     "Avatar",
     "头像",
     "圆形的用户头像，没图时显示名字首字母。",
     "评论区 Avatar 32px，没头像时显示首字母"
    ],
    [
     "Tooltip",
     "文字提示",
     "鼠标悬停时冒出的小黑框说明文字。",
     "图标按钮悬停显示 Tooltip"
    ],
    [
     "Popover",
     "气泡浮层",
     "点击后弹出的小卡片，比 Tooltip 大，里面能放按钮和表单。",
     "点头像弹出 Popover 显示个人菜单"
    ],
    [
     "Dropdown",
     "下拉菜单",
     "点一下展开一列选项。",
     "排序用 Dropdown"
    ],
    [
     "Modal",
     "弹窗",
     "页面中间弹出的对话框，背后加遮罩。",
     "删除确认用 Modal",
     "backdrop-modal"
    ],
    [
     "Drawer",
     "抽屉",
     "从屏幕边缘滑出的面板。",
     "购物车用右侧 Drawer",
     "drawer"
    ],
    [
     "Bottom Sheet",
     "底部面板",
     "手机上从底部滑上来的面板，可以拖动高度。",
     "手机端分享菜单用 Bottom Sheet"
    ],
    [
     "Toast",
     "轻提示",
     "屏幕边缘冒出一小条消息，几秒后自动消失。",
     "保存成功弹 Toast",
     "toast"
    ],
    [
     "Toggle Switch",
     "开关",
     "左右滑动的二选一开关。",
     "通知设置用 Toggle Switch",
     "toggle-switch"
    ],
    [
     "Stepper",
     "步骤条",
     "显示“第几步、共几步”的进度。",
     "下单流程顶部加 Stepper",
     "stepper-progress"
    ],
    [
     "Pagination",
     "分页器",
     "“上一页 1 2 3 下一页”。",
     "列表底部加 Pagination"
    ],
    [
     "Infinite Scroll",
     "无限滚动",
     "滑到底自动加载更多，不用翻页。",
     "瀑布流用 Infinite Scroll"
    ],
    [
     "Command Palette",
     "命令面板",
     "按 Ctrl+K 弹出的搜索框，能搜页面、搜操作。",
     "加一个 Ctrl+K 唤起的 Command Palette"
    ],
    [
     "FAB",
     "悬浮按钮",
     "固定在屏幕右下角的圆形主按钮。",
     "手机端右下角加 FAB 用于发帖"
    ]
   ]
  },
  {
   "id": "states",
   "name": "交互状态",
   "intro": "同一个元素在不同时刻要长得不一样。AI 常常只做“正常状态”，其他状态要你点名。",
   "terms": [
    [
     "Hover State",
     "悬停态",
     "鼠标移上去时的样子。",
     "所有按钮加 Hover State：背景加深 8%"
    ],
    [
     "Active / Pressed",
     "按下态",
     "按住不放那一刻的样子，通常轻微缩小或变暗。",
     "按钮 Active 时缩放到 0.97"
    ],
    [
     "Focus Ring",
     "焦点框",
     "用键盘 Tab 选中时出现的外框，没有它键盘用户找不到自己在哪。",
     "所有可点击元素加 2px 橙色 Focus Ring"
    ],
    [
     "Disabled State",
     "禁用态",
     "暂时不能点的样子，通常变灰、半透明。",
     "表单没填完时提交按钮是 Disabled State"
    ],
    [
     "Empty State",
     "空状态",
     "列表没有内容时显示的插图、一句话和引导按钮，而不是一片空白。",
     "购物车为空时显示 Empty State 和“去逛逛”按钮"
    ],
    [
     "Error State",
     "错误态",
     "出错时的提示：红色边框、错误说明、怎么修复。",
     "输入框校验失败显示 Error State，下方红字说明原因"
    ],
    [
     "Loading State",
     "加载态",
     "等数据时的样子：转圈、骨架屏或进度条。",
     "列表 Loading State 用骨架屏",
     "skeleton-screen"
    ],
    [
     "Selected State",
     "选中态",
     "被选中的项要明显区别于其他项。",
     "当前菜单项 Selected State：橙色文字 + 浅橙背景"
    ],
    [
     "Optimistic UI",
     "乐观更新",
     "点了之后先假设成功、立刻更新界面，再在后台发请求，失败再回滚。",
     "点赞用 Optimistic UI"
    ]
   ]
  },
  {
   "id": "motion",
   "name": "动效与节奏",
   "intro": "“动画很生硬”“很廉价”，多半是时长和缓动的问题。",
   "terms": [
    [
     "Duration",
     "时长",
     "动画持续多久。小元素 150 到 250ms，大面板 300 到 500ms，太慢就拖沓。",
     "所有过渡 Duration 250ms"
    ],
    [
     "Easing",
     "缓动曲线",
     "动画速度怎么变化。匀速（linear）最生硬，ease-out 先快后慢最自然。",
     "进入动画 Easing 用 ease-out"
    ],
    [
     "Ease-in-out",
     "缓入缓出",
     "慢慢开始、慢慢停下，最常用的缓动。",
     "位移动画用 Ease-in-out"
    ],
    [
     "Spring",
     "弹簧动画",
     "像弹簧一样冲过头再弹回来，显得有弹性、有生命力。",
     "弹窗出现用 Spring 动画"
    ],
    [
     "Stagger",
     "交错出场",
     "一组元素不是同时出现，而是一个接一个，间隔几十毫秒。",
     "卡片 Stagger 进入，间隔 60ms"
    ],
    [
     "Fade / Slide / Scale",
     "淡入 / 滑入 / 缩放",
     "三种最基础的进场方式，可以组合使用。",
     "卡片 Fade + Slide 上移 16px 进场"
    ],
    [
     "Micro-interaction",
     "微交互",
     "点赞、开关、复制这类小操作上的小动画，让界面有反馈感。",
     "复制按钮点击后图标变对勾，加 Micro-interaction"
    ],
    [
     "Scroll-triggered",
     "滚动触发",
     "滚动到某个位置时元素才开始动画。",
     "每个区块 Scroll-triggered 淡入"
    ],
    [
     "Parallax",
     "视差滚动",
     "滚动时前景和背景移动速度不同，产生纵深感。",
     "Hero 背景图 Parallax，速度 0.5 倍"
    ],
    [
     "Page Transition",
     "页面转场",
     "从一个页面切到另一个页面时的过渡动画。",
     "页面切换加 Page Transition：淡出再淡入"
    ],
    [
     "Reduced Motion",
     "减少动效",
     "系统开了“减少动态效果”时，关掉大幅动画，照顾容易晕的人。",
     "尊重 Reduced Motion 设置"
    ]
   ]
  },
  {
   "id": "responsive",
   "name": "响应式与适配",
   "intro": "“手机上乱了”的时候，用这些词告诉 AI 怎么改。",
   "terms": [
    [
     "Responsive Design",
     "响应式设计",
     "同一个页面在电脑、平板、手机上自动调整布局。",
     "整站 Responsive Design"
    ],
    [
     "Breakpoint",
     "断点",
     "屏幕宽度到某个值时切换布局，比如 768px 以下变成手机布局。",
     "Breakpoint 设在 640 / 1024px"
    ],
    [
     "Mobile-first",
     "移动优先",
     "先设计手机版，再往大屏扩展。",
     "按 Mobile-first 写样式"
    ],
    [
     "Fluid Typography",
     "流式字号",
     "字号随屏幕宽度平滑变化，不用每个断点手动调。",
     "标题用 Fluid Typography：clamp(28px, 5vw, 56px)"
    ],
    [
     "Safe Area",
     "安全区",
     "手机刘海、底部横条占掉的区域，按钮不能放进去。",
     "底部按钮避开 Safe Area"
    ],
    [
     "Touch Target",
     "触控热区",
     "手指能点中的区域，至少 44×44px，太小就容易点错。",
     "所有按钮 Touch Target 至少 44px"
    ],
    [
     "Hamburger Menu",
     "汉堡菜单",
     "手机上三条横线的图标，点开显示完整菜单。",
     "手机端导航收进 Hamburger Menu"
    ]
   ]
  },
  {
   "id": "texture",
   "name": "质感与细节",
   "intro": "“高级感”大多藏在这些细节里。",
   "terms": [
    [
     "Layered Elevation",
     "层次阴影",
     "多层柔和阴影叠加，让卡片像浮起来。",
     "卡片用 Layered Elevation",
     "layered-elevation"
    ],
    [
     "Border Radius",
     "圆角",
     "直角显得严肃，大圆角显得友好。全站圆角要统一。",
     "全站 Border Radius 统一 12px"
    ],
    [
     "Hairline Border",
     "细描边",
     "1px 的浅色描边，比阴影更克制地分隔内容。",
     "卡片用 Hairline Border 代替阴影"
    ],
    [
     "Inner Shadow",
     "内阴影",
     "阴影在元素内部，做出凹陷的感觉，常用于输入框。",
     "输入框加轻微 Inner Shadow"
    ],
    [
     "Noise Texture",
     "噪点纹理",
     "在渐变或纯色上叠一层细小噪点，消除塑料感，更有胶片质感。",
     "背景渐变叠一层 4% 的 Noise Texture"
    ],
    [
     "Spotlight Border",
     "聚光边框",
     "边框跟着鼠标亮起光晕。",
     "功能卡片加 Spotlight Border",
     "spotlight-border"
    ],
    [
     "Backdrop Blur",
     "背景模糊",
     "把元素后面的内容模糊掉，是毛玻璃的核心。",
     "导航栏 Backdrop Blur 12px"
    ],
    [
     "Iconography",
     "图标体系",
     "全站图标统一风格：线性还是面性、线条粗细、圆角。",
     "Iconography 统一用 1.5px 线性图标"
    ]
   ]
  },
  {
   "id": "ux",
   "name": "体验与可用性",
   "intro": "不只是好看，还要好用。这些词能让 AI 照顾到细节体验。",
   "terms": [
    [
     "Call to Action (CTA)",
     "行动号召按钮",
     "页面上最希望用户点的那个按钮，要最显眼。",
     "Hero 只放一个主 CTA“免费试用”"
    ],
    [
     "Progressive Disclosure",
     "渐进披露",
     "先只显示最常用的选项，高级选项折叠起来，需要时再展开。",
     "设置页用 Progressive Disclosure，高级选项默认收起"
    ],
    [
     "Onboarding",
     "新手引导",
     "第一次使用时的几步引导，介绍核心功能。",
     "首次登录显示 3 步 Onboarding"
    ],
    [
     "Inline Validation",
     "实时校验",
     "边填边检查，不等提交才一次性报错。",
     "表单用 Inline Validation"
    ],
    [
     "Skeleton Screen",
     "骨架屏",
     "加载时先显示内容的灰色轮廓。",
     "列表加载用 Skeleton Screen",
     "skeleton-screen"
    ],
    [
     "Undo",
     "撤销",
     "删除后给几秒“撤销”机会，比弹窗确认更不打扰。",
     "删除后 Toast 里带 Undo 按钮"
    ],
    [
     "Accessibility (a11y)",
     "无障碍",
     "让视障、色弱、只用键盘的人也能用：对比度、焦点框、读屏标签。",
     "注意 Accessibility：图片加 alt，按钮加 aria-label"
    ],
    [
     "Consistency",
     "一致性",
     "同样的东西在全站长得一样、用法一样。",
     "保持 Consistency：所有主按钮同一样式"
    ]
   ]
  }
 ]
};
