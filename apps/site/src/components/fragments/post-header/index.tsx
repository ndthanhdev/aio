import Stack, { type StackProps } from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DateTime } from "luxon";

export type PostHeaderProps = Omit<
	StackProps<
		"div",
		{
			date?: null | string;
			title?: null | string;
		}
	>,
	"sx"
>;

export const PostHeader = ({ date, title, ...stackProps }: PostHeaderProps) => {
	const formatterDate = date
		? DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL)
		: "";

	return (
		<Stack spacing={1} {...stackProps}>
			<Typography variant="caption">{formatterDate}</Typography>
			<Typography variant="h2">{title}</Typography>
		</Stack>
	);
};
