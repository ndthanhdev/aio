import { css } from "@emotion/react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type AppTheme } from "@n8v/site/theme";
import * as React from "react";

export type WipProps = React.PropsWithChildren<object>;

const styles = {
	description: (theme: AppTheme) =>
		css({
			fontWeight: theme.typography.fontWeightMedium,
		}),
	root: () =>
		css({
			minHeight: "90vh",
		}),
};

export const Wip = () => (
	<Stack alignItems="center" css={styles.root} justifyContent="center">
		<Typography css={styles.description} variant="h1">
			{"Wip ;)"}
		</Typography>
	</Stack>
);
