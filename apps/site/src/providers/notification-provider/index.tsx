import { NotificationContainer } from "@n8v/site/components/fragments/notification-container";

const Constants = {
	limit: 3,
	position: "bottom-center" as const,
};

export const NotificationProvider = () => {
	return (
		<NotificationContainer
			limit={Constants.limit}
			position={Constants.position}
		/>
	);
};
