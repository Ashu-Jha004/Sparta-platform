// components/ui/multi-select.tsx
"use client";

import React, { useState } from "react";
import { X, ChevronDown, Plus } from "lucide-react";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
  disabled?: boolean;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select options",
  maxSelections,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !value.includes(option)
  );

  const handleSelect = (option: string) => {
    if (maxSelections && value.length >= maxSelections) return;

    const newValue = [...value, option];
    onChange(newValue);
    setSearchTerm("");
  };

  const handleRemove = (option: string) => {
    const newValue = value.filter((item) => item !== option);
    onChange(newValue);
  };

  const canAddMore = !maxSelections || value.length < maxSelections;

  return (
    <div className={`relative ${className}`}>
      {/* Selected Items Display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((item) => (
          <span
            key={item}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm 
                     bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 
                     border border-red-200 dark:border-red-700"
          >
            {item}
            <button
              type="button"
              onClick={() => handleRemove(item)}
              className="ml-2 hover:text-red-600 dark:hover:text-red-300 transition-colors"
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Input/Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || !canAddMore}
          className={`w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between
                     transition-all duration-200 ${
                       disabled || !canAddMore
                         ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed"
                         : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-red-400 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                     }`}
        >
          <span
            className={
              value.length === 0 ? "text-gray-500 dark:text-gray-400" : ""
            }
          >
            {value.length === 0
              ? placeholder
              : `${value.length} sport${
                  value.length !== 1 ? "s" : ""
                } selected`}
          </span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && canAddMore && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <div
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 
                          border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-40 
                          max-h-60 overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search sports..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Options List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                    {searchTerm
                      ? "No sports found"
                      : "No more sports available"}
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-white 
                               hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors 
                               flex items-center justify-between group"
                    >
                      <span>{option}</span>
                      <Plus
                        className="h-4 w-4 text-gray-400 group-hover:text-red-500 
                                     transition-colors"
                      />
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Max selections notice */}
      {maxSelections && value.length >= maxSelections && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Maximum {maxSelections} sports selected
        </p>
      )}
    </div>
  );
};

export default MultiSelect;
