// components/forms/social-communication-step.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Share2, MessageCircle, Globe } from "lucide-react";
import {
  socialCommunicationSchema,
  SocialCommunicationData,
} from "../../../../../schemas/social-communication-schema";
import { useProfileCreationStore } from "../../../../../stores/profile-creation-store";
import { FormContainer } from "../ui/form-container";
import { SocialLinkInput } from "../ui/social-link-input";
import { CommunicationPreference } from "../ui/communication-preference";

interface SocialCommunicationStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const SocialCommunicationStep: React.FC<
  SocialCommunicationStepProps
> = ({ onNext, onBack }) => {
  const { formData, updateFormData } = useProfileCreationStore();
  const lastSavedData = useRef<string>(""); // Add this ref

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<SocialCommunicationData>({
    resolver: zodResolver(socialCommunicationSchema),
    defaultValues: {
      socialLinks: {
        instagram: formData.socialLinks?.instagram || "",
        twitter: formData.socialLinks?.twitter || "",
        youtube: formData.socialLinks?.youtube || "",
        tiktok: formData.socialLinks?.tiktok || "",
        twitch: formData.socialLinks?.twitch || "",
      },
      website: formData.website || "",
      preferredCommunication: formData.preferredCommunication ?? undefined,
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  // Fixed auto-save with debounce and guard
  useEffect(() => {
    const currentDataString = JSON.stringify(watchedValues);

    if (
      currentDataString !== lastSavedData.current &&
      currentDataString !== "{}" &&
      currentDataString !== "null"
    ) {
      lastSavedData.current = currentDataString;

      const timeoutId = setTimeout(() => {
        updateFormData(watchedValues);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [watchedValues, updateFormData]);

  const onSubmit: SubmitHandler<SocialCommunicationData> = (data) => {
    // Clean up empty social links
    const cleanedSocialLinks = Object.entries(data.socialLinks || {}).reduce(
      (acc, [key, value]) => {
        if (value && value.trim()) {
          acc[key] = value.trim();
        }
        return acc;
      },
      {} as Record<string, string>
    );

    const cleanedData = {
      ...data,
      socialLinks:
        Object.keys(cleanedSocialLinks).length > 0
          ? cleanedSocialLinks
          : undefined,
      website: data.website?.trim() || undefined,
    };

    updateFormData(cleanedData);
    onNext();
  };

  const hasAnySocialLinks = Object.values(watchedValues.socialLinks || {}).some(
    (value) => value && value.trim()
  );

  return (
    <FormContainer
      title="Social & Communication"
      description="Connect with the Sparta community and set your preferences"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Social Links Section */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Share2 className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Social Profiles (Optional)
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Connect your social accounts to build your athlete profile and
            connect with others
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instagram */}
            <Controller
              name="socialLinks.instagram"
              control={control}
              render={({ field }) => (
                <SocialLinkInput
                  platform="instagram"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.socialLinks?.instagram?.message}
                />
              )}
            />

            {/* Twitter */}
            <Controller
              name="socialLinks.twitter"
              control={control}
              render={({ field }) => (
                <SocialLinkInput
                  platform="twitter"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.socialLinks?.twitter?.message}
                />
              )}
            />

            {/* YouTube */}
            <Controller
              name="socialLinks.youtube"
              control={control}
              render={({ field }) => (
                <SocialLinkInput
                  platform="youtube"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.socialLinks?.youtube?.message}
                />
              )}
            />

            {/* TikTok */}
            <Controller
              name="socialLinks.tiktok"
              control={control}
              render={({ field }) => (
                <SocialLinkInput
                  platform="tiktok"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.socialLinks?.tiktok?.message}
                />
              )}
            />

            {/* Twitch */}
            <Controller
              name="socialLinks.twitch"
              control={control}
              render={({ field }) => (
                <SocialLinkInput
                  platform="twitch"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.socialLinks?.twitch?.message}
                />
              )}
            />

            {/* Website */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Personal Website
                </label>
              </div>
              <input
                {...register("website")}
                type="url"
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-red-500 focus:border-red-500 
                         transition-colors duration-200"
              />
              {errors.website && (
                <p className="text-red-500 text-sm">{errors.website.message}</p>
              )}
            </div>
          </div>

          {/* Social Links Preview */}
          {hasAnySocialLinks && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Your Connected Profiles
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(watchedValues.socialLinks || {}).map(
                  ([platform, username]) => {
                    if (!username || !username.trim()) return null;

                    return (
                      <span
                        key={platform}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm 
                               bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 
                               border border-blue-200 dark:border-blue-700"
                      >
                        {platform}: @{username.replace("@", "")}
                      </span>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>

        {/* Communication Preferences */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Communication Preferences *
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            How would you like to receive notifications and updates from Sparta?
          </p>

          <Controller
            name="preferredCommunication"
            control={control}
            render={({ field }) => (
              <CommunicationPreference
                value={field.value}
                onChange={field.onChange}
                error={errors.preferredCommunication?.message}
              />
            )}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                     dark:hover:text-white transition-colors duration-200 font-medium
                     hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={!isValid}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 
                       ${
                         isValid
                           ? "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-red-500/25 hover:scale-105"
                           : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                       }`}
          >
            Continue to Goals
          </button>
        </div>
      </form>
    </FormContainer>
  );
};

export default SocialCommunicationStep;
