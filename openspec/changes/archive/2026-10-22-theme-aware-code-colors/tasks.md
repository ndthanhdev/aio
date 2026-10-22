# Tasks

## 1. Light-mode code styles

- [x] 1.1 In `apps/app/src/providers/theme-provider/global-styles.tsx`, make the Emotion `<Global>` styles a function of the theme. When `theme.palette.mode` is `light`, emit `body`-prefixed overrides:

  - code blocks: `#F6F8FA` background, 1px `#D0D7DE` border, `theme.shape.borderRadius`, base text `#545454`
  - inline code: `theme.palette.text.primary` on `#EFF1F3` with small horizontal padding
  - token groups: the a11y-light colors listed in `design.md`

  In dark mode, emit nothing. Keep the Okaidia import in `apps/app/src/providers/mdx-provider/index.tsx`. Verify with `moon run app:typecheck` and eslint on the changed file.

## 2. Verification

- [x] 2.1 With the dev server in the aio pane running, check the dagger.io post and a handbook page in a browser:

  - In light mode, code blocks have the light background and border, and inline code has dark text on the light tint.
  - Measured on the page, every token color in a code block and the inline code text are at least 4.5:1 against their backgrounds.
  - In dark mode, code blocks and inline code have the same computed background and token colors as before the change.
  - Switching mode with the header toggle and with the settings drawer updates code colors without a reload.

  Verify all checks pass.

- [x] 2.2 Stop the dev server in the aio pane, run `moon run app:build`, and check the light and dark appearance on the served production build the same way. Then restart `moon run app:dev` in the aio pane. Verify the build succeeds, the checks pass, and the dev server is running again.
