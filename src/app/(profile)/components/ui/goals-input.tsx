// components/ui/goals-input.tsx
"use client";

import React from 'react';
import { Target, Lightbulb } from 'lucide-react';

interface GoalsInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength: number;
  rows?: number;
  icon?: React.ReactNode;
  helpText?: string;
  error?: string;
}

export const GoalsInput: React.FC<GoalsInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 3,
  icon,
  helpText,
  error
}) => {
  const characterCount = value?.length || 0;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {icon && <span className="inline-flex items-center mr-2">{icon}</span>}
        {label}
      </label>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-red-500 focus:border-red-500 
                 transition-colors duration-200 resize-none
                 placeholder-gray-500 dark:placeholder-gray-400"
      />
      
      <div className="flex justify-between items-center">
        {helpText && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {helpText}
          </p>
        )}
        <p className={`text-xs ml-auto ${
          isOverLimit 
            ? 'text-red-500' 
            : isNearLimit 
            ? 'text-yellow-600 dark:text-yellow-400' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {characterCount}/{maxLength}
        </p>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default GoalsInput;
