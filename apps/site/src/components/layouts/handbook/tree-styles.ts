import { css } from "@emotion/react";
import { alpha } from "@mui/material/styles";
import { treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { type AppTheme } from "@n8v/site/theme";

/** Indentation of child items, shared by every handbook tree. */
export const treeIndentation = 12;

/** Item styles shared by the handbook tree and the "On this page" tree. */
export const treeStyles = (theme: AppTheme) =>
	css({
		[`& .${treeItemClasses.content}.${treeItemClasses.selected}, & .${treeItemClasses.content}.${treeItemClasses.selected}:hover`]:
			{
				backgroundColor: alpha(
					theme.palette.primary.main,
					theme.palette.action.selectedOpacity,
				),
				color: theme.palette.primary.main,
			},
		[`& .${treeItemClasses.content}.${treeItemClasses.selected} .${treeItemClasses.label}`]:
			{
				fontWeight: theme.typography.fontWeightMedium,
			},
		[`& .${treeItemClasses.content}`]: {
			borderRadius: theme.shape.borderRadius,
			paddingBlock: theme.spacing(0.5),
		},
		[`& .${treeItemClasses.label}`]: {
			fontSize: theme.typography.body2.fontSize,
			letterSpacing: theme.typography.body2.letterSpacing,
			lineHeight: theme.typography.body2.lineHeight,
		},
	});
