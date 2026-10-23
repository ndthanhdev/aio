import React from "react";

export enum ShieldsStyle {
	Flat = "flat",
	FlatSquare = "flat-square",
	ForTheBadge = "for-the-badge",
	Plastic = "plastic",
	Social = "social",
}

type ShieldsIO<T extends React.ElementType = "img"> = {
	Comp?: React.ElementType;
	leftBg?: string;
	leftText?: string;

	logo?: string;
	logoColor?: string;

	logoWidth?: number;
	rightBg?: string;

	rightText?: string;

	shieldStyle?: ShieldsStyle;
} & React.ComponentPropsWithoutRef<T>;

export const ShieldsIO = React.forwardRef<HTMLElement, ShieldsIO>(
	function ShieldsIO(props, reference) {
		const {
			Comp = "img",
			leftBg,
			leftText = "",

			logo,
			logoColor,

			logoWidth,

			/*
			 * This is for by pass the case that leftText and rightText are both undefined
			 * shieldIO will return error if using query type
			 * if using path type one of 3 must be defined
			 * so we use color because using any character will affect the width of the shield
			 */
			rightBg = "#f0f0f0",

			rightText,

			shieldStyle = ShieldsStyle.Flat,

			...otherProps
		} = props;

		const source = React.useMemo(() => {
			let sUrl = "https://img.shields.io/badge/";

			sUrl += leftText ? `${leftText}-` : "-";
			sUrl += rightText ? `${rightText}-` : "-";
			sUrl += encodeURIComponent(rightBg);
			logo && (sUrl += `?logo=${logo}`);

			/*
			 * FIXME: support other extensions
			 * sUrl += ".svg";
			 */

			const url = new URL(sUrl);

			logoColor && url.searchParams.append("logoColor", logoColor);
			logoWidth && url.searchParams.append("logoWidth", logoWidth.toString());
			leftBg && url.searchParams.append("labelColor", leftBg);

			url.searchParams.append("style", shieldStyle);

			return url.toString();
		}, [
			logo,
			logoColor,
			logoWidth,
			leftText,
			leftBg,
			rightText,
			rightBg,
			shieldStyle,
		]);

		return <Comp {...otherProps} ref={reference} src={source} />;
	},
);
