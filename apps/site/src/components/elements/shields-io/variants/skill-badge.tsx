import { cx } from "@emotion/css";
import React from "react";

import { iconShieldStyles } from "../shared-styles";
import { ShieldsIO, ShieldsStyle } from "../shields-io";

export type SkillBadgeProps = {
	skill: string;
	skillLogo?: string;
} & React.ComponentPropsWithoutRef<"img">;

export const SkillBadge = React.forwardRef<HTMLElement, SkillBadgeProps>(
	function SkillBadge(props, reference) {
		const {
			className: classNameProperty,
			skill,
			skillLogo: skillLogoProperty,
			...otherProps
		} = props;

		const skillLogo = skillLogoProperty ?? skill;

		return (
			<ShieldsIO
				{...otherProps}
				alt={skill}
				className={cx("ndt-skill-badge", classNameProperty)}
				css={iconShieldStyles.wrapper}
				leftBg="white"
				leftText=""
				logo={skillLogo}
				ref={reference}
				rightText={skill}
				shieldStyle={ShieldsStyle.ForTheBadge}
			/>
		);
	},
);
