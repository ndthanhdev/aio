# handbook Specification

## Purpose

Provides a topic-organized handbook on the personal website, with pages grouped into sections, a section tree for moving between pages and an "On this page" heading tree for moving within a page.

## Requirements

### Requirement: Handbook pages are sourced from content files

The system SHALL publish one handbook page for every MDX file under the handbook content folder. Each file SHALL provide a `title` and MAY provide an `order` in its frontmatter. Handbook files SHALL NOT require the `nanoId` that blog posts require.

#### Scenario: New content file becomes a page

- **WHEN** an author adds `content/handbook/how-tos/deploy.mdx` with a `title` and rebuilds the site
- **THEN** the site serves that page and lists it in the handbook tree

#### Scenario: Handbook file without nanoId

- **WHEN** a handbook file has no `nanoId` in its frontmatter
- **THEN** the build succeeds and the page is published

### Requirement: Handbook routes follow the content layout

The handbook root file SHALL be served at `/handbook` as "About this handbook". A file in a section folder SHALL be served at `/handbook/<section>/<file-name>`, where `<section>` is one of `concepts`, `how-tos` or `how-it-works`.

#### Scenario: Handbook root

- **WHEN** a visitor opens `/handbook`
- **THEN** the "About this handbook" page is shown

#### Scenario: Section page

- **WHEN** a visitor opens `/handbook/concepts/concept-1`
- **THEN** the page from `content/handbook/concepts/concept-1.mdx` is shown

### Requirement: Handbook tree navigation

Every handbook page SHALL show a tree with "About this handbook" followed by the sections Concepts, How-tos and How it works, in that order. Each section SHALL list its pages sorted by `order`, then by title. Selecting a page in the tree SHALL navigate to it; selecting a section SHALL only expand or collapse it.

#### Scenario: Navigate from the tree

- **WHEN** a visitor selects "Concept 1" under Concepts in the tree
- **THEN** the browser navigates to `/handbook/concepts/concept-1`

#### Scenario: Section toggles without navigating

- **WHEN** a visitor selects the "How-tos" section label
- **THEN** the section expands or collapses and the current page doesn't change

#### Scenario: Page ordering

- **WHEN** a section has pages with `order` 2 and `order` 1
- **THEN** the page with `order` 1 is listed first

### Requirement: Current page is indicated in the tree

The tree SHALL mark the current page as selected. Every section SHALL be expanded whenever a page is shown, including after navigating from the tree. A section the visitor collapses SHALL stay collapsed only until the next page is shown.

#### Scenario: Deep link

- **WHEN** a visitor opens `/handbook/how-it-works/how-it-works-1` directly
- **THEN** every section is expanded and "How it works 1" is marked as selected

#### Scenario: Collapsed section reopens on the next page

- **WHEN** a visitor collapses the Concepts section, then selects "How-to 1" in the tree
- **THEN** the How-to 1 page is shown with every section expanded

### Requirement: On this page heading tree

Each handbook page SHALL show an "On this page" tree, styled like the handbook tree, with level 2 headings as top-level items and level 3 headings as their children. Every level 2 group SHALL be expanded whenever a page is shown, including after navigating between pages. Selecting an item SHALL scroll to its heading in the same tab. Expanding or collapsing a group SHALL NOT scroll. A page without such headings SHALL NOT show the tree.

#### Scenario: Jump to a heading

- **WHEN** a visitor selects a heading in the "On this page" tree
- **THEN** the page scrolls in the same tab so the heading is visible below the app bar, and the URL hash changes to that heading's id

#### Scenario: Collapse a group

- **WHEN** a visitor collapses a level 2 item that has level 3 children
- **THEN** its children are hidden and the page doesn't scroll

#### Scenario: Collapsed group reopens on another page

- **WHEN** a visitor collapses "Section 1" in the "On this page" tree, then moves to another page that also has a "Section 1" heading with children
- **THEN** that page's "Section 1" group is expanded

#### Scenario: Page without headings

- **WHEN** a handbook page has no level 2 or level 3 headings
- **THEN** no "On this page" tree is rendered

### Requirement: Active heading is highlighted

While a visitor scrolls a handbook page, the "On this page" tree SHALL mark the item for the topmost heading currently in view as selected, the same way the handbook tree marks the current page.

#### Scenario: Scrolling past a heading

- **WHEN** a visitor scrolls until the "Section 2" heading is the topmost visible heading
- **THEN** the "Section 2" item is marked as selected and no other item is

### Requirement: Content headings have stable anchors

Headings rendered from MDX content anywhere on the site SHALL have an `id` derived from the heading text, so a URL with that hash opens at the heading. The anchors SHALL NOT add visible icons or change how headings look.

#### Scenario: Shared heading link

- **WHEN** a visitor opens `/handbook/how-tos/how-to-1#section-2`
- **THEN** the page opens scrolled to the "Section 2" heading

#### Scenario: Blog post appearance unchanged

- **WHEN** a visitor opens an existing blog post
- **THEN** its headings look the same as before

### Requirement: Responsive handbook layout

On large screens the handbook SHALL show the handbook tree, the content and the "On this page" tree side by side. Below the large breakpoint the "On this page" column SHALL be hidden, and below the medium breakpoint the handbook tree column SHALL be hidden. Each hidden column SHALL be reachable from a tab in a bar fixed to the bottom of the viewport, as the following requirements describe.

#### Scenario: Large screen

- **WHEN** the viewport is at least the large breakpoint
- **THEN** both trees and the content are shown side by side and no bottom bar is shown

#### Scenario: Medium screen

- **WHEN** the viewport is narrower than the large breakpoint but at least the medium breakpoint
- **THEN** the handbook tree and the content are shown, the "On this page" column is hidden and the bottom bar shows only the "On this page" tab

#### Scenario: Small screen

- **WHEN** the viewport is narrower than the medium breakpoint
- **THEN** only the content is shown, with a bottom bar holding the "Contents" tab on the left and the "On this page" tab on the right, each taking half of the bar's width

### Requirement: Bottom bar

While at least one of its tabs applies, a bar SHALL stay fixed across the full width of the bottom of the viewport. Its visible tabs SHALL share the bar's width equally. The bar SHALL keep clear of the device's bottom safe area, and SHALL NOT be shown when no tab applies.

#### Scenario: Bar on a phone

- **WHEN** a handbook page with headings is shown on a phone-sized screen
- **THEN** a full-width bar is fixed at the bottom with the "Contents" and "On this page" tabs side by side

#### Scenario: No bar on large screens

- **WHEN** the viewport is at least the large breakpoint
- **THEN** no bottom bar is rendered visibly

### Requirement: Contents tab

While the handbook tree column is hidden, the bottom bar SHALL show a "Contents" tab. Selecting it SHALL open the handbook tree in a drawer from the left. Selecting a page in the drawer SHALL navigate to it and close the drawer.

#### Scenario: Navigate from the Contents drawer

- **WHEN** a visitor on a phone-sized screen taps the "Contents" tab and selects a page
- **THEN** the drawer opens showing the handbook tree, then closes and the selected page is shown

### Requirement: On this page tab

While the "On this page" column is hidden and the page has level 2 or level 3 headings, the bottom bar SHALL show an "On this page" tab. Selecting it SHALL open the "On this page" tree in a drawer from the right, with the active heading selected. Selecting a heading in the drawer SHALL close the drawer and scroll to that heading.

#### Scenario: Jump to a heading from the drawer

- **WHEN** a visitor on a phone-sized screen taps the "On this page" tab and selects a heading
- **THEN** the drawer closes, the page scrolls so the heading is visible below the app bar, and the URL hash changes to that heading's id

#### Scenario: Drawer shows the active heading

- **WHEN** a visitor scrolls until the "Section 2" heading is active, then taps the "On this page" tab
- **THEN** the drawer opens with "Section 2" selected

#### Scenario: Page without headings on a small screen

- **WHEN** a handbook page with no level 2 or level 3 headings is shown on a phone-sized screen
- **THEN** the bottom bar shows only the "Contents" tab, at the bar's full width

### Requirement: Bottom bar doesn't hide content

The bottom bar SHALL NOT permanently cover page content: the end of the page SHALL leave enough space below the last content for the bar.

#### Scenario: Reading the end of a page

- **WHEN** a visitor on a phone-sized screen scrolls to the bottom of a handbook page
- **THEN** the last line of content and the footer are fully visible above the bottom bar

### Requirement: Handbook page titles

Each handbook page SHALL set the document title to `<page title> | Handbook | <site title>`.

#### Scenario: Browser tab title

- **WHEN** a visitor opens the Concept 1 page
- **THEN** the browser tab title is "Concept 1 | Handbook | ndthanhdev"
