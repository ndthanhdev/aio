import { ThemeMode } from "@n8v/site/theme";
import localForage from "localforage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ThemeModeState {
	setThemeMode: (mode: ThemeMode) => void;
	themeMode: ThemeMode;
	toggleThemeMode: () => void;
}

export const useThemeModeStore = create(
	persist<ThemeModeState>(
		(set) => ({
			setThemeMode: (mode) => {
				set(() => ({
					themeMode: mode,
				}));
			},
			themeMode: ThemeMode.Light,
			toggleThemeMode: () => {
				set((state) => ({
					themeMode:
						state.themeMode === ThemeMode.Dark
							? ThemeMode.Light
							: ThemeMode.Dark,
				}));
			},
		}),
		{
			name: "app-theme-mode",
			skipHydration: true,
			storage: createJSONStorage(() => localForage),
		},
	),
);
