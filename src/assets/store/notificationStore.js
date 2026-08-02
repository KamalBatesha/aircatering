import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [],

  setNotifications: (newNotifications) => {
    set({ notifications: newNotifications });
  },

  // Unread = notificationStatusId === 1, purely from server data
  getUnreadCount: () => {
    const { notifications } = get();
    return notifications.filter((n) => n.notificationStatusId === 1).length;
  },
}));
