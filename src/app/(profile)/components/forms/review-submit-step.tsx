// src/components/forms/review-submit-step.tsx
"use client";

import React from "react";
import {
  Check,
  Edit,
  AlertCircle,
  User,
  Trophy,
  Globe,
  Target,
} from "lucide-react";
import { AthleteProfile } from "../../../../../types/athlete-profile";
import { ErrorDisplay } from "../ui/Error-Display";
import { LoadingState } from "../ui/loading-state";
import { useProfileActions } from "../../../../../stores/profile-creation-store";

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ProfileError {
  id: string;
  code: string;
  message: string;
  field?: string;
  timestamp: Date;
  retryable: boolean;
}

interface ReviewSubmitStepProps {
  formData: Partial<AthleteProfile>;
  onBack: () => void;
  onSubmit: () => void;
  errors?: ProfileError[];
  validationErrors?: ValidationError[];
  isSubmitting?: boolean;
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({
  formData,
  onBack,
  onSubmit,
  errors = [],
  validationErrors = [],
  isSubmitting = false,
}) => {
  const { clearErrors, clearError } = useProfileActions();

  const hasErrors = errors.length > 0 || validationErrors.length > 0;

  // Format data for display
  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === "") {
      return "Not specified";
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "None";
    }
    if (typeof value === "object" && value.city && value.country) {
      return `${value.city}, ${value.country}`;
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return String(value);
  };

  // Group form data by sections
  const sections = [
    {
      title: "Personal Information",
      icon: User,
      fields: [
        { label: "Full Name", value: formData.fullName },
        { label: "Athletic Name", value: formData.athleticName },
        { label: "Date of Birth", value: formData.dateOfBirth },
        { label: "Gender", value: formData.gender },
        {
          label: "Location",
          value:
            formData.city && formData.country
              ? { city: formData.city, country: formData.country }
              : null,
        },
        { label: "Email", value: formData.email },
      ],
    },
    {
      title: "Sporting Identity",
      icon: Trophy,
      fields: [
        { label: "Primary Sport", value: formData.primarySport },
        { label: "Other Sports", value: formData.otherSports },
        { label: "Bio", value: formData.bio },
      ],
    },
    {
      title: "Social & Communication",
      icon: Globe,
      fields: [
        { label: "Instagram", value: formData.socialLinks?.instagram },
        { label: "Twitter", value: formData.socialLinks?.twitter },
        { label: "YouTube", value: formData.socialLinks?.youtube },
        { label: "TikTok", value: formData.socialLinks?.tiktok },
        { label: "Twitch", value: formData.socialLinks?.twitch },
        { label: "Website", value: formData.website },
        {
          label: "Preferred Communication",
          value: formData.preferredCommunication,
        },
      ],
    },
    {
      title: "Goals & Preferences",
      icon: Target,
      fields: [
        { label: "Short-term Goals", value: formData.shortTermGoals },
        { label: "Long-term Aspirations", value: formData.longTermAspirations },
        { label: "Open to Teams", value: formData.openToTeams },
        { label: "Privacy Consent", value: formData.privacyConsent },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Review Your Profile
        </h2>
        <p className="text-gray-600">
          Please review your information before submitting
        </p>
      </div>

      {/* Error Display */}
      {hasErrors && (
        <div className="mb-8">
          <ErrorDisplay
            errors={errors}
            validationErrors={validationErrors}
            onClearError={clearError}
            onClearAllErrors={clearErrors}
          />
        </div>
      )}

      {/* Loading State */}
      {isSubmitting && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <LoadingState message="Creating your athlete profile..." size="lg" />
        </div>
      )}

      {/* Profile Photo */}
      {formData.profilePhotoUrl && (
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={formData.profilePhotoUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Review Sections */}
      <div className="space-y-6 mb-8">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="bg-gray-50 rounded-xl p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <section.icon className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field, fieldIndex) => {
                const hasValue =
                  field.value !== null &&
                  field.value !== undefined &&
                  field.value !== "" &&
                  (!Array.isArray(field.value) || field.value.length > 0);

                // Check if this field has validation errors
                const fieldError = validationErrors.find((error) =>
                  error.field
                    .toLowerCase()
                    .includes(field.label.toLowerCase().replace(/\s+/g, ""))
                );

                return (
                  <div
                    key={fieldIndex}
                    className={`p-3 rounded-lg border ${
                      fieldError
                        ? "bg-red-50 border-red-200"
                        : hasValue
                        ? "bg-white border-gray-200"
                        : "bg-gray-100 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </p>
                        <p
                          className={`text-sm ${
                            fieldError
                              ? "text-red-700"
                              : hasValue
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          {formatValue(field.value)}
                        </p>
                        {fieldError && (
                          <p className="text-xs text-red-600 mt-1">
                            {fieldError.message}
                          </p>
                        )}
                      </div>
                      {fieldError && (
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-between">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back to Edit
        </button>

        <button
          onClick={onSubmit}
          disabled={isSubmitting || hasErrors}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <LoadingState size="sm" message="" />
              Creating Profile...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Create Profile
            </>
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          By creating your profile, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};
