import type { CSSObject } from "@emotion/react";

export const lineClamp = (
	lineCount: number,
	fontSize: number | string,
	lineHeight: number | string,
): CSSObject => ({
	display: "-webkit-box",
	maxHeight: `calc(${fontSize} * ${lineHeight} * ${lineCount})`,
	overflow: "hidden",
	textOverflow: "ellipsis",
	WebkitBoxOrient: "vertical",
	WebkitLineClamp: lineCount,
});
