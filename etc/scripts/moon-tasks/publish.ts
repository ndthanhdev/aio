#!/usr/bin/env -S yarn dlx tsx
import "zx/globals";
import { getPublishRemote } from "@n8v/scripts/utils/get-publish-remote";
import { workDirs } from "@n8v/scripts/utils/work-dirs";

const Constants = {
	user: {
		email: "dagger-bot@users.noreply.github.com",
		name: "Dagger Bot",
	},
};

$.verbose = true;

cd(workDirs.apps.site.path);

try {
	await $`git config --get user.name`;
} catch {
	// Git config --global user.email "dagger-bot@users.noreply.github.com"
	await $`git config --global user.email ${Constants.user.email}`;
	// Git config --global user.name "Dagger Bot"
	await $`git config --global user.name ${Constants.user.name}`;
}

const remote = getPublishRemote();

$.env.GH_REMOTE = remote;

await $`yarn dlx gh-pages --dist ${workDirs.apps.site.public.path} --repo $GH_REMOTE --dotfiles --message "chore: publish"`;
