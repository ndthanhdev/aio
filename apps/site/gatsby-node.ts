/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-argument */
import type { GatsbyNode } from "gatsby";

import path from "node:path";

import { isHandbookFile, toHandbookPath } from "./src/utils/handbook";
import { isValidNanoId } from "./src/utils/is-valid-nano-id";
import { cvPage, handbookPages, postPages } from "./src/utils/queries";

const cvFile = path.resolve(`./content/cv/cv.mdx`),
	handbookTemplate = path.resolve(`./src/layouts/handbook/index.tsx`),
	myCVTemplate = path.resolve(`./src/layouts/cv/index.tsx`),
	postTemplate = path.resolve(`./src/layouts/post/index.tsx`);

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
	({ actions }) => {
		actions.createTypes(`
			type Mdx implements Node {
				fields: MdxFields
				frontmatter: MdxFrontmatter
			}

			type MdxFields {
				handbookPath: String
			}

			type MdxFrontmatter {
				order: Int
				title: String
			}
		`);
	};

export const onCreateNode: GatsbyNode["onCreateNode"] = ({ actions, node }) => {
	if (node.internal.type !== "Mdx") {
		return;
	}

	const contentFilePath = node.internal.contentFilePath;

	if (!contentFilePath || !isHandbookFile(contentFilePath)) {
		return;
	}

	actions.createNodeField({
		name: "handbookPath",
		node,
		value: toHandbookPath(contentFilePath),
	});
};

export const createPages: GatsbyNode["createPages"] = async (arguments_) => {
	await createPosts();
	await createCV();
	await createHandbook();

	async function createHandbook() {
		const { actions, graphql, reporter } = arguments_,
			{ createPage } = actions,
			result = await graphql<Queries.Query>(handbookPages);

		if (result.errors) {
			reporter.panicOnBuild("Error loading handbook MDX", result.errors);
		}

		if (!result.data) {
			throw new Error(`No handbook MDX data found`, {
				cause: result,
			});
		}

		for (const node of result.data.allMdx.nodes) {
			const handbookPath = node.fields?.handbookPath;

			if (!handbookPath) {
				throw new Error(`No handbookPath found`, {
					cause: node,
				});
			}

			createPage({
				component: `${handbookTemplate}?__contentFilePath=${String(node.internal.contentFilePath)}`,
				context: { id: node.id },
				path: handbookPath,
			});
		}
	}

	async function createCV() {
		const { actions, graphql, reporter } = arguments_,
			{ createPage } = actions,
			result = await graphql<Queries.Query>(cvPage, {
				cvFile,
			});

		if (result.errors) {
			reporter.panicOnBuild("Error loading MDX result", result.errors);
		}

		if (!result.data || !result.data.mdx) {
			throw new Error(`No MDX data found`, {
				cause: result,
			});
		}

		createPage({
			component: `${myCVTemplate}?__contentFilePath=${cvFile}`,
			context: { id: result.data.mdx.id },
			path: `/cv`,
		});
	}

	async function createPosts() {
		const { actions, graphql, reporter } = arguments_,
			{ createPage } = actions,
			result = await graphql<Queries.Query>(postPages);

		if (result.errors) {
			reporter.panicOnBuild("Error loading MDX result", result.errors);
		}

		if (!result.data) {
			throw new Error(`No MDX data found`, {
				cause: result,
			});
		}

		const data = result.data,
			// Create blog post pages.
			posts = data.allMdx.nodes;

		// You'll call `createPage` for each result
		for (const node of posts) {
			if (!node.frontmatter) {
				throw new Error(`No frontmatter found`, {
					cause: node,
				});
			}

			const { nanoId } = node.frontmatter;
			if (!isValidNanoId(nanoId)) {
				throw new Error(`Invalid nanoId`, {
					cause: node,
				});
			}

			const postPath = `/posts/${String(nanoId)}`;

			createPage({
				// Provide the path to the MDX content file so webpack can pick it up and transform it into JSX
				component: `${postTemplate}?__contentFilePath=${String(node.internal.contentFilePath)}`,

				/*
				 * You can use the values in this context in
				 * our page layout component
				 */
				context: { id: node.id },

				/*
				 * As mentioned above you could also query something else like frontmatter.title above and use a helper function
				 * like slugify to create a slug
				 */
				path: postPath,
			});
		}
	}
};

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
	actions,
}) => {
	actions.setWebpackConfig({
		resolve: {
			alias: {
				// eslint-disable-next-line unicorn/prefer-module
				"@n8v/site": path.resolve(__dirname, "src/"),
			},
		},
	});
};
