---
name: moon-docker-dev
description: >-
  Containerizes local development for a moonrepo + proto monorepo with Docker
  Compose: a proto-based dev image pinned by .prototools, a bind-mounted
  checkout with dependencies and caches in Docker volumes, worktree-aware host
  ports (A BB CC scheme) with one compose project per git worktree, and moon
  tasks (compose-up / compose-down) to run it detached. Use when the user asks
  to containerize, dockerize, or add docker-compose / Docker local dev to a
  moon or moonrepo repository, or to give dev containers per-worktree ports.
---

# moon + Docker Compose local dev

Sets up `etc/docker/` (or the repo's equivalent tooling folder) so `moon run <tool>:compose-up` starts each app's dev server in a container against the checkout, and several git worktrees can run side by side.

## Gather first

Read these before writing anything:

- `.prototools` and `.moon/workspace.yml` (project globs; every folder matched by a glob becomes a moon project, even without `moon.yml`).
- `.moon/toolchains.yml` and the package manager (Yarn version, `nodeLinker`, `yarnPath`).
- Each app to containerize: its moon project id, dev task (`moon project <id>`), container port, and the folders its dev server writes (build caches, output, nested `node_modules`).
- Where the repo keeps tooling tasks (an existing `scripts`/tool project with zx/tsx scripts). Put the compose tasks there; do not create a moon project just for Docker.
- `id -u` / `id -g` on the host, `docker compose version`, and `git worktree list`.

## Port scheme

Every service publishes only a host port, `A BB CC`:

| Part | Variable         | Value                                                                                     |
| ---- | ---------------- | ----------------------------------------------------------------------------------------- |
| A    | `PORT_PREFIX`    | User digit 1-6, default `1`                                                               |
| BB   | `PORT_WORKTREE`  | `00` in the main checkout; `01`-`99` from a hash of a linked worktree's path; overridable |
| CC   | per-service code | Fixed per service in the compose file: first app `01`, next `02`, ...                     |

Main checkout, first app: `10001`. `BB` also names the compose project (`<repo>-BB`), so each worktree gets its own containers, network, volumes and image. Resolution order for A and BB: shell env, then `etc/docker/.env`, then default. Validate: A is 1-6, BB is two digits, highest port is at most 65535.

## Workflow

```
- [ ] 1. Copy and fill the templates (placeholders below)
- [ ] 2. Wire the compose tasks into the tooling project's moon.yml
- [ ] 3. Git-ignore `.env`; document usage (README + docs)
- [ ] 4. Verify (checklist below)
```

### 1. Templates

Copy from [templates/](templates/) and replace the placeholders:

| Template                                             | Destination                                                                                                                                               |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Dockerfile`, `Dockerfile.dockerignore`              | `etc/docker/`                                                                                                                                             |
| `docker-compose.yml`                                 | `etc/docker/`                                                                                                                                             |
| `env.example`                                        | `etc/docker/.env.example`                                                                                                                                 |
| `compose-env.ts`, `compose-up.ts`, `compose-down.ts` | the tooling project's scripts folder, side by side (for example `etc/scripts/moon-tasks/`); if the helper goes elsewhere, fix the `./compose-env` imports |
| `moon-tasks.yml`                                     | merge into the tooling project's `moon.yml`, adjusting `$projectRoot/moon-tasks/` to the scripts folder                                                   |

Placeholders:

- `__REPO__`: compose project prefix (repo name, lowercase).
- `__APP__`: moon project id and compose service name.
- `__APP_DIR__`: app folder relative to the repo root (for example `apps/site`).
- `__APP_PORT__`: port the dev server listens on inside the container.
- `__SERVICE_CODE__`: the app's two-digit `CC` code.

Adapt per stack:

- Volume mount points: root `node_modules`, `.moon/cache`, the package manager cache, and every folder the app's dev server writes (for Gatsby: `.cache`, `public`, nested `node_modules`). List the same paths in the Dockerfile `mkdir`, the compose `volumes`, and `volumeMountPoints` in `compose-up.ts`.
- The dev server must bind `0.0.0.0`: pass it through moon with `moon run __APP__:dev -- --host 0.0.0.0 --port __APP_PORT__` (adjust flags to the framework) instead of editing the app's task.
- Non-Yarn package managers: drop `YARN_INSTALL_STATE_PATH` and the Yarn cache volume, and install the right tool with proto.
- More apps: add a service per app with the next service code, its own cache volumes, and an entry in `serviceCodes`; print each URL in `compose-up.ts`.

### 2. moon tasks

Both tasks run detached-friendly zx scripts and stay out of CI (`runInCI: false`). `compose-up` uses the `utility` preset because `docker compose up --detach` returns.

### 3. Ignore and docs

Add `.env` to `.gitignore` (the example stays tracked). Document `moon run <tool>:compose-up` / `compose-down`, the port scheme, and the printed logs command.

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

## Verify

Run alongside any existing host dev server or other containers; never stop the user's running containers or dev servers without asking.

- `docker compose -f etc/docker/docker-compose.yml config` renders `<repo>-00` and `1 00 <CC>` by default, and the `.env` / shell overrides change both.
- The port helper returns `00` in the main checkout and `01`-`99` for a linked worktree (call it with that worktree's directory), and rejects `PORT_PREFIX=7`, a one-digit `PORT_WORKTREE`, and ports above 65535.
- `moon run <tool>:compose-up` returns, prints each URL and the logs command; the container runs as the host UID with the `.prototools` versions (`docker exec ... node --version`, `moon --version`).
- The app's main routes return 200 and an unknown URL returns 404; an edit on the host shows up in the container (live reload).
- `git status` shows no unexpected files and `find . -user root` (excluding `node_modules`, `.git`) finds nothing; the host's own dev setup still works.
- `moon run <tool>:compose-down` removes only this worktree's project.
