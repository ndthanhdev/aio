import type { TreeViewBaseItem } from "@mui/x-tree-view/models";

import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import TocOutlinedIcon from "@mui/icons-material/TocOutlined";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
	AppDrawer,
	type AppDrawerProps,
} from "@n8v/site/components/fragments/app-drawer";
import {
	AppFooter,
	type AppFooterProps,
} from "@n8v/site/components/fragments/app-footer";
import {
	AppHeader,
	type AppHeaderProps,
} from "@n8v/site/components/fragments/app-header";
import { HandbookNav } from "@n8v/site/components/fragments/handbook-nav";
import { OnThisPage } from "@n8v/site/components/fragments/on-this-page";
import * as React from "react";

import { styles } from "./styles";

enum BottomTab {
	Contents = "contents",
	OnThisPage = "on-this-page",
}

export type HandbookTemplateProps = React.PropsWithChildren<{
	appDrawerProps: AppDrawerProps;
	appFooterProps: AppFooterProps;
	appHeaderProps: AppHeaderProps;
	currentPath: string;
	headings: TreeViewBaseItem[];
	title?: null | string;
}>;

export const HandbookTemplate = ({
	appDrawerProps,
	appFooterProps,
	appHeaderProps,
	children,
	currentPath,
	headings,
	title,
}: HandbookTemplateProps) => {
	const [isContentsOpen, setIsContentsOpen] = React.useState(false);
	const [isOnThisPageOpen, setIsOnThisPageOpen] = React.useState(false);
	const pendingScrollReference = React.useRef<(() => void) | undefined>(
		undefined,
	);
	const hasHeadings = headings.length > 0;

	return (
		<>
			<AppHeader {...appHeaderProps} />
			<AppDrawer {...appDrawerProps} />
			<Container css={styles.main} maxWidth="xl">
				<Box aria-label="Handbook" component="nav" css={styles.nav}>
					<HandbookNav currentPath={currentPath} />
				</Box>
				<Box component="article" css={styles.content}>
					<Typography component="h1" css={styles.title} variant="h2">
						{title}
					</Typography>
					{children}
				</Box>
				<Box component="aside" css={styles.toc}>
					<OnThisPage currentPath={currentPath} headings={headings} />
				</Box>
			</Container>
			<AppFooter {...appFooterProps} />
			<Box css={styles.bottomBarSpacer(hasHeadings)} />

			<Paper
				component="nav"
				css={styles.bottomBar(hasHeadings)}
				elevation={8}
				square
			>
				<BottomNavigation
					showLabels
					value={
						isContentsOpen
							? BottomTab.Contents
							: isOnThisPageOpen
								? BottomTab.OnThisPage
								: false
					}
				>
					<BottomNavigationAction
						css={styles.contentsTab}
						icon={<MenuBookOutlinedIcon />}
						label="Contents"
						onClick={() => {
							setIsContentsOpen(true);
						}}
						value={BottomTab.Contents}
					/>
					{hasHeadings && (
						<BottomNavigationAction
							css={styles.onThisPageTab}
							icon={<TocOutlinedIcon />}
							label="On this page"
							onClick={() => {
								setIsOnThisPageOpen(true);
							}}
							value={BottomTab.OnThisPage}
						/>
					)}
				</BottomNavigation>
			</Paper>

			<Drawer
				anchor="left"
				css={styles.drawer}
				onClose={() => {
					setIsContentsOpen(false);
				}}
				open={isContentsOpen}
			>
				<HandbookNav
					currentPath={currentPath}
					onNavigate={() => {
						setIsContentsOpen(false);
					}}
				/>
			</Drawer>
			<Drawer
				anchor="right"
				css={styles.drawer}
				onClose={() => {
					setIsOnThisPageOpen(false);
				}}
				open={isOnThisPageOpen}
				SlideProps={{
					onExited: () => {
						pendingScrollReference.current?.();
						pendingScrollReference.current = undefined;
					},
				}}
			>
				<Box css={styles.drawerOnThisPage}>
					<OnThisPage
						currentPath={currentPath}
						headings={headings}
						onSelect={(scrollToHeading) => {
							pendingScrollReference.current = scrollToHeading;
							setIsOnThisPageOpen(false);
						}}
					/>
				</Box>
			</Drawer>
		</>
	);
};
