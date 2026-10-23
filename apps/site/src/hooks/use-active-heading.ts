import * as React from "react";

/**
 * Returns the id of the topmost heading in the active band, which runs from
 * `topOffset` pixels below the top of the viewport to its top third. When no
 * heading is in the band, the last heading above it stays active.
 */
export const useActiveHeading = (
	ids: readonly string[],
	topOffset: number,
): string | undefined => {
	const [activeId, setActiveId] = React.useState<string>();
	const idsKey = ids.join(" ");

	React.useEffect(() => {
		const headings = idsKey
			.split(" ")
			.filter(Boolean)
			.map((id) => document.querySelector<HTMLElement>(`#${CSS.escape(id)}`))
			.filter((element): element is HTMLElement => element !== null);

		if (headings.length === 0) {
			return;
		}

		const visibleIds = new Set<string>();

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						visibleIds.add(entry.target.id);
					} else {
						visibleIds.delete(entry.target.id);
					}
				}

				const topmostVisible = headings.find((heading) =>
					visibleIds.has(heading.id),
				);
				const lastAbove = headings.findLast(
					(heading) => heading.getBoundingClientRect().top < topOffset,
				);

				setActiveId((topmostVisible ?? lastAbove)?.id);
			},
			{ rootMargin: `-${String(topOffset)}px 0px -66% 0px` },
		);

		for (const heading of headings) {
			observer.observe(heading);
		}

		return () => {
			observer.disconnect();
		};
	}, [idsKey, topOffset]);

	return activeId;
};
