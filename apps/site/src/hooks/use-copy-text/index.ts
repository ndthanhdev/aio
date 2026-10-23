import { useNotifyCopied } from "@n8v/site/hooks/notifications";
import { useCopyToClipboard } from "usehooks-ts";

export const useCopyText = () => {
	const [, copy] = useCopyToClipboard();
	const notifyCopied = useNotifyCopied();

	const copyText = (text: string) => {
		copy(text)
			.then(() => {
				notifyCopied();
			})
			.catch(() => {
				// Do nothing
			});
	};

	return copyText;
};
