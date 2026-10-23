import { Box, Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { styles } from "./styles";

export type AppFooterProps = React.PropsWithChildren<{
	buildNumber: string;
	mode: string;
	rev: string;
	year: string;
}>;

export const AppFooter = ({ buildNumber, mode, rev, year }: AppFooterProps) => (
	<Box css={styles.root}>
		<Divider />
		<Box css={styles.contentContainer}>
			<Box css={styles.topWrapper}>
				<Box css={styles.leftWrapper}>
					<Typography variant="caption">{`Rev: ${rev}`}</Typography>
					<Typography variant="caption">{`Build: ${buildNumber}`}</Typography>
					<Typography variant="caption">{`Mode: ${mode}`}</Typography>
				</Box>
				<Box css={styles.rightWrapper}>
					<Typography variant="caption">{`Copyright © ${year}`}</Typography>
				</Box>
			</Box>
		</Box>
	</Box>
);
