#!/usr/bin/env -S yarn dlx tsx
import "zx/globals";
import fse from "fs-extra";

import { workDirs } from "../utils/work-dirs";

$.verbose = true;

await fse.emptyDir(workDirs.apps.site.public.path);

cd(workDirs.etc.workflowRuntime.path);

const mode = $.env.MODE ?? "dev";

await $`${[
	"dagger",
	"call",
	"--dir",
	workDirs.path,
	"build-env",
	"with-env-variable",
	"--name",
	"MODE",
	"--value",
	mode,
	"with-secret-variable",
	"--name",
	"GH_TOKEN",
	"--secret",
	"env:GH_TOKEN",
	"with-moon-task",
	"--task",
	"scripts:build",
	"with-moon-task",
	"--task",
	"scripts:publish",
	"container",
	"directory",
	"--path=/workspace/apps/site/public",
	"export",
	`--path=${workDirs.apps.site.public.path}`,
]}`;
