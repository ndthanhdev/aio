import { css } from "@emotion/react";
import { type AppTheme } from "@n8v/site/theme";
import { ellipsis } from "polished";

import type { MediaProps } from ".";

export const styles = {
	actions: () => css({ justifyContent: "end", marginTop: "auto" }),

	content: [
		css({
			flexGrow: 1,
			flexShrink: 1,
		}),
	],

	description: css({
		...ellipsis("100%", 3),
	}),

	root: (theme: AppTheme) =>
		css({
			display: "flex",
			flexDirection: "column",
			height: theme.spacing(50),
			width: theme.spacing(40),
		}),
};

export const useMediaStyles = (props: MediaProps) => ({
	media: (theme: AppTheme) =>
		css([
			{
				color: theme.palette.text.secondary,
				height: theme.spacing(27),
				overflow: "hidden",
				pointerEvents: "none",
				position: "relative",
				width: theme.spacing(40),
			},
			!props.frameUrl && {
				alignItems: "center",
				display: "flex",
				justifyContent: "center",
			},
		]),

	mediaIframe: () =>
		css({
			border: 0,
			height: "500%",
			overflow: "hidden",
			pointerEvents: "none",
			transform: "scale(0.2)",
			transformOrigin: "top left",
			width: "500%",
		}),

	mediaNoFrame: (theme: AppTheme) =>
		css({
			height: theme.spacing(10),
			width: theme.spacing(10),
		}),
});
