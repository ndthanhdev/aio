const buildNumber = process.env.GATSBY_BUILD_NUMBER ?? "local";
const rev = process.env.GATSBY_REV ?? "local";
const mode = process.env.GATSBY_MODE ?? "local";

export const envs = { buildNumber, mode, rev };
