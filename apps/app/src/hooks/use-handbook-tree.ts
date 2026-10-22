import type { TreeViewBaseItem } from "@mui/x-tree-view/models";

import {
	handbookRootPath,
	handbookSections,
	toHandbookSectionId,
} from "@n8v/app/utils/handbook";
import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";

export const toSectionItemId = (sectionId: string) => `section:${sectionId}`;

export const isSectionItemId = (itemId: string) =>
	itemId.startsWith("section:");

interface HandbookPage {
	order: number;
	path: string;
	title: string;
}

const byOrderThenTitle = (a: HandbookPage, b: HandbookPage) =>
	a.order - b.order || a.title.localeCompare(b.title);

/**
 * Items are "About this handbook" followed by one item per section.
 * Page item ids are page paths; section item ids come from `toSectionItemId`.
 */
export const useHandbookTree = (): TreeViewBaseItem[] => {
	const data = useStaticQuery<Queries.HandbookTreeQuery>(graphql`
		query HandbookTree {
			allMdx(filter: { fields: { handbookPath: { ne: null } } }) {
				nodes {
					fields {
						handbookPath
					}
					frontmatter {
						order
						title
					}
				}
			}
		}
	`);

	return React.useMemo(() => {
		const pages: HandbookPage[] = data.allMdx.nodes.flatMap((node) => {
			const path = node.fields?.handbookPath;

			return path
				? [
						{
							order: node.frontmatter?.order ?? Number.POSITIVE_INFINITY,
							path,
							title: node.frontmatter?.title ?? path,
						},
					]
				: [];
		});

		const rootPage = pages.find((page) => page.path === handbookRootPath);

		const sectionItems = handbookSections.map((section) => ({
			children: pages
				.filter((page) => toHandbookSectionId(page.path) === section.id)
				.sort(byOrderThenTitle)
				.map((page) => ({ id: page.path, label: page.title })),
			id: toSectionItemId(section.id),
			label: section.label,
		}));

		return [
			...(rootPage ? [{ id: rootPage.path, label: rootPage.title }] : []),
			...sectionItems,
		];
	}, [data]);
};
