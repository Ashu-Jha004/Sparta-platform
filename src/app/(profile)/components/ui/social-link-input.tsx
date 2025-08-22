// components/ui/social-link-input.tsx
"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Music,
  Twitch,
} from "lucide-react";

interface SocialPlatform {
  name: string;
  placeholder: string;
  prefix?: string;
  icon: React.ReactNode;
  baseUrl?: string;
  color: string;
}

const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  instagram: {
    name: "Instagram",
    placeholder: "username",
    prefix: "@",
    icon: <Instagram className="w-5 h-5" />,
    baseUrl: "https://instagram.com/",
    color: "text-pink-500",
  },
  twitter: {
    name: "Twitter/X",
    placeholder: "username",
    prefix: "@",
    icon: <Twitter className="w-5 h-5" />,
    baseUrl: "https://twitter.com/",
    color: "text-blue-500",
  },
  youtube: {
    name: "YouTube",
    placeholder: "https://youtube.com/channel/...",
    icon: <Youtube className="w-5 h-5" />,
    color: "text-red-500",
  },
  tiktok: {
    name: "TikTok",
    placeholder: "username",
    prefix: "@",
    icon: <Music className="w-5 h-5" />,
    baseUrl: "https://tiktok.com/@",
    color: "text-gray-900 dark:text-white",
  },
  twitch: {
    name: "Twitch",
    placeholder: "username",
    icon: <Twitch className="w-5 h-5" />,
    baseUrl: "https://twitch.tv/",
    color: "text-purple-500",
  },
};

interface SocialLinkInputProps {
  platform: keyof typeof SOCIAL_PLATFORMS;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const SocialLinkInput: React.FC<SocialLinkInputProps> = ({
  platform,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const socialPlatform = SOCIAL_PLATFORMS[platform];

  if (!socialPlatform) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Auto-remove @ prefix for username-based platforms
    if (socialPlatform.prefix === "@" && inputValue.startsWith("@")) {
      inputValue = inputValue.slice(1);
    }

    onChange(inputValue);
  };

  const getPreviewUrl = () => {
    if (!value || !socialPlatform.baseUrl) return null;

    const cleanValue = value.replace("@", "");
    return `${socialPlatform.baseUrl}${cleanValue}`;
  };

  const previewUrl = getPreviewUrl();

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 mb-2">
        <div className={socialPlatform.color}>{socialPlatform.icon}</div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {socialPlatform.name}
        </label>
      </div>

      <div className="relative">
        <div
          className={`flex items-center rounded-xl border transition-all duration-200 ${
            error
              ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
              : isFocused
              ? "border-red-500 ring-2 ring-red-500/20"
              : "border-gray-300 dark:border-gray-600 hover:border-red-400"
          }`}
        >
          {/* Platform Icon */}
          <div
            className="flex items-center justify-center w-12 h-12 rounded-l-xl 
                        bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600"
          >
            <div className={socialPlatform.color}>{socialPlatform.icon}</div>
          </div>

          {/* Prefix */}
          {socialPlatform.prefix && (
            <span className="px-3 text-gray-500 dark:text-gray-400 select-none">
              {socialPlatform.prefix}
            </span>
          )}

          {/* Input */}
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={socialPlatform.placeholder}
            disabled={disabled}
            className="flex-1 px-3 py-3 bg-transparent text-gray-900 dark:text-white 
                     placeholder-gray-500 dark:placeholder-gray-400 
                     focus:outline-none rounded-r-xl disabled:cursor-not-allowed"
          />

          {/* External Link Preview */}
          {previewUrl && (
            <div className="px-3">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors"
                title={`Visit ${socialPlatform.name} profile`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Preview URL */}
        {previewUrl && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            Preview: {previewUrl}
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default SocialLinkInput;
