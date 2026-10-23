import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link as GatsbyLink } from "gatsby";
import { DateTime } from "luxon";

import { styles } from "./styles";

export interface PostItemProps {
	date?: string;
	excerpt?: string;
	link: string;
	thumb?: string;
	title?: string;
}

export const PostItem = ({
	date: dateProperty,
	excerpt,
	link,
	thumb,
	title,
}: PostItemProps) => {
	const date = dateProperty
		? DateTime.fromISO(dateProperty).toLocaleString(DateTime.DATE_FULL)
		: "";

	return (
		<Box css={styles.root}>
			<Link
				component={GatsbyLink}
				css={styles.title}
				to={link}
				underline="none"
				variant="h6"
			>
				{title}
			</Link>
			<Typography css={styles.date} variant="subtitle1">
				{date}
			</Typography>
			<Link
				component={GatsbyLink}
				css={styles.description}
				to="/posts/qs05qpu3c0p78ww123zv1/"
				underline="none"
				variant="body1"
			>
				{excerpt}
			</Link>
			{thumb ? (
				<img alt="post thumbnail" css={styles.thumb} src={thumb} />
			) : (
				<ArticleOutlinedIcon css={styles.thumb} />
			)}
			<Divider css={styles.divider} />
		</Box>
	);
};
