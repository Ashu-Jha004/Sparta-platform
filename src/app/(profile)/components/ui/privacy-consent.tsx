// components/ui/privacy-consent.tsx
"use client";

import React from "react";
import { Shield, ExternalLink, Check } from "lucide-react";

interface PrivacyConsentProps {
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}

export const PrivacyConsent: React.FC<PrivacyConsentProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <Shield className="w-6 h-6 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Privacy & Terms
        </h3>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Your Privacy Matters
        </h4>

        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p>
            By creating your Sparta profile, you agree to our data handling
            practices:
          </p>

          <ul className="space-y-2 ml-4">
            <li className="flex items-start">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0" />
              <span>
                Your profile information will be visible to other verified
                athletes
              </span>
            </li>
            <li className="flex items-start">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0" />
              <span>
                We'll use your data to match you with suitable opponents and
                opportunities
              </span>
            </li>
            <li className="flex items-start">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0" />
              <span>
                You can update your privacy settings anytime in your account
              </span>
            </li>
            <li className="flex items-start">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0" />
              <span>
                We never sell your personal information to third parties
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-red-600 dark:text-red-400 
                     hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            Privacy Policy
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>

          <a
            href="/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-red-600 dark:text-red-400 
                     hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            Terms of Service
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>

      {/* Consent Checkbox */}
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 
                   hover:shadow-md flex items-start space-x-4 ${
                     value
                       ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                       : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-red-300"
                   }`}
      >
        {/* Checkbox */}
        <div
          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center 
                        transition-all duration-200 ${
                          value
                            ? "bg-red-500 border-red-500"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        }`}
        >
          {value && <Check className="w-4 h-4 text-white" />}
        </div>

        {/* Text */}
        <div className="flex-1">
          <p
            className={`font-medium transition-colors ${
              value
                ? "text-red-700 dark:text-red-300"
                : "text-gray-900 dark:text-white"
            }`}
          >
            I agree to the Privacy Policy and Terms of Service
          </p>
          <p
            className={`text-sm mt-1 transition-colors ${
              value
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Required to create your Sparta athlete profile
          </p>
        </div>
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default PrivacyConsent;
