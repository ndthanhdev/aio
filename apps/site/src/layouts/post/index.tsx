import { MyHelmet } from "@n8v/site/components/elements/my-helmet";
import { PostTemplate } from "@n8v/site/components/layouts/post";
import { useMainTemplateProps } from "@n8v/site/hooks/use-main-template-props";
import { AppMDXProvider } from "@n8v/site/providers/mdx-provider";
import { useSiteMetadata } from "@n8v/site/shell/default-headers";
import { graphql, type PageProps } from "gatsby";

export type PostLayoutProps = PageProps<Queries.PostTemplateQuery>;
const PostLayout = ({ children, data }: PostLayoutProps) => {
	const siteMetadata = useSiteMetadata();

	const mainTemplateProps = useMainTemplateProps();

	return (
		<AppMDXProvider>
			<MyHelmet>
				<title>
					{data.mdx?.frontmatter?.title} | {siteMetadata.title}
				</title>
			</MyHelmet>
			<PostTemplate
				{...mainTemplateProps}
				postHeaderProps={{
					date: data.mdx?.frontmatter?.date,
					title: data.mdx?.frontmatter?.title,
				}}
			>
				{children}
			</PostTemplate>
		</AppMDXProvider>
	);
};

export default PostLayout;

export const pageQuery = graphql`
	query PostTemplate($id: String!) {
		mdx(id: { eq: $id }) {
			frontmatter {
				title
				date
			}
		}
	}
`;
