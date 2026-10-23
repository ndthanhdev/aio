import { Link } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
	MainTemplate,
	type MainTemplateProps,
} from "@n8v/site/components/layouts/main";

export interface NotFoundFrameProps {
	mainTemplateProps: MainTemplateProps;
}

export const NotFoundFrame = ({ mainTemplateProps }: NotFoundFrameProps) => {
	return (
		<MainTemplate {...mainTemplateProps}>
			<Typography variant="h1">Page not found</Typography>
			<Typography variant="body1">
				Sorry 😔 we couldn’t find what you were looking for.
			</Typography>
			<Link href="/">Go home</Link>
		</MainTemplate>
	);
};
