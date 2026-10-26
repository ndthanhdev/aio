---
name: moon-docker-dev
description: >-
  Containerizes local development for a moonrepo + proto monorepo with Docker
  Compose: a proto-based dev image pinned by .prototools, a bind-mounted
  checkout with dependencies and caches in Docker volumes, one compose project
  per git worktree, and portless hostnames (https://<app>.main.<repo>.localhost,
  https://<app>.<worktree>.<repo>.localhost) routed to Docker-assigned ports by
  moon tasks (compose-up / compose-down) that run it detached. Use when the
  user asks to containerize, dockerize, or add docker-compose / Docker local
  dev to a moon or moonrepo repository, or to run dev containers per worktree
  without port conflicts.
---

# moon + Docker Compose local dev

Sets up `etc/docker/` (or the repo's equivalent tooling folder) so `moon run <tool>:compose-up` starts each app's dev server in a container against the checkout, reachable at a stable HTTPS hostname, and several git worktrees can run side by side.

## Gather first

Read these before writing anything:

- `.prototools` and `.moon/workspace.yml` (project globs; every folder matched by a glob becomes a moon project, even without `moon.yml`).
- `.moon/toolchains.yml` and the package manager (Yarn version, `nodeLinker`, `yarnPath`).
- Each app to containerize: its moon project id, dev task (`moon project <id>`), container port, and the folders its dev server writes (build caches, output, nested `node_modules`).
- Where the repo keeps tooling tasks (an existing `scripts`/tool project with zx/tsx scripts). Put the compose tasks there; do not create a moon project just for Docker.
- `id -u` / `id -g` on the host, `docker compose version`, `git worktree list`, and whether a portless proxy already runs (`ps -eo args | grep 'portless proxy'`, `~/.portless/`).

## Routing (portless)

No fixed host ports. Each service publishes `127.0.0.1::<container port>` (Docker picks a free loopback port); `compose-up` reads it with `docker compose port` and registers it with `portless alias <route> <port> --force`. The portless proxy on the host serves the route over HTTPS with its trusted local CA.

| Checkout                       | Compose project | URL                                   |
| ------------------------------ | --------------- | ------------------------------------- |
| main                           | `<repo>-main`   | `https://<app>.main.<repo>.localhost` |
| linked worktree in folder `bk` | `<repo>-bk`     | `https://<app>.bk.<repo>.localhost`   |

The worktree name is `main` when `git rev-parse --git-dir` equals `--git-common-dir`, otherwise the sanitized worktree folder name (stable across branch switches). `WORKTREE` from the shell or `etc/docker/.env` overrides it. portless is a root devDependency, called as `yarn portless ...` from the repo root, so the CLI version is pinned per repo.

## Workflow

```
- [ ] 1. Add portless as a root devDependency (match the host proxy's major/minor)
- [ ] 2. Copy and fill the templates (placeholders below)
- [ ] 3. Wire the compose tasks into the tooling project's moon.yml
- [ ] 4. Git-ignore `.env`; document usage and the proxy prerequisite (README + docs)
- [ ] 5. Verify (checklist below)
```

### 1. portless devDependency

Add `"portless": "^<proxy version>"` to the root `package.json` devDependencies (check the running proxy with `portless --version`, or use the latest if none runs) and `yarn install`. The package has no install scripts, so CI installs are unaffected.

### 2. Templates

Copy from [templates/](templates/) and replace the placeholders:

| Template                                             | Destination                                                                                                                                               |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Dockerfile`, `Dockerfile.dockerignore`              | `etc/docker/`                                                                                                                                             |
| `docker-compose.yml`                                 | `etc/docker/`                                                                                                                                             |
| `env.example`                                        | `etc/docker/.env.example`                                                                                                                                 |
| `compose-env.ts`, `compose-up.ts`, `compose-down.ts` | the tooling project's scripts folder, side by side (for example `etc/scripts/moon-tasks/`); if the helper goes elsewhere, fix the `./compose-env` imports |
| `moon-tasks.yml`                                     | merge into the tooling project's `moon.yml`, adjusting `$projectRoot/moon-tasks/` to the scripts folder                                                   |

Placeholders:

- `__REPO__`: compose project prefix and last route label (repo name, lowercase).
- `__APP__`: moon project id, compose service name and route label.
- `__APP_DIR__`: app folder relative to the repo root (for example `apps/site`).
- `__APP_PORT__`: port the dev server listens on inside the container.

Adapt per stack:

- Volume mount points: root `node_modules`, `.moon/cache`, the package manager cache, and every folder the app's dev server writes (for Gatsby: `.cache`, `public`, nested `node_modules`). List the same paths in the Dockerfile `mkdir`, the compose `volumes`, and `volumeMountPoints` in `compose-up.ts`.
- The dev server must bind `0.0.0.0`: pass it through moon with `moon run __APP__:dev -- --host 0.0.0.0 --port __APP_PORT__` (adjust flags to the framework) instead of editing the app's task.
- Non-Yarn package managers: drop `YARN_INSTALL_STATE_PATH` and the Yarn cache volume, install the right tool with proto, and call portless through that package manager.
- More apps: add a service per app with its own cache volumes and an entry in `services` in `compose-env.ts`; `compose-up` registers and prints every service.
- Raw TCP services (databases): keep the Docker-assigned loopback port and print the connection string instead of a portless route.

### 3. moon tasks

Both tasks run detached-friendly zx scripts and stay out of CI (`runInCI: false`). `compose-up` uses the `utility` preset because `docker compose up --detach` returns.

### 4. Ignore and docs

Add `.env` to `.gitignore` (the example stays tracked). Document `moon run <tool>:compose-up` / `compose-down`, the URLs, and that the portless proxy must run on the host (`yarn portless service install` once, or `yarn portless proxy start`).

## Pitfalls (each one bit a real setup)

- **Root-owned folders on the host**: Docker creates a missing volume mount point inside a bind mount on the host, owned by root. `compose-up` must create every mount point before `docker compose up`; plain `docker compose up` on a fresh clone breaks host tooling.
- **UID 1000 already taken**: `ubuntu:noble` ships user `ubuntu` with UID 1000. Remove it before creating `dev` with the host UID.
- **Versions only from `.prototools`**: install node, the package manager and moon with plain `proto install <tool>` after copying `.prototools`; no per-build version overrides. Install only what the services need (not Rust, Go, Dagger, ...).
- **Shared install state**: Yarn writes `.yarn/install-state.gz` into the checkout; point `YARN_INSTALL_STATE_PATH` into the `node_modules` volume.
- **Build context**: the context is the repo root for `COPY .prototools`; `Dockerfile.dockerignore` (next to the Dockerfile) keeps it to `.prototools` only.
- **Empty YAML mappings**: lint rules may reject `volume_name:`; use `volume_name: {}`.
- **Do not clean a running dev server's cache**: production builds that run a clean step (for example `gatsby clean`) break a dev server using the same folders; that is why caches live in volumes.
- **Branch switches under a running dev server**: switching to a branch that lacks files the server watches can leave it broken (for example a page that stops being a page) even after switching back; restart the dev server.
- **New tool releases**: proto resolves ranges like `moon = "^2"` to the newest tag, which can briefly have no published binaries (404 on install). It resolves itself once the release finishes; do not add overrides for it.
- **git in a linked worktree**: its `.git` is a file pointing at `<main checkout>/.git/worktrees/<name>` by absolute host path, so moon fails with `not a git repository` in the container. Mount the git common dir (`git rev-parse --path-format=absolute --git-common-dir`) at the same path, passed as `GIT_COMMON_DIR`.
- **portless aliases get no automatic worktree label**: that only applies to apps portless starts itself (`portless run`, as a branch prefix); build the route name in the helper.
- **One proxy, many repos**: the repo's portless CLI writes routes the host proxy reads; keep the devDependency on the proxy's major/minor. Hostnames come from the proxy, so read the public URL from `yarn portless list` rather than assuming port 443.
- **Ports change on every recreate**: always re-alias with `--force` after `compose up`; an unclean stop leaves a stale alias (gateway error) until the next `compose-up`.

## Verify

Run alongside any existing host dev server or other containers; never stop the user's running containers, dev servers or proxy without asking.

- `docker compose -f etc/docker/docker-compose.yml config` renders `<repo>-main` and a `127.0.0.1` port with no fixed host port; `WORKTREE=x` renders `<repo>-x`.
- The helper returns `main` in the main checkout and the folder name for a linked worktree (call it with that worktree's directory); overrides are sanitized.
- `moon run <tool>:compose-up` returns, `yarn portless list` shows each route, and it prints the HTTPS URLs and the logs command; the container runs as the host UID with the `.prototools` versions.
- Over HTTPS: main routes return 200 and an unknown URL returns 404; an edit on the host shows up in the container through the proxy (live reload).
- Running `compose-up` again keeps the same URL even though the container's host port changed.
- `compose-up` from a linked worktree starts the service too (moon can run git there) and serves the worktree's URL.
- `git status` shows no unexpected files and `find . -user root` (excluding `node_modules`, `.git`) finds nothing; the host's own dev setup still works.
- `moon run <tool>:compose-down` removes only this worktree's routes and project.
