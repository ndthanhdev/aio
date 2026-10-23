import "zx/globals";
import { workDirs } from "@n8v/scripts/utils/work-dirs";
import fse from "fs-extra";

$.verbose = true;

export const cleanBuild = async () => {
	await fse.emptyDir(workDirs.apps.site.public.path);
	await fse.emptyDir(workDirs.target.path);
};
