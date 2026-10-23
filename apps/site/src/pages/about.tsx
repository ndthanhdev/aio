import { AboutFrame } from "@n8v/site/components/screens/about";
import { useMainTemplateProps } from "@n8v/site/hooks/use-main-template-props";

function AboutPage() {
	const mainTemplateProps = useMainTemplateProps();

	return <AboutFrame mainTemplateProps={mainTemplateProps} />;
}

export default AboutPage;
