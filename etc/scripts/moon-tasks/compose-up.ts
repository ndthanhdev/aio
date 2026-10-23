#!/usr/bin/env -S yarn dlx tsx
import "zx/globals";
import { workDirs } from "@n8v/scripts/utils/work-dirs";
import fse from "fs-extra";
// eslint-disable-next-line unicorn/import-style
import * as path from "node:path";

$.verbose = true;

// Compose mounts volumes at these paths inside the checkout. Docker creates
// missing mount points on the host owned by root, so create them first.
const volumeMountPoints = [
	path.join(workDirs.path, "node_modules"),
	path.join(workDirs.path, ".moon/cache"),
	workDirs.apps.site.cache.path,
	workDirs.apps.site.public.path,
	path.join(workDirs.apps.site.path, "node_modules"),
];

await Promise.all(
	volumeMountPoints.map((directory) => fse.ensureDir(directory)),
);

await $`docker compose -f ${workDirs.etc.docker.compose.path} up --build`;
