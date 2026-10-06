import api from "./api";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type:
    | "BUDGET_WARNING"
    | "BUDGET_EXCEEDED"
    | "GOAL_REMINDER"
    | "RECURRING_TRANSACTION"
    | "SYSTEM";
  read: boolean;
  createdAt: string;
}

export interface UnreadNotificationCount {
  count: number;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<Notification[]>(
    "/api/notifications"
  );

  return response.data;
};

export const getUnreadNotifications =
  async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>(
      "/api/notifications/unread"
    );

    return response.data;
  };

export const getUnreadNotificationCount =
  async (): Promise<UnreadNotificationCount> => {
    const response =
      await api.get<UnreadNotificationCount>(
        "/api/notifications/unread/count"
      );

    return response.data;
  };

export const markNotificationAsRead = async (
  notificationId: number
): Promise<void> => {
  await api.patch(
    `/api/notifications/${notificationId}/read`
  );
};

export const markAllNotificationsAsRead =
  async (): Promise<void> => {
    await api.patch(
      "/api/notifications/read-all"
    );
  };