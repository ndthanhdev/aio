import { MyHelmet } from "@n8v/site/components/elements/my-helmet";
import {
	type TableOfContentsItem,
	toHeadingItems,
} from "@n8v/site/components/fragments/on-this-page";
import { HandbookTemplate } from "@n8v/site/components/layouts/handbook";
import { useMainTemplateProps } from "@n8v/site/hooks/use-main-template-props";
import { AppMDXProvider } from "@n8v/site/providers/mdx-provider";
import { useSiteMetadata } from "@n8v/site/shell/default-headers";
import { graphql, type PageProps } from "gatsby";
import * as React from "react";

export type HandbookLayoutProps = PageProps<Queries.HandbookTemplateQuery>;

interface TableOfContents {
	items?: TableOfContentsItem[];
}

const HandbookLayout = ({ children, data, location }: HandbookLayoutProps) => {
	const siteMetadata = useSiteMetadata();
	const mainTemplateProps = useMainTemplateProps();

	const title = data.mdx?.frontmatter?.title;
	const tableOfContents = data.mdx?.tableOfContents as
		| TableOfContents
		| undefined;
	const h1TableOfContents = data.mdx?.h1TableOfContents as
		| TableOfContents
		| undefined;
	const headings = React.useMemo(
		() =>
			toHeadingItems(
				tableOfContents?.items ?? [],
				Boolean(h1TableOfContents?.items?.length),
			),
		[tableOfContents, h1TableOfContents],
	);

	return (
		<AppMDXProvider>
			<MyHelmet>
				<title>{`${title ?? ""} | Handbook | ${siteMetadata.title}`}</title>
			</MyHelmet>
			<HandbookTemplate
				{...mainTemplateProps}
				currentPath={location.pathname}
				headings={headings}
				title={title}
			>
				{children}
			</HandbookTemplate>
		</AppMDXProvider>
	);
};

export default HandbookLayout;

export const pageQuery = graphql`
	query HandbookTemplate($id: String!) {
		mdx(id: { eq: $id }) {
			frontmatter {
				title
			}
			tableOfContents(maxDepth: 3)
			h1TableOfContents: tableOfContents(maxDepth: 1)
		}
	}
`;
