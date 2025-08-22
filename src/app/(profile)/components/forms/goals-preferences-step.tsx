// components/forms/goals-preferences-step.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Target, Star, Users } from "lucide-react";
import {
  goalsPreferencesSchema,
  GoalsPreferencesData,
} from "../../../../../schemas/goals-preferences-schema";
import { useProfileCreationStore } from "../../../../../stores/profile-creation-store";
import { FormContainer } from "../ui/form-container";
import { GoalsInput } from "../ui/goals-input";
import { TeamPreference } from "../ui/team-preference";
import { PrivacyConsent } from "../ui/privacy-consent";

interface GoalsPreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const GoalsPreferencesStep: React.FC<GoalsPreferencesStepProps> = ({
  onNext,
  onBack,
}) => {
  const { formData, updateFormData, setSubmitting } = useProfileCreationStore();
  const lastSavedData = useRef<string>(""); // Add this ref

  const {
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<GoalsPreferencesData>({
    resolver: zodResolver(goalsPreferencesSchema),
    defaultValues: {
      shortTermGoals: formData.shortTermGoals || "",
      longTermAspirations: formData.longTermAspirations || "",
      openToTeams: formData.openToTeams ?? undefined,
      privacyConsent: formData.privacyConsent || false,
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

  const onSubmit = async (data: GoalsPreferencesData) => {
    try {
      setSubmitting(true);

      // Clean up empty goals
      const cleanedData = {
        ...data,
        shortTermGoals: data.shortTermGoals?.trim() || undefined,
        longTermAspirations: data.longTermAspirations?.trim() || undefined,
      };

      updateFormData(cleanedData);

      // Here you would typically submit to your API
      // await submitProfile(formData);

      onNext(); // Move to review/success step
    } catch (error) {
      console.error("Failed to submit profile:", error);
      // Handle error (show toast, etc.)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer
      title="Goals & Preferences"
      description="Tell us about your athletic aspirations and preferences"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Goals Section */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Target className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Athletic Goals
            </h3>
          </div>

          <div className="space-y-6">
            {/* Short-term Goals */}
            <Controller
              name="shortTermGoals"
              control={control}
              render={({ field }) => (
                <GoalsInput
                  label="Short-term Goals (Optional)"
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="What do you want to achieve in the next 6-12 months? (e.g., improve my tennis serve, run a 5K under 25 minutes, join a local basketball league...)"
                  maxLength={300}
                  rows={3}
                  icon={<Target className="w-4 h-4 text-orange-500" />}
                  helpText="Share your immediate athletic objectives"
                  error={errors.shortTermGoals?.message}
                />
              )}
            />

            {/* Long-term Aspirations */}
            <Controller
              name="longTermAspirations"
              control={control}
              render={({ field }) => (
                <GoalsInput
                  label="Long-term Aspirations (Optional)"
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="What are your bigger athletic dreams? (e.g., compete in amateur tournaments, become a certified coach, inspire others through fitness, represent my country...)"
                  maxLength={500}
                  rows={4}
                  icon={<Star className="w-4 h-4 text-yellow-500" />}
                  helpText="Dream big - what's your ultimate athletic vision?"
                  error={errors.longTermAspirations?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Team Preferences */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Users className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Team Participation *
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you interested in joining teams or do you prefer individual
            competition?
          </p>

          <Controller
            name="openToTeams"
            control={control}
            render={({ field }) => (
              <TeamPreference
                value={field.value}
                onChange={field.onChange}
                error={errors.openToTeams?.message}
              />
            )}
          />
        </div>

        {/* Privacy Consent */}
        <div>
          <Controller
            name="privacyConsent"
            control={control}
            render={({ field }) => (
              <PrivacyConsent
                value={field.value}
                onChange={field.onChange}
                error={errors.privacyConsent?.message}
              />
            )}
          />
        </div>

        {/* Goals Summary */}
        {(watchedValues.shortTermGoals ||
          watchedValues.longTermAspirations) && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Your Athletic Journey
            </h4>

            {watchedValues.shortTermGoals && (
              <div className="mb-4">
                <h5 className="text-xs text-orange-600 dark:text-orange-400 uppercase tracking-wider font-medium mb-2">
                  Short-term Goals
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {watchedValues.shortTermGoals}
                </p>
              </div>
            )}

            {watchedValues.longTermAspirations && (
              <div>
                <h5 className="text-xs text-yellow-600 dark:text-yellow-400 uppercase tracking-wider font-medium mb-2">
                  Long-term Aspirations
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {watchedValues.longTermAspirations}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                     dark:hover:text-white transition-colors duration-200 font-medium
                     hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 
                       flex items-center space-x-2 ${
                         isValid && !isSubmitting
                           ? "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-red-500/25 hover:scale-105"
                           : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                       }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Profile...</span>
              </>
            ) : (
              <span>Complete Profile</span>
            )}
          </button>
        </div>
      </form>
    </FormContainer>
  );
};

export default GoalsPreferencesStep;
