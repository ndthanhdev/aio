# code-highlighting Specification

## Purpose

Defines how code from MDX content, both fenced code blocks and inline code, looks in the website's light and dark theme modes so it stays readable and fits the page.

## Requirements

### Requirement: Light mode code blocks

In light mode, fenced code blocks SHALL have a light background distinct from the page background and a visible border, so the block stands out from the white page.

#### Scenario: Code block on a light page

- **WHEN** a visitor views a post with a fenced code block in light mode
- **THEN** the block has a light, non-white background with a thin border instead of a near-black background

### Requirement: Light mode syntax contrast

In light mode, plain code text and every syntax token color in code blocks SHALL have a contrast ratio of at least 4.5:1 against the code block background (WCAG AA for normal text).

#### Scenario: Token contrast

- **WHEN** a code block with comments, keywords, strings, numbers and function names is shown in light mode
- **THEN** each of those token colors measures at least 4.5:1 against the block background

### Requirement: Light mode inline code

In light mode, inline code SHALL use the page's primary text color on a subtle tinted background, so it reads as part of the sentence rather than as a dark box.

#### Scenario: Inline code in a paragraph

- **WHEN** a visitor reads a paragraph containing inline code such as `main` in light mode
- **THEN** the inline code shows dark text on a light tint and its text contrast is at least 4.5:1

### Requirement: Dark mode code appearance unchanged

In dark mode, code blocks and inline code SHALL keep the current dark appearance: the Okaidia background and syntax colors.

#### Scenario: Code block on a dark page

- **WHEN** a visitor views a post with a fenced code block in dark mode
- **THEN** the block shows the same dark background and syntax colors as before this change

### Requirement: Code follows theme mode changes

When the visitor switches the theme mode, code blocks and inline code SHALL switch to that mode's appearance immediately, without a page reload.

#### Scenario: Toggle from light to dark

- **WHEN** a visitor viewing a post with code in light mode selects the theme toggle in the header
- **THEN** the code blocks and inline code switch to the dark appearance without the page reloading

#### Scenario: Mode chosen in the settings drawer

- **WHEN** a visitor picks light mode in the settings drawer while reading a handbook page with code
- **THEN** the code switches to the light appearance immediately
