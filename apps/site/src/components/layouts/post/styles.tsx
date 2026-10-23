import { css } from "@emotion/react";
import { type AppTheme } from "@n8v/site/theme";

export const styles = {
	header: (theme: AppTheme) =>
		css({
			marginBlockEnd: theme.spacing(4),
		}),

	main: (theme: AppTheme) =>
		css({
			marginBlockEnd: theme.spacing(4),
			marginBlockStart: theme.spacing(6),
			minHeight: "95vh",
		}),
};
