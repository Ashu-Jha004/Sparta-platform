// components/athlete-profile-wizard.tsx (Updated handleSubmit section)
"use client";

import React, { useEffect, useState } from "react";
import { ProgressIndicator } from "./ui/progress-indicator";
import { PersonalInfoStep } from "./forms/personal-info-step";
import { SportingIdentityStep } from "./forms/sporting-identity-step";
import { SocialCommunicationStep } from "./forms/social-communication-step";
import { GoalsPreferencesStep } from "./forms/goals-preferences-step";
import { ReviewSubmitStep } from "./forms/review-submit-step";
import {
  useProfileCreationStore,
  useProfileErrors,
  useProfileActions,
} from "../../../../stores/profile-creation-store";
import { FORM_STEPS } from "../../../../types/athlete-profile";
import { ProfileAPI, ProfileAPIError } from "../../../services/profile-api";
import { AthleteProfile } from "../../../../types/athlete-profile";

interface AthleteProfileWizardProps {
  onComplete?: (profileData: any) => void;
  onCancel?: () => void;
}

export const AthleteProfileWizard: React.FC<AthleteProfileWizardProps> = ({
  onComplete,
}) => {
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    formData,
    isStepValid,

    resetForm,
    isSubmitting,
    setSubmitting,
  } = useProfileCreationStore();

  const { errors, validationErrors, lastError, canRetry, retryCount } =
    useProfileErrors();

  const {
    addError,
    clearErrors,
    setValidationErrors,
    clearValidationErrors,
    incrementRetryCount,
    resetRetryCount,
  } = useProfileActions();

  const [mounted, setMounted] = useState(false);
  const [showRetryDialog, setShowRetryDialog] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get step titles for progress indicator
  const stepTitles = FORM_STEPS.map((step) => step.title);

  /**
   * Transform Zustand store data to API format
   */
  const transformFormDataForAPI = (data: Partial<AthleteProfile>) => {
    console.log("🔄 Original form data:", data);

    const apiData: any = {
      ...data,
    };

    // Handle date transformation
    if (data.dateOfBirth) {
      apiData.dateOfBirth =
        typeof data.dateOfBirth === "string"
          ? new Date(data.dateOfBirth)
          : data.dateOfBirth;
    }

    // CRITICAL FIX: Handle location transformation properly
    if (data.city && data.country) {
      console.log("🏠 Transforming location:", data.city, data.country);
      apiData.city = data.city || "";
      apiData.country = data.country || "";
      // Remove the nested location object
    } else {
      // Provide defaults if location is missing
      console.log("⚠️ No location data found, using empty defaults");
      apiData.city = "";
      apiData.country = "";
    }

    // Handle social links (ensure it's an object or null)
    if (data.socialLinks) {
      apiData.socialLinks = data.socialLinks;
    }

    // Handle arrays
    if (data.otherSports) {
      apiData.otherSports = Array.isArray(data.otherSports)
        ? data.otherSports
        : [];
    }

    // Convert enum values to match database format
    if (data.gender) {
      // Map frontend gender values to exactly match Prisma enum
      const genderMapping = {
        male: "male",
        female: "female",
        other: "other",
        "prefer-not-to-say": "prefer_not_to_say",
        prefer_not_to_say: "prefer_not_to_say",
      };

      apiData.gender = genderMapping[data.gender] || data.gender;
      console.log(`🎯 Gender mapping: ${data.gender} -> ${apiData.gender}`);
    }

    // Handle communication method enum
    if (data.preferredCommunication) {
      // Ensure it matches the enum exactly
      apiData.preferredCommunication =
        data.preferredCommunication === "email" ? "email" : "app";
    }

    console.log("✅ Transformed API data:", apiData);
    return apiData;
  };

  /**
   * Main submission handler with comprehensive error handling
   */
  const handleSubmit = async (): Promise<void> => {
    console.log("🚀 Starting profile submission...");

    // Clear previous errors
    clearErrors();
    clearValidationErrors();
    setSubmitting(true);

    try {
      // Transform form data for API
      const apiData = transformFormDataForAPI(formData);

      console.log("📤 Submitting to API:", apiData);

      // Call the API to create/update profile
      const createdProfile = await ProfileAPI.upsertProfile(apiData);

      console.log("✅ Profile created successfully:", createdProfile);

      // Verify the profile was saved by fetching it back
      console.log("🔍 Verifying profile was saved...");
      const verifiedProfile = await ProfileAPI.getProfile();

      if (!verifiedProfile) {
        throw new ProfileAPIError(
          500,
          "VERIFICATION_FAILED",
          "Profile creation could not be verified"
        );
      }

      console.log("✅ Profile verified successfully:", verifiedProfile);

      // Reset retry count on success
      resetRetryCount();

      // Transform response back to frontend format for consistency
      const responseData = {
        ...verifiedProfile,

        city: verifiedProfile.city,
        country: verifiedProfile.country,

        // Convert back to frontend enum format
        gender:
          verifiedProfile.gender === "prefer_not_to_say"
            ? "prefer-not-to-say"
            : verifiedProfile.gender,
      };

      // Call completion handler with verified profile data
      onComplete?.(responseData);

      // Reset form after successful submission
      resetForm();
    } catch (error) {
      console.error("❌ Profile submission failed:", error);

      if (error instanceof ProfileAPIError) {
        // Handle different types of API errors
        await handleAPIError(error);
      } else {
        // Handle unexpected errors
        addError({
          code: "UNEXPECTED_ERROR",
          message: "An unexpected error occurred. Please try again.",
          retryable: true,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle different types of API errors with appropriate user feedback
   */
  const handleAPIError = async (error: ProfileAPIError): Promise<void> => {
    console.log("🔧 Handling API error:", error);

    // Handle validation errors
    if (ProfileAPI.isValidationError(error) && error.details) {
      console.log("📝 Setting validation errors:", error.details);
      setValidationErrors(error.details);

      // Go back to review step to show validation errors
      setCurrentStep(4); // Review step

      addError({
        code: error.code,
        message: "Please fix the validation errors and try again.",
        retryable: false,
      });
      return;
    }

    // Handle authentication errors
    if (ProfileAPI.isAuthError(error)) {
      addError({
        code: error.code,
        message: "Authentication failed. Please sign out and sign back in.",
        retryable: false,
      });
      return;
    }

    // Handle server errors (retryable)
    if (ProfileAPI.isServerError(error)) {
      const isRetryable = canRetry;

      addError({
        code: error.code,
        message: isRetryable
          ? `Server error occurred. You can retry (${
              retryCount + 1
            }/3 attempts).`
          : "Server error occurred. Please try again later.",
        retryable: isRetryable,
      });

      // Show retry dialog for server errors
      if (isRetryable) {
        setShowRetryDialog(true);
      }
      return;
    }

    // Handle other errors
    addError({
      code: error.code,
      message: error.message || "An error occurred during profile creation.",
      retryable: true,
    });
  };

  /**
   * Retry submission after error
   */
  const handleRetry = async (): Promise<void> => {
    console.log("🔁 Retrying profile submission...");

    incrementRetryCount();
    setShowRetryDialog(false);

    // Clear previous errors before retry
    clearErrors();

    // Retry the submission
    await handleSubmit();
  };

  /**
   * Cancel retry and go back to review step
   */
  const handleCancelRetry = (): void => {
    console.log("❌ Cancelling retry, going back to review");
    setShowRetryDialog(false);
    setCurrentStep(4); // Go back to review step
  };

  // Handle navigation
  const handleNext = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      nextStep();
    } else {
      // Final step - submit profile
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      previousStep();
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep
            onNext={handleNext}
            onBack={currentStep > 0 ? handleBack : undefined}
          />
        );

      case 1:
        return <SportingIdentityStep onNext={handleNext} onBack={handleBack} />;

      case 2:
        return (
          <SocialCommunicationStep onNext={handleNext} onBack={handleBack} />
        );

      case 3:
        return <GoalsPreferencesStep onNext={handleNext} onBack={handleBack} />;

      case 4:
        return (
          <ReviewSubmitStep
            formData={formData}
            onBack={handleBack}
            onSubmit={handleSubmit}
            errors={errors}
            validationErrors={validationErrors}
            isSubmitting={isSubmitting}
          />
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Step not found
            </h2>
            <button
              onClick={() => setCurrentStep(0)}
              className="bg-red-500 text-white px-6 py-2 rounded-lg"
            >
              Start Over
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Indicator */}
        <ProgressIndicator
          steps={stepTitles}
          currentStep={currentStep}
          completedSteps={Array.from({ length: currentStep }, (_, i) => i)}
        />

        {/* Current Step Content */}
        <div className="mt-8">{renderCurrentStep()}</div>

        {/* Retry Dialog */}
        {showRetryDialog && lastError && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Submission Failed
              </h3>
              <p className="text-gray-600 mb-6">{lastError.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Retrying..." : "Retry"}
                </button>
                <button
                  onClick={handleCancelRetry}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm max-w-md">
            <h4 className="font-bold mb-2">Debug Info:</h4>
            <p>
              Current Step: {currentStep + 1}/{FORM_STEPS.length}
            </p>
            <p>Step Valid: {isStepValid(currentStep) ? "✅" : "❌"}</p>
            <p>Form Data Keys: {Object.keys(formData).length}</p>
            <p>Submitting: {isSubmitting ? "⏳" : "✅"}</p>
            <p>Errors: {errors.length}</p>
            <p>Validation Errors: {validationErrors.length}</p>
            <p>Can Retry: {canRetry ? "✅" : "❌"}</p>
            <p>Retry Count: {retryCount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AthleteProfileWizard;
