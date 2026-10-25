#!/usr/bin/env -S yarn dlx tsx
import "zx/globals";
import fse from "fs-extra";
import path from "node:path";

import {
	getComposeEnv,
	getComposeFile,
	getRepoRoot,
	serviceCodes,
	toHostPort,
} from "./compose-env";

$.verbose = true;

const repoRoot = await getRepoRoot();
const composeFile = getComposeFile(repoRoot);

// Compose mounts volumes at these paths inside the checkout. Docker creates
// missing mount points on the host owned by root, so create them first.
const volumeMountPoints = [
	"node_modules",
	".moon/cache",
	"__APP_DIR__/.cache",
	"__APP_DIR__/node_modules",
].map((relativePath) => path.join(repoRoot, relativePath));

await Promise.all(
	volumeMountPoints.map((directory) => fse.ensureDir(directory)),
);

const composeEnv = await getComposeEnv(repoRoot);

await $({
	env: { ...process.env, ...composeEnv },
})`docker compose -f ${composeFile} up --build --detach`;

const project = `__REPO__-${composeEnv.PORT_WORKTREE}`;

console.log(
	[
		`__APP__: http://localhost:${String(toHostPort(composeEnv, serviceCodes.__APP__))}`,
		`logs: docker compose -f ${composeFile} -p ${project} logs -f`,
	].join("\n"),
);
