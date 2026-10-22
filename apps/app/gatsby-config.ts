import type { GatsbyConfig } from "gatsby";

import Path from "node:path";

const config: GatsbyConfig = {
	graphqlTypegen: true,
	plugins: [
		{
			options: {
				component: Path.resolve("./src/shell/index.tsx"),
			},
			resolve: "gatsby-plugin-layout",
		},
		"gatsby-plugin-sass",
		"gatsby-plugin-emotion",
		"gatsby-plugin-image",
		"gatsby-transformer-sharp",
		"gatsby-plugin-sitemap",
		{
			options: {
				icon: "src/shell/icon.svg",
			},
			resolve: "gatsby-plugin-manifest",
		},
		{
			options: {
				gatsbyRemarkPlugins: [
					{
						options: {
							icon: false,
						},
						resolve: `gatsby-remark-autolink-headers`,
					},
					{
						options: {
							aliases: {},
							classPrefix: "language-",
							noInlineHighlight: false,
							prompt: {
								global: false,
								host: "localhost",
								user: "root",
							},
							showLineNumbers: true,
						},
						resolve: `gatsby-remark-prismjs`,
					},
					{
						options: {},
						resolve: `gatsby-remark-images`,
					},
				],
			},
			resolve: `gatsby-plugin-mdx`,
		},
		{
			__key: "pages",
			options: {
				name: "pages",
				path: "./src/pages/",
			},
			resolve: "gatsby-source-filesystem",
		},
		{
			options: {
				name: `content`,
				// eslint-disable-next-line unicorn/prefer-module
				path: `${__dirname}/content`,
			},
			resolve: `gatsby-source-filesystem`,
		},
		{
			options: {
				enableWebVitalsTracking: true,
				id: "GTM-KX72TPPN",
				includeInDevelopment: true,
				routeChangeEventName: "route_change",
			},
			resolve: "gatsby-plugin-google-tagmanager",
		},
	],
	siteMetadata: {
		description: `ndthanhdev's personal website`,
		siteUrl: `https://ndthanhdev.github.io`,
		title: `ndthanhdev`,
	},
};

export default config;
