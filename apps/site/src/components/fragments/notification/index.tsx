import * as icon from "@mui/icons-material";
import * as mui from "@mui/material";
import { useRef } from "react";
import { type ToastContentProps } from "react-toastify";
import { match } from "ts-pattern";
import { useHover, useInterval } from "usehooks-ts";

import { styles } from "./styles";

const Constants = {
	autoHideDuration: 5000,
};

export interface NotificationProps
	extends Partial<ToastContentProps<React.ReactNode>>,
		mui.SnackbarContentProps {}

export const Notification = ({
	closeToast,
	data,
	toastProps,
}: NotificationProps) => {
	const snackIcon = match(toastProps?.type)
		.with("error", () => <icon.Cancel color="error" fontSize="medium" />)
		.with("success", () => (
			<icon.CheckCircle color="success" fontSize="medium" />
		))
		.with("warning", () => <icon.Warning color="warning" fontSize="medium" />)
		.otherwise(() => <icon.Info color="info" fontSize="medium" />);

	const action = (
		<mui.IconButton
			aria-label="close"
			color="inherit"
			onClick={closeToast}
			size="small"
		>
			<icon.Close fontSize="small" />
		</mui.IconButton>
	);

	const content = match(typeof data)
		.with("string", () => (
			<mui.Typography variant="subtitle1">{data}</mui.Typography>
		))
		.otherwise(() => data);

	const hoverReference = useRef(null);
	const isHovered = useHover(hoverReference);

	useInterval(
		() => closeToast?.("timeout"),
		// eslint-disable-next-line unicorn/no-null
		isHovered ? null : Constants.autoHideDuration,
	);

	const message = (
		<mui.Stack
			alignItems="center"
			direction="row"
			justifyContent="flex-start"
			spacing={1}
		>
			{snackIcon}
			{content}
		</mui.Stack>
	);

	return (
		<mui.SnackbarContent
			action={action}
			css={styles.root}
			message={message}
			ref={hoverReference}
		/>
	);
};
