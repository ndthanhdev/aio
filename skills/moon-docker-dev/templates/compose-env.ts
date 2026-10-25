import "zx/globals";
import fse from "fs-extra";
import { createHash } from "node:crypto";
import path from "node:path";
import { parseEnv } from "node:util";

/**
 * Host-port codes (the `CC` part) of the services in
 * etc/docker/docker-compose.yml; keep both in sync.
 */
export const serviceCodes = {
	__APP__: "__SERVICE_CODE__",
} as const;

/**
 * Variables etc/docker/docker-compose.yml builds host ports and the project
 * name from: host port = PORT_PREFIX (A) + PORT_WORKTREE (BB) + service code (CC).
 */
export interface ComposeEnv {
	PORT_PREFIX: string;
	PORT_WORKTREE: string;
}

const maxPort = 65_535;

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

/** `00` in the main checkout; `01`-`99` from a hash of a linked worktree's path. */
export const getWorktreeCode = async (directory: string): Promise<string> => {
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
		return "00";
	}

	const hash = createHash("sha1").update(topLevel).digest();

	return String((hash.readUInt32BE(0) % 99) + 1).padStart(2, "0");
};

export const toHostPort = (env: ComposeEnv, serviceCode: string): number =>
	Number(`${env.PORT_PREFIX}${env.PORT_WORKTREE}${serviceCode}`);

/**
 * Resolves each variable from the shell environment, then etc/docker/.env,
 * then its default (PORT_PREFIX 1, PORT_WORKTREE from the worktree). Empty
 * values count as unset, as they do in compose's `${VAR:-default}`.
 */
export const getComposeEnv = async (repoRoot: string): Promise<ComposeEnv> => {
	const fileEnv = await readEnvFile(path.join(repoRoot, "etc/docker/.env"));
	const pick = (key: keyof ComposeEnv) =>
		process.env[key] ?? (fileEnv[key] || undefined);

	const env: ComposeEnv = {
		PORT_PREFIX: pick("PORT_PREFIX") || "1",
		PORT_WORKTREE: pick("PORT_WORKTREE") || (await getWorktreeCode(repoRoot)),
	};

	if (!/^[1-6]$/u.test(env.PORT_PREFIX)) {
		throw new Error(
			`PORT_PREFIX must be a single digit from 1 to 6, got "${env.PORT_PREFIX}"`,
		);
	}

	if (!/^\d{2}$/u.test(env.PORT_WORKTREE)) {
		throw new Error(
			`PORT_WORKTREE must be exactly two digits, got "${env.PORT_WORKTREE}"`,
		);
	}

	const highestPort = Math.max(
		...Object.values(serviceCodes).map((code) => toHostPort(env, code)),
	);

	if (highestPort > maxPort) {
		throw new Error(
			`PORT_PREFIX ${env.PORT_PREFIX} with PORT_WORKTREE ${env.PORT_WORKTREE} gives port ${String(highestPort)}, above ${String(maxPort)}`,
		);
	}

	return env;
};
