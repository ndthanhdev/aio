import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
	MainTemplate,
	type MainTemplateProps,
} from "@n8v/site/components/layouts/main";

import { styles } from "./styles";

export interface AboutFrameProps {
	mainTemplateProps: MainTemplateProps;
}

export const AboutFrame = ({ mainTemplateProps }: AboutFrameProps) => {
	return (
		<MainTemplate {...mainTemplateProps}>
			<Container maxWidth="lg">
				<Stack
					alignItems="center"
					css={styles.mainWrapper}
					justifyContent="center"
				>
					<Typography css={styles.brief} variant="h1">
						{"A developer, an open source lover and a gamer"}
					</Typography>
				</Stack>
			</Container>
		</MainTemplate>
	);
};
