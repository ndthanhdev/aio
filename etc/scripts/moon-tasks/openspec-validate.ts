#!/usr/bin/env -S yarn dlx tsx
import "zx/globals";
import { pipeOutput } from "@n8v/scripts/utils/pipe-output";
import { workDirs } from "@n8v/scripts/utils/work-dirs";
$.verbose = true;
cd(workDirs.path);

await pipeOutput($`yarn openspec validate --all --strict --no-interactive`);
await pipeOutput($`yarn openspec validate --archived --no-interactive`);
