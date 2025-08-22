// components/ui/form-container.tsx
"use client";

import React from "react";

interface FormContainerProps {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`w-full max-w-2xl mx-auto p-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
