import { css } from "@emotion/react";
import { type AppTheme } from "@n8v/site/theme";

export const iconShieldStyles = {
	wrapper: (theme: AppTheme) =>
		css({
			alignItems: "stretch",
			borderColor: theme.palette.text.secondary,
			borderRadius: theme.spacing(1),
			borderStyle: "solid",
			borderWidth: 1,
			display: "flex",
			justifyContent: "stretch",
			overflow: "hidden",
		}),
};
