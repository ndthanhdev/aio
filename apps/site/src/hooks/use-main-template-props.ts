import { type MainTemplateProps } from "@n8v/site/components/layouts/main";
import { useAppDrawerStore } from "@n8v/site/stores/use-app-drawer-store";
import { useThemeModeStore } from "@n8v/site/stores/use-theme-mode-store";
import { envs } from "@n8v/site/utils/envs";
import { DateTime } from "luxon";
import * as React from "react";

export const useMainTemplateProps = (): Pick<
	MainTemplateProps,
	"appDrawerProps" | "appFooterProps" | "appHeaderProps"
> => {
	const drawer = useAppDrawerStore(),
		theme = useThemeModeStore(),
		year = React.useMemo(() => DateTime.now().year.toString(), []);

	return {
		appDrawerProps: {
			onClose: drawer.closeDrawer,
			onThemeModeChange: (_, mode) => {
				theme.setThemeMode(mode);
			},
			open: drawer.open,
			themeMode: theme.themeMode,
		},
		appFooterProps: {
			buildNumber: envs.buildNumber,
			mode: envs.mode,
			rev: envs.rev,
			year,
		},
		appHeaderProps: {
			onOpenSettings: drawer.openDrawer,
			onToggleThemeMode: theme.toggleThemeMode,
			themeMode: theme.themeMode,
		},
	};
};
