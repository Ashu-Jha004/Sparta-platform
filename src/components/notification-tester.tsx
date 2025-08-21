// components/notification-tester.tsx
"use client";

import { useNotificationStore } from "../../stores/notification-store";

export function NotificationTester() {
  const { addNotification } = useNotificationStore();

  const createSampleNotifications = () => {
    addNotification({
      title: "Challenge Request",
      message: "John Doe wants to challenge you to a tennis match",
      type: "challenge",
      read: false,
      userId: "user123",
      actionUrl: "/matches/challenge/123",
      metadata: { challengerId: "john_doe", matchId: "match_123" },
    });

    addNotification({
      title: "Achievement Unlocked!",
      message: "You've earned the 'First Win' badge",
      type: "achievement",
      read: false,
      userId: "user123",
    });

    addNotification({
      title: "Payment Received",
      message: "You received 50 coins for winning your match",
      type: "payment",
      read: false,
      userId: "user123",
      metadata: { amount: 50 },
    });
  };

  return (
    <div className="p-4">
      <button
        onClick={createSampleNotifications}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Add Sample Notifications
      </button>
    </div>
  );
}
