// src/components/ui/error-display.tsx
"use client";

import React from "react";
import { AlertCircle, X, RefreshCw } from "lucide-react";

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ProfileError {
  id: string;
  code: string;
  message: string;
  field?: string;
  timestamp: Date;
  retryable: boolean;
}

interface ErrorDisplayProps {
  errors?: ProfileError[];
  validationErrors?: ValidationError[];
  onClearError?: (errorId: string) => void;
  onClearAllErrors?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  errors = [],
  validationErrors = [],
  onClearError,
  onClearAllErrors,
  className = "",
}) => {
  const hasErrors = errors.length > 0 || validationErrors.length > 0;

  if (!hasErrors) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* General Errors */}
      {errors.map((error) => (
        <div
          key={error.id}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">
                  {error.message}
                </p>
                {error.field && (
                  <p className="text-xs text-red-600 mt-1">
                    Field: {error.field}
                  </p>
                )}
                {error.retryable && (
                  <div className="flex items-center gap-1 mt-2">
                    <RefreshCw className="h-3 w-3 text-red-600" />
                    <span className="text-xs text-red-600">
                      This error can be retried
                    </span>
                  </div>
                )}
              </div>
              {onClearError && (
                <button
                  onClick={() => onClearError(error.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Clear error"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-orange-800 mb-2">
                Please fix the following validation errors:
              </h4>
              <ul className="space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-orange-700">
                    <span className="font-medium">{error.field}:</span>{" "}
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Button */}
      {onClearAllErrors && hasErrors && (
        <div className="flex justify-end">
          <button
            onClick={onClearAllErrors}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear all errors
          </button>
        </div>
      )}
    </div>
  );
};
