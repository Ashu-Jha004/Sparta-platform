// components/athlete-profile-wizard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ProgressIndicator } from "./ui/progress-indicator";
import { PersonalInfoStep } from "./forms/personal-info-step";
import { SportingIdentityStep } from "./forms/sporting-identity-step";
import { SocialCommunicationStep } from "./forms/social-communication-step";
import { GoalsPreferencesStep } from "./forms/goals-preferences-step";
import { useProfileCreationStore } from "../../../../stores/profile-creation-store";
import { FORM_STEPS } from "../../../../types/athlete-profile";
import { ReviewSubmitStep } from "./forms/review-submit-step";
interface AthleteProfileWizardProps {
  onComplete?: (profileData: any) => void;
  onCancel?: () => void;
}

export const AthleteProfileWizard: React.FC<AthleteProfileWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    formData,
    isStepValid,
    canProceedToStep,
    resetForm,
    isSubmitting,
  } = useProfileCreationStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get step titles for progress indicator
  const stepTitles = FORM_STEPS.map((step) => step.title);

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

  const handleSubmit = async () => {
    try {
      // Here you would submit to your API
      console.log("Submitting profile data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Call completion handler
      onComplete?.(formData);

      // Reset form after successful submission
      resetForm();
    } catch (error) {
      console.error("Failed to submit profile:", error);
      // Handle error (show toast, etc.)
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (canProceedToStep(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  if (!mounted) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 
                    flex items-center justify-center"
      >
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AthleteProfileWizard;
