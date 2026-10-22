# Proposal

## Why

The personal website (`apps/app`) only has blog posts, an about page and a projects page. There is no place for longer reference material that is organized by topic rather than by date. A "handbook" tab gives that material a home. This change builds the handbook section and its navigation; the real content is written later.

## What Changes

- Add a **handbook** tab to the site header, next to "about" and "projects", that opens `/handbook`. On phone-width screens all three tabs move into the header's hamburger menu, so the header fits.
- Add a handbook section built from MDX files under `apps/app/content/handbook/`:
  - `/handbook` is the "About this handbook" page.
  - Pages are grouped into three sections, Concepts, How-tos and How it works, served at `/handbook/<section>/<page>`.
  - Each page declares its `title` and its `order` within the section in frontmatter.
- Add a three-column handbook layout:
  - left: a tree that lists "About this handbook" and the three sections with their pages, highlights the current page and shows every section expanded on each page
  - middle: the page content
  - right: an "On this page" tree, styled like the left tree, with the page's h2 headings as top-level items and its h3 headings nested under them. Selecting an item jumps to that heading, and the heading in view is shown as selected
  - when a column doesn't fit, it becomes a tab in a bar fixed to the bottom of the screen: below the large breakpoint an "On this page" tab opens the heading tree in a right drawer, and below the medium breakpoint a "Contents" tab opens the handbook tree in a left drawer
- Give MDX headings stable `id` anchors across the site, so handbook headings can be linked. Blog post headings get ids too, with no visible change.
- Add a Handbook card to the Projects page that links to `/handbook`.
- Ship placeholder pages, "About this handbook" plus two per section, with placeholder headings and "To be written." text, so the navigation can be seen working until the content is written.

## Capabilities

### New Capabilities

- `handbook`: the handbook section of the website: how pages are sourced and routed, the section tree navigation, the "On this page" heading navigation and the responsive layout.
- `site-navigation`: the website's top-level navigation, meaning the header tabs and the entry points to each area of the site, including the new handbook tab.

### Modified Capabilities

None. No specs exist yet.

## Impact

- **Code:** `apps/app/gatsby-node.ts` (handbook page generation), `apps/app/gatsby-config.ts` (heading anchors), new layout, fragments and hooks under `apps/app/src/`, the app header and `use-apps.ts`.
- **Content:** new `apps/app/content/handbook/` tree.
- **Dependencies:** root `package.json` gains `@mui/x-tree-view` `^8.29.3` (the newest major that supports `@mui/material` 5) and `gatsby-remark-autolink-headers` `^6.16.0` (Gatsby 5).
- **Routes:** new `/handbook` and `/handbook/<section>/<page>` pages, which are also added to the sitemap.
- **Blog posts:** headings gain `id` attributes; their rendering doesn't change.
