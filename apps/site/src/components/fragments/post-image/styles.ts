import { css } from "@emotion/react";
import { type AppTheme } from "@n8v/site/theme";

export const styles = {
	image: (theme: AppTheme) =>
		css({
			backgroundColor: theme.palette.augmentColor({
				color: {
					main: theme.palette.background.paper,
				},
			}).light,
			maxWidth: "100%",
		}),

	root: (theme: AppTheme) =>
		css({
			marginBlockEnd: theme.spacing(4),
			width: "100%",
		}),
};
