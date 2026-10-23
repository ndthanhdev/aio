import { create } from "zustand";

export interface AppDrawerState {
	closeDrawer: () => void;
	open: boolean;
	openDrawer: () => void;
}

export const useAppDrawerStore = create<AppDrawerState>((set) => ({
	closeDrawer: () => {
		set(() => ({ open: false }));
	},
	open: false,
	openDrawer: () => {
		set(() => ({ open: true }));
	},
}));
