import Box from "@mui/material/Box";
import {
	PostItem,
	type PostItemProps,
} from "@n8v/site/components/fragments/post-item";
import {
	MainTemplate,
	type MainTemplateProps,
} from "@n8v/site/components/layouts/main";

export interface HomeFrameProps {
	mainTemplateProps: MainTemplateProps;
	posts: PostItemProps[];
}

export const HomeFrame = ({ mainTemplateProps, posts }: HomeFrameProps) => {
	return (
		<MainTemplate {...mainTemplateProps}>
			<Box>
				<Box>
					{posts.map((post) => (
						<PostItem key={post.link} {...post} />
					))}
				</Box>
			</Box>
		</MainTemplate>
	);
};
