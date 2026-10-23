import { css } from "@emotion/react";
import { position } from "polished";

export const styles = {
	closeRoot: () =>
		css({
			...position("relative", 0, 0, 0, 0),
			alignItems: "center",
			display: "inline-flex",
			justifyContent: "center",
		}),

	root: () =>
		css({
			...position("relative", 0, 0, 0, 0),
		}),
};
