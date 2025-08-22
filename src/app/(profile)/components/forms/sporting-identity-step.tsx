// components/forms/sporting-identity-step.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trophy, Users, FileText } from "lucide-react";
import {
  sportingIdentitySchema,
  SportingIdentityData,
} from "../../../../../schemas/sporting-identity-schema";
import { useProfileCreationStore } from "../../../../../stores/profile-creation-store";
import { FormContainer } from "../ui/form-container";
import { MultiSelect } from "../ui/multi-select";
import { SPORTS_LIST } from "../../../../../types/athlete-profile";

interface SportingIdentityStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const SportingIdentityStep: React.FC<SportingIdentityStepProps> = ({
  onNext,
  onBack,
}) => {
  const { formData, updateFormData } = useProfileCreationStore();
  const lastSavedData = useRef<string>(""); // Add this ref

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<SportingIdentityData>({
    resolver: zodResolver(sportingIdentitySchema),
    defaultValues: {
      primarySport: formData.primarySport || "",
      otherSports: formData.otherSports ?? [],
      bio: formData.bio || "",
    },
    mode: "onChange",
  });

  const watchedValues = watch();
  const selectedPrimarySport = watchedValues.primarySport;

  // Filter out primary sport from other sports options
  const otherSportsOptions = SPORTS_LIST.filter(
    (sport) => sport !== selectedPrimarySport
  );

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

  // Remove primary sport from other sports if it gets selected
  useEffect(() => {
    if (
      selectedPrimarySport &&
      watchedValues.otherSports?.includes(selectedPrimarySport)
    ) {
      const filteredOtherSports = watchedValues.otherSports.filter(
        (sport) => sport !== selectedPrimarySport
      );
      setValue("otherSports", filteredOtherSports);
    }
  }, [selectedPrimarySport, watchedValues.otherSports, setValue]);

  const onSubmit: SubmitHandler<SportingIdentityData> = (
    data: SportingIdentityData
  ) => {
    updateFormData(data);
    onNext();
  };

  const characterCount = watchedValues.bio?.length || 0;
  const maxCharacters = 500;

  return (
    <FormContainer
      title="Sporting Identity"
      description="Tell us about your athletic interests and background"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Primary Sport */}
        <div>
          <label
            htmlFor="primarySport"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            Primary Sport *
          </label>
          <select
            id="primarySport"
            {...register("primarySport")}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-red-500 focus:border-red-500 
                     transition-colors duration-200"
          >
            <option value="">Select your primary sport</option>
            {SPORTS_LIST.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Choose the sport you're most passionate about or skilled in
          </p>
          {errors.primarySport && (
            <p className="text-red-500 text-sm mt-1">
              {errors.primarySport.message}
            </p>
          )}
        </div>

        {/* Additional Sports */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Additional Sports (Optional)
          </label>
          <Controller
            name="otherSports"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={otherSportsOptions}
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Select additional sports you practice"
                maxSelections={5}
                className="w-full"
              />
            )}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Select up to 5 additional sports you practice or have experience
            with
          </p>
          {errors.otherSports && (
            <p className="text-red-500 text-sm mt-1">
              {errors.otherSports.message}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Athletic Bio (Optional)
          </label>
          <textarea
            id="bio"
            {...register("bio")}
            rows={4}
            placeholder="Tell us about your athletic journey, achievements, goals, or what drives your passion for sports..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-red-500 focus:border-red-500 
                     transition-colors duration-200 resize-none"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Share your story - what makes you unique as an athlete?
            </p>
            <p
              className={`text-xs ${
                characterCount > maxCharacters
                  ? "text-red-500"
                  : characterCount > maxCharacters * 0.8
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {characterCount}/{maxCharacters}
            </p>
          </div>
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
          )}
        </div>

        {/* Selected Sports Summary */}
        {(selectedPrimarySport ||
          (watchedValues.otherSports &&
            watchedValues.otherSports.length > 0)) && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Your Sports Profile
            </h4>

            {selectedPrimarySport && (
              <div className="mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Primary Sport
                </span>
                <div
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm 
                               bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 
                               border border-red-200 dark:border-red-700 ml-2"
                >
                  <Trophy className="w-3 h-3 mr-1" />
                  {selectedPrimarySport}
                </div>
              </div>
            )}

            {watchedValues.otherSports &&
              watchedValues.otherSports.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Additional Sports ({watchedValues.otherSports.length})
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {watchedValues.otherSports.map((sport) => (
                      <span
                        key={sport}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                               bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 
                               border border-blue-200 dark:border-blue-700"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

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
            Continue to Social Info
          </button>
        </div>
      </form>
    </FormContainer>
  );
};

export default SportingIdentityStep;
