import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { treeIndentation } from "@n8v/app/components/layouts/handbook/tree-styles";
import {
	isSectionItemId,
	toSectionItemId,
	useHandbookTree,
} from "@n8v/app/hooks/use-handbook-tree";
import { handbookSections, normalizePath } from "@n8v/app/utils/handbook";
import { navigate } from "gatsby";

import { styles } from "./styles";

export interface HandbookNavProps {
	currentPath: string;
	onNavigate?: () => void;
}

export const HandbookNav = ({ currentPath, onNavigate }: HandbookNavProps) => {
	const items = useHandbookTree();
	const path = normalizePath(currentPath);

	return (
		<RichTreeView
			aria-label="Handbook"
			css={styles.root}
			defaultExpandedItems={handbookSections.map((section) =>
				toSectionItemId(section.id),
			)}
			itemChildrenIndentation={treeIndentation}
			items={items}
			key={path}
			onSelectedItemsChange={(_, itemId) => {
				if (!itemId || isSectionItemId(itemId)) {
					return;
				}

				onNavigate?.();
				navigate(itemId);
			}}
			selectedItems={path}
		/>
	);
};
