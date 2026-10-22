export const handbookRootPath = "/handbook";

export const handbookSections = [
	{ id: "concepts", label: "Concepts" },
	{ id: "how-tos", label: "How-tos" },
	{ id: "how-it-works", label: "How it works" },
] as const;

export type HandbookSectionId = (typeof handbookSections)[number]["id"];

const handbookFilePattern = /\/content\/handbook\/(.+)\.mdx$/u;

const isHandbookSectionId = (id?: string): id is HandbookSectionId =>
	handbookSections.some((section) => section.id === id);

export const isHandbookFile = (contentFilePath: string): boolean =>
	handbookFilePattern.test(contentFilePath);

/**
 * Maps `content/handbook/index.mdx` to `/handbook` and
 * `content/handbook/<section>/<file>.mdx` to `/handbook/<section>/<file>`.
 * Throws for any other layout so a misplaced file fails the build.
 */
export const toHandbookPath = (contentFilePath: string): string => {
	const relativePath = handbookFilePattern.exec(contentFilePath)?.[1];

	if (!relativePath) {
		throw new Error(`Not a handbook file: ${contentFilePath}`);
	}

	if (relativePath === "index") {
		return handbookRootPath;
	}

	const [section, fileName, ...rest] = relativePath.split("/");

	if (!isHandbookSectionId(section) || !fileName || rest.length > 0) {
		const sectionIds = handbookSections.map(({ id }) => id).join(", ");

		throw new Error(
			`Handbook pages must live in content/handbook/<section>/<file>.mdx with <section> one of: ${sectionIds}. Got: ${contentFilePath}`,
		);
	}

	return `${handbookRootPath}/${section}/${fileName}`;
};

export const normalizePath = (path: string): string =>
	path.length > 1 ? path.replace(/\/+$/u, "") : path;

export const toHandbookSectionId = (
	path: string,
): HandbookSectionId | undefined => {
	const section = normalizePath(path)
		.slice(handbookRootPath.length + 1)
		.split("/")[0];

	return isHandbookSectionId(section) ? section : undefined;
};
