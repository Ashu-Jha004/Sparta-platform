// components/forms/personal-info-step.tsx (VALIDATION FIXED)
"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Mail, MapPin, User } from "lucide-react";
import {
  personalInfoSchema,
  PersonalInfoData,
} from "../../../../../schemas/personal-info-schema";
import { useProfileCreationStore } from "../../../../../stores/profile-creation-store";
import { FormContainer } from "../ui/form-container";
import { ImageUpload } from "../ui/image-upload";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const;

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "South Korea",
  "Brazil",
  "India",
  "China",
  "Mexico",
  "Spain",
  "Italy",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "New Zealand",
  "South Africa",
] as const;

interface PersonalInfoStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  onNext,
  onBack,
}) => {
  const { formData, updateFormData } = useProfileCreationStore();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: formData.fullName || "",
      athleticName: formData.athleticName || "",
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: formData.gender || undefined,
      profilePhotoUrl: formData.profilePhotoUrl || "",
      location: {
        city: formData.location?.city || "",
        country: formData.location?.country || "",
      },
      email: formData.email || "",
    },
    mode: "onChange", // Validate immediately on change
  });

  const watchedValues = watch();

  // FIX: Debounced auto-save only - no validation interference
  // useEffect(() => {
  //   // Clear previous timeout
  //   if (saveTimeoutRef.current) {
  //     clearTimeout(saveTimeoutRef.current);
  //   }

  //   // Debounced save to store (for persistence only)
  //   saveTimeoutRef.current = setTimeout(() => {
  //     console.log("💾 Auto-saving form data:", watchedValues);
  //     updateFormData(watchedValues);
  //   }, 1000); // Longer debounce to avoid interference

  //   return () => {
  //     if (saveTimeoutRef.current) {
  //       clearTimeout(saveTimeoutRef.current);
  //     }
  //   };
  // }, [watchedValues, updateFormData]);

  // FIX: Submit only when form is valid
  const onSubmit = (data: PersonalInfoData) => {
    console.log("📤 Form submitted with data:", data);

    // Save to store immediately on submit
    updateFormData(data);

    // Proceed to next step
    onNext();
  };

  return (
    <FormContainer
      title="Personal Information"
      description="Let's start with the basics about you"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* FIX: Use Controller for ImageUpload - ensures proper validation sync */}
        <div className="flex flex-col items-center mb-8">
          <Controller
            name="profilePhotoUrl"
            control={control}
            render={({ field }) => (
              <ImageUpload
                value={field.value || ""}
                onChange={(url) => {
                  console.log("📸 Controller onChange called with:", url); // Debug onChange
                  field.onChange(url);
                }}
                className="w-full max-w-md"
                maxSize={5}
                accept="image/*"
                onError={(error) => console.error("Upload error:", error)}
              />
            )}
          />

          {/* Enhanced error display */}
          {errors.profilePhotoUrl && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                ❌ {errors.profilePhotoUrl.message}
              </p>
            </div>
          )}

          {/* Debug info */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
              <div>Photo URL: {watchedValues.profilePhotoUrl || "None"}</div>
              <div>Valid: {watchedValues.profilePhotoUrl ? "✅" : "❌"}</div>
              <div>Form Valid: {isValid ? "✅" : "❌"}</div>
              <div>Error: {errors.profilePhotoUrl?.message || "None"}</div>
            </div>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <User className="w-4 h-4 inline mr-2" />
            Full Legal Name *
          </label>
          <input
            id="fullName"
            {...register("fullName")}
            type="text"
            placeholder="e.g., John Michael Smith"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-red-500 focus:border-red-500 
                     transition-colors duration-200"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Athletic Name */}
        <div>
          <label
            htmlFor="athleticName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <User className="w-4 h-4 inline mr-2" />
            Athletic/Display Name (Optional)
          </label>
          <input
            id="athleticName"
            {...register("athleticName")}
            type="text"
            placeholder="e.g., Lightning Mike, The Ace"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-red-500 focus:border-red-500 
                     transition-colors duration-200"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This will be shown to other athletes. Leave blank to use your full
            name.
          </p>
        </div>

        {/* Date of Birth and Gender Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <CalendarDays className="w-4 h-4 inline mr-2" />
              Date of Birth *
            </label>
            <input
              id="dateOfBirth"
              {...register("dateOfBirth", {
                setValueAs: (v) => (v ? new Date(v) : undefined),
              })}
              type="date"
              max={
                new Date(Date.now() - 13 * 365 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0]
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 
                       transition-colors duration-200"
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Gender *
            </label>
            <select
              id="gender"
              {...register("gender")}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 
                       transition-colors duration-200"
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>
        </div>

        {/* Location Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              City *
            </label>
            <input
              id="city"
              {...register("location.city")}
              type="text"
              placeholder="e.g., Los Angeles"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 
                       transition-colors duration-200"
            />
            {errors.location?.city && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.city.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Country *
            </label>
            <select
              id="country"
              {...register("location.country")}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 
                       transition-colors duration-200"
            >
              <option value="">Select country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.location?.country && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.country.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </label>
          <input
            id="email"
            {...register("email")}
            type="email"
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-red-500 focus:border-red-500 
                     transition-colors duration-200"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            We'll use this to send important updates about your account.
          </p>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                       dark:hover:text-white transition-colors duration-200 font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center space-x-4">
            {/* Debug info */}
            {process.env.NODE_ENV === "development" && (
              <div className="text-xs text-gray-500">
                Valid: {isValid ? "✅" : "❌"} | Submitting:{" "}
                {isSubmitting ? "⏳" : "✅"}
              </div>
            )}

            {/* FIX: Button now only uses React Hook Form validation */}
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 
                         ${
                           isValid && !isSubmitting
                             ? "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-red-500/25 hover:scale-105"
                             : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                         }`}
            >
              {isSubmitting ? "Validating..." : "Continue to Sport Info"}
            </button>
          </div>
        </div>
      </form>
    </FormContainer>
  );
};

export default PersonalInfoStep;
