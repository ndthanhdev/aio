import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type ReactNode } from "react";

import { styles } from "./styles";

export interface CvSectionDividerProps {
	children?: ReactNode;
}

export const CvSectionDivider = ({ children }: CvSectionDividerProps) => {
	const renderChildren = () => {
		if (typeof children === "string") {
			return (
				<Typography gutterBottom variant="subtitle1">
					{children}
				</Typography>
			);
		}
		return children;
	};

	return (
		<Stack
			css={styles.stack}
			direction="row"
			justifyContent="center"
			mb={2}
			mt={6}
		>
			<Divider css={styles.divider} textAlign="center">
				{renderChildren()}
			</Divider>
		</Stack>
	);
};
