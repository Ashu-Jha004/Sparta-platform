// components/simple-theme-toggle.tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-gray-500 dark:text-gray-400 
                 transition-all duration-300 ease-in-out"
        disabled
      >
        <Sun className="h-4 w-4 transition-all duration-300 ease-in-out" />
      </Button>
    );
  }

  const toggleTheme = () => {
    // Add a small delay to allow CSS transitions to be visible
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 text-gray-500 dark:text-gray-400 
               hover:text-gray-900 dark:hover:text-white 
               hover:bg-gray-100 dark:hover:bg-gray-800 
               transition-all duration-300 ease-in-out
               hover:scale-105 active:scale-95"
    >
      <Sun
        className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 ease-in-out 
                    dark:-rotate-90 dark:scale-0"
      />
      <Moon
        className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 ease-in-out 
                     dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
