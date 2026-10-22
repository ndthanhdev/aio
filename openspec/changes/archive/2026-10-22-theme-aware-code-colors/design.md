# Design

## Context

- `gatsby-remark-prismjs` turns fenced code into `div.gatsby-highlight > pre[class*="language-"] > code` with `.token.*` spans, and inline code into `code.language-text` (inline highlighting is on). It also adds a `line-numbers` class because `showLineNumbers` is set, but the line-number stylesheet isn't imported.
- `apps/app/src/providers/mdx-provider/index.tsx` imports `prismjs/themes/prism-okaidia.css` globally. Its selectors are plain (`pre[class*="language-"]`, `:not(pre) > code[class*="language-"]`, `.token.keyword`, …) with a `#272822` background.
- The theme mode lives in the zustand store `use-theme-mode-store`. `AppThemeProvider` passes the matching MUI theme to MUI's and Emotion's theme providers, and renders `GlobalStyles` (`CssBaseline` plus an empty Emotion `<Global>`) inside them. A mode switch re-renders everything under the provider with the new theme.
- Contrast was computed for Eric Bailey's a11y-light palette (WCAG AA, published for `#FEFEFE`) against `#F6F8FA`. All tokens stay at or above 4.5:1: text 7.11, comment 9.19, blue 5.13, cyan 4.52, green 4.83, gray 5.16, orange 4.66, purple 6.16, red 4.75, yellow 5.10.

## Goals / Non-Goals

**Goals:**

- Light-mode code that fits the light page, with AA contrast for every token.
- One source of truth for when light or dark code styles apply: the app's theme mode, not the OS `prefers-color-scheme`.

**Non-Goals:**

- Changing dark-mode colors.
- Line numbers, line highlighting, copy buttons or other Prism plugins.
- Changing code font, size or block spacing beyond what the background and border need.

## Decisions

### Keep Okaidia as the base and dark theme; add light-mode overrides through Emotion `<Global>`

The Okaidia import stays. It provides layout (padding, overflow, tab size, font) and the dark colors. `GlobalStyles` reads the theme and, only when `theme.palette.mode === "light"`, emits overrides for the code block background and border, inline code, and each `.token` group.

- The overrides are prefixed with `body` (for example `body pre[class*="language-"]` and `body .token.keyword`). That adds specificity, so they win over Okaidia whatever order Gatsby's CSS and Emotion's style tags end up in.
- In dark mode nothing is emitted, so dark mode looks exactly as before.
- Because `GlobalStyles` re-renders on theme change, switching modes swaps the overrides immediately.

- _Alternative:_ replace Okaidia with one custom stylesheet driven by CSS custom properties, with values switched by a class on `<html>`. Rejected for now: it means rewriting the whole Okaidia theme to change only light mode, plus wiring a root class to the zustand store.
- _Alternative:_ the `a11y-syntax-highlighting` package's `a11y-light-on-light-dark-on-dark.css`. Rejected: it switches on the OS `prefers-color-scheme`, not the site's own toggle, and its dark palette would change dark mode.

### Light palette: a11y-light token colors on a soft grey block

- Block background `#F6F8FA` with a 1px `#D0D7DE` border. `#FEFEFE` would be indistinguishable from the white page.
- Base text `#545454`; comments, prolog, doctype and cdata `#802200`; punctuation `#545454`; properties, tags, constants, symbols and deleted `#D91E18`; booleans and numbers `#9400D3`; selectors, attribute names, strings, chars, builtins and inserted `#008000`; operators, entities, URLs and variables `#856514`; at-rules, attribute values and functions `#326BAD`; keywords `#1F7C93`; regex and important `#A85D00`; class names `#326BAD`. The Okaidia mapping of token groups is kept, so only the colors change.
- Block `border-radius` uses `theme.shape.borderRadius` to match MUI surfaces.

### Inline code in light mode

Inline code uses `theme.palette.text.primary` on a light grey tint `#EFF1F3` (about 14:1 text contrast) with small horizontal padding and the theme radius. It stays visibly different from surrounding text without becoming a dark block.

## Risks / Trade-offs

- [Cyan keywords sit at 4.52:1, just above the 4.5:1 minimum] → The verification task measures every token on the rendered page. If a value drifts below 4.5, darken that token slightly.
- [Override specificity depends on the `body` prefix] → If a later Prism stylesheet uses more specific selectors, the overrides could lose. Verification checks computed styles in light mode after the change.
- [Mode flash on first load] → The site already rehydrates the stored mode after mount, so pages render in light mode first. Code colors follow the same timing as the rest of the page, so this change doesn't make it worse.
- [The palette is copied rather than imported] → About a dozen hex values in one place, with their source and contrast results recorded in this design.

## Migration Plan

Styling only: no content, routes or data change. It ships with the normal release. Rolling back means reverting the change.
