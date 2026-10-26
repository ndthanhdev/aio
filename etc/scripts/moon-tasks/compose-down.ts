#!/usr/bin/env -S yarn dlx tsx
import "zx/globals";
import {
	getComposeEnv,
	type ServiceName,
	services,
	toRouteName,
} from "@n8v/scripts/utils/compose-env";
import { workDirs } from "@n8v/scripts/utils/work-dirs";

$.verbose = true;

const composeEnv = await getComposeEnv();

await Promise.all(
	(Object.keys(services) as ServiceName[]).map(async (service) => {
		const route = toRouteName(composeEnv.WORKTREE, service);
		const result = await $({
			cwd: workDirs.path,
			nothrow: true,
			quiet: true,
		})`yarn portless alias --remove ${route}`;

		if (result.exitCode !== 0 && !result.stderr.includes("No alias found")) {
			throw new Error(`Could not remove the portless route ${route}`, {
				cause: result,
			});
		}
	}),
);

await $({
	env: { ...process.env, ...composeEnv },
})`docker compose -f ${workDirs.etc.docker.compose.path} down`;
