#!/usr/bin/env -S yarn dlx tsx
import "zx/globals";
import { cleanBuild } from "@n8v/scripts/utils/clean-build";
import { getBuildNumber } from "@n8v/scripts/utils/get-build-number";
import { getRev } from "@n8v/scripts/utils/get-rev";
import { workDirs } from "@n8v/scripts/utils/work-dirs";
import fse from "fs-extra";
// eslint-disable-next-line unicorn/import-style
import * as path from "node:path";

$.verbose = true;

await cleanBuild();

cd(workDirs.apps.site.path);

$.env.GATSBY_BUILD_NUMBER = getBuildNumber();
$.env.GATSBY_REV = await getRev();
$.env.GATSBY_MODE = $.env.MODE;

await $`moon run site:build counter:build recorder:build`;

// Merge the rust/trunk bundles into the gatsby site so that
// URLs like /apps/counter/ and /apps/recorder/ resolve correctly.
await fse.copy(
	workDirs.apps.counter.target.trunk.dist.path,
	path.join(workDirs.apps.site.public.path, "apps/counter"),
);

await fse.copy(
	workDirs.apps.recorder.target.trunk.dist.path,
	path.join(workDirs.apps.site.public.path, "apps/recorder"),
);

// Populate the repo-root /target/ aggregator (apps + release)
await $`moon run scripts:collect-workspace-targets`;
