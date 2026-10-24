# Folder Structure

- `apps/`: Contains all the applications that are developed.
  - `site/`: My personal website.
    - `content/handbook/`: The website's handbook, one folder per section (`concepts/`, `how-tos/`, `how-it-works/`). Each MDX file becomes a page at `/handbook/<section>/<file>`.
- `packages/`: Contains all the `packages` that are used in the `apps` or `packages`.
- `etc/`: Contains everything else grouped by `type`.
  - `docker/`: Docker Compose setup for local development. `moon run scripts:compose-up` starts the `site` service in the background against the checkout, with dependencies and caches in Docker volumes, and prints its URL (`http://localhost:10001` in the main checkout) and logs command. Host ports are built as `A BB CC`: a user digit (`PORT_PREFIX`, default 1), a worktree code (`PORT_WORKTREE`: 00 in the main checkout, 01-99 in a linked worktree, which also gets its own compose project `aio-BB`) and the service code (site 01). Follow the output with `docker compose -f etc/docker/docker-compose.yml -p aio-00 logs -f`; `moon run scripts:compose-down` stops it. Copy `etc/docker/.env.example` to `etc/docker/.env` to change the port parts or the container UID/GID. Tool versions come from `.prototools`.
  - `workflow-runtime/`: Provide runtime and utils to run `etc/scripts/workflows/`.
  - `scripts/`
    - `utils/`: Contains utility modules for reuse in other scripts.
    - `actions/`: Contains scripts that perform small tasks should be able to run independently. Requires `tsx` to be installed
    - `workflows/`: Contains scripts that run a series of `actions` inside `workflow-runtime`
