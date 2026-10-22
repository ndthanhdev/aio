# site-navigation Specification

## Purpose

Defines the personal website's top-level navigation: the header tabs and the other entry points that lead visitors to each area of the site.

## Requirements

### Requirement: Header tabs

On screens at least as wide as the small breakpoint, the site header SHALL show the brand link to `/` followed by the tabs "about", "projects" and "handbook", in that order, on every page that uses the main header. Each tab SHALL navigate within the site without a full page reload.

#### Scenario: Open the handbook from the header

- **WHEN** a visitor selects the "handbook" tab in the header
- **THEN** the browser navigates to `/handbook`

#### Scenario: Tab order

- **WHEN** any page with the site header is shown on a screen at least as wide as the small breakpoint
- **THEN** the tabs read "about", "projects", "handbook" from left to right

#### Scenario: Header on handbook pages

- **WHEN** a visitor is on any handbook page
- **THEN** the same header with the same tabs is shown

### Requirement: Tabs in the hamburger menu on phones

On screens narrower than the small breakpoint, the header SHALL hide the tabs and the header's menu button SHALL open a menu that lists "about", "projects" and "handbook", in that order, above the settings. Selecting one SHALL navigate within the site and close the menu. The header SHALL fit the screen width without horizontal overflow.

#### Scenario: Navigate from the hamburger menu

- **WHEN** a visitor on a 360px-wide screen opens the menu and selects "handbook"
- **THEN** the browser navigates to `/handbook` and the menu closes

#### Scenario: Header fits on a phone

- **WHEN** any page with the site header is shown on a 360px-wide screen
- **THEN** the brand and the header's icon buttons are fully visible and the tabs aren't shown in the header

#### Scenario: Wider screens keep tabs in the header

- **WHEN** a visitor opens the menu on a screen at least as wide as the small breakpoint
- **THEN** the menu shows only the settings, because the tabs are in the header

### Requirement: Handbook listed on the Projects page

The Projects page SHALL include a "Handbook" card with a short description whose open and copy actions behave like the other project cards, using the `/handbook` URL.

#### Scenario: Open the handbook from Projects

- **WHEN** a visitor selects the "Handbook" card's open action on `/projects`
- **THEN** `/handbook` opens in a new tab, as other project links do

#### Scenario: Copy the handbook link

- **WHEN** a visitor selects the "Handbook" card's copy action
- **THEN** the absolute URL of `/handbook` on the current origin is copied
