import { css } from "@emotion/react";
import { type AppTheme } from "@n8v/site/theme";
import { lineClamp } from "@n8v/site/utils/styles/line-clamp";

const Constants = {
	descLineCount: 2,
	titleLineCount: 2,
};

export const styles = {
	date: css({
		gridArea: "date",
	}),

	description: (theme: AppTheme) =>
		css({
			color: theme.palette.text.secondary,
			gridArea: "description",
			marginBlockStart: theme.spacing(2),
			marginInlineEnd: theme.spacing(2),
			...lineClamp(
				Constants.descLineCount,
				theme.typography.body1.fontSize ?? "",
				theme.typography.body1.lineHeight ?? "",
			),
		}),

	divider: (theme: AppTheme) =>
		css({
			gridArea: "divider",
			paddingBlockStart: theme.spacing(2),
		}),

	root: (theme: AppTheme) =>
		css({
			display: "grid",
			gridTemplateAreas: `\
				"title . thumb"
				"date . thumb"
				"description . thumb"
				"divider divider divider"
			`,
			gridTemplateColumns: `1fr auto auto`,
			gridTemplateRows: "auto auto minmax(0, 1fr) auto",
			height: theme.spacing(20),
			marginBlockEnd: theme.spacing(2),
			marginBlockStart: theme.spacing(4),
			overflow: "hidden",
			[theme.breakpoints.down("md")]: {
				height: theme.spacing(22),
			},
		}),

	thumb: (theme: AppTheme) =>
		css({
			backgroundColor: theme.palette.augmentColor({
				color: {
					main: theme.palette.background.paper,
				},
			}).light,
			gridArea: "thumb",
			height: theme.spacing(15),
			objectFit: "cover",
			objectPosition: "center",
			width: theme.spacing(15),
		}),

	title: (theme: AppTheme) =>
		css({
			color: theme.palette.text.primary,
			gridArea: "title",
			marginInlineEnd: theme.spacing(2),
			...lineClamp(
				Constants.titleLineCount,
				theme.typography.h6.fontSize ?? "",
				theme.typography.h6.lineHeight ?? "",
			),
		}),
};
