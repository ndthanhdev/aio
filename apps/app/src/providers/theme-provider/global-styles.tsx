import { css, Global } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { type AppTheme } from "@n8v/app/theme";
import React from "react";

/**
 * Light-mode code colors from the a11y-light palette. Every text and token
 * color is at least 4.5:1 against `blockBackground`.
 */
const lightCode = {
	blockBackground: "#F6F8FA",
	border: "#D0D7DE",
	inlineBackground: "#EFF1F3",
	text: "#545454",
	tokens: {
		blue: "#326BAD",
		brown: "#802200",
		cyan: "#1F7C93",
		green: "#008000",
		orange: "#A85D00",
		purple: "#9400D3",
		red: "#D91E18",
		yellow: "#856514",
	},
};

/** `body` raises specificity above the Okaidia stylesheet regardless of load order. */
const inBody = (...selectors: string[]) =>
	selectors.map((selector) => `body ${selector}`).join(", ");

const tokens = (...names: string[]) =>
	inBody(...names.map((name) => `.token.${name}`));

const lightCodeStyles = (theme: AppTheme) =>
	css({
		[inBody(':not(pre) > code[class*="language-"]')]: {
			background: lightCode.inlineBackground,
			borderRadius: theme.shape.borderRadius,
			color: theme.palette.text.primary,
			paddingInline: "0.3em",
		},
		[inBody('code[class*="language-"]', 'pre[class*="language-"]')]: {
			color: lightCode.text,
			textShadow: "none",
		},
		[inBody('pre[class*="language-"]')]: {
			background: lightCode.blockBackground,
			border: `1px solid ${lightCode.border}`,
			borderRadius: theme.shape.borderRadius,
		},
		[inBody(".language-css .token.string", ".style .token.string")]: {
			color: lightCode.tokens.yellow,
		},
		[tokens("atrule", "attr-value", "function", "class-name")]: {
			color: lightCode.tokens.blue,
		},
		[tokens("boolean", "number")]: {
			color: lightCode.tokens.purple,
		},
		[tokens("comment", "prolog", "doctype", "cdata")]: {
			color: lightCode.tokens.brown,
		},
		[tokens("keyword")]: {
			color: lightCode.tokens.cyan,
		},
		[tokens("operator", "entity", "url", "variable")]: {
			color: lightCode.tokens.yellow,
		},
		[tokens("property", "tag", "constant", "symbol", "deleted")]: {
			color: lightCode.tokens.red,
		},
		[tokens("punctuation")]: {
			color: lightCode.text,
		},
		[tokens("regex", "important")]: {
			color: lightCode.tokens.orange,
		},
		[tokens("selector", "attr-name", "string", "char", "builtin", "inserted")]:
			{
				color: lightCode.tokens.green,
			},
	});

const globalStyles = (theme: AppTheme) =>
	theme.palette.mode === "light" ? lightCodeStyles(theme) : css({});

export const GlobalStyles = () => (
	<React.Fragment>
		<CssBaseline />
		<Global styles={globalStyles} />
	</React.Fragment>
);
