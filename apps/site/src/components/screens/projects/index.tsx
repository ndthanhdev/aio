import * as mui from "@mui/material";
import { ProjectCard } from "@n8v/site/components/fragments/project-card";
import {
	MainTemplate,
	type MainTemplateProps,
} from "@n8v/site/components/layouts/main";

import { styles } from "./styles";

export interface Project {
	description?: string;
	frameUrl?: string;
	title: string;
	url: string;
}

export interface ProjectsScreenProps {
	mainTemplateProps: MainTemplateProps;
	onCopy?: (url: string) => void;
	projects: Project[];
}

export const ProjectsScreen = ({
	mainTemplateProps,
	onCopy,
	projects,
}: ProjectsScreenProps) => {
	return (
		<MainTemplate css={styles.root} maxWidth="xl" {...mainTemplateProps}>
			<mui.Stack direction="row" spacing={2}>
				{projects.map((project) => (
					<ProjectCard
						description={project.description}
						frameUrl={project.frameUrl}
						key={project.url}
						onCopy={() => {
							onCopy?.(project.url);
						}}
						title={project.title}
						url={project.url}
					/>
				))}
			</mui.Stack>
		</MainTemplate>
	);
};
