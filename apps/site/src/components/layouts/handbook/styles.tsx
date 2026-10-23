import { css } from "@emotion/react";
import { bottomNavigationActionClasses } from "@mui/material/BottomNavigationAction";
import { drawerClasses } from "@mui/material/Drawer";
import { type AppTheme } from "@n8v/site/theme";

const Constants = {
	/** Height of MUI's `BottomNavigation`. */
	bottomBarHeight: 56,
	drawerWidth: 280,
	navWidth: 260,
	tocWidth: 220,
};

/** Space kept above sticky columns and jumped-to headings so the app bar doesn't cover them. */
export const stickyTop = (theme: AppTheme) => theme.spacing(10);

const stickyColumn = (theme: AppTheme) =>
	css({
		alignSelf: "start",
		maxHeight: `calc(100vh - ${stickyTop(theme)})`,
		overflowY: "auto",
		position: "sticky",
		top: stickyTop(theme),
	});

/** The bottom bar shows below `lg`, except between `md` and `lg` on pages without headings, where it has no tab. */
const bottomBarVisibility = (theme: AppTheme, hasHeadings: boolean) =>
	css({
		[theme.breakpoints.up("lg")]: {
			display: "none",
		},
		...(!hasHeadings && {
			[theme.breakpoints.between("md", "lg")]: {
				display: "none",
			},
		}),
	});

export const styles = {
	bottomBar: (hasHeadings: boolean) => (theme: AppTheme) => [
		bottomBarVisibility(theme, hasHeadings),
		css({
			[`& .${bottomNavigationActionClasses.root}`]: {
				maxWidth: "none",
			},
			bottom: 0,
			insetInline: 0,
			paddingBlockEnd: "env(safe-area-inset-bottom)",
			position: "fixed",
			zIndex: theme.zIndex.appBar,
		}),
	],

	bottomBarSpacer: (hasHeadings: boolean) => (theme: AppTheme) => [
		bottomBarVisibility(theme, hasHeadings),
		css({
			height: `calc(${String(Constants.bottomBarHeight)}px + env(safe-area-inset-bottom))`,
		}),
	],

	content: (theme: AppTheme) =>
		css({
			"& :is(h1, h2, h3, h4, h5, h6)[id]": {
				scrollMarginTop: stickyTop(theme),
			},
			gridArea: "content",
		}),

	contentsTab: (theme: AppTheme) =>
		css({
			[theme.breakpoints.up("md")]: {
				display: "none",
			},
		}),

	drawer: (theme: AppTheme) =>
		css({
			[`& .${drawerClasses.paper}`]: {
				paddingInline: theme.spacing(1),
				width: Constants.drawerWidth,
			},
		}),

	drawerOnThisPage: (theme: AppTheme) =>
		css({
			paddingBlockStart: theme.spacing(2),
		}),

	main: (theme: AppTheme) =>
		css({
			columnGap: theme.spacing(4),
			display: "grid",
			gridTemplateAreas: `"content"`,
			gridTemplateColumns: "minmax(0, 1fr)",
			marginBlockEnd: theme.spacing(4),
			marginBlockStart: theme.spacing(4),
			minHeight: "95vh",
			rowGap: theme.spacing(2),
			[theme.breakpoints.between("md", "lg")]: {
				gridTemplateAreas: `"nav content"`,
				gridTemplateColumns: `${String(Constants.navWidth)}px minmax(0, 1fr)`,
			},
			[theme.breakpoints.up("lg")]: {
				gridTemplateAreas: `"nav content toc"`,
				gridTemplateColumns: `${String(Constants.navWidth)}px minmax(0, 1fr) ${String(Constants.tocWidth)}px`,
			},
		}),

	nav: (theme: AppTheme) => [
		stickyColumn(theme),
		css({
			display: "none",
			gridArea: "nav",
			[theme.breakpoints.up("md")]: {
				display: "block",
			},
		}),
	],

	onThisPageTab: (theme: AppTheme) =>
		css({
			[theme.breakpoints.up("lg")]: {
				display: "none",
			},
		}),

	title: (theme: AppTheme) =>
		css({
			marginBlockEnd: theme.spacing(4),
		}),

	toc: (theme: AppTheme) => [
		stickyColumn(theme),
		css({
			display: "none",
			gridArea: "toc",
			[theme.breakpoints.up("lg")]: {
				display: "block",
			},
		}),
	],
};
