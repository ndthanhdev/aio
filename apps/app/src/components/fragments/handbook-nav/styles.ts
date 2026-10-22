import { css } from "@emotion/react";
import { treeStyles } from "@n8v/app/components/layouts/handbook/tree-styles";
import { type AppTheme } from "@n8v/app/theme";

export const styles = {
	root: (theme: AppTheme) => [
		treeStyles(theme),
		css({
			paddingBlock: theme.spacing(1),
		}),
	],
};
