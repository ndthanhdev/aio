import { css } from "@emotion/react";
import { type AppTheme } from "@n8v/site/theme";

export const styles = {
	li: css({}),

	p: (theme: AppTheme) =>
		css({
			marginBlockEnd: theme.spacing(1),
		}),

	strong: (theme: AppTheme) =>
		css({
			fontWeight: theme.typography.fontWeightBold,
		}),

	ul: (theme: AppTheme) =>
		css({
			marginBlockEnd: theme.spacing(2),
			marginBlockStart: theme.spacing(0),
		}),
};
