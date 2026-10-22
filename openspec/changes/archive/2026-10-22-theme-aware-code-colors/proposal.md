# Proposal

## Why

Code on the website always uses Prism's dark Okaidia theme, whatever the site's theme mode. In light mode, code blocks and inline code render as near-black boxes (`#272822` background) on a white page. Inline code is the worst case: short words like `main` become heavy dark patches in the middle of sentences. Code should match the light page while keeping syntax colors readable.

## What Changes

- In light mode, code blocks get a soft light background with a thin border, and their syntax colors come from a palette that meets WCAG AA contrast against that background.
- In light mode, inline code gets a subtle tinted background with the page's normal text color instead of a dark box.
- Dark mode keeps today's Okaidia look for both code blocks and inline code.
- Switching the theme mode with the header toggle or the settings drawer updates code colors immediately, without a reload.
- Applies everywhere MDX code is rendered: blog posts, the CV and handbook pages.

## Capabilities

### New Capabilities

- `code-highlighting`: how code blocks and inline code from MDX content look in each theme mode, including their background, syntax colors and contrast.

### Modified Capabilities

None. The existing `handbook` and `site-navigation` specs don't cover code appearance.

## Impact

- **Code:** `apps/app/src/providers/theme-provider/global-styles.tsx` (theme-dependent Prism styles) and `apps/app/src/providers/mdx-provider/index.tsx` (where the Okaidia stylesheet is imported today).
- **Dependencies:** none. The light palette's colors are defined in the app rather than imported from a package.
- **Content:** none. Existing posts and handbook pages pick up the new colors without changes.
- **Out of scope:** the line-number gutter. `gatsby-remark-prismjs` is configured with `showLineNumbers`, but its stylesheet isn't imported, so no line numbers show today, and that stays unchanged.
