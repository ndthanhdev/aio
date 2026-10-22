# Design

## Context

`apps/app` is a Gatsby 5 site styled with MUI 5.18 and Emotion. Content is MDX processed by `gatsby-plugin-mdx`, sourced from `content/` by `gatsby-source-filesystem`.

- Posts: `gatsby-node.ts` runs the `postPages` query from `src/utils/queries.ts` and calls `createPage` with `src/layouts/post/index.tsx?__contentFilePath=<file>`. Every post must have a valid `nanoId`, otherwise the build throws. The query globs `**/posts/**`, so handbook files are never picked up as posts.
- The header tabs are hard-coded `Button`s using `GatsbyLink` in `src/components/fragments/app-header/index.tsx`.
- Page shells such as `PostTemplate` compose `AppHeader`, `AppDrawer` and `AppFooter`, and get their props from `useMainTemplateProps()`.
- `AppMDXProvider` maps headings to MUI `Typography` and spreads props, so an `id` attribute reaches the DOM. Its `a` mapping always sets `target="_blank"`.
- The app bar is fixed and hides on scroll (`HideOnScroll`), and a spacer `Toolbar` reserves its height.
- No tree view component is installed. The latest `@mui/x-tree-view` (v9) needs MUI 7 or newer. v8 (8.29.3) supports `@mui/material` and `@mui/system` `^5.15.14`.
- The app has no unit test setup. Verification uses `moon run app:typecheck`, `moon run app:build`, eslint and manual checks in `moon run app:dev`.

## Goals / Non-Goals

**Goals:**

- Use the existing MDX page pipeline so a handbook page is just a new MDX file.
- Keep section labels and order in one place in code, and page order in frontmatter.
- Build the handbook tree and the routes from the same data, so they can't disagree.
- Make the handbook tree and the "On this page" tree look and behave alike by using the same component and shared tree styles.

**Non-Goals:**

- Search within the handbook.
- More than one level of folders inside a section.
- Writing handbook content. Pages stay placeholders ("About this handbook" plus two per section, each with "Section 1", "Subsection 1.1" and "Section 2" headings and "To be written." text) until the author writes them.
- Moving `docs/` (the repo-docs knowledge base) into the handbook.
- Upgrading MUI.

## Decisions

### Content layout and routing

Files live at `content/handbook/index.mdx` and `content/handbook/<section>/<file>.mdx`. `onCreateNode` adds `fields.handbookPath` to Mdx nodes whose file path is under `content/handbook/`. The path is computed by `toHandbookPath(contentFilePath)` in a new `src/utils/handbook.ts`, which also exports the section constant `[{ id: "concepts", label: "Concepts" }, { id: "how-tos", label: "How-tos" }, { id: "how-it-works", label: "How it works" }]`. `createHandbook()` in `gatsby-node.ts` queries `handbookPages` (`glob: "**/handbook/**"`) and creates each page at `fields.handbookPath` with `src/layouts/handbook/index.tsx?__contentFilePath=<file>` and `context: { id }`.

A file in an unknown section folder fails the build with a clear error, so a typo can't quietly publish a page that's missing from the tree.

- _Alternative:_ a `slug` field in frontmatter. Rejected because the file path already says where the page belongs, and a second source of truth can drift.
- _Alternative:_ computing the path in both `gatsby-node.ts` and the tree hook. Rejected in favor of one node field that both query.

### Tree data: `useHandbookTree` with `useStaticQuery`

A hook queries every handbook Mdx node (`fields.handbookPath`, `frontmatter.title`, `frontmatter.order`) and builds `RichTreeView` items. "About this handbook" is a top-level leaf, followed by one item per section in the constant's order, whose children are sorted by `order` (a missing `order` sorts last) and then by title. Item ids are the page paths for leaves and `section:<id>` for sections, so the selected item is simply the current pathname, without a trailing slash.

- _Alternative:_ passing the tree through page context from `gatsby-node.ts`. Rejected because that copies the same data into every page's context.

### Tree component: `@mui/x-tree-view` v8 `RichTreeView`

`HandbookNav` renders `RichTreeView` with `items`, `selectedItems={currentPath}` and `defaultExpandedItems` set to every section item id, so all sections start open. It's keyed by the current path, because the page template stays mounted between handbook pages and the tree would otherwise keep a section the visitor collapsed on the previous page. `onSelectedItemsChange` calls Gatsby's `navigate(itemId)` for leaf ids. It's used instead of `onItemSelectionToggle`, which in single-select mode fires twice when the selection moves (a deselect of the old item, then a select of the new one). For section ids it does nothing, because the built-in expansion handles them. It takes an optional `onNavigate` callback, which the mobile drawer uses to close itself.

- _Alternative:_ nested MUI `List` and `Collapse`. Rejected because it needs hand-written expansion state, keyboard navigation and ARIA tree roles, which the tree view already provides.
- `^8.29.3` is pinned because v9 needs MUI 7 or newer.

### Heading anchors: `gatsby-remark-autolink-headers`

The plugin is added to `gatsbyRemarkPlugins` before `gatsby-remark-prismjs`, with `icon: false`, so it adds `id`s only. It and `gatsby-plugin-mdx`'s `tableOfContents` field (from `mdast-util-toc`) both slug headings with `github-slugger`, so the TOC's `#id` links match the rendered ids. Turning off the icon also keeps `AppMDXProvider`'s `a` mapping from wrapping anchors in `target="_blank"` links.

- _Alternative:_ a rehype slug plugin (`rehype-slug`) through `mdxOptions`. Rejected because the site already configures remark plugins through `gatsbyRemarkPlugins`, and the Gatsby plugin is the documented pairing with `tableOfContents`.

### "On this page": `tableOfContents` in a `RichTreeView`, with an IntersectionObserver hook

The handbook page query selects `tableOfContents(maxDepth: 3)`. The top-level item is the page's h1 (if any), so `OnThisPage` flattens h1 wrappers and maps the result to `RichTreeView` items: h2 headings at the top level, h3 headings as children, with item ids set to the heading ids (the TOC `url` without its `#`).

- `defaultExpandedItems` is every h2 item that has children, so the whole outline shows by default. The tree is keyed by the current path plus its heading ids, so every page starts fully expanded. Heading ids alone aren't enough: pages with the same headings would keep a group collapsed on the previous page.
- `expansionTrigger="iconContainer"`: clicking a label selects the heading, and only the chevron expands or collapses. Selection events whose target is inside the chevron are ignored, because the tree also selects on chevron clicks.
- `useActiveHeading(ids, topOffset)` watches the heading elements with an `IntersectionObserver`. The active band runs from `topOffset` (the same 80px offset used for sticky columns and `scroll-margin-top`) to the top third of the viewport, so a jumped-to heading is active and the heading above it, hidden behind the app bar, isn't. It returns the topmost heading in the band, or the last heading above it.
- `selectedItems` is the clicked heading until the active heading next changes, then the active heading. Headings near the end of a page can't scroll into the band, so without this a click there would leave an earlier heading selected.
- `onSelectedItemsChange` sets `window.location.hash` to the item id (see Risks for clicks on the heading that's already selected). The browser then scrolls to the heading (respecting `scroll-margin-top`), the hash updates, and the observer moves the selection.
- Both trees use the same item styles from a shared `tree-styles.ts` next to the handbook layout, so selection, indentation and typography match.

- _Alternative:_ an indented list of `<a href="#id">` links with a left-border highlight. Rejected so the two columns look and behave the same.

Handbook content headings get `scroll-margin-top` equal to the toolbar height (`theme.mixins.toolbar`), so a jump doesn't put the heading under the app bar.

### Layout: `HandbookTemplate`

`src/components/layouts/handbook/` composes `AppHeader`, `AppDrawer` and `AppFooter`, like `PostTemplate`, around a `Container maxWidth="xl"` laid out as a CSS grid:

- `lg` and up: `260px minmax(0, 1fr) 220px`, with the tree and "On this page" columns `position: sticky`
- `md` to `lg`: `260px minmax(0, 1fr)`, with "On this page" hidden
- below `md`: one column

Hidden columns become tabs in a bottom bar: an MUI `BottomNavigation` with `showLabels`, inside a `Paper` fixed across the bottom of the viewport. Each tab is a `BottomNavigationAction` that opens a `Drawer` on its own side:

- below `md`: a "Contents" tab, opening a left `Drawer` with `HandbookNav`.
- below `lg`: an "On this page" tab, opening a right `Drawer` with `OnThisPage`. It isn't rendered when the page has no headings.
- Tabs that don't apply are `display: none`, and the visible ones share the bar's width because `BottomNavigationAction` is `flex: 1`. The bar itself is hidden at `lg` and up, and between `md` and `lg` on pages without headings, so it never shows empty.
- `BottomNavigation`'s `value` is the tab whose drawer is open, so that tab is highlighted while its drawer shows.
- The `Paper` adds `env(safe-area-inset-bottom)` as bottom padding, so the bar clears the home indicator on phones without a home button. Its `z-index` is the app bar's, below the drawers.
- The page template converts `tableOfContents` once with `toHeadingItems` and passes the heading items to `HandbookTemplate`, which renders `OnThisPage` in the column and in the drawer, and uses the item count to decide whether to show the "On this page" tab.
- `OnThisPage` takes an optional `onSelect(scrollToHeading)` callback. The right drawer stores the scroll, closes, and runs the scroll from the `Slide`'s `onExited`, so the drawer's scroll lock and focus restore are finished before the page moves. The drawer's instance mounts when it opens and runs its own `useActiveHeading`, so it opens with the active heading selected.
- While the bar shows, a spacer after the footer as tall as the bar plus the safe area lets the last line of content and the footer scroll clear of it. Padding on the article alone wouldn't keep the footer clear.

- _Alternative:_ inline buttons above the content. Rejected because they scroll away, so a reader deep in a page would have to scroll back up to navigate.
- _Alternative:_ floating action buttons in the bottom corners. Replaced by the bar: two extended buttons fill most of a phone's width anyway, and a bar reads as navigation, has larger touch targets and covers content along one predictable edge.

The page template `src/layouts/handbook/index.tsx` follows `src/layouts/post/index.tsx`: it uses `AppMDXProvider`, sets `MyHelmet` to `<title> | Handbook | <site title>`, calls `useMainTemplateProps()` and runs the `HandbookTemplate($id)` page query.

### Entry points

- The tabs (about, projects, handbook) are one list in `src/utils/site-tabs.ts`. `AppHeader` renders them as `Button`s, hidden below `sm`. Below `sm`, `AppDrawer` (the menu opened by the header's hamburger button) renders the same list as a "Pages" section above the settings, and closes after a selection. The left side of the header needs about 455px for the brand and three tabs, and the icons another 144px, so smaller buttons alone couldn't fit a 360px screen.
- `use-apps.ts` gets `{ title: "Handbook", description, url: "/handbook" }`. `ProjectCard` already handles internal URLs with `GatsbyLink` and opens them in a new tab, like the Wasm Counter card.

## Risks / Trade-offs

- [Heading ids change post DOM] → Ids are added without icons and without style changes. Spot-check an existing post during verification.
- [Slug mismatch between TOC links and heading ids] → Both use `github-slugger`. Verification checks that every "On this page" item scrolls to its heading.
- [Tree items aren't real links, so you can't right-click one to copy a heading URL] → After selecting an item, the address bar hash gives the heading link, and headings keep their ids for sharing.
- [Selecting the item that's already selected does nothing visible: setting `location.hash` to its current value doesn't scroll, and the tree reports the click as a change to `null`] → A `null` selection scrolls to the currently selected heading. When the hash already equals the target id, the handler calls `scrollIntoView()` on the heading instead of setting the hash.
- [Gatsby adds trailing slashes, or not, depending on the `trailingSlash` setting] → The current path is normalized by stripping a trailing slash before it's compared with item ids.
- [The bottom bar takes 56px of a phone's height] → It's the same height as a phone's own tab bars, and the spacer below the footer lets the end of the page scroll clear of it.
- [Closing the right drawer and scrolling at the same time could fight over the scroll position, because MUI locks page scroll while the drawer is open and restores focus to the tab when it closes] → The drawer closes first, and the hash is set after its exit transition. Verification checks that the page ends at the selected heading.
- [A section or heading group the visitor collapses reopens on the next page] → Intended: every page starts with the full outline visible. Remounting a tree per page also resets its scroll position, which is acceptable because the trees are short.
- [Tabs are one tap further away on phones] → The hamburger button is always visible in the header, and the drawer lists the pages first.
- [`@mui/x-tree-view` v8 gets no new features] → Acceptable while the app is on MUI 5. Upgrade it together with MUI later.
- [Gatsby's `useStaticQuery` result is bundled into every page that renders the tree] → The handbook is small (about ten pages), so this costs very little.

## Migration Plan

This only adds things: new routes, content and dependencies. Deploy through the existing release workflows. Rolling back means reverting the change; no data or URLs that already exist are affected.
