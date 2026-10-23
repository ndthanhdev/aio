import { type PostItemProps } from "@n8v/site/components/fragments/post-item";
import { HomeFrame } from "@n8v/site/components/screens/home";
import { useMainTemplateProps } from "@n8v/site/hooks/use-main-template-props";
import { graphql, type PageProps } from "gatsby";

// eslint-disable-next-line unicorn/prevent-abbreviations
export type HomePageProps = PageProps<Queries.HomeQuery>;

function HomePage({ data }: HomePageProps) {
	const mainTemplateProps = useMainTemplateProps();

	const posts = data.allMdx.nodes.map((post) => {
		return {
			date: post.frontmatter?.date,
			excerpt: post.excerpt,
			link: `/posts/${String(post.frontmatter?.nanoId)}`,
			thumb: post.frontmatter?.thumb?.publicURL,
			title: post.frontmatter?.title,
		} as PostItemProps;
	});

	return <HomeFrame mainTemplateProps={mainTemplateProps} posts={posts} />;
}

export default HomePage;

export const pageQuery = graphql`
	query Home {
		allMdx(
			filter: {
				frontmatter: { wip: { ne: true } }
				internal: { contentFilePath: { glob: "**/posts/**" } }
			}
			sort: { frontmatter: { date: DESC } }
		) {
			nodes {
				id
				frontmatter {
					title
					nanoId
					date
					thumb {
						publicURL
					}
				}
				excerpt
			}
		}
	}
`;
