#!/usr/bin/env -S yarn dlx tsx
import "zx/globals";

import { getComposeEnv, getComposeFile, getRepoRoot } from "./compose-env";

$.verbose = true;

const repoRoot = await getRepoRoot();
const composeEnv = await getComposeEnv(repoRoot);

await $({
	env: { ...process.env, ...composeEnv },
})`docker compose -f ${getComposeFile(repoRoot)} down`;
