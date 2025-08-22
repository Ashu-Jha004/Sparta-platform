// components/ui/progress-indicator.tsx
"use client";

import React from "react";
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
  completedSteps?: number[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps = [],
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="relative flex items-center justify-center">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  completedSteps.includes(index)
                    ? "bg-green-500 border-green-500 text-white"
                    : index === currentStep
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                }`}
              >
                {completedSteps.includes(index) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
            </div>

            {/* Step Label */}
            <div className="ml-3 flex-1">
              <p
                className={`text-sm font-medium transition-colors duration-300 ${
                  index === currentStep
                    ? "text-red-500 dark:text-red-400"
                    : completedSteps.includes(index)
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={`h-0.5 transition-colors duration-300 ${
                    completedSteps.includes(index)
                      ? "bg-green-500"
                      : index < currentStep
                      ? "bg-red-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
