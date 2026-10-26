import "zx/globals";
import { workDirs } from "@n8v/scripts/utils/work-dirs";
import fse from "fs-extra";
// eslint-disable-next-line unicorn/import-style
import * as path from "node:path";
import { parseEnv } from "node:util";

/** Prefix of compose project names and portless routes. */
export const projectName = "aio";

/**
 * Services in etc/docker/docker-compose.yml that get a portless route; keep
 * both in sync.
 */
export const services = {
	site: { containerPort: 8000, hostname: "site" },
} as const satisfies Record<
	string,
	{ containerPort: number; hostname: string }
>;

/** Variables etc/docker/docker-compose.yml reads. */
export interface ComposeEnv {
	WORKTREE: string;
}

export type ServiceName = keyof typeof services;

const readEnvFile = async (file: string): Promise<Record<string, string>> =>
	(await fse.pathExists(file))
		? (parseEnv(await fse.readFile(file, "utf8")) as Record<string, string>)
		: {};

const toLabel = (value: string): string =>
	value
		.toLowerCase()
		.replaceAll(/[^a-z\d-]+/gu, "-")
		.replaceAll(/^-+|-+$/gu, "");

/** `main` in the main checkout; the linked worktree's folder name otherwise. */
export const getWorktreeName = async (directory: string): Promise<string> => {
	const git = $({ cwd: directory, quiet: true });
	const outputs = await Promise.all([
		git`git rev-parse --path-format=absolute --git-dir`,
		git`git rev-parse --path-format=absolute --git-common-dir`,
		git`git rev-parse --show-toplevel`,
	]);
	const [gitDirectory, commonDirectory, topLevel] = outputs.map((output) =>
		output.stdout.trim(),
	);

	if (gitDirectory === commonDirectory) {
		return "main";
	}

	return toLabel(path.basename(topLevel));
};

/** portless route for a service: `site.aio`, or `bk.site.aio` in worktree `bk`. */
export const toRouteName = (worktree: string, service: ServiceName): string =>
	[
		worktree === "main" ? undefined : worktree,
		services[service].hostname,
		projectName,
	]
		.filter(Boolean)
		.join(".");

/**
 * Resolves WORKTREE from the shell environment, then etc/docker/.env, then the
 * worktree itself. Empty values count as unset, as they do in compose's
 * `${VAR:-default}`.
 */
export const getComposeEnv = async ({
	directory = workDirs.path,
	envFile = workDirs.etc.docker.env.path,
}: { directory?: string; envFile?: string } = {}): Promise<ComposeEnv> => {
	const fileEnv = await readEnvFile(envFile);
	const override = process.env.WORKTREE ?? (fileEnv.WORKTREE || undefined);
	const worktree = override
		? toLabel(override)
		: await getWorktreeName(directory);

	if (!worktree) {
		throw new Error(
			`WORKTREE must contain letters or digits, got "${override ?? ""}"`,
		);
	}

	return { WORKTREE: worktree };
};
