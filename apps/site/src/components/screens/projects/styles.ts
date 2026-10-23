import { css } from "@emotion/react";
import { type AppTheme } from "@n8v/site/theme";

export const styles = {
	root: (theme: AppTheme) =>
		css({
			marginBlockStart: theme.spacing(8),
		}),
};
