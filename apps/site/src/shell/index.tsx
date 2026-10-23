import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import * as React from "react";

import { NotificationProvider } from "../providers/notification-provider";
import { AppThemeProvider } from "../providers/theme-provider";
import { DefaultHeaders } from "./default-headers";

// eslint-disable-next-line unicorn/prevent-abbreviations
export type ShellProps = React.PropsWithChildren<{
	children?: React.ReactNode;
}>;

const Shell = ({ children }: ShellProps) => (
	<AppThemeProvider>
		<DefaultHeaders />
		{children}
		<NotificationProvider />
	</AppThemeProvider>
);

export default Shell;
