# Folder Structure

- `apps/`: Contains all the applications that are developed.
  - `site/`: My personal website.
    - `content/handbook/`: The website's handbook, one folder per section (`concepts/`, `how-tos/`, `how-it-works/`). Each MDX file becomes a page at `/handbook/<section>/<file>`.
- `packages/`: Contains all the `packages` that are used in the `apps` or `packages`.
- `etc/`: Contains everything else grouped by `type`.
  - `docker/`: Docker Compose setup for local development. `moon run scripts:compose-up` starts the `site` service in the background against the checkout, with dependencies and caches in Docker volumes, and prints its URL and logs command. Services publish a loopback port Docker picks, and the task routes a [portless](https://portless.sh) hostname to it: `https://site.aio.localhost` in the main checkout, `https://<folder>.site.aio.localhost` in a linked worktree, which also gets its own compose project (`aio-main`, `aio-<folder>`). This needs the portless proxy running on the host; start it once with `yarn portless service install` (or `yarn portless proxy start`). `moon run scripts:compose-down` removes the routes and stops the containers. Copy `etc/docker/.env.example` to `etc/docker/.env` to override the worktree name or the container UID/GID. Tool versions come from `.prototools`.
  - `workflow-runtime/`: Provide runtime and utils to run `etc/scripts/workflows/`.
  - `scripts/`
    - `utils/`: Contains utility modules for reuse in other scripts.
    - `actions/`: Contains scripts that perform small tasks should be able to run independently. Requires `tsx` to be installed
    - `workflows/`: Contains scripts that run a series of `actions` inside `workflow-runtime`
