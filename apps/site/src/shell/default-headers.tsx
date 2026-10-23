import "modern-normalize/modern-normalize.css";

import type { SetNonNullable } from "type-fest";

import { MyHelmet } from "@n8v/site/components/elements/my-helmet";
import { graphql, useStaticQuery } from "gatsby";
import * as R from "ramda";

export const useSiteMetadata = () => {
	const data = useStaticQuery<Queries.SiteMetadataQuery>(graphql`
		query SiteMetadata {
			site {
				siteMetadata {
					title
					description
				}
			}
		}
	`).site?.siteMetadata;

	return R.mergeDeepRight(
		{
			description: "",
			title: "",
		} satisfies SetNonNullable<typeof data>,
		data ?? {},
	);
};

export const DefaultHeaders = () => {
	const data = useSiteMetadata();

	return (
		<MyHelmet>
			<meta
				content="9OBwzAgCmUComfywGqCjEriNiYJ8qS4OYM9Fz4fan7s"
				name="google-site-verification"
			/>
			<title id="title">{data.title}</title>
			<meta content={data.description} name="description" />
		</MyHelmet>
	);
};
