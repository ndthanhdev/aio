export interface SiteTab {
	label: string;
	to: string;
}

export const siteTabs: readonly SiteTab[] = [
	{ label: "about", to: "/about" },
	{ label: "projects", to: "/projects" },
	{ label: "handbook", to: "/handbook" },
];
