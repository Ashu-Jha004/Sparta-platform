// components/layout-wrapper.tsx
"use client";

import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { Navbar } from "./Navbar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen w-full bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-black dark:to-slate-900 
                  transition-all duration-300 ease-in-out"
    >
      {/* Navbar */}
      <Navbar
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Blurred Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Simple overlay */}
      {isSidebarOpen && (
        <div className="fixed top-16 left-0 bottom-0 w-64 z-50">
          <AppSidebar />
        </div>
      )}

      {/* Main Content - Always full width */}
      <main className="pt-16 w-full">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
