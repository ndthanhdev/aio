import { css } from "@emotion/react";
import { type AppTheme } from "@n8v/site/theme";

export const styles = {
	contentContainer: () =>
		css({
			display: "flex",
			justifyContent: "center",
			width: "100%",
		}),

	leftWrapper: (theme: AppTheme) =>
		css({
			alignItems: "flex-start",
			color: theme.palette.text.secondary,
			display: "flex",
			flexDirection: "column",
		}),

	rightWrapper: (theme: AppTheme) =>
		css({
			color: theme.palette.text.secondary,
			display: "flex",
			flexDirection: "column",
			justifyContent: "flex-end",
		}),

	root: () =>
		css({
			display: "flex",
			flexDirection: "column",
		}),

	topWrapper: (theme: AppTheme) =>
		css({
			alignItems: "flex-start",
			display: "flex",
			justifyContent: "space-between",
			maxWidth: theme.breakpoints.values.lg,
			paddingBlockEnd: theme.spacing(8),
			paddingBlockStart: theme.spacing(2),
			paddingInline: theme.spacing(4),
			width: "100%",
		}),
};
