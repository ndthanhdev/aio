import Stack from "@mui/material/Stack";
import React from "react";

import { styles } from "./styles";

export const CVTemplate: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => (
	<div css={styles.root}>
		<Stack css={styles.stack}>{children}</Stack>
	</div>
);
