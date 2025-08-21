// stores/notification-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Notification } from "../types/notifications";

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isDropdownOpen: boolean;

  // Actions
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  setDropdownOpen: (isOpen: boolean) => void;

  // Computed
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: Notification["type"]) => Notification[];
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isDropdownOpen: false,

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `notification_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          timestamp: new Date(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + (newNotification.read ? 0 : 1),
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
          unreadCount: 0,
        }));
      },

      deleteNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          const wasUnread = notification && !notification.read;

          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: wasUnread
              ? Math.max(0, state.unreadCount - 1)
              : state.unreadCount,
          };
        });
      },

      clearAllNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      setDropdownOpen: (isOpen) => {
        set({ isDropdownOpen: isOpen });
      },

      getUnreadNotifications: () => {
        return get().notifications.filter((n) => !n.read);
      },

      getNotificationsByType: (type) => {
        return get().notifications.filter((n) => n.type === type);
      },
    }),
    {
      name: "sparta-notifications",
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
