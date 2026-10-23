#!/usr/bin/env -S yarn dlx tsx
import "zx/globals";
import { workDirs } from "@n8v/scripts/utils/work-dirs";
import fse from "fs-extra";
// eslint-disable-next-line unicorn/import-style
import * as path from "node:path";

$.verbose = true;
cd(workDirs.path);

// Prepare output directories
await fse.emptyDir(workDirs.target.path);
await fse.emptyDir(workDirs.target.apps.path);
await fse.emptyDir(workDirs.target.release.path);

// Collect per-app target outputs into /target/apps/<name>/
const appTargets: { name: string; source: string }[] = [
	{
		name: "counter",
		source: workDirs.apps.counter.target.path,
	},
	{
		name: "recorder",
		source: workDirs.apps.recorder.target.path,
	},
];

await Promise.all(
	appTargets.map(async ({ name, source }) => {
		if (!(await fse.pathExists(source))) {
			console.log(`Skipping ${name}: ${source} does not exist`);
			return;
		}

		const destination = path.join(workDirs.target.apps.path, name);
		// Copy only the trunk/dist subtree to avoid massive Cargo caches
		const trunkDistribution = path.join(source, "trunk/dist");

		if (await fse.pathExists(trunkDistribution)) {
			await fse.copy(trunkDistribution, path.join(destination, "trunk/dist"));
			console.log(`Copied ${trunkDistribution} -> ${destination}/trunk/dist`);
		}
	}),
);

// Also aggregate the gatsby site output under /target/apps/site/gatsby/public
if (await fse.pathExists(workDirs.apps.site.public.path)) {
	const gatsbyDestination = path.join(
		workDirs.target.apps.path,
		"site/gatsby/public",
	);
	await fse.copy(workDirs.apps.site.public.path, gatsbyDestination);
	console.log(
		`Copied ${workDirs.apps.site.public.path} -> ${gatsbyDestination}`,
	);
}

// Populate /target/release/ with side-by-side per-app bundles
const releaseLayout: { name: string; source: string }[] = [
	{
		name: "counter",
		source: workDirs.apps.counter.target.trunk.dist.path,
	},
	{
		name: "recorder",
		source: workDirs.apps.recorder.target.trunk.dist.path,
	},
	{
		name: "site",
		source: workDirs.apps.site.public.path,
	},
];

await Promise.all(
	releaseLayout.map(async ({ name, source }) => {
		if (!(await fse.pathExists(source))) {
			console.log(`Skipping release/${name}: ${source} does not exist`);
			return;
		}

		const destination = path.join(workDirs.target.release.path, name);
		await fse.copy(source, destination);
		console.log(`Copied release artifact: ${source} -> ${destination}`);
	}),
);
