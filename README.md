[![Release Dev](https://github.com/ndthanhdev/aio/actions/workflows/release-dev.yml/badge.svg)](https://github.com/ndthanhdev/aio/actions/workflows/release-dev.yml)
[![Release Stg](https://github.com/ndthanhdev/aio/actions/workflows/release-stg.yml/badge.svg)](https://github.com/ndthanhdev/aio/actions/workflows/release-stg.yml)
[![Release Prod](https://github.com/ndthanhdev/aio/actions/workflows/release-prod.yml/badge.svg)](https://github.com/ndthanhdev/aio/actions/workflows/release-prod.yml)

Welcome to my personal website repository! This repository contains the source code and content for my personal website, where I share posts on tech and life and experiment with various technologies.

- [Website URL](#website-url)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)

## Website URL

Visit [https://ndthanhdev.github.io](https://ndthanhdev.github.io) to see the website live. Other environments are also available:

- [Staging](https://stg-n8v.github.io/)
- [Development](https://dev-n8v.github.io/)

## Technologies Used

- **Frontend**: TypeScript, React, Gatsby, EmotionJS, MDX
- **Hosting**: GitHub Pages
- **Tools**: ESLint, Prettier, Dagger, MoonRepo

## Getting Started

1. Install [proto](https://moonrepo.dev/docs/proto/install)
2. Clone this repository
3. Inside the repo, run `proto use` to lift up the development environment
4. Run `moon site:dev` to start the development server, or `moon run scripts:compose-up` to run it in Docker in the background at `https://site.main.aio.localhost` instead (needs the [portless](https://portless.sh) proxy; start it once with `yarn portless service install`)
5. Visit [docs](./docs) for more information
