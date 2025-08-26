// src/components/ui/loading-state.tsx
"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Processing...",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      <span className="text-gray-600 font-medium">{message}</span>
    </div>
  );
};
