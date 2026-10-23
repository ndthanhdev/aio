import * as mui from "@mui/material";
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
import React from "react";

import { styles } from "./styles";

export interface MainTemplateProps
	extends Omit<mui.ContainerProps<"main">, "sx"> {
	appDrawerProps: AppDrawerProps;
	appFooterProps: AppFooterProps;
	appHeaderProps: AppHeaderProps;
}

export const MainTemplate = ({
	appDrawerProps,
	appFooterProps,
	appHeaderProps,
	children,
	...otherProps
}: MainTemplateProps) => (
	<React.Fragment>
		<AppHeader {...appHeaderProps} />
		<AppDrawer {...appDrawerProps} />
		<mui.Container component="main" css={styles.main} {...otherProps}>
			{children}
		</mui.Container>
		<AppFooter {...appFooterProps} />
	</React.Fragment>
);
