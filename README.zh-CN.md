# steelseal · 钢印

> 钢板底、铁黑字、朱红印。

[English](README.md) · **简体中文**

**一套只为长文阅读存在的 [Astro](https://astro.build) 博客主题。** 左边一条 320px 的固定索引栏，右边一条 768px（16px 字号下 48 个汉字）的正文列；没有卡片、阴影、渐变和弹窗。整站只有三种颜色，朱红只用来盖一个章、标一次「你现在在这里」。

[在线示例](https://hmilyld.com) · [设计说明](DESIGN.zh-CN.md) · [AI 代理指南](AGENTS.zh-CN.md) · [MIT 许可](LICENSE)

![Astro](https://img.shields.io/badge/Astro-7-BC52EE?style=flat-square&logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-26282b?style=flat-square)

![steelseal 首页：左侧索引栏与右侧 48 字正文列](docs/screenshots/home-light.png)

> 截图来自主题实际部署的站点 [hmilyld.com](https://hmilyld.com)。仓库内自带的是示例内容，站名、作者、印章字与文章都可以替换。

## 目录

- [为什么是这套主题](#为什么是这套主题)
- [设计语言](#设计语言)
- [页面与功能](#页面与功能)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [改成你自己的](#改成你自己的)
- [键盘](#键盘)
- [部署](#部署)
- [许可](#许可)

## 为什么是这套主题

- **纯静态**：`astro build` 出来是一堆 HTML，`dist/` 丢给任何静态托管都能跑，不需要服务端。
- **零框架**：没有 React / Vue / Svelte。主题切换、搜索、目录高亮、代码复制、移动端抽屉全部是几十行原生 JS。
- **自带设计系统**：颜色、字号、间距、圆角、动效都有刻度，不是随手写的数值；每个数字旁边写着它为什么是这个值。
- **中英双语界面**：中文服务端渲染，客户端可切到英文；正文语言不变，`<html lang>` 始终是 `zh-CN`。
- **完整页面**：存档、文章、标签、搜索、404、RSS、sitemap、robots、JSON-LD 都有。
- **认真做无障碍**：明暗双主题对比度实测，标题层级不跳级，抽屉打开时背景 `inert`，焦点全程可见。

## 设计语言

整套视觉围绕三件事：**三种颜色、一种圆角、一个宽度**。更完整的推导过程与踩坑记录在 [DESIGN.zh-CN.md](DESIGN.zh-CN.md)。

### 颜色

| Token                 | 浅色      | 暗色      | 用途                              |
| --------------------- | --------- | --------- | --------------------------------- |
| `--color-ground`      | `#eeede9` | `#1a1c1e` | 钢板底：页面背景                  |
| `--color-ink`         | `#26282b` | `#e7e8e5` | 铁黑字：正文与标题                |
| `--color-soft`        | `#55595d` | `#9aa0a4` | 次要文字（6.0:1 / 6.5:1）         |
| `--color-faint`       | `#676b6f` | `#8a9095` | 元信息（4.6:1 / 5.3:1）           |
| `--color-rule`        | `#d4d6d2` | `#303336` | 结构线                            |
| `--color-rule-strong` | `#b9bcb6` | `#41454a` | 控件边框、更强的分隔              |
| `--color-seal`        | `#b23a2e` | `#c0473a` | 印章块：只承载 40px 的字形        |
| `--color-accent`      | `#b23a2e` | `#e07a6a` | 承载文字时的朱红（5.1:1 / 5.8:1） |

暗色下朱红分成两个 token：印章块上的大字可以暗一点，正文里的链接必须够亮。混用会让其中一处对比度不达标。

**组件颜色一律走 token。** 例外只有三处：Shiki 写进 HTML 的内联注释色（用 `[style*='#6A737D']` 单独覆盖，3.1:1 → 5.7:1）、移动端遮罩的深色叠加、打印样式里的固定浅色。

### 排版

字体全部自托管（Fontsource），不请求第三方 CDN：

| 字体           | 角色                                   |
| -------------- | -------------------------------------- |
| Noto Sans SC   | 中文正文、标题、界面                   |
| Overpass       | 拉丁字标、日期、年份、元信息、大写副标 |
| JetBrains Mono | 代码块、行内代码                       |

- 正文 `16px / 1.75`，段间距充足，中文长文优先。
- 字号有明确刻度：文章标题 32px、页面标题 24px、正文 h2 22.4px、h3 17.9px、正文 16px、摘要 14.4px、元信息 12.8px、微型标签 12px。**12px 是地板**，任何有信息量的文字都不低于它。
- 字距按角色分配，从正文的 `0.01em` 到拉丁字标的 `0.26em`，不随意加值。
- 行宽由 `.pane-inner` 的 `48rem` 统一决定：正文、代码、表格、图片共用同一条右边缘。

### 布局

```text
┌──────────────┬────────────────────────────┐
│ rail 320px   │ pane                       │
│              │  ┌──────────────────────┐  │
│  印章 + 站名 │  │ pane-inner 768px     │  │
│  年份索引 /  │  │                      │  │
│  文章目录    │  │  正文 / 代码 / 表格  │  │
│  页面导航    │  │  全部同宽            │  │
│  主题 / 语言 │  └──────────────────────┘  │
└──────────────┴────────────────────────────┘
```

- `--shell-max: 75rem`（1200px）= 320（栏）+ 56（留白）+ 768（正文）+ 56（留白）。
- 左栏 `position: sticky`，只有中间的年份 / 目录区域滚动，身份与底部控件始终在位。
- 断点 `1199 / 1072 / 1024 / 860`；860px 以下左栏变成抽屉，关闭态 `visibility: hidden`，链接彻底离开 Tab 序列。
- 内容不足一屏时，`.pane` 的弹性列把页脚顶到视口底部。

### 组件与状态

| 组件            | 做法                                                                 |
| --------------- | -------------------------------------------------------------------- |
| 按钮 `.btn`     | 32px 高、3px 圆角、1px 边框；悬停转墨色，按下加 7% 墨色底            |
| 标签 `.tag`     | 三种形态共用一套颜色：标签云 chip、文章元信息下划线、行内静态标签    |
| 行 `.row`       | `1fr 10rem` 网格，右侧是日期 / 阅读时长 / 标签的元信息槽             |
| 小节头          | 2px 墨线下划线 + 标题 + 大写副标；页面级分区用 2px，行与行之间用 1px |
| 分段控件 `.seg` | 主题（自动 / 浅色 / 深色）与语言（中文 / EN）共用                    |
| 搜索框          | 焦点指示放在整条下边线上：1px 边框 + 1px 投影叠成 2px 朱红           |
| 阅读进度        | 2px 朱红细线贴在视口顶端，宽度跟滚动走                               |
| 代码复制        | 由脚本注入到代码块右上角；触摸设备常显，悬停设备按需出现             |

交互状态统一为：**hover** 150ms 向墨色或朱红移动；**focus-visible** 2px 朱红描边、3px 偏移；**active** 加一层墨色底；**disabled** 45% 透明度。动效只有两个时长：`150ms`（悬停与按下）和 `200ms`（主题切换、抽屉），缓动统一 `ease`；`prefers-reduced-motion` 下全部关闭。

无障碍方面：正文与次要文字对比度全部 ≥4.5:1；每页恰好一个暴露的一级标题；首页标题层级为 `h1 → h2 写作 → h3 年份 → h4 文章`；跳转链接是第一个 Tab 停留点；抽屉打开时 `main` 变 `inert`，Esc 关闭并归还焦点；触摸目标 ≥24×24。

## 页面与功能

| 路径                                            | 说明                                                           |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `/`                                             | 存档：全部文章按年份分组，带标题 / 标签筛选与左栏滚动高亮      |
| `/posts/[slug]`                                 | 文章：左栏目录、阅读进度、上下篇、同标签相关文章、代码复制     |
| `/tags`、`/tags/[tag]`                          | 标签云（可索引）与标签详情页（`noindex`）                      |
| `/search`                                       | 本地搜索：标题、标签、摘要，命中高亮，空查询给最近 8 篇        |
| `/[page]`                                       | `src/content/pages/*.md` 生成的静态页（如 `/about`、`/links`） |
| `/404`                                          | 带最近五篇文章与继续入口的 404                                 |
| `/rss.xml`、`/sitemap-index.xml`、`/robots.txt` | 自动生成；搜索页、标签详情页、隐藏文章不进 sitemap             |
| `/search.json`                                  | 构建时生成的搜索索引，前端按需拉取                             |

### 截图

以下截图均来自线上示例站点，覆盖文章页（暗色）、标签页与移动端：

![文章页：左栏目录、阅读进度、暗色模式](docs/screenshots/post-dark.png)

![标签页：按文章数量排序的标签云](docs/screenshots/tags-light.png)

<p align="center">
  <img src="docs/screenshots/mobile-home.png" alt="移动端首页：顶栏 + 抽屉入口" width="300" />
</p>

## 技术栈

| 层       | 选择                                                                                        |
| -------- | ------------------------------------------------------------------------------------------- |
| 框架     | Astro 7，静态输出，Content Collections + `glob` loader                                      |
| 样式     | Tailwind CSS 4（仅通过 `@tailwindcss/vite` 引入，组件写在 `@layer components`，不堆工具类） |
| 语言     | TypeScript（`astro/tsconfigs/strict`）+ `.astro` 组件                                       |
| 字体     | `@fontsource-variable/*`：Overpass、Noto Sans SC、JetBrains Mono                            |
| 高亮     | Shiki（`github-dark`），注释色单独覆盖                                                      |
| 订阅/SEO | `@astrojs/rss`、`@astrojs/sitemap`、JSON-LD、Open Graph、Twitter Card                       |
| 运行时   | 无 UI 框架、无客户端路由、无第三方脚本                                                      |

## 快速开始

需要 Node >= 22.12。包管理器用 pnpm / npm / yarn 都行，下面以 pnpm 为例。

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # → dist/
pnpm preview    # 预览构建结果
```

其他脚本：

```sh
pnpm check         # astro check（类型 + 模板检查）
pnpm lint          # eslint
pnpm format        # prettier --write
pnpm format:check  # prettier --check
```

上线前把 `astro.config.mjs` 里的 `site` 改成你的域名——canonical、`og:url`、RSS 和 sitemap 都从它来。线上示例是 `https://hmilyld.com`。

## 项目结构

```text
.
├── astro.config.mjs          # site、sitemap 过滤、Shiki、Tailwind 插件
├── README.md / README.zh-CN.md   # 英文 / 中文项目说明
├── DESIGN.md / DESIGN.zh-CN.md   # 英文 / 中文设计系统
├── AGENTS.md / AGENTS.zh-CN.md   # 英文 / 中文 AI 代理指南
├── docs/screenshots/         # README 截图
├── public/                   # favicon、og-image 等原样拷贝的静态资源
└── src/
    ├── config.ts             # 站点身份：站名、作者、印章、导航、社交链接
    ├── content.config.ts     # posts / pages 的 frontmatter schema
    ├── styles/global.css     # 设计系统：token + 组件 + 响应式 + 打印
    ├── layouts/
    │   └── BaseLayout.astro  # 外壳：SEO、主题、i18n、进度条、代码复制、快捷键
    ├── components/
    │   ├── SiteRail.astro    # 左栏：身份、年份索引 / 目录、导航、主题与语言
    │   ├── Seal.astro        # 朱红印章
    │   ├── Toc.astro         # 文章目录（渲染在左栏里）
    │   ├── PostRows.astro    # 行列表（首页、标签页、404、相关文章共用）
    │   └── PageLayout.astro  # 静态页布局
    ├── pages/                # 路由与 RSS / sitemap / 搜索索引
    ├── utils/posts.ts        # 排序、按年分组、标签统计、阅读时长
    └── content/
        ├── posts/            # Markdown 文章
        └── pages/            # Markdown 静态页
```

## 改成你自己的

### 1. 站点身份：`src/config.ts`

```ts
export const SITE = {
  title: '钢印日记', // 站点名，出现在 <title> 与左栏 h1
  latin: 'STEELSEAL', // 左栏拉丁字标
  description: '……', // meta description
  author: '示例作者', // JSON-LD、RSS、页脚版权
  seal: '印', // 印章里的字，一个汉字
  tagline: '……', // 左栏标语
  place: '河南 · 周口', // 左栏地点行，可删
  favicon: '/favicon.svg',
  socials: ['https://github.com/yourname'],
  nav: [
    { key: 'search', href: '/search', zh: '搜索', en: 'Search' },
    { key: 'links', href: '/links', zh: '链接', en: 'Links' },
    { key: 'about', href: '/about', zh: '关于', en: 'Profile' },
  ],
};
```

`nav` 里的 `key` 对应 `BaseLayout.astro` 里 i18n 词典的 `nav.*`；加新条目时两处都要加。

### 2. 设计参数：`src/styles/global.css`

文件顶部的 `:root` 就是整站的外观：

```css
:root {
  --color-ground: #eeede9; /* 钢板底 */
  --color-ink: #26282b; /* 铁黑字 */
  --color-seal: #b23a2e; /* 朱红印 */

  --shell-max: 75rem; /* 页面总宽 */
  --rail-w: 320px; /* 左栏宽 */
  --gutter: 3.5rem; /* 正文两侧留白 */
  --radius: 3px; /* 唯一的圆角 */
  --dur: 150ms; /* 唯一的交互动效时长 */
}
```

`.dark` 里是暗色模式的对应值。改颜色请连同 `/* 6.0:1 on ground */` 这类注释一起改——那些是实测的对比度，不是装饰。

### 3. 内容

文章放进 `src/content/posts/`，文件名随意，URL 由 frontmatter 决定。

```md
---
title: 标题 # 必填
date: 2026-01-12 # 必填
tags: [设计, 排版] # 可选
excerpt: 一句话摘要 # 可选，会出现在首页与标签页
slug: custom-slug # 可选，覆盖 URL
hidden: false # 可选，true 则不进列表、不进 sitemap、带 noindex
---

正文用 Markdown。
```

图片建议写成裸 HTML，带尺寸和懒加载——Markdown 的 `![]()` 不带宽高，加载时会跳：

```html
<figure>
  <img src="/shot.png" alt="说明" width="1440" height="720" loading="lazy" decoding="async" />
  <figcaption>图注</figcaption>
</figure>
```

静态页面放进 `src/content/pages/`，文件名即路径（`about.md` → `/about`）。

## 键盘

| 键    | 作用                         |
| ----- | ---------------------------- |
| `/`   | 跳到搜索（首页是存档筛选框） |
| `Esc` | 关闭移动端抽屉               |
| `Tab` | 每一处焦点都有 2px 朱红描边  |

## 部署

构建产物是纯静态的，`dist/` 直接丢给任意静态托管即可：

```sh
pnpm build
```

Vercel、Netlify、Cloudflare Pages、GitHub Pages 都可以，无需额外适配器。如果要用 Vercel 的按需渲染（比如自己加一个接口页），再装 `@astrojs/vercel` 并在 `astro.config.mjs` 里注册。

## 许可

MIT，版权归 [hmilyld.com](https://hmilyld.com) 所有，见 [LICENSE](LICENSE)。

`src/content/` 里的示例文字随你替换；截图来自 [hmilyld.com](https://hmilyld.com)，仅用于展示这套主题的实际效果。字体通过 Fontsource 自托管，遵循各自的 SIL Open Font License。
