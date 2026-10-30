# steelseal design system

**English** · [简体中文](DESIGN.zh-CN.md)

Steel-grey ground, iron-black type, vermilion seal. An interface language for long-form reading.

This document records **why** every number is what it is. Read it before changing anything — most of these conclusions were reached after something broke.

---

## 1. Three principles

1. **Only three colours.** Steel grey for the ground (`--color-ground`), iron black for type (`--color-ink`), vermilion only for the seal (`--color-seal` / `--color-accent`). Vermilion appears no more than twice per screen: the seal, and "you are here".
2. **Structure with rules, not boxes.** Sections are separated by 1px or 2px ink rules, never cards, shadows or rounded containers. The interface has exactly one radius (3px), used only on buttons, code blocks and images.
3. **One width.** Body copy, code, tables and images share one width. Nothing "breaks out". An article has exactly one right edge.

## 2. Colour

| Token                 | Light     | Dark      | Role                                           |
| --------------------- | --------- | --------- | ---------------------------------------------- |
| `--color-ground`      | `#eeede9` | `#1a1c1e` | Page background                                |
| `--color-ink`         | `#26282b` | `#e7e8e5` | Body text and headings                         |
| `--color-soft`        | `#55595d` | `#9aa0a4` | Secondary text (6.0:1 / 6.5:1)                 |
| `--color-faint`       | `#676b6f` | `#8a9095` | Metadata (4.6:1 / 5.3:1)                       |
| `--color-rule`        | `#d4d6d2` | `#303336` | Structural rules                               |
| `--color-rule-strong` | `#b9bcb6` | `#41454a` | Control borders, stronger dividers             |
| `--color-seal`        | `#b23a2e` | `#c0473a` | Seal block (carries only the 40px glyph)       |
| `--color-accent`      | `#b23a2e` | `#e07a6a` | Vermilion when it carries text (5.1:1 / 5.8:1) |

In dark mode vermilion splits into two tokens: the large glyph on the seal block can be darker, while links in body copy must stay bright. Mixing them makes one of the two fail contrast.

**Component colours always come from tokens.** The only exceptions are Shiki's inline comment colour (overridden via `[style*='#6A737D']`, 3.1:1 → 5.7:1), the dark overlay behind the mobile drawer, and the fixed light palette used for print.

## 3. Typography

### Type scale

Twelve steps, no thirteenth:

| Value            | Use                             |
| ---------------- | ------------------------------- |
| 2.5rem / 40px    | Seal glyph                      |
| 2rem / 32px      | Article title                   |
| 1.5rem / 24px    | Page title, section heading     |
| 1.4rem / 22.4px  | Body h2, related-post titles    |
| 1.2rem / 19.2px  | Year heading                    |
| 1.12rem / 17.9px | Body h3                         |
| 1.05rem / 16.8px | Row title (post title in lists) |
| 1rem / 16px      | Body copy                       |
| 0.9rem / 14.4px  | Excerpts, notes                 |
| 0.85rem / 13.6px | Footer, code blocks, tables     |
| 0.8rem / 12.8px  | Metadata (date, reading time)   |
| 0.75rem / 12px   | Micro labels (`.en`, counts)    |

**12px is the floor.** No text that carries information goes below it.

### Measure

`.pane-inner` is 48rem = 768px, which is **48 CJK characters per line** at 16px.

The number was revised repeatedly: first 59 (filling 888px; tiring to read), then 36 (narrow body copy while code stayed full width, leaving an empty 300px band on text-only articles), finally 48 — narrowing the **content area itself** so every element shares one width.

Chinese typography is comfortable at 30–40 characters; 48 is wider, but with 1.75 line-height and enough paragraph spacing it holds up. To go narrower, change two numbers together: `--shell-max` and `.pane-inner`. Otherwise a second right edge appears.

### Tracking

Six values, assigned by role:

| Value  | Used on                                     |
| ------ | ------------------------------------------- |
| 0.01em | Content headings (article title, row title) |
| 0.04em | Metadata (dates, counts)                    |
| 0.06em | Interface headings (section heads, years)   |
| 0.08em | Tags, button labels                         |
| 0.16em | Micro uppercase (`.en` sublabels)           |
| 0.26em | Latin wordmark (`STEELSEAL`)                |

## 4. Layout

```text
┌──────────────┬────────────────────────────┐
│ rail 320px   │ pane                       │
│              │  ┌──────────────────────┐  │
│  seal + name │  │ pane-inner 768px     │  │
│  year index /│  │                      │  │
│  article TOC │  │  prose / code / table│  │
│  page nav    │  │  all the same width  │  │
│  theme/lang  │  └──────────────────────┘  │
└──────────────┴────────────────────────────┘
```

- `--shell-max: 75rem` (1200px) = 320 + 56 + 768 + 56; body copy fills the content area exactly.
- `.pane` is a `100dvh` flex column. On short pages the footer is pushed to the bottom of the viewport, and its divider aligns with the rail's bottom divider. That alignment is hand-tuned: changing the rail's content height means rebalancing `padding-bottom`.
- Breakpoints: 1199 / 1072 / 1024 / 860. 1072 is where the rail narrows; it must come before the gutter breakpoint, otherwise "the wider the viewport, the narrower the text".
- Below 860 the rail becomes a drawer. Its closed state is `visibility: hidden`, so its links leave the tab order completely.

## 5. Components

### Buttons `.btn`

One base class, one modifier. 32px height, 3px radius, 1px `--color-rule-strong` border; hover turns ink, active adds a 7% ink wash.

`.code-copy` and `.search-clear` are deliberate exceptions: one lives inside a dark code block, the other inside an input field — different surfaces.

### Tags `.tag`

One concept, three presentations, sharing colour and hover:

- `.tag--chip`: tag cloud (`/tags`), small bordered blocks
- `.tag`: article metadata, underlined link
- `.tag--static`: inline label, plain text, not interactive

### Rows `.row`

`grid-template-columns: 1fr 10rem`; the right column is the metadata gutter (date, reading time, tags). The first row drops its own top border so it hangs under the year heading.

### Section head `.sect-head`

2px ink underline + 1.5rem title + 0.75rem uppercase sublabel + optional right link. Page-level divisions use 2px, rows use 1px; weight itself carries the hierarchy.

## 6. States

Every interactive element needs:

- **hover**: colour moves toward ink or vermilion, 150ms
- **focus-visible**: 2px vermilion outline, 3px offset (the only place allowed not to follow the element's radius)
- **active**: 7% ink wash (buttons)
- **disabled**: 45% opacity + `not-allowed`

The search field's focus indicator is not on the input but on the whole bottom rule: 1px border + 1px shadow stack into 2px vermilion. A ring around the input looks wrong in this shape.

## 7. Motion

Only two durations: `--dur` 150ms (all hover and press), `--dur-slow` 200ms (theme switch, drawer). Easing is always `ease`.

Under `prefers-reduced-motion`, all transitions and animations are disabled and `scroll-behavior` becomes `auto`; smooth scrolling in JS checks the same media query separately.

## 8. Accessibility

- Contrast: body and secondary text all ≥4.5:1, measured in both themes
- Exactly one exposed `h1` per page (on mobile, the mobile bar's `role="heading"` carries it)
- No skipped heading levels: home is `h1 → h2 Writing → h3 year → h4 post`
- The skip link is the first tab stop
- When the drawer is open, `main` becomes `inert`; focus moves into the rail; Esc closes it and returns focus
- Touch targets ≥24×24 (WCAG 2.5.8); inline text links are exempt per spec

## 9. Things not to do

- Don't add another radius. 2px and 4px were both tried; next to 3px they are just noise.
- Don't add another type size. 0.66 / 0.68 / 0.72 / 0.86 / 0.95 / 0.98 once existed; they were indistinguishable and turned hierarchy into noise.
- Don't nest another `max-width` inside `.prose`. It makes body copy narrower than code blocks and leaves an empty band on the right.
- Don't use `em` for measure. `em` resolves against the element's own font size; 36em on an h2 becomes 806px.
- Don't let anything break out of `.pane-inner`. A second right edge is the easiest way to break this design.
