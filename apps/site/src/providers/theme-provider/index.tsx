import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import {
	createTheme,
	ThemeProvider as MuiThemeProvider,
	type ThemeOptions,
} from "@mui/material";
import { ThemeMode } from "@n8v/site/theme";
import * as React from "react";

import { useThemeModeStore } from "../../stores/use-theme-mode-store";
import { GlobalStyles } from "./global-styles";

// https://www.canva.com/colors/color-palettes/balloon-parade/
const themeOption = {
	palette: {
		primary: {
			main: "#0e63c2",
		},
		secondary: {
			main: "#6bcae2",
		},
	},
} satisfies ThemeOptions;

export const lightTheme = createTheme({
	...themeOption,
});
export const darkTheme = createTheme({
	...themeOption,
	palette: {
		...themeOption.palette,
		mode: "dark",
	},
});

// eslint-disable-next-line unicorn/prevent-abbreviations
export type AppThemeProps = React.PropsWithChildren<{
	overrideThemeMode?: ThemeMode;
}>;

export const AppThemeProvider = ({
	children,
	overrideThemeMode,
}: AppThemeProps) => {
	let theme = useThemeModeStore((state) =>
		state.themeMode === ThemeMode.Dark ? darkTheme : lightTheme,
	);

	if (overrideThemeMode) {
		theme = overrideThemeMode === ThemeMode.Light ? lightTheme : darkTheme;
	}

	React.useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
		Promise.resolve(useThemeModeStore.persist.rehydrate()).catch(console.error);
	}, []);

	return (
		<MuiThemeProvider theme={theme}>
			<EmotionThemeProvider theme={theme}>
				<GlobalStyles />
				{children}
			</EmotionThemeProvider>
		</MuiThemeProvider>
	);
};
