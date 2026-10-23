import { css } from "@emotion/react";
import { treeStyles } from "@n8v/site/components/layouts/handbook/tree-styles";
import { type AppTheme } from "@n8v/site/theme";

export const styles = {
	caption: (theme: AppTheme) =>
		css({
			color: theme.palette.text.secondary,
			display: "block",
			paddingInline: theme.spacing(1),
		}),

	tree: (theme: AppTheme) => [
		treeStyles(theme),
		css({
			paddingBlock: theme.spacing(1),
		}),
	],
};
