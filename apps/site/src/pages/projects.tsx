import { ProjectsScreen } from "@n8v/site/components/screens/projects";
import { useProjects } from "@n8v/site/hooks/use-apps";
import { useMainTemplateProps } from "@n8v/site/hooks/use-main-template-props";

import { useCopyText } from "../hooks/use-copy-text";

export const AppsPage = () => {
	const mainTemplateProps = useMainTemplateProps();
	const handleCopy = useCopyText();

	return (
		<ProjectsScreen
			mainTemplateProps={mainTemplateProps}
			onCopy={(url) => {
				handleCopy(new URL(url, globalThis.origin).href);
			}}
			projects={useProjects()}
		/>
	);
};

export default AppsPage;
