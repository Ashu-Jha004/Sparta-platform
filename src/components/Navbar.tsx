// components/navbar.tsx (Updated)
"use client";

import { Bell, Coins, Menu, X } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { NotificationDropdown } from "./notification-dropdown";
import { useNotificationStore } from "../../stores/notification-store";

interface NavbarProps {
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
}

export function Navbar({ onSidebarToggle, isSidebarOpen }: NavbarProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const [coinBalance] = useState(150);
  const [mounted, setMounted] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { unreadCount } = useNotificationStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50  backdrop-blur-md 
                   
                  transition-all duration-300 ease-in-out"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Sidebar Toggle */}
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg text-gray-600 dark:text-white/70 
                     hover:text-gray-900 dark:hover:text-white 
                     hover:bg-gray-100 dark:hover:bg-white/10 
                     transition-all duration-300 ease-in-out"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Center - Sparta Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="flex items-center space-x-2 group">
              <div
                className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg 
                            flex items-center justify-center group-hover:scale-105 
                            transition-all duration-300 ease-in-out"
              >
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1
                className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white 
                           group-hover:text-gray-700 dark:group-hover:text-gray-300 
                           transition-all duration-300 ease-in-out hidden sm:block"
              >
                Sparta
              </h1>
            </Link>
          </div>

          {/* Right Side - Coins, Bell, User */}
          <div className="flex items-center space-x-3">
            {mounted && (
              <>
                {/* Coins */}
                <div
                  className="flex items-center space-x-2 bg-gray-100 dark:bg-white/10 
                              rounded-full px-3 py-2 border border-gray-200 dark:border-white/20 
                              transition-all duration-300 ease-in-out"
                >
                  <Coins className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                  <span className="text-gray-900 dark:text-white font-medium text-sm">
                    {coinBalance}
                  </span>
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative p-2 rounded-lg text-gray-600 dark:text-white/70 
                             hover:text-gray-900 dark:hover:text-white 
                             hover:bg-gray-100 dark:hover:bg-white/10 
                             transition-all duration-300 ease-in-out"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 bg-red-500 text-white 
                                 text-xs font-bold rounded-full h-5 w-5 flex items-center 
                                 justify-center animate-pulse"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <NotificationDropdown
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                  />
                </div>
              </>
            )}

            {/* User Profile */}
            {isSignedIn && mounted ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p
                    className="text-gray-900 dark:text-white font-medium text-sm 
                               transition-colors duration-300 ease-in-out"
                  >
                    {user?.firstName || user?.username}
                  </p>
                  <p
                    className="text-gray-600 dark:text-white/60 text-xs 
                               transition-colors duration-300 ease-in-out"
                  >
                    Athlete
                  </p>
                </div>
                <UserButton
                  appearance={{ variables: { colorPrimary: "#ef4444" } }}
                />
              </div>
            ) : (
              <Link
                href="/auth/sign-in"
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white 
                         px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg 
                         hover:shadow-red-500/25 transition-all duration-300 ease-in-out"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
