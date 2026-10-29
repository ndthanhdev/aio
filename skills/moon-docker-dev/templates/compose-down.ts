#!/usr/bin/env -S yarn dlx tsx
import "zx/globals";

import {
	getComposeEnv,
	getComposeFile,
	getRepoRoot,
	type ServiceName,
	services,
	toRouteName,
} from "./compose-env";

$.verbose = true;

const repoRoot = await getRepoRoot();
const composeEnv = await getComposeEnv(repoRoot);

await Promise.all(
	(Object.keys(services) as ServiceName[]).map(async (service) => {
		const route = toRouteName(composeEnv.WORKTREE, service);
		const result = await $({
			cwd: repoRoot,
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
})`docker compose -f ${getComposeFile(repoRoot)} down`;
