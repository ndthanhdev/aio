# Folder Structure

- `apps/`: Contains all the applications that are developed.
  - `app/`: My personal website.
    - `content/handbook/`: The website's handbook, one folder per section (`concepts/`, `how-tos/`, `how-it-works/`). Each MDX file becomes a page at `/handbook/<section>/<file>`.
- `packages/`: Contains all the `packages` that are used in the `apps` or `packages`.
- `etc/`: Contains everything else grouped by `type`.
  - `workflow-runtime/`: Provide runtime and utils to run `etc/scripts/workflows/`.
  - `scripts/`
    - `utils/`: Contains utility modules for reuse in other scripts.
    - `actions/`: Contains scripts that perform small tasks should be able to run independently. Requires `tsx` to be installed
    - `workflows/`: Contains scripts that run a series of `actions` inside `workflow-runtime`
