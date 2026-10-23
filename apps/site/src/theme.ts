import "@emotion/react";

import type { Theme as MuiTheme } from "@mui/material";

export type AppTheme = MuiTheme;

declare module "@emotion/react" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface Theme extends AppTheme {}
}

export enum ThemeMode {
	Dark = "dark",
	Light = "light",
}
