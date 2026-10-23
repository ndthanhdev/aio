import "zx/globals";
// eslint-disable-next-line unicorn/import-style
import * as path from "node:path";

$.verbose = true;

const root = path.resolve(import.meta.dirname, "../../../");
const apps = path.resolve(root, "apps");
const etc = path.resolve(root, "etc");
const counter = path.resolve(apps, "counter");
const recorder = path.resolve(apps, "recorder");
const site = path.resolve(apps, "site");
const workflowRuntime = path.resolve(etc, "workflow-runtime");
const scripts = path.resolve(etc, "scripts");
const target = path.resolve(root, "target");

// eslint-disable-next-line unicorn/prevent-abbreviations
export const workDirs = {
	apps: {
		counter: {
			path: counter,
			target: {
				path: path.resolve(counter, "target"),
				trunk: {
					dist: {
						path: path.resolve(counter, "target/trunk/dist"),
					},
				},
			},
		},
		path: apps,
		recorder: {
			path: recorder,
			target: {
				path: path.resolve(recorder, "target"),
				trunk: {
					dist: {
						path: path.resolve(recorder, "target/trunk/dist"),
					},
				},
			},
		},
		site: {
			cache: {
				path: path.resolve(site, ".cache"),
			},
			path: site,
			public: {
				path: path.resolve(site, "public"),
			},
		},
	},

	etc: {
		path: etc,
		scripts: {
			path: scripts,
		},
		workflowRuntime: {
			path: workflowRuntime,
		},
	},
	path: root,
	target: {
		apps: {
			path: path.resolve(target, "apps"),
		},
		path: target,
		release: {
			path: path.resolve(target, "release"),
		},
	},
};
