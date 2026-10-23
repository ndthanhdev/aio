import { ToastContainer, type ToastContainerProps } from "react-toastify";

import { styles } from "./styles";

export const NotificationContainer = (props: ToastContainerProps) => {
	return (
		<ToastContainer
			closeButton={false}
			css={styles.root}
			customProgressBar
			icon={false}
			{...props}
		/>
	);
};
