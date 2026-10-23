import "zx/globals";
import { workDirs } from "@n8v/scripts/utils/work-dirs";

$.verbose = true;

export const cleanCache = () => $`rm -rf ${workDirs.apps.site.cache.path}`;
