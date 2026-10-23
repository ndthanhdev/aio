import type React from "react";

import { useEventCallback } from "@mui/material";
import { Notification } from "@n8v/site/components/fragments/notification";
import { toast, type ToastOptions } from "react-toastify";

export const useNotify = () => {
	return useEventCallback((options: ToastOptions<React.ReactNode>) => {
		return toast<React.ReactNode>(<Notification />, options);
	});
};

export const useNotifyCopied = () => {
	const notify = useNotify();

	return useEventCallback(() => {
		notify({
			data: "Copied to clipboard",
			type: "success",
		});
	});
};
