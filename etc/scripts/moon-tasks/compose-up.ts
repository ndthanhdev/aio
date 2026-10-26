#!/usr/bin/env -S yarn dlx tsx
import "zx/globals";
import {
	getComposeEnv,
	projectName,
	type ServiceName,
	services,
	toRouteName,
} from "@n8v/scripts/utils/compose-env";
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

const composeEnv = await getComposeEnv();
const compose = $({ env: { ...process.env, ...composeEnv } });
const portless = $({ cwd: workDirs.path });
const composeFile = workDirs.etc.docker.compose.path;

await compose`docker compose -f ${composeFile} up --build --detach`;

const routes = await Promise.all(
	(Object.keys(services) as ServiceName[]).map(async (service) => {
		const published = await compose({
			quiet: true,
		})`docker compose -f ${composeFile} port ${service} ${String(services[service].containerPort)}`;
		const port = published.stdout.trim().split(":").at(-1) ?? "";
		const route = toRouteName(composeEnv.WORKTREE, service);

		try {
			await portless`yarn portless alias ${route} ${port} --force`;
		} catch (error) {
			throw new Error(
				`Could not register the portless route ${route}. Start the proxy with \`yarn portless proxy start\` (or \`yarn portless service install\` to start it at boot), then rerun.`,
				{ cause: error },
			);
		}

		return { route, service };
	}),
);

const list = await portless({ quiet: true })`yarn portless list`;
const urls = routes.map(({ route, service }) => {
	const url =
		list.stdout
			.split(/\s+/u)
			.find(
				(word) =>
					/^https?:\/\//u.test(word) &&
					new URL(word).hostname === `${route}.localhost`,
			) ?? `https://${route}.localhost`;

	return `${service}: ${url}`;
});

console.log(
	[
		...urls,
		`logs: docker compose -f ${composeFile} -p ${projectName}-${composeEnv.WORKTREE} logs -f`,
	].join("\n"),
);
