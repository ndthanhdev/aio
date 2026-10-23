import Stack, { type StackProps } from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { styles } from "./styles";

export type PostImageProps = Omit<
	StackProps<
		"div",
		{
			caption?: React.ReactNode | string;
			src: string;
		}
	>,
	"sx"
>;

export const PostImage = ({ caption, src, ...cardProps }: PostImageProps) => {
	return (
		<Stack
			alignItems="center"
			css={styles.root}
			direction="column"
			spacing={1}
			{...cardProps}
		>
			<img
				alt={typeof caption === "string" ? caption : undefined}
				css={styles.image}
				src={src}
			/>
			{typeof caption === "string" ? (
				<Typography variant="caption">{caption}</Typography>
			) : (
				caption
			)}
		</Stack>
	);
};
