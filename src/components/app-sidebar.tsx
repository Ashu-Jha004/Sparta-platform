// components/app-sidebar.tsx
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { SimpleThemeToggle } from "@/components/simple-theme-toggle";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Discover", url: "/discover", icon: Search },
  { title: "Matches", url: "/matches", icon: Calendar },
  { title: "Messages", url: "/messages", icon: Inbox },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <div
      className="h-full bg-white dark:bg-slate-900 
                  transition-colors duration-300 ease-in-out backdrop-blur-md 
                  border-r border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col justify-between h-full">
        {/* Main Navigation */}
        <div className="pt-4">
          <div className="px-4 mb-4">
            <h2 className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Navigation
            </h2>
          </div>

          <nav className="space-y-1 px-2">
            {items.map((item) => (
              <a
                key={item.title}
                href={item.url}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                         hover:bg-gray-100 dark:hover:bg-gray-800 
                         transition-all duration-300 ease-in-out rounded-lg group 
                         flex items-center space-x-3 p-3"
              >
                <item.icon
                  className="h-5 w-5 group-hover:scale-110 
                                   transition-all duration-300 ease-in-out"
                />
                <span className="font-medium transition-colors duration-300 ease-in-out">
                  {item.title}
                </span>
              </a>
            ))}
          </nav>
        </div>

        {/* Theme Toggle at Bottom */}
        <div
          className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700 
                      transition-colors duration-300 ease-in-out"
        >
          <div className="flex items-center justify-between">
            <span
              className="text-sm text-gray-500 dark:text-gray-400 
                           transition-colors duration-300 ease-in-out"
            >
              Theme
            </span>
            <SimpleThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
