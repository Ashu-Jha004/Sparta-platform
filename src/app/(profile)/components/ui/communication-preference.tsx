// components/ui/communication-preference.tsx
"use client";

import React from "react";
import { Mail, Smartphone, Check } from "lucide-react";

interface CommunicationOption {
  value: "email" | "app";
  label: string;
  description: string;
  icon: React.ReactNode;
}

const COMMUNICATION_OPTIONS: CommunicationOption[] = [
  {
    value: "email",
    label: "Email",
    description: "Receive notifications and updates via email",
    icon: <Mail className="w-6 h-6" />,
  },
  {
    value: "app",
    label: "In-App Only",
    description: "Only receive notifications within the Sparta app",
    icon: <Smartphone className="w-6 h-6" />,
  },
];

interface CommunicationPreferenceProps {
  value: "email" | "app" | "";
  onChange: (value: "email" | "app") => void;
  error?: string;
}

export const CommunicationPreference: React.FC<
  CommunicationPreferenceProps
> = ({ value, onChange, error }) => {
  return (
    <div className="space-y-3">
      {COMMUNICATION_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 
                     hover:shadow-md group ${
                       value === option.value
                         ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                         : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-red-300"
                     }`}
        >
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div
              className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                value === option.value
                  ? "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800/30"
                  : "text-gray-400 bg-gray-100 dark:bg-gray-700 group-hover:text-red-500"
              }`}
            >
              {option.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3
                  className={`font-medium transition-colors ${
                    value === option.value
                      ? "text-red-700 dark:text-red-300"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {option.label}
                </h3>

                {/* Check Icon */}
                {value === option.value && (
                  <div
                    className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full 
                                flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <p
                className={`text-sm mt-1 transition-colors ${
                  value === option.value
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {option.description}
              </p>
            </div>
          </div>
        </button>
      ))}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CommunicationPreference;
