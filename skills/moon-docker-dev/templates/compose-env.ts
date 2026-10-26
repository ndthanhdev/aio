import "zx/globals";
import fse from "fs-extra";
import path from "node:path";
import { parseEnv } from "node:util";

/** Prefix of compose project names and last label of portless routes. */
export const projectName = "__REPO__";

/**
 * Services in etc/docker/docker-compose.yml that get a portless route; keep
 * both in sync.
 */
export const services = {
	__APP__: { containerPort: __APP_PORT__, hostname: "__APP__" },
} as const satisfies Record<
	string,
	{ containerPort: number; hostname: string }
>;

/** Variables etc/docker/docker-compose.yml reads. */
export interface ComposeEnv {
	WORKTREE: string;
}

export type ServiceName = keyof typeof services;

export const getRepoRoot = async (
	directory = process.cwd(),
): Promise<string> => {
	const output = await $({
		cwd: directory,
		quiet: true,
	})`git rev-parse --show-toplevel`;

	return output.stdout.trim();
};

export const getComposeFile = (repoRoot: string): string =>
	path.join(repoRoot, "etc/docker/docker-compose.yml");

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

/** portless route for a service: `<app>.<repo>`, or `<worktree>.<app>.<repo>`. */
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
export const getComposeEnv = async (repoRoot: string): Promise<ComposeEnv> => {
	const fileEnv = await readEnvFile(path.join(repoRoot, "etc/docker/.env"));
	const override = process.env.WORKTREE ?? (fileEnv.WORKTREE || undefined);
	const worktree = override
		? toLabel(override)
		: await getWorktreeName(repoRoot);

	if (!worktree) {
		throw new Error(
			`WORKTREE must contain letters or digits, got "${override ?? ""}"`,
		);
	}

	return { WORKTREE: worktree };
};
