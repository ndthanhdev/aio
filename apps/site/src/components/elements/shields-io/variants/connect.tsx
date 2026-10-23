import { cx } from "@emotion/css";
import Link from "@mui/material/Link";
import React from "react";

import { iconShieldStyles } from "../shared-styles";
import { ShieldsIO, ShieldsStyle } from "../shields-io";

export type ConnectProps = {
	connect: string;
	connectColor?: string;
	connectLogo?: string;
	url?: string;
} & React.ComponentPropsWithoutRef<"img">;

export const Connect = React.forwardRef<HTMLAnchorElement, ConnectProps>(
	function Connect(props, reference) {
		const {
			className: classNameProperty,
			connect,
			connectColor,
			connectLogo: connectLogoProperty,
			url,
			...otherProps
		} = props;

		const connectLogo = connectLogoProperty ?? connect;

		return (
			<Link
				css={iconShieldStyles.wrapper}
				href={url ?? "#"}
				ref={reference}
				target={url ? "_blank" : "_self"}
				underline="none"
			>
				<ShieldsIO
					{...otherProps}
					alt={connect}
					className={cx("ndt-skill-badge", classNameProperty)}
					leftBg="white"
					logo={connectLogo}
					logoColor={connectColor}
					rightText={connect}
					shieldStyle={ShieldsStyle.ForTheBadge}
				/>
			</Link>
		);
	},
);
