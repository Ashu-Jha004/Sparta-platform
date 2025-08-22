// components/ui/team-preference.tsx
"use client";

import React from 'react';
import { Users, UserX, Check } from 'lucide-react';

interface TeamOption {
  value: boolean;
  label: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}

const TEAM_OPTIONS: TeamOption[] = [
  {
    value: true,
    label: 'Yes, I\'m open to teams',
    description: 'Connect with other athletes and join competitive teams',
    icon: <Users className="w-6 h-6" />,
    benefits: [
      'Join competitive teams and leagues',
      'Network with like-minded athletes',
      'Participate in team challenges',
      'Access to team training sessions'
    ]
  },
  {
    value: false,
    label: 'No, I prefer individual competition',
    description: 'Focus on personal athletic development and solo challenges',
    icon: <UserX className="w-6 h-6" />,
    benefits: [
      'Individual challenges and rankings',
      'Personal performance tracking',
      'One-on-one competitions',
      'Self-paced athletic development'
    ]
  }
];

interface TeamPreferenceProps {
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  error?: string;
}

export const TeamPreference: React.FC<TeamPreferenceProps> = ({
  value,
  onChange,
  error
}) => {
  return (
    <div className="space-y-4">
      {TEAM_OPTIONS.map((option) => (
        <button
          key={option.value.toString()}
          type="button"
          onClick={() => onChange(option.value)}
          className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 
                     hover:shadow-lg group ${
            value === option.value
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-500/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-red-300'
          }`}
        >
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className={`flex-shrink-0 p-3 rounded-lg transition-colors ${
              value === option.value
                ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800/30'
                : 'text-gray-400 bg-gray-100 dark:bg-gray-700 group-hover:text-red-500'
            }`}>
              {option.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-semibold transition-colors ${
                  value === option.value
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {option.label}
                </h3>
                
                {/* Check Icon */}
                {value === option.value && (
                  <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full 
                                flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <p className={`text-sm mb-3 transition-colors ${
                value === option.value
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {option.description}
              </p>

              {/* Benefits List */}
              <ul className="space-y-1">
                {option.benefits.map((benefit, index) => (
                  <li key={index} className={`text-xs flex items-center transition-colors ${
                    value === option.value
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-400'
                  }`}>
                    <div className={`w-1 h-1 rounded-full mr-2 ${
                      value === option.value
                        ? 'bg-red-500'
                        : 'bg-gray-400'
                    }`} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </button>
      ))}
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default TeamPreference;
