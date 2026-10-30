# steelseal · 钢印

> 钢板底、铁黑字、朱红印。

一套只为长文阅读存在的 [Astro](https://astro.build) 主题。左边一条固定索引栏，右边一条 48 个汉字宽的正文列；没有卡片、没有阴影、没有弹窗，朱红只用来盖章和标记位置。

- **纯静态**：构建出来是一堆 HTML，可以放在任何地方
- **零框架**：没有 React/Vue，交互全部是几十行原生 JS
- **自带设计系统**：颜色、字号、间距、圆角、动效都有刻度，不是随手写的
- **中英双语界面**：服务端渲染中文，客户端可切换英文（正文不翻译）
- **完整页面**：存档、文章、标签、搜索、404、RSS、sitemap

## 环境

Node >= 22.12，包管理器用 pnpm / npm / yarn 都行（下面以 pnpm 为例）。

## 开始

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # → dist/
pnpm preview    # 预览构建结果
```

上线前把 `astro.config.mjs` 里的 `site` 改成你的域名——canonical、`og:url`、RSS 和 sitemap 都从它来。

## 改成你自己的

只有两个文件需要动：

### 1. `src/config.ts` —— 站点身份

```ts
export const SITE = {
  title: '钢印日记', // 站点名，出现在 <title> 与左栏 h1
  latin: 'STEELSEAL', // 左栏拉丁字标
  description: '……', // meta description
  author: '示例作者',
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

### 2. `src/styles/global.css` —— 设计参数

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

## 写文章

放进 `src/content/posts/`，文件名随意，URL 由 frontmatter 决定。

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

## 路由

| 路径                                            | 说明                                   |
| ----------------------------------------------- | -------------------------------------- |
| `/`                                             | 存档：全部文章按年份分组，带筛选框     |
| `/posts/[slug]`                                 | 文章：左栏目录、阅读进度、文末相关文章 |
| `/tags`、`/tags/[tag]`                          | 标签云与标签页（`noindex`）            |
| `/search`                                       | 本地搜索（`noindex`）                  |
| `/[page]`                                       | `src/content/pages/*.md` 生成的静态页  |
| `/404`                                          | 带最近五篇文章的 404                   |
| `/rss.xml`、`/sitemap-index.xml`、`/robots.txt` | 自动生成                               |

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

## 目录

```text
src/
├── config.ts              # 站点身份
├── content.config.ts      # 内容 schema
├── styles/global.css      # 设计系统（token + 组件 + 响应式）
├── layouts/BaseLayout.astro   # 外壳：SEO、主题、i18n、进度条、复制按钮
├── components/
│   ├── SiteRail.astro     # 左栏：身份、年份索引 / 目录、导航、主题与语言
│   ├── Seal.astro         # 朱红印章
│   ├── Toc.astro          # 文章目录（渲染在左栏里）
│   ├── PostRows.astro     # 行列表（首页、标签页、404、相关文章共用）
│   └── PageLayout.astro   # 静态页布局
├── pages/                 # 路由
├── utils/posts.ts         # 文章排序、分组、标签统计、阅读时长
└── content/               # 文章与页面
```

## 关于这套设计的来龙去脉

`DESIGN.md` 记录了每个决定的理由：为什么行宽是 48、为什么圆角只有一种、为什么字号只有十二档。改之前建议先看一眼，里面写了不少踩过的坑。

## 许可

MIT。内容（`src/content/` 里的示例文字）随你替换。
