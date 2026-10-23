import React from "react";
import { Helmet as BaseComp } from "react-helmet";

const Base = BaseComp as React.ComponentType<React.PropsWithChildren<object>>;

export type MyHelmetProps = React.PropsWithChildren<object>;

export const MyHelmet = ({ children }: MyHelmetProps) => (
	<Base>{children}</Base>
);
