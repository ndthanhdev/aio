# Tasks

## 1. Dependencies

- [x] 1.1 Add `"@mui/x-tree-view": "^8.29.3"` and `"gatsby-remark-autolink-headers": "^6.16.0"` to the root `package.json` devDependencies and run `yarn install`. Verify the install finishes without peer dependency errors for `@mui/material`, `@mui/system` or `gatsby`, and that `yarn why @mui/x-tree-view` resolves an 8.x version.

## 2. Heading anchors

- [x] 2.1 Add `gatsby-remark-autolink-headers` with `icon: false` to `gatsbyRemarkPlugins` in `apps/app/gatsby-config.ts`, before `gatsby-remark-prismjs`. Verify in `moon run app:dev` that headings on an existing post (for example the dagger.io post) have `id` attributes, show no anchor icon and look unchanged.

## 3. Handbook data

- [x] 3.1 Create `apps/app/src/utils/handbook.ts` with the section constant (Concepts, How-tos, How it works), `toHandbookPath(contentFilePath)` and a trailing-slash path normalizer. `toHandbookPath` throws for files in unknown section folders. Verify with `moon run app:typecheck`.
- [x] 3.2 Add `onCreateNode` to `apps/app/gatsby-node.ts` that sets `fields.handbookPath` on Mdx nodes under `content/handbook/`, and add the `handbookPages` query (`glob: "**/handbook/**"`, returning `id`, `fields.handbookPath`, `internal.contentFilePath`) to `apps/app/src/utils/queries.ts`. Verify in GraphiQL (`/___graphql` in `moon run app:dev`) that handbook nodes have `fields.handbookPath` and post nodes don't.
- [x] 3.3 Create `apps/app/src/hooks/use-handbook-tree.ts`, a `useStaticQuery` that returns `RichTreeView` items: "About this handbook" leaf first, then sections in constant order, pages sorted by `order` (missing last) then title, with leaf ids set to page paths and section ids set to `section:<id>`. Verify with `moon run app:typecheck` after Gatsby regenerates `src/gatsby-types.d.ts`.

## 4. Navigation components

- [x] 4.1 Create `apps/app/src/components/layouts/handbook/tree-styles.ts` with the shared `RichTreeView` item styles (selection, indentation, typography), and `apps/app/src/components/fragments/handbook-nav/` (`index.tsx`, `styles.ts`) that renders `RichTreeView` with those styles, with `selectedItems` set to the current path and `defaultExpandedItems` set to its section, calls `navigate` for leaf ids only and takes an optional `onNavigate` callback. Verify with `moon run app:typecheck`.
- [x] 4.2 Create `apps/app/src/hooks/use-active-heading.ts`, an `IntersectionObserver` over the given heading ids that returns the id of the topmost heading in view and disconnects on unmount. Verify with `moon run app:typecheck`.
- [x] 4.3 Create `apps/app/src/components/fragments/on-this-page/` (`index.tsx`, `styles.ts`) that takes `tableOfContents.items`, flattens h1 wrappers and renders an "On this page" caption above a `RichTreeView` using the shared tree styles. h2 items are top level with h3 children, item ids are heading ids, every h2 group starts expanded, and `selectedItems` follows `useActiveHeading`. Selecting an item sets `location.hash`, or calls `scrollIntoView()` when the hash already matches. It renders nothing when there are no entries. Verify with `moon run app:typecheck`.

## 5. Handbook layout and pages

- [x] 5.1 Create `apps/app/src/components/layouts/handbook/` (`index.tsx`, `styles.tsx`) with `HandbookTemplate`: header, drawer and footer, then a `Container maxWidth="xl"` grid with a sticky handbook tree column, the content, and a sticky "On this page" tree column shown only at `lg` and up. Below `md` there's a "Contents" button that opens a left `Drawer` with `HandbookNav`, which closes on navigate. Content headings get `scroll-margin-top` equal to the toolbar height. Verify with `moon run app:typecheck`.
- [x] 5.2 Create the page template `apps/app/src/layouts/handbook/index.tsx`, modeled on the post layout, with `AppMDXProvider`, `MyHelmet` title `<title> | Handbook | <site title>`, `useMainTemplateProps()` and the `HandbookTemplate($id)` query selecting `frontmatter { title }` and `tableOfContents(maxDepth: 3)`. Verify with `moon run app:typecheck`.
- [x] 5.3 Add `createHandbook()` to `createPages` in `apps/app/gatsby-node.ts` and create `apps/app/content/handbook/index.mdx` ("About this handbook": what the handbook covers and how its sections are organized). Verify in `moon run app:dev` that `/handbook` renders with the handbook tree, content, "On this page" tree and the expected browser tab title, and that both trees share the same look.

## 6. Starter content and docs

- [x] 6.1 Add the Concepts pages `monorepo-and-moon.mdx`, `mdx-content.mdx` and `theming.mdx` under `apps/app/content/handbook/concepts/`, with `title` and `order` and facts taken from the repo. Verify each page renders at `/handbook/concepts/<file>` and is listed in order in the tree.
- [x] 6.2 Add the How-tos pages `run-locally.mdx`, `add-a-post.mdx` and `add-a-handbook-page.mdx` under `apps/app/content/handbook/how-tos/`. Verify each page renders, and follow `add-a-handbook-page` to add a scratch page, check that it appears in the tree, then delete it.
- [x] 6.3 Add the How it works pages `page-generation.mdx`, `build-and-deploy.mdx` (from `etc/scripts/workflows/` and `.github/workflows/release-*.yml`) and `folder-structure.mdx` (adapted from `docs/how-it-works/folder-structure.md`, which stays in place) under `apps/app/content/handbook/how-it-works/`. Verify each page renders and its "On this page" items scroll to the right headings.
- [x] 6.4 Index the handbook in the repo docs following the `repo-docs` skill: add `content/handbook/` to `docs/how-it-works/folder-structure.md` under `apps/app/`, and update the docs index (`node .agents/skills/repo-docs/scripts/prepare.mjs`, then edit `state/index.md`). Verify the index lists the changed doc.

## 7. Entry points

- [x] 7.1 Add the tab list (about, projects, handbook) in `apps/app/src/utils/site-tabs.ts`. Render it as header `Button`s in `apps/app/src/components/fragments/app-header/index.tsx`, hidden below `sm`, and as a "Pages" section at the top of `apps/app/src/components/fragments/app-drawer/index.tsx`, shown only below `sm`, that closes the drawer on selection. Verify on wide screens that the header shows "about", "projects", "handbook" in that order, that selecting "handbook" navigates without a full reload, and that the drawer shows only settings. At 360px, verify that the header doesn't overflow and shows the brand and all icons, and that the hamburger drawer lists the tabs and navigates and closes.
- [x] 7.2 Add `{ title: "Handbook", description, url: "/handbook" }` to `apps/app/src/hooks/use-apps.ts`. Verify on `/projects` that the Handbook card's open action opens `/handbook` in a new tab and its copy action copies the absolute `/handbook` URL.

## 8. Integration checks

- [x] 8.1 In `moon run app:dev`, check the handbook spec scenarios end to end: a deep link to `/handbook/how-it-works/page-generation` expands that section and selects the page; selecting a section label only toggles it; a `#heading` URL opens at that heading below the app bar; the "On this page" selection follows scrolling; collapsing an h2 group hides its children without scrolling; selecting the already-selected heading after scrolling away scrolls back to it; the right column hides below `lg`; and the "Contents" drawer works and closes on navigation on a phone-sized viewport.
- [x] 8.2 Run `moon run app:build` and eslint on the changed files. Verify both pass and that `public/sitemap-*.xml` includes the handbook routes.

## 9. Floating navigation buttons

- [x] 9.1 In `apps/app/src/components/layouts/handbook/` (`index.tsx`, `styles.tsx`), replace the inline "Contents" button with two fixed MUI `Fab`s. Below `md`, a "Contents" `Fab` at the bottom left opens the left `Drawer` with `HandbookNav`. Below `lg`, an "On this page" `Fab` at the bottom right opens a right `Drawer` with `OnThisPage`, and isn't rendered when the page has no headings. Add an `onSelect` callback to `apps/app/src/components/fragments/on-this-page/index.tsx` so the right drawer closes on selection, and add a spacer after the footer below `lg` so the end of the page scrolls clear of the buttons. Verify with `moon run app:typecheck` and eslint on the changed files.
- [x] 9.2 In `moon run app:dev` and the production build, check the responsive scenarios:

  - at 1400px, no floating buttons
  - at 1100px, only the "On this page" button, and it opens the drawer
  - at 390px, both buttons in their corners
  - the "Contents" drawer navigates and closes
  - the "On this page" drawer opens with the active heading selected, and selecting a heading closes it and leaves that heading just below the app bar with the hash updated
  - a page without headings shows no "On this page" button
  - at the bottom of a page, the last line and the footer are visible above the buttons

  Verify all checks pass.

## 10. Bottom tab bar

- [x] 10.1 In `apps/app/src/components/layouts/handbook/` (`index.tsx`, `styles.tsx`), replace the two `Fab`s with a full-width bottom bar: a fixed `Paper` with a `BottomNavigation` (`showLabels`) holding a "Contents" tab, shown below `md`, and an "On this page" tab, shown below `lg` and only when the page has headings. Visible tabs share the width. `value` highlights the tab whose drawer is open. The bar pads for the bottom safe area and is hidden when no tab applies. Resize the footer spacer to the bar's height. Verify with `moon run app:typecheck` and eslint on the changed files.
- [x] 10.2 In `moon run app:dev` and the production build, check:

  - at 1400px, no bar
  - at 1100px, a full-width bar with only "On this page", which opens its drawer
  - at 390px, both tabs side by side, each half the width
  - at 390px on a page without headings, only "Contents" at full width
  - the "Contents" drawer navigates and closes
  - the "On this page" drawer opens with the active heading selected, and selecting a heading closes it and leaves that heading just below the app bar with the hash updated
  - at the bottom of a page, the last line and the footer are visible above the bar
  - the earlier handbook, header and "On this page" click checks still pass

  Verify all checks pass.

## 11. Placeholder content

- [x] 11.1 In `apps/app/content/handbook/`, delete the nine written pages and rewrite `index.mdx` ("About this handbook") as a placeholder. Add `concepts/concept-1.mdx` and `concept-2.mdx`, `how-tos/how-to-1.mdx` and `how-to-2.mdx`, and `how-it-works/how-it-works-1.mdx` and `how-it-works-2.mdx`, titled "Concept 1", "How-to 2" and so on, with `order` 1 and 2. Every page has a "Section 1" heading with a "Subsection 1.1" under it and a "Section 2" heading, each followed by "To be written.", and no other text. Verify in `moon run app:dev` that each section lists its two pages in order and each page's "On this page" tree shows Section 1 (with Subsection 1.1) and Section 2.
- [x] 11.2 Rerun the handbook, bottom bar, header and "On this page" click checks against the placeholder pages on the dev server and the production build, using the spec's example pages (`concept-1`, `how-it-works-1`, `how-to-1#section-2`). Verify all checks pass, `moon run app:typecheck` and `moon run app:build` succeed, and `public/sitemap-*.xml` lists seven handbook routes.

## 12. Fully expanded trees

- [x] 12.1 In `apps/app/src/components/fragments/handbook-nav/index.tsx`, set `defaultExpandedItems` to every section item id and key the tree by the current path. Key the "On this page" tree by the current path plus its heading ids, passing the path from `HandbookTemplate` to `OnThisPage` in `apps/app/src/components/fragments/on-this-page/index.tsx`. Verify with `moon run app:typecheck` and eslint on the changed files.
- [x] 12.2 On the dev server and the production build, check:

  - opening `/handbook/how-it-works/how-it-works-1` directly shows every section expanded with "How it works 1" selected, in the column and in the phone "Contents" drawer
  - collapsing Concepts and then selecting "How-to 1" shows every section expanded on the new page
  - collapsing "Section 1" in the "On this page" tree and then moving to another page shows that page's "Section 1" expanded
  - the earlier handbook, bottom bar, header and "On this page" click checks still pass

  Verify all checks pass.
