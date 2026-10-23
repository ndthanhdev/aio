import type { TreeViewBaseItem } from "@mui/x-tree-view/models";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { stickyTop } from "@n8v/site/components/layouts/handbook/styles";
import { treeIndentation } from "@n8v/site/components/layouts/handbook/tree-styles";
import { useActiveHeading } from "@n8v/site/hooks/use-active-heading";
import * as React from "react";

import { styles } from "./styles";

export interface OnThisPageProps {
	currentPath: string;
	/** Heading items from `toHeadingItems`. */
	headings: TreeViewBaseItem[];
	/** Called with the scroll to the selected heading; runs the scroll right away when omitted. */
	onSelect?: (scrollToHeading: () => void) => void;
}

/** An entry of `gatsby-plugin-mdx`'s `tableOfContents` field. */
export interface TableOfContentsItem {
	items?: TableOfContentsItem[];
	title?: string;
	url?: string;
}

/** Replaces entries without a heading (h1s, skipped levels) with their children. */
const withoutWrappers = (
	items: TableOfContentsItem[],
	unwrapTopLevel: boolean,
): TableOfContentsItem[] =>
	items.flatMap((item) =>
		unwrapTopLevel || !item.url
			? withoutWrappers(item.items ?? [], false)
			: [item],
	);

const toTreeItems = (items: TableOfContentsItem[]): TreeViewBaseItem[] =>
	withoutWrappers(items, false).map((item) => ({
		children: toTreeItems(item.items ?? []),
		id: (item.url ?? "").replace(/^#/u, ""),
		label: item.title ?? "",
	}));

/**
 * Maps a page's `tableOfContents` items to tree items with h2 headings at the
 * top level. `pageHasH1` tells whether the top level of `items` holds h1s.
 */
export const toHeadingItems = (
	items: TableOfContentsItem[],
	pageHasH1: boolean,
): TreeViewBaseItem[] => toTreeItems(withoutWrappers(items, pageHasH1));

const flattenIds = (items: TreeViewBaseItem[]): string[] =>
	items.flatMap((item) => [item.id, ...flattenIds(item.children ?? [])]);

const isFromExpansionIcon = (event: null | React.SyntheticEvent) =>
	event?.target instanceof Element &&
	event.target.closest(`.${treeItemClasses.iconContainer}`) !== null;

const scrollToHeading = (id: string) => {
	if (decodeURIComponent(globalThis.location.hash.slice(1)) === id) {
		document.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView();
	} else {
		globalThis.location.hash = id;
	}
};

export const OnThisPage = ({
	currentPath,
	headings,
	onSelect,
}: OnThisPageProps) => {
	const ids = React.useMemo(() => flattenIds(headings), [headings]);
	const theme = useTheme();
	const activeId = useActiveHeading(ids, Number.parseFloat(stickyTop(theme)));
	/** Headings near the end of a page can't scroll into the active band, so a clicked heading stays selected until the active heading changes. */
	const [clickedId, setClickedId] = React.useState<string>();
	const selectedId = clickedId ?? activeId;

	React.useEffect(() => {
		setClickedId(undefined);
	}, [activeId]);

	return headings.length === 0 ? undefined : (
		<Box component="nav">
			<Typography css={styles.caption} variant="overline">
				On this page
			</Typography>
			<RichTreeView
				aria-label="On this page"
				css={styles.tree}
				defaultExpandedItems={headings
					.filter((item) => item.children?.length)
					.map((item) => item.id)}
				expansionTrigger="iconContainer"
				itemChildrenIndentation={treeIndentation}
				items={headings}
				key={`${currentPath} ${ids.join(" ")}`}
				onSelectedItemsChange={(event, itemId) => {
					if (isFromExpansionIcon(event)) {
						return;
					}

					const targetId = itemId ?? selectedId;

					if (!targetId) {
						return;
					}

					setClickedId(targetId);

					const scroll = () => {
						scrollToHeading(targetId);
					};

					if (onSelect) {
						onSelect(scroll);
					} else {
						scroll();
					}
				}}
				// `null` keeps the tree controlled while no heading is active; `undefined` would hand selection back to the tree.
				// eslint-disable-next-line unicorn/no-null
				selectedItems={selectedId ?? null}
			/>
		</Box>
	);
};
