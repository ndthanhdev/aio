import { css } from "@emotion/react";

export const styles = {
	root: () =>
		css({
			[`& .Toastify__toast`]: {
				backgroundColor: "transparent",
				boxShadow: "none",
				color: "initial",
				padding: 0,
			},
		}),
};
