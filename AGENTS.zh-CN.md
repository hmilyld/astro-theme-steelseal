# AGENTS.md（简体中文）

[English](AGENTS.md) · **简体中文**

给 AI 编码代理（以及第一次接手的人）的项目指南。**动手前先读 [README.zh-CN.md](README.zh-CN.md)；改设计前先读 [DESIGN.zh-CN.md](DESIGN.zh-CN.md)。**

## 项目一句话

`steelseal`（钢印）是一套 Astro 7 静态博客主题：钢板灰底、铁黑字、朱红印，左侧固定索引栏 + 右侧 768px 正文列。没有 UI 框架、没有客户端路由、没有第三方脚本。线上示例：<https://hmilyld.com>。

## 快速事实

| 项目     | 值                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------ |
| 框架     | Astro 7，`output: 'static'`（默认）                                                                          |
| 样式     | Tailwind CSS 4，仅通过 `@tailwindcss/vite` 引入；组件样式写在 `src/styles/global.css` 的 `@layer components` |
| 语言     | TypeScript strict + `.astro`                                                                                 |
| 内容     | Markdown + Astro Content Collections（`glob` loader）                                                        |
| 运行时   | 原生 JS，无 React / Vue / Svelte / 客户端路由                                                                |
| 字体     | Fontsource 自托管：Overpass、Noto Sans SC、JetBrains Mono                                                    |
| 包管理器 | pnpm（npm / yarn 也可）                                                                                      |
| Node     | `>= 22.12.0`                                                                                                 |
| 许可     | MIT，版权归 [hmilyld.com](https://hmilyld.com)                                                               |

## 命令

```sh
pnpm install
pnpm dev           # 本地开发，http://localhost:4321
pnpm build         # 静态构建到 dist/
pnpm preview       # 预览 dist/
pnpm check         # astro check：类型 + 模板
pnpm lint          # eslint（Astro + TS）
pnpm format        # prettier --write
pnpm format:check  # prettier --check
```

没有单元测试。**提交前的门槛是 `pnpm check`、`pnpm lint`、`pnpm format:check`、`pnpm build` 全部通过。**

## 架构地图

| 文件                                        | 职责                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| `astro.config.mjs`                          | `site`、sitemap 过滤、Shiki 主题、Tailwind 插件                          |
| `src/config.ts`                             | 站点身份：站名、拉丁字标、作者、印章字、标语、地点、favicon、社交、导航  |
| `src/content.config.ts`                     | `posts` / `pages` 的 frontmatter schema                                  |
| `src/styles/global.css`                     | 设计 token、全部组件样式、响应式、打印样式                               |
| `src/layouts/BaseLayout.astro`              | HTML 外壳、SEO / OG / JSON-LD、主题、i18n 词典、进度条、代码复制、快捷键 |
| `src/components/SiteRail.astro`             | 左栏：身份、年份索引或文章目录、页面导航、主题 / 语言开关、移动端抽屉    |
| `src/components/Toc.astro`                  | 文章目录 + IntersectionObserver 高亮                                     |
| `src/components/PostRows.astro`             | 复用的文章行列表（首页、标签页、404、相关文章）                          |
| `src/components/PageLayout.astro`           | 静态页布局                                                               |
| `src/components/Seal.astro`                 | 朱红印章                                                                 |
| `src/pages/index.astro`                     | 存档首页、年份分组、筛选框                                               |
| `src/pages/posts/[slug].astro`              | 文章页、上下篇、相关文章、BlogPosting JSON-LD                            |
| `src/pages/[...slug].astro`                 | 由 `src/content/pages/*.md` 生成静态页                                   |
| `src/pages/tags.astro` / `tags/[tag].astro` | 标签云（可索引）与标签详情（`noindex`）                                  |
| `src/pages/search.astro`                    | 本地搜索 UI（`noindex`）                                                 |
| `src/pages/search.json.ts`                  | 构建时搜索索引                                                           |
| `src/pages/rss.xml.ts`                      | RSS                                                                      |
| `src/pages/robots.txt.ts`                   | robots + sitemap 地址                                                    |
| `src/pages/404.astro`                       | 404 + 最近五篇                                                           |
| `src/utils/posts.ts`                        | 可见文章排序、按年分组、标签统计、日期格式化、阅读时长                   |

数据流：

```text
src/content/posts/*.md
  → content.config.ts（schema 校验）
  → utils/posts.ts（过滤 hidden、排序、分组、统计）
  → pages/*.astro
  → BaseLayout.astro（SEO、i18n、主题、脚本）
  → SiteRail.astro（左栏索引 / 目录）
```

## 不可破坏的约束

改任何东西之前，先确认没有踩这几条。它们不是偏好，是这套设计成立的前提。

1. **只有三种颜色。** 所有颜色走 `:root` / `.dark` 里的 token，组件里不写十六进制。例外只有 Shiki 内联的注释色（由 `[style*='#6A737D']` 覆盖）、移动端遮罩的深色叠加、打印样式里的固定浅色。
2. **只有一个圆角（`--radius: 3px`）和两个动效时长（150ms / 200ms）。** 不要加 2px、4px、300ms 这些「差不多」的值。
3. **只有一个内容宽度。** `.pane-inner` 是 `48rem`（768px）；正文、代码、表格、图片共用它。不要在 `.prose` 里再套 `max-width`，不要用 `em` 定义行宽，不要让任何元素突破它——第二条右边缘是这套设计最容易崩的地方。
4. **字号有刻度，12px 是地板。** 不新增 0.66 / 0.72 / 0.86 / 0.95rem 这类视觉上分不出来的档位。
5. **结构靠线，不靠盒子。** 用 1px / 2px 墨线分区，不用卡片、阴影、圆角容器、渐变。2px 用于页面级分区（小节头、文章元信息）以及引用 / 目录的竖线，不要拿它做普通分隔。
6. **无障碍是硬要求。** 每页一个暴露的 `h1`；标题不跳级；焦点必须可见（2px 朱红，3px 偏移）；触摸目标 ≥24×24；抽屉打开时 `main` 为 `inert`，Esc 关闭并归还焦点；`prefers-reduced-motion` 下关闭动效。
7. **i18n 是双份的。** 新增界面文案必须同时加到 `BaseLayout.astro` 的 `zh` 和 `en` 词典；`search.astro` 里动态结果行的文案还有一份自己的小词典，也要同步。`<html lang>` 永远是 `zh-CN`，界面语言用 `data-lang` 驱动。
8. **`hidden: true` 的文章要彻底隐藏。** 不进首页 / 标签 / 搜索索引 / 相关文章 / 上下篇 / sitemap，页面本身照常构建但带 `noindex`。`astro.config.mjs` 的过滤依赖 frontmatter 里 `hidden: true` 单独成行。
9. **日期按 UTC 处理。** `formatDate` / `getUTCFullYear` 是刻意的，避免西半球时区把文章掉到上一年。
10. **保持静态、保持零依赖膨胀。** 不引入 UI 框架、客户端路由、动画库、图标库；能用原生 JS 和 CSS 解决就不要加包。新增依赖需要明确理由。

## 常见任务

### 新增一篇文章

在 `src/content/posts/` 放一个 `.md`，frontmatter 至少要有 `title` 和 `date`：

```md
---
title: 标题
date: 2026-01-12
tags: [设计, 排版]
excerpt: 一句话摘要
slug: optional-custom-slug
hidden: false
---
```

URL 默认取文件名（`slug` 可覆盖）。日期用 `YYYY-MM-DD`。

### 新增一个静态页

在 `src/content/pages/` 放 Markdown，文件名就是路径（`about.md` → `/about`）。需要出现在左栏导航时，同时改 `src/config.ts` 的 `nav` 和 `BaseLayout.astro` 的 i18n 词典。

### 换站点身份

只改 `src/config.ts`。印章字必须是单个汉字；`nav[].key` 必须能在 i18n 词典里找到 `nav.*`。

### 换配色 / 尺寸

改 `src/styles/global.css` 顶部的 `:root` 与 `.dark`。改颜色时连同对比度注释一起更新。改正文宽度时 `--shell-max` 和 `.pane-inner` 的 `48rem` 必须一起动，并重新检查 1072px 断点与左栏底部对齐。

### 新增组件

优先写成 `.astro` 组件，样式加进 `global.css` 的 `@layer components`，不要在组件里写 scoped style 或大段工具类。需要交互时用 `<script>` 里的原生 JS，沿用现有的渐进增强方式（元素在 HTML 里，JS 只增强）。

### 更新 README 截图

截图取自线上站点 <https://hmilyld.com>，放在 `docs/screenshots/`。当前使用：

| 文件              | 页面 / 视口               |
| ----------------- | ------------------------- |
| `home-light.png`  | 首页，1440×900，浅色      |
| `post-dark.png`   | 文章页，1440×1000，暗色   |
| `tags-light.png`  | 标签页，1440×900，浅色    |
| `mobile-home.png` | 首页，390×844 @2x，移动端 |

换图时保持相同文件名与大致视口，README 不用改。

## 验证清单

改完后至少跑一遍：

```sh
pnpm check
pnpm lint
pnpm format:check
pnpm build
```

再手动确认：

- `/`、`/posts/<slug>`、`/tags`、`/tags/<tag>`、`/search`、`/about`、`/404`、`/rss.xml`、`/sitemap-index.xml`、`/robots.txt` 都能打开。
- 浅色 / 暗色 / 跟随系统三种主题都正常，代码块注释色够亮。
- 1440、1200、1072、1024、860、390 宽度下没有横向滚动，也没有第二条右边缘。
- 860 以下抽屉能开、能关、Esc 有效，关闭后 Tab 不会进入隐藏的左栏。
- 键盘 `/` 能聚焦筛选框或搜索框；`Tab` 焦点始终可见。
- 搜索有结果、无结果、索引加载失败三种状态文案正确，中英文都对。
- 隐藏文章不出现在任何列表、搜索索引、RSS、sitemap 中，页面带 `noindex`。
- 构建产物里的 `<title>`、canonical、OG 图、JSON-LD 使用配置的 `site`。

## 代码风格

- Prettier：2 空格、单引号、分号、尾逗号、100 列；`.astro` 用 `prettier-plugin-astro`。
- TypeScript strict；避免 `any`，确实需要时加注释说明。
- 注释用中文，解释**为什么**，不是重复代码在做什么。现有注释里的数字和对比度是实测结果，不要随手删。
- 模板里的事件绑定、i18n 标注沿用现有模式：`data-i18n`、`data-i18n-template`、`data-i18n-aria`、`data-i18n-placeholder`。
- CSS 自定义属性命名沿用 `--color-*`、`--space-*`、`--font-*`、`--dur*`。

## 已知的坑

- **左栏底部对齐是手调的。** `.rail` 的 `padding-bottom` 让栏脚分隔线落在页脚线上；改左栏内容高度后要重新配平。
- **1072px 断点必须早于 gutter 断点。** 顺序反了会出现「视口越宽、正文越窄」。
- **`astro.config.mjs` 的 hidden 过滤是正则读 frontmatter。** 改成 `hidden: true # 注释` 或 `hidden:true` 都会让它失效。
- **搜索页有独立词典。** 只改 `BaseLayout` 会导致动态结果行不翻译。
- **代码复制按钮在运行时包了一层 `.code-block`。** 相关 CSS 选择器依赖这个包裹层。
- **Tailwind preflight 会清掉列表符号**，`.prose` 里已经补回；新增列表样式时注意别被覆盖。
- **打印样式强制浅色 token。** 暗色主题下直接打印不会得到浅字白纸。
- **`site` 必须是真实域名。** 否则 canonical、OG、RSS、sitemap 全部指向 `example.com`。

## 完成标准

- 四项检查全部通过，构建无警告（至少没有新增警告）。
- 新文案中英文齐全。
- 设计规则有变化时，同步更新 `DESIGN.md` / `DESIGN.zh-CN.md` 与 README 的设计段落。
- 不引入不必要的依赖，不破坏静态输出。
- 改动涉及视觉时，附上截图或说明在哪些视口验证过。

## 许可与归属

MIT，版权归 [hmilyld.com](https://hmilyld.com)。示例内容可自由替换；README 截图来自线上站点，仅用于展示主题效果。
