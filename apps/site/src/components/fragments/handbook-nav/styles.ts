import { css } from "@emotion/react";
import { treeStyles } from "@n8v/site/components/layouts/handbook/tree-styles";
import { type AppTheme } from "@n8v/site/theme";

export const styles = {
	root: (theme: AppTheme) => [
		treeStyles(theme),
		css({
			paddingBlock: theme.spacing(1),
		}),
	],
};
