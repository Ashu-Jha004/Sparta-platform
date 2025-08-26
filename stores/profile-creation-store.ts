// src/stores/profile-creation-store.ts (Enhanced Version)
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AthleteProfile } from "../types/athlete-profile";

// Error types for better error handling
interface ProfileError {
  id: string;
  code: string;
  message: string;
  field?: string;
  timestamp: Date;
  retryable: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ProfileCreationState {
  // Form state
  currentStep: number;
  completedSteps: number[];
  formData: Partial<AthleteProfile>;
  isDirty: boolean;
  isSubmitting: boolean;

  // Error handling state
  errors: ProfileError[];
  validationErrors: ValidationError[];
  lastError: ProfileError | null;
  retryCount: number;

  // Actions
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  updateFormData: (data: Partial<AthleteProfile>) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;

  // Error handling actions
  addError: (error: Omit<ProfileError, "id" | "timestamp">) => void;
  clearErrors: () => void;
  clearError: (errorId: string) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  clearValidationErrors: () => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
  canRetry: () => boolean;

  // Step validation
  isStepValid: (step: number) => boolean;
  canProceedToStep: (step: number) => boolean;
}

export const useProfileCreationStore = create<ProfileCreationState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 0,
      completedSteps: [],
      formData: {},
      isDirty: false,
      isSubmitting: false,

      // Error state
      errors: [],
      validationErrors: [],
      lastError: null,
      retryCount: 0,

      // Step navigation
      setCurrentStep: (step) => {
        console.log("📍 Setting current step to:", step);
        set({ currentStep: step });
      },

      markStepCompleted: (step) => {
        console.log("✅ Marking step completed:", step);
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
        }));
      },

      // Form data management
      updateFormData: (data) => {
        console.log("💾 Updating form data:", data);
        set((state) => ({
          formData: { ...state.formData, ...data },
          isDirty: true,
        }));
      },

      nextStep: () => {
        const { currentStep, markStepCompleted } = get();
        console.log("⏭️ Moving to next step from:", currentStep);

        if (currentStep < 4) {
          // 0-indexed, max step is 4
          markStepCompleted(currentStep);
          set({ currentStep: currentStep + 1 });
        }
      },

      previousStep: () => {
        console.log("⏮️ Moving to previous step");
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        }));
      },

      resetForm: () => {
        console.log("🔄 Resetting form");
        set({
          currentStep: 0,
          completedSteps: [],
          formData: {},
          isDirty: false,
          isSubmitting: false,
          errors: [],
          validationErrors: [],
          lastError: null,
          retryCount: 0,
        });
      },

      setSubmitting: (submitting) => {
        console.log("⏳ Setting submitting:", submitting);
        set({ isSubmitting: submitting });
      },

      // Error handling methods
      addError: (errorData) => {
        const error: ProfileError = {
          id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          ...errorData,
        };

        console.log("❌ Adding error:", error);

        set((state) => ({
          errors: [...state.errors, error],
          lastError: error,
        }));
      },

      clearErrors: () => {
        console.log("🧹 Clearing all errors");
        set({
          errors: [],
          lastError: null,
          validationErrors: [],
        });
      },

      clearError: (errorId) => {
        console.log("🧹 Clearing error:", errorId);
        set((state) => ({
          errors: state.errors.filter((error) => error.id !== errorId),
          lastError: state.lastError?.id === errorId ? null : state.lastError,
        }));
      },

      setValidationErrors: (errors) => {
        console.log("📝 Setting validation errors:", errors);
        set({ validationErrors: errors });
      },

      clearValidationErrors: () => {
        console.log("🧹 Clearing validation errors");
        set({ validationErrors: [] });
      },

      incrementRetryCount: () => {
        set((state) => ({
          retryCount: state.retryCount + 1,
        }));
      },

      resetRetryCount: () => {
        set({ retryCount: 0 });
      },

      canRetry: () => {
        const { retryCount, lastError } = get();
        const maxRetries = 3;
        return retryCount < maxRetries && (lastError?.retryable ?? false);
      },

      // Step validation
      isStepValid: (step) => {
        const { formData } = get();

        switch (step) {
          case 0: // Personal Information
            return !!(
              formData.fullName &&
              formData.dateOfBirth &&
              formData.gender &&
              formData.city &&
              formData.country &&
              formData.email &&
              formData.profilePhotoUrl
            );

          case 1: // Sporting Identity
            return !!formData.primarySport;

          case 2: // Social & Communication
            return !!formData.preferredCommunication;

          case 3: // Goals & Preferences
            return (
              formData.openToTeams !== undefined &&
              formData.privacyConsent === true
            );

          default:
            return false;
        }
      },

      canProceedToStep: (targetStep) => {
        const { completedSteps, isStepValid } = get();

        // Can always go back to completed steps
        if (completedSteps.includes(targetStep)) {
          return true;
        }

        // Can proceed to next step if current step is valid
        for (let i = 0; i < targetStep; i++) {
          if (!completedSteps.includes(i) && !isStepValid(i)) {
            return false;
          }
        }

        return true;
      },
    }),
    {
      name: "sparta-profile-creation",
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        // Don't persist errors - they should be fresh on reload
      }),
    }
  )
);

// Helper hooks for specific error scenarios
export const useProfileErrors = () => {
  const store = useProfileCreationStore();
  return {
    errors: store.errors,
    validationErrors: store.validationErrors,
    lastError: store.lastError,
    hasErrors: store.errors.length > 0 || store.validationErrors.length > 0,
    hasRetryableError: store.lastError?.retryable ?? false,
    canRetry: store.canRetry(),
    retryCount: store.retryCount,
  };
};

export const useProfileActions = () => {
  const store = useProfileCreationStore();
  return {
    addError: store.addError,
    clearErrors: store.clearErrors,
    clearError: store.clearError,
    setValidationErrors: store.setValidationErrors,
    clearValidationErrors: store.clearValidationErrors,
    incrementRetryCount: store.incrementRetryCount,
    resetRetryCount: store.resetRetryCount,
  };
};
