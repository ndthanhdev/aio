#!/usr/bin/env -S yarn dlx tsx
import "zx/globals";
import { workDirs } from "@n8v/scripts/utils/work-dirs";

$.verbose = true;

await $`docker compose -f ${workDirs.etc.docker.compose.path} down`;
