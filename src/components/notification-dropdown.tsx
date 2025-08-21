// components/notification-dropdown.tsx
"use client";

import { useEffect, useRef } from "react";
import {
  Bell,
  X,
  Check,
  Trophy,
  Coins,
  Swords,
  AlertCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useNotificationStore } from "../../stores/notification-store";
import { Notification, NotificationType } from "../../types/notifications";
import { formatDistanceToNow } from "date-fns";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "match_request":
      return <Swords className="h-4 w-4 text-blue-500" />;
    case "achievement":
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    case "payment":
      return <Coins className="h-4 w-4 text-green-500" />;
    case "rank_update":
      return <TrendingUp className="h-4 w-4 text-purple-500" />;
    case "challenge":
      return <Swords className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "match_request":
      return "border-l-blue-500";
    case "achievement":
      return "border-l-yellow-500";
    case "payment":
      return "border-l-green-500";
    case "rank_update":
      return "border-l-purple-500";
    case "challenge":
      return "border-l-red-500";
    default:
      return "border-l-gray-500";
  }
};

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotificationStore();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 
               border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl 
               z-50 max-h-[500px] overflow-hidden transition-all duration-300 ease-in-out"
    >
      {/* Header */}
      <div
        className="p-4 border-b border-gray-200 dark:border-gray-700 
                    flex items-center justify-between bg-gray-50 dark:bg-slate-700"
      >
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 
                       dark:hover:text-blue-300 transition-colors font-medium"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 
                     dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No notifications yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              We'll notify you when something important happens
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 
                       hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer
                       transition-all duration-200 border-l-4 ${getNotificationColor(
                         notification.type
                       )}
                       ${
                         !notification.read
                           ? "bg-blue-50 dark:bg-blue-900/10"
                           : ""
                       }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-medium ${
                          !notification.read
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                      )}
                    </div>

                    <p
                      className={`text-sm mt-1 ${
                        !notification.read
                          ? "text-gray-700 dark:text-gray-300"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                        })}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div
          className="p-3 border-t border-gray-200 dark:border-gray-700 
                      bg-gray-50 dark:bg-slate-700"
        >
          <div className="flex justify-between items-center">
            <button
              onClick={clearAllNotifications}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 
                       dark:hover:text-red-300 transition-colors font-medium"
            >
              Clear all
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {notifications.length} total notifications
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
