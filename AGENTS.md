# AGENTS.md

**English** · [简体中文](AGENTS.zh-CN.md)

A guide for AI coding agents (and anyone picking this up for the first time). **Read [README.md](README.md) before touching code; read [DESIGN.md](DESIGN.md) before changing design.**

## One-line project

`steelseal` is a static Astro 7 blog theme: steel-grey ground, iron-black type, vermilion seal, a fixed index rail on the left and a 768px reading column on the right. No UI framework, no client-side router, no third-party scripts. Live example: <https://hmilyld.com>.

## Quick facts

| Item            | Value                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| Framework       | Astro 7, `output: 'static'` (default)                                                                                |
| Styling         | Tailwind CSS 4 via `@tailwindcss/vite` only; component styles live in `@layer components` in `src/styles/global.css` |
| Language        | TypeScript strict + `.astro`                                                                                         |
| Content         | Markdown + Astro Content Collections (`glob` loader)                                                                 |
| Runtime         | Vanilla JS; no React / Vue / Svelte / client-side router                                                             |
| Fonts           | Self-hosted via Fontsource: Overpass, Noto Sans SC, JetBrains Mono                                                   |
| Package manager | pnpm (npm / yarn also work)                                                                                          |
| Node            | `>= 22.12.0`                                                                                                         |
| License         | MIT, copyright [hmilyld.com](https://hmilyld.com)                                                                    |

## Commands

```sh
pnpm install
pnpm dev           # local dev at http://localhost:4321
pnpm build         # static build to dist/
pnpm preview       # preview dist/
pnpm check         # astro check: types + templates
pnpm lint          # eslint (Astro + TS)
pnpm format        # prettier --write
pnpm format:check  # prettier --check
```

There is no unit-test suite. **The gate before committing is all four: `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`.**

## Architecture map

| File                                        | Responsibility                                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `README.md` / `README.zh-CN.md`             | English / Chinese project introduction                                                         |
| `DESIGN.md` / `DESIGN.zh-CN.md`             | English / Chinese design system                                                                |
| `AGENTS.md` / `AGENTS.zh-CN.md`             | English / Chinese agent guide                                                                  |
| `astro.config.mjs`                          | `site`, sitemap filter, Shiki theme, Tailwind plugin                                           |
| `src/config.ts`                             | Site identity: name, Latin wordmark, author, seal glyph, tagline, place, favicon, socials, nav |
| `src/content.config.ts`                     | `posts` / `pages` frontmatter schemas                                                          |
| `src/styles/global.css`                     | Design tokens, all component styles, responsive and print styles                               |
| `src/layouts/BaseLayout.astro`              | HTML shell, SEO / OG / JSON-LD, theme, i18n dictionary, progress bar, code copy, shortcuts     |
| `src/components/SiteRail.astro`             | Rail: identity, year index or article TOC, page nav, theme / language switches, mobile drawer  |
| `src/components/Toc.astro`                  | Article TOC + IntersectionObserver highlighting                                                |
| `src/components/PostRows.astro`             | Reusable post rows (home, tag pages, 404, related posts)                                       |
| `src/components/PageLayout.astro`           | Static page layout                                                                             |
| `src/components/Seal.astro`                 | Vermilion seal                                                                                 |
| `src/pages/index.astro`                     | Archive home, year grouping, filter field                                                      |
| `src/pages/posts/[slug].astro`              | Article page, prev/next, related posts, BlogPosting JSON-LD                                    |
| `src/pages/[...slug].astro`                 | Static pages generated from `src/content/pages/*.md`                                           |
| `src/pages/tags.astro` / `tags/[tag].astro` | Tag cloud (indexable) and tag detail (`noindex`)                                               |
| `src/pages/search.astro`                    | Local search UI (`noindex`)                                                                    |
| `src/pages/search.json.ts`                  | Build-time search index                                                                        |
| `src/pages/rss.xml.ts`                      | RSS                                                                                            |
| `src/pages/robots.txt.ts`                   | robots + sitemap URL                                                                           |
| `src/pages/404.astro`                       | 404 page with five recent posts                                                                |
| `src/utils/posts.ts`                        | Visible-post sorting, year grouping, tag counts, date formatting, reading time                 |

Data flow:

```text
src/content/posts/*.md
  → content.config.ts (schema validation)
  → utils/posts.ts (filter hidden, sort, group, count)
  → pages/*.astro
  → BaseLayout.astro (SEO, i18n, theme, scripts)
  → SiteRail.astro (rail index / TOC)
```

## Non-negotiable constraints

Check these before changing anything. They are not preferences; they are what makes the design hold together.

1. **Only three colours.** Every colour goes through a token in `:root` / `.dark`; components do not contain raw hex values. The only exceptions are Shiki's inline comment colour (overridden via `[style*='#6A737D']`), the dark overlay behind the mobile drawer, and the fixed light palette used for print.
2. **One radius (`--radius: 3px`) and two motion durations (150ms / 200ms).** Do not add 2px, 4px or 300ms as "close enough" values.
3. **One content width.** `.pane-inner` is `48rem` (768px); body copy, code, tables and images all share it. Do not add another `max-width` inside `.prose`, do not define measure in `em`, and do not let anything break out — a second right edge is the easiest way to break this design.
4. **The type scale is fixed and 12px is the floor.** Do not add 0.66 / 0.72 / 0.86 / 0.95rem steps that are visually indistinguishable.
5. **Structure with rules, not boxes.** Use 1px / 2px ink rules; no cards, shadows, rounded containers or gradients. 2px belongs to page-level divisions (section heads, article metadata) and to the vertical rules on blockquotes and the TOC — not to ordinary separators.
6. **Accessibility is a hard requirement.** Exactly one exposed `h1` per page; no skipped heading levels; focus always visible (2px vermilion, 3px offset); touch targets at least 24×24; the drawer sets `main` to `inert`, Esc closes it and returns focus; motion is disabled under `prefers-reduced-motion`.
7. **i18n is duplicated on purpose.** New interface strings must be added to both the `zh` and `en` dictionaries in `BaseLayout.astro`; `search.astro` has its own small dictionary for dynamically rendered result rows, and must be updated too. `<html lang>` always stays `zh-CN`; interface language is driven by `data-lang`.
8. **`hidden: true` posts must disappear completely.** No home, tags, search index, related posts, prev/next or sitemap; the page still builds, with `noindex`. The sitemap filter in `astro.config.mjs` depends on `hidden: true` appearing alone on its line.
9. **Dates are handled in UTC.** `formatDate` / `getUTCFullYear` are deliberate; they keep a post from falling into the previous year in western time zones.
10. **Stay static and keep dependencies lean.** No UI framework, client router, animation library or icon package. If vanilla JS and CSS can do it, do not add a package. New dependencies need a clear reason.

## Common tasks

### Add a post

Drop a `.md` file in `src/content/posts/` with at least `title` and `date`:

```md
---
title: Title
date: 2026-01-12
tags: [design, typography]
excerpt: One-sentence summary
slug: optional-custom-slug
hidden: false
---
```

The URL defaults to the filename; `slug` overrides it. Use `YYYY-MM-DD` dates.

### Add a static page

Drop Markdown in `src/content/pages/`; the filename is the path (`about.md` → `/about`). To put it in the rail navigation, update both `nav` in `src/config.ts` and the i18n dictionary in `BaseLayout.astro`.

### Change site identity

Edit only `src/config.ts`. The seal glyph must be a single CJK character; every `nav[].key` must resolve to a `nav.*` entry in the i18n dictionary.

### Change palette or sizes

Edit `:root` and `.dark` at the top of `src/styles/global.css`. Update the measured contrast comments with any colour change. When changing reading width, `--shell-max` and the `48rem` on `.pane-inner` must move together; re-check the 1072px breakpoint and the rail/footer alignment afterwards.

### Add a component

Prefer an `.astro` component and add styles under `@layer components` in `global.css`. Do not use scoped styles or large blocks of utility classes inside the component. For interaction, use vanilla JS in a `<script>` and follow the existing progressive-enhancement pattern: markup first, JS only enhances it.

### Update README screenshots

Screenshots come from the live site <https://hmilyld.com> and live in `docs/screenshots/`. Current set:

| File              | Page / viewport           |
| ----------------- | ------------------------- |
| `home-light.png`  | Home, 1440×900, light     |
| `post-dark.png`   | Article, 1440×1000, dark  |
| `tags-light.png`  | Tags, 1440×900, light     |
| `mobile-home.png` | Home, 390×844 @2x, mobile |

Keep the same filenames and roughly the same viewports when replacing them; README does not need to change.

## Verification checklist

Run at least:

```sh
pnpm check
pnpm lint
pnpm format:check
pnpm build
```

Then confirm manually:

- `/`, `/posts/<slug>`, `/tags`, `/tags/<tag>`, `/search`, `/about`, `/404`, `/rss.xml`, `/sitemap-index.xml` and `/robots.txt` all load.
- Light, dark and system themes all work; the code comment colour stays readable.
- At 1440, 1200, 1072, 1024, 860 and 390px there is no horizontal scroll and no second right edge.
- Below 860px the drawer opens and closes, Esc works, and Tab does not enter the hidden rail after closing.
- `/` focuses the filter or search field; focus stays visible through every Tab stop.
- Search shows correct copy for results, no results and index-load failure, in both languages.
- Hidden posts appear in no list, search index, RSS feed or sitemap, and their page carries `noindex`.
- Built HTML uses the configured `site` for `<title>`, canonical, OG image and JSON-LD.

## Code style

- Prettier: 2 spaces, single quotes, semicolons, trailing commas, 100 columns; `.astro` uses `prettier-plugin-astro`.
- TypeScript strict; avoid `any` and explain it in a comment when it is unavoidable.
- Comments are in Chinese and explain **why**, not what the code does. The numbers and contrast ratios in existing comments are measurements; do not delete them casually.
- Template event binding and i18n follow the existing attributes: `data-i18n`, `data-i18n-template`, `data-i18n-aria`, `data-i18n-placeholder`.
- CSS custom properties follow the existing names: `--color-*`, `--space-*`, `--font-*`, `--dur*`.

## Known traps

- **Rail/footer alignment is hand-tuned.** The `padding-bottom` on `.rail` makes the rail's bottom rule land on the footer line; rebalance it after changing rail content height.
- **The 1072px breakpoint must come before the gutter breakpoint.** Reversing them produces "the wider the viewport, the narrower the text".
- **The hidden-post filter in `astro.config.mjs` reads frontmatter with a regex.** Changing it to `hidden: true # comment` or `hidden:true` silently breaks the filter.
- **The search page has its own dictionary.** Updating only `BaseLayout` leaves dynamically rendered result rows untranslated.
- **The code-copy button wraps `pre` in `.code-block` at runtime.** CSS selectors depend on that wrapper.
- **Tailwind preflight removes list markers.** `.prose` restores them; be careful not to override that when adding list styles.
- **Print styles force the light palette.** Printing from dark mode does not produce light text on white paper.
- **`site` must be a real domain.** Otherwise canonical, OG, RSS and sitemap all point at `example.com`.

## Definition of done

- All four checks pass, with no new build warnings.
- New copy exists in both Chinese and English.
- If a design rule changes, `DESIGN.md` and the design section of README are updated in both languages.
- No unnecessary dependencies; static output is preserved.
- Visual changes include screenshots or a note saying which viewports were verified.

## License and attribution

MIT, copyright [hmilyld.com](https://hmilyld.com). Demo content can be replaced freely; README screenshots come from the live site and are used only to show the theme in production.
